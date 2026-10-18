# Regole della lingua decise il 18 ottobre 2026 e logo che porta alla home.
# - il suggerimento compare solo se il browser parla italiano, spagnolo o francese (non inglese, non altre lingue)
# - scritto per intero: "Italiano?", "Español?", "Français?"; lampeggia la prima volta, poi resta discreto pagina dopo pagina
# - premuto: la lingua cambia, viene ricordata (anche nelle pagine dopo) e il suggerimento sparisce per sempre
# - il logo e "05 Home" nel footer portano alla home con l'ascensore
# Si applica una volta su src/html.
import pathlib
SRC = pathlib.Path(__file__).resolve().parent.parent / 'src/html'

def one(t, old, new, what):
    assert t.count(old) == 1, what
    return t.replace(old, new)

OLD_HINT_START = "  var want=(navigator.languages"
OLD_HINT_END = "},RM?600:2200)}\n"
NEW_HINT = r"""  /* la scelta salvata vince su tutto: si riapplica subito, senza animazioni */
  var saved=null;try{saved=localStorage.getItem('mm-lang')}catch(e){}
  if(saved&&ORDER.indexOf(saved)>=0&&saved!==cur){var rm0=RM;RM=true;try{apply(saved)}catch(e){}RM=rm0}
  /* solo le lingue del lancio diverse dall'inglese, e solo se non c'e' gia' una scelta */
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
    var word=L[want].self+'?';
    setTimeout(function(){if(cur===want)return;try{sessionStorage.setItem('mm-lhint','1')}catch(e){}
      sg.hidden=false;if(!first)sg.classList.add('calm');void sg.offsetWidth;sg.classList.add('in');
      var sp=sg.querySelector('span');if(first)scramble(sp,word,0);else sp.textContent=word},RM?300:(first?2200:500))}
"""
CSS_ADD = ".bar .lhint[hidden]{display:none}.bar .lhint.calm.in i{animation:none}.bar .lhint span{text-transform:uppercase}"
LOGO = r"""<script>/* il logo e "05 Home" nel footer portano alla home, con l'ascensore */
(function(){var p=location.pathname;if(p==='/'||p==='/index.html')return;
[].forEach.call(document.querySelectorAll('a.blogo,footer a[href="#top"]'),function(a){a.setAttribute('href','/');
a.addEventListener('click',function(e){if(e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;e.preventDefault();e.stopImmediatePropagation();
if(typeof go==='function'&&typeof SH!=='undefined'&&!SH.busy)go(5);else location.href='/'},true)})})();</script>"""

for f in sorted(SRC.glob('*.html')):
    t = f.read_text(encoding='utf8')
    if OLD_HINT_START in t:
        s = t.find(OLD_HINT_START); e = t.find(OLD_HINT_END, s) + len(OLD_HINT_END)
        t = t[:s] + NEW_HINT + t[e:]
        t = one(t, "function apply(c){var from=L[cur],t=L[c];cur=c;",
                "function apply(c){var from=L[cur],t=L[c];cur=c;try{localStorage.setItem('mm-lang',c)}catch(e){}", 'apply')
        t = one(t, ".bar .lhint:not([hidden])+.dispB{margin-left:0}", ".bar .lhint:not([hidden])+.dispB{margin-left:0}" + CSS_ADD, 'css')
        t = one(t, ".bar .lhint span{min-width:3ch;", ".bar .lhint span{", 'minw')
    i = t.rfind('</body>')
    t = t[:i] + LOGO + t[i:] if i > 0 else t + LOGO
    f.write_text(t, encoding='utf8'); print(f.name, 'ok')
