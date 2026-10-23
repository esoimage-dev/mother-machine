/* Mother Machine · LG · DEADLINE, il gioco del cabinato: Space Invaders cyberpunk.
   Dal cielo della citta' scendono le seccature di un'azienda; i potenziamenti sono i nostri servizi.
   Sei giorni (TUE..SUN) poi MONDAY, il boss. Logica a passo fisso (120 Hz), schermo a pixel 480 x 270 piu' un canvas
   FX a piena risoluzione per le luci. Disegni da window.DEADLINE_ART, suoni da DEADLINE_AUDIO, classifica e premio da
   DEADLINE_NET e DEADLINE_SIGN: se mancano, segnaposto, silenzio e localStorage.
   window.DEADLINE.open(x, y) apre il cabinato da quel punto, DEADLINE.close() lo chiude. */
(function () {
  'use strict';
  if (window.DEADLINE) return;

  var W = 480, H = 270, STEP = 1 / 120;
  var CITY_Y = 236, FW_Y = 206, SHIP_MIN = 140, SHIP_MAX = 224, HUD_H = 9;
  var DBG = /[?&]dldebug/.test(location.search);
  var MQ = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function RM() { return MQ.matches }
  var C = { night: '#0F0F0E', ink: '#121211', cream: '#F4F2EC', hot: '#FBFAF7', tom: '#FF5B3A', tomD: '#C23E26', tomL: '#FF9A7A',
    gold: '#E8B64A', goldL: '#FFE08A', goldD: '#B8862E', g1: '#BEC2BF', g2: '#7E8580', g3: '#4A4E4C', g4: '#2A2D2C', pink: '#F2CDBE',
    p2: '#D9D4C7', p3: '#9C978B', p4: '#55524B', crim: '#E0263F' };
  var DAYS = ['tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'mon'];
  var DAYNAME = { tue: 'TUESDAY', wed: 'WEDNESDAY', thu: 'THURSDAY', fri: 'FRIDAY', sat: 'SATURDAY', sun: 'SUNDAY', mon: 'MONDAY' };
  var FBDAY = { /* colori di riserva se ART manca: cielo alto, medio, orizzonte, lontano, mezzo, vicino, nebbia, accento */
    tue: ['#0A0F1C', '#121A2E', '#22314D', '#1A2440', '#10172A', '#090C15', '#3A5078', '#5FD3FF'],
    wed: ['#110D1C', '#1D152E', '#3A2852', '#2C2142', '#1A1428', '#0D0A14', '#6E5A94', '#B99CFF'],
    thu: ['#0D110B', '#171E15', '#2F3A1F', '#252E1C', '#151B12', '#0A0D08', '#6F7F33', '#C6EE48'],
    fri: ['#140C16', '#271329', '#4E2147', '#391A37', '#210F21', '#110910', '#9A4D78', '#FF86CF'],
    sat: ['#170E12', '#3A1C22', '#B5713E', '#57302C', '#2D1A1B', '#140C0D', '#C79465', '#FFC56A'],
    sun: ['#93A8B8', '#C9CDC6', '#F4F2EC', '#B3B8B2', '#7C837E', '#2A2D2C', '#F4F2EC', '#F2CDBE'],
    mon: ['#110506', '#280A0E', '#561219', '#3A0E13', '#200A0C', '#100506', '#7A1C25', '#E0263F'],
    night: ['#060B1E', '#0C1838', '#16295E', '#132350', '#0C1736', '#060A18', '#2F4C9A', '#8FB4FF'] };
  function accent(d) {
    var a = window.DEADLINE_ART;
    if (a && a.days && a.days[d] && a.days[d].accent) return a.days[d].accent;
    return (FBDAY[d] || FBDAY.night)[7];
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v }
  function rnd(a, b) { return a + Math.random() * (b - a) }
  function easeOut(k) { k = clamp(k, 0, 1); return 1 - (1 - k) * (1 - k) * (1 - k) }
  function easeIO(k) { k = clamp(k, 0, 1); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 }

  /* ---------- i moduli degli altri: ART (disegni), AUDIO, NET, SIGN ---------- */
  var g = null, fx = null, ga = null; /* contesti: sfondo a pixel, attori (2x), luci */
  var AR = null, broken = {};
  function art(name) {
    var a = window.DEADLINE_ART;
    if (!a || broken[name] || typeof a[name] !== 'function') return null;
    if (a !== AR) { AR = a; glowCache = {}; if (!a.ready && typeof a.init === 'function') { try { a.init() } catch (e) { warn('init', e) } } hbFromArt(a) }
    return a;
  }
  function warn(n, e) { try { console.warn('DEADLINE: ART.' + n + ' non va, uso il segnaposto', e) } catch (x) {} }
  function fail(n, e) { broken[n] = true; warn(n, e) }
  function au() { return window.DEADLINE_AUDIO || null }
  var SO = { pan: 0 }, curTrack = '', muted = false, curInt = 0;
  function sfx(n, x) {
    var a = au(); if (!a || typeof a.sfx !== 'function') return;
    SO.pan = x == null ? 0 : clamp(x / W * 2 - 1, -1, 1) * .7;
    try { a.sfx(n, SO) } catch (e) {}
  }
  function music(tr, force) {
    var a = au(); if (!a || typeof a.music !== 'function') return;
    if (tr === curTrack && !force) return; curTrack = tr;
    try { a.music(tr, { intensity: curInt, flow: !!(Gm && Gm.flow) }) } catch (e) {}
  }
  function aucall(fn, v) { var a = au(); if (a && typeof a[fn] === 'function') try { a[fn](v) } catch (e) {} }

  /* la classifica di riserva nel browser */
  var LKEY = 'mm-deadline-top';
  function ltop() { try { var a = JSON.parse(localStorage.getItem(LKEY) || '[]'); return Array.isArray(a) ? a : [] } catch (e) { return [] } }
  var LOCAL = {
    offline: true,
    start: function () { return Promise.resolve({ run: 'local-' + Date.now().toString(36), token: 'local' }) },
    submit: function (o) {
      var a = ltop(); var me = { initials: o.initials, score: o.score, day: o.day, date: new Date().toISOString().slice(0, 10) };
      a.push(me); a.sort(function (p, q) { return q.score - p.score }); a = a.slice(0, 20);
      try { localStorage.setItem(LKEY, JSON.stringify(a)) } catch (e) {}
      return Promise.resolve({ rank: a.indexOf(me) + 1, top: a.slice(0, 10), verified: false });
    },
    top: function (n) { return Promise.resolve(ltop().slice(0, n || 10)) },
    claim: function () { return Promise.reject(new Error('offline')) },
    signs: function () { return Promise.resolve([]) }
  };
  function net() { var n = window.DEADLINE_NET; return n && typeof n.start === 'function' ? n : LOCAL }
  function safeP(fn, fb) { try { var p = fn(); if (p && p.then) return p.catch(fb); return Promise.resolve(p) } catch (e) { return fb(e) } }

  /* ---------- il carattere di riserva (3 x 5) ---------- */
  var FG = {
    'A': '111101111101101', 'B': '110101110101110', 'C': '111100100100111', 'D': '110101101101110', 'E': '111100110100111', 'F': '111100110100100',
    'G': '111100101101111', 'H': '101101111101101', 'I': '111010010010111', 'J': '001001001101111', 'K': '101101110101101', 'L': '100100100100111',
    'M': '101111111101101', 'N': '110101101101101', 'O': '111101101101111', 'P': '111101111100100', 'Q': '111101101111001', 'R': '110101110101101',
    'S': '111100111001111', 'T': '111010010010010', 'U': '101101101101111', 'V': '101101101101010', 'W': '101101111111101', 'X': '101101010101101',
    'Y': '101101010010010', 'Z': '111001010100111', '0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111',
    '4': '101101111001001', '5': '111100111001111', '6': '111100111101111', '7': '111001010010010', '8': '111101111101111', '9': '111101111001111',
    ' ': '000000000000000', '.': '000000000000010', ':': '000010000010000', '-': '000000111000000', '!': '010010010000010', '?': '111001011000010',
    '>': '100010001010100', '<': '001010100010001', '+': '000010111010000', "'": '010010000000000', ',': '000000000010100', '*': '101010101000000',
    '/': '001001010100100', '%': '101001010100101', '#': '101111101111101', '@': '111101111100111', '&': '010101010101011', '(': '010100100100010',
    ')': '010001001001010', '"': '101101000000000', ';': '000010000010100', '=': '000111000111000', '|': '010010010010010', '_': '000000000000111'
  };
  function fbText(s, x, y, col, sz, al, sh) {
    s = String(s).toUpperCase(); sz = sz || 1; var w = s.length * 4 * sz - sz;
    if (al === 'c') x -= w / 2 | 0; else if (al === 'r') x -= w;
    x = Math.round(x); y = Math.round(y);
    for (var pass = sh ? 0 : 1; pass < 2; pass++) {
      g.fillStyle = pass ? col : sh; var o = pass ? 0 : sz;
      for (var i = 0; i < s.length; i++) {
        var gl = FG[s[i]] || FG['?'];
        for (var p = 0; p < 15; p++) if (gl.charCodeAt(p) === 49) g.fillRect(x + o + (i * 4 + p % 3) * sz, y + o + (p / 3 | 0) * sz, sz, sz);
      }
    }
    return w;
  }
  var TO = { color: '', size: 1, align: 'l', shadow: null };
  function txt(s, x, y, col, sz, al, sh) {
    var a = art('text');
    if (a) { TO.color = col; TO.size = sz || 1; TO.align = al || 'l'; TO.shadow = sh || null; try { return a.text(g, String(s), Math.round(x), Math.round(y), TO) } catch (e) { fail('text', e) } }
    return fbText(s, x, y, col, sz, al, sh);
  }
  function tw(s, sz) {
    var a = art('textWidth'); if (a) try { return a.textWidth(String(s), sz || 1) } catch (e) { fail('textWidth', e) }
    return String(s).length * 4 * (sz || 1) - (sz || 1);
  }
  function lh(sz) { return (art('text') ? 7 : 5) * (sz || 1) }
  /* testo spezzato su piu' righe entro una larghezza */
  function wrap(s, maxw, sz) {
    var words = String(s).split(' '), out = [], line = '';
    for (var i = 0; i < words.length; i++) { var t = line ? line + ' ' + words[i] : words[i]; if (tw(t, sz) > maxw && line) { out.push(line); line = words[i] } else line = t }
    if (line) out.push(line); return out;
  }

  /* ---------- i disegni di riserva (segnaposto puliti, finche' ART non c'e') ---------- */
  function R(x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h) }
  function fbShip(x, y, t, s) {
    x = Math.round(x); y = Math.round(y);
    for (var r = 0; r < 15; r++) { var bw = r < 9 ? 1 + (r >> 1) * 2 : 7; R(x - (bw >> 1), y - 8 + r, bw, 1, r < 3 ? C.g1 : C.g2) }
    for (r = 0; r < 6; r++) { var ww = 8 + r * 2; R(x - ww, y + r, ww * 2 + 1, 1, r === 5 ? C.g3 : C.g2) }
    R(x - 6 + (s.bank > .3 ? 1 : s.bank < -.3 ? -1 : 0), y + 1, 3, 2, C.cream);
    var fl = 2 + (s.thrust * 3 | 0) + ((t * 30 | 0) % 2);
    for (var i = -1; i < 2; i++) R(x + i * 4 - 1, y + 7, 3, fl, C.tom);
    R(x, y - 2, 1, 1, C.hot);
  }
  var FBE = { call: [14, 12], invoice: [12, 16], receipt: [6, 12], noshow: [12, 18], spam: [7, 5], double: [12, 12], urgent: [64, 40], monday: [150, 104] };
  function fbEnemy(type, x, y, t, s) {
    var base = type === 'gold' ? s.base || 'call' : type, d = FBE[base] || [12, 12], w = d[0], h = d[1];
    var gold = type === 'gold', fill = s.hit > .5 ? C.hot : gold ? C.gold : C.cream, ac = gold ? C.goldL : accent(curDayKey());
    var x0 = Math.round(x - w / 2) + (base === 'call' && (t * 20 | 0) % 2 ? 1 : 0), y0 = Math.round(y - h / 2);
    if (base === 'noshow') {
      g.globalAlpha = s.fade == null ? 1 : s.fade;
      for (var i = 0; i < w; i += 2) { if (((i + (t * 8 | 0)) & 2) === 0) { R(x0 + i, y0, 1, 1, C.cream); R(x0 + i, y0 + h - 1, 1, 1, C.cream) } }
      for (i = 0; i < h; i += 2) { if (((i + (t * 8 | 0)) & 2) === 0) { R(x0, y0 + i, 1, 1, C.cream); R(x0 + w - 1, y0 + i, 1, 1, C.cream) } }
      R(x0 + 3, y0 + 3, 6, 5, C.p3); fbText('T4', x0 + 2, y0 + 10, ac, 1);
      g.globalAlpha = 1; return;
    }
    R(x0 - 1, y0 - 1, w + 2, h + 2, C.ink); R(x0, y0, w, h, fill);
    if (base === 'call') { R(x0 + 2, y0 + 3, w - 4, 2, C.p4); R(x0 + 3, y0 + 7, w - 6, 3, ac) }
    else if (base === 'invoice' || base === 'receipt') { for (var k = 3; k < h - 4; k += 3) R(x0 + 2, y0 + k, w - 4, 1, C.p3); if (base === 'invoice') R(x0 + 2, y0 + h - 5, 7, 3, ac) }
    else if (base === 'spam') { R(x0 + 1, y0 + 1, w - 2, 1, C.p3); R(x0 + 3, y0 + 2, 1, 2, ac) }
    else if (base === 'double') { R(x0, y0, w, 3, s.marked ? C.cream : ac); R(x0 + 3, y0 + 5, 2, 2, C.p4); R(x0 + 7, y0 + 5, 2, 2, C.p4) }
  }
  function fbBoss(name, x, y, t, s) {
    var d = FBE[name], w = d[0], h = d[1], x0 = Math.round(x - w / 2), y0 = Math.round(y - h / 2);
    R(x0 - 1, y0 - 1, w + 2, h + 2, C.ink); R(x0, y0, w, h, s.hit > .5 ? C.hot : name === 'urgent' ? C.crim : C.cream);
    if (name === 'urgent') { fbText('URGENT', x, y0 + h / 2 - 2, C.cream, 1, 'c'); return }
    R(x0, y0, w, 18, C.crim); fbText('MONDAY', x, y0 + 6, C.cream, 2, 'c');
    R(x0 + 30, y0 + 40, 14, 10, C.ink); R(x0 + w - 44, y0 + 40, 14, 10, C.ink);
    R(x0 + 40, y0 + 70 - (s.mouth * 6 | 0), w - 80, 6 + (s.mouth * 10 | 0), C.ink);
  }
  function fbBullet(kind, x, y, t, a) {
    x = Math.round(x); y = Math.round(y);
    var sun = curDayKey() === 'sun', core = sun ? C.ink : C.cream, ring = sun ? C.pink : accent(curDayKey());
    if (kind === 'player') { R(x, y + 1, 1, 4, C.tom); R(x, y, 1, 1, C.hot); return }
    if (kind === 'ring') { R(x - 4, y - 1, 9, 3, C.night); R(x - 3, y, 7, 1, ring); R(x - 4, y + 1, 1, 1, ring); R(x + 4, y + 1, 1, 1, ring); R(x - 1, y, 3, 1, core); return }
    if (kind === 'mail') { R(x - 4, y - 3, 9, 7, C.night); R(x - 3, y - 2, 7, 5, ring); R(x - 2, y - 1, 5, 3, core); return }
    var r = kind === 'alarm' ? 3 : 2;
    R(x - r, y - r + 1, r * 2 + 1, r * 2 - 1, C.night); R(x - r + 1, y - r, r * 2 - 1, r * 2 + 1, C.night);
    R(x - r + 1, y, r * 2 - 1, 1, ring); R(x, y - r + 1, 1, r * 2 - 1, ring); R(x, y, 1, 1, core);
    if (r > 2) { R(x - 1, y - 1, 3, 3, ring); R(x, y, 1, 1, core) }
  }
  var PWL = { auto: 'A', ai: 'I', booking: 'B', night: 'N', coin: '$' };
  function fbPower(kind, x, y, t) {
    var x0 = Math.round(x - 6), y0 = Math.round(y - 6), c = kind === 'coin' ? C.gold : C.goldL;
    R(x0, y0, 12, 12, C.night); R(x0 + 1, y0 + 1, 10, 10, (t * 4 | 0) % 2 ? c : C.gold); fbText(PWL[kind] || '?', x0 + 5, y0 + 4, C.ink, 1);
  }
  function fbMeeting(x, y, w, h, t, label) {
    var ac = accent('mon'); R(x, y, w, h, C.night); R(x + 1, y + 1, w - 2, h - 2, ac); R(x + 2, y + 2, w - 4, h - 4, '#3A0E13');
    fbText(label, x + w / 2, y + h / 2 - 2, C.cream, 1, 'c');
  }
  var fbSkyC = {};
  function fbSky(day) {
    var c = fbSkyC[day];
    if (!c) {
      c = document.createElement('canvas'); c.width = W; c.height = H; var q = c.getContext('2d'), P = FBDAY[day] || FBDAY.night;
      var bands = [P[0], P[1], P[2]];
      for (var y = 0; y < H; y++) { var k = y / H * 2, i = Math.min(1, k | 0), f = k - i; for (var x = 0; x < W; x += 2) { q.fillStyle = bands[(f > ((x + y * 3) % 7) / 7) ? i + 1 : i]; q.fillRect(x, y, 2, 1) } }
      fbSkyC[day] = c;
    }
    g.drawImage(c, 0, 0);
  }
  function fbSkyline(day, scroll) {
    var P = FBDAY[day] || FBDAY.night, off = -(scroll % 480);
    for (var rep = 0; rep < 2; rep++) for (var i = 0; i < 16; i++) { var hh = 30 + ((i * 53) % 40); R(off + rep * 480 + i * 30, 200 - hh, 28, hh + 40, P[3]) }
  }
  function fbTowers(day, scroll, t, bb) {
    var P = FBDAY[day] || FBDAY.night, off = -(scroll % 480), ac = accent(day);
    for (var rep = 0; rep < 2; rep++) for (var i = 0; i < 6; i++) {
      var x = off + rep * 480 + i * 80 + 10, hh = 60 + ((i * 37) % 50); R(x, 236 - hh, 46, hh, P[4]);
      if (i % 2 === 0) { R(x + 4, 236 - hh + 8, 38, 14, C.night); R(x + 5, 236 - hh + 9, 36, 12, P[5]); fbText('MM', x + 23, 236 - hh + 13, ac, 1, 'c') }
    }
  }
  var fbWin = null;
  function fbWindows() {
    if (!fbWin) { fbWin = []; for (var i = 0; i < 24; i++) fbWin.push({ x: 12 + (i % 12) * 39, y: 244 + (i / 12 | 0) * 10, w: 4, h: 3 }) }
    return fbWin;
  }
  function fbCity(wins, t, day) {
    var P = FBDAY[day] || FBDAY.night, r = fbWindows();
    R(0, CITY_Y, W, H - CITY_Y, P[5]);
    for (var i = 0; i < 12; i++) R(i * 40 + 4, CITY_Y - 4 + (i % 3) * 2, 34, 40, P[5]);
    for (i = 0; i < r.length; i++) R(r[i].x, r[i].y, r[i].w, r[i].h, wins[i] ? C.cream : P[4]);
  }
  function fbBuilding(kind, x, y, w, h, t, sign) {
    R(x, y, w, h, '#132350'); R(x, y, w, 1, C.cream);
    for (var yy = y + 18; yy < y + h - 6; yy += 8) for (var xx = x + 4; xx < x + w - 4; xx += 7) R(xx, yy, 3, 3, ((xx * 7 + yy) % 5) ? '#F4F2EC' : '#0C1736');
    R(x + 3, y + 3, w - 6, 12, C.night);
    if (sign && sign.img) { try { g.drawImage(sign.img, x + 4, y + 4, w - 8, 10) } catch (e) {} }
    else fbText(w > 44 ? 'FOR RENT' : 'RENT', x + w / 2, y + 7, '#3A3A38', 1, 'c');
  }
  function fbLogo(x, y, t, gl) {
    var s = 'DEADLINE', w = tw(s, 4); fbText(s, x + 2, y + 2, C.tomD, 4, 'c'); fbText(s, x, y, C.cream, 4, 'c');
    var k = (t * .25) % 1; R(x - w / 2, y + 24, Math.round(w * k), 1, C.tom);
  }
  var MARK = ['0111011100', '1111111110', '1101101110', '1101101110', '1101101110', '1101101110'];
  function fbMark(x, y, size, t) {
    var s = size || 3, n = clamp(t * 2, 0, 1);
    for (var r = 0; r < MARK.length; r++) for (var c = 0; c < 10; c++) if (MARK[r][c] === '1' && c / 10 <= n) R(x - 15 * s / 3 + c * s, y + r * s, s, s, C.cream);
  }
  function fbIcon(name, x, y) {
    if (name === 'coffee' || name === 'coffeeEmpty') { R(x, y + 2, 5, 5, name === 'coffee' ? C.cream : C.g3); R(x + 5, y + 3, 2, 2, name === 'coffee' ? C.cream : C.g3); if (name === 'coffee') R(x + 1, y + 2, 3, 1, C.p4); return }
    R(x, y, 7, 7, name === 'night' ? '#8FB4FF' : C.gold); fbText(PWL[name] || '?', x + 2, y + 1, C.ink, 1);
  }

  /* ---------- i ponti verso ART: ogni chiamata ha il suo segnaposto ---------- */
  var SS = { bank: 0, thrust: 0, shield: 0, flash: false, power: null, bg: null };
  var SE = { hit: 0, phase: 0, fade: 1, base: null, marked: false, dead: false };
  var SB = { phase: 1, hp: 1, hit: 0, rage: 0, pagesTorn: 0, mouth: 0 };
  function dShip(x, y, t) { var a = art('ship'); if (a) { try { a.ship(g, Math.round(x), Math.round(y), t, SS); return } catch (e) { fail('ship', e) } } fbShip(x, y, t, SS) }
  function dEnemy(type, x, y, t) { var a = art('enemy'); if (a) { try { a.enemy(g, type, Math.round(x), Math.round(y), t, SE); return } catch (e) { fail('enemy', e) } } fbEnemy(type, x, y, t, SE) }
  function dBoss(n, x, y, t) { var a = art('boss'); if (a) { try { a.boss(g, n, Math.round(x), Math.round(y), t, SB); return } catch (e) { fail('boss', e) } } fbBoss(n, x, y, t, SB) }
  function dBullet(k, x, y, t, an) { var a = art('bullet'); if (a) { try { a.bullet(g, k, Math.round(x), Math.round(y), t, an); return } catch (e) { fail('bullet', e) } } fbBullet(k, x, y, t, an) }
  function dPower(k, x, y, t) { var a = art('powerup'); if (a) { try { a.powerup(g, k, Math.round(x), Math.round(y), t); return } catch (e) { fail('powerup', e) } } fbPower(k, x, y, t) }
  function dMeeting(x, y, w, h, t, l) { var a = art('meeting'); if (a) { try { a.meeting(g, Math.round(x), Math.round(y), w, h, t, l); return } catch (e) { fail('meeting', e) } } fbMeeting(Math.round(x), Math.round(y), w, h, t, l) }
  function dSky(d, t) { var a = art('sky'); if (a) { try { a.sky(g, d, t); return } catch (e) { fail('sky', e) } } fbSky(d) }
  function dSkyline(d, s, t) { var a = art('skyline'); if (a) { try { a.skyline(g, d, s, t); return } catch (e) { fail('skyline', e) } } fbSkyline(d, s) }
  function dTowers(d, s, t, bb) { var a = art('towers'); if (a) { try { a.towers(g, d, s, t, bb); return } catch (e) { fail('towers', e) } } fbTowers(d, s, t, bb) }
  function dCity(w, t, d) { var a = art('city'); if (a) { try { a.city(g, w, t, d, cityShift()); return } catch (e) { fail('city', e) } } fbCity(w, t, d) }
  function dWeather(d, t, i) { var a = art('weather'); if (a) { try { a.weather(g, d, t, i); return } catch (e) { fail('weather', e) } } }
  function dBuilding(k, x, y, w, h, t, s) { var a = art('building'); if (a) { try { a.building(g, k, Math.round(x), Math.round(y), w, h, t, s); return } catch (e) { fail('building', e) } } fbBuilding(k, Math.round(x), Math.round(y), w, h, t, s) }
  function dLogo(x, y, t, gl) { var a = art('logo'); if (a) { try { a.logo(g, Math.round(x), Math.round(y), t, gl); return } catch (e) { fail('logo', e) } } fbLogo(x, y, t, gl) }
  function dMark(x, y, s, t) { var a = art('mark'); if (a) { try { a.mark(g, Math.round(x), Math.round(y), s, t); return } catch (e) { fail('mark', e) } } fbMark(x, y, s, t) }
  function dIcon(n, x, y) { var a = art('icon'); if (a) { try { a.icon(g, n, Math.round(x), Math.round(y)); return } catch (e) { fail('icon', e) } } fbIcon(n, Math.round(x), Math.round(y)) }
  function dExplosion(x, y, t0, t, k) { var a = art('explosion'); if (a) { try { return a.explosion(g, Math.round(x), Math.round(y), t0, t, k) } catch (e) { fail('explosion', e) } } return T - t0 < 1 }
  function dFirewall(f) {
    var a = art('firewall');
    if (a) { try { a.firewall(g, f.x, f.y, f.mask); return } catch (e) { fail('firewall', e) } }
    if (f.dirty) { /* immagine cacheata, rifatta solo quando cambia */
      var q = f.cv.getContext('2d'), id = q.createImageData(36, 14), d = id.data;
      for (var i = 0; i < 504; i++) if (f.mask[i]) { var top = i < 36 || !f.mask[i - 36]; d[i * 4] = top ? 244 : (i % 2 ? 126 : 190); d[i * 4 + 1] = top ? 242 : (i % 2 ? 133 : 194); d[i * 4 + 2] = top ? 236 : (i % 2 ? 128 : 191); d[i * 4 + 3] = 255 }
      q.putImageData(id, 0, 0); f.dirty = false;
    }
    g.drawImage(f.cv, f.x, f.y);
  }
  function fwMask() {
    var a = art('firewallMask'); if (a) try { var m = a.firewallMask(); if (m && m.length === 504) return m } catch (e) { fail('firewallMask', e) }
    m = new Uint8Array(504);
    for (var y = 0; y < 14; y++) for (var x = 0; x < 36; x++) {
      var corner = (y < 3 && (x < 3 - y || x > 32 + y)), slot = (y > 9 && x > 13 && x < 22);
      m[y * 36 + x] = corner || slot ? 0 : 1;
    }
    return m;
  }
  var glowCache = {};
  function glow(name, r) {
    var sz = r == null ? 1 : r < 6 ? 0 : r < 12 ? 1 : r < 26 ? 2 : 3, key = name + sz, c = glowCache[key]; if (c !== undefined) return c;
    var a = art('glow'); c = null;
    if (a) try { c = a.glow(name, sz) || null } catch (e) { fail('glow', e) }
    if (!c) {
      var col = { player: '255,91,58', pomodoro: '255,91,58', ship: '255,91,58', gold: '232,182,74', red: '224,38,63', cyan: '95,211,255', cream: '244,242,236', night: '143,180,255' }[name] || '244,242,236';
      c = document.createElement('canvas'); c.width = c.height = 64; var q = c.getContext('2d'), gr = q.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(' + col + ',.9)'); gr.addColorStop(.35, 'rgba(' + col + ',.35)'); gr.addColorStop(1, 'rgba(' + col + ',0)');
      q.fillStyle = gr; q.fillRect(0, 0, 64, 64);
    }
    glowCache[key] = c; return c;
  }
  function cityShift() { return Gm ? Math.round(clamp((240 - Gm.ship.x) / 240 * 8, -8, 8)) : 0 }
  function windowCount() { var a = window.DEADLINE_ART; if (a && a.cityWindows > 0 && !broken.city) return a.cityWindows | 0; return 24 }
  function windowRects() { var a = window.DEADLINE_ART; if (a && a.windowRects && a.windowRects.length && !broken.city) return a.windowRects; return fbWindows() }

  /* ---------- i giorni: tre ondate ciascuno ---------- */
  /* rows = tipi delle file della formazione (dall'alto), march = passo, dive = ogni quanti secondi un tuffo,
     fire = ogni quanti secondi un colpo, cap = colpi nemici al massimo, ev = eventi a tempo dentro l'ondata */
  var DEF = {
    /* TUE: si impara. Solo chiamate, la prima ondata non spara */
    tue: { hint: 'Missed calls. Stop them before they hit the city.', teaser: 'Rain. Only missed calls.', speed: 1, waves: [
      { rows: ['call', 'call'], cols: 5, march: 13, creep: .4, dive: 6, fire: 0, cap: 0 },
      { rows: ['call', 'call'], cols: 6, march: 15, creep: .5, dive: 4.2, fire: 2.4, cap: 2, ev: [{ at: 2.5, k: 'gold', p: 'auto' }] },
      { rows: ['call', 'call', 'call'], cols: 6, march: 17, creep: .6, dive: 3.4, fire: 2, cap: 3 }] },
    /* WED: nebbia, i nemici in alto non si vedono finche' non si avvicinano; fatture che si dividono */
    wed: { hint: 'Fog. Paper invoices split in two.', teaser: 'Fog hides what is coming.', speed: 1.05, fog: true, waves: [
      { rows: ['invoice', 'call'], cols: 5, march: 14, creep: .5, dive: 5, fire: 2.2, cap: 3 },
      { rows: ['call', 'invoice'], cols: 5, march: 16, creep: .55, dive: 4.2, fire: 1.9, cap: 4, ev: [{ at: 3, k: 'gold' }] },
      { rows: ['call', 'call', 'invoice'], cols: 5, march: 18, creep: .6, dive: 3.4, fire: 1.7, cap: 4 }] },
    /* THU: smog acido, i no-show si teletrasportano e le insegne fanno corto circuito */
    thu: { hint: 'No-shows teleport. Mind the acid signs.', teaser: 'No-shows and acid neon.', speed: 1.1, acid: true, waves: [
      { rows: ['noshow', 'call'], cols: 5, march: 15, creep: .5, dive: 3.6, fire: 2, cap: 3 },
      { rows: ['invoice'], cols: 5, march: 16, creep: .5, dive: 0, fire: 2, cap: 4, ev: [{ at: 1, k: 'double', x: 140 }, { at: 4, k: 'double', x: 340 }, { at: 6, k: 'gold' }] },
      { rows: ['noshow', 'noshow', 'call'], cols: 6, march: 18, creep: .6, dive: 2.8, fire: 1.6, cap: 5 }] },
    /* FRI: festa, tutto piu' veloce, coriandoli di spam, alle 16:59 URGENT */
    fri: { hint: 'Friday rush. Something urgent lands at 16:59.', teaser: 'Party. Fast. Then URGENT.', speed: 1.2, party: true, waves: [
      { rows: ['call', 'invoice', 'call'], cols: 6, march: 21, creep: .55, dive: 3, fire: 1.6, cap: 5 },
      { rows: ['noshow', 'call'], cols: 6, march: 20, creep: .6, dive: 3, fire: 1.6, cap: 5, ev: [{ at: 1, k: 'swarm', n: 9, path: 'sine', side: 1, y: 70 }, { at: 3, k: 'double', x: 140 }, { at: 5, k: 'gold' }] }] },
    /* SAT: tramonto, l'inbox esplode: treni di spam */
    sat: { hint: 'Inbox flood. Spam comes in trains.', teaser: 'Sunset. The inbox floods.', speed: 1.18, waves: [
      { rows: ['call', 'call'], cols: 5, march: 16, creep: .5, dive: 3.6, fire: 2, cap: 4, ev: [{ at: .5, k: 'swarm', n: 10, path: 'sine', side: -1, y: 64 }, { at: 4.5, k: 'swarm', n: 10, path: 'sine', side: 1, y: 88 }] },
      { rows: [], ev: [{ at: .3, k: 'swarm', n: 12, path: 'swoop', side: -1 }, { at: 2.6, k: 'swarm', n: 12, path: 'swoop', side: 1 }, { at: 4, k: 'gold' }, { at: 5.6, k: 'swarm', n: 14, path: 'sine', side: -1, y: 50 }, { at: 8, k: 'swarm', n: 14, path: 'swoop', side: 1 }] },
      { rows: ['invoice', 'noshow'], cols: 6, march: 19, creep: .6, dive: 3, fire: 1.6, cap: 5, ev: [{ at: 2, k: 'swarm', n: 10, path: 'sine', side: 1, y: 100 }, { at: 5, k: 'double', x: 240 }] }] },
    /* SUN: calma strana, pochi nemici... e la trappola alla fine */
    sun: { hint: 'Sunday. Quiet. Too quiet.', teaser: 'Calm. Too calm.', speed: .9, waves: [
      { rows: ['call'], cols: 4, march: 10, creep: .3, dive: 7, fire: 3.5, cap: 2 },
      { rows: [], ev: [{ at: .5, k: 'double', x: 240 }, { at: 2.5, k: 'gold' }] },
      { rows: [], ev: [{ at: .8, k: 'trap' }] }] },
    mon: { hint: '', teaser: 'MONDAY.', speed: 1.25, waves: [] }
  };
  var PTS = { call: 1, invoice: 2, receipt: 1, noshow: 3, spam: 1, double: 3, gold: 5 };
  /* hitbox (meta' larghezza, meta' altezza), piu' piccole degli sprite */
  var HB = { call: [6, 5], invoice: [5, 7], receipt: [3, 5], noshow: [5, 8], spam: [4, 3], double: [5, 5] };

  /* le hitbox seguono le misure vere degli sprite di ART (circa il 70% della sagoma, bordo escluso) */
  function hbFromArt(a) {
    var z = a.size; if (!z) return;
    for (var k in HB) if (z[k] && z[k].w) HB[k] = [Math.max(2, Math.round((z[k].w - 2) * .36)), Math.max(2, Math.round((z[k].h - 2) * .36))];
  }

  /* ---------- i contenitori (pool): niente allocazioni nel ciclo ---------- */
  function pool(n, mk) { var a = []; for (var i = 0; i < n; i++) { var o = mk(); o.on = false; a.push(o) } return a }
  function take(a) { for (var i = 0; i < a.length; i++) if (!a[i].on) { a[i].on = true; return a[i] } return null }
  var EN = pool(110, function () { return { type: '', base: '', x: 0, y: 0, vx: 0, vy: 0, hp: 1, st: '', t: 0, c: 0, r: 0, x0: 0, y0: 0, a: 0, b: 0, d: 0, hit: 0, fade: 1, partner: null, lead: false, marked: 0, fireT: 0, charge: 0, counts: true, wave: 0, delay: 0, power: '' } });
  var PB = pool(80, function () { return { x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0, home: false, tgt: null, life: 0 } });
  var EB = pool(260, function () { return { kind: '', x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0, hw: 2, hh: 2, t: 0, a: 0, ax: 0, ay: 0 } });
  var PU = pool(10, function () { return { kind: '', x: 0, y: 0, t: 0 } });
  var PT = pool(700, function () { return { x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, col: '', gr: 0, end: '' } });
  var FT = pool(24, function () { return { s: '', x: 0, y: 0, life: 0, col: '' } });
  var BX = pool(24, function () { return { x: 0, y: 0, t0: 0, kind: '' } });
  var BL = pool(40, function () { return { x: 0, y: 0, w: 0, h: 0, hp: 0, vy: 0, label: '', hit: 0 } });
  var PG = pool(24, function () { return { x: 0, y: 0, vx: 0, vy: 0, r: 0, life: 0 } }); /* pagine strappate */
  function clearPool(a) { for (var i = 0; i < a.length; i++) a[i].on = false }

  /* ---------- lo stato ---------- */
  var st = 'boot', stT = 0, paused = false, T = 0, RT = 0, timeScale = 1, god = false, botOn = false, weekend = false;
  var Gm = null; /* la partita */
  var TOP = [], SIGNS = [], LAST = null; /* classifica, insegne, ultimo risultato */
  var fws = [];
  var keys = { l: 0, r: 0, u: 0, d: 0, f: 0 }, touchMode = false, touch = { on: false, id: -1, abs: false, lx: 0, ly: 0, tx: 0, ty: 0 };
  var hot = []; /* zone cliccabili sul canvas, rifatte ogni fotogramma */
  var hover = null, cityX = 0, cityDrag = null, titlePage = 0, titlePageT = 0;
  var ini = ['A', 'A', 'A'], iniPos = 0, iniMsg = '', iniMsgT = 0;
  var bootT = 0, konami = [], KONAMI = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
  try { var li = localStorage.getItem('mm-deadline-ini'); if (li && /^[A-Z]{3}$/.test(li)) ini = li.split('') } catch (e) {}

  function curDayKey() {
    if (!Gm) return 'night';
    if (Gm.nightT > 0) return 'night';
    return DAYS[Gm.day] || 'tue';
  }

  function newGame() {
    var n = windowCount(), wins = []; for (var i = 0; i < n; i++) wins.push(true);
    Gm = {
      day: 0, score: 0, shown: 0, coffee: 3, wins: wins, winOffT: new Float32Array(n), cityHits: 0, cityMax: 24, perHit: Math.max(1, Math.round(n / 24)),
      ship: { x: 240, y: 186, vx: 0, vy: 0, bank: 0, cool: 0, inv: 0, flash: 0, dead: false, tx: 240, ty: 186 },
      power: null, powerT: 0, shield: 0, night: false, nightT: 0, lastDrop: '', golds: 0,
      combo: 0, comboT: 0, flow: false, best: 0, cupT: 0,
      phase: 'intro', phaseT: 0, wave: -1, waveT: 0, waveTotal: 0, waveDone: 0, evI: 0, def: null, wdef: null,
      F: { on: false, x: 0, y: 0, dir: 1, cols: 0, rows: 0, sx: 30, sy: 20, total: 0, alive: 0, minC: 0, maxC: 0 },
      diveT: 0, fireT: 0, clock: 0, clockShow: 0, overtime: false, boss: null, hitStop: 0, shake: 0, flash: 0, glitch: 0,
      dayT: 0, ds: { kills: 0, h0: 0, best: 0, bonus: 0 }, coinDay: false, cause: '',
      log: { days: [], kills: [0], boss: 0, shots: 0, hits: 0, weekend: weekend },
      run: null, token: null, startedAt: Date.now(), playT: 0, monIn: 0, won: false, sumLines: null
    };
    clearPool(EN); clearPool(PB); clearPool(EB); clearPool(PU); clearPool(PT); clearPool(FT); clearPool(BX); clearPool(BL); clearPool(PG); clearPool(CP);
    safeP(function () { return net().start() }, function () { return LOCAL.start() }).then(function (r) { if (Gm && r) { Gm.run = r.run; Gm.token = r.token } });
  }
  function resetFirewalls() {
    fws = [];
    var xs = [102, 222, 342];
    for (var i = 0; i < 3; i++) { var c = document.createElement('canvas'); c.width = 36; c.height = 14; fws.push({ x: xs[i], y: FW_Y, mask: fwMask(), cv: c, dirty: true }) }
  }

  function startDay(d) {
    Gm.day = d; Gm.phase = d === 6 ? 'monin' : 'intro'; Gm.phaseT = 0; Gm.wave = -1; Gm.clock = 0; Gm.clockShow = 0; Gm.overtime = false;
    Gm.def = DEF[DAYS[d]]; Gm.F.on = false; Gm.dayT = 0; Gm.coinDay = false; Gm.boss = null; Gm.monIn = 0;
    Gm.ds = { kills: 0, h0: Gm.score, best: 0, bonus: 0 }; curInt = 0; HZ.st = 'off'; HZ.next = 4;
    clearPool(EN); clearPool(EB); clearPool(BL); clearPool(PU); clearPool(PG);
    resetFirewalls();
    Gm.ship.inv = 1.5;
    if (d === 6) { music(null); setTimeout(function () { if (st === 'play' && Gm && Gm.phase === 'monin') sfx('alarm') }, 250) }
    else music(DAYS[d]);
    st = 'play'; stT = 0;
  }
  function startWave(i) {
    var wd = Gm.def.waves[i]; Gm.wave = i; Gm.wdef = wd; Gm.waveT = 0; Gm.evI = 0; Gm.waveTotal = 0; Gm.waveDone = 0;
    Gm.diveT = wd.dive ? wd.dive * .8 : 0; Gm.fireT = (wd.fire || 2) * 1.2;
    var F = Gm.F, rows = wd.rows || [];
    F.on = rows.length > 0; F.cols = wd.cols || 0; F.rows = rows.length; F.dir = Math.random() < .5 ? 1 : -1;
    F.x = (W - (F.cols - 1) * F.sx) / 2; F.y = 30; F.total = 0;
    for (var r = 0; r < rows.length; r++) for (var c = 0; c < F.cols; c++) {
      var e = spawnEnemy(rows[r], 0, 0); if (!e) continue;
      e.st = 'enter'; e.fromF = true; e.c = c; e.r = r; e.t = 0; e.delay = c * .06 + (rows.length - r) * .12;
      e.x0 = F.x + c * F.sx + (c - F.cols / 2) * 14; e.y0 = -20 - r * 16; e.x = e.x0; e.y = e.y0; F.total++;
    }
    F.alive = F.total;
    if (wd.ev) Gm.waveTotal += countEv(wd.ev);
  }
  function countEv(ev) { var n = 0; for (var i = 0; i < ev.length; i++) n += ev[i].k === 'swarm' ? ev[i].n : ev[i].k === 'double' ? 2 : ev[i].k === 'trap' ? 4 : 1; return n }
  function spawnEnemy(type, x, y) {
    var e = take(EN); if (!e) return null;
    e.type = type; e.base = type; e.x = x; e.y = y; e.vx = e.vy = 0; e.hp = type === 'gold' ? 2 : 1; e.st = 'free'; e.t = 0; e.hit = 0; e.fade = 1;
    e.partner = null; e.lead = false; e.fromF = false; e.c = -1; e.r = 0; e.marked = 0; e.fireT = rnd(1, 3); e.charge = 0; e.counts = true; e.delay = 0; e.power = ''; e.a = e.b = e.d = 0;
    if (type === 'noshow') e.fade = .65;
    Gm.waveTotal++;
    return e;
  }
  function slotX(e) { return Gm.F.x + e.c * Gm.F.sx }
  function slotY(e) { return Gm.F.y + e.r * Gm.F.sy + Math.sin(T * 2 + e.c * .7) * 1.5 }

  /* eventi a tempo dentro un'ondata */
  function runEvent(ev) {
    var sp = Gm.def.speed, i, e;
    if (ev.k === 'trap') { /* Sunday scaries: quattro no-show riappaiono intorno alla nave, uno dopo l'altro */
      Gm.waveTotal -= 4; ftext('SUNDAY SCARIES', 240, 100, C.crim); sfx('blip');
      var s0 = Gm.ship, ang = [-2.4, -.7, -1.9, -1.2];
      for (i = 0; i < 4; i++) { e = spawnEnemy('noshow', 0, 0); if (!e) break; e.st = 'mark'; e.t = -i * .45; e.fade = 0;
        e.x = clamp(s0.x + Math.cos(ang[i]) * 80, 16, W - 16); e.y = clamp(s0.y + Math.sin(ang[i]) * 80, 34, 150) }
      return;
    }
    if (ev.k === 'gold') {
      var side = Math.random() < .5 ? -1 : 1; Gm.waveTotal--; /* gia' contato */
      e = spawnEnemy('gold', side < 0 ? -12 : W + 12, 24); if (!e) return;
      var bases = ['call', 'invoice', 'spam', 'double']; e.base = Gm.day < 1 ? 'call' : bases[Math.random() * bases.length | 0];
      e.st = 'cross'; e.vx = -side * 62; e.y0 = 22; e.power = ev.p || ''; e.hp = 2;
    } else if (ev.k === 'double') {
      Gm.waveTotal -= 2;
      var a = spawnEnemy('double', 0, 0), b = spawnEnemy('double', 0, 0); if (!a || !b) return;
      a.partner = b; b.partner = a; a.lead = true; a.st = b.st = 'pair';
      a.x0 = ev.x || rnd(100, 380); a.y0 = -24; a.a = 0; a.vx = (Math.random() < .5 ? -1 : 1) * 16 * sp; a.d = rnd(46, 76);
      b.x0 = a.x0; b.y0 = a.y0; posPair(a); a.fireT = rnd(2, 3); b.fireT = a.fireT + 1.5;
    } else if (ev.k === 'swarm') {
      Gm.waveTotal -= ev.n;
      var dep = rnd(115, 150), x0 = ev.side < 0 ? rnd(40, 120) : rnd(360, 440);
      for (i = 0; i < ev.n; i++) {
        e = spawnEnemy('spam', -50, -50); if (!e) break;
        e.st = 'swarm'; e.delay = i * .13; e.a = ev.side; e.b = ev.path === 'swoop' ? 1 : 0; e.y0 = ev.y || 50; e.d = dep; e.x0 = x0; e.counts = true;
        e.fireT = rnd(1.2, 5);
      }
    }
  }
  function posPair(a) {
    var b = a.partner, r = 14, ca = Math.cos(a.a) * r, sa = Math.sin(a.a) * r * .55;
    a.x = a.x0 + ca; a.y = a.y0 + sa; if (b) { b.x = a.x0 - ca; b.y = a.y0 - sa }
  }

  /* ---------- i colpi ---------- */
  function shoot() {
    var s = Gm.ship, pw = Gm.power;
    if (Gm.nightT > 0) { pbullet(s.x, s.y - 8, rnd(-30, 30), -340, true); s.cool = .06; return }
    if (pw === 'auto') { pbullet(s.x, s.y - 8, 0, -330, false); pbullet(s.x - 5, s.y - 5, -62, -320, false); pbullet(s.x + 5, s.y - 5, 62, -320, false); s.cool = .19; sfx('shootAuto', s.x) }
    else if (pw === 'ai') { pbullet(s.x, s.y - 8, 0, -300, true); s.cool = .17; sfx('shoot', s.x) }
    else { pbullet(s.x, s.y - 8, 0, -330, false); s.cool = .2; sfx('shoot', s.x) }
    Gm.log.shots++;
  }
  function pbullet(x, y, vx, vy, home) {
    var b = take(PB); if (!b) return;
    b.x = b.px = x; b.y = b.py = y; b.vx = vx; b.vy = vy; b.home = home; b.tgt = null; b.life = 1.4;
  }
  function ebCount() { var n = 0; for (var i = 0; i < EB.length; i++) if (EB[i].on) n++; return n }
  var EBH = { ring: [4, 2], shard: [2, 2], dot: [1.5, 1.5], mail: [3, 2], alarm: [2.5, 2.5] };
  function ebullet(kind, x, y, vx, vy, cap) {
    if (cap && ebCount() >= cap) return null;
    var s = Gm.ship, dx = x - s.x, dy = y - s.y; if (dx * dx + dy * dy < 30 * 30) return null; /* mai in faccia */
    var b = take(EB); if (!b) return null;
    b.kind = kind; b.x = b.px = x; b.y = b.py = y; b.vx = vx; b.vy = vy; b.t = 0; b.ax = b.ay = 0;
    b.hw = EBH[kind][0]; b.hh = EBH[kind][1]; b.a = Math.atan2(vy, vx);
    return b;
  }
  function aimAt(x, y, sp, spread) {
    var s = Gm.ship, a = Math.atan2(s.y - y, s.x - x) + (spread || 0);
    return [Math.cos(a) * sp, Math.sin(a) * sp];
  }

  /* ---------- particelle, testi, scoppi ---------- */
  function spark(x, y, n, col, endCol, spd, up) {
    if (RM()) n = Math.ceil(n / 2);
    for (var i = 0; i < n; i++) {
      var p = take(PT); if (!p) return;
      var a = rnd(0, Math.PI * 2), v = rnd(.3, 1) * (spd || 70);
      p.x = x; p.y = y; p.vx = Math.cos(a) * v; p.vy = Math.sin(a) * v - (up || 30); p.life = p.max = rnd(.35, .8); p.col = col; p.end = endCol || C.cream; p.gr = 160;
    }
  }
  function ftext(s, x, y, col) { var f = take(FT); if (!f) { f = FT[0] } f.on = true; f.s = s; f.x = clamp(x, 20, W - 20); f.y = y; f.life = 1; f.col = col || C.cream }
  var CP = pool(16, function () { return { x: 0, y: 0, t0: 0, type: '', base: '' } });
  function corpse(e) { var c = take(CP); if (!c) return; c.x = e.x; c.y = e.y; c.t0 = RT; c.type = e.type; c.base = e.base }
  function boom(x, y, kind) { var b = take(BX); if (!b) return; b.x = x; b.y = y; b.t0 = T; b.kind = kind || 'small' }

  /* ---------- punti, combo, FLOW STATE ---------- */
  function addScore(p, x, y) {
    var m = Gm.flow ? 2 : 1, v = p * m; Gm.score += v;
    if (x != null && p >= 3) ftext('+' + v, x, y - 6, Gm.flow ? C.tomL : C.cream);
  }
  function comboKill() {
    Gm.combo++; Gm.comboT = 2.2; if (Gm.combo > Gm.best) Gm.best = Gm.combo; if (Gm.combo > Gm.ds.best) Gm.ds.best = Gm.combo;
    if (!Gm.flow && Gm.combo >= 10) { Gm.flow = true; sfx('combo'); aucall('flow', true); ftext('FLOW STATE x2', Gm.ship.x, Gm.ship.y - 18, C.tom) }
  }
  function endFlow() { if (Gm.flow) { Gm.flow = false; aucall('flow', false) } Gm.combo = 0 }

  /* ---------- nemico colpito, ucciso ---------- */
  function hitEnemy(e, dmg) {
    if (e.st === 'enter' && e.t < e.delay + .2) return false;
    if (e.type === 'noshow' && (e.st === 'out' || e.st === 'mark' || e.fade < .5)) return false;
    if (e.type === 'double') {
      var p = e.partner;
      if (p && p.on && p.marked > 0) { killEnemy(p, true); killEnemy(e, true); addScore(4, e.x, e.y - 8); ftext('SORTED', (e.x + p.x) / 2, e.y - 14, C.cream); Gm.hitStop = .06; return true }
      e.marked = 1.4; e.hit = 1; sfx('hit', e.x); return true;
    }
    e.hp -= dmg; e.hit = 1;
    if (e.hp <= 0) { killEnemy(e, false); return true }
    sfx('hit', e.x); spark(e.x, e.y, 3, C.cream, C.cream, 40);
    return true;
  }
  function killEnemy(e, quiet) {
    if (!e.on) return;
    e.on = false; if (e.counts) Gm.waveDone++;
    if (e.st === 'form' || e.st === 'enter' || e.st === 'dive' || e.st === 'out' || e.st === 'mark' || e.st === 'in' || e.st === 'ram') { if (e.c >= 0 && e.fromF) Gm.F.alive-- }
    var pts = PTS[e.type] || 1; addScore(pts, e.x, e.y);
    Gm.ds.kills++; var m = Math.min(59, (Gm.playT / 60) | 0); while (Gm.log.kills.length <= m) Gm.log.kills.push(0); Gm.log.kills[m]++;
    comboKill();
    var col = e.type === 'gold' ? C.gold : e.type === 'noshow' ? C.cream : C.p2;
    spark(e.x, e.y, art('explosion') ? 3 : e.type === 'spam' ? 5 : 9, col, C.cream, 75); boom(e.x, e.y, e.type === 'gold' ? 'gold' : e.type); corpse(e);
    if (Gm.def.party) { spark(e.x, e.y, 6, accent('fri'), C.gold, 60, 50); spark(e.x, e.y, 3, C.cream, C.p3, 50, 50) }
    if (!quiet) sfx(e.type === 'invoice' ? 'split' : 'kill', e.x);
    if (e.type === 'invoice') {
      for (var s = -1; s < 2; s += 2) { var r = spawnEnemy('receipt', e.x + s * 4, e.y); if (r) { r.st = 'fall'; r.x0 = e.x + s * 4; r.vx = s * 46; r.vy = 18; r.y0 = e.y } }
    }
    if (e.type === 'gold') dropPower(e.x, e.y, e.power);
    else if (!Gm.coinDay && Gm.day > 0 && Math.random() < .012) { Gm.coinDay = true; var c = take(PU); if (c) { c.kind = 'coin'; c.x = e.x; c.y = e.y; c.t = 0 } }
    if (e.type === 'noshow') Gm.hitStop = Math.max(Gm.hitStop, .035);
  }
  function dropPower(x, y, want) {
    var k = want;
    if (!k) {
      var c = ['auto', 'ai', 'booking', 'night'], ok = [];
      for (var i = 0; i < c.length; i++) { if (c[i] === Gm.lastDrop) continue; if (c[i] === 'night' && Gm.night) continue; if (c[i] === 'booking' && Gm.shield >= 3) continue; ok.push(c[i]) }
      k = ok[Math.random() * ok.length | 0] || 'auto';
    }
    Gm.lastDrop = k; var p = take(PU); if (!p) return; p.kind = k; p.x = x; p.y = y; p.t = 0;
  }
  function collect(p) {
    var k = p.kind; p.on = false;
    if (k === 'coin') { addScore(25, p.x, p.y); ftext('BONUS', p.x, p.y - 16, C.gold); sfx('coin', p.x); return }
    sfx('power', p.x);
    if (k === 'auto' || k === 'ai') { Gm.power = k; Gm.powerT = 10; ftext(k === 'auto' ? 'AUTOMATION' : 'AI', p.x, p.y - 12, C.goldL) }
    else if (k === 'booking') { Gm.shield = 3; sfx('shield'); ftext('BOOKING', p.x, p.y - 12, C.pink) }
    else if (k === 'night') { Gm.night = true; ftext(touchMode ? 'NIGHT SHIFT: 2 FINGERS' : 'NIGHT SHIFT: PRESS X', p.x, p.y - 12, '#8FB4FF') }
  }
  function useNight() {
    if (st !== 'play' || paused || !Gm || !Gm.night || Gm.nightT > 0) return;
    if (Gm.phase !== 'fight' && Gm.phase !== 'boss' && Gm.phase !== 'urgent') return;
    Gm.night = false; Gm.nightT = 3; sfx('night'); music('night');
    for (var i = 0; i < EB.length; i++) if (EB[i].on) { spark(EB[i].x, EB[i].y, 2, '#8FB4FF', C.cream, 30); EB[i].on = false }
  }

  /* ---------- la citta' e i colpi alla nave ---------- */
  function cityHit(x, n) {
    var rects = windowRects(), w = Gm.wins;
    for (var k = 0; k < (n || 1) * Gm.perHit; k++) {
      var best = -1, bd = 1e9;
      var shf = art('city') ? cityShift() : 0;
      for (var i = 0; i < w.length; i++) if (w[i]) { var r = rects[i] || rects[0], d = Math.abs(r.x + shf + r.w / 2 - x); if (d < bd) { bd = d; best = i } }
      if (best < 0) break; w[best] = false; Gm.winOffT[best] = .35;
    }
    Gm.cityHits += n || 1; sfx('cityHit', x); shake(2);
    var any = false; for (i = 0; i < w.length; i++) if (w[i]) { any = true; break }
    if ((!any || Gm.cityHits >= Gm.cityMax) && !god) { for (i = 0; i < w.length; i++) w[i] = false; die('closed') }
  }
  var hurtBy = '';
  function hurt(by) {
    var s = Gm.ship; hurtBy = by || '?'; if (s.inv > 0 || Gm.nightT > 0 || god || Gm.phase === 'dying' || Gm.phase === 'out') return;
    if (Gm.shield > 0) { Gm.shield--; s.inv = .8; sfx(Gm.shield ? 'shield' : 'shieldBreak', s.x); spark(s.x, s.y, 8, C.pink, C.cream, 60); clearNear(s.x, s.y, 40); return }
    Gm.log.hits++; if (DBG) { Gm.dbgHurt = Gm.dbgHurt || {}; Gm.dbgHurt[hurtBy] = (Gm.dbgHurt[hurtBy] || 0) + 1 } endFlow(); shake(5); Gm.flash = .25; Gm.glitch = .08; sfx('hurt', s.x);
    spark(s.x, s.y, 14, C.tom, C.cream, 90);
    if (!weekend) { Gm.coffee--; Gm.cupT = 1 }
    else ftext('WEEKEND MODE', s.x, s.y - 16, C.cream);
    s.inv = 2.2; Gm.power = null; Gm.powerT = 0;
    clearNear(s.x, s.y, 70);
    if (Gm.coffee <= 0) die('coffee');
  }
  function clearNear(x, y, r) { for (var i = 0; i < EB.length; i++) { var b = EB[i]; if (b.on && (b.x - x) * (b.x - x) + (b.y - y) * (b.y - y) < r * r) { b.on = false; spark(b.x, b.y, 2, C.cream, C.cream, 25) } } }
  function shake(v) { if (!RM()) Gm.shake = Math.max(Gm.shake, v) }
  function die(cause) {
    if (Gm.phase === 'dying') return;
    Gm.cause = cause; Gm.phase = 'dying'; Gm.phaseT = 0; endFlow();
    var s = Gm.ship; if (cause === 'coffee') { s.dead = true; boom(s.x, s.y, 'player'); spark(s.x, s.y, 30, C.tom, C.cream, 110) }
    music(null); sfx('gameOver');
  }

  /* ---------- il ciclo di gioco ---------- */
  function update(dt) {
    RT += dt;
    if (st === 'boot') { bootT += dt; if (bootT > 3.4) toTitle(); return }
    if (st === 'title' || st === 'form' || st === 'board') { T += dt; titleUpdate(dt); return }
    if (st === 'crawl') { T += dt; stT += dt; if (art('intro') ? crawlK >= 1 : stT > CRAWL_DUR) toMap(-1); return }
    if (st === 'over' || st === 'win' || st === 'init' || st === 'clock') { T += dt; stT += dt; ambient(dt); if (st === 'clock' && stT > mapDur()) nextDay(); if ((st === 'over' || st === 'win') && stT > 6) toInit(); return }
    if (st !== 'play' || paused) return;
    if (Gm.hitStop > 0) { Gm.hitStop -= dt; return }
    var wdt = Gm.phase === 'dying' ? dt * .35 : dt;
    T += wdt; stT += dt; Gm.phaseT += dt; Gm.playT += dt;
    if (Gm.phase !== 'dying' && Gm.phase !== 'out') Gm.dayT += dt;
    shipUpdate(wdt);
    phaseUpdate(dt);
    formationUpdate(wdt);
    enemiesUpdate(wdt);
    if (Gm.boss) bossUpdate(Gm.boss, wdt);
    hazUpdate(wdt);
    blocksUpdate(wdt);
    bulletsUpdate(wdt);
    pickupsUpdate(wdt);
    ambient(wdt);
    timers(dt);
  }
  function ambient(dt) {
    var i;
    for (i = 0; i < PT.length; i++) { var p = PT[i]; if (!p.on) continue; p.life -= dt; if (p.life <= 0) { p.on = false; continue } p.vy += p.gr * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .985 }
    for (i = 0; i < FT.length; i++) { var f = FT[i]; if (!f.on) continue; f.life -= dt * .9; f.y -= dt * 16; if (f.life <= 0) f.on = false }
    for (i = 0; i < PG.length; i++) { var q = PG[i]; if (!q.on) continue; q.life -= dt; q.vy += 30 * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.r += dt * 6; if (q.life <= 0 || q.y > H) q.on = false }
    for (i = 0; i < BX.length; i++) if (BX[i].on && T - BX[i].t0 > 1) BX[i].on = false;
    if (Gm) {
      Gm.shake = Math.max(0, Gm.shake - dt * 18); Gm.flash = Math.max(0, Gm.flash - dt * 2); Gm.glitch = Math.max(0, Gm.glitch - dt);
      for (i = 0; i < Gm.winOffT.length; i++) if (Gm.winOffT[i] > 0) Gm.winOffT[i] -= dt;
      /* i punti rotolano verso il valore vero */
      if (Gm.shown < Gm.score) Gm.shown = Math.min(Gm.score, Gm.shown + Math.max(1, (Gm.score - Gm.shown) * dt * 8));
      Gm.clockShow += (Gm.clock - Gm.clockShow) * Math.min(1, dt * 4);
      if (Gm.cupT > 0) Gm.cupT -= dt;
    }
  }
  function timers(dt) {
    var s = Gm.ship;
    if (s.inv > 0) s.inv -= dt; if (s.cool > 0) s.cool -= dt;
    if (Gm.powerT > 0) { Gm.powerT -= dt; if (Gm.powerT <= 0) { Gm.power = null } }
    if (Gm.nightT > 0) { Gm.nightT -= dt; if (Gm.nightT <= 0) { Gm.nightT = 0; music(Gm.boss ? 'boss' : DAYS[Gm.day]) } }
    if (Gm.comboT > 0) { Gm.comboT -= dt; if (Gm.comboT <= 0) endFlow() }
    /* la musica accelera quando restano pochi nemici */
    if (((RT * 2) | 0) !== ((RT * 2 - dt * 2) | 0)) {
      var k = Gm.waveTotal ? Gm.waveDone / Gm.waveTotal : 0; if (Gm.boss) k = 1 - Gm.boss.hp / Gm.boss.max;
      curInt = clamp(k, 0, 1); aucall('intensity', curInt);
    }
  }

  function shipUpdate(dt) {
    var s = Gm.ship; if (s.dead) return;
    var ax = 0, ay = 0, sp = 150;
    if (Gm.nightT > 0 || botOn) { autoPilot(dt); }
    else if (touch.on) {
      s.tx = clamp(touch.tx, 10, W - 10); s.ty = clamp(touch.ty, SHIP_MIN, SHIP_MAX);
      var dx = s.tx - s.x, dy = s.ty - s.y, d = Math.sqrt(dx * dx + dy * dy), mv = 320 * dt;
      if (d > mv) { dx *= mv / d; dy *= mv / d }
      s.vx = dx / dt; s.vy = dy / dt; s.x += dx; s.y += dy;
    } else {
      ax = keys.r - keys.l; ay = keys.d - keys.u; padAxes(); ax = clamp(ax + PAD.x, -1, 1); ay = clamp(ay + PAD.y, -1, 1);
      if (ax && ay) { ax *= .7071; ay *= .7071 }
      var k = Math.min(1, dt * 22); s.vx += (ax * sp - s.vx) * k; s.vy += (ay * sp * .85 - s.vy) * k;
      s.x += s.vx * dt; s.y += s.vy * dt;
    }
    s.x = clamp(s.x, 10, W - 10); s.y = clamp(s.y, SHIP_MIN, SHIP_MAX);
    s.bank += (clamp(s.vx / 150, -1, 1) - s.bank) * Math.min(1, dt * 10);
    var firing = keys.f || touchMode || PAD.f || Gm.nightT > 0 || botOn;
    if (firing && s.cool <= 0 && (Gm.phase === 'fight' || Gm.phase === 'boss' || Gm.phase === 'urgent' || Gm.phase === 'intro')) shoot();
    if (PAD.n) useNight();
  }
  /* il pilota automatico: Night shift e il bot di prova (con ?dldebug) */
  function autoPilot(dt) {
    var s = Gm.ship, tx = s.x, best = null, bd = 1e9, i, e;
    for (i = 0; i < EN.length; i++) { e = EN[i]; if (!e.on || e.y < 0 || e.st === 'out' || e.st === 'mark') continue; var d = Math.abs(e.x - s.x) + (CITY_Y - e.y) * .6; if (d < bd) { bd = d; best = e } }
    if (best) tx = best.x + (best.vxe || 0) * clamp((s.y - best.y) / 330, 0, 1); else if (Gm.boss) tx = Gm.boss.x;
    var ty = 182;
    if (botOn && Gm.nightT <= 0) {
      /* il bot schiva: prova posizioni vicine e sceglie quella con meno pericolo */
      var bx = s.x, by = s.y, bscore = 1e9;
      for (var ox = -48; ox <= 48; ox += 8) for (var oy = -24; oy <= 24; oy += 12) {
        var cx = clamp(s.x + ox, 12, W - 12), cy = clamp(s.y + oy, SHIP_MIN + 30, SHIP_MAX), sc = Math.abs(cx - tx) * .8 + Math.abs(ox) * .05 + Math.abs(cy - ty) * .1;
        if (HZ.st !== 'off' && cx + 6 > HZ.x && cx - 6 < HZ.x + HZ.w) sc += HZ.st === 'on' ? 5000 : 900;
        for (var j = 0; j < EB.length; j++) { var b = EB[j]; if (!b.on) continue;
          for (var k = 0; k <= 4; k++) { var tt = k * .1, px = b.x + b.vx * tt, py = b.y + b.vy * tt, ddx = px - cx, ddy = py - cy, dd = ddx * ddx + ddy * ddy; if (dd < 220) sc += (220 - dd) * (1.5 - tt * 2) } }
        for (j = 0; j < EN.length; j++) { e = EN[j]; if (!e.on) continue; var ex = e.x + e.vx * .3, ey = e.y + e.vy * .3, d2 = (ex - cx) * (ex - cx) + (ey - cy) * (ey - cy); if (d2 < 700) sc += (700 - d2) }
        for (j = 0; j < BL.length; j++) { var l = BL[j]; if (!l.on) continue; if (cx > l.x - 10 && cx < l.x + l.w + 10 && cy > l.y - 30 && cy < l.y + l.h + 30) sc += 900 }
        if (Gm.boss && Gm.boss.kind === 'monday' && Gm.boss.ph === 2) { /* sotto un varco */ }
        if (sc < bscore) { bscore = sc; bx = cx; by = cy }
      }
      for (j = 0; j < PU.length; j++) if (PU[j].on && Math.abs(PU[j].x - s.x) < 60 && PU[j].y > 120) { bx = PU[j].x; by = clamp(PU[j].y + 10, SHIP_MIN, SHIP_MAX) }
      var mv = 150 * dt, dx = bx - s.x, dy = by - s.y, dl = Math.sqrt(dx * dx + dy * dy); if (dl > mv) { dx *= mv / dl; dy *= mv / dl }
      s.vx = dx / dt; s.vy = dy / dt; s.x += dx; s.y += dy;
      if (Gm.night && bscore > 600) useNight();
      return;
    }
    var mv2 = 260 * dt, ddx2 = clamp(tx - s.x, -mv2, mv2), ddy2 = clamp(ty - s.y, -mv2 * .5, mv2 * .5);
    s.vx = ddx2 / dt; s.vy = ddy2 / dt; s.x += ddx2; s.y += ddy2;
  }

  function phaseUpdate(dt) {
    var p = Gm.phase, d = Gm.def;
    if (p === 'intro') { if (Gm.phaseT > .5 && Gm.wave < 0) startWave(0); if (Gm.phaseT > 2.4) { Gm.phase = 'fight'; Gm.phaseT = 0 } }
    if (p === 'intro' || p === 'fight') {
      var wd = Gm.wdef;
      if (wd) {
        Gm.waveT += dt;
        while (wd.ev && Gm.evI < wd.ev.length && Gm.waveT >= wd.ev[Gm.evI].at) runEvent(wd.ev[Gm.evI++]);
        var left = aliveCount(), pending = wd.ev && Gm.evI < wd.ev.length;
        var prog = (Gm.wave + (Gm.waveTotal ? Gm.waveDone / Gm.waveTotal : 0) * .97) / d.waves.length;
        Gm.clock = Math.max(Gm.clock, Math.min(.995, prog));
        Gm.overtime = Gm.waveT > 26;
        if (left === 0 && !pending && Gm.waveT > 1) {
          if (Gm.wave < d.waves.length - 1) { startWave(Gm.wave + 1) }
          else if (Gm.day === 3) { Gm.phase = 'urgent'; Gm.phaseT = 0; Gm.clock = 479 / 480; spawnBoss('urgent') }
          else clockOut();
        }
      }
    } else if (p === 'urgent') {
      if (!Gm.boss) clockOut();
    } else if (p === 'monin') {
      /* l'entrata di MONDAY: la musica si ferma, la sveglia, il calendario scende e strappa SUNDAY */
      if (!Gm.boss) spawnBoss('monday');
      var b = Gm.boss, k = Gm.phaseT;
      b.y = -70 + easeOut(k / 2.2) * 148; b.x = 240;
      if (k > 1.2 && Gm.monIn === 0) { Gm.monIn = 1; sfx('alarm') }
      if (k > 2.6 && Gm.monIn === 1) { Gm.monIn = 2; sfx('rip'); Gm.glitch = .25; shake(4); Gm.ripT = T }
      if (k > 4.6) { Gm.phase = 'boss'; Gm.phaseT = 0; music('boss'); b.t = 0 }
    } else if (p === 'boss') {
      if (Gm.boss) { var bb = Gm.boss; Gm.clock = Math.min(.999, 1 - bb.hp / bb.max) }
    } else if (p === 'out') {
      Gm.clock = 1; if (Gm.won) { if (Gm.phaseT > 2.6) winGame() } else if (Gm.phaseT > 1.4) toMap(Gm.day);
    } else if (p === 'dying') {
      if (Gm.phaseT > 2) gameOver();
    }
  }
  /* le insegne acide (THU): avviso onesto di un secondo, poi la colonna brucia */
  var HZ = { st: 'off', x: 0, w: 22, t: 0, next: 5 };
  function hazUpdate(dt) {
    if (!Gm.def.acid || Gm.phase !== 'fight') { HZ.st = 'off'; return }
    HZ.t += dt;
    if (HZ.st === 'off') { HZ.next -= dt; if (HZ.next <= 0) { HZ.st = 'warn'; HZ.t = 0; HZ.x = clamp(Gm.ship.x + rnd(-50, 50), 20, W - 20 - HZ.w); sfx('blip', HZ.x) } }
    else if (HZ.st === 'warn' && HZ.t > 1.1) { HZ.st = 'on'; HZ.t = 0; sfx('cityHit', HZ.x); shake(2) }
    else if (HZ.st === 'on') {
      var s = Gm.ship; if (!s.dead && s.x + 2 > HZ.x && s.x - 2 < HZ.x + HZ.w && s.y > 128) hurt('acid');
      if (HZ.t > .8) { HZ.st = 'off'; HZ.next = rnd(4.5, 7) }
    }
  }
  function drawHaz(t) {
    if (HZ.st === 'off') return;
    var ac = accent('thu'), x = Math.round(HZ.x);
    if (HZ.st === 'warn') { if (((t * 12) | 0) % 2) { for (var y = 132; y < CITY_Y; y += 4) { R(x, y, 1, 2, ac); R(x + HZ.w - 1, y, 1, 2, ac) } } txt('!', x + HZ.w / 2, 134, ac, 1, 'c'); return }
    g.globalAlpha = .55 + .25 * Math.sin(t * 60); R(x, 128, HZ.w, CITY_Y - 128, ac); g.globalAlpha = 1;
    R(x + HZ.w / 2 - 1, 128, 2, CITY_Y - 128, C.cream);
    for (var i = 0; i < 3; i++) R(x + rnd(0, HZ.w), rnd(130, CITY_Y), 1, 2, C.cream);
  }
  function aliveCount() { var n = 0; for (var i = 0; i < EN.length; i++) if (EN[i].on && EN[i].counts) n++; return n }
  function clockOut() {
    Gm.phase = 'out'; Gm.phaseT = 0; Gm.clock = 1; sfx('clockOut'); endFlow();
    for (var i = 0; i < EB.length; i++) if (EB[i].on) { spark(EB[i].x, EB[i].y, 2, C.cream, C.cream, 20); EB[i].on = false }
    var bonus = Math.max(0, Math.round((55 - Gm.dayT) / 3)); Gm.ds.bonus = bonus; Gm.score += bonus;
    Gm.log.days.push([Math.round(Gm.playT * 10) / 10, Math.floor(Gm.score)]);
    /* pausa caffe' dopo WED e riposo della domenica: una tazza in piu' (massimo tre) */
    if ((Gm.day === 1 || Gm.day === 5) && Gm.coffee < 3 && !weekend) { Gm.coffee++; Gm.ds.rest = true }
  }
  /* la mappa del mondo tra un giorno e l'altro: pochi secondi, si salta */
  function toMap(from) {
    st = 'clock'; stT = 0; Gm.mapFrom = from; clearPool(EB); clearPool(PB);
    if (from >= 0) music(null);
    var a = window.DEADLINE_ART; try { if (a && a.prepareDay) a.prepareDay(DAYS[from + 1] || 'mon'); if (a && a.prepareBoss && from >= 4) a.prepareBoss() } catch (e) {}
  }
  function mapDur() { return Gm.mapFrom < 0 ? 2.2 : 3.6 }
  function nextDay() { startDay(Math.min(6, Gm.mapFrom + 1)) }
  /* l'intro che scorre, una volta per sessione */
  var CRAWL = ['Not long ago, in an office', 'not so far away...', '', 'Small businesses are under attack.', '', 'Missed calls. Paper invoices.', 'No-shows. Spam.', '',
    'Every week the chores multiply.', '', 'And at the end of every week', 'waits the worst of them all:', 'MONDAY.', '', 'One machine was built to fight back.', '',
    'Save the hours.', 'Protect the city.', '', 'Beat MONDAY before the deadline.'];
  var CRAWL_SP = 26, CRAWL_DUR = (236 + CRAWL.length * 15 - 30) / CRAWL_SP;
  function crawlSeen() { try { return sessionStorage.getItem('mm-deadline-crawl') === '1' } catch (e) { return false } }
  var CRAWL_ART = ['Not long ago, in an office not so far away...', 'Small businesses are under attack.', 'Missed calls. Paper invoices. No-shows. Spam.', 'Every week the chores multiply.',
    'And at the end of every week waits the worst of them all: MONDAY.', 'One machine was built to fight back.', 'Save the hours. Protect the city.', 'Beat MONDAY before the deadline.'];
  var crawlK = 0;
  function drawCrawl() {
    if (art('intro')) { try { crawlK = AR.intro(g, stT, CRAWL_ART, { speed: 15 }); txt(touchMode ? 'Tap to skip' : 'Any key to skip', W - 6, H - 10, C.p3, 1, 'r'); hot.push({ x: 0, y: 0, w: W, h: H, id: 'cont' }); return } catch (e) { fail('intro', e) } }
    dSky('night', T); R(0, 0, W, H, 'rgba(6,11,30,.45)');
    for (var i = 0; i < CRAWL.length; i++) {
      var y = 236 + i * 15 - stT * CRAWL_SP; if (y < 20 || y > H) continue;
      /* finta prospettiva: grande in basso, piccolo e spento in alto */
      var big = y > 150, a = clamp((y - 20) / 70, 0, 1), mon = CRAWL[i] === 'MONDAY.';
      g.globalAlpha = a; txt(CRAWL[i], 240, y, mon ? C.crim : C.goldL, big || mon ? 2 : 1, 'c', C.night);
    }
    g.globalAlpha = 1;
    txt(touchMode ? 'Tap to skip' : 'Any key to skip', W - 6, H - 10, C.p3, 1, 'r');
    hot.push({ x: 0, y: 0, w: W, h: H, id: 'cont' });
  }
  var MAPDONE = [false, false, false, false, false, false, false];
  var MAPN = [[48, 214], [108, 186], [168, 210], [228, 178], [288, 204], [348, 172], [424, 128]];
  function mapLabels(a, from, to) {
    for (var i = 0; i < 7; i++) {
      var n = a.mapNode ? a.mapNode(i) : { x: MAPN[i][0], y: MAPN[i][1] }, nm = DAYNAME[DAYS[i]], w = tw(nm, 1), x = clamp(n.x - w / 2, 2, W - w - 2), y = n.y + 8;
      var col = i === 6 ? C.crim : i <= from ? C.cream : i === to ? C.tom : C.g2;
      R(x - 2, y - 1, w + 4, lh(1) + 2, C.night); txt(nm, x, y, col, 1);
    }
  }
  function drawMap() {
    var from = Gm.mapFrom, to = Math.min(6, from + 1), k = from < 0 ? 0 : easeIO((stT - .7) / 1.4), pos = from < 0 ? 0 : from + k;
    var pulse = (Math.sin(RT * 6) + 1) / 2, a = art('map'), drawn = false;
    if (a) { for (var di = 0; di < 7; di++) MAPDONE[di] = di <= from; try { a.map(g, T, { current: k >= 1 || from < 0 ? to : from, done: MAPDONE, shipPos: pos, unlocked: k >= 1 || from < 0 ? to + 1 : to, pulse: pulse, labels: false, ship: true }); drawn = true; mapLabels(a, from, to) } catch (e) { fail('map', e) } }
    if (!drawn) {
      dSky('night', T); R(0, 96, W, H - 96, 'rgba(6,10,24,.75)');
      for (var i = 0; i < 6; i++) { var p0 = MAPN[i], p1 = MAPN[i + 1], n = 24, lit = i < from || (i === from && k >= 1);
        for (var j = 0; j < n; j += 2) { var q = j / n, x = p0[0] + (p1[0] - p0[0]) * q, y = p0[1] + (p1[1] - p0[1]) * q; if (i === from && q > k) lit = false; R(x, y, 2, 1, lit ? C.tom : C.g3) } }
      R(MAPN[6][0] - 9, MAPN[6][1] - 70, 18, 70, '#16070A'); R(MAPN[6][0] - 7, MAPN[6][1] - 66, 14, 10, C.crim);
      for (i = 0; i < 7; i++) {
        var nx = MAPN[i][0], ny = MAPN[i][1], done = i <= from, cur = i === to, d = DAYS[i];
        R(nx - 6, ny - 4, 13, 9, C.night); R(nx - 5, ny - 3, 11, 7, done ? accent(d) : cur ? (pulse > .5 ? C.tom : C.tomD) : C.g4);
        if (done) { R(nx - 2, ny, 1, 1, C.night); R(nx - 1, ny + 1, 1, 1, C.night); R(nx, ny, 1, 1, C.night); R(nx + 1, ny - 1, 1, 1, C.night); R(nx + 2, ny - 2, 1, 1, C.night) }
        txt(DAYNAME[d], nx, ny + 9, done ? C.cream : cur ? C.tom : C.p4, 1, 'c');
      }
    }
    /* la nave lungo la strada */
    var i0 = Math.min(5, Math.floor(pos)), f = pos - i0, A = MAPN[i0], B = MAPN[Math.min(6, i0 + 1)];
    if (!drawn) { SS.bank = 0; SS.thrust = .6; SS.shield = 0; SS.flash = false; SS.power = null; dShip(A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f - 16, T) }
    /* il riepilogo del giorno finito, compatto, in alto */
    var nd = DAYS[to];
    if (from >= 0) {
      var y0 = 12, X0 = 14, X1 = 214, XC = 114; panel(X0, y0, 200, 62);
      txt('CLOCKED OUT 17:00', XC, y0 + 6, C.cream, 1, 'c');
      txt(DAYNAME[DAYS[from]] + ' DONE', XC, y0 + 17, accent(DAYS[from]), 1, 'c');
      txt('Hours +' + Math.round(Gm.score - Gm.ds.h0), X0 + 8, y0 + 31, C.p2, 1); txt('Jobs ' + Gm.ds.kills, X1 - 8, y0 + 31, C.p2, 1, 'r');
      txt('Streak ' + Gm.ds.best, X0 + 8, y0 + 43, C.p2, 1); txt('Lit ' + countLit() + '/' + Gm.wins.length, X1 - 8, y0 + 43, C.p2, 1, 'r');
      if (Gm.ds.bonus && !Gm.ds.rest) txt('+' + Gm.ds.bonus + ' on time', XC, y0 + 52, C.p3, 1, 'c');
      if (Gm.ds.rest) txt((from === 1 ? 'Coffee break' : 'Rested') + ': +1 coffee', XC, y0 + 52, C.pink, 1, 'c');
    }
    var ky = from >= 0 ? 80 : 16, ka = clamp((stT - (from >= 0 ? 1.8 : .3)) * 3, 0, 1);
    g.globalAlpha = ka; panel(14, ky, 200, 26);
    txt(nd === 'mon' ? 'MONDAY' : DAYNAME[nd], 114, ky + 5, nd === 'mon' ? C.crim : C.cream, 1, 'c');
    txt(DEF[nd].teaser, 114, ky + 15, C.p3, 1, 'c'); g.globalAlpha = 1;
    if (stT > .6) hot.push({ x: 0, y: 0, w: W, h: H, id: 'cont' });
  }

  function formationUpdate(dt) {
    var F = Gm.F; if (!F.on) return;
    var wd = Gm.wdef, alive = 0, minX = 1e9, maxX = -1e9, maxY = 0, i, e;
    for (i = 0; i < EN.length; i++) { e = EN[i]; if (!e.on || !e.fromF || e.st !== 'form') continue; alive++; if (e.x < minX) minX = e.x; if (e.x > maxX) maxX = e.x; if (e.y > maxY) maxY = e.y }
    var tot = Math.max(1, F.total), k = 1 - countF() / tot;
    var sp = wd.march * Gm.def.speed * (1 + k * 1.3);
    F.x += F.dir * sp * dt;
    if (alive) {
      if (maxX > W - 16 && F.dir > 0) { F.dir = -1; F.y += 4 } else if (minX < 16 && F.dir < 0) { F.dir = 1; F.y += 4 }
    }
    F.y += wd.creep * (Gm.overtime ? 4 : 1) * dt;
    /* tuffi e spari della formazione */
    if (Gm.phase !== 'fight') return;
    if (wd.dive) { Gm.diveT -= dt; if (Gm.diveT <= 0) { Gm.diveT = wd.dive * rnd(.7, 1.2) / Gm.def.speed; diveOne() } }
    if (wd.fire) { Gm.fireT -= dt; if (Gm.fireT <= 0) { Gm.fireT = wd.fire * rnd(.7, 1.25) / Gm.def.speed; formFire() } }
  }
  function countF() { var n = 0; for (var i = 0; i < EN.length; i++) if (EN[i].on && EN[i].fromF) n++; return n }
  function diveOne() {
    var c = null, n = 0;
    for (var i = 0; i < EN.length; i++) { var e = EN[i]; if (!e.on || e.st !== 'form' || !(e.type === 'call' || e.type === 'noshow')) continue; n++; if (Math.random() < 1 / n) c = e }
    if (!c) return;
    if (c.type === 'call') { c.st = 'dive'; c.t = 0; c.x0 = c.x; c.y0 = c.y; c.a = rnd(0, 6.28); c.fireT = rnd(.6, 1.2) }
    else { c.st = 'out'; c.t = 0; sfx('blip', c.x) }
  }
  function formFire() {
    /* spara il piu' basso di una colonna, di solito vicino alla nave */
    var s = Gm.ship, best = null, bs = -1e9;
    for (var i = 0; i < EN.length; i++) {
      var e = EN[i]; if (!e.on || e.st !== 'form' || e.type === 'noshow' || e.charge > 0) continue;
      var below = false; for (var j = 0; j < EN.length; j++) { var o = EN[j]; if (o.on && o !== e && o.st === 'form' && o.c === e.c && o.y > e.y) { below = true; break } }
      if (below) continue;
      var sc = -Math.abs(e.x - s.x) + rnd(0, 120); if (sc > bs) { bs = sc; best = e }
    }
    if (best) best.charge = .35; /* lampeggia prima di sparare */
  }
  function enemyShot(e) {
    var sp = 70 * Gm.def.speed, v;
    if (e.type === 'call' || (e.type === 'gold' && e.base === 'call')) { v = aimAt(e.x, e.y, sp * .9, 0); ebullet('ring', e.x, e.y + 6, v[0] * .5, Math.max(40, v[1]), Gm.wdef ? Gm.wdef.cap : 4) }
    else if (e.type === 'invoice') ebullet('shard', e.x, e.y + 8, 0, sp * 1.25, Gm.wdef ? Gm.wdef.cap : 4);
    else if (e.type === 'double') { v = aimAt(e.x, e.y, sp * 1.1, 0); ebullet('shard', e.x, e.y + 6, v[0], v[1], Gm.wdef ? Gm.wdef.cap + 1 : 5) }
    else if (e.type === 'spam') { v = aimAt(e.x, e.y, sp * 1.3, 0); ebullet('dot', e.x, e.y + 4, v[0], v[1], Gm.wdef ? Gm.wdef.cap + 1 : 5) }
  }

  function enemiesUpdate(dt) {
    var s = Gm.ship, sp = Gm.def.speed, F = Gm.F;
    for (var i = 0; i < EN.length; i++) {
      var e = EN[i]; if (!e.on) continue;
      e.ox = e.x; e.t += dt; if (e.hit > 0) e.hit -= dt * 7; if (e.marked > 0) { e.marked -= dt; if (e.marked <= 0) ftext('STILL DOUBLE', e.x, e.y - 10, C.p2) }
      if (e.charge > 0) { e.charge -= dt; if (e.charge <= 0) { e.charge = 0; enemyShot(e) } }
      switch (e.st) {
        case 'enter': {
          var k = easeOut((e.t - e.delay) / 1.1); if (e.t < e.delay) k = 0;
          e.x = e.x0 + (slotX(e) - e.x0) * k; e.y = e.y0 + (slotY(e) - e.y0) * k;
          if (k >= 1) e.st = 'form'; break;
        }
        case 'form':
          e.x = slotX(e); e.y = slotY(e);
          if (e.y > CITY_Y - 4) { cityHit(e.x); e.on = false; F.alive--; if (e.counts) Gm.waveDone++; spark(e.x, CITY_Y, 8, C.cream, C.cream, 50) }
          break;
        case 'dive': /* la chiamata scende a zig-zag e squilla */
          e.x0 += clamp(s.x - e.x0, -1, 1) * 18 * dt;
          e.y += 52 * sp * dt; e.x = e.x0 + Math.sin(e.a + e.t * 3.2) * 32; e.vy = 52 * sp;
          e.fireT -= dt; if (e.fireT <= 0 && e.y < s.y - 50) { e.fireT = rnd(1.1, 1.8); e.charge = .25 }
          if (e.y > CITY_Y) { cityHit(e.x); e.on = false; Gm.F.alive--; if (e.counts) Gm.waveDone++ }
          break;
        case 'out': /* il no-show sparisce... */
          e.fade = Math.max(0, .65 - e.t / .4 * .65);
          if (e.t > .4) { e.st = 'mark'; e.t = 0; var side = Math.random() < .5 ? -1 : 1; if (s.x < 70) side = 1; if (s.x > 410) side = -1;
            e.x = clamp(s.x + side * rnd(48, 74), 16, W - 16); e.y = clamp(s.y - rnd(70, 90), 34, 150); }
          break;
        case 'mark': /* ...lascia il segno dove riappare... */
          e.fade = 0; if (e.t > .8) { e.st = 'in'; e.t = 0; sfx('blip', e.x) } break;
        case 'in':
          e.fade = Math.min(1, e.t / .25);
          if (e.t > .45) { e.st = 'ram'; e.t = 0; var dx = s.x - e.x, dy = s.y - e.y, d = Math.sqrt(dx * dx + dy * dy) || 1, v = 150 * sp; e.vx = dx / d * v; e.vy = dy / d * v }
          break;
        case 'ram': /* ...e ti viene addosso */
          e.x += e.vx * dt; e.y += e.vy * dt;
          if (e.y > H + 20 || e.x < -20 || e.x > W + 20) { e.on = false; if (e.counts) Gm.waveDone++ }
          break;
        case 'fall': /* la ricevuta cade come una foglia */
          e.vx *= Math.pow(.2, dt); e.x0 += e.vx * dt; e.y += (e.vy + 6 * sp) * dt; e.x = e.x0 + Math.sin(e.t * 2.6) * 9; e.vy = 26;
          if (e.y > CITY_Y) { cityHit(e.x); e.on = false; if (e.counts) Gm.waveDone++ }
          break;
        case 'swarm': {
          var u = e.t - e.delay; if (u < 0) { e.x = -60; e.y = -60; break }
          if (e.b) { /* in picchiata a U */
            var dur = 3.4 / sp, q = u / dur; e.x = e.x0 + e.a * -1 * q * 300 * (e.x0 > 240 ? 1 : -1) * -1; e.y = -12 + Math.sin(Math.PI * clamp(q, 0, 1)) * e.d + Math.sin(u * 7) * 3;
            e.x = e.x0 + (e.x0 < 240 ? 1 : -1) * q * 260; if (q > 1.05) { e.on = false; if (e.counts) Gm.waveDone++ }
          } else { /* a onda, da un lato all'altro */
            var vx = 112 * sp; e.x = e.a < 0 ? -12 + u * vx : W + 12 - u * vx; e.y = e.y0 + Math.sin(u * 3.4) * 20;
            if (u * vx > W + 30) { e.on = false; if (e.counts) Gm.waveDone++ }
          }
          if (e.x > 8 && e.x < W - 8 && e.y > 10) { e.fireT -= dt; if (e.fireT <= 0) { e.fireT = rnd(2.5, 6); if (Math.random() < .35) enemyShot(e) } }
          break;
        }
        case 'pair':
          if (e.lead) {
            if (e.y0 < e.d) e.y0 += 40 * dt; else e.y0 += 2.2 * sp * dt;
            e.x0 += e.vx * dt; if (e.x0 < 40 && e.vx < 0 || e.x0 > W - 40 && e.vx > 0) e.vx = -e.vx;
            e.a += dt * 1.5; posPair(e);
            if (e.y0 > CITY_Y - 6) { cityHit(e.x0, 2); e.on = false; if (e.partner) { e.partner.on = false; Gm.waveDone++ } Gm.waveDone++ }
          } else if (!e.partner || !e.partner.on) { e.lead = true }
          e.fireT -= dt; if (e.fireT <= 0 && Gm.phase === 'fight') { e.fireT = rnd(3, 4.4); e.charge = .3 }
          break;
        case 'cross':
          e.x += e.vx * dt; e.y = e.y0 + Math.sin(e.t * 3) * 6;
          if (e.x < -20 || e.x > W + 20) { e.on = false; if (e.counts) Gm.waveDone++ }
          break;
      }
      if (!e.on) continue;
      e.vxe = (e.x - e.ox) / dt;
      /* contatto con la nave */
      var hb = HB[e.type === 'gold' ? e.base : e.type] || HB.call;
      if (!s.dead && e.fade > .5 && Math.abs(e.x - s.x) < hb[0] + 3 && Math.abs(e.y - s.y) < hb[1] + 3) {
        if (s.inv <= 0 && Gm.nightT <= 0 && !god) { hurt('body-' + e.type + '-' + e.st); if (e.type !== 'double') killEnemy(e, false) }
        else if (Gm.nightT > 0) killEnemy(e, false);
      }
      /* tuffi contro i firewall: il firewall assorbe */
      if ((e.st === 'dive' || e.st === 'ram' || e.st === 'fall') && e.y > FW_Y - 4 && e.y < FW_Y + 18) {
        if (fwErase(e.x, e.y + hb[1], 5, 1)) { e.on = false; if (e.counts) Gm.waveDone++; spark(e.x, e.y, 8, C.g1, C.cream, 50); sfx('hit', e.x) }
      }
    }
  }

  function fwAt(x, y) {
    for (var i = 0; i < fws.length; i++) { var f = fws[i], lx = (x - f.x) | 0, ly = (y - f.y) | 0; if (lx >= 0 && lx < 36 && ly >= 0 && ly < 14 && f.mask[ly * 36 + lx]) return f }
    return null;
  }
  /* il firewall si consuma pixel per pixel */
  function fwErase(x, y, r, force) {
    var f = null;
    for (var dy = -r; dy <= r && !f; dy++) for (var dx = -r; dx <= r && !f; dx++) if (dx * dx + dy * dy <= r * r) f = fwAt(x + dx, y + dy);
    if (!f && !force) return false; if (!f) return false;
    var cx = (x - f.x) | 0, cy = (y - f.y) | 0, rr = r + 1;
    for (dy = -rr; dy <= rr; dy++) for (dx = -rr; dx <= rr; dx++) {
      var px = cx + dx, py = cy + dy; if (px < 0 || px > 35 || py < 0 || py > 13) continue;
      var d2 = dx * dx + dy * dy; if (d2 <= r * r * .5 || (d2 <= rr * rr && Math.random() < .5)) f.mask[py * 36 + px] = 0;
    }
    f.dirty = true; spark(x, y, 2, C.g1, C.cream, 30);
    return true;
  }

  function bulletsUpdate(dt) {
    var i, j, b, e, s = Gm.ship, bo = Gm.boss;
    for (i = 0; i < PB.length; i++) {
      b = PB[i]; if (!b.on) continue;
      b.px = b.x; b.py = b.y; b.life -= dt;
      if (b.home) { /* l'AI curva verso il nemico piu' vicino */
        if (!b.tgt || !b.tgt.on || (b.tgt.fade != null && b.tgt.fade < .5)) b.tgt = nearest(b.x, b.y);
        var tx = null, ty = null;
        if (b.tgt) { tx = b.tgt.x; ty = b.tgt.y } else if (bo && bo.on) { tx = bo.x; ty = bo.y }
        if (tx != null) { var sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy), a = Math.atan2(b.vy, b.vx), want = Math.atan2(ty - b.y, tx - b.x), da = want - a;
          while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; a += clamp(da, -7 * dt, 7 * dt); b.vx = Math.cos(a) * sp; b.vy = Math.sin(a) * sp }
      }
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.y < -8 || b.x < -8 || b.x > W + 8 || b.life <= 0 || b.y > H) { b.on = false; continue }
      if (b.y > FW_Y - 4 && b.y < FW_Y + 18 && (fwAt(b.x, b.y) || fwAt(b.x, b.y + 2))) { fwErase(b.x, b.y, 2); b.on = false; continue }
      /* controllo esteso sul tratto percorso: niente colpi che passano attraverso */
      var y0 = Math.min(b.y, b.py), y1 = Math.max(b.y, b.py) + 4, x0 = Math.min(b.x, b.px), x1 = Math.max(b.x, b.px);
      var hitAny = false;
      for (j = 0; j < EN.length; j++) {
        e = EN[j]; if (!e.on || e.y < -4) continue;
        var hb = HB[e.type === 'gold' ? e.base : e.type] || HB.call;
        if (x1 + 1 > e.x - hb[0] && x0 - 1 < e.x + hb[0] && y1 > e.y - hb[1] && y0 < e.y + hb[1]) {
          if (hitEnemy(e, 1)) { b.on = false; hitAny = true; boom(b.x, b.y, 'impact'); if (!art('explosion')) spark(b.x, b.y, 3, C.tom, C.tomL, 40); break }
        }
      }
      if (hitAny) continue;
      for (j = 0; j < BL.length; j++) { var l = BL[j]; if (l.on && b.x > l.x && b.x < l.x + l.w && y1 > l.y && y0 < l.y + l.h) { l.hp--; l.hit = 1; b.on = false; spark(b.x, l.y + l.h, 3, C.tom, C.cream, 40); if (l.hp <= 0) { l.on = false; spark(l.x + l.w / 2, l.y + l.h / 2, 12, accent('mon'), C.cream, 70); sfx('kill', l.x); addScore(1, l.x + l.w / 2, l.y) } else sfx('hit', b.x); hitAny = true; break } }
      if (hitAny) continue;
      if (bo && bo.on && bo.vuln && Math.abs(b.x - bo.x) < bo.hw && y1 > bo.y - bo.hh && y0 < bo.y + bo.hh) { b.on = false; bossDamage(bo, 1, b.x, b.y) }
    }
    for (i = 0; i < EB.length; i++) {
      b = EB[i]; if (!b.on) continue;
      b.t += dt; b.px = b.x; b.py = b.y; b.vx += b.ax * dt; b.vy += b.ay * dt; b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.y > H + 6 || b.y < -30 || b.x < -10 || b.x > W + 10) { b.on = false; continue }
      if (b.y > FW_Y - 3 && b.y < FW_Y + 17 && fwAt(b.x, b.y + b.hh)) { fwErase(b.x, b.y + b.hh, b.kind === 'mail' || b.kind === 'alarm' ? 3 : 2); b.on = false; continue }
      if (b.y > CITY_Y + 2) { b.on = false; spark(b.x, CITY_Y + 2, 2, C.cream, C.cream, 20); continue }
      /* la hitbox della nave e' il pixel della cabina, poco piu' */
      if (!s.dead) {
        var hx = 2, hy = 2.5, hbo = art('ship') && AR.hitbox ? AR.hitbox : null, sy = s.y + (hbo ? hbo.dy : -2); s.hx = s.x + (hbo ? hbo.dx || 0 : 0);
        var by0 = Math.min(b.y, b.py) - b.hh, by1 = Math.max(b.y, b.py) + b.hh, bx0 = Math.min(b.x, b.px) - b.hw, bx1 = Math.max(b.x, b.px) + b.hw;
        if (Gm.shield > 0) { hx = 9; hy = 9 }
        if (bx1 > s.hx - hx && bx0 < s.hx + hx && by1 > sy - hy && by0 < sy + hy) {
          if (s.inv <= 0 && Gm.nightT <= 0 && !god && Gm.phase !== 'dying') { b.on = false; hurt('b-' + b.kind) }
        }
      }
    }
  }
  function nearest(x, y) {
    var best = null, bd = 1e9;
    for (var i = 0; i < EN.length; i++) { var e = EN[i]; if (!e.on || e.y < 0 || e.y > y || (e.fade < .5)) continue; var d = (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y) * .5; if (d < bd) { bd = d; best = e } }
    return best;
  }
  function pickupsUpdate(dt) {
    var s = Gm.ship;
    for (var i = 0; i < PU.length; i++) {
      var p = PU[i]; if (!p.on) continue; p.t += dt; p.y += 36 * dt; p.x += Math.sin(p.t * 2) * 12 * dt;
      if (!s.dead && Math.abs(p.x - s.x) < 13 && Math.abs(p.y - s.y) < 13) collect(p);
      else if (p.y > CITY_Y) p.on = false;
    }
  }

  /* ---------- i boss: URGENT (venerdi' 16:59) e MONDAY ---------- */
  function spawnBoss(kind) {
    var b = { on: true, kind: kind, x: 240, y: -50, hp: 0, max: 0, t: 0, ph: 1, pt: 0, pi: 0, hit: 0, rage: 0, torn: 0, mouth: 0, hw: 0, hh: 0, vuln: false, dir: 1, dead: false, dieT: 0, sp: 0, spawned: false };
    if (kind === 'urgent') { b.max = b.hp = 42; b.hw = 28; b.hh = 17; sfx('urgent'); ftext('16:59  URGENT', 240, 110, C.crim); music('boss') }
    else { b.max = b.hp = 210; b.hw = 62; b.hh = 40; b.phMax = [0, 70, 140, 210] }
    Gm.boss = b;
  }
  function bossDamage(b, d, x, y) {
    if (b.dead) return;
    b.hp -= d; b.hit = 1; sfx('bossHit', x); spark(x, y, 3, C.tom, C.cream, 50); Gm.log.bossHits = (Gm.log.bossHits || 0) + 1;
    if (b.kind === 'monday') {
      var torn = Math.floor((1 - b.hp / b.max) * 12);
      while (b.torn < torn) { b.torn++; tearPage(b); }
      var ph = b.hp > 140 ? 1 : b.hp > 70 ? 2 : 3;
      if (ph !== b.ph && b.hp > 0) { b.ph = ph; b.pt = 0; b.pi = 0; Gm.hitStop = .15; shake(6); Gm.glitch = .3; sfx('rip'); clearEB(); if (ph === 3) clearBlocks(); ftext(ph === 2 ? 'MEETINGS' : '9:00 ALARM', 240, 120, C.cream) }
    }
    if (b.hp <= 0) {
      b.hp = 0; b.dead = true; b.vuln = false; b.dieT = 0; Gm.hitStop = .25; shake(8); sfx('bossDie'); clearEB(); clearBlocks();
      addScore(b.kind === 'urgent' ? 40 : 150, b.x, b.y); comboKill();
    }
  }
  function clearEB() { for (var i = 0; i < EB.length; i++) if (EB[i].on) { spark(EB[i].x, EB[i].y, 2, C.cream, C.cream, 25); EB[i].on = false } }
  function clearBlocks() { for (var i = 0; i < BL.length; i++) if (BL[i].on) { spark(BL[i].x + BL[i].w / 2, BL[i].y, 6, accent('mon'), C.cream, 50); BL[i].on = false } }
  function tearPage(b) {
    var p = take(PG); if (!p) return; p.x = b.x + rnd(-40, 40); p.y = b.y - 20; p.vx = rnd(-50, 50); p.vy = rnd(-60, -20); p.r = 0; p.life = 3;
    sfx('rip', b.x);
  }
  function bossUpdate(b, dt) {
    b.t += dt; if (b.hit > 0) b.hit -= dt * 6;
    var s = Gm.ship, i, v, a;
    if (b.dead) {
      b.dieT += dt;
      if (((b.dieT * 8) | 0) !== (((b.dieT - dt) * 8) | 0)) { var ex = b.x + rnd(-b.hw, b.hw), ey = b.y + rnd(-b.hh, b.hh); boom(ex, ey, 'boss'); spark(ex, ey, 10, b.kind === 'urgent' ? C.crim : C.cream, C.cream, 90); sfx('kill', ex); if (b.kind === 'monday') tearPage(b) }
      if (b.dieT > 2.2) {
        b.on = false; Gm.boss = null;
        if (b.kind === 'monday') { Gm.won = true; Gm.log.boss = Math.round(Gm.playT * 10) / 10; clockOut(); Gm.phase = 'out'; music('win') }
      }
      return;
    }
    if (b.kind === 'urgent') {
      if (b.t < 1.6) { b.y = -40 + easeOut(b.t / 1.6) * 92; b.vuln = false; return }
      b.vuln = true; b.x = 240 + Math.sin((b.t - 1.6) * .7) * 150; b.y = 52 + Math.sin(b.t * 1.7) * 6;
      b.pt += dt; b.mouth = b.hp / b.max;
      /* tre buste mirate, poi un ventaglio di schegge */
      if (b.pi % 3 < 2 && b.pt > 1.3) { b.pt = 0; b.pi++; for (i = -1; i <= 1; i++) { v = aimAt(b.x, b.y + 16, 88, i * .2); ebullet('mail', b.x, b.y + 16, v[0], v[1], 40) } }
      else if (b.pi % 3 === 2 && b.pt > 1.6) { b.pt = 0; b.pi++; for (i = 0; i < 11; i++) { a = Math.PI * (.12 + .76 * i / 10); ebullet('shard', b.x, b.y + 10, Math.cos(a) * 62, Math.sin(a) * 62, 40) } }
      if (!b.spawned && b.hp < b.max / 2) { b.spawned = true; runEvent({ k: 'swarm', n: 6, path: 'sine', side: s.x < 240 ? 1 : -1, y: 90 }) }
      return;
    }
    /* MONDAY */
    if (Gm.phase === 'monin') { b.vuln = false; return }
    b.vuln = true; b.pt += dt;
    var ph = b.ph; b.rage = ph === 3 ? 1 : ph === 2 ? .4 : 0; b.mouth = .3 + .7 * Math.abs(Math.sin(b.t * (ph === 3 ? 9 : 3)));
    if (ph === 1) {
      b.x = 240 + Math.sin(b.t * .5) * 120; b.y = 78 + Math.sin(b.t * 1.3) * 3;
      /* raffiche di email: ventaglio mirato e "reply all" a spazzata */
      var cyc = b.pt % 5.2;
      if (cyc < dt) { for (i = -2; i <= 2; i++) { v = aimAt(b.x, b.y + 30, 86, i * .2); ebullet('mail', b.x, b.y + 30, v[0], v[1], 70) } }
      if (cyc > 1.6 && cyc < 3.4) { b.sp += dt; if (b.sp > .1) { b.sp = 0; a = Math.PI * (.15 + .7 * ((cyc - 1.6) / 1.8)); if (b.pi % 2) a = Math.PI - a; ebullet('mail', b.x, b.y + 26, Math.cos(a) * 72, Math.sin(a) * 72, 70) } }
      if (cyc > 3.4 && cyc - dt <= 3.4) b.pi++;
      if (cyc > 4 && cyc - dt <= 4) { for (i = -1; i <= 1; i++) { v = aimAt(b.x, b.y + 30, 96, i * .12); ebullet('mail', b.x, b.y + 30, v[0], v[1], 70) } }
    } else if (ph === 2) {
      b.x += (240 + Math.sin(b.t * .4) * 60 - b.x) * Math.min(1, dt * 2); b.y += (72 - b.y) * Math.min(1, dt * 2);
      /* muri di riunioni con un varco */
      if (b.pt > 3.3) { b.pt = 0; wall() }
      b.sp += dt; if (b.sp > 1.5) { b.sp = 0; v = aimAt(b.x, b.y + 30, 80, 0); ebullet('mail', b.x, b.y + 30, v[0], v[1], 40) }
    } else {
      /* la sveglia delle 9:00 impazzita: spirale doppia, poi raffiche */
      b.x = 240 + Math.sin(b.t * .9) * 130 + (RM() ? 0 : Math.sin(b.t * 40) * 1.2); b.y = 80 + Math.sin(b.t * 2.1) * 4;
      var c3 = b.pt % 5;
      if (c3 < 3) { b.sp += dt; if (b.sp > .11) { b.sp = 0; var base = b.t * 1.9; for (i = 0; i < 2; i++) { a = base + i * Math.PI; var ca = Math.cos(a), sa = Math.sin(a); if (sa < -.2) sa = -sa * .5; ebullet('alarm', b.x + ca * 20, b.y + 20, ca * 66, Math.abs(sa) * 66 + 18, 95) } } }
      else if (c3 > 3.6 && c3 < 4.6) { b.sp += dt; if (b.sp > .32) { b.sp = 0; for (i = -1; i <= 1; i++) { v = aimAt(b.x, b.y + 30, 112, i * .16); ebullet('alarm', b.x, b.y + 30, v[0], v[1], 95) } } }
      if (((b.t * 2) | 0) !== (((b.t - dt) * 2) | 0) && Math.random() < .25) sfx('alarm');
    }
  }
  var LABELS = ['MEETING', 'SYNC', '1:1', 'STANDUP', 'ALL HANDS', 'CATCH-UP', 'REVIEW'];
  var wallGap = 240;
  function wall() {
    var seg = 40, n = 12, gw = 2, gc = clamp(Math.round((wallGap + rnd(-130, 130)) / seg - 1), 0, n - gw);
    wallGap = (gc + 1) * seg;
    for (var i = 0; i < n; i++) {
      if (i >= gc && i < gc + gw) continue;
      var l = take(BL); if (!l) return;
      l.x = i * seg + 1; l.y = -14; l.w = seg - 2; l.h = 12; l.hp = 4; l.vy = 46; l.hit = 0; l.label = LABELS[(i + Gm.boss.pi) % LABELS.length];
    }
    Gm.boss.pi++;
  }
  function blocksUpdate(dt) {
    var s = Gm.ship;
    for (var i = 0; i < BL.length; i++) {
      var l = BL[i]; if (!l.on) continue; l.y += l.vy * dt; if (l.hit > 0) l.hit -= dt * 6;
      if (l.y + l.h > FW_Y) { for (var x = l.x + 4; x < l.x + l.w; x += 8) fwErase(x, l.y + l.h, 2) }
      if (l.y > CITY_Y - 6) { l.on = false; spark(l.x + l.w / 2, CITY_Y - 4, 4, C.cream, C.cream, 30); continue }
      if (!s.dead && s.x + 3 > l.x && s.x - 3 < l.x + l.w && s.y + 4 > l.y && s.y - 4 < l.y + l.h) hurt('block');
    }
  }

  /* ---------- fine partita ---------- */
  function gameOver() {
    st = 'over'; stT = 0; LAST = { score: Math.floor(Gm.score), day: DAYS[Gm.day].toUpperCase(), di: Gm.day, cause: Gm.cause, win: false };
    music('over');
  }
  function winGame() { st = 'win'; stT = 0; LAST = { score: Math.floor(Gm.score), day: 'MON', di: 6, cause: '', win: true }; sfx('win') }
  function toInit() {
    if (weekend || !LAST || LAST.score <= 0) { if (LAST && LAST.win && !weekend) { st = 'init'; stT = 0; return } toTitle(); return }
    st = 'init'; stT = 0; iniPos = 0; iniMsg = '';
  }
  var BAD = ('ASS,FUK,FUC,FCK,FKU,FUQ,CUM,COK,COC,DIK,DIC,DCK,FAG,FGT,NIG,NGR,NGA,KKK,SEX,SXY,TIT,TTS,XXX,JIZ,PIS,PUS,CNT,KYS,HOE,WTF,STFU,' +
    'CAZ,CZO,MRD,PUT,TRO,VAF,FIC,CUL,CUK,POO,PEE,NAZ,SS,HH,GAY,DAM,SHT,SHI,BCH,BJ,ANL,ANU,VAG,PNS,PNI,TWT,WNK,SUK,SUC,FAP,RAP,KIL,DIE,ISIS').split(',');
  function clean(s) { for (var i = 0; i < BAD.length; i++) if (BAD[i].length === 3 ? s === BAD[i] : s.indexOf(BAD[i]) >= 0) return false; return true }
  function confirmIni() {
    var s = ini.join('');
    if (!clean(s)) { iniMsg = 'Pick other letters.'; iniMsgT = 2; sfx('hurt'); return }
    try { localStorage.setItem('mm-deadline-ini', s) } catch (e) {}
    sfx('select');
    var o = { run: Gm && Gm.run, token: Gm && Gm.token, initials: s, score: LAST.score, day: LAST.di, bossBeaten: !!LAST.win, duration: Gm ? Math.round(Gm.playT) : 0, events: Gm ? Gm.log : null };
    LAST.initials = s; LAST.rank = 0;
    safeP(function () { return net().submit(o) }, function () { return LOCAL.submit(o) }).then(function (r) {
      if (r) { LAST.rank = r.rank || 0; if (r.initials) LAST.initials = r.initials; if (r.top && r.top.length) TOP = r.top } else loadTop();
    });
    if (LAST.win) openForm(); else { st = 'board'; stT = 0 }
  }
  function toTitle() { st = 'title'; stT = 0; titlePage = 0; titlePageT = 0; paused = false; music('title'); loadTop(); syncUI() }
  function loadTop() { safeP(function () { return net().top(10) }, function () { return LOCAL.top(10) }).then(function (a) { if (Array.isArray(a)) TOP = a }) }
  function loadSigns() {
    safeP(function () { return net().signs() }, function () { return [] }).then(function (a) {
      if (!Array.isArray(a)) return; SIGNS = [];
      a.forEach(function (s) {
        if (!s || !s.name) return; var o = { name: String(s.name).slice(0, 40), link: safeLink(s.link), line: String(s.line || '').slice(0, 60), kind: KINDS.indexOf(s.kind) >= 0 ? s.kind : 'services', img: null };
        if (s.img) { var im = new Image(); im.onload = function () { var S = window.DEADLINE_SIGN; try { o.img = S && S.pixel ? S.pixel(im) || im : im } catch (e) { o.img = im } bbDay = -1 }; im.src = s.img }
        SIGNS.push(o);
      });
      buildCity();
    });
  }
  function safeLink(u) { u = String(u || ''); return /^https:\/\/[^\s"'<>]+$/i.test(u) || /^http:\/\/[^\s"'<>]+$/i.test(u) ? u : '' }

  /* ---------- la CITY: la citta' ferma tra una partita e l'altra ---------- */
  var KINDS = ['food', 'fashion', 'shop', 'beauty', 'hotel', 'services'];
  var BSIZE = { food: [58, 44], fashion: [50, 62], shop: [66, 46], beauty: [34, 80], hotel: [46, 92], services: [52, 70] };
  var CITYB = [], cityW = 480;
  function buildCity() {
    CITYB = []; var x = 0, n = 0, list = SIGNS.slice(), fill = ['services', 'beauty', 'food', 'hotel', 'shop', 'fashion', 'services', 'hotel'];
    while (n < Math.max(12, list.length * 2) || x < 560) {
      var s = list.length && n % 2 === 0 ? list[(n / 2 | 0) % list.length] : null, k = s ? s.kind : fill[n % fill.length], d = BSIZE[k];
      CITYB.push({ x: x, w: d[0], h: d[1], kind: k, sign: s }); x += d[0] + 6; n++;
      if (n > 80) break;
    }
    cityW = x;
  }
  buildCity();
  function titleUpdate(dt) {
    if (!cityDrag) cityX += dt * 9;
    titlePageT += dt; if (titlePageT > 6) { titlePageT = 0; titlePage = (titlePage + 1) % (SIGNS.length ? 4 : 3) }
    stT += dt; ambient(dt);
    if (st === 'board' && stT > 7 && !(LAST && LAST.win)) toTitle();
  }

  /* ---------- il disegno ---------- */
  function render() {
    hot.length = 0;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.imageSmoothingEnabled = false;
    ga.setTransform(1, 0, 0, 1, 0, 0); ga.globalAlpha = 1; ga.clearRect(0, 0, W * AS, H * AS);
    fxBegin();
    if (st === 'boot') drawBoot();
    else if (st === 'title' || st === 'board' || st === 'form') drawTitle();
    else if (st === 'crawl') drawCrawl();
    else if (st === 'clock') drawMap();
    else drawGame();
    fxEnd();
  }
  function drawBoot() {
    R(0, 0, W, H, C.night);
    var t = bootT;
    if (t < .45) { var k = easeOut(t / .45); R(240 - 240 * k, 134, 480 * k, 2, C.cream); return }
    dMark(240, 92, 3, t - .45);
    var s = 'MOTHER MACHINE PRESENTS', n = clamp(((t - 1.1) * 22) | 0, 0, s.length);
    if (t > 1.1) txt(s.slice(0, n), 240 - tw(s, 1) / 2, 134, C.cream, 1);
    if (t > 2.6) { g.globalAlpha = clamp(1 - (t - 2.6) / .8, 0, 1) * 0 + 1 }
    if (t > 3) { g.globalAlpha = clamp((t - 3) / .4, 0, 1); R(0, 0, W, H, C.night); g.globalAlpha = 1 }
  }
  function scene(day, t, scroll) {
    dSky(day, t);
    dSkyline(day, scroll * .1, t);
    dTowers(day, scroll * .4, t, billboards());
  }
  var BB = [], bbDay = -1;
  function billboards() {
    var d = Gm ? Gm.day : 0;
    if (d !== bbDay) { bbDay = d; BB = []; for (var i = 0; i < Math.min(3, SIGNS.length); i++) { var s = SIGNS[(d * 3 + i) % SIGNS.length]; BB.push({ img: s.img, name: s.name, kind: s.kind }) } }
    return BB;
  }
  function drawTitle() {
    var t = T;
    scene('night', t, cityX * .5);
    /* la CITY in basso: si scorre, le insegne si cliccano */
    var base = H, ox = -(cityX % cityW);
    hover = null;
    for (var rep = 0; rep < 3; rep++) for (var i = 0; i < CITYB.length; i++) {
      var b = CITYB[i], x = ox + rep * cityW + b.x; if (x > W || x + b.w < 0) continue;
      dBuilding(b.kind, x, base - b.h, b.w, b.h, t, b.sign ? { img: b.sign.img, name: b.sign.name } : null);
      if (b.sign && b.sign.link) { var hs = { x: x, y: base - b.h, w: b.w, h: b.h, id: 'sign', sign: b.sign }; hot.push(hs); if (mouse.in && mouse.x >= x && mouse.x < x + b.w && mouse.y >= base - b.h) hover = hs }
    }
    if (st === 'form') { R(0, 0, W, H, 'rgba(15,15,14,.55)'); return }
    dLogo(240, 18, t, (t % 5) < .2 && !RM());
    if (st === 'board') { drawBoard(70); return }
    /* il pannello che gira: istruzioni, classifica, chi c'e', la citta' */
    var pg = titlePage, fade = clamp(Math.min(titlePageT, 6 - titlePageT) * 4, 0, 1);
    R(96, 62, 288, 74, 'rgba(15,15,14,.6)'); panel(96, 62, 288, 74);
    g.globalAlpha = fade;
    if (pg === 0) {
      txt('SHOOT WHAT SLOWS YOU DOWN.', 240, 74, C.cream, 1, 'c');
      txt('7 days. 3 coffees. 1 Monday.', 240, 88, C.p3, 1, 'c');
      txt(touchMode ? 'Drag to fly. We shoot for you.' : 'Arrows or WASD to fly. Space to shoot.', 240, 106, C.p2, 1, 'c');
      txt(touchMode ? 'Two fingers: Night shift.' : 'X: Night shift.  P: pause.  M: sound.', 240, 118, C.p3, 1, 'c');
    } else if (pg === 1) drawBoardList(64, null);
    else if (pg === 2) drawLegend(64, t);
    else drawSignList(64);
    g.globalAlpha = 1;
    for (i = 0; i < (SIGNS.length ? 4 : 3); i++) R(240 - 14 + i * 8, 140, 4, 1, i === pg ? C.cream : C.g3);
    if (((RT * 1.6) | 0) % 2 === 0) txt('INSERT COIN', 240, 148, C.tom, 2, 'c');
    hot.push({ x: 0, y: 0, w: W, h: 168, id: 'start' });
    if (weekend) txt('WEEKEND MODE', 240, 4, C.pink, 1, 'c');
    if (hover) plate(hover);
  }
  function plate(h) {
    var s = h.sign, w = Math.max(tw(s.name, 1), tw(s.line, 1)) + 10, x = clamp(h.x + h.w / 2 - w / 2, 2, W - w - 2), y = Math.max(2, h.y - 26);
    R(x, y, w, 22, C.night); R(x, y, w, 1, C.cream); txt(s.name, x + 5, y + 4, C.cream, 1); txt(s.line, x + 5, y + 13, C.p3, 1);
  }
  function drawBoardList(y, me) {
    txt('TOP HOURS SAVED', 240, y, C.cream, 1, 'c');
    if (!TOP.length) { txt('No scores yet. Be the first.', 240, y + 22, C.p3, 1, 'c'); return }
    for (var i = 0; i < Math.min(10, TOP.length); i++) {
      var e = TOP[i], col = i < 5 ? 0 : 1, x = col ? 256 : 112, yy = y + 14 + (i % 5) * 11, mine = me && e.initials === me.initials && e.score === me.score;
      var c = mine ? C.tom : i === 0 ? C.gold : C.p2;
      txt((i + 1) + '.', x, yy, C.p3, 1, 'r'); txt(String(e.initials || '???').slice(0, 3), x + 6, yy, c, 1); txt(String(e.score | 0), x + 60, yy, c, 1, 'r'); txt(dayFull(e.day), x + 68, yy, C.p3, 1);
    }
  }
  function drawLegend(y, t) {
    txt('WHAT FALLS FROM THE SKY', 240, y, C.cream, 1, 'c');
    var L = [['call', 'Missed call'], ['invoice', 'Paper invoice'], ['noshow', 'No-show'], ['spam', 'Spam'], ['double', 'Double booking']];
    for (var i = 0; i < L.length; i++) { var x = 60 + i * 90; SE.hit = 0; SE.fade = art('enemy') ? 0 : 1; SE.base = null; SE.marked = false; dEnemy(L[i][0], x, y + 22, t); txt(L[i][1], x, y + 36, C.p2, 1, 'c') }
    var P = [['auto', 'Automation'], ['ai', 'AI'], ['booking', 'Booking'], ['night', 'Night shift']];
    for (i = 0; i < P.length; i++) { x = 105 + i * 90; dPower(P[i][0], x - 22, y + 55, t); txt(P[i][1], x - 13, y + 52, C.goldL, 1) }
  }
  function drawSignList(y) {
    txt('IN THE CITY', 240, y, C.cream, 1, 'c');
    for (var i = 0; i < Math.min(6, SIGNS.length); i++) {
      var s = SIGNS[i], yy = y + 14 + i * 10, w = tw(s.name, 1);
      txt(s.name, 240, yy, C.p2, 1, 'c');
      if (s.link) { var hs = { x: 240 - w / 2 - 2, y: yy - 2, w: w + 4, h: 10, id: 'sign', sign: s }; hot.push(hs); if (mouse.in && mouse.x >= hs.x && mouse.x < hs.x + hs.w && mouse.y >= hs.y && mouse.y < hs.y + hs.h) { hover = { x: hs.x, y: yy + 30, w: hs.w, h: 0, sign: s }; R(hs.x, yy + 8, hs.w, 1, C.tom) } }
    }
  }
  function drawBoard(y) {
    R(100, y - 8, 280, 86, 'rgba(15,15,14,.82)');
    drawBoardList(y, LAST);
    if (LAST && LAST.rank) txt('You are #' + LAST.rank, 240, y + 70, C.tom, 1, 'c');
    hot.push({ x: 0, y: 0, w: W, h: 170, id: 'cont' });
  }

  /* gli attori (nave, nemici, colpi, testo) vanno sul canvas 960x540: stessa scala del gioco, doppia densita' */
  var AS = 2;
  function drawGame() { var gp = g; try { drawGame0() } finally { g = gp } }
  function drawGame0() {
    var t = T, day = curDayKey(), sh = Gm.shake, ox = 0, oy = 0, i;
    if (sh > 0 && !RM()) { ox = Math.round(rnd(-sh, sh) * .5); oy = Math.round(rnd(-sh, sh) * .5) }
    g.setTransform(1, 0, 0, 1, ox, oy);
    var scroll = T * 6 + Gm.ship.x * .15;
    scene(day, t, scroll);
    /* FLOW STATE: lo sfondo pulsa a tempo */
    if (Gm.flow) { var beat = 60 / 128, pk = RM() ? .5 : Math.pow(1 - (T % beat) / beat, 3), A0 = au(); if (A0 && A0.beat && !RM()) { try { var bt = A0.beat(); if (bt && bt.on) pk = Math.pow(1 - bt.phase, 3) } catch (e) {} } g.globalAlpha = .05 + .07 * pk; R(-4, -4, W + 8, CITY_Y + 4, accent(day)); g.globalAlpha = 1 }
    dCity(Gm.wins, t, day);
    if (!art('city')) drawWinOff();
    for (i = 0; i < fws.length; i++) dFirewall(fws[i]);
    if (Gm.glitch > 0 && !RM()) { if (art('glitch')) { try { AR.glitch(g, T, 1) } catch (e) { fail('glitch', e) } } else glitchSlices() }
    g = ga; g.setTransform(AS, 0, 0, AS, ox * AS, oy * AS); g.imageSmoothingEnabled = false;
    /* capsule */
    for (i = 0; i < PU.length; i++) if (PU[i].on) dPower(PU[i].kind, PU[i].x, PU[i].y, t);
    /* muri di riunioni */
    for (i = 0; i < BL.length; i++) { var l = BL[i]; if (l.on) { dMeeting(l.x, l.y, l.w, l.h, t, l.label); if (l.hit > .5 && !RM()) { g.globalAlpha = .5; R(l.x, l.y, l.w, l.h, C.cream); g.globalAlpha = 1 } } }
    /* nemici */
    for (i = 0; i < EN.length; i++) {
      var e = EN[i]; if (!e.on) continue;
      if (e.st === 'mark') { if (e.t >= 0) drawMark(e, t); continue }
      if (e.type === 'double' && e.lead && e.partner && e.partner.on) { pairLine(e, e.partner, t) }
      SE.hit = RM() ? (e.hit > .5 ? 1 : 0) : clamp(e.hit, 0, 1); SE.phase = e.c; SE.fade = art('enemy') ? 1 - e.fade : e.fade; SE.base = e.type === 'gold' ? e.base : null; SE.marked = e.marked > 0;
      if (Gm.def.fog && Gm.nightT <= 0) { var fa = clamp(1 - (Gm.ship.y - e.y - 64) / 56, .28, 1); if (e.hit > 0) fa = 1; g.globalAlpha = fa }
      dEnemy(e.type, e.x, e.y, t + e.c * .13); g.globalAlpha = 1;
      if (e.marked > 0) { R(e.x - 2, e.y - 12, 5, 1, C.cream); R(e.x - 1, e.y - 11, 3, 1, C.cream) }
    }
    for (i = 0; i < CP.length; i++) { var cp = CP[i]; if (!cp.on) continue; if (RT - cp.t0 > .045) { cp.on = false; continue } SE.dead = true; SE.hit = 0; SE.fade = 0; SE.base = cp.type === 'gold' ? cp.base : null; dEnemy(cp.type, cp.x, cp.y, t); SE.dead = false }
    if (Gm.boss) drawBoss(Gm.boss, t);
    drawHaz(t);
    for (i = 0; i < PG.length; i++) { var q = PG[i]; if (q.on) { if (art('page')) { try { AR.page(g, q.x, q.y, T, i); continue } catch (x) { fail('page', x) } } var f = ((q.r | 0) % 3); R(q.x - (f === 1 ? 1 : 3), q.y - (f === 1 ? 3 : 2), f === 1 ? 2 : 6, f === 1 ? 6 : 4, C.cream); R(q.x - 2, q.y, f === 1 ? 1 : 4, 1, C.p3) } }
    /* colpi */
    for (i = 0; i < PB.length; i++) if (PB[i].on) dBullet('player', PB[i].x, PB[i].y, t, Math.atan2(PB[i].vy, PB[i].vx));
    for (i = 0; i < EB.length; i++) { var b = EB[i]; if (b.on) dBullet(b.kind, b.x, b.y, t + i * .07, b.a) }
    /* la nave */
    var s = Gm.ship;
    if (!s.dead && !(s.inv > 0 && Gm.phase !== 'out' && ((RT * 14) | 0) % 2 && Gm.nightT <= 0)) {
      SS.bank = s.bank; SS.thrust = clamp(.4 + (-s.vy / 120) + Math.abs(s.vx) / 300, 0, 1); SS.shield = Gm.shield / 3; SS.flash = s.inv > 1.8; SS.power = Gm.power; SS.bg = pcv;
      dShip(s.x, s.y, t);
      if (!art('ship') && Gm.shield > 0) { g.globalAlpha = .35; ringPx(s.x, s.y - 1, 12, C.pink); g.globalAlpha = 1 }
    }
    if (Gm.power === 'ai') aiReticle(t);
    for (i = 0; i < BX.length; i++) if (BX[i].on && dExplosion(BX[i].x, BX[i].y, BX[i].t0, t, BX[i].kind) === false) BX[i].on = false;
    for (i = 0; i < PT.length; i++) { var p = PT[i]; if (!p.on) continue; R(p.x, p.y, 1, 1, p.life < p.max * .4 ? p.end : p.col) }
    dWeather(day, t, 1);
    if (Gm.nightT > 0) { g.globalAlpha = .12; R(-4, -4, W + 8, H + 8, '#2F4C9A'); g.globalAlpha = 1 }
    for (i = 0; i < FT.length; i++) { var ft = FT[i]; if (!ft.on) continue; g.globalAlpha = clamp(ft.life * 2, 0, 1); txt(ft.s, ft.x, ft.y, ft.col, 1, 'c', C.night); g.globalAlpha = 1 }
    g.setTransform(AS, 0, 0, AS, 0, 0);
    drawHUD(t);
    drawBanners(t);
    if (st === 'over' || st === 'win') drawEnd(t);
    if (st === 'init') drawInit(t);
    if (paused && st === 'play') drawPause();
  }
  function ringPx(x, y, r, c) { for (var a = 0; a < 6.283; a += .2) R(x + Math.cos(a) * r, y + Math.sin(a) * r, 1, 1, c) }
  function pairLine(a, b, t) {
    if (art('cable')) { try { AR.cable(g, a.x, a.y, b.x, b.y, t); return } catch (e) { fail('cable', e) } }
    var n = Math.max(2, Math.abs(b.x - a.x) + Math.abs(b.y - a.y) | 0), ac = accent(curDayKey()), on = ((t * 6) | 0) % 2;
    for (var i = 0; i < n; i += 2) { var k = i / n; R(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, 1, 1, on ? ac : C.p3) }
  }
  function drawMark(e, t) {
    /* dove riappare il no-show: un riquadro tratteggiato che lampeggia (avviso onesto) */
    if (((t * 10) | 0) % 2) return;
    var x = Math.round(e.x - 7), y = Math.round(e.y - 10);
    for (var i = 0; i < 14; i += 3) { R(x + i, y, 2, 1, C.cream); R(x + i, y + 19, 2, 1, C.cream) }
    for (i = 0; i < 20; i += 3) { R(x, y + i, 1, 2, C.cream); R(x + 13, y + i, 1, 2, C.cream) }
  }
  function aiReticle(t) {
    var n = nearest(Gm.ship.x, Gm.ship.y); if (!n) return;
    if (art('reticle')) { try { AR.reticle(g, n.x, n.y, t); return } catch (e) { fail('reticle', e) } }
    var x = Math.round(n.x), y = Math.round(n.y), r = 9 + (((t * 6) | 0) % 2);
    R(x - r, y - r, 3, 1, C.tom); R(x - r, y - r, 1, 3, C.tom); R(x + r - 2, y - r, 3, 1, C.tom); R(x + r, y - r, 1, 3, C.tom);
    R(x - r, y + r, 3, 1, C.tom); R(x - r, y + r - 2, 1, 3, C.tom); R(x + r - 2, y + r, 3, 1, C.tom); R(x + r, y + r - 2, 1, 3, C.tom);
  }
  function drawWinOff() {
    var r = windowRects();
    for (var i = 0; i < Gm.winOffT.length; i++) if (Gm.winOffT[i] > 0 && r[i]) { if (((Gm.winOffT[i] * 20) | 0) % 2) R(r[i].x, r[i].y, r[i].w, r[i].h, C.cream) }
  }
  function glitchSlices() {
    var cv = g.canvas;
    for (var i = 0; i < 2; i++) { var y = (Math.random() * (H - 8)) | 0, h = 2 + (Math.random() * 5 | 0), dx = ((Math.random() < .5 ? -1 : 1) * (2 + Math.random() * 6)) | 0; g.drawImage(cv, 0, y, W, h, dx, y, W, h) }
  }
  function drawBoss(b, t) {
    SB.phase = b.ph; SB.hp = b.hp / b.max; SB.hit = RM() ? (b.hit > .5 ? 1 : 0) : clamp(b.hit, 0, 1); SB.rage = b.rage; SB.pagesTorn = b.torn; SB.mouth = b.mouth; if (!(b.kind === 'monday' && Gm.phase === 'boss')) SB.hp = null;
    if (b.dead && ((b.dieT * 12) | 0) % 2) SB.hit = 1;
    dBoss(b.kind, b.x, b.y, t);
    if (b.kind === 'monday' && Gm.phase === 'monin') {
      /* la pagina SUNDAY sopra il calendario, poi strappata */
      var k = Gm.monIn >= 2 ? clamp((T - Gm.ripT) / 1.2, 0, 1) : 0, px = b.x - 50 + k * 140, py = b.y - 24 + k * k * 160;
      if (k < 1) {
        var w = Math.round(100 * (1 - k * .5)), h = Math.round(56 * (1 - k * .3));
        R(px, py, w + 2, h + 2, C.night); R(px + 1, py + 1, w, h, C.cream); R(px + 1, py + 1, w, 10, C.p3);
        txt('SUNDAY', px + 1 + w / 2, py + 22, C.ink, k < .3 ? 2 : 1, 'c');
      }
    }
    if (b.kind === 'monday' && Gm.phase === 'boss' && !art('boss')) {
      /* barra della vita sottile, sotto la testata */
      R(160, 12, 160, 3, C.night); R(161, 13, Math.round(158 * b.hp / b.max), 1, C.crim);
      R(161 + 158 / 3 | 0, 12, 1, 3, C.g3); R(161 + 316 / 3 | 0, 12, 1, 3, C.g3);
    }
  }
  function dayFull(d) { if (typeof d === 'number') return DAYNAME[DAYS[d]] || ''; d = String(d || '').toLowerCase().slice(0, 3); return DAYNAME[d] || (d === 'win' ? 'MONDAY' : '') }
  function pad2(n) { return n < 10 ? '0' + n : '' + n }
  function clockStr(k) { var m = Math.round(clamp(k, 0, 1) * 480), h = 9 + (m / 60 | 0); return pad2(h) + ':' + pad2(m % 60) }
  /* le cifre che rotolano come il display dell'ascensore */
  function dig(str, x, y, col) { var a = art('digits'); if (a) { try { return a.digits(g, str, Math.round(x), Math.round(y) + 1, col) } catch (e) { fail('digits', e) } } return txt(str, x, y, col, 1) }
  function digW() { return art('digits') ? 5 : art('text') ? 6 : 4 }
  function rollNum(v, x, y, digits, col) {
    var a = digW(), ch = (art('digits') ? 6 : lh(1)) + 3, iv = Math.floor(v), fr = v - iv;
    g.save(); g.beginPath(); g.rect(x - 1, y - 1, digits * a + 2, ch); g.clip();
    for (var i = 0; i < digits; i++) {
      var p = Math.pow(10, digits - 1 - i), d = Math.floor(iv / p) % 10, nx = x + i * a;
      var rolling = (iv % p) === p - 1 || p === 1, off = rolling ? Math.round(fr * ch) : 0;
      dig(String(d), nx, y - off, col); if (off) dig(String((d + 1) % 10), nx, y - off + ch, col);
    }
    g.restore();
  }
  function drawHUD(t) {
    var d = DAYS[Gm.day], ac = accent(d);
    R(0, 0, W, HUD_H, 'rgba(15,15,14,.72)'); R(0, HUD_H, W, 1, 'rgba(244,242,236,.18)');
    var dn = DAYNAME[d];
    txt(dn, 4, 1, C.cream, 1);
    var ct = Gm.phase === 'urgent' ? '16:59' : clockStr(Gm.clockShow), blink = (Gm.overtime || Gm.phase === 'urgent') && ((RT * 3) | 0) % 2;
    var cw = dig(ct, 4 + tw(dn + ' ', 1), 1, blink ? C.crim : C.cream);
    var bx = 4 + tw(dn + ' ', 1) + cw + 5; R(bx, 4, 50, 1, C.g3); R(bx, 4, Math.round(50 * clamp(Gm.clockShow, 0, 1)), 1, C.tom);
    if (Gm.overtime && Gm.phase === 'fight') txt('OVERTIME', 4, HUD_H + 3, C.crim, 1, 'l', C.night);
    var lbl = 'HOURS SAVED ', lw = tw(lbl, 1), dw = digW() * 4, x0 = 240 - (lw + dw) / 2;
    txt(lbl, x0, 1, C.p3, 1); rollNum(Gm.shown, x0 + lw, 1, 4, C.cream);
    if (Gm.flow && ((RT * 4) | 0) % 2) txt('FLOW x2', x0 + lw + dw + 6, 1, C.tom, 1);
    if (weekend) txt('WEEKEND', W - 4, 1, C.pink, 1, 'r');
    else for (var i = 0; i < 3; i++) {
      var cx = W - 11 - i * 9, full = 3 - i <= Gm.coffee;
      if (full && art('icon')) { try { AR.icon(g, 'coffee', cx, 1, ((RT * 4 + i) | 0) % 3) } catch (e) { fail('icon', e) } } else dIcon(full ? 'coffee' : 'coffeeEmpty', cx, 1);
      if (!full && 3 - i === Gm.coffee + 1 && Gm.cupT > 0) { if (art('icon')) { try { AR.icon(g, 'coffeeSpill', cx, 1, Math.min(2, ((1 - Gm.cupT) * 6) | 0)) } catch (e) {} } else { var sp = 1 - Gm.cupT; R(cx + 7, 4 + sp * 6, 1, 1, C.p3); R(cx + 5, 5 + sp * 8, 1, 1, C.p3) } }
    }
    /* in basso: potenziamento attivo, scudo, slot Night shift */
    var y = H - 9;
    if (Gm.power || Gm.shield > 0 || Gm.night || Gm.nightT > 0) { R(0, y - 1, 92, 10, 'rgba(15,15,14,.6)'); R(W - 70, y - 1, 70, 10, 'rgba(15,15,14,.6)') }
    if (Gm.power) { dIcon(Gm.power, 3, y); R(13, y + 3, 40, 1, C.g3); R(13, y + 3, Math.round(40 * Gm.powerT / 10), 1, C.tom); txt(Gm.power === 'auto' ? 'AUTO' : 'AI', 57, y + 1, C.p2, 1) }
    else if (Gm.shield > 0) { dIcon('booking', 3, y); for (i = 0; i < 3; i++) R(13 + i * 5, y + 2, 3, 3, i < Gm.shield ? C.pink : C.g3) }
    R(W - 12, y - 1, 10, 9, Gm.night ? '#8FB4FF' : C.g4); R(W - 11, y, 8, 7, C.night);
    if (Gm.night) dIcon('night', W - 11, y);
    txt(touchMode ? '2F' : 'X', W - 15, y + 1, Gm.night ? C.cream : C.g3, 1, 'r');
    if (Gm.nightT > 0) txt('NIGHT SHIFT', W - 30, y + 1, '#8FB4FF', 1, 'r');
  }
  function drawBanners(t) {
    var p = Gm.phase, k = Gm.phaseT;
    if (p === 'intro' && st === 'play') {
      var a = clamp(Math.min(k * 4, (2.4 - k) * 3), 0, 1), d = DAYS[Gm.day];
      g.globalAlpha = a; var hl = wrap(Gm.def.hint, 300, 1).length; panel(80, 86, 320, 44 + hl * 10 + (Gm.day === 0 ? 14 : 0));
      /* il nome del giorno rotola come il piano dell'ascensore */
      var roll = RM() ? 0 : Math.round((1 - easeOut(k / .5)) * 14);
      g.save(); g.beginPath(); g.rect(0, 92, W, 22); g.clip();
      txt(DAYNAME[d], 240, 96 + roll, C.cream, 2, 'c', C.night);
      if (roll && Gm.day > 0) txt(DAYNAME[DAYS[Gm.day - 1]], 240, 96 + roll - 18, C.p3, 2, 'c', C.night);
      g.restore();
      txt('9:00', 240, 116, C.tom, 1, 'c', C.night);
      var lines = wrap(Gm.def.hint, 300, 1); for (var i = 0; i < lines.length; i++) txt(lines[i], 240, 130 + i * 10, C.p2, 1, 'c', C.night);
      if (Gm.day === 0) txt(touchMode ? 'Drag to fly. We shoot for you.' : 'Arrows to fly. Space to shoot.', 240, 154, C.p3, 1, 'c', C.night);
      g.globalAlpha = 1;
    }
    if (p === 'monin' && k > 3) {
      var a2 = clamp(Math.min((k - 3) * 4, (4.6 - k) * 4), 0, 1); g.globalAlpha = a2;
      txt('MONDAY', 240, 140, C.crim, 3, 'c', C.night); txt('9:00. It always comes back.', 240, 166, C.cream, 1, 'c', C.night);
      g.globalAlpha = 1;
    }
    if (p === 'out' && st === 'play') {
      var a3 = clamp(k * 3, 0, 1); g.globalAlpha = a3; txt('17:00', 240, 110, C.cream, 2, 'c', C.night); g.globalAlpha = 1;
    }
  }
  function panel(x, y, w, h) { if (art('frame')) { try { AR.frame(g, x, y, w, h, {}); return } catch (e) { fail('frame', e) } } R(x, y, w, h, 'rgba(15,15,14,.88)'); R(x, y, w, 1, 'rgba(244,242,236,.35)'); R(x, y + h - 1, w, 1, 'rgba(244,242,236,.35)');
    R(x, y, 3, 1, C.cream); R(x, y, 1, 3, C.cream); R(x + w - 3, y, 3, 1, C.cream); R(x + w - 1, y, 1, 3, C.cream);
    R(x, y + h - 1, 3, 1, C.cream); R(x, y + h - 3, 1, 3, C.cream); R(x + w - 3, y + h - 1, 3, 1, C.cream); R(x + w - 1, y + h - 3, 1, 3, C.cream) }
  function countLit() { var n = 0; for (var i = 0; i < Gm.wins.length; i++) if (Gm.wins[i]) n++; return n }
  function drawEnd(t) {
    var k = clamp(stT * 2, 0, 1); g.globalAlpha = k * .75; R(0, 0, W, H, C.night); g.globalAlpha = k;
    if (st === 'win') {
      txt('17:00', 240, 58, C.p3, 1, 'c');
      txt('MONDAY IS OVER.', 240, 74, C.cream, 2, 'c');
      if (stT > 1.2) txt('Your sign goes up in the city.', 240, 104, C.gold, 1, 'c');
      if (stT > 1.8) txt(Math.round(Gm.score) + ' hours saved.', 240, 124, C.cream, 1, 'c');
    } else {
      txt(Gm.cause === 'closed' ? 'The business closed.' : 'Out of coffee.', 240, 70, C.p3, 1, 'c');
      txt('BURNOUT.', 240, 86, C.tom, 3, 'c');
      if (stT > .9) txt('Burnout. ' + Math.round(Gm.score) + ' hours saved.', 240, 120, C.cream, 1, 'c');
      if (stT > 1.3) txt('You made it to ' + DAYNAME[DAYS[Gm.day]] + '.', 240, 134, C.p3, 1, 'c');
    }
    if (stT > 2.2) txt(touchMode ? 'Tap to go on' : 'Press Enter', 240, 170, ((RT * 2) | 0) % 2 ? C.cream : C.p3, 1, 'c');
    g.globalAlpha = 1;
    if (stT > 1) hot.push({ x: 0, y: 0, w: W, h: H, id: 'cont' });
  }
  function drawInit(t) {
    R(0, 0, W, H, 'rgba(15,15,14,.82)');
    txt(LAST && LAST.win ? 'YOU BEAT MONDAY.' : 'BURNOUT.  ' + Math.round(LAST ? LAST.score : 0) + ' HOURS SAVED', 240, 48, C.p3, 1, 'c');
    txt('YOUR INITIALS', 240, 66, C.cream, 2, 'c');
    for (var i = 0; i < 3; i++) {
      var x = 204 + i * 36, sel = i === iniPos;
      R(x - 12, 92, 24, 30, sel ? 'rgba(255,91,58,.12)' : 'rgba(244,242,236,.04)'); R(x - 12, 121, 24, 1, sel ? C.tom : C.g3);
      txt(ini[i], x, 97, sel ? C.tom : C.cream, 3, 'c');
      txt('+', x, 82, C.p3, 1, 'c'); txt('-', x, 128, C.p3, 1, 'c');
      hot.push({ x: x - 12, y: 76, w: 24, h: 14, id: 'up', i: i }); hot.push({ x: x - 12, y: 124, w: 24, h: 14, id: 'dn', i: i }); hot.push({ x: x - 12, y: 92, w: 24, h: 30, id: 'sel', i: i });
    }
    var okx = 240, oky = 150; R(okx - 24, oky - 4, 48, 15, C.tom); txt('OK', okx, oky, C.night, 1, 'c');
    hot.push({ x: okx - 24, y: oky - 4, w: 48, h: 15, id: 'ok' });
    if (iniMsgT > 0) txt(iniMsg, 240, 174, C.crim, 1, 'c');
    else txt(touchMode ? 'Tap + and - , then OK.' : 'Type, or use the arrows. Enter to save.', 240, 174, C.p3, 1, 'c');
  }
  function drawPause() {
    R(0, 0, W, H, 'rgba(15,15,14,.78)');
    txt('OUT OF OFFICE', 240, 92, C.cream, 3, 'c');
    txt('Back soon.', 240, 120, C.p3, 1, 'c');
    R(190, 140, 100, 15, C.tom); txt('RESUME', 240, 144, C.night, 1, 'c'); hot.push({ x: 190, y: 140, w: 100, h: 15, id: 'resume' });
    R(190, 162, 100, 15, C.g4); txt('QUIT', 240, 166, C.cream, 1, 'c'); hot.push({ x: 190, y: 162, w: 100, h: 15, id: 'quit' });
    txt(touchMode ? '' : 'P to resume.  Q to quit.', 240, 188, C.p3, 1, 'c');
  }

  /* ---------- le luci (canvas FX a piena risoluzione) ---------- */
  var fxk = 1;
  function fxBegin() { fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalCompositeOperation = 'source-over'; fx.globalAlpha = 1; fx.clearRect(0, 0, fx.canvas.width, fx.canvas.height) }
  function stamp(name, x, y, r, a) {
    var c = glow(name, r); if (!c) return; var k = fxk, s = r * 2 * k;
    fx.globalAlpha = a; fx.drawImage(c, (x * k - s / 2), (y * k - s / 2), s, s);
  }
  function fxEnd() {
    fx.globalCompositeOperation = 'lighter';
    var i, oxk = 0;
    if (st === 'play' || st === 'over' || st === 'win' || st === 'init') {
      var s = Gm.ship, day = curDayKey(), red = day === 'mon' ? 'red' : 'cyan';
      var ax = window.DEADLINE_ART;
      if (ax && typeof ax.shafts === 'function' && !broken.shafts) { fx.setTransform(fxk, 0, 0, fxk, 0, 0); try { ax.shafts(fx, day, T) } catch (e) { fail('shafts', e) } fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalCompositeOperation = 'lighter' }
      if (!s.dead && st === 'play') {
        if (ax && typeof ax.shipFx === 'function' && !broken.shipFx) { fx.setTransform(fxk, 0, 0, fxk, 0, 0); try { ax.shipFx(fx, s.x, s.y, T, SS) } catch (e) { fail('shipFx', e) } fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalCompositeOperation = 'lighter' }
        else { var th = .5 + (-s.vy / 240) + (Gm.power === 'auto' ? .4 : 0); for (i = -1; i < 2; i++) stamp('ship', s.x + i * 4, s.y + 9, 6 + th * 4, .55) }
      }
      for (i = 0; i < PB.length; i++) if (PB[i].on) { stamp('player', PB[i].x, PB[i].y + 4, 6, .55) }
      for (i = 0; i < EB.length; i++) if (EB[i].on) stamp(day === 'sun' ? 'cream' : red, EB[i].x, EB[i].y, EB[i].kind === 'mail' || EB[i].kind === 'alarm' ? 9 : 6, .45);
      for (i = 0; i < EN.length; i++) { var e = EN[i]; if (!e.on) continue; if (e.type === 'gold') stamp('gold', e.x, e.y, 16, .5); if (e.charge > 0) stamp(red, e.x, e.y + 8, 10, .8); if (e.st === 'mark') stamp('cream', e.x, e.y, 14, .25) }
      for (i = 0; i < PU.length; i++) if (PU[i].on) stamp('gold', PU[i].x, PU[i].y, 14, .6);
      for (i = 0; i < BX.length; i++) if (BX[i].on && BX[i].kind !== 'impact') { var k = 1 - (T - BX[i].t0) * 1.6; if (k > 0) stamp(BX[i].kind === 'player' ? 'pomodoro' : BX[i].kind === 'gold' ? 'gold' : 'cream', BX[i].x, BX[i].y, BX[i].kind === 'boss' || BX[i].kind === 'player' ? 30 : 12, k * (BX[i].kind === 'player' ? .5 : .22)) }
      if (Gm.boss && Gm.boss.kind === 'monday') stamp('red', Gm.boss.x, Gm.boss.y, 90, .18 + .1 * Gm.boss.rage);
      if (Gm.shield > 0 && !s.dead) stamp('cream', s.x, s.y, 16, .18);
      if (Gm.flash > 0 && !RM()) { fx.globalAlpha = Gm.flash * .6; fx.fillStyle = '#FF5B3A'; fx.fillRect(0, 0, fx.canvas.width, fx.canvas.height) }
      if (Gm.nightT > 0) { fx.globalAlpha = .12; fx.fillStyle = '#2F4C9A'; fx.fillRect(0, 0, fx.canvas.width, fx.canvas.height) }
    }
    if (st === 'title' || st === 'board') { stamp('pomodoro', 240, 30, 110, .16); if (((RT * 1.6) | 0) % 2 === 0) stamp('pomodoro', 240, 155, 60, .2) }
    fx.globalAlpha = 1; fx.globalCompositeOperation = 'source-over';
  }

  /* ---------- il cabinato (DOM) ---------- */
  var box, cab, scr, pcv, fcv, goBtn, sndBtn, real, padEl, help, formEl, back = null, raf = 0, last = 0, acc = 0, opened = false, musicaWas = false;
  var mouse = { x: 0, y: 0, in: false };
  function dom() {
    box = document.createElement('div'); box.className = 'dl'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Deadline, the arcade game');
    box.innerHTML =
      '<button class="dlx" type="button" aria-label="Leave the game"><span>Esc</span> Leave</button>' +
      '<div class="dlcab">' +
        '<div class="dlmq" aria-hidden="true"><span class="dlmq1">DEAD</span><span class="dlmq2">LINE</span></div>' +
        '<div class="dlbez"><div class="dlscr" tabindex="-1">' +
          '<canvas class="dlpx" width="' + W + '" height="' + H + '"></canvas><canvas class="dlpx dlac" width="' + W * 2 + '" height="' + H * 2 + '"></canvas><canvas class="dlfx"></canvas><i class="dlscan" aria-hidden="true"></i>' +
        '</div></div>' +
        '<div class="dldeck">' +
          '<div class="dlpad" aria-hidden="true"><span>Drag here to fly</span><small>Two fingers: Night shift</small><em>Turn sideways for a bigger screen</em></div>' +
          '<p class="dlhelp">Arrows or WASD fly &middot; Space shoot &middot; X night shift &middot; P pause &middot; M sound</p>' +
          '<div class="dlbtns"><button class="dlb dlsnd" type="button" aria-pressed="false">Sound on</button><button class="dlb dlgo" type="button">Insert coin</button></div>' +
          '<a class="dlreal" href="/contact">Want this for real? Tell us what slows you down.</a>' +
        '</div>' +
      '</div>' +
      '<div class="dlform" hidden></div>';
    document.body.appendChild(box);
    cab = box.querySelector('.dlcab'); scr = box.querySelector('.dlscr'); pcv = box.querySelector('.dlpx'); fcv = box.querySelector('.dlfx');
    g = pcv.getContext('2d'); g.imageSmoothingEnabled = false; fx = fcv.getContext('2d'); ga = box.querySelector('.dlac').getContext('2d'); ga.imageSmoothingEnabled = false;
    goBtn = box.querySelector('.dlgo'); sndBtn = box.querySelector('.dlsnd'); real = box.querySelector('.dlreal'); padEl = box.querySelector('.dlpad'); help = box.querySelector('.dlhelp'); formEl = box.querySelector('.dlform');
    box.querySelector('.dlx').addEventListener('click', close);
    goBtn.addEventListener('click', function () { unlock(); mainAction() });
    sndBtn.addEventListener('click', function () { unlock(); toggleMute() });
    box.addEventListener('pointerdown', pDown); box.addEventListener('pointermove', pMove); box.addEventListener('pointerup', pUp); box.addEventListener('pointercancel', pUp);
    pcv.addEventListener('pointerleave', function () { mouse.in = false });
    box.addEventListener('contextmenu', function (e) { if (e.target === pcv || e.target === padEl) e.preventDefault() });
    addEventListener('resize', layout);
  }
  function unlock() { aucall('unlock') }
  function toggleMute() { muted = !muted; aucall('mute', muted); syncUI() }
  function mainAction() {
    if (st === 'title') startGame();
    else if (st === 'play') { if (paused) resume(); else pause() }
    else if (st === 'boot') toTitle();
    else cont();
  }
  function cont() {
    if (st === 'clock' && stT > .6) nextDay();
    else if (st === 'crawl') toMap(-1);
    else if ((st === 'over' || st === 'win') && stT > 1) toInit();
    else if (st === 'init') confirmIni();
    else if (st === 'board' && stT > .5) { toTitle() }
  }
  function startGame() {
    unlock(); sfx('insertCoin'); weekendUI(); newGame(); paused = false;
    if (crawlSeen()) toMap(-1); else { st = 'crawl'; stT = 0; crawlK = 0; try { sessionStorage.setItem('mm-deadline-crawl', '1') } catch (e) {} }
    syncUI();
    try { scr.focus({ preventScroll: true }) } catch (e) {}
  }
  function pause() { if (st !== 'play' || paused) return; paused = true; aucall('duck', true); keys.l = keys.r = keys.u = keys.d = keys.f = 0; syncUI() }
  function resume() { if (!paused) return; paused = false; aucall('duck', false); last = 0; if (!curTrack && Gm) music(Gm.nightT > 0 ? 'night' : Gm.boss ? 'boss' : DAYS[Gm.day]); syncUI() }
  function weekendUI() {}
  function syncUI() {
    if (!box) return;
    var lbl = { boot: 'Skip', crawl: 'Skip', title: 'Insert coin', clock: 'Go', over: 'Continue', win: 'Continue', init: 'Save', board: 'Continue', form: 'Insert coin' }[st] || 'Pause';
    if (st === 'play') lbl = paused ? 'Resume' : 'Pause';
    goBtn.textContent = lbl; goBtn.classList.toggle('dlblink', st === 'title');
    sndBtn.textContent = muted ? 'Sound off' : 'Sound on'; sndBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    var end = st === 'over' || st === 'win' || st === 'init' || st === 'board';
    real.classList.toggle('on', end);
    document.documentElement.classList.toggle('dl-play', st === 'play' && !paused);
    box.classList.toggle('dlplaying', st === 'play');
  }
  var lastSt = '';

  /* il puntatore: mouse sulle zone, dito sulla nave */
  function toGame(e) { var r = pcv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H, in: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom } }
  var tps = {}, tpN = 0, twoT = 0;
  function pDown(e) {
    if (formEl && !formEl.hidden && formEl.contains(e.target)) return;
    unlock();
    var p = toGame(e), isT = e.pointerType === 'touch' || e.pointerType === 'pen';
    if (isT) { touchMode = true; box.classList.add('dltouch') } else if (e.pointerType === 'mouse') { touchMode = false; box.classList.remove('dltouch') }
    if (isT) { tps[e.pointerId] = { t: performance.now(), x: e.clientX, y: e.clientY }; tpN++; if (tpN === 2) twoT = performance.now() }
    var onPad = e.target === padEl || padEl.contains(e.target);
    if (st === 'play' && !paused && (isT || onPad)) {
      if (tpN >= 2) return;
      if (p.in || onPad) {
        e.preventDefault(); touch.on = true; touch.id = e.pointerId; touch.abs = p.in && !onPad;
        if (touch.abs) { touch.tx = p.x; touch.ty = p.y - 22 } else { touch.tx = Gm.ship.x; touch.ty = Gm.ship.y; touch.lx = e.clientX; touch.ly = e.clientY }
        try { (e.target).setPointerCapture(e.pointerId) } catch (x) {}
        return;
      }
    }
    if (!p.in) return;
    if (st === 'title' && p.y > 168) { cityDrag = { x: e.clientX, cx: cityX, moved: false }; try { pcv.setPointerCapture(e.pointerId) } catch (x) {} }
  }
  function pMove(e) {
    var p = toGame(e); mouse.x = p.x; mouse.y = p.y; mouse.in = p.in && e.pointerType === 'mouse';
    if (touch.on && e.pointerId === touch.id && Gm) {
      if (touch.abs) { touch.tx = p.x; touch.ty = p.y - 22 }
      else { var r = pcv.getBoundingClientRect(), k = W / r.width * 1.4; touch.tx = clamp(touch.tx + (e.clientX - touch.lx) * k, 10, W - 10); touch.ty = clamp(touch.ty + (e.clientY - touch.ly) * k, SHIP_MIN, SHIP_MAX); touch.lx = e.clientX; touch.ly = e.clientY }
      e.preventDefault(); return;
    }
    if (cityDrag) { var r2 = pcv.getBoundingClientRect(), dx = (e.clientX - cityDrag.x) / r2.width * W; if (Math.abs(dx) > 3) cityDrag.moved = true; cityX = cityDrag.cx - dx }
    pcv.style.cursor = st === 'title' && hover ? 'pointer' : '';
  }
  function pUp(e) {
    var p = toGame(e);
    if (tps[e.pointerId]) {
      var tp = tps[e.pointerId]; delete tps[e.pointerId];
      if (tpN === 2 && performance.now() - twoT < 400) { useNight(); twoT = 0 }
      tpN = Math.max(0, tpN - 1);
    }
    if (touch.on && e.pointerId === touch.id) { touch.on = false; if (Gm) { Gm.ship.vx = 0; Gm.ship.vy = 0 } return }
    if (cityDrag) { var moved = cityDrag.moved; cityDrag = null; if (moved) return }
    if (!p.in || (formEl && !formEl.hidden && formEl.contains(e.target))) return;
    click(p.x, p.y);
  }
  function click(x, y) {
    for (var i = hot.length - 1; i >= 0; i--) {
      var h = hot[i]; if (x < h.x || x >= h.x + h.w || y < h.y || y >= h.y + h.h) continue;
      if (h.id === 'sign') { if (h.sign.link) { sfx('select'); window.open(h.sign.link, '_blank', 'noopener,noreferrer') } return }
      if (h.id === 'start') { startGame(); return }
      if (h.id === 'cont') { cont(); return }
      if (h.id === 'resume') { resume(); return }
      if (h.id === 'quit') { quit(); return }
      if (h.id === 'up' || h.id === 'dn') { iniPos = h.i; stepLetter(h.id === 'up' ? 1 : -1); return }
      if (h.id === 'sel') { iniPos = h.i; sfx('type'); return }
      if (h.id === 'ok') { confirmIni(); return }
    }
    if (st === 'boot') toTitle();
  }
  function quit() { paused = false; aucall('duck', false); Gm = null; toTitle() }
  function stepLetter(d) { var c = ini[iniPos].charCodeAt(0) - 65; c = (c + d + 26) % 26; ini[iniPos] = String.fromCharCode(65 + c); sfx('type') }

  /* la tastiera */
  function isField(t) { return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable) }
  function kd(e) {
    if (!opened) return;
    if (isField(e.target)) return;
    var k = e.key, low = k.length === 1 ? k.toLowerCase() : k;
    unlock();
    if (e.pointerType === undefined) touchMode = false;
    /* codice Konami: Weekend mode */
    konami.push(low); if (konami.length > 10) konami.shift();
    if ((st === 'title' || st === 'boot') && konami.join(',') === KONAMI) { weekend = !weekend; konami = []; sfx('coin'); ftextT(weekend ? 'WEEKEND MODE' : 'WEEKDAYS AGAIN'); return }
    if (st === 'form') return;
    if (st === 'crawl' && k !== 'Escape' && !e.repeat) { e.preventDefault(); toMap(-1); return }
    if (k === 'Escape') { e.preventDefault(); if (st === 'play') { paused ? resume() : pause() } else close(); return }
    if (st === 'play') {
      var m = keyMap(low);
      if (m) { keys[m] = 1; e.preventDefault(); return }
      if (low === 'x' || low === 'shift') { useNight(); e.preventDefault(); return }
      if (low === 'p') { paused ? resume() : pause(); e.preventDefault(); return }
      if (low === 'm') { toggleMute(); return }
      if (paused && low === 'q') { quit(); return }
      if (paused && (k === 'Enter')) { resume(); return }
      return;
    }
    if (low === 'm') { toggleMute(); return }
    if (st === 'init') {
      if (/^[a-z]$/.test(low)) { ini[iniPos] = low.toUpperCase(); sfx('type'); iniPos = Math.min(2, iniPos + 1); e.preventDefault(); return }
      if (k === 'ArrowUp' || low === 'w' && false) { stepLetter(1); e.preventDefault(); return }
      if (k === 'ArrowDown') { stepLetter(-1); e.preventDefault(); return }
      if (k === 'ArrowLeft' || k === 'Backspace') { iniPos = Math.max(0, iniPos - 1); e.preventDefault(); return }
      if (k === 'ArrowRight') { iniPos = Math.min(2, iniPos + 1); e.preventDefault(); return }
      if (k === 'Enter') { confirmIni(); e.preventDefault(); return }
      return;
    }
    if (k === 'Enter' || k === ' ') {
      if (e.target && e.target.closest && e.target.closest('button,a')) return; /* il bottone fa da solo */
      e.preventDefault();
      if (e.repeat) return;
      if (st === 'title') startGame(); else if (st === 'boot') toTitle(); else cont();
    }
    if (st === 'title' && (k === 'ArrowLeft' || k === 'ArrowRight')) { titlePage = (titlePage + (k === 'ArrowLeft' ? -1 + (SIGNS.length ? 4 : 3) : 1)) % (SIGNS.length ? 4 : 3); titlePageT = 0 }
  }
  var ttT = 0, ttS = '';
  function ftextT(s) { ttS = s; ttT = 2 }
  function keyMap(k) {
    if (k === 'ArrowLeft' || k === 'a') return 'l'; if (k === 'ArrowRight' || k === 'd') return 'r';
    if (k === 'ArrowUp' || k === 'w') return 'u'; if (k === 'ArrowDown' || k === 's') return 'd'; if (k === ' ') return 'f'; return '';
  }
  function ku(e) { if (!opened) return; var k = e.key.length === 1 ? e.key.toLowerCase() : e.key, m = keyMap(k); if (m) keys[m] = 0 }

  /* il gamepad (bonus) */
  var PAD = { x: 0, y: 0, f: 0, n: 0, st: 0, prevSt: 0, prevA: 0 };
  function padAxes() {
    PAD.x = PAD.y = 0; PAD.f = 0; PAD.n = 0;
    if (!navigator.getGamepads) return;
    var ps; try { ps = navigator.getGamepads() } catch (e) { return }
    for (var i = 0; ps && i < ps.length; i++) {
      var p = ps[i]; if (!p) continue;
      var ax = p.axes[0] || 0, ay = p.axes[1] || 0; if (Math.abs(ax) > .2) PAD.x = ax; if (Math.abs(ay) > .2) PAD.y = ay;
      var b = p.buttons; if (b[14] && b[14].pressed) PAD.x = -1; if (b[15] && b[15].pressed) PAD.x = 1; if (b[12] && b[12].pressed) PAD.y = -1; if (b[13] && b[13].pressed) PAD.y = 1;
      if (b[0] && b[0].pressed) { PAD.f = 1; touchMode = false }
      if ((b[2] && b[2].pressed) || (b[3] && b[3].pressed)) PAD.n = 1;
      var s = b[9] && b[9].pressed ? 1 : 0; if (s && !PAD.prevSt) { if (st === 'play') { paused ? resume() : pause() } else mainAction() } PAD.prevSt = s;
      var a = b[0] && b[0].pressed ? 1 : 0; if (a && !PAD.prevA && st !== 'play') mainAction(); PAD.prevA = a;
      break;
    }
  }

  /* misure: lo schermo intero quando si puo', sempre nitido */
  var cssScale = 1;
  function layout() {
    if (!box || !opened) return;
    var vw = innerWidth, vh = innerHeight, coarse = matchMedia('(hover: none) and (pointer: coarse)').matches || touchMode;
    var landscape = vw > vh && vh < 520;
    box.classList.toggle('dlland', landscape);
    var mq = box.querySelector('.dlmq'), deck = box.querySelector('.dldeck');
    var mqH = landscape ? 0 : mq.offsetHeight, deckH = landscape ? 0 : (coarse ? 170 : deck.offsetHeight || 90);
    var bez = landscape ? 4 : vw < 600 ? 8 : 22, side = landscape ? 120 : vw < 600 ? 8 : 32;
    var aw = Math.min(vw - side * 2, 1400) - bez * 2, ah = vh - mqH - deckH - bez * 2 - (landscape ? 8 : vw < 600 ? 24 : 56);
    var s = Math.max(.3, Math.min(aw / W, ah / H)), dpr = Math.min(window.devicePixelRatio || 1, 3);
    var si = Math.floor(s), sd = Math.floor(s * dpr) / dpr;
    if (si >= 1 && si / s >= (coarse ? .92 : .78)) s = si; else if (sd > 0 && sd / s >= .9) s = sd;
    cssScale = s;
    var w = Math.round(W * s), h = Math.round(H * s);
    scr.style.width = w + 'px'; scr.style.height = h + 'px';
    var fd = Math.min(window.devicePixelRatio || 1, 2); fcv.width = Math.round(w * fd); fcv.height = Math.round(h * fd); fxk = fcv.width / W;
    cab.style.setProperty('--dlw', (w + bez * 2) + 'px'); cab.style.setProperty('--dlbz', bez + 'px');
  }

  /* il ciclo */
  var ft = new Float32Array(120), fi = 0, fpsN = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    var dt = last ? (now - last) / 1000 : STEP; last = now;
    ft[fi] = dt; fi = (fi + 1) % 120; fpsN++;
    if (dt > .1) dt = .1;
    acc += dt * timeScale; var n = 0;
    while (acc >= STEP && n < 40) { update(STEP); acc -= STEP; n++ }
    if (n >= 40) acc = 0;
    if (iniMsgT > 0) iniMsgT -= dt; if (ttT > 0) ttT -= dt;
    if (st !== lastSt) { lastSt = st; syncUI(); if (st === 'form') {} }
    render();
    if (ttT > 0) { g.globalAlpha = clamp(ttT, 0, 1); txt(ttS, 240, 60, C.pink, 2, 'c', C.night); g.globalAlpha = 1 }
    if (st === 'form') formPreview();
  }

  /* ---------- il modulo del premio (solo per chi batte MONDAY) ---------- */
  var KLAB = { food: 'Food & drink', fashion: 'Fashion & retail', shop: 'Online shop', beauty: 'Beauty & wellness', hotel: 'Hotels & stays', services: 'Services & trades' };
  var FM = { file: null, sign: null, kind: 'food', busy: false, pcv: null, pg: null };
  function openForm() {
    st = 'form'; stT = 0; formEl.hidden = false; music('win');
    var saved = {}; try { saved = JSON.parse(localStorage.getItem('mm-deadline-claim') || '{}') || {} } catch (e) {}
    function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
    formEl.innerHTML =
      '<form class="dlf" novalidate>' +
        '<p class="dlfk">You beat MONDAY</p><h2>Your sign goes up in the city.</h2>' +
        '<p class="dlfs">Put your business on a building in the game. Players see it on the billboards and can click it in the city.</p>' +
        '<div class="dlfprev"><canvas width="320" height="240" aria-label="Preview of your sign on the building"></canvas></div>' +
        '<label class="dlff dlfile"><span>Logo</span><input type="file" name="logo" accept="image/png,image/jpeg,image/webp,image/svg+xml"><em>PNG, JPG, WebP or SVG</em></label>' +
        '<label class="dlff"><span>Cleaner</span><input type="range" name="clean" min="0" max="1" step="0.05" value="0.5"><em>Slide for a cleaner or more detailed sign</em></label>' +
        '<label class="dlff"><span>Business name</span><input type="text" name="business" maxlength="40" required autocomplete="organization" value="' + esc(saved.business) + '"></label>' +
        '<label class="dlff"><span>Link</span><input type="text" name="link" maxlength="200" required placeholder="https://... or @instagram" value="' + esc(saved.link) + '"></label>' +
        '<label class="dlff"><span>What you do <b class="dlfc">0/60</b></span><input type="text" name="line" maxlength="60" required value="' + esc(saved.line) + '"></label>' +
        '<fieldset class="dlff dlkinds"><legend>Type of business</legend>' +
          KINDS.map(function (k) { return '<label><input type="radio" name="kind" value="' + k + '"' + ((saved.kind || 'food') === k ? ' checked' : '') + '><span>' + KLAB[k] + '</span></label>' }).join('') +
        '</fieldset>' +
        '<label class="dlff"><span>Email</span><input type="email" name="mail" required autocomplete="email" value="' + esc(saved.mail) + '"><em>Only to tell you when your sign is up. Deleted after.</em></label>' +
        '<p class="dlfmsg" role="status" aria-live="polite"></p>' +
        '<div class="dlfbtn"><button type="button" class="dlb dlfskip">Not now</button><button type="submit" class="dlb dlfgo">Send my sign</button></div>' +
        '<p class="dlfterms">One sign per business. We review every sign before it goes up. No cash value.</p>' +
      '</form>';
    var f = formEl.querySelector('form'); FM.pcv = formEl.querySelector('canvas'); FM.pg = FM.pcv.getContext('2d'); FM.pg.imageSmoothingEnabled = false; FM.kind = saved.kind || 'food'; FM.sign = null; FM.file = null;
    var cnt = formEl.querySelector('.dlfc'), line = f.elements.line;
    function upd() { cnt.textContent = line.value.length + '/60' } upd(); line.addEventListener('input', upd);
    f.addEventListener('change', function (e) {
      if (e.target.name === 'kind') FM.kind = e.target.value;
      if (e.target.name === 'logo') { FM.file = e.target.files && e.target.files[0] || null; processLogo() }
      saveForm(f);
    });
    var tmr = 0; f.elements.clean.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(processLogo, 120) });
    f.addEventListener('submit', function (e) { e.preventDefault(); sendForm(f) });
    formEl.querySelector('.dlfskip').addEventListener('click', function () { closeForm() });
    setTimeout(function () { var i = f.elements.logo; if (i) i.focus() }, 50);
  }
  function saveForm(f) {
    try { localStorage.setItem('mm-deadline-claim', JSON.stringify({ business: f.elements.business.value, link: f.elements.link.value, line: f.elements.line.value, kind: FM.kind, mail: f.elements.mail.value })) } catch (e) {}
  }
  function processLogo() {
    if (!FM.file) return;
    var f = formEl.querySelector('form'), clean = +f.elements.clean.value, msg = formEl.querySelector('.dlfmsg');
    if (FM.file.size > 4 * 1024 * 1024) { msg.textContent = 'That file is too big. Keep it under 4 MB.'; return }
    var S = window.DEADLINE_SIGN;
    var p = S && typeof S.process === 'function' ? S.process(FM.file, { clean: clean, color: C.cream }) : simpleSign(FM.file);
    Promise.resolve(p).then(function (r) { FM.sign = r; msg.textContent = '' }, function (e) { var c = e && e.code; msg.textContent = c === 'size' ? 'That file is too big.' : c === 'type' ? 'Use a PNG, JPG, WebP or SVG.' : c === 'dims' ? 'That image is too small or too large.' : 'We could not read that file. Try a PNG.' });
  }
  function simpleSign(file) {
    /* riserva senza il motore: l'immagine centrata e ridotta, niente pulizia */
    return new Promise(function (ok, ko) {
      if (/svg/.test(file.type)) return ko(new Error('svg'));
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () { var c = document.createElement('canvas'), k = Math.min(96 / im.width, 48 / im.height, 1); c.width = Math.max(1, im.width * k | 0); c.height = Math.max(1, im.height * k | 0); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); c.toBlob(function (b) { ok({ canvas: c, png: b, w: c.width, h: c.height }) }, 'image/png') };
      im.onerror = function () { URL.revokeObjectURL(u); ko(new Error('img')) }; im.src = u;
    });
  }
  function formPreview() {
    if (!FM.pcv) return;
    var S = window.DEADLINE_SIGN, nm = formEl.querySelector('[name=business]'), sign = FM.sign ? { pixel: FM.sign.pixel || null, canvas: FM.sign.canvas, img: FM.sign.pixel || FM.sign.canvas, name: nm ? nm.value : '' } : null;
    if (S && typeof S.preview === 'function' && !broken.preview) { try { S.preview(FM.pcv, FM.kind, sign, T); return } catch (e) { broken.preview = true } }
    var keep = g; g = FM.pg; g.setTransform(1, 0, 0, 1, 0, 0);
    R(0, 0, 320, 240, '#060B1E'); var d = BSIZE[FM.kind], k = 2; g.save(); g.translate(160 - d[0] * k / 2, 236 - d[1] * k); g.scale(k, k);
    dBuilding(FM.kind, 0, 0, d[0], d[1], T, sign ? { img: sign.img, name: sign.name } : null); g.restore();
    g = keep;
  }
  function sendForm(f) {
    var msg = formEl.querySelector('.dlfmsg'), el = f.elements, link = el.link.value.trim();
    if (/^@?[a-z0-9._]{2,30}$/i.test(link) && link.indexOf('.') < 0 || /^@/.test(link)) link = 'https://instagram.com/' + link.replace(/^@/, '');
    else if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link;
    var bad = !FM.sign ? 'Add your logo first.' : !el.business.value.trim() ? 'Add the name of your business.' : !/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(link) ? 'Check the link.' : !el.line.value.trim() ? 'Tell us what you do, in one line.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.mail.value.trim()) ? 'Check the email.' : '';
    if (bad) { msg.textContent = bad; return }
    if (FM.busy) return; FM.busy = true; msg.textContent = 'Sending...'; saveForm(f);
    var o = { run: Gm && Gm.run, token: Gm && Gm.token, initials: LAST ? LAST.initials : '', business: el.business.value.trim().slice(0, 40), link: link, line: el.line.value.trim().slice(0, 60), kind: FM.kind, logoPng: FM.sign.png, mail: el.mail.value.trim(), email: el.mail.value.trim() };
    var n = window.DEADLINE_NET;
    var p = n && typeof n.claim === 'function' ? safeP(function () { return n.claim(o) }, function (e) { return { ok: false, err: e } }) : Promise.resolve({ ok: false });
    p.then(function (r) {
      FM.busy = false;
      if (r && r.ok) {
        try { localStorage.removeItem('mm-deadline-claim') } catch (e) {}
        f.innerHTML = '<p class="dlfk">Sent</p><h2>Thank you.</h2><p class="dlfs">We review every sign by hand. When yours is up, we write to you once, then delete your email.</p><div class="dlfbtn"><button type="button" class="dlb dlfgo dlfdone">Back to the city</button></div>';
        f.querySelector('.dlfdone').addEventListener('click', closeForm);
      } else if (r && r.error && !r.offline) msg.textContent = r.error === 'logo' ? 'Add your logo first.' : 'The server said no (' + String(r.error).slice(0, 30) + '). Check the details and try again.';
      else msg.textContent = 'We could not reach the server. Your details are saved on this device: try again in a minute.';
    });
  }
  function closeForm() { formEl.hidden = true; formEl.innerHTML = ''; FM.pcv = null; st = 'board'; stT = 0; LAST.win = false; if (box) box.querySelector('.dlgo').focus() }

  /* ---------- aprire e chiudere ---------- */
  function open(x, y) {
    if (!box) dom();
    if (opened) return;
    back = document.activeElement; opened = true;
    box.style.setProperty('--ox', (x == null ? innerWidth / 2 : x) + 'px'); box.style.setProperty('--oy', (y == null ? innerHeight / 2 : y) + 'px');
    box.classList.add('on'); document.documentElement.classList.add('dl-on');
    touchMode = matchMedia('(hover: none) and (pointer: coarse)').matches; box.classList.toggle('dltouch', touchMode);
    layout(); requestAnimationFrame(function () { box.classList.add('in'); layout() });
    /* la musica del sito si ferma e riparte alla chiusura */
    musicaWas = false; var au0 = au(); if (au0 && 'muted' in au0) muted = !!au0.muted;
    try { if (window.MUSICA && window.MUSICA.state && window.MUSICA.state().st === 'play') { window.MUSICA.pause(); musicaWas = true } } catch (e) {}
    if (st === 'boot') { bootT = 0 } else if (st === 'play') { paused = true; aucall('duck', true) } else if (st === 'title') music('title', true);
    loadTop(); loadSigns();
    last = 0; acc = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
    syncUI();
    setTimeout(function () { if (goBtn) goBtn.focus() }, 350);
  }
  function close() {
    if (!box || !opened) return;
    opened = false;
    if (st === 'play') { paused = true }
    aucall('stopAll'); curTrack = '';
    box.classList.remove('in'); document.documentElement.classList.remove('dl-on', 'dl-play');
    keys.l = keys.r = keys.u = keys.d = keys.f = 0; touch.on = false;
    setTimeout(function () { if (!opened) { box.classList.remove('on'); cancelAnimationFrame(raf); raf = 0 } }, RM() ? 0 : 450);
    try { if (musicaWas && window.MUSICA) window.MUSICA.play() } catch (e) {}
    if (back && back.focus) try { back.focus() } catch (e) {}
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden && opened && st === 'play') { pause() } });
  addEventListener('keydown', kd); addEventListener('keyup', ku);
  addEventListener('blur', function () { keys.l = keys.r = keys.u = keys.d = keys.f = 0 });

  window.DEADLINE = { open: open, close: close };

  /* ---------- il gancio di prova (solo con ?dldebug nell'indirizzo) ---------- */
  if (DBG) {
    window.DEADLINE._debug = {
      state: function () {
        var s = 0, mx = 0; for (var i = 0; i < 120; i++) { s += ft[i]; if (ft[i] > mx) mx = ft[i] }
        return { st: st, paused: paused, phase: Gm && Gm.phase, day: Gm ? DAYS[Gm.day] : null, wave: Gm && Gm.wave, score: Gm ? Math.round(Gm.score) : 0, coffee: Gm && Gm.coffee,
          lit: Gm ? countLit() : 0, cityHits: Gm && Gm.cityHits, enemies: Gm ? aliveCount() : 0, ebullets: Gm ? ebCount() : 0, boss: Gm && Gm.boss ? { kind: Gm.boss.kind, hp: Gm.boss.hp, ph: Gm.boss.ph } : null,
          clock: Gm ? clockStr(Gm.clock) : '', playT: Gm ? Math.round(Gm.playT * 10) / 10 : 0, frameMs: Math.round(s / 120 * 10000) / 10, maxFrameMs: Math.round(mx * 10000) / 10, fpsN: fpsN,
          scale: cssScale, weekend: weekend, hurtBy: Gm && Gm.dbgHurt, kills: Gm ? Gm.log.kills.reduce(function (a, b) { return a + b }, 0) : 0, cityHits2: Gm && Gm.cityHits, touch: touchMode, power: Gm && Gm.power, shield: Gm && Gm.shield, night: Gm && Gm.night, log: Gm && Gm.log, last: LAST, top: TOP, art: !!window.DEADLINE_ART, broken: Object.keys(broken) };
      },
      day: function (n) { if (!Gm) newGame(); startDay(n | 0); paused = false; syncUI() },
      god: function (on) { god = on !== false }, scale: function (v) { timeScale = +v || 1 }, bot: function (on) { botOn = on !== false },
      spawn: function (type, x, y) { if (!Gm) return; if (type === 'urgent' || type === 'monday') { spawnBoss(type); Gm.phase = type === 'monday' ? 'boss' : 'urgent'; return } var e = spawnEnemy(type, x || 240, y || 60); if (e) { if (type === 'gold') { e.st = 'cross'; e.vx = 60; e.y0 = 24; e.base = 'call' } else if (type === 'double') { runEvent({ k: 'double', x: x }); e.on = false } else if (type === 'spam') { e.on = false; runEvent({ k: 'swarm', n: 8, path: 'sine', side: -1, y: y || 60 }) } else { e.st = 'fall'; e.x0 = e.x; e.vx = 0; e.vy = 10 } } },
      give: function (k) { if (!Gm) return; if (k === 'night') Gm.night = true; else if (k === 'booking') Gm.shield = 3; else { Gm.power = k; Gm.powerT = 10 } },
      win: function () { if (Gm && Gm.boss) bossDamage(Gm.boss, Gm.boss.hp, Gm.boss.x, Gm.boss.y) },
      lose: function (c) { if (Gm) die(c || 'coffee') },
      kill: function () { if (!Gm) return; for (var i = 0; i < EN.length; i++) if (EN[i].on) killEnemy(EN[i], true) },
      hurt: function () { if (Gm) { Gm.ship.inv = 0; hurt() } },
      konami: function () { weekend = !weekend; return weekend },
      press: function (a) { mainAction() }, go: function (s) { if (s === 'title') toTitle() },
      pause: pause, resume: resume
    };
  }
  /* il gioco usa il suo stato anche se il cabinato si apre piu' volte */
  void winGame;
})();
