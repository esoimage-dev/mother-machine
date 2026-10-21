#!/usr/bin/env python3
"""Mother Machine · monta la demo di Vitalia's Italian Restaurant in public/demo/ristorante.

Prende le pagine vere dal repository del cliente (pagina Functions, grazie, back office "tony", menu da stampare) e le
collega a un server finto che gira nel browser (scripts/demo/ristorante-api.js). Niente service worker, niente
manifest, niente contatore di visite verso il server, niente mail, Stripe o PDF dal server: il PDF del menu lo scrive
il browser con il codice del cliente (lib/pdf.mjs), montato qui dentro demo-api.js. Il carattere con licenza delle
lavagne (George) non si copia: nella demo lo sostituisce Playfair. I caratteri cinesi e giapponesi (14 MB) restano fuori.

Uso: python3 scripts/demo-ristorante.py /percorso/vitalia-restaurant
"""
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1] if len(sys.argv) > 1 else '/home/user/vitalia-restaurant')
OUT = ROOT / 'public/demo/ristorante'
FN = SRC / 'netlify/functions'

PAGINE = ('functions.html', 'thank-you.html', 'tony.html', 'print-menu.html')
CSS = ('site.css', 'functions.css', 'pages.css', 'print-menu.css')
JS = ('site.js', 'functions.js', 'print-menu.js')
MENU = ('dinner', 'lunch', 'drinks', 'focacce')
FUORI = re.compile(r'NotoSerif(SC|JP)|assets/(social|icons)/')       # pesanti o inutili nella demo


def una(t, old, new, cosa):
    assert t.count(old) == 1, f'{cosa}: trovato {t.count(old)} volte'
    return t.replace(old, new)


def modulo(path, via=()):
    """Un file .mjs del cliente come codice da browser: senza import ed export."""
    t = (FN / path).read_text(encoding='utf8')
    t = re.sub(r'^import [^;]+;\n', '', t, flags=re.M)
    t = re.sub(r'^export (function|const|async function) ', r'\1 ', t, flags=re.M)
    for old, new in via:
        t = una(t, old, new, path)
    # niente trattino lungo nemmeno nel codice copiato: nelle stringhe diventa l'escape, nei commenti un trattino
    return t.replace("'\u2014'", "'\\u2014'").replace('\u2014', '-')


def libreria():
    """clean (lib/store.mjs), lo schema dei menu (lib/menu-schema.mjs) e il PDF del menu (lib/pdf.mjs con il logo)."""
    store = (FN / 'lib/store.mjs').read_text(encoding='utf8')
    m = re.search(r'export function clean\(.*?\n}\n', store, re.S)
    assert m, 'clean'
    clean = m.group(0).replace('export ', '')
    return ('\n' + clean +
            'var buildMenuPdf = (function () {\n' + modulo('lib/logo.mjs') + modulo('lib/pdf.mjs') + 'return buildMenuPdf;\n})();\n' +
            'var schema = (function () {\n' + modulo('lib/menu-schema.mjs') + 'return { normaliseMenu: normaliseMenu, MENU_IDS: MENU_IDS };\n})();\n' +
            'return { clean: clean, buildMenuPdf: buildMenuPdf, normaliseMenu: schema.normaliseMenu, MENU_IDS: schema.MENU_IDS };\n')


def comune(t, nome):
    t = re.sub(r'<link rel="(manifest|apple-touch-icon|canonical)"[^>]*>\s*', '', t)
    t = re.sub(r'<meta name="robots"[^>]*>\s*', '', t)
    t = re.sub(r'<meta (property="og:|name="twitter:)[^>]*>\s*', '', t)
    if nome != 'tony.html':     # nel back office i contatti sono quelli inventati delle richieste
        t = re.sub(r'href="(tel:|https://wa\.me/|mailto:)[^"]*"', 'href="#"', t)   # nella demo non si chiama il ristorante vero
    # le pagine che non sono nella demo: il link resta, ma non porta fuori
    t = re.sub(r'href="([a-z0-9-]+\.html)[^"]*"', lambda m: m.group(0) if m.group(1) in PAGINE else 'href="#"', t)
    i = t.find('<head>') + len('<head>')
    assert i > len('<head>') - 1, 'head'
    return t[:i] + '\n<meta name="robots" content="noindex"><script src="demo-api.js"></script>' + t[i:]


def main():
    assert (SRC / 'tony.html').exists(), f'repository del cliente non trovato in {SRC}'
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / 'data').mkdir(parents=True)

    api = (ROOT / 'scripts/demo/ristorante-api.js').read_text(encoding='utf8')
    api = una(api, '/*SETMENUS*/{}/*SETMENUS*/', json.dumps(json.loads((SRC / 'data/set-menus.json').read_text(encoding='utf8')), ensure_ascii=False), 'menu fissi')
    api = una(api, '/*LIB*/', libreria(), 'libreria')
    (OUT / 'demo-api.js').write_text(api, encoding='utf8')
    shutil.copy(ROOT / 'scripts/demo/ristorante-tony.js', OUT / 'demo-tony.js')
    shutil.copy(SRC / 'favicon.svg', OUT / 'favicon.svg')
    for k in MENU:      # i menu veri, pubblici: il server finto li legge quando il back office non ne ha salvato uno
        shutil.copy(SRC / f'data/{k}.json', OUT / f'data/{k}.json')

    testi = {}
    for f in CSS:
        testi[f'css/{f}'] = (SRC / 'css' / f).read_text(encoding='utf8')
    for f in JS:
        t = (SRC / 'js' / f).read_text(encoding='utf8')
        t = t.replace("'/assets/", "'assets/").replace('url(/assets/', 'url(assets/')       # tutto sotto /demo/ristorante/
        if f == 'print-menu.js':
            # i caratteri cinesi e giapponesi pesano 14 MB: nella demo il menu in quelle lingue usa quelli di sistema
            t, n = re.subn(r"\s*\"@font-face\{font-family:'Noto Serif (SC|JP)'[^\"]*\",?", '', t)
            assert n == 4, f'Noto Serif: {n}'
        if f == 'functions.js':
            t = una(t, '<a class="btn btn-ghost" href="tel:0740000865">', '<a class="btn btn-ghost" href="#">', 'telefono')
            t = una(t, 'href="menus.html"', 'href="#"', 'menu')
        testi[f'js/{f}'] = t
    for p in PAGINE:
        t = comune((SRC / p).read_text(encoding='utf8'), p)
        if p == 'tony.html':
            t = una(t, "navigator.serviceWorker.register('/sw.js')", "Promise.reject(new Error('demo'))", 'service worker')
            i = t.rfind('</body>')
            t = t[:i] + '<script src="demo-tony.js"></script>\n' + t[i:]
        testi[p] = t

    # le immagini e i caratteri che le pagine usano davvero, piu' i QR delle lavagne
    usati = set()
    for t in testi.values():
        usati.update(re.findall(r'(?<!\.au/)assets/[A-Za-z0-9._/-]+\.(?:webp|png|jpe?g|svg|ttf|woff2?)', t))   # non gli indirizzi assoluti dei meta
    for k in MENU:
        usati.update(re.findall(r'assets/[A-Za-z0-9._/-]+\.(?:webp|png|jpe?g|svg)', (SRC / f'data/{k}.json').read_text(encoding='utf8')))
    usati.update(f'assets/print/qr-{k}.svg' for k in ('book', 'ja', 'zh'))
    usati = sorted(a for a in usati if not FUORI.search(a) and (SRC / a).exists())
    for a in usati:
        (OUT / a).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(SRC / a, OUT / a)
    # css/site.css punta al cursore con ../assets: resta giusto perche' la cartella css e' accanto ad assets
    for nome, t in testi.items():
        (OUT / nome).parent.mkdir(parents=True, exist_ok=True)
        (OUT / nome).write_text(t, encoding='utf8')

    # nella demo niente trattino lungo, neanche nei testi copiati dal cliente
    for f in OUT.rglob('*'):
        if f.suffix in ('.html', '.js', '.css', '.json') and f.is_file():
            t = f.read_text(encoding='utf8')
            if '\u2014' in t:
                f.write_text(t.replace(' \u2014 ', ' - ').replace('\u2014', '-'), encoding='utf8')

    tot = sum(f.stat().st_size for f in OUT.rglob('*') if f.is_file())
    for f in sorted(OUT.iterdir()):
        if f.is_file():
            print(f'{f.name:28} {f.stat().st_size // 1024:6} KB')
    print(f'{len(usati)} file in assets, totale {tot // 1024} KB')


if __name__ == '__main__':
    main()
