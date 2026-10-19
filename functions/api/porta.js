// POST /api/porta · la porta di LG. Il browser manda la sequenza dei bottoni; il codice giusto lo conosce solo il server.
// Giusto: un gettone firmato in un cookie (HttpOnly, 8 ore) che apre /lg/room. Ogni tentativo costa quasi un secondo.
import { uguali, gettone } from '../../server/firma.js';

// il segreto si puo' scrivere come si vuole: "01-05-05-G", "01 05 05 G", "1-5-5-g", "0105 05G"
const bottoni = (s) => (String(s).toUpperCase().match(/0?[1-5]|G/g) || []).map((b) => (b === 'G' ? 'G' : '0' + b.slice(-1))).join('-');

const json = (dati, init = {}) =>
  new Response(JSON.stringify(dati), { ...init, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...init.headers } });

// GET /api/porta · dice solo se la porta e' montata (segreti presenti), niente altro
export function onRequestGet({ env }) {
  return json({ porta: true, pronta: !!(env.MM_DOOR_CODE && env.MM_DOOR_KEY), cifre: bottoni(env.MM_DOOR_CODE || '').split('-').filter(Boolean).length });
}

export async function onRequestPost({ request, env }) {
  if (!env.MM_DOOR_CODE || !env.MM_DOOR_KEY) return json({ ok: false }, { status: 503 });
  let seq;
  try { ({ seq } = await request.json()) } catch { return json({ ok: false }, { status: 400 }) }
  if (!Array.isArray(seq) || seq.length < 1 || seq.length > 12 || !seq.every((x) => /^(0[1-5]|G)$/.test(x)))
    return json({ ok: false }, { status: 400 });
  await new Promise((r) => setTimeout(r, 800));
  if (!(await uguali(seq.join('-'), bottoni(env.MM_DOOR_CODE), env.MM_DOOR_KEY))) return json({ ok: false }, { status: 403 });
  const g = await gettone(8, env.MM_DOOR_KEY);
  return json({ ok: true }, { headers: { 'set-cookie': `mm_room=${g}; Path=/lg; Max-Age=28800; HttpOnly; Secure; SameSite=Strict` } });
}
