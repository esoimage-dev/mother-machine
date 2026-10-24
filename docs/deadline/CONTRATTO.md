# DEADLINE · contratto tecnico tra i pezzi (scritto dal capo progetto)

Il gioco del cabinato in LG (pagina /lg del sito Mother Machine), al posto di RUSH HOUR (public/js/rush.js, rush.css).
Specifica di design completa e vincolante: `SPEC.md` nella stessa cartella (decisa con il proprietario, Eso). Leggerla tutta.

## Regole del progetto (sempre)
- Repo: /home/user/mother-machine. NON fare commit ne' push (lo fa il capo). Non toccare file fuori dai tuoi.
- Mai il carattere trattino lungo (U+2014) in nessun file. Commenti brevi in italiano. Testi del gioco in inglese corto.
- Niente librerie esterne, niente CDN, niente file audio o immagine: tutto disegnato e suonato in codice.
- Colori del marchio: notte #0F0F0E, crema #F4F2EC, pomodoro #FF5B3A (solo su cio' che si muove o risponde),
  inchiostro #121211. Caratteri del sito: var(--f-mono) (DM Mono), var(--f-body) (Hanken Grotesk). Nel gioco il
  testo e' a pixel (font disegnato in codice).
- Leggero: 60 fps su un telefono medio, niente allocazioni nel ciclo caldo (pool di oggetti), si ferma quando l'overlay e'
  chiuso o la scheda non e' visibile. prefers-reduced-motion: niente lampi ne' tremolii dello schermo.

## File e responsabili
| File | Chi | Cosa |
|---|---|---|
| `public/js/deadline-art.js` | ART | `window.DEADLINE_ART`: tutti i disegni (sprite a pixel generati in codice su canvas offscreen, cache) |
| `public/js/deadline.js` + `public/css/deadline.css` | CORE | overlay, ciclo di gioco, regole, nemici, boss, HUD, stati, comandi, citta' CITY, classifica locale, schermata premio |
| `public/js/deadline-audio.js` | AUDIO | `window.DEADLINE_AUDIO`: effetti e musica chiptune sintetizzati |
| `public/js/deadline-net.js`, `public/js/deadline-sign.js`, `public/_worker.js` (solo le rotte /api/deadline/*), `docs/deadline-server.md`, `scripts/deadline-d1.sql`, pagina di approvazione | NET | classifica sul server, anti imbrogli, premio, motore dell'insegna |

Ordine di caricamento nella pagina: deadline-art.js, deadline-audio.js, deadline-sign.js, deadline-net.js, deadline.js.
Ogni modulo deve funzionare anche se un altro manca (CORE usa rettangoli segnaposto se ART manca, silenzio se AUDIO
manca, classifica in localStorage se NET manca o il server risponde errore).

## Schermo
- Gioco logico 480 x 270 pixel (canvas "pixel", imageSmoothing off, ingrandito a numero intero quando possibile,
  altrimenti al massimo che sta, sempre nitido: CSS image-rendering: pixelated).
- Sopra, un secondo canvas a risoluzione piena (devicePixelRatio, max 2) per le luci morbide: bagliori dei neon, scie,
  particelle luminose, linee del monitor (scanline), vignetta e leggera curvatura. Il bagliore si ottiene disegnando
  sul canvas FX in modalita' 'lighter' versioni sfocate (pre-renderizzate una volta) degli sprite luminosi.
- Il canvas pixel e' la verita' del gioco; l'FX e' solo luce.

## API di ART (window.DEADLINE_ART)
Tutte le funzioni disegnano su un CanvasRenderingContext2D a coordinate del gioco (pixel interi). `t` = secondi.
- `ART.init()` prepara le cache (una volta). `ART.ready` true dopo.
- `ART.font`: `ART.text(ctx, str, x, y, {color, size:1|2|3, align:'l'|'c'|'r', shadow})` -> larghezza. Font a pixel 5x7
  leggibile con maiuscole, minuscole, cifre, punteggiatura (. , : ; ! ? ' " - + / % # @ & ( ) < > x *). `ART.textWidth(str, size)`.
- `ART.ship(ctx, x, y, t, s)` centro in x,y. s = {bank:-1..1 (inclinazione), thrust:0..1, shield:0..1, flash:bool, power:'auto'|'ai'|null}.
  Circa 24 x 20 px. Muso a punta in alto, ali, tre motori ad arco pomodoro dietro (le tre gambe della m), segno della m
  piccolo su un'ala. Deve leggersi subito come una nave vera, figa, non stilizzata.
- `ART.enemy(ctx, type, x, y, t, s)` type: 'call' | 'invoice' | 'receipt' (mezza fattura) | 'noshow' | 'spam' | 'double'
  (uno dei due legati) | 'gold' (variante dorata: s.base = tipo sotto). s = {hit:0..1 lampo bianco, phase, fade:0..1 per
  noshow}. Dimensioni: call 18x16, invoice 16x18, receipt 10x12, noshow 16x20, spam 9x7, double 14x14.
  Ognuno con 2-4 fotogrammi di animazione (vibra, ondeggia, tremola) presi da t.
- `ART.boss(ctx, name, x, y, t, s)` name 'urgent' (busta rossa grande, ~64x44) | 'monday' (grande calendario con la
  faccia, ~120x90). s = {phase:1|2|3, hp:0..1, hit:0..1, rage:0..1, pagesTorn:n, mouth:0..1}.
- `ART.bullet(ctx, kind, x, y, t, a)` kind: 'player' (lineetta pomodoro con scia), 'ring' (onda ad arco della call),
  'shard' (scheggia di carta), 'dot' (puntino spam), 'mail' (busta piccola del boss), 'alarm' (nota/onda della sveglia),
  'block' (blocco riunione: usa `ART.meeting(ctx,x,y,w,h,t,label)`). a = angolo se serve.
- `ART.powerup(ctx, kind, x, y, t)` kind 'auto' | 'ai' | 'booking' | 'night' | 'coin' : capsula 12x12 con icona.
- `ART.firewall(ctx, x, y, mask)` blocco 36x14; mask = Uint8Array (36*14) 1 = pixel intatto (CORE lo consuma pixel per pixel).
  `ART.firewallMask()` -> maschera nuova piena con la forma giusta (angoli smussati, una feritoia).
- `ART.sky(ctx, day, t)` sfondo pieno 480x270 del giorno: day 'tue'|'wed'|'thu'|'fri'|'sat'|'sun'|'mon'|'night' (night = blu
  della Night shift). Gradiente a bande (dithering a pixel, niente gradienti lisci), stelle o sole/luna dove serve.
- `ART.skyline(ctx, day, scroll, t)` strato lontano (sagome, finestre rade).
- `ART.towers(ctx, day, scroll, t, billboards)` strato di mezzo, torri con cartelloni pubblicitari: billboards = array di
  {img (canvas o null), name, kind} da mostrare sui cartelloni (insegne dei vincitori); se vuoto, cartelloni con
  pubblicita' finte dello studio ("THE MACHINE BEHIND YOUR BUSINESS", "TELL US WHAT SLOWS YOU DOWN", la m al neon).
- `ART.city(ctx, windows, t, day)` la citta' vicina in basso (alta ~34 px): windows = array di booleani (accesa/spenta),
  ART.cityWindows -> numero di finestre e le loro posizioni `ART.windowRects` [{x,y,w,h}].
- `ART.weather(ctx, day, t, intensity)` pioggia (tue), nebbia (wed), smog e insegne che sfarfallano (thu), coriandoli e
  luci (fri), scintille calde (sat), niente (sun), glitch rosso (mon).
- `ART.building(ctx, kind, x, y, w, h, t, sign)` i sei palazzi della CITY: 'food' | 'fashion' | 'shop' | 'beauty' | 'hotel' |
  'services', con `sign` = {img, name} (insegna al neon del vincitore) o null (insegna spenta "FOR RENT"/ "YOUR SIGN HERE").
- `ART.logo(ctx, x, y, t, glitch)` il titolo DEADLINE grande (lettere squadrate a pixel, neon che sfarfalla, ~200x40).
- `ART.mark(ctx, x, y, size, t)` la m di Mother Machine in pixel (per "MOTHER MACHINE PRESENTS").
- `ART.icon(ctx, name, x, y)` icone HUD 7x7: 'coffee' | 'coffeeEmpty' | 'clock' | 'night' | 'auto' | 'ai' | 'booking' | 'coin'.
- `ART.explosion(ctx, x, y, t0, t, kind)` scoppio a pixel (scintille che cadono e si spengono).
- `ART.glow(name)` -> canvas sfocato pre-renderizzato per il layer FX ('player', 'pomodoro', 'gold', 'red', 'cyan', 'ship').
- `ART.palette` i colori usati (oggetto), `ART.days` i colori del giorno: {tue:{sky:[...],accent}, ...}.
ART crea anche `public/deadline-art-test.html`?? NO: niente file nuovi in public oltre ai suoi. Per provare usa una pagina
nella cartella scratch (vedi sotto).

## API di AUDIO (window.DEADLINE_AUDIO)
- `A.unlock()` da chiamare a un gesto (crea/riprende l'AudioContext).
- `A.sfx(name, opt)` name: 'shoot' | 'shootAuto' | 'hit' | 'kill' | 'split' | 'blip' (noshow sparisce) | 'hurt' (colpo
  subito, tazza) | 'cityHit' (finestra spenta) | 'power' (preso un potenziamento) | 'shield' | 'shieldBreak' | 'night'
  (Night shift) | 'coin' (moneta d'oro, speciale) | 'combo' (entra FLOW STATE) | 'clockOut' (fine giornata) | 'urgent'
  (arriva URGENT) | 'alarm' (la sveglia di MONDAY) | 'rip' (strappa la pagina) | 'bossHit' | 'bossDie' | 'gameOver' |
  'win' | 'insertCoin' | 'select' | 'type' (lettera iniziali). opt.pan -1..1.
- `A.music(track, opt)` track: 'title' | 'tue'..'sun' | 'mon' | 'boss' | 'night' | 'over' | 'win' | null (stop).
  opt.intensity 0..1 (accelera e si riempie quando restano pochi nemici), opt.flow true (FLOW STATE: piu' piena).
  `A.intensity(v)`, `A.flow(on)`, `A.stopAll()`, `A.mute(on)`, `A.muted`, `A.duck(on)` (pausa).
- Volume moderato, compressore finale. Se la musica del sito (window.MUSICA) suona, CORE la mette in pausa all'apertura.

## API di NET (window.DEADLINE_NET)
- `NET.start()` -> Promise<{run, token}> (il server firma l'inizio partita; se il server manca: token locale).
- `NET.submit({run, token, initials, score, day, bossBeaten, duration, events})` -> Promise<{rank, top, verified}>.
  events = registro compatto per l'anti imbrogli (es. kill per minuto, giorni finiti con i tempi).
- `NET.top(n)` -> Promise<[{initials, score, day, date}]> (fallback localStorage `mm-deadline-top`).
- `NET.claim({run, token, initials, business, link, line, kind, logoPng})` -> Promise<{ok, pending:true}>: solo per chi
  ha battuto MONDAY (il server verifica dal run). Mail del vincitore chiesta nel modulo, cancellata dopo l'insegna.
- `NET.signs()` -> Promise<[{name, link, line, kind, img (url)}]>: solo insegne APPROVATE da Eso.
- `NET.offline` true se il server non c'e'.
- `window.DEADLINE_SIGN.process(fileOrBlob, {clean:0..1, color}) -> Promise<{canvas, png (Blob), w, h}>`: carica PNG/JPG/
  WebP/SVG (SVG rasterizzato, niente codice), toglie lo sfondo leggendo gli angoli, ritaglia e centra, trasforma in
  sagoma al neon a un colore. `DEADLINE_SIGN.preview(canvas, kind, sign)` disegna l'anteprima sul palazzo (usa ART.building).

## CORE: stati del gioco
BOOT ("MOTHER MACHINE PRESENTS" con la m) -> TITLE (DEADLINE, INSERT COIN / PRESS START, classifica che gira, la CITY che
scorre) -> PLAY (giorni TUE..SUN, MONDAY con il boss) -> CLOCKED OUT tra i giorni (riepilogo) -> GAME OVER ("Burnout. N
hours saved.") o WIN (dopo MONDAY: "Your sign goes up in the city.") -> INITIALS -> (WIN: modulo premio) -> CITY/TITLE.
Pausa = "Out of office" (P, Esc chiude l'overlay solo da TITLE; in partita Esc = pausa).

## Integrazione con la stanza (la fa il capo)
- `window.DEADLINE.open(x, y)` apre l'overlay dal punto (come RUSH.open), `DEADLINE.close()`.
- Sulla pagina /lg i file si caricano al posto di rush.js/rush.css.

## Come provare senza disturbare gli altri
Non usare `npm run build` ne' la porta 4321 (altri ci lavorano). Ognuno usa una pagina di prova sua nella cartella
`/tmp/claude-0/-home-user-mother-machine/2cd0d78c-411a-5443-ac4d-af9c3d1cc606/scratchpad/deadline/` che carica i file da
/home/user/mother-machine/public via un server statico: `python3 -m http.server PORTA --directory /home/user/mother-machine/public`
(porte: ART 8101, CORE 8102, AUDIO 8103, NET 8104) e la pagina di prova copiata dentro public? NO: metti la pagina di prova
in public con nome `public/_prova-<tuo>.html` e cancellala alla fine (il capo controlla). Playwright con
executablePath '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'. Screenshot nella cartella scratch deadline/shot-<tuo>/.
