// Mother Machine · il server del sito (Cloudflare Pages, "advanced mode": questo file sta nella cartella pubblicata e
// Cloudflare lo esegue sempre, prima delle pagine). Fa due cose sole, il resto sono le pagine statiche:
//  - POST /api/porta: la porta di LG. Il browser manda la sequenza dei bottoni; il codice giusto lo conosce solo il
//    server (segreto MM_DOOR_CODE su Cloudflare, mai nella repository). Giusto: un gettone firmato con MM_DOOR_KEY in
//    un cookie HttpOnly di 8 ore. Ogni tentativo costa quasi un secondo. GET dice solo se la porta e' montata.
//  - /lg/room: il back office si apre solo con quel gettone; senza, si torna a /lg.
const enc = new TextEncoder();

async function hmac(testo, chiave) {
  const k = await crypto.subtle.importKey('raw', enc.encode(chiave), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const firma = await crypto.subtle.sign('HMAC', k, enc.encode(testo));
  return [...new Uint8Array(firma)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// confronto senza scorciatoie: si confrontano le firme, sempre della stessa lunghezza
async function uguali(a, b, chiave) {
  const [x, y] = await Promise.all([hmac(a, chiave), hmac(b, chiave)]);
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return d === 0;
}

async function gettone(ore, chiave) {
  const scade = String(Date.now() + ore * 3600e3);
  return `${scade}.${await hmac(scade, chiave)}`;
}

async function valido(g, chiave) {
  const [scade, firma] = String(g).split('.');
  if (!scade || !firma || !(+scade > Date.now())) return false;
  return uguali(firma, await hmac(scade, chiave), chiave);
}

// il segreto si puo' scrivere come si vuole: "01-05-05-G", "01 05 05 G", "1-5-5-g"
const bottoni = (s) => (String(s).toUpperCase().match(/0?[1-5]|G/g) || []).map((b) => (b === 'G' ? 'G' : '0' + b.slice(-1))).join('-');

const json = (dati, init = {}) =>
  new Response(JSON.stringify(dati), { ...init, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...init.headers } });

async function porta(request, env) {
  const pronta = !!(env.MM_DOOR_CODE && env.MM_DOOR_KEY);
  if (request.method === 'GET') return json({ porta: true, pronta, cifre: bottoni(env.MM_DOOR_CODE || '').split('-').filter(Boolean).length });
  if (request.method !== 'POST') return json({ ok: false }, { status: 405 });
  if (!pronta) return json({ ok: false }, { status: 503 });
  let seq;
  try { ({ seq } = await request.json()) } catch { return json({ ok: false }, { status: 400 }) }
  if (!Array.isArray(seq) || seq.length < 1 || seq.length > 12 || !seq.every((x) => /^(0[1-5]|G)$/.test(x)))
    return json({ ok: false }, { status: 400 });
  await new Promise((r) => setTimeout(r, 800));
  if (!(await uguali(seq.join('-'), bottoni(env.MM_DOOR_CODE), env.MM_DOOR_KEY))) return json({ ok: false }, { status: 403 });
  const g = await gettone(8, env.MM_DOOR_KEY);
  return json({ ok: true }, { headers: { 'set-cookie': `mm_room=${g}; Path=/lg; Max-Age=28800; HttpOnly; Secure; SameSite=Strict` } });
}

async function stanza(request, env) {
  const c = /(?:^|;\s*)mm_room=([^;]+)/.exec(request.headers.get('cookie') || '');
  if (!(c && env.MM_DOOR_KEY && (await valido(c[1], env.MM_DOOR_KEY)))) return Response.redirect(new URL('/lg', request.url), 302);
  const r = await env.ASSETS.fetch(request);
  const out = new Response(r.body, r);
  out.headers.set('cache-control', 'no-store');
  out.headers.set('x-robots-tag', 'noindex');
  return out;
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/porta') return porta(request, env);
    if (pathname.startsWith('/lg/room')) return stanza(request, env);
    if (pathname === '/_worker.js') return new Response('Not found', { status: 404 });
    return env.ASSETS.fetch(request);
  },
};
