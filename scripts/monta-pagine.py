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
}
INDIRIZZI = "{5:'/',3:'/brand',2:'/systems',1:'/studio',0:'/contact'}"


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


def monta(nome, src):
    t = (PROTO / f'{src}.html').read_text(encoding='utf8')
    t = font_esterni(t)
    t = dati_esterni(t)

    # 2. la testata nasce con la luce della prima sezione
    prima = re.search(r'<section[^>]*\bdata-f\b[^>]*>', t)
    luce = re.search(r'data-luce="([^"]+)"', prima.group(0)).group(1)
    t = una(t, '<header class="bar" id="bar" data-luce="carta">', f'<header class="bar" id="bar" data-luce="{luce}">', 'testata')

    i = t.find('</header>', t.find('id="bar"')) + len('</header>'); t = t[:i] + DOPO_TESTATA + t[i:]

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

    # 6. coda
    i = t.rfind('</body>')
    t = t[:i] + CODA + t[i:] if i > 0 else t + CODA
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
