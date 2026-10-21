/* Mother Machine · demo di Vitalia's Italian Restaurant (funzioni ed eventi).
   Le pagine sono il codice vero (pagina Functions, back office "tony", menu da stampare); questo file prende il
   posto del loro server. Risponde alle stesse chiamate (/.netlify/functions/...) con le stesse forme di risposta,
   con dati inventati tenuti nel browser di chi guarda. Le finestre si parlano con BroadcastChannel: una richiesta
   fatta sulla pagina Functions arriva subito nel back office. Niente mail, niente Stripe, niente PDF dal server:
   il PDF del menu lo scrive il browser con lo stesso codice del cliente (montato qui sotto da demo-ristorante.py). */
(function () {
  'use strict';
  var SET = {"1": {"Antipasto": "Garlic focaccia · Bruscofocaccia", "Mains": "Margherita · Capricciosa · Sardegna\nDiavola · Umbria · Vegetariana 2.0\nor Spaghetti carbonara · Rigatoni Bolognese", "Sides": "Rocket, fennel, pear and parmesan salad", "Desserts": "Cannolo siciliano"}, "2": {"Antipasto": "Garlic focaccia · Bruscofocaccia\nCalamari fritti, aioli and lemon", "Primi": "Rigatoni Bolognese al tegamino", "Mains": "Margherita · Capricciosa · Sardegna\nDiavola · Umbria · Vegetariana 2.0", "Desserts": "Tiramisù · Amaretto cherry panna cotta · Gelato alla Nutella"}, "3": {"Antipasto": "Garlic focaccia · Calamari fritti\nTruffle burrata, cherry tomatoes and rocket", "Primi": "Rigatoni Bolognese al tegamino\nTruffle and porcini risotto (v)", "Mains": "Slow-cooked beef cheek, crispy polenta\nGamberoni al vino bianco\nQuattro formaggi e tartufo pizza (v)", "Sides": "Rocket, fennel, pear and parmesan salad", "Desserts": "Tiramisù · Panna cotta · Gelato alla Nutella\nEspresso to finish"}, "lunch": {"1": {"Antipasto": "Garlic focaccia · Bruscofocaccia", "Mains": "Margherita · Capricciosa · Sardegna\nDiavola · Umbria · Vegetariana 2.0\nor Spaghetti carbonara · Cavatelli Bolognese", "Sides": "Mixed leaf salad", "Desserts": "Cannolo siciliano"}, "2": {"Antipasto": "Garlic focaccia · Bruscofocaccia\nCalamari fritti, aioli and lemon", "Primi": "Cavatelli Bolognese", "Mains": "Margherita · Capricciosa · Sardegna\nDiavola · Umbria · Vegetariana 2.0", "Desserts": "Tiramisù · Cannolo siciliano · Gelato alla Nutella"}, "3": {}}};
  var LIB = (function () { 
function clean(value, max = 500) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/[\t ]+/g, ' ')
    .trim()
    .slice(0, max);
}
var buildMenuPdf = (function () {
// Wordmark baked onto the brand green, as a JPEG so it can be dropped straight into
// a PDF as a DCTDecode image with no decoding library. Regenerate with the snippet
// in next-steps if the logo ever changes.
const LOGO_JPEG_BASE64 = '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';
const LOGO_W = 520;
const LOGO_H = 189;
// A very small PDF writer, enough for a branded one or two page menu.
// No dependency: a PDF is a text container, the fourteen standard fonts need no
// embedding, and a JPEG can be dropped in whole as a DCTDecode image.

const PAGE_W = 595.28, PAGE_H = 841.89;          // A4 in points
const MARGIN = 54;
const FLOOR = 100;                                // lowest baseline above the footer rule
const GREEN = [0.235, 0.416, 0.294];
const GOLD = [0.776, 0.596, 0.184];
const INK = [0.11, 0.141, 0.125];
const MUTED = [0.42, 0.478, 0.447];
const LINE = [0.894, 0.894, 0.863];

/* ---- text encoding ----
   The standard fonts use WinAnsi, so anything outside it has to be folded down or
   the reader shows a blank. Accents matter here: "Entrée", "Prosecco", "cafè". */
const FOLD = { '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '\u2014': '-', '…': '...', '·': '•' };
function toWinAnsi(str) {
  let out = '';
  for (const ch of String(str)) {
    const c = FOLD[ch] !== undefined ? FOLD[ch] : ch;
    for (const one of c) {
      const code = one.codePointAt(0);
      if (code === 0x2022) { out += '\\225'; continue; }        // bullet
      if (code < 32) { out += ' '; continue; }
      if (code < 127) { out += (one === '(' || one === ')' || one === '\\') ? '\\' + one : one; continue; }
      if (code <= 255) { out += '\\' + code.toString(8).padStart(3, '0'); continue; }
      out += '?';
    }
  }
  return out;
}

/* Widths for the three fonts we use, so text can be centred and wrapped without
   guessing. Helvetica and Times metrics, 1000 units per em, ASCII range only;
   anything else falls back to a sensible average. */
const HELV = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
const HELVB = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];
const TIMESB = [250,333,555,500,500,1000,833,278,333,333,500,570,250,333,250,278,500,500,500,500,500,500,500,500,500,500,333,333,570,570,570,500,930,722,667,722,722,667,611,778,778,389,500,778,667,944,722,778,611,778,722,556,667,722,722,1000,722,722,667,333,278,333,581,500,333,500,556,444,556,444,333,500,556,278,333,556,278,833,556,500,556,556,444,389,333,556,500,722,500,500,444,394,220,394,520];
const TIMESI = [250,333,420,500,500,833,778,214,333,333,500,675,250,333,250,278,500,500,500,500,500,500,500,500,500,500,333,333,675,675,675,500,920,611,611,667,722,611,611,722,722,333,444,667,556,833,667,722,611,722,611,500,556,722,611,833,611,556,556,389,278,389,422,500,333,500,500,444,500,444,278,500,500,278,278,444,278,722,500,500,500,500,389,389,278,500,444,667,444,444,389,400,275,400,541];
function widthTable(font) { return font === 'F2' ? HELVB : (font === 'F3' ? TIMESI : (font === 'F4' ? TIMESB : HELV)); }
function textWidth(str, font, size) {
  const t = widthTable(font);
  let w = 0;
  for (const ch of String(str)) {
    const c = ch.codePointAt(0);
    w += (c >= 32 && c <= 126) ? t[c - 32] : 500;
  }
  return w * size / 1000;
}
// Visible width: Tc adds space after every glyph, the trailing one does not count.
function advance(str, font, size, spacing) {
  return textWidth(str, font, size) + (spacing || 0) * Math.max(0, String(str).length - 1);
}
function wrap(str, font, size, maxWidth, spacing) {
  const words = String(str).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? line + ' ' + word : word;
    if (advance(next, font, size, spacing) <= maxWidth || !line) line = next;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

class Doc {
  constructor() {
    this.pages = [];
    this.newPage();
  }
  newPage() { this.ops = []; this.pages.push(this.ops); this.y = PAGE_H - MARGIN; }
  rect(x, y, w, h, rgb) {
    this.ops.push(`q ${rgb[0]} ${rgb[1]} ${rgb[2]} rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f Q`);
  }
  line(x1, y, x2, rgb, width = 0.8) {
    this.ops.push(`q ${rgb[0]} ${rgb[1]} ${rgb[2]} RG ${width} w ${x1.toFixed(2)} ${y.toFixed(2)} m ${x2.toFixed(2)} ${y.toFixed(2)} l S Q`);
  }
  text(str, x, y, { font = 'F1', size = 11, rgb = INK, spacing = 0 } = {}) {
    // Tc lives in the graphics state and ET does not clear it, so it has to be set
    // every time or one spaced heading silently stretches the whole rest of the page.
    this.ops.push(`BT ${rgb[0]} ${rgb[1]} ${rgb[2]} rg /${font} ${size} Tf ${spacing} Tc ${x.toFixed(2)} ${y.toFixed(2)} Td (${toWinAnsi(str)}) Tj ET`);
  }
  centred(str, y, opts = {}) {
    this.text(str, (PAGE_W - advance(str, opts.font || 'F1', opts.size || 11, opts.spacing || 0)) / 2, y, opts);
  }
  image(x, y, w, h) { this.ops.push(`q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /Im0 Do Q`); }
}

function bytes(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i) & 0xff;
  return out;
}
function concat(list) {
  const total = list.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let at = 0;
  for (const a of list) { out.set(a, at); at += a.length; }
  return out;
}

function serialise(doc) {
  const jpeg = bytes(atob(LOGO_JPEG_BASE64));
  const objects = [];
  const push = (body) => { objects.push(body); return objects.length; };   // 1-based ids

  const kids = [];
  const pageIds = [];
  for (let i = 0; i < doc.pages.length; i++) pageIds.push(0);

  // ids: 1 catalog, 2 pages, then per page (page + content), then fonts, then image
  const catalogId = 1, pagesId = 2;
  let next = 3;
  const pageObjs = doc.pages.map(() => ({ pageId: next++, contentId: next++ }));
  const fontIds = { F1: next++, F2: next++, F3: next++, F4: next++ };
  const imageId = next++;

  objects.length = next - 1;
  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageObjs.map((p) => p.pageId + ' 0 R').join(' ')}] /Count ${pageObjs.length} >>`;

  doc.pages.forEach((ops, i) => {
    const { pageId, contentId } = pageObjs[i];
    objects[pageId - 1] =
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Resources << /Font << /F1 ${fontIds.F1} 0 R /F2 ${fontIds.F2} 0 R /F3 ${fontIds.F3} 0 R /F4 ${fontIds.F4} 0 R >> ` +
      `/XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`;
    const stream = ops.join('\n');
    objects[contentId - 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  objects[fontIds.F1 - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[fontIds.F2 - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  objects[fontIds.F3 - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic /Encoding /WinAnsiEncoding >>';
  objects[fontIds.F4 - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>';
  objects[imageId - 1] = { image: true };

  const chunks = [bytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];
  let offset = chunks[0].length;
  const offsets = [];

  objects.forEach((body, i) => {
    const id = i + 1;
    offsets[id] = offset;
    if (body && body.image) {
      const head = bytes(`${id} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${LOGO_W} /Height ${LOGO_H} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
      const tail = bytes('\nendstream\nendobj\n');
      chunks.push(head, jpeg, tail);
      offset += head.length + jpeg.length + tail.length;
    } else {
      const b = bytes(`${id} 0 obj\n${body}\nendobj\n`);
      chunks.push(b);
      offset += b.length;
    }
  });

  const xrefAt = offset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= objects.length; id++) xref += String(offsets[id]).padStart(10, '0') + ' 00000 n \n';
  xref += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`;
  chunks.push(bytes(xref));
  return concat(chunks);
}

/* ---- the menu itself ---- */
function buildMenuPdf({ menuName, priceLine, eventLine, sections = [], dietary = '', note = '' }) {
  const doc = new Doc();
  const inner = PAGE_W - MARGIN * 2;

  function header() {
    const bandH = 132;
    doc.rect(0, PAGE_H - bandH, PAGE_W, bandH, GREEN);
    const logoW = 168, logoH = logoW * LOGO_H / LOGO_W;
    doc.image((PAGE_W - logoW) / 2, PAGE_H - bandH / 2 - logoH / 2 + 8, logoW, logoH);
    doc.centred('ITALIAN RESTAURANT  ·  THE PIER, CAIRNS', PAGE_H - bandH + 26,
      { font: 'F1', size: 8, rgb: [1, 1, 1], spacing: 2.2 });
    doc.y = PAGE_H - bandH - 46;
  }
  function footer() {
    doc.line(MARGIN, 78, PAGE_W - MARGIN, LINE);
    doc.centred("Vitalia's Italian Restaurant  ·  Shop 9/2 Pier Point Rd, Cairns City QLD 4870", 60, { size: 8.5, rgb: MUTED });
    doc.centred('07 4000 0865  ·  bookingvitalias@gmail.com', 47, { size: 8.5, rgb: MUTED });
  }
  function room(needed) {
    if (doc.y - needed > FLOOR) return;
    footer();
    doc.newPage();
    header();
  }

  header();

  // A set menu should read as one page. First the empty space between courses
  // tightens, then the dish type steps down a size; baselines never overlap.
  // Past both it simply runs on to page two.
  const clean = sections
    .map((s) => ({ ...s, items: (s.items || []).filter((i) => String(i).trim()) }))
    .filter((s) => s.items.length);
  const dietLines = dietary ? wrap(dietary, 'F3', 10.5, inner - 44) : [];
  const noteLines = note ? wrap(note, 'F3', 9.5, inner - 40) : [];
  const fits = (L) => {
    let h = 0;
    clean.forEach((s) => {
      h += (s.how && !L.inline) ? 13 + L.lead : 15;
      s.items.forEach((it) => { h += wrap(it, 'F1', L.size, inner - 40).length * L.line + 3 * L.k; });
      h += 16 * L.k;
    });
    if (dietLines.length) h += 12 + 4 * L.k + 17 + dietLines.length * 14 + 20 + 8 * L.k;
    if (noteLines.length) h += noteLines.length * 13 + 4;
    return h;
  };
  const titleBlock = 22 + (eventLine ? 16 : 0) + (priceLine ? 20 : 0) + 12;
  const available = doc.y - titleBlock - FLOOR;
  const levels = [];
  for (let k = 1; k >= 0.6; k -= 0.1) levels.push({ k, size: 11.5, line: 15, lead: 16, top: 30 * k });
  for (let k = 0.9; k >= 0.3; k -= 0.1) levels.push({ k, size: 10.5, line: 13.5, lead: 14.5, top: 20 + 10 * k });
  // Last resort before a second page: the serving line joins its heading.
  for (let k = 1; k >= 0.3; k -= 0.1) levels.push({ k, size: 10.5, line: 13.5, lead: 14.5, top: 20 + 10 * k, inline: true });
  const L = levels.find((x) => fits(x) + x.top <= available) || levels[levels.length - 1];

  doc.centred(menuName || 'Our menu', doc.y, { font: 'F4', size: 25, rgb: INK });
  doc.y -= 22;
  if (eventLine) { doc.centred(eventLine, doc.y, { font: 'F3', size: 11, rgb: MUTED }); doc.y -= 16; }
  if (priceLine) {
    doc.y -= 6;
    doc.centred(priceLine, doc.y, { font: 'F2', size: 11, rgb: GREEN, spacing: 0.6 });
    doc.y -= 14;
  }
  doc.y -= 12;
  doc.line(PAGE_W / 2 - 26, doc.y, PAGE_W / 2 + 26, GOLD, 1.4);
  doc.y -= L.top;

  clean.forEach((section) => {
    room(60);
    const head = String(section.heading || '').toUpperCase();
    if (section.how && L.inline) {
      const how = '  ·  ' + String(section.how);
      const w1 = advance(head, 'F2', 9.5, 2.4), w2 = advance(how, 'F3', 9.5, 0);
      const x = (PAGE_W - w1 - w2) / 2;
      doc.text(head, x, doc.y, { font: 'F2', size: 9.5, rgb: GOLD, spacing: 2.4 });
      doc.text(how, x + w1, doc.y, { font: 'F3', size: 9.5, rgb: MUTED });
      doc.y -= 15;
    } else if (section.how) {
      doc.centred(head, doc.y, { font: 'F2', size: 9.5, rgb: GOLD, spacing: 2.4 });
      doc.y -= 13;
      doc.centred(String(section.how), doc.y, { font: 'F3', size: 9.5, rgb: MUTED });
      doc.y -= L.lead;
    } else {
      doc.centred(head, doc.y, { font: 'F2', size: 9.5, rgb: GOLD, spacing: 2.4 });
      doc.y -= 15;
    }
    section.items.forEach((item) => {
      const lines = wrap(item, 'F1', L.size, inner - 40);
      room(lines.length * L.line + 8);
      lines.forEach((l, i) => {
        doc.centred(l, doc.y, { size: L.size, rgb: i === 0 ? INK : MUTED });
        doc.y -= L.line;
      });
      doc.y -= 3 * L.k;
    });
    doc.y -= 16 * L.k;
  });

  if (dietLines.length) {
    room(72);
    doc.y -= 12 + 4 * L.k;
    const boxH = 40 + dietLines.length * 14;
    doc.rect(MARGIN, doc.y - boxH + 22, inner, boxH, [0.906, 0.933, 0.91]);
    doc.text('LOOKED AFTER FOR YOU', MARGIN + 20, doc.y, { font: 'F2', size: 8, rgb: GREEN, spacing: 1.6 });
    doc.y -= 17;
    dietLines.forEach((l) => { doc.text(l, MARGIN + 20, doc.y, { font: 'F3', size: 10.5, rgb: MUTED }); doc.y -= 14; });
    doc.y -= 20 + 8 * L.k;
  }

  if (noteLines.length) {
    room(noteLines.length * 13 + 4);
    noteLines.forEach((l) => { doc.centred(l, doc.y, { font: 'F3', size: 9.5, rgb: MUTED }); doc.y -= 13; });
  }

  footer();
  return serialise(doc);
}
return buildMenuPdf;
})();
var schema = (function () {
// Shape + limits for a menu document (dinner.json, lunch.json, and whatever
// menus follow). Shared by the admin editor's save and the PDF generator's
// menu-picker, so a saved menu can never silently outgrow what either can render.

const LANGS = ['en', 'zh', 'ja'];

function cleanLoc(obj, max) {
  const out = {};
  for (const l of LANGS) if (obj && obj[l]) out[l] = clean(obj[l], max);
  return out;
}

function normaliseItem(raw) {
  const it = raw && typeof raw === 'object' ? raw : {};
  const item = {
    id: clean(it.id, 60) || ('dish-' + Math.random().toString(36).slice(2, 9)),
    price: clean(it.price, 12),
    tags: (Array.isArray(it.tags) ? it.tags : []).slice(0, 6).map((t) => clean(t, 4)).filter(Boolean)
  };
  if (it.price2) item.price2 = clean(it.price2, 12);
  // The drinks list prices a wine by the small glass, the large glass and the
  // bottle, so a row carries one value per column. Blanks are kept, not dropped:
  // position is what tells a price which column it belongs to.
  if (Array.isArray(it.prices)) item.prices = it.prices.slice(0, 4).map((p) => clean(p, 12));
  if (it.year) item.year = clean(it.year, 8);
  /* The focacce board is photo-led, so the image path is part of the dish. It is
     a path we ship, never an upload, so it is checked against that shape rather
     than trusted: anything else and the dish simply loses its picture instead of
     becoming somewhere to hang a URL of someone else's choosing. */
  if (typeof it.img === 'string' && /^assets\/[A-Za-z0-9._\/-]{1,90}$/.test(it.img)) item.img = it.img;
  for (const l of LANGS) {
    const src = it[l];
    if (!src) continue;
    const loc = { name: clean(src.name, 120), desc: clean(src.desc, 400) };
    if (src.size) loc.size = clean(src.size, 20);
    if (src.region) loc.region = clean(src.region, 60);
    item[l] = loc;
  }
  if (!item.en || !item.en.name) return null; // an English name is the one thing every dish needs
  const tagNote = cleanLoc(it.tagNote, 60);
  if (Object.keys(tagNote).length) item.tagNote = tagNote;
  // Where the seafood comes from (Australian labelling): A Australia, I Imported, M Mixed.
  // Printed as its own (A) after the dietary marks, never mixed in with them.
  if (['A', 'I', 'M'].includes(it.origin)) item.origin = it.origin;
  const choiceLabel = cleanLoc(it.choiceLabel, 40);
  if (Object.keys(choiceLabel).length) item.choiceLabel = choiceLabel;
  if (Array.isArray(it.options) && it.options.length) {
    const options = it.options.slice(0, 12).map((o) => cleanLoc(o, 80)).filter((o) => o.en);
    if (options.length) item.options = options;
  }
  return item;
}

const ICONS = ['glass-s', 'glass-l', 'bottle'];

// A group is a run of items sharing one label: printed down the side of the
// column ("ITALIAN", "TAP"), or as a heading over a rule for the cellar list's
// red/white split.
function normaliseGroup(raw) {
  const g = raw && typeof raw === 'object' ? raw : {};
  const label = cleanLoc(g.label, 40);
  if (!label.en) return null;
  const group = {
    id: clean(g.id, 40) || label.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label,
    items: (Array.isArray(g.items) ? g.items : []).slice(0, 60).map(normaliseItem).filter(Boolean)
  };
  if (g.style === 'head') group.style = 'head';
  const note = cleanLoc(g.note, 120);
  if (Object.keys(note).length) group.note = note;
  return group.items.length ? group : null;
}

function normaliseSection(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  const name = cleanLoc(s.name, 40);
  if (!name.en) return null;
  const section = {
    id: clean(s.id, 40) || name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    items: (Array.isArray(s.items) ? s.items : []).slice(0, 60).map(normaliseItem).filter(Boolean)
  };
  if (Array.isArray(s.cols) && s.cols.length) {
    section.cols = s.cols.slice(0, 4).map((c) => {
      const col = {};
      if (c && ICONS.includes(c.icon)) col.icon = c.icon;
      const cl = cleanLoc(c && c.label, 20);
      if (Object.keys(cl).length) col.label = cl;
      return col;
    });
  }
  if (Array.isArray(s.groups) && s.groups.length) {
    const groups = s.groups.slice(0, 12).map(normaliseGroup).filter(Boolean);
    if (groups.length) section.groups = groups;
  }
  if (typeof s.logo === 'string' && /^assets\/[A-Za-z0-9._\/-]{1,90}$/.test(s.logo)) section.logo = s.logo;
  const aside = cleanLoc(s.aside, 40);
  if (Object.keys(aside).length) section.aside = aside;
  if (s.foot === 'legend' || s.foot === 'surcharge') section.foot = { en: s.foot, zh: s.foot, ja: s.foot };
  else { const foot = cleanLoc(s.foot, 200); if (Object.keys(foot).length) section.foot = foot; }
  if (s.priceColumns === 2) {
    section.priceColumns = 2;
    const colHead = cleanLoc(s.colHead, 20);
    if (Object.keys(colHead).length) section.colHead = colHead;
  }
  return section;
}

// Pages describe print layout (which sections share a column, cover/info leaves).
// The admin editor round-trips these unchanged; this just guards against a
// malformed payload wiping the layout a page depends on.
function normalisePages(raw, sections) {
  const known = new Set(sections.map((s) => s.id));
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 12).map((p) => {
    const page = { id: clean(p && p.id, 30) || 'page' };
    if (p && (p.type === 'cover' || p.type === 'info')) { page.type = p.type; return page; }
    page.panels = (Array.isArray(p && p.panels) ? p.panels : [])
      .slice(0, 4)
      .map((panel) => (Array.isArray(panel) ? panel : [panel]).map((id) => clean(id, 40)).filter((id) => known.has(id)))
      .filter((panel) => panel.length);
    // a foot is either one of the two shared blocks, or, on the drinks list, a
    // line written per panel in each language
    if (Array.isArray(p && p.foot)) page.foot = p.foot.slice(0, 4).map((f) => {
      if (f === 'legend' || f === 'surcharge') return f;
      const loc = cleanLoc(f, 200);
      return Object.keys(loc).length ? loc : null;
    });
    return page;
  }).filter((p) => p.type || p.panels.length);
}

function normaliseMenu(body, existing) {
  const b = body && typeof body === 'object' ? body : {};
  const base = existing && typeof existing === 'object' ? existing : {};
  const id = clean(b.id || base.id, 30);
  if (!id) return null;

  const sections = (Array.isArray(b.sections) ? b.sections : base.sections || [])
    .slice(0, 20).map(normaliseSection).filter(Boolean);
  if (!sections.length) return null;

  const menu = {
    id,
    updatedAt: new Date().toISOString(),
    style: (['condensed', 'cards'].includes(b.style) ? b.style : 'serif'),
    title: Object.keys(cleanLoc(b.title, 30)).length ? cleanLoc(b.title, 30) : cleanLoc(base.title, 30),
    sections,
    pages: normalisePages(b.pages || base.pages, sections)
  };

  const legendSrc = Array.isArray(b.legend) ? b.legend : base.legend;
  if (Array.isArray(legendSrc)) {
    menu.legend = legendSrc.slice(0, 8).map((l) => ({ code: clean(l && l.code, 4), ...cleanLoc(l, 30) })).filter((l) => l.code && l.en);
  }
  const surcharge = cleanLoc(b.surcharge || base.surcharge, 300);
  if (Object.keys(surcharge).length) menu.surcharge = surcharge;

  // since/title/script/memory read in three languages on the page, so they have
  // to be cleaned as localized objects, not coerced to a single string - an
  // object run through clean() used to come back as the literal text
  // "[object Object]", silently wiping the cover on every save.
  const coverSrc = b.cover || base.cover;
  if (coverSrc && typeof coverSrc === 'object') {
    const cover = {};
    const since = cleanLoc(coverSrc.since, 20); if (Object.keys(since).length) cover.since = since;
    const title = cleanLoc(coverSrc.title, 30); if (Object.keys(title).length) cover.title = title;
    const script = cleanLoc(coverSrc.script, 30); if (Object.keys(script).length) cover.script = script;
    const memory = cleanLoc(coverSrc.memory, 300);
    if (Object.keys(memory).length) cover.memory = memory;
    if (Object.keys(cover).length) menu.cover = cover;
  }

  const infoSrc = b.info || base.info;
  if (infoSrc && typeof infoSrc === 'object') {
    // address, phone, Instagram handle and the domain are identifiers, the same
    // in every language, so they alone stay plain strings.
    menu.info = {
      place: cleanLoc(infoSrc.place, 60), address: clean(infoSrc.address, 80),
      days: cleanLoc(infoSrc.days, 40),
      hours: (Array.isArray(infoSrc.hours) ? infoSrc.hours : []).slice(0, 4).map((h) => cleanLoc(h, 60)).filter((h) => h.en),
      phone: clean(infoSrc.phone, 30), instagram: clean(infoSrc.instagram, 40), site: clean(infoSrc.site, 40)
    };
  }

  return menu;
}

const MENU_IDS = ['dinner', 'lunch', 'drinks', 'focacce', 'maritozzi'];
return { normaliseMenu: normaliseMenu, MENU_IDS: MENU_IDS };
})();
return { clean: clean, buildMenuPdf: buildMenuPdf, normaliseMenu: schema.normaliseMenu, MENU_IDS: schema.MENU_IDS };
 })() || null;
  var KEY = 'mm-rist-demo-1', CH = 'mm-rist-demo', PW_KEY = 'vitalia_admin_pw';
  var ch = ('BroadcastChannel' in window) ? new BroadcastChannel(CH) : null;
  var realFetch = window.fetch.bind(window);
  var BASE = ((document.currentScript && document.currentScript.src) || location.href).replace(/[?#].*$/, '').replace(/[^/]*$/, '');

  /* il back office si apre senza password: nella demo la chiave e' gia' in tasca */
  try { if (!sessionStorage.getItem(PW_KEY)) sessionStorage.setItem(PW_KEY, 'demo') } catch (e) {}

  /* dentro la pagina del caso le finestre non devono muovere lo scroll di chi le ospita */
  if (window.top !== window) {
    Element.prototype.scrollIntoView = function (o) {
      var r = this.getBoundingClientRect(), b = (o && typeof o === 'object' && o.block) || (o === false ? 'end' : 'start');
      var y = window.scrollY + r.top - (b === 'center' ? (innerHeight - r.height) / 2 : b === 'end' ? innerHeight - r.height : b === 'nearest' ? (r.top < 0 ? 0 : r.bottom > innerHeight ? innerHeight - r.height : r.top) : 0);
      window.scrollTo({ top: Math.max(0, y), behavior: (o && o.behavior) || 'auto' });
    };
    var focus0 = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (o) { return focus0.call(this, Object.assign({}, o || {}, { preventScroll: true })) };
  }

  /* niente notifiche push: il back office nasconde il pannello da solo */
  try { delete window.PushManager } catch (e) {}
  /* niente contatore di visite verso un server: il beacon resta nella demo */
  if (navigator.sendBeacon) {
    var beacon0 = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (u, data) { if (/\/\.netlify\/functions\//.test(String(u))) { track(); return true } return beacon0(u, data) };
  }

  /* ---- date relative a oggi ---- */
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
  function addDays(n, from) { var d = from ? new Date(from + 'T12:00:00') : new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return d }
  function shift(isoDay, n) { return iso(addDays(n, isoDay)) }
  function now() { return new Date().toISOString() }
  function stamp(isoDay, h, m) { var d = new Date(isoDay + 'T12:00:00'); d.setHours(h || 10, m || 0, 0, 0); return d.toISOString() }
  function prettyDate(v) { if (!v) return ''; var d = new Date(v + 'T00:00:00'); return isNaN(d) ? v : d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
  function clean(v, max) { return String(v == null ? '' : v).replace(/\r\n/g, '\n').replace(/[\t ]+/g, ' ').trim().slice(0, max || 500) }
  function uuid() { return (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2)) }

  /* ---- i menu fissi, come li scrive il back office (stesse etichette di tony.html) ---- */
  var COURSES = ['Entrée', 'Antipasto', 'Primi', 'Mains', 'Sides', 'Desserts', 'Drinks', 'Wines'];
  var COURSE_HEAD = { 'Entrée': 'Entrée', 'Antipasto': 'Antipasto', 'Primi': 'Pasta', 'Mains': 'Mains', 'Sides': 'On the side', 'Desserts': 'Dolci', 'Drinks': 'To drink', 'Wines': 'Wine' };
  var COURSE_RULE = { 'Entrée': 'One each', 'Antipasto': 'For the table to share', 'Primi': 'For the table to share', 'Mains': 'One each, your choice', 'Sides': 'For the table', 'Desserts': 'One each, your choice', 'Drinks': 'From the bar', 'Wines': 'For the table' };
  var MENUS = [{ name: 'Set Menu 1 · La Piazza', short: 'La Piazza', price: 49, k: '1' }, { name: 'Set Menu 2 · La Trattoria', short: 'La Trattoria', price: 62, k: '2' },
    { name: 'Set Menu 3 · La Festa', short: 'La Festa', price: 89, k: '3' }, { name: 'Tailor-made menu', short: 'A menu for you', price: 0, k: '3' }];
  function lunchTime(t) { var m = String(t || '').match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i); if (!m) return false; return (Number(m[1]) % 12 + (m[3].toLowerCase() === 'pm' ? 12 : 0)) < 16 }
  function menuData(mi, e, pp, drinkLines) {
    var m = MENUS[mi], lunch = lunchTime(e.eventTime) && SET.lunch && SET.lunch[m.k] && Object.keys(SET.lunch[m.k]).length;
    var courses = (lunch ? SET.lunch[m.k] : SET[m.k]) || {};
    var sections = COURSES.map(function (c) { return { heading: COURSE_HEAD[c], how: COURSE_RULE[c], items: String(courses[c] || '').split('\n').map(function (l) { return l.trim() }).filter(Boolean) } }).filter(function (s) { return s.items.length });
    sections.push(drinkLines.length ? { heading: 'To drink', how: 'Included in your quote', items: drinkLines.concat(['Anything else from the bar, on consumption']) } : { heading: 'To drink', how: 'From the bar', items: ['On consumption, or a bar tab for the table'] });
    return { menuName: m.short, priceLine: '$' + pp + ' per person', sections: sections, dietary: e.dietary || '', note: 'Prepared fresh on the day. Final numbers confirmed one week before the event.' };
  }

  /* ---- le richieste inventate: nomi, mail e numeri non sono di nessuno ----
     Si generano rispetto a oggi, da undici mesi fa a quattro mesi avanti: il calendario e le statistiche non restano
     mai vuoti. Il seme e' fisso: a ogni visita gli stessi eventi, spostati sul giorno di oggi. */
  function seed() {
    var rnd = rng(20261021), pick = function (a) { return a[Math.floor(rnd() * a.length)] }, between = function (a, b) { return a + Math.floor(rnd() * (b - a + 1)) };
    var FIRST = ['Sophie', 'Liam', 'Grace', 'Noah', 'Mia', 'Oliver', 'Ava', 'Jack', 'Chloe', 'Lucas', 'Ella', 'Henry', 'Zoe', 'Leo', 'Ruby', 'Max', 'Isla', 'Archie', 'Lily', 'Tom', 'Matilda', 'Ethan', 'Amelia', 'Harvey', 'Sienna', 'Marco', 'Giulia', 'Hannah', 'Daniel', 'Priya', 'Kenji', 'Mei'];
    var LAST = ['Marlow', 'Bennett', 'Collins', 'Reid', 'Thompson', 'Hayes', 'Walsh', 'Moore', 'Fraser', 'Quinn', 'Doyle', 'Parker', 'Grant', 'Lowe', 'Hart', 'Ford', 'Ross', 'Shaw', 'Lane', 'Price', 'Rinaldi', 'Costa', 'Nguyen', 'Sato', 'Patel', 'Kelly'];
    var ORGS = ['Harbour Lane Co.', 'Reef Street Physio', 'Esplanade Realty', 'Coral Coast Builders', 'Tablelands Dental', 'Trinity Bay Accounting', 'Marlin Marine Tours', 'Northside Rugby Club'];
    var SPACES = ['Inside the restaurant', 'Outside on the deck, by the water', 'Outside on the deck, by the water', 'A bit of both', 'No preference'];
    var FLEX = ['The date is fixed', 'The date is fixed', 'Fairly flexible', 'Very flexible', ''];
    var FOCUS = ['Mostly seafood', 'A bit of everything', 'A bit of everything', 'Pizza focused', 'Mostly meat', 'Vegetarian and vegan friendly'];
    var DIET = ['', '', '', '2 gluten free, 1 vegan', '1 nut allergy', '3 vegetarian', '1 coeliac, 2 no seafood', '1 vegan', '2 vegetarian, 1 dairy free', '1 shellfish allergy'];
    var LUNCH = ['11:30am', '12:00pm', '12:30pm', '1:00pm'], DINNER = ['5:30pm', '6:00pm', '6:30pm', '6:30pm', '7:00pm'];
    var GUESTS = { 'Wedding': [60, 130], 'Work dinner': [14, 55], 'Birthday': [12, 40], 'Party': [25, 80], 'Group booking': [10, 28] };
    var SAID = {
      'Wedding': ['We would love the deck at sunset for the ceremony drinks, then dinner inside.', 'Small wedding, mostly family flying in from Italy. Can we have a long table?', 'Reception after a ceremony at the Botanic Gardens. Cake from our baker.'],
      'Work dinner': ['End of year dinner for the team at {org}.', 'Client dinner for {org}. We need an invoice to the company.', 'Team dinner for {org}, a couple of speeches after mains.'],
      'Birthday': ['It is my mum\'s 70th, a surprise. Can you keep the cake hidden?', '40th birthday, a relaxed long lunch.', '18th birthday, no alcohol for most of the guests.'],
      'Party': ['Engagement party, drinks and something to share.', 'Farewell for a friend moving overseas.', 'Graduation party, family and friends.'],
      'Group booking': ['Cruise ship crew night off.', 'Book club dinner, we are a chatty table.', 'Family reunion, three generations.']
    };
    var WEIGHTS = [['Birthday', 5], ['Work dinner', 4], ['Party', 3], ['Group booking', 3], ['Wedding', 2]];
    var weighted = function () { var r = rnd() * 17, a = 0; for (var i = 0; i < WEIGHTS.length; i++) { a += WEIGHTS[i][1]; if (r < a) return WEIGHTS[i][0] } return 'Birthday' };
    var today = iso(addDays(0)), list = [], n = 0, news = 0;

    for (var day = -330; day <= 125; day++) {
      var d = addDays(day), wd = d.getDay();
      /* il ritmo di un ristorante sul lungomare: venerdi' e sabato pieni, la domenica a pranzo, in settimana le cene di lavoro */
      var count = wd === 6 ? (rnd() < .55 ? 2 : 1) : wd === 5 ? (rnd() < .8 ? 1 : 0) : wd === 0 ? (rnd() < .55 ? 1 : 0) : wd === 4 ? (rnd() < .35 ? 1 : 0) : (rnd() < .14 ? 1 : 0);
      if (day > 60 && rnd() < .4) count = Math.max(0, count - 1);
      for (var c = 0; c < count; c++) {
        n++;
        var date = iso(d), ahead = day, type = wd >= 1 && wd <= 4 ? (rnd() < .7 ? 'Work dinner' : 'Group booking') : weighted();
        var first = pick(FIRST), last = pick(LAST), name = first + ' ' + last, org = pick(ORGS);
        var g = GUESTS[type], guests = between(g[0], g[1]);
        var time = (wd === 0 || (c === 1 && wd === 6) || rnd() < .12) ? pick(LUNCH) : pick(DINNER);
        var mi = type === 'Wedding' ? (rnd() < .6 ? 3 : 2) : guests > 40 && rnd() < .3 ? 2 : (rnd() < .5 ? 1 : rnd() < .6 ? 0 : 2);
        var menuStyle = rnd() < .08 ? 'Not sure yet, we would like advice' : MENUS[mi].name;
        var drinks = type === 'Wedding' || (type === 'Work dinner' && rnd() < .5) ? 'House drinks package' : pick(['From the bar, as we go', 'Welcome prosecco, then the bar', 'House drinks package', 'Not sure yet']);
        var extras = [];
        if (type === 'Birthday' && rnd() < .7) extras.push('Bringing own cake');
        if ((type === 'Wedding' || type === 'Party') && rnd() < .4) extras.push('Wants music or entertainment');
        var staff = rnd() < .14;
        var e = {
          id: 'demo-' + n, eventType: type, eventDate: date, eventTime: time, guests: String(guests),
          dateFlexible: staff ? '' : pick(FLEX), space: guests > 90 ? 'Exclusive use of the whole restaurant' : pick(SPACES),
          menuStyle: menuStyle, menuFocus: /Tailor|Not sure/.test(menuStyle) ? pick(FOCUS) : '', drinks: drinks, dietary: pick(DIET), extras: extras,
          name: name, email: (first + '.' + last).toLowerCase().replace(/[^a-z.]+/g, '') + '@example.com', phone: '0400 000 ' + String(100 + n % 900).slice(-3),
          message: staff ? '' : pick(SAID[type]).replace('{org}', org), status: 'new', replies: [], createdAt: ''
        };
        if (staff) e.source = 'added by staff';

        /* da dove e' arrivata e quando: i matrimoni con mesi di anticipo, le cene con qualche settimana */
        var lead = type === 'Wedding' ? between(90, 260) : between(8, 55);
        var created = shift(date, -lead);
        if (created > today) created = today;
        var st;
        if (date < today) st = (day > -9 && rnd() < .5) ? 'confirmed' : 'done';
        else if (ahead <= 14) st = rnd() < .85 ? 'confirmed' : 'quoted';
        else if (ahead <= 45) st = rnd() < .55 ? 'confirmed' : rnd() < .7 ? 'quoted' : 'new';
        else st = rnd() < .3 ? 'confirmed' : rnd() < .6 ? 'quoted' : 'new';
        if (st === 'new' && news >= 6) st = 'quoted';
        if (st === 'new') { news++; created = shift(today, -Math.min(5, Math.floor(rnd() * 6))) }
        if (created > date) created = date;
        e.createdAt = stamp(created, between(7, 21), between(0, 59));
        e.status = st;

        /* il preventivo che e' partito dal back office, con il menu stampato */
        if (st !== 'new') {
          var pp = mi === 3 ? between(9, 13) * 10 + 5 : MENUS[mi].price, lines = [], dl = [];
          if (drinks === 'House drinks package') { lines.push({ label: 'House drinks package · ' + guests + ' guests', amount: guests * 45 }); dl.push('House drinks package') }
          if (drinks === 'Welcome prosecco, then the bar') { lines.push({ label: 'Welcome prosecco · ' + guests + ' guests', amount: guests * 10 }); dl.push('Welcome prosecco on arrival') }
          if (/gluten free|coeliac/.test(e.dietary)) lines.push({ label: 'Gluten-free preparation · 2 guests', amount: 16 });
          if (extras.indexOf('Bringing own cake') !== -1) lines.push({ label: 'Cakeage', amount: 30 });
          var total = guests * pp + lines.reduce(function (t, l) { return t + l.amount }, 0);
          var md = menuData(mi, e, pp, dl), qAt = stamp(shift(created, 1), between(9, 11), between(0, 59));
          if (qAt > now()) qAt = now();
          var withDep = st === 'confirmed' || st === 'done' ? rnd() < .75 : rnd() < .35;
          var dep = withDep ? (type === 'Wedding' ? 1000 : Math.max(100, Math.round(total * .2 / 50) * 50)) : 0;
          e.replies.push({ at: qAt, subject: 'Your ' + type.toLowerCase() + ' at Vitalia\'s, ' + prettyDate(date), message: 'Hi ' + first + ',\n\nThank you for thinking of us. Here is the menu we would suggest, and the price for ' + guests + ' guests.\n\nWarm regards,\nAntonio',
            total: total, deposit: dep, menu: md.menuName, menuData: md, files: [], tpl: 'quote', sent: true });
          if (dep) { e.depositAmount = dep; e.depositUrl = '#'; e.depositLinkId = 'plink_demo_' + n }
          /* chi ha risposto al preventivo: la conversazione resta sulla scheda */
          if (st === 'quoted' && rnd() < .45) {
            var rAt = new Date(new Date(qAt).getTime() + between(3, 40) * 3600000);
            if (rAt.getTime() < Date.now()) e.inbox = [{ emailId: 'demo-in-' + n, at: rAt.toISOString(), from: e.email, subject: 'Re: ' + e.replies[0].subject,
              text: pick(['Thanks, this looks lovely. Could we swap the panna cotta for tiramisu?', 'Great, can we bring the numbers up by about ten? I will confirm on Friday.', 'Is there parking nearby for older guests?', 'Perfect. Is the deck covered if it rains?']),
              attachments: [], read: ahead > 30 || rnd() < .5 }];
          }
          if (st === 'confirmed' || st === 'done') {
            var cAt = stamp(shift(created, between(2, 9) < lead ? between(2, 9) : 1), 15, 10);
            if (cAt > now()) cAt = now();
            e.replies.push({ at: cAt, subject: 'Confirmed: your ' + type.toLowerCase() + ' on ' + prettyDate(date), message: 'Hi ' + first + ',\n\nWe are all set. Final numbers one week before, please.\n\nGrazie,\nVitalia', total: total, deposit: 0, menu: md.menuName, menuData: md, files: [], tpl: 'confirm', sent: true });
            if (dep) {
              var card = rnd() < .75;
              e.depositPaid = true; e.depositPaidAmount = dep; e.depositPaidAt = cAt; e.depositMethod = card ? 'card' : 'bank';
              if (card) e.stripe = { paymentIntent: 'pi_demo_' + n, session: 'cs_demo_' + n, customerEmail: e.email, livemode: true, charge: 'ch_demo_' + n, brand: pick(['visa', 'visa', 'mastercard', 'amex']), last4: String(between(1000, 9999)), receiptUrl: '#' };
            }
            if (ahead <= 7 || date < today) { e.kitchenSentAt = stamp(shift(date, -5), 16, 20); e.kitchenSentTo = 'kitchen@example.com' }
          }
        }
        if (rnd() < .12) e.staffNote = pick(['Long table on the deck, by the water.', 'High chair for two little ones.', 'Speeches after mains, keep the music low.', 'Regulars: Antonio to say hello.']);
        /* qualche disdetta: archiviata, con il deposito tornato indietro */
        if (date < today && rnd() < .05) {
          e.archived = true; e.cancelledAt = stamp(shift(date, -20), 11, 0);
          if (e.depositPaid) { e.depositRefunds = [{ id: 're_demo_' + n, amount: e.depositPaidAmount, at: e.cancelledAt, status: 'succeeded', method: e.depositMethod, reason: 'Cancelled more than 14 days before', by: 'staff' }]; e.depositRefundedAmount = e.depositPaidAmount }
        }
        list.push(e);
      }
    }
    return { v: 1, day: today, events: list, menus: {}, settings: { id: 'functions', kitchenEmail: 'kitchen@example.com' }, positions: seedPositions(today), applications: seedApps(today, rng(777)), hits: 0 };
  }

  function seedPositions(today) {
    return [
      { id: 'pos-1', role: 'Waiter', type: 'Casual', hours: '20–30 hrs/week', level: 'Little Experience Needed', start: 'Immediate start', startDate: '', note: 'Evenings and weekends on the deck. Friendly, quick, happy to learn the wine list.', active: true, createdAt: stamp(shift(today, -12), 9, 0) },
      { id: 'pos-2', role: 'Pizzaiolo', type: 'Full-time', hours: '38+ hrs/week', level: 'Experience Required', start: 'From a date', startDate: shift(today, 18), note: 'Wood-fired oven, Neapolitan dough. Pizza by the metre on busy nights.', active: true, createdAt: stamp(shift(today, -25), 9, 0) },
      { id: 'pos-3', role: 'Bartender / Barista', type: 'Part-time', hours: '10–20 hrs/week', level: 'Experience Required', start: 'Immediate start', startDate: '', note: 'Coffee by day, spritz by night. RSA needed.', active: true, createdAt: stamp(shift(today, -40), 9, 0) },
      { id: 'pos-4', role: 'Kitchenhand', type: 'Casual', hours: 'Hours vary', level: 'Any Level Welcome', start: 'Immediate start', startDate: '', note: '', active: false, createdAt: stamp(shift(today, -70), 9, 0) }
    ];
  }
  function seedApps(today, rnd) {
    var pick = function (a) { return a[Math.floor(rnd() * a.length)] };
    var P = [['Chiara', 'Bianchi', 'Italian: Native'], ['Lukas', 'Weber', 'German: Native'], ['Emma', 'Laurent', 'French: Native'], ['Yuki', 'Tanaka', 'Japanese: Native'], ['Jack', 'Murphy', ''], ['Sofia', 'Garcia', 'Spanish: Native'],
      ['Ben', 'Carter', ''], ['Ana', 'Silva', 'Portuguese: Native'], ['Tom', 'Fischer', 'German: Native'], ['Lea', 'Martin', 'French: Native'], ['Matteo', 'Ricci', 'Italian: Native'], ['Olivia', 'Brown', ''], ['Hana', 'Kim', 'Korean: Native'], ['Ruby', 'Evans', '']];
    var ROLES = ['Waiter', 'Waiter', 'Runner', 'Bartender / Barista', 'All-rounder (Front of House)', 'Pizzaiolo', 'Chef / Cook', 'Kitchenhand', 'Dishwasher', 'Floor Manager'];
    var KITCHEN = ['Pizzaiolo', 'Chef / Cook', 'Kitchenhand', 'Dishwasher'];
    return P.map(function (p, i) {
      var role = i === 0 ? 'Pizzaiolo' : pick(ROLES), visa = p[2] && !/Italian/.test(p[2]) ? 'Working Holiday Visa (417/462)' : pick(['Australian Citizen / PR', 'Student Visa', 'Working Holiday Visa (417/462)']);
      var a = {
        id: 'app-demo-' + (i + 1), receivedAt: stamp(shift(today, -Math.floor(i * 5 + rnd() * 4)), 8 + Math.floor(rnd() * 12), Math.floor(rnd() * 59)),
        name: p[0] + ' ' + p[1], email: (p[0] + '.' + p[1]).toLowerCase() + '@example.com', phone: '0400 000 ' + String(700 + i), role: role,
        experience: pick(['Some experience (under 1 year)', 'Experienced (1–3 years)', 'Highly experienced (3+ years)', 'No experience, keen to learn']),
        cert: pick(['Yes, current', 'Yes, current', 'No, happy to get one']), certLabel: KITCHEN.indexOf(role) !== -1 ? 'Food Safety certificate' : 'RSA certificate',
        englishLevel: p[2] ? pick(['Fluent', 'Medium', 'Fluent']) : 'Native', extraLangs: p[2] ? [p[2]] : [], visaType: visa,
        visaExpiry: /Holiday|Student/.test(visa) ? shift(today, 200 + Math.floor(rnd() * 200)).slice(0, 7) : '', lengthOfStay: pick(['6–12 months', '12+ months / long term', '3–6 months']),
        message: pick(['I worked two summers in a pizzeria in Naples.', 'Available evenings and weekends.', 'I love the deck, I had dinner there last week!', 'Barista for three years in Melbourne.', '']),
        over18: true, consent: true, cv: { name: p[0] + '-' + p[1] + '-CV.pdf', size: 80000 + Math.floor(rnd() * 90000), type: 'application/pdf' }
      };
      if (i < 9 && rnd() < .8) a.score = Math.floor(rnd() * 4) - (rnd() < .15 ? 1 : 0);
      if (i === 0) { a.score = 3; a.notes = 'Great dough, ask for a trial shift.'; a.trial = { at: shift(today, 2) + 'T15:00', setAt: now() } }
      if (i === 2) a.unavailable = ['mon-m', 'tue-m', 'sun-e'];
      return a;
    });
  }

  /* ---- lo stato: nel browser, condiviso tra le finestre ---- */
  var S = null;
  function load() {
    if (S) return S;
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1 && s.day === iso(addDays(0))) return (S = s) } catch (e) {}
    S = seed(); persist(); return S;
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch (e) {} }
  function changed(what, extra) {
    if (what === 'enquiry') S.lastNew = Object.assign({ what: what, at: Date.now() }, extra || {});
    persist(); if (ch) ch.postMessage({ state: S, what: what || '' });
  }
  if (ch) ch.addEventListener('message', function (e) {
    if (e.data && e.data.state) {
      S = e.data.state;
      if (typeof window.MM_DEMO_REFRESH === 'function') window.MM_DEMO_REFRESH(e.data.what);
      /* il menu da stampare aperto in un'altra finestra si rifa' appena il back office pubblica */
      if (e.data.what === 'menu' && /print-menu\.html$/.test(location.pathname)) location.reload();
    }
    if (e.data && e.data.reset) { S = null; try { localStorage.removeItem(KEY) } catch (x) {} location.reload() }
  });
  window.MM_DEMO = { reset: function () { S = seed(); persist(); if (ch) ch.postMessage({ reset: true }); location.reload() }, last: function () { return load().lastNew || null } };

  function find(id) { return load().events.filter(function (e) { return e.id === id })[0] }
  function track() { load().hits = (load().hits || 0) + 1; persist() }

  /* ---- risposte ---- */
  function J(obj, status) { return new Response(JSON.stringify(obj), { status: status || 200, headers: { 'Content-Type': 'application/json' } }) }
  function T(text, status) { return new Response(text, { status: status || 200 }) }
  function none() { return new Response(null, { status: 204 }) }
  function pdf(bytes, name) { return new Response(new Blob([bytes], { type: 'application/pdf' }), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="' + name + '"' } }) }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms) }) }
  function sane(v) { if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false; var t = new Date(v + 'T00:00:00Z').getTime(); return !isNaN(t) && t > Date.now() - 2 * 864e5 && t < Date.now() + 3 * 365 * 864e5 }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254 }

  /* i menu pubblici: quello salvato dal back office, se c'e', altrimenti quello vero del sito (data/*.json) */
  var MENU_IDS = ['dinner', 'lunch', 'drinks', 'focacce', 'maritozzi'], builtIn = {};
  function menuOf(id) {
    var saved = load().menus[id];
    if (saved) return Promise.resolve(saved);
    if (id === 'maritozzi') return Promise.resolve({});
    if (!builtIn[id]) builtIn[id] = realFetch(BASE + 'data/' + id + '.json').then(function (r) { return r.ok ? r.json() : {} }).catch(function () { return {} });
    return builtIn[id];
  }

  /* lo stesso conto di admin-event-reply.mjs */
  function quoteTotal(q) {
    if (!q) return 0;
    var g = Math.max(0, Math.min(Number(q.guests) || 0, 2000)), pp = Math.max(0, Math.min(Number(q.perPerson) || 0, 100000)), flat = Math.max(0, Math.min(Number(q.flat) || 0, 1000000)), t = 0;
    if (flat > 0) t += flat; else if (g > 0 && pp > 0) t += g * pp;
    (Array.isArray(q.lines) ? q.lines : []).slice(0, 12).forEach(function (l) { t += Math.max(0, Math.min(Number(l.amount) || 0, 1000000)) });
    return t;
  }
  /* il menu del PDF, come lo pulisce admin-menu-pdf.mjs */
  function pdfMenu(b) {
    var sections = (Array.isArray(b.sections) ? b.sections : []).slice(0, 12).map(function (s) {
      return { heading: clean(s && s.heading, 40), how: clean(s && s.how, 60), items: (Array.isArray(s && s.items) ? s.items : []).slice(0, 40).map(function (i) { return clean(i, 160) }).filter(Boolean) };
    }).filter(function (s) { return s.heading && s.items.length });
    return { menuName: clean(b.menuName, 60) || 'Our menu', priceLine: clean(b.priceLine, 60), sections: sections, dietary: clean(b.dietary, 500), note: clean(b.note, 300) };
  }
  function eventLine(e) {
    if (!e) return '';
    var bits = [];
    if (e.name) bits.push(e.eventType ? e.name + ', ' + String(e.eventType).toLowerCase() : e.name);
    if (e.eventDate) bits.push(prettyDate(e.eventDate));
    if (e.guests) bits.push(e.guests + ' guests');
    return bits.join('  ·  ');
  }

  /* ---- i depositi: le stesse regole di lib/payments.mjs ---- */
  function r2(n) { return Math.round(Number(n || 0) * 100) / 100 }
  function refunded(e) { return r2((e.depositRefunds || []).filter(function (r) { return r.status !== 'failed' && r.status !== 'canceled' }).reduce(function (t, r) { return t + (Number(r.amount) || 0) }, 0)) }
  function held(e) { return e.depositPaid ? Math.max(0, r2((Number(e.depositPaidAmount) || 0) - refunded(e))) : 0 }
  function policy(e) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.eventDate || ''), h = held(e);
    var days = m ? Math.round((new Date(+m[1], +m[2] - 1, +m[3]) - new Date(new Date().toDateString())) / 864e5) : null, full = days !== null && days > 14;
    return { days: days, held: h, full: full, suggested: full ? h : 0,
      text: days === null ? 'This booking has no date, so the 14-day rule cannot be checked.' : full ? days + ' days to go: more than 14, so the terms say refund in full.'
        : days >= 0 ? days + ' day' + (days === 1 ? '' : 's') + ' to go: inside 14 days, so the terms say the deposit is kept.' : 'The event has passed, so the terms say the deposit is kept.' };
  }
  var REASONS = { 'more-than-14': 'Cancelled more than 14 days before', 'we-cancelled': 'We had to cancel the event', 'goodwill': 'Goodwill', 'duplicate': 'Paid twice by mistake', 'other': 'Other' };
  var CARDS = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express' };
  function summary(e) {
    return { id: e.id, paid: !!e.depositPaid, method: e.depositMethod || '', paidAmount: e.depositPaidAmount || 0, refunded: refunded(e), held: held(e), refunds: e.depositRefunds || [], policy: policy(e),
      card: e.stripe && e.stripe.last4 ? (CARDS[e.stripe.brand] || 'Card') + ' ending ' + e.stripe.last4 : '', livemode: !!(e.stripe && e.stripe.livemode),
      stripeUrl: e.stripe && e.stripe.paymentIntent ? '#' : '', dispute: e.depositDispute || null, reasons: REASONS };
  }

  /* ---- le statistiche del sito: inventate ma coerenti, giorno per giorno (stessa forma di admin-analytics.mjs) ---- */
  var PAGES = [['Home', 34], ['Menus', 29], ['Functions', 10], ['Book a Table', 9], ['Find Us', 7], ['Our Story', 4], ['Gift Vouchers', 3], ['Career', 2], ['Thank you', 1], ['Other', 1]];
  var REFS = [['direct', 38], ['google', 39], ['instagram', 13], ['facebook', 6], ['other', 4]];
  var HOURS = [2, 1, 1, .5, .5, 1, 2, 4, 6, 7, 8, 10, 12, 10, 7, 6, 7, 9, 11, 12, 10, 8, 5, 3];
  function split(total, weights, r) {
    var w = weights.map(function (x) { return x * (.8 + r() * .4) }), sum = w.reduce(function (a, b) { return a + b }, 0);
    return w.map(function (x) { return Math.round(total * x / sum) });
  }
  function dayStats(day, upToHour) {
    var r = rng(hash(day)), d = new Date(day + 'T12:00:00'), age = (Date.now() - d.getTime()) / 864e5;
    var season = [1.05, .85, .8, .88, .98, 1.12, 1.3, 1.36, 1.3, 1.2, 1.06, 1.18][d.getMonth()], week = [1.08, .78, .8, .86, 1, 1.24, 1.32][d.getDay()];
    var visitors = Math.round(520 * season * week * (1 - Math.min(age, 365) / 365 * .28) * (.88 + r() * .24));
    var pv = Math.round(visitors * (2.15 + r() * .45));
    var hours = split(pv, HOURS, r);
    if (upToHour != null) { var keep = hours.slice(0, upToHour + 1).reduce(function (a, b) { return a + b }, 0), f = pv ? keep / pv : 0; pv = keep; visitors = Math.round(visitors * f); hours = hours.map(function (n, h) { return h <= upToHour ? n : 0 }) }
    var pages = split(pv, PAGES.map(function (p) { return p[1] }), r), refs = split(pv, REFS.map(function (p) { return p[1] }), r), mob = Math.round(pv * (.74 + r() * .08));
    var byPage = {}, byRef = {};
    PAGES.forEach(function (p, i) { byPage[p[0]] = pages[i] }); REFS.forEach(function (p, i) { byRef[p[0]] = refs[i] });
    return { day: day, pageviews: pv, visitors: visitors, byPage: byPage, byRef: byRef, byDevice: { mobile: mob, desktop: pv - mob }, byHour: hours };
  }
  function analytics(range) {
    range = [7, 30, 90].indexOf(range) !== -1 ? range : 30;
    var today = iso(addDays(0)), hour = new Date().getHours(), days = [];
    for (var i = 60 + 30; i >= 1; i--) days.push(dayStats(shift(today, -i)));
    var t = dayStats(today, hour), extra = load().hits || 0;
    t.pageviews += extra; t.visitors += extra; t.byPage['Functions'] += extra; t.byRef.direct += extra; t.byHour[hour] += extra;
    days.push(t);
    var sum = function (from, to) { var s = days.filter(function (d) { return d.day >= from && d.day <= to }); return { pageviews: s.reduce(function (a, d) { return a + d.pageviews }, 0), visitors: s.reduce(function (a, d) { return a + d.visitors }, 0) } };
    var delta = function (c, p) { return p ? Math.round((c - p) / p * 100) : null };
    var week = sum(shift(today, -6), today), prevWeek = sum(shift(today, -13), shift(today, -7)), month = sum(shift(today, -29), today), prevMonth = sum(shift(today, -59), shift(today, -30));
    var y = dayStats(shift(today, -1)), ySoFar = y.byHour.slice(0, hour + 1).reduce(function (a, b) { return a + b }, 0);
    var from = shift(today, -(range - 1)), win = days.filter(function (d) { return d.day >= from });
    var pages = {}, ref = { direct: 0, google: 0, instagram: 0, facebook: 0, other: 0 }, dev = { mobile: 0, desktop: 0 }, hrs = HOURS.map(function () { return 0 });
    win.forEach(function (d) {
      Object.keys(d.byPage).forEach(function (p) { pages[p] = (pages[p] || 0) + d.byPage[p] });
      Object.keys(d.byRef).forEach(function (k) { ref[k] += d.byRef[k] });
      dev.mobile += d.byDevice.mobile; dev.desktop += d.byDevice.desktop; d.byHour.forEach(function (n, h) { hrs[h] += n });
    });
    var LABEL = { direct: 'Direct', google: 'Google', instagram: 'Instagram', facebook: 'Facebook', other: 'Other' };
    var refs = Object.keys(LABEL).map(function (k) { return { key: k, label: LABEL[k], n: ref[k] } });
    var top = refs.filter(function (r) { return r.key !== 'direct' }).sort(function (a, b) { return b.n - a.n })[0], all = refs.reduce(function (a, r) { return a + r.n }, 0) || 1;
    return {
      today: { pageviews: t.pageviews, visitors: t.visitors }, todayDelta: delta(t.pageviews, ySoFar),
      week: week, weekDelta: delta(week.pageviews, prevWeek.pageviews), month: month, monthDelta: delta(month.pageviews, prevMonth.pageviews),
      topSource: top && top.n ? { label: top.label, pct: Math.round(top.n / all * 100) } : null, range: range,
      series: win.map(function (d) { return { day: d.day, pageviews: d.pageviews, visitors: d.visitors } }),
      topPages: Object.keys(pages).map(function (p) { return { label: p, n: pages[p] } }).sort(function (a, b) { return b.n - a.n }).slice(0, 6),
      referrers: refs, device: dev, hours: hrs
    };
  }

  /* ---- un CV finto, in PDF: una pagina di testo semplice ---- */
  function cvPdf(a) {
    var esc = function (s) { return String(s).replace(/[^\x20-\x7E]/g, function (c) { return { '–': '-', '’': "'" }[c] || '?' }).replace(/([()\\])/g, '\\$1') };
    var rows = [[20, a.name], [12, a.role ? 'Applying for: ' + a.role : 'Spontaneous application'], [11, a.email + '  ·  ' + a.phone], [11, ''],
      [13, 'Experience'], [11, a.experience || ''], [11, (a.message || 'Hospitality, front and back of house.')], [11, ''],
      [13, 'Certificates and languages'], [11, (a.certLabel || 'Certificate') + ': ' + (a.cert || '')], [11, 'English: ' + (a.englishLevel || '') + (a.extraLangs && a.extraLangs.length ? '  ·  ' + a.extraLangs.join(', ') : '')], [11, ''],
      [13, 'Work rights'], [11, (a.visaType || '') + (a.visaExpiry ? ', until ' + a.visaExpiry : '')], [11, 'Staying in Cairns: ' + (a.lengthOfStay || '')], [11, ''],
      [9, 'Demo CV generated in the browser. The person is invented.']];
    var y = 780, ops = ['BT'];
    rows.forEach(function (r) { ops.push('/F1 ' + r[0] + ' Tf 1 0 0 1 56 ' + y + ' Tm (' + esc(r[1]) + ') Tj'); y -= r[0] + 9 });
    ops.push('ET');
    var stream = ops.join('\n'), objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
      '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'];
    var out = '%PDF-1.4\n', offs = [];
    objs.forEach(function (o, i) { offs.push(out.length); out += (i + 1) + ' 0 obj\n' + o + '\nendobj\n' });
    var x = out.length;
    out += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n' + offs.map(function (o) { return String(o).padStart(10, '0') + ' 00000 n \n' }).join('') + 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + x + '\n%%EOF\n';
    return new TextEncoder().encode(out);
  }

  var NUMBERS = { menu1Price: 2000, menu2Price: 2000, menu3Price: 2000, capacity: 5000, minGuests: 500, noticeDays: 90, maxPizza: 20, maxPasta: 20, prosecco: 500, drinksPkg: 500, drinksAf: 500, gfSupplement: 500 };
  var TEXTS = { cakeageNote: 300, noticeNote: 300, depositNote: 300, termsNote: 500, kitchenEmail: 254, menu1Name: 60, menu2Name: 60, menu3Name: 60 };

  /* ---- una funzione per ogni file in netlify/functions ---- */
  var API = {
    'event-enquiry': function (m, b, url, form) {
      if (m !== 'POST') return T('Method not allowed', 405);
      if (!form) return T('Invalid form data', 400);
      if (clean(form.get('bot-field'))) return T('ok');
      var get = function (k, max) { return clean(form.get(k), max) }, guests = parseInt(get('guests', 8), 10);
      var e = {
        id: uuid(), eventType: get('event_type', 60), eventDate: get('event_date', 10), eventTime: get('event_time', 30),
        guests: isFinite(guests) && guests > 0 ? String(Math.min(guests, 1000)) : '', dateFlexible: get('date_flexible', 40), space: get('space', 80),
        menuStyle: get('menu_style', 80), menuFocus: get('menu_focus', 80), drinks: get('drinks', 80), dietary: get('dietary', 800),
        extras: (form.getAll('extras') || []).map(function (v) { return clean(v, 80) }).filter(Boolean).slice(0, 10),
        name: get('name', 120), email: get('email', 254), phone: get('phone', 40), message: get('message', 2000), status: 'new', replies: [], createdAt: now()
      };
      if (!e.name) return T('Please tell us your name.', 400);
      if (!isEmail(e.email)) return T('That email address does not look right.', 400);
      if (!sane(e.eventDate)) return T('Please pick a date in the future.', 400);
      load().events.push(e);
      changed('enquiry', { id: e.id, name: e.name });
      /* il server vero risponde 303 verso thank-you.html?event=1: fetch lo segue e arriva un 200 */
      return T('ok');
    },
    'admin-events': function (m, b, url) {
      var s = load();
      if (m === 'GET') return J(s.events.slice().sort(function (a, c) { return (a.eventDate || '').localeCompare(c.eventDate || '') }));
      if (m === 'POST') {
        var name = clean(b.name, 120), date = clean(b.eventDate, 10), g = parseInt(b.guests, 10);
        if (!name) return T('A name is needed.', 400);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return T('Pick a date.', 400);
        var e = { id: uuid(), eventType: clean(b.eventType, 60) || 'Group booking', eventDate: date, eventTime: clean(b.eventTime, 30), guests: isFinite(g) && g > 0 ? String(Math.min(g, 1000)) : '',
          dateFlexible: clean(b.dateFlexible, 40), space: clean(b.space, 80), menuStyle: clean(b.menuStyle, 80), drinks: clean(b.drinks, 80), dietary: clean(b.dietary, 800),
          name: name, email: clean(b.email, 254), phone: clean(b.phone, 40), message: clean(b.message, 2000), status: 'new', source: 'added by staff', replies: [], createdAt: now() };
        s.events.push(e); changed('events'); return J(e, 201);
      }
      if (m === 'PATCH') {
        if (!b.id) return T('id is required', 400);
        var r = find(b.id); if (!r) return T('Not found', 404);
        if ('status' in b) { if (['new', 'quoted', 'confirmed', 'done'].indexOf(b.status) === -1) return T('Unknown status', 400); r.status = b.status }
        if ('archived' in b) r.archived = !!b.archived;
        if ('note' in b) r.staffNote = clean(b.note, 1000);
        if ('depositReceived' in b) {
          var amt = Math.max(0, Math.min(Number(b.depositReceived) || 0, 1000000));
          if (amt > 0) { r.depositPaid = true; r.depositPaidAmount = amt; r.depositPaidAt = now(); r.depositMethod = 'bank' }
          else if (r.depositMethod === 'bank') { r.depositPaid = false; delete r.depositPaidAmount; delete r.depositPaidAt; delete r.depositMethod }
        }
        if ('offerDraft' in b) { var dr = b.offerDraft && typeof b.offerDraft === 'object' ? b.offerDraft : null; r.offerDraft = dr; r.offerDraftAt = dr ? now() : null }
        if (b.inboxRead && Array.isArray(r.inbox)) r.inbox.forEach(function (x) { x.read = true });
        var ed = { eventType: 60, eventDate: 10, eventTime: 30, guests: 8, dateFlexible: 40, space: 80, menuStyle: 80, menuFocus: 80, drinks: 80, dietary: 800, name: 120, email: 254, phone: 40, message: 2000 };
        for (var k in ed) {
          if (!(k in b)) continue;
          if (k === 'eventDate' && b[k] && !/^\d{4}-\d{2}-\d{2}$/.test(String(b[k]).trim())) return T('That date does not look right.', 400);
          if (k === 'guests') { var n = parseInt(b[k], 10); r.guests = isFinite(n) && n > 0 ? String(Math.min(n, 1000)) : ''; continue }
          r[k] = clean(b[k], ed[k]);
        }
        if ('name' in b && !r.name) return T('The name cannot be empty.', 400);
        changed('events'); return J(r);
      }
      if (m === 'DELETE') { var id = url.searchParams.get('id'); if (!id) return T('id is required', 400); s.events = s.events.filter(function (x) { return x.id !== id }); changed('events'); return none() }
      return T('Method not allowed', 405);
    },
    /* il preventivo: niente mail e niente Stripe, ma la scheda cambia come col server vero */
    'admin-event-reply': function (m, b) {
      if (m !== 'POST') return T('Method not allowed', 405);
      var id = clean(b.id, 64), subject = clean(b.subject, 200), message = clean(b.message, 6000);
      if (!id) return T('id is required', 400);
      if (!subject) return T('A subject is required', 400);
      if (!message) return T('A message is required', 400);
      var e = find(id); if (!e) return T('Not found', 404);
      if (!e.email) return T('This enquiry has no email address', 400);
      var testTo = clean(b.testTo, 254);
      if (testTo && !isEmail(testTo)) return T('That test address does not look right.', 400);
      if (testTo) return J({ test: true, sent: true, to: testTo });
      var total = quoteTotal(b.quote), md = null, name = '';
      if (b.menu && Array.isArray(b.menu.sections) && b.menu.sections.length) { var pm = pdfMenu(b.menu); if (pm.sections.length) { md = pm; name = pm.menuName } }
      var files = (Array.isArray(b.files) ? b.files : []).slice(0, 4).map(function (f) { return clean(f && f.filename, 120) || 'attachment' });
      var stripe = load().settings.stripeOff ? false : true, byBank = b.depositMethod === 'bank' || !stripe, paid = !!e.depositPaid;
      var dep = (!byBank && !paid) ? Math.max(0, Math.min(Number(b.deposit) || 0, 100000)) : 0, bank = (byBank && !paid) ? Math.max(0, Math.min(Number(b.deposit) || 0, 100000)) : 0;
      e.replies = Array.isArray(e.replies) ? e.replies : [];
      e.replies.push({ at: now(), subject: subject, message: message, total: total, deposit: dep, menu: name, menuData: md, files: files, tpl: clean(b.tpl, 20), sent: true });
      if (bank > 0) e.depositRequested = bank;
      if (dep) { e.depositAmount = dep; e.depositUrl = '#'; e.depositLinkId = 'plink_demo_' + Date.now() }
      if (['new', 'quoted', 'confirmed', 'done'].indexOf(b.status) !== -1) e.status = b.status;
      else if (total > 0 && e.status === 'new') e.status = 'quoted';
      changed('events');
      return wait(500).then(function () { return J(e) });
    },
    'admin-refund': function (m, b, url) {
      if (m === 'GET') { var g = find(url.searchParams.get('id')); return g ? J(summary(g)) : T('Not found', 404) }
      if (m !== 'POST') return T('Method not allowed', 405);
      var e = find(clean(b.id, 64)); if (!e) return T('Not found', 404);
      if (!e.depositPaid) return T('No deposit has been received for this booking, so there is nothing to refund.', 400);
      var h = held(e); if (h <= 0) return T('The whole deposit has already been refunded.', 409);
      var amount = Math.round(Number(b.amount) * 100) / 100;
      if (!isFinite(amount) || amount < .01) return T('Put in the amount to refund.', 400);
      if (amount > h + .004) return T('Only $' + h.toFixed(2) + ' is still held, so that is the most that can go back.', 400);
      var key = REASONS[b.reason] ? b.reason : 'other', bank = e.depositMethod === 'bank' || !(e.stripe && e.stripe.paymentIntent);
      var row = { id: (bank ? 'bank-' : 're_demo_') + Date.now(), amount: amount, at: now(), status: 'succeeded', method: bank ? 'bank' : 'card', reason: REASONS[key] + (clean(b.note, 200) ? ' – ' + clean(b.note, 200) : ''), by: 'staff' };
      if (b.emailCustomer) row.emailed = true;
      e.depositRefunds = (e.depositRefunds || []).concat([row]); e.depositRefundedAmount = refunded(e);
      if (b.cancelBooking) { e.archived = true; e.cancelledAt = now() }
      changed('events');
      return J(Object.assign(summary(e), { done: row, emailed: !!b.emailCustomer, cancelled: !!b.cancelBooking, enquiry: e }));
    },
    'admin-kitchen-sheet': function (m, b) {
      var e = find(clean(b.id, 64)); if (!e) return T('Not found', 404);
      e.kitchenSentAt = now(); e.kitchenSentTo = clean(load().settings.kitchenEmail, 254) || 'kitchen@example.com';
      changed('events'); return wait(400).then(function () { return J(e) });
    },
    /* il PDF del menu: lo scrive il codice vero del cliente (lib/pdf.mjs), qui nel browser */
    'admin-menu-pdf': function (m, b) {
      if (m !== 'POST') return T('Method not allowed', 405);
      var menu = pdfMenu(b);
      if (!menu.sections.length) return T('Add at least one course with a dish in it.', 400);
      if (!LIB || !LIB.buildMenuPdf) return T('The PDF writer is not in this demo.', 501);
      return pdf(LIB.buildMenuPdf(Object.assign({}, menu, { eventLine: eventLine(b.id ? find(b.id) : null) })), 'vitalias-menu.pdf');
    },
    'admin-menu': function (m, b, url) {
      var id = url.searchParams.get('id');
      if (MENU_IDS.indexOf(id) === -1) return T('Unknown menu', 400);
      if (m === 'GET') return menuOf(id).then(J);
      if (m !== 'PUT' && m !== 'POST') return T('Method not allowed', 405);
      b.id = id;
      return menuOf(id).then(function (existing) {
        var menu = LIB && LIB.normaliseMenu ? LIB.normaliseMenu(b, existing) : Object.assign({}, b, { updatedAt: now() });
        if (!menu) return T('That menu has no sections with a name and no dishes, nothing to save.', 400);
        /* gli orari stampati sulle lavagne non passano dal modulo: nella demo restano */
        if (b.hours && !menu.hours) menu.hours = b.hours;
        load().menus[id] = menu; changed('menu'); return J(menu);
      });
    },
    'menu': function (m, b, url) { var id = url.searchParams.get('id'); return MENU_IDS.indexOf(id) === -1 ? T('Unknown menu', 400) : menuOf(id).then(J) },
    'print-font': function () {
      /* la lavagna usa il carattere del cliente (George, con licenza): nella demo lo sostituisce Playfair */
      return realFetch(BASE + 'assets/fonts/print/Playfair-Regular.ttf').then(function (r) { return r.ok ? new Response(r.body, { headers: { 'Content-Type': 'font/ttf' } }) : T('Not found', 404) });
    },
    'admin-settings': function (m, b) {
      var s = load();
      if (m === 'GET') return J(Object.assign({}, s.settings, { stripeReady: !s.settings.stripeOff, stripeMode: 'live', webhookReady: true }));
      if (m !== 'PUT' && m !== 'POST') return T('Method not allowed', 405);
      var next = Object.assign({}, s.settings, { id: 'functions', updatedAt: now() });
      for (var k in NUMBERS) {
        if (!(k in b)) continue;
        var raw = String(b[k] == null ? '' : b[k]).trim();
        if (raw === '') { next[k] = ''; continue }
        var n = Number(raw); if (!isFinite(n) || n < 0 || n > NUMBERS[k]) return T(k + ' looks wrong.', 400);
        next[k] = Math.round(n);
      }
      for (var t in TEXTS) if (t in b) next[t] = clean(b[t], TEXTS[t]);
      if ('bankName' in b || 'bankBsb' in b || 'bankAccount' in b) {
        var nm = clean(b.bankName, 80), bsb = String(b.bankBsb || '').replace(/[\s-]/g, ''), acct = String(b.bankAccount || '').replace(/[\s-]/g, '');
        if (bsb && !/^\d{6}$/.test(bsb)) return T('A BSB is six digits, like 123-456.', 400);
        if (acct && !/^\d{4,12}$/.test(acct)) return T('An account number is digits only, between 4 and 12.', 400);
        if ((bsb || acct) && !(bsb && acct && nm)) return T('Fill in the account name, the BSB and the account number together, or leave all three empty.', 400);
        var bb = bsb ? bsb.slice(0, 3) + '-' + bsb.slice(3) : '';
        next.bankName = nm; next.bankBsb = bb; next.bankAccount = acct; next.bankDetails = bb ? 'Account name: ' + nm + '\nBSB: ' + bb + '\nAccount number: ' + acct : '';
      }
      ['menu1Courses', 'menu2Courses', 'menu3Courses', 'menu1Lunch', 'menu2Lunch', 'menu3Lunch'].forEach(function (k) {
        if (!(k in b)) return;
        var raw = b[k] && typeof b[k] === 'object' ? b[k] : {}, out = {};
        COURSES.forEach(function (c) { var l = String(raw[c] == null ? '' : raw[c]).split('\n').map(function (x) { return clean(x, 160) }).filter(Boolean).slice(0, 20); if (l.length) out[c] = l.join('\n') });
        next[k] = out;
      });
      s.settings = next; changed('settings'); return J(next);
    },
    'settings': function () {
      var o = Object.assign({}, load().settings);
      ['id', 'updatedAt', 'bankDetails', 'bankName', 'bankBsb', 'bankAccount', 'kitchenEmail', 'stripeOff'].forEach(function (k) { delete o[k] });
      return J(o);
    },
    'admin-payments': function (m, b, url) {
      var check = url.searchParams.get('check') === '1';
      return J({ configured: true, mode: 'live', webhookSecret: true, webhookUrl: 'https://vitalias.com.au/.netlify/functions/stripe-webhook',
        events: ['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'refund.created', 'refund.updated', 'refund.failed', 'charge.refunded'],
        account: check ? { id: 'acct_demo', country: 'AU', currency: 'aud', name: 'Vitalia\'s Italian Restaurant', chargesEnabled: true, payoutsEnabled: true } : null,
        webhook: check ? { found: true, url: 'https://vitalias.com.au/.netlify/functions/stripe-webhook', status: 'enabled', missing: [] } : null, error: '' });
    },
    'admin-analytics': function (m, b, url) { return J(analytics(Number(url.searchParams.get('range')))) },
    'track': function () { track(); return none() },
    'admin-applications': function (m, b, url) {
      var s = load(), id = clean(url.searchParams.get('id'), 80), cv = clean(url.searchParams.get('cv'), 80);
      var a = s.applications.filter(function (x) { return x.id === (cv || id) })[0];
      if (m === 'GET' && cv) return a ? pdf(cvPdf(a), a.cv.name) : J({ error: 'No CV stored for this application' }, 404);
      if (m === 'GET') return J(s.applications.slice().sort(function (x, y) { return String(y.receivedAt).localeCompare(String(x.receivedAt)) }));
      if (m === 'PATCH') {
        if (!id) return J({ error: 'Missing id' }, 400);
        if (!a) return J({ error: 'Not found' }, 404);
        if (b.score !== undefined) { var n = Math.round(Number(b.score)); if (!isFinite(n) || n < -1 || n > 3) return J({ error: 'Score must be -1 to 3' }, 400); a.score = n }
        if (typeof b.notes === 'string') a.notes = clean(b.notes, 2000);
        if (Array.isArray(b.unavailable)) {
          var D = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], SH = ['m', 'a', 'e'], ok = [];
          b.unavailable.slice(0, 21).forEach(function (raw) { var c = clean(raw, 8), p = c.split('-'); if (D.indexOf(p[0]) !== -1 && SH.indexOf(p[1]) !== -1 && ok.indexOf(c) === -1) ok.push(c) });
          ok.sort(function (x, y) { var p = x.split('-'), q = y.split('-'); return D.indexOf(p[0]) - D.indexOf(q[0]) || SH.indexOf(p[1]) - SH.indexOf(q[1]) });
          a.unavailable = ok;
        }
        if (b.trial !== undefined) {
          if (b.trial === null) delete a.trial;
          else { var at = clean(b.trial.at, 40); if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(at)) return J({ error: 'Trial time must be YYYY-MM-DDTHH:MM' }, 400); a.trial = { at: at, setAt: now() } }
        }
        a.updatedAt = now(); changed('apps'); return J(a);
      }
      if (m === 'DELETE') { if (!id) return J({ error: 'Missing id' }, 400); s.applications = s.applications.filter(function (x) { return x.id !== id }); changed('apps'); return J({ ok: true }) }
      return J({ error: 'Method not allowed' }, 405);
    },
    'admin-positions': function (m, b, url) {
      var s = load();
      if (m === 'GET') return J(s.positions.slice().sort(function (x, y) { return (y.createdAt || '').localeCompare(x.createdAt || '') }));
      var lim = { role: 60, type: 40, hours: 40, level: 40, start: 40, startDate: 10, note: 600 };
      if (m === 'POST') {
        var role = clean(b.role, 60); if (!role) return T('Role is required', 400);
        var p = { id: uuid(), active: true, createdAt: now() };
        for (var k in lim) p[k] = clean(b[k], lim[k]);
        s.positions.push(p); changed('positions'); return J(p, 201);
      }
      if (m === 'PATCH') {
        if (!b.id) return T('id is required', 400);
        var q = s.positions.filter(function (x) { return x.id === b.id })[0]; if (!q) return T('Not found', 404);
        for (var j in lim) if (j in b) q[j] = clean(b[j], lim[j]);
        if ('active' in b) q.active = !!b.active;
        if ('role' in b && !q.role) return T('Role is required', 400);
        changed('positions'); return J(q);
      }
      if (m === 'DELETE') { var id = url.searchParams.get('id'); if (!id) return T('id is required', 400); s.positions = s.positions.filter(function (x) { return x.id !== id }); changed('positions'); return none() }
      return T('Method not allowed', 405);
    },
    'positions': function () { return J(load().positions.filter(function (p) { return p.active }).sort(function (x, y) { return (y.createdAt || '').localeCompare(x.createdAt || '') })) },
    'reviews': function () { return J({ id: 'google', rating: 4.5, count: 1882, updatedAt: stamp(shift(iso(addDays(0)), -12), 13, 0) }) },
    'calendar': function () { return new Response('BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Mother Machine//Demo//EN\r\nEND:VCALENDAR\r\n', { headers: { 'Content-Type': 'text/calendar' } }) },
    'admin-push-subscribe': function () { return J({ ok: true, devices: 0 }) },
    'admin-push-test': function () { return J({ ok: true, sent: 0 }) }
  };

  function parseBody(init) {
    var raw = init && init.body, out = { json: {}, form: null };
    if (!raw) return out;
    if (typeof raw === 'string') { try { out.json = JSON.parse(raw) || {} } catch (e) { out.form = new URLSearchParams(raw) } }
    else if (raw instanceof URLSearchParams || (window.FormData && raw instanceof FormData)) out.form = raw;
    return out;
  }

  window.fetch = function (input, init) {
    var u = typeof input === 'string' ? input : (input && input.url) || String(input || '');
    var m = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    var url = new URL(u, location.href);
    var hit = /\/\.netlify\/functions\/([a-z-]+)/.exec(url.pathname);
    if (hit) {
      var fn = API[hit[1]], body = parseBody(init);
      return wait(120 + Math.random() * 160).then(function () { return fn ? fn(m, body.json, url, body.form) : J({ ok: true }) });
    }
    return realFetch(input, init);
  };
})();
