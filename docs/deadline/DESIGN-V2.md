# DEADLINE · design v2 (dal capo progetto, dopo le note di Eso) - vincolante, prevale su SPEC dove diverso

## La logica unica (coerenza)
Sei la macchina di Mother Machine. La citta' sotto e' l'azienda del cliente. Le seccature rubano tempo all'azienda.
Ogni giorno: un problema dell'azienda (le seccature di quel giorno), un boss che lo incarna, e quando lo batti
**installi un sistema** che resta con te per il resto della settimana (upgrade permanente). Venerdi' sera la macchina e'
completa; lunedi' la usi tutta contro MONDAY. E' esattamente cio' che vendiamo: togli le perdite di tempo, installi i
sistemi, l'azienda gira da sola.

Progressione dei sistemi (sbloccati battendo il boss del giorno, annunciati con una card "SYSTEM INSTALLED"):
- TUESDAY (VOICEMAIL) -> **BOOKING**: lo scudo di vetro (si ricarica da solo ogni tanto).
- WEDNESDAY (REPLY ALL) -> **AUTOMATION**: tre colpi a ventaglio (prima: a tempo; dopo l'installazione: sempre attivo
  a livello 1, le capsule lo potenziano per qualche secondo).
- THURSDAY (PAPER JAM) -> **AI**: i colpi piegano verso i nemici (stessa logica).
- FRIDAY (URGENT) -> **NIGHT SHIFT**: lo slot speciale si ricarica a ogni giorno.
- SATURDAY e SUNDAY: niente sistema nuovo, pura prova; SUNDAY e' corto, quasi vuoto (la calma prima di MONDAY).
Le capsule nei giorni restano (ricariche e potenziamenti temporanei), cosi' il gioco e' generoso ma coerente.
Sulla mappa ogni quartiere battuto mostra il sistema installato (icona accesa sul quartiere).

## Giorni diversi, non solo sparare (snello: ognuno 40-60 s)
- TUESDAY: sparare base, imparare. Boss VOICEMAIL.
- WEDNESDAY: nebbia, nemici che si vedono da vicino. Boss REPLY ALL (si divide).
- THURSDAY: **IL VIRUS** (livello diverso): la scena va DENTRO il server (sfondo a griglia del rack): un virus si allarga
  a celle sulla griglia ogni mezzo secondo; spari alle celle per contenerlo e devi colpire il nucleo che si sposta.
  Se il virus copre tutto, perdi un caffe' e il livello riparte dal 50%. Boss PAPER JAM (la stampante infetta). Alla fine
  MONDAY fa il cameo ("See you on Monday.") e scappa.
- FRIDAY: **LA CONSEGNA** (livello diverso): "Friday rush". Ordini (pacchi con l'icona di un negozio) cadono dall'alto:
  li prendi passandoci sopra e li porti al negozio giusto della citta' (il negozio si accende e lampeggia in basso;
  li consegni volando basso sopra di lui). Intanto le seccature ti disturbano (meno nemici). Ogni consegna = ore salvate.
  Poi URGENT alle 16:59.
- SATURDAY: sparare intenso, recensioni. Boss ONE STAR.
- SUNDAY: corto e inquietante. Boss SUNDAY SCARIES (buio che stringe la visuale).
- MONDAY: tutto insieme, MONDAY in tre fasi.
Durata totale: 6-8 minuti.

## Interfaccia (HUD) con un'idea: la plancia della Control Room
L'HUD non e' una fila di scritte: e' la **plancia di controllo dell'azienda**, come la Control Room che costruiamo ai
clienti (stile del sito: cornici tecniche, DM Mono, crema, pomodoro solo su cio' che si muove). Pochi elementi, chiari,
ognuno con un'icona e un'etichetta corta:
- **In alto a sinistra: LA GIORNATA.** Una barra-orologio 09:00 -> 17:00 con la lancetta che avanza e il nome del giorno
  intero (TUESDAY). Quando arriva il boss, la barra diventa "OVERTIME" rossa.
- **In alto al centro: HOURS SAVED.** Contatore grande a rulli (come il display dell'ascensore del sito), che rotola a
  ogni nemico; un piccolo "+3h" vola dal nemico al contatore.
- **In alto a destra: YOUR ENERGY.** Tre tazze di caffe' (piene/vuote, quella persa si rovescia).
- **In basso: THE BUSINESS.** La citta' stessa e' la barra della salute dell'azienda: le finestre accese. Un'etichetta
  piccola "OPEN" al neon su un negozio che sfarfalla quando l'azienda soffre e diventa "CLOSED" al game over.
  Alla prima perdita: "A chore reached the business!".
- **In basso a destra: SYSTEMS.** Le icone dei sistemi installati (BOOKING, AUTOMATION, AI, NIGHT SHIFT) accese o
  spente; NIGHT SHIFT con la sua carica e il tasto (X / B).
- Prima volta che serve: un'etichetta breve che punta all'elemento (tutorial in gioco, non testo lungo).
Su telefono la plancia e' nella cornice Game Boy (schermo sopra, tasti sotto: croce o zona guida, A = Night shift,
B = scudo/azione, START = pausa, SELECT = suono).

## Buffo
Statistiche sceme a fine giornata ("Calls dodged", "Invoices shredded", "Meetings that could have been an email"),
battute dei boss, reazioni dei nemici, il "+3h" che vola, la tazza che si rovescia, il negozio che dice "OPEN" e poi
"BRB". Mai volgare, sempre da ufficio.

## V3 (Eso, deciso): SCORRIMENTO LATERALE - prevale su tutto quello sopra dove diverso
- Il gioco diventa uno **sparatutto a scorrimento laterale** (stile Gradius / R-Type, scenari che scorrono come Metal
  Slug): la nave guarda e spara a DESTRA, si muove in 4 direzioni in tutto lo schermo (un po' di margine), lo scenario
  scorre da destra a sinistra in parallasse (cielo, skyline lontano, torri di mezzo con i cartelloni, strada vicina),
  nemici e boss entrano da destra (alcuni da sopra/sotto). Gli scenari si MUOVONO: ogni giorno e' un tratto di citta'
  diverso che attraversi, con i suoi pezzi (pioggia e ombrelli, nebbia e lampioni, acido e vapore, festa e laser,
  tramonto, parco), senza disegnare troppo: strisce che si ripetono + qualche pezzo unico che passa.
- **Niente FIREWALL nei livelli normali.** La meccanica "proteggi qualcosa" solo in UN livello (FRIDAY, la consegna:
  scorti il furgone delle consegne o proteggi il negozio mentre consegni). THE BUSINESS (la vita dell'azienda) resta
  nella plancia ma come barra/insegna OPEN, non come finestre colpite da sotto: le seccature che ti superano (escono a
  sinistra) fanno perdere tempo all'azienda.
- THURSDAY il virus: dentro il server, lo scorrimento rallenta/si ferma, griglia del rack.
- Telefono: lo schermo in orizzontale dentro la cornice Game Boy (schermo sopra, tasti sotto); se il telefono e'
  girato in orizzontale, schermo grande e tasti ai lati.
- **La CITY del titolo** (i palazzi FOR RENT, che piace molto): ogni palazzo gia' pensato come un'attivita' diversa con
  la sua insegna al neon di forma diversa (non tutti uguali): ristorante, street food sulla strada, negozio di
  abbigliamento, parrucchiere, supermercato, hotel, bar/caffe', palestra... Neon stile Blade Runner. Le insegne libere
  hanno forme diverse e un neon spento "FOR RENT" / "YOUR SIGN HERE", pronte per il logo del vincitore.
- **Copy piu' intelligente e figo** (Burnout piace ma va alzato): scritte brevi, ironiche da ufficio, mai banali; ogni
  schermata (game over, vittoria, clocked out, pausa, mappa, boss) con una battuta pensata.
- Simboli, personaggi, icone: tutto piu' pensato e piu' figo (vale ancora tutto quanto detto prima).

## Lista di controllo di ogni giro di revisione (Eso): ogni giro ripassa TUTTO
interfaccia e HUD · copy e battute · cose buffe · boss (design, frasi, attacchi) · nemici (piu' pixel, belli, leggibili,
quanti e come appaiono) · protagonista (piu' pixel, la m di Mother Machine) · coerenza della storia e dei sistemi ·
gameplay e ritmo · grafica di ogni livello · animazioni · logo DEADLINE · comandi computer e telefono (Game Boy) · bug,
collisioni, prestazioni. Giudizio onesto: se e' brutto o poco chiaro si rifa'.

## Lista aggiunta dal capo progetto (cose che rendono il gioco completo e fatto bene)
- Prima partita: i primi 20 secondi insegnano tutto senza testo (nemici innocui, una capsula facile, un'etichetta).
- Curva di difficolta' onesta: si muore per errore proprio, mai a sorpresa; nemici che avvisano prima di sparare.
- Lettura a colpo d'occhio: colpi nemici sempre visibili sullo sfondo di ogni giorno, la nave sempre in primo piano.
- Ritmo: pause brevi tra le ondate, picchi e respiri, boss che arrivano con un annuncio (OVERTIME, sirena).
- Sensazione dei colpi: lampo, piccolo rinculo, suono, pezzi che volano, hit-stop sui nemici grossi.
- Morte e ripartenza veloci: meno di 2 secondi per rimettersi a giocare; "continua" dal giorno raggiunto (senza premio).
- Salvataggio locale del giorno raggiunto e del record personale; opzione "Skip intro" dopo la prima volta.
- Accessibilita': tasti ridefinibili non serve, ma pausa sempre a portata, volume e muto, riduci movimento, contrasto.
- Telefono: pollice che non copre la nave, tasti grandi, niente zoom o scroll accidentali, orientamento gestito.
- Prestazioni: 60 fps su telefono medio; il gioco si ferma da solo se la scheda e' nascosta.
- Fine: schermata di vittoria che fa venire voglia di condividere (punteggio, giorno, una battuta), classifica.
- Coerenza col sito: il gioco porta a Contact con discrezione, mai pubblicita' pesante; tono di Mother Machine.
- Easter egg piccoli: Konami (Weekend mode), un nemico raro buffo, una frase segreta del boss.
- Pulizia: niente pagine di prova sul sito, niente codice di debug attivo senza ?dldebug.
