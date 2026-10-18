  /* LG · Machine Room, il back office (scena 5 del prototipo, dati di prova): la settimana delle call e l'ultimo ordine.
     Nel sito vero questi dati arrivano dal database; per ora sono gli stessi della scena. */
  var BUSY={'0-0':'Kai · North Dive','2-2':'Lena · Hill Farm','3-1':'Marco · Corner Bar'};
  /* la settimana in corso; nel fine settimana quella che arriva */
  var now=new Date(),wd=(now.getDay()+6)%7,mon=new Date(now.getFullYear(),now.getMonth(),now.getDate()-wd+(wd>4?7:0));
  function week(){var out=[];for(var i=0;i<5;i++){var x=new Date(mon);x.setDate(mon.getDate()+i);out.push(x)}return out}
  function free(dt){var P=[[0,1,3],[1,2],[0,2,3],[],[3],[0,1,2,3],[1,3]];return P[dt.getDate()%7].map(function(i){return SL[i]})}
  (function(){
    var days=week(),di=1,si=1;
    document.querySelector('.mrwl').textContent='Week of '+days[0].getDate()+' '+M[days[0].getMonth()];
    var h='<div class="hd"></div>'+days.map(function(x){return '<div class="hd">'+W[x.getDay()]+' '+x.getDate()+'</div>'}).join('');
    SL.forEach(function(s,r){h+='<div class="tm">'+s+'</div>';days.forEach(function(x,c){var k=c+'-'+r;
      if(c===di&&r===si)h+='<div><span class="sl r">'+S.name+' · to confirm</span></div>';
      else if(BUSY[k])h+='<div><span class="sl c">'+BUSY[k]+'</span></div>';else if(free(x).indexOf(s)<0)h+='<div><span class="sl bk">Booked</span></div>';else h+='<div><span class="fr"></span></div>'})});
    document.querySelector('.wk').innerHTML=h;
    var d=days[di];
    document.querySelector('.mrc').innerHTML=W[d.getDay()]+' '+d.getDate()+' '+M[d.getMonth()]+', '+SL[si]+' our time · <em>waiting for confirmation</em>';
    document.querySelector('.bneed').textContent='Back office';
    var q=document.querySelector('.bpain');q.hidden=false;q.textContent='"We take bookings by phone and copy them into a spreadsheet."';
    [].slice.call(document.querySelectorAll('.mrdet')).forEach(function(e){e.style.display='none'});
    var p=document.querySelector('.push');p.querySelector('span').textContent='Sarah Miller, Bloom Café · call '+W[d.getDay()]+' '+SL[si];
    setTimeout(function(){p.classList.add('on')},1400);setTimeout(function(){p.classList.remove('on')},6200);
  })();

