// /lg/room · il back office si apre solo con il gettone della porta. Senza, si torna a LG.
import { valido } from '../../server/firma.js';

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/lg/room')) return next();
  const c = /(?:^|;\s*)mm_room=([^;]+)/.exec(request.headers.get('cookie') || '');
  if (c && env.MM_DOOR_KEY && (await valido(c[1], env.MM_DOOR_KEY))) {
    const r = await next();
    const out = new Response(r.body, r);
    out.headers.set('cache-control', 'no-store');
    out.headers.set('x-robots-tag', 'noindex');
    return out;
  }
  return Response.redirect(new URL('/lg', url), 302);
}
