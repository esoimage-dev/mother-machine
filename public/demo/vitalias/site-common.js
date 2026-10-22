/* Shared helper for the public pages. Keeps three things in sync with the
   owner's settings (admin Control Room → Contacts), with the hard-coded page
   content as the no-JS / offline fallback:
     1. the footer copyright YEAR (auto) + ABN,
     2. published Terms / Refund / Cookie text,
     3. the phone / WhatsApp / email everywhere (display text + tel:/wa.me/mailto: links).
   Contact replacement only runs when a value actually differs from the default,
   so an un-configured site does no work and nothing can break. */
(function () {
  var DEF = { abn: '69 279 967 941', phone: '0470 489 661', tel: '0470489661', wa: '61470489661', email: 'pizzatruck@vitalias.au' };
  var current = null;

  function renderFooter(abn) {
    var el = document.querySelector('.footer-copy');
    if (!el) return;
    el.textContent = '© ' + new Date().getFullYear() +
      " Vitalia's Pizza on Wheels · ABN " + abn + ' · All rights reserved';
  }

  // Deposit percentage: any element marked data-deposit-pct shows the owner's
  // current deposit share (e.g. "30%"). The static text is the fallback, so an
  // un-configured or offline site still reads correctly.
  function applyDepositPct(pct) {
    if (pct == null) return;
    var p = Number(pct);
    if (p > 1) p = p / 100; // percent -> fraction, just in case
    var label = Math.round(p * 100) + '%';
    document.querySelectorAll('[data-deposit-pct]').forEach(function (el) { el.textContent = label; });
  }

  function digits(s) { return String(s || '').replace(/[^0-9+]/g, ''); }
  function waFrom(s) { var d = String(s || '').replace(/[^0-9]/g, ''); return d.charAt(0) === '0' ? '61' + d.slice(1) : d; }

  // Swap the default phone/WhatsApp/email for the owner's, in both link hrefs and
  // visible text. No-op when nothing changed.
  function replaceContacts(contact) {
    if (!contact) return;
    var phone = (contact.phone || '').trim() || DEF.phone;
    var tel = digits(contact.phone) || DEF.tel;
    var wa = waFrom(contact.whatsapp || contact.phone) || DEF.wa;
    var email = (contact.email || '').trim() || DEF.email;
    if (phone === DEF.phone && tel === DEF.tel && wa === DEF.wa && email === DEF.email) return;

    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href') || '';
      if (h.indexOf('tel:') === 0 && h.indexOf(DEF.tel) !== -1) a.setAttribute('href', h.split(DEF.tel).join(tel));
      else if (h.indexOf('wa.me/') !== -1 && h.indexOf(DEF.wa) !== -1) a.setAttribute('href', h.split(DEF.wa).join(wa));
      else if (h.indexOf('mailto:') === 0 && h.indexOf(DEF.email) !== -1) a.setAttribute('href', h.split(DEF.email).join(email));
    });

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var nodes = [], node;
    while ((node = walker.nextNode())) {
      var pn = node.parentNode ? node.parentNode.nodeName : '';
      if (pn === 'SCRIPT' || pn === 'STYLE' || pn === 'TEXTAREA' || pn === 'NOSCRIPT') continue;
      nodes.push(node);
    }
    nodes.forEach(function (t) {
      var v = t.nodeValue, nv = v;
      if (phone !== DEF.phone && nv.indexOf(DEF.phone) !== -1) nv = nv.split(DEF.phone).join(phone);
      if (email !== DEF.email && nv.indexOf(DEF.email) !== -1) nv = nv.split(DEF.email).join(email);
      if (nv !== v) t.nodeValue = nv;
    });
  }

  renderFooter(DEF.abn);
  fetch('/.netlify/functions/site-settings')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (s) {
      if (!s) return;
      current = s;
      if (s.contact && s.contact.abn) renderFooter(s.contact.abn);
      if (s.contact) replaceContacts(s.contact);
      applyDepositPct(s.depositPct);
    })
    .catch(function () {});

  // Legal pages: render the owner's published version in place of the static
  // content (fallback stays if nothing is published), then re-apply contacts to
  // the swapped-in text.
  var pol = document.querySelector('.policy-body[data-policy]');
  if (pol) {
    fetch('/.netlify/functions/site-policies?page=' + encodeURIComponent(pol.getAttribute('data-policy')))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rec) { if (rec && rec.html) { pol.innerHTML = rec.html; if (current && current.contact) replaceContacts(current.contact); } })
      .catch(function () {});
  }
})();
