/* eroe 3: la frase in Hanken variabile. Le lettere vicine al cursore (o al dito) prendono peso, da 100 a 900, come un'onda.
   A destra, il film in una finestra; sotto, il bottone dove vola il punto. */
(function(){
var sec=$('s1'),h=$('h3t'),mid=$('h3mid'),gd=$('h3gd'),wv=$('h3w'),bar=$('h3bar'),fig=$('h3f');
var LO=110,HI=900,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var LINES=['The machine','behind your','business.'];
var CH=[],ptr=null,lastMove=-1e9,fs=100,cx2=document.createElement('canvas').getContext('2d');
function make(){h.innerHTML='';CH=[];
  LINES.forEach(function(l){var d=document.createElement('span');d.className='l';d.setAttribute('aria-hidden','true');
    l.split('').forEach(function(c){var s=document.createElement('span');s.className='c'+(c==='.'?' dot':'');s.textContent=c===' '?'\u00a0':c;d.appendChild(s);CH.push({el:s,w:LO,cx:0,cy:0})});
    var m=document.createElement('i');m.className='bm';d.appendChild(m);h.appendChild(d)})}
function tileOn(){return getComputedStyle(fig).display!=='none'}
function fit(){var W=mid.clientWidth,g=sec.querySelector('.h3g'),cs=getComputedStyle(g);
  var Hav=sec.offsetHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)-g.children[0].offsetHeight-g.children[2].offsetHeight-2*parseFloat(cs.rowGap||cs.gap||24);
  /* se c'è il film a destra, la frase gli lascia il suo spazio */
  var Wt=tileOn()?W-fig.offsetWidth-56:W;
  make();h.style.fontSize='100px';CH.forEach(function(c){c.el.style.fontWeight=tileOn()?560:HI});
  var mw=0;[].forEach.call(h.children,function(d){mw=Math.max(mw,d.scrollWidth)});
  fs=Math.min(100*Wt/mw*.97,Hav*.93/(LINES.length*.86));h.style.fontSize=fs.toFixed(1)+'px';CH.forEach(function(c){c.el.style.fontWeight=c.w});
  placeTile()}
function placeTile(){if(!tileOn())return;var l1=h.children[0];fig.style.top=(l1.getBoundingClientRect().top-mid.getBoundingClientRect().top+fs*.12).toFixed(1)+'px'}
function at(e){ptr={x:e.clientX,y:e.clientY};lastMove=performance.now()}
addEventListener('pointermove',at,{passive:true});
addEventListener('touchmove',function(e){var t=e.touches[0];if(t)at(t)},{passive:true});
addEventListener('touchstart',function(e){var t=e.touches[0];if(t)at(t)},{passive:true});
sec.addEventListener('pointerleave',function(){lastMove=-1e9});
var T0=performance.now(),qs=null,mk=0;
function loop(now){requestAnimationFrame(loop);
  var r=h.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
  var t=(now-T0)/1000,idle=now-lastMove>2200,p,sr=sec.getBoundingClientRect();
  /* da solo: un punto che passa piano sulla frase, riga per riga */
  if(idle||!ptr){var a=t*.42;p={x:r.left+r.width*(.5+.5*Math.sin(a)),y:r.top+r.height*(.5+.46*Math.sin(a*.53+1.1))}}else p=ptr;
  if(!qs){qs={x:p.x,y:p.y}}qs.x+=(p.x-qs.x)*(idle?.06:.2);qs.y+=(p.y-qs.y)*(idle?.06:.2);
  var R=fs*(innerWidth<700?1.05:.95),i2=1/(2*R*R),best=1e12,bw=LO;
  /* le posizioni delle lettere si rileggono un fotogramma su tre: si muovono poco e leggere il layout costa */
  if(!(mk=(mk+1)%3))CH.forEach(function(c){var b=c.el.getBoundingClientRect();c.cx=b.left+b.width/2;c.cy=b.top+b.height/2});
  CH.forEach(function(c){var dx=c.cx-qs.x,dy=(c.cy-qs.y)*1.25,d2=dx*dx+dy*dy,tg=LO+(HI-LO)*Math.exp(-d2*i2);
    c.w+=(tg-c.w)*.16;var w=Math.round(c.w);if(w!==c.rw){c.rw=w;c.el.style.fontWeight=w}
    if(d2<best){best=d2;bw=w}});
  wv.textContent=bw;bar.style.left=((bw-100)/8)+'%';}
function boot(){fit();if(reduce){CH.forEach(function(c){c.el.style.fontWeight=700});wv.textContent=700;bar.style.left='75%';return}requestAnimationFrame(loop)}
var tm;addEventListener('resize',function(){clearTimeout(tm);tm=setTimeout(fit,120)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(boot);else boot();

/* il bottone: il punto di "business." vola dentro la G e il pomodoro sale dal basso */
var SQV='a';/*SQV*/
var cta=$('h3cta');cta.classList.add('v'+SQV);var fly=$('h3fly'),gq=cta.querySelector('.gq'),fine=matchMedia('(hover:hover) and (pointer:fine)').matches,tok=0;
function dotBox(){var d=h.querySelector('.dot'),r=d.getBoundingClientRect(),bl=d.parentNode.querySelector('.bm').getBoundingClientRect().top;
  cx2.font=(d.style.fontWeight||400)+' '+fs+'px Hanken';var m=cx2.measureText('.');
  return {x:r.left-m.actualBoundingBoxLeft,y:bl-m.actualBoundingBoxAscent,w:m.actualBoundingBoxLeft+m.actualBoundingBoxRight,h:m.actualBoundingBoxAscent+m.actualBoundingBoxDescent,el:d}}
cta.addEventListener('mouseenter',function(){var my=++tok;if(!fine||reduce){cta.classList.add('lit');return}
  var a=dotBox(),q=gq.getBoundingClientRect();if(a.w<1){cta.classList.add('lit');return}
  fly.getAnimations().forEach(function(x){x.cancel()});cta.classList.remove('now');
  /* arriva un pixel più grande del quadrato nero per lato, così lo copre tutto; poi si stringe e resta dentro, acceso */
  var tx=q.left-1,ty=q.top-1,tw=q.width+2;
  fly.style.cssText='display:block;left:'+tx+'px;top:'+ty+'px;width:'+tw+'px;height:'+tw+'px;transform-origin:50% 50%';a.el.classList.add('gone');
  var dx=(a.x+a.w/2)-(tx+tw/2),dy=(a.y+a.h/2)-(ty+tw/2),s0=a.w/tw,s1=a.h/tw,lift=Math.min(160,innerHeight*.12);
  fly.animate([{transform:'translate('+dx+'px,'+dy+'px) scale('+s0+','+s1+')'},{transform:'translate('+(dx*.45)+'px,'+(dy*.65-lift)+'px) rotate(90deg) scale('+((s0+1)/2)+')',offset:.55},{transform:'rotate(180deg)'}],{duration:560,easing:'cubic-bezier(.7,0,.2,1)',fill:'forwards'}).onfinish=function(){if(my!==tok)return;
    cta.classList.add('lit');
    /* a: si stringe di poco e resta dentro con un bordino nero; b: entra e sparisce, resta il quadrato nero sul pomodoro */
    if(SQV==='b'){fly.animate([{opacity:1},{opacity:0}],{duration:140,easing:'ease-out',fill:'forwards'}).onfinish=function(){if(my===tok)fly.style.display='none'};return}
    var k=26/tw;fly.animate([{transform:'rotate(180deg)'},{transform:'rotate(180deg) scale('+k+')'}],{duration:240,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'}).onfinish=function(){if(my!==tok)return;cta.classList.add('now');fly.style.display='none'}}});
cta.addEventListener('mouseleave',function(){var my=++tok,d=h.querySelector('.dot');
  if(!fine||reduce){cta.classList.remove('now','lit');if(d)d.classList.remove('gone');return}
  /* da dove parte: dal quadratino acceso, oppure da dove si trova se stava ancora volando */
  var s=fly.style.display==='block'?fly.getBoundingClientRect():(function(){var q=gq.getBoundingClientRect(),k=26;return {left:q.left+(q.width-k)/2,top:q.top+(q.height-k)/2,width:k,height:k}})();
  fly.getAnimations().forEach(function(x){x.cancel()});cta.classList.remove('now','lit');
  if(!d){fly.style.display='none';return}
  var a=dotBox();if(a.w<1){fly.style.display='none';d.classList.remove('gone');return}
  fly.style.cssText='display:block;left:'+a.x+'px;top:'+a.y+'px;width:'+a.w+'px;height:'+a.h+'px;transform-origin:50% 50%';
  var dx=(s.left+s.width/2)-(a.x+a.w/2),dy=(s.top+s.height/2)-(a.y+a.h/2),sx=s.width/a.w,sy=s.height/a.h,lift=Math.min(140,innerHeight*.1);
  fly.animate([{transform:'translate('+dx+'px,'+dy+'px) scale('+sx+','+sy+')'},{transform:'translate('+(dx*.5)+'px,'+(dy*.35-lift)+'px) rotate(-90deg) scale('+((sx+1)/2)+','+((sy+1)/2)+')',offset:.5},{transform:'rotate(-180deg)'}],{duration:540,easing:'cubic-bezier(.7,0,.2,1)',fill:'forwards'}).onfinish=function(){if(my!==tok)return;fly.style.display='none';d.classList.remove('gone');
    d.animate([{transform:'scale(1.35)'},{transform:'none'}],{duration:260,easing:'cubic-bezier(.2,.8,.2,1)'})}});
/* il film: gira muto nella finestra, si apre a tutto schermo con il suono */
var st=$('st'),slot=$('h3slot'),ov=$('h3ov'),pr=$('h3pr'),sb=$('h3snd'),M=null,A=null,ft=0,open=false,play=true,last=null,vis=true;
(function(){var c=document.createElement('canvas');c.width=c.height=220;var x=c.getContext('2d'),im=x.createImageData(220,220);for(var i=0;i<im.data.length;i+=4){im.data[i]=im.data[i+1]=im.data[i+2]=20;im.data[i+3]=Math.random()<.5?Math.random()*26|0:0}x.putImageData(im,0,0);$('gr').style.background='url('+c.toDataURL()+')'})();
var L0=0,L1=0;
function kind(){return innerWidth/innerHeight<.9?'v':'h'}
function ensure(k){if(M&&M._k===k)return;[].slice.call(st.children).forEach(function(e){if(e.id!=='gr')st.removeChild(e)});M=k==='v'?MMV:MM;M._k=k;A=M.build(st,LG);MMS.init(M);L0=M.REAL(3.95);L1=M.REAL(12.3+M.OFF);ft=L0;
  var s=Math.round(M.DUR);$('h3dur').textContent=Math.floor(s/60)+':'+('0'+s%60).slice(-2)}
function rect1(k){var ar=k==='v'?9/16:16/9,aw=innerWidth-32,ah=innerHeight-56-28,w=Math.min(aw,ah*ar),hh=w/ar;return {x:(innerWidth-w)/2,y:56+(ah-hh)/2,w:w,h:hh}}
function setR(r){st.style.left=r.x+'px';st.style.top=r.y+'px';st.style.width=r.w+'px';st.style.height=r.h+'px'}
var EZ='cubic-bezier(.7,0,.2,1)';
function openF(){if(open)return;var k=tileOn()?'h':kind();var r0=tileOn()?slot.getBoundingClientRect():null;ensure(k);
  var r1=rect1(k);document.body.appendChild(st);st.classList.add('big');setR(r1);ov.classList.add('on');ov.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';
  if(r0&&!reduce)st.animate([{transform:'translate('+(r0.left-r1.x)+'px,'+(r0.top-r1.y)+'px) scale('+(r0.width/r1.w)+')',transformOrigin:'0 0'},{transform:'none',transformOrigin:'0 0'}],{duration:640,easing:EZ});
  else st.animate([{opacity:0},{opacity:1}],{duration:300});
  open=true;play=true;ft=0;if(MMS.enable(0)){MMS.seek(0);sb.textContent='Sound off'}}
function closeF(){if(!open)return;open=false;MMS.disable();sb.textContent='Sound on';ov.classList.remove('on');ov.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';
  var done=function(){st.classList.remove('big');st.removeAttribute('style');slot.appendChild(st);play=true;ft=L0};
  if(tileOn()&&!reduce){var r0=slot.getBoundingClientRect(),r1=st.getBoundingClientRect();st.animate([{transform:'none',transformOrigin:'0 0'},{transform:'translate('+(r0.left-r1.left)+'px,'+(r0.top-r1.top)+'px) scale('+(r0.width/r1.width)+')',transformOrigin:'0 0'}],{duration:520,easing:EZ}).onfinish=done}
  else done()}
$('h3fb').addEventListener('click',openF);$('h3fb').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openF()}});$('h3wf').addEventListener('click',openF);$('h3x').addEventListener('click',closeF);
ov.addEventListener('click',function(e){if(e.target===ov)closeF()});
addEventListener('keydown',function(e){if(e.key==='Escape')closeF()});
sb.addEventListener('click',function(){if(MMS.isOn()){MMS.disable();sb.textContent='Sound on'}else if(MMS.enable(ft)){MMS.seek(ft);sb.textContent='Sound off'}});
addEventListener('resize',function(){if(open)setR(rect1(M._k))});
var fk=0;
function floop(ts){requestAnimationFrame(floop);if(!M)return;
  /* nella finestra il film va a 30 fotogrammi: si vede uguale e costa la metà */
  if(!open&&(fk=(fk+1)%2))return;
  var dt=last===null?0:Math.min(.1,(ts-last)/1000);last=ts;
  if(!open){if(!tileOn())return;var rr=slot.getBoundingClientRect();if(rr.bottom<0||rr.top>innerHeight)return}
  if(play){ft+=dt;if(open){if(ft>=M.DUR){ft=M.DUR;play=false;MMS.end()}else MMS.update(ft,true,1)}else if(ft>L1)ft=L0}
  M.render(A,Math.min(ft,M.DUR));if(open)pr.style.width=(Math.min(1,ft/M.DUR)*100).toFixed(2)+'%'}
var fgo=function(){if(tileOn())ensure('h');requestAnimationFrame(floop)},fdone=false;function fonce(){if(!fdone){fdone=true;fgo()}}
try{Promise.all(['700 100px "Hanken Grotesk"','100 100px "Hanken Grotesk"','900 100px "Hanken Grotesk"','500 20px "DM Mono"'].map(function(x){return document.fonts.load(x)})).then(fonce,fonce)}catch(e){fonce()}setTimeout(fonce,900);
})();
