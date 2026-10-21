/* Mother Machine · demo di Vitalia's Italian Restaurant (funzioni ed eventi).
   Le pagine sono il codice vero (pagina Functions, back office "tony", menu da stampare); questo file prende il
   posto del loro server. Risponde alle stesse chiamate (/.netlify/functions/...) con le stesse forme di risposta,
   con dati inventati tenuti nel browser di chi guarda. Le finestre si parlano con BroadcastChannel: una richiesta
   fatta sulla pagina Functions arriva subito nel back office. Niente mail, niente Stripe, niente PDF dal server:
   il PDF del menu lo scrive il browser con lo stesso codice del cliente (montato qui sotto da demo-ristorante.py). */
(function () {
  'use strict';
  var SET = /*SETMENUS*/{}/*SETMENUS*/;
  var LIB = (function () { /*LIB*/ })() || null;
  var KEY = 'mm-rist-demo-1', CH = 'mm-rist-demo', PW_KEY = 'vitalia_admin_pw';
  var ch = ('BroadcastChannel' in window) ? new BroadcastChannel(CH) : null;
  var realFetch = window.fetch.bind(window);
  var BASE = ((document.currentScript && document.currentScript.src) || location.href).replace(/[?#].*$/, '').replace(/[^/]*$/, '');

  /* il back office si apre senza password: nella demo la chiave e' gia' in tasca */
  try { if (!sessionStorage.getItem(PW_KEY)) sessionStorage.setItem(PW_KEY, 'demo') } catch (e) {}

  /* dentro la pagina del caso le finestre non devono muovere lo scroll di chi le ospita */
  if (window.top !== window) {
    Element.prototype.scrollIntoView = function (o) {
      var r = this.getBoundingClientRect(), b = (o && typeof o === 'object' && o.block) || (o === false ? 'end' : 'start');
      var y = window.scrollY + r.top - (b === 'center' ? (innerHeight - r.height) / 2 : b === 'end' ? innerHeight - r.height : b === 'nearest' ? (r.top < 0 ? 0 : r.bottom > innerHeight ? innerHeight - r.height : r.top) : 0);
      window.scrollTo({ top: Math.max(0, y), behavior: (o && o.behavior) || 'auto' });
    };
    var focus0 = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (o) { return focus0.call(this, Object.assign({}, o || {}, { preventScroll: true })) };
  }

  /* niente notifiche push: il back office nasconde il pannello da solo */
  try { delete window.PushManager } catch (e) {}
  /* niente contatore di visite verso un server: il beacon resta nella demo */
  if (navigator.sendBeacon) {
    var beacon0 = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (u, data) { if (/\/\.netlify\/functions\//.test(String(u))) { track(); return true } return beacon0(u, data) };
  }

  /* ---- date relative a oggi ---- */
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
  function addDays(n, from) { var d = from ? new Date(from + 'T12:00:00') : new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return d }
  function shift(isoDay, n) { return iso(addDays(n, isoDay)) }
  function now() { return new Date().toISOString() }
  function stamp(isoDay, h, m) { var d = new Date(isoDay + 'T12:00:00'); d.setHours(h || 10, m || 0, 0, 0); return d.toISOString() }
  function prettyDate(v) { if (!v) return ''; var d = new Date(v + 'T00:00:00'); return isNaN(d) ? v : d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
  function clean(v, max) { return String(v == null ? '' : v).replace(/\r\n/g, '\n').replace(/[\t ]+/g, ' ').trim().slice(0, max || 500) }
  function uuid() { return (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2)) }

  /* ---- i menu fissi, come li scrive il back office (stesse etichette di tony.html) ---- */
  var COURSES = ['Entrée', 'Antipasto', 'Primi', 'Mains', 'Sides', 'Desserts', 'Drinks', 'Wines'];
  var COURSE_HEAD = { 'Entrée': 'Entrée', 'Antipasto': 'Antipasto', 'Primi': 'Pasta', 'Mains': 'Mains', 'Sides': 'On the side', 'Desserts': 'Dolci', 'Drinks': 'To drink', 'Wines': 'Wine' };
  var COURSE_RULE = { 'Entrée': 'One each', 'Antipasto': 'For the table to share', 'Primi': 'For the table to share', 'Mains': 'One each, your choice', 'Sides': 'For the table', 'Desserts': 'One each, your choice', 'Drinks': 'From the bar', 'Wines': 'For the table' };
  var MENUS = [{ name: 'Set Menu 1 · La Piazza', short: 'La Piazza', price: 49, k: '1' }, { name: 'Set Menu 2 · La Trattoria', short: 'La Trattoria', price: 62, k: '2' },
    { name: 'Set Menu 3 · La Festa', short: 'La Festa', price: 89, k: '3' }, { name: 'Tailor-made menu', short: 'A menu for you', price: 0, k: '3' }];
  function lunchTime(t) { var m = String(t || '').match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i); if (!m) return false; return (Number(m[1]) % 12 + (m[3].toLowerCase() === 'pm' ? 12 : 0)) < 16 }
  function menuData(mi, e, pp, drinkLines) {
    var m = MENUS[mi], lunch = lunchTime(e.eventTime) && SET.lunch && SET.lunch[m.k] && Object.keys(SET.lunch[m.k]).length;
    var courses = (lunch ? SET.lunch[m.k] : SET[m.k]) || {};
    var sections = COURSES.map(function (c) { return { heading: COURSE_HEAD[c], how: COURSE_RULE[c], items: String(courses[c] || '').split('\n').map(function (l) { return l.trim() }).filter(Boolean) } }).filter(function (s) { return s.items.length });
    sections.push(drinkLines.length ? { heading: 'To drink', how: 'Included in your quote', items: drinkLines.concat(['Anything else from the bar, on consumption']) } : { heading: 'To drink', how: 'From the bar', items: ['On consumption, or a bar tab for the table'] });
    return { menuName: m.short, priceLine: '$' + pp + ' per person', sections: sections, dietary: e.dietary || '', note: 'Prepared fresh on the day. Final numbers confirmed one week before the event.' };
  }

  /* ---- le richieste inventate: nomi, mail e numeri non sono di nessuno ----
     Si generano rispetto a oggi, da undici mesi fa a quattro mesi avanti: il calendario e le statistiche non restano
     mai vuoti. Il seme e' fisso: a ogni visita gli stessi eventi, spostati sul giorno di oggi. */
  function seed() {
    var rnd = rng(20261021), pick = function (a) { return a[Math.floor(rnd() * a.length)] }, between = function (a, b) { return a + Math.floor(rnd() * (b - a + 1)) };
    var FIRST = ['Sophie', 'Liam', 'Grace', 'Noah', 'Mia', 'Oliver', 'Ava', 'Jack', 'Chloe', 'Lucas', 'Ella', 'Henry', 'Zoe', 'Leo', 'Ruby', 'Max', 'Isla', 'Archie', 'Lily', 'Tom', 'Matilda', 'Ethan', 'Amelia', 'Harvey', 'Sienna', 'Marco', 'Giulia', 'Hannah', 'Daniel', 'Priya', 'Kenji', 'Mei'];
    var LAST = ['Marlow', 'Bennett', 'Collins', 'Reid', 'Thompson', 'Hayes', 'Walsh', 'Moore', 'Fraser', 'Quinn', 'Doyle', 'Parker', 'Grant', 'Lowe', 'Hart', 'Ford', 'Ross', 'Shaw', 'Lane', 'Price', 'Rinaldi', 'Costa', 'Nguyen', 'Sato', 'Patel', 'Kelly'];
    var ORGS = ['Harbour Lane Co.', 'Reef Street Physio', 'Esplanade Realty', 'Coral Coast Builders', 'Tablelands Dental', 'Trinity Bay Accounting', 'Marlin Marine Tours', 'Northside Rugby Club'];
    var SPACES = ['Inside the restaurant', 'Outside on the deck, by the water', 'Outside on the deck, by the water', 'A bit of both', 'No preference'];
    var FLEX = ['The date is fixed', 'The date is fixed', 'Fairly flexible', 'Very flexible', ''];
    var FOCUS = ['Mostly seafood', 'A bit of everything', 'A bit of everything', 'Pizza focused', 'Mostly meat', 'Vegetarian and vegan friendly'];
    var DIET = ['', '', '', '2 gluten free, 1 vegan', '1 nut allergy', '3 vegetarian', '1 coeliac, 2 no seafood', '1 vegan', '2 vegetarian, 1 dairy free', '1 shellfish allergy'];
    var LUNCH = ['11:30am', '12:00pm', '12:30pm', '1:00pm'], DINNER = ['5:30pm', '6:00pm', '6:30pm', '6:30pm', '7:00pm'];
    var GUESTS = { 'Wedding': [60, 130], 'Work dinner': [14, 55], 'Birthday': [12, 40], 'Party': [25, 80], 'Group booking': [10, 28] };
    var SAID = {
      'Wedding': ['We would love the deck at sunset for the ceremony drinks, then dinner inside.', 'Small wedding, mostly family flying in from Italy. Can we have a long table?', 'Reception after a ceremony at the Botanic Gardens. Cake from our baker.'],
      'Work dinner': ['End of year dinner for the team at {org}.', 'Client dinner for {org}. We need an invoice to the company.', 'Team dinner for {org}, a couple of speeches after mains.'],
      'Birthday': ['It is my mum\'s 70th, a surprise. Can you keep the cake hidden?', '40th birthday, a relaxed long lunch.', '18th birthday, no alcohol for most of the guests.'],
      'Party': ['Engagement party, drinks and something to share.', 'Farewell for a friend moving overseas.', 'Graduation party, family and friends.'],
      'Group booking': ['Cruise ship crew night off.', 'Book club dinner, we are a chatty table.', 'Family reunion, three generations.']
    };
    var WEIGHTS = [['Birthday', 5], ['Work dinner', 4], ['Party', 3], ['Group booking', 3], ['Wedding', 2]];
    var weighted = function () { var r = rnd() * 17, a = 0; for (var i = 0; i < WEIGHTS.length; i++) { a += WEIGHTS[i][1]; if (r < a) return WEIGHTS[i][0] } return 'Birthday' };
    var today = iso(addDays(0)), list = [], n = 0, news = 0;

    for (var day = -330; day <= 125; day++) {
      var d = addDays(day), wd = d.getDay();
      /* il ritmo di un ristorante sul lungomare: venerdi' e sabato pieni, la domenica a pranzo, in settimana le cene di lavoro */
      var count = wd === 6 ? (rnd() < .55 ? 2 : 1) : wd === 5 ? (rnd() < .8 ? 1 : 0) : wd === 0 ? (rnd() < .55 ? 1 : 0) : wd === 4 ? (rnd() < .35 ? 1 : 0) : (rnd() < .14 ? 1 : 0);
      if (day > 60 && rnd() < .4) count = Math.max(0, count - 1);
      for (var c = 0; c < count; c++) {
        n++;
        var date = iso(d), ahead = day, type = wd >= 1 && wd <= 4 ? (rnd() < .7 ? 'Work dinner' : 'Group booking') : weighted();
        var first = pick(FIRST), last = pick(LAST), name = first + ' ' + last, org = pick(ORGS);
        var g = GUESTS[type], guests = between(g[0], g[1]);
        var time = (wd === 0 || (c === 1 && wd === 6) || rnd() < .12) ? pick(LUNCH) : pick(DINNER);
        var mi = type === 'Wedding' ? (rnd() < .6 ? 3 : 2) : guests > 40 && rnd() < .3 ? 2 : (rnd() < .5 ? 1 : rnd() < .6 ? 0 : 2);
        var menuStyle = rnd() < .08 ? 'Not sure yet, we would like advice' : MENUS[mi].name;
        var drinks = type === 'Wedding' || (type === 'Work dinner' && rnd() < .5) ? 'House drinks package' : pick(['From the bar, as we go', 'Welcome prosecco, then the bar', 'House drinks package', 'Not sure yet']);
        var extras = [];
        if (type === 'Birthday' && rnd() < .7) extras.push('Bringing own cake');
        if ((type === 'Wedding' || type === 'Party') && rnd() < .4) extras.push('Wants music or entertainment');
        var staff = rnd() < .14;
        var e = {
          id: 'demo-' + n, eventType: type, eventDate: date, eventTime: time, guests: String(guests),
          dateFlexible: staff ? '' : pick(FLEX), space: guests > 90 ? 'Exclusive use of the whole restaurant' : pick(SPACES),
          menuStyle: menuStyle, menuFocus: /Tailor|Not sure/.test(menuStyle) ? pick(FOCUS) : '', drinks: drinks, dietary: pick(DIET), extras: extras,
          name: name, email: (first + '.' + last).toLowerCase().replace(/[^a-z.]+/g, '') + '@example.com', phone: '0400 000 ' + String(100 + n % 900).slice(-3),
          message: staff ? '' : pick(SAID[type]).replace('{org}', org), status: 'new', replies: [], createdAt: ''
        };
        if (staff) e.source = 'added by staff';

        /* da dove e' arrivata e quando: i matrimoni con mesi di anticipo, le cene con qualche settimana */
        var lead = type === 'Wedding' ? between(90, 260) : between(8, 55);
        var created = shift(date, -lead);
        if (created > today) created = today;
        var st;
        if (date < today) st = (day > -9 && rnd() < .5) ? 'confirmed' : 'done';
        else if (ahead <= 14) st = rnd() < .85 ? 'confirmed' : 'quoted';
        else if (ahead <= 45) st = rnd() < .55 ? 'confirmed' : rnd() < .7 ? 'quoted' : 'new';
        else st = rnd() < .3 ? 'confirmed' : rnd() < .6 ? 'quoted' : 'new';
        if (st === 'new' && news >= 6) st = 'quoted';
        if (st === 'new') { news++; created = shift(today, -Math.min(5, Math.floor(rnd() * 6))) }
        if (created > date) created = date;
        e.createdAt = stamp(created, between(7, 21), between(0, 59));
        e.status = st;

        /* il preventivo che e' partito dal back office, con il menu stampato */
        if (st !== 'new') {
          var pp = mi === 3 ? between(9, 13) * 10 + 5 : MENUS[mi].price, lines = [], dl = [];
          if (drinks === 'House drinks package') { lines.push({ label: 'House drinks package · ' + guests + ' guests', amount: guests * 45 }); dl.push('House drinks package') }
          if (drinks === 'Welcome prosecco, then the bar') { lines.push({ label: 'Welcome prosecco · ' + guests + ' guests', amount: guests * 10 }); dl.push('Welcome prosecco on arrival') }
          if (/gluten free|coeliac/.test(e.dietary)) lines.push({ label: 'Gluten-free preparation · 2 guests', amount: 16 });
          if (extras.indexOf('Bringing own cake') !== -1) lines.push({ label: 'Cakeage', amount: 30 });
          var total = guests * pp + lines.reduce(function (t, l) { return t + l.amount }, 0);
          var md = menuData(mi, e, pp, dl), qAt = stamp(shift(created, 1), between(9, 11), between(0, 59));
          if (qAt > now()) qAt = now();
          var withDep = st === 'confirmed' || st === 'done' ? rnd() < .75 : rnd() < .35;
          var dep = withDep ? (type === 'Wedding' ? 1000 : Math.max(100, Math.round(total * .2 / 50) * 50)) : 0;
          e.replies.push({ at: qAt, subject: 'Your ' + type.toLowerCase() + ' at Vitalia\'s, ' + prettyDate(date), message: 'Hi ' + first + ',\n\nThank you for thinking of us. Here is the menu we would suggest, and the price for ' + guests + ' guests.\n\nWarm regards,\nAntonio',
            total: total, deposit: dep, menu: md.menuName, menuData: md, files: [], tpl: 'quote', sent: true });
          if (dep) { e.depositAmount = dep; e.depositUrl = '#'; e.depositLinkId = 'plink_demo_' + n }
          /* chi ha risposto al preventivo: la conversazione resta sulla scheda */
          if (st === 'quoted' && rnd() < .45) {
            var rAt = new Date(new Date(qAt).getTime() + between(3, 40) * 3600000);
            if (rAt.getTime() < Date.now()) e.inbox = [{ emailId: 'demo-in-' + n, at: rAt.toISOString(), from: e.email, subject: 'Re: ' + e.replies[0].subject,
              text: pick(['Thanks, this looks lovely. Could we swap the panna cotta for tiramisu?', 'Great, can we bring the numbers up by about ten? I will confirm on Friday.', 'Is there parking nearby for older guests?', 'Perfect. Is the deck covered if it rains?']),
              attachments: [], read: ahead > 30 || rnd() < .5 }];
          }
          if (st === 'confirmed' || st === 'done') {
            var cAt = stamp(shift(created, between(2, 9) < lead ? between(2, 9) : 1), 15, 10);
            if (cAt > now()) cAt = now();
            e.replies.push({ at: cAt, subject: 'Confirmed: your ' + type.toLowerCase() + ' on ' + prettyDate(date), message: 'Hi ' + first + ',\n\nWe are all set. Final numbers one week before, please.\n\nGrazie,\nVitalia', total: total, deposit: 0, menu: md.menuName, menuData: md, files: [], tpl: 'confirm', sent: true });
            if (dep) {
              var card = rnd() < .75;
              e.depositPaid = true; e.depositPaidAmount = dep; e.depositPaidAt = cAt; e.depositMethod = card ? 'card' : 'bank';
              if (card) e.stripe = { paymentIntent: 'pi_demo_' + n, session: 'cs_demo_' + n, customerEmail: e.email, livemode: true, charge: 'ch_demo_' + n, brand: pick(['visa', 'visa', 'mastercard', 'amex']), last4: String(between(1000, 9999)), receiptUrl: '#' };
            }
            if (ahead <= 7 || date < today) { e.kitchenSentAt = stamp(shift(date, -5), 16, 20); e.kitchenSentTo = 'kitchen@example.com' }
          }
        }
        if (rnd() < .12) e.staffNote = pick(['Long table on the deck, by the water.', 'High chair for two little ones.', 'Speeches after mains, keep the music low.', 'Regulars: Antonio to say hello.']);
        /* qualche disdetta: archiviata, con il deposito tornato indietro */
        if (date < today && rnd() < .05) {
          e.archived = true; e.cancelledAt = stamp(shift(date, -20), 11, 0);
          if (e.depositPaid) { e.depositRefunds = [{ id: 're_demo_' + n, amount: e.depositPaidAmount, at: e.cancelledAt, status: 'succeeded', method: e.depositMethod, reason: 'Cancelled more than 14 days before', by: 'staff' }]; e.depositRefundedAmount = e.depositPaidAmount }
        }
        list.push(e);
      }
    }
    return { v: 1, day: today, events: list, menus: {}, settings: { id: 'functions', kitchenEmail: 'kitchen@example.com' }, positions: seedPositions(today), applications: seedApps(today, rng(777)), hits: 0 };
  }

  function seedPositions(today) {
    return [
      { id: 'pos-1', role: 'Waiter', type: 'Casual', hours: '20–30 hrs/week', level: 'Little Experience Needed', start: 'Immediate start', startDate: '', note: 'Evenings and weekends on the deck. Friendly, quick, happy to learn the wine list.', active: true, createdAt: stamp(shift(today, -12), 9, 0) },
      { id: 'pos-2', role: 'Pizzaiolo', type: 'Full-time', hours: '38+ hrs/week', level: 'Experience Required', start: 'From a date', startDate: shift(today, 18), note: 'Wood-fired oven, Neapolitan dough. Pizza by the metre on busy nights.', active: true, createdAt: stamp(shift(today, -25), 9, 0) },
      { id: 'pos-3', role: 'Bartender / Barista', type: 'Part-time', hours: '10–20 hrs/week', level: 'Experience Required', start: 'Immediate start', startDate: '', note: 'Coffee by day, spritz by night. RSA needed.', active: true, createdAt: stamp(shift(today, -40), 9, 0) },
      { id: 'pos-4', role: 'Kitchenhand', type: 'Casual', hours: 'Hours vary', level: 'Any Level Welcome', start: 'Immediate start', startDate: '', note: '', active: false, createdAt: stamp(shift(today, -70), 9, 0) }
    ];
  }
  function seedApps(today, rnd) {
    var pick = function (a) { return a[Math.floor(rnd() * a.length)] };
    var P = [['Chiara', 'Bianchi', 'Italian: Native'], ['Lukas', 'Weber', 'German: Native'], ['Emma', 'Laurent', 'French: Native'], ['Yuki', 'Tanaka', 'Japanese: Native'], ['Jack', 'Murphy', ''], ['Sofia', 'Garcia', 'Spanish: Native'],
      ['Ben', 'Carter', ''], ['Ana', 'Silva', 'Portuguese: Native'], ['Tom', 'Fischer', 'German: Native'], ['Lea', 'Martin', 'French: Native'], ['Matteo', 'Ricci', 'Italian: Native'], ['Olivia', 'Brown', ''], ['Hana', 'Kim', 'Korean: Native'], ['Ruby', 'Evans', '']];
    var ROLES = ['Waiter', 'Waiter', 'Runner', 'Bartender / Barista', 'All-rounder (Front of House)', 'Pizzaiolo', 'Chef / Cook', 'Kitchenhand', 'Dishwasher', 'Floor Manager'];
    var KITCHEN = ['Pizzaiolo', 'Chef / Cook', 'Kitchenhand', 'Dishwasher'];
    return P.map(function (p, i) {
      var role = i === 0 ? 'Pizzaiolo' : pick(ROLES), visa = p[2] && !/Italian/.test(p[2]) ? 'Working Holiday Visa (417/462)' : pick(['Australian Citizen / PR', 'Student Visa', 'Working Holiday Visa (417/462)']);
      var a = {
        id: 'app-demo-' + (i + 1), receivedAt: stamp(shift(today, -Math.floor(i * 5 + rnd() * 4)), 8 + Math.floor(rnd() * 12), Math.floor(rnd() * 59)),
        name: p[0] + ' ' + p[1], email: (p[0] + '.' + p[1]).toLowerCase() + '@example.com', phone: '0400 000 ' + String(700 + i), role: role,
        experience: pick(['Some experience (under 1 year)', 'Experienced (1–3 years)', 'Highly experienced (3+ years)', 'No experience, keen to learn']),
        cert: pick(['Yes, current', 'Yes, current', 'No, happy to get one']), certLabel: KITCHEN.indexOf(role) !== -1 ? 'Food Safety certificate' : 'RSA certificate',
        englishLevel: p[2] ? pick(['Fluent', 'Medium', 'Fluent']) : 'Native', extraLangs: p[2] ? [p[2]] : [], visaType: visa,
        visaExpiry: /Holiday|Student/.test(visa) ? shift(today, 200 + Math.floor(rnd() * 200)).slice(0, 7) : '', lengthOfStay: pick(['6–12 months', '12+ months / long term', '3–6 months']),
        message: pick(['I worked two summers in a pizzeria in Naples.', 'Available evenings and weekends.', 'I love the deck, I had dinner there last week!', 'Barista for three years in Melbourne.', '']),
        over18: true, consent: true, cv: { name: p[0] + '-' + p[1] + '-CV.pdf', size: 80000 + Math.floor(rnd() * 90000), type: 'application/pdf' }
      };
      if (i < 9 && rnd() < .8) a.score = Math.floor(rnd() * 4) - (rnd() < .15 ? 1 : 0);
      if (i === 0) { a.score = 3; a.notes = 'Great dough, ask for a trial shift.'; a.trial = { at: shift(today, 2) + 'T15:00', setAt: now() } }
      if (i === 2) a.unavailable = ['mon-m', 'tue-m', 'sun-e'];
      return a;
    });
  }

  /* ---- lo stato: nel browser, condiviso tra le finestre ---- */
  var S = null;
  function load() {
    if (S) return S;
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1 && s.day === iso(addDays(0))) return (S = s) } catch (e) {}
    S = seed(); persist(); return S;
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch (e) {} }
  function changed(what, extra) {
    if (what === 'enquiry') S.lastNew = Object.assign({ what: what, at: Date.now() }, extra || {});
    persist(); if (ch) ch.postMessage({ state: S, what: what || '' });
  }
  if (ch) ch.addEventListener('message', function (e) {
    if (e.data && e.data.state) {
      S = e.data.state;
      if (typeof window.MM_DEMO_REFRESH === 'function') window.MM_DEMO_REFRESH(e.data.what);
      /* il menu da stampare aperto in un'altra finestra si rifa' appena il back office pubblica */
      if (e.data.what === 'menu' && /print-menu\.html$/.test(location.pathname)) location.reload();
    }
    if (e.data && e.data.reset) { S = null; try { localStorage.removeItem(KEY) } catch (x) {} location.reload() }
  });
  window.MM_DEMO = { reset: function () { S = seed(); persist(); if (ch) ch.postMessage({ reset: true }); location.reload() }, last: function () { return load().lastNew || null } };

  function find(id) { return load().events.filter(function (e) { return e.id === id })[0] }
  function track() { load().hits = (load().hits || 0) + 1; persist() }

  /* ---- risposte ---- */
  function J(obj, status) { return new Response(JSON.stringify(obj), { status: status || 200, headers: { 'Content-Type': 'application/json' } }) }
  function T(text, status) { return new Response(text, { status: status || 200 }) }
  function none() { return new Response(null, { status: 204 }) }
  function pdf(bytes, name) { return new Response(new Blob([bytes], { type: 'application/pdf' }), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="' + name + '"' } }) }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms) }) }
  function sane(v) { if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false; var t = new Date(v + 'T00:00:00Z').getTime(); return !isNaN(t) && t > Date.now() - 2 * 864e5 && t < Date.now() + 3 * 365 * 864e5 }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254 }

  /* i menu pubblici: quello salvato dal back office, se c'e', altrimenti quello vero del sito (data/*.json) */
  var MENU_IDS = ['dinner', 'lunch', 'drinks', 'focacce', 'maritozzi'], builtIn = {};
  function menuOf(id) {
    var saved = load().menus[id];
    if (saved) return Promise.resolve(saved);
    if (id === 'maritozzi') return Promise.resolve({});
    if (!builtIn[id]) builtIn[id] = realFetch(BASE + 'data/' + id + '.json').then(function (r) { return r.ok ? r.json() : {} }).catch(function () { return {} });
    return builtIn[id];
  }

  /* lo stesso conto di admin-event-reply.mjs */
  function quoteTotal(q) {
    if (!q) return 0;
    var g = Math.max(0, Math.min(Number(q.guests) || 0, 2000)), pp = Math.max(0, Math.min(Number(q.perPerson) || 0, 100000)), flat = Math.max(0, Math.min(Number(q.flat) || 0, 1000000)), t = 0;
    if (flat > 0) t += flat; else if (g > 0 && pp > 0) t += g * pp;
    (Array.isArray(q.lines) ? q.lines : []).slice(0, 12).forEach(function (l) { t += Math.max(0, Math.min(Number(l.amount) || 0, 1000000)) });
    return t;
  }
  /* il menu del PDF, come lo pulisce admin-menu-pdf.mjs */
  function pdfMenu(b) {
    var sections = (Array.isArray(b.sections) ? b.sections : []).slice(0, 12).map(function (s) {
      return { heading: clean(s && s.heading, 40), how: clean(s && s.how, 60), items: (Array.isArray(s && s.items) ? s.items : []).slice(0, 40).map(function (i) { return clean(i, 160) }).filter(Boolean) };
    }).filter(function (s) { return s.heading && s.items.length });
    return { menuName: clean(b.menuName, 60) || 'Our menu', priceLine: clean(b.priceLine, 60), sections: sections, dietary: clean(b.dietary, 500), note: clean(b.note, 300) };
  }
  function eventLine(e) {
    if (!e) return '';
    var bits = [];
    if (e.name) bits.push(e.eventType ? e.name + ', ' + String(e.eventType).toLowerCase() : e.name);
    if (e.eventDate) bits.push(prettyDate(e.eventDate));
    if (e.guests) bits.push(e.guests + ' guests');
    return bits.join('  ·  ');
  }

  /* ---- i depositi: le stesse regole di lib/payments.mjs ---- */
  function r2(n) { return Math.round(Number(n || 0) * 100) / 100 }
  function refunded(e) { return r2((e.depositRefunds || []).filter(function (r) { return r.status !== 'failed' && r.status !== 'canceled' }).reduce(function (t, r) { return t + (Number(r.amount) || 0) }, 0)) }
  function held(e) { return e.depositPaid ? Math.max(0, r2((Number(e.depositPaidAmount) || 0) - refunded(e))) : 0 }
  function policy(e) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.eventDate || ''), h = held(e);
    var days = m ? Math.round((new Date(+m[1], +m[2] - 1, +m[3]) - new Date(new Date().toDateString())) / 864e5) : null, full = days !== null && days > 14;
    return { days: days, held: h, full: full, suggested: full ? h : 0,
      text: days === null ? 'This booking has no date, so the 14-day rule cannot be checked.' : full ? days + ' days to go: more than 14, so the terms say refund in full.'
        : days >= 0 ? days + ' day' + (days === 1 ? '' : 's') + ' to go: inside 14 days, so the terms say the deposit is kept.' : 'The event has passed, so the terms say the deposit is kept.' };
  }
  var REASONS = { 'more-than-14': 'Cancelled more than 14 days before', 'we-cancelled': 'We had to cancel the event', 'goodwill': 'Goodwill', 'duplicate': 'Paid twice by mistake', 'other': 'Other' };
  var CARDS = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express' };
  function summary(e) {
    return { id: e.id, paid: !!e.depositPaid, method: e.depositMethod || '', paidAmount: e.depositPaidAmount || 0, refunded: refunded(e), held: held(e), refunds: e.depositRefunds || [], policy: policy(e),
      card: e.stripe && e.stripe.last4 ? (CARDS[e.stripe.brand] || 'Card') + ' ending ' + e.stripe.last4 : '', livemode: !!(e.stripe && e.stripe.livemode),
      stripeUrl: e.stripe && e.stripe.paymentIntent ? '#' : '', dispute: e.depositDispute || null, reasons: REASONS };
  }

  /* ---- le statistiche del sito: inventate ma coerenti, giorno per giorno (stessa forma di admin-analytics.mjs) ---- */
  var PAGES = [['Home', 34], ['Menus', 29], ['Functions', 10], ['Book a Table', 9], ['Find Us', 7], ['Our Story', 4], ['Gift Vouchers', 3], ['Career', 2], ['Thank you', 1], ['Other', 1]];
  var REFS = [['direct', 38], ['google', 39], ['instagram', 13], ['facebook', 6], ['other', 4]];
  var HOURS = [2, 1, 1, .5, .5, 1, 2, 4, 6, 7, 8, 10, 12, 10, 7, 6, 7, 9, 11, 12, 10, 8, 5, 3];
  function split(total, weights, r) {
    var w = weights.map(function (x) { return x * (.8 + r() * .4) }), sum = w.reduce(function (a, b) { return a + b }, 0);
    return w.map(function (x) { return Math.round(total * x / sum) });
  }
  function dayStats(day, upToHour) {
    var r = rng(hash(day)), d = new Date(day + 'T12:00:00'), age = (Date.now() - d.getTime()) / 864e5;
    var season = [1.05, .85, .8, .88, .98, 1.12, 1.3, 1.36, 1.3, 1.2, 1.06, 1.18][d.getMonth()], week = [1.08, .78, .8, .86, 1, 1.24, 1.32][d.getDay()];
    var visitors = Math.round(520 * season * week * (1 - Math.min(age, 365) / 365 * .28) * (.88 + r() * .24));
    var pv = Math.round(visitors * (2.15 + r() * .45));
    var hours = split(pv, HOURS, r);
    if (upToHour != null) { var keep = hours.slice(0, upToHour + 1).reduce(function (a, b) { return a + b }, 0), f = pv ? keep / pv : 0; pv = keep; visitors = Math.round(visitors * f); hours = hours.map(function (n, h) { return h <= upToHour ? n : 0 }) }
    var pages = split(pv, PAGES.map(function (p) { return p[1] }), r), refs = split(pv, REFS.map(function (p) { return p[1] }), r), mob = Math.round(pv * (.74 + r() * .08));
    var byPage = {}, byRef = {};
    PAGES.forEach(function (p, i) { byPage[p[0]] = pages[i] }); REFS.forEach(function (p, i) { byRef[p[0]] = refs[i] });
    return { day: day, pageviews: pv, visitors: visitors, byPage: byPage, byRef: byRef, byDevice: { mobile: mob, desktop: pv - mob }, byHour: hours };
  }
  function analytics(range) {
    range = [7, 30, 90].indexOf(range) !== -1 ? range : 30;
    var today = iso(addDays(0)), hour = new Date().getHours(), days = [];
    for (var i = 60 + 30; i >= 1; i--) days.push(dayStats(shift(today, -i)));
    var t = dayStats(today, hour), extra = load().hits || 0;
    t.pageviews += extra; t.visitors += extra; t.byPage['Functions'] += extra; t.byRef.direct += extra; t.byHour[hour] += extra;
    days.push(t);
    var sum = function (from, to) { var s = days.filter(function (d) { return d.day >= from && d.day <= to }); return { pageviews: s.reduce(function (a, d) { return a + d.pageviews }, 0), visitors: s.reduce(function (a, d) { return a + d.visitors }, 0) } };
    var delta = function (c, p) { return p ? Math.round((c - p) / p * 100) : null };
    var week = sum(shift(today, -6), today), prevWeek = sum(shift(today, -13), shift(today, -7)), month = sum(shift(today, -29), today), prevMonth = sum(shift(today, -59), shift(today, -30));
    var y = dayStats(shift(today, -1)), ySoFar = y.byHour.slice(0, hour + 1).reduce(function (a, b) { return a + b }, 0);
    var from = shift(today, -(range - 1)), win = days.filter(function (d) { return d.day >= from });
    var pages = {}, ref = { direct: 0, google: 0, instagram: 0, facebook: 0, other: 0 }, dev = { mobile: 0, desktop: 0 }, hrs = HOURS.map(function () { return 0 });
    win.forEach(function (d) {
      Object.keys(d.byPage).forEach(function (p) { pages[p] = (pages[p] || 0) + d.byPage[p] });
      Object.keys(d.byRef).forEach(function (k) { ref[k] += d.byRef[k] });
      dev.mobile += d.byDevice.mobile; dev.desktop += d.byDevice.desktop; d.byHour.forEach(function (n, h) { hrs[h] += n });
    });
    var LABEL = { direct: 'Direct', google: 'Google', instagram: 'Instagram', facebook: 'Facebook', other: 'Other' };
    var refs = Object.keys(LABEL).map(function (k) { return { key: k, label: LABEL[k], n: ref[k] } });
    var top = refs.filter(function (r) { return r.key !== 'direct' }).sort(function (a, b) { return b.n - a.n })[0], all = refs.reduce(function (a, r) { return a + r.n }, 0) || 1;
    return {
      today: { pageviews: t.pageviews, visitors: t.visitors }, todayDelta: delta(t.pageviews, ySoFar),
      week: week, weekDelta: delta(week.pageviews, prevWeek.pageviews), month: month, monthDelta: delta(month.pageviews, prevMonth.pageviews),
      topSource: top && top.n ? { label: top.label, pct: Math.round(top.n / all * 100) } : null, range: range,
      series: win.map(function (d) { return { day: d.day, pageviews: d.pageviews, visitors: d.visitors } }),
      topPages: Object.keys(pages).map(function (p) { return { label: p, n: pages[p] } }).sort(function (a, b) { return b.n - a.n }).slice(0, 6),
      referrers: refs, device: dev, hours: hrs
    };
  }

  /* ---- un CV finto, in PDF: una pagina di testo semplice ---- */
  function cvPdf(a) {
    var esc = function (s) { return String(s).replace(/[^\x20-\x7E]/g, function (c) { return { '–': '-', '’': "'" }[c] || '?' }).replace(/([()\\])/g, '\\$1') };
    var rows = [[20, a.name], [12, a.role ? 'Applying for: ' + a.role : 'Spontaneous application'], [11, a.email + '  ·  ' + a.phone], [11, ''],
      [13, 'Experience'], [11, a.experience || ''], [11, (a.message || 'Hospitality, front and back of house.')], [11, ''],
      [13, 'Certificates and languages'], [11, (a.certLabel || 'Certificate') + ': ' + (a.cert || '')], [11, 'English: ' + (a.englishLevel || '') + (a.extraLangs && a.extraLangs.length ? '  ·  ' + a.extraLangs.join(', ') : '')], [11, ''],
      [13, 'Work rights'], [11, (a.visaType || '') + (a.visaExpiry ? ', until ' + a.visaExpiry : '')], [11, 'Staying in Cairns: ' + (a.lengthOfStay || '')], [11, ''],
      [9, 'Demo CV generated in the browser. The person is invented.']];
    var y = 780, ops = ['BT'];
    rows.forEach(function (r) { ops.push('/F1 ' + r[0] + ' Tf 1 0 0 1 56 ' + y + ' Tm (' + esc(r[1]) + ') Tj'); y -= r[0] + 9 });
    ops.push('ET');
    var stream = ops.join('\n'), objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
      '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'];
    var out = '%PDF-1.4\n', offs = [];
    objs.forEach(function (o, i) { offs.push(out.length); out += (i + 1) + ' 0 obj\n' + o + '\nendobj\n' });
    var x = out.length;
    out += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n' + offs.map(function (o) { return String(o).padStart(10, '0') + ' 00000 n \n' }).join('') + 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + x + '\n%%EOF\n';
    return new TextEncoder().encode(out);
  }

  var NUMBERS = { menu1Price: 2000, menu2Price: 2000, menu3Price: 2000, capacity: 5000, minGuests: 500, noticeDays: 90, maxPizza: 20, maxPasta: 20, prosecco: 500, drinksPkg: 500, drinksAf: 500, gfSupplement: 500 };
  var TEXTS = { cakeageNote: 300, noticeNote: 300, depositNote: 300, termsNote: 500, kitchenEmail: 254, menu1Name: 60, menu2Name: 60, menu3Name: 60 };

  /* ---- una funzione per ogni file in netlify/functions ---- */
  var API = {
    'event-enquiry': function (m, b, url, form) {
      if (m !== 'POST') return T('Method not allowed', 405);
      if (!form) return T('Invalid form data', 400);
      if (clean(form.get('bot-field'))) return T('ok');
      var get = function (k, max) { return clean(form.get(k), max) }, guests = parseInt(get('guests', 8), 10);
      var e = {
        id: uuid(), eventType: get('event_type', 60), eventDate: get('event_date', 10), eventTime: get('event_time', 30),
        guests: isFinite(guests) && guests > 0 ? String(Math.min(guests, 1000)) : '', dateFlexible: get('date_flexible', 40), space: get('space', 80),
        menuStyle: get('menu_style', 80), menuFocus: get('menu_focus', 80), drinks: get('drinks', 80), dietary: get('dietary', 800),
        extras: (form.getAll('extras') || []).map(function (v) { return clean(v, 80) }).filter(Boolean).slice(0, 10),
        name: get('name', 120), email: get('email', 254), phone: get('phone', 40), message: get('message', 2000), status: 'new', replies: [], createdAt: now()
      };
      if (!e.name) return T('Please tell us your name.', 400);
      if (!isEmail(e.email)) return T('That email address does not look right.', 400);
      if (!sane(e.eventDate)) return T('Please pick a date in the future.', 400);
      load().events.push(e);
      changed('enquiry', { id: e.id, name: e.name });
      /* il server vero risponde 303 verso thank-you.html?event=1: fetch lo segue e arriva un 200 */
      return T('ok');
    },
    'admin-events': function (m, b, url) {
      var s = load();
      if (m === 'GET') return J(s.events.slice().sort(function (a, c) { return (a.eventDate || '').localeCompare(c.eventDate || '') }));
      if (m === 'POST') {
        var name = clean(b.name, 120), date = clean(b.eventDate, 10), g = parseInt(b.guests, 10);
        if (!name) return T('A name is needed.', 400);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return T('Pick a date.', 400);
        var e = { id: uuid(), eventType: clean(b.eventType, 60) || 'Group booking', eventDate: date, eventTime: clean(b.eventTime, 30), guests: isFinite(g) && g > 0 ? String(Math.min(g, 1000)) : '',
          dateFlexible: clean(b.dateFlexible, 40), space: clean(b.space, 80), menuStyle: clean(b.menuStyle, 80), drinks: clean(b.drinks, 80), dietary: clean(b.dietary, 800),
          name: name, email: clean(b.email, 254), phone: clean(b.phone, 40), message: clean(b.message, 2000), status: 'new', source: 'added by staff', replies: [], createdAt: now() };
        s.events.push(e); changed('events'); return J(e, 201);
      }
      if (m === 'PATCH') {
        if (!b.id) return T('id is required', 400);
        var r = find(b.id); if (!r) return T('Not found', 404);
        if ('status' in b) { if (['new', 'quoted', 'confirmed', 'done'].indexOf(b.status) === -1) return T('Unknown status', 400); r.status = b.status }
        if ('archived' in b) r.archived = !!b.archived;
        if ('note' in b) r.staffNote = clean(b.note, 1000);
        if ('depositReceived' in b) {
          var amt = Math.max(0, Math.min(Number(b.depositReceived) || 0, 1000000));
          if (amt > 0) { r.depositPaid = true; r.depositPaidAmount = amt; r.depositPaidAt = now(); r.depositMethod = 'bank' }
          else if (r.depositMethod === 'bank') { r.depositPaid = false; delete r.depositPaidAmount; delete r.depositPaidAt; delete r.depositMethod }
        }
        if ('offerDraft' in b) { var dr = b.offerDraft && typeof b.offerDraft === 'object' ? b.offerDraft : null; r.offerDraft = dr; r.offerDraftAt = dr ? now() : null }
        if (b.inboxRead && Array.isArray(r.inbox)) r.inbox.forEach(function (x) { x.read = true });
        var ed = { eventType: 60, eventDate: 10, eventTime: 30, guests: 8, dateFlexible: 40, space: 80, menuStyle: 80, menuFocus: 80, drinks: 80, dietary: 800, name: 120, email: 254, phone: 40, message: 2000 };
        for (var k in ed) {
          if (!(k in b)) continue;
          if (k === 'eventDate' && b[k] && !/^\d{4}-\d{2}-\d{2}$/.test(String(b[k]).trim())) return T('That date does not look right.', 400);
          if (k === 'guests') { var n = parseInt(b[k], 10); r.guests = isFinite(n) && n > 0 ? String(Math.min(n, 1000)) : ''; continue }
          r[k] = clean(b[k], ed[k]);
        }
        if ('name' in b && !r.name) return T('The name cannot be empty.', 400);
        changed('events'); return J(r);
      }
      if (m === 'DELETE') { var id = url.searchParams.get('id'); if (!id) return T('id is required', 400); s.events = s.events.filter(function (x) { return x.id !== id }); changed('events'); return none() }
      return T('Method not allowed', 405);
    },
    /* il preventivo: niente mail e niente Stripe, ma la scheda cambia come col server vero */
    'admin-event-reply': function (m, b) {
      if (m !== 'POST') return T('Method not allowed', 405);
      var id = clean(b.id, 64), subject = clean(b.subject, 200), message = clean(b.message, 6000);
      if (!id) return T('id is required', 400);
      if (!subject) return T('A subject is required', 400);
      if (!message) return T('A message is required', 400);
      var e = find(id); if (!e) return T('Not found', 404);
      if (!e.email) return T('This enquiry has no email address', 400);
      var testTo = clean(b.testTo, 254);
      if (testTo && !isEmail(testTo)) return T('That test address does not look right.', 400);
      if (testTo) return J({ test: true, sent: true, to: testTo });
      var total = quoteTotal(b.quote), md = null, name = '';
      if (b.menu && Array.isArray(b.menu.sections) && b.menu.sections.length) { var pm = pdfMenu(b.menu); if (pm.sections.length) { md = pm; name = pm.menuName } }
      var files = (Array.isArray(b.files) ? b.files : []).slice(0, 4).map(function (f) { return clean(f && f.filename, 120) || 'attachment' });
      var stripe = load().settings.stripeOff ? false : true, byBank = b.depositMethod === 'bank' || !stripe, paid = !!e.depositPaid;
      var dep = (!byBank && !paid) ? Math.max(0, Math.min(Number(b.deposit) || 0, 100000)) : 0, bank = (byBank && !paid) ? Math.max(0, Math.min(Number(b.deposit) || 0, 100000)) : 0;
      e.replies = Array.isArray(e.replies) ? e.replies : [];
      e.replies.push({ at: now(), subject: subject, message: message, total: total, deposit: dep, menu: name, menuData: md, files: files, tpl: clean(b.tpl, 20), sent: true });
      if (bank > 0) e.depositRequested = bank;
      if (dep) { e.depositAmount = dep; e.depositUrl = '#'; e.depositLinkId = 'plink_demo_' + Date.now() }
      if (['new', 'quoted', 'confirmed', 'done'].indexOf(b.status) !== -1) e.status = b.status;
      else if (total > 0 && e.status === 'new') e.status = 'quoted';
      changed('events');
      return wait(500).then(function () { return J(e) });
    },
    'admin-refund': function (m, b, url) {
      if (m === 'GET') { var g = find(url.searchParams.get('id')); return g ? J(summary(g)) : T('Not found', 404) }
      if (m !== 'POST') return T('Method not allowed', 405);
      var e = find(clean(b.id, 64)); if (!e) return T('Not found', 404);
      if (!e.depositPaid) return T('No deposit has been received for this booking, so there is nothing to refund.', 400);
      var h = held(e); if (h <= 0) return T('The whole deposit has already been refunded.', 409);
      var amount = Math.round(Number(b.amount) * 100) / 100;
      if (!isFinite(amount) || amount < .01) return T('Put in the amount to refund.', 400);
      if (amount > h + .004) return T('Only $' + h.toFixed(2) + ' is still held, so that is the most that can go back.', 400);
      var key = REASONS[b.reason] ? b.reason : 'other', bank = e.depositMethod === 'bank' || !(e.stripe && e.stripe.paymentIntent);
      var row = { id: (bank ? 'bank-' : 're_demo_') + Date.now(), amount: amount, at: now(), status: 'succeeded', method: bank ? 'bank' : 'card', reason: REASONS[key] + (clean(b.note, 200) ? ' – ' + clean(b.note, 200) : ''), by: 'staff' };
      if (b.emailCustomer) row.emailed = true;
      e.depositRefunds = (e.depositRefunds || []).concat([row]); e.depositRefundedAmount = refunded(e);
      if (b.cancelBooking) { e.archived = true; e.cancelledAt = now() }
      changed('events');
      return J(Object.assign(summary(e), { done: row, emailed: !!b.emailCustomer, cancelled: !!b.cancelBooking, enquiry: e }));
    },
    'admin-kitchen-sheet': function (m, b) {
      var e = find(clean(b.id, 64)); if (!e) return T('Not found', 404);
      e.kitchenSentAt = now(); e.kitchenSentTo = clean(load().settings.kitchenEmail, 254) || 'kitchen@example.com';
      changed('events'); return wait(400).then(function () { return J(e) });
    },
    /* il PDF del menu: lo scrive il codice vero del cliente (lib/pdf.mjs), qui nel browser */
    'admin-menu-pdf': function (m, b) {
      if (m !== 'POST') return T('Method not allowed', 405);
      var menu = pdfMenu(b);
      if (!menu.sections.length) return T('Add at least one course with a dish in it.', 400);
      if (!LIB || !LIB.buildMenuPdf) return T('The PDF writer is not in this demo.', 501);
      return pdf(LIB.buildMenuPdf(Object.assign({}, menu, { eventLine: eventLine(b.id ? find(b.id) : null) })), 'vitalias-menu.pdf');
    },
    'admin-menu': function (m, b, url) {
      var id = url.searchParams.get('id');
      if (MENU_IDS.indexOf(id) === -1) return T('Unknown menu', 400);
      if (m === 'GET') return menuOf(id).then(J);
      if (m !== 'PUT' && m !== 'POST') return T('Method not allowed', 405);
      b.id = id;
      return menuOf(id).then(function (existing) {
        var menu = LIB && LIB.normaliseMenu ? LIB.normaliseMenu(b, existing) : Object.assign({}, b, { updatedAt: now() });
        if (!menu) return T('That menu has no sections with a name and no dishes, nothing to save.', 400);
        /* gli orari stampati sulle lavagne non passano dal modulo: nella demo restano */
        if (b.hours && !menu.hours) menu.hours = b.hours;
        load().menus[id] = menu; changed('menu'); return J(menu);
      });
    },
    'menu': function (m, b, url) { var id = url.searchParams.get('id'); return MENU_IDS.indexOf(id) === -1 ? T('Unknown menu', 400) : menuOf(id).then(J) },
    'print-font': function () {
      /* la lavagna usa il carattere del cliente (George, con licenza): nella demo lo sostituisce Playfair */
      return realFetch(BASE + 'assets/fonts/print/Playfair-Regular.ttf').then(function (r) { return r.ok ? new Response(r.body, { headers: { 'Content-Type': 'font/ttf' } }) : T('Not found', 404) });
    },
    'admin-settings': function (m, b) {
      var s = load();
      if (m === 'GET') return J(Object.assign({}, s.settings, { stripeReady: !s.settings.stripeOff, stripeMode: 'live', webhookReady: true }));
      if (m !== 'PUT' && m !== 'POST') return T('Method not allowed', 405);
      var next = Object.assign({}, s.settings, { id: 'functions', updatedAt: now() });
      for (var k in NUMBERS) {
        if (!(k in b)) continue;
        var raw = String(b[k] == null ? '' : b[k]).trim();
        if (raw === '') { next[k] = ''; continue }
        var n = Number(raw); if (!isFinite(n) || n < 0 || n > NUMBERS[k]) return T(k + ' looks wrong.', 400);
        next[k] = Math.round(n);
      }
      for (var t in TEXTS) if (t in b) next[t] = clean(b[t], TEXTS[t]);
      if ('bankName' in b || 'bankBsb' in b || 'bankAccount' in b) {
        var nm = clean(b.bankName, 80), bsb = String(b.bankBsb || '').replace(/[\s-]/g, ''), acct = String(b.bankAccount || '').replace(/[\s-]/g, '');
        if (bsb && !/^\d{6}$/.test(bsb)) return T('A BSB is six digits, like 123-456.', 400);
        if (acct && !/^\d{4,12}$/.test(acct)) return T('An account number is digits only, between 4 and 12.', 400);
        if ((bsb || acct) && !(bsb && acct && nm)) return T('Fill in the account name, the BSB and the account number together, or leave all three empty.', 400);
        var bb = bsb ? bsb.slice(0, 3) + '-' + bsb.slice(3) : '';
        next.bankName = nm; next.bankBsb = bb; next.bankAccount = acct; next.bankDetails = bb ? 'Account name: ' + nm + '\nBSB: ' + bb + '\nAccount number: ' + acct : '';
      }
      ['menu1Courses', 'menu2Courses', 'menu3Courses', 'menu1Lunch', 'menu2Lunch', 'menu3Lunch'].forEach(function (k) {
        if (!(k in b)) return;
        var raw = b[k] && typeof b[k] === 'object' ? b[k] : {}, out = {};
        COURSES.forEach(function (c) { var l = String(raw[c] == null ? '' : raw[c]).split('\n').map(function (x) { return clean(x, 160) }).filter(Boolean).slice(0, 20); if (l.length) out[c] = l.join('\n') });
        next[k] = out;
      });
      s.settings = next; changed('settings'); return J(next);
    },
    'settings': function () {
      var o = Object.assign({}, load().settings);
      ['id', 'updatedAt', 'bankDetails', 'bankName', 'bankBsb', 'bankAccount', 'kitchenEmail', 'stripeOff'].forEach(function (k) { delete o[k] });
      return J(o);
    },
    'admin-payments': function (m, b, url) {
      var check = url.searchParams.get('check') === '1';
      return J({ configured: true, mode: 'live', webhookSecret: true, webhookUrl: 'https://vitalias.com.au/.netlify/functions/stripe-webhook',
        events: ['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'refund.created', 'refund.updated', 'refund.failed', 'charge.refunded'],
        account: check ? { id: 'acct_demo', country: 'AU', currency: 'aud', name: 'Vitalia\'s Italian Restaurant', chargesEnabled: true, payoutsEnabled: true } : null,
        webhook: check ? { found: true, url: 'https://vitalias.com.au/.netlify/functions/stripe-webhook', status: 'enabled', missing: [] } : null, error: '' });
    },
    'admin-analytics': function (m, b, url) { return J(analytics(Number(url.searchParams.get('range')))) },
    'track': function () { track(); return none() },
    'admin-applications': function (m, b, url) {
      var s = load(), id = clean(url.searchParams.get('id'), 80), cv = clean(url.searchParams.get('cv'), 80);
      var a = s.applications.filter(function (x) { return x.id === (cv || id) })[0];
      if (m === 'GET' && cv) return a ? pdf(cvPdf(a), a.cv.name) : J({ error: 'No CV stored for this application' }, 404);
      if (m === 'GET') return J(s.applications.slice().sort(function (x, y) { return String(y.receivedAt).localeCompare(String(x.receivedAt)) }));
      if (m === 'PATCH') {
        if (!id) return J({ error: 'Missing id' }, 400);
        if (!a) return J({ error: 'Not found' }, 404);
        if (b.score !== undefined) { var n = Math.round(Number(b.score)); if (!isFinite(n) || n < -1 || n > 3) return J({ error: 'Score must be -1 to 3' }, 400); a.score = n }
        if (typeof b.notes === 'string') a.notes = clean(b.notes, 2000);
        if (Array.isArray(b.unavailable)) {
          var D = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], SH = ['m', 'a', 'e'], ok = [];
          b.unavailable.slice(0, 21).forEach(function (raw) { var c = clean(raw, 8), p = c.split('-'); if (D.indexOf(p[0]) !== -1 && SH.indexOf(p[1]) !== -1 && ok.indexOf(c) === -1) ok.push(c) });
          ok.sort(function (x, y) { var p = x.split('-'), q = y.split('-'); return D.indexOf(p[0]) - D.indexOf(q[0]) || SH.indexOf(p[1]) - SH.indexOf(q[1]) });
          a.unavailable = ok;
        }
        if (b.trial !== undefined) {
          if (b.trial === null) delete a.trial;
          else { var at = clean(b.trial.at, 40); if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(at)) return J({ error: 'Trial time must be YYYY-MM-DDTHH:MM' }, 400); a.trial = { at: at, setAt: now() } }
        }
        a.updatedAt = now(); changed('apps'); return J(a);
      }
      if (m === 'DELETE') { if (!id) return J({ error: 'Missing id' }, 400); s.applications = s.applications.filter(function (x) { return x.id !== id }); changed('apps'); return J({ ok: true }) }
      return J({ error: 'Method not allowed' }, 405);
    },
    'admin-positions': function (m, b, url) {
      var s = load();
      if (m === 'GET') return J(s.positions.slice().sort(function (x, y) { return (y.createdAt || '').localeCompare(x.createdAt || '') }));
      var lim = { role: 60, type: 40, hours: 40, level: 40, start: 40, startDate: 10, note: 600 };
      if (m === 'POST') {
        var role = clean(b.role, 60); if (!role) return T('Role is required', 400);
        var p = { id: uuid(), active: true, createdAt: now() };
        for (var k in lim) p[k] = clean(b[k], lim[k]);
        s.positions.push(p); changed('positions'); return J(p, 201);
      }
      if (m === 'PATCH') {
        if (!b.id) return T('id is required', 400);
        var q = s.positions.filter(function (x) { return x.id === b.id })[0]; if (!q) return T('Not found', 404);
        for (var j in lim) if (j in b) q[j] = clean(b[j], lim[j]);
        if ('active' in b) q.active = !!b.active;
        if ('role' in b && !q.role) return T('Role is required', 400);
        changed('positions'); return J(q);
      }
      if (m === 'DELETE') { var id = url.searchParams.get('id'); if (!id) return T('id is required', 400); s.positions = s.positions.filter(function (x) { return x.id !== id }); changed('positions'); return none() }
      return T('Method not allowed', 405);
    },
    'positions': function () { return J(load().positions.filter(function (p) { return p.active }).sort(function (x, y) { return (y.createdAt || '').localeCompare(x.createdAt || '') })) },
    'reviews': function () { return J({ id: 'google', rating: 4.5, count: 1882, updatedAt: stamp(shift(iso(addDays(0)), -12), 13, 0) }) },
    'calendar': function () { return new Response('BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Mother Machine//Demo//EN\r\nEND:VCALENDAR\r\n', { headers: { 'Content-Type': 'text/calendar' } }) },
    'admin-push-subscribe': function () { return J({ ok: true, devices: 0 }) },
    'admin-push-test': function () { return J({ ok: true, sent: 0 }) }
  };

  function parseBody(init) {
    var raw = init && init.body, out = { json: {}, form: null };
    if (!raw) return out;
    if (typeof raw === 'string') { try { out.json = JSON.parse(raw) || {} } catch (e) { out.form = new URLSearchParams(raw) } }
    else if (raw instanceof URLSearchParams || (window.FormData && raw instanceof FormData)) out.form = raw;
    return out;
  }

  window.fetch = function (input, init) {
    var u = typeof input === 'string' ? input : (input && input.url) || String(input || '');
    var m = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    var url = new URL(u, location.href);
    var hit = /\/\.netlify\/functions\/([a-z-]+)/.exec(url.pathname);
    if (hit) {
      var fn = API[hit[1]], body = parseBody(init);
      return wait(120 + Math.random() * 160).then(function () { return fn ? fn(m, body.json, url, body.form) : J({ ok: true }) });
    }
    return realFetch(input, init);
  };
})();
