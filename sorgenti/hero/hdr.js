/* il display della testata: il piano e la colonna dei sei piani (il nostro menu). La freccia compare solo durante la corsa, come nel display di una cabina.
   I numeri girano come un contatore: salendo il nuovo arriva da sotto, scendendo da sopra. Il quadrato acceso è il piano dove sei. */
var HDR=(function(){var b=$('dispB'),N=$('bN'),A=$('bA'),L=$('bL'),K=[].slice.call($('bK').children),RM=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches,fl=5,nm='Home',op=false,hv=false;
  function roll(el,txt,dir){var cur=el.lastElementChild;if(cur&&cur.textContent===txt)return;var nb=document.createElement('b');nb.textContent=txt;el.appendChild(nb);
    while(el.children.length>2)el.removeChild(el.firstElementChild);
    if(RM||!cur||!nb.animate){if(cur&&cur.parentNode)el.removeChild(cur);return}
    var d=dir>0?1:-1,o={duration:420,easing:'cubic-bezier(.7,0,.2,1)'};
    cur.animate([{transform:'translateY(0)'},{transform:'translateY('+(-110*d)+'%)'}],o).onfinish=function(){if(cur.parentNode)el.removeChild(cur)};
    nb.animate([{transform:'translateY('+(110*d)+'%)'},{transform:'translateY(0)'}],o)}
  function label(){roll(L,op?'Close':hv?'All floors':nm,op||hv?1:-1)}
  function lit(k){K.forEach(function(i,j){i.classList.toggle('lit',j===5-k)})}
  function aria(){b.setAttribute('aria-label',(op?'Close the floors panel':'Floors: you are on '+two(fl)+', '+nm+'. Open the floors panel'))}
  lit(5);
  if(fine){b.addEventListener('pointerenter',function(){hv=true;label()});b.addEventListener('pointerleave',function(){hv=false;label()})}
  return {
    floor:function(k,name){if(k!==fl)roll(N,two(k),k>fl?1:-1);fl=k;nm=name;lit(k);if(!op&&!hv)roll(L,name,1);aria()},
    dir:function(d){A.classList.toggle('on',!!d);if(d)A.classList.toggle('dw',d<0)},
    /* per altri palazzi (il manuale): numero, nome, quale dei sei quadrati accendere, verso */
    show:function(label,name,idx,dir){roll(N,label,dir);nm=name;if(!op&&!hv)roll(L,name,dir);K.forEach(function(i,j){i.classList.toggle('lit',j===idx)});b.setAttribute('aria-label','Floors: you are on '+label+', '+name+'. Open the floors panel')},
    open:function(on){op=on;b.classList.toggle('open',on);b.setAttribute('aria-expanded',on?'true':'false');label();aria()}
  }})();
