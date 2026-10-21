/* Mother Machine · pagina progetto: la demo vera (computer e telefono), i numeri che contano, il video del truck. */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches, IO = 'IntersectionObserver' in window;

  /* ---- la demo: le pagine si caricano solo quando ci si avvicina ---- */
  var vd = document.getElementById('vd');
  if (vd) {
    var stage = vd.querySelector('.vdst'), frames = [].slice.call(vd.querySelectorAll('iframe'));
    var phone = matchMedia('(max-width:760px)');
    var fit = function () {
      frames.forEach(function (f) {
        var box = f.parentNode, w = box.clientWidth;
        if (!w) return;
        var base = parseFloat(getComputedStyle(f).width);
        f.style.transform = 'scale(' + (w / base) + ')';
        f.style.height = (box.clientHeight / (w / base)) + 'px';
      });
    };
    var visible = function (f) { return f.offsetParent !== null };
    var load = function () {
      frames.forEach(function (f) { if (!f.src && visible(f)) f.src = f.dataset.src });
      fit();
    };
    if (IO) new IntersectionObserver(function (es) { if (es[0].isIntersecting) load() }, { rootMargin: '600px 0px' }).observe(vd);
    else load();
    addEventListener('resize', fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(stage);

    /* su telefono: Customer o Owner */
    var tabs = [].slice.call(vd.querySelectorAll('.vdsw button'));
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        tabs.forEach(function (o) { o.setAttribute('aria-selected', o === b ? 'true' : 'false') });
        stage.setAttribute('data-v', b.dataset.v);
        load();
      });
    });
    phone.addEventListener('change', load);

    /* ricomincia: dati inventati di nuovo, tutte e due le finestre */
    vd.querySelector('.vdre').addEventListener('click', function () {
      try { localStorage.removeItem('mm-vit-demo-1') } catch (e) {}
      frames.forEach(function (f) { if (f.src) f.src = f.dataset.src });
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
