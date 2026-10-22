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
  var cur = -1, IO = 'IntersectionObserver' in window, touched = false, anim = 0, auto = false, swiped = false;
  /* le icone dei lavori le abbiamo disegnate noi (tratto pieno e un secondo tono). Spunta, mezzo cerchio e stellina del calendario: Phosphor Icons (MIT, phosphoricons.com) */
  var IC = {
    truck: '<path class="d" d="M20 52h148v14a18 18 0 0 1-37 0 18 18 0 0 1-37 0 18 18 0 0 1-37 0 18 18 0 0 1-37 0Z"/><g class="l"><path d="M20 52h148v14a18 18 0 0 1-37 0 18 18 0 0 1-37 0 18 18 0 0 1-37 0 18 18 0 0 1-37 0Z"/><path d="M30 96h124v84H30Z"/><path d="M58 124h68"/><path d="M154 108h44l38 44v28h-82"/><circle cx="74" cy="198" r="20"/><circle cx="196" cy="198" r="20"/></g>',
    pasta: '<path class="d" d="M108 128m-84 0a84 84 0 1 0 168 0a84 84 0 1 0-168 0Z"/><g class="l"><circle cx="108" cy="128" r="84"/><path d="M108 128m-16 0a16 16 0 0 1 32 0a32 32 0 0 1-64 0a48 48 0 0 1 96 0"/><path d="M214 24v40a14 14 0 0 0 28 0V24M228 24v208"/></g>',
    beer: '<path class="d" d="M44 76a28 28 0 0 1 36-38 38 38 0 0 1 64 0 28 28 0 0 1 36 38Z"/><path class="d" d="M64 156c16-14 31-14 47 0s31 14 47 0l-6 76H70Z"/><g class="l"><path d="M52 76h120l-14 156H66Z"/><path d="M44 76a28 28 0 0 1 36-38 38 38 0 0 1 64 0 28 28 0 0 1 36 38"/><path d="M172 108h26a22 22 0 0 1 22 22v32a22 22 0 0 1-22 22h-34"/><path d="M64 156c16-14 31-14 47 0s31 14 47 0"/></g>',
    bread: '<path class="d" d="M22 172c-10-66 40-120 106-120s116 54 106 120c-2 18-16 28-34 28H56c-18 0-32-10-34-28Z"/><g class="l"><path d="M22 172c-10-66 40-120 106-120s116 54 106 120c-2 18-16 28-34 28H56c-18 0-32-10-34-28Z"/><path d="M76 104l28 38"/><path d="M114 88l28 38"/><path d="M152 92l26 36"/></g>',
    plus: '<g class="l" stroke-width="24"><path d="M128 40v176M40 128h176"/></g>',
    check: '<path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"/>',
    half: '<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM40,128a88.1,88.1,0,0,1,88-88V216A88.1,88.1,0,0,1,40,128Z"/>',
    spark: '<path d="M208,144a15.78,15.78,0,0,1-10.42,14.94L146,178l-19,51.62a15.92,15.92,0,0,1-29.88,0L78,178l-51.62-19a15.92,15.92,0,0,1,0-29.88L78,110l19-51.62a15.92,15.92,0,0,1,29.88,0L146,110l51.62,19A15.78,15.78,0,0,1,208,144ZM152,48h16V64a8,8,0,0,0,16,0V48h16a8,8,0,0,0,0-16H184V16a8,8,0,0,0-16,0V32H152a8,8,0,0,0,0,16Zm88,32h-8V72a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V96h8a8,8,0,0,0,0-16Z"/>'
  };
  var svg = function (k) { return '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">' + (IC[k] || '') + '</svg>' };
  /* dentro le caselle piene del calendario, mezza informazione: pagato, acconto, nuova */
  [['mxb', 'check'], ['mxp', 'half'], ['mxk', 'spark']].forEach(function (p) {
    [].forEach.call(tr.querySelectorAll('.mxc .' + p[0]), function (c) { c.innerHTML = svg(p[1]) });
  });

  cards.forEach(function (c, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', c.dataset.name);
    b.innerHTML = '<i style="--t:' + c.dataset.t + '"></i><span><span class="lg"></span><span class="sh"></span></span>';
    /* l'icona del lavoro, su tinta unita: chiara sui colori scuri, scura sui chiari */
    var th = b.querySelector('i'), h = parseInt((c.dataset.t || '#000').slice(1), 16);
    th.innerHTML = svg(c.dataset.ic);
    th.style.color = ((h >> 16) * .3 + (h >> 8 & 255) * .59 + (h & 255) * .11) > 150 ? '#121211' : '#F4F2EC';
    b.querySelector('.lg').textContent = c.dataset.name;
    b.querySelector('.sh').textContent = c.dataset.s || c.dataset.name;   /* sul telefono il nome corto */
    b.addEventListener('click', function (e) { if (swiped) { e.preventDefault(); return } touched = true; go(i) });
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
    down = { x: e.clientX, l: tr.scrollLeft }; start = tr.scrollLeft; moved = false; hist = [[tr.scrollLeft, performance.now()]];
  });
  addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - down.x;
    if (!moved && Math.abs(dx) > 5) { moved = true; tr.classList.add('drag', 'free'); if (cursor()) mmc.classList.add('wmv') }
    if (!moved) return;
    tr.scrollLeft = down.l - dx;
    hist.push([tr.scrollLeft, performance.now()]); if (hist.length > 6) hist.shift();
  });
  addEventListener('pointerup', function () {
    if (!down) return; down = null;
    if (cursor()) mmc.classList.remove('wmv');
    if (!moved) return;
    tr.classList.remove('drag');
    release();
  });
  /* al rilascio la striscia prosegue con la sua spinta. Una spinta decisa, o un pezzo di scheda, porta sempre alla scheda dopo */
  var release = function (one) {
    var a = hist[0], b = hist[hist.length - 1], v = (b[1] - a[1]) > 0 ? (b[0] - a[0]) / (b[1] - a[1]) : 0;   /* px al ms */
    var i = nearest(tr.scrollLeft + v * 260), dist = tr.scrollLeft - start, here = nearest(tr.scrollLeft);
    if (one) {   /* dal selettore conta dove porti il dito, senza spinta: un quarto di passo basta per cambiare lavoro */
      var step = cards.length > 1 ? at(1) - at(0) : 1;
      i = here;
      if (i === nearest(start) && Math.abs(dist) > step * .25) i += dist > 0 ? 1 : -1;
      go(i); return;
    }
    if (i === cur && (Math.abs(v) > .35 || Math.abs(dist) > Math.min(140, cards[cur].offsetWidth * .15))) i = cur + ((Math.abs(v) > .35 ? v : dist) > 0 ? 1 : -1);
    go(i);
  };

  /* anche il selettore si trascina: tieni premuto il lavoro acceso e spostalo verso il prossimo, la striscia lo segue */
  var sw = null;
  tabs.addEventListener('pointerdown', function (e) {
    if (e.button) return;
    cancelAnimationFrame(anim); auto = false; swiped = false;
    sw = { x: e.clientX, id: e.pointerId }; start = tr.scrollLeft; hist = [[tr.scrollLeft, performance.now()]];
  });
  tabs.addEventListener('pointermove', function (e) {
    if (!sw || e.pointerId !== sw.id) return;
    var dx = e.clientX - sw.x, step = cards.length > 1 ? at(1) - at(0) : 1;
    if (!swiped && Math.abs(dx) > 6) { swiped = true; touched = true; tabs.setPointerCapture(sw.id); tr.classList.add('free'); sel.classList.add('swiping') }
    if (!swiped) return;
    tr.scrollLeft = start + dx * step / 96;   /* 96 px di dito = un lavoro */
    hist.push([tr.scrollLeft, performance.now()]); if (hist.length > 6) hist.shift();
  });
  var swEnd = function () {
    if (!sw) return; sw = null;
    if (!swiped) return;
    sel.classList.remove('swiping'); release(true);
    setTimeout(function () { swiped = false }, 0);
  };
  tabs.addEventListener('pointerup', swEnd); tabs.addEventListener('pointercancel', swEnd);
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

  /* il vetro dei riquadri, con la tecnica del nostro vetro: dentro c'e' una copia ferma e sfocata di quello che sta sotto
     (niente backdrop-filter dal vivo). La copia si riallinea solo quando cambia la misura */
  var glass = function () {
    [].forEach.call(tr.querySelectorAll('.wst > .mx'), function (m) {
      var st = m.parentNode, g = m.querySelector(':scope > .mxg');
      if (!g) {
        g = document.createElement('span'); g.className = 'mxg'; g.setAttribute('aria-hidden', 'true');
        var b = document.createElement('span'); b.className = 'mxgb';
        [].forEach.call(st.querySelectorAll(':scope > img'), function (im) { var c = im.cloneNode(); c.removeAttribute('loading'); c.alt = ''; b.appendChild(c) });
        g.appendChild(b); m.insertBefore(g, m.firstChild);
      }
      var bb = g.firstChild, cs = getComputedStyle(st);
      bb.style.backgroundColor = cs.backgroundColor; bb.style.backgroundImage = cs.backgroundImage;
      bb.style.width = st.clientWidth + 'px'; bb.style.height = st.clientHeight + 'px';
      bb.style.left = -(m.offsetLeft + m.clientLeft) + 'px'; bb.style.top = -(m.offsetTop + m.clientTop) + 'px';
    });
  };
  glass(); addEventListener('resize', glass);
})();
