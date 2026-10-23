/* DEADLINE · la grafica (window.DEADLINE_ART). Tutto pixel art fatta in codice, preparata una volta in init()
   su canvas fuori schermo; le chiamate di disegno sono solo drawImage dalla cache (frame scelto da t).
   Regole: ART-BRIEF.md (colori fissi, rampa a 8 posti per giorno, luce della citta' dal basso, pomodoro solo al giocatore).

   COORDINATE (pixel del gioco 480x270):
   - centro in x,y: ship, enemy, boss, bullet, powerup, explosion, mark, logo (x = centro, y = alto), page, reticle.
   - angolo in alto a sinistra: text (con align), firewall, meeting, icon, building, digits, tiny.

   AGGIUNTE al contratto (il contratto resta intatto):
   - ART.setDay(day): giorno corrente per la luce degli sprite (bordo alto = accento del giorno, sotto = crema).
     Anche ART.sky(ctx, day) lo imposta. ART.day = giorno corrente.
   - ART.size[type] -> {w,h} visibili di ogni sprite (seguono ART-BRIEF, non il contratto: per le hitbox usare queste).
   - ART.prepareDay(day): prepara le cache di un giorno (init fa tue e night, gli altri si fanno da soli nei momenti
     liberi; chiamarlo durante il cartello CLOCKED OUT se serve). ART.prepareBoss(): prepara i fotogrammi di MONDAY.
   - ART.mark(ctx, x, y, size, t, color): t < 1.1 = la m si disegna dal basso con la riga pomodoro (accensione).
   - ART.logoSize() -> {w,h}. ART.initMs = durata di init().
   - ART.enemy(..., s): oltre a hit/phase/fade, s.dead = true -> disegno a linea crema (fotogramma di morte, 2 frame);
     noshow: fade 0 = visibile, 1 = sparito.
   - ART.cable(ctx, x1, y1, x2, y2, t): il filo che lega i due Double booking (accento che pulsa).
   - ART.ring / bullet: kind in piu' 'diamond' (3x3) e 'diamondBig' (5x5): i colpi nemici generici. Mai pomodoro.
   - ART.page(ctx, x, y, t, k): pagina strappata del calendario che vola (3 fotogrammi, k = 0..2 sfasa la rotazione).
   - ART.reticle(ctx, x, y, t): il mirino dell'AI (accento freddo, angoli).
   - ART.digits(ctx, str, x, y, color): cifre mono 4x6 con lo zero barrato (per HOURS SAVED e l'orologio) -> larghezza.
   - ART.tiny(ctx, str, x, y, color): font 3x5 maiuscolo (cartelloni, cartellini) -> larghezza. ART.tinyWidth(str).
   - ART.icon(ctx, 'coffeeSpill', x, y, k): la tazza che si rovescia, k = 0..2 fotogramma.
   - ART.city(ctx, windows, t, day, shift): shift = spostamento -8..8 px della citta' vicina (parallasse 0.5 legata
     alla nave). ART.windowRects sono a shift 0: sommare shift. Una finestra che passa da accesa a spenta fa da sola
     3 lampi e una brace crema che cade.
   - ART.signSlot(kind, w, h) -> {x,y,w,h}: dove va l'insegna nel palazzo (relativo all'angolo del palazzo).
   - ART.shafts(ctx, day, t): fasci di luce (per il canvas FX, in coordinate di gioco, gia' in 'lighter').
   - ART.glitch(ctx, t, amount): fette orizzontali spostate (danni, MONDAY). Niente se prefers-reduced-motion.
   - ART.shipFx(ctx, x, y, t, s): le fiamme dei tre motori come bagliori (per il canvas FX, coordinate di gioco).
   - ART.glow(name, size): size 0..3 (piccolo..grande). Ogni glow ha .gw .gh = misura in pixel di gioco:
     ctx.drawImage(g, x - g.gw / 2, y - g.gh / 2, g.gw, g.gh). Nomi: player pomodoro gold red cyan ship cream accent
     (accento del giorno corrente) logo window flame.
   - ART.explosion(...) -> true finche' e' viva. kind: tipo del nemico ('call','invoice',...) | 'impact' (colpo del
     giocatore, 1 frame) | 'player' | 'boss' | 'gold' | 'paper'.
   - ART.logo(ctx, x, y, t, glitch, o): o.rule = 0..1 la riga pomodoro sotto (default: si riempie da sola col tempo).
   - ART.ship: 19x16, la cabina (1px bianco caldo, la hitbox visibile) e' a (x, y - 3). Lo scudo (s.shield > 0) copia
     la scena gia' disegnata dietro la nave: disegnare la nave dopo sfondo e nemici.
   - ART.reduced: true se prefers-reduced-motion (niente glitch, lampi, tremolii).
   - ART.W, ART.H, ART.cityTop (y dove comincia la citta' vicina), ART.streetTop.
*/
(function () {
  'use strict';
  var ART = window.DEADLINE_ART = { ready: false };
  var W = 480, H = 270;
  ART.W = W; ART.H = H;
  var CITY_TOP = 234, STREET = 258;
  ART.cityTop = CITY_TOP; ART.streetTop = STREET;
  var reduced = false;
  try { reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) {}
  ART.reduced = reduced;

  // ---------- colori fissi (ART-BRIEF 1)
  var C = {
    night: '#0F0F0E', ink: '#121211', cream: '#F4F2EC', hot: '#FBFAF7',
    g1: '#BEC2BF', g2: '#7E8580', g3: '#4A4E4C', g4: '#2A2D2C', off: '#3A3A38',
    skin: '#F2CDBE',
    t0: '#7A2416', t1: '#C23E26', tomato: '#FF5B3A', t3: '#FF9A7A', t4: '#FFE3D6',
    gd0: '#6E4A16', gd1: '#B8862E', gd2: '#E8B64A', gd3: '#FFE08A',
    p0: '#F4F2EC', p1: '#D9D4C7', p2: '#9C978B', p3: '#55524B',
    win1: '#F4F2EC', win2: '#EAD9B8', win3: '#F2CDBE',
    crim0: '#3A0A10', crim1: '#7A1C25', crim2: '#B21E33', crim3: '#E0263F', crim4: '#F2707E',
    cyan: '#3CE6EE'
  };
  ART.palette = C;

  // ---------- i giorni: rampa a 8 posti (ART-BRIEF 2)
  var DAYS = {
    tue: ['#0A0F1C', '#121A2E', '#22314D', '#1A2440', '#10172A', '#090C15', '#3A5078', '#5FD3FF'],
    wed: ['#110D1C', '#1D152E', '#3A2852', '#2C2142', '#1A1428', '#0D0A14', '#6E5A94', '#B99CFF'],
    thu: ['#0D110B', '#171E15', '#2F3A1F', '#252E1C', '#151B12', '#0A0D08', '#6F7F33', '#C6EE48'],
    fri: ['#140C16', '#271329', '#4E2147', '#391A37', '#210F21', '#110910', '#9A4D78', '#FF86CF'],
    sat: ['#170E12', '#3A1C22', '#B5713E', '#57302C', '#2D1A1B', '#140C0D', '#C79465', '#FFC56A'],
    sun: ['#93A8B8', '#C9CDC6', '#F4F2EC', '#B3B8B2', '#7C837E', '#2A2D2C', '#F4F2EC', '#F2CDBE'],
    mon: ['#110506', '#280A0E', '#561219', '#3A0E13', '#200A0C', '#100506', '#7A1C25', '#E0263F'],
    night: ['#060B1E', '#0C1838', '#16295E', '#132350', '#0C1736', '#060A18', '#2F4C9A', '#8FB4FF']
  };
  var DAYK = ['tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'mon', 'night'];
  ART.days = {};
  DAYK.forEach(function (k) {
    var d = DAYS[k];
    ART.days[k] = { sky: [d[0], d[1], d[2]], far: d[3], mid: d[4], near: d[5], fog: d[6], accent: d[7],
      glitch: k === 'mon' ? C.cyan : null, weather: { tue: 'rain', wed: 'fog', thu: 'smog', fri: 'party', sat: 'dust', sun: 'clear', mon: 'glitch', night: 'stars' }[k] };
  });
  function D(day) { return DAYS[day] || DAYS.tue }

  // ---------- utilita' colore
  function rgb(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)] }
  function hx(r, g, b) { return '#' + ((1 << 24) | (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16).slice(1).toUpperCase() }
  function mix(a, b, k) { var A = rgb(a), B = rgb(b); return hx(A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k) }
  function lum(r, g, b) { return (r * .299 + g * .587 + b * .114) / 255 }
  var B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function bay(x, y) { return (B4[(y & 3) * 4 + (x & 3)] + .5) / 16 }
  function rnd(seed) { var s = seed >>> 0; return function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
  function hash(n) { n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15); return (n >>> 0) / 4294967296 }

  function mk(w, h) { var c = document.createElement('canvas'); c.width = Math.max(1, w); c.height = Math.max(1, h); var g = c.getContext('2d'); g.imageSmoothingEnabled = false; return { c: c, g: g } }

  // ---------- griglie a caratteri (per disegnare a pixel con controllo)
  function grid(w, h) { var a = []; for (var y = 0; y < h; y++) { var r = []; for (var x = 0; x < w; x++) r.push('.'); a.push(r) } return { w: w, h: h, a: a } }
  function rows(rs) { var g = grid(rs[0].length, rs.length); for (var y = 0; y < g.h; y++) for (var x = 0; x < g.w; x++) g.a[y][x] = rs[y][x] || '.'; return g }
  function gs(g, x, y, c) { x = x | 0; y = y | 0; if (x >= 0 && y >= 0 && x < g.w && y < g.h) g.a[y][x] = c }
  function gg(g, x, y) { return (x >= 0 && y >= 0 && x < g.w && y < g.h) ? g.a[y][x] : '.' }
  function gr(g, x, y, w, h, c) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) gs(g, x + i, y + j, c) }
  function gbox(g, x, y, w, h, c) { for (var i = 0; i < w; i++) { gs(g, x + i, y, c); gs(g, x + i, y + h - 1, c) } for (var j = 0; j < h; j++) { gs(g, x, y + j, c); gs(g, x + w - 1, y + j, c) } }
  function gl(g, x0, y0, x1, y1, c) { var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy; for (var n = 0; n < 999; n++) { gs(g, x0, y0, c); if (x0 === x1 && y0 === y1) break; var e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx } if (e2 <= dx) { e += dx; y0 += sy } } }
  function gpoly(g, P, c) { var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, i; for (i = 0; i < P.length; i++) { x0 = Math.min(x0, P[i][0]); x1 = Math.max(x1, P[i][0]); y0 = Math.min(y0, P[i][1]); y1 = Math.max(y1, P[i][1]) }
    for (var y = Math.floor(y0); y <= y1; y++) for (var x = Math.floor(x0); x <= x1; x++) { var px = x + .5, py = y + .5, ins = false; for (i = 0, j = P.length - 1; i < P.length; j = i++) { var a = P[i], b = P[j]; if ((a[1] > py) !== (b[1] > py) && px < (b[0] - a[0]) * (py - a[1]) / (b[1] - a[1]) + a[0]) ins = !ins } if (ins) gs(g, x, y, c) } var j }
  function gell(g, cx, cy, rx, ry, c) { for (var y = Math.floor(cy - ry); y <= cy + ry; y++) for (var x = Math.floor(cx - rx); x <= cx + rx; x++) { var dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry; if (dx * dx + dy * dy <= 1) gs(g, x, y, c) } }
  function gtext(g, str, x, y, c) { for (var i = 0; i < str.length; i++) { var gl3 = T3[str[i]]; if (!gl3) { x += 4; continue } for (var r = 0; r < 5; r++) for (var q = 0; q < gl3[r].length; q++) if (gl3[r][q] === '#') gs(g, x + q, y + r, c); x += gl3[0].length + 1 } }
  function gtext5(g, str, x, y, c, sz) { sz = sz || 1; for (var i = 0; i < str.length; i++) { var gp = GLY[str[i]] || GLY['?']; for (var r = 0; r < gp.r.length; r++) for (var q = 0; q < gp.w; q++) if (gp.r[r][q] === '#') gr(g, x + q * sz, y + r * sz, sz, sz, c); x += (gp.w + 1) * sz } }
  // griglia -> canvas
  var PC = {};
  function pcol(h) { if (!PC[h]) { var r = rgb(h); PC[h] = [r[0], r[1], r[2], h.length > 7 ? parseInt(h.substr(7, 2), 16) : 255] } return PC[h] }
  function can(g, pal, ox, oy) { var s = mk(g.w, g.h), id = s.g.createImageData(g.w, g.h), d = id.data; for (var y = 0; y < g.h; y++) for (var x = 0; x < g.w; x++) { var ch = g.a[y][x]; if (ch === '.' || !pal[ch]) continue; var p = pcol(pal[ch]), i = (y * g.w + x) * 4; d[i] = p[0]; d[i + 1] = p[1]; d[i + 2] = p[2]; d[i + 3] = p[3] } s.g.putImageData(id, 0, 0); return s.c }
  function mirror(half, odd) { return half.map(function (r) { var m = r.split('').reverse().join(''); return r + (odd ? m.slice(1) : m) }) }

  // ---------- post-processi sui canvas (luce dal basso, oro, lampo, linea)
  function px(c) { return c.getContext('2d').getImageData(0, 0, c.width, c.height) }
  function fromData(id) { var s = mk(id.width, id.height); s.g.putImageData(id, 0, 0); return s.c }
  // luce della citta': bordo alto = accento, sotto = crema, contorno notte tranne sotto. keep = colori che non si toccano
  function lightUp(src, day, o) {
    o = o || {}; var w = src.width, h = src.height, s = px(src), d = s.data, out = new ImageData(w, h), q = out.data;
    var acc = rgb(D(day)[7]), cr = rgb(day === 'sun' ? C.cream : C.cream), nt = rgb(o.outline || (day === 'sun' ? C.ink : C.night)), keep = o.keep || {};
    var topK = o.top == null ? .4 : o.top;
    function A(x, y) { return x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0 }
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var i = (y * w + x) * 4;
      if (d[i + 3] > 0) {
        var r = d[i], g = d[i + 1], b = d[i + 2], key = hx(r, g, b);
        if (!keep[key]) {
          if (!A(x, y - 1) && topK > 0) { r += (acc[0] - r) * topK; g += (acc[1] - g) * topK; b += (acc[2] - b) * topK }
          else if (!A(x, y + 1) && o.rim !== false) { r += (cr[0] - r) * .85; g += (cr[1] - g) * .85; b += (cr[2] - b) * .85 }
        }
        q[i] = r; q[i + 1] = g; q[i + 2] = b; q[i + 3] = d[i + 3];
      } else if (o.outline !== false && !A(x, y - 1) && (A(x - 1, y) || A(x + 1, y) || A(x, y + 1))) {
        q[i] = nt[0]; q[i + 1] = nt[1]; q[i + 2] = nt[2]; q[i + 3] = 255;
      }
    }
    return fromData(out);
  }
  var GOLD = [rgb(C.gd0), rgb(C.gd1), rgb(C.gd2), rgb(C.gd3)];
  function goldOf(src) { var s = px(src), d = s.data; for (var i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; var l = lum(d[i], d[i + 1], d[i + 2]), k = l < .22 ? 0 : l < .5 ? 1 : l < .78 ? 2 : 3, c = GOLD[k]; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2] } return fromData(s) }
  function solid(src, col) { var s = mk(src.width, src.height); s.g.drawImage(src, 0, 0); s.g.globalCompositeOperation = 'source-in'; s.g.fillStyle = col; s.g.fillRect(0, 0, src.width, src.height); return s.c }
  function lineOf(src, col) { var w = src.width, h = src.height, s = px(src), d = s.data, out = new ImageData(w, h), q = out.data, c = rgb(col);
    function A(x, y) { return x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0 }
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) if (A(x, y) && (!A(x - 1, y) || !A(x + 1, y) || !A(x, y - 1) || !A(x, y + 1))) { var i = (y * w + x) * 4; q[i] = c[0]; q[i + 1] = c[1]; q[i + 2] = c[2]; q[i + 3] = 255 }
    return fromData(out) }
  // pad di 1 px attorno (per il contorno)
  function pad(src, n) { n = n || 1; var s = mk(src.width + n * 2, src.height + n * 2); s.g.drawImage(src, n, n); return s.c }
  // dissolvenza a dither ordinato (k 0..1 = quanto sparisce)
  function dissolve(src, k) { var s = px(src), d = s.data, w = src.width; for (var i = 0; i < d.length; i += 4) { var p = i / 4, x = p % w, y = (p / w) | 0; if (bay(x, y) < k) d[i + 3] = 0 } return fromData(s) }
  function tint(src, col) { return solid(src, col) }

  // ======================================================================================
  // FONT 5x7 (maiuscole, minuscole con discendenti, cifre, punteggiatura)
  var F5 = {
    'A': '.###.|#...#|#...#|#####|#...#|#...#|#...#', 'B': '####.|#...#|#...#|####.|#...#|#...#|####.', 'C': '.###.|#...#|#....|#....|#....|#...#|.###.',
    'D': '####.|#...#|#...#|#...#|#...#|#...#|####.', 'E': '#####|#....|#....|####.|#....|#....|#####', 'F': '#####|#....|#....|####.|#....|#....|#....',
    'G': '.###.|#...#|#....|#.###|#...#|#...#|.####', 'H': '#...#|#...#|#...#|#####|#...#|#...#|#...#', 'I': '###|.#.|.#.|.#.|.#.|.#.|###',
    'J': '..###|...#.|...#.|...#.|...#.|#..#.|.##..', 'K': '#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#', 'L': '#....|#....|#....|#....|#....|#....|#####',
    'M': '#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#', 'N': '#...#|#...#|##..#|#.#.#|#..##|#...#|#...#', 'O': '.###.|#...#|#...#|#...#|#...#|#...#|.###.',
    'P': '####.|#...#|#...#|####.|#....|#....|#....', 'Q': '.###.|#...#|#...#|#...#|#.#.#|#..#.|.##.#', 'R': '####.|#...#|#...#|####.|#.#..|#..#.|#...#',
    'S': '.####|#....|#....|.###.|....#|....#|####.', 'T': '#####|..#..|..#..|..#..|..#..|..#..|..#..', 'U': '#...#|#...#|#...#|#...#|#...#|#...#|.###.',
    'V': '#...#|#...#|#...#|#...#|#...#|.#.#.|..#..', 'W': '#...#|#...#|#...#|#.#.#|#.#.#|#.#.#|.#.#.', 'X': '#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#',
    'Y': '#...#|#...#|.#.#.|..#..|..#..|..#..|..#..', 'Z': '#####|....#|...#.|..#..|.#...|#....|#####',
    'a': '.....|.....|.###.|....#|.####|#...#|.####', 'b': '#....|#....|####.|#...#|#...#|#...#|####.', 'c': '.....|.....|.####|#....|#....|#....|.####',
    'd': '....#|....#|.####|#...#|#...#|#...#|.####', 'e': '.....|.....|.###.|#...#|#####|#....|.####', 'f': '..##|.#..|####|.#..|.#..|.#..|.#..',
    'g': '.....|.....|.####|#...#|#...#|.####|....#|####.', 'h': '#....|#....|####.|#...#|#...#|#...#|#...#', 'i': '.#.|...|##.|.#.|.#.|.#.|###',
    'j': '...#|....|..##|...#|...#|...#|...#|###.', 'k': '#...|#...|#..#|#.#.|##..|#.#.|#..#', 'l': '##.|.#.|.#.|.#.|.#.|.#.|###',
    'm': '.....|.....|##.#.|#.#.#|#.#.#|#.#.#|#.#.#', 'n': '.....|.....|####.|#...#|#...#|#...#|#...#', 'o': '.....|.....|.###.|#...#|#...#|#...#|.###.',
    'p': '.....|.....|####.|#...#|#...#|####.|#....|#....', 'q': '.....|.....|.####|#...#|#...#|.####|....#|....#', 'r': '....|....|#.##|##..|#...|#...|#...',
    's': '.....|.....|.####|#....|.###.|....#|####.', 't': '.#..|.#..|####|.#..|.#..|.#..|..##', 'u': '.....|.....|#...#|#...#|#...#|#...#|.####',
    'v': '.....|.....|#...#|#...#|#...#|.#.#.|..#..', 'w': '.....|.....|#...#|#...#|#.#.#|#.#.#|.#.#.', 'x': '.....|.....|#...#|.#.#.|..#..|.#.#.|#...#',
    'y': '.....|.....|#...#|#...#|#...#|.####|....#|####.', 'z': '.....|.....|#####|...#.|..#..|.#...|#####',
    '0': '.###.|#...#|#..##|#.#.#|##..#|#...#|.###.', '1': '.#.|##.|.#.|.#.|.#.|.#.|###', '2': '.###.|#...#|....#|...#.|..#..|.#...|#####',
    '3': '#####|...#.|..#..|...#.|....#|#...#|.###.', '4': '...#.|..##.|.#.#.|#..#.|#####|...#.|...#.', '5': '#####|#....|####.|....#|....#|#...#|.###.',
    '6': '..##.|.#...|#....|####.|#...#|#...#|.###.', '7': '#####|....#|...#.|..#..|.#...|.#...|.#...', '8': '.###.|#...#|#...#|.###.|#...#|#...#|.###.',
    '9': '.###.|#...#|#...#|.####|....#|...#.|.##..',
    '.': '.|.|.|.|.|.|#', ',': '..|..|..|..|..|.#|.#|#.', ':': '.|.|#|.|.|#|.', ';': '..|..|.#|..|..|.#|.#|#.', '!': '#|#|#|#|#|.|#',
    '?': '.###.|#...#|....#|...#.|..#..|.....|..#..', "'": '#|#|.|.|.|.|.', '"': '#.#|#.#|...|...|...|...|...', '-': '...|...|...|###|...|...|...',
    '+': '.....|..#..|..#..|#####|..#..|..#..|.....', '/': '....#|...#.|...#.|..#..|.#...|.#...|#....', '%': '##..#|##.#.|...#.|..#..|.#...|.#.##|#..##',
    '#': '.#.#.|.#.#.|#####|.#.#.|#####|.#.#.|.#.#.', '@': '.###.|#...#|#.###|#.#.#|#.###|#....|.####', '&': '.##..|#..#.|#.#..|.#...|#.#.#|#..#.|.##.#',
    '(': '..#|.#.|#..|#..|#..|.#.|..#', ')': '#..|.#.|..#|..#|..#|.#.|#..', '<': '...|..#|.#.|#..|.#.|..#|...', '>': '...|#..|.#.|..#|.#.|#..|...',
    '*': '.....|#.#.#|.###.|#####|.###.|#.#.#|.....', '=': '....|....|####|....|####|....|....', '_': '.....|.....|.....|.....|.....|.....|#####',
    '[': '##|#.|#.|#.|#.|#.|##', ']': '##|.#|.#|.#|.#|.#|##', '$': '.###.|#.#..|#.#..|.###.|..#.#|..#.#|.###.', '~': '.....|.....|.#..#|#.##.|.....|.....|.....',
    '·': '.|.|.|#|.|.|.'
  };
  var GLY = {};
  Object.keys(F5).forEach(function (k) { var r = F5[k].split('|'); GLY[k] = { r: r, w: r[0].length } });
  GLY[' '] = { r: [], w: 3 };
  function glyph(ch) { return GLY[ch] || GLY['?'] }
  function textWidth(str, size) { size = size || 1; var w = 0, m = 0; str = String(str); for (var i = 0; i < str.length; i++) { if (str[i] === '\n') { m = Math.max(m, w); w = 0; continue } w += (glyph(str[i]).w + 1) * size } m = Math.max(m, w); return Math.max(0, m - size) }
  var ATL = {}; // atlanti per colore e misura
  var ORDER = Object.keys(GLY);
  function atlas(col, size) {
    var k = col + '|' + size; if (ATL[k]) return ATL[k];
    var x = 0, pos = {}; ORDER.forEach(function (ch) { pos[ch] = x; x += (GLY[ch].w + 1) * size });
    var s = mk(x, 9 * size); s.g.fillStyle = col;
    ORDER.forEach(function (ch) { var gph = GLY[ch]; for (var r = 0; r < gph.r.length; r++) for (var q = 0; q < gph.w; q++) if (gph.r[r][q] === '#') s.g.fillRect(pos[ch] + q * size, r * size, size, size) });
    return (ATL[k] = { c: s.c, pos: pos });
  }
  function text(ctx, str, x, y, o) {
    o = o || {}; str = String(str); var size = o.size || 1, col = o.color || C.cream, al = o.align || 'l';
    var lines = str.split('\n'), maxw = 0;
    for (var L = 0; L < lines.length; L++) {
      var ln = lines[L], w = textWidth(ln, size), sx = Math.round(al === 'c' ? x - w / 2 : al === 'r' ? x - w : x), sy = Math.round(y + L * 10 * size);
      if (o.shadow) draw(atlas(o.shadow === true ? C.night : o.shadow, size), ln, sx + size, sy + size, size);
      draw(atlas(col, size), ln, sx, sy, size); maxw = Math.max(maxw, w);
    }
    return maxw;
    function draw(a, s, px0, py, sz) { for (var i = 0; i < s.length; i++) { var ch = s[i], gph = GLY[ch] ? ch : '?', gw = (GLY[gph].w + 1) * sz; if (ch !== ' ') ctx.drawImage(a.c, a.pos[gph], 0, gw, 9 * sz, px0, py, gw, 9 * sz); px0 += gw } }
  }
  ART.text = text; ART.textWidth = textWidth; ART.font = { text: text, width: textWidth, height: 7, lineHeight: 10 };

  // FONT 3x5 (cartelloni, cartellini)
  var T3 = {};
  ('A.#.|#.#|###|#.#|#.#;B##.|#.#|##.|#.#|##.;C.##|#..|#..|#..|.##;D##.|#.#|#.#|#.#|##.;E###|#..|##.|#..|###;F###|#..|##.|#..|#..;' +
   'G.##|#..|#.#|#.#|.##;H#.#|#.#|###|#.#|#.#;I###|.#.|.#.|.#.|###;J..#|..#|..#|#.#|.#.;K#.#|#.#|##.|#.#|#.#;L#..|#..|#..|#..|###;' +
   'M#...#|##.##|#.#.#|#...#|#...#;N#..#|##.#|#.##|#..#|#..#;O.#.|#.#|#.#|#.#|.#.;P##.|#.#|##.|#..|#..;Q.#.|#.#|#.#|##.|.##;R##.|#.#|##.|#.#|#.#;' +
   'S.##|#..|.#.|..#|##.;T###|.#.|.#.|.#.|.#.;U#.#|#.#|#.#|#.#|###;V#.#|#.#|#.#|#.#|.#.;W#...#|#...#|#.#.#|##.##|#...#;X#.#|#.#|.#.|#.#|#.#;' +
   'Y#.#|#.#|.#.|.#.|.#.;Z###|..#|.#.|#..|###;0###|#.#|#.#|#.#|###;1.#.|##.|.#.|.#.|###;2##.|..#|.#.|#..|###;3##.|..#|.#.|..#|##.;' +
   '4#.#|#.#|###|..#|..#;5###|#..|##.|..#|##.;6.##|#..|###|#.#|###;7###|..#|.#.|.#.|.#.;8###|#.#|###|#.#|###;9###|#.#|###|..#|##.;' +
   '..|.|.|.|#;:.|#|.|#|.;!#|#|#|.|#;-..|..|##|..|..;/..#|..#|.#.|#..|#..;+...|.#.|###|.#.|...;?##.|..#|.#.|...|.#.;\'#|#|.|.|.;&.#.|#.#|.#.|#.#|.##')
    .split(';').forEach(function (e) { T3[e[0]] = e.slice(1).split('|') });
  function tinyWidth(str) { var w = 0; str = String(str).toUpperCase(); for (var i = 0; i < str.length; i++) { var g3 = T3[str[i]]; w += (g3 ? g3[0].length : 3) + 1 } return Math.max(0, w - 1) }
  var TATL = {};
  function tinyAtlas(col) { if (TATL[col]) return TATL[col]; var keys = Object.keys(T3), x = 0, pos = {}; keys.forEach(function (k) { pos[k] = x; x += T3[k][0].length + 1 }); var s = mk(x, 5); s.g.fillStyle = col; keys.forEach(function (k) { var g3 = T3[k]; for (var r = 0; r < 5; r++) for (var q = 0; q < g3[r].length; q++) if (g3[r][q] === '#') s.g.fillRect(pos[k] + q, r, 1, 1) }); return (TATL[col] = { c: s.c, pos: pos }) }
  function tiny(ctx, str, x, y, col) { var a = tinyAtlas(col || C.cream); str = String(str).toUpperCase(); var x0 = x = Math.round(x); y = Math.round(y); for (var i = 0; i < str.length; i++) { var g3 = T3[str[i]], w = g3 ? g3[0].length : 3; if (g3) ctx.drawImage(a.c, a.pos[str[i]], 0, w, 5, x, y, w, 5); x += w + 1 } return x - x0 - 1 }
  ART.tiny = tiny; ART.tinyWidth = tinyWidth;

  // CIFRE 4x6 mono, zero barrato (cenno al DM Mono)
  var DG = { '0': '.##.|#..#|#.##|##.#|#..#|.##.', '1': '.#..|##..|.#..|.#..|.#..|###.', '2': '.##.|#..#|..#.|.#..|#...|####', '3': '###.|...#|.##.|...#|...#|###.',
    '4': '#..#|#..#|####|...#|...#|...#', '5': '####|#...|###.|...#|...#|###.', '6': '.##.|#...|###.|#..#|#..#|.##.', '7': '####|...#|..#.|.#..|.#..|.#..',
    '8': '.##.|#..#|.##.|#..#|#..#|.##.', '9': '.##.|#..#|#..#|.###|...#|.##.', ':': '....|.#..|....|....|.#..|....', '.': '....|....|....|....|....|.#..',
    '-': '....|....|.##.|....|....|....', '/': '...#|..#.|..#.|.#..|.#..|#...', ' ': '....|....|....|....|....|....', 'x': '....|#..#|.##.|.##.|#..#|....' };
  var DATL = {};
  function digits(ctx, str, x, y, col) { col = col || C.cream; var a = DATL[col]; if (!a) { var keys = Object.keys(DG), s = mk(keys.length * 5, 6), pos = {}; s.g.fillStyle = col; keys.forEach(function (k, i) { pos[k] = i * 5; var r = DG[k].split('|'); for (var j = 0; j < 6; j++) for (var q = 0; q < 4; q++) if (r[j][q] === '#') s.g.fillRect(i * 5 + q, j, 1, 1) }); a = DATL[col] = { c: s.c, pos: pos } }
    str = String(str); x = Math.round(x); y = Math.round(y); for (var i = 0; i < str.length; i++) { var p = a.pos[str[i]]; if (p != null) ctx.drawImage(a.c, p, 0, 4, 6, x + i * 5, y, 4, 6) } return str.length * 5 - 1 }
  ART.digits = digits;

  // ======================================================================================
  // LA NAVE v2 (27x23): fusoliera lunga, canard, ali a freccia con la piega, gondole d'estremita' con le luci di via,
  // tre motori con gli archi pomodoro (le gambe della m) che pulsano. Cabina 1px bianco caldo = hitbox a (x, y - 3).
  var SW_ = 27, SH_ = 23, SCX = 13, SCY = 11;
  var SHIP_PAL = { o: C.night, '1': C.g1, '2': C.g2, '3': C.g3, '4': C.g4, w: C.hot, c: C.cream, g: '#DCE8EC', r: C.tomato, d: C.t1, D: C.t0, h: C.t3 };
  var SHIP_INFO = [];
  function shipGrid(bank) {
    var g = grid(SW_, SH_), k = Math.abs(bank) * .1;
    function X(x) { var d = x - 13.5; if ((bank > 0 && d > 0) || (bank < 0 && d < 0)) d *= 1 - k; return 13.5 + d }
    function P(pts) { return pts.map(function (p) { return [X(p[0]), p[1]] }) }
    function both(pts, c) { gpoly(g, P(pts), c); gpoly(g, P(pts.map(function (p) { return [27 - p[0], p[1]] })), c) }
    both([[11.4, 8.2], [6, 12.4], [2.6, 14.6], [2.6, 17.4], [11.4, 17.4]], 'W');
    both([[11.4, 5.8], [8.2, 8.6], [8.2, 9.8], [11.4, 9.4]], 'C');
    both([[1.2, 11.6], [2.5, 9.2], [3.8, 11.6], [3.8, 19.4], [1.2, 19.4]], 'P');
    both([[6, 16.2], [9, 16.2], [9, 20], [6, 20]], 'E');
    gpoly(g, P([[13.5, .2], [15.1, 4], [16.2, 9], [16.4, 16], [15.4, 20], [11.6, 20], [10.6, 16], [10.8, 9], [11.9, 4]]), 'F');
    gpoly(g, P([[12, 16.6], [15, 16.6], [15, 20], [12, 20]]), 'E');
    var src = gclone(g), T = { F: ['1', '2'], W: ['1', '2'], P: ['1', '2'], C: ['1', '2'], E: ['2', '3'] }, x, y;
    for (y = 0; y < SH_; y++) for (x = 0; x < SW_; x++) {
      var r = src.a[y][x]; if (r === '.') continue;
      var up = gg(src, x, y - 1) === '.', dn = gg(src, x, y + 1) === '.', L = gg(src, x - 1, y), Rr = gg(src, x + 1, y), side = bank > 0 ? x > 13 : x < 13;
      var c = up ? T[r][0] : T[r][1];
      if (dn && r !== 'E') c = 'c';
      if (!up && !dn && r === 'W' && (L === 'F' || Rr === 'F' || L === 'P' || Rr === 'P' || L === 'E' || Rr === 'E')) c = '3';
      if (!up && !dn && r === 'F' && (L !== 'F' || Rr !== 'F')) c = '3';
      if (!up && !dn && r === 'P' && (L === '.' || Rr === '.')) c = '3';
      if (bank && side && r === 'W' && c === '2') c = '3';
      if (bank && side && up && c === '1') c = '2';
      g.a[y][x] = c;
    }
    function crease(x0, y0, x1, y1) { var t2 = grid(SW_, SH_); gl(t2, x0, y0, x1, y1, 'z'); for (var yy = 0; yy < SH_; yy++) for (var xx = 0; xx < SW_; xx++) if (t2.a[yy][xx] === 'z' && (g.a[yy][xx] === '2' || g.a[yy][xx] === '3')) g.a[yy][xx] = '4' }
    crease(Math.round(X(10.2)), 10, Math.round(X(4.4)), 14); crease(Math.round(X(16.8)), 10, Math.round(X(22.6)), 14);
    // dorso, prese d'aria, cabina
    for (y = 10; y < 17; y++) if (g.a[y][13] === '2') g.a[y][13] = '1';
    [[11, 10], [15, 10], [11, 11], [15, 11]].forEach(function (p) { if (g.a[p[1]][p[0]] !== '.') g.a[p[1]][p[0]] = '4' });
    for (y = 6; y < 10; y++) { if (g.a[y][12] !== '.') g.a[y][12] = '4'; if (g.a[y][14] !== '.') g.a[y][14] = '4' }
    g.a[4][13] = '4'; g.a[5][13] = 'g'; g.a[6][13] = '4'; g.a[7][13] = '4'; g.a[8][13] = 'w'; g.a[9][13] = '4';
    // la m crema sull'ala sinistra
    var mx = Math.round(X(5.6)), M = ['##.#.', '#.#.#', '#.#.#'];
    for (var j = 0; j < 3; j++) for (var q = 0; q < 5; q++) if (M[j][q] === '#' && g.a[13 + j][mx + q] !== '.') g.a[13 + j][mx + q] = 'c';
    // archi dei motori (le gambe della m)
    var eng = [Math.round(X(6)), 12, Math.round(X(18))];
    eng.forEach(function (a) { gs(g, a, 20, 'd'); gs(g, a + 1, 20, 'r'); gs(g, a + 2, 20, 'd'); gs(g, a, 21, 'r'); gs(g, a + 2, 21, 'r'); gs(g, a, 22, 'D'); gs(g, a + 2, 22, 'D') });
    // contorno notte, tranne sotto (luce dalla citta')
    var f2 = gclone(g);
    for (y = 0; y < SH_; y++) for (x = 0; x < SW_; x++) { if (f2.a[y][x] !== '.') continue; var A = function (xx, yy) { var v = gg(f2, xx, yy); return v !== '.' && v !== 'r' && v !== 'd' && v !== 'D' }; if (!A(x, y - 1) && (A(x - 1, y) || A(x + 1, y) || A(x, y + 1))) g.a[y][x] = 'o' }
    // luci di via: in cima alle gondole
    var nav = []; [Math.round(X(2.5)), Math.round(X(24.5))].forEach(function (nx) { for (var yy = 0; yy < SH_; yy++) { var v = g.a[yy][nx]; if (v !== '.' && v !== 'o') { nav.push([nx, yy]); break } } });
    return { g: g, eng: eng, nav: nav };
  }
  // ======================================================================================
  // NEMICI: oggetti d'ufficio, rampa carta + inchiostro, un dettaglio d'accento (a = accento del giorno)
  var EPAL = { '0': C.p0, '1': C.p1, '2': C.p2, '3': C.p3, k: C.ink, a: '#FF00FF', A: '#AA00AA', w: C.hot };
  // la a/A si sostituisce con l'accento del giorno nel momento della luce
  function accentize(src, day) { var s = px(src), d = s.data, a = rgb(D(day)[7]), A = rgb(mix(D(day)[7], C.ink, .45)); if (day === 'sun') { a = rgb('#C2627A'); A = rgb('#7A2E44') } for (var i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; if (d[i] === 255 && d[i + 1] === 0 && d[i + 2] === 255) { d[i] = a[0]; d[i + 1] = a[1]; d[i + 2] = a[2] } else if (d[i] === 170 && d[i + 1] === 0 && d[i + 2] === 170) { d[i] = A[0]; d[i + 1] = A[1]; d[i + 2] = A[2] } } return fromData(s) }

  // NEMICI v2: oggetti d'ufficio con la faccia (come URGENT e MONDAY): occhi arrabbiati, un dettaglio d'accento
  // Missed call (20x17): telefono a disco, la cornetta che salta, il disco e' la bocca che urla
  function eCall(f) {
    var g = grid(23, 19), o = [0, 1, 0, -1][f], lift = f % 2, cx = 11 + o;
    gr(g, cx - 7, 3 - lift, 15, 2, '1'); gr(g, cx - 6, 2 - lift, 13, 1, '0');
    gr(g, cx - 9, 4 - lift, 5, 3, '1'); gr(g, cx + 5, 4 - lift, 5, 3, '1'); gr(g, cx - 9, 4 - lift, 5, 1, '0'); gr(g, cx + 5, 4 - lift, 5, 1, '0');
    gr(g, cx - 4, 5 - lift, 9, 1, '2');
    gpoly(g, [[cx - 5.5, 7], [cx + 6.5, 7], [cx + 9.5, 17], [cx - 8.5, 17]], '1');
    gr(g, cx - 5, 7, 11, 1, '0'); gr(g, cx - 8, 16, 18, 1, '2'); for (var y = 8; y < 16; y++) gs(g, cx + 6 + ((y - 7) * 3 / 10 | 0), y, '2');
    // occhi e sopracciglia (inner basse = arrabbiato)
    [[cx - 5, cx - 4, cx - 6, 1], [cx + 4, cx + 5, cx + 6, -1]].forEach(function (e) {
      gr(g, e[0], 9, 2, 2, 'k'); gs(g, e[0], 9, 'w');
      gs(g, e[2], 7, 'k'); gs(g, e[2] + e[3], 8, 'k'); gs(g, e[2] + 2 * e[3], 8, 'k');
    });
    // il disco = bocca che urla
    gell(g, cx + .5, 13.6, 3.3, 2.8, 'A'); gell(g, cx + .5, 13.6, 2.2, 1.7, 'k');
    var holes = f % 2 ? [[-3, 0], [3, 0], [0, -2]] : [[-2, -2], [3, -1], [-2, 2]]; holes.forEach(function (h) { gs(g, cx + h[0], 13 + h[1], 'a') });
    gs(g, cx, 13, 'w');
    // squilli
    if (f % 2) { [[cx - 11, 3], [cx - 11, 4], [cx - 12, 2], [cx - 12, 5]].forEach(function (p) { gs(g, p[0], p[1], 'a') }); [[cx + 11, 3], [cx + 11, 4], [cx + 12, 2], [cx + 12, 5]].forEach(function (p) { gs(g, p[0], p[1], 'a') }) }
    return can(g, EPAL);
  }
  // Paper invoice (16x20): foglio con l'angolo piegato, faccia scocciata, timbro DUE in accento
  function eInvoice(f) {
    var g = grid(19, 21), sw = [0, 1, 0, -1][f];
    function S(y) { return Math.round(sw * (y - 10) / 10) }
    for (var y = 1; y < 20; y++) { gr(g, 2 + S(y), y, 15, 1, '0'); gs(g, 16 + S(y), y, '1') }
    var a = S(1);
    [[16, 1], [15, 1], [14, 1], [16, 2], [15, 2], [16, 3]].forEach(function (p) { gs(g, p[0] + a, p[1], '.') });
    gs(g, 13 + a, 1, '1'); gs(g, 13 + a, 2, '1'); gs(g, 14 + a, 2, '2'); gs(g, 13 + a, 3, '2'); gs(g, 14 + a, 3, '2'); gs(g, 15 + a, 3, '3'); gs(g, 16 + a, 4, '1');
    gr(g, 4 + S(3), 3, 7, 1, '2'); gr(g, 4 + S(4), 4, 4, 1, '2');
    // faccia
    var s7 = S(8);
    gr(g, 5 + s7, 8, 2, 2, 'k'); gr(g, 11 + s7, 8, 2, 2, 'k'); gs(g, 5 + s7, 8, 'w'); gs(g, 11 + s7, 8, 'w');
    gs(g, 4 + s7, 6, 'k'); gs(g, 5 + s7, 7, 'k'); gs(g, 6 + s7, 7, 'k'); gs(g, 13 + s7, 6, 'k'); gs(g, 12 + s7, 7, 'k'); gs(g, 11 + s7, 7, 'k');
    var s11 = S(12); gr(g, 7 + s11, 12, 4, 1, 'k'); gs(g, 6 + s11, 13, 'k'); gs(g, 11 + s11, 13, 'k');
    // timbro DUE
    var L = [['##.', '#.#', '##.'], ['#.#', '#.#', '###'], ['###', '##.', '###']], sh = S(16);
    for (var k = 0; k < 3; k++) for (var r = 0; r < 3; r++) for (var q = 0; q < 3; q++) if (L[k][r][q] === '#') gs(g, 4 + sh + k * 4 + q, 15 + r, 'a');
    gr(g, 3 + sh, 14, 13, 1, 'A'); gr(g, 3 + sh, 18, 13, 1, 'A');
    return can(g, EPAL);
  }
  // Receipt (8x14): mezzo foglio con gli occhietti, fondo a zig-zag
  function eReceipt(f) {
    var g = grid(10, 15);
    gr(g, 1, 1, 8, 12, '0'); for (var y = 1; y < 13; y++) gs(g, 8, y, '1');
    for (var x = 1; x < 9; x++) gs(g, x, 13, (x + f) % 2 ? '0' : '.');
    if (f) { gr(g, 2, 5, 2, 1, 'k'); gr(g, 6, 5, 2, 1, 'k') } else { gr(g, 3, 4, 1, 2, 'k'); gr(g, 6, 4, 1, 2, 'k'); gs(g, 2, 3, 'k'); gs(g, 7, 3, 'k') }
    gr(g, 4, 7, 2, 1, 'k'); gr(g, 2, 9, 5, 1, '2'); gr(g, 2, 11, 3, 1, '2'); gs(g, 6, 11, 'a'); gs(g, 7, 11, 'a');
    return can(g, EPAL);
  }
  // No-show (15x22): solo una linea tratteggiata che marcia, due occhi vuoti che lampeggiano, cartellino T4
  var NS_SHAPE = (function () { var g = grid(16, 23); gell(g, 7.5, 4.7, 3.6, 3.8, 'x'); gpoly(g, [[0.6, 22], [1, 15.2], [3.2, 11.8], [11.8, 11.8], [14, 15.2], [14.4, 22]], 'x'); var e = grid(16, 23); for (var y = 0; y < 23; y++) for (var x = 0; x < 16; x++) if (g.a[y][x] === 'x' && (gg(g, x - 1, y) !== 'x' || gg(g, x + 1, y) !== 'x' || gg(g, x, y - 1) !== 'x' || gg(g, x, y + 1) !== 'x')) e.a[y][x] = 'x'; return e })();
  function eNoshow(f, blink) {
    var g = grid(16, 23);
    for (var y = 0; y < 23; y++) for (var x = 0; x < 16; x++) if (NS_SHAPE.a[y][x] === 'x' && (((x + y + f) >> 1) & 1)) gs(g, x, y, '0');
    if (!blink) { gs(g, 6, 4, '0'); gs(g, 9, 4, '0'); gs(g, 6, 5, '0'); gs(g, 9, 5, '0') } else { gs(g, 6, 5, '0'); gs(g, 9, 5, '0') }
    gs(g, 11, 13, '2'); gs(g, 12, 14, '2');
    gr(g, 9, 15, 7, 7, 'a'); gr(g, 10, 16, 5, 5, 'A');
    [[10, 16], [11, 16], [12, 16], [11, 17], [11, 18], [11, 19], [13, 16], [13, 17], [13, 18], [14, 18], [14, 16], [14, 17], [14, 19], [14, 20]].forEach(function (p) { gs(g, p[0], p[1], '0') });
    return can(g, EPAL);
  }
  // Spam (15x10): busta con le ali di carta che sbattono, !!! in accento
  function eSpam(f) {
    var g = grid(17, 12);
    if (f) { gpoly(g, [[4.5, 5], [0.5, 1], [1.5, 7]], '1'); gpoly(g, [[12.5, 5], [16.5, 1], [15.5, 7]], '1'); gl(g, 1, 1, 4, 5, '2'); gl(g, 15, 1, 12, 5, '2') }
    else { gpoly(g, [[4.5, 5], [0.5, 10], [2.5, 4]], '1'); gpoly(g, [[12.5, 5], [16.5, 10], [14.5, 4]], '1'); gl(g, 1, 9, 4, 6, '2'); gl(g, 15, 9, 12, 6, '2') }
    gr(g, 4, 3, 9, 7, '0'); gr(g, 4, 3, 9, 2, '1'); gs(g, 8, 5, '2'); gs(g, 7, 4, '2'); gs(g, 9, 4, '2'); gr(g, 4, 9, 9, 1, '1');
    [6, 8, 10].forEach(function (x) { gs(g, x, 6, 'a'); gs(g, x, 7, 'a'); gs(g, x, 9, 'a') });
    gs(g, 8, 6, 'a');
    return can(g, EPAL);
  }
  // Double booking (14x14): biglietto del calendario con la faccia a denti stretti, testata in accento
  function eDouble(f) {
    var g = grid(16, 16);
    gr(g, 1, 3, 14, 12, '0'); gr(g, 1, 3, 14, 3, 'a'); gr(g, 1, 6, 14, 1, 'A'); for (var y = 7; y < 15; y++) gs(g, 14, y, '1');
    gr(g, 4, 1, 1, 3, '3'); gr(g, 11, 1, 1, 3, '3');
    if (f) { gr(g, 3, 9, 3, 1, 'k'); gr(g, 10, 9, 3, 1, 'k') } else { gr(g, 4, 8, 2, 2, 'k'); gr(g, 10, 8, 2, 2, 'k'); gs(g, 4, 8, 'w'); gs(g, 10, 8, 'w'); gs(g, 3, 7, 'k'); gs(g, 12, 7, 'k') }
    gr(g, 4, 11, 8, 2, 'k'); for (var x = 5; x < 11; x += 2) { gs(g, x, 11, '0'); gs(g, x + 1, 12, '0') }
    return can(g, EPAL);
  }
  // ======================================================================================
  // BOSS
  // URGENT (64x40): grande busta nel cremisi di MONDAY, il sigillo di ceralacca che batte, la bocca e' il lembo
  var UPAL = { k: C.ink, '0': C.crim4, '1': C.crim3, '2': C.crim2, '3': C.crim1, '4': C.crim0, p: C.p0, q: C.p1, s: C.p2, w: C.hot, c: C.cream, e: C.ink };
  function bUrgent(mouth, beat) {
    var g = grid(66, 44), top = 3, open = [0, 5, 9][mouth], tip = top + 23 - open;
    gr(g, 1, top + 2, 64, 37, '2'); gr(g, 1, top + 2, 64, 1, '1');
    // bocca: interno scuro tra il lembo e il lembo di sotto, denti di carta
    if (open) {
      gpoly(g, [[6, top + 3], [60, top + 3], [33, top + 25]], '4');
      for (var x = 12; x < 55; x++) { var d0 = Math.abs(x - 33), yb = Math.round(top + 25 - d0 * 22 / 27); if (((x >> 1) & 1)) { gs(g, x, yb - 1, 'p'); gs(g, x, yb - 2, 'q') } else gs(g, x, yb - 1, 'p') }
    }
    // lembo inferiore (V dal basso)
    gpoly(g, [[1, top + 39], [33, top + 19], [65, top + 39]], '3');
    gpoly(g, [[4, top + 39], [33, top + 21], [62, top + 39]], '2');
    gl(g, 1, top + 38, 32, top + 19, '1'); gl(g, 64, top + 38, 34, top + 19, '1');
    // lembo superiore (si accorcia aprendo la bocca)
    gpoly(g, [[1, top + 2], [65, top + 2], [33, tip + 1]], '3');
    gpoly(g, [[1, top + 2], [65, top + 2], [33, tip - 1]], '1');
    gpoly(g, [[5, top + 3], [61, top + 3], [33, tip - 3]], '2');
    if (open) for (var x2 = 14; x2 < 53; x2++) { var d1 = Math.abs(x2 - 33), ye = Math.round(tip + 1 - d1 * (tip - top - 1) / 32); if (((x2 >> 1) & 1)) gs(g, x2, ye + 1, 'p') }
    // occhi arrabbiati sul lembo
    var ey = top + 8 - (open >> 2);
    [[21, 1], [45, -1]].forEach(function (e) { var ex = e[0]; gr(g, ex - 3, ey, 7, 3, 'p'); gr(g, ex - 1 + e[1], ey, 2, 3, 'e'); gs(g, ex - 1 + e[1], ey, 'w');
      for (var k = 0; k < 8; k++) { var bx = ex - 4 + k, by = ey - 1 - (e[1] > 0 ? (7 - k) >> 1 : k >> 1) + 2; gs(g, bx, by - 2, 'k'); gs(g, bx, by - 3, 'k') } });
    // sigillo di ceralacca che batte
    var r = beat ? 6.6 : 5.6; gell(g, 33, tip, r, r, '4'); gell(g, 33, tip, r - 1.3, r - 1.3, '3'); gell(g, 31.8, tip - 1.4, 1.8, 1.3, '1');
    gs(g, 33, tip - 2, '0'); gs(g, 33, tip - 1, '0'); gs(g, 33, tip, '0'); gs(g, 33, tip + 2, '0');
    gtext(g, 'URGENT', 6, top + 33, 'c');
    return lightUp(can(g, UPAL), 'mon', { top: .25 });
  }

  // MONDAY (160x110): calendario da scrivania, anelli squadrati, la faccia fatta con le celle
  var MPAL = { k: C.ink, '0': C.p0, '1': C.p1, '2': C.p2, '3': C.p3, r: C.crim3, R: C.crim2, d: C.crim1, D: C.crim0, m: C.g1, n: C.g2, N: C.g3, c: C.cream, e: C.ink, w: C.hot, y: '#FFE08A', Y: '#B8862E' };
  var MON_W = 160, MON_H = 110, CELL_W = 20, CELL_H = 13, GX = 10, GY = 34;
  function bMonday(phase, mouth, blink, torn) {
    var g = grid(MON_W + 2, MON_H + 2);
    // pila di pagine sotto (spessore)
    for (var i = 0; i < 3; i++) { gr(g, 4 + i, 102 + i * 2, 152 - i * 2, 2, i % 2 ? '1' : '2') }
    // pagina
    gr(g, 4, 22, 152, 82, '0');
    gr(g, 4, 100, 152, 2, '1');
    for (var y = 22; y < 102; y++) gs(g, 155, y, '1');
    // testata cremisi con MONDAY
    gr(g, 4, 10, 152, 22, 'r'); gr(g, 4, 10, 152, 1, 'R'); gr(g, 4, 30, 152, 2, 'd');
    // strappi delle pagine gia' tolte (sotto gli anelli)
    for (var t = 0; t < Math.min(torn, 4); t++) for (var x = 6; x < 154; x++) if (((x * 7 + t * 13) % 5) < 3) gs(g, x, 32 + t, t % 2 ? '1' : '0');
    // anelli squadrati
    for (var k = 0; k < 6; k++) { var ax = 20 + k * 24; gr(g, ax, 2, 6, 2, 'm'); gr(g, ax, 2, 2, 12, 'm'); gr(g, ax + 4, 2, 2, 12, 'n'); gr(g, ax + 1, 12, 4, 2, 'N'); gs(g, ax + 2, 13, '.'); gs(g, ax + 3, 13, '.') }
    // griglia 7x5
    for (var cy = 0; cy < 5; cy++) for (var cx = 0; cx < 7; cx++) {
      var x0 = GX + cx * CELL_W, y0 = GY + 2 + cy * CELL_H;
      gbox(g, x0, y0, CELL_W + 1, CELL_H + 1, '1');
      var n = cy * 7 + cx - 1; if (n >= 1 && n <= 31) { var s = String(n); for (var q = 0; q < s.length; q++) gtext(g, s[q], x0 + 2 + q * 4, y0 + 2, '2') }
    }
    // celle rosse: una in piu' per fase (la scadenza)
    var reds = [[0, 0], [6, 4], [6, 0]];
    for (var rr = 0; rr < phase; rr++) { var c0 = reds[rr]; var rx = GX + c0[0] * CELL_W + 1, ry = GY + 3 + c0[1] * CELL_H; gr(g, rx, ry, CELL_W - 1, CELL_H - 1, 'r'); gl(g, rx + 2, ry + 2, rx + CELL_W - 4, ry + CELL_H - 4, 'c'); gl(g, rx + CELL_W - 4, ry + 2, rx + 2, ry + CELL_H - 4, 'c');
      // inchiostro rosso che cola (fase 2 e 3)
      if (phase >= 2 && c0[1] < 4) [[3, 3], [9, 5], [14, 2]].forEach(function (d0) { for (var dd = 0; dd < d0[1]; dd++) gs(g, rx + d0[0], ry + CELL_H - 1 + dd, dd === d0[1] - 1 ? 'R' : 'r') }) }
    // corna: gli angoli della testata si piegano in su (fase 2 e 3)
    if (phase >= 2) [0, 1].forEach(function (sd) { var X = function (x) { return sd ? 159 - x : x }, tip = phase === 3 ? 0 : 3;
      gpoly(g, [[X(4), 12], [X(15), 11], [X(5), 6], [X(2), tip]], 'N'); gl(g, X(6), 10, X(3), tip + 3, 'n'); gs(g, X(2), tip, 'd'); gs(g, X(2), tip + 1, 'd'); gs(g, X(3), tip + 1, 'D') });
    // fase 3: crepe nella pagina e la vena della rabbia
    if (phase === 3) { [[14, 92, 22, 86, 20, 80], [150, 40, 143, 46, 146, 52], [128, 98, 120, 92, 124, 88]].forEach(function (c) { gl(g, c[0], c[1], c[2], c[3], '3'); gl(g, c[2], c[3], c[4], c[5], '3') });
      [[0, 1], [1, 0], [1, 2], [2, 1]].forEach(function (v) { gr(g, 133 + v[0] * 4, 40 + v[1] * 4, 3, 3, 'r') }) }
    // occhi: due celle
    [[2, 1], [4, 1]].forEach(function (e, i) {
      var ex = GX + e[0] * CELL_W + 1, ey = GY + 3 + e[1] * CELL_H;
      gr(g, ex, ey, CELL_W - 1, CELL_H - 1, 'e');
      if (blink) { gr(g, ex + 3, ey + 6, CELL_W - 7, 1, '2') }
      else {
        // pupille rosse che guardano giu' verso la nave, un po' strabiche (cattivo)
        var pz = phase === 1 ? 3 : 4, pxo = i ? 5 : 10;
        gr(g, ex + pxo - 1, ey + 4, pz + 2, pz + 2, 'D'); gr(g, ex + pxo, ey + 5, pz, pz, 'r'); gs(g, ex + pxo, ey + 5, 'w'); if (phase === 3) gs(g, ex + pxo + 1, ey + 5, 'y');
        if (phase === 1) { gr(g, ex, ey, CELL_W - 1, 4, '1'); gr(g, ex, ey + 4, CELL_W - 1, 1, 'e') } // palpebra pesante, sguardo di sufficienza
      }
      // sopracciglia (fase 2 e 3: a V)
      if (phase >= 2) { for (var bk = 0; bk < CELL_W - 1; bk++) { var dy = i ? (bk * 5 / (CELL_W - 2)) | 0 : 5 - ((bk * 5 / (CELL_W - 2)) | 0); gs(g, ex + bk, ey - 7 + dy, 'e'); gs(g, ex + bk, ey - 6 + dy, 'e'); if (phase === 3) gs(g, ex + bk, ey - 5 + dy, 'e') } }
      else { if (i === 0) { gr(g, ex + 1, ey - 5, CELL_W - 4, 2, 'e'); gs(g, ex, ey - 4, 'e') } else { gr(g, ex + 2, ey - 3, CELL_W - 4, 2, 'e'); gs(g, ex + 1, ey - 2, 'e') } }
    });
    // bocca: riga di celle
    var my = GY + 3 + 3 * CELL_H, mh = [3, 7, 11][mouth];
    var mx0 = GX + 1 * CELL_W + 1, mw = 5 * CELL_W - 1, mtop = my + Math.round((CELL_H - 1 - mh) / 2);
    if (phase === 1 && mouth === 0) { // ghigno storto con un canino
      gr(g, mx0 + 8, my + 6, mw - 22, 2, 'e'); gl(g, mx0 + mw - 14, my + 6, mx0 + mw - 6, my + 2, 'e'); gl(g, mx0 + mw - 14, my + 7, mx0 + mw - 6, my + 3, 'e'); gs(g, mx0 + 7, my + 7, 'e'); gs(g, mx0 + 6, my + 7, 'e');
      gr(g, mx0 + mw - 16, my + 8, 2, 2, 'c'); gs(g, mx0 + mw - 15, my + 9, '1') }
    else {
      gr(g, mx0, mtop, mw, mh, 'e');
      // denti crema
      for (var tx = mx0 + 1; tx < mx0 + mw - 1; tx++) { var tt = (tx >> 1) & 1; gs(g, tx, mtop + tt, 'c'); if (mh > 4) gs(g, tx, mtop + mh - 1 - tt, 'c') }
      if (mh >= 7) { gr(g, mx0 + 8, mtop + mh - 4, mw - 16, 2, 'D'); gr(g, mx0 + 12, mtop + mh - 5, mw - 24, 1, 'd') }
      // zanne: due denti lunghi agli angoli
      [mx0 + 4, mx0 + mw - 6].forEach(function (fx) { for (var fy = 0; fy < Math.max(2, mh - 3); fy++) { gs(g, fx, mtop + fy, 'c'); gs(g, fx + 1, mtop + fy, fy === Math.max(2, mh - 3) - 1 ? '1' : 'c') } });
    }
    // fase 3: la sveglia (due campane sopra la testata)
    gtext5(g, 'MONDAY', 46, 14, 'c', 2);
    return lightUp(can(g, MPAL), 'mon', { top: .2 });
  }
  // campane della sveglia (rage), 2 frame
  function bells(f) {
    var g = grid(32, 18), o = f ? 1 : -1;
    [[8, o], [23, -o]].forEach(function (b) { var x = b[0] + b[1]; gell(g, x, 10, 6.5, 7, 'Y'); gell(g, x - .5, 10, 5.5, 6, 'y'); gr(g, x - 7, 11, 15, 7, '.'); gr(g, x - 7, 10, 15, 1, 'Y'); gs(g, x - 3, 6, 'w'); gs(g, x - 4, 7, 'w'); gr(g, x - 1, 2, 2, 2, 'n') });
    gr(g, 15 + o * 2, 4, 2, 7, 'n'); gr(g, 14 + o * 2, 3, 4, 2, 'm');
    return lightUp(pad(can(g, MPAL)), 'mon', { top: 0 });
  }

  // ======================================================================================
  // COLPI
  var BUL = {};
  function makeBullets(day) {
    var d = D(day), sun = day === 'sun', acc = sun ? C.skin : d[7], core = sun ? C.ink : C.cream, out = sun ? C.ink : C.night, ringC = sun ? '#C2627A' : d[7];
    var o = {};
    // diamanti 3x3 e 5x5: nucleo crema, anello d'accento, bordo notte
    function diamond(r) { var n = r * 2 + 1 + 2, g = grid(n, n); for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) { var m = Math.abs(x - r - 1) + Math.abs(y - r - 1); if (m <= r + 1) gs(g, x, y, m === r + 1 ? 'o' : m === r ? 'a' : 'c') } return can(g, { o: out, a: ringC, c: core }) }
    // scintilla: il nucleo si accende a croce un fotogramma su tre
    function spark(r) { var c = diamond(r), s2 = mk(c.width, c.height); s2.g.drawImage(c, 0, 0); s2.g.fillStyle = sun ? C.ink : C.hot; var m = (c.width / 2) | 0; s2.g.fillRect(m, m - r, 1, r * 2 + 1); s2.g.fillRect(m - r, m, r * 2 + 1, 1); return s2.c }
    o.diamond = [diamond(1), diamond(1), spark(1)]; o.diamondBig = [diamond(2), spark(2), diamond(2)];
    // anello della chiamata: archi che si aprono su 3 frame
    o.ring = [0, 1, 2].map(function (f) { var g = grid(13, 7), rx = 2 + f * 2, ry = 1.4 + f * .9; for (var a = 0; a <= 32; a++) { var th = Math.PI * a / 32, x = Math.round(6 + Math.cos(th) * rx), y = Math.round(1 + Math.sin(th) * ry) + 1; gs(g, x, y, 'c') } var gg2 = gclone(g); for (var y = 0; y < 7; y++) for (var x = 0; x < 13; x++) if (gg2.a[y][x] === 'c') { [[0, 1], [1, 0], [-1, 0], [0, -1]].forEach(function (v) { if (gg(g, x + v[0], y + v[1]) === '.') gs(g, x + v[0], y + v[1], v[1] === 1 ? 'a' : 'o') }) } return can(g, { o: out, a: ringC, c: core }) });
    // scheggia di carta (3 frame che girano)
    o.shard = [['.o.', 'oco', '.ao'], ['oo.', 'oco', '.oa'], ['.oo', 'oco', 'ao.']].map(function (r) { return can(rows(r.map(function (s) { return s })), { o: out, c: sun ? C.p1 : C.p0, a: ringC }) });
    o.dot = [can(rows(['.o.', 'oco', '.o.']), { o: out, c: ringC })];
    o.mail = [0, 1].map(function (f) { return can(rows(['ooooooooo', 'oaccccc' + (f ? 'a' : 'c') + 'o', 'ocaccca' + 'co', 'occacacco', 'occcaccco', 'ooooooooo'].map(function (r, j) { return j === 1 ? (f ? 'oacccccao' : 'occccccco') : r })), { o: out, c: core, a: ringC }) });
    // la campanella della sveglia che trema
    o.alarm = [0, 1].map(function (f) { var r = ['..ooo..', '.oaaao.', 'oacccao', 'oacccao', 'oaaaaao', '.oo.oo.', '..o.o..']; if (f) r = r.map(function (q) { return q.slice(1) + '.' }); return can(rows(r), { o: out, c: core, a: ringC }) });
    return o;
  }
  function gclone(g) { var n = grid(g.w, g.h); for (var y = 0; y < g.h; y++) for (var x = 0; x < g.w; x++) n.a[y][x] = g.a[y][x]; return n }
  // il colpo del giocatore: 1x4, testa bianco caldo e corpo pomodoro (la scia e' sul FX)
  var PSHOT;

  // ======================================================================================
  // POTENZIAMENTI (12x12 capsula) e ICONE 7x7
  var IC = {
    coffee: ['.c.c...', '..c.c..', 'ppppp..', 'pbbbpp.', 'pbbbp.p', 'pppppp.', '.qqq...'],
    coffeeEmpty: ['.......', '.......', 'sssss..', 's...ss.', 's...s.s', 'sssss..', '.sss...'],
    clock: ['.ppp...', 'p.k.p..', 'p.k.p..', 'p..kp..', 'p...p..', '.ppp...', '.......'],
    night: ['..pp...', '.pp....', 'pp.....', 'pp.....', 'pp...p.', '.ppppp.', '..ppp..'],
    auto: ['.......', 'p.p.p..', '.ppp...', 'p.p.p..', '.ppp...', '..p....', '.......'],
    ai: ['p.....p', '.p...p.', '...p...', '..ppp..', '...p...', '.p...p.', 'p.....p'],
    booking: ['.ppppp.', 'p.....p', 'p....pp', 'p.p.p.p', 'p..p..p', '.p...p.', '..ppp..'],
    coin: ['..yyy..', '.yYYYy.', 'yYwYwYy', 'yYwwwYy', 'yYwYwYy', '.yYYYy.', '..yyy..']
  };
  IC.auto = ['..p.p..', '.p.p.p.', 'p.p.p.p', '.p.p.p.', 'p.p.p.p', '.......', '.......'];
  IC.auto = ['p..p..p', 'p..p..p', '.p.p.p.', '.p.p.p.', '..ppp..', '..ppp..', '...p...'];
  IC.clock = ['..ppp..', '.p.k.p.', 'p..k..p', 'p..kk.p', 'p.....p', '.p...p.', '..ppp..'];
  IC.ai = ['.p...p.', 'ppp.ppp', '.p...p.', '...w...', '.p...p.', 'ppp.ppp', '.p...p.'];
  IC.ai = ['p.p.p.p', '.ppppp.', 'pp.w.pp', '.p.k.p.', 'pp...pp', '.ppppp.', 'p.p.p.p'];
  IC.booking = ['ppppppp', 'p.....p', 'p....wp', 'p...w.p', 'pw.w..p', 'p.w...p', 'ppppppp'];
  IC.night = ['..ppp..', '.pp....', 'pp.....', 'pp...w.', 'pp.....', '.pp..p.', '..ppp..'];
  IC.coffee = ['.c.c...', 'c.c....', 'ppppp..', 'pbbbpp.', 'pbbbp.p', 'pbbbpp.', '.ppp...'];
  IC.coffeeEmpty = ['.......', '.......', 'sssss..', 's...ss.', 's...s.s', 's...ss.', '.sss...'];
  IC.booking = ['..ppp..', '.p...p.', 'p....pp', 'p...p.p', 'pp.p..p', '.pp..p.', '..ppp..'];
  IC.coffee1 = ['..c.c..', '.c.c...', 'ppppp..', 'pbbbpp.', 'pbbbp.p', 'pbbbpp.', '.ppp...'];
  IC.coffee2 = ['.c..c..', '..c..c.', 'ppppp..', 'pbbbpp.', 'pbbbp.p', 'pbbbpp.', '.ppp...'];
  var ICPAL = { p: C.cream, k: C.tomato, b: '#6E4A2E', c: C.p2, q: C.p2, s: C.g3, w: C.hot, y: C.gd0, Y: C.gd2 };
  var SPILL = [
    ['.......', '...p...', '..pbp..', '.pbbbp.', 'pbbbbbp', '.pbbp.b', '..pp..b'],
    ['.......', '.......', '.......', '.pppp..', 'pp..pbb', 'pp..p.b', '.pppp.b'],
    ['.......', '.......', '.......', '.......', '.ssss..', 'ss..s..', 'bbbbbbb']
  ];

  // ======================================================================================
  // LA m DI MOTHER MACHINE (dal tracciato vero del logo, rasterizzata a pixel netti)
  var M_PATH = 'M589.6 -328.3 L589.3 -337.3 L588.5 -345.4 L587.1 -354.2 L585.2 -362.8 L582.7 -371.2 L579.8 -379.4 L576.3 -387.3 L572.3 -394.9 L567.9 -402.2 L563.5 -408.4 L558.3 -414.9 L552.6 -420.8 L546.7 -426.3 L540.9 -430.8 L534.4 -435.2 L527.5 -439.0 L520.5 -442.2 L513.3 -444.8 L505.9 -446.8 L499.1 -448.0 L491.6 -448.7 L484.1 -448.7 L476.5 -448.1 L469.1 -446.9 L461.7 -445.0 L454.5 -442.4 L447.4 -439.3 L441.2 -435.9 L434.6 -431.6 L428.2 -426.7 L422.7 -421.8 L417.0 -415.9 L410.5 -407.9 L404.6 -399.2 L399.7 -390.5 L395.2 -380.8 L391.7 -371.2 L388.7 -360.6 L386.5 -349.8 L385.2 -338.7 L384.8 -327.6 L384.8 -0.0 L294.8 -0.0 L294.8 -330.6 L294.2 -341.0 L292.8 -351.2 L290.7 -361.4 L287.7 -371.9 L283.3 -383.4 L278.2 -393.7 L272.3 -403.3 L265.3 -412.8 L257.4 -421.3 L248.8 -428.8 L239.6 -435.2 L230.4 -440.1 L220.3 -444.2 L209.9 -447.0 L199.3 -448.5 L189.3 -448.7 L178.6 -447.7 L168.1 -445.3 L157.9 -441.7 L148.6 -437.2 L143.0 -433.8 L137.6 -430.0 L132.4 -425.8 L127.4 -421.3 L122.7 -416.4 L118.2 -411.2 L110.5 -400.4 L106.9 -394.3 L103.6 -388.0 L98.0 -374.7 L94.1 -361.4 L91.3 -346.9 L90.4 -338.0 L90.0 -328.3 L90.0 -0.0 L0.0 -0.0 L0.0 -1267.6 L0.7 -1284.8 L2.3 -1298.2 L4.7 -1311.5 L8.3 -1325.8 L12.5 -1338.6 L18.0 -1352.2 L23.8 -1364.2 L30.5 -1375.9 L37.9 -1387.0 L45.9 -1397.6 L55.5 -1408.4 L65.0 -1417.7 L75.0 -1426.3 L86.5 -1434.9 L97.6 -1442.0 L109.1 -1448.2 L121.0 -1453.7 L134.3 -1458.6 L149.1 -1462.9 L164.2 -1465.8 L179.4 -1467.5 L194.8 -1468.0 L210.1 -1467.2 L224.1 -1465.3 L239.1 -1462.0 L253.9 -1457.5 L268.2 -1451.8 L282.1 -1444.9 L294.3 -1437.6 L307.0 -1428.6 L319.0 -1418.5 L330.1 -1407.6 L339.8 -1396.4 L347.9 -1405.8 L357.1 -1415.3 L367.0 -1424.1 L377.4 -1432.1 L388.3 -1439.5 L399.6 -1446.0 L411.4 -1451.8 L422.4 -1456.3 L434.7 -1460.4 L447.4 -1463.7 L459.0 -1465.8 L471.9 -1467.4 L484.8 -1468.0 L497.8 -1467.7 L509.6 -1466.6 L522.4 -1464.6 L533.9 -1462.0 L545.3 -1458.6 L556.4 -1454.6 L567.3 -1449.8 L577.9 -1444.3 L588.1 -1438.2 L598.0 -1431.4 L607.4 -1424.1 L615.5 -1416.9 L624.1 -1408.4 L632.1 -1399.4 L639.6 -1389.9 L646.5 -1380.0 L652.8 -1369.6 L658.5 -1358.8 L663.6 -1347.7 L667.1 -1338.6 L670.3 -1329.3 L673.2 -1318.7 L675.4 -1309.1 L677.2 -1299.4 L678.4 -1289.7 L679.2 -1279.9 L679.6 -1270.1 L679.6 -0.0 L589.6 -0.0 L589.6 -328.3ZM90.0 -497.3 L101.7 -504.3 L114.4 -510.8 L126.5 -515.9 L139.9 -520.4 L152.6 -523.7 L165.3 -526.0 L178.2 -527.5 L192.4 -528.0 L206.6 -527.5 L219.5 -526.0 L232.2 -523.7 L246.0 -520.1 L258.3 -515.9 L271.4 -510.3 L283.1 -504.3 L294.8 -497.3 L294.8 -1267.6 L294.0 -1282.4 L292.6 -1292.7 L290.4 -1302.8 L287.5 -1312.6 L284.1 -1321.4 L280.2 -1329.9 L275.4 -1338.6 L269.9 -1346.8 L264.4 -1353.8 L258.3 -1360.3 L251.4 -1366.7 L244.0 -1372.3 L236.2 -1377.2 L228.1 -1381.2 L219.7 -1384.4 L211.8 -1386.6 L203.1 -1388.1 L193.0 -1388.8 L183.6 -1388.4 L173.7 -1386.8 L164.5 -1384.2 L155.0 -1380.4 L146.4 -1375.9 L138.1 -1370.4 L129.9 -1363.6 L122.7 -1356.4 L115.7 -1347.9 L109.4 -1338.6 L103.9 -1328.6 L99.3 -1318.1 L95.8 -1307.7 L93.1 -1297.0 L91.1 -1285.4 L90.3 -1276.5 L90.0 -1267.6 L90.0 -497.3ZM384.8 -497.3 L396.5 -504.3 L409.2 -510.8 L421.3 -515.9 L434.7 -520.4 L447.4 -523.7 L460.1 -526.0 L473.0 -527.5 L487.2 -528.0 L501.4 -527.5 L514.3 -526.0 L527.0 -523.7 L540.8 -520.1 L553.1 -515.9 L566.2 -510.3 L577.9 -504.3 L589.6 -497.3 L589.6 -1267.6 L588.8 -1282.4 L587.4 -1292.7 L585.2 -1302.8 L582.3 -1312.6 L578.9 -1321.4 L575.0 -1329.9 L570.2 -1338.6 L564.7 -1346.8 L559.2 -1353.8 L552.6 -1360.8 L545.6 -1367.1 L538.8 -1372.3 L531.0 -1377.2 L522.9 -1381.2 L514.5 -1384.4 L506.6 -1386.6 L497.9 -1388.1 L487.8 -1388.8 L478.4 -1388.4 L468.5 -1386.8 L459.3 -1384.2 L449.8 -1380.4 L441.2 -1375.9 L432.9 -1370.4 L424.7 -1363.6 L417.5 -1356.4 L410.5 -1347.9 L404.2 -1338.6 L398.7 -1328.6 L394.1 -1318.1 L390.6 -1307.7 L387.9 -1297.0 L385.9 -1285.4 L385.1 -1276.5 L384.8 -1267.6 L384.8 -497.3Z';
  var MARK = {};
  function markCanvas(size, col) {
    var k = size + col; if (MARK[k]) return MARK[k];
    var sc = size / 1468, w = Math.max(3, Math.round(680 * sc)), big = mk(w * 4, size * 4);
    var p = new Path2D(M_PATH); big.g.setTransform(sc * 4, 0, 0, sc * 4, 0, size * 4); big.g.fillStyle = '#fff'; big.g.fill(p);
    var d = big.g.getImageData(0, 0, w * 4, size * 4).data, s = mk(w, size), id = s.g.createImageData(w, size), q = id.data, c = rgb(col);
    for (var y = 0; y < size; y++) for (var x = 0; x < w; x++) { var sum = 0; for (var j = 0; j < 4; j++) for (var i = 0; i < 4; i++) sum += d[((y * 4 + j) * w * 4 + x * 4 + i) * 4 + 3]; if (sum / 16 > 118) { var o = (y * w + x) * 4; q[o] = c[0]; q[o + 1] = c[1]; q[o + 2] = c[2]; q[o + 3] = 255 } }
    s.g.putImageData(id, 0, 0); return (MARK[k] = s.c);
  }

  // ======================================================================================
  // IL TITOLO DEADLINE: maiuscole squadrate, angoli a 45 gradi, tubo crema con l'alone d'accento
  var LOGO_LET = {
    D: [[[0, 0], [5, 0], [7, 2], [7, 9], [5, 11], [0, 11], [0, 0]]],
    E: [[[7, 0], [0, 0], [0, 11], [7, 11]], [[0, 5], [5, 5]]],
    A: [[[0, 11], [0, 2], [2, 0], [5, 0], [7, 2], [7, 11]], [[0, 6], [7, 6]]],
    L: [[[0, 0], [0, 11], [7, 11]]],
    I: [[[0, 0], [4, 0]], [[2, 0], [2, 11]], [[0, 11], [4, 11]]],
    N: [[[0, 11], [0, 0], [1, 0], [6, 11], [7, 11], [7, 0]]]
  };
  var LOGO_SC = 3, LOGO_GAP = 5;
  var LOGO = null;
  function buildLogo() {
    var word = 'DEADLINE', parts = [], x = 0;
    for (var i = 0; i < word.length; i++) {
      parts.push(letter(LOGO_LET[word[i]], x)); x += parts[i].w + LOGO_GAP;
    }
    return { parts: parts, w: x - LOGO_GAP, h: 11 * LOGO_SC + 5 };
  }
  function letter(L, x) {
      var wu = 0; L.forEach(function (pl) { pl.forEach(function (p) { wu = Math.max(wu, p[0]) }) });
      var w = wu * LOGO_SC + 5, h = 11 * LOGO_SC + 5;
      function render(core, tube, halo) {
        // tubo: 2px, il nucleo 1px
        var g = grid(w, h);
        L.forEach(function (pl) { for (var j = 1; j < pl.length; j++) { var a = pl[j - 1], b = pl[j]; gl(g, a[0] * LOGO_SC + 2, a[1] * LOGO_SC + 2, b[0] * LOGO_SC + 2, b[1] * LOGO_SC + 2, 't') } });
        var g2 = gclone(g);
        for (var y = 0; y < h; y++) for (var xx = 0; xx < w; xx++) if (g2.a[y][xx] === 't') { [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (v) { if (gg(g, xx + v[0], y + v[1]) === '.') gs(g, xx + v[0], y + v[1], 'u') }) }
        // alone: 1px d'accento solo sopra/sotto i tratti orizzontali
        if (halo) { var g3 = gclone(g); for (var y2 = 0; y2 < h; y2++) for (var x2 = 1; x2 < w - 1; x2++) { var c = g3.a[y2][x2]; if ((c === 't' || c === 'u') && (g3.a[y2][x2 - 1] !== '.' && g3.a[y2][x2 + 1] !== '.')) { if (gg(g3, x2, y2 - 1) === '.') gs(g, x2, y2 - 1, 'h'); if (gg(g3, x2, y2 + 1) === '.') gs(g, x2, y2 + 1, 'h') } } }
        return can(g, { t: core, u: tube, h: halo || '#000000' });
      }
      return { x: x, w: w, h: h, render: render };
  }
  var LOGO_C = {};
  function logoSet(day) {
    if (LOGO_C[day]) return LOGO_C[day];
    if (!LOGO) LOGO = buildLogo();
    var acc = D(day)[7], halo = acc + '99';
    var on = LOGO.parts.map(function (p) { return p.render(C.hot, mix(C.cream, acc, .45), halo) });
    var off = LOGO.parts.map(function (p) { return p.render(C.off, '#2C2C2A', null) });
    var full = mk(LOGO.w, LOGO.h); LOGO.parts.forEach(function (p, i) { full.g.drawImage(on[i], p.x, 0) });
    var cy = solid(full.c, C.cyan), rd = solid(full.c, C.crim3);
    return (LOGO_C[day] = { on: on, off: off, full: full.c, cy: cy, rd: rd });
  }
  var FLK_D2 = '1111101101111110111111110011111111111111101111111111';

  // ======================================================================================
  // CIELO, SKYLINE, TORRI, CITTA'
  var SKY = {}, FAR = {}, MID = {}, NEAR = {}, FOG = {}, ADS = {}, NEON = {};
  var FAR_W = 480, FAR_H = 96, MID_W = 960, MID_H = 150, NEAR_W = 496;
  var FAR_LIGHTS = [], MID_BLINK = [], BOARDS = [], ROOFS = [], NEAR_SIGNS = [];
  ART.windowRects = []; ART.cityWindows = 0;

  function buildSky(day) {
    var d = D(day), s = mk(W, H), id = s.g.createImageData(W, H), q = id.data;
    var stops = [rgb(d[0]), rgb(d[1]), rgb(d[2])], HOR = 196;
    // bande: piatte con il passaggio a dither ordinato
    var bands = 7;
    for (var y = 0; y < H; y++) {
      var f = Math.min(1, y / HOR), seg = f * (bands - 1), bi = Math.floor(seg), fr = seg - bi;
      for (var x = 0; x < W; x++) {
        var k = (bi + (fr > bay(x, y) ? 1 : 0)) / (bands - 1);
        var e = Math.pow(k, 1.35), c0, c1, kk; if (e < .6) { c0 = stops[0]; c1 = stops[1]; kk = e / .6 } else { c0 = stops[1]; c1 = stops[2]; kk = (e - .6) / .4 }
        var i = (y * W + x) * 4; q[i] = c0[0] + (c1[0] - c0[0]) * kk; q[i + 1] = c0[1] + (c1[1] - c0[1]) * kk; q[i + 2] = c0[2] + (c1[2] - c0[2]) * kk; q[i + 3] = 255;
      }
    }
    s.g.putImageData(id, 0, 0);
    // stelle rade (TUE, NIGHT, WED poche), mai su SUN e SAT
    var R = rnd(7 + DAYK.indexOf(day)), n = { tue: 40, night: 90, wed: 18, thu: 0, fri: 14, sat: 0, sun: 0, mon: 0 }[day];
    var stars = [];
    for (var i2 = 0; i2 < n; i2++) { var sx = (R() * W) | 0, sy = (R() * 120) | 0, b = R(); s.g.fillStyle = mix(d[0], C.cream, b < .15 ? .7 : .3 + b * .2); s.g.fillRect(sx, sy, 1, 1); if (b < .3) stars.push([sx, sy, R() * 6]) }
    // luna piccola e fredda su TUE e NIGHT (niente sole outrun)
    if (day === 'tue' || day === 'night') { var mx = 392, my = 38; var gm = grid(13, 13); gell(gm, 6.5, 6.5, 6, 6, 'm'); gell(gm, 8.8, 5.2, 5.2, 5.6, '.'); s.g.drawImage(can(gm, { m: mix(C.cream, d[7], .15) }), mx, my) }
    if (day === 'sun') { // disco pallido dell'alba, basso e velato
      var gs2 = grid(25, 25); gell(gs2, 12.5, 12.5, 12, 12, 's'); s.g.globalAlpha = .55; s.g.drawImage(can(gs2, { s: C.hot }), 300, 196); s.g.globalAlpha = 1 }
    s.stars = stars;
    return { c: s.c, stars: stars };
  }

  // sagome di palazzi (generatore comune, stessa citta' ogni giorno: cambia solo la luce)
  function silhouettes(R, w, h, minW, maxW, minH, maxH) {
    var out = [], x = -4; while (x < w) { var bw = minW + ((R() * (maxW - minW)) | 0), bh = minH + ((R() * (maxH - minH)) | 0); out.push({ x: x, w: bw, h: bh, kind: (R() * 6) | 0, r: R(), r2: R() }); x += bw + ((R() * 3) | 0) - 1 } return out;
  }
  function buildFar(day) {
    var d = D(day), s = mk(FAR_W, FAR_H), g = s.g, R = rnd(101), B = silhouettes(R, FAR_W, FAR_H, 10, 28, 18, 72);
    var col = d[3], lit = mix(d[3], d[7], .55);
    g.fillStyle = col;
    B.forEach(function (b) {
      var top = FAR_H - b.h; g.fillRect(b.x, top, b.w, b.h);
      if (b.kind === 0) { g.fillRect(b.x + 2, top - 3, b.w - 4, 3) } // gradino
      if (b.kind === 1) { g.fillRect(b.x + (b.w >> 1), top - 8, 1, 8) } // antenna
      if (b.kind === 2) { g.fillRect(b.x + 3, top - 2, 3, 2); g.fillRect(b.x + b.w - 6, top - 4, 2, 4) }
      if (b.kind === 3 && b.w > 14) { for (var k = 0; k < 4; k++) g.fillRect(b.x + k, top - 4 + k, b.w - k * 2, 1) } // tetto a punta squadrato
    });
    // finestre rarissime, un tono sopra
    var win = mix(col, d[6], .5);
    B.forEach(function (b) { for (var y = FAR_H - b.h + 4; y < FAR_H - 2; y += 4) for (var x = b.x + 2; x < b.x + b.w - 2; x += 3) if (R() < .06) { g.fillStyle = win; g.fillRect(x, y, 1, 1) } });
    // luci sui tetti (1 su 40), lampeggiano piano: posizioni per sky
    if (!FAR_LIGHTS.length) B.forEach(function (b, i) { if (i % 6 === 2) FAR_LIGHTS.push([b.x + (b.w >> 1), FAR_H - b.h - (b.kind === 1 ? 9 : 1), (i * 0.37) % 1]) });
    return s.c;
  }
  // banda di nebbia 496x40 dal colore nebbia al trasparente, a dither (dense in basso)
  function buildFog(day, smog) {
    var d = D(day), w = 520, h = smog ? 70 : 40, s = mk(w, h), id = s.g.createImageData(w, h), q = id.data, c = rgb(d[6]), R = rnd(33);
    var noise = []; for (var i = 0; i < 64; i++) noise.push(R());
    function vn(x, y) { var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; function n(a, b) { return noise[((a * 7 + b * 13) & 63)] } var a = n(xi, yi), b = n(xi + 1, yi), c2 = n(xi, yi + 1), e = n(xi + 1, yi + 1); var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return a + (b - a) * u + (c2 - a) * v + (a - b - c2 + e) * u * v }
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var k = y / (h - 1); k = k * k;
      if (smog) k *= .55 + .9 * vn(x / 23, y / 11) * vn(x / 61 + 3, y / 17 + 1);
      if (k > bay(x, y)) { var o = (y * w + x) * 4; q[o] = c[0]; q[o + 1] = c[1]; q[o + 2] = c[2]; q[o + 3] = 255 }
    }
    s.g.putImageData(id, 0, 0); return s.c;
  }
  // le torri di mezzo con i cartelloni
  var MID_B = null;
  function midLayout() {
    if (MID_B) return MID_B;
    var R = rnd(202), B = silhouettes(R, MID_W, MID_H, 26, 58, 34, 104);
    // quattro cartelloni su torri scelte, distribuiti
    var want = [90, 330, 560, 800]; BOARDS.length = 0;
    want.forEach(function (wx, i) {
      var best = B[0]; B.forEach(function (b) { if (Math.abs(b.x + b.w / 2 - wx) < Math.abs(best.x + best.w / 2 - wx)) best = b });
      best.h = 84 + (i % 2) * 14; best.w = Math.max(best.w, 44);
      var bw = 56, bh = 26, bx = Math.round(best.x + best.w / 2 - bw / 2), by = MID_H - best.h - bh - 8;
      BOARDS.push({ x: bx, y: by, w: bw, h: bh, tower: best, flk: ['1111111111110111', '1111011111111111', '1111111101111111', '1110111111111101'][i] });
    });
    B.forEach(function (b, i) { if (i % 4 === 1) MID_BLINK.push([b.x + 3, MID_H - b.h - 4, (i * .29) % 1]) });
    return (MID_B = B);
  }
  function buildMid(day) {
    var d = D(day), s = mk(MID_W, MID_H), g = s.g, B = midLayout(), R = rnd(303);
    var col = d[4], edge = mix(d[4], d[7], .35), win = mix(d[4], C.cream, .28), win2 = mix(d[4], C.cream, .14);
    B.forEach(function (b) {
      var top = MID_H - b.h;
      g.fillStyle = col; g.fillRect(b.x, top, b.w, b.h);
      // coronamento squadrato
      if (b.kind % 3 === 0) { g.fillRect(b.x + 3, top - 5, b.w - 6, 5); g.fillStyle = edge; g.fillRect(b.x + 3, top - 5, b.w - 6, 1) }
      if (b.kind === 1) { g.fillStyle = col; g.fillRect(b.x + 4, top - 12, 2, 12); g.fillRect(b.x + 3, top - 12, 4, 1) }
      if (b.kind === 4) { g.fillStyle = col; g.fillRect(b.x + b.w - 10, top - 7, 7, 7); g.fillStyle = edge; g.fillRect(b.x + b.w - 10, top - 7, 7, 1) } // serbatoio
      g.fillStyle = edge; g.fillRect(b.x, top, b.w, 1); // luce del cielo sul tetto
      // finestre rade a griglia
      for (var y = top + 5; y < MID_H - 3; y += 4) { var floor = R() < .14, wc = R() < .5 ? win : win2; for (var x = b.x + 3; x < b.x + b.w - 3; x += 3) { var r = R(); if ((floor && r < .75) || r < .015) { g.fillStyle = wc; g.fillRect(x, y, 2, 1) } } }
      // fasce verticali (ritmo delle torri)
      if (b.w > 36 && b.kind % 2) { g.fillStyle = mix(col, C.night, .3); for (var x2 = b.x + 8; x2 < b.x + b.w - 4; x2 += 12) g.fillRect(x2, top + 3, 1, b.h - 3) }
    });
    // cartelloni: struttura e pannello spento
    BOARDS.forEach(function (bd) {
      g.fillStyle = mix(col, C.night, .2); g.fillRect(bd.x + 8, bd.y + bd.h, 2, 8); g.fillRect(bd.x + bd.w - 10, bd.y + bd.h, 2, 8); g.fillRect(bd.x + 6, bd.y + bd.h + 4, bd.w - 12, 1);
      g.fillStyle = C.off; g.fillRect(bd.x - 1, bd.y - 1, bd.w + 2, bd.h + 2);
      g.fillStyle = mix(d[5], C.night, .4); g.fillRect(bd.x, bd.y, bd.w, bd.h);
      g.fillStyle = mix(C.off, d[7], .2); g.fillRect(bd.x - 1, bd.y - 1, bd.w + 2, 1);
    });
    return s.c;
  }
  // pubblicita' finte dello studio, neon a un colore (tubo = accento + crema, alone d'accento sui tratti orizzontali)
  var AD_TXT = [['THE MACHINE', 'BEHIND YOUR', 'BUSINESS'], ['TELL US WHAT', 'SLOWS YOU', 'DOWN'], ['m'], ['WORKS WHILE', 'YOU SLEEP']];
  function neonize(mask, acc, onOff) { // mask: canvas bianco su trasparente -> neon acceso o spento
    var w = mask.width, h = mask.height, d = px(mask).data, s = mk(w, h), id = s.g.createImageData(w, h), q = id.data;
    var tube = rgb(onOff ? mix(acc, C.cream, .5) : C.off), halo = rgb(acc);
    function A(x, y) { return x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0 }
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) { var o = (y * w + x) * 4;
      if (A(x, y)) { q[o] = tube[0]; q[o + 1] = tube[1]; q[o + 2] = tube[2]; q[o + 3] = 255 }
      else if (onOff && ((A(x, y - 1) && A(x - 1, y - 1) && A(x + 1, y - 1)) || (A(x, y + 1) && A(x - 1, y + 1) && A(x + 1, y + 1)))) { q[o] = halo[0]; q[o + 1] = halo[1]; q[o + 2] = halo[2]; q[o + 3] = 153 } }
    s.g.putImageData(id, 0, 0); return s.c;
  }
  function adMask(i, w, h) {
    var s = mk(w, h), L = AD_TXT[i];
    if (L[0] === 'm') { var m = markCanvas(16, '#ffffff'); s.g.drawImage(m, 5, (h - 16) >> 1); tiny(s.g, 'MOTHER', 18, 7, '#ffffff'); tiny(s.g, 'MACHINE', 18, 14, '#ffffff') }
    else { var y0 = Math.round((h - (L.length * 7 - 2)) / 2); L.forEach(function (ln, j) { tiny(s.g, ln, Math.round((w - tinyWidth(ln)) / 2), y0 + j * 7, '#ffffff') }) }
    return s.c;
  }
  function buildAds(day) { var acc = D(day)[7]; return AD_TXT.map(function (t, i) { var m = adMask(i, 54, 24); return { on: neonize(m, acc, true), off: neonize(m, acc, false) } }) }
  // insegne dei vincitori tinte nell'accento (una volta per immagine e giorno)
  var TINT = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  function tinted(img, col) {
    if (!TINT) return img; var m = TINT.get(img); if (!m) { m = {}; TINT.set(img, m) }
    if (!m[col]) { var w = img.width || 1, h = img.height || 1, s = mk(w, h); s.g.drawImage(img, 0, 0); s.g.globalCompositeOperation = 'source-in'; s.g.fillStyle = col; s.g.fillRect(0, 0, w, h); m[col] = s.c }
    return m[col];
  }

  // la citta' vicina: i sei tipi di palazzo in piccolo, finestre-vita, bordo bagnato crema, strada che riflette
  var NEAR_B = null;
  function nearLayout() {
    if (NEAR_B) return NEAR_B;
    var kinds = ['food', 'services', 'beauty', 'shop', 'hotel', 'fashion'], x = 0, i = 0, out = [], R = rnd(404);
    var widths = [34, 30, 18, 40, 28, 32];
    while (x < NEAR_W) { var k = i % 6, w = widths[k] + ((R() * 6) | 0) - 2, h = { food: 14, services: 20, beauty: 24, shop: 15, hotel: 22, fashion: 18 }[kinds[k]] + ((R() * 3) | 0); out.push({ kind: kinds[k], x: x, w: w, h: h }); x += w + 2 + ((R() * 3) | 0); i++ }
    // finestre-vita: 2 per palazzo, 24 in tutto, dentro i 480 visibili (shift 0, con margine 8)
    var cand = [], rects = [];
    out.forEach(function (b) { var top = STREET - b.h; var n = b.w > 26 ? 3 : 2; for (var j = 0; j < n; j++) { var wx = b.x - 8 + Math.round(b.w * (j + 1) / (n + 1)) - 1, wy = top + (b.kind === 'food' ? 7 : 5) + ((j % 2) && b.h > 18 ? 6 : 0); if (wx >= 3 && wx <= W - 6) cand.push({ x: wx, y: wy, w: 3, h: 2, b: b }) } });
    for (var c2 = 0; c2 < 24; c2++) rects.push(cand[Math.round(c2 * (cand.length - 1) / 23)]);
    ART.windowRects = rects.map(function (r) { return { x: r.x, y: r.y, w: r.w, h: r.h } }); ART.cityWindows = rects.length;
    WIN_TONE = rects.map(function (r, i) { var h0 = hash(i * 31 + 7); return h0 < .7 ? C.win1 : h0 < .9 ? C.win2 : C.win3 });
    NEAR_R = rects;
    ROOFS.length = 0; out.forEach(function (b) { ROOFS.push([b.x - 8, STREET - b.h, b.w]) });
    return (NEAR_B = out);
  }
  var WIN_TONE = [], NEAR_R = [], WIN_PREV = [], WIN_OFF_T = [];
  function buildNear(day) {
    var d = D(day), s = mk(NEAR_W, H - CITY_TOP + 20), g = s.g, B = nearLayout(), oy = CITY_TOP - 20;
    B.forEach(function (b) { g.drawImage(buildingCanvas(b.kind, b.w, b.h, day, true), b.x, STREET - b.h - oy) });
    // strada
    g.fillStyle = mix(d[5], C.night, .5); g.fillRect(0, STREET - oy, NEAR_W, H - STREET);
    g.fillStyle = mix(d[5], d[6], .25); g.fillRect(0, STREET - oy, NEAR_W, 1);
    return { c: s.c, oy: oy, off: mix(d[5], d[6], .18) };
  }

  // ======================================================================================
  // I SEI PALAZZI (CITY e citta' vicina). Disegnati su griglia; l'insegna va nello slot.
  function signSlot(kind, w, h) {
    switch (kind) {
      case 'food': return { x: w - Math.min(16, w >> 1) + 2, y: Math.max(2, h * .3 | 0), w: Math.min(16, w >> 1), h: Math.min(12, h >> 2) };
      case 'fashion': return { x: 2, y: Math.round(h * .5), w: w - 4, h: Math.max(6, Math.min(12, h >> 3)) };
      case 'shop': return { x: 3, y: Math.round(h * .4), w: w - 6, h: Math.max(6, Math.min(12, h >> 3)) };
      case 'beauty': return { x: w - Math.max(6, w * .3 | 0) - 1, y: 6, w: Math.max(6, w * .3 | 0), h: Math.round(h * .45) };
      case 'hotel': return { x: 2, y: 0, w: w - 4, h: Math.max(7, Math.min(14, h >> 3)) };
      default: return { x: 3, y: Math.round(h * .18), w: w - 6, h: Math.max(6, Math.min(12, h >> 3)) };
    }
  }
  ART.signSlot = signSlot;
  var BCACHE = {};
  // small = versione della citta' vicina (niente insegne, finestre spente: la vita si accende sopra)
  function buildingCanvas(kind, w, h, day, small) {
    var key = kind + w + 'x' + h + day + (small ? 's' : ''); if (BCACHE[key]) return BCACHE[key];
    var d = D(day), g = grid(w, h), sl = signSlot(kind, w, h), top = 0;
    var pal = { a: small ? d[5] : mix(d[5], C.g4, .5), b: small ? mix(d[5], C.night, .35) : mix(d[5], C.night, .2), c: small ? mix(d[5], d[6], .22) : mix(d[5], C.g3, .45), r: mix(C.cream, d[5], .35), u: small ? mix(d[5], d[6], .12) : mix(d[5], C.g4, .9), w: C.win1, v: C.win2, t: mix(d[7], d[5], .55), m: mix(C.g3, d[5], .3), s: C.off, k: C.night };
    function wins(x0, y0, x1, y1, sx, sy, ww, wh, litP, seed) { var R = rnd(seed); for (var y = y0; y + wh <= y1; y += sy) for (var x = x0; x + ww <= x1; x += sx) gr(g, x, y, ww, wh, (!small && R() < litP) ? (R() < .75 ? 'w' : 'v') : 'u') }
    var roofY = 0;
    switch (kind) {
      case 'food': // basso, tenda a strisce, insegna sporgente
        roofY = small ? 0 : Math.round(h * .25);
        gr(g, 0, roofY, w, h - roofY, 'a'); gr(g, 0, roofY, w, 1, 'c');
        var aw = roofY + Math.round((h - roofY) * .45); for (var x = 0; x < w; x++) { var st = ((x / 3) | 0) % 2 ? 't' : 'r'; gs(g, x, aw, st); gs(g, x, aw + 1, st); gs(g, x, aw + 2, st); if (x % 3 === 1) gs(g, x, aw + 3, st) }
        wins(3, aw + 4, w - 3, h - 1, 6, 6, 4, h - aw - 5, .6, w * 3);
        if (!small) wins(3, roofY + 4, w - 3, aw - 2, 5, 5, 2, 2, .3, w);
        gr(g, w - 4, roofY - 2, 2, 2, 'b');
        break;
      case 'fashion': // vetrine alte con manichino
        gr(g, 0, 0, w, h, 'a'); gr(g, 0, 0, w, 1, 'c');
        if (!small) wins(3, 4, w - 3, Math.round(h * .45), 5, 5, 3, 3, .35, w + 5);
        var vy = Math.round(h * .5) + (small ? 0 : Math.max(6, Math.min(12, h >> 3)) + 2);
        if (small) vy = 7;
        for (var vx = 2; vx < w - 5; vx += 9) { gr(g, vx, vy, 7, h - vy - 1, small ? 'u' : 'v'); if (!small) { gr(g, vx + 3, vy + 2, 1, 1, 'k'); gr(g, vx + 2, vy + 3, 3, 4, 'k'); gr(g, vx + 3, vy + 7, 1, Math.max(1, h - vy - 9), 'k') } }
        break;
      case 'shop': // magazzino con serranda, pacchi, antenna
        gr(g, 0, 3, w, h - 3, 'a'); for (var k = 0; k < 3; k++) gr(g, k * 2, 3 - k, w - k * 4, 1, 'c');
        gr(g, w - 6, 0, 1, 3, 'm'); gs(g, w - 7, 0, 'm'); gs(g, w - 5, 0, 'm');
        var sy0 = small ? 6 : Math.round(h * .55); gr(g, 3, sy0, Math.round(w * .55), h - sy0, 'b'); for (var y3 = sy0 + 1; y3 < h; y3 += 2) gr(g, 3, y3, Math.round(w * .55), 1, 'c');
        var bx = Math.round(w * .55) + 5; if (bx + 4 < w) { gr(g, bx, h - 4, 4, 4, 'm'); gr(g, bx + 1, h - 7, 3, 3, 'm'); gs(g, bx + 1, h - 4, 'c') }
        if (!small) wins(3, 7, w - 3, sl.y - 2, 6, 5, 3, 2, .3, w * 7);
        break;
      case 'beauty': // stretto e alto, insegna verticale
        gr(g, 0, 2, w, h - 2, 'a'); gr(g, 2, 0, w - 4, 2, 'a'); gr(g, 2, 0, w - 4, 1, 'c'); gs(g, 0, 2, 'c'); gs(g, 1, 2, 'c'); gs(g, w - 1, 2, 'c'); gs(g, w - 2, 2, 'c');
        wins(2, 5, small ? w - 2 : sl.x - 1, h - 6, 4, 4, 2, 2, .35, w * 11);
        gr(g, Math.round(w / 2) - 2, h - 5, 4, 5, 'b');
        break;
      case 'hotel': // torre con finestre a scacchi, insegna sul tetto
        var ty = small ? 0 : sl.h + 3; gr(g, 0, ty, w, h - ty, 'a'); gr(g, 0, ty, w, 1, 'c');
        if (!small) { gr(g, 4, sl.h, 1, 3, 'm'); gr(g, w - 5, sl.h, 1, 3, 'm') }
        var R2 = rnd(w * 13); for (var y4 = ty + 3; y4 < h - 6; y4 += 4) for (var x4 = 3; x4 < w - 3; x4 += 4) { var on4 = !small && (((x4 >> 2) + (y4 >> 2)) % 2) && R2() < .7; gr(g, x4, y4, 2, 2, on4 ? (R2() < .8 ? 'w' : 'v') : 'u') }
        gr(g, Math.round(w / 2) - 3, h - 4, 6, 4, 'b');
        break;
      default: // uffici
        gr(g, 0, 0, w, h, 'a'); gr(g, 0, 0, w, 1, 'c');
        for (var y5 = 3; y5 < h - 2; y5 += 3) gr(g, 1, y5, w - 2, 1, 'b');
        if (!small) wins(2, 4, w - 2, h - 2, 3, 3, 2, 1, .4, w * 17); else wins(2, 4, w - 2, h - 2, 4, 3, 2, 1, 0, 1);
    }
    // bordo bagnato: 1px crema sullo spigolo del tetto (prima riga piena dall'alto per colonna)
    if (small) for (var x6 = 0; x6 < w; x6++) for (var y6 = 0; y6 < h; y6++) if (g.a[y6][x6] !== '.') { if (g.a[y6][x6] === 'c' || g.a[y6][x6] === 'a') gs(g, x6, y6, 'r'); break }
    // spigoli verticali: destra in ombra, sinistra appena accesa dal cielo (machine: squadrato)
    for (var y7 = 0; y7 < h; y7++) { if (g.a[y7][w - 1] === 'a') gs(g, w - 1, y7, 'b'); if (!small && g.a[y7][0] === 'a') gs(g, 0, y7, 'c') }
    var c = can(g, pal); BCACHE[key] = c; return c;
  }
  // insegna nello slot: con img (neon a un colore) o spenta "YOUR SIGN HERE" / "FOR RENT"
  var SIGN_OFF = {};
  function signOff(w, h, day) {
    var k = w + 'x' + h; if (SIGN_OFF[k]) return SIGN_OFF[k];
    var s = mk(w, h), t = w >= 52 && h >= 5 ? 'YOUR SIGN HERE' : w >= 30 ? 'FOR RENT' : w >= 14 ? 'RENT' : '';
    if (h > w && h >= 20) { t = ''; var L = 'RENT'; for (var i = 0; i < 4; i++) tiny(s.g, L[i], (w - 3) >> 1, 2 + i * 6, '#ffffff') }
    if (t) tiny(s.g, t, Math.round((w - tinyWidth(t)) / 2), Math.round((h - 5) / 2), '#ffffff');
    return (SIGN_OFF[k] = neonize(s.c, '#888888', false));
  }

  // ======================================================================================
  // INIT
  var SP = {}; // sprite per giorno
  var BASE = {};
    ART.size = { ship: { w: 19, h: 16 }, call: { w: 16, h: 13 }, invoice: { w: 14, h: 17 }, receipt: { w: 8, h: 12 }, noshow: { w: 13, h: 19 }, spam: { w: 11, h: 7 }, double: { w: 14, h: 13 },
    urgent: { w: 66, h: 38 }, monday: { w: 156, h: 118 }, powerup: { w: 12, h: 12 }, firewall: { w: 36, h: 14 }, icon: { w: 7, h: 7 }, logo: { w: 234, h: 42 } };
  // misure visibili (contorno compreso); MONDAY con le campane della fase 3
  function buildBase() {
    BASE.call = [0, 1, 2, 3].map(eCall);
    BASE.invoice = [0, 1, 2, 3].map(eInvoice);
    BASE.receipt = [0, 0, 0, 1].map(eReceipt);
    BASE.noshow = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3].map(function (f, i) { return eNoshow(f, i === 11) });
    BASE.spam = [0, 1].map(eSpam);
    BASE.double = [0, 0, 0, 0, 0, 1].map(eDouble);
  }
  function daySprites(day) {
    if (SP[day]) return SP[day];
    var o = { e: {}, gold: {}, flash: {}, line: {}, fade: {} };
    Object.keys(BASE).forEach(function (k) {
      var noOut = k === 'noshow';
      o.e[k] = BASE[k].map(function (c) { var a = accentize(c, day); return noOut ? a : lightUp(a, day, { top: .4 }) });
      o.gold[k] = BASE[k].map(function (c) { var a = goldOf(accentize(c, day)); return lightUp(a, day, { top: .25, rim: true }) });
      o.flash[k] = o.e[k].map(function (c) { return solid(c, C.cream) });
      o.line[k] = BASE[k].map(function (c) { return lineOf(c, C.cream) });
    });
    o.fade.noshow = o.e.noshow.map(function (c) { return [.25, .5, .75].map(function (k) { return dissolve(c, k) }) });
    // lo scintillio dell'oro: 1px di linea che attraversa (6 posizioni)
    o.shine = {};
    Object.keys(BASE).forEach(function (k) { o.shine[k] = [0, 1, 2, 3, 4, 5, 6, 7].map(function (f) { var src = o.gold[k][0], w = src.width, h = src.height, s = mk(w, h); s.g.fillStyle = C.gd3; for (var y = 0; y < h; y++) { var x = Math.round((f / 7) * (w + h) - y); s.g.fillRect(x, y, 1, 1) } s.g.globalCompositeOperation = 'destination-in'; s.g.drawImage(src, 0, 0); return s.c }) });
    o.bul = makeBullets(day);
    return (SP[day] = o);
  }
  var SHIP = [], SHIPF = [], SHIELD = [], URG = [], URGF = [], MON = {}, MONF = {}, BELLS = [], ICONS = {}, CAPS = {}, FW = null, FWDATA = null;
  ART.init = function () {
    if (ART.ready) return ART;
    var t0 = performance.now();
    buildBase();
    // nave: 3 inclinazioni
    [-2, -1, 0, 1, 2].forEach(function (b, i) { var S2 = shipGrid(b), c = can(S2.g, SHIP_PAL); SHIP[i] = c; SHIPF[i] = solid(c, C.cream); SHIP_INFO[i] = S2 });
    // colpo del giocatore
    PSHOT = can(rows(['w', 'r', 'r', 'd']), SHIP_PAL);
    // URGENT: bocca 0..2 x battito 0..1
    for (var m = 0; m < 3; m++) for (var b2 = 0; b2 < 2; b2++) { var u = bUrgent(m, b2); URG[m * 2 + b2] = u; URGF[m * 2 + b2] = solid(u, C.cream) }
    BELLS = [0, 1].map(bells);
    // icone
    Object.keys(IC).forEach(function (k) { ICONS[k] = can(rows(IC[k]), ICPAL) });
    ICONS.spill = SPILL.map(function (r) { return can(rows(r), ICPAL) });
    // capsule
    buildCaps();
    // firewall
    buildFirewall();
    nearLayout(); midLayout();
    buildDay('tue'); buildDay('night');
    buildGlows();
    ART.ready = true; ART.initMs = performance.now() - t0;
    // gli altri giorni si preparano nei momenti liberi, uno alla volta (niente scatti al cambio giorno)
    var rest = DAYK.filter(function (d) { return !DONE[d] });
    (function next() { var d = rest.shift(); if (!d) return; setTimeout(function () { buildDay(d); next() }, 60) })();
    return ART;
  };
  var DONE = {};
  function buildDay(d) {
    if (DONE[d] || !DAYS[d]) return; DONE[d] = true;
    SKY[d] = buildSky(d); FAR[d] = buildFar(d); FOG[d] = buildFog(d, false); MID[d] = buildMid(d); ADS[d] = buildAds(d); NEAR[d] = buildNear(d);
    if (d === 'thu') FOG.thuSmog = buildFog('thu', true);
    daySprites(d);
  }
  ART.prepareDay = buildDay;
  // MONDAY si prepara al primo uso (e' grande)
  function monday(phase, mouth, blink, torn) {
    var k = phase + '' + mouth + blink + Math.min(torn, 4); if (!MON[k]) { MON[k] = bMonday(phase, mouth, blink, torn); MONF[k] = solid(MON[k], C.cream) } return k;
  }
  ART.prepareBoss = function () { for (var p = 1; p <= 3; p++) for (var m = 0; m < 3; m++) monday(p, m, 0, 0) };

  // capsule 12x12: guscio di vetro scuro, bordo nel colore del servizio, icona crema
  // capsule v2 (14x16): pillola di vetro scuro con il bordo nel colore del servizio, icona crema, riflesso che gira,
  // LED che lampeggia; la moneta d'oro gira di taglio (6 fotogrammi)
  function grr(g, x, y, w, h, r, c) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) { var dx = Math.max(0, Math.max(r - i - .5, i + .5 - (w - r))), dy = Math.max(0, Math.max(r - j - .5, j + .5 - (h - r))); if (dx * dx + dy * dy <= r * r) gs(g, x + i, y + j, c) } }
  function buildCaps() {
    var kinds = { auto: C.cream, ai: '#7FD8FF', booking: C.skin, night: '#8FB4FF' };
    Object.keys(kinds).forEach(function (k) {
      CAPS[k] = [0, 1, 2, 3, 4, 5].map(function (f) {
        var g = grid(14, 16), hot = f === 0 || f === 3;
        grr(g, 0, 0, 14, 16, 5, 'o'); grr(g, 1, 1, 12, 14, 4.2, hot ? 'R' : 'r'); grr(g, 2, 2, 10, 12, 3.4, 'b');
        gr(g, 3, 13, 8, 1, 'c'); gr(g, 4, 2, 5, 1, 'h'); gs(g, 3, 3, 'h');
        var s = can(g, { o: C.night, r: kinds[k], R: mix(kinds[k], C.hot, .5), b: '#141821', c: mix(kinds[k], C.cream, .6), h: '#F4F2EC99' }), sg = s.getContext('2d');
        sg.drawImage(solid(ICONS[k], kinds[k]), 3, 4);
        sg.fillStyle = C.hot; var pos = [[3, 5], [4, 4], [10, 5], [10, 10], [4, 11], [3, 8]][f]; sg.globalAlpha = .7; sg.fillRect(pos[0], pos[1], 1, 1); sg.globalAlpha = 1;
        if (f < 3) { sg.fillStyle = C.tomato; sg.fillRect(6, 0, 2, 1) }
        return s;
      });
    });
    CAPS.coin = [0, 1, 2, 3, 2, 1].map(function (f, i) {
      var w = [12, 9, 5, 2][f], g = grid(14, 16), cx = 7, mirror2 = i > 3;
      gell(g, cx, 8, w / 2 + 1, 7, 'o'); gell(g, cx, 8, w / 2, 6, 'y'); if (w > 4) gell(g, cx, 8, w / 2 - 1, 5, 'Y'); gell(g, cx - (w > 4 ? 1 : 0), 4.5, Math.max(.6, w / 4), 1.2, 'w');
      if (w <= 2) gr(g, cx - 1, 2, 2, 12, 'y');
      var s = can(g, { o: C.night, y: C.gd1, Y: C.gd2, w: C.gd3 }), sg = s.getContext('2d');
      if (w >= 9) { var mm = markCanvas(7, C.gd0); sg.drawImage(mm, 0, 0, mm.width, mm.height, cx - (w >= 12 ? 2 : 1), 5, w >= 12 ? mm.width : Math.max(2, mm.width - 1), 7) }
      return s;
    });
  }
  // firewall: mattoni 2x1 grigio macchina, cima crema, angoli smussati e una feritoia
  function buildFirewall() {
    var w = 36, h = 14, g = grid(w, h);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var cut = (y < 3 && (x < 3 - y || x > w - 4 + y));
      var slot = y >= 9 && x >= 15 && x <= 20;
      if (cut || slot) continue;
      var row = y >> 1, off = (row % 2) * 2, mortar = (y % 2 === 1 && x % 1 === 0 && false) || ((x + off) % 4 === 3);
      gs(g, x, y, mortar ? '3' : (y % 2 ? '2' : '1'));
    }
    for (var x2 = 0; x2 < w; x2++) for (var y2 = 0; y2 < h; y2++) if (g.a[y2][x2] !== '.') { gs(g, x2, y2, 'c'); break }
    for (var y3 = 9; y3 < h; y3++) { gs(g, 14, y3, '4'); gs(g, 21, y3, '4') }
    FW = can(g, { '1': C.g2, '2': C.g3, '3': C.g4, '4': C.night, c: C.cream });
    FWDATA = px(FW);
  }

  // ======================================================================================
  // GLOW (per il canvas FX): timbri radiali pre-cotti, 4 misure. Mai sfocature dal vivo.
  var GLOWS = {};
  function radial(col, sizeGame, res, squash) {
    var s = mk(sizeGame * res, Math.round(sizeGame * res * (squash || 1))), g = s.g, w = s.c.width, h = s.c.height;
    g.save(); g.translate(w / 2, h / 2); g.scale(1, squash || 1);
    var gr2 = g.createRadialGradient(0, 0, 0, 0, 0, w / 2); var c = rgb(col);
    gr2.addColorStop(0, 'rgba(' + c + ',0.9)'); gr2.addColorStop(.25, 'rgba(' + c + ',0.45)'); gr2.addColorStop(.6, 'rgba(' + c + ',0.12)'); gr2.addColorStop(1, 'rgba(' + c + ',0)');
    g.fillStyle = gr2; g.beginPath(); g.arc(0, 0, w / 2, 0, Math.PI * 2); g.fill(); g.restore();
    s.c.gw = sizeGame; s.c.gh = Math.round(sizeGame * (squash || 1)); return s.c;
  }
  function blurStamp(src, padG, res, blurPx, col) {
    var w = (src.width + padG * 2) * res, h = (src.height + padG * 2) * res, s = mk(w, h);
    var tmp = col ? solid(src, col) : src;
    if ('filter' in s.g) { s.g.filter = 'blur(' + blurPx + 'px)'; s.g.imageSmoothingEnabled = true; s.g.drawImage(tmp, padG * res, padG * res, src.width * res, src.height * res); s.g.filter = 'none' }
    else { s.g.imageSmoothingEnabled = true; s.g.globalAlpha = .12; for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) s.g.drawImage(tmp, padG * res + dx * blurPx / 2, padG * res + dy * blurPx / 2, src.width * res, src.height * res) }
    s.c.gw = src.width + padG * 2; s.c.gh = src.height + padG * 2; return s.c;
  }
  function buildGlows() {
    var sizes = [8, 16, 32, 64];
    var cols = { pomodoro: C.tomato, gold: C.gd2, red: C.crim3, cyan: '#5FD3FF', cream: C.cream, window: C.win2 };
    Object.keys(cols).forEach(function (k) { GLOWS[k] = sizes.map(function (z) { return radial(cols[k], z, 4) }) });
    GLOWS.player = sizes.map(function (z) { return radial(C.tomato, Math.max(4, z >> 1), 4, 3) });
    GLOWS.flame = sizes.map(function (z) { return radial(C.t3, Math.max(3, z >> 2), 6, 3.2) });
    var eg = gclone(SHIP_INFO[2].g); for (var y = 0; y < eg.h; y++) for (var x = 0; x < eg.w; x++) if ('rdD'.indexOf(eg.a[y][x]) < 0) eg.a[y][x] = '.'; var eng = can(eg, SHIP_PAL);
    GLOWS.ship = [0, 1, 2, 3].map(function (i) { return blurStamp(eng, 6, 3, 4 + i * 3, C.tomato) });
  }
  ART.glow = function (name, size) {
    if (size == null) size = 1;
    if (name === 'accent') { var k = 'acc' + ART.day; if (!GLOWS[k]) GLOWS[k] = [8, 16, 32, 64].map(function (z) { return radial(D(ART.day)[7], z, 4) }); return GLOWS[k][size] }
    if (name === 'logo') { var lk = 'logo' + ART.day; if (!GLOWS[lk]) { var ls = logoSet(ART.day); GLOWS[lk] = [blurStamp(ls.full, 10, 2, 8, mix(C.cream, D(ART.day)[7], .6))] } return GLOWS[lk][0] }
    var g = GLOWS[name] || GLOWS.cream; return g[Math.max(0, Math.min(g.length - 1, size))];
  };

  // ======================================================================================
  // DISEGNO (chiamate veloci)
  ART.day = 'tue';
  ART.setDay = function (day) { if (DAYS[day]) { ART.day = day; buildDay(day) } };
  function R0(v) { return Math.round(v) }

  ART.ship = function (ctx, x, y, t, s) {
    s = s || {}; var b = s.bank || 0, bi = Math.max(0, Math.min(4, Math.round(b * 2) + 2)), I = SHIP_INFO[bi], ox = R0(x - SCX), oy = R0(y - SCY);
    if (s.shield > 0) { shieldGrab(ctx, x, y, t); shieldGlass(ctx, x, y, t, s.shield) }
    ctx.drawImage(SHIP[bi], ox, oy);
    // motori vivi: il nucleo dell'arco pulsa, sotto 0-4 px di fiamma (le fiamme morbide sono sul FX)
    var th = s.thrust == null ? .5 : s.thrust, fr = (t * 24) | 0, auto = s.power === 'auto';
    for (var i = 0; i < 3; i++) {
      var a = I.eng[i], ph = (fr + i * 2) % 6; ctx.fillStyle = ph < 2 ? C.t4 : ph < 4 ? C.t3 : C.tomato; ctx.fillRect(ox + a + 1, oy + 21, 1, 1);
      var L = (th > .25 ? 1 : 0) + (th > .7 ? 1 : 0) + (auto ? 2 : 0) - ((fr + i) % 3 === 0 ? 1 : 0);
      for (var j = 0; j < L; j++) { ctx.fillStyle = j === 0 ? C.tomato : j === 1 ? C.t1 : C.t0; ctx.fillRect(ox + a + 1, oy + 22 + j, 1, 1) }
    }
    // luci di via (crema, alternate) e il segnale di coda
    var bl = ((t * 2.2) | 0) % 2, n = I.nav; ctx.fillStyle = C.cream;
    if (n[bl]) ctx.fillRect(ox + n[bl][0], oy + n[bl][1], 1, 1);
    if (((t * 3) % 1) < .12) { ctx.fillStyle = C.tomato; ctx.fillRect(ox + 13, oy + 17, 1, 1) }
    if (s.flash && !reduced) ctx.drawImage(SHIPF[bi], ox, oy);
    else if (s.flash) { ctx.globalAlpha = .5; ctx.drawImage(SHIPF[bi], ox, oy); ctx.globalAlpha = 1 }
    if (s.power === 'ai') { ctx.fillStyle = (t * 4 | 0) % 2 ? '#7FD8FF' : C.hot; ctx.fillRect(ox + 13, oy + 8, 1, 1); ctx.fillRect(ox + 13, oy + 5, 1, 1) }
    if (s.shield > 0) shieldDraw(ctx, x, y, t, s.shield);
  };
  ART.hitbox = { dx: 0, dy: -3 };
  // lo scudo Booking: copia sfocata ferma della scena dietro la nave (ogni 4 frame), cerchio, rosa 10%, arco crema
  var SH = null, shN = 0, SHR = 19, SHD = 42;
  function shieldGrab(ctx, x, y, t) {
    if (!SH) { SH = { a: mk(40, 40), small: mk(10, 10), out: mk(SHD, SHD) }; SH.small.g.imageSmoothingEnabled = true; SH.a.g.imageSmoothingEnabled = true }
    if ((shN++ & 3) !== 0) return;
    var sx = R0(x - 20), sy = R0(y - 20);
    try {
      SH.small.g.clearRect(0, 0, 10, 10); SH.small.g.drawImage(ctx.canvas, sx + 1, sy + 1, 40, 40, 0, 0, 10, 10);
      var a = SH.a.g; a.clearRect(0, 0, 40, 40); a.drawImage(SH.small.c, 0, 0, 10, 10, 0, 0, 40, 40);
      a.globalCompositeOperation = 'source-atop'; a.fillStyle = 'rgba(242,205,190,0.10)'; a.fillRect(0, 0, 40, 40); a.globalCompositeOperation = 'source-over';
      var o = SH.out.g; o.clearRect(0, 0, SHD, SHD); o.save(); o.beginPath(); o.arc(21, 21, SHR, 0, Math.PI * 2); o.clip(); o.drawImage(SH.a.c, 2, 1); o.restore();
    } catch (e) {}
  }
  var RIM = null;
  function shieldDraw(ctx, x, y, t, k) {
    if (!SH) return;
    if (!RIM) { // bordo del vetro: 1px crema tenue, arco di luce in alto a sinistra, due punti di riflesso
      RIM = [0, 1, 2].map(function (f) { var g = grid(SHD, SHD); for (var a = 0; a < 360; a += 1) { var th = a * Math.PI / 180, rx = Math.round(21 + Math.cos(th) * (SHR - .2) - .5), ry = Math.round(21 + Math.sin(th) * (SHR - .2) - .5), arc = a > 190 + f * 4 && a < 255 + f * 4; gs(g, rx, ry, arc ? 'h' : (a > 20 && a < 160 ? 'c' : 's')) } for (var a2 = 200 + f * 4; a2 < 240 + f * 4; a2++) { var t2 = a2 * Math.PI / 180; gs(g, Math.round(21 + Math.cos(t2) * (SHR - 3)), Math.round(21 + Math.sin(t2) * (SHR - 3)), 'q') } gs(g, 10 + f, 11, 'h'); return can(g, { h: C.cream, c: '#F4F2EC88', s: '#F2CDBE55', q: '#F4F2EC55' }) });
    }
    var ox = R0(x - 21), oy = R0(y - 21), flick = k < .34 && ((t * 12) | 0) % 3 === 0;
    ctx.globalAlpha = flick ? .4 : 1; ctx.drawImage(RIM[((t * 3) | 0) % 3], ox, oy); ctx.globalAlpha = 1;
  }
  // il vetro: la copia sfocata sta dietro la nave (rifrazione di 1px), il bordo sopra
  function shieldGlass(ctx, x, y, t, k) {
    if (!SH) return; var flick = k < .34 && ((t * 12) | 0) % 3 === 0;
    ctx.globalAlpha = flick ? .3 : .6 + .4 * k; ctx.drawImage(SH.out.c, R0(x - 21), R0(y - 21)); ctx.globalAlpha = 1;
  }
  ART.shipFx = function (ctx, x, y, t, s) {
    s = s || {}; var th = s.thrust == null ? .5 : s.thrust, len = (.6 + th) * (s.power === 'auto' ? 2 : 1), f = GLOWS.flame[2];
    var b = s.bank || 0, bi = Math.max(0, Math.min(4, Math.round(b * 2) + 2)), I = SHIP_INFO[bi];
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 3; i++) { var ex = I.eng[i] + 1.5 - SCX - .5, fl = .8 + .2 * Math.sin(t * 40 + i * 2.1), h = f.gh * len * fl, w = f.gw * (i === 1 ? 1.1 : .9); ctx.globalAlpha = .9; ctx.drawImage(f, x + ex - w / 2, y + 10, w, h) }
    var g = GLOWS.ship[1]; ctx.globalAlpha = .6; ctx.drawImage(g, x - g.gw / 2 + .5, y - g.gh / 2 + .5, g.gw, g.gh);
    ctx.restore();
  };
  ART.reticle = function (ctx, x, y, t) {
    var r = 7 + Math.round(Math.sin(t * 6)), x0 = R0(x), y0 = R0(y); ctx.fillStyle = '#7FD8FF';
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) { var cx = x0 + q[0] * r, cy = y0 + q[1] * r; ctx.fillRect(Math.min(cx, cx - q[0] * 2), cy, 3, 1); ctx.fillRect(cx, Math.min(cy, cy - q[1] * 2), 1, 3) });
    ctx.fillRect(x0, y0, 1, 1);
  };

  ART.enemy = function (ctx, type, x, y, t, s) {
    s = s || {}; var S = SP[ART.day] || daySprites(ART.day), gold = type === 'gold', base = gold ? (s.base || 'call') : type;
    var set = (gold ? S.gold : S.e)[base]; if (!set) return;
    var fps = { call: 12, invoice: 3, receipt: 2, noshow: 5, spam: 9, double: 3 }[base] || 6;
    var f = ((t * fps + (s.phase || 0) * 3.7) | 0) % set.length, c = set[f], ox = R0(x - c.width / 2), oy = R0(y - c.height / 2);
    if (s.dead) { ctx.drawImage(S.line[base][f], ox, oy); return }
    if (base === 'noshow' && s.fade) { if (s.fade >= .95) return; var k = Math.min(2, (s.fade * 4 | 0) - 1); c = k < 0 ? c : S.fade.noshow[f][k] }
    ctx.drawImage(c, ox, oy);
    if (gold) { var sf = ((t * 8) | 0) % 16; if (sf < 8) ctx.drawImage(S.shine[base][sf], ox, oy) }
    if (s.hit > 0) { if (reduced) { ctx.drawImage(S.line[base][f], ox, oy) } else { ctx.globalAlpha = Math.min(1, s.hit); ctx.drawImage(S.flash[base][f], ox, oy); ctx.globalAlpha = 1 } }
  };
  ART.cable = function (ctx, x1, y1, x2, y2, t) {
    var acc = D(ART.day)[7], n = Math.max(2, Math.round(Math.abs(x2 - x1) + Math.abs(y2 - y1))), p = (t * 1.4) % 1;
    ctx.fillStyle = mix(acc, C.night, .45);
    for (var i = 0; i <= n; i++) { var k = i / n, sag = Math.sin(k * Math.PI) * 3; ctx.fillRect(R0(x1 + (x2 - x1) * k), R0(y1 + (y2 - y1) * k + sag), 1, 1) }
    ctx.fillStyle = acc; for (var j = 0; j < 2; j++) { var k2 = (p + j * .5) % 1, sag2 = Math.sin(k2 * Math.PI) * 3; ctx.fillRect(R0(x1 + (x2 - x1) * k2), R0(y1 + (y2 - y1) * k2 + sag2), 1, 1) }
  };

  ART.boss = function (ctx, name, x, y, t, s) {
    s = s || {}; var hit = s.hit > 0, shake = (s.rage || 0) > 0 && !reduced ? Math.round(Math.sin(t * 50) * (s.rage * 2)) : 0;
    if (name === 'urgent') {
      var m = Math.max(0, Math.min(2, Math.round((s.mouth || 0) * 2))), beat = (t * 2.4 % 1) < .25 ? 1 : 0, i = m * 2 + beat, c = URG[i];
      var ox = R0(x - c.width / 2) + shake, oy = R0(y - c.height / 2);
      ctx.drawImage(c, ox, oy); if (hit) { ctx.globalAlpha = reduced ? .4 : Math.min(1, s.hit); ctx.drawImage(URGF[i], ox, oy); ctx.globalAlpha = 1 }
      return;
    }
    var ph = Math.max(1, Math.min(3, s.phase || 1)), mo = Math.max(0, Math.min(2, Math.round((s.mouth || 0) * 2))), bl = (t % 3.2) < .12 ? 1 : 0;
    var k = monday(ph, mo, bl, s.pagesTorn || 0), mc = MON[k], mx = R0(x - mc.width / 2) + shake, my = R0(y - mc.height / 2);
    if (ph === 3) { var bf = ((t * 16) | 0) % 2; ctx.drawImage(BELLS[bf], mx + 2, my - 12); ctx.drawImage(BELLS[1 - bf], mx + mc.width - 36, my - 12) }
    ctx.drawImage(mc, mx, my);
    if (s.hp != null) { // barra della vita sotto (sottile, crema)
      var bw = mc.width - 40; ctx.fillStyle = C.g4; ctx.fillRect(mx + 20, my + mc.height + 3, bw, 2); ctx.fillStyle = C.crim3; ctx.fillRect(mx + 20, my + mc.height + 3, R0(bw * Math.max(0, s.hp)), 2) }
    if (hit) { ctx.globalAlpha = reduced ? .4 : Math.min(1, s.hit); ctx.drawImage(MONF[k], mx, my); ctx.globalAlpha = 1 }
  };
  // pagina strappata che vola (3 fotogrammi: piena, di sbieco, di taglio)
  var PAGE = null;
  ART.page = function (ctx, x, y, t, k) {
    if (!PAGE) PAGE = [0, 1, 2].map(function (f) { var w = [14, 9, 3][f], g = grid(16, 12); var o = (16 - w) >> 1; gr(g, o, 1, w, 10, '0'); gr(g, o, 1, w, 3, 'r'); if (w > 4) { gr(g, o + 2, 6, w - 4, 1, '2'); gr(g, o + 2, 8, w - 5, 1, '2') } for (var x2 = o; x2 < o + w; x2 += 2) gs(g, x2, 0, 'r'); return lightUp(pad(can(g, MPAL)), 'mon', { top: 0 }) });
    var f = (((t * 9) | 0) + (k || 0)) % 4; f = f === 3 ? 1 : f; var c = PAGE[f]; ctx.drawImage(c, R0(x - c.width / 2), R0(y - c.height / 2));
  };

  ART.bullet = function (ctx, kind, x, y, t, a) {
    if (kind === 'player') { ctx.drawImage(PSHOT, R0(x), R0(y - 2)); return }
    if (kind === 'block') { ART.meeting(ctx, x - 20, y - 6, 40, 12, t, 'MEETING'); return }
    var S = SP[ART.day] || daySprites(ART.day), set = S.bul[kind] || S.bul.diamond, c = set[((t * 10) | 0) % set.length];
    ctx.drawImage(c, R0(x - c.width / 2), R0(y - c.height / 2));
  };
  // blocco riunione (muro di MONDAY): grigio macchina con la barra d'accento e l'etichetta
  ART.meeting = function (ctx, x, y, w, h, t, label) {
    x = R0(x); y = R0(y); w = R0(w); h = R0(h); var acc = D(ART.day)[7];
    ctx.fillStyle = C.night; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
    ctx.fillStyle = C.g3; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = C.g2; ctx.fillRect(x, y, w, 1);
    ctx.fillStyle = C.cream; ctx.fillRect(x, y + h - 1, w, 1);
    ctx.fillStyle = acc; ctx.fillRect(x, y, 2, h);
    if (label && w > 12 && h >= 7) { tiny(ctx, label.length * 4 > w - 6 ? label.slice(0, Math.max(1, ((w - 6) / 4) | 0)) : label, x + 4, y + ((h - 5) >> 1), C.cream) }
  };

  ART.powerup = function (ctx, kind, x, y, t) {
    var set = CAPS[kind] || CAPS.auto, bob = Math.round(Math.sin(t * 4) * 1), c = set[((t * (kind === 'coin' ? 10 : 6)) | 0) % set.length];
    ctx.drawImage(c, R0(x - 7), R0(y - 8) + bob);
  };
  // firewall: cache per maschera (si ridisegna solo se la somma cambia)
  var FWC = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  ART.firewallMask = function () { var m = new Uint8Array(36 * 14), d = FWDATA.data; for (var i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 0 ? 1 : 0; return m };
  ART.firewall = function (ctx, x, y, mask) {
    if (!mask) { ctx.drawImage(FW, R0(x), R0(y)); return }
    var e = FWC && FWC.get(mask), sum = 0; for (var i = 0; i < mask.length; i++) sum += mask[i];
    if (!e) { e = { c: mk(36, 14), sum: -1, id: null }; e.id = e.c.g.createImageData(36, 14); FWC && FWC.set(mask, e) }
    if (e.sum !== sum) { var q = e.id.data, d = FWDATA.data; for (var j = 0; j < mask.length; j++) { var o = j * 4; if (mask[j] && d[o + 3]) { q[o] = d[o]; q[o + 1] = d[o + 1]; q[o + 2] = d[o + 2]; q[o + 3] = 255; var up = j - 36; if (up >= 0 && !mask[up] && d[up * 4 + 3]) { q[o] = 244; q[o + 1] = 242; q[o + 2] = 236 } } else q[o + 3] = 0 } e.c.g.putImageData(e.id, 0, 0); e.sum = sum }
    ctx.drawImage(e.c.c, R0(x), R0(y));
  };

  ART.icon = function (ctx, name, x, y, k) {
    if (name === 'coffeeSpill') { ctx.drawImage(ICONS.spill[Math.max(0, Math.min(2, k | 0))], R0(x), R0(y)); return }
    if (name === 'coffee' && k) { var cf = [ICONS.coffee, ICONS.coffee1, ICONS.coffee2][(k | 0) % 3]; ctx.drawImage(cf, R0(x), R0(y)); return }
    var c = ICONS[name]; if (c) ctx.drawImage(c, R0(x), R0(y));
  };

  ART.mark = function (ctx, x, y, size, t, col) {
    size = Math.round(size || 24); var c = markCanvas(size, col || C.cream), ox = R0(x - c.width / 2), oy = R0(y - c.height / 2);
    var k = t == null ? 1 : Math.min(1, t / 1.1);
    if (k >= 1) { ctx.drawImage(c, ox, oy); return }
    // si disegna tratto per tratto: le tre gambe salgono dal basso, poi le due anse in alto
    var hh = Math.round(c.height * k); if (hh > 0) ctx.drawImage(c, 0, c.height - hh, c.width, hh, ox, oy + c.height - hh, c.width, hh);
    ctx.fillStyle = C.tomato; ctx.fillRect(ox, oy + c.height - hh, c.width, 1);
  };

  ART.logo = function (ctx, x, y, t, glitch, o) {
    o = o || {}; var L = logoSet(ART.day), ox = R0(x - LOGO.w / 2), oy = R0(y);
    var slot = (t * 12) | 0, d2 = FLK_D2[slot % FLK_D2.length] === '1';
    var gl = glitch && !reduced ? (glitch === true ? 1 : glitch) : 0;
    if (gl > 0) { var hs = hash(slot * 7 + 3); if (hs < .5 * gl) { ctx.globalAlpha = .5; ctx.drawImage(L.cy, ox - 2, oy); ctx.drawImage(L.rd, ox + 2, oy); ctx.globalAlpha = 1 } }
    for (var i = 0; i < LOGO.parts.length; i++) { var p = LOGO.parts[i], on = !(i === 3 && !d2); ctx.drawImage(on ? L.on[i] : L.off[i], ox + p.x, oy) }
    if (gl > 0) { for (var k = 0; k < 3; k++) { var h0 = hash(slot * 13 + k * 101); if (h0 < .35 * gl) { var sy = (h0 * 1000 | 0) % (LOGO.h - 4), sh = 2 + ((h0 * 7919) | 0) % 4, dx = (((h0 * 100) | 0) % 2 ? 1 : -1) * (2 + ((h0 * 977) | 0) % 6); ctx.drawImage(L.full, 0, sy, LOGO.w, sh, ox + dx, oy + sy, LOGO.w, sh) } } }
    // la riga pomodoro: si riempie come un orologio e sbatte sul bordo con un glitch
    var rk = o.rule != null ? o.rule : ((t % 6) / 5), ry = oy + LOGO.h + 3, rw = R0(LOGO.w * Math.min(1, rk));
    ctx.fillStyle = C.g4; ctx.fillRect(ox, ry, LOGO.w, 1); ctx.fillStyle = C.tomato; ctx.fillRect(ox, ry, rw, 1);
    if (rk >= 1 && !reduced && ((t * 20) | 0) % 3 === 0) { ctx.fillStyle = C.t4; ctx.fillRect(ox + LOGO.w - 6, ry - 1, 6, 1); ctx.fillStyle = C.tomato; ctx.fillRect(ox + LOGO.w - 3, ry + 1, 4, 1) }
  };
  ART.logoSize = function () { if (!LOGO) LOGO = buildLogo(); return { w: LOGO.w, h: LOGO.h + 4 } };

  // ---------- sfondo
  ART.sky = function (ctx, day, t) {
    if (!DAYS[day]) day = 'tue'; if (day !== ART.day) ART.setDay(day);
    var s = SKY[day]; ctx.drawImage(s.c, 0, 0);
    var st = s.stars; if (st.length) { ctx.fillStyle = C.cream; for (var i = 0; i < st.length; i++) { var p = st[i]; if (((t * .8 + p[2]) % 6) < .35) ctx.fillRect(p[0], p[1], 1, 1) } }
  };
  ART.skyline = function (ctx, day, scroll, t) {
    if (day && !DONE[day]) buildDay(day);
    var c = FAR[day] || FAR.tue, x = -(((scroll || 0) * .05) % FAR_W + FAR_W) % FAR_W, y = 236 - FAR_H;
    ctx.drawImage(c, R0(x), y); ctx.drawImage(c, R0(x) + FAR_W, y);
    // luci dei tetti (accento) che lampeggiano piano
    var acc = D(day)[7]; ctx.fillStyle = acc;
    for (var i = 0; i < FAR_LIGHTS.length; i++) { var L = FAR_LIGHTS[i]; if (((t || 0) * .5 + L[2]) % 1 < .5) { var lx = ((L[0] + x) % FAR_W + FAR_W) % FAR_W; ctx.fillRect(R0(lx), y + L[1], 1, 1) } }
    // nebbia tra lontano e mezzo (0.35)
    var f = FOG[day] || FOG.tue, sw = R0(Math.sin((t || 0) * .4) * 6);
    ctx.globalAlpha = .35; ctx.drawImage(f, -20 + sw, 236 - 40); ctx.globalAlpha = 1;
  };
  ART.towers = function (ctx, day, scroll, t, billboards) {
    if (day && !DONE[day]) buildDay(day);
    var c = MID[day] || MID.tue, x = -(((scroll || 0) * .2) % MID_W + MID_W) % MID_W, y = 240 - MID_H, xi = R0(x);
    ctx.drawImage(c, xi, y); if (xi + MID_W < W) ctx.drawImage(c, xi + MID_W, y);
    var acc = D(day)[7], ads = ADS[day] || ADS.tue, thu = day === 'thu', slot = ((t || 0) * 12) | 0;
    for (var rep = 0; rep < 2; rep++) for (var i = 0; i < BOARDS.length; i++) {
      var bd = BOARDS[i], bx = xi + bd.x + rep * MID_W; if (bx > W || bx + bd.w < 0) continue;
      var fs = bd.flk, ch = fs[slot % fs.length]; if (thu && fs[(slot + 5) % fs.length] === '0') ch = '0';
      var on = ch === '1', by = y + bd.y, bb = billboards && billboards.length ? billboards[i % billboards.length] : null;
      if (bb && bb.img) {
        var im = tinted(bb.img, on ? mix(acc, C.cream, .35) : C.off), iw = im.width, ih = im.height, sc = Math.min((bd.w - 6) / iw, (bd.h - 6) / ih);
        var dw = Math.max(1, R0(iw * sc)), dh = Math.max(1, R0(ih * sc)); ctx.drawImage(im, bx + R0((bd.w - dw) / 2), by + R0((bd.h - dh) / 2), dw, dh);
      } else if (bb && bb.name) { var nm = String(bb.name).toUpperCase().slice(0, 13); tiny(ctx, nm, bx + R0((bd.w - tinyWidth(nm)) / 2), by + 10, on ? mix(acc, C.cream, .5) : C.off) }
      else { var ad = ads[(i + (day.charCodeAt(0) + day.charCodeAt(1)) % 4) % 4]; ctx.drawImage(on ? ad.on : ad.off, bx + 1, by + 1) }
    }
    // luci rosse delle antenne
    ctx.fillStyle = acc;
    for (var j = 0; j < MID_BLINK.length; j++) { var L = MID_BLINK[j]; if (((t || 0) * .9 + L[2]) % 1 < .3) { var lx = ((L[0] + x) % MID_W + MID_W) % MID_W; if (lx < W) ctx.fillRect(R0(lx), y + L[1], 1, 1) } }
    // smog di THU: sale, porta il colore del neon
    if (thu) { var sm = FOG.thuSmog, oyy = R0(((t || 0) * 3) % 30); ctx.globalAlpha = .3; ctx.drawImage(sm, -20 + R0(Math.sin((t || 0) * .3) * 6), 240 - 70 - oyy); ctx.globalAlpha = 1 }
    // nebbia tra mezzo e vicino (0.15)
    var f = FOG[day] || FOG.tue; ctx.globalAlpha = day === 'wed' ? .3 : .15; ctx.drawImage(f, -20 - R0(Math.sin((t || 0) * .33) * 6), 240 - 34); ctx.globalAlpha = 1;
  };
  // la citta' vicina con le finestre-vita e la strada bagnata che riflette solo la luce
  var EMI = null;
  ART.city = function (ctx, windows, t, day, shift) {
    if (day && !DONE[day]) buildDay(day);
    day = DAYS[day] ? day : ART.day; var n = NEAR[day] || NEAR.tue, sh = R0(Math.max(-8, Math.min(8, shift || 0)));
    ctx.drawImage(n.c, -8 + sh, n.oy);
    if (!EMI) { EMI = mk(W, 26) }
    var e = EMI.g; e.clearRect(0, 0, W, 26);
    var rects = NEAR_R, tt = t || 0;
    for (var i = 0; i < rects.length; i++) {
      var r = rects[i], on = windows ? !!windows[i] : true, wx = r.x + sh, wy = r.y;
      if (WIN_PREV[i] === true && !on) WIN_OFF_T[i] = tt; WIN_PREV[i] = on;
      var dt = tt - (WIN_OFF_T[i] || -9), col = null;
      if (on) col = WIN_TONE[i];
      else if (dt < .3) { col = ((dt * 20) | 0) % 2 ? null : WIN_TONE[i] }
      if (col) { ctx.fillStyle = col; ctx.fillRect(wx, wy, r.w, r.h); e.fillStyle = col; e.fillRect(wx, wy - (STREET - 26), r.w, r.h) }
      else { ctx.fillStyle = n.off; ctx.fillRect(wx, wy, r.w, r.h) }
      if (!on && dt < .8 && dt > .1) { var ey = wy + r.h + Math.min(4, (dt - .1) * 10); ctx.fillStyle = C.cream; ctx.fillRect(wx + 1, R0(ey), 1, 1) }
    }
    // riflesso: 12 righe capovolte a mezza scala, ondulate
    ctx.globalAlpha = .3;
    for (var row = 0; row < 12; row++) { var sy = 25 - row * 2; if (sy < 0) break; var off = R0(Math.sin(row * .9 + tt * 3)); ctx.drawImage(EMI.c, 0, sy, W, 1, off, STREET + row, W, 1) }
    ctx.globalAlpha = 1;
  };
  ART.windowGlowRects = function () { return ART.windowRects };

  // ---------- meteo
  var RAIN = null, DROPS = null;
  function shaftX(day, t, i) { return [120, 300, 410][i] + Math.sin(t * .25 + i * 2) * 14 }
  ART.weather = function (ctx, day, t, intensity) {
    var k = intensity == null ? 1 : intensity, d = D(day);
    if (day === 'tue' || (day === 'night' && false)) {
      if (!RAIN) { var R = rnd(55); RAIN = []; for (var i = 0; i < 180; i++) RAIN.push([R() * (W + 60), R() * H, R() < .5 ? 1 : 0, .8 + R() * .4]) }
      if (!DROPS) { // gocce pre-cotte: [lontana, vicina] x [normale, nel fascio di luce], alfa gia' dentro
        DROPS = [[.35, .6], [.5, .8]].map(function (al, nr) { return al.map(function (a) { var len = nr ? 5 : 3, g = grid(2, len); for (var q = 0; q < len; q++) gs(g, q < 2 && nr ? 1 : (q < 1 ? 1 : 0), q, 'x'); var c = rgb(nr ? C.cream : mix(d[6], C.cream, .25)); return can(g, { x: hx(c[0], c[1], c[2]) + ('0' + Math.round(a * 255).toString(16)).slice(-2) }) }) });
      }
      var n = Math.round(180 * k), s0 = shaftX(day, t, 0), s1 = shaftX(day, t, 1), s2 = shaftX(day, t, 2);
      for (var j = 0; j < n; j++) {
        var p = RAIN[j], nr = p[2], sp = (nr ? 260 : 120) * p[3], yy = (p[1] + t * sp) % (H + 10) - 10, xx = (p[0] - (yy * .25)) % (W + 60);
        if (yy < 10) continue; // mai sopra l'HUD
        var inS = Math.abs(xx - s0) < 12 || Math.abs(xx - s1) < 12 || Math.abs(xx - s2) < 12;
        ctx.drawImage(DROPS[nr][inS ? 1 : 0], R0(xx) - 1, R0(yy));
      }
      // corone sugli spigoli dei tetti vicini
      ctx.fillStyle = C.cream;
      for (var c = 0; c < 10; c++) { var ph = (t * 3 + c * .37) % 1, rf = ROOFS[(c * 7 + ((t * 3 + c * .37) | 0) * 3) % ROOFS.length]; if (!rf) continue; var rx = R0(rf[0] + 2 + hash(c * 31 + ((t * 3 + c * .37) | 0)) * (rf[2] - 4)), ry = rf[1] - 1; if (ph < .12) ctx.fillRect(rx, ry, 1, 1); else if (ph < .24) { ctx.fillRect(rx - 1, ry - 1, 1, 1); ctx.fillRect(rx + 1, ry - 1, 1, 1) } }
    } else if (day === 'wed') {
      buildDay('wed'); var f = FOG.wed; ctx.globalAlpha = .18 * k; ctx.drawImage(f, -20 + R0(Math.sin(t * .2) * 10), 150); ctx.drawImage(f, -10 - R0(Math.sin(t * .17) * 10), 200); ctx.globalAlpha = 1;
    } else if (day === 'thu') {
      buildDay('thu'); var sm = FOG.thuSmog; ctx.globalAlpha = .16 * k; ctx.drawImage(sm, -20 + R0(Math.sin(t * .23) * 8), 180 - R0((t * 4) % 40)); ctx.globalAlpha = 1;
      // granelli di smog che salgono
      ctx.fillStyle = mix(d[6], C.cream, .2); for (var a = 0; a < 40 * k; a++) { var gx = (hash(a * 17) * W + Math.sin(t + a) * 4), gy = H - ((hash(a * 29) * H + t * 8) % H); ctx.fillRect(R0(gx), R0(gy), 1, 1) }
    } else if (day === 'fri') {
      // coriandoli 2x1 / 1x1 (crema, accento, oro, grigio: mai pomodoro)
      var cols = [C.cream, d[7], C.gd2, C.g2];
      for (var b = 0; b < 70 * k; b++) { var cx = (hash(b * 7) * W + Math.sin(t * 2 + b) * 6) % W, cy = (hash(b * 13) * H + t * (20 + hash(b) * 20)) % H; if (cy < 10) continue; ctx.fillStyle = cols[b & 3]; var flip = (((t * 10) | 0) + b) % 2; ctx.fillRect(R0(cx), R0(cy), flip ? 2 : 1, 1) }
      // luci da festa: una fila di lampadine che si accendono a turno in alto
      for (var l = 0; l < 24; l++) { var lx = 10 + l * 20, ly = 14 + R0(Math.sin(l * .9) * 2); ctx.fillStyle = (((t * 4) | 0) + l) % 3 === 0 ? d[7] : C.off; ctx.fillRect(lx, ly, 1, 1) }
    } else if (day === 'sat') {
      ctx.fillStyle = mix(d[7], C.cream, .3);
      for (var e = 0; e < 50 * k; e++) { var ex = (hash(e * 11) * W + t * (6 + hash(e) * 8)) % W, ey = 60 + (hash(e * 5) * 180 + Math.sin(t + e) * 6); ctx.globalAlpha = .4 + .4 * hash(e * 3); ctx.fillRect(R0(ex), R0(ey), 1, 1) } ctx.globalAlpha = 1;
    } else if (day === 'mon') {
      if (!reduced && k > 0) { var slot = (t * 12) | 0; if (hash(slot) < .12 * k) ART.glitch(ctx, t, k) }
      var bar = (t * 40) % (H + 40) - 20; ctx.fillStyle = d[7]; ctx.globalAlpha = .06; ctx.fillRect(0, R0(bar), W, 3); ctx.globalAlpha = 1;
    } else if (day === 'night') {
      ctx.fillStyle = mix(d[7], C.cream, .4); for (var m2 = 0; m2 < 24; m2++) { var mx = hash(m2 * 3) * W, my = 20 + hash(m2 * 9) * 200 - (t * 10 + m2 * 7) % 40; if (((t * 2 + m2) | 0) % 3) ctx.fillRect(R0(mx), R0(my), 1, 1) }
    }
  };
  ART.glitch = function (ctx, t, amount) {
    if (reduced) return; var slot = (t * 14) | 0, n = 1 + ((hash(slot * 3) * 3) | 0), a = amount == null ? 1 : amount;
    for (var i = 0; i < n; i++) { var h0 = hash(slot * 31 + i * 7), y = 10 + ((h0 * (H - 30)) | 0), hh = 2 + ((h0 * 977) | 0) % 5, dx = R0((((h0 * 1013) | 0) % 2 ? 1 : -1) * (2 + ((h0 * 7717) | 0) % 7) * a); try { ctx.drawImage(ctx.canvas, 0, y, W, hh, dx, y, W, hh) } catch (e) {} }
  };
  ART.shafts = function (ctx, day, t) {
    var acc = D(day)[7], sun = day === 'sun'; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 3; i++) {
      var x = shaftX(day, t, i), top = i === 1 ? 20 : 60, sway = Math.sin(t * .3 + i) * 10, a = (.06 + .03 * Math.sin(t * .7 + i * 1.7)) * (sun ? .5 : 1);
      var g = ctx.createLinearGradient(0, top, 0, 240); var c = rgb(i === 1 ? C.cream : acc);
      g.addColorStop(0, 'rgba(' + c + ',' + a + ')'); g.addColorStop(1, 'rgba(' + c + ',0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 3, top); ctx.lineTo(x + 3, top); ctx.lineTo(x + 26 + sway, 240); ctx.lineTo(x - 26 + sway, 240); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  };

  // ---------- palazzi della CITY
  ART.building = function (ctx, kind, x, y, w, h, t, sign) {
    w = R0(w); h = R0(h); x = R0(x); y = R0(y);
    ctx.drawImage(buildingCanvas(kind, w, h, 'night', false), x, y);
    var sl = signSlot(kind, w, h), sx = x + sl.x, sy = y + sl.y;
    ctx.fillStyle = C.night; ctx.fillRect(sx - 1, sy - 1, sl.w + 2, sl.h + 2); ctx.fillStyle = '#16181C'; ctx.fillRect(sx, sy, sl.w, sl.h);
    if (kind === 'food') { ctx.fillStyle = C.g3; ctx.fillRect(sx - 3, sy + 2, 3, 1) }
    if (sign && sign.img) {
      var flk = ((t || 0) * 12 | 0) % 37 === 0, im = tinted(sign.img, flk ? C.off : (sign.color || C.cream)), sc = Math.min((sl.w - 2) / im.width, (sl.h - 2) / im.height), dw = Math.max(1, R0(im.width * sc)), dh = Math.max(1, R0(im.height * sc));
      ctx.drawImage(im, sx + R0((sl.w - dw) / 2), sy + R0((sl.h - dh) / 2), dw, dh);
    } else if (sign && sign.name) { var nm = String(sign.name).toUpperCase(); tiny(ctx, nm.slice(0, Math.max(1, ((sl.w - 2) / 4) | 0)), sx + 1, sy + R0((sl.h - 5) / 2), C.cream) }
    else ctx.drawImage(signOff(sl.w, sl.h), sx, sy);
  };

  // ---------- scoppi: scintille nei colori del nemico che cadono e diventano crema prima di morire
  var EXCOL = { call: [C.p1, C.p0, C.p2], invoice: [C.p0, C.p1, C.p2], receipt: [C.p0, C.p1], noshow: [C.cream, C.p1], spam: [C.p0, C.p1, C.p2], double: [C.p0, C.p2],
    gold: [C.gd3, C.gd2, C.gd1], player: [C.g1, C.tomato, C.t3, C.g2], boss: [C.crim3, C.p0, C.crim2, C.p1], paper: [C.p0, C.p1, C.p2] };
  ART.explosion = function (ctx, x, y, t0, t, kind) {
    var dt = t - t0; if (dt < 0) return true;
    if (kind === 'impact') { if (dt > .06) return false; ctx.fillStyle = C.tomato; ctx.fillRect(R0(x) - 1, R0(y), 1, 1); ctx.fillRect(R0(x) + 1, R0(y), 1, 1); ctx.fillRect(R0(x), R0(y) - 1, 1, 1); ctx.fillStyle = C.hot; ctx.fillRect(R0(x), R0(y), 1, 1); return true }
    var big = kind === 'boss' || kind === 'player', life = big ? 1.4 : .75; if (dt > life) return false;
    var cols = EXCOL[kind] || EXCOL.paper, n = big ? 28 : 9, seed = ((x * 73 + y * 151 + t0 * 1000) | 0);
    if (dt < .05 && !reduced) { ctx.fillStyle = C.hot; ctx.fillRect(R0(x) - 1, R0(y) - 1, 3, 3) }
    for (var i = 0; i < n; i++) {
      var h1 = hash(seed + i * 17), h2 = hash(seed + i * 31), h3 = hash(seed + i * 47), my = life * (.5 + .5 * h3);
      if (dt > my) continue;
      var ang = h1 * Math.PI * 2, sp = (big ? 40 : 26) + h2 * (big ? 70 : 34), vx = Math.cos(ang) * sp, vy = Math.sin(ang) * sp - 18;
      var px0 = x + vx * dt, py0 = y + vy * dt + 90 * dt * dt, k = dt / my;
      ctx.fillStyle = k > .7 ? C.cream : cols[i % cols.length]; ctx.fillRect(R0(px0), R0(py0), (k < .3 && i % 3 === 0) ? 2 : 1, 1);
    }
    return true;
  };
})();
