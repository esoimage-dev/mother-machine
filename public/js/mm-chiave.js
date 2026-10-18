/* Mother Machine · LG, la chiave del personale. Solo al piano LG, a pulsantiera aperta.
   Tieni premuta la chiave 3 secondi: gira piano fino alla seconda tacca (il graffio), la pulsantiera si allunga
   e i bottoni dei piani diventano un tastierino. Codice giusto: il display scrive OPEN, le porte si chiudono
   con il simbolo e si aprono sulla Machine Room. Un tocco sulla chiave richiude; da sola dopo 20 secondi.
   E' la porta di scena, non la serratura: qui c'e' solo l'impronta del codice, e la protezione vera del back office
   sara' Cloudflare Access. */
(function () {
  var root = document.getElementById('navLift');
  if (!root) return;
  var cyl = root.querySelector('.flg .cyl'), flg = root.querySelector('.flg'), slot = cyl && cyl.querySelector('i');
  if (!cyl) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HOLD = 3000, LEN = 4, IDLE = 20000;
  var CODE = 'b4a33d5fdbcbe25858721a9d7210d10c22b59cac44d784ef3ef4c9745713d3bb';   /* sha-256 della sequenza */

  /* il tastierino: una fascia che esce sotto la chiave */
  var kp = document.createElement('div');
  kp.className = 'mmkp'; kp.setAttribute('aria-hidden', 'true');
  kp.innerHTML = '<div class="mmkpi"><span class="mo">Code</span><span class="mmkpd"><i></i><i></i><i></i><i></i></span><span class="mmkpm mo" aria-live="polite">Staff only</span></div>';
  flg.parentNode.insertBefore(kp, flg.nextSibling);
  var dots = [].slice.call(kp.querySelectorAll('.mmkpd i')), msg = kp.querySelector('.mmkpm');

  var code = null, idle = 0, held = 0, turn = null, t0 = 0, eat = false, busy = false;

  /* ---- tenere premuto ---- */
  function start(e) {
    if (code || busy || (e.button != null && e.button !== 0)) return;
    t0 = performance.now(); eat = false;
    cyl.classList.add('mm-holding');
    if (slot && !RM) turn = slot.animate([{ transform: 'rotate(90deg)' }, { transform: 'rotate(135deg)' }], { duration: HOLD, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
    held = setTimeout(function () { held = 0; eat = true; enter() }, HOLD);
  }
  function stop() {
    if (!held) return;
    clearTimeout(held); held = 0;
    cyl.classList.remove('mm-holding');
    if (performance.now() - t0 > 350) eat = true;   /* una pressione lunga lasciata a meta' non e' un tocco */
    if (turn) { var a = turn; turn = null; a.reverse(); a.updatePlaybackRate(4); a.finished.then(function () { a.cancel() }) }
  }
  cyl.addEventListener('pointerdown', start);
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) { cyl.addEventListener(n, stop) });
  cyl.addEventListener('contextmenu', function (e) { e.preventDefault() });
  cyl.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) start(e) });
  cyl.addEventListener('keyup', function (e) { if (e.key === 'Enter' || e.key === ' ') stop() });
  /* il clic che segue la pressione lunga non deve girare la chiave indietro; nel tastierino la chiave esce */
  cyl.addEventListener('click', function (e) {
    if (eat) { eat = false; e.preventDefault(); e.stopImmediatePropagation(); return }
    if (code) { e.preventDefault(); e.stopImmediatePropagation(); leave() }
  }, true);

  /* ---- il tastierino ---- */
  function arm() { clearTimeout(idle); idle = setTimeout(leave, IDLE) }
  function show(n, txt) { dots.forEach(function (d, i) { d.className = i < n ? 'mm-on' : '' }); msg.textContent = txt }
  function enter() {
    code = [];
    if (turn) { turn.cancel(); turn = null }
    cyl.classList.remove('mm-holding');
    root.classList.add('mm-code'); kp.setAttribute('aria-hidden', 'false');
    show(0, 'Enter the code'); arm();
  }
  function leave() {
    code = null; clearTimeout(idle);
    root.classList.remove('mm-code', 'mm-open'); kp.setAttribute('aria-hidden', 'true');
  }
  function press(label, b) {
    if (!code || busy) return;
    arm(); code.push(label);
    if (b) { b.classList.remove('mm-hit'); void b.offsetWidth; b.classList.add('mm-hit') }
    show(code.length, code.length < LEN ? 'Enter the code' : '');
    if (code.length < LEN) return;
    var tried = code.join('-'); code = null; busy = true;
    hash(tried).then(function (h) {
      if (h === CODE) { open(); return }
      kp.classList.remove('mm-no'); void kp.offsetWidth; kp.classList.add('mm-no');
      setTimeout(function () { busy = false; code = []; show(0, 'Try again') }, RM ? 0 : 520);
    });
  }
  function hash(s) {
    if (!window.crypto || !crypto.subtle) return Promise.resolve('');
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (b) {
      return [].map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2) }).join('');
    });
  }
  /* i bottoni dei piani, nel tastierino, sono tasti: niente corsa */
  root.addEventListener('click', function (e) {
    if (!root.classList.contains('mm-code')) return;
    var b = e.target.closest('.fb'); if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (b.closest('.flg')) return;
    var t = b.querySelector('.fbt'); press(t ? t.textContent.trim() : '', b);
  }, true);
  /* anche da tastiera: 1-5 e G (0) */
  addEventListener('keydown', function (e) {
    if (!root.classList.contains('mm-code') || e.metaKey || e.ctrlKey || e.altKey) return;
    var c = e.key.toLowerCase();
    if (/^[0-5]$/.test(c) || c === 'g') {
      e.preventDefault(); e.stopImmediatePropagation();
      var lab = c === 'g' || c === '0' ? 'G' : '0' + c;
      press(lab, [].filter.call(root.querySelectorAll('.flist .fb'), function (b) { return b.querySelector('.fbt').textContent.trim() === lab })[0]);
    } else if (c === 'escape') { e.stopImmediatePropagation(); leave() }
  }, true);

  /* ---- codice giusto: OPEN, porte con il simbolo, Machine Room ---- */
  function open() {
    root.classList.add('mm-open'); show(LEN, 'OPEN'); clearTimeout(idle);
    setTimeout(function () {
      try {
        openNav(false);
        var ride = document.getElementById('ride');
        ride.classList.add('on'); ride.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('mm-riding');
        var doors = SH.close(true);
        (window.MM_DOORS ? MM_DOORS.close(doors) : doors).then(function () { window.MM_DEST = '/lg/room'; if (!MM_LEAVE('-1')) location.href = '/lg/room' });
      } catch (err) { location.href = '/lg/room' }
    }, RM ? 0 : 700);
  }
  /* la pulsantiera chiusa chiude anche il tastierino */
  new MutationObserver(function () { if (!root.classList.contains('on') && code) leave() }).observe(root, { attributes: true, attributeFilter: ['class'] });
})();
