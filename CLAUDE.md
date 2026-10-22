# Mother Machine · il file unico del progetto

Chi lavora su questo progetto (una persona o un Claude, anche su un altro account) legge **solo questo file** e sa
come muoversi: cosa è il sito, come è fatto, le regole, cosa è fatto, cosa manca e in che ordine. Si aggiorna qui e
basta: si spunta quello che è fatto, si scrive quello che si decide diversamente, si aggiunge quello che nasce.
Ultimo aggiornamento: 23 ottobre 2026.

---

## 1 · Regole di lavoro (sempre)
- Rispondere a Eso **in italiano**, corto e schematico: un passo alla volta, percorsi esatti, niente spiegoni.
  Testi del sito in **inglese internazionale**: frasi corte, parole semplici, niente gergo da agenzia.
- **Mai il trattino lungo** (il carattere U+2014), in nessun testo, codice, commento o messaggio. Solo "-".
- Ragionare da **PM, art director e senior designer**: critica brutale ma bilanciata. Sito snello, navigabile,
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
  `progetto.css/js` (pagine progetto, demo, fasce), `systems.css/js` (turno di notte, registro di bordo), `brand.css/js` (apertura, tre stili dei controlli, sistema; caratteri in `public/brand/fonts`, non in `public/fonts` che lo script rifà da zero), `work.css/js`, `mr.css/js` (LG). `mm-sito.*` comuni.
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
| 01 | `/studio` | rosa | chi siamo, metodo Survey, Build, Run |
| G | `/contact` | rosa | "Tell us what slows you down." Il modulo (ordine di lavoro). Primo incontro gratis |
| LG | `/lg` → `/lg/room` | notte | la porta dello staff (codice sulla pulsantiera) e il nostro back office, la Machine Room |

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
- **LG** non è più un elenco di servizi: turno di notte e registro di bordo sono in Systems, il resto tolto. LG è la porta dello staff.
- Lingue del sito: EN, IT, ES, FR (targhetta in fondo alla pulsantiera).
- Contatti: niente mail diretta né WhatsApp come canale, tutto passa dal modulo.
- Privacy: niente cookie di tracciamento, nessun banner.

## 7 · Stato (fatto)
- [x] Sito online su mothermachine.studio (fuori da Google finché `PRIMA_DEL_LANCIO` è true).
- [x] Dominio, posta in entrata su hello@.
- [x] Home con la striscia dei lavori, icone, vetro, notifiche, selettore, cursore di trascinamento.
- [x] Pagine Vitalia's Pizza on Wheels e Vitalia's Restaurant con demo vere, numeri, fasce.
- [x] Pagina Work (04) senza numeri di serie, solo elenco (pull request #5, da unire).
- [x] Porta di LG con il codice sul server.
- [x] Systems con il turno di notte e il registro di bordo; LG snella.

## 8 · Scaletta (in ordine)
1. [ ] **Contact vero.** Modulo → ordine salvato (Cloudflare D1) → anti spam (Turnstile) → mail di conferma al cliente
   e avviso a noi (Resend) → scelta dell'orario e link a una stanza Daily standard. Senza questo il sito non prende clienti.
   Dettaglio del percorso (numeri d'ordine, quattro mail, orari): `docs/archivio/percorso-contatto.md`.
2. [x] **Systems assorbe LG** (23 ottobre). In Systems: la sezione "Night shift" (il turno di notte) e il registro di
   bordo dentro "Built properly", con il controllo di sicurezza; "Safe" dice che i dati stanno sul server del cliente.
   LG ora è solo la sezione del palazzo e la porta dello staff: le altre sue macchine erano doppioni e sono state tolte.
3. [~] **Brand** (24 ottobre): apertura compatta (titolo e leva a sinistra, la macchina a destra) e i controlli in tre
   stili (Minimal, Friendly, Editorial) che cambiano anche il modo d'uso, non solo il colore: mostra che facciamo design
   system di pezzi funzionali. 25 ottobre: il peso ha un carattere per stile (Hanken, Fredoka, Fraunces), il cambio di
   stile trasforma i comandi; Minimal: Saved nero con spunta, Deleted rosso; l'apertura parte da sola a ciclo, strati in
   vetro, i quattro passi si accendono; il carattere a quattro voci (la quarta: Unbounded) con la parola "Mother";
   sezione nuova "The system" (segno su griglia, icone, scala del carattere, colori, spazio): **bozza statica, da
   animare più avanti**. Ordine: apertura, carattere, controlli, sistema, cosa facciamo (i due vetri non si toccano).
   **Brand e Studio, resto:** Testi più corti, una demo protagonista per piano, Studio in tre parti (Survey, Build, Run),
   un solo "free" in tutto il sito, via i doppioni. Io propongo, Eso approva.
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
   - Poi: il gioco di LG, animazioni allo scroll, film nuovo, footer ripensato.

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
