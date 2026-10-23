/* Mother Machine · LG, la sala macchine. Un disegno a linee in prospettiva vera, fatto in codice.
   Il motore: ogni oggetto e' fatto di facce 3D (metri: x a destra, y in alto, z in profondita'; chi guarda sta a z=0).
   Le facce si proiettano sul foglio, si riempiono di nero (cosi' nascondono quello che sta dietro) e si contornano di
   bianco. Le facce girate dall'altra parte non si disegnano. Le linee si fanno piu' sottili con la distanza, i lati in
   ombra hanno il tratteggio, i bordi della stanza sbordano un poco, come nei disegni a mano.
   Muovendo il mouse si sposta la camera: la stanza si muove davvero in 3D. Sul telefono la stanza si trascina di lato.
   Tutto si ridisegna solo quando la camera si muove; le spie, il neon e il vapore sono animazioni CSS.
   Gli oggetti stanno qui sotto (la stanza) e in stanza-oggetti.js (gli oggetti con cui si gioca). */
(function () {
  var NS = 'http://www.w3.org/2000/svg', RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]] }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] }
  function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] }
  function cen(ps) { var c = [0, 0, 0]; ps.forEach(function (p) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2] }); return [c[0] / ps.length, c[1] / ps.length, c[2] / ps.length] }
  /* un sistema locale: origine, rotazione attorno all'asse verticale (yaw, radianti) */
  function frame(at, yaw) { var c = Math.cos(yaw || 0), s = Math.sin(yaw || 0);
    var f = function (p) { return [at[0] + p[0] * c + p[2] * s, at[1] + p[1], at[2] - p[0] * s + p[2] * c] };
    f.dir = function (n) { return [n[0] * c + n[2] * s, n[1], -n[0] * s + n[2] * c] }; return f }
  var ID = frame([0, 0, 0], 0);
  function el(p, tag, a) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e }

  /* ---------- la scena: un foglio, una camera, le sue parti ----------
     conf: W, H (il foglio), F (la focale), HY (l'orizzonte), cam {x,y}. conf.spin: un perno [x,y,z] attorno a cui la
     scena gira (yaw in S.yaw), per il primo piano degli oggetti; in quel caso anche le parti si riordinano a ogni giro. */
  function Scena(conf) {
    var S = { parts: [], hooks: [], cam: conf.cam, yaw: 0 }, W = conf.W, H = conf.H, F = conf.F, HY = conf.HY, cam = conf.cam, parts = S.parts;
    var piv = conf.spin, cy = 1, sy = 0;
    /* il punto come lo vede la camera: se la scena gira, prima lo si ruota attorno al perno */
    function tp(p) { if (!piv) return p; var x = p[0] - piv[0], z = p[2] - piv[2]; return [piv[0] + x * cy + z * sy, p[1], piv[2] - x * sy + z * cy] }
    function tn(n) { if (!piv) return n; return [n[0] * cy + n[2] * sy, n[1], -n[0] * sy + n[2] * cy] }
    function prj(p) { p = tp(p); var z = Math.max(p[2], .05); return [W / 2 + F * (p[0] - cam.x) / z, HY - F * (p[1] - cam.y) / z] }
    S.prj = prj; S.F = F;

    /* part(opt): opt.hot = cosa si apre cliccando, opt.cls = classe del gruppo, opt.label = l'etichetta */
    function part(opt) {
      opt = opt || {};
      var P = { faces: [], lines: [], cls: opt.cls || '', hot: opt.hot || '', label: opt.label || '', z: 0 };
      var api = {
        /* una faccia: punti 3D in ordine, n = normale verso fuori. o.fill: 'bk' (nero, default), 'red', 'or', 'none';
           o.hatch: numero di righe di tratteggio (lati in ombra); o.cls: classe; ritorna la faccia per appenderci dettagli */
        face: function (pts, n, o) { o = o || {}; var f = { pts: pts, n: n, fill: o.fill || 'bk', hatch: o.hatch || 0, hd: o.hd || 0, cls: o.cls || '', det: [] }; P.faces.push(f); return f },
        /* una linea (anche chiusa): o.cls 'dt' dettaglio sottile, 'cn' costruzione tratteggiata, 'or' arancione...; o.on = faccia */
        line: function (pts, o) { o = o || {}; var l = { pts: pts, cls: o.cls || '', closed: !!o.closed, over: o.over || 0, fill: o.fill || '' }; (o.on ? o.on.det : P.lines).push(l); return l },
        /* testo: at = punto 3D della linea di base, size = altezza in metri. Di base sta su un piano che guarda chi guarda;
           con o.u (direzione della riga) e o.v (l'alto delle lettere) sta su qualunque piano, in prospettiva */
        text: function (at, txt, size, o) { o = o || {}; var t = { text: 1, at: at, txt: txt, size: size, cls: o.cls || '', anchor: o.anchor || 'start', u: o.u, v: o.v }; (o.on ? o.on.det : P.lines).push(t); return t },
        /* immagine su un piano (per i loghi veri): at = angolo in alto a sinistra, w e h in metri, u = verso destra, v = verso l'alto */
        image: function (at, href, w, h, o) { o = o || {}; var im = { img: 1, at: at, href: href, w: w, h: h, u: o.u || [1, 0, 0], v: o.v || [0, 1, 0], cls: o.cls || '' }; (o.on ? o.on.det : P.lines).push(im); return im },
        /* scatola: angoli in coordinate locali [x0,y0,z0,x1,y1,z1], T = sistema locale. o.hatch = {l,r,t,b,f,k: righe}; o.fill per tutte */
        box: function (b, T, o) {
          T = T || ID; o = o || {}; var h = o.hatch || {}, x0 = b[0], y0 = b[1], z0 = b[2], x1 = b[3], y1 = b[4], z1 = b[5];
          var v = function (x, y, z) { return T([x, y, z]) }, d = T.dir, fl = o.fill, out = {};
          out.f = api.face([v(x0, y0, z0), v(x1, y0, z0), v(x1, y1, z0), v(x0, y1, z0)], d([0, 0, -1]), { fill: fl, hatch: h.f, cls: o.cls });
          out.k = api.face([v(x1, y0, z1), v(x0, y0, z1), v(x0, y1, z1), v(x1, y1, z1)], d([0, 0, 1]), { fill: fl, hatch: h.k, cls: o.cls });
          out.l = api.face([v(x0, y0, z1), v(x0, y0, z0), v(x0, y1, z0), v(x0, y1, z1)], d([-1, 0, 0]), { fill: fl, hatch: h.l, cls: o.cls });
          out.r = api.face([v(x1, y0, z0), v(x1, y0, z1), v(x1, y1, z1), v(x1, y1, z0)], d([1, 0, 0]), { fill: fl, hatch: h.r, cls: o.cls });
          out.t = api.face([v(x0, y1, z0), v(x1, y1, z0), v(x1, y1, z1), v(x0, y1, z1)], d([0, 1, 0]), { fill: fl, hatch: h.t, cls: o.cls });
          out.b = api.face([v(x0, y0, z1), v(x1, y0, z1), v(x1, y0, z0), v(x0, y0, z0)], d([0, -1, 0]), { fill: fl, hatch: h.b, cls: o.cls });
          return out;
        },
        /* prisma: un profilo 2D [[u,v],...] in senso antiorario (u = profondita' verso z+, v = altezza), estruso lungo x
           da x0 a x1 nel sistema locale. Serve per il cabinato, il furgone, i tubi (profilo poligonale). */
        prism: function (prof, x0, x1, T, o) {
          T = T || ID; o = o || {}; var d = T.dir, n = prof.length, out = { sides: [] };
          var A = prof.map(function (q) { return T([x0, q[1], q[0]]) }), B = prof.map(function (q) { return T([x1, q[1], q[0]]) });
          out.l = api.face(A.slice().reverse(), d([-1, 0, 0]), { fill: o.fill, hatch: o.hatchCap, cls: o.cls });
          out.r = api.face(B.slice(), d([1, 0, 0]), { fill: o.fill, hatch: o.hatchCap, cls: o.cls });
          for (var i = 0; i < n; i++) { var j = (i + 1) % n, du = prof[j][0] - prof[i][0], dv = prof[j][1] - prof[i][1], L = Math.hypot(du, dv) || 1;
            out.sides.push(api.face([A[i], A[j], B[j], B[i]], d([0, -du / L, dv / L]), { fill: o.fill, cls: o.cls, hatch: o.hatchSide && o.hatchSide(i) })) }
          return out;
        },
        /* tubo lungo z (cavi, condotte): centro [x,y], da z0 a z1, raggio r, k lati */
        tubeZ: function (x, y, z0, z1, r, o) { o = o || {}; var k = o.k || 8, Fs = [];
          for (var i = 0; i < k; i++) { var a0 = i / k * 2 * Math.PI, a1 = (i + 1) / k * 2 * Math.PI, m = (a0 + a1) / 2;
            Fs.push(api.face([[x + r * Math.cos(a0), y + r * Math.sin(a0), z0], [x + r * Math.cos(a1), y + r * Math.sin(a1), z0], [x + r * Math.cos(a1), y + r * Math.sin(a1), z1], [x + r * Math.cos(a0), y + r * Math.sin(a0), z1]],
              [Math.cos(m), Math.sin(m), 0], { fill: o.fill, cls: o.cls, hatch: Math.sin(m) < -.3 ? (o.hatch || 0) : 0 })) }
          return Fs },
        /* cerchio come linea chiusa, sul piano dato: 'z' (guarda chi guarda), 'x' (parete laterale), 'y' (pavimento) */
        circle: function (c, r, plane, o) { o = o || {}; var k = o.k || 28, pts = [];
          for (var i = 0; i < k; i++) { var a = i / k * 2 * Math.PI, u = r * Math.cos(a), w = r * Math.sin(a);
            pts.push(plane === 'x' ? [c[0], c[1] + w, c[2] + u] : plane === 'y' ? [c[0] + u, c[1], c[2] + w] : [c[0] + u, c[1] + w, c[2]]) }
          o.closed = true; return api.line(pts, o) },
        /* curva (cavi che pendono): bezier quadratica in 3D campionata */
        curve: function (a, c, b, o) { var pts = []; for (var i = 0; i <= 16; i++) { var t = i / 16; pts.push(lerp(lerp(a, c, t), lerp(c, b, t), t)) } return api.line(pts, o) },
        P: P
      };
      parts.push(P);
      return api;
    }
    S.part = part;

    function dpath(pts, closed, over) {
      if (pts.indexOf(null) >= 0) { var s0 = '', pen = 0; pts.forEach(function (p) { if (!p) { pen = 0; return } var q0 = prj(p); s0 += (pen ? 'L' : 'M') + q0[0].toFixed(1) + ' ' + q0[1].toFixed(1); pen = 1 }); return s0 }
      var q = pts.map(prj);
      if (over && q.length === 2) { var dx = q[1][0] - q[0][0], dy = q[1][1] - q[0][1], L = Math.hypot(dx, dy) || 1; dx *= over / L; dy *= over / L; q = [[q[0][0] - dx, q[0][1] - dy], [q[1][0] + dx, q[1][1] + dy]] }
      var s = 'M' + q.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1) }).join('L');
      return closed ? s + 'Z' : s;
    }
    function hatchD(f) {
      var p = f.pts, n = f.hatch; if (p.length !== 4 || !n) return '';
      var s = '', a = f.hd ? [p[0], p[3], p[1], p[2]] : [p[0], p[1], p[3], p[2]];
      for (var i = 1; i <= n; i++) { var t = i / (n + 1); s += dpath([lerp(a[0], a[1], t), lerp(a[2], a[3], t)]) }
      return s;
    }
    function vis(f) { var c = [cam.x, cam.y, 0]; return dot(sub(c, tp(f.pts[0])), tn(f.n)) > 1e-6 }
    function zOf(f) { var c = tp(f.c || (f.c = cen(f.pts))); return Math.hypot(c[0] - cam.x, c[1] - cam.y, c[2]) }

    S.build = function (svg, cls) {
      var g = S.g = el(svg, 'g', { class: cls || 'lgW' });
      parts.forEach(function (P) {
        var all = []; P.faces.forEach(function (f) { all = all.concat(f.pts) }); P.lines.forEach(function (l) { if (l.pts) all = all.concat(l.pts.filter(Boolean)); else all.push(l.at) });
        P.c = cen(all); var c = P.c; P.z = P.zf != null ? P.zf : c[2];
        P.w = conf.w ? conf.w : Math.max(.5, Math.min(2.6, 7.4 / Math.max(1, c[2])));
        P.op = conf.w ? 1 : Math.max(.42, Math.min(1, 1.25 - c[2] / 26));
      });
      parts.sort(function (a, b) { return b.z - a.z });
      parts.forEach(function (P, i) {
        P.g = el(g, 'g', { class: 'lgP ' + P.cls, style: '--w:' + P.w.toFixed(2) + ';--o:' + P.op.toFixed(2) + ';--i:' + i });
        if (P.hot) { P.g.setAttribute('data-hot', P.hot); P.g.setAttribute('tabindex', '0'); P.g.setAttribute('role', 'button'); P.g.setAttribute('aria-label', P.label || P.hot); P.g.classList.add('hot') }
        P.faces.forEach(function (f, n) {
          f.i = n; f.g = el(null, 'g', {});
          f.p = el(f.g, 'path', { class: 'dw fc ' + f.fill + ' ' + f.cls, pathLength: 1 });
          if (f.hatch) f.h = el(f.g, 'path', { class: 'dw ht', pathLength: 1 });
          f.det.forEach(function (l) { l.e = mk(f.g, l) });
        });
        P.lines.forEach(function (l) { l.e = mk(null, l) });
      });
      return g;
    };
    function mk(p, l) {
      if (l.img) { var im = el(p, 'image', { class: 'im ' + l.cls, width: 100, height: 100, preserveAspectRatio: 'none' }); im.setAttribute('href', l.href); return im }
      /* 'lab' qui e' 'tlab': la classe .lab del sito fissa le etichette a 11px e la prospettiva sparirebbe */
      if (l.text) { var t = el(p, 'text', { class: 'tx ' + l.cls.replace(/\blab\b/, 'tlab'), 'text-anchor': l.anchor }); t.textContent = l.txt; return t }
      var a = { class: 'ln ' + l.cls + (l.fill ? ' ' + l.fill : '') }; if (!/\bcn\b/.test(l.cls)) { a.pathLength = 1; a['class'] += ' dw' }
      return el(p, 'path', a);
    }
    function upd(l) {
      if (l.img) { /* l'immagine: il quadrato 100 x 100 portato sul piano, una matrice affine (va bene per le cose piccole) */
        var a0 = l.at, o0 = prj(a0), px = prj([a0[0] + l.u[0] * l.w, a0[1] + l.u[1] * l.w, a0[2] + l.u[2] * l.w]), py = prj([a0[0] - l.v[0] * l.h, a0[1] - l.v[1] * l.h, a0[2] - l.v[2] * l.h]);
        l.e.setAttribute('transform', 'matrix(' + [(px[0] - o0[0]) / 100, (px[1] - o0[1]) / 100, (py[0] - o0[0]) / 100, (py[1] - o0[1]) / 100, o0[0], o0[1]].map(function (n) { return n.toFixed(4) }).join(' ') + ')'); return }
      if (l.text) {
        if (l.u) { /* in prospettiva: la riga e l'alto delle lettere proiettati, una matrice per il testo alto 1 */
          var o = prj(l.at), pu = prj([l.at[0] + l.u[0] * l.size, l.at[1] + l.u[1] * l.size, l.at[2] + l.u[2] * l.size]), pv = prj([l.at[0] + l.v[0] * l.size, l.at[1] + l.v[1] * l.size, l.at[2] + l.v[2] * l.size]);
          /* scritto a 100 e ridotto: i browser non disegnano i caratteri piu' piccoli di qualche pixel */
          l.e.setAttribute('font-size', '100'); l.e.setAttribute('transform', 'matrix(' + [(pu[0] - o[0]) / 100, (pu[1] - o[1]) / 100, (o[0] - pv[0]) / 100, (o[1] - pv[1]) / 100, o[0], o[1]].map(function (n) { return n.toFixed(4) }).join(' ') + ')'); return }
        var q = prj(l.at), z = tp(l.at)[2]; l.e.setAttribute('x', q[0].toFixed(1)); l.e.setAttribute('y', q[1].toFixed(1)); l.e.setAttribute('font-size', (F * l.size / Math.max(.3, z)).toFixed(2)); return }
      l.e.setAttribute('d', dpath(l.pts, l.closed, l.over));
    }
    S.render = function () {
      if (piv) { cy = Math.cos(S.yaw); sy = Math.sin(S.yaw);
        /* quando la scena gira, anche le parti si riordinano: la piu' lontana prima */
        var ps = parts.slice().sort(function (a, b) { return tp(b.c)[2] - tp(a.c)[2] });
        ps.forEach(function (P) { S.g.appendChild(P.g) }) }
      S.hooks.forEach(function (h) { h() });
      parts.forEach(function (P) {
        /* le facce visibili, dalla piu' lontana; nella pagina si spostano solo se l'ordine e' cambiato */
        var fs = [];
        P.faces.forEach(function (f) { f.v = vis(f); if (f.v) { f.k = zOf(f); fs.push(f) } else if (f.g.parentNode) f.g.parentNode.removeChild(f.g) });
        fs.sort(function (a, b) { return b.k - a.k });
        var ord = fs.map(function (f) { return f.i }).join(','), move = ord !== P.ord; P.ord = ord;
        fs.forEach(function (f) {
          f.p.setAttribute('d', dpath(f.pts, true));
          if (f.h) f.h.setAttribute('d', hatchD(f));
          f.det.forEach(upd);
          if (move || !f.g.parentNode) P.g.appendChild(f.g);
        });
        P.lines.forEach(function (l) { upd(l); if (move || !l.e.parentNode) P.g.appendChild(l.e) });
      });
    };
    return S;
  }
  window.STANZA_SCENA = Scena; window.STANZA_FRAME = frame;

  /* la scena della stanza */
  var W = 1600, H = 900, F = 700, HY = .47 * H;
  var cam = { x: 0, y: 1.6 }, to = { x: 0, y: 1.6 };
  var SC = Scena({ W: W, H: H, F: F, HY: HY, cam: cam });
  var part = SC.part, prj = SC.prj, hooks = SC.hooks, render = SC.render, parts = SC.parts;
  var svg, defs, gAll;
  function build() { gAll = SC.build(svg) }

  /* l'ascensore: quanto sono aperte le porte (0 chiuse, 1 aperte) e la cabina da ritagliare */
  var LIFT = { s: RM ? 0 : 1 };
  /* la leva della luce: 0 su (accesa), 1 giu' (spenta) */
  var LEVA = { s: 0 };

  /* ---------- la stanza ---------- */
  var X = 5.6, Y = 3.3, Z0 = 1.2, Z1 = 11.5;
  function stanza() {
    /* il guscio: pavimento a piastrelle, pareti a pannelli, soffitto. Solo linee: si vede attraverso */
    var s = part({ cls: 'room' });
    var ov = 10;
    [[-X, 0], [X, 0], [-X, Y], [X, Y]].forEach(function (c) { s.line([[c[0], c[1], Z0], [c[0], c[1], Z1]], { over: ov, cls: 'edge' }) });
    s.line([[-X, 0, Z1], [X, 0, Z1], [X, Y, Z1], [-X, Y, Z1]], { closed: true, cls: 'edge' });
    /* il muro di fondo in blocchi di cemento: corsi orizzontali e giunti sfalsati, appena accennati */
    var bw = part({ cls: 'blocks' });
    /* i corsi si interrompono sul vano dell'ascensore: dentro la cabina niente mattoni */
    var VA = .62, VB = 2.58, VY = 2.28;
    for (var yb = .2, r = 0; yb < Y; yb += .2, r++) {
      if (yb < VY) bw.line([[-X, yb, Z1 - .001], [VA, yb, Z1 - .001], null, [VB, yb, Z1 - .001], [X, yb, Z1 - .001]], { cls: 'bk2' });
      else bw.line([[-X, yb, Z1 - .001], [X, yb, Z1 - .001]], { cls: 'bk2' });
      var jt = []; for (var xb = -X + (r % 2 ? .2 : .4); xb < X; xb += .4) { if (yb - .2 < VY && xb > VA && xb < VB) continue; jt.push([xb, yb - .2, Z1 - .001], [xb, yb, Z1 - .001], null) }
      bw.line(jt, { cls: 'bk2' }) }
    /* il mirino sul punto di fuga, lasciato come nei disegni tecnici */
    for (var z = 2; z < Z1; z += 1.2) s.line([[-X, 0, z], [X, 0, z]], { cls: 'fl' });
    for (var x = -X + 1.4; x < X; x += 1.4) s.line([[x, 0, Z0], [x, 0, Z1]], { cls: 'fl' });
    for (var z2 = 2.6; z2 < Z1; z2 += 2.2) { s.line([[-X, 0, z2], [-X, Y, z2]], { cls: 'dt' }); s.line([[X, 0, z2], [X, Y, z2]], { cls: 'dt' }) }
    /* zoccolo e la riga gialla di sicurezza, ripassata */
    s.line([[-X, .14, Z0], [-X, .14, Z1]], { cls: 'dt' }); s.line([[X, .14, Z0], [X, .14, Z1]], { cls: 'dt' });
    s.line([[-X, .14, Z1], [X, .14, Z1]], { cls: 'dt' });
    /* le linee di costruzione verso il punto di fuga: lasciate, come in un disegno che si sta facendo */

    /* soffitto: travi a ritmo, e tra una trave e l'altra la condotta dell'aria, i tubi, le plafoniere.
       Le cose lunghe sono spezzate a tratti, cosi' si ordinano bene in profondita' con le travi */
    var ZB = [];
    for (var zb = 3.0; zb < Z1; zb += 2.15) ZB.push(zb);
    ZB.forEach(function (zb) { var bm = part({ cls: 'beam' }); bm.box([-X, 3.04, zb, X, Y, zb + .24], ID, { hatch: { f: 0, b: 0 } }) });
    var tr0 = ZB.map(function (z) { return z + .24 });
    tr0.forEach(function (za, i) {
      var zb = i + 1 < ZB.length ? ZB[i + 1] : Z1 - .02;
      var d = part({ cls: 'ceil' }); var db = d.box([-4.9, 2.62, za, -3.95, 2.98, zb], ID, { hatch: { r: 3 } });
      d.line([[-3.95, 2.62, za + .05], [-3.95, 2.62, zb - .05]], { cls: 'dt', on: db.b });
      /* a destra un binario di luce: una scatola chiusa con la striscia accesa sotto, come le plafoniere */
      var t1 = part({ cls: 'ceil rail' }), rb = t1.box([3.3, 2.82, za + .05, 3.8, 2.98, zb - .05], ID, { hatch: { l: 2 } });
      t1.line([[3.42, 2.819, za + .12], [3.42, 2.819, zb - .12]], { cls: 'tube', on: rb.b }); t1.line([[3.68, 2.819, za + .12], [3.68, 2.819, zb - .12]], { cls: 'tube', on: rb.b });
      var t2 = part({ cls: 'ceil' }); t2.tubeZ(4.25, 2.95, za, zb, .045, { k: 6 });
      /* le staffe: un tirante dal soffitto e il collare attorno a ogni tubo, a meta' tratto */
      var zm = (za + zb) / 2;
      t1.line([[3.55, 2.98, zm], [3.55, Y, zm]], { cls: 'dt' });
      t2.line([[4.25, 2.995, zm + .3], [4.25, Y, zm + .3]], { cls: 'dt' }); t2.circle([4.25, 2.95, zm + .3], .06, 'z', { k: 10, cls: 'clamp' });
      /* la plafoniera: un pannello piatto sotto il soffitto, la luce che cade come una pozza sul pavimento */
      if (i + 1 < ZB.length) {
        var l = part({ cls: 'lamp' });
        var lb = l.box([-.3, 2.86, za + .45, .3, 2.94, zb - .45], ID, { hatch: { f: 0 } });
        /* i due tiranti che la tengono appesa, e le stecche del diffusore */
        l.line([[0, 2.94, za + .7], [0, Y, za + .7]], { cls: 'dt' }); l.line([[0, 2.94, zb - .7], [0, Y, zb - .7]], { cls: 'dt' });
        for (var zd = za + .65; zd < zb - .5; zd += .25) l.line([[-.3, 2.86, zd], [.3, 2.86, zd]], { cls: 'dt', on: lb.b });
        l.line([[-.2, 2.855, za + .5], [-.2, 2.855, zb - .5]], { cls: 'tube', on: lb.b }); l.line([[.2, 2.855, za + .5], [.2, 2.855, zb - .5]], { cls: 'tube', on: lb.b });
        /* le cose stese sul pavimento si disegnano per prime: tappeto e mobili ci passano sopra */
        var pz = part({ cls: 'pool' }); pz.P.zf = 1e3; pz.circle([0, .004, (za + zb) / 2], 1.25, 'y', { cls: 'cn', k: 36 });
      }
    });
    /* la canalina dei cavi sopra i server */
    var tr = part({ cls: 'ceil' });
    var tb = tr.box([-5.55, 2.5, 3.9, -4.4, 2.6, 9.9], ID, {});
    for (var zt = 4.2; zt < 9.9; zt += .5) tr.line([[-5.55, 2.6, zt], [-4.4, 2.6, zt]], { cls: 'dt', on: tb.t });
  }

  /* i server, lungo la parete di sinistra: le spie lampeggiano (porta a Systems) */
  function server() {
    var p = part({ cls: 'rack', hot: 'systems', label: 'Server racks. Go to Systems, floor 02' });
    for (var i = 0; i < 4; i++) {
      var z0 = 4.4 + i * 1.32, z1 = z0 + 1.22, xf = -4.55;
      var b = p.box([-5.55, 0, z0, xf, 2.3, z1], ID, { hatch: { k: 0 } });
      /* la faccia davanti (verso il corridoio) e' la destra della scatola */
      var f = b.r;
      for (var u = .25; u < 2.2; u += .14) p.line([[xf, u, z0 + .1], [xf, u, z1 - .1]], { cls: 'dt', on: f });
      p.line([[xf, .1, z0 + .08], [xf, 2.22, z0 + .08], [xf, 2.22, z1 - .08], [xf, .1, z1 - .08]], { closed: true, on: f });
      for (var k = 0; k < 11; k++) { var y = .32 + k * .17, z = z0 + .22;
        p.line([[xf, y, z], [xf, y + .04, z], [xf, y + .04, z + .05], [xf, y, z + .05]], { closed: true, cls: 'led ' + (k % 3 ? 'w' : 'o'), on: f });
        p.line([[xf, y + .02, z + .12], [xf, y + .02, z + .38 + (k * 7 % 5) * .08]], { cls: 'dt', on: f }) }
      p.text([xf + .001, 2.06, z0 + .12], 'R0' + (i + 1), .08, { cls: 'lab', on: f, u: [0, 0, 1], v: [0, 1, 0] });
      /* i cavi che salgono nella canalina */
      p.curve([-5.1, 2.3, z0 + .4], [-5.0, 2.6, z0 + .2], [-5.0, 2.52, z0 + .6], { cls: 'dt' });
      p.curve([-4.9, 2.3, z0 + .8], [-4.75, 2.7, z0 + .9], [-4.8, 2.52, z0 + 1.1], { cls: 'dt' });
    }
  }

  /* il quadro elettrico sul muro di fondo, nell'angolo a sinistra: le leve spengono la stanza */
  function quadro() {
    var p = part({ cls: 'fuse', hot: 'luce', label: 'Fuse box. Lights off and on' });
    var z = Z1 - .3, x0 = -5.4, x1 = -4.55;
    var b = p.box([x0, .95, z, x1, 2.15, Z1 - .01], ID, { hatch: { r: 4 } });
    var f = b.f;
    p.line([[x0 + .05, 1.0, z], [x1 - .05, 1.0, z], [x1 - .05, 2.1, z], [x0 + .05, 2.1, z]], { closed: true, cls: 'dt', on: f });
    /* il cartello del pericolo in alto: triangolo e fulmine pieni, ben lontani dalle leve */
    var cx = (x0 + x1) / 2;
    p.line([[cx - .14, 1.8, z], [cx + .14, 1.8, z], [cx, 2.04, z]], { closed: true, cls: 'warn', on: f });
    p.line([[cx + .015, 1.99, z], [cx - .045, 1.89, z], [cx - .005, 1.89, z], [cx - .02, 1.82, z], [cx + .045, 1.93, z], [cx + .005, 1.93, z]], { closed: true, cls: 'bolt', on: f });
    /* tre leve: la base disegnata sul quadro (sempre visibile), il braccio che esce verso chi guarda, il pomello pieno */
    for (var i = 0; i < 3; i++) { var x = x0 + .17 + i * .25;
      p.line([[x, 1.12, z], [x + .12, 1.12, z], [x + .12, 1.4, z], [x, 1.4, z]], { closed: true, cls: 'lbase', on: f });
      var lv = p.line([[x + .06, 1.36, z], [x + .06, 1.58, z - .24]], { cls: 'lever' });
      var kn = p.circle([x + .06, 1.58, z - .24], .04, 'z', { cls: 'knob', k: 12 });
      /* la leva di destra e' quella della luce: spegnendo scende, riaccendendo risale */
      if (i === 2) (function (lv, kn) { var su = lv.pts[1].slice(), giu = [su[0], 1.14, su[2]], kb = kn.pts.map(function (q) { return q.slice() });
        hooks.push(function () { var e = [su[0], su[1] + (giu[1] - su[1]) * LEVA.s, su[2]]; lv.pts[1] = e;
          kn.pts = kb.map(function (q) { return [q[0], q[1] + e[1] - su[1], q[2]] }) }) })(lv, kn) }
    /* il tubo che sale nel soffitto */
    p.line([[x0 + .3, 2.15, Z1 - .1], [x0 + .3, Y, Z1 - .1]], { cls: 'dt' });
    p.line([[x0 + .36, 2.15, Z1 - .1], [x0 + .36, Y, Z1 - .1]], { cls: 'dt' });
  }

  /* in fondo: l'ascensore, quello che ti ha portato quaggiu'. Cornice, due porte, il display LG, la pulsantiera di fuori
     con un tasto solo: su, perche' piu' giu' di cosi' non si va. Premuto, apre la pulsantiera del sito */
  function ascensore() {
    var p = part({ cls: 'lift', hot: 'lift', label: 'Lift. Pick a floor' });
    var zc = Z1, x0 = .35, x1 = 2.85, xa = .62, xb = 2.58, yt = 2.28, d = .16;
    /* le porte, appena rientrate, con la fessura in mezzo e la spazzolatura */
    var dl = p.face([[xa, 0, zc - .03], [1.6, 0, zc - .03], [1.6, yt, zc - .03], [xa, yt, zc - .03]], [0, 0, -1], {});
    var dr = p.face([[1.6, 0, zc - .03], [xb, 0, zc - .03], [xb, yt, zc - .03], [1.6, yt, zc - .03]], [0, 0, -1], {});
    /* porte lisce: solo lo zoccolo in basso e una riga di luce in alto */
    [[dl, xa, 1.6], [dr, 1.6, xb]].forEach(function (q) { p.line([[q[1], .16, zc - .031], [q[2], .16, zc - .031]], { cls: 'dt', on: q[0] }); p.line([[q[1], yt - .08, zc - .031], [q[2], yt - .08, zc - .031]], { cls: 'brush', on: q[0] }) });
    p.line([[1.6, 0, zc - .032], [1.6, yt, zc - .032]], { on: dl });
    /* le porte si aprono: scorrono dentro gli stipiti (si stringono verso i lati), tutto ricalcolato a ogni fotogramma */
    [dl, dr].forEach(function (f) { f.base = f.pts.map(function (q) { return q.slice() }); f.det.forEach(function (l) { l.base = l.pts.map(function (q) { return q.slice() }) }) });
    hooks.push(function () { var k = 1 - LIFT.s * .97;
      function sx(q, sin) { return [sin ? xa + (q[0] - xa) * k : xb - (xb - q[0]) * k, q[1], q[2]] }
      [[dl, 1], [dr, 0]].forEach(function (d) { var f = d[0]; f.pts = f.base.map(function (q) { return sx(q, d[1]) }); f.c = null;
        f.det.forEach(function (l) { l.pts = l.base.map(function (q) { return sx(q, d[1]) }) }) }) });
    /* dentro: la cabina accesa, vista solo attraverso la porta (ritagliata dal suo vano) */
    var c = part({ cls: 'cabin' }), zb = zc + 1.5;
    var cw = c.face([[xa, 0, zb], [xb, 0, zb], [xb, yt, zb], [xa, yt, zb]], [0, 0, -1], { fill: 'cabw' });
    c.face([[xa, 0, zc], [xa, 0, zb], [xa, yt, zb], [xa, yt, zc]], [1, 0, 0], { fill: 'cab', hatch: 6 });
    c.face([[xb, 0, zb], [xb, 0, zc], [xb, yt, zc], [xb, yt, zb]], [-1, 0, 0], { fill: 'cab', hatch: 6 });
    var cf = c.face([[xa, 0, zc], [xb, 0, zc], [xb, 0, zb], [xa, 0, zb]], [0, 1, 0], { fill: 'cab' });
    var cc = c.face([[xa, yt, zb], [xb, yt, zb], [xb, yt, zc], [xa, yt, zc]], [0, -1, 0], { fill: 'cabw' });
    c.line([[xa + .1, .95, zb - .001], [xb - .1, .95, zb - .001]], { cls: 'rail', on: cw });
    c.line([[1.15, 1.05, zb - .001], [2.05, 1.05, zb - .001], [2.05, 2.0, zb - .001], [1.15, 2.0, zb - .001]], { closed: true, cls: 'dt', on: cw });
    c.line([[1.25, yt - .001, zc + .3], [1.95, yt - .001, zc + .3], [1.95, yt - .001, zb - .3], [1.25, yt - .001, zb - .3]], { closed: true, cls: 'cabl', on: cc });
    for (var g = xa + .25; g < xb; g += .25) c.line([[g, .001, zc], [g, .001, zb]], { cls: 'dt', on: cf });
    /* la luce che esce sul pavimento quando le porte sono aperte */
    var sp = part({ cls: 'lspill' }); sp.P.zf = 1e3;
    sp.face([[xa, .002, zc - .02], [xb, .002, zc - .02], [xb + .7, .002, zc - 2.6], [xa - .7, .002, zc - 2.6]], [0, 1, 0], { fill: 'spill' });
    LIFT.cab = c.P; LIFT.vano = [[xa, 0, zc], [xb, 0, zc], [xb, yt, zc], [xa, yt, zc]];
    /* la cornice: due stipiti e l'architrave che sporgono dal muro */
    p.box([x0, 0, zc - d, xa, yt, zc], ID, { hatch: { r: 5 } });
    p.box([xb, 0, zc - d, x1, yt, zc], ID, { hatch: { l: 5 } });
    var hd = p.box([x0, yt, zc - d, x1, yt + .2, zc], ID, { hatch: { b: 3 } });
    /* il display sopra: LG in arancione e la freccia */
    var ds = p.box([1.24, 2.58, zc - .07, 1.96, 2.86, zc], ID, {});
    p.text([1.38, 2.645, zc - .071], 'LG', .17, { cls: 'ldisp', on: ds.f });
    p.line([[1.74, 2.78, zc - .071], [1.84, 2.78, zc - .071], [1.79, 2.68, zc - .071]], { closed: true, cls: 'or', on: ds.f });
    /* la pulsantiera di fuori: un tasto, su */
    var pl = p.box([2.98, 1.0, zc - .03, 3.2, 1.48, zc], ID, {});
    p.circle([3.09, 1.24, zc - .031], .065, 'z', { cls: 'or ring', k: 16, on: pl.f });
    p.line([[3.06, 1.21, zc - .032], [3.12, 1.21, zc - .032], [3.09, 1.27, zc - .032]], { closed: true, cls: 'or', on: pl.f });
    p.text([3.09, 1.39, zc - .031], 'UP', .045, { cls: 'lab', anchor: 'middle', on: pl.f });
    /* davanti, a terra: il riquadro da lasciare libero, a strisce */
    var y = .003, za = zc - 1.3;
    p.line([[x0, y, za], [x1, y, za], [x1, y, zc - .02], [x0, y, zc - .02]], { closed: true, cls: 'cn walk' });
    var st = []; for (var s = 0; s < 10; s++) { var xs = x0 + .1 + s * .24; st.push([xs, y, za + .08], [Math.min(x1 - .05, xs + .5), y, zc - .2], null) }
    p.line(st, { cls: 'strip' });
  }

  /* il neon del marchio: la m del logo, due archi con le aste lunghe e due archi piccoli sotto, in tubo doppio */
  function neon() {
    var p = part({ cls: 'neon' });
    var zc = Z1 - .03, s = 2.05 / 1468, ox = -3.15, oy = .75, k = 18;
    function m(u, v) { return [ox + u * s, oy + (1468 - v) * s, zc] }
    var D = [[190.5, 190.5, 1277], [489.5, 190.5, 1277], [190.5, 1130.5, 40], [489.5, 1130.5, 40]];
    D.forEach(function (a) { var pts = [m(a[0] - 149.5, a[1] + a[2])];
      for (var i = 0; i <= k; i++) { var t = Math.PI + i / k * Math.PI; pts.push(m(a[0] + 149.5 * Math.cos(t), a[1] + 149.5 * Math.sin(t))) }
      pts.push(m(a[0] + 149.5, a[1] + a[2]));
      p.line(pts.map(function (q) { return [q[0] + .05, q[1] - .06, zc + .02] }), { cls: 'nshadow' });
      p.line(pts, { cls: 'ndead' }); p.line(pts, { cls: 'nglow' }); p.line(pts, { cls: 'ntube' }); p.line(pts, { cls: 'ncore' }) });
    /* le staffe e il cavo che scende */
    [[60, 300], [620, 300], [60, 1300], [620, 1300]].forEach(function (q) { var a = m(q[0], q[1]); p.line([a, [a[0], a[1], a[2] + .03]], { cls: 'dt' }); p.line([[a[0] - .03, a[1], zc + .02], [a[0] + .03, a[1], zc + .02]], { cls: 'dt' }) });
    var e = m(489.5 + 149.5, 1467);
    p.curve(e, [e[0] + .3, .2, zc], [e[0] + .9, .02, zc - .3], { cls: 'dt' });
    /* "Staff only": la scritta al neon sopra il caveau, che sfarfalla */
    var t = part({ cls: 'neon2' });
    t.text([3.95, 2.3, Z1 - .03], 'STAFF ONLY', .17, { cls: 'nsign', anchor: 'middle' });
  }

  /* la luce del neon: una chiazza calda sul muro e una sul pavimento (gradienti, niente filtri). Le disegna il motore
     sotto tutto il resto; il neon le accende e le spegne insieme a se' */
  var spill = [];
  function luceNeon() {
    var g = el(null, 'g', { class: 'nspill' });
    var gr = el(defs, 'radialGradient', { id: 'lgSpill' });
    el(gr, 'stop', { offset: '0', 'stop-color': '#FF5B3A', 'stop-opacity': '.34' }); el(gr, 'stop', { offset: '1', 'stop-color': '#FF5B3A', 'stop-opacity': '0' });
    var w = el(g, 'ellipse', { fill: 'url(#lgSpill)' }), f = el(g, 'ellipse', { fill: 'url(#lgSpill)', opacity: '.6' });
    gAll.insertBefore(g, gAll.firstChild);
    hooks.push(function () {
      var c = prj([-2.65, 1.7, Z1]), e = prj([-.65, 1.7, Z1]), r = e[0] - c[0];
      w.setAttribute('cx', c[0].toFixed(1)); w.setAttribute('cy', c[1].toFixed(1)); w.setAttribute('rx', (r * 1.3).toFixed(1)); w.setAttribute('ry', (r * 1.1).toFixed(1));
      var a = prj([-2.65, 0, Z1 - 1.4]), b = prj([-.85, 0, Z1 - 1.4]), d = prj([-2.65, 0, Z1 - 2.6]);
      f.setAttribute('cx', a[0].toFixed(1)); f.setAttribute('cy', a[1].toFixed(1)); f.setAttribute('rx', (b[0] - a[0]).toFixed(1)); f.setAttribute('ry', Math.max(4, d[1] - a[1]).toFixed(1));
    });
    return g;
  }
  /* lo sfarfallio del neon: mai uguale. Ogni 3-9 secondi un capriccio: due lampi, un buio, un ronzio a mezza luce */
  function capricci(nodes) {
    var seq = [[[0, 70], [1, 50], [0, 130], [1, 0]], [[.35, 900], [1, 0]], [[0, 60], [1, 40], [0, 60], [1, 30], [0, 700], [1, 80], [0, 50], [1, 0]], [[0, 1400], [.5, 90], [0, 120], [1, 0]], [[.6, 120], [1, 80], [.6, 140], [1, 0]]];
    var on = true, T;
    function set(v) { nodes.forEach(function (n) { n.style.opacity = v }) }
    function play(s, i) { if (i >= s.length) { plan(); return } set(s[i][0]); T = setTimeout(function () { play(s, i + 1) }, s[i][1]) }
    function plan() { clearTimeout(T); if (!on) return; T = setTimeout(function () { play(seq[Math.random() * seq.length | 0], 0) }, 3000 + Math.random() * 6000) }
    return { start: function () { if (on && T) return; on = true; plan() }, stop: function () { on = false; clearTimeout(T); T = 0; set(1) } };
  }

  /* scatoloni, il carrello, i cavi per terra */
  function disordine() {
    var p = part({ cls: 'mess' });
    var a = p.box([3.3, 0, 10.6, 4.15, .62, 11.4], ID, { hatch: { l: 5 } }); p.line([[3.72, .62, 10.6], [3.72, .62, 11.4]], { cls: 'dt', on: a.t }); p.text([3.42, .26, 10.599], 'FRAGILE', .09, { cls: 'lab', on: a.f });
    var p2 = part({ cls: 'mess' });
    var b = p2.box([3.45, .62, 10.75, 4.0, .98, 11.25], ID, { hatch: { l: 4 } }); p2.text([3.52, .74, 10.749], 'CABLES', .07, { cls: 'lab', on: b.f });
    var p3 = part({ cls: 'mess' });
    p3.box([4.35, 0, 10.75, 5.1, .45, 11.42], ID, { hatch: { l: 4 } });
    var c = part({ cls: 'mess' }); c.P.zf = 1e3;
    c.curve([-4.6, .01, 6], [-2.4, .01, 4.4], [-1.9, .01, 7.4], { cls: 'cable' });
    c.curve([-4.6, .01, 8.2], [-1.2, .01, 8.6], [.2, .01, 9.6], { cls: 'cable' });
    c.curve([.2, .01, 9.6], [.8, .01, 10.4], [.9, .01, Z1 - .5], { cls: 'cable' });
  }

  /* la soglia dell'ascensore, davanti ai piedi: il piano LG */
  function soglia() {
    var p = part({ cls: 'sill' });
    var b = p.box([-1.3, 0, 1.25, 1.3, .03, 1.6], ID, {});
    for (var x = -1.2; x < 1.25; x += .18) p.line([[x, .031, 1.3], [x + .1, .031, 1.55]], { cls: 'dt', on: b.t });
  }

  /* ---------- avvio ---------- */
  function init() {
    var st = document.querySelector('.lgst'); if (!st) return;
    svg = st.querySelector('svg');
    stanza(); server(); quadro(); ascensore(); neon(); disordine(); soglia();
    if (window.STANZA_OGGETTI) window.STANZA_OGGETTI({ part: part, frame: frame, ID: ID, X: X, Y: Y, Z0: Z0, Z1: Z1 });
    defs = el(svg, 'defs', {});
    build(); var sp = luceNeon();
    /* la cabina si vede solo dal vano della porta; la luce sul pavimento sfuma verso chi guarda */
    var cp = el(el(defs, 'clipPath', { id: 'lgCab' }), 'polygon', {});
    var lg = el(defs, 'linearGradient', { id: 'lgLiftG', x1: 0, y1: 0, x2: 0, y2: 1 });
    el(lg, 'stop', { offset: 0, 'stop-color': '#FFE9D6', 'stop-opacity': .42 }); el(lg, 'stop', { offset: 1, 'stop-color': '#FFE9D6', 'stop-opacity': 0 });
    if (LIFT.cab) { LIFT.cab.g.setAttribute('clip-path', 'url(#lgCab)'); hooks.push(function () { cp.setAttribute('points', LIFT.vano.map(function (q) { var r = prj(q); return r[0].toFixed(1) + ',' + r[1].toFixed(1) }).join(' ')) }) }
    render();
    /* il pulviscolo nella luce delle plafoniere: pochi puntini che salgono piano */
    if (!RM) { var du = el(gAll, 'g', { class: 'dust' });
      [[0, 4.1], [0, 6.3], [0, 8.4]].forEach(function (c, n) { var q = prj([c[0], 1.6, c[1]]), s = F / c[1];
        for (var i = 0; i < 7; i++) el(du, 'circle', { cx: (q[0] + (Math.random() - .5) * s * 1.6).toFixed(1), cy: (q[1] + (Math.random() - .3) * s * 1.4).toFixed(1), r: (.6 + Math.random() * 1.1).toFixed(2),
          style: 'animation-duration:' + (7 + Math.random() * 7).toFixed(1) + 's;animation-delay:-' + (Math.random() * 9).toFixed(1) + 's' }) }) }
    /* l'arrivo: le linee si disegnano, dal fondo verso chi guarda; poi le facce si riempiono */
    var wrap = st.querySelector('.lgsv');
    if (!RM) { st.classList.add('pre'); requestAnimationFrame(function () { requestAnimationFrame(function () { st.classList.remove('pre'); st.classList.add('drawn'); setTimeout(function () { st.classList.add('done') }, 4800) }) }) } else st.classList.add('drawn', 'done');
    /* la camera segue il mouse, piano */
    var fine = matchMedia('(hover:hover) and (pointer:fine)').matches, raf = 0, on = true;
    function tick() { raf = 0; if (!on) return; var dx = to.x - cam.x, dy = to.y - cam.y; cam.x += dx * .08; cam.y += dy * .08; render(); if (Math.abs(dx) + Math.abs(dy) > .0008) raf = requestAnimationFrame(tick) }
    if (fine && !RM) st.addEventListener('pointermove', function (e) { var r = st.getBoundingClientRect(); to.x = ((e.clientX - r.left) / r.width - .5) * 1.1; to.y = 1.6 - ((e.clientY - r.top) / r.height - .5) * .34; if (!raf) raf = requestAnimationFrame(tick) }, { passive: true });
    /* lo sfarfallio spegne la luce, non il vetro: il tubo spento resta visibile */
    var nn = [].slice.call(svg.querySelectorAll('.lgP.neon .nglow, .lgP.neon .ntube, .lgP.neon .ncore, .lgP.neon .nshadow')).concat([sp]), cap = capricci(nn);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { on = es[0].isIntersecting; st.classList.toggle('lg-off', !on); if (RM) return; on ? setTimeout(cap.start, 3200) : cap.stop() }).observe(st);
    /* le cose da premere: il contorno si accende, un'etichetta segue il mouse; con la tastiera Tab e Invio */
    var tip = document.createElement('div'); tip.className = 'lgtip mo'; tip.setAttribute('aria-hidden', 'true'); st.appendChild(tip);
    var hint = document.createElement('p'); hint.className = 'lghint mo'; hint.textContent = fine ? 'Move to look around · Click what glows' : 'Drag to look around · Tap what glows'; st.appendChild(hint);
    function hotOf(e) { var n = e.target; while (n && n !== svg) { if (n.classList && n.classList.contains('hot')) return n; n = n.parentNode } return null }
    svg.addEventListener('pointerover', function (e) { var h = hotOf(e); if (!h) { tip.classList.remove('on'); return } tip.textContent = h.getAttribute('aria-label'); tip.classList.add('on') });
    svg.addEventListener('pointermove', function (e) { var r = st.getBoundingClientRect(); tip.style.transform = 'translate(' + (e.clientX - r.left + 16) + 'px,' + (e.clientY - r.top + 18) + 'px)' }, { passive: true });
    svg.addEventListener('pointerleave', function () { tip.classList.remove('on') });
    svg.addEventListener('click', function (e) { var h = hotOf(e); if (h) azione(h) });
    svg.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('hot')) { e.preventDefault(); azione(e.target) } });
    function clack() { try { var a = new (window.AudioContext || window.webkitAudioContext)(), o = a.createOscillator(), v = a.createGain(); o.type = 'square'; o.frequency.setValueAtTime(90, a.currentTime); v.gain.setValueAtTime(.08, a.currentTime); v.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .09); o.connect(v); v.connect(a.destination); o.start(); o.stop(a.currentTime + .1) } catch (x) {} }
    function azione(h) {
      var k = h.getAttribute('data-hot'), r = h.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      tip.classList.remove('on');
      if (k === 'arcade' && window.RUSH) window.RUSH.open(x, r.top + r.height / 3);
      /* l'ascensore apre la pulsantiera del sito */
      else if (k === 'lift') porte(true, function () { var d = document.getElementById('dispB'); if (d && d.getAttribute('aria-expanded') !== 'true') d.click() });
      else if (k === 'luce') { var giu = !st.classList.contains('dark'), s0 = LEVA.s, t0 = performance.now();
        /* prima la leva scende (o risale), poi lo scatto e la luce */
        (function f(n) { var u = Math.min(1, (n - t0) / (RM ? 1 : 220)); LEVA.s = s0 + ((giu ? 1 : 0) - s0) * u * u; render();
          if (u < 1) requestAnimationFrame(f); else { clack(); st.classList.toggle('dark', giu); h.classList.toggle('on', giu) } })(t0) }
      /* il resto viene in primo piano: l'oggetto che gira, o la sua finestra */
      else if (window.LGVISTA) window.LGVISTA.open(k, x, y);
    }
    /* le porte dell'ascensore: il ding, poi scorrono in 0,9 secondi */
    function ding() { try { var a = new (window.AudioContext || window.webkitAudioContext)(); [1319, 1047].forEach(function (f, i) { var o = a.createOscillator(), v = a.createGain(); o.type = 'sine'; o.frequency.value = f;
      v.gain.setValueAtTime(.06, a.currentTime + i * .28); v.gain.exponentialRampToValueAtTime(.0001, a.currentTime + i * .28 + 1.1); o.connect(v); v.connect(a.destination); o.start(a.currentTime + i * .28); o.stop(a.currentTime + i * .28 + 1.2) }) } catch (x) {} }
    var lt = 0;
    function porte(apri, poi) {
      if (apri && LIFT.s > .99) { poi && poi(); return } if (!apri && LIFT.s < .01) return;
      if (apri) ding(); st.classList.toggle('lgopen', apri); cancelAnimationFrame(lt);
      var s0 = LIFT.s, t0 = performance.now(), T = RM ? 1 : (apri ? 900 : 700);
      (function f(n) { var u = Math.min(1, (n - t0) / T), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; LIFT.s = s0 + ((apri ? 1 : 0) - s0) * e; render();
        if (apri && poi && u > .55) { var q = poi; poi = null; q() }
        if (u < 1) lt = requestAnimationFrame(f); else if (poi) poi() })(t0);
    }
    /* siamo appena arrivati: le porte sono aperte, finito il disegno si chiudono */
    if (LIFT.s > .5) { st.classList.add('lgopen'); setTimeout(function () { porte(false) }, 2700) }
    var db = document.getElementById('dispB');
    if (db && 'MutationObserver' in window) new MutationObserver(function () { if (db.getAttribute('aria-expanded') !== 'true' && LIFT.s > .5) setTimeout(function () { porte(false) }, 250) }).observe(db, { attributes: true, attributeFilter: ['aria-expanded'] });
    /* sul telefono si parte dal centro della stanza */
    if (wrap && wrap.scrollWidth > wrap.clientWidth) wrap.scrollLeft = (wrap.scrollWidth - wrap.clientWidth) / 2;
    /* e una spinta, finito il disegno: la stanza scivola verso il cabinato e torna, per dire che si trascina */
    if (wrap && wrap.scrollWidth > wrap.clientWidth && !RM) setTimeout(function () { var x0 = wrap.scrollLeft, d = Math.min(160, (wrap.scrollWidth - wrap.clientWidth) / 2);
      wrap.scrollTo({ left: x0 + d, behavior: 'smooth' }); setTimeout(function () { wrap.scrollTo({ left: x0, behavior: 'smooth' }) }, 900) }, 3600);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
