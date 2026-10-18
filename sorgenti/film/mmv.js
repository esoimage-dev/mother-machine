/* ===== Mother Machine · il film in VERTICALE (9:16, 900 x 1600) =====
   Stesso orologio, stessi tempi e stessa musica del film 16:9 (mm.js); cambia solo come sono disposte le cose. =====
   Un solo orologio: render(t) disegna il fotogramma al tempo t. Deterministico, esportabile in video. */
var MMV=(function(){
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
var CW=360,CH=240,MAIN=5,CS=390/360,VCW=390,VCH=260,SLOTS=[0,1,2,4,5,6,7,8,10,11];
/* griglia verticale: due colonne, cinque righe. Le schede sono disegnate a 360 x 240 e ingrandite */
function slotOf(i){return SLOTS.indexOf(i)}
function cellXY(i){var p=slotOf(i);return [50+(p%2)*410,110+Math.floor(p/2)*280]}
function cellCR(i){var p=slotOf(i);return [p%2,Math.floor(p/2)]}

function anchors(d){/* punti d'ancora: dove il tracciato gira */
  var n=d.match(/-?\d+(\.\d+)?/g).map(Number),pts=[];for(var i=0;i<n.length;i+=2)pts.push([n[i],n[i+1]]);
  var out=[],last=null;for(var j=1;j<pts.length-1;j++){var a=pts[j-1],b=pts[j],c=pts[j+1];
    var t1=Math.atan2(b[1]-a[1],b[0]-a[0]),t2=Math.atan2(c[1]-b[1],c[0]-b[0]),dt=Math.abs(((t2-t1)*180/Math.PI+540)%360-180);
    if(dt>32&&(!last||Math.hypot(b[0]-last[0],b[1]-last[1])>90)){out.push(b);last=b}}
  return out}

function build(host,LG){LGP=LG.parts;
  var sv=E('svg',{viewBox:'0 0 900 1600',preserveAspectRatio:'xMidYMid slice',role:'img','aria-label':'Mother Machine, animazione del logo'},host);sv.style.cssText='display:block;width:100%;height:100%';
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

  E('rect',{width:900,height:1600,fill:K.carta},sv);
  var root=sv;sv=A.cam=E('g',{},root);
  /* ---------- griglia di varianti (sotto tutto, entra alla fine) ---------- */
  A.cells=[];var cg=A.cg=E('g',{},sv);
  for(var i=0;i<12;i++){if(i===MAIN||slotOf(i)<0){A.cells.push(null);continue}var xy=cellXY(i);
    var g=E('g',{},cg),inner=E('g',{},g),inB=E('g',{opacity:0},g);CELL[i](inner);if(CELL2[i])CELL2[i](inB);A.cells.push({g:g,a:inner,b:CELL2[i]?inB:null,x:xy[0],y:xy[1]})}
  /* ---------- allagamento pomodoro ---------- */
  A.flood=E('g',{'clip-path':'url(#cpFl)'},sv);A.floodR=E('rect',{width:900,height:1600,fill:K.tomato},A.flood);E('rect',{width:900,height:1600,fill:'url(#ht)'},A.flood);
  A.fd=[];var fdg=A.fdg=E('g',{},sv);for(var yy=0,row=0;yy<=1612;yy+=21,row++)for(var xx=(row%2)*10.5;xx<=912;xx+=21)A.fd.push({e:E('circle',{cx:xx,cy:yy,r:0,fill:K.tomato},fdg),x:xx,y:yy,r:0});
  A.gd=[];[['baseline','0',700],['x-height','528',700-528*.36],['ascender','1468',700-1468*.36]].forEach(function(q){var g=E('g',{opacity:0},sv);
    var l=E('line',{x1:450,x2:450,y1:q[2],y2:q[2],stroke:K.cobalt,'stroke-width':1.6},g);var lb=txt(g,70,q[2]-9,q[0],20,K.cobalt);var vl=txt(g,830,q[2]-9,q[1],20,K.cobalt,null,500,'end');A.gd.push({g:g,l:l,lb:lb,vl:vl})});
  A.gv=[-16,696].map(function(x){return E('line',{x1:0,x2:0,y1:0,y2:0,stroke:K.cobalt,'stroke-width':1.6,'stroke-dasharray':'6 7',opacity:0},sv)});
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
  A.box=E('rect',{fill:'none',stroke:K.cobalt,'stroke-width':3,pathLength:1,'stroke-dasharray':'1 1'},A.sel);
  A.hd=[];for(var h=0;h<8;h++)A.hd.push(E('rect',{width:18,height:18,fill:'#fff',stroke:K.cobalt,'stroke-width':3},A.sel));
  A.dim=E('g',{},A.sel);A.dimR=E('rect',{height:36,rx:7,fill:K.cobalt},A.dim);A.dimT=E('text',{y:25,'font-family':'DM Mono,monospace','font-size':20,'font-weight':500,fill:'#fff','text-anchor':'middle'},A.dim);
  A.nm=E('text',{'font-family':'DM Mono,monospace','font-size':20,'font-weight':500,fill:K.cobalt},A.sel);A.nm.textContent='Mother Machine · logo';
  /* etichetta: non si deforma */
  A.tag=E('g',{opacity:0},sv);E('rect',{x:0,y:-17,width:172,height:34,rx:17,fill:K.ink},A.tag);E('circle',{cx:18,cy:0,r:6,fill:K.tomato},A.tag);
  var tt=E('text',{x:32,y:5.5,'font-family':'DM Mono,monospace','font-size':14,'font-weight':500,fill:K.carta},A.tag);tt.textContent='Never stretch it.';
  /* tasto ⌘Y */
  A.key=E('g',{opacity:0,transform:'translate(50 1470)'},sv);var kx_=E('g',{transform:'scale(1.45)'},A.key);A.keyIn=kx_;E('rect',{width:64,height:44,rx:9,fill:K.ink},kx_);
  var kt=E('text',{x:32,y:29,'font-family':'DM Mono,monospace','font-size':18,'font-weight':500,fill:K.carta,'text-anchor':'middle'},kx_);kt.textContent='⌘Y';
  var kl=E('text',{x:80,y:28,'font-family':'DM Mono,monospace','font-size':14,'font-weight':500,fill:K.ink},kx_);kl.textContent='Outline';
  /* campioni di colore */
  A.sw=[];[K.tomato,K.cobalt,K.sun,K.mint,K.ink].forEach(function(c,i){var g=E('g',{opacity:0},sv);E('circle',{r:27,fill:c},g);A.sw.push(g)});
  A.ring=E('circle',{r:37,fill:'none',stroke:K.ink,'stroke-width':3,opacity:0},sv);
  /* cursore */
  buildType(A,root);buildRun(A,host);buildStack(A,root);buildDash(A,root);buildEnd(A,root);
  A.cur=E('g',{},root);var ca=E('g',{transform:'scale(2.3)'},A.cur);
  E('path',{d:'M0 0 L0 26 L7 19.5 L11.5 29.5 L16 27.5 L11.5 18 L20 18 Z',fill:K.ink,stroke:'#fff','stroke-width':2,'stroke-linejoin':'round'},ca);
  A.clk=E('circle',{r:0,fill:'none',stroke:K.ink,'stroke-width':3.5,opacity:0},sv);
  A.tch=E('g',{opacity:0},root);A.tchG=[0,1].map(function(i){return E('circle',{r:30,fill:'#6B6A64',opacity:[.3,.16][i]},A.tch)});
  A.tchC=E('g',{},A.tch);E('circle',{r:35,fill:K.ink,opacity:.13,cy:4},A.tchC);E('circle',{r:32,fill:'#ADAAA1','fill-opacity':.78,stroke:'#FFFFFF','stroke-width':3,'stroke-opacity':.95},A.tchC);
  A.tchR=E('circle',{r:32,fill:'none',stroke:'#FFFFFF','stroke-width':3,opacity:0},A.tch);
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
/* il logo intero sta al centro, largo 760 su 900. La m da sola cade più grande */
var LS=.196,LXc=450,LYc=800,XM=LXc+(340-1935)*LS,YM=LYc+851*LS,SWX=310,SWY=1150;
var AAX=460+116*CS,AAY=390+121*CS,ZA=6.6;
function tgPos(){var c=cellXY(6);return [c[0]+292*CS,c[1]+182*CS]}
function LX(t){
  if(t<1.5){var fp=P(t,0,.36),yoff=-1100*(1-fp*fp),sx=1,sy=1;if(t<.36){sy=1+.2*fp;sx=1-.08*fp}
    var im=P(t,.36,.5);if(im>0&&im<1){var k=Math.sin(Math.PI*im);sy=1-.26*k;sx=1+.18*k}
    var hp=P(t,.48,.62);if(hp>0&&hp<1){yoff-=44*Math.sin(Math.PI*hp);sy=1+.06*Math.sin(Math.PI*hp);sx=1-.03*Math.sin(Math.PI*hp)}
    var st2=P(t,.62,.72);if(st2>0&&st2<1){var k2=Math.sin(Math.PI*st2);sy=1-.07*k2;sx=1+.05*k2}
    var cam=ez.io3(P(t,.95,1.5));
    return {ax:340,ay:0,X:lerp(450,XM,cam),Y:lerp(1130,YM,cam)+yoff,s:lerp(.5,LS,cam),sx:sx,sy:sy}}
  /* in verticale il logo si tira verso il basso: si allunga in altezza, si stringe un filo, rimbalza */
  if(t<4.4){var sx2=1,sy2=1;
    if(t>=2.1&&t<2.62){var d=ez.out3(P(t,2.1,2.42)),tn=P(t,2.42,2.62);d=d*(1+.05*Math.sin(tn*Math.PI));sy2=1+.72*d;sx2=1-.17*d}
    else if(t>=2.62){var u=t-2.62,e=Math.exp(-4.2*u),c=Math.cos(15*u);sy2=1+.72*e*c;sx2=1-.17*e*c+.07*e*Math.sin(15*u)}
    return {ax:1935,ay:-859,X:LXc,Y:LYc,s:LS,sx:sx2,sy:sy2,sk:0}}
  var g=ez.io3(P(t,4.4,4.92)),c5=cellXY(MAIN);return {ax:1935,ay:-859,X:lerp(LXc,c5[0]+VCW/2,g),Y:lerp(LYc,c5[1]+VCH/2,g),s:lerp(LS,.0723*CS,g),sx:1,sy:1}}
function mp(L,x,y){return [L.X+(x-L.ax)*L.s*L.sx,L.Y+(y-L.ay)*L.s*L.sy]}
function curAt(t,A){
  var L=LX(Math.min(t,2.62)),rh=mp(L,1935,10);rh=[rh[0]+4,rh[1]+22];var off=[1000,1760];
  if(t<1.5)return off;
  if(t<2.05){var p=ez.io3(P(t,1.5,2.05));return [lerp(off[0],rh[0],p),lerp(off[1],rh[1],p)+Math.sin(p*Math.PI)*-60]}
  if(t<3.4)return rh;
  var sw=[SWX,SWY];
  if(t<3.85){var q=ez.io3(P(t,3.4,3.85));return [lerp(rh[0],sw[0],q),lerp(rh[1],sw[1],q)+Math.sin(q*Math.PI)*-40]}
  if(t<5.3)return sw;
  var tg=tgPos();if(t<5.95){var r=ez.io3(P(t,5.3,5.66));return [lerp(sw[0],tg[0],r),lerp(sw[1],tg[1],r)]}
  var u=ez.in3(P(t,5.95,6.18));return [lerp(tg[0],off[0],u),lerp(tg[1],off[1],u)]}

function camAt(t){
  var a=ez.io3(P(t,2.05,2.4)),b=ez.io3(P(t,2.7,3.2)),z1=.06*(a-b);
  var c=ez.io3(P(t,3.92,4.38)),d=ez.io3(P(t,4.4,5.05)),z2=.08*(c-d);
  if(t<3.6)return {px:450,py:980,sx:450,sy:980,s:1+z1};
  if(t<6.4)return {px:SWX,py:SWY,sx:SWX,sy:SWY,s:1+z2};
  var dv=ez.in3(P(t,6.42,6.98)),k=ez.io3(P(t,6.42,6.98));
  return {px:AAX,py:AAY,sx:lerp(AAX,450,k),sy:lerp(AAY,800,k),s:Math.pow(ZA,dv)}}
var MM_URL=/url=1/.test(location.hash),LGP=null,MC=null;function meas(str,w,size){if(!MC)MC=document.createElement('canvas').getContext('2d');MC.font=w+' '+size+'px "Hanken Grotesk"';return MC.measureText(str).width}
/* ---------- momento 2: le parole ---------- */
var SY={x0:230,x1:670,y:1060};
function wghtAt(t){return 100+800*ez.io3(P(t,8.2,8.9))}
/* le parole, una alla volta, grandi al centro del quadro alto */
function buildType(A,root){var L=A.TL=E('g',{opacity:0},root);
  E('rect',{width:900,height:1600,fill:K.sun},L);E('rect',{width:900,height:1600,fill:'url(#ht)'},L);
  A.bigAa=txt(L,f(450+(460+26*CS-AAX)*ZA),f(800+(390+176*CS-AAY)*ZA),'Aa',f(150*CS*ZA),K.cobalt,'Hanken Grotesk,sans-serif',700);
  txt(L,50,92,'HANKEN GROTESK · VARIABLE',20,K.ink);txt(L,850,92,'TYPE',20,K.ink,null,500,'end');
  E('rect',{x:50,y:112,width:800,height:3,fill:K.ink},L);E('rect',{x:50,y:1478,width:800,height:3,fill:K.ink},L);
  txt(L,50,1522,'BRAND · SYSTEMS · CODE',20,K.ink);A.tCount=txt(L,850,1522,'01 / 03',20,K.ink,null,500,'end');
  A.bref=txt(L,0,-3000,'Brand.',205,K.ink,'Hanken Grotesk,sans-serif',700);
  A.brand=[];'Brand.'.split('').forEach(function(ch){var e=txt(L,0,0,ch,205,K.ink,'Hanken Grotesk,sans-serif',700);A.brand.push(e)});
  A.sys=E('text',{x:450,y:0,'text-anchor':'middle','font-family':'Hanken Grotesk,sans-serif','font-size':150,fill:K.cobalt},L);A.sys.textContent='Systems.';
  var sl=A.sl=E('g',{opacity:0},L);E('rect',{x:SY.x0,y:SY.y-4,width:SY.x1-SY.x0,height:8,rx:4,fill:K.ink,opacity:.25},sl);A.slF=E('rect',{x:SY.x0,y:SY.y-4,width:0,height:8,rx:4,fill:K.cobalt},sl);
  A.slK=E('circle',{cx:SY.x0,cy:SY.y,r:22,fill:K.carta,stroke:K.ink,'stroke-width':4},sl);txt(sl,SY.x0,SY.y-38,'wght',24,K.ink);A.slV=txt(sl,SY.x1,SY.y-38,'100',24,K.ink,null,500,'end');
  A.code=txt(L,0,0,'',220,K.ink,'Hanken Grotesk,sans-serif',700);A.caret=E('rect',{width:14,height:162,fill:K.tomato},L);
  A.dot=E('circle',{r:0,fill:K.tomato},L)}
function renderType(A,t,tr){var on=t>6.975&&t<RUN0+.75;op(A.TL,on?1:0);if(!on)return;
  if(CELL.aa)A.bigAa.style.fontWeight=CELL.aa.style.fontWeight;
  var ax=ez.in3(P(t,6.98,6.98+D.med));A.bigAa.setAttribute('transform','translate(0 '+f(-1700*ax)+')');op(A.bigAa,1-P(t,7.2,7.3));
  var by=880,W=A.bref.getComputedTextLength(),x=450-W/2;
  A.brand.forEach(function(e,i){var a=7.0+i*.05,p=P(t,a,a+D.med),ex=ez.in3(P(t,7.66+i*.025,7.66+i*.025+D.fast));
    var y=by-(1-ez.back(p,1.3))*700-ex*1150;e.setAttribute('x',f(x+A.bref.getStartPositionOfChar(i).x));e.setAttribute('y',f(y));op(e,p>0?1:0)});
  A.tCount.textContent=t<7.9?'01 / 03':t<9.0?'02 / 03':'03 / 03';
  var w=wghtAt(t),se=ez.back(P(t,7.94,7.94+D.med),1.4),sx=ez.in3(P(t,8.95,8.95+D.fast));
  A.sys.style.fontWeight=Math.round(w);A.sys.setAttribute('y',f(852));A.sys.setAttribute('transform','translate('+f(-1100*sx)+' 0) translate(450 800) scale('+f(.4+.6*se)+') translate(-450 -800)');op(A.sys,t>7.94?1:0);
  var so=ez.back(P(t,7.98,7.98+D.med));op(A.sl,t>7.98&&t<9.05?1-P(t,8.95,9.05):0);A.sl.setAttribute('transform','translate(0 '+f(50*(1-so))+')');
  var kx=SY.x0+(SY.x1-SY.x0)*(w-100)/800;A.slK.setAttribute('cx',f(kx));A.slF.setAttribute('width',f(kx-SY.x0));A.slV.textContent=Math.round(w);
  var full='Code',n=Math.floor(P(t,9.05,9.42)*4.999);A.code.textContent=full;var cw=A.code.getComputedTextLength()+50,cx0=450-cw/2;
  A.code.textContent=full.slice(0,n);var cur=n?A.code.getComputedTextLength():0;A.code.setAttribute('x',f(cx0));A.code.setAttribute('y',f(by));
  var dotT=9.46;A.caret.setAttribute('x',f(cx0+cur+6));A.caret.setAttribute('y',f(by-155));op(A.caret,t>9.02&&t<dotT&&(Math.floor(tr*4)%2===0||t<9.44)?1:0);
  A.dot.setAttribute('cx',f(cx0+cur+32));A.dot.setAttribute('cy',f(by-18));var dp=ez.back(P(t,dotT,dotT+D.fast),2.4);A.dot.setAttribute('r',f(t<dotT?0:18*dp*(1+.25*Math.max(0,Math.sin((t-dotT)*9))*(t<RUN0+.3?1:0))))}
/* ---------- momento nuovo: RUNTIME. Glitch, il codice del logo piove, si ferma a formare la m, si compila in retino, esplode in un campo di archi ---------- */
function hsh(n){n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n)}
/* in verticale le celle sono più grandi (si leggono sul telefono) e la m è più alta */
var RC={cw:22,rh:30,cols:41,rows:54,mx:246,mb:1240,ms:.6,k:22/16};
function buildRun(A,host){var cv=A.rc=document.createElement('canvas');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:none;z-index:1';host.appendChild(cv);A.rx=cv.getContext('2d');
  var m=new Path2D(),M=new DOMMatrix([RC.ms,0,0,RC.ms,RC.mx,RC.mb]);m.addPath(new Path2D(LGP.fr),M);m.addPath(new Path2D(LGP.c1),M);A.mPath=m;
  A.data=(LGP.fr+LGP.t0).replace(/\s+/g,'').slice(0,3000);
  var ins=[],tc=document.createElement('canvas').getContext('2d');for(var c=0;c<RC.cols;c++){ins[c]=[];for(var r=0;r<RC.rows;r++)ins[c][r]=tc.isPointInPath(m,c*RC.cw+RC.cw/2,r*RC.rh+RC.rh*.64)}A.ins=ins;A.mcol=ins.map(function(col){return col.some(function(x){return x})});
  /* la pioggia: ogni colonna ha più gocce che scendono una dopo l'altra, sempre alla stessa velocità */
  A.rs=[];A.lk=[];for(var ca=0;ca<RC.cols;ca++){var vv=17+hsh(ca+50)*17,LL=7+hsh(ca+90)*12,st=[],t0=.35+hsh(ca)*.8,mc=A.mcol[ca];
    for(var kk=0;kk<9;kk++){st.push(t0);t0+=(mc?.42:.95)+hsh(ca*3.1+kk*7.7)*(mc?.3:.7)}A.rs.push({v:vv,L:LL,s:st});
    /* ogni carattere della m aspetta il suo momento, sparso tra 0,7 e 1,55: quando la prima goccia dopo quel momento ci passa sopra, il carattere si ferma lì */
    A.lk[ca]=[];for(var ra=0;ra<RC.rows;ra++){if(!ins[ca][ra]){A.lk[ca][ra]=99;continue}var e=.7+.65*hsh(ca*13.3+ra*7.1)+.2*(ra/RC.rows),best=99;
      st.forEach(function(s0){var tk=s0+ra/vv;if(tk>=e&&tk<best)best=tk});A.lk[ca][ra]=best}}
  /* distanza di ogni cella dalla m: serve a far crescere il campo dalla lettera verso fuori */
  var dist=[],q=[],ky=RC.rh/RC.cw;for(var c2=0;c2<RC.cols;c2++)for(var r2=0;r2<RC.rows;r2++)if(ins[c2][r2])q.push([c2,r2]);
  for(var c3=0;c3<RC.cols;c3++){dist[c3]=[];for(var r3=0;r3<RC.rows;r3++){var best=1e9;if(!ins[c3][r3])for(var h=0;h<q.length;h++){var dx=c3-q[h][0],dy=(r3-q[h][1])*ky,d2=dx*dx+dy*dy;if(d2<best)best=d2}else best=0;dist[c3][r3]=Math.sqrt(best)}}A.dist=dist}
function renderRun(A,t,tr){var u=t-RUN0,on=u>.14&&t<STK0+.02;var cv=A.rc;var d=on?'block':'none';if(cv.style.display!==d)cv.style.display=d;if(!on)return;
  var W=cv.clientWidth,H=cv.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
  var x=A.rx,sc=Math.max(W/900,H/1600)*dpr;x.setTransform(sc,0,0,sc,(W*dpr-900*sc)/2,(H*dpr-1600*sc)/2);x.clearRect(0,0,900,1600);var KK=RC.k;
  var C=[K.tomato,K.cobalt,K.sun,K.mint,K.carta];
  /* 1. glitch: lo schermo si rompe a strisce */
  if(u<.48){var g=P(u,.14,.46);for(var i=0;i<26;i++){if(hsh(i+3)<g){var y=hsh(i)*1600,h=8+hsh(i+7)*90,ox=(hsh(i+11)-.5)*90*(1-g);x.fillStyle=K.ink;x.fillRect(ox,y,900,h*(.4+g));if(hsh(i+5)<.3){x.fillStyle=C[i%2?0:1];x.fillRect(ox+hsh(i+9)*450,y,120+hsh(i+2)*380,4)}}}return}
  x.fillStyle=K.ink;x.fillRect(0,0,900,1600);
  var lockOn=u>1.45,rainOut=1-P(u,2.4,2.72),dimR=1-.45*P(u,1.9,2.2),comp=u>2.72?P(u,2.72,3.0):0,sweep=RC.mx-30+(RC.cw*24)*comp;
  x.font='500 23px "DM Mono", ui-monospace, monospace';x.textBaseline='middle';x.textAlign='center';
  if(u<3.05){
  /* la pioggia continua; dove passa la m alcuni caratteri si fermano, uno qua e uno là, e la m si forma dalla cascata */
  for(var c=0;c<RC.cols;c++){var Rs=A.rs[c],v=Rs.v,L=Rs.L,cx=c*RC.cw+RC.cw/2;
    for(var r=0;r<RC.rows;r++){var cy=r*RC.rh+RC.rh*.5,inside=A.ins[c][r],lt=inside?A.lk[c][r]:99;
      if(u>=lt){var ch=A.data[(c*131+r*17+Math.floor(lt*12+c))%A.data.length];
        if(cx<sweep&&comp>0){x.globalAlpha=1;x.fillStyle=K.sun;x.beginPath();x.arc(cx,cy,7.2*KK,0,6.283);x.fill()}
        else{var ty=2.22+(r-12)/30*.3+hsh(c*5.1)*.04,yel=u>=ty+.05,fl=u<lt+.09||(u>=ty&&u<ty+.05);
          x.globalAlpha=1;x.fillStyle=fl?K.carta:yel?K.sun:'#8DFFDB';x.fillText(ch,cx,cy)}continue}
      if(rainOut<=0)continue;var dd=99;for(var q=0;q<Rs.s.length;q++){var d0=(u-Rs.s[q])*v-r;if(d0>=0&&d0<dd)dd=d0}if(dd>L)continue;
      var b=1-dd/L;x.globalAlpha=.78*b*rainOut*dimR*(inside?.6:1);x.fillStyle=dd<1?K.carta:(hsh(c*7+r)<.06?K.tomato:K.mint);
      x.fillText(A.data[(c*131+r*17+Math.floor(u*12+c))%A.data.length],cx,cy)}}}
  x.globalAlpha=1;
  /* 2. i puntini della m diventano archi; il campo cresce dalla m mentre la camera entra; un'onda sola lo gira e lo fa pomodoro */
  if(u>=3.05){var mo=ez.out3(P(u,3.05,3.3)),z=1+1.7*ez.io3(P(u,3.25,4.6)),gr=(u-3.25)*58,wf=(u-3.8)*80,wf2=(u-4.3)*95,wf3=(u-4.75)*100,merge=P(u,5.2,5.62);
    if(merge>.3){x.fillStyle=K.tomato;x.globalAlpha=P(merge,.3,.7);x.fillRect(0,0,900,1600);x.globalAlpha=1}
    x.save();x.translate(450,800);x.scale(z,z);x.translate(-450,-800);x.lineCap='butt';
    var lw=(3.4+15*ez.in3(merge))*KK;gr*=16/RC.cw*1.15;wf*=16/RC.cw*1.15;wf2*=16/RC.cw*1.15;wf3*=16/RC.cw*1.15;
    for(var c=0;c<RC.cols;c++){var cx=c*RC.cw+RC.cw/2,sx=450+(cx-450)*z;if(sx<-40||sx>940)continue;
      for(var r=0;r<RC.rows;r++){var cy=r*RC.rh+RC.rh*.5,sy=800+(cy-800)*z;if(sy<-40||sy>1640)continue;
        var dd=A.dist[c][r],inside=dd===0,pp=inside?mo:ez.out3(cl((gr-dd)/3));if(pp<=0)continue;
        var qf=cl((wf-dd)/5),q2=cl((wf2-dd)/5),q3=cl((wf3-dd)/5),ang=Math.PI*ez.io3(qf)+Math.PI/2*ez.io3(q2)+Math.PI/2*ez.io3(q3),col=qf>.5?K.tomato:(inside?K.sun:K.carta);
        if(inside&&mo<1){x.fillStyle=K.sun;x.beginPath();x.arc(cx,cy,7.2*KK*(1-mo),0,6.283);x.fill()}
        x.save();x.translate(cx,cy+1);x.rotate(ang);x.scale(pp*KK,pp*KK);x.lineWidth=lw/KK;x.strokeStyle=col;x.globalAlpha=inside||qf>.5?1:.85;
        x.beginPath();x.moveTo(-5.5,7);x.lineTo(-5.5,0);x.arc(0,0,5.5,Math.PI,0);x.lineTo(5.5,7);x.stroke();x.restore()}}
    x.restore();x.globalAlpha=1;if(merge>=1){x.fillStyle=K.tomato;x.fillRect(0,0,900,1600)}}
  /* 3. terminale */
  var tA=1-P(u,5.0,5.25);x.globalAlpha=tA;x.textAlign='left';x.font='500 22px "DM Mono", ui-monospace, monospace';
  function lab(s,xx,yy,col,al,a){x.textAlign=al;var w=x.measureText(s).width;x.globalAlpha=tA;x.fillStyle=K.ink;x.fillRect(al==='right'?xx-w-12:xx-12,yy-18,w+24,36);x.globalAlpha=tA*a;x.fillStyle=col;x.fillText(s,xx,yy)}
  lab('MOTHER MACHINE · RUNTIME',50,62,K.carta,'left',.55);lab('FRAME '+String(Math.floor(tr*60)).padStart(5,'0'),850,62,K.carta,'right',.55);
  var cmd='> mother --compile logo.svg',n=Math.floor(P(u,.8,1.5)*cmd.length);if(u>.7)lab(cmd.slice(0,n)+(Math.floor(tr*3)%2&&u<1.6?'_':''),50,1540,K.mint,'left',1);
  if(u>2.8)lab('✓ 1 mark · 2 floors · 0 errors',50,1500,K.sun,'left',1);
  if(u>3.3)lab('GROWING · 2200 ARCHES',850,104,K.carta,'right',.55);x.textAlign='left'
  x.globalAlpha=1}
/* ---------- i prodotti: otto app vere per otto settori; quattro scorrono con la loro funzione, una si apre ---------- */
/* ---------- le app. In verticale sono telefoni veri, impilati come nel selettore delle app; una sola è al contrario: il portatile del corriere ---------- */
var SW=620,SH=1240,HB=190,BR=[
 {n:'Riverside Clinic',a:K.cobalt,tc:K.carta,ic:'cross',meta:'AGENDA · MON 12 OCT',body:'clinic'},
 {n:'Swift Couriers',a:K.sun,tc:K.ink,ic:'truck',meta:'LIVE · 38 DELIVERIES',body:'map'},
 {n:'Pulse Gym',a:K.mint,tc:K.ink,ic:'bell',meta:'CHECK-IN · FRONT DESK',body:'gym'},
 {n:'Pizzeria Uno',a:K.ink,tc:K.carta,ic:'pizza',meta:'FLOOR · FRI 20:30',body:'floor'},
 {n:'Northside Realty',a:K.sun,tc:K.ink,ic:'house',meta:'CRM · 24 LEADS',body:'realty'},
 {n:'Harbour Hotel',a:K.cobalt,tc:K.carta,ic:'key',meta:'ROOMS · 86% FULL',body:'hotel'},
 {n:'Lumen Optics',a:K.sun,tc:K.ink,ic:'glasses',meta:'STOCK · 1,204 ITEMS',body:'gen'},
 {n:'North Brewing Co.',a:K.mint,tc:K.ink,ic:'beer',meta:'TANKS · 6 ACTIVE',body:'brew'}];
/* il portatile: schermo 1000 x 560 (la stessa app desktop del 16:9) dentro cornice e base, ridotto */
var LPW=1260,LPH=900,LPS=.69;
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

function headD(g,b,w,h){E('path',{d:'M16 0 H'+(w-16)+' Q'+w+' 0 '+w+' 16 V'+h+' H0 V16 Q0 0 16 0 Z',fill:b.a},g);E('circle',{cx:30,cy:h/2,r:14,fill:K.carta},g);icon(g,b.ic,30,h/2,.78);
  txt(g,54,h/2+6,b.n,18,b.tc,'Hanken Grotesk,sans-serif',700);var m=txt(g,w-22,h/2+4,b.meta,12,b.tc,null,500,'end');m.setAttribute('opacity',.75);
  if(b.body==='floor')return svcBtn(g)}

function statusBar(g,col){txt(g,50,54,'9:41',22,col,null,500);var b=E('g',{opacity:.85},g);E('rect',{x:520,y:39,width:40,height:19,rx:5,fill:'none',stroke:col,'stroke-width':2},b);E('rect',{x:524,y:43,width:28,height:11,rx:2,fill:col},b);E('rect',{x:562,y:45,width:3,height:7,rx:1,fill:col},b);
  [0,1,2,3].forEach(function(i){E('rect',{x:478+i*8,y:52-i*4,width:5,height:6+i*4,rx:1,fill:col},b)})}
/* testata dell'app sul telefono: barra di stato, icona, nome, riga mono */
function head(g,b,w,h){E('path',{d:'M56 0 H'+(w-56)+' Q'+w+' 0 '+w+' 56 V'+h+' H0 V56 Q0 0 56 0 Z',fill:b.a},g);statusBar(g,b.tc);
  E('circle',{cx:72,cy:124,r:36,fill:K.carta},g);icon(g,b.ic,72,124,1.9);
  txt(g,124,120,b.n,32,b.tc,'Hanken Grotesk,sans-serif',700);var m=txt(g,124,154,b.meta,17,b.tc,null,500);m.setAttribute('opacity',.75);
  if(b.body==='floor')return svcBtn(g)}
/* Start service: un tasto vero nella testata dell'app. Stati: pronto, sotto il cursore, premuto, in servizio, finito */
function svcBtn(g){var o=E('g',{transform:'translate(372 98)'},g),bt=E('g',{},o);var r=E('rect',{width:218,height:48,rx:24,fill:K.carta},bt);
  var pl=E('path',{d:'M20 15 L32 24 L20 33 Z',fill:K.tomato},bt);var dt=E('circle',{cx:26,cy:24,r:7,fill:K.mint,opacity:0},bt);
  var t=txt(bt,44,31,'Start service',20,K.ink,'Hanken Grotesk,sans-serif',700);return {g:o,b:bt,r:r,pl:pl,dt:dt,t:t}}
function chip(g,x,y,t,bg,fg,w){E('rect',{x:x,y:y-14,width:w||(t.length*7.6+18),height:22,rx:11,fill:bg},g);return txt(g,x+9,y+1.5,t,11.5,fg)}

function mapD(g,A){var mp=E('g',{},g);E('rect',{x:0,y:48,width:640,height:512,fill:TINT.land},mp);
   E('path',{d:'M0 420 Q160 380 260 450 T640 400 V560 H0Z',fill:TINT.cob,opacity:.8},mp);E('rect',{x:420,y:90,width:150,height:110,rx:10,fill:TINT.mint},mp);
   for(var i=0;i<7;i++)E('rect',{x:40+i*92,y:48,width:10,height:512,fill:K.carta},mp);for(var j=0;j<5;j++)E('rect',{x:0,y:96+j*96,width:640,height:10,fill:K.carta},mp);
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
   [['38','TODAY'],['97%','ON TIME']].forEach(function(c,i){var x=660+i*164;E('rect',{x:x,y:460,width:156,height:80,rx:14,fill:i?K.ink:K.sun},g);txt(g,x+16,500,c[0],26,i?K.carta:K.ink,'Hanken Grotesk,sans-serif',700);txt(g,x+16,524,c[1],10,i?K.carta:K.ink)})}

/* ---- corpi delle app sul telefono (620 x 1240) ---- */
var BODY={
 clinic:function(g,A){txt(g,40,262,'Today',46,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,580,258,'3 DOCTORS',17,K.mut,null,500,'end');
   [['Dr. Bennett',K.cobalt,K.carta,176],['Collins',TINT.mint,K.ink,124],['Fraser',TINT.sun,K.ink,118]].reduce(function(x,d){E('rect',{x:x,y:296,width:d[3],height:46,rx:23,fill:d[1]},g);txt(g,x+d[3]/2,326,d[0],19,d[2],'Hanken Grotesk,sans-serif',600,'middle');return x+d[3]+12},40);
   ['09:00','10:00','11:00','12:00','13:00'].forEach(function(h,i){var y=410+i*150;txt(g,40,y+8,h,18,K.mut);E('rect',{x:116,y:y,width:464,height:2,fill:TINT.line},g)});
   function ap(y,h,col,t1,t2){E('rect',{x:130,y:y,width:450,height:h,rx:14,fill:col},g);E('rect',{x:130,y:y,width:8,height:h,rx:4,fill:K.ink,opacity:.45},g);txt(g,154,y+38,t1,24,K.ink,'Hanken Grotesk,sans-serif',600);txt(g,154,y+66,t2,16,K.ink)}
   ap(418,104,TINT.mint,'Check-up · Carter','09:05 · 30 MIN');ap(568,164,TINT.cob,'Surgery · Morgan','10:00 · 90 MIN');ap(868,104,TINT.mint,'Visit · Brooks','12:10 · 40 MIN');ap(1018,92,TINT.sun,'Exam · Reed','13:00 · 20 MIN');
   A.cSlot=E('rect',{x:130,y:744,width:450,height:110,rx:14,fill:'none',stroke:K.cobalt,'stroke-width':3,'stroke-dasharray':'9 7'},g);
   var nb=A.cNew=E('g',{},g);E('rect',{x:0,y:0,width:450,height:110,rx:14,fill:K.cobalt},nb);txt(nb,24,46,'Visit · Ross M.',26,K.carta,'Hanken Grotesk,sans-serif',700);txt(nb,24,78,'11:10 · 40 MIN · NEW',16,K.carta);
   E('rect',{x:40,y:1152,width:540,height:62,rx:31,fill:K.ink},g);txt(g,310,1192,'+ New appointment',21,K.carta,'Hanken Grotesk,sans-serif',700,'middle');
   /* il messaggio al paziente scende dall'alto, come una notifica del telefono */
   var sm=A.cSms=E('g',{opacity:0},g);E('rect',{x:6,y:14,width:560,height:122,rx:28,fill:K.ink,opacity:.18},sm);E('rect',{x:0,y:0,width:560,height:122,rx:28,fill:TINT.white},sm);
   E('circle',{cx:56,cy:61,r:28,fill:K.cobalt},sm);E('rect',{x:44,y:43,width:24,height:36,rx:5,fill:'none',stroke:K.carta,'stroke-width':3},sm);
   txt(sm,100,46,'SMS · ROSS M.',16,K.mut);txt(sm,100,86,'See you Tue at 11:10',26,K.ink,'Hanken Grotesk,sans-serif',600);
   var sc=E('g',{},sm);E('rect',{x:428,y:24,width:104,height:34,rx:17,fill:K.mint},sc);txt(sc,480,47,'SENT ✓',16,K.ink,null,500,'middle');A.cSent=sc},
 gym:function(g,A){E('circle',{cx:70,cy:252,r:30,fill:TINT.sun},g);txt(g,70,260,'JR',20,K.ink,'Hanken Grotesk,sans-serif',700,'middle');
   txt(g,114,248,'Julia R. · Leg day',28,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,114,276,'COACH LUKE · LIVE SESSION',15,K.mut);
   var p=E('g',{},g);E('rect',{x:30,y:304,width:560,height:500,rx:30,fill:K.ink},p);
   var rc=[[K.tomato,152,'MOVE'],[K.sun,118,'REPS'],[K.mint,84,'TIME']];A.rings=rc.map(function(r){E('circle',{cx:226,cy:540,r:r[1],fill:'none',stroke:r[0],'stroke-opacity':.18,'stroke-width':28},p);
     return E('circle',{cx:226,cy:540,r:r[1],fill:'none',stroke:r[0],'stroke-width':28,'stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1,transform:'rotate(-90 226 540)'},p)});
   A.ringPct=txt(p,226,558,'0%',50,K.carta,'Hanken Grotesk,sans-serif',700,'middle');
   rc.forEach(function(r,i){E('circle',{cx:430,cy:662+i*36,r:8,fill:r[0]},p);txt(p,448,668+i*36,r[2],16,K.carta)});
   txt(p,420,370,'HEART RATE',16,K.sun);A.bpm=txt(p,420,438,'128',58,K.carta,'Hanken Grotesk,sans-serif',700);txt(p,532,438,'BPM',16,K.carta);
   var hr='M420 520';for(var q=0;q<=20;q++){var x=420+q*7.5,y=q%5===2?484:q%5===3?552:520;hr+=' L'+x+' '+y}A.hr=E('path',{d:hr,fill:'none',stroke:K.tomato,'stroke-width':4,'stroke-linejoin':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},p);
   txt(g,40,866,'Workout plan',28,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,580,862,'5 EXERCISES · 45 MIN',15,K.mut,null,500,'end');
   A.ex=[['Squat','4 × 12',2],['Deadlift','4 × 8',2],['Lunges','3 × 12',3],['Leg press','3 × 10',0],['Bike','10 min',1]].map(function(e,i){var y=888+i*68;var row=E('g',{},g);
     var bgR=E('rect',{x:30,y:y,width:560,height:60,rx:16,fill:TINT.white},row);E('circle',{cx:72,cy:y+30,r:21,fill:[TINT.sun,TINT.tom,TINT.mint,TINT.cob,TINT.sun][i]},row);var gi=E('g',{transform:'translate(72 '+(y+30)+') scale(1.25) translate(-72 '+(-(y+30))+')'},row);gymIc(gi,e[2],72,y+30);
     txt(row,108,y+28,e[0],22,K.ink,'Hanken Grotesk,sans-serif',700);txt(row,108,y+50,e[1],15,K.mut);var ck=E('g',{opacity:0},row);E('circle',{cx:552,cy:y+30,r:19,fill:K.mint},ck);icon(ck,'check',552,y+30,.9);
     return {bg:bgR,ck:ck}})},
 courier:function(g,A){txt(g,40,262,'Your order',46,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,40,296,'#2041 · 12 KING ST',17,K.mut);
   var m=E('g',{},g);E('rect',{x:30,y:322,width:560,height:420,rx:24,fill:TINT.land},m);var cpc=E('clipPath',{id:'cpCm'},m);E('rect',{x:30,y:322,width:560,height:420,rx:24},cpc);var mm=E('g',{'clip-path':'url(#cpCm)'},m);
   E('path',{d:'M30 640 Q180 600 300 660 T590 620 V742 H30Z',fill:TINT.cob,opacity:.8},mm);E('rect',{x:380,y:360,width:160,height:110,rx:12,fill:TINT.mint},mm);
   [110,210,310,410,510].forEach(function(x){E('rect',{x:x,y:322,width:14,height:420,fill:K.carta},mm)});[400,500,600,700].forEach(function(y){E('rect',{x:30,y:y,width:560,height:14,fill:K.carta},mm)});
   var rd='M90 690 L90 607 L217 607 L217 507 L417 507 L417 407 L520 407';A.cRB=E('path',{d:rd,fill:'none',stroke:K.ink,'stroke-width':5,'stroke-dasharray':'3 10','stroke-linecap':'round',opacity:.45},mm);
   A.cR=E('path',{d:rd,fill:'none',stroke:K.cobalt,'stroke-width':10,'stroke-linejoin':'round','stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},mm);
   var pin=E('g',{transform:'translate(520 407)'},mm);E('path',{d:'M0 0 C-20 -22 -20 -48 0 -48 C20 -48 20 -22 0 0Z',fill:K.tomato},pin);E('circle',{cx:0,cy:-31,r:7,fill:K.carta},pin);
   E('rect',{x:74,y:674,width:32,height:32,rx:6,fill:K.ink},mm);A.cVan=E('g',{},mm);E('circle',{r:20,fill:K.cobalt,stroke:K.carta,'stroke-width':5},A.cVan);
   txt(g,40,796,'ARRIVING IN',18,K.mut);A.cEta=txt(g,40,890,'12 min',92,K.ink,'Hanken Grotesk,sans-serif',700);
   E('rect',{x:70,y:934,width:380,height:5,rx:2.5,fill:TINT.line},g);A.cStF=E('rect',{x:70,y:934,width:0,height:5,rx:2.5,fill:K.mint},g);
   A.cSt=[['Packed',70],['On the way',260],['At door',450]].map(function(q){var d=E('circle',{cx:q[1],cy:936,r:12,fill:TINT.line},g);txt(g,q[1],978,q[0],18,K.ink,null,500,'middle');return d});
   E('rect',{x:30,y:1010,width:560,height:96,rx:22,fill:TINT.white},g);E('circle',{cx:84,cy:1058,r:28,fill:K.sun},g);txt(g,84,1067,'M',24,K.ink,'Hanken Grotesk,sans-serif',700,'middle');
   txt(g,128,1052,'Mark · Van 3',24,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,128,1080,'4.9 ★ · 1,204 DELIVERIES',15,K.mut);
   E('rect',{x:30,y:1124,width:560,height:80,rx:40,fill:K.sun},g);txt(g,310,1174,'Call courier',26,K.ink,'Hanken Grotesk,sans-serif',700,'middle')},
 floor:function(g,A){A.fpC=floorPlan(g,true)},
 realty:function(g){txt(g,40,262,'Pipeline',46,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,580,258,'THIS WEEK',17,K.mut,null,500,'end');
   [['NEW','12',TINT.sun],['VIEWING','8',TINT.cob],['OFFER','4',TINT.mint]].forEach(function(q,i){var x=30+i*190;E('rect',{x:x,y:290,width:180,height:130,rx:22,fill:q[2]},g);txt(g,x+20,330,q[0],16,K.ink);txt(g,x+20,396,q[1],54,K.ink,'Hanken Grotesk,sans-serif',700)});
   E('rect',{x:30,y:440,width:560,height:250,rx:24,fill:TINT.cob},g);E('path',{d:'M180 640 V540 L310 470 L440 540 V640 Z',fill:K.carta},g);E('rect',{x:280,y:580,width:60,height:60,fill:K.cobalt},g);E('rect',{x:210,y:560,width:44,height:40,fill:K.cobalt,opacity:.35},g);E('rect',{x:366,y:560,width:44,height:40,fill:K.cobalt,opacity:.35},g);
   E('rect',{x:50,y:460,width:150,height:40,rx:20,fill:K.ink},g);txt(g,125,487,'€ 640K',19,K.carta,null,500,'middle');
   [['AL','Ana Lee','14 Bay Rd · 3 bed','VIEWING',TINT.cob],['TK','Tom King','Unit 9 · 2 bed','OFFER',TINT.mint],['RS','Rosa Sá','8 Hill St · 4 bed','NEW',TINT.sun],['JP','Jay Park','Loft 2 · 1 bed','NEW',TINT.sun]].forEach(function(l,i){var y=712+i*124;
     E('rect',{x:30,y:y,width:560,height:110,rx:22,fill:TINT.white},g);E('circle',{cx:86,cy:y+55,r:30,fill:l[4]},g);txt(g,86,y+63,l[0],20,K.ink,'Hanken Grotesk,sans-serif',700,'middle');
     txt(g,134,y+48,l[1],24,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,134,y+78,l[2],16,K.mut);E('rect',{x:446,y:y+36,width:124,height:38,rx:19,fill:l[4]},g);txt(g,508,y+61,l[3],15,K.ink,null,500,'middle')})},
 hotel:function(g){txt(g,40,262,'Tonight',46,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,580,258,'86% FULL',17,K.mut,null,500,'end');
   E('rect',{x:30,y:290,width:560,height:300,rx:24,fill:K.ink},g);E('circle',{cx:170,cy:440,r:96,fill:'none',stroke:K.cobalt,'stroke-opacity':.3,'stroke-width':26},g);
   E('circle',{cx:170,cy:440,r:96,fill:'none',stroke:K.cobalt,'stroke-width':26,'stroke-linecap':'round','stroke-dasharray':'518 603',transform:'rotate(-90 170 440)'},g);txt(g,170,456,'86%',44,K.carta,'Hanken Grotesk,sans-serif',700,'middle');
   [['ROOMS','62 / 72'],['ARRIVALS','18'],['CHECK-OUT','11']].forEach(function(q,i){txt(g,320,350+i*80,q[0],15,K.sun);txt(g,320,384+i*80,q[1],32,K.carta,'Hanken Grotesk,sans-serif',700)});
   txt(g,40,640,'Floor 3',26,K.ink,'Hanken Grotesk,sans-serif',700);
   for(var r=0;r<3;r++)for(var c=0;c<6;c++){var st=(r*6+c)%7,col=st===2?TINT.white:st===5?TINT.sun:K.cobalt;E('rect',{x:30+c*94,y:664+r*94,width:84,height:84,rx:14,fill:col,stroke:K.ink,'stroke-opacity':col===TINT.white?.15:0},g);txt(g,72+c*94,714+r*94,String(301+r*6+c),17,col===K.cobalt?K.carta:K.ink,null,500,'middle')}
   E('rect',{x:30,y:960,width:560,height:96,rx:22,fill:TINT.white},g);E('circle',{cx:86,cy:1008,r:28,fill:TINT.cob},g);txt(g,86,1016,'EM',20,K.ink,'Hanken Grotesk,sans-serif',700,'middle');txt(g,130,1000,'Emma Moretti',24,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,130,1030,'ROOM 304 · 2 NIGHTS',15,K.mut);
   E('rect',{x:30,y:1076,width:560,height:96,rx:22,fill:TINT.white},g);E('circle',{cx:86,cy:1124,r:28,fill:TINT.sun},g);txt(g,86,1132,'DN',20,K.ink,'Hanken Grotesk,sans-serif',700,'middle');txt(g,130,1116,'David Ng',24,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,130,1146,'ROOM 310 · 1 NIGHT',15,K.mut)},
 brew:function(g){txt(g,40,262,'Tanks',46,K.ink,'Hanken Grotesk,sans-serif',700);txt(g,580,258,'6 ACTIVE',17,K.mut,null,500,'end');
   [['FV1','IPA',.82,TINT.sun],['FV2','Lager',.6,TINT.sun],['FV3','Stout',.9,K.ink],['FV4','Pale',.45,TINT.sun],['FV5','Pils',.7,TINT.sun],['FV6','Sour',.35,TINT.tom]].forEach(function(q,i){var x=46+(i%3)*186,y=300+Math.floor(i/3)*360;
     E('rect',{x:x,y:y,width:150,height:280,rx:40,fill:TINT.white,stroke:K.ink,'stroke-opacity':.12,'stroke-width':2},g);var h=240*q[2];E('rect',{x:x+12,y:y+268-h,width:126,height:h,rx:30,fill:q[3]},g);
     txt(g,x+75,y+50,q[0],18,K.ink,null,500,'middle');txt(g,x+75,y+316,q[1],22,K.ink,'Hanken Grotesk,sans-serif',700,'middle')});
   E('rect',{x:30,y:1030,width:560,height:150,rx:24,fill:K.ink},g);txt(g,56,1074,'COLD ROOM',15,K.sun);txt(g,56,1140,'3.8 °C',54,K.carta,'Hanken Grotesk,sans-serif',700);txt(g,340,1074,'BATCHES',15,K.sun);txt(g,340,1140,'14',54,K.carta,'Hanken Grotesk,sans-serif',700)},
 gen:function(g,A,b){E('rect',{x:30,y:226,width:560,height:290,rx:24,fill:TINT.white},g);E('rect',{x:30,y:536,width:270,height:220,rx:24,fill:TINT.white},g);E('rect',{x:320,y:536,width:270,height:220,rx:24,fill:TINT.white},g);
   for(var i=0;i<4;i++)E('rect',{x:30,y:780+i*84,width:560,height:70,rx:18,fill:TINT.white},g)}
};
function buildStack(A,root){var L0=A.SL=E('g',{opacity:0},root);E('rect',{width:900,height:1600,fill:K.tomato},L0);E('rect',{width:900,height:1600,fill:'url(#ht)'},L0);var L=A.SLc=E('g',{},L0);
  /* il portatile, vista frontale come un MacBook: coperchio con cornice sottile, base appena più larga con l'incavo per aprirlo */
  var lp=A.lap=E('g',{},L),li=E('g',{transform:'translate(30 30)'},lp);
  E('rect',{x:-24,y:-18,width:1048,height:640,rx:36,fill:K.ink,opacity:.18},li);
  E('rect',{x:-26,y:-26,width:1052,height:612,rx:34,fill:K.ink},li);E('circle',{cx:500,cy:-12,r:4.5,fill:'#3A3A37'},li);
  var cpl=E('clipPath',{id:'cpLap'},li);E('rect',{width:1000,height:560,rx:8},cpl);
  var scr=E('g',{'clip-path':'url(#cpLap)'},li),b1=BR[1];E('rect',{x:0,y:0,width:1000,height:560,fill:K.carta},scr);E('rect',{x:0,y:0,width:1000,height:48,fill:b1.a},scr);mapD(E('g',{},scr),A);headD(E('g',{},scr),b1,1000,48);
  E('path',{d:'M-40 586 H1040 V598 Q1040 612 1022 612 H-22 Q-40 612 -40 598 Z',fill:'#CFCBC1'},li);E('rect',{x:-40,y:586,width:1080,height:4,fill:'#E6E3DB'},li);
  E('path',{d:'M430 586 H570 V590 Q570 596 562 596 H438 Q430 596 430 590 Z',fill:'#A9A59B'},li);
  /* i telefoni: schede pulite come nel multitasking; solo il corriere all'inizio ha la cornice del telefono */
  A.stk=[];A.lbl=[];for(var k=BR.length-1;k>=0;k--){var b=BR[k],g=E('g',{},L);
    if(k===1)A.bez=E('rect',{x:-16,y:-16,width:SW+32,height:SH+32,rx:72,fill:K.ink},g);
    E('rect',{x:8,y:26,width:SW,height:SH,rx:58,fill:K.ink,opacity:.22},g);E('rect',{x:0,y:0,width:SW,height:SH,rx:56,fill:K.carta},g);
    var body=E('g',{},g);BODY[k===1?'courier':b.body](body,A,b);var hd=E('g',{},g);head(hd,b,SW,HB);if(b.body==='clinic')g.appendChild(A.cSms);A.stk[k]={g:g,body:body,w:SW,h:SH}}
  /* l'etichetta sopra ogni scheda: icona e nome, come nel selettore delle app */
  BR.forEach(function(b,k){var lb=E('g',{opacity:0},L);E('circle',{cx:22,cy:0,r:22,fill:K.carta},lb);icon(lb,b.ic,22,0,1.2);txt(lb,56,9,b.n,26,K.ink,'Hanken Grotesk,sans-serif',700);A.lbl[k]=lb});
  A.ghost=[];A.bang=E('g',{opacity:0},L)}
/* la sala della pizzeria vista dall'alto, tre colonne per sei file. Disegnata per il telefono e riusata, ingrandita, nella versione aperta */
var TB18=[];(function(){for(var r=0;r<6;r++)for(var c=0;c<3;c++){var round=(c+r)%3===0;TB18.push({x:130+c*180,y:340+r*76,round:round,seats:round?2:4,id:r*3+c+1})}
  TB18.forEach(function(t){t.rank=Math.hypot(t.x-40,t.y-790)});var o=TB18.slice().sort(function(a,b){return a.rank-b.rank});o.forEach(function(t,i){t.ord=i})})();
var TSTATE=[TINT.white,K.sun,K.cobalt,K.mint,K.tomato];
var KTX=function(q){return 40+q*42},KTY=950;
function floorPlan(g,card){var R={tb:[]};E('rect',{x:20,y:206,width:580,height:604,rx:22,fill:'#EFECE3'},g);txt(g,42,244,'FLOOR · 18 TABLES',17,K.mut);
  var lgx=42;[['FREE',TINT.white,92],['SEATED',K.sun,112],['ORDERED',K.cobalt,124],['SERVED',K.mint,112],['PAID',K.tomato,80]].forEach(function(q){E('circle',{cx:lgx+7,cy:274,r:7,fill:q[1],stroke:K.ink,'stroke-opacity':q[1]===TINT.white?.3:0,'stroke-width':1.5},g);txt(g,lgx+20,280,q[0],14,K.mut);lgx+=q[2]});
  E('rect',{x:40,y:770,width:390,height:30,rx:10,fill:TINT.line},g);txt(g,58,791,'BAR',15,K.mut);E('rect',{x:450,y:770,width:130,height:30,rx:10,fill:K.ink},g);txt(g,515,791,'PASS',15,K.carta,null,500,'middle');
  TB18.forEach(function(t){var tg=E('g',{transform:'translate('+t.x+' '+t.y+')'},g);
    if(t.round){[-36,36].forEach(function(dx){E('circle',{cx:dx,cy:0,r:8,fill:K.ink,opacity:.22},tg)});var sh=E('circle',{r:25,fill:TINT.white,stroke:K.ink,'stroke-opacity':.18,'stroke-width':2},tg)}
    else{[[-37,-9,10,18],[27,-9,10,18],[-9,-35,18,10],[-9,25,18,10]].forEach(function(d){E('rect',{x:d[0],y:d[1],width:d[2],height:d[3],rx:4,fill:K.ink,opacity:.22},tg)});var sh=E('rect',{x:-22,y:-22,width:44,height:44,rx:9,fill:TINT.white,stroke:K.ink,'stroke-opacity':.18,'stroke-width':2},tg)}
    txt(tg,0,6,String(t.id),17,K.ink,null,500,'middle');R.tb.push({g:tg,sh:sh,st:-1,t:t})});
  var kc=E('g',{},g);E('rect',{x:20,y:826,width:280,height:200,rx:22,fill:TINT.white},kc);txt(kc,40,870,'Kitchen',26,K.ink,'Hanken Grotesk,sans-serif',700);txt(kc,280,866,'IN QUEUE',13,K.mut,null,500,'end');
  R.kq=txt(kc,280,914,'0',40,K.ink,'Hanken Grotesk,sans-serif',700,'end');R.kt=[];for(var q=0;q<6;q++){E('rect',{x:KTX(q)+.75,y:KTY+.75,width:34.5,height:50.5,rx:6,fill:'none',stroke:TINT.line,'stroke-width':2,'stroke-dasharray':'5 4'},kc);var kg=E('g',{opacity:0},kc);E('rect',{x:KTX(q),y:KTY,width:36,height:52,rx:6,fill:K.sun},kg);txt(kg,KTX(q)+18,KTY+21,'T'+[7,3,12,5,16,9][q],13,K.ink,null,500,'middle');E('rect',{x:KTX(q)+7,y:KTY+31,width:22,height:4,rx:2,fill:K.ink,opacity:.35},kg);E('rect',{x:KTX(q)+7,y:KTY+40,width:14,height:4,rx:2,fill:K.ink,opacity:.35},kg);R.kt.push(kg)}
  var dc=E('g',{},g);E('rect',{x:320,y:826,width:280,height:200,rx:22,fill:TINT.white},dc);txt(dc,340,870,'Delivery',26,K.ink,'Hanken Grotesk,sans-serif',700);R.rdn=txt(dc,340,898,'0 RIDERS OUT',14,K.mut,null,500);
  E('rect',{x:340,y:912,width:240,height:96,rx:12,fill:TINT.land},dc);[944,976].forEach(function(y){E('rect',{x:340,y:y,width:240,height:6,fill:K.carta},dc)});[400,470,530].forEach(function(x){E('rect',{x:x,y:912,width:6,height:96,fill:K.carta},dc)});
  R.rd=[0,1,2].map(function(i){return E('circle',{r:8,fill:K.cobalt,stroke:K.carta,'stroke-width':3,cx:346,cy:947,opacity:0,style:'display:none'},dc)});
  var tn=E('g',{},g);E('rect',{x:20,y:1042,width:580,height:176,rx:24,fill:K.ink},tn);txt(tn,44,1080,'TONIGHT',15,K.carta,null,500);txt(tn,44,1116,'COVERS',15,K.sun);R.cov=txt(tn,44,1190,'38',64,K.carta,'Hanken Grotesk,sans-serif',700);
  txt(tn,290,1116,'REVENUE',15,K.sun);R.rev=txt(tn,290,1186,'€ 1,140',46,K.carta,'Hanken Grotesk,sans-serif',700);
  R.res=E('g',{opacity:0},g);E('rect',{x:6,y:10,width:262,height:56,rx:28,fill:K.ink,opacity:.2},R.res);E('rect',{x:0,y:0,width:262,height:56,rx:28,fill:K.ink},R.res);E('circle',{cx:30,cy:28,r:9,fill:K.sun},R.res);txt(R.res,50,35,'Ross · 4 · 21:00',20,K.carta);
  R.flow=[];for(var c0=0;c0<8;c0++)R.flow.push(E('path',{fill:'none',stroke:K.tomato,'stroke-width':3,'stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1,opacity:0},g));
  R.chips=[];for(var c=0;c<8;c++)R.chips.push(E('rect',{width:30,height:22,rx:5,fill:K.tomato,opacity:0},g));
  R.kd=E('path',{d:'M300 920 H320',stroke:K.cobalt,'stroke-width':4,fill:'none',opacity:0},g);
  R.spark=E('path',{fill:'none',stroke:K.sun,'stroke-width':3,'stroke-linejoin':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},tn);R.sparkD=[];
  return R}
function setTable(T,st){if(T.st===st)return;T.st=st;T.sh.setAttribute('fill',TSTATE[st]);T.sh.setAttribute('stroke-opacity',st?0:.18)}
var CARD_SEATED=[2,5,9,10,14,17];
/* coreografia: si parte da portatile e telefono del corriere; il telefono viene davanti e diventa una scheda, si apre il multitasking,
   si scorre da un'app all'altra (clinica, palestra), l'ultima è la pizzeria che si apre a tutto schermo */
var CAR=[7,1,0,2,3,4,5],CPOS={};CAR.forEach(function(k,p){CPOS[k]=p});
var SWS=.78,CGAP=500,CYC=840,SWPV=[[2.4,2.68],[3.3,3.58],[4.44,4.72]],EXP=[5.35,5.85],DS=1.21,LPS2=.76;
function focusAt(v){var fo=1;SWPV.forEach(function(w){fo+=ez.io3(P(v,w[0],w[1]))});return fo}
function cardGeom(k,v){var p=CPOS[k];if(p==null)return {cx:-3000,cy:0,s:1,rot:0,o:0,ex:0};
  var so=ez.io3(P(v,2.05,2.32)),fo=focusAt(v),ex=ez.io3(P(v,EXP[0],EXP[1]));
  var cx=450+(p-fo)*CGAP*lerp(1.9,1,so),cy=CYC,s=SWS,o=so,rot=0;
  if(k===1){var ri=ez.out3(P(v,0,.5)),pc=ez.io3(P(v,1.62,2.05));o=1;
    if(v<2.05){cx=lerp(590,450,pc);cy=lerp(1115+760*(1-ri),CYC,pc);s=lerp(.48,1,pc);rot=lerp(8,0,pc)}else{cx=450+(p-fo)*CGAP;s=lerp(1,SWS,so)}}
  if(k===3){cx=lerp(cx,450,ex);cy=lerp(cy,800,ex);s=lerp(s,DS,ex)}else{cx+=(cx-450)*1.3*ex;o*=1-ex}
  return {cx:cx,cy:cy,s:s,rot:rot,o:o,ex:ex}}
function renderStack(A,t){var v=t-STK0,on=v>=0&&v<STKD+.12;op(A.SL,on?1:0);if(!on)return;
  A.stk.forEach(function(c,k){var G2=cardGeom(k,v);c.g.setAttribute('transform','translate('+f(G2.cx)+' '+f(G2.cy)+') rotate('+f(G2.rot)+') scale('+f(G2.s)+') translate('+(-c.w/2)+' '+(-c.h/2)+')');op(c.g,G2.o);
    var lb=A.lbl[k];if(lb){var lo=G2.o*ez.io3(P(v,2.12,2.4))*(1-ez.io3(P(v,EXP[0],EXP[0]+.2)));op(lb,lo);lb.setAttribute('transform','translate('+f(G2.cx-SW/2*G2.s)+' '+f(G2.cy-SH/2*G2.s-44)+')')}});
  /* il portatile sale insieme al telefono, poi esce in alto quando il telefono viene davanti */
  var ri=ez.out3(P(v,0,.5)),lx=ez.io3(P(v,1.62,2.0));op(A.lap,1-lx);
  A.lap.setAttribute('transform','translate('+f(450-530*LPS2)+' '+f(215+1300*(1-ri)-700*lx)+') scale('+LPS2+')');
  op(A.bez,1-ez.io3(P(v,1.75,2.05)));
  /* il corriere: il furgone segue il percorso sul portatile e sul telefono del cliente, l'ETA scende */
  var rp=ez.io3(P(v,.35,1.55));A.rLine.setAttribute('stroke-dashoffset',f(1-rp));var len=A.rBase.getTotalLength?A.rBase.getTotalLength():1;
  var vin=ez.out3(P(v,.25,.42)),pt=A.rBase.getPointAtLength?A.rBase.getPointAtLength(len*rp):{x:60,y:500};op(A.van,v>.22?1:0);A.van.setAttribute('transform','translate('+f(lerp(-260,pt.x,vin))+' '+f(lerp(620,pt.y,vin))+')');
  var eta=Math.max(1,Math.round(12-11*rp));A.eta.setAttribute('transform','translate('+f(pt.x+26)+' '+f(pt.y-56)+')');A.etaT.textContent='ETA '+eta+' MIN';
  A.etaRing.setAttribute('stroke-dashoffset',f(1-rp));A.etaN.textContent=String(eta);
  var lv=rp*3;A.tlFill.setAttribute('height',f(170*Math.min(1,lv/3)));A.tl.forEach(function(st,i){var on2=v>.3&&lv>=i-.02;st.d.setAttribute('fill',on2?K.cobalt:TINT.white);st.d.setAttribute('stroke',on2?K.cobalt:TINT.line);st.l.setAttribute('opacity',on2?1:.4)});
  A.cR.setAttribute('stroke-dashoffset',f(1-rp));var cl2=A.cRB.getTotalLength?A.cRB.getTotalLength():1,cp=A.cRB.getPointAtLength?A.cRB.getPointAtLength(cl2*rp):{x:90,y:690};
  A.cVan.setAttribute('transform','translate('+f(cp.x)+' '+f(cp.y)+')');A.cEta.textContent=eta+' min';
  A.cSt.forEach(function(d,i){var on3=rp>=[0,.25,.98][i];d.setAttribute('fill',on3?K.mint:TINT.line)});A.cStF.setAttribute('width',f(380*Math.min(1,rp*1.02)));
  /* clinica: l'appuntamento entra da fuori e si incastra; il messaggio al paziente scende dall'alto */
  var a1=ez.out3(P(v,2.72,3.0)),la=P(v,3.0,3.12);A.cNew.setAttribute('transform','translate('+f(lerp(760,130,a1))+' '+f(lerp(380,744,a1))+') rotate('+f(14*(1-a1))+' 225 55) scale('+f(1.25-.25*a1+.04*Math.sin(Math.PI*la))+')');
  op(A.cSlot,1-P(v,2.97,3.02));op(A.cNew,v>2.7?1:0);var sm=ez.back(P(v,3.06,3.06+D.med),1.2);op(A.cSms,v>3.06?1:0);A.cSms.setAttribute('transform','translate(30 '+f(lerp(-150,22,sm))+')');
  /* palestra: gli anelli si chiudono, il battito sale, gli esercizi si spuntano */
  var rg=[ez.io3(P(v,3.62,4.28)),ez.io3(P(v,3.68,4.32)),ez.io3(P(v,3.74,4.36))],tgt=[.86,.78,.92];A.rings.forEach(function(r,i){r.setAttribute('stroke-dashoffset',f(1-tgt[i]*rg[i]))});
  A.ringPct.textContent=Math.round(82*rg[0])+'%';A.hr.setAttribute('stroke-dashoffset',f(1-ez.io3(P(v,3.62,4.32))));A.bpm.textContent=String(Math.round(128+14*ez.io3(P(v,3.66,4.32))));
  A.ex.forEach(function(e,i){var a=3.72+i*.15,done=v>a&&i<4,cur=v>a-.15&&!done&&i<=4&&v>3.6;op(e.ck,done?ez.back(P(v,a,a+.15)):0);e.bg.setAttribute('fill',cur?TINT.sun:TINT.white)});
  /* pizzeria: una prenotazione cade sul tavolo 7 */
  var C=A.fpC,T7=TB18[6];C.tb.forEach(function(T,i){setTable(T,CARD_SEATED.indexOf(i)>=0?(i%3===0?3:1):0)});
  var rk=ez.out3(P(v,4.8,5.08));op(C.res,v>4.78?1-P(v,5.18,5.26):0);C.res.setAttribute('transform','translate('+f(lerp(700,T7.x-60,rk))+' '+f(lerp(-160,T7.y-88,rk))+') rotate('+f(14*(1-rk))+' 131 28)');
  if(v>5.16){setTable(C.tb[6],1);var pp2=ez.back(P(v,5.16,5.36),2);C.tb[6].g.setAttribute('transform','translate('+T7.x+' '+T7.y+') scale('+f(.7+.3*pp2)+')')}else C.tb[6].g.setAttribute('transform','translate('+T7.x+' '+T7.y+')');
  C.cov.textContent=v>5.16?'42':'38'}
/* il cursore: tocca il telefono, poi trascina il multitasking a sinistra tre volte, poi tocca la pizzeria */
function curStk(v,A){var off=[1000,1760],rest=[790,1290],tp=[610,1185],gA=[700,960],gB=[220,960],pz=[450,700];
  function go(a,b,t0,t1){var p=ez.io3(P(v,t0,t1));return [lerp(a[0],b[0],p),lerp(a[1],b[1],p)-Math.sin(p*Math.PI)*40]}
  if(v<1.1)return off;if(v<1.5)return go(off,tp,1.1,1.5);if(v<1.66)return tp;if(v<2.1)return go(tp,rest,1.66,2.1);
  for(var i=0;i<3;i++){var w=SWPV[i],e=i?SWPV[i-1][1]+.06:2.1;
    if(v<e)return gB;if(v<w[0]-.26)return i?go(gB,rest,e,w[0]-.3):rest;if(v<w[0])return go(rest,gA,w[0]-.26,w[0]);
    if(v<w[1]){var q=ez.io3(P(v,w[0],w[1]));return [lerp(gA[0],gB[0],q),gA[1]]}}
  if(v<4.77)return gB;if(v<5.1)return go(gB,pz,4.77,5.1);if(v<5.4)return pz;return go(pz,off,5.4,5.8)}
function stkPress(v){if(v>1.5&&v<1.6)return true;for(var i=0;i<3;i++){var w=SWPV[i];if(v>w[0]-.02&&v<w[1])return true}return v>5.22&&v<5.32}
/* ---------- la pizzeria aperta a tutto schermo. Start service: il venerdì sera si mette in moto da solo ---------- */
var DO=[450-SW/2*DS,800-SH/2*DS];
function buildDash(A,root){var L=A.DL=E('g',{opacity:0},root);E('rect',{width:900,height:1600,fill:K.tomato},L);E('rect',{width:900,height:1600,fill:'url(#ht)'},L);
  A.dgrid=E('g',{},L);A.dcam=E('g',{},L);L=A.dcam;var W=A.win=E('g',{},L);
  var fw=E('g',{transform:'translate('+f(DO[0])+' '+f(DO[1])+') scale('+DS+')'},W);
  E('rect',{x:8,y:26,width:SW,height:SH,rx:58,fill:K.ink,opacity:.22},fw);E('rect',{x:0,y:0,width:SW,height:SH,rx:56,fill:K.carta},fw);
  var body=E('g',{},fw);A.fpB=floorPlan(body,false);var hb=E('g',{},fw);var b3={};for(var kk in BR[3])b3[kk]=BR[3][kk];b3.meta='';A.sb=head(hb,b3,SW,HB);
  A.cnt=txt(hb,124,154,'FLOOR · FRI 20:30',17,K.carta,null,500);A.cnt.setAttribute('opacity',.75);
  A.stamp=E('g',{opacity:0},body);
  A.toast=E('g',{opacity:0},L);var ti=E('g',{transform:'scale(1.4)'},A.toast);E('rect',{x:6,y:12,width:380,height:72,rx:36,fill:K.ink,opacity:.3},ti);E('rect',{x:0,y:0,width:380,height:72,rx:36,fill:K.carta},ti);E('circle',{cx:38,cy:36,r:9,fill:K.mint},ti);
  txt(ti,62,32,'Friday night · 214 covers',18,K.ink,'Hanken Grotesk,sans-serif',700);txt(ti,62,54,'0 ERRORS · AUTOPILOT',12,K.cobalt)}
function svT(i){return 10.45+TB18[i].ord*.055}
var TOX=450-190*1.4,TOY=36;
function renderDash(A,t){var on=t>9.9&&t<12.9;op(A.DL,on?1:0);if(!on)return;op(A.dgrid,0);var B=A.fpB;
  op(A.win,1);
  var B2=A.sb,live=t>10.36,hov=t>10.2&&!live,prs=P(t,10.3,10.34)*(1-P(t,10.36,10.42)),done2=t>11.65;
  B2.r.setAttribute('fill',live?'#3A3A36':hov?K.sun:K.carta);B2.t.setAttribute('fill',live?K.carta:K.ink);B2.t.textContent=done2?'Service complete':live?'Service live':'Start service';
  B2.t.setAttribute('font-size',done2?18:20);
  op(B2.pl,live?0:1);op(B2.dt,live?1:0);B2.dt.setAttribute('r',f(done2?7:7+2.4*Math.max(0,Math.sin((t-10.36)*9))));
  B2.b.setAttribute('transform','translate(109 24) scale('+f(1-.06*prs)+') translate(-109 -24)');
  A.cnt.textContent=t>11.65?'0 ERRORS · FRI 20:30':t>10.36?'LIVE · FRI 20:30':'FLOOR · FRI 20:30';
  B.tb.forEach(function(T,i){var s0=svT(i),st=CARD_SEATED.indexOf(i)>=0||i===6?(i%3===0?3:1):0;if(t>s0)st=1;if(t>s0+.22)st=2;if(t>s0+.5)st=3;if(t>s0+.82&&T.t.ord%4===0)st=4;setTable(T,st);
    var pp=P(t,s0,s0+.2),d2=P(t,11.62+T.t.ord*.012,11.82+T.t.ord*.012),sc=pp>0&&pp<1?1+.18*Math.sin(Math.PI*pp):d2>0&&d2<1?1+.14*Math.sin(Math.PI*d2):1,tr='translate('+T.t.x+' '+T.t.y+') scale('+f(sc)+')';if(T._tr!==tr){T._tr=tr;T.g.setAttribute('transform',tr)}});
  B.chips.forEach(function(c,i){var T=TB18[(i*5+3)%18],a=svT((i*5+3)%18)+.22,p=P(t,a,a+.35),tx=KTX(i%6)+18,ty=KTY+26;op(c,p>0&&p<1?1:0);var x=lerp(T.x,tx,ez.io3(p)),y=lerp(T.y,ty,ez.io3(p))-60*Math.sin(Math.PI*p);c.setAttribute('x',f(x-15));c.setAttribute('y',f(y-11));
    var fl=B.flow[i];if(!fl._d){fl.setAttribute('d','M'+T.x+' '+T.y+' Q'+f((T.x+tx)/2+40)+' '+f((T.y+ty)/2)+' '+tx+' '+ty);fl._d=1}fl.setAttribute('stroke-dashoffset',f(1-ez.io3(p)));op(fl,p>0?.55*(1-P(t,a+.35,a+.55))*(1-P(t,11.45,11.6)):0)});
  op(B.kd,t>10.7&&t<11.7?1:0);
  if(!B.sparkD.length){for(var q=0;q<=24;q++)B.sparkD.push([400+q*7.6,1084-16*(q/24)-7*Math.sin(q*.9)*(q/24)]);B.spark.setAttribute('d','M'+B.sparkD.map(function(p){return f(p[0])+' '+f(p[1])}).join('L'))}
  var kq=Math.round(Math.min(6,Math.max(0,(t-10.6)*9))*(1-P(t,11.4,11.8))+2*P(t,11.4,11.8));B.kq.textContent=String(t>10.5?kq+6:0);B.kt.forEach(function(k,i){op(k,t>10.62+i*.08?(i%2?.55:1):0)});
  var rp=P(t,10.7,11.7);B.rd.forEach(function(r,i){var u=cl(rp*1.4-i*.2);op(r,t>10.7+i*.1?1:0);r.setAttribute('cx',f(346+228*u));r.setAttribute('cy',f([947,979,915][i]+(i===2?32*u:0)))});B.rdn.textContent=(t>10.7?Math.min(6,1+Math.floor((t-10.7)*7)):0)+' RIDERS OUT';
  var cv=ez.io3(P(t,10.42,11.6));B.spark.setAttribute('stroke-dashoffset',f(1-cv));B.cov.textContent=String(Math.round(42+(214-42)*cv));B.rev.textContent='€ '+Math.round(1140+(4860-1140)*cv).toLocaleString('en-US');
  op(A.stamp,0);
  var ts=ez.back(P(t,11.78,11.78+D.med),1.3);op(A.toast,t>11.78?1:0);A.toast.setAttribute('transform','translate('+f(TOX)+' '+f(TOY-200*(1-ts))+')');
}
/* ---------- momento 4: chiusura e loop ---------- */
/* il logo finale è identico al primo fotogramma: centro (450, 800), scala .196 */
var EX0=450-1935*LS,ECY=760;
function buildEnd(A,root){var L=A.EL=E('g',{opacity:0},root);
  var cpEC=E('clipPath',{id:'cpEC'},L);A.eCc=E('circle',{cx:450,cy:ECY,r:0},cpEC);
  var xi=A.eXi=E('g',{},L);U('lgM',{fill:K.ink,'clip-path':'url(#cpEM)'},xi);E('path',{d:LGP.t0,fill:K.ink,'clip-path':'url(#cpE0)'},xi);E('path',{d:LGP.t1,fill:K.ink,'clip-path':'url(#cpE1)'},xi);
  A.eC=E('circle',{cx:450,cy:ECY,r:0,fill:K.ink},L);
  var g=A.eG=E('g',{'clip-path':'url(#cpEC)'},L),x=A.eX=E('g',{},g);
  var cpEM=E('clipPath',{id:'cpEM'},x);A.emr=E('rect',{x:-80,y:0,width:840,height:0},cpEM);
  A.eFill=U('lgM',{fill:K.carta,'clip-path':'url(#cpEM)'},x);
  E('path',{d:LGP.t0,fill:K.carta,'clip-path':'url(#cpE0)'},x);E('path',{d:LGP.t1,fill:K.carta,'clip-path':'url(#cpE1)'},x);
  /* la frase in DM Mono maiuscolo, spaziata: geometrica e a tratto unico come il logo, stesso bianco */
  A.tagl=txt(L,450,ECY+262,'THE MACHINE BEHIND YOUR BUSINESS.',27,K.carta,'DM Mono,monospace',500,'middle');A.tagl.setAttribute('letter-spacing','4.2');
  A.url=txt(L,450,ECY+318,'mothermachine.studio',20,K.carta,'Hanken Grotesk,sans-serif',400,'middle');A.url.setAttribute('opacity',0)}
function renderEnd(A,t){var on=t>12.4;op(A.EL,on?1:0);if(!on)return;
  var back=ez.io3(P(t,14.6,15.02)),opn=P(t,12.42,12.42+D.slow*.8),cy=ECY+40*back,cx=450,r;
  /* il nero nasce dal pallino verde della notifica (0 errori) e copre tutto; poi, a schermo pieno, il centro passa sul logo */
  if(opn<1){cx=TOX+38*1.4;cy=TOY+36*1.4;r=12+1900*ez.io3(opn)}else r=1900*(1-back);
  [A.eC,A.eCc].forEach(function(c){c.setAttribute('r',f(r));c.setAttribute('cx',f(cx));c.setAttribute('cy',f(cy))});
  var mh=1500*ez.io3(P(t,12.72,12.72+D.slow));A.emr.setAttribute('y',f(-mh+10));A.emr.setAttribute('height',f(mh));
  var w0=ez.io3(P(t,13.3,13.72)),w1=ez.io3(P(t,13.38,13.8));A.e0r.setAttribute('width',f(2700*w0));A.e1r.setAttribute('width',f(3200*w1));
  var ly=(opn<1?ECY:cy)+859*LS,LT='translate('+f(EX0)+' '+f(ly)+') scale('+LS+')';A.eX.setAttribute('transform',LT);A.eXi.setAttribute('transform',LT);
  var tp=ez.out3(P(t,13.8,13.8+D.slow));op(A.tagl,tp*(1-P(t,14.45,14.6)));A.tagl.setAttribute('transform','translate(0 '+f(18*(1-tp))+')');
  if(MM_URL)op(A.url,.6*P(t,14.0,14.0+D.med)*(1-P(t,14.45,14.6)));}
function cur2(t,A){
  var off=[1000,1760];function go(a,b,t0,t1){var p=ez.io3(P(t,t0,t1));return [lerp(a[0],b[0],p),lerp(a[1],b[1],p)-Math.sin(p*Math.PI)*40]}
  var k0=[SY.x0+6,SY.y+8];
  if(t<7.9)return off;if(t<8.2)return go(off,k0,7.9,8.2);
  if(t<8.95){var w=wghtAt(t);return [SY.x0+(SY.x1-SY.x0)*(w-100)/800+6,SY.y+8]}
  if(t<9.35)return go([SY.x1+6,SY.y+8],off,8.95,9.35);
  var T=[DO[0]+(372+150)*DS,DO[1]+(98+30)*DS];
  if(t<10.05)return off;if(t<10.3)return go(off,T,10.05,10.3);if(t<10.42)return T;if(t<10.75)return go(T,off,10.42,10.75);return off}
/* prima dell'inizio: si parte dal logo intero, che si smonta (parole che rientrano, la m che perde un piano), salta via e ricade */
function renderPre(A,p){var w=1-ez.io3(P(p,0,.36));A.t0r.setAttribute('width',f(2700*w));A.t1r.setAttribute('width',f(3200*w));op(A.car0,0);op(A.car1,0);
  var g=1-ez.io3(P(p,.26,.56)),dy=940*(1-g);A.ink.fr.setAttribute('transform','translate(0 '+f(dy)+')');
  /* anticipazione schiacciata, poi lancio: parte veloce e rallenta salendo, allungata nella direzione del moto */
  var k=ez.io3(P(p,.3,.62)),sq=Math.sin(Math.PI*P(p,.56,.7)),jp=P(p,.66,1),up=-1150*(1-(1-jp)*(1-jp));
  var sx=1+.15*sq,sy=1-.22*sq;if(jp>0){sy=1+.22*(1-jp);sx=1-.1*(1-jp)}
  A.ink.x.setAttribute('transform','translate('+f(lerp(XM,450,k))+' '+f(lerp(YM,1130,k)+up)+') scale('+f(lerp(LS,.5,k)*sx)+' '+f(lerp(LS,.5,k)*sy)+') translate(-340 0)')}
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
    var grab=(i===5&&t>2.05&&t<2.62)?1.35:1;h.setAttribute('transform','translate('+f(x)+' '+f(y)+') scale('+f(s*grab)+') translate(-9 -9)');h.setAttribute('fill',i===5&&t>2.05&&t<2.62?K.cobalt:'#fff')});
  var W=Math.round(bw-pad*2),H=Math.round(bh-pad*2);A.dimT.textContent=W+' × '+H;var dw=W>999?160:144;
  A.dimR.setAttribute('x',f(-dw/2));A.dimR.setAttribute('width',dw);A.dimR.setAttribute('fill',(t>2.1&&t<2.62)?K.tomato:K.cobalt);
  A.dim.setAttribute('transform','translate('+f(bx+bw/2)+' '+f(by+bh+16)+')');op(A.dim,P(t,1.64,1.78));
  A.nm.setAttribute('x',f(bx));A.nm.setAttribute('y',f(by-16));op(A.nm,P(t,1.62,1.76));
  /* cursore */
  var CM=camAt(t);op(A.cam,t>7.02?0:1);A.cam.setAttribute('transform','translate('+f(CM.sx)+' '+f(CM.sy)+') scale('+f(CM.s)+') translate('+f(-CM.px)+' '+f(-CM.py)+')');
  var c=curAt(t,A),cs=t<6.45?[CM.sx+(c[0]-CM.px)*CM.s,CM.sy+(c[1]-CM.py)*CM.s]:c;var t2c=t>RUN0?Math.max(RUN0,t-OFF):t;if(t>=6.45)cs=cur2(t2c,A);if(t>=STK0&&t<STK0+STKD+.1)cs=curStk(t-STK0,A);
  var vS=t-STK0,press=(t>2.03&&t<2.62)||(t>3.86&&t<3.98)||(t>5.8&&t<5.9)||(t>8.15&&t<8.95)||(t2c>10.3&&t2c<10.38)||stkPress(vS)?.86:1;A.cur.setAttribute('transform','translate('+f(cs[0])+' '+f(cs[1])+') scale('+press+')');
  /* sulle app niente freccia: il tocco del dito. Compare un attimo prima di toccare, preme, trascina, sparisce */
  var tm2=(t>=STK0&&t<STK0+STKD+.1)||(t2c>=9.9&&t2c<10.9);op(A.cur,tm2?0:1);
  if(tm2){var TW=[[1.5,1.6],[2.38,2.68],[3.28,3.58],[4.42,4.72],[5.22,5.32]],tv=vS,tc=null,to=0,tl=1,inW=false,wi=-1;
    if(t2c>=9.9&&t>=STK0+STKD){TW=[[10.3,10.38]];tv=t2c}
    TW.forEach(function(w,k){var o2=P(tv,w[0]-.2,w[0])*(1-P(tv,w[1],w[1]+.2));if(o2>to){to=o2;wi=k;tl=1+.35*(1-ez.out3(P(tv,w[0]-.2,w[0])))}if(tv>=w[0]&&tv<=w[1])inW=true});
    op(A.tch,to);A.tchC.setAttribute('transform','translate('+f(cs[0])+' '+f(cs[1])+') scale('+f(inW?.86:tl)+')');
    var drag=inW&&TW[wi]&&TW[wi][1]-TW[wi][0]>.2;A.tchG.forEach(function(gc){op(gc,0)});
    var rp=wi>=0?P(tv,TW[wi][0],TW[wi][0]+.3):0;A.tchR.setAttribute('cx',f(cs[0]));A.tchR.setAttribute('cy',f(cs[1]));A.tchR.setAttribute('r',f(32+34*ez.out3(rp)));op(A.tchR,rp>0&&rp<1&&!drag?.75*(1-rp):0)}else op(A.tch,0);
  /* "non si deforma" */
  var tg=ez.back(P(t,2.42,2.62)),tgo=P(t,3.0,3.12);op(A.tag,t>2.42?1-tgo:0);A.tag.setAttribute('transform','translate('+f(bx+bw/2-125)+' '+f(by+bh+92)+') scale('+f(1.45*tg)+')');
  /* contorni: ⌘Y */
  var om=t>3.24&&t<3.52;op(A.outl,om?1:0);op(A.ink.g,(om||t>4.3)?0:1);
  op(A.key,t>3.14&&t<3.7?1:0);A.key.setAttribute('transform','translate(50 '+f(1470+40*(1-ez.out3(P(t,3.14,3.3))))+')');
  /* campioni */
  A.sw.forEach(function(g,i){var s=ez.back(P(t,3.42+i*.04,3.64+i*.04)),o=1-P(t,4.05,4.25);op(g,t>3.42?o:0);g.setAttribute('transform','translate('+f(SWX+i*70)+' '+SWY+') scale('+f(s)+')')});
  A.ring.setAttribute('cx',SWX);A.ring.setAttribute('cy',SWY);op(A.ring,t>3.9?1-P(t,4.05,4.25):0);
  /* click */
  var ck=P(t,3.9,4.25);A.clk.setAttribute('cx',SWX);A.clk.setAttribute('cy',SWY);A.clk.setAttribute('r',f(12+80*ez.out3(ck)));op(A.clk,ck>0&&ck<1?1-ck:0);
  /* allagamento: cerchio dal click, poi diventa la cella */
  var fr=ez.in3(P(t,3.92,4.34))*1;A.flC.setAttribute('cx',SWX);A.flC.setAttribute('cy',SWY);A.flC.setAttribute('r',f(t<4.36?1900*Math.sqrt(fr):0));
  var g2=ez.io3(P(t,4.4,4.92)),cx=cellXY(MAIN);
  if(t>=4.36){A.flR.setAttribute('x',f(lerp(0,cx[0],g2)));A.flR.setAttribute('y',f(lerp(0,cx[1],g2)));A.flR.setAttribute('width',f(lerp(900,VCW,g2)));A.flR.setAttribute('height',f(lerp(1600,VCH,g2)));A.flR.setAttribute('rx',f(18*CS*g2))}
  else A.flR.setAttribute('width',0);
  /* griglia di varianti */
  var cM=cellCR(MAIN),cT=cellCR(6);A.cells.forEach(function(cc,i){if(!cc)return;var cr=cellCR(i),dx=cr[0]-cM[0],dyy=cr[1]-cM[1],d=Math.hypot(dx,dyy);
    var a=4.62+d*.075+(i%3)*.02,p=P(t,a,a+.5),s=.9+.1*ez.back(p,1.4),r=(1-ez.out3(p))*((i%2)?-3:3);
    var d6=Math.hypot(cr[0]-cT[0],cr[1]-cT[1]),fa=5.92+d6*.06,q=P(t,fa,fa+.2),fy=Math.abs(Math.cos(Math.PI*q));
    if(cc.b){op(cc.a,q>.5?0:1);op(cc.b,q>.5?1:0)}
    cc.g.setAttribute('transform','translate('+f(cc.x+VCW/2)+' '+f(cc.y+VCH/2+44*(1-ez.out3(p)))+') rotate('+f(r)+') scale('+f(s*CS)+' '+f(s*CS*Math.max(fy,.02))+') translate('+(-CW/2)+' '+(-CH/2)+')');op(cc.g,ez.out3(P(t,a,a+D.fast)))});
  A.floodR.setAttribute('fill',t>5.92+.06+.1?K.cobalt:K.tomato);
  /* sbuffo di puntini quando la m tocca terra */
  /* righe guida: quando la m tocca terra si tracciano linea di base e altezza della x; quando cresce, l'ascendente */
  /* le righe seguono il logo: stessa trasformazione, quindi restano esatte anche quando la camera si muove */
  var go=1-P(t,1.3,1.3+D.med),LG0=LX(Math.min(t,1.6)),cxm=mp(LG0,340,0)[0];
  A.gd.forEach(function(q,i){var a=[.36,.44,.72][i],p=ez.io3(P(t,a,a+D.slow)),hw=380*p,y=mp(LG0,0,[0,-528,-1468][i])[1];
    op(q.g,t>a?go:0);q.l.setAttribute('x1',f(cxm-hw));q.l.setAttribute('x2',f(cxm+hw));q.l.setAttribute('y1',f(y));q.l.setAttribute('y2',f(y));
    q.lb.setAttribute('x',f(cxm-380));q.lb.setAttribute('y',f(y-12));q.vl.setAttribute('x',f(cxm+380));q.vl.setAttribute('y',f(y-12));var lo=P(t,a+.22,a+.22+D.fast);op(q.lb,lo);op(q.vl,lo)});
  A.gv.forEach(function(l,i){var a=.48+i*.05,p=ez.io3(P(t,a,a+D.slow)),b=mp(LG0,i?696:-16,40),tp=mp(LG0,0,-528-940*ez.back(P(t,.55,.95),1.6)-40);
    l.setAttribute('x1',f(b[0]));l.setAttribute('x2',f(b[0]));l.setAttribute('y1',f(b[1]));l.setAttribute('y2',f(lerp(b[1],tp[1],p)));op(l,t>a?.9*go:0)});
  /* retino sul bordo dell'allagamento: puntini che crescono fino a diventare colore pieno */
  var R0=t<4.36?1900*Math.sqrt(fr):0,BND=230;
  if(t>3.9&&t<4.4){A.flC.setAttribute('r',f(Math.max(0,R0-BND*.82)));A.fd.forEach(function(d){var dd=Math.hypot(d.x-SWX,d.y-SWY),u=(R0-dd)/BND,r=u<=0||u>=.9?0:12.2*Math.pow(u/.9,.75);if(Math.abs(r-d.r)>.05){d.r=r;d.e.setAttribute('r',f(r))}});A.fdOn=1}
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
API={V:1,build:build,render:renderW,DUR:DUR,BPM:BPM,warp:setWarp,anchors:function(){return WAN.map(REAL0)},MAP:MAP,REAL:REAL,K:K,PREr:PREr,OFF:OFF,RUN0:RUN0,STK0:STK0,TB18:TB18,cellXY:cellXY,MAIN:MAIN};return API})();
