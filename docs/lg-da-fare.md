# LG · Machine Room · lista dei lavori (da Eso, dopo la pull request #11)

Da fare a piccoli blocchi, pochi token. File: `public/js/stanza.js` (motore e stanza), `public/js/stanza-oggetti.js`
(oggetti e modelli), `public/css/stanza.css`, `public/js/stanza-vista.js` (primo piano), `public/js/musica.js`.

## Subito (primo blocco)
- [ ] Togliere i puntini bianchi a bassa opacita' al centro della pagina (sembrano bollicine, ci cade l'occhio).

## Oggetti
- [ ] **Mobiletto dei vinili:** al passaggio si illumina tutto (mobiletto, giradischi, dischi). Spostarlo ancora piu' a sinistra.
- [ ] **Cassa "AUDIO" con il synth:** piu' a sinistra e piu' in basso (verso l'angolo in basso a sinistra). Poi
  sostituirla con un'idea piu' intelligente (da proporre a Eso prima).
- [ ] **Telefono:** ancora brutto, da rifare. Anche il suo filo (strano, brutto).
- [ ] **Cavi della console** attorno alla cassa e dietro la TV: ancora spigolosi e strani, piu' morbidi e naturali.
- [ ] **Fili che vanno ai server:** togliere i quadratini/cubetti dove finiscono sotto i server. Solo il filo.
- [ ] **Spina della macchinetta del caffe':** filo da pulire e tagliare bene.
- [ ] **Bobina/prolunga accanto al banco:** il filo passa sopra la bobina, sistemarlo.
- [ ] **Trasformatore a terra** tra bobina e cabinato: il filo che parte dal cabinato entra troppo dentro, tagliarlo.
- [ ] **Scatola sotto la TV:** piu' personalita', senza appesantire.
- [ ] **Tavola di progetto** sulla parete destra: molto meglio, ma ancora da curare.
- [ ] **Pizza truck:** da rifare meglio.
- [ ] **Menu di Vitalia's** aperto (primo piano): l'interno da rifare.

## Server
- [ ] Rifare i rack nella stanza come quelli del popup "machine room live": ognuno col suo nome, la sua funzione,
  scritte, spie. Il popup piu' complesso, tecnico e serio.
- [ ] Uno dei quattro server diverso: **cyber security** (lucchetto, password, aria seria). Non "dati sensibili"
  (sembrerebbe che teniamo dati della gente). Niente telecamera (mette ansia).

## Pulizia linee
- [ ] Soffitto: i tiranti delle lampade centrali e delle lampade in prospettiva entrano dentro le lampade, vanno tagliati.
- [ ] Altri microfix di linee qua e la'.

## Funzioni
- [ ] **TV:** il video non parte. Poi forse un video diverso.
- [ ] **Il gioco del cabinato:** al posto di Rush hour arriva DEADLINE (vedi la sezione sotto).
- [ ] **Musica:** cambiando pagina il player si ferma. Vorrebbe che ripartisse da solo (su telefono a volte lo fa).
  Nota: il browser blocca l'audio senza un tocco; vero play continuo = sito a pagina unica (Astro ClientRouter), da decidere.
- [ ] **Mini player:** in vetro (glassmorfismo fatto bene, con la tecnica del sito: niente backdrop-filter dal vivo
  su aree grandi), su computer e telefono. Su telefono oggi copre il selettore dei progetti in home: deve **sparire di
  lato**, piu' in alto, lasciando solo una linguetta da cui volendo lo tiri fuori.

## Il gioco: DEADLINE (deciso da Eso)
- **Tipo:** Space Invaders cyberpunk. Il nome: lettere squadrate in pixel, con glitch e neon che sfarfalla.
- **Il nostro tocco:** dal cielo della citta' di notte scendono le seccature di un'azienda (chiamate perse, fatture di carta,
  clienti che non si presentano, spam). I potenziamenti sono i nostri servizi (Automation = raffica, AI = mira da sola,
  Booking = scudo). Il gioco spiega cosa facciamo senza dirlo.
- **Boss finale: MONDAY.**
- **Cornice:** accensione "MOTHER MACHINE PRESENTS" con la m in pixel, poi INSERT COIN. Si tiene lo schermo cyberpunk di oggi.
  **Classifica** con le iniziali a tre lettere, che gira sullo schermo tra una partita e l'altra.
- **Premio segreto (mai annunciato):** chi batte MONDAY vede "Your sign goes up in the city." e mette la sua insegna in
  un palazzo della citta' del gioco. Niente sconti (sembrano un prezzo gonfiato), niente consulenza (e' gia' gratis).
- **Il modulo del vincitore:** logo (PNG, JPG, WebP o SVG), nome dell'attivita', link (sito o Instagram), cosa fanno
  (una riga, massimo 60 caratteri), tipo di attivita'.
- **Sei tipi di palazzo**, sagome semplici: Food & drink (basso, tenda, insegna sporgente); Fashion & retail (vetrine
  alte, manichino); Online shop (magazzino, serranda, pacchi, antenna); Beauty & wellness (stretto e alto, insegna
  verticale); Hotels & stays (torre con finestre a scacchi, insegna sul tetto); Services & trades (uffici, jolly).
- **Il motore dell'insegna, tutto nel browser, senza AI:** carica il file (l'SVG si trasforma in immagine, niente
  codice dentro), toglie lo sfondo leggendo il colore degli angoli, ritaglia e centra, trasforma il logo in una
  sagoma al neon a un colore (cosi' ogni logo viene bene), anteprima sul palazzo con un cursore "piu'/meno pulito".
- **Approvazione di Eso, obbligatoria:** l'insegna e il link restano in attesa finche' Eso non li approva con un tocco.
  File e dati su Cloudflare (R2 e D1, gratis a questi volumi).
- **Dove si clicca:** non durante la partita. Nella citta' della schermata d'attesa e nella classifica: passando sopra,
  la targhetta con nome e riga; cliccando, il loro link.
- **Comandi:** computer = frecce o WASD in quattro direzioni, spazio spara (tenuto: raffica). Telefono = la nave segue il dito
  (un po' sopra), spara da sola. La nave si muove solo nella meta' bassa dello schermo.
- **La nave:** una nave vera (muso a punta, ali), con tre motori pomodoro ad arco dietro (le tre gambe della m) e il segno
  piccolo su un'ala. Chi conosce il logo lo vede, gli altri vedono solo una bella nave.
- **Livelli = la settimana:** Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday (calmo), poi MONDAY. Ogni giorno va
  dalle 9 alle 17 con l'orologio in alto; alle 17:00 "Clocked out". Il cielo cambia colore giorno per giorno.
- **Nemici:** Missed call (telefono che squilla, zig-zag), Paper invoice (si sdoppia se colpita), No-show (sparisce e
  riappare), Spam (sciami piccoli e veloci).
- **MONDAY in tre fasi:** raffiche di email, blocchi delle riunioni che scendono come muri, sveglia delle 9:00 impazzita.
  E' un grande calendario con la faccia; ferito, strappa le sue pagine.
- **Potenziamenti** (cadono da nemici speciali): Automation (raffica), AI (mira da sola), Booking (scudo), Night shift
  (per qualche secondo lavora da solo).
- **La citta' sotto:** finestre accese; un nemico che tocca terra spegne una finestra; tutte spente = "The business closed."
- **Punteggio = HOURS SAVED.** Vite = tre tazze di caffe' ("Out of coffee"). Combo = "FLOW STATE" (punti doppi).
  Pausa = "Out of office". Morte = "Burnout". Fine = "Burnout. 412 hours saved."
- **Moneta d'oro** rara: bonus, e lo stesso segno del premio finale (fa capire che c'e' qualcosa da scoprire).
- **Easter egg:** codice Konami = "Weekend mode", caffe' infinito, niente classifica.
- **Musica:** la nostra chiptune, accelera quando restano pochi nemici. Tasto M = muto. "Riduci movimento" = niente lampi.
- **Fine partita:** iniziali in classifica e un bottone discreto "Want this for real? Tell us what slows you down." -> Contact.
- **Difficolta':** partita intera 5-6 minuti; MONDAY lo batte circa 1 su 20.
- **Anti imbrogli:** il server controlla che il punteggio sia possibile nel tempo giocato e limita i tentativi.
- **Un gioco solo, fatto bene.** Idee per dopo, forse: Night Shift (scorrimento), Night Drive (stile OutRun, mai il truck
  di Vitalia's: e' un lavoro per un cliente).
