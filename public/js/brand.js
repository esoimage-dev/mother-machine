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

  var pick = function (b) {
    tabs.forEach(function (x) { var on = x === b; x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1 });
    if (b.dataset.s === 'minimal') g.removeAttribute('data-sty'); else g.setAttribute('data-sty', b.dataset.s);
  };
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(b) });
    b.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault(); var k = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; pick(k); k.focus();
    });
  });
})();
