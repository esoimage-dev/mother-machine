/* le copertine si scalano sulla loro larghezza */
(function(){var V=[].slice.call(document.querySelectorAll('.wv'));function fit(){V.forEach(function(v){v.style.setProperty('--k',(v.clientWidth/384).toFixed(4))})}fit();addEventListener('resize',fit);if(window.ResizeObserver)new ResizeObserver(fit).observe(document.body)})();
/* i numeri dei lavori contano fino al loro valore quando entrano nello schermo */
(function(){var N=[].slice.call(document.querySelectorAll('.wn b[data-v]'));if(!N.length)return;
  var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function run(b){var v=+b.dataset.v,p=b.dataset.p||'',s=b.dataset.s||'',t0=null;if(rm){return}
    function f(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/1100),e=1-Math.pow(1-k,3);b.textContent=p+Math.round(v*e)+s;if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
  if(!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);run(e.target)}})},{threshold:.6});
  N.forEach(function(b){if(!rm)b.textContent=(b.dataset.p||'')+'0'+(b.dataset.s||'');io.observe(b)})})();
