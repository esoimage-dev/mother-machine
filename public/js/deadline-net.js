// DEADLINE · rete: classifica sul server, anti imbrogli, premio. window.DEADLINE_NET
// Non lancia mai errori al gioco: se il server non c'e' (404, 503, rete giu') NET.offline = true e la classifica sta
// in localStorage ('mm-deadline-top', prime 10). Le insegne in quel caso sono [].
//
// Registro della partita (events) che il server controlla, compatto:
//   { days: [[t, s], ...]  un elemento per ogni giorno FINITO: t = secondi dall'inizio al "Clocked out", s = punteggio li'
//     kills: [n, n, ...]   nemici abbattuti per ogni minuto di gioco
//     boss: t }            secondi dall'inizio quando MONDAY cade (solo se bossBeaten)
// day = giorno raggiunto: 0..6 oppure 'tue'..'mon'. duration = secondi giocati (pausa esclusa va bene).
(() => {
  'use strict';
  const BASE = '/api/deadline';
  const CHIAVE = 'mm-deadline-top';
  const GIORNI = ['tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'mon'];
  const TIPI = ['food', 'fashion', 'shop', 'beauty', 'hotel', 'services'];

  const NET = { offline: false };

  // una chiamata con tempo massimo; -> {status, data} oppure null se la rete non risponde
  async function chiama(path, opt = {}) {
    if (NET.offline) return null;
    const ac = typeof AbortController === 'function' ? new AbortController() : null;
    const t = setTimeout(() => ac && ac.abort(), opt.attesa || 7000);
    try {
      const r = await fetch(BASE + path, { method: 'GET', credentials: 'same-origin', ...opt, signal: ac && ac.signal });
      let data = null;
      try { data = await r.json() } catch {}
      if (r.status === 404 || r.status >= 500 || (data && data.offline)) { NET.offline = true; return null }
      return { status: r.status, data: data || {} };
    } catch {
      NET.offline = true;
      return null;
    } finally { clearTimeout(t) }
  }
  const posta = (path, corpo) =>
    chiama(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(corpo) });

  // ---- pulizia di quello che arriva (anche dal server: il gioco lo disegna) ----
  const testo = (s, max) => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, '').slice(0, max);
  const iniz = (s) => (String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '') + '---').slice(0, 3);
  const giorno = (d) => (typeof d === 'number' ? GIORNI[d] || 'tue' : GIORNI.includes(String(d).toLowerCase()) ? String(d).toLowerCase() : 'tue');
  const riga = (r) => ({
    initials: iniz(r && r.initials), score: Math.max(0, Math.floor(+(r && r.score) || 0)), day: giorno(r && r.day),
    boss: !!(r && r.boss), date: testo(r && r.date, 10),
  });
  function linkSicuro(u) {
    try {
      const x = new URL(String(u), location.href);
      return /^https?:$/.test(x.protocol) && !x.username && !x.password ? x.href : '';
    } catch { return '' }
  }

  // ---- classifica locale ----
  function leggiLocale() {
    try {
      const v = JSON.parse(localStorage.getItem(CHIAVE) || '[]');
      return Array.isArray(v) ? v.map(riga) : [];
    } catch { return [] }
  }
  function scriviLocale(lista) {
    try { localStorage.setItem(CHIAVE, JSON.stringify(lista.slice(0, 10))) } catch {}
  }
  function mettiLocale(p) {
    const nuova = riga({ initials: p.initials, score: p.score, day: p.bossBeaten ? 6 : p.day, boss: p.bossBeaten, date: new Date().toISOString().slice(0, 10) });
    const lista = leggiLocale();
    lista.push(nuova);
    lista.sort((a, b) => b.score - a.score);
    const rank = lista.indexOf(nuova) + 1;
    scriviLocale(lista);
    return { rank: rank <= 10 ? rank : null, top: lista.slice(0, 10), verified: false, local: true };
  }

  NET.start = async () => {
    const r = await posta('/start', {});
    if (r && r.status === 200 && r.data.run && r.data.token) return { run: String(r.data.run), token: String(r.data.token) };
    const id = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => b.toString(16).padStart(2, '0')).join('');
    return { run: 'local-' + id, token: 'local', local: true };
  };

  NET.submit = async (p = {}) => {
    try {
      const corpo = {
        run: p.run, token: p.token, initials: iniz(p.initials), score: Math.floor(+p.score || 0), day: p.day,
        bossBeaten: !!p.bossBeaten, duration: Math.round((+p.duration || 0) * 10) / 10, events: p.events || null,
      };
      const locale = String(p.run || '').startsWith('local-');
      const r = locale ? null : await posta('/submit', corpo);
      if (!r) return mettiLocale(corpo);
      const top = Array.isArray(r.data.top) ? r.data.top.map(riga) : await NET.top(10);
      if (r.status === 200) return { rank: r.data.rank || null, top, verified: !!r.data.verified, initials: iniz(r.data.initials || corpo.initials) };
      // respinto (422), gia' mandato (409), troppi tentativi (429), gettone scaduto (403)
      return { rank: null, top, verified: false, error: testo(r.data.error, 40) || 'error' };
    } catch {
      return { rank: null, top: leggiLocale(), verified: false, error: 'error' };
    }
  };

  NET.top = async (n = 10) => {
    try {
      const k = Math.max(1, Math.min(50, n | 0 || 10));
      const r = await chiama('/top?n=' + k);
      if (r && r.status === 200 && Array.isArray(r.data.top)) return r.data.top.map(riga);
      return leggiLocale().slice(0, k);
    } catch { return [] }
  };

  // il premio: logoPng = Blob PNG (da DEADLINE_SIGN.process). email serve solo a scrivere al vincitore.
  NET.claim = async (p = {}) => {
    try {
      if (NET.offline || String(p.run || '').startsWith('local-')) return { ok: false, offline: true };
      if (!(p.logoPng instanceof Blob)) return { ok: false, error: 'logo' };
      const f = new FormData();
      for (const k of ['run', 'token', 'initials', 'business', 'link', 'line', 'kind', 'email']) f.set(k, String(p[k] == null ? '' : p[k]));
      f.set('logo', p.logoPng, 'sign.png');
      const r = await chiama('/claim', { method: 'POST', body: f, attesa: 15000 });
      if (!r) return { ok: false, offline: true };
      if (r.status === 200 && r.data.ok) return { ok: true, pending: true };
      return { ok: false, error: testo(r.data.error, 40) || 'error', status: r.status };
    } catch { return { ok: false, error: 'error' } }
  };

  // solo insegne approvate da Eso; tutto ripulito prima di darlo al gioco
  NET.signs = async () => {
    try {
      const r = await chiama('/signs');
      if (!(r && r.status === 200 && Array.isArray(r.data.signs))) return [];
      return r.data.signs
        .map((s) => ({
          name: testo(s.name, 40), link: linkSicuro(s.link), line: testo(s.line, 60),
          kind: TIPI.includes(s.kind) ? s.kind : 'services',
          img: /^\/api\/deadline\/sign\/[a-f0-9]{24}\.png$/.test(s.img) ? s.img : '',
        }))
        .filter((s) => s.name && s.link && s.img);
    } catch { return [] }
  };

  NET.local = leggiLocale;
  NET.GIORNI = GIORNI;
  NET.TIPI = TIPI;
  window.DEADLINE_NET = NET;
})();
