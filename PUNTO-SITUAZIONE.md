# Mother Machine · punto della situazione v4 (18 ottobre 2026)

Questo file serve a chi continua il lavoro senza aver letto la chat. Leggi prima CLAUDE.md, poi questo file, poi guarda le pagine in prototipo/.

## Come leggere le fonti
Se due fonti non dicono la stessa cosa, vale questo ordine:
1. prototipo/*.html: le pagine approvate. Vincono sempre.
2. CLAUDE.md e questo file.
3. prototipo/manuale.html: utile per colori, caratteri e regole, ma alcune sue parti sono vecchie (vedi "Correzioni").

Se una pagina e il manuale non coincidono, segui la pagina e segnalalo a Eso. Non inventare: chiedi.

## Stato
**Approvato e da riprodurre**
- Home: prototipo/home.html, con sezioni 05.1 Opening, 05.2 What we build, 05.3 Work (vedi Correzioni), 05.4 In motion, 05.5 How we work, G. Include la targhetta delle lingue.
- Testata, pulsantiera, chiave LG, cursore, ascensore tra i piani.
- G Contact (contact.html): tutto il percorso, dal modulo alla conferma, con la stanza della call.
- 01 Studio, 02 Systems, 03 Brand: ognuno in prototipo/ con il suo file.
- Privacy e termini (privacy-termini.html): fuori dal palazzo, pagina a parte.
- Pagina progetto (progetto.html): la formula per ogni progetto, esempio Vitalia's Pizza on Wheels.
- Manuale del marchio: v42 in locale. Online c'e ancora la v40 (https://claude.ai/artifact/NY2gm7L3Pkwr3PxpDktNk4).

**Non ancora fatto**
- 04 Work, l'elenco dei progetti: non disegnato. Il sito ne parte con una pagina segnaposto.
- Machine Room v0 (il back office con il modulo contatti): non costruita. Si disegna mentre si costruisce il modulo.

## Correzioni da applicare a CLAUDE.md, alla v3 e al manuale
- **Il foglio G ha il bordo a zigzag sopra e sotto, non quadrati.** CLAUDE.md, la v3 e il manuale dicono ancora "perforato a quadrati": e sbagliato. Vale la pagina contact.html.
- **Il 05.3 della home si chiama Work.** Nel file la sezione ha il titolo "Results, not deliverables." e l'etichetta data-n "Proof". Eso deve scegliere il nome. Proposta: Work, per coerenza con il piano 04.
- **La torre "makes machines" non e nella home approvata.** CLAUDE.md la descrive come presente, ma in prototipo/home.html non c'e. Va decisa da Eso prima di rimetterla.
- **Il manuale ha una numerazione vecchia** (05.2 Lavori, 05.3 Cosa costruiamo). Vince la home.
- **Progetti in home:** Birrificio Mare, Forno Nove, Lumen Lab (concept). La pagina progetto usa Vitalia's Pizza on Wheels, No. 014. Va deciso quali compaiono nel 04 Work e se Vitalia's e un progetto reale.
- **Il film non va in MP4 nel sito.** Il film e in codice (sorgenti/film, versione del 15 ottobre). Gli MP4 sono del 13 ottobre.

## Decisioni prese e perche
- **Lingue:** EN, IT, ES, FR. Il tedesco e pronto ma spento. Il selettore e una targhetta incisa in fondo alla pulsantiera, non tasti sotto LG.
- **Lingua automatica:** alla prima visita, con ordine: scelta salvata, lingua del browser, paese, inglese. La scelta manuale vince sempre.
- **Ordine dei piani:** Systems 02 e Brand 03 (deciso il 15 ottobre). Il piano piu vicino alla Machine Room e quello dei sistemi.
- **Studio:** nessun nome, nessuna foto, nessun anno di fondazione, nessun numero di persone. Il team si chiama "Team". Mai "Cairns" o "Australia".
- **Contatti:** niente mail diretta e niente WhatsApp come canale. Tutto passa dal modulo, che crea un ordine di lavoro.
- **Privacy:** Cloudflare Web Analytics senza cookie, nessun banner. Cookie solo tecnici (lingua, sicurezza). ABN non obbligatorio sul sito: non si mette. Campi legali tratteggiati, da rileggere con un avvocato.
- **Vetro:** solo in home, Brand e Systems, al massimo due volte per pagina, caldo e freddo. Niente vetro in Studio e in Contact. Niente backdrop-filter dal vivo: il vetro e un canvas sfocato una volta sola.
- **Numeri onesti:** per un'attivita nuova si scrive "since launch", mai "triplicato". Le demo hanno dati inventati, e si vede.
- **Un poster per pagina,** mai in fila.
- **Stack:** Astro su Cloudflare Pages. Poi Workers, D1, R2, Access, Turnstile, Resend per le mail, Daily per le call.

## Sospeso
- Nome del 05.3 (Work o Proof) e titolo "Results, not deliverables.".
- Elenco 04 Work: da disegnare.
- Progetti reali, oppure dichiarati come concept.
- Machine Room v0: da costruire con il modulo.
- Testi definitivi in inglese per tutte le pagine. Italiano scritto da Eso. Spagnolo e francese riletti da madrelingua.
- Integrazioni in Systems (Stripe, Shopify, Square, Xero, Google Calendar, WhatsApp, Email, API): quali restano. WhatsApp compare come demo di integrazione: va confermato.
- Systems: la riga "native iOS and Android" e le quattro promesse da confermare.
- Legale: giurisdizione, nome legale, registrazione, rilettura da avvocato.
- Anteprima dei link (Open Graph) e icona del sito.
- Quattro mail automatiche in quattro lingue.
- Manuale online: passare dalla v40 alla v42 quando Eso lo chiede.
- Nome reale della repo: CLAUDE.md dice esoimage-dev/mother-machine.
- Film: confermare che la versione in codice e quella finale. Esistono due MP4 del 13 ottobre (mother-machine-film-16x9.mp4 e mm18.mp4), non verificati.

## Da non rifare ne rimettere in discussione
- Pulsantiera, testata, cursore, vetro, targhetta delle lingue: approvati.
- Il foglio G con il bordo a zigzag. Niente quadrati perforati.
- Niente nome, foto o anno nello Studio. Niente vetro nello Studio.
- Niente mail o WhatsApp come canale di contatto.
- Niente "Cairns" o "Australia" in nessun testo.
- Niente hamburger. Niente backdrop-filter dal vivo su aree grandi.
- Il pomodoro solo su cio che si muove o risponde. Mai su titoli o fondi.
- La conferma "Received" semplice, senza timbro ruotato.
- Il selettore lingue come targhetta, non come fila di tasti.

## Passi di costruzione
Vedi CLAUDE.md, sezione "Il piano di costruzione".
