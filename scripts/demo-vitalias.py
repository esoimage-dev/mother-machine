#!/usr/bin/env python3
"""Mother Machine · monta la demo di Vitalia's Pizza on Wheels in public/demo/vitalias.

Prende le pagine vere dal repository del cliente (prenotazione, conferma, Control Room) e le collega a un server
finto che gira nel browser (scripts/demo/vitalias-api.js). Niente Google Maps (la chiave e' del cliente), niente
service worker, niente pagamenti o mail veri. Le impostazioni (prezzi, menu, zone) sono quelle di default del
cliente, lette dal suo _settings.mjs.

Uso: python3 scripts/demo-vitalias.py /percorso/vitalias-pizza-on-wheels
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1] if len(sys.argv) > 1 else '/home/user/vitalias-pizza-on-wheels')
OUT = ROOT / 'public/demo/vitalias'


def una(t, old, new, cosa):
    assert t.count(old) == 1, f'{cosa}: trovato {t.count(old)} volte'
    return t.replace(old, new)


def impostazioni():
    js = ("import { normalizeSettings, DEFAULTS } from " + json.dumps(str(SRC / 'netlify/functions/_settings.mjs')) +
          "; process.stdout.write(JSON.stringify(normalizeSettings(DEFAULTS)))")
    out = subprocess.run(['node', '--input-type=module', '-e', js], capture_output=True, text=True, check=True).stdout
    s = json.loads(out)
    s['contact'] = dict(s.get('contact') or {}, abn='00 000 000 000')   # nella demo nessun dato fiscale vero
    return s


def comune(t):
    t = re.sub(r'<script[^>]*maps\.googleapis\.com[^>]*></script>\s*', '', t)        # chiave Maps del cliente: via
    t = re.sub(r'<link rel="manifest"[^>]*>\s*', '', t)
    t = t.replace('src="/menu-data.js"', 'src="menu-data.js"').replace('src="/site-common.js"', 'src="site-common.js"')
    t = t.replace('href="/apple-touch-icon.png"', 'href="favicon.svg"')
    for pagina in ('terms-and-conditions', 'refund-policy', 'cookie-policy', 'privacy-policy'):
        t = t.replace(f'href="/{pagina}.html"', 'href="#"').replace(f'href="{pagina}.html"', 'href="#"').replace(f"'/{pagina}.html'", "'#'")
    t = t.replace('href="index.html"', 'href="booking.html"')
    t = re.sub(r'href="(tel:|https://wa\.me/|mailto:)[^"]*"', 'href="#"', t)   # nella demo non si chiama il cliente vero
    t = t.replace('https://wa.me/61470489661', '#')
    t = t.replace('src="https://cdn.jsdelivr.net/npm/flatpickr"', 'src="flatpickr.min.js"')   # flatpickr 4.6.13, copia nostra
    t = t.replace('href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"', 'href="flatpickr.min.css"')
    i = t.find('<head>') + len('<head>')
    assert i > len('<head>') - 1, 'head'
    return t[:i] + '\n<meta name="robots" content="noindex"><script src="demo-api.js"></script>' + t[i:]


def main():
    assert (SRC / 'tony.html').exists(), f'repository del cliente non trovato in {SRC}'
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    api = (ROOT / 'scripts/demo/vitalias-api.js').read_text(encoding='utf8')
    api = una(api, '/*SETTINGS*/{}/*SETTINGS*/', json.dumps(impostazioni(), ensure_ascii=False), 'impostazioni')
    (OUT / 'demo-api.js').write_text(api, encoding='utf8')
    shutil.copy(ROOT / 'scripts/demo/vitalias-tony.js', OUT / 'demo-tony.js')

    for f in ('flatpickr.min.js', 'flatpickr.min.css'):
        shutil.copy(ROOT / 'scripts/demo/vendor' / f, OUT / f)
    for f in ('menu-data.js', 'site-common.js', 'favicon.svg', 'vitalias-logo-white.svg', 'cursor-icon.svg'):
        shutil.copy(SRC / f, OUT / f)

    b = comune((SRC / 'booking.html').read_text(encoding='utf8'))
    (OUT / 'booking.html').write_text(b, encoding='utf8')

    c = comune((SRC / 'confirmed.html').read_text(encoding='utf8'))
    c = una(c, 'src="hero-truck.png"', 'src="hero-truck.webp"', 'foto del truck')
    shutil.copy(SRC / 'hero-truck.webp', OUT / 'hero-truck.webp')
    (OUT / 'confirmed.html').write_text(c, encoding='utf8')

    t = comune((SRC / 'tony.html').read_text(encoding='utf8'))
    t = t.replace('fetch("/vitalias-logo-white.svg"', 'fetch("vitalias-logo-white.svg"')
    t = t.replace("navigator.serviceWorker.register('/sw.js')", "Promise.reject(new Error('demo'))")
    i = t.rfind('</body>')
    t = t[:i] + '<script src="demo-tony.js"></script>\n' + t[i:]
    (OUT / 'tony.html').write_text(t, encoding='utf8')

    for f in OUT.iterdir():
        print(f'{f.name:28} {f.stat().st_size // 1024:6} KB')


if __name__ == '__main__':
    main()
