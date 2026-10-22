/* Mother Machine · 05 Home: il citofono dell'apertura, 05.2 una scheda alla volta su telefono. */
(function () {
  /* 05.1: su telefono e tablet la finestra del film vive nello schermo del citofono; su desktop torna al suo posto */
  var slot = document.getElementById('h3slot'), fb = document.getElementById('h3fb'), scr = document.getElementById('h3icV');
  if (slot && fb && scr) {
    var mq = matchMedia('(max-width:999px)');
    var put = function () { if (mq.matches) { if (slot.parentNode !== scr) scr.appendChild(slot) } else if (slot.parentNode !== fb) fb.insertBefore(slot, fb.firstChild) };
    put(); mq.addEventListener('change', put);
  }
  /* la chiamata: l'anello lampeggia mentre parte la corsa, come i bottoni dei piani */
  var call = document.querySelector('.h3icC');
  if (call) call.addEventListener('click', function () { call.classList.add('call') });

  /* 05.2: due tasti, una scheda alla volta (solo dove i tasti si vedono). Al cambio si ridisegna il vetro. */
  var tabs = [].slice.call(document.querySelectorAll('.mtabs button'));
  var cards = [].slice.call(document.querySelectorAll('.mcards .gc'));
  if (!tabs.length || cards.length !== tabs.length) return;
  function pick(i) {
    tabs.forEach(function (b, j) { b.setAttribute('aria-selected', i === j ? 'true' : 'false'); b.tabIndex = i === j ? 0 : -1 });
    cards.forEach(function (c, j) { c.classList.toggle('on', i === j) });
    dispatchEvent(new Event('resize'));
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(i) });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); var k = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length; pick(k); tabs[k].focus() }
    });
  });
  pick(0);
})();

/* 05.2 Work: la striscia. Lo scroll verticale resta libero; di lato si va col trackpad, col dito, trascinando o col selettore */
(function () {
  var tr = document.getElementById('wkt'), sel = document.getElementById('wsel');
  if (!tr || !sel) return;
  var cards = [].slice.call(tr.querySelectorAll(':scope > .wkc')), RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tabs = sel.querySelector('.wsx'), prev = sel.querySelector('[data-d="-1"]'), next = sel.querySelector('[data-d="1"]');
  var cur = -1, IO = 'IntersectionObserver' in window, touched = false, anim = 0, auto = false;

  cards.forEach(function (c, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', c.dataset.name);
    b.innerHTML = '<i style="--t:' + c.dataset.t + '"></i><span><span class="lg"></span><span class="sh"></span></span>';
    b.querySelector('.lg').textContent = c.dataset.name;
    b.querySelector('.sh').textContent = c.dataset.s || c.dataset.name;   /* sul telefono il nome corto */
    b.addEventListener('click', function () { touched = true; go(i) });
    tabs.appendChild(b);
  });
  var ticks = [].slice.call(tabs.children);

  var pad = function () { return parseFloat(getComputedStyle(tr).scrollPaddingLeft) || 0 };
  var max = function () { return tr.scrollWidth - tr.clientWidth };
  var at = function (i) { return Math.max(0, Math.min(max(), cards[i].offsetLeft - pad())) };

  /* la corsa: una frenata morbida fino alla scheda, senza lo snap del browser che va a scatti */
  var glide = function (to, ms) {
    cancelAnimationFrame(anim);
    var from = tr.scrollLeft, d = to - from;
    if (Math.abs(d) < 1 || RM) { tr.scrollLeft = to; tr.classList.remove('free'); return }
    tr.classList.add('free'); auto = true;
    var t0 = performance.now(); ms = ms || Math.min(900, 420 + Math.abs(d) * .35);
    (function f(t) {
      var p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 4);
      tr.scrollLeft = from + d * e;
      if (p < 1) anim = requestAnimationFrame(f); else { auto = false; tr.classList.remove('free') }
    })(t0);
  };
  var go = function (i) { glide(at(Math.max(0, Math.min(cards.length - 1, i)))) };

  var show = function (i) {
    if (i === cur) return;
    var first = cur < 0; cur = i;
    ticks.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); t.tabIndex = j === i ? 0 : -1 });
    prev.disabled = i === 0; next.disabled = i === cards.length - 1;
    if (!first && touched && navigator.vibrate) navigator.vibrate(8);   /* Android: un tocco a ogni lavoro (su iPhone il browser non lo permette) */
  };
  var nearest = function (x) {
    var best = 0, d = 1e9;
    cards.forEach(function (c, j) { var k = Math.abs(at(j) - x); if (k < d) { d = k; best = j } });
    return best;
  };
  var raf = 0;
  tr.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; show(nearest(tr.scrollLeft)) }) }, { passive: true });
  tr.addEventListener('touchstart', function () { touched = true; cancelAnimationFrame(anim); tr.classList.remove('free') }, { passive: true });
  tr.addEventListener('wheel', function () { if (auto) { cancelAnimationFrame(anim); auto = false; tr.classList.remove('free') } }, { passive: true });
  [prev, next].forEach(function (b) {
    b.addEventListener('click', function () { touched = true; b.classList.remove('call'); go(cur + +b.dataset.d) });
  });
  tr.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(cur + (e.key === 'ArrowRight' ? 1 : -1)) }
  });
  show(0);

  /* trascinare col mouse: la striscia segue la mano uno a uno, al rilascio prosegue con la sua spinta e si ferma sulla scheda.
     Un clic senza trascinare entra nel lavoro */
  var down = null, moved = false, mmc = null, hist = [], start = 0;
  var cursor = function () { return mmc || (mmc = document.querySelector('.mmc')) };
  tr.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('.wkcta')) return;
    cancelAnimationFrame(anim); auto = false;
    down = { x: e.clientX, l: tr.scrollLeft }; start = tr.scrollLeft; moved = false; hist = [[e.clientX, performance.now()]];
  });
  addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - down.x;
    if (!moved && Math.abs(dx) > 5) { moved = true; tr.classList.add('drag', 'free'); if (cursor()) mmc.classList.add('wmv') }
    if (!moved) return;
    tr.scrollLeft = down.l - dx;
    hist.push([e.clientX, performance.now()]); if (hist.length > 6) hist.shift();
  });
  addEventListener('pointerup', function () {
    if (!down) return; down = null;
    if (cursor()) mmc.classList.remove('wmv');
    if (!moved) return;
    tr.classList.remove('drag');
    var a = hist[0], b = hist[hist.length - 1], v = (b[1] - a[1]) > 0 ? (b[0] - a[0]) / (b[1] - a[1]) : 0;   /* px al ms */
    var aim = tr.scrollLeft - v * 260, i = nearest(aim);
    var dist = tr.scrollLeft - start;
    /* una spinta decisa, o un trascinamento di un pezzo di scheda, porta sempre alla scheda dopo */
    if (i === cur && (Math.abs(v) > .35 || Math.abs(dist) > Math.min(140, cards[cur].offsetWidth * .15))) i = cur + ((Math.abs(v) > .35 ? -v : dist) > 0 ? 1 : -1);
    go(i);
  });
  tr.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }, true);
  tr.addEventListener('dragstart', function (e) { e.preventDefault() });

  /* il cursore: sopra la striscia la cornice grande con le due frecce */
  tr.addEventListener('pointerenter', function (e) {
    if (e.pointerType !== 'mouse' || !cursor()) return;
    if (!mmc.querySelector('.war')) { var w = document.createElement('span'); w.className = 'war'; mmc.appendChild(w) }
    mmc.classList.add('wdr');
  });
  tr.addEventListener('pointerleave', function () { if (cursor() && !down) mmc.classList.remove('wdr', 'wmv') });
  addEventListener('pointerup', function (e) { if (cursor() && !tr.contains(e.target)) mmc.classList.remove('wdr') });

  if (!IO) { cards.forEach(function (c) { c.classList.add('wkon') }); return }

  /* la prima volta: un passo a sinistra e ritorno, e il bottone avanti chiama */
  var hinted = false;
  new IntersectionObserver(function (es, o) {
    if (!es[0].isIntersecting || hinted) return;
    hinted = true; o.disconnect();
    if (tr.scrollLeft > 4) return;
    setTimeout(function () {
      next.classList.add('call'); setTimeout(function () { next.classList.remove('call') }, 1500);
      if (RM) return;
      tr.classList.add('nudge'); setTimeout(function () { tr.classList.remove('nudge') }, 1300);
    }, 450);
  }, { threshold: .6 }).observe(tr);

  /* le macchine girano solo nelle schede che si vedono */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('wkon', e.isIntersecting) }) }, { threshold: .35 });
  cards.forEach(function (c) { io.observe(c) });

  /* i disegni dei lavori in arrivo stanno dentro il loro palco */
  var fit = function () {
    [].forEach.call(tr.querySelectorAll('.wst .art'), function (a) {
      var p = a.parentNode; a.style.setProperty('--k', Math.min(p.clientWidth / 384, p.clientHeight / 480) * .92);
    });
  };
  fit(); addEventListener('resize', fit);
})();
