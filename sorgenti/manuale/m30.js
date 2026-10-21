/* la home dal vivo: la pagina vera dentro due finestre, desktop e telefono; si carica solo quando arriva vicino */
(function(){var F=[].slice.call(document.querySelectorAll('iframe[data-live]'));if(!F.length)return;var url=null;
  function src(){if(url)return url;var b=atob(document.getElementById('homeB64').textContent.trim()),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);url=URL.createObjectURL(new Blob([u],{type:'text/html;charset=utf-8'}));return url}
  function fit(){F.forEach(function(f){var p=f.parentNode;f.style.transform='scale('+(p.clientWidth/parseFloat(getComputedStyle(f).width)).toFixed(4)+')'})}
  fit();addEventListener('resize',fit);
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var f=e.target;if(e.isIntersecting){if(!f.classList.contains('on')){f.src=src();f.classList.add('on')}}})},{rootMargin:'300px 0px'});
  F.forEach(function(f){io.observe(f)})})();
