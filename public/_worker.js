// Mother Machine · il server del sito (Cloudflare Pages, "advanced mode": questo file sta nella cartella pubblicata e
// Cloudflare lo esegue sempre, prima delle pagine). Fa poche cose, il resto sono le pagine statiche:
//  - POST /api/porta: la porta di LG. Il browser manda la sequenza dei bottoni; il codice giusto lo conosce solo il
//    server (segreto MM_DOOR_CODE su Cloudflare, mai nella repository). Giusto: un gettone firmato con MM_DOOR_KEY in
//    un cookie HttpOnly di 8 ore. Ogni tentativo costa quasi un secondo. GET dice solo se la porta e' montata.
//  - /lg/room: il back office si apre solo con quel gettone; senza, si torna a /lg.
//  - /api/deadline/* e /lg/signs: il gioco DEADLINE (classifica, premio, approvazione delle insegne), piu' sotto.
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

// ---------------------------------------------------------------------------------------------------------------
// DEADLINE, il gioco del cabinato in LG: classifica, anti imbrogli, premio segreto (l'insegna) e la pagina /lg/signs
// dove Eso approva le insegne. Dati su D1 (binding DL_DB), loghi su R2 (binding DL_SIGNS), firma con MM_DL_KEY
// (se manca, MM_DOOR_KEY). Senza binding le rotte dicono 503 {offline:true} e il gioco usa la classifica locale.
// Ogni input e' ostile: tutto si controlla, tutto si escapa, le immagini sono solo PNG.
// ---------------------------------------------------------------------------------------------------------------
const DL = {
  partitaOre: 2, // il gettone vale per mandare il punteggio entro 2 ore dall'inizio
  premioOre: 48, // e per chiedere l'insegna entro 48 ore
  maxPunti: 5000, // tetto assoluto (una partita intera fa 900-1300)
  maxRitmo: 40, // punti al secondo, in media, al massimo
  maxPerKill: 20, // punti per nemico (con FLOW STATE) al massimo
  bonus: 1500, // bonus fuori dai nemici (boss, moneta, fine giornata) al massimo
  maxKillMin: 400, // nemici al minuto al massimo
  giornoMin: 8, // secondi minimi per giorno (i giorni veloci finiscono in 10-12 s)
  bossMin: 10, // secondi minimi per MONDAY dopo domenica
  durataMax: 3600,
  corpo: 8 * 1024,
  corpoPremio: 120 * 1024,
  pngMax: 80 * 1024,
  // tentativi per IP: [quanti, finestra in secondi]
  limiti: { start: [40, 600], submit: [20, 600], claim: [12, 3600], top: [120, 60], signs: [120, 60] },
};
const GIORNI = ['tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'mon'];
const TIPI = ['food', 'fashion', 'shop', 'beauty', 'hotel', 'services'];
// iniziali vietate (dopo aver tolto i numeri travestiti da lettere)
const BRUTTE = new Set(('ASS FUK FUC FCK FUX FUQ SEX CUM TIT DIC DIK DIX COK COC KKK NIG NGR NGA FAG FAP JIZ PIS POO ' +
  'CAZ CZZ PUT VAF MRD CUL PEN PNS VAG SUK SUC HOE NAZ KYS GAY XXX WTF STR TET ANO CLO CON BIT BCH').split(' '));

const chiaveDL = (env) => env.MM_DL_KEY || env.MM_DOOR_KEY || '';
const casuale = (n) => [...crypto.getRandomValues(new Uint8Array(n))].map((b) => b.toString(16).padStart(2, '0')).join('');
const fuori = (dati = {}) => json({ ok: false, offline: true, ...dati }, { status: 503 });
const no = (status, perche) => json({ ok: false, error: perche }, { status });

async function firmaRun(run, inizio, chiave) {
  return `${inizio}.${await hmac(`dl.${run}.${inizio}`, chiave)}`;
}

// -> l'ora d'inizio (ms) se il gettone e' giusto e non scaduto, altrimenti 0
async function leggiRun(run, token, ore, chiave) {
  if (!/^[a-f0-9]{32}$/.test(String(run)) || typeof token !== 'string' || token.length > 100) return 0;
  const [inizio, firma] = token.split('.');
  if (!/^\d{13}$/.test(inizio || '') || !/^[a-f0-9]{64}$/.test(firma || '')) return 0;
  const t = +inizio, ora = Date.now();
  if (t > ora + 60e3 || ora - t > ore * 3600e3) return 0;
  return (await uguali(firma, await hmac(`dl.${run}.${inizio}`, chiave), chiave)) ? t : 0;
}

// legge il corpo fino a max byte, poi smette: null se e' troppo grande
async function corpo(request, max) {
  const cl = +(request.headers.get('content-length') || 0);
  if (cl > max) return null;
  if (!request.body) return new Uint8Array(0);
  const r = request.body.getReader();
  const pezzi = [];
  let tot = 0;
  for (;;) {
    const { done, value } = await r.read();
    if (done) break;
    tot += value.byteLength;
    if (tot > max) { try { await r.cancel() } catch {} return null }
    pezzi.push(value);
  }
  const out = new Uint8Array(tot);
  let o = 0;
  for (const p of pezzi) { out.set(p, o); o += p.byteLength }
  return out;
}

async function corpoJson(request, max) {
  const b = await corpo(request, max);
  if (b === null) return { troppo: true };
  try {
    const d = JSON.parse(new TextDecoder().decode(b));
    return { d: d && typeof d === 'object' && !Array.isArray(d) ? d : null };
  } catch { return { d: null } }
}

const ipDi = (request) => request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || 'x';

// limite per IP su D1: una riga per (rotta, IP) con la finestra corrente; l'IP si salva solo come impronta
async function troppi(env, request, rotta, chiave) {
  const [quanti, fin] = DL.limiti[rotta];
  const ora = Math.floor(Date.now() / 1000);
  const win = ora - (ora % fin); // inizio della finestra, in secondi
  const k = `${rotta}:${(await hmac(ipDi(request), chiave)).slice(0, 20)}`;
  const r = await env.DL_DB.prepare(
    'INSERT INTO dl_rate (k, win, n) VALUES (?1, ?2, 1) ON CONFLICT(k) DO UPDATE SET n = CASE WHEN win = ?2 THEN n + 1 ELSE 1 END, win = ?2 RETURNING n'
  ).bind(k, win).first();
  // ogni tanto si buttano le finestre vecchie
  if (Math.random() < 0.02) await env.DL_DB.prepare('DELETE FROM dl_rate WHERE win < ?1').bind(ora - 7200).run().catch(() => {});
  return (r && r.n) > quanti;
}

function iniziali(s) {
  const v = String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (v.length !== 3) return '';
  const lettere = v.replace(/0/g, 'O').replace(/1/g, 'I').replace(/3/g, 'E').replace(/4/g, 'A').replace(/5/g, 'S').replace(/7/g, 'T').replace(/8/g, 'B');
  return BRUTTE.has(lettere) ? 'MMM' : v;
}

const giornoN = (d) => (typeof d === 'number' ? d : GIORNI.indexOf(String(d).toLowerCase()));
const intero = (x) => (Number.isFinite(x) && Math.floor(x) === x ? x : NaN);

// il punteggio e' possibile nel tempo giocato? -> '' se si', altrimenti il motivo
function plausibile(p, inizio) {
  const { score, day, duration, bossBeaten, events } = p;
  if (!(score >= 0 && score <= DL.maxPunti)) return 'score';
  if (!(day >= 0 && day <= 6)) return 'day';
  if (!(duration >= 3 && duration <= DL.durataMax)) return 'duration';
  const passati = (Date.now() - inizio) / 1000;
  if (duration > passati + 10) return 'clock';
  if (score > Math.max(50, duration * DL.maxRitmo)) return 'rate';
  if (duration < day * DL.giornoMin) return 'speed';
  if (bossBeaten && day !== 6) return 'boss';
  const e = events && typeof events === 'object' ? events : null;
  if (!e) return day > 0 || bossBeaten || score > 200 ? 'events' : '';
  const giorni = Array.isArray(e.days) ? e.days : [];
  const kills = Array.isArray(e.kills) ? e.kills : [];
  if (giorni.length > 7 || kills.length > Math.ceil(duration / 60) + 1) return 'events';
  // un giorno finito per ogni giorno passato: [secondi dall'inizio, punteggio a quel momento]
  if (giorni.length !== day) return 'days';
  let t0 = 0, s0 = 0;
  for (const g of giorni) {
    if (!Array.isArray(g) || g.length < 2) return 'days';
    const [t, s] = g;
    if (!(Number.isFinite(t) && Number.isFinite(s))) return 'days';
    if (t - t0 < DL.giornoMin || s < s0 || s > score || t > duration) return 'days';
    t0 = t; s0 = s;
  }
  if (bossBeaten) {
    if (!(Number.isFinite(e.boss) && e.boss - t0 >= DL.bossMin && e.boss <= duration + 1)) return 'boss';
  }
  let k = 0;
  for (const x of kills) {
    if (!(intero(x) >= 0 && x <= DL.maxKillMin)) return 'kills';
    k += x;
  }
  if (score > k * DL.maxPerKill + DL.bonus) return 'kills';
  return '';
}

const giornoData = (ms) => new Date(ms).toISOString().slice(0, 10);

async function classifica(env, n) {
  const { results } = await env.DL_DB.prepare(
    'SELECT initials, score, day, boss, created FROM dl_scores WHERE verified = 1 ORDER BY score DESC, created ASC LIMIT ?1'
  ).bind(n).all();
  return (results || []).map((r) => ({ initials: r.initials, score: r.score, day: GIORNI[r.day] || 'tue', boss: !!r.boss, date: giornoData(r.created) }));
}

// testo libero: niente caratteri di controllo, spazi compatti, lunghezza massima
const pulito = (s, max) => String(s ?? '').normalize('NFC').replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, '').replace(/\s+/g, ' ').trim().slice(0, max);

// il link: sito (http o https) o Instagram (@nome). -> url pulito o ''
function linkPulito(s) {
  let v = String(s || '').trim();
  if (!v || v.length > 200) return '';
  const ig = /^@([A-Za-z0-9._]{1,30})$/.exec(v);
  if (ig) return `https://www.instagram.com/${ig[1]}/`;
  if (!/^https?:\/\//i.test(v)) {
    if (/\s/.test(v) || !/^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+([/?#].*)?$/.test(v)) return '';
    v = 'https://' + v;
  }
  let u;
  try { u = new URL(v) } catch { return '' }
  if (!/^https?:$/.test(u.protocol) || u.username || u.password) return '';
  const h = u.hostname.toLowerCase();
  if (!h.includes('.') || /^[\d.]+$/.test(h) || h.includes(':') || h === 'localhost' || h.endsWith('.local')) return '';
  return u.href.slice(0, 200);
}

const chiaveNome = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
const chiaveLink = (u) => {
  try { const x = new URL(u); return (x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/+$/, '')).toLowerCase() } catch { return '' }
};

// PNG vero: firma, IHDR, misure ragionevoli
function pngBuono(b) {
  if (!b || b.byteLength < 33 || b.byteLength > DL.pngMax) return false;
  const firma = [137, 80, 78, 71, 13, 10, 26, 10];
  if (!firma.every((x, i) => b[i] === x)) return false;
  if (String.fromCharCode(b[12], b[13], b[14], b[15]) !== 'IHDR') return false;
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const w = dv.getUint32(16), h = dv.getUint32(20);
  return w >= 8 && h >= 8 && w <= 1024 && h <= 512;
}

function da64(s) {
  const v = String(s || '').replace(/^data:image\/png;base64,/, '');
  if (v.length > Math.ceil(DL.pngMax / 3) * 4 + 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(v)) return null;
  try {
    const bin = atob(v);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch { return null }
}

const rigaInsegna = (r) => ({ name: r.name, link: r.link, line: r.line, kind: r.kind, img: `/api/deadline/sign/${r.id}.png` });

async function deadline(request, env, pathname) {
  const metodo = request.method;
  const chiave = chiaveDL(env);
  if (!env.DL_DB || !chiave) return fuori();

  if (pathname === '/api/deadline/start') {
    if (metodo !== 'POST') return no(405, 'method');
    if (await troppi(env, request, 'start', chiave)) return no(429, 'slow down');
    const run = casuale(16);
    return json({ ok: true, run, token: await firmaRun(run, Date.now(), chiave) });
  }

  if (pathname === '/api/deadline/submit') {
    if (metodo !== 'POST') return no(405, 'method');
    const { d, troppo } = await corpoJson(request, DL.corpo);
    if (troppo) return no(413, 'too big');
    if (!d) return no(400, 'json');
    if (await troppi(env, request, 'submit', chiave)) return no(429, 'slow down');
    const inizio = await leggiRun(d.run, d.token, DL.partitaOre, chiave);
    if (!inizio) return no(403, 'token');
    const ini = iniziali(d.initials);
    if (!ini) return no(400, 'initials');
    const p = {
      score: intero(d.score), day: giornoN(d.day), duration: +d.duration, bossBeaten: d.bossBeaten === true, events: d.events,
    };
    const perche = plausibile(p, inizio);
    const ok = perche ? 0 : 1;
    try {
      await env.DL_DB.prepare(
        'INSERT INTO dl_scores (run, initials, score, day, boss, duration, created, verified, why) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)'
      ).bind(d.run, ini, ok ? p.score : 0, ok ? p.day : 0, ok && p.bossBeaten ? 1 : 0, Math.round(p.duration) || 0, Date.now(), ok, perche || null).run();
    } catch (e) {
      if (/UNIQUE|constraint/i.test(String(e && e.message))) return no(409, 'already sent');
      throw e;
    }
    const top = await classifica(env, 10);
    if (!ok) return json({ ok: false, verified: false, rank: null, top, error: 'implausible' }, { status: 422 });
    const sopra = await env.DL_DB.prepare('SELECT COUNT(*) AS n FROM dl_scores WHERE verified = 1 AND score > ?1').bind(p.score).first();
    return json({ ok: true, verified: true, rank: ((sopra && sopra.n) || 0) + 1, top, initials: ini });
  }

  if (pathname === '/api/deadline/top') {
    if (metodo !== 'GET') return no(405, 'method');
    const n = Math.max(1, Math.min(50, parseInt(new URL(request.url).searchParams.get('n'), 10) || 10));
    if (await troppi(env, request, 'top', chiave)) return no(429, 'slow down');
    return json({ ok: true, top: await classifica(env, n) }, { headers: { 'cache-control': 'public, max-age=30' } });
  }

  if (pathname === '/api/deadline/claim') {
    if (metodo !== 'POST') return no(405, 'method');
    if (!env.DL_SIGNS) return fuori();
    const ct = request.headers.get('content-type') || '';
    const b = await corpo(request, DL.corpoPremio);
    if (b === null) return no(413, 'too big');
    if (await troppi(env, request, 'claim', chiave)) return no(429, 'slow down');
    let d = {}, png = null;
    try {
      if (/^multipart\/form-data/i.test(ct)) {
        const f = await new Response(b, { headers: { 'content-type': ct } }).formData();
        for (const k of ['run', 'token', 'initials', 'business', 'link', 'line', 'kind', 'email']) d[k] = typeof f.get(k) === 'string' ? f.get(k) : '';
        const logo = f.get('logo') || f.get('logoPng');
        if (logo && typeof logo !== 'string') png = new Uint8Array(await logo.arrayBuffer());
      } else {
        d = JSON.parse(new TextDecoder().decode(b));
        if (!d || typeof d !== 'object') return no(400, 'json');
        png = da64(d.logoPng || d.logo);
      }
    } catch { return no(400, 'body') }
    const inizio = await leggiRun(d.run, d.token, DL.premioOre, chiave);
    if (!inizio) return no(403, 'token');
    const partita = await env.DL_DB.prepare('SELECT verified, boss, initials FROM dl_scores WHERE run = ?1').bind(d.run).first();
    if (!partita || !partita.verified || !partita.boss) return no(403, 'not a winner');
    if (!pngBuono(png)) return no(400, 'logo');
    const nome = pulito(d.business, 40);
    const riga = pulito(d.line, 60);
    const link = linkPulito(d.link);
    const tipo = TIPI.includes(d.kind) ? d.kind : '';
    const mail = String(d.email || '').trim().slice(0, 120);
    if (pulito(d.line, 1000).length > 60) return no(400, 'line');
    if (nome.length < 2) return no(400, 'business');
    if (!link) return no(400, 'link');
    if (!tipo) return no(400, 'kind');
    if (!/^[^\s@<>"']{1,64}@[^\s@<>"']+\.[A-Za-z]{2,}$/.test(mail)) return no(400, 'email');
    const kn = chiaveNome(nome), kl = chiaveLink(link);
    if (!kn) return no(400, 'business');
    const gia = await env.DL_DB.prepare(
      "SELECT 1 AS x FROM dl_signs WHERE status IN ('pending', 'approved') AND (name_key = ?1 OR link_key = ?2) LIMIT 1"
    ).bind(kn, kl).first();
    if (gia) return no(409, 'one sign per business');
    const id = casuale(12);
    try {
      await env.DL_DB.prepare(
        "INSERT INTO dl_signs (id, run, initials, name, name_key, link, link_key, line, kind, email, status, created) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 'pending', ?11)"
      ).bind(id, d.run, partita.initials, nome, kn, link, kl, riga, tipo, mail, Date.now()).run();
    } catch (e) {
      if (/UNIQUE|constraint/i.test(String(e && e.message))) return no(409, 'already claimed');
      throw e;
    }
    try {
      await env.DL_SIGNS.put(`signs/${id}.png`, png, { httpMetadata: { contentType: 'image/png' } });
    } catch (e) {
      await env.DL_DB.prepare('DELETE FROM dl_signs WHERE id = ?1').bind(id).run();
      throw e;
    }
    return json({ ok: true, pending: true });
  }

  if (pathname === '/api/deadline/signs') {
    if (metodo !== 'GET') return no(405, 'method');
    if (!env.DL_SIGNS) return fuori();
    if (await troppi(env, request, 'signs', chiave)) return no(429, 'slow down');
    const { results } = await env.DL_DB.prepare(
      "SELECT id, name, link, line, kind FROM dl_signs WHERE status = 'approved' ORDER BY decided DESC LIMIT 60"
    ).all();
    return json({ ok: true, signs: (results || []).map(rigaInsegna) }, { headers: { 'cache-control': 'public, max-age=60' } });
  }

  const img = /^\/api\/deadline\/sign\/([a-f0-9]{24})\.png$/.exec(pathname);
  if (img) {
    if (metodo !== 'GET' && metodo !== 'HEAD') return no(405, 'method');
    if (!env.DL_SIGNS) return fuori();
    const r = await env.DL_DB.prepare("SELECT id FROM dl_signs WHERE id = ?1 AND status = 'approved'").bind(img[1]).first();
    if (!r) return new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });
    return immagine(env, img[1], 'public, max-age=31536000, immutable');
  }

  if (pathname === '/api/deadline/approve' || pathname === '/api/deadline/reject') return decidi(request, env, pathname.endsWith('approve'));
  return no(404, 'not found');
}

async function immagine(env, id, cache) {
  const o = await env.DL_SIGNS.get(`signs/${id}.png`);
  if (!o) return new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });
  return new Response(o.body, {
    headers: {
      'content-type': 'image/png', 'x-content-type-options': 'nosniff', 'cache-control': cache,
      'content-security-policy': "default-src 'none'; sandbox", 'content-disposition': 'inline',
      'cross-origin-resource-policy': 'same-origin',
    },
  });
}

// Eso ha il gettone della porta? (cookie mm_room, lo stesso di /lg/room)
async function diEso(request, env) {
  const c = /(?:^|;\s*)mm_room=([^;]+)/.exec(request.headers.get('cookie') || '');
  return !!(c && env.MM_DOOR_KEY && (await valido(c[1], env.MM_DOOR_KEY)));
}

// le richieste che cambiano qualcosa devono venire dal sito stesso
function stessoSito(request) {
  const o = request.headers.get('origin');
  if (o && o !== 'null') return o === new URL(request.url).origin;
  return request.headers.get('sec-fetch-site') === 'same-origin';
}

// approva o rifiuta un'insegna; la mail del vincitore si cancella in tutti e due i casi
async function decidi(request, env, si) {
  if (request.method !== 'POST') return no(405, 'method');
  if (!(await diEso(request, env))) return no(403, 'door');
  if (!stessoSito(request)) return no(403, 'origin');
  if (!env.DL_DB || !env.DL_SIGNS) return fuori();
  const ct = request.headers.get('content-type') || '';
  const b = await corpo(request, DL.corpo);
  if (b === null) return no(413, 'too big');
  let id = '';
  try {
    const t = new TextDecoder().decode(b);
    id = /json/i.test(ct) ? String((JSON.parse(t) || {}).id || '') : new URLSearchParams(t).get('id') || '';
  } catch { return no(400, 'body') }
  if (!/^[a-f0-9]{24}$/.test(id)) return no(400, 'id');
  const r = await env.DL_DB.prepare(
    `UPDATE dl_signs SET status = ?1, email = NULL, decided = ?2 WHERE id = ?3 AND status = 'pending'`
  ).bind(si ? 'approved' : 'rejected', Date.now(), id).run();
  if (!si) await env.DL_SIGNS.delete(`signs/${id}.png`).catch(() => {});
  const cambiate = (r && r.meta && r.meta.changes) || 0;
  if (/json/i.test(ct)) return json({ ok: cambiate > 0 });
  return new Response(null, { status: 303, headers: { location: '/lg/signs', 'cache-control': 'no-store' } });
}

const esc = (s) => String(s ?? '').replace(/[&<>"'`=]/g, (c) => `&#${c.charCodeAt(0)};`);

// /lg/signs: la pagina di Eso (stessa porta di /lg/room). Solo HTML e moduli, niente script.
async function insegne(request, env, pathname) {
  if (!(await diEso(request, env))) {
    if (request.method === 'POST') return no(403, 'door');
    return Response.redirect(new URL('/lg', request.url), 302);
  }
  if (pathname === '/lg/signs/approve' || pathname === '/lg/signs/reject') return decidi(request, env, pathname.endsWith('approve'));
  const img = /^\/lg\/signs\/img\/([a-f0-9]{24})\.png$/.exec(pathname);
  if (img) {
    if (!env.DL_SIGNS) return fuori();
    const r = await env.DL_DB.prepare("SELECT id FROM dl_signs WHERE id = ?1 AND status = 'pending'").bind(img[1]).first();
    if (!r) return new Response('Not found', { status: 404 });
    return immagine(env, img[1], 'private, no-store');
  }
  if (pathname !== '/lg/signs' && pathname !== '/lg/signs/') return new Response('Not found', { status: 404 });
  if (request.method !== 'GET') return no(405, 'method');
  let righe = [], fatte = 0, spento = !env.DL_DB || !env.DL_SIGNS;
  if (!spento) {
    righe = (await env.DL_DB.prepare(
      "SELECT id, initials, name, link, line, kind, email, created FROM dl_signs WHERE status = 'pending' ORDER BY created ASC LIMIT 100"
    ).all()).results || [];
    fatte = ((await env.DL_DB.prepare("SELECT COUNT(*) AS n FROM dl_signs WHERE status = 'approved'").first()) || {}).n || 0;
  }
  const schede = righe.map((r) => `
<li class="s">
  <div class="img"><img src="/lg/signs/img/${esc(r.id)}.png" alt="" width="384" height="160"></div>
  <dl>
    <dt>Business</dt><dd>${esc(r.name)}</dd>
    <dt>Link</dt><dd><a href="${esc(r.link)}" target="_blank" rel="noopener noreferrer nofollow">${esc(r.link)}</a></dd>
    <dt>Line</dt><dd>${esc(r.line) || '-'}</dd>
    <dt>Type</dt><dd>${esc(r.kind)}</dd>
    <dt>Email</dt><dd><a href="mailto:${esc(encodeURIComponent(r.email || ''))}">${esc(r.email)}</a></dd>
    <dt>Player</dt><dd>${esc(r.initials)} · ${esc(giornoData(r.created))}</dd>
  </dl>
  <div class="az">
    <form method="post" action="/lg/signs/approve"><input type="hidden" name="id" value="${esc(r.id)}"><button class="si">Approve</button></form>
    <form method="post" action="/lg/signs/reject"><input type="hidden" name="id" value="${esc(r.id)}"><button class="no">Reject</button></form>
  </div>
</li>`).join('');
  const vuoto = spento ? 'The sign storage is not connected yet (DL_DB, DL_SIGNS).' : 'No signs waiting.';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Signs · Secret lab</title><style>
@font-face{font-family:"DM Mono";src:url(/fonts/dmmono-400-1a0430d4.woff2) format("woff2");font-display:swap}
:root{--notte:#0F0F0E;--crema:#F4F2EC;--pom:#FF5B3A;--riga:rgba(244,242,236,.14);--fioco:rgba(244,242,236,.55)}
*{box-sizing:border-box}html,body{margin:0;background:var(--notte);color:var(--crema);font:14px/1.5 "DM Mono",ui-monospace,monospace}
main{max-width:860px;margin:0 auto;padding:40px 16px 80px}h1{font-size:13px;font-weight:400;letter-spacing:.12em;text-transform:uppercase;margin:0 0 6px}
p{color:var(--fioco);margin:0 0 28px}ul{list-style:none;margin:0;padding:0;display:grid;gap:16px}
.s{border:1px solid var(--riga);padding:16px;display:grid;grid-template-columns:minmax(0,384px) 1fr;gap:16px 24px;align-items:start}
.img{background:#050505 repeating-linear-gradient(0deg,transparent 0 3px,rgba(244,242,236,.03) 3px 4px);aspect-ratio:384/160;border:1px solid var(--riga)}
.img img{display:block;width:100%;height:auto;image-rendering:auto}
dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 14px;min-width:0}dt{color:var(--fioco);font-size:11px;text-transform:uppercase;letter-spacing:.1em;padding-top:2px}
dd{margin:0;overflow-wrap:anywhere}a{color:var(--crema)}.az{grid-column:1/-1;display:flex;gap:10px}
form{margin:0}button{font:inherit;font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:10px 18px;border:1px solid var(--pom);cursor:pointer;background:none;color:var(--crema);
background:linear-gradient(var(--pom),var(--pom)) bottom/100% 0 no-repeat;transition:background-size .2s}
button.si{background-size:100% 100%;color:var(--notte)}button.no:hover,button.no:focus-visible{background-size:100% 100%;color:var(--notte)}
button.si:hover{filter:brightness(1.08)}.vuoto{border:1px dashed var(--riga);padding:28px;color:var(--fioco)}
@media (max-width:640px){.s{grid-template-columns:1fr}}</style></head><body><main>
<h1>SL · Signs waiting</h1><p>${righe.length} waiting · ${fatte} up in the city. Approve puts the sign in the game. The winner's email is deleted after you choose: write to them first.</p>
${righe.length ? `<ul>${schede}</ul>` : `<div class="vuoto">${vuoto}</div>`}
</main></body></html>`;
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex',
      'x-content-type-options': 'nosniff', 'referrer-policy': 'same-origin', 'x-frame-options': 'DENY',
      'content-security-policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    },
  });
}

// Prima del lancio il sito e' online ma Google non lo mette nei risultati (studi, privacy in bozza).
// Il giorno del lancio: false, un commit, e Google puo' indicizzare.
const PRIMA_DEL_LANCIO = true;

async function pagina(request, env) {
  const r = await env.ASSETS.fetch(request);
  if (!PRIMA_DEL_LANCIO) return r;
  const out = new Response(r.body, r);
  out.headers.set('x-robots-tag', 'noindex');
  return out;
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/porta') return porta(request, env);
    if (pathname.startsWith('/lg/room')) return stanza(request, env);
    if (pathname.startsWith('/api/deadline/') || pathname === '/lg/signs' || pathname.startsWith('/lg/signs/')) {
      try {
        return pathname.startsWith('/lg/') ? await insegne(request, env, pathname) : await deadline(request, env, pathname);
      } catch (e) {
        // mai giu' il sito: un errore (tabelle mancanti, D1 lento) e il gioco va in locale
        console.error('deadline', e && e.message);
        return fuori();
      }
    }
    if (pathname === '/_worker.js') return new Response('Not found', { status: 404 });
    return pagina(request, env);
  },
};
