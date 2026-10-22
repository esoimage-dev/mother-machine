/* 01 Studio: il nastro gira solo quando si vede; le regole si accendono quando passano a meta' schermo */
(function(){
  if(!('IntersectionObserver' in window))return;
  var mq=document.querySelector('.stmq');
  if(mq)new IntersectionObserver(function(es){mq.classList.toggle('on',es[0].isIntersecting)}).observe(mq);
  var li=[].slice.call(document.querySelectorAll('.strl li'));
  var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('act',e.isIntersecting)})},{rootMargin:'-46% 0px -46% 0px'});
  li.forEach(function(x){io.observe(x)});
})();
