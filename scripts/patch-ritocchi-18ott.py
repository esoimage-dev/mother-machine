# Ritocchi chiesti da Eso il 18 ottobre 2026 (sera). Solo CSS, in coda a ogni pagina. Si applica una volta su src/html.
# 1. "Italiano?" piu' staccato dal numero del piano (le frecce della corsa compaiono li').
# 2. Piano corrente nella pulsantiera: niente ombra scura sotto, il quadrato e' tutto acceso.
# 3. Fine corsa: il rimbalzo delle porte non deve scoprire una riga di sfondo, le porte sono piu' alte del vano.
# 4. Logo che si rimpicciolisce nella testata: il piccolo compare prima che il grande sparisca, niente buco.
# 5. Pulsantiera aperta in cima alla pagina: il velo copre tutto lo schermo e la testata resta trasparente,
#    cosi' il logo grande non viene tagliato da una riga.
import pathlib
SRC = pathlib.Path(__file__).resolve().parent.parent / 'src/html'
CSS = ("<style>/* ritocchi 18 ottobre */"
       ".bar .lhint{margin-right:22px}"
       ".flr .fb.cur .fbt{box-shadow:0 0 0 4px rgba(244,242,236,.07),0 0 22px rgba(244,242,236,.28)}"
       ".ride.shaft .door{top:-12px;bottom:-12px}"
       ".bar .lgS{transition:opacity .14s .44s}"
       ".bar.fold .lgS{opacity:1;transition:opacity .14s .44s}"
       ".bar.fold .lgB{transition:transform .6s var(--e-carro),opacity .1s .6s}"
       "body.navopen .bar:not(.fold){z-index:42;background:transparent}"
       "body.navopen:has(.bar:not(.fold)) .navdim{top:0}"
       "@media (max-width:620px){.bar .lhint{margin-right:10px;padding:0 6px}}"
       "</style>")
for f in sorted(SRC.glob('*.html')):
    t = f.read_text(encoding='utf8')
    i = t.rfind('</body>')
    t = t[:i] + CSS + t[i:] if i > 0 else t + CSS
    f.write_text(t, encoding='utf8'); print(f.name, 'ok')
