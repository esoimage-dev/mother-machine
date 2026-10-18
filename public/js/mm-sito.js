/* Mother Machine · comportamenti del sito vero sopra le pagine approvate (prototipo/).
   Caricato in fondo a ogni pagina, dopo gli script della pagina (usa SH, bar, mini, go). */
(function () {
  var R = document.documentElement, bar = document.getElementById('bar');
  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  function frames(n, f) { if (!n) return f(); requestAnimationFrame(function () { frames(n - 1, f) }) }
  function unboot() { R.classList.remove('mm-boot') }

  /* il logo e "05 Home" nel footer portano alla home, con l'ascensore */
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

  /* caricamento normale: la pagina prende il suo stato, poi le transizioni si accendono */
  if (!R.classList.contains('mm-arr')) {
    ready.then(function () { frames(2, unboot) });
    setTimeout(unboot, 2000);
    return;
  }

  /* arrivo con l'ascensore: porte chiuse, solo logo e contatore. Se la pagina di prima aveva il logo
     piccolo si parte piccoli, e il logo si riapre mentre si aprono le porte. */
  /* la testata e' gia' "in corsa" (e piegata se serve) dallo script subito dopo la testata */
  var done = false;
  function open() {
    if (done) return; done = true;
    unboot(); R.classList.remove('mm-hide');
    frames(1, function () {
      bar.classList.remove('riding'); R.classList.remove('mm-arr-fold');
      if (typeof mini === 'function') mini(); else bar.classList.remove('fold');
      SH.open().then(function () {
        R.classList.remove('mm-arr');
        var r = document.getElementById('ride'); r.classList.remove('on'); r.setAttribute('aria-hidden', 'true');
      });
    });
  }
  ready.then(function () { frames(2, open) });
  setTimeout(open, 2500);
})();
