// Mother Machine · la firma della porta di LG. Gira solo sul server (Cloudflare Pages Functions), mai nel browser.
// Il codice e la chiave per firmare stanno nei segreti di Cloudflare (MM_DOOR_CODE, MM_DOOR_KEY), non nella repository.
const enc = new TextEncoder();

async function hmac(testo, chiave) {
  const k = await crypto.subtle.importKey('raw', enc.encode(chiave), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const firma = await crypto.subtle.sign('HMAC', k, enc.encode(testo));
  return [...new Uint8Array(firma)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// confronto senza scorciatoie: si confrontano le firme, sempre della stessa lunghezza
export async function uguali(a, b, chiave) {
  const [x, y] = await Promise.all([hmac(a, chiave), hmac(b, chiave)]);
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return d === 0;
}

// il gettone del back office: scadenza + firma; vale finche' non scade
export async function gettone(ore, chiave) {
  const scade = String(Date.now() + ore * 3600e3);
  return `${scade}.${await hmac(scade, chiave)}`;
}

export async function valido(g, chiave) {
  const [scade, firma] = String(g).split('.');
  if (!scade || !firma || !(+scade > Date.now())) return false;
  return uguali(firma, await hmac(scade, chiave), chiave);
}
