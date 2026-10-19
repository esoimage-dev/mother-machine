# Da fare

Lista viva del progetto. Si spunta quando una cosa è fatta, si aggiunge quando nasce. Mai scrivere qui codici o segreti.

## Subito (Eso, su Cloudflare e GitHub)
- [ ] Segreti della porta di LG su Cloudflare: Workers & Pages → mother-machine → Settings → Variables and Secrets,
      tipo Secret, sia Production sia Preview: `MM_DOOR_CODE` (i bottoni separati da trattini) e `MM_DOOR_KEY`
      (stringa lunga e casuale, almeno 40 caratteri). Poi un nuovo deploy. Senza, la porta dice sempre "Try again".
      Controllo: aprire `/api/porta` sul sito deve dare `"pronta":true`.
- [ ] Rendere privata la repository GitHub (Settings → Change visibility → Private). Oggi è pubblica.

## Sicurezza, prima di mettere dati veri nel back office
- [ ] Cloudflare Access davanti a `/lg/room`: dopo il codice, mail e codice usa e getta solo per lo staff.
- [ ] Regola di Rate Limiting su `/api/porta` (blocca chi prova troppi codici).

## Testi da approvare (Eso)
- [ ] Frase sotto il titolo della home, più corta. Proposte: "Software your company runs on. A brand it's known by." /
      "We build the software and the brand." / "Custom software and brands, from one studio."
- [ ] Testi di LG: "You can watch. Only we touch.", "Down here, things move.", "Staff only." e le didascalie delle sei macchine.
- [ ] Testo nuovo della pagina Work.
- [ ] Riga privacy sotto il bottone d'invio di Contact ("We only use this to answer you. Privacy.").
- [ ] "Lost it? Enter your order number and we send the link again." al posto di "Already booked?" in Contact.

## Decisioni aperte
- [ ] Ordine delle sezioni della home; slider di 05.4; "three steps" di 05.5.
- [ ] LG: sei macchine o quattro più grandi.
- [ ] Brand apre al buio, il manuale lo vuole bianco.
- [ ] Footer di Work senza le lingue.
- [ ] "Cairns" nel testo della pagina progetto (contro la regola).
- [ ] Numeri di serie dei progetti.
- [ ] Altre modifiche alla pagina Brand (le dà Eso).

## Da costruire
- [ ] Pagina "Your call is confirmed" (si apre da "Confirm my call" nella mail).
- [ ] Stanza della call con Daily, vestita Mother Machine (link solo per mail).
- [ ] Motore vero: Worker, D1, Turnstile, le quattro mail con Resend in quattro lingue, promemoria e orari liberati dopo 24 ore.
- [ ] Machine Room vera: dati dal database, bottoni Reply, Move call, Make quote, Calls, Inbox, Quotes.
- [ ] Materiali veri dei progetti (Vitalia's e gli altri).
- [ ] Privacy: nome legale, registrazione, indirizzo, rilettura da avvocato. Togliere la scritta "Bozza".

## Prima di andare online
- [ ] Doctype nelle pagine, con confronto visivo completo.
- [ ] Dominio mothermachine.studio: nameserver da GoDaddy a Cloudflare.
- [ ] Mail: Email Routing verso Gmail, invio come hello@ con Resend (serve il dominio verificato).
- [ ] Merge su `main`.
