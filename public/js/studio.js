/* 01 Studio: quattro momenti, tutti fermi quando non si vedono.
   1. l'apertura: il titolo e' un disegno tecnico (contorno e linee di misura); scorrendo si riempie
   2. il vetro: gli archi della m su una tela piccolissima; la lastra ridisegna la sua porzione, piu' sfocata (come in home)
   3. le regole: il display dell'ascensore rotola sulla regola a meta' schermo
   4. Design / Code: il titolo di "Who you talk to" si gira nel suo codice */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function cl(v){return v<0?0:v>1?1:v}

  /* ---------- 1 · apertura ---------- */
  (function(){
    var S=document.querySelector('.stbp');if(!S)return;
    var pin=S.querySelector('.stbpin'),inn=S.querySelector('.in'),h=S.querySelector('.stbh'),G=S.querySelector('.stbg'),
        L1=S.querySelector('.stbl.l1'),L2=S.querySelector('.stbl.l2'),M=S.querySelector('.stbm'),cv=document.createElement('canvas').getContext('2d');
    function fit(){
      h.style.fontSize='100px';
      var cs=getComputedStyle(inn),W=inn.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),w=L1.getBoundingClientRect().width;
      var mx=innerWidth<700?150:200,fs=Math.max(40,Math.min(mx,100*W/w*.99));
      /* sul telefono il titolo non deve spingere fuori lede e fatti: al massimo meta' dell'altezza utile */
      h.style.fontSize=fs+'px';
    }
    function met(el){var cs=getComputedStyle(el),fs=parseFloat(cs.fontSize);cv.font=cs.fontWeight+' '+fs+'px '+cs.fontFamily;
      var H=cv.measureText('H'),x=cv.measureText('x');return {A:H.fontBoundingBoxAscent||fs*.92,cap:H.actualBoundingBoxAscent,x:x.actualBoundingBoxAscent,fs:fs,w:cs.fontWeight}}
    /* la linea di base vera: un segno alto zero in fondo alla riga */
    function base(o){var s=o.querySelector('.stb0');if(!s){s=document.createElement('span');s.className='stb0';s.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';o.appendChild(s)}return s.getBoundingClientRect().top}
    function guides(){
      var P=G.getBoundingClientRect(),o1=L1.querySelector('.o'),o2=L2.querySelector('.o'),r1=o1.getBoundingClientRect(),r2=o2.getBoundingClientRect(),m1=met(L1),m2=met(L2);
      var b1=base(o1)-P.top,b2=base(o2)-P.top,lx=r1.left-P.left,html='',cs=getComputedStyle(inn),pr=8;
      function hl(y,t,d){html+='<i class="h" style="top:'+y.toFixed(1)+'px;transition-delay:'+d+'s"></i>'+(t?'<i class="t" style="top:'+y.toFixed(1)+'px;right:'+pr+'px">'+t+'</i>':'')}
      hl(b1-m1.cap,'Cap height',0);hl(b1-m1.x,'x-height',.08);hl(b1,'Baseline',.16);hl(b2-m2.x,'',.24);hl(b2,'',.32);
      [lx,r2.right-P.left].forEach(function(x,i){html+='<i class="v" style="left:'+x.toFixed(1)+'px;transition-delay:'+(.2+i*.1)+'s"></i>'});
      /* la quota: sotto la seconda riga, quanto e' larga */
      var dy=r2.bottom-P.top+m2.fs*.1;
      html+='<i class="d" style="left:'+lx.toFixed(1)+'px;top:'+dy.toFixed(1)+'px;width:'+r2.width.toFixed(1)+'px"></i>'+
            '<i class="t" style="left:'+(lx+10).toFixed(1)+'px;top:'+(dy+16).toFixed(1)+'px">Hanken '+m2.w+' · '+Math.round(r2.width)+' px</i>';
      G.innerHTML=html;
    }
    var p=-1;
    function upd(){
      var r=S.getBoundingClientRect(),span=r.height-innerHeight,q=span>0?cl(-r.top/span):1;
      if(q===p)return;p=q;
      L1.style.setProperty('--f',cl(q/.5).toFixed(3));
      L2.style.setProperty('--f',cl((q-.42)/.5).toFixed(3));
      G.style.setProperty('--g',(1-cl((q-.6)/.3)).toFixed(3));
      M.style.setProperty('--p',q.toFixed(3));
    }
    function all(){fit();guides();p=-1;upd()}
    var raf=0;function tick(){if(!raf)raf=requestAnimationFrame(function(){raf=0;upd()})}
    all();
    (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){all();setTimeout(function(){G.classList.add('in')},RM?0:250)});
    addEventListener('scroll',tick,{passive:true});
    var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(all,120)});
  })();

  /* ---------- 2 · il vetro sopra gli archi ---------- */
  (function(){
    var st=document.querySelector('.stst2');if(!st)return;
    var cv=st.querySelector('.stfield'),x=cv.getContext('2d'),W=160,H=100;cv.width=W;cv.height=H;
    var fine=matchMedia('(hover:hover) and (pointer:fine)').matches,T0=performance.now(),vis=false;
    var BASE='#F3DDD3',A=[{x:.18,y:.92,r:.3,w:.15,s:.26,p:0,c:'#E9A48C'},{x:.82,y:1.04,r:.42,w:.17,s:-.2,p:1.7,c:'#DE8E74'},{x:.5,y:.56,r:.22,w:.11,s:.3,p:3.1,c:'#F2C9B9'},
      {x:.66,y:.14,r:.2,w:.13,s:-.24,p:4.4,c:'#FFF7F3'},{x:.05,y:.2,r:.16,w:.09,s:.22,p:2.2,c:'#EAB2A0'},{x:.95,y:.4,r:.18,w:.1,s:.28,p:5.1,c:'#D98B74'}];
    var P={x:.5,y:.5,on:0},Q={x:.5,y:.5,on:0};
    var g=st.querySelector('.stglass'),gc=g.querySelector('.stcopy'),gx=gc.getContext('2d'),R=null,K=1,GW=8,GH=8;
    function size(){var sr=st.getBoundingClientRect(),r=g.getBoundingClientRect();K=W/sr.width;GW=Math.max(8,Math.round(r.width*K));GH=Math.max(8,Math.round(r.height*K));gc.width=GW;gc.height=GH;rel()}
    function rel(){var sr=st.getBoundingClientRect(),r=g.getBoundingClientRect();R={x:(r.left-sr.left)/sr.width*W,y:(r.top-sr.top)/sr.height*H,w:r.width/sr.width*W,h:r.height/sr.height*H}}
    function draw(now){var t=(now-T0)/1000;Q.x+=(P.x-Q.x)*.06;Q.y+=(P.y-Q.y)*.06;Q.on+=(P.on-Q.on)*.05;
      x.filter='blur(2.2px)';x.fillStyle=BASE;x.fillRect(-10,-10,W+20,H+20);
      A.forEach(function(a){var ax=a.x+.09*Math.sin(t*a.s+a.p),ay=a.y+.07*Math.cos(t*a.s*1.3+a.p),dx=ax-Q.x,dy=ay-Q.y,d=Math.hypot(dx,dy)+.05,push=Math.min(.14,Q.on*.1/d);ax+=dx/d*push;ay+=dy/d*push;
        var r=a.r*W*(1+.08*Math.sin(t*.5+a.p)),leg=r*1.2,rot=.24*Math.sin(t*a.s*.9+a.p);
        x.save();x.translate(ax*W,ay*H);x.rotate(rot);x.strokeStyle=a.c;x.lineWidth=a.w*W;x.beginPath();x.moveTo(-r,leg);x.lineTo(-r,0);x.arc(0,0,r,Math.PI,0);x.lineTo(r,leg);x.stroke();x.restore()});
      x.filter='none';
      if(R){gx.filter='blur(3px)';gx.drawImage(cv,R.x-6,R.y-6,R.w+12,R.h+12,-6*K,-6*K,GW+12*K,GH+12*K);gx.filter='none';gx.fillStyle='rgba(255,248,243,.22)';gx.fillRect(0,0,GW,GH)}}
    size();addEventListener('resize',size);addEventListener('scroll',function(){if(vis)rel()},{passive:true});
    function loop(now){requestAnimationFrame(loop);if(vis)draw(now)}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis)size()},{rootMargin:'80px'}).observe(st);else vis=true;
    if(RM){vis=false;setTimeout(function(){size();draw(T0)},60)}else requestAnimationFrame(loop);
    if(fine){st.addEventListener('pointermove',function(e){var r=st.getBoundingClientRect();P.x=(e.clientX-r.left)/r.width;P.y=(e.clientY-r.top)/r.height;P.on=1},{passive:true});st.addEventListener('pointerleave',function(){P.on=0})}
  })();

  /* ---------- 3 · le regole e il display ---------- */
  (function(){
    var li=[].slice.call(document.querySelectorAll('.strg .strl li')),d=document.querySelector('.strd');if(!li.length||!d||!('IntersectionObserver' in window))return;
    var U=document.querySelector('.stdisp .u'),D=document.querySelector('.stdisp .d'),cur=0,tt;
    function set(i){if(i===cur)return;var up=i>cur;cur=i;d.style.setProperty('--n',i);
      li.forEach(function(x,j){x.classList.toggle('act',j===i)});
      U.classList.toggle('on',up);D.classList.toggle('on',!up);clearTimeout(tt);tt=setTimeout(function(){U.classList.remove('on');D.classList.remove('on')},800)}
    li[0].classList.add('act');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)set(li.indexOf(e.target))})},{rootMargin:'-48% 0px -48% 0px'});
    li.forEach(function(x){io.observe(x)});
  })();

  /* ---------- 4 · Design / Code ---------- */
  (function(){
    var sw=document.querySelector('.stsw'),v=document.querySelector('.stdv');if(!sw||!v)return;
    var B=[].slice.call(sw.querySelectorAll('button'));
    function pick(b,focus){B.forEach(function(x){var on=x===b;x.setAttribute('aria-checked',on);x.tabIndex=on?0:-1});v.dataset.v=b.dataset.v;if(focus)b.focus()}
    B.forEach(function(b,i){b.addEventListener('click',function(){pick(b)});
      b.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'||e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();pick(B[(i+1)%B.length],true)}})});
  })();
})();
