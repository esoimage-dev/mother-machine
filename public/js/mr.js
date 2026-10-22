/* Mother Machine · LG Machine Room, la faccia pubblica. Tutto disegnato in codice:
   la sezione del palazzo (sei piani sopra terra, LG sotto, la cabina che corre, gli impulsi che salgono a ogni piano).
   Ogni sezione si ferma quando esce dallo schermo; con prefers-reduced-motion resta un fotogramma fermo. */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var $ = function (s, r) { return (r || document).querySelector(s) };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)) };
  function el(p, tag, a, txt) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; p.appendChild(e); return e }
  function rnd(a, b) { return a + Math.random() * (b - a) }

  /* ogni sezione ha i suoi motori: si accendono quando entra nello schermo, si spengono quando esce */
  function engine(section) {
    var anims = [], loops = [], on = false;
    var api = {
      anim: function (a) { anims.push(a); if (!on) a.pause(); return a },
      /* un ciclo a tempo che gira solo con la sezione visibile */
      every: function (ms, f) { loops.push({ ms: ms, f: f, t: 0 }) },
      frame: null
    };
    var raf = 0, last = 0;
    function tick(t) {
      raf = requestAnimationFrame(tick);
      var dt = last ? Math.min(100, t - last) : 16; last = t;
      loops.forEach(function (l) { l.t += dt; if (l.t >= l.ms) { l.t = 0; l.f() } });
      if (api.frame) api.frame(dt);
    }
    function set(v) {
      if (v === on) return; on = v;
      section.classList.toggle('mr-off', !v);
      anims.forEach(function (a) { v ? a.play() : a.pause() });
      if (v) { last = 0; raf = requestAnimationFrame(tick) } else cancelAnimationFrame(raf);
    }
    if (RM) { section.classList.add('mr-off'); return api }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { set(es[0].isIntersecting) }, { rootMargin: '80px' }).observe(section);
    else set(true);
    section.classList.add('mr-off');
    return api;
  }

  /* ---- l'ora di chi guarda ---- */
  var clk = $('#mrClock');
  function clock() { var d = new Date(); clk.textContent = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) }
  if (clk) { clock(); setInterval(clock, 15000) }

  /* ---- 1 · la sezione del palazzo ---- */
  var svg = $('#mrBld');
  if (svg) (function () {
    var E = engine($('#m1'));
    var FL = [[5, 'Home', '#FBFAF7'], [4, 'Work', '#0F0F0E'], [3, 'Brand', '#F4F2EC'], [2, 'Systems', '#BEC2BF'], [1, 'Studio', '#EEC3B1'], [0, 'Contact', '#EEC3B1']];
    var X0 = 20, X1 = 420, TOP = 40, H = 58, GND = TOP + 6 * H, BOT = 640, SX = 344, SW = 52;
    var cy = function (k) { return TOP + (5 - k) * H + H / 2 };
    var LGY = GND + 44;
    /* il terreno: la linea del suolo esce dal palazzo, sotto un tratteggio */
    var g0 = el(svg, 'g', {});
    for (var x = -14; x < 460; x += 9) { if (x > X0 - 4 && x < X1) continue; el(g0, 'line', { x1: x, y1: GND + 4, x2: x - 8, y2: GND + 14, class: 'mr-ln' }) }
    el(svg, 'line', { x1: -20, y1: GND, x2: 460, y2: GND, class: 'ink' });
    /* il palazzo: sei piani sopra, LG sotto */
    el(svg, 'rect', { x: X0, y: TOP, width: X1 - X0, height: BOT - TOP, class: 'ink' });
    el(svg, 'rect', { x: X0 + .75, y: GND + .75, width: X1 - X0 - 1.5, height: BOT - GND - 1.5, fill: '#141412' });
    FL.forEach(function (f, i) {
      var y = TOP + i * H;
      if (i) el(svg, 'line', { x1: X0, y1: y, x2: SX, y2: y, class: 'mr-ln' });
      el(svg, 'rect', { x: X0 + 14, y: y + H / 2 - 5, width: 10, height: 10, fill: f[2], stroke: 'rgba(241,238,231,.35)', 'stroke-width': 1 });
      el(svg, 'text', { x: X0 + 34, y: y + H / 2 + 4 }, (f[0] ? '0' + f[0] : 'G') + ' ' + f[1]);
    });
    el(svg, 'text', { x: X0 + 14, y: GND + 26, fill: '#F4F2EC', style: 'fill:var(--ink)' }, 'LG · Machine Room');
    /* il vano dell'ascensore */
    el(svg, 'line', { x1: SX, y1: TOP, x2: SX, y2: BOT, class: 'mr-ln' });
    el(svg, 'line', { x1: SX + SW, y1: TOP, x2: SX + SW, y2: BOT, class: 'mr-ln' });
    el(svg, 'line', { x1: SX + SW / 2, y1: TOP, x2: SX + SW / 2, y2: BOT, class: 'mr-ln', 'stroke-dasharray': '2 6' });
    /* la ventola e i tre armadi delle macchine */
    var fan = el(svg, 'g', { transform: 'translate(70 ' + (GND + 132) + ')' });
    el(fan, 'circle', { r: 30, class: 'ink' });
    var bl = el(fan, 'g', { class: 'fan' });
    for (var b = 0; b < 3; b++) el(bl, 'path', { d: 'M0 0 L-6 -24 L6 -24Z', fill: 'rgba(241,238,231,.55)', transform: 'rotate(' + b * 120 + ')' });
    el(fan, 'circle', { r: 4, fill: '#F4F2EC', style: 'fill:var(--ink)' });
    el(svg, 'text', { x: 70, y: GND + 186, 'text-anchor': 'middle' }, 'Air');
    var PX = [], RX = [128, 186, 244];
    RX.forEach(function (rx, r) {
      el(svg, 'rect', { x: rx, y: GND + 70, width: 50, height: 140, class: 'rack' });
      for (var row = 0; row < 11; row++) for (var c = 0; c < 2; c++) {
        var cls = 'bulb' + (Math.random() < .45 ? ' on' : '');
        if (r === 1 && row === 3 && c === 1) cls = 'bulb mr-sig';
        var bu = el(svg, 'rect', { x: rx + 10 + c * 18, y: GND + 82 + row * 11.5, width: 12, height: 4, class: cls });
        if (/ on/.test(cls)) bu.style.animationDelay = (-rnd(0, 1.9)).toFixed(2) + 's';
      }
    });
    /* sei tubi: da LG fino a ogni piano */
    for (var p = 0; p < 6; p++) PX.push(134 + p * 30);
    var pulses = [];
    FL.forEach(function (f, i) {
      var px = PX[i], ty = cy(f[0]), by = GND + 70;
      el(svg, 'path', { d: 'M' + px + ' ' + by + ' V' + ty + ' H' + (SX - 14), class: 'pipe' });
      el(svg, 'circle', { cx: SX - 14, cy: ty, r: 3.5, class: 'node' });
      var q = el(svg, 'rect', { x: px - 2.5, y: -4.5, width: 5, height: 9, class: 'pulse', opacity: 0 });
      pulses.push([q, px, by, ty]);
    });
    /* la cabina */
    var cab = el(svg, 'g', {});
    el(cab, 'rect', { x: SX + 6, y: -22, width: SW - 12, height: 44, class: 'cab' });
    el(cab, 'line', { x1: SX + SW / 2, y1: -18, x2: SX + SW / 2, y2: 18, class: 'ink' });
    el(cab, 'rect', { x: SX + SW / 2 - 3, y: -30, width: 6, height: 4, class: 'cabl' });
    cab.setAttribute('transform', 'translate(0 ' + LGY + ')');
    if (RM) return;
    cab.removeAttribute('transform');
    /* la corsa: da LG su e giu' per i piani, con le soste; la durata dipende dalla distanza */
    var seq = [-1, 2, 5, 3, 0, 4, 1, -1], frames = [], tAll = 0, pos = function (k) { return k < 0 ? LGY : cy(k) };
    var legs = [];
    for (var s = 0; s < seq.length - 1; s++) { var d = Math.abs(pos(seq[s + 1]) - pos(seq[s])); legs.push([1100, 300 + d * 3.2]); tAll += 1100 + 300 + d * 3.2 }
    var t = 0;
    for (s = 0; s < legs.length; s++) {
      frames.push({ transform: 'translate(0px,' + pos(seq[s]) + 'px)', offset: t / tAll, easing: 'linear' });
      t += legs[s][0];
      frames.push({ transform: 'translate(0px,' + pos(seq[s]) + 'px)', offset: t / tAll, easing: 'cubic-bezier(.6,0,.3,1)' });
      t += legs[s][1];
    }
    frames.push({ transform: 'translate(0px,' + pos(seq[seq.length - 1]) + 'px)', offset: 1 });
    E.anim(cab.animate(frames, { duration: tAll, iterations: Infinity }));
    /* gli impulsi: salgono dal tubo, girano verso il vano, si spengono al nodo */
    pulses.forEach(function (q, i) {
      var r = q[0], px = q[1], by = q[2], ty = q[3], up = by - ty, run = SX - 14 - px;
      var dur = 2600 + i * 230 + rnd(0, 600), len = up + run, a = up / len;
      r.setAttribute('opacity', 1);
      E.anim(r.animate([
        { transform: 'translate(0px,' + by + 'px)', opacity: 0 },
        { opacity: 1, offset: .04 },
        { transform: 'translate(0px,' + (ty + 2) + 'px)', offset: .04 + .62 * a },
        { transform: 'translate(' + run + 'px,' + (ty + 2) + 'px) rotate(90deg)', offset: .66, opacity: 1 },
        { transform: 'translate(' + run + 'px,' + (ty + 2) + 'px) rotate(90deg)', offset: .7, opacity: 0 },
        { transform: 'translate(' + run + 'px,' + (ty + 2) + 'px) rotate(90deg)', opacity: 0 }
      ], { duration: dur, delay: -rnd(0, dur), iterations: Infinity, easing: 'linear' }));
      r.style.transformBox = 'fill-box'; r.style.transformOrigin = 'center';
    });
  })();

})();
