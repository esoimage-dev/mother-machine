# L'ascensore tra le pagine vere: precarica la destinazione, arriva a porte chiuse,
# la pagina nuova apre le porte su di se'. Si applica una volta su src/html (non idempotente).
import re, pathlib
SRC = pathlib.Path(__file__).resolve().parent.parent / 'src/html'
HEAD = ("<script>/* ascensore tra pagine: se arriviamo da una corsa, le porte partono chiuse */"
        "try{var a=sessionStorage.getItem('mm-arrive'),p=location.pathname.replace(/\\.html$/,'').replace(/\\/$/,'')||'/';"
        "if(a&&a===p)document.documentElement.classList.add('mm-arr');sessionStorage.removeItem('mm-arrive')}catch(e){}</script>"
        "<style>html.mm-arr #ride{visibility:visible;background:transparent}html.mm-arr #ride .door.l,html.mm-arr #ride .door.r{transform:translateX(0)}"
        "html.mm-arr #ride .pg,html.mm-arr #ride .disp{visibility:hidden}</style>")
TAIL = ("<script>/* arrivo: la pagina e' pronta, le porte si aprono su di lei */"
        "(function(){var R=document.documentElement;if(!R.classList.contains('mm-arr'))return;var done=false;"
        "function end(){if(done)return;done=true;var r=document.getElementById('ride');"
        "SH.open().then(function(){R.classList.remove('mm-arr');r.classList.remove('on');r.setAttribute('aria-hidden','true')})}"
        "(document.fonts?document.fonts.ready:Promise.resolve()).then(function(){requestAnimationFrame(function(){requestAnimationFrame(end)})});"
        "setTimeout(end,2500)})();</script>")
LEAVE = ("var MM_LEAVE=function(k){if(!MM_PAGES[k])return false;"
         "try{sessionStorage.setItem('mm-arrive',MM_PAGES[k])}catch(e){}location.href=MM_PAGES[k];return true};"
         "var MM_PRE=function(k){if(!MM_PAGES[k]||document.querySelector('link[data-mm=\"'+k+'\"]'))return;"
         "var l=document.createElement('link');l.rel='prefetch';l.href=MM_PAGES[k];l.setAttribute('data-mm',k);document.head.appendChild(l)};")

def one(t, old, new, what):
    assert t.count(old) == 1, what
    return t.replace(old, new)

for f in sorted(SRC.glob('*.html')):
    t = f.read_text(encoding='utf8')
    i = t.find('<style'); t = t[:i] + HEAD + t[i:]
    old = "await S.open();S.busy=false;return true};"
    t = one(t, old, "if(window.MM_LEAVE&&MM_LEAVE(to))return new Promise(function(){});" + old, 'open')
    old = "var MM_PAGES={5:'/',3:'/brand',2:'/systems',1:'/studio',0:'/contact'};"
    t = one(t, old, old + LEAVE, 'pages')
    t, n = re.subn(r"(\n  if\(k===-?\d+)\)\{pg\.innerHTML='';return\}", r"\1||MM_PAGES[k]){pg.innerHTML='';return}", t)
    assert n == 1, 'draw'
    old = "function go(k){if(SH.busy||k===onFloor)return;"
    t = one(t, old, old + "MM_PRE(k);", 'go')
    i = t.rfind('</body>')
    t = t[:i] + TAIL + t[i:] if i > 0 else t + TAIL
    f.write_text(t, encoding='utf8'); print(f.name, 'ok')
