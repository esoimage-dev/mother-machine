/* Mother Machine · la chiave del personale. Da qualsiasi piano, a pulsantiera aperta.
   Tieni premuta la chiave 3 secondi: gira piano fino alla seconda tacca (il graffio), la pulsantiera si allunga
   e i bottoni dei piani diventano un tastierino. Il codice non e' in questa pagina: la sequenza va al server
   (/api/porta), che la confronta con il segreto di Cloudflare. Giusto: il display scrive OPEN, le porte si chiudono
   con il simbolo e si aprono sulla Machine Room. Un tocco sulla chiave richiude; da sola dopo 20 secondi. */
(function () {
  var root = document.getElementById('navLift');
  if (!root) return;
  var cyl = root.querySelector('.flg .cyl'), flg = root.querySelector('.flg'), slot = cyl && cyl.querySelector('i');
  if (!cyl) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HOLD = 3000, LEN = 4, IDLE = 20000;

  /* il tastierino: una fascia che esce sotto la chiave */
  var kp = document.createElement('div');
  kp.className = 'mmkp'; kp.setAttribute('aria-hidden', 'true');
  kp.innerHTML = '<div class="mmkpi"><div class="mmkpc"><span class="mo">Code</span><span class="mmkpd"><i></i><i></i><i></i><i></i></span><span class="mmkpm mo" aria-live="polite">Staff only</span></div></div>';
  flg.parentNode.insertBefore(kp, flg.nextSibling);
  var dots = [].slice.call(kp.querySelectorAll('.mmkpd i')), msg = kp.querySelector('.mmkpm');

  var code = null, idle = 0, held = 0, turn = null, t0 = 0, eat = false, busy = false;

  /* ---- tenere premuto ---- */
  function start(e) {
    if (code || busy || (e.button != null && e.button !== 0)) return;
    t0 = performance.now(); eat = false;
    cyl.classList.add('mm-holding');
    var da = flg.classList.contains('open') ? 90 : 0;   /* chiusa (0) o gia' girata su LG (90) */
    if (slot && !RM) turn = slot.animate([{ transform: 'rotate(' + da + 'deg)' }, { transform: 'rotate(135deg)' }], { duration: HOLD, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
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
    cyl.classList.remove('mm-holding');   /* la rotazione resta ferma a 135 gradi finche' si esce */
    root.classList.add('mm-code'); kp.setAttribute('aria-hidden', 'false');
    show(0, 'Enter the code'); arm();
  }
  function leave() {
    code = null; clearTimeout(idle);
    root.classList.remove('mm-code', 'mm-open'); kp.setAttribute('aria-hidden', 'true');
    if (turn) { turn.cancel(); turn = null }   /* dalla seconda tacca la chiave torna indietro con la sua transizione */
  }
  function press(label, b) {
    if (!code || busy) return;
    arm(); code.push(label);
    if (b) { b.classList.remove('mm-hit'); void b.offsetWidth; b.classList.add('mm-hit') }
    show(code.length, code.length < LEN ? 'Enter the code' : '');
    if (code.length < LEN) return;
    var tried = code; code = null; busy = true; msg.textContent = 'Checking';
    check(tried).then(function (r) {
      if (r === true) { open(); return }
      kp.classList.remove('mm-no'); void kp.offsetWidth; kp.classList.add('mm-no');
      /* codice sbagliato, oppure porta non collegata (segreti mancanti su Cloudflare): lo dice il display */
      setTimeout(function () { busy = false; code = []; show(0, r === 'off' ? 'Door offline' : 'Try again') }, RM ? 0 : 520);
    });
  }
  /* la verifica la fa il server: se va bene, lascia un gettone (cookie) che apre /lg/room */
  function check(seq) {
    return fetch('/api/porta', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ seq: seq }) })
      .then(function (r) { return r.ok ? r.json() : (r.status === 403 ? { ok: false } : { off: true }) })
      .then(function (d) { return d && d.ok ? true : d && d.off ? 'off' : false }, function () { return 'off' });
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
