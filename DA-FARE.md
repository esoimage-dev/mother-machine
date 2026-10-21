# Da fare

Lista viva del progetto. Si spunta quando una cosa è fatta, si aggiunge quando nasce. Mai scrivere qui codici o segreti.
Il piano di lancio in 3 giorni, con le decisioni e l'ordine, è in `docs/PIANO.md`.

## Lancio · giorno 1
- [ ] Nameserver del dominio da GoDaddy a Cloudflare (Eso, la mattina: la propagazione blocca le mail).
- [ ] Materiali e permessi dei quattro lavori veri: Vitalia's Pizza on Wheels, Vitalia's Restaurant, Machine Room, Mother Machine (Eso).
- [ ] Pagine progetto: Vitalia's Pizza on Wheels, Mother Machine, Vitalia's Restaurant, Machine Room.
- [ ] Togliere i numeri ai progetti ("No. 012", "Study 03", "No. 001 · 012") da Work, home e pagina progetto.
- [ ] Work in home: due proposte con screenshot, poi costruire la scelta.

## Lancio · giorno 2
- [ ] Contact vero: Worker, D1, Turnstile, Resend (conferma al cliente, avviso a noi), call con stanza Daily standard.
- [ ] Machine Room v1: lista e dettaglio degli ordini veri da D1.
- [ ] Testi: Studio a 3 sezioni, Brand e Systems piu' corti, riga sicurezza in Systems, un solo "free", via i doppioni.
- [ ] Ordine della home (Work subito dopo l'apertura): screenshot e conferma.

## Lancio · giorno 3
- [ ] Privacy con nome legale, ABN, indirizzo; ABN nel footer; SEO; Open Graph; doctype.
- [ ] Controllo finale su tutte le pagine e i dispositivi; modulo e mail provati davvero.
- [ ] Merge su `main`, dominio attivo, repository privata, Rate Limiting su `/api/porta`.

## Dopo il lancio
- [ ] Machine Room completa e Cloudflare Access.
- [ ] Stanza Daily vestita Mother Machine, pagina "Your call is confirmed", promemoria.
- [ ] LG laboratorio: le provette (i nostri prodotti), la sala macchine (server e sicurezza), il gioco.
- [ ] Animazioni allo scroll; film nuovo; footer ripensato.
- [ ] Apertura della home: decidere dopo Work (citofono su telefono, versione B su desktop per ora).

## Subito (Eso, su Cloudflare e GitHub)
- [x] Segreti della porta di LG su Cloudflare (fatto il 19 ottobre, Produzione e Anteprima): Workers & Pages → mother-machine → Settings → Variables and Secrets,
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
