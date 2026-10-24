# DEADLINE · cosa resta da fare (scritto dagli agenti a fine giro, 24 ottobre)


## DA ESO, 24 ottobre, dopo aver giocato (prima di tutto il resto)
- [ ] **Cosa sparano i nemici**: i colpi nemici vanno ripensati (piu' belli, piu' a tema, piu' leggibili).
- [ ] **I palazzi della CITY per le insegne (ristorante, hotel, ecc.) sono brutti**: rifarli; Eso vuole rivederli uno
  per uno con Claude (veloce) prima di chiuderli.
- [~] **Dialoghi troppo veloci** (primo giro fatto il 24 ottobre: scrittura a 20 lettere/s, ogni riga resta 1,6 s + il tempo di leggerla, carta del boss 2,2 s; da riprovare): entrata dei boss e ogni scambio di battute M8/boss non si fanno in tempo a leggere.
  Rallentare: piu' tempo per riga, pause piu' lunghe tra un messaggio e l'altro, il giocatore deve potersi godere le
  battute (il gioco resta veloce, ma qui ci vuole respiro). Le battute possono diventare ancora piu' buffe.

## CORE
# DEADLINE · CORE · cose ancora da fare (in ordine)

1. Difficolta' vera: il bot vince 3 partite su 4 (con le due tazze in piu'). Far provare a persone vere; se troppo facile,
   togliere la tazza del mercoledi' (una riga in clockOut) o alzare la vita dei boss del weekend.
2. MONDAY: entrata + 5 battute = circa 12 s (la NARRATIVA chiede 8-10). Accorciare le pause tra le righe o unire due righe.
3. ART.bossCard: quando ART la consegna si usa da sola (c'e' gia' il ponte); per ora la card e' quella di CORE.
4. Mappa a 7 tappe di ART giro 5: verificare che ART.map riceva `installed` nel formato giusto (oggi {indice: sistema}).
5. HUD icona + parola (BOOK, AUTO, AI, NIGHT): e' di ART (hudSystems); controllare la leggibilita' sul telefono a 360 px.
6. Telefono in orizzontale piccolo (740x360): lo schermo resta a 1x (480x270); si potrebbe usare la scala frazionaria.
7. Prestazioni MONDAY sul telefono: a CPU 4x lenta 17-19 ms di media, picchi 50-66 ms (lavoro di raster/GPU, non JS).
   Possibili: canvas FX spento sotto una soglia, meno bagliori, meno colpi nella fase 3.
8. FRIDAY: rifinire le consegne (un furgone che passa? ordini con un timer visibile?). Piace molto: non stravolgere.
9. La strada di ART non ha un'API per spegnere le vetrine: CORE le scurisce con un rettangolo; meglio un ART.streetDark.
10. Pulizia prima del lancio: togliere public/_prova-core.html (e le altre pagine di prova), lasciare il gancio di debug solo con ?dldebug.

## ART
# TODO ART (DEADLINE), giro 5 - quello che resta, in ordine

1. **HUD icona + parola** (non fatto):
   - ART.hudBusiness (OPEN + barra, scritta BUSINESS)
   - icona orologio-freccia in hudCounter (HOURS SAVED)
   - etichette BOOK/AUTO/AI/NIGHT sotto le icone di hudSystems
   - controllo leggibilita' a 390 px
2. **Negozi della citta' del titolo** (non fatto). Dettagli per tipo in ART.building, kind gia' esistenti:
   - restaurant: tavoli fuori, tenda a righe, insegna pizza
   - streetfood: carretto con ombrellone
   - clothing: manichini e grucce
   - hairdresser: palo da barbiere e poltrona
   - supermarket: carrelli e cartelli SALE
   - hotel: portiere, tappeto, stelle
   - cafe: neon tazza che fuma
   - gym: neon manubrio e tapis roulant
3. **Mappa, ritocchi:**
   - la stella di SAT e' quasi tutta crema: va resa oro (regola dei bordi in buildSym)
   - il server di THU tocca l'etichetta MONDAY: abbassarlo o stringerlo
   - M8 sulla torre copre la faccia di MONDAY: spostarlo a lato del nodo
   - le buste animate di WED sbiadendo diventano grigie
4. **M8:**
   - umore 'angry' con le sopracciglia (oggi = focus)
   - variante b: pannello grigio sulla pancia, da sistemare o togliere (default 'a')
   - provare M8 a scala di gioco dentro le scene vere (hscene)
   - misurare la hitbox con shot-art/sizes2.js
5. **Ritratti:** talk e angry quasi uguali per SCARIES e VOICEMAIL: differenziarli di piu'.
6. **Chiusura:**
   - header del file: documentare le API del giro 5 (hero, m8Variant, prepareHero, gearAI, bossCard, bossInfo, van, size.van, ritratto 'm8')
   - controllo prestazioni (perf5.js), soprattutto la mappa
   - controllo del trattino lungo

## AUDIO
# DEADLINE · audio, cose rimaste (round 2 chiuso in stato funzionante e bilanciato)

## Per CORE (integrazione, nomi gia' pronti in deadline-audio.js)
- Lotta con MONDAY: `music('monday')` (o `music('boss', {boss:'monday'})`); oggi CORE usa 'boss' anche per MONDAY.
- Card del boss: `A.sting('voicemail'|'replyall'|'paperjam'|'urgent'|'onestar'|'scaries'|'monday')`; OVERTIME: `sfx('siren')`;
  inizio lotta: `sfx('clockIn')`; SYSTEM INSTALLED: `sfx('install')`; consegna FRIDAY: `sfx('deliver')`.
- Armi: `shoot` / `shootAuto` / `shootAI` secondo il sistema attivo; scudo che para: `shieldHit`.
- Nemici: `paper` (fattura), `ring` (chiamata), `review` (una stella), `explosion` (nemici grossi).
- Dialoghi: `sfx('typewriter')` per carattere (limitato a uno ogni 30 ms); M8: `sfx('m8', {mood:'happy'|'hurt'|'surprised'})`.
- Passare sempre `intensity`/`flow` in `music()` quando si cambia brano (altrimenti ripartono da 0).

## Idee non fatte
- Stinger brevi a meta' vita del boss e alla sconfitta (oggi: bossHit/bossDie).
- Variante del tema 'boss' per ogni boss (stesso riff, timbro e tonalita' diversi) invece di uno solo.
- Musica del virus (THURSDAY dentro il server) e del "Friday rush" come brani propri; oggi thu/fri.
- 'mon' (giorno) e 'monday' (lotta) potrebbero condividere di piu' il materiale.
- Voce di M8 legata al testo (bip per sillaba al posto del typewriter quando parla M8).
- Ascolto vero da parte di Eso: le misure sono offline, la musicalita' va giudicata a orecchio su `public/_prova-audio.html`.
- Bug noto in `public/js/musica.js` (non toccato): i gain partono da 1 prima dell'attacco, piccoli click al primo campione.
- Prima del lancio: cancellare `public/_prova-audio.html`.

## Come riprendere (per chi riprende)
- Tutto il progetto del gioco sta in `docs/deadline/`: SPEC.md (base), DESIGN-V2.md (logica, V3 scorrimento laterale,
  liste di controllo), NARRATIVA.md (M8, boss, battute: vincolante), ART-BRIEF.md (stile), CONTRATTO.md (API tra i file).
- Codice: `public/js/deadline-art.js`, `deadline.js` + `public/css/deadline.css`, `deadline-audio.js`, `deadline-net.js`,
  `deadline-sign.js`, rotte `/api/deadline/*` in `public/_worker.js` (configurazione: `docs/deadline-server.md`).
- Pagine di prova in `docs/deadline/prove/`: per usarle copiarle in `public/` (e toglierle prima del push).
  `_prova-core.html?dldebug` ha il gancio `DEADLINE._debug` (day(n), god, bot, win, lose...).
- Prossimo giro: QA con due agenti tester (computer e telefono) sulla versione nuova, poi le liste sopra.
