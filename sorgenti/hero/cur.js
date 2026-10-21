/* il cursore quadrato: segue il mouse senza ritardo, prende il colore del testo della luce dove si trova */
(function(){if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  var c=document.createElement('div');c.className='mmc';c.setAttribute('aria-hidden','true');c.innerHTML='<i></i>';document.body.appendChild(c);document.documentElement.classList.add('mmcur');
  var LIGHT={notte:'#F4F2EC'},HIT='a,button,[role=button],[role=link],label,select,summary,input[type=checkbox],input[type=radio]',TXT='input:not([type=checkbox]):not([type=radio]),textarea,[contenteditable]',last=null;
  function luce(el){var l=el&&el.closest?el.closest('[data-luce]'):null;return l?l.getAttribute('data-luce'):'carta'}
  addEventListener('pointermove',function(e){if(e.pointerType&&e.pointerType!=='mouse')return;c.style.transform='translate3d('+e.clientX+'px,'+e.clientY+'px,0) translate(-50%,-50%)';c.classList.add('on');
    var t=e.target;if(t!==last){last=t;var lu=luce(t),col=LIGHT[lu]||'#121211',h=t.closest?t.closest(HIT):null,f=t.closest?t.closest('[data-cur]'):null;if(f)col=f.getAttribute('data-cur');var g=t.closest?t.closest('[data-cc]'):null;if(g&&!f)col=g.getAttribute('data-cc');c.style.setProperty('--cc',col);c.style.setProperty('--ch',f?col:'var(--sig)');
      /* sul nero si inverte sopra le lettere; sopra un bottone o un colore forzato resta pieno */
      
      c.classList.toggle('inv',lu==='notte'&&!h&&!f&&!g);c.classList.toggle('hit',!!h);c.classList.toggle('txt',!!(t.closest&&t.closest(TXT)))}},{passive:true});
  addEventListener('pointerdown',function(){c.classList.add('dn')},{passive:true});addEventListener('pointerup',function(){c.classList.remove('dn')},{passive:true});
  document.addEventListener('mouseleave',function(){c.classList.remove('on')});document.addEventListener('mouseout',function(e){if(!e.relatedTarget)c.classList.remove('on')});
  addEventListener('scroll',function(){last=null},{passive:true});
})();
