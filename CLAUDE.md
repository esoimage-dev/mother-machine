# Mother Machine · passaggio al sito vero

Pacchetto del 15 ottobre 2026. Contiene tutto quello che serve per costruire mothermachine.studio partendo dal prototipo approvato. Chi lavora su questo progetto legge prima questo file.

## Regole di lavoro (sempre)
- Rispondere a Eso in italiano. Testi del sito in inglese internazionale: frasi corte, parole semplici, niente gergo da agenzia.
- **Mai il trattino lungo** (il carattere U+2014), in nessun testo, codice, commento o messaggio. Solo il trattino corto "-" per orari o parole composte.
- Critica brutale ma bilanciata, da PM, art director e senior designer. Discutere prima in chat quando una scelta cambia contenuti o struttura; non inventare voci, servizi o idee non richieste.
- Non toccare ciò che è approvato (hero, testata, pulsantiera, cursore, vetro). Portarlo nel sito identico.
- Tutto leggero e tecnicamente impeccabile: 60 fps, niente backdrop-filter dal vivo su aree grandi, animazioni ferme quando fuori schermo, prefers-reduced-motion rispettato.
- Fare sempre copie prima di sovrascrivere. Nel sito vero la copia è la storia di git: un commit per ogni passo chiaro.
- Non esportare MP4 se non richiesto.

## Cosa c'è nel pacchetto
- `prototipo/home.html` · **la verità visiva**. La home approvata col nuovo ritmo, file unico. Il sito vero deve essere identico a questo, pixel per pixel.
- `prototipo/manuale.html` · il manuale del marchio v39 (anche pubblicato: https://claude.ai/artifact/NY2gm7L3Pkwr3PxpDktNk4). Colori, tipografia, piani, linguaggio, componenti, le sei animazioni.
- `sorgenti/` · i pezzi da cui è montata la home. I file Python (`mkHero.py`, `mkH.py`, `mkF38.py`) usano percorsi assoluti del vecchio ambiente: servono come riferimento di **come** si montano i pezzi, non vanno rieseguiti.
  - `hero/h3.*` · 05.1 apertura al buio: frase che respira (Hanken variabile, peso dal cursore), bottone Start a project, finestra del film.
  - `hero/h3_s2.*` · Work: tre progetti.
  - `hero/h3_s3.html` + `glass.css/js` · What we build: scena vetro caldo, due card Systems e Brand.
  - `hero/h3_s5.*` + `micro6.js` · In motion: le sei animazioni in vetro freddo (`micro6.js` sono le animazioni pure, `h3_s5.js` le contiene già con il campo animato).
  - `hero/hdr.*` · la testata. `hero/flr.*` · la pulsantiera. `hero/cur.*` · il cursore.
  - `hero/bianco.css` · fondo bianco di default.
  - `home/home.tpl` · lo scheletro della home (testata, sezioni How we work e porta verso G, footer, l'ascensore tra i piani). Il blocco `/*LIFTJS*/` e `SITE` vengono da `manuale/manual.tpl`.
  - `manuale/` · sorgenti del manuale (`manual_v2r39.tpl` è l'ultimo).
  - `base/base.css` · token di colore per "luce" (`data-luce`), tipografia, griglia. `base/assets.json` · immagini e marchio (base64). `base/letter2.json` · i numeri dei piani nel lettering del marchio (SVG).
  - `film/` · il film del marchio (`mm.js`, `mmv.js`, `snd.js`, `logoparts.json`).
  - `fonts/` · Hanken Grotesk variabile (100-900), DM Mono 400 e 500, Gloock 400.

## Il sito: un palazzo
Ogni pagina è un piano. Si naviga con la pulsantiera (il menu) e si scende come in ascensore.

| Piano | Nome | Luce (fondo) | Cosa c'è |
|---|---|---|---|
| 05 | Home | notte, poi bianco | apertura al buio, poi le sezioni 05.2-05.5 |
| 04 | Work | notte | il registro dei progetti; ogni progetto è "04 · No. 014" con la sua pagina |
| 03 | Brand | bianco (carta) | il fuori: identità, siti e app, negozi online, art direction, grafica |
| 02 | Systems | grigio macchina | il dentro: software, gestionali, app in codice, CMS, automazioni, AI privata |
| 01 | Studio | rosa | chi siamo, metodo Survey, Build, Run |
| G | Contact | rosa | "Tell us what slows you down." Modulo ordine di lavoro. Primo incontro gratuito |
| LG | Machine Room | notte | il nostro back office (sistema No. 001), solo con la chiave |

**Systems è al 02 e Brand al 03 (deciso il 15 ottobre).** Scendere vuol dire entrare: il piano più vicino alla machine room è quello dei sistemi. Il lavoro che vogliamo vendere di più sono i sistemi.

## La home approvata, in ordine
- **05.1 Apertura** (notte): "The machine behind your business." su tre righe, Start a project, "Free first call.", film in finestra (muto, al clic tutto schermo con musica). Non si tocca.
- **05.2 What we build** (vetro caldo, il momento "mother"): titolo "One studio. The inside and the outside." Due card:
  - **Systems** · Floor 02 · "Inside · custom software" · *The tools your company runs on.*
    Custom software (Code · built to fit) / Back offices and CRM (Dashboards · clients · orders) / Apps and portals (iOS · Android · client areas) / CMS and catalogues (Content · products · stock) / Automations (Workflows · APIs · integrations). Riquadro "AI inside": We don't plug AI in. We build it in. Private AI that runs on your own machines.
  - **Brand** · Floor 03 · "Outside · identity" · *So the company looks as good as it runs.*
    Brand identity (Mark · system · guidelines) / Websites and apps (UI · UX · design systems) / Online shops (Storefronts · product pages) / Art direction (Look · tone · consistency) / Visual design (Layouts · print · graphics).
  - Queste voci sono ciò che lo studio fa davvero. Niente social, niente packaging, niente shooting o video, niente 3D. Animazioni solo semplici, in codice: non le vendiamo come servizio.
- **05.3 Work** (bianco): tre progetti (oggi concept: Birrificio Mare, Forno Nove, Lumen Lab), "See all work".
- **05.4 In motion** (vetro freddo): "Six things we build. Watch them work." Gruppo 03 Brand (Brand identity, Apps and websites, Ecommerce) poi gruppo 02 Systems (Management systems, Custom software, Automation). L'ordine resta così: leggero sopra, peso sotto, e scende come l'ascensore.
- **05.5 How we work** (bianco).
- **G** porta verso Contact (rosa).

## Regole di design
- **Pomodoro #FF5B3A** solo su ciò che si muove o risponde (punto che lampeggia, bottone chiamato, cursore che prende). Mai titoli, testo o fondi. La freccia della corsa nella testata è nera.
- Bianco #FBFAF7 fondo di default; carta #F4F2EC superficie calda; inchiostro #121211; grigio macchina #BEC2BF; notte #0F0F0E; rosa pelle #F2CDBE.
- Due linguaggi: "machine" squadrato, "mother" vetro e gradiente. Il vetro compare al massimo in due momenti per pagina, caldo e freddo, mai uno dopo l'altro.
- **Tecnica del vetro** (non cambiarla): un campo su una tela piccola (circa 160 px di larghezza) ridisegnata con `ctx.filter` blur; ogni scheda ha una sua tela `.gcopy`/`.vcopy` con la fetta sfocata del campo. Niente backdrop-filter dal vivo (portava a 35 fps). Campo di 05.4 a 30 fps, fermo fuori schermo (IntersectionObserver).
- Testata: numero del piano (solo il piano, mai "05.1"), nome, colonna di sei quadratini. Niente hamburger.
- Pulsantiera: vetro scuro, quattro viti, bottoni quadrati col numero, piano corrente retroilluminato, LG con la chiave ("Staff only", "Not without the key.", "Going down.", "You found it.").
- Cursore: quadrato pieno; sulla presa diventa cornice con luce pomodoro.

## Il piano di costruzione
**Stack:** Astro (output statico) su Cloudflare Pages. Repository GitHub `esoimage-dev/mother-machine`, Cloudflare pubblica a ogni push. Poi Workers + D1 + R2 + Access per modulo contatti e back office, tutto nel piano gratuito. Dominio mothermachine.studio comprato su GoDaddy (18 ottobre 2026: non ancora collegato); i nameserver andranno spostati su Cloudflare. Email: Cloudflare Email Routing verso Gmail in entrata; invio come hello@mothermachine.studio con Resend.

**Perché Astro:** non riscrive niente. CSS e JS del prototipo si spostano così come sono, divisi in componenti (`Header.astro`, `Floors.astro`, `Cursor.astro`, una sezione per file). Ogni piano diventa una pagina vera con il suo indirizzo (Google, link condivisibili). Font e immagini diventano file in cache, non base64. Il film si carica solo quando serve.

**Passi:**
1. Scheletro Astro, font in `public/fonts`, `base.css` come CSS globale, `data-luce` sul body di ogni pagina.
2. Header, pulsantiera, cursore come componenti persistenti tra le pagine.
3. Home sezione per sezione, confrontando sempre con `prototipo/home.html` (screenshot affiancati a 1440, 1100 e 390 px).
4. L'ascensore tra i piani con le View Transitions di Astro: la testata resta ferma, il contatore gira, la corsa è quella del prototipo. È il punto più delicato: confrontarlo col prototipo finché è identico.
5. Pagine segnaposto per 04, 03, 02, 01, G, LG con la luce giusta, poi disegnarle una alla volta (prima Work e la pagina progetto).
6. Contact: modulo con Worker e Resend.
7. Privacy policy, ABN nel footer, meta e testi per Google, Open Graph.

## Cosa manca ancora
- Pagine interne: Work e pagina progetto, Systems, Brand, Studio, Contact.
- Progetti reali (oggi concept) o dichiararli come studi.
- Privacy policy, ABN, testi SEO.
- Machine Room: un gestionale vero, progetto a parte.
- Etichette in alto delle card ("Inside · custom software", "Outside · identity"): da rivedere se serve.
