# Monta le pagine del sito (src/html) dalle pagine approvate (prototipo/). Le pagine approvate non si toccano:
# ogni volta si riparte da loro e si applicano sempre le stesse modifiche, in quest'ordine.
#
#   python3 scripts/monta-pagine.py
#
# Cosa fa:
#  1. font base64 -> public/fonts/*.woff2; dati condivisi (AS = marchio, LG = film) -> public/js/*.js
#  2. testata: nasce gia' con la luce della prima sezione (prima nasceva "carta" e per un attimo era chiara)
#  3. testa della pagina: script d'avvio (mm-boot, arrivo con l'ascensore) e foglio public/css/mm-sito.css
#  4. ascensore: i piani veri portano alle pagine vere; precarica la destinazione, arriva a porte chiuse
#  5. lingua: suggerimento nella testata ("Italiano?"), scelta ricordata tra le pagine
#  6. fondo pagina: public/js/mm-sito.js
# Le regole visive stanno in public/css/mm-sito.css, i comportamenti in public/js/mm-sito.js.
import base64, hashlib, json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROTO = ROOT / 'prototipo'
OUT = ROOT / 'src/html'
FONTS = ROOT / 'public/fonts'
JS = ROOT / 'public/js'

PAGINE = {  # pagina del sito <- pagina approvata
    'home': 'home', 'studio': 'studio', 'systems': 'systems', 'brand': 'brand',
    'contact': 'contact', 'progetto': 'progetto', 'privacy': 'privacy-termini',
    'work': 'progetto',  # 04 Work: nasce dalla pagina progetto (stesso piano), con il registro al posto del caso
    'lg': 'progetto',    # LG Machine Room: stessa luce notte, il laboratorio al posto del caso
    'room': 'contact',   # LG, dietro la chiave: il back office (scena 5 del prototipo di Contact)
}
INDIRIZZI = "{5:'/',4:'/work',3:'/brand',2:'/systems',1:'/studio',0:'/contact','-1':'/lg'}"


SITO = 'https://mothermachine.studio'
# meta per Google e anteprime dei link: titolo e descrizione presi dai testi approvati di ogni pagina
META = {
    'home': ('/', 'Mother Machine · The machine behind your business.',
             "A design and engineering studio. We design and build the software companies run on, and the brands they're known by.", '#0F0F0E'),
    'systems': ('/systems', 'Mother Machine · Systems',
                'Back offices, apps and automations, built around how your team actually works. Not a template bent into shape.', '#BEC2BF'),
    'brand': ('/brand', 'Mother Machine · Brand',
              'Identity, websites and interfaces that hold together, from the logo to the last button.', '#0F0F0E'),
    'studio': ('/studio', 'Mother Machine · Studio',
               'A small studio. On purpose. The people who design your system are the people who build it.', '#EEC3B1'),
    'contact': ('/contact', 'Mother Machine · Contact',
                'Tell us what slows you down. The first conversation is free, and a real person reads every order.', '#EEC3B1'),
    'progetto': ('/work/project', "Mother Machine · Vitalia's Pizza on Wheels",
                 'A new business, built from zero: the brand, the website and the system that runs it.', '#0F0F0E'),
    'work': ('/work', 'Mother Machine · Work',
             'The register: every machine we deliver gets a serial number. Who it was for, what we built, what changed.', '#0F0F0E'),
    'lg': ('/lg', 'Mother Machine · Machine Room',
           'LG, the lab under the studio. Every floor above runs on what we build down here.', '#0F0F0E'),
    'room': ('/lg/room', 'Mother Machine · Machine Room', 'Staff only.', '#0F0F0E'),
    'privacy': ('/privacy', 'Mother Machine · Privacy and terms',
                'We collect only what we need to answer you and run a project with you. No ads, no tracking cookies, no selling data.', '#FBFAF7'),
}


def testa_meta(nome):
    import html
    url, titolo, desc, colore = META[nome]
    e = lambda s: html.escape(s, quote=True)
    img = f'{SITO}/og/{nome}.png'
    robots = '<meta name="robots" content="noindex,nofollow">' if nome == 'room' else ''
    return robots + (f'<title>{e(titolo)}</title>'
            f'<meta name="description" content="{e(desc)}">'
            f'<link rel="canonical" href="{SITO}{url}">'
            f'<meta name="theme-color" content="{colore}">'
            '<link rel="icon" href="/favicon.svg" type="image/svg+xml">'
            '<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">'
            '<link rel="apple-touch-icon" href="/apple-touch-icon.png">'
            '<meta property="og:type" content="website"><meta property="og:site_name" content="Mother Machine">'
            f'<meta property="og:title" content="{e(titolo)}"><meta property="og:description" content="{e(desc)}">'
            f'<meta property="og:url" content="{SITO}{url}"><meta property="og:image" content="{img}">'
            '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
            f'<meta property="og:image:alt" content="{e(titolo)}"><meta property="og:locale" content="en_US">'
            '<meta name="twitter:card" content="summary_large_image">'
            f'<meta name="twitter:title" content="{e(titolo)}"><meta name="twitter:description" content="{e(desc)}">'
            f'<meta name="twitter:image" content="{img}">')


CORRENTE = {'home': '05 Home', 'work': '04 Work', 'progetto': '04 Work', 'brand': '03 Brand', 'systems': '02 Systems',
            'studio': '01 Studio', 'contact': 'G Contact'}

VITALIA_HOME = (
    '<a class="wc" href="/work/project" data-go="4" data-dest="/work/project">'
    '<div class="wv" style="--c:#C8462D"><div class="wph"><b>Vitalia\'s</b><span class="mo">Cover · the truck at an event</span></div>'
    '<span class="wcta mo"><i></i>View project</span></div>'
    '<div class="wm mo"><span>No. 012</span><span>Brand · Systems</span></div>'
    '<h3>Vitalia\'s Pizza on Wheels</h3>'
    '<p>A new business, built from zero: the brand, the website and the system that runs it.</p>'
    '<div class="wn"><b data-v="12" data-s=" h">12 h</b><span>a week nobody spends on the phone or in DMs</span></div></a>')


# il footer e' la placca dell'ascensore montata sul muro: una targa scura con quattro viti, lo stesso linguaggio della
# pulsantiera. Dentro: il marchio con la frase dello studio; i sei piani come bottoni in una griglia 3 per 2 (acceso il
# piano dove sei); sotto, separata, la riga di LG con il cilindro della chiave; in fondo lingue (le mette lo script delle
# lingue prima di span.mut), Privacy e Terms, copyright. Il marchio ha il carroponte.
PIANI = [('05', 'Home', 'href="#top"'), ('04', 'Work', 'href="#" data-go="4"'), ('03', 'Brand', 'href="#" data-go="3"'),
         ('02', 'Systems', 'href="#" data-go="2"'), ('01', 'Studio', 'href="#" data-go="1"'), ('G', 'Contact', 'href="#" data-go="0"')]


_MARCHIO = None


def marchio_mobile():
    """Il marchio con il carroponte (il piano inferiore della m e' un pezzo a parte, .car): sta nei dati del manuale."""
    global _MARCHIO
    if _MARCHIO is None:
        m = (PROTO / 'manuale.html').read_text(encoding='utf8')
        AS, _ = json.JSONDecoder().raw_decode(m, m.find('var AS=') + len('var AS='))
        assert 'class="car ' in AS['hero'], 'marchio con carroponte'
        _MARCHIO = AS['hero']
    return _MARCHIO


def footer(nome):
    voce = CORRENTE.get(nome, '')
    tasti = ''.join(
        f'<li><a {attr} aria-label="Floor {lab}, {nm}"{" aria-current=\"page\"" if voce == f"{lab} {nm}" else ""}>'
        f'<span class="fsq">{lab}</span><span class="fnm">{nm}</span></a></li>' for lab, nm, attr in PIANI)
    priv = ' aria-current="page"' if nome == 'privacy' else ''
    lg = nome in ('lg', 'room')
    viti = ''.join(f'<i class="rv" style="{p}"></i>' for p in ('left:14px;top:14px', 'right:14px;top:14px', 'left:14px;bottom:14px', 'right:14px;bottom:14px'))
    # LG come nella pulsantiera: la chiave girata sblocca LG ("Going down."), senza chiave "Not without the key."
    chiave = (f'<div class="fkey{" open" if lg else ""}">'
              f'<button class="flgb" type="button" data-k="-1" aria-label="Floor LG, Machine room{"" if lg else ", locked"}"{" aria-current=\"page\"" if lg else ""}>'
              '<span class="fsq">LG</span><span class="fnm">Machine room</span></button>'
              f'<span class="fko" aria-live="polite">{"You found it." if lg else "Staff only"}</span>'
              f'<button class="fcylb" type="button" aria-label="Key: unlock the machine room" aria-pressed="{"true" if lg else "false"}">'
              '<i class="fcyl" aria-hidden="true"><b></b></i><span class="fnm">Key</span></button></div>')
    return ('<footer class="ftr" data-luce="carta"><div class="in">'
            f'<div class="fplate" data-luce="notte">{viti}'
            f'<div class="fbrand"><div class="lg flogo">{marchio_mobile()}</div><p class="ftag mo">A design and engineering studio</p></div>'
            f'<nav class="fdir mo" aria-label="Floors"><ol>{tasti}</ol>{chiave}</nav>'
            '<div class="row mo fbar"><span class="mut fcopy">© 2026 Mother Machine</span>'
            f'<span class="fleg"><a href="/privacy"{priv}>Privacy</a><a href="/privacy#terms">Terms</a></span></div>'
            '</div></div></footer>')


def ritocchi(nome, t):
    """Modifiche decise con Eso sopra le pagine approvate (19 ottobre 2026)."""
    # footer: l'elenco del palazzo (ridisegnato il 19 ottobre), generato qui per ogni pagina
    s = t.find('<footer class="ftr"'); e = t.find('</footer>', s) + len('</footer>')
    assert s > 0 and e > s and '<nav aria-label="Floors">' in t[s:e], 'footer'
    t = t[:s] + footer(nome) + t[e:]

    if nome == 'home':
        # i lavori in home: Vitalia's (vero) al posto di Lumen Lab; i concept si chiamano Study come nel registro
        s = t.find('<a class="wc" href="#" data-go="4">', t.find('Forno Nove'))
        e = t.find('</a>', t.find('Lumen Lab', s)) + len('</a>')
        assert 'Lumen Lab' in t[s:e] and 'Forno Nove' not in t[s:e], 'scheda Lumen Lab'
        t = t[:s] + t[e:]
        s = t.find('<div class="wkg">') + len('<div class="wkg">')
        t = t[:s] + '\n      ' + VITALIA_HOME + t[s:]
        t = una(t, '<div class="wm mo"><span>No. 014</span><span>Systems</span></div>', '<div class="wm mo"><span>Study 03</span><span>Systems</span></div>', 'Study 03')
        t = una(t, '<div class="wm mo"><span>No. 011</span><span>Brand</span></div>', '<div class="wm mo"><span>Study 02</span><span>Brand</span></div>', 'Study 02')
        t = una(t, '<span class="mo mut">Concepts · example figures</span>', '<span class="mo mut">Studies use example figures</span>', 'nota lavori')
        t = una(t, '<span class="mo mut">14 projects in the register</span>', '<span class="mo mut">The full register</span>', 'conteggio')
        # 05.1 su telefono: la copertina del film sotto il bottone (fuori dalla griglia che misura il titolo)
        t = una(t, '<div class="h3fly" id="h3fly" aria-hidden="true"></div>',
                '<button class="h3pf" id="h3pf" type="button" aria-label="Watch the film, with sound">'
                '<span class="h3pfv"><span class="h3pfl" data-a="heroS"></span><span class="grain"></span></span>'
                '<span class="h3pfb mo"><i class="pl"></i>Watch the film<em>0:38</em></span></button>'
                '<div class="h3fly" id="h3fly" aria-hidden="true"></div>', 'copertina film')
        # 05.1 piu' asciutta (audit del 19 ottobre): solo il titolo, Start a project e il film.
        # Via l'etichetta "A design and engineering studio" (resta nei meta per Google), la frase sotto e "Free first call.".
        # L'indicatore del peso resta, a sinistra. Il bottone entra nel blocco del titolo: su desktop sotto la finestra
        # del film, col bordo basso sulla linea di "business."; su telefono subito sotto il titolo. Porta dritto a Contact.
        t = una(t, '<span class="h3pos">A design and engineering studio</span>', '', 'etichetta apertura')
        s = t.find('      <div class="h3b">'); e = t.find('</div>', t.find('id="h3wf"')) + len('</div>')
        e = t.find('</div>', e) + len('</div>')
        assert s > 0 and 'class="lead"' in t[s:e] and t[s:e].count('<div') == t[s:e].count('</div>'), 'blocco sotto il titolo'
        cta = t[t.find('<a class="h3cta"', s):t.find('</a>', s) + len('</a>')]
        t = t[:s].rstrip() + '\n' + t[e:].lstrip('\n')
        cta2 = cta.replace('href="#g"', 'href="/contact" data-go="0"')
        assert cta2 != cta, 'bottone verso Contact'
        t = una(t, '</figure>\n      </div>', '</figure>\n        <div class="h3go" id="h3go">' + cta2 + '</div>\n      </div>', 'bottone nel titolo')
        # il titolo si misura senza la riga di sotto; la finestra del film e il bottone si allineano alla frase
        t = una(t, "-g.children[0].offsetHeight-g.children[2].offsetHeight-2*parseFloat(cs.rowGap||cs.gap||24);",
                "-g.children[0].offsetHeight-parseFloat(cs.rowGap||cs.gap||24);", 'misura titolo')
        t = una(t, "function placeTile(){if(!tileOn())return;var l1=h.children[0];fig.style.top=(l1.getBoundingClientRect().top-mid.getBoundingClientRect().top+fs*.12).toFixed(1)+'px'}",
                "function placeTile(){var go=$('h3go');if(!tileOn()){go.style.top='';return}var l1=h.children[0],mt=mid.getBoundingClientRect().top;fig.style.top=(l1.getBoundingClientRect().top-mt+fs*.12).toFixed(1)+'px';"
                "go.style.top=(h.lastChild.querySelector('.bm').getBoundingClientRect().top-mt-go.offsetHeight).toFixed(1)+'px'}", 'posto del bottone')
        # la riga si misura dove finiscono le lettere (il segno .bm), non con scrollWidth, che dava la larghezza del
        # contenitore: il titolo veniva il 15% piu' piccolo dello spazio che ha
        t = una(t, "var mw=0;[].forEach.call(h.children,function(d){mw=Math.max(mw,d.scrollWidth)});",
                "var mw=0,x0=h.getBoundingClientRect().left;[].forEach.call(h.children,function(d){mw=Math.max(mw,d.querySelector('.bm').getBoundingClientRect().left-x0)});", 'misura riga')
        # su telefono il film si apre dalla copertina (il link piccolo "Watch the film" non c'e' piu')
        t = una(t, "$('h3wf').addEventListener('click',openF);", "$('h3pf').addEventListener('click',openF);", 'film da copertina')
        # 05.1 su telefono: il titolo si misura a peso medio (non al 900), cosi' riempie la larghezza
        t = una(t, "make();h.style.fontSize='100px';CH.forEach(function(c){c.el.style.fontWeight=tileOn()?560:HI});",
                "make();h.style.fontSize='100px';CH.forEach(function(c){c.el.style.fontWeight=tileOn()?560:(innerWidth<700?600:HI)});", 'peso titolo')
        # 05.2 su telefono: i due tasti
        t = una(t, '<div class="mcards">',
                '<div class="mtabs" role="tablist" aria-label="What we build">'
                '<button type="button" role="tab" aria-selected="true"><span class="sq">02</span>Systems</button>'
                '<button type="button" role="tab" aria-selected="false"><span class="sq">03</span>Brand</button></div>'
                '<div class="mcards">', 'tasti 05.2')

    if nome == 'room':
        # il back office: dalla pagina approvata di Contact resta solo la scena 5, accesa, al piano LG
        s = t.find('<nav class="scenes mo"'); e = t.find('</nav>', s) + len('</nav>')
        assert s > 0 and 'Percorso' in t[s:e], 'barra percorso'
        t = t[:s] + t[e:]
        s = t.find('<!-- 1 · CONTACT -->'); e = t.find('<!-- 5 · MACHINE ROOM -->', s)
        assert s > 0 and e > s, 'scene 1-4'
        t = t[:s] + t[e:]
        t = una(t, '<section class="hs view mr" data-v="mr" data-luce="notte">',
                '<section class="hs view mr on" data-v="mr" data-luce="notte" data-f="LG" data-n="Machine Room">', 'scena 5')
        s = t.find('  /* scene */'); e = t.find('  /* la lingua della call', s)
        assert s > 0 and e > s and '/* 5 · machine room */' in t[s:e], 'script delle scene'
        t = t[:s] + (ROOT / 'src/sezioni/room.js').read_text(encoding='utf8') + t[e:]
        t = una(t, "fl=0,nm='Contact'", "fl=-1,nm='Machine Room'", 'testata: piano')
        t = una(t, 'aria-label="Floors: you are on G, Contact', 'aria-label="Floors: you are on LG, Machine Room', 'testata: aria')
        t = una(t, '<b>G</b></span></span><span class="rl nm" id="bL"><b>Contact</b>',
                '<b>LG</b></span></span><span class="rl nm" id="bL"><b>Machine Room</b>', 'testata: numero')
        t = una(t, 'onFloor=0', 'onFloor=-1', 'piano corrente')
        t = una(t, "nav.cur(0,'G','Contact')", "nav.cur(-1,'LG','Machine Room')", 'pulsantiera')
        assert t.count('if(k===0') == 3, 'k===0'
        t = t.replace('if(k===0', 'if(k===-1')

    if nome == 'contact':
        # nel sito c'e' solo il modulo. La barra "Percorso" e le scene 2-5 (mail, conferma, call, Machine Room) restano
        # in prototipo/contact.html: sono il progetto di quello che costruiamo dopo (docs/percorso-contatto.md).
        s = t.find('<nav class="scenes mo"'); e = t.find('</nav>', s) + len('</nav>')
        assert s > 0 and 'Percorso' in t[s:e], 'barra percorso'
        t = t[:s] + t[e:]
        s = t.find('<!-- 2 · LE MAIL -->'); e = t.find('</main>', s)
        assert s > 0 and '<!-- 5 · MACHINE ROOM -->' in t[s:e], 'scene 2-5'
        t = t[:s] + t[e:]
        s = t.find('<button type="button" class="go goinbox">'); e = t.find('</button>', s) + len('</button>')
        assert s > 0 and 'Open the email' in t[s:e], 'bottone bozza'
        t = t[:s] + t[e:]
        # e i loro script: la scena delle mail, la conferma, la call e la Machine Room (resta la lingua della call, che usa il modulo)
        t = una(t, "  f.querySelector('.goinbox').addEventListener('click',function(){go('inbox')});\n", '', 'script bottone bozza')
        s = t.find('  /* 2 · le mail */'); e = t.find('  /* la lingua della call', s)
        assert s > 0 and e > s and '/* 5 · machine room */' in t[s:e], 'script scene 2-5'
        t = t[:s] + t[e:]

    if nome == 'brand':
        # via la prima sezione (titolo e vetrina): l'apertura diventa la leva "Assembled / Taken apart"
        s = t.find('<section class="hs bro"'); e = t.find('</section>', s) + len('</section>')
        assert s > 0, 'sezione bro'
        t = t[:s] + t[e:]
        s = t.find('  /* 1 · tre marchi, un solo componente */'); e = t.find('  /* 2 · la leva smonta lo schermo */')
        assert 0 < s < e, 'script vetrina'
        t = t[:s] + t[e:]
        t = una(t, '<section class="hs brx" data-luce="notte" data-f="03.1" data-n="The system" id="b2">',
                '<section class="hs brx brhero" data-luce="notte" data-f="03" data-n="Brand" id="b2">', 'apertura brand')
        t = una(t, '<div class="brh2"><span class="mo mut">The system underneath</span><h2>Every brand is a machine too. <span>Pull the lever.</span></h2></div>',
                '<div class="brh2"><span class="mo mut">03 · Brand · Outside</span><h1>Every brand is a machine too. <span>Pull the lever.</span></h1>'
                '<p class="brlede">Identity, websites and interfaces that hold together, from the logo to the last button.</p></div>', 'titolo brand')
    return t


def una(t, old, new, cosa):
    n = t.count(old)
    assert n == 1, f'{cosa}: trovato {n} volte'
    return t.replace(old, new)


# ---------- 1. asset ----------
seen = {}

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def font_esterni(t):
    face = re.compile(r'@font-face\s*\{[^}]*\}')
    data = re.compile(r'url\(\s*["\']?data:font/woff2[^,]*;base64,([A-Za-z0-9+/=]+)["\']?\s*\)')
    def fix(m):
        block = m.group(0); d = data.search(block)
        if not d:
            return block
        raw = base64.b64decode(d.group(1)); h = hashlib.sha1(raw).hexdigest()[:8]
        if h not in seen:  # stesso file sotto due nomi di famiglia: un solo .woff2
            f = re.search(r'font-family\s*:\s*["\']?([^;"\'}]+)', block)
            w = re.search(r'font-weight\s*:\s*([^;}]+)', block)
            name = slug(f.group(1) if f else 'font') + ('-' + slug(w.group(1)) if w else '')
            seen[h] = FONTS / f'{name}-{h}.woff2'; seen[h].write_bytes(raw)
        return block[:d.start()] + f'url(/fonts/{seen[h].name})' + block[d.end():]
    return face.sub(fix, t)

def dati_esterni(t):
    def fix(m):
        body, key = m.group(1), m.group(2)
        out = JS / f'{key.lower()}-{hashlib.sha1(body.encode()).hexdigest()[:8]}.js'
        out.write_text(body, encoding='utf8')
        return f'<script src="/js/{out.name}"></script>'
    return re.sub(r'<script>(var (AS|LG)=.*?)</script>', fix, t, flags=re.S)


def testata_fissa(t):
    """La testata e' identica dal primo disegno, su ogni pagina: niente da aspettare, niente da scambiare.
    Il logo e' scritto nella pagina (prima lo inseriva uno script in fondo, e per un attimo la testata era vuota) e resta
    sempre disegno: tolto il passaggio al carattere del logo, che arrivava quando voleva. I caratteri del testo si
    caricano subito (preload)."""
    i = t.find('var AS=')
    AS, _ = json.JSONDecoder().raw_decode(t, i + len('var AS='))
    t = una(t, '<span class="lgB" data-a="heroS">', '<span class="lgB">' + AS['heroS'], 'logo grande')
    t = una(t, '<span class="lgS" data-a="heroW">', '<span class="lgS">' + AS['heroW'], 'logo piccolo')
    s = t.find("if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load('20px MMLogoS'")
    fine = "document.documentElement.classList.add('mmfont')}).catch(function(){})}"
    e = t.find(fine, s) + len(fine)
    assert s > 0 and e > s, 'carattere del logo'
    t = t[:s] + t[e:]
    voci = sorted(set(re.findall(r"url\((/fonts/(?:dmmono-400|dmmono-500|hanken)[^)'\"]*\.woff2)\)", t)))
    assert len(voci) >= 2, 'caratteri'
    pre = ''.join(f'<link rel="preload" href="{v}" as="font" type="font/woff2" crossorigin>' for v in voci)
    i = t.find('<style'); t = t[:i] + pre + t[i:]
    return t


# ---------- 3. testa ----------
AVVIO = ("<script>/* avvio: niente transizioni finche' la pagina non e' pronta; se arriviamo con l'ascensore, porte chiuse */"
         "(function(){var R=document.documentElement;R.classList.add('mm-boot');"
         "try{var a=sessionStorage.getItem('mm-arrive'),p=location.pathname.replace(/\\.html$/,'').replace(/\\/$/,'')||'/';"
         "sessionStorage.removeItem('mm-arrive');if(a){a=JSON.parse(a);if(a.to===p){R.classList.add('mm-arr','mm-hide');if(a.fold)R.classList.add('mm-arr-fold')}}}catch(e){}"
         # passaggio tra le pagine (View Transitions): resta l'ultimo fotogramma della pagina di prima finche' questa non e'
         # pronta con i suoi caratteri, poi si scambiano nello stesso istante. MM_READY dice alle porte quando possono aprirsi.
         "var res;window.MM_READY=new Promise(function(r){res=r});"
         "function fonts(){var F=document.fonts;if(!F||!F.load)return Promise.resolve();"
         "return Promise.all(['400 15px DMMono','500 15px DMMono','400 20px Hanken','650 20px Hanken'].map(function(f){return F.load(f).catch(function(){})}))}"
         "if('onpagereveal' in window)addEventListener('pagereveal',function(e){var vt=e.viewTransition,done=0;"
         "function go(){if(done)return;done=1;requestAnimationFrame(function(){requestAnimationFrame(function(){if(vt)try{vt.skipTransition()}catch(x){}res()})})}"
         "if(!vt){res();return}fonts().then(go,go);setTimeout(go,900)});else res()"
         "})();</script>")
FOGLIO = '<link rel="stylesheet" href="/css/mm-sito.css">'
CODA = '<script src="/js/mm-sito.js"></script><script src="/js/mm-chiave.js"></script>'
# subito dopo la testata: se arriviamo con l'ascensore la testata nasce gia' "in corsa" (chiara sulle porte, senza fascia)
# e, se la pagina di prima aveva il logo piccolo, nasce piegata. Cosi' vale dal primo disegno.
DOPO_TESTATA = ("<script>(function(){var R=document.documentElement,b=document.getElementById('bar');"
                "if(R.classList.contains('mm-arr')){b.classList.add('riding');if(R.classList.contains('mm-arr-fold'))b.classList.add('fold')}})();</script>")

# ---------- 4. ascensore ----------
ASCENSORE = ("var MM_PAGES=" + INDIRIZZI + ";"
             "var MM_LEAVE=function(k){if(!MM_PAGES[k])return false;var to=window.MM_DEST||MM_PAGES[k];window.MM_DEST=null;"
             "try{sessionStorage.setItem('mm-arrive',JSON.stringify({to:to,fold:bar.classList.contains('fold')}))}catch(e){}"
             "location.href=to;return true};"
             "var MM_PRE=function(k){if(!MM_PAGES[k]||document.querySelector('link[data-mm=\"'+k+'\"]'))return;"
             "var l=document.createElement('link');l.rel='prefetch';l.href=MM_PAGES[k];l.setAttribute('data-mm',k);document.head.appendChild(l)};")

# ---------- 5. lingua ----------
LINGUA = r"""  /* il suggerimento della lingua vive nella testata: "Italiano?", "Español?", "Français?".
     Solo se il browser parla una lingua del lancio diversa dall'inglese e non c'e' gia' una scelta.
     La prima volta nella visita lampeggia; nelle pagine dopo e' gia' li', fermo. Dura 3 minuti di visita.
     La scelta salvata vince su tutto e si riapplica subito, senza animazioni. */
  var saved=null;try{saved=localStorage.getItem('mm-lang')}catch(e){}
  if(saved&&ORDER.indexOf(saved)>=0&&saved!==cur){var rm0=RM;RM=true;try{apply(saved)}catch(e){}RM=rm0}
  var want=saved?null:(navigator.languages||[navigator.language||'']).map(function(x){return (x||'').slice(0,2)}).filter(function(x){return ORDER.indexOf(x)>0&&x!==cur})[0];
  var hb=document.getElementById('dispB'),first=true;try{first=sessionStorage.getItem('mm-lhint')!=='1'}catch(e){}
  var sg=null;
  function hideSug(){if(!sg||sg.hidden)return;sg.classList.add('out');setTimeout(function(){sg.hidden=true;sg.classList.remove('out','in')},RM?0:260)}
  if(want&&hb){
    sg=document.createElement('button');sg.type='button';sg.className='lhint';sg.lang=want;sg.hidden=true;
    sg.setAttribute('aria-label',L[want].sug+' '+L[want].sw);sg.title=L[want].sw;
    sg.innerHTML='<i aria-hidden="true"></i><span aria-hidden="true"></span>';
    hb.parentNode.insertBefore(sg,hb);
    sg.addEventListener('click',function(){apply(want)});
    var word=L[want].self+'?',T=180000,t0=Date.now();try{t0=+sessionStorage.getItem('mm-lhint-t0')||t0}catch(e){}
    setTimeout(function(){if(cur===want)return;var left=T-(Date.now()-t0);if(left<=0)return;
      try{sessionStorage.setItem('mm-lhint','1');sessionStorage.setItem('mm-lhint-t0',String(t0))}catch(e){}
      setTimeout(hideSug,left);sg.hidden=false;if(!first)sg.classList.add('calm');void sg.offsetWidth;sg.classList.add('in');
      var sp=sg.querySelector('span');if(first)scramble(sp,word,0);else sp.textContent=word},RM?300:(first?2200:500))}
"""


def registro():
    """Il contenuto di 04 Work (src/sezioni/work.html) con le copertine degli studi prese identiche dalla home."""
    t = (ROOT / 'src/sezioni/work.html').read_text(encoding='utf8')
    home = (PROTO / 'home.html').read_text(encoding='utf8')
    g = home[home.find('<div class="wkg">') + len('<div class="wkg">'):home.find('<a class="wall"')]
    schede = re.findall(r'<a class="wc" href="#" data-go="4">(.*?)</a>', g, re.S)
    assert len(schede) == 3, 'copertine della home'
    studi = [('a1', 'hospitality', 'No. 014', 'Study 03'), ('a2', 'retail', 'No. 011', 'Study 02'), ('a3', 'services', 'No. 009', 'Study 01')]
    out = []
    for corpo, (cov, settore, vecchio, nuovo) in zip(schede, studi):
        assert f'class="art {cov}"' in corpo and vecchio in corpo, cov
        corpo = corpo.replace('<span class="wcta mo"><i></i>View project</span>', '').replace(f'<span>{vecchio}</span>', f'<span>{nuovo}</span>')
        out.append(f'<div class="wc" data-s="{settore}" data-cov="{cov}">{corpo}</div>')
    t = una(t, '<!-- MM:COPERTINE-STUDI -->', '\n      '.join(out), 'segnaposto copertine')
    # la porta per G: la stessa della home, testo approvato
    s = home.find('<section class="hs gd"'); e = home.find('</section>', s) + len('</section>')
    t = una(t, '<!-- MM:PORTA-G -->', home[s:e], 'porta G')
    # la targhetta si conta dalle righe del registro: niente numeri da aggiornare a mano
    reg = t[t.find('<ol class="wkl">'):t.find('</ol>', t.find('<ol class="wkl">'))]
    serie = sorted(int(n) for n in re.findall(r'<span class="wk-no mo">No\. (\d+)</span>', reg))
    t = una(t, '<!-- MM:SERIE -->', f'No. {serie[0]:03d} · {serie[-1]:03d}', 'serie')
    t = una(t, '<!-- MM:RUNNING -->', str(reg.count('wk-sg wk-run')), 'running')
    t = una(t, '<!-- MM:BUILD -->', str(reg.count('wk-sg wk-bld')), 'in build')
    t = una(t, '<!-- MM:STUDIES -->', str(reg.count('wk-sg wk-std')), 'studi')
    return t


def laboratorio():
    """Il contenuto di LG (src/sezioni/lg.html) con la porta per G presa identica dalla home."""
    t = (ROOT / 'src/sezioni/lg.html').read_text(encoding='utf8')
    home = (PROTO / 'home.html').read_text(encoding='utf8')
    s = home.find('<section class="hs gd"'); e = home.find('</section>', s) + len('</section>')
    return una(t, '<!-- MM:PORTA-G -->', home[s:e], 'porta G')


def monta(nome, src):
    t = (PROTO / f'{src}.html').read_text(encoding='utf8')
    t = font_esterni(t)
    t = testata_fissa(t)
    t = dati_esterni(t)
    t = ritocchi(nome, t)

    # 2. la testata nasce con la luce della prima sezione
    prima = re.search(r'<section[^>]*\bdata-f\b[^>]*>', t)
    luce = re.search(r'data-luce="([^"]+)"', prima.group(0)).group(1)
    t = una(t, '<header class="bar" id="bar" data-luce="carta">', f'<header class="bar" id="bar" data-luce="{luce}">', 'testata')

    i = t.find('</header>', t.find('id="bar"')) + len('</header>'); t = t[:i] + DOPO_TESTATA + t[i:]

    # meta per Google e anteprime dei link (al posto del titolo della pagina approvata)
    t, n = re.subn(r'<title>[^<]*</title>', lambda m: testa_meta(nome), t, count=1)
    assert n == 1, 'titolo'
    # lingua della pagina (le pagine approvate non hanno ne' doctype ne' <html>: aggiungere il doctype cambierebbe la resa)
    t = '<html lang="en">' + t

    # 3. testa: avvio prima dello stile della pagina, foglio del sito subito dopo
    i = t.find('<style'); t = t[:i] + AVVIO + t[i:]
    i = t.find('</style>') + len('</style>'); t = t[:i] + FOGLIO + t[i:]

    # 4. ascensore
    t = una(t, "var ride=$('ride');", ASCENSORE + "var ride=$('ride');", 'ride')
    t = una(t, "await S.close(false);", "await (window.MM_DOORS?MM_DOORS.close(S.close(false)):S.close(false));", 'chiusura porte')
    t = una(t, "await S.open();S.busy=false;return true};",
            "if(window.MM_LEAVE&&MM_LEAVE(to))return new Promise(function(){});await (window.MM_DOORS?MM_DOORS.open(S.open()):S.open());S.busy=false;return true};", 'apertura porte')
    t = una(t, "function go(k){if(SH.busy||k===onFloor)return;", "function go(k){if(SH.busy||k===onFloor)return;MM_PRE(k);document.documentElement.classList.add('mm-riding');", 'go')
    t = una(t, "}).then(function(){onFloor=k;", "}).then(function(){if(MM_PAGES[k]){location.href=window.MM_DEST||MM_PAGES[k];return}document.documentElement.classList.remove('mm-riding');onFloor=k;", 'fine corsa')
    t, n = re.subn(r"(\n  if\(k===-?\d+)\)\{pg\.innerHTML='';return\}", r"\1||MM_PAGES[k]){pg.innerHTML='';return}", t)
    assert n == 1, 'segnaposto'

    # la testata non si ricalcola finche' l'ascensore che arriva non apre le porte (logo ancora piccolo)
    t = una(t, "function mini(){", "function mini(){if(document.documentElement.classList.contains('mm-arr-fold'))return;", 'mini')

    # 5. lingua (non tutte le pagine hanno il cartellino)
    s = t.find("  /* il cartellino:")
    if s >= 0:
        e = t.find("RM?600:2200);", s) + len("RM?600:2200);")
        t = t[:s] + LINGUA + t[e:]
        t = una(t, "function apply(c){var from=L[cur],t=L[c];cur=c;",
                "function apply(c){var from=L[cur],t=L[c];cur=c;try{localStorage.setItem('mm-lang',c)}catch(e){}", 'scelta lingua')

    # 04 Work: il registro al posto del caso, piu' il suo stile e il suo script
    if nome == 'work':
        s = t.find('<main class="hm cs" id="top">'); e = t.find('</main>', s) + len('</main>')
        assert s > 0 and e > s, 'main'
        t = t[:s] + registro() + t[e:]
        t = una(t, FOGLIO, FOGLIO + '<link rel="stylesheet" href="/css/work.css">', 'stile work')
        # lo script della demo Control Room (e dei numeri del caso) serve solo alla pagina progetto
        s = t.find('/* pagina progetto v3: il Control Room in miniatura')
        e = t.find('\n})();', t.find(".cfn b[data-n]", s)) + len('\n})();')
        assert s > 0 and e > s, 'script del caso'
        t = t[:s] + t[e:]

    # LG Machine Room: il laboratorio al posto del caso; la pagina sta al piano LG (testata, pulsantiera, corsa)
    if nome == 'lg':
        s = t.find('<main class="hm cs" id="top">'); e = t.find('</main>', s) + len('</main>')
        assert s > 0 and e > s, 'main'
        t = t[:s] + laboratorio() + t[e:]
        t = una(t, FOGLIO, FOGLIO + '<link rel="stylesheet" href="/css/mr.css">', 'stile lg')
        s = t.find('/* pagina progetto v3: il Control Room in miniatura')
        e = t.find('\n})();', t.find(".cfn b[data-n]", s)) + len('\n})();')
        assert s > 0 and e > s, 'script del caso'
        t = t[:s] + t[e:]
        t = una(t, "fl=4,nm='Work'", "fl=-1,nm='Machine Room'", 'testata: piano')
        t = una(t, 'aria-label="Floors: you are on 04, Work', 'aria-label="Floors: you are on LG, Machine Room', 'testata: aria')
        t = una(t, '<b>04</b></span></span><span class="rl nm" id="bL"><b>Work</b>',
                '<b>LG</b></span></span><span class="rl nm" id="bL"><b>Machine Room</b>', 'testata: numero')
        t = una(t, 'onFloor=4', 'onFloor=-1', 'piano corrente')
        t = una(t, "nav.cur(4,'04','Work')", "nav.cur(-1,'LG','Machine Room')", 'pulsantiera')
        assert t.count('if(k===4') == 3, 'k===4'
        t = t.replace('if(k===4', 'if(k===-1')

    # lingue nella pulsantiera: si aprono un po' prima e un po' piu' svelte (resta un piccolo respiro)
    s = t.find("ot=setTimeout(function(){setOpen(true)},120)")
    if s >= 0:
        t = una(t, "ot=setTimeout(function(){setOpen(true)},120)", "ot=setTimeout(function(){setOpen(true)},95)", 'lingue: ritardo')
        t = una(t, "transition:max-width .5s cubic-bezier(.7,0,.2,1),padding .5s cubic-bezier(.7,0,.2,1),opacity .3s}",
                "transition:max-width .38s cubic-bezier(.7,0,.2,1),padding .38s cubic-bezier(.7,0,.2,1),opacity .25s}", 'lingue: apertura')
        t = una(t, "scramble(sp,x.dataset.l.toUpperCase(),60+Math.abs(i-ORDER.indexOf(cur))*55)",
                "scramble(sp,x.dataset.l.toUpperCase(),30+Math.abs(i-ORDER.indexOf(cur))*40)", 'lingue: lettere')

    if nome == 'home':
        t = una(t, FOGLIO, FOGLIO + '<link rel="stylesheet" href="/css/home.css">', 'stile home')

    # 6. coda
    i = t.rfind('</body>')
    coda = CODA + {'work': '<script src="/js/work.js"></script>', 'lg': '<script src="/js/mr.js"></script>', 'home': '<script src="/js/home.js"></script>'}.get(nome, '')
    t = t[:i] + coda + t[i:] if i > 0 else t + coda
    (OUT / f'{nome}.html').write_text(t, encoding='utf8')
    return luce


if __name__ == '__main__':
    assert not any('\u2014' in x for x in (AVVIO, FOGLIO, CODA, DOPO_TESTATA, ASCENSORE, LINGUA)), 'trattino lungo'
    for d in (FONTS, JS):
        d.mkdir(parents=True, exist_ok=True)
    for f in list(FONTS.glob('*.woff2')) + list(JS.glob('as-*.js')) + list(JS.glob('lg-*.js')):
        f.unlink()
    for nome, src in PAGINE.items():
        print(f'{nome:9s} <- prototipo/{src}.html  (testata: {monta(nome, src)})')
