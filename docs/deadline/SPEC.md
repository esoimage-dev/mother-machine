# DEADLINE · specifica di design (decisa con Eso). Due copie: la versione originale del file del gioco e quella nel piano unico. Sono lo stesso contenuto; in caso di dubbio vale la piu' dettagliata.

## Versione originale (docs/lg-da-fare.md, ultima versione)
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

## Versione nel piano unico (docs/piano-lavoro.md, B5)
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

## B6 · Altre cose belle (quando c'e' tempo)

## AGGIUNTE DI ESO (dopo i primi screenshot) - vincolanti
- **Mappa del mondo**, come Super Mario Bros e tanti giochi: NON un calendario (MONDAY e' gia' il calendario). La citta'
  vista dall'alto (isometrica o dall'alto), con sette quartieri = i sette giorni e alla fine la torre di MONDAY (un
  grattacielo scuro col calendario cattivo in cima). Si vede all'inizio (sei al primo giorno), e dopo ogni giorno si
  torna alla mappa: il giorno finito si accende/si spunta, la nave si muove lungo la strada al quartiere dopo, che si
  sblocca. Animata, carina, figa. Ogni quartiere ha il suo carattere (pioggia, nebbia, smog, festa, tramonto, parco
  della domenica) coerente col giorno.
- **Intro narrativa** all'avvio di una partita (si puo' saltare con un tasto/tocco), stile testo che scorre di Star Wars,
  buffa e corta, che da' il contesto e il movente. Proposta di testo (inglese):
  "Not long ago, in an office not so far away... / Small businesses are under attack. / Missed calls. Paper invoices.
  No-shows. Spam. / Every week the chores multiply. / And at the end of every week waits the worst of them all: MONDAY. /
  One machine was built to fight back. / Save the hours. Protect the city. / Beat MONDAY before the deadline."
  Poi la mappa.
- **MONDAY** piace molto: renderlo un pizzico piu' cattivo. **URGENT** piace.
- **La nave e' noiosa**: va rifatta molto piu' figa (piu' carattere, piu' dettaglio, silhouette memorabile, motori vivi).
- Anche gli altri nemici, i colpi che arrivano, i potenziamenti e l'interfaccia devono essere molto piu' fighi. Si puo'
  valutare che **i personaggi (nave, nemici, boss) abbiano piu' dettaglio dello sfondo** (sprite piu' grandi o piu'
  densi), ragionandoci: la priorita' e' che siano fighi e leggibili.
- **I livelli devono essere diversi, non tutti uguali**: ogni giorno con la sua meccanica o sorpresa oltre al cielo
  (formazioni, ostacoli, eventi, ritmo).
- Rivedere tutto piu' volte con gli agenti, verificare, poi un altro giro per renderlo ancora piu' figo.
- **Ritmo (Eso):** la mappa deve essere SNELLA (pochi secondi, saltabile, poco codice) e il gioco VELOCE: ci vuole un po'
  di impegno per il premio, ma non deve essere infinito. Partita intera intorno ai 6 minuti, non di piu'.

## AGGIUNTE DI ESO, giro 3 (dopo gli screenshot) - vincolanti
- **Un boss alla fine di OGNI giorno**, e ogni boss **parla** appena appare (una frase, macchina da scrivere, con il suo
  ritratto). MONDAY e' il piu' cattivo e carismatico; **appare a meta' gioco** (es. giovedi'), dice qualcosa e **scappa**.
  Boss proposti (corti, 15-20 s ciascuno, il gioco resta intorno ai 6-7 minuti):
  TUESDAY "THE VOICEMAIL" (segreteria telefonica gigante: "You have... 47 new messages."); WEDNESDAY "REPLY ALL"
  (nuvola di mail che si moltiplica: "Per my last email..."); THURSDAY "PAPER JAM" (stampante impazzita nell'acido:
  "Paper jam. Again."); FRIDAY "URGENT" (gia' fatto: "Before you leave... one quick thing."); SATURDAY "ONE STAR"
  (la recensione a una stella: "Terrible service. Would not recommend."); SUNDAY "SUNDAY SCARIES" (ombra/lista di cose
  da fare: "Tomorrow is Monday..."); MONDAY (finale: "Good morning. I am MONDAY.").
- **I FIREWALL non si capiscono** (sembrano pietre che sparano): ridisegnarli chiari (muro di protezione tecnologico,
  scritta FIREWALL o icona alla prima apparizione, si consumano in modo leggibile) oppure toglierli.
- Personaggi, nemici, potenziamenti e nave **piu' originali e fighi**. Livelli **piu' diversi e ispirati** (gia' carini).
- **Logo DEADLINE molto piu' bello**: insegna al neon stile locale di Cyberpunk 2077 (Afterlife) o Blade Runner 2049,
  ma nostro e un po' vintage.
- **Interfaccia** (pausa, suono, tasti): piu' bella, tastoni da videogioco. Su **telefono stile Game Boy**: lo schermo
  sopra e sotto i tasti veri (croce o zona di guida, A e B, START e SELECT), vintage, adatto a Mother Machine.
- Gia' piace: INSERT COIN vintage, palazzi FOR RENT (si possono migliorare ancora).
- **Spirito (Eso):** revisione continua anche del gameplay e delle idee, non solo della grafica. Snello e veloce, molto
  originale, tutto intuitivo (si capisce senza spiegazioni), atmosfera figa ma BUFFO: battute, piccole gag, reazioni
  dei nemici, momenti che fanno sorridere chi ha un'azienda.
