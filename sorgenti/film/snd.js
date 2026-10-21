/* ===== Mother Machine · suono e musica =====
   Nessun file audio. Effetti e musica sono sintetizzati nel browser e agganciati all'orologio dell'animazione.
   La musica è composta qui (originale, nessun diritto da pagare): stesso tempo per tutto il film, ma ogni sezione
   riparte esattamente sul taglio del film. Gli effetti sono pochi e asciutti: la musica porta l'emozione. */
var MMS=(function(){
var AC=null,master=null,bus=null,NB=null,REV=null,DLY=null,on=false,vol=.7,idx=0,LOOK=.26,cues=[],MK=1.45,TRK=null,TBUF=null,TOFF=0,TGAIN=1;
var BPM=131,BT=60/BPM;
function h(n){n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n)}
var TR=0;/* trasposizione della musica, solo mentre suona una nota della canzone */
function nt(n){return 261.63*Math.pow(2,(n+TR)/12)}
function cl(x){return x<0?0:x>1?1:x}function P(t,a,b){return cl((t-a)/(b-a))}
function io3(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
function pan(x){return Math.max(-.7,Math.min(.7,(x-800)/800*.6))}

/* ---------- motore ---------- */
function ir(ctx,sec){var n=Math.floor(ctx.sampleRate*sec),b=ctx.createBuffer(2,n,ctx.sampleRate);
  for(var c=0;c<2;c++){var d=b.getChannelData(c);for(var i=0;i<n;i++){var k=i/n;d[i]=(h(i*.37+c*91)*2-1)*Math.pow(1-k,3.4)*(k<.01?k/.01:1)}}return b}
function setup(ctx,dest){AC=ctx;bus=null;
  var sh=AC.createBiquadFilter();sh.type='highshelf';sh.frequency.value=9000;sh.gain.value=-4;
  var comp=AC.createDynamicsCompressor();comp.threshold.value=-18;comp.knee.value=10;comp.ratio.value=3;comp.attack.value=.006;comp.release.value=.2;
  var lim=AC.createDynamicsCompressor();lim.threshold.value=-2;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.001;lim.release.value=.08;
  master=AC.createGain();master.gain.value=vol*MK;var hp0=AC.createBiquadFilter();hp0.type='highpass';hp0.frequency.value=32;master.connect(hp0);hp0.connect(sh);sh.connect(comp);comp.connect(lim);lim.connect(dest||AC.destination);
  /* riverbero corto e scuro */
  var rv=AC.createConvolver();rv.buffer=ir(AC,2.2);var rhp=AC.createBiquadFilter();rhp.type='highpass';rhp.frequency.value=300;var rlp=AC.createBiquadFilter();rlp.type='lowpass';rlp.frequency.value=6000;
  REV=AC.createGain();REV.connect(rhp);rhp.connect(rv);rv.connect(rlp);var rg=AC.createGain();rg.gain.value=.32;rlp.connect(rg);rg.connect(master);
  /* eco a tempo (croma puntata) per i pluck */
  var dl=AC.createDelay(2);dl.delayTime.value=BT*.75;var fb=AC.createGain();fb.gain.value=.34;var dlp=AC.createBiquadFilter();dlp.type='lowpass';dlp.frequency.value=2600;
  DLY=AC.createGain();DLY.connect(dl);dl.connect(dlp);dlp.connect(fb);fb.connect(dl);var dg=AC.createGain();dg.gain.value=.5;dlp.connect(dg);dg.connect(master);
  NB=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);var d=NB.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=h(i*.731+.5)*2-1;
  newBus()}
/* una sessione di ascolto: si taglia di netto quando metti pausa o salti */
function newBus(){if(bus){var o=bus,n=AC.currentTime;o.g.gain.setTargetAtTime(0,n,.012);if(o.src){try{o.src.stop(n+.08)}catch(e){}}setTimeout(function(){try{o.g.disconnect();o.w.disconnect();o.e.disconnect()}catch(e){}},250)}
  var g=AC.createGain(),w=AC.createGain(),e=AC.createGain();g.connect(master);w.connect(REV);e.connect(DLY);
  var dr=AC.createWaveShaper();dr.curve=CURVE();dr.oversample='2x';var drg=AC.createGain();drg.gain.value=.55;dr.connect(drg);
  var sfx=AC.createGain();sfx.gain.value=1.35;sfx.connect(g);var mus=AC.createGain();mus.gain.value=.27*(SG[STYLE]||1);/* mix della musica: meno fango sui medio bassi, più presenza e un filo d'aria */var q1=AC.createBiquadFilter();q1.type='peaking';q1.frequency.value=240;q1.Q.value=.9;q1.gain.value=-2.5;var q2=AC.createBiquadFilter();q2.type='peaking';q2.frequency.value=2700;q2.Q.value=.8;q2.gain.value=3;var q3=AC.createBiquadFilter();q3.type='highshelf';q3.frequency.value=7500;q3.gain.value=3.5;mus.connect(q1);q1.connect(q2);q2.connect(q3);q3.connect(g);var duck=AC.createGain();var mf=AC.createBiquadFilter();mf.type='lowpass';mf.frequency.value=20000;mf.Q.value=.7;duck.connect(mf);mf.connect(mus);drg.connect(duck);
  bus={g:g,w:w,e:e,sfx:sfx,mus:mus,duck:duck,drive:dr,mf:mf}}
function CURVE(){if(CURVE.c)return CURVE.c;var n=2048,c=new Float32Array(n);for(var i=0;i<n;i++){var x=i/(n-1)*2-1;c[i]=Math.tanh(2.6*x)/Math.tanh(2.6)}return CURVE.c=c}
function out(o){var g=AC.createGain(),last=g,p=null;if(AC.createStereoPanner){p=AC.createStereoPanner();p.pan.value=o.pan||0;g.connect(p);last=p}
  last.connect(o.to==='m'?bus.mus:o.to==='d'?bus.duck:o.to==='x'?bus.drive:bus.sfx);
  if(o.rev){var s=AC.createGain();s.gain.value=o.rev;last.connect(s);s.connect(bus.w)}
  if(o.echo){var s2=AC.createGain();s2.gain.value=o.echo;last.connect(s2);s2.connect(bus.e)}return {g:g,p:p}}
function env(g,w,o){var a=o.a||.003,d=o.d||.2,v=o.v;g.setValueAtTime(0,w);
  if(o.peak){g.linearRampToValueAtTime(v,w+d*o.peak);g.linearRampToValueAtTime(0,w+d)}
  else if(o.sus){g.linearRampToValueAtTime(v,w+a);g.setValueAtTime(v,w+d-o.rel);g.linearRampToValueAtTime(0,w+d)}
  else{g.linearRampToValueAtTime(v,w+a);g.exponentialRampToValueAtTime(.0001,w+a+d)}return o.peak||o.sus?d:a+d}
function tone(w,o){var os=AC.createOscillator();os.type=o.type||'sine';os.frequency.setValueAtTime(o.f,w);if(o.f1)os.frequency.exponentialRampToValueAtTime(o.f1,w+(o.gl||o.d||.2));if(o.det)os.detune.value=o.det;
  var q=out(o),len=env(q.g.gain,w,o),src=os;
  if(o.lp){var f=AC.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(o.lp,w);if(o.lp1)f.frequency.exponentialRampToValueAtTime(o.lp1,w+(o.lpt||len));f.Q.value=o.lq||.7;src.connect(f);src=f}
  if(o.hp){var hf=AC.createBiquadFilter();hf.type='highpass';hf.frequency.value=o.hp;src.connect(hf);src=hf}
  src.connect(q.g);
  if(o.pan1!==undefined&&q.p)q.p.pan.linearRampToValueAtTime(o.pan1,w+len);
  os.start(w);os.stop(w+len+.05)}
function noise(w,o){var s=AC.createBufferSource();s.buffer=NB;s.loop=true;
  var f=AC.createBiquadFilter();f.type=o.type||'bandpass';f.Q.value=o.q||1;f.frequency.setValueAtTime(o.f,w);
  var q=out(o),len=env(q.g.gain,w,o);if(o.f1)f.frequency.exponentialRampToValueAtTime(o.f1,w+len);
  var src=f;if(o.lp){var l2=AC.createBiquadFilter();l2.type='lowpass';l2.frequency.value=o.lp;f.connect(l2);src=l2}
  if(o.pan1!==undefined&&q.p)q.p.pan.linearRampToValueAtTime(o.pan1,w+len);
  s.connect(f);src.connect(q.g);s.start(w,h(w*13.1)*1.5);s.stop(w+len+.05)}

/* ---------- effetti: asciutti, corti, senza melodie ---------- */
var S={
 tap:function(w,v,p){noise(w,{f:2300,q:1.1,d:.012,v:v*.7,pan:p});tone(w,{f:170,f1:110,gl:.04,d:.05,v:v,pan:p})},
 tick:function(w,v,p){noise(w,{type:'highpass',f:5200,d:.006,v:v,pan:p})},
 click:function(w,v,p){noise(w,{f:3000,q:.9,d:.012,v:v,pan:p});tone(w,{f:1200,f1:800,gl:.015,d:.018,v:v*.25,pan:p});noise(w+.075,{f:3800,q:.9,d:.008,v:v*.3,pan:p})},
 key:function(w,v,s,p){noise(w,{f:1700+h(s)*1400,q:1.2,d:.022,v:v,pan:p});tone(w,{f:150+h(s+1)*50,f1:90,gl:.025,d:.04,v:v*.5,pan:p})},
 air:function(w,d,f0,f1,v,p0,p1,pk){noise(w,{f:f0,f1:f1,q:.8,d:d,v:v,peak:pk||.6,pan:p0||0,pan1:p1,lp:2200,rev:.1})},
 thud:function(w,v,p){tone(w,{f:95,f1:42,gl:.12,d:.32,v:v,pan:p});noise(w,{type:'lowpass',f:500,d:.05,v:v*.35,pan:p})},
 flick:function(w,v,p){noise(w,{f:1800,f1:700,q:1.4,d:.04,v:v,pan:p,lp:3000})},
 swell:function(w,d,v){noise(w,{type:'lowpass',f:200,f1:2200,d:d,v:v,peak:.8,rev:.2});tone(w,{f:45,f1:70,gl:d,d:d,v:v*.8,peak:.8})},
 glitch:function(w,d,v,s){var n=Math.floor(d/.026);for(var k=0;k<n;k++){var r=h(s+k*1.7),tw=w+k*.026;if(r<.5)tone(tw,{type:'square',f:60+h(s+k*3.1)*900,d:.014+h(k+s)*.016,v:v*(.3+r),lp:2400,pan:(h(k*5.3+s)-.5)});
   else if(r<.8)noise(tw,{f:600+h(k*2.2)*3000,q:2.5,d:.016,v:v*.6,pan:(h(k*1.9)-.5)*.8})}},
 rain:function(w,d,v,s,dens){var n=Math.floor(d*dens);for(var k=0;k<n;k++){var u=h(s+k*.91),tw=w+u*d,e=Math.sin(Math.PI*u);noise(tw,{type:'highpass',f:4000+h(s+k*2.3)*3000,d:.006,v:v*(.25+.75*e)*(.4+h(k*7.7)*.6),pan:(h(s+k*4.1)-.5)*1.4})}},
 riser:function(w,d,v){noise(w,{f:300,f1:5000,q:.8,d:d,v:v,peak:.96,rev:.2,lp:7000})},
 hit:function(w,v){tone(w,{f:70,f1:38,gl:.25,d:.6,v:v});noise(w,{type:'lowpass',f:1600,d:.18,v:v*.35,rev:.4})},
 ripple:function(w,d,v,f0,s){/* un'onda che gira le tessere: tanti scatti piccoli che si allargano e si spengono */
   var n=30;for(var k=0;k<n;k++){var u=Math.pow(k/n,.85),tw=w+u*d,e=Math.sin(Math.PI*Math.min(1,k/n*1.15)),p=(h(s+k*3.3)-.5)*1.4;
     noise(tw,{f:f0*(1+.35*h(s+k)),q:3,d:.012,v:v*e*(.5+.5*h(k*7.1+s)),pan:p});if(k%3===0)tone(tw,{type:'triangle',f:f0*.5*(1+.2*h(k+s)),d:.02,v:v*.35*e,pan:p})}
   noise(w,{f:350,f1:900,q:1.2,d:d,v:v*.5,peak:.4,lp:1500})},
 motor:function(w,d,v,p0,p1){/* il furgone elettrico: un ronzio morbido che sale un filo, e il rotolare delle gomme */
   tone(w,{type:'triangle',f:95,f1:150,gl:d,d:d,v:v,peak:.5,lp:420,pan:p0,pan1:p1});tone(w,{type:'triangle',f:190,f1:300,gl:d,d:d,v:v*.25,peak:.5,lp:700,pan:p0,pan1:p1});
   noise(w,{f:380,f1:620,q:1.6,d:d,v:v*.6,peak:.45,lp:1000,pan:p0,pan1:p1})},
 blip:function(w,f,v,p){tone(w,{f:f,d:.05,v:v,pan:p,rev:.12});noise(w,{type:'highpass',f:6000,d:.004,v:v*.5,pan:p})},
 print:function(w,v,p){for(var i=0;i<4;i++)noise(w+i*.016,{f:1400+i*120,q:2.5,d:.01,v:v*(1-i*.18),pan:p})},
 stretch:function(w,d,v){/* gomma che si tende: un cigolio filtrato che sale e un tono basso che tira */
   noise(w,{f:260,f1:1300,q:4,d:d,v:v,peak:.92,lp:2400,pan:.2,pan1:.45});tone(w,{type:'triangle',f:70,f1:150,gl:d,d:d,v:v*.8,peak:.92,lp:500,pan:.3})},
 wobble:function(w,v){/* il rilascio: uno schiocco morbido e poi l'elastico che oscilla e si calma */
   noise(w,{f:2800,f1:500,q:1.2,d:.07,v:v*.7,pan:.3});
   for(var k=0;k<6;k++){var a=Math.exp(-4.2*k*.209),tw=w+k*.205;tone(tw,{f:k%2?118:96,f1:k%2?104:88,gl:.12,d:.16,v:v*a,lp:420,pan:(k%2?.4:.1)})}},
 whomp:function(w,v){tone(w,{f:60,f1:32,gl:.6,d:1.2,v:v});noise(w,{type:'lowpass',f:180,f1:900,d:.7,v:v*.4,peak:.45,rev:.4})}
};

/* ---------- strumenti della musica ---------- */
function duck(w,depth){var g=bus.duck.gain;g.cancelScheduledValues(w);g.setValueAtTime(1,w);g.linearRampToValueAtTime(depth||.45,w+.01);g.linearRampToValueAtTime(1,w+BT*.8)}
var I={
 kick:function(w,v){tone(w,{f:170,f1:50,gl:.06,d:.36,v:v,to:'m'});tone(w,{f:52,d:.22,v:v*.5,a:.01,to:'m'});noise(w,{type:'highpass',f:2500,d:.005,v:v*.22,to:'m'});duck(w)},
 soft:function(w,v){tone(w,{f:120,f1:48,gl:.07,d:.3,v:v,lp:300,to:'m'})},
 snare:function(w,v){noise(w,{f:1900,q:.7,d:.17,v:v,to:'m',rev:.2});noise(w,{type:'highpass',f:6000,d:.07,v:v*.35,to:'m'});tone(w,{f:200,f1:150,gl:.05,d:.09,v:v*.5,to:'m'})},
 clap:function(w,v){for(var i=0;i<3;i++)noise(w+i*.01,{f:1250,q:1.3,d:i<2?.01:.14,v:v*(i<2?.7:1),to:'m',rev:.24})},
 hat:function(w,v,p,open){noise(w,{type:'highpass',f:7800,d:open?.16:.028,v:v,pan:p||0,to:'m'})},
 shk:function(w,v,p){noise(w,{f:9500,q:2,d:.035,v:v,pan:p||0,to:'m'})},
 crash:function(w,v){noise(w,{type:'highpass',f:4500,d:1.8,v:v,to:'m',rev:.35})},
 sub:function(w,v){tone(w,{f:62,f1:34,gl:.7,d:.9,v:v,to:'m'})},
 riser:function(w,d,v){noise(w,{f:400,f1:7000,q:.9,d:d,v:v,peak:.98,to:'m',rev:.3,lp:8000})},
 bass:function(w,n,d,v){tone(w,{f:nt(n),d:d,v:v*.8,sus:1,a:.005,rel:.03,to:'d'});[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:v*.22,sus:1,a:.005,rel:.03,lp:420,lp1:260,lpt:d,lq:1.2,to:'d'})})},
 stab:function(w,ch,v,d,lp){ch.forEach(function(n,i){[-6,6].forEach(function(dt,j){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d||.22,v:v*.09,lp:lp||2200,lp1:500,lpt:.2,pan:j?.3:-.3,to:'d',rev:.25,echo:.18})})})},
 ep:function(w,ch,v,d){ch.forEach(function(n,i){var tw=w+i*.012,f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:(i%2?.18:-.18),to:'m',rev:.35});
   c.frequency.value=f;m.frequency.value=f;mg.gain.setValueAtTime(f*1.6,tw);mg.gain.exponentialRampToValueAtTime(f*.08,tw+.6);m.connect(mg);mg.connect(c.frequency);c.connect(q.g);
   var len=env(q.g.gain,tw,{v:v,a:.004,d:d||2.6});m.start(tw);c.start(tw);m.stop(tw+len+.05);c.stop(tw+len+.05)})},
 pad:function(w,d,ch,v,lp,lp1){ch.forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),det:(i%2?4:-4),d:d,v:v*.12,sus:1,a:Math.min(.8,d*.3),rel:Math.min(.9,d*.35),lp:lp||900,lp1:lp1,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.35});tone(w,{f:nt(n+12),d:d,v:v*.03,sus:1,a:Math.min(.8,d*.3),rel:Math.min(.9,d*.35),to:'d',rev:.4})})},
 pluck:function(w,n,v,p,lp){tone(w,{type:'square',f:nt(n),d:.18,v:v*.3,lp:lp||1600,lp1:280,lpt:.15,pan:p,to:'d',echo:.45,rev:.15});tone(w,{type:'triangle',f:nt(n),d:.24,v:v*.5,pan:p,to:'d',echo:.35})}
};
/* accordi in Fa maggiore */
var CH={F9:[-7,-3,0,4,7],AM7:[-3,0,4,7],DM9:[-10,-7,-3,0,4],BB7:[-2,2,5,9],CE:[-8,-5,0,4],DM:[-10,-7,-3,2],C:[-5,0,4,7],F:[-7,-3,0,5]};
var ROOT={F9:-19,AM7:-15,DM9:-22,BB7:-14,CE:-20,DM:-22,C:-12,F:-19};
var ARP=[0,2,1,3,2,4,3,1];

/* ---------- la musica: un solo tempo, 131 BPM, dall'inizio alla fine. Il film è montato sui battiti, mai il contrario ---------- */
function music(M,C0){var B=60/M.BPM;function C(b,f){C0(b*B,f)}
  function bar(b0,b1,fn){for(var b=b0;b<b1;b+=4)fn(b)}
  function beats(b0,b1,fn){for(var b=b0;b<b1;b++)fn(b)}
  var SW=B*.035;/* un filo di swing sui sedicesimi in levare */
  function hats(b0,b1,v,open){beats(b0,b1,function(b){[0,.25,.5,.75].forEach(function(s,i){C(b+s,function(w){I.hat(w+(i%2?SW:0),v*[.45,.3,1,.35][i],(i-1.5)*.15,open&&i===2&&b%2===1)})})})}
  function groove(b0,b1,o){o=o||{};beats(b0,b1,function(b){C(b,function(w){I.kick(w,o.k||.6)});if(o.clap!==false&&(b%2===1))C(b,function(w){I.clap(w,o.c||.2)})});hats(b0,b1,o.h||.08,o.open)}
  function bassline(b0,ch,pat,v){pat.forEach(function(s){C(b0+s[0],function(w){I.bass(w,ROOT[ch]+(s[2]||0),s[1]*B*.9,v)})})}
  var BL=[[0,.75],[.75,.25,12],[1.5,.5],[2,.75],[2.75,.25,12],[3.5,.5,7]];
  var BL16=[];for(var i=0;i<16;i++)BL16.push([i*.25,.2,(i%4===2?12:0)]);
  function stabs(b0,ch,v,lp){[.5,1.75,2.5,3.5].forEach(function(s){C(b0+s,function(w){I.stab(w,CH[ch],v,.2,lp)})})}
  function arp(b0,b1,ch,v,lp){for(var e=0;b0+e*.5<b1;e++)(function(e){var n=CH[ch][ARP[e%8]%CH[ch].length]+12;C(b0+e*.5,function(w){I.pluck(w,n,v*(e%2?.7:1),(e%2?.3:-.3),lp)})})(e)}
  /* 1 · apertura (battute 1-5): piano elettrico, arpeggio che si apre, un battito che sale */
  C(0,function(w){I.ep(w,CH.F9,.045,4.2)});C(8,function(w){I.ep(w,CH.DM9,.045,4.2)});C(16,function(w){I.ep(w,CH.BB7,.045,2.4)});
  C(0,function(w){I.pad(w,16*B,CH.F9.concat([12]),.4,500,1100)});C(16,function(w){I.pad(w,4*B,CH.BB7,.45,900,2400)});
  arp(4,8,'F9',.16,900);arp(8,16,'DM9',.2,1200);arp(16,19.5,'BB7',.24,1700);
  beats(12,19,function(b){C(b,function(w){I.soft(w,.18+(b-12)*.03)})});
  beats(16,19,function(b){C(b+.5,function(w){I.hat(w,.05)})});
  C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code (battute 6-7) */
  C(20,function(w){I.crash(w,.1);I.sub(w,.4)});
  groove(20,28,{});bassline(20,'F9',BL,.42);bassline(24,'AM7',BL,.42);stabs(20,'F9',.5);stabs(24,'AM7',.5);
  C(20,function(w){I.pad(w,8*B,CH.F9,.3,1200)});
  /* 3 · Runtime (battute 8-10): più scuro, basso a sedicesimi, niente stab */
  groove(29,38,{c:.12,h:.06});
  bassline(28,'DM',BL16,.32);bassline(32,'BB7',BL16,.32);bassline(36,'C',BL16.slice(0,8),.32);
  C(28,function(w){I.pad(w,4*B,CH.DM,.45,600,900)});C(32,function(w){I.pad(w,4*B,CH.BB7,.45,800,1400)});C(36,function(w){I.pad(w,4*B,CH.C,.45,1000,3000)});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){I.snare(w,.05+r*.02)})})(r);
  C(36,function(w){I.riser(w,4*B,.06)});
  /* 4 · le app (battute 11-16): luminoso, pieno */
  C(40,function(w){I.crash(w,.12);I.sub(w,.4)});
  var AP=['F9','CE','DM9','BB7','F9','CE'];
  groove(40,61,{open:true});
  AP.forEach(function(ch,i){var b=40+i*4;if(b>=60){bassline(b,ch,BL.slice(0,3),.42);stabs(b,ch,.45);return}bassline(b,ch,BL,.42);stabs(b,ch,.5);if(i>=2)arp(b,b+4,ch,.12,1500)});
  /* la pizzeria si apre: la batteria si toglie, resta l'attesa */
  C(61.5,function(w){I.pad(w,2.5*B,CH.C,.5,900,2600)});arp(61.5,64,'C',.18,1800);C(62,function(w){I.riser(w,2*B,.06)});
  /* 5 · Start service (battuta 17) e Service complete (battuta 18) */
  C(64,function(w){I.crash(w,.1);I.sub(w,.35)});
  groove(64,68,{h:.09});bassline(64,'BB7',BL,.44);stabs(64,'BB7',.5);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){I.snare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.14);I.sub(w,.45);I.stab(w,CH.F9,.9,.5,3000)});
  groove(68,72,{h:.09,open:true});bassline(68,'F9',BL,.44);stabs(68,'F9',.5);C(68,function(w){I.pad(w,4*B,CH.F9,.35,1500)});
  /* 6 · finale: niente batteria. Piano elettrico e pad, la frase, il logo */
  C(72,function(w){I.ep(w,CH.DM9,.05,3.6);I.pad(w,4*B,CH.DM9,.4,700);I.bass(w,-22,3*B,.2)});
  /* la frase: l'accordo resta e scende piano fino al silenzio, il filtro si chiude. Nessun suono nuovo sul logo finale */
  C(76,function(w){I.ep(w,CH.BB7.concat([12]),.045,6);var d=12*B;CH.BB7.forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),det:(i%2?4:-4),d:d,v:.045,peak:.12,lp:900,lp1:220,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.4})});tone(w,{f:nt(-14),d:d*.8,v:.12,peak:.1,to:'d'})})}

/* ---------- altre musiche nel codice: stessa struttura e stessi tempi della A, armonia, melodia e suoni diversi ---------- */
var J={
 bleep:function(w,n,v,p,d){tone(w,{type:'square',f:nt(n)*1.012,f1:nt(n),gl:.015,d:d||.09,v:v*.35,lp:2600,lp1:900,lpt:d||.09,pan:p,to:'d',echo:.25,rev:.1})},
 rim:function(w,v,p){noise(w,{f:1750,q:3,d:.02,v:v,pan:p||0,to:'m'});tone(w,{f:820,d:.018,v:v*.4,pan:p||0,to:'m'})},
 snap:function(w,v,p){noise(w,{f:2600,q:1.3,d:.035,v:v,pan:p||0,to:'m',rev:.28})},
 sbass:function(w,n,v,d){tone(w,{type:'sawtooth',f:nt(n),d:d||.16,v:v*.4,lp:1100,lp1:180,lpt:d||.16,lq:2,to:'d'});tone(w,{f:nt(n),d:(d||.16)+.04,v:v*.75,to:'d'})},
 acid:function(w,n,v,cut,d){tone(w,{type:'sawtooth',f:nt(n),d:d||.13,v:v,lp:cut,lp1:cut*.35,lpt:d||.13,lq:9,to:'d',echo:.2})},
 bell:function(w,n,v,p){tone(w,{f:nt(n),d:.9,v:v,pan:p,to:'d',rev:.35,echo:.2});tone(w,{f:nt(n)*3.01,d:.18,v:v*.2,pan:p,to:'d'})},
 clav:function(w,ch,v,p){ch.forEach(function(n){tone(w,{type:'square',f:nt(n),d:.075,v:v*.12,lp:2400,lp1:1100,lpt:.07,hp:500,pan:p,to:'d'})})},
 brass:function(w,ch,v,d){ch.forEach(function(n,i){[-8,8].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d||.3,v:v*.07,a:.02,lp:900,lp1:2600,lpt:.08,pan:(i%2?.3:-.3),to:'d',rev:.25})})})},
 blip:function(w,n,v,p){tone(w,{f:nt(n),d:.03,v:v,pan:p,to:'d'})}
};
function H(M,C0){var B=60/M.BPM;return {B:B,C:function(b,f){C0(b*B,f)},beats:function(b0,b1,fn){for(var b=b0;b<b1;b++)fn(b)}}}

/* B · meccanica e giocosa, Do maggiore. Bleep piccoli, basso staccato che salta, drum machine con rim e schiocchi, mai cassa in quattro */
function musicB(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={C:[0,4,7,11],EM:[4,7,11,14],F:[5,9,12,16],G:[7,11,14,16],AM:[-3,0,4,7],G7:[7,11,14,17]},RT={C:-24,EM:-20,F:-19,G:-17,AM:-15,G7:-17};
  function hook(b,ch,v,lp){var c=CH[ch];[[0,c[0]+12],[.75,c[1]+12],[1.5,c[2]+12],[2,c[1]+12],[2.75,c[3]+12],[3.5,c[2]+12]].forEach(function(x){C(b+x[0],function(w){J.bleep(w,x[1],v,(x[0]%1?.25:-.25))})})}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.5)});if(k===2)C(b+.5,function(w){I.kick(w,(o.k||.5)*.6)});
    if(k===1||k===3){C(b,function(w){J.rim(w,.1,-.2);J.snap(w,.09,.25)})}C(b+.5,function(w){I.hat(w,.05,.2)});if(o.sh)[.25,.75].forEach(function(s){C(b+s,function(w){I.shk(w,.03,-.3)})})})}
  function bass(b,ch,v){[[0,0],[.5,12],[1.5,0],[2,12],[2.75,0],[3.5,7]].forEach(function(x){C(b+x[0],function(w){J.sbass(w,RT[ch]+x[1],v)})})}
  /* apertura: un orologio che ticchetta e il motivo filtrato che si apre */
  beats(0,19,function(b){C(b,function(w){J.rim(w,b%4?.03:.05,.4)})});
  C(0,function(w){I.pad(w,8*B,CH.C,.3,600,1200)});C(8,function(w){I.pad(w,8*B,CH.AM,.3,700,1500)});
  [4,8,12,16].forEach(function(b,i){hook(b,['C','AM','F','G'][i],.08+i*.04,0)});
  beats(12,19,function(b){C(b,function(w){I.soft(w,.16+(b-12)*.03)})});C(16,function(w){I.riser(w,4*B,.06)});
  /* Brand, Systems, Code */
  C(20,function(w){I.crash(w,.08);I.sub(w,.35)});
  drums(20,28,{sh:1});[[20,'C'],[24,'EM']].forEach(function(x){bass(x[0],x[1],.42);hook(x[0],x[1],.2)});
  /* Matrix: la macchina si accende. Linea acida a sedicesimi che apre il filtro, poi un arpeggio da computer che corre */
  C(28,function(w){for(var s=0;s<6;s++)I.kick(w+s*B/4,.25+s*.05)});
  var SEQ=[0,12,0,7,0,10,12,3],RTS=[-15,-19,-17];
  for(var s=0;s<4*10;s++)(function(s){var b=29+s*.25,bar=Math.min(2,Math.floor((b-28)/4));if(b>=38.75)return;C(b,function(w){J.acid(w,RTS[bar]+SEQ[s%8],.075,350+2600*Math.pow((b-29)/10,1.6))})})(s);
  for(var a=0;a<16;a++)(function(a){C(35+a*.25,function(w){J.bleep(w,[9,12,16,19,21,24,28,31][a%8]+12,.06+a*.004,(a%2?.4:-.4),.06)})})(a);
  beats(29,38,function(b){if(b%2===1)C(b,function(w){I.kick(w,.45)});C(b+.5,function(w){I.hat(w,.06,.3)});C(b+.75,function(w){I.hat(w,.03,-.3)});if(b%2===0)C(b,function(w){J.rim(w,.08)})});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){I.snare(w,.04+r*.02)})})(r);
  /* le app */
  C(40,function(w){I.crash(w,.1);I.sub(w,.35)});
  drums(40,61,{sh:1});['C','EM','F','G','C','EM'].forEach(function(ch,i){var b=40+i*4;if(b>=60){bass(b,ch,.4);return}bass(b,ch,.42);hook(b,ch,.2)});
  C(61.5,function(w){I.pad(w,2.5*B,CH.G7,.4,900,2600)});[61.5,62,62.5,63,63.5].forEach(function(b,i){C(b,function(w){J.bleep(w,[19,23,26,29,31][i],.12,(i%2?.3:-.3))})});
  /* Start service e Service complete */
  C(64,function(w){I.crash(w,.08);I.sub(w,.3)});drums(64,68,{sh:1});bass(64,'G7',.44);hook(64,'G7',.2);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){I.snare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.12);I.sub(w,.4);I.stab(w,CH.C.concat([12,16]),.8,.45,3000)});drums(68,72,{sh:1});bass(68,'C',.44);hook(68,'C',.22);
  /* finale */
  C(72,function(w){I.ep(w,[-15,-8,-5,0,4],.045,3.6);I.bass(w,-15,3*B,.16)});
  C(76,function(w){I.ep(w,[-7,-3,0,4,9],.045,6);var d=12*B;[-7,-3,0,4].forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),d:d,v:.04,peak:.12,lp:900,lp1:220,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.4})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'})})}

/* C · piano elettrico, Re maggiore. Accordi caldi sincopati, campanelli, schiocchi di dita, basso rotondo: da video prodotto */
function musicC(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={D:[-10,-3,1,4,6],BM:[-13,-6,-3,2,6],G:[-5,2,6,11],A:[-3,1,4,6],EM:[-8,-1,2,7],GM:[-5,-2,2,7]},RT={D:-22,BM:-25,G:-17,A:-15,EM:-20,GM:-17};
  function keys(b,ch,v){[[0,.5],[.75,.3],[1.5,.4],[2.5,.4],[3.25,.3]].forEach(function(x){C(b+x[0],function(w){I.ep(w,CH[ch],v*(x[1]/.5),.45)})})}
  function bells(b,ch,v){var c=CH[ch],n=c.length;[[.5,c[3%n]+12],[1.5,c[(n-1)]+12],[2.75,c[2]+12],[3.5,c[3%n]+12]].forEach(function(x,i){C(b+x[0],function(w){J.bell(w,x[1],v,(i%2?.3:-.3))})})}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;if(k===0)C(b,function(w){I.kick(w,.5)});if(k===1)C(b+.5,function(w){I.kick(w,.3)});if(k===2)C(b+.5,function(w){I.kick(w,.45)});
    if(k===1||k===3)C(b,function(w){J.snap(w,.12,(k===1?-.2:.2));I.clap(w,.08)});[.25,.5,.75].forEach(function(s,i){C(b+s,function(w){I.shk(w,i===1?.04:.025,(i-1)*.3)})});if(k===3)C(b+.75,function(w){J.rim(w,.06,.3)})})}
  function bass(b,ch,v){v*=.55;[[0,1.4],[1.5,.4],[2,1.4],[3.5,.4]].forEach(function(x,i){C(b+x[0],function(w){I.bass(w,RT[ch]+(i===3?7:0),x[1]*B,v)})})}
  /* apertura: accordi che respirano e campanelli */
  C(0,function(w){I.ep(w,CH.D,.035,4)});C(8,function(w){I.ep(w,CH.BM,.035,4)});C(16,function(w){I.ep(w,CH.G,.035,2.4)});
  C(0,function(w){I.pad(w,16*B,CH.D,.25,500,1000)});bells(4,'D',.025);bells(8,'BM',.03);bells(12,'BM',.035);bells(16,'G',.04);
  beats(12,19,function(b){C(b,function(w){I.soft(w,.15+(b-12)*.03)})});beats(16,19,function(b){C(b+.5,function(w){I.shk(w,.03)})});C(16,function(w){I.riser(w,4*B,.06)});
  /* Brand, Systems, Code */
  C(20,function(w){I.crash(w,.08);I.sub(w,.3)});drums(20,28);[[20,'D'],[24,'BM']].forEach(function(x){keys(x[0],x[1],.05);bass(x[0],x[1],.4);bells(x[0],x[1],.03)});
  /* Matrix: sequenza di basso a sedicesimi col filtro che sale, e una pioggia di dati in alto */
  C(28,function(w){for(var s=0;s<4;s++)J.snap(w+s*B/4,.06+s*.02)});
  var SQ=[0,0,12,0,7,0,10,12],RS=[-13,-17,-15];
  for(var s=0;s<40;s++)(function(s){var b=29+s*.25,bar=Math.min(2,Math.floor((b-28)/4));if(b>=38.75)return;C(b,function(w){J.acid(w,RS[bar]+SQ[s%8],.06,300+1800*Math.pow((b-29)/10,1.4),.12)})})(s);
  for(var d=0;d<48;d++)(function(d){if(h2(d)<.45)return;var b=30+d*.1875;if(b>=38.5)return;C(b,function(w){J.blip(w,[26,29,31,33,36,38][Math.floor(h2(d+7)*6)]+12,.03,(h2(d+3)-.5)*1.4)})})(d);
  beats(29,38,function(b){if(b%2===0)C(b,function(w){I.kick(w,.45)});if(b%2===1)C(b,function(w){J.snap(w,.1)});[.25,.5,.75].forEach(function(x){C(b+x,function(w){I.shk(w,.025)})})});
  C(36,function(w){I.riser(w,4*B,.06)});
  /* le app */
  C(40,function(w){I.crash(w,.1);I.sub(w,.3)});drums(40,61);
  ['D','BM','G','A','D','BM'].forEach(function(ch,i){var b=40+i*4;bass(b,ch,.4);if(b>=60)return;keys(b,ch,.055);if(i%2===0)bells(b,ch,.03)});
  C(61.5,function(w){I.ep(w,CH.A,.05,2.4);I.pad(w,2.5*B,CH.A,.4,900,2200)});bells(61,'A',.04);
  /* Start service e Service complete */
  C(64,function(w){I.crash(w,.08)});drums(64,68);keys(64,'EM',.055);bass(64,'EM',.42);C(66,function(w){keys(66,'A',.05)});
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){J.snap(w,.04+r2*.02)})})(r2);
  C(68,function(w){I.crash(w,.12);I.sub(w,.35);I.ep(w,CH.D.concat([13]),.07,2)});drums(68,72);keys(68,'D',.06);bass(68,'D',.42);bells(68,'D',.035);
  /* finale */
  C(72,function(w){I.ep(w,CH.BM,.045,3.6);I.bass(w,-25,3*B,.15)});
  C(76,function(w){I.ep(w,CH.G.concat([14]),.045,6);var d2=12*B;CH.G.forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),d:d2,v:.04,peak:.12,lp:900,lp1:220,lpt:d2,pan:(i%2?.35:-.35),to:'d',rev:.4})});tone(w,{f:nt(-17),d:d2*.8,v:.1,peak:.1,to:'d'})})}
function h2(n){n=Math.sin(n*91.7+13.1)*43758.5453;return n-Math.floor(n)}

/* D · funky, Sol dorico. Basso sincopato, clavinet, fiati corti, battito in levare */
function musicD(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={GM:[-2,2,5,9],C9:[4,7,10,14],EB:[-9,-2,2,7],F:[-7,0,5,9],BB:[-2,2,5,9,14]};
  function bassV(b,root,v){[[0,0],[.75,0],[1,12],[1.5,0],[2.25,3],[2.5,5],[3,0],[3.5,7]].forEach(function(x){C(b+x[0],function(w){J.sbass(w,root+x[1],v,.14)})})}
  function clavV(b,ch,v){[.25,.75,1.25,1.75,2.25,2.75,3.5].forEach(function(s,i){C(b+s,function(w){J.clav(w,CH[ch],v*(i===3?1.4:1),(i%2?.3:-.3))})})}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;if(k===0)C(b,function(w){I.kick(w,.55)});if(k===0)C(b+.75,function(w){I.kick(w,.35)});if(k===2)C(b+.5,function(w){I.kick(w,.45)});
    if(k===1||k===3)C(b,function(w){I.clap(w,.18)});[0,.25,.5,.75].forEach(function(s,i){C(b+s,function(w){I.hat(w,[.04,.025,.07,.025][i],(i-1.5)*.2,k===3&&i===2)})})})}
  /* apertura: clavinet filtrato e tic, il basso entra quando il colore allaga */
  beats(0,19,function(b){C(b+.5,function(w){J.rim(w,.035,.3)})});C(0,function(w){I.pad(w,16*B,CH.GM,.3,500,1100)});
  [4,8,12,16].forEach(function(b,i){clavV(b,i%2?'C9':'GM',.25+i*.12)});
  [12,16].forEach(function(b){bassV(b,b===12?-17:-24,.25)});C(16,function(w){I.riser(w,4*B,.06)});
  /* Brand, Systems, Code */
  C(20,function(w){I.crash(w,.08);I.sub(w,.35);J.brass(w,CH.GM,.9,.25)});drums(20,28);bassV(20,-17,.42);bassV(24,-24,.42);clavV(20,'GM',.8);clavV(24,'C9',.8);C(27.5,function(w){J.brass(w,CH.C9,.8,.2)});
  /* Matrix: linea acida in Sol minore che sale e si apre, sopra il glitch */
  C(28,function(w){for(var s=0;s<6;s++)J.rim(w+s*B/4,.05+s*.02)});
  var SQ=[0,12,0,10,0,7,3,12,0,0,12,5,0,10,7,3];
  for(var s=0;s<40;s++)(function(s){var b=29+s*.25;if(b>=38.75)return;var bar=Math.floor((b-29)/4);C(b,function(w){J.acid(w,-17+[0,-2,3][Math.min(2,bar)]+SQ[s%16],.09,300+3200*Math.pow((b-29)/10,1.7),.12)})})(s);
  beats(29,38,function(b){C(b,function(w){I.kick(w,b%2?.35:.5)});C(b+.5,function(w){I.hat(w,.06,.2)});if(b%2===1)C(b,function(w){I.clap(w,.1)})});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){I.snare(w,.04+r*.02)})})(r);
  /* le app */
  C(40,function(w){I.crash(w,.1);I.sub(w,.35);J.brass(w,CH.GM,1,.3)});drums(40,61);
  for(var i=0;i<6;i++)(function(i){var b=40+i*4,c=i%2?'C9':'GM',root=i%2?-24:-17;bassV(b,root,.42);if(b>=60)return;clavV(b,c,.8);if(i%2===1)C(b+3.5,function(w){J.brass(w,CH[c],.8,.2)})})(i);
  C(61.5,function(w){I.pad(w,2.5*B,CH.F,.4,900,2400)});clavV(60.5,'F',.6);
  /* Start service e Service complete */
  C(64,function(w){I.crash(w,.08);J.brass(w,CH.EB,.8,.25)});drums(64,68);bassV(64,-21,.44);clavV(64,'EB',.8);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){I.snare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.12);I.sub(w,.4);J.brass(w,CH.GM.concat([12]),1.2,.5)});drums(68,72);bassV(68,-17,.44);clavV(68,'GM',.8);
  /* finale */
  C(72,function(w){I.ep(w,[-9,-2,2,7,10],.045,3.6);I.bass(w,-21,3*B,.15)});
  C(76,function(w){I.ep(w,CH.BB,.045,6);var d=12*B;CH.BB.forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),d:d,v:.04,peak:.12,lp:900,lp1:220,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.4})});tone(w,{f:nt(-14),d:d*.8,v:.1,peak:.1,to:'d'})})}
var MUS={a:music,b:musicB,c:musicC,d:musicD},STYLE='j',SG={a:1,b:1.7,c:1,d:1.65};

/* E · un tema solo, Fa lidio. Il tema si presenta piano, esplode sulla Aa, passa nel Matrix come arpeggio filtrato,
   torna pieno sulle app, arriva al massimo su Service complete e chiude lento sul logo. Basso a impulsi, drum machine con swing */
var JE={
 pluck:function(w,n,v,p,lp){[-7,7].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:.26,v:v*.16,lp:lp||4200,lp1:650,lpt:.2,lq:1.2,pan:p+(dt>0?.15:-.15),to:'d',echo:.42,rev:.18})});
   tone(w,{type:'square',f:nt(n-12),d:.14,v:v*.08,lp:1400,lp1:400,lpt:.12,pan:p,to:'d'});tone(w,{f:nt(n+12),d:.12,v:v*.12,pan:p,to:'d',rev:.25})},
 glass:function(w,n,v,p){tone(w,{f:nt(n),d:1.4,v:v,pan:p,to:'m',rev:.45,echo:.25});tone(w,{f:nt(n)*2.001,d:.5,v:v*.25,pan:p,to:'m'});tone(w,{type:'triangle',f:nt(n),d:.05,v:v*.3,pan:p,to:'m'})},
 pulse:function(w,n,v,d){tone(w,{f:nt(n),d:d,v:v*.5,sus:1,a:.004,rel:.03,to:'d'});[-6,6].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:v*.17,sus:1,a:.004,rel:.03,lp:650,lp1:260,lpt:d,lq:1.4,to:'d'})})}
};
function musicE(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B,SW=B*.04;
  var CH={F:[-7,-3,0,4,7],GF:[-5,-1,2,7],AM:[-3,0,4,7],G:[-5,-1,2,9],DM:[-10,-7,-3,0,4],BB:[-2,2,5,9],C:[-5,0,4,7]};
  var RT={F:-19,GF:-19,AM:-15,G:-17,DM:-22,BB:-14,C:-12};
  /* il tema: stesso ritmo ogni battuta, le note seguono l'accordo */
  var RH=[0,.75,1.5,2,3],TH={F:[17,16,12,19,17],GF:[19,14,11,14,19],AM:[16,12,9,16,19],G:[19,14,11,21,19],DM:[17,14,9,16,12],BB:[17,14,10,21,17],C:[16,12,7,19,16]};
  function theme(b,ch,v,lp,octUp){TH[ch].forEach(function(n,i){C(b+RH[i],function(w){JE.pluck(w,n+(octUp||0),v,(i%2?.25:-.25),lp)})})}
  function themeGlass(b,ch,v){TH[ch].forEach(function(n,i){C(b+RH[i],function(w){JE.glass(w,n+12,v,(i%2?.3:-.3))})})}
  function bassP(b,ch,v,end){for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(end&&t>=end)return;C(t,function(w){JE.pulse(w,RT[ch]+(e===7?12:0),v*(e%2?.75:1),B*.42)})})(e)}
  function hats(b0,b1,v){beats(b0,b1,function(b){[0,.25,.5,.75].forEach(function(s,i){C(b+s,function(w){I.hat(w+(i%2?SW:0),v*[.5,.28,1,.32][i],(i-1.5)*.15,b%4===3&&i===2)})})})}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.58)});if(k===1)C(b+.5,function(w){I.kick(w,(o.k||.58)*.55)});
    if(k===1||k===3)C(b,function(w){I.clap(w,o.c||.19);J.snap(w,.05,.2)});if(k===3)C(b+.75,function(w){J.rim(w,.05,-.3)})});hats(b0,b1,o.h||.075)}
  function pad(b,ch,beatsN,v,lp,lp1){C(b,function(w){I.pad(w,beatsN*B+.05,CH[ch],v,lp,lp1)})}
  /* 1 · apertura: il tema si presenta piano, sul vetro; un orologio sottile; il basso entra quando il colore allaga */
  pad(0,'F',8,.35,500,900);pad(8,'GF',8,.35,700,1300);pad(16,'F',4,.4,900,2200);
  themeGlass(0,'F',.02);themeGlass(8,'GF',.025);
  beats(2,19,function(b){C(b+.5,function(w){J.rim(w,.025,.35)})});
  bassP(12,'F',.2);bassP(16,'GF',.26,19.5);beats(12,19,function(b){C(b,function(w){I.soft(w,.16+(b-12)*.025)})});
  theme(16,'GF',.12,1600);C(16,function(w){I.riser(w,4*B,.06)});
  /* 2 · Brand, Systems, Code: il tema esplode */
  C(20,function(w){I.crash(w,.09);I.sub(w,.35)});
  drums(20,28);bassP(20,'F',.4);bassP(24,'GF',.4);theme(20,'F',.26);theme(24,'GF',.26);pad(20,'F',4,.25,1400);pad(24,'GF',4,.25,1400);
  /* 3 · Matrix: stesso tema, suonato dalla macchina. Arpeggio filtrato che si apre battuta dopo battuta, il basso e la batteria non si fermano */
  C(28,function(w){I.sub(w,.25)});
  var MX=[['DM',28],['BB',32],['C',36]];
  MX.forEach(function(x,bi){var ch=x[0],b=x[1];bassP(b,ch,.36,b===36?38:0);pad(b,ch,4,.3,500+bi*300,900+bi*700);
    var tn=TH[ch];for(var s=0;s<16;s++)(function(s){var t=b+s*.25;if(t>=39.5)return;var n=tn[[0,2,1,3,4,2,1,0][s%8]]+(s%4===3?12:0);
      C(t,function(w){J.acid(w,n-12,.05+bi*.012,500+2600*Math.pow((t-28)/11.5,1.5),.11)})})(s);
    theme(b,ch,.1+bi*.04,900+bi*900)});
  drums(28,38,{k:.52,c:.13,h:.06});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){I.snare(w,.04+r*.02)})})(r);C(36,function(w){I.riser(w,4*B,.06)});
  /* 4 · le app: tema pieno, il secondo giro un'ottava sopra */
  C(40,function(w){I.crash(w,.1);I.sub(w,.38)});
  var AP=['F','GF','AM','G','F','GF'];drums(40,61);
  AP.forEach(function(ch,i){var b=40+i*4;bassP(b,ch,.4,61.5);pad(b,ch,4,.24,1500);if(b<60)theme(b,ch,.24,4200,i>=4?12:0)});
  /* la pizzeria si apre: resta il tema sul vetro, in attesa */
  pad(61.5,'G',2.5,.42,900,2400);themeGlass(61.5,'G',.03);C(62,function(w){I.riser(w,2*B,.06)});
  /* 5 · Start service e Service complete: il massimo */
  C(64,function(w){I.crash(w,.08);I.sub(w,.32)});drums(64,68);bassP(64,'BB',.42);theme(64,'BB',.26);pad(64,'BB',2,.25,1600);pad(66,'C',2,.25,2000);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){I.snare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.14);I.sub(w,.42);I.stab(w,CH.F.concat([12,16]),.75,.5,3200)});
  drums(68,72);bassP(68,'F',.42);theme(68,'F',.28,4500,12);pad(68,'F',4,.3,1800);
  /* 6 · finale: il tema lento, morbido, sul logo */
  C(72,function(w){I.ep(w,CH.DM,.045,3.6);I.bass(w,-22,3*B,.15)});
  [0,1,2,3,4].forEach(function(i){C(76+RH[i]*1.5,function(w){JE.glass(w,TH.F[i]+12,.028,(i%2?.25:-.25))})});
  C(76,function(w){var d=12*B;CH.F.forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),d:d,v:.04,peak:.12,lp:900,lp1:220,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.4})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'})})}
MUS.e=musicE;SG.e=1;
/* F · synthwave e French touch, La minore (La min, Fa, Do, Sol: gli accordi "eroici", non tristi).
   Lead supersaw saturato con un'ottava sotto e un filo di glide, basso che rotola in ottavi saltando d'ottava, arpeggio a sedicesimi,
   cassa secca e rullante grande col riverbero tagliato di netto, campane FM metalliche. Il tema c'è dall'inizio alla fine */
var JF={
 lead:function(w,n,d,v,prev,p){var f=nt(n),f0=prev!=null?nt(prev):f;
   [-16,-9,-3,3,9,16].forEach(function(dt,i){tone(w,{type:'sawtooth',f:f0,f1:f,gl:.04,det:dt,d:d,v:v*.075,sus:1,a:.006,rel:.06,lp:3800,lp1:1700,lpt:Math.min(d,.35),pan:(p||0)+(i-2.5)*.12,to:'x',echo:.22,rev:.2})});
   tone(w,{type:'square',f:f0/2,f1:f/2,gl:.04,d:d,v:v*.09,sus:1,a:.006,rel:.06,lp:1600,pan:p||0,to:'x'})},
 bass:function(w,n,v,d){tone(w,{type:'sawtooth',f:nt(n),d:d,v:v*.3,sus:1,a:.004,rel:.03,lp:1300,lp1:260,lpt:d*.8,lq:3,to:'x'});tone(w,{type:'square',f:nt(n),d:d,v:v*.12,sus:1,a:.004,rel:.03,lp:700,to:'x'});tone(w,{f:nt(n<-20?n:n-12),d:d,v:v*.55,sus:1,a:.004,rel:.03,to:'d'})},
 arp:function(w,n,v,cut,p){tone(w,{type:'sawtooth',f:nt(n),d:.11,v:v,lp:cut,lp1:cut*.3,lpt:.1,lq:4,pan:p,to:'d',echo:.35});tone(w,{type:'square',f:nt(n),d:.07,v:v*.4,lp:cut*.8,pan:-p,to:'d'})},
 strings:function(w,d,ch,v,lp){ch.forEach(function(n,i){[-11,0,11].forEach(function(dt,j){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:v*.05,sus:1,a:Math.min(.35,d*.25),rel:Math.min(.5,d*.3),lp:lp||1800,pan:(j-1)*.45,to:'d',rev:.35})})})},
 gsnare:function(w,v){noise(w,{f:1900,q:.6,d:.2,v:v,to:'m'});tone(w,{f:190,f1:150,gl:.05,d:.12,v:v*.6,to:'m'});
   /* il riverbero tagliato: una coda di rumore piena che si chiude di colpo */
   var s=AC.createBufferSource();s.buffer=NB;var f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=2200;f.Q.value=.5;var q=out({to:'m',pan:0});
   q.g.gain.setValueAtTime(0,w);q.g.gain.linearRampToValueAtTime(v*.55,w+.01);q.g.gain.linearRampToValueAtTime(v*.42,w+.2);q.g.gain.linearRampToValueAtTime(0,w+.23);s.connect(f);f.connect(q.g);s.start(w,h(w*3.3));s.stop(w+.3)},
 tom:function(w,n,v){tone(w,{f:nt(n),f1:nt(n)*.6,gl:.18,d:.28,v:v,to:'m',rev:.25})},
 fm:function(w,n,v,p,d){var f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:p||0,to:'d',rev:.4,echo:.3});
   c.frequency.value=f;m.frequency.value=f*3.5;mg.gain.setValueAtTime(f*4,w);mg.gain.exponentialRampToValueAtTime(f*.2,w+(d||1.2));m.connect(mg);mg.connect(c.frequency);c.connect(q.g);
   var len=env(q.g.gain,w,{v:v,a:.002,d:d||1.2});m.start(w);c.start(w);m.stop(w+len+.05);c.stop(w+len+.05)}
};
function musicF(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={AM:[-3,0,4,9],F:[-7,-3,0,5],C:[-5,0,4,7],G:[-5,-1,2,7],DM:[-10,-7,-3,2],E:[-8,-4,-1,4]};
  var RT={AM:-27,F:-31,C:-24,G:-29,DM:-22,E:-20};/* note di basso, il basso salta d'ottava */
  /* il gancio: frase A (domanda) e frase B (risposta), ritmo puntato riconoscibile. [battito, nota, durata] */
  var PA=[[[0,16,.7],[.75,21,.7],[1.5,19,.45],[2,16,.95],[3,14,.45],[3.5,16,.45]],[[0,12,.7],[.75,9,.7],[1.5,12,.45],[2,14,1.8]]];
  var PB=[[[0,16,.7],[.75,21,.7],[1.5,19,.45],[2,16,.95],[3,19,.45],[3.5,21,.45]],[[0,23,.7],[.75,21,.7],[1.5,19,.45],[2,14,1.8]]];
  var last=null;
  function phrase(b,ph,v,oct){ph.forEach(function(bar,bi){bar.forEach(function(x){var n=x[1]+(oct||0),pv=last;last=n;C(b+bi*4+x[0],function(w){JF.lead(w,n,x[2]*B,v,pv,0)})})})}
  function bass(b,ch,v,until){for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(until&&t>=until)return;C(t,function(w){JF.bass(w,RT[ch]+(e%2?12:0),v,B*.45)})})(e)}
  function arp(b,ch,v,c0,c1,rate,until){var c=CH[ch],seq=[0,1,2,3,2,1,2,3].map(function(k){return c[k]+12}),n=Math.round(4/rate);for(var i=0;i<n;i++)(function(i){var t=b+i*rate;if(until&&t>=until)return;
    C(t,function(w){JF.arp(w,seq[i%8]+(i%8===3?12:0),v,c0+(c1-c0)*(i/n),(i%2?.3:-.3))})})(i)}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.62)});if(k===2&&o.push)C(b+.75,function(w){I.kick(w,.35)});
    if(k===1||k===3)C(b,function(w){JF.gsnare(w,o.s||.16);I.clap(w,.08)});
    C(b+.5,function(w){I.hat(w,.085,.2,k===3)});if(o.h16)[.25,.75].forEach(function(s){C(b+s,function(w){I.hat(w,.03,-.25)})})})}
  function pad(b,ch,n,v,lp){C(b,function(w){JF.strings(w,n*B+.05,CH[ch],v,lp)})}
  /* 1 · apertura: arpeggio che si apre, archi, la cassa entra quando il colore allaga, tom e silenzio prima della Aa */
  [['AM',0],['F',4],['C',8],['G',12],['AM',16]].forEach(function(x,i){arp(x[1],x[0],.035+i*.01,450+i*250,700+i*350,.25,19.5);pad(x[1],x[0],4,.5,700+i*200)});
  C(4,function(w){JF.fm(w,16,.03,-.3,1.6)});C(6,function(w){JF.fm(w,21,.025,.3,1.6)});C(12,function(w){JF.fm(w,19,.03,-.2,1.6)});
  beats(12,19,function(b){C(b,function(w){I.kick(w,.22+(b-12)*.04)})});
  [18,18.5,19,19.25].forEach(function(b,i){C(b,function(w){JF.tom(w,[-5,-8,-12,-15][i],.25)})});C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code: entra tutto, il gancio fa la domanda */
  C(20,function(w){I.crash(w,.1);I.sub(w,.4);JF.fm(w,21,.04,0,2)});
  drums(20,28,{});bass(20,'AM',.44);bass(24,'F',.44);pad(20,'AM',4,.4);pad(24,'F',4,.4);arp(20,'AM',.03,1800,1800,.25);arp(24,'F',.03,1800,1800,.25);
  phrase(20,PA,.2);
  /* 3 · Matrix: stessa canzone, la macchina prende il comando. Il basso continua, l'arpeggio raddoppia di velocità e il filtro sale,
     le campane metalliche ripetono le prime note del gancio */
  C(28,function(w){I.sub(w,.3)});
  [['AM',28],['F',32],['G',36]].forEach(function(x,i){bass(x[1],x[0],.4,x[1]===36?38:0);pad(x[1],x[0],4,.35,900+i*400);arp(x[1],x[0],.04,600+i*900,1400+i*1100,.125,38.75);
    [0,.75,1.5].forEach(function(s,j){C(x[1]+s,function(w){JF.fm(w,[16,21,19][j]+12,.03,(j-1)*.4,.7)})});C(x[1]+2.5,function(w){JF.fm(w,[16,12,14][i]+12,.025,.2,.9)})});
  drums(28,38,{h16:1,push:1});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){JF.gsnare(w,.05+r*.02)})})(r);[39,39.25,39.5].forEach(function(b,i){C(b,function(w){JF.tom(w,[-8,-12,-15][i],.3)})});
  /* 4 · le app: il gancio intero, domanda e risposta */
  C(40,function(w){I.crash(w,.12);I.sub(w,.42)});
  var AP=['AM','F','C','G','AM','F'];drums(40,61,{h16:1});
  AP.forEach(function(ch,i){var b=40+i*4;bass(b,ch,.44,61.5);pad(b,ch,4,.4);arp(b,ch,.028,2000,2000,.25,61.5)});
  last=null;phrase(40,PA,.22);phrase(48,PB,.22);phrase(56,[PA[0]],.22,12);
  /* la pizzeria si apre: la batteria si toglie, resta l'arpeggio sugli archi, tom verso Start service */
  pad(61.5,'G',2.5,.55,1600);arp(61.5,'G',.04,900,2600,.125,64);[63,63.25,63.5,63.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-3,-7,-10,-14][i],.28)})});
  /* 5 · Start service: il gancio sale; Service complete: il massimo, su Do maggiore */
  C(64,function(w){I.crash(w,.1);I.sub(w,.35)});drums(64,68,{h16:1});bass(64,'F',.46,66);bass(66,'G',.46);pad(64,'F',2,.4);pad(66,'G',2,.4);
  last=null;[[64,21,.45],[64.5,23,.45],[65,24,.95],[66,23,.45],[66.5,24,.45],[67,26,.9]].forEach(function(x){var pv=last;last=x[1];C(x[0],function(w){JF.lead(w,x[1],x[2]*B,.22,pv,0)})});
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){JF.gsnare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.16);I.sub(w,.45);I.stab(w,CH.C.concat([12,16]),.9,.5,3400);JF.fm(w,28,.05,0,2.5)});
  drums(68,72,{h16:1,push:1});bass(68,'C',.46);pad(68,'C',4,.45);arp(68,'C',.03,2200,2200,.25);
  [[68,28,1.4],[69.5,26,.45],[70,24,.95],[71,23,.45],[71.5,21,.45]].forEach(function(x){var pv=last;last=x[1];C(x[0],function(w){JF.lead(w,x[1],x[2]*B,.22,pv,0)})});
  /* 6 · finale: la batteria si ferma, gli archi restano, le campane rifanno il gancio piano sul logo */
  C(72,function(w){JF.strings(w,4*B,CH.AM,.45,1200);I.bass(w,-27+12,3*B,.15)});
  [[72,16],[72.75,21],[73.5,19],[74,16]].forEach(function(x,i){C(x[0],function(w){JF.fm(w,x[1]+12,.03,(i%2?.3:-.3),1.6)})});
  C(76,function(w){var d=12*B;CH.F.forEach(function(n,i){[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:.022,peak:.12,lp:1100,lp1:200,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.45})})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'});JF.fm(w,24,.03,0,3)})}
MUS.f=musicF;SG.f=1;
/* G · synthwave più tech, La minore (La min, Sol, Fa, Sol: il giro che spinge). Niente campane. Lead più scuro e ruvido che suona un riff
   a sedicesimi col ritmo sempre uguale. Matrix marcato ma dentro la canzone: batteria a metà tempo, basso acido, arpeggio a trentaduesimi, pad a scatti */
var JG={
 lead:function(w,n,d,v,prev,lp){var f=nt(n),f0=prev!=null?nt(prev):f;
   [-12,-4,4,12].forEach(function(dt,i){tone(w,{type:'sawtooth',f:f0,f1:f,gl:.03,det:dt,d:d,v:v*.09,sus:1,a:.004,rel:.04,lp:lp||2600,lp1:(lp||2600)*.45,lpt:Math.min(d,.18),lq:3,pan:(i-1.5)*.18,to:'x',echo:.18,rev:.12})});
   tone(w,{type:'square',f:f0,f1:f,gl:.03,d:d,v:v*.07,sus:1,a:.004,rel:.04,lp:(lp||2600)*.8,to:'x'});tone(w,{type:'square',f:f0/2,f1:f/2,gl:.03,d:d,v:v*.08,sus:1,a:.004,rel:.04,lp:900,to:'x'})},
 chop:function(w,ch,v,lp,p){ch.forEach(function(n,i){tone(w,{type:'sawtooth',f:nt(n),det:(i%2?7:-7),d:.09,v:v*.06,lp:lp,pan:p,to:'d'})})}
};
function musicG(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={AM:[-3,0,4,9],G:[-5,-1,2,7],F:[-7,-3,0,5],E:[-8,-4,-1,4],DM:[-10,-7,-3,2]};
  var RT={AM:-27,G:-29,F:-31,E:-32,DM:-22};
  /* il riff: stesso ritmo in ogni battuta, le note cambiano con l'accordo */
  var RC=[[0,.45],[.75,.22],[1,.45],[1.75,.22],[2,.45],[2.75,.22],[3,.7]];
  var RF={AM:[9,12,16,14,12,9,16],G:[14,11,14,16,19,14,11],F:[9,12,17,16,12,9,17],G2:[19,17,16,14,11,14,11]};
  var last=null;
  function riff(b,key,v,lp,oct){RF[key].forEach(function(n,i){n+=(oct||0);var pv=last;last=n;C(b+RC[i][0],function(w){JG.lead(w,n,RC[i][1]*B,v,pv,lp)})})}
  function bass(b,ch,v,until){for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(until&&t>=until)return;C(t,function(w){JF.bass(w,RT[ch]+(e%2?12:0),v,B*.45)})})(e)}
  function acidB(b,ch,v,c0,c1,until){var sq=[0,12,0,0,12,0,7,12,0,12,0,0,10,0,12,7];for(var s=0;s<16;s++)(function(s){var t=b+s*.25;if(until&&t>=until)return;C(t,function(w){J.acid(w,RT[ch]+12+sq[s],v,c0+(c1-c0)*s/16,.11)})})(s)}
  function arp(b,ch,v,c0,c1,rate,until){var c=CH[ch],seq=[0,1,2,3,2,1,2,3].map(function(k){return c[k]+12}),n=Math.round(4/rate);for(var i=0;i<n;i++)(function(i){var t=b+i*rate;if(until&&t>=until)return;
    C(t,function(w){JF.arp(w,seq[i%8]+(i%8===3?12:0),v,c0+(c1-c0)*(i/n),(i%2?.3:-.3))})})(i)}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;
    if(o.half){if(k===0)C(b,function(w){I.kick(w,.66)});if(k===1)C(b+.75,function(w){I.kick(w,.38)});if(k===2)C(b,function(w){JF.gsnare(w,.2);I.clap(w,.1)})}
    else{if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.62)});if(k===2)C(b+.75,function(w){I.kick(w,.32)});if(k===1||k===3)C(b,function(w){JF.gsnare(w,o.s||.16);I.clap(w,.08)})}
    C(b+.5,function(w){I.hat(w,.08,.2,!o.half&&k===3)});[.25,.75].forEach(function(s){C(b+s,function(w){I.hat(w,o.half?.05:.028,-.25)})})})}
  function pad(b,ch,n,v,lp){C(b,function(w){JF.strings(w,n*B+.05,CH[ch],v,lp)})}
  /* 1 · apertura: archi scuri, arpeggio filtrato, il riff si sente lontano e si avvicina; la cassa entra col colore */
  [['AM',0],['G',4],['F',8],['G',12],['AM',16]].forEach(function(x,i){pad(x[1],x[0],4,.45,600+i*150);arp(x[1],x[0],.028+i*.006,400+i*180,600+i*260,.25,19.5)});
  last=null;riff(12,'F',.1,900);riff(16,'AM',.14,1400);
  beats(12,19,function(b){C(b,function(w){I.kick(w,.22+(b-12)*.04)})});
  [18.5,18.75,19,19.25].forEach(function(b,i){C(b,function(w){JF.tom(w,[-8,-10,-13,-15][i],.25)})});C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code */
  C(20,function(w){I.crash(w,.1);I.sub(w,.42)});
  drums(20,28);bass(20,'AM',.44);bass(24,'G',.44);pad(20,'AM',4,.35,1400);pad(24,'G',4,.35,1400);
  last=null;riff(20,'AM',.2);riff(24,'G',.2);
  /* 3 · Matrix: la macchina prende il comando */
  C(28,function(w){I.sub(w,.5);JF.gsnare(w,.22);I.crash(w,.08)});
  [['AM',28],['F',32],['E',36]].forEach(function(x,i){var b=x[1],ch=x[0];acidB(b,ch,.08,400+i*700,900+i*1300,38.75);arp(b,ch,.035,700+i*800,1300+i*1200,.125,38.75);
    for(var s=0;s<16;s++)(function(s){if(s%3===1)return;C(b+s*.25,function(w){JG.chop(w,CH[ch],.9,1200+i*600,(s%2?.3:-.3))})})(s);
    C(b,function(w){I.bass(w,RT[ch]+12,4.02*B,.2);JF.strings(w,4.4*B,CH[ch],.3,700+i*350)})});
  drums(28,38,{half:1});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){JF.gsnare(w,.05+r*.022)})})(r);[39,39.25,39.5,39.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-6,-9,-12,-15][i],.3)})});
  /* 4 · le app: il riff intero, quattro battute, poi riparte */
  C(40,function(w){I.crash(w,.12);I.sub(w,.45)});
  var AP=[['AM','AM'],['G','G'],['F','F'],['G','G2'],['AM','AM'],['G','G']];drums(40,61);
  last=null;AP.forEach(function(x,i){var b=40+i*4;bass(b,x[0],.44,61.5);pad(b,x[0],4,.35,1500);if(i>=2)arp(b,x[0],.022,1600,1600,.25,61.5);if(b<60)riff(b,x[1],.21,i>=4?3000:2600)});
  /* la pizzeria si apre: resta l'arpeggio sugli archi, tom verso Start service */
  pad(61.5,'G',2.5,.5,1500);arp(61.5,'G',.035,800,2400,.125,64);[63,63.25,63.5,63.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-5,-8,-11,-14][i],.28)})});
  /* 5 · Start service: il riff un'ottava sopra; Service complete: il massimo, su Fa, epico */
  C(64,function(w){I.crash(w,.1);I.sub(w,.38)});drums(64,68);bass(64,'F',.46,66);bass(66,'G',.46);pad(64,'F',2,.4);pad(66,'G',2,.4);
  last=null;riff(64,'F',.21,3000,12);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){JF.gsnare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.16);I.sub(w,.48);I.stab(w,CH.F.concat([12,17]),.9,.5,3000)});
  drums(68,72);bass(68,'F',.46);pad(68,'F',4,.45,1800);arp(68,'F',.026,2000,2000,.25);
  [[68,21,1.4],[69.5,19,.45],[70,17,.95],[71,16,.45],[71.5,12,.45]].forEach(function(x){var pv=last;last=x[1];C(x[0],function(w){JG.lead(w,x[1],x[2]*B,.21,pv,3000)})});
  /* 6 · finale: batteria ferma, archi; il riff lontano, filtrato, e si spegne sul Fa */
  C(72,function(w){JF.strings(w,4*B,CH.AM,.45,1200);I.bass(w,-15,3*B,.15)});
  last=null;riff(72,'AM',.08,1100);
  C(76,function(w){var d=12*B;CH.F.forEach(function(n,i){[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:.022,peak:.12,lp:1100,lp1:200,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.45})})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'})})}
MUS.g=musicG;SG.g=1;
/* ---------- la G con tre melodie diverse. Tutto il resto della G resta identico ---------- */
var JH={/* ottone di synth: si apre lento, raddoppiato all'ottava sotto */
 brass:function(w,n,d,v,lp){lp=lp||2600;[[0,1],[-12,.6]].forEach(function(o){[-14,-7,0,7,14].forEach(function(dt,i){tone(w,{type:'sawtooth',f:nt(n+o[0]),det:dt,d:d,v:v*.06*o[1],sus:1,a:.07,rel:.18,lp:lp*.3,lp1:lp,lpt:.28,lq:1.5,pan:(i-2)*.15,to:'x',rev:.25,echo:.12})})})}};
var JI={/* il filtro che parla: dente di sega in tre risonanze che si spostano come una vocale */
 V:{a:[800,1150,2900],o:[450,800,2830],i:[300,2100,2950],e:[420,1700,2600]},
 talk:function(w,n,d,v,from,to){var f=nt(n),o1=AC.createOscillator(),o2=AC.createOscillator();o1.type=o2.type='sawtooth';o1.frequency.value=f;o2.frequency.value=f;o2.detune.value=9;
   var q=out({to:'x',rev:.15,echo:.2}),len=env(q.g.gain,w,{v:v,sus:1,a:.006,d:d,rel:.05}),src=AC.createGain();src.gain.value=.5;o1.connect(src);o2.connect(src);
   var A=JI.V[from]||JI.V.a,Z=JI.V[to]||A;A.forEach(function(fq,k){var bp=AC.createBiquadFilter();bp.type='bandpass';bp.Q.value=7;bp.frequency.setValueAtTime(fq,w);bp.frequency.linearRampToValueAtTime(Z[k],w+Math.min(d,.22));
     var gk=AC.createGain();gk.gain.value=[1,.7,.35][k]*2.2;src.connect(bp);bp.connect(gk);gk.connect(q.g)});
   var lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=500;var gl=AC.createGain();gl.gain.value=.3;src.connect(lp);lp.connect(gl);gl.connect(q.g);
   o1.start(w);o2.start(w);o1.stop(w+len+.05);o2.stop(w+len+.05)}};
var JJ={/* accordi a colpi secchi e un ping metallico */
 stab:function(w,ch,v,lp){lp=lp||2600;ch.forEach(function(n,i){[-6,6].forEach(function(dt,j){tone(w,{type:j?'square':'sawtooth',f:nt(n)*1.02,f1:nt(n),gl:.02,det:dt,d:.17,v:v*.075,lp:lp,lp1:lp*.28,lpt:.15,lq:2,pan:(i-1.5)*.2,to:'x',rev:.18,echo:.15})})})},
 ping:function(w,n,v,p){var f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:p||0,to:'d',rev:.3,echo:.3});
   c.frequency.value=f;m.frequency.value=f*1.41;mg.gain.setValueAtTime(f*2.2,w);mg.gain.exponentialRampToValueAtTime(f*.05,w+.45);m.connect(mg);mg.connect(c.frequency);c.connect(q.g);
   var len=env(q.g.gain,w,{v:v,a:.001,d:.55});m.start(w);c.start(w);m.stop(w+len+.05);c.stop(w+len+.05)}};
JJ.dark=function(w,ch,v,lp){lp=lp||2200;ch.forEach(function(n,i){[-7,7].forEach(function(dt,j){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:.22,v:v*.075,lp:lp,lp1:lp*.24,lpt:.15,lq:1.3,pan:(i-1.5)*.22,to:'x',rev:.22,echo:.16})})});
  tone(w,{type:'triangle',f:nt(ch[0]-12),d:.2,v:v*.12,lp:600,to:'d'})};
JJ.ping2=function(w,n,v,p){var f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:p||0,to:'d',rev:.32,echo:.3});
  c.frequency.value=f;m.frequency.value=f*1.41;mg.gain.setValueAtTime(f*1.3,w);mg.gain.exponentialRampToValueAtTime(f*.04,w+.35);m.connect(mg);mg.connect(c.frequency);c.connect(q.g);
  var len=env(q.g.gain,w,{v:v,a:.002,d:.7});m.start(w);c.start(w);m.stop(w+len+.05);c.stop(w+len+.05)};
var MELS={
 h:{/* Tron: poche note lunghe, salti larghi, note tenute che cambiano colore sotto gli accordi */
  N:{AM:[[0,16,1.45],[1.5,21,2.4]],G:[[0,19,1.45],[1.5,14,2.4]],F:[[0,21,1.45],[1.5,16,2.4]],G2:[[0,14,.95],[1,16,.95],[2,11,1.9]]},
  bar:function(C,B,b,key,v,lp,oct){this.N[key].forEach(function(x){C(b+x[0],function(w){JH.brass(w,x[1]+(oct||0),x[2]*B,v*1.35,lp)})})},
  done:function(C,B){[[68,21,1.95],[70,24,1.95]].forEach(function(x){C(x[0],function(w){JH.brass(w,x[1],x[2]*B,.24,3200)})})}},
 i:{/* Daft Punk: riff basso con tanto spazio, il filtro che parla */
  N:{AM:[[0,-3,.4,'a','o'],[.75,-3,.2,'o','a'],[1,0,.45,'a','e'],[2.5,4,.4,'e','i'],[3,2,.7,'o','a']],
     G:[[0,-5,.4,'a','o'],[.75,-5,.2,'o','a'],[1,-1,.45,'a','e'],[2.5,2,.4,'e','i'],[3,-1,.7,'o','a']],
     F:[[0,-7,.4,'a','o'],[.75,-7,.2,'o','a'],[1,-3,.45,'a','e'],[2.5,0,.4,'e','i'],[3,4,.7,'i','o']],
     G2:[[0,-5,.4,'a','o'],[.75,-1,.2,'o','a'],[1,2,.45,'a','e'],[2,4,.9,'e','i'],[3,2,.45,'o','a'],[3.5,-1,.4,'a','o']]},
  bar:function(C,B,b,key,v,lp,oct){this.N[key].forEach(function(x){C(b+x[0],function(w){JI.talk(w,x[1]+12+(oct||0),x[2]*B,v*(lp&&lp<1500?.6:1)*.9,x[3],x[4])})})},
  done:function(C,B){[[68,21,.9,'a','o'],[69,24,.9,'o','e'],[70,21,1.9,'e','i']].forEach(function(x){C(x[0],function(w){JI.talk(w,x[1],x[2]*B,.2,x[3],x[4])})})}},
 j:{/* Apple e Teenage Engineering, più seria: stessi colpi sincopati, accordi stretti e più bassi (settime, seste, seconde),
     suono scuro senza il blip che scende, ping un'ottava sotto e morbido. A Start service non sale d'ottava, si apre il filtro */
  CH:{AM:[7,9,12,16],G:[4,7,9,14],F:[4,5,9,12],G2:[2,7,9,14]},P:{AM:16,F:21,G2:19},
  bar:function(C,B,b,key,v,lp,oct){var ch=this.CH[key];if(oct)lp=(lp||2600)*1.25;[[0,1],[.75,.6],[2,.9],[2.75,.6],[3.5,.75]].forEach(function(x){C(b+x[0],function(w){JJ.dark(w,ch,v*x[1]*1.55,lp)})});
    var p=this.P[key];if(p!=null)C(b+(key==='G2'?3:1.5),function(w){JJ.ping2(w,p,v*.2,.2)})},
  done:function(C,B){var ch=[0,4,5,9,12];[[68,1.5],[68.75,.7],[70,1.1],[70.75,.7],[71.5,.9]].forEach(function(x){C(x[0],function(w){JJ.dark(w,ch,.21*x[1],3000)})});
    C(68,function(w){JJ.ping2(w,21,.05,0)});C(70,function(w){JJ.ping2(w,24,.04,.3)})}}
};
function musicGX(M,C0,MEL){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={AM:[-3,0,4,9],G:[-5,-1,2,7],F:[-7,-3,0,5],E:[-8,-4,-1,4],DM:[-10,-7,-3,2]};
  var RT={AM:-27,G:-29,F:-31,E:-32,DM:-22};
  /* il riff: stesso ritmo in ogni battuta, le note cambiano con l'accordo */
  var RC=[[0,.45],[.75,.22],[1,.45],[1.75,.22],[2,.45],[2.75,.22],[3,.7]];
  var RF={AM:[9,12,16,14,12,9,16],G:[14,11,14,16,19,14,11],F:[9,12,17,16,12,9,17],G2:[19,17,16,14,11,14,11]};
  var last=null;
  function riff(b,key,v,lp,oct){MEL.bar(C,B,b,key,v,lp,oct)}
  function bass(b,ch,v,until){for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(until&&t>=until)return;C(t,function(w){JF.bass(w,RT[ch]+(e%2?12:0),v,B*.45)})})(e)}
  function acidB(b,ch,v,c0,c1,until){var sq=[0,12,0,0,12,0,7,12,0,12,0,0,10,0,12,7];for(var s=0;s<16;s++)(function(s){var t=b+s*.25;if(until&&t>=until)return;C(t,function(w){J.acid(w,RT[ch]+12+sq[s],v,c0+(c1-c0)*s/16,.11)})})(s)}
  function arp(b,ch,v,c0,c1,rate,until){var c=CH[ch],seq=[0,1,2,3,2,1,2,3].map(function(k){return c[k]+12}),n=Math.round(4/rate);for(var i=0;i<n;i++)(function(i){var t=b+i*rate;if(until&&t>=until)return;
    C(t,function(w){JF.arp(w,seq[i%8]+(i%8===3?12:0),v,c0+(c1-c0)*(i/n),(i%2?.3:-.3))})})(i)}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;
    if(o.half){if(k===0)C(b,function(w){I.kick(w,.66)});if(k===1)C(b+.75,function(w){I.kick(w,.38)});if(k===2)C(b,function(w){JF.gsnare(w,.2);I.clap(w,.1)})}
    else{if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.62)});if(k===2)C(b+.75,function(w){I.kick(w,.32)});if(k===1||k===3)C(b,function(w){JF.gsnare(w,o.s||.16);I.clap(w,.08)})}
    C(b+.5,function(w){I.hat(w,.08,.2,!o.half&&k===3)});[.25,.75].forEach(function(s){C(b+s,function(w){I.hat(w,o.half?.05:.028,-.25)})})})}
  function pad(b,ch,n,v,lp){C(b,function(w){JF.strings(w,n*B+.05,CH[ch],v,lp)})}
  /* 1 · apertura: archi scuri, arpeggio filtrato, il riff si sente lontano e si avvicina; la cassa entra col colore */
  [['AM',0],['G',4],['F',8],['G',12],['AM',16]].forEach(function(x,i){pad(x[1],x[0],4,.45,600+i*150);arp(x[1],x[0],.028+i*.006,400+i*180,600+i*260,.25,19.5)});
  last=null;riff(12,'F',.1,900);riff(16,'AM',.14,1400);
  beats(12,19,function(b){C(b,function(w){I.kick(w,.22+(b-12)*.04)})});
  [18.5,18.75,19,19.25].forEach(function(b,i){C(b,function(w){JF.tom(w,[-8,-10,-13,-15][i],.25)})});C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code */
  C(20,function(w){I.crash(w,.1);I.sub(w,.42)});
  drums(20,28);bass(20,'AM',.44);bass(24,'G',.44);pad(20,'AM',4,.35,1400);pad(24,'G',4,.35,1400);
  last=null;riff(20,'AM',.2);riff(24,'G',.2);
  /* 3 · Matrix: la macchina prende il comando */
  C(28,function(w){I.sub(w,.5);JF.gsnare(w,.22);I.crash(w,.08)});
  [['AM',28],['F',32],['E',36]].forEach(function(x,i){var b=x[1],ch=x[0];acidB(b,ch,.1,500+i*700,1000+i*1300,38.75);arp(b,ch,.042,800+i*800,1400+i*1200,.125,38.75);
    for(var s=0;s<16;s++)(function(s){if(s%3===1)return;C(b+s*.25,function(w){JG.chop(w,CH[ch],.9,1200+i*600,(s%2?.3:-.3))})})(s);
    C(b,function(w){I.bass(w,RT[ch]+12,4.02*B,.27);JF.strings(w,4.4*B,CH[ch],.4,800+i*350)})});
  drums(28,38,{half:1});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){JF.gsnare(w,.05+r*.022)})})(r);[39,39.25,39.5,39.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-6,-9,-12,-15][i],.3)})});
  /* 4 · le app: il riff intero, quattro battute, poi riparte */
  C(40,function(w){I.crash(w,.12);I.sub(w,.45)});
  var AP=[['AM','AM'],['G','G'],['F','F'],['G','G2'],['AM','AM'],['G','G']];drums(40,61);
  last=null;AP.forEach(function(x,i){var b=40+i*4;bass(b,x[0],.44,61.5);pad(b,x[0],4,.35,1500);if(i>=2)arp(b,x[0],.022,1600,1600,.25,61.5);if(b<60)riff(b,x[1],.21,i>=4?3000:2600)});
  /* la pizzeria si apre: resta l'arpeggio sugli archi, tom verso Start service */
  pad(61.5,'G',2.5,.5,1500);arp(61.5,'G',.035,800,2400,.125,64);[63,63.25,63.5,63.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-5,-8,-11,-14][i],.28)})});
  /* 5 · Start service: il riff un'ottava sopra; Service complete: il massimo, su Fa, epico */
  C(64,function(w){I.crash(w,.1);I.sub(w,.38)});drums(64,68);bass(64,'F',.46,66);bass(66,'G',.46);pad(64,'F',2,.4);pad(66,'G',2,.4);
  last=null;riff(64,'F',.21,3000,12);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){JF.gsnare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.16);I.sub(w,.48);I.stab(w,CH.F.concat([12,17]),.9,.5,3000)});
  drums(68,72);bass(68,'F',.46);pad(68,'F',4,.45,1800);arp(68,'F',.026,2000,2000,.25);
  MEL.done(C,B);
  /* 6 · finale: batteria ferma, archi; il riff lontano, filtrato, e si spegne sul Fa */
  C(72,function(w){JF.strings(w,4*B,CH.AM,.45,1200);I.bass(w,-15,3*B,.15)});
  last=null;riff(72,'AM',.08,1100);
  C(76,function(w){var d=12*B;CH.F.forEach(function(n,i){[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:.022,peak:.12,lp:1100,lp1:200,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.45})})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'})})}
MUS.h=function(M,C0){musicGX(M,C0,MELS.h)};MUS.i=function(M,C0){musicGX(M,C0,MELS.i)};MUS.j=function(M,C0){musicGX(M,C0,MELS.j)};SG.h=SG.i=SG.j=1;
/* ---------- K, L, M: tre canzoni nuove sulla stessa struttura e batteria della G ----------
   Regole: cambiare giro di accordi, basso, arpeggio e tema (non solo il suono del tema). Niente La min, Sol, Fa, Sol.
   Accordi con settime, none e sospesi (adulti, non tristi). Tema di tre note per battuta, registro medio, salti di quarta e quinta,
   spazio in ogni battuta. Basso con un ritmo suo, niente ottava che rimbalza. Niente campanelli.
   Runtime: la musica non si ferma. Un colpo forte sul glitch, la band va dietro un vetro (filtro che si riapre in tre battute),
   davanti piove un arpeggio digitale, la batteria resta uguale. */
function penv(g,w,v,d){var a=.003,k=Math.min(.22,d*.45);g.setValueAtTime(0,w);g.linearRampToValueAtTime(v,w+a);g.exponentialRampToValueAtTime(v*.32,w+a+k);
  g.linearRampToValueAtTime(v*.22,w+Math.max(a+k+.01,d-.06));g.linearRampToValueAtTime(0,w+Math.max(a+k+.02,d));return Math.max(a+k+.02,d)}
var FX={/* il vetro: filtro passa basso su tutta la band (la batteria resta fuori) */
 filt:function(w,f0,f1,d,q){var f=bus&&bus.mf;if(!f)return;f.frequency.cancelScheduledValues(w);f.Q.cancelScheduledValues(w);f.frequency.setValueAtTime(f0,w);f.frequency.exponentialRampToValueAtTime(f1,w+d);
   f.Q.setValueAtTime(q||.7,w);f.Q.linearRampToValueAtTime(.7,w+d)},
 /* l'impatto del Runtime: risucchio che sale e si taglia, colpo sub, crash */
 impact:function(w,B){noise(w-B*1.5,{f:300,f1:6500,q:1.2,d:B*1.5,v:.06,peak:.99,to:'m',rev:.2});tone(w,{f:68,f1:28,gl:1.2,d:1.4,v:.55,to:'m'});
   noise(w,{type:'lowpass',f:900,f1:120,d:.5,v:.22,to:'m',rev:.3});I.crash(w,.11)}};
var JK={
 /* lama: FM a rapporto 2 (vuoto, metallico, non campana) più un corpo di seghe filtrate */
 blade:function(w,n,d,v,p,lp){var f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:p||0,to:'d',rev:.22,echo:.24});
   c.frequency.value=f;m.frequency.value=f*2;mg.gain.setValueAtTime(f*2.4,w);mg.gain.exponentialRampToValueAtTime(f*.3,w+Math.min(.45,d));m.connect(mg);mg.connect(c.frequency);
   var lf=AC.createBiquadFilter();lf.type='lowpass';lf.frequency.value=lp||3400;c.connect(lf);lf.connect(q.g);var len=penv(q.g.gain,w,v,d);
   m.start(w);c.start(w);m.stop(w+len+.05);c.stop(w+len+.05);
   [-8,8].forEach(function(dt){tone(w,{type:'sawtooth',f:f,det:dt,d:d,v:v*.32,sus:1,a:.008,rel:Math.min(.2,d*.4),lp:Math.min(lp||3400,2400),lp1:650,lpt:Math.min(d,.5),lq:1.4,pan:(p||0)+dt*.03,to:'d',rev:.18})})},
 /* pioggia digitale: arpeggio a trentaduesimi davanti al vetro */
 rain:function(w,n,v,cut,p){tone(w,{type:'square',f:nt(n),d:.06,v:v,lp:cut,lp1:cut*.4,lpt:.05,lq:3,pan:p,to:'m',echo:.25});tone(w,{type:'sawtooth',f:nt(n+12),d:.04,v:v*.35,lp:cut*1.4,pan:-p,to:'m'})}};
var JL={
 /* il basso che canta: due seghe e un'onda quadra nel filtro risonante, più il sub */
 growl:function(w,n,v,d,lp){lp=lp||2300;[-8,8].forEach(function(dt,i){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:v*.2,sus:1,a:.004,rel:.03,lp:lp,lp1:lp*.24,lpt:Math.min(d,.22),lq:5,pan:i?.12:-.12,to:'x'})});
   tone(w,{type:'square',f:nt(n),d:d,v:v*.1,sus:1,a:.004,rel:.03,lp:lp*.5,lp1:240,lpt:d,to:'x'});tone(w,{f:nt(n<-20?n:n-12),d:d,v:v*.5,sus:1,a:.004,rel:.03,to:'d'})}};
var JM={
 /* pluck morbido: due seghe e una quadra un'ottava sotto, il filtro si chiude piano */
 pluck:function(w,n,d,v,p,lp){lp=lp||3000;[-10,10].forEach(function(dt,i){var o=AC.createOscillator();o.type='sawtooth';o.frequency.value=nt(n);o.detune.value=dt;
     var f=AC.createBiquadFilter();f.type='lowpass';f.Q.value=2;f.frequency.setValueAtTime(lp,w);f.frequency.exponentialRampToValueAtTime(Math.max(300,lp*.28),w+Math.min(d,.6));
     var q=out({pan:(p||0)+(i?.22:-.22),to:'d',rev:.25,echo:.28}),len=penv(q.g.gain,w,v*.11,d);o.connect(f);f.connect(q.g);o.start(w);o.stop(w+len+.05)});
   tone(w,{type:'square',f:nt(n-12),d:d,v:v*.05,sus:1,a:.004,rel:Math.min(.2,d*.4),lp:900,lp1:300,lpt:d,pan:p||0,to:'d'});
   tone(w,{f:nt(n+12),d:.35,v:v*.035,pan:-(p||0),to:'d',echo:.3})},
 /* basso a impulsi: ottavi dritti sulla stessa nota, accento sul battito, il filtro respira */
 pulse:function(w,n,v,d,cut){tone(w,{type:'sawtooth',f:nt(n),d:d,v:v*.26,sus:1,a:.004,rel:.03,lp:cut,lp1:cut*.3,lpt:d*.9,lq:2.5,to:'x'});tone(w,{f:nt(n<-20?n:n-12),d:d,v:v*.55,sus:1,a:.004,rel:.03,to:'d'})}};

function musicN(M,C0,S){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B,P=S.P,CH=S.CH,RT=S.RT,bar=0;
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;
    if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.62)});if(k===2)C(b+.75,function(w){I.kick(w,.32)});if(k===1||k===3)C(b,function(w){JF.gsnare(w,o.s||.16);I.clap(w,.08)})
    C(b+.5,function(w){I.hat(w,.08,.2,k===3)});[.25,.75].forEach(function(s){C(b+s,function(w){I.hat(w,.028,-.25)})});
    if(o.sh)[.125,.375,.625,.875].forEach(function(s){C(b+s,function(w){I.shk(w,.018,.35)})})})}
  function pad(b,ch,n,v,lp){var c=CH[ch];C(b,function(w){JF.strings(w,n*B+.05,c,v*4/c.length,lp)})}
  function arp(b,ch,v,c0,c1,rate,until,rain){var c=CH[ch],seq=S.ARP.map(function(k){return c[k%c.length]+12+(k>=c.length?12:0)}),n=Math.round(4/rate);
    for(var i=0;i<n;i++)(function(i){var t=b+i*rate;if(until&&t>=until)return;C(t,function(w){(rain?JK.rain:JF.arp)(w,seq[i%seq.length],v,c0+(c1-c0)*(i/n),(i%2?.3:-.3))})})(i)}
  function bass(b,ch,v,until,lp){S.bass(C,B,b,ch,v,until,lp)}
  function hook(b,ch,v,lp,oct){S.hook(C,B,b,ch,bar++%2,v,lp,oct||0)}
  function tease(b,ch,v,lp){if(S.teaseBass)bass(b,ch,S.bv*v*2.6,null,lp);else hook(b,ch,v,lp)}
  /* 1 · apertura: archi scuri sul giro nuovo, arpeggio filtrato, il tema lontano che si avvicina */
  [P[0],P[1],P[2],P[3],P[0]].forEach(function(ch,i){pad(i*4,ch,4,.45,600+i*150);arp(i*4,ch,.028+i*.006,400+i*180,600+i*260,.25,19.5)});
  bar=1;tease(12,P[3],.1,900);bar=0;tease(16,P[0],.14,1400);
  beats(12,19,function(b){C(b,function(w){I.kick(w,.22+(b-12)*.04)})});
  [18.5,18.75,19,19.25].forEach(function(b,i){C(b,function(w){JF.tom(w,[-8,-10,-13,-15][i],.25)})});C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code */
  C(20,function(w){I.crash(w,.1);I.sub(w,.42)});drums(20,28);bar=0;
  [P[0],P[1]].forEach(function(ch,i){var b=20+i*4;bass(b,ch,S.bv);pad(b,ch,4,.35,1400);hook(b,ch,.2)});
  /* 3 · Runtime: niente stacco. Colpo forte, la band dietro il vetro che si riapre, la pioggia digitale davanti, batteria uguale */
  C(28,function(w){FX.impact(w,B);FX.filt(w,520,9000,11.6*B,5)});C(40,function(w){FX.filt(w,9000,20000,.05)});
  drums(28,40,{sh:1});
  S.MX.forEach(function(ch,i){var b=28+i*4;bass(b,ch,S.bv);pad(b,ch,4,.38,900+i*400);hook(b,ch,.2);arp(b,ch,.024+i*.004,1500+i*900,2600+i*1200,.125,39.5,1)});
  C(36,function(w){I.riser(w,4*B,.06)});[39,39.25,39.5,39.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-6,-9,-12,-15][i],.2)})});
  /* 4 · le app: il tema intero, poi riparte */
  C(40,function(w){I.crash(w,.12);I.sub(w,.45)});drums(40,61);bar=0;
  [0,1,2,3,0,1].forEach(function(k,i){var b=40+i*4,ch=P[k];bass(b,ch,S.bv,61.5);pad(b,ch,4,.35,1500);if(i>=2)arp(b,ch,.022,1600,1600,.25,61.5);if(b<60)hook(b,ch,.21,i>=4?3200:2800)});
  /* la pizzeria si apre: resta l'arpeggio sugli archi, tom verso Start service */
  pad(61.5,P[1],2.5,.5,1500);arp(61.5,P[1],.035,800,2400,.125,64);[63,63.25,63.5,63.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-5,-8,-11,-14][i],.28)})});
  /* 5 · Start service e Service complete */
  C(64,function(w){I.crash(w,.1);I.sub(w,.38)});drums(64,68);bass(64,S.SV[0],S.bv,66);bass(66,S.SV[1],S.bv,68);pad(64,S.SV[0],2,.4);pad(66,S.SV[1],2,.4);
  bar=0;hook(64,S.SV[0],.25,3400,S.svOct||0);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){JF.gsnare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.16);I.sub(w,.48);I.stab(w,CH[S.DONE].concat([CH[S.DONE][0]+24]),.9*4/CH[S.DONE].length,.5,3000)});
  drums(68,72);bass(68,S.DONE,S.bv);pad(68,S.DONE,4,.45,1800);arp(68,S.DONE,.026,2000,2000,.25);S.done(C,B);
  /* 6 · finale: batteria ferma, archi, il tema lontano; si spegne sull'accordo aperto */
  C(72,function(w){JF.strings(w,4*B,CH[P[0]],.45*4/CH[P[0]].length,1200);I.bass(w,RT[P[0]]+12,3*B,.15)});
  bar=0;hook(72,P[0],.08,1100);
  C(76,function(w){var d=12*B,c=CH[S.FADE];c.forEach(function(n,i){[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:.022*4/c.length,peak:.12,lp:1100,lp1:200,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.45})})});tone(w,{f:nt(S.FRT),d:d*.8,v:.1,peak:.1,to:'d'})})}

var SONGS={
 /* K · Monolite. La min 9, Fa maj7 con l'undicesima, Re min 9, accordo per quarte su Mi. Il tema: colpi di accordo e tre note
    (Mi, Si, Re) che restano quasi uguali mentre sotto cambia l'armonia: ogni volta suonano diverse. Basso sincopato */
 k:{P:['a','f','d','e'],MX:['d','e','e'],SV:['d','e'],DONE:'f',FADE:'f',FRT:-19,bv:.46,
  CH:{a:[-3,0,4,7,11],f:[-7,-3,0,4,11],d:[-10,-7,-3,0,4],e:[-8,-3,2,7,11]},RT:{a:-27,f:-31,d:-22,e:-20},
  ARP:[0,2,4,2,1,3,5,3],
  MO:{a:[16,11,14],f:[16,11,12],d:[16,11,14],e:[16,14,9]},
  bass:function(C,B,b,ch,v,until){var r=this.RT[ch];[[0,0,.55],[.75,0,.2],[1.5,12,.2],[2,0,.4],[2.75,0,.2],[3.25,7,.2],[3.5,12,.25]].forEach(function(x){var t=b+x[0];if(until&&t>=until)return;
    C(t,function(w){JF.bass(w,r+x[1],v,x[2]*B)})})},
  hook:function(C,B,b,ch,par,v,lp,oct){var c=this.CH[ch].map(function(n){return n+oct}),m=this.MO[ch];
    (par?[[.5,.75],[1.25,.6]]:[[0,1],[.75,.55],[1.5,.8]]).forEach(function(x){C(b+x[0],function(w){JJ.stab(w,c,v*x[1]*1.05,lp)})});
    [[2,.6],[2.75,.6],[3.5,1.25]].forEach(function(x,i){var n=m[i]+oct;C(b+x[0],function(w){JK.blade(w,n,x[1]*B,v*.55,i===1?.25:-.15,lp?lp+600:3600)})})},
  done:function(C,B){var c=this.CH.f.map(function(n){return n+12});[[68,1.4],[68.75,.7],[69.5,.9]].forEach(function(x){C(x[0],function(w){JJ.stab(w,c,.23*x[1],3200)})});
    [[70,16,.7],[70.75,23,.7],[71.5,21,2.2]].forEach(function(x){C(x[0],function(w){JK.blade(w,x[1],x[2]*B,.17,0,4200)})})}},

 /* L · Circuito. La dorico: La min 11, La min 7, Do maj7, Re con la nona. Il tema è il basso: un riff a sedicesimi con lo stesso ritmo,
    che sale e cambia la fine (domanda e risposta). Sopra, poche note lunghe e scure, accordi corti sul rullante */
 l:{P:['a','a2','c','d'],MX:['c','d','d'],SV:['c','d'],DONE:'f',FADE:'f',FRT:-19,bv:.5,
  CH:{a:[-3,0,2,7],a2:[-3,0,4,7],c:[-5,0,4,11],d:[-6,-3,2,4],f:[-7,-3,0,4,7]},RT:{a:-27,a2:-27,c:-24,d:-22,f:-31},
  ARP:[0,3,1,3,2,3,1,3],
  R:[[0,.4],[.75,.2],[1.25,.2],[1.5,.3],[2.25,.2],[2.5,.2],[3,.35],[3.5,.35]],
  RF:{a:[-27,-15,-17,-15,-12,-15,-20,-17],a2:[-27,-15,-17,-15,-12,-10,-8,-10],c:[-24,-12,-13,-12,-8,-12,-17,-13],d:[-22,-10,-12,-10,-6,-8,-10,-15],f:[-31,-19,-20,-19,-15,-19,-24,-20]},
  TOP:{a:[[0,16,3],[3,14,4.8]],a2:[],c:[[0,16,3],[3,18,4.6]],d:[],f:[]},
  bass:function(C,B,b,ch,v,until,lp){var nn=this.RF[ch];this.R.forEach(function(x,i){var t=b+x[0];if(until&&t>=until)return;C(t,function(w){JL.growl(w,nn[i],v*(i===0?1:.85),x[1]*B,lp)})})},
  teaseBass:1,
  hook:function(C,B,b,ch,par,v,lp,oct){var c=this.CH[ch].map(function(n){return n+12+oct});
    [1,3].forEach(function(s){C(b+s,function(w){JJ.stab(w,c,v*.55,Math.min(lp||1800,1800))})});
    var cut=(b===64);this.TOP[ch].forEach(function(x){var d=cut?Math.min(x[2],3.9-x[0]):x[2];C(b+x[0],function(w){JH.brass(w,x[1]+oct,d*B,v*.5,lp?Math.min(lp,2200):2200)})})},
  done:function(C,B){[[68,16,1.4],[69.5,19,.45],[70,21,2]].forEach(function(x){C(x[0],function(w){JH.brass(w,x[1],x[2]*B,.18,3000)})});
    var c=this.CH.f.map(function(n){return n+12});[69,71].forEach(function(s){C(s,function(w){JJ.stab(w,c,.14,2400)})})}},

 /* M · Vetro. Re minore, basso che scende: Re min 9, La min 7 su Do, Si bemolle maj7, Sol min 9 (e La sospeso per tornare).
    Il tema: tre note a quinte e quarte, la stessa forma che scende col basso. Basso a impulsi dritti, nessun salto */
 m:{P:['dm','amc','bb','gm'],MX:['bb','gm','asus'],SV:['gm','asus'],DONE:'bb',FADE:'bb',FRT:-14,bv:.48,
  CH:{dm:[-7,-3,0,4],amc:[-5,-3,0,4],bb:[-7,-2,2,9],gm:[-2,2,5,9],asus:[-5,-3,2,4]},RT:{dm:-22,amc:-24,bb:-26,gm:-29,asus:-27},
  ARP:[0,2,1,3,0,2,4,3],
  MO:{dm:[14,9,16],amc:[12,7,14],bb:[10,5,12],gm:[9,14,17],asus:[9,14,16]},
  bass:function(C,B,b,ch,v,until){var r=this.RT[ch];for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(until&&t>=until)return;
    C(t,function(w){JM.pulse(w,r,v*(e%2?.6:1),(e%2?.3:.45)*B,e%2?700:1100+e*60)})})(e)},
  hook:function(C,B,b,ch,par,v,lp,oct){var m=this.MO[ch],c=this.CH[ch].map(function(n){return n+12+oct});
    [[0,1],[1.5,.5],[2,1.5]].forEach(function(x,i){var n=m[i]+oct;C(b+x[0],function(w){JM.pluck(w,n,x[1]*B,v*1.6,i===1?.2:-.12,lp?lp+400:3400)})});
    C(b+3.5,function(w){JJ.stab(w,c,v*(par?.75:.5),lp||2400)})},
  done:function(C,B){var c=this.CH.bb.map(function(n){return n+12});[[68,1.4],[68.75,.7],[69.5,.9]].forEach(function(x){C(x[0],function(w){JJ.stab(w,c,.23*x[1],3200)})});
    [[70,17,.7],[70.75,22,.7],[71.5,21,2.2]].forEach(function(x){C(x[0],function(w){JM.pluck(w,x[1],x[2]*B,.38,0,4000)})})}}
};
MUS.k=function(M,C0){musicN(M,C0,SONGS.k)};MUS.l=function(M,C0){musicN(M,C0,SONGS.l)};MUS.m=function(M,C0){musicN(M,C0,SONGS.m)};SG.k=SG.l=SG.m=1.22;
/* ---------- J2 e J3: la J più seria. Stesso ritmo, stessa struttura.
   Un tono sotto (Sol minore), colpi di accordo un'ottava più giù con accordi di nona, senza il cinguettio d'attacco e senza onda quadra,
   il ping non è più una campanella ed è più basso, il basso batte l'ottava solo di passaggio, battute pari e dispari diverse (respiro).
   J2: Runtime come la J. J3: Runtime morbido, la musica continua e passa dietro un vetro ---------- */
var JN={
 stab:function(w,ch,v,lp){lp=lp||2200;var k=4/ch.length;ch.forEach(function(n,i){[-7,7].forEach(function(dt,j){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:.2,v:v*.08*k,lp:lp,lp1:lp*.22,lpt:.17,lq:1.6,pan:(i-(ch.length-1)/2)*.16+(j?.08:-.08),to:'x',rev:.1,echo:.14})})});
   tone(w,{f:nt(ch[0]-12),d:.16,v:v*.1,to:'d'})},
 ping:function(w,n,v,p){var f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:p||0,to:'d',rev:.28,echo:.3});
   c.frequency.value=f;m.frequency.value=f*2;mg.gain.setValueAtTime(f*1.6,w);mg.gain.exponentialRampToValueAtTime(f*.06,w+.3);m.connect(mg);mg.connect(c.frequency);
   var lf=AC.createBiquadFilter();lf.type='lowpass';lf.frequency.value=2600;c.connect(lf);lf.connect(q.g);
   var len=env(q.g.gain,w,{v:v,a:.002,d:.7});m.start(w);c.start(w);m.stop(w+len+.05);c.stop(w+len+.05)}};
MELS.j2={
 CH:{AM:[-3,0,4,7,11],G:[-5,-1,2,7,9],F:[-7,-3,0,4,7],G2:[-5,0,2,7,9]},P:{AM:4,F:9,G2:7},
 RA:[[0,1],[.75,.55],[2,.9],[2.75,.55],[3.5,.7]],RB:[[0,1],[.75,.45],[2,.85],[2.75,.45]],
 bar:function(C,B,b,key,v,lp,oct){var ch=this.CH[key].map(function(n){return n+(oct||0)}),odd=Math.round(b/4)%2;(odd?this.RB:this.RA).forEach(function(x){C(b+x[0],function(w){JN.stab(w,ch,v*x[1]*1.6,lp)})});
   var p=this.P[key];if(p!=null&&!odd)C(b+(key==='G2'?3:1.5),function(w){JN.ping(w,p+12+(oct||0),v*.14,.2)})},
 done:function(C,B){var ch=[-7,-3,0,4,7,12];[[68,1.5],[68.75,.7],[70,1.1],[70.75,.7],[71.5,.9]].forEach(function(x){C(x[0],function(w){JN.stab(w,ch,.3*x[1],3000)})});
   C(68,function(w){JN.ping(w,21,.05,0)});C(70,function(w){JN.ping(w,24,.04,.3)})}};
function musicJ2(M,C00,soft){var KEY=-2,C0=function(t,f){C00(t,function(w){TR=KEY;try{f(w)}finally{TR=0}})};
  var h=H(M,C0),C=h.C,beats=h.beats,B=h.B,MEL=MELS.j2;
  var CH={AM:[-3,0,4,9],G:[-5,-1,2,7],F:[-7,-3,0,5],E:[-8,-4,-1,4],DM:[-10,-7,-3,2]};
  var RT={AM:-27,G:-29,F:-31,E:-32,DM:-22};
  function riff(b,key,v,lp,oct){MEL.bar(C,B,b,key,v,lp,oct)}
  /* il basso: la nota sul battito, l'ottava solo come ombra corta */
  function bass(b,ch,v,until){for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(until&&t>=until)return;C(t,function(w){JF.bass(w,RT[ch]+(e%2?12:0),v*(e%2?.55:1),B*(e%2?.28:.45))})})(e)}
  function acidB(b,ch,v,c0,c1,until){var sq=[0,12,0,0,12,0,7,12,0,12,0,0,10,0,12,7];for(var s=0;s<16;s++)(function(s){var t=b+s*.25;if(until&&t>=until)return;C(t,function(w){J.acid(w,RT[ch]+12+sq[s],v,c0+(c1-c0)*s/16,.11)})})(s)}
  function arp(b,ch,v,c0,c1,rate,until,rain){var c=CH[ch],seq=[0,1,2,3,2,1,2,3].map(function(k){return c[k]+12}),n=Math.round(4/rate);for(var i=0;i<n;i++)(function(i){var t=b+i*rate;if(until&&t>=until)return;
    C(t,function(w){(rain?JK.rain:JF.arp)(w,seq[i%8]+(i%8===3?12:0),v,c0+(c1-c0)*(i/n),(i%2?.3:-.3))})})(i)}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;
    if(o.half){if(k===0)C(b,function(w){I.kick(w,.66)});if(k===1)C(b+.75,function(w){I.kick(w,.38)});if(k===2)C(b,function(w){JF.gsnare(w,.2);I.clap(w,.1)})}
    else{if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.62)});if(k===2)C(b+.75,function(w){I.kick(w,.32)});if(k===1||k===3)C(b,function(w){JF.gsnare(w,o.s||.16);I.clap(w,.08)})}
    C(b+.5,function(w){I.hat(w,.08,.2,!o.half&&k===3)});[.25,.75].forEach(function(s){C(b+s,function(w){I.hat(w,o.half?.05:.028,-.25)})});
    if(o.sh)[.125,.375,.625,.875].forEach(function(s){C(b+s,function(w){I.shk(w,.018,.35)})})})}
  function pad(b,ch,n,v,lp){C(b,function(w){JF.strings(w,n*B+.05,CH[ch],v,lp)})}
  /* 1 · apertura */
  [['AM',0],['G',4],['F',8],['G',12],['AM',16]].forEach(function(x,i){pad(x[1],x[0],4,.45,600+i*150);arp(x[1],x[0],.028+i*.006,400+i*180,600+i*260,.25,19.5)});
  riff(12,'F',.1,900);riff(16,'AM',.14,1400);
  beats(12,19,function(b){C(b,function(w){I.kick(w,.22+(b-12)*.04)})});
  [18.5,18.75,19,19.25].forEach(function(b,i){C(b,function(w){JF.tom(w,[-8,-10,-13,-15][i],.25)})});C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code */
  C(20,function(w){I.crash(w,.1);I.sub(w,.42)});
  drums(20,28);bass(20,'AM',.44);bass(24,'G',.44);pad(20,'AM',4,.35,1400);pad(24,'G',4,.35,1400);
  riff(20,'AM',.2);riff(24,'G',.2);
  /* 3 · Runtime */
  if(!soft){
    C(28,function(w){I.sub(w,.5);JF.gsnare(w,.22);I.crash(w,.08)});
    [['AM',28],['F',32],['E',36]].forEach(function(x,i){var b=x[1],ch=x[0];acidB(b,ch,.08,400+i*700,900+i*1300,38.75);arp(b,ch,.035,700+i*800,1300+i*1200,.125,38.75);
      for(var s=0;s<16;s++)(function(s){if(s%3===1)return;C(b+s*.25,function(w){JG.chop(w,CH[ch],.9,1200+i*600,(s%2?.3:-.3))})})(s);
      C(b,function(w){I.bass(w,RT[ch]+12,4.02*B,.2);JF.strings(w,4.4*B,CH[ch],.3,700+i*350)})});
    drums(28,38,{half:1});
    for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){JF.gsnare(w,.05+r*.022)})})(r);[39,39.25,39.5,39.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-6,-9,-12,-15][i],.3)})});
  }else{
    /* niente stacco: colpo, la band dietro il vetro che si riapre in tre battute, la pioggia digitale davanti, batteria uguale */
    C(28,function(w){FX.impact(w,B);FX.filt(w,520,9000,11.6*B,5)});C(40,function(w){FX.filt(w,9000,20000,.05)});
    drums(28,40,{sh:1});
    [['F',28,'F'],['G',32,'G'],['G',36,'G2']].forEach(function(x,i){var b=x[1],ch=x[0];bass(b,ch,.44);pad(b,ch,4,.38,900+i*400);riff(b,x[2],.2);arp(b,ch,.024+i*.004,1500+i*900,2600+i*1200,.125,39.5,1)});
    C(36,function(w){I.riser(w,4*B,.06)});[39,39.25,39.5,39.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-6,-9,-12,-15][i],.2)})});
  }
  /* 4 · le app */
  C(40,function(w){I.crash(w,.12);I.sub(w,.45)});
  var AP=[['AM','AM'],['G','G'],['F','F'],['G','G2'],['AM','AM'],['G','G']];drums(40,61);
  AP.forEach(function(x,i){var b=40+i*4;bass(b,x[0],.44,61.5);pad(b,x[0],4,.35,1500);if(i>=2)arp(b,x[0],.022,1600,1600,.25,61.5);if(b<60)riff(b,x[1],.21,i>=4?2800:2400)});
  /* la pizzeria si apre */
  pad(61.5,'G',2.5,.5,1500);arp(61.5,'G',.035,800,2400,.125,64);[63,63.25,63.5,63.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-5,-8,-11,-14][i],.28)})});
  /* 5 · Start service: il tema un'ottava sopra (ora è nel registro di prima); Service complete */
  C(64,function(w){I.crash(w,.1);I.sub(w,.38)});drums(64,68);bass(64,'F',.46,66);bass(66,'G',.46,68);pad(64,'F',2,.4);pad(66,'G',2,.4);
  riff(64,'F',.19,2800,12);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){JF.gsnare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.16);I.sub(w,.48);I.stab(w,CH.F.concat([12,17]),.9,.5,3000)});
  drums(68,72);bass(68,'F',.46);pad(68,'F',4,.45,1800);arp(68,'F',.026,2000,2000,.25);
  MEL.done(C,B);
  /* 6 · finale */
  C(72,function(w){JF.strings(w,4*B,CH.AM,.45,1200);I.bass(w,-15,3*B,.15)});
  riff(72,'AM',.08,1100);
  C(76,function(w){var d=12*B;CH.F.forEach(function(n,i){[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:.022,peak:.12,lp:1100,lp1:200,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.45})})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'})})}
MUS.j2=function(M,C0){musicJ2(M,C0,0)};MUS.j3=function(M,C0){musicJ2(M,C0,1)};SG.j2=SG.j3=1;
/* ---------- gli effetti, calcolati dal motore ---------- */
function build(M){var L=[],R=M.REAL,PR=M.PREr,OFF=M.OFF,RUN0=M.RUN0,STK0=M.STK0;
  function C(t,f){L.push({t:t,f:f})}
  function A(a,f){C(R(a),f)}function Ru(u,f){A(RUN0+u,f)}function Rv(v,f){A(STK0+v,f)}function R2(t2,f){A(t2+OFF,f)}
  function steps(a0,a1,fn,stepv,cb){var prev=Math.floor(fn(a0)/stepv);for(var a=a0;a<=a1;a+=.001){var c=Math.floor(fn(a)/stepv);if(c!==prev){cb(a,c);prev=c}}}
  /* apertura: la m cade e tocca terra; le parole si scrivono a tasti */
  A(.36,function(w){S.thud(w,.42)});
  for(var k=0;k<7;k++)(function(k){A(1.0+k*.07,function(w){S.key(w,.028,k+40,-.2+k*.1)})})(k);
  A(1.42,function(w){S.tick(w,.04)});
  A(2.04,function(w){S.click(w,.13,.5)});
  A(2.1,function(w){S.stretch(w,R(2.44)-R(2.1),.07)});
  A(2.62,function(w){S.wobble(w,.16)});
  A(3.24,function(w){S.key(w,.06,7,-.7);S.key(w+.035,.06,8,-.7)});A(3.52,function(w){S.tick(w,.03,-.7)});
  A(3.87,function(w){S.click(w,.15,-.1)});
  A(3.92,function(w){S.swell(w,R(4.36)-R(3.92)+.1,.1)});
  for(var c=0;c<12;c++){if(c===M.MAIN)continue;(function(c){var dx=(c%4)-(M.MAIN%4),dy=Math.floor(c/4)-Math.floor(M.MAIN/4),d=Math.hypot(dx,dy),a=4.62+d*.075+(c%3)*.02,xy=M.cellXY(c);
    A(a+.06,function(w){S.tap(w,.04,pan(xy[0]+180))});
    var d6=Math.hypot((c%4)-2,Math.floor(c/4)-1),fa=5.92+d6*.06;A(fa+.1,function(w){S.flick(w,.028,pan(xy[0]+180))})})(c)}
  A(5.8,function(w){S.click(w,.13,.2)});
  A(6.98,function(w){S.hit(w,.28)});
  /* Brand. Systems. Code. */
  for(var b=0;b<6;b++)(function(b){A(7.0+b*.05+.15,function(w){S.key(w,.05,b+60,-.35+b*.14)})})(b);
  A(8.15,function(w){S.click(w,.12,-.3)});
  steps(8.2,8.9,function(t){return 100+800*io3(P(t,8.2,8.9))},100,function(a,c){A(a,function(w){S.tick(w,.028,-.33+(c-1)*.09)})});
  for(var q=1;q<=4;q++)(function(q){A(9.05+.37*q/4.999,function(w){S.key(w,.09,q+80,-.3+q*.12)})})(q);
  A(9.46,function(w){S.tap(w,.1,.3)});
  /* Runtime */
  Ru(.14,function(w){S.glitch(w,R(RUN0+.48)-R(RUN0+.14),.05,3)});
  for(var j=1;j<=27;j++)(function(j){Ru(.8+.7*j/27,function(w){S.key(w,.022,j+100,-.6)})})(j);
  Ru(.58,function(w){S.rain(w,R(RUN0+2.75)-R(RUN0+.58),.022,11,34)});
  Ru(3.06,function(w){S.tap(w,.06)});
  /* la m che nasce dalla pioggia: scatti sparsi mentre i caratteri si fermano, poi un soffio quando diventa gialla (16:9 e verticale) */
  for(var mt=0;mt<16;mt++)(function(mt){Ru(.78+mt*.085+((mt*7)%5)*.012,function(w){S.tick(w,.014,-.45+((mt*5)%9)*.11)})})(mt);
  Ru(2.2,function(w){S.air(w,R(RUN0+2.58)-R(RUN0+2.2),1200,4200,.022,-.2,.2,.8)});Ru(2.6,function(w){S.tick(w,.03,0);S.tap(w,.035,0)});
  [[3.8,2600],[4.3,3000],[4.75,3500]].forEach(function(x,i){Ru(x[0],function(w){S.ripple(w,R(RUN0+x[0]+.62)-R(RUN0+x[0]),.07,x[1],i*17+5)})});
  if(M.V){
  /* verticale: portatile e telefono, il telefono viene davanti, multitasking, tre scorrimenti, la pizzeria */
  Rv(.28,function(w){S.tap(w,.05,.2)});
  Rv(.35,function(w){S.motor(w,R(STK0+1.55)-R(STK0+.35),.075,-.2,.1)});
  Rv(1.55,function(w){S.click(w,.11,.3)});
  Rv(1.64,function(w){S.air(w,R(STK0+2.05)-R(STK0+1.64),600,1600,.03,.3,0,.6)});
  Rv(2.08,function(w){S.tap(w,.04,0)});
  [[2.4,2.68,-.6],[3.3,3.58,-.6],[4.44,4.72,-.6]].forEach(function(x){Rv(x[0]-.02,function(w){S.click(w,.1,.3);S.air(w+.02,R(STK0+x[1])-R(STK0+x[0]),900,350,.035,.4,x[2],.3)})});
  Rv(3.0,function(w){S.tap(w,.07)});
  Rv(3.1,function(w){S.tick(w,.04,.25);S.tick(w+.06,.028,.25)});
  for(var e=0;e<4;e++)(function(e){Rv(3.72+e*.15+.05,function(w){S.tick(w,.035,.4)})})(e);
  [[3.62,4.28,.86,5200],[3.68,4.32,.78,4300],[3.74,4.36,.92,3600]].forEach(function(r,i){
    steps(STK0+r[0],STK0+r[1]+.01,function(t){return io3(P(t-STK0,r[0],r[1]))*r[2]},.045,function(a,c){A(a,function(w){noise(w,{f:r[3],q:4,d:.008,v:.03,pan:-.35+i*.05})})});
    Rv(r[1],function(w){S.tap(w,.045,-.3)})});
  [3.66,4.04,4.42].forEach(function(v){Rv(v,function(w){tone(w,{f:62,f1:46,gl:.07,d:.13,v:.11,lp:200});tone(w+.15,{f:58,f1:44,gl:.07,d:.11,v:.07,lp:200})})});
  Rv(5.08,function(w){S.tap(w,.07,-.2)});
  Rv(5.22,function(w){S.click(w,.12,0)});
  }else{
  /* le app: solo i gesti che contano */
  Rv(.98,function(w){S.tap(w,.07)});
  Rv(1.12,function(w){S.tick(w,.04,.25);S.tick(w+.06,.028,.25)});
  [[1.5,1.78,-.6],[3.22,3.5,.6],[4.44,4.72,-.6]].forEach(function(x){Rv(x[0],function(w){S.click(w,.12,.1);S.air(w+.02,R(STK0+x[1])-R(STK0+x[0]),900,350,.035,.1,x[2],.3)})});
  Rv(1.95,function(w){S.motor(w,R(STK0+3.05)-R(STK0+1.95),.075,-.45,-.1)});
  Rv(2.44,function(w){S.tap(w,.05,.4)});
  for(var e=0;e<4;e++)(function(e){Rv(3.66+e*.17+.05,function(w){S.tick(w,.035,.4)})})(e);
  /* palestra: gli anelli girano come una ghiera, uno scatto ogni pezzetto di giro; quando si fermano, un tocco morbido.
     Sotto, il battito che sale da 128 a 142 */
  [[3.55,4.25,.86,5200],[3.62,4.3,.78,4300],[3.7,4.32,.92,3600]].forEach(function(r,i){
    steps(STK0+r[0],STK0+r[1]+.01,function(t){return io3(P(t-STK0,r[0],r[1]))*r[2]},.045,function(a,c){A(a,function(w){noise(w,{f:r[3],q:4,d:.008,v:.03,pan:-.35+i*.05})})});
    Rv(r[1],function(w){S.tap(w,.045,-.3)})});
  [3.6,4.02,4.42].forEach(function(v){Rv(v,function(w){tone(w,{f:62,f1:46,gl:.07,d:.13,v:.11,lp:200});tone(w+.15,{f:58,f1:44,gl:.07,d:.11,v:.07,lp:200})})});
  Rv(5.08,function(w){S.tap(w,.07,-.2)});
  Rv(5.22,function(w){S.click(w,.12,-.4)});
  }
  /* start service */
  R2(10.3,function(w){S.click(w,.15,.4)});
  M.TB18.forEach(function(T){R2(10.45+T.ord*.055+.03,function(w){S.tap(w,.022,pan(120+T.x*1.36))})});
  var NF=[1760,2093,2349,2637];
  M.TB18.forEach(function(T,i){R2(10.45+T.ord*.055+.22,function(w){S.blip(w,NF[i%4],.022,pan(120+T.x*1.36))})});
  for(var ci=0;ci<8;ci++)(function(ci){var T=M.TB18[(ci*5+3)%18],a=10.45+T.ord*.055+.22+.35;R2(a,function(w){S.tick(w,.04,.3);S.blip(w+.01,NF[(ci+1)%4]*2,.014,.3)})})(ci);
  for(var kt=0;kt<6;kt++)(function(kt){R2(10.62+kt*.08,function(w){S.print(w,.045,.3)})})(kt);
  R2(11.98,function(w){S.tap(w,.06,.5)});
  /* finale */
  R2(12.42,function(w){S.whomp(w,.32)});
  /* il cerchio si richiude sul logo e torna il bianco: un respiro appena, poi un tocco piccolissimo quando si chiude */
  R2(14.6,function(w){var d=R(15.02+OFF)-R(14.6+OFF);S.air(w,d+.05,1400,4200,.02,0,0,.8);tone(w,{f:330,f1:494,gl:d,d:d+.05,v:.012,peak:.85,lp:1500,rev:.3})});
  R2(15.02,function(w){tone(w,{f:740,f1:560,gl:.04,d:.11,v:.022,lp:2600,rev:.25,echo:.2});tone(w,{f:130,f1:90,gl:.06,d:.14,v:.05,lp:300});noise(w,{f:5200,q:2,d:.01,v:.02})});
  if(!TRK)MUS[STYLE](M,C);
  L.sort(function(a,b){return a.t-b.t});return L}

/* ---------- riproduzione agganciata all'orologio dell'animazione ---------- */
function lat(){return (AC.outputLatency||AC.baseLatency||0)}
function seek(t){idx=0;while(idx<cues.length&&cues[idx].t<t-.02)idx++;if(AC&&bus)newBus()}
function startTrack(t,now,l){var s=AC.createBufferSource();s.buffer=TBUF;var g=AC.createGain();g.gain.value=TGAIN;s.connect(g);g.connect(bus.g);var o=TOFF+t+l;if(o<0)s.start(now-o,0);else if(o<TBUF.duration)s.start(now,o);bus.src=s}
function decode(){if(TRK&&!TBUF&&AC&&!decode.busy){decode.busy=1;var ab=TRK;AC.decodeAudioData(ab.slice(0),function(b){if(TRK===ab){TBUF=b;TGAIN=level(b)}decode.busy=0},function(){decode.busy=0})}}
/* porta ogni traccia allo stesso volume, sotto gli effetti */
function level(b){var d=b.getChannelData(0),s2=0,n=0;for(var i=0;i<d.length;i+=7){s2+=d[i]*d[i];n++}var r=Math.sqrt(s2/n)||.1;return Math.min(2,.033/r)}
function update(t,playing,speed){if(!on||!AC||!playing)return;speed=speed||1;var now=AC.currentTime,l=lat(),lim=t+LOOK*speed;
  if(TBUF&&!bus.src&&speed===1)startTrack(t,now,l);
  while(idx<cues.length&&cues[idx].t<lim){var c=cues[idx];if(c.t>=t-.04){try{c.f(Math.max(now,now+(c.t-t)/speed-l))}catch(e){}}idx++}}
return {
  init:function(M){cues=build(M)},
  style:function(x){STYLE=MUS[x]?x:'a'},
  /* una traccia vera al posto della musica sintetica: ArrayBuffer del file e da dove parte (secondi) */
  track:function(ab,off){TRK=ab;TOFF=off||0;TBUF=null;decode.busy=0;decode()},
  /* fine del film: la musica scende in 1,8 secondi */
  end:function(){if(AC&&bus){var n=AC.currentTime;bus.g.gain.cancelScheduledValues(n);bus.g.gain.setValueAtTime(bus.g.gain.value,n);bus.g.gain.linearRampToValueAtTime(0,n+1.8)}},cues:function(){return cues},S:S,
  enable:function(t){if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return false;setup(new C())}if(AC.resume)AC.resume();on=true;decode();seek(t);return true},
  disable:function(){on=false;if(AC&&bus)newBus()},
  isOn:function(){return on},
  state:function(){return {track:!!TRK,ready:!!TBUF,playing:!!(bus&&bus.src)}},
  volume:function(v){vol=v;if(master)master.gain.setTargetAtTime(v*MK,AC.currentTime,.03)},
  seek:seek,update:update,
  /* tutta la colonna sonora fuori tempo reale: per controllarla e per il video dei social */
  offline:function(M,dur,sr,part){sr=sr||48000;var oc=new OfflineAudioContext(2,Math.ceil(sr*dur),sr);var keep=[AC,master,bus,NB,REV,DLY];setup(oc);
    if(part==='sfx')bus.mus.gain.value=0;if(part==='mus')bus.sfx.gain.value=0;
    var L=build(M);L.forEach(function(c){c.f(Math.max(0,c.t))});
    var go=function(){return oc.startRendering()};
    if(TRK&&part!=='sfx'){var tb=TRK;go=function(){return oc.decodeAudioData(tb.slice(0)).then(function(b){var s=oc.createBufferSource();s.buffer=b;var g=oc.createGain();g.gain.value=level(b);var e=M.DUR;g.gain.setValueAtTime(g.gain.value,e);g.gain.linearRampToValueAtTime(0,e+1.8);s.connect(g);g.connect(bus.g);s.start(Math.max(0,-TOFF),Math.max(0,TOFF));return oc.startRendering()})}}
    return go().then(function(b){AC=keep[0];master=keep[1];bus=keep[2];NB=keep[3];REV=keep[4];DLY=keep[5];return b})}
}})();
