/* Mother Machine · LG, gli oggetti con cui si gioca: il cabinato, il banco da lavoro con il pannello forato, il
   furgoncino sulla mensola, la TV sulla cassa, il salottino (divano, tavolino, menu, telefono), la macchina del caffe',
   i manifesti e le piccole cose di chi ci vive (l'estintore, il biglietto).
   Usa il motore di stanza.js: window.STANZA_OGGETTI(L) con L = { part, frame, ID, X, Y, Z0, Z1 }.
   I modelli da guardare da vicino (furgone, menu, telefono) stanno in window.STANZA_MODELLI: ognuno e'
   function (L, T, o) in coordinate locali (origine al centro della base, x a destra, y in alto, davanti verso -z, metri),
   crea le sue parti con L.part e le restituisce; o.hot e o.label solo se si devono poter premere. */
(function () {
  var PI = Math.PI;

  /* ---------- aiuti ---------- */
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]] }
  function cen(ps) { var c = [0, 0, 0]; ps.forEach(function (p) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2] }); return [c[0] / ps.length, c[1] / ps.length, c[2] / ps.length] }
  function lerp3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]] }
  function unit(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
  /* normale di un poligono (Newell) */
  function nrm(ps) { var n = [0, 0, 0];
    for (var i = 0; i < ps.length; i++) { var a = ps[i], b = ps[(i + 1) % ps.length];
      n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]) }
    return unit(n) }
  /* una faccia con la normale girata via dal punto "dentro" */
  function fc(p, pts, ins, o) { var n = nrm(pts), d = sub(cen(pts), ins); if (n[0] * d[0] + n[1] * d[1] + n[2] * d[2] < 0) n = [-n[0], -n[1], -n[2]]; return p.face(pts, n, o) }
  /* il motore ordina le parti per profondita': qui si fissa a mano chi va dietro a chi */
  function zz(p, z) { p.P.zf = z; Object.defineProperty(p.P, 'z', { get: function () { return z }, set: function () {} }) }
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
  /* una gamba rastremata qualunque (anche inclinata): quattro facce da a (r0) a b (r1) */
  function gamba(p, a, b, r0, r1, o) { o = o || {}; var ins = lerp3(a, b, .5), A = [], B = [];
    [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(function (s) { A.push([a[0] + s[0] * r0, a[1], a[2] + s[1] * r0]); B.push([b[0] + s[0] * r1, b[1], b[2] + s[1] * r1]) });
    for (var i = 0; i < 4; i++) { var j = (i + 1) % 4; fc(p, [A[i], A[j], B[j], B[i]], ins, { cls: o.cls, hatch: o.hatch }) } }
  /* rettangolo arrotondato 2D (antiorario) */
  function rr(cx, cy, hw, hh, r, k) { var pts = [], C = [[hw - r, hh - r, 0], [-hw + r, hh - r, .5], [-hw + r, -hh + r, 1], [hw - r, -hh + r, 1.5]];
    C.forEach(function (q) { for (var i = 0; i <= k; i++) { var a = (q[2] + i / k * .5) * PI; pts.push([cx + q[0] + r * Math.cos(a), cy + q[1] + r * Math.sin(a)]) } }); return pts }
  function cer(cx, cy, r, k, ry) { var pts = []; for (var i = 0; i < k; i++) { var a = i / k * 2 * PI; pts.push([cx + r * Math.cos(a), cy + (ry || r) * Math.sin(a)]) } return pts }
  /* polilinea 2D spessa: il contorno */
  function striscia(pts, w) { var A = [], B = [];
    pts.forEach(function (q, i) { var a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ww = typeof w === 'function' ? w(i / (pts.length - 1)) : w;
      A.push([q[0] - dy / l * ww / 2, q[1] + dx / l * ww / 2]); B.unshift([q[0] + dy / l * ww / 2, q[1] - dx / l * ww / 2]) }); return A.concat(B) }
  function rot(pts, a, c) { c = c || [0, 0]; var co = Math.cos(a), si = Math.sin(a); return pts.map(function (q) { var x = q[0] - c[0], y = q[1] - c[1]; return [c[0] + x * co - y * si, c[1] + x * si + y * co] }) }
  /* bezier quadratica 2D campionata */
  function bz(a, c, b, k) { var pts = []; for (var i = 0; i <= k; i++) { var t = i / k; pts.push([(1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1]]) } return pts }
  /* profilo rientrato di d (per il bordo a T del cabinato) */
  function inset(P, d) { var n = P.length, E = [];
    for (var i = 0; i < n; i++) { var A = P[i], B = P[(i + 1) % n], du = B[0] - A[0], dv = B[1] - A[1], l = Math.hypot(du, dv); E.push([A[0] - dv / l * d, A[1] + du / l * d, du, dv]) }
    return P.map(function (_, j) { var a = E[(j - 1 + n) % n], b = E[j], den = a[2] * b[3] - a[3] * b[2];
      if (Math.abs(den) < 1e-9) return [b[0], b[1]];
      var t = ((b[0] - a[0]) * b[3] - (b[1] - a[1]) * b[2]) / den; return [a[0] + a[2] * t, a[1] + a[3] * t] }) }
  /* un punto su un lato del profilo di un prisma: x locale, s metri lungo il lato, d fuori dalla faccia */
  function lato(T, pr, i) { var A = pr[i], B = pr[(i + 1) % pr.length], du = B[0] - A[0], dv = B[1] - A[1], l = Math.hypot(du, dv);
    var f = function (x, s, d) { var t = s / l; d = d == null ? .003 : d; return T([x, A[1] + dv * t - du / l * d, A[0] + du * t + dv / l * d]) }; f.len = l; return f }
  /* un piano qualunque nel sistema locale: c = origine, u = destra, v = alto (vettori locali) */
  function piano(T, c, u, v) { return function (a, b) { return T([c[0] + a * u[0] + b * v[0], c[1] + a * u[1] + b * v[1], c[2] + a * u[2] + b * v[2]]) } }
  /* un piano a x costante: a = verso destra sul foglio, b = in alto; sg = +1 parete sinistra, -1 parete destra */
  function pianoX(x, zc, yc, ang, sg) { var co = Math.cos(ang || 0), si = Math.sin(ang || 0);
    return function (a, b) { var A = a * co - b * si, B = a * si + b * co; return [x, yc + B, zc + sg * A] } }
  function su(M, pts) { return pts.map(function (q) { return M(q[0], q[1]) }) }
  /* le lettere a pixel (3x5) */
  var GL = { R: [[0, 0], [0, 4], [2, 4], [2, 2], [0, 2], [2, 0]], U: [[0, 4], [0, 0], [2, 0], [2, 4]], S: [[2, 4], [0, 4], [0, 2], [2, 2], [2, 0], [0, 0]],
    H: [[0, 0], [0, 4], [0, 2], [2, 2], [2, 4], [2, 0]], O: [[0, 0], [0, 4], [2, 4], [2, 0], [0, 0]], M: [[0, 0], [0, 4], [1, 2.2], [2, 4], [2, 0]],
    E: [[2, 4], [0, 4], [0, 2], [1.5, 2], [0, 2], [0, 0], [2, 0]], N: [[0, 0], [0, 4], [2, 0], [2, 4]], P: [[0, 0], [0, 4], [2, 4], [2, 2], [0, 2]],
    I: [[1, 0], [1, 4]], Z: [[0, 4], [2, 4], [0, 0], [2, 0]], A: [[0, 0], [0, 4], [2, 4], [2, 0], [2, 2], [0, 2]],
    C: [[2, 4], [0, 4], [0, 0], [2, 0]], F: [[2, 4], [0, 4], [0, 2], [1.5, 2], [0, 2], [0, 0]], L: [[0, 4], [0, 0], [2, 0]], T: [[0, 4], [2, 4], [1, 4], [1, 0]] };
  function scritta(p, txt, map, o) { txt.split('').forEach(function (ch, k) { var g = GL[ch]; if (g) p.line(g.map(function (q) { return map(k * 3.2 + q[0], q[1]) }), o) }) }
  /* la grafia a mano: occhielli (cicloide allungata), come una parola scritta in fretta */
  function grafia(a0, a1, b, h, n) { var pts = [], k = n * 9, r = (a1 - a0) / (n * 2 * PI);
    for (var i = 0; i <= k; i++) { var t = i / k * n * 2 * PI, hh = h * (.75 + .35 * Math.sin(t * .37 + a0 * 40));
      pts.push([a0 + r * t - r * 1.7 * Math.sin(t), b + hh * (1 - Math.cos(t)) / 2]) } return pts }
  /* lo scotch: un rettangolino storto */
  function scotch(p, M, a, b, ang, f) { p.line(su(M, rot([[-.05, -.016], [.05, -.016], [.05, .016], [-.05, .016]], ang).map(function (q) { return [q[0] + a, q[1] + b] })), { closed: true, cls: 'tape', on: f }) }
  function opz(o, cls) { var r = { cls: cls }; if (o && o.hot) { r.hot = o.hot; r.label = o.label || '' } return r }

  /* ================= i modelli (si guardano anche da vicino, girando) ================= */
  var MOD = {};

  /* il furgoncino rosso delle pizze, un giocattolo: lungo .55, largo .21 */
  MOD.truck = function (L, T, o) {
    var w = .21, hw = w / 2, lz = .275;
    var p = L.part(opz(o, 'truck'));
    /* il profilo di fianco (u = profondita', v = altezza), davanti a u = 0 */
    var pr0 = [[0, .03], [.55, .03], [.55, .27], [.16, .27], [.16, .2], [.08, .2], [.025, .13], [0, .12]];
    var pr = pr0.map(function (q) { return [q[0] - lz, q[1]] });
    var c = p.prism(pr, -hw, hw, T, { fill: 'red' });
    /* i fianchi: SL a sinistra (x = -hw), SR a destra; u come nel profilo originale */
    function SL(u, v) { return T([-hw - .002, v, u - lz]) }
    function SR(u, v) { return T([hw + .002, v, u - lz]) }
    function onL(pts, oo) { oo.on = c.l; return p.line(pts.map(function (q) { return SL(q[0], q[1]) }), oo) }
    function onR(pts, oo) { oo.on = c.r; return p.line(pts.map(function (q) { return SR(q[0], q[1]) }), oo) }
    var u = .0095;
    /* sinistra: la portiera, il finestrino, la cucina con il cuoco, PIZZA */
    onL([[.04, .04], [.145, .04], [.145, .19], [.078, .19], [.035, .132]], { closed: true, cls: 'dt' });
    onL([[.07, .145], [.135, .145], [.135, .182], [.083, .182]], { closed: true, fill: 'kf' });
    onL([[.2, .118], [.49, .118], [.49, .212], [.2, .212]], { closed: true, fill: 'kf' });
    p.circle(SL(.35, .148), .018, 'x', { on: c.l, fill: 'wf', k: 12 });
    onL([[.334, .164], [.366, .164], [.372, .186], [.36, .198], [.35, .191], [.34, .198], [.328, .186]], { closed: true, fill: 'wf' });
    onL([[.19, .118], [.5, .118]], {});
    scritta(p, 'PIZZA', function (gx, gy) { return SL(.395 - gx * u, .058 + gy * u) }, { cls: 'px wl', on: c.l });
    /* destra: portiera, finestrino, la pizza dipinta e PIZZA che si legge da destra */
    onR([[.04, .04], [.145, .04], [.145, .19], [.078, .19], [.035, .132]], { closed: true, cls: 'dt' });
    onR([[.07, .145], [.135, .145], [.135, .182], [.083, .182]], { closed: true, fill: 'kf' });
    onR(cer(.33, .17, .042, 18), { closed: true, fill: 'wf' });
    for (var s0 = 0; s0 < 3; s0++) { var a0 = s0 / 3 * PI + .3; onR([[.33 + .042 * Math.cos(a0), .17 + .042 * Math.sin(a0)], [.33 - .042 * Math.cos(a0), .17 - .042 * Math.sin(a0)]], { cls: 'ink' }) }
    [[.018, .012], [-.02, .015], [.005, -.022], [-.016, -.012]].forEach(function (q) { onR(cer(.33 + q[0], .17 + q[1], .007, 8), { closed: true, fill: 'red' }) });
    scritta(p, 'PIZZA', function (gx, gy) { return SR(.255 + gx * u, .058 + gy * u) }, { cls: 'px wl', on: c.r });
    onR([[.19, .12], [.5, .12]], { cls: 'dt' });
    /* le ruote, su tutti e due i fianchi; sotto il davanti e il dietro si vedono le gomme */
    [.095, .455].forEach(function (uc) {
      [[SL, c.l, -hw - .002], [SR, c.r, hw + .002]].forEach(function (q) {
        p.line(arco(T, [q[2], .04, uc - lz], .052, 'x', 0, PI, 10), { cls: 'dt', on: q[1] });
        p.circle(q[0](uc, .04), .04, 'x', { on: q[1], fill: 'kf', k: 16 });
        p.circle(q[0](uc, .04), .016, 'x', { on: q[1], cls: 'dt', k: 10 }) }) });
    var fr = c.sides[7], bk = c.sides[1];
    [-1, 1].forEach(function (sx) {
      p.line([T([sx * (hw - .012), .0, -lz - .002]), T([sx * (hw - .012), .03, -lz - .002]), T([sx * (hw - .05), .03, -lz - .002]), T([sx * (hw - .05), .0, -lz - .002])], { closed: true, fill: 'kf', on: fr });
      p.line([T([sx * (hw - .012), .0, lz + .002]), T([sx * (hw - .012), .03, lz + .002]), T([sx * (hw - .05), .03, lz + .002]), T([sx * (hw - .05), .0, lz + .002])], { closed: true, fill: 'kf', on: bk }) });
    /* davanti: fari, griglia, paraurti; il parabrezza */
    [-.065, .065].forEach(function (x) { p.circle(T([x, .085, -lz - .002]), .014, 'z', { on: fr, fill: 'wf', k: 10 }) });
    for (var g = 0; g < 3; g++) p.line([T([-.03 + g * .03, .06, -lz - .002]), T([-.03 + g * .03, .1, -lz - .002])], { cls: 'dt', on: fr });
    p.line([T([-hw - .005, .045, -lz - .004]), T([hw + .005, .045, -lz - .004])], { on: fr });
    var ws = lato(T, pr, 5);
    p.line([ws(-hw + .02, .01), ws(hw - .02, .01), ws(hw - .02, ws.len - .012), ws(-hw + .02, ws.len - .012)], { closed: true, fill: 'kf', on: c.sides[5] });
    /* dietro: due sportelli con i vetrini, i fanalini, la targa, il paraurti */
    var zb = lz + .002;
    p.line([T([0, .045, zb]), T([0, .255, zb])], { on: bk });
    [-1, 1].forEach(function (sx) {
      p.line([T([sx * .015, .17, zb]), T([sx * .08, .17, zb]), T([sx * .08, .235, zb]), T([sx * .015, .235, zb])], { closed: true, fill: 'kf', on: bk });
      p.line([T([sx * .012, .12, zb]), T([sx * .03, .12, zb])], { on: bk });
      p.line([T([sx * .088, .07, zb]), T([sx * .1, .07, zb]), T([sx * .1, .1, zb]), T([sx * .088, .1, zb])], { closed: true, fill: 'wf', on: bk }) });
    p.line([T([-.035, .052, zb]), T([.035, .052, zb]), T([.035, .072, zb]), T([-.035, .072, zb])], { closed: true, fill: 'wf', on: bk });
    p.line([T([-hw - .005, .04, zb + .002]), T([hw + .005, .04, zb + .002])], { on: bk });
    /* l'insegna sul tetto con la pizza, dipinta su tutte e due le facce */
    var sb = p.box([-.01, .27, -.005, .01, .37, .195], T, {});
    [[sb.l, -.0115], [sb.r, .0115]].forEach(function (q) { var f = q[0], x = q[1], pc = [x, .32, .095];
      p.line(anello(T, pc, .042, 'x', 18), { closed: true, fill: 'wf', on: f });
      for (var s = 0; s < 3; s++) { var a = s / 3 * PI + .3; p.line([T([x, pc[1] + .04 * Math.sin(a), pc[2] + .04 * Math.cos(a)]), T([x, pc[1] - .04 * Math.sin(a), pc[2] - .04 * Math.cos(a)])], { cls: 'ink', on: f }) }
      [[.018, .012], [-.02, .015], [.005, -.022], [-.016, -.012]].forEach(function (r) { p.line(anello(T, [x * 1.02, pc[1] + r[1], pc[2] + r[0]], .007, 'x', 8), { closed: true, fill: 'red', on: f }) }) });
    /* la tenda a righe sopra la cucina (a sinistra): una parte a se', fuori dal fianco */
    var pa = L.part(opz(o, 'truck'));
    var A = T([-hw, .238, .19 - lz]), B = T([-hw, .238, .5 - lz]), C = T([-hw - .06, .2, .5 - lz]), D = T([-hw - .06, .2, .19 - lz]);
    [T([-hw + .1, .15, .3 - lz]), T([-hw - .2, .4, .3 - lz])].forEach(function (ins) { var aw = fc(pa, [A, B, C, D], ins, { fill: 'red' });
      for (var i = 1; i < 8; i += 2) { var t0 = i / 8, t1 = (i + 1) / 8; pa.line([lerp3(A, B, t0), lerp3(A, B, t1), lerp3(D, C, t1), lerp3(D, C, t0)], { closed: true, fill: 'wf', cls: 'dt', on: aw }) }
      var sc = []; for (var j = 0; j <= 16; j++) { var q = lerp3(D, C, j / 16); sc.push(j % 2 ? [q[0], q[1] - .014, q[2]] : q) }
      pa.line(sc, { on: aw }) });
    return [p, pa];
  };

  /* il menu del ristorante: un cartoncino a tenda, largo .2, alto .25. Davanti il menu, dietro il grazie */
  MOD.menu = function (L, T, o) {
    var p = L.part(opz(o, 'menu'));
    var W = .1, h = .243, dz = .06, ins = T([0, .08, 0]);
    var F = fc(p, [T([-W, 0, -dz]), T([W, 0, -dz]), T([W, h, 0]), T([-W, h, 0])], ins, { cls: 'note' });
    var K = fc(p, [T([W, 0, dz]), T([-W, 0, dz]), T([-W, h, 0]), T([W, h, 0])], ins, { cls: 'note' });
    /* il piano di ogni faccia: a = destra per chi la guarda, b = su lungo il cartoncino */
    var lv = Math.hypot(h, dz), vF = [0, h / lv, dz / lv], vK = [0, h / lv, -dz / lv];
    var nF = [0, dz / lv, -h / lv], nK = [0, dz / lv, h / lv], e = .0015;
    var MF = piano(T, [nF[0] * e, nF[1] * e, -dz + nF[2] * e], [1, 0, 0], vF), MK = piano(T, [nK[0] * e, nK[1] * e, dz + nK[2] * e], [-1, 0, 0], vK);
    var uF = unit(sub(MF(1, 0), MF(0, 0))), uK = unit(sub(MK(1, 0), MK(0, 0)));
    function tx(M, U, V, f, a, b, txt, size, cls) { var vv = unit(sub(M(0, 1), M(0, 0))); return p.text(M(a, b), txt, size, { u: U, v: vv, cls: cls, anchor: 'middle', on: f }) }
    function pom(M, f, a, b, r) { p.line(su(M, cer(a, b, r, 14)), { closed: true, cls: 'mtom', on: f });
      p.line(su(M, [[a - r * .7, b + r * 1.1], [a, b + r * .75], [a + r * .7, b + r * 1.1]]), { cls: 'ink', on: f });
      p.line(su(M, [[a, b + r * .75], [a + r * .15, b + r * 1.5]]), { cls: 'ink', on: f }) }
    [[MF, F, uF], [MK, K, uK]].forEach(function (q) { var M = q[0], f = q[1];
      p.line(su(M, [[-.088, .012], [.088, .012], [.088, .238], [-.088, .238]]), { closed: true, cls: 'ink dt', on: f }) });
    /* davanti: il pomodoro (si preme), il nome, MENU, i piatti con i prezzi */
    pom(MF, F, 0, .208, .013);
    tx(MF, uF, null, F, 0, .158, "Vitalia's", .03, 'mink');
    tx(MF, uF, null, F, 0, .136, 'R E S T A U R A N T', .0085, 'mink mo2');
    p.line(su(MF, [[-.05, .127], [.05, .127]]), { cls: 'ink', on: F });
    var piatti = [['Margherita', '18'], ['Diavola', '22'], ['Burrata', '19'], ['Lasagna', '24'], ['Tiramisu', '12']];
    piatti.forEach(function (d, i) { var b = .105 - i * .019;
      p.text(MF(-.072, b), d[0], .0105, { u: uF, v: unit(sub(MF(0, 1), MF(0, 0))), cls: 'mink mo2', on: F });
      p.text(MF(.072, b), d[1], .0105, { u: uF, v: unit(sub(MF(0, 1), MF(0, 0))), cls: 'mink mo2', anchor: 'end', on: F });
      p.line(su(MF, [[-.01, b + .002], [.052, b + .002]]), { cls: 'ink dots', on: F }) });
    /* dietro: grazie, e la citta' */
    pom(MK, K, 0, .19, .02);
    tx(MK, uK, null, K, 0, .13, 'Grazie.', .032, 'mink');
    tx(MK, uK, null, K, 0, .1, 'CAIRNS · AUSTRALIA', .0085, 'mink mo2');
    /* i fianchi aperti: due triangoli a filo */
    [-W, W].forEach(function (x) { p.line([T([x, 0, -dz]), T([x, h, 0]), T([x, 0, dz])], { cls: 'dt' }) });
    return [p];
  };

  /* il telefono a disco, anni '60: largo .22, profondo .21, con la cornetta, il filo a spirale e la spia */
  MOD.phone = function (L, T, o) {
    var p = L.part(opz(o, 'phone'));
    var pr = [[-.105, 0], [.105, 0], [.105, .04], [.09, .075], [.05, .095], [-.02, .105], [-.1, .035], [-.105, .015]];
    var c = p.prism(pr, -.11, .11, T, { hatchSide: function (i) { return i === 2 ? 3 : 0 } });
    /* lo zoccolo: una riga di gomma tutto intorno */
    [c.l, c.r].forEach(function (f, n) { var x = n ? .1115 : -.1115; p.line(inset(pr, .01).map(function (q) { return T([x, q[1], q[0]]) }), { closed: true, cls: 'dt', on: f }) });
    p.line([T([-.11, .012, -.1035]), T([.11, .012, -.1035])], { cls: 'dt', on: c.sides[7] });
    /* il disco sul davanti inclinato: dieci buchi, il cartellino, il fermo */
    var D = lato(T, pr, 5), sc = D.len / 2;
    function d5(pts, oo) { oo.on = c.sides[5]; return p.line(pts.map(function (q) { return D(q[0], q[1], q[2]) }), oo) }
    d5(cer(0, sc, .046, 28).map(function (q) { return [q[0], q[1], .004] }), { closed: true });
    d5(cer(0, sc, .043, 28).map(function (q) { return [q[0], q[1], .004] }), { closed: true, cls: 'dt' });
    for (var i = 0; i < 10; i++) { var a = PI * .35 + i / 12 * 2 * PI;
      d5(cer(.03 * Math.cos(a), sc + .03 * Math.sin(a), .0068, 10).map(function (q) { return [q[0], q[1], .005] }), { closed: true, fill: 'kf' }) }
    d5(cer(0, sc, .015, 16).map(function (q) { return [q[0], q[1], .005] }), { closed: true, fill: 'wf' });
    d5([[-.008, sc + .003, .006], [.008, sc + .003, .006]], { cls: 'ink' }); d5([[-.006, sc - .003, .006], [.006, sc - .003, .006]], { cls: 'ink' });
    var fa = PI * .35 - .45; d5([[.038 * Math.cos(fa), sc + .038 * Math.sin(fa), .006], [.05 * Math.cos(fa), sc + .05 * Math.sin(fa), .006]], { cls: 'stick' });
    /* la spia: chi chiama (pomodoro, lampeggia) */
    d5([[.078, .012, .004], [.09, .012, .004], [.09, .022, .004], [.078, .022, .004]], { closed: true, cls: 'led o' });
    /* la forcella e la cornetta, di traverso sopra */
    [-1, 1].forEach(function (sx) { p.box([sx * .062 - .012, .098, -.012, sx * .062 + .012, .128, .022], T, {}) });
    var hs = rr(.004, .142, .017, .012, .008, 2);
    var hc = p.prism(hs, -.08, .08, T, {});
    [-1, 1].forEach(function (sx) {
      var cup = fusto(p, T, [sx * .092, .004], .03, .022, .116, .152, 9, { bot: true, rot: .35 });
            for (var k = 0; k < 4; k++) p.line(anello(T, [sx * .092, .1157, .004], .005 + k * .004, 'y', 10), { closed: true, cls: 'dt', on: cup.b }) });
    p.line([T([-.06, .154, -.009]), T([.06, .154, -.009])], { cls: 'dt', on: hc.sides[0] });
    /* il filo a spirale: dalla cornetta giu' sul tavolo e dentro il fianco (una parte a se') */
    var cd = L.part(opz(o, 'phone'));
    var P0 = [-.112, .128, .004], Cc = [-.25, -.07, -.03], P1 = [-.111, .028, .07], pts = [], n = 150, turns = 26;
    for (var j = 0; j <= n; j++) { var t = j / n, q = lerp3(lerp3(P0, Cc, t), lerp3(Cc, P1, t), t), tg = unit(sub(lerp3(Cc, P1, t), lerp3(P0, Cc, t)));
      var n1 = unit(cross(tg, Math.abs(tg[2]) < .9 ? [0, 0, 1] : [1, 0, 0])), n2 = cross(tg, n1), r = .0065 * Math.min(1, t * 12, (1 - t) * 12 + .2), ang = t * turns * 2 * PI;
      pts.push(T([q[0] + r * (Math.cos(ang) * n1[0] + Math.sin(ang) * n2[0]), Math.max(.002, q[1] + r * (Math.cos(ang) * n1[1] + Math.sin(ang) * n2[1])), q[2] + r * (Math.cos(ang) * n1[2] + Math.sin(ang) * n2[2])])) }
    cd.line(pts, { cls: 'cord' });
    return [p, cd];
  };
  window.STANZA_MODELLI = MOD;

  /* ================= la stanza ================= */
  window.STANZA_OGGETTI = function (L) {
    var part = L.part, frame = L.frame, ID = L.ID, Z1 = L.Z1;

    /* ---------- il cabinato: Rush hour, contro la parete di destra, girato verso il centro ---------- */
    function cabinato() {
      var p = part({ cls: 'arc', hot: 'arcade', label: 'Arcade cabinet. Play Rush hour' });
      /* girato a sinistra: il davanti guarda il centro della stanza, si vede il fianco destro */
      var yw = 1.15, T = frame([4.4 - .32 * Math.sin(yw), 0, 5.35 - .32 * Math.cos(yw)], yw), w = .34;
      var pr = [[.04, 0], [.8, 0], [.8, 1.25], [.62, 1.86], [-.02, 1.86], [-.02, 1.56], [.3, 1.5], [.12, 1.02], [-.16, .94], [-.16, .84], [.04, .8]];
      var c = p.prism(pr, -w, w, T, { hatchSide: function (i) { return i === 8 ? 2 : i === 5 ? 3 : 0 } });
      var S = c.sides;
      function su2(i, pts, o) { var at = lato(T, pr, i); o.on = S[i]; return p.line(pts.map(function (q) { return at(q[0], q[1], q[2]) }), o) }
      function ell(i, x, s, r, d, k, o) { var at = lato(T, pr, i), pts = []; for (var j = 0; j < k; j++) { var a = j / k * 2 * PI; pts.push(at(x + r * Math.cos(a), s + r * Math.sin(a), d)) } o.on = S[i]; o.closed = true; return p.line(pts, o) }
      function ret(i, x0, s0, x1, s1, o) { o.closed = true; return su2(i, [[x0, s0], [x1, s0], [x1, s1], [x0, s1]], o) }
      /* i fianchi: il bordo a T e la striscia della strada; sul fianco in vista un po' d'ombra in basso */
      [[c.l, -w - .002], [c.r, w + .002]].forEach(function (q) {
        var f = q[0], x = q[1]; function F2(u, v) { return T([x, v, u]) }
        p.line(inset(pr, .024).map(function (k) { return F2(k[0], k[1]) }), { closed: true, cls: 'dt', on: f });
        p.line([F2(.775, .18), F2(.07, .56)], { on: f }); p.line([F2(.775, .38), F2(.07, .76)], { on: f });
        for (var d = 0; d < 5; d++) { var t0 = .06 + d * .19, t1 = t0 + .09; p.line([F2(.775 - .705 * t0, .28 + .38 * t0), F2(.775 - .705 * t1, .28 + .38 * t1)], { cls: 'dt', on: f }) }
        for (var v = 0; v < 4; v++) p.line([F2(.56, 1.42 + v * .07), F2(.7, 1.42 + v * .07)], { cls: 'dt', on: f });
        for (var hh = 0; hh < 5; hh++) p.line([F2(.1 + hh * .14, .04), F2(.18 + hh * .14, .14)], { cls: 'dt', on: f });
      });
      /* l'insegna: RUSH HOUR a pixel, accesa */
      ret(4, -w + .035, .035, w - .035, .265, { cls: 'dt' });
      var u = .0172, x0 = -(9 * 3.2 - 1.2) * u / 2, at4 = lato(T, pr, 4);
      scritta(p, 'RUSH HOUR', function (gx, gy) { return at4(x0 + gx * u, .15 - (gy - 2) * u) }, { cls: 'px mq', on: S[4] });
      /* lo schermo: la cornice, il vetro, e il gioco dentro (un palazzo, l'ascensore, la gente che aspetta) */
      var L6 = lato(T, pr, 6), sc = L6.len / 2;
      su2(6, rr(0, sc, .27, .225, .02, 2), { closed: true, cls: 'dt' });
      su2(6, rr(0, sc, .24, .19, .035, 3), { closed: true });
      [.13, .2, .27, .34, .41].forEach(function (s) { su2(6, [[-.2, s], [-.045, s]], { cls: 'scr dt' }); su2(6, [[.045, s], [.2, s]], { cls: 'scr dt' }) });
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

    /* la prolunga arrotolata per terra tra il cabinato e il banco, la ciabatta accesa, il cavo del cabinato */
    function prolunga(T) {
      var p = part({ cls: 'coil' });
      var cx = 3.75, cz = 6.85;
      for (var i = 0; i < 5; i++) p.circle([cx + Math.sin(i * 1.7) * .03, .006 + i * .004, cz + Math.cos(i * 2.1) * .025], .22 - i * .012, 'y', { cls: 'cable', k: 30 });
      var x0 = 4.05, z0 = 6.22;
      var b = p.box([x0, 0, z0, x0 + .28, .055, z0 + .12], ID, {});
      for (var s = 0; s < 3; s++) { var x = x0 + .05 + s * .065; p.line([[x, .056, z0 + .03], [x + .04, .056, z0 + .03], [x + .04, .056, z0 + .09], [x, .056, z0 + .09]], { closed: true, cls: 'dt', on: b.t }) }
      p.line([[x0 + .24, .056, z0 + .03], [x0 + .265, .056, z0 + .03], [x0 + .265, .056, z0 + .09], [x0 + .24, .056, z0 + .09]], { closed: true, cls: 'led o', on: b.t });
      p.curve([x0, .02, z0 + .08], [3.9, .01, 6.5], [cx + .1, .01, cz - .2], { cls: 'cable' });
      /* il cavo del cabinato, dalla schiena alla ciabatta */
      p.curve(T([.18, .1, .8]), T([.4, 0, 1.2]), [x0 + .1, .03, z0 + .06], { cls: 'cable' });
      /* e la coda che va sotto il banco */
      p.curve([cx + .2, .01, cz + .1], [4.5, .01, 7.4], [5.3, .01, 8.3], { cls: 'cable' });
    }

    /* ---------- il banco da lavoro, in fondo a destra ---------- */
    function banco() {
      var p = part({ cls: 'bench' }); zz(p, 10.5);
      var t = p.box([4.2, .84, 7.6, 5.58, .92, 10.2], ID, {});
      /* le venature del legno sul bordo */
      p.line([[4.199, .89, 7.7], [4.199, .89, 8.8], [4.199, .885, 9.3]], { cls: 'dt', on: t.l });
      p.line([[4.199, .868, 9.1], [4.199, .868, 10.0]], { cls: 'dt', on: t.l });
      p.line([[4.199, .875, 8.1], [4.199, .872, 8.5]], { cls: 'dt', on: t.l });
      [[4.27, 7.67], [4.27, 10.07], [5.45, 7.67], [5.45, 10.07]].forEach(function (q) { p.box([q[0], 0, q[1], q[0] + .065, .84, q[1] + .065], ID, { hatch: { r: 2 } }) });
      var sh = p.box([4.24, .16, 7.64, 5.56, .21, 10.16], ID, {});
      p.line([[4.239, .185, 7.7], [4.239, .185, 10.1]], { cls: 'dt', on: sh.l });
      /* i cassetti appesi sotto, quello in alto mezzo aperto */
      var d = p.box([4.26, .5, 9.2, 5.56, .84, 10.07], ID, {});
      p.line([[4.259, .67, 9.22], [4.259, .67, 10.05]], { cls: 'dt', on: d.l });
      p.line([[4.259, .585, 9.5], [4.259, .585, 9.75]], { on: d.l });
      var dr = p.box([4.12, .68, 9.26, 4.26, .83, 10.01], ID, {});
      p.line([[4.119, .755, 9.5], [4.119, .755, 9.78]], { on: dr.l });
      p.line([[4.15, .83, 9.35], [4.06, .95, 9.47]], { cls: 'stick' });
      p.line([[4.18, .83, 9.7], [4.1, .9, 9.92]], { cls: 'dt' });
      /* la croce sul fianco corto */
      p.line([[4.335, .23, 7.7], [5.45, .82, 7.7]], { cls: 'brace' }); p.line([[4.335, .82, 7.7], [5.45, .23, 7.7]], { cls: 'brace' });
    }

    /* la cassetta degli attrezzi sul ripiano */
    function cassetta() {
      var p = part({ cls: 'bench' }); zz(p, 10.48);
      var b = p.box([4.42, .21, 8.5, 4.74, .44, 9.12], ID, { hatch: { f: 0 } });
      p.line([[4.419, .39, 8.5], [4.419, .39, 9.12]], { cls: 'dt', on: b.l });
      p.line([[4.42, .39, 8.499], [4.74, .39, 8.499]], { cls: 'dt', on: b.f });
      p.line([[4.419, .35, 8.76], [4.419, .41, 8.76], [4.419, .41, 8.86], [4.419, .35, 8.86]], { closed: true, cls: 'dt', on: b.l });
      p.line([[4.58, .44, 8.62], [4.58, .52, 8.66], [4.58, .52, 8.96], [4.58, .44, 9.0]], { cls: 'stick' });
    }

    /* il foglio da disegno sul banco: la costruzione di un marchio, con il compasso e la matita. Un angolo si arriccia */
    function tavola() {
      var p = part({ cls: 'sheet' }); zz(p, 10.45);
      /* sta su una tavoletta inclinata, cosi' si vede: un sistema girato e poi alzato dietro */
      var T0 = frame([4.9, .921, 8.75], .22), ca = Math.cos(.5), sa = Math.sin(.5), y = 0;
      var T = function (q) { return T0([q[0], .21 * sa + .032 + q[1] * ca + q[2] * sa, -q[1] * sa + q[2] * ca]) };
      T.dir = function (n) { return T0.dir([n[0], n[1] * ca + n[2] * sa, -n[1] * sa + n[2] * ca]) };
      var tb = p.box([-.33, -.03, -.24, .33, -.002, .24], T, { hatch: { f: 2 } });
      p.box([-.26, 0, .15, .26, .21 * sa + .02 + .19 * sa, .2], T0, {});
      var S = function (a, c2) { return T([a, y, c2]) };
      var f = p.face([S(-.3, -.1), S(-.3, .21), S(.3, .21), S(.3, -.21), S(-.2, -.21)].reverse(), T.dir([0, 1, 0]), { cls: 'note' });
      var M = function (a, b) { return T([a, .0015, b]) };
      /* la cornice, il cartiglio, le linee guida */
      p.line(su(M, [[-.18, -.19], [.28, -.19], [.28, .19], [-.28, .19], [-.28, -.08]]), { cls: 'ink dt', on: f });
      p.line(su(M, [[.12, .19], [.28, .19], [.28, .13], [.12, .13]]), { closed: true, cls: 'ink dt', on: f });
      p.line(su(M, [[.12, .16], [.28, .16]]), { cls: 'ink dt', on: f });
      p.line(su(M, [[-.27, -.02], [.1, -.02]]), { cls: 'ink dt', on: f }); p.line(su(M, [[-.27, .1], [.1, .1]]), { cls: 'ink dt', on: f });
      p.line(su(M, [[-.09, -.18], [-.09, .17]]), { cls: 'ink dt', on: f });
      p.line(su(M, [[-.24, -.15], [.06, .15]]), { cls: 'ink dt', on: f });
      /* i cerchi di costruzione e la m: due archi con le aste */
      [[-.15, .04, .06], [-.03, .04, .06], [-.09, .04, .12]].forEach(function (q) { p.line(su(M, cer(q[0], q[1], q[2], 28)), { closed: true, cls: 'ink dt', on: f }) });
      [-.15, -.03].forEach(function (cx) { var pts = [[cx - .06, -.08]]; for (var i = 0; i <= 12; i++) { var a = PI - i / 12 * PI; pts.push([cx + .06 * Math.cos(a), .04 + .06 * Math.sin(a)]) } pts.push([cx + .06, -.08]); p.line(su(M, pts), { cls: 'ink', on: f }) });
      /* le quote */
      p.line(su(M, [[-.21, -.13], [.03, -.13]]), { cls: 'ink dt', on: f });
      [-.21, .03].forEach(function (a) { p.line(su(M, [[a, -.115], [a, -.145]]), { cls: 'ink dt', on: f }) });
      /* l'angolo arricciato: due facce, sopra e sotto */
      var A = S(-.3, -.1), B = S(-.2, -.21), tip = T([-.255, .07, -.135]), mid = T([-.27, .03, -.165]);
      [T([-.2, -.1, -.1]), T([-.4, .3, -.3])].forEach(function (ins) { fc(p, [A, mid, tip, B], ins, { cls: 'note' }) });
      /* il compasso: le gambe aperte sul centro del cerchio, la testa in alto */
      var q = part({ cls: 'sheet' }); zz(q, 10.44);
      var hx = T([-.09, .13, -.04]), l1 = T([-.03, .002, -.04]), l2 = T([-.16, .002, -.02]);
      q.line([hx, l1], { cls: 'stick' }); q.line([hx, l2], { cls: 'stick' }); q.line([hx, l1], { cls: 'inkst' }); q.line([hx, l2], { cls: 'inkst' });
      q.line([lerp3(hx, l1, .55), lerp3(hx, l2, .55)], { cls: 'dt' });
      q.circle(hx, .01, 'z', { fill: 'kf', k: 10 });
      q.line([hx, [hx[0], hx[1] + .04, hx[2]]], { cls: 'stick' });
      /* la matita, appoggiata di traverso */
      var Tm = frame(T([.12, .004, .1]), .22 + 1.1);
      q.box([-.08, 0, -.004, .07, .008, .004], Tm, {});
      q.line([Tm([.07, .0, -.004]), Tm([.095, .004, 0]), Tm([.07, .008, .004])], {});
      q.line([Tm([-.06, .008, -.004]), Tm([-.06, .008, .004])], { cls: 'dt' });
    }

    /* il pannello forato con gli attrezzi; quello che manca e' rimasto sul banco */
    function pannello() {
      var p = part({ cls: 'peg' }); zz(p, 10.8);
      var b = p.box([5.555, 1.0, 7.8, 5.6, 1.68, 10.0], ID, {});
      var x = 5.553, f = b.l, holes = [];
      for (var z = 7.88; z < 9.97; z += .08) holes.push(p.line([[x, 1.04, z], [x, 1.66, z]], { cls: 'cn hole', on: f }));
      /* i fori: puntini a passo vero, che si stringono con la distanza */
      setTimeout(function () { holes.forEach(function (l) { if (l.e) l.e.style.strokeDasharray = '0 ' + (.08 * 700 / l.pts[0][2]).toFixed(2) }) }, 0);
      function att(zc, yc, ang) { return pianoX(x - .001, zc, yc, ang, -1) }
      var o = { closed: true, fill: 'kf', on: f };
      /* il martello */
      var M = att(8.06, 1.3, .06);
      p.line(su(M, [[-.013, -.17], [.013, -.17], [.012, .1], [-.012, .1]]), o);
      p.line(su(M, [[-.05, .095], [.035, .095], [.06, .085], [.088, .058], [.094, .066], [.072, .1], [.045, .14], [-.05, .14]]), o);
      p.line(su(M, [[-.013, -.12], [.013, -.12]]), { cls: 'dt', on: f }); p.line(su(M, [[-.013, -.09], [.013, -.09]]), { cls: 'dt', on: f });
      /* la pinza */
      M = att(8.32, 1.3, -.05);
      p.line(su(M, striscia([[-.004, .16], [-.006, .1], [0, .05], [-.035, -.14]], function (t) { return .012 + t * .01 })), o);
      p.line(su(M, striscia([[.004, .16], [.006, .1], [0, .05], [.035, -.14]], function (t) { return .012 + t * .01 })), o);
      p.circle(M(0, .05), .011, 'x', { on: f, fill: 'kf', k: 10 });
      /* due cacciaviti */
      [[8.53, .03], [8.63, -.08]].forEach(function (q) { M = att(q[0], 1.36, q[1]);
        p.line(su(M, [[0, -.02], [0, -.17]]), { cls: 'stick', on: f });
        p.line(su(M, rr(0, .04, .017, .055, .012, 2)), o);
        p.line(su(M, [[-.006, .0], [-.006, .08]]), { cls: 'dt', on: f }); p.line(su(M, [[.006, .0], [.006, .08]]), { cls: 'dt', on: f }) });
      /* il metro a nastro */
      M = att(8.86, 1.42, .1);
      p.line(su(M, rr(0, 0, .042, .042, .014, 2)), o);
      p.line(su(M, [[-.042, -.025], [-.06, -.025], [-.06, -.04], [-.042, -.04]]), { cls: 'dt', on: f });
      p.circle(M(0, 0), .018, 'x', { on: f, cls: 'dt', k: 12 });
      /* la sagoma della chiave inglese: la chiave non c'e' (chissa' dove) */
      M = att(9.14, 1.3, -.08);
      p.line(su(M, [[-.011, -.12], [.011, -.12], [.011, .095], [.03, .11], [.034, .145], [.016, .162], [.009, .135], [-.009, .135], [-.016, .162], [-.034, .145], [-.03, .11], [-.011, .095]]), { closed: true, cls: 'cn ghost', on: f });
      p.circle(M(0, -.135), .026, 'x', { on: f, cls: 'cn ghost', k: 14 });
    }

    /* lo schizzo del palazzo appeso al pannello: i piani, l'ascensore, LG in fondo con la freccia */
    function schizzo() {
      var p = part({ cls: 'sketch' }); zz(p, 10.75);
      var M = pianoX(5.546, 9.62, 1.33, .04, -1);
      var f = p.face(su(M, [[-.13, -.19], [.13, -.19], [.13, .19], [-.13, .19]]), [-1, 0, 0], { cls: 'note' });
      var N = pianoX(5.544, 9.62, 1.33, .04, -1);
      /* il palazzo: sei piani e uno sotto, la gabbia dell'ascensore */
      var x0 = -.08, x1 = .07, yb = -.09;
      p.line(su(N, [[x0, yb], [x0, .14], [x1, .14], [x1, yb]]), { cls: 'ink', on: f });
      p.line(su(N, [[x0 - .03, yb], [x1 + .04, yb]]), { cls: 'ink', on: f });
      for (var i = 1; i < 6; i++) p.line(su(N, [[x0, yb + i * .0383], [x1, yb + i * .0383 + .002]]), { cls: 'ink dt', on: f });
      p.line(su(N, [[x0, yb - .05], [x1, yb - .05], [x1, yb], [x0, yb]]), { cls: 'ink dt', on: f });
      p.line(su(N, [[-.01, yb - .05], [-.01, .14]]), { cls: 'ink dt', on: f }); p.line(su(N, [[.02, yb - .05], [.02, .14]]), { cls: 'ink dt', on: f });
      p.line(su(N, [[-.005, yb - .042], [.015, yb - .042], [.015, yb - .012], [-.005, yb - .012]]), { closed: true, cls: 'ink', on: f });
      /* la freccia a mano che indica il piano sotto, e lo scarabocchio */
      p.line(su(N, [[.11, .02], [.1, -.06], [.04, -.12]]), { cls: 'ink', on: f });
      p.line(su(N, [[.055, -.126], [.04, -.12], [.048, -.105]]), { cls: 'ink', on: f });
      p.line(su(N, grafia(.035, .11, .04, .018, 2)), { cls: 'ink', on: f });
      p.line(su(N, grafia(-.11, -.02, .155, .02, 3)), { cls: 'ink', on: f });
      /* la puntina, bianca: questo non si preme */
      p.circle(M(0, .175), .014, 'x', { on: f, fill: 'kf', k: 10 });
    }

    /* la mensola sopra il banco */
    function mensola() {
      var p = part({ cls: 'shelf' }); zz(p, 10.7);
      p.box([5.05, 1.72, 7.8, 5.58, 1.76, 10.0], ID, {});
      [8.05, 9.75].forEach(function (z) { p.line([[5.575, 1.715, z], [5.575, 1.5, z], [5.2, 1.715, z]], { closed: true, cls: 'dt' }) });
    }

    /* il furgoncino sulla mensola: il modello */
    function furgone() {
      var ps = MOD.truck(L, frame([5.275, 1.76, 8.475], 0), { hot: 'truck', label: "Vitalia's Pizza on Wheels truck. Open the project" });
      zz(ps[0], 10.6); zz(ps[1], 10.59);
    }

    /* le scatole delle pizze: una piatta, una appoggiata al muro con il marchio sul coperchio */
    function cartoni() {
      var p = part({ cls: 'box' }); zz(p, 10.65);
      var b = p.box([5.12, 1.76, 8.9, 5.5, 1.81, 9.28], ID, { hatch: { f: 0 } });
      p.line([[5.119, 1.79, 8.9], [5.119, 1.79, 9.28]], { cls: 'dt', on: b.l });
      var q = part({ cls: 'box' }); zz(q, 10.67);
      var k = .1, h = .4, z0 = 9.34, z1 = 9.74, xb = 5.47, th = .045;
      function P(a, b2, d) { return [xb + b2 * k + d, 1.76 + b2, a] }
      var ins = P((z0 + z1) / 2, h / 2, th / 2);
      var F = fc(q, [P(z0, 0, 0), P(z1, 0, 0), P(z1, h, 0), P(z0, h, 0)], ins, {});
      fc(q, [P(z0, 0, th), P(z1, 0, th), P(z1, h, th), P(z0, h, th)], ins, {});
      fc(q, [P(z0, 0, 0), P(z0, 0, th), P(z0, h, th), P(z0, h, 0)], ins, {});
      fc(q, [P(z1, 0, 0), P(z1, 0, th), P(z1, h, th), P(z1, h, 0)], ins, {});
      fc(q, [P(z0, h, 0), P(z1, h, 0), P(z1, h, th), P(z0, h, th)], ins, {});
      var zc = (z0 + z1) / 2;
      function C(a, b2) { return P(zc - a, b2, -.002) }
      function cr(a, b2, r, kk) { var pts = []; for (var i = 0; i < kk; i++) { var t = i / kk * 2 * PI; pts.push(C(a + r * Math.cos(t), b2 + r * Math.sin(t))) } return pts }
      q.line(cr(0, .23, .1, 22), { closed: true, on: F });
      q.line(cr(0, .23, .082, 22), { closed: true, cls: 'dt', on: F });
      for (var s = 0; s < 3; s++) { var a = s / 3 * PI + .5; q.line([C(.082 * Math.cos(a), .23 + .082 * Math.sin(a)), C(-.082 * Math.cos(a), .23 - .082 * Math.sin(a))], { cls: 'dt', on: F }) }
      var u = .011, x0 = -(5 * 3.2 - 1.2) * u / 2;
      scritta(q, 'PIZZA', function (gx, gy) { return C(x0 + gx * u, .055 + gy * u) }, { cls: 'px', on: F });
    }

    /* la tazza sul banco, il vapore, l'alone del caffe' */
    function tazza() {
      var p = part({ cls: 'mug' }); zz(p, 10.4);
      var T = frame([4.45, .92, 7.95], 0);
      var m = fusto(p, T, [0, 0], .045, .047, 0, .105, 14, { hatch: function (n) { return n[0] > .5 ? 2 : 0 } });
      p.line(anello(T, [0, .095, 0], .038, 'y', 14), { closed: true, cls: 'dt', on: m.t });
      var hx = .79, hz = -.61; function H(r, y) { return T([hx * r, y, hz * r]) }
      p.curve(H(.044, .09), H(.105, .08), H(.044, .025), { cls: 'stick' });
      [-.018, .004, .024].forEach(function (x, i) { var pts = [];
        for (var j = 0; j <= 14; j++) { var t = j / 14; pts.push(T([x + Math.sin(t * 7 + i * 2) * .016 * t, .12 + t * .3, 0])) }
        p.line(pts, { cls: 'steam s' + i }) });
      p.line(arco(ID, [4.6, .921, 8.25], .043, 'y', .4, 2 * PI - .3, 18), { cls: 'dt' });
    }

    /* la lampadina nuda, appesa al suo filo sopra il banco */
    function lampadina() {
      var p = part({ cls: 'bulbp' }); zz(p, 8.7);
      var x = 4.85, z = 8.3, y = 2.44;
      p.circle([x, y - .09, z], .26, 'z', { cls: 'halo', k: 24 }); p.circle([x, y - .088, z], .14, 'z', { cls: 'halo', k: 20 });
      p.line([[x, 3.3, z], [x, y + .08, z]], { cls: 'dt' });
      var T = frame([x, 0, z], 0);
      fusto(p, T, [0, 0], .022, .02, y, y + .08, 10, { bot: true, top: false });
      p.line([[x - .02, y, z], [x - .028, y - .04, z], [x + .028, y - .04, z], [x + .02, y, z]], { cls: 'dt' });
      p.circle([x, y - .085, z], .055, 'z', { cls: 'bulb', k: 22 });
      p.line([[x - .012, y - .04, z], [x - .012, y - .075, z], [x - .006, y - .09, z], [x, y - .075, z], [x + .006, y - .09, z], [x + .012, y - .075, z], [x + .012, y - .04, z]], { cls: 'ink fil' });
      p.line([[x - .05, y - .1, z], [4.3, .93, 7.8]], { cls: 'cn' }); p.line([[x + .05, y - .1, z], [5.3, .93, 8.9]], { cls: 'cn' });
    }

    /* ---------- la TV sulla cassa: si accende solo lei ---------- */
    function tv() {
      var T = frame([-2.2, 0, 4.45], -.12), hot = { hot: 'film', label: 'Old TV. Watch the film' };
      var k = part({ cls: 'crate' }); zz(k, 3.6);
      var cb = k.box([-.4, 0, -.28, .4, .48, .28], T, {});
      var zf = -.282, xr = .402;
      [.155, .165, .315, .325].forEach(function (y) { k.line([T([-.4, y, zf]), T([.4, y, zf])], { cls: 'dt', on: cb.f }); k.line([T([xr, y, -.28]), T([xr, y, .28])], { cls: 'dt', on: cb.r }) });
      [-.34, .34].forEach(function (x) { k.line([T([x, .01, zf]), T([x, .47, zf])], { cls: 'dt', on: cb.f }) });
      [-.24, -.14].forEach(function (x) { k.line([T([x, .04, zf]), T([x, .12, zf]), T([x - .025, .095, zf]), T([x, .12, zf]), T([x + .025, .095, zf])], { on: cb.f }) });
      k.line([T([.06, .21, zf]), T([.26, .21, zf]), T([.26, .27, zf]), T([.06, .27, zf])], { closed: true, cls: 'dt', on: cb.f });

      var t = part({ cls: 'tv', hot: hot.hot, label: hot.label }); zz(t, 3.5);
      var b = t.box([-.32, .48, -.24, .32, .98, .04], T, { hatch: { r: 3 } });
      /* la coda del tubo catodico, con la presa del cavo sul retro */
      var ins = T([0, .74, .15]), a0 = [T([-.28, .52, .04]), T([.28, .52, .04]), T([.28, .95, .04]), T([-.28, .95, .04])], a1 = [T([-.17, .6, .32]), T([.17, .6, .32]), T([.17, .88, .32]), T([-.17, .88, .32])];
      for (var i = 0; i < 4; i++) { var j = (i + 1) % 4, f = fc(t, [a0[i], a0[j], a1[j], a1[i]], ins, {}); if (i === 1) f.hatch = 4;
        if (i === 2) for (var v = 0; v < 4; v++) { var tv0 = .25 + v * .15; t.line([lerp3(lerp3(a0[2], a1[2], tv0), lerp3(a0[3], a1[3], tv0), .2), lerp3(lerp3(a0[2], a1[2], tv0), lerp3(a0[3], a1[3], tv0), .8)], { cls: 'dt', on: f }) } }
      var bf = fc(t, a1, ins, {});
      t.line([T([.04, .64, .321]), T([.1, .64, .321]), T([.1, .69, .321]), T([.04, .69, .321])], { closed: true, cls: 'dt', on: bf });
      /* il vetro bombato, la cornice, il riflesso, il play */
      var zs = -.2415; function Fz(x, y) { return T([x, y, zs]) }
      t.line(rr(-.06, .73, .215, .195, .065, 4).map(function (q) { return Fz(q[0], q[1]) }), { closed: true, cls: 'dt', on: b.f });
      t.line(rr(-.06, .73, .19, .17, .06, 4).map(function (q) { return Fz(q[0], q[1]) }), { closed: true, cls: 'crt', on: b.f });
      t.curve(Fz(-.225, .8), Fz(-.22, .875), Fz(-.15, .885), { cls: 'dt', on: b.f });
      t.line([Fz(-.095, .675), Fz(-.095, .785), Fz(.0, .73)], { closed: true, fill: 'or', cls: 'play', on: b.f });
      [.87, .77].forEach(function (y, n) { t.line(anello(T, [.235, y, zs], .034, 'z', 14), { closed: true, on: b.f });
        var a = n ? 2.2 : .9; t.line([Fz(.235, y), Fz(.235 + .03 * Math.cos(a), y + .03 * Math.sin(a))], { on: b.f }) });
      for (var g = 0; g < 4; g++) t.line([Fz(.19, .58 + g * .028), Fz(.285, .58 + g * .028)], { cls: 'dt', on: b.f });
      t.line([Fz(.27, .52), Fz(.285, .52), Fz(.285, .535), Fz(.27, .535)], { closed: true, cls: 'led o', on: b.f });
      /* le antenne a coniglio: due aste uguali, una pallina in cima a ognuna */
      t.line(arco(T, [0, .98, -.05], .055, 'z', 0, PI, 8), {});
      var e1 = T([-.36, 1.5, -.04]), e2 = T([.5, 1.36, -.04]);
      t.line([T([-.015, 1.02, -.05]), e1], {}); t.line([T([.015, 1.02, -.05]), e2], {});
      t.circle(e1, .014, 'z', { fill: 'wf', k: 10 }); t.circle(e2, .014, 'z', { fill: 'wf', k: 10 });
      /* il cavo: esce dal retro della TV, scende dietro la cassa e corre per terra fino al primo armadio */
      var cv = part({ cls: 'tv' }); zz(cv, 3.65);
      var s0 = T([.07, .665, .33]);
      cv.curve(s0, T([.12, .55, .5]), T([.16, .01, .44]), { cls: 'cable' });
      cv.curve(T([.16, .01, .44]), [-2.9, .01, 5.3], [-4.5, .01, 5.15], { cls: 'cable' });
      cv.box([-4.55, .02, 5.12, -4.49, .07, 5.2], ID, {});
    }

    /* ---------- il salottino: il tappeto, il divano, il tavolino ---------- */
    var TS = frame([-1.5, 0, 7.45], -.08);
    function tappeto() {
      var p = part({ cls: 'rug' }); zz(p, 4.18);
      var R = function (a, c2) { return TS([a, .004, c2]) };
      var f = p.face([R(-1.45, -1.95), R(-1.45, .55), R(1.45, .55), R(1.45, -1.95)], [0, 1, 0], {});
      p.line([R(-1.36, -1.86), R(-1.36, .46), R(1.36, .46), R(1.36, -1.86)], { closed: true, cls: 'dt', on: f });
      p.line([R(-1.3, -1.8), R(-1.3, .4), R(1.3, .4), R(1.3, -1.8)], { closed: true, cls: 'dt', on: f });
      /* il disegno: rombi in fila, anni '70 */
      for (var i = 0; i < 9; i++) { var a = -1.12 + i * .28; p.line([R(a - .12, -.7), R(a, -.45), R(a + .12, -.7), R(a, -.95)], { closed: true, cls: 'dt', on: f }) }
      p.line([R(-1.3, -1.25), R(1.3, -1.25)], { cls: 'dt', on: f }); p.line([R(-1.3, -.15), R(1.3, -.15)], { cls: 'dt', on: f });
      /* le frange davanti */
      for (var j = 0; j < 40; j++) { var x = -1.42 + j * 2.84 / 39; p.line([R(x, -1.95), R(x + .01, -2.03)], { cls: 'dt' }) }
    }
    function divano() {
      var T = TS;
      /* lo zoccolo con le gambe a matita */
      var b = part({ cls: 'sofa' }); zz(b, 4.07);
      var bx = b.box([-.97, .13, -.36, .97, .3, .38], T, { hatch: { f: 3 } });
      b.line([T([-.97, .2, -.362]), T([.97, .2, -.362])], { cls: 'dt', on: bx.f });
      [[-.88, -.28], [.88, -.28], [-.88, .3], [.88, .3]].forEach(function (q) { gamba(b, T([q[0], .13, q[1]]), T([q[0] * 1.04, 0, q[1] * 1.15]), .022, .012) });
      /* lo schienale, un poco inclinato */
      var k = part({ cls: 'sofa' }); zz(k, 4.15);
      k.prism([[.16, .28], [.42, .28], [.45, .74], [.42, .8], [.3, .82], [.2, .77]], -1.05, 1.05, T, { hatchSide: function (i) { return i === 1 ? 4 : 0 } });
      /* i cuscini dello schienale con i bottoni, da sinistra */
      [[-.94, -.33], [-.31, .31], [.33, .94]].forEach(function (q, n) {
        var c = part({ cls: 'sofa' }); zz(c, 4.12 - n * .01);
        var prf = rot(rr(.2, .55, .065, .21, .06, 3), -.12, [.2, .55]);
        var pc = c.prism(prf, q[0], q[1], T, {});
        var xm = (q[0] + q[1]) / 2;
        [-.15, .15].forEach(function (dx) { c.circle(T([xm + dx, .58, .118]), .012, 'z', { k: 8 }); c.line([T([xm + dx - .05, .63, .127]), T([xm + dx, .585, .118]), T([xm + dx + .05, .63, .127])], { cls: 'dt' }) });
        c.line([T([xm, .38, .122]), T([xm, .72, .14])], { cls: 'dt' });
      });
      /* il bracciolo di sinistra (si vede di dentro), poi i cuscini della seduta, poi il bracciolo di destra */
      function bracciolo(x0, x1, z) {
        var a = part({ cls: 'sofa' }); zz(a, z);
        var pr = [[-.4, .13]].concat([[.42, .13], [.42, .56]]).concat(arcoP(.36, .56, .06, 0, PI / 2, 3)).concat(arcoP(-.32, .52, .1, PI / 2, PI, 5));
        a.prism(pr, x0, x1, T, { hatchCap: x0 > 0 ? 0 : 3 });
        var xm = x0 > 0 ? x1 + .002 : x1 + .002;
        a.line([T([xm, .2, -.34]), T([xm, .2, .38])], { cls: 'dt' });
        return a }
      function arcoP(cu, cv, r, a0, a1, kk) { var o = []; for (var i = 0; i <= kk; i++) { var t = a0 + (a1 - a0) * i / kk; o.push([cu + r * Math.cos(t), cv + r * Math.sin(t)]) } return o }
      bracciolo(-1.08, -.92, 4.11);
      [[-.92, -.32], [-.31, .31], [.32, .92]].forEach(function (q, n) {
        var c = part({ cls: 'sofa' }); zz(c, 4.06 - n * .01);
        var pc = c.prism(rr(-.09, .37, .3, .075, .05, 1), q[0], q[1], T, {});
        var xm = (q[0] + q[1]) / 2;
        c.line([T([q[0] + .06, .447, -.3]), T([xm, .44, -.31]), T([q[1] - .06, .447, -.3])], { cls: 'dt' });
      });
      bracciolo(.92, 1.08, 4.02);
      /* un cuscino buttato nell'angolo, storto */
      var cu = part({ cls: 'sofa' }); zz(cu, 4.015);
      var Mc = piano(T, [.66, .6, .06], unit([.85, .12, .45]), unit([-.12, .95, .25])), sq = [];
      [[-1, -1, 1, 0], [1, -1, 0, 1], [1, 1, -1, 0], [-1, 1, 0, -1]].forEach(function (e) { for (var i = 0; i < 6; i++) { var t = i / 6, a = e[0] * .15 + e[2] * .3 * t, b = e[1] * .15 + e[3] * .3 * t, g = .022 * Math.sin(t * PI);
        sq.push([a - e[3] * g, b + e[2] * g]) } });
      fc(cu, su(Mc, sq), T([.66, .6, .3]), {});
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) { cu.line(su(Mc, [[q[0] * .13, q[1] * .13], [q[0] * .08, q[1] * .07]]), { cls: 'dt' }) });
      cu.line(su(Mc, cer(0, 0, .012, 8)), { closed: true });
    }
    function tavolino() {
      var T = frame(TS([0, 0, -1.3]), -.08);
      var p = part({ cls: 'ctable' }); zz(p, 3.95);
      var top = p.box([-.7, .38, -.33, .7, .42, .33], T, { hatch: { f: 0 } });
      p.line([T([-.7, .4, -.332]), T([-.2, .4, -.332]), T([.1, .398, -.332]), T([.7, .4, -.332])], { cls: 'dt', on: top.f });
      [[-.6, -.25], [.6, -.25], [-.6, .25], [.6, .25]].forEach(function (q) { gamba(p, T([q[0], .38, q[1]]), T([q[0] * 1.08, 0, q[1] * 1.25]), .022, .013) });
      /* il ripiano sotto, con le riviste */
      var sh = p.box([-.62, .12, -.26, .62, .14, .26], T, {});
      var r = part({ cls: 'ctable' }); zz(r, 3.94);
      r.box([-.5, .14, -.18, -.12, .17, .14], frame(T([0, 0, 0]), .05), {});
      r.box([-.48, .17, -.16, -.16, .185, .12], frame(T([0, 0, 0]), -.08), {});
      r.box([.1, .14, -.15, .45, .21, .15], T, {});
      for (var i = 1; i < 6; i++) r.line([T([.1, .14 + i * .0117, -.151]), T([.45, .14 + i * .0117, -.151])], { cls: 'dt' });
      return T;
    }
    /* sul tavolino: la rivista, il menu, la tazzina, il telefono */
    function sulTavolino(T) {
      var q = part({ cls: 'ctable' }); zz(q, 3.92);
      var Tr = frame(T([-.05, .42, .08]), .35);
      var rb = q.box([-.15, 0, -.11, .15, .008, .11], Tr, {});
      q.line([Tr([-.13, .009, .09]), Tr([.13, .009, .09]), Tr([.13, .009, -.09]), Tr([-.13, .009, -.09])], { closed: true, cls: 'dt', on: rb.t });
      q.line([Tr([-.1, .009, .05]), Tr([.05, .009, .05])], { on: rb.t });
      q.circle(Tr([.04, .009, -.03]), .05, 'y', { cls: 'dt', on: rb.t, k: 18 });
      var ms = MOD.menu(L, frame(T([-.42, .42, -.08]), -.25), { hot: 'ristorante', label: "Vitalia's Restaurant menu. Have a look" });
      zz(ms[0], 3.9);
      var ph = MOD.phone(L, frame(T([.36, .42, -.02]), -.3), { hot: 'phone', label: 'Telephone. Start a conversation' });
      zz(ph[0], 3.88); zz(ph[1], 3.885);
      /* la tazzina con il piattino */
      var c = part({ cls: 'mug' }); zz(c, 3.87);
      var Tc = frame(T([.05, .42, -.17]), 0);
      var pt = fusto(c, Tc, [0, 0], .05, .062, 0, .008, 16, {});
      var m = fusto(c, Tc, [0, 0], .026, .036, .008, .062, 14, { hatch: function (n) { return n[0] > .5 ? 2 : 0 } });
      c.line(anello(Tc, [0, .056, 0], .03, 'y', 14), { closed: true, cls: 'dt', on: m.t });
      c.curve(Tc([.034, .05, -.01]), Tc([.06, .045, -.02]), Tc([.03, .02, -.01]), { cls: 'stick' });
      c.line([Tc([.06, .009, .03]), Tc([.075, .012, .06])], { cls: 'dt' });
    }

    /* ---------- la macchina del caffe' accanto all'ascensore ---------- */
    function caffe() {
      var p = part({ cls: 'vend' });
      var T = frame([-.85, 0, 11.07], 0), zf = -.352;
      var b = p.box([-.42, 0, -.35, .42, 1.86, .35], T, { hatch: { l: 6 } });
      var f = b.f; function F(x, y) { return T([x, y, zf]) }
      function rq(x0, y0, x1, y1, o) { o.on = f; o.closed = true; return p.line([F(x0, y0), F(x1, y0), F(x1, y1), F(x0, y1)], o) }
      /* il cappello e lo zoccolo */
      p.box([-.44, 1.86, -.37, .44, 1.92, .36], T, {});
      rq(-.38, .08, .38, .2, { cls: 'dt' });
      for (var g = 0; g < 5; g++) p.line([F(-.3 + g * .15, .11), F(-.24 + g * .15, .17)], { cls: 'dt', on: f });
      /* l'insegna accesa: COFFEE */
      rq(-.37, 1.56, .37, 1.8, { cls: 'vlit' });
      var u = .022, x0 = -(6 * 3.2 - 1.2) * u / 2;
      scritta(p, 'COFFEE', function (gx, gy) { return F(x0 + gx * u, 1.63 + gy * u) }, { cls: 'px', on: f });
      /* la vetrina con la tazza disegnata e il vapore */
      rq(-.36, .78, .14, 1.48, {});
      p.line(su(F, rr(-.11, 1.0, .1, .08, .03, 3).filter(function (q) { return q[1] > .97 }).concat([[-.21, 1.0], [-.01, 1.0]])), { cls: 'dt', on: f });
      p.line([F(-.2, 1.0), F(-.19, .9), F(-.03, .9), F(-.02, 1.0)], { on: f });
      p.line(su(F, [[-.02, .98], [.03, .975], [.035, .94], [-.025, .925]]), { on: f });
      p.line([F(-.24, .88), F(.02, .88)], { on: f });
      [-.15, -.11, -.07].forEach(function (x, i) { p.line(su(F, bz([x, 1.05], [x + .04, 1.15 + i * .02], [x - .01, 1.28 + i * .03], 8)), { cls: 'dt', on: f }) });
      p.line([F(.06, 1.44), F(.12, 1.32)], { cls: 'dt', on: f }); p.line([F(.08, 1.44), F(.13, 1.36)], { cls: 'dt', on: f });
      /* la colonna dei bottoni, il display, la gettoniera con la spia */
      rq(.19, 1.38, .37, 1.47, { cls: 'dt' });
      p.line([F(.21, 1.42), F(.27, 1.42)], { cls: 'dt', on: f });
      for (var i = 0; i < 6; i++) { var y = 1.3 - i * .075; rq(.19, y, .23, y + .045, {}); p.line([F(.25, y + .022), F(.35, y + .022)], { cls: 'dt', on: f }) }
      rq(.25, .8, .27, .88, { fill: 'kf' });
      rq(.3, .82, .32, .84, { cls: 'led o' });
      rq(.19, .76, .37, .9, { cls: 'dt' });
      /* la nicchia del bicchiere, con un bicchiere dimenticato */
      rq(-.15, .3, .15, .64, {});
      p.line([F(-.15, .3), F(-.11, .34), F(.11, .34), F(.15, .3)], { cls: 'dt', on: f });
      p.line([F(-.11, .34), F(-.11, .6), F(.11, .6), F(.11, .34)], { cls: 'dt', on: f });
      p.line([F(-.03, .34), F(-.035, .44), F(.035, .44), F(.03, .34)], { closed: true, fill: 'wf', on: f });
      for (var k = 0; k < 5; k++) p.line([F(-.1 + k * .05, .32), F(-.08 + k * .05, .32)], { cls: 'dt', on: f });
      /* il biglietto attaccato: NO DECAF, scritto in fretta */
      var nM = function (a, bb) { var q = rot([[a, bb]], .08)[0]; return F(.22 + q[0], .52 + q[1]) };
      p.line(su(nM, [[-.06, -.05], [.06, -.05], [.06, .05], [-.06, .05]]), { closed: true, fill: 'pf', on: f });
      p.line(su(nM, grafia(-.045, .04, .01, .025, 2)), { cls: 'ink', on: f });
      p.line(su(nM, grafia(-.045, .045, -.03, .025, 3)), { cls: 'ink', on: f });
      /* sopra: la pila di bicchierini */
      fusto(p, frame(T([.25, 1.92, 0]), 0), [0, 0], .035, .042, 0, .16, 10, {});
      /* il cavo nel muro */
      p.curve(T([.3, .1, .35]), T([.5, .02, .4]), T([.6, .25, .42]), { cls: 'cable' });
    }

    /* ---------- i manifesti ---------- */
    /* il calendario sul muro di fondo: la macchina del mese, una robot pin-up anni '50 */
    function calendario() {
      var p = part({ cls: 'poster' });
      var zc = Z1 - .012, X0 = -4.3, Y0 = 1.08;
      var M = function (a, b) { return [X0 + a, Y0 + b, zc] }, N = function (a, b) { return [X0 + a, Y0 + b, zc - .002] };
      /* il foglio: l'angolo in basso strappato, quello in alto piegato */
      var sag = [[0, 0], [.7, 0], [.74, .035], [.73, .07], [.79, .1], [.8, .14], [.86, .17], [.88, .22], [.94, .25], [.98, .3], [.98, 1.3], [.88, 1.4], [0, 1.4]];
      var f = p.face(su(M, sag).reverse(), [0, 0, -1], { cls: 'pap' });
      p.line(su(N, [[.88, 1.4], [.98, 1.3], [.885, 1.31]]), { closed: true, fill: 'kf', on: f });
      /* lo scotch: due pezzi, e quello rimasto sul muro dove l'angolo e' caduto */
      scotch(p, N, .02, 1.37, .6, f); scotch(p, N, .03, .03, -.5, f);
      p.line(su(function (a, b) { return [X0 + a, Y0 + b, zc + .001] }, rot([[-.04, -.014], [.04, -.014], [.04, .014], [-.04, .014]], -.6).map(function (q) { return [q[0] + 1.0, q[1] + 1.41] })), { closed: true, cls: 'tape' });
      /* il titolo */
      p.text(N(.49, 1.29), 'MACHINE OF THE MONTH', .044, { cls: 'ptx', anchor: 'middle', on: f });
      /* il quadro: il sole a raggi dietro, la ruota dentata su cui siede */
      var pa = [.07, .42, .91, 1.24];
      p.line(su(N, [[pa[0], pa[1]], [pa[2], pa[1]], [pa[2], pa[3]], [pa[0], pa[3]]]), { closed: true, on: f });
      var cx = .49, cy = .8;
      for (var i = 0; i < 20; i++) { var a = i / 20 * 2 * PI + .08, dx = Math.cos(a), dy = Math.sin(a);
        var t = Math.min(dx > 0 ? (pa[2] - .01 - cx) / dx : dx < 0 ? (pa[0] + .01 - cx) / dx : 9, dy > 0 ? (pa[3] - .01 - cy) / dy : dy < 0 ? (pa[1] + .01 - cy) / dy : 9);
        p.line([N(cx + dx * .3, cy + dy * .3), N(cx + dx * t, cy + dy * t)], { cls: 'dt', on: f }) }
      /* la robot e la sua ruota, un po' piu' grandi del quadro */
      var N0 = N; N = function (a, b) { return N0(.49 + (a - .49) * 1.22, .44 + (b - .44) * 1.22) };
      var gc = [.47, .55], gear = [];
      for (var j = 0; j < 40; j++) { var ga = j / 40 * 2 * PI, rg = (j % 4 < 2) ? .1 : .082; gear.push([gc[0] + rg * Math.cos(ga), gc[1] + rg * Math.sin(ga)]) }
      p.line(su(N, gear), { closed: true, fill: 'kf', on: f });
      p.line(su(N, cer(gc[0], gc[1], .03, 14)), { closed: true, on: f });
      /* la robot: le gambe accavallate, il busto a clessidra, le braccia, la testa a cupola con le ciglia */
      function arto(pts, w0, w1) { p.line(su(N, striscia(pts, function (t) { return w0 + (w1 - w0) * t })), { closed: true, fill: 'kf', on: f }) }
      function anelli(a, b, n, w) { for (var k = 1; k <= n; k++) { var q = [a[0] + (b[0] - a[0]) * k / (n + 1), a[1] + (b[1] - a[1]) * k / (n + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
        p.line([N(q[0] - dy / l * w, q[1] + dx / l * w), N(q[0] + dy / l * w, q[1] - dx / l * w)], { cls: 'dt', on: f }) } }
      arto([[.47, .66], [.64, .645]], .05, .034); arto([[.64, .645], [.66, .47]], .03, .02);
      p.line(su(N, [[.645, .475], [.7, .45], [.712, .462], [.665, .49]]), { closed: true, fill: 'kf', on: f });
      p.line([N(.655, .47), N(.652, .44)], { on: f });
      anelli([.64, .645], [.66, .47], 3, .015);
      /* il busto */
      var L1 = [], R1 = [];
      for (var s = 0; s <= 16; s++) { var tt = s / 16, yb = .655 + tt * .21, w = tt < .42 ? .042 + .043 * Math.pow((.42 - tt) / .42, 1.6) : .042 + .034 * Math.sin(Math.min(1, (tt - .42) / .4) * PI / 2), sw = .012 * Math.sin(tt * PI);
        L1.push([cx - w + sw, yb]); R1.unshift([cx + w + sw, yb]) }
      var bot = []; for (var s2 = 1; s2 < 8; s2++) { var ab = PI + s2 / 8 * PI; bot.push([cx + .085 * Math.cos(ab), .655 + .03 * Math.sin(ab)]) }
      p.line(su(N, L1.concat(R1).concat(bot.slice().reverse())), { closed: true, fill: 'kf', on: f });
      p.line([N(cx - .044, .74), N(cx + .046, .74)], { cls: 'dt', on: f });
      [-.03, 0, .03].forEach(function (x) { p.circle(N(cx + x + .004, .728), .004, 'z', { on: f, cls: 'dt', k: 6 }) });
      p.line(su(N, cer(cx + .008, .815, .018, 14)), { closed: true, on: f });
      p.line([N(cx + .008, .815), N(cx + .02, .826)], { cls: 'dt', on: f });
      /* la gamba accavallata davanti */
      arto([[.5, .672], [.665, .7]], .05, .034); arto([[.665, .7], [.6, .535]], .03, .019);
      p.line(su(N, [[.592, .54], [.625, .5], [.64, .508], [.612, .55]]), { closed: true, fill: 'kf', on: f });
      p.line([N(.6, .535), N(.588, .507)], { on: f });
      anelli([.665, .7], [.6, .535], 3, .015);
      p.circle(N(.665, .7), .017, 'z', { on: f, fill: 'kf', k: 12 });
      /* le braccia: una sul fianco, una dietro la testa */
      arto([[cx + .07, .855], [.62, .95], [.555, 1.0]], .024, .02); anelli([cx + .07, .855], [.62, .95], 3, .012);
      arto([[cx - .065, .855], [.37, .77], [.425, .72]], .024, .02); anelli([cx - .065, .855], [.37, .77], 3, .012);
      p.circle(N(.43, .715), .013, 'z', { on: f, fill: 'kf', k: 10 });
      /* il collo a soffietto, la testa */
      p.line(su(N, [[cx - .013, .86], [cx + .02, .86], [cx + .018, .89], [cx - .011, .89]]), { closed: true, fill: 'kf', on: f });
      p.line([N(cx - .012, .875), N(cx + .019, .875)], { cls: 'dt', on: f });
      var hd = [[cx - .055, .89], [cx + .065, .89], [cx + .065, .94]]; for (var h = 0; h <= 10; h++) { var ah = h / 10 * PI; hd.push([cx + .005 + .06 * Math.cos(ah), .94 + .05 * Math.sin(ah)]) }
      p.line(su(N, hd), { closed: true, fill: 'kf', on: f });
      p.line(su(N, rr(cx + .005, .935, .042, .013, .012, 2)), { closed: true, on: f });
      [-.018, .028].forEach(function (x) { p.circle(N(cx + x, .935), .006, 'z', { on: f, fill: 'wf', k: 8 });
        [-1, 0, 1].forEach(function (k) { p.line([N(cx + x + k * .005, .943), N(cx + x + k * .009, .953)], { cls: 'dt', on: f }) }) });
      p.line(su(N, [[cx - .005, .905], [cx + .005, .911], [cx + .015, .905], [cx + .005, .9]]), { closed: true, fill: 'wf', on: f });
      [-.062, .072].forEach(function (x) { p.circle(N(cx + x, .925), .009, 'z', { on: f, fill: 'kf', k: 8 }) });
      p.line([N(cx + .005, .99), N(cx + .03, 1.05)], { on: f });
      /* il cromo: due colpi di luce sul busto e sulla cupola */
      p.line(su(N, bz([cx - .03, .7], [cx - .045, .76], [cx - .03, .84], 6)), { cls: 'dt', on: f });
      p.line(su(N, bz([cx - .03, .965], [cx - .01, .985], [cx + .02, .984], 5)), { cls: 'dt', on: f });
      p.circle(N(cx + .032, 1.058), .011, 'z', { on: f, cls: 'abulb', k: 10 });
      N = N0;
      /* OCTOBER e la griglia dei giorni, uno cerchiato */
      p.text(N(.49, .33), 'OCTOBER', .06, { cls: 'ptx', anchor: 'middle', on: f });
      for (var r = 0; r <= 4; r++) p.line([N(.1, .08 + r * .045), N(.7, .08 + r * .045)], { cls: 'dt', on: f });
      for (var cc = 0; cc <= 7; cc++) p.line([N(.1 + cc * .0857, .08), N(.1 + cc * .0857, .26)], { cls: 'dt', on: f });
      p.line(su(N, cer(.1 + 5.5 * .0857, .08 + .5 * .045, .028, 14, .022)), { closed: true, on: f });
    }

    /* il manifesto del concerto sulla parete di destra, dopo il banco: DEAD PIXELS, dal vivo in cantina */
    function concerto() {
      var p = part({ cls: 'poster' }); zz(p, 10.9);
      var xw = L.X - .015, zc = 10.75, Y0 = 1.2;
      /* chi guarda la parete di destra legge verso -z */
      var M = function (a, b) { return [xw, Y0 + b, zc - a] }, N = function (a, b) { return [xw - .002, Y0 + b, zc - a] };
      var f = p.face(su(M, [[-.4, 0], [.4, 0], [.4, .98], [-.4, .98]]), [-1, 0, 0], { cls: 'pap' });
      var U = [0, 0, -1], V = [0, 1, 0];
      p.line(su(N, [[-.36, .04], [.36, .04], [.36, .94], [-.36, .94]]), { closed: true, cls: 'dt', on: f });
      p.text(N(0, .79), 'DEAD', .14, { u: U, v: V, cls: 'ptx gig', anchor: 'middle', on: f });
      p.text(N(0, .63), 'PIXELS', .12, { u: U, v: V, cls: 'ptx gig', anchor: 'middle', on: f });
      /* il fulmine che spacca le lettere */
      p.line(su(N, [[.05, .9], [-.04, .74], [.03, .73], [-.07, .55], [.06, .7], [-.01, .71], [.09, .9]]), { closed: true, fill: 'wf', on: f });
      /* il teschio a pixel; un pixel e' morto davvero, e sfarfalla */
      var sk = ['.XXXXX.', 'XXXXXXX', 'X..X..X', 'XXXXXXX', '.XX.XX.', '.XXXXX.', '.X.X.X.'], px = .032;
      sk.forEach(function (row, ry) { row.split('').forEach(function (ch, rx) { var a = -3.5 * px + rx * px, b = .52 - ry * px;
        if (ch === 'X') p.line(su(N, [[a + .002, b - px + .002], [a + px - .002, b - px + .002], [a + px - .002, b - .002], [a + .002, b - .002]]), { closed: true, fill: 'wf', on: f });
        else if (ry === 2 && rx === 4) p.line(su(N, [[a + .004, b - px + .004], [a + px - .004, b - px + .004], [a + px - .004, b - .004], [a + .004, b - .004]]), { closed: true, cls: 'dpx', on: f }) }) });
      p.text(N(0, .2), 'LIVE IN THE BASEMENT', .038, { u: U, v: V, cls: 'ptx', anchor: 'middle', on: f });
      p.text(N(0, .12), 'FRI 13 · LG · LATE', .03, { u: U, v: V, cls: 'lab', anchor: 'middle', on: f });
      scotch(p, N, -.37, .95, .5, f); scotch(p, N, .37, .95, -.5, f); scotch(p, N, .36, .03, .4, f);
    }

    /* ---------- le piccole cose ---------- */
    /* l'estintore, sul muro di fondo accanto all'ultimo server */
    function estintore() {
      var p = part({ cls: 'ext' });
      var xc = -4.15, zc = 11.4, T = frame([xc, 0, zc], 0);
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
    banco(); cassetta(); tavola(); pannello(); schizzo(); mensola(); furgone(); cartoni(); tazza(); lampadina();
    tv(); tappeto(); divano(); sulTavolino(tavolino()); caffe();
    calendario(); concerto(); estintore(); biglietto();
  };
})();
