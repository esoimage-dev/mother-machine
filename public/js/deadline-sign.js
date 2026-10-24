// DEADLINE · il motore dell'insegna, tutto nel browser e senza AI. window.DEADLINE_SIGN
//   process(file, {clean:0..1, color:'cream'|'tomato'|'#rrggbb'}) -> Promise<{canvas, png, pixel, w, h, mode}>
//     canvas = insegna al neon 384x160 (4x), png = la stessa come Blob PNG (< 60 KB, e' quella che va al server),
//     pixel = la versione a pixel 96x40 per il canvas del gioco. mode = come e' stato trovato il logo.
//     Rifiuta (Error con .code: 'size' | 'type' | 'decode' | 'dims') se il file non va.
//   pixel(imgOrCanvas) -> canvas 96x40 a pixel ricavato da una insegna 4x (per quelle che arrivano dal server).
//   preview(canvas, kind, sign, t) disegna l'anteprima sul palazzo (ART.building se c'e', altrimenti un palazzo semplice).
// Passi: legge il file (l'SVG diventa immagine, senza codice), trova lo sfondo dai bordi (mediana, anche sfumato),
// lo toglie con la tolleranza di `clean`, toglie i puntini, ritaglia, centra e lo trasforma in un tubo al neon.
(() => {
  'use strict';
  const MAX_BYTE = 5 * 1024 * 1024;
  const MAX_LATO = 8192, MAX_MP = 40e6;
  const LAVORO = 320; // lato lungo dell'immagine su cui si lavora
  const W = 96, H = 40, S = 4, W4 = W * S, H4 = H * S;
  const PAD4 = 12; // spazio per l'alone
  const PNG_MAX = 60 * 1024;
  const COLORI = {
    cream: { tubo: [244, 236, 222], anima: [255, 255, 250] },
    tomato: { tubo: [255, 91, 58], anima: [255, 222, 208] },
  };

  const errore = (code, msg) => Object.assign(new Error(msg || code), { code });
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const lerp = (a, b, t) => a + (b - a) * t;
  const tela = (w, h) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  };
  const ctx2d = (c) => c.getContext('2d', { willReadFrequently: true });

  // ---------- lettura del file ----------
  async function tipoDi(blob) {
    const b = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
    if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
    if (String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP') return 'webp';
    const testa = (await blob.slice(0, 4096).text()).replace(/^﻿/, '');
    if (/^\s*(<\?xml[\s\S]*?\?>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(testa)) return 'svg';
    return '';
  }

  // SVG: si legge come dati (DOMParser non esegue nulla), si tolgono script, eventi, oggetti esterni,
  // si danno le misure e lo si disegna come <img> (in <img> un SVG non esegue codice e non carica niente da fuori)
  function svgPulito(testo) {
    const doc = new DOMParser().parseFromString(testo, 'image/svg+xml');
    const svg = doc.documentElement;
    if (!svg || svg.nodeName.toLowerCase() !== 'svg' || doc.getElementsByTagName('parsererror').length) throw errore('decode', 'bad svg');
    for (const el of [...doc.querySelectorAll('script, foreignObject, iframe, object, embed, audio, video')]) el.remove();
    for (const el of [svg, ...svg.querySelectorAll('*')]) {
      for (const a of [...el.attributes]) {
        const n = a.name.toLowerCase();
        if (n.startsWith('on')) el.removeAttribute(a.name);
        else if ((n === 'href' || n === 'xlink:href') && !/^#|^data:image\/(png|jpe?g|webp|gif);/i.test(a.value.trim())) el.removeAttribute(a.name);
      }
    }
    let vb = (svg.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
    const num = (v) => (/^\s*[\d.]+\s*(px)?\s*$/.test(v || '') ? parseFloat(v) : 0);
    let w = num(svg.getAttribute('width')), h = num(svg.getAttribute('height'));
    if (!(vb.length === 4 && vb[2] > 0 && vb[3] > 0)) vb = null;
    if (!(w && h)) {
      if (vb) { w = vb[2]; h = vb[3] } else { w = w || h || 512; h = h || w }
      if (!vb) svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    }
    const k = 1024 / Math.max(w, h);
    svg.setAttribute('width', String(Math.round(w * k)));
    svg.setAttribute('height', String(Math.round(h * k)));
    return new XMLSerializer().serializeToString(svg);
  }

  function immagine(blob) {
    return new Promise((ok, ko) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { URL.revokeObjectURL(url); ok(img) };
      img.onerror = () => { URL.revokeObjectURL(url); ko(errore('decode', 'cannot read image')) };
      img.src = url;
    });
  }

  const cache = new WeakMap();
  // -> {data: Uint8ClampedArray RGBA, w, h} all'interno di LAVORO x LAVORO
  function carica(file) {
    if (cache.has(file)) return cache.get(file);
    const p = (async () => {
      if (!(file instanceof Blob)) throw errore('type', 'not a file');
      if (file.size > MAX_BYTE) throw errore('size', 'file too big');
      if (file.size < 8) throw errore('type', 'empty file');
      const tipo = await tipoDi(file);
      if (!tipo) throw errore('type', 'use PNG, JPG, WebP or SVG');
      let src;
      if (tipo === 'svg') {
        src = await immagine(new Blob([svgPulito(await file.text())], { type: 'image/svg+xml' }));
      } else {
        src = await immagine(new Blob([file], { type: 'image/' + (tipo === 'jpg' ? 'jpeg' : tipo) }));
      }
      const w0 = src.naturalWidth || src.width, h0 = src.naturalHeight || src.height;
      if (!(w0 > 0 && h0 > 0)) throw errore('decode', 'empty image');
      if (w0 > MAX_LATO || h0 > MAX_LATO || w0 * h0 > MAX_MP) throw errore('dims', 'image too large');
      const k = LAVORO / Math.max(w0, h0);
      const w = Math.max(1, Math.round(w0 * k)), h = Math.max(1, Math.round(h0 * k));
      // gli immensi si scendono a passi, cosi' le linee sottili non spariscono
      let fonte = src, fw = w0, fh = h0;
      while (fw > w * 2.5) {
        const c = tela(Math.round(fw / 2), Math.round(fh / 2));
        const x = c.getContext('2d');
        x.imageSmoothingQuality = 'high';
        x.drawImage(fonte, 0, 0, c.width, c.height);
        fonte = c; fw = c.width; fh = c.height;
      }
      const c = tela(w, h);
      const x = ctx2d(c);
      x.imageSmoothingEnabled = true;
      x.imageSmoothingQuality = 'high';
      x.drawImage(fonte, 0, 0, w, h);
      return { data: x.getImageData(0, 0, w, h).data, w, h };
    })();
    cache.set(file, p);
    p.catch(() => cache.delete(file));
    return p;
  }

  // ---------- strumenti ----------
  // distanza di colore pesata (0..~255)
  const dist = (r1, g1, b1, r2, g2, b2) => {
    const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
    return Math.sqrt(2 * dr * dr + 4 * dg * dg + 3 * db * db) / 3;
  };
  function mediana(vals) {
    if (!vals.length) return 0;
    const a = Float32Array.from(vals).sort();
    return a[a.length >> 1];
  }
  function otsu(hist) {
    let tot = 0, somma = 0;
    for (let i = 0; i < 256; i++) { tot += hist[i]; somma += i * hist[i] }
    let wB = 0, sB = 0, best = 0, soglia = 0;
    for (let i = 0; i < 256; i++) {
      wB += hist[i];
      if (!wB) continue;
      const wF = tot - wB;
      if (!wF) break;
      sB += i * hist[i];
      const mB = sB / wB, mF = (somma - sB) / wF;
      const v = wB * wF * (mB - mF) * (mB - mF);
      if (v > best) { best = v; soglia = i }
    }
    return soglia;
  }
  // distanza (chamfer 3-4, in pixel) di ogni pixel acceso dal pixel spento piu' vicino; fuori = spento
  function distanze(bin, w, h) {
    const d = new Float32Array(w * h);
    const INF = 1e9;
    for (let i = 0; i < w * h; i++) d[i] = bin[i] ? INF : 0;
    const g = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : d[y * w + x]);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!d[i]) continue;
      d[i] = Math.min(d[i], g(x - 1, y) + 3, g(x, y - 1) + 3, g(x - 1, y - 1) + 4, g(x + 1, y - 1) + 4);
    }
    for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      if (!d[i]) continue;
      d[i] = Math.min(d[i], g(x + 1, y) + 3, g(x, y + 1) + 3, g(x + 1, y + 1) + 4, g(x - 1, y + 1) + 4);
    }
    for (let i = 0; i < w * h; i++) d[i] /= 3;
    return d;
  }
  // sfocatura a scatola, tre passate (quasi gaussiana) su un canale
  function sfoca(src, w, h, r) {
    let a = Float32Array.from(src), b = new Float32Array(w * h);
    for (let p = 0; p < 3; p++) {
      for (let y = 0; y < h; y++) {
        let s = 0;
        for (let x = -r; x <= r; x++) s += a[y * w + clamp(x, 0, w - 1)];
        for (let x = 0; x < w; x++) {
          b[y * w + x] = s / (2 * r + 1);
          s += a[y * w + clamp(x + r + 1, 0, w - 1)] - a[y * w + clamp(x - r, 0, w - 1)];
        }
      }
      for (let x = 0; x < w; x++) {
        let s = 0;
        for (let y = -r; y <= r; y++) s += b[clamp(y, 0, h - 1) * w + x];
        for (let y = 0; y < h; y++) {
          a[y * w + x] = s / (2 * r + 1);
          s += b[clamp(y + r + 1, 0, h - 1) * w + x] - b[clamp(y - r, 0, h - 1) * w + x];
        }
      }
    }
    return a;
  }
  // gruppi di pixel accesi (4 vicini): toglie quelli piu' piccoli di minimo
  function togliPuntini(m, w, h, minimo) {
    const lab = new Int32Array(w * h).fill(-1);
    const coda = new Int32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      if (m[i] < 0.5 || lab[i] !== -1) continue;
      let n = 0, testa = 0;
      coda[n++] = i; lab[i] = i;
      while (testa < n) {
        const j = coda[testa++], x = j % w, y = (j / w) | 0;
        const v = [x > 0 ? j - 1 : -1, x < w - 1 ? j + 1 : -1, y > 0 ? j - w : -1, y < h - 1 ? j + w : -1];
        for (const k of v) if (k >= 0 && lab[k] === -1 && m[k] >= 0.5) { lab[k] = i; coda[n++] = k }
      }
      if (n < minimo) for (let q = 0; q < n; q++) m[coda[q]] = 0;
    }
    // i bordi morbidi rimasti attaccati a niente si spengono
    for (let i = 0; i < w * h; i++) if (m[i] > 0 && m[i] < 0.5) {
      const x = i % w, y = (i / w) | 0;
      let vicino = false;
      for (let dy = -1; dy <= 1 && !vicino; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < w && yy < h && m[yy * w + xx] >= 0.5) { vicino = true; break }
      }
      if (!vicino) m[i] = 0;
    }
  }
  const morbido = (v, a, b) => { const t = clamp((v - a) / (b - a || 1), 0, 1); return t * t * (3 - 2 * t) };

  // ---------- trovare il logo ----------
  // -> {m: Float32Array 0..1 (1 = logo), mode}
  function maschera(img, clean) {
    const { data, w, h } = img;
    const n = w * h;
    const m = new Float32Array(n);
    const bordo = [];
    const B = Math.max(1, Math.round(Math.min(w, h) * 0.01));
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x < B || y < B || x >= w - B || y >= h - B) bordo.push(y * w + x);
    let trasp = 0, semi = 0;
    for (const i of bordo) if (data[i * 4 + 3] < 200) trasp++;
    for (let i = 0; i < n; i++) if (data[i * 4 + 3] < 250) semi++;
    let mode;

    if (trasp > bordo.length * 0.25) {
      // PNG gia' trasparente: conta l'alfa
      mode = 'alpha';
      const s = lerp(0.12, 0.6, clean);
      for (let i = 0; i < n; i++) m[i] = morbido(data[i * 4 + 3] / 255, s * 0.6, s * 1.4 + 0.05);
    } else {
      // sfondo dai bordi: profili dei quattro lati filtrati con la mediana (il logo che tocca il bordo non conta),
      // poi una stima liscia dello sfondo per ogni punto (patch di Coons): va bene per pieno e per sfumato
      const R = Math.max(4, Math.round(Math.max(w, h) * 0.05));
      const lato = (len, px) => {
        const out = new Float32Array(len * 3);
        for (let c = 0; c < 3; c++) for (let t = 0; t < len; t++) {
          const v = [];
          for (let k = Math.max(0, t - R); k <= Math.min(len - 1, t + R); k++) for (let q = 0; q < B; q++) v.push(data[px(k, q) * 4 + c]);
          out[t * 3 + c] = mediana(v);
        }
        return out;
      };
      const T = lato(w, (x, q) => q * w + x), Bo = lato(w, (x, q) => (h - 1 - q) * w + x);
      const L = lato(h, (y, q) => y * w + q), Rr = lato(h, (y, q) => y * w + (w - 1 - q));
      const C = (a, i, b, j, c) => (a[i * 3 + c] + b[j * 3 + c]) / 2;
      const sfondo = new Float32Array(n * 3);
      for (let y = 0; y < h; y++) {
        const v = h > 1 ? y / (h - 1) : 0;
        for (let x = 0; x < w; x++) {
          const u = w > 1 ? x / (w - 1) : 0;
          for (let c = 0; c < 3; c++) {
            const c00 = C(T, 0, L, 0, c), c10 = C(T, w - 1, Rr, 0, c), c01 = C(Bo, 0, L, h - 1, c), c11 = C(Bo, w - 1, Rr, h - 1, c);
            sfondo[(y * w + x) * 3 + c] = (1 - v) * T[x * 3 + c] + v * Bo[x * 3 + c] + (1 - u) * L[y * 3 + c] + u * Rr[y * 3 + c] -
              ((1 - u) * (1 - v) * c00 + u * (1 - v) * c10 + (1 - u) * v * c01 + u * v * c11);
          }
        }
      }
      const dd = new Float32Array(n);
      const hist = new Float64Array(256);
      for (let i = 0; i < n; i++) {
        const a = data[i * 4 + 3] / 255;
        // un pixel semitrasparente si guarda sopra lo sfondo stimato
        const r = data[i * 4] * a + sfondo[i * 3] * (1 - a), g = data[i * 4 + 1] * a + sfondo[i * 3 + 1] * (1 - a), b = data[i * 4 + 2] * a + sfondo[i * 3 + 2] * (1 - a);
        dd[i] = dist(r, g, b, sfondo[i * 3], sfondo[i * 3 + 1], sfondo[i * 3 + 2]);
        hist[clamp(Math.round(dd[i]), 0, 255)]++;
      }
      // quanto e' "ruvido" il bordo: una foto ha bordi pieni di dettagli
      const ruvido = mediana(bordo.map((i) => dd[i]).filter((_, k) => k % 3 === 0));
      const ruvido80 = (() => { const a = Float32Array.from(bordo.map((i) => dd[i])).sort(); return a[Math.floor(a.length * 0.8)] })();
      let t = clamp(otsu(hist), 10, 110);
      t *= lerp(0.6, 1.6, clean);
      let quanti = 0;
      for (let i = 0; i < n; i++) if (dd[i] > t) quanti++;
      const foto = ruvido > 14 || ruvido80 > 40 || quanti > n * 0.82 || quanti < n * 0.002;
      if (!foto) {
        mode = 'background';
        for (let i = 0; i < n; i++) m[i] = morbido(dd[i], t * 0.7, t * 1.25);
      } else {
        // ripiego: soglia sulla luminosita' (Otsu); il logo e' la parte che non somiglia ai bordi
        mode = 'luminance';
        const lum = new Float32Array(n);
        const hl = new Float64Array(256);
        for (let i = 0; i < n; i++) {
          lum[i] = 0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2];
          hl[clamp(Math.round(lum[i]), 0, 255)]++;
        }
        const s = otsu(hl);
        let lb = 0;
        for (const i of bordo) lb += lum[i];
        lb /= bordo.length;
        const scuro = lb > s; // bordo chiaro -> il logo e' scuro
        const sp = lerp(-25, 25, clean);
        for (let i = 0; i < n; i++) m[i] = scuro ? morbido(s - sp - lum[i], -6, 6) : morbido(lum[i] - s - sp, -6, 6);
      }
    }

    // la "targhetta": se il logo sta su una forma piena di un colore (il quadrato di un'icona, un cerchio),
    // con clean alto si toglie anche quella e resta il segno dentro
    if (clean >= 0.35) {
      const bin = new Uint8Array(n);
      let area = 0;
      for (let i = 0; i < n; i++) if (m[i] >= 0.5) { bin[i] = 1; area++ }
      const d = area > n * 0.12 ? distanze(bin, w, h) : null;
      let spesso = 0;
      if (d) for (let i = 0; i < n; i++) if (d[i] > spesso) spesso = d[i];
      // solo una forma davvero piena (spessa), non un logo a tratti grossi
      if (d && spesso >= Math.min(w, h) * 0.14) {
        const r = [], g = [], b = [];
        for (let i = 0; i < n; i++) if (bin[i] && d[i] >= 2 && d[i] <= 4) { r.push(data[i * 4]); g.push(data[i * 4 + 1]); b.push(data[i * 4 + 2]) }
        if (r.length > 30) {
          const pr = mediana(r), pg = mediana(g), pb = mediana(b);
          let simili = 0;
          for (let k = 0; k < r.length; k++) if (dist(r[k], g[k], b[k], pr, pg, pb) < 30) simili++;
          if (simili > r.length * 0.85) {
            const hh = new Float64Array(256);
            const dp = new Float32Array(n);
            for (let i = 0; i < n; i++) if (bin[i]) { dp[i] = dist(data[i * 4], data[i * 4 + 1], data[i * 4 + 2], pr, pg, pb); hh[clamp(Math.round(dp[i]), 0, 255)]++ }
            const tp = clamp(otsu(hh), 14, 110);
            let dentro = 0;
            for (let i = 0; i < n; i++) if (bin[i] && dp[i] > tp && d[i] > 3) dentro++;
            if (dentro > area * 0.03 && dentro < area * 0.75) {
              mode += '+plate';
              for (let i = 0; i < n; i++) m[i] = bin[i] ? m[i] * morbido(dp[i], tp * 0.7, tp * 1.25) : 0;
            }
          }
        }
      }
    }
    togliPuntini(m, w, h, Math.max(3, Math.round(n * lerp(0.00002, 0.0008, clean))));
    return { m, mode };
  }

  // ---------- il neon ----------
  function rgb(col) {
    if (COLORI[col]) return COLORI[col];
    const x = /^#?([0-9a-f]{6})$/i.exec(String(col || ''));
    if (!x) return COLORI.cream;
    const v = parseInt(x[1], 16);
    const t = [(v >> 16) & 255, (v >> 8) & 255, v & 255];
    return { tubo: t, anima: t.map((c) => Math.round(lerp(c, 255, 0.78))) };
  }

  // maschera di lavoro -> insegna 4x: ritaglio, centro, tubo, anima, alone
  function neon(m, w, h, col, conAlone) {
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (m[y * w + x] >= 0.5) {
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    const vuota = x1 < 0;
    const out = tela(W4, H4);
    const o = ctx2d(out);
    // maschera ritagliata -> canvas alfa -> scalata sulla tela 4x
    const mw = vuota ? 1 : x1 - x0 + 1, mh = vuota ? 1 : y1 - y0 + 1;
    const mc = tela(mw + 2, mh + 2);
    const mx = ctx2d(mc);
    const id = mx.createImageData(mw + 2, mh + 2);
    if (!vuota) for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) {
      const k = ((y + 1) * (mw + 2) + x + 1) * 4;
      id.data[k] = id.data[k + 1] = id.data[k + 2] = 255;
      id.data[k + 3] = Math.round(m[(y + y0) * w + x + x0] * 255);
    }
    mx.putImageData(id, 0, 0);
    const k = Math.min((W4 - 2 * PAD4) / mw, (H4 - 2 * PAD4) / mh);
    const dw = mw * k, dh = mh * k;
    const tmp = tela(W4, H4);
    const tx = ctx2d(tmp);
    tx.imageSmoothingEnabled = true;
    tx.imageSmoothingQuality = 'high';
    if (vuota) {
      // niente trovato: una cornice, per non lasciare il palazzo al buio
      tx.strokeStyle = '#fff'; tx.lineWidth = 6;
      tx.strokeRect(PAD4 + 8, PAD4 + 8, W4 - 2 * PAD4 - 16, H4 - 2 * PAD4 - 16);
    } else {
      tx.drawImage(mc, 1, 1, mw, mh, (W4 - dw) / 2, (H4 - dh) / 2, dw, dh);
    }
    const a = tx.getImageData(0, 0, W4, H4).data;
    const n = W4 * H4;
    const bin = new Uint8Array(n);
    const al = new Float32Array(n);
    for (let i = 0; i < n; i++) { al[i] = a[i * 4 + 3] / 255; bin[i] = al[i] >= 0.5 ? 1 : 0 }
    const d = distanze(bin, W4, H4);
    const TUBO = 7, A0 = 2.4, A1 = 4.6;
    const { tubo, anima } = col;
    const luce = new Float32Array(n); // quanto e' acceso il tubo (per l'alone)
    const res = o.createImageData(W4, H4);
    const p = res.data;
    for (let i = 0; i < n; i++) {
      const di = d[i];
      // bordo esterno morbido: l'alfa scalata; bordo interno del tubo morbido
      const fuori = bin[i] ? 1 : al[i] * 2;
      if (fuori <= 0.01) continue;
      const t = di <= 0 ? fuori : clamp(TUBO + 1 - di, 0, 1);
      const anim = di >= A0 - 1 && di <= A1 + 1 ? clamp(Math.min(di - (A0 - 1), A1 + 1 - di), 0, 1) : 0;
      const vetro = di > TUBO ? 0.1 : 0; // dentro le forme piene: vetro appena acceso
      const alfa = Math.max(t, vetro);
      if (alfa <= 0) continue;
      luce[i] = t;
      const q = i * 4;
      p[q] = Math.round(lerp(tubo[0], anima[0], anim));
      p[q + 1] = Math.round(lerp(tubo[1], anima[1], anim));
      p[q + 2] = Math.round(lerp(tubo[2], anima[2], anim));
      p[q + 3] = Math.round(alfa * 255);
    }
    if (conAlone) {
      // alone: il tubo sfocato, sotto, solo dove non c'e' gia' il tubo
      const s = sfoca(luce, W4, H4, 4);
      for (let i = 0; i < n; i++) {
        const q = i * 4;
        const ha = Math.min(1, s[i] * 1.1) * 0.5;
        if (ha < 0.02) continue;
        const fa = p[q + 3] / 255;
        const ra = fa + ha * (1 - fa);
        if (ra <= 0) continue;
        for (let c = 0; c < 3; c++) p[q + c] = Math.round((p[q + c] * fa + tubo[c] * ha * (1 - fa)) / ra);
        p[q + 3] = Math.round(ra * 255);
      }
    }
    o.putImageData(res, 0, 0);
    return out;
  }

  // insegna 4x (anche caricata dal server) -> 96x40 a pixel: si contano i pixel del tubo per ogni blocco 4x4
  function pixel(src) {
    const c4 = tela(W4, H4);
    const x4 = ctx2d(c4);
    x4.drawImage(src, 0, 0, W4, H4);
    const a = x4.getImageData(0, 0, W4, H4).data;
    const out = tela(W, H);
    const o = ctx2d(out);
    const res = o.createImageData(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let acc = 0, r = 0, g = 0, b = 0;
      for (let dy = 0; dy < S; dy++) for (let dx = 0; dx < S; dx++) {
        const q = ((y * S + dy) * W4 + x * S + dx) * 4;
        if (a[q + 3] < 150) continue;
        acc++; r += a[q]; g += a[q + 1]; b += a[q + 2];
      }
      if (acc < 5) continue;
      const q = (y * W + x) * 4;
      res.data[q] = r / acc; res.data[q + 1] = g / acc; res.data[q + 2] = b / acc;
      res.data[q + 3] = 255;
    }
    o.putImageData(res, 0, 0);
    return out;
  }

  const comeBlob = (c) => new Promise((ok) => c.toBlob((b) => ok(b), 'image/png'));

  async function process(file, opt = {}) {
    const clean = clamp(opt.clean == null ? 0.5 : +opt.clean || 0, 0, 1);
    const col = rgb(opt.color || 'cream');
    const img = await carica(file);
    const { m, mode } = maschera(img, clean);
    let canvas = neon(m, img.w, img.h, col, true);
    let png = await comeBlob(canvas);
    if (png && png.size > PNG_MAX) { canvas = neon(m, img.w, img.h, col, false); png = await comeBlob(canvas) }
    if (!png || png.size > PNG_MAX) {
      // ultimo tentativo: piu' pulito
      const r = maschera(img, 1);
      canvas = neon(r.m, img.w, img.h, col, false);
      png = await comeBlob(canvas);
    }
    if (!png || png.size > PNG_MAX) throw errore('size', 'sign too detailed');
    return { canvas, png, pixel: pixel(canvas), w: W4, h: H4, mode };
  }

  // ---------- anteprima sul palazzo ----------
  const TIPI = ['food', 'fashion', 'shop', 'beauty', 'hotel', 'services'];
  // palazzo semplice di riserva, se ART non c'e': sagome dei sei tipi a pixel
  function palazzo(c, kind, x, y, w, h, t) {
    const notte = '#0F0F0E', muro = '#1a1a1f', riga = '#2c2c33', luce = '#F4F2EC';
    c.fillStyle = muro; c.fillRect(x, y, w, h);
    c.fillStyle = riga; c.fillRect(x, y, w, 1); c.fillRect(x, y, 1, h); c.fillRect(x + w - 1, y, 1, h);
    const finestre = (fx, fy, fw, fh, gx, gy, cols, rows) => {
      for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
        const acc = ((k * 7 + r * 13 + Math.floor(t / 3)) % 5) > 1;
        c.fillStyle = acc ? 'rgba(244,242,236,.55)' : '#26262c';
        c.fillRect(fx + k * (fw + gx), fy + r * (fh + gy), fw, fh);
      }
    };
    const insegnaY = y + 6;
    if (kind === 'food') {
      c.fillStyle = '#FF5B3A';
      for (let i = 0; i < w - 8; i += 6) c.fillRect(x + 4 + i, y + h - 26, 3, 5);
      finestre(x + 6, y + h - 18, 10, 12, 6, 0, Math.floor((w - 12) / 16), 1);
    } else if (kind === 'fashion') {
      c.fillStyle = 'rgba(244,242,236,.18)'; c.fillRect(x + 4, y + h - 30, w - 8, 26);
      c.fillStyle = luce; c.fillRect(x + w / 2 - 1, y + h - 26, 3, 16);
    } else if (kind === 'shop') {
      for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#2a2a30' : '#33333a'; c.fillRect(x + 6, y + h - 26 + i * 4, w - 12, 4) }
      c.fillStyle = riga; c.fillRect(x + w - 6, y - 10, 1, 10);
    } else if (kind === 'beauty') {
      finestre(x + 5, y + 54, 6, 8, 4, 6, Math.floor((w - 10) / 10), 6);
    } else if (kind === 'hotel') {
      finestre(x + 4, y + 54, 5, 5, 3, 3, Math.floor((w - 8) / 8), 10);
    } else {
      finestre(x + 5, y + 54, 12, 6, 4, 4, Math.floor((w - 10) / 16), 8);
    }
    c.fillStyle = notte; c.fillRect(x, y + h, w, 1);
    return insegnaY;
  }

  function preview(canvas, kind, sign, t = 0) {
    if (!canvas || !canvas.getContext) return;
    const c = canvas.getContext('2d');
    const k = TIPI.includes(kind) ? kind : 'services';
    // scena logica 160x120, ingrandita a numero intero
    const LW = 160, LH = 120;
    const sc = Math.max(1, Math.floor(Math.min(canvas.width / LW, canvas.height / LH)));
    const ox = Math.floor((canvas.width - LW * sc) / 2), oy = Math.floor((canvas.height - LH * sc) / 2);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = '#0F0F0E';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.setTransform(sc, 0, 0, sc, ox, oy);
    c.imageSmoothingEnabled = false;
    const px = sign && sign.pixel ? sign.pixel : sign && (sign.img || sign.canvas || sign);
    const big = sign && sign.canvas ? sign.canvas : null;
    const nome = (sign && sign.name) || '';
    const bx = 24, by = 14, bw = 112, bh = 104;
    const A = window.DEADLINE_ART;
    let fatto = false;
    if (A && typeof A.building === 'function') {
      try { A.building(c, k, bx, by, bw, bh, t, px ? { img: px, name: nome } : null); fatto = true } catch {}
    }
    if (!fatto) {
      const sy = palazzo(c, k, bx, by, bw, bh, t);
      if (px && px.width) {
        // targa scura e insegna a pixel, poi la luce morbida a risoluzione piena
        c.fillStyle = '#0b0b0d';
        c.fillRect(bx + (bw - W) / 2 - 2, sy - 2, W + 4, H + 4);
        c.drawImage(px, bx + (bw - W) / 2, sy, W, H);
        if (big) {
          c.save();
          c.setTransform(sc, 0, 0, sc, ox, oy);
          c.globalCompositeOperation = 'lighter';
          c.globalAlpha = 0.35;
          c.imageSmoothingEnabled = true;
          c.drawImage(big, bx + (bw - W) / 2, sy, W, H);
          c.restore();
        }
      }
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
  }

  window.DEADLINE_SIGN = { process, pixel, preview, W, H, SCALE: S, TIPI };
})();
