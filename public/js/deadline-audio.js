/* DEADLINE · l'audio del gioco: effetti e musica chiptune suonati in codice (WebAudio, niente file). window.DEADLINE_AUDIO.
   Prima di unlock() ogni chiamata e' muta e senza errori; la musica chiesta prima parte allo sblocco.
   Il sequencer gira solo mentre la musica suona (guarda avanti 120 ms, torna ogni 25 ms).

   API
   A.unlock()                      al primo gesto
   A.sfx(name, {pan, vol, mood, boss})
     armi:    shoot (ingranaggio base) · shootAuto (tre a ventaglio) · shootAI (colpo che insegue, sibilo)
     scudo:   shield (si accende) · shieldHit (para un colpo) · shieldBreak
     colpi:   hit · kill · explosion (grossa) · split · blip (no-show sparisce) · paper (fattura strappata)
              ring (chiamata) · review (una stella, "buu") · hurt · cityHit
     premi:   power · pickup (= power) · coin · combo (FLOW STATE) · install (SYSTEM INSTALLED) · deliver (consegna)
     giorno:  clockIn (campanello, "CLOCK IN!") · clockOut · siren (OVERTIME) · night (Night shift: carillon + soffio)
     boss:    bossCard (sting della card; con {boss} suona il suo motivo) · urgent · alarm · rip · bossHit · bossDie
     M8:      m8 ({mood:'happy'|'hurt'|'surprised'}) · m8Happy · m8Hurt · m8Surprised
     schermi: gameOver · win · insertCoin · select · type (iniziali) · typewriter (testo dei dialoghi, molto basso)
   A.sting(boss)                   motivo del boss sulla card: voicemail · replyall · paperjam · urgent · onestar · scaries · monday
   A.music(track, {intensity, flow, boss})
     title · tue · wed · thu · fri · sat · sun · mon (giorno di MONDAY) · boss (tema dei boss) · monday (lotta con MONDAY)
     night · over (una volta) · win (fanfara poi giro) · null = stop.  music('boss', {boss:'monday'}) = 'monday'.
   A.intensity(0..1) · A.flow(on) · A.duck(on) · A.mute(on) · A.muted · A.stopAll() · A.beat() -> {phase, beat, bpm, on}
   A.track() · A.ready · A.tracks · A.sfxNames · A.stings */
(function () {
  if (window.DEADLINE_AUDIO) return;
  var KEY = 'mm-deadline-mute';

  /* ---------- i brani ----------
     sezione: c = accordi per battuta ("basso voci...", "/" = due meta'), m = melodia "nota:sedicesimi" (r = pausa),
     cm = controcanto (cmL = strato), b = basso della sezione (16 o 64 caratteri), nm = senza melodia, f = rullata finale,
     z = bip della sveglia. basso: R radice, 2, m (terza minore), 3, 4, 5, 6, 7 (settima minore), o ottava, l ottava sotto,
     - tiene, . pausa. acc: x accordo, cifre = note dell'accordo (oltre la fine, un'ottava sopra).
     strati: L0 sempre, L1 intensita' > .3, L2 > .65, LF = FLOW STATE. sc = quanto la cassa "schiaccia" pad e basso.
     Il motivo comune (DEADLINE): "tic, tic-tic, salita, discesa" = 1 . 1 1 | b3 5 | 4 - | b3 2. */
  var BR = {
    title: { bpm: 112, up: .12, duty: .25, lv: .08, vib: 14, ech: [3, .3, .24], sc: .3,
      b: 'R-----R-5-----o-', bw: 'tri', bv: .24, a: '..x...x...x..x..', ad: .125, av: .022,
      p: '0123012301230123', pv: .016, cw: 'tri', cv: .05,
      d: { k: 'x.........x.....', s: '....x.......x...', h: '..x...x...x...x.' },
      d1: { h: 'x.x.x.x.x.x.x.x.' }, d2: { k: 'x.....x...x.....', o: '......x.......x.' }, dF: { k: 'x...x...x...x...', c: '....x.......x...' },
      fill: { s: '..........x.x.xx' }, fx: { s: '............x.x.' },
      giro: ['I', 'A', 'A2', 'B', 'A2'],
      parti: {
        I: { c: ['A2 C4 E4 G4', 'F2 A3 C4 E4', 'D2 F3 A3 C4', 'E2 G#3 B3 D4'], nm: 1,
          cm: 'E4:8 C4:8  A3:8 C4:8  F4:8 A4:8  G#4:8 B4:8', cmL: 1 },
        A: { c: ['A2 C4 E4 G4', 'F2 A3 C4 E4', 'D2 F3 A3 C4', 'E2 G#3 B3 D4'],
          m: 'A4:2 r:1 A4:1 C5:2 E5:2 D5:4 C5:2 B4:2  C5:6 A4:2 r:4 E4:2 G4:2  F5:2 r:1 F5:1 E5:2 C5:2 D5:4 A4:4  B4:8 G#4:4 r:4' },
        A2: { c: ['A2 C4 E4 G4', 'F2 A3 C4 E4', 'D2 F3 A3 C4', 'E2 G#3 B3 D4'], f: 1,
          m: 'A4:2 r:1 A4:1 C5:2 E5:2 D5:4 C5:2 B4:2  C5:6 A4:2 r:4 E4:2 G4:2  F5:2 r:1 F5:1 E5:2 C5:2 D5:4 A4:4  B4:4 D5:2 E5:2 G#5:8',
          cm: 'E4:8 C4:8  A3:8 C4:8  F4:8 A4:8  G#4:8 B4:8', cmL: 1 },
        B: { c: ['D2 F3 A3 C4', 'A2 C4 E4 G4', 'F2 A3 C4 E4', 'E2 G#3 B3 D4'], b: 'R.R.5.R.o.R.5.7.',
          m: 'F5:4 E5:2 D5:2 A5:6 G5:2  E5:4 C5:2 A4:2 E5:6 r:2  A4:2 C5:2 F5:2 A5:2 G5:4 F5:2 E5:2  E5:2 r:2 G#5:2 r:2 B5:6 r:2',
          cm: 'A4:8 C5:8  E5:8 C5:4 B4:4  C5:8 A4:8  B4:4 D5:4 E5:8' }
      } },
    /* TUE: notte blu e pioggia, freddo, eco lunga */
    tue: { bpm: 108, up: .3, duty: .125, lv: .078, vib: 18, ech: [3, .34, .28], bed: 'rain', sc: .35,
      b: 'R-------R---5---', bw: 'tri', bv: .24, a: 'x.......x.......', ad: 'pad', av: .018,
      p: '0.1.2.1.0.1.2.3.', pv: .016, cw: 'tri', cv: .05,
      d: { k: 'x.........x.....', s: '....x.......x...', h: '..x...x...x...x.' },
      d1: { h: 'x.xxx.x.x.xxx.x.' }, d2: { k: 'x.....x...x...x.', r: '...x.....x......' }, dF: { k: 'x...x...x...x...', o: '..x...x...x...x.' },
      fill: { s: '........x.x.x.xx' }, fx: { s: '..............x.' },
      giro: ['I', 'A', 'A2', 'B', 'A2'],
      parti: {
        I: { c: ['D2 F3 A3 C4 E4', 'Bb1 D3 F3 A3', 'G2 Bb3 D4 F4', 'A2 C#4 E4 G4'], nm: 1 },
        A: { c: ['D2 F3 A3 C4 E4', 'Bb1 D3 F3 A3', 'G2 Bb3 D4 F4', 'A2 C#4 E4 G4'],
          m: 'D5:2 r:1 D5:1 F5:2 A5:2 G5:4 F5:2 E5:2  F5:6 D5:2 r:4 A4:2 C5:2  Bb4:4 D5:2 G5:2 F5:4 D5:4  E5:8 C#5:4 r:4' },
        A2: { c: ['D2 F3 A3 C4 E4', 'Bb1 D3 F3 A3', 'G2 Bb3 D4 F4', 'A2 C#4 E4 G4'], f: 1,
          m: 'D5:2 r:1 D5:1 F5:2 A5:2 G5:4 F5:2 E5:2  F5:6 D5:2 r:4 A4:2 C5:2  Bb4:4 D5:2 G5:2 F5:4 D5:4  E5:4 F5:2 E5:2 C#5:4 A4:4',
          cm: 'A4:16  F4:16  D4:16  E4:8 C#4:8', cmL: 1 },
        B: { c: ['Bb1 D3 F3 A3', 'C2 E3 G3 C4', 'A2 C4 E4 G4', 'D2 F3 A3 D4'], b: 'R---R-5-o---5-R-',
          m: 'D5:4 F5:4 A5:6 G5:2  E5:4 G5:4 C6:4 Bb5:2 A5:2  A5:6 G5:2 E5:4 C5:4  D5:12 r:4',
          cm: 'F4:8 A4:8  G4:8 E4:8  E4:8 C4:8  F4:8 A4:8' }
      } },
    /* WED: nebbia viola, mezzo tempo, tutto lavato */
    wed: { bpm: 96, sw: .12, up: .3, duty: .5, lv: .07, vib: 22, ech: [6, .38, .3], llp: 1900, bed: 'wind', sc: .25,
      b: 'R-------5-------', bw: 'tri', bv: .25, a: 'x---------------', ad: 'pad', av: .02,
      p: '0..2..1..3..2..1', pv: .016, cw: .125, cv: .03,
      d: { k: 'x.........x.....', s: '........x.......', h: '....x.......x...' },
      d1: { h: '..x...x...x...x.', r: '......x.......x.' }, d2: { k: 'x.....x.x.......', h: 'x.x.x.x.x.x.x.x.' }, dF: { k: 'x...x...x...x...', s: '....x.......x...' },
      fill: { s: '........x...x.x.' },
      giro: ['I', 'A', 'A2', 'B'],
      parti: {
        I: { c: ['E2 G3 B3 D4 F#4', 'A2 C#4 E4 G4', 'C2 G3 B3 E4', 'B1 F#3 A3 D4'], nm: 1 },
        A: { c: ['E2 G3 B3 D4 F#4', 'A2 C#4 E4 G4', 'C2 G3 B3 E4', 'B1 F#3 A3 D4'], b: 'R-------5---R-o-',
          m: 'E5:2 r:1 E5:1 G5:2 B5:2 A5:4 G5:2 F#5:2  E5:8 r:4 C#5:2 D5:2  E5:4 G5:4 B5:6 A5:2  F#5:12 r:4' },
        A2: { c: ['E2 G3 B3 D4 F#4', 'A2 C#4 E4 G4', 'C2 G3 B3 E4', 'B1 F#3 A3 D4'], b: 'R-------5---R-o-',
          m: 'E5:2 r:1 E5:1 G5:2 B5:2 A5:4 G5:2 F#5:2  E5:8 r:4 C#5:2 D5:2  E5:4 G5:4 B5:6 A5:2  F#5:4 A5:4 B5:4 D6:4' },
        B: { c: ['C2 G3 B3 E4', 'D2 F#3 A3 D4', 'E2 G3 B3 D4', 'E2 G3 B3 D4'], f: 1,
          m: 'G5:6 E5:2 B4:4 C5:4  A5:6 F#5:2 D5:4 A4:4  B4:4 E5:4 G5:4 F#5:2 E5:2  E5:16',
          cm: 'E4:16  F#4:16  G4:8 B4:8  B4:16' }
      } },
    /* THU: smog verde acido, basso acido a sedicesimi, frigio */
    thu: { bpm: 120, up: .3, duty: .25, lv: .08, vib: 10, ech: [3, .28, .2], sc: .25,
      b: 'RRo.R5.oR.7oR.5R', bw: 'acid', bv: .15, a: '....x.......x...', ad: .25, av: .02,
      p: '0.2.1.3.0.2.1.3.', pv: .014, cw: .25, cv: .03,
      d: { k: 'x...x...x...x...', s: '....x.......x...', h: '..x...x...x...x.' },
      d1: { h: 'xxx.xxx.xxx.xxx.' }, d2: { c: '....x.......x..x', o: '..x...x...x...x.' }, dF: { k: 'x...x...x...x.x.', r: 'x..x..x..x..x...' },
      fill: { s: '....x...x.x.xxxx' }, fx: { s: '............xx.x' },
      giro: ['I', 'A', 'B', 'A'],
      parti: {
        I: { c: ['G1 Bb3 D4 G4', 'Ab1 C4 Eb4 G4', 'G1 Bb3 D4 G4', 'F1 A3 C4 F4'], nm: 1 },
        A: { c: ['G1 Bb3 D4 G4', 'Ab1 C4 Eb4 G4', 'G1 Bb3 D4 G4', 'F1 A3 C4 F4'],
          m: 'G4:2 r:1 G4:1 Bb4:2 D5:2 C5:4 Bb4:2 Ab4:2  G4:6 Eb4:2 r:4 C5:2 Eb5:2  D5:2 r:1 D5:1 F5:2 G5:2 F5:4 D5:2 C5:2  C5:8 A4:4 r:4' },
        B: { c: ['Eb2 G3 Bb3 D4', 'F1 A3 C4 F4', 'G1 Bb3 D4 G4', 'Ab1 C4 Eb4 G4'], f: 1,
          m: 'Bb5:4 G5:2 Eb5:2 Bb4:4 Eb5:4  C5:4 F5:2 A5:2 C6:6 A5:2  G5:2 D5:2 Bb4:2 G4:2 D5:2 G5:2 Bb5:4  Ab5:8 G5:4 r:4',
          cm: 'G4:2 r:6 Bb4:2 r:6  A4:2 r:6 C5:2 r:6  D5:2 r:6 Bb4:2 r:6  C5:2 r:6 Eb5:2 r:6' }
      } },
    /* FRI: festa, cassa dritta, basso a ottave */
    fri: { bpm: 138, up: .22, duty: .25, lv: .072, vib: 10, ech: [3, .25, .18], sc: .45,
      b: 'l.o.l.o.l.o.l.o.', bw: 'tri', bv: .22, a: '..x...x...x...x.', ad: .25, av: .022,
      p: '0123012301230123', pv: .015, cw: .125, cv: .03,
      d: { k: 'x...x...x...x...', c: '....x.......x...', o: '..x...x...x...x.' },
      d1: { h: 'xxxxxxxxxxxxxxxx' }, d2: { s: '.......x.......x', r: 'x..x..x...x..x..' }, dF: { k: 'x...x...x...x.xx', c: '....x..x....x...' },
      fill: { s: '....x...x.x.xxxx' }, fx: { s: '............x.xx' },
      giro: ['I', 'A', 'A2', 'B', 'A2'],
      parti: {
        I: { c: ['C2 E4 G4 C5', 'A1 C4 E4 A4', 'F1 C4 F4 A4', 'G1 D4 G4 B4'], nm: 1 },
        A: { c: ['C2 E4 G4 C5', 'A1 C4 E4 A4', 'F1 C4 F4 A4', 'G1 D4 G4 B4'],
          m: 'C5:2 r:1 C5:1 E5:2 G5:2 F5:4 E5:2 D5:2  E5:2 C5:2 A4:2 C5:2 E5:4 A5:4  F5:2 r:1 F5:1 A5:2 C6:2 Bb5:4 A5:2 G5:2  G5:4 D5:2 B4:2 D5:2 G5:2 B5:4' },
        A2: { c: ['C2 E4 G4 C5', 'A1 C4 E4 A4', 'F1 C4 F4 A4', 'G1 D4 G4 B4'], f: 1,
          m: 'C5:2 r:1 C5:1 E5:2 G5:2 F5:4 E5:2 D5:2  E5:2 C5:2 A4:2 C5:2 E5:4 A5:4  F5:2 r:1 F5:1 A5:2 C6:2 Bb5:4 A5:2 G5:2  G5:2 A5:2 B5:2 D6:2 C6:8',
          cm: 'G4:4 E4:4 G4:4 C5:4  E4:4 C4:4 E4:4 A4:4  F4:4 A4:4 C5:4 A4:4  G4:4 B4:4 D5:4 B4:4', cmL: 1 },
        B: { c: ['F1 C4 F4 A4', 'G1 D4 G4 B4', 'E2 E4 G4 B4', 'A1 C4 E4 A4'], b: 'l.o.l.o.5.o.l.7.',
          m: 'A5:4 C6:4 A5:2 G5:2 F5:4  G5:4 B5:4 D6:4 B5:4  E5:2 G5:2 B5:2 G5:2 E5:4 B4:4  C5:2 E5:2 A5:2 C6:2 A5:4 E5:4',
          cm: 'C5:8 A4:8  B4:8 D5:8  G4:8 B4:8  A4:8 C5:8' }
      } },
    /* SAT: tramonto caldo, settime, un po' di swing */
    sat: { bpm: 100, sw: .3, up: .3, duty: .5, lv: .085, vib: 16, ech: [3, .3, .24], llp: 3200, sc: .3,
      b: 'R..5..R.o..5.6..', bw: 'tri', bv: .28, a: '..x.....x..x....', ad: .125, av: .022,
      p: '0.1.2.3.2.1.0.1.', pv: .015, cw: 'tri', cv: .05,
      d: { k: 'x......x..x.....', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
      d1: { r: '...x.....x...x..' }, d2: { h: 'xxxxxxxxxxxxxxxx', k: 'x......x..x...x.' }, dF: { k: 'x...x...x...x...', c: '....x.......x...' },
      fill: { s: '..........x.x.xx' }, fx: { r: '.............x.x' },
      giro: ['I', 'A', 'B', 'A'],
      parti: {
        I: { c: ['F2 C4 E4 G4', 'E2 G3 B3 D4 / A2 G3 C#4 E4', 'D2 F3 A3 C4', 'Bb1 A3 D4 F4 / C2 Bb3 E4 G4'], nm: 1 },
        A: { c: ['F2 C4 E4 G4', 'E2 G3 B3 D4 / A2 G3 C#4 E4', 'D2 F3 A3 C4', 'Bb1 A3 D4 F4 / C2 Bb3 E4 G4'],
          m: 'F4:2 r:1 F4:1 A4:2 C5:2 Bb4:4 A4:2 G4:2  G4:6 E4:2 r:2 E4:2 G4:2 C#5:2  D5:4 F5:2 A5:2 G5:4 F5:2 E5:2  D5:8 C5:4 r:4' },
        B: { c: ['Bb1 A3 D4 F4', 'A1 G3 C4 E4', 'G1 F3 Bb3 D4', 'C2 Bb3 E4 G4'], f: 1,
          m: 'D5:4 F5:4 A5:4 G5:4  E5:6 C5:2 A4:4 C5:4  Bb4:4 D5:2 F5:2 A5:6 G5:2  E5:4 G5:4 C5:8',
          cm: 'F4:8 A4:8  E4:8 G4:8  D4:8 F4:8  E4:8 Bb4:8' }
      } },
    /* SUN: alba, quasi silenzio, pad lunghi */
    sun: { bpm: 72, up: .1, duty: 'tri', lv: .07, vib: 12, ech: [6, .4, .3], sc: 0,
      b: 'R---------------', bw: 'tri', bv: .16, a: 'x---------------', ad: 'pad', av: .024,
      p: '0...1...2...3...', pv: .012, po: 24, cw: 'tri', cv: .035,
      d: {}, d1: { h: '........x.......' }, d2: { k: 'x...............', h: '....x.......x...' }, dF: { k: 'x.......x.......', h: '..x...x...x...x.' },
      giro: ['A', 'I', 'A2', 'I'],
      parti: {
        I: { c: ['C2 E3 G3 B3', 'F2 A3 C4 E4', 'A1 C3 E3 G3 B3', 'G1 C3 D3 G3'], nm: 1, cm: 'G4:32 E4:32', cmL: 1 },
        A: { c: ['C2 E3 G3 B3', 'F2 A3 C4 E4', 'A1 C3 E3 G3 B3', 'G1 C3 D3 G3'],
          m: 'C5:4 r:2 C5:2 E5:4 G5:4  F5:12 r:4  r:8 E5:4 D5:4  D5:16' },
        A2: { c: ['C2 E3 G3 B3', 'F2 A3 C4 E4', 'A1 C3 E3 G3 B3', 'G1 C3 D3 G3'],
          m: 'C5:4 r:2 C5:2 E5:4 G5:4  A5:12 r:4  r:8 B4:4 C5:4  D5:16' }
      } },
    /* BOSS: il tema dei boss, un riff che resta in testa (si minore, seconda bemolle nel ponte) */
    boss: { bpm: 140, up: .15, duty: .25, lv: .078, vib: 8, ech: [3, .22, .16], sc: .4,
      b: 'R.RoR.RoR.RoR.Ro', bw: 'sq', bv: .11, a: '..x...x...x...x.', ad: .125, av: .018,
      p: '0.1.2.1.0.1.2.1.', pv: .014, cw: .5, cv: .028,
      d: { k: 'x.....x.x.......', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
      d1: { h: 'xxxxxxxxxxxxxxxx' }, d2: { k: 'x.x...x.x.x.....', t: '............x.x.' }, dF: { k: 'x...x...x...x...', c: '....x.......x...' },
      fill: { s: '........x.x.xxxx', t: '....x.x.........' }, fx: { s: '.............xxx' },
      giro: ['I', 'A', 'A2', 'B', 'A2'],
      parti: {
        I: { c: ['B1 D4 F#4 B4', 'G1 D4 G4 B4', 'B1 D4 F#4 B4', 'F#1 A#3 C#4 E4'], nm: 1, f: 1,
          cm: 'B3:2 r:2 B3:2 r:2 D4:2 r:2 F#4:4  B3:2 r:2 B3:2 r:2 D4:2 r:2 G4:4  B3:2 r:2 B3:2 r:2 D4:2 r:2 F#4:4  A#3:4 C#4:4 E4:4 F#4:4' },
        A: { c: ['B1 D4 F#4 B4', 'G1 D4 G4 B4', 'B1 D4 F#4 B4', 'F#1 A#3 C#4 E4'],
          m: 'B4:2 B5:1 B4:1 A5:2 B4:2 G5:2 F#5:2 D5:2 E5:2  B4:2 B5:1 B4:1 A5:2 B4:2 G5:2 D6:2 B5:4  B4:2 B5:1 B4:1 A5:2 B4:2 G5:2 F#5:2 D5:2 E5:2  A#5:2 F#5:2 C#6:2 A#5:2 F#5:4 C#5:4' },
        A2: { c: ['B1 D4 F#4 B4', 'G1 D4 G4 B4', 'B1 D4 F#4 B4', 'F#1 A#3 C#4 E4'], f: 1,
          m: 'B4:2 B5:1 B4:1 A5:2 B4:2 G5:2 F#5:2 D5:2 E5:2  B4:2 B5:1 B4:1 A5:2 B4:2 G5:2 D6:2 B5:4  B4:2 B5:1 B4:1 A5:2 B4:2 G5:2 F#5:2 D5:2 E5:2  F#5:2 r:2 F#5:2 r:2 C#6:2 A#5:2 F#5:2 E5:2',
          cm: 'F#4:8 D4:8  G4:8 B4:8  F#4:8 D4:8  E4:8 C#4:8', cmL: 1 },
        B: { c: ['E2 G4 B4 E5', 'F#1 A#3 C#4 E4', 'G1 B3 D4 G4', 'F#1 A#3 C#4 E4'], b: 'RRo.RRo.RRo.R.o.',
          m: 'E5:6 G5:2 B5:4 A5:2 G5:2  F#5:6 A#5:2 C#6:4 E6:4  D6:6 B5:2 G5:4 F#5:2 E5:2  F#5:12 r:4',
          cm: 'B4:8 G4:8  A#4:8 C#5:8  B4:8 D5:8  C#5:8 A#4:8' }
      } },
    /* MONDAY (la lotta): marcia epica in re minore, poi la parte buffa con la sveglia e il trombone triste */
    monday: { bpm: 144, up: .12, duty: .25, lv: .078, vib: 12, ech: [3, .22, .16], sc: .35,
      b: 'R.R.R.R.5.5.R.o.', bw: 'sq', bv: .11, a: '..x...x...x...x.', ad: .125, av: .02,
      z: 'x.x.............', zn: ['E6', 'C6'], zv: .026,
      p: '0123012301230123', pv: .013, cw: .5, cv: .03,
      d: { k: 'x...x...x...x...', s: '....x.......x..x', h: '..x...x...x...x.' },
      d1: { h: 'x.xxx.xxx.xxx.xx' }, d2: { t: '..........x.x.x.', o: '......x.......x.' }, dF: { c: '....x.......x...', k: 'x...x...x...x.x.' },
      fill: { s: 'x.x.x.x.xxxxxxxx' }, fx: { s: '............xxxx' },
      giro: ['I', 'A', 'F', 'B', 'F2'],
      parti: {
        I: { c: ['D2 F4 A4 D5', 'Bb1 F4 Bb4 D5', 'G1 Bb3 D4 G4', 'A1 C#4 E4 A4'], nm: 1, f: 1, z: 1, b: 'R...R...R...R.R.',
          cm: 'D4:16  D4:16  D4:16  C#4:16' },
        A: { c: ['D2 F4 A4 D5', 'A1 E4 A4 C#5', 'Bb1 F4 Bb4 D5', 'A1 E4 A4 C#5'],
          m: 'D5:4 A4:2 D5:2 F5:4 E5:2 D5:2  C#5:4 A4:4 E5:4 A5:4  Bb5:4 A5:2 G5:2 F5:4 E5:2 D5:2  E5:2 F5:2 E5:2 D5:2 C#5:4 A4:4',
          cm: 'D4:8 F4:8  E4:8 C#4:8  D4:8 F4:8  E4:8 C#4:8' },
        F: { c: ['D2 F4 A4 D5', 'G1 Bb3 D4 G4', 'Bb1 D4 F4 Bb4', 'A1 C#4 E4 G4'], z: 1, b: 'R...5...R...5...',
          m: 'D5:2 D5:2 r:2 D5:2 F5:2 r:2 A5:4  G5:2 r:2 G5:2 F5:2 E5:4 D5:4  A4:4 G#4:4 G4:4 F#4:4  E4:8 r:4 A4:2 C#5:2' },
        B: { c: ['G1 Bb3 D4 G4', 'A1 C#4 E4 A4', 'F1 A3 C4 F4', 'A1 C#4 E4 G4'], f: 1,
          m: 'G5:4 Bb5:4 D6:6 C6:2  C#6:4 E6:4 A5:8  F5:4 A5:4 C6:4 F6:4  E6:2 D6:2 C#6:2 Bb5:2 A5:4 E5:4',
          cm: 'D5:8 G4:8  E4:8 C#5:8  C5:8 A4:8  G4:8 E4:8' },
        F2: { c: ['D2 F4 A4 D5', 'G1 Bb3 D4 G4', 'Bb1 D4 F4 Bb4', 'A1 C#4 E4 G4'], z: 1, b: 'R...5...R...5...', f: 1,
          m: 'D5:2 D5:2 r:2 D5:2 F5:2 r:2 A5:4  G5:2 r:2 G5:2 F5:2 E5:4 D5:4  A4:4 G#4:4 G4:4 F#4:4  A4:2 r:2 A4:2 r:2 D5:8' }
      } },
    /* MON: il giorno di MONDAY, la sveglia guida tutto */
    mon: { bpm: 150, up: .15, duty: .25, lv: .07, vib: 8, ech: [3, .2, .14], sc: .35,
      b: 'R.o.R.o.R.o.R.o.', bw: 'sq', bv: .11, a: '..x...x...x...x.', ad: .125, av: .018,
      z: 'x.x.....x.x.....', zn: ['E6', 'C6'], zv: .026, zAll: 1,
      p: '0123012301230123', pv: .013, cw: .125, cv: .028,
      d: { k: 'x...x...x...x...', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
      d1: { h: 'xxxxxxxxxxxxxxxx' }, d2: { k: 'x...x...x...x.x.', t: '..........x.x.x.' }, dF: { c: '....x.......x..x', o: '..x...x...x...x.' },
      fill: { s: '....x...xxxxxxxx' }, fx: { s: '............x.xx' },
      giro: ['A', 'B'],
      parti: {
        A: { c: ['D2 F4 A4 D5', 'D2 F4 A4 D5', 'Bb1 D4 F4 Bb4', 'A1 C#4 E4 G4'],
          m: 'D5:2 r:1 D5:1 F5:2 A5:2 G5:4 F5:2 E5:2  D5:2 A4:2 D5:2 F5:2 A5:4 D6:4  F5:2 r:1 F5:1 Bb5:2 D6:2 C6:4 Bb5:2 A5:2  A5:2 G5:2 E5:2 C#5:2 E5:2 G5:2 A5:4' },
        B: { c: ['G1 Bb3 D4 G4', 'A1 C#4 E4 G4', 'D2 F4 A4 D5', 'A1 C#4 E4 G4'], f: 1,
          m: 'G5:4 Bb5:4 D6:4 Bb5:4  A5:4 C#6:4 E6:4 C#6:4  D6:2 C6:2 A5:2 F5:2 D5:2 F5:2 A5:4  A5:2 r:2 A5:2 r:2 C#6:2 r:2 E6:4',
          cm: 'D4:8 G4:8  E4:8 C#4:8  F4:8 A4:8  E4:8 C#4:8' }
      } },
    /* NIGHT SHIFT: sogno blu, eco lunghissima, attacca subito */
    night: { bpm: 84, up: 0, duty: 'tri', lv: .085, vib: 16, ech: [3, .45, .34], sc: 0,
      b: 'R-------5-------', bw: 'tri', bv: .2, a: 'x---------------', ad: 'pad', av: .022,
      p: '0123432101234321', pv: .02, pL: 0, po: 12,
      d: { h: '....x.......x...' }, d1: {}, d2: {}, dF: { k: 'x.......x.......' },
      giro: ['A', 'A2'],
      parti: {
        A: { c: ['F2 A3 C4 E4 G4', 'G2 B3 D4 E4', 'E2 G3 B3 D4', 'A1 C4 E4 G4 B4'],
          m: 'A4:2 r:1 A4:1 C5:2 E5:2 D5:4 C5:2 B4:2  B4:6 G4:2 r:4 D5:2 E5:2  G5:4 E5:2 B4:2 D5:4 B4:4  C5:4 B4:4 A4:8' },
        A2: { c: ['F2 A3 C4 E4 G4', 'G2 B3 D4 E4', 'E2 G3 B3 D4', 'A1 C4 E4 G4 B4'],
          m: 'A4:2 r:1 A4:1 C5:2 E5:2 D5:4 C5:2 B4:2  B4:6 G4:2 r:4 D5:2 E5:2  G5:4 E5:2 B4:2 D5:4 B4:4  C5:2 E5:2 G5:2 B5:2 A5:8' }
      } },
    /* GAME OVER: tre battute, una volta sola */
    over: { bpm: 108, up: 0, duty: .25, lv: .085, vib: 18, ech: [3, .3, .24], once: 1, sc: 0,
      b: 'R-------R-------', bw: 'tri', bv: .24, a: 'x-------x-------', ad: .125, av: .022, d: {},
      giro: ['O'],
      parti: { O: { c: ['A2 C4 E4 A4', 'E2 B3 D4 G#4', 'A1 C4 E4 A4'],
        m: 'E5:2 r:1 E5:1 D5:2 C5:2 B4:4 A4:2 G#4:2  A4:2 B4:2 G#4:4 E4:4 r:4  A4:12 r:4' } } },
    /* WIN: fanfara una volta, poi un giro calmo che continua */
    win: { bpm: 126, up: 0, duty: .25, lv: .08, vib: 14, ech: [3, .3, .22], loopFrom: 1, sc: .25,
      b: 'R.R.5.R.R.R.5.o.', bw: 'tri', bv: .22, a: '..x...x...x...x.', ad: .25, av: .02,
      p: '0123012301230123', pv: .014, pL: 0, cw: 'tri', cv: .045,
      d: { k: 'x.......x.......', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' }, fill: { s: '........x.x.xxxx' },
      giro: ['F', 'L', 'L2'],
      parti: {
        F: { c: ['C2 E4 G4 C5', 'F2 F4 A4 C5', 'G2 G4 B4 D5', 'C2 E4 G4 C5'], f: 1,
          m: 'C5:2 r:1 C5:1 E5:2 G5:2 F5:4 E5:2 D5:2  A5:4 F5:2 A5:2 C6:8  B5:2 A5:2 G5:2 F5:2 D5:4 B4:4  C6:12 r:4',
          cm: 'E4:8 G4:8  F4:8 A4:8  D4:8 G4:8  E4:12 r:4' },
        L: { c: ['C2 E4 G4 B4', 'A1 C4 E4 G4', 'F1 A3 C4 E4', 'G1 B3 D4 F4'],
          m: 'E5:6 G5:2 r:4 E5:2 D5:2  C5:6 E5:2 A4:8  A4:2 C5:2 F5:2 A5:2 G5:4 E5:4  D5:8 r:8' },
        L2: { c: ['C2 E4 G4 B4', 'A1 C4 E4 G4', 'F1 A3 C4 E4', 'G1 B3 D4 F4'], f: 1,
          m: 'E5:6 G5:2 r:4 E5:2 D5:2  C5:6 E5:2 A4:8  A4:2 C5:2 F5:2 A5:2 C6:4 B5:4  G5:8 r:8',
          cm: 'G4:8 E4:8  E4:8 C4:8  C4:8 A4:8  B4:8 D5:8' }
      } }
  };

  /* ---------- dal foglio agli eventi (una volta sola, all'avvio) ---------- */
  var SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }, OFF = { R: 0, 2: 2, m: 3, 3: 4, 4: 5, 5: 7, 6: 9, 7: 10, o: 12, l: -12 };
  var ERR = [];
  function midi(s) { var m = /^([A-G])([#b]?)(\d)$/.exec(s); if (!m) { ERR.push('nota ' + s); return 60 } return 12 * (+m[3] + 1) + SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) }
  function hz(n) { return 440 * Math.pow(2, (n - 69) / 12) }
  function lungo(p, i) { var l = 1; while (p[i + l] === '-') l++; return l }
  function linea(ev, base, str, bars, canale, L, nome, sez) {
    var pos = 0, tk = str.trim().split(/\s+/);
    for (var q = 0; q < tk.length; q++) {
      var pz = tk[q].split(':'), l = +pz[1];
      if (pz[0] !== 'r' && pos < bars * 16) ev[base + pos].push({ c: canale, n: midi(pz[0]), l: l, v: pos % 16 === 0 ? 1 : .85, L: L });
      pos += l;
    }
    if (pos !== bars * 16) ERR.push(nome + ' ' + sez + ' ' + canale + ' ' + pos);
  }
  var DK = ['k', 's', 'h', 'o', 'c', 'r', 't'];
  function monta(nome) {
    var D = BR[nome], ev = [], starts = [], N = 0, zc = 0;
    D.nome = nome; D.sw = D.sw || 0;
    for (var si = 0; si < D.giro.length; si++) {
      var S = D.parti[D.giro[si]], bars = S.c.length, base = N, bp = S.b || D.b;
      starts.push(base);
      for (var i = 0; i < bars * 16; i++) ev.push([]);
      N += bars * 16;
      for (var b = 0; b < bars; b++) {
        var mezzi = S.c[b].split('/').map(function (c) { return c.trim().split(/\s+/).map(midi) });
        var ultima = b === bars - 1 && S.f, mezza = b === 1 && D.fx;
        for (var st = 0; st < 16; st++) {
          var ch = mezzi[st < 8 ? 0 : mezzi.length - 1], E = ev[base + b * 16 + st], v = ch.slice(1), c, k, j;
          var bi = (b * 16 + st) % bp.length, bseg = bp.length === 16 ? bp : bp.slice(b * 16 % bp.length, b * 16 % bp.length + 16);
          c = bp[bi]; if (c in OFF) E.push({ c: 'b', n: ch[0] + OFF[c], l: lungo(bseg, st), v: 1, L: 0 });
          c = D.a[st]; if (c === 'x') E.push({ c: 'a', n: v, l: lungo(D.a, st), v: 1, L: 0 });
          else if (c >= '0' && c <= '9') E.push({ c: 'a', n: [v[c % v.length] + 12 * Math.floor(c / v.length)], l: 1, v: 1, L: 0 });
          if (D.p) { c = D.p[st]; if (c >= '0' && c <= '9') E.push({ c: 'p', n: v[c % v.length] + 12 * Math.floor(c / v.length) + (D.po || 12), l: 1, v: st % 4 === 0 ? 1 : .7, L: D.pL == null ? 1 : D.pL }) }
          if (D.z && (D.zAll || S.z)) { c = D.z[st]; if (c === 'x') E.push({ c: 'z', n: midi(D.zn[zc++ % D.zn.length]), l: 1, v: 1, L: 0 }) }
          var strati = [D.d, D.d1, D.d2, D.dF];
          for (var L = 0; L < 4; L++) {
            var pat = strati[L]; if (!pat) continue;
            for (j = 0; j < DK.length; j++) {
              k = DK[j];
              var p = pat[k];
              if (L === 0 && ultima && D.fill && D.fill[k]) p = D.fill[k];
              else if (L === 0 && mezza && D.fx[k]) p = D.fx[k];
              if (S.nd && L === 0) p = null;
              /* lo stesso colpo gia' presente in uno strato sotto non si raddoppia */
              if (p && p[st] === 'x' && !E.some(function (x) { return x.c === k })) E.push({ c: k, v: st % 4 === 0 ? 1 : st % 2 ? .55 : .75, L: L });
            }
          }
        }
      }
      if (S.m) linea(ev, base, S.m, bars, 'm', 0, nome, D.giro[si]);
      if (S.cm) linea(ev, base, S.cm, bars, 'n', S.cmL || 0, nome, D.giro[si]);
    }
    D.ev = ev; D.N = N; D.starts = starts;
    D.loopAt = D.loopFrom ? starts[D.loopFrom] : 0;
    D.sec = N * 60 / D.bpm / 4;
  }
  for (var nb in BR) monta(nb);

  /* ---------- il motore: tutto lo stato del suono sta in E (cosi' si puo' rendere anche offline) ---------- */
  var E = null, want = null, muted = false;
  try { muted = localStorage.getItem(KEY) === '1' } catch (x) {}
  var MIX = { master: .5, music: .39, sfx: 1.75 };
  function costruisci(ctx) {
    var e = { ctx: ctx, onde: {}, voci: [], last: {}, sess: null, timer: 0, rr: 0 };
    e.comp = ctx.createDynamicsCompressor();
    e.comp.threshold.value = -12; e.comp.knee.value = 6; e.comp.ratio.value = 4; e.comp.attack.value = .003; e.comp.release.value = .18;
    e.mute = ctx.createGain(); e.mute.gain.value = muted ? 0 : 1;
    e.mix = ctx.createGain(); e.mix.gain.value = MIX.master;
    /* l'ultima rete: una saturazione morbida che non lascia mai arrivare a 0 dB */
    e.clip = ctx.createWaveShaper(); e.clip.curve = curvaMorbida(); e.clip.oversample = '2x';
    e.mix.connect(e.comp); e.comp.connect(e.clip); e.clip.connect(e.mute); e.mute.connect(ctx.destination);
    /* musica: bus, filtro della pausa, volume della pausa */
    e.mus = ctx.createGain(); e.mus.gain.value = MIX.music;
    e.dlp = ctx.createBiquadFilter(); e.dlp.type = 'lowpass'; e.dlp.frequency.value = 11000; e.dlp.Q.value = .5;
    e.dg = ctx.createGain(); e.dg.gain.value = ducked ? .3 : 1;
    e.mus.connect(e.dlp); e.dlp.connect(e.dg); e.dg.connect(e.mix);
    nuovoSfx(e);
    [.125, .25, .5].forEach(function (d) {
      var n = 32, re = new Float32Array(n), im = new Float32Array(n);
      for (var i = 1; i < n; i++) re[i] = 2 * Math.sin(Math.PI * i * d) / (Math.PI * i);
      e.onde[d] = ctx.createPeriodicWave(re, im);
    });
    e.rumore = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    var r = e.rumore.getChannelData(0); for (var i = 0; i < r.length; i++) r[i] = Math.random() * 2 - 1;
    return e;
  }
  var CURVA = null;
  function curvaMorbida() {
    if (CURVA) return CURVA;
    var n = 2048, c = new Float32Array(n), k = .6;
    for (var i = 0; i < n; i++) { var x = i / (n - 1) * 2 - 1, a = Math.abs(x); c[i] = a <= k ? x : (x > 0 ? 1 : -1) * (k + (1 - k) * Math.tanh((a - k) / (1 - k)) * .92) }
    return (CURVA = c);
  }
  function nuovoSfx(e) { e.sfx = e.ctx.createGain(); e.sfx.gain.value = MIX.sfx; e.sfx.connect(e.mix) }
  function ora() { return E.ctx.currentTime }

  /* ---------- i mattoni del suono ---------- */
  function onda(os, w) { if (typeof w === 'number') os.setPeriodicWave(E.onde[w]); else os.type = w === 'tri' ? 'triangle' : w === 'saw' ? 'sawtooth' : w }
  /* nota con inviluppo: attacco, decadimento verso sus, rilascio dopo dur */
  function nota(w, f, t, dur, v, out, a, sus, dec, rel, vib) {
    var c = E.ctx, os = c.createOscillator(), g = c.createGain();
    onda(os, w); os.frequency.value = f; os.frequency.setValueAtTime(f, t);
    a = a || .005; rel = rel || .03;
    g.gain.value = 0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a);
    g.gain.setTargetAtTime(v * (sus == null ? .6 : sus), t + a, dec || .12);
    g.gain.setTargetAtTime(0, t + Math.max(a, dur), rel);
    if (vib && dur > .3) {
      var lf = c.createOscillator(), lg = c.createGain(); lf.frequency.value = 5.5;
      lg.gain.value = 0; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(vib, t + Math.min(.35, dur));
      lf.connect(lg); lg.connect(os.detune); lf.start(t); lf.stop(t + dur + rel * 6);
    }
    os.connect(g); g.connect(out); os.start(t); os.stop(t + Math.max(a, dur) + rel * 6);
    return os;
  }
  /* glissato: frequenza da f0 a f1 in dur, volume che scende */
  function gliss(w, f0, f1, t, dur, v, out, a, curva) {
    var c = E.ctx, os = c.createOscillator(), g = c.createGain();
    onda(os, w); os.frequency.value = f0; os.frequency.setValueAtTime(f0, t);
    if (curva === 'lin') os.frequency.linearRampToValueAtTime(f1, t + dur); else os.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    a = a || .003;
    g.gain.value = 0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    os.connect(g); g.connect(out); os.start(t); os.stop(t + dur + .02);
    return os;
  }
  /* rumore filtrato, con il filtro che puo' scorrere */
  function soffio(t, dur, v, out, tipo, f0, f1, q, a) {
    var c = E.ctx, s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
    s.buffer = E.rumore; fl.type = tipo; fl.Q.value = q || .7;
    fl.frequency.value = f0; fl.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) fl.frequency.exponentialRampToValueAtTime(f1, t + dur);
    a = a || .002;
    g.gain.value = 0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    s.connect(fl); fl.connect(g); g.connect(out); s.start(t, Math.random() * 1.5); s.stop(t + dur + .02);
    return s;
  }
  /* campanella: fondamentale e parziale inarmonico */
  function campana(f, t, dur, v, out) { nota('sine', f, t, dur, v, out, .002, .35, dur * .35, dur * .3); nota('sine', f * 2.76, t, dur * .4, v * .25, out, .002, .2, dur * .12, dur * .1) }
  function panner(pan, out) {
    var c = E.ctx; if (!c.createStereoPanner) return out;
    var p = c.createStereoPanner(); p.pan.value = pan; p.connect(out); return p;
  }

  /* ---------- la sessione di un brano ---------- */
  function apriSessione(D, t) {
    var c = E.ctx, s = { D: D, step: 0, next: t, inten: want ? want.intensity : 0, tmul: 1, lv: [1, 0, 0, 0], beatT: new Float64Array(32), beatS: new Int32Array(32), bi: 0, done: false, off: !!E.off };
    s.g = c.createGain(); s.g.gain.value = 0; s.g.gain.setValueAtTime(0, t); s.g.gain.linearRampToValueAtTime(1, t + .08); s.g.connect(E.mus);
    /* la pompa: pad, accompagnamento e basso passano qui e si abbassano a ogni cassa */
    s.pump = c.createGain(); s.pump.connect(s.g);
    s.lead = c.createGain(); s.lead.connect(s.g);
    s.pl = panner(-.32, s.g); s.pr = panner(.35, s.pump);
    var sd = 60 / D.bpm / 4;
    s.dl = c.createDelay(2); s.fb = c.createGain(); s.wet = c.createGain(); s.dlf = c.createBiquadFilter();
    s.dl.delayTime.value = sd * D.ech[0]; s.fb.gain.value = D.ech[1]; s.wet.gain.value = D.ech[2]; s.dlf.type = 'lowpass'; s.dlf.frequency.value = 2600;
    s.lead.connect(s.dl); s.dl.connect(s.dlf); s.dlf.connect(s.fb); s.fb.connect(s.dl);
    s.wet.connect(panner(.25, s.g)); s.dlf.connect(s.wet);
    if (D.llp) { s.lf = c.createBiquadFilter(); s.lf.type = 'lowpass'; s.lf.frequency.value = D.llp; s.lf.connect(s.lead); s.lin = s.lf } else s.lin = s.lead;
    /* il letto: pioggia o vento, un rumore in loop molto basso */
    if (D.bed) {
      var b = c.createBufferSource(), f = c.createBiquadFilter(), bg = c.createGain();
      b.buffer = E.rumore; b.loop = true;
      if (D.bed === 'rain') { f.type = 'bandpass'; f.frequency.value = 5200; f.Q.value = .4; bg.gain.value = 0; bg.gain.setTargetAtTime(.05, t, .6) }
      else {
        f.type = 'lowpass'; f.frequency.value = 520; f.Q.value = 2; bg.gain.value = 0; bg.gain.setTargetAtTime(.09, t, .8);
        var lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = .09; lg.gain.value = 260; lfo.connect(lg); lg.connect(f.frequency); lfo.start(t); s.lfo = lfo;
      }
      b.connect(f); f.connect(bg); bg.connect(s.g); b.start(t); s.bed = b;
    }
    return s;
  }
  function chiudiSessione(s, quando, coda) {
    if (!s) return;
    var t = quando, c = E.ctx;
    try { s.g.gain.cancelScheduledValues(t); s.g.gain.setValueAtTime(s.g.gain.value, t); s.g.gain.setTargetAtTime(0, t, coda || .12) } catch (x) {}
    var fine = t + (coda || .12) * 8;
    try { if (s.bed) s.bed.stop(fine); if (s.lfo) s.lfo.stop(fine) } catch (x) {}
    if (!s.off) setTimeout(function () { try { s.g.disconnect() } catch (x) {} }, (fine - c.currentTime) * 1000 + 300);
  }
  function attivo(s, L) { return L === 0 || s.lv[L] > .02 }
  function suona(s, st, t, sd) {
    var D = s.D, evs = D.ev[st], flow = want && want.flow;
    for (var i = 0; i < evs.length; i++) {
      var e = evs[i];
      if (!attivo(s, e.L)) continue;
      var v = e.v * s.lv[e.L], c = e.c;
      if (c === 'm') {
        var dur = e.l * sd * .92;
        nota(D.duty, hz(e.n), t, dur, D.lv * v, s.lin, .006, .55, .25, .04, D.vib);
        nota(D.duty, hz(e.n) * 1.004, t, dur, D.lv * .3 * v, s.lin, .006, .5, .2, .04);
        if (flow) nota(.125, hz(e.n + 12), t, dur, D.lv * .28 * s.lv[3], s.lin, .006, .5, .15, .04);
      } else if (c === 'n') nota(D.cw || 'tri', hz(e.n), t, e.l * sd * .9, (D.cv || .04) * v, s.pl, .01, .7, .3, .06, D.vib * .6);
      else if (c === 'b') bassi(D, hz(e.n), t, Math.max(.08, e.l * sd * .9), v, s, sd);
      else if (c === 'a') {
        for (var j = 0; j < e.n.length; j++) {
          if (D.ad === 'pad') { var pd = e.l * sd; nota('tri', hz(e.n[j]), t, pd * .9, D.av * 1.6, s.pump, Math.min(.5, pd * .3), .8, .6, Math.min(.6, pd * .2)); nota('tri', hz(e.n[j]) * 1.006, t, pd * .9, D.av, s.pump, Math.min(.6, pd * .35), .8, .6, Math.min(.6, pd * .2)) }
          else nota(D.ad, hz(e.n[j]), t, Math.max(.05, e.l * sd * .7), D.av, s.pump, .004, .3, .06, .025);
        }
      }
      else if (c === 'p') nota(.125, hz(e.n), t, sd * .8, D.pv * v, s.pr, .003, .3, .05, .02);
      else if (c === 'z') nota(.25, hz(e.n), t, sd * .7, D.zv, s.g, .002, .9, .2, .01);
      else {
        batteria(c, t, v, s.g);
        /* la pompa sulla cassa: giu' subito, su in un ottavo */
        if (c === 'k' && D.sc) { s.pump.gain.setTargetAtTime(1 - D.sc * Math.min(1, v + .2), t, .004); s.pump.gain.setTargetAtTime(1, t + .02, sd * .7) }
      }
    }
  }
  function bassi(D, f, t, dur, v, s, sd) {
    var c = E.ctx, out = s.pump;
    if (D.bw === 'acid') {
      /* sega nel filtro risonante, con la busta che si chiude */
      var os = c.createOscillator(), fl = c.createBiquadFilter(), g = c.createGain();
      os.type = 'sawtooth'; os.frequency.value = f; os.frequency.setValueAtTime(f, t);
      fl.type = 'lowpass'; fl.Q.value = 7 + 4 * s.lv[1];
      var top = 1400 + 1600 * s.lv[2] + (want && want.flow ? 800 : 0);
      fl.frequency.value = top; fl.frequency.setValueAtTime(top, t); fl.frequency.exponentialRampToValueAtTime(220, t + Math.min(dur, sd) * .95 + .02);
      g.gain.value = 0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(D.bv * v, t + .004); g.gain.setTargetAtTime(0, t + dur, .02);
      os.connect(fl); fl.connect(g); g.connect(out); os.start(t); os.stop(t + dur + .15);
    } else if (D.bw === 'sq') {
      var o2 = c.createOscillator(), f2 = c.createBiquadFilter(), g2 = c.createGain();
      o2.setPeriodicWave(E.onde[.5]); o2.frequency.value = f; o2.frequency.setValueAtTime(f, t);
      f2.type = 'lowpass'; f2.frequency.value = 700 + 500 * s.lv[2]; f2.Q.value = 1;
      g2.gain.value = 0; g2.gain.setValueAtTime(0, t); g2.gain.linearRampToValueAtTime(D.bv * 1.6 * v, t + .004); g2.gain.setTargetAtTime(D.bv * v, t + .004, .06); g2.gain.setTargetAtTime(0, t + dur, .02);
      o2.connect(f2); f2.connect(g2); g2.connect(out); o2.start(t); o2.stop(t + dur + .15);
      /* un'ottava sotto in triangolo per il peso */
      nota('tri', f / 2, t, dur, D.bv * .9 * v, out, .004, .8, .2, .03);
    } else nota('tri', f, t, dur, D.bv * v, out, .005, .8, .2, .03);
  }
  function batteria(k, t, v, out) {
    var c = E.ctx;
    if (k === 'k') {
      /* cassa: click d'attacco + corpo che scende */
      var o = c.createOscillator(), g = c.createGain(); o.type = 'sine';
      o.frequency.value = 160; o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(42, t + .13);
      g.gain.value = 0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.52 * v, t + .002); g.gain.exponentialRampToValueAtTime(.001, t + .24);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + .26);
      gliss('tri', 900, 120, t, .018, .1 * v, out, .001);
    } else if (k === 's') {
      /* rullante: rumore con il corpo intonato */
      soffio(t, .15, .17 * v, out, 'highpass', 1700, 0, .7); soffio(t, .06, .1 * v, out, 'bandpass', 900, 0, 1.2);
      gliss('tri', 240, 170, t, .07, .15 * v, out, .002);
    }
    else if (k === 'h') soffio(t, .03, .055 * v, out, 'highpass', 8500, 0, .7);
    else if (k === 'o') soffio(t, .17, .04 * v, out, 'highpass', 7000, 0, .7);
    else if (k === 'c') { soffio(t, .02, .15 * v, out, 'bandpass', 1400, 0, 1.2); soffio(t + .012, .02, .13 * v, out, 'bandpass', 1300, 0, 1.2); soffio(t + .024, .12, .15 * v, out, 'bandpass', 1200, 0, 1.2) }
    else if (k === 'r') soffio(t, .03, .2 * v, out, 'bandpass', 3200, 0, 5);
    else if (k === 't') { gliss('tri', 210, 85, t, .18, .24 * v, out, .002); soffio(t, .04, .05 * v, out, 'bandpass', 700, 0, 1) }
  }
  /* il sequencer: aggiorna gli strati e il tempo a ogni sedicesimo, programma fino a "fino" */
  function avanza(fino) {
    var s = E.sess;
    while (s && !s.done && s.next < fino) {
      var D = s.D, tg = want ? want.intensity : 0, fl = want && want.flow;
      s.inten += (tg - s.inten) * .05;
      var tt = 1 + s.inten * D.up + (fl ? .04 : 0);
      s.tmul += (tt - s.tmul) * .04;
      s.lv[1] += ((s.inten > .3 ? 1 : 0) - s.lv[1]) * .12;
      s.lv[2] += ((s.inten > .65 ? 1 : 0) - s.lv[2]) * .12;
      s.lv[3] += ((fl ? 1 : 0) - s.lv[3]) * .2;
      var sd = 60 / (D.bpm * s.tmul) / 4, q = s.step % 4 === 2 ? D.sw * sd : 0;
      if (s.step % 16 === 0) s.dl.delayTime.setTargetAtTime(sd * D.ech[0], s.next, .3);
      if (s.step % 4 === 0) { s.beatT[s.bi] = s.next; s.beatS[s.bi] = s.step; s.bi = (s.bi + 1) & 31 }
      if (E.log) E.log.push(s.next);
      suona(s, s.step, s.next + q, sd);
      s.step++; s.next += sd;
      if (s.step >= D.N) {
        if (D.once) { s.done = true; chiudiSessione(s, s.next + 1.2, .5); E.sess = null; break }
        s.step = D.loopAt;
      }
    }
  }
  function giro() {
    E.timer = 0;
    if (!E.sess) return;
    avanza(ora() + (document.hidden ? 1.2 : .12));
    if (E.sess) E.timer = setTimeout(giro, 25);
  }
  var memo = {};
  function avvia(nome, quando) {
    var D = BR[nome]; if (!D || !E) return;
    var t = quando == null ? ora() + .04 : quando, vecchia = E.sess;
    if (vecchia) {
      if (!vecchia.D.once) memo[vecchia.D.nome] = { step: vecchia.step - vecchia.step % 16, at: Date.now() };
      chiudiSessione(vecchia, t, .06); t += .02;
    }
    E.sess = apriSessione(D, t);
    /* tornando su un brano entro 30 s, riprende dalla battuta dove era (la Night shift dura poco) */
    var m = memo[nome]; if (m && Date.now() - m.at < 30000 && !D.once) E.sess.step = m.step % D.N;
    clearTimeout(E.timer); E.timer = 0;
    if (!E.off) giro();
  }
  function fermaMusica(coda) {
    if (!E) return;
    clearTimeout(E.timer); E.timer = 0;
    if (E.sess) { chiudiSessione(E.sess, ora(), coda || .1); E.sess = null }
  }

  /* ---------- gli effetti ---------- */
  /* limiti: quante voci insieme e a che distanza minima (s) */
  var LIM = { shoot: [3, .035], shootAuto: [3, .04], shootAI: [3, .04], hit: [4, .03], kill: [4, .04], explosion: [2, .12], split: [3, .04],
    blip: [3, .05], paper: [3, .05], ring: [2, .1], review: [2, .15], hurt: [1, .25], cityHit: [2, .12], power: [1, .2], pickup: [1, .2],
    shield: [1, .15], shieldHit: [2, .06], shieldBreak: [1, .2], night: [1, .5], coin: [2, .08], combo: [1, .4], install: [1, .5],
    deliver: [2, .12], clockIn: [1, .5], clockOut: [1, .5], siren: [1, .8], urgent: [1, .6], alarm: [1, .8], rip: [2, .15],
    bossCard: [1, .5], bossHit: [3, .05], bossDie: [1, 1], gameOver: [1, 1], win: [1, 1], insertCoin: [1, .3], select: [2, .04],
    type: [3, .025], typewriter: [2, .03], m8: [1, .12] };
  /* volume di ogni effetto (misurato offline: i colpi frequenti piu' bassi, gli eventi grandi piu' alti) */
  var TRIM = { shoot: 2.2, shootAuto: 2.25, shootAI: 2.3, hit: 3.7, kill: 1.3, explosion: .8, split: 2.5, blip: 1.4, paper: 4.7, ring: 1.9,
    review: 1.75, hurt: 1.6, cityHit: 1.06, power: 1.8, pickup: 1.8, shield: 1.14, shieldHit: 1.4, shieldBreak: 1.2, night: 1, coin: 1.4,
    combo: 1.4, install: 1.1, deliver: 1.3, clockIn: 1, clockOut: .84, siren: .9, urgent: .77, alarm: 1.5, rip: 3.9, bossCard: .7,
    bossHit: 1, bossDie: .78, gameOver: .93, win: 1.57, insertCoin: 2.1, select: 1.9, type: 2.6, typewriter: 4, m8: 2.5 };
  var MAXV = 14;
  function rp(a) { return 1 + (Math.random() * 2 - 1) * a }
  /* tre varianti a giro per i colpi ripetuti: niente fatica d'ascolto */
  var RR = [1, 1.06, .95];
  function rr() { E.rr = (E.rr + 1) % 3; return RR[E.rr] }
  var FX = {
    /* l'ingranaggio base: click metallico, zap che scende, piccolo tic che risuona */
    shoot: function (t, o) {
      var r = rr() * rp(.025);
      soffio(t, .012, .16, o, 'highpass', 6000, 0, .7, .0008);
      gliss(.25, 1250 * r, 520 * r, t, .065, .11, o);
      gliss('sine', 210 * r, 95, t, .045, .16, o, .002);
      soffio(t + .012, .07, .05, o, 'bandpass', 3300 * r, 0, 14);
      return .09;
    },
    /* tre ingranaggi a ventaglio: tre zap stretti sfalsati e un solo click */
    shootAuto: function (t, o) {
      var r = rr() * rp(.02);
      soffio(t, .012, .14, o, 'highpass', 6500, 0, .7, .0008);
      for (var i = 0; i < 3; i++) gliss(.125, (1500 + i * 240) * r, (720 + i * 110) * r, t + i * .011, .055, .065, o);
      gliss('sine', 230 * r, 100, t, .05, .15, o, .002);
      soffio(t + .02, .06, .04, o, 'bandpass', 3800 * r, 0, 12);
      return .09;
    },
    /* il colpo intelligente: sibilo che sale, sinusoide che piega, scintilla ciano */
    shootAI: function (t, o) {
      var r = rr() * rp(.03);
      soffio(t, .14, .12, o, 'bandpass', 900 * r, 4200 * r, 3, .01);
      gliss('sine', 520 * r, 1250 * r, t, .11, .09, o, .006);
      gliss('tri', 1040 * r, 1900 * r, t + .015, .08, .04, o, .004);
      nota('sine', 2600 * r, t + .06, .03, .03, o, .002, .4, .02, .02);
      return .16;
    },
    hit: function (t, o) { var r = rp(.1); soffio(t, .01, .16, o, 'highpass', 5000, 0, .7, .0008); soffio(t, .06, .2, o, 'bandpass', 2600 * r, 1200 * r, 1.4); gliss(.5, 900 * r, 480 * r, t, .045, .08, o); return .07 },
    /* nemico giu': pop, crepitio, ingranaggi che volano via */
    kill: function (t, o) {
      var r = rp(.08);
      gliss('sine', 190 * r, 50, t, .12, .26, o, .002);
      soffio(t, .26, .3, o, 'lowpass', 4600 * r, 240, 1.1, .001);
      gliss(.25, 560 * r, 80, t, .2, .1, o);
      for (var i = 0; i < 3; i++) nota('sine', (2400 + Math.random() * 1800) * r, t + .03 + i * .028 + Math.random() * .02, .03, .035, o, .001, .3, .02, .02);
      return .3;
    },
    explosion: function (t, o) {
      var r = rp(.06);
      gliss('sine', 120 * r, 32, t, .5, .42, o, .003);
      soffio(t, .7, .4, o, 'lowpass', 5200 * r, 160, 1, .002);
      soffio(t + .05, .5, .16, o, 'bandpass', 1800, 400, 1.5, .01);
      for (var i = 0; i < 5; i++) soffio(t + .08 + i * .07 + Math.random() * .03, .09, .1, o, 'bandpass', 2400 * rp(.3), 900, 2);
      return .8;
    },
    split: function (t, o) { soffio(t, .09, .2, o, 'bandpass', 3800, 5200, 2); nota(.25, 620, t + .02, .04, .07, o, .002, .5, .03, .015); nota(.25, 930, t + .07, .05, .07, o, .002, .5, .03, .015); return .13 },
    blip: function (t, o) { var r = rp(.06); gliss('sine', 320 * r, 1500 * r, t, .12, .15, o, .01); gliss(.125, 640 * r, 3000 * r, t + .02, .08, .04, o, .005); return .14 },
    /* fattura strappata: due strappi veloci e un fruscio */
    paper: function (t, o) {
      var r = rp(.08);
      for (var i = 0; i < 4; i++) soffio(t + i * .026 + Math.random() * .008, .035, .16, o, 'bandpass', (2200 + i * 700) * r, (3400 + i * 600) * r, 1.8, .001);
      soffio(t + .1, .12, .05, o, 'highpass', 4000, 7000, .7, .01);
      return .24;
    },
    /* chiamata: trillo del telefono, due toni alternati */
    ring: function (t, o) {
      var r = rp(.03);
      for (var i = 0; i < 6; i++) nota(.5, (i % 2 ? 1320 : 1660) * r, t + i * .032, .03, .045, o, .002, .9, .1, .006);
      nota('sine', 1660 * r, t, .2, .03, o, .004, .6, .1, .04);
      return .24;
    },
    /* una stella: "buu" di folla e trombone che scende */
    review: function (t, o) {
      var r = rp(.05);
      soffio(t, .5, .1, o, 'bandpass', 420 * r, 300 * r, 4, .08);
      soffio(t, .5, .07, o, 'bandpass', 900 * r, 650 * r, 5, .08);
      gliss('saw', 196 * r, 140 * r, t + .02, .45, .05, o, .05, 'lin');
      gliss(.5, 98 * r, 70 * r, t + .02, .45, .05, o, .05, 'lin');
      return .55;
    },
    hurt: function (t, o) {
      soffio(t, .22, .34, o, 'lowpass', 2200, 180, 1);
      gliss(.5, 220, 48, t, .32, .16, o);
      /* la tazza che si rovescia: un piccolo glissato che scende */
      gliss('tri', 900, 300, t + .12, .3, .1, o, .01, 'lin');
      return .45;
    },
    cityHit: function (t, o) { gliss('sine', 120, 45, t, .25, .32, o); gliss('tri', 640, 150, t, .3, .1, o); nota(.5, 2200, t + .3, .012, .05, o, .001, .2, .01, .005); return .34 },
    power: function (t, o) {
      var n = [72, 76, 79, 84, 88];
      soffio(t, .25, .06, o, 'bandpass', 1200, 6000, 2, .02);
      for (var i = 0; i < n.length; i++) { nota(.25, hz(n[i]), t + i * .04, .05, .09, o, .003, .6, .05, .02); nota('sine', hz(n[i] + 12), t + i * .04 + .02, .04, .03, o, .002, .5, .03, .02) }
      campana(hz(96), t + .21, .4, .06, o);
      return .6;
    },
    shield: function (t, o) {
      /* vetro: due sinusoidi in quinta che luccicano, piu' una salita morbida */
      nota('sine', 1320, t, .32, .12, o, .004, .4, .1, .08); nota('sine', 1980, t + .01, .28, .07, o, .004, .4, .1, .08);
      gliss('tri', 440, 1760, t, .18, .08, o, .02); return .45
    },
    /* lo scudo para: "tin" di vetro e una bolla che ondeggia */
    shieldHit: function (t, o) {
      var r = rp(.05);
      nota('sine', 1760 * r, t, .14, .1, o, .001, .3, .05, .05); nota('sine', 2640 * r, t, .1, .05, o, .001, .3, .04, .04);
      gliss('sine', 300 * r, 180, t, .1, .14, o, .002);
      soffio(t, .03, .08, o, 'highpass', 6000, 0, .7, .001);
      return .2;
    },
    shieldBreak: function (t, o) {
      gliss('sine', 220, 60, t, .2, .2, o, .002);
      soffio(t, .32, .26, o, 'highpass', 5000, 2500, .8);
      for (var i = 0; i < 6; i++) gliss('sine', (2900 - i * 330) * rp(.05), (1300 - i * 150), t + i * .025, .16, .05, o);
      return .4;
    },
    /* Night shift: carillon della ninnananna, sbadiglio, soffio di notte */
    night: function (t, o) {
      soffio(t, 1.2, .1, o, 'lowpass', 280, 2800, 3, .45);
      var n = [91, 88, 84, 79, 76, 72];
      for (var i = 0; i < n.length; i++) campana(hz(n[i]), t + .04 + i * .12, .7, .05, o);
      gliss('tri', 520, 230, t + .5, .6, .06, o, .1, 'lin');
      gliss('sine', 110, 55, t, .8, .16, o, .05);
      return 1.4;
    },
    coin: function (t, o) { nota(.25, hz(88), t, .06, .1, o, .002, .7, .05, .01); nota(.25, hz(95), t + .065, .32, .1, o, .002, .6, .15, .06); nota('sine', hz(107), t + .07, .22, .05, o, .002, .4, .1, .06); return .5 },
    combo: function (t, o) {
      var n = [69, 72, 76, 81, 84, 88, 93];
      for (var i = 0; i < n.length; i++) { nota(.25, hz(n[i]), t + i * .04, .06, .08, o, .002, .6, .04, .02); nota(.125, hz(n[i] + 12), t + i * .04 + .02, .04, .03, o, .002, .5, .03, .02) }
      soffio(t, .45, .07, o, 'highpass', 2500, 9000, .7, .2);
      gliss('sine', 80, 160, t, .3, .14, o, .02);
      nota(.5, hz(81), t + .3, .3, .04, o, .004, .6, .15, .08); nota(.5, hz(85), t + .3, .3, .035, o, .004, .6, .15, .08); nota(.5, hz(88), t + .3, .3, .035, o, .004, .6, .15, .08);
      return .7;
    },
    /* SYSTEM INSTALLED: avvio della macchina, arpeggio che sale e accordo che brilla */
    install: function (t, o) {
      gliss('sine', 60, 220, t, .3, .2, o, .02);
      var n = [60, 67, 72, 76, 79, 84];
      for (var i = 0; i < n.length; i++) nota(.25, hz(n[i]), t + .1 + i * .05, .08, .07, o, .002, .6, .05, .02);
      [72, 76, 79, 83].forEach(function (m) { nota(.125, hz(m), t + .42, .6, .035, o, .01, .6, .3, .2) });
      campana(hz(96), t + .42, .9, .05, o);
      soffio(t + .4, .6, .04, o, 'highpass', 7000, 11000, .7, .05);
      return 1.3;
    },
    /* consegna fatta: cassa che si apre, ka-ching */
    deliver: function (t, o) {
      soffio(t, .04, .18, o, 'bandpass', 1500, 800, 2, .001);
      campana(hz(88), t + .05, .35, .08, o); campana(hz(93), t + .11, .5, .08, o);
      soffio(t + .05, .2, .05, o, 'highpass', 8000, 0, .7, .01);
      return .6;
    },
    /* CLOCK IN!: la timbratrice e due rintocchi che salgono */
    clockIn: function (t, o) {
      soffio(t, .05, .25, o, 'bandpass', 1800, 900, 2); gliss('sine', 180, 60, t + .04, .1, .25, o);
      campana(hz(79), t + .12, .5, .13, o); campana(hz(84), t + .3, .9, .14, o);
      nota(.25, hz(72), t + .3, .25, .05, o, .003, .6, .1, .06); nota(.25, hz(76), t + .3, .25, .04, o, .003, .6, .1, .06);
      return 1.2;
    },
    clockOut: function (t, o) {
      /* la timbratrice: ka-chunk, poi il campanello */
      soffio(t, .05, .25, o, 'bandpass', 1800, 900, 2); gliss('sine', 180, 60, t + .05, .1, .25, o);
      nota('sine', hz(84), t + .16, .5, .14, o, .002, .3, .25, .2); nota('sine', hz(84) * 2.76, t + .16, .25, .03, o, .002, .2, .1, .1);
      nota('sine', hz(79), t + .42, .9, .14, o, .002, .3, .4, .3); nota('sine', hz(79) * 2.76, t + .42, .3, .03, o, .002, .2, .1, .1);
      return 1.4;
    },
    /* OVERTIME: sirena corta, due su e giu', filtrata (non stride) */
    siren: function (t, o) {
      var c = E.ctx, os = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
      os.setPeriodicWave(E.onde[.25]); os.frequency.value = 520; os.frequency.setValueAtTime(520, t);
      for (var i = 0; i < 2; i++) { os.frequency.linearRampToValueAtTime(980, t + i * .55 + .3); os.frequency.linearRampToValueAtTime(520, t + i * .55 + .55) }
      f.type = 'lowpass'; f.frequency.value = 2400;
      g.gain.value = 0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09, t + .05); g.gain.setTargetAtTime(0, t + 1.05, .05);
      os.connect(f); f.connect(g); g.connect(o); os.start(t); os.stop(t + 1.4);
      gliss('sine', 90, 45, t, .4, .2, o, .01);
      return 1.3;
    },
    urgent: function (t, o) {
      for (var i = 0; i < 4; i++) { var f = i % 2 ? 660 : 880; nota(.25, f, t + i * .14, .1, .1, o, .003, .8, .1, .02); nota(.5, f / 2, t + i * .14, .1, .05, o, .003, .8, .1, .02) }
      gliss('sine', 90, 40, t, .5, .3, o);
      return .7;
    },
    alarm: function (t, o) {
      /* la sveglia delle 9: bip a gruppi di quattro con un campanello che trilla sotto */
      for (var g = 0; g < 3; g++) for (var i = 0; i < 4; i++) nota(.5, 2093, t + g * .5 + i * .085, .045, .07, o, .002, .9, .1, .008);
      for (var j = 0; j < 18; j++) nota('sine', j % 2 ? 1568 : 1760, t + j * .08, .05, .05, o, .002, .7, .05, .01);
      return 1.6;
    },
    rip: function (t, o) { for (var i = 0; i < 6; i++) soffio(t + i * .045 + Math.random() * .015, .05, .14 + Math.random() * .08, o, 'bandpass', 1600 + i * 600, 3000 + i * 500, 1.5); soffio(t, .34, .06, o, 'highpass', 3000, 6000, .7); return .4 },
    /* la card del boss: colpo, soffio che sale, accordo; con opt.boss suona il suo motivo */
    bossCard: function (t, o, opt) {
      if (opt && opt.boss && STING[opt.boss]) return STING[opt.boss](t, o);
      return STING._base(t, o);
    },
    bossHit: function (t, o) { var r = rp(.08); gliss('sine', 170 * r, 55, t, .16, .3, o); soffio(t, .1, .18, o, 'bandpass', 1400 * r, 600, 1.2); gliss(.5, 400 * r, 200 * r, t, .06, .06, o); nota('sine', 2200 * r, t + .01, .04, .03, o, .001, .3, .02, .02); return .18 },
    bossDie: function (t, o) {
      soffio(t, 2.2, .36, o, 'lowpass', 5000, 120, 1, .005);
      gliss('sine', 140, 30, t, 1.6, .38, o, .005);
      for (var i = 0; i < 8; i++) soffio(t + .15 + i * .17, .3, .18 * (1 - i / 10), o, 'lowpass', 2600 * rp(.2), 200, 1.2);
      var n = [84, 79, 76, 72, 67, 64, 60];
      for (var k = 0; k < n.length; k++) nota(.25, hz(n[k]), t + .2 + k * .09, .08, .06, o, .002, .6, .05, .02);
      return 2.4;
    },
    gameOver: function (t, o) {
      /* la macchina che si spegne: tono che crolla e ronzio che svanisce */
      gliss(.5, 440, 40, t, 1.1, .14, o, .01);
      gliss('tri', 220, 30, t, 1.2, .16, o, .01);
      soffio(t, .9, .08, o, 'lowpass', 1200, 100, 2, .02);
      return 1.3;
    },
    win: function (t, o) {
      var n = [72, 76, 79, 84];
      for (var i = 0; i < n.length; i++) nota(.25, hz(n[i]), t + i * .06, .5 - i * .06, .08, o, .003, .6, .2, .15);
      nota('sine', hz(96), t + .26, .6, .05, o, .005, .5, .3, .2);
      soffio(t + .2, .6, .05, o, 'highpass', 6000, 10000, .7, .1);
      return 1;
    },
    insertCoin: function (t, o) {
      nota('sine', 2600, t, .03, .1, o, .001, .3, .02, .02); nota('sine', 3400, t + .05, .03, .08, o, .001, .3, .02, .02);
      soffio(t + .09, .05, .1, o, 'bandpass', 900, 500, 3);
      nota(.25, hz(76), t + .2, .07, .09, o, .002, .7, .06, .02); nota(.25, hz(83), t + .28, .25, .09, o, .002, .6, .12, .05);
      return .6;
    },
    select: function (t, o) { nota(.25, 1046, t, .025, .08, o, .002, .6, .03, .01); nota(.25, 1568, t + .03, .03, .06, o, .002, .6, .03, .01); return .07 },
    type: function (t, o) { var r = rp(.08); nota(.5, 1500 * r, t, .012, .06, o, .001, .4, .01, .006); soffio(t, .015, .05, o, 'highpass', 6000); return .03 },
    /* macchina da scrivere: tic secco e piccolissimo, tono che varia */
    typewriter: function (t, o) { var r = rp(.12); soffio(t, .012, .06, o, 'bandpass', 2600 * r, 0, 3, .0006); nota('sine', 900 * r, t, .008, .02, o, .001, .3, .005, .004); return .02 },
    /* la voce di M8: bip a quadra con un profilo diverso per umore */
    m8: function (t, o, opt) {
      var mood = opt && opt.mood || 'happy', r = rp(.04), i;
      if (mood === 'hurt') {
        gliss(.25, 900 * r, 380 * r, t, .26, .09, o, .005);
        nota(.5, 1200 * r, t, .05, .05, o, .002, .6, .03, .01);
        return .3;
      }
      if (mood === 'surprised') {
        gliss(.25, 500 * r, 1700 * r, t, .14, .09, o, .004);
        nota(.25, 1700 * r, t + .15, .06, .07, o, .002, .7, .04, .02);
        return .24;
      }
      var p = [0, 4, 7, 12];
      for (i = 0; i < 4; i++) nota(.25, 880 * r * Math.pow(2, p[i] / 12), t + i * .05, .04, .07, o, .002, .7, .03, .012);
      nota('sine', 3520 * r, t + .2, .05, .025, o, .002, .4, .03, .02);
      return .28;
    }
  };
  FX.pickup = FX.power;
  FX.m8Happy = function (t, o) { return FX.m8(t, o, { mood: 'happy' }) };
  FX.m8Hurt = function (t, o) { return FX.m8(t, o, { mood: 'hurt' }) };
  FX.m8Surprised = function (t, o) { return FX.m8(t, o, { mood: 'surprised' }) };
  ['m8Happy', 'm8Hurt', 'm8Surprised'].forEach(function (k) { LIM[k] = LIM.m8; TRIM[k] = TRIM.m8 });

  /* ---------- i motivi dei boss (sting della card, 1,5-2,5 s, sul bus degli effetti) ---------- */
  function colpoCard(t, o) { gliss('sine', 130, 38, t, .45, .4, o, .002); soffio(t, .35, .22, o, 'lowpass', 3500, 200, 1, .002) }
  function accordo(ns, t, dur, v, w, o) { for (var i = 0; i < ns.length; i++) nota(w, hz(ns[i]), t, dur, v, o, .006, .6, dur * .4, .12, 8) }
  var STING = {
    _base: function (t, o) { soffio(t, .5, .1, o, 'bandpass', 400, 4000, 2, .45); colpoCard(t + .5, o); accordo([47, 54, 59, 62], t + .5, .8, .05, .25, o); return 1.5 },
    /* THE VOICEMAIL: il beep della segreteria, poi il motivo che rallenta come un nastro */
    voicemail: function (t, o) {
      nota('sine', 1000, t, .35, .12, o, .005, .9, .3, .02);
      colpoCard(t + .42, o);
      var n = [69, 69, 72, 76, 74];
      for (var i = 0; i < n.length; i++) { var d = t + .45 + i * .16 + i * i * .015; gliss(.25, hz(n[i]), hz(n[i]) * (.97 - i * .02), d, .15 + i * .03, .08, o, .004, 'lin') }
      soffio(t + .45, 1.2, .025, o, 'bandpass', 3000, 2000, .8, .1);
      return 1.8;
    },
    /* REPLY ALL: notifiche che si moltiplicano e si accavallano */
    replyall: function (t, o) {
      for (var i = 0; i < 9; i++) { var d = t + i * (.11 - i * .008); nota(.25, hz(79 + (i % 3) * 4 + Math.floor(i / 3) * 2), d, .05, .06 + i * .004, o, .002, .7, .03, .02); nota('sine', hz(91 + (i % 3) * 4), d + .02, .04, .025, o, .002, .5, .03, .02) }
      colpoCard(t + .75, o); accordo([60, 64, 67, 71, 74], t + .75, .8, .04, .25, o);
      return 1.6;
    },
    /* PAPER JAM: la stampante che tira, si inceppa, gracchia */
    paperjam: function (t, o) {
      for (var i = 0; i < 6; i++) { soffio(t + i * .09, .06, .14, o, 'bandpass', 900 + (i % 2) * 500, 0, 3, .004); gliss(.5, 110, 100, t + i * .09, .06, .05, o, .004) }
      soffio(t + .56, .18, .24, o, 'bandpass', 2400, 600, 4, .002);
      gliss('saw', 300, 70, t + .56, .3, .07, o, .004);
      colpoCard(t + .8, o);
      nota(.5, hz(55), t + .8, .5, .06, o, .004, .7, .2, .08); nota(.5, hz(56), t + .95, .6, .06, o, .004, .7, .2, .1);
      return 1.6;
    },
    /* URGENT: sirena breve e tre colpi da ottoni, da-da-DAA */
    urgent: function (t, o) {
      for (var i = 0; i < 3; i++) { var f = i % 2 ? 660 : 880; nota(.25, f, t + i * .12, .09, .07, o, .003, .8, .1, .02) }
      colpoCard(t + .4, o);
      accordo([62, 66, 69], t + .4, .12, .05, .5, o); accordo([62, 66, 69], t + .58, .12, .05, .5, o); accordo([63, 67, 70, 74], t + .76, .8, .06, .5, o);
      return 1.6;
    },
    /* ONE STAR: un ding solo, poi il buu e il trombone triste */
    onestar: function (t, o) {
      campana(hz(88), t, .6, .1, o);
      soffio(t + .35, .7, .08, o, 'bandpass', 420, 300, 4, .1);
      var n = [67, 66, 65, 64];
      for (var i = 0; i < n.length; i++) nota(.5, hz(n[i] - 12), t + .45 + i * .22, i === 3 ? .6 : .18, .055, o, .01, .7, .15, .08, i === 3 ? 30 : 0);
      colpoCard(t + .45, o);
      return 1.8;
    },
    /* SUNDAY SCARIES: tritono che ondeggia, bordone basso, respiro all'indietro */
    scaries: function (t, o) {
      soffio(t, 1, .1, o, 'lowpass', 200, 2400, 4, .9);
      nota('sine', hz(57), t, 1.8, .06, o, .4, .9, .6, .3, 40);
      nota('sine', hz(63), t + .2, 1.6, .045, o, .4, .9, .6, .3, 55);
      nota('tri', hz(33), t, 1.8, .12, o, .3, .9, .8, .3);
      colpoCard(t + 1, o);
      campana(hz(81), t + 1, 1, .04, o);
      return 2.2;
    },
    /* MONDAY: sveglia, timpano e un accordo enorme in re minore */
    monday: function (t, o) {
      for (var i = 0; i < 8; i++) nota('sine', i % 2 ? 1568 : 1760, t + i * .06, .045, .05, o, .002, .7, .04, .01);
      colpoCard(t + .5, o); gliss('sine', 90, 40, t + .5, .9, .3, o, .004);
      accordo([38, 50, 53, 57, 62], t + .5, 1.3, .045, .5, o);
      accordo([62, 65, 69], t + .5, 1.3, .03, .25, o);
      nota(.25, hz(74), t + 1.1, .12, .06, o, .002, .7, .05, .03); nota(.25, hz(73), t + 1.25, .5, .06, o, .002, .7, .2, .08, 20);
      return 2.3;
    }
  };
  var STINGS = ['voicemail', 'replyall', 'paperjam', 'urgent', 'onestar', 'scaries', 'monday'];

  function sfx(name, opt) {
    if (!E || !FX[name] || E.ctx.state !== 'running') return;
    var t = ora(), lim = LIM[name] || [3, .03], last = E.last[name];
    if (last != null && t - last < lim[1]) return;
    /* pulizia delle voci finite, poi il furto della piu' vecchia se serve */
    var v = E.voci, conta = 0, i;
    for (i = v.length - 1; i >= 0; i--) if (v[i].end < t) v.splice(i, 1);
    for (i = 0; i < v.length; i++) if (v[i].n === name) conta++;
    if (conta >= lim[0]) taglia(name, t);
    if (v.length >= MAXV) taglia(null, t);
    E.last[name] = t;
    var g = E.ctx.createGain(), pan = opt && opt.pan;
    g.gain.value = (TRIM[name] || 1) * (opt && opt.vol != null ? Math.max(0, Math.min(1.5, opt.vol)) : 1);
    g.connect(pan ? panner(Math.max(-1, Math.min(1, pan)) * .7, E.sfx) : E.sfx);
    var dur = FX[name](t + .005, g, opt) || .3;
    v.push({ n: name, g: g, end: t + dur + .1 });
  }
  function taglia(name, t) {
    var v = E.voci;
    for (var i = 0; i < v.length; i++) if (name == null || v[i].n === name) {
      try { v[i].g.gain.cancelScheduledValues(t); v[i].g.gain.setValueAtTime(v[i].g.gain.value, t); v[i].g.gain.setTargetAtTime(0, t, .008) } catch (x) {}
      v.splice(i, 1); return;
    }
  }

  /* ---------- i comandi pubblici ---------- */
  function unlock() {
    try {
      if (!E) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; E = costruisci(new AC({ latencyHint: 'interactive' })) }
      var c = E.ctx;
      if (c.state !== 'running') { var p = c.resume(); if (p && p.then) p.then(partiSeServe, function () {}) }
      partiSeServe();
    } catch (x) {}
  }
  function partiSeServe() {
    if (!E || E.ctx.state !== 'running' || !want || !want.track) return;
    if (!E.sess || E.sess.D.nome !== want.track) { if (!want.playing) { want.playing = true; avvia(want.track) } }
  }
  function music(track, opt) {
    if (!want) want = { track: null, intensity: 0, flow: false };
    if (track === 'boss' && opt && opt.boss === 'monday') track = 'monday';
    if (opt) { if (opt.intensity != null) want.intensity = clamp(opt.intensity); if (opt.flow != null) want.flow = !!opt.flow }
    if (track && !BR[track]) return;
    if (!track) { want.track = null; want.playing = false; fermaMusica(.15); return }
    var stesso = want.track === track && E && E.sess && E.sess.D.nome === track;
    want.track = track;
    if (stesso) return;
    if (!opt || opt.intensity == null) want.intensity = 0;
    if (!opt || opt.flow == null) want.flow = false;
    want.playing = false;
    if (E && E.ctx.state === 'running') { want.playing = true; avvia(track) }
  }
  function clamp(v) { v = +v; return isFinite(v) ? Math.max(0, Math.min(1, v)) : 0 }
  function stopAll() {
    if (want) { want.track = null; want.playing = false }
    if (!E) return;
    fermaMusica(.05);
    var t = ora(), vecchio = E.sfx;
    try { vecchio.gain.cancelScheduledValues(t); vecchio.gain.setTargetAtTime(0, t, .02) } catch (x) {}
    setTimeout(function () { try { vecchio.disconnect() } catch (x) {} }, 300);
    E.voci.length = 0; E.last = {};
    nuovoSfx(E);
  }
  function setMute(on) {
    muted = !!on;
    try { localStorage.setItem(KEY, muted ? '1' : '0') } catch (x) {}
    if (E) { var t = ora(); E.mute.gain.cancelScheduledValues(t); E.mute.gain.setTargetAtTime(muted ? 0 : 1, t, .04) }
    return muted;
  }
  var ducked = false;
  function duck(on) {
    ducked = !!on;
    if (!E) return;
    var t = ora();
    E.dg.gain.cancelScheduledValues(t); E.dg.gain.setTargetAtTime(ducked ? .3 : 1, t, .08);
    E.dlp.frequency.cancelScheduledValues(t); E.dlp.frequency.setTargetAtTime(ducked ? 900 : 11000, t, .1);
  }
  /* la fase del battito, per far pulsare lo sfondo a tempo (oggetto riusato, niente allocazioni) */
  var BEAT = { phase: 0, beat: 0, bpm: 0, on: false };
  function beat() {
    var s = E && E.sess; BEAT.on = !!s;
    if (!s) { BEAT.phase = 0; BEAT.bpm = 0; return BEAT }
    var t = ora(), best = -1, bt = -1;
    for (var i = 0; i < 32; i++) { var x = s.beatT[i]; if (x && x <= t && x > bt) { bt = x; best = i } }
    var bl = 60 / (s.D.bpm * s.tmul);
    BEAT.bpm = s.D.bpm * s.tmul;
    if (best < 0) { BEAT.phase = 0; return BEAT }
    BEAT.phase = Math.min(1, (t - bt) / bl); BEAT.beat = s.beatS[best] >> 2;
    return BEAT;
  }

  /* ---------- solo per le prove: rende offline un effetto o un brano e restituisce il buffer ---------- */
  function render(kind, name, secs, plan) {
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    var sr = 44100, oc = new OAC(2, Math.ceil(sr * secs), sr);
    var salvaE = E, salvaW = want, salvaM = muted, salvaD = ducked, log = null;
    muted = false; ducked = false;
    E = costruisci(oc); E.off = true;
    want = { track: null, intensity: 0, flow: false };
    try {
      if (kind === 'sfx' || kind === 'sting') {
        var reps = (plan && plan.reps) || 1, gap = (plan && plan.gap) || .1;
        for (var i = 0; i < reps; i++) {
          var g = oc.createGain(); g.gain.value = kind === 'sting' ? TRIM.bossCard : (TRIM[name] || 1);
          g.connect(plan && plan.pan ? panner(plan.pan * .7, E.sfx) : E.sfx);
          if (kind === 'sting') STING[name](.05 + i * gap, g); else FX[name](.05 + i * gap, g, plan);
        }
      } else {
        want.track = name; want.intensity = 0;
        E.sess = apriSessione(BR[name], .05);
        E.log = [];
        var pts = (plan || []).slice().sort(function (a, b) { return a.t - b.t }), k = 0;
        for (var x = .25; x <= secs; x += .25) {
          while (k < pts.length && pts[k].t <= x) {
            var pt = pts[k++];
            if (pt.intensity != null) want.intensity = pt.intensity;
            if (pt.flow != null) want.flow = pt.flow;
            if (pt.track) { want.track = pt.track; avvia(pt.track, pt.t) }
          }
          avanza(x);
        }
        log = E.log;
      }
    } catch (err) { E = salvaE; want = salvaW; muted = salvaM; ducked = salvaD; return Promise.reject(err) }
    E = salvaE; want = salvaW; muted = salvaM; ducked = salvaD;
    return oc.startRendering().then(function (buf) { buf.steps = log; return buf });
  }

  var A = {
    unlock: unlock,
    sfx: function (n, o) { try { sfx(n, o) } catch (x) {} },
    sting: function (b) { try { sfx('bossCard', { boss: b }) } catch (x) {} },
    music: function (t, o) { try { music(t, o) } catch (x) {} },
    intensity: function (v) { if (!want) want = { track: null, intensity: 0, flow: false }; want.intensity = clamp(v) },
    flow: function (on) { if (!want) want = { track: null, intensity: 0, flow: false }; want.flow = !!on },
    stopAll: function () { try { stopAll() } catch (x) {} },
    mute: function (on) { return setMute(on == null ? !muted : on) },
    duck: function (on) { try { duck(on) } catch (x) {} },
    beat: beat,
    track: function () { return want && want.track || null },
    tracks: Object.keys(BR).map(function (k) { var D = BR[k]; return { name: k, bpm: D.bpm, seconds: +D.sec.toFixed(1), once: !!D.once } }),
    sfxNames: Object.keys(FX),
    stings: STINGS,
    errors: ERR,
    _render: render,
    _mix: MIX,
    _br: BR
  };
  Object.defineProperty(A, 'muted', { get: function () { return muted }, enumerable: true });
  Object.defineProperty(A, 'ready', { get: function () { return !!E && E.ctx.state === 'running' }, enumerable: true });
  window.DEADLINE_AUDIO = A;
})();
