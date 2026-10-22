/* Mother Machine · 02 Systems: il turno di notte e il registro di bordo (arrivati da LG il 23 ottobre).
   Girano solo quando la loro sezione si vede; con prefers-reduced-motion resta un fotogramma fermo. */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* un ciclo a tempo per sezione, acceso solo quando la sezione e' sullo schermo */
  function engine(sec, ms, f) {
    var on = false, id = 0;
    function set(v) { if (v === on) return; on = v; sec.classList.toggle('sy-off', !v); if (v) id = setInterval(f, ms); else clearInterval(id) }
    sec.classList.add('sy-off');
    if (RM) return;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { set(es[0].isIntersecting) }, { rootMargin: '60px' }).observe(sec);
    else set(true);
  }

  /* ---- il turno di notte: la lancetta fa il giro delle 24 ore in 30 secondi, i lavori si accendono alla loro ora ---- */
  var sec = document.getElementById('y6');
  if (sec) {
    var hand = sec.querySelector('.synh'), lab = sec.querySelector('.syndial b'), jobs = [].slice.call(sec.querySelectorAll('.synj li'));
    var DAY = 30000, t = 90 / 1440 * DAY;
    var paint = function (ms) {
      var m = Math.floor(ms / DAY * 1440) % 1440;
      hand.style.rotate = (180 + m / 1440 * 360) + 'deg';
      lab.textContent = ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (Math.floor(m / 10) * 10 % 60)).slice(-2);
      jobs.forEach(function (j) { var a = +j.dataset.t; j.classList.toggle('on', m >= a && m < a + 45); j.classList.toggle('done', m >= a + 45 && m < 540) });
    };
    if (RM) paint(200 / 1440 * DAY); else { paint(t); engine(sec, 50, function () { t = (t + 50) % DAY; paint(t) }) }
  }

  /* ---- il registro di bordo: le righe si scrivono una lettera alla volta ---- */
  var log = document.getElementById('sylog'), pre = log && log.querySelector('pre');
  if (pre) {
    var RUNS = [
      ['$ machine check --security', '  access by role ....... ok', '  every change ......... logged', '  backups .............. today', '  your data ............ your server'],
      ['$ machine deploy', '  tests ................ pass', '  page load ............ 0.6 s', '  phones, bad signal ... ok', '  release .............. live'],
      ['$ machine watch', '  uptime ............... 99.98%', '  errors today ......... 0', '  alert to the team .... armed']
    ];
    var draw = function (lines, cur) {
      pre.innerHTML = lines.map(function (l, i) {
        var h = l.replace(/&/g, '&amp;').replace(/</g, '&lt;');
        if (h.charAt(0) === '$') h = '<em>$</em><b>' + h.slice(1) + '</b>';
        else h = h.replace(/(\.{2,} )(.+)$/, '$1<b>$2</b>');
        return h + (i === lines.length - 1 && cur ? '<i></i>' : '');
      }).join('\n');
    };
    if (RM) draw(RUNS[0], false);
    else {
      var run = 0, ln = 0, ch = 0, out = [], wait = 0;
      draw([], true);
      engine(log.closest('section'), 26, function () {
        if (wait > 0) { wait -= 26; return }
        var R = RUNS[run];
        if (ln >= R.length) { run = (run + 1) % RUNS.length; ln = 0; ch = 0; out = []; return }
        var full = R[ln];
        if (ch === 0) out.push('');
        ch += full.charAt(0) === '$' ? 1 : 3;
        out[ln] = full.slice(0, ch);
        if (ch >= full.length) { ln++; ch = 0; wait = ln >= R.length ? 2800 : (ln === 1 ? 500 : 200) }
        draw(out, true);
      });
    }
  }
})();
