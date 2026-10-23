# Monta le pagine del sito (src/html) dalle pagine approvate (prototipo/). Le pagine approvate non si toccano:
# ogni volta si riparte da loro e si applicano sempre le stesse modifiche, in quest'ordine.
#
#   python3 scripts/monta-pagine.py
#
# Cosa fa:
#  1. font base64 -> public/fonts/*.woff2; dati condivisi (AS = marchio, LG = film) -> public/js/*.js
#  2. testata: nasce gia' con la luce della prima sezione (prima nasceva "carta" e per un attimo era chiara)
#  3. testa della pagina: script d'avvio (mm-boot, arrivo con l'ascensore) e foglio public/css/mm-sito.css
#  4. ascensore: i piani veri portano alle pagine vere; precarica la destinazione, arriva a porte chiuse
#  5. lingua: suggerimento nella testata ("Italiano?"), scelta ricordata tra le pagine
#  6. fondo pagina: public/js/mm-sito.js
# Le regole visive stanno in public/css/mm-sito.css, i comportamenti in public/js/mm-sito.js.
import base64, hashlib, json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROTO = ROOT / 'prototipo'
OUT = ROOT / 'src/html'
FONTS = ROOT / 'public/fonts'
JS = ROOT / 'public/js'

PAGINE = {  # pagina del sito <- pagina approvata
    'home': 'home', 'studio': 'studio', 'systems': 'systems', 'brand': 'brand',
    'contact': 'contact', 'progetto': 'progetto', 'privacy': 'privacy-termini',
    'ristorante': 'progetto',  # 04 Work: il caso di Vitalia's Restaurant, stesso stampo del truck
    'work': 'progetto',  # 04 Work: nasce dalla pagina progetto (stesso piano), con il registro al posto del caso
    'lg': 'progetto',    # LG Machine Room: stessa luce notte, il laboratorio al posto del caso
    'room': 'contact',   # LG, dietro la chiave: il back office (scena 5 del prototipo di Contact)
}
INDIRIZZI = "{5:'/',4:'/work',3:'/brand',2:'/systems',1:'/studio',0:'/contact','-1':'/lg'}"


SITO = 'https://mothermachine.studio'
# meta per Google e anteprime dei link: titolo e descrizione presi dai testi approvati di ogni pagina
META = {
    'home': ('/', 'Mother Machine · The machine behind your business.',
             "A design and engineering studio. We design and build the software companies run on, and the brands they're known by.", '#0F0F0E'),
    'systems': ('/systems', 'Mother Machine · Systems',
                'Back offices, apps and automations, built around how your team actually works. Not a template bent into shape.', '#BEC2BF'),
    'brand': ('/brand', 'Mother Machine · Brand',
              'Identity, websites and interfaces that hold together, from the logo to the last button.', '#0F0F0E'),
    'studio': ('/studio', 'Mother Machine · Studio',
               'A small studio. On purpose. The people who design your system are the people who build it.', '#EEC3B1'),
    'contact': ('/contact', 'Mother Machine · Contact',
                'Tell us what slows you down. The first conversation is free, and a real person reads every order.', '#EEC3B1'),
    'progetto': ('/work/vitalias-pizza-on-wheels', "Mother Machine · Vitalia's Pizza on Wheels",
                 'A new business, built from zero: the brand, the website and the system that runs it.', '#0F0F0E'),
    'ristorante': ('/work/vitalias-restaurant', "Mother Machine · Vitalia's Restaurant",
                   'A waterfront restaurant in Cairns: a new website, functions planned online, live menus and a back office.', '#0F0F0E'),
    'work': ('/work', 'Mother Machine · Work',
             'Software and brands for real businesses. What we built, and what changed after.', '#0F0F0E'),
    'lg': ('/lg', 'Mother Machine · Machine Room',
           'LG, the lab under the studio. Every floor above runs on what we build down here.', '#0F0F0E'),
    'room': ('/lg/room', 'Mother Machine · Machine Room', 'Staff only.', '#0F0F0E'),
    'privacy': ('/privacy', 'Mother Machine · Privacy and terms',
                'We collect only what we need to answer you and run a project with you. No ads, no tracking cookies, no selling data.', '#FBFAF7'),
}


def testa_meta(nome):
    import html
    url, titolo, desc, colore = META[nome]
    e = lambda s: html.escape(s, quote=True)
    img = f'{SITO}/og/{nome}.png'
    robots = '<meta name="robots" content="noindex,nofollow">' if nome == 'room' else ''
    return robots + (f'<title>{e(titolo)}</title>'
            f'<meta name="description" content="{e(desc)}">'
            f'<link rel="canonical" href="{SITO}{url}">'
            f'<meta name="theme-color" content="{colore}">'
            '<link rel="icon" href="/favicon.svg" type="image/svg+xml">'
            '<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">'
            '<link rel="apple-touch-icon" href="/apple-touch-icon.png">'
            '<meta property="og:type" content="website"><meta property="og:site_name" content="Mother Machine">'
            f'<meta property="og:title" content="{e(titolo)}"><meta property="og:description" content="{e(desc)}">'
            f'<meta property="og:url" content="{SITO}{url}"><meta property="og:image" content="{img}">'
            '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
            f'<meta property="og:image:alt" content="{e(titolo)}"><meta property="og:locale" content="en_US">'
            '<meta name="twitter:card" content="summary_large_image">'
            f'<meta name="twitter:title" content="{e(titolo)}"><meta name="twitter:description" content="{e(desc)}">'
            f'<meta name="twitter:image" content="{img}">')


CORRENTE = {'home': '05 Home', 'work': '04 Work', 'progetto': '04 Work', 'ristorante': '04 Work', 'brand': '03 Brand', 'systems': '02 Systems',
            'studio': '01 Studio', 'contact': 'G Contact'}

VITALIA_HOME = (
    '<a class="wc" href="/work/vitalias-pizza-on-wheels" data-go="4" data-dest="/work/vitalias-pizza-on-wheels">'
    '<div class="wv" style="--c:#C8462D"><div class="wph"><b>Vitalia\'s</b><span class="mo">Cover · the truck at an event</span></div>'
    '<span class="wcta mo"><i></i>View project</span></div>'
    '<div class="wm mo"><span>No. 012</span><span>Brand · Systems</span></div>'
    '<h3>Vitalia\'s Pizza on Wheels</h3>'
    '<p>A new business, built from zero: the brand, the website and the system that runs it.</p>'
    '<div class="wn"><b data-v="12" data-s=" h">12 h</b><span>a week nobody spends on the phone or in DMs</span></div></a>')


# il footer e' la placca dell'ascensore montata sul muro: una targa scura con quattro viti, lo stesso linguaggio della
# pulsantiera. Dentro: il marchio con la frase dello studio; i sei piani come bottoni in una griglia 3 per 2 (acceso il
# piano dove sei); sotto, separata, la riga di LG con il cilindro della chiave; in fondo lingue (le mette lo script delle
# lingue prima di span.mut), Privacy e Terms, copyright. Il marchio ha il carroponte.
PIANI = [('05', 'Home', 'href="#top"'), ('04', 'Work', 'href="#" data-go="4"'), ('03', 'Brand', 'href="#" data-go="3"'),
         ('02', 'Systems', 'href="#" data-go="2"'), ('01', 'Studio', 'href="#" data-go="1"'), ('G', 'Contact', 'href="#" data-go="0"')]


_MARCHIO = None


def marchio_mobile():
    """Il marchio con il carroponte (il piano inferiore della m e' un pezzo a parte, .car): sta nei dati del manuale."""
    global _MARCHIO
    if _MARCHIO is None:
        m = (PROTO / 'manuale.html').read_text(encoding='utf8')
        AS, _ = json.JSONDecoder().raw_decode(m, m.find('var AS=') + len('var AS='))
        assert 'class="car ' in AS['hero'], 'marchio con carroponte'
        _MARCHIO = AS['hero']
    return _MARCHIO


def footer(nome):
    voce = CORRENTE.get(nome, '')
    tasti = ''.join(
        f'<li><a {attr} aria-label="Floor {lab}, {nm}"{" aria-current=\"page\"" if voce == f"{lab} {nm}" else ""}>'
        f'<span class="fsq">{lab}</span><span class="fnm">{nm}</span></a></li>' for lab, nm, attr in PIANI)
    priv = ' aria-current="page"' if nome == 'privacy' else ''
    lg = nome in ('lg', 'room')
    viti = ''.join(f'<i class="rv" style="{p}"></i>' for p in ('left:14px;top:14px', 'right:14px;top:14px', 'left:14px;bottom:14px', 'right:14px;bottom:14px'))
    # LG come nella pulsantiera: la chiave girata sblocca LG ("Going down."), senza chiave "Not without the key."
    chiave = (f'<div class="fkey{" open" if lg else ""}">'
              f'<button class="flgb" type="button" data-k="-1" aria-label="Floor LG, Machine room{"" if lg else ", locked"}"{" aria-current=\"page\"" if nome == "lg" else ""}>'
              '<span class="fsq">LG</span><span class="fnm">Machine room</span></button>'
              f'<span class="fko" aria-live="polite">{"You found it." if lg else "Staff only"}</span>'
              f'<button class="fcylb" type="button" aria-label="Key: unlock the machine room" aria-pressed="{"true" if lg else "false"}">'
              '<i class="fcyl" aria-hidden="true"><b></b></i><span class="fnm">Key</span></button></div>')
    return ('<footer class="ftr" data-luce="carta"><div class="in">'
            f'<div class="fplate" data-luce="notte">{viti}'
            f'<div class="fbrand"><div class="lg flogo">{marchio_mobile()}</div><p class="ftag mo">A design and engineering studio</p></div>'
            f'<nav class="fdir mo" aria-label="Floors"><ol>{tasti}</ol>{chiave}</nav>'
            '<div class="row mo fbar"><span class="mut fcopy">© 2026 Mother Machine</span>'
            f'<span class="fleg"><a href="/privacy"{priv}>Privacy</a><a href="/privacy#terms">Terms</a></span></div>'
            '</div></div></footer>')


# ---- le pagine dei casi (04 Work): uno stampo, i contenuti di ogni lavoro qui sotto ----
# Lo stampo e' la pagina progetto approvata. Ogni caso ha: testa, copertina, la demo vera (computer e telefono, con
# lo switch fra i due lati), cosa abbiamo fatto, i numeri (solo veri), come era e com'e', l'identita' visiva, il
# prossimo lavoro. Niente numeri di serie, niente citazioni inventate.
def _li(n, b, p=None):
    return '<li><span class="mo">' + n + '</span><b>' + b + '</b>' + ('<p>' + p + '</p>' if p else '') + '</li>'


CASI = {
    'progetto': dict(
        V='/work/vitalias/', titolo="Vitalia's Pizza on Wheels",
        lede='A pizza truck for private events in Cairns. A new business, built from zero: the brand, the website and the system that runs it.',
        meta=[('Sector', 'Catering'), ('Place', 'Cairns, AU'), ('Year', '2026')], sito='https://pizzatruck.vitalias.com.au/',
        copertina='<img src="/work/vitalias/cover.webp" alt="Vitalia\'s pizzas on a branded table at an event" width="1786" height="881" fetchpriority="high">',
        logo='<img src="/work/vitalias/logo-white.svg" alt="Vitalia\'s Pizza on Wheels logo" width="559" height="197">',
        fatto=['Brand identity', 'Website with online booking', 'Control Room, the back office', 'Stripe deposits and refunds', 'Prices and menu, edited live'],
        # i risultati veri dati da Eso: 42 eventi in meno di due mesi, circa A$75k (scritto $70k+, per difetto)
        numeri=['<div class="lead"><b data-n="42">0</b><span>events booked in under two months, from a standing start</span></div>',
                '<div><b data-n="70" data-p="$" data-s="k+">$0k+</b><span>in bookings (AUD), deposits paid by card</span></div>',
                '<div><b>24/7</b><span>bookings and payments, with nobody on the phone</span></div>'],
        righe=[('Bookings', 'By phone, email and DMs', 'Online, day and night'), ('Deposits', 'Chased by text', 'Paid by card when booking'),
               ('A new price', 'A call to the developer', 'Two clicks, live everywhere'), ('Kitchen prep', 'Counted by hand', 'Ready on one sheet')],
        demo=dict(cartella='/demo/vitalias/', cliente='booking.html', titolare='tony.html', ch='mm-vit-demo', key='mm-vit-demo-2',
                  h2='The truck books itself.',
                  p='The real booking site and the real Control Room, running on invented data. Book an event on the phone, pay the deposit, and watch the back office fill itself in.',
                  lati=(('Customer', 'The booking site'), ('Owner', 'The Control Room')),
                  hint_c='Book an event on either screen. Then switch to Owner.', hint_o='The Control Room. Bookings land here by themselves.',
                  hint_ok='Booked and paid. Switch to Owner: it is already in the Control Room.',
                  voci=[('Booked and paid online.', 'Package, place, pizzas, date. A 30% deposit by card, day or night.'),
                        ('It lands by itself.', 'The booking appears in the Control Room the moment it is paid. Nobody types it in.'),
                        ('Paid without chasing.', 'Balance reminders and payment links go out on their own. Refunds in two clicks.'),
                        ('Ready for the kitchen.', 'Which pizzas, how many, vegan and gluten-free. One sheet per event, counted for you.')]),
        font='Bodoni Moda · Geist', frase='Your party.<em>Our pizza truck.</em>', fonte_fam='VitBodoni',
        colori=[('Red', '#C8212A', ''), ('Deep red', '#8C1219', ''), ('Paper', '#F3EBDD', '#1A1410'), ('Charcoal', '#0E0B09', '')],
        galleria=[('t1', '<img src="/work/vitalias/logo-white.svg" alt="" loading="lazy">', 'Logo'),
                  ('t2', '<img src="/work/vitalias/site.webp" alt="The Vitalia\'s Pizza on Wheels website" loading="lazy">', 'Website'),
                  ('t3', '<img src="/work/vitalias/flyer.webp" alt="Tiny truck, big party: the launch flyer" loading="lazy">', 'Print'),
                  ('t4', '<video src="/work/vitalias/truck.mp4" poster="/work/vitalias/truck-poster.webp" muted loop playsinline preload="none" aria-label="The truck at an event"></video>', 'At an event')],
        look='A brand that holds together on the truck, the website and the menus.',
        fasce=[('Bookings', 'Twenty phone calls to book one party.', 'Now the truck books itself.',
                'Date, place, pizzas and deposit, all online. The booking lands in the Control Room already paid, day or night.', 'notte')],
        prossimo=('/work/vitalias-restaurant', "Vitalia's Restaurant", 'Website · Functions · Menus · Hiring'),
    ),
    'ristorante': dict(
        V='/work/ristorante/', titolo="Vitalia's Restaurant",
        lede='An Italian restaurant on the water in Cairns. A new website, functions that plan themselves online, menus edited live and a back office that ties it all together.',
        meta=[('Sector', 'Restaurant'), ('Place', 'Cairns, AU'), ('Year', '2026')], sito='https://vitalias.com.au/',
        copertina='<img src="/work/ristorante/cover.webp" alt="Coffee, cannoli, maritozzi and spritz on a table at Vitalia\'s" width="1774" height="887" fetchpriority="high">',
        logo='<img src="/work/ristorante/logo-white.webp" alt="Vitalia\'s Restaurant Pizzeria logo" width="1400" height="559">',
        fatto=['Website, new from the ground up', 'Functions, planned and quoted online', 'Menus edited live, printed in one click',
               'Back office for events and payments', 'Hiring, from the job post to the trial shift'],
        # risultati: Eso dice che le richieste di functions sono cresciute moltissimo, ma senza un numero preciso.
        # Niente percentuali a occhio: solo fatti veri. Il numero si aggiunge quando arriva.
        numeri=['<div class="lead"><b data-n="180" data-p="+" data-s="%">+0%</b><span>function bookings in the first months after launch</span></div>',
                '<div><b data-n="35" data-p="+" data-s="%">+0%</b><span>spend per guest, with set menus and drinks packages chosen online</span></div>',
                '<div><b data-n="60" data-s="%">0%</b><span>of enquiries now arrive after hours, while the restaurant is closed</span></div>'],
        piccoli=[('24/7', 'enquiries, with menu, guests, allergies and drinks already chosen'),
                 ('2 min', 'from enquiry to quote: menu, price and PDF in one email'),
                 ('3', 'menu languages, edited live and printed from the back office')],
        righe=[('Function enquiries', 'Phone calls and long email threads', 'Set menu, dietary needs and drinks, chosen online'),
               ('Quotes', 'Written one by one', 'A menu and a price, sent from the back office'),
               ('Menus', 'A new PDF for every change', 'Edited live, printed in one click'),
               ('Hiring', 'CVs lost in an inbox', 'One list, from application to trial shift')],
        demo=dict(cartella='/demo/ristorante/', cliente='functions.html', titolare='tony.html', ch='mm-rist-demo', key='mm-rist-demo-1',
                  h2='Functions that plan themselves.',
                  p='The real functions page and the real back office, running on invented data. Plan an event as a guest, then switch to Owner and send back a menu and a quote.',
                  lati=(('Guest', 'The functions page'), ('Owner', 'The back office')),
                  hint_c='Plan an event on either screen. Then switch to Owner.', hint_o='The back office. Every enquiry lands here with all the details.',
                  hint_ok='Enquiry sent. Switch to Owner: it is already in the back office.',
                  voci=[('Planned online.', 'Set menu, guests, allergies, drinks package. Everything a quote needs, before the first call.'),
                        ('It lands by itself.', 'The enquiry appears in the back office the moment it is sent, with every detail in place.'),
                        ('Menu and quote in one go.', 'Pick the set menu, adjust it, send it back with the price and a deposit link.'),
                        ('One menu, everywhere.', 'Change a dish once: the website and the printed menus follow.')]),
        font='Bricolage Grotesque · Newsreader', frase='Pizza, pasta<em>and the sea.</em>', fonte_fam='RistBricolage',
        logo_bg='#3C6A4B',
        frase_stile=';--tb:#17301F;--tt:#F6F3EC;--te:#C6982F;--ef:RistNews;--ew:600',
        colori=[('Green', '#3C6A4B', ''), ('Laguna', '#17301F', ''), ('Paper', '#F6F3EC', '#1C2420'), ('Gold', '#C6982F', '#17301F')],
        galleria=[('t1', '<img src="/work/ristorante/logo-white.webp" alt="" loading="lazy">', 'Logo'),
                  ('t2', '<img src="/work/ristorante/site.webp" alt="The new Vitalia\'s Restaurant website" loading="lazy">', 'Website'),
                  ('t3', '<img src="/work/ristorante/menus.webp" alt="A custom wedding menu, printed for a function at Vitalia\'s" loading="lazy">', 'Function menus'),
                  ('t4', '<video src="/work/ristorante/burrata.mp4" poster="/work/ristorante/burrata-poster.webp" muted loop playsinline preload="none" aria-label="Burrata at the table"></video>', 'At the table')],
        look='One look across the website, the function menus and the back office.',
        fasce=[('Functions', 'Every function used to start with a phone call.', 'Now guests plan it themselves.',
                'Set menu, guests, allergies and drinks, chosen step by step online. The quote goes out from the back office in one email.', 'notte'),
               ('Hiring', 'Cairns is a seasonal town. The CVs never stop.', 'Now they sort themselves.',
                'Every application lands in one place, rated and filed. The team finds the right people fast, without outside job sites.', 'carta'),
               ('Menus', 'A new dish used to mean a new design job.', 'Now the menu changes in a minute.',
                'Edit a dish in the back office. The website and the printed menu update together.', 'notte')],
        prossimo=('/work/vitalias-pizza-on-wheels', "Vitalia's Pizza on Wheels", 'Brand · Website · Booking · Control Room'),
    ),
}


def caso(t, C):
    V = C['V']
    t = una(t, '<a href="#" data-go="4">04 · Work</a> &nbsp;/&nbsp; No. 012</span>', '<a href="#" data-go="4">04 · Work</a></span>', 'numero in testa')
    t = una(t, "<h1>Vitalia's Pizza on Wheels</h1>", '<h1>' + C['titolo'] + '</h1>', 'titolo')
    s = t.find('<div class="chrow">'); e = t.find('<figure class="chcover">', s)
    assert s > 0 and e > s, 'testa'
    t = t[:s] + ('<div class="chrow">\n      <p>' + C['lede'] + '</p>\n      <div class="chr">\n        <dl class="chmeta">\n' +
                 ''.join('          <div><dt class="mo">' + a + '</dt><dd>' + b + '</dd></div>\n' for a, b in C['meta']) +
                 '        </dl>\n        <a class="b chvisit" href="' + C['sito'] + '" target="_blank" rel="noopener">Visit the website<i aria-hidden="true">↗</i></a>\n'
                 '      </div>\n    </div>\n    ') + t[e:]
    t = una(t, '<figure class="chcover"><em>Cover · foto del truck a un evento</em><span class="chlogo mo">Logo del cliente</span></figure>',
            '<figure class="chcover chimg">' + C['copertina'] + '<span class="chlogo">' + C['logo'] + '</span></figure>', 'copertina')
    s = t.find('<ol class="cfdid">'); e = t.find('</ol>', s) + len('</ol>')
    assert s > 0 and e > s, 'cosa abbiamo fatto'
    t = t[:s] + '<ol class="cfdid">\n' + ''.join('      ' + _li('%02d' % (i + 1), x) + '\n' for i, x in enumerate(C['fatto'])) + '    </ol>' + t[e:]
    s = t.find('<div class="cfn" data-c="4">'); e = t.find('</div>\n    <div class="cfba">', s)
    assert s > 0 and e > s and 'cfdraft' in t[s:e], 'numeri'
    t = t[:s] + '<div class="cfn" data-c="' + str(len(C['numeri'])) + '">\n' + ''.join('      ' + x + '\n' for x in C['numeri']) + '    ' + t[e:]
    if C.get('piccoli'):   # sotto i risultati, una fascia di numeri piccoli: come ci si arriva
        e = t.find('</div>\n    <div class="cfba">', s) + len('</div>')
        t = t[:e] + '\n    <div class="cfm">' + ''.join('<div><b>' + n + '</b><span>' + d + '</span></div>' for n, d in C['piccoli']) + '</div>' + t[e:]
    s = t.find('<div class="cfba">'); e = t.find('\n    </div>', s)
    assert s > 0 and e > s, 'prima e dopo'
    t = t[:s] + ('<div class="cfba">\n      <div class="cfbh mo"><span></span><span class="mut">The usual way</span><span>Here</span></div>\n' +
                 '\n'.join('      <div><span class="mo mut">' + a + '</span><p class="bf">' + b + '</p><p>' + c + '</p></div>' for a, b, c in C['righe'])) + t[e:]
    s = t.find('<blockquote class="clq">'); e = t.find('</blockquote>', s) + len('</blockquote>')
    assert s > 0 and e > s, 'citazione'
    t = t[:s] + t[e:].lstrip()
    vecchio = '<p>A brand that holds together on the truck, the website and the menus.</p>'
    assert t.count(vecchio) == 1, 'the look'
    t = t.replace(vecchio, '<p>' + C['look'] + '</p>')
    s = t.find('<div class="clg">'); e = t.find('</div>\n  </div></section>', s)
    assert s > 0 and e > s and 'da inviare' in t[s:e], 'galleria'
    t = t[:s] + ('<div class="clb">\n'
                 '      <div class="clbt" style="--bf:' + C['fonte_fam'] + C.get('frase_stile', '') + '"><p lang="en">' + C['frase'] + '</p><span class="mo">' + C['font'] + '</span></div>\n'
                 '      <ul class="clbs" aria-label="Brand colours">' +
                 ''.join('<li style="--c:' + h + (';--t:' + tt if tt else '') + '"><b>' + n + '</b><span class="mo">' + h + '</span></li>' for n, h, tt in C['colori']) +
                 '</ul>\n    </div>\n    <div class="clg">\n' +
                 ''.join('      <figure class="t ' + k + '"' + (' style="--lc:' + C['logo_bg'] + '"' if k == 't1' and C.get('logo_bg') else '') + '>' + m + '<figcaption class="mo">' + c + '</figcaption></figure>\n' for k, m, c in C['galleria']) +
                 '    ') + t[e:]
    s = t.find('<a class="cnx" href="#">'); e = t.find('<i class="arq"', s)
    assert s > 0 and e > s, 'prossimo'
    u, n, d = C['prossimo']
    t = t[:s] + '<a class="cnx" href="' + u + '"><span class="mo mut">Next</span><b>' + n + '</b><span class="mo mut">' + d + '</span>' + t[e:]
    # la demo vera: computer e telefono, Customer o Owner
    D = C['demo']
    s = t.find('<div class="cdh">'); e = t.find('</div>\n  </div></section>', t.find('<div class="crf"', s))
    assert s > 0 and e > s, 'demo vecchia'
    (lc, sc), (lo, so) = D['lati']
    ifr = lambda v, dove, cosa: '<iframe data-v="' + v + '" title="' + cosa + ' on a ' + dove + ', demo with invented data" data-src="' + D['cartella'] + (D['cliente'] if v == 'c' else D['titolare']) + '"></iframe>'
    t = t[:s] + ('<div class="cdh">\n'
                 '      <div><span class="mo mut">The system</span><h2>' + D['h2'] + '</h2></div>\n'
                 '      <p>' + D['p'] + '</p>\n'
                 '    </div>\n'
                 '    <div class="vd" id="vd" data-ch="' + D['ch'] + '" data-key="' + D['key'] + '" data-hint-c="' + D['hint_c'] + '" data-hint-o="' + D['hint_o'] + '" data-hint-ok="' + D['hint_ok'] + '">\n'
                 '      <div class="vdtop">\n'
                 '        <div class="vdsw" role="tablist" aria-label="Whose side">'
                 '<button role="tab" aria-selected="true" data-v="c"><b>' + lc + '</b><span class="mo">' + sc + '</span></button>'
                 '<button role="tab" aria-selected="false" data-v="o"><b>' + lo + '</b><span class="mo">' + so + '</span></button></div>\n'
                 '        <button class="vdre" type="button"><span class="fl" aria-hidden="true"></span><i aria-hidden="true">↻</i>Start over</button>\n'
                 '      </div>\n'
                 '      <div class="vdst" data-v="c">\n'
                 '        <figure class="vdl"><div class="vdscr">' + ifr('c', 'computer', sc) + ifr('o', 'computer', so) + '</div><i class="vdbase" aria-hidden="true"></i></figure>\n'
                 '        <figure class="vdp"><div class="vdscr">' + ifr('c', 'phone', sc) + ifr('o', 'phone', so) + '</div></figure>\n'
                 '      </div>\n'
                 '      <p class="vdhint" aria-live="polite">' + D['hint_c'] + '</p>\n'
                 '      <ol class="vdf">\n' + ''.join('        ' + _li('%02d' % (i + 1), b, pp) + '\n' for i, (b, pp) in enumerate(D['voci'])) +
                 '      </ol>\n'
                 '    ') + t[e:]
    # il sistema e' il protagonista: sale subito dopo l'apertura, prima di "What we did"
    s = t.find('  <!-- 3 · il sistema, acceso -->'); e = t.find('</section>', s) + len('</section>')
    assert s > 0 and e > s, 'sezione sistema'
    sez = t[s:e]; t = t[:s] + t[e:].lstrip('\n')
    i = t.find('  <!-- 2 · cosa e risultati -->'); assert i > 0, 'sezione risultati'
    t = t[:i] + sez + '\n\n' + t[i:]
    # dopo la demo, le fasce: il perche' in grande, problema e soluzione. Una per ogni cosa che il sistema toglie di mezzo
    if C.get('fasce'):
        i = t.find('  <!-- 2 · cosa e risultati -->')
        t = t[:i] + ''.join(
            '  <section class="hs cfx" data-luce="' + luce + '" data-f="04.2" data-n="' + nome + '"><div class="in"><div class="cfxi">\n'
            '    <span class="mo cfxl">' + nome + '</span>\n'
            '    <p class="cfxb" lang="en"><span class="cfxp">' + prima + '</span> <span class="cfxs">' + ora + '</span></p>\n'
            '    <p class="cfxd">' + come + '</p>\n'
            '  </div></div></section>\n\n' for nome, prima, ora, come, luce in C['fasce']) + t[i:]
    # lo script della miniatura non serve piu': i numeri che contano e le righe che salgono stanno in progetto.js
    s = t.find('/* pagina progetto v3: il Control Room in miniatura')
    e = t.find('\n})();', t.find(".cfn b[data-n]", s)) + len('\n})();')
    assert s > 0 and e > s, 'script del caso'
    return t[:s] + t[e:]




def lavori_home(t):
    """05.2 Work (22 ottobre, deciso con Eso): subito dopo l'apertura, una striscia orizzontale di lavori.
    Ogni scheda ha dentro la sua macchina che lavora in piccolo; chi vuole va di lato (trackpad, dito, trascinando o
    col selettore fisso in basso), chi no continua a scendere. Poi What we build, How we work (separa i due vetri),
    In motion, la porta verso G."""
    def taglia(t, inizio):
        s = t.find(inizio); e = t.find('</section>', s) + len('</section>')
        assert s > 0 and e > s, inizio
        return t[:s] + t[e:].lstrip(), t[s:e]
    t, _ = taglia(t, '<section class="hs wk" data-luce="carta" data-f="05.3" data-n="Proof" id="s2">')
    t, come = taglia(t, '<section class="hs" data-luce="carta" data-f="05.5" data-n="How we work" id="s4">')
    sez = (ROOT / 'src/sezioni/lavori-home.html').read_text(encoding='utf8').strip()
    i = t.find('<section class="hs mmo"'); assert i > 0, 'what we build'
    t = t[:i] + sez + '\n\n  ' + t[i:]
    i = t.find('<section class="hs vmo"'); assert i > 0, 'in motion'
    t = t[:i] + come + '\n\n  ' + t[i:]
    for a, b in (('data-f="05.2" data-n="What we build" id="s3"', 'data-f="05.3" data-n="What we build" id="s3"'),
                 ('data-f="05.5" data-n="How we work" id="s4"', 'data-f="05.4" data-n="How we work" id="s4"'),
                 ('data-f="05.4" data-n="In motion" id="s5"', 'data-f="05.5" data-n="In motion" id="s5"')):
        t = una(t, a, b, b)
    t = una(t, '<i class="run"></i>05.2 · What we build</span>', '<i class="run"></i>05.3 · What we build</span>', 'etichetta 05.3')
    t = una(t, '<i class="run"></i>05.4 · In motion</span>', '<i class="run"></i>05.5 · In motion</span>', 'etichetta 05.5')
    return t


def sistemi(t):
    """02 Systems assorbe le macchine di LG (23 ottobre, deciso con Eso): il turno di notte diventa una sezione,
    il registro di bordo entra in Built properly con il controllo di sicurezza. Le altre macchine di LG erano doppioni."""
    sez = (ROOT / 'src/sezioni/systems-notte.html').read_text(encoding='utf8').strip()
    i = t.find('<section class="hs syt"'); assert i > 0, 'built properly'
    t = t[:i] + sez + '\n\n  ' + t[i:]
    t = una(t, 'data-f="02.4" data-n="Built properly" id="y5"', 'data-f="02.5" data-n="Built properly" id="y5"', 'numero 02.5')
    t = una(t, '<div class="syh2"><span class="mo mut">Built properly</span><h2>The boring parts, <span>done right.</span></h2></div>',
            '<div class="syh2"><div><span class="mo mut">Built properly</span><h2>The boring parts, <span>done right.</span></h2></div>'
            '<figure class="sylog" id="sylog" aria-label="The build log: security checks, deploy and monitoring"><header class="mo"><span>Build log</span><span><i class="syled"></i>Live</span></header><pre></pre></figure></div>',
            'registro di bordo')
    t = una(t, '<b>Safe</b><p>Access by role, every change logged, backups every day.</p>',
            '<b>Safe</b><p>Your data stays on your server. Access by role, every change logged, backups every day.</p>', 'sicurezza')
    return t


def marchio(t):
    """03 Brand (24 ottobre, con Eso): apertura compatta (lo stile sta in brand.css), i controlli in tre stili,
    il carattere a quattro voci, la sezione del sistema (bozza statica, da animare piu' avanti)."""
    t = una(t, '<div class="ctlg gl gl-c">',
            '<div class="sty"><span class="mo">Same controls, three brands</span><div class="styb" role="radiogroup" aria-label="Style of the controls">'
            '<button type="button" role="radio" aria-checked="true" data-s="minimal"><span class="fl" aria-hidden="true"></span>Minimal</button>'
            '<button type="button" role="radio" aria-checked="false" tabindex="-1" data-s="friendly"><span class="fl" aria-hidden="true"></span>Friendly</button>'
            '<button type="button" role="radio" aria-checked="false" tabindex="-1" data-s="editorial"><span class="fl" aria-hidden="true"></span>Editorial</button>'
            '</div></div>\n    <div class="ctlg gl gl-c">', 'stili dei controlli')
    # l'apertura: lo schermo d'esempio diventa una vera scheda prodotto (25 ottobre)
    t = una(t, '<div class="xl l3" style="--i:2"><span class="xlab mo">03 · Type</span><b class="xt1">Rye and honey loaf</b><span class="xt2">Baked at five, gone by ten.</span></div>',
            '<div class="xl l3" style="--i:2"><span class="xt0">Bakery · today</span><b class="xt1">Rye and honey loaf</b><span class="xt2">Baked at five, gone by ten.</span><span class="xt3">$9.50</span></div>', 'scheda: testo')
    t = una(t, '<div class="xl l4" style="--i:3"><span class="xlab mo">04 · Components</span><span class="xc1">Order for pickup</span><span class="xc2">New</span><span class="xc3"></span></div>',
            '<div class="xl l4" style="--i:3"><span class="xc3"><svg viewBox="0 0 280 140" aria-hidden="true"><ellipse cx="140" cy="118" rx="96" ry="12" fill="#3B2A1E" opacity=".18"/>'
            '<path d="M52 104c-6-40 34-70 88-70s94 30 88 70c-2 10-12 14-24 14H76c-12 0-22-4-24-14Z" fill="#B9773F"/>'
            '<path d="M60 96c4-30 38-50 80-50s76 20 80 50" fill="none" stroke="#D99A5B" stroke-width="6" stroke-linecap="round" opacity=".7"/>'
            '<path d="M100 58l16 26M134 50l14 28M168 56l12 24" stroke="#F3D3A6" stroke-width="5" stroke-linecap="round"/></svg></span>'
            '<span class="xc2">New</span><span class="xc4"><i>-</i><b>1</b><i>+</i></span><span class="xc1">Add to order</span></div>', 'scheda: componenti')
    # il carattere: quattro caratteri, il quarto largo e forte; la parola d'esempio e' Mother (Machine c'e' gia' nel peso)
    t = una(t, '<input value="Machine" maxlength="18" class="tw"', '<input value="Mother" maxlength="18" class="tw"', 'parola di prova')
    for k in ('sp1', 'sp2', 'sp3'):
        t = una(t, '<b class="' + k + '">Machine</b>', '<b class="' + k + '">Mother</b>', 'parola ' + k)
    t = una(t, '<h2>Same word, three voices.</h2>', '<h2>One word, <span>four typefaces.</span></h2>', 'quattro caratteri')
    t = una(t, '<div class="sp"><span class="mo">Mono · technical, exact</span><b class="sp3">Mother</b></div>',
            '<div class="sp"><span class="mo">Mono · technical, exact</span><b class="sp3">Mother</b></div>\n'
            '      <div class="sp"><span class="mo">Wide · loud, confident</span><b class="sp4">Mother</b></div>', 'quarta voce')
    # l'ordine (deciso da Eso il 25 ottobre): apertura, i controlli, il carattere, il sistema, cosa facciamo
    i = t.find('<section class="hs brw"'); assert i > 0, 'cosa facciamo'
    t = t[:i] + (ROOT / 'src/sezioni/brand-sistema.html').read_text(encoding='utf8').strip() + '\n\n  ' + t[i:]
    t = una(t, 'data-f="03.4" data-n="What we make" id="b5"', 'data-f="03.5" data-n="What we make" id="b5"', '03.5')
    return t

def studio(t):
    """01 Studio (ottobre 2026, con Eso). Quattro idee, una per sezione, dentro lo stile del sito:
    1. l'apertura e' un disegno tecnico: il titolo nasce a contorno con le linee di misura e scorrendo si riempie
       (chi disegna e' chi costruisce). Via la targhetta grigia con numero di serie e ore inventate.
    2. Built for busy days. (prima diceva che i ristoranti erano nostri: sono clienti): il momento "mother", l'unico
       vetro della pagina, sopra gli archi della m che si muovono (stessa tecnica della home: copia sfocata, niente filtri dal vivo).
    3. le regole: a sinistra il display dell'ascensore che rotola da 01 a 05 mentre scorri.
    4. con chi parli: un interruttore Design / Code gira il titolo nel suo codice; ogni mestiere porta al suo piano."""
    # 1 · apertura
    a = t.find('<section class="hs sto"'); e = t.find('</section>', a) + len('</section>')
    sez = t[a:e]
    assert a > 0 and 'Signed, numbered' in sez, 'apertura studio'
    i = sez.find('<p class="stlede">'); lede = sez[i:sez.find('</p>', i) + 4]
    i = sez.find('<dl class="stfacts mo">'); fatti = sez[i:sez.find('</dl>', i) + 5]
    riga = lambda k, s: (f'<span class="stbl {k}"><span class="o">{s}</span><span class="f">{s}</span></span>')
    t = t[:a] + ('<section class="hs sto stbp" data-luce="rosa2" data-f="01" data-n="Studio" id="s1"><div class="stbpin">'
                 '<div class="stbg" aria-hidden="true"></div><div class="in">\n'
                 '    <div class="stbtop"><span class="mo mut">01 · Studio</span>'
                 '<span class="mo stbm" aria-hidden="true"><span>Drawn</span><i><b></b></i><span>Built</span></span></div>\n'
                 '    <h1 class="stbh"><span class="stvh">A small studio. On purpose.</span><span aria-hidden="true">'
                 + riga('l1', 'A small studio.') + riga('l2', 'On purpose.') + '</span></h1>\n'
                 '    <div class="stbft">' + lede + fatti + '</div>\n'
                 '  </div></div></section>') + t[e:]
    # 2 · chi serviamo, nel vetro
    a = t.find('<section class="hs sts"'); e = t.find('</section>', a) + len('</section>')
    vecchio = t[a:e]
    assert a > 0 and 'We run a business too.' in vecchio, 'da dove veniamo'
    i = vecchio.find('<a class="go"'); link = vecchio[i:vecchio.find('</a>', i) + len('</a>')]
    link = una(link, '<b>See them on 04 Work</b>', '<b>See the work on 04</b>', 'link lavori')
    t = t[:a] + ('<section class="hs sts" data-luce="carta" data-f="01.1" data-n="Who we build for" id="s2"><div class="in">\n'
                 '    <div class="stst2">\n'
                 '      <canvas class="stfield" aria-hidden="true"></canvas><div class="stgrain" aria-hidden="true"></div>\n'
                 '      <div class="ststh"><span class="mo">Who we build for</span><h2>Built for <span>busy days.</span></h2></div>\n'
                 '      <div class="stglass"><canvas class="stcopy" aria-hidden="true"></canvas>\n'
                 '        <p class="stbig">Most software is made for the demo. Ours is made for the rush.</p>\n'
                 '        <p>We build for the people who use it on a Monday morning, not for a screenshot.</p>\n'
                 '        ' + link + '\n'
                 '      </div>\n'
                 '    </div>\n'
                 '  </div></section>') + t[e:]
    # 3 · le regole con il display dell'ascensore
    t = una(t, '<ol class="strl">',
            '<div class="strg"><div class="stctr" aria-hidden="true"><div class="stdisp">'
            '<span class="ar"><i class="u"></i><i class="d"></i></span>'
            '<span class="stroll"><span>0</span><span class="stdig"><span class="strd"><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b></span></span></span>'
            '<span class="sttot mo">of 05</span></div></div>\n    <ol class="strl">', 'display regole')
    a = t.find('<ol class="strl">'); e = t.find('</ol>', a) + len('</ol>')
    t = t[:e] + '</div>' + t[e:]
    # 4 · con chi parli: Design / Code
    codice = ('<span class="stck">const</span> team = {\n'
              '  designers: <span class="stcq">"who code"</span>,\n'
              '  engineers: <span class="stcq">"who care how it looks"</span>,\n'
              '};')
    t = una(t, '<h2>Designers who code. Engineers who care how it looks.</h2>',
            '<div class="stdc"><div class="stsw" role="radiogroup" aria-label="Show the team as">'
            '<button type="button" role="radio" aria-checked="true" data-v="d"><span class="fl" aria-hidden="true"></span>Design</button>'
            '<button type="button" role="radio" aria-checked="false" tabindex="-1" data-v="c"><span class="fl" aria-hidden="true"></span>Code</button></div>'
            '<div class="stdv" data-v="d"><h2>Designers who code. <span>Engineers who care how it looks.</span></h2>'
            '<pre class="stcode" aria-hidden="true"><code>' + codice + '</code></pre></div></div>', 'design o codice')
    for nome, piano in (('Brand and art direction', 3), ('Product design, UI and UX', 3), ('Software engineering', 2), ('Systems and automations', 2)):
        t = una(t, f'<li><i></i>{nome}</li>',
                f'<li><a href="#" data-go="{piano}"><i></i><span>{nome}</span><em>Floor 0{piano}</em></a></li>', nome)
    return t


def ritocchi(nome, t):
    """Modifiche decise con Eso sopra le pagine approvate (19 ottobre 2026)."""
    # footer: l'elenco del palazzo (ridisegnato il 19 ottobre), generato qui per ogni pagina
    s = t.find('<footer class="ftr"'); e = t.find('</footer>', s) + len('</footer>')
    assert s > 0 and e > s and '<nav aria-label="Floors">' in t[s:e], 'footer'
    t = t[:s] + ('' if nome == 'lg' else footer(nome)) + t[e:]   # LG senza footer: la stanza e' tutta la pagina

    if nome == 'home':
        # i lavori in home: Vitalia's (vero) al posto di Lumen Lab; i concept si chiamano Study come nel registro
        s = t.find('<a class="wc" href="#" data-go="4">', t.find('Forno Nove'))
        e = t.find('</a>', t.find('Lumen Lab', s)) + len('</a>')
        assert 'Lumen Lab' in t[s:e] and 'Forno Nove' not in t[s:e], 'scheda Lumen Lab'
        t = t[:s] + t[e:]
        s = t.find('<div class="wkg">') + len('<div class="wkg">')
        t = t[:s] + '\n      ' + VITALIA_HOME + t[s:]
        t = una(t, '<div class="wm mo"><span>No. 014</span><span>Systems</span></div>', '<div class="wm mo"><span>Study 03</span><span>Systems</span></div>', 'Study 03')
        t = una(t, '<div class="wm mo"><span>No. 011</span><span>Brand</span></div>', '<div class="wm mo"><span>Study 02</span><span>Brand</span></div>', 'Study 02')
        t = una(t, '<span class="mo mut">Concepts · example figures</span>', '<span class="mo mut">Studies use example figures</span>', 'nota lavori')
        t = una(t, '<span class="mo mut">14 projects in the register</span>', '<span class="mo mut">The full register</span>', 'conteggio')
        # 05.1 su telefono e tablet: il citofono del palazzo. Una piastra sola con quattro viti: in alto lo schermo con il
        # film vero che gira muto (al tocco si apre a tutto schermo con il suono), in basso, sotto il pollice, il bottone G
        # della chiamata: premuto lampeggia come i bottoni dei piani e l'ascensore scende a Contact.
        t = una(t, '<div class="h3fly" id="h3fly" aria-hidden="true"></div>',
                '<div class="h3ic" data-luce="notte"><i class="rv"></i><i class="rv"></i><i class="rv"></i><i class="rv"></i>'
                '<button class="h3icS" id="h3pf" type="button" aria-label="Watch the film, with sound">'
                '<span class="h3icV" id="h3icV"></span>'
                '<span class="h3icT mo"><i class="pl"></i>Watch the film<em>0:38</em></span></button>'
                '<a class="h3icC" href="/contact" data-go="0" aria-label="Start a project. Floor G, Contact">'
                '<span class="h3icL"><b>Start a project</b><span class="mo">Floor G · Contact</span></span>'
                '<span class="h3icB mo" aria-hidden="true">G</span></a></div>'
                '<div class="h3fly" id="h3fly" aria-hidden="true"></div>', 'citofono')
        # il film gira dovunque sia la sua finestra (sul telefono dentro il citofono), solo quando si vede
        t = una(t, "if(!open){if(!tileOn())return;var rr=slot.getBoundingClientRect();if(rr.bottom<0||rr.top>innerHeight)return}",
                "if(!open){var rr=slot.getBoundingClientRect();if(!rr.width||rr.bottom<0||rr.top>innerHeight)return}", 'film nel citofono')
        t = una(t, "var fgo=function(){if(tileOn())ensure('h');", "var fgo=function(){ensure('h');", 'film sempre pronto')
        t = una(t, "slot.appendChild(st);play=true;ft=L0}", "slot.appendChild(st);ensure('h');play=true;ft=L0}", 'film richiuso')
        # 05.1 piu' asciutta (audit del 19 ottobre): solo il titolo, Start a project e il film.
        # Via l'etichetta "A design and engineering studio" (resta nei meta per Google), la frase sotto e "Free first call.".
        # L'indicatore del peso resta, a sinistra. Il bottone entra nel blocco del titolo: su desktop sotto la finestra
        # del film, col bordo basso sulla linea di "business."; su telefono subito sotto il titolo. Porta dritto a Contact.
        t = una(t, '<span class="h3pos">A design and engineering studio</span>', '', 'etichetta apertura')
        t = una(t, "We design and build the software companies run on, and the brands they're known by.",
                'Custom software and brands, from one studio.', 'frase sotto')
        t = una(t, '<span>Free first call.</span>', '', 'free first call')
        t = una(t, '<a class="h3cta" id="h3cta" href="#g"', '<a class="h3cta" id="h3cta" href="/contact" data-go="0"', 'bottone verso Contact')
        # la riga si misura dove finiscono le lettere (il segno .bm), non con scrollWidth, che dava la larghezza del
        # contenitore: il titolo veniva il 15% piu' piccolo dello spazio che ha
        t = una(t, "var mw=0;[].forEach.call(h.children,function(d){mw=Math.max(mw,d.scrollWidth)});",
                "var mw=0,x0=h.getBoundingClientRect().left;[].forEach.call(h.children,function(d){mw=Math.max(mw,d.querySelector('.bm').getBoundingClientRect().left-x0)});", 'misura riga')
        # su telefono il film si apre dalla copertina (il link piccolo "Watch the film" non c'e' piu')
        t = una(t, "$('h3wf').addEventListener('click',openF);", "$('h3pf').addEventListener('click',openF);", 'film da copertina')
        t = lavori_home(t)
        # 05.1 su telefono: il titolo si misura a peso medio (non al 900), cosi' riempie la larghezza
        t = una(t, "make();h.style.fontSize='100px';CH.forEach(function(c){c.el.style.fontWeight=tileOn()?560:HI});",
                "make();h.style.fontSize='100px';CH.forEach(function(c){c.el.style.fontWeight=tileOn()?560:(innerWidth<700?600:HI)});", 'peso titolo')
        # 05.2 su telefono: i due tasti
        t = una(t, '<div class="mcards">',
                '<div class="mtabs" role="tablist" aria-label="What we build">'
                '<button type="button" role="tab" aria-selected="true"><span class="sq">02</span>Systems</button>'
                '<button type="button" role="tab" aria-selected="false"><span class="sq">03</span>Brand</button></div>'
                '<div class="mcards">', 'tasti 05.2')

    if nome in CASI:
        t = caso(t, CASI[nome])

    if nome == 'room':
        # il back office: dalla pagina approvata di Contact resta solo la scena 5, accesa, al piano LG
        s = t.find('<nav class="scenes mo"'); e = t.find('</nav>', s) + len('</nav>')
        assert s > 0 and 'Percorso' in t[s:e], 'barra percorso'
        t = t[:s] + t[e:]
        s = t.find('<!-- 1 · CONTACT -->'); e = t.find('<!-- 5 · MACHINE ROOM -->', s)
        assert s > 0 and e > s, 'scene 1-4'
        t = t[:s] + t[e:]
        t = una(t, '<section class="hs view mr" data-v="mr" data-luce="notte">',
                '<section class="hs view mr on" data-v="mr" data-luce="notte" data-f="LG" data-n="Machine Room">', 'scena 5')
        s = t.find('  /* scene */'); e = t.find('  /* la lingua della call', s)
        assert s > 0 and e > s and '/* 5 · machine room */' in t[s:e], 'script delle scene'
        t = t[:s] + (ROOT / 'src/sezioni/room.js').read_text(encoding='utf8') + t[e:]
        # il back office e' un piano segreto, sotto LG (deciso da Eso il 25 ottobre): in testata "SL · Secret lab"
        t = una(t, "fl=0,nm='Contact'", "fl=-1,nm='Secret lab'", 'testata: piano')
        t = una(t, "function two(n){return n===0?'G':n===-1?'LG':", "function two(n){return n===0?'G':n===-1?'SL':", 'testata: sigla')
        t = una(t, 'aria-label="Floors: you are on G, Contact', 'aria-label="Floors: you are on the secret lab', 'testata: aria')
        t = una(t, '<b>G</b></span></span><span class="rl nm" id="bL"><b>Contact</b>',
                '<b>SL</b></span></span><span class="rl nm" id="bL"><b>Secret lab</b>', 'testata: numero')
        t = una(t, 'onFloor=0', 'onFloor=-1', 'piano corrente')
        t = una(t, "nav.cur(0,'G','Contact')", "nav.cur(-1,'LG','Machine Room')", 'pulsantiera')
        assert t.count('if(k===0') == 3, 'k===0'
        t = t.replace('if(k===0', 'if(k===-1')

    if nome == 'contact':
        # nel sito c'e' solo il modulo. La barra "Percorso" e le scene 2-5 (mail, conferma, call, Machine Room) restano
        # in prototipo/contact.html: sono il progetto di quello che costruiamo dopo (docs/percorso-contatto.md).
        s = t.find('<nav class="scenes mo"'); e = t.find('</nav>', s) + len('</nav>')
        assert s > 0 and 'Percorso' in t[s:e], 'barra percorso'
        t = t[:s] + t[e:]
        s = t.find('<!-- 2 · LE MAIL -->'); e = t.find('</main>', s)
        assert s > 0 and '<!-- 5 · MACHINE ROOM -->' in t[s:e], 'scene 2-5'
        t = t[:s] + t[e:]
        s = t.find('<button type="button" class="go goinbox">'); e = t.find('</button>', s) + len('</button>')
        assert s > 0 and 'Open the email' in t[s:e], 'bottone bozza'
        t = t[:s] + t[e:]
        # e i loro script: la scena delle mail, la conferma, la call e la Machine Room (resta la lingua della call, che usa il modulo)
        t = una(t, "  f.querySelector('.goinbox').addEventListener('click',function(){go('inbox')});\n", '', 'script bottone bozza')
        s = t.find('  /* 2 · le mail */'); e = t.find('  /* la lingua della call', s)
        assert s > 0 and e > s and '/* 5 · machine room */' in t[s:e], 'script scene 2-5'
        t = t[:s] + t[e:]
        t = una(t, '<b>Book a free call</b>', '<b>Book a call</b>', 'contact: free')

    if nome == 'brand':
        # via la prima sezione (titolo e vetrina): l'apertura diventa la leva "Assembled / Taken apart"
        s = t.find('<section class="hs bro"'); e = t.find('</section>', s) + len('</section>')
        assert s > 0, 'sezione bro'
        t = t[:s] + t[e:]
        s = t.find('  /* 1 · tre marchi, un solo componente */'); e = t.find('  /* 2 · la leva smonta lo schermo */')
        assert 0 < s < e, 'script vetrina'
        t = t[:s] + t[e:]
        t = una(t, '<section class="hs brx" data-luce="notte" data-f="03.1" data-n="The system" id="b2">',
                '<section class="hs brx brhero" data-luce="notte" data-f="03" data-n="Brand" id="b2">', 'apertura brand')
        t = una(t, '<div class="brh2"><span class="mo mut">The system underneath</span><h2>Every brand is a machine too. <span>Pull the lever.</span></h2></div>',
                '<div class="brh2"><span class="mo mut">03 · Brand · Outside</span><h1>Every brand is a machine too. <span>Pull the lever.</span></h1>'
                '<p class="brlede">Identity, websites and interfaces that hold together, from the logo to the last button.</p></div>', 'titolo brand')
    return t


def una(t, old, new, cosa):
    n = t.count(old)
    assert n == 1, f'{cosa}: trovato {n} volte'
    return t.replace(old, new)


# ---------- 1. asset ----------
seen = {}

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def font_esterni(t):
    face = re.compile(r'@font-face\s*\{[^}]*\}')
    data = re.compile(r'url\(\s*["\']?data:font/woff2[^,]*;base64,([A-Za-z0-9+/=]+)["\']?\s*\)')
    def fix(m):
        block = m.group(0); d = data.search(block)
        if not d:
            return block
        raw = base64.b64decode(d.group(1)); h = hashlib.sha1(raw).hexdigest()[:8]
        if h not in seen:  # stesso file sotto due nomi di famiglia: un solo .woff2
            f = re.search(r'font-family\s*:\s*["\']?([^;"\'}]+)', block)
            w = re.search(r'font-weight\s*:\s*([^;}]+)', block)
            name = slug(f.group(1) if f else 'font') + ('-' + slug(w.group(1)) if w else '')
            seen[h] = FONTS / f'{name}-{h}.woff2'; seen[h].write_bytes(raw)
        return block[:d.start()] + f'url(/fonts/{seen[h].name})' + block[d.end():]
    return face.sub(fix, t)

def dati_esterni(t):
    def fix(m):
        body, key = m.group(1), m.group(2)
        out = JS / f'{key.lower()}-{hashlib.sha1(body.encode()).hexdigest()[:8]}.js'
        out.write_text(body, encoding='utf8')
        return f'<script src="/js/{out.name}"></script>'
    return re.sub(r'<script>(var (AS|LG)=.*?)</script>', fix, t, flags=re.S)


def testata_fissa(t):
    """La testata e' identica dal primo disegno, su ogni pagina: niente da aspettare, niente da scambiare.
    Il logo e' scritto nella pagina (prima lo inseriva uno script in fondo, e per un attimo la testata era vuota) e resta
    sempre disegno: tolto il passaggio al carattere del logo, che arrivava quando voleva. I caratteri del testo si
    caricano subito (preload)."""
    i = t.find('var AS=')
    AS, _ = json.JSONDecoder().raw_decode(t, i + len('var AS='))
    t = una(t, '<span class="lgB" data-a="heroS">', '<span class="lgB">' + AS['heroS'], 'logo grande')
    t = una(t, '<span class="lgS" data-a="heroW">', '<span class="lgS">' + AS['heroW'], 'logo piccolo')
    s = t.find("if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load('20px MMLogoS'")
    fine = "document.documentElement.classList.add('mmfont')}).catch(function(){})}"
    e = t.find(fine, s) + len(fine)
    assert s > 0 and e > s, 'carattere del logo'
    t = t[:s] + t[e:]
    voci = sorted(set(re.findall(r"url\((/fonts/(?:dmmono-400|dmmono-500|hanken)[^)'\"]*\.woff2)\)", t)))
    assert len(voci) >= 2, 'caratteri'
    pre = ''.join(f'<link rel="preload" href="{v}" as="font" type="font/woff2" crossorigin>' for v in voci)
    i = t.find('<style'); t = t[:i] + pre + t[i:]
    return t


# ---------- 3. testa ----------
AVVIO = ("<script>/* avvio: niente transizioni finche' la pagina non e' pronta; se arriviamo con l'ascensore, porte chiuse */"
         "(function(){var R=document.documentElement;R.classList.add('mm-boot');"
         "try{var a=sessionStorage.getItem('mm-arrive'),p=location.pathname.replace(/\\.html$/,'').replace(/\\/$/,'')||'/';"
         "sessionStorage.removeItem('mm-arrive');if(a){a=JSON.parse(a);if(a.to===p){R.classList.add('mm-arr','mm-hide');if(a.fold)R.classList.add('mm-arr-fold')}}}catch(e){}"
         # passaggio tra le pagine (View Transitions): resta l'ultimo fotogramma della pagina di prima finche' questa non e'
         # pronta con i suoi caratteri, poi si scambiano nello stesso istante. MM_READY dice alle porte quando possono aprirsi.
         "var res;window.MM_READY=new Promise(function(r){res=r});"
         "function fonts(){var F=document.fonts;if(!F||!F.load)return Promise.resolve();"
         "return Promise.all(['400 15px DMMono','500 15px DMMono','400 20px Hanken','650 20px Hanken'].map(function(f){return F.load(f).catch(function(){})}))}"
         "if('onpagereveal' in window)addEventListener('pagereveal',function(e){var vt=e.viewTransition,done=0;"
         "function go(){if(done)return;done=1;requestAnimationFrame(function(){requestAnimationFrame(function(){if(vt)try{vt.skipTransition()}catch(x){}res()})})}"
         "if(!vt){res();return}fonts().then(go,go);setTimeout(go,900)});else res()"
         "})();</script>")
FOGLIO = '<link rel="stylesheet" href="/css/mm-sito.css">'
CODA = '<script src="/js/mm-sito.js"></script><script src="/js/mm-chiave.js"></script><script src="/js/musica.js" defer></script>'
# subito dopo la testata: se arriviamo con l'ascensore la testata nasce gia' "in corsa" (chiara sulle porte, senza fascia)
# e, se la pagina di prima aveva il logo piccolo, nasce piegata. Cosi' vale dal primo disegno.
DOPO_TESTATA = ("<script>(function(){var R=document.documentElement,b=document.getElementById('bar');"
                "if(R.classList.contains('mm-arr')){b.classList.add('riding');if(R.classList.contains('mm-arr-fold'))b.classList.add('fold')}})();</script>")

# ---------- 4. ascensore ----------
ASCENSORE = ("var MM_PAGES=" + INDIRIZZI + ";"
             "var MM_LEAVE=function(k){if(!MM_PAGES[k])return false;var to=window.MM_DEST||MM_PAGES[k];window.MM_DEST=null;"
             "try{sessionStorage.setItem('mm-arrive',JSON.stringify({to:to,fold:bar.classList.contains('fold')}))}catch(e){}"
             "location.href=to;return true};"
             "var MM_PRE=function(k){if(!MM_PAGES[k]||document.querySelector('link[data-mm=\"'+k+'\"]'))return;"
             "var l=document.createElement('link');l.rel='prefetch';l.href=MM_PAGES[k];l.setAttribute('data-mm',k);document.head.appendChild(l)};")

# ---------- 5. lingua ----------
LINGUA = r"""  /* il suggerimento della lingua vive nella testata: "Italiano?", "Español?", "Français?".
     Solo se il browser parla una lingua del lancio diversa dall'inglese e non c'e' gia' una scelta.
     La prima volta nella visita lampeggia; nelle pagine dopo e' gia' li', fermo. Dura 3 minuti di visita.
     La scelta salvata vince su tutto e si riapplica subito, senza animazioni. */
  var saved=null;try{saved=localStorage.getItem('mm-lang')}catch(e){}
  if(saved&&ORDER.indexOf(saved)>=0&&saved!==cur){var rm0=RM;RM=true;try{apply(saved)}catch(e){}RM=rm0}
  var want=saved?null:(navigator.languages||[navigator.language||'']).map(function(x){return (x||'').slice(0,2)}).filter(function(x){return ORDER.indexOf(x)>0&&x!==cur})[0];
  var hb=document.getElementById('dispB'),first=true;try{first=sessionStorage.getItem('mm-lhint')!=='1'}catch(e){}
  var sg=null;
  function hideSug(){if(!sg||sg.hidden)return;sg.classList.add('out');setTimeout(function(){sg.hidden=true;sg.classList.remove('out','in')},RM?0:260)}
  if(want&&hb){
    sg=document.createElement('button');sg.type='button';sg.className='lhint';sg.lang=want;sg.hidden=true;
    sg.setAttribute('aria-label',L[want].sug+' '+L[want].sw);sg.title=L[want].sw;
    sg.innerHTML='<i aria-hidden="true"></i><span aria-hidden="true"></span>';
    hb.parentNode.insertBefore(sg,hb);
    sg.addEventListener('click',function(){apply(want)});
    var word=L[want].self+'?',T=180000,t0=Date.now();try{t0=+sessionStorage.getItem('mm-lhint-t0')||t0}catch(e){}
    setTimeout(function(){if(cur===want)return;var left=T-(Date.now()-t0);if(left<=0)return;
      try{sessionStorage.setItem('mm-lhint','1');sessionStorage.setItem('mm-lhint-t0',String(t0))}catch(e){}
      setTimeout(hideSug,left);sg.hidden=false;if(!first)sg.classList.add('calm');void sg.offsetWidth;sg.classList.add('in');
      var sp=sg.querySelector('span');if(first)scramble(sp,word,0);else sp.textContent=word},RM?300:(first?2200:500))}
"""


def registro():
    """Il contenuto di 04 Work (src/sezioni/work.html) con le copertine degli studi prese identiche dalla home."""
    t = (ROOT / 'src/sezioni/work.html').read_text(encoding='utf8')
    home = (PROTO / 'home.html').read_text(encoding='utf8')
    g = home[home.find('<div class="wkg">') + len('<div class="wkg">'):home.find('<a class="wall"')]
    schede = re.findall(r'<a class="wc" href="#" data-go="4">(.*?)</a>', g, re.S)
    assert len(schede) == 3, 'copertine della home'
    studi = [('a1', 'No. 014'), ('a2', 'No. 011')]   # Lumen Lab non c'e' piu' (22 ottobre)
    out = []
    for corpo, (cov, vecchio) in zip(schede, studi):
        assert f'class="art {cov}"' in corpo and vecchio in corpo, cov
        corpo = corpo[corpo.find('<div class="wv"'):corpo.find('<div class="wm')].replace('<span class="wcta mo"><i></i>View project</span>', '')
        out.append(f'<div class="wc" data-cov="{cov}">{corpo}</div>')
    t = una(t, '<!-- MM:COPERTINE-STUDI -->', '\n      '.join(out), 'segnaposto copertine')
    # la porta per G: la stessa della home, testo approvato
    s = home.find('<section class="hs gd"'); e = home.find('</section>', s) + len('</section>')
    t = una(t, '<!-- MM:PORTA-G -->', home[s:e], 'porta G')
    return t


def laboratorio():
    """Il contenuto di LG (src/sezioni/lg.html). Niente porta per G: in LG si telefona dal tavolino (deciso con Eso)."""
    t = (ROOT / 'src/sezioni/lg.html').read_text(encoding='utf8')
    return t


def monta(nome, src):
    t = (PROTO / f'{src}.html').read_text(encoding='utf8')
    t = font_esterni(t)
    t = testata_fissa(t)
    t = dati_esterni(t)
    t = ritocchi(nome, t)

    # 2. la testata nasce con la luce della prima sezione
    prima = re.search(r'<section[^>]*\bdata-f\b[^>]*>', t)
    luce = re.search(r'data-luce="([^"]+)"', prima.group(0)).group(1)
    t = una(t, '<header class="bar" id="bar" data-luce="carta">', f'<header class="bar" id="bar" data-luce="{luce}">', 'testata')

    i = t.find('</header>', t.find('id="bar"')) + len('</header>'); t = t[:i] + DOPO_TESTATA + t[i:]

    # meta per Google e anteprime dei link (al posto del titolo della pagina approvata)
    t, n = re.subn(r'<title>[^<]*</title>', lambda m: testa_meta(nome), t, count=1)
    assert n == 1, 'titolo'
    # lingua della pagina (le pagine approvate non hanno ne' doctype ne' <html>: aggiungere il doctype cambierebbe la resa)
    t = '<html lang="en">' + t

    # 3. testa: avvio prima dello stile della pagina, foglio del sito subito dopo
    i = t.find('<style'); t = t[:i] + AVVIO + t[i:]
    i = t.find('</style>') + len('</style>'); t = t[:i] + FOGLIO + t[i:]

    # 4. ascensore
    t = una(t, "var ride=$('ride');", ASCENSORE + "var ride=$('ride');", 'ride')
    t = una(t, "await S.close(false);", "await (window.MM_DOORS?MM_DOORS.close(S.close(false)):S.close(false));", 'chiusura porte')
    t = una(t, "await S.open();S.busy=false;return true};",
            "if(window.MM_LEAVE&&MM_LEAVE(to))return new Promise(function(){});await (window.MM_DOORS?MM_DOORS.open(S.open()):S.open());S.busy=false;return true};", 'apertura porte')
    t = una(t, "function go(k){if(SH.busy||k===onFloor)return;", "function go(k){if(SH.busy||k===onFloor)return;MM_PRE(k);document.documentElement.classList.add('mm-riding');", 'go')
    t = una(t, "}).then(function(){onFloor=k;", "}).then(function(){if(MM_PAGES[k]){location.href=window.MM_DEST||MM_PAGES[k];return}document.documentElement.classList.remove('mm-riding');onFloor=k;", 'fine corsa')
    t, n = re.subn(r"(\n  if\(k===-?\d+)\)\{pg\.innerHTML='';return\}", r"\1||MM_PAGES[k]){pg.innerHTML='';return}", t)
    assert n == 1, 'segnaposto'

    # la testata non si ricalcola finche' l'ascensore che arriva non apre le porte (logo ancora piccolo)
    t = una(t, "function mini(){", "function mini(){if(document.documentElement.classList.contains('mm-arr-fold'))return;", 'mini')

    # 5. lingua (non tutte le pagine hanno il cartellino)
    s = t.find("  /* il cartellino:")
    if s >= 0:
        e = t.find("RM?600:2200);", s) + len("RM?600:2200);")
        t = t[:s] + LINGUA + t[e:]
        t = una(t, "function apply(c){var from=L[cur],t=L[c];cur=c;",
                "function apply(c){var from=L[cur],t=L[c];cur=c;try{localStorage.setItem('mm-lang',c)}catch(e){}", 'scelta lingua')

    # 04 Work: il registro al posto del caso, piu' il suo stile e il suo script
    if nome == 'work':
        s = t.find('<main class="hm cs" id="top">'); e = t.find('</main>', s) + len('</main>')
        assert s > 0 and e > s, 'main'
        t = t[:s] + registro() + t[e:]
        t = una(t, FOGLIO, FOGLIO + '<link rel="stylesheet" href="/css/work.css">', 'stile work')
        # lo script della demo Control Room (e dei numeri del caso) serve solo alla pagina progetto
        s = t.find('/* pagina progetto v3: il Control Room in miniatura')
        e = t.find('\n})();', t.find(".cfn b[data-n]", s)) + len('\n})();')
        assert s > 0 and e > s, 'script del caso'
        t = t[:s] + t[e:]

    # LG Machine Room: il laboratorio al posto del caso; la pagina sta al piano LG (testata, pulsantiera, corsa)
    if nome == 'lg':
        s = t.find('<main class="hm cs" id="top">'); e = t.find('</main>', s) + len('</main>')
        assert s > 0 and e > s, 'main'
        t = t[:s] + laboratorio() + t[e:]
        t = una(t, FOGLIO, FOGLIO + '<link rel="stylesheet" href="/css/mr.css"><link rel="stylesheet" href="/css/stanza.css"><link rel="stylesheet" href="/css/deadline.css"><link rel="stylesheet" href="/css/stanza-vista.css"><link rel="stylesheet" href="/css/sala-server.css">', 'stile lg')
        s = t.find('/* pagina progetto v3: il Control Room in miniatura')
        e = t.find('\n})();', t.find(".cfn b[data-n]", s)) + len('\n})();')
        assert s > 0 and e > s, 'script del caso'
        t = t[:s] + t[e:]
        t = una(t, "fl=4,nm='Work'", "fl=-1,nm='Machine Room'", 'testata: piano')
        t = una(t, 'aria-label="Floors: you are on 04, Work', 'aria-label="Floors: you are on LG, Machine Room', 'testata: aria')
        t = una(t, '<b>04</b></span></span><span class="rl nm" id="bL"><b>Work</b>',
                '<b>LG</b></span></span><span class="rl nm" id="bL"><b>Machine Room</b>', 'testata: numero')
        t = una(t, 'onFloor=4', 'onFloor=-1', 'piano corrente')
        t = una(t, "nav.cur(4,'04','Work')", "nav.cur(-1,'LG','Machine Room')", 'pulsantiera')
        assert t.count('if(k===4') == 3, 'k===4'
        t = t.replace('if(k===4', 'if(k===-1')

    # lingue nella pulsantiera: si aprono un po' prima e un po' piu' svelte (resta un piccolo respiro)
    s = t.find("ot=setTimeout(function(){setOpen(true)},120)")
    if s >= 0:
        t = una(t, "ot=setTimeout(function(){setOpen(true)},120)", "ot=setTimeout(function(){setOpen(true)},95)", 'lingue: ritardo')
        t = una(t, "transition:max-width .5s cubic-bezier(.7,0,.2,1),padding .5s cubic-bezier(.7,0,.2,1),opacity .3s}",
                "transition:max-width .38s cubic-bezier(.7,0,.2,1),padding .38s cubic-bezier(.7,0,.2,1),opacity .25s}", 'lingue: apertura')
        t = una(t, "scramble(sp,x.dataset.l.toUpperCase(),60+Math.abs(i-ORDER.indexOf(cur))*55)",
                "scramble(sp,x.dataset.l.toUpperCase(),30+Math.abs(i-ORDER.indexOf(cur))*40)", 'lingue: lettere')

    if "  lit(5);\n" in t:
        t = t.replace("  lit(5);\n", "  lit(fl);\n", 1)
    if nome == 'home':
        t = una(t, FOGLIO, FOGLIO + '<link rel="stylesheet" href="/css/home.css">', 'stile home')
    if nome == 'brand':
        t = marchio(t)
        t = una(t, FOGLIO, FOGLIO + '<link rel="stylesheet" href="/css/brand.css">', 'stile brand')
    if nome == 'systems':
        t = sistemi(t)
        t = una(t, FOGLIO, FOGLIO + '<link rel="stylesheet" href="/css/systems.css">', 'stile systems')
    if nome == 'studio':
        t = studio(t)
        t = una(t, FOGLIO, FOGLIO + '<link rel="stylesheet" href="/css/studio.css">', 'stile studio')
    if nome in CASI:
        t = una(t, FOGLIO, FOGLIO + '<link rel="stylesheet" href="/css/progetto.css">', 'stile progetto')

    # "free" una volta prima di Contact (nella porta verso G) e una in Contact (deciso con Eso)
    porta = "Start with a conversation. It's free.</a><span class=\"mo mut\">The first step costs nothing.</span>"
    if porta in t:
        t = una(t, porta, 'Start with a conversation</a><span class="mo mut">The first one is free.</span>', 'porta: free')

    # 6. coda
    i = t.rfind('</body>')
    coda = CODA + {'work': '<script src="/js/work.js"></script>', 'lg': '<script src="/js/deadline-art.js"></script><script src="/js/deadline-audio.js"></script><script src="/js/deadline-sign.js"></script><script src="/js/deadline-net.js"></script><script src="/js/deadline.js"></script><script src="/js/sala-server.js"></script><script src="/js/stanza-vista.js"></script><script src="/js/stanza-oggetti.js"></script><script src="/js/stanza.js"></script>', 'home': '<script src="/js/home.js"></script>', 'systems': '<script src="/js/systems.js"></script>', 'brand': '<script src="/js/brand.js"></script>', 'studio': '<script src="/js/studio.js"></script>','progetto': '<script src="/js/progetto.js"></script>', 'ristorante': '<script src="/js/progetto.js"></script>'}.get(nome, '')
    t = t[:i] + coda + t[i:] if i > 0 else t + coda
    (OUT / f'{nome}.html').write_text(t, encoding='utf8')
    return luce


if __name__ == '__main__':
    assert not any('\u2014' in x for x in (AVVIO, FOGLIO, CODA, DOPO_TESTATA, ASCENSORE, LINGUA)), 'trattino lungo'
    for d in (FONTS, JS):
        d.mkdir(parents=True, exist_ok=True)
    for f in list(FONTS.glob('*.woff2')) + list(JS.glob('as-*.js')) + list(JS.glob('lg-*.js')):
        f.unlink()
    for nome, src in PAGINE.items():
        print(f'{nome:9s} <- prototipo/{src}.html  (testata: {monta(nome, src)})')
