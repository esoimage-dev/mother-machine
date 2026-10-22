# Da fare

Lista viva del progetto. Si spunta quando una cosa è fatta, si aggiunge quando nasce. Mai scrivere qui codici o segreti.
Il piano di lancio in 3 giorni, con le decisioni e l'ordine, è in `docs/PIANO.md`.

## Scaletta aggiornata (23 ottobre)
Il sito è online su mothermachine.studio, ancora fuori da Google. Fatti: home con i lavori subito dopo l'apertura,
le due pagine Vitalia's con le demo vere e le fasce, dominio, posta in entrata.
Deciso da Eso: niente progetti nostri (Mother Machine, Machine Room) nei lavori; "Cairns, Australia" sui lavori si mostra.

1. **Pagina Work (04) a posto.** Oggi online ha ancora "No. 012" e "No. 011" e il ristorante senza link. Lavoro corto.
2. **Contact vero.** Modulo, ordine salvato (D1), anti spam (Turnstile), mail di conferma al cliente e avviso a noi (Resend),
   scelta dell'orario e link a una stanza Daily standard. Senza questo il sito non può prendere clienti.
3. **Systems assorbe le macchine di LG.** Le animazioni migliori di LG vanno nella pagina 02, che diventa più forte;
   più la riga sulla sicurezza. LG torna a essere solo la porta dello staff (la chiave) verso la Machine Room.
4. **Brand e Studio.** Testi più corti, un lavoro vero come prova, Studio in tre parti (Survey, Build, Run).
5. **Legale e Google.** Privacy con nome legale, ABN, indirizzo; ABN nel footer; titoli e descrizioni; anteprime social.
6. **Lancio.** `PRIMA_DEL_LANCIO = false`, repository privata, Rate Limiting su `/api/porta`, controllo su tutti i dispositivi.
7. **Dopo il lancio.** Machine Room vera (ordini, risposte, preventivi, call), Cloudflare Access, stanza Daily vestita
   Mother Machine, promemoria; poi il gioco di LG, animazioni allo scroll, film nuovo, footer.

Serve da Eso: account Resend e Daily (gratis), nome legale, ABN e indirizzo per la privacy, repository privata (un minuto).

## Lancio · giorno 1
- [x] Nameserver del dominio da GoDaddy a Cloudflare (21 ottobre).
- [x] Materiali dei due lavori veri: Vitalia's Pizza on Wheels e Vitalia's Restaurant. Machine Room e Mother Machine non vanno nei lavori (deciso da Eso il 23 ottobre).
- [x] Pagina progetto Vitalia's Pizza on Wheels: materiali veri, numeri veri, demo vera telefono e computer (21 ottobre).
  Per rifare la demo dal codice del cliente: `python3 scripts/demo-vitalias.py /percorso/vitalias-pizza-on-wheels`.
- [x] Pagina progetto Vitalia's Restaurant con demo, numeri e fasce (22-23 ottobre).
- [ ] Togliere i numeri ai progetti dalla pagina Work (in home e nelle pagine progetto sono già spariti).
- [x] Work in home: striscia orizzontale con selettore e macchine in piccolo (22 ottobre). Birrificio Mare e Forno Nove restano segnaposto finché non arrivano lavori veri.

## Lancio · giorno 2
- [ ] Contact vero: Worker, D1, Turnstile, Resend (conferma al cliente, avviso a noi), call con stanza Daily standard.
- [ ] Machine Room v1: lista e dettaglio degli ordini veri da D1.
- [ ] Testi: Studio a 3 sezioni, Brand e Systems piu' corti, riga sicurezza in Systems, un solo "free", via i doppioni.
- [x] Ordine della home: apertura, Work, What we build, How we work, In motion, porta verso G (22 ottobre).

## Lancio · giorno 3
- [ ] Privacy con nome legale, ABN, indirizzo; ABN nel footer; SEO; Open Graph; doctype.
- [ ] Controllo finale su tutte le pagine e i dispositivi; modulo e mail provati davvero.
- [ ] Lancio: in `public/_worker.js` `PRIMA_DEL_LANCIO = false` (oggi Google non indicizza), repository privata, Rate Limiting su `/api/porta`.
- [x] Sito su `main` (pull request #1, 21 ottobre), con il blocco per Google acceso.
- [x] Dominio collegato: mothermachine.studio e www sono online (21 ottobre).
- [x] Posta in entrata: hello@mothermachine.studio → mothermachine.studio@gmail.com (Cloudflare Email Routing, provato il 21 ottobre).
- [ ] Posta in uscita come hello@: Resend (dominio da verificare) e "Invia come" nel Gmail dello studio.
- [ ] Dopo il lancio: la posta dentro la Machine Room (Email Routing → Worker → D1), il Gmail resta come copia.

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
- [x] "Cairns": si mostra (deciso da Eso il 23 ottobre).
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
- [x] Dominio mothermachine.studio: nameserver da GoDaddy a Cloudflare.
- [ ] Mail: Email Routing verso Gmail, invio come hello@ con Resend (serve il dominio verificato).
- [x] Merge su `main`.
