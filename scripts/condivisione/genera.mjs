// Favicon e immagini di anteprima dei link (Open Graph), generate dal marchio approvato e dai font del sito.
//   node scripts/condivisione/genera.mjs
// Serve Playwright con Chromium (nell'ambiente di lavoro: /opt/node-tools, /opt/pw-browsers).
// Simbolo: "Simbolo" del kit del marchio (Approvati/04 Marchio/kit-marchio.html, "quando lo spazio e' quadrato").
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const PW = process.env.PLAYWRIGHT_MODULE || '/opt/node-tools/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);
const QUI = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(QUI, '../..');
const PUB = path.join(ROOT, 'public');
const font = n => pathToFileURL(path.join(PUB, 'fonts', fs.readdirSync(path.join(PUB, 'fonts')).find(f => f.startsWith(n)))).href;

const simbolo = fs.readFileSync(path.join(QUI, 'simbolo.svg'), 'utf8');
const marchio = fs.readFileSync(path.join(QUI, 'marchio.svg'), 'utf8');
const corpo = s => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const vb = s => s.match(/viewBox="([^"]+)"/)[1];

// luci dei piani (base.css)
const LUCE = {
  notte: { bg: '#0F0F0E', ink: '#F1EEE7', mut: '#8C887F' },
  carta: { bg: '#FBFAF7', ink: '#121211', mut: '#6B6963' },
  macchina: { bg: '#BEC2BF', ink: '#121211', mut: '#4F5551' },
  rosa2: { bg: '#EEC3B1', ink: '#121211', mut: '#6B4A3F' },
};

// una per pagina: piano, luce, titolo (quello approvato della pagina)
export const PAGINE = {
  home: { piano: '05 · Home', luce: 'notte', titolo: 'The machine behind your business.', leggero: true },
  work: { piano: '04 · Work', luce: 'notte', titolo: 'Results, not deliverables.' },
  brand: { piano: '03 · Brand', luce: 'carta', titolo: 'So the company looks as good as it runs.' },
  systems: { piano: '02 · Systems', luce: 'macchina', titolo: 'The tools your company runs on.' },
  studio: { piano: '01 · Studio', luce: 'rosa2', titolo: 'A small studio. On purpose.' },
  contact: { piano: 'G · Contact', luce: 'rosa2', titolo: 'Tell us what slows you down.' },
  progetto: { piano: '04 · Work', luce: 'notte', titolo: "Vitalia's Pizza on Wheels" },
  privacy: { piano: 'Privacy and terms', luce: 'carta', titolo: 'Privacy and terms.' },
};

// favicon: il simbolo chiaro su un quadrato notte, si legge su schede chiare e scure
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#121211"/>` +
  `<svg x="18" y="5" width="28" height="54" viewBox="${vb(simbolo)}" preserveAspectRatio="xMidYMid meet"><g fill="#F4F2EC">${corpo(simbolo)}</g></svg></svg>`;

function og(p) {
  const L = LUCE[p.luce];
  return `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:H;src:url(${font('hanken')}) format("woff2");font-weight:100 900}
@font-face{font-family:M;src:url(${font('dmmono-400')}) format("woff2");font-weight:400}
html,body{margin:0}body{width:1200px;height:630px;background:${L.bg};color:${L.ink};position:relative;overflow:hidden}
.lg{position:absolute;left:72px;top:64px;width:300px}.lg svg{width:100%;height:auto;display:block;fill:${L.ink}}
.pi{position:absolute;right:72px;top:72px;font:400 20px/1 M;letter-spacing:.1em;text-transform:uppercase}
.t{position:absolute;left:72px;right:72px;bottom:118px;font:${p.leggero ? 200 : 600} 76px/1.02 H;letter-spacing:-.035em;max-width:16ch}
.f{position:absolute;left:72px;right:72px;bottom:64px;display:flex;justify-content:space-between;font:400 18px/1 M;letter-spacing:.1em;text-transform:uppercase;color:${L.mut};border-top:1px solid ${L.mut};padding-top:18px}
</style><div class="lg">${marchio}</div><div class="pi">${p.piano}</div><div class="t">${p.titolo}</div>
<div class="f"><span>A design and engineering studio</span><span>mothermachine.studio</span></div>`;
}

const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
const pag = await b.newPage();
/* le pagine si aprono da file, cosi' i font locali (file://) si caricano */
const TMP = path.join(QUI, '.tmp.html');
async function apri(html) { fs.writeFileSync(TMP, html); await pag.goto(pathToFileURL(TMP).href, { waitUntil: 'load' }); await pag.evaluate(() => document.fonts.ready) }
fs.writeFileSync(path.join(PUB, 'favicon.svg'), FAVICON);
for (const [nome, lato] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-512.png', 512]]) {
  await pag.setViewportSize({ width: lato, height: lato });
  await apri(`<!doctype html><style>html,body{margin:0}body>svg{display:block;width:${lato}px;height:${lato}px}</style>${FAVICON}`);
  await pag.screenshot({ path: path.join(PUB, nome) });
}
fs.mkdirSync(path.join(PUB, 'og'), { recursive: true });
await pag.setViewportSize({ width: 1200, height: 630 });
for (const [nome, p] of Object.entries(PAGINE)) {
  await apri(og(p));
  await pag.screenshot({ path: path.join(PUB, 'og', `${nome}.png`) });
}
await b.close();
fs.unlinkSync(TMP);
console.log('fatto: favicon.svg, favicon-32.png, apple-touch-icon.png, icon-512.png, og/*.png');
