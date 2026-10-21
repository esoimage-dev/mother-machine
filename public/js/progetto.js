/* Mother Machine · pagina progetto: la demo vera (computer e telefono), i numeri che contano, il video del truck. */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches, IO = 'IntersectionObserver' in window;

  /* ---- la demo: Customer o Owner, sul computer e sul telefono. Le pagine si caricano solo quando servono ---- */
  var vd = document.getElementById('vd');
  if (vd) {
    var stage = vd.querySelector('.vdst'), frames = [].slice.call(vd.querySelectorAll('iframe'));
    var tabs = [].slice.call(vd.querySelectorAll('.vdsw button')), hint = vd.querySelector('.vdhint'), near = !IO;
    var side = function () { return stage.getAttribute('data-v') };
    var fit = function () {
      frames.forEach(function (f) {
        var box = f.parentNode, w = box.clientWidth; if (!w) return;
        var k = w / parseFloat(getComputedStyle(f).width);
        f.style.transform = 'scale(' + k + ')'; f.style.height = (box.clientHeight / k) + 'px';
      });
    };
    var load = function () {
      if (!near) return;
      frames.forEach(function (f) { if (!f.src && f.dataset.v === side() && f.parentNode.offsetParent !== null) f.src = f.dataset.src });
      fit();
    };
    if (IO) new IntersectionObserver(function (es) { if (es[0].isIntersecting) { near = true; load() } }, { rootMargin: '600px 0px' }).observe(vd);
    else load();
    addEventListener('resize', fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(stage);
    matchMedia('(max-width:760px)').addEventListener('change', load);

    var say = function (t) { if (hint) hint.textContent = t };
    var pick = function (v) {
      tabs.forEach(function (o) { o.setAttribute('aria-selected', o.dataset.v === v ? 'true' : 'false'); o.classList.remove('call') });
      stage.setAttribute('data-v', v); load();
      say(v === 'o' ? 'The Control Room. Bookings land here by themselves.' : 'Book an event on either screen. Then switch to Owner.');
    };
    tabs.forEach(function (b) { b.addEventListener('click', function () { pick(b.dataset.v) }) });

    /* quando una prenotazione e' pagata, il lato Owner chiama */
    if ('BroadcastChannel' in window) new BroadcastChannel('mm-vit-demo').addEventListener('message', function (e) {
      var w = e.data && e.data.what;
      if ((w === 'paid' || w === 'quote') && side() === 'c') {
        say(w === 'paid' ? 'Booked and paid. Switch to Owner: it is already in the Control Room.' : 'Quote requested. Switch to Owner: it is already in the Control Room.');
        tabs.forEach(function (o) { o.classList.toggle('call', o.dataset.v === 'o') });
      }
    });

    /* il nostro cursore si spegne dentro gli schermi */
    var R = document.documentElement;
    frames.forEach(function (f) {
      f.addEventListener('mouseenter', function () { R.classList.add('mm-inframe') });
      f.addEventListener('mouseleave', function () { R.classList.remove('mm-inframe') });
    });

    /* ricomincia: dati inventati di nuovo, tutte le finestre */
    vd.querySelector('.vdre').addEventListener('click', function () {
      try { localStorage.removeItem('mm-vit-demo-1') } catch (e) {}
      frames.forEach(function (f) { if (f.src) f.src = f.dataset.src });
      pick('c');
    });
  }

  /* ---- le righe di "What we did" salgono una dopo l'altra ---- */
  var dl = document.querySelector('.cfdid');
  if (dl) {
    [].slice.call(dl.children).forEach(function (li, i) { li.style.setProperty('--i', i) });
    if (RM || !IO) dl.classList.add('on');
    else { var io2 = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { dl.classList.add('on'); io2.disconnect() } }, { threshold: .25 }); io2.observe(dl) }
  }

  /* ---- i numeri contano ---- */
  [].slice.call(document.querySelectorAll('.cfn b[data-n]')).forEach(function (el) {
    var n = +el.dataset.n, pre = el.dataset.p || '', s = el.dataset.s || '';
    if (RM || !IO) { el.textContent = pre + n + s; return }
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; io.disconnect(); var a = null;
      (function f(t) { if (!a) a = t; var p = Math.min(1, (t - a) / 1400); el.textContent = pre + Math.round(n * (1 - Math.pow(1 - p, 3))) + s; if (p < 1) requestAnimationFrame(f) })(performance.now());
    }, { threshold: .5 });
    io.observe(el);
  });

  /* ---- il video del truck gira solo quando si vede ---- */
  var v = document.querySelector('.clg video');
  if (v && IO) {
    if (RM) v.preload = 'metadata';
    else new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}) } else v.pause();
    }, { threshold: .25 }).observe(v);
  }
})();
