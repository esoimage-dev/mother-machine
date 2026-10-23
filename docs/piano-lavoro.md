# Piano di lavoro · Mother Machine (organizzato da PM, deciso da Eso)

Regola: una fase alla volta, ogni fase si chiude con anteprima + pull request unita. Le fasi 1 e 2 vengono prima di
tutto: senza Contact il sito non prende clienti.

## Fase 0 · Chiudere LG
- [ ] Ritocchi della stanza: `docs/lg-da-fare.md` (oggetti, server, cybersecurity, linee, TV, mini player).
- (Il gioco DEADLINE e' in fase 6: e' bello, ma non porta clienti prima del lancio.)

## Fase 1 · Contact vero (la priorita')
Serve da Eso: account Resend e Daily, chiavi messe come segreti su Cloudflare, record DNS di Resend su Cloudflare.
- [ ] Modulo "ordine di lavoro" -> salvato in Cloudflare D1, con numero d'ordine.
- [ ] Anti spam: Cloudflare Turnstile (gratis, niente cookie di tracciamento).
- [ ] Mail: conferma al cliente + avviso a noi (Resend). Posta in uscita come hello@ (SPF, DKIM, DMARC).
- [ ] Scelta dell'orario e link a una stanza Daily. Pagina "Your call is confirmed". Promemoria il giorno prima.
- [ ] Dettaglio del percorso: `docs/archivio/percorso-contatto.md`.

## Fase 2 · Prima del lancio
- [ ] **Audit completo con piu' agenti in parallelo**, ognuno un rapporto con priorita' (poi Eso sceglie cosa fare):
  grafica e coerenza del design system; UX e navigazione (pulsantiera, ascensore, telefono); copy (inglese corto,
  niente gergo, niente doppioni); prestazioni (60 fps, pesi, Lighthouse); accessibilita' (contrasti, tastiera,
  lettori di schermo, riduci movimento); browser veri (Safari iPhone, Android, Firefox); link rotti e 404.
- [ ] **Legale:** privacy (chi raccoglie i dati, cosa, quanto li teniamo, hello@; Privacy Act australiano e GDPR per
  l'Europa), termini minimi, nome legale e ABN dove serve.
- [ ] **SEO base:** titoli e descrizioni di ogni pagina, Open Graph e immagini per i social, sitemap, robots, dati
  strutturati (organizzazione, lavori), hreflang quando arrivano le lingue, pagina 404 nello stile del palazzo.
- [ ] **Sicurezza:** intestazioni (CSP, HSTS), Rate Limiting su `/api/porta` e sui moduli, repository privata.
- [ ] **Statistiche senza cookie:** Cloudflare Web Analytics (gratis, niente banner).

## Fase 3 · Lancio
- [ ] `PRIMA_DEL_LANCIO = false`, controllo finale su tutti i dispositivi, Google Search Console, profilo Google Business.

## Fase 4 · Lingue (IT, ES, FR)
- [ ] Decidere prima: lanciare solo in inglese (e nascondere la targhetta lingue) o aspettare le traduzioni.
- [ ] Struttura: `/it/`, `/es/`, `/fr/` con hreflang. Testi tradotti da Claude, controllati da un madrelingua
  (Eso per l'italiano; per ES e FR serve qualcuno).

## Fase 5 · Back office (Machine Room vera, la parte piu' grossa)
Dietro Cloudflare Access (solo Eso entra). A pezzi, in quest'ordine:
- [ ] Ordini: la lista delle richieste dal Contact, stato, note.
- [ ] Preventivi: dal modulo nasce la bozza, Eso la sistema e la manda.
- [ ] Fatture automatiche: dal preventivo accettato, PDF numerato, ABN e GST se serve, pagata o da pagare.
- [ ] Call: calendario delle chiamate Daily.
- [ ] Risponditore di mail: legge hello@, prepara le risposte nel nostro tono; le semplici partono, le altre in bozza.
- [ ] Approvazione delle insegne di DEADLINE (serve alla fase 6).
Prima di partire serve la chiacchierata su parte aziendale e fiscale (CLAUDE.md sezione 9).

## Fase 6 · Crescita e cose belle
- [ ] DEADLINE, il gioco del cabinato: `docs/lg-da-fare.md`.
- [ ] Social: profili (Instagram, LinkedIn), immagini e video brevi presi dal sito (la stanza, le demo, il gioco).
- [ ] Lavori nuovi nella pagina Work appena arrivano (sostituiscono i segnaposto Birrificio Mare e Forno Nove).
- [ ] Brand: "The system" animata. Animazioni allo scroll, film nuovo, footer ripensato.
- [ ] Musica continua tra le pagine (sito a pagina unica), solo se Eso lo vuole.

## Cose che servono da Eso (fuori dal codice)
- [ ] Account Resend e Daily, segreti su Cloudflare, DNS.
- [ ] Repository privata su GitHub.
- [ ] Parte aziendale e fiscale (ABN, GST, nome legale).
- [ ] Contenuti: foto e testi dei lavori nuovi, eventuali testimonianze dei clienti (con il loro permesso).
- [ ] Madrelingua per spagnolo e francese.
