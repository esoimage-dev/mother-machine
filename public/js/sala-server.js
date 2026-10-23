/* Sala server: "the machine room, live". Four racks, packets with trails, a log that types.
   window.SALA_SERVER.mount(el) -> { start, stop }. One rAF loop, no timers. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var TOM = '#FF5B3A';
  var uid = 0;

  function S(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function D(tag, cls, parent, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    if (parent) parent.appendChild(n);
    return n;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hms(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }
  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function money(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function f1(n) { return n.toFixed(1); }
  function fit(t, maxW, min) {
    var fs = parseFloat(t.getAttribute('font-size'));
    try {
      while (t.getComputedTextLength() > maxW && fs > min) { fs -= 0.5; t.setAttribute('font-size', fs); }
    } catch (e) {}
  }
  function perms(n) {
    var out = [], a = [];
    for (var i = 0; i < n; i++) a.push(i);
    (function rec(k) {
      if (k === n) { out.push(a.slice()); return; }
      for (var i = k; i < n; i++) {
        var t = a[k]; a[k] = a[i]; a[i] = t; rec(k + 1); t = a[k]; a[k] = a[i]; a[i] = t;
      }
    })(0);
    return out;
  }
  var PERM5 = null, PERM6 = null;

  /* ---------- what runs where ---------- */
  /* units, top to bottom: [kind, U, label, priority]. Lower priority stays when space is short. */
  var RACKS = [
    { id: 'R01', name: 'Bookings', sub: 'and payments', meter: 'bar',
      units: [['meter', 4, '', 0], ['srv', 1, 'WEB-1', 0], ['srv', 1, 'WEB-2', 1], ['sw', 1, 'SW-01', 1], ['srv', 1, 'PAY-1', 0],
        ['srv', 1, 'PAY-2', 2], ['fan', 2, '', 1], ['disk', 2, 'LEDGER', 2], ['srv', 1, 'QUEUE', 3], ['psu', 1, 'PSU', 0]] },
    { id: 'R02', name: 'Back office', sub: 'orders, stock', meter: 'eq',
      units: [['meter', 4, '', 0], ['srv', 1, 'APP-1', 0], ['srv', 1, 'APP-2', 1], ['disk', 2, 'DB', 0], ['sw', 1, 'SW-02', 1],
        ['disk', 2, 'FILES', 2], ['fan', 2, '', 1], ['srv', 1, 'STOCK', 2], ['psu', 1, 'PSU', 0]] },
    { id: 'R03', name: 'Automations', sub: 'night shift', meter: 'wave',
      units: [['meter', 4, '', 0], ['srv', 1, 'CRON', 0], ['srv', 1, 'MAIL', 1], ['fan', 2, '', 1], ['srv', 1, 'BACKUP', 0],
        ['disk', 2, 'ARCHIVE', 1], ['sw', 1, 'SW-03', 2], ['srv', 1, 'REPORT', 3], ['psu', 1, 'PSU', 0]] },
    { id: 'R04', name: 'Private AI', sub: 'stays inside', meter: 'cells',
      units: [['meter', 4, '', 0], ['fan', 2, '', 0], ['srv', 1, 'GPU-1', 0], ['srv', 1, 'GPU-2', 1], ['disk', 2, 'VECTOR', 1],
        ['fan', 2, '', 2], ['sw', 1, 'SW-04', 2], ['psu', 1, 'PSU', 0]] }
  ];
  var SRC = { S: 'Stripe', W: 'Website', E: 'Email' };
  var OUT = { K: 'Kitchen screen', D: 'Dashboard', P: 'Your phone' };
  var IN_ROUTES = [['W', 0], ['S', 0], ['W', 1], ['E', 2], ['E', 3]];
  var OUT_ROUTES = [[0, 'K'], [0, 'D'], [1, 'D'], [2, 'D'], [2, 'P'], [3, 'P']];

  var NAMES = ['sarah', 'tom', 'mia', 'luca', 'priya', 'jack', 'ana', 'noah'];
  var ITEMS = ['margherita', 'diavola', 'calzone', 'tiramisu', 'focaccia'];
  var DAYS = ['fri', 'sat', 'sun', 'thu'];
  var ASK = [
    ["'how many bookings friday?'", '-> 23'],
    ["'best seller this week?'", '-> diavola'],
    ["'who still owes us?'", '-> 2 clients'],
    ["'quietest day next week?'", '-> tuesday'],
    ["'draft a reply to tom'", '-> done'],
    ["'catering margin in june?'", '-> 41%']
  ];
  /* what the night shift did, at fixed times */
  var NIGHT = [
    { m: 'backup done', v: '2.1 GB', at: [2, 0], out: 'D' },
    { m: '12 invoices sent', v: 'paid: 9', at: [3, 0], out: 'P' },
    { m: 'stock reordered', v: '3 suppliers', at: [4, 30], out: 'D' },
    { m: 'morning report', v: 'on your phone', at: [6, 30], out: 'P' }
  ];

  function mount(el) {
    var reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    var cid = 'ssv' + (++uid);
    el.classList.add('ssv');
    el.innerHTML = '';

    /* ---------- DOM shell ---------- */
    var top = D('div', 'ssv-top', el);
    var hl = D('div', 'ssv-hl', top);
    var tag = D('div', 'ssv-tag', hl);
    D('span', 'ssv-dot', tag);
    D('span', '', tag, 'Live');
    D('span', 'ssv-mut', tag, '/ Machine room');
    D('p', 'ssv-lede', hl, 'Four racks. No one on shift. It runs anyway.');
    var hr = D('div', 'ssv-hr', top);
    var clock = D('div', 'ssv-clock', hr);
    var cHM = D('span', '', clock, '');
    var cS = D('span', 'ssv-sec', clock, '');
    var dateEl = D('div', 'ssv-date', hr, '');
    var dia = D('div', 'ssv-dia', el);
    var svg = S('svg', { 'aria-hidden': 'true', focusable: 'false' }, null);
    dia.appendChild(svg);
    var log = D('div', 'ssv-log', el);
    var logh = D('div', 'ssv-logh', log);
    D('span', '', logh, 'Log');
    var countEl = D('span', '', logh, '');
    var lines = D('div', 'ssv-lines', log);
    lines.setAttribute('aria-live', 'off');

    /* ---------- state ---------- */
    var now0 = new Date();
    var secToday = now0.getHours() * 3600 + now0.getMinutes() * 60 + now0.getSeconds();
    var st = {
      events: 140 + Math.floor(secToday / 37),
      order: 1482, invoice: 318,
      takings: 1200 + Math.floor(secToday / 30) * 1.5,
      jobs: 14, answers: 9 + Math.floor(secToday / 2400)
    };
    var racks = [], boxes = {}, inR = {}, outR = {}, pool = [], pending = [], leds = [];
    var vertical = false, raf = 0, running = false, t = 0, lastTs = 0, nextLog = 0.6, nextAmb = 0.3;
    var typing = null, lastSec = -1, speed = 160;

    function setCount() { countEl.textContent = st.events.toLocaleString('en-US') + ' events today'; }
    setCount();
    function setClock(d) {
      cHM.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes());
      cS.textContent = ':' + pad(d.getSeconds());
      var ds = '';
      try { ds = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) {}
      ds = ds.replace(',', '') + ', your time';
      if (dateEl.textContent !== ds) dateEl.textContent = ds;
    }
    setClock(now0);

    /* ---------- layout ---------- */
    function layout() {
      var vw = el.clientWidth, vh = el.clientHeight;
      if (!vw) return;
      el.classList.toggle('ssv--short', vh > 0 && vh < 600);
      vertical = false;
      el.classList.remove('ssv--v');
      var wH = dia.clientWidth;
      var need = Math.ceil(7 * 10.5 * 0.64) + 32 + Math.ceil(14 * 10.5 * 0.64) + 32 + (IN_ROUTES.length + OUT_ROUTES.length) * 6 + 60 + 54;
      if ((wH - need) / 4 < 92 || vw < 560) { vertical = true; el.classList.add('ssv--v'); }
      var W = Math.round(dia.clientWidth), H = Math.round(dia.clientHeight);
      if (W < 40 || H < 60) return;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.setAttribute('width', W);
      svg.setAttribute('height', H);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      racks = []; boxes = {}; inR = {}; outR = {}; pool = []; pending = []; leds = [];
      speed = vertical ? 125 : 175;

      var gap = vertical ? 4.5 : 6;
      var boxH = vertical ? 22 : 28;
      var bfs = vertical ? 9.5 : 10.5;
      var nIn = IN_ROUTES.length, nOut = OUT_ROUTES.length;
      var gWire = S('g', { 'class': 'ssv-wires' }, svg);
      var gNodes = S('g', {}, svg);
      var gRacks = S('g', {}, svg);
      var gPk = S('g', {}, svg);

      var srcOrder, outOrder, rackTop, rackBot, rackL, rackR, rw, rg;
      function bw(label) { return Math.ceil(label.length * bfs * 0.64) + (vertical ? 26 : 34); }
      var bwSrc = Math.max(bw('Website'), bw('Stripe'), bw('Email'));
      var bwOut = Math.max(bw('Kitchen screen'), bw('Dashboard'), bw('Your phone'));
      var m = vertical ? 10 : 14;

      if (!vertical) {
        srcOrder = ['E', 'W', 'S']; outOrder = ['P', 'D', 'K'];
        rackL = bwSrc + nIn * gap + 30;
        rackR = W - bwOut - nOut * gap - 30;
        rg = 16;
        rackTop = 4 + (nIn - 1) * gap + m;
        rackBot = H - 4 - (nOut - 1) * gap - m;
      } else {
        srcOrder = ['S', 'W', 'E']; outOrder = ['K', 'D', 'P'];
        rackL = 0; rackR = W; rg = 7;
        rackTop = boxH + m + (nIn - 1) * gap + m;
        rackBot = H - boxH - m - (nOut - 1) * gap - m;
      }
      rw = (rackR - rackL - 3 * rg) / 4;
      var rh = rackBot - rackTop;

      /* boxes */
      function makeBox(key, label, x, y, w, side) {
        var g = S('g', {}, gNodes);
        S('rect', { x: x + 0.5, y: y + 0.5, width: w - 1, height: boxH - 1, 'class': 'ssv-box' }, g);
        var ls = vertical ? 4 : 5;
        var lx = x + (vertical ? 8 : 11), ly = y + (boxH - ls) / 2;
        S('rect', { x: lx, y: ly, width: ls, height: ls, 'class': 'ssv-ledb' }, g);
        var led = S('rect', { x: lx, y: ly, width: ls, height: ls, fill: TOM, opacity: 0 }, g);
        var tx = S('text', { x: lx + ls + (vertical ? 6 : 8), y: y + boxH / 2 + bfs * 0.36, 'font-size': bfs, 'class': 'ssv-k' }, g);
        tx.textContent = label;
        fit(tx, w - (lx - x) - ls - 12, 7);
        boxes[key] = { x: x, y: y, w: w, h: boxH, led: led, until: 0, on: false, side: side };
      }
      var step = boxH + 18, mid = (rackTop + rackBot) / 2;
      if (!vertical) {
        srcOrder.forEach(function (k, i) { makeBox(k, SRC[k], 0, mid + (i - 1) * step - boxH / 2, bwSrc, 'src'); });
        outOrder.forEach(function (k, i) { makeBox(k, OUT[k], W - bwOut, mid + (i - 1) * step - boxH / 2, bwOut, 'out'); });
        var ly0 = mid - step - boxH / 2 - 10;
        S('text', { x: 0, y: ly0, 'font-size': 8.5, 'class': 'ssv-k ssv-cap' }, gNodes).textContent = 'IN';
        S('text', { x: W, y: ly0, 'font-size': 8.5, 'text-anchor': 'end', 'class': 'ssv-k ssv-cap' }, gNodes).textContent = 'OUT';
      } else {
        var cw = W / 3;
        srcOrder.forEach(function (k, i) { var w = Math.min(cw - 8, bwSrc); makeBox(k, SRC[k], cw * (i + 0.5) - w / 2, 0, w, 'src'); });
        outOrder.forEach(function (k, i) { var w = Math.min(cw - 6, bwOut); makeBox(k, OUT[k], cw * (i + 0.5) - w / 2, H - boxH, w, 'out'); });
      }

      /* racks */
      for (var i = 0; i < 4; i++) racks.push(buildRack(gRacks, i, rackL + i * (rw + rg), rackTop, rw, rh));

      /* wires: try every tray order, keep the one with fewest crossings */
      function rackPorts(list, rankOf, dir, rack) {
        var mine = list.filter(function (r) { return r.rack === rack; });
        mine.sort(function (a, b) { return dir * (rankOf[a.i] - rankOf[b.i]); });
        var k = mine.length, sp = Math.min(12, rw / (k + 1)), res = {};
        mine.forEach(function (r, j) { res[r.i] = racks[rack].x + rw / 2 + (j - (k - 1) / 2) * sp; });
        return res;
      }
      function boxPorts(list, rankOf, dir, key) {
        var mine = list.filter(function (r) { return r.box === key; });
        mine.sort(function (a, b) { return dir * (rankOf[a.i] - rankOf[b.i]); });
        var k = mine.length, res = {};
        mine.forEach(function (r, j) { res[r.i] = (j - (k - 1) / 2) * gap; });
        return res;
      }
      var inList = IN_ROUTES.map(function (r, i) { return { i: i, box: r[0], rack: r[1] }; });
      var outList = OUT_ROUTES.map(function (r, i) { return { i: i, box: r[1], rack: r[0] }; });

      function inPaths(rankOf, f) {
        var rp = {}, bp = {}, res = [];
        for (var r = 0; r < 4; r++) { var o = rackPorts(inList, rankOf, f[0], r); for (var k in o) rp[k] = o[k]; }
        for (var key in SRC) { var o2 = boxPorts(inList, rankOf, f[1], key); for (var k2 in o2) bp[k2] = o2[k2]; }
        inList.forEach(function (L) {
          var b = boxes[L.box], rank = rankOf[L.i], px = rp[L.i], pts;
          if (!vertical) {
            var ty = rackTop - m - (nIn - 1 - rank) * gap;
            var idx = f[2] > 0 ? rank : nIn - 1 - rank;
            var bx = bwSrc + 14 + idx * gap;
            var sy = b.y + b.h / 2 + bp[L.i];
            pts = [[b.x + b.w, sy], [bx, sy], [bx, ty], [px, ty], [px, rackTop]];
          } else {
            var ty2 = boxH + m + rank * gap;
            var sx = b.x + b.w / 2 + bp[L.i];
            pts = [[sx, b.y + b.h], [sx, ty2], [px, ty2], [px, rackTop]];
          }
          res[L.i] = pts;
        });
        return res;
      }
      function outPaths(rankOf, f) {
        var rp = {}, bp = {}, res = [];
        for (var r = 0; r < 4; r++) { var o = rackPorts(outList, rankOf, f[0], r); for (var k in o) rp[k] = o[k]; }
        for (var key in OUT) { var o2 = boxPorts(outList, rankOf, f[1], key); for (var k2 in o2) bp[k2] = o2[k2]; }
        outList.forEach(function (L) {
          var b = boxes[L.box], rank = rankOf[L.i], px = rp[L.i], pts;
          if (!vertical) {
            var ty = rackBot + m + rank * gap;
            var idx = f[2] > 0 ? rank : nOut - 1 - rank;
            var bx = rackR + 16 + idx * gap;
            var oy = b.y + b.h / 2 + bp[L.i];
            pts = [[px, rackBot], [px, ty], [bx, ty], [bx, oy], [b.x, oy]];
          } else {
            var ty2 = rackBot + m + rank * gap;
            var ox = b.x + b.w / 2 + bp[L.i];
            pts = [[px, rackBot], [px, ty2], [ox, ty2], [ox, b.y]];
          }
          res[L.i] = pts;
        });
        return res;
      }
      function segs(pts) {
        var s = [];
        for (var i = 0; i < pts.length - 1; i++) {
          var a = pts[i], b = pts[i + 1];
          if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) < 0.01) continue;
          if (Math.abs(a[0] - b[0]) < 0.01) s.push({ v: 1, c: a[0], lo: Math.min(a[1], b[1]), hi: Math.max(a[1], b[1]) });
          else s.push({ v: 0, c: a[1], lo: Math.min(a[0], b[0]), hi: Math.max(a[0], b[0]) });
        }
        return s;
      }
      function score(paths) {
        var all = paths.map(segs), n = 0, len = 0;
        for (var i = 0; i < all.length; i++) {
          for (var a = 0; a < all[i].length; a++) len += all[i][a].hi - all[i][a].lo;
          for (var j = i + 1; j < all.length; j++) {
            for (a = 0; a < all[i].length; a++) for (var b = 0; b < all[j].length; b++) {
              var s = all[i][a], u = all[j][b];
              if (s.v !== u.v) {
                var h = s.v ? u : s, v = s.v ? s : u;
                if (v.c > h.lo + 0.5 && v.c < h.hi - 0.5 && h.c > v.lo + 0.5 && h.c < v.hi - 0.5) n += 1;
              } else if (Math.abs(s.c - u.c) < 2 && Math.min(s.hi, u.hi) - Math.max(s.lo, u.lo) > 1) n += 3;
            }
          }
        }
        return n * 100000 + len;
      }
      function best(fn, P) {
        var bestS = Infinity, bestP = null;
        for (var f0 = -1; f0 <= 1; f0 += 2) for (var f1 = -1; f1 <= 1; f1 += 2) for (var f2 = -1; f2 <= 1; f2 += 2) {
          if (vertical && f2 < 0) continue;
          for (var p = 0; p < P.length; p++) {
            var paths = fn(P[p], [f0, f1, f2]), sc = score(paths);
            if (sc < bestS) { bestS = sc; bestP = paths; }
          }
        }
        return bestP;
      }
      if (!PERM5) { PERM5 = perms(nIn); PERM6 = perms(nOut); }
      var ip = best(inPaths, PERM5), op = best(outPaths, PERM6);

      function wire(pts, key, store) {
        var d = 'M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L');
        S('path', { d: d, 'class': 'ssv-wire' }, gWire);
        var cum = [0];
        for (var i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]));
        store[key] = { pts: pts, cum: cum, len: cum[cum.length - 1] };
        return pts[pts.length - 1];
      }
      inList.forEach(function (L) {
        var e = wire(ip[L.i], L.box + '>' + L.rack, inR);
        S('rect', { x: e[0] - 1.5, y: e[1] - 3, width: 3, height: 3, 'class': 'ssv-pin' }, gWire);
      });
      outList.forEach(function (L) {
        wire(op[L.i], L.rack + '>' + L.box, outR);
        var s = op[L.i][0];
        S('rect', { x: s[0] - 1.5, y: s[1], width: 3, height: 3, 'class': 'ssv-pin' }, gWire);
      });

      /* packet pool: a head and a short trail */
      var ps = vertical ? 4 : 5;
      for (var p = 0; p < 24; p++) {
        var tr = S('path', { d: 'M0 0', 'class': 'ssv-trail', opacity: 0 }, gPk);
        var hd = S('rect', { x: -ps / 2, y: -ps / 2, width: ps, height: ps, fill: TOM, opacity: 0 }, gPk);
        pool.push({ el: hd, tr: tr, alive: false, route: null, d: 0, cb: null, op: 1 });
      }

      if (reduce) stillFrame(); else renderFrame(0);
    }

    /* ---------- one rack ---------- */
    function buildRack(g0, i, x, y, w, h) {
      var spec = RACKS[i], v = vertical;
      var g = S('g', {}, g0);
      var R = { i: i, x: x, y: y, w: w, h: h, act: 0, level: 0.3, glow: 0, gq: -1, cells: [], bars: [], fans: [], loads: [], fanA: hash(i) * 90, fanV: 40 };
      var foot = v ? 4 : 6, bodyH = h - foot;
      /* feet */
      var fw = v ? 8 : 12;
      S('path', { d: 'M' + (x + 4) + ' ' + (y + bodyH) + 'h' + fw + 'v' + foot + 'h' + (-fw) + 'z' + 'M' + (x + w - 4 - fw) + ' ' + (y + bodyH) + 'h' + fw + 'v' + foot + 'h' + (-fw) + 'z', 'class': 'ssv-foot' }, g);
      S('rect', { x: x + 0.5, y: y + 0.5, width: w - 1, height: bodyH - 1, 'class': 'ssv-rack' }, g);
      R.wash = S('rect', { x: x + 1, y: y + 1, width: w - 2, height: bodyH - 2, 'class': 'ssv-wash', opacity: 0 }, g);

      /* name plate */
      var hp = v ? 40 : 50, px = x + (v ? 6 : 10);
      var id = S('text', { x: px, y: y + (v ? 12 : 16), 'font-size': v ? 8 : 9.5, 'class': 'ssv-k ssv-id' }, g);
      id.textContent = spec.id;
      var pw = v ? 3 : 4;
      S('rect', { x: x + w - (v ? 6 : 10) - pw, y: y + (v ? 7 : 10), width: pw, height: pw, 'class': 'ssv-pwr' }, g);
      var nm = S('text', { x: px, y: y + (v ? 25 : 32), 'font-size': v ? 10 : 12.5, 'class': 'ssv-n' }, g);
      nm.textContent = spec.name;
      fit(nm, w - (v ? 10 : 18), 7.5);
      var sb = S('text', { x: px, y: y + (v ? 34 : 43), 'font-size': v ? 7 : 8.5, 'class': 'ssv-k ssv-sub' }, g);
      sb.textContent = spec.sub;
      fit(sb, w - (v ? 10 : 18), 6);
      S('path', { d: 'M' + (x + 1) + ' ' + (y + hp + 0.5) + 'H' + (x + w - 1), 'class': 'ssv-div' }, g);

      /* rails with U ticks */
      var a0 = y + hp + (v ? 3 : 5), a1 = y + bodyH - (v ? 3 : 5);
      var rail = v ? 4 : 7, ux = x + rail + (v ? 1.5 : 2), uw = w - 2 * (rail + (v ? 1.5 : 2));
      var targetU = v ? 13 : 16;
      var N = Math.max(8, Math.floor((a1 - a0) / targetU));
      var U = (a1 - a0) / N;
      var dR = 'M' + (x + rail + 0.5) + ' ' + a0 + 'V' + a1 + 'M' + (x + w - rail - 0.5) + ' ' + a0 + 'V' + a1;
      for (var q = 0; q <= N; q++) {
        var ty = Math.round(a0 + q * U) + 0.5;
        dR += 'M' + (x + 1) + ' ' + ty + 'h' + (rail - (v ? 1.5 : 2.5)) + 'M' + (x + w - 1) + ' ' + ty + 'h' + (-(rail - (v ? 1.5 : 2.5)));
      }
      S('path', { d: dR, 'class': 'ssv-rail' }, g);

      /* pick units to fill exactly N slots */
      var list = spec.units.slice(), used = 0, k;
      list.forEach(function (u) { used += u[1]; });
      for (var pr = 3; pr >= 1 && used > N; pr--) {
        for (k = list.length - 1; k >= 0 && used > N; k--) if (list[k][3] === pr) { used -= list[k][1]; list.splice(k, 1); }
      }
      var spare = N - used, fillers = [], nn = 1;
      while (spare > 0) {
        if (spare >= 3 && fillers.length % 2 === 1) { fillers.push(['srv', 1, 'NODE-' + (nn++), 9]); spare--; }
        else { fillers.push(['blank', 1, '', 9]); spare--; }
      }
      /* fillers go between the units, spread out, psu stays last */
      var last = list.pop(), slots = list.length - 1;
      fillers.forEach(function (f, j) { var at = 1 + Math.round((j + 1) * slots / (fillers.length + 1)) + j; list.splice(Math.min(at, list.length), 0, f); });
      list.push(last);

      var dU = '', dV = '', dB = '', dP = '';
      var gl = S('g', {}, g);
      var labels = !v && uw >= 88;
      var slot = 0;
      list.forEach(function (u, ui) {
        var uy = a0 + slot * U + 1, uh = u[1] * U - 2;
        slot += u[1];
        dU += 'M' + (ux + 0.5) + ' ' + (uy + 0.5) + 'h' + (uw - 1) + 'v' + (uh - 1) + 'h' + (-(uw - 1)) + 'z';
        var kind = u[0], seed = i * 1000 + ui * 37;
        var lsz = v ? 2.5 : 3, cy = uy + uh / 2;
        if (kind === 'srv') {
          var lx = ux + (v ? 3.5 : 5), ly = cy - lsz / 2;
          for (var q2 = 0; q2 < 2; q2++) {
            var lxx = lx + q2 * (lsz + 2.5);
            dB += 'M' + lxx + ' ' + ly + 'h' + lsz + 'v' + lsz + 'h' + (-lsz) + 'z';
            addLed(gl, lxx, ly, lsz, R, q2 === 0 ? 'beat' : 'act', seed + q2);
          }
          var cx0 = lx + 2 * lsz + 2.5 + (v ? 4 : 6);
          var nv = v ? 3 : 4, vx = ux + uw - (v ? 4 : 6);
          for (var k2 = 0; k2 < nv; k2++) dV += 'M' + (vx - k2 * 2.5 + 0.5) + ' ' + (uy + 2.5) + 'v' + (uh - 5);
          var barR = vx - (nv - 1) * 2.5 - (v ? 4 : 6);
          if (labels) {
            var lt = S('text', { x: cx0, y: cy + 2.3, 'font-size': 6.5, 'class': 'ssv-k ssv-ul' }, g);
            lt.textContent = u[2];
            cx0 += 34;
          }
          var bwid = Math.min(v ? 30 : 34, barR - cx0);
          if (bwid > 8) {
            var bx = barR - bwid, bh = v ? 2 : 3;
            dP += 'M' + (bx + 0.5) + ' ' + (cy - bh / 2 - 1 + 0.5) + 'h' + (bwid - 1) + 'v' + (bh + 1) + 'h' + (-(bwid - 1)) + 'z';
            var lb = S('rect', { x: 0, y: 0, width: bwid - 2, height: bh - 1 + 0.5, 'class': 'ssv-fill' }, g);
            R.loads.push({ el: lb, x: bx + 1, y: cy - bh / 2 + 0.25, ph: hash(seed) * 6, f: 1.2 + hash(seed + 3) * 1.8, s: -1 });
          }
        } else if (kind === 'disk') {
          var bayW = v ? 9 : 12, bg = v ? 2 : 2.5, lab = labels ? 34 : 0;
          var inner = uw - (v ? 6 : 10) - lab;
          var cols = Math.max(2, Math.floor((inner + bg) / (bayW + bg)));
          bayW = (inner - (cols - 1) * bg) / cols;
          var bh2 = (uh - (v ? 5 : 6) - bg) / 2, bx0 = ux + (v ? 3 : 5) + lab, by0 = uy + (v ? 2.5 : 3);
          if (labels) { var dl = S('text', { x: ux + 5, y: cy + 2.3, 'font-size': 6.5, 'class': 'ssv-k ssv-ul' }, g); dl.textContent = u[2]; }
          for (var r2 = 0; r2 < 2; r2++) for (var c2 = 0; c2 < cols; c2++) {
            var bxx = bx0 + c2 * (bayW + bg), byy = by0 + r2 * (bh2 + bg);
            dV += 'M' + (bxx + 0.5) + ' ' + (byy + 0.5) + 'h' + (bayW - 1) + 'v' + (bh2 - 1) + 'h' + (-(bayW - 1)) + 'z';
            var ds = v ? 1.5 : 2;
            var dlx = bxx + bayW - ds - (v ? 1.5 : 2), dly = byy + (bh2 - ds) / 2;
            dP += 'M' + (bxx + (v ? 1.5 : 2.5)) + ' ' + (byy + bh2 / 2 + 0.5) + 'h' + Math.max(1, bayW - ds - (v ? 5 : 7));
            addLed(gl, dlx, dly, ds, R, 'act', seed + r2 * 50 + c2);
          }
        } else if (kind === 'fan') {
          var rr = uh / 2 - (v ? 2 : 2.5);
          var nf = Math.max(1, Math.min(4, Math.floor((uw - 4) / (2 * rr + (v ? 5 : 8)))));
          var spc = uw / nf;
          for (var fI = 0; fI < nf; fI++) {
            var fcx = ux + spc * (fI + 0.5), fcy = cy;
            S('circle', { cx: f1(fcx), cy: f1(fcy), r: f1(rr), 'class': 'ssv-fanr' }, g);
            var fg = S('g', {}, g);
            var bd = '', nb = 5;
            for (var bI = 0; bI < nb; bI++) {
              var an = bI * Math.PI * 2 / nb, a2 = an + 0.9;
              var r0 = rr * 0.28, r1 = rr * 0.86;
              bd += 'M' + f1(r0 * Math.cos(an)) + ' ' + f1(r0 * Math.sin(an)) +
                'Q' + f1(r1 * 0.75 * Math.cos(an + 0.15)) + ' ' + f1(r1 * 0.75 * Math.sin(an + 0.15)) + ' ' + f1(r1 * Math.cos(a2)) + ' ' + f1(r1 * Math.sin(a2));
            }
            S('path', { d: bd, 'class': 'ssv-blade' }, fg);
            S('circle', { cx: 0, cy: 0, r: f1(rr * 0.24), 'class': 'ssv-hub' }, fg);
            S('circle', { cx: f1(fcx), cy: f1(fcy), r: f1(rr * 0.6), 'class': 'ssv-grill' }, g);
            R.fans.push({ el: fg, x: f1(fcx), y: f1(fcy), dir: fI % 2 ? -1 : 1 });
          }
        } else if (kind === 'sw') {
          var psz = v ? 2.5 : 3, pg = v ? 2 : 2.5, pl = labels ? 34 : 0;
          if (labels) { var sl = S('text', { x: ux + 5, y: cy + 2.3, 'font-size': 6.5, 'class': 'ssv-k ssv-ul' }, g); sl.textContent = u[2]; }
          var pin = uw - (v ? 6 : 10) - pl;
          var np = Math.floor((pin + pg) / (psz + pg));
          var px0 = ux + (v ? 3 : 5) + pl + (pin - (np * (psz + pg) - pg)) / 2;
          for (var pI = 0; pI < np; pI++) {
            var ppx = px0 + pI * (psz + pg), ppy = cy - psz / 2;
            dB += 'M' + ppx + ' ' + ppy + 'h' + psz + 'v' + psz + 'h' + (-psz) + 'z';
            addLed(gl, ppx, ppy, psz, R, 'port', seed + pI);
          }
        } else if (kind === 'psu') {
          var plx = ux + (v ? 3.5 : 5);
          dP += 'M' + plx + ' ' + (cy - lsz / 2) + 'h' + lsz + 'v' + lsz + 'h' + (-lsz) + 'z';
          S('rect', { x: plx, y: cy - lsz / 2, width: lsz, height: lsz, 'class': 'ssv-pwr' }, g);
          if (labels) { var pt = S('text', { x: plx + lsz + 6, y: cy + 2.3, 'font-size': 6.5, 'class': 'ssv-k ssv-ul' }, g); pt.textContent = 'PSU 1+1'; }
          var vs = ux + uw - (v ? 4 : 6), ve = ux + (labels ? 58 : (v ? 12 : 16));
          for (var xv = vs; xv > ve; xv -= (v ? 3 : 3.5)) dV += 'M' + (xv + 0.5) + ' ' + (uy + 2.5) + 'v' + (uh - 5);
        } else if (kind === 'blank') {
          var sx = ux + (v ? 5 : 8), ex = ux + uw - (v ? 5 : 8);
          dV += 'M' + sx + ' ' + (cy + 0.5) + 'H' + ex;
        } else if (kind === 'meter') {
          buildMeter(R, g, spec, ux, uy, uw, uh);
        }
      });
      S('path', { d: dU, 'class': 'ssv-unit' }, g);
      S('path', { d: dV, 'class': 'ssv-vent' }, g);
      S('path', { d: dP, 'class': 'ssv-track' }, g);
      S('path', { d: dB, 'class': 'ssv-ledb' }, g);
      g.appendChild(gl);

      /* corner brackets that light up when work arrives */
      var cl = v ? 6 : 9, o = 2.5;
      var dc = 'M' + (x - o) + ' ' + (y - o + cl) + 'v' + (-cl) + 'h' + cl +
        'M' + (x + w + o - cl) + ' ' + (y - o) + 'h' + cl + 'v' + cl +
        'M' + (x + w + o) + ' ' + (y + bodyH + o - cl) + 'v' + cl + 'h' + (-cl) +
        'M' + (x - o + cl) + ' ' + (y + bodyH + o) + 'h' + (-cl) + 'v' + (-cl);
      R.brk = S('path', { d: dc, 'class': 'ssv-brk', opacity: 0 }, g);
      return R;
    }

    function addLed(g, x, y, s, R, kind, seed) {
      var led = S('rect', { x: x, y: y, width: s, height: s, fill: TOM, opacity: 0 }, g);
      var slow = R.i === 2 ? 2.2 : 1;
      leds.push({
        el: led, kind: kind, on: false, R: R,
        p: (0.6 + hash(seed) * 2.2) * slow,
        duty: 0.08 + hash(seed * 3 + 1) * 0.35,
        ph: hash(seed * 7 + 2) * 4,
        rate: 9 + hash(seed + 5) * 10,
        seed: seed
      });
    }

    function buildMeter(R, g, spec, ux, uy, uw, uh) {
      var v = vertical;
      var sx = ux + (v ? 3 : 5), sy = uy + (v ? 3 : 4), sw = uw - (v ? 6 : 10), sh = uh - (v ? 6 : 8);
      S('rect', { x: sx + 0.5, y: sy + 0.5, width: sw - 1, height: sh - 1, 'class': 'ssv-screen' }, g);
      var ip = v ? 4 : 6, statFs = v ? 7.5 : 9;
      var mx = sx + ip, mw = sw - 2 * ip;
      var statY = sy + sh - (v ? 5 : 7);
      var mY = sy + ip, mh = statY - statFs - (v ? 4 : 6) - mY;
      if (spec.meter === 'bar') {
        var by = mY + mh / 2 - 4;
        S('rect', { x: mx + 0.5, y: by + 0.5, width: mw - 1, height: 6, 'class': 'ssv-track' }, g);
        var ticks = '';
        for (var tk = 0; tk <= 4; tk++) ticks += 'M' + (mx + 0.5 + tk * (mw - 1) / 4) + ' ' + (by + 10) + 'v3';
        S('path', { d: ticks, 'class': 'ssv-vent' }, g);
        R.fill = S('rect', { x: 0, y: 0, width: mw - 3, height: 4, 'class': 'ssv-fill' }, g);
        R.fx = mx + 1.5; R.fy = by + 1.5;
      } else if (spec.meter === 'eq') {
        var bwid = v ? 2.5 : 3.5, nb = Math.max(4, Math.floor((mw + 2) / (bwid + (v ? 2 : 2.5))));
        var sp = (mw - bwid) / (nb - 1);
        S('path', { d: 'M' + mx + ' ' + (mY + mh + 0.5) + 'H' + (mx + mw), 'class': 'ssv-vent' }, g);
        for (var b = 0; b < nb; b++) {
          var bar = S('rect', { x: 0, y: -mh + 1, width: bwid, height: mh - 1, 'class': 'ssv-fill' }, g);
          R.bars.push({ el: bar, x: mx + b * sp, base: mY + mh, s: -1 });
        }
      } else if (spec.meter === 'wave') {
        var clip = S('clipPath', { id: cid + 'c' + R.i }, g);
        S('rect', { x: mx, y: mY - 2, width: mw, height: mh + 4 }, clip);
        var cg = S('g', { 'clip-path': 'url(#' + cid + 'c' + R.i + ')' }, g);
        S('path', { d: 'M' + mx + ' ' + (mY + mh / 2 + 0.5) + 'H' + (mx + mw), 'class': 'ssv-vent' }, cg);
        var lam = v ? 20 : 30, amp = mh / 2 - 2, wd = '';
        for (var xx = 0; xx <= mw + lam * 2; xx += 2) wd += (xx ? 'L' : 'M') + xx + ' ' + (Math.sin(xx / lam * Math.PI * 2) * amp).toFixed(2);
        R.wave = S('path', { d: wd, 'class': 'ssv-wave' }, cg);
        R.lam = lam; R.wx = mx - lam; R.wy = mY + mh / 2;
      } else {
        var cs = v ? 2.5 : 3.5, cgp = v ? 2 : 2.5;
        var rows = Math.max(2, Math.min(4, Math.floor((mh + cgp) / (cs + cgp))));
        var cols = Math.max(4, Math.floor((mw + cgp) / (cs + cgp)));
        var gx = mx + (mw - (cols * (cs + cgp) - cgp)) / 2;
        var gy = mY + (mh - (rows * (cs + cgp) - cgp)) / 2;
        for (var cr = 0; cr < rows; cr++) for (var cc = 0; cc < cols; cc++) {
          R.cells.push({ el: S('rect', { x: gx + cc * (cs + cgp), y: gy + cr * (cs + cgp), width: cs, height: cs, 'class': 'ssv-fill', opacity: 0.15 }, g), c: cc, r: cr, o: 0.15 });
        }
      }
      R.stat = S('text', { x: mx, y: statY, 'font-size': statFs, 'class': 'ssv-k ssv-stat' }, g);
      R.statFs = statFs;
      R.statMax = mw;
      R.statTxt = '';
    }

    function statText(i, d) {
      if (i === 0) return money(Math.round(st.takings)).replace('.00', '') + ' today';
      if (i === 1) return st.jobs + ' jobs open';
      if (i === 2) {
        var n = new Date(d), next = new Date(d);
        next.setHours(2, 0, 0, 0);
        if (next <= n) next.setDate(next.getDate() + 1);
        var mins = Math.round((next - n) / 60000), hh = Math.floor(mins / 60), mm = mins % 60;
        return (vertical ? 'next ' : 'next run ') + (hh ? hh + 'h ' : '') + mm + 'm';
      }
      return st.answers + ' answers';
    }
    function updateStats(d) {
      for (var i = 0; i < racks.length; i++) {
        var R = racks[i], s = statText(i, d);
        if (s !== R.statTxt) { R.statTxt = s; R.stat.textContent = s; R.stat.setAttribute('font-size', R.statFs); fit(R.stat, R.statMax, 6); }
      }
    }

    /* ---------- events ---------- */
    var recent = [];
    function nightEvent() {
      /* the night shift: last night if it is day, tonight if it already ran */
      var n = new Date(), mins = n.getHours() * 60 + n.getMinutes();
      var ok = NIGHT.filter(function (e) { var at = e.at[0] * 60 + e.at[1]; return mins >= 7 * 60 || at <= mins; });
      if (!ok.length) return null;
      var e = pick(ok);
      return { rack: 2, src: null, out: e.out, m: e.m, v: e.v, night: pad(e.at[0]) + ':' + pad(e.at[1]), tonight: mins < 7 * 60 };
    }
    function nextEvent(tries) {
      tries = tries || 0;
      var r = Math.random(), n = new Date(), ev;
      if (r < 0.15) { st.order++; var amt = pick([24.5, 38, 46, 64, 92.5, 118]); ev = { rack: 0, src: 'S', out: 'K', m: 'booking #' + st.order + ' paid', v: money(amt), amt: amt }; }
      else if (r < 0.27) { st.order++; ev = { rack: 0, src: 'W', out: 'K', m: 'order #' + st.order + ' to kitchen', v: (1 + (Math.random() * 3 | 0)) + ' x ' + pick(ITEMS) }; }
      else if (r < 0.35) ev = { rack: 0, src: 'W', out: 'D', m: 'table for ' + (2 + (Math.random() * 6 | 0)) + ' booked', v: pick(DAYS) + ' ' + pick(['18:30', '19:00', '19:30', '20:15']) };
      else if (r < 0.43) ev = { rack: 0, src: 'S', out: 'D', m: 'receipt sent', v: pick(NAMES) + '@...' };
      else if (r < 0.47) ev = { rack: 0, src: 'W', out: 'D', m: 'phone calls needed', v: '0' };
      else if (r < 0.54) ev = { rack: 1, src: 'W', out: 'D', m: 'stock updated', v: pick(['mozzarella', 'flour', 'basil', 'tomatoes']) + ' -' + (1 + (Math.random() * 4 | 0)) + ' kg', job: 0 };
      else if (r < 0.60) ev = { rack: 1, src: 'W', out: 'D', m: 'quote ready', v: 'catering, ' + pick([24, 40, 60, 85]) + ' ppl', job: 1 };
      else if (r < 0.65) { st.invoice++; ev = { rack: 1, src: 'W', out: 'D', m: 'job #' + st.invoice + ' closed', v: 'invoiced', job: -1 }; }
      else if (r < 0.71) ev = { rack: 2, src: 'E', out: 'D', m: 'reminder sent', v: (2 + (Math.random() * 5 | 0)) + ' bookings tmrw' };
      else if (r < 0.76) ev = nightEvent();
      if (!ev) { var a = pick(ASK); ev = { rack: 3, src: 'E', out: 'P', m: 'ai ' + a[0], v: a[1], ai: 1 }; }
      ev.time = hms(n);
      if ((ev.night || ev.ai) && recent.indexOf(ev.m) >= 0 && tries < 6) return nextEvent(tries + 1);
      recent.push(ev.m); if (recent.length > 4) recent.shift();
      return ev;
    }

    var MOON = 'M7.2 1.2A5 5 0 1 0 10.8 8.6 4 4 0 0 1 7.2 1.2Z';
    function addLine(ev, typed) {
      var ln = D('div', 'ssv-ln', null);
      var tEl = D('span', 't', ln, ev.night ? '' : ev.time);
      if (ev.night) {
        ln.classList.add('is-night');
        ln.title = (ev.tonight ? 'Tonight' : 'Last night') + ', ' + ev.night;
        var ic = S('svg', { viewBox: '0 0 12 12', width: '9', height: '9', 'class': 'ssv-moon', 'aria-hidden': 'true' }, tEl);
        S('path', { d: MOON }, ic);
        D('span', '', tEl, ev.night);
      }
      D('span', 'r', ln, RACKS[ev.rack].id);
      var mEl = D('span', 'm', ln, typed ? '' : ev.m);
      var vEl = D('span', 'v', ln, typed ? '' : ev.v);
      lines.appendChild(ln);
      while (lines.childNodes.length > 16) lines.removeChild(lines.firstChild);
      if (typed) {
        if (typing) finishTyping();
        var cur = D('i', 'ssv-cur', null);
        mEl.appendChild(cur);
        typing = { m: mEl, v: vEl, mt: ev.m, vt: ev.v, t0: t, cur: cur, n: -1 };
      }
    }
    function finishTyping() {
      if (!typing) return;
      typing.m.textContent = typing.mt;
      typing.v.textContent = typing.vt;
      typing = null;
    }
    function stepTyping() {
      if (!typing) return;
      var n = Math.floor((t - typing.t0) * 70), total = typing.mt.length + typing.vt.length;
      if (n >= total + 6) { finishTyping(); return; }
      if (n === typing.n) return;
      typing.n = n;
      var a = Math.min(n, typing.mt.length);
      typing.m.textContent = typing.mt.slice(0, a);
      if (n < typing.mt.length) typing.m.appendChild(typing.cur);
      else { typing.v.textContent = typing.vt.slice(0, n - typing.mt.length); typing.v.appendChild(typing.cur); }
    }

    function flash(key) { var b = boxes[key]; if (b) b.until = t + 0.35; }
    function spawn(route, cb, op) {
      if (!route) { if (cb) cb(); return; }
      for (var i = 0; i < pool.length; i++) {
        var p = pool[i];
        if (!p.alive) {
          p.alive = true; p.route = route; p.d = 0; p.cb = cb; p.op = op || 1;
          p.el.setAttribute('opacity', p.op); p.tr.setAttribute('opacity', p.op * 0.55);
          placePacket(p); return;
        }
      }
      if (cb) cb();
    }
    function pointAt(R, d) {
      var c = R.cum, s = 0;
      while (s < c.length - 2 && d > c[s + 1]) s++;
      var a = R.pts[s], b = R.pts[s + 1], L = c[s + 1] - c[s];
      var f = L > 0 ? Math.max(0, Math.min(1, (d - c[s]) / L)) : 1;
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, s];
    }
    var TRAIL = 26;
    function placePacket(p) {
      var R = p.route, h = pointAt(R, p.d), d0 = Math.max(0, p.d - (vertical ? TRAIL * 0.75 : TRAIL));
      var s0 = pointAt(R, d0), dd = 'M' + f1(s0[0]) + ' ' + f1(s0[1]);
      for (var k = s0[2] + 1; k <= h[2]; k++) dd += 'L' + f1(R.pts[k][0]) + ' ' + f1(R.pts[k][1]);
      dd += 'L' + f1(h[0]) + ' ' + f1(h[1]);
      p.tr.setAttribute('d', dd);
      p.el.setAttribute('transform', 'translate(' + f1(h[0]) + ' ' + f1(h[1]) + ')');
    }
    function arrive(ev) {
      var R = racks[ev.rack];
      if (!R) return;
      R.act = t + 0.9;
      R.glow = 1;
      R.level = Math.min(1, R.level + 0.28);
      if (ev.amt) st.takings += ev.amt;
      if (ev.job) st.jobs = Math.max(3, st.jobs + ev.job);
      if (ev.ai) st.answers++;
      pending.push({ at: t + 0.35, fn: function () { spawn(outR[ev.rack + '>' + ev.out], function () { flash(ev.out); }); } });
    }
    function emit(ev) {
      st.events++;
      setCount();
      addLine(ev, true);
      if (ev.src) { flash(ev.src); spawn(inR[ev.src + '>' + ev.rack], function () { arrive(ev); }); }
      else arrive(ev);
    }
    function ambient() {
      var r = pick(IN_ROUTES), k = r[0] + '>' + r[1];
      flash(r[0]);
      spawn(inR[k], function () { var R = racks[r[1]]; if (R) { R.act = Math.max(R.act, t + 0.3); R.glow = Math.max(R.glow, 0.35); R.level = Math.min(1, R.level + 0.1); } }, 0.45);
    }

    /* ---------- drawing ---------- */
    function renderFrame(dt) {
      var i, j;
      for (i = 0; i < pool.length; i++) {
        var p = pool[i];
        if (!p.alive) continue;
        p.d += speed * dt;
        if (p.d >= p.route.len) {
          p.alive = false; p.el.setAttribute('opacity', 0); p.tr.setAttribute('opacity', 0);
          var cb = p.cb; p.cb = null; if (cb) cb();
        } else placePacket(p);
      }
      for (i = 0; i < leds.length; i++) {
        var l = leds[i], R = l.R, on, busy = R.act > t;
        if (l.kind === 'beat') {
          var per = (R.i === 3 && busy) ? l.p * 0.3 : l.p;
          on = ((t + l.ph) % per) / per < l.duty;
        } else if (l.kind === 'port') {
          on = hash(Math.floor(t * (busy ? l.rate : l.rate * 0.35)) + l.seed) > (busy ? 0.5 : 0.86);
        } else on = hash(Math.floor(t * l.rate) + l.seed) > (busy ? 0.5 : 0.94);
        if (on !== l.on) { l.on = on; l.el.setAttribute('opacity', on ? 1 : 0); }
      }
      for (var k in boxes) {
        var b = boxes[k], bo = b.until > t;
        if (bo !== b.on) { b.on = bo; b.led.setAttribute('opacity', bo ? 1 : 0); }
      }
      for (i = 0; i < racks.length; i++) {
        var Rk = racks[i], busyR = Rk.act > t;
        var target = 0.22 + 0.1 * Math.sin(t * 0.7 + i * 2) + (busyR ? 0.35 : 0);
        Rk.level += (target - Rk.level) * Math.min(1, dt * 3);
        Rk.glow = Math.max(0, Rk.glow - dt * 1.4);
        var gq = Math.round(Rk.glow * 25) / 25;
        if (gq !== Rk.gq) { Rk.gq = gq; Rk.wash.setAttribute('opacity', (gq * 0.07).toFixed(3)); Rk.brk.setAttribute('opacity', gq.toFixed(2)); }
        /* fans: slow, faster when busy */
        Rk.fanV += ((busyR ? 260 : 45 + i * 6) - Rk.fanV) * Math.min(1, dt * 1.5);
        Rk.fanA = (Rk.fanA + Rk.fanV * dt) % 360;
        for (j = 0; j < Rk.fans.length; j++) {
          var fn = Rk.fans[j];
          fn.el.setAttribute('transform', 'translate(' + fn.x + ' ' + fn.y + ') rotate(' + (fn.dir * Rk.fanA + j * 23).toFixed(1) + ')');
        }
        for (j = 0; j < Rk.loads.length; j++) {
          var ld = Rk.loads[j];
          var lv = 0.12 + Rk.level * (0.45 + 0.4 * Math.sin(t * ld.f + ld.ph));
          lv = Math.round(Math.max(0.05, Math.min(1, lv)) * 30) / 30;
          if (lv !== ld.s) { ld.s = lv; ld.el.setAttribute('transform', 'translate(' + f1(ld.x) + ' ' + ld.y.toFixed(2) + ') scale(' + lv.toFixed(3) + ' 1)'); }
        }
        if (Rk.fill) Rk.fill.setAttribute('transform', 'translate(' + f1(Rk.fx) + ' ' + f1(Rk.fy) + ') scale(' + Math.max(0.02, Rk.level).toFixed(3) + ' 1)');
        if (Rk.bars.length) {
          for (j = 0; j < Rk.bars.length; j++) {
            var bb = Rk.bars[j];
            var s = 0.12 + Rk.level * (0.45 + 0.55 * Math.abs(Math.sin(t * (2.1 + j * 0.37) + j * 1.7)));
            s = Math.round(Math.min(1, s) * 40) / 40;
            if (s !== bb.s) { bb.s = s; bb.el.setAttribute('transform', 'translate(' + f1(bb.x) + ' ' + bb.base + ') scale(1 ' + s + ')'); }
          }
        }
        if (Rk.wave) {
          var off = (t * (busyR ? 26 : 9)) % Rk.lam;
          var amp = 0.25 + Rk.level * 0.9;
          Rk.wave.setAttribute('transform', 'translate(' + f1(Rk.wx - off) + ' ' + Rk.wy + ') scale(1 ' + Math.min(1, amp).toFixed(2) + ')');
        }
        if (Rk.cells.length) {
          for (j = 0; j < Rk.cells.length; j++) {
            var c = Rk.cells[j];
            var w = Math.sin(t * (busyR ? 7 : 1.6) - c.c * 0.7 - c.r * 1.1);
            var o = 0.14 + (busyR ? 0.86 : 0.35) * Math.max(0, w);
            o = Math.round(o * 20) / 20;
            if (o !== c.o) { c.o = o; c.el.setAttribute('opacity', o); }
          }
        }
      }
    }

    function stillFrame() {
      t = 3.7;
      racks[0].act = racks[3].act = t + 1;
      racks[0].glow = 0.8;
      racks.forEach(function (R, i) { R.level = [0.62, 0.4, 0.28, 0.55][i]; });
      var some = [[inR['S>0'], 0.55], [inR['E>3'], 0.4], [outR['1>D'], 0.5], [outR['0>K'], 0.7], [inR['W>1'], 0.3]];
      some.forEach(function (s) { if (s[0]) spawn(s[0], null, 1); });
      var k = 0;
      pool.forEach(function (p) { if (p.alive) { p.d = p.route.len * some[k++][1]; placePacket(p); } });
      var keep = pool.filter(function (p) { return p.alive; });
      pool.forEach(function (p) { p.alive = false; });
      boxes.S && (boxes.S.until = t + 1);
      boxes.K && (boxes.K.until = t + 1);
      renderFrame(0);
      keep.forEach(function (p) { p.el.setAttribute('opacity', 1); p.tr.setAttribute('opacity', 0.55); });
      updateStats(new Date());
    }

    function frame(ts) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      var dt = lastTs ? Math.min(0.1, (ts - lastTs) / 1000) : 0;
      lastTs = ts;
      t += dt;
      if (t >= nextLog) { emit(nextEvent()); nextLog = t + 1.25; }
      if (t >= nextAmb) { ambient(); nextAmb = t + 0.45 + Math.random() * 0.8; }
      for (var i = pending.length - 1; i >= 0; i--) if (pending[i].at <= t) { var f = pending[i].fn; pending.splice(i, 1); f(); }
      renderFrame(dt);
      stepTyping();
      var d = Date.now(), sec = Math.floor(d / 1000);
      if (sec !== lastSec) { lastSec = sec; setClock(new Date(d)); updateStats(d); }
    }

    /* ---------- prefill the log so it opens mid-shift ---------- */
    (function prefill() {
      var base = Date.now();
      for (var k = 7; k >= 1; k--) {
        var ev = nextEvent();
        ev.time = hms(new Date(base - k * 1250 - Math.random() * 400));
        addLine(ev, false);
      }
    })();

    layout();
    updateStats(Date.now());
    var ro = null;
    if (window.ResizeObserver) {
      var lastW = 0, lastH = 0;
      ro = new ResizeObserver(function () {
        var w = el.clientWidth, h = el.clientHeight;
        if (w === lastW && h === lastH) return;
        lastW = w; lastH = h;
        layout();
        updateStats(Date.now());
      });
      ro.observe(el);
    } else {
      window.addEventListener('resize', function () { layout(); updateStats(Date.now()); });
    }

    function start() {
      if (reduce) { setClock(new Date()); updateStats(Date.now()); return; }
      if (running) return;
      running = true;
      lastTs = 0;
      el.classList.remove('ssv--paused');
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      el.classList.add('ssv--paused');
    }
    if (reduce) el.classList.add('ssv--still');
    el.classList.add('ssv--paused');
    return { start: start, stop: stop };
  }

  window.SALA_SERVER = { mount: mount };
})();
