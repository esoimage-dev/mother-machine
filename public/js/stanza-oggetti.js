/* Mother Machine · LG, gli oggetti con cui si gioca: il cabinato, il banco da lavoro con il pannello forato, il
   furgoncino sulla mensola, la TV sulla cassa, e le piccole cose di chi ci vive (la pianta, l'estintore, il biglietto).
   Usa il motore di stanza.js: window.STANZA_OGGETTI(L) con L = { part, frame, ID, X, Y, Z0, Z1 }. */
window.STANZA_OGGETTI = function (L) {
  var part = L.part, frame = L.frame, ID = L.ID, PI = Math.PI;

  /* ---------- aiuti ---------- */
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]] }
  function cen(ps) { var c = [0, 0, 0]; ps.forEach(function (p) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2] }); return [c[0] / ps.length, c[1] / ps.length, c[2] / ps.length] }
  /* normale di un poligono (Newell) */
  function nrm(ps) { var n = [0, 0, 0];
    for (var i = 0; i < ps.length; i++) { var a = ps[i], b = ps[(i + 1) % ps.length];
      n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]) }
    var l = Math.hypot(n[0], n[1], n[2]) || 1; return [n[0] / l, n[1] / l, n[2] / l] }
  /* una faccia con la normale girata via dal punto "dentro" */
  function fc(p, pts, ins, o) { var n = nrm(pts), d = sub(cen(pts), ins); if (n[0] * d[0] + n[1] * d[1] + n[2] * d[2] < 0) n = [-n[0], -n[1], -n[2]]; return p.face(pts, n, o) }
  /* il motore ordina le parti per il baricentro: qui si fissa a mano chi va dietro a chi */
  function zz(p, z) { Object.defineProperty(p.P, 'z', { get: function () { return z }, set: function () {} }) }
  /* arco di ellisse in un sistema locale, sul piano dato */
  function arco(T, c, r, pl, a0, a1, k, ry) { ry = ry || r; var pts = [];
    for (var i = 0; i <= k; i++) { var a = a0 + (a1 - a0) * i / k, u = r * Math.cos(a), w = ry * Math.sin(a);
      pts.push(T(pl === 'x' ? [c[0], c[1] + w, c[2] + u] : pl === 'y' ? [c[0] + u, c[1], c[2] + w] : [c[0] + u, c[1] + w, c[2]])) }
    return pts }
  function anello(T, c, r, pl, k, ry) { var p = arco(T, c, r, pl, 0, 2 * PI, k, ry); p.pop(); return p }
  /* fusto verticale (cilindro o tronco di cono) fatto di facce: c = [x, z] locali */
  function fusto(p, T, c, r0, r1, y0, y1, k, o) {
    o = o || {}; var S = [], ins = T([c[0], (y0 + y1) / 2, c[1]]), top = [], bot = [];
    for (var i = 0; i < k; i++) { var a0 = i / k * 2 * PI + (o.rot || 0), a1 = (i + 1) / k * 2 * PI + (o.rot || 0);
      var q = [T([c[0] + r0 * Math.cos(a0), y0, c[1] + r0 * Math.sin(a0)]), T([c[0] + r0 * Math.cos(a1), y0, c[1] + r0 * Math.sin(a1)]),
        T([c[0] + r1 * Math.cos(a1), y1, c[1] + r1 * Math.sin(a1)]), T([c[0] + r1 * Math.cos(a0), y1, c[1] + r1 * Math.sin(a0)])];
      var f = fc(p, q, ins, { fill: o.fill, cls: o.cls }); if (o.hatch) f.hatch = o.hatch(f.n); S.push(f); top.push(q[3]); bot.push(q[0]) }
    var out = { s: S };
    if (o.top !== false) out.t = fc(p, top, ins, { fill: o.fill, cls: o.cls });
    if (o.bot) out.b = fc(p, bot, ins, { fill: o.fill, cls: o.cls });
    return out }
  /* rettangolo arrotondato 2D */
  function rr(cx, cy, hw, hh, r, k) { var pts = [], C = [[hw - r, hh - r, 0], [-hw + r, hh - r, .5], [-hw + r, -hh + r, 1], [hw - r, -hh + r, 1.5]];
    C.forEach(function (q) { for (var i = 0; i <= k; i++) { var a = (q[2] + i / k * .5) * PI; pts.push([cx + q[0] + r * Math.cos(a), cy + q[1] + r * Math.sin(a)]) } }); return pts }
  /* polilinea 2D spessa: il contorno */
  function striscia(pts, w) { var A = [], B = [];
    pts.forEach(function (q, i) { var a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ww = typeof w === 'function' ? w(i / (pts.length - 1)) : w;
      A.push([q[0] - dy / l * ww / 2, q[1] + dx / l * ww / 2]); B.unshift([q[0] + dy / l * ww / 2, q[1] - dx / l * ww / 2]) }); return A.concat(B) }
  function rot(pts, a, c) { c = c || [0, 0]; var co = Math.cos(a), si = Math.sin(a); return pts.map(function (q) { var x = q[0] - c[0], y = q[1] - c[1]; return [c[0] + x * co - y * si, c[1] + x * si + y * co] }) }
  /* profilo rientrato di d (per il bordo a T del cabinato) */
  function inset(P, d) { var n = P.length, E = [];
    for (var i = 0; i < n; i++) { var A = P[i], B = P[(i + 1) % n], du = B[0] - A[0], dv = B[1] - A[1], l = Math.hypot(du, dv); E.push([A[0] - dv / l * d, A[1] + du / l * d, du, dv]) }
    return P.map(function (_, j) { var a = E[(j - 1 + n) % n], b = E[j], den = a[2] * b[3] - a[3] * b[2];
      if (Math.abs(den) < 1e-9) return [b[0], b[1]];
      var t = ((b[0] - a[0]) * b[3] - (b[1] - a[1]) * b[2]) / den; return [a[0] + a[2] * t, a[1] + a[3] * t] }) }
  /* un punto su un lato del profilo di un prisma: x locale, s metri lungo il lato, d fuori dalla faccia */
  function lato(T, pr, i) { var A = pr[i], B = pr[(i + 1) % pr.length], du = B[0] - A[0], dv = B[1] - A[1], l = Math.hypot(du, dv);
    var f = function (x, s, d) { var t = s / l; d = d == null ? .003 : d; return T([x, A[1] + dv * t - du / l * d, A[0] + du * t + dv / l * d]) }; f.len = l; return f }
  /* un piano a x costante: a = verso destra sul foglio, b = in alto; sg = +1 parete sinistra, -1 parete destra */
  function pianoX(x, zc, yc, ang, sg) { var co = Math.cos(ang || 0), si = Math.sin(ang || 0);
    return function (a, b) { var A = a * co - b * si, B = a * si + b * co; return [x, yc + B, zc + sg * A] } }
  function su(M, pts) { return pts.map(function (q) { return M(q[0], q[1]) }) }
  /* le lettere a pixel (3x5): per le scritte sui piani girati, dove text() non segue la prospettiva */
  var GL = { R: [[0, 0], [0, 4], [2, 4], [2, 2], [0, 2], [2, 0]], U: [[0, 4], [0, 0], [2, 0], [2, 4]], S: [[2, 4], [0, 4], [0, 2], [2, 2], [2, 0], [0, 0]],
    H: [[0, 0], [0, 4], [0, 2], [2, 2], [2, 4], [2, 0]], O: [[0, 0], [0, 4], [2, 4], [2, 0], [0, 0]], M: [[0, 0], [0, 4], [1, 2.2], [2, 4], [2, 0]],
    E: [[2, 4], [0, 4], [0, 2], [1.5, 2], [0, 2], [0, 0], [2, 0]], N: [[0, 0], [0, 4], [2, 0], [2, 4]], P: [[0, 0], [0, 4], [2, 4], [2, 2], [0, 2]],
    I: [[1, 0], [1, 4]], Z: [[0, 4], [2, 4], [0, 0], [2, 0]], A: [[0, 0], [0, 4], [2, 4], [2, 0], [2, 2], [0, 2]] };
  function scritta(p, txt, map, o) { txt.split('').forEach(function (ch, k) { var g = GL[ch]; if (g) p.line(g.map(function (q) { return map(k * 3.2 + q[0], q[1]) }), o) }) }
  /* la grafia a mano: occhielli (cicloide allungata), come una parola scritta in fretta */
  function grafia(a0, a1, b, h, n) { var pts = [], k = n * 9, r = (a1 - a0) / (n * 2 * PI);
    for (var i = 0; i <= k; i++) { var t = i / k * n * 2 * PI, hh = h * (.75 + .35 * Math.sin(t * .37 + a0 * 40));
      pts.push([a0 + r * t - r * 1.7 * Math.sin(t), b + hh * (1 - Math.cos(t)) / 2]) } return pts }

  /* ---------- il cabinato: Rush hour ---------- */
  function cabinato() {
    var p = part({ cls: 'arc', hot: 'arcade', label: 'Arcade cabinet. Play Rush hour' });
    var T = frame([2.0, 0, 3.3], -.28), w = .34;
    /* il profilo di fianco: zoccolo, sportello, pulsantiera a sbalzo, schermo inclinato, insegna, schiena */
    var pr = [[.04, 0], [.8, 0], [.8, 1.25], [.62, 1.86], [-.02, 1.86], [-.02, 1.56], [.3, 1.5], [.12, 1.02], [-.16, .94], [-.16, .84], [.04, .8]];
    var c = p.prism(pr, -w, w, T, { hatchSide: function (i) { return i === 8 ? 2 : i === 5 ? 3 : 0 } });
    var S = c.sides;
    function su2(i, pts, o) { var at = lato(T, pr, i); o.on = S[i]; return p.line(pts.map(function (q) { return at(q[0], q[1], q[2]) }), o) }
    function ell(i, x, s, r, d, k, o) { var at = lato(T, pr, i), pts = []; for (var j = 0; j < k; j++) { var a = j / k * 2 * PI; pts.push(at(x + r * Math.cos(a), s + r * Math.sin(a), d)) } o.on = S[i]; o.closed = true; return p.line(pts, o) }
    function ret(i, x0, s0, x1, s1, o) { o.closed = true; return su2(i, [[x0, s0], [x1, s0], [x1, s1], [x0, s1]], o) }

    /* i fianchi: il bordo a T e la striscia della strada */
    [[c.l, -w - .002], [c.r, w + .002]].forEach(function (q) {
      var f = q[0], x = q[1]; function F2(u, v) { return T([x, v, u]) }
      p.line(inset(pr, .024).map(function (k) { return F2(k[0], k[1]) }), { closed: true, cls: 'dt', on: f });
      p.line([F2(.775, .18), F2(.07, .56)], { on: f }); p.line([F2(.775, .38), F2(.07, .76)], { on: f });
      for (var d = 0; d < 5; d++) { var t0 = .06 + d * .19, t1 = t0 + .09; p.line([F2(.775 - .705 * t0, .28 + .38 * t0), F2(.775 - .705 * t1, .28 + .38 * t1)], { cls: 'dt', on: f }) }
      /* le feritoie in alto sulla schiena */
      for (var v = 0; v < 4; v++) p.line([F2(.56, 1.42 + v * .07), F2(.7, 1.42 + v * .07)], { cls: 'dt', on: f });
    });

    /* l'insegna: RUSH HOUR a pixel, accesa */
    ret(4, -w + .035, .035, w - .035, .265, { cls: 'dt' });
    var u = .0172, x0 = -(9 * 3.2 - 1.2) * u / 2, at4 = lato(T, pr, 4);
    scritta(p, 'RUSH HOUR', function (gx, gy) { return at4(x0 + gx * u, .15 - (gy - 2) * u) }, { cls: 'px mq', on: S[4] });

    /* lo schermo: la cornice, il vetro, e il gioco dentro (un palazzo, l'ascensore, la gente che aspetta) */
    var L6 = lato(T, pr, 6), sc = L6.len / 2;
    su2(6, rr(0, sc, .27, .225, .02, 2), { closed: true, cls: 'dt' });
    su2(6, rr(0, sc, .24, .19, .035, 3), { closed: true });
    var fl = [.13, .2, .27, .34, .41];
    fl.forEach(function (s) { su2(6, [[-.2, s], [-.045, s]], { cls: 'scr dt' }); su2(6, [[.045, s], [.2, s]], { cls: 'scr dt' }) });
    su2(6, [[-.04, .1], [-.04, .43]], { cls: 'scr dt' }); su2(6, [[.04, .1], [.04, .43]], { cls: 'scr dt' });
    ret(6, -.028, .275, .028, .335, { cls: 'scr cab', fill: 'or' });
    [[-.16, .2], [-.12, .2], [.15, .34], [-.09, .41], [.18, .13]].forEach(function (q) { su2(6, [[q[0], q[1] - .003], [q[0], q[1] - .03]], { cls: 'scr' }) });
    su2(6, [[-.2, .075], [-.14, .075]], { cls: 'scr' }); su2(6, [[.12, .075], [.2, .075]], { cls: 'scr dt' });
    su2(6, [[-.22, .16], [-.22, .08], [-.17, .06]], { cls: 'dt' });

    /* la pulsantiera: la leva con la pallina, due bottoni pomodoro, lo start */
    ell(7, -.17, .15, .045, .003, 14, { cls: 'dt' });
    var A7 = lato(T, pr, 7), base = A7(-.17, .15, .003), top = A7(-.165, .17, .11);
    p.line([base, top], { cls: 'stick', on: S[7] });
    p.circle(top, .03, 'z', { on: S[7], fill: 'kf', k: 16 });
    p.line([[top[0] - .012, top[1] + .012, top[2] - .02], [top[0] - .002, top[1] + .02, top[2] - .02]], { cls: 'dt', on: S[7] });
    [[.03, .165], [.12, .13]].forEach(function (q, i) { ell(7, q[0], q[1], .03, .002, 14, { cls: 'dt' }); ell(7, q[0], q[1], .024, .014, 14, { cls: 'btn b' + i, fill: 'or' }) });
    ret(7, .21, .05, .25, .08, { cls: 'dt', fill: 'wf' });
    su2(8, [[-w + .02, .05], [w - .02, .05]], { cls: 'dt' });

    /* lo sportello delle monete, lo zoccolo, la griglia dell'altoparlante */
    ret(10, -.15, .2, .15, .5, {});
    ret(10, -.13, .22, .13, .48, { cls: 'dt' });
    [-.055, .055].forEach(function (x) { ret(10, x - .014, .25, x + .014, .31, { cls: 'coin', fill: 'or' }); ret(10, x - .028, .38, x + .028, .43, { cls: 'dt' }) });
    ell(10, .11, .455, .01, .003, 8, { cls: 'dt' });
    su2(10, [[-w, .67], [w, .67]], {});
    for (var r = 0; r < 7; r++) su2(10, [[-.24 + r * .08, .7], [-.24 + r * .08, .77]], { cls: 'dt' });
    for (var g = 0; g < 3; g++) su2(10, [[-.2, .06 + g * .035], [.2, .06 + g * .035]], { cls: 'dt' });
    return T;
  }

  /* la prolunga arrotolata per terra, la ciabatta con l'interruttore acceso, il cavo del cabinato */
  function prolunga(T) {
    var p = part({ cls: 'coil' });
    var cx = 3.95, cz = 5.15;
    for (var i = 0; i < 5; i++) p.circle([cx + Math.sin(i * 1.7) * .03, .006 + i * .004, cz + Math.cos(i * 2.1) * .025], .22 - i * .012, 'y', { cls: 'cable', k: 30 });
    var b = p.box([3.38, 0, 4.72, 3.66, .055, 4.84], ID, {});
    for (var s = 0; s < 3; s++) { var x = 3.43 + s * .065; p.line([[x, .056, 4.75], [x + .04, .056, 4.75], [x + .04, .056, 4.81], [x, .056, 4.81]], { closed: true, cls: 'dt', on: b.t }) }
    p.line([[3.62, .056, 4.75], [3.645, .056, 4.75], [3.645, .056, 4.81], [3.62, .056, 4.81]], { closed: true, cls: 'led o', on: b.t });
    p.curve([3.66, .02, 4.8], [3.8, .01, 4.95], [cx - .2, .01, cz - .05], { cls: 'cable' });
    /* il cavo del cabinato, dalla schiena alla ciabatta */
    p.curve(T([.18, .1, .8]), T([.35, 0, 1.4]), [3.42, .03, 4.78], { cls: 'cable' });
    /* e la coda che va sotto il banco */
    p.curve([cx + .2, .01, cz + .1], [4.6, .01, 5.6], [5.5, .01, 6.2], { cls: 'cable' });
  }

  /* ---------- il banco da lavoro ---------- */
  function banco() {
    var p = part({ cls: 'bench' }); zz(p, 8.3);
    var t = p.box([4.2, .84, 5.4, 5.58, .92, 8.2], ID, {});
    /* le venature del legno sul bordo */
    p.line([[4.199, .89, 5.5], [4.199, .89, 6.6], [4.199, .885, 7.1]], { cls: 'dt', on: t.l });
    p.line([[4.199, .868, 6.9], [4.199, .868, 8.0]], { cls: 'dt', on: t.l });
    p.line([[4.199, .875, 5.9], [4.199, .872, 6.3]], { cls: 'dt', on: t.l });
    [[4.27, 5.47], [4.27, 8.07], [5.45, 5.47], [5.45, 8.07]].forEach(function (q) { p.box([q[0], 0, q[1], q[0] + .065, .84, q[1] + .065], ID, { hatch: { r: 2 } }) });
    var sh = p.box([4.24, .16, 5.44, 5.56, .21, 8.16], ID, {});
    p.line([[4.239, .185, 5.5], [4.239, .185, 8.1]], { cls: 'dt', on: sh.l });
    /* i cassetti appesi sotto, quello in alto mezzo aperto */
    var d = p.box([4.26, .5, 7.0, 5.56, .84, 8.07], ID, {});
    p.line([[4.259, .67, 7.02], [4.259, .67, 8.05]], { cls: 'dt', on: d.l });
    p.line([[4.259, .585, 7.4], [4.259, .585, 7.68]], { on: d.l });
    var dr = p.box([4.12, .68, 7.06, 4.26, .83, 8.01], ID, {});
    p.line([[4.119, .755, 7.38], [4.119, .755, 7.7]], { on: dr.l });
    p.line([[4.15, .83, 7.2], [4.06, .95, 7.32]], { cls: 'stick' });
    p.line([[4.18, .83, 7.6], [4.1, .9, 7.85]], { cls: 'dt' });
    /* la croce sul fianco corto */
    p.line([[4.335, .23, 5.5], [5.45, .82, 5.5]], { cls: 'brace' }); p.line([[4.335, .82, 5.5], [5.45, .23, 5.5]], { cls: 'brace' });
  }

  /* la cassetta degli attrezzi sul ripiano */
  function cassetta() {
    var p = part({ cls: 'bench' }); zz(p, 8.28);
    var b = p.box([4.42, .21, 6.3, 4.74, .44, 6.92], ID, { hatch: { f: 0 } });
    p.line([[4.419, .39, 6.3], [4.419, .39, 6.92]], { cls: 'dt', on: b.l });
    p.line([[4.42, .39, 6.299], [4.74, .39, 6.299]], { cls: 'dt', on: b.f });
    p.line([[4.419, .35, 6.56], [4.419, .41, 6.56], [4.419, .41, 6.66], [4.419, .35, 6.66]], { closed: true, cls: 'dt', on: b.l });
    p.line([[4.58, .44, 6.42], [4.58, .52, 6.46], [4.58, .52, 6.76], [4.58, .44, 6.8]], { cls: 'stick' });
  }

  /* il pannello forato con gli attrezzi; quello che manca e' rimasto sul banco */
  function pannello() {
    var p = part({ cls: 'peg' }); zz(p, 8.6);
    var b = p.box([5.555, 1.0, 5.6, 5.6, 1.68, 8.0], ID, {});
    var x = 5.553, f = b.l, holes = [];
    for (var z = 5.68; z < 7.97; z += .08) holes.push(p.line([[x, 1.04, z], [x, 1.66, z]], { cls: 'cn hole', on: f }));
    /* i fori: puntini a passo vero, che si stringono con la distanza */
    setTimeout(function () { holes.forEach(function (l) { if (l.e) l.e.style.strokeDasharray = '0 ' + (.08 * 700 / l.pts[0][2]).toFixed(2) }) }, 0);
    function att(zc, yc, ang) { return pianoX(x - .001, zc, yc, ang, -1) }
    var o = { closed: true, fill: 'kf', on: f };
    /* il martello */
    var M = att(5.86, 1.3, .06);
    p.line(su(M, [[-.013, -.17], [.013, -.17], [.012, .1], [-.012, .1]]), o);
    p.line(su(M, [[-.05, .095], [.035, .095], [.06, .085], [.088, .058], [.094, .066], [.072, .1], [.045, .14], [-.05, .14]]), o);
    p.line(su(M, [[-.013, -.12], [.013, -.12]]), { cls: 'dt', on: f }); p.line(su(M, [[-.013, -.09], [.013, -.09]]), { cls: 'dt', on: f });
    /* la pinza */
    M = att(6.12, 1.3, -.05);
    p.line(su(M, striscia([[-.004, .16], [-.006, .1], [0, .05], [-.035, -.14]], function (t) { return .012 + t * .01 })), o);
    p.line(su(M, striscia([[.004, .16], [.006, .1], [0, .05], [.035, -.14]], function (t) { return .012 + t * .01 })), o);
    p.circle(M(0, .05), .011, 'x', { on: f, fill: 'kf', k: 10 });
    /* due cacciaviti */
    [[6.33, .03], [6.43, -.08]].forEach(function (q) { M = att(q[0], 1.36, q[1]);
      p.line(su(M, [[0, -.02], [0, -.17]]), { cls: 'stick', on: f });
      p.line(su(M, rr(0, .04, .017, .055, .012, 2)), o);
      p.line(su(M, [[-.006, .0], [-.006, .08]]), { cls: 'dt', on: f }); p.line(su(M, [[.006, .0], [.006, .08]]), { cls: 'dt', on: f }) });
    /* il metro a nastro */
    M = att(6.66, 1.42, .1);
    p.line(su(M, rr(0, 0, .042, .042, .014, 2)), o);
    p.line(su(M, [[-.042, -.025], [-.06, -.025], [-.06, -.04], [-.042, -.04]]), { cls: 'dt', on: f });
    p.circle(M(0, 0), .018, 'x', { on: f, cls: 'dt', k: 12 });
    /* la sagoma della chiave inglese: la chiave non c'e' (chissa' dove) */
    M = att(6.94, 1.3, -.08);
    p.line(su(M, [[-.011, -.12], [.011, -.12], [.011, .095], [.03, .11], [.034, .145], [.016, .162], [.009, .135], [-.009, .135], [-.016, .162], [-.034, .145], [-.03, .11], [-.011, .095]]), { closed: true, cls: 'cn ghost', on: f });
    p.circle(M(0, -.135), .026, 'x', { on: f, cls: 'cn ghost', k: 14 });
  }

  /* il menu del ristorante, appeso con la puntina */
  function menu() {
    var p = part({ cls: 'menu', hot: 'ristorante', label: "Vitalia's Restaurant menu. Open the project" }); zz(p, 8.55);
    var M = pianoX(5.546, 7.42, 1.33, .045, -1);
    var f = p.face(su(M, [[-.14, -.2], [.14, -.2], [.14, .2], [-.14, .2]]), [-1, 0, 0], {});
    var N = pianoX(5.544, 7.42, 1.33, .045, -1);
    p.line(su(N, [[-.123, -.185], [.123, -.185], [.123, .165], [-.123, .165]]), { closed: true, fill: 'pf', on: f });
    p.line(su(N, rr(0, .18, .055, .022, .008, 2)), { closed: true, fill: 'kf', on: f });
    p.line(su(N, [[-.03, .2], [-.03, .21], [.03, .21], [.03, .2]]), { cls: 'dt', on: f });
    var u = .011, x0 = -(4 * 3.2 - 1.2) * u / 2;
    scritta(p, 'MENU', function (gx, gy) { return N(x0 + gx * u, .1 + gy * u) }, { cls: 'ink px', on: f });
    p.line(su(N, [[-.06, .085], [.06, .085]]), { cls: 'ink', on: f });
    for (var i = 0; i < 6; i++) { var y = .045 - i * .036, l = [.13, .09, .15, .11, .08, .12][i];
      p.line(su(N, [[-.1, y], [-.1 + l, y]]), { cls: 'ink', on: f });
      p.line(su(N, [[.075, y], [.1, y]]), { cls: 'ink', on: f }) }
    /* la puntina: l'unica cosa accesa, si clicca */
    p.circle(M(0, .235), .026, 'x', { on: f, fill: 'or', cls: 'pin', k: 12 });
  }

  /* la mensola sopra il banco */
  function mensola() {
    var p = part({ cls: 'shelf' }); zz(p, 8.5);
    p.box([5.05, 1.72, 5.6, 5.58, 1.76, 7.8], ID, {});
    [5.85, 7.55].forEach(function (z) { p.line([[5.575, 1.715, z], [5.575, 1.5, z], [5.2, 1.715, z]], { closed: true, cls: 'dt' }) });
  }

  /* il furgoncino rosso delle pizze, un giocattolo */
  function furgone() {
    var p = part({ cls: 'truck', hot: 'truck', label: "Vitalia's Pizza on Wheels truck. Open the project" }); zz(p, 8.4);
    var T = frame([5.17, 1.76, 6.0], 0), w = .21;
    var pr = [[0, .03], [.55, .03], [.55, .27], [.16, .27], [.16, .2], [.08, .2], [.025, .13], [0, .12]];
    var c = p.prism(pr, 0, w, T, { fill: 'red' }), f = c.l;
    function S2(u, v) { return T([-.002, v, u]) }
    function on(pts, o) { o.on = f; return p.line(pts.map(function (q) { return S2(q[0], q[1]) }), o) }
    /* la portiera, il finestrino, la cucina con il cuoco */
    on([[.04, .04], [.145, .04], [.145, .19], [.078, .19], [.035, .132]], { closed: true, cls: 'dt' });
    on([[.07, .145], [.135, .145], [.135, .182], [.083, .182]], { closed: true, fill: 'kf' });
    on([[.2, .118], [.49, .118], [.49, .212], [.2, .212]], { closed: true, fill: 'kf' });
    p.circle(S2(.35, .148), .018, 'x', { on: f, fill: 'wf', k: 12 });
    on([[.334, .164], [.366, .164], [.372, .186], [.36, .198], [.35, .191], [.34, .198], [.328, .186]], { closed: true, fill: 'wf' });
    on([[.19, .118], [.5, .118]], {});
    /* PIZZA sul fianco: si legge da sinistra, quindi verso chi guarda */
    var u = .0095;
    scritta(p, 'PIZZA', function (gx, gy) { return S2(.395 - gx * u, .058 + gy * u) }, { cls: 'px wl', on: f });
    /* le ruote */
    [.095, .455].forEach(function (uc) {
      p.line(arco(T, [-.002, .04, uc], .052, 'x', 0, PI, 10), { cls: 'dt', on: f });
      p.circle(S2(uc, .04), .04, 'x', { on: f, fill: 'kf', k: 16 });
      p.circle(S2(uc, .04), .016, 'x', { on: f, cls: 'dt', k: 10 }) });
    /* la tenda a righe sopra la cucina */
    var A = T([0, .238, .19]), B = T([0, .238, .5]), C = T([-.06, .2, .5]), D = T([-.06, .2, .19]);
    /* la tenda si vede da sotto (la mensola e' sopra gli occhi): due facce, sopra e sotto */
    function lp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] }
    var pa = part({ cls: 'truck', hot: 'truck', label: "Vitalia's Pizza on Wheels truck. Open the project" }); zz(pa, 8.39);
    [T([.1, .15, .3]), T([-.2, .4, .3])].forEach(function (ins) { var aw = fc(pa, [A, B, C, D], ins, { fill: 'red' });
      for (var i = 1; i < 8; i += 2) { var t0 = i / 8, t1 = (i + 1) / 8; pa.line([lp(A, B, t0), lp(A, B, t1), lp(D, C, t1), lp(D, C, t0)], { closed: true, fill: 'wf', cls: 'dt', on: aw }) }
      var sc = []; for (var j = 0; j <= 16; j++) { var q = lp(D, C, j / 16); sc.push(j % 2 ? [q[0], q[1] - .014, q[2]] : q) }
      pa.line(sc, { on: aw }) });
    /* davanti: fari, griglia, paraurti; il parabrezza */
    var fr = c.sides[7];
    [.04, .17].forEach(function (x) { p.circle(T([x, .085, -.002]), .014, 'z', { on: fr, fill: 'wf', k: 10 }) });
    for (var g = 0; g < 3; g++) p.line([T([.075 + g * .03, .06, -.002]), T([.075 + g * .03, .1, -.002])], { cls: 'dt', on: fr });
    p.line([T([-.005, .045, -.004]), T([w + .005, .045, -.004])], { on: fr });
    var ws = lato(T, pr, 5);
    p.line([ws(.02, .01), ws(.19, .01), ws(.19, ws.len - .012), ws(.02, ws.len - .012)], { closed: true, fill: 'kf', on: c.sides[5] });
    /* l'insegna sul tetto con la pizza */
    var sb = p.box([.095, .27, .27, .115, .37, .47], T, {});
    var pc = T([.093, .32, .37]);
    p.circle(pc, .042, 'x', { on: sb.l, fill: 'wf', k: 18 });
    for (var s = 0; s < 3; s++) { var a = s / 3 * PI + .3; p.line([[pc[0], pc[1] + .04 * Math.sin(a), pc[2] + .04 * Math.cos(a)], [pc[0], pc[1] - .04 * Math.sin(a), pc[2] - .04 * Math.cos(a)]], { cls: 'ink', on: sb.l }) }
    [[.018, .012], [-.02, .015], [.005, -.022], [-.016, -.012]].forEach(function (q) { p.circle([pc[0] - .001, pc[1] + q[1], pc[2] + q[0]], .007, 'x', { on: sb.l, fill: 'red', k: 8 }) });
  }

  /* le scatole delle pizze: una piatta, una appoggiata al muro con il marchio sul coperchio */
  function cartoni() {
    var p = part({ cls: 'box' }); zz(p, 8.45);
    var b = p.box([5.12, 1.76, 6.7, 5.5, 1.81, 7.08], ID, { hatch: { f: 0 } });
    p.line([[5.119, 1.79, 6.7], [5.119, 1.79, 7.08]], { cls: 'dt', on: b.l });
    var q = part({ cls: 'box' }); zz(q, 8.47);
    var k = .1, h = .4, z0 = 7.14, z1 = 7.54, xb = 5.47, th = .045;
    function P(a, b2, d) { return [xb + b2 * k + d, 1.76 + b2, a] }
    var ins = P((z0 + z1) / 2, h / 2, th / 2);
    var F = fc(q, [P(z0, 0, 0), P(z1, 0, 0), P(z1, h, 0), P(z0, h, 0)], ins, {});
    fc(q, [P(z0, 0, th), P(z1, 0, th), P(z1, h, th), P(z0, h, th)], ins, {});
    fc(q, [P(z0, 0, 0), P(z0, 0, th), P(z0, h, th), P(z0, h, 0)], ins, {});
    fc(q, [P(z1, 0, 0), P(z1, 0, th), P(z1, h, th), P(z1, h, 0)], ins, {});
    fc(q, [P(z0, h, 0), P(z1, h, 0), P(z1, h, th), P(z0, h, th)], ins, {});
    var zc = (z0 + z1) / 2;
    function C(a, b2) { return P(zc - a, b2, -.002) }
    function cer(a, b2, r, kk) { var pts = []; for (var i = 0; i < kk; i++) { var t = i / kk * 2 * PI; pts.push(C(a + r * Math.cos(t), b2 + r * Math.sin(t))) } return pts }
    q.line(cer(0, .23, .1, 22), { closed: true, on: F });
    q.line(cer(0, .23, .082, 22), { closed: true, cls: 'dt', on: F });
    for (var s = 0; s < 3; s++) { var a = s / 3 * PI + .5; q.line([C(.082 * Math.cos(a), .23 + .082 * Math.sin(a)), C(-.082 * Math.cos(a), .23 - .082 * Math.sin(a))], { cls: 'dt', on: F }) }
    var u = .011, x0 = -(5 * 3.2 - 1.2) * u / 2;
    scritta(q, 'PIZZA', function (gx, gy) { return C(x0 + gx * u, .055 + gy * u) }, { cls: 'px', on: F });
  }

  /* la tazza sul banco, il vapore, l'alone del caffe' */
  function tazza() {
    var p = part({ cls: 'mug' }); zz(p, 8.2);
    var T = frame([4.47, .92, 5.82], 0);
    var m = fusto(p, T, [0, 0], .045, .047, 0, .105, 14, { hatch: function (n) { return n[0] > .5 ? 2 : 0 } });
    p.line(anello(T, [0, .095, 0], .038, 'y', 14), { closed: true, cls: 'dt', on: m.t });
    /* il manico, di profilo rispetto a chi guarda */
    var hx = .79, hz = -.61; function H(r, y) { return T([hx * r, y, hz * r]) }
    p.curve(H(.044, .09), H(.105, .08), H(.044, .025), { cls: 'stick' });
    [-.018, .004, .024].forEach(function (x, i) { var pts = [];
      for (var j = 0; j <= 14; j++) { var t = j / 14; pts.push(T([x + Math.sin(t * 7 + i * 2) * .016 * t, .12 + t * .3, 0])) }
      p.line(pts, { cls: 'steam s' + i }) });
    p.line(arco(ID, [4.62, .921, 6.12], .043, 'y', .4, 2 * PI - .3, 18), { cls: 'dt' });
  }

  /* la lampadina nuda, appesa al suo filo sopra il banco */
  function lampadina() {
    var p = part({ cls: 'bulbp' }); zz(p, 6.5);
    var x = 4.85, z = 6.1, y = 2.44;
    p.circle([x, y - .09, z], .26, 'z', { cls: 'halo', k: 24 }); p.circle([x, y - .088, z], .14, 'z', { cls: 'halo', k: 20 });
    p.line([[x, 3.3, z], [x, y + .08, z]], { cls: 'dt' });
    var T = frame([x, 0, z], 0);
    fusto(p, T, [0, 0], .022, .02, y, y + .08, 10, { bot: true, top: false });
    p.line([[x - .02, y, z], [x - .028, y - .04, z], [x + .028, y - .04, z], [x + .02, y, z]], { cls: 'dt' });
    p.circle([x, y - .085, z], .055, 'z', { cls: 'bulb', k: 22 });
    p.line([[x - .012, y - .04, z], [x - .012, y - .075, z], [x - .006, y - .09, z], [x, y - .075, z], [x + .006, y - .09, z], [x + .012, y - .075, z], [x + .012, y - .04, z]], { cls: 'ink fil' });
    /* il cono di luce, solo accennato */
    p.line([[x - .05, y - .1, z], [4.3, .93, 5.6]], { cls: 'cn' }); p.line([[x + .05, y - .1, z], [5.3, .93, 6.7]], { cls: 'cn' });
  }

  /* ---------- la TV sulla cassa ---------- */
  function tv() {
    var T = frame([-2.2, 0, 4.45], -.12);
    var k = part({ cls: 'crate', hot: 'film', label: 'Old TV. Switch it on' }); zz(k, 4.6);
    var cb = k.box([-.4, 0, -.28, .4, .48, .28], T, {});
    var zf = -.282, xr = .402;
    [.155, .165, .315, .325].forEach(function (y) { k.line([T([-.4, y, zf]), T([.4, y, zf])], { cls: 'dt', on: cb.f }); k.line([T([xr, y, -.28]), T([xr, y, .28])], { cls: 'dt', on: cb.r }) });
    [-.34, .34].forEach(function (x) { k.line([T([x, .01, zf]), T([x, .47, zf])], { cls: 'dt', on: cb.f }) });
    [-.24, -.14].forEach(function (x) { k.line([T([x, .04, zf]), T([x, .12, zf]), T([x - .025, .095, zf]), T([x, .12, zf]), T([x + .025, .095, zf])], { on: cb.f }) });
    k.line([T([.06, .21, zf]), T([.26, .21, zf]), T([.26, .27, zf]), T([.06, .27, zf])], { closed: true, cls: 'dt', on: cb.f });

    var t = part({ cls: 'tv', hot: 'film', label: 'Old TV. Switch it on' }); zz(t, 4.4);
    var b = t.box([-.32, .48, -.24, .32, .98, .04], T, { hatch: { r: 3 } });
    /* la coda del tubo catodico */
    var ins = T([0, .74, .15]), a0 = [T([-.28, .52, .04]), T([.28, .52, .04]), T([.28, .95, .04]), T([-.28, .95, .04])], a1 = [T([-.17, .6, .32]), T([.17, .6, .32]), T([.17, .88, .32]), T([-.17, .88, .32])];
    for (var i = 0; i < 4; i++) { var j = (i + 1) % 4, f = fc(t, [a0[i], a0[j], a1[j], a1[i]], ins, {}); if (i === 1) f.hatch = 4;
      if (i === 2) for (var v = 0; v < 4; v++) { var tv0 = .25 + v * .15; t.line([lerp3(lerp3(a0[2], a1[2], tv0), lerp3(a0[3], a1[3], tv0), .2), lerp3(lerp3(a0[2], a1[2], tv0), lerp3(a0[3], a1[3], tv0), .8)], { cls: 'dt', on: f }) } }
    fc(t, a1, ins, {});
    /* il vetro bombato, la cornice, il riflesso, il play */
    var zs = -.2415; function Fz(x, y) { return T([x, y, zs]) }
    t.line(rr(-.06, .73, .215, .195, .065, 4).map(function (q) { return Fz(q[0], q[1]) }), { closed: true, cls: 'dt', on: b.f });
    t.line(rr(-.06, .73, .19, .17, .06, 4).map(function (q) { return Fz(q[0], q[1]) }), { closed: true, cls: 'crt', on: b.f });
    t.curve(Fz(-.225, .8), Fz(-.22, .875), Fz(-.15, .885), { cls: 'dt', on: b.f });
    t.line([Fz(-.095, .675), Fz(-.095, .785), Fz(.0, .73)], { closed: true, fill: 'or', cls: 'play', on: b.f });
    /* le manopole, la griglia, la spia */
    [.87, .77].forEach(function (y, n) { t.line(anello(T, [.235, y, zs], .034, 'z', 14), { closed: true, on: b.f });
      var a = n ? 2.2 : .9; t.line([Fz(.235, y), Fz(.235 + .03 * Math.cos(a), y + .03 * Math.sin(a))], { on: b.f }) });
    for (var g = 0; g < 4; g++) t.line([Fz(.19, .58 + g * .028), Fz(.285, .58 + g * .028)], { cls: 'dt', on: b.f });
    t.line([Fz(.27, .52), Fz(.285, .52), Fz(.285, .535), Fz(.27, .535)], { closed: true, cls: 'led o', on: b.f });
    /* le antenne a coniglio, una con la stagnola */
    t.line(arco(T, [0, .98, -.05], .055, 'z', 0, PI, 8), {});
    t.line([T([-.015, 1.02, -.05]), T([-.17, 1.3, -.03]), T([-.34, 1.56, 0])], {});
    t.line([T([.015, 1.02, -.05]), T([.25, 1.62, -.08])], {});
    t.circle(T([-.34, 1.56, 0]), .011, 'z', { fill: 'kf', k: 8 });
    var tp = T([.25, 1.62, -.08]);
    t.line([[-.03, -.01], [-.012, .025], [.008, .02], [.03, .035], [.028, .0], [.035, -.02], [.0, -.03], [-.02, -.035]].map(function (q) { return [tp[0] + q[0], tp[1] + q[1], tp[2]] }), { closed: true, fill: 'wf', cls: 'dt' });
    /* il cavo che scende dietro la cassa (una parte a se', dietro) */
    var cv = part({ cls: 'tv' }); zz(cv, 4.75);
    cv.curve(T([.1, .62, .3]), T([.25, .3, .45]), T([.7, .01, .5]), { cls: 'cable' });
  }
  function lerp3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] }

  /* ---------- le piccole cose ---------- */
  /* l'estintore, sul muro di fondo accanto all'ultimo server (sulla parete di sinistra i server lo coprirebbero) */
  function estintore() {
    var p = part({ cls: 'ext' });
    var xc = -4.15, zc = 11.4, T = frame([xc, 0, zc], 0);
    /* le facce senza contorno (niente righe da caramella): il contorno si disegna a mano, sulla sagoma */
    fusto(p, T, [0, 0], .085, .085, .32, .82, 14, { fill: 'red', cls: 'ns', top: false });
    fusto(p, T, [0, 0], .085, .04, .82, .89, 14, { fill: 'red', cls: 'ns', top: false });
    fusto(p, T, [0, 0], .022, .022, .89, .95, 8, { top: true });
    var a = Math.atan2(-zc, -xc), h = PI / 2;
    function sg(s1) { var c = Math.cos(a + s1 * h), sn = Math.sin(a + s1 * h); return [T([.085 * c, .32, .085 * sn]), T([.085 * c, .82, .085 * sn]), T([.04 * c, .89, .04 * sn])] }
    p.line(sg(-1), {}); p.line(sg(1), {});
    p.line(arco(T, [0, .32, 0], .085, 'y', a - h, a + h, 10), {});
    p.line(arco(T, [0, .89, 0], .04, 'y', a - h, a + h, 6), { cls: 'dt' });
    var band = arco(T, [0, .62, 0], .087, 'y', a - .55, a + .55, 6).concat(arco(T, [0, .5, 0], .087, 'y', a + .55, a - .55, 6));
    p.line(band, { closed: true, fill: 'wf', cls: 'dt' });
    p.line(arco(T, [0, .72, 0], .088, 'y', a - h, a + h, 10), { cls: 'dt' });
    p.line([T([0, .95, 0]), T([.02, 1.0, -.02]), T([.1, .99, -.07])], { cls: 'stick' });
    p.curve(T([.03, .92, -.02]), T([.16, .85, -.1]), T([.09, .5, -.06]), {});
    p.circle(T([.05, .915, -.06]), .018, 'z', { fill: 'wf', k: 10 });
  }

  /* la pianta vicino al caveau: l'unica cosa morbida della stanza */
  function pianta() {
    var p = part({ cls: 'plant' });
    var T = frame([-.45, 0, 10.85], 0);
    fusto(p, T, [0, 0], .12, .155, 0, .32, 14, { hatch: function (n) { return n[0] > .45 ? 3 : 0 }, top: false });
    var rim = fusto(p, T, [0, 0], .165, .165, .32, .38, 14, {});
    p.line(anello(T, [0, .38, 0], .14, 'y', 16), { closed: true, cls: 'dt', on: rim.t });
    /* le foglie: base, controllo, punta, larghezza, profondita' */
    var F = [[[-.03, .37], [-.28, .72], [-.52, .52], .065, .06], [[.03, .37], [.32, .66], [.5, .46], .06, .05], [[0, .37], [-.12, .8], [-.26, 1.12], .055, .02],
      [[.01, .37], [.2, .82], [.34, 1.0], .058, .03], [[0, .37], [.05, .85], [.06, 1.28], .05, -.01], [[-.02, .37], [-.22, .62], [-.4, .82], .055, -.05], [[.02, .37], [.15, .55], [.38, .72], .05, -.07]];
    F.forEach(function (L2) { var a = L2[0], c = L2[1], b = L2[2], w = L2[3], dz = L2[4], mid = [], A = [], B = [];
      for (var i = 0; i <= 14; i++) { var t = i / 14, x = (1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0], y = (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1];
        var dx = 2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), dy = 2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1]), l = Math.hypot(dx, dy) || 1, ww = t < .3 ? w * .15 + w * Math.pow(t / .3, .9) * .85 : w * Math.sin((1 - t) / .7 * PI / 2);
        mid.push(T([x, y, dz])); A.push(T([x - dy / l * ww, y + dx / l * ww, dz])); B.unshift(T([x + dy / l * ww, y - dx / l * ww, dz])) }
      p.line(A.concat(B), { closed: true, fill: 'kf' });
      p.line(mid.slice(3, 13), { cls: 'dt' }) });
  }

  /* il biglietto sul secondo armadio: DON'T TOUCH - E. */
  function biglietto() {
    var p = part({ cls: 'note' });
    var M = pianoX(-4.548, 6.27, 1.5, -.07, 1), N = pianoX(-4.547, 6.27, 1.5, -.07, 1);
    var f = p.face(su(M, [[-.085, -.085], [.085, -.085], [.085, .08], [.07, .09], [-.085, .085]]), [1, 0, 0], { cls: 'note' });
    p.line(su(N, [[-.03, .07], [.035, .072], [.034, .1], [-.031, .098]]), { closed: true, cls: 'dt', on: f });
    p.line(su(N, grafia(-.065, .01, .035, .03, 4)), { cls: 'ink', on: f });
    p.line(su(N, grafia(-.065, .045, -.01, .032, 5)), { cls: 'ink', on: f });
    p.line(su(N, [[-.065, -.045], [-.045, -.045]]), { cls: 'ink', on: f });
    p.line(su(N, grafia(-.03, -.005, -.06, .03, 1).concat([[.008, -.06], [.01, -.058]])), { cls: 'ink', on: f });
    p.line(su(N, [[-.065, -.022], [.05, -.024]]), { cls: 'ink', on: f });
  }

  var T = cabinato(); prolunga(T);
  banco(); cassetta(); pannello(); menu(); mensola(); furgone(); cartoni(); tazza(); lampadina();
  tv(); estintore(); pianta(); biglietto();
};
