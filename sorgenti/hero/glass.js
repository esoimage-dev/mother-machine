/* il momento mother. Il campo è una tela piccolissima ridisegnata a ogni fotogramma: costa poco al processore, la scheda video la ingrandisce e la sfocatura viene gratis.
   Le schede di vetro ridisegnano lo stesso campo, più sfocato, nella loro porzione: sembra vetro smerigliato, senza filtri dal vivo. */
(function(){var st=document.querySelector('.mstage');if(!st)return;
  var cv=st.querySelector('.mfield'),x=cv.getContext('2d'),W=160,H=100;cv.width=W;cv.height=H;
  var rm=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches,T0=performance.now(),vis=false;
  /* archi della m: colore, posizione, raggio, spessore, velocità, fase */
  var ROSA=window.MM_SIG==='rosa',BASE=ROSA?'#F3DDD3':'#F2D3C4',COL=ROSA?['#E9AE98','#E09A82','#F2C9B9','#FFF7F3','#EAB7A4','#D98B74']:['#FF5B3A','#FF4A2A','#F08A70','#FFF4EC','#FF6A45','#E8452A'];
  var A=[{x:.2,y:.9,r:.3,w:.15,s:.26,p:0},{x:.8,y:1.02,r:.4,w:.17,s:-.2,p:1.7},{x:.48,y:.58,r:.22,w:.11,s:.3,p:3.1},{x:.64,y:.16,r:.2,w:.13,s:-.24,p:4.4},{x:.06,y:.22,r:.15,w:.09,s:.22,p:2.2},{x:.95,y:.4,r:.18,w:.1,s:.28,p:5.1}];
  A.forEach(function(a,i){a.c=COL[i]});st.style.setProperty('--fbase',BASE);
  var P={x:.5,y:.5,on:0},Q={x:.5,y:.5,on:0};
  /* ogni tanto gli archi si mettono in fila e formano la m del marchio, come nel film: un istante, poi si sciolgono.
     Quattro archi su sei (i più accesi), misure prese dal marchio: due archi in alto con le aste lunghe, due archi più in basso. */
  var MI=[0,1,4,5],ML=[[190.5,190.5,1277],[489.5,190.5,1277],[190.5,1130.5,40],[489.5,1130.5,40]],MK=0,TV=0,LT0=0,SIG=ROSA?[217,139,116]:[255,91,58],OR=[2,3,0,1,4,5];
  function hex(c){return [parseInt(c.substr(1,2),16),parseInt(c.substr(3,2),16),parseInt(c.substr(5,2),16)]}A.forEach(function(a){a.rgb=hex(a.c)});
  function ease(u){return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}
  /* la curva della m: la prima volta dopo 8 s, poi ogni 30 s: 1,7 s per allinearsi, 1,1 s ferma, 2 s per sciogliersi. Il tempo conta solo quando la sezione si vede */
  function mk(tv){var u=(tv-8)%30;if(tv<8)return 0;if(u<1.7)return ease(u/1.7);if(u<2.8)return 1;if(u<4.8)return 1-ease((u-2.8)/2);return 0}
  function draw(now){var t=(now-T0)/1000;Q.x+=(P.x-Q.x)*.06;Q.y+=(P.y-Q.y)*.06;Q.on+=(P.on-Q.on)*.05;
    var k=FORM?mk(TV):0;MK=k;
    x.filter='blur(2.2px)';x.fillStyle=BASE;x.fillRect(-10,-10,W+20,H+20);
    OR.forEach(function(i){var a=A[i],m=a.m,kk=m?k:0,ax=a.x+.09*Math.sin(t*a.s+a.p),ay=a.y+.07*Math.cos(t*a.s*1.3+a.p),dx=ax-Q.x,dy=ay-Q.y,d=Math.hypot(dx,dy)+.05,push=Math.min(.14,Q.on*.1/d)*(1-k);ax+=dx/d*push;ay+=dy/d*push;
      var r=a.r*W*(1+.08*Math.sin(t*.5+a.p)),leg=r*1.2,w=a.w*W,rot=.24*Math.sin(t*a.s*.9+a.p),sy=1,col=a.c;
      if(kk>0){ax+=(m.x-ax)*kk;ay+=(m.y-ay)*kk;r+=(m.r-r)*kk;leg+=(m.l-leg)*kk;w+=(m.w-w)*kk;rot*=1-kk;sy=1+(SY-1)*kk;
        col='rgb('+[0,1,2].map(function(j){return Math.round(a.rgb[j]+(SIG[j]-a.rgb[j])*kk)}).join(',')+')'}
      x.save();x.globalAlpha=m?1:1-.45*k;x.translate(ax*W,ay*H);x.scale(1,sy);x.rotate(rot);x.strokeStyle=col;x.lineWidth=w;
      x.beginPath();x.moveTo(-r,leg);x.lineTo(-r,0);x.arc(0,0,r,Math.PI,0);x.lineTo(r,leg);x.stroke();x.restore()});
    if(Q.on>.01){var g=x.createRadialGradient(Q.x*W,Q.y*H,0,Q.x*W,Q.y*H,W*.24);g.addColorStop(0,'rgba(255,242,232,'+(.8*Q.on).toFixed(3)+')');g.addColorStop(1,'rgba(255,242,232,0)');x.filter='none';x.fillStyle=g;x.fillRect(0,0,W,H)}
    x.filter='none';
    /* il vetro: la stessa porzione del campo, più sfocata e più chiara */
    var sr=st.getBoundingClientRect();CP.forEach(function(o){var r=o.r;var sx=(r.left-sr.left)/sr.width*W,sy=(r.top-sr.top)/sr.height*H,sw=r.width/sr.width*W,sh=r.height/sr.height*H;
      o.x.filter='blur(3px)';o.x.drawImage(cv,sx-6,sy-6,sw+12,sh+12,-6*o.k,-6*o.k,o.w+12*o.k,o.h+12*o.k);o.x.filter='none';o.x.fillStyle='rgba(255,248,243,.22)';o.x.fillRect(0,0,o.w,o.h)})}
  var C=[].slice.call(st.querySelectorAll('.gc')),CP=C.map(function(c){var k=c.querySelector('.gcopy');return {c:c,cv:k,x:k.getContext('2d')}});
  /* dove si forma la m: allineata al margine destro della scena, alta quanto lo spazio tra i margini. Sul telefono no: la scena è troppo stretta e la m diventa righe */
  var SY=1,FORM=1;
  function place(sr){var cs=getComputedStyle(st),pt=parseFloat(cs.paddingTop)||40,pr=parseFloat(cs.paddingRight)||40,ux=sr.width/W,uy=sr.height/H,
      mh=sr.height-2*pt,mw=mh*680/1468;if(mw>sr.width*.42){mw=sr.width*.42;mh=mw*1468/680}var s=mh/1468,l=sr.width-pr-mw;SY=ux/uy;FORM=sr.width>=700&&sr.height/sr.width<1.4?1:0;
    MI.forEach(function(i,j){var g=ML[j];A[i].m={x:(l+g[0]*s)/sr.width,y:(pt+g[1]*s)/sr.height,r:149.5*s/ux,l:g[2]*s/ux,w:82*s/ux}})}
  function size(){var sr=st.getBoundingClientRect();place(sr);CP.forEach(function(o){o.r=o.c.getBoundingClientRect();o.r={left:o.r.left,top:o.r.top,width:o.r.width,height:o.r.height};o.k=W/sr.width;o.w=Math.max(8,Math.round(o.r.width*o.k));o.h=Math.max(8,Math.round(o.r.height*o.k));o.cv.width=o.w;o.cv.height=o.h})}
  /* le posizioni delle schede si rileggono solo quando cambiano (scroll, misura): non a ogni fotogramma */
  function rel(){var sr=st.getBoundingClientRect();CP.forEach(function(o){var r=o.c.getBoundingClientRect();o.r={left:r.left,top:r.top,width:r.width,height:r.height}})}
  size();addEventListener('resize',size);addEventListener('scroll',rel,{passive:true});
  function loop(now){requestAnimationFrame(loop);var dt=Math.min(50,now-(LT0||now));LT0=now;if(!vis)return;TV+=dt/1000;rel();draw(now)}
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis)st.classList.add('in')},{rootMargin:'80px'}).observe(st)}else{vis=true;st.classList.add('in')}
  if(rm){vis=false;st.classList.add('in');setTimeout(function(){size();draw(T0)},50)}else requestAnimationFrame(loop);
  if(fine){st.addEventListener('pointermove',function(e){var r=st.getBoundingClientRect();P.x=(e.clientX-r.left)/r.width;P.y=(e.clientY-r.top)/r.height;P.on=1},{passive:true});st.addEventListener('pointerleave',function(){P.on=0})}
  /* l'uscita in basso porta al piano, con la corsa dell'ascensore */
  [].forEach.call(st.querySelectorAll('.gcta'),function(a){a.addEventListener('click',function(e){e.preventDefault();if(typeof go==='function')go(+a.dataset.floor)})});
})();
