/* DEADLINE · la grafica (window.DEADLINE_ART). Tutto pixel art fatta in codice, preparata una volta in init()
   su canvas fuori schermo; le chiamate di disegno sono solo drawImage dalla cache (frame scelto da t).
   Regole: ART-BRIEF.md (colori fissi, rampa a 8 posti per giorno, luce della citta' dal basso, pomodoro solo al giocatore).

   COORDINATE (pixel del gioco 480x270):
   - centro in x,y: ship, enemy, boss, bullet, powerup, explosion, mark, logo (x = centro, y = alto), page, reticle.
   - angolo in alto a sinistra: text (con align), firewall, meeting, icon, building, digits, tiny.

   GIRO 3 / V3 (scorrimento laterale, attori HD). Tutto il resto sotto resta valido.
   - ATTORI HD: ship, enemy, boss, bullet, powerup, explosion, page, cable, reticle, icon, portrait, dialog, parcel,
     virusCell, virusCore, firewall, logo, map, hud*: coordinate di GIOCO (480x270). Se il canvas e' largo >= 720
     (canvas attori 960x540) disegnano a densita' doppia; su un canvas 480 disegnano dimezzato. ART.actorScale (1|2)
     forza la scala. Il canvas attori deve avere imageSmoothingEnabled = false.
   - ART.bgCanvas = il canvas di sfondo (480x270): lo scudo Booking ne fa la copia sfocata (se manca usa il canvas attori).
   - ART.side = true: la nave e' vista di lato e guarda a destra. Versione 2 (default): caccia basso e lungo, scafo
     crema con la riga pomodoro, cabina che luccica, ala a freccia e deriva; la m e' il blocco motore dietro (il fondo
     della m del logo coricato: tre ugelli corti con gli archi, fiamme pomodoro). ART.shipVariant2 = 'a' | 'b' | 'c'
     (s.variant2 per provarle); s.view = 'side1' per la prima versione di lato. s.bank = beccheggio -1..1. s.view = 'top' per la vecchia nave vista dall'alto (ART.shipVariant 'a'..'e').
     ART.hitbox = {dx, dy}: il sensore (1px bianco caldo) rispetto al centro: usarlo al posto di y - 3.
   - Il colpo 'player' e' orizzontale (testa a destra). I nemici guardano a sinistra; 'ring' si apre verso sinistra.
   - ART.street(ctx, day, scroll, t): la strada vicina che scorre (parallasse 0.6), striscia di 960 senza giunture,
     con i pezzi del giorno (ombrelli e pozzanghere, lampioni nella nebbia, vapore e insegne acide, laser, ombre lunghe,
     alberi, lampeggianti). skyline (0.05) e towers (0.2) sono gia' strisce senza giunture: passare lo stesso scroll.
     ART.streetShops(day, scroll) -> [{i, kind, x, w, top, cx}] i palazzi visibili (per la consegna del venerdi').
   - BOSS nuovi: ART.boss(ctx, 'voicemail'|'replyall'|'paperjam'|'onestar'|'scaries', x, y, t, s), s.state =
     'idle'|'attack'|'hurt' (oppure s.hit / s.mouth come prima), s.hp 0..1 = barra. ART.prepareBosses().
     MONDAY e URGENT invariati (MONDAY guarda a sinistra).
   - ART.portrait(ctx, name, x, y, t, mood): ritratto 56x48 (x,y = angolo). name: i 5 boss + 'urgent' + 'monday'.
     mood: 'idle' | 'smug' | 'angry' | 'rage' | 'hurt' (MONDAY 'smug' = il ghigno del cameo).
   - ART.dialog(ctx, x, y, w, h, t, o) -> true a testo finito. o = {name, portrait, mood, text, chars | t0, color}.
   - ART.logo(ctx, x, y, t, glitch, o): insegna al neon d'epoca (pannello, staffe, DEAD crema LINE pomodoro, seconda D
     che sfarfalla, A MOTHER MACHINE GAME, targhetta OPEN 24/7). x = centro, y = alto. ART.logoSize() ~ 244x101 (targhetta compresa).
     ART.glow('logo') ha .ox .oy (offset dal punto x,y) oltre a .gw .gh.
   - CITY del titolo: ART.building(ctx, kind, x, y, w, h, t, sign) con kind 'restaurant' | 'streetfood' | 'clothing' |
     'hairdresser' | 'supermarket' | 'hotel' | 'cafe' | 'gym' (food/fashion/shop/beauty/services ci finiscono dentro).
     Ogni tipo ha la sua insegna (arco, cerchio, lama verticale, ovale, fascia, lettere sul tetto, esagono); senza
     vincitore neon spento FOR RENT / YOUR SIGN HERE. ART.signSlot(kind, w, h) = dove va il logo. ART.buildingKinds.
   - HUD Control Room: ART.hudClock(ctx, x, y, w, k, day, t, {overtime}), ART.hudCounter(ctx, xCentro, y, valore, t)
     (valore decimale = il rullo gira), ART.hudCups(ctx, xDestra, y, n, max, t, spillK), ART.hudSign(ctx, x, y,
     'OPEN'|'CLOSED'|'BRB', t, hurt), ART.hudSystems(ctx, xDestra, y, {booking, auto, ai, night, nightCharge, key}, t),
     ART.systemCard(ctx, kind, t, {name, line}), ART.hint(ctx, x, y, testo, 'up'|'down'|'left'|'right', t),
     ART.plus(ctx, x, y, '+3h', k), ART.techFrame(ctx, x, y, w, h, col), ART.powerLabel(ctx, kind, x, y, dt),
     ART.powerInfo[kind] = {col, name, line}. ART.dayName(day) -> 'TUESDAY'...
   - UI (pixel del canvas, non di gioco): ART.uiButton(ctx, 'primary'|'secondary'|'icon', x, y, w, h,
     ''|'hover'|'down', {label | icon: 'pause'|'play'|'sound'|'mute'|'close'|'map', u}); ART.pad(ctx, x, y, w, h,
     {up, down, left, right, a, b, start, select}, {labels: {a, b}}); ART.padLayout(w, h) = rettangoli per il tocco.
   - GIOVEDI' virus: ART.serverBg(ctx, t), ART.virusCell(ctx, x, y, t, k) (cella 12x12, k 0..1 crescita),
     ART.virusCore(ctx, x, y, t, {hit}). VENERDI' consegna: ART.parcel(ctx, kind, x, y, t, {carried, glow}),
     ART.shopIcon(ctx, kind, x, y, col), ART.targetShop(ctx, shop, t) (shop da ART.streetShops).
   - MAPPA v3: diorama isometrico HD; s.installed = {indice: 'booking'|'auto'|'ai'|'night'} (default martedi'-venerdi')
     mostra il sistema installato sui quartieri battuti. Nomi interi dei giorni. Va disegnata sul canvas attori.

   GIRO 2 (richieste di Eso): nave nuova 27x23 (5 inclinazioni, motori vivi, luci di via), nemici con la faccia e piu'
   grandi, MONDAY piu' cattivo (pupille rosse, ghigno, zanne, corna, crepe, inchiostro che cola), capsule a pillola,
   moneta che gira, colpi nemici animati, pezzi di scena diversi per ogni giorno, mappa del mondo, intro.
   - ART.hitbox = {dx:0, dy:-3}: la cabina (1px bianco caldo) rispetto al centro della nave. Invariato dal giro 1.
   - ART.map(ctx, t, s): mappa 480x270 della citta' dall'alto. s = {current: 0..6 (6 = MONDAY, 7 accettato),
     done: [bool], unlocked: n (quartieri aperti, default current+1), shipPos: 0..6 float (viaggio sulla strada),
     pulse: 0..1 (facoltativo), labels: true, ship: true}. Nodi 0..5 = TUE..SUN, 6 = la torre di MONDAY.
   - ART.mapNode(i) -> {x,y} del nodo (per etichette e nave); ART.mapPoint(f) -> {x,y} sulla strada (f 0..6 float).
   - ART.intro(ctx, t, lines, o) -> 0..1 avanzamento (>= 1 finito). lines[0] e' il cartello d'apertura (4 s), il resto
     scorre in prospettiva sopra la citta' e sparisce dietro i palazzi. o.speed (default 9), o.first per forzarlo.
   - ART.introCard(ctx, t, line, o) -> true quando la riga e' tutta scritta: macchina da scrivere, cursore pomodoro.
     o = {size: 2, cps: 26, y: 135, width: 420, color}.
   - ART.frame(ctx, x, y, w, h, o): cornice da disegno tecnico (angoli crema, fondo scuro). o = {fill|false, color, label}.
   - ART.bar(ctx, x, y, w, k, o): barra 0..1 (pomodoro di default) con le tacche. o = {h, color, track}.
   - ART.icon(ctx, 'coffee', x, y, k): k = fotogramma del vapore (0..2).

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
   - ART.ship: 27x23, la cabina (1px bianco caldo, la hitbox visibile) e' a (x, y - 3). Lo scudo (s.shield > 0) copia
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
  var GK = 1;
  function grid(w, h) { if (GK !== 1) { w = Math.round(w * GK); h = Math.round(h * GK) } var a = []; for (var y = 0; y < h; y++) { var r = []; for (var x = 0; x < w; x++) r.push('.'); a.push(r) } return { w: w, h: h, a: a } }
  function rows(rs) { var g = grid(rs[0].length, rs.length); for (var y = 0; y < g.h; y++) for (var x = 0; x < g.w; x++) g.a[y][x] = rs[y][x] || '.'; return g }
  function gsr(g, x, y, c) { x = x | 0; y = y | 0; if (x >= 0 && y >= 0 && x < g.w && y < g.h) g.a[y][x] = c }
  function gs(g, x, y, c) { if (GK === 1) return gsr(g, x, y, c); x = x | 0; y = y | 0; var x0 = Math.round(x * GK), x1 = Math.max(x0 + 1, Math.round((x + 1) * GK)), y0 = Math.round(y * GK), y1 = Math.max(y0 + 1, Math.round((y + 1) * GK)); for (var j = y0; j < y1; j++) for (var i = x0; i < x1; i++) gsr(g, i, j, c) }
  function gg(g, x, y) { return (x >= 0 && y >= 0 && x < g.w && y < g.h) ? g.a[y][x] : '.' }
  function gr(g, x, y, w, h, c) { if (GK !== 1) { var x0 = Math.round(x * GK), x1 = Math.round((x + w) * GK), y0 = Math.round(y * GK), y1 = Math.round((y + h) * GK); for (var jj = y0; jj < y1; jj++) for (var ii = x0; ii < x1; ii++) gsr(g, ii, jj, c); return } for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) gsr(g, x + i, y + j, c) }
  function gbox(g, x, y, w, h, c) { for (var i = 0; i < w; i++) { gs(g, x + i, y, c); gs(g, x + i, y + h - 1, c) } for (var j = 0; j < h; j++) { gs(g, x, y + j, c); gs(g, x + w - 1, y + j, c) } }
  function gl(g, x0, y0, x1, y1, c) { if (GK !== 1) { x0 = Math.round(x0 * GK); y0 = Math.round(y0 * GK); x1 = Math.round(x1 * GK); y1 = Math.round(y1 * GK); var sk = GK; GK = 1; gl(g, x0, y0, x1, y1, c); GK = sk; return } var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy; for (var n = 0; n < 999; n++) { gs(g, x0, y0, c); if (x0 === x1 && y0 === y1) break; var e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx } if (e2 <= dx) { e += dx; y0 += sy } } }
  function gpoly(g, P, c) { if (GK !== 1) { var sk = GK; GK = 1; gpoly(g, P.map(function (p) { return [p[0] * sk, p[1] * sk] }), c); GK = sk; return } var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, i; for (i = 0; i < P.length; i++) { x0 = Math.min(x0, P[i][0]); x1 = Math.max(x1, P[i][0]); y0 = Math.min(y0, P[i][1]); y1 = Math.max(y1, P[i][1]) }
    for (var y = Math.floor(y0); y <= y1; y++) for (var x = Math.floor(x0); x <= x1; x++) { var px = x + .5, py = y + .5, ins = false; for (i = 0, j = P.length - 1; i < P.length; j = i++) { var a = P[i], b = P[j]; if ((a[1] > py) !== (b[1] > py) && px < (b[0] - a[0]) * (py - a[1]) / (b[1] - a[1]) + a[0]) ins = !ins } if (ins) gs(g, x, y, c) } var j }
  function gell(g, cx, cy, rx, ry, c) { if (GK !== 1) { var sk = GK; GK = 1; gell(g, cx * sk, cy * sk, rx * sk, ry * sk, c); GK = sk; return } for (var y = Math.floor(cy - ry); y <= cy + ry; y++) for (var x = Math.floor(cx - rx); x <= cx + rx; x++) { var dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry; if (dx * dx + dy * dy <= 1) gs(g, x, y, c) } }
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
  function accentize(src, day) { var s = px(src), d = s.data, a = rgb(D(day)[7]), A = rgb(mix(D(day)[7], C.ink, .45)), Bl = rgb(mix(D(day)[7], C.cream, .55)); if (day === 'sun') { a = rgb('#C2627A'); A = rgb('#7A2E44'); Bl = rgb('#E8A0B0') } for (var i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; if (d[i] === 255 && d[i + 1] === 0 && d[i + 2] === 255) { d[i] = a[0]; d[i + 1] = a[1]; d[i + 2] = a[2] } else if (d[i] === 170 && d[i + 1] === 0 && d[i + 2] === 170) { d[i] = A[0]; d[i + 1] = A[1]; d[i + 2] = A[2] } else if (d[i] === 255 && d[i + 1] === 128 && d[i + 2] === 255) { d[i] = Bl[0]; d[i + 1] = Bl[1]; d[i + 2] = Bl[2] } } return fromData(s) }

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
    return can(g, UPAL);
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
      gpoly(g, [[X(4), 12.5], [X(16), 11], [X(6), 6], [X(1.5), tip]], '1'); gl(g, X(7), 10, X(3), tip + 3, '0'); gl(g, X(12), 11, X(6), 7, '2'); gs(g, X(2), tip, 'R'); gs(g, X(2), tip + 1, 'r'); gs(g, X(3), tip + 2, 'r'); gs(g, X(2), tip + 2, 'R') });
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
        var pz = phase === 1 ? 3 : 4, pxo = 3;
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
    return can(g, MPAL);
  }
  // campane della sveglia (rage), 2 frame
  function bells(f) {
    var g = grid(32, 18), o = f ? 1 : -1;
    [[8, o], [23, -o]].forEach(function (b) { var x = b[0] + b[1]; gell(g, x, 10, 6.5, 7, 'Y'); gell(g, x - .5, 10, 5.5, 6, 'y'); gr(g, x - 7, 11, 15, 7, '.'); gr(g, x - 7, 10, 15, 1, 'Y'); gs(g, x - 3, 6, 'w'); gs(g, x - 4, 7, 'w'); gr(g, x - 1, 2, 2, 2, 'n') });
    gr(g, 15 + o * 2, 4, 2, 7, 'n'); gr(g, 14 + o * 2, 3, 4, 2, 'm');
    return pad(can(g, MPAL));
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
  function gclone(g) { var sk = GK; GK = 1; var n = grid(g.w, g.h); GK = sk; for (var y = 0; y < g.h; y++) for (var x = 0; x < g.w; x++) n.a[y][x] = g.a[y][x]; return n }
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
    if (day === 'sat') { var gd = grid(61, 61); gell(gd, 30.5, 30.5, 30, 30, 'h'); gell(gd, 30.5, 30.5, 20, 20, 's'); s.g.globalAlpha = .25; s.g.drawImage(can(gd, { h: '#FFC56A', s: '#FFC56A' }), 360, 120); s.g.globalAlpha = .55; s.g.drawImage(can(gd, { s: '#FFD9A0' }), 360, 120); s.g.globalAlpha = 1;
      for (var gy = 0; gy < 3; gy++) { s.g.fillStyle = 'rgba(255,217,160,' + (.12 - gy * .03) + ')'; s.g.fillRect(0, 186 + gy * 5, W, 1) } }
    if (day === 'tue' || day === 'night') { var mx = 392, my = 38; var gm = grid(13, 13); gell(gm, 6.5, 6.5, 6, 6, 'm'); gell(gm, 8.8, 5.2, 5.2, 5.6, '.'); s.g.drawImage(can(gm, { m: mix(C.cream, d[7], .15) }), mx, my) }
    if (day === 'sun') { // disco pallido dell'alba, basso e velato
      var gs2 = grid(25, 25); gell(gs2, 12.5, 12.5, 12, 12, 's'); s.g.globalAlpha = .55; s.g.drawImage(can(gs2, { s: C.hot }), 300, 196); s.g.globalAlpha = 1 }
    s.stars = stars;
    return { c: s.c, stars: stars };
  }

  // sagome di palazzi (generatore comune, stessa citta' ogni giorno: cambia solo la luce)
  function silhouettes(R, w, h, minW, maxW, minH, maxH) {
    var out = [], x = 0; while (x < w - 2) { var bw = minW + ((R() * (maxW - minW)) | 0), bh = minH + ((R() * (maxH - minH)) | 0); if (x + bw > w || w - (x + bw) < minW) bw = w - x; out.push({ x: x, w: bw, h: bh, kind: (R() * 6) | 0, r: R(), r2: R() }); x += bw + ((R() * 3) | 0) - 1 } return out;
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
  var AD_MON = [['MONDAY', '9:00 AM'], ['ALL HANDS', 'MEETING'], ['INBOX', '999+'], ['DEADLINE', 'TODAY']];
  function adMask(i, w, h, mon) {
    var s = mk(w, h), L = (mon ? AD_MON : AD_TXT)[i];
    if (L[0] === 'm') { var m = markCanvas(16, '#ffffff'); s.g.drawImage(m, 5, (h - 16) >> 1); tiny(s.g, 'MOTHER', 18, 7, '#ffffff'); tiny(s.g, 'MACHINE', 18, 14, '#ffffff') }
    else { var y0 = Math.round((h - (L.length * 7 - 2)) / 2); L.forEach(function (ln, j) { tiny(s.g, ln, Math.round((w - tinyWidth(ln)) / 2), y0 + j * 7, '#ffffff') }) }
    return s.c;
  }
  function buildAds(day) { var acc = D(day)[7]; return AD_TXT.map(function (t, i) { var m = adMask(i, 54, 24, day === 'mon'); return { on: neonize(m, acc, true), off: neonize(m, acc, false) } }) }
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
  var WIN_TONE = [], NEAR_R = [], WIN_PREV = [], WIN_OFF_T = [], LAMPS = [], VENTS = [], BEACONS = [], THU_SIGNS = null, CONE = null, PUFF = null, UMB = null;
  function buildNear(day) {
    var d = D(day), s = mk(NEAR_W, H - CITY_TOP + 20), g = s.g, B = nearLayout(), oy = CITY_TOP - 20;
    B.forEach(function (b) { g.drawImage(buildingCanvas(b.kind, b.w, b.h, day, true), b.x, STREET - b.h - oy) });
    // strada
    g.fillStyle = mix(d[5], C.night, .5); g.fillRect(0, STREET - oy, NEAR_W, H - STREET);
    g.fillStyle = mix(d[5], d[6], .25); g.fillRect(0, STREET - oy, NEAR_W, 1);
    var R = rnd(77 + DAYK.indexOf(day)), gaps = [];
    for (var i = 0; i < B.length - 1; i++) gaps.push(B[i].x + B[i].w + 1);
    if (day === 'sat') { // ombre lunghe del tramonto sulla strada
      g.fillStyle = 'rgba(10,4,6,.55)'; B.forEach(function (b) { for (var k = 0; k < 6; k++) g.fillRect(b.x + 4 + k * 3, STREET - oy + k, b.w, 1) }) }
    if (day === 'sun') { // alberi del parco tra i palazzi
      gaps.forEach(function (x, i) { if (i % 2) return; var tg = grid(13, 16); gr(tg, 6, 9, 1, 7, 'k'); gell(tg, 6.5, 6, 6, 5.6, 'T'); gell(tg, 6, 5, 5, 4.4, 't'); gs(tg, 4, 2, 'u'); gs(tg, 3, 3, 'u'); gs(tg, 5, 2, 'u'); g.drawImage(lightUp(can(tg, { k: '#2A2D2C', T: '#344A30', t: '#4E6E44', u: '#8AA870' }), 'sun', { top: 0 }), x - 6, STREET - oy - 15) }) }
    if (day === 'wed') { LAMPS = []; gaps.forEach(function (x, i) { if (i % 3) return; g.fillStyle = '#2A2D2C'; g.fillRect(x, STREET - oy - 16, 1, 16); g.fillRect(x, STREET - oy - 16, 4, 1); g.fillStyle = C.cream; g.fillRect(x + 3, STREET - oy - 15, 2, 1); LAMPS.push(x + 4 - 8) }) }
    if (day === 'thu') { VENTS = []; [40, 150, 270, 390].forEach(function (x) { g.fillStyle = '#060805'; g.fillRect(x, STREET - oy + 4, 7, 2); g.fillStyle = '#2F3A1F'; for (var k = 0; k < 7; k += 2) g.fillRect(x + k, STREET - oy + 4, 1, 2); VENTS.push(x + 3 - 8) }) }
    if (day === 'mon') { BEACONS = []; B.forEach(function (b, i) { if (i % 3) return; g.fillStyle = '#1A0709'; g.fillRect(b.x + 3, STREET - b.h - oy - 2, 3, 2); BEACONS.push([b.x + 4 - 8, STREET - b.h - 3]) }) }
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
    ART.size = { ship: { w: 27, h: 23 }, call: { w: 21, h: 16 }, invoice: { w: 17, h: 20 }, receipt: { w: 10, h: 14 }, noshow: { w: 15, h: 21 }, spam: { w: 17, h: 10 }, double: { w: 16, h: 15 },
    urgent: { w: 66, h: 38 }, monday: { w: 158, h: 119 }, powerup: { w: 14, h: 16 }, firewall: { w: 36, h: 14 }, icon: { w: 7, h: 7 }, logo: { w: 234, h: 42 }, mapTower: { w: 48, h: 120 } };
  // misure visibili (contorno compreso); MONDAY con le campane della fase 3
  function buildBase() {
    GK = 1.25;
    BASE.call = [0, 1, 2, 3].map(hCall);
    BASE.invoice = [0, 1, 2, 3].map(hInvoice);
    GK = 1;
    BASE.receipt = [0, 0, 0, 1].map(hReceipt);
    GK = 1.25;
    BASE.noshow = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3].map(function (f, i) { return hNoshow(f, i === 11) });
    GK = 1;
    BASE.spam = [0, 1].map(hSpam);
    GK = 1.25;
    BASE.double = [0, 0, 0, 0, 0, 1].map(hDouble);
    GK = 1;
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
    o.bul = makeBullets2(day);
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
    for (var m = 0; m < 3; m++) for (var b2 = 0; b2 < 2; b2++) { var u = lightUp(up2(bUrgent(m, b2)), 'mon', { top: .25 }); URG2[m * 2 + b2] = u; URGF2[m * 2 + b2] = solid(u, C.cream) }
    BELLS2 = [0, 1].map(function (f) { return lightUp(up2(bells(f)), 'mon', { top: 0 }) });
    // icone
    Object.keys(IC).forEach(function (k) { ICONS[k] = can(rows(IC[k]), ICPAL) });
    ICONS.spill = SPILL.map(function (r) { return can(rows(r), ICPAL) });
    // capsule e icone HD
    buildCaps2(); buildIcons2(); shipSet(ART.shipVariant);
    // firewall
    buildFirewall();
    nearLayout(); midLayout();
    buildDay('tue'); buildDay('night');
    buildGlows();
    var es = shipSet(ART.shipVariant)[2], gc = mk(32, 32); gc.g.fillStyle = C.tomato; es.eng.forEach(function (e) { gc.g.fillRect(Math.round((e[0] + e[1]) / 4), Math.round(e[2] / 2), 2, 2) }); GLOWS.ship = [0, 1, 2, 3].map(function (i) { return blurStamp(gc.c, 6, 3, 4 + i * 3) });
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
    if (ph === 3) { var bf = ((t * 16) | 0) % 2; ctx.drawImage(BELLS[bf], mx + (mc.width >> 1) - 17, my - 13) }
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
    if (day === 'fri') { var LC = [acc, C.cream, acc]; for (var lz = 0; lz < 3; lz++) { var lx0 = 80 + lz * 160, ly0 = 120 - lz * 6, an = -Math.PI / 2 + Math.sin((t || 0) * (.7 + lz * .2) + lz * 2) * .7, dx = Math.cos(an), dy = Math.sin(an); ctx.fillStyle = LC[lz]; for (var q = 0; q < 140; q += 2) { var qx = Math.round(lx0 + dx * q), qy = Math.round(ly0 + dy * q); if (qy < 10) break; ctx.globalAlpha = .7 - q / 260; ctx.fillRect(qx, qy, 1, 1) } } ctx.globalAlpha = 1 }
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
    cityExtras(ctx, day, tt, sh);
    // riflesso: 12 righe capovolte a mezza scala, ondulate
    ctx.globalAlpha = .3;
    for (var row = 0; row < 12; row++) { var sy = 25 - row * 2; if (sy < 0) break; var off = R0(Math.sin(row * .9 + tt * 3)); ctx.drawImage(EMI.c, 0, sy, W, 1, off, STREET + row, W, 1) }
    ctx.globalAlpha = 1;
  };
  ART.windowGlowRects = function () { return ART.windowRects };
  // i pezzi di scena di ogni giorno (sopra la citta' vicina): pochi drawImage, niente allocazioni
  function cityExtras(ctx, day, t, sh) {
    var d = D(day), i, k;
    if (day === 'tue') { // ombrelli che passano e cerchi nelle pozzanghere
      if (!UMB) UMB = [C.cream, d[7], C.g2, '#C2627A'].map(function (c) { return can(rows(['.ooo.', 'ouuuo', 'o.k.o', '..k..', '..k..']), { o: C.night, u: c, k: C.g4 }) });
      for (i = 0; i < 5; i++) { var spd = 9 + i * 3, dir = i % 2 ? 1 : -1, x = ((hash(i * 9) * 520 + dir * t * spd) % 520 + 520) % 520 - 20, bob = ((t * 6 + i) | 0) % 2; ctx.drawImage(UMB[i & 3], Math.round(x) + sh, STREET - 5 - bob) }
      ctx.fillStyle = mix(d[6], C.cream, .4); for (i = 0; i < 4; i++) { var ph = (t * .9 + i * .27) % 1, px = 60 + i * 110 + sh, r = Math.round(ph * 5); if (ph < .7) { ctx.globalAlpha = .7 - ph; ctx.fillRect(px - r, STREET + 2, 1, 1); ctx.fillRect(px + r, STREET + 2, 1, 1); ctx.fillRect(px, STREET + 1, 1, 1); ctx.globalAlpha = 1 } }
    } else if (day === 'wed') { // coni di luce dei lampioni nella nebbia
      if (!CONE) { var cg = grid(17, 18); for (var y = 0; y < 18; y++) { var hw = 1 + y * .45; for (var x2 = 0; x2 < 17; x2++) if (Math.abs(x2 - 8) <= hw && bay(x2, y) < .55 - y * .02) gs(cg, x2, y, 'c') } CONE = can(cg, { c: '#E8DCF8' }) }
      for (i = 0; i < LAMPS.length; i++) { ctx.globalAlpha = ((t * 9 + i * 3) | 0) % 23 === 0 ? .1 : .32; ctx.drawImage(CONE, LAMPS[i] + sh - 4, STREET - 15) } ctx.globalAlpha = 1;
    } else if (day === 'thu') { // vapore dai tombini e insegne acide che sfarfallano
      if (!PUFF) PUFF = [2, 3, 4].map(function (r) { var pg = grid(r * 2 + 1, r * 2 + 1); gell(pg, r + .5, r + .5, r, r, 'c'); for (var y = 0; y < pg.h; y++) for (var x3 = 0; x3 < pg.w; x3++) if (pg.a[y][x3] === 'c' && bay(x3, y) > .6) pg.a[y][x3] = '.'; return can(pg, { c: '#B8C29A' }) });
      for (i = 0; i < VENTS.length; i++) for (k = 0; k < 4; k++) { var p2 = (t * .7 + k * .25 + i * .13) % 1, pf = PUFF[Math.min(2, (p2 * 3) | 0)]; ctx.globalAlpha = .45 * (1 - p2); ctx.drawImage(pf, VENTS[i] + sh - (pf.width >> 1) + Math.round(Math.sin(p2 * 5 + i) * 2), STREET + 3 - Math.round(p2 * 22) - (pf.height >> 1)) }
      ctx.globalAlpha = 1;
      if (!THU_SIGNS) THU_SIGNS = ['OPEN', '24H', 'BAR'].map(function (w) { var m = mk(tinyWidth(w) + 4, 9); tiny(m.g, w, 2, 2, '#ffffff'); return [neonize(m.c, d[7], true), neonize(m.c, d[7], false)] });
      var sx = [30, 200, 352]; for (i = 0; i < 3; i++) { var st = '1110111101101111111001111'[(((t * 12) | 0) + i * 7) % 25], on = st === '1' && hash(((t * 12) | 0) * 3 + i) > .12; ctx.drawImage(THU_SIGNS[i][on ? 0 : 1], sx[i] + sh, CITY_TOP + 2 + i * 2) }
    } else if (day === 'mon') { // lampeggianti rossi sui tetti
      for (i = 0; i < BEACONS.length; i++) { var ph2 = (t * 2.5 + i * .3) % 1, b = BEACONS[i]; ctx.fillStyle = ph2 < .5 ? C.crim3 : '#3A0E13'; ctx.fillRect(b[0] + sh, b[1], 1, 1); if (ph2 < .5) { ctx.globalAlpha = .4; ctx.fillRect(b[0] + sh + (ph2 < .25 ? 2 : -4), b[1], 3, 1); ctx.globalAlpha = 1 } }
    }
  }

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
    } else if (day === 'sun') {
      ctx.fillStyle = C.g3; for (var bd = 0; bd < 7; bd++) { var bx = ((hash(bd * 5) * 520 + t * (8 + bd)) % 520) - 20, by = 40 + hash(bd * 11) * 70 + Math.sin(t * 1.5 + bd) * 3, wg = ((t * 6 + bd) | 0) % 2; ctx.fillRect(Math.round(bx), Math.round(by), 1, 1); ctx.fillRect(Math.round(bx) - 1, Math.round(by) - 1 + wg, 1, 1); ctx.fillRect(Math.round(bx) + 1, Math.round(by) - 1 + wg, 1, 1); ctx.fillRect(Math.round(bx) - 2, Math.round(by) - 1 + wg * 2, 1, 1); ctx.fillRect(Math.round(bx) + 2, Math.round(by) - 1 + wg * 2, 1, 1) }
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

  // ======================================================================================
  // MAPPA DEL MONDO: la citta' vista dall'alto (3/4), sei quartieri = TUE..SUN e la torre di MONDAY. Base pre-cotta,
  // per frame solo poche decine di pixel animati.
  var MAP_N = [[50, 214], [118, 170], [190, 208], [258, 150], [330, 194], [356, 104], [436, 134]];
  var MAP_D = ['tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'mon'];
  var MAP = null;
  ART.mapNode = function (i) { i = Math.max(0, Math.min(6, Math.round(i))); return { x: MAP_N[i][0], y: MAP_N[i][1] } };
  // il percorso: tra due nodi un tratto dritto e uno a 45 gradi (machine)
  function mapPath() {
    var pts = [];
    for (var i = 0; i < 6; i++) {
      var a = MAP_N[i], b = MAP_N[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], sx = dx < 0 ? -1 : 1, sy = dy < 0 ? -1 : 1, ad = Math.min(Math.abs(dx), Math.abs(dy));
      var c = Math.abs(dx) > Math.abs(dy) ? [b[0] - sx * ad, a[1]] : [a[0], b[1] - sy * ad];
      [a, c].forEach(function (p, k) { var q = k ? b : c, n = Math.max(1, Math.round(Math.max(Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1])))); for (var j = 0; j < n; j++) pts.push([p[0] + (q[0] - p[0]) * j / n, p[1] + (q[1] - p[1]) * j / n, i + (k ? .5 + .5 * j / n : .5 * j / n)]) });
    }
    pts.push([MAP_N[6][0], MAP_N[6][1], 6]); return pts;
  }
  ART.mapPoint = function (f) {
    if (!MAP) buildMap(); var P = MAP.path; f = Math.max(0, Math.min(6, f || 0));
    for (var i = 1; i < P.length; i++) if (P[i][2] >= f) { var a = P[i - 1], b = P[i], k = (f - a[2]) / Math.max(1e-6, b[2] - a[2]); return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k } }
    return { x: MAP_N[6][0], y: MAP_N[6][1] };
  };
  // un palazzo in 3/4: tetto chiaro, facciata sud scura con le finestre
  function box(g, x, y, w, d, h, roof, face, win, lit, R) {
    gr(g, x, y + d, w, h, face); gr(g, x, y, w, d, roof); gr(g, x, y, w, 1, 'c');
    for (var j = y + d + 1; j < y + d + h - 1; j += 2) for (var i = x + 1; i < x + w - 1; i += 2) gs(g, i, j, lit && R() < .5 ? win : 'k');
  }
  var DSTYLE = {
    tue: { gnd: '#121A2E', roof: '#33476E', face: '#18223C', acc: '#5FD3FF' },
    wed: { gnd: '#1A1428', roof: '#4A3A6A', face: '#241A38', acc: '#B99CFF' },
    thu: { gnd: '#151B12', roof: '#3A4A2A', face: '#1A2214', acc: '#C6EE48' },
    fri: { gnd: '#210F21', roof: '#5A2A52', face: '#2C1028', acc: '#FF86CF' },
    sat: { gnd: '#2D1A1B', roof: '#7A4434', face: '#3A201C', acc: '#FFC56A' },
    sun: { gnd: '#2C4430', roof: '#8A9088', face: '#4A524C', acc: '#F2CDBE' }
  };
  function district(i, lit) {
    var day = MAP_D[i], S = DSTYLE[day], g = grid(72, 52), R = rnd(500 + i * 7);
    // terreno del quartiere (piastra squadrata con gli angoli tagliati)
    gpoly(g, [[4, 10], [10, 4], [66, 4], [70, 8], [70, 46], [64, 50], [6, 50], [2, 46]], 'g');
    gr(g, 6, 27, 60, 2, 's'); gr(g, 34, 6, 2, 42, 's');
    if (day === 'sun') {
      gell(g, 50, 36, 9, 6, 'p'); gell(g, 50, 35, 7, 4, 'P');
      [[12, 14], [22, 10], [18, 22], [30, 18], [44, 14], [58, 18], [14, 38], [26, 42], [60, 30]].forEach(function (t) { gell(g, t[0], t[1] + 1, 4, 3.4, 'T'); gell(g, t[0], t[1], 4, 3.4, 't'); gs(g, t[0] - 1, t[1] - 2, 'u'); gs(g, t[0] - 2, t[1] - 1, 'u') });
      box(g, 40, 40, 10, 3, 4, 'r', 'f', 'w', lit, R);
    } else {
      var B = [[8, 8, 12, 5, 9], [24, 6, 8, 4, 14], [40, 8, 14, 5, 8], [56, 10, 10, 4, 12], [8, 32, 10, 4, 8], [22, 30, 10, 5, 11], [40, 32, 12, 4, 7], [56, 30, 10, 5, 10]];
      if (day === 'fri') B[5] = [20, 30, 0, 0, 0];
      B.forEach(function (b) { if (b[2]) box(g, b[0], b[1], b[2], b[3], b[4], 'r', 'f', 'w', lit, R) });
      if (day === 'fri') { gell(g, 26, 38, 7, 5, 'f'); gell(g, 26, 36, 7, 5, 'r'); gell(g, 25, 35, 4, 2.5, 'a'); gs(g, 23, 33, 'c') }
      if (day === 'thu') [[28, 2], [62, 6]].forEach(function (c) { gr(g, c[0], c[1], 3, 8, 'f'); gr(g, c[0], c[1], 3, 1, 'c') });
      if (day === 'sat') B.forEach(function (b) { if (b[2]) for (var k = 0; k < 7; k++) gr(g, b[0] + b[2] + k, b[1] + b[3] + k, 1, b[4] - 1, 'h') });
      if (day === 'tue') [[18, 26], [46, 28], [30, 48], [62, 48]].forEach(function (q) { gr(g, q[0], q[1], 3, 1, 'a') });
      if (day === 'wed') [[20, 26], [52, 26]].forEach(function (q) { gs(g, q[0], q[1], 'w'); gs(g, q[0], q[1] - 1, 'f') });
    }
    var pal = { g: S.gnd, s: mix(S.gnd, C.night, .4), r: S.roof, f: S.face, c: mix(S.roof, C.cream, .45), w: C.win2, k: mix(S.face, C.night, .4), a: S.acc, p: '#355E72', P: '#5E8AA0', t: '#4E7A44', T: '#2E4A2C', u: '#7AA860', h: mix(S.gnd, C.night, .55) };
    if (!lit) Object.keys(pal).forEach(function (k) { var c = rgb(pal[k]), l = (c[0] + c[1] + c[2]) / 3; pal[k] = mix(hx(l, l, l), C.night, .55) });
    return lightUp(can(g, pal), 'night', { top: 0, rim: false });
  }
  function monTower(lit) {
    var g = grid(48, 120), x0 = 12, w = 20, top = 34, bot = 112;
    // ombra rossa per terra
    gpoly(g, [[x0 - 6, bot + 4], [x0 + w + 14, bot + 4], [x0 + w + 8, bot - 2], [x0 - 2, bot - 2]], 'h');
    // fianco e facciata
    gpoly(g, [[x0 + w, top + 4], [x0 + w + 8, top], [x0 + w + 8, bot - 4], [x0 + w, bot]], 's');
    gr(g, x0, top + 4, w, bot - top - 4, 'f'); gr(g, x0, top + 4, w, 1, 'c');
    gpoly(g, [[x0, top + 4], [x0 + 8, top], [x0 + w + 8, top], [x0 + w, top + 4]], 'r');
    for (var y = top + 8; y < bot - 3; y += 4) for (var x = x0 + 2; x < x0 + w - 2; x += 3) gr(g, x, y, 2, 2, ((x * 7 + y * 3) % 5 === 0) ? 'R' : 'k');
    for (var y2 = top + 6; y2 < bot - 6; y2 += 4) gs(g, x0 + w + 3, y2 + 1, 'k');
    gr(g, x0 + 7, bot - 6, 6, 6, 'k');
    // il calendario cattivo in cima, sostenuto da due tralicci
    gr(g, x0 + 4, top - 6, 1, 6, 'm'); gr(g, x0 + w - 5, top - 6, 1, 6, 'm');
    gr(g, x0 - 3, top - 26, w + 6, 21, 'p'); gr(g, x0 - 3, top - 26, w + 6, 6, 'R'); gr(g, x0 - 3, top - 21, w + 6, 1, 'D');
    gr(g, x0 + 1, top - 17, 6, 4, 'e'); gr(g, x0 + w - 7, top - 17, 6, 4, 'e'); gr(g, x0 + 4, top - 16, 2, 2, 'R'); gr(g, x0 + w - 6, top - 16, 2, 2, 'R');
    gl(g, x0, top - 19, x0 + 6, top - 18, 'e'); gl(g, x0 + w - 1, top - 19, x0 + w - 7, top - 18, 'e');
    gr(g, x0 + 2, top - 11, w - 4, 3, 'e'); for (var t = x0 + 3; t < x0 + w - 3; t += 2) gs(g, t, top - 11, 'c');
    gs(g, x0 - 1, top - 28, 'm'); gs(g, x0 + 3, top - 28, 'm'); gs(g, x0 + w - 4, top - 28, 'm'); gs(g, x0 + w, top - 28, 'm'); gs(g, x0 - 1, top - 27, 'm'); gs(g, x0 + w, top - 27, 'm');
    gr(g, x0 + (w >> 1), top - 34, 1, 7, 'm');
    var pal = { h: '#2A0A0E', s: '#1A0709', f: '#26090D', r: '#3A0E13', c: '#7A1C25', k: '#140406', R: C.crim3, D: C.crim1, p: C.p0, e: C.ink, m: C.g3 };
    if (!lit) { pal.R = C.crim1; pal.p = C.p2 }
    return lightUp(can(g, pal), 'mon', { top: 0, rim: false });
  }
  var MINI = null;
  function buildMap() {
    var base = mk(W, H), b = base.g, R = rnd(909);
    // terreno notturno con gli isolati appena accennati
    b.fillStyle = '#080B12'; b.fillRect(0, 0, W, H);
    for (var y = 3; y < H; y += 10) for (var x = ((y / 10) & 1) * 6 - 4; x < W; x += 13) { b.fillStyle = R() < .5 ? '#0C111A' : '#0A0E16'; b.fillRect(x, y, 11, 8); if (R() < .25) { b.fillStyle = '#18202E'; b.fillRect(x + 1 + ((R() * 8) | 0), y + 1 + ((R() * 6) | 0), 1, 1) } }
    // il fiume (diagonale, riflessi crema)
    for (var i = 0; i < W; i++) { var ry = 40 + i * .18 + Math.sin(i / 37) * 10; b.fillStyle = '#0B1726'; b.fillRect(i, ry, 1, 12); b.fillStyle = '#10223A'; b.fillRect(i, ry + 3, 1, 5); if (R() < .05) { b.fillStyle = '#3A5078'; b.fillRect(i, ry + 4 + ((R() * 3) | 0), 2, 1) } }
    // la strada del viaggio
    var path = mapPath();
    path.forEach(function (p) { b.fillStyle = '#1C2230'; b.fillRect(Math.round(p[0]) - 3, Math.round(p[1]) - 3, 7, 7) });
    path.forEach(function (p) { b.fillStyle = '#262E3E'; b.fillRect(Math.round(p[0]) - 2, Math.round(p[1]) - 2, 5, 5) });
    MAP = { base: base.c, path: path, lit: [], dim: [], mon: [monTower(false), monTower(true)] };
    for (var d = 0; d < 6; d++) { MAP.lit[d] = district(d, true); MAP.dim[d] = district(d, false) }
    MINI = can(rows(['....o....', '...o1o...', '...o2o...', '..o121o..', '.o12w21o.', 'o1222221o', 'occ222cco', '.rd.r.dr.']), SHIP_PAL);
    // spunta e lucchetto
    MAP.check = can(rows(['ooooooooo', 'occcccccc', 'occcccckc', 'occccckcc', 'ockcckccc', 'occkkcccc', 'occckcccc', 'occcccccc', 'ooooooooo'].map(function (r) { return r.slice(0, 8) + 'o' })), { o: C.night, c: C.cream, k: C.ink });
    MAP.lock = can(rows(['.ooo.', 'o...o', 'ooooo', 'oosoo', 'ooooo']), { o: C.g3, s: C.g4 });
  }
  ART.map = function (ctx, t, s) {
    if (!MAP) buildMap(); s = s || {}; t = t || 0;
    var cur = s.current == null ? 0 : Math.min(6, s.current), done = s.done || [], unl = s.unlocked == null ? cur + 1 : s.unlocked;
    ctx.drawImage(MAP.base, 0, 0);
    // la strada: tratteggio crema fin dove si e' arrivati, grigio dopo
    var P = MAP.path, lim = Math.max(cur, unl - 1);
    for (var i = 0; i < P.length; i += 3) { var p = P[i], on = p[2] <= lim + .001; if (((i / 3) | 0) % 2) continue; ctx.fillStyle = on ? C.cream : '#3A4152'; ctx.fillRect(Math.round(p[0]), Math.round(p[1]), 1, 1) }
    // macchine sulla strada (fari crema, stop rossi), solo nel tratto aperto
    for (var c = 0; c < 6; c++) { var f = ((t * (.05 + c * .013) + c * .37) % 1) * Math.max(.5, lim), q = ART.mapPoint(f); ctx.fillStyle = c % 2 ? C.cream : C.crim3; ctx.fillRect(Math.round(q.x) + (c % 2 ? 1 : -2), Math.round(q.y) + 1, 1, 1) }
    // quartieri
    for (var d = 0; d < 6; d++) {
      var n = MAP_N[d], open = d < unl || done[d], img = open ? MAP.lit[d] : MAP.dim[d], ox = n[0] - 36, oy = n[1] - 50;
      ctx.drawImage(img, ox, oy); if (open) mapLife(ctx, d, ox, oy, t);
    }
    // la torre di MONDAY
    var mon = MAP_N[6], monOpen = unl >= 7 || cur >= 6, mt = MAP.mon[monOpen ? 1 : 0], mx = mon[0] - 22, my = mon[1] - 112;
    ctx.drawImage(mt, mx, my);
    if (((t * 1.5) % 1) < .5) { ctx.fillStyle = C.crim3; ctx.fillRect(mx + 22, my + 0, 1, 1); ctx.fillRect(mx + 21, my + 1, 3, 1) }
    if (monOpen && ((t * 3) % 1) < .5) { ctx.fillStyle = '#FF6A7A'; ctx.fillRect(mx + 16, my + 18, 2, 2); ctx.fillRect(mx + 26, my + 18, 2, 2) }
    // nodi: fatto = spunta crema, attuale = cornice pomodoro che pulsa, chiuso = lucchetto
    for (var k = 0; k < 7; k++) {
      var m = MAP_N[k], lbl = k === 6 ? 'MON' : MAP_D[k].toUpperCase(), isDone = !!done[k], isCur = k === cur, isOpen = k < unl || isDone || isCur;
      if (isDone) ctx.drawImage(MAP.check, m[0] - 4, m[1] - 4);
      else if (isCur) { var pz = s.pulse != null ? s.pulse : (Math.sin(t * 6) * .5 + .5), r = 5 + Math.round(pz * 2); ctx.fillStyle = C.tomato; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (v) { var cx = m[0] + v[0] * r, cy = m[1] + v[1] * r; ctx.fillRect(Math.min(cx, cx - v[0] * 2), cy, 3, 1); ctx.fillRect(cx, Math.min(cy, cy - v[1] * 2), 1, 3) }); ctx.fillRect(m[0], m[1], 1, 1) }
      else if (!isOpen) ctx.drawImage(MAP.lock, m[0] - 2, m[1] - 3);
      else { ctx.fillStyle = C.cream; ctx.fillRect(m[0] - 1, m[1] - 1, 3, 3) }
      if (s.labels !== false) { var tw = tinyWidth(lbl), lx = m[0] - (tw >> 1), ly = m[1] + 8; ctx.fillStyle = C.night; ctx.fillRect(lx - 2, ly - 1, tw + 4, 7); tiny(ctx, lbl, lx, ly, k === 6 ? C.crim3 : isOpen ? C.cream : C.g3) }
    }
    // la navetta che viaggia
    if (s.ship !== false) { var sp = ART.mapPoint(s.shipPos == null ? cur : s.shipPos), bob = Math.round(Math.sin(t * 5)); ctx.drawImage(MINI, Math.round(sp.x) - 4, Math.round(sp.y) - 16 + bob); ctx.fillStyle = ((t * 20) | 0) % 2 ? C.t4 : C.tomato; ctx.fillRect(Math.round(sp.x), Math.round(sp.y) - 8 + bob, 1, 1); ctx.fillStyle = 'rgba(15,15,14,.6)'; ctx.fillRect(Math.round(sp.x) - 3, Math.round(sp.y) - 2, 7, 1) }
  };
  // la vita di ogni quartiere (pochi pixel per frame)
  function mapLife(ctx, d, ox, oy, t) {
    var S = DSTYLE[MAP_D[d]];
    if (d === 0) { ctx.fillStyle = mix(S.acc, C.cream, .4); for (var i = 0; i < 14; i++) { var x = ox + 6 + hash(i * 7) * 60, y = oy + ((hash(i * 13) * 50 + t * 60) % 50); ctx.fillRect(Math.round(x - (y - oy) * .2), Math.round(y), 1, 2) } }
    else if (d === 1) { ctx.globalAlpha = .35; ctx.fillStyle = '#6E5A94'; for (var j = 0; j < 3; j++) { var fy = oy + 12 + j * 12, fx = ox + Math.sin(t * .6 + j) * 8; for (var k = 0; k < 64; k += 2) if (((k + j + ((t * 4) | 0)) & 3) === 0) ctx.fillRect(Math.round(fx + 4 + k), fy + (k & 1), 2, 1) } ctx.globalAlpha = 1 }
    else if (d === 2) { ctx.fillStyle = mix(S.acc, C.night, .3); [[29, 2], [63, 6]].forEach(function (c, i) { for (var k = 0; k < 4; k++) { var ph = (t * .8 + k * .25 + i * .5) % 1; ctx.globalAlpha = 1 - ph; ctx.fillRect(ox + c[0] + Math.round(Math.sin(ph * 6 + k) * 2), oy + c[1] - Math.round(ph * 10), 2, 2) } }); ctx.globalAlpha = 1; if (((t * 12) | 0) % 7 !== 0) { ctx.fillStyle = S.acc; ctx.fillRect(ox + 41, oy + 13, 6, 1) } }
    else if (d === 3) { var cols = [S.acc, C.cream, C.gd2, '#7FD8FF']; for (var l = 0; l < 6; l++) { ctx.fillStyle = cols[(l + ((t * 6) | 0)) & 3]; ctx.fillRect(ox + 20 + l * 2, oy + 32 + (l & 1), 1, 1) } ctx.globalAlpha = .25 + .2 * Math.sin(t * 8); ctx.fillStyle = S.acc; ctx.fillRect(ox + 16, oy + 28, 20, 14); ctx.globalAlpha = 1 }
    else if (d === 4) { ctx.globalAlpha = .18 + .08 * Math.sin(t * 2); ctx.fillStyle = S.acc; ctx.fillRect(ox + 4, oy + 4, 64, 3); ctx.globalAlpha = 1 }
    else if (d === 5) { ctx.fillStyle = C.ink; for (var bd = 0; bd < 3; bd++) { var bx = ox + ((t * 14 + bd * 23) % 80) - 4, by = oy + 8 + bd * 6 + Math.round(Math.sin(t * 3 + bd) * 2), wing = ((t * 8 + bd) | 0) % 2; ctx.fillRect(Math.round(bx), by, 1, 1); ctx.fillRect(Math.round(bx) - 1, by - wing, 1, 1); ctx.fillRect(Math.round(bx) + 1, by - wing, 1, 1) } }
  }

  // ======================================================================================
  // INTRO: testo che scorre in prospettiva sopra la citta' (alla Star Wars, ma nostro), piu' il cartello a macchina
  var CRAWL = { key: '', c: null, h: 0 };
  function crawlTex(lines) {
    var key = lines.join('|'); if (CRAWL.key === key) return CRAWL;
    var TW = 210, FS = 2, out = [];
    lines.forEach(function (ln, i) { var words = String(ln).split(' '), cur = ''; words.forEach(function (w) { var nx = cur ? cur + ' ' + w : w; if (textWidth(nx, 1) > TW && cur) { out.push(cur); cur = w } else cur = nx }); if (cur) out.push(cur); if (i < lines.length - 1) out.push('') });
    var h = (out.length * 11 + 4) * FS, s = mk(TW * FS, h);
    out.forEach(function (ln, i) { var x = Math.round((TW - textWidth(ln, 1)) / 2) * FS; ln.split(' ').forEach(function (w, j) { if (j) x += 4 * FS; var red = /MONDAY/.test(w); x += text(s.g, w, x, (i * 11 + 2) * FS, { color: red ? C.crim3 : C.cream, size: FS }) + FS }) });
    CRAWL = { key: key, c: s.c, h: h, w: TW * FS, f: FS }; return CRAWL;
  }
  ART.intro = function (ctx, t, lines, o) {
    o = o || {}; lines = lines || []; ART.sky(ctx, 'night', t); ART.skyline(ctx, 'night', t * 4, t);
    var first = o.first == null ? (lines.length > 1 ? lines[0] : '') : o.first, rest = o.first == null && lines.length > 1 ? lines.slice(1) : lines;
    var T0 = first ? 4.2 : 0, speed = o.speed || 9;
    if (first && t < T0) { // il cartello d'apertura: appare, resta, sparisce
      var a = Math.min(1, t / .8, (T0 - t) / .8); ART.city(ctx, null, t, 'night', 0); ctx.globalAlpha = Math.max(0, a); text(ctx, first, W / 2, 120, { align: 'c', color: '#7FD8FF' }); ctx.globalAlpha = 1; return t / (T0 + 1);
    }
    var tex = crawlTex(rest), sc = ((t - T0) * speed - 8) * tex.f, y0 = 30, y1 = CITY_TOP + 6, Dp = 70 * tex.f, cx = W / 2;
    for (var y = y0 + 12; y < y1; y++) {
      var k = (y - y0) / (y1 - y0), v = sc - Dp * (1 / k - 1); if (v < 0 || v >= tex.h) continue;
      var s2 = (.3 + 1.6 * k) / tex.f, dw = Math.round(tex.w * s2), al = Math.min(1, (k - .06) * 4); if (al <= 0) continue;
      ctx.globalAlpha = al; ctx.drawImage(tex.c, 0, v | 0, tex.w, 1, Math.round(cx - dw / 2), y, dw, 1);
    }
    ctx.globalAlpha = 1;
    ART.city(ctx, null, t, 'night', 0);
    var total = (tex.h + Dp * 2.2) / tex.f; return Math.min(1, (T0 + Math.max(0, sc / tex.f) / speed) / (T0 + total / speed));
  };
  // cartello a macchina da scrivere: le lettere escono una alla volta, cursore pomodoro
  ART.introCard = function (ctx, t, line, o) {
    o = o || {}; var size = o.size || 2, str = String(line), n = Math.floor(t * (o.cps || 26)), maxW = o.width || 420;
    var words = str.split(' '), L = [], cur = '';
    words.forEach(function (w) { var nx = cur ? cur + ' ' + w : w; if (textWidth(nx, size) > maxW && cur) { L.push(cur); cur = w } else cur = nx }); L.push(cur);
    var y = Math.round((o.y != null ? o.y : 135) - L.length * 10 * size / 2), left = n, cx = 0, cy = y;
    for (var i = 0; i < L.length; i++) {
      var ln = L[i], x = Math.round(W / 2 - textWidth(ln, size) / 2), part = ln.slice(0, Math.max(0, left));
      if (part) { var wpx = text(ctx, part, x, y + i * 10 * size, { size: size, color: o.color || C.cream, shadow: true }); cx = x + wpx + size; cy = y + i * 10 * size }
      else if (left >= 0 && i === 0) { cx = x; cy = y }
      left -= ln.length + 1; if (left < 0) break;
    }
    if (((t * 3) | 0) % 2 === 0 || n < str.length) { ctx.fillStyle = C.tomato; ctx.fillRect(cx, cy, 3 * size, 7 * size) }
    return n >= str.length;
  };


  // ======================================================================================
  // INTERFACCIA: cornice da disegno tecnico, barra, targhetta
  ART.frame = function (ctx, x, y, w, h, o) {
    o = o || {}; x = R0(x); y = R0(y); w = R0(w); h = R0(h); var col = o.color || C.cream;
    if (o.fill !== false) { ctx.fillStyle = o.fill || 'rgba(15,15,14,0.78)'; ctx.fillRect(x, y, w, h) }
    ctx.fillStyle = col; ctx.globalAlpha = .35; ctx.fillRect(x, y, w, 1); ctx.fillRect(x, y + h - 1, w, 1); ctx.fillRect(x, y, 1, h); ctx.fillRect(x + w - 1, y, 1, h); ctx.globalAlpha = 1;
    var L = o.corner || 4; [[x, y, 1, 1], [x + w - 1, y, -1, 1], [x, y + h - 1, 1, -1], [x + w - 1, y + h - 1, -1, -1]].forEach(function (c) { ctx.fillRect(c[2] > 0 ? c[0] : c[0] - L + 1, c[1], L, 1); ctx.fillRect(c[0], c[3] > 0 ? c[1] : c[1] - L + 1, 1, L) });
    if (o.label) { var tw = tinyWidth(o.label); ctx.fillStyle = C.night; ctx.fillRect(x + 6, y - 3, tw + 4, 7); tiny(ctx, o.label, x + 8, y - 2, col) }
  };
  ART.bar = function (ctx, x, y, w, k, o) {
    o = o || {}; x = R0(x); y = R0(y); w = R0(w); var h = o.h || 2, f = R0(w * Math.max(0, Math.min(1, k)));
    ctx.fillStyle = o.track || C.g4; ctx.fillRect(x, y, w, h); ctx.fillStyle = o.color || C.tomato; ctx.fillRect(x, y, f, h);
    if (f > 0 && f < w) { ctx.fillStyle = C.t4; ctx.fillRect(x + f - 1, y, 1, h) }
    ctx.fillStyle = C.cream; ctx.fillRect(x - 1, y - 1, 1, h + 2); ctx.fillRect(x + w, y - 1, 1, h + 2);
  };

  // ======================================================================================
  // ATTORI IN HD (giro 3): nave, nemici, boss, colpi, capsule, scoppi a densita' doppia. Le funzioni prendono
  // coordinate di GIOCO (480x270); la scala si legge dal canvas: largo >= 720 = attori a 2x (canvas 960x540).
  // Su un canvas 480 gli stessi sprite si disegnano dimezzati (ripiego).
  ART.hd = true;
  function SC(ctx) { if (ART.actorScale) return ART.actorScale; var c = ctx && ctx.canvas; return c && c.width >= 720 ? 2 : 1 }
  function putC(ctx, c, x, y, S, dx, dy) {
    if (S === 2) ctx.drawImage(c, Math.round(x * 2 - c.width / 2 + (dx || 0)), Math.round(y * 2 - c.height / 2 + (dy || 0)));
    else ctx.drawImage(c, Math.round(x - c.width / 4 + (dx || 0) / 2), Math.round(y - c.height / 4 + (dy || 0) / 2), c.width / 2, c.height / 2);
  }
  function up2(src) { var s = mk(src.width * 2, src.height * 2); s.g.drawImage(src, 0, 0, src.width * 2, src.height * 2); return s.c }
  // rilegge uno sprite: tono di contorno sottile (1px HD), luce della citta' sotto
  function relight2(src, day, o) { return lightUp(src, day, o || { top: .3 }) }

  // ---------- LA NAVE MOTHER MACHINE: la sagoma e' la m del logo vista da sopra. Tre gambe = tre gondole con il
  // propulsore pomodoro, gli archi della m restano vuoti tra le gambe, le due anse in alto sono le cabine di vetro.
  var M_SUB = M_PATH.split('Z').filter(function (p) { return p.trim() }).map(function (p) { return new Path2D(p.trim() + 'Z') });
  var SHIP_V = {
    a: { mw: 46, mh: 50, top: 7 },
    b: { mw: 40, mh: 46, top: 10, wings: 1, lance: 1 },
    c: { mw: 42, mh: 40, top: 14, wings: 2, prongs: 1 },
    d: { mw: 44, mh: 46, top: 10, wings: 3, spike: 1, taper: .62, glass: .34 },
    e: { mw: 46, mh: 44, top: 12, wings: 4, prongs: 1, taper: .7, glass: .3 }
  };
  ART.shipVariant = 'd';
  var SHP = { W: 64, H: 64 };
  var SHPAL = { o: C.night, '0': '#E4E7E4', '1': C.g1, '2': C.g2, '3': C.g3, '4': C.g4, c: C.cream, w: C.hot, n: '#0C1622', N: '#1C3448', g: '#9FD6E8', r: C.tomato, d: C.t1, D: C.t0, h: C.t3, H: C.t4, e: '#3A4A44' };
  function shipHD(vk, bank) {
    var V = SHIP_V[vk], W2 = SHP.W, H2 = SHP.H, Q = 4, big = mk(W2 * Q, H2 * Q), b = big.g, cx = W2 / 2, k = Math.abs(bank) * .12;
    var sx = V.mw / 680, sy = V.mh / 1468;
    function region(col, fn) {
      [-1, 1].forEach(function (side) {
        var s = ((bank > 0 && side > 0) || (bank < 0 && side < 0)) ? 1 - k : 1;
        b.save(); b.beginPath(); if (side < 0) b.rect(0, 0, cx * Q, H2 * Q); else b.rect(cx * Q, 0, (W2 - cx) * Q, H2 * Q); b.clip();
        b.setTransform(Q * s, 0, 0, Q, cx * Q * (1 - s), 0); b.fillStyle = col; fn(b); b.restore();
      });
    }
    function logo(bb, i) { bb.save(); bb.translate(cx - 340 * sx, V.top + 1468 * sy); bb.scale(sx, sy); bb.fill(M_SUB[i]); bb.restore() }
    function poly(bb, P) { bb.beginPath(); bb.moveTo(P[0][0], P[0][1]); for (var i = 1; i < P.length; i++) bb.lineTo(P[i][0], P[i][1]); bb.closePath(); bb.fill() }
    var L0 = cx - V.mw / 2, Y = function (f) { return V.top + V.mh * f };
    if (V.wings) region('#0000ff', function (bb) {
      var wl = V.wings === 1 ? [[L0 + 3, Y(.38)], [L0 - 11, Y(.78)], [L0 - 12, Y(.95)], [L0 - 6, Y(.92)], [L0 + 3, Y(.8)]] : V.wings === 2 ? [[L0 + 3, Y(.3)], [L0 - 9, Y(.62)], [L0 - 10, Y(.9)], [L0 + 3, Y(.75)]]
        : V.wings === 3 ? [[L0 + 4, Y(.42)], [L0 - 6, Y(.7)], [L0 - 13, Y(1.02)], [L0 - 9, Y(1.04)], [L0 - 3, Y(.92)], [L0 + 4, Y(.86)]] : [[L0 + 4, Y(.34)], [L0 - 12, Y(.86)], [L0 - 12, Y(1)], [L0 + 4, Y(.8)]];
      poly(bb, wl); poly(bb, wl.map(function (p) { return [W2 - p[0], p[1]] }));
    });
    region('#ff0000', function (bb) {
      logo(bb, 0);
      if (V.lance) poly(bb, [[cx, V.top - 9], [cx + 3.2, V.top + 6], [cx - 3.2, V.top + 6]]);
      if (V.spike) poly(bb, [[cx, V.top - 7], [cx + 4.5, V.top + 5], [cx - 4.5, V.top + 5]]);
      if (V.prongs) [192, 487].forEach(function (lx) { var px2 = cx + (lx - 340) * sx; poly(bb, [[px2, V.top - 8], [px2 + 8, V.top + 6], [px2 - 8, V.top + 6]]) });
    });
    region('#00ff00', function (bb) { logo(bb, 1); logo(bb, 2) });
    var D = b.getImageData(0, 0, W2 * Q, H2 * Q).data, g = grid(W2, H2), x, y;
    for (y = 0; y < H2; y++) for (x = 0; x < W2; x++) { var i = ((y * Q + 2) * W2 * Q + x * Q + 2) * 4; if (D[i + 3] < 128) continue; g.a[y][x] = D[i + 1] > 128 ? 'G' : D[i + 2] > 128 ? 'W' : 'M' }
    if (V.taper) { var gt = gclone(g); for (y = 0; y < H2; y++) { var fy = V.taper + (1 - V.taper) * Math.max(0, Math.min(1, (y - V.top + 4) / V.mh)); for (x = 0; x < W2; x++) { var sxx = Math.round(cx + (x + .5 - cx) / fy - .5); g.a[y][x] = gg(gt, sxx, y) } } }
    // gambe piu' piene: si allarga di 1px il corpo
    var g0 = gclone(g); for (y = 0; y < H2; y++) for (x = 0; x < W2; x++) if (g0.a[y][x] === '.' && (gg(g0, x - 1, y) === 'M' || gg(g0, x + 1, y) === 'M')) g.a[y][x] = 'M';
    // le anse: vetro nella parte alta, pannello incassato sotto (cosi' la m si legge anche a colori)
    var gTop = H2, gBot = 0; for (y = 0; y < H2; y++) for (x = 0; x < W2; x++) if (g.a[y][x] === 'G') { gTop = Math.min(gTop, y); gBot = Math.max(gBot, y) }
    var gCut = gTop + Math.round((gBot - gTop) * (V.glass || .5));
    var src = gclone(g), out = grid(W2, H2);
    function isB(v) { return v !== '.' }
    for (y = 0; y < H2; y++) for (x = 0; x < W2; x++) {
      var r = src.a[y][x]; if (r === '.') continue;
      var up = !isB(gg(src, x, y - 1)), dn = !isB(gg(src, x, y + 1)), c;
      if (r === 'G') {
        if (y > gCut) { c = y === gCut + 1 ? '2' : '4'; if (gg(src, x - 1, y) !== 'G' || gg(src, x + 1, y) !== 'G') c = '3'; if (y === gBot) c = '3' }
        else { var gx = x - (gg(src, x - 1, y) === 'G' ? 0 : 0); c = y - gTop < 3 ? 'N' : 'n'; }
      } else if (r === 'W') {
        c = up ? '0' : dn ? 'c' : '3';
        if (!up && !dn && gg(src, x, y - 2) === '.') c = '1';
        if (!up && !dn && gg(src, x, y - 3) === '.' && gg(src, x, y - 2) !== '.') c = '2';
      } else {
        var dl = 0, dr = 0; while (isB(gg(src, x - dl - 1, y)) && gg(src, x - dl - 1, y) === 'M' && dl < 30) dl++; while (gg(src, x + dr + 1, y) === 'M' && dr < 30) dr++;
        var tt = dl / (dl + dr + 1), TN = ['1', '0', '0', '1', '1', '2', '2', '3'];
        c = TN[Math.min(7, (tt * 8) | 0)];
        if (dl + dr > 18) c = (y % 6 === 0) ? '3' : '2';
        if (up) c = '0'; if (dn) c = 'c';
      }
      out.a[y][x] = c;
    }
    // riflesso sul vetro: diagonale crema in alto a sinistra di ogni cabina
    for (y = gTop; y <= gCut; y++) for (x = 0; x < W2; x++) if (src.a[y][x] === 'G' && src.a[y][x - 1] !== 'G' && y - gTop < 6) { gs(out, x + 1 + (y - gTop >> 1), y, 'g'); if (y - gTop < 3) gs(out, x + 2 + (y - gTop >> 1), y, 'g') }
    // cuciture orizzontali sulle gambe (machine)
    for (y = V.top + 10; y < H2; y += 11) for (x = 0; x < W2; x++) if (src.a[y][x] === 'M' && out.a[y][x] !== 'c' && out.a[y][x] !== '0') out.a[y][x] = out.a[y][x] === '0' ? '1' : '3';
    // propulsori: in fondo a ogni gamba un arco pomodoro (le tre gambe della m)
    var yb = 0; for (y = 0; y < H2; y++) for (x = 0; x < W2; x++) if (src.a[y][x] === 'M') yb = Math.max(yb, y);
    var eng = [], run = -1;
    for (x = 0; x <= W2; x++) { var on = x < W2 && src.a[yb][x] === 'M'; if (on && run < 0) run = x; if (!on && run >= 0) { eng.push([run, x - 1]); run = -1 } }
    eng.forEach(function (e) {
      var x0 = e[0], x1 = e[1];
      for (var xx = x0; xx <= x1; xx++) { out.a[yb - 1][xx] = '4'; out.a[yb][xx] = '3'; if (out.a[yb - 4][xx] !== 'o') out.a[yb - 4][xx] = xx === x0 || xx === x1 ? 'd' : 'r' }
      for (xx = x0; xx <= x1; xx++) { var edge = xx === x0 || xx === x1; gs(out, xx, yb + 1, edge ? 'd' : 'r'); gs(out, xx, yb + 2, edge ? 'r' : 'D'); gs(out, xx, yb + 3, edge ? 'D' : '.') }
      gs(out, x0, yb + 1, 'd'); gs(out, x1, yb + 1, 'd');
    });
    // sensore = hitbox (2x2 HD = 1px di gioco) a (x, y - 3)
    gr(out, cx - 2, H2 / 2 - 7, 4, 4, '4'); gr(out, cx - 1, H2 / 2 - 6, 2, 2, 'w');
    // emblema: la m crema sull'ala sinistra (o sulla gamba sinistra se non ci sono ali)
    var MM = ['.##.##.', '#..#..#', '#..#..#', '#######', '#..#..#', '#..#..#', '#..#..#'], ex0 = V.wings ? Math.round(L0 - (V.wings >= 3 ? 7 : 6)) : Math.round(L0 + 1), ey0 = V.wings ? Math.round(Y(V.wings >= 3 ? .74 : .7)) : Math.round(Y(.62));
    for (y = 0; y < 7; y++) for (x = 0; x < 7; x++) if (MM[y][x] === '#' && out.a[ey0 + y] && out.a[ey0 + y][ex0 + x] && out.a[ey0 + y][ex0 + x] !== '.' && out.a[ey0 + y][ex0 + x] !== 'o') out.a[ey0 + y][ex0 + x] = 'c';
    // contorno notte (non sotto: la luce viene dalla citta')
    var f2 = gclone(out); function Af(xx, yy) { var v = gg(f2, xx, yy); return v !== '.' && 'rdDhH'.indexOf(v) < 0 }
    for (y = 0; y < H2; y++) for (x = 0; x < W2; x++) if (f2.a[y][x] === '.' && !Af(x, y - 1) && (Af(x - 1, y) || Af(x + 1, y) || Af(x, y + 1))) out.a[y][x] = 'o';
    // luci di via: punta delle ali o cima delle gambe esterne
    var nav = []; [Math.round(V.wings ? L0 - 11 : L0 + 2), Math.round(V.wings ? W2 - L0 + 10 : W2 - L0 - 3)].forEach(function (nx) { for (var yy = 0; yy < H2; yy++) { var v = out.a[yy][nx]; if (v && v !== '.' && v !== 'o') { nav.push([nx, yy]); break } } });
    return { c: can(out, SHPAL), eng: eng.map(function (e) { return [e[0], e[1], yb] }), nav: nav };
  }
  var SHIPS = {}, SHIPSF = {};
  function shipSet(vk) { if (!SHIPS[vk]) { SHIPS[vk] = [-2, -1, 0, 1, 2].map(function (b) { return shipHD(vk, b) }); SHIPSF[vk] = SHIPS[vk].map(function (s) { return solid(s.c, C.cream) }) } return SHIPS[vk] }
  ART.ship = function (ctx, x, y, t, s) {
    s = s || {}; LASTX = x; LASTY = y; var S = SC(ctx), vk = s.variant || ART.shipVariant, set = shipSet(vk), bb = s.bank || 0, bi = Math.max(0, Math.min(4, Math.round(bb * 2) + 2)), I = set[bi];
    if (s.shield > 0) { shieldGrab(ctx, x, y, t); shieldGlass(ctx, x, y, t, s.shield, S) }
    putC(ctx, I.c, x, y, S);
    var ox = S === 2 ? Math.round(x * 2) - SHP.W / 2 : 0, oy = S === 2 ? Math.round(y * 2) - SHP.H / 2 : 0;
    // propulsori vivi: nucleo che pulsa e fiamma a pixel HD (la fiamma morbida e' sul FX)
    var th = s.thrust == null ? .5 : s.thrust, fr = (t * 24) | 0, auto = s.power === 'auto';
    for (var i = 0; i < I.eng.length; i++) {
      var e = I.eng[i], w = e[1] - e[0] - 1, ph = (fr + i * 2) % 6, L = 2 + Math.round(th * 4) + (auto ? 5 : 0) - ((fr + i) % 3 === 0 ? 1 : 0);
      for (var j = 0; j < L; j++) { var col = j < 1 ? (ph < 3 ? C.t4 : C.t3) : j < 3 ? C.tomato : j < 5 ? C.t1 : C.t0, ww = Math.max(1, w - (j > 3 ? 2 : 0)), xx = e[0] + 1 + ((w - ww) >> 1); if (j > 5 && (j + fr) % 2) continue; hdRect(ctx, S, ox, oy, xx, e[2] + 2 + j, ww, 1, col) }
    }
    var bl = ((t * 2.2) | 0) % 2, n = I.nav[bl]; if (n) hdRect(ctx, S, ox, oy, n[0], n[1], 1, 1, C.cream);
    if (s.flash) { ctx.globalAlpha = reduced ? .5 : 1; putC(ctx, SHIPSF[vk][bi], x, y, S); ctx.globalAlpha = 1 }
    if (s.power === 'ai') { var pc = (t * 4 | 0) % 2 ? '#7FD8FF' : C.hot; hdRect(ctx, S, ox, oy, SHP.W / 2 - 1, SHP.H / 2 - 6, 2, 2, pc) }
    if (s.shield > 0) shieldDraw(ctx, x, y, t, s.shield, S);
  };
  // rettangolo in pixel HD relativo allo sprite (su canvas 480 viene arrotondato)
  function hdRect(ctx, S, ox, oy, x, y, w, h, col) {
    ctx.fillStyle = col;
    if (S === 2) ctx.fillRect(ox + x, oy + y, w, h); else ctx.fillRect(Math.round(LASTX - SHP.W / 4 + x / 2), Math.round(LASTY - SHP.H / 4 + y / 2), Math.max(1, w >> 1), Math.max(1, h >> 1));
  }
  var LASTX = 0, LASTY = 0;
  // ---------- NEMICI HD: oggetti d'ufficio con la faccia. Materiali: carta (crema, ombra calda), plastica (lucida,
  // un punto di luce). a/A/B = accento del giorno (chiaro/scuro), k inchiostro, w bianco caldo.
  var EP2 = { '0': C.p0, '1': C.p1, '2': C.p2, '3': C.p3, k: C.ink, w: C.hot, a: '#FF00FF', A: '#AA00AA', B: '#FF80FF', s: '#C9C3B4', y: '#E9E3D3' };
  // occhio: sclera crema, pupilla che guarda giu' (verso la nave), luce, sopracciglio arrabbiato
  function eye2(g, cx, cy, side, o) {
    o = o || {}; var rx = o.rx || 3, ry = o.ry || 2.6;
    gell(g, cx, cy, rx + 1, ry + 1, 'k'); gell(g, cx, cy, rx, ry, o.blink ? 'k' : 'y');
    if (!o.blink) { gr(g, Math.round(cx - rx + .6), Math.round(cy - 1), 2, 3, 'k'); gs(g, Math.round(cx - rx + .6), Math.round(cy - 1), 'w') }
    else gr(g, Math.round(cx - rx), Math.round(cy), Math.round(rx * 2), 1, 'y');
    if (o.brow !== false) { var bw = rx * 2 + 3; for (var i = 0; i < bw; i++) { var bx = Math.round(cx - rx - 1.5 + i), t = side < 0 ? i / bw : 1 - i / bw, by = Math.round(cy - ry - 2 - (1 - t) * (o.anger || 2.5)); gs(g, bx, by, 'k'); gs(g, bx, by + 1, 'k') } }
  }
  // Missed call (44x36 HD = 22x18): telefono a disco di plastica; la cornetta salta, il disco e' la bocca che urla
  function hCall(f) {
    var g = grid(52, 40), o = [0, 2, 0, -2][f], lift = f % 2 ? 2 : 0, cx = 26 + o;
    // cornetta: impugnatura + due coppe
    gr(g, cx - 13, 6 - lift, 26, 4, '1'); gr(g, cx - 12, 5 - lift, 24, 1, '0'); gr(g, cx - 12, 9 - lift, 24, 1, '2');
    [-1, 1].forEach(function (sd) { var ex = cx + sd * 14; gell(g, ex, 10 - lift, 5.6, 4, '1'); gell(g, ex - 1, 8.8 - lift, 3.8, 2, '0'); gr(g, ex - 5, 12 - lift, 11, 2, '2'); gr(g, ex - 4, 13 - lift, 9, 1, '3') });
    // forcella sotto la cornetta
    gr(g, cx - 9, 13, 3, 3, '2'); gr(g, cx + 7, 13, 3, 3, '2');
    // corpo trapezio con gli angoli smussati
    gpoly(g, [[cx - 10, 15], [cx + 10, 15], [cx + 13, 18], [cx + 18, 36], [cx - 18, 36], [cx - 13, 18]], '1');
    gpoly(g, [[cx - 10, 15], [cx + 10, 15], [cx + 12, 17], [cx - 12, 17]], '0');
    for (var y = 18; y < 36; y++) { var xr = Math.round(cx + 13 + (y - 18) * 5 / 18); gs(g, xr, y, '2'); gs(g, xr - 1, y, '2') }
    gr(g, cx - 17, 34, 35, 2, '2'); gr(g, cx - 16, 36, 33, 1, '3');
    gs(g, cx - 8, 17, 'w'); gs(g, cx - 7, 17, 'w');
    // occhi arrabbiati
    eye2(g, cx - 7, 22, -1, { anger: 3 }); eye2(g, cx + 7, 22, 1, { anger: 3 });
    // il disco = bocca che urla: anello d'accento, fori, gola nera
    gell(g, cx, 29.5, 6.5, 5.2, 'A'); gell(g, cx, 29, 6, 4.8, 'a'); gell(g, cx, 29.5, 3.2, 2.6, 'k'); gr(g, cx - 2, 31, 4, 1, 'A');
    var rot = f % 2 ? .4 : 0; for (var k = 0; k < 8; k++) { var an = rot + k * Math.PI / 4.6 - .3; if (an > 3.4) continue; gs(g, Math.round(cx + Math.cos(an + Math.PI) * 4.6), Math.round(29.3 + Math.sin(an + Math.PI) * 3.6), 'B') }
    gs(g, cx - 1, 29, 'w');
    // squilli
    if (f % 2) [-1, 1].forEach(function (sd) { for (var r2 = 0; r2 < 2; r2++) for (var a2 = -5; a2 <= 5; a2++) gs(g, cx + sd * (21 + r2 * 3) + (a2 * a2 > 16 ? -sd : 0), 8 + a2 - lift, 'a') });
    return can(g, EP2);
  }
  // Paper invoice (34x40 = 17x20): foglio con angolo piegato e righe, muso scocciato, timbro DUE storto in accento
  function hInvoice(f) {
    var g = grid(40, 44), sw = [0, 1, 0, -1][f], X = function (y) { return Math.round(sw * (y - 22) / 9) };
    for (var y = 2; y < 42; y++) { gr(g, 5 + X(y), y, 30, 1, '0'); gs(g, 34 + X(y), y, '1'); gs(g, 33 + X(y), y, '1') }
    for (var y2 = 30; y2 < 42; y2++) for (var x2 = 5; x2 < 35; x2++) if (bay(x2, y2) < (y2 - 30) / 30) gs(g, x2 + X(y2), y2, '1');
    // angolo piegato
    var a0 = X(2); for (var q = 0; q < 7; q++) for (var r = 0; r <= q; r++) gs(g, 34 - r + a0, 2 + q - r - 0, '.');
    for (var q2 = 0; q2 < 7; q2++) for (var r2 = 0; r2 < 7 - q2; r2++) gs(g, 28 + q2 + a0, 2 + q2 + r2 - 0 + 0, r2 === 0 ? '2' : '1');
    for (var q3 = 0; q3 < 7; q3++) gs(g, 28 + q3 + a0, 9, '2');
    // intestazione e righe
    gr(g, 8 + X(5), 5, 14, 2, '2'); gr(g, 8 + X(8), 8, 9, 1, '2');
    [[27, 20], [30, 16]].forEach(function (l) { gr(g, 9 + X(l[0]), l[0], l[1], 1, 's') });
    // faccia
    var fx = X(16);
    eye2(g, 13 + fx, 16, -1, { rx: 2.6, ry: 2.2, anger: 2 }); eye2(g, 26 + fx, 16, 1, { rx: 2.6, ry: 2.2, anger: 2 });
    var mx = X(22); gr(g, 15 + mx, 22, 9, 2, 'k'); gs(g, 14 + mx, 23, 'k'); gs(g, 13 + mx, 24, 'k'); gs(g, 24 + mx, 23, 'k'); gs(g, 25 + mx, 24, 'k'); gr(g, 17 + mx, 24, 3, 1, 'a');
    // timbro DUE (accento, un po' storto)
    var sx = X(35) + 9, L = [['###.', '#..#', '#..#', '#..#', '###.'], ['#..#', '#..#', '#..#', '#..#', '.##.'], ['####', '#...', '###.', '#...', '####']];
    for (var x3 = 0; x3 < 23; x3++) { gs(g, sx + x3, 32 - (x3 >> 3), 'A'); gs(g, sx + x3, 40 - (x3 >> 3), 'A') }
    for (var y3 = 0; y3 < 9; y3++) { gs(g, sx, 32 + y3, 'A'); gs(g, sx + 22, 30 + y3, 'A') }
    for (var k = 0; k < 3; k++) for (var rr = 0; rr < 5; rr++) for (var c = 0; c < 4; c++) if (L[k][rr][c] === '#') gs(g, sx + 3 + k * 6 + c, 34 + rr - ((k * 6 + c + 3) >> 3), 'a');
    return can(g, EP2);
  }
  // Receipt (20x28 = 10x14): scontrino termico, fondo a zig-zag, faccina preoccupata
  function hReceipt(f) {
    var g = grid(24, 32);
    gr(g, 3, 2, 18, 24, '0'); for (var y = 2; y < 26; y++) { gs(g, 20, y, '1'); gs(g, 19, y, '1') }
    for (var x = 3; x < 21; x++) { var z = (x >> 1) % 2; gs(g, x, 26, '0'); if (z) gs(g, x, 27, '0') }
    eye2(g, 8, 8, -1, { rx: 2, ry: 2, anger: 1.5, blink: f === 1 }); eye2(g, 16, 8, 1, { rx: 2, ry: 2, anger: 1.5, blink: f === 1 });
    gr(g, 10, 13, 4, 1, 'k'); gs(g, 9, 14, 'k'); gs(g, 14, 14, 'k');
    gr(g, 6, 17, 12, 1, 's'); gr(g, 6, 19, 8, 1, 's'); gr(g, 6, 22, 5, 1, '2'); gr(g, 14, 22, 4, 1, 'a');
    return can(g, EP2);
  }
  // No-show (30x42 = 15x21): niente corpo, solo la linea tratteggiata che marcia, occhi vuoti, cartellino TABLE 4
  var NS2 = (function () { var g = grid(32, 46); gell(g, 16, 10, 7.5, 8, 'x'); gpoly(g, [[2, 44], [3, 31], [8, 24.5], [24, 24.5], [29, 31], [30, 44]], 'x'); gr(g, 13, 17, 6, 8, 'x'); var e = grid(32, 46); for (var y = 0; y < 46; y++) for (var x = 0; x < 32; x++) if (g.a[y][x] === 'x' && (gg(g, x - 1, y) !== 'x' || gg(g, x + 1, y) !== 'x' || gg(g, x, y - 1) !== 'x' || gg(g, x, y + 1) !== 'x')) e.a[y][x] = 'x'; return e })();
  function hNoshow(f, blink) {
    var g = grid(32, 46);
    for (var y = 0; y < 46; y++) for (var x = 0; x < 32; x++) if (NS2.a[y][x] === 'x' && (((x + y + f * 2) >> 2) & 1)) gs(g, x, y, '0');
    // occhi vuoti che brillano
    if (!blink) { gr(g, 12, 9, 2, 3, '0'); gr(g, 18, 9, 2, 3, '0') } else { gr(g, 12, 11, 2, 1, '0'); gr(g, 18, 11, 2, 1, '0') }
    // cartellino appeso con lo spago
    gl(g, 16, 25, 21, 29, '2'); gl(g, 16, 25, 11, 29, '2');
    gr(g, 7, 29, 19, 11, 'A'); gr(g, 8, 30, 17, 9, 'a'); gr(g, 8, 30, 17, 1, 'B'); gs(g, 9, 31, 'k');
    gtext(g, 'T4', 12, 32, 'k');
    return can(g, EP2);
  }
  // Spam (34x22 = 17x11): busta con le ali di carta che sbattono, occhi cattivi, !!! in accento
  function hSpam(f) {
    var g = grid(38, 26), up = f === 0;
    // ali di carta a tre penne, su e giu'
    [-1, 1].forEach(function (sd) { var X = function (x) { return sd < 0 ? x : 37 - x };
      var F = up ? [[[10, 9], [1, 1], [4, 0], [10, 7]], [[10, 11], [0, 5], [3, 4], [10, 9]], [[10, 13], [1, 9], [3, 8], [10, 11]]] : [[[10, 12], [1, 19], [4, 21], [10, 14]], [[10, 14], [0, 24], [3, 25], [10, 16]], [[10, 16], [3, 25], [6, 25], [11, 17]]];
      F.forEach(function (P, i) { gpoly(g, P.map(function (p) { return [X(p[0]), p[1]] }), i === 0 ? '0' : '1'); gl(g, X(P[0][0]), P[0][1], X(P[1][0] + 1), P[1][1] + (up ? 1 : -1), '2') }) });
    // busta
    gr(g, 9, 6, 20, 15, '0'); gr(g, 9, 19, 20, 2, '1'); gr(g, 28, 6, 1, 15, '1');
    gl(g, 9, 6, 18, 13, '2'); gl(g, 28, 6, 19, 13, '2'); gs(g, 18, 13, '2'); gs(g, 19, 13, '2');
    gr(g, 10, 6, 18, 1, '1');
    eye2(g, 14, 12, -1, { rx: 2, ry: 1.8, anger: 2.5 }); eye2(g, 24, 12, 1, { rx: 2, ry: 1.8, anger: 2.5 });
    [15, 19, 23].forEach(function (x) { gr(g, x, 15, 2, 3, 'a'); gr(g, x, 19, 2, 1, 'a') });
    return can(g, EP2);
  }
  // Double booking (32x30 = 16x15): biglietto del calendario, testata d'accento con gli anelli, denti stretti
  function hDouble(f) {
    var g = grid(34, 32);
    gr(g, 3, 6, 28, 24, '0'); for (var y = 6; y < 30; y++) { gs(g, 30, y, '1'); gs(g, 29, y, '1') } gr(g, 3, 28, 28, 2, '1');
    gr(g, 3, 6, 28, 7, 'a'); gr(g, 3, 6, 28, 1, 'B'); gr(g, 3, 12, 28, 1, 'A');
    [9, 24].forEach(function (x) { gr(g, x, 2, 2, 7, '3'); gr(g, x, 2, 1, 6, '2') });
    eye2(g, 11, 17, -1, { rx: 2.5, ry: 2.2, anger: 3, blink: f === 1 }); eye2(g, 23, 17, 1, { rx: 2.5, ry: 2.2, anger: 3, blink: f === 1 });
    gr(g, 9, 22, 16, 5, 'k'); for (var x = 10; x < 24; x += 3) { gr(g, x, 22, 2, 2, 'y'); gr(g, x + 1, 25, 2, 2, 'y') }
    return can(g, EP2);
  }
  // contorno notte tutto attorno (colpi e capsule)
  function outl(g, ch) { var g0 = gclone(g); for (var y = 0; y < g.h; y++) for (var x = 0; x < g.w; x++) if (g0.a[y][x] === '.' && (gg(g0, x - 1, y) !== '.' || gg(g0, x + 1, y) !== '.' || gg(g0, x, y - 1) !== '.' || gg(g0, x, y + 1) !== '.')) g.a[y][x] = ch || 'o'; return g }
  // ---------- COLPI NEMICI HD: diamanti e anelli, nucleo crema, anello d'accento, bordo notte. Mai pomodoro.
  function makeBullets2(day) {
    var d = D(day), sun = day === 'sun', pal = { o: sun ? C.ink : C.night, a: sun ? '#C2627A' : d[7], b: sun ? '#E8A0B0' : mix(d[7], C.cream, .5), c: sun ? C.ink : C.cream, w: sun ? C.ink : C.hot }, o = {};
    function dia(r, spark) { var n = r * 2 + 5, g = grid(n, n), m = r + 2; for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) { var q = Math.abs(x - m) + Math.abs(y - m); if (q <= r) gs(g, x, y, q === r ? 'a' : q === r - 1 ? 'b' : 'c') } if (spark) { for (var k = -r; k <= r; k++) { gs(g, m + k, m, 'w'); gs(g, m, m + k, 'w') } } return can(outl(g), pal) }
    o.diamond = [dia(3), dia(3), dia(3, 1)]; o.diamondBig = [dia(5), dia(5, 1), dia(5)];
    o.ring = [0, 1, 2].map(function (f) { var g = grid(15, 29), ry = 5 + f * 4, rx = 3 + f * 2; for (var a = 0; a <= 64; a++) { var th = Math.PI * a / 64 - Math.PI / 2, y = Math.round(14 + Math.sin(th) * ry), x = Math.round(12 - Math.cos(th) * rx); gs(g, x, y, 'c'); gs(g, x + 1, y, 'a') } return can(outl(g), pal) });
    o.shard = [0, 1, 2].map(function (f) { var g = grid(11, 11), P = [[[1, 2], [9, 4], [3, 9]], [[2, 1], [9, 8], [1, 7]], [[5, 1], [9, 9], [1, 6]]][f]; gpoly(g, P, 'c'); gs(g, P[0][0], P[0][1], 'b'); gl(g, P[0][0], P[0][1], P[1][0], P[1][1], 'a'); return can(outl(g), pal) });
    o.dot = [dia(2)];
    o.mail = [0, 1].map(function (f) { var g = grid(17, 13); gr(g, 2, 2, 13, 9, 'c'); gl(g, 2, 2, 8, 7, 'a'); gl(g, 14, 2, 8, 7, 'a'); if (f) { gr(g, 2, 2, 13, 1, 'b') } return can(outl(g), pal) });
    o.alarm = [0, 1].map(function (f) { var g = grid(15, 15), dx = f ? 1 : -1; gell(g, 7 + dx, 7, 5, 5.4, 'a'); gell(g, 7 + dx, 7.4, 4, 4.4, 'c'); gr(g, 1 + dx, 9, 13, 3, 'c'); gr(g, 1 + dx, 11, 13, 1, 'a'); gr(g, 6 + dx, 12, 3, 2, 'a'); gs(g, 5 + dx, 4, 'w'); return can(outl(g), pal) });
    return o;
  }
  // ---------- CAPSULE HD (32x36 = 16x18): pillola di vetro, icona grande che dice cosa fa
  var CAPK = { auto: { col: C.cream, name: 'AUTOMATION', line: 'TRIPLE SHOT' }, ai: { col: '#7FD8FF', name: 'AI AIM', line: 'SHOTS FIND THEM' }, booking: { col: C.skin, name: 'BOOKING', line: 'SHIELD UP' }, night: { col: '#8FB4FF', name: 'NIGHT SHIFT', line: 'PRESS X' }, coin: { col: C.gd2, name: 'BONUS', line: '+50 HOURS' } };
  ART.powerInfo = CAPK;
  function capIcon(k) {
    var g = grid(18, 18);
    if (k === 'auto') { // tre frecce a ventaglio = tre colpi
      function arrow(x0, y0, x1, y1) { gl(g, x0, y0, x1, y1, 'i'); gl(g, x0 + 1, y0, x1 + 1, y1, 'i'); var dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L; [[-uy, ux], [uy, -ux]].forEach(function (n) { gl(g, x1, y1, Math.round(x1 - ux * 4 + n[0] * 3), Math.round(y1 - uy * 4 + n[1] * 3), 'j'); gl(g, x1 + 1, y1, Math.round(x1 + 1 - ux * 4 + n[0] * 3), Math.round(y1 - uy * 4 + n[1] * 3), 'j') }) }
      arrow(8, 16, 8, 1); arrow(6, 16, 1, 5); arrow(10, 16, 15, 5);
    } else if (k === 'ai') { // occhio nel mirino
      [[1, 1, 1, 1], [16, 1, -1, 1], [1, 16, 1, -1], [16, 16, -1, -1]].forEach(function (c) { for (var i = 0; i < 4; i++) { gs(g, c[0] + c[2] * i, c[1], 'i'); gs(g, c[0], c[1] + c[3] * i, 'i') } });
      gpoly(g, [[3, 9], [9, 5], [15, 9], [9, 13]], 'i'); gpoly(g, [[5, 9], [9, 6.6], [13, 9], [9, 11.4]], 'k'); gell(g, 9, 9, 2.4, 2.4, 'j'); gr(g, 8, 8, 2, 2, 'k'); gs(g, 8, 8, 'w');
    } else if (k === 'booking') { // scudo con la spunta
      gpoly(g, [[2, 2], [16, 2], [16, 9], [9, 17], [2, 9]], 'i'); gpoly(g, [[4, 4], [14, 4], [14, 9], [9, 14.6], [4, 9]], 'k');
      for (var i = 0; i < 3; i++) { gs(g, 5 + i, 8 + i, 'j'); gs(g, 5 + i, 9 + i, 'j') } for (var j = 0; j < 5; j++) { gs(g, 8 + j, 10 - j, 'j'); gs(g, 8 + j, 11 - j, 'j') }
    } else if (k === 'night') { // luna e stelle
      gell(g, 8, 9, 7, 7, 'i'); gell(g, 11.5, 7, 6, 6.2, '.'); gs(g, 14, 3, 'j'); gs(g, 13, 4, 'j'); gs(g, 15, 4, 'j'); gs(g, 14, 5, 'j'); gs(g, 14, 4, 'w'); gs(g, 16, 10, 'j');
    }
    return g;
  }
  function buildCaps2() {
    Object.keys(CAPK).forEach(function (k) {
      if (k === 'coin') return;
      var col = CAPK[k].col;
      CAPS2[k] = [0, 1, 2, 3, 4, 5].map(function (f) {
        var g = grid(34, 38), ic = capIcon(k);
        grr(g, 1, 1, 32, 36, 11, 'o'); grr(g, 2, 2, 30, 34, 10, f === 0 ? 'R' : 'r'); grr(g, 4, 4, 26, 30, 8.5, 'b'); grr(g, 5, 5, 24, 13, 7, 'B');
        for (var y = 0; y < 18; y++) for (var x = 0; x < 18; x++) if (ic.a[y][x] !== '.') gs(g, 8 + x, 10 + y, ic.a[y][x]);
        gr(g, 9, 33, 16, 1, 'c'); gr(g, 8, 6, 9, 1, 'h'); gs(g, 7, 7, 'h'); gs(g, 6, 8, 'h');
        var gl2 = [[25, 9], [26, 12], [26, 16], [25, 22], [23, 27], [9, 28]][f]; gs(g, gl2[0], gl2[1], 'w'); gs(g, gl2[0], gl2[1] + 1, 'h');
        if (f < 3) gr(g, 15, 1, 4, 1, 't');
        return can(g, { o: C.night, r: col, R: mix(col, C.hot, .6), b: '#10141C', B: '#182030', i: col, j: mix(col, C.hot, .5), k: '#10141C', c: mix(col, C.cream, .5), h: '#F4F2EC88', w: C.hot, t: C.tomato });
      });
    });
    CAPS2.coin = [0, 1, 2, 3, 2, 1].map(function (f) {
      var w = [26, 19, 10, 4][f], g = grid(34, 38), cx = 17;
      gell(g, cx, 19, w / 2 + 1.2, 14, 'o'); gell(g, cx, 19, w / 2, 13, 'y'); if (w > 6) { gell(g, cx, 19, w / 2 - 2, 11, 'Y'); gell(g, cx - 1, 18, w / 2 - 3, 10, 'z') }
      if (w <= 4) gr(g, cx - 1, 6, 2, 26, 'y');
      if (w > 6) for (var y = 8; y < 14; y++) gs(g, cx - Math.round(w / 4) + (y - 8 >> 1), y, 'w');
      var s = can(g, { o: C.night, y: C.gd1, Y: C.gd2, z: C.gd2, w: C.gd3 }), sg = s.getContext('2d');
      if (w >= 19) { var mm = markCanvas(14, C.gd0); sg.drawImage(mm, 0, 0, mm.width, mm.height, cx - Math.round(mm.width * w / 52), 12, Math.max(2, Math.round(mm.width * w / 26)), 14) }
      return s;
    });
  }
  var CAPS2 = {};
  ART.powerup = function (ctx, kind, x, y, t) {
    var S = SC(ctx), set = CAPS2[kind] || CAPS2.auto, bob = Math.sin(t * 4) * 1.5, c = set[((t * (kind === 'coin' ? 10 : 6)) | 0) % set.length];
    putC(ctx, c, x, y + bob, S);
  };
  // l'etichetta che sale quando prendi un potenziamento: nome e riga, nel colore del servizio
  ART.powerLabel = function (ctx, kind, x, y, dt) {
    if (dt > 1.6) return false; var S = SC(ctx), I = CAPK[kind] || CAPK.auto, k = dt / 1.6, yy = y - 14 - k * 14, a = k < .7 ? 1 : 1 - (k - .7) / .3;
    ctx.save(); if (S === 2) ctx.scale(2, 2); ctx.globalAlpha = a;
    var w = Math.max(textWidth(I.name, 1), tinyWidth(I.line)) + 8, x0 = Math.round(x - w / 2), y0 = Math.round(yy);
    ctx.fillStyle = 'rgba(15,15,14,0.82)'; ctx.fillRect(x0, y0, w, 17); ctx.fillStyle = I.col; ctx.fillRect(x0, y0, w, 1); ctx.fillRect(x0, y0 + 16, 3, 1); ctx.fillRect(x0 + w - 3, y0 + 16, 3, 1);
    text(ctx, I.name, x, y0 + 3, { align: 'c', color: I.col }); tiny(ctx, I.line, Math.round(x - tinyWidth(I.line) / 2), y0 + 11, C.cream);
    ctx.restore(); return true;
  };
  // ---------- ICONE HUD HD (14x14 = 7x7)
  var IC2 = {};
  function buildIcons2() {
    function G() { return grid(14, 14) }
    function cup(g, empty) { gr(g, 1, 5, 9, 8, empty ? 's' : 'p'); gr(g, 1, 12, 9, 1, empty ? 's' : 'q'); if (!empty) { gr(g, 2, 5, 7, 2, 'b'); gr(g, 2, 5, 7, 1, 'B') } else gr(g, 2, 5, 7, 6, '.'); gr(g, 10, 7, 3, 1, empty ? 's' : 'p'); gr(g, 12, 7, 1, 4, empty ? 's' : 'p'); gr(g, 10, 10, 3, 1, empty ? 's' : 'p'); gs(g, 2, 7, empty ? '.' : 'w') }
    IC2.coffee = [0, 1, 2].map(function (f) { var g = G(); cup(g); [[3, 0], [6, 1]].forEach(function (p, i) { var o = (f + i) % 3 - 1; gs(g, p[0] + o, p[1], 'c'); gs(g, p[0] + o + 1, p[1] + 1, 'c'); gs(g, p[0] + o, p[1] + 2, 'c'); gs(g, p[0] + o + 1, p[1] + 3, 'c') }); return g });
    IC2.coffeeEmpty = [(function () { var g = G(); cup(g, true); return g })()];
    IC2.spill = [0, 1, 2].map(function (f) { var g = G(); if (f === 0) { gpoly(g, [[2, 6], [8, 3], [12, 9], [6, 12]], 'p'); gpoly(g, [[3, 6.5], [8, 4.2], [9, 6], [4, 8.6]], 'b'); gr(g, 11, 10, 2, 3, 'b') } else if (f === 1) { gr(g, 1, 6, 8, 7, 'p'); gr(g, 2, 7, 6, 5, '.'); gr(g, 8, 11, 6, 2, 'b'); gr(g, 9, 9, 2, 2, 'b') } else { gr(g, 1, 7, 7, 6, 's'); gr(g, 2, 8, 5, 4, '.'); gr(g, 0, 13, 14, 1, 'b'); gr(g, 9, 12, 4, 1, 'b') } return g });
    IC2.clock = [(function () { var g = G(); gell(g, 7, 7, 6.5, 6.5, 'p'); gell(g, 7, 7, 5.2, 5.2, 'k'); gr(g, 7, 3, 1, 4, 'p'); gr(g, 7, 7, 3, 1, 't'); gs(g, 7, 2, 'p'); return g })()];
    IC2.night = [(function () { var g = G(); gell(g, 6, 7, 6, 6, 'p'); gell(g, 9, 5.5, 5, 5.2, '.'); gs(g, 11, 2, 'w'); gs(g, 12, 9, 'p'); return g })()];
    ['auto', 'ai', 'booking'].forEach(function (k) { var g = G(), ic = capIcon(k); for (var y = 0; y < 14; y++) for (var x = 0; x < 14; x++) { var v = ic.a[Math.round(y * 17 / 13)][Math.round(x * 17 / 13)]; if (v === 'i' || v === 'j' || v === 'w') gs(g, x, y, 'p') } IC2[k] = [g] });
    IC2.coin = [(function () { var g = G(); gell(g, 7, 7, 6.5, 6.5, 'y'); gell(g, 7, 7, 5, 5, 'Y'); gr(g, 4, 5, 6, 1, 'w'); gr(g, 4, 5, 1, 5, 'w'); gr(g, 7, 5, 1, 5, 'w'); gr(g, 9, 5, 1, 5, 'w'); return g })()];
    var pal = { p: C.cream, q: C.p2, b: '#6E4A2E', B: '#A0704A', c: C.p2, s: C.g3, k: C.night, t: C.tomato, w: C.hot, y: C.gd1, Y: C.gd2 };
    Object.keys(IC2).forEach(function (k) { IC2[k] = IC2[k].map(function (g) { return can(g, pal) }) });
  }
  ART.icon = function (ctx, name, x, y, k) {
    var S = SC(ctx), set = name === 'coffeeSpill' ? IC2.spill : IC2[name]; if (!set) return;
    var c = set[Math.max(0, (k | 0)) % set.length];
    if (S === 2) ctx.drawImage(c, Math.round(x * 2), Math.round(y * 2)); else ctx.drawImage(c, Math.round(x), Math.round(y), 7, 7);
  };
  // ---------- SCOPPI HD: scintille nei colori del nemico, cadono e diventano crema; carta che svolazza
  ART.explosion = function (ctx, x, y, t0, t, kind) {
    var dt = t - t0, S = SC(ctx); if (dt < 0) return true;
    if (kind === 'impact') { if (dt > .07) return false; var ix = Math.round(x * S), iy = Math.round(y * S); ctx.fillStyle = C.tomato; ctx.fillRect(ix - 2 * S, iy, S, S); ctx.fillRect(ix + 2 * S, iy, S, S); ctx.fillRect(ix, iy - 2 * S, S, S); ctx.fillStyle = C.hot; ctx.fillRect(ix - (S >> 1), iy - (S >> 1), S, S); return true }
    var big = kind === 'boss' || kind === 'player', life = big ? 1.5 : .8; if (dt > life) return false;
    var cols = EXCOL[kind] || EXCOL.paper, n = big ? 44 : 16, seed = ((x * 73 + y * 151 + t0 * 1000) | 0);
    if (dt < .09 && !reduced) { var r = Math.round((4 + dt * 120) * S / 2), cx = Math.round(x * S), cy = Math.round(y * S); ctx.fillStyle = dt < .04 ? C.hot : C.cream; for (var a = 0; a < 16; a++) { var th = a * Math.PI / 8; ctx.fillRect(cx + Math.round(Math.cos(th) * r), cy + Math.round(Math.sin(th) * r), 1, 1) } }
    for (var i = 0; i < n; i++) {
      var h1 = hash(seed + i * 17), h2 = hash(seed + i * 31), h3 = hash(seed + i * 47), my = life * (.45 + .55 * h3); if (dt > my) continue;
      var ang = h1 * Math.PI * 2, sp = (big ? 40 : 28) + h2 * (big ? 80 : 40), px0 = x + Math.cos(ang) * sp * dt, py0 = y + (Math.sin(ang) * sp - 22) * dt + 95 * dt * dt, k = dt / my;
      var paper = i % 4 === 0 && kind !== 'player' && kind !== 'gold';
      ctx.fillStyle = k > .72 ? C.cream : cols[i % cols.length];
      if (paper) { var fl = ((dt * 14 + i) | 0) % 3; ctx.fillRect(Math.round(px0 * S), Math.round(py0 * S), [3, 2, 1][fl] * (S === 2 ? 1 : 1), S === 2 ? 2 : 1) }
      else { var sz = S === 2 ? (k < .35 && i % 3 === 0 ? 2 : 1) : 1; ctx.fillRect(Math.round(px0 * S), Math.round(py0 * S), sz, sz) }
    }
    return true;
  };
  // ---------- disegno degli attori (HD)
  ART.enemy = function (ctx, type, x, y, t, s) {
    s = s || {}; var S = SC(ctx), SPd = SP[ART.day] || daySprites(ART.day), gold = type === 'gold', base = gold ? (s.base || 'call') : type;
    var set = (gold ? SPd.gold : SPd.e)[base]; if (!set) return;
    var fps = { call: 12, invoice: 3, receipt: 2, noshow: 5, spam: 9, double: 3 }[base] || 6;
    var f = ((t * fps + (s.phase || 0) * 3.7) | 0) % set.length, c = set[f];
    if (s.dead) { putC(ctx, SPd.line[base][f], x, y, S); return }
    if (base === 'noshow' && s.fade) { if (s.fade >= .95) return; var k = Math.min(2, (s.fade * 4 | 0) - 1); c = k < 0 ? c : SPd.fade.noshow[f][k] }
    putC(ctx, c, x, y, S);
    if (gold) { var sf = ((t * 8) | 0) % 16; if (sf < 8) putC(ctx, SPd.shine[base][sf], x, y, S) }
    if (s.hit > 0) { if (reduced) putC(ctx, SPd.line[base][f], x, y, S); else { ctx.globalAlpha = Math.min(1, s.hit); putC(ctx, SPd.flash[base][f], x, y, S); ctx.globalAlpha = 1 } }
  };
  ART.cable = function (ctx, x1, y1, x2, y2, t) {
    var S = SC(ctx), acc = D(ART.day)[7], n = Math.max(2, Math.round((Math.abs(x2 - x1) + Math.abs(y2 - y1)) * S)), p = (t * 1.4) % 1;
    ctx.fillStyle = mix(acc, C.night, .45);
    for (var i = 0; i <= n; i++) { var k = i / n, sag = Math.sin(k * Math.PI) * 3; ctx.fillRect(Math.round((x1 + (x2 - x1) * k) * S), Math.round((y1 + (y2 - y1) * k + sag) * S), 1, S) }
    ctx.fillStyle = acc; for (var j = 0; j < 3; j++) { var k2 = (p + j / 3) % 1, sag2 = Math.sin(k2 * Math.PI) * 3; ctx.fillRect(Math.round((x1 + (x2 - x1) * k2) * S) - (S >> 1), Math.round((y1 + (y2 - y1) * k2 + sag2) * S) - (S >> 1), S + 1, S + 1) }
  };
  ART.reticle = function (ctx, x, y, t) {
    var S = SC(ctx), r = (7 + Math.sin(t * 6)) * S, x0 = Math.round(x * S), y0 = Math.round(y * S), L = 3 * S; ctx.fillStyle = '#7FD8FF';
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) { var cx = Math.round(x0 + q[0] * r), cy = Math.round(y0 + q[1] * r); ctx.fillRect(q[0] > 0 ? cx - L + 1 : cx, cy, L, 1); ctx.fillRect(cx, q[1] > 0 ? cy - L + 1 : cy, 1, L) });
    ctx.fillRect(x0, y0, 1, 1); var a = t * 3; ctx.fillRect(Math.round(x0 + Math.cos(a) * r * .5), Math.round(y0 + Math.sin(a) * r * .5), 1, 1);
  };
  var URG2 = [], URGF2 = [], MON2 = {}, MONF2 = {}, BELLS2 = [], PAGE2 = null;
  function mondayHD(k) { if (!MON2[k]) { var p = k.split(''); monday(+p[0], +p[1], +p[2], +p[3]); MON2[k] = lightUp(up2(MON[k]), 'mon', { top: .25 }); MONF2[k] = solid(MON2[k], C.cream) } return k }
  ART.boss = function (ctx, name, x, y, t, s) {
    s = s || {}; var S = SC(ctx), hit = s.hit > 0, shake = (s.rage || 0) > 0 && !reduced ? Math.round(Math.sin(t * 50) * (s.rage * 2)) : 0;
    if (name === 'urgent') {
      var m = Math.max(0, Math.min(2, Math.round((s.mouth || 0) * 2))), beat = (t * 2.4 % 1) < .25 ? 1 : 0, i = m * 2 + beat;
      putC(ctx, URG2[i], x + shake, y, S); if (hit) { ctx.globalAlpha = reduced ? .4 : Math.min(1, s.hit); putC(ctx, URGF2[i], x + shake, y, S); ctx.globalAlpha = 1 }
      return;
    }
    var ph = Math.max(1, Math.min(3, s.phase || 1)), mo = Math.max(0, Math.min(2, Math.round((s.mouth || 0) * 2))), bl = (t % 3.2) < .12 ? 1 : 0;
    var k = mondayHD(ph + '' + mo + bl + Math.min(s.pagesTorn || 0, 4)), mc = MON2[k], hh = mc.height / 4;
    if (ph === 3) putC(ctx, BELLS2[((t * 16) | 0) % 2], x + shake, y - hh - 4, S);
    putC(ctx, mc, x + shake, y, S);
    if (s.hp != null) { var bw = mc.width / 2 - 40, bx = Math.round((x - bw / 2) * S), by = Math.round((y + hh + 4) * S); ctx.fillStyle = C.g4; ctx.fillRect(bx, by, bw * S, 2 * S); ctx.fillStyle = C.crim3; ctx.fillRect(bx, by, Math.round(bw * S * Math.max(0, s.hp)), 2 * S) }
    if (hit) { ctx.globalAlpha = reduced ? .4 : Math.min(1, s.hit); putC(ctx, MONF2[k], x + shake, y, S); ctx.globalAlpha = 1 }
  };
  ART.page = function (ctx, x, y, t, k) {
    if (!PAGE2) { PAGE2 = [0, 1, 2].map(function (f) { var w = [14, 9, 3][f], g = grid(16, 12); var o = (16 - w) >> 1; gr(g, o, 1, w, 10, '0'); gr(g, o, 1, w, 3, 'r'); if (w > 4) { gr(g, o + 2, 6, w - 4, 1, '2'); gr(g, o + 2, 8, w - 5, 1, '2') } for (var x2 = o; x2 < o + w; x2 += 2) gs(g, x2, 0, 'r'); return lightUp(pad(up2(can(g, MPAL)), 2), 'mon', { top: 0 }) }) }
    var S = SC(ctx), f = (((t * 9) | 0) + (k || 0)) % 4; f = f === 3 ? 1 : f; putC(ctx, PAGE2[f], x, y, S);
  };
  ART.bullet = function (ctx, kind, x, y, t, a) {
    var S = SC(ctx);
    if (kind === 'player') { // lineetta pomodoro HD: testa bianco caldo, corpo pomodoro
      var px0 = Math.round(x * S), py0 = Math.round(y * S);
      if (!ART.side) { if (S === 2) { ctx.fillStyle = C.hot; ctx.fillRect(px0, py0 - 4, 2, 2); ctx.fillStyle = C.tomato; ctx.fillRect(px0, py0 - 2, 2, 5); ctx.fillStyle = C.t1; ctx.fillRect(px0, py0 + 3, 2, 2) } else ctx.drawImage(PSHOT, px0, py0 - 2); return }
      // di lato: lineetta orizzontale, testa a destra
      if (S === 2) { ctx.fillStyle = C.t0; ctx.fillRect(px0 - 9, py0, 1, 2); ctx.fillStyle = C.t1; ctx.fillRect(px0 - 8, py0, 2, 2); ctx.fillStyle = C.tomato; ctx.fillRect(px0 - 6, py0, 5, 2); ctx.fillStyle = C.t4; ctx.fillRect(px0 - 1, py0, 1, 2); ctx.fillStyle = C.hot; ctx.fillRect(px0, py0, 2, 2) }
      else { ctx.fillStyle = C.tomato; ctx.fillRect(px0 - 4, py0, 4, 1); ctx.fillStyle = C.hot; ctx.fillRect(px0, py0, 1, 1) }
      return;
    }
    if (kind === 'block') { ART.meeting(ctx, x - 20, y - 6, 40, 12, t, 'MEETING'); return }
    var SPd = SP[ART.day] || daySprites(ART.day), set = SPd.bul[kind] || SPd.bul.diamond, c = set[((t * 10) | 0) % set.length];
    putC(ctx, c, x, y, S);
  };
  var MEET_SAVE = ART.meeting;
  ART.meeting = function (ctx, x, y, w, h, t, label) {
    var S = SC(ctx); if (S === 1) return MEET_SAVE(ctx, x, y, w, h, t, label);
    ctx.save(); ctx.scale(2, 2); MEET_SAVE(ctx, x, y, w, h, t, label); ctx.restore();
    // dettaglio HD: la riga dell'ora e il bordo luminoso
    ctx.fillStyle = 'rgba(244,242,236,0.25)'; ctx.fillRect(Math.round(x * 2) + 4, Math.round(y * 2) + 1, Math.round(w * 2) - 6, 1);
  };
  // ---------- lo scudo Booking in HD: copia sfocata ferma dello sfondo (ART.bgCanvas, se c'e'), cerchio, bordo sottile
  var SH = null, shN = 0, SHR = 21;
  function shieldGrab(ctx, x, y, t) {
    if (!SH) { SH = { small: mk(11, 11), a: mk(88, 88), out: mk(88, 88) }; SH.small.g.imageSmoothingEnabled = true; SH.a.g.imageSmoothingEnabled = true }
    if ((shN++ & 3) !== 0) return;
    var src = ART.bgCanvas || ctx.canvas, ss = src.width / W;
    try {
      SH.small.g.clearRect(0, 0, 11, 11); SH.small.g.drawImage(src, (x - 22) * ss, (y - 22) * ss, 44 * ss, 44 * ss, 0, 0, 11, 11);
      var a = SH.a.g; a.clearRect(0, 0, 88, 88); a.drawImage(SH.small.c, 0, 0, 11, 11, 0, 0, 88, 88);
      a.globalCompositeOperation = 'source-atop'; a.fillStyle = 'rgba(242,205,190,0.12)'; a.fillRect(0, 0, 88, 88); a.globalCompositeOperation = 'source-over';
      var o = SH.out.g; o.clearRect(0, 0, 88, 88); o.save(); o.beginPath(); o.arc(44, 44, SHR * 2, 0, Math.PI * 2); o.clip(); o.drawImage(SH.a.c, 2, 1); o.restore();
    } catch (e) {}
  }
  var RIM2 = null;
  function shieldDraw(ctx, x, y, t, k, S) {
    if (!SH) return; S = S || SC(ctx);
    if (!RIM2) RIM2 = [0, 1, 2].map(function (f) { var g = grid(88, 88), R2 = SHR * 2 - .5; for (var a = 0; a < 720; a++) { var th = a * Math.PI / 360, x2 = Math.round(44 + Math.cos(th) * R2 - .5), y2 = Math.round(44 + Math.sin(th) * R2 - .5), deg = a / 2, arc = deg > 195 + f * 4 && deg < 255 + f * 4; gs(g, x2, y2, arc ? 'h' : (deg > 20 && deg < 160 ? 'c' : 's')) } for (var a2 = 205 + f * 4; a2 < 245 + f * 4; a2++) { var t2 = a2 * Math.PI / 180; gs(g, Math.round(44 + Math.cos(t2) * (R2 - 4)), Math.round(44 + Math.sin(t2) * (R2 - 4)), 'q') } gs(g, 20 + f, 22, 'h'); gs(g, 21 + f, 22, 'h'); gs(g, 20 + f, 23, 'h'); return can(g, { h: C.cream, c: '#F4F2EC99', s: '#F2CDBE66', q: '#F4F2EC55' }) });
    var flick = k < .34 && ((t * 12) | 0) % 3 === 0; ctx.globalAlpha = flick ? .4 : 1; putC(ctx, RIM2[((t * 3) | 0) % 3], x, y, S); ctx.globalAlpha = 1;
  }
  function shieldGlass(ctx, x, y, t, k, S) { if (!SH) return; var flick = k < .34 && ((t * 12) | 0) % 3 === 0; ctx.globalAlpha = flick ? .3 : .6 + .4 * k; putC(ctx, SH.out.c, x, y, S || SC(ctx)); ctx.globalAlpha = 1 }
  ART.shipFx = function (ctx, x, y, t, s) {
    s = s || {}; var th = s.thrust == null ? .5 : s.thrust, len = (.6 + th) * (s.power === 'auto' ? 2 : 1), f = GLOWS.flame[2];
    var set = shipSet(s.variant || ART.shipVariant), bb = s.bank || 0, I = set[Math.max(0, Math.min(4, Math.round(bb * 2) + 2))];
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < I.eng.length; i++) { var e = I.eng[i], ex = ((e[0] + e[1]) / 2 + .5 - SHP.W / 2) / 2, ey = (e[2] - SHP.H / 2) / 2 + 1, fl = .8 + .2 * Math.sin(t * 40 + i * 2.1), h = f.gh * len * fl, w = f.gw * .9; ctx.globalAlpha = .9; ctx.drawImage(f, x + ex - w / 2, y + ey, w, h) }
    var g = GLOWS.ship[1]; ctx.globalAlpha = .6; ctx.drawImage(g, x - g.gw / 2, y - g.gh / 2, g.gw, g.gh);
    ctx.restore();
  };
  ART.hitbox = { dx: 0, dy: -3 };

  // ======================================================================================
  // MAPPA v3: diorama isometrico della citta' di notte, in HD (960x540). Una lastra sospesa nel buio, il fiume,
  // la strada con le scie delle macchine, sei quartieri-scena e la torre di MONDAY con le nuvole rosse e i fulmini.
  // Tutto pre-cotto; ogni frame solo pochi pixel animati.
  var MW = 960, MH = 540, MOX = 480, MOY = 46;
  function P3(wx, wy, z) { return [MOX + (wx - wy) * 2, MOY + (wx + wy) - (z || 0)] }
  function u32(h, a) { var c = rgb(h); return ((a == null ? 255 : a) << 24) | (c[2] << 16) | (c[1] << 8) | c[0] }
  function Buf(w, h, bx, by) { return { w: w, h: h, bx: bx || 0, by: by || 0, d: new Uint32Array(w * h) } }
  function bpx(B, x, y, c) { x = Math.round(x) - B.bx; y = Math.round(y) - B.by; if (x >= 0 && y >= 0 && x < B.w && y < B.h) B.d[y * B.w + x] = c }
  function bpoly(B, P, c) {
    var y0 = 1e9, y1 = -1e9, x0 = 1e9, x1 = -1e9, i, j; for (i = 0; i < P.length; i++) { y0 = Math.min(y0, P[i][1]); y1 = Math.max(y1, P[i][1]); x0 = Math.min(x0, P[i][0]); x1 = Math.max(x1, P[i][0]) }
    y0 = Math.max(B.by, Math.floor(y0)); y1 = Math.min(B.by + B.h - 1, Math.ceil(y1));
    for (var y = y0; y <= y1; y++) { var py = y + .5, xs = []; for (i = 0, j = P.length - 1; i < P.length; j = i++) { var a = P[i], b = P[j]; if ((a[1] > py) !== (b[1] > py)) xs.push((b[0] - a[0]) * (py - a[1]) / (b[1] - a[1]) + a[0]) } xs.sort(function (p, q) { return p - q }); for (var k = 0; k + 1 < xs.length; k += 2) { var xa = Math.max(B.bx, Math.ceil(xs[k] - .5)), xb = Math.min(B.bx + B.w - 1, Math.floor(xs[k + 1] - .5)); for (var x = xa; x <= xb; x++) B.d[(y - B.by) * B.w + (x - B.bx)] = c } }
  }
  function bline(B, x0, y0, x1, y1, c) { x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1); var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy; for (var n = 0; n < 4000; n++) { bpx(B, x0, y0, c); if (x0 === x1 && y0 === y1) break; var e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx } if (e2 <= dx) { e += dx; y0 += sy } } }
  function bcan(B) { var s = mk(B.w, B.h), id = s.g.createImageData(B.w, B.h); new Uint32Array(id.data.buffer).set(B.d); s.g.putImageData(id, 0, 0); return s.c }
  function quad(wx, wy, w, d, z) { return [P3(wx, wy, z), P3(wx + w, wy, z), P3(wx + w, wy + d, z), P3(wx, wy + d, z)] }
  // un palazzo isometrico: tetto, facciata sinistra (sud-ovest) e destra (sud-est), finestre, bordo del tetto
  function ibox(B, wx, wy, w, d, h, T, R) {
    var top = u32(T.top), lf = u32(T.left), rf = u32(T.right), edge = u32(T.edge || mix(T.top, C.cream, .35));
    bpoly(B, [P3(wx, wy + d, 0), P3(wx + w, wy + d, 0), P3(wx + w, wy + d, h), P3(wx, wy + d, h)], lf);
    bpoly(B, [P3(wx + w, wy, 0), P3(wx + w, wy + d, 0), P3(wx + w, wy + d, h), P3(wx + w, wy, h)], rf);
    bpoly(B, quad(wx, wy, w, d, h), top);
    var a = P3(wx, wy + d, h), b = P3(wx + w, wy + d, h), c = P3(wx + w, wy, h); bline(B, a[0], a[1], b[0], b[1], edge); bline(B, b[0], b[1], c[0], c[1], edge);
    var win = T.win, lit = T.lit == null ? .45 : T.lit;
    if (win) for (var z = 4; z < h - 2; z += 4) {
      for (var i = 1.5; i < w - 1; i += 2.5) { var p = P3(wx + i, wy + d, z), on = R() < lit; bpx(B, p[0], p[1], u32(on ? (R() < .8 ? win : C.win2) : T.dark)); bpx(B, p[0] + 1, p[1], u32(on ? win : T.dark)) }
      for (var j = 1.5; j < d - 1; j += 2.5) { var q = P3(wx + w, wy + j, z), on2 = R() < lit * .7; bpx(B, q[0], q[1], u32(on2 ? win : T.dark)); bpx(B, q[0] + 1, q[1] + 1, u32(on2 ? win : T.dark)) }
    }
  }
  function itree(B, wx, wy, r, h, cols) { var p = P3(wx, wy, 0); bpoly(B, [[p[0] - 1, p[1]], [p[0] + 1, p[1]], [p[0] + 1, p[1] - h], [p[0] - 1, p[1] - h]], u32('#2A2018')); for (var y = -r; y <= r; y++) for (var x = -r * 1.4; x <= r * 1.4; x++) { var dd = (x / 1.4) * (x / 1.4) + y * y; if (dd <= r * r) bpx(B, p[0] + x, p[1] - h - r + y, u32(dd < r * r * .35 && x < 0 && y < 0 ? cols[2] : x + y > r * .3 ? cols[0] : cols[1])) } }
  // i quartieri: posizione nel mondo, stile, contenuto
  var DIST = [
    { day: 'tue', w: [196, 196], top: '#1C2A44', side: '#0E1626', T: { top: '#3A5078', left: '#1A2440', right: '#121A2E', win: '#F4F2EC', dark: '#0C1220' } },
    { day: 'wed', w: [116, 196], top: '#251C38', side: '#130E20', T: { top: '#5A4880', left: '#2C2142', right: '#1D152E', win: '#F2CDBE', dark: '#120D1C' } },
    { day: 'thu', w: [116, 116], top: '#1A2414', side: '#0C1209', T: { top: '#3C4A2A', left: '#1E2816', right: '#151B10', win: '#C6EE48', dark: '#0A0D08', lit: .3 } },
    { day: 'fri', w: [196, 116], top: '#2C1430', side: '#160A18', T: { top: '#6A2E62', left: '#3A1838', right: '#271329', win: '#FFD6EC', dark: '#140A14' } },
    { day: 'sat', w: [196, 40], top: '#3A2420', side: '#1E1210', T: { top: '#B5713E', left: '#3A201C', right: '#7A4434', win: '#FFE0A0', dark: '#1E1210' } },
    { day: 'sun', w: [116, 40], top: '#2E4A30', side: '#16241A', T: { top: '#9AA29C', left: '#5A625C', right: '#4A524C', win: '#F4F2EC', dark: '#2A2D2C', lit: .15 } }
  ];
  var MONW = [40, 40];
  var MAP3 = null;
  function mapRoad() { // la strada: tratti lungo gli assi del mondo tra un quartiere e l'altro, fino alla torre
    var N = DIST.map(function (d) { return d.w }).concat([MONW]), pts = [];
    for (var i = 0; i < N.length - 1; i++) { var a = N[i], b = N[i + 1], c = i % 2 ? [a[0], b[1]] : [b[0], a[1]];
      [[a, c], [c, b]].forEach(function (s2, k) { var n = Math.max(1, Math.round(Math.abs(s2[1][0] - s2[0][0]) + Math.abs(s2[1][1] - s2[0][1]))); for (var j = 0; j < n; j++) { var f = j / n; pts.push([s2[0][0] + (s2[1][0] - s2[0][0]) * f, s2[0][1] + (s2[1][1] - s2[0][1]) * f, i + (k ? .5 + .5 * f : .5 * f)]) } }) }
    pts.push([N[6][0], N[6][1], 6]); return pts;
  }
  function riverY(wx) { return 157 + Math.sin(wx / 30) * 4 }
  function buildMap3() {
    var B = Buf(MW, MH), R = rnd(4242), x, y;
    // cielo: notte con le stelle, sfumato a bande
    var sky = [rgb('#05070F'), rgb('#0A1022'), rgb('#101A36')];
    for (y = 0; y < MH; y++) for (x = 0; x < MW; x++) { var f = y / MH, k = Math.min(2, Math.floor(f * 3 + bay(x, y) * .9)); B.d[y * MW + x] = (255 << 24) | (sky[k][2] << 16) | (sky[k][1] << 8) | sky[k][0] }
    for (var s = 0; s < 220; s++) { var sx = (R() * MW) | 0, sy = (R() * MH) | 0; bpx(B, sx, sy, u32(R() < .2 ? C.cream : '#3A4A6A')) }
    // la lastra: spessore e bordo
    var S0 = 232, top = quad(0, 0, S0, S0, 0);
    bpoly(B, [P3(0, S0, 0), P3(S0, S0, 0), P3(S0, S0, -16), P3(0, S0, -16)], u32('#0A0D14'));
    bpoly(B, [P3(S0, 0, 0), P3(S0, S0, 0), P3(S0, S0, -16), P3(S0, 0, -16)], u32('#070910'));
    bpoly(B, top, u32('#0E131D'));
    // isolati scuri sulla lastra (griglia di vie)
    for (var gx = 4; gx < S0 - 8; gx += 16) for (var gy = 4; gy < S0 - 8; gy += 16) { bpoly(B, quad(gx, gy, 12, 12, 0), u32(R() < .5 ? '#121826' : '#101521')); if (R() < .35) { var lp = P3(gx + R() * 12, gy + R() * 12, 0); bpx(B, lp[0], lp[1], u32('#2A3550')) } }
    // bordo luminoso della lastra (crema tenue, la luce della citta')
    var e1 = P3(0, S0, 0), e2 = P3(S0, S0, 0), e3 = P3(S0, 0, 0); bline(B, e1[0], e1[1], e2[0], e2[1], u32('#3A4152')); bline(B, e2[0], e2[1], e3[0], e3[1], u32('#2A3040'));
    // isolati di contorno: palazzi bassi scuri nelle zone libere (la citta' continua)
    var gen = [];
    for (var gx2 = 6; gx2 < S0 - 10; gx2 += 13) for (var gy2 = 6; gy2 < S0 - 10; gy2 += 13) {
      var free = true; DIST.forEach(function (D1) { if (Math.abs(D1.w[0] - gx2 - 5) < 36 && Math.abs(D1.w[1] - gy2 - 5) < 36) free = false }); if (Math.abs(MONW[0] - gx2 - 5) < 22 && Math.abs(MONW[1] - gy2 - 5) < 22) free = false;
      if (Math.abs(riverY(gx2 + 5) - gy2 - 5) < 13) free = false; if (free && R() < .7) gen.push([gx2 + R() * 2, gy2 + R() * 2, 7 + R() * 3, 7 + R() * 3, 4 + R() * 16]);
    }
    gen.sort(function (a, b) { return a[0] + a[1] - b[0] - b[1] }).forEach(function (q) { ibox(B, q[0], q[1], q[2], q[3], q[4], { top: '#1C2232', left: '#121724', right: '#0D111B', edge: '#2A3246', win: '#EAD9B8', dark: '#0A0D14', lit: .12 }, R) });
    // il fiume
    var water = [];
    for (var wx = 0; wx < S0; wx += .5) { var c0 = riverY(wx); for (var wy = c0 - 7; wy <= c0 + 7; wy += .5) { var p = P3(wx, wy, 0), edge = Math.abs(wy - c0) > 6; bpx(B, p[0], p[1], u32(edge ? '#1A2A44' : (bay(p[0] | 0, p[1] | 0) < .2 ? '#13233C' : '#0C1A2E'))); if (!edge && R() < .015) water.push([Math.round(p[0]), Math.round(p[1])]) } }
    // la strada
    // viali: due lungo wx, uno lungo wy (le macchine ci corrono sopra)
    var streets = [[[156, 4], [156, S0 - 4]], [[78, 4], [78, S0 - 4]], [[4, 78], [S0 - 4, 78]]], lanes = [];
    streets.forEach(function (st) { var a = st[0], b = st[1], n = Math.round(Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1])), lane = []; for (var j = 0; j <= n; j++) { var wx2 = a[0] + (b[0] - a[0]) * j / n, wy2 = a[1] + (b[1] - a[1]) * j / n; bpoly(B, quad(wx2 - 2.5, wy2 - 2.5, 5, 5, 0), u32('#1A202C')); lane.push(P3(wx2, wy2, 0)) } lanes.push(lane) });
    lanes.forEach(function (lane) { lane.forEach(function (p, j) { if (j % 6 < 2) bpx(B, p[0], p[1], u32('#3A4152')) }) });
    // la rotta della nave: archi nel cielo tra i quartieri (si vola, non si guida)
    var nodesW = DIST.map(function (d) { return [d.w[0], d.w[1], 26] }).concat([[MONW[0] + 12, MONW[1] + 12, 60]]), route = [];
    for (var ni = 0; ni < 6; ni++) { var A0 = P3(nodesW[ni][0], nodesW[ni][1], nodesW[ni][2]), B0 = P3(nodesW[ni + 1][0], nodesW[ni + 1][1], nodesW[ni + 1][2]), n2 = 80; for (var j2 = 0; j2 < n2; j2++) { var f2 = j2 / n2; route.push([A0[0] + (B0[0] - A0[0]) * f2, A0[1] + (B0[1] - A0[1]) * f2 - Math.sin(f2 * Math.PI) * 52, ni + f2]) } }
    var last = P3(nodesW[6][0], nodesW[6][1], nodesW[6][2]); route.push([last[0], last[1], 6]);
    MAP3 = { base: bcan(B), water: water, road: route, lanes: lanes, nodesW: nodesW, dist: [], dim: [], fx: [] };
    // quartieri
    DIST.forEach(function (D0, i) { var r = district3(D0, i); MAP3.dist[i] = r; MAP3.dim[i] = dimCanvas(r.c) });
    MAP3.mon = monTower3();
    MAP3.mini = null;
  }
  function dimCanvas(c) { var s = mk(c.width, c.height); s.g.drawImage(c, 0, 0); var id = s.g.getImageData(0, 0, c.width, c.height), d = id.data; for (var i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; var l = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11); d[i] = l * .32 + 6; d[i + 1] = l * .34 + 8; d[i + 2] = l * .4 + 14 } s.g.putImageData(id, 0, 0); return s.c }
  function district3(D0, i) {
    var cx = D0.w[0], cy = D0.w[1], hs = 28, R = rnd(900 + i * 31), T = D0.T;
    var bx = Math.floor(P3(cx - hs, cy + hs, 0)[0]) - 6, by = Math.floor(P3(cx - hs, cy - hs, 80)[1]) - 6, bw = (hs * 8) + 14, bh = Math.ceil(P3(cx + hs, cy + hs, -4)[1]) - by + 4;
    var B = Buf(bw, bh, bx, by), fx = [];
    // piattaforma del quartiere (alta 3)
    bpoly(B, [P3(cx - hs, cy + hs, 0), P3(cx + hs, cy + hs, 0), P3(cx + hs, cy + hs, -3), P3(cx - hs, cy + hs, -3)], u32(D0.side));
    bpoly(B, [P3(cx + hs, cy - hs, 0), P3(cx + hs, cy + hs, 0), P3(cx + hs, cy + hs, -3), P3(cx + hs, cy - hs, -3)], u32(mix(D0.side, C.night, .3)));
    bpoly(B, quad(cx - hs, cy - hs, hs * 2, hs * 2, 0), u32(D0.top));
    var e1 = P3(cx - hs, cy + hs, 0), e2 = P3(cx + hs, cy + hs, 0), e3 = P3(cx + hs, cy - hs, 0); bline(B, e1[0], e1[1], e2[0], e2[1], u32(mix(D0.top, C.cream, .3))); bline(B, e2[0], e2[1], e3[0], e3[1], u32(mix(D0.top, C.cream, .2)));
    // vie interne
    bpoly(B, quad(cx - hs, cy - 1.5, hs * 2, 3, 0), u32(mix(D0.top, C.night, .4))); bpoly(B, quad(cx - 1.5, cy - hs, 3, hs * 2, 0), u32(mix(D0.top, C.night, .4)));
    var objs = [];
    function box(wx, wy, w, d, h, T2) { objs.push({ k: wx + wy + w + d, f: function () { ibox(B, wx, wy, w, d, h, T2 || T, R) } }) }
    function tree(wx, wy, r, h) { objs.push({ k: wx + wy + 1, f: function () { itree(B, wx, wy, r, h, ['#2E4A2C', '#4E7A44', '#8AA870']) } }) }
    var q = [[-25, -25], [4, -25], [-25, 4], [4, 4]];
    if (D0.day === 'sun') {
      // parco: alberi, stagno, panchine, due casette
      var pond = []; for (var a2 = 0; a2 < 6.28; a2 += .3) pond.push(P3(cx + 10 + Math.cos(a2) * 10, cy + 10 + Math.sin(a2) * 8, 0)); bpoly(B, pond, u32('#355E72')); var pp = P3(cx + 6, cy + 7, 0); bpx(B, pp[0], pp[1], u32('#9ED8E6')); bpx(B, pp[0] + 4, pp[1] + 2, u32('#9ED8E6'));
      [[-22, -22], [-12, -24], [-24, -10], [-14, -12], [14, -22], [22, -12], [-22, 16], [-10, 22], [20, 22], [24, 4], [-4, -22], [-24, 2]].forEach(function (t2) { tree(cx + t2[0], cy + t2[1], 4 + R() * 3, 4 + R() * 3) });
      box(cx + 6, cy - 20, 8, 7, 8); box(cx - 20, cy + 4, 7, 8, 7); for (var bn = 0; bn < 3; bn++) { var bp = P3(cx - 6 + bn * 4, cy + 2, 0); objs.push({ k: 0, f: (function (bp) { return function () { bline(B, bp[0], bp[1], bp[0] + 4, bp[1] + 2, u32('#6E4A2E')) } })(bp) }) }
      fx.push({ k: 'birds', p: P3(cx, cy, 30) });
    } else {
      var hmax = { tue: 34, wed: 26, thu: 30, fri: 22, sat: 28 }[D0.day];
      q.forEach(function (o, j) { for (var m = 0; m < 4; m++) { var w = 7 + R() * 4, d = 7 + R() * 4, h = 8 + R() * hmax * (j === 0 ? 1.5 : 1), ox = cx + o[0] + (m % 2) * 11 + R() * 1.5, oy = cy + o[1] + (m > 1 ? 11 : 0) + R() * 1.5; if (D0.day === 'fri' && j === 3) continue; if (R() < .15) continue; box(ox, oy, w, d, h) } });
      if (D0.day === 'fri') { // il club: cupola rosa con le luci
        objs.push({ k: cx + cy + 30, f: function () { var p = P3(cx + 11, cy + 11, 0); for (var y = -12; y <= 0; y++) for (var x = -16; x <= 16; x++) { var dd = (x / 16) * (x / 16) + (y / 12) * (y / 12); if (dd <= 1) bpx(B, p[0] + x, p[1] + y - 4, u32(dd < .3 && x < 0 ? '#FF86CF' : x > 6 ? '#3A1838' : '#6A2E62')) } bpoly(B, [[p[0] - 16, p[1] - 4], [p[0] + 16, p[1] - 4], [p[0] + 16, p[1]], [p[0] - 16, p[1]]], u32('#271329')) } });
        fx.push({ k: 'lasers', p: P3(cx + 11, cy + 11, 16) }); fx.push({ k: 'party', p: P3(cx + 11, cy + 11, 4) });
      }
      if (D0.day === 'thu') { fx.push({ k: 'steam', p: P3(cx - 2, cy + 6, 0) }); fx.push({ k: 'steam', p: P3(cx + 14, cy - 4, 0) }); fx.push({ k: 'sign', p: P3(cx - 14, cy + 9, 14) }) }
      if (D0.day === 'tue') { fx.push({ k: 'rain', p: P3(cx, cy, 0), r: hs }); for (var u = 0; u < 7; u++) { var pu = P3(cx - hs + 4 + R() * (hs * 2 - 8), cy - 1 + R() * 2, 0); objs.push({ k: 999, f: (function (pu, cc) { return function () { bpx(B, pu[0], pu[1] - 3, u32(cc)); bpx(B, pu[0] - 1, pu[1] - 2, u32(cc)); bpx(B, pu[0] + 1, pu[1] - 2, u32(cc)); bpx(B, pu[0], pu[1] - 1, u32('#2A2D2C')) } })(pu, [C.cream, '#5FD3FF', '#C2627A', '#FFC56A'][u & 3]) }) } }
      if (D0.day === 'wed') { [[-6, -2], [6, 2], [-2, 10], [2, -12]].forEach(function (l) { objs.push({ k: cx + cy + l[0] + l[1] + 2, f: function () { var p = P3(cx + l[0], cy + l[1], 0); bline(B, p[0], p[1], p[0], p[1] - 9, u32('#3A3A38')); bpx(B, p[0], p[1] - 10, u32(C.cream)); bpx(B, p[0] + 1, p[1] - 10, u32(C.cream)) } }); fx.push({ k: 'lamp', p: P3(cx + l[0], cy + l[1], 10) }) }); fx.push({ k: 'fog', p: P3(cx, cy, 0), r: hs }) }
      if (D0.day === 'sat') { // ombre lunghe verso nord-est
        objs.unshift({ k: -1, f: function () { for (var s2 = 0; s2 < 6; s2++) { var o = q[s2 % 4]; bpoly(B, quad(cx + o[0] + 6, cy + o[1] - 12, 6, 12, 0), u32(mix(D0.top, C.night, .45))) } } });
        fx.push({ k: 'glow', p: P3(cx, cy, 20) });
      }
    }
    objs.sort(function (a, b) { return a.k - b.k }).forEach(function (o) { o.f() });
    var lp = P3(cx, cy + hs, 0);
    return { c: bcan(B), x: bx, y: by, fx: fx, node: [P3(cx + hs - 4, cy + hs - 4, 0)[0], P3(cx + hs - 4, cy + hs - 4, 0)[1] + 2], center: P3(cx, cy, 0) };
  }
  // la torre di MONDAY: grattacielo nero e cremisi, la faccia del calendario in cima, il faro rosso
  function monTower3() {
    var cx = MONW[0], cy = MONW[1], w = 20, d = 20, h = 90, bx = Math.floor(P3(cx - w / 2, cy + d / 2, 0)[0]) - 30, by = Math.floor(P3(cx - w / 2, cy - d / 2, h + 40)[1]), bw = w * 4 + 60, bh = Math.ceil(P3(cx + w / 2, cy + d / 2, -4)[1]) - by + 4;
    var B = Buf(bw, bh, bx, by), R = rnd(66), x0 = cx - w / 2, y0 = cy - d / 2;
    // basamento rosso a terra
    bpoly(B, quad(x0 - 6, y0 - 6, w + 12, d + 12, 0), u32('#26090D'));
    ibox(B, x0, y0, w, d, h, { top: '#3A0E13', left: '#1A0709', right: '#100406', edge: '#7A1C25', win: C.crim3, dark: '#0A0203', lit: .22 }, R);
    // spigolo cremisi acceso
    var a = P3(x0 + w, y0 + d, 0), b = P3(x0 + w, y0 + d, h); bline(B, a[0], a[1], b[0], b[1], u32('#7A1C25'));
    // la faccia del calendario sulla facciata sinistra in alto
    var f0 = P3(x0 + 2, y0 + d, h - 4), FW2 = 28, FH = 26;
    for (var yy = 0; yy < FH; yy++) for (var xx = 0; xx < FW2; xx++) { var px2 = f0[0] + xx, py2 = f0[1] + Math.round(xx / 2) + yy; var c = yy < 7 ? C.crim3 : C.p0; if (yy === 7) c = C.crim1; bpx(B, px2, py2, u32(c)) }
    function F(xx, yy, c) { bpx(B, f0[0] + xx, f0[1] + Math.round(xx / 2) + yy, u32(c)) }
    for (var e = 0; e < 2; e++) for (var yy2 = 11; yy2 < 15; yy2++) for (var xx2 = 0; xx2 < 7; xx2++) F(4 + e * 13 + xx2, yy2, C.ink);
    F(7, 13, C.crim3); F(8, 13, C.crim3); F(20, 13, C.crim3); F(21, 13, C.crim3);
    for (var xx3 = 3; xx3 < 10; xx3++) F(xx3, 10 - Math.round((xx3 - 3) * .3), C.ink); for (var xx4 = 17; xx4 < 25; xx4++) F(xx4, 8 + Math.round((xx4 - 17) * .3), C.ink);
    for (var xx5 = 5; xx5 < 24; xx5++) { F(xx5, 19, C.ink); F(xx5, 20, C.ink); if (xx5 % 2) F(xx5, 19, C.cream) }
    for (var xx6 = 3; xx6 < 25; xx6 += 4) F(xx6, 2, C.cream);
    // antenna
    var t0 = P3(cx, cy, h); bline(B, t0[0], t0[1], t0[0], t0[1] - 22, u32(C.g3)); bline(B, t0[0] - 3, t0[1] - 8, t0[0] + 3, t0[1] - 8, u32(C.g3));
    return { c: bcan(B), x: bx, y: by, beacon: [t0[0], t0[1] - 23], eyes: [[f0[0] + 7, f0[1] + 16], [f0[0] + 20, f0[1] + 23]], top: [t0[0], t0[1] - 10], node: P3(cx + w / 2 + 4, cy + d / 2 + 4, 0) };
  }
  ART.mapNode = function (i) { if (!MAP3) buildMap3(); i = Math.max(0, Math.min(6, Math.round(i))); var w = MAP3.nodesW[i], n = P3(w[0], w[1], w[2]); return { x: n[0] / 2, y: n[1] / 2 } };
  ART.mapPoint = function (f) {
    if (!MAP3) buildMap3(); var P = MAP3.road; f = Math.max(0, Math.min(6, f || 0));
    for (var i = 1; i < P.length; i++) if (P[i][2] >= f) { var a = P[i - 1], b = P[i], k = (f - a[2]) / Math.max(1e-6, b[2] - a[2]); return { x: (a[0] + (b[0] - a[0]) * k) / 2, y: (a[1] + (b[1] - a[1]) * k) / 2 } }
    var e = P[P.length - 1]; return { x: e[0] / 2, y: e[1] / 2 };
  };
  var FULLN = { tue: 'TUESDAY', wed: 'WEDNESDAY', thu: 'THURSDAY', fri: 'FRIDAY', sat: 'SATURDAY', sun: 'SUNDAY', mon: 'MONDAY', night: 'NIGHT SHIFT' };
  ART.dayName = function (d) { return FULLN[d] || String(d).toUpperCase() };
  var CHK = [[3, 7], [4, 8], [5, 9], [6, 10], [7, 9], [8, 8], [9, 7], [10, 6], [11, 5]], CORN = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  ART.map = function (ctx, t, s) {
    if (!MAP3) buildMap3(); s = s || {}; t = t || 0;
    var S = SC(ctx), cur = s.current == null ? 0 : Math.min(6, s.current), done = s.done || [], unl = s.unlocked == null ? cur + 1 : s.unlocked;
    ctx.save(); if (S === 1) ctx.scale(.5, .5);
    ctx.drawImage(MAP3.base, 0, 0);
    // riflessi nel fiume
    var W2 = MAP3.water; for (var i = 0; i < W2.length; i++) { var ph = (t * .7 + hash(i * 7)) % 1; if (ph < .5) { ctx.fillStyle = ph < .15 ? '#9ED8E6' : '#3A5078'; ctx.fillRect(W2[i][0], W2[i][1], 2, 1) } }
    var P = MAP3.road, lim = Math.max(cur, unl - 1);
    // scie delle macchine sui viali (fari crema, stop rossi)
    for (var c = 0; c < 12; c++) { var Ln = MAP3.lanes[c % 3], dir = (c >> 1) % 2, sp = .02 + (c % 5) * .006, f = (t * sp + c * .173) % 1, idx = Math.floor((dir ? f : 1 - f) * (Ln.length - 1)); for (var k = 0; k < 7; k++) { var q = Ln[Math.max(0, Math.min(Ln.length - 1, idx + (dir ? -k : k)))]; ctx.globalAlpha = 1 - k / 7; ctx.fillStyle = dir ? C.cream : C.crim3; ctx.fillRect(Math.round(q[0]) + (dir ? 1 : -1), Math.round(q[1]) - 1, 2, 1) } } ctx.globalAlpha = 1;
    // quartieri (da dietro in avanti)
    var order = [5, 4, 3, 2, 1, 0];
    // la torre e' la piu' lontana
    var M = MAP3.mon, monOpen = unl >= 7 || cur >= 6;
    ctx.drawImage(M.c, M.x, M.y);
    monLife(ctx, M, t, monOpen);
    for (var o = 0; o < 6; o++) { var dI = order[o], d0 = MAP3.dist[dI], open = dI < unl || done[dI]; ctx.drawImage(open ? d0.c : MAP3.dim[dI], d0.x, d0.y); if (open) d0.fx.forEach(function (e) { fx3(ctx, e, t, DIST[dI]) }) }
    // la rotta nel cielo: tratteggio crema fin dove si e' arrivati, grigio dopo; un'ombra sotto
    var march = ((t * 12) | 0) % 4;
    for (var r = 0; r < P.length; r++) { var p = P[r], dn = p[2] <= lim + .001; if ((r + (dn ? march : 0)) % 4 > 1) continue; ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(Math.round(p[0]) - 1, Math.round(p[1]) + 3, 3, 1); ctx.fillStyle = dn ? C.cream : '#5A6378'; ctx.fillRect(Math.round(p[0]) - 1, Math.round(p[1]) - 1, 3, 2) }
    // nodi ed etichette coi nomi interi
    for (var n = 0; n < 7; n++) {
      var nd = n < 6 ? MAP3.dist[n].node : M.node, rn = P3(MAP3.nodesW[n][0], MAP3.nodesW[n][1], MAP3.nodesW[n][2]), name = FULLN[n < 6 ? DIST[n].day : 'mon'], isDone = !!done[n], isCur = n === cur, isOpen = n < unl || isDone || isCur;
      var nx = Math.round(nd[0]), ny = Math.round(nd[1]);
      var rx0 = Math.round(rn[0]), ry0 = Math.round(rn[1]);
      ctx.fillStyle = isDone ? C.cream : isOpen ? C.cream : '#4A5266'; ctx.fillRect(rx0 - 2, ry0 - 2, 5, 5); ctx.fillStyle = C.night; ctx.fillRect(rx0 - 1, ry0 - 1, 3, 3); if (isDone || isCur) { ctx.fillStyle = isCur ? C.tomato : C.cream; ctx.fillRect(rx0, ry0, 1, 1) }
      if (isCur) { var pz = s.pulse != null ? s.pulse : (Math.sin(t * 6) * .5 + .5), rr = 9 + Math.round(pz * 4); ctx.fillStyle = C.tomato; for (var cv = 0; cv < 4; cv++) { var v = CORN[cv], x1 = rx0 + v[0] * rr, y1 = ry0 + v[1] * rr; ctx.fillRect(v[0] > 0 ? x1 - 4 : x1, y1, 5, 1); ctx.fillRect(x1, v[1] > 0 ? y1 - 4 : y1, 1, 5) } }
      if (s.labels !== false) {
        var tw = textWidth(name, 1) * 2 + 10, lx = nx - (tw >> 1), ly = ny + 10;
        ctx.fillStyle = 'rgba(10,12,18,0.88)'; ctx.fillRect(lx, ly, tw, 20); ctx.fillStyle = n === 6 ? C.crim3 : isOpen ? C.cream : C.g3; ctx.fillRect(lx, ly, tw, 1); ctx.fillRect(lx, ly + 19, 4, 1); ctx.fillRect(lx + tw - 4, ly + 19, 4, 1);
        text(ctx, name, nx - (textWidth(name, 1)), ly + 4, { size: 2, color: n === 6 ? C.crim3 : isOpen ? C.cream : C.g3 });
        var sys = (s.installed || { 0: 'booking', 1: 'auto', 2: 'ai', 3: 'night' })[n]; if (isDone && sys && IC2[sys]) { ctx.fillStyle = 'rgba(10,12,18,0.88)'; ctx.fillRect(lx - 22, ly, 20, 20); ctx.fillStyle = C.tomato; ctx.fillRect(lx - 22, ly, 20, 1); ctx.drawImage(IC2[sys][0], lx - 19, ly + 3) }
        if (isDone) { ctx.fillStyle = C.cream; ctx.fillRect(lx + tw + 3, ly + 3, 14, 14); ctx.fillStyle = C.ink; for (var q2 = 0; q2 < CHK.length; q2++) ctx.fillRect(lx + tw + 3 + CHK[q2][0], ly + 3 + CHK[q2][1], 2, 2) }
        else if (!isOpen) { ctx.fillStyle = C.g3; ctx.fillRect(lx + tw + 6, ly + 9, 9, 7); ctx.fillRect(lx + tw + 7, ly + 4, 1, 5); ctx.fillRect(lx + tw + 13, ly + 4, 1, 5); ctx.fillRect(lx + tw + 7, ly + 4, 7, 1) }
      }
    }
    // la nave che viaggia (sprite della nave, piccolo)
    if (s.ship !== false) { var sp2 = ART.mapPoint(s.shipPos == null ? cur : s.shipPos), bob = Math.sin(t * 5) * 2;  var sv = ART.actorScale; ART.actorScale = 1; ART.ship(ctx, sp2.x * 2, sp2.y * 2 - 14 + bob, t, { thrust: .8 }); ART.actorScale = sv }
    ctx.restore();
  };
  function fx3(ctx, e, t, D0) {
    var p = e.p, acc = D(D0.day)[7], i;
    if (e.k === 'rain') { ctx.fillStyle = '#8FB8E0'; for (i = 0; i < 26; i++) { var rx = p[0] - e.r * 2 + hash(i * 13) * e.r * 4, ry = p[1] - 60 + ((hash(i * 7) * 70 + t * 90) % 70); ctx.fillRect(Math.round(rx - (ry - p[1]) * .1), Math.round(ry), 1, 3) } }
    else if (e.k === 'fog') { ctx.fillStyle = '#8A78B8'; for (var b = 0; b < 3; b++) { var fy = p[1] - 22 + b * 10, fx0 = p[0] - 50 + Math.sin(t * .5 + b) * 10; for (i = 0; i < 90; i += 2) if (((i >> 1) + b + ((t * 3) | 0)) % 3 === 0) { ctx.globalAlpha = .35; ctx.fillRect(Math.round(fx0 + i), fy + ((i >> 2) & 1), 2, 1) } } ctx.globalAlpha = 1 }
    else if (e.k === 'lamp') { ctx.globalAlpha = .18 + .06 * Math.sin(t * 3 + p[0]); ctx.fillStyle = '#F2CDBE'; ctx.fillRect(p[0] - 3, p[1] - 1, 7, 3); ctx.fillRect(p[0] - 1, p[1] - 3, 3, 7); ctx.globalAlpha = 1 }
    else if (e.k === 'steam') { for (i = 0; i < 5; i++) { var ph = (t * .6 + i * .2 + p[0] * .01) % 1, sz = 2 + Math.round(ph * 4); ctx.globalAlpha = .5 * (1 - ph); ctx.fillStyle = '#B8C29A'; ctx.fillRect(Math.round(p[0] - sz / 2 + Math.sin(ph * 6 + i) * 3), Math.round(p[1] - ph * 34), sz, sz - 1) } ctx.globalAlpha = 1 }
    else if (e.k === 'sign') { var on = '11011111101111110110'[((t * 12) | 0) % 20] === '1'; ctx.fillStyle = on ? acc : '#2A3020'; ctx.fillRect(p[0], p[1], 12, 1); ctx.fillRect(p[0], p[1] + 6, 12, 1); ctx.fillRect(p[0], p[1], 1, 7); ctx.fillRect(p[0] + 11, p[1], 1, 7); if (on) { ctx.fillRect(p[0] + 3, p[1] + 3, 6, 1); ctx.globalAlpha = .25; ctx.fillRect(p[0] - 2, p[1] - 2, 16, 11); ctx.globalAlpha = 1 } }
    else if (e.k === 'lasers') { var LC = [acc, C.cream, '#7FD8FF']; for (i = 0; i < 3; i++) { var an = -Math.PI / 2 + Math.sin(t * (.8 + i * .3) + i * 2) * .8, dx = Math.cos(an), dy = Math.sin(an); ctx.fillStyle = LC[i]; for (var q = 0; q < 90; q += 2) { ctx.globalAlpha = .8 - q / 120; ctx.fillRect(Math.round(p[0] + dx * q), Math.round(p[1] + dy * q), 1, 1) } } ctx.globalAlpha = 1 }
    else if (e.k === 'party') { var cols = [acc, C.cream, C.gd2, '#7FD8FF']; for (i = 0; i < 10; i++) { ctx.fillStyle = cols[(i + ((t * 6) | 0)) & 3]; ctx.fillRect(p[0] - 14 + i * 3, p[1] - 3 - Math.round(Math.sin(i / 9 * Math.PI) * 9), 1, 1) } }
    else if (e.k === 'glow') { ctx.globalAlpha = .12 + .05 * Math.sin(t * 1.5); ctx.fillStyle = '#FFC56A'; ctx.fillRect(p[0] - 70, p[1] - 6, 140, 24); ctx.fillRect(p[0] - 50, p[1] - 14, 100, 40); ctx.globalAlpha = 1 }
    else if (e.k === 'birds') { ctx.fillStyle = C.ink; for (i = 0; i < 4; i++) { var bx = p[0] - 60 + ((t * 18 + i * 37) % 120), by = p[1] - 10 + i * 6 + Math.round(Math.sin(t * 3 + i) * 2), wg = ((t * 8 + i) | 0) % 2; ctx.fillRect(Math.round(bx), by, 1, 1); ctx.fillRect(Math.round(bx) - 1, by - wg, 1, 1); ctx.fillRect(Math.round(bx) + 1, by - wg, 1, 1); ctx.fillRect(Math.round(bx) - 2, by - 1 - wg, 1, 1); ctx.fillRect(Math.round(bx) + 2, by - 1 - wg, 1, 1) } }
  }
  function monLife(ctx, M, t, open) {
    // nuvole rosse attorno alla cima, il faro, gli occhi, i fulmini
    var tp = M.top;
    for (var i = 0; i < 7; i++) { var a = t * .2 + i * .9, cx = tp[0] + Math.cos(a) * (40 + i * 4), cy = tp[1] + 8 + Math.sin(a) * 9; ctx.globalAlpha = .35; ctx.fillStyle = i % 2 ? '#3A0E13' : '#561219'; ctx.fillRect(Math.round(cx) - 12, Math.round(cy) - 3, 24, 6); ctx.fillRect(Math.round(cx) - 7, Math.round(cy) - 6, 14, 12) } ctx.globalAlpha = 1;
    if ((t * 1.4) % 1 < .5) { ctx.fillStyle = C.crim3; ctx.fillRect(M.beacon[0] - 1, M.beacon[1] - 1, 3, 3); ctx.globalAlpha = .25; ctx.fillRect(M.beacon[0] - 6, M.beacon[1] - 6, 13, 13); ctx.globalAlpha = 1 }
    if (open && ((t * 2) % 1) < .6) { ctx.fillStyle = '#FF4A5E'; M.eyes.forEach(function (e) { ctx.fillRect(e[0], e[1] - 3, 2, 2) }) }
    var ls = Math.floor(t * 2.5); if (!reduced && hash(ls * 17) < .12 && (t * 2.5) % 1 < .25) { ctx.fillStyle = '#FFD6DC'; var lx = tp[0] - 30 + hash(ls) * 60, ly = tp[1] - 30; for (var k = 0; k < 30; k++) { lx += (hash(ls * 7 + k) - .5) * 6; ly += 2; ctx.fillRect(Math.round(lx), Math.round(ly), 1, 2) } }
  }

  // ======================================================================================
  // I BOSS DEI GIORNI (HD). Ognuno ha 3 stati: 'idle', 'attack', 'hurt' (s.state, oppure s.hit/s.mouth come prima).
  // ritratto per i dialoghi: ART.portrait(ctx, name, x, y, t, mood).
  var BPAL = { o: C.night, k: C.ink, w: C.hot, y: '#E9E3D3', '0': C.p0, '1': C.p1, '2': C.p2, '3': C.p3,
    P: '#3A3D44', Q: '#26282E', R: '#18191D', S: '#4A4E56', T: '#0E1418', U: '#5A3A2A', V: '#7A5238',
    a: '#5FD3FF', A: '#2A6E8A', l: '#B99CFF', L: '#5A4880', g: '#C6EE48', G: '#5E7A1E', s: '#E0A050', h: '#F6C878', H: '#A86A30', j: '#6A3E1C',
    v: '#2E2A3A', V2: '#45405A', x: '#8A8698', z: '#F2CDBE', Z: '#B88070', e: '#6E6B66', E: '#9C978B' };
  BPAL.V = '#7A5238';
  function bigEye(g, cx, cy, rx, ry, side, o) {
    o = o || {}; gell(g, cx, cy, rx + 1.2, ry + 1.2, 'k'); gell(g, cx, cy, rx, ry, o.closed ? 'k' : (o.sclera || 'y'));
    if (!o.closed) { var pr = o.pupil || Math.max(2, rx * .45), pcx = cx - rx + pr + .3; gell(g, pcx, cy, pr, pr, o.pcol || 'k'); gs(g, Math.round(pcx - pr * .4), Math.round(cy - pr * .5), 'w') }
    else gr(g, Math.round(cx - rx), Math.round(cy), Math.round(rx * 2), 1, 'y');
    var bw = Math.round(rx * 2 + 6), an = o.anger == null ? 5 : o.anger;
    for (var i = 0; i < bw; i++) { var tt = side < 0 ? i / bw : 1 - i / bw, bx = Math.round(cx - rx - 3 + i), by = Math.round(cy - ry - 3 - (1 - tt) * an); for (var th = 0; th < (o.thick || 3); th++) gs(g, bx, by + th, 'k') }
  }
  // ---------- THE VOICEMAIL (martedi'): segreteria telefonica gigante, le bobine sono gli occhi
  function bVoicemail(state, f) {
    var g = grid(132, 90), att = state === 'attack', hurt = state === 'hurt';
    grr(g, 4, 16, 124, 70, 8, 'Q'); grr(g, 4, 16, 124, 8, 6, 'P'); gr(g, 6, 80, 120, 4, 'R');
    // tasti sopra
    [[18, 'y'], [34, 'y'], [50, 'a'], [66, 'y']].forEach(function (b2, i) { var lit = b2[1] === 'a' && (f % 2 === 0 || att); grr(g, b2[0], 9 + (i === 2 && att ? 2 : 0), 12, 8, 2, lit ? 'a' : 'S'); gr(g, b2[0] + 2, 10 + (i === 2 && att ? 2 : 0), 8, 1, lit ? 'w' : 'e') });
    // finestra della cassetta
    grr(g, 18, 24, 96, 34, 5, 'S'); grr(g, 21, 27, 90, 28, 4, 'T');
    gr(g, 44, 46, 44, 3, 'U');
    // bobine = occhi (girano)
    [[42, -1], [90, 1]].forEach(function (e, i) {
      var cx = e[0], cy = 40, spin = hurt ? 0 : (f * (att ? 2 : 1) * .55 + i);
      gell(g, cx, cy, 13, 13, 'k'); gell(g, cx, cy, 12, 12, i ? 'V' : 'U'); gell(g, cx, cy, 8, 8, 'U'); gell(g, cx, cy, 6.5, 6.5, 'y'); gell(g, cx, cy, 2.2, 2.2, 'k');
      for (var k = 0; k < 3; k++) { var a2 = spin + k * 2.094; for (var r = 2; r < 6; r++) gs(g, Math.round(cx + Math.cos(a2) * r), Math.round(cy + Math.sin(a2) * r), 'S') }
      if (hurt) { gl(g, cx - 5, cy - 5, cx + 5, cy + 5, 'k'); gl(g, cx + 5, cy - 5, cx - 5, cy + 5, 'k') }
      // pupilla: un riflesso della luce del display che guarda giu'
      gs(g, cx - 3, cy - 4, 'w'); gs(g, cx - 2, cy - 4, 'w');
      // sopracciglio dipinto sul vetro
      for (var b = 0; b < 26; b++) { var tt = e[1] < 0 ? b / 26 : 1 - b / 26, by = Math.round(27 + (att ? 4 : 2) - (1 - tt) * (att ? 7 : 5) + tt * 0); gs(g, cx - 13 + b, by, 'k'); gs(g, cx - 13 + b, by + 1, 'k'); gs(g, cx - 13 + b, by + 2, 'k') }
    });
    if (hurt) gl(g, 24, 30, 60, 52, 'x');
    // display: 47 messaggi
    grr(g, 54, 60, 24, 11, 2, 'k'); if (f % 2 === 0 || att) { gtext(g, '47', 58, 63, 'a') }
    // bocca = altoparlante
    for (var yy = 0; yy < 3; yy++) for (var xx = 0; xx < 9; xx++) { var hx = 24 + xx * 4 + (yy % 2) * 2, hy = 64 + yy * 4; if (hx > 50 && hx < 82) continue; gr(g, hx, hy, 2, 2, att ? 'a' : 'R') }
    if (att) { gpoly(g, [[30, 74], [102, 74], [92, 84], [40, 84]], 'k'); for (var tx = 36; tx < 98; tx += 5) { gpoly(g, [[tx, 74], [tx + 4, 74], [tx + 2, 78]], 'y') } gr(g, 50, 81, 32, 2, 'A') }
    return can(g, BPAL);
  }
  // ---------- REPLY ALL (mercoledi'): una busta enorme con la faccia, tante buste che le girano attorno
  function bReplyAll(state, f) {
    var g = grid(110, 84), att = state === 'attack', hurt = state === 'hurt';
    gr(g, 8, 20, 94, 58, '0'); gr(g, 8, 72, 94, 6, '1'); gr(g, 98, 20, 4, 58, '1');
    gpoly(g, [[8, 78], [55, 48], [102, 78]], '1'); gl(g, 8, 77, 55, 48, '2'); gl(g, 101, 77, 55, 48, '2');
    // il lembo e' la fronte aggrottata
    var fl = att ? 6 : 0; gpoly(g, [[8, 20], [102, 20], [55, 50 - fl]], 'y'); gl(g, 8, 20, 55, 50 - fl, 'L'); gl(g, 102, 20, 55, 50 - fl, 'L'); gl(g, 9, 20, 55, 49 - fl, 'L'); gl(g, 101, 20, 55, 49 - fl, 'L');
    gr(g, 8, 18, 94, 3, 'l');
    bigEye(g, 34, 38, 7, 6, -1, { anger: att ? 6 : 4, closed: hurt, pupil: 3 }); bigEye(g, 76, 38, 7, 6, 1, { anger: att ? 6 : 4, closed: hurt, pupil: 3 });
    // bocca: "@" sogghigno o urlo
    if (att) { gell(g, 55, 64, 12, 8, 'k'); gell(g, 55, 66, 8, 4, 'L'); gr(g, 46, 57, 18, 2, 'y') }
    else { for (var x = 40; x < 72; x++) { var y = Math.round(62 + Math.sin((x - 40) / 32 * Math.PI) * -2 + (x > 64 ? -(x - 64) * .5 : 0)); gs(g, x, y, 'k'); gs(g, x, y + 1, 'k') } }
    // @ timbrato sulla guancia
    gell(g, 90, 62, 4, 4, 'l'); gell(g, 90, 62, 2.5, 2.5, '0'); gell(g, 90, 62, 1, 1, 'l');
    return can(g, BPAL);
  }
  var MINIMAIL = null;
  function miniMail() { if (!MINIMAIL) { var g = grid(16, 12); gr(g, 1, 1, 14, 10, '0'); gl(g, 1, 1, 8, 6, 'L'); gl(g, 14, 1, 8, 6, 'L'); gr(g, 1, 10, 14, 1, '1'); MINIMAIL = lightUp(can(g, BPAL), 'wed', { top: .4 }) } return MINIMAIL }
  // ---------- PAPER JAM (giovedi'): stampante furiosa nell'acido, la bocca sputa carta
  function bPaperJam(state, f) {
    var g = grid(132, 104), att = state === 'attack', hurt = state === 'hurt';
    // vassoio dietro e fogli
    gr(g, 30, 4, 72, 12, '1'); gr(g, 34, 2, 64, 2, '0'); gr(g, 32, 14, 68, 2, '2');
    // corpo
    grr(g, 6, 22, 120, 66, 6, '1'); gr(g, 6, 22, 120, 4, '0'); gr(g, 6, 82, 120, 6, '2'); gr(g, 120, 26, 6, 58, '2');
    // coperchio dello scanner = sopracciglia a V
    gpoly(g, [[6, 16], [66, 30 + (att ? 4 : 0)], [126, 16], [126, 24], [66, 36 + (att ? 4 : 0)], [6, 24]], '2'); gl(g, 6, 16, 66, 30 + (att ? 4 : 0), '3'); gl(g, 126, 16, 66, 30 + (att ? 4 : 0), '3');
    bigEye(g, 44, 46, 8, 7, -1, { anger: 0, closed: hurt, pupil: 3, pcol: att ? 'G' : 'k' }); bigEye(g, 88, 46, 8, 7, 1, { anger: 0, closed: hurt, pupil: 3, pcol: att ? 'G' : 'k' });
    // pannello: display ERR verde acido che lampeggia
    grr(g, 100, 58, 22, 12, 2, 'k'); if (f % 2 === 0 || att) gtext(g, 'ERR', 102, 62, 'g'); gr(g, 104, 74, 4, 3, 'g'); gr(g, 112, 74, 4, 3, 'S');
    // bocca: la fessura d'uscita con la luce acida dentro e i fogli accartocciati come denti
    var mh = att ? 14 : 6; gr(g, 16, 64, 80, mh, 'k'); gr(g, 18, 64 + mh - 2, 76, 1, 'g'); gr(g, 18, 64 + mh - 1, 76, 1, 'G');
    for (var tx = 18; tx < 94; tx += 6) { var hgt = 4 + ((tx * 7 + f * 3) % 4); gpoly(g, [[tx, 64], [tx + 5, 64], [tx + 3, 64 + hgt]], 'y'); gs(g, tx + 1, 64, '0') }
    if (att) { gpoly(g, [[30, 78], [86, 78], [92, 104], [24, 104]], '0'); for (var ly = 84; ly < 102; ly += 4) gr(g, 34, ly, 50, 1, 'x'); gr(g, 40, 92, 24, 1, 'g') }
    if (hurt) [[20, 8], [104, 4], [60, 0]].forEach(function (p) { gell(g, p[0] + (f % 2) * 2, p[1] + 6, 6, 5, 'e'); gell(g, p[0] - 2 + (f % 2) * 2, p[1] + 4, 3, 3, 'E') });
    return can(g, BPAL);
  }
  // ---------- ONE STAR (sabato): la recensione a una stella, arrabbiata, con il fumetto
  function bOneStar(state, f) {
    var g = grid(112, 108), att = state === 'attack', hurt = state === 'hurt', rot = (f % 2 ? .08 : -.08) + (att ? .12 * (f % 2 ? 1 : -1) : 0), cx = 56, cy = 58, P = [], P2 = [];
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5 + rot, r = i % 2 ? 22 : 50; P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); P2.push([cx + Math.cos(a) * (r - 5), cy + Math.sin(a) * (r - 5) - 2]) }
    gpoly(g, P, 'H'); gpoly(g, P2, 's'); var P3b = P.map(function (p) { return [cx + (p[0] - cx) * .45 - 4, cy + (p[1] - cy) * .45 - 8] }); gpoly(g, P3b, 'h');
    if (hurt) { gl(g, Math.round(P[4][0]), Math.round(P[4][1]), cx + 6, cy + 4, 'j'); gl(g, Math.round(P[4][0]) - 1, Math.round(P[4][1]), cx + 5, cy + 4, 'j') }
    bigEye(g, cx - 13, cy - 2, 7, 6.5, -1, { anger: 6, closed: hurt, pupil: 3, thick: 3 }); bigEye(g, cx + 13, cy - 2, 7, 6.5, 1, { anger: 6, closed: hurt, pupil: 3, thick: 3 });
    if (att) { gell(g, cx, cy + 17, 10, 7, 'k'); gr(g, cx - 7, cy + 11, 14, 2, 'y'); gell(g, cx, cy + 20, 5, 3, 'j') }
    else { for (var x = cx - 10; x <= cx + 10; x++) { var y = Math.round(cy + 18 - Math.cos((x - cx) / 10 * Math.PI / 2) * 4); gs(g, x, y, 'k'); gs(g, x, y + 1, 'k') } }
    return can(g, BPAL);
  }
  var BUBBLE = {};
  function starBubble(att) { var k = att ? 1 : 0; if (!BUBBLE[k]) { var g = grid(74, 34); grr(g, 1, 1, 72, 24, 6, 'k'); grr(g, 3, 3, 68, 20, 5, '0'); gpoly(g, [[12, 24], [24, 24], [8, 33]], 'k'); gpoly(g, [[13, 23], [22, 23], [11, 30]], '0'); for (var i = 0; i < 5; i++) { var cx = 12 + i * 12, cy = 13, P = []; for (var j = 0; j < 10; j++) { var a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 2.2 : 5; P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]) } gpoly(g, P, i === 0 ? 's' : (att ? 'k' : 'E')) } BUBBLE[k] = can(g, BPAL) } return BUBBLE[k] }
  // ---------- SUNDAY SCARIES (domenica): un fantasma d'ombra fatto di lista delle cose da fare
  function bScaries(state, f) {
    var g = grid(100, 124), att = state === 'attack', hurt = state === 'hurt', cx = 50;
    gell(g, cx, 34, 38, 32, 'v'); gr(g, cx - 38, 34, 76, 66, 'v');
    for (var x = cx - 38; x < cx + 38; x++) { var yb = Math.round(100 + Math.sin((x + f * 7) / 7) * 6 + Math.sin((x - f * 5) / 13) * 4); for (var y = 100; y < yb + 8; y++) gs(g, x, y, y > yb + 4 ? 'V2' : 'v') }
    gell(g, cx - 10, 26, 18, 12, 'V2');
    // la lista: righe e caselle vuote sul corpo
    for (var i = 0; i < 5; i++) { var ly = 58 + i * 9; gr(g, cx - 22, ly, 6, 6, 'x'); gr(g, cx - 21, ly + 1, 4, 4, 'v'); gr(g, cx - 12, ly + 2, 30 - (i * 7) % 14, 2, 'x') }
    // occhi vuoti che brillano, bocca che trema
    var ec = att ? 'z' : 'y'; gell(g, cx - 13, 30, 7, att ? 9 : 7, 'k'); gell(g, cx + 13, 30, 7, att ? 9 : 7, 'k'); if (!hurt) { gell(g, cx - 13, 31, 3, att ? 5 : 3, ec); gell(g, cx + 13, 31, 3, att ? 5 : 3, ec) }
    for (var mx = cx - 9; mx <= cx + 9; mx++) { var my = Math.round(46 + Math.sin((mx + f * 3) / 2.2) * 1.5); gs(g, mx, my, 'k'); gs(g, mx, my + 1, 'k'); if (att) gs(g, mx, my + 2, 'k') }
    var c = can(g, BPAL); if (hurt) c = dissolve(c, .35); return c;
  }
  // misure visibili in pixel di gioco (giro 3, HD): replyall con le buste che girano, onestar con il fumetto
  ART.size.call = { w: 26, h: 21 }; ART.size.invoice = { w: 20, h: 26 }; ART.size.receipt = { w: 10, h: 14 }; ART.size.noshow = { w: 18, h: 26 }; ART.size.spam = { w: 19, h: 11 }; ART.size.double = { w: 19, h: 18 }; ART.size.powerup = { w: 16, h: 18 }; ART.size.urgent = { w: 65, h: 38 }; ART.size.monday = { w: 157, h: 120 };
  ART.size.voicemail = { w: 63, h: 39 }; ART.size.replyall = { w: 55, h: 37, orbit: 80 }; ART.size.paperjam = { w: 62, h: 44 }; ART.size.onestar = { w: 56, h: 54, bubble: 79 }; ART.size.scaries = { w: 39, h: 58 };
  var BDEF = { voicemail: { fn: bVoicemail, day: 'tue', n: 4, fps: 6, face: [66, 46] }, replyall: { fn: bReplyAll, day: 'wed', n: 2, fps: 4, face: [55, 48] }, paperjam: { fn: bPaperJam, day: 'thu', n: 2, fps: 5, face: [66, 52] }, onestar: { fn: bOneStar, day: 'sat', n: 2, fps: 3, face: [56, 58] }, scaries: { fn: bScaries, day: 'sun', n: 3, fps: 5, face: [50, 40] } };
  var BC = {};
  function bossFrames(name, state) {
    var key = name + state; if (BC[key]) return BC[key]; var D0 = BDEF[name], fr = [];
    for (var f = 0; f < D0.n; f++) { var c = lightUp(D0.fn(state, f), D0.day === 'sun' ? 'night' : D0.day, { top: .25 }); fr.push(c) }
    return (BC[key] = { f: fr, flash: fr.map(function (c) { return solid(c, C.cream) }) });
  }
  ART.prepareBosses = function () { Object.keys(BDEF).forEach(function (n) { ['idle', 'attack', 'hurt'].forEach(function (s2) { bossFrames(n, s2) }) }) };
  var BOSS_OLD = ART.boss;
  ART.boss = function (ctx, name, x, y, t, s) {
    if (!BDEF[name]) return BOSS_OLD(ctx, name, x, y, t, s);
    s = s || {}; var S = SC(ctx), st = s.state || (s.hit > .5 ? 'hurt' : (s.mouth || 0) > .5 ? 'attack' : 'idle'), F = bossFrames(name, st), D0 = BDEF[name];
    var i = ((t * D0.fps) | 0) % F.f.length, bob = Math.round(Math.sin(t * 2) * 2), shake = st === 'hurt' && !reduced ? Math.round(Math.sin(t * 60) * 1.5) : 0;
    if (name === 'replyall') { // buste che orbitano dietro e davanti
      var n = st === 'attack' ? 10 : 6, mm = miniMail(), sp = st === 'attack' ? 2.4 : 1.1;
      for (var k = 0; k < n; k++) { var a = t * sp + k * Math.PI * 2 / n, ex = x + Math.cos(a) * 36, ey = y + bob + Math.sin(a) * 18; if (Math.sin(a) < 0) putC(ctx, mm, ex, ey, S) }
      putC(ctx, F.f[i], x + shake, y + bob, S);
      for (var k2 = 0; k2 < n; k2++) { var a2 = t * sp + k2 * Math.PI * 2 / n, ex2 = x + Math.cos(a2) * 36, ey2 = y + bob + Math.sin(a2) * 18; if (Math.sin(a2) >= 0) putC(ctx, mm, ex2, ey2, S) }
    } else putC(ctx, F.f[i], x + shake, y + bob, S);
    if (name === 'onestar') putC(ctx, starBubble(st === 'attack'), x + 36, y - 28 + bob, S);
    if (s.hit > 0) { ctx.globalAlpha = reduced ? .4 : Math.min(1, s.hit); putC(ctx, F.flash[i], x + shake, y + bob, S); ctx.globalAlpha = 1 }
    if (s.hp != null) { var bw = 40, bx = Math.round((x - bw / 2) * S), by = Math.round((y + ART.size[name].h / 2 + 4) * S); ctx.fillStyle = C.g4; ctx.fillRect(bx, by, bw * S, 2 * S); ctx.fillStyle = C.crim3; ctx.fillRect(bx, by, Math.round(bw * S * Math.max(0, s.hp)), 2 * S) }
  };
  // il primo piano di MONDAY: testata cremisi, occhi a cella con le pupille rosse, ghigno con il canino, corna d'osso
  function mondayPortrait(mood) {
    var g = grid(112, 96), smug = mood === 'smug' || mood === 'idle', angry = mood === 'angry' || mood === 'rage', hurt = mood === 'hurt';
    gr(g, 0, 0, 112, 96, '0'); gr(g, 0, 0, 112, 20, 'r'); gr(g, 0, 20, 112, 2, 'd'); gtext5(g, 'MON', 39, 3, 'c', 2);
    for (var x = 0; x < 112; x += 28) gr(g, x, 22, 1, 74, '1'); gr(g, 0, 60, 112, 1, '1');
    // corna
    [0, 1].forEach(function (sd) { var X = function (x) { return sd ? 111 - x : x }; gpoly(g, [[X(2), 18], [X(18), 18], [X(4), 2]], '1'); gl(g, X(6), 14, X(4), 4, '0'); gs(g, X(4), 2, 'R'); gs(g, X(4), 3, 'r') });
    // occhi: celle nere, pupille rosse che guardano giu', palpebre pesanti se compiaciuto
    [[16, -1], [68, 1]].forEach(function (e, i) {
      var ex = e[0], ey = 32; gr(g, ex, ey, 28, 22, 'e');
      if (!hurt) { var px0 = ex + (i ? 6 : 14), py0 = ey + (smug ? 11 : 8); gr(g, px0 - 1, py0 - 1, 9, 9, 'D'); gr(g, px0, py0, 7, 7, 'r'); gr(g, px0 + 1, py0 + 1, 2, 2, 'w'); if (angry) gs(g, px0 + 4, py0 + 2, 'y') } else { gr(g, ex + 4, ey + 10, 20, 2, '2') }
      if (smug) gr(g, ex, ey, 28, 9, '1'), gr(g, ex, ey + 9, 28, 2, 'e');
      for (var b = 0; b < 30; b++) { var tt = i ? 1 - b / 30 : b / 30, by = Math.round(ey - 4 - (angry ? (1 - tt) * 7 : smug ? (i ? 4 : 0) * (1 - tt) : 0)); gr(g, ex - 1 + b, by, 1, 3, 'e') }
    });
    // bocca
    if (angry) { gr(g, 18, 66, 76, 22, 'e'); for (var tx = 19; tx < 93; tx += 2) { gs(g, tx, 66, 'c'); gs(g, tx + 1, 87, 'c') } gr(g, 30, 78, 52, 6, 'D'); [[22, 1], [86, 1]].forEach(function (f) { gr(g, f[0], 66, 3, 12, 'c'); gs(g, f[0] + 1, 77, '1') }) }
    else { gpoly(g, [[22, 74], [56, 76], [94, 62], [92, 70], [60, 84], [26, 79]], 'e'); for (var tx2 = 40; tx2 < 88; tx2 += 3) { var ty2 = Math.round(76 - (tx2 - 40) * .28); gs(g, tx2, ty2, 'c'); gs(g, tx2 + 1, ty2, 'c') } gpoly(g, [[80, 68], [85, 66], [83, 76]], 'c'); gs(g, 84, 67, 'w') }
    return can(g, MPAL);
  }
  // ---------- RITRATTI (112x96 HD = 56x48 di gioco): il primo piano del boss in una cornice
  var PORT = {};
  function portraitCanvas(name, mood) {
    var key = name + mood; if (PORT[key]) return PORT[key];
    var src, fx, fy;
    if (name === 'monday') { src = mondayPortrait(mood); fx = 56; fy = 48 }
    else if (name === 'urgent') { src = URG2[mood === 'angry' ? 4 : 0]; fx = 66; fy = 44 }
    else { var st = mood === 'angry' ? 'attack' : mood === 'hurt' ? 'hurt' : 'idle', F = bossFrames(name, st); src = F.f[0]; fx = BDEF[name].face[0]; fy = BDEF[name].face[1] }
    var s2 = mk(112, 96), g = s2.g, bg = { monday: '#280A0E', urgent: '#280A0E', voicemail: '#121A2E', replyall: '#1D152E', paperjam: '#171E15', onestar: '#3A1C22', scaries: '#93A8B8' }[name] || '#121211';
    g.fillStyle = bg; g.fillRect(0, 0, 112, 96);
    for (var y = 0; y < 96; y += 3) { g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, y, 112, 1) }
    g.drawImage(src, Math.round(fx - 56), Math.round(fy - 48), 112, 96, 0, 0, 112, 96);
    PORT[key] = s2.c; return s2.c;
  }
  ART.portrait = function (ctx, name, x, y, t, mood) {
    var S = SC(ctx), c = portraitCanvas(name, mood || 'idle'), x0 = Math.round(x * S), y0 = Math.round(y * S);
    if (S === 2) ctx.drawImage(c, x0, y0); else ctx.drawImage(c, x0, y0, 56, 48);
    var w = 56 * S, h = 48 * S, col = name === 'monday' || name === 'urgent' ? C.crim3 : C.cream;
    ctx.fillStyle = C.night; ctx.fillRect(x0 - S, y0 - S, w + 2 * S, S); ctx.fillRect(x0 - S, y0 + h, w + 2 * S, S); ctx.fillRect(x0 - S, y0, S, h); ctx.fillRect(x0 + w, y0, S, h);
    ctx.fillStyle = col; [[x0 - S, y0 - S, 1, 1], [x0 + w, y0 - S, -1, 1], [x0 - S, y0 + h, 1, -1], [x0 + w, y0 + h, -1, -1]].forEach(function (q) { ctx.fillRect(q[2] > 0 ? q[0] : q[0] - 5 * S + S, q[1], 5 * S, S); ctx.fillRect(q[0], q[3] > 0 ? q[1] : q[1] - 5 * S + S, S, 5 * S) });
    if (((t * 8) | 0) % 9 === 0 && !reduced) { ctx.fillStyle = 'rgba(244,242,236,0.08)'; ctx.fillRect(x0, y0 + ((t * 40) % h), w, 2 * S) }
  };
  // ---------- DIALOGO: pannello con il ritratto, la targhetta del nome, il testo a macchina e il cursore
  ART.dialog = function (ctx, x, y, w, h, t, o) {
    o = o || {}; var S = SC(ctx), name = o.name || '', acc = o.color || (o.portrait === 'monday' || o.portrait === 'urgent' ? C.crim3 : C.cream);
    ctx.save(); if (S === 2) ctx.scale(2, 2);
    ctx.fillStyle = 'rgba(12,12,14,0.92)'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(244,242,236,0.35)'; ctx.fillRect(x, y, w, 1); ctx.fillRect(x, y + h - 1, w, 1); ctx.fillRect(x, y, 1, h); ctx.fillRect(x + w - 1, y, 1, h);
    ctx.fillStyle = acc; [[x, y, 1, 1], [x + w - 1, y, -1, 1], [x, y + h - 1, 1, -1], [x + w - 1, y + h - 1, -1, -1]].forEach(function (q) { ctx.fillRect(q[2] > 0 ? q[0] : q[0] - 5, q[1], 6, 1); ctx.fillRect(q[0], q[3] > 0 ? q[1] : q[1] - 5, 1, 6) });
    var px0 = x + 6, tx = o.portrait ? x + 6 + 56 + 8 : x + 8;
    // targhetta del nome
    if (name) { var nw = textWidth(name, 1) + 10; ctx.fillStyle = acc; ctx.fillRect(tx - 2, y - 5, nw, 11); text(ctx, name, tx + 3, y - 3, { color: C.night }) }
    // testo a macchina
    var str = String(o.text || ''), n = o.chars == null ? Math.floor((o.t0 != null ? t - o.t0 : t) * 30) : o.chars, maxW = x + w - 8 - tx, words = str.split(' '), L = [], cur = '';
    words.forEach(function (wd) { var nx = cur ? cur + ' ' + wd : wd; if (textWidth(nx, 1) > maxW && cur) { L.push(cur); cur = wd } else cur = nx }); L.push(cur);
    var left = n, cx2 = tx, cy2 = y + 12;
    for (var i = 0; i < L.length && left > 0; i++) { var part = L[i].slice(0, left); var ww = text(ctx, part, tx, y + 12 + i * 11, { color: C.cream }); cx2 = tx + ww + 2; cy2 = y + 12 + i * 11; left -= L[i].length + 1 }
    if (n < str.length || ((t * 3) | 0) % 2 === 0) { ctx.fillStyle = C.tomato; if (n < str.length) ctx.fillRect(cx2, cy2, 4, 7); else { var ax = x + w - 12, ay = y + h - 9 + (((t * 4) | 0) % 2); ctx.fillRect(ax, ay, 5, 1); ctx.fillRect(ax + 1, ay + 1, 3, 1); ctx.fillRect(ax + 2, ay + 2, 1, 1) } }
    ctx.restore();
    if (o.portrait) ART.portrait(ctx, o.portrait, px0, y + Math.round((h - 48) / 2), t, o.mood);
    return n >= str.length;
  };

  // ======================================================================================
  // IL TITOLO v2 (HD): insegna al neon d'epoca. Pannello di metallo con cornice e rivetti appeso a due staffe,
  // tubi a mano: DEAD crema, LINE pomodoro (la scadenza scotta), la seconda D che sfarfalla, sottotitolo al neon
  // e la targhetta OPEN 24/7 appesa.
  var LG2 = null, LGU = 6, LGM = 7;
  function stampLine(g, x0, y0, x1, y1, r, c) { var n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2)); for (var i = 0; i <= n; i++) { var x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n; for (var yy = Math.floor(y - r); yy <= y + r; yy++) for (var xx = Math.floor(x - r); xx <= x + r; xx++) { var dx = xx + .5 - x, dy = yy + .5 - y; if (dx * dx + dy * dy <= r * r) gs(g, xx, yy, c) } } }
  function tubeLetter(L, lit, hot) {
    var wu = 0; L.forEach(function (pl) { pl.forEach(function (p) { wu = Math.max(wu, p[0]) }) });
    var w = wu * LGU + LGM * 2, h = 11 * LGU + LGM * 2, g = grid(w, h);
    function each(fn) { L.forEach(function (pl) { for (var j = 1; j < pl.length; j++) fn(pl[j - 1][0] * LGU + LGM, pl[j - 1][1] * LGU + LGM, pl[j][0] * LGU + LGM, pl[j][1] * LGU + LGM) }) }
    each(function (a, b, c, d) { stampLine(g, a, b, c, d, 3.6, 'e') });
    each(function (a, b, c, d) { stampLine(g, a, b, c, d, 2.6, 't') });
    each(function (a, b, c, d) { stampLine(g, a, b, c, d, 1.1, 'k') });
    // estremita' degli elettrodi e mollette di sostegno
    L.forEach(function (pl) { [pl[0], pl[pl.length - 1]].forEach(function (p, k) { if (k && pl[0] === pl[pl.length - 1]) return; var x = p[0] * LGU + LGM, y = p[1] * LGU + LGM; gell(g, x + .5, y + .5, 3.2, 3.2, 'm'); gell(g, x + .5, y + .5, 1.6, 1.6, 'n') }); var a = pl[0], b = pl[1], mx = (a[0] + b[0]) / 2 * LGU + LGM, my = (a[1] + b[1]) / 2 * LGU + LGM; gr(g, Math.round(mx) - 1, Math.round(my) - 4, 3, 2, 'n'); gr(g, Math.round(mx) - 1, Math.round(my) + 3, 3, 2, 'n') });
    var pal = lit ? (hot ? { e: '#7A2416', t: C.tomato, k: C.t4, m: '#3A3A38', n: '#6E6B66' } : { e: '#8A8478', t: C.cream, k: C.hot, m: '#3A3A38', n: '#6E6B66' }) : { e: '#2A2A28', t: '#3A3A38', k: '#4A4A46', m: '#2A2A28', n: '#4A4A46' };
    return { c: can(g, pal), w: w, h: h };
  }
  function buildLogo2() {
    var word = 'DEADLINE', on = [], off = [], xs = [], x = 0, gap = 2;
    for (var i = 0; i < 8; i++) { var L = LOGO_LET[word[i]], a = tubeLetter(L, true, i >= 4), b = tubeLetter(L, false, i >= 4); on.push(a.c); off.push(b.c); xs.push(x); x += a.w + gap }
    var lw = x - gap, lh = on[0].height, BW = lw + 44, BH = lh + 78, s = mk(BW, BH + 44), g = s.g;
    // staffe e catenelle
    g.fillStyle = '#3A3A38'; [40, BW - 46].forEach(function (bx) { g.fillRect(bx, 0, 6, 4); g.fillRect(bx + 2, 4, 2, 10); for (var k = 0; k < 3; k++) { g.fillStyle = '#6E6B66'; g.fillRect(bx + 1, 5 + k * 3, 4, 2); g.fillStyle = '#3A3A38' } });
    // pannello con cornice, bordi smussati, rivetti
    var py = 14;
    g.fillStyle = '#0A0A0B'; g.fillRect(3, py, BW - 6, BH - 6); g.fillRect(5, py - 2, BW - 10, BH - 2);
    g.fillStyle = '#3A3A3E'; g.fillRect(6, py + 1, BW - 12, BH - 10); g.fillStyle = '#4E4E54'; g.fillRect(6, py + 1, BW - 12, 2);
    g.fillStyle = '#141416'; g.fillRect(10, py + 5, BW - 20, BH - 18);
    for (var yy = py + 5; yy < py + BH - 13; yy += 3) { g.fillStyle = 'rgba(255,255,255,0.025)'; g.fillRect(10, yy, BW - 20, 1) }
    g.fillStyle = '#1E1E22'; g.fillRect(10, py + 5, BW - 20, 2); g.fillStyle = '#060607'; g.fillRect(10, py + BH - 15, BW - 20, 2);
    [[12, py + 7], [BW - 15, py + 7], [12, py + BH - 18], [BW - 15, py + BH - 18], [BW / 2 - 1, py + 7], [BW / 2 - 1, py + BH - 18]].forEach(function (r) { g.fillStyle = '#6E6B66'; g.fillRect(r[0], r[1], 3, 3); g.fillStyle = '#BEC2BF'; g.fillRect(r[0], r[1], 1, 1) });
    // sottotitolo al neon: la m e A MOTHER MACHINE GAME
    // alone dei tubi sul pannello (cotto una volta: luce, non sfocatura dal vivo)
    var lt = mk(lw, lh); on.forEach(function (c, i) { lt.g.drawImage(c, xs[i], 0) }); var halo = blurStamp(lt.c, 14, 1, 9); g.globalAlpha = .55; g.drawImage(halo, 22 - 14, py + 14 - 14); g.globalAlpha = 1;
    var sub = 'A MOTHER MACHINE GAME', sw = tinyWidth(sub) * 2, sx = Math.round((BW - sw) / 2) + 8, sy = py + 14 + lh + 2, mk2 = mk(tinyWidth(sub) + 2, 7); tiny(mk2.g, sub, 1, 1, '#ffffff');
    var subOn = neonize(mk2.c, C.tomato, true); g.imageSmoothingEnabled = false; g.drawImage(subOn, sx, sy, subOn.width * 2, subOn.height * 2);
    var mm = markCanvas(12, C.cream); g.drawImage(mm, sx - 14, sy + 1);
    // targhetta OPEN 24/7 appesa sotto a destra
    var ox = BW - 90, oy = py + BH - 6; g.fillStyle = '#3A3A38'; g.fillRect(ox + 10, oy - 2, 1, 8); g.fillRect(ox + 56, oy - 2, 1, 8);
    g.fillStyle = '#0A0A0B'; g.fillRect(ox, oy + 6, 68, 18); g.fillStyle = '#3A3A3E'; g.fillRect(ox + 1, oy + 7, 66, 16); g.fillStyle = '#141416'; g.fillRect(ox + 3, oy + 9, 62, 12);
    var om = mk(tinyWidth('OPEN 24/7') + 2, 7); tiny(om.g, 'OPEN 24/7', 1, 1, '#ffffff'); var openC = neonize(om.c, C.cream, true), openOff = neonize(om.c, C.cream, false);
    LG2 = { board: s.c, on: on, off: off, xs: xs, lx: 22, ly: py + 14, w: BW, h: BH + 44, rule: py + BH - 26, lw: lw, open: [openC, openOff], ox: ox + 34 - openC.width, oy: oy + 9 };
    var full = mk(lw, lh); on.forEach(function (c, i) { full.g.drawImage(c, xs[i], 0) }); LG2.full = full.c; LG2.cy = solid(full.c, C.cyan); LG2.rd = solid(full.c, C.crim3);
    return LG2;
  }
  var FLK_OPEN = '1111111111111111111101111111111111111111111111011111111111';
  ART.logo = function (ctx, x, y, t, glitch, o) {
    o = o || {}; var L = LG2 || buildLogo2(), S = SC(ctx), Z = S === 2 ? 1 : .5;
    ctx.save(); ctx.translate(Math.round(x * S - L.w * Z / 2), Math.round(y * S)); if (Z !== 1) ctx.scale(Z, Z);
    ctx.drawImage(L.board, 0, 0);
    var slot = (t * 12) | 0, d2 = FLK_D2[slot % FLK_D2.length] === '1', gl2 = glitch && !reduced ? (glitch === true ? 1 : glitch) : 0;
    if (gl2 > 0 && hash(slot * 7 + 3) < .5 * gl2) { ctx.globalAlpha = .45; ctx.drawImage(L.cy, L.lx - 3, L.ly); ctx.drawImage(L.rd, L.lx + 3, L.ly); ctx.globalAlpha = 1 }
    for (var i = 0; i < 8; i++) ctx.drawImage(i === 3 && !d2 ? L.off[i] : L.on[i], L.lx + L.xs[i], L.ly);
    if (gl2 > 0) for (var k = 0; k < 3; k++) { var h0 = hash(slot * 13 + k * 101); if (h0 < .35 * gl2) { var sy = (h0 * 1000 | 0) % (L.full.height - 6), sh = 3 + ((h0 * 7919) | 0) % 8, dx = (((h0 * 100) | 0) % 2 ? 1 : -1) * (3 + ((h0 * 977) | 0) % 10); ctx.drawImage(L.full, 0, sy, L.full.width, sh, L.lx + dx, L.ly + sy, L.full.width, sh) } }
    ctx.drawImage(L.open[FLK_OPEN[slot % FLK_OPEN.length] === '1' ? 0 : 1], L.ox, L.oy, L.open[0].width * 2, L.open[0].height * 2);
    // la riga pomodoro della scadenza sotto il pannello: si riempie come un orologio
    var rk = o.rule != null ? o.rule : ((t % 6) / 5), rw = Math.round((L.w - 64) * Math.min(1, rk)), ry = L.rule;
    ctx.fillStyle = '#26262A'; ctx.fillRect(32, ry, L.w - 64, 2); ctx.fillStyle = C.tomato; ctx.fillRect(32, ry, rw, 2);
    if (rk >= 1 && !reduced && ((t * 20) | 0) % 3 === 0) { ctx.fillStyle = C.t4; ctx.fillRect(L.w - 46, ry - 2, 12, 2) }
    ctx.restore();
  };
  ART.logoSize = function () { var L = LG2 || buildLogo2(); return { w: Math.round(L.w / 2), h: Math.round(L.h / 2) } };
  ART.size.logo = { w: 244, h: 101 };
  var GLOW_OLD = ART.glow;
  ART.glow = function (name, size) {
    if (name === 'logo') { if (!GLOWS.logo2) { var L = LG2 || buildLogo2(), c = mk(L.full.width, L.full.height); c.g.drawImage(L.full, 0, 0); var st = blurStamp(c.c, 12, 1, 10); st.gw = st.width / 2; st.gh = st.height / 2; st.ox = (L.lx - 12 - L.w / 2) / 2; st.oy = (L.ly - 12) / 2; GLOWS.logo2 = st } return GLOWS.logo2 }
    return GLOW_OLD(name, size);
  };

  // ======================================================================================
  // FIREWALL v2: barriera tecnologica. Due piloni, griglia di mattoni di luce fredda, targhetta FIREWALL.
  // La maschera resta 36x14 (pixel di gioco); i pezzi rotti hanno il bordo che brilla.
  var FW2 = null;
  function buildFirewall2() {
    var w = 72, h = 28, g = grid(w, h);
    // piloni
    [[0, 1], [66, -1]].forEach(function (p) { gr(g, p[0], 0, 6, 28, 'm'); gr(g, p[0], 0, 6, 1, 'M'); gr(g, p[0] + (p[1] > 0 ? 5 : 0), 1, 1, 27, 'n'); gr(g, p[0] + 2, 4, 2, 2, 'l'); gr(g, p[0] + 2, 10, 2, 2, 'L'); gr(g, p[0] + 2, 22, 2, 3, 'n') });
    // mattoni di luce
    for (var r = 0; r < 7; r++) for (var c = 0; c < 8; c++) { var off = (r % 2) * 4, bx = 6 + c * 8 + off - (r % 2 ? 4 : 0), by = r * 4; if (bx < 6 || bx + 7 > 66) { var x0 = Math.max(6, bx), x1 = Math.min(66, bx + 7); if (x1 - x0 < 2) continue; gr(g, x0, by, x1 - x0, 3, 'b'); gr(g, x0, by, x1 - x0, 1, 'B'); continue } gr(g, bx, by, 7, 3, 'b'); gr(g, bx, by, 7, 1, 'B'); gs(g, bx + 1, by + 1, 'w') }
    // targhetta
    gr(g, 18, 10, 36, 9, 'k'); gr(g, 18, 10, 36, 1, 'n'); gtext(g, 'FIREWALL', 21, 12, 'c');
    var c2 = can(g, { m: C.g3, M: C.g1, n: C.g4, l: '#7FD8FF', L: C.tomato, b: '#3E8EA8', B: '#A8E8F4', w: C.hot, k: C.night, c: C.cream });
    FW2 = { c: c2, d: px(c2).data };
  }
  var FW2C = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  ART.firewallMask = function () { if (!FW2) buildFirewall2(); var m = new Uint8Array(36 * 14); for (var y = 0; y < 14; y++) for (var x = 0; x < 36; x++) { var i = ((y * 2) * 72 + x * 2) * 4, j = i + 4, k2 = i + 72 * 4 + 4; m[y * 36 + x] = (FW2.d[i + 3] || FW2.d[j + 3] || FW2.d[k2 + 3]) ? 1 : 0 } return m };
  ART.firewall = function (ctx, x, y, mask) {
    if (!FW2) buildFirewall2(); var S = SC(ctx);
    if (!mask) { if (S === 2) ctx.drawImage(FW2.c, Math.round(x * 2), Math.round(y * 2)); else ctx.drawImage(FW2.c, Math.round(x), Math.round(y), 36, 14); return }
    var e = FW2C && FW2C.get(mask), sum = 0; for (var i = 0; i < mask.length; i++) sum += mask[i];
    if (!e) { e = { s: mk(72, 28), sum: -1 }; e.id = e.s.g.createImageData(72, 28); FW2C && FW2C.set(mask, e) }
    if (e.sum !== sum) {
      var q = e.id.data, d = FW2.d, hot = rgb(C.hot), lb = rgb('#A8E8F4');
      for (var gy = 0; gy < 14; gy++) for (var gx = 0; gx < 36; gx++) { var on = mask[gy * 36 + gx], brk = on && ((gx > 0 && !mask[gy * 36 + gx - 1]) || (gx < 35 && !mask[gy * 36 + gx + 1]) || (gy > 0 && !mask[(gy - 1) * 36 + gx]) || (gy < 13 && !mask[(gy + 1) * 36 + gx]));
        for (var yy = 0; yy < 2; yy++) for (var xx = 0; xx < 2; xx++) { var o = ((gy * 2 + yy) * 72 + gx * 2 + xx) * 4; if (!on || !d[o + 3]) { q[o + 3] = 0; continue } if (brk) { var c = (xx + yy) % 2 ? hot : lb; q[o] = c[0]; q[o + 1] = c[1]; q[o + 2] = c[2]; q[o + 3] = 255 } else { q[o] = d[o]; q[o + 1] = d[o + 1]; q[o + 2] = d[o + 2]; q[o + 3] = d[o + 3] } } }
      e.s.g.putImageData(e.id, 0, 0); e.sum = sum;
    }
    if (S === 2) ctx.drawImage(e.s.c, Math.round(x * 2), Math.round(y * 2)); else ctx.drawImage(e.s.c, Math.round(x), Math.round(y), 36, 14);
  };

  // ======================================================================================
  // HUD = la plancia della Control Room. Tutto in coordinate di gioco; su canvas HD si scala x2 (pixel netti).
  function hudBegin(ctx) { var S = SC(ctx); ctx.save(); if (S === 2) ctx.scale(2, 2); return S }
  function techFrame(ctx, x, y, w, h, col, fill) {
    ctx.fillStyle = fill || 'rgba(12,12,14,0.78)'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(244,242,236,0.3)'; ctx.fillRect(x, y, w, 1); ctx.fillRect(x, y + h - 1, w, 1); ctx.fillRect(x, y, 1, h); ctx.fillRect(x + w - 1, y, 1, h);
    ctx.fillStyle = col || C.cream; [[x, y, 1, 1], [x + w - 1, y, -1, 1], [x, y + h - 1, 1, -1], [x + w - 1, y + h - 1, -1, -1]].forEach(function (q) { ctx.fillRect(q[2] > 0 ? q[0] : q[0] - 2, q[1], 3, 1); ctx.fillRect(q[0], q[3] > 0 ? q[1] : q[1] - 2, 1, 3) });
  }
  ART.techFrame = function (ctx, x, y, w, h, col, fill) { hudBegin(ctx); techFrame(ctx, x, y, w, h, col, fill); ctx.restore() };
  // la giornata: nome intero, ora, barra 09-17 con la lancetta; OVERTIME rosso quando arriva il boss
  ART.hudClock = function (ctx, x, y, w, k, day, t, o) {
    o = o || {}; hudBegin(ctx); var ot = !!o.overtime, col = ot ? C.crim3 : C.cream, h = 17;
    techFrame(ctx, x, y, w, h, ot ? C.crim3 : C.cream);
    var nm = ART.dayName(day || ART.day); text(ctx, nm, x + 4, y + 3, { color: C.cream });
    var mins = Math.round(Math.max(0, Math.min(1, k)) * 480), hh = 9 + Math.floor(mins / 60), mm = mins % 60, clock = (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
    if (ot) { if (((t * 3) | 0) % 2 === 0) tiny(ctx, 'OVERTIME', x + w - 36, y + 4, C.crim3) } else digits(ctx, clock, x + w - 28, y + 3, C.cream);
    var bx = x + 4, by = y + 12, bw = w - 8; ctx.fillStyle = C.g4; ctx.fillRect(bx, by, bw, 2);
    for (var hr = 0; hr <= 8; hr++) { ctx.fillStyle = hr % 4 ? C.g3 : C.g2; ctx.fillRect(bx + Math.round(bw * hr / 8), by + 2, 1, hr % 4 ? 1 : 2) }
    ctx.fillStyle = ot ? C.crim3 : C.tomato; ctx.fillRect(bx, by, Math.round(bw * Math.min(1, k)), 2);
    var hx = bx + Math.round(bw * Math.min(1, k)); ctx.fillStyle = ot ? '#FF6A7A' : C.t4; ctx.fillRect(hx, by - 2, 1, 6);
    ctx.restore();
  };
  // HOURS SAVED: tamburi che rotolano (value puo' essere decimale: la cifra delle unita' gira a meta')
  ART.hudCounter = function (ctx, x, y, value, t, o) {
    o = o || {}; hudBegin(ctx); var n = o.digits || 4, cw = 8, w = n * cw + 2, lbl = o.label || 'HOURS SAVED', lw = tinyWidth(lbl);
    var W2 = Math.max(w, lw) + 8; techFrame(ctx, x - W2 / 2, y, W2, 19);
    tiny(ctx, lbl, Math.round(x - lw / 2), y + 2, C.g1);
    var v = Math.max(0, value), frac = v - Math.floor(v), iv = Math.floor(v), x0 = Math.round(x - w / 2), y0 = y + 9;
    for (var i = 0; i < n; i++) {
      var p = Math.pow(10, n - 1 - i), d = Math.floor(iv / p) % 10, roll = i === n - 1 ? frac : (((iv % p) === p - 1) ? frac : 0);
      ctx.fillStyle = '#0A0A0B'; ctx.fillRect(x0 + i * cw, y0 - 1, cw - 1, 9);
      ctx.save(); ctx.beginPath(); ctx.rect(x0 + i * cw, y0 - 1, cw - 1, 9); ctx.clip();
      var oy2 = Math.round(roll * 8); digits(ctx, String(d), x0 + i * cw + 1, y0 + 1 - oy2, C.cream); digits(ctx, String((d + 1) % 10), x0 + i * cw + 1, y0 + 9 - oy2, C.cream);
      ctx.restore(); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(x0 + i * cw, y0 - 1, cw - 1, 1);
    }
    ctx.restore();
  };
  ART.hudCups = function (ctx, x, y, n, max, t, spillK) {
    hudBegin(ctx); max = max || 3; var w = max * 9 + 6; techFrame(ctx, x - w, y, w, 19); tiny(ctx, 'ENERGY', x - w + 3, y + 2, C.g1); ctx.restore();
    for (var i = 0; i < max; i++) { var ix = x - w + 3 + i * 9, iy = y + 9; if (i < n) ART.icon(ctx, 'coffee', ix, iy, ((t * 4) | 0) + i); else if (i === n && spillK != null && spillK < 1) ART.icon(ctx, 'coffeeSpill', ix, iy, Math.min(2, (spillK * 3) | 0)); else ART.icon(ctx, 'coffeeEmpty', ix, iy) }
  };
  // insegna dell'azienda: OPEN / CLOSED / BRB al neon (sfarfalla se l'azienda soffre)
  var SIGNS = {};
  ART.hudSign = function (ctx, x, y, state, t, hurt) {
    state = state || 'OPEN'; if (!SIGNS[state]) { var m = mk(tinyWidth(state) + 4, 9); tiny(m.g, state, 2, 2, '#ffffff'); var col = state === 'CLOSED' ? C.crim3 : state === 'BRB' ? '#FFC56A' : C.cream; SIGNS[state] = [neonize(m.c, col, true), neonize(m.c, col, false)] }
    var on = !hurt || '1101110111011011'[((t * 14) | 0) % 16] === '1'; hudBegin(ctx); var c = SIGNS[state][on ? 0 : 1];
    ctx.fillStyle = 'rgba(12,12,14,0.85)'; ctx.fillRect(x - 2, y - 1, c.width + 4, c.height + 2); ctx.drawImage(c, x, y); ctx.restore();
  };
  // i sistemi installati: icone accese o spente, NIGHT SHIFT con la carica e il tasto
  ART.hudSystems = function (ctx, x, y, s, t) {
    s = s || {}; var K = ['booking', 'auto', 'ai', 'night'], w = K.length * 12 + 6; hudBegin(ctx); techFrame(ctx, x - w, y, w, 19); tiny(ctx, 'SYSTEMS', x - w + 3, y + 2, C.g1); ctx.restore();
    K.forEach(function (k, i) {
      var ix = x - w + 4 + i * 12, iy = y + 9, on = !!s[k]; if (!on) { ctx.globalAlpha = .3 } ART.icon(ctx, k, ix, iy); ctx.globalAlpha = 1;
      if (k === 'night' && on) { var ch = typeof s.nightCharge === 'number' ? s.nightCharge : 1; hudBegin(ctx); ctx.fillStyle = C.g4; ctx.fillRect(ix, iy + 8, 7, 1); ctx.fillStyle = ch >= 1 && ((t * 3) | 0) % 2 ? C.t4 : C.tomato; ctx.fillRect(ix, iy + 8, Math.round(7 * ch), 1); if (s.key) tiny(ctx, s.key, ix + 9, iy + 1, C.cream); ctx.restore() }
    });
  };
  // card SYSTEM INSTALLED: si apre a tendina, icona grande, nome, riga
  ART.systemCard = function (ctx, kind, t, o) {
    o = o || {}; var I = CAPK[kind] || CAPK.auto, k = Math.min(1, t / .5), w = 200, h = Math.round(70 * k), x = 240 - w / 2, y = 135 - h / 2;
    hudBegin(ctx); techFrame(ctx, x, y, w, Math.max(3, h), I.col, 'rgba(10,10,12,0.92)');
    if (k >= 1) {
      tiny(ctx, 'SYSTEM INSTALLED', 240 - tinyWidth('SYSTEM INSTALLED') / 2, y + 6, C.tomato);
      text(ctx, o.name || I.name, 240, y + 16, { align: 'c', color: I.col, size: 2 });
      var ln = o.line || I.line; tiny(ctx, ln, 240 - tinyWidth(ln) / 2, y + 38, C.cream);
      ctx.fillStyle = I.col; ctx.fillRect(x + 20, y + 50, Math.round((w - 40) * Math.min(1, (t - .5) / .8)), 1);
    }
    ctx.restore();
    if (k >= 1) { var c = CAPS2[kind] && CAPS2[kind][0]; if (c) putC(ctx, c, x + 22, y + 34, SC(ctx)); if (c) putC(ctx, c, x + w - 22, y + 34, SC(ctx)) }
  };
  // etichetta che indica (tutorial in gioco)
  ART.hint = function (ctx, x, y, str, dir, t) {
    hudBegin(ctx); var w = tinyWidth(str) + 8, h = 11, bob = Math.round(Math.sin(t * 6) * 1.5), bx, by;
    dir = dir || 'down'; if (dir === 'down') { bx = x - w / 2; by = y - h - 6 + bob } else if (dir === 'up') { bx = x - w / 2; by = y + 6 - bob } else if (dir === 'left') { bx = x + 6 - bob; by = y - h / 2 } else { bx = x - w - 6 + bob; by = y - h / 2 }
    bx = Math.round(Math.max(2, Math.min(478 - w, bx))); by = Math.round(by);
    ctx.fillStyle = C.cream; ctx.fillRect(bx, by, w, h); tiny(ctx, str, bx + 4, by + 3, C.ink);
    ctx.fillStyle = C.cream; for (var i = 0; i < 4; i++) { if (dir === 'down') ctx.fillRect(Math.round(x) - 3 + i, by + h + i, 7 - i * 2, 1); else if (dir === 'up') ctx.fillRect(Math.round(x) - 3 + i, by - 1 - i, 7 - i * 2, 1); else if (dir === 'left') ctx.fillRect(bx - 1 - i, Math.round(y) - 3 + i, 1, 7 - i * 2); else ctx.fillRect(bx + w + i, Math.round(y) - 3 + i, 1, 7 - i * 2) }
    ctx.restore();
  };
  // "+3h" che vola verso il contatore
  ART.plus = function (ctx, x, y, str, k) { hudBegin(ctx); ctx.globalAlpha = k > .8 ? (1 - k) / .2 : 1; text(ctx, str, Math.round(x), Math.round(y), { color: C.cream, shadow: true }); ctx.globalAlpha = 1; ctx.restore() };

  // ======================================================================================
  // GIOVEDI': IL VIRUS dentro il server. Sfondo del rack, celle che si allargano, il nucleo.
  var RACK = null;
  function buildRack() {
    var s = mk(W, H), g = s.g, R = rnd(31);
    g.fillStyle = '#0B100A'; g.fillRect(0, 0, W, H);
    // scheda: griglia a celle 12x12 (la stessa delle celle del virus), piste e saldature
    for (var y = 0; y < H; y += 12) for (var x = 0; x < W; x += 12) { g.fillStyle = (x / 12 + y / 12) % 2 ? '#0E140C' : '#0C120A'; g.fillRect(x, y, 12, 12); g.fillStyle = '#16200F'; g.fillRect(x, y, 12, 1); g.fillRect(x, y, 1, 12) }
    g.fillStyle = '#22301A'; for (var i = 0; i < 60; i++) { var px0 = ((R() * 40) | 0) * 12, py0 = ((R() * 22) | 0) * 12, len = 2 + ((R() * 6) | 0); if (R() < .5) g.fillRect(px0, py0 + 6, len * 12, 1); else g.fillRect(px0 + 6, py0, 1, len * 12); g.fillRect(px0 + 5, py0 + 5, 3, 3) }
    // binari del rack ai lati con i fori
    [0, W - 22].forEach(function (rx) { g.fillStyle = '#2A2D2C'; g.fillRect(rx, 0, 22, H); g.fillStyle = '#4A4E4C'; g.fillRect(rx + (rx ? 0 : 21), 0, 1, H); for (var yy = 4; yy < H; yy += 10) { g.fillStyle = '#121211'; g.fillRect(rx + 8, yy, 6, 4) } });
    // cavi che pendono dall'alto
    [[60, '#3A5078'], [140, '#5A2A52'], [300, '#7E8580'], [420, '#3A4A2A']].forEach(function (c) { g.fillStyle = c[1]; for (var t2 = 0; t2 < 1; t2 += .004) { var cx = c[0] + Math.sin(t2 * 3) * 18, cy = t2 * 46; g.fillRect(Math.round(cx), Math.round(cy), 3, 2) } });
    tiny(g, 'RACK 02', 26, 4, C.g2); tiny(g, 'DO NOT UNPLUG', W - 80, 4, C.g2);
    var leds = []; for (var j = 0; j < 40; j++) leds.push([R() < .5 ? 4 + ((R() * 3) | 0) * 5 : W - 18 + ((R() * 3) | 0) * 5, 6 + ((R() * 26) | 0) * 10, R()]);
    RACK = { c: s.c, leds: leds };
  }
  ART.serverBg = function (ctx, t) {
    if (!RACK) buildRack(); ctx.drawImage(RACK.c, 0, 0);
    for (var i = 0; i < RACK.leds.length; i++) { var l = RACK.leds[i], on = ((t * (2 + l[2] * 6) + l[2] * 10) % 1) < .5; ctx.fillStyle = on ? (i % 5 ? '#C6EE48' : C.crim3) : '#1A2414'; ctx.fillRect(l[0], l[1], 2, 1) }
  };
  ART.virusCellSize = 12;
  var VCELL = null, VCORE = null;
  function buildVirus() {
    VCELL = [0, 1, 2, 3].map(function (st) { return [0, 1].map(function (p) {
      var g = grid(24, 24), r = [4, 7, 9.5, 11.5][st] + (p ? .6 : 0);
      gell(g, 12, 12, r, r, 'G'); gell(g, 12, 12, r - 1.5, r - 1.5, 'g'); if (st > 1) { gell(g, 10, 10, r * .35, r * .35, 'h'); for (var k = 0; k < 6; k++) { var a = k * 1.047 + p * .5; gs(g, Math.round(12 + Math.cos(a) * (r + 1)), Math.round(12 + Math.sin(a) * (r + 1)), 'G') } }
      if (st === 3) { gell(g, 7, 15, 1.5, 1.5, 'G'); gell(g, 16, 8, 1.2, 1.2, 'G') }
      return lightUp(can(g, { G: '#4E6A16', g: '#9ACD32', h: '#E6FF9A' }), 'thu', { top: 0, rim: false });
    }) });
    VCORE = [0, 1, 2, 3].map(function (f) {
      var g = grid(72, 72), cx = 36, cy = 36;
      for (var k = 0; k < 12; k++) { var a = k * Math.PI / 6 + f * .13, x1 = cx + Math.cos(a) * 33, y1 = cy + Math.sin(a) * 33; stampLine(g, cx + Math.cos(a) * 20, cy + Math.sin(a) * 20, x1, y1, 1.6, 'G'); gell(g, x1, y1, 3.2, 3.2, 'g'); gell(g, x1 - .8, y1 - .8, 1.3, 1.3, 'h') }
      gell(g, cx, cy, 22, 22, 'G'); gell(g, cx, cy, 20, 20, 'g'); gell(g, cx - 5, cy - 6, 10, 9, 'h'); gell(g, cx - 7, cy - 9, 4, 3, 'w');
      [[14, 26], [56, 30], [20, 48], [50, 50]].forEach(function (s2) { gell(g, s2[0] * .5 + cx * .5, s2[1] * .5 + cy * .5, 2.2, 2.2, 'G') });
      // faccia: occhi furbi e ghigno
      bigEye(g, cx - 8, cy - 2, 5, 4.5, -1, { anger: 4, pupil: 2.2, pcol: 'k', sclera: 'y' }); bigEye(g, cx + 8, cy - 2, 5, 4.5, 1, { anger: 4, pupil: 2.2, pcol: 'k', sclera: 'y' });
      for (var x = cx - 9; x <= cx + 9; x++) { var y = Math.round(cy + 10 + (x - cx) * (x - cx) * .03); gs(g, x, y, 'k'); gs(g, x, y + 1, 'k'); if ((x - cx) % 3 === 0 && Math.abs(x - cx) < 8) gs(g, x, y + 2, 'y') }
      return lightUp(can(g, { G: '#3E5A10', g: '#9ACD32', h: '#D6F47A', w: C.hot, k: C.ink, y: '#F4F2EC' }), 'thu', { top: .2 });
    });
    VCORE.flash = VCORE.map(function (c) { return solid(c, C.cream) });
  }
  // cella del virus: x,y = centro in coordinate di gioco; k 0..1 = crescita
  ART.virusCell = function (ctx, x, y, t, k) { if (!VCELL) buildVirus(); var st = Math.max(0, Math.min(3, Math.floor((k == null ? 1 : k) * 4 - .001))), p = ((t * 3 + x * .07 + y * .05) | 0) % 2; putC(ctx, VCELL[st][p], x, y, SC(ctx)) };
  ART.virusCore = function (ctx, x, y, t, s) { if (!VCELL) buildVirus(); s = s || {}; var f = ((t * 8) | 0) % 4, S = SC(ctx), pul = Math.round(Math.sin(t * 6)); putC(ctx, VCORE[f], x, y + pul, S); if (s.hit > 0) { ctx.globalAlpha = Math.min(1, s.hit); putC(ctx, VCORE.flash[f], x, y + pul, S); ctx.globalAlpha = 1 } };
  ART.size.virusCore = { w: 36, h: 36 };

  // ======================================================================================
  // VENERDI': LA CONSEGNA. Pacchi con l'icona del negozio, il negozio giusto acceso in basso.
  var SHOPI = {};
  function shopIconGrid(kind) {
    var g = grid(12, 12);
    if (kind === 'food') { gr(g, 2, 4, 7, 6, 'c'); gr(g, 3, 9, 5, 1, 'c'); gr(g, 9, 5, 2, 3, 'c'); gs(g, 4, 1, 'c'); gs(g, 6, 2, 'c'); gs(g, 4, 2, 'c') }
    else if (kind === 'fashion') { gs(g, 6, 1, 'c'); gs(g, 6, 2, 'c'); gl(g, 6, 3, 1, 8, 'c'); gl(g, 6, 3, 11, 8, 'c'); gr(g, 1, 8, 11, 1, 'c') }
    else if (kind === 'shop') { gr(g, 2, 4, 8, 7, 'c'); gr(g, 3, 5, 6, 5, '.'); gr(g, 4, 1, 1, 4, 'c'); gr(g, 7, 1, 1, 4, 'c'); gr(g, 4, 1, 4, 1, 'c') }
    else if (kind === 'beauty') { gr(g, 4, 5, 4, 6, 'c'); gr(g, 5, 2, 2, 3, 'c'); gs(g, 6, 1, 'c'); gr(g, 4, 7, 4, 1, '.') }
    else if (kind === 'hotel') { gr(g, 1, 6, 10, 3, 'c'); gr(g, 1, 4, 1, 6, 'c'); gr(g, 2, 5, 3, 1, 'c'); gs(g, 1, 10, 'c'); gs(g, 10, 10, 'c') }
    else { gl(g, 2, 9, 7, 4, 'c'); gl(g, 3, 9, 8, 4, 'c'); gell(g, 8.5, 3.5, 2.5, 2.5, 'c'); gs(g, 9, 3, '.'); gs(g, 10, 2, '.') }
    return g;
  }
  ART.shopIcon = function (ctx, kind, x, y, col) { var k = kind + (col || ''); if (!SHOPI[k]) SHOPI[k] = can(shopIconGrid(kind), { c: col || C.cream }); var S = SC(ctx); if (S === 2) ctx.drawImage(SHOPI[k], Math.round(x * 2), Math.round(y * 2)); else ctx.drawImage(SHOPI[k], Math.round(x), Math.round(y), 6, 6) };
  var PARCEL = {};
  function parcel(kind) {
    if (PARCEL[kind]) return PARCEL[kind];
    var g = grid(36, 34);
    gr(g, 3, 8, 30, 24, 'b'); gr(g, 3, 8, 30, 3, 'B'); gr(g, 30, 8, 3, 24, 'd'); gr(g, 3, 29, 30, 3, 'd');
    gr(g, 16, 8, 4, 24, 't'); gr(g, 16, 8, 4, 3, 'T');
    // etichetta col negozio
    gr(g, 5, 15, 13, 12, 'w'); gr(g, 5, 15, 13, 1, 'W'); var ic = shopIconGrid(kind); for (var y = 0; y < 12; y++) for (var x = 0; x < 12; x++) if (ic.a[y][x] === 'c') gs(g, 6 + Math.round(x * 11 / 12), 15 + Math.round(y * 11 / 12), 'k');
    // nastro e manico
    gr(g, 12, 2, 12, 2, 'm'); gr(g, 12, 2, 2, 6, 'm'); gr(g, 22, 2, 2, 6, 'm');
    var c = lightUp(can(g, { b: '#B8864E', B: '#D8A86A', d: '#8A5E30', t: '#E9D8A8', T: '#F4E8C4', w: C.p0, W: C.p1, k: C.ink, m: C.g3 }), 'fri', { top: .25 });
    return (PARCEL[kind] = c);
  }
  ART.parcel = function (ctx, kind, x, y, t, s) { s = s || {}; var S = SC(ctx), bob = s.carried ? 0 : Math.round(Math.sin(t * 3) * 1.5), sw = s.carried ? 0 : Math.sin(t * 2) * 1; putC(ctx, parcel(kind || 'shop'), x + sw, y + bob, S); if (s.glow) { var hd = Math.round(Math.sin(t * 8) * .5 + .5); if (hd) { ctx.fillStyle = C.cream; var r = 11 * S; ctx.fillRect(Math.round(x * S) - r, Math.round(y * S) - r, 3 * S, S); ctx.fillRect(Math.round(x * S) + r - 3 * S, Math.round(y * S) - r, 3 * S, S) } } };
  ART.size.parcel = { w: 18, h: 17 };
  // i palazzi della citta' vicina con il loro tipo (per scegliere il negozio di destinazione)
  // i negozi della strada che scorre (V3): stessa striscia di ART.street, stesso scroll
  ART.streetShops = function (day, scroll) { day = DAYS[day] ? day : ART.day; var S0 = buildStreet(day), off = (((scroll || 0) * .6) % STR_W + STR_W) % STR_W, out = []; for (var i = 0; i < S0.B.length; i++) { var b = S0.B[i], x = ((b.x - off) % STR_W + STR_W) % STR_W; if (x > W) x -= STR_W; if (x + b.w > 4 && x < W - 4) out.push({ i: i, kind: b.kind, x: x, w: b.w, top: STREET - b.h, cx: x + b.w / 2 }) } return out };
  ART.nearShops = function (shift) { var B = nearLayout(), out = []; for (var i = 0; i < B.length; i++) { var b = B[i], x = b.x - 8 + (shift || 0); if (x + b.w > 4 && x < W - 4) out.push({ i: i, kind: b.kind, x: x, w: b.w, top: STREET - b.h, cx: x + b.w / 2 }) } return out };
  // il negozio di destinazione: freccia che pulsa, insegna OPEN al neon, icona del negozio
  ART.targetShop = function (ctx, shop, t, o) {
    o = o || {}; hudBegin(ctx); var cx = Math.round(shop.cx), top = shop.top, b = Math.round(Math.sin(t * 6) * 2);
    ctx.globalAlpha = .25 + .15 * Math.sin(t * 8); ctx.fillStyle = C.cream; ctx.fillRect(shop.x, top, shop.w, STREET - top); ctx.globalAlpha = 1;
    ctx.fillStyle = C.cream; for (var i = 0; i < 5; i++) ctx.fillRect(cx - 4 + i, top - 14 + b + i, 9 - i * 2, 1); ctx.fillRect(cx - 1, top - 20 + b, 3, 6);
    ctx.restore();
    ART.hudSign(ctx, cx - 9, top - 30 + b, 'OPEN', t, false);
    ART.shopIcon(ctx, shop.kind, cx + 12, top - 30 + b, C.cream);
  };

  // ======================================================================================
  // BOTTONI E PULSANTIERA (per CORE, anche sul DOM): disegnati su un canvas qualunque in pixel del canvas.
  // u = dimensione del pixel (intero). uiButton: kind 'primary' | 'secondary' | 'icon', o.label o o.icon
  // ('pause','play','sound','mute','close','map'). pad: la pulsantiera stile Game Boy di Mother Machine.
  function ui_px(ctx, u) { return function (x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x * u, y * u, w * u, h * u) } }
  var UI_ICONS = { pause: ['##.##', '##.##', '##.##', '##.##', '##.##'], play: ['#....', '###..', '#####', '###..', '#....'], sound: ['..#.#', '.##..', '###.#', '.##..', '..#.#'], mute: ['..#..', '.##..', '###.#', '.##.#', '..#..'], close: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'], map: ['#.#.#', '###.#', '#.###', '#.#.#', '#.#.#'] };
  ART.uiButton = function (ctx, kind, x, y, w, h, state, o) {
    o = o || {}; var u = o.u || Math.max(1, Math.floor(Math.min(w, h) / 14)), X = Math.round(x / u), Y = Math.round(y / u), Wd = Math.floor(w / u), Hd = Math.floor(h / u), P = ui_px(ctx, u), down = state === 'down', hov = state === 'hover';
    var face = kind === 'primary' ? (hov ? C.t3 : C.tomato) : kind === 'secondary' ? (hov ? '#2A2A2C' : '#18181A') : (hov ? '#2A2A2C' : '#121214'), ink = kind === 'primary' ? C.night : C.cream, dy = down ? 2 : 0;
    // ombra / spessore del tasto
    if (!down) { P(X + 1, Y + 3, Wd - 2, Hd - 2, '#050505'); P(X + 2, Y + Hd - 2, Wd - 4, 2, kind === 'primary' ? C.t0 : '#000000') }
    // corpo con gli angoli tagliati (machine)
    P(X + 1, Y + dy, Wd - 2, Hd - 2, C.night); P(X, Y + 1 + dy, Wd, Hd - 4, C.night);
    P(X + 2, Y + 1 + dy, Wd - 4, Hd - 4, face); P(X + 1, Y + 2 + dy, Wd - 2, Hd - 6, face);
    P(X + 2, Y + 1 + dy, Wd - 4, 1, kind === 'primary' ? C.t4 : 'rgba(244,242,236,0.35)');
    if (kind !== 'primary') { P(X + 1, Y + 2 + dy, 1, Hd - 6, 'rgba(244,242,236,0.25)') }
    var lbl = o.label, ic = o.icon && UI_ICONS[o.icon];
    ctx.save(); ctx.scale(u, u);
    if (ic) { var ix = X + Math.round((Wd - 5) / 2), iy = Y + Math.round((Hd - 2 - 5) / 2) + dy; ctx.fillStyle = ink; for (var r = 0; r < 5; r++) for (var c = 0; c < 5; c++) if (ic[r][c] === '#') ctx.fillRect(ix + c, iy + r, 1, 1) }
    else if (lbl) { var tw = textWidth(lbl, 1); text(ctx, lbl, X + Math.round((Wd - tw) / 2), Y + Math.round((Hd - 2 - 7) / 2) + dy, { color: ink }) }
    ctx.restore();
  };
  // pulsantiera: corpo notte arrotondato (mother), croce squadrata (machine), A pomodoro, B crema, START e SELECT
  ART.padLayout = function (w, h) {
    var s = Math.min(w / 160, h / 96), cx = w * .27, cy = h * .46, ax = w * .83, ay = h * .36, bx = w * .64, by = h * .56, d = 14 * s;
    return { up: [cx - d / 2, cy - d * 1.5, d, d], down: [cx - d / 2, cy + d * .5, d, d], left: [cx - d * 1.5, cy - d / 2, d, d], right: [cx + d * .5, cy - d / 2, d, d], a: [ax - 12 * s, ay - 12 * s, 24 * s, 24 * s], b: [bx - 12 * s, by - 12 * s, 24 * s, 24 * s], select: [w * .3, h * .8, 22 * s, 7 * s], start: [w * .5, h * .8, 22 * s, 7 * s], s: s };
  };
  ART.pad = function (ctx, x, y, w, h, st, o) {
    st = st || {}; o = o || {}; var L = ART.padLayout(w, h), s = L.s, u = Math.max(1, Math.round(s)), tu = Math.max(1, Math.round(s * .7));
    ctx.save(); ctx.translate(Math.round(x), Math.round(y));
    // corpo
    var r = Math.round(14 * s); ctx.fillStyle = '#121214'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w, h - r * 2); ctx.quadraticCurveTo(w, h, w - r * 2, h); ctx.lineTo(r, h); ctx.quadraticCurveTo(0, h, 0, h - r); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(244,242,236,0.12)'; ctx.fillRect(0, 0, w, u);
    // marchio
    var mm = markCanvas(Math.max(8, Math.round(9 * s)), C.g2); ctx.drawImage(mm, Math.round(8 * s), Math.round(6 * s)); ART.tinyScaled(ctx, 'MOTHER MACHINE', Math.round(8 * s + mm.width + 4 * s), Math.round(6 * s + (mm.height - 5 * tu) / 2), tu, C.g2);
    // croce
    var cx = L.up[0] + L.up[2] / 2, cyy = L.left[1] + L.left[3] / 2, d = L.up[2];
    ctx.fillStyle = '#050505'; ctx.fillRect(Math.round(cx - d / 2 - u), Math.round(cyy - d * 1.5 - u + 2 * u), Math.round(d + 2 * u), Math.round(d * 3 + 2 * u)); ctx.fillRect(Math.round(cx - d * 1.5 - u), Math.round(cyy - d / 2 - u + 2 * u), Math.round(d * 3 + 2 * u), Math.round(d + 2 * u));
    ctx.fillStyle = '#2A2D2C'; ctx.fillRect(Math.round(cx - d / 2), Math.round(cyy - d * 1.5), Math.round(d), Math.round(d * 3)); ctx.fillRect(Math.round(cx - d * 1.5), Math.round(cyy - d / 2), Math.round(d * 3), Math.round(d));
    ['up', 'down', 'left', 'right'].forEach(function (k) { var R = L[k]; if (st[k]) { ctx.fillStyle = '#4A4E4C'; ctx.fillRect(Math.round(R[0]), Math.round(R[1]), Math.round(R[2]), Math.round(R[3])) } ctx.fillStyle = C.g2; var ax2 = R[0] + R[2] / 2, ay2 = R[1] + R[3] / 2, q = Math.max(1, Math.round(u)); for (var i = 0; i < 3; i++) { if (k === 'up') ctx.fillRect(Math.round(ax2 - i * q), Math.round(ay2 - q + i * q), (i * 2 + 1) * q, q); if (k === 'down') ctx.fillRect(Math.round(ax2 - i * q), Math.round(ay2 + q - i * q), (i * 2 + 1) * q, q); if (k === 'left') ctx.fillRect(Math.round(ax2 - q + i * q), Math.round(ay2 - i * q), q, (i * 2 + 1) * q); if (k === 'right') ctx.fillRect(Math.round(ax2 + q - i * q), Math.round(ay2 - i * q), q, (i * 2 + 1) * q) } });
    ctx.fillStyle = '#1A1C1B'; ctx.fillRect(Math.round(cx - d / 4), Math.round(cyy - d / 4), Math.round(d / 2), Math.round(d / 2));
    // A e B tondi (mother)
    [['a', C.tomato, C.t1, 'A'], ['b', C.cream, C.p2, 'B']].forEach(function (b) { var R = L[b[0]], ccx = R[0] + R[2] / 2, ccy = R[1] + R[3] / 2 + (st[b[0]] ? u * 2 : 0), rr = R[2] / 2; ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.arc(ccx, R[1] + R[3] / 2 + u * 2, rr, 0, 7); ctx.fill(); ctx.fillStyle = b[2]; ctx.beginPath(); ctx.arc(ccx, ccy, rr, 0, 7); ctx.fill(); ctx.fillStyle = b[1]; ctx.beginPath(); ctx.arc(ccx, ccy - u, rr - u, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(Math.round(ccx - rr * .5), Math.round(ccy - rr * .6), Math.round(rr * .5), u); var lb = b[3] + (o.labels && o.labels[b[0]] ? ' ' + o.labels[b[0]] : ''); ART.tinyScaled(ctx, lb, Math.round(ccx - tinyWidth(lb) * tu / 2), Math.round(R[1] + R[3] + 4 * tu), tu, b[0] === 'a' ? C.cream : C.g1) });
    // SELECT e START: pillole inclinate
    [['select', 'SELECT'], ['start', 'START']].forEach(function (b) { var R = L[b[0]], yy = R[1] + (st[b[0]] ? u : 0), hh = R[3]; ctx.fillStyle = '#050505'; ctx.fillRect(Math.round(R[0]), Math.round(R[1] + u), Math.round(R[2]), Math.round(hh)); ctx.fillStyle = st[b[0]] ? '#4A4E4C' : '#3A3D3C'; ctx.beginPath(); ctx.moveTo(R[0] + hh / 2, yy); ctx.lineTo(R[0] + R[2] - hh / 2, yy); ctx.arc(R[0] + R[2] - hh / 2, yy + hh / 2, hh / 2, -1.57, 1.57); ctx.lineTo(R[0] + hh / 2, yy + hh); ctx.arc(R[0] + hh / 2, yy + hh / 2, hh / 2, 1.57, 4.71); ctx.fill(); ART.tinyScaled(ctx, b[1], Math.round(R[0] + R[2] / 2 - tinyWidth(b[1]) * tu / 2), Math.round(R[1] + hh + 3 * tu), tu, C.g2) });
    // griglia dell'altoparlante
    for (var k2 = 0; k2 < 5; k2++) { ctx.fillStyle = '#050505'; ctx.save(); ctx.translate(w - 40 * s + k2 * 5 * s, h - 24 * s); ctx.rotate(-.5); ctx.fillRect(0, 0, Math.max(1, Math.round(1.5 * s)), 14 * s); ctx.restore() }
    ctx.restore();
  };
  ART.tinyScaled = function (ctx, str, x, y, u, col) { ctx.save(); ctx.translate(x, y); ctx.scale(u, u); tiny(ctx, str, 0, 0, col); ctx.restore() };

  // ======================================================================================
  // V3: SCORRIMENTO LATERALE. La nave vista di lato, guarda a destra. E' la m del logo coricata: le tre gambe
  // sono i tre propulsori impilati dietro (fiamme pomodoro verso sinistra), le due anse sono la fusoliera davanti
  // con la cabina; muso a punta, pinne sopra e sotto. s.bank = beccheggio (-1 giu' .. 1 su).
  ART.side = true;
  var SSW = 88, SSH = 56;
  function shipSideHD(pitch) {
    var Q = 4, big = mk(SSW * Q, SSH * Q), b = big.g, cx = SSW / 2, cy = SSH / 2, s = 60 / 1468, s2 = 32 / 680, L = cx - 30;
    b.setTransform(Q, 0, 0, Q, 0, 0); b.translate(cx, cy); b.rotate(-pitch * .16); b.translate(-cx, -cy);
    function poly(P, col) { b.fillStyle = col; b.beginPath(); b.moveTo(P[0][0], P[0][1]); for (var i = 1; i < P.length; i++) b.lineTo(P[i][0], P[i][1]); b.closePath(); b.fill() }
    // pinne (sopra e sotto, verso dietro) e muso
    poly([[L + 22, cy - 14], [L + 6, cy - 24], [L + 1, cy - 24], [L + 12, cy - 12]], '#0000ff');
    poly([[L + 22, cy + 14], [L + 8, cy + 22], [L + 3, cy + 22], [L + 12, cy + 12]], '#0000ff');
    poly([[L + 54, cy - 12], [L + 74, cy - 1], [L + 74, cy + 1], [L + 54, cy + 12]], '#ff0000');
    // la m coricata: le gambe a sinistra
    b.save(); b.transform(0, s2, -s, 0, L, cy - 16); for (var k = 0; k < 1; k++) { b.fillStyle = '#ff0000'; b.fill(M_SUB[0]) } b.fillStyle = '#00ff00'; b.fill(M_SUB[1]); b.fill(M_SUB[2]); b.restore();
    var D = b.getImageData(0, 0, SSW * Q, SSH * Q).data, g = grid(SSW, SSH), x, y;
    for (y = 0; y < SSH; y++) for (x = 0; x < SSW; x++) { var i = ((y * Q + 2) * SSW * Q + x * Q + 2) * 4; if (D[i + 3] < 128) continue; g.a[y][x] = D[i + 1] > 128 ? 'G' : D[i + 2] > 128 ? 'W' : 'M' }
    // rastremazione verso il muso: lo spessore cala del 30% andando a destra
    var gt = gclone(g); for (x = 0; x < SSW; x++) { var fx = 1 - .3 * Math.max(0, Math.min(1, (x - L - 20) / 50)); for (y = 0; y < SSH; y++) g.a[y][x] = gg(gt, x, Math.round(cy + (y + .5 - cy) / fx - .5)) }
    var g0 = gclone(g); for (y = 0; y < SSH; y++) for (x = 0; x < SSW; x++) if (g0.a[y][x] === '.' && (gg(g0, x, y - 1) === 'M' || gg(g0, x, y + 1) === 'M')) g.a[y][x] = 'M';
    var src = gclone(g), out = grid(SSW, SSH), gl0 = 1e9, gl1 = -1;
    for (y = 0; y < SSH; y++) for (x = 0; x < SSW; x++) if (src.a[y][x] === 'G') { gl0 = Math.min(gl0, x); gl1 = Math.max(gl1, x) }
    function isB(v) { return v !== '.' }
    for (y = 0; y < SSH; y++) for (x = 0; x < SSW; x++) {
      var r = src.a[y][x]; if (r === '.') continue; var up = !isB(gg(src, x, y - 1)), dn = !isB(gg(src, x, y + 1)), c;
      if (r === 'G') { var upperLoop = y < cy; if (upperLoop && x > gl0 + (gl1 - gl0) * .3) c = gg(src, x, y - 1) !== 'G' ? 'N' : 'n'; else c = gg(src, x, y - 1) !== 'G' ? '2' : (x === gl0 + 6 || x === gl0 + 14) ? '2' : '4' }
      else if (r === 'W') c = up ? '1' : dn ? 'c' : '3';
      else { var du = 0, dd = 0; while (gg(src, x, y - du - 1) === 'M' && du < 30) du++; while (gg(src, x, y + dd + 1) === 'M' && dd < 30) dd++; var tt = du / (du + dd + 1); c = ['1', '0', '0', '1', '1', '2', '2', '3'][Math.min(7, (tt * 8) | 0)]; if (up) c = '0'; if (dn) c = 'c' }
      out.a[y][x] = c;
    }
    // riflesso sulla cabina
    for (y = 0; y < SSH; y++) for (x = 0; x < SSW; x++) if (out.a[y][x] === 'n' && out.a[y - 1] && out.a[y - 1][x] !== 'n' && out.a[y - 1][x] !== 'N') { if (x % 2 === 0) out.a[y][x] = 'g' }
    // propulsori: l'estremita' sinistra di ogni gamba, con l'arco pomodoro
    // propulsori: le estremita' delle tre gambe (calcolate dalla geometria del logo, poi ruotate col beccheggio)
    var eng = [], ang = -pitch * .16, ca = Math.cos(ang), sa = Math.sin(ang);
    [45, 340, 635].forEach(function (lx) { var px0 = L + 1, py0 = cy - 16 + lx * s2, rx = cx + (px0 - cx) * ca - (py0 - cy) * sa, ry = cy + (px0 - cx) * sa + (py0 - cy) * ca, ex = Math.round(rx), ey = Math.round(ry);
      for (var yy = ey - 2; yy <= ey + 2; yy++) { var edge = yy === ey - 2 || yy === ey + 2; for (var xx = ex; xx < ex + 3; xx++) if (out.a[yy] && out.a[yy][xx] && out.a[yy][xx] !== '.') out.a[yy][xx] = xx === ex + 2 ? '4' : '3'; gs(out, ex - 1, yy, edge ? 'd' : 'r'); gs(out, ex - 2, yy, edge ? 'D' : (yy - ey) % 2 ? 'h' : 'r') }
      eng.push([ex - 2, ey - 2, ey + 2]) });
    // emblema m crema sulla fusoliera (la m del logo in 7x7) e sensore = hitbox al centro
    var MM = ['.##.##.', '#..#..#', '#..#..#', '#######', '#..#..#', '#..#..#', '#..#..#'], ex = Math.round(L + 34), ey = Math.round(cy + 3);
    for (y = 0; y < 7; y++) for (x = 0; x < 7; x++) if (MM[y][x] === '#' && out.a[ey + y] && out.a[ey + y][ex + x] && 'n.GN'.indexOf(out.a[ey + y][ex + x]) < 0) out.a[ey + y][ex + x] = 'c';
    var hx = Math.round(cx), hy = Math.round(cy); for (var dd2 = 0; dd2 < 12 && (out.a[hy][hx] === '.' || out.a[hy][hx] === 'n'); dd2++) hx++;
    gr(out, hx - 1, hy - 1, 4, 4, '4'); gr(out, hx, hy, 2, 2, 'w');
    // contorno notte (non sotto: luce dalla citta')
    var f2 = gclone(out); function Af(xx, yy) { var v = gg(f2, xx, yy); return v !== '.' && 'rdDhH'.indexOf(v) < 0 }
    for (y = 0; y < SSH; y++) for (x = 0; x < SSW; x++) if (f2.a[y][x] === '.' && !Af(x, y - 1) && (Af(x - 1, y) || Af(x + 1, y) || Af(x, y + 1))) out.a[y][x] = 'o';
    // luci di via: punta della pinna alta e del muso
    var nav = []; for (x = 0; x < SSW; x++) { if (out.a[Math.round(cy - 23)] && out.a[Math.round(cy - 23)][x] && out.a[Math.round(cy - 23)][x] !== '.' && out.a[Math.round(cy - 23)][x] !== 'o') { nav.push([x, Math.round(cy - 23)]); break } }
    return { c: can(out, SHPAL), eng: eng, nav: nav, hit: [hx + 1 - SSW / 2, hy + 1 - SSH / 2] };
  }
  var SIDES = null, SIDESF = null;
  function sideSet() { if (!SIDES) { SIDES = [-2, -1, 0, 1, 2].map(function (p) { return shipSideHD(p / 2) }); SIDESF = SIDES.map(function (s) { return solid(s.c, C.cream) }); ART.hitbox = { dx: SIDES[2].hit[0] / 2, dy: SIDES[2].hit[1] / 2 } } return SIDES }
  var SHIP_TOP = ART.ship;
  ART.ship = function (ctx, x, y, t, s) {
    s = s || {}; if (!ART.side || s.view === 'top') return SHIP_TOP(ctx, x, y, t, s);
    var S = SC(ctx), set = sideSet(), bb = s.bank || 0, bi = Math.max(0, Math.min(4, Math.round(-bb * 2) + 2)), I = set[bi];
    if (s.shield > 0) { shieldGrab(ctx, x, y, t); shieldGlass(ctx, x, y, t, s.shield, S) }
    putC(ctx, I.c, x, y, S);
    var ox = Math.round(x * S) - (S === 2 ? SSW / 2 : SSW / 4), oy = Math.round(y * S) - (S === 2 ? SSH / 2 : SSH / 4), k = S === 2 ? 1 : .5;
    var th = s.thrust == null ? .5 : s.thrust, fr = (t * 24) | 0, auto = s.power === 'auto';
    for (var i = 0; i < I.eng.length; i++) {
      var e = I.eng[i], len = 4 + Math.round(th * 8) + (auto ? 8 : 0) - ((fr + i) % 3 === 0 ? 2 : 0);
      for (var j = 0; j < len; j++) { var col = j < 2 ? ((fr + i) % 2 ? C.t4 : C.t3) : j < 5 ? C.tomato : j < 8 ? C.t1 : C.t0, hh = Math.max(1, (e[2] - e[1] + 1) - (j > 5 ? 2 : 0) - (j > 9 ? 1 : 0)); if (j > 8 && (j + fr) % 2) continue; ctx.fillStyle = col; ctx.fillRect(Math.round(ox + (e[0] - 1 - j) * k), Math.round(oy + (e[1] + ((e[2] - e[1] + 1 - hh) >> 1)) * k), Math.max(1, Math.round(k)), Math.max(1, Math.round(hh * k))) }
    }
    if (I.nav[0] && ((t * 2.2) | 0) % 2) { ctx.fillStyle = C.cream; ctx.fillRect(Math.round(ox + I.nav[0][0] * k), Math.round(oy + I.nav[0][1] * k), Math.max(1, k * 2) | 0, Math.max(1, k * 2) | 0) }
    if (s.flash) { ctx.globalAlpha = reduced ? .5 : 1; putC(ctx, SIDESF[bi], x, y, S); ctx.globalAlpha = 1 }
    if (s.shield > 0) shieldDraw(ctx, x, y, t, s.shield, S);
  };
  var SHIPFX_TOP = ART.shipFx;
  ART.shipFx = function (ctx, x, y, t, s) {
    s = s || {}; if (!ART.side || s.view === 'top') return SHIPFX_TOP(ctx, x, y, t, s);
    var set = sideSet(), I = set[2], th = s.thrust == null ? .5 : s.thrust, len = (.6 + th) * (s.power === 'auto' ? 2 : 1), f = GLOWS.flame[2];
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < I.eng.length; i++) { var e = I.eng[i], ex = (e[0] - SSW / 2) / 2, ey = ((e[1] + e[2]) / 2 - SSH / 2) / 2, fl = .8 + .2 * Math.sin(t * 40 + i * 2.1), ww = f.gh * len * fl, hh = f.gw * .8; ctx.globalAlpha = .9; ctx.drawImage(f, 0, 0, f.width, f.height, x + ex - ww, y + ey - hh / 2, ww, hh) }
    ctx.restore();
  };
  ART.size.ship = { w: 40, h: 24 };

  // ======================================================================================
  // V3: LA STRADA VICINA che scorre (striscia di 960 px per giorno, si ripete senza giunture) con i pezzi del giorno.
  // ART.street(ctx, day, scroll, t): scroll in pixel di gioco (lo stesso dei livelli lontani), parallasse 0.6.
  var STR_W = 960, STREETS = {};
  function buildStreet(day) {
    if (STREETS[day]) return STREETS[day];
    var d = D(day), oy = CITY_TOP - 24, hgt = H - oy, s = mk(STR_W, hgt), g = s.g, R = rnd(700 + DAYK.indexOf(day) * 13), kinds = ['food', 'services', 'beauty', 'shop', 'hotel', 'fashion'], x = 0, props = [], B = [];
    while (x < STR_W - 10) { var k = kinds[(R() * 6) | 0], w = 22 + ((R() * 22) | 0), h = 16 + ((R() * 22) | 0); if (x + w > STR_W || STR_W - (x + w) < 22) w = STR_W - x; B.push({ x: x, w: w, h: h, kind: k }); x += w + 2 + ((R() * 6) | 0) }
    // pezzi unici del giorno: in alcuni varchi niente palazzo, c'e' la scena
    B.forEach(function (b, i) { var bc = buildingCanvas(b.kind, b.w, b.h, day, false); g.drawImage(bc, b.x, STREET - b.h - oy) });
    // strada bagnata con il riflesso cotto delle finestre accese
    g.fillStyle = mix(d[5], C.night, .5); g.fillRect(0, STREET - oy, STR_W, H - STREET); g.fillStyle = mix(d[5], d[6], .3); g.fillRect(0, STREET - oy, STR_W, 1);
    var img = g.getImageData(0, 0, STR_W, STREET - oy), dd = img.data;
    for (var ry = 0; ry < 12; ry++) { var sy = STREET - oy - 1 - ry * 2; for (var xx = 0; xx < STR_W; xx++) { var i0 = (sy * STR_W + xx) * 4; if (dd[i0] + dd[i0 + 1] + dd[i0 + 2] > 560) { g.fillStyle = 'rgba(' + dd[i0] + ',' + dd[i0 + 1] + ',' + dd[i0 + 2] + ',' + (.32 - ry * .022) + ')'; g.fillRect(xx + ((ry * 7) % 3) - 1, STREET - oy + 1 + ry, 1, 1) } } }
    // pezzi di scena per giorno (posizioni in coordinate della striscia)
    var gaps = B.map(function (b) { return b.x + b.w + 1 });
    if (day === 'tue') gaps.forEach(function (gx, i) { if (i % 3 === 0) { g.fillStyle = mix(d[6], C.cream, .2); g.fillRect(gx - 6, STREET - oy + 4, 12, 1); props.push({ k: 'ripple', x: gx }) } });
    if (day === 'wed') gaps.forEach(function (gx, i) { if (i % 2) return; g.fillStyle = '#2A2D2C'; g.fillRect(gx, STREET - oy - 18, 1, 18); g.fillRect(gx, STREET - oy - 18, 4, 1); g.fillStyle = C.cream; g.fillRect(gx + 3, STREET - oy - 17, 2, 1); props.push({ k: 'lamp', x: gx + 4 }) });
    if (day === 'thu') { gaps.forEach(function (gx, i) { if (i % 2) return; g.fillStyle = '#060805'; g.fillRect(gx - 3, STREET - oy + 3, 7, 2); props.push({ k: 'vent', x: gx }) }); B.forEach(function (b, i) { if (i % 3 === 1 && b.w > 26) props.push({ k: 'acid', x: b.x + 4, y: STREET - b.h + 4, w: ['OPEN', '24H', 'BAR', 'NOODLE'][i % 4] }) }) }
    if (day === 'fri') B.forEach(function (b, i) { if (i % 4 === 0) props.push({ k: 'laser', x: b.x + (b.w >> 1), y: STREET - b.h }) });
    if (day === 'sat') { g.fillStyle = 'rgba(10,4,6,.55)'; B.forEach(function (b) { for (var q = 0; q < 6; q++) g.fillRect(b.x + 4 + q * 3, STREET - oy + q, b.w, 1) }) }
    if (day === 'sun') gaps.forEach(function (gx, i) { if (i % 2) return; var tg = grid(15, 18); gr(tg, 7, 10, 1, 8, 'k'); gell(tg, 7.5, 7, 7, 6.6, 'T'); gell(tg, 7, 6, 5.6, 5, 't'); gs(tg, 4, 3, 'u'); gs(tg, 5, 2, 'u'); gs(tg, 3, 4, 'u'); g.drawImage(lightUp(can(tg, { k: '#2A2D2C', T: '#344A30', t: '#4E6E44', u: '#8AA870' }), 'sun', { top: 0 }), gx - 7, STREET - oy - 17) });
    if (day === 'mon') B.forEach(function (b, i) { if (i % 2) return; g.fillStyle = '#1A0709'; g.fillRect(b.x + 3, STREET - b.h - oy - 2, 3, 2); props.push({ k: 'beacon', x: b.x + 4, y: STREET - b.h - 3 }) });
    if (day === 'tue' || day === 'fri' || day === 'sat') props.push({ k: 'walkers' });
    STREETS[day] = { c: s.c, oy: oy, props: props, B: B }; return STREETS[day];
  }
  ART.street = function (ctx, day, scroll, t) {
    day = DAYS[day] ? day : ART.day; var S0 = buildStreet(day), off = (((scroll || 0) * .6) % STR_W + STR_W) % STR_W, d = D(day);
    ctx.drawImage(S0.c, -Math.round(off), S0.oy); ctx.drawImage(S0.c, STR_W - Math.round(off), S0.oy);
    for (var i = 0; i < S0.props.length; i++) {
      var p = S0.props[i]; if (p.k === 'walkers') continue; var x = ((p.x - off) % STR_W + STR_W) % STR_W; if (x > W + 30) x -= STR_W; if (x < -40 || x > W + 30) continue; x = Math.round(x);
      if (p.k === 'ripple') { var ph = (t * .9 + p.x * .01) % 1; if (ph < .7) { ctx.fillStyle = mix(d[6], C.cream, .4); var r = Math.round(ph * 6); ctx.globalAlpha = .7 - ph; ctx.fillRect(x - r, STREET + 3, 1, 1); ctx.fillRect(x + r, STREET + 3, 1, 1); ctx.globalAlpha = 1 } }
      else if (p.k === 'lamp') { if (!CONE) { var cg = grid(17, 18); for (var y = 0; y < 18; y++) { var hw = 1 + y * .45; for (var x2 = 0; x2 < 17; x2++) if (Math.abs(x2 - 8) <= hw && bay(x2, y) < .55 - y * .02) gs(cg, x2, y, 'c') } CONE = can(cg, { c: '#E8DCF8' }) } ctx.globalAlpha = ((t * 9 + i * 3) | 0) % 23 === 0 ? .1 : .3; ctx.drawImage(CONE, x - 8, STREET - 17); ctx.globalAlpha = 1 }
      else if (p.k === 'vent') { if (!PUFF) PUFF = [2, 3, 4].map(function (r) { var pg = grid(r * 2 + 1, r * 2 + 1); gell(pg, r + .5, r + .5, r, r, 'c'); for (var yy = 0; yy < pg.h; yy++) for (var xx = 0; xx < pg.w; xx++) if (pg.a[yy][xx] === 'c' && bay(xx, yy) > .6) pg.a[yy][xx] = '.'; return can(pg, { c: '#B8C29A' }) }); for (var k = 0; k < 4; k++) { var p2 = (t * .7 + k * .25 + i * .13) % 1, pf = PUFF[Math.min(2, (p2 * 3) | 0)]; ctx.globalAlpha = .45 * (1 - p2); ctx.drawImage(pf, x - (pf.width >> 1) + Math.round(Math.sin(p2 * 5 + i) * 2), STREET + 2 - Math.round(p2 * 24) - (pf.height >> 1)) } ctx.globalAlpha = 1 }
      else if (p.k === 'acid') { if (!p.c) { var m = mk(tinyWidth(p.w) + 4, 9); tiny(m.g, p.w, 2, 2, '#ffffff'); p.c = [neonize(m.c, d[7], true), neonize(m.c, d[7], false)] } var on = '1110111101101111111001111'[(((t * 12) | 0) + i * 7) % 25] === '1' && hash(((t * 12) | 0) * 3 + i) > .12; ctx.drawImage(p.c[on ? 0 : 1], x, p.y) }
      else if (p.k === 'laser') { var an = -Math.PI / 2 + Math.sin(t * (.7 + (i % 3) * .2) + i) * .7, dx = Math.cos(an), dy = Math.sin(an); ctx.fillStyle = i % 2 ? d[7] : C.cream; for (var q = 0; q < 160; q += 2) { var qy = Math.round(p.y + dy * q); if (qy < 12) break; ctx.globalAlpha = .75 - q / 240; ctx.fillRect(Math.round(x + dx * q), qy, 1, 1) } ctx.globalAlpha = 1 }
      else if (p.k === 'beacon') { var ph2 = (t * 2.5 + i * .3) % 1; ctx.fillStyle = ph2 < .5 ? C.crim3 : '#3A0E13'; ctx.fillRect(x, p.y, 1, 1); if (ph2 < .5) { ctx.globalAlpha = .4; ctx.fillRect(x + (ph2 < .25 ? 2 : -4), p.y, 3, 1); ctx.globalAlpha = 1 } }
    }
    // passanti con l'ombrello (camminano nel mondo: scorrono con la strada)
    if (day === 'tue') { if (!UMB) UMB = [C.cream, d[7], C.g2, '#C2627A'].map(function (c) { return can(rows(['.ooo.', 'ouuuo', 'o.k.o', '..k..', '..k..']), { o: C.night, u: c, k: C.g4 }) }); for (var u = 0; u < 6; u++) { var wx = ((hash(u * 9) * STR_W + (u % 2 ? 1 : -1) * t * (8 + u * 2) - off) % STR_W + STR_W) % STR_W; if (wx < W + 10) ctx.drawImage(UMB[u & 3], Math.round(wx), STREET - 5 - (((t * 6 + u) | 0) % 2)) } }
  };
  ART.size.streetTop = CITY_TOP - 24;

  // ======================================================================================
  // V3: LA CITY del titolo. Otto attivita', ognuna con la sua insegna al neon di forma diversa (Blade Runner).
  // Senza vincitore: neon spento FOR RENT / YOUR SIGN HERE nella forma dell'insegna, pronto per il logo.
  // kind: restaurant | streetfood | clothing | hairdresser | supermarket | hotel | cafe | gym (vecchi nomi accettati).
  var KIND2 = { food: 'restaurant', fashion: 'clothing', shop: 'supermarket', beauty: 'hairdresser', hotel: 'hotel', services: 'gym' };
  var BODY = { restaurant: 'food', streetfood: 'shop', clothing: 'fashion', hairdresser: 'beauty', supermarket: 'shop', hotel: 'hotel', cafe: 'food', gym: 'services' };
  var NEONC = { restaurant: '#FF86CF', streetfood: '#FFC56A', clothing: '#B99CFF', hairdresser: '#5FD3FF', supermarket: '#C6EE48', hotel: '#F4F2EC', cafe: '#FFC56A', gym: '#5FD3FF' };
  ART.buildingKinds = ['restaurant', 'streetfood', 'clothing', 'hairdresser', 'supermarket', 'hotel', 'cafe', 'gym'];
  // forma dell'insegna (coordinate relative al palazzo) e dove va il logo
  function signShape(kind, w, h) {
    switch (kind) {
      case 'restaurant': return { t: 'arch', x: Math.round(w / 2 - 20), y: Math.round(h * .42), w: 40, h: 22, slot: { x: Math.round(w / 2 - 14), y: Math.round(h * .42) + 9, w: 28, h: 10 } };
      case 'streetfood': return { t: 'circle', x: Math.round(w * .55), y: h - 40, w: 22, h: 22, slot: { x: Math.round(w * .55) + 4, y: h - 36, w: 14, h: 14 } };
      case 'clothing': return { t: 'blade', x: w - 14, y: 8, w: 12, h: Math.min(60, Math.round(h * .5)), slot: { x: w - 12, y: 12, w: 8, h: Math.min(52, Math.round(h * .5) - 8) } };
      case 'hairdresser': return { t: 'oval', x: Math.round(w / 2 - 16), y: Math.round(h * .3), w: 32, h: 20, slot: { x: Math.round(w / 2 - 11), y: Math.round(h * .3) + 5, w: 22, h: 10 } };
      case 'supermarket': return { t: 'fascia', x: 3, y: Math.round(h * .45), w: w - 6, h: 14, slot: { x: 6, y: Math.round(h * .45) + 3, w: w - 12, h: 8 } };
      case 'hotel': return { t: 'roof', x: 3, y: -16, w: w - 6, h: 16, slot: { x: 5, y: -14, w: w - 10, h: 10 } };
      case 'cafe': return { t: 'circle', x: Math.round(w / 2 - 12), y: Math.round(h * .38), w: 24, h: 24, slot: { x: Math.round(w / 2 - 7), y: Math.round(h * .38) + 5, w: 14, h: 14 } };
      default: return { t: 'hex', x: Math.round(w / 2 - 15), y: Math.round(h * .25), w: 30, h: 22, slot: { x: Math.round(w / 2 - 10), y: Math.round(h * .25) + 6, w: 20, h: 10 } };
    }
  }
  ART.signSlot = function (kind, w, h) { kind = KIND2[kind] || kind; var sh = signShape(kind, w, h); return sh.slot };
  var SIGNC = {};
  function signFrame(kind, sh, col, lit, label) {
    var key = kind + sh.w + 'x' + sh.h + col + lit + (label || ''); if (SIGNC[key]) return SIGNC[key];
    var g = grid(sh.w, sh.h), w = sh.w, h = sh.h;
    if (sh.t === 'arch') { var ry = Math.round(h * .5), rx = w / 2 - .5; for (var a = 0; a <= 96; a++) { var th = Math.PI * a / 96; gs(g, Math.round(rx - Math.cos(th) * rx), Math.round(ry - Math.sin(th) * ry), 'x') } gr(g, 0, ry, 1, h - ry, 'x'); gr(g, w - 1, ry, 1, h - ry, 'x'); gr(g, 0, h - 1, w, 1, 'x') }
    else if (sh.t === 'circle') { for (var a2 = 0; a2 < 128; a2++) { var t2 = a2 * Math.PI / 64; gs(g, Math.round(w / 2 - .5 + Math.cos(t2) * (w / 2 - .5)), Math.round(h / 2 - .5 + Math.sin(t2) * (h / 2 - .5)), 'x') } }
    else if (sh.t === 'oval') { for (var a3 = 0; a3 < 128; a3++) { var t3 = a3 * Math.PI / 64; gs(g, Math.round(w / 2 - .5 + Math.cos(t3) * (w / 2 - .5)), Math.round(h / 2 - .5 + Math.sin(t3) * (h / 2 - .5)), 'x') } }
    else if (sh.t === 'hex') { var P = [[4, 0], [w - 5, 0], [w - 1, h / 2], [w - 5, h - 1], [4, h - 1], [0, h / 2]]; for (var i = 0; i < 6; i++) gl(g, Math.round(P[i][0]), Math.round(P[i][1]), Math.round(P[(i + 1) % 6][0]), Math.round(P[(i + 1) % 6][1]), 'x') }
    else { gbox(g, 0, 0, w, h, 'x'); if (sh.t === 'blade') { gr(g, 2, 2, 1, h - 4, 'x') } }
    var m = can(g, { x: '#ffffff' }), s2 = mk(w, h); s2.g.drawImage(neonize(m, col, lit), 0, 0);
    if (label) { var lines = label.split('|'); lines.forEach(function (ln, j) { if (sh.t === 'blade') { for (var c = 0; c < ln.length; c++) tiny(s2.g, ln[c], Math.round(w / 2 - 1), 4 + c * 6, lit ? mix(col, C.cream, .5) : C.off) } else tiny(s2.g, ln, Math.round((w - tinyWidth(ln)) / 2), Math.round(h / 2 - lines.length * 3 + j * 6 + (sh.t === 'arch' ? 3 : 0)), lit ? mix(col, C.cream, .5) : C.off) }) }
    return (SIGNC[key] = s2.c);
  }
  var BUILD_OLD = ART.building;
  ART.building = function (ctx, kind, x, y, w, h, t, sign) {
    var k2 = KIND2[kind] || kind; if (!BODY[k2]) return BUILD_OLD(ctx, kind, x, y, w, h, t, sign);
    w = Math.round(w); h = Math.round(h); x = Math.round(x); y = Math.round(y);
    ctx.drawImage(buildingCanvas(BODY[k2], w, h, 'night', false), x, y);
    var sh = signShape(k2, w, h), col = sign && sign.color || NEONC[k2], flick = sign && sign.img && '1111111111111111111101111111'[((t * 12) | 0) % 28] === '0';
    // dettagli del mestiere
    if (k2 === 'hairdresser') { var px = x + 3, py = y + h - 22; ctx.fillStyle = C.night; ctx.fillRect(px - 1, py - 1, 5, 18); for (var j = 0; j < 16; j++) { ctx.fillStyle = ((j + ((t * 8) | 0)) % 4) < 2 ? C.crim3 : C.cream; ctx.fillRect(px, py + j, 3, 1) } ctx.fillStyle = C.g2; ctx.fillRect(px, py - 2, 3, 1); ctx.fillRect(px, py + 16, 3, 1) }
    if (k2 === 'streetfood') { var cx0 = x + 4, cy0 = y + h - 14; ctx.fillStyle = '#3A3A38'; ctx.fillRect(cx0, cy0 + 4, 20, 8); ctx.fillStyle = '#FFC56A'; for (var q = 0; q < 22; q += 4) { ctx.fillRect(cx0 - 1 + q, cy0, 2, 3) } ctx.fillStyle = C.cream; ctx.fillRect(cx0 + 2, cy0 + 6, 3, 1); ctx.fillStyle = C.g4; ctx.fillRect(cx0 + 2, cy0 + 12, 2, 2); ctx.fillRect(cx0 + 16, cy0 + 12, 2, 2); if (((t * 2) | 0) % 2) { ctx.fillStyle = 'rgba(244,242,236,.35)'; ctx.fillRect(cx0 + 8, cy0 - 4 - ((t * 6) | 0) % 4, 1, 2) } }
    if (k2 === 'cafe') { ctx.fillStyle = '#FFC56A'; for (var q2 = 2; q2 < w - 2; q2 += 4) { ctx.fillRect(x + q2, y + h - 18, 2, 3) } ctx.fillStyle = '#7A4434'; ctx.fillRect(x + 2, y + h - 15, w - 4, 1) }
    if (k2 === 'gym') { ctx.fillStyle = C.g2; ctx.fillRect(x + 4, y + h - 8, 8, 1); ctx.fillRect(x + 3, y + h - 10, 2, 5); ctx.fillRect(x + 11, y + h - 10, 2, 5) }
    if (k2 === 'hotel') { ctx.fillStyle = C.g3; ctx.fillRect(x + 6, y - 2, 1, 2); ctx.fillRect(x + w - 7, y - 2, 1, 2) }
    if (k2 === 'clothing') { ctx.fillStyle = C.g3; ctx.fillRect(x + w - 3, y + 10, 3, 1); ctx.fillRect(x + w - 3, y + 8 + Math.min(60, Math.round(h * .5)) - 4, 3, 1) }
    // l'insegna: logo del vincitore acceso, oppure neon spento FOR RENT
    var occupied = sign && (sign.img || sign.name), lbl = occupied ? null : (sh.t === 'blade' ? 'RENT' : sh.w >= 40 ? 'YOUR SIGN|HERE' : 'FOR|RENT');
    ctx.fillStyle = 'rgba(10,10,12,0.75)'; ctx.fillRect(x + sh.x, y + sh.y, sh.w, sh.h);
    ctx.drawImage(signFrame(k2, sh, col, !!occupied && !flick, lbl), x + sh.x, y + sh.y);
    if (sign && sign.img) { var sl = sh.slot, im = tinted(sign.img, flick ? C.off : (sign.color || mix(col, C.cream, .55))), sc = Math.min(sl.w / im.width, sl.h / im.height), dw = Math.max(1, Math.round(im.width * sc)), dh = Math.max(1, Math.round(im.height * sc)); ctx.drawImage(im, x + sl.x + Math.round((sl.w - dw) / 2), y + sl.y + Math.round((sl.h - dh) / 2), dw, dh) }
    else if (sign && sign.name) { var sl2 = sh.slot, nm = String(sign.name).toUpperCase().slice(0, Math.max(1, (sl2.w / 4) | 0)); tiny(ctx, nm, x + sl2.x + Math.round((sl2.w - tinyWidth(nm)) / 2), y + sl2.y + Math.round((sl2.h - 5) / 2), mix(col, C.cream, .5)) }
  };

  // ======================================================================================
  // NAVE DI LATO v2: caccia basso e lungo, scafo crema con la riga pomodoro e le linee dei pannelli, cabina di vetro
  // che luccica, ala a freccia e deriva. La m e' UN blocco motore dietro: il profilo e' il fondo della m del logo
  // (tre gambe corte con gli archi), coricato; ogni gamba e' un ugello con la fiamma pomodoro.
  var SV2 = {
    a: { hull: [[18, 19], [40, 16], [52, 13], [62, 12], [74, 15], [92, 23], [94, 24], [80, 27], [56, 30], [30, 31], [18, 30]], glass: [[48, 16], [56, 11.5], [66, 11.5], [74, 16]], wing: [[34, 26], [60, 26], [46, 37], [32, 37]], fin: [[18, 19], [30, 19], [22, 6], [15, 6]], eng: { x: 11, y: 15, len: 7, th: 17 } },
    b: { hull: [[18, 20], [44, 17], [56, 14], [66, 13.5], [76, 16], [94, 23], [96, 24], [84, 26.5], [60, 29], [30, 30], [18, 30]], glass: [[52, 17], [60, 12.5], [70, 12.5], [78, 17]], wing: [[30, 25], [62, 25], [40, 39], [26, 39]], fin: [[18, 20], [32, 20], [20, 4], [13, 4]], canard: [[74, 25], [84, 25], [76, 30], [72, 30]], eng: { x: 11, y: 16, len: 7, th: 16 } },
    c: { hull: [[20, 18], [42, 15], [54, 12], [64, 12], [74, 15], [88, 22], [90, 23], [78, 27], [54, 30], [30, 31], [20, 31]], glass: [[50, 15], [57, 11], [66, 11], [73, 15]], wing: [[36, 27], [58, 27], [50, 38], [36, 38]], fin: [[20, 18], [33, 18], [26, 3], [18, 3]], fin2: [[22, 31], [32, 31], [26, 38], [20, 38]], eng: { x: 8, y: 13, len: 9, th: 21 } }
  };
  ART.shipVariant2 = 'a';
  var SP2W = 100, SP2H = 48;
  var SV2PAL = { o: C.night, '0': C.hot, '1': '#ECE8DE', '2': '#CFCABD', '3': '#9C978B', '4': '#55524B', c: C.cream, n: '#0C1820', N: '#1E3C52', g: '#CDEFF7', w: C.hot,
    m: C.g1, M: C.g2, K: C.g3, L: C.g4, r: C.tomato, d: C.t1, D: C.t0, h: C.t3, H: C.t4 };
  function shipSide2(vk, pitch) {
    var V = SV2[vk], Q = 4, big = mk(SP2W * Q, SP2H * Q), b = big.g, cx = SP2W / 2, cy = SP2H / 2;
    b.setTransform(Q, 0, 0, Q, 0, 0); b.translate(cx, cy); b.rotate(-pitch * .14); b.translate(-cx, -cy);
    function poly(P, col) { if (!P) return; b.fillStyle = col; b.beginPath(); b.moveTo(P[0][0], P[0][1]); for (var i = 1; i < P.length; i++) b.lineTo(P[i][0], P[i][1]); b.closePath(); b.fill() }
    poly(V.fin, '#ffff00'); poly(V.fin2, '#ffff00'); poly(V.wing, '#0000ff'); poly(V.hull, '#ff0000'); poly(V.canard, '#0000ff'); poly(V.glass, '#00ff00');
    // il blocco motore: il fondo della m (gambe + archi), coricato con le gambe verso sinistra
    var E = V.eng, s = E.len / 528, s2 = E.th / 680;
    b.save(); b.beginPath(); b.rect(E.x - 1, E.y - 2, E.len + 1.5, E.th + 4); b.clip(); b.transform(0, s2, -s, 0, E.x, E.y); b.fillStyle = '#ff00ff'; b.fill(M_SUB[0]); b.restore();
    b.fillStyle = '#ff00ff'; b.fillRect(E.x + E.len - 1, E.y + 1, 18 - E.x - E.len + 6, E.th - 2);
    var D = b.getImageData(0, 0, SP2W * Q, SP2H * Q).data, g = grid(SP2W, SP2H), x, y, REG = [['H', 255, 0, 0], ['G', 0, 255, 0], ['W', 0, 0, 255], ['F', 255, 255, 0], ['E', 255, 0, 255]];
    for (y = 0; y < SP2H; y++) for (x = 0; x < SP2W; x++) { var i = ((y * Q + 2) * SP2W * Q + x * Q + 2) * 4; if (D[i + 3] < 128) continue; var best = 'H', bd = 1e9; REG.forEach(function (R) { var dd = Math.abs(D[i] - R[1]) + Math.abs(D[i + 1] - R[2]) + Math.abs(D[i + 2] - R[3]); if (dd < bd) { bd = dd; best = R[0] } }); g.a[y][x] = best }
    var ge = gclone(g); for (y = 0; y < SP2H; y++) for (x = 0; x < SP2W; x++) if (ge.a[y][x] === '.' && (gg(ge, x, y - 1) === 'E' || gg(ge, x, y + 1) === 'E') && x < V.eng.x + V.eng.len) g.a[y][x] = 'E';
    var src = gclone(g), out = grid(SP2W, SP2H);
    function solid2(v) { return v === 'H' || v === 'G' || v === 'E' }
    for (y = 0; y < SP2H; y++) for (x = 0; x < SP2W; x++) {
      var r = src.a[y][x]; if (r === '.') continue; var up = gg(src, x, y - 1) === '.', dn = gg(src, x, y + 1) === '.', c;
      if (r === 'H') { var du = 0, dd2 = 0; while (solid2(gg(src, x, y - du - 1)) && du < 30) du++; while (solid2(gg(src, x, y + dd2 + 1)) && dd2 < 30) dd2++; var tt = du / (du + dd2 + 1); c = ['0', '1', '1', '1', '2', '2', '3', '3'][Math.min(7, (tt * 8) | 0)]; if (up) c = '0'; if (dn) c = 'c' }
      else if (r === 'G') { var gu = 0; while (gg(src, x, y - gu - 1) === 'G') gu++; c = gu < 1 ? 'N' : 'n' }
      else if (r === 'W' || r === 'F') { c = up ? 'm' : dn ? 'c' : 'K'; if (!up && !dn && gg(src, x, y - 2) === '.') c = 'M' }
      else { var eu = 0, ed = 0; while (gg(src, x, y - eu - 1) === 'E' && eu < 20) eu++; while (gg(src, x, y + ed + 1) === 'E' && ed < 20) ed++; c = up ? '0' : dn ? 'c' : ['1', '1', '2', '2', '3'][Math.min(4, (eu / (eu + ed + 1) * 5) | 0)]; if (gg(src, x - 1, y) === '.') c = '4'; if (x === V.eng.x + V.eng.len) c = '3' }
      out.a[y][x] = c;
    }
    // riflesso sulla cabina: diagonale chiara
    for (y = 0; y < SP2H; y++) for (x = 0; x < SP2W; x++) if (src.a[y][x] === 'G' && src.a[y][x - 2] !== 'G' && src.a[y - 1] && src.a[y - 1][x] === 'G') { gs(out, x + 2, y, 'g'); gs(out, x + 3, y - 1, 'g') }
    // riga pomodoro lungo lo scafo e linee dei pannelli
    function midAt(xx) { var a0 = -1, a1 = -1; for (var yy = 0; yy < SP2H; yy++) if (src.a[yy][xx] === 'H') { if (a0 < 0) a0 = yy; a1 = yy } return a0 < 0 ? -1 : a0 + (a1 - a0) * .58 }
    var sx0 = E.x + E.len + 8, sx1 = sx0; for (x = SP2W - 1; x > sx0; x--) if (midAt(x) >= 0) { sx1 = x - 4; break } var sy0 = midAt(sx0), sy1 = midAt(sx1);
    for (x = E.x + E.len + 2; x <= sx1; x++) { var my = Math.round(sy0 + (sy1 - sy0) * (x - sx0) / Math.max(1, sx1 - sx0)); if (src.a[my] && src.a[my][x] === 'H') { out.a[my][x] = 'r'; if (src.a[my + 1] && src.a[my + 1][x] === 'H') out.a[my + 1][x] = 'd' } }
    [30, 42, 80].forEach(function (px0) { for (var yy2 = 0; yy2 < SP2H; yy2++) if (src.a[yy2][px0] === 'H' && out.a[yy2][px0] !== 'r' && out.a[yy2][px0] !== 'd' && gg(src, px0, yy2 - 1) === 'H' && gg(src, px0, yy2 + 1) === 'H') out.a[yy2][px0] = '3' });
    // ugelli: le tre gambe della m, ognuna con la bocca pomodoro
    var eng = [], ang = -pitch * .14, ca = Math.cos(ang), sa = Math.sin(ang);
    [45, 340, 635].forEach(function (lx) { var px0 = E.x, py0 = E.y + lx * s2, rx = cx + (px0 - cx) * ca - (py0 - cy) * sa, ry = cy + (px0 - cx) * sa + (py0 - cy) * ca, ex = Math.round(rx), ey = Math.round(ry), hh = Math.max(1, Math.round(90 * s2 / 2));
      for (var yy3 = ey - hh; yy3 <= ey + hh; yy3++) { var edge = yy3 === ey - hh || yy3 === ey + hh; gs(out, ex - 1, yy3, edge ? 'd' : 'r'); gs(out, ex - 2, yy3, edge ? 'D' : 'h') }
      eng.push([ex - 2, ey - hh, ey + hh]) });
    // sensore = hitbox: il pilota nella cabina (2x2 bianco caldo)
    var gx0 = 1e9, gx1 = -1, gy0 = 1e9, gy1 = -1; for (y = 0; y < SP2H; y++) for (x = 0; x < SP2W; x++) if (src.a[y][x] === 'G') { gx0 = Math.min(gx0, x); gx1 = Math.max(gx1, x); gy0 = Math.min(gy0, y); gy1 = Math.max(gy1, y) }
    var hx = Math.round((gx0 + gx1) / 2) - 2, hy = gy1 - 2; gr(out, hx, hy, 2, 2, 'w');
    // contorno notte tranne sotto
    var f2 = gclone(out); function Af(xx, yy4) { var v = gg(f2, xx, yy4); return v !== '.' && 'rdDhH'.indexOf(v) < 0 }
    for (y = 0; y < SP2H; y++) for (x = 0; x < SP2W; x++) if (f2.a[y][x] === '.' && !Af(x, y - 1) && (Af(x - 1, y) || Af(x + 1, y) || Af(x, y + 1))) out.a[y][x] = 'o';
    // luce di via: punta della deriva
    var nav = []; for (y = 0; y < SP2H && !nav.length; y++) for (x = 0; x < SP2W; x++) if (src.a[y][x] === 'F') { nav.push([x, y]); break }
    return { c: can(out, SV2PAL), eng: eng, nav: nav, hit: [hx + 1 - SP2W / 2, hy + 1 - SP2H / 2] };
  }
  var SIDE2 = {}, SIDE2F = {};
  function side2Set(vk) { if (!SIDE2[vk]) { SIDE2[vk] = [-2, -1, 0, 1, 2].map(function (p) { return shipSide2(vk, p / 2) }); SIDE2F[vk] = SIDE2[vk].map(function (s) { return solid(s.c, C.cream) }) } return SIDE2[vk] }
  var SHIP_SIDE1 = ART.ship;
  ART.ship = function (ctx, x, y, t, s) {
    s = s || {}; if (!ART.side || s.view === 'top' || s.view === 'side1') return SHIP_SIDE1(ctx, x, y, t, s);
    var S = SC(ctx), vk = s.variant2 || ART.shipVariant2, set = side2Set(vk), bb = s.bank || 0, bi = Math.max(0, Math.min(4, Math.round(-bb * 2) + 2)), I = set[bi];
    if (vk === ART.shipVariant2) ART.hitbox = { dx: set[2].hit[0] / 2, dy: set[2].hit[1] / 2 };
    if (s.shield > 0) { shieldGrab(ctx, x, y, t); shieldGlass(ctx, x, y, t, s.shield, S) }
    putC(ctx, I.c, x, y, S);
    var k = S === 2 ? 1 : .5, ox = Math.round(x * S) - SP2W * k / 2, oy = Math.round(y * S) - SP2H * k / 2;
    var th = s.thrust == null ? .5 : s.thrust, fr = (t * 24) | 0, auto = s.power === 'auto';
    for (var i = 0; i < I.eng.length; i++) {
      var e = I.eng[i], len = 5 + Math.round(th * 9) + (auto ? 9 : 0) - ((fr + i) % 3 === 0 ? 2 : 0), h0 = e[2] - e[1] + 1;
      for (var j = 0; j < len; j++) { var col = j < 2 ? ((fr + i) % 2 ? C.t4 : C.t3) : j < 5 ? C.tomato : j < 9 ? C.t1 : C.t0, hh = Math.max(1, h0 - (j > 4 ? 1 : 0) - (j > 8 ? 1 : 0)); if (j > 8 && (j + fr) % 2) continue; ctx.fillStyle = col; ctx.fillRect(Math.round(ox + (e[0] - j) * k), Math.round(oy + (e[1] + ((h0 - hh) >> 1)) * k), Math.max(1, Math.round(k)), Math.max(1, Math.round(hh * k))) }
    }
    if (I.nav[0] && ((t * 2.2) | 0) % 2) { ctx.fillStyle = C.tomato; ctx.fillRect(Math.round(ox + I.nav[0][0] * k), Math.round(oy + I.nav[0][1] * k), Math.max(1, Math.round(2 * k)), Math.max(1, Math.round(2 * k))) }
    if (s.flash) { ctx.globalAlpha = reduced ? .5 : 1; putC(ctx, SIDE2F[vk][bi], x, y, S); ctx.globalAlpha = 1 }
    if (s.power === 'ai') { ctx.fillStyle = (t * 4 | 0) % 2 ? '#7FD8FF' : C.hot; var hb = set[2].hit; ctx.fillRect(Math.round(x * S + hb[0] * k) - 1, Math.round(y * S + hb[1] * k) - 1, Math.max(1, Math.round(2 * k)), Math.max(1, Math.round(2 * k))) }
    if (s.shield > 0) shieldDraw(ctx, x, y, t, s.shield, S);
  };
  var SHIPFX_SIDE1 = ART.shipFx;
  ART.shipFx = function (ctx, x, y, t, s) {
    s = s || {}; if (!ART.side || s.view === 'top' || s.view === 'side1') return SHIPFX_SIDE1(ctx, x, y, t, s);
    var I = side2Set(s.variant2 || ART.shipVariant2)[2], th = s.thrust == null ? .5 : s.thrust, len = (.6 + th) * (s.power === 'auto' ? 2 : 1), f = GLOWS.flame[2];
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < I.eng.length; i++) { var e = I.eng[i], ex = (e[0] - SP2W / 2) / 2, ey = ((e[1] + e[2]) / 2 - SP2H / 2) / 2, fl = .8 + .2 * Math.sin(t * 40 + i * 2.1), ww = f.gh * len * fl, hh = f.gw * .7; ctx.globalAlpha = .9; ctx.drawImage(f, x + ex - ww, y + ey - hh / 2, ww, hh) }
    ctx.restore();
  };
  ART.size.ship = { w: 45, h: 17 };
})();
