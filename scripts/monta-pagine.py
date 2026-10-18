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
import base64, hashlib, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROTO = ROOT / 'prototipo'
OUT = ROOT / 'src/html'
FONTS = ROOT / 'public/fonts'
JS = ROOT / 'public/js'

PAGINE = {  # pagina del sito <- pagina approvata
    'home': 'home', 'studio': 'studio', 'systems': 'systems', 'brand': 'brand',
    'contact': 'contact', 'progetto': 'progetto', 'privacy': 'privacy-termini',
    'work': 'progetto',  # 04 Work: nasce dalla pagina progetto (stesso piano), con il registro al posto del caso
}
INDIRIZZI = "{5:'/',4:'/work',3:'/brand',2:'/systems',1:'/studio',0:'/contact'}"


SITO = 'https://mothermachine.studio'
# meta per Google e anteprime dei link: titolo e descrizione presi dai testi approvati di ogni pagina
META = {
    'home': ('/', 'Mother Machine · The machine behind your business.',
             "A design and engineering studio. We design and build the software companies run on, and the brands they're known by.", '#0F0F0E'),
    'systems': ('/systems', 'Mother Machine · Systems',
                'Back offices, apps and automations, built around how your team actually works. Not a template bent into shape.', '#BEC2BF'),
    'brand': ('/brand', 'Mother Machine · Brand',
              'Identity, websites and interfaces that hold together, from the logo to the last button.', '#FBFAF7'),
    'studio': ('/studio', 'Mother Machine · Studio',
               'A small studio. On purpose. The people who design your system are the people who build it.', '#EEC3B1'),
    'contact': ('/contact', 'Mother Machine · Contact',
                'Tell us what slows you down. The first conversation is free, and a real person reads every order.', '#EEC3B1'),
    'progetto': ('/work/project', "Mother Machine · Vitalia's Pizza on Wheels",
                 'A new business, built from zero: the brand, the website and the system that runs it.', '#0F0F0E'),
    'work': ('/work', 'Mother Machine · Work',
             'The register: every machine we deliver gets a serial number. Who it was for, what we built, what changed.', '#0F0F0E'),
    'privacy': ('/privacy', 'Mother Machine · Privacy and terms',
                'We collect only what we need to answer you and run a project with you. No ads, no tracking cookies, no selling data.', '#FBFAF7'),
}


def testa_meta(nome):
    import html
    url, titolo, desc, colore = META[nome]
    e = lambda s: html.escape(s, quote=True)
    img = f'{SITO}/og/{nome}.png'
    return (f'<title>{e(titolo)}</title>'
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


# ---------- 3. testa ----------
AVVIO = ("<script>/* avvio: niente transizioni finche' la pagina non e' pronta; se arriviamo con l'ascensore, porte chiuse */"
         "(function(){var R=document.documentElement;R.classList.add('mm-boot');"
         "try{var a=sessionStorage.getItem('mm-arrive'),p=location.pathname.replace(/\\.html$/,'').replace(/\\/$/,'')||'/';"
         "sessionStorage.removeItem('mm-arrive');if(a){a=JSON.parse(a);if(a.to===p){R.classList.add('mm-arr','mm-hide');if(a.fold)R.classList.add('mm-arr-fold')}}}catch(e){}})();</script>")
FOGLIO = '<link rel="stylesheet" href="/css/mm-sito.css">'
CODA = '<script src="/js/mm-sito.js"></script>'
# subito dopo la testata: se arriviamo con l'ascensore la testata nasce gia' "in corsa" (chiara sulle porte, senza fascia)
# e, se la pagina di prima aveva il logo piccolo, nasce piegata. Cosi' vale dal primo disegno.
DOPO_TESTATA = ("<script>(function(){var R=document.documentElement,b=document.getElementById('bar');"
                "if(R.classList.contains('mm-arr')){b.classList.add('riding');if(R.classList.contains('mm-arr-fold'))b.classList.add('fold')}})();</script>")

# ---------- 4. ascensore ----------
ASCENSORE = ("var MM_PAGES=" + INDIRIZZI + ";"
             "var MM_LEAVE=function(k){if(!MM_PAGES[k])return false;"
             "try{sessionStorage.setItem('mm-arrive',JSON.stringify({to:MM_PAGES[k],fold:bar.classList.contains('fold')}))}catch(e){}"
             "location.href=MM_PAGES[k];return true};"
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
    return una(t, '<!-- MM:COPERTINE-STUDI -->', '\n      '.join(out), 'segnaposto copertine')


def monta(nome, src):
    t = (PROTO / f'{src}.html').read_text(encoding='utf8')
    t = font_esterni(t)
    t = dati_esterni(t)

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
    t = una(t, "}).then(function(){onFloor=k;", "}).then(function(){if(MM_PAGES[k]){location.href=MM_PAGES[k];return}document.documentElement.classList.remove('mm-riding');onFloor=k;", 'fine corsa')
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

    # 6. coda
    i = t.rfind('</body>')
    coda = CODA + ('<script src="/js/work.js"></script>' if nome == 'work' else '')
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
