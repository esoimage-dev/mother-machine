# Il suggerimento della lingua passa dal riquadro in basso alla testata (scelta B, 18 ottobre 2026):
# accanto al numero del piano compare per qualche secondo "IT?", il quadratino lampeggia una volta in pomodoro.
# Compare solo se il browser parla una lingua che abbiamo, una volta per visita. Si applica una volta su src/html.
import pathlib
SRC = pathlib.Path(__file__).resolve().parent.parent / 'src/html'
OLD_START = "  /* il cartellino:"
OLD_END = "RM?600:2200);"
NEW = r"""  /* il suggerimento della lingua vive nella testata, accanto al numero del piano: "IT?" per qualche secondo.
     Il quadratino lampeggia una volta in pomodoro (risponde), poi torna inchiostro. Una volta per visita,
     solo se il browser parla una lingua che abbiamo e non e' quella in cui sei. */
  var want=(navigator.languages||[navigator.language||'']).map(function(x){return (x||'').slice(0,2)}).filter(function(x){return L[x]&&x!==cur})[0];
  var hb=document.getElementById('dispB'),seen=false;try{seen=sessionStorage.getItem('mm-lhint')==='1'}catch(e){}
  var sg=null,st;
  function hideSug(){if(!sg||sg.hidden)return;clearTimeout(st);var sp=sg.querySelector('span');sg.classList.add('out');
    setTimeout(function(){sg.hidden=true;sg.classList.remove('out')},RM?0:260)}
  if(want&&hb&&!seen){
    sg=document.createElement('button');sg.type='button';sg.className='lhint';sg.lang=want;sg.hidden=true;
    sg.setAttribute('aria-label',L[want].sug+' '+L[want].sw);sg.title=L[want].sw;
    sg.innerHTML='<i aria-hidden="true"></i><span aria-hidden="true"></span>';
    hb.parentNode.insertBefore(sg,hb);
    sg.addEventListener('click',function(){apply(want)});
    setTimeout(function(){if(cur===want)return;try{sessionStorage.setItem('mm-lhint','1')}catch(e){}
      sg.hidden=false;void sg.offsetWidth;sg.classList.add('in');scramble(sg.querySelector('span'),want.toUpperCase()+'?',0);
      st=setTimeout(hideSug,10000)},RM?600:2200)}
"""
CSS = ("<style>"
       ".bar .lhint{all:unset;box-sizing:border-box;cursor:pointer;margin-left:auto;margin-right:6px;display:inline-flex;align-items:center;gap:8px;"
       "height:44px;padding:0 10px;font:500 11px var(--f-mono);letter-spacing:.1em;color:inherit;opacity:0;transform:translateY(-4px);"
       "transition:opacity .35s cubic-bezier(.2,.8,.2,1),transform .45s cubic-bezier(.2,.8,.2,1);-webkit-tap-highlight-color:transparent}"
       ".bar .lhint.in{opacity:.7;transform:none}.bar .lhint.in:hover,.bar .lhint.in:focus-visible{opacity:1}"
       ".bar .lhint.out{opacity:0;transform:translateY(-4px)}"
       ".bar .lhint span{min-width:3ch;border-bottom:1px solid transparent;transition:border-color .2s}"
       ".bar .lhint:hover span,.bar .lhint:focus-visible span{border-bottom-color:currentColor}"
       ".bar .lhint:focus-visible{outline:1px solid currentColor}"
       ".bar .lhint i{width:6px;height:6px;background:currentColor;flex:none}"
       ".bar .lhint.in i{animation:lhb 1.1s steps(1) .25s 1}"
       "@keyframes lhb{0%,50%{background:var(--sig)}25%,75%{background:transparent}100%{background:currentColor}}"
       ".bar .lhint:not([hidden])+.dispB{margin-left:0}"
       ".lsug-off .bar .lhint{opacity:0;pointer-events:none}"
       "@media (prefers-reduced-motion:reduce){.bar .lhint,.bar .lhint.in i{transition:none;animation:none}}"
       "</style>")

for f in sorted(SRC.glob('*.html')):
    t = f.read_text(encoding='utf8')
    s = t.find(OLD_START)
    if s < 0:
        print(f.name, 'nessun cartellino'); continue
    e = t.find(OLD_END, s) + len(OLD_END)
    t = t[:s] + NEW + t[e:]
    i = t.rfind('</body>')
    t = t[:i] + CSS + t[i:] if i > 0 else t + CSS
    f.write_text(t, encoding='utf8'); print(f.name, 'ok')
