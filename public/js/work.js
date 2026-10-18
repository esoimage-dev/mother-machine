/* Mother Machine · 04 Work: filtri per settore, vista registro o copertine, anteprima che segue il mouse,
   risultati che contano fino al loro valore quando entrano nello schermo (manuale: "Il numero"). */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s) };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)) };

  /* le copertine si scalano sulla loro larghezza (come nella home) */
  function fit() { $$('.wv').forEach(function (v) { v.style.setProperty('--k', (v.clientWidth / 384).toFixed(4)) }) }
  fit(); addEventListener('resize', fit);
  if (window.ResizeObserver) new ResizeObserver(fit).observe(document.body);

  /* filtro per settore: vale per il registro e per le copertine */
  var chips = $$('.wkr .chipsF button');
  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      var s = b.dataset.s;
      chips.forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false') });
      $$('.wkl>li, .wkcov>.wc').forEach(function (el) { el.hidden = s !== 'all' && el.dataset.s !== s });
      fit();
    });
  });

  /* vista: registro o copertine */
  var views = $$('.wkv button'), reg = $('#wkreg'), cov = $('#wkcov');
  views.forEach(function (b) {
    b.addEventListener('click', function () {
      var c = b.dataset.v === 'cov';
      views.forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false') });
      reg.hidden = c; cov.hidden = !c; hide();
      if (c) { fit(); count($$('.wn b[data-v]', cov)) }
    });
  });

  /* anteprima: la copertina del progetto segue il mouse lungo il registro */
  var pv = $('#wkpv'), cur = null, x = 0, y = 0, raf = 0;
  function cover(key) {
    var src = key && $('.wkcov [data-cov="' + key + '"] .wv');
    if (src) { var c = src.cloneNode(true); var cta = c.querySelector('.wcta'); if (cta) cta.remove(); return c }
    var d = document.createElement('div'); d.className = 'wv'; d.style.setProperty('--c', '#121211');
    d.innerHTML = '<div class="wph"><b>LG</b><span class="mo">Staff only</span></div>';
    return d;
  }
  function place() { raf = 0; pv.style.left = (x + 150) + 'px'; pv.style.top = y + 'px' }
  function hide() { pv.classList.remove('on'); cur = null }
  if (fine && pv) {
    $$('.wkl>li').forEach(function (li) {
      li.addEventListener('pointerenter', function (e) {
        if (cur !== li) { pv.innerHTML = ''; var c = cover(li.dataset.cov); pv.appendChild(c); c.style.setProperty('--k', (220 / 384).toFixed(4)); cur = li }
        x = e.clientX; y = e.clientY; place(); pv.classList.add('on');
      });
      li.addEventListener('pointermove', function (e) { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(place) });
      li.addEventListener('pointerleave', hide);
    });
    addEventListener('scroll', hide, { passive: true });
  }

  /* i risultati contano fino al loro valore quando entrano nello schermo */
  function show(b) {
    var v = +b.dataset.v, p = b.dataset.p || '', s = b.dataset.s || '';
    if (RM || b.dataset.done) { b.textContent = p + v + s; return }
    b.dataset.done = 1; var t0 = null, D = 900;
    function f(t) { if (t0 === null) t0 = t; var k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
      b.textContent = p + Math.round(v * e) + s; if (k < 1) requestAnimationFrame(f) }
    requestAnimationFrame(f);
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target) } });
  }, { threshold: .6 }) : null;
  function count(list) { list.forEach(function (b) { if (b.dataset.done) return; if (io) io.observe(b); else show(b) }) }
  count($$('.wn b[data-v]').filter(function (b) { return !b.closest('[hidden]') }));
})();
