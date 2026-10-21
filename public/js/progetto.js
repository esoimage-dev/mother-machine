/* Mother Machine · pagina progetto: il video del truck gira solo quando si vede (e mai con riduzione del movimento). */
(function () {
  var v = document.querySelector('.clg video');
  if (!v || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { v.preload = 'metadata'; return }
  new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}) } else v.pause();
  }, { threshold: .25 }).observe(v);
})();
