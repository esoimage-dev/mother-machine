# Piano di lavoro · Mother Machine · il file unico delle cose da fare

Qui c'e' **tutto** quello che resta da fare, deciso con Eso fino al 23 ottobre 2026: sito, LG, gioco, Contact, back
office, sicurezza, legale, lancio, crescita. CLAUDE.md dice com'e' fatto il progetto e le regole; questo file dice
cosa fare e in che ordine. Si spunta qui. (Ha assorbito `docs/lg-da-fare.md`: la lista di LG e il piano del gioco sono qui dentro, interi.)

Obiettivo di Eso: **lanciare tra pochi giorni**. Due binari:
- **A · Lancio:** quello che serve per essere online, credibili, sicuri e pronti a prendere clienti.
- **B · Dopo il lancio:** contratti, back office, sicurezza dei clienti, gioco, crescita.
Ogni blocco: modifica -> anteprima -> pull request unita da Eso. Agenti solo dove servono davvero (audit, lavori grossi).

---

# BINARIO A · LANCIO

## A1 · Contact vero (priorita' numero uno: senza, il sito non prende clienti)
Progetto completo in `docs/archivio/percorso-contatto.md` (verita' visiva: `prototipo/contact.html`, cinque scene).
**Serve prima da Eso:** account Resend e Daily; chiavi come segreti su Cloudflare (mai in chat ne' nella repository);
record DNS di Resend su Cloudflare.
- [ ] **Modulo "ordine di lavoro"**: numero `G-AAMM-NN`; passi Need -> You -> Start, due strade: Talk (call gratis di 30
  minuti, scelta dell'orario) o Write (brief, poi volendo anche la call). Orari lun-ven 9:30, 11:00, 14:00, 16:30 ora
  dello studio, mostrati al cliente nel suo fuso. Messaggi dopo l'invio come nel prototipo.
- [ ] **Salvataggio** in Cloudflare D1 (ordini, orari, token). **Anti spam** Turnstile (niente cookie).
- [ ] **Quattro mail** (Resend, da hello@, in EN/IT/ES/FR): Confirm (subito, l'orario si libera se non confermato in
  24 ore), Reminder 1 (24 ore prima), Reminder 2 (1 ora prima), Received (brief senza call). Firma "Just reply, a
  person reads it." Avviso a noi a ogni ordine nuovo.
- [ ] **Posta che arriva davvero:** SPF, DKIM, DMARC su Cloudflare. Posta in uscita come hello@ (anche "Invia come" nel Gmail).
- [ ] **Pagina "Your call is confirmed"** (dal link della mail): giorno e ora nel fuso del cliente, Add to calendar
  (Google, Apple, Outlook), "Pick another time".
- [ ] **La stanza della call:** pagina nostra con Daily dentro, vestita Mother Machine (anteprima camera, Mic, Camera,
  Share screen, Leave, "On the table" con l'ordine). Link solo per mail. Le call non si registrano.
- [ ] **Cron del Worker:** promemoria e orari non confermati liberati dopo 24 ore.
- [ ] Da decidere con Eso: la **riga privacy sotto il bottone d'invio**.

## A2 · Sicurezza nostra (prima del lancio; non si racconta sul sito)
**Fa Eso, con Claude che guida passo passo (circa un'ora):**
- [ ] Gestore di password (Bitwarden o 1Password), password diverse ovunque.
- [ ] 2FA con app o passkey (non SMS) su GitHub, Cloudflare, GoDaddy, Gmail dello studio, Resend, Daily.
- [ ] GoDaddy: blocco del dominio e rinnovo automatico.
- [ ] GitHub: **repository privata** (oggi e' pubblica), protezione di `main`, Dependabot e secret scanning.
- [ ] Cloudflare: chiavi API con permessi minimi; segreti solo li'.
**Fa Claude:**
- [ ] Intestazioni di sicurezza (CSP, HSTS), Rate Limiting su `/api/porta` e sui moduli.
- [ ] **La porta del back office:** oggi basta il codice della pulsantiera (chiave tenuta 3 secondi, tastierino,
  `MM_DOOR_CODE` sul server). Il codice resta come gioco/easter egg, ma `/lg/room` e poi la Machine Room vanno dietro
  **Cloudflare Access** (gratis fino a 50 persone): entra solo la mail di Eso, con codice via mail o Google + 2FA.

## A3 · Audit completo e salto di qualita' (piu' agenti in parallelo)
Ogni agente fa un rapporto con priorita'; Eso sceglie; poi si fa. Livello di riferimento: Metalab, Lusion, Work & Co.
Regole che restano: testata, logo, pulsantiera, cursore, vetro non si toccano; pomodoro solo su cio' che si muove.
- [ ] **Grafica e tipografia:** testi grandi e decisi, gerarchia, spazi. **Hero** di ogni pagina e **footer** (il footer
  si puo' ripensare con Eso).
- [ ] **Sezioni e contenuti:** dentro ogni pagina cosa e' ridondante, cosa manca, cosa si capisce subito. Niente doppioni.
- [ ] **Copy:** inglese corto, immediato, niente gergo.
- [ ] **UX e telefono:** pulsantiera, ascensore, scroll, tocchi.
- [ ] **Prestazioni e accessibilita':** 60 fps, pesi, Lighthouse, contrasti, tastiera, riduci movimento.
- [ ] **Browser veri:** Safari iPhone, Android, Firefox. Link rotti. **Pagina 404** nello stile del palazzo.
- [ ] **Nuovo segno grafico (idea di Eso): la selezione pomodoro.** Quando col mouse (cursore a I) si seleziona il testo,
  di solito il box e' blu; da noi e' il nostro pomodoro forte, e sui titoli grandi e' bellissimo: una "sporcatura"
  grafica coerente con lo stile. Usarlo ogni tanto (una parola "selezionata" in un titolo, magari che si seleziona da sola allo
  scroll). Poche volte, mai ovunque.
- [ ] **Troppa roba e ripetizioni (Eso, 24 ottobre):** nel sito ci sono troppe cose e troppi doppioni: sfoltire.
  Idea di Eso da valutare nell'audit: **unire Brand e Systems in una pagina "Services"** concentrata sui sistemi
  (sul brand c'e' meno da dire).
- [ ] **Decisioni aperte da chiudere nell'audit:**
  - Studio, regola 03 "One number to move." ripete il titolo della home: cambiarla?
  - LG, frase sotto la stanza: "You can watch. Only we touch." oppure "Look around. Touch what glows."
  - Brand apre al buio, il manuale lo vuole bianco.
  - Home: apertura con il citofono su telefono e versione B su computer, da rivedere.
  - Testi di LG e Systems dopo la fusione.
  - Brand "The system": oggi bozza statica, animarla (anche dopo il lancio).

## A4 · Bug e ritocchi del sito (prima del lancio)

### Segnalati da Eso il 24 ottobre (MacBook, Chrome e Safari) - da fare per primi
- [ ] **Chrome: il sito e' scattoso e flasha** (home soprattutto, a volte LG). Su Safari invece e' liscio. Cause
  probabili: troppi SVG animati, animazioni che girano fuori schermo, filtri/blur costosi, ridisegni continui. Fare un
  profilo delle prestazioni su Chrome (Performance panel con Playwright) e togliere i colpevoli.
- [ ] **Safari: il vetro (glassmorfismo) e' sfocato male, sgranato / non a fuoco** in home: la sezione con Brand e
  Systems e quella con le sei animazioni.
- [ ] **Safari: il cambio piano (ascensore) flasha**: per un istante si vede il piano nuovo, sparisce e ricompare.
- [ ] **Safari, LG: zoomando la pagina a volte sparisce la testata.**
- [x] **Chrome e Safari, home: il selettore dei lavori sale troppo presto**: gia' quando si e' quasi ancora sulla hero
  sta in alto e segue lo scroll. Su computer deve restare fermo sotto la striscia dei lavori, non seguire; valutare
  lo stesso su telefono (dove copre i progetti). Nota di Eso: trascinamento + selettore insieme sono un po' ridondanti.
- [x] **Chrome e Safari, LG: il giradischi non apre piu' la finestra del lettore** (cliccandolo non succede niente;
  il mini player non c'entra). Probabile conflitto con il cabinato/DEADLINE o con l'ordine degli script: verificare.
- [x] **Home, trascinamento della striscia dei lavori** (soprattutto su computer): scatta, glitcha, lento e macchinoso.
  Mentre trascini **seleziona il testo delle schede** (tutto pomodoro): durante il trascinamento la selezione va
  bloccata. Rifarlo liscio. (Il selettore sotto funziona bene.)
- [x] **Mini player della musica:** in vetro fatto bene (tecnica del sito, niente backdrop-filter dal vivo su aree
  grandi), computer e telefono. Su telefono oggi copre il selettore dei progetti in home: deve **sparire di lato**,
  piu' in alto, lasciando una linguetta da cui tirarlo fuori.
- [ ] **Musica tra le pagine:** cambiando pagina si ferma; Eso vorrebbe che ripartisse da sola. Il browser blocca l'audio
  senza un tocco; il vero play continuo vuol dire sito a pagina unica (Astro ClientRouter), lavoro grosso: decidere.

## A5 · LG, la sala macchine: ritocchi (lista intera di Eso)
File: `public/js/stanza.js` (motore e stanza), `public/js/stanza-oggetti.js` (oggetti e modelli), `public/css/stanza.css`,
`public/js/stanza-vista.js` (primo piano), `public/js/musica.js`. A piccoli blocchi.

### Subito (primo blocco)
- [ ] Togliere i puntini bianchi a bassa opacita' al centro della pagina (sembrano bollicine, ci cade l'occhio).

### Oggetti
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

### Server
- [ ] Rifare i rack nella stanza come quelli del popup "machine room live": ognuno col suo nome, la sua funzione,
  scritte, spie. Il popup piu' complesso, tecnico e serio.
- [ ] Uno dei quattro server diverso: **cyber security** (lucchetto, password, aria seria). Non "dati sensibili"
  (sembrerebbe che teniamo dati della gente). Niente telecamera (mette ansia).

### Pulizia linee
- [ ] Soffitto: i tiranti delle lampade centrali e delle lampade in prospettiva entrano dentro le lampade, vanno tagliati.
- [ ] Altri microfix di linee qua e la'.

### Funzioni
- [ ] **TV:** il video non parte. Poi forse un video diverso.
- [ ] **Il gioco del cabinato:** al posto di Rush hour arriva DEADLINE (vedi B5).
- [ ] **Musica:** cambiando pagina il player si ferma. Vorrebbe che ripartisse da solo (su telefono a volte lo fa).
  Nota: il browser blocca l'audio senza un tocco; vero play continuo = sito a pagina unica (Astro ClientRouter), da decidere.
- [ ] **Mini player:** in vetro (glassmorfismo fatto bene, con la tecnica del sito: niente backdrop-filter dal vivo
  su aree grandi), su computer e telefono. Su telefono oggi copre il selettore dei progetti in home: deve **sparire di
  lato**, piu' in alto, lasciando solo una linguetta da cui volendo lo tiri fuori.
- [ ] Da ridisegnare (lista vecchia di Eso): tazzina e tazza, divano nel complesso.

### Aggiunte di Eso (dopo l'inizio di DEADLINE)
- [x] Cabinato: insegna DEADLINE e schermo con le seccature in fila, la nave e la citta' (fatto).
- [ ] **Logo DEADLINE da pensare bene** (alla fine, quando il gioco c'e'): come farlo figo; poi riportarlo sull'insegna
  del cabinato nella stanza (la cassa da fuori va ritoccata di poco per accoglierlo).
- [ ] Sul cabinato o vicino, da fuori: magari un nemico o il boss principale (MONDAY) e il protagonista. Alla fine.
- [ ] **L'astronave di Mother Machine in 3D come oggetto nella stanza** (un modellino, appeso o su una mensola), dopo che
  la nave del gioco e' decisa (nave o altro mezzo, da confermare con Eso).
- [ ] **Audit completo di LG fatto da Claude**, prima di rifare la stanza: linee, cavi e fili, oggetti da rifare, da
  spostare, da mettere piu' armoniosi; se c'e' troppa roba; ogni elemento singolo da migliorare (rack e server compresi;
  l'oggetto in basso a sinistra, oggi la cassa AUDIO con il synth: cambiarlo e/o metterlo meglio, o toglierlo se e'
  troppo). Il risultato e' una lista con priorita' da approvare con Eso, poi si fa tutto insieme.

## A5b · Note rimaste aperte nei piani vecchi (`docs/archivio/`), da verificare nell'audit
Alcune potrebbero essere gia' fatte: nell'audit si controlla e si spunta. Fonti: `DA-FARE-vecchio.md`, `AUDIT.md`.
- [ ] Home: frase sotto il titolo piu' corta (proposta vecchia: "Software your company runs on. A brand it's known by.").
- [ ] Home: ordine delle sezioni, lo slider di 05.4, i "three steps" di 05.5.
- [ ] Home: il bottone dell'apertura porta dritto a Contact con l'ascensore (non alla porta G in fondo).
- [ ] Via la scritta tecnica "wght 400" (rumore per chi visita).
- [ ] Via i codici di sezione interni ("05.2 · What we build", "Study 03 Systems", "M-04") e le troppe etichette mono
  sopra i titoli: dove il titolo basta, l'etichetta va via. Un momento forte per sezione, non tre.
- [ ] Una demo protagonista per piano (Brand e Systems: una forte, il resto si accorcia).
- [ ] Testo nuovo della pagina Work; footer di Work senza le lingue.
- [ ] Pagine progetto: via "da confermare" e "Bozza"; citazione e foto vere; materiali veri dei progetti.
- [ ] Contact: riga privacy sotto il bottone ("We only use this to answer you. Privacy."); al posto di "Already
  booked?" la frase "Lost it? Enter your order number and we send the link again."
- [ ] Privacy: nome legale, registrazione (ABN), indirizzo, rilettura da avvocato, togliere la scritta "Bozza".
  ABN anche nel footer.
- [ ] Doctype nelle pagine, con confronto visivo completo prima/dopo.
- [ ] Dopo il lancio: la posta dentro la Machine Room (Email Routing -> Worker -> D1), il Gmail resta come copia.
- [ ] Brand: altre modifiche che dara' Eso.
- [ ] Idea vecchia per LG (da rivalutare): "le provette" con i nostri prodotti.

---

# BINARIO A · ULTIMI PASSI

## A6 · Legale minimo per il sito
- [ ] **Privacy:** chi raccoglie i dati (nome legale), cosa, perche', quanto si tengono, dove stanno (Cloudflare,
  Resend, Daily), come chiederne la cancellazione (hello@). Privacy Act australiano e GDPR (clienti europei).
  Niente cookie di tracciamento, niente banner (regola che resta).
- [ ] **Terms del sito**, brevi: uso del sito, gioco e premio, nessuna garanzia sui contenuti.
- [ ] I termini dei progetti stanno nel contratto (B1), non sul sito.

## A7 · SEO e presenza
- [ ] Titoli e descrizioni, Open Graph con immagini, sitemap, robots, dati strutturati (organizzazione, lavori).
- [ ] Cloudflare Web Analytics (gratis, niente cookie).
- [ ] Al lancio: Google Search Console e **profilo Google Business** (conta molto per le attivita' locali a Cairns).

## A8 · Lingue
- [ ] Decide Eso: quali lingue al lancio (inglese, + italiano?) e nascondere quelle non pronte nella targhetta, o aspettare.
- [ ] `/it/`, `/es/`, `/fr/` con hreflang. Tradotto da Claude, controllato da madrelingua (ES e FR: serve qualcuno).
  Anche le quattro mail del Contact.

## A9 · Lancio
- [ ] `PRIMA_DEL_LANCIO = false`, controllo finale su tutti i dispositivi, ordine di prova dal Contact fino alla call.

---

# BINARIO B · DOPO IL LANCIO

## B1 · Contratti, fatture, fisco (prima del back office, che poi li automatizza)
Verificare **una volta** con un commercialista (fisco) e un avvocato (contratto). Claude prepara le bozze.
- [ ] **Fisco:** ipotesi piu' semplice, tutto dall'Australia con ABN anche ai clienti esteri (export di servizi: di
  solito senza GST; in Italia il cliente con partita IVA gestisce l'IVA). **Dipende da dove Eso e' residente per le
  tasse:** e' la domanda per il commercialista. Niente societa' o partita IVA italiana finche' non serve. Nome legale e GST.
- [ ] **Contratto tipo** (Statement of Work + condizioni generali), firmato prima di partire:
  scope (cosa c'e' e cosa no) e consegne; **revisioni contate** (es. 2 giri per fase, poi a ore); **assistenza**
  (es. 30 giorni sui bug, poi piano mensile); **proprieta'**: il cliente possiede il suo prodotto e i suoi contenuti
  dopo il pagamento completo, Mother Machine resta proprietaria dei pezzi riusabili (motori, componenti) e li concede
  in licenza; pagamenti a tappe (es. 40/30/30); cliente che sparisce; limite di responsabilita'; diritto di mostrare il
  lavoro nel portfolio (numeri approvati); firma digitale.
- [ ] **Fatture:** tax invoice con ABN, GST se serve, numerata, PDF.

## B2 · Back office (Machine Room vera, la parte piu' grossa, a pezzi)
Progetto visivo: scena 5 del prototipo (Orders, Calls, Inbox, Quotes; contatori; calendario; scheda ordine con Reply,
Move call, Make quote; stato delle mail; notifica "New work order" sul telefono). Dietro Cloudflare Access (A2).
- [ ] Ordini dal Contact (lista, stato, note).
- [ ] Preventivi -> contratto da firmare -> **fatture automatiche** (pagata / da pagare). Eso non le scrive piu' a mano.
- [ ] Calendario delle call Daily. Stanza Daily vestita Mother Machine (se non gia' fatta in A1).
- [ ] **Risponditore di mail** su hello@: risposte nel nostro tono; le semplici partono, le altre in bozza da approvare.
- [ ] Approvazione delle insegne del gioco DEADLINE (B5).

## B3 · Sicurezza per i clienti (e cosa offriamo davvero)
- [ ] **Subito sui lavori consegnati** (Vitalia's Pizza on Wheels e Vitalia's Restaurant): il back office ha solo una
  password. Mettere Cloudflare Access (o login con 2FA), limite ai tentativi, sessioni che scadono, password solo come
  hash forte, backup automatici, registro degli accessi, aggiornamenti. Lavoro piccolo: proporlo come miglioria o regalarlo.
- [ ] **Standard "secure by default"** per ogni progetto nuovo, una nostra checklist: 2FA o Access, permessi minimi,
  dati cifrati, backup e prova di ripristino, monitoraggio e avvisi, aggiornamenti, nessuna chiave nel codice, privacy
  fatta bene. E' quello che vendiamo.
- [ ] **Testi sul sito** (Systems, il server della cybersecurity in LG): solo cose vere. Niente certificazioni che non
  abbiamo, niente "military grade". Riscriverli dopo B3.

## B4 · Crescita (piccolo, NON prioritario ora)
- [ ] Eso trova i clienti di persona: **mini kit** (una pagina PDF o link alla demo, due frasi, QR del sito).
- [ ] Testimonianze dei clienti (una frase di Vitalia's), con il loro permesso.
- [ ] Lavori nuovi in Work appena arrivano (sostituiscono Birrificio Mare e Forno Nove).
- [ ] Piu' avanti, se serve: Instagram/LinkedIn con contenuti dal sito (stanza, demo, gioco) e poche sponsorizzate. Non ora.

> **Stato al 24 ottobre:** il gioco gira (scorrimento laterale, M8, sette boss che parlano, sistemi, virus, consegne,
> plancia, Game Boy su telefono, audio). Progetto e cosa resta: **`docs/deadline/`** (DA-FARE.md per ripartire).

## B5 · DEADLINE, il gioco del cabinato (al posto di Rush hour, `public/js/rush.js`) · piano intero
Tutto quello che abbiamo deciso, per intero (in ordine di come e' nato nella discussione).

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
- **Come si vede:** pixel art moderna, non a pixeloni: schermo di gioco 480x270 ingrandito (dettaglio alla Katana Zero /
  Hyper Light Drifter, non Atari). Sopra, a piena risoluzione, le luci morbide: bagliore dei neon, scie, particelle,
  linee del monitor e leggera curvatura. Pochi colori: notte, crema, pomodoro, piu' un colore per giorno (Monday rosso).
- **Classifica:** iniziali di tre lettere con filtro parolacce. La mail si chiede solo al vincitore di MONDAY e si cancella
  dopo l'insegna. Una riga nella privacy, niente banner.
- **Regole del premio** (una riga sotto il modulo): "One sign per business. We review every sign before it goes up. No cash value."
- **Il cabinato nella stanza:** lo schermo mostra il titolo DEADLINE che sfarfalla e la classifica che scorre (al posto di RUSH HOUR).
- **Ordine di lavoro:** (1) gioco giocabile nel browser: nave, nemici, sette giorni, MONDAY, punteggio; (2) grafica, suoni,
  scritte, accensione; (3) classifica sul server con anti imbrogli (Cloudflare D1); (4) premio: modulo, motore
  dell'insegna, approvazione, palazzi (Cloudflare R2). Ogni passo si guarda sull'anteprima prima del successivo.
- **Schermata:** in alto, sottile: a sinistra giorno e orologio (9-17, fa da barra di avanzamento), al centro HOURS SAVED,
  a destra le tazze di caffe'. In basso, piccolo: a sinistra il potenziamento attivo con la barra che si svuota, a destra
  lo slot di NIGHT SHIFT. Sotto la nave la citta' con le finestre (la vita).
- **Sparo:** un colpo solo, lineetta pomodoro corta con scia. Niente armi da scegliere, cambia solo con i potenziamenti.
- **Potenziamenti:** cadono da un nemico speciale dorato (1-2 per giorno), capsula con icona, si prendono passandoci sopra.
  AUTOMATION (10 s): tre colpi a ventaglio, motori piu' lunghi. AI (10 s): colpi che curvano verso i nemici, mirino.
  BOOKING: scudo a bolla di vetro tonda che para tre colpi (la cybersicurezza; nave squadrata = machine, scudo tondo = mother).
  NIGHT SHIFT: va nello slot, si usa quando vuoi (tasto X, due dita sul telefono): schermo blu notte, la nave va da sola
  e ripulisce tutto per 3 secondi.
- **Nemici in dettaglio:** Missed call (telefono che vibra, zig-zag, tira onde "ring"); Paper invoice (foglio con timbro,
  lento, colpito si divide in due ricevute); No-show (sagoma tratteggiata col cartellino "table 4", sparisce e ti riappare
  vicino, ti viene addosso); Spam (busta con "!!!", sciami a onda, puntini); Speciale dorato (lascia il potenziamento).
  In piu': **Double booking** (due nemici legati, vanno colpiti tutti e due). **Mini-boss del venerdi': URGENT**, una
  grande busta rossa alle 16:59.
- **Ripari:** al posto dei bunker di Space Invaders, tre blocchi **FIREWALL** sopra la citta' che si consumano pixel per pixel.
- **I giorni:** TUE blu notte e pioggia (solo Missed call); WED nebbia viola (Paper invoice); THU smog verde acido, insegne
  che sfarfallano (No-show); FRI rosa, luci da festa, musica veloce, URGENT; SAT tramonto arancio, tanti Spam; SUN alba
  chiara, quasi vuoto, silenzio; MONDAY rosso allarme, glitch, la sveglia, poi il boss. Ogni giorno circa 45 s in tre
  ondate; tra i giorni "CLOCKED OUT 17:00" e il riepilogo. Partita intera circa 6 minuti.
- **Lo sfondo a tre strati:** skyline lontano (sagome, si muove appena), torri di mezzo con i **cartelloni pubblicitari**,
  citta' vicina con le finestre. Pioggia, nebbia, scintille davanti.
- **Le insegne dei vincitori:** durante la partita stanno sui cartelloni delle torri di mezzo (ogni giorno ne girano
  altre, si vedono ma non si cliccano). Si cliccano nella **CITY**: la schermata tra una partita e l'altra e dopo il
  game over, una citta' ferma che si fa scorrere con calma; passando su un'insegna la targhetta (nome, cosa fanno),
  cliccando il loro link. In piu' la lista nella classifica.
- **Tocchi:** nemico colpito = pixel che cadono come scintille; colpo subito = lo schermo trema e la tazza si rovescia;
  FLOW STATE = lo sfondo pulsa a tempo; entrata di MONDAY = la musica si ferma, suona la sveglia, il calendario scende e
  strappa la pagina SUNDAY.
- **Un gioco solo, fatto bene.** Idee per dopo, forse: Night Shift (scorrimento), Night Drive (stile OutRun, mai il truck
  di Vitalia's: e' un lavoro per un cliente).

**Aggiunte di Eso (dopo i primi screenshot).** Mappa del mondo tra i giorni (la citta' dall'alto con sette quartieri e
la torre di MONDAY, la nave che avanza e sblocca il giorno dopo, come Super Mario Bros; non un calendario). Intro
narrativa corta e buffa che scorre come Star Wars, saltabile ("Not long ago, in an office not so far away..."). MONDAY
un pizzico piu' cattivo. Nave da rifare molto piu' figa; nemici, colpi, potenziamenti e interfaccia piu' fighi; valutare
personaggi con piu' dettaglio dello sfondo. Livelli diversi tra loro (meccanica o sorpresa per giorno). Piu' giri di
verifica e miglioramento con gli agenti.

**Ordine di lavoro deciso da Eso (notte del 23 ottobre):** DEADLINE con piu' giri di revisione completa (vedi le
liste in scratch DESIGN-V2.md, riportate qui a fine lavoro) -> poi LG (A5 e aggiunte) con piu' giri -> poi l'audit
completo del sito (A3).

## B6 · Altre cose belle (quando c'e' tempo)
- [ ] Animazioni allo scroll, film nuovo, footer ripensato (se non fatto in A3).
- [ ] LG: idee in piu' (inquadratura d'angolo, altri giochi).
- [ ] Grafiche messe da parte (CLAUDE.md sezione 10: Switchboard, AI privata, Work orders, Register) da rivedere per Systems.

---

## Da Eso (fuori dal codice), in ordine di urgenza
1. [ ] Account Resend e Daily, segreti su Cloudflare, DNS di Resend.
2. [ ] Sicurezza degli account (A2): gestore di password, 2FA ovunque, blocco del dominio, repository privata.
3. [ ] Quali lingue al lancio (A8).
4. [ ] Le decisioni aperte di A3.
5. [ ] Commercialista (residenza fiscale, ABN, GST, clienti esteri) e avvocato (contratto tipo).
6. [ ] Madrelingua per ES e FR, quando si fanno.
