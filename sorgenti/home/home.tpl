<title>Mother Machine Home</title>
<style>
/*FONTS*/
/*CSS*/
/*MANCSS*/
/* ===== home: piano 05 ===== */
html{scroll-behavior:smooth;scroll-padding-top:64px}
body{padding:0;font-size:17px}
.in{max-width:1320px;margin:0 auto;padding-inline:clamp(16px,4vw,56px)}
.hs{background:var(--bg);color:var(--ink);padding-block:clamp(88px,11vw,168px)}
.lt{display:block;height:100%;width:auto}.lt path{fill:currentColor}
/* tipografia: regole Hanken */
.hm h1{font:700 clamp(54px,8.6vw,136px)/.9 var(--f-body);letter-spacing:-.055em;margin:0;max-width:10.5ch;text-wrap:balance}
.hm h2{font:700 clamp(40px,5.4vw,80px)/.93 var(--f-body);letter-spacing:-.047em;margin:0;max-width:13ch;text-wrap:balance}
.hm h3{font:650 clamp(22px,2vw,28px)/1.1 var(--f-body);letter-spacing:-.025em;margin:0}
.hm .lead{font:400 clamp(19px,1.75vw,25px)/1.34 var(--f-body);letter-spacing:-.012em;max-width:33ch;margin:0}
.hm p{max-width:58ch;margin:0;line-height:1.55}
.mo{font:400 12px/1.3 var(--f-mono);letter-spacing:.08em;text-transform:uppercase}
.mut{color:var(--mut)}
/* soglia */
/* soglia rimossa */.sill{display:flex;justify-content:space-between;align-items:baseline;border-top:1.5px solid var(--ink);padding-top:12px;margin-bottom:clamp(40px,5vw,72px)}
.sill b{font:500 13px var(--f-mono);letter-spacing:.02em}
/* 05.1 opening */
.op{padding-top:clamp(150px,17vw,230px)!important;padding-bottom:clamp(64px,8vw,120px)!important}
.op .in{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:32px clamp(24px,5vw,80px);align-items:end}
.op .fno{height:clamp(120px,16vw,236px);align-self:start;margin-top:8px}
.op .bt{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:28px 48px;align-items:end;border-top:1px solid var(--ln);padding-top:28px;margin-top:clamp(24px,4vw,56px)}
.ctas{display:flex;gap:20px;align-items:center;flex-wrap:wrap}
.b{text-decoration:none}
/* 05.2 proof */
.win{background:var(--bg);color:var(--ink);padding:clamp(20px,3vw,36px);display:grid;gap:28px}
.win .wh{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
.pj{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.6vw,20px)}
.pc{display:grid;gap:14px;align-content:start;color:inherit;text-decoration:none}
.pc .im{aspect-ratio:4/3;display:grid;place-items:center;position:relative;overflow:hidden}
.pc .im span{font:700 clamp(24px,2.6vw,38px)/1 var(--f-body);letter-spacing:-.04em}
.pc .im i{position:absolute;left:12px;top:10px;font:400 10.5px var(--f-mono);letter-spacing:.08em;text-transform:uppercase;font-style:normal;opacity:.7}
.pc .top{display:flex;justify-content:space-between}
.pc .num{font:700 clamp(40px,4.4vw,64px)/1 var(--f-body);letter-spacing:-.05em;font-variant-numeric:tabular-nums}
.pc p{font-size:15px;color:var(--mut)}
.pc:hover h3{text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:4px}
/* 05.3 what we build */
.wb{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(16px,2vw,28px)}
.wb>div{border:1px solid var(--ln);padding:clamp(20px,2.6vw,32px);display:grid;gap:22px;align-content:start}
.wb .hd{display:flex;justify-content:space-between;align-items:center}
.wb .sw{display:inline-block;width:12px;height:12px;border:1px solid var(--ln);vertical-align:-1px;margin-right:8px}
.wb ul{list-style:none;margin:0;padding:0;border-top:1px solid var(--ln)}
.wb li{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--ln);font-size:17px}
.wb .ai{background:var(--inv);color:var(--inv-ink);padding:18px 20px;display:grid;gap:6px}
.wb .ai b{font:650 20px/1.2 var(--f-body);letter-spacing:-.02em}
/* 05.4 how we work */
.st{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,2vw,28px);counter-reset:s}
.st>div{border-top:1.5px solid var(--ink);padding-top:16px;display:grid;gap:14px;align-content:start}
.st .n{font:500 clamp(44px,4.6vw,64px)/1 var(--f-mono);letter-spacing:-.05em}
/* G door */
.gd{padding-block:clamp(96px,12vw,180px)}
.gd .in{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end}
.gd .fno{height:clamp(110px,14vw,210px)}
.gd .ctas{margin-top:36px}
/* footer */
.ftr{background:var(--bg);color:var(--ink);padding-block:56px 40px;border-top:1px solid var(--ln)}
.ftr .in{display:grid;gap:40px}
.ftr .lg{width:min(520px,80vw)}.ftr .lg .mm{width:100%;height:auto;display:block}
.ftr .row{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:baseline}
.ftr nav{display:flex;gap:6px 22px;flex-wrap:wrap}
.ftr nav a{color:inherit;text-decoration:none}.ftr nav a:hover{text-decoration:underline}
/* corsa a tutto schermo */
.ride.shaft{position:fixed;inset:0;aspect-ratio:auto;z-index:39;border:0;cursor:default;visibility:hidden}
.ride.shaft.on{visibility:visible}
.ride .pg{display:block!important;padding:0!important;overflow:auto}
.ride .pg .pin{min-height:100%;display:grid;grid-template-rows:auto 1fr auto;padding:clamp(88px,10vw,140px) clamp(16px,4vw,56px) 40px;gap:40px;max-width:1320px;margin:0 auto}
.ride .pg .fno{height:clamp(140px,22vw,320px)}
.ride .pg h2{font:700 clamp(40px,5.6vw,84px)/.93 var(--f-body);letter-spacing:-.047em;max-width:14ch;margin:0}
.ride .pg .bk{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.ride .door{width:50.4%}
/* pulsantiera su telefono: pannello a tutta altezza */
@media (max-width:620px){
  .op .in{grid-template-columns:1fr}.op .fno{display:none}
  .op .bt{grid-template-columns:1fr}
  .pj,.wb,.st{grid-template-columns:1fr}
  .gd .in{grid-template-columns:1fr}.gd .fno{height:96px;order:-1}
  .navlift{left:0;right:0;top:60px;bottom:0;width:auto;max-height:none;padding:20px 16px calc(24px + env(safe-area-inset-bottom,0px));gap:18px;align-content:start}
  .navlift ol{gap:10px}
  .navlift li button{grid-template-columns:56px 1fr 14px;gap:16px}
  .navlift .sq{width:56px;height:56px;font-size:15px}
  .navlift li .nm{font-size:22px;letter-spacing:-.02em;opacity:.8}
  .navlift li .sw{width:14px;height:14px}
  .navlift .scr b{font-size:40px}
  .navlift .keyw{grid-template-columns:56px 1fr}.navlift .cyl{width:56px;height:56px}
  .navdim{display:none}
  body.navopen{overflow:hidden}
}
</style>
<header class="bar" id="bar" data-luce="carta"><a class="blogo" href="#top" aria-label="Mother Machine, home"><span class="lgB" data-a="heroS"><i class="lgF" aria-hidden="true">&#xE000;</i></span><span class="lgS" data-a="heroW"><i class="lgF" aria-hidden="true">&#xE000;</i></span></a><button class="dispB disp3" id="dispB" aria-label="Floors: you are on 05, Home. Open the floors panel" aria-expanded="false" aria-controls="navLift"><span class="dn"><span class="dir" id="bA"></span><span class="rl nw" id="bN"><b>05</b></span></span><span class="rl nm" id="bL"><b>Home</b></span><span class="kb" id="bK" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span></button></header>
<div class="navdim" id="navDim"></div>
<nav class="flr navlift" id="navLift" data-luce="notte" aria-label="Floors"></nav>
<main class="hm" id="top">
  <section class="hs op" data-luce="carta" data-f="05.1" data-n="Opening" id="s1"><div class="in">
    <h1>The machine behind your business.</h1>
    <div class="fno" aria-label="Floor 05">{{L05}}</div>
    <div class="bt"><p class="lead">We design and build the software companies run on, and the brands they're known by.</p>
      <div class="ctas"><a class="b p" href="#g">Start with a conversation. It's free.</a><a class="lnk" href="#s2">See the work</a></div></div>
  </div></section>

  <section class="hs" data-luce="carta" data-f="05.2" data-n="Proof" id="s2"><div class="in">
    <div style="display:grid;gap:clamp(36px,4vw,56px)">
      <h2>Results, not deliverables.</h2>
      <div class="win" data-luce="notte">
        <div class="wh"><span class="mo">Window on 04 · Work</span><span class="mo mut">Concepts · example figures</span></div>
        <div class="pj">
          <a class="pc" href="#" data-go="4"><div class="top mo mut"><span>04 · No. 014</span><span>Systems</span></div><div class="im" style="background:#1F4E5F;color:#F2E9D8"><i>Concept</i><span>Birrificio Mare</span></div><h3>Orders, kegs and deliveries in one back office.</h3><div class="num">3×</div><p>orders handled per person. Example figure.</p></a>
          <a class="pc" href="#" data-go="4"><div class="top mo mut"><span>04 · No. 011</span><span>Brand</span></div><div class="im" style="background:#E9DCC4;color:#7A2E1C"><i>Concept</i><span>Forno Nove</span></div><h3>A bakery brand that works from the bag to the website.</h3><div class="num">+40%</div><p>online orders in the first season. Example figure.</p></a>
          <a class="pc" href="#" data-go="4"><div class="top mo mut"><span>04 · No. 009</span><span>Systems · Brand</span></div><div class="im" style="background:#D8E3E8;color:#14323F"><i>Concept</i><span>Lumen Lab</span></div><h3>Booking, reports and a new identity for a clinic.</h3><div class="num">12 h</div><p>saved every week on admin. Example figure.</p></a>
        </div>
      </div>
    </div>
  </div></section>

  <section class="hs" data-luce="carta" data-f="05.3" data-n="What we build" id="s3"><div class="in">
    <div style="display:grid;gap:clamp(36px,4vw,56px)">
      <h2>One studio. The inside and the outside.</h2>
      <div class="wb">
        <div><div class="hd"><h3>Systems</h3><a class="mo" href="#" data-go="2" style="color:inherit"><i class="sw" style="background:#BEC2BF"></i>Floor 02</a></div>
          <p class="mut">Inside · custom software. The tools your company runs on, built around how you actually work.</p>
          <ul><li>Product design, UI and UX</li><li>Custom software and back offices</li><li>Apps</li><li>Ecommerce</li><li>Automations</li></ul>
          <div class="ai"><span class="mo" style="opacity:.6">AI inside</span><b>We don't plug AI in. We build it in.</b><span style="font-size:15px;opacity:.75">Private AI that runs on your own machines. Your data never leaves the building.</span></div></div>
        <div><div class="hd"><h3>Brand</h3><a class="mo" href="#" data-go="3" style="color:inherit"><i class="sw" style="background:#F4F2EC"></i>Floor 03</a></div>
          <p class="mut">Outside · identity. So the company looks as good as it runs.</p>
          <ul><li>Brand identity</li><li>Websites</li><li>Art direction</li><li>Visual design</li><li>Packaging and print</li></ul></div>
      </div>
    </div>
  </div></section>

  <section class="hs" data-luce="carta" data-f="05.4" data-n="How we work" id="s4"><div class="in">
    <div style="display:grid;gap:clamp(36px,4vw,56px)">
      <h2>Three steps. One number to move.</h2>
      <div class="st">
        <div><span class="n">01</span><h3>Survey</h3><p>We sit with the people who do the work, map what slows them down and agree on the one number to move.</p></div>
        <div><span class="n">02</span><h3>Build</h3><p>We design and build in small steps you can test, so nothing arrives as a surprise.</p></div>
        <div><span class="n">03</span><h3>Run</h3><p>We keep it running and improve it as the company grows. Someone always answers.</p></div>
      </div>
    </div>
  </div></section>

  <section class="hs gd" data-luce="rosa2" data-f="G" data-n="Door to G" id="g"><div class="in">
    <div>
      <h2>Tell us what slows you down.</h2>
      <div class="ctas"><a class="b p" href="#" data-go="0">Start with a conversation. It's free.</a><span class="mo mut">The first step costs nothing.</span></div></div>
    <div class="fno" aria-label="Floor G">{{LG0}}</div>
  </div></section>
</main>
<footer class="ftr" data-luce="carta"><div class="in">
  <div class="lg" data-a="heroS"></div>
  <div class="row mo"><nav aria-label="Floors"><a href="#top">05 Home</a><a href="#" data-go="4">04 Work</a><a href="#" data-go="3">03 Brand</a><a href="#" data-go="2">02 Systems</a><a href="#" data-go="1">01 Studio</a><a href="#" data-go="0">G Contact</a></nav><span class="mut">mothermachine.studio · © 2026 Mother Machine</span></div>
</div></footer>
<div class="ride shaft" id="ride" aria-hidden="true"><div class="pg"></div><div class="door l"></div><div class="door r"></div><i class="mark"></i><div class="disp"><div class="ar"><i class="u"></i><i class="d"></i></div><div class="roll"><b>05</b></div><span class="nm">Home</span></div></div>
<script>var AS=/*ASSETS*/;var LT=/*LT*/;</script>
<script>
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/*LIFTJS*/
document.querySelectorAll('[data-a]').forEach(function(el){el.insertAdjacentHTML('afterbegin',AS[el.getAttribute('data-a')])});
var SITEF=[5,4,3,2,1,0].map(function(k){return {k:k,label:two(k),name:SITE[k][0],luce:SITE[k][1]}});
/*HDRJS*/
if(SITE[-1]&&!SITE[-1][2])SITE[-1][2]='The lab under the studio.';
var FLS=[].slice.call(document.querySelectorAll('section[data-f]')),bar=$('bar'),navL=$('navLift'),navDim=$('navDim'),curI=-1,onFloor=5;
function openNav(on){navL.classList.toggle('on',on);navDim.classList.toggle('on',on);document.body.classList.toggle('navopen',on);HDR.open(on);if(on&&innerWidth<=620)bar.classList.add('fold');else mini()}
navDim.addEventListener('click',function(){openNav(false)});
/* la corsa tra le pagine: le altre pagine sono segnaposto */
var ride=$('ride');
function drawFloor(pg,k){var d=SITE[k];pg.className='pg';pg.setAttribute('data-luce',d[1]);
  if(k===5){pg.innerHTML='';return}
  pg.innerHTML='<div class="pin hm"><div style="display:grid;gap:28px;align-content:center"><div class="fno">'+LT[two(k)]+'</div><h2>'+d[2]+'</h2></div><div class="bk"><button class="b p" data-back>Back to 05 · Home</button><span class="mo mut">This floor is next on the build list.</span></div></div>';
  pg.querySelector('[data-back]').addEventListener('click',function(){go(5)})}
var SH=Shaft(ride,SITE,drawFloor);SH.set(5);
function go(k){if(SH.busy||k===onFloor)return;openNav(false);ride.classList.add('on');ride.setAttribute('aria-hidden','false');nav.call(k);
  SH.ride(k,function(lv,dir){nav.dir(dir);nav.show(two(lv),SITE[lv][0]);HDR.dir(dir);HDR.floor(lv,SITE[lv][0])}).then(function(){onFloor=k;nav.dir(0);nav.cur(k,two(k),SITE[k][0]);bar.setAttribute('data-luce',SITE[k][1]);
    HDR.dir(0);HDR.floor(k,SITE[k][0]);
    if(k===5){ride.classList.remove('on');ride.setAttribute('aria-hidden','true');curI=-1;pickNav()}})}
var nav=Floors(navL,SITEF,{onPick:function(k){k=+k;if(k===onFloor){openNav(false);if(k===5)scrollTo({top:0,behavior:reduce?'auto':'smooth'});return}var tt=nav.call(k);setTimeout(function(){go(k)},reduce?0:tt)}});
nav.cur(5,'05','Home');
document.querySelectorAll('[data-go]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();go(+a.dataset.go)})});
$('dispB').addEventListener('click',function(e){e.stopPropagation();openNav(!navL.classList.contains('on'))});
addEventListener('keydown',function(e){if(e.key==='Escape')openNav(false)});
if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load('20px MMLogoS',''),document.fonts.load('20px MMLogoW','')]).then(function(){if(document.fonts.check('20px MMLogoS','')&&document.fonts.check('20px MMLogoW',''))document.documentElement.classList.add('mmfont')}).catch(function(){})}
function mini(){bar.classList.toggle('fold',scrollY>30||onFloor!==5)}addEventListener('scroll',mini,{passive:true});mini();
function setNav(i){var s=FLS[i];curI=i;var l=s.dataset.luce;bar.setAttribute('data-luce',l)}
function pickNav(){if(onFloor!==5)return;var y=scrollY+innerHeight*0.4,i=0;FLS.forEach(function(s,j){if(s.offsetTop<=y)i=j});if(i!==curI)setNav(i)}
addEventListener('scroll',pickNav,{passive:true});
pickNav();
</script>
