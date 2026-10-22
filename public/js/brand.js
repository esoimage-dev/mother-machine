/* Mother Machine · 03 Brand: gli stessi sei comandi in tre stili (Minimal, Friendly, Editorial).
   Non cambia solo la pelle: ogni stile li usa a modo suo (la campanella, l'anello, le parole che si sottolineano).
   I pezzi in piu' si aggiungono qui una volta sola e si vedono solo nello stile che li usa (brand.css). */
(function () {
  var g = document.querySelector('.ctlg'), tabs = [].slice.call(document.querySelectorAll('.styb button'));
  if (!g || !tabs.length) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SV = function (d, w) { return '<svg class="x-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>' };
  var BELL = SV('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>');
  var CHECK = SV('<path d="M20 6 9 17l-5-5"/>', 3);
  var TRASH = SV('<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>');

  var sw = g.querySelector('.sws i'); if (sw) sw.insertAdjacentHTML('beforeend', BELL);
  var sb = g.querySelector('.stb');
  if (sb) { sb.insertAdjacentHTML('afterbegin', '<i class="x-bar" aria-hidden="true"></i>'); var ok = sb.querySelector('.ok'); if (ok) ok.insertAdjacentHTML('afterbegin', CHECK) }
  [].forEach.call(g.querySelectorAll('.chk i'), function (i) { i.insertAdjacentHTML('beforeend', CHECK) });

  /* il peso: nello stile Friendly il binario si colora fin dove arrivi */
  var wr = g.querySelector('.wgr');
  var wp = function () { if (wr) g.style.setProperty('--wp', ((wr.value - wr.min) / (wr.max - wr.min) * 100).toFixed(1) + '%') };
  if (wr) { wr.addEventListener('input', wp); wp() }

  /* tieni premuto: nello stile Friendly un anello si chiude intorno al bottone tondo */
  var hd = g.querySelector('.hold');
  if (hd) {
    hd.insertAdjacentHTML('afterbegin', TRASH + '<svg class="x-ring" viewBox="0 0 78 78" aria-hidden="true"><circle class="bg" cx="39" cy="39" r="36"/><circle class="fg" cx="39" cy="39" r="36"/></svg>');
    var fg = hd.querySelector('.x-ring .fg'), an = null;
    var down = function () {
      if (g.getAttribute('data-sty') !== 'friendly' || hd.classList.contains('done')) return;
      an = fg.animate([{ strokeDashoffset: 226 }, { strokeDashoffset: 0 }], { duration: RM ? 200 : 900, easing: 'linear', fill: 'forwards' });
      an.onfinish = function () { setTimeout(function () { fg.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: 226 }], { duration: 300, fill: 'forwards' }) }, 1800) };
    };
    var up = function () { if (an && an.playState === 'running') { an.cancel(); an = null } };
    hd.addEventListener('pointerdown', down);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (t) { hd.addEventListener(t, up) });
    hd.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) down() });
    hd.addEventListener('keyup', up);
  }

  /* cambio di stile: i comandi escono sfocati uno dopo l'altro, lo stile cambia, rientrano trasformati */
  [].forEach.call(g.querySelectorAll('.cel'), function (c, i) { c.style.setProperty('--k', i) });
  var tm = 0;
  var apply = function (v) { if (v === 'minimal') g.removeAttribute('data-sty'); else g.setAttribute('data-sty', v) };
  var pick = function (b) {
    tabs.forEach(function (x) { var on = x === b; x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1 });
    clearTimeout(tm);
    if (RM) { apply(b.dataset.s); return }
    g.classList.remove('m-in'); g.classList.add('m-out');
    tm = setTimeout(function () {
      apply(b.dataset.s); g.classList.remove('m-out'); void g.offsetWidth; g.classList.add('m-in');
      tm = setTimeout(function () { g.classList.remove('m-in') }, 900);
    }, 380);
  };
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(b) });
    b.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault(); var k = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; pick(k); k.focus();
    });
  });
})();

/* l'apertura: la leva si tira da sola, avanti e indietro, finche' non la tocchi; i quattro passi si accendono in ordine */
(function () {
  var hero = document.querySelector('.brhero'), xs = hero && hero.querySelector('.xs'), lv = hero && hero.querySelector('.lvr'), xg = hero && hero.querySelector('.xg');
  if (!xs || !lv) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var steps = [].slice.call(hero.querySelectorAll('.xlist li')), AT = [.1, .28, .46, .64];
  xg.classList.add('x-steps');
  var set = function (v) {
    xs.style.setProperty('--t', v); xs.classList.toggle('x-on', v > .05);
    var now = -1;
    steps.forEach(function (li, i) { var on = v >= AT[i]; li.classList.toggle('on', on); if (on) now = i });
    steps.forEach(function (li, i) { li.classList.toggle('now', i === now) });
  };
  var touched = false;
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (e) { lv.addEventListener(e, function () { touched = true }, { passive: true }) });
  lv.addEventListener('input', function () { set(lv.value / 100) });
  if (RM) { lv.value = 70; set(.7); return }
  /* un giro: fermo montato, si smonta, resta aperto, si rimonta */
  var CY = [[0, 900], [.82, 2400], [.82, 1700], [0, 2000]], go = false, t0 = 0, raf = 0;
  var ease = function (p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2 };
  var tick = function (t) {
    if (!go || touched) return;
    if (!t0) t0 = t;
    var T = CY.reduce(function (a, c) { return a + c[1] }, 0), x = (t - t0) % T, from = CY[CY.length - 1][0], v = 0;
    for (var i = 0; i < CY.length; i++) { if (x <= CY[i][1]) { v = from + (CY[i][0] - from) * ease(x / CY[i][1]); break } x -= CY[i][1]; from = CY[i][0] }
    lv.value = v * 100; set(v);
    raf = requestAnimationFrame(tick);
  };
  set(0);
  new IntersectionObserver(function (es) {
    go = es[0].isIntersecting;
    if (go && !touched) { t0 = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick) }
  }, { threshold: .25 }).observe(hero);
})();
