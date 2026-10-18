/* la pulsantiera del sito: una colonna di bottoni da ascensore. Bottone quadrato col numero, il nome, cosa c'è al piano.
   Il bottone del piano dove sei è acceso, quello che chiami lampeggia pomodoro.
   LG è un bottone come gli altri, ma chiuso: accanto c'è il cilindro. Giri la chiave, LG si sblocca, lo premi e scendi nella machine room.
   Da tastiera: i numeri da 0 a 5 (o G) chiamano il piano, le frecce scorrono i bottoni. */
var Floors=function(root,floors,opt){opt=opt||{};
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DESC={5:'Back to the start',4:'Selected projects',3:'Identity, websites, UI and UX',2:'Software, apps, private AI',1:'Who we are, how we work',0:'Start a project'};
  function row(k,label,name,desc,i){return '<button class="fb" data-k="'+k+'" style="--i:'+i+'" aria-label="Floor '+label+', '+name+'"><span class="fbt" aria-hidden="true">'+label+'</span><span class="ftx"><b>'+name+'</b><span>'+desc+'</span></span></button>'}
  function dsc(f){return f.desc!=null?f.desc:(DESC[f.k]||'')}
  root.classList.add('pa');if(opt.cls)root.classList.add(opt.cls);
  root.innerHTML='<i class="fscr" aria-hidden="true"><b></b><b></b><b></b><b></b></i><div class="flist">'+floors.map(function(f,i){return row(f.k,f.label,f.name,dsc(f),floors.length-i)}).join('')+'</div>'+
    '<div class="flg">'+row(-1,'LG','Machine room','<em class="fko">Staff only</em>',0)+'<button class="cyl" aria-label="Key: unlock the machine room" aria-pressed="false"><i></i><b class="n3"></b></button></div>';
  var bs=[].slice.call(root.querySelectorAll('.fb')),lg=root.querySelector('.flg'),lgb=lg.querySelector('.fb'),cyl=lg.querySelector('.cyl'),ko=lg.querySelector('.fko'),cur=String(opt.start!=null?opt.start:5),called=null,open=false;
  function flash(el,c){el.classList.remove(c);void el.offsetWidth;el.classList.add(c)}
  /* la chiave: girata sblocca LG e resta girata; girata di nuovo richiude */
  function unlock(on){open=on;lg.classList.toggle('open',on);cyl.setAttribute('aria-pressed',on?'true':'false');ko.textContent=cur==='-1'?'You found it.':on?'Going down.':'Staff only';lgb.setAttribute('aria-label',on?'Floor LG, Machine room':'Floor LG, Machine room, locked')}
  cyl.addEventListener('click',function(){unlock(!open)});
  bs.forEach(function(b){b.addEventListener('click',function(){
    if(b===lgb&&!open){ko.textContent='Not without the key.';flash(lg,'deny');return}
    opt.onPick&&opt.onPick(b.dataset.k)})});
  unlock(false);
  addEventListener('keydown',function(e){if(!root.classList.contains('on')||e.metaKey||e.ctrlKey||e.altKey)return;var c=e.key.toLowerCase();
    if(opt.keys!==false&&(/^[0-5]$/.test(c)||c==='g')){e.preventDefault();var k=c==='g'?0:+c;opt.onPick&&opt.onPick(String(k));return}
    if(c==='arrowup'||c==='arrowdown'){e.preventDefault();var all=bs.concat(cyl),j=all.indexOf(document.activeElement);
      j=j<0?0:j+(c==='arrowdown'?1:-1);all[Math.max(0,Math.min(all.length-1,j))].focus({preventScroll:true})}});
  /* a pannello chiuso: niente chiamate in sospeso, e fuori dalla machine room la chiave torna a zero */
  new MutationObserver(function(){if(!root.classList.contains('on')){called=null;bs.forEach(function(b){b.classList.remove('call')});if(cur!=='-1'&&open)unlock(false)}}).observe(root,{attributes:true,attributeFilter:['class']});
  function lit(){bs.forEach(function(b){b.classList.toggle('cur',b.dataset.k===cur)})}
  lit();
  return {
    cur:function(k){cur=String(k);called=null;bs.forEach(function(b){b.classList.remove('call')});lit();unlock(cur==='-1')},
    call:function(k){k=String(k);if(called===k)return 0;called=k;bs.forEach(function(b){b.classList.toggle('call',b.dataset.k===k)});return RM?0:420},
    clear:function(){called=null;bs.forEach(function(b){b.classList.remove('call')})},
    dir:function(){},show:function(){},key:function(){},relock:function(){unlock(false)},el:root}};
