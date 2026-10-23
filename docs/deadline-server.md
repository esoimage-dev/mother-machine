# DEADLINE · cosa accendere su Cloudflare (per Eso)

Il gioco funziona anche senza niente di questo: la classifica resta nel browser di chi gioca.
Con questi passi la classifica diventa una sola per tutti, controllata contro gli imbrogli, e il premio
(l'insegna di chi batte MONDAY) arriva a te da approvare. Tutto gratis a questi volumi.

## 1 · Il database (D1)
1. Cloudflare → **Storage & Databases** → **D1 SQL Database** → **Create**.
2. Nome: `mm-deadline`. Posizione: automatica. **Create**.
3. Apri il database → scheda **Console**.
4. Apri nella repository il file `scripts/deadline-d1.sql`, copia tutto, incolla nella console, **Execute**.
   Deve dire che ha creato tre tabelle (`dl_scores`, `dl_signs`, `dl_rate`). Si puo' rilanciare senza danni.

## 2 · Lo spazio per i loghi (R2)
1. Cloudflare → **R2 Object Storage** → **Create bucket** (la prima volta chiede di attivare R2: e' gratis fino a 10 GB,
   puo' chiedere una carta ma non addebita niente a questi volumi).
2. Nome: `mm-deadline-signs`. **Create**. Niente accesso pubblico: le immagini le serve il sito.

## 3 · Collegarli al sito (binding)
Workers & Pages → `mother-machine` → **Settings** → **Bindings** → **Add**:
- **D1 database**: nome della variabile `DL_DB`, database `mm-deadline`.
- **R2 bucket**: nome della variabile `DL_SIGNS`, bucket `mm-deadline-signs`.

Farlo **due volte**: per **Production** e per **Preview** (in alto si sceglie l'ambiente).
I nomi devono essere esattamente `DL_DB` e `DL_SIGNS`.

## 4 · La chiave per firmare le partite (segreto)
Settings → **Variables and Secrets** → **Add** → tipo **Secret**:
- Nome `MM_DL_KEY`, valore: una frase lunga a caso (almeno 32 caratteri, non serve ricordarla).
- Anche qui per Production e per Preview. Mai in chat, mai nella repository.

Se manca, il sito usa `MM_DOOR_KEY` (quella della porta): funziona, ma meglio una chiave sua.

## 5 · Far ripartire il sito
I binding valgono dal deploy successivo: Deployments → l'ultimo → **Retry deployment** (o il prossimo push).

## 6 · Controllo
- `https://mothermachine.studio/api/deadline/top` deve rispondere `{"ok":true,"top":[]}`.
- Se risponde `{"offline":true}`: manca un binding, o la tabella (rifare il punto 1.4), o il deploy (punto 5).

## 7 · Approvare le insegne
1. Vai in LG e apri la porta con il codice sulla pulsantiera (come per il Secret lab).
2. Apri `https://mothermachine.studio/lg/signs`.
3. Per ogni insegna vedi: l'anteprima al neon, nome, link, riga, tipo di palazzo, mail del vincitore.
4. **Prima di decidere, se vuoi scrivergli, fallo adesso**: dopo Approve o Reject la mail si cancella
   (lo diciamo nella privacy: la mail serve solo a contattare il vincitore).
5. **Approve**: l'insegna va nella citta' del gioco (entro un minuto). **Reject**: si cancellano insegna e logo.
   Il gettone della porta dura 8 ore; dopo, si riapre la porta.

Regole che il server fa da solo: una insegna per partita vinta, una per attivita' (stesso nome o stesso link),
solo chi ha davvero battuto MONDAY entro 48 ore dalla partita, logo solo PNG fino a 80 KB.

## Anti imbrogli, in breve
- All'inizio della partita il server firma un gettone (ora d'inizio). Il punteggio si manda una volta sola, entro 2 ore.
- Il server controlla: tempo vero passato, punteggio massimo al secondo, giorni finiti e loro durata, nemici al minuto,
  tetto assoluto. Le partite impossibili si salvano come respinte e non entrano in classifica.
- Tentativi limitati per persona (l'indirizzo IP si salva solo come impronta, non in chiaro).
- I numeri si cambiano in `public/_worker.js`, oggetto `DL`, se il gioco cambia i punteggi.

## Dopo (quando c'e' il back office vero)
Mettere **Cloudflare Access** davanti a `/lg/signs` e `/lg/room` (Zero Trust → Access → Applications → Self-hosted,
percorsi `mothermachine.studio/lg/signs*` e `/lg/room*`, accesso solo con la mail dello studio). Allora la porta con il
codice resta il gioco, e l'approvazione e' protetta da un login vero.
