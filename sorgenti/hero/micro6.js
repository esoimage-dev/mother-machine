var NS='http://www.w3.org/2000/svg',EZ='cubic-bezier(.65,0,.35,1)',ANIMS=[];
function el(p,tag,a,txt){var e=document.createElementNS(NS,tag);for(var k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;p.appendChild(e);return e}
function tl(e,fr,D){var kf=fr.map(function(f){var o=Object.assign({},f[1]);o.offset=f[0];o.easing=o.easing||EZ;return o});
  /* every property is held between keyframes: fill gaps with the last known value, and back-fill the start */
  var props={};kf.forEach(function(k){for(var p in k)if(p!=='offset'&&p!=='easing')props[p]=1});
  Object.keys(props).forEach(function(p){var last;for(var i=0;i<kf.length;i++){if(kf[i][p]!==undefined)last=kf[i][p];else if(last!==undefined)kf[i][p]=last}
    var first;for(var j=0;j<kf.length;j++){if(kf[j][p]!==undefined){first=kf[j][p];break}}if(p==='opacity')first=1;for(var m=0;m<kf.length&&kf[m][p]===undefined;m++)kf[m][p]=first});var a=e.animate(kf,{duration:D,iterations:Infinity});ANIMS.push([a,D]);return a}
function show(e,a,b,c,d,D,extra){/* opacity 0 until a, 1 from b to c, 0 from d */var f=[[0,{opacity:0}],[a,{opacity:0}],[b,{opacity:1}],[c,{opacity:1}],[d,{opacity:0}],[1,{opacity:0}]];return tl(e,f,D)}
function draw(e,a,b,D){e.setAttribute('pathLength','1');e.style.strokeDasharray='1';return tl(e,[[0,{strokeDashoffset:1}],[a,{strokeDashoffset:1}],[b,{strokeDashoffset:0}],[1,{strokeDashoffset:0}]],D)}
var FONT='font-family:\'Hanken Grotesk\',system-ui,sans-serif';var MONO='font-family:\'DM Mono\',monospace';
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){
/* ===== six service animations, v4: the first set, rebuilt on one grammar =====
   grammar: tinted background per service, one white object at the centre, ink + one accent + grey,
   corners 8, the same skeleton lines for interfaces, a state label bottom left that changes
   from the starting state to the result, the same three easings, the same loop (build, act, result, hold, fade). */
var SP='cubic-bezier(.34,1.56,.64,1)',OQ='cubic-bezier(.22,1,.36,1)',IQ='cubic-bezier(.55,0,.75,.06)',LIN='linear';
var INK='#121211',GR='#E6E3DC',WH='#FFFFFF';
function G(p,a){return el(p,'g',a||{})}
function T(x,y,s){return {transform:'translate('+x+'px,'+y+'px)'+(s!=null?' scale('+s+')':'')}}
function O(o,x){var r=Object.assign({},x||{});r.opacity=o;return r}
function E(o,ez){var r=Object.assign({},o);r.easing=ez;return r}
function fb(e){e.style.transformBox='fill-box';e.style.transformOrigin='center';return e}
function vb(e,ox,oy){e.style.transformBox='view-box';e.style.transformOrigin=ox+'px '+oy+'px';return e}
function card(p,x,y,w,h,f){return el(p,'rect',{x:x,y:y,width:w,height:h,rx:8,fill:f||WH})}
function bar(p,x,y,w,f){return el(p,'rect',{x:x,y:y,width:w,height:5,rx:2.5,fill:f||GR})}
function states(s,list,D,col){/* list: [[text,from,to],...] */list.forEach(function(it,i){var t=el(s,'text',{x:20,y:184,fill:col||INK,'fill-opacity':.55,style:MONO+';font-size:9px;letter-spacing:.12em'},it[0]);
  var a=it[1],b=it[2];var fr=[[0,{opacity:a===0?1:0}]];if(a>0){fr.push([a-.02,{opacity:0}]);fr.push([a+.02,{opacity:1}])}fr.push([b-.02,{opacity:1}]);fr.push([b+.02,{opacity:0}]);fr.push([1,{opacity:i===0?1:0}]);
  if(i===0){fr=[[0,{opacity:1}],[b-.02,{opacity:1}],[b+.02,{opacity:0}],[.95,{opacity:0}],[1,{opacity:1}]]}tl(t,fr,D)})}
function fadeOut(s,bg,D){var c=el(s,'rect',{width:320,height:200,fill:bg,opacity:0});tl(c,[[0,{opacity:1}],[.03,{opacity:0}],[.92,{opacity:0}],[.975,{opacity:1}],[1,{opacity:1}]],D);return c}
function arrow(p){var g=G(p,{});var a=G(g,{});el(a,'path',{d:'M0 0V16l4.4-4 2.8 6.6 2.6-1.1-2.8-6.5H12.5Z',fill:INK,stroke:WH,'stroke-width':1.3,'stroke-linejoin':'round'});vb(a,0,0);return {g:g,a:a}}
function micro(id,bg,fn){var s=$(id);if(!s)return;s.setAttribute('viewBox','0 0 320 200');var b=el(s,'rect',{width:320,height:200,fill:bg});fn(s,b)}

/* 1 · Brand identity: a mark called "brand" is constructed, locked up with its name, then carried onto everything */
micro('mi1','#E9EEFF',function(s){var D=9000,AC='#2E5BFF',MV='cubic-bezier(.65,0,.35,1)';
  function mark(p,col,dot){var g=G(p,{});vb(g,0,0);return {g:g,s:el(g,'path',{d:'M-23 -28V28.5',fill:'none',stroke:col,'stroke-width':9}),r:el(g,'path',{d:'M-23 8A16 16 0 1 1 9 8A16 16 0 1 1 -23 8',fill:'none',stroke:col,'stroke-width':9}),d:el(g,'circle',{cx:20.5,cy:24,r:4.6,fill:dot})}}
  // three different places the brand will live: a website, a shopping bag, a t-shirt
  var ob=[];
  var c1=G(s,{}),c1i=fb(G(c1,{}));el(c1i,'rect',{x:36,y:100,width:84,height:56,rx:5,fill:WH});el(c1i,'path',{d:'M36 109V105a5 5 0 0 1 5-5h74a5 5 0 0 1 5 5v4Z',fill:GR});
  [0,1,2].forEach(function(i){el(c1i,'circle',{cx:42+i*4.5,cy:104.5,r:1.4,fill:INK,'fill-opacity':.35})});
  [0,1,2].forEach(function(i){el(c1i,'rect',{x:88+i*9,y:116,width:6,height:2.5,rx:1.25,fill:INK,'fill-opacity':.35})});el(c1i,'rect',{x:36,y:124,width:84,height:1,fill:GR});
  bar(c1i,46,133,44,INK);bar(c1i,46,142,30);el(c1i,'rect',{x:46,y:149,width:16,height:5,rx:2.5,fill:AC});ob.push([c1,c1i]);
  var c2=G(s,{}),c2i=fb(G(c2,{}));el(c2i,'path',{d:'M151 113v-6a9 9 0 0 1 18 0v6',fill:'none',stroke:INK,'stroke-width':2,'stroke-linecap':'round'});el(c2i,'path',{d:'M137 112h46l2 44h-50Z',fill:INK,stroke:INK,'stroke-width':2,'stroke-linejoin':'round'});
  el(c2i,'rect',{x:136,y:118,width:48,height:1.5,fill:'#3A3936'});el(c2i,'circle',{cx:151,cy:115,r:1.3,fill:'#3A3936'});el(c2i,'circle',{cx:169,cy:115,r:1.3,fill:'#3A3936'});ob.push([c2,c2i]);
  var c3=G(s,{}),c3i=fb(G(c3,{}));el(c3i,'path',{d:'M224 100L212 104L204 118L214 123L218 117V156H262V117L266 123L276 118L268 104L256 100Q240 111 224 100Z',fill:AC,stroke:AC,'stroke-width':2,'stroke-linejoin':'round'});ob.push([c3,c3i]);
  /* targets: x, y, scale, launch, stem colour, dot colour */
  var TG=[[47,117,.17,.56,AC,INK],[160,134,.3,.62,WH,AC],[250,119,.14,.68,WH,INK]];
  ob.forEach(function(o,n){var t=.44+n*.03,L=TG[n][3]+.07;
    tl(o[0],[[0,O(0,T(0,14))],[t,E(O(0,T(0,14)),SP)],[t+.08,O(1,T(0,0))],[1,O(1,T(0,0))]],D);
    tl(o[1],[[0,{transform:'scale(1)'}],[L,E({transform:'scale(1)'},OQ)],[L+.012,E({transform:'scale(.96)'},SP)],[L+.06,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D)});
  // construction guides: ascender, x-height, baseline, bowl, stem
  var gd=G(s,{}),gs={fill:'none',stroke:INK,'stroke-opacity':.3,'stroke-width':1,'stroke-dasharray':'2 3'};
  [39.6,65.6,113].forEach(function(y){el(gd,'line',Object.assign({x1:100,y1:y,x2:220,y2:y},gs))});el(gd,'line',Object.assign({x1:130.1,y1:28,x2:130.1,y2:124},gs));el(gd,'circle',Object.assign({cx:150.9,cy:86.4,r:20.8},gs));
  tl(gd,[[0,{opacity:0}],[.02,{opacity:0}],[.07,{opacity:1}],[.24,{opacity:1}],[.3,{opacity:0}],[1,{opacity:0}]],D);
  // the mark and its name
  var Wd=G(s,{});vb(Wd,0,0);var wt=el(Wd,'text',{x:0,y:0,fill:INK,style:FONT+';font-weight:800;font-size:30px;letter-spacing:-.05em'},'brand');var w=80;try{w=wt.getBBox().width}catch(e){}
  var tot=27.4+10+w,x0=160-tot/2,MX=x0+14.3,TX=MX+13.1+10;
  var M=G(s,{});vb(M,0,0);var Mi=mark(M,AC,INK);
  tl(M,[[0,T(160,76,1.3)],[.4,E(T(160,76,1.3),MV)],[.5,T(MX,40,.52)],[1,T(MX,40,.52)]],D);
  tl(Wd,[[0,T(160-w*.35,146,.7)],[.37,E(T(160-w*.35,146,.7),MV)],[.42,O(0,T(160-w*.35,140,.7))],[.48,E(O(0,T(TX-6,54.8,1)),OQ)],[.55,O(1,T(TX,54.8,1))],[1,O(1,T(TX,54.8,1))]],D);
  draw(Mi.s,.06,.12,D);draw(Mi.r,.11,.22,D);fb(Mi.d);tl(Mi.d,[[0,{transform:'scale(0)'}],[.21,E({transform:'scale(0)'},SP)],[.26,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D);
  tl(wt,[[0,{clipPath:'inset(-30% 100% -30% 0)'}],[.27,E({clipPath:'inset(-30% 100% -30% 0)'},OQ)],[.35,{clipPath:'inset(-30% 0% -30% 0)'}],[1,{clipPath:'inset(-30% 0% -30% 0)'}]],D);
  var pr=[[0,{transform:'scale(1)'}]];TG.forEach(function(t){pr.push([t[3]-.008,E({transform:'scale(1)'},OQ)]);pr.push([t[3],E({transform:'scale(.92)'},SP)]);pr.push([t[3]+.025,{transform:'scale(1)'}])});pr.push([1,{transform:'scale(1)'}]);tl(Mi.g,pr,D);
  // identical copies peel off the mark and land on each touchpoint, in its colours
  TG.forEach(function(t){var g=G(s,{});vb(g,0,0);var gi=G(g,{});vb(gi,0,0);var cm=mark(gi,AC,INK);
    var mx=MX+(t[0]-MX)*.55,my=40+(t[1]-40)*.25,km=(.52+t[2])/2,st=T(MX,40,.52);
    tl(g,[[0,O(0,st)],[t[3]-.002,O(0,st)],[t[3],E(O(1,st),'cubic-bezier(.3,0,.6,1)')],[t[3]+.035,E(T(mx,my,km),OQ)],[t[3]+.07,T(t[0],t[1],t[2])],[1,T(t[0],t[1],t[2])]],D);
    tl(gi,[[0,{transform:'scale(1)'}],[t[3]+.05,E({transform:'scale(1)'},OQ)],[t[3]+.068,E({transform:'scale(1.08)'},SP)],[t[3]+.11,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D);
    if(t[4]!==AC)[cm.s,cm.r].forEach(function(e){tl(e,[[0,{stroke:AC}],[t[3]+.035,{stroke:AC}],[t[3]+.06,{stroke:t[4]}],[1,{stroke:t[4]}]],D)});
    if(t[5]!==INK)tl(cm.d,[[0,{fill:INK}],[t[3]+.035,{fill:INK}],[t[3]+.06,{fill:t[5]}],[1,{fill:t[5]}]],D)});
  states(s,[['SKETCH',0,.24],['MARK',.24,.5],['IDENTITY',.5,.95]],D);fadeOut(s,'#E9EEFF',D)});

/* 2 · Custom software: the terminal stays, one line builds anything. Three takes: in 3D, vision, voice (the game is a spare take) */
micro('mi2','#FFEDE6',function(s){var D=22500,AC='#FF6A3D',BGc='#FFEDE6',PE='#FFD3C2',TX='#F4F1EC',DIM='#8C887F';
  function A(k,u){return (k+u)/3}
  // the terminal never leaves
  el(s,'rect',{x:24,y:50,width:150,height:100,rx:10,fill:INK});[0,1,2].forEach(function(i){el(s,'circle',{cx:38+i*9,cy:62,r:3,fill:i===0?AC:'#3A3936'})});
  el(s,'text',{x:162,y:64.5,'text-anchor':'end',fill:'#6E6A63',style:MONO+';font-size:7px;letter-spacing:.04em'},'~/mother-machine');
  el(s,'rect',{x:24,y:72,width:150,height:1,fill:'#2A2927'});
  el(s,'text',{x:38,y:92,fill:AC,style:MONO+';font-size:13px'},'$');
  /* one clock for everything: terminal, cursor, label and objects are all drawn in the same frame */
  function xo(q){var a=sg(q,.9,.965);return 1-a*a*(3-2*a)}
  function sm(x){return x*x*(3-2*x)}
  var TK=[['in 3D ↵','0.84s','IT BUILDS'],['vision ↵','1.12s','IT SEES'],['voice ↵','0.42s','IT LISTENS']];
  function term(){var g=G(s,{}),o={g:g,l1:el(g,'text',{x:50,y:92,fill:TX,style:MONO+';font-size:13px'},''),l2:el(g,'text',{x:38,y:110,fill:DIM,style:MONO+';font-size:11px'},''),cells:[],fills:[]};
    for(var i=0;i<12;i++){o.cells.push(el(g,'rect',{x:38+i*7,y:124,width:5,height:6,rx:1,fill:'#3A3936'}));o.fills.push(el(g,'rect',{x:38+i*7,y:124,width:5,height:6,rx:1,fill:AC}))}
    o.ok=el(g,'text',{x:126,y:130,fill:DIM,style:MONO+';font-size:8px'});el(o.ok,'tspan',{fill:AC},'OK ');o.o2=el(o.ok,'tspan',{},'');return o}
  var TA=term(),TB=term(),cr=el(s,'rect',{x:0,y:0,width:7,height:13,fill:AC}),lab=el(s,'text',{x:20,y:184,fill:INK,'fill-opacity':.55,style:MONO+';font-size:9px;letter-spacing:.12em'},'');
  /* take timeline (u from 0 to 1, 7.5 s): old text leaves 0-.035, type .03-.15, argument .15-.2, enter at .2, progress .21-.28, result from .22 */
  function paint(o,k,u){var tk=TK[k],n1=Math.floor(13*sg(u,.03,.15)+1e-6),n2=Math.floor(tk[0].length*sg(u,.15,.2)+1e-6),nf=Math.floor(12*sg(u,.21,.28)+1e-6);
    o.l1.textContent='machine build'.slice(0,n1);o.l2.textContent=tk[0].slice(0,n2);
    o.cells.forEach(function(c){c.setAttribute('opacity',u>=.2?1:0)});o.fills.forEach(function(f,i){f.setAttribute('opacity',i<nf?1:0)});
    o.o2.textContent=tk[1];o.ok.setAttribute('opacity',u>=.285?1:0);return {n1:n1,n2:n2}}
  // take one: the cube (unchanged)
  var cg=G(s,{}),V=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],EDG=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  var FC=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,3,7,4]];
  var faces=FC.map(function(){return el(cg,'path',{d:'',fill:WH,stroke:'none'})}),edges=EDG.map(function(){return el(cg,'line',{stroke:INK,'stroke-width':2.5,'stroke-linecap':'round'})});
  // take two: a tiny platform game
  var gg=G(s,{opacity:0,transform:'translate(244 100) scale(1.12) translate(-244 -100)'});
  var gnd=el(gg,'line',{x1:188,y1:142,x2:188,y2:142,stroke:INK,'stroke-width':2.5,'stroke-linecap':'round'});
  var pA=el(gg,'rect',{x:214,y:116,width:26,height:8,rx:2,fill:WH,stroke:INK,'stroke-width':2.5}),pB=el(gg,'rect',{x:248,y:92,width:26,height:8,rx:2,fill:WH,stroke:INK,'stroke-width':2.5});
  var coin=G(gg,{});el(coin,'circle',{cx:0,cy:0,r:5.5,fill:PE,stroke:INK,'stroke-width':2});el(coin,'rect',{x:-.9,y:-2.6,width:1.8,height:5.2,rx:.9,fill:INK});
  var sc0=el(gg,'text',{x:190,y:44,fill:INK,'fill-opacity':.6,style:MONO+';font-size:9px;letter-spacing:.12em'},'SCORE 0'),sc1=el(gg,'text',{x:190,y:44,fill:INK,style:MONO+';font-size:9px;letter-spacing:.12em'},'SCORE 1');
  var plus=el(gg,'text',{x:0,y:0,'text-anchor':'middle',fill:AC,style:MONO+';font-size:10px;font-weight:700'},'+1');
  var hero=G(gg,{});el(hero,'rect',{x:-7,y:-7,width:14,height:14,rx:3,fill:AC});el(hero,'rect',{x:1.4,y:-3.6,width:2.6,height:2.6,rx:.6,fill:INK});
  function cl(x){return x<0?0:x>1?1:x}function sg(q,a,b){return cl((q-a)/(b-a))}function eo(t){return 1-Math.pow(1-t,3)}function eb(t){var c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)}
  function pop(e,cx,cy,k){e.setAttribute('transform','translate('+cx+' '+cy+') scale('+k.toFixed(3)+') translate('+(-cx)+' '+(-cy)+')')}
  var J=[[.64,.70,198,134,227,108,22],[.73,.79,227,108,261,84,22],[.82,.88,261,84,290,134,45]],LAND=[.58,.70,.79,.88],TC=.82+.06*.361;
  function game(q){gg.setAttribute('opacity',xo(q).toFixed(3));
    gnd.setAttribute('x2',(188+110*eo(sg(q,.36,.46))).toFixed(1));gnd.setAttribute('opacity',q>.36?1:0);
    pop(pA,227,120,eb(sg(q,.42,.5)));pop(pB,261,96,eb(sg(q,.45,.53)));
    var ck=eb(sg(q,.48,.56)),cy=60+Math.sin(q*60)*1.5,got=q>TC?sg(q,TC,TC+.03):0;
    coin.setAttribute('transform','translate(272 '+cy.toFixed(2)+') scale('+(ck*(1+got*.6)).toFixed(3)+')');coin.setAttribute('opacity',(1-got).toFixed(3));
    var sv=sg(q,.44,.48);sc0.setAttribute('opacity',(q<TC?sv:0).toFixed(3));sc1.setAttribute('opacity',q<TC?0:1);pop(sc1,190,41,q<TC?1:1+.15*(1-eo(sg(q,TC,TC+.05))));
    var pf=q>TC?sg(q,TC,TC+.07):0;plus.setAttribute('x',272);plus.setAttribute('y',(50-16*eo(pf)).toFixed(1));plus.setAttribute('opacity',q>TC?(1-pf).toFixed(3):0);
    var x=198,y=134,sx=1,sy=1,vis=q>=.52?1:0;
    if(q<.57){var t=sg(q,.52,.57);y=40+94*t*t;sx=.9;sy=1.12}
    J.forEach(function(j){if(q>=j[1])x=j[4],y=j[5];if(q>=j[0]&&q<j[1]){var t=(q-j[0])/(j[1]-j[0]);x=j[2]+(j[4]-j[2])*t;y=j[3]+(j[5]-j[3])*t-4*j[6]*t*(1-t);sx=.92;sy=1.1}
      if(q>=j[0]-.02&&q<j[0]){var a=(q-(j[0]-.02))/.02;sx=1+.15*a;sy=1-.15*a}});
    LAND.forEach(function(L){if(q>=L&&q<L+.03){var a=1-(q-L)/.03;sx=1+.25*a;sy=1-.25*a}});
    hero.setAttribute('opacity',vis);hero.setAttribute('transform','translate('+x.toFixed(1)+' '+(y+7).toFixed(1)+') scale('+sx.toFixed(3)+' '+sy.toFixed(3)+') translate(0 -7)')}
  // take two: computer vision, it finds and counts what is in a photo
  var vg=G(s,{opacity:0}),vc=el(s,'clipPath',{id:'mi2v'});el(vc,'rect',{x:182,y:58,width:116,height:84,rx:8});
  var vcard=el(vg,'rect',{x:182,y:58,width:116,height:84,rx:8,fill:WH}),ph=G(vg,{});
  el(ph,'rect',{x:203,y:89,width:6,height:10,fill:WH,stroke:INK,'stroke-width':2});el(ph,'rect',{x:202,y:85,width:8,height:4.5,rx:1,fill:INK});el(ph,'rect',{x:199,y:97,width:14,height:31,rx:4,fill:WH,stroke:INK,'stroke-width':2});el(ph,'rect',{x:200,y:108,width:12,height:9,fill:AC});
  el(ph,'rect',{x:227,y:104,width:26,height:24,rx:2,fill:PE,stroke:INK,'stroke-width':2});el(ph,'line',{x1:227,y1:111,x2:253,y2:111,stroke:INK,'stroke-width':1.5});el(ph,'rect',{x:237,y:104,width:6,height:7,fill:'#FFB79E'});el(ph,'rect',{x:227,y:104,width:26,height:24,rx:2,fill:'none',stroke:INK,'stroke-width':2});
  el(ph,'path',{d:'M266 104q-2.2-3 0-6M272 104q-2.2-3 0-6',fill:'none',stroke:INK,'stroke-opacity':.35,'stroke-width':1.5,'stroke-linecap':'round'});
  el(ph,'path',{d:'M279 114.5h2.5a4.5 4.5 0 0 1 0 9H279',fill:'none',stroke:INK,'stroke-width':2});el(ph,'path',{d:'M261 110h18v13a5 5 0 0 1-5 5h-8a5 5 0 0 1-5-5Z',fill:AC,stroke:INK,'stroke-width':2,'stroke-linejoin':'round'});
  el(ph,'line',{x1:190,y1:128,x2:290,y2:128,stroke:INK,'stroke-width':2,'stroke-linecap':'round'});
  var scan=G(vg,{'clip-path':'url(#mi2v)'}),band=el(scan,'rect',{x:182,y:0,width:116,height:18,fill:AC,'fill-opacity':.14}),sl=el(scan,'rect',{x:182,y:0,width:116,height:1.5,fill:AC});
  var BX=[[197,82,18,48,40,'bottle 95%',.5],[224,101,32,29,34,'box 98%',.55],[258,95,31,35,30,'cup 97%',.6]].map(function(b){var g=G(vg,{});el(g,'rect',{x:b[0],y:b[1],width:b[2],height:b[3],rx:2,fill:AC,'fill-opacity':.07,stroke:AC,'stroke-width':1.5});
    var tg=G(g,{}),tr=el(tg,'rect',{x:b[0]-.75,y:b[1]-9,width:b[4],height:9,rx:1.5,fill:AC}),tx=el(tg,'text',{x:b[0]+2.5,y:b[1]-2.5,fill:WH,style:MONO+';font-size:6px'},b[5]);try{tr.setAttribute('width',(tx.getBBox().width+6).toFixed(1))}catch(e){}return {g:g,tg:tg,b:b}});
  var cnt=el(vg,'text',{x:184,y:44,fill:INK,'fill-opacity':.6,style:MONO+';font-size:9px;letter-spacing:.12em'},'DETECTED 0');
  function vision(q,al){vg.setAttribute('opacity',al.toFixed(3));
    var ck=eb(sg(q,.3,.37)),co=sg(q,.3,.33);pop(vcard,240,100,ck);pop(ph,240,100,ck);vcard.setAttribute('opacity',co);ph.setAttribute('opacity',co);
    var sv=sg(q,.38,.49),y=58+86*sv;sl.setAttribute('y',y.toFixed(1));band.setAttribute('y',(y-18).toFixed(1));scan.setAttribute('opacity',q>.38&&q<.5?1:0);
    var n=0;BX.forEach(function(o){var a=sg(q,o.b[6],o.b[6]+.04);if(q>=o.b[6])n++;o.g.setAttribute('opacity',Math.min(1,a*3).toFixed(3));pop(o.g,o.b[0]+o.b[2]/2,o.b[1]+o.b[3]/2,1.2-.2*eo(a));o.tg.setAttribute('opacity',sg(q,o.b[6]+.02,o.b[6]+.05).toFixed(3))});
    cnt.textContent='DETECTED '+n;cnt.setAttribute('opacity',sg(q,.36,.4).toFixed(3))}
  // take three: voice, it listens and then it acts
  var wg=G(s,{opacity:0}),wcard=el(wg,'rect',{x:182,y:58,width:116,height:84,rx:8,fill:WH}),wi=G(wg,{});
  var ring=el(wi,'circle',{cx:198,cy:80,r:8,fill:'none',stroke:AC,'stroke-width':1.5}),mic=G(wi,{});el(mic,'circle',{cx:198,cy:80,r:8,fill:AC});el(mic,'rect',{x:196,y:75,width:4,height:7,rx:2,fill:WH});el(mic,'path',{d:'M194.5 80.5a3.5 3.5 0 0 0 7 0M198 84v2',fill:'none',stroke:WH,'stroke-width':1.2,'stroke-linecap':'round'});
  var NB=18,bars=[];for(var i=0;i<NB;i++)bars.push(el(wi,'rect',{x:213+i*4.3,y:79,width:2.6,height:2,rx:1.3,fill:INK}));
  var SAY='"table for 4, friday 8pm"',said=el(wi,'text',{x:190,y:104,fill:INK,style:MONO+';font-size:6.6px'},'');
  var chip=G(wg,{});el(chip,'rect',{x:190,y:112,width:100,height:22,rx:6,fill:PE});el(chip,'rect',{x:197,y:117,width:12,height:12,rx:2,fill:WH,stroke:INK,'stroke-width':1.5});el(chip,'rect',{x:197,y:117,width:12,height:3.5,rx:1,fill:INK});
  el(chip,'text',{x:215,y:122.5,fill:INK,style:MONO+';font-size:7px;letter-spacing:.06em'},'FRI · 20:00');el(chip,'text',{x:215,y:130.5,fill:INK,'fill-opacity':.6,style:FONT+';font-size:7px;font-weight:600'},'Table for 4');
  var chk=G(wg,{});el(chk,'circle',{cx:278,cy:123,r:6,fill:AC});el(chk,'path',{d:'M275.3 123.2l1.9 1.9 3.6-3.8',fill:'none',stroke:WH,'stroke-width':1.6,'stroke-linecap':'round','stroke-linejoin':'round'});
  var wst=el(wg,'text',{x:184,y:44,fill:INK,'fill-opacity':.6,style:MONO+';font-size:9px;letter-spacing:.12em'},'');
  function voice(q,al){wg.setAttribute('opacity',al.toFixed(3));
    var ck=eb(sg(q,.3,.37)),co=sg(q,.3,.33);pop(wcard,240,100,ck);pop(wi,240,100,ck);wcard.setAttribute('opacity',co);wi.setAttribute('opacity',co);
    var amp=sg(q,.37,.41)*(1-sg(q,.56,.6));
    bars.forEach(function(b,i){var bell=.45+.55*Math.sin(Math.PI*i/(NB-1)),n=Math.abs(Math.sin(i*1.7+q*95+Math.sin(i*.9+q*43)*2)),h=2+amp*bell*(.3+.7*n)*20;b.setAttribute('y',(80-h/2).toFixed(2));b.setAttribute('height',h.toFixed(2))});
    var pr=(q*12)%1,lis=q>.37&&q<.6;ring.setAttribute('r',(8+7*pr).toFixed(2));ring.setAttribute('opacity',lis?(1-pr)*.8:0);
    said.textContent=SAY.slice(0,Math.round(SAY.length*sg(q,.42,.58)));
    var c=sg(q,.61,.67);chip.setAttribute('opacity',c.toFixed(3));chip.setAttribute('transform','translate(0 '+(8*(1-eo(c))).toFixed(2)+')');
    pop(chk,278,123,eb(sg(q,.67,.72)));chk.setAttribute('opacity',q>.67?1:0);
    wst.textContent=q<.6?'LISTENING':'BOOKED';wst.setAttribute('opacity',(q<.6?sg(q,.36,.4)*(.55+.45*Math.abs(Math.cos(q*40))):sg(q,.6,.63)).toFixed(3))}
  var t0=performance.now();
  function frame(now){var P=(window.__mmP!=null)?window.__mmP:((((now-t0)%D)+D)%D/D);if(reduce&&window.__mmP==null)P=.8/3;
    var k=Math.max(0,Math.min(2,Math.floor(P*3))),u=P*3-k,pk=(k+2)%3,tsec=u*D/3000;
    // terminal: the last command scrolls away, the new one is typed
    var x=sm(sg(u,0,.035));paint(TB,pk,2);TB.g.setAttribute('opacity',(1-x).toFixed(3));TB.g.setAttribute('transform','translate(0 '+(-10*x).toFixed(2)+')');
    var st=paint(TA,k,u),cx,cy;if(u<.15){cx=51+(st.n1?TA.l1.getComputedTextLength():0);cy=81}else{cx=39+(st.n2?TA.l2.getComputedTextLength():0);cy=99}
    var blink=Math.floor(tsec/.45)%2===0,typing=u>=.03&&u<.2;cr.setAttribute('transform','translate('+cx.toFixed(1)+' '+cy+')');cr.setAttribute('opacity',(u<.035||u>=.27)?0:(typing||blink?1:0));
    // state label
    var d=Math.min(Math.abs(u-.2),u,1-u);lab.textContent=u<.2?'WRITING CODE':TK[k][2];lab.setAttribute('opacity',Math.min(1,d/.012).toFixed(3));
    // objects: the last result stays until enter is pressed, then hands over to the new one
    cg.setAttribute('opacity',0);vg.setAttribute('opacity',0);gg.setAttribute('opacity',0);wg.setAttribute('opacity',0);
    var TK3=[cube,vision,voice],GR3=[cg,vg,wg],pa=1-sm(sg(u,.2,.25));GR3.forEach(function(g){g.removeAttribute('transform')});
    if(pa>0){TK3[pk](1.08+u,pa);GR3[pk].setAttribute('transform','translate(240 100) scale('+(1-.05*(1-pa)).toFixed(4)+') translate(-240 -100)')}
    TK3[k](u+.08,1);/* game(u) is a spare take */
    if(!reduce||window.__mmP!=null)requestAnimationFrame(frame)}
  function cube(p,al){
    var a=(p*Math.PI*2*1.5)+.6,tx=.55,cx=240,cy=100,S=30;
    var P=V.map(function(v){var x=v[0]*Math.cos(a)+v[2]*Math.sin(a),z=-v[0]*Math.sin(a)+v[2]*Math.cos(a),y=v[1];var y2=y*Math.cos(tx)-z*Math.sin(tx),z2=y*Math.sin(tx)+z*Math.cos(tx);return [cx+x*S,cy+y2*S,z2]});
    var draw=Math.max(0,Math.min(1,(p-.32)/.16)),fill=Math.max(0,Math.min(1,(p-.5)/.08)),out=al,inn=p<.3?0:1;
    cg.setAttribute('opacity',(inn*out).toFixed(3));
    EDG.forEach(function(e,i){var A=P[e[0]],B=P[e[1]];var k=Math.max(0,Math.min(1,draw*12-i));var L=edges[i];L.setAttribute('x1',A[0]);L.setAttribute('y1',A[1]);L.setAttribute('x2',A[0]+(B[0]-A[0])*k);L.setAttribute('y2',A[1]+(B[1]-A[1])*k);L.setAttribute('opacity',k>0?1:0)});
    var order=FC.map(function(f,i){var z=f.reduce(function(s,j){return s+P[j][2]},0)/4;return [z,i]}).sort(function(m,n){return n[0]-m[0]});
    order.forEach(function(o,rank){var f=FC[o[1]],pt=f.map(function(j){return P[j][0].toFixed(1)+' '+P[j][1].toFixed(1)});var el2=faces[o[1]];el2.setAttribute('d','M'+pt.join('L')+'Z');
      var col=o[1]===2||o[1]===3?AC:(o[1]===0||o[1]===1?PE:WH);el2.setAttribute('fill',col);el2.setAttribute('opacity',(fill*(rank>=3?1:0)).toFixed(3));cg.appendChild(el2)});
    var vis={};order.forEach(function(o,rank){if(rank>=3){var f=FC[o[1]];for(var q=0;q<4;q++){var u=f[q],w=f[(q+1)%4];vis[Math.min(u,w)+'-'+Math.max(u,w)]=1}}});
    EDG.forEach(function(e,i){var key=Math.min(e[0],e[1])+'-'+Math.max(e[0],e[1]);if(!vis[key]){var L=edges[i];var cur=parseFloat(L.getAttribute('opacity'))||0;L.setAttribute('opacity',(cur*(1-fill)).toFixed(3))}});
    edges.forEach(function(L){cg.appendChild(L)})}
  requestAnimationFrame(frame);
});

/* 3 · Apps: wireframe, design, live */
micro('mi3','#E4F4EC',function(s){var D=8000,AC='#1F9D6B';
  el(s,'rect',{x:124,y:24,width:72,height:152,rx:15,fill:INK});el(s,'rect',{x:129,y:29,width:62,height:142,rx:11,fill:WH});el(s,'rect',{x:150,y:33,width:20,height:4,rx:2,fill:INK});
  var parts=[[135,46,50,10,'#CDEBDC'],[135,62,50,40,AC],[135,110,40,5,GR],[135,119,28,5,GR],[135,146,50,16,INK]];
  parts.forEach(function(p,i){var r=el(s,'rect',{x:p[0],y:p[1],width:p[2],height:p[3],rx:p[3]>8?4:2.5,fill:p[4],stroke:INK,'stroke-width':1.2,'stroke-dasharray':'3 3'});
    tl(r,[[0,{opacity:0,fillOpacity:0,strokeOpacity:.45}],[.04+i*.035,{opacity:0}],[.08+i*.035,{opacity:1}],[.3+i*.02,E({fillOpacity:0,strokeOpacity:.45},OQ)],[.38+i*.02,{fillOpacity:1,strokeOpacity:0}],[1,{opacity:1,fillOpacity:1,strokeOpacity:0}]],D)});
  var sun=fb(el(s,'circle',{cx:170,cy:76,r:7,fill:WH}));tl(sun,[[0,O(0,{transform:'scale(0)'})],[.4,E(O(0,{transform:'scale(0)'}),SP)],[.46,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D);
  var hill=el(s,'path',{d:'M135 102l16-16 12 10 8-6 14 12Z',fill:'#16835A'});tl(hill,[[0,{opacity:0}],[.38,{opacity:0}],[.44,{opacity:1}],[1,{opacity:1}]],D);
  var bt=el(s,'text',{x:160,y:157,'text-anchor':'middle',fill:WH,style:FONT+';font-weight:700;font-size:8px'},'Book');tl(bt,[[0,{opacity:0}],[.44,{opacity:0}],[.48,{opacity:1}],[1,{opacity:1}]],D);
  var f=fb(el(s,'circle',{cx:160,cy:154,r:9,fill:'rgba(18,18,17,.22)',stroke:WH,'stroke-width':1.5}));
  tl(f,[[0,O(0,{transform:'scale(1.5)'})],[.52,E(O(0,{transform:'scale(1.5)'}),OQ)],[.57,O(1,{transform:'scale(1)'})],[.6,O(1,{transform:'scale(.82)'})],[.65,O(0,{transform:'scale(.82)'})],[1,O(0,{transform:'scale(1.5)'})]],D);
  var ok=fb(G(s,{}));el(ok,'circle',{cx:198,cy:44,r:13,fill:AC});el(ok,'path',{d:'M192 44l4.5 4.5 8-9',fill:'none',stroke:WH,'stroke-width':3});
  tl(ok,[[0,O(0,{transform:'scale(0)'})],[.6,E(O(0,{transform:'scale(0)'}),SP)],[.67,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D);
  states(s,[['WIREFRAME',0,.3],['DESIGN',.3,.58],['LIVE',.58,.95]],D);fadeOut(s,'#E4F4EC',D)});

/* 4 · Systems: four apps passing data by hand become one simple tool */
micro('mi4','#EEEAFF',function(s){var D=9000,AC='#6B4EFF';
  var P=[[80,58,'XLS','#3F8F63'],[240,58,'MAIL','#3E6BD6'],[80,142,'CAL','#E08A2E'],[240,142,'INV','#9A6BD8']];
  var W=[[0,1,'M97 58C140 30 180 86 223 58'],[2,3,'M97 142C140 170 180 114 223 142'],[0,3,'M94 70C150 96 170 104 226 130'],[1,2,'M226 70C170 96 150 104 94 130']];
  var wires=G(s,{});W.forEach(function(w,i){var p=el(wires,'path',{d:w[2],fill:'none',stroke:INK,'stroke-width':1.5,'stroke-opacity':.3,'stroke-dasharray':'2 4'});
    for(var k=0;k<2;k++){var d=el(wires,'rect',{x:-3,y:-3,width:6,height:6,rx:1.5,fill:P[w[k?1:0]][3]});d.style.offsetPath="path('"+w[2]+"')";d.style.offsetRotate='0deg';
      var st=k?'100%':'0%',en=k?'0%':'100%',o=(i*.025+k*.07);tl(d,[[0,{offsetDistance:st,opacity:0}],[o,E({offsetDistance:st,opacity:1},LIN)],[o+.2,{offsetDistance:en,opacity:1}],[o+.21,{offsetDistance:en,opacity:0}],[1,{offsetDistance:en,opacity:0}]],D)}});
  tl(wires,[[0,{opacity:1}],[.26,E({opacity:1},EZ)],[.34,{opacity:0}],[.95,{opacity:0}],[1,{opacity:1}]],D);
  var one=fb(G(s,{}));card(one,106,58,108,86);el(one,'rect',{x:106,y:58,width:108,height:16,rx:8,fill:AC});el(one,'rect',{x:106,y:66,width:108,height:8,fill:AC});el(one,'circle',{cx:116,cy:66,r:2.6,fill:WH});bar(one,124,63.5,30,'rgba(255,255,255,.7)');
  tl(one,[[0,O(0,{transform:'scale(.15)'})],[.32,E(O(0,{transform:'scale(.15)'}),OQ)],[.46,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D);
  P.forEach(function(p,i){var ry=84+i*14,tx=121,dx=tx-p[0],dy=ry+2.5-p[1];
    var g=fb(G(s,{}));el(g,'rect',{x:p[0]-17,y:p[1]-17,width:34,height:34,rx:9,fill:p[3]});var tt=el(g,'text',{x:p[0],y:p[1]+3,'text-anchor':'middle',fill:WH,style:MONO+';font-size:7.5px;letter-spacing:.04em'},p[2]);
    tl(g,[[0,O(1,{transform:'translate(0px,0px) scale(1) rotate(0deg)'})],[.06,{transform:'translate(0px,-2px) scale(1) rotate(-3deg)'}],[.12,{transform:'translate(0px,0px) scale(1) rotate(2deg)'}],[.18,{transform:'translate(0px,-1px) scale(1) rotate(-1deg)'}],[.24,{transform:'translate(0px,0px) scale(1) rotate(0deg)'}],
      [.3+i*.03,E({transform:'translate(0px,0px) scale(1) rotate(0deg)'},'cubic-bezier(.65,0,.35,1)')],[.46+i*.03,{transform:'translate('+dx+'px,'+dy+'px) scale(.29) rotate(0deg)'}],[.95,O(1,{transform:'translate('+dx+'px,'+dy+'px) scale(.29) rotate(0deg)'})],[.97,O(0,{transform:'translate('+dx+'px,'+dy+'px) scale(.29) rotate(0deg)'})],[1,O(0,{transform:'translate(0px,0px) scale(1) rotate(0deg)'})]],D);
    tl(tt,[[0,{opacity:1}],[.32+i*.03,{opacity:1}],[.38+i*.03,{opacity:0}],[.97,{opacity:0}],[1,{opacity:1}]],D);
    var lb=el(s,'text',{x:130,y:ry+5,fill:INK,style:MONO+';font-size:6.5px;letter-spacing:.06em'},p[2]);var rb=el(s,'rect',{x:152,y:ry+.5,width:i%2?30:40,height:5,rx:2.5,fill:GR});var sd=fb(el(s,'circle',{cx:202,cy:ry+3,r:3.4,fill:AC}));
    [lb,rb].forEach(function(e){tl(e,[[0,O(0,T(-6,0))],[.47+i*.03,E(O(0,T(-6,0)),OQ)],[.53+i*.03,O(1,T(0,0))],[1,O(1,T(0,0))]],D)});
    tl(sd,[[0,O(0,{transform:'scale(0)'})],[.6+i*.04,E(O(0,{transform:'scale(0)'}),SP)],[.65+i*.04,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D)});
  states(s,[['MANY TOOLS',0,.4],['ONE SYSTEM',.4,.95]],D);fadeOut(s,'#EEEAFF',D)});

/* 5 · Ecommerce: add, it flies to the cart, sales go up */
micro('mi5','#FDEBEC',function(s){var D=8000,AC='#E5484D';
  card(s,36,40,96,124);el(s,'rect',{x:44,y:48,width:80,height:62,rx:5,fill:'#F8D5D6'});el(s,'circle',{cx:84,cy:79,r:17,fill:AC});bar(s,44,118,52,INK);bar(s,44,127,30);
  var btn=fb(G(s,{}));var bR=el(btn,'rect',{x:44,y:140,width:80,height:16,rx:8,fill:INK});var t1=el(btn,'text',{x:84,y:151,'text-anchor':'middle',fill:WH,style:FONT+';font-weight:700;font-size:8px'},'Add to cart');var t2=el(btn,'text',{x:84,y:151,'text-anchor':'middle',fill:WH,style:FONT+';font-weight:700;font-size:8px'},'Added');
  tl(btn,[[0,{transform:'scale(1)'}],[.2,E({transform:'scale(1)'},OQ)],[.215,{transform:'scale(.94)'}],[.25,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D);
  tl(bR,[[0,{fill:INK}],[.21,{fill:INK}],[.23,{fill:AC}],[1,{fill:AC}]],D);tl(t1,[[0,{opacity:1}],[.21,{opacity:1}],[.23,{opacity:0}],[1,{opacity:0}]],D);tl(t2,[[0,{opacity:0}],[.21,{opacity:0}],[.23,{opacity:1}],[1,{opacity:1}]],D);
  var cart=fb(G(s,{}));el(cart,'path',{d:'M230 38h6l7 24h26l6-18h-35',fill:'none',stroke:INK,'stroke-width':3,'stroke-linejoin':'miter'});el(cart,'circle',{cx:247,cy:69,r:3,fill:INK});el(cart,'circle',{cx:265,cy:69,r:3,fill:INK});
  tl(cart,[[0,{transform:'scale(1)'}],[.36,E({transform:'scale(1)'},SP)],[.4,{transform:'scale(1.15)'}],[.46,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D);
  var bd=fb(G(s,{}));el(bd,'circle',{cx:276,cy:38,r:8,fill:AC});el(bd,'text',{x:276,y:41.5,'text-anchor':'middle',fill:WH,style:FONT+';font-weight:800;font-size:9px'},'1');
  tl(bd,[[0,O(0,{transform:'scale(0)'})],[.37,E(O(0,{transform:'scale(0)'}),SP)],[.43,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D);
  var fl=el(s,'circle',{cx:0,cy:0,r:9,fill:AC});tl(fl,[[0,O(0,T(84,79))],[.22,E(O(1,T(84,79)),'cubic-bezier(.3,0,.7,1)')],[.3,T(170,22,.75)],[.37,E(T(256,52,.4),IQ)],[.38,O(0,T(256,52,.4))],[1,O(0,T(256,52,.4))]],D);
  card(s,178,92,108,72);el(s,'text',{x:188,y:108,fill:INK,'fill-opacity':.5,style:MONO+';font-size:7px;letter-spacing:.1em'},'SALES');
  el(s,'polyline',{points:'188,150 204,144 220,147 236,136 252,139',fill:'none',stroke:INK,'stroke-width':2.5,'stroke-linejoin':'round','stroke-linecap':'round'});
  var up=el(s,'path',{d:'M252 139L272 118',fill:'none',stroke:AC,'stroke-width':2.5,'stroke-linecap':'round'});draw(up,.46,.56,D);
  var pt=fb(el(s,'circle',{cx:272,cy:118,r:4.5,fill:AC}));tl(pt,[[0,O(0,{transform:'scale(0)'})],[.55,E(O(0,{transform:'scale(0)'}),SP)],[.6,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D);
  var c=arrow(s);tl(c.g,[[0,O(0,T(150,190))],[.05,E(O(1,T(150,190)),OQ)],[.17,T(98,150)],[.2,T(98,150)],[.28,E(T(98,150),IQ)],[.36,O(0,T(150,190))],[1,O(0,T(150,190))]],D);
  tl(c.a,[[0,{transform:'scale(1)'}],[.205,{transform:'scale(1)'}],[.215,{transform:'scale(.8)'}],[.235,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D);
  states(s,[['VISIT',0,.22],['ORDER',.22,.95]],D);fadeOut(s,'#FDEBEC',D)});

/* 6 · Automation: the night does the work */
micro('mi6','#141B33',function(s,bg){var D=8500,AC='#F5B700',NI='#141B33',DAY='#FFF1D6';
  tl(bg,[[0,{fill:NI}],[.42,{fill:NI}],[.55,{fill:'#4A3F7A'}],[.62,{fill:'#F6B38A'}],[.74,{fill:DAY}],[.92,{fill:DAY}],[1,{fill:NI}]],D);
  var LT='#E9E6F5',SW=[[0,LT],[.565,LT],[.6,INK],[.92,INK],[1,LT]];var hz=el(s,'rect',{x:40,y:121,width:240,height:2.5,rx:1.25,fill:LT});tl(hz,SW.map(function(k){return [k[0],{fill:k[1]}]}),D);
  var skc=el(s,'clipPath',{id:'mi6sky'});el(skc,'rect',{x:0,y:0,width:320,height:121});var sky=G(s,{'clip-path':'url(#mi6sky)'});var body=G(sky,{});var sun=el(body,'circle',{cx:0,cy:0,r:12,fill:'#E9E6F5'});var cut=el(body,'circle',{cx:6,cy:-5,r:10,fill:NI});
  var N=10,kf=[[0,E(T(68,142),OQ)]];for(var i=0;i<=N;i++){var a=Math.PI*(1-i/N);kf.push([.05+i*(.74/N),E(T(160+Math.cos(a)*92,118-Math.sin(a)*80),LIN)])}
  kf.push([.84,E(T(252,118),IQ)]);kf.push([.9,T(252,142)]);kf.push([1,T(252,142)]);tl(body,kf,D);
  tl(sun,[[0,{fill:'#E9E6F5'}],[.4,{fill:'#E9E6F5'}],[.5,{fill:AC}],[.95,{fill:AC}],[1,{fill:'#E9E6F5'}]],D);
  tl(cut,[[0,{fill:NI}],[.42,{fill:NI}],[.55,{fill:'#4A3F7A'}],[.62,{fill:'#F6B38A'}],[1,{fill:NI}]],D);tl(cut,[[0,{opacity:1,transform:'translate(0px,0px)'}],[.4,E({opacity:1,transform:'translate(0px,0px)'},OQ)],[.5,{opacity:1,transform:'translate(15px,-13px)'}],[.53,{opacity:0,transform:'translate(15px,-13px)'}],[.97,{opacity:0,transform:'translate(0px,0px)'}],[1,{opacity:1,transform:'translate(0px,0px)'}]],D);
  [0,1,2].forEach(function(i){var x=126+i*26,y=144,t=.22+i*.18;var bx=el(s,'rect',{x:x,y:y,width:16,height:16,rx:3,fill:LT,'fill-opacity':.14,stroke:LT,'stroke-width':2.5});
    tl(bx,SW.map(function(k){return [k[0],{stroke:k[1],fill:k[1]}]}),D);
    var f=fb(G(s,{}));el(f,'rect',{x:x,y:y,width:16,height:16,rx:3,fill:AC});el(f,'path',{d:'M'+(x+4)+' '+(y+8)+'l3 3 6-6',fill:'none',stroke:INK,'stroke-width':2.5});
    tl(f,[[0,O(0,{transform:'scale(0)'})],[t,E(O(0,{transform:'scale(0)'}),SP)],[t+.06,O(1,{transform:'scale(1)'})],[.9,O(1,{transform:'scale(1)'})],[.95,O(0,{transform:'scale(.6)'})],[1,O(0,{transform:'scale(0)'})]],D)});
  var a1=el(s,'text',{x:20,y:184,fill:'#E9E6F5','fill-opacity':.6,style:MONO+';font-size:9px;letter-spacing:.12em'},'02:00 · NOBODY AWAKE');var a2=el(s,'text',{x:20,y:184,fill:INK,'fill-opacity':.6,style:MONO+';font-size:9px;letter-spacing:.12em'},'07:00 · ALL DONE');
  tl(a1,[[0,{opacity:1}],[.555,{opacity:1}],[.585,{opacity:0}],[.95,{opacity:0}],[1,{opacity:1}]],D);tl(a2,[[0,{opacity:0}],[.6,{opacity:0}],[.64,{opacity:1}],[.9,{opacity:1}],[.94,{opacity:0}],[1,{opacity:0}]],D)});

if(reduce)ANIMS.forEach(function(x){x[0].pause();x[0].currentTime=x[1]*0.88});
});