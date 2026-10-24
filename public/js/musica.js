/* La musica del palazzo: il giradischi di LG e quattro dischi suonati in codice (WebAudio, stile 8 bit, niente file).
   Il giradischi chiama window.MUSICA.open(x, y): solo da li' parte la musica. Chiudendo, se suona, resta il mini lettore
   in basso a destra. Tra un piano e l'altro (pagine intere) lo stato sta in sessionStorage: sulla pagina nuova il disco
   riparte dal punto giusto al primo tocco (i browser vogliono un gesto). Fermo, non lavora: niente rAF, niente timer. */
(function () {
  if (window.MUSICA) return;
  var KEY = 'mm-musica', NS = 'http://www.w3.org/2000/svg';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- i dischi: accordi per battuta, un giro di basso, l'accompagnamento, la batteria, la melodia ----------
     melodia: "nota:durata" in sedicesimi, r = pausa, ogni sezione fa 4 battute (64 sedicesimi).
     basso: R radice, 3 terza, 5 quinta, 6 sesta, 7 settima minore, o ottava, - tiene, . pausa.
     accompagnamento: x l'accordo intero, cifre = note dell'accordo (oltre la fine, un'ottava sopra). */
  var DISCHI = [
    { nome: 'Lift Music', sub: 'Smooth ride, floor to floor.', bpm: 100, sw: .16, lab: '#F2CDBE', duty: .25, lv: .1, vib: 14,
      basso: 'R-----5-5-----R-', acc: 'x..x..x...x..x..', ad: .125, av: .03,
      bat: { k: 'x.....x.x.......', r: '..x..x...x..x...', h: 'x.x.x.x.x.x.x.x.' }, fill: { s: '..........x.x.xx' },
      giro: ['A', 'A2', 'B', 'A'],
      parti: {
        A: { c: ['F2 A3 C4 E4', 'D2 A3 C4 F4', 'G2 Bb3 D4 F4', 'C2 Bb3 E4 G4'],
          m: 'r:2 A4:2 C5:2 E5:4 D5:2 C5:4  A4:6 G4:2 F4:2 A4:6  r:2 Bb4:2 D5:2 F5:4 E5:2 D5:4  C5:8 r:4 G4:2 A4:2' },
        A2: { c: ['F2 A3 C4 E4', 'D2 A3 C4 F4', 'G2 Bb3 D4 F4', 'C2 Bb3 E4 G4'],
          m: 'r:2 A4:2 C5:2 E5:4 D5:2 C5:4  A4:6 G4:2 F4:2 A4:6  r:2 Bb4:2 D5:2 F5:4 E5:2 D5:4  Bb4:4 A4:4 G4:4 E4:4' },
        B: { c: ['Bb2 A3 D4 F4', 'A2 G3 C4 E4', 'G2 F3 Bb3 D4', 'C2 Bb3 E4 G4'], f: 1,
          m: 'D5:4 F5:4 A5:6 G5:2  E5:4 C5:4 A4:6 r:2  D5:2 F5:2 D5:2 Bb4:2 D5:4 C5:4  E5:2 G5:2 Bb5:4 A5:2 G5:2 E5:4' }
      } },
    { nome: 'Night Shift', sub: 'Servers hum. Everyone else sleeps.', bpm: 92, sw: 0, lab: '#BEC2BF', duty: .25, lv: .09, vib: 20,
      basso: 'R-------R-----5-', acc: '0123212301234321', ad: .125, av: .045,
      bat: { k: 'x.........x.....', s: '....x.......x...', h: '..x...x...x...x.' }, fill: { s: '....x.......x.xx' },
      giro: ['I', 'A', 'B', 'A2'],
      parti: {
        I: { c: ['A2 C4 E4 A4', 'F2 C4 E4 A4', 'D2 C4 F4 A4', 'E2 B3 E4 G#4'], d: 'h' },
        A: { c: ['A2 C4 E4 A4', 'F2 C4 E4 A4', 'D2 C4 F4 A4', 'E2 B3 E4 G#4'],
          m: 'E5:6 D5:2 C5:4 B4:2 C5:2  A4:10 r:2 G4:2 A4:2  F5:6 E5:2 D5:4 C5:2 D5:2  B4:8 G#4:4 r:4' },
        B: { c: ['F2 A3 C4 E4', 'G2 B3 D4 G4', 'E2 B3 D4 G4', 'A2 C4 E4 A4'], f: 1,
          m: 'C5:4 E5:4 A5:4 G5:2 E5:2  D5:6 B4:2 G4:4 D5:2 E5:2  B4:4 D5:4 G5:6 E5:2  A5:8 G5:2 E5:2 C5:2 B4:2' },
        A2: { c: ['A2 C4 E4 A4', 'F2 C4 E4 A4', 'D2 C4 F4 A4', 'E2 B3 E4 G#4'],
          m: 'E5:6 D5:2 C5:4 B4:2 C5:2  A4:10 r:2 G4:2 A4:2  F5:6 E5:2 D5:4 C5:2 D5:2  B4:4 C5:2 B4:2 G#4:4 E4:4' }
      } },
    { nome: 'Basement Boogie', sub: 'Lights low. Bass up.', bpm: 116, sw: .5, lab: '#F4F2EC', duty: .5, lv: .065, vib: 10,
      basso: 'R.3.5.6.7.6.5.3.', acc: '..x...x...x...x.', ad: .25, av: .03,
      bat: { k: 'x.....x.x.....x.', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' }, fill: { s: '....x...x.x.xxxx' },
      giro: ['X1', 'X2', 'X3', 'X4'],
      parti: {
        X1: { c: ['E2 G#3 B3 D4', 'E2 G#3 B3 D4', 'E2 G#3 B3 D4', 'E2 G#3 B3 D4'],
          m: 'r:4 E5:2 G5:2 E5:2 G5:2 A5:2 G5:2  E5:4 D5:2 B4:6 r:4  r:4 E5:2 G5:2 A5:2 Bb5:2 B5:2 A5:2  G5:4 E5:4 r:8' },
        X2: { c: ['A2 G3 C#4 E4', 'A2 G3 C#4 E4', 'E2 G#3 B3 D4', 'E2 G#3 B3 D4'],
          m: 'r:4 E5:2 G5:2 A5:4 G5:2 E5:2  C#5:2 E5:2 C#5:2 A4:6 r:4  r:4 E5:2 G5:2 E5:2 D5:2 B4:2 G4:2  A4:2 G4:2 E4:8 r:4' },
        X3: { c: ['B2 A3 D#4 F#4', 'A2 G3 C#4 E4', 'E2 G#3 B3 D4', 'B2 A3 D#4 F#4'],
          m: 'F#5:4 D#5:2 B4:2 F#5:4 A5:4  G5:4 E5:2 C#5:2 A4:4 r:4  B4:2 D5:2 E5:4 G5:2 E5:2 D5:2 B4:2  D#5:6 F#5:2 A5:6 r:2' },
        X4: { c: ['E2 G#3 B3 D4', 'E2 G#3 B3 D4', 'E2 G#3 B3 D4', 'B2 A3 D#4 F#4'], f: 1,
          m: 'E5:2 r:2 E5:2 r:2 G5:2 E5:2 r:4  B5:2 A5:2 G5:2 E5:2 D5:4 B4:4  E5:2 r:2 E5:2 r:2 G5:2 A5:2 Bb5:2 B5:2  E6:4 B5:2 G5:2 E5:4 r:4' }
      } },
    { nome: 'Rush Hour', sub: 'Every floor at once.', bpm: 148, sw: 0, lab: '#FF5B3A', duty: .25, lv: .08, vib: 12,
      basso: 'R.o.R.o.R.o.R.o.', acc: '0121012101210121', ad: .125, av: .03,
      bat: { k: 'x...x...x...x...', s: '....x.......x...', h: 'xxxxxxxxxxxxxxxx' }, fill: { s: '....x...x.xxxxxx' },
      giro: ['I', 'A', 'A2', 'B', 'B2'],
      parti: {
        I: { c: ['D2 F#3 A3 D4', 'B2 F#3 B3 D4', 'G2 G3 B3 D4', 'A2 E3 A3 C#4'] },
        A: { c: ['D2 F#3 A3 D4', 'B2 F#3 B3 D4', 'G2 G3 B3 D4', 'A2 E3 A3 C#4'],
          m: 'F#5:2 A5:2 D6:2 A5:2 F#5:2 A5:2 B5:2 A5:2  D5:4 F#5:2 B5:2 A5:2 F#5:2 D5:4  B4:2 D5:2 G5:2 D5:2 B4:2 D5:2 G5:2 A5:2  A5:6 G5:2 F#5:4 E5:4' },
        A2: { c: ['D2 F#3 A3 D4', 'B2 F#3 B3 D4', 'G2 G3 B3 D4', 'A2 E3 A3 C#4'],
          m: 'F#5:2 A5:2 D6:2 A5:2 F#5:2 A5:2 B5:2 A5:2  D5:4 F#5:2 B5:2 A5:2 F#5:2 D5:4  B4:2 D5:2 G5:2 D5:2 B4:2 D5:2 G5:2 A5:2  E5:2 F#5:2 G5:2 A5:2 C#6:4 r:4' },
        B: { c: ['G2 G3 B3 D4', 'A2 A3 C#4 E4', 'F#2 F#3 A3 C#4', 'B2 F#3 B3 D4'],
          m: 'D5:6 B4:2 D5:4 G5:4  E5:6 C#5:2 E5:4 A5:4  F#5:6 E5:2 C#5:4 A4:4  B4:8 D5:4 F#5:4' },
        B2: { c: ['G2 G3 B3 D4', 'A2 A3 C#4 E4', 'B2 F#3 B3 D4', 'A2 E3 A3 C#4'], f: 1,
          m: 'G5:6 F#5:2 E5:4 D5:4  E5:6 F#5:2 G5:4 A5:4  B5:4 A5:4 F#5:4 D5:4  C#5:2 E5:2 A5:2 C#6:2 E6:4 r:4' }
      } }
  ];

  /* ---------- dal foglio alle note: per ogni sedicesimo, cosa suona ---------- */
  var SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }, OFF = { R: 0, 3: 4, 5: 7, 6: 9, 7: 10, o: 12 }, ERR = [];
  function midi(s) { var m = /^([A-G])([#b]?)(\d)$/.exec(s); return m ? 12 * (+m[3] + 1) + SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) : 60 }
  function hz(n) { return 440 * Math.pow(2, (n - 69) / 12) }
  function lungo(p, i) { var l = 1; while (p[i + l] === '-') l++; return l }
  function monta(D) {
    if (D.ev) return D;
    var N = D.giro.length * 64, ev = []; for (var i = 0; i < N; i++) ev.push([]);
    D.giro.forEach(function (nome, si) {
      var S = D.parti[nome], base = si * 64;
      for (var b = 0; b < 4; b++) {
        var mezzi = S.c[b].split('/').map(function (c) { return c.trim().split(/\s+/).map(midi) });
        var ultima = b === 3 && S.f, bat = S.d === 0 ? {} : D.bat;
        for (var st = 0; st < 16; st++) {
          var ch = mezzi[st < 8 ? 0 : mezzi.length - 1], E = ev[base + b * 16 + st], v = ch.slice(1), c;
          c = D.basso[st]; if (c in OFF) E.push({ c: 'b', n: ch[0] + OFF[c], l: lungo(D.basso, st) });
          c = D.acc[st]; if (c === 'x') E.push({ c: 'a', n: v, l: lungo(D.acc, st) });
          else if (c >= '0' && c <= '9') E.push({ c: 'a', n: [v[c % v.length] + 12 * Math.floor(c / v.length)], l: 1 });
          ['k', 's', 'r', 'h'].forEach(function (k) {
            if (S.d === 'h' && k !== 'h') return;
            var p = (ultima && D.fill[k]) || bat[k];
            if (p && p[st] === 'x') E.push({ c: k, v: st % 4 === 0 ? 1 : st % 2 ? .55 : .75 });
          });
        }
      }
      if (S.m) {
        var pos = 0;
        S.m.trim().split(/\s+/).forEach(function (t) { var q = t.split(':'), l = +q[1]; if (q[0] !== 'r' && pos < 64) ev[base + pos].push({ c: 'm', n: midi(q[0]), l: l, v: pos % 16 === 0 ? 1 : .85 }); pos += l });
        if (pos !== 64) ERR.push(D.nome + ' ' + nome + ' ' + pos);
      }
    });
    D.ev = ev; D.N = N; D.sd = 60 / D.bpm / 4; D.L = N * D.sd;
    return D;
  }
  DISCHI.forEach(monta);

  /* ---------- lo stato, e la memoria tra un piano e l'altro ---------- */
  var S = { st: 'off', t: 0, pos: 0, vol: .6 };
  function leggi() { try { var j = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (j && typeof j === 'object') return j } catch (x) {} return null }
  function salva() {
    try { sessionStorage.setItem(KEY, JSON.stringify({ st: S.st === 'wait' ? 'play' : S.st, t: S.t, pos: +posNow().toFixed(2), vol: S.vol })) } catch (x) {}
  }

  /* ---------- il suono ---------- */
  var ctx = null, master = null, onde = {}, rumore = null, sess = null, timer = 0, passo = 0, prossimo = 0, t0 = 0, p0 = 0, AV = .12;
  function contesto() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    try { ctx = new AC() } catch (x) { return null }
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 9000;
    var co = ctx.createDynamicsCompressor(); co.threshold.value = -14; co.ratio.value = 4; co.attack.value = .004; co.release.value = .2;
    master = ctx.createGain(); master.gain.value = livello();
    master.connect(lp); lp.connect(co); co.connect(ctx.destination);
    /* le onde quadre strette del chip: 12,5%, 25% e 50% */
    [.125, .25, .5].forEach(function (d) {
      var n = 40, re = new Float32Array(n), im = new Float32Array(n);
      for (var i = 1; i < n; i++) re[i] = 2 * Math.sin(Math.PI * i * d) / (Math.PI * i);
      onde[d] = ctx.createPeriodicWave(re, im);
    });
    rumore = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    var r = rumore.getChannelData(0); for (var i = 0; i < r.length; i++) r[i] = Math.random() * 2 - 1;
    return ctx;
  }
  function livello() { return S.vol * S.vol * .9 }
  /* una sessione: tutto quello che suona passa da qui, cosi' pausa e stop tagliano anche le note gia' in coda */
  function nuovaSessione(D) {
    var g = ctx.createGain(); g.connect(master);
    var lead = ctx.createGain(); lead.connect(g);
    var dl = ctx.createDelay(1), fb = ctx.createGain(), wet = ctx.createGain(), f = ctx.createBiquadFilter();
    dl.delayTime.value = D.sd * 3; fb.gain.value = .28; wet.gain.value = .22; f.type = 'lowpass'; f.frequency.value = 2400;
    lead.connect(dl); dl.connect(f); f.connect(fb); fb.connect(dl); f.connect(wet); wet.connect(g);
    return { g: g, lead: lead };
  }
  function chiudiSessione() {
    if (!sess) return; var s = sess; sess = null;
    try { s.g.gain.cancelScheduledValues(ctx.currentTime); s.g.gain.setTargetAtTime(0, ctx.currentTime, .02) } catch (x) {}
    setTimeout(function () { try { s.g.disconnect() } catch (x) {} }, 400);
  }
  function voce(onda, f, t, dur, v, out, o) {
    var os = ctx.createOscillator(), g = ctx.createGain();
    if (typeof onda === 'string') os.type = onda; else os.setPeriodicWave(onda);
    os.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .006);
    g.gain.setTargetAtTime(v * (o && o.sus != null ? o.sus : .6), t + .006, o && o.dec || .12);
    g.gain.setTargetAtTime(0, t + dur, .03);
    if (o && o.vib && dur > .3) {
      var lf = ctx.createOscillator(), lg = ctx.createGain(); lf.frequency.value = 5.5;
      lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(o.vib, t + Math.min(.35, dur));
      lf.connect(lg); lg.connect(os.detune); lf.start(t); lf.stop(t + dur + .2);
    }
    os.connect(g); g.connect(out); os.start(t); os.stop(t + dur + .2);
  }
  function colpo(t, f, q, tipo, dec, v, out) {
    var s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = rumore; fl.type = tipo; fl.frequency.value = f; fl.Q.value = q;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + dec);
    s.connect(fl); fl.connect(g); g.connect(out); s.start(t, Math.random() * .5); s.stop(t + dec + .02);
  }
  function suona(D, st, t) {
    var out = sess.g, sd = D.sd;
    D.ev[st].forEach(function (e) {
      if (e.c === 'm') { voce(onde[D.duty], hz(e.n), t, e.l * sd * .92, D.lv * e.v, sess.lead, { vib: D.vib, sus: .55, dec: .25 });
        voce(onde[D.duty], hz(e.n) * 1.004, t, e.l * sd * .92, D.lv * .35 * e.v, sess.lead, { sus: .5, dec: .2 }) }
      else if (e.c === 'b') voce('triangle', hz(e.n), t, Math.max(.08, e.l * sd * .9), .3, out, { sus: .8, dec: .2 });
      else if (e.c === 'a') e.n.forEach(function (n) { voce(onde[D.ad], hz(n), t, Math.max(.05, e.l * sd * .7), D.av, out, { sus: .3, dec: .06 }) });
      else if (e.c === 'k') { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
        o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + .12);
        g.gain.setValueAtTime(.55 * e.v, t); g.gain.exponentialRampToValueAtTime(.001, t + .2); o.connect(g); g.connect(out); o.start(t); o.stop(t + .22) }
      else if (e.c === 's') { colpo(t, 1500, .7, 'highpass', .15, .26 * e.v, out); voce('triangle', 185, t, .05, .18 * e.v, out, { sus: .2, dec: .03 }) }
      else if (e.c === 'h') colpo(t, 8000, .7, 'highpass', .035, .08 * e.v, out);
      else if (e.c === 'r') colpo(t, 3200, 5, 'bandpass', .03, .35 * e.v, out);
    });
    /* le spie dei sedicesimi sul giradischi, solo se e' aperto */
    if (box && box.classList.contains('on')) { var k = st % 16, d = Math.max(0, (t - ctx.currentTime) * 1000); setTimeout(function () { spia(k) }, d) }
  }
  /* il sequencer: guarda avanti un po', programma le note, torna tra 25 ms */
  function giro() {
    var D = DISCHI[S.t], ahead = document.hidden ? 1.2 : AV;
    while (prossimo < ctx.currentTime + ahead) {
      var q = passo % 4 === 2 ? D.sw * D.sd : 0;
      suona(D, passo, prossimo + q);
      passo = (passo + 1) % D.N; prossimo += D.sd;
    }
    timer = setTimeout(giro, 25);
  }
  function posNow() {
    if (S.st !== 'play' || !ctx) return S.pos;
    var D = DISCHI[S.t]; return ((p0 + Math.max(0, ctx.currentTime - t0)) % D.L + D.L) % D.L;
  }
  function avvia(t, pos) {
    if (!contesto()) return;
    if (ctx.state !== 'running') { try { ctx.resume() } catch (x) {} }
    ferma(true);
    var D = DISCHI[t]; S.t = t; pos = ((pos || 0) % D.L + D.L) % D.L;
    sess = nuovaSessione(D);
    passo = Math.ceil(pos / D.sd - 1e-6) % D.N; prossimo = ctx.currentTime + .06;
    p0 = passo * D.sd; t0 = prossimo; S.st = 'play';
    giro(); battito(); aggiorna(); salva();
  }
  function ferma(silenzio) {
    clearTimeout(timer); timer = 0; clearInterval(tic); tic = 0;
    if (ctx) chiudiSessione();
    if (!silenzio) aggiorna();
  }
  var tic = 0;
  function battito() { clearInterval(tic); tic = setInterval(function () { salva(); tempo() }, 1000) }

  /* ---------- i comandi ---------- */
  function play(i) {
    if (i != null) { avvia(i, 0); return }
    if (S.st === 'play') return;
    avvia(S.t, S.pos);
  }
  function pausa() { if (S.st !== 'play') return; S.pos = posNow(); ferma(); S.st = 'pause'; aggiorna(); salva() }
  function toggle() { S.st === 'play' ? pausa() : play() }
  function stop() { ferma(); S.st = 'off'; S.pos = 0; aggiorna(); salva() }
  function salta(d) {
    var era = S.st, p = posNow();
    var t = d < 0 && p > 3 ? S.t : (S.t + d + DISCHI.length) % DISCHI.length;
    if (era === 'play' || era === 'wait') avvia(t, 0); else { S.t = t; S.pos = 0; aggiorna(); if (era !== 'off') salva(); cambio() }
  }
  function volume(v) { S.vol = Math.max(0, Math.min(1, v)); if (master) master.gain.setTargetAtTime(livello(), ctx.currentTime, .03); aggiorna(); salva() }

  /* ---------- il disegno: icone, giradischi, copertine ---------- */
  var IC = {
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9.5-5.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z" fill="currentColor"/></svg>',
    prev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2.5h2v11H3zM14 2.5v11L5.5 8z" fill="currentColor"/></svg>',
    next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11 2.5h2v11h-2zM2 2.5v11L10.5 8z" fill="currentColor"/></svg>',
    stop: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5h9v9h-9z" fill="currentColor"/></svg>'
  };
  function cerchio(cx, cy, r) { return 'M' + (cx - r) + ' ' + cy + 'a' + r + ' ' + r + ' 0 1 1 ' + 2 * r + ' 0a' + r + ' ' + r + ' 0 1 1 ' + -2 * r + ' 0' }
  function piatto() {
    var C = [268, 266], s = '', i;
    s += '<rect class="mL" x="16" y="16" width="608" height="508" fill="#0F0F0E"/><rect class="mL f" x="26" y="26" width="588" height="488"/>';
    /* le viti negli angoli, il piatto, il disco con i solchi */
    [[40, 40], [600, 40], [40, 500], [600, 500]].forEach(function (p) { s += '<circle class="mL f" cx="' + p[0] + '" cy="' + p[1] + '" r="4"/>' });
    s += '<circle class="mL" cx="268" cy="266" r="208" fill="#121211"/>';
    for (i = 0; i < 48; i++) { var a = i * 7.5 * Math.PI / 180; s += '<line class="mL f" x1="' + (C[0] + 204 * Math.cos(a)).toFixed(1) + '" y1="' + (C[1] + 204 * Math.sin(a)).toFixed(1) + '" x2="' + (C[0] + 208 * Math.cos(a)).toFixed(1) + '" y2="' + (C[1] + 208 * Math.sin(a)).toFixed(1) + '"/>' }
    s += '<g class="musdisc"><g class="musrec">';
    s += '<circle cx="268" cy="266" r="196" fill="#0A0A09" class="mL"/>';
    for (i = 84; i < 192; i += 5) s += '<circle class="mG' + ([119, 154].indexOf(i) >= 0 ? ' b' : '') + '" cx="268" cy="266" r="' + i + '"/>';
    /* un segno sul solco, per vedere il giro */
    s += '<path class="mG b" d="M268 86 A180 180 0 0 1 330 97"/>';
    s += '<circle class="muslab" cx="268" cy="266" r="72"/>';
    s += '<path id="musLp" d="' + cerchio(268, 266, 58) + '" fill="none"/>';
    s += '<text class="musLt"><textPath href="#musLp" textLength="358" lengthAdjust="spacing">MOTHER MACHINE &#183; SIDE A &#183; 33 RPM &#183; LG PRESSING &#183;</textPath></text>';
    s += '<text class="musLn" x="268" y="240" text-anchor="middle"><tspan x="268"></tspan><tspan x="268" dy="14"></tspan></text><text class="musLs" x="268" y="296" text-anchor="middle">LG</text>';
    s += '</g></g>';
    /* il riflesso fermo sul vinile */
    s += '<path class="mSh" d="M268 266 L' + (C[0] + 196 * Math.cos(-2.4)).toFixed(1) + ' ' + (C[1] + 196 * Math.sin(-2.4)).toFixed(1) + ' A196 196 0 0 1 ' + (C[0] + 196 * Math.cos(-2.05)).toFixed(1) + ' ' + (C[1] + 196 * Math.sin(-2.05)).toFixed(1) + 'Z"/>';
    s += '<path class="mSh" d="M268 266 L' + (C[0] + 196 * Math.cos(.74)).toFixed(1) + ' ' + (C[1] + 196 * Math.sin(.74)).toFixed(1) + ' A196 196 0 0 1 ' + (C[0] + 196 * Math.cos(1.09)).toFixed(1) + ' ' + (C[1] + 196 * Math.sin(1.09)).toFixed(1) + 'Z"/>';
    s += '<circle cx="268" cy="266" r="5" fill="#0F0F0E" class="mL"/>';
    /* il cursore della velocita' e il poggiabraccio */
    s += '<line class="mL f" x1="596" y1="196" x2="596" y2="372"/>';
    for (i = 0; i <= 8; i++) s += '<line class="mL f" x1="' + (i % 4 ? 604 : 602) + '" y1="' + (196 + i * 22) + '" x2="610" y2="' + (196 + i * 22) + '"/>';
    s += '<rect class="mL" x="588" y="276" width="16" height="10" fill="#0F0F0E"/><text class="musT" x="596" y="186" text-anchor="middle">PITCH</text>';
    s += '<rect class="mL f" x="549" y="398" width="22" height="26"/>';
    /* il braccio: perno, contrappeso, canna, testina; gira attorno al perno */
    s += '<circle class="mL" cx="548" cy="108" r="34" fill="#0F0F0E"/><circle class="mL f" cx="548" cy="108" r="24"/>';
    s += '<g class="musarm"><rect class="mL" x="534" y="34" width="28" height="34" fill="#121211"/><line class="mL f" x1="534" y1="44" x2="562" y2="44"/><line class="mL f" x1="534" y1="58" x2="562" y2="58"/>' +
      '<path class="mL arm" d="M548 68 L548 108 L556 330 L560 392"/>' +
      '<path class="mL" d="M548 388 L574 392 L569 416 L545 411Z" fill="#121211"/><line class="mL f" x1="552" y1="404" x2="566" y2="406"/>' +
      '<circle class="mL" cx="548" cy="108" r="9" fill="#0F0F0E"/></g>';
    /* in basso: il tasto start, le sedici spie, la targhetta */
    s += '<g class="musstart"><rect class="mL" x="44" y="472" width="34" height="28" fill="#0F0F0E"/><rect class="mStart" x="51" y="479" width="20" height="14"/></g>';
    s += '<text class="musT" x="61" y="466" text-anchor="middle">START</text>';
    for (i = 0; i < 16; i++) s += '<rect class="mSp" data-i="' + i + '" x="' + (104 + i * 19) + '" y="482" width="9" height="9"/>';
    s += '<text class="musT" x="600" y="497" text-anchor="end">MM-8 &#183; DIRECT DRIVE</text>';
    s += '<text class="musT" x="600" y="480" text-anchor="end" opacity=".6">33 / 45</text>';
    return '<svg class="mustt" viewBox="0 0 640 540" aria-hidden="true">' + s + '</svg>';
  }
  /* le copertine: un disegno a linee per disco, il disco che spunta di sopra */
  var COP = [
    '<rect x="26" y="20" width="48" height="66"/><line x1="50" y1="20" x2="50" y2="86"/><path d="M38 12l5-6 5 6zM52 6l5 6 5-6z" class="p"/><line x1="40" y1="52" x2="44" y2="52"/><line x1="56" y1="52" x2="60" y2="52"/><line x1="14" y1="86" x2="86" y2="86"/>',
    '<path d="M64 18a18 18 0 1 0 14 30a22 22 0 0 1-14-30z"/><rect x="22" y="22" width="3" height="3" class="p"/><rect x="38" y="14" width="3" height="3" class="p"/><rect x="30" y="38" width="3" height="3" class="p"/><rect x="18" y="58" width="22" height="28"/><rect x="44" y="50" width="22" height="36"/><line x1="22" y1="66" x2="36" y2="66"/><line x1="22" y1="74" x2="36" y2="74"/><line x1="48" y1="58" x2="62" y2="58"/><line x1="48" y1="66" x2="62" y2="66"/><line x1="12" y1="86" x2="88" y2="86"/>',
    '<polyline points="12,30 30,30 30,46 48,46 48,62 66,62 66,78 88,78"/><circle cx="68" cy="28" r="13"/><line x1="55" y1="28" x2="81" y2="28"/><path d="M68 15c-6 6-6 20 0 26M68 15c6 6 6 20 0 26"/><line x1="68" y1="6" x2="68" y2="15"/>',
    '<circle cx="54" cy="46" r="26"/><line x1="54" y1="46" x2="54" y2="30"/><line x1="54" y1="46" x2="66" y2="52"/><line x1="10" y1="34" x2="22" y2="34"/><line x1="6" y1="46" x2="22" y2="46"/><line x1="12" y1="58" x2="22" y2="58"/><line x1="20" y1="86" x2="88" y2="86"/><rect x="51" y="43" width="6" height="6" class="p"/>'
  ];
  function copertina(D, i) {
    return '<button class="mussl" type="button" data-i="' + i + '" aria-label="Play ' + D.nome + '">' +
      '<span class="musslb"><svg class="musvin" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="#0A0A09"/><circle cx="50" cy="50" r="36" fill="none"/><circle cx="50" cy="50" r="26" fill="none"/><circle cx="50" cy="50" r="15" style="fill:' + D.lab + ';stroke:none"/><circle cx="50" cy="50" r="2.5" fill="#0A0A09"/></svg>' +
      '<span class="musslc"><svg viewBox="0 0 100 100" aria-hidden="true">' + COP[i] + '</svg><i class="museq" aria-hidden="true"><b></b><b></b><b></b></i></span></span>' +
      '<b class="mussn">' + D.nome + '</b><span class="mussu">' + D.sub + '</span></button>';
  }

  /* ---------- lo stile, tutto qui ---------- */
  var CSS = [
    '.mus{position:fixed;inset:0;z-index:2147481500;display:none;color:#F4F2EC;font-family:var(--f-body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent}',
    '.mus.on{display:block}',
    'html.mus-on,html.mus-on body{overflow:hidden}',
    'html.mus-on .mmc{--cc:#F4F2EC!important}',
    '.mus .mo,.musm .mo{font-family:var(--f-mono,ui-monospace,monospace)}',
    '.musbg{position:absolute;inset:0;opacity:0;transition:opacity .35s ease;background:radial-gradient(ellipse at 34% 50%,rgba(255,91,58,.09),transparent 55%),linear-gradient(rgba(244,242,236,.035) 1px,transparent 1px) 0 0/48px 48px,linear-gradient(90deg,rgba(244,242,236,.035) 1px,transparent 1px) 0 0/48px 48px,rgba(9,9,8,.95)}',
    '.mus.in .musbg{opacity:1}',
    '.musin{position:relative;height:100%;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);align-items:center;gap:clamp(24px,4vw,72px);max-width:1320px;margin:0 auto;padding:clamp(56px,7vh,88px) clamp(16px,4vw,56px) 40px;box-sizing:border-box;pointer-events:none}',
    '.musin>*{pointer-events:auto}',
    '.musst{position:relative;align-self:center;display:grid;place-items:center;min-height:0;padding:22px}',
    '.musobj{width:100%;display:grid;place-items:center;transform:translate(var(--dx,0),var(--dy,0)) scale(.18);opacity:0;transition:transform .62s cubic-bezier(.2,.9,.25,1),opacity .25s;will-change:transform}',
    '.mus.in .musobj{transform:none;opacity:1}',
    '.mustt{width:100%;height:auto;max-height:min(70vh,640px);display:block;overflow:visible}',
    '.musc{position:absolute;width:26px;height:26px;border:0 solid rgba(244,242,236,.55);opacity:0;transition:opacity .3s .35s,transform .5s cubic-bezier(.2,.8,.2,1) .3s;pointer-events:none}',
    '.musc.c1{left:0;top:0;border-width:1.5px 0 0 1.5px;transform:translate(14px,14px)}.musc.c2{right:0;top:0;border-width:1.5px 1.5px 0 0;transform:translate(-14px,14px)}',
    '.musc.c3{left:0;bottom:0;border-width:0 0 1.5px 1.5px;transform:translate(14px,-14px)}.musc.c4{right:0;bottom:0;border-width:0 1.5px 1.5px 0;transform:translate(-14px,-14px)}',
    '.mus.in .musc{opacity:1;transform:none}',
    /* il giradischi a linee */
    '.mustt .mL{stroke:rgba(244,242,236,.62);stroke-width:1.4}.mustt .mL:not([fill]){fill:none}',
    '.mustt .mL.f{stroke:rgba(244,242,236,.28);stroke-width:1}',
    '.mustt .mG{fill:none;stroke:rgba(244,242,236,.07);stroke-width:1}.mustt .mG.b{stroke:rgba(244,242,236,.2)}',
    '.mustt .mSh{fill:rgba(244,242,236,.045);pointer-events:none}',
    '.mustt .muslab{fill:var(--lab,#F2CDBE);transition:fill .3s}',
    '.mustt .musLt{font:500 8.5px var(--f-mono,monospace);letter-spacing:.14em;fill:#121211}',
    '.mustt .musLn{font:700 12.5px var(--f-body,sans-serif);letter-spacing:-.02em;fill:#121211}',
    '.mustt .musLs{font:500 10px var(--f-mono,monospace);letter-spacing:.2em;fill:#121211}',
    '.mustt .musT{font:500 10px var(--f-mono,monospace);letter-spacing:.14em;fill:rgba(244,242,236,.5)}',
    '.mustt .mSp{fill:rgba(244,242,236,.12);transition:fill .12s}.mustt .mSp.on{fill:#FF5B3A;transition:none}',
    '.mustt .mStart{fill:rgba(244,242,236,.16);transition:fill .2s}.mus.playing .mustt .mStart{fill:#FF5B3A}',
    '.musrec,.musdisc{transform-box:view-box;transform-origin:268px 266px}',
    '.musrec{animation:musgira 1.8s linear infinite;animation-play-state:paused}',
    '.mus.playing .musrec{animation-play-state:running}',
    '@keyframes musgira{to{transform:rotate(360deg)}}',
    '.musdisc.sw{animation:musswap .5s cubic-bezier(.2,.8,.2,1)}',
    '@keyframes musswap{0%{opacity:.15;transform:scale(.94)}100%{opacity:1;transform:none}}',
    '.musarm{transform-box:view-box;transform-origin:548px 108px;transform:rotate(var(--arm,0deg));transition:transform 1s cubic-bezier(.5,0,.2,1)}',
    /* la colonna dei testi */
    '.mustx{display:grid;gap:18px;align-content:center;justify-items:start;max-width:520px;min-width:0}',
    '.mustx>*{transform:translateY(14px);opacity:0;transition:transform .55s cubic-bezier(.2,.8,.2,1),opacity .4s}',
    '.mus.in .mustx>*{transform:none;opacity:1}',
    '.mus.in .mustx>:nth-child(2){transition-delay:.18s}.mus.in .mustx>:nth-child(3){transition-delay:.24s}.mus.in .mustx>:nth-child(4){transition-delay:.3s}.mus.in .mustx>:nth-child(5){transition-delay:.36s}.mus.in .mustx>:nth-child(6){transition-delay:.42s}.mus.in .mustx>:nth-child(7){transition-delay:.48s}',
    '.musx{all:unset;cursor:pointer;display:flex;align-items:center;gap:12px;margin-bottom:2px}',
    '.musxk{position:relative;width:44px;height:44px;box-sizing:border-box;border:1.5px solid rgba(244,242,236,.6);display:grid;place-items:center;transition:border-color .2s,box-shadow .2s}',
    '.musxk i{position:absolute;width:16px;height:1.5px;background:#F4F2EC;transition:transform .35s cubic-bezier(.2,.8,.2,1),background .2s}',
    '.musxk i:first-child{transform:rotate(45deg)}.musxk i:last-child{transform:rotate(-45deg)}',
    '.musx .mo{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(244,242,236,.5);transition:color .2s}',
    '.musx:hover .musxk,.musx:focus-visible .musxk{border-color:#FF5B3A;box-shadow:0 0 0 4px rgba(255,91,58,.18)}',
    '.musx:hover .musxk i,.musx:focus-visible .musxk i{background:#FF5B3A}',
    '.musx:hover .musxk i:first-child{transform:rotate(135deg)}.musx:hover .musxk i:last-child{transform:rotate(45deg)}',
    '.musx:hover .mo,.musx:focus-visible .mo{color:#FF5B3A}',
    '.musk{display:flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(244,242,236,.6)}',
    '.musk::before{content:"";width:8px;height:8px;background:rgba(244,242,236,.25)}',
    '.mus.playing .musk::before{background:#FF5B3A;animation:musled 1.4s steps(1) infinite}',
    '@keyframes musled{50%{opacity:.2}}',
    '.mustx h2{margin:0;font:650 clamp(34px,3.6vw,56px)/.95 var(--f-body,sans-serif);letter-spacing:-.045em;color:#F4F2EC}',
    '.musp{margin:-6px 0 0;font:400 17px/1.5 var(--f-body,sans-serif);color:rgba(244,242,236,.72)}',
    /* i comandi: tasti quadrati come la pulsantiera, play pieno con il pomodoro che sale */
    '.musctl{display:flex;align-items:center;gap:10px;flex-wrap:wrap}',
    '.musb{all:unset;box-sizing:border-box;cursor:pointer;position:relative;display:grid;place-items:center;width:52px;height:52px;border:1.5px solid rgba(244,242,236,.5);color:#F4F2EC;box-shadow:inset 0 1px 0 rgba(255,255,255,.1),inset 0 -2px 0 rgba(0,0,0,.3);transition:border-color .25s,transform .12s}',
    '.musb svg{width:16px;height:16px}',
    '.musb::after{content:"";position:absolute;inset:4px;border:1.5px solid currentColor;opacity:0;transform:scale(.8);transition:opacity .2s,transform .3s cubic-bezier(.2,.8,.2,1)}',
    '.musb:hover,.musb:focus-visible{border-color:#F4F2EC}.musb:hover::after,.musb:focus-visible::after{opacity:.35;transform:none}',
    '.musb:active{transform:scale(.93)}',
    '.musb:focus-visible,.muspl:focus-visible,.mussl:focus-visible .musslc,.musv:focus-visible{outline:2px solid #F4F2EC;outline-offset:3px}',
    '.muspl{all:unset;box-sizing:border-box;cursor:pointer;position:relative;overflow:hidden;isolation:isolate;display:inline-flex;align-items:center;gap:12px;height:52px;padding:0 24px 0 20px;min-width:132px;background:#F4F2EC;color:#0F0F0E;font:600 15px var(--f-body,sans-serif);transition:transform .12s}',
    '.muspl svg{width:16px;height:16px}',
    '.muspl .fl{position:absolute;inset:0;background:#FF5B3A;transform:translateY(101%);transition:transform .45s cubic-bezier(.7,0,.2,1);z-index:-1}',
    '.muspl:hover .fl,.muspl:focus-visible .fl{transform:none}',
    '.muspl:active{transform:scale(.97)}',
    '.mustime{margin-left:6px;font-size:12px;letter-spacing:.08em;color:rgba(244,242,236,.55);font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.musvol{display:flex;align-items:center;gap:6px}',
    '.musvol .mo{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(244,242,236,.5);margin-right:8px}',
    '.musv{all:unset;cursor:pointer;width:14px;height:22px;box-sizing:border-box;padding:3px 2px;display:grid}',
    '.musv i{display:block;background:rgba(244,242,236,.16);transition:background .2s}',
    '.musv.on i{background:#F4F2EC}.musv:hover i{background:#FF5B3A}',
    /* la cassa dei dischi */
    '.muscr{width:100%;display:grid;gap:12px;margin-top:6px}',
    '.muscr>.mo{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(244,242,236,.5)}',
    '.musrow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;padding-top:26px}',
    '.mussl{all:unset;cursor:pointer;display:grid;gap:8px;align-content:start;min-width:0}',
    '.musslb{position:relative;display:block;aspect-ratio:1}',
    '.musvin{position:absolute;left:6%;top:6%;width:88%;height:88%;transform:translateY(-4%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}',
    '.musvin circle{stroke:rgba(244,242,236,.22);stroke-width:1}',
    '.mussl:hover .musvin,.mussl:focus-visible .musvin{transform:translateY(-18%)}',
    '.mussl.on .musvin{transform:translateY(-30%)}',
    '.musslc{position:absolute;inset:0;display:block;background:#121211;border:1.5px solid rgba(244,242,236,.32);box-sizing:border-box;transition:border-color .25s,transform .25s cubic-bezier(.2,.8,.2,1)}',
    '.musslc::after{content:"";position:absolute;inset:4px;border:1.5px solid #F4F2EC;opacity:0;transform:scale(.9);transition:opacity .2s,transform .3s cubic-bezier(.2,.8,.2,1);pointer-events:none}',
    '.musslc svg{position:absolute;inset:10%;width:80%;height:80%;fill:none;stroke:rgba(244,242,236,.7);stroke-width:2;stroke-linecap:square}',
    '.musslc svg .p{fill:rgba(244,242,236,.7);stroke:none}',
    '.mussl:hover .musslc,.mussl:focus-visible .musslc{border-color:#F4F2EC}',
    '.mussl:hover .musslc::after{opacity:.25;transform:none}',
    '.mussl.on .musslc{border-color:#F4F2EC}',
    '.mussn{font:600 14px/1.15 var(--f-body,sans-serif);letter-spacing:-.01em;color:#F4F2EC}',
    '.mussu{margin-top:-4px;font:400 12px/1.35 var(--f-body,sans-serif);color:rgba(244,242,236,.55)}',
    '.museq{position:absolute;right:7px;top:7px;display:none;gap:2px;align-items:flex-end;height:12px}',
    '.museq b{width:3px;height:100%;background:#FF5B3A;transform-origin:bottom;transform:scaleY(.4)}',
    '.mussl.on .museq{display:flex}',
    '.mus.playing .mussl.on .museq b{animation:museq .9s steps(4) infinite}',
    '.mus.playing .mussl.on .museq b:nth-child(2){animation-duration:.7s}.mus.playing .mussl.on .museq b:nth-child(3){animation-duration:1.1s}',
    '@keyframes museq{0%{transform:scaleY(.3)}25%{transform:scaleY(1)}50%{transform:scaleY(.55)}75%{transform:scaleY(.85)}}',
    /* il mini lettore */
    '.musm{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:2147482000;display:flex;align-items:center;gap:6px;height:56px;padding:0 6px 0 10px;box-sizing:border-box;max-width:calc(100vw - 32px);background:#0F0F0E;color:#F4F2EC;border:1px solid rgba(244,242,236,.28);box-shadow:0 18px 40px -16px rgba(0,0,0,.6),0 0 0 4px rgba(15,15,14,.06);font-family:var(--f-body,system-ui,sans-serif);opacity:0;transform:translateY(14px);transition:opacity .3s,transform .45s cubic-bezier(.2,.8,.2,1);-webkit-tap-highlight-color:transparent}',
    '.musm[hidden]{display:none}',
    '.musm.in{opacity:1;transform:none}',
    '.musmd{flex:none;width:30px;height:30px;margin-right:4px}',
    '.musmd svg{width:100%;height:100%;display:block}',
    '.musmd .r{transform-origin:15px 15px;animation:musgira 1.8s linear infinite;animation-play-state:paused}',
    '.musm.playing .musmd .r{animation-play-state:running}',
    '.musmt{display:grid;gap:3px;min-width:0;width:118px;margin-right:4px}',
    '.musmt b{font:600 13px/1.1 var(--f-body,sans-serif);letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.musmt i{font:500 9.5px/1 var(--f-mono,monospace);font-style:normal;letter-spacing:.12em;text-transform:uppercase;color:rgba(244,242,236,.55);white-space:nowrap;display:flex;align-items:center;gap:6px}',
    '.musm.wait .musmt i::before{content:"";width:6px;height:6px;background:#FF5B3A;animation:musled 1.4s steps(1) infinite}',
    '.musmb{all:unset;box-sizing:border-box;cursor:pointer;position:relative;flex:none;display:grid;place-items:center;width:38px;height:38px;border:1px solid transparent;color:#F4F2EC;transition:border-color .2s,color .2s,transform .12s}',
    '.musmb svg{width:13px;height:13px}',
    '.musmb:hover,.musmb:focus-visible{border-color:rgba(244,242,236,.6)}',
    '.musmb:active{transform:scale(.92)}',
    '.musmb.pp{border-color:rgba(244,242,236,.5)}',
    '.musm.wait .musmb.pp{color:#FF5B3A;border-color:#FF5B3A}',
    '.musmb:focus-visible{outline:2px solid #F4F2EC;outline-offset:2px}',
    '@media (max-width:900px){',
    '.musin{display:block;padding:64px 16px 32px;overflow-y:auto;-webkit-overflow-scrolling:touch}',
    '.musst{padding:14px;margin-bottom:12px}',
    '.mustt{max-height:44vh}',
    '.mustx{gap:14px;max-width:none}',
    '.musx{position:fixed;top:12px;right:16px;z-index:2}',
    '.mustx h2{font-size:34px}',
    '.musp{font-size:15.5px}',
    '.musb{width:48px;height:48px}.muspl{height:48px;min-width:112px;padding:0 18px 0 16px}',
    '.musrow{gap:10px}',
    '.mussn{font-size:12.5px}.mussu{display:none}',
    '}',
    /* vetro: e' piccolo, quindi il blur dal vivo qui si puo' (la regola vieta solo le aree grandi). Mother = tondo e vetro */
    '.musm{border-radius:14px;background:rgba(18,18,17,.7);-webkit-backdrop-filter:blur(18px) saturate(1.5);backdrop-filter:blur(18px) saturate(1.5);border-color:rgba(244,242,236,.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 18px 40px -16px rgba(0,0,0,.55)}',
    '.musmb{border-radius:9px}',
    /* telefono: il lettore si nasconde sul lato destro, piu' in alto, e resta fuori solo la linguetta col disco */
    '.musm.side{right:0;bottom:calc(34vh + env(safe-area-inset-bottom,0px));border-right:0;border-radius:14px 0 0 14px;transform:translateX(calc(100% - 48px));transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .3s}',
    '.musm.side.in{transform:translateX(calc(100% - 48px))}',
    '.musm.side.open{right:12px;border-right:1px solid rgba(244,242,236,.2);border-radius:14px;transform:none}',
    '.musm.side .musmd{cursor:pointer}',
    '@media (max-width:420px){.musmt{width:96px}.musmb{width:34px;height:34px}.musm{gap:4px;padding:0 4px 0 8px;height:52px}}',
    '@media (prefers-reduced-motion:reduce){.musbg,.musobj,.musc,.mustx>*,.musm,.musarm,.musvin{transition:none!important}.musrec,.musmd .r,.museq b,.musdisc.sw,.musk::before,.musm.wait .musmt i::before{animation:none!important}}'
  ].join('\n');
  function stile() { if (document.getElementById('mus-css')) return; var s = document.createElement('style'); s.id = 'mus-css'; s.textContent = CSS; document.head.appendChild(s) }

  /* ---------- il giradischi aperto ---------- */
  var box = null, back = null, chiusura = 0;
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e }
  function costruisci() {
    stile();
    box = el('div', 'mus'); box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Record player');
    var vol = ''; for (var i = 1; i <= 6; i++) vol += '<button class="musv" type="button" data-v="' + i + '" aria-label="Volume ' + i + ' of 6"><i></i></button>';
    box.innerHTML = '<div class="musbg" aria-hidden="true"></div><div class="musin">' +
      '<div class="musst"><i class="musc c1"></i><i class="musc c2"></i><i class="musc c3"></i><i class="musc c4"></i><div class="musobj">' + piatto() + '</div></div>' +
      '<div class="mustx">' +
        '<button class="musx" type="button" aria-label="Close"><span class="musxk" aria-hidden="true"><i></i><i></i></span><span class="mo">Esc</span></button>' +
        '<span class="mo musk">Basement hi-fi</span><h2 class="mush"></h2><p class="musp"></p>' +
        '<div class="musctl"><button class="musb" type="button" data-a="prev" aria-label="Previous">' + IC.prev + '</button>' +
          '<button class="muspl" type="button" data-a="toggle"><span class="fl" aria-hidden="true"></span><span class="ic"></span><span class="tx"></span></button>' +
          '<button class="musb" type="button" data-a="next" aria-label="Next">' + IC.next + '</button>' +
          '<button class="musb" type="button" data-a="stop" aria-label="Stop">' + IC.stop + '</button>' +
          '<span class="mo mustime" aria-live="off"></span></div>' +
        '<div class="musvol"><span class="mo">Vol</span>' + vol + '</div>' +
        '<div class="muscr"><span class="mo">The crate &#183; pick one</span><div class="musrow">' + DISCHI.map(copertina).join('') + '</div></div>' +
      '</div></div>';
    document.body.appendChild(box);
    box.querySelector('.musbg').addEventListener('click', chiudi);
    box.querySelector('.musx').addEventListener('click', chiudi);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a],[data-v],.mussl'); if (!b) return;
      if (b.dataset.a) comando(b.dataset.a);
      else if (b.dataset.v) volume(+b.dataset.v / 6);
      else if (b.classList.contains('mussl')) { var i = +b.dataset.i; if (i === S.t && S.st === 'play') return; play(i) }
    });
    box.querySelector('.musdisc').addEventListener('animationend', function () { this.classList.remove('sw') });
    addEventListener('keydown', function (e) {
      if (!box.classList.contains('on')) return;
      if (e.key === 'Escape') chiudi();
      else if (e.key === 'Tab') { /* il fuoco resta dentro */
        var f = [].slice.call(box.querySelectorAll('button')), a = f.indexOf(document.activeElement);
        if (e.shiftKey && a <= 0) { e.preventDefault(); f[f.length - 1].focus() } else if (!e.shiftKey && a === f.length - 1) { e.preventDefault(); f[0].focus() }
      }
    });
  }
  function comando(a) { if (a === 'toggle') toggle(); else if (a === 'prev') salta(-1); else if (a === 'next') salta(1); else if (a === 'stop') stop() }
  function apri(x, y) {
    if (!box) costruisci();
    clearTimeout(chiusura);
    back = document.activeElement;
    box.classList.add('on'); box.classList.remove('in');
    var sr = box.querySelector('.musst').getBoundingClientRect();
    box.style.setProperty('--dx', ((x == null ? sr.left + sr.width / 2 : x) - (sr.left + sr.width / 2)) + 'px');
    box.style.setProperty('--dy', ((y == null ? sr.top + sr.height / 2 : y) - (sr.top + sr.height / 2)) + 'px');
    document.documentElement.classList.add('mus-on');
    aggiorna();
    box.getBoundingClientRect();
    requestAnimationFrame(function () { box.classList.add('in') });
    setTimeout(function () { var f = box.querySelector('.muspl'); if (f) f.focus({ preventScroll: true }) }, 380);
  }
  function chiudi() {
    if (!box || !box.classList.contains('on')) return;
    box.classList.remove('in'); document.documentElement.classList.remove('mus-on');
    clearTimeout(chiusura);
    chiusura = setTimeout(function () { box.classList.remove('on'); aggiorna() }, RM ? 0 : 420);
    if (back && back.focus) try { back.focus({ preventScroll: true }) } catch (x) {}
    setTimeout(aggiorna, RM ? 0 : 200);
  }
  function aperto() { return box && box.classList.contains('on') && box.classList.contains('in') }
  var spiaOn = -1;
  function spia(k) {
    if (!box || S.st !== 'play') return;
    var q = box.querySelectorAll('.mSp');
    if (spiaOn >= 0 && q[spiaOn]) q[spiaOn].classList.remove('on');
    if (q[k]) q[k].classList.add('on'); spiaOn = k;
  }
  function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2) }
  function tempo() {
    var D = DISCHI[S.t], p = posNow();
    if (box && box.classList.contains('on')) {
      box.querySelector('.mustime').textContent = fmt(p) + ' / ' + fmt(D.L);
      /* il braccio scivola verso il centro mentre il disco va avanti */
      box.style.setProperty('--arm', S.st === 'off' ? '0deg' : (28 + 19 * p / D.L).toFixed(2) + 'deg');
    }
  }
  var ultimo = -1;
  function cambio() { if (box && ultimo !== S.t) { var d = box.querySelector('.musdisc'); d.classList.remove('sw'); d.getBoundingClientRect(); if (ultimo >= 0 && !RM) d.classList.add('sw') } ultimo = S.t }
  function aggiorna() {
    var D = DISCHI[S.t], suonando = S.st === 'play';
    if (box) {
      cambio();
      box.classList.toggle('playing', suonando);
      box.style.setProperty('--lab', D.lab);
      box.querySelector('.mush').textContent = D.nome;
      box.querySelector('.musp').textContent = D.sub;
      var tl = D.nome.toUpperCase().split(' '), ts = box.querySelectorAll('.musLn tspan'); ts[0].textContent = tl[0]; ts[1].textContent = tl.slice(1).join(' ');
      var pl = box.querySelector('.muspl');
      pl.querySelector('.ic').innerHTML = suonando ? IC.pause : IC.play;
      pl.querySelector('.tx').textContent = suonando ? 'Pause' : S.st === 'pause' ? 'Resume' : 'Play';
      pl.setAttribute('aria-label', suonando ? 'Pause' : 'Play');
      [].forEach.call(box.querySelectorAll('.mussl'), function (b, i) { b.classList.toggle('on', i === S.t && S.st !== 'off'); b.setAttribute('aria-pressed', i === S.t && S.st !== 'off' ? 'true' : 'false') });
      var n = Math.round(S.vol * 6);
      [].forEach.call(box.querySelectorAll('.musv'), function (b, i) { b.classList.toggle('on', i < n) });
      if (!suonando) [].forEach.call(box.querySelectorAll('.mSp.on'), function (q) { q.classList.remove('on') });
      tempo();
    }
    mini();
  }

  /* ---------- il mini lettore ---------- */
  var mn = null;
  var mt = 0;
  function apriMini() { if (!mn || !mn.classList.contains('side')) return; mn.classList.add('open'); clearTimeout(mt); mt = setTimeout(chiudiMini, 5000) }
  function chiudiMini() { clearTimeout(mt); if (mn) mn.classList.remove('open') }
  function mini() {
    var serve = S.st !== 'off' && !(box && box.classList.contains('on'));
    if (!serve) { if (mn && !mn.hidden) { mn.classList.remove('in'); var m = mn; setTimeout(function () { if (!m.classList.contains('in')) m.hidden = true }, RM ? 0 : 320) } return }
    if (!mn) {
      stile();
      mn = el('div', 'musm'); mn.setAttribute('role', 'region'); mn.setAttribute('aria-label', 'Music player'); mn.hidden = true;
      mn.innerHTML = '<span class="musmd" aria-hidden="true"><svg viewBox="0 0 30 30"><g class="r"><circle cx="15" cy="15" r="14" fill="#0A0A09" stroke="rgba(244,242,236,.55)" stroke-width="1"/><circle cx="15" cy="15" r="10" fill="none" stroke="rgba(244,242,236,.16)"/><circle class="lb" cx="15" cy="15" r="5.5"/><rect x="14" y="2.5" width="2" height="4" fill="rgba(244,242,236,.5)"/></g><circle cx="15" cy="15" r="1.4" fill="#0A0A09"/></svg></span>' +
        '<span class="musmt"><b></b><i></i></span>' +
        '<button class="musmb" type="button" data-a="prev" aria-label="Previous">' + IC.prev + '</button>' +
        '<button class="musmb pp" type="button" data-a="toggle"></button>' +
        '<button class="musmb" type="button" data-a="next" aria-label="Next">' + IC.next + '</button>' +
        '<button class="musmb" type="button" data-a="stop" aria-label="Stop">' + IC.stop + '</button>';
      mn.addEventListener('click', function (e) {
        /* sul telefono il primo tocco tira fuori il lettore; poi i tasti */
        if (mn.classList.contains('side') && !mn.classList.contains('open')) { apriMini(); return }
        var b = e.target.closest('[data-a]'); if (b) { comando(b.dataset.a); apriMini() }
      });
      addEventListener('pointerdown', function (e) { if (mn && mn.classList.contains('open') && !mn.contains(e.target)) chiudiMini() }, true);
      var lato = matchMedia('(max-width:860px)');
      var metti = function () { mn.classList.toggle('side', lato.matches); if (!lato.matches) mn.classList.remove('open') };
      if (lato.addEventListener) lato.addEventListener('change', metti); metti();
      document.body.appendChild(mn);
    }
    var D = DISCHI[S.t], pp = mn.querySelector('.pp');
    mn.classList.toggle('playing', S.st === 'play'); mn.classList.toggle('wait', S.st === 'wait');
    mn.querySelector('.lb').setAttribute('fill', D.lab);
    mn.querySelector('b').textContent = D.nome;
    mn.querySelector('i').textContent = S.st === 'play' ? 'Now playing' : S.st === 'wait' ? 'Tap to resume' : 'Paused';
    pp.innerHTML = S.st === 'play' ? IC.pause : IC.play; pp.setAttribute('aria-label', S.st === 'play' ? 'Pause' : 'Play');
    if (mn.hidden) { mn.hidden = false; mn.getBoundingClientRect(); requestAnimationFrame(function () { mn.classList.add('in') }) } else mn.classList.add('in');
  }

  /* ---------- su ogni pagina: c'era un disco? allora riparte al primo gesto ---------- */
  var GESTI = ['pointerdown', 'pointerup', 'keydown', 'touchend', 'click'];
  function gesto(e) {
    if (S.st !== 'wait') return via();
    /* i tasti del mini lettore decidono da soli */
    if (e.target && e.target.closest && e.target.closest('.musm')) return;
    if (e.type === 'keydown' && (e.key === 'Escape' || e.key === 'Tab')) return;
    if (!contesto()) return;
    var c = ctx; c.resume().then(function () { if (c.state === 'running' && S.st === 'wait') { via(); avvia(S.t, S.pos) } }, function () {});
  }
  function via() { GESTI.forEach(function (g) { removeEventListener(g, gesto, true) }) }
  function riprendi() {
    var j = leggi(); if (!j) return;
    if (j.vol != null && isFinite(j.vol)) S.vol = Math.max(0, Math.min(1, +j.vol));
    if (j.t != null && DISCHI[j.t | 0]) S.t = j.t | 0;
    S.pos = isFinite(j.pos) ? +j.pos : 0;
    if (j.st === 'pause') { S.st = 'pause'; aggiorna(); return }
    if (j.st !== 'play') return;
    S.st = 'wait'; aggiorna();
    GESTI.forEach(function (g) { addEventListener(g, gesto, true) });
  }
  addEventListener('pagehide', function () { if (S.st !== 'off') salva() });
  document.addEventListener('visibilitychange', function () { if (document.hidden && S.st !== 'off') salva() });

  window.MUSICA = {
    open: apri, close: chiudi,
    play: function (i) { if (S.st === 'wait') via(); play(i == null ? null : ((i | 0) % DISCHI.length + DISCHI.length) % DISCHI.length) },
    pause: pausa, toggle: function () { if (S.st === 'wait') via(); toggle() }, stop: function () { via(); stop() },
    next: function () { salta(1) }, prev: function () { salta(-1) }, volume: volume,
    state: function () { return { st: S.st, t: S.t, name: DISCHI[S.t].nome, pos: +posNow().toFixed(2), vol: S.vol, open: !!aperto() } },
    tracks: DISCHI.map(function (D) { return { name: D.nome, sub: D.sub, seconds: +D.L.toFixed(1) } }),
    errors: ERR
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', riprendi); else riprendi();
})();
