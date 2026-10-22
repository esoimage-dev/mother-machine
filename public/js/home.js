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
  var dots = sel.querySelector('.wsx'), name = sel.querySelector('.wsn'), prev = sel.querySelector('[data-d="-1"]'), next = sel.querySelector('[data-d="1"]');
  var cur = -1, IO = 'IntersectionObserver' in window, touched = false;

  cards.forEach(function (c, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', c.dataset.name);
    b.addEventListener('click', function () { go(i) });
    dots.appendChild(b);
  });
  var ticks = [].slice.call(dots.children);

  var pad = function () { return parseFloat(getComputedStyle(tr).scrollPaddingLeft) || 0 };
  var go = function (i) {
    i = Math.max(0, Math.min(cards.length - 1, i));
    tr.scrollTo({ left: cards[i].offsetLeft - pad(), behavior: RM ? 'auto' : 'smooth' });
  };
  var show = function (i) {
    if (i === cur) return;
    var first = cur < 0; cur = i;
    ticks.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); t.tabIndex = j === i ? 0 : -1 });
    name.querySelector('b').textContent = cards[i].dataset.name;
    name.querySelector('span').textContent = cards[i].dataset.tags;
    if (!first && !RM) { name.classList.remove('wswap'); void name.offsetWidth; name.classList.add('wswap') }
    prev.disabled = i === 0; next.disabled = i === cards.length - 1;
    if (!first && touched && navigator.vibrate) navigator.vibrate(8);   /* Android: un tocco a ogni lavoro (su iPhone il browser non lo permette) */
  };
  var near = function () {
    var x = tr.scrollLeft + pad(), best = 0, d = 1e9;
    cards.forEach(function (c, j) { var k = Math.abs(c.offsetLeft - x); if (k < d) { d = k; best = j } });
    /* in fondo alla striscia l'ultima scheda non arriva al bordo: vale lei */
    if (tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4) best = cards.length - 1;
    return best;
  };
  var raf = 0;
  tr.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; show(near()) }) }, { passive: true });
  tr.addEventListener('touchstart', function () { touched = true }, { passive: true });
  [prev, next].forEach(function (b) {
    b.addEventListener('click', function () { touched = true; b.classList.remove('call'); go(cur + +b.dataset.d) });
  });
  tr.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(cur + (e.key === 'ArrowRight' ? 1 : -1)) }
  });
  show(0);

  /* trascinare col mouse: la striscia segue la mano, poi si ferma sulla scheda piu' vicina. Un trascinamento non apre il link */
  var down = null, moved = false;
  tr.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('.wkcta')) return;
    down = { x: e.clientX, l: tr.scrollLeft }; moved = false;
  });
  addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - down.x;
    if (!moved && Math.abs(dx) > 6) { moved = true; tr.classList.add('drag') }
    if (moved) tr.scrollLeft = down.l - dx;
  });
  addEventListener('pointerup', function () {
    if (!down) return; down = null;
    if (moved) { tr.classList.remove('drag'); go(near()) }
  });
  tr.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }, true);
  tr.addEventListener('dragstart', function (e) { e.preventDefault() });

  /* il cursore: sopra la striscia mostra le due frecce */
  var mmc = null;
  tr.addEventListener('pointerenter', function (e) {
    if (e.pointerType !== 'mouse') return;
    mmc = mmc || document.querySelector('.mmc');
    if (!mmc) return;
    if (!mmc.querySelector('.war')) { var w = document.createElement('span'); w.className = 'war'; mmc.appendChild(w) }
    mmc.classList.add('wdr');
  });
  tr.addEventListener('pointerleave', function () { if (mmc) mmc.classList.remove('wdr') });

  if (!IO) { cards.forEach(function (c) { c.classList.add('wkon') }); return }

  /* la prima volta: un passo a sinistra e ritorno, e il bottone avanti chiama */
  var hinted = false;
  new IntersectionObserver(function (es, o) {
    if (!es[0].isIntersecting || hinted) return;
    hinted = true; o.disconnect();
    if (tr.scrollLeft > 4) return;
    setTimeout(function () {
      next.classList.add('call'); setTimeout(function () { next.classList.remove('call') }, 1800);
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
