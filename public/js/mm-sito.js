/* Mother Machine · comportamenti del sito vero sopra le pagine approvate (prototipo/).
   Caricato in fondo a ogni pagina, dopo gli script della pagina (usa SH, mini, go). */
(function () {
  var R = document.documentElement, bar = document.getElementById('bar');
  var ride = document.getElementById('ride');
  var dL = ride && ride.querySelector('.door.l'), dR = ride && ride.querySelector('.door.r');
  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  function frames(n, f) { if (!n) return f(); requestAnimationFrame(function () { frames(n - 1, f) }) }
  function unboot() { R.classList.remove('mm-boot') }

  /* ---- la testata sulle porte: due strati ----
     La testata vera, chiara ("riding"), sta sopra le porte ed e' ritagliata sulla loro sagoma. Sotto le porte, una copia
     con l'aspetto normale: sta dentro l'ascensore, tra il suo fondo e le porte, cosi' resta visibile anche quando
     l'ascensore copre la pagina. Mentre le porte si muovono, ogni pixel del logo e del numero del piano ha il colore
     giusto per quello che ha dietro.
     Il ritaglio e' un'animazione del browser con la stessa curva, la stessa durata e lo stesso istante di partenza delle
     porte (Shaft: chiusura 480 ms, apertura 620 ms, ciascuna porta larga il 50,4% e spinta del 101%): si muovono insieme,
     allo stesso fotogramma, senza calcoli fotogramma per fotogramma. */
  var copy = null, watch = null, cut = null;
  function makeCopy() {
    if (copy) return;
    /* tutto quello che nella testata si sta ancora muovendo (la scritta "Close" che torna "Systems", i quadratini che
       tornano dalla forma "pulsantiera aperta") arriva subito allo stato finale: testata vera e copia sono identiche */
    bar.getAnimations({ subtree: true }).forEach(function (a) {
      if (a.effect && a.effect.getTiming().iterations !== Infinity) a.finish();   /* la freccia che lampeggia resta com'e' */
    });
    copy = bar.cloneNode(true);
    copy.removeAttribute('id');
    [].forEach.call(copy.querySelectorAll('[id]'), function (e) { e.removeAttribute('id') });
    /* per sicurezza, nella copia resta solo la scritta finale, ferma */
    [].forEach.call(copy.querySelectorAll('.rl'), function (r) {
      while (r.children.length > 1) r.removeChild(r.firstElementChild);
      if (r.firstElementChild) r.firstElementChild.removeAttribute('style');
    });
    copy.classList.remove('riding'); copy.classList.add('mm-copy');
    copy.setAttribute('aria-hidden', 'true'); copy.inert = true;
    ride.insertBefore(copy, dL);
    /* la copia segue la testata vera: logo che si piega o si riapre, luce */
    watch = new MutationObserver(function () {
      copy.classList.toggle('fold', bar.classList.contains('fold'));
      copy.setAttribute('data-luce', bar.getAttribute('data-luce'));
    });
    watch.observe(bar, { attributes: true, attributeFilter: ['class', 'data-luce'] });
  }
  function dropCopy() { if (!copy) return; watch.disconnect(); copy.remove(); copy = null }
  /* sagoma delle porte: due fasce, da sinistra fino al bordo della porta sinistra e dal bordo della destra in poi */
  function shape(closed) {
    var W = innerWidth, l = closed ? .504 * W : -.00504 * W, r = closed ? .496 * W : 1.00504 * W;
    return 'polygon(0px 0px,' + l + 'px 0px,' + l + 'px 400px,0px 400px,0px 0px,' + r + 'px 0px,' + W + 'px 0px,' + W + 'px 400px,' + r + 'px 400px,' + r + 'px 0px)';
  }
  function cutAlong(closing) {
    if (cut) cut.cancel();
    cut = bar.animate([{ clipPath: shape(!closing) }, { clipPath: shape(closing) }],
      { duration: closing ? 480 : 620, easing: SH.EC, fill: 'forwards' });
  }
  function uncut() { if (cut) { cut.cancel(); cut = null } }
  window.MM_DOORS = {
    /* da chiamare nello stesso istante in cui partono le porte */
    close: function (moving) {
      makeCopy(); bar.classList.add('riding'); cutAlong(true);
      return moving.then(function (v) { uncut(); dropCopy(); return v });
    },
    prepare: makeCopy,
    open: function (moving) {
      makeCopy(); cutAlong(false);
      return moving.then(function (v) {
        /* porte aperte: la testata vera e' tutta ritagliata via, la copia e' identica. Si scambiano nello stesso fotogramma. */
        bar.style.transition = 'none';
        bar.classList.remove('riding'); uncut();
        void bar.offsetWidth; dropCopy();
        requestAnimationFrame(function () { bar.style.transition = '' });
        return v;
      });
    }
  };

  /* ---- una scheda puo' portare dritta alla pagina di un progetto (data-dest), sempre con l'ascensore ---- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-dest]');
    if (a) window.MM_DEST = a.getAttribute('data-dest');
  }, true);

  /* ---- il logo e "05 Home" nel footer portano alla home, con l'ascensore ---- */
  var p = location.pathname;
  if (p !== '/' && p !== '/index.html') {
    [].forEach.call(document.querySelectorAll('a.blogo,footer a[href="#top"]'), function (a) {
      a.setAttribute('href', '/');
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
        e.preventDefault(); e.stopImmediatePropagation();
        if (typeof go === 'function' && typeof SH !== 'undefined' && !SH.busy) go(5); else location.href = '/';
      }, true);
    });
  }

  /* ---- al piano 04 le pagine dei progetti portano al registro (stesso piano: niente corsa) ---- */
  if (p.indexOf('/work/') === 0) {
    [].forEach.call(document.querySelectorAll('a[data-go="4"]'), function (a) {
      a.setAttribute('href', '/work');
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
        e.preventDefault(); e.stopImmediatePropagation(); location.href = '/work';
      }, true);
    });
  }

  /* ---- sulla pagina legale, Privacy e Terms nel footer cambiano scheda (stessa pagina) ---- */
  if (p === '/privacy' || p === '/privacy.html') {
    var legal = [].slice.call(document.querySelectorAll('.flgl a'));
    var mark = function (k) { legal.forEach(function (a) { if ((a.hash === '#terms' ? 'terms' : 'privacy') === k) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current') }) };
    mark(location.hash === '#terms' ? 'terms' : 'privacy');
    [].forEach.call(document.querySelectorAll('.lgt button'), function (b) { b.addEventListener('click', function () { mark(b.dataset.d) }) });
    legal.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var b = document.querySelector('.lgt button[data-d="' + (a.hash === '#terms' ? 'terms' : 'privacy') + '"]');
        if (!b) return;
        e.preventDefault();
        if (b.classList.contains('on')) scrollTo({ top: 0, behavior: 'smooth' }); else b.click();
      });
    });
  }

  /* ---- il cursore sopra il pomodoro ----
     Sopra un bottone il cursore e' una cornice con un quadratino pomodoro dentro: sopra un riempimento pomodoro spariva.
     Un quadratino nero gli sta sopra, ritagliato a ogni fotogramma sulla parte che copre l'arancione: mentre il
     riempimento sale, il nero sale con lui. Gira solo mentre il cursore e' sopra qualcosa da premere. */
  var cur = document.querySelector('.mmc');
  if (cur && cur.firstElementChild) {
    var nero = document.createElement('b'); cur.firstElementChild.appendChild(nero);
    var HIT = 'a,button,[role=button],[role=link],label,select,summary', px = 0, py = 0, sopra = null, gira = 0;
    var pomodoro = function (s) { return s.backgroundColor === 'rgb(255, 91, 58)' && s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > .5 };
    var taglia = function (a, b) { return { l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) } };
    var box = function (r) { return { l: r.left, t: r.top, r: r.right, b: r.bottom } };
    /* dove sta il pomodoro dentro l'elemento: l'elemento stesso, il suo riempimento (::before / ::after) o un figlio */
    var zona = function (h) {
      var cs = getComputedStyle(h), r = h.getBoundingClientRect();
      if (pomodoro(cs)) return box(r);
      var dentro = { l: r.left + parseFloat(cs.borderLeftWidth), t: r.top + parseFloat(cs.borderTopWidth), r: r.right - parseFloat(cs.borderRightWidth), b: r.bottom - parseFloat(cs.borderBottomWidth) };
      for (var k = 0, ps = ['::before', '::after']; k < 2; k++) {
        var s = getComputedStyle(h, ps[k]);
        if (s.content !== 'none' && pomodoro(s)) {
          var m = new DOMMatrix(s.transform === 'none' ? undefined : s.transform);
          return taglia({ l: dentro.l + m.e, t: dentro.t + m.f, r: dentro.r + m.e, b: dentro.b + m.f }, dentro);
        }
      }
      var figli = h.querySelectorAll('*');
      for (var i = 0; i < figli.length && i < 40; i++) if (pomodoro(getComputedStyle(figli[i]))) return taglia(box(figli[i].getBoundingClientRect()), box(r));
      return null;
    };
    var passo = function () {
      gira = 0;
      if (!sopra || !cur.classList.contains('hit')) { nero.style.clipPath = ''; return }
      var q = nero.getBoundingClientRect(), z = zona(sopra), cp = 'inset(0 0 100% 0)';
      if (z && q.width) {
        var x = taglia(z, box(q));
        if (x.r > x.l && x.b > x.t) cp = 'inset(' + (x.t - q.top) + 'px ' + (q.right - x.r) + 'px ' + (q.bottom - x.b) + 'px ' + (x.l - q.left) + 'px)';
      }
      nero.style.clipPath = cp;
      gira = requestAnimationFrame(passo);
    };
    addEventListener('pointermove', function (e) {
      sopra = e.target && e.target.closest ? e.target.closest(HIT) : null;
      if (sopra && !gira) gira = requestAnimationFrame(passo);
    }, { passive: true });
  }

  /* ---- la scritta della testata cambia larghezza con dolcezza ----
     Accanto al numero del piano gira il nome ("Systems"), e al passaggio del mouse "All floors" o "Close". In altre lingue
     la scritta e' piu' lunga della sua misura minima ("Todas las plantas"): prima la casella si allargava di colpo e il
     numero saltava a sinistra. Ora la larghezza va alla misura del testo nuovo con una transizione. */
  var lab = document.getElementById('bL');
  if (lab) {
    var misura = function (b) { var r = document.createRange(); r.selectNodeContents(b); return r.getBoundingClientRect().width };
    var adatta = function () {
      var b = lab.lastElementChild; if (!b || !lab.offsetParent) return;
      var min = parseFloat(getComputedStyle(lab).minWidth) || 0;
      lab.style.width = Math.ceil(Math.max(min, misura(b))) + 'px';
    };
    var prima = lab.style.transition; lab.style.transition = 'none'; adatta(); void lab.offsetWidth; lab.style.transition = prima;
    new MutationObserver(function (ms) { if (ms.some(function (m) { return m.addedNodes.length })) adatta() }).observe(lab, { childList: true });
    addEventListener('resize', adatta);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(adatta);
  }

  /* ---- caricamento normale: la pagina prende il suo stato, poi le transizioni si accendono ---- */
  if (!R.classList.contains('mm-arr')) {
    ready.then(function () { frames(2, unboot) });
    setTimeout(unboot, 2000);
    return;
  }

  /* ---- arrivo con l'ascensore ----
     Porte chiuse, sopra solo logo e numero del piano (la testata e' gia' "in corsa", e piegata se la pagina di prima
     aveva il logo piccolo: lo fa lo script subito dopo la testata). Quando la pagina e' pronta le porte si aprono
     e, se serve, il logo si riapre insieme a loro. */
  var done = false;
  function open() {
    if (done) return; done = true;
    unboot(); R.classList.remove('mm-hide');
    frames(1, function () {
      MM_DOORS.prepare();
      R.classList.remove('mm-arr-fold');
      if (typeof mini === 'function') mini(); else bar.classList.remove('fold');
      MM_DOORS.open(SH.open()).then(function () {
        R.classList.remove('mm-arr');
        ride.classList.remove('on'); ride.setAttribute('aria-hidden', 'true');
      });
    });
  }
  /* le porte si aprono quando la pagina e' pronta e il passaggio dalla pagina di prima e' finito */
  Promise.all([ready, window.MM_READY]).then(function () { frames(2, open) });
  setTimeout(open, 2500);
})();
