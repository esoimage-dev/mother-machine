/* Mother Machine · LG · RUSH HOUR, il gioco del cabinato.
   Il palazzo in sezione: sette piani, una cabina. Ai piani arrivano gli ordini, ognuno vuole andare a un altro piano.
   Porti la cabina su e giu' (frecce o W/S): quando si ferma a un piano consegna e carica da sola. Un ordine che aspetta
   troppo se ne va e costa una vita. 75 secondi, tre vite, il record resta nel tuo browser.
   Tutto disegnato a pixel in un canvas piccolo (256 x 224), ingrandito; i suoni sono sintetizzati (WebAudio), niente file.
   window.RUSH.open(x, y) apre il cabinato partendo da quel punto dello schermo (lo chiama la stanza). */
(function () {
  var W = 256, H = 224, FL = ['05', '04', '03', '02', '01', 'G', 'LG'], N = FL.length;
  var NAMES = ['HOME', 'WORK', 'BRAND', 'SYSTEMS', 'STUDIO', 'CONTACT', 'LAB'];
  var C = { bg: '#0b0b0a', ink: '#F4F2EC', dim: '#4a4844', or: '#FF5B3A', cy: '#4FE3D8', pk: '#FF6FB5', yl: '#FFC23D' };
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- il carattere a pixel: 3 x 5, una riga per stringa ---------- */
  var G = {
    'A': ['111', '101', '111', '101', '101'], 'B': ['110', '101', '110', '101', '110'], 'C': ['111', '100', '100', '100', '111'], 'D': ['110', '101', '101', '101', '110'],
    'E': ['111', '100', '110', '100', '111'], 'F': ['111', '100', '110', '100', '100'], 'G': ['111', '100', '101', '101', '111'], 'H': ['101', '101', '111', '101', '101'],
    'I': ['111', '010', '010', '010', '111'], 'J': ['001', '001', '001', '101', '111'], 'K': ['101', '101', '110', '101', '101'], 'L': ['100', '100', '100', '100', '111'],
    'M': ['101', '111', '111', '101', '101'], 'N': ['110', '101', '101', '101', '101'], 'O': ['111', '101', '101', '101', '111'], 'P': ['111', '101', '111', '100', '100'],
    'Q': ['111', '101', '101', '111', '001'], 'R': ['110', '101', '110', '101', '101'], 'S': ['111', '100', '111', '001', '111'], 'T': ['111', '010', '010', '010', '010'],
    'U': ['101', '101', '101', '101', '111'], 'V': ['101', '101', '101', '101', '010'], 'W': ['101', '101', '111', '111', '101'], 'X': ['101', '101', '010', '101', '101'],
    'Y': ['101', '101', '010', '010', '010'], 'Z': ['111', '001', '010', '100', '111'],
    '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'], '2': ['111', '001', '111', '100', '111'], '3': ['111', '001', '111', '001', '111'],
    '4': ['101', '101', '111', '001', '001'], '5': ['111', '100', '111', '001', '111'], '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'],
    '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111'],
    ' ': ['000', '000', '000', '000', '000'], '.': ['000', '000', '000', '000', '010'], ':': ['000', '010', '000', '010', '000'], '-': ['000', '000', '111', '000', '000'],
    '!': ['010', '010', '010', '000', '010'], '?': ['111', '001', '011', '000', '010'], '>': ['100', '010', '001', '010', '100'], '<': ['001', '010', '100', '010', '001'],
    '+': ['000', '010', '111', '010', '000'], 'x': ['000', '101', '010', '101', '000'], "'": ['010', '010', '000', '000', '000'], ',': ['000', '000', '000', '010', '100'],
    '^': ['010', '111', '101', '000', '000'], 'v': ['000', '000', '101', '111', '010'], '*': ['101', '010', '101', '000', '000']
  };
  function txt(x, y, s, col, sc, al) {
    sc = sc || 1; s = String(s).toUpperCase(); var w = s.length * 4 * sc - sc;
    if (al === 'c') x -= w / 2 | 0; else if (al === 'r') x -= w;
    g.fillStyle = col;
    for (var i = 0; i < s.length; i++) { var gl = G[s[i]] || G['?'];
      for (var r = 0; r < 5; r++) for (var c = 0; c < 3; c++) if (gl[r][c] === '1') g.fillRect(x + (i * 4 + c) * sc, y + r * sc, sc, sc) }
    return w;
  }

  /* ---------- i piccoli disegni: 7 x 7 ---------- */
  var SPR = {
    box: ['0000000', '0111110', '0100010', '0111110', '0100010', '0111110', '0000000'],
    pizza: ['1111111', '0100010', '0011010', '0010100', '0001100', '0001000', '0000000'],
    mail: ['0000000', '1111111', '1100011', '1010101', '1001001', '1111111', '0000000'],
    star: ['0001000', '0001000', '1111111', '0111110', '0011100', '0110110', '0100010'],
    heart: ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000', '0000000']
  };
  var KINDS = ['box', 'pizza', 'mail', 'star'], KC = [C.yl, C.or, C.cy, C.pk];
  function spr(x, y, k, col) { var s = SPR[k]; g.fillStyle = col; for (var r = 0; r < 7; r++) for (var c = 0; c < 7; c++) if (s[r][c] === '1') g.fillRect(x + c, y + r, 1, 1) }

  /* ---------- i suoni: piccoli sintetizzatori ---------- */
  var AC = null, mute = false;
  function ac() { if (!AC) try { AC = new (window.AudioContext || window.webkitAudioContext)() } catch (e) { AC = null } if (AC && AC.state === 'suspended') AC.resume(); return AC }
  function tone(f, d, type, vol, at, slide) {
    var a = ac(); if (!a || mute) return; var t = a.currentTime + (at || 0), o = a.createOscillator(), v = a.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    v.gain.setValueAtTime(vol || .06, t); v.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(v); v.connect(a.destination); o.start(t); o.stop(t + d + .02);
  }
  var SFX = {
    coin: function () { tone(988, .08, 'square', .07); tone(1319, .35, 'square', .07, .08) },
    start: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, .12, 'square', .06, i * .09) }) },
    move: function () { tone(220, .05, 'triangle', .05, 0, 260) },
    ding: function () { tone(1568, .25, 'sine', .07); tone(2093, .3, 'sine', .04, .05) },
    drop: function (n) { for (var i = 0; i < n; i++) tone(784 * Math.pow(1.26, i), .1, 'square', .06, i * .07) },
    pick: function () { tone(440, .06, 'square', .05); tone(660, .08, 'square', .05, .05) },
    miss: function () { tone(140, .35, 'sawtooth', .07, 0, 70) },
    over: function () { [523, 415, 349, 262].forEach(function (f, i) { tone(f, .22, 'square', .06, i * .2) }) }
  };

  /* ---------- il gioco ---------- */
  var g, cv, S = null, hi = 0, raf = 0, last = 0, keys = {}, mode = 'attract', T0 = 0, shake = 0, floats = [];
  try { hi = +localStorage.getItem('mm-rush-hi') || 0 } catch (e) {}
  var TOP = 30, FH = 26, SX = 114, SW = 28, CAP = 4, ROUND = 75;
  function fy(i) { return TOP + i * FH }
  function reset() {
    S = { pos: 5, at: 5, tgt: 5, load: [], wait: FL.map(function () { return [] }), score: 0, lives: 3, t: ROUND, spawn: 1.2, made: 0, combo: 0, stopT: 0 };
    floats = [];
  }
  function add() {
    var from = Math.random() * N | 0, to; do { to = Math.random() * N | 0 } while (to === from);
    if (S.wait[from].length >= 4) return;
    var k = Math.random() * KINDS.length | 0, pat = Math.max(7, 13 - S.made * .12);
    S.wait[from].push({ to: to, k: KINDS[k], c: KC[k], t: pat, max: pat }); S.made++;
  }
  function pop(x, y, s, col) { floats.push({ x: x, y: y, s: s, c: col, t: 1.1 }) }
  function arrive() {
    var i = S.at, got = S.load.filter(function (o) { return o.to === i });
    if (got.length) { S.load = S.load.filter(function (o) { return o.to !== i }); S.combo = got.length;
      var pts = got.reduce(function (a, o) { return a + 100 + Math.round(o.t / o.max * 50) }, 0) * got.length;
      S.score += pts; pop(SX + SW / 2, fy(i) + 4, '+' + pts, got.length > 1 ? C.yl : C.cy); SFX.drop(got.length) }
    var q = S.wait[i], took = 0;
    while (q.length && S.load.length < CAP) { S.load.push(q.shift()); took++ }
    if (took) SFX.pick(); else if (!got.length) SFX.ding();
  }
  function step(dt) {
    if (mode !== 'play') return;
    S.t -= dt; if (S.t <= 0) { S.t = 0; end(); return }
    /* la cabina va verso il piano scelto, a velocita' costante */
    var d = S.tgt - S.pos, sp = 9 * dt;
    if (Math.abs(d) <= sp) { if (S.pos !== S.tgt) { S.pos = S.tgt; S.at = S.tgt; arrive() } else if (S.wait[S.at].length && S.load.length < CAP) arrive() } else S.pos += Math.sign(d) * sp;
    /* gli ordini arrivano sempre piu' fitti */
    S.spawn -= dt; if (S.spawn <= 0) { add(); S.spawn = Math.max(.8, 2.4 - (ROUND - S.t) * .022) }
    S.wait.forEach(function (q, i) { for (var j = q.length - 1; j >= 0; j--) { if (mode !== 'play') return; q[j].t -= dt; if (q[j].t <= 0) { q.splice(j, 1); S.lives--; shake = .35; SFX.miss(); pop(SX + 60, fy(i) + 4, 'LOST', C.or); if (S.lives <= 0) { end(); return } } } });
    floats.forEach(function (f) { f.t -= dt; f.y -= dt * 14 }); floats = floats.filter(function (f) { return f.t > 0 });
  }
  function end() { mode = 'over'; T0 = performance.now(); SFX.over(); if (S.score > hi) { hi = S.score; try { localStorage.setItem('mm-rush-hi', hi) } catch (e) {} } }
  function move(dir) {
    if (mode !== 'play') return;
    var n = Math.max(0, Math.min(N - 1, S.tgt + dir)); if (n !== S.tgt) { S.tgt = n; SFX.move() }
  }
  function coin() {
    if (mode === 'attract' || mode === 'over') { SFX.coin(); mode = 'ready'; T0 = performance.now(); reset(); setTimeout(function () { if (mode === 'ready') { mode = 'play'; SFX.start(); add(); add() } }, 1100) }
  }

  /* ---------- il disegno dello schermo ---------- */
  function draw(now) {
    var t = now / 1000;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    if (shake > 0) { g.setTransform(1, 0, 0, 1, (Math.random() - .5) * 4, (Math.random() - .5) * 3); shake -= 1 / 60 }
    if (mode === 'attract') return attract(t);
    if (!S) reset();
    /* in alto: punti, tempo, vite */
    txt(8, 8, 'SCORE', C.dim); txt(8, 16, ('00000' + S.score).slice(-6), C.ink);
    txt(W / 2, 8, 'TIME', C.dim, 1, 'c'); txt(W / 2, 16, Math.ceil(S.t), S.t < 10 && (t * 4 | 0) % 2 ? C.or : C.ink, 1, 'c');
    txt(W - 8, 8, 'HI ' + hi, C.dim, 1, 'r');
    for (var l = 0; l < 3; l++) spr(W - 30 + l * 8, 15, 'heart', l < S.lives ? C.or : '#2a2826');
    /* il palazzo: i piani, la tromba dell'ascensore */
    for (var i = 0; i < N; i++) { var y = fy(i);
      g.fillStyle = i === 6 ? '#16110f' : '#121211'; g.fillRect(20, y, W - 40, FH - 2);
      g.fillStyle = '#2a2826'; g.fillRect(20, y + FH - 2, W - 40, 1);
      txt(26, y + 10, FL[i], Math.round(S.pos) === i ? C.ink : C.dim);
      txt(42, y + 10, NAMES[i], '#34322e');
      if (i === 6) { g.fillStyle = C.or; g.fillRect(20, y, 2, FH - 2) }
    }
    g.fillStyle = '#1d1c1a'; g.fillRect(SX - 2, TOP - 2, SW + 4, N * FH + 2);
    g.fillStyle = '#0b0b0a'; g.fillRect(SX, TOP, SW, N * FH - 2);
    /* il cavo e la cabina */
    var cy = TOP + S.pos * FH;
    g.fillStyle = C.dim; g.fillRect(SX + SW / 2, TOP - 2, 1, cy - TOP + 2);
    g.fillStyle = C.cy; g.globalAlpha = .18; g.fillRect(SX - 3, cy - 2, SW + 6, FH + 2); g.globalAlpha = 1;
    g.strokeStyle = C.cy; g.lineWidth = 1; g.strokeRect(SX + .5, cy + .5, SW - 1, FH - 3);
    S.load.forEach(function (o, j) { var x = SX + 3 + (j % 2) * 12, y = cy + 2 + (j / 2 | 0) * 11; spr(x, y, o.k, o.c); txt(x, y + 7, FL[o.to], C.ink) });
    /* chi aspetta: icona, piano di arrivo, la barra della pazienza */
    S.wait.forEach(function (q, i) { q.forEach(function (o, j) { var x = SX + SW + 14 + j * 24, y = fy(i) + 5, k = o.t / o.max;
      var blink = k < .3 && (t * 6 | 0) % 2; spr(x, y, o.k, blink ? C.or : o.c);
      txt(x + 9, y + 1, '>' + FL[o.to], C.ink);
      g.fillStyle = '#2a2826'; g.fillRect(x, y + 10, 20, 2); g.fillStyle = k < .3 ? C.or : C.ink; g.fillRect(x, y + 10, Math.ceil(20 * k), 2) }) });
    floats.forEach(function (f) { g.globalAlpha = Math.min(1, f.t * 2); txt(f.x, f.y, f.s, f.c, 1, 'c'); g.globalAlpha = 1 });
    if (mode === 'ready') { panel(); txt(W / 2, 98, 'GET READY', C.yl, 2, 'c'); txt(W / 2, 120, 'UP / DOWN TO MOVE', C.ink, 1, 'c') }
    if (mode === 'over') { panel(); txt(W / 2, 84, 'GAME OVER', C.or, 2, 'c'); txt(W / 2, 106, 'SCORE ' + S.score, C.ink, 1, 'c');
      txt(W / 2, 116, S.score >= hi && S.score > 0 ? 'NEW RECORD!' : 'HI ' + hi, S.score >= hi && S.score > 0 ? C.yl : C.dim, 1, 'c');
      if ((t * 2 | 0) % 2) txt(W / 2, 136, 'INSERT COIN', C.cy, 1, 'c'); txt(W / 2, 150, "YOUR BUSINESS, NEXT.", C.dim, 1, 'c') }
  }
  function panel() { g.fillStyle = 'rgba(11,11,10,.86)'; g.fillRect(40, 70, W - 80, 92); g.strokeStyle = C.or; g.strokeRect(40.5, 70.5, W - 81, 91) }
  function attract(t) {
    /* la schermata del titolo: il palazzo che si accende a righe, la scritta, INSERT COIN che lampeggia */
    for (var i = 0; i < 18; i++) { var y = 30 + i * 6, on = ((t * 3 + i * .37) % 4) < 2; g.fillStyle = on ? '#1c1a18' : '#121211'; g.fillRect(0, y, W, 3) }
    var cy = 44 + Math.abs(Math.sin(t * .9)) * 60; g.strokeStyle = C.cy; g.strokeRect(W - 40.5, cy + .5, 16, 18); g.fillStyle = C.dim; g.fillRect(W - 33, 20, 1, cy - 20);
    txt(W / 2 + 2, 52, 'RUSH', C.or, 5, 'c'); txt(W / 2 + 2, 82, 'HOUR', C.or, 5, 'c');
    txt(W / 2, 50, 'RUSH', C.yl, 5, 'c'); txt(W / 2, 80, 'HOUR', C.yl, 5, 'c');
    txt(W / 2, 116, 'A MOTHER MACHINE GAME', C.dim, 1, 'c');
    KINDS.forEach(function (k, i) { spr(W / 2 - 34 + i * 18, 132, k, KC[i]) });
    txt(W / 2, 148, 'DELIVER EVERY ORDER TO ITS FLOOR', C.ink, 1, 'c');
    if ((t * 2 | 0) % 2) txt(W / 2, 170, 'INSERT COIN', C.cy, 2, 'c');
    txt(W / 2, 196, 'PRESS ENTER  .  HI ' + hi, C.dim, 1, 'c');
  }

  /* ---------- il cabinato ---------- */
  var box, scr, stick;
  function dom() {
    box = document.createElement('div'); box.className = 'rush'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Rush hour, the arcade game');
    box.innerHTML =
      '<button class="rux" type="button" aria-label="Leave the game"><span>Esc</span> Leave</button>' +
      '<div class="rcab">' +
        '<div class="rmq"><span class="rmq1">RUSH</span><span class="rmq2">HOUR</span><i class="rbulb"></i><i class="rbulb"></i></div>' +
        '<div class="rbez"><div class="rscr"><canvas width="' + W + '" height="' + H + '"></canvas><i class="rscan" aria-hidden="true"></i></div></div>' +
        '<div class="rdeck">' +
          '<div class="rjoy" aria-hidden="true"><i class="rst"><b></b></i></div>' +
          '<div class="rbtns"><button class="rb rup" type="button" aria-label="Up">&#9650;</button><button class="rb rdn" type="button" aria-label="Down">&#9660;</button></div>' +
          '<button class="rb rgo" type="button"><span>Insert coin</span></button>' +
        '</div>' +
        '<p class="rhelp mo">Arrows to move &middot; Enter to start &middot; M sound</p>' +
      '</div>';
    document.body.appendChild(box);
    cv = box.querySelector('canvas'); g = cv.getContext('2d'); g.imageSmoothingEnabled = false; scr = box.querySelector('.rscr'); stick = box.querySelector('.rst');
    box.querySelector('.rux').addEventListener('click', close);
    box.querySelector('.rgo').addEventListener('click', function () { coin() });
    function hold(b, d) { b.addEventListener('pointerdown', function (e) { e.preventDefault(); if (mode !== 'play') coin(); else move(d); tilt(d) }); b.addEventListener('pointerup', function () { tilt(0) }); b.addEventListener('pointerleave', function () { tilt(0) }) }
    hold(box.querySelector('.rup'), -1); hold(box.querySelector('.rdn'), 1);
    scr.addEventListener('click', function () { if (mode !== 'play') coin() });
  }
  function tilt(d) { if (stick) stick.style.transform = 'rotate(' + (d * -14) + 'deg)' }
  function key(e) {
    if (!box || !box.classList.contains('on')) return;
    var k = e.key;
    if (k === 'Escape') { close(); return }
    if (k === 'ArrowUp' || k === 'w' || k === 'W') { e.preventDefault(); move(-1); tilt(-1) }
    else if (k === 'ArrowDown' || k === 's' || k === 'S') { e.preventDefault(); move(1); tilt(1) }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); coin() }
    else if (k === 'm' || k === 'M') { mute = !mute; box.classList.toggle('muted', mute) }
  }
  function loop(now) { raf = requestAnimationFrame(loop); var dt = Math.min(.05, (now - (last || now)) / 1000); last = now; step(dt); draw(now) }
  var back = null;
  function open(x, y) {
    if (!box) dom();
    back = document.activeElement; mode = 'attract'; S = null;
    box.style.setProperty('--ox', (x == null ? innerWidth / 2 : x) + 'px'); box.style.setProperty('--oy', (y == null ? innerHeight / 2 : y) + 'px');
    box.classList.add('on'); document.documentElement.classList.add('rush-on');
    requestAnimationFrame(function () { box.classList.add('in') });
    last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
    setTimeout(function () { box.querySelector('.rgo').focus() }, 400);
  }
  function close() {
    if (!box) return; box.classList.remove('in'); document.documentElement.classList.remove('rush-on');
    setTimeout(function () { box.classList.remove('on'); cancelAnimationFrame(raf); raf = 0 }, RM ? 0 : 450);
    if (back && back.focus) back.focus();
  }
  addEventListener('keydown', key);
  addEventListener('keyup', function (e) { if (/Arrow|^[wsWS]$/.test(e.key)) tilt(0) });
  window.RUSH = { open: open, close: close };
})();
