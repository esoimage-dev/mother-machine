/* LG · il primo piano, come l'inventario di un videogioco: premi un oggetto e viene avanti, gira su se stesso, lo
   puoi ruotare trascinando. Sotto, due righe che lo raccontano e due bottoni: andare a vederlo davvero, o rimetterlo
   a posto. Lo stesso contenitore fa da finestra per i server (l'animazione dal vivo), la TV (il film) e il telefono.
   La stanza chiama window.LGVISTA.open(chi, x, y). Gli oggetti 3D vengono da window.STANZA_MODELLI (stanza-oggetti.js),
   disegnati dallo stesso motore della stanza (window.STANZA_SCENA). */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches, NS = 'http://www.w3.org/2000/svg';

  /* cosa racconta ogni oggetto: testi corti, un po' di carattere */
  var SCHEDE = {
    truck: { modello: 'truck', k: 'Found on the shelf', h: "Vitalia's Pizza on Wheels", p: 'A pizza truck that books its own parties. 42 events in under two months, deposits paid by card while the owner sleeps.',
      si: 'Take me to the truck', no: 'Put it back', vai: [4, '/work/vitalias-pizza-on-wheels'] },
    ristorante: { modello: 'menu', k: 'Found on the table', h: "Vitalia's Restaurant", p: 'One menu, everywhere at once. Change a dish and the website and the printed menus follow. Functions quoted in two minutes.',
      si: 'Open the restaurant', no: 'Put it back', vai: [4, '/work/vitalias-restaurant'] },
    phone: { modello: 'phone', k: 'It still works', h: 'Tell us what slows you down.', p: 'The first conversation is free. A real person picks up, usually the one who will build it.',
      si: 'Start a conversation', no: 'Hang up', vai: [0, '/contact'], squillo: true },
    systems: { k: 'R01 to R04 · live', h: 'Everything we build runs somewhere.', p: 'Bookings, payments, invoices at night, a private AI. This is what it looks like when nobody is watching.',
      si: 'Explore Systems · Floor 02', no: 'Close the rack', vai: [2, '/systems'], server: true },
    film: { k: 'Now playing · 0:38', h: 'The machine behind your business.', p: 'Our film. Old TV, new tricks.', no: 'Switch it off', film: true }
  };

  var box, stage, tx, scena = null, raf = 0, yaw = 0, vel = 0, drag = null, cur = null, srv = null, last = 0, back = null;
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e }
  function piano(k, dest) { chiudi(true); setTimeout(function () { if (dest) window.MM_DEST = dest; if (typeof window.go === 'function') window.go(k); else location.href = dest }, RM ? 0 : 260) }

  function dom() {
    box = el('div', 'lgx'); box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<div class="lgxbg" aria-hidden="true"></div>' +
      '<div class="lgxin"><div class="lgxst"></div>' +
      '<div class="lgxtx"><span class="mo lgxk"></span><h2></h2><p class="lgxp"></p><div class="lgxb"></div></div></div>';
    document.body.appendChild(box);
    stage = box.querySelector('.lgxst'); tx = box.querySelector('.lgxtx');
    box.querySelector('.lgxbg').addEventListener('click', function () { chiudi() });
    addEventListener('keydown', function (e) { if (box.classList.contains('on') && e.key === 'Escape') chiudi() });
  }

  /* ---------- l'oggetto che gira ---------- */
  function vista(nome) {
    var M = window.STANZA_MODELLI && window.STANZA_MODELLI[nome], SC = window.STANZA_SCENA, FR = window.STANZA_FRAME;
    if (!M || !SC) return null;
    /* prima lo si misura in una scena di prova, poi lo si mette a fuoco: distanza e camera dalle sue misure */
    var prova = SC({ W: 10, H: 10, F: 1, HY: 0, cam: { x: 0, y: 0 } });
    M({ part: prova.part, frame: FR, ID: FR([0, 0, 0], 0) }, FR([0, 0, 0], 0), {});
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    prova.parts.forEach(function (P) { P.faces.forEach(function (f) { f.pts.forEach(acc) }); P.lines.forEach(function (l) { (l.pts || [l.at]).forEach(function (p) { if (p) acc(p) }) }) });
    function acc(p) { for (var i = 0; i < 3; i++) { mn[i] = Math.min(mn[i], p[i]); mx[i] = Math.max(mx[i], p[i]) } }
    var r = Math.max(mx[0] - mn[0], mx[2] - mn[2], mx[1] - mn[1]) * .62 || .3, D = r * 4.2, cx = (mn[0] + mx[0]) / 2, cz = (mn[2] + mx[2]) / 2, hy = (mn[1] + mx[1]) / 2;
    var W = 900, H = 640, F = H * .78 * D / (r * 2);
    /* la camera sta un po' piu' in alto e non si inclina: si alza l'orizzonte perche' l'oggetto cada al centro */
    var S = SC({ W: W, H: H, F: F, HY: H * .5 - F * r * 1.1 / D, cam: { x: 0, y: hy + r * 1.1 }, spin: [0, 0, D], w: 1.5 });
    var T = FR([-cx, 0, D - cz], 0);
    /* la pedana: due anelli a terra, come nella vetrina di un gioco */
    var pd = S.part({ cls: 'turn' }); pd.circle([0, mn[1] - .002, D], r * .95, 'y', { cls: 'cn ring1', k: 48 }); pd.circle([0, mn[1] - .002, D], r * 1.12, 'y', { cls: 'cn ring2', k: 48 });
    M({ part: S.part, frame: FR, ID: FR([0, 0, 0], 0) }, T, {});
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('class', 'lgxsv'); svg.setAttribute('aria-hidden', 'true');
    S.build(svg, 'lgW'); S.render();
    return { svg: svg, S: S };
  }
  function giro(now) {
    raf = requestAnimationFrame(giro); var dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
    if (!scena) return;
    if (!drag) { vel += ((RM ? 0 : .55) - vel) * Math.min(1, dt * 1.6); yaw += vel * dt }
    scena.S.yaw = yaw; scena.S.render();
  }
  function trascina(svg) {
    svg.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, t: performance.now() }; svg.setPointerCapture(e.pointerId); svg.classList.add('grab') });
    svg.addEventListener('pointermove', function (e) { if (!drag) return; var dx = e.clientX - drag.x, n = performance.now(); yaw += dx * .012; vel = dx * .012 / Math.max(.008, (n - drag.t) / 1000); drag.x = e.clientX; drag.t = n });
    function su() { drag = null; svg.classList.remove('grab') }
    svg.addEventListener('pointerup', su); svg.addEventListener('pointercancel', su);
  }

  /* il telefono squilla, due volte, quando arriva */
  function squillo() {
    try { var a = new (window.AudioContext || window.webkitAudioContext)(); [0, .5].forEach(function (t0) { [0, .06, .12, .18, .24].forEach(function (d, i) {
      var o = a.createOscillator(), v = a.createGain(); o.type = 'sine'; o.frequency.value = i % 2 ? 480 : 440; v.gain.setValueAtTime(.05, a.currentTime + t0 + d); v.gain.exponentialRampToValueAtTime(.0001, a.currentTime + t0 + d + .055);
      o.connect(v); v.connect(a.destination); o.start(a.currentTime + t0 + d); o.stop(a.currentTime + t0 + d + .06) }) }) } catch (x) {}
  }

  function apri(chi, x, y) {
    var C = SCHEDE[chi]; if (!C) return;
    if (!box) dom();
    back = document.activeElement; cur = C;
    stage.innerHTML = ''; scena = null; yaw = -.5; vel = 0;
    box.className = 'lgx on ' + (C.server ? 'is-srv' : C.film ? 'is-film' : 'is-3d');
    box.style.setProperty('--ox', (x == null ? innerWidth / 2 : x) + 'px'); box.style.setProperty('--oy', (y == null ? innerHeight / 2 : y) + 'px');
    box.setAttribute('aria-label', C.h);
    tx.querySelector('.lgxk').textContent = C.k; tx.querySelector('h2').textContent = C.h; tx.querySelector('.lgxp').textContent = C.p;
    var bt = tx.querySelector('.lgxb'); bt.innerHTML = '';
    if (C.si) { var a = el('a', 'lgxsi', '<span class="fl" aria-hidden="true"></span>' + C.si); a.href = C.vai[1]; a.addEventListener('click', function (e) { e.preventDefault(); piano(C.vai[0], C.vai[1]) }); bt.appendChild(a) }
    var no = el('button', 'lgxno', C.no); no.type = 'button'; no.addEventListener('click', function () { chiudi() }); bt.appendChild(no);
    if (C.modello) { scena = vista(C.modello); if (scena) { stage.appendChild(scena.svg); trascina(scena.svg); stage.appendChild(el('p', 'mo lgxhint', 'Drag to turn it')) } }
    if (C.server && window.SALA_SERVER) { var w = el('div', 'lgxsrv'); stage.appendChild(w); srv = window.SALA_SERVER.mount(w); setTimeout(function () { srv && srv.start() }, 300) }
    if (C.film) { var tv = el('div', 'lgxtv', '<iframe src="/film.html" title="Mother Machine, the film" allow="autoplay; fullscreen" loading="lazy"></iframe><i class="lgxscan" aria-hidden="true"></i>'); stage.appendChild(tv);
      /* il film si disegna sempre a 960 x 540 e si rimpicciolisce per entrare nello schermo */
      var fit = function () { tv.style.setProperty('--k', tv.clientWidth / 960) }; fit(); addEventListener('resize', fit) }
    if (C.squillo) squillo();
    document.documentElement.classList.add('lgx-on');
    requestAnimationFrame(function () { box.classList.add('in') });
    last = 0; cancelAnimationFrame(raf); if (scena) raf = requestAnimationFrame(giro);
    setTimeout(function () { var f = bt.querySelector('a,button'); if (f) f.focus() }, 350);
  }
  function chiudi(via) {
    if (!box || !box.classList.contains('on')) return;
    box.classList.remove('in'); document.documentElement.classList.remove('lgx-on');
    if (srv) { srv.stop(); srv = null }
    setTimeout(function () { box.classList.remove('on'); cancelAnimationFrame(raf); raf = 0; stage.innerHTML = ''; scena = null }, RM ? 0 : 420);
    if (!via && back && back.focus) back.focus();
  }
  window.LGVISTA = { open: apri, close: chiudi };
})();
