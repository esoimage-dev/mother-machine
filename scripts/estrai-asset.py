# Porta fuori dalle pagine i pezzi pesanti e ripetuti, senza cambiarne il comportamento:
# font base64 -> public/fonts/*.woff2, script di dati condivisi (AS, LG) -> public/js/*.js
# Uso: python3 scripts/estrai-asset.py   (lavora su src/html, idempotente)
import re, hashlib, base64, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src/html'
FONTS = ROOT / 'public/fonts'
JS = ROOT / 'public/js'
FONTS.mkdir(parents=True, exist_ok=True)
JS.mkdir(parents=True, exist_ok=True)

face = re.compile(r'@font-face\s*\{[^}]*\}')
data = re.compile(r'url\(\s*["\']?data:font/woff2[^,]*;base64,([A-Za-z0-9+/=]+)["\']?\s*\)')
fam = re.compile(r'font-family\s*:\s*["\']?([^;"\'}]+)')
wgt = re.compile(r'font-weight\s*:\s*([^;}]+)')
datajs = re.compile(r'<script>(var (AS|LG)=.*?)</script>', re.S)

seen = {}

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def fix_face(m):
    block = m.group(0)
    d = data.search(block)
    if not d:
        return block
    raw = base64.b64decode(d.group(1))
    h = hashlib.sha1(raw).hexdigest()[:8]
    f = fam.search(block)
    w = wgt.search(block)
    # stesso file sotto due nomi di famiglia: un solo .woff2, nominato dalla prima famiglia trovata
    if h not in seen:
        name = slug(f.group(1) if f else 'font') + ('-' + slug(w.group(1)) if w else '')
        seen[h] = FONTS / f'{name}-{h}.woff2'
        seen[h].write_bytes(raw)
    out = seen[h]
    return block[:d.start()] + f'url(/fonts/{out.name})' + block[d.end():]

def fix_js(m):
    body, key = m.group(1), m.group(2)
    h = hashlib.sha1(body.encode()).hexdigest()[:8]
    out = JS / f'{key.lower()}-{h}.js'
    out.write_text(body, encoding='utf8')
    return f'<script src="/js/{out.name}"></script>'

for page in sorted(SRC.glob('*.html')):
    t = page.read_text(encoding='utf8')
    before = len(t)
    t = face.sub(fix_face, t)
    t = datajs.sub(fix_js, t)
    page.write_text(t, encoding='utf8')
    print(f'{page.name}: {before // 1024} KB -> {len(t) // 1024} KB')
