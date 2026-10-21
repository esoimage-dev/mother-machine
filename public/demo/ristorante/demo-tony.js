/* Mother Machine · demo di Vitalia's Italian Restaurant: il back office si aggiorna da solo quando arriva una richiesta
   dalla pagina Functions. Il codice vero di tony.html vive dentro una funzione chiusa, quindi qui si usano i suoi
   bottoni (Aggiorna, filtri, calendario, Reply & quote) come farebbe una persona. */
(function () {
  var toast = document.createElement('div');
  toast.setAttribute('role', 'status');
  toast.style.cssText = 'position:fixed;left:50%;top:14px;z-index:9999;transform:translate(-50%,-160%);transition:transform .45s cubic-bezier(.2,.8,.2,1);' +
    'background:#1C2420;color:#F6F3EC;border:1px solid rgba(246,243,236,.16);border-radius:12px;padding:10px 16px;font:500 14px "DM Sans",system-ui,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.3);white-space:nowrap;max-width:calc(100vw - 32px);overflow:hidden;text-overflow:ellipsis';
  document.body.appendChild(toast);
  var tt = 0;
  function say(t) { toast.textContent = t; toast.style.transform = 'translate(-50%,0)'; clearTimeout(tt); tt = setTimeout(function () { toast.style.transform = 'translate(-50%,-160%)' }, 3600) }

  var $ = function (s) { return document.querySelector(s) };
  function ready() { var p = document.getElementById('panel'); return p && !p.hidden && document.querySelector('#eventsList .ev-card') }
  function click(el) { if (el) el.click() }

  /* il calendario va al mese della richiesta nuova */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function toMonth(isoDate) {
    for (var i = 0; i < 24; i++) {
      var t = ($('#evCalMonth') || {}).textContent || '', m = MONTHS.indexOf(t.split(' ')[0]), y = parseInt(t.split(' ')[1], 10);
      if (m < 0 || !y) return;
      var want = isoDate.split('-'), diff = (Number(want[0]) - y) * 12 + (Number(want[1]) - 1 - m);
      if (!diff) return;
      click(diff > 0 ? $('#evCalNext') : $('#evCalPrev'));
    }
  }

  /* apre la scheda nuova: la fa vedere, la evidenzia e apre "Reply & quote" */
  function openNew(n) {
    click($('.admin-tab[data-tab="events"]'));
    var s = $('#evSearch'); if (s && s.value) { s.value = ''; s.dispatchEvent(new Event('input', { bubbles: true })) }
    var dayF = $('#evDayFilter'); if (dayF && !dayF.hidden) click($('#evDayClear'));
    click($('[data-ev-filter="upcoming"]'));
    click($('#refreshBtn'));
    var tries = 0;
    (function look() {
      var card = document.querySelector('[data-card="' + n.id + '"]'), spin = $('#refreshBtn.is-spinning');
      if (!card || spin) { if (tries++ < 50) setTimeout(look, 100); return }
      var btn = card.querySelector('[data-ev-reply="' + n.id + '"]'), box = document.getElementById('reply-' + n.id);
      if (btn && box && box.hidden) btn.click();
      card.style.transition = 'box-shadow .5s ease';
      card.style.boxShadow = '0 0 0 3px #3C6A4B, 0 14px 34px rgba(60,106,75,.25)';
      setTimeout(function () { card.style.boxShadow = '' }, 2600);
      setTimeout(function () { window.scrollTo({ top: Math.max(0, card.getBoundingClientRect().top + window.scrollY - 90), behavior: 'smooth' }) }, 120);
      if (n.date) toMonth(n.date);
    })();
    say('📋 New function enquiry · ' + n.name);
  }

  window.MM_DEMO_REFRESH = function (what) {
    if (!ready()) return;
    if (what === 'enquiry') {
      var n = window.MM_DEMO && MM_DEMO.last();
      if (n && n.id) {
        fetch('/.netlify/functions/admin-events').then(function (r) { return r.json() }).then(function (list) {
          var e = list.filter(function (x) { return x.id === n.id })[0];
          openNew({ id: n.id, name: n.name, date: e && e.eventDate });
        });
        return;
      }
    }
    /* un cambio fatto in un'altra finestra del back office: la lista si rilegge, senza toccare chi sta scrivendo */
    if (what === 'events' && !document.querySelector('.ev-reply:not([hidden])')) click($('#refreshBtn'));
  };

  /* appena aperto: se dalla pagina Functions e' arrivata una richiesta da poco, il back office la mostra subito */
  var tries = 0;
  (function wait() {
    if (ready()) {
      var n = window.MM_DEMO && MM_DEMO.last();
      if (n && n.what === 'enquiry' && Date.now() - n.at < 15 * 60 * 1000) window.MM_DEMO_REFRESH('enquiry');
    } else if (tries++ < 60) setTimeout(wait, 100);
  })();
})();
