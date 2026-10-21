/* =====================================================================
   Functions & Events: the three-step enquiry, the set menu cards beside it
   and, on a phone, the bottom sheet. Loaded on functions.html only, after
   js/site.js, which still owns the shared pieces: the form guard and its
   messages, the evMenuWarn rules, the tailor-made follow-up question, the
   backoffice prices (data-setting) and the dishes (it fires 'fn:dishes').
   The form posts exactly the fields it always did, to the same function.
   ===================================================================== */
(function () {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqSheet = matchMedia('(max-width:900px)');
  var KEY = 'vFnEnquiry';
  var TIMES = {
    lunch: ['11:30am', '12:00pm', '12:30pm', '1:00pm', '1:30pm'],
    dinner: ['5:00pm', '5:30pm', '6:00pm', '6:30pm', '7:00pm']
  };
  var NOTES = { lunch: 'Lunch arrivals between 11:30am and 1:30pm', dinner: 'Dinner arrivals between 5:00 and 7:00pm' };

  var dishes = window.VitaliaFn || null;
  var service = 'dinner';
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Set menu cards ---------- */
  function paintCards() {
    if (!dishes) return;
    document.querySelectorAll('[data-menu-card]').forEach(function (card) {
      var n = card.getAttribute('data-i');
      var html = dishes.html[service + n];
      var dinnerOnly = service === 'lunch' && !html;
      if (dinnerOnly) html = dishes.html['dinner' + n];
      card.classList.toggle('is-dinner-only', dinnerOnly);
      var flag = card.querySelector('.fe-flag-dinner');
      if (flag) flag.hidden = !dinnerOnly;
      var ul = card.querySelector('[data-courses]');
      if (ul) ul.innerHTML = html || '';
    });
  }
  document.addEventListener('fn:dishes', function (e) {
    dishes = e.detail;
    paintCards();
    buildMenuOpts();
  });

  function cardFor(value) {
    var hit = null;
    document.querySelectorAll('.fe-menu[data-menu]').forEach(function (c) { if (c.getAttribute('data-menu') === value) hit = c; });
    return hit;
  }
  function shortName(value) { return String(value).replace(/^Set Menu \d+ · /, ''); }
  function priceFor(value) {
    var c = cardFor(value);
    if (!c || c.classList.contains('fe-menu-custom')) return '';
    var p = c.querySelector('.fe-price strong');
    return p ? p.textContent.trim() : '';
  }

  /* ---------- Init, once site.js has wired the shared form pieces ---------- */
  function init() {
    var form = $('eventForm');
    if (!form) return;
    var card = $('feCard');
    var slot = $('feSlot');
    var select = $('ev_menu');
    var timeSel = $('ev_time');
    var steps = Array.prototype.slice.call(form.querySelectorAll('.fe-step'));
    var cur = 1;
    var sheetOpen = false;
    var opener = null;
    var sent = false;

    form.classList.add('js-steps');
    paintCards();

    /* ----- Lunch or dinner: one choice shared by the menus and the form ----- */
    function setService(s, fromTime) {
      service = s;
      document.querySelectorAll('.fe-seg [data-service]').forEach(function (b) {
        var on = b.getAttribute('data-service') === s;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      var note = $('fnServiceNote');
      if (note) note.textContent = NOTES[s];
      paintCards();
      buildMenuOpts();
      // A set-menu time that belongs to the other service no longer fits.
      var other = TIMES[s === 'lunch' ? 'dinner' : 'lunch'];
      if (other.indexOf(timeSel.value) !== -1 && !fromTime) setTime('');
      renderTimes();
    }
    document.querySelectorAll('.fe-seg [data-service]').forEach(function (b) {
      b.addEventListener('click', function () { setService(b.getAttribute('data-service'), false); save(); });
    });

    /* ----- Arrival time: chips for the set-menu window, the full list on request ----- */
    var timesBox = $('feTimes');
    var other = $('feTimeOther');
    var otherOpen = false;
    function setTime(v) {
      timeSel.value = v;
      timeSel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    function renderTimes() {
      var list = TIMES[service];
      var v = timeSel.value;
      if (v && list.indexOf(v) === -1) otherOpen = true;
      timesBox.innerHTML = list.map(function (t) {
        return '<button type="button" class="fe-chip" data-time="' + t + '" aria-pressed="' + (v === t) + '">' + t.replace(':00', '') + '</button>';
      }).join('') + '<button type="button" class="fe-chip fe-chip-other" data-time="other" aria-pressed="' + otherOpen + '" aria-expanded="' + otherOpen + '" aria-controls="feTimeOther">Other time</button>';
      timesBox.hidden = false;
      other.hidden = !otherOpen;
    }
    timesBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-time]');
      if (!b) return;
      var t = b.getAttribute('data-time');
      if (t === 'other') {
        otherOpen = !otherOpen;
        if (!otherOpen && TIMES[service].indexOf(timeSel.value) === -1) setTime('');
        renderTimes();
        if (otherOpen) timeSel.focus();
      } else {
        otherOpen = false;
        setTime(timeSel.value === t ? '' : t);
        renderTimes();
        var again = timesBox.querySelector('[data-time="' + t + '"]');
        if (again) again.focus();
      }
      save();
    });
    timeSel.addEventListener('change', function () {
      // Picking a lunch time from the full list moves the whole page to lunch.
      var v = timeSel.value;
      var s = TIMES.lunch.indexOf(v) !== -1 ? 'lunch' : TIMES.dinner.indexOf(v) !== -1 ? 'dinner' : null;
      if (s && s !== service) setService(s, true);
    });

    /* ----- Guests stepper ----- */
    var guests = $('ev_guests');
    document.querySelectorAll('[data-guests]').forEach(function (b) {
      b.addEventListener('click', function () {
        var d = Number(b.getAttribute('data-guests'));
        var v = Number(guests.value) || 0;
        var next = v ? v + d : 10;
        guests.value = Math.max(2, Math.min(300, next));
        guests.dispatchEvent(new Event('input', { bubbles: true }));
        guests.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });

    /* ----- Menu choice inside step 2, kept in step with the select and the cards ----- */
    var opts = $('feMenuOpts');
    function buildMenuOptsInner() {
      if (!opts || !select) return;
      opts.innerHTML = Array.prototype.filter.call(select.options, function (o) { return o.value; }).map(function (o) {
        var v = o.value;
        var meta = priceFor(v);
        meta = meta ? meta + ' pp' : (/tailor/i.test(v) ? 'priced with you' : 'we advise');
        var c = cardFor(v);
        if (c && c.classList.contains('is-dinner-only')) meta += ' · dinner only';
        return '<button type="button" class="fe-opt" data-value="' + v.replace(/"/g, '&quot;') + '" aria-pressed="' + (select.value === v) + '">' +
          '<span>' + shortName(o.textContent) + '</span><em>' + meta + '</em></button>';
      }).join('');
      opts.hidden = false;
      $('feMenuSelect').hidden = true;
    }
    buildMenuOpts = buildMenuOptsInner;
    opts.addEventListener('click', function (e) {
      var b = e.target.closest('.fe-opt');
      if (!b) return;
      chooseMenu(b.getAttribute('data-value'));
      var again = opts.querySelector('.fe-opt[aria-pressed="true"]');
      if (again) again.focus();
    });
    function chooseMenu(value) {
      var match = Array.prototype.filter.call(select.options, function (o) { return o.value === value || o.textContent === value; })[0];
      if (!match) return false;
      select.value = match.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    function syncPicked() {
      document.querySelectorAll('.fe-menu[data-menu]').forEach(function (c) {
        var on = c.getAttribute('data-menu') === select.value;
        c.classList.toggle('is-picked', on);
        var b = c.querySelector('[data-pick]');
        if (b) {
          if (!b.dataset.label) b.dataset.label = b.textContent;
          b.textContent = on ? 'In your enquiry' : b.dataset.label;
          b.setAttribute('aria-pressed', String(on));
        }
      });
      if (opts) opts.querySelectorAll('.fe-opt').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === select.value)); });
    }
    select.addEventListener('change', syncPicked);

    /* ----- Steps ----- */
    var countEl = $('feCount'), fill = $('feBarFill'), mstep = $('feMbarStep');
    function go(n, o) {
      o = o || {};
      cur = Math.max(1, Math.min(3, n));
      steps.forEach(function (s) { s.classList.toggle('is-on', Number(s.getAttribute('data-step')) === cur); });
      countEl.textContent = cur + ' / 3';
      fill.style.width = (cur / 3 * 100) + '%';
      if (mstep) mstep.textContent = 'Step ' + cur + ' of 3';
      renderSummary();
      if (o.focus !== false) {
        var t = steps[cur - 1].querySelector('.fe-step-title');
        try { t.focus({ preventScroll: true }); } catch (err) { t.focus(); }
        keepCardInView();
      }
      save();
    }
    function keepCardInView() {
      if (sheetOpen) { card.scrollTop = 0; return; }
      var r = card.getBoundingClientRect();
      var navH = (document.querySelector('.site-nav') || { offsetHeight: 70 }).offsetHeight;
      if (r.top < navH || r.top > window.innerHeight * 0.6) {
        window.scrollTo({ top: window.scrollY + r.top - navH - 12, behavior: reduce ? 'auto' : 'smooth' });
      }
    }

    function invalidIn(scope) {
      var seen = {}, out = [];
      Array.prototype.forEach.call(scope.querySelectorAll('input,select,textarea'), function (el) {
        if (!el.willValidate || el.checkValidity()) return;
        if (el.name && seen[el.name]) return;
        if (el.name) seen[el.name] = true;
        out.push(el);
      });
      return out;
    }
    function validateStep(n) {
      var bad = invalidIn(steps[n - 1]);
      if (!bad.length) return true;
      bad.forEach(function (el) { if (window.VitaliaForm) window.VitaliaForm.mark(el); });
      var first = bad[0];
      try { first.focus({ preventScroll: false }); } catch (err) { first.focus(); }
      return false;
    }
    form.addEventListener('click', function (e) {
      if (e.target.closest('[data-next]')) { if (validateStep(cur)) go(cur + 1); }
      else if (e.target.closest('[data-back]')) go(cur - 1);
    });
    // Enter in a step-1 or step-2 field moves on instead of sending a half-filled form.
    form.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || cur === 3 || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      if (validateStep(cur)) go(cur + 1);
    });

    /* ----- Summary chips on steps 2 and 3: what we know so far, each one editable ----- */
    function fmtDate(v) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
      if (!m) return '';
      var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
    }
    function eventType() {
      var r = form.querySelector('input[name="event_type"]:checked');
      return r ? r.value : '';
    }
    function renderSummary() {
      var parts = [
        { f: 'event_type', t: eventType(), empty: 'Add the occasion' },
        { f: 'ev_date', t: fmtDate($('ev_date').value), empty: 'Add a date' },
        { f: 'ev_guests', t: guests.value ? guests.value + ' guests' : '', empty: 'Add guests' },
        { f: 'ev_time', t: (service === 'lunch' ? 'Lunch' : 'Dinner') + (timeSel.value ? ', ' + timeSel.value : ''), empty: '' }
      ];
      var html = parts.map(function (p) {
        return '<button type="button" class="fe-sum-chip' + (p.t ? '' : ' is-empty') + '" data-edit="' + p.f + '">' + (p.t || p.empty) + '<span class="fe-vh">, change</span></button>';
      }).join('');
      form.querySelectorAll('[data-sum]').forEach(function (s) { s.innerHTML = html; });
    }
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-edit]');
      if (!b) return;
      go(1, { focus: false });
      var f = b.getAttribute('data-edit');
      var el = f === 'event_type' ? (form.querySelector('input[name="event_type"]:checked') || form.querySelector('input[name="event_type"]')) : $(f);
      if (f === 'ev_time') el = timesBox.querySelector('[aria-pressed="true"]') || timesBox.querySelector('button');
      if (el) el.focus();
      keepCardInView();
    });

    /* ----- Keep what they typed if the page reloads ----- */
    function save() {
      if (sent) return;
      var data = { step: cur, service: service, other: otherOpen, f: [] };
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.name === 'bot-field' || el.type === 'submit' || el.type === 'button') return;
        if ((el.type === 'radio' || el.type === 'checkbox')) { if (el.checked) data.f.push([el.name, el.value]); }
        else if (el.value) data.f.push([el.name, el.value]);
      });
      try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch (err) { /* private mode */ }
    }
    function restore() {
      var data = null;
      try { data = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (err) { data = null; }
      if (!data || !data.f) return false;
      data.f.forEach(function (pair) {
        var els = form.elements[pair[0]];
        if (!els) return;
        var list = (els.length !== undefined && !els.tagName) ? Array.prototype.slice.call(els) : [els];
        list.forEach(function (el) {
          if (el.type === 'radio' || el.type === 'checkbox') { if (el.value === pair[1]) el.checked = true; }
          else el.value = pair[1];
        });
      });
      otherOpen = !!data.other;
      if (data.service) setService(data.service, true);
      ['ev_menu', 'ev_time', 'ev_guests'].forEach(function (id) { $(id).dispatchEvent(new Event('change', { bubbles: true })); });
      if (data.f.some(function (p) { return p[0] === 'space' || p[0] === 'date_flexible'; })) $('feMore').open = true;
      go(data.step || 1, { focus: false });
      return true;
    }
    form.addEventListener('input', save);
    form.addEventListener('change', function () { save(); renderSummary(); });

    /* ----- Toast: a small "added" note so a click never goes unanswered ----- */
    var toast = $('feToast'), toastT = null;
    function say(msg) {
      toast.textContent = msg;
      toast.classList.add('is-on');
      clearTimeout(toastT);
      toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 3200);
      card.classList.remove('is-pulse');
      void card.offsetWidth;
      if (!reduce) card.classList.add('is-pulse');
    }

    /* ----- Pick a menu from a card ----- */
    document.querySelectorAll('.fe-menu [data-pick]').forEach(function (b) {
      b.addEventListener('click', function () {
        var c = b.closest('.fe-menu');
        var value = c.getAttribute('data-menu');
        if (!chooseMenu(value)) return;
        var price = priceFor(value);
        if (sent) resetSent();
        opener = b;
        if (mqSheet.matches) openSheet(b, true);
        go(2);
        say(shortName(value) + (price ? ' · ' + price + ' pp' : '') + ' added');
      });
    });
    var wed = document.querySelector('[data-wedding]');
    if (wed) wed.addEventListener('click', function () {
      var r = form.querySelector('input[name="event_type"][value="Wedding"]');
      if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
      chooseMenu('Tailor-made menu');
      if (sent) resetSent();
      opener = wed;
      if (mqSheet.matches) openSheet(wed, true);
      else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      go(1, { focus: false });
      var d = $('ev_date');
      try { d.focus({ preventScroll: true }); } catch (err) { d.focus(); }
      say('Wedding · tailor-made menu added');
    });

    /* ----- Bottom sheet on a phone: the same card, lifted over the page ----- */
    var bar = $('feMbar'), barBtn = $('feMbarBtn'), scrim = $('feScrim'), closeBtn = $('feClose');
    function openSheet(from, skipFocus) {
      if (sheetOpen) return;
      opener = from || opener;
      sheetOpen = true;
      slot.style.minHeight = slot.offsetHeight + 'px';
      card.classList.add('is-sheet');
      card.setAttribute('role', 'dialog');
      card.setAttribute('aria-modal', 'true');
      closeBtn.hidden = false;
      scrim.hidden = false;
      document.body.classList.add('fe-sheet-open');
      barBtn.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function () { card.classList.add('is-up'); scrim.classList.add('is-on'); });
      updateBar();
      if (!skipFocus) {
        var t = steps[cur - 1].querySelector('.fe-step-title');
        try { t.focus({ preventScroll: true }); } catch (err) { t.focus(); }
      }
    }
    function closeSheet() {
      if (!sheetOpen) return;
      sheetOpen = false;
      card.classList.remove('is-up', 'is-sheet');
      card.removeAttribute('role');
      card.removeAttribute('aria-modal');
      closeBtn.hidden = true;
      scrim.classList.remove('is-on');
      scrim.hidden = true;
      document.body.classList.remove('fe-sheet-open');
      slot.style.minHeight = '';
      barBtn.setAttribute('aria-expanded', 'false');
      updateBar();
      if (opener && document.contains(opener)) { try { opener.focus({ preventScroll: true }); } catch (err) { opener.focus(); } }
    }
    barBtn.addEventListener('click', function () { openSheet(barBtn); });
    closeBtn.addEventListener('click', closeSheet);
    scrim.addEventListener('click', closeSheet);
    document.addEventListener('keydown', function (e) {
      if (!sheetOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(card.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"])'), function (el) {
        return !el.disabled && el.offsetParent !== null && el.tabIndex !== -1;
      });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    var onMq = function () { if (!mqSheet.matches) closeSheet(); updateBar(); };
    if (mqSheet.addEventListener) mqSheet.addEventListener('change', onMq); else mqSheet.addListener(onMq);

    // The bar steps aside while the inline form or the footer is on screen.
    var slotSeen = true, endSeen = false;
    function updateBar() {
      var show = mqSheet.matches && !sheetOpen && !slotSeen && !endSeen && !sent;
      if (show) { bar.hidden = false; requestAnimationFrame(function () { bar.classList.add('is-on'); }); }
      else { bar.classList.remove('is-on'); if (!mqSheet.matches || sent) bar.hidden = true; }
      document.body.classList.toggle('fe-has-bar', show);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { slotSeen = es[0].isIntersecting; updateBar(); }).observe(slot);
      var fin = document.querySelector('.finale');
      if (fin) new IntersectionObserver(function (es) { endSeen = es[0].isIntersecting; updateBar(); }).observe(fin);
    } else { slotSeen = false; }

    /* ----- Mobile carousel dots ----- */
    var rail = $('feCards'), dots = $('feDots');
    if (rail && dots) {
      var dotEls = dots.querySelectorAll('i');
      var onRail = function () {
        var cards = rail.querySelectorAll('.fe-menu');
        var mid = rail.scrollLeft + rail.clientWidth / 2, best = 0, bestD = Infinity;
        cards.forEach(function (c, i) { var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
        dotEls.forEach(function (d, i) { d.classList.toggle('is-on', i === best); });
      };
      rail.addEventListener('scroll', onRail, { passive: true });
      onRail();
      // Start the phone carousel on the most booked menu, with a peek either side.
      if (mqSheet.matches) {
        var star = rail.querySelector('.is-star');
        if (star) rail.scrollLeft = star.offsetLeft - (rail.clientWidth - star.offsetWidth) / 2;
      }
    }

    /* ----- Sending: validate every step, then post in place ----- */
    // Capture phase, so it runs before site.js's guard: if a field on another
    // step is missing, show that step first, then the guard marks it as usual.
    document.addEventListener('submit', function (e) {
      if (e.target !== form) return;
      var bad = invalidIn(form);
      if (!bad.length) return;
      var s = bad[0].closest('.fe-step');
      var n = s ? Number(s.getAttribute('data-step')) : cur;
      if (n !== cur) go(n, { focus: false });
    }, true);

    var err = $('feErr');
    form.addEventListener('submit', function (e) {
      if (e.defaultPrevented) return;   // the guard found a problem, or it is a double click
      if (invalidIn(form).length) { e.preventDefault(); return; }   // never post a half-filled form
      if (!window.fetch || !window.URLSearchParams || !window.FormData) return;   // let the browser post it
      e.preventDefault();
      err.hidden = true;
      var btn = form.querySelector('.form-submit .btn');
      // The same urlencoded body a plain form post sends, field for field.
      var body = new URLSearchParams(new FormData(form));
      fetch(form.action, { method: 'POST', body: body, credentials: 'same-origin' })
        .then(function (r) {
          if (r.ok) return success();
          return r.text().then(function (t) { fail(t && t.length < 200 ? t : null); });
        })
        .catch(function () { fail(null); });
      function fail(msg) {
        if (btn) { btn.classList.remove('is-busy'); delete btn.dataset.sent; }
        err.textContent = (msg || 'That did not go through.') + ' Please try again, or call us on 07 4000 0865.';
        err.hidden = false;
      }
    });

    function success() {
      sent = true;
      var first = ($('ev_name').value || '').trim().split(/\s+/)[0];
      var type = eventType().toLowerCase();
      var g = guests.value, d = fmtDate($('ev_date').value);
      var what = (type ? 'your ' + type : 'your enquiry') + (g ? ' for ' + g : '') + (d ? ' on ' + d : '');
      var done = $('feDone');
      done.innerHTML = '<p class="fe-done-big">Grazie' + (first ? ', ' + escapeHtml(first) : '') + '.</p>' +
        '<p>We have ' + escapeHtml(what) + '. One of the family will come back to you with a menu and a price, usually within one working day. A copy is on its way to your inbox.</p>' +
        '<div class="fe-done-actions"><a class="btn btn-primary" href="#">See the menus</a><a class="btn btn-ghost" href="#">07 4000 0865</a></div>';
      form.hidden = true;
      $('feCount').textContent = 'Sent';
      fill.style.width = '100%';
      done.hidden = false;
      try { done.focus({ preventScroll: true }); } catch (e2) { done.focus(); }
      keepCardInView();
      try { sessionStorage.removeItem(KEY); } catch (e3) {}
      updateBar();
      // The owner's dashboard counts enquiries as visits to the thank-you page.
      // The visitor stays here now, so tell it the same thing a redirect would have.
      try {
        var payload = JSON.stringify({ page: '/thank-you.html', ref: location.href, mobile: matchMedia('(max-width:700px)').matches });
        if (navigator.sendBeacon) navigator.sendBeacon('/.netlify/functions/track', new Blob([payload], { type: 'application/json' }));
      } catch (e4) {}
    }
    function resetSent() {
      // A second enquiry after the first one: start from a clean form.
      sent = false;
      form.reset();
      form.hidden = false;
      $('feDone').hidden = true;
      var btn = form.querySelector('.form-submit .btn');
      if (btn) { btn.classList.remove('is-busy'); delete btn.dataset.sent; }
      setService(service, false);
    }
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
    }

    /* ----- Start ----- */
    setService('dinner', false);
    buildMenuOpts();
    if (!restore()) go(1, { focus: false });
    syncPicked();
    updateBar();
  }

  var buildMenuOpts = function () {};

  // A deferred script runs before DOMContentLoaded, and site.js wires the shared
  // form guard on that event: wait for it, so the guard's submit check runs first.
  if (document.readyState === 'complete') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
