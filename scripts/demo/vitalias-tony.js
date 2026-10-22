/* Mother Machine · demo di Vitalia's: la Control Room si aggiorna da sola quando il telefono prenota o paga.
   Gira dopo il codice vero della Control Room e ne usa le funzioni (bookings, loadBlocks, renderCalendar, selectDay). */
(function () {
  var toast = document.createElement('div');
  toast.setAttribute('role', 'status');
  toast.style.cssText = 'position:fixed;left:50%;top:14px;z-index:9999;transform:translate(-50%,-140%);transition:transform .45s cubic-bezier(.2,.8,.2,1);' +
    'background:#1F1A16;color:#F5EFE0;border:1px solid rgba(245,239,224,.16);border-radius:12px;padding:10px 16px;font:500 14px Geist,system-ui,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.35);white-space:nowrap';
  document.body.appendChild(toast);
  var tt = 0;
  function say(t) { toast.textContent = t; toast.style.transform = 'translate(-50%,0)'; clearTimeout(tt); tt = setTimeout(function () { toast.style.transform = 'translate(-50%,-140%)' }, 3200) }

  /* nella pagina del caso il computer si apre sul calendario, non sui codici sconto */
  function toCal() { var l = document.querySelector('.legend'); if (l && window.innerWidth > 700) window.scrollTo(0, l.getBoundingClientRect().top + window.scrollY - 16) }
  /* appena aperta: se dal lato Customer e' arrivata una prenotazione da poco, la Control Room la mostra subito */
  var tries = 0; (function wait() {
    if (document.getElementById('adminWrap') && document.getElementById('adminWrap').style.display === 'block') {
      var n = window.MM_DEMO && MM_DEMO.last();
      if (n && Date.now() - n.at < 15 * 60 * 1000) window.MM_DEMO_REFRESH(n.what); else { toCal(); setTimeout(toCal, 700) }
    } else if (tries++ < 40) setTimeout(wait, 100);
  })();

  window.MM_DEMO_REFRESH = async function (what) {
    try {
      var r = await fetch('/.netlify/functions/admin-bookings');
      bookings = (await r.json()).filter(function (b) { return b && !(b.pendingPayment && b.paymentStatus === 'unpaid') });
      await loadBlocks();
      if (what === 'paid' || what === 'quote') {
        var last = bookings.slice().sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)) })[0];
        if (last && last.eventDateISO) {
          var d = new Date(last.eventDateISO + 'T12:00:00');
          viewYear = d.getFullYear(); viewMonth = d.getMonth();
          renderCalendar(); selectDay(last.eventDateISO); toCal();
          say(what === 'paid' ? '🍕 New booking · ' + last.name + ' · paid online' : '📋 New quote request · ' + last.name);
          return;
        }
      }
      renderCalendar();
      if (selectedDateISO) selectDay(selectedDateISO, true);
    } catch (e) {}
  };
})();
