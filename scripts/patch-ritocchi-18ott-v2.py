# Sostituisce il blocco "ritocchi 18 ottobre" con la versione corretta e sistema il suggerimento della lingua.
# Logo grande/piccolo: i due disegni si danno il cambio solo quando sono sovrapposti e uno dei due e' pieno,
# cosi' non c'e' mai un istante in cui sono tutti e due mezzi trasparenti.
#   si piega:  il grande si rimpicciolisce (0,6 s) e atterra esattamente sul piccolo (posizione misurata al pixel);
#              il piccolo compare sopra (0,52-0,62 s), poi il grande se ne va sotto il piccolo gia' pieno (0,62-0,70 s).
#   si riapre: il grande torna pieno subito sotto il piccolo, il piccolo sfuma (0-0,12 s), poi il grande cresce (dopo 0,1 s).
# Testata: quando il logo e' grande la testata e' trasparente sempre (stesso colore della pagina sotto),
#   quindi aprendo la pulsantiera il velo copre tutto e non compare nessuna riga, neanche per un attimo.
# Lingua: il suggerimento resta anche a pulsantiera aperta; dura 3 minuti di visita, poi sparisce da solo.
import pathlib, re
SRC = pathlib.Path(__file__).resolve().parent.parent / 'src/html'
NEW = ("<style>/* ritocchi 18 ottobre */"
       ".bar .lhint{margin-right:22px}"
       ".flr .fb.cur .fbt{box-shadow:0 0 0 4px rgba(244,242,236,.07),0 0 22px rgba(244,242,236,.28)}"
       ".ride.shaft .door{top:-12px;bottom:-12px}"
       ".bar:not(.fold) .lgB{transition:transform .6s var(--e-carro) .1s,opacity 0s}"
       ".bar:not(.fold) .lgS{transition:opacity .12s}"
       ".bar.fold .lgS{transition:opacity .1s .52s}"
       ".bar.fold .lgB{transition:transform .6s var(--e-carro),opacity .08s .62s}"
       ".bar.fold .lgB{transform:translate(.5px,-8.69px) scale(.4877)}"
       ".bar{z-index:41}.bar:not(.fold){background:transparent}"
       ".navdim{top:0}"
       "@media (max-width:620px){.bar .lhint{margin-right:10px;padding:0 6px}.bar.fold .lgB{transform:translate(.42px,-6.07px) scale(.6391)}}"
       "</style>")
OLD_HINT = "setTimeout(function(){if(cur===want)return;try{sessionStorage.setItem('mm-lhint','1')}catch(e){}\n      sg.hidden=false;"
NEW_HINT = ("var T=180000,t0=Date.now();try{t0=+sessionStorage.getItem('mm-lhint-t0')||t0}catch(e){}\n"
            "    setTimeout(function(){if(cur===want)return;var left=T-(Date.now()-t0);if(left<=0)return;\n"
            "      try{sessionStorage.setItem('mm-lhint','1');sessionStorage.setItem('mm-lhint-t0',String(t0))}catch(e){}\n"
            "      setTimeout(hideSug,left);sg.hidden=false;")
for f in sorted(SRC.glob('*.html')):
    t = f.read_text(encoding='utf8')
    t, n = re.subn(r"<style>/\* ritocchi 18 ottobre \*/.*?</style>", NEW, t, flags=re.S)
    assert n == 1, (f.name, 'blocco')
    if OLD_HINT in t:
        assert t.count(OLD_HINT) == 1
        t = t.replace(OLD_HINT, NEW_HINT)
        t = t.replace(".lsug-off .bar .lhint{opacity:0;pointer-events:none}", "")
    f.write_text(t, encoding='utf8'); print(f.name, 'ok')
