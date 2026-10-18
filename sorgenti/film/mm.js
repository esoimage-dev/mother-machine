/* ===== Mother Machine · animazione grafica, primi secondi =====
   Un solo orologio: render(t) disegna il fotogramma al tempo t. Deterministico, esportabile in video. */
var MM=(function(){
var NS='http://www.w3.org/2000/svg',XL='http://www.w3.org/1999/xlink',RUN0=9.5,INS=6.2,STK0=RUN0+5.65,STKD=5.85,OFF=RUN0+5.65+5.85-9.92,AD=15.1+RUN0+5.65+5.85-9.92,PREr=.95,G=1.2,DRIFT=.1,RAMP=.22;
/* pause di lettura: [tempo dell'animazione, secondi reali]. La velocità rallenta e riparte con una rampa morbida, mai di colpo. */
var HOLDS=[[5.3,.45],[6.3,.32],[8.92,.12],[9.48,.1],[STK0+.52,.15],[STK0+1.25,.35],[STK0+3.05,.45],[STK0+4.38,.4],[STK0+5.12,.3],[12.1+OFF,.55],[14.3+OFF,1.5]];
/* velocità a zone: l'apertura col logo gommoso va più svelta, il resto respira */
/* velocità a zone, in base a quanto c'è da leggere: [inizio, fine, fattore] (più alto = più lento) */
var ZONES=[[1.3,3.5,.9],[3.5,5.8,.85],[RUN0+3.05,RUN0+5.65,.95],[STK0,STK0+STKD,1.32],[OFF+10.0,OFF+12.25,1.3]];
function GOF(a){function sm(x){x=cl(x);return x*x*(3-2*x)}var g=1.15;ZONES.forEach(function(z){var w=sm((a-z[0])/.2)*(1-sm((a-z[1])/.2));g+=(z[2]-1.15)*w});return g}
var TB=(function(){var dt=1/240,ta=[0],x=0,a=0,k=0,st='run',hs=0,RA=.07,RR=.24;
  while(a<AD&&ta.length<90000){var w=0;
    if(st==='run'){if(k<HOLDS.length){var d=HOLDS[k][0]-a;if(d<RA){var q=cl(1-d/RA);w=q*q*(3-2*q)}if(a>=HOLDS[k][0]){st='hold';hs=x}}}
    else{var e=x-hs,H=HOLDS[k][1];if(e<H)w=1;else{var o=cl((e-H)/RR);w=1-o*o*(3-2*o);if(o>=1){st='run';k++}}}
    a+=((1/GOF(a))*(1-w)+DRIFT*w)*dt;x+=dt;ta.push(Math.min(a,AD))}return {ta:ta,dt:dt}})();
var DUR0=(TB.ta.length-1)*TB.dt+.6+PREr;
function MAP(tr){var i=tr/TB.dt,k=Math.floor(i);if(k>=TB.ta.length-1)return AD;return TB.ta[k]+(TB.ta[k+1]-TB.ta[k])*(i-k)}
var K={carta:'#F4F2EC',ink:'#141413',tomato:'#FF5B3A',cobalt:'#2D46E0',sun:'#FFC23D',mint:'#36C2A0',lilac:'#B9A6FF',mut:'#8C8A82'};
function E(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function U(id,a,p){var e=E('use',a,p);e.setAttribute('href','#'+id);e.setAttributeNS(XL,'xlink:href','#'+id);return e}
function cl(x){return x<0?0:x>1?1:x}function P(t,a,b){return cl((t-a)/(b-a))}function lerp(a,b,x){return a+(b-a)*x}
var ez={out3:function(x){return 1-Math.pow(1-x,3)},in3:function(x){return x*x*x},io3:function(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},
 back:function(x,s){s=s||1.9;var c=s+1;return 1+c*Math.pow(x-1,3)+s*Math.pow(x-1,2)},
 el:function(x){if(x===0||x===1)return x;return Math.pow(2,-9*x)*Math.sin((x*9-.75)*2*Math.PI/3)+1}};
function f(n){return (+n).toFixed(2)}
/* regole di movimento: tre durate, due curve, un rimbalzo. Tutto il resto deriva da qui. */
var D={fast:.18,med:.32,slow:.56};
function op(e,v){v=cl(v);e.setAttribute('opacity',f(v));var d=v<=.001?'none':'';if(e.style.display!==d)e.style.display=d}
/* griglia finale: 4 x 3 */
var SWAP={'#141413':'#2D46E0','#2D46E0':'#141413','#36C2A0':'#FF5B3A','#FF5B3A':'#36C2A0'};
var GX=56,GY=74,CW=360,CH=240,GG=16,MAIN=5;
function cellXY(i){return [GX+(i%4)*(CW+GG),GY+Math.floor(i/4)*(CH+GG)]}

function anchors(d){/* punti d'ancora: dove il tracciato gira */
  var n=d.match(/-?\d+(\.\d+)?/g).map(Number),pts=[];for(var i=0;i<n.length;i+=2)pts.push([n[i],n[i+1]]);
  var out=[],last=null;for(var j=1;j<pts.length-1;j++){var a=pts[j-1],b=pts[j],c=pts[j+1];
    var t1=Math.atan2(b[1]-a[1],b[0]-a[0]),t2=Math.atan2(c[1]-b[1],c[0]-b[0]),dt=Math.abs(((t2-t1)*180/Math.PI+540)%360-180);
    if(dt>32&&(!last||Math.hypot(b[0]-last[0],b[1]-last[1])>90)){out.push(b);last=b}}
  return out}

function build(host,LG){LGP=LG.parts;
  var sv=E('svg',{viewBox:'0 0 1600 900',preserveAspectRatio:'xMidYMid slice',role:'img','aria-label':'Mother Machine, animazione del logo'},host);sv.style.cssText='display:block;width:100%;height:100%';
  var df=E('defs',{},sv),A={sv:sv};
  var ht=E('pattern',{id:'ht',width:8,height:8,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},df);E('circle',{cx:4,cy:4,r:1.6,fill:K.ink,opacity:.18},ht);
  var htS=E('pattern',{id:'htS',width:70,height:70,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},df);E('circle',{cx:35,cy:35,r:21,fill:K.sun},htS);
  var htB=E('pattern',{id:'htB',width:70,height:70,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},df);A.htBc=E('circle',{cx:35,cy:35,r:24,fill:K.tomato},htB);
  var all=E('g',{id:'lgAll'},df);['fr','c1','t0','t1'].forEach(function(k){E('path',{d:LG.parts[k]},all)});
  var mOnly=E('g',{id:'lgM'},df);['fr','c1'].forEach(function(k){E('path',{d:LG.parts[k]},mOnly)});
  var mDraw=E('g',{id:'lgMd'},df);['fr','c1'].forEach(function(k){E('path',{d:LG.parts[k],pathLength:1},mDraw)});
  var htC=E('pattern',{id:'htC',width:9,height:9,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},df);E('circle',{cx:4.5,cy:4.5,r:2.2,fill:K.cobalt,opacity:.55},htC);
  var cpE0=E('clipPath',{id:'cpE0'},df);A.e0r=E('rect',{x:740,y:-1760,width:0,height:900},cpE0);
  var cpE1=E('clipPath',{id:'cpE1'},df);A.e1r=E('rect',{x:740,y:-830,width:0,height:900},cpE1);
  var cpW=E('clipPath',{id:'cpW'},df);E('rect',{x:120,y:70,width:1360,height:760,rx:22},cpW);
  /* ritagli condivisi del logo che si costruisce */
  var cpF=E('clipPath',{id:'cpF'},df);E('rect',{x:-60,y:-2000,width:800,height:2010},cpF);
  var cpT0=E('clipPath',{id:'cpT0'},df);A.t0r=E('rect',{x:740,y:-1760,width:0,height:900},cpT0);
  var cpT1=E('clipPath',{id:'cpT1'},df);A.t1r=E('rect',{x:740,y:-830,width:0,height:900},cpT1);
  var cpFl=E('clipPath',{id:'cpFl'},df);A.flC=E('circle',{cx:0,cy:0,r:0},cpFl);A.flR=E('rect',{x:0,y:0,width:0,height:0},cpFl);

  E('rect',{width:1600,height:900,fill:K.carta},sv);
  var root=sv;sv=A.cam=E('g',{},root);
  /* ---------- griglia di varianti (sotto tutto, entra alla fine) ---------- */
  A.cells=[];var cg=A.cg=E('g',{},sv);
  for(var i=0;i<12;i++){if(i===MAIN){A.cells.push(null);continue}var xy=cellXY(i);
    var g=E('g',{},cg),inner=E('g',{},g),inB=E('g',{opacity:0},g);CELL[i](inner);if(CELL2[i])CELL2[i](inB);A.cells.push({g:g,a:inner,b:CELL2[i]?inB:null,x:xy[0],y:xy[1]})}
  /* ---------- allagamento pomodoro ---------- */
  A.flood=E('g',{'clip-path':'url(#cpFl)'},sv);A.floodR=E('rect',{width:1600,height:900,fill:K.tomato},A.flood);E('rect',{width:1600,height:900,fill:'url(#ht)'},A.flood);
  A.fd=[];var fdg=A.fdg=E('g',{},sv);for(var yy=0,row=0;yy<=912;yy+=21,row++)for(var xx=(row%2)*10.5;xx<=1612;xx+=21)A.fd.push({e:E('circle',{cx:xx,cy:yy,r:0,fill:K.tomato},fdg),x:xx,y:yy,r:0});
  A.gd=[];[['baseline','0',700],['x-height','528',700-528*.36],['ascender','1468',700-1468*.36]].forEach(function(q){var g=E('g',{opacity:0},sv);
    var l=E('line',{x1:800,x2:800,y1:q[2],y2:q[2],stroke:K.cobalt,'stroke-width':1},g);var lb=txt(g,120,q[2]-9,q[0],12,K.cobalt);var vl=txt(g,1480,q[2]-9,q[1],12,K.cobalt,null,500,'end');A.gd.push({g:g,l:l,lb:lb,vl:vl})});
  A.gv=[-16,696].map(function(x){return E('line',{x1:0,x2:0,y1:0,y2:0,stroke:K.cobalt,'stroke-width':1,'stroke-dasharray':'4 5',opacity:0},sv)});
  /* ---------- il logo, due copie: inchiostro, e carta dentro l'allagamento ---------- */
  function copy(col,clip){var g=E('g',clip?{'clip-path':clip}:{},sv),x=E('g',{},g);
    var fw=E('g',{'clip-path':'url(#cpF)'},x),fr=E('path',{d:LG.parts.fr,fill:col},fw);E('path',{d:LG.parts.c1,fill:col},x);
    E('path',{d:LG.parts.t0,fill:col,'clip-path':'url(#cpT0)'},x);E('path',{d:LG.parts.t1,fill:col,'clip-path':'url(#cpT1)'},x);return {g:g,x:x,fr:fr}}
  A.ink=copy(K.ink);A.cart=copy(K.carta,'url(#cpFl)');
  /* cursori di scrittura */
  A.car0=E('rect',{x:740,y:-1640,width:64,height:640,fill:K.tomato},A.ink.x);A.car1=E('rect',{x:740,y:-700,width:64,height:640,fill:K.tomato},A.ink.x);
  /* modalità contorni */
  A.outl=E('g',{opacity:0},sv);U('lgAll',{fill:'none',stroke:K.cobalt,'stroke-width':6.5},A.outl);
  ['fr','c1','t0','t1'].forEach(function(k){anchors(LG.parts[k]).forEach(function(p){E('rect',{x:f(p[0]-15),y:f(p[1]-15),width:30,height:30,fill:K.carta,stroke:K.cobalt,'stroke-width':5.5},A.outl)})});
  /* ---------- selezione stile Figma ---------- */
  A.sel=E('g',{opacity:0},sv);
  A.box=E('rect',{fill:'none',stroke:K.cobalt,'stroke-width':2,pathLength:1,'stroke-dasharray':'1 1'},A.sel);
  A.hd=[];for(var h=0;h<8;h++)A.hd.push(E('rect',{width:12,height:12,fill:'#fff',stroke:K.cobalt,'stroke-width':2},A.sel));
  A.dim=E('g',{},A.sel);A.dimR=E('rect',{height:26,rx:5,fill:K.cobalt},A.dim);A.dimT=E('text',{y:18,'font-family':'DM Mono,monospace','font-size':14,'font-weight':500,fill:'#fff','text-anchor':'middle'},A.dim);
  A.nm=E('text',{'font-family':'DM Mono,monospace','font-size':14,'font-weight':500,fill:K.cobalt},A.sel);A.nm.textContent='Mother Machine · logo';
  /* etichetta: non si deforma */
  A.tag=E('g',{opacity:0},sv);E('rect',{x:0,y:-17,width:172,height:34,rx:17,fill:K.ink},A.tag);E('circle',{cx:18,cy:0,r:6,fill:K.tomato},A.tag);
  var tt=E('text',{x:32,y:5.5,'font-family':'DM Mono,monospace','font-size':14,'font-weight':500,fill:K.carta},A.tag);tt.textContent='Never stretch it.';
  /* tasto ⌘Y */
  A.key=E('g',{opacity:0,transform:'translate(56 826)'},sv);E('rect',{width:64,height:44,rx:9,fill:K.ink},A.key);
  var kt=E('text',{x:32,y:29,'font-family':'DM Mono,monospace','font-size':18,'font-weight':500,fill:K.carta,'text-anchor':'middle'},A.key);kt.textContent='⌘Y';
  var kl=E('text',{x:80,y:28,'font-family':'DM Mono,monospace','font-size':14,'font-weight':500,fill:K.ink},A.key);kl.textContent='Outline';
  /* campioni di colore */
  A.sw=[];[K.tomato,K.cobalt,K.sun,K.mint,K.ink].forEach(function(c,i){var g=E('g',{opacity:0},sv);E('circle',{r:22,fill:c},g);A.sw.push(g)});
  A.ring=E('circle',{r:31,fill:'none',stroke:K.ink,'stroke-width':3,opacity:0},sv);
  /* cursore */
  buildType(A,root);buildRun(A,host);buildStack(A,root);buildDash(A,root);buildEnd(A,root);
  A.cur=E('g',{},root);var ca=E('g',{transform:'scale(1.55)'},A.cur);
  E('path',{d:'M0 0 L0 26 L7 19.5 L11.5 29.5 L16 27.5 L11.5 18 L20 18 Z',fill:K.ink,stroke:'#fff','stroke-width':2,'stroke-linejoin':'round'},ca);
  A.clk=E('circle',{r:0,fill:'none',stroke:K.ink,'stroke-width':2.5,opacity:0},sv);
  return A}

/* ---------- contenuti delle celle (coordinate 0..360 x 0..240) ---------- */
function bg(g,c,dots){CELL.lastBg=E('rect',{width:CW,height:CH,rx:18,fill:c},g);CELL.lastC=c;if(dots)E('rect',{width:CW,height:CH,rx:18,fill:'url(#ht)'},g)}
function logo(g,id,col,x,y,s,extra){var w=E('g',{transform:'translate('+x+' '+y+') scale('+s+')'},g);var a={fill:col};for(var k in extra||{})a[k]=extra[k];return U(id,a,w)}
function txt(g,x,y,s,size,col,fam,w,anchor){var e=E('text',{x:x,y:y,'font-family':fam||'DM Mono,monospace','font-size':size,'font-weight':w||500,fill:col,'text-anchor':anchor||'start'},g);e.textContent=s;return e}
var CELL={
 0:function(g){bg(g,K.ink);logo(g,'lgAll',K.sun,40,170,.0723);txt(g,22,32,'NIGHT MODE',12,K.sun)},
 1:function(g){bg(g,K.cobalt,1);logo(g,'lgM',K.carta,134,214,.135)},
 2:function(g){bg(g,K.carta);E('rect',{x:.75,y:.75,width:CW-1.5,height:CH-1.5,rx:17,fill:'none',stroke:'#D9D6CC','stroke-width':1.5},g);
   var L=['<svg viewBox="0 0 3871 1718">','  <path fill="#FF5B3A"','   d="M0 -1267.6 L0.7 -1284.8','   L1.8 -1294.6 L3.0 -1303.1','   L6.7 -1319.9 L9.3 -1329.3','   L12.1 -1337.4 L15.1 …"/>','</svg>'];
   L.forEach(function(s,i){txt(g,20,40+i*25,String(i+1).padStart(2,'0'),12.5,K.mut);txt(g,52,40+i*25,s,12.5,i===1?K.tomato:K.ink)});
   CELL.caret=E('rect',{x:110,y:183,width:9,height:18,fill:K.tomato},g)},
 3:function(g){bg(g,K.mint,1);CELL.ol=logo(g,'lgAll','none',40,170,.0723,{stroke:K.ink,'stroke-width':16,'stroke-dasharray':'140 70'})},
 4:function(g){bg(g,K.sun,1);CELL.aa=txt(g,26,176,'Aa',150,K.cobalt,'Hanken Grotesk,sans-serif',700);txt(g,24,212,'HANKEN GROTESK 700',12,K.ink);txt(g,336,32,'06',12,K.ink,null,500,'end')},
 6:function(g){bg(g,K.carta);E('rect',{x:.75,y:.75,width:CW-1.5,height:CH-1.5,rx:17,fill:'none',stroke:'#D9D6CC','stroke-width':1.5},g);
   txt(g,26,46,'ORDERS · TODAY',12,K.mut);txt(g,26,96,'128',48,K.ink,'Hanken Grotesk,sans-serif',700);
   E('rect',{x:26,y:150,width:132,height:46,rx:23,fill:K.ink},g);txt(g,92,179,'Run',16,K.carta,'Hanken Grotesk,sans-serif',600,'middle');
   var tg=E('g',{transform:'translate(250 152)'},g);CELL.tgB=E('rect',{width:84,height:42,rx:21,fill:K.ink},tg);CELL.tgK=E('circle',{cx:21,cy:21,r:16,fill:'#fff'},tg)},
 7:function(g){bg(g,K.tomato,1);txt(g,22,32,'APP',12,K.ink);
   var cpp=E('clipPath',{id:'cp7'},g);E('rect',{width:CW,height:CH,rx:18},cpp);var ph=E('g',{transform:'translate(214 40)'},E('g',{'clip-path':'url(#cp7)'},g));E('rect',{width:116,height:236,rx:22,fill:K.ink},ph);E('rect',{x:7,y:7,width:102,height:222,rx:16,fill:K.carta},ph);
   E('rect',{x:40,y:14,width:36,height:8,rx:4,fill:K.ink},ph);
   E('rect',{x:17,y:34,width:82,height:58,rx:8,fill:K.sun},ph);E('rect',{x:17,y:100,width:82,height:9,rx:4.5,fill:K.ink},ph);E('rect',{x:17,y:115,width:52,height:9,rx:4.5,fill:'#C9C6BD'},ph);
   E('rect',{x:17,y:136,width:82,height:30,rx:15,fill:K.tomato},ph);CELL.nt=E('g',{opacity:0},ph);E('rect',{x:10,y:28,width:96,height:28,rx:9,fill:K.ink},CELL.nt);E('circle',{cx:23,cy:42,r:4,fill:K.tomato},CELL.nt);txt(CELL.nt,32,46,'New order',11,K.carta);
   txt(g,22,150,'New order',22,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,22,178,'1 × cake · 24.00',13,K.ink)},
 8:function(g){bg(g,K.ink);logo(g,'lgM','url(#htB)',134,214,.135)},
 9:function(g){bg(g,K.carta);E('rect',{x:.75,y:.75,width:CW-1.5,height:CH-1.5,rx:17,fill:'none',stroke:'#D9D6CC','stroke-width':1.5},g);
   for(var c=0;c<12;c++)E('rect',{x:20+c*27.5,y:20,width:22,height:200,fill:K.tomato,opacity:.12},g);
   CELL.blk=E('rect',{x:20,y:120,width:157,height:100,fill:K.cobalt},g);E('rect',{x:185,y:20,width:157,height:56,fill:K.ink},g);txt(g,20,46,'12 COL',12,K.ink)},
 10:function(g){bg(g,K.cobalt,1);var h=[60,96,74,130,112,160,142];CELL.bars=[];
   h.forEach(function(v,i){CELL.bars.push(E('rect',{x:30+i*44,y:200-v,width:30,height:v,fill:i===5?K.sun:K.carta},g))});txt(g,30,36,'OPERATIONS',12,K.carta)},
 11:function(g){bg(g,K.carta);E('rect',{x:.75,y:.75,width:CW-1.5,height:CH-1.5,rx:17,fill:'none',stroke:'#D9D6CC','stroke-width':1.5},g);
   txt(g,22,32,'COLOR · 05',12,K.ink);
   CELL.pal=[];[[K.tomato,'FF5B3A'],[K.cobalt,'2D46E0'],[K.sun,'FFC23D'],[K.mint,'36C2A0'],[K.ink,'141413']].forEach(function(c,i){CELL.pal.push(E('rect',{x:22+i*64,y:50,width:58,height:136,rx:8,fill:c[0]},g));txt(g,22+i*64,208,c[1],11,K.ink)})}
};

/* secondo stato delle schede: l'interruttore cambia tema, contenuti e funzioni */
function brd(g){E('rect',{x:.75,y:.75,width:CW-1.5,height:CH-1.5,rx:17,fill:'none',stroke:'#D9D6CC','stroke-width':1.5},g)}
var CELL2={
 0:function(g){bg(g,K.carta);brd(g);logo(g,'lgAll',K.ink,40,170,.0723);txt(g,22,32,'DAY MODE',12,K.ink)},
 1:function(g){bg(g,K.ink);logo(g,'lgM','none',134,214,.135,{stroke:K.carta,'stroke-width':12})},
 2:function(g){bg(g,K.carta);brd(g);E('rect',{x:46,y:48,width:302,height:24,rx:4,fill:K.sun,opacity:.5},g);
   var L=['<svg viewBox="0 0 3871 1718">','  <path fill="#2D46E0"','   d="M0 -1267.6 L0.7 -1284.8','   L1.8 -1294.6 L3.0 -1303.1','   L6.7 -1319.9 L9.3 -1329.3','   L12.1 -1337.4 L15.1 …"/>','</svg>  // theme: blue'];
   L.forEach(function(s,i){txt(g,20,40+i*25,String(i+1).padStart(2,'0'),12.5,K.mut);txt(g,52,40+i*25,s,12.5,i===1?K.cobalt:i===6?'#1E9C7B':K.ink)})},
 3:function(g){bg(g,K.tomato,1);logo(g,'lgAll',K.ink,40,170,.0723)},
 7:function(g){bg(g,K.mint,1);txt(g,22,32,'APP · DARK',12,K.ink);
   var cpp=E('clipPath',{id:'cp7b'},g);E('rect',{width:CW,height:CH,rx:18},cpp);var ph=E('g',{transform:'translate(214 40)'},E('g',{'clip-path':'url(#cp7b)'},g));
   E('rect',{width:116,height:236,rx:22,fill:K.ink},ph);E('rect',{x:7,y:7,width:102,height:222,rx:16,fill:'#262624'},ph);E('rect',{x:40,y:14,width:36,height:8,rx:4,fill:K.ink},ph);
   E('rect',{x:17,y:34,width:82,height:58,rx:8,fill:K.cobalt},ph);E('rect',{x:17,y:100,width:82,height:9,rx:4.5,fill:K.carta},ph);E('rect',{x:17,y:115,width:52,height:9,rx:4.5,fill:'#5A5953'},ph);E('rect',{x:17,y:136,width:82,height:30,rx:15,fill:K.sun},ph);
   txt(g,22,150,'Shipped',22,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,22,178,'1 × cake · on its way',13,K.ink)},
 8:function(g){bg(g,K.cobalt);logo(g,'lgM','url(#htS)',134,214,.135)},
 9:function(g){bg(g,K.carta);brd(g);for(var c=0;c<6;c++)E('rect',{x:20+c*54,y:20,width:48,height:200,fill:K.cobalt,opacity:.1},g);
   E('rect',{x:20,y:20,width:156,height:110,fill:K.tomato},g);E('rect',{x:182,y:140,width:156,height:80,fill:K.ink},g);txt(g,182,46,'6 COL',12,K.ink)},
 10:function(g){bg(g,K.ink);txt(g,30,36,'OPERATIONS · LIVE',12,K.sun);var v=[60,96,74,130,112,160,142],pts=v.map(function(h,i){return [44+i*44,206-h]});
   CELL2.line=E('path',{d:'M'+pts.map(function(p){return p.join(' ')}).join('L'),fill:'none',stroke:K.sun,'stroke-width':4,'stroke-linejoin':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},g);
   pts.forEach(function(p,i){E('circle',{cx:p[0],cy:p[1],r:i===5?7:4.5,fill:i===5?K.tomato:K.carta},g)})},
 11:function(g){bg(g,K.carta);brd(g);txt(g,22,32,'COLOR · THEME B',12,K.ink);
   [[K.cobalt,'2D46E0'],[K.sun,'FFC23D'],[K.tomato,'FF5B3A'],[K.ink,'141413'],[K.mint,'36C2A0']].forEach(function(c,i){E('rect',{x:22+i*64,y:50,width:58,height:136,rx:8,fill:c[0]},g);txt(g,22+i*64,208,c[1],11,K.ink)})}
};
/* trasformazione del logo principale al tempo t */
function LX(t){
  if(t<1.5){/* caduta vera: accelera fino a terra, si allunga mentre cade, si schiaccia all'impatto, fa un piccolo rimbalzo e si assesta */
    var fp=P(t,0,.36),yoff=-740*(1-fp*fp),sx=1,sy=1;if(t<.36){sy=1+.2*fp;sx=1-.08*fp}
    var im=P(t,.36,.5);if(im>0&&im<1){var k=Math.sin(Math.PI*im);sy=1-.26*k;sx=1+.18*k}
    var hp=P(t,.48,.62);if(hp>0&&hp<1){yoff-=30*Math.sin(Math.PI*hp);sy=1+.06*Math.sin(Math.PI*hp);sx=1-.03*Math.sin(Math.PI*hp)}
    var st2=P(t,.62,.72);if(st2>0&&st2<1){var k2=Math.sin(Math.PI*st2);sy=1-.07*k2;sx=1+.05*k2}
    var cam=ez.io3(P(t,.95,1.5));
    return {ax:340,ay:0,X:lerp(800,369.3,cam),Y:lerp(700,679.8,cam)+yoff,s:lerp(.36,.27,cam),sx:sx,sy:sy}}
  if(t<4.4){var sx2=1,sy2=1,sk=0;
    if(t>=2.1&&t<2.62){var d=ez.out3(P(t,2.1,2.42)),tn=P(t,2.42,2.62);d=d*(1+.04*Math.sin(tn*Math.PI));sx2=1+.36*d;sy2=1-.12*d;sk=-5*d}
    else if(t>=2.62){var u=t-2.62,e=Math.exp(-4.2*u),c=Math.cos(15*u);sx2=1+.36*e*c;sy2=1-.12*e*c+.07*e*Math.sin(15*u);sk=-5*e*Math.cos(13*u)}
    return {ax:1935,ay:-851,X:800,Y:450,s:.27,sx:sx2,sy:sy2,sk:sk}}
  var g=ez.io3(P(t,4.4,4.92));return {ax:1935,ay:-851,X:lerp(800,612,g),Y:450,s:lerp(.27,.0723,g),sx:1,sy:1}}
function mp(L,x,y){return [L.X+(x-L.ax)*L.s*L.sx,L.Y+(y-L.ay)*L.s*L.sy]}
function curAt(t,A){
  var L=LX(Math.min(t,2.62)),rh=mp(L,3871,-851);rh=[rh[0]+16,rh[1]];
  if(t<1.5)return [1700,1050];
  if(t<2.05){var p=ez.io3(P(t,1.5,2.05));return [lerp(1700,rh[0],p),lerp(1050,rh[1],p)+Math.sin(p*Math.PI)*-60]}
  if(t<3.4)return rh;
  var sw=[672,800];
  if(t<3.85){var q=ez.io3(P(t,3.4,3.85));return [lerp(rh[0],sw[0],q),lerp(rh[1],sw[1],q)+Math.sin(q*Math.PI)*-40]}
  if(t<5.3)return sw;
  var tg=[1104,512];if(t<5.95){var r=ez.io3(P(t,5.3,5.66));return [lerp(sw[0],tg[0],r),lerp(sw[1],tg[1],r)]}
  var u=ez.in3(P(t,5.95,6.18));return [lerp(tg[0],1750,u),lerp(tg[1],1100,u)]}

function camAt(t){
  var a=ez.io3(P(t,2.05,2.4)),b=ez.io3(P(t,2.7,3.2)),z1=.06*(a-b);
  var c=ez.io3(P(t,3.92,4.38)),d=ez.io3(P(t,4.4,5.05)),z2=.08*(c-d);
  if(t<3.6)return {px:1000,py:450,sx:1000,sy:450,s:1+z1};
  if(t<6.4)return {px:672,py:800,sx:672,sy:800,s:1+z2};
  var dv=ez.in3(P(t,6.42,6.98)),k=ez.io3(P(t,6.42,6.98));var P0=[236,450];
  return {px:P0[0],py:P0[1],sx:lerp(P0[0],800,k),sy:450,s:Math.pow(5.2,dv)}}
var MM_URL=/url=1/.test(location.hash),LGP=null,MC=null;function meas(str,w,size){if(!MC)MC=document.createElement('canvas').getContext('2d');MC.font=w+' '+size+'px "Hanken Grotesk"';return MC.measureText(str).width}
/* ---------- momento 2: le parole ---------- */
var SY={x0:520,x1:1080,y:742};
function wghtAt(t){return 100+800*ez.io3(P(t,8.2,8.9))}
function buildType(A,root){var L=A.TL=E('g',{opacity:0},root);
  E('rect',{width:1600,height:900,fill:K.sun},L);E('rect',{width:1600,height:900,fill:'url(#ht)'},L);
  A.bigAa=txt(L,-1,741,'Aa',780,K.cobalt,'Hanken Grotesk,sans-serif',700);
  txt(L,56,74,'HANKEN GROTESK · VARIABLE 100 TO 900',14,K.ink);txt(L,1544,74,'MOTHER MACHINE · TYPE',14,K.ink,null,500,'end');
  E('rect',{x:56,y:92,width:1488,height:2,fill:K.ink},L);E('rect',{x:56,y:806,width:1488,height:2,fill:K.ink},L);
  txt(L,56,840,'BRAND · SYSTEMS · CODE',14,K.ink);A.tCount=txt(L,1544,840,'01 / 03',14,K.ink,null,500,'end');
  A.bref=txt(L,0,-2000,'Brand.',300,K.ink,'Hanken Grotesk,sans-serif',700);
  A.brand=[];'Brand.'.split('').forEach(function(ch){var e=txt(L,0,0,ch,300,K.ink,'Hanken Grotesk,sans-serif',700);A.brand.push(e)});
  A.sys=E('text',{x:800,y:0,'text-anchor':'middle','font-family':'Hanken Grotesk,sans-serif','font-size':232,fill:K.cobalt},L);A.sys.textContent='Systems.';
  var sl=A.sl=E('g',{opacity:0},L);E('rect',{x:SY.x0,y:SY.y-3,width:SY.x1-SY.x0,height:6,rx:3,fill:K.ink,opacity:.25},sl);A.slF=E('rect',{x:SY.x0,y:SY.y-3,width:0,height:6,rx:3,fill:K.cobalt},sl);
  A.slK=E('circle',{cx:SY.x0,cy:SY.y,r:15,fill:K.carta,stroke:K.ink,'stroke-width':3},sl);txt(sl,SY.x0,SY.y-26,'wght',16,K.ink);A.slV=txt(sl,SY.x1,SY.y-26,'100',16,K.ink,null,500,'end');
  A.code=txt(L,0,0,'',300,K.ink,'Hanken Grotesk,sans-serif',700);A.caret=E('rect',{width:18,height:220,fill:K.tomato},L);
  A.dot=E('circle',{r:0,fill:K.tomato},L)}
function renderType(A,t,tr){var on=t>6.975&&t<RUN0+.75;op(A.TL,on?1:0);if(!on)return;
  if(CELL.aa)A.bigAa.style.fontWeight=CELL.aa.style.fontWeight;
  var ax=ez.in3(P(t,6.98,6.98+D.med));A.bigAa.setAttribute('transform','translate(0 '+f(-900*ax)+')');op(A.bigAa,1-P(t,7.2,7.3));
  var by=560,size=300,W=A.bref.getComputedTextLength(),x=800-W/2;
  A.brand.forEach(function(e,i){var a=7.0+i*.05,p=P(t,a,a+D.med),ex=ez.in3(P(t,7.66+i*.025,7.66+i*.025+D.fast));
    var y=by-(1-ez.back(p,1.3))*520-ex*760;e.setAttribute('x',f(x+A.bref.getStartPositionOfChar(i).x));e.setAttribute('y',f(y));op(e,p>0?1:0)});
  A.tCount.textContent=t<7.9?'01 / 03':t<9.0?'02 / 03':'03 / 03';
  var w=wghtAt(t),se=ez.back(P(t,7.94,7.94+D.med),1.4),sx=ez.in3(P(t,8.95,8.95+D.fast));
  A.sys.style.fontWeight=Math.round(w);A.sys.setAttribute('y',f(530));A.sys.setAttribute('transform','translate('+f(-1800*sx)+' 0) translate(800 450) scale('+f(.4+.6*se)+') translate(-800 -450)');op(A.sys,t>7.94?1:0);
  var so=ez.back(P(t,7.98,7.98+D.med));op(A.sl,t>7.98&&t<9.05?1-P(t,8.95,9.05):0);A.sl.setAttribute('transform','translate(0 '+f(40*(1-so))+')');
  var kx=SY.x0+(SY.x1-SY.x0)*(w-100)/800;A.slK.setAttribute('cx',f(kx));A.slF.setAttribute('width',f(kx-SY.x0));A.slV.textContent=Math.round(w);
  var full='Code',n=Math.floor(P(t,9.05,9.42)*4.999);A.code.textContent=full;var cw=A.code.getComputedTextLength()+70,cx0=800-cw/2;
  A.code.textContent=full.slice(0,n);var cur=n?A.code.getComputedTextLength():0;A.code.setAttribute('x',f(cx0));A.code.setAttribute('y',f(by));
  var dotT=9.46;A.caret.setAttribute('x',f(cx0+cur+8));A.caret.setAttribute('y',f(by-212));op(A.caret,t>9.02&&t<dotT&&(Math.floor(tr*4)%2===0||t<9.44)?1:0);
  var dg=ez.in3(P(t,9.56,9.96)),dp=ez.back(P(t,dotT,dotT+D.fast),2.4);A.dot.setAttribute('cx',f(cx0+cur+44));A.dot.setAttribute('cy',f(by-24));A.dot.setAttribute('r',f(t<dotT?0:24*dp*(1+.25*Math.max(0,Math.sin((t-dotT)*9))*(t<RUN0+.3?1:0))))}
/* ---------- momento nuovo: RUNTIME. Glitch, il codice del logo piove, si ferma a formare la m, si compila in retino, esplode in un campo di archi ---------- */
function hsh(n){n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n)}
var RC={cw:16,rh:22,cols:100,rows:41,mx:657,mb:760,ms:.42};
function buildRun(A,host){var cv=A.rc=document.createElement('canvas');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:none;z-index:1';host.appendChild(cv);A.rx=cv.getContext('2d');
  var m=new Path2D(),M=new DOMMatrix([RC.ms,0,0,RC.ms,RC.mx,RC.mb]);m.addPath(new Path2D(LGP.fr),M);m.addPath(new Path2D(LGP.c1),M);A.mPath=m;
  A.data=(LGP.fr+LGP.t0).replace(/\s+/g,'').slice(0,3000);
  var ins=[],tc=document.createElement('canvas').getContext('2d');for(var c=0;c<RC.cols;c++){ins[c]=[];for(var r=0;r<RC.rows;r++)ins[c][r]=tc.isPointInPath(m,c*RC.cw+8,r*RC.rh+14)}A.ins=ins;
  /* la pioggia: ogni colonna ha più gocce che scendono una dopo l'altra, sempre alla stessa velocità */
  A.mcol=ins.map(function(col){return col.some(function(x){return x})});A.rs=[];A.lk=[];
  for(var ca=0;ca<RC.cols;ca++){var vv=17+hsh(ca+50)*17,LL=7+hsh(ca+90)*12,st=[],t0=.35+hsh(ca)*.8,mc=A.mcol[ca];
    for(var kk=0;kk<9;kk++){st.push(t0);t0+=(mc?.42:.95)+hsh(ca*3.1+kk*7.7)*(mc?.3:.7)}A.rs.push({v:vv,L:LL,s:st});
    /* ogni carattere della m aspetta il suo momento, sparso tra 0,7 e 1,55: la prima goccia che ci passa sopra dopo quel momento si ferma lì */
    A.lk[ca]=[];for(var ra=0;ra<RC.rows;ra++){if(!ins[ca][ra]){A.lk[ca][ra]=99;continue}var e=.7+.65*hsh(ca*13.3+ra*7.1)+.2*(ra/RC.rows),best=99;
      st.forEach(function(s0){var tk=s0+ra/vv;if(tk>=e&&tk<best)best=tk});A.lk[ca][ra]=best}}
  /* distanza di ogni cella dalla m: serve a far crescere il campo dalla lettera verso fuori */
  var dist=[],q=[],ky=RC.rh/RC.cw;for(var c2=0;c2<RC.cols;c2++)for(var r2=0;r2<RC.rows;r2++)if(ins[c2][r2])q.push([c2,r2]);
  for(var c3=0;c3<RC.cols;c3++){dist[c3]=[];for(var r3=0;r3<RC.rows;r3++){var best=1e9;if(!ins[c3][r3])for(var h=0;h<q.length;h++){var dx=c3-q[h][0],dy=(r3-q[h][1])*ky,d2=dx*dx+dy*dy;if(d2<best)best=d2}else best=0;dist[c3][r3]=Math.sqrt(best)}}A.dist=dist}
function renderRun(A,t,tr){var u=t-RUN0,on=u>.14&&t<STK0+.02;var cv=A.rc;var d=on?'block':'none';if(cv.style.display!==d)cv.style.display=d;if(!on)return;
  var W=cv.clientWidth,H=cv.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
  var x=A.rx,sc=Math.max(W/1600,H/900)*dpr;x.setTransform(sc,0,0,sc,(W*dpr-1600*sc)/2,(H*dpr-900*sc)/2);x.clearRect(0,0,1600,900);
  var C=[K.tomato,K.cobalt,K.sun,K.mint,K.carta];
  /* 1. glitch: lo schermo si rompe a strisce */
  if(u<.48){var g=P(u,.14,.46);for(var i=0;i<26;i++){if(hsh(i+3)<g){var y=hsh(i)*900,h=6+hsh(i+7)*70,ox=(hsh(i+11)-.5)*120*(1-g);x.fillStyle=K.ink;x.fillRect(ox,y,1600,h*(.4+g));if(hsh(i+5)<.3){x.fillStyle=C[i%2?0:1];x.fillRect(ox+hsh(i+9)*800,y,200+hsh(i+2)*600,3)}}}return}
  x.fillStyle=K.ink;x.fillRect(0,0,1600,900);
  var lockOn=u>1.45,rainOut=1-P(u,2.4,2.72),dimR=1-.45*P(u,1.9,2.2),comp=u>2.72?P(u,2.72,3.0):0,sweep=640+330*comp;
  x.font='500 17px "DM Mono", ui-monospace, monospace';x.textBaseline='middle';x.textAlign='center';
  if(u<3.05){
  /* la pioggia continua; dove passa la m alcuni caratteri si fermano, uno qua e uno là: la m si forma dalla cascata, verde chiaro, poi diventa gialla dall'alto */
  for(var c=0;c<RC.cols;c++){var Rs=A.rs[c],v=Rs.v,L=Rs.L,cx=c*RC.cw+8;
    for(var r=0;r<RC.rows;r++){var cy=r*RC.rh+14,inside=A.ins[c][r],lt=inside?A.lk[c][r]:99;
      if(u>=lt){var ch=A.data[(c*131+r*17+Math.floor(lt*12+c))%A.data.length];
        if(cx<sweep&&comp>0){x.globalAlpha=1;x.fillStyle=K.sun;x.beginPath();x.arc(cx,cy,7.2,0,6.283);x.fill()}
        else{var ty=2.22+(r-7)/27*.3+hsh(c*5.1)*.04,yel=u>=ty+.05,fl=u<lt+.09||(u>=ty&&u<ty+.05);
          x.globalAlpha=1;x.fillStyle=fl?K.carta:yel?K.sun:'#8DFFDB';x.fillText(ch,cx,cy)}continue}
      if(rainOut<=0)continue;var dd=99;for(var q=0;q<Rs.s.length;q++){var d0=(u-Rs.s[q])*v-r;if(d0>=0&&d0<dd)dd=d0}if(dd>L)continue;
      var b=1-dd/L;x.globalAlpha=.78*b*rainOut*dimR*(inside?.6:1);x.fillStyle=dd<1?K.carta:(hsh(c*7+r)<.06?K.tomato:K.mint);
      x.fillText(A.data[(c*131+r*17+Math.floor(u*12+c))%A.data.length],cx,cy)}}}
  x.globalAlpha=1;
  /* 2. i puntini della m diventano archi; il campo cresce dalla m mentre la camera entra; un'onda sola lo gira e lo fa pomodoro */
  if(u>=3.05){var mo=ez.out3(P(u,3.05,3.3)),z=1+1.7*ez.io3(P(u,3.25,4.6)),gr=(u-3.25)*58,wf=(u-3.8)*80,wf2=(u-4.3)*95,wf3=(u-4.75)*100,merge=P(u,5.2,5.62);
    if(merge>.3){x.fillStyle=K.tomato;x.globalAlpha=P(merge,.3,.7);x.fillRect(0,0,1600,900);x.globalAlpha=1}
    x.save();x.translate(800,452);x.scale(z,z);x.translate(-800,-452);x.lineCap='butt';
    var lw=3.4+15*ez.in3(merge);
    for(var c=0;c<RC.cols;c++){var cx=c*RC.cw+8,sx=800+(cx-800)*z;if(sx<-30||sx>1630)continue;
      for(var r=0;r<RC.rows;r++){var cy=r*RC.rh+14,sy=452+(cy-452)*z;if(sy<-30||sy>930)continue;
        var dd=A.dist[c][r],inside=dd===0,pp=inside?mo:ez.out3(cl((gr-dd)/3));if(pp<=0)continue;
        var qf=cl((wf-dd)/5),q2=cl((wf2-dd)/5),q3=cl((wf3-dd)/5),ang=Math.PI*ez.io3(qf)+Math.PI/2*ez.io3(q2)+Math.PI/2*ez.io3(q3),col=qf>.5?K.tomato:(inside?K.sun:K.carta);
        if(inside&&mo<1){x.fillStyle=K.sun;x.beginPath();x.arc(cx,cy,7.2*(1-mo),0,6.283);x.fill()}
        x.save();x.translate(cx,cy+1);x.rotate(ang);x.scale(pp,pp);x.strokeStyle=col;x.globalAlpha=inside||qf>.5?1:.85;x.lineWidth=lw;
        x.beginPath();x.moveTo(-5.5,7);x.lineTo(-5.5,0);x.arc(0,0,5.5,Math.PI,0);x.lineTo(5.5,7);x.stroke();x.restore()}}
    x.restore();x.globalAlpha=1;if(merge>=1){x.fillStyle=K.tomato;x.fillRect(0,0,1600,900)}}
  /* 3. terminale */
  var tA=1-P(u,5.0,5.25);x.globalAlpha=tA;x.textAlign='left';x.font='500 15px "DM Mono", ui-monospace, monospace';
  function lab(s,xx,yy,col,al,a){x.textAlign=al;var w=x.measureText(s).width;x.globalAlpha=tA;x.fillStyle=K.ink;x.fillRect(al==='right'?xx-w-10:xx-10,yy-13,w+20,26);x.globalAlpha=tA*a;x.fillStyle=col;x.fillText(s,xx,yy)}
  lab('MOTHER MACHINE · RUNTIME',56,44,K.carta,'left',.55);lab('FRAME '+String(Math.floor(tr*60)).padStart(5,'0'),1544,44,K.carta,'right',.55);
  var cmd='> mother --compile logo.svg',n=Math.floor(P(u,.8,1.5)*cmd.length);if(u>.7)lab(cmd.slice(0,n)+(Math.floor(tr*3)%2&&u<1.6?'_':''),56,850,K.mint,'left',1);
  if(u>2.8)lab('✓ 1 mark · 2 floors · 0 errors',56,822,K.sun,'left',1);
  if(u>3.3)lab('GROWING · 4100 ARCHES · SEED 0412',1544,850,K.carta,'right',.55);x.textAlign='left'
  x.globalAlpha=1}
/* ---------- i prodotti: otto app vere per otto settori; quattro scorrono con la loro funzione, una si apre ---------- */
var SW=1000,SH=560,HB=48,BR=[
 {n:'Riverside Clinic',a:K.cobalt,tc:K.carta,ic:'cross',meta:'AGENDA · MON 12 OCT',body:'clinic'},
 {n:'Swift Couriers',a:K.sun,tc:K.ink,ic:'truck',meta:'LIVE · 38 DELIVERIES',body:'map'},
 {n:'Pulse Gym',a:K.mint,tc:K.ink,ic:'bell',meta:'CHECK-IN · FRONT DESK',body:'gym'},
 {n:'Pizzeria Uno',a:K.tomato,tc:K.carta,ic:'pizza',meta:'FLOOR · FRI 20:30',body:'floor'},
 {n:'Northside Realty',a:K.ink,tc:K.carta,ic:'house',meta:'CRM · 24 LEADS',body:'gen'},
 {n:'Harbour Hotel',a:K.cobalt,tc:K.carta,ic:'key',meta:'ROOMS · 86% FULL',body:'gen'},
 {n:'Lumen Optics',a:K.sun,tc:K.ink,ic:'glasses',meta:'STOCK · 1,204 ITEMS',body:'gen'},
 {n:'North Brewing Co.',a:K.tomato,tc:K.carta,ic:'beer',meta:'TANKS · 6 ACTIVE',body:'gen'}];
var TINT={mint:'#BFE9DD',sun:'#FFE7AE',cob:'#C9D0F7',tom:'#FFD0C4',line:'#E4E1D8',land:'#E8E4D8',white:'#FFFFFF'};
function icon(g,kind,x,y,sc){var i=E('g',{transform:'translate('+x+' '+y+') scale('+(sc||1)+')'},g);
  if(kind==='pizza'){E('path',{d:'M-10 -8 Q0 -13 10 -8 L0 12 Z',fill:K.sun},i);E('path',{d:'M-10 -8 Q0 -13 10 -8 L9 -5 Q0 -9.5 -9 -5 Z',fill:'#C98A4B'},i);
    [[-3,-2,2.3],[3.2,1,2.1],[-.4,5.6,1.7]].forEach(function(c){E('circle',{cx:c[0],cy:c[1],r:c[2],fill:K.tomato},i)})}
  if(kind==='truck'){E('rect',{x:-12,y:-6,width:14,height:11,rx:1.5,fill:K.cobalt},i);E('path',{d:'M2 -2 H7.5 L11 2 V5 H2 Z',fill:K.cobalt},i);E('path',{d:'M4 0 H7 L9 2.3 H4 Z',fill:K.carta},i);
    E('circle',{cx:-7,cy:6.5,r:2.8,fill:K.ink},i);E('circle',{cx:6,cy:6.5,r:2.8,fill:K.ink},i)}
  if(kind==='glasses'){[-6.5,6.5].forEach(function(cx){E('circle',{cx:cx,cy:1,r:5.6,fill:K.cobalt,'fill-opacity':.25,stroke:K.ink,'stroke-width':2.6},i)});E('path',{d:'M-1.4 0 Q0 -2 1.4 0',fill:'none',stroke:K.ink,'stroke-width':2},i)}
  if(kind==='bell'){E('rect',{x:-8,y:-1.5,width:16,height:3,fill:K.ink},i);E('rect',{x:-12,y:-7,width:3.5,height:14,rx:1,fill:K.ink},i);E('rect',{x:-8.5,y:-5,width:3,height:10,rx:1,fill:K.mint},i);
    E('rect',{x:8.5,y:-7,width:3.5,height:14,rx:1,fill:K.ink},i);E('rect',{x:5.5,y:-5,width:3,height:10,rx:1,fill:K.mint},i)}
  if(kind==='cross'){E('rect',{x:-3.2,y:-10,width:6.4,height:20,rx:1.2,fill:K.cobalt},i);E('rect',{x:-10,y:-3.2,width:20,height:6.4,rx:1.2,fill:K.cobalt},i)}
  if(kind==='house'){E('path',{d:'M-11 -1 L0 -11 L11 -1 V11 H-11 Z',fill:K.ink},i);E('rect',{x:-3,y:3,width:6,height:8,fill:K.carta},i)}
  if(kind==='key'){E('circle',{cx:-5,cy:0,r:6,fill:'none',stroke:K.cobalt,'stroke-width':3.2},i);E('path',{d:'M1 0 H12 M8 0 V5 M11 0 V4',stroke:K.cobalt,'stroke-width':3,fill:'none'},i)}
  if(kind==='beer'){E('rect',{x:-8,y:-6,width:12,height:16,rx:2,fill:K.sun},i);E('path',{d:'M-9 -6 Q-9 -12 -3 -11 Q1 -14 5 -10 Q8 -10 6 -6 Z',fill:K.carta,stroke:K.ink,'stroke-width':1},i);E('path',{d:'M4 -2 H8 Q11 -2 11 2 V4 Q11 7 8 7 H4',fill:'none',stroke:K.sun,'stroke-width':2.6},i)}
  if(kind==='check'){E('path',{d:'M-8 0 L-2 6 L9 -6',fill:'none',stroke:K.carta,'stroke-width':3.4,'stroke-linecap':'round','stroke-linejoin':'round'},i)}
  if(kind==='ticket'){E('rect',{x:-8,y:-10,width:16,height:20,rx:2,fill:K.carta},i);E('path',{d:'M-4 -4 H4 M-4 0 H4 M-4 4 H1',stroke:K.ink,'stroke-width':1.8},i)}
  if(kind==='phone'){E('rect',{x:-7,y:-11,width:14,height:22,rx:3,fill:K.carta},i);E('rect',{x:-4,y:-7,width:8,height:10,rx:1,fill:K.tomato},i)}
  if(kind==='flame'){E('path',{d:'M0 -11 C5 -6 8 -2 7 4 C6 9 3 11 0 11 C-3 11 -6 9 -7 4 C-8 -1 -4 -3 -3 -7 C-1 -4 0 -3 1 -2 C2 -5 1 -8 0 -11 Z',fill:K.carta},i)}
  return i}
function gymIc(g,i,x,y){var c=E('g',{transform:'translate('+x+' '+y+')'},g);
  if(i===0){E('circle',{cx:-6,cy:4,r:5,fill:'none',stroke:K.ink,'stroke-width':2},c);E('circle',{cx:7,cy:4,r:5,fill:'none',stroke:K.ink,'stroke-width':2},c);E('path',{d:'M-6 4 L-1 -5 H5 L7 4 M-1 -5 L-3 -8',fill:'none',stroke:K.ink,'stroke-width':2},c)}
  if(i===1){E('circle',{cx:0,cy:-7,r:3,fill:K.ink},c);E('path',{d:'M-9 7 L0 -2 L9 7 M-6 2 H6',fill:'none',stroke:K.ink,'stroke-width':2.2,'stroke-linecap':'round'},c)}
  if(i===2){E('circle',{cx:0,cy:3,r:7,fill:K.ink},c);E('path',{d:'M-5 -2 V-6 Q-5 -9 0 -9 Q5 -9 5 -6 V-2',fill:'none',stroke:K.ink,'stroke-width':2.2},c)}
  if(i===3){E('rect',{x:-10,y:2,width:20,height:5,rx:2.5,fill:K.ink},c);E('circle',{cx:0,cy:-5,r:5,fill:'none',stroke:K.ink,'stroke-width':2.2},c)}}
function head(g,b,w,h){E('path',{d:'M16 0 H'+(w-16)+' Q'+w+' 0 '+w+' 16 V'+h+' H0 V16 Q0 0 16 0 Z',fill:b.a},g);E('circle',{cx:30,cy:h/2,r:14,fill:K.carta},g);icon(g,b.ic,30,h/2,.78);
  txt(g,54,h/2+6,b.n,18,b.tc,'Hanken Grotesk,sans-serif',700);var m=txt(g,w-22,h/2+4,b.meta,12,b.tc,null,500,'end');m.setAttribute('opacity',.75);
  if(b.body==='floor')return svcBtn(g)}
/* Start service: un tasto vero della barra dell'app, accanto all'orario. Stato: pronto, sotto il cursore, premuto, in servizio, finito */
function svcBtn(g){var o=E('g',{transform:'translate(650 9)'},g),bt=E('g',{},o);var r=E('rect',{width:160,height:30,rx:15,fill:K.carta},bt);
  var pl=E('path',{d:'M15 9.5 L23 15 L15 20.5 Z',fill:K.tomato},bt);var dt=E('circle',{cx:19,cy:15,r:4.5,fill:K.mint,opacity:0},bt);
  var t=txt(bt,32,20,'Start service',13,K.ink,'Hanken Grotesk,sans-serif',700);return {g:o,b:bt,r:r,pl:pl,dt:dt,t:t}}
function chip(g,x,y,t,bg,fg,w){E('rect',{x:x,y:y-14,width:w||(t.length*7.6+18),height:22,rx:11,fill:bg},g);return txt(g,x+9,y+1.5,t,11.5,fg)}
/* ---- corpi delle app ---- */
var BODY={
 clinic:function(g,A){var docs=[['JB','Dr. Bennett'],['LC','Dr. Collins'],['AF','Dr. Fraser']];
   ['09:00','10:00','11:00','12:00','13:00'].forEach(function(h,i){var y=118+i*86;txt(g,24,y+4,h,12,K.mut);E('rect',{x:90,y:y,width:890,height:1,fill:TINT.line},g)});
   docs.forEach(function(d,i){var x=100+i*296;E('circle',{cx:x+16,cy:82,r:15,fill:[TINT.cob,TINT.mint,TINT.sun][i]},g);txt(g,x+16,86.5,d[0],11,K.ink,null,500,'middle');txt(g,x+40,88,d[1],15,K.ink,'Hanken Grotesk,sans-serif',600)});
   function ap(c,y,h,col,t1,t2){var x=100+c*296;E('rect',{x:x,y:y,width:280,height:h,rx:8,fill:col},g);E('rect',{x:x,y:y,width:5,height:h,rx:2.5,fill:K.ink,opacity:.5},g);txt(g,x+16,y+24,t1,14,K.ink,'Hanken Grotesk,sans-serif',600);txt(g,x+16,y+42,t2,11,K.ink)}
   ap(0,124,70,TINT.mint,'Check-up · Carter','09:05 · 30 MIN');ap(0,300,96,TINT.sun,'Follow-up · Green','11:10 · 45 MIN');
   ap(1,124,150,TINT.cob,'Surgery · Morgan','09:05 · 90 MIN');ap(2,124,60,TINT.sun,'Exam · Reed','09:05 · 20 MIN');ap(2,386,90,TINT.mint,'Visit · Brooks','12:10 · 40 MIN');
   A.cSlot=E('rect',{x:396,y:300,width:280,height:80,rx:8,fill:'none',stroke:K.cobalt,'stroke-width':2,'stroke-dasharray':'6 5'},g);
   var nb=A.cNew=E('g',{},g);E('rect',{x:0,y:0,width:280,height:80,rx:8,fill:K.cobalt},nb);txt(nb,16,28,'Visit · Ross M.',15,K.carta,'Hanken Grotesk,sans-serif',700);txt(nb,16,50,'11:10 · 40 MIN · NEW',11,K.carta);
   A.cLink=E('path',{d:'M676 340 C690 340 690 330 704 330',fill:'none',stroke:K.cobalt,'stroke-width':2.5,pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},g);
   var sm=A.cSms=E('g',{opacity:0},g);E('rect',{x:4,y:8,width:262,height:72,rx:14,fill:K.ink,opacity:.12},sm);E('rect',{x:0,y:0,width:262,height:72,rx:14,fill:TINT.white},sm);
   E('circle',{cx:28,cy:36,r:15,fill:K.cobalt},sm);E('rect',{x:21,y:26,width:14,height:20,rx:3,fill:'none',stroke:K.carta,'stroke-width':2},sm);
   txt(sm,52,28,'SMS · ROSS M.',10,K.mut);txt(sm,52,50,'See you Tue at 11:10',14,K.ink,'Hanken Grotesk,sans-serif',600);A.cSent=chip(sm,198,20,'SENT ✓',K.mint,K.ink,56).parentNode},
 map:function(g,A){var mp=E('g',{},g);E('rect',{x:0,y:HB,width:640,height:SH-HB,fill:TINT.land},mp);
   E('path',{d:'M0 420 Q160 380 260 450 T640 400 V560 H0Z',fill:TINT.cob,opacity:.8},mp);E('rect',{x:420,y:90,width:150,height:110,rx:10,fill:TINT.mint},mp);
   for(var i=0;i<7;i++)E('rect',{x:40+i*92,y:HB,width:10,height:SH-HB,fill:K.carta},mp);for(var j=0;j<5;j++)E('rect',{x:0,y:96+j*96,width:640,height:10,fill:K.carta},mp);
   E('path',{d:'M0 330 L640 150',stroke:K.carta,'stroke-width':14},mp);
   var rd='M60 500 L60 390 L230 390 L230 200 L414 200 L414 110 L560 110';A.rBase=E('path',{d:rd,fill:'none',stroke:K.ink,'stroke-width':4,'stroke-dasharray':'2 9','stroke-linecap':'round',opacity:.5},mp);
   A.rLine=E('path',{d:rd,fill:'none',stroke:K.cobalt,'stroke-width':7,'stroke-linejoin':'round','stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},mp);
   E('rect',{x:46,y:486,width:28,height:28,rx:4,fill:K.ink},mp);var pin=E('g',{transform:'translate(560 110)'},mp);E('path',{d:'M0 0 C-14 -16 -14 -34 0 -34 C14 -34 14 -16 0 0Z',fill:K.tomato},pin);E('circle',{cx:0,cy:-22,r:5,fill:K.carta},pin);
   var vn=A.van=E('g',{},mp);E('circle',{r:22,fill:K.carta},vn);icon(vn,'truck',0,0,1.25);
   var eta=A.eta=E('g',{},mp);E('rect',{x:0,y:0,width:112,height:34,rx:17,fill:K.ink},eta);A.etaT=txt(eta,56,22,'ETA 12 MIN',12,K.sun,null,500,'middle');
   var cc=E('g',{},g);E('rect',{x:660,y:68,width:320,height:122,rx:14,fill:TINT.white},cc);E('circle',{cx:700,cy:110,r:22,fill:K.sun},cc);txt(cc,700,117,'M',18,K.ink,'Hanken Grotesk,sans-serif',700,'middle');
   txt(cc,734,106,'Mark · Van 3',16,K.ink,'Hanken Grotesk,sans-serif',700);txt(cc,734,126,'#2041 · 12 KING ST',10,K.mut);
   E('circle',{cx:930,cy:120,r:30,fill:'none',stroke:TINT.line,'stroke-width':7},cc);A.etaRing=E('circle',{cx:930,cy:120,r:30,fill:'none',stroke:K.cobalt,'stroke-width':7,pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1,transform:'rotate(-90 930 120)','stroke-linecap':'round'},cc);
   A.etaN=txt(cc,930,124,'12',18,K.ink,'Hanken Grotesk,sans-serif',700,'middle');txt(cc,930,138,'MIN',8,K.mut,null,500,'middle');txt(cc,680,174,'4.9 ★ · 1,204 DELIVERIES',10,K.mut);
   var tl=E('g',{},g);E('rect',{x:660,y:204,width:320,height:242,rx:14,fill:TINT.white},tl);E('rect',{x:691,y:240,width:4,height:170,rx:2,fill:TINT.line},tl);A.tlFill=E('rect',{x:691,y:240,width:4,height:0,rx:2,fill:K.cobalt},tl);
   A.tl=[['Picked up','18:41'],['On the way','18:44'],['Nearby','18:52'],['Delivered','18:55']].map(function(st,i){var y=240+i*56.7;var d=E('circle',{cx:693,cy:y,r:9,fill:TINT.white,stroke:TINT.line,'stroke-width':3},tl);
     var l=txt(tl,716,y+5,st[0],15,K.ink,'Hanken Grotesk,sans-serif',600);var tm=txt(tl,962,y+5,st[1],11,K.mut,null,500,'end');return {d:d,l:l,tm:tm}});
   [['38','TODAY'],['97%','ON TIME']].forEach(function(c,i){var x=660+i*164;E('rect',{x:x,y:460,width:156,height:80,rx:14,fill:i?K.ink:K.sun},g);txt(g,x+16,500,c[0],26,i?K.carta:K.ink,'Hanken Grotesk,sans-serif',700);txt(g,x+16,524,c[1],10,i?K.carta:K.ink)})},
 gym:function(g,A){var p=E('g',{},g);E('rect',{x:24,y:68,width:500,height:470,rx:16,fill:K.ink},p);
   E('circle',{cx:62,cy:108,r:20,fill:TINT.sun},p);txt(p,62,114,'JR',14,K.ink,'Hanken Grotesk,sans-serif',700,'middle');txt(p,92,104,'Julia R. · Leg day',17,K.carta,'Hanken Grotesk,sans-serif',700);txt(p,92,124,'COACH LUKE · LIVE SESSION',10,K.sun);
   var rc=[[K.tomato,124,'MOVE'],[K.sun,96,'REPS'],[K.mint,68,'TIME']];A.rings=rc.map(function(r){E('circle',{cx:200,cy:330,r:r[1],fill:'none',stroke:r[0],'stroke-opacity':.18,'stroke-width':22},p);
     return E('circle',{cx:200,cy:330,r:r[1],fill:'none',stroke:r[0],'stroke-width':22,'stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1,transform:'rotate(-90 200 330)'},p)});
   A.ringPct=txt(p,200,342,'0%',36,K.carta,'Hanken Grotesk,sans-serif',700,'middle');
   rc.forEach(function(r,i){E('circle',{cx:362,cy:420+i*26,r:6,fill:r[0]},p);txt(p,376,425+i*26,r[2],11,K.carta)});
   txt(p,362,176,'HEART RATE',10,K.sun);A.bpm=txt(p,362,222,'128',40,K.carta,'Hanken Grotesk,sans-serif',700);txt(p,450,222,'BPM',11,K.carta);
   var hr='M362 300';for(var q=0;q<=20;q++){var x=362+q*7.5,y=q%5===2?262:q%5===3?318:290;hr+=' L'+x+' '+y}A.hr=E('path',{d:hr,fill:'none',stroke:K.tomato,'stroke-width':3,'stroke-linejoin':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},p);
   txt(g,546,96,'Workout plan',16,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,976,96,'5 EXERCISES · 45 MIN',10,K.mut,null,500,'end');
   A.ex=[['Squat','4 × 12',2],['Deadlift','4 × 8',2],['Lunges','3 × 12',3],['Leg press','3 × 10',0],['Bike','10 min',1]].map(function(e,i){var y=118+i*82;var row=E('g',{},g);
     var bgR=E('rect',{x:540,y:y,width:436,height:70,rx:12,fill:TINT.white},row);E('circle',{cx:580,cy:y+35,r:20,fill:[TINT.sun,TINT.tom,TINT.mint,TINT.cob,TINT.sun][i]},row);gymIc(row,e[2],580,y+35);
     txt(row,612,y+32,e[0],16,K.ink,'Hanken Grotesk,sans-serif',700);txt(row,612,y+52,e[1],11,K.mut);var ck=E('g',{opacity:0},row);E('circle',{cx:944,cy:y+35,r:15,fill:K.mint},ck);icon(ck,'check',944,y+35,.7);
     return {bg:bgR,ck:ck}})},
 floor:function(g,A){A.fpC=floorPlan(g,true)},
 gen:function(g,A,b){E('rect',{x:24,y:72,width:300,height:200,rx:12,fill:TINT.white},g);E('rect',{x:340,y:72,width:300,height:200,rx:12,fill:TINT.white},g);E('rect',{x:656,y:72,width:320,height:200,rx:12,fill:TINT.white},g)}
};
function buildStack(A,root){var L0=A.SL=E('g',{opacity:0},root);E('rect',{width:1600,height:900,fill:K.tomato},L0);E('rect',{width:1600,height:900,fill:'url(#ht)'},L0);var L=A.SLc=E('g',{},L0);
  A.stk=[];for(var k=BR.length-1;k>=0;k--){var b=BR[k],g=E('g',{},L);
    E('rect',{x:6,y:22,width:SW,height:SH,rx:18,fill:K.ink,opacity:.2},g);E('rect',{x:0,y:0,width:SW,height:SH,rx:16,fill:K.carta},g);
    var body=E('g',{},g);BODY[b.body](body,A,b);var hd=E('g',{},g);head(hd,b,SW,HB);A.stk[k]={g:g,body:body}}
  A.ghost=[0,1,2].map(function(){var gh=E('g',{opacity:0},L);E('rect',{width:240,height:480,rx:36,fill:K.ink},gh);return gh});
  A.bang=E('g',{opacity:0},L);[-60,-25,10,45,80].forEach(function(a,i){var r=a*Math.PI/180;E('path',{d:'M'+f(Math.cos(r)*-40)+' '+f(Math.sin(r)*-40)+' L'+f(Math.cos(r)*-90)+' '+f(Math.sin(r)*-90),stroke:i%2?K.carta:K.ink,'stroke-width':7,'stroke-linecap':'round'},A.bang)});
  var ph=A.ph=E('g',{opacity:0},L);E('rect',{x:8,y:20,width:240,height:480,rx:36,fill:K.ink,opacity:.22},ph);E('rect',{x:0,y:0,width:240,height:480,rx:36,fill:K.ink},ph);
  E('rect',{x:10,y:10,width:220,height:460,rx:27,fill:K.carta},ph);E('rect',{x:90,y:20,width:60,height:10,rx:5,fill:K.ink},ph);
  E('circle',{cx:38,cy:64,r:13,fill:K.sun},ph);icon(ph,'truck',38,64,.7);txt(ph,58,70,'Swift Couriers',16,K.ink,'Hanken Grotesk,sans-serif',700);
  txt(ph,24,106,'Your order',22,K.ink,'Hanken Grotesk,sans-serif',700);
  E('rect',{x:20,y:120,width:200,height:150,rx:14,fill:TINT.land},ph);for(var mi=0;mi<4;mi++){E('rect',{x:20,y:150+mi*34,width:200,height:5,fill:K.carta},ph);E('rect',{x:52+mi*50,y:120,width:5,height:150,fill:K.carta},ph)}
  var prd='M40 252 L40 220 L104 220 L104 152 L196 152';A.pRB=E('path',{d:prd,fill:'none',stroke:K.ink,'stroke-width':3,'stroke-dasharray':'2 6',opacity:.5},ph);
  A.pR=E('path',{d:prd,fill:'none',stroke:K.cobalt,'stroke-width':5,'stroke-linejoin':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},ph);
  E('circle',{cx:196,cy:152,r:7,fill:K.tomato},ph);A.pVan=E('circle',{r:8,fill:K.cobalt,stroke:K.carta,'stroke-width':3},ph);
  txt(ph,24,300,'ARRIVING IN',11,K.mut);A.pEta=txt(ph,24,346,'12 min',40,K.ink,'Hanken Grotesk,sans-serif',700);
  [['Packed',1],['On the way',1],['At door',0]].forEach(function(st,i){var y=374+i*0;var x=28+i*74;E('circle',{cx:x,cy:378,r:6,fill:st[1]?K.mint:TINT.line},ph);txt(ph,x-6,400,st[0],9.5,K.ink)});
  E('rect',{x:20,y:414,width:200,height:44,rx:22,fill:K.sun},ph);txt(ph,120,442,'Call courier',14,K.ink,'Hanken Grotesk,sans-serif',700,'middle')}
/* la sala della pizzeria, vista dall'alto. Disegnata una volta per la card e una per la versione aperta */
var TB18=[];(function(){for(var r=0;r<3;r++)for(var c=0;c<6;c++){var round=(c+r)%3===0;TB18.push({x:72+c*94,y:132+r*124,round:round,seats:round?2:4,id:r*6+c+1})}
  TB18.forEach(function(t){t.rank=Math.hypot(t.x-40,t.y-520)});var o=TB18.slice().sort(function(a,b){return a.rank-b.rank});o.forEach(function(t,i){t.ord=i})})();
var TSTATE=[TINT.white,K.sun,K.cobalt,K.mint,K.tomato];
function floorPlan(g,card){var R={tb:[]};E('rect',{x:20,y:64,width:620,height:476,rx:12,fill:'#EFECE3'},g);txt(g,38,90,'FLOOR · 18 TABLES',11,K.mut);var lgx=358;[['FREE',TINT.white,45],['SEATED',K.sun,56],['ORDERED',K.cobalt,62],['SERVED',K.mint,56],['PAID',K.tomato,45]].forEach(function(q){E('circle',{cx:lgx+4,cy:86,r:4.5,fill:q[1],stroke:K.ink,'stroke-opacity':q[1]===TINT.white?.3:0,'stroke-width':1.2},g);txt(g,lgx+13,90,q[0],9.5,K.mut);lgx+=q[2]});
  E('rect',{x:40,y:486,width:470,height:30,rx:8,fill:TINT.line},g);txt(g,56,506,'BAR',11,K.mut);E('rect',{x:540,y:486,width:80,height:30,rx:8,fill:K.ink},g);txt(g,580,506,'PASS',11,K.carta,null,500,'middle');
  TB18.forEach(function(t){var tg=E('g',{transform:'translate('+t.x+' '+t.y+')'},g);
    if(t.round){[-26,26].forEach(function(dx){E('circle',{cx:dx,cy:0,r:6,fill:K.ink,opacity:.22},tg)});var sh=E('circle',{r:19,fill:TINT.white,stroke:K.ink,'stroke-opacity':.18,'stroke-width':1.5},tg)}
    else{[[-30,-8],[22,-8],[-8,-30],[-8,22]].forEach(function(d){E('rect',{x:d[0],y:d[1],width:d[0]===-8?16:8,height:d[0]===-8?8:16,rx:3,fill:K.ink,opacity:.22},tg)});var sh=E('rect',{x:-20,y:-20,width:40,height:40,rx:7,fill:TINT.white,stroke:K.ink,'stroke-opacity':.18,'stroke-width':1.5},tg)}
    txt(tg,0,4,String(t.id),10,K.ink,null,500,'middle');R.tb.push({g:tg,sh:sh,st:-1,t:t})});
  var kc=E('g',{},g);E('rect',{x:656,y:64,width:324,height:150,rx:12,fill:TINT.white},kc);txt(kc,674,92,'Kitchen',15,K.ink,'Hanken Grotesk,sans-serif',700);txt(kc,962,92,'IN QUEUE',10,K.mut,null,500,'end');
  R.kq=txt(kc,962,124,'0',30,K.ink,'Hanken Grotesk,sans-serif',700,'end');R.kt=[];for(var q=0;q<6;q++){E('rect',{x:674.75+q*48,y:150.75,width:38.5,height:44.5,rx:5,fill:'none',stroke:TINT.line,'stroke-width':1.5,'stroke-dasharray':'4 3'},kc);var kg=E('g',{opacity:0},kc);E('rect',{x:674+q*48,y:150,width:40,height:46,rx:5,fill:K.sun},kg);txt(kg,694+q*48,170,'T'+[7,3,12,5,16,9][q],10.5,K.ink,null,500,'middle');E('rect',{x:682+q*48,y:180,width:24,height:3,rx:1.5,fill:K.ink,opacity:.35},kg);E('rect',{x:682+q*48,y:187,width:16,height:3,rx:1.5,fill:K.ink,opacity:.35},kg);R.kt.push(kg)}
  var dc=E('g',{},g);E('rect',{x:656,y:226,width:324,height:150,rx:12,fill:TINT.white},dc);txt(dc,674,254,'Delivery',15,K.ink,'Hanken Grotesk,sans-serif',700);R.rdn=txt(dc,962,254,'0 RIDERS OUT',10,K.mut,null,500,'end');
  E('rect',{x:674,y:266,width:288,height:96,rx:8,fill:TINT.land},dc);[300,330].forEach(function(y){E('rect',{x:674,y:y,width:288,height:5,fill:K.carta},dc)});[740,820,900].forEach(function(x){E('rect',{x:x,y:266,width:5,height:96,fill:K.carta},dc)});
  R.rd=[0,1,2].map(function(i){return E('circle',{r:6,fill:K.cobalt,stroke:K.carta,'stroke-width':2.5,cx:680,cy:302,opacity:0,style:'display:none'},dc)});
  var tn=E('g',{},g);E('rect',{x:656,y:388,width:324,height:152,rx:12,fill:K.ink},tn);txt(tn,674,416,'TONIGHT',10,K.carta,null,500);txt(tn,674,446,'COVERS',10,K.sun);R.cov=txt(tn,674,494,'38',40,K.carta,'Hanken Grotesk,sans-serif',700);
  txt(tn,820,446,'REVENUE',10,K.sun);R.rev=txt(tn,820,494,'€ 1,140',30,K.carta,'Hanken Grotesk,sans-serif',700);
  R.res=E('g',{opacity:0},g);E('rect',{x:0,y:0,width:196,height:40,rx:20,fill:K.ink},R.res);E('circle',{cx:22,cy:20,r:7,fill:K.sun},R.res);txt(R.res,38,25,'Ross · 4 · 21:00',13,K.carta);
  R.flow=[];for(var c0=0;c0<8;c0++)R.flow.push(E('path',{fill:'none',stroke:K.tomato,'stroke-width':2.4,'stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1,opacity:0},g));
  R.chips=[];for(var c=0;c<8;c++)R.chips.push(E('rect',{width:26,height:18,rx:4,fill:K.tomato,opacity:0},g));
  R.kd=E('path',{d:'M818 214 V226',stroke:K.cobalt,'stroke-width':3,fill:'none',opacity:0},g);
  R.spark=E('path',{fill:'none',stroke:K.sun,'stroke-width':2.4,'stroke-linejoin':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},tn);R.sparkD=[];
  return R}
function setTable(T,st){if(T.st===st)return;T.st=st;T.sh.setAttribute('fill',TSTATE[st]);T.sh.setAttribute('stroke-opacity',st?0:.18)}
var CARD_SEATED=[2,5,9,10,14,17];
/* coreografia: le card si alzano, tre fanno vedere la loro funzione e vengono buttate via, la pizzeria si apre */
var SWP=[[1.5,1.78],[3.22,3.5],[4.44,4.72]],EXP=[5.35,5.85],PEEK=[[-300,850,-16],[1880,40,14],[-330,165,-9]];
function stkShift(v){var s=0;SWP.forEach(function(w){s+=ez.io3(P(v,w[0],w[1]))});return s}
function phBump(v){return ez.io3(P(v,2.12,2.5))}
function cardGeom(k,v){var f2=k-stkShift(v),cx=800,cy,s,rot=0,o=1;
  var qx=1,qy=1;cy=505-Math.max(0,f2)*42;s=1-Math.max(0,f2)*.055;
  if(k===1){var bb=phBump(v);cx-=140*bb;s*=1-.16*bb}
  if(f2<0&&k<3){var e=ez.io3(Math.min(1,-f2)),dd=PEEK[k],ex0=ez.io3(P(v,EXP[0],EXP[1])),dx=dd[0]<800?-1:1,dy=dd[1]<450?-1:1;cx=lerp(cx,dd[0]+dx*700*ex0,e);cy=lerp(cy,dd[1]+dy*500*ex0,e);rot=lerp(rot,dd[2],e);s=lerp(s,1,e)}
  var d=(BR.length-1-k)*.045,ri=ez.out3(P(v,d,d+.5));cy+=820*(1-ri);
  var ex=ez.io3(P(v,EXP[0],EXP[1]));if(k===3){cy=lerp(cy,450,ex);s=lerp(s,1360/SW,ex)}else if(k>3){o=1-ex;cy+=240*ex}
  return {cx:cx,cy:cy,s:s,rot:rot,o:o,ex:ex,qx:qx,qy:qy}}
function renderStack(A,t){var v=t-STK0,on=v>=0&&v<STKD+.12;op(A.SL,on?1:0);if(!on)return;
  A.stk.forEach(function(c,k){var G2=cardGeom(k,v);c.g.setAttribute('transform','translate('+f(G2.cx)+' '+f(G2.cy)+') rotate('+f(G2.rot)+') scale('+f(G2.s*G2.qx)+' '+f(G2.s*G2.qy)+') translate('+(-SW/2)+' '+(-SH/2)+')');op(c.g,G2.o)});

  /* clinica: l'appuntamento entra da fuori e si incastra */
  var a1=ez.out3(P(v,.62,.98)),la=P(v,.98,1.12);A.cNew.setAttribute('transform','translate('+f(lerp(1180,396,a1))+' '+f(lerp(-80,300,a1))+') rotate('+f(16*(1-a1))+' 140 40) scale('+f(1.35-.35*a1+.04*Math.sin(Math.PI*la))+')');
  op(A.cSlot,1-P(v,.95,1.0));op(A.cNew,v>.6?1:0);A.cLink.setAttribute('stroke-dashoffset',f(1-ez.io3(P(v,1.02,1.14))));var sm=ez.back(P(v,1.1,1.1+D.med),1.3);op(A.cSms,v>1.1?1:0);A.cSms.setAttribute('transform','translate(704 296) scale('+f(.6+.4*sm)+')');
  /* logistica: il furgone entra e segue il percorso; l'ETA scende, gli stati cambiano */
  var rp=ez.io3(P(v,1.95,3.05));A.rLine.setAttribute('stroke-dashoffset',f(1-rp));var len=A.rBase.getTotalLength?A.rBase.getTotalLength():1;
  var vin=ez.out3(P(v,1.8,1.98)),pt=A.rBase.getPointAtLength?A.rBase.getPointAtLength(len*rp):{x:60,y:500};op(A.van,v>1.78?1:0);A.van.setAttribute('transform','translate('+f(lerp(-260,pt.x,vin))+' '+f(lerp(620,pt.y,vin))+')');
  A.eta.setAttribute('transform','translate('+f(pt.x+26)+' '+f(pt.y-56)+')');A.etaT.textContent='ETA '+Math.max(1,Math.round(12-11*rp))+' MIN';
  A.etaRing.setAttribute('stroke-dashoffset',f(1-rp));A.etaN.textContent=String(Math.max(1,Math.round(12-11*rp)));
  var lv=rp*3;A.tlFill.setAttribute('height',f(170*Math.min(1,lv/3)));A.tl.forEach(function(st,i){var on2=v>1.85&&lv>=i-.02;st.d.setAttribute('fill',on2?K.cobalt:TINT.white);st.d.setAttribute('stroke',on2?K.cobalt:TINT.line);st.l.setAttribute('opacity',on2?1:.4)});
  /* telefono: entra di corsa con la scia, colpisce il desktop (scossa, schiacciamento), rimbalza e si sistema accanto; poi resta a pezzo in basso a destra */
  /* il telefono scivola dentro mentre il desktop gli fa spazio; un'inclinazione che si raddrizza e un'ombra che si posa */
  var pi=ez.out3(P(v,2.06,2.48)),pe=ez.io3(P(v,3.22,3.5)),pex=ez.io3(P(v,EXP[0],EXP[1]));op(A.ph,v>2.04?1-P(v,EXP[0]+.3,EXP[1]):0);
  var pxx=lerp(1820,1100,pi),pyy=lerp(330,265,pi)-14*Math.sin(Math.PI*pi),prt=lerp(10,0,ez.io3(P(v,2.1,2.55)));
  pxx=lerp(pxx,1470+300*pex,pe);pyy=lerp(pyy,590+300*pex,pe);prt=lerp(prt,20,pe);
  A.ph.setAttribute('transform','translate('+f(pxx)+' '+f(pyy)+') rotate('+f(prt)+' 120 240)');
  A.ghost.forEach(function(gh){op(gh,0)});op(A.bang,0);
  A.pR.setAttribute('stroke-dashoffset',f(1-rp));var pl=A.pRB.getTotalLength?A.pRB.getTotalLength():1,pp=A.pRB.getPointAtLength?A.pRB.getPointAtLength(pl*rp):{x:40,y:252};
  A.pVan.setAttribute('cx',f(pp.x));A.pVan.setAttribute('cy',f(pp.y));A.pEta.textContent=Math.max(1,Math.round(12-11*rp))+' min';
  /* palestra: il badge entra, scansione, benvenuto, il corso si riempie */
  var rg=[ez.io3(P(v,3.55,4.25)),ez.io3(P(v,3.62,4.3)),ez.io3(P(v,3.7,4.32))],tgt=[.86,.78,.92];A.rings.forEach(function(r,i){r.setAttribute('stroke-dashoffset',f(1-tgt[i]*rg[i]))});
  A.ringPct.textContent=Math.round(82*rg[0])+'%';A.hr.setAttribute('stroke-dashoffset',f(1-ez.io3(P(v,3.55,4.3))));A.bpm.textContent=String(Math.round(128+14*ez.io3(P(v,3.6,4.3))));
  A.ex.forEach(function(e,i){var a=3.66+i*.17,done=v>a&&i<4,cur=v>a-.17&&!done&&i<=4&&v>3.55;op(e.ck,done?ez.back(P(v,a,a+.15)):0);e.bg.setAttribute('fill',cur?TINT.sun:TINT.white)});
  /* cucina: un ordine nuovo cade nella colonna, uno passa a pronto */
  var C=A.fpC,T7=TB18[6];C.tb.forEach(function(T,i){setTable(T,CARD_SEATED.indexOf(i)>=0?(i%3===0?3:1):0)});
  var rk=ez.out3(P(v,4.8,5.08)),rl=P(v,5.08,5.2);op(C.res,v>4.78?1-P(v,5.18,5.26):0);C.res.setAttribute('transform','translate('+f(lerp(1150,T7.x-98,rk))+' '+f(lerp(-120,T7.y-58,rk))+') rotate('+f(14*(1-rk))+' 98 20)');
  if(v>5.16){setTable(C.tb[6],1);var pp2=ez.back(P(v,5.16,5.36),2);C.tb[6].g.setAttribute('transform','translate('+T7.x+' '+T7.y+') scale('+f(.7+.3*pp2)+')')}else C.tb[6].g.setAttribute('transform','translate('+T7.x+' '+T7.y+')');
  C.cov.textContent=v>5.16?'42':'38'}
function curStk(v,A){var off=[1750,1100];function go(a,b,t0,t1){var p=ez.io3(P(v,t0,t1));return [lerp(a[0],b[0],p),lerp(a[1],b[1],p)-Math.sin(p*Math.PI)*40]}
  function grab(k){var g=cardGeom(Math.min(k,2),Math.min(v,SWP[k][0]));return [g.cx+260*g.s,g.cy+120*g.s]}
  if(v<1.25)return off;if(v<1.5)return go(off,grab(0),1.25,1.5);if(v<1.62)return grab(0);if(v<1.95)return go(grab(0),off,1.62,1.95);
  if(v<2.97)return off;if(v<3.22)return go(off,grab(1),2.97,3.22);if(v<3.34)return grab(1);if(v<3.7)return go(grab(1),off,3.34,3.7);
  if(v<4.19)return off;if(v<4.44)return go(off,grab(2),4.19,4.44);if(v<4.56)return grab(2);
  var g3=cardGeom(3,v),hd=[g3.cx+(-SW/2+150)*g3.s,g3.cy+(-SH/2+24)*g3.s];if(v<5.25)return go(grab(2),hd,4.72,5.1);if(v<5.45)return hd;return go(hd,off,5.45,5.8)}
function stkPress(v){return (v>1.5&&v<1.62)||(v>3.22&&v<3.34)||(v>4.44&&v<4.56)||(v>5.22&&v<5.32)}
/* ---------- momento 3: la pizzeria aperta. Start service: il venerdì sera si mette in moto da solo ---------- */
function buildDash(A,root){var L=A.DL=E('g',{opacity:0},root);E('rect',{width:1600,height:900,fill:K.tomato},L);E('rect',{width:1600,height:900,fill:'url(#ht)'},L);
  A.dgrid=E('g',{},L);A.dcam=E('g',{},L);L=A.dcam;var W=A.win=E('g',{},L);E('rect',{x:128,y:100,width:1360,height:760,rx:22,fill:K.ink,opacity:.2},W);var in_=E('g',{'clip-path':'url(#cpW)'},W);
  E('rect',{x:120,y:70,width:1360,height:760,rx:22,fill:K.carta},in_);var hb=E('g',{transform:'translate(120 70) scale(1.36)'},in_);var b3={};for(var kk in BR[3])b3[kk]=BR[3][kk];b3.meta='';A.sb=head(hb,b3,SW,HB);
  A.cnt=txt(in_,1450,108,'FLOOR · FRI 20:30',16,K.carta,null,500,'end');
  var body=E('g',{transform:'translate(120 70) scale(1.36)'},in_);A.fpB=floorPlan(body,false);

  A.stamp=E('g',{opacity:0},body);var st=E('g',{transform:'rotate(-8)'},A.stamp);E('rect',{x:-170,y:-42,width:340,height:84,rx:12,fill:K.carta,opacity:.9},st);E('rect',{x:-170,y:-42,width:340,height:84,rx:12,fill:'none',stroke:K.tomato,'stroke-width':6},st);txt(st,0,15,'FULL HOUSE ✓',40,K.tomato,'Hanken Grotesk,sans-serif',800,'middle');
  A.toast=E('g',{opacity:0},L);E('rect',{x:6,y:12,width:380,height:72,rx:36,fill:K.ink,opacity:.25},A.toast);E('rect',{x:0,y:0,width:380,height:72,rx:36,fill:K.ink},A.toast);E('circle',{cx:38,cy:36,r:9,fill:K.mint},A.toast);
  txt(A.toast,62,32,'Friday night · 214 covers',18,K.carta,'Hanken Grotesk,sans-serif',700);txt(A.toast,62,54,'0 ERRORS · AUTOPILOT',12,K.sun)}
function svT(i){return 10.45+TB18[i].ord*.055}
function renderDash(A,t){var on=t>9.9&&t<12.9;op(A.DL,on?1:0);if(!on)return;op(A.dgrid,0);var B=A.fpB;
  op(A.win,1);
  var B2=A.sb,live=t>10.36,hov=t>10.2&&!live,prs=P(t,10.3,10.34)*(1-P(t,10.36,10.42)),done2=t>11.65;
  B2.r.setAttribute('fill',live?K.ink:hov?K.sun:K.carta);B2.t.setAttribute('fill',live?K.carta:K.ink);B2.t.textContent=done2?'Service complete':live?'Service live':'Start service';
  op(B2.pl,live?0:1);op(B2.dt,live?1:0);B2.dt.setAttribute('r',f(done2?4.5:4.5+1.6*Math.max(0,Math.sin((t-10.36)*9))));
  B2.b.setAttribute('transform','translate(80 15) scale('+f(1-.06*prs)+') translate(-80 -15)');
  A.cnt.textContent=t>11.65?'0 ERRORS · FRI 20:30':t>10.36?'LIVE · FRI 20:30':'FLOOR · FRI 20:30';
  B.tb.forEach(function(T,i){var s0=svT(i),st=CARD_SEATED.indexOf(i)>=0||i===6?(i%3===0?3:1):0;if(t>s0)st=1;if(t>s0+.22)st=2;if(t>s0+.5)st=3;if(t>s0+.82&&T.t.ord%4===0)st=4;setTable(T,st);
    var pp=P(t,s0,s0+.2),d2=P(t,11.62+T.t.ord*.012,11.82+T.t.ord*.012),sc=pp>0&&pp<1?1+.18*Math.sin(Math.PI*pp):d2>0&&d2<1?1+.14*Math.sin(Math.PI*d2):1,tr='translate('+T.t.x+' '+T.t.y+') scale('+f(sc)+')';if(T._tr!==tr){T._tr=tr;T.g.setAttribute('transform',tr)}});
  B.chips.forEach(function(c,i){var T=TB18[(i*5+3)%18],a=svT((i*5+3)%18)+.22,p=P(t,a,a+.35),tx=700+(i%6)*48;op(c,p>0&&p<1?1:0);var x=lerp(T.x,tx,ez.io3(p)),y=lerp(T.y,170,ez.io3(p))-60*Math.sin(Math.PI*p);c.setAttribute('x',f(x-13));c.setAttribute('y',f(y-9));
    var fl=B.flow[i];if(!fl._d){fl.setAttribute('d','M'+T.x+' '+T.y+' Q'+f((T.x+tx)/2)+' '+f(Math.min(T.y,170)-70)+' '+tx+' 170');fl._d=1}fl.setAttribute('stroke-dashoffset',f(1-ez.io3(p)));op(fl,p>0?.55*(1-P(t,a+.35,a+.55))*(1-P(t,11.45,11.6)):0)});
  op(B.kd,t>10.7&&t<11.7?1:0);
  if(!B.sparkD.length){for(var q=0;q<=24;q++)B.sparkD.push([674+q*12,532-14*(q/24)-6*Math.sin(q*.9)*(q/24)]);B.spark.setAttribute('d','M'+B.sparkD.map(function(p){return f(p[0])+' '+f(p[1])}).join('L'))}
  var kq=Math.round(Math.min(6,Math.max(0,(t-10.6)*9))*(1-P(t,11.4,11.8))+2*P(t,11.4,11.8));B.kq.textContent=String(t>10.5?kq+6:0);B.kt.forEach(function(k,i){op(k,t>10.62+i*.08?(i%2?.55:1):0)});
  var rp=P(t,10.7,11.7);B.rd.forEach(function(r,i){var u=cl(rp*1.4-i*.2);op(r,t>10.7+i*.1?1:0);r.setAttribute('cx',f(680+270*u));r.setAttribute('cy',f([302,332,272][i]+(i===2?30*u:0)))});B.rdn.textContent=(t>10.7?Math.min(6,1+Math.floor((t-10.7)*7)):0)+' RIDERS OUT';
  var cv=ez.io3(P(t,10.42,11.6));B.spark.setAttribute('stroke-dashoffset',f(1-cv));B.cov.textContent=String(Math.round(42+(214-42)*cv));B.rev.textContent='€ '+Math.round(1140+(4860-1140)*cv).toLocaleString('en-US');
  op(A.stamp,0);
  var ts=ez.back(P(t,11.78,11.78+D.med),1.3);op(A.toast,t>11.78?1:0);A.toast.setAttribute('transform','translate('+f(1140+460*(1-ts))+' 786)');
}
/* ---------- momento 4: chiusura e loop ---------- */
function buildEnd(A,root){var L=A.EL=E('g',{opacity:0},root);
  var cpEC=E('clipPath',{id:'cpEC'},L);A.eCc=E('circle',{cx:800,cy:410,r:0},cpEC);
  var xi=A.eXi=E('g',{transform:'translate(277.5 639.8) scale(.27)'},L);U('lgM',{fill:K.ink,'clip-path':'url(#cpEM)'},xi);E('path',{d:LGP.t0,fill:K.ink,'clip-path':'url(#cpE0)'},xi);E('path',{d:LGP.t1,fill:K.ink,'clip-path':'url(#cpE1)'},xi);
  A.eC=E('circle',{cx:800,cy:410,r:0,fill:K.ink},L);
  var g=A.eG=E('g',{'clip-path':'url(#cpEC)'},L),x=A.eX=E('g',{transform:'translate(277.5 639.8) scale(.27)'},g);
  var cpEM=E('clipPath',{id:'cpEM'},x);A.emr=E('rect',{x:-80,y:0,width:840,height:0},cpEM);
  A.eFill=U('lgM',{fill:K.carta,'clip-path':'url(#cpEM)'},x);
  E('path',{d:LGP.t0,fill:K.carta,'clip-path':'url(#cpE0)'},x);E('path',{d:LGP.t1,fill:K.carta,'clip-path':'url(#cpE1)'},x);
  /* la frase in DM Mono maiuscolo, spaziata: geometrica e a tratto unico come il logo, stesso bianco */
  A.tagl=txt(L,800,770,'THE MACHINE BEHIND YOUR BUSINESS.',30,K.carta,'DM Mono,monospace',500,'middle');A.tagl.setAttribute('letter-spacing','5');
  A.url=txt(L,800,814,'mothermachine.studio',15,K.carta,'Hanken Grotesk,sans-serif',400,'middle');A.url.setAttribute('opacity',0)}
function renderEnd(A,t){var on=t>12.4;op(A.EL,on?1:0);if(!on)return;
  var back=ez.io3(P(t,14.6,15.02)),opn=P(t,12.42,12.42+D.slow*.8),cy=410+40*ez.io3(P(t,14.6,15.02)),cx=800,r;
  /* il nero nasce dal pallino verde della notifica (0 errori) e copre tutto; poi, a schermo pieno, il centro passa sul logo */
  if(opn<1){cx=1178;cy=822;r=9+2100*ez.io3(opn)}else r=1900*(1-back);
  [A.eC,A.eCc].forEach(function(c){c.setAttribute('r',f(r));c.setAttribute('cx',f(cx));c.setAttribute('cy',f(cy))});
  var mh=1500*ez.io3(P(t,12.72,12.72+D.slow));A.emr.setAttribute('y',f(-mh+10));A.emr.setAttribute('height',f(mh));
  var w0=ez.io3(P(t,13.3,13.72)),w1=ez.io3(P(t,13.38,13.8));A.e0r.setAttribute('width',f(2700*w0));A.e1r.setAttribute('width',f(3200*w1));
  var LT='translate(277.5 '+f(639.8+cy-410)+') scale(.27)';A.eX.setAttribute('transform',LT);A.eXi.setAttribute('transform',LT);
  var tp=ez.out3(P(t,13.8,13.8+D.slow));op(A.tagl,tp*(1-P(t,14.45,14.6)));A.tagl.setAttribute('transform','translate(0 '+f(14*(1-tp))+')');
  if(MM_URL)op(A.url,.6*P(t,14.0,14.0+D.med)*(1-P(t,14.45,14.6)));}
function cur2(t,A){
  var off=[1750,1100];function go(a,b,t0,t1){var p=ez.io3(P(t,t0,t1));return [lerp(a[0],b[0],p),lerp(a[1],b[1],p)-Math.sin(p*Math.PI)*40]}
  var k0=[SY.x0+4,SY.y+6];
  if(t<7.9)return off;if(t<8.2)return go(off,k0,7.9,8.2);
  if(t<8.95){var w=wghtAt(t);return [SY.x0+(SY.x1-SY.x0)*(w-100)/800+4,SY.y+6]}
  if(t<9.35)return go([SY.x1+4,SY.y+6],off,8.95,9.35);
  var T=[120+742*1.36,70+22*1.36];
  if(t<10.05)return off;if(t<10.3)return go(off,T,10.05,10.3);if(t<10.42)return T;if(t<10.75)return go(T,off,10.42,10.75);return off}
/* prima dell'inizio: si parte dal logo intero, che si smonta (parole che rientrano, la m che perde un piano), salta via e ricade */
function renderPre(A,p){var w=1-ez.io3(P(p,0,.36));A.t0r.setAttribute('width',f(2700*w));A.t1r.setAttribute('width',f(3200*w));op(A.car0,0);op(A.car1,0);
  var g=1-ez.io3(P(p,.26,.56)),dy=940*(1-g);A.ink.fr.setAttribute('transform','translate(0 '+f(dy)+')');
  /* anticipazione schiacciata, poi lancio: parte veloce e rallenta salendo, allungata nella direzione del moto */
  var k=ez.io3(P(p,.3,.62)),sq=Math.sin(Math.PI*P(p,.56,.7)),jp=P(p,.66,1),up=-770*(1-(1-jp)*(1-jp));
  var sx=1+.15*sq,sy=1-.22*sq;if(jp>0){sy=1+.22*(1-jp);sx=1-.1*(1-jp)}
  A.ink.x.setAttribute('transform','translate('+f(lerp(369.3,800,k))+' '+f(lerp(679.8,700,k)+up)+') scale('+f(lerp(.27,.36,k)*sx)+' '+f(lerp(.27,.36,k)*sy)+') translate(-340 0)')}
function render(A,t){
  var tr=cl(t/DUR0)*DUR0,pre=tr<PREr;t=pre?0:MAP(tr-PREr);
  var L=LX(t);
  var T='translate('+f(L.X)+' '+f(L.Y)+') skewX('+f(L.sk||0)+') scale('+f(L.s*L.sx)+' '+f(L.s*L.sy)+') translate('+f(-L.ax)+' '+f(-L.ay)+')';
  A.ink.x.setAttribute('transform',T);A.cart.x.setAttribute('transform',T);A.outl.setAttribute('transform',T);
  /* la m cresce di un piano */
  var grow=ez.back(P(t,.55,.95),1.6),dy=940*(1-grow);A.ink.fr.setAttribute('transform','translate(0 '+f(dy)+')');A.cart.fr.setAttribute('transform','translate(0 '+f(dy)+')');
  /* le parole si scrivono, guidate da un cursore pomodoro */
  var p0=ez.io3(P(t,.98,1.42)),p1=ez.io3(P(t,1.08,1.52));
  A.t0r.setAttribute('width',f(2700*p0));A.t1r.setAttribute('width',f(3200*p1));
  A.car0.setAttribute('x',f(740+2700*p0));op(A.car0,t>.98&&t<1.5?1:0);A.car0.setAttribute('width',f(64*(1-P(t,1.38,1.5))));
  A.car1.setAttribute('x',f(740+3080*p1));op(A.car1,t>1.08&&t<1.6?1:0);A.car1.setAttribute('width',f(64*(1-P(t,1.48,1.6))));
  /* selezione */
  var bA=mp(L,0,-1718),bB=mp(L,3871,10),pad=16,bx=bA[0]-pad,by=bA[1]-pad,bw=bB[0]-bA[0]+pad*2,bh=bB[1]-bA[1]+pad*2;
  var selOn=t>1.42&&t<3.9;op(A.sel,selOn?1-P(t,3.82,3.9):0);
  A.box.setAttribute('x',f(bx));A.box.setAttribute('y',f(by));A.box.setAttribute('width',f(bw));A.box.setAttribute('height',f(bh));
  A.box.setAttribute('stroke-dashoffset',f(1-ez.out3(P(t,1.42,1.72))));
  var hp=[[0,0],[.5,0],[1,0],[1,.5],[1,1],[.5,1],[0,1],[0,.5]];
  A.hd.forEach(function(h,i){var s=ez.back(P(t,1.52+i*.025,1.77+i*.025));var x=bx+bw*hp[i][0],y=by+bh*hp[i][1];
    var grab=(i===3&&t>2.05&&t<2.62)?1.35:1;h.setAttribute('transform','translate('+f(x)+' '+f(y)+') scale('+f(s*grab)+') translate(-6 -6)');h.setAttribute('fill',i===3&&t>2.05&&t<2.62?K.cobalt:'#fff')});
  var W=Math.round(bw-pad*2),H=Math.round(bh-pad*2);A.dimT.textContent=W+' × '+H;var dw=W>999?118:104;
  A.dimR.setAttribute('x',f(-dw/2));A.dimR.setAttribute('width',dw);A.dimR.setAttribute('fill',(t>2.1&&t<2.62)?K.tomato:K.cobalt);
  A.dim.setAttribute('transform','translate('+f(bx+bw/2)+' '+f(by+bh+12)+')');op(A.dim,P(t,1.64,1.78));
  A.nm.setAttribute('x',f(bx));A.nm.setAttribute('y',f(by-12));op(A.nm,P(t,1.62,1.76));
  /* cursore */
  var CM=camAt(t);op(A.cam,t>7.02?0:1);A.cam.setAttribute('transform','translate('+f(CM.sx)+' '+f(CM.sy)+') scale('+f(CM.s)+') translate('+f(-CM.px)+' '+f(-CM.py)+')');
  var c=curAt(t,A),cs=t<6.45?[CM.sx+(c[0]-CM.px)*CM.s,CM.sy+(c[1]-CM.py)*CM.s]:c;var t2c=t>RUN0?Math.max(RUN0,t-OFF):t;if(t>=6.45)cs=cur2(t2c,A);if(t>=STK0&&t<STK0+STKD+.1)cs=curStk(t-STK0,A);
  var vS=t-STK0,press=(t>2.03&&t<2.62)||(t>3.86&&t<3.98)||(t>5.8&&t<5.9)||(t>8.15&&t<8.95)||(t2c>10.3&&t2c<10.38)||stkPress(vS)?.86:1;A.cur.setAttribute('transform','translate('+f(cs[0])+' '+f(cs[1])+') scale('+press+')');
  /* "non si deforma" */
  var tg=ez.back(P(t,2.42,2.62)),tgo=P(t,3.0,3.12);op(A.tag,t>2.42?1-tgo:0);A.tag.setAttribute('transform','translate('+f(bx+bw/2-86)+' '+f(by+bh+66)+') scale('+f(tg)+')');
  /* contorni: ⌘Y */
  var om=t>3.24&&t<3.52;op(A.outl,om?1:0);op(A.ink.g,(om||t>4.3)?0:1);
  op(A.key,t>3.14&&t<3.7?1:0);A.key.setAttribute('transform','translate(56 '+f(826+30*(1-ez.out3(P(t,3.14,3.3))))+')');
  /* campioni */
  A.sw.forEach(function(g,i){var s=ez.back(P(t,3.42+i*.04,3.64+i*.04)),o=1-P(t,4.05,4.25);op(g,t>3.42?o:0);g.setAttribute('transform','translate('+f(672+i*64)+' 800) scale('+f(s)+')')});
  A.ring.setAttribute('cx',672);A.ring.setAttribute('cy',800);op(A.ring,t>3.9?1-P(t,4.05,4.25):0);
  /* click */
  var ck=P(t,3.9,4.25);A.clk.setAttribute('cx',672);A.clk.setAttribute('cy',800);A.clk.setAttribute('r',f(10+60*ez.out3(ck)));op(A.clk,ck>0&&ck<1?1-ck:0);
  /* allagamento: cerchio dal click, poi diventa la cella */
  var fr=ez.in3(P(t,3.92,4.34))*1;A.flC.setAttribute('cx',672);A.flC.setAttribute('cy',800);A.flC.setAttribute('r',f(t<4.36?1900*Math.sqrt(fr):0));
  var g2=ez.io3(P(t,4.4,4.92)),cx=cellXY(MAIN);
  if(t>=4.36){A.flR.setAttribute('x',f(lerp(0,cx[0],g2)));A.flR.setAttribute('y',f(lerp(0,cx[1],g2)));A.flR.setAttribute('width',f(lerp(1600,CW,g2)));A.flR.setAttribute('height',f(lerp(900,CH,g2)));A.flR.setAttribute('rx',f(18*g2))}
  else A.flR.setAttribute('width',0);
  /* griglia di varianti */
  A.cells.forEach(function(cc,i){if(!cc)return;var dx=(i%4)-(MAIN%4),dyy=Math.floor(i/4)-Math.floor(MAIN/4),d=Math.hypot(dx,dyy);
    var a=4.62+d*.075+(i%3)*.02,p=P(t,a,a+.5),s=.9+.1*ez.back(p,1.4),r=(1-ez.out3(p))*((i%2)?-3:3);
    var d6=Math.hypot((i%4)-2,Math.floor(i/4)-1),fa=5.92+d6*.06,q=P(t,fa,fa+.2),fy=Math.abs(Math.cos(Math.PI*q));
    if(cc.b){op(cc.a,q>.5?0:1);op(cc.b,q>.5?1:0)}
    cc.g.setAttribute('transform','translate('+f(cc.x+CW/2)+' '+f(cc.y+CH/2+36*(1-ez.out3(p)))+') rotate('+f(r)+') scale('+f(s)+' '+f(s*Math.max(fy,.02))+') translate('+(-CW/2)+' '+(-CH/2)+')');op(cc.g,ez.out3(P(t,a,a+D.fast)))});
  A.floodR.setAttribute('fill',t>5.92+.06+.1?K.cobalt:K.tomato);
  /* sbuffo di puntini quando la m tocca terra */
  /* righe guida: quando la m tocca terra si tracciano linea di base e altezza della x; quando cresce, l'ascendente */
  /* le righe seguono il logo: stessa trasformazione, quindi restano esatte anche quando la camera si muove */
  var go=1-P(t,1.3,1.3+D.med),LG0=LX(Math.min(t,1.6)),cxm=mp(LG0,340,0)[0];
  A.gd.forEach(function(q,i){var a=[.36,.44,.72][i],p=ez.io3(P(t,a,a+D.slow)),hw=680*p,y=mp(LG0,0,[0,-528,-1468][i])[1];
    op(q.g,t>a?go:0);q.l.setAttribute('x1',f(cxm-hw));q.l.setAttribute('x2',f(cxm+hw));q.l.setAttribute('y1',f(y));q.l.setAttribute('y2',f(y));
    q.lb.setAttribute('x',f(cxm-680));q.lb.setAttribute('y',f(y-9));q.vl.setAttribute('x',f(cxm+680));q.vl.setAttribute('y',f(y-9));var lo=P(t,a+.22,a+.22+D.fast);op(q.lb,lo);op(q.vl,lo)});
  A.gv.forEach(function(l,i){var a=.48+i*.05,p=ez.io3(P(t,a,a+D.slow)),b=mp(LG0,i?696:-16,40),tp=mp(LG0,0,-528-940*ez.back(P(t,.55,.95),1.6)-40);
    l.setAttribute('x1',f(b[0]));l.setAttribute('x2',f(b[0]));l.setAttribute('y1',f(b[1]));l.setAttribute('y2',f(lerp(b[1],tp[1],p)));op(l,t>a?.9*go:0)});
  /* retino sul bordo dell'allagamento: puntini che crescono fino a diventare colore pieno */
  var R0=t<4.36?1900*Math.sqrt(fr):0,BND=230;
  if(t>3.9&&t<4.4){A.flC.setAttribute('r',f(Math.max(0,R0-BND*.82)));A.fd.forEach(function(d){var dd=Math.hypot(d.x-672,d.y-800),u=(R0-dd)/BND,r=u<=0||u>=.9?0:12.2*Math.pow(u/.9,.75);if(Math.abs(r-d.r)>.05){d.r=r;d.e.setAttribute('r',f(r))}});A.fdOn=1}
  else if(A.fdOn){A.fd.forEach(function(d){d.r=0;d.e.setAttribute('r',0)});A.fdOn=0}
  /* micro-loop nelle schede */
  if(CELL.aa&&t<6.975)CELL.aa.style.fontWeight=Math.round(t>4.9?520+360*Math.sin(tr*2.6):700);
  A.htBc.setAttribute('r',f(24+9*Math.sin(tr*3.2)));
  if(CELL.ol)CELL.ol.setAttribute('stroke-dashoffset',f(-tr*520));
  if(CELL.nt){var nn=ez.back(P(t,5.3,5.3+D.med));op(CELL.nt,nn>0?1:0);CELL.nt.setAttribute('transform','translate(0 '+f(-30*(1-nn))+')')}
  if(CELL.pal)CELL.pal.forEach(function(r,i){var w=Math.max(0,Math.sin(tr*3.6-i*.8));r.setAttribute('y',f(50-16*w*w*(t>4.95?1:0)))});
  if(CELL.blk){var bk=tr*1.4,st=Math.floor(bk),fx=ez.io3(cl((bk-st)*2.2)),pos=[0,4,6,2],a0=pos[((st%4)+4)%4],a1=pos[((st+1)%4+4)%4];CELL.blk.setAttribute('x',f(20+27.5*(t>4.9?lerp(a0,a1,fx):0)))}
  if(CELL2.line)CELL2.line.setAttribute('stroke-dashoffset',f(1-ez.io3(P(t,6.08,6.08+D.slow))));
  op(A.flood,t>3.9?1:0);op(A.cart.g,t>3.9?1:0);op(A.fdg,t>3.9&&t<4.4?1:0);op(A.cg,t>4.55&&t<7.05?1:0);
  var t2=t>RUN0?Math.max(RUN0,t-OFF):t;
  renderType(A,t,tr);renderRun(A,t,tr);renderStack(A,t);if(pre)renderPre(A,tr/PREr);renderDash(A,t2);renderEnd(A,t2);
  /* piccoli segni di vita nelle celle */
  if(CELL.caret)op(CELL.caret,Math.floor(tr*2.4)%2?1:0);
  if(CELL.tgK){var on=P(t,5.85,6.02);CELL.tgK.setAttribute('cx',f(21+42*ez.back(on)*(on>0?1:0)));CELL.tgB.setAttribute('fill',on>.5?K.tomato:K.ink)}
  if(CELL.bars)CELL.bars.forEach(function(b,i){var hgt=[60,96,74,130,112,160,142][i]*ez.back(P(t,4.9+i*.04,5.25+i*.04));b.setAttribute('y',f(200-hgt));b.setAttribute('height',f(Math.max(0,hgt)))});
}
/* da tempo dell'animazione a secondi reali: serve al suono per cadere sul fotogramma giusto */
function REAL0(a){var ta=TB.ta,lo=0,hi=ta.length-1;if(a<=0)return PREr;if(a>=ta[hi])return PREr+hi*TB.dt;while(hi-lo>1){var m=(lo+hi)>>1;if(ta[m]<a)lo=m;else hi=m}var fr=(a-ta[lo])/Math.max(1e-9,ta[hi]-ta[lo]);return PREr+(lo+fr)*TB.dt}
/* montaggio sulla musica: il film si allunga o si accorcia di pochissimo perché ogni taglio grande cada sull'inizio di una battuta.
   La musica va dritta a 131 BPM, senza mai ripartire. [tempo dell'animazione, battito] */
var BPM=131,BT=60/BPM,WAN=[3.92,6.98,RUN0+.14,STK0,10.36+OFF,11.66+OFF,12.42+OFF,15.02+OFF],WAB=[11,20,28,40,64,68,72,82];
var WO,WM,DUR,API;
function pw(x,X,Y){if(x<=X[0])return Y[0];for(var i=1;i<X.length;i++)if(x<=X[i])return Y[i-1]+(Y[i]-Y[i-1])*(x-X[i-1])/(X[i]-X[i-1]);return Y[Y.length-1]+(x-X[X.length-1])}
/* ms: dove cade ogni taglio nella musica, in secondi. Di base i battiti a 131 BPM; con una traccia vera arrivano dall'analisi dei suoi battiti */
function setWarp(ms,bpm){WO=[0];WM=[0];WAN.forEach(function(a,i){WO.push(REAL0(a));WM.push(ms[i])});WO.push(DUR0);WM.push(WM[WM.length-1]+DUR0-WO[WO.length-2]);DUR=WM[WM.length-1];if(API){API.DUR=DUR;if(bpm)API.BPM=bpm}}
setWarp(WAB.map(function(b){return b*BT}));
function REAL(a){return pw(REAL0(a),WO,WM)}
function renderW(A,t){render(A,pw(Math.min(t,DUR),WM,WO))}
API={build:build,render:renderW,DUR:DUR,BPM:BPM,warp:setWarp,anchors:function(){return WAN.map(REAL0)},MAP:MAP,REAL:REAL,K:K,PREr:PREr,OFF:OFF,RUN0:RUN0,STK0:STK0,TB18:TB18,cellXY:cellXY,MAIN:MAIN};return API})();
