/* Sala server: "the machine room, live". Four racks, packets, a log that types.
   window.SALA_SERVER.mount(el) -> { start, stop }. One rAF loop, no timers. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var INK = '#F4F2EC', TOM = '#FF5B3A';
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
  var RACKS = [
    { id: 'R01', name: 'Bookings', sub: 'and payments', meter: 'bar' },
    { id: 'R02', name: 'Back office', sub: 'orders, stock', meter: 'eq' },
    { id: 'R03', name: 'Automations', sub: 'night shift', meter: 'wave' },
    { id: 'R04', name: 'Private AI', sub: 'stays inside', meter: 'cells' }
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

  function mount(el) {
    var reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    var cid = 'ssv' + (++uid);
    el.classList.add('ssv');
    el.innerHTML = '';

    /* ---------- DOM shell ---------- */
    var top = D('div', 'ssv-top', el);
    var tag = D('div', 'ssv-tag', top);
    D('span', 'ssv-dot', tag);
    D('span', '', tag, 'Live');
    D('span', 'ssv-mut', tag, '/ Machine room');
    var clock = D('div', 'ssv-clock', top, hms(new Date()));
    D('p', 'ssv-lede', el, 'Four racks. No one on shift. It runs anyway.');
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

    function setCount() { countEl.textContent = st.events.toLocaleString('en-US') + ' today'; }
    setCount();

    /* ---------- layout ---------- */
    function layout() {
      var vw = el.clientWidth;
      if (!vw) return;
      /* side by side only when each rack still gets room to breathe */
      vertical = false;
      el.classList.remove('ssv--v');
      var wH = dia.clientWidth;
      var bfH = 10.5, need = Math.ceil(7 * bfH * 0.64) + 32 + Math.ceil(14 * bfH * 0.64) + 32 + (IN_ROUTES.length + OUT_ROUTES.length) * 6 + 60 + 54;
      if ((wH - need) / 4 < 100) { vertical = true; el.classList.add('ssv--v'); }
      var W = Math.round(dia.clientWidth), H = Math.round(dia.clientHeight);
      if (W < 40 || H < 60) return;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.setAttribute('width', W);
      svg.setAttribute('height', H);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      racks = []; boxes = {}; inR = {}; outR = {}; pool = []; pending = []; leds = [];
      speed = vertical ? 120 : 165;

      var gap = vertical ? 4.5 : 6;
      var boxH = vertical ? 22 : 26;
      var bfs = vertical ? 9.5 : 10.5;
      var nIn = IN_ROUTES.length, nOut = OUT_ROUTES.length;
      var gWire = S('g', { 'class': 'ssv-wires' }, svg);
      var gNodes = S('g', {}, svg);
      var gRacks = S('g', {}, svg);
      var gPk = S('g', {}, svg);

      var srcOrder, outOrder, rackTop, rackBot, rackL, rackR, rw, rg;
      function bw(label) { return Math.ceil(label.length * bfs * 0.64) + (vertical ? 26 : 32); }
      var bwSrc = Math.max(bw('Website'), bw('Stripe'), bw('Email'));
      var bwOut = Math.max(bw('Kitchen screen'), bw('Dashboard'), bw('Your phone'));
      var m = vertical ? 10 : 14;

      if (!vertical) {
        srcOrder = ['E', 'W', 'S']; outOrder = ['P', 'D', 'K'];
        rackL = bwSrc + nIn * gap + 30;
        rackR = W - bwOut - nOut * gap - 30;
        rg = 18;
        rackTop = 4 + (nIn - 1) * gap + m;
        rackBot = H - 4 - (nOut - 1) * gap - m;
      } else {
        srcOrder = ['S', 'W', 'E']; outOrder = ['K', 'D', 'P'];
        rackL = 0; rackR = W; rg = 8;
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
        var lx = x + (vertical ? 8 : 10), ly = y + (boxH - ls) / 2;
        S('rect', { x: lx, y: ly, width: ls, height: ls, 'class': 'ssv-ledb' }, g);
        var led = S('rect', { x: lx, y: ly, width: ls, height: ls, fill: TOM, opacity: 0 }, g);
        var tx = S('text', { x: lx + ls + (vertical ? 6 : 8), y: y + boxH / 2 + bfs * 0.36, 'font-size': bfs, 'class': 'ssv-k' }, g);
        tx.textContent = label;
        fit(tx, w - (lx - x) - ls - 12, 7);
        boxes[key] = { x: x, y: y, w: w, h: boxH, led: led, until: 0, on: false, side: side };
      }
      if (!vertical) {
        var mid = (rackTop + rackBot) / 2, step = boxH + 20;
        srcOrder.forEach(function (k, i) { makeBox(k, SRC[k], 0, mid + (i - 1) * step - boxH / 2, bwSrc, 'src'); });
        outOrder.forEach(function (k, i) { makeBox(k, OUT[k], W - bwOut, mid + (i - 1) * step - boxH / 2, bwOut, 'out'); });
      } else {
        var cw = W / 3;
        srcOrder.forEach(function (k, i) { var w = Math.min(cw - 8, bwSrc); makeBox(k, SRC[k], cw * (i + 0.5) - w / 2, 0, w, 'src'); });
        outOrder.forEach(function (k, i) { var w = Math.min(cw - 6, bwOut); makeBox(k, OUT[k], cw * (i + 0.5) - w / 2, H - boxH, w, 'out'); });
      }

      /* racks */
      for (var i = 0; i < 4; i++) racks.push(buildRack(gRacks, i, rackL + i * (rw + rg), rackTop, rw, rh));

      /* wires: try every tray order, keep the one with fewest crossings */
      function rackPorts(list, rankOf, dir, rack, yEdge) {
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
        var d = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L');
        S('path', { d: d, 'class': 'ssv-wire' }, gWire);
        var e = pts[pts.length - 1];
        var cum = [0];
        for (var i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]));
        store[key] = { pts: pts, cum: cum, len: cum[cum.length - 1] };
        return e;
      }
      inList.forEach(function (L) {
        var e = wire(ip[L.i], L.box + '>' + L.rack, inR);
        S('rect', { x: e[0] - 1.5, y: e[1] - 3, width: 3, height: 3, 'class': 'ssv-pin' }, gWire);
      });
      outList.forEach(function (L) {
        var e = wire(op[L.i], L.rack + '>' + L.box, outR);
        var s = op[L.i][0];
        S('rect', { x: s[0] - 1.5, y: s[1], width: 3, height: 3, 'class': 'ssv-pin' }, gWire);
      });

      /* packet pool */
      var ps = vertical ? 4 : 5;
      for (var p = 0; p < 26; p++) {
        var r = S('rect', { x: -ps / 2, y: -ps / 2, width: ps, height: ps, fill: TOM, opacity: 0 }, gPk);
        pool.push({ el: r, alive: false, route: null, d: 0, seg: 0, cb: null, op: 1 });
      }

      if (reduce) stillFrame(); else renderFrame(0);
    }

    /* ---------- one rack ---------- */
    function buildRack(g0, i, x, y, w, h) {
      var spec = RACKS[i];
      var g = S('g', {}, g0);
      var R = { i: i, x: x, y: y, w: w, h: h, act: 0, level: 0.3, leds: [], cells: [], bars: [] };
      S('rect', { x: x + 0.5, y: y + 0.5, width: w - 1, height: h - 1, 'class': 'ssv-rack' }, g);
      var v = vertical, hh = v ? 44 : 54;
      var id = S('text', { x: x + (v ? 7 : 10), y: y + (v ? 14 : 17), 'font-size': v ? 9 : 10, 'class': 'ssv-k ssv-id' }, g);
      id.textContent = spec.id;
      var pw = v ? 3 : 4;
      S('rect', { x: x + w - (v ? 7 : 10) - pw, y: y + (v ? 8 : 10), width: pw, height: pw, 'class': 'ssv-pwr' }, g);
      var nm = S('text', { x: x + (v ? 7 : 10), y: y + (v ? 28 : 34), 'font-size': v ? 10.5 : 12.5, 'class': 'ssv-n' }, g);
      nm.textContent = spec.name;
      fit(nm, w - (v ? 12 : 18), 7.5);
      var sb = S('text', { x: x + (v ? 7 : 10), y: y + (v ? 38 : 46), 'font-size': v ? 8 : 9, 'class': 'ssv-k ssv-sub' }, g);
      sb.textContent = spec.sub;
      fit(sb, w - (v ? 12 : 18), 6.5);
      S('path', { d: 'M' + (x + 1) + ' ' + (y + hh + 0.5) + 'H' + (x + w - 1), 'class': 'ssv-div' }, g);

      var mh = v ? 16 : 22;
      var statY = y + h - (v ? 7 : 9);
      var mY = statY - (v ? 12 : 14) - mh;
      S('path', { d: 'M' + (x + 1) + ' ' + (mY - (v ? 6 : 9) + 0.5) + 'H' + (x + w - 1), 'class': 'ssv-div' }, g);

      /* units */
      var uh = v ? 11 : 15, ug = v ? 4 : 5, ux = x + (v ? 5 : 7), uw = w - (v ? 10 : 14);
      var u0 = y + hh + (v ? 6 : 8), u1 = mY - (v ? 12 : 16);
      var nU = Math.max(1, Math.min(7, Math.floor((u1 - u0 + ug) / (uh + ug))));
      var used = nU * uh + (nU - 1) * ug;
      u0 += Math.max(0, (u1 - u0 - used) / 2);
      var dU = '', dV = '', dB = '', dS = '';
      var ls = v ? 3 : 4;
      for (var u = 0; u < nU; u++) {
        var uy = u0 + u * (uh + ug);
        dU += 'M' + (ux + 0.5) + ' ' + (uy + 0.5) + 'h' + (uw - 1) + 'v' + (uh - 1) + 'h' + (-(uw - 1)) + 'z';
        var lx = ux + (v ? 4 : 5), ly = uy + (uh - ls) / 2;
        var nv = v ? 3 : 5, vx = ux + uw - (v ? 4 : 6);
        for (var k = 0; k < nv; k++) dV += 'M' + (vx - k * 3 + 0.5) + ' ' + (uy + 3) + 'v' + (uh - 6);
        var sx0 = lx + ls * 2 + 3 + (v ? 5 : 8), sx1 = vx - (nv - 1) * 3 - (v ? 5 : 8);
        if (sx1 - sx0 > 6) dS += 'M' + sx0 + ' ' + (uy + uh / 2 + 0.5) + 'H' + sx1;
        for (var q = 0; q < 2; q++) {
          var lxx = lx + q * (ls + 3);
          dB += 'M' + lxx + ' ' + ly + 'h' + ls + 'v' + ls + 'h' + (-ls) + 'z';
          var led = S('rect', { x: lxx, y: ly, width: ls, height: ls, fill: TOM, opacity: 0 }, null);
          var slow = i === 2 ? 2.4 : 1;
          R.leds.push({
            el: led, kind: q === 0 ? 'beat' : 'act', on: false,
            p: (0.5 + hash(i * 31 + u * 7 + q) * 2.2) * slow,
            duty: 0.08 + hash(i * 13 + u * 3 + q * 5) * 0.4,
            ph: hash(i * 5 + u * 11 + q * 17) * 4,
            seed: i * 100 + u * 10 + q
          });
        }
      }
      S('path', { d: dU, 'class': 'ssv-unit' }, g);
      S('path', { d: dV + dS, 'class': 'ssv-vent' }, g);
      S('path', { d: dB, 'class': 'ssv-ledb' }, g);
      R.leds.forEach(function (l) { g.appendChild(l.el); leds.push(l); });

      /* meter */
      var mx = x + (v ? 7 : 10), mw = w - (v ? 14 : 20);
      if (spec.meter === 'bar') {
        var by = mY + mh / 2 - 3;
        S('rect', { x: mx + 0.5, y: by + 0.5, width: mw - 1, height: 5, 'class': 'ssv-track' }, g);
        var ticks = '';
        for (var tk = 0; tk <= 4; tk++) ticks += 'M' + (mx + 0.5 + tk * (mw - 1) / 4) + ' ' + (by + 9) + 'v3';
        S('path', { d: ticks, 'class': 'ssv-vent' }, g);
        R.fill = S('rect', { x: 0, y: 0, width: mw - 3, height: 3, 'class': 'ssv-fill' }, g);
        R.fx = mx + 1.5; R.fy = by + 1.5;
      } else if (spec.meter === 'eq') {
        var nb = Math.max(4, Math.floor((mw + 3) / (v ? 6 : 7))), bwid = v ? 3 : 4;
        var sp = (mw - bwid) / (nb - 1);
        S('path', { d: 'M' + mx + ' ' + (mY + mh + 0.5) + 'H' + (mx + mw), 'class': 'ssv-vent' }, g);
        for (var b = 0; b < nb; b++) {
          var bar = S('rect', { x: 0, y: -mh + 1, width: bwid, height: mh - 1, 'class': 'ssv-fill' }, g);
          R.bars.push({ el: bar, x: mx + b * sp, base: mY + mh, s: -1 });
        }
      } else if (spec.meter === 'wave') {
        var clip = S('clipPath', { id: cid + 'c' + i }, g);
        S('rect', { x: mx, y: mY - 2, width: mw, height: mh + 4 }, clip);
        var cg = S('g', { 'clip-path': 'url(#' + cid + 'c' + i + ')' }, g);
        S('path', { d: 'M' + mx + ' ' + (mY + mh / 2 + 0.5) + 'H' + (mx + mw), 'class': 'ssv-vent' }, cg);
        var lam = v ? 22 : 30, amp = mh / 2 - 2, wd = '';
        for (var xx = 0; xx <= mw + lam * 2; xx += 2) wd += (xx ? 'L' : 'M') + xx + ' ' + (Math.sin(xx / lam * Math.PI * 2) * amp).toFixed(2);
        R.wave = S('path', { d: wd, 'class': 'ssv-wave' }, cg);
        R.lam = lam; R.wx = mx - lam; R.wy = mY + mh / 2;
      } else {
        var cs = v ? 3 : 4, cgp = v ? 3 : 3, rows = 3;
        var cols = Math.max(4, Math.floor((mw + cgp) / (cs + cgp)));
        var gx = mx + (mw - (cols * (cs + cgp) - cgp)) / 2;
        var gy = mY + (mh - (rows * (cs + cgp) - cgp)) / 2;
        for (var cr = 0; cr < rows; cr++) for (var cc = 0; cc < cols; cc++) {
          R.cells.push({ el: S('rect', { x: gx + cc * (cs + cgp), y: gy + cr * (cs + cgp), width: cs, height: cs, 'class': 'ssv-fill', opacity: 0.15 }, g), c: cc, r: cr, o: 0.15 });
        }
      }

      R.stat = S('text', { x: mx, y: statY, 'font-size': v ? 8 : 9, 'class': 'ssv-k ssv-stat' }, g);
      R.statMax = mw;
      R.statTxt = '';
      return R;
    }

    function statText(i, d) {
      if (i === 0) return money(Math.round(st.takings)).replace('.00', '') + ' today';
      if (i === 1) return st.jobs + ' jobs open';
      if (i === 2) {
        var n = new Date(d), next = new Date(d);
        next.setHours(2, 0, 0, 0);
        if (next <= n) next.setDate(next.getDate() + 1);
        var mins = Math.round((next - n) / 60000), hh = Math.floor(mins / 60), mm = mins % 60;
        return 'next run ' + (hh ? hh + 'h ' : '') + mm + 'm';
      }
      return st.answers + ' answers';
    }
    function updateStats(d) {
      for (var i = 0; i < racks.length; i++) {
        var R = racks[i], s = statText(i, d);
        if (s !== R.statTxt) { R.statTxt = s; R.stat.textContent = s; R.stat.setAttribute('font-size', vertical ? 8 : 9); fit(R.stat, R.statMax, 6); }
      }
    }

    /* ---------- events ---------- */
    var lastMsg = '';
    function nextEvent(tries) {
      tries = tries || 0;
      var r = Math.random(), n = new Date(), ev;
      if (r < 0.14) { st.order++; var amt = pick([24.5, 38, 46, 64, 92.5, 118]); ev = { rack: 0, src: 'S', out: 'K', m: 'booking #' + st.order + ' paid', v: money(amt), amt: amt }; }
      else if (r < 0.26) { st.order++; ev = { rack: 0, src: 'W', out: 'K', m: 'order #' + st.order + ' to kitchen', v: (1 + (Math.random() * 3 | 0)) + ' x ' + pick(ITEMS) }; }
      else if (r < 0.34) ev = { rack: 0, src: 'W', out: 'D', m: 'table for ' + (2 + (Math.random() * 6 | 0)) + ' booked', v: pick(DAYS) + ' ' + pick(['18:30', '19:00', '19:30', '20:15']) };
      else if (r < 0.42) ev = { rack: 0, src: 'S', out: 'D', m: 'receipt sent', v: pick(NAMES) + '@...' };
      else if (r < 0.46) ev = { rack: 0, src: 'W', out: 'D', m: 'phone calls needed', v: '0' };
      else if (r < 0.53) ev = { rack: 1, src: 'W', out: 'D', m: 'stock updated', v: pick(['mozzarella', 'flour', 'basil', 'tomatoes']) + ' -' + (1 + (Math.random() * 4 | 0)) + ' kg', job: 0 };
      else if (r < 0.59) ev = { rack: 1, src: 'W', out: 'D', m: 'quote ready', v: 'catering, ' + pick([24, 40, 60, 85]) + ' ppl', job: 1 };
      else if (r < 0.64) { st.invoice++; ev = { rack: 1, src: 'W', out: 'D', m: 'job #' + st.invoice + ' closed', v: 'invoiced', job: -1 }; }
      else if (r < 0.69) ev = { rack: 2, src: 'E', out: 'D', m: 'reminder sent', v: (2 + (Math.random() * 5 | 0)) + ' bookings tmrw' };
      else if (r < 0.72) ev = { rack: 2, src: null, out: 'D', m: 'backup done', v: '2.1 GB', at: '02:00:00' };
      else if (r < 0.75) ev = { rack: 2, src: null, out: 'P', m: '12 invoices sent', v: '', at: '03:00:02' };
      else if (r < 0.77) ev = { rack: 2, src: null, out: 'P', m: 'morning report', v: 'on your phone', at: '06:30:00' };
      else { var a = pick(ASK); ev = { rack: 3, src: 'E', out: 'P', m: 'ai ' + a[0], v: a[1], ai: 1 }; }
      ev.time = ev.at || hms(n);
      if ((ev.at || ev.ai) && ev.m === lastMsg && tries < 5) return nextEvent(tries + 1);
      lastMsg = ev.m;
      return ev;
    }

    function addLine(ev, typed) {
      var ln = D('div', 'ssv-ln', null);
      if (ev.at) ln.classList.add('is-past');
      D('span', 't', ln, ev.time);
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
        if (!p.alive) { p.alive = true; p.route = route; p.d = 0; p.seg = 0; p.cb = cb; p.op = op || 1; p.el.setAttribute('opacity', p.op); placePacket(p); return; }
      }
    }
    function placePacket(p) {
      var R = p.route, c = R.cum;
      while (p.seg < c.length - 2 && p.d > c[p.seg + 1]) p.seg++;
      var a = R.pts[p.seg], b = R.pts[p.seg + 1], L = c[p.seg + 1] - c[p.seg];
      var f = L > 0 ? Math.min(1, (p.d - c[p.seg]) / L) : 1;
      p.el.setAttribute('transform', 'translate(' + (a[0] + (b[0] - a[0]) * f).toFixed(1) + ' ' + (a[1] + (b[1] - a[1]) * f).toFixed(1) + ')');
    }
    function arrive(ev) {
      var R = racks[ev.rack];
      if (!R) return;
      R.act = t + 0.7;
      R.level = Math.min(1, R.level + 0.28);
      if (ev.amt) st.takings += ev.amt;
      if (ev.job) st.jobs = Math.max(3, st.jobs + ev.job);
      if (ev.ai) st.answers++;
      pending.push({ at: t + 0.3, fn: function () { spawn(outR[ev.rack + '>' + ev.out], function () { flash(ev.out); }); } });
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
      spawn(inR[k], function () { var R = racks[r[1]]; if (R) { R.act = Math.max(R.act, t + 0.3); R.level = Math.min(1, R.level + 0.1); } }, 0.45);
    }

    /* ---------- drawing ---------- */
    function renderFrame(dt) {
      var i, j;
      for (i = 0; i < pool.length; i++) {
        var p = pool[i];
        if (!p.alive) continue;
        p.d += speed * dt;
        if (p.d >= p.route.len) {
          p.alive = false; p.el.setAttribute('opacity', 0);
          var cb = p.cb; p.cb = null; if (cb) cb();
        } else placePacket(p);
      }
      for (i = 0; i < leds.length; i++) {
        var l = leds[i], R = racks[Math.floor(l.seed / 100)], on;
        var busy = R && R.act > t;
        if (l.kind === 'beat') {
          var per = (R && R.i === 3 && busy) ? l.p * 0.3 : l.p;
          on = ((t + l.ph) % per) / per < l.duty;
        } else on = busy && hash(Math.floor(t * 16) + l.seed) > 0.45;
        if (on !== l.on) { l.on = on; l.el.setAttribute('opacity', on ? 1 : 0); }
      }
      for (var k in boxes) {
        var b = boxes[k], bo = b.until > t;
        if (bo !== b.on) { b.on = bo; b.led.setAttribute('opacity', bo ? 1 : 0); }
      }
      for (i = 0; i < racks.length; i++) {
        var Rk = racks[i];
        var target = 0.22 + 0.1 * Math.sin(t * 0.7 + i * 2) + (Rk.act > t ? 0.35 : 0);
        Rk.level += (target - Rk.level) * Math.min(1, dt * 3);
        if (Rk.fill) Rk.fill.setAttribute('transform', 'translate(' + Rk.fx.toFixed(1) + ' ' + Rk.fy.toFixed(1) + ') scale(' + Math.max(0.02, Rk.level).toFixed(3) + ' 1)');
        if (Rk.bars.length) {
          for (j = 0; j < Rk.bars.length; j++) {
            var bb = Rk.bars[j];
            var s = 0.12 + Rk.level * (0.45 + 0.55 * Math.abs(Math.sin(t * (2.1 + j * 0.37) + j * 1.7)));
            s = Math.round(Math.min(1, s) * 40) / 40;
            if (s !== bb.s) { bb.s = s; bb.el.setAttribute('transform', 'translate(' + bb.x.toFixed(1) + ' ' + bb.base + ') scale(1 ' + s + ')'); }
          }
        }
        if (Rk.wave) {
          var off = (t * (Rk.act > t ? 26 : 9)) % Rk.lam;
          var amp = 0.25 + Rk.level * 0.9;
          Rk.wave.setAttribute('transform', 'translate(' + (Rk.wx - off).toFixed(1) + ' ' + Rk.wy + ') scale(1 ' + Math.min(1, amp).toFixed(2) + ')');
        }
        if (Rk.cells.length) {
          var think = Rk.act > t;
          for (j = 0; j < Rk.cells.length; j++) {
            var c = Rk.cells[j];
            var w = Math.sin(t * (think ? 7 : 1.6) - c.c * 0.7 - c.r * 1.1);
            var o = 0.14 + (think ? 0.86 : 0.35) * Math.max(0, w);
            o = Math.round(o * 20) / 20;
            if (o !== c.o) { c.o = o; c.el.setAttribute('opacity', o); }
          }
        }
      }
    }

    function stillFrame() {
      t = 3.7;
      racks[0].act = racks[3].act = t + 1;
      racks.forEach(function (R, i) { R.level = [0.62, 0.4, 0.28, 0.55][i]; });
      var some = [[inR['S>0'], 0.55], [inR['E>3'], 0.4], [outR['1>D'], 0.5], [outR['0>K'], 0.7], [inR['W>1'], 0.3]];
      some.forEach(function (s) {
        if (!s[0]) return;
        spawn(s[0], null, 1);
      });
      var k = 0;
      pool.forEach(function (p) { if (p.alive) { p.d = p.route.len * some[k++][1]; placePacket(p); } });
      renderFrame(0);
      pool.forEach(function (p) { p.alive = false; });
      boxes.S && (boxes.S.until = t + 1);
      boxes.K && (boxes.K.until = t + 1);
      renderFrame(0);
      pool.forEach(function (p) { if (p.route) p.el.setAttribute('opacity', p.d > 0 ? 1 : 0); });
      updateStats(new Date());
    }

    function frame(ts) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      var dt = lastTs ? Math.min(0.1, (ts - lastTs) / 1000) : 0;
      lastTs = ts;
      t += dt;
      if (t >= nextLog) { emit(nextEvent()); nextLog = t + 1.2; }
      if (t >= nextAmb) { ambient(); nextAmb = t + 0.5 + Math.random() * 0.9; }
      for (var i = pending.length - 1; i >= 0; i--) if (pending[i].at <= t) { var f = pending[i].fn; pending.splice(i, 1); f(); }
      renderFrame(dt);
      stepTyping();
      var d = Date.now(), sec = Math.floor(d / 1000);
      if (sec !== lastSec) { lastSec = sec; clock.textContent = hms(new Date(d)); updateStats(d); }
    }

    /* ---------- prefill the log so it opens mid-shift ---------- */
    (function prefill() {
      var base = Date.now();
      for (var k = 7; k >= 1; k--) {
        var ev = nextEvent();
        if (!ev.at) ev.time = hms(new Date(base - k * 1200 - Math.random() * 400));
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
      if (reduce) { clock.textContent = hms(new Date()); updateStats(Date.now()); return; }
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
