# Percorso di contatto · cosa costruiamo dopo il modulo

Scritto il 18 ottobre 2026. La verità visiva resta `prototipo/contact.html`: dentro ci sono tutte e cinque le scene
(barra "Percorso" in alto). Nel sito vero la pagina Contact mostra solo il modulo; le scene 2-5 vengono tolte al
montaggio (`scripts/monta-pagine.py`, blocco `contact`) e restano nel prototipo come progetto.

| Scena nel prototipo | Diventa nel sito vero |
|---|---|
| 1 Contact | `/contact`, il modulo (già nel sito) |
| 2 Mail | quattro mail automatiche, da hello@mothermachine.studio con Resend |
| 3 Confermata | la pagina che si apre quando il cliente tocca "Confirm my call" nella mail |
| 4 La call | la stanza della call, Daily dentro una pagina nostra |
| 5 Machine Room | il back office dello studio, dietro LG |

## 1 · Il modulo (ordine di lavoro)
- Numero dell'ordine: `G-AAMM-NN` (G piano terra, anno e mese, numero progressivo del mese). Esempio G-2610-07.
- Passi: **Need** (Back office, App, Website or shop, Brand, Not sure yet + "In your words", facoltativo) → **You**
  (nome, email, business facoltativo) → **Start**, due strade:
  - **A · Talk**: "Book a free call", 30 minuti sul nostro sito, si sceglie l'orario → passo **Time**.
  - **B · Write**: "Tell us more first" → passo **Details** (cosa fai, l'idea, cosa usi oggi, quando, un link).
    Da qui si può mandare solo il brief ("Send the brief") oppure anche prenotare ("Send and book a call" → Time).
- Orari della call: lunedì-venerdì, 9:30, 11:00, 14:00, 16:30 ora dello studio (UTC+10 nel prototipo). Al cliente
  si mostrano nel suo fuso ("your time"); in Machine Room nel nostro ("our time").
- Dopo l'invio: "Received" sul foglio, senza timbro ruotato. Con la call: "One last step: tap Confirm in the email
  we sent to ...". Senza call: "We read your brief today and reply by email within one working day".
- Niente mail diretta, niente WhatsApp: tutto passa dal modulo. Anti-spam con Turnstile.

## 2 · Le quattro mail (Resend, quattro lingue: EN, IT, ES, FR)
Firma di tutte: "Just reply, a person reads it." · mothermachine.studio. In alto il marchio e il numero dell'ordine.

| Mail | Quando | Oggetto | Contenuto |
|---|---|---|---|
| Confirm | subito dopo l'invio, con call | Confirm your call · G-... | "Hi Sarah, one tap to confirm your call." Giorno e ora nel suo fuso. Se non conferma entro **24 ore**, l'orario si libera. Bottone "Confirm my call", link "Pick a new one", riepilogo dell'ordine. |
| Reminder 1 | **24 ore prima** (solo se confermata) | Tomorrow, 11:00 · our call | "See you tomorrow at 11:00." 30 minuti, sul nostro sito, niente da installare. Bottone "Your call room", "Add to calendar", "Move the call". |
| Reminder 2 | **1 ora prima** | In one hour · join here | "In one hour. The room is ready." Bottone "Join the call". Camera facoltativa. |
| Received | subito dopo l'invio, senza call | We got it · G-... | "Hi Sarah, your order is in." Leggiamo oggi; entro un giorno lavorativo una prima idea e, se basta, una forbice di prezzo. Link "Book a free call". |

Lingua della call: in inglese non si dice niente; in italiano "La call può essere in italiano o in inglese."; in
spagnolo e francese si dice che la call è in inglese (blocco `calang` già nel modulo).

## 3 · Confermata
Si apre dal bottone "Confirm my call" della prima mail (link personale con un token). Mostra: "Your call is
confirmed.", numero dell'ordine, giorno e ora nel fuso del cliente, 30 min, i due promemoria, "The call opens here,
on our site.", Add to calendar (Google, Apple, Outlook), "Can't make it? Pick another time". A destra il biglietto
"G · Ground floor".

## 4 · La call (Daily)
- La stanza è una pagina nostra con Daily dentro, vestita Mother Machine: anteprima della camera, Mic, Camera,
  "Join the call", poi la call con "On the table" (l'ordine) e i tasti Mic, Camera, Share screen, Leave.
- Il link personale arriva **solo per mail**. Non registriamo le call.

## 5 · Machine Room (LG)
Il back office dello studio. Nel prototipo: Orders, Calls, Inbox, Quotes; contatori (New orders, To confirm,
Calls this week, Quotes out); calendario della settimana (Confirmed, To confirm, Free); scheda dell'ordine con
Reply, Move call, Make quote; lo stato delle mail automatiche; la storia; la notifica "New work order" sul telefono.

## Pezzi tecnici
Cloudflare Worker (API), D1 (ordini, slot, token), Turnstile (anti-spam), Resend (mail, serve il dominio collegato
e verificato), Daily (call), Cloudflare Access (protezione vera della Machine Room), Cron del Worker per i promemoria
e per liberare gli orari non confermati dopo 24 ore.
