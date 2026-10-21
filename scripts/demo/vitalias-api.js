/* Mother Machine · demo di Vitalia's Pizza on Wheels.
   Le pagine sono il codice vero (prenotazione e Control Room); questo file prende il posto del loro server.
   Risponde alle stesse chiamate (/.netlify/functions/...) con dati inventati, tenuti nel browser di chi guarda.
   Telefono e computer sono due finestre della stessa pagina: si parlano con BroadcastChannel, cosi' una
   prenotazione fatta sul telefono arriva subito nella Control Room. Niente pagamenti veri, niente mail. */
(function () {
  'use strict';
  var SETTINGS = /*SETTINGS*/{}/*SETTINGS*/;
  var KEY = 'mm-vit-demo-1', CH = 'mm-vit-demo';
  var ch = ('BroadcastChannel' in window) ? new BroadcastChannel(CH) : null;
  var realFetch = window.fetch.bind(window);

  /* dentro la pagina del caso le finestre non devono muovere lo scroll di chi le ospita:
     scrollIntoView scorre solo la finestra della demo */
  if (window.top !== window) {
    Element.prototype.scrollIntoView = function (o) {
      var r = this.getBoundingClientRect(), b = (o && typeof o === 'object' && o.block) || (o === false ? 'end' : 'start');
      var y = window.scrollY + r.top - (b === 'center' ? (innerHeight - r.height) / 2 : b === 'end' ? innerHeight - r.height : b === 'nearest' ? (r.top < 0 ? 0 : r.bottom > innerHeight ? innerHeight - r.height : r.top) : 0);
      window.scrollTo({ top: Math.max(0, y), behavior: (o && o.behavior) || 'auto' });
    };
    /* anche il focus non deve far scorrere la pagina che ospita la demo */
    var focus0 = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (o) { return focus0.call(this, Object.assign({}, o || {}, { preventScroll: true })) };
  }

  /* niente notifiche push nella demo: la Control Room nasconde il pannello da sola */
  try { delete window.PushManager } catch (e) {}

  /* ---- date relative a oggi, cosi' la demo e' sempre "questo mese" ---- */
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
  function addDays(n) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return d }
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function label(isoDate) { var d = new Date(isoDate + 'T12:00:00'); return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() }
  function money(c) { return '$' + (c / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
  function now() { return new Date().toISOString() }
  function balanceDue(isoDate) { var d = new Date(isoDate + 'T12:00:00'); d.setDate(d.getDate() - 21); return iso(d) }
  function nextSat(from) { var d = addDays(from); while (d.getDay() !== 6) d.setDate(d.getDate() + 1); return d }

  /* ---- le prenotazioni inventate: nomi, indirizzi e numeri non sono di nessuno ---- */
  function seed() {
    var P = { social: 150000, party: 175000, celebration: 210000 };
    var rows = [
      ['Sophie Marlow', 'Birthday / Party', 'party', 2, '18:00', 'Backyard', '4870', 'Cairns Area', 'deposit_paid', 'Margherita, Diavola, Capricciosa, Bufalina, Godfather, Garlic Focaccia', 4, 2],
      ['Liam & Grace', 'Wedding', 'celebration', 9, '17:30', 'Event Venue', '4879', 'Palm Cove / Trinity Beach', 'fully_paid', 'Margherita, Diavola, Bufalina, Godfather, Gambero Rosso, Umbria, 4 Formaggi e Tartufo, Siciliana', 8, 4],
      ['Harbour Lane Co.', 'Corporate Event', 'party', 12, '12:00', 'Car Park', '4870', 'Cairns Area', 'unpaid', 'Margherita, Diavola, Capricciosa, Norcina, Garlic Focaccia', 0, 3],
      ['Ava Thompson', 'Birthday / Party', 'social', 16, '16:00', 'Patio / Deck', '4878', 'Smithfield / Yorkeys Knob', 'quote_requested', '', 0, 0],
      ['Noah Bennett', 'Backyard Gathering', 'social', 23, '18:30', 'Backyard', '4869', 'Edmonton', 'deposit_paid', 'Margherita, Diavola, Napule\', Norcina', 2, 0],
      ['St Mary\'s Fete', 'School / Community Event', 'celebration', 30, '11:00', 'Park / Outdoor', '4865', 'Gordonvale', 'fully_paid', 'Margherita, Diavola, Capricciosa, Garlic Focaccia, Siciliana, Umbria', 6, 6],
      ['Mia Collins', 'Birthday / Party', 'party', 37, '19:00', 'Backyard', '4881', 'Kuranda', 'deposit_paid', 'Margherita, Bufalina, Godfather, Gambero Rosso, 4 Formaggi e Tartufo', 3, 1],
      ['Oliver Reid', 'Wedding', 'celebration', 51, '17:00', 'Event Venue', '4877', 'Port Douglas Area', 'deposit_paid', 'Margherita, Diavola, Capricciosa, Bufalina, Godfather, Umbria, Norcina, Siciliana', 10, 5]
    ];
    var list = rows.map(function (r, i) {
      var date = r[3] < 0 ? iso(addDays(r[3])) : iso(nextSat(r[3]));
      var base = P[r[2]], travel = (SETTINGS.travel && SETTINGS.travel[r[6]] || 0) * 100;
      var evening = r[4] >= (SETTINGS.eveningThreshold || '19:00') ? (SETTINGS.eveningSurcharge || 100) * 100 : 0;
      var addons = r[10] * (SETTINGS.addonVegan || 3) * 100 + r[11] * (SETTINGS.addonGF || 10) * 100;
      var total = base + travel + evening + addons, st = r[8], quote = st === 'quote_requested';
      var paid = st === 'fully_paid' ? total : st === 'deposit_paid' ? Math.round(total * (SETTINGS.depositPct || .3)) : 0;
      var created = addDays(-12 + i).toISOString();
      var hist = [{ at: created, event: quote ? 'Custom quote requested' : 'Booking submitted' }];
      if (paid) hist.push({ at: created, event: st === 'fully_paid' ? 'Paid in full via Stripe' : 'Deposit paid via Stripe', amountCents: paid });
      return {
        id: 'demo-' + (i + 1), createdAt: created, updatedAt: created,
        name: r[0], email: r[0].toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '') + '@example.com', phone: '0400 000 00' + i,
        eventDateISO: date, eventDateLabel: label(date), startTime: r[4], eventType: r[1],
        venueLabel: r[5], areaLabel: r[7], address: (12 + i * 7) + ' Example Street', postcode: r[6],
        packageKey: quote ? 'custom' : r[2], packageLabel: quote ? 'Custom event' : SETTINGS_PKG_LABEL(r[2]),
        basePriceCents: quote ? 0 : base, totalPriceCents: quote ? null : total, totalPrice: quote ? 'Custom quote, to be confirmed' : money(total),
        paymentChoice: st === 'fully_paid' ? 'full' : quote ? 'quote' : 'deposit', paymentStatus: st, stripeAmountPaid: paid,
        amountDueToday: paid ? money(paid) : '', balanceAmount: st === 'deposit_paid' ? money(total - paid) : '',
        balanceDueDateISO: st === 'deposit_paid' ? balanceDue(date) : null,
        pendingPayment: false, eventStatus: 'upcoming', remindersSent: [],
        pizzas: r[9], numVegan: r[10] ? String(r[10]) : '', numGF: r[11] ? String(r[11]) : '', nutellaDessert: i % 2 === 0, marshmallowTopping: i % 4 === 0,
        travelFee: travel ? money(travel) : '', eveningSurcharge: evening ? money(evening) : '', addonsAmount: addons ? money(addons) : '',
        notes: quote ? 'About 25 kids and 15 adults. Can we do mini pizzas for the kids?' : '', adminNotes: '', contacted: !quote,
        source: st === 'unpaid' ? 'admin' : 'web', quoteUrl: '#', history: hist
      };
    });
    return { v: 1, bookings: list, blocks: {}, discounts: [{ id: 'XMAS10', code: 'XMAS10', name: 'Christmas events', pct: 10, fromISO: '', toISO: '', eventToISO: '', active: true }], settings: {}, policies: {} };
  }
  function SETTINGS_PKG_LABEL(k) { return { social: 'Social (10–30 guests, ~30 pizzas)', party: 'Party (30–55 guests, ~50 pizzas)', celebration: 'Celebration (55–85 guests, ~80 pizzas)' }[k] || k }

  /* ---- lo stato: nel browser, condiviso tra le due finestre ---- */
  var S = null;
  function load() {
    if (S) return S;
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return (S = s) } catch (e) {}
    S = seed(); persist(); return S;
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch (e) {} }
  function changed(what) { if (what === 'paid' || what === 'quote') S.lastNew = { what: what, at: Date.now() }; persist(); if (ch) ch.postMessage({ state: S, what: what || '' }) }
  if (ch) ch.addEventListener('message', function (e) {
    if (e.data && e.data.state) { S = e.data.state; if (typeof window.MM_DEMO_REFRESH === 'function') window.MM_DEMO_REFRESH(e.data.what) }
    if (e.data && e.data.reset) { S = null; try { localStorage.removeItem(KEY) } catch (x) {} location.reload() }
  });
  window.MM_DEMO = { reset: function () { S = seed(); persist(); if (ch) ch.postMessage({ reset: true }); location.reload() }, last: function () { return load().lastNew || null } };

  function settings() { return Object.assign({}, SETTINGS, load().settings || {}) }
  function find(id) { return load().bookings.filter(function (b) { return b.id === id })[0] }
  function patch(id, upd, ev) {
    var b = find(id); if (!b) return null;
    Object.assign(b, upd, { updatedAt: now() });
    if (ev) b.history = (b.history || []).concat([Object.assign({ at: now() }, ev)]);
    return b;
  }

  /* ---- le risposte, una per funzione ---- */
  function J(obj, status) { return new Response(JSON.stringify(obj), { status: status || 200, headers: { 'Content-Type': 'application/json' } }) }
  function T(text, status) { return new Response(text, { status: status || 200 }) }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms) }) }

  var API = {
    'site-settings': function () { return J(settings()) },
    'admin-save-settings': function (m, b) { if (m === 'GET') return J(settings()); load().settings = Object.assign(load().settings || {}, b || {}); changed('settings'); return J(settings()) },
    'blocked-dates': function () {
      var counts = {}, s = load(), ok = { deposit_paid: 1, fully_paid: 1, cash: 1 }, dead = { cancelled: 1, refunded: 1 };
      s.bookings.forEach(function (r) { if (r.eventDateISO && !dead[r.paymentStatus] && (ok[r.paymentStatus] || r.source === 'admin')) counts[r.eventDateISO] = (counts[r.eventDateISO] || 0) + 1 });
      var blocked = Object.keys(s.blocks || {}), busy = [];
      Object.keys(counts).forEach(function (d) { if (counts[d] >= 2 || s.blocks[d]) { if (blocked.indexOf(d) < 0) blocked.push(d) } else busy.push(d) });
      return J({ busy: busy, blocked: blocked, dates: blocked });
    },
    'validate-discount': function (m, b) {
      var code = String(b && b.code || '').trim().toUpperCase(), d = load().discounts.filter(function (x) { return x.code === code })[0];
      if (!code) return J({ valid: false, reason: 'empty' });
      if (!d) return J({ valid: false, reason: 'unknown' });
      if (!d.active) return J({ valid: false, reason: 'inactive' });
      return J({ valid: true, pct: d.pct, name: d.name || d.code, eventToISO: d.eventToISO || '' });
    },
    'booking-submit': function (m, d) {
      var isQuote = String(d.package || '').toLowerCase() === 'custom';
      var choice = isQuote ? 'quote' : (/deposit/i.test(d.payment_method || '') ? 'deposit' : 'full');
      var id = 'booking-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      load().bookings.push({
        id: id, createdAt: now(), updatedAt: now(), name: d.name, email: d.email, phone: d.phone,
        eventDateISO: d.date || null, eventDateLabel: d.event_date_label || d.date || '', startTime: d.start_time || '',
        areaLabel: d.area_label || '', venueLabel: d.venue_label || d.venue || '', address: d.address || '', postcode: d.postcode || '',
        packageLabel: d.package_label || d.package || '', packageKey: isQuote ? 'custom' : String(d.package || '').toLowerCase(),
        totalPrice: d.total_price || '', totalPriceCents: d.total_price_cents ? parseInt(d.total_price_cents, 10) : null,
        paymentChoice: choice, amountDueToday: d.amount_due_today || '', balanceAmount: d.balance_amount || '',
        balanceDueDateISO: choice === 'deposit' && d.date ? balanceDue(d.date) : null,
        paymentStatus: isQuote ? 'quote_requested' : 'unpaid', pendingPayment: !isQuote, eventStatus: 'upcoming', remindersSent: [],
        notes: d.notes || '', pizzas: d.pizzas || '', eventType: d.event_type || '', travelFee: d.travel_fee || '',
        numVegan: d.num_vegan || '', numGF: d.num_gf || '', nutellaDessert: !!d.nutella_dessert, marshmallowTopping: !!d.marshmallow_topping,
        addonsAmount: d.addons_amount || '', paymentMethodRaw: d.payment_method || '', eveningSurcharge: d.evening_surcharge_applied || '',
        discountCode: d.discount_code || '', contacted: false, adminNotes: '', source: 'web', quoteUrl: '#',
        history: [{ at: now(), event: isQuote ? 'Custom quote requested' : 'Booking submitted' }]
      });
      changed(isQuote ? 'quote' : 'pending');
      return J({ ok: true, bookingId: id });
    },
    /* il pagamento: nella demo non c'e' Stripe, la prenotazione si conferma come farebbe il webhook */
    'create-checkout': function (m, b) {
      var r = find(b.bookingId); if (!r) return T('Booking not found', 404);
      var total = r.totalPriceCents || 0, full = b.paymentChoice !== 'deposit';
      var amount = full ? total : Math.round(total * (settings().depositPct || .3));
      patch(r.id, { paymentStatus: full ? 'fully_paid' : 'deposit_paid', pendingPayment: false, stripeAmountPaid: amount, stripeSessionId: 'demo' },
        { event: full ? 'Paid in full via Stripe' : 'Deposit paid via Stripe', amountCents: amount });
      changed('paid');
      return wait(700).then(function () { return J({ url: String(b.successUrl || 'confirmed.html').replace(/\/confirmed\.html/, location.pathname.replace(/[^/]*$/, '') + 'confirmed.html') }) });
    },
    'admin-login': function () { return T('ok') },
    'admin-bookings': function (m, b, url) {
      var s = load();
      if (m === 'GET') return J(s.bookings);
      if (m === 'DELETE') { var id = url.searchParams.get('id'); s.bookings = s.bookings.filter(function (x) { return x.id !== id }); changed(); return T('ok') }
      var r = patch(b.id, b.updates || {}); if (!r) return T('Booking not found', 404); changed(); return J(r);
    },
    'admin-block-date': function (m, b, url) {
      var s = load();
      if (m === 'GET') return J(Object.keys(s.blocks).map(function (d) { return s.blocks[d] }));
      if (m === 'DELETE') { delete s.blocks[url.searchParams.get('date')]; changed(); return J({ ok: true }) }
      var n = Math.max(1, parseInt(b.days, 10) || 1), d0 = new Date(b.date + 'T12:00:00');
      for (var i = 0; i < n; i++) { var d = new Date(d0); d.setDate(d.getDate() + i); var k = iso(d); s.blocks[k] = Object.assign({ date: k, at: now() }, b, { date: k }) }
      changed(); return J({ ok: true });
    },
    'admin-discounts': function (m, b, url) {
      var s = load();
      if (m === 'GET') return J(s.discounts);
      if (m === 'DELETE') { var id = url.searchParams.get('id'); s.discounts = s.discounts.filter(function (x) { return x.id !== id }); changed(); return T('ok') }
      var code = String(b.code || '').trim().toUpperCase(), rec = { id: code, code: code, name: (b.name || '').trim() || code, pct: Number(b.pct) || 0, fromISO: b.fromISO || '', toISO: b.toISO || '', eventToISO: b.eventToISO || '', active: b.active !== false };
      s.discounts = s.discounts.filter(function (x) { return x.id !== code && x.id !== b.id }).concat([rec]); changed(); return J(rec);
    },
    'admin-policies': function (m, b, url) { var s = load(); if (m === 'GET') return J(s.policies[url.searchParams.get('page')] || {}); s.policies[b.page] = { html: b.html || '', updatedAt: now() }; changed(); return J(s.policies[b.page]) },
    'admin-create-booking': function (m, d) {
      var st = settings(), base = Math.max(0, parseInt(d.basePriceCents, 10) || 0);
      var nV = parseInt(d.numVegan, 10) || 0, nG = parseInt(d.numGF, 10) || 0;
      var items = (d.lineItems || []).reduce(function (a, li) { return a + (parseInt(li.amountCents, 10) || 0) * (parseInt(li.qty, 10) || 1) }, 0);
      var total = Math.max(0, base - (parseInt(d.customDiscountCents, 10) || 0) + nV * st.addonVegan * 100 + nG * st.addonGF * 100 + ((st.travel || {})[d.postcode] || 0) * 100 + (d.startTime && d.startTime >= st.eveningThreshold ? st.eveningSurcharge * 100 : 0) + items);
      var method = d.paymentMethod || 'full', ex = d.id && find(d.id), id = ex ? ex.id : 'booking-' + Date.now();
      var dep = Math.min(total, parseInt(d.depositAmountCents, 10) || Math.round(total * st.depositPct));
      var cash = method === 'cash' ? Math.min(total, d.cashPaidCents != null ? parseInt(d.cashPaidCents, 10) || 0 : total) : 0;
      var rec = Object.assign({}, ex || {}, {
        id: id, createdAt: ex ? ex.createdAt : now(), updatedAt: now(), source: 'admin', name: d.name, email: d.email || '', phone: d.phone || '',
        eventDateISO: d.eventDateISO, eventDateLabel: label(d.eventDateISO), startTime: d.startTimeLabel || d.startTime || '', eventType: d.eventType || '',
        areaLabel: d.areaLabel || '', venueLabel: d.venueLabel || '', address: d.address || '', postcode: d.postcode || '',
        packageKey: d.packageKey || 'custom', packageLabel: d.packageLabel || 'Custom event', pizzas: d.pizzas || '', customPizzas: d.customPizzas || [],
        numVegan: nV ? String(nV) : '', numGF: nG ? String(nG) : '', nutellaDessert: !!d.nutellaDessert, marshmallowTopping: !!d.marshmallowTopping,
        notes: d.notes || '', customLineItems: d.lineItems || [], basePriceCents: base, totalPriceCents: total, totalPrice: money(total),
        customDiscountCents: parseInt(d.customDiscountCents, 10) || 0, pendingPayment: false, eventStatus: 'upcoming', quoteUrl: '#', contacted: true,
        paymentChoice: method === 'quote' ? 'deposit' : method === 'cash' ? 'full' : method, quoteSent: method === 'quote',
        paymentStatus: method === 'quote' ? 'quote_requested' : method === 'cash' ? (cash >= total ? 'fully_paid' : cash ? 'deposit_paid' : 'unpaid') : 'unpaid',
        stripeAmountPaid: ex ? ex.stripeAmountPaid || 0 : 0, cashPayments: cash ? [{ at: now(), amountCents: cash }] : (ex ? ex.cashPayments || [] : []),
        balanceDueDateISO: method === 'deposit' ? balanceDue(d.eventDateISO) : null,
        history: (ex && ex.history || []).concat([{ at: now(), event: ex ? 'Edited in admin' : 'Created manually in admin' }])
      });
      var s = load(); s.bookings = s.bookings.filter(function (x) { return x.id !== id }).concat([rec]); changed();
      var btn = method === 'quote' ? [{ label: 'Pay 30% deposit · ' + money(dep), url: '#' }, { label: 'Pay in full · ' + money(total), url: '#' }] : method === 'deposit' ? [{ label: 'Pay deposit · ' + money(dep), url: '#' }] : method === 'full' ? [{ label: 'Pay in full · ' + money(total), url: '#' }] : [];
      return J({ ok: true, booking: rec, quoteUrl: '#', buttons: btn, method: method, edited: !!ex });
    },
    'admin-change-price': function (m, b) {
      var r = find(b.bookingId); if (!r) return T('Booking not found', 404);
      var t = Math.round(Number(b.newTotalCents)) || r.totalPriceCents;
      patch(r.id, Object.assign({ totalPriceCents: t, totalPrice: money(t) }, b.packageKey ? { packageKey: b.packageKey } : {}), { event: 'Price changed to ' + money(t) + (b.note ? ' (' + b.note + ')' : '') });
      changed(); return J({ ok: true, booking: r, balanceCents: Math.max(0, t - (r.stripeAmountPaid || 0)), emailed: !!b.sendEmail });
    },
    'admin-record-cash': function (m, b, url) {
      var r = find(b && b.bookingId || url.searchParams.get('bookingId')); if (!r) return T('Booking not found', 404);
      if (m === 'DELETE') { r.cashPayments = (r.cashPayments || []).slice(0, -1); changed(); return J({ ok: true, booking: r, removed: 0, balance: 0, settled: false }) }
      var c = Math.max(0, parseInt(b.cashCents, 10) || 0), paid = (r.stripeAmountPaid || 0) + (r.cashPayments || []).reduce(function (a, x) { return a + x.amountCents }, 0) + c;
      var settled = paid >= (r.totalPriceCents || 0);
      patch(r.id, { cashPayments: (r.cashPayments || []).concat([{ at: now(), amountCents: c }]), paymentStatus: settled ? 'fully_paid' : 'deposit_paid' }, { event: 'Cash received', amountCents: c });
      changed(); return J({ ok: true, booking: r, applied: c, balance: Math.max(0, (r.totalPriceCents || 0) - paid), settled: settled });
    },
    'admin-record-cash-refund': function (m, b, url) { var r = find(b && b.bookingId || url.searchParams.get('bookingId')); if (!r) return T('Booking not found', 404); changed(); return J({ ok: true, booking: r, applied: parseInt(b && b.amountCents, 10) || 0, removed: 0 }) },
    'move-booking-date': function (m, b) { var r = find(b.bookingId || b.id); if (!r) return T('Booking not found', 404); var d = b.newDateISO || b.date || b.eventDateISO; patch(r.id, { eventDateISO: d, eventDateLabel: label(d), balanceDueDateISO: r.balanceDueDateISO ? balanceDue(d) : null }, { event: 'Moved to ' + label(d) }); changed(); return J({ ok: true, booking: r }) },
    'refund-booking': function (m, b) { var r = find(b.bookingId || b.id); if (!r) return T('Booking not found', 404); var amt = r.stripeAmountPaid || 0; patch(r.id, { paymentStatus: 'refunded', refunds: (r.refunds || []).concat([{ at: now(), amountCents: amt }]) }, { event: 'Refunded via Stripe', amountCents: amt }); changed(); return J({ ok: true, booking: r, refundedCents: amt }) },
    'send-balance-reminder': function (m, b) { var r = find(b.bookingId || b.id); if (!r) return T('Booking not found', 404); patch(r.id, { lastBalanceReminderAt: now() }, { event: 'Balance reminder sent' }); changed(); return J({ ok: true, balanceCents: Math.max(0, (r.totalPriceCents || 0) - (r.stripeAmountPaid || 0)), url: '#', booking: r }) },
    'admin-send-payment-link': function (m, b) { var r = find(b.bookingId); if (r) { patch(r.id, {}, { event: 'Payment link emailed' }); changed() } return J({ ok: true }) },
    'admin-push-subscribe': function () { return J({ ok: true, devices: 0 }) },
    'admin-push-test': function () { return J({ ok: true }) }
  };

  window.fetch = function (input, init) {
    var u = typeof input === 'string' ? input : (input && input.url) || '';
    var m = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    var url = new URL(u, location.href);
    var hit = /\/\.netlify\/functions\/([a-z-]+)/.exec(url.pathname);
    if (hit) {
      var fn = API[hit[1]];
      var body = null; try { body = init && typeof init.body === 'string' ? JSON.parse(init.body) : null } catch (e) {}
      return wait(120 + Math.random() * 160).then(function () { return fn ? fn(m, body || {}, url) : J({ ok: true }) });
    }
    /* il modulo di riserva di Netlify (POST /): nella demo non serve */
    if (m === 'POST' && url.pathname === '/') return Promise.resolve(T('ok'));
    return realFetch(input, init);
  };
})();
