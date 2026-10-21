/* Vitalia's Italian Restaurant - shared behaviour. Lightweight, no deps. */
(function () {
  'use strict';
  var fine = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cachedPositions = [];

  /* The page behind the overlay is pinned, not just hidden, or iOS keeps
     scrolling it under the menu. Pinning loses the scroll position, so it is
     remembered here and restored on the way out. */
  var menuY = 0;
  function toggleMenu() {
    if (document.body.classList.contains('menu-open')) { closeMenu(); return; }
    menuY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = (-menuY) + 'px';
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    if (!document.body.classList.contains('menu-open')) return;
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, menuY);
  }
  window.toggleMenu = toggleMenu; window.closeMenu = closeMenu;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  function setYear() { document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); }); }

  function markActive() {
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a[href], .overlay-nav a[href]').forEach(function (a) {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  function initNavScroll() {
    var nav = document.querySelector('nav.site-nav');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 12); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ---- Rotating top banner (fade, single element) ---- */
  function initResvBar() {
    var bar = document.getElementById('resvBar');
    var msg = document.getElementById('resvMsg');
    if (!bar || !msg) return;
    try { if (sessionStorage.getItem('resvClosed') === '1') { bar.hidden = true; return; } } catch (e) {}
    var close = bar.querySelector('.resv-close');
    if (close) close.addEventListener('click', function () { bar.hidden = true; try { sessionStorage.setItem('resvClosed', '1'); } catch (e) {} });
    var slides = [
      { cls: '', html: '<span><strong>Book your table at The Pier</strong> <span class="sep">&middot; Sea Views, 7 nights</span></span> <a href="' + bar.dataset.reserve + '" target="_blank" rel="noopener">Reserve</a>' },
      { cls: 'slide-gold', html: '<span><strong>Order takeaway</strong> <span class="sep">&middot; Ready to Collect</span></span> <a href="' + bar.dataset.order + '" target="_blank" rel="noopener">Order</a>' },
      { cls: 'slide-red', html: '<span><strong>Pizza catering</strong> <span class="sep">&middot; our Pizza Truck</span></span> <a href="' + bar.dataset.truck + '" target="_blank" rel="noopener">Explore</a>' },
      { cls: 'slide-gold', html: '<span><strong>Gift Vouchers</strong> <span class="sep">&middot; Give a night at Vitalia\'s</span></span> <a href="' + bar.dataset.voucher + '">Gift one</a>' }
    ];
    var i = 0;
    function render(n) { msg.className = 'resv-msg ' + slides[n].cls; msg.innerHTML = slides[n].html; }
    render(0);
    if (reduce) return;
    setInterval(function () {
      msg.classList.add('fade');
      setTimeout(function () { i = (i + 1) % slides.length; render(i); }, 400);
    }, 4600);
  }

  /* ---- Magnetic pull ---- */
  function magnetic(el, s) {
    if (!fine) return;
    el.style.transition = 'transform .35s cubic-bezier(.22,1,.36,1)'; el.style.willChange = 'transform';
    var r = null;
    el.addEventListener('mouseenter', function () { r = el.getBoundingClientRect(); });
    el.addEventListener('mousemove', function (e) {
      if (!r) r = el.getBoundingClientRect();
      el.style.transform = 'translate(' + (e.clientX - (r.left + r.width / 2)) * s + 'px,' + (e.clientY - (r.top + r.height / 2)) * s + 'px)';
    });
    el.addEventListener('mouseleave', function () { el.style.transform = 'translate(0,0)'; r = null; });
  }
  function initMagnetic() {
    var logo = document.querySelector('.nav-logo'); if (logo) magnetic(logo, 0.3);
    var mascotte = document.querySelector('.hero-mascotte'); if (mascotte) magnetic(mascotte, 0.22);
    var founder = document.querySelector('.vitalia-teaser a.vt-portrait'); if (founder) magnetic(founder, 0.2);
    document.querySelectorAll('.truck-feature .truck-img a').forEach(function (t) { magnetic(t, 0.16); });
    // Skip magnetic inside forms: the transform fights the hover shadow and feels wrong on a submit.
    document.querySelectorAll('.btn-primary, .btn-light, .nav-truck, .fab-book').forEach(function (b) {
      if (b.closest('form') || b.closest('.form-submit')) return;
      magnetic(b, 0.26);
    });
  }

  /* ---- Menus: tabs + language + FLIPBOOK ---- */
  function initMenus() {
    var tabs = document.querySelectorAll('.menu-tab');
    if (!tabs.length) return;
    var langs = document.querySelectorAll('.menu-lang');
    var langWrap = document.getElementById('menuLangs');
    var title = document.getElementById('menuTitle');
    var dl = document.getElementById('menuDownload');
    var stage = document.getElementById('flipStage');
    var counter = document.getElementById('flipCounter');
    var prev = document.querySelector('.flip-nav.prev');
    var next = document.querySelector('.flip-nav.next');
    var wrap = document.getElementById('flipbook');
    // the HTML menu owns some tabs now, so this can legitimately find nothing to drive
    if (!stage) return;
    var state = { tab: tabs[0], lang: 'en', page: 1, pages: [], busy: false };

    function folderCount(t, lang) {
      var f = t.getAttribute('data-folder-' + lang), c = t.getAttribute('data-count-' + lang);
      if (!f) { f = t.getAttribute('data-folder-en'); c = t.getAttribute('data-count-en'); }
      return { folder: f, count: parseInt(c || '0', 10) };
    }
    function setAspect(src) {
      var im = new Image();
      im.onload = function () { stage.style.aspectRatio = (im.naturalWidth / im.naturalHeight).toFixed(3); };
      im.src = src;
    }
    function baseImg() {
      var p = stage.querySelector('.flip-page');
      if (!p) { p = document.createElement('div'); p.className = 'flip-page'; p.innerHTML = '<img alt="Menu page">'; stage.appendChild(p); }
      return p.querySelector('img');
    }
    function render() {
      var total = state.pages.length;
      baseImg().src = state.pages[state.page - 1];
      counter && (counter.textContent = state.page + ' / ' + total);
      if (prev) prev.disabled = state.page <= 1;
      if (next) next.disabled = state.page >= total;
    }
    function coming(name) {
      stage.style.aspectRatio = '1.414/1';
      stage.innerHTML = '<div class="menu-coming"><h3>' + name + '</h3><p>This menu is on its way.</p><span class="chip chip-gold">Coming soon</span></div>';
      counter && (counter.textContent = '');
      if (prev) prev.disabled = true; if (next) next.disabled = true;
    }
    function turn(dir) {
      var total = state.pages.length;
      var target = state.page + dir;
      if (state.busy || target < 1 || target > total) return;
      state.busy = true;
      var fromSrc = state.pages[state.page - 1];
      var toSrc = state.pages[target - 1];
      var turnEl = document.createElement('div');
      turnEl.className = 'flip-turn';
      turnEl.innerHTML = '<img src="' + (dir > 0 ? fromSrc : toSrc) + '" alt=""><div class="flip-shade"></div>';
      // base shows destination immediately for forward; for back keep current then swap
      if (dir > 0) { baseImg().src = toSrc; }
      stage.appendChild(turnEl);
      var shade = turnEl.querySelector('.flip-shade');
      var start = dir > 0 ? 0 : -172;
      var end = dir > 0 ? -172 : 0;
      turnEl.style.transform = 'rotateY(' + start + 'deg)';
      turnEl.getBoundingClientRect(); // reflow
      turnEl.style.transition = 'transform .62s cubic-bezier(.4,.15,.2,1)';
      shade.style.transition = 'opacity .62s';
      requestAnimationFrame(function () {
        turnEl.style.transform = 'rotateY(' + end + 'deg)';
        shade.style.opacity = dir > 0 ? '1' : '0';
      });
      var done = function () {
        turnEl.removeEventListener('transitionend', done);
        state.page = target;
        render();
        if (turnEl.parentNode) turnEl.parentNode.removeChild(turnEl);
        state.busy = false;
      };
      turnEl.addEventListener('transitionend', done);
      setTimeout(done, 750); // safety
    }
    function load() {
      var t = state.tab;
      // menus rebuilt as HTML are driven by initMenuBook, which owns their language bar
      if (t && t.getAttribute('data-json')) return;
      tabs.forEach(function (x) { x.classList.toggle('active', x === t); });
      title && (title.textContent = t.getAttribute('data-name'));
      var hasTrans = !!t.getAttribute('data-folder-ja');
      if (langWrap) langWrap.classList.toggle('single', !hasTrans);
      var pdf = t.getAttribute('data-' + state.lang) || t.getAttribute('data-en');
      dl && (pdf ? dl.setAttribute('href', pdf) : dl.removeAttribute('href'));
      if (t.getAttribute('data-coming')) { coming(t.getAttribute('data-name')); return; }
      var fc = folderCount(t, state.lang);
      state.pages = [];
      for (var i = 1; i <= fc.count; i++) state.pages.push(fc.folder + '/p-' + i + '.jpg');
      // ensure stage has a base page (reset any 'coming' markup)
      stage.innerHTML = '<div class="flip-page"><img alt="Menu page"></div>';
      state.page = 1;
      if (state.pages.length) { setAspect(state.pages[0]); render(); }
      // preload next couple
      state.pages.slice(0, 3).forEach(function (s) { var im = new Image(); im.src = s; });
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { state.tab = t; load(); }); });
    langs.forEach(function (l) { l.addEventListener('click', function () {
      langs.forEach(function (x) { x.classList.remove('active'); }); l.classList.add('active');
      state.lang = l.getAttribute('data-lang'); load();
    }); });
    prev && prev.addEventListener('click', function () { turn(-1); });
    next && next.addEventListener('click', function () { turn(1); });

    // swipe + click halves + keyboard
    var sx = null;
    stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) turn(dx < 0 ? 1 : -1); sx = null;
    });
    stage.addEventListener('click', function (e) {
      var r = stage.getBoundingClientRect();
      turn((e.clientX - r.left) > r.width / 2 ? 1 : -1);
    });
    if (wrap) wrap.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') turn(1); else if (e.key === 'ArrowLeft') turn(-1);
    });
    // fullscreen
    var fsBtn = document.getElementById('flipFull');
    fsBtn && fsBtn.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (wrap.requestFullscreen) wrap.requestFullscreen();
    });

    load();
  }

  // Pages where the hiring badge and the mini truck are just clutter: the
  // visitor is either reading a menu, filling in a form, or already looking
  // at the truck itself, and both floaters kept getting in the way, worst on
  // a phone where they sit over the content instead of beside it.
  var FLOATER_QUIET_PAGES = ['career.html', 'functions.html', 'our-story.html', 'menus.html'];
  function isFloaterQuietPage() {
    var page = location.pathname.split('/').pop() || 'index.html';
    return FLOATER_QUIET_PAGES.indexOf(page) !== -1;
  }

  /* ---- Mini pizza-truck (WAAPI: even cruise + gentle hills; hover = slow-mo) ---- */
  function initMiniTruck() {
    var t = document.getElementById('miniTruck');
    if (!t) return;
    if (isFloaterQuietPage()) { t.remove(); return; }
    if (reduce || !t.animate) return;
    var ride = t.querySelector('.truck-ride');
    var route = null, bounce = null;
    // near-constant speed (offsets proportional to distance), soft road undulation
    var K = [
      { transform: 'translate(112vw,0px)',  offset: 0 },
      { transform: 'translate(92vw,-4px)',  offset: 0.14 },
      { transform: 'translate(72vw,2px)',   offset: 0.28 },
      { transform: 'translate(52vw,-5px)',  offset: 0.42 },
      { transform: 'translate(32vw,1px)',   offset: 0.57 },
      { transform: 'translate(12vw,-4px)',  offset: 0.71 },
      { transform: 'translate(-8vw,2px)',   offset: 0.85 },
      { transform: 'translate(-30vw,0px)',  offset: 1 }
    ];
    function drive() {
      if (route) route.cancel();
      t.style.opacity = '1';
      route = t.animate(K, { duration: 24000, easing: 'linear', fill: 'forwards' });
      route.onfinish = function () { t.style.opacity = '0'; };
      if (!bounce && ride) {
        bounce = ride.animate(
          [{ transform: 'translateY(0) rotate(-0.9deg)' },
           { transform: 'translateY(-3.5px) rotate(0.7deg)' },
           { transform: 'translateY(0) rotate(-0.9deg)' }],
          { duration: 560, iterations: Infinity, easing: 'ease-in-out' }
        );
      }
    }
    if (ride) {
      ride.addEventListener('mouseenter', function () {
        if (route) route.playbackRate = 0.12;
        if (bounce) bounce.playbackRate = 0.3;
      });
      ride.addEventListener('mouseleave', function () {
        if (route) route.playbackRate = 1;
        if (bounce) bounce.playbackRate = 1;
      });
    }
    setTimeout(drive, 6000);
    setInterval(drive, 48000);
  }

  /* ---- Pizza slideshow ("The must"): image + copy rotate together ---- */
  /* ---- Home hero: two slides that travel left together ----
     The mosaic wall is one image sliced back into tiles by background-position, so
     fifty photographs cost one request. Tiles are always square: the grid takes as
     many columns as suit the viewport and as many rows as it needs to cover the
     hero, then pulls tiles from the source grid in a shuffled order. ---- */
  function buildHeroMosaic(el) {
    var narrow = matchMedia('(max-width: 700px)').matches;
    var src = el.getAttribute(narrow ? 'data-mob' : 'data-desk');
    // Absolute, because a relative url() inside a custom property is resolved
    // against the stylesheet that reads it, not the page: this went looking for
    // /css/assets/opt/hero/ and got a 404.
    if (src) src = new URL(src, location.href).href;
    var grid = (el.getAttribute(narrow ? 'data-mob-grid' : 'data-desk-grid') || '10x5').split('x');
    var cols = +grid[0], rows = +grid[1];
    var w = el.clientWidth, h = el.clientHeight;
    if (!w || !h || !src) return;

    /* The owner's collage exactly as they arranged it: every photo once, in their
       order, never stretched. Filling the hero with square tiles instead needed
       more than the fifty they gave us, so some had to repeat.
       So the grid is sized the way object-fit:cover sizes a picture, one square
       cell per source tile, and the overflow is clipped by the parent. */
    var cell = Math.max(w / cols, h / rows);
    var gw = cell * cols, gh = cell * rows;

    var html = '';
    for (var i = 0; i < cols * rows; i++) {
      var cx = i % cols, cy = Math.floor(i / cols);
      // percentage positioning counts from the far edge, hence the /(n-1)
      var bp = (cols > 1 ? (cx * 100) / (cols - 1) : 0).toFixed(4) + '% ' +
               (rows > 1 ? (cy * 100) / (rows - 1) : 0).toFixed(4) + '%';
      // roughly one in three breathes: a wall where everything moves at once
      // reads as nervous rather than alive
      var live = (i % 3 === 1);
      html += '<div class="hero-tile' + (live ? ' is-live' : '') + '"' +
        (live ? ' style="--d:' + (10 + (i % 7)) + 's;--t:-' + ((i * 1.7) % 10).toFixed(1) + 's"' : '') +
        '><i style="--m:url(' + src + ');--bs:' + (cols * 100) + '% ' + (rows * 100) + '%;--bp:' + bp + '"></i></div>';
    }
    el.innerHTML = '<div class="hero-mosaic-grid" style="width:' + Math.ceil(gw) + 'px;height:' + Math.ceil(gh) +
      'px;grid-template-columns:repeat(' + cols + ',1fr);grid-template-rows:repeat(' + rows + ',1fr)">' + html + '</div>';
    el.dataset.built = cols + 'x' + rows;
  }

  /* One slide per page now (the carousel this used to drive is gone), but the
     hero still needs its height fitted around whatever sits above it, and the
     mosaic (when this page has one) still needs to be built. */
  function initHero() {
    var hero = document.getElementById('hero');
    var track = document.getElementById('heroTrack');
    if (!hero || !track) return;
    /* The hero is the first screen, so it should end where the first screen ends.
       min(94vh,880px) ignored the announcement bar and the nav stacked above it,
       which pushed the last 70-odd pixels under the fold: on a 900px laptop the
       scroll cue was unreachable. */
    function fitHero() {
      var above = hero.getBoundingClientRect().top + (window.scrollY || 0);
      // data-fit lets a page ask for less than a full screen (Our Story: about three quarters)
      var fit = parseFloat(hero.getAttribute('data-fit')) || 1;
      var h = Math.max(fit < 1 ? 420 : 460, Math.min((window.innerHeight - above) * fit, 880));
      hero.style.setProperty('--hero-h', Math.round(h) + 'px');
    }
    fitHero();
    // Width only: resizing the hero while someone is scrolling past it, purely
    // because a phone's address bar slid away, is exactly the jolt to avoid.
    var fitW = document.documentElement.clientWidth;
    window.addEventListener('resize', function () {
      var w = document.documentElement.clientWidth;
      if (w === fitW) return;
      fitW = w;
      fitHero();
    });
    window.addEventListener('orientationchange', function () { setTimeout(fitHero, 200); });
    var bar = document.getElementById('resvBar');
    if (bar) {
      var closeBtn = bar.querySelector('.resv-close');
      if (closeBtn) closeBtn.addEventListener('click', function () { setTimeout(fitHero, 30); });
    }

    var mosaic = document.getElementById('heroMosaic');
    if (!mosaic) return;
    // Largest contentful paint on the pages that have one, so built straight
    // away rather than deferred.
    var build = function () { buildHeroMosaic(mosaic); };
    build();
    /* Width only, same reasoning as fitHero above: on a phone the address bar
       sliding away fires resize with a new height every few pixels of scroll,
       and rebuilding fifty tiles each time made the wall jump and restart its
       animations under the finger. The grid is cover-sized and centred, so a
       change of height alone is absorbed by the crop and needs no rebuild. */
    var rt, lastW = document.documentElement.clientWidth;
    window.addEventListener('resize', function () {
      var w = document.documentElement.clientWidth;
      if (w === lastW) return;
      lastW = w;
      clearTimeout(rt);
      rt = setTimeout(function () { if (mosaic.dataset.built) build(); }, 250);
    });
  }

  function initPizzaSlideshow() {
    var box = document.getElementById('pizzaSlideshow');
    var copy = document.getElementById('pizzaCopy');
    if (!box || reduce) return;
    var imgs = box.querySelectorAll('img');
    var dots = box.querySelectorAll('.pizza-dots span');
    var lines = [
      "We're obsessed with the dough. Slow fermented for real flavour, real character and a lighter, easier bite.",
      "Real Neapolitan style: a tall, airy cornicione that's easy on the stomach, not a brick in it.",
      "Tradition first, then we have fun on top: bold, contemporary flavours on a classic base.",
      "Italian flour, Italian tomato, real Italian mozzarella. We don't cut corners on where it comes from.",
      "Sliced, shared and gone in minutes. This is what brings the whole table together.",
      "This is the pizza people cross town for. It isn't an option, it's a must."
    ];
    var i = 0;
    setInterval(function () {
      i = (i + 1) % imgs.length;
      imgs.forEach(function (im, idx) { im.classList.toggle('active', idx === i); });
      dots.forEach(function (d, idx) { d.classList.toggle('active', idx === i); });
      if (copy && lines[i]) {
        copy.classList.add('fading');
        setTimeout(function () { copy.textContent = lines[i]; copy.classList.remove('fading'); }, 400);
      }
    }, 4300);
  }

  /* ---- Dishes showcase: idle auto-rotate (no dots); hover reveals the
         film-strip accordion instead, handled entirely by CSS ---- */
  function initDishesShowcase() {
    var box = document.getElementById('dishesShowcase');
    if (!box || reduce) return;
    var idle = box.querySelector('.dishes-idle');
    if (!idle) return;
    var imgs = idle.querySelectorAll('img');
    var i = 0;
    setInterval(function () {
      i = (i + 1) % imgs.length;
      imgs.forEach(function (im, idx) { im.classList.toggle('active', idx === i); });
    }, 3800);
  }

  /* ---- Reveal cards (Pizza by the Metre, Caffè & Cocktails, ...): hover
         opens them on desktop (pure CSS); touch/keyboard get a tap toggle ---- */
  function initRevealCards() {
    var touch = window.matchMedia && window.matchMedia('(hover:none)').matches;
    document.querySelectorAll('[data-reveal]').forEach(function (cell) {
      function toggle() {
        var open = cell.classList.toggle('open');
        cell.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      if (touch) {
        cell.addEventListener('click', toggle);
        document.addEventListener('click', function (e) {
          if (!cell.contains(e.target)) { cell.classList.remove('open'); cell.setAttribute('aria-expanded', 'false'); }
        });
      }
      cell.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  }

  /* ---- Custom file inputs ---- */
  function initFileInputs() {
    document.querySelectorAll('.file-field input[type=file]').forEach(function (inp) {
      var name = inp.closest('.file-field').querySelector('.file-name');
      inp.addEventListener('change', function () {
        name.textContent = inp.files && inp.files.length ? inp.files[0].name : 'No file yet';
      });
    });
  }

  /* ---- Open Positions (Work With Us): fetch live openings, wire "Apply" ---- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function levelChipClass(level) {
    var l = (level || '').toLowerCase();
    if (l.indexOf('required') !== -1) return 'chip chip-exp-req';
    if (l.indexOf('needed') !== -1 || l.indexOf('necessary') !== -1) return 'chip chip-exp-low';
    return 'chip chip-exp-any';
  }
  // "Immediate start", or the real date the owner picked
  function startLabel(p) {
    if (!p.start) return '';
    if (p.start === 'From a date' && p.startDate) {
      var d = new Date(p.startDate + 'T00:00:00');
      if (!isNaN(d)) return 'From ' + d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
      return '';
    }
    if (p.start === 'From a date') return '';
    return p.start;
  }
  function timeAgo(iso) {
    var diff = Date.now() - new Date(iso).getTime();
    var day = 86400000;
    if (diff < day) return 'Today';
    var days = Math.floor(diff / day);
    if (days === 1) return '1 day ago';
    if (days < 7) return days + ' days ago';
    var weeks = Math.floor(days / 7);
    if (weeks === 1) return '1 week ago';
    if (weeks < 5) return weeks + ' weeks ago';
    var months = Math.floor(days / 30);
    if (months <= 1) return '1 month ago';
    return months + ' months ago';
  }

  /* ---- Apply flow panels: applyChoice -> positionPicker -> formExpand ---- */
  var panelReturn = 'applyChoice';

  function selectRole(role, type) {
    var roleSelect = document.getElementById('role');
    if (roleSelect) {
      var matched = false;
      for (var i = 0; i < roleSelect.options.length; i++) {
        if (roleSelect.options[i].value === role) { roleSelect.value = role; matched = true; break; }
      }
      if (!matched) roleSelect.value = 'Other';
    }
    var banner = document.getElementById('applyingForBanner');
    if (banner) banner.textContent = 'Applying for: ' + role + (type ? ' (' + type + ')' : '');
  }

  function hidePanel(id, done) {
    var el = document.getElementById(id);
    if (!el) { if (done) done(); return; }
    if (id === 'formExpand') {
      el.classList.remove('open');
      setTimeout(function () { if (done) done(); }, reduce ? 0 : 350);
    } else {
      /* Hold the container's height while one panel swaps for the next.
         Removing the old panel used to collapse the page for a frame, so the
         footer flashed up before the form opened and pushed it back down. */
      var box = el.parentNode;
      if (box && box.style) {
        box.style.minHeight = box.offsetHeight + 'px';
        setTimeout(function () { box.style.minHeight = ''; }, reduce ? 0 : 900);
      }
      el.classList.add('fade-out');
      setTimeout(function () { el.style.display = 'none'; if (done) done(); }, reduce ? 0 : 280);
    }
  }
  function showPanel(id, scrollToId) {
    var el = document.getElementById(id);
    if (!el) return;
    if (id === 'formExpand') {
      el.classList.add('open');
      var handled = false;
      el.addEventListener('transitionend', function once() {
        if (handled) return; handled = true;
        var t = document.getElementById(scrollToId || 'formBackBtn');
        if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        el.removeEventListener('transitionend', once);
      });
    } else {
      el.style.display = '';
      requestAnimationFrame(function () { el.classList.remove('fade-out'); });
      var t2 = document.getElementById(scrollToId || id);
      if (t2) t2.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function goToForm(fromPanelId) {
    panelReturn = fromPanelId;
    hidePanel(fromPanelId, function () { showPanel('formExpand'); });
  }
  function goToPicker() {
    hidePanel('applyChoice', function () { showPanel('positionPicker', 'positionPicker'); });
  }
  function backFromForm() {
    hidePanel('formExpand', function () { showPanel(panelReturn); });
  }
  function backFromPicker() {
    hidePanel('positionPicker', function () { showPanel('applyChoice'); });
  }

  function renderPicker() {
    var list = document.getElementById('pickerList');
    if (!list) return;
    list.innerHTML = cachedPositions.map(function (p) {
      return '<button type="button" class="picker-item" data-role="' + escapeHtml(p.role) + '" data-type="' + escapeHtml(p.type || '') + '">' +
        '<span class="picker-item-info"><span class="picker-item-role">' + escapeHtml(p.role) + '</span>' +
        '<span class="picker-item-tags">' +
        (p.type ? '<span class="chip chip-type">' + escapeHtml(p.type) + '</span>' : '') +
        (p.hours ? '<span class="chip chip-hours">' + escapeHtml(p.hours) + '</span>' : '') +
        (p.level ? '<span class="' + levelChipClass(p.level) + '">' + escapeHtml(p.level) + '</span>' : '') +
        '</span></span>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>' +
        '</button>';
    }).join('');
    list.querySelectorAll('.picker-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectRole(btn.getAttribute('data-role'), btn.getAttribute('data-type'));
        goToForm('positionPicker');
      });
    });
  }

  /* Google shows job openings straight in the results, for free, if they carry
     JobPosting data. The roles are fetched at runtime, so the markup has to be
     written at runtime too. Googlebot renders the page, so it sees this. */
  function publishJobSchema(positions) {
    var old = document.getElementById('jobSchema');
    if (old) old.remove();
    if (!positions.length) return;

    var site = location.origin;
    var org = {
      '@type': 'Organization',
      name: "Vitalia's Italian Restaurant",
      sameAs: site + '/',
      logo: site + 'assets/opt/logo-white.png'
    };
    var place = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shop 9/2 Pier Point Road',
        addressLocality: 'Cairns City',
        addressRegion: 'QLD',
        postalCode: '4870',
        addressCountry: 'AU'
      }
    };
    var TYPES = { 'Casual': 'PART_TIME', 'Part-time': 'PART_TIME', 'Full-time': 'FULL_TIME' };

    var jobs = positions.map(function (p) {
      var posted = p.createdAt ? p.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10);
      var expires = new Date((p.createdAt ? new Date(p.createdAt) : new Date()).getTime() + 90 * 86400000);
      var bits = ['<p>' + [p.type, p.hours, p.level].filter(Boolean).join(', ') + '.</p>'];
      if (startLabel(p)) bits.push('<p>' + startLabel(p) + '.</p>');
      if (p.note) bits.push('<p>' + p.note + '</p>');
      bits.push('<p>Vitalia&#39;s is an Italian restaurant and pizzeria at The Pier on the Cairns waterfront.</p>');
      return {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: p.role,
        description: bits.join(''),
        datePosted: posted,
        validThrough: expires.toISOString().slice(0, 10),
        employmentType: TYPES[p.type] || 'OTHER',
        hiringOrganization: org,
        jobLocation: place,
        directApply: true,
        url: site + '/career.html'
      };
    });

    var tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.id = 'jobSchema';
    tag.textContent = JSON.stringify(jobs.length === 1 ? jobs[0] : jobs);
    document.head.appendChild(tag);
  }

  function initPositions() {
    var wrap = document.getElementById('openPositions');
    var openBtn = document.getElementById('applyOpenBtn');
    var noPositionsNote = document.getElementById('noPositionsNote');
    var countBadge = document.getElementById('positionsCount');
    if (!wrap) return;
    fetch('/.netlify/functions/positions').then(function (r) { return r.ok ? r.json() : []; }).then(function (positions) {
      if (!positions || !positions.length) {
        wrap.innerHTML = '<p class="positions-empty">Nothing open today, but we would love to meet you anyway.</p>';
        return;
      }
      if (openBtn) { openBtn.disabled = false; }
      if (noPositionsNote) { noPositionsNote.style.display = 'none'; }
      if (countBadge) {
        countBadge.textContent = positions.length === 1 ? '1 role open' : positions.length + ' roles open';
        countBadge.hidden = false;
      }
      cachedPositions = positions;
      publishJobSchema(positions);
      wrap.innerHTML = positions.map(function (p) {
        return '<div class="position-card">' +
          '<div class="position-head"><h3>' + escapeHtml(p.role) + '</h3>' +
          (p.createdAt ? '<span class="position-date">' + escapeHtml(timeAgo(p.createdAt)) + '</span>' : '') +
          '</div>' +
          '<div class="position-tags">' +
          (p.type ? '<span class="chip chip-type">' + escapeHtml(p.type) + '</span>' : '') +
          (p.hours ? '<span class="chip chip-hours">' + escapeHtml(p.hours) + '</span>' : '') +
          (p.level ? '<span class="' + levelChipClass(p.level) + '">' + escapeHtml(p.level) + '</span>' : '') +
          (startLabel(p) ? '<span class="chip chip-start">' + escapeHtml(startLabel(p)) + '</span>' : '') +
          '</div>' +
          (p.note ? '<p class="position-note">' + escapeHtml(p.note) + '</p>' : '') +
          '<button type="button" class="btn btn-primary btn-sm position-apply" data-role="' + escapeHtml(p.role) + '" data-type="' + escapeHtml(p.type || '') + '">Apply for this role</button>' +
          '</div>';
      }).join('');
      renderPicker();
      wrap.querySelectorAll('.position-apply').forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectRole(btn.getAttribute('data-role'), btn.getAttribute('data-type'));
          goToForm('applyChoice');
        });
      });
    }).catch(function () { wrap.innerHTML = ''; });
  }

  /* ---- Reviews carousel ---- */
  function initReviewsCarousel() {
    var track = document.getElementById('reviewsTrack');
    var prev = document.getElementById('revPrev');
    var next = document.getElementById('revNext');
    if (!track) return;
    function step() {
      var card = track.querySelector('.rev-card');
      if (!card) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 16);
      return card.getBoundingClientRect().width + gap;
    }
    function atEnd() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
    function atStart() { return track.scrollLeft <= 4; }
    if (next) next.addEventListener('click', function () {
      if (atEnd()) track.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' });
      else track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' });
    });
    if (prev) prev.addEventListener('click', function () {
      if (atStart()) track.scrollTo({ left: track.scrollWidth, behavior: reduce ? 'auto' : 'smooth' });
      else track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---- Certificate field follows the chosen role ----
     Queensland: front of house needs an RSA to serve alcohol, kitchen roles
     need a food safety / food handler certificate. Same options either way. */
  var KITCHEN_ROLES = ['Pizzaiolo', 'Chef / Cook', 'Kitchenhand', 'Dishwasher'];
  function syncCertLabel() {
    var roleSel = document.getElementById('role');
    var certLabel = document.getElementById('certLabel');
    if (!roleSel || !certLabel) return;
    var isKitchen = KITCHEN_ROLES.indexOf(roleSel.value) !== -1;
    certLabel.textContent = isKitchen ? certLabel.getAttribute('data-kitchen') : certLabel.getAttribute('data-foh');
  }
  function initCertField() {
    var roleSel = document.getElementById('role');
    if (!roleSel) return;
    roleSel.addEventListener('change', syncCertLabel);
    syncCertLabel();
  }

  /* ---- Extra languages ---- */
  function initLanguages() {
    var addBtn = document.getElementById('addLangBtn');
    var host = document.getElementById('extraLangs');
    if (!addBtn || !host) return;
    addBtn.addEventListener('click', function () {
      var row = document.createElement('div');
      row.className = 'lang-row lang-row-extra';
      row.innerHTML =
        '<button type="button" class="lang-remove" aria-label="Remove language"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
        '<input class="lang-input" type="text" name="extra_language" placeholder="Language" aria-label="Language">' +
        '<div class="lang-scale">' +
        '<input type="range" name="extra_language_level" min="1" max="4" step="1" value="2" aria-label="Level">' +
        '<div class="lang-ticks" aria-hidden="true"><span>Basic</span><span>Medium</span><span>Fluent</span><span>Native</span></div>' +
        '</div>';
      row.querySelector('.lang-remove').addEventListener('click', function () { row.remove(); });
      host.appendChild(row);
      row.querySelector('.lang-input').focus();
    });
  }

  /* ---- Form guard, shared by the enquiry form and the job application ----
     The consent and 18+ boxes are visually hidden inputs behind a styled square.
     Chrome refuses to show its own validation bubble on an element it cannot focus,
     so a missing tick used to make the button do nothing at all, with no message.
     We take validation over: our own inline errors, and a locked button so a
     double click never sends the same enquiry twice. */
  var FIELD_MESSAGES = {
    event_type: 'Pick the kind of event so we know where to start.',
    event_date: 'Which date are you thinking of?',
    guests: 'Roughly how many people?',
    name: 'What should we call you?',
    email: 'That email does not look right, we need it to reply.',
    consent: 'Please tick this so we are allowed to answer you.',
    over18: 'You need to be 18 or over to work with us.',
    role: 'Pick the role you are applying for.'
  };

  function fieldWrap(el) {
    return el.closest('.form-field') || el.closest('.form-check') || el.closest('.ev-types') || el.parentElement;
  }
  function clearFieldError(el) {
    var wrap = fieldWrap(el);
    if (!wrap) return;
    wrap.classList.remove('has-error');
    var msg = wrap.querySelector('.field-error');
    if (msg) msg.remove();
  }
  function markFieldError(el) {
    var wrap = fieldWrap(el);
    if (!wrap || wrap.querySelector('.field-error')) return;
    wrap.classList.add('has-error');
    var msg = document.createElement('p');
    msg.className = 'field-error';
    msg.setAttribute('role', 'alert');
    msg.textContent = FIELD_MESSAGES[el.name] || el.validationMessage || 'This one we need.';
    wrap.appendChild(msg);
  }
  // The Functions page drives its step form from js/functions.js and reuses
  // these, so a step and the final submit show exactly the same messages.
  window.VitaliaForm = { mark: markFieldError, clear: clearFieldError };

  function initFormGuard(form) {
    if (!form) return;
    form.setAttribute('novalidate', '');

    form.addEventListener('input', function (e) { clearFieldError(e.target); });
    form.addEventListener('change', function (e) { clearFieldError(e.target); });

    form.addEventListener('submit', function (e) {
      var seen = {};
      var invalid = [];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.willValidate || el.checkValidity()) return;
        if (el.name && seen[el.name]) return;          // one message per radio group
        if (el.name) seen[el.name] = true;
        invalid.push(el);
      });

      if (invalid.length) {
        e.preventDefault();
        invalid.forEach(markFieldError);
        var wrap = fieldWrap(invalid[0]);
        if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
        try { invalid[0].focus({ preventScroll: true }); } catch (err) { /* hidden input */ }
        return;
      }

      var btn = form.querySelector('.form-submit .btn');
      if (btn) {
        if (btn.dataset.sent) { e.preventDefault(); return; }   // no double send
        btn.dataset.sent = '1';
        btn.classList.add('is-busy');
        // If the upload is slow the browser stays on the page; give the button back
        // after a while so a failed request is not a dead end.
        setTimeout(function () { btn.classList.remove('is-busy'); delete btn.dataset.sent; }, 20000);
      }
    });
  }

  /* ---- Set menus: a row of tabs above one panel. The tabs carry the comparison
     (name and price), the panel spells out only the menu you picked. Anything that
     points at a menu by name, here or elsewhere on the page, goes through
     chooseMenuInForm so the form and the tabs never disagree. ---- */
  var fnTabs = [];

  function chooseMenuInForm(wanted) {
    var select = document.getElementById('ev_menu');
    if (select) {
      var match = Array.prototype.filter.call(select.options, function (o) { return o.textContent === wanted; })[0];
      if (match) {
        select.value = match.value || match.textContent;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    var section = document.getElementById('fn-enquire');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* Paint the panel from whichever tab is on. Everything it needs already lives on
     the tab, so a renamed or repriced menu only has to be written in one place. */
  function paintMenuPanel() {
    var tab = fnTabs.filter(function (t) { return t.classList.contains('is-on'); })[0] || fnTabs[0];
    if (!tab) return;
    var panel = document.getElementById('fnPanel');
    if (!panel) return;
    var n = tab.getAttribute('data-i');
    var set = function (id, value) { var el = document.getElementById(id); if (el) el.textContent = value; };

    set('fnPanelN', tab.querySelector('.fn-tab-n').textContent);
    set('fnPanelName', tab.querySelector('.fn-tab-name').textContent);
    set('fnPanelSub', tab.getAttribute('data-sub') || '');
    panel.setAttribute('aria-labelledby', tab.id);

    var img = document.getElementById('fnPanelImg');
    if (img && img.getAttribute('src') !== tab.getAttribute('data-img')) {
      img.setAttribute('src', tab.getAttribute('data-img'));
      img.alt = '';
    }
    var flag = document.getElementById('fnPanelFlag');
    if (flag) { flag.textContent = tab.getAttribute('data-flag') || ''; flag.hidden = !tab.getAttribute('data-flag'); }

    /* The tailor-made menu has no price and no dish list from the backoffice: its
       courses are written into the page, so they are lifted from there instead. */
    var courses = document.getElementById('fnPanelCourses');
    var custom = document.getElementById('fnCourses4');
    var html = fnCourseHtml[fnService + n];
    // A menu with no lunch version is dinner only: say so, and still show the dinner.
    if (fnService === 'lunch' && n !== '4' && !html) {
      html = '<li class="fn-course is-note"><span class="fn-course-name">Dinner only</span>' +
        '<span class="fn-course-line">Served at dinner, with arrivals between 5:00 and 7:00pm.</span></li>' + (fnCourseHtml['dinner' + n] || '');
    }
    if (courses) courses.innerHTML = (n === '4' && custom) ? custom.innerHTML : (html || '');

    var price = tab.querySelector('.fn-tab-price strong');
    set('fnPanelPrice', price ? price.textContent : 'Your call');
    set('fnPanelPer', price ? 'per person' : 'priced with your quote');

    var cta = document.getElementById('fnPanelCta');
    if (cta) cta.setAttribute('data-menu', tab.getAttribute('data-menu'));
  }

  function initMenuTabs() {
    fnTabs = Array.prototype.slice.call(document.querySelectorAll('.fn-tab[data-menu]'));
    if (!fnTabs.length) return;

    function show(tab, focus) {
      fnTabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      paintMenuPanel();
      if (focus) tab.focus();
    }

    fnTabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { show(tab); });
      tab.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        show(fnTabs[(i + step + fnTabs.length) % fnTabs.length], true);
      });
    });

    var cta = document.getElementById('fnPanelCta');
    if (cta) cta.addEventListener('click', function () { chooseMenuInForm(cta.getAttribute('data-menu')); });

    // Lunch and dinner: same prices, the dishes that service actually cooks.
    var note = document.getElementById('fnServiceNote');
    document.querySelectorAll('.fn-service-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        fnService = b.getAttribute('data-service');
        document.querySelectorAll('.fn-service-btn').forEach(function (x) {
          var on = x === b;
          x.classList.toggle('is-on', on);
          x.setAttribute('aria-pressed', String(on));
        });
        if (note) note.textContent = fnService === 'lunch'
          ? 'Lunch arrivals between 11:30am and 1:30pm' : 'Dinner arrivals between 5:00 and 7:00pm';
        fnTabs.forEach(function (t) { t.classList.toggle('is-dinner-only', !!(fnService === 'lunch' && fnDinnerOnly[t.getAttribute('data-i')])); });
        paintMenuPanel();
      });
    });

    // Buttons elsewhere on the page that jump to the form with a menu preselected
    document.querySelectorAll('[data-choose-menu]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        chooseMenuInForm(el.getAttribute('data-choose-menu'));
      });
    });

    // The dishes may already be built by now, or may still be in flight. Painting
    // here and again when they land means the panel is right either way.
    paintMenuPanel();
  }

  /* ---- Functions enquiry form: only ask what the previous answer makes relevant ---- */
  function initEventForm() {
    initFormGuard(document.getElementById('jobForm'));
    var form = document.getElementById('eventForm');
    if (!form) return;
    initFormGuard(form);

    /* Progress: a long form feels shorter when you can see the end of it. */
    var bar = document.getElementById('evProgress');
    if (bar) {
      var fill = bar.querySelector('.ev-progress-fill');
      var count = bar.querySelector('.ev-progress-count');
      var tracked = ['event_type', 'event_date', 'event_time', 'guests', 'date_flexible', 'space',
        'menu_style', 'drinks', 'dietary', 'name', 'email', 'phone', 'message'];
      var updateProgress = function () {
        var done = tracked.filter(function (n) {
          var els = form.elements[n];
          if (!els) return false;
          if (els.length && els[0] && els[0].type === 'radio') {
            return Array.prototype.some.call(els, function (r) { return r.checked; });
          }
          return String(els.value || '').trim() !== '';
        }).length;
        var pct = Math.round(done / tracked.length * 100);
        fill.style.width = pct + '%';
        bar.classList.toggle('is-done', pct === 100);
        count.textContent = pct < 15 ? 'Takes about two minutes'
          : (pct === 100 ? 'All filled in, thank you' : pct + '% filled in');
      };
      form.addEventListener('input', updateProgress);
      form.addEventListener('change', updateProgress);
      updateProgress();
    }

    // Nobody can book a party in the past, so do not let them try.
    var date = document.getElementById('ev_date');
    if (date && !date.min) {
      var t = new Date();
      date.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    }

    // Gentle checks against the set menu rules: they explain, they never block.
    var warn = document.getElementById('evMenuWarn');
    if (warn) {
      var check = function () {
        var m = (document.getElementById('ev_menu') || {}).value || '';
        var t = (document.getElementById('ev_time') || {}).value || '';
        var g = Number((document.getElementById('ev_guests') || {}).value) || 0;
        var setMenu = /^Set Menu/.test(m);
        var hm = t.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
        var mins = hm ? (Number(hm[1]) % 12 + (hm[3] === 'pm' ? 12 : 0)) * 60 + Number(hm[2]) : null;
        var lunch = mins !== null && mins < 16 * 60;
        var inWindow = mins !== null && ((mins >= 690 && mins <= 810) || (mins >= 1020 && mins <= 1140));
        var minGuests = Number((document.querySelector('[data-setting="minGuests"]') || {}).textContent) || 10;
        var msgs = [];
        if (/Festa/.test(m) && lunch) msgs.push('La Festa is served at dinner only. Pick a dinner time, or La Piazza or La Trattoria for lunch.');
        if (setMenu && g > 0 && g < minGuests) msgs.push('Set menus are for groups of ' + minGuests + ' or more. For a smaller group we will suggest the à la carte menu.');
        if (setMenu && mins !== null && !inWindow) msgs.push('That time is outside our set menu hours, so we will confirm what is possible.');
        warn.textContent = msgs.join(' ');
        warn.hidden = !msgs.length;
      };
      ['ev_menu', 'ev_time', 'ev_guests'].forEach(function (idName) {
        var el = document.getElementById(idName);
        if (el) { el.addEventListener('change', check); el.addEventListener('input', check); }
      });
    }

    var menu = document.getElementById('ev_menu');
    var focus = document.getElementById('evMenuFocus');
    if (menu && focus) {
      var sync = function () {
        var wants = /tailor/i.test(menu.value);
        focus.hidden = !wants;
        if (!wants) document.getElementById('ev_focus').value = '';
      };
      menu.addEventListener('change', sync);
      sync();
    }
  }

  /* ---- Prices and capacity the owner can change from the backoffice.
     The page already ships with sensible values baked in, so a slow or failed
     request leaves the real numbers on screen rather than a gap. ---- */
  function initFnSettings() {
    var nodes = document.querySelectorAll('[data-setting]');
    if (!nodes.length) return Promise.resolve();
    renderMenuDishes(null);          // built-in dishes first, so nothing is ever blank
    return fetch('/.netlify/functions/settings')
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (settings) {
        if (!settings) return;
        nodes.forEach(function (el) {
          var value = settings[el.getAttribute('data-setting')];
          if (value === undefined || value === null || value === '') return;
          el.textContent = (el.getAttribute('data-prefix') || '') + value + (el.getAttribute('data-suffix') || '');
        });
        renameMenus(settings);
        renderMenuDishes(settings);
      })
      .catch(function () { /* the built-in dishes are already on the page */ });
  }

  /* The dishes come from one place: the JSON block on the page, overridden by whatever
     the owner has saved in Settings. Course order is fixed; an empty course does not
     appear at all, not even its heading. */
  var COURSE_ORDER = ['Entrée', 'Antipasto', 'Primi', 'Mains', 'Sides', 'Desserts', 'Drinks', 'Wines'];

  /* Built once per menu and kept here, because only one menu is on screen at a time
     and switching tabs must not go back to the network. */
  var fnCourseHtml = {};
  var fnService = 'dinner';
  var fnDinnerOnly = {};

  function renderMenuDishes(settings) {
    var holder = document.getElementById('fnMenuDefaults');
    if (!holder) return;
    var defaults = {};
    try { defaults = JSON.parse(holder.textContent) || {}; } catch (err) { return; }

    var COURSE_LABEL = { 'Entrée': 'To start', 'Antipasto': 'Antipasto · to share', 'Primi': 'Pasta · to share',
      'Mains': 'Main · one each', 'Sides': 'On the side', 'Desserts': 'Dolce · one each', 'Drinks': 'To drink', 'Wines': 'Wine' };
    var build = function (courses) {
      return COURSE_ORDER.filter(function (c) { return String(courses[c] || '').trim(); }).map(function (c) {
        var dishes = String(courses[c]).split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
        return '<li class="fn-course">' +
          '<span class="fn-course-name">' + escapeHtml(COURSE_LABEL[c] || c) + '</span>' +
          dishes.map(function (dd) { return '<span class="fn-course-line">' + escapeHtml(dd) + '</span>'; }).join('') +
        '</li>';
      }).join('');
    };
    var pick = function (saved, fallback) { return (saved && Object.keys(saved).length) ? saved : (fallback || {}); };

    [1, 2, 3].forEach(function (n) {
      fnCourseHtml['dinner' + n] = build(pick(settings && settings['menu' + n + 'Courses'], defaults[n]));
      // Saved settings win once the owner has saved lunch at all; before that, the built-in lunch.
      var hasSavedLunch = settings && Object.prototype.hasOwnProperty.call(settings, 'menu' + n + 'Lunch');
      var lunch = hasSavedLunch ? (settings['menu' + n + 'Lunch'] || {}) : ((defaults.lunch || {})[n] || {});
      fnCourseHtml['lunch' + n] = build(lunch);
      fnDinnerOnly[n] = !fnCourseHtml['lunch' + n];
    });

    paintMenuPanel();
    // The Functions page paints its side-by-side cards from the same dishes.
    window.VitaliaFn = { html: fnCourseHtml, dinnerOnly: fnDinnerOnly };
    try { document.dispatchEvent(new CustomEvent('fn:dishes', { detail: window.VitaliaFn })); } catch (err) { /* old browser */ }
  }

  /* A renamed set menu has to change everywhere at once: the tab, the value the tab
     sends to the form, and the option in the form's own dropdown. Otherwise choosing
     a menu would look for one the select no longer has. */
  function renameMenus(settings) {
    var select = document.getElementById('ev_menu');
    document.querySelectorAll('.fn-tab[data-menu], [data-menu-card]').forEach(function (card, i) {
      var name = settings['menu' + (i + 1) + 'Name'];
      if (!name) return;
      var oldValue = card.getAttribute('data-menu');
      var next = 'Set Menu ' + (i + 1) + ' \u00b7 ' + name;
      card.setAttribute('data-menu', next);
      if (!select) return;
      Array.prototype.forEach.call(select.options, function (o) {
        if (o.textContent === oldValue) { o.textContent = next; o.value = next; }
      });
    });
  }

  /* ---- Numbers in the Functions hero count up once, so the capacity claim lands ---- */
  function initCountUp() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    document.querySelectorAll('.fn-facts strong').forEach(function (el) {
      var parts = el.textContent.match(/^(.*?)(\d+)(.*)$/);
      if (!parts) return;
      var pre = parts[1], target = parseInt(parts[2], 10), post = parts[3];
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        var t0 = performance.now();
        (function step(now) {
          var t = Math.min(1, (now - t0) / 900);
          el.textContent = pre + Math.round(target * (1 - Math.pow(1 - t, 3))) + post;
          if (t < 1) requestAnimationFrame(step);
        })(t0);
      }, { threshold: 0.4 });
      io.observe(el);
    });
  }

  /* ---- Functions: a shortcut back to the enquiry form once the hero has scrolled
     past, and out of the way again once the form itself is on screen ---- */
  function initFnFab() {
    var fab = document.getElementById('fnFab');
    var form = document.getElementById('fn-enquire');
    if (!fab || !form) return;
    var pastHero = false, formInView = false;
    function apply() { fab.classList.toggle('in', pastHero && !formInView); }

    var hero = document.querySelector('.fn-hero');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        pastHero = !es[0].isIntersecting; apply();
      }, { threshold: 0 }).observe(hero);
      new IntersectionObserver(function (es) {
        formInView = es[0].isIntersecting; apply();
      }, { threshold: 0 }).observe(form);
    }
  }

  /* ---- Thank you page: say what actually happens next, per form ---- */
  function initThankYou() {
    var title = document.getElementById('tyTitle');
    if (!title) return;
    var q = location.search;
    var text = document.getElementById('tyText');
    var actions = document.getElementById('tyActions');
    if (q.indexOf('event=1') !== -1) {
      title.textContent = 'Your enquiry is with us';
      text.innerHTML = 'We have sent a copy to your inbox. One of the family will come back to you with a menu and a price, usually within one working day. In a hurry? Call <a href="tel:0740000865" style="color:var(--green);font-weight:600">07 4000 0865</a>.';
      actions.innerHTML = '<a href="menus.html" class="btn btn-primary">See the Menus</a><a href="index.html" class="btn btn-ghost">Back Home</a>';
    } else if (q.indexOf('deposit=1') !== -1) {
      title.textContent = 'Deposit received, the date is yours';
      text.innerHTML = 'Grazie. Your deposit is in and the date is now held for you. A receipt is on its way from Stripe, and we will be in touch the week before to confirm final numbers. Anything at all, call <a href="tel:0740000865" style="color:var(--green);font-weight:600">07 4000 0865</a>.';
      actions.innerHTML = '<a href="menus.html" class="btn btn-primary">See the Menus</a><a href="index.html" class="btn btn-ghost">Back Home</a>';
    } else if (q.indexOf('job=1') !== -1) {
      title.textContent = 'Application received';
      text.textContent = 'Thanks for wanting to join us. We read every application and will get in touch if there is a good fit. If we are not hiring right now we keep your details for twelve months.';
      actions.innerHTML = '<a href="our-story.html" class="btn btn-primary">Meet the Family</a><a href="index.html" class="btn btn-ghost">Back Home</a>';
    }
  }

  /* ---- "We're hiring" badge: only when a role is actually live, and never on
     the Career page (you are already there) or the other quiet pages ---- */
  function initHiringBadge() {
    var badge = document.getElementById('hiringBadge');
    if (!badge) return;
    if (isFloaterQuietPage()) { badge.remove(); return; }
    fetch('/.netlify/functions/positions')
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (positions) {
        if (!positions || !positions.length) return;
        var show = function () {
          badge.hidden = false;
          requestAnimationFrame(function () { badge.classList.add('in'); });
        };
        // On a wide screen it lives beside the content and can come straight in.
        // On a phone it sits over the page, so it waits until the hero has been
        // scrolled past and then slides in from the edge.
        if (!matchMedia('(max-width:1199px)').matches) { show(); return; }
        // On a phone it comes and goes with the hero: out of the way while the
        // headline is on screen, sliding in once you are past it and back out
        // the way it came if you scroll up again. The two thresholds are a
        // deadband, so it cannot flicker on and off around a single point.
        badge.hidden = false;
        var top = document.querySelector('.hero, .page-head, .p-open, .vc2');
        var enter = top ? top.offsetHeight * 0.7 : 260;
        var leave = enter - 70;
        var on = false;
        var onScroll = function () {
          var y = window.scrollY || window.pageYOffset || 0;
          var want = on ? y > leave : y > enter;
          if (want === on) return;
          on = want;
          badge.classList.toggle('in', want);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      })
      .catch(function () { /* stay hidden */ });
  }

  /* The rating and count baked into the HTML are a checked-in fallback, not a
     placeholder - a real number a human confirmed, kept fresh by a monthly
     sync (netlify/functions/sync-google-reviews.mjs). This only ever
     overwrites that fallback when a live figure actually comes back, so a
     slow network or a cold cache never blanks the number or shows a zero. */
  function initGoogleReviews() {
    var heroNum = document.getElementById('heroRatingNum');
    var heroCount = document.getElementById('heroReviewCount');
    var grNum = document.getElementById('grNum');
    var grCount = document.getElementById('grCount');
    if (!heroNum && !grNum) return;
    fetch('/.netlify/functions/reviews')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || typeof d.rating !== 'number' || typeof d.count !== 'number') return;
        var rating = d.rating.toFixed(1);
        var count = d.count.toLocaleString('en-AU');
        if (heroNum) heroNum.textContent = rating;
        if (heroCount) heroCount.textContent = count;
        if (grNum) grNum.textContent = rating;
        if (grCount) grCount.textContent = count;
        var starFill = document.querySelector('#grStars span');
        if (starFill) starFill.style.width = Math.round((d.rating / 5) * 100) + '%';
      })
      .catch(function () { /* the page already shows a real, recently-checked number */ });
  }

  function initApplyFlow() {
    var openBtn = document.getElementById('applyOpenBtn');
    var spontBtn = document.getElementById('applySpontBtn');
    var backBtn = document.getElementById('formBackBtn');
    var pickerBackBtn = document.getElementById('pickerBackBtn');
    if (!openBtn && !spontBtn) return;
    if (openBtn) openBtn.addEventListener('click', function () { goToPicker(); });
    if (spontBtn) spontBtn.addEventListener('click', function () {
      var banner = document.getElementById('applyingForBanner');
      if (banner) banner.textContent = 'Spontaneous Application';
      goToForm('applyChoice');
    });
    if (backBtn) backBtn.addEventListener('click', function () { backFromForm(); });
    if (pickerBackBtn) pickerBackBtn.addEventListener('click', function () { backFromPicker(); });
  }

  /* ---- Gift vouchers: the card is the picker. An amount chip rolls the figure
         on the card, rewrites the "what it buys" line and the buy button. The
         checkout link itself never changes: Square asks for the amount. ---- */
  function initVouchers() {
    var card = document.getElementById('vcCard');
    var amountEl = document.getElementById('vcAmount');
    var label = document.getElementById('vcBuyLabel');
    var buy = document.getElementById('vcBuyMain');
    var what = document.getElementById('vcWhat');
    var btns = document.querySelectorAll('.vc-amt');
    var current = amountEl ? parseInt(amountEl.textContent.replace(/\D/g, ''), 10) || 0 : 0;
    var raf = 0;

    function roll(to) {
      cancelAnimationFrame(raf);
      if (reduce || !current) { amountEl.textContent = '$' + to; current = to; return; }
      var from = current, t0 = performance.now(), dur = 520;
      (function step(now) {
        var k = Math.min(1, (now - t0) / dur);
        var e = 1 - Math.pow(1 - k, 3);
        amountEl.textContent = '$' + Math.round(from + (to - from) * e);
        if (k < 1) raf = requestAnimationFrame(step);
      })(t0);
      current = to;
      if (card) {
        card.classList.remove('is-roll');
        void card.offsetWidth;
        card.classList.add('is-roll');
      }
    }
    function pick(btn, focus) {
      btns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      if (focus) btn.focus();
      var amount = parseInt(btn.dataset.amount, 10);
      if (amountEl) roll(amount);
      if (label) label.textContent = 'Buy a $' + amount + ' voucher';
      else if (buy && buy.childNodes[0]) buy.childNodes[0].nodeValue = 'Buy a $' + amount + ' voucher ';
      if (what && btn.dataset.what) {
        what.innerHTML = '';
        var strong = document.createElement('strong');
        strong.textContent = btn.dataset.title || '';
        what.appendChild(strong);
        what.appendChild(document.createTextNode(' ' + btn.dataset.what));
      }
    }
    if (btns.length) {
      btns.forEach(function (btn, i) {
        if (btn.getAttribute('role') === 'radio') btn.tabIndex = btn.classList.contains('is-on') ? 0 : -1;
        btn.addEventListener('click', function () { pick(btn); });
        // a radio group moves with the arrow keys, like any other
        btn.addEventListener('keydown', function (e) {
          var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
          if (!d || btn.getAttribute('role') !== 'radio') return;
          e.preventDefault();
          pick(btns[(i + d + btns.length) % btns.length], true);
        });
      });
    }

    // Pointer tilt. Mouse only: on a touch screen there is no hover to leave.
    if (card && fine && !reduce) {
      var rect = null;
      card.addEventListener('mouseenter', function () { rect = card.getBoundingClientRect(); card.classList.add('is-tilting'); });
      card.addEventListener('mousemove', function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--ry', (px * 16).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-py * 12).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        rect = null;
        card.classList.remove('is-tilting');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    }
  }

  /* ---- Vitalia's book, tilted the same way the gift card is. It rests turned
         away from the reader rather than flat on, so the spine and the page
         block are visible; the pointer only ever swings it around that. ---- */
  function initBook3d() {
    var book = document.getElementById('book3d');
    if (!book || !fine || reduce) return;
    var REST_Y = -22, rect = null;
    book.addEventListener('mouseenter', function () {
      rect = book.getBoundingClientRect();
      book.classList.add('is-tilting');
    });
    book.addEventListener('mousemove', function (e) {
      if (!rect) rect = book.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      book.style.setProperty('--ry', (REST_Y + px * 26).toFixed(2) + 'deg');
      book.style.setProperty('--rx', (-py * 14).toFixed(2) + 'deg');
    });
    book.addEventListener('mouseleave', function () {
      rect = null;
      book.classList.remove('is-tilting');
      book.style.setProperty('--ry', REST_Y + 'deg');
      book.style.setProperty('--rx', '0deg');
    });
  }

  /* ---- The floating Book a Table button only earns its place once the hero, which
         carries the same call to action, has scrolled away ---- */
  function initBookFab() {
    var fab = document.querySelector('.fab-book');
    if (!fab) return;
    var hero = document.querySelector('.hero, .page-head, .vc-hero, .p-open');
    var end = document.querySelector('.finale');
    var past = false, quiet = false;
    function paint() {
      fab.classList.toggle('is-on', past);
      // the finale carries the same button, and below it the footer's legal
      // links: the floater steps aside instead of sitting on top of them
      fab.classList.toggle('is-quiet', quiet);
    }
    /* Observers, not getBoundingClientRect on every scroll: reading layout in a
       scroll handler forced a synchronous style and layout pass each frame,
       which made the home hero's scroll-driven video stutter on phones. */
    var io = 'IntersectionObserver' in window;
    if (hero && io) {
      new IntersectionObserver(function (en) {
        var r = en[0];
        past = !r.isIntersecting && r.boundingClientRect.top < 0;
        paint();
      }, { rootMargin: '-48px 0px 0px 0px' }).observe(hero);
    } else {
      var onScroll = function () {
        var p = (window.scrollY || 0) > 140;
        if (p !== past) { past = p; paint(); }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    if (end && io) {
      new IntersectionObserver(function (en) {
        var r = en[0];
        quiet = r.isIntersecting || r.boundingClientRect.top < 0;
        paint();
      }, { rootMargin: '0px 0px -40px 0px' }).observe(end);
    }
  }



  /* ---- The menus, rebuilt as HTML ----------------------------------------
     One renderer, several menus. A page holds panels, a panel holds one or more
     sections, and each menu carries its own visual style: dinner is the serif
     A5 spread, lunch is the bold condensed trifold. On a wide screen the panels
     sit side by side the way the print opens; under 900px each panel becomes its
     own page, because a two-up spread on a phone is unreadable. */
  function initMenuBook() {
    var book = document.getElementById('menuBook');
    var track = document.getElementById('mbTrack');
    if (!book || !track) return;

    var MENUS = {};
    document.querySelectorAll('script[id^="menuData-"]').forEach(function (el) {
      try { MENUS[el.id.replace('menuData-', '')] = JSON.parse(el.textContent); } catch (e) {}
    });
    if (!Object.keys(MENUS).length) return;

    var stage = document.getElementById('mbStage');
    var dotsEl = document.getElementById('mbDots');
    var titleEl = document.getElementById('mbTitle');
    var prev = document.getElementById('mbPrev');
    var next = document.getElementById('mbNext');
    var fullBtn = document.getElementById('mbFull');
    var flip = document.getElementById('flipbook');
    var langWrap = document.getElementById('menuLangs');
    var data = null, lang = 'en', page = 0, pages = [], spread = false;

    function esc(v) {
      return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }
    function t(obj) { return obj ? (obj[lang] || obj.en || '') : ''; }
    function sectionById(id) {
      for (var i = 0; i < data.sections.length; i++) if (data.sections[i].id === id) return data.sections[i];
      return null;
    }
    function legendLine() {
      return data.legend.map(function (l) { return '(' + l.code + ') ' + (l[lang] || l.en); }).join('&nbsp;&nbsp; ');
    }
    function footText(sec) {
      var f = sec.foot && (sec.foot[lang] || sec.foot.en);
      // a footer may hold two lines, each of them a keyword or plain text
      return String(f || '').split('\n').map(function (line) {
        if (line === 'legend') return legendLine();
        if (line === 'surcharge') return esc(t(data.surcharge)).replace(/\n/g, '<br>');
        return esc(line);
      }).join('<br>');
    }

    function itemHtml(it, sec) {
      var loc = it[lang] || it.en || {};
      var en = it.en || {};
      // The English name rides along on the local menus, so a waiter who cannot read
      // the script still knows which dish a guest is pointing at. Read the local
      // name off the language block itself rather than off loc, which falls back to
      // English: on the drinks list most rows are brands with no translation, and
      // the fallback printed every one of them twice.
      var localName = (it[lang] && it[lang].name) || '';
      var name = (lang === 'en' || !localName || localName === en.name)
        ? '<span class="mb-n">' + esc(en.name) + '</span>'
        : '<span class="mb-n" lang="' + lang + '">' + esc(localName) + '</span> <span class="mb-n-en">' + esc(en.name) + '</span>';
      if (loc.size || en.size) name += ' <span class="mb-size">' + esc(loc.size || en.size) + '</span>';
      // a wine's region rides beside the name in lighter type, the way it is printed
      var region = loc.region || en.region;
      if (region) name += ' <span class="mb-region">(' + esc(region) + ')</span>';
      var tags = (it.tags || []).join(', ');
      var note = it.tagNote && (it.tagNote[lang] || it.tagNote.en);
      // dietary marks and a note share one bracket, "(V, Vegan Option Available)"
      var inner = [tags, note].filter(Boolean).join(', ');
      var sup = (inner ? '<sup class="mb-tag' + (note ? ' mb-tag-note' : '') + '">(' + esc(inner) + ')</sup>' : '') +
                (it.origin ? '<sup class="mb-tag mb-tag-origin">(' + esc(it.origin) + ')</sup>' : '');

      var prices;
      if (sec.cols && sec.cols.length) {
        // one cell per column, blanks included, so every price lands under its own
        // heading even when a wine is sold by the bottle only. Fixed-width cells,
        // because each row is its own grid and could not otherwise line up with
        // the row above it.
        var vals = it.prices || [];
        prices = '<span class="mb-prices">' + sec.cols.map(function (c, i) {
          return '<span class="mb-price">' + esc(vals[i] || '') + '</span>';
        }).join('') + '</span>';
      } else if (sec.priceColumns === 2) {
        prices = '<span class="mb-price">' + esc(it.price || '') + '</span>' +
                 '<span class="mb-price mb-price2">' + esc(it.price2 || '') + '</span>';
      } else {
        prices = it.price ? '<span class="mb-price">' + esc(it.price) + '</span>' : '';
      }

      var out = '<li class="mb-item">' +
        '<p class="mb-row">' +
        (it.year ? '<span class="mb-year">' + esc(it.year) + '</span>' : '') +
        '<span class="mb-name">' + name + sup + '</span>' + prices + '</p>';
      if (loc.desc) out += '<p class="mb-desc">' + esc(loc.desc) + '</p>';
      if (it.choiceLabel) out += '<p class="mb-choice">' + esc(t(it.choiceLabel)) + '</p>';
      if (it.options && it.options.length) {
        out += '<p class="mb-opts">' + it.options.map(function (o) {
          return '<span class="mb-opt">' + esc(o[lang] || o.en) + '</span>';
        }).join('') + '</p>';
      }
      return out + '</li>';
    }

    // The drinks list prices some things three ways (small glass, large glass,
    // bottle) and labels the columns with icons rather than words, so the header
    // row is drawn from the section's own column list.
    // Without a viewBox of its own an <svg> wrapping a <use> has no intrinsic
    // aspect ratio, so width:auto resolves to the 300px default and the three
    // icons pile on top of each other. Each one carries its symbol's box.
    var ICON_BOX = { 'glass-s': '0 0 40 83', 'glass-l': '0 0 40 83', 'bottle': '0 0 37 132' };

    function colHeadHtml(sec) {
      if (!sec.cols || !sec.cols.some(function (c) { return c.icon || c.label; })) return '';
      return '<p class="mb-row mb-colicons">' + (sec.hasYear ? '<span></span>' : '') + '<span></span>' +
        '<span class="mb-prices">' + sec.cols.map(function (c) {
          return '<span class="mb-price">' + (c.icon && ICON_BOX[c.icon]
            ? '<svg class="mb-ico mb-ico-' + esc(c.icon) + '" viewBox="' + ICON_BOX[c.icon] + '" aria-hidden="true">' +
              '<use href="#wi-' + esc(c.icon) + '"></use></svg>'
            : esc(t(c.label))) + '</span>';
        }).join('') + '</span></p>';
    }

    // A group is a run of items under a shared label: printed as a rotated word
    // down the left edge ("ITALIAN", "TAP"), or as a right-aligned heading over a
    // rule for the cellar list's RED / WHITE split.
    function groupHtml(g, sec) {
      var items = '<ul class="mb-items">' +
        g.items.map(function (i) { return itemHtml(i, sec); }).join('') + '</ul>';
      // the note sits below the group's rule on the printed page, not beside it,
      // so it is a sibling of the item list rather than a child of it
      var note = g.note ? '<p class="mb-gnote">' + esc(t(g.note)) + '</p>' : '';
      if (g.style === 'head') {
        return '<div class="mb-group is-head">' +
          '<p class="mb-ghead">' + esc(t(g.label)) + '</p>' + items + note + '</div>';
      }
      return '<div class="mb-group is-side">' +
        '<span class="mb-glabel" aria-hidden="true"><i>' + esc(t(g.label)) + '</i></span>' +
        '<span class="mb-gbody">' + items + '</span>' + note + '</div>';
    }

    /* The focacce and maritozzi are sold off a board of photographs, so that menu
       is a grid of cards rather than a price list. Same data shape as every other
       section - the only additions are `img` on the item and `logo` on the
       section, and anything without them still renders as a list. */
    function tagWord(code) {
      var l = (data.legend || []).filter(function (x) { return x.code === code; })[0];
      return l ? (l[lang] || l.en) : code;
    }
    function cardHtml(it) {
      var loc = it[lang] || it.en || {};
      var en = it.en || {};
      // Focacce carry invented English names - Italian Stallion, Capri Breeze -
      // which are the product, not a description, so they are left alone in every
      // language. Maritozzi are named after the flavour, so those do translate.
      // Absent translations simply fall back, which is what makes both work.
      var localName = (it[lang] && it[lang].name) || '';
      var name = (lang === 'en' || !localName || localName === en.name)
        ? '<span class="mb-card-n">' + esc(en.name) + '</span>'
        : '<span class="mb-card-n" lang="' + lang + '">' + esc(localName) + '</span>' +
          '<span class="mb-card-n-en">' + esc(en.name) + '</span>';
      var tags = (it.tags || []).map(function (c) {
        return '<span class="mb-card-tag">' + esc(tagWord(c)) + '</span>';
      }).join('');
      return '<li class="mb-card">' +
        (it.img ? '<img class="mb-card-img" src="' + esc(it.img) + '" alt="" loading="lazy" decoding="async">' : '') +
        '<span class="mb-card-head">' + name + tags + '</span>' +
        '<span class="mb-card-desc">' + esc(loc.desc || en.desc || '') + '</span>' +
        '<span class="mb-card-price">$' + esc(it.price || '') + '</span>' +
      '</li>';
    }

    function sectionHtml(sec) {
      if (data.style === 'cards') {
        return '<div class="mb-sec mb-sec-cards">' +
          '<div class="mb-cat mb-cat-logo">' +
            (sec.logo
              ? '<img class="mb-cat-mark" src="' + esc(sec.logo) + '" alt="' + esc(sec.name.en) + '">'
              : '<span class="mb-cat-loc">' + esc(t(sec.name)) + '</span>') +
            (sec.aside ? '<span class="mb-aside">' + esc(t(sec.aside)) + '</span>' : '') +
          '</div>' +
          '<ul class="mb-cards">' + (sec.items || []).map(cardHtml).join('') + '</ul>' +
          (sec.foot ? '<p class="mb-foot">' + esc(t(sec.foot)) + '</p>' : '') +
        '</div>';
      }
      var head = '<h3 class="mb-cat">' +
        '<span class="mb-cat-loc">' + esc(t(sec.name)) + '</span>' +
        (lang !== 'en' ? ' <span class="mb-cat-en">' + esc(sec.name.en) + '</span>' : '') +
        (sec.aside ? '<span class="mb-aside">' + esc(t(sec.aside)) + '</span>' : '') +
        '</h3>';
      var heads = sec.priceColumns === 2 && sec.colHead
        ? '<p class="mb-colhead">' + esc(t(sec.colHead)) + '</p>' : '';

      var groups = sec.groups && sec.groups.length;
      // a year column shifts every row in the section, header included, so it is
      // decided once for the whole section rather than per item
      sec.hasYear = (groups
        ? sec.groups.some(function (g) { return (g.items || []).some(function (i) { return i.year; }); })
        : (sec.items || []).some(function (i) { return i.year; }));

      var body = groups
        ? sec.groups.map(function (g) { return groupHtml(g, sec); }).join('')
        : '<ul class="mb-items">' + (sec.items || []).map(function (i) { return itemHtml(i, sec); }).join('') + '</ul>';

      var cls = 'mb-sec' + (sec.priceColumns === 2 ? ' has-2p' : '') +
        (sec.cols && sec.cols.length ? ' has-cols cols-' + sec.cols.length : '') +
        (sec.hasYear ? ' has-year' : '');
      return '<div class="' + cls + '">' + head + heads + colHeadHtml(sec) + body +
        (sec.foot ? '<p class="mb-foot">' + footText(sec) + '</p>' : '') + '</div>';
    }

    // The fade and the "keep scrolling" hint live on .mb-panel, which never itself
    // scrolls; only the .mb-scroll wrapper inside it does. Two elements instead of
    // one: an absolutely-positioned child normally stays put against a fixed-size
    // overflow:auto ancestor, but that box is also the one whose own scroll
    // mechanics are firing constantly, and momentum/inertial scrolling on some
    // browsers can make a pinned child briefly lag with it. Giving the fade its
    // own, genuinely non-scrolling parent removes that class of bug outright
    // rather than hoping the first approach behaves everywhere.
    function panelWrap(extraClass, inner) {
      return '<section class="mb-panel' + (extraClass ? ' ' + extraClass : '') + '"><div class="mb-scroll">' + inner + '</div></section>';
    }

    function panelHtml(ids, foot) {
      var body = ids.map(function (id) {
        var sec = sectionById(id);
        return sec ? sectionHtml(sec) : '';
      }).join('');
      var f = '';
      if (foot === 'legend') f = '<p class="mb-foot mb-foot-panel">' + legendLine() + '</p>';
      else if (foot === 'surcharge') f = '<p class="mb-foot mb-foot-panel mb-foot-mid">' + esc(t(data.surcharge)).replace(/\n/g, '<br>') + '</p>';
      // the drinks list ends each panel with its own line rather than the shared
      // legend, so a foot may also be plain localised text
      else if (foot && typeof foot === 'object') f = '<p class="mb-foot mb-foot-panel">' + esc(t(foot)) + '</p>';
      return panelWrap('', body + f);
    }

    function coverHtml() {
      var inner =
        (data.cover.since ? '<span class="mb-since">' + esc(t(data.cover.since)) + '</span>' : '') +
        '<span class="mb-cover-mid">' +
          '<span class="mb-cover-title">' + esc(t(data.cover.title) || '') + '</span>' +
          (data.cover.script ? '<span class="mb-cover-script">' + esc(t(data.cover.script)) + '</span>' : '') +
        '</span>' +
        '<img class="mb-logo" src="assets/opt/logo-ink.webp" alt="Vitalia’s Restaurant Pizzeria">' +
        (data.cover.memory ? '<p class="mb-memory">' + esc(t(data.cover.memory)).replace(/\n/g, '<br>') + '</p>' : '');
      return panelWrap('mb-cover', inner);
    }
    function infoHtml() {
      var n = data.info;
      // address, phone, Instagram handle and the domain are identifiers, not
      // language, so they stay the same in every tab; place/days/hours read.
      var inner =
        '<img class="mb-logo" src="assets/opt/logo-ink.webp" alt="Vitalia’s Restaurant Pizzeria">' +
        '<p class="mb-info-place">' + esc(t(n.place)) + '</p>' +
        '<p class="mb-info-line">' + esc(n.address) + '</p>' +
        '<p class="mb-info-place mb-info-days">' + esc(t(n.days)) + '</p>' +
        n.hours.map(function (h) { return '<p class="mb-info-line">' + esc(t(h)) + '</p>'; }).join('') +
        '<p class="mb-info-line mb-info-gap">' + esc(n.phone) + '</p>' +
        '<p class="mb-info-line">' + esc(n.instagram) + '</p>' +
        '<p class="mb-info-site">' + esc(n.site) + '</p>';
      return panelWrap('mb-info', inner);
    }

    function buildPages() {
      spread = window.matchMedia('(min-width:900px)').matches;
      pages = [];
      data.pages.forEach(function (p) {
        // the printed cover is a logo and a dedication: on the web the dedication
        // sits above the book and the first page is the first dish
        if (p.type === 'cover') return;
        if (p.type) { pages.push([{ type: p.type }]); return; }
        if (spread) pages.push(p.panels.map(function (ids, k) { return { ids: ids, foot: p.foot && p.foot[k] }; }));
        else p.panels.forEach(function (ids, k) {
          // on a phone a column that stacks three sections is still one page:
          // splitting it would scatter Pasta, Salads and Mains across the book
          pages.push([{ ids: ids, foot: p.foot && p.foot[k] }]);
        });
      });
    }

    function render() {
      if (!data) return;
      buildPages();
      book.className = 'mbook reveal in style-' + (data.style || 'serif') + (book.classList.contains('is-full') ? ' is-full' : '');
      book.setAttribute('lang', lang);
      track.innerHTML = pages.map(function (panels) {
        return '<div class="mb-page' + (panels.length > 1 ? ' is-spread' : ' is-single') + '">' +
          panels.map(function (p) {
            return p.type === 'cover' ? coverHtml() : p.type === 'info' ? infoHtml() : panelHtml(p.ids, p.foot);
          }).join('') + '</div>';
      }).join('');
      dotsEl.innerHTML = pages.map(function (_, i) {
        return '<button type="button" class="mb-dot" role="tab" aria-label="Page ' + (i + 1) + '"></button>';
      }).join('');
      dotsEl.querySelectorAll('.mb-dot').forEach(function (d, i) {
        d.addEventListener('click', function () { go(i); });
      });
      requestAnimationFrame(function () {
        track.querySelectorAll('.mb-panel').forEach(function (p) {
          var s = p.querySelector('.mb-scroll');
          if (!s) return;
          var scrolls = s.scrollHeight > s.clientHeight + 2;
          p.classList.toggle('can-scroll', scrolls);
          // Only a panel that genuinely overflows gets the hint, and only once:
          // it is added here, never removed, so it cannot flicker back in if a
          // later resize briefly changes the measurement. It is a child of the
          // non-scrolling .mb-panel, not of .mb-scroll, so it is never carried
          // along by the content it is pointing at.
          if (scrolls && !p.querySelector('.mb-scroll-hint')) {
            var hint = document.createElement('span');
            hint.className = 'mb-scroll-hint';
            hint.setAttribute('aria-hidden', 'true');
            hint.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
            p.appendChild(hint);
          }
          s.addEventListener('scroll', function () {
            p.classList.toggle('can-scroll', s.scrollTop + s.clientHeight < s.scrollHeight - 2);
            // gone for good the moment real scrolling starts, so it never sits on
            // top of text the way a hint that keeps reappearing would
            if (s.scrollTop > 6) p.classList.add('has-scrolled');
          }, { passive: true });
        });
      });
      if (page >= pages.length) page = pages.length - 1;
      go(page, true);
    }

    function go(n, instant) {
      page = Math.max(0, Math.min(pages.length - 1, n));
      track.style.transition = instant ? 'none' : '';
      track.style.transform = 'translate3d(' + (-page * 100) + '%,0,0)';
      if (instant) { void track.offsetWidth; track.style.transition = ''; }
      track.querySelectorAll('.mb-page').forEach(function (p, i) {
        p.classList.toggle('is-on', i === page);
        p.setAttribute('aria-hidden', i === page ? 'false' : 'true');
      });
      dotsEl.querySelectorAll('.mb-dot').forEach(function (d, i) {
        d.classList.toggle('is-on', i === page);
        d.setAttribute('aria-selected', i === page ? 'true' : 'false');
      });
      prev.disabled = page === 0;
      next.disabled = page === pages.length - 1;
      var cnt = document.getElementById('mbCount');
      if (cnt) cnt.textContent = (page + 1) + ' / ' + pages.length;
    }

    prev.addEventListener('click', function () { go(page - 1); });
    next.addEventListener('click', function () { go(page + 1); });
    book.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(page - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(page + 1); }
      if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen();
    });

    var sx = 0, sy = 0, tracking = false;
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) go(page + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // The chrome around the book (which tab you are on, the title, the fullscreen
    // button, the hint underneath) is not part of any menu's data, so it needs its
    // own small dictionary rather than piggybacking on MENUS.
    var CHROME = {
      fullscreen: { en: 'Full screen', zh: '全屏', ja: '全画面表示' },
      close: { en: 'Close', zh: '关闭', ja: '閉じる' },
      hint: {
        en: 'Turn the page with the arrows, your keyboard or a swipe. Open it full screen to read it like the printed menu.',
        zh: '用箭头、键盘或滑动即可翻页。全屏打开，体验如同纸质菜单。',
        ja: '矢印、キーボード、またはスワイプでページをめくれます。全画面にすると、紙のメニューのように読めます。'
      }
    };
    CHROME.voice = { en: 'Dinner, lunch and drinks, in English, Japanese and Chinese.', zh: '晚餐、午餐和饮品，提供英文、日文和中文版本。', ja: 'ディナー、ランチ、ドリンクを英語・日本語・中国語で。' };
    CHROME.book = { en: 'Book a table', zh: '预订餐桌', ja: '席を予約する' };
    CHROME.order = { en: 'Order takeaway', zh: '外卖点餐', ja: 'テイクアウトを注文' };
    var activeTabBtn = null;
    var noteEl = document.getElementById('menuNote');
    var dedication = document.getElementById('mbDedication');
    function tabLabel(btn) { return btn.getAttribute('data-name-' + lang) || btn.getAttribute('data-name') || ''; }
    function translateChrome() {
      document.querySelectorAll('.menu-tab').forEach(function (btn) { btn.textContent = tabLabel(btn); });
      if (titleEl && activeTabBtn) titleEl.textContent = tabLabel(activeTabBtn);
      if (fullBtn) {
        var on = document.fullscreenElement === book;
        fullBtn.querySelector('span').textContent = (on ? CHROME.close : CHROME.fullscreen)[lang] || (on ? CHROME.close.en : CHROME.fullscreen.en);
      }
      if (noteEl) noteEl.textContent = CHROME.hint[lang] || CHROME.hint.en;
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var d = CHROME[el.getAttribute('data-i18n')];
        if (!d) return;
        el.textContent = d[lang] || d.en;
        if (lang === 'en') el.removeAttribute('lang'); else el.setAttribute('lang', lang);
      });
      // the dedication is the printed cover's own line, in the reader's language
      var mem = MENUS.dinner && MENUS.dinner.cover && MENUS.dinner.cover.memory;
      if (dedication && mem) {
        dedication.textContent = String(mem[lang] || mem.en).replace(/\s*\n\s*/g, lang === 'en' ? ' ' : '');
        if (lang === 'en') dedication.removeAttribute('lang'); else dedication.setAttribute('lang', lang);
      }
      document.querySelectorAll('.menu-lang').forEach(function (b) {
        var on = b.getAttribute('data-lang') === lang;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    if (fullBtn) {
      fullBtn.addEventListener('click', function () {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (book.requestFullscreen) book.requestFullscreen().catch(function () {});
      });
      document.addEventListener('fullscreenchange', function () {
        var on = document.fullscreenElement === book;
        book.classList.toggle('is-full', on);
        translateChrome();
        render();
      });
    }

    document.querySelectorAll('.menu-lang').forEach(function (b) {
      b.addEventListener('click', function () {
        lang = b.getAttribute('data-lang') || 'en';
        translateChrome();
        render();
      });
    });

    var activeKey = null;
    function pickTab(btn) {
      var key = btn.getAttribute('data-json');
      var coming = btn.getAttribute('data-coming');
      document.querySelectorAll('.menu-tab').forEach(function (t) { t.classList.toggle('active', t === btn); });
      book.hidden = !key;
      if (flip) flip.hidden = !!key || !!coming;
      if (langWrap) langWrap.classList.toggle('single', !key);
      activeTabBtn = btn;
      translateChrome();
      if (!key) return;
      activeKey = key;
      data = MENUS[key];
      page = 0;
      render();
    }
    document.querySelectorAll('.menu-tab').forEach(function (btn) {
      btn.addEventListener('click', function () { pickTab(btn); });
    });

    var wasSpread = window.matchMedia('(min-width:900px)').matches;
    window.addEventListener('resize', function () {
      var now = window.matchMedia('(min-width:900px)').matches;
      if (now !== wasSpread) { wasSpread = now; render(); }
    });

    // ?lang=ja / ?lang=zh (the QR codes on the outdoor boards) opens the book in that language
    var askedLang = (location.search.match(/[?&]lang=(en|ja|zh)\b/) || [])[1];
    if (askedLang) {
      lang = askedLang;
      document.querySelectorAll('.menu-lang').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-lang') === lang); });
    }
    pickTab(document.querySelector('.menu-tab[data-json]') || document.querySelector('.menu-tab'));
    // land on the language and menu chips, just under the sticky header, with the book below
    if (askedLang) setTimeout(function () {
      var target = langWrap || book, nav = document.querySelector('.nav, header');
      var off = (nav ? nav.getBoundingClientRect().height : 0) + 12;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - off, behavior: 'smooth' });
    }, 400);

    // The page ships with the menu already baked in, so it is never blank; this
    // only overwrites it if the backoffice has published something since the last
    // build. A menu with no sections (nothing saved yet) is left alone.
    Object.keys(MENUS).forEach(function (key) {
      fetch('/.netlify/functions/menu?id=' + key)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (fresh) {
          if (!fresh || !fresh.sections || !fresh.sections.length) return;
          MENUS[key] = fresh;
          if (activeKey === key) { data = fresh; page = 0; render(); }
        })
        .catch(function () {});
    });
  }

  /* ---- Pageview counter: one silent beacon per load, nothing stored locally ----
     No cookie, no localStorage, so there is nothing here for a repeat visitor to
     carry between visits and nothing a "reject cookies" banner needs to gate. The
     backoffice itself is excluded - the owner checking the dashboard should never
     inflate the traffic the dashboard is showing them. */
  function trackPageview() {
    var page = location.pathname.split('/').pop() || '';
    if (page === 'tony.html') return;
    var payload = JSON.stringify({
      page: location.pathname,
      ref: document.referrer || '',
      mobile: matchMedia('(max-width:700px)').matches
    });
    var url = '/.netlify/functions/track';
    if (navigator.sendBeacon) {
      try { navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' })); return; } catch (e) {}
    }
    fetch(url, { method: 'POST', body: payload, keepalive: true }).catch(function () {});
  }

  function init() {
    setYear(); markActive(); initReveal(); initNavScroll(); initVouchers(); initBook3d(); initBookFab(); initMenuBook();
    initResvBar(); initHero(); initMagnetic(); initMenus(); initMiniTruck(); initFileInputs(); initRevealCards(); initPizzaSlideshow(); initDishesShowcase(); initApplyFlow(); initPositions(); initReviewsCarousel(); initCertField(); initLanguages(); initEventForm(); initMenuTabs(); initFnFab(); initThankYou(); initHiringBadge(); initGoogleReviews(); trackPageview();
    // Settings first: the counter animates whatever number ends up on the page.
    initFnSettings().then(initCountUp);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
