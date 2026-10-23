# Piano di lavoro · Mother Machine (organizzato da PM, deciso da Eso)

Obiettivo di Eso: **lanciare tra pochi giorni**. Quindi due binari:
- **Binario A, lancio rapido:** solo quello che serve per essere online, credibili, sicuri e pronti a prendere clienti.
- **Binario B, dopo il lancio:** back office, contratti, giochi, crescita.
Ogni blocco si chiude con anteprima + pull request unita da Eso. Lavoro con agenti solo dove serve davvero (audit).

---

## BINARIO A · Lancio rapido (in ordine)

### A1 · Contact vero (senza questo il sito non prende clienti)
Serve da Eso: account Resend e Daily, chiavi come segreti su Cloudflare, record DNS di Resend.
- [ ] Modulo "ordine di lavoro" -> Cloudflare D1, numero d'ordine. Anti spam Turnstile (niente cookie).
- [ ] Mail: conferma al cliente + avviso a noi (Resend), posta da hello@ con SPF, DKIM, DMARC (sennò finisce nello spam).
- [ ] Scelta dell'orario, link alla stanza Daily, pagina "Your call is confirmed", promemoria. Dettaglio: `docs/archivio/percorso-contatto.md`.

### A2 · Sicurezza nostra (base, prima del lancio; NON si racconta sul sito)
Cose che fa Eso (Claude guida passo passo):
- [ ] Gestore di password (Bitwarden o 1Password) e password diverse ovunque.
- [ ] 2FA con app o passkey (non SMS) su: GitHub, Cloudflare, GoDaddy, Gmail dello studio, Resend, Daily.
- [ ] GoDaddy: blocco del dominio (domain lock) e rinnovo automatico.
- [ ] GitHub: repository privata, protezione di `main`, Dependabot e secret scanning accesi.
- [ ] Cloudflare: chiavi API con permessi minimi; segreti solo li'.
Cose che fa Claude:
- [ ] Intestazioni di sicurezza (CSP, HSTS, niente iframe esterni non voluti), Rate Limiting su `/api/porta` e sui moduli.
- [ ] **La porta del back office:** il codice della pulsantiera resta come gioco/easter egg, ma il back office vero
  (`/lg/room`, poi Machine Room) va dietro **Cloudflare Access** (gratis fino a 50 persone): entra solo la mail di Eso,
  con codice via mail o login Google + 2FA. Il codice da solo non basta piu'.

### A3 · Audit completo e salto di qualita' (con piu' agenti in parallelo)
Ogni agente fa un rapporto con priorita', Eso sceglie, poi si fa. Riferimenti alti (Metalab, Lusion, Work & Co).
- [ ] **Grafica e tipografia:** testi grandi e decisi, gerarchia, spazi; hero e footer delle pagine (la testata e la
  pulsantiera sono gia' forti e non si toccano; il footer si puo' ripensare con Eso).
- [ ] **Sezioni e contenuti:** dentro ogni pagina, cosa e' ridondante, cosa manca, cosa si capisce subito.
- [ ] **Copy:** inglese corto, immediato, niente gergo, niente doppioni.
- [ ] **UX e telefono:** pulsantiera, ascensore, scroll, tocchi, mini player.
- [ ] **Prestazioni e accessibilita':** 60 fps, pesi, Lighthouse, contrasti, tastiera, riduci movimento.
- [ ] **Browser veri:** Safari iPhone, Android, Firefox. Link rotti, pagina 404 nello stile del palazzo.
- [ ] **Nuovo elemento grafico (idea di Eso): la selezione pomodoro.** Quando si seleziona il testo, il box e'
  pomodoro: sui titoli grandi e' bellissimo. Usarlo **ogni tanto** come segno grafico (una parola "selezionata" in un
  titolo, magari che si seleziona da sola allo scroll). Poche volte, mai ovunque.

### A4 · Bug da sistemare (piccoli, prima del lancio)
- [ ] **Home, trascinamento della striscia dei lavori (soprattutto su computer):** scatta, glitcha, e' lento e
  macchinoso. Mentre trascini **seleziona il testo delle schede** (tutto pomodoro): durante il trascinamento la
  selezione va bloccata. Da rifare liscio (stile trascinamento di Lusion/Metalab).
- [ ] Mini player su telefono che copre il selettore (vedi `docs/lg-da-fare.md`).

### A5 · Legale minimo per il sito
- [ ] **Privacy:** chi raccoglie i dati (nome legale), cosa, perche', quanto si tengono, dove stanno (Cloudflare, Resend,
  Daily), come chiederne la cancellazione (hello@). Privacy Act australiano e GDPR europeo (clienti in Italia).
- [ ] **Terms del sito:** brevi (uso del sito, gioco e premio, niente garanzie sui contenuti).
- [ ] I termini dei progetti veri stanno nel contratto (binario B), non sul sito.

### A6 · SEO e presenza
- [ ] Titoli e descrizioni di ogni pagina, Open Graph con immagini per i social, sitemap, robots, dati strutturati.
- [ ] Cloudflare Web Analytics (gratis, niente cookie, niente banner).
- [ ] Al lancio: Google Search Console, **profilo Google Business** (conta molto per le attivita' locali a Cairns).

### A7 · Lingue
- [ ] Decisione di Eso: lanciare in inglese (+ italiano?) e nascondere le lingue non pronte, o aspettare tutte.
- [ ] Struttura `/it/`, `/es/`, `/fr/` con hreflang. Tradotto da Claude, controllato da madrelingua (ES e FR: serve qualcuno).

### A8 · Lancio
- [ ] `PRIMA_DEL_LANCIO = false`, controllo finale su tutti i dispositivi, prima mail di prova end-to-end.

---

## BINARIO B · Dopo il lancio

### B1 · Contratti, fatture, fisco (prima del back office, perche' il back office li automatizza)
Da verificare con un **commercialista** (fisco) e un **avvocato** (contratto), una volta sola. Claude prepara le bozze.
- [ ] **Fisco:** dove si fattura. Ipotesi piu' semplice: tutto dall'Australia con ABN, anche ai clienti esteri
  (export di servizi: di solito senza GST australiana; in Italia il cliente con partita IVA gestisce l'IVA lui).
  **Dipende da dove Eso e' residente per le tasse:** e' la domanda da fare al commercialista. Niente societa' o
  partita IVA in Italia per ora, finche' il commercialista non dice che serve.
- [ ] **Contratto tipo (Statement of Work + condizioni generali)**, firmato prima di partire:
  - cosa e' compreso e cosa no (scope), con le consegne;
  - **revisioni:** quante (es. 2 giri per fase), le altre a ore;
  - **assistenza:** periodo incluso dopo il lancio (es. 30 giorni sui bug), poi un piano mensile a pagamento;
  - **proprieta':** il cliente possiede il suo prodotto finito e i suoi contenuti dopo il pagamento completo; Mother
    Machine resta proprietaria dei pezzi riusabili (motori, componenti, librerie) e li concede in licenza;
  - pagamenti a tappe (es. 40/30/30), cosa succede se il cliente sparisce, limite di responsabilita';
  - diritto di mostrare il lavoro nel portfolio (con i numeri approvati);
  - firma digitale (anche dentro il back office).
- [ ] **Fatture:** tax invoice con ABN, GST se serve, numerata, PDF (automatica nel back office, B2).

### B2 · Back office (Machine Room vera, la parte piu' grossa, a pezzi)
Dietro Cloudflare Access (A2). In quest'ordine:
- [ ] Ordini dal Contact (lista, stato, note).
- [ ] Preventivi -> contratto da firmare -> fatture automatiche (pagata / da pagare).
- [ ] Calendario delle call Daily.
- [ ] Risponditore di mail su hello@ (risposte nel nostro tono; semplici in automatico, le altre in bozza).
- [ ] Approvazione delle insegne di DEADLINE.

### B3 · Sicurezza per i clienti (e cosa possiamo davvero offrire)
- [ ] **Subito, sui lavori gia' consegnati (Vitalia's Pizza on Wheels e Vitalia's Restaurant):** il back office ha
  solo una password. Mettere davanti Cloudflare Access (o login con 2FA), limite ai tentativi, sessioni che scadono,
  password salvate solo come hash forte, backup automatici, registro degli accessi, aggiornamenti delle dipendenze.
  E' un lavoro piccolo, da proporre ai clienti come miglioria (o regalarla per tenerli contenti).
- [ ] **Lo standard per ogni progetto nuovo ("secure by default"), una checklist nostra:** login con 2FA o Access,
  permessi minimi, dati cifrati, backup e prova di ripristino, monitoraggio e avvisi, aggiornamenti, nessuna chiave
  nel codice, privacy fatta bene. Questo e' quello che vendiamo.
- [ ] **Cosa dire sul sito (Systems, il server della cybersecurity in LG):** solo cose vere che facciamo davvero.
  Niente certificazioni che non abbiamo, niente "military grade". Dopo B3 i testi si riscrivono su fatti concreti.

### B4 · Crescita (piccolo, NON prioritario ora)
- [ ] Eso trova i clienti di persona: serve un **mini kit** (una pagina PDF o un link alla demo, due frasi, il QR del sito).
- [ ] Piu' avanti, se serve: Instagram/LinkedIn con contenuti presi dal sito (stanza, demo, gioco) e poche sponsorizzate
  mirate verso il sito. Non ora.
- [ ] Testimonianze dei clienti (una frase di Vitalia's vale piu' di dieci nostre), con il loro permesso.
- [ ] Lavori nuovi in Work appena arrivano (sostituiscono Birrificio Mare e Forno Nove).

### B5 · LG e cose belle
- [ ] Ritocchi della stanza e il gioco DEADLINE: `docs/lg-da-fare.md`.
- [ ] Brand "The system" animata, animazioni allo scroll, film nuovo.
- [ ] Musica continua tra le pagine (sito a pagina unica), solo se Eso lo vuole.

---

## Da Eso (fuori dal codice), in ordine di urgenza
1. [ ] Account Resend e Daily, segreti su Cloudflare, DNS di Resend.
2. [ ] Sicurezza degli account (A2): gestore di password, 2FA ovunque, blocco del dominio, repository privata.
3. [ ] Lingue: quali al lancio.
4. [ ] Commercialista (residenza fiscale, ABN, GST, clienti esteri) e avvocato (contratto tipo).
5. [ ] Madrelingua per ES e FR, quando si fanno.
