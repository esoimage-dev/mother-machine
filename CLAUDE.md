# Mother Machine · il file unico del progetto

Chi lavora su questo progetto (una persona o un Claude, anche su un altro account) legge **solo questo file** e sa
come muoversi: cosa è il sito, come è fatto, le regole, cosa è fatto, cosa manca e in che ordine. Si aggiorna qui e
basta: si spunta quello che è fatto, si scrive quello che si decide diversamente, si aggiunge quello che nasce.
Ultimo aggiornamento: 26 ottobre 2026 (Studio ritoccato, "free" in due posti soli).

---

## 0 · Dove siamo (per chi riprende da qui)
- **Tutto il lavoro è su `main`** (ultima pull request unita: #10). Ogni sessione di Claude ha il suo branch (oggi `claude/trusting-johnson-wybhvj`),
  ripartendo dal `main` aggiornato: con il push si apre la pull request e Eso la unisce. Anteprima: `https://<branch con i trattini>.mother-machine.pages.dev`,
  ma **Cloudflare taglia il nome a 28 caratteri** (oggi `https://claude-trusting-johnson-wybh.mother-machine.pages.dev`).
  Il link giusto sta sempre nel commento del bot di Cloudflare nella pull request ("Branch Preview URL").
- **Prossimi passi, in ordine** (lavorare con pochi token, niente stravolgimenti, proporre in chat prima di toccare):
  1. **Studio (01):** rifatto (26 ottobre), da approvare sull'anteprima. Aperto: la regola 03 "One number to move."
     ripete il titolo della home ("Three steps. One number to move."): Eso decide se cambiarla.
  2. **Contact (G):** il modulo vero (vedi sezione 8, punto 1). Eso sta creando gli account **Resend** e **Daily**
     (gratis: Resend 3.000 mail al mese, 100 al giorno; Daily circa 10.000 minuti-partecipante al mese, da verificare
     sulle loro pagine prezzi). Le chiavi API **non** vanno in chat né nella repository: Eso le mette su Cloudflare come
     segreti (Workers & Pages → mother-machine → Settings → Variables and Secrets). Per Resend serve verificare il dominio
     con i record DNS su Cloudflare.
  3. **LG (Lower Ground):** FATTA (sezione 7). **Lista dei ritocchi decisi da Eso: `docs/lg-da-fare.md`** (si parte da li'). Aperti: il gioco (Eso lo vuole cambiare), la frase
     sotto la stanza ("You can watch. Only we touch." contro "Click what glows"). Prima c'era solo la sezione del palazzo animata. Va riempita con qualcosa di buffo e grafico,
     un laboratorio segreto. Idee proposte (Eso deve scegliere): **(a) il gioco dell'ascensore**, consigliato: porti la
     cabina ai piani giusti per consegnare gli "ordini" prima che scadano, ogni piano è un servizio vero; (b) una parete
     di leve e spie con easter egg ("You found it."); (c) una macchina che da una parola sputa un mini-marchio finto.
     Il palazzo attuale diventa il campo da gioco del gioco (a), o si toglie. Leggero, in codice, fermo fuori schermo.
  4. Poi: Legale e Google, Lancio (sezione 8). Dopo il lancio: back office vero (Machine Room), fatture automatiche,
     risponditore di mail (sezione 8, punto 6).
- **Brand (03):** fatto, salvo "The system" che è una bozza statica da animare più avanti.

## 0.1 · Chi siamo (l'essenza, per scrivere e decidere bene)
- **Mother Machine** è uno studio di design e sviluppo. Costruisce **la macchina dietro un'azienda**: il software su
  misura che la fa girare (back office, gestionali, app, automazioni, AI privata) e il marchio con cui si presenta
  (identità, siti, negozi online). "Machine" è il dentro, squadrato e preciso; "Mother" è il fuori, caldo, il vetro.
- **Cosa vendiamo di più:** i sistemi (Systems, piano 02). Il messaggio: il tuo business lavora anche quando tu non ci sei
  (prenotazioni e pagamenti da soli, preventivi in due minuti, lavori notturni, niente telefonate).
- **Come ci vendiamo:** mostrare, non spiegare. Demo vere dei lavori dei clienti, numeri forti decisi da Eso,
  frasi corte. Il primo incontro è gratis ("Tell us what slows you down."). Niente gergo da agenzia.
- **Clienti tipo:** piccole e medie attività (ristorazione, catering, negozi, servizi). Oggi Cairns, Australia; domani altri paesi.
- **Il sito è un palazzo:** ogni pagina un piano, si scende in ascensore. Sotto terra (LG) il laboratorio segreto e il back office.
- **Chi decide:** Eso. Il resto (Claude) propone da PM, art director e senior designer, in italiano, corto.

## 0.2 · Come leggere la repository senza sprecare (leggere solo quello che serve)
- **Leggi:** questo file; `scripts/monta-pagine.py` (60 KB, tutte le modifiche alle pagine: cerca con grep il nome della
  pagina, es. `def marchio`, `def sistemi`, `CASI`); `src/sezioni/*.html`; `public/css/*.css` e `public/js/*.js` della pagina
  che tocchi.
- **Non aprire interi** (enormi o generati): `src/html/*.html` (2,6 MB, generati dallo script: si cercano solo con grep),
  `prototipo/*.html` (5 MB, la verità visiva: grep mirato), `public/demo/` (5 MB, generato dagli script delle demo),
  `Approvati/` (18 MB, archivio), `sorgenti/` (riferimento), `docs/archivio/` (vecchi piani).
- **Ciclo di lavoro:** modifica → `python3 scripts/monta-pagine.py` → `npm run build` → `npx astro preview --port 4321`
  → screenshot con Playwright (1440 e 390) → commit → push → pull request. Un push per blocco di modifiche.

## 1 · Regole di lavoro (sempre)
- Rispondere a Eso **in italiano**, corto e schematico: un passo alla volta, percorsi esatti, niente spiegoni.
  Testi del sito in **inglese internazionale**: frasi corte, parole semplici, niente gergo da agenzia.
- **Mai il trattino lungo** (il carattere U+2014), in nessun testo, codice, commento o messaggio. Solo "-".
- Ragionare da **PM, art director e senior designer**: critica brutale ma bilanciata. Solo cose fatte bene: controllate con
  Playwright (computer e telefono) che non ci siano sovrapposizioni, errori o sbordi, prima di mostrarle.
- **Processo con Eso:** dopo ogni push dare il **link di anteprima** di Cloudflare; quando siamo convinti, ricordare a Eso di
  **unire la pull request** su GitHub (così si aggiorna il sito vero). Pensare anche a quello che Eso non pensa.
- **Design system:** non toccare testata, logo e la sua animazione, pulsantiera, footer. Si lavora dentro le pagine (sezioni,
  testi, tipografia, animazioni leggere). Il vetro si usa poco e dove serve: "machine" squadrato, "mother" tondo e vetro. Sito snello, navigabile,
  con personalità. **Niente doppioni** (se una cosa è già in home, non si ripete identica in un'altra pagina).
- Discutere prima in chat quando una scelta cambia contenuti o struttura. Non inventare servizi o voci non richieste.
- **Numeri:** quelli dei clienti li decide Eso (possono essere forti, è marketing, ma li dà o li approva lui).
  Niente premi dei clienti come se fossero nostri.
- Verificare sempre con **screenshot a schermo intero**, computer (1440) e telefono (390), prima di dire "fatto".
- **Git:** commit piccoli, uno per passo chiaro. **Push raggruppati** (Cloudflare gratis: 500 build al mese, ogni push
  è un build). Con il push sul branch si apre subito la **pull request verso `main`**: Eso guarda l'anteprima e la unisce lui.
  Il push diretto su `main` non si fa (lo blocca anche il sistema).
- **Mai segreti nella repository** (codici, chiavi). Stanno solo su Cloudflare. `.dev.vars` è ignorato da git.
- Non esportare MP4 se non richiesto.

## 2 · Accessi che servono
- **GitHub:** `esoimage-dev/mother-machine`. `main` = produzione. Branch di lavoro attuale: `claude/keen-franklin-rxhwha`.
  Se la sua pull request è già stata unita, si riparte dal `main` aggiornato con lo stesso nome di branch.
- **Cloudflare** (account di Eso): Workers & Pages → progetto `mother-machine`.
  - Ogni push su `main` pubblica su **mothermachine.studio** e www (1-3 minuti).
  - Ogni push su un altro branch pubblica un'anteprima: `https://<branch con i trattini>.mother-machine.pages.dev`
    (oggi `https://claude-keen-franklin-rxhwha.mother-machine.pages.dev`).
  - Segreti già impostati (Production e Preview): `MM_DOOR_CODE`, `MM_DOOR_KEY` (la porta di LG).
  - Email Routing: hello@mothermachine.studio → mothermachine.studio@gmail.com (il Gmail dello studio, non quello di Eso).
- **Dominio:** comprato su GoDaddy, nameserver su Cloudflare. Online dal 21 ottobre.
- Note dall'ambiente cloud di Claude: i siti `pages.dev` e mothermachine.studio di solito non si aprono da lì;
  il controllo dal vivo lo fa Eso. npm funziona; CDN esterni e Google Fonts no (i font si prendono con `npm pack @fontsource/...`).

## 3 · Come è fatto il sito (tecnica)
- **Astro, uscita statica**, su Cloudflare Pages. Ma le pagine **non si scrivono a mano in Astro**:
  1. `prototipo/*.html` sono le pagine approvate (la verità visiva).
  2. `python3 scripts/monta-pagine.py` le prende, applica tutti i ritocchi decisi con Eso e scrive `src/html/*.html`.
     **Ogni modifica a una pagina si fa in `monta-pagine.py`** (o nei file che usa), mai in `src/html` a mano:
     verrebbe sovrascritta. Il file usa `una(t, vecchio, nuovo, nome)`, che si ferma se il pezzo non c'è una volta sola.
  3. `src/pages/[...slug].html.ts` serve le pagine (qui si aggiungono gli indirizzi nuovi).
  4. `npm run build` costruisce in `dist/`; `npx astro preview --port 4321` per vederlo in locale.
- **Pezzi in `src/sezioni/`:** `lavori-home.html` (la striscia dei lavori in home), `work.html` (pagina 04), `systems-notte.html`, `brand-sistema.html`, `lg.html`.
- **CSS e JS per pagina** in `public/css` e `public/js`: `home.css/js` (striscia lavori, selettore, cursore di trascinamento),
  `progetto.css/js` (pagine progetto, demo, fasce), `systems.css/js` (turno di notte, registro di bordo), `brand.css/js` (apertura, tre stili dei controlli, sistema; caratteri in `public/brand/fonts`, non in `public/fonts` che lo script rifà da zero), `work.css/js`, `mr.css` (LG, resti) e per LG `stanza.css` + `stanza.js` (il motore della prospettiva e la stanza) + `stanza-oggetti.js` (gli oggetti da premere) + `rush.css/js` (il gioco). `mm-sito.*` comuni.
- **Pagine progetto:** in `monta-pagine.py` il dizionario `CASI` (una voce per lavoro) e la funzione `caso()` montano
  copertina, demo, cosa abbiamo fatto, numeri, prima e dopo, fasce tipografiche, marchio, galleria, Next.
  Per un lavoro nuovo: una voce in `CASI`, una in `PAGINE`, `META`, `CORRENTE`, l'indirizzo in `[...slug].html.ts` e `public/sitemap.xml`.
- **Demo dal vivo** (il codice vero dei clienti con dati inventati): `public/demo/vitalias` e `public/demo/ristorante`,
  generate da `scripts/demo-vitalias.py` e `scripts/demo-ristorante.py` partendo dai repository dei clienti
  (`vitalias-pizza-on-wheels`, `vitalia-restaurant`, sola lettura). Un server finto nel browser (`scripts/demo/*-api.js`)
  risponde al posto delle loro funzioni; i dati stanno nel browser e si rifanno ogni giorno. Niente dati veri,
  niente chiavi dei clienti, telefoni e WhatsApp spenti.
- **`public/_worker.js`:** il piccolo server del sito. Fa la porta di LG (`/api/porta`, cookie firmato), protegge
  `/lg/room`, e finché `PRIMA_DEL_LANCIO = true` dice a Google di non indicizzare.
- **Icone:** quelle dei lavori nel selettore le abbiamo disegnate noi; spunta, mezzo cerchio e stellina sono Phosphor (MIT).
- Altri file: `prototipo/manuale.html` (manuale del marchio), `sorgenti/` (pezzi originali, solo riferimento),
  `Approvati/` (archivio), `docs/archivio/` (vecchi piani, superati da questo file).

## 4 · Il sito: un palazzo
Ogni pagina è un piano. Si naviga con la pulsantiera (il menu) e si scende come in ascensore.

| Piano | Indirizzo | Luce | Cosa c'è |
|---|---|---|---|
| 05 | `/` | notte, poi bianco | apertura, lavori, What we build, How we work, In motion, porta verso G |
| 04 | `/work` | notte | l'elenco dei lavori. Pagine: `/work/vitalias-pizza-on-wheels`, `/work/vitalias-restaurant` |
| 03 | `/brand` | bianco | il fuori: identità, siti e app, negozi online, art direction, grafica |
| 02 | `/systems` | grigio macchina | il dentro: software, gestionali, app, CMS, automazioni, AI privata |
| 01 | `/studio` | rosa | chi siamo, come lavoriamo, con chi parli |
| G | `/contact` | rosa | "Tell us what slows you down." Il modulo (ordine di lavoro). Primo incontro gratis |
| LG | `/lg` | notte | la sala macchine disegnata a linee in prospettiva, con le cose da premere e il gioco Rush hour |
| SL | `/lg/room` | notte | **Secret lab**: il nostro back office, piano segreto sotto LG, con il codice sulla pulsantiera. In testata "SL · Secret lab", nessun quadratino acceso |

Systems è al 02 e Brand al 03: scendere vuol dire entrare, e i sistemi sono il lavoro che vogliamo vendere di più.
Fuori dal palazzo: `/privacy`.

## 5 · Regole di design (approvate, non si toccano)
- **Non toccare** l'apertura della home, la testata, la pulsantiera, il cursore, il vetro: si portano identici.
- **Pomodoro #FF5B3A** solo su ciò che si muove o risponde. Mai titoli, testo o fondi.
- Colori: bianco #FBFAF7, carta #F4F2EC, inchiostro #121211, grigio macchina #BEC2BF, notte #0F0F0E, rosa pelle #F2CDBE.
- Caratteri: Hanken Grotesk (variabile), DM Mono, Gloock.
- Due linguaggi: "machine" squadrato, "mother" vetro e gradiente. Il vetro al massimo in due momenti per pagina,
  caldo e freddo, mai uno dopo l'altro. **Tecnica del vetro:** una copia sfocata ferma di quello che sta sotto,
  **mai backdrop-filter dal vivo** su aree grandi.
- Testata: numero del piano, nome, colonna di sei quadratini. Niente hamburger.
- **Bottoni pieni:** al passaggio il pomodoro sale e riempie tutto il bottone. Bottoni dei piani: bordo acceso e anello,
  chiamati lampeggiano pomodoro. Cursore: quadrato pieno; sulla presa cornice con luce pomodoro; sopra la striscia dei
  lavori cornice grande con due frecce (trascinando si stira).
- Tutto leggero: 60 fps, animazioni ferme fuori schermo, `prefers-reduced-motion` rispettato.

## 6 · Decisioni prese (non si rimettono in discussione senza Eso)
- **Lavori:** solo quelli dei clienti. **Mai i nostri progetti** (Mother Machine, Machine Room) tra i lavori.
  Veri oggi: Vitalia's Pizza on Wheels (catering) e Vitalia's Restaurant, Cairns. Birrificio Mare e Forno Nove sono
  segnaposto dichiarati ("Study", "Case study soon"), finché non arrivano lavori veri. Lumen Lab tolto.
- **Niente numeri di serie ai progetti** (No. 012, Study 03): con pochi lavori mostrano quanto sono pochi.
- **"Cairns, Australia" si mostra** sui lavori (domani ci saranno altre città).
- **Home:** subito dopo l'apertura la striscia orizzontale dei lavori (schede con la macchina che lavora in piccolo,
  selettore sotto, si trascina; lo scroll verticale resta libero). L'ultima scheda è "Your business, next."
- **Work (04):** solo l'elenco, snello. Le schede grandi stanno in home: non si ripetono.
- **Pagine progetto:** demo vera (Guest/Owner, computer e telefono), poi le fasce tipografiche problema → soluzione,
  poi cosa abbiamo fatto, numeri, marchio, galleria, Next.
- Ristorante: niente premi; numeri +180% (function), +35% (spesa per ospite), 60% (richieste fuori orario) decisi da Eso.
- **LG** non è più un elenco di servizi: turno di notte e registro di bordo sono in Systems, il resto tolto. LG diventa un posto buffo e grafico (sezione 0).
- Lingue del sito: EN, IT, ES, FR (targhetta in fondo alla pulsantiera).
- Contatti: niente mail diretta né WhatsApp come canale, tutto passa dal modulo.
- Privacy: niente cookie di tracciamento, nessun banner.

## 7 · Stato (fatto)
- [x] Sito online su mothermachine.studio (fuori da Google finché `PRIMA_DEL_LANCIO` è true).
- [x] Dominio, posta in entrata su hello@.
- [x] Home con la striscia dei lavori, icone, vetro, notifiche, selettore, cursore di trascinamento.
- [x] Pagine Vitalia's Pizza on Wheels e Vitalia's Restaurant con demo vere, numeri, fasce.
- [x] Pagina Work (04) senza numeri di serie, solo elenco.
- [x] Brand rifatta (apertura, tre stili dei controlli, quattro caratteri, The system in bozza).
- [x] Porta di LG con il codice sul server.
- [x] Systems con il turno di notte e il registro di bordo; LG snella.
- [x] Studio rifatto (26 ottobre), quattro idee nello stile del sito: (1) l'apertura e' un disegno tecnico, il titolo a
  contorno con le linee di misura vere (altezza delle maiuscole, x-height, linea di base, quota) e scorrendo si riempie, "Drawn -> Built";
  (2) "Built for busy days." e' l'unico vetro della pagina, sopra gli archi della m che si muovono (tecnica della home); (3) le
  regole con il display dell'ascensore che rotola da 01 a 05; (4) "Who you talk to" con l'interruttore Design / Code e i
  mestieri che portano al loro piano. Via la targhetta (numero di serie, ore inventate) e la storia falsa dei ristoranti.
  Stile e comportamenti in `public/css/studio.css` e `public/js/studio.js`, markup in `def studio` di `monta-pagine.py`.
- [x] **LG, la sala macchine** (26-27 ottobre): un disegno a linee bianche su nero in prospettiva vera, fatto in codice.
  Il motore (`stanza.js`, `STANZA_SCENA`) fa scene: facce 3D proiettate e riempite di nero, linee piu' sottili in fondo,
  tratteggio, testo in prospettiva su qualunque piano. Il mouse sposta la camera, sul telefono si trascina di lato. Niente
  footer e niente porta per G: la stanza e' tutta la pagina. Dentro: server (-> popup "machine room live", `sala-server.js`,
  poi Systems), neon della m che fa i capricci e illumina muro e pavimento, **ascensore** sul fondo con display LG e il solo
  tasto su (premuto: ding, le porte si aprono sulla cabina accesa, poi la pulsantiera), quadro con le leve (spegnendo scende
  la leva di destra e la stanza va al buio), cabinato a destra (-> Rush hour), banco con attrezzi, disegno tecnico e mensola
  col pizza truck; in primo piano il salotto di sbieco: divano, tavolino (menu del ristorante e telefono), TV sulla cassa
  (-> il film, `public/film.html`) su uno scatolone, la console "Mother 8" con due joystick (uno sul tavolino); il menu e' una
  cartellina verde con il logo vero; al centro un mobiletto con il giradischi; a destra bobina e casse; sulla parete di
  destra il grande disegno tecnico del cabinato (coperto in parte dal cabinato); calendario del robot frontale sul fianco del
  rack R01 (tutto a sinistra, si vede spostando il mouse; mese vero, oggi cerchiato, cliccando gira il mese), poster
  "Dead Pixels", Staff only al neon accanto all'ascensore, neon che spegnendosi lascia il tubo grigio visibile.
  Giro 5: porte dell'ascensore lisce, all'arrivo aperte poi si chiudono; cabina minimal (solo un corrimano staccato dal muro);
  telefono a disco nuovo, estintore neutro, calendario non cliccabile (mese vero), cavi della console dietro lo scatolone fino
  alla TV, parete destra = tavola di progetto "LOOP · Brand + App", oscilloscopio sul carrello in basso a sinistra.
  **Musica** (`public/js/musica.js`, su tutte le pagine): il giradischi apre il lettore con quattro dischi chiptune fatti in
  codice; chiudendo resta il mini player in basso a destra (stop lo nasconde). Si avvia solo da LG; cambiando pagina il sito
  si ricarica, quindi riparte al primo tocco ("Tap to resume"). Musica continua senza tocco = sito a pagina unica (Astro
  ClientRouter), lavoro grosso, solo se Eso lo vuole.
  **Da ridisegnare meglio (lista di Eso):** tazzina e tazza, divano nel complesso, altri dettagli che non convincono.
  **Primo piano stile inventario** (`stanza-vista.js`): truck, menu e telefono volano dal punto premuto dentro un mirino e
  girano (trascinandoli si ruotano), con una frase, il bottone per andare al progetto o a Contact e la X a tasto (Esc).
  I modelli si preparano in anticipo e la stanza dietro si ferma: niente scatti. I modelli stanno in
  `stanza-oggetti.js` (`STANZA_MODELLI`). **Rush hour** (`rush.js`): da rivedere, Eso vuole cambiarlo.
- [x] "Free" solo due volte: nella porta verso G ("The first one is free.") e in Contact ("The first conversation is free.").

## 8 · Scaletta (in ordine)
1. [ ] **Contact vero.** Modulo → ordine salvato (Cloudflare D1) → anti spam (Turnstile) → mail di conferma al cliente
   e avviso a noi (Resend) → scelta dell'orario e link a una stanza Daily standard. Senza questo il sito non prende clienti.
   Dettaglio del percorso (numeri d'ordine, quattro mail, orari): `docs/archivio/percorso-contatto.md`.
2. [x] **Systems assorbe LG** (23 ottobre). In Systems: la sezione "Night shift" (il turno di notte) e il registro di
   bordo dentro "Built properly", con il controllo di sicurezza; "Safe" dice che i dati stanno sul server del cliente.
   LG ora è solo la sezione del palazzo (25 ottobre: tolta anche "Staff only"); da riempire, vedi sezione 0.
3. [~] **Brand** (24 ottobre): apertura compatta (titolo e leva a sinistra, la macchina a destra) e i controlli in tre
   stili (Minimal, Friendly, Editorial) che cambiano anche il modo d'uso, non solo il colore: mostra che facciamo design
   system di pezzi funzionali. 25 ottobre: il peso ha un carattere per stile (Hanken, Fredoka, Fraunces), il cambio di
   stile trasforma i comandi; Minimal: Saved nero con spunta, Deleted rosso; l'apertura parte da sola a ciclo, strati in
   vetro, i quattro passi si accendono; il carattere a quattro voci (la quarta: Unbounded) con la parola "Mother";
   sezione nuova "The system" (segno su griglia, icone, scala del carattere, colori, spazio): **bozza statica, da
   animare più avanti**. Ordine deciso da Eso (25 ottobre): apertura, controlli, carattere ("One word, four typefaces."),
   sistema, cosa facciamo. L'apertura ha una scheda prodotto vera (pagnotta, prezzo, quantità, bottone) e non si taglia mai.
   Cambiando stile cambiano solo i comandi: etichette e righe sotto restano uguali (deciso da Eso).
   **Studio:** fatto il 26 ottobre (sezione 7).
4. [ ] **Legale e Google.** Privacy con chi raccoglie i dati e hello@; titoli e descrizioni; anteprime social (Open Graph).
5. [ ] **Lancio.** `PRIMA_DEL_LANCIO = false`, repository privata, Rate Limiting su `/api/porta`, controllo su tutti i dispositivi.
6. [ ] **Dopo il lancio:**
   - Machine Room vera (ordini, risposte, preventivi, call) con Cloudflare Access davanti.
   - **Fatture automatiche:** dal preventivo accettato nasce la fattura (tax invoice con ABN, GST se serve), PDF numerato,
     mandata al cliente, segnata pagata o da pagare. Eso non le scrive più a mano.
   - **Risponditore di mail intelligente:** legge le mail su hello@, prepara la risposta nel nostro tono; le semplici
     partono da sole, le altre restano in bozza da approvare con un tocco.
   - Stanza Daily vestita Mother Machine, pagina "Your call is confirmed", promemoria.
   - Posta in uscita come hello@ (Resend e "Invia come" nel Gmail).
   - Poi: animazioni allo scroll, film nuovo, footer ripensato. LG: idee in piu' (inquadratura d'angolo, altri giochi).

## 9 · Da fare per Eso (quando può)
- [ ] Rendere **privata** la repository GitHub (Settings → Change visibility → Private). Oggi è pubblica.
- [ ] Creare gli account **Resend** (mail) e **Daily** (videochiamate), gratis, per il Contact.
- [ ] Parlare insieme della **parte aziendale e fiscale**: ABN australiano o struttura in più paesi, come fatturare oggi
  (prima del back office), GST, nome legale. L'ABN serve comunque sulle fatture; sul sito basta dire chi raccoglie i dati e hello@.

## 10 · Messe da parte (da rivedere con Eso quando rifacciamo Systems)
Grafiche tolte da LG il 23 ottobre, salvate nella storia di git (commit prima di `0e61a94`, file `src/sezioni/lg.html`,
`public/js/mr.js`, `public/css/mr.css`) e in `prototipo/`:
- Switchboard: i pacchetti che viaggiano dagli strumenti (pagamenti, shop, mail, calendario) al back office.
- AI privata: il chip con le celle che si accendono a onde.
- Work orders: il nastro Survey, Build, Run con le scatole.
- Register: la lista dei lavori (aveva i numeri di serie).

## 11 · Testi e decisioni aperte (da approvare con Eso)
- Testi di LG e Systems dopo la fusione.
- Riga privacy sotto il bottone d'invio di Contact.
- Brand apre al buio, il manuale lo vuole bianco.
- Apertura della home: citofono su telefono e versione B su desktop, per ora; si rivede.
