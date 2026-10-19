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
