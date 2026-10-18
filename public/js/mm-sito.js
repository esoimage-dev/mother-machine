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
  ready.then(function () { frames(2, open) });
  setTimeout(open, 2500);
})();
