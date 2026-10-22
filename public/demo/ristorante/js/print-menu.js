/* Vitalia's print menus.
 *
 * Turns a menu (the same data the website and the backoffice use) into print-ready
 * A5 faces and A4 sheets imposed for a folded booklet. Everything is laid out in the
 * design units of the owner's Figma file (a face is 1471 x 2158 units = 210 mm tall),
 * then scaled to millimetres, so the paper matches the Figma down to the unit.
 *
 * Nothing here is eyeballed: every number in RULES was read off the Figma export.
 * A face never grows and never shrinks its type. If a page's dishes do not fit, the
 * face is marked as over and the report says by how many lines; the caller decides
 * (the backoffice refuses to hand out a PDF while any face is over).
 */
(function () {
  'use strict';

  var MM_PER_U = 210 / 2158;
  var PX_PER_MM = 96 / 25.4;
  var SCALE = MM_PER_U * PX_PER_MM;          // one design unit in CSS px

  var RULES = {
    face: { w: 1471, h: 2158 },
    rule: { x0: 109, x1: 1362, top: 149, bottom: 2007, weight: 2 },
    title: { baseline: 116.3 },
    foot: { baseline: 2060.8, lineStep: 34 },
    content: {
      x: { left: 156, right: 170 },          // right-hand pages sit 14 units further out
      firstBaseline: 278,
      lastBaseline: 1900,                     // nothing may sit lower: ~10 mm above the footer rule
      priceRight: 1146                        // from the content edge
    },
    dish: {
      descFirst: 48, descLine: 38,            // first description line, then every line
      optFirst: 46,                           // options / choices under the description
      next: 130.8,                            // last line of a dish to the next dish's name
      priceShift: -2,                         // the price sits on the name's line
      nameRoom: 60,                           // minimum gap between a name and its price
      maxDescLines: 3,                        // a longer description must be shortened
      secondTitleGap: 190,                    // a second list on a face: last line to its title
      price2Step: 150                         // two prices on a row (coffee M, L): the first sits this far in
    }
  };

  // The booklet: faces in reading order, and how they land on the A4 sheets.
  // A sheet is [front, back]; a side is [left face, right face], as reading positions.
  var BOOKLETS = {
    dinner: {
      faces: ['cover', 'starters', 'pasta', 'pizza-1', 'pizza-2', 'mains', 'sides', 'dolce'],
      sheets: [[[8, 1], [2, 7]], [[6, 3], [4, 5]]],
      spreads: [[1], [2, 3], [4, 5], [6, 7], [8]],
      cover: 'assets/print/dinner-cover.svg'
    },
    // The lunch menu is laid out exactly like dinner: same faces, same sheets. A face that
    // holds two lists (salads, then mains) names them in `compose`.
    lunch: {
      faces: ['cover', 'pasta', 'salads', 'pizza-1', 'pizza-2', 'dolce', 'soft-drinks', 'coffee'],
      compose: { salads: ['salads', 'mains'] },
      sheets: [[[8, 1], [2, 7]], [[6, 3], [4, 5]]],
      spreads: [[1], [2, 3], [4, 5], [6, 7], [8]],
      cover: 'assets/print/dinner-cover.svg'
    },
    // Three A4 sheets, twelve A5 faces. Reading order and imposition read off the
    // owner's Figma export (svg menu drink): sheet 1 front = back cover | cover,
    // sheet 1 back = Soft drinks & coffee | Liqueurs, and so on inwards.
    drinks: {
      kind: 'drinks',
      faces: ['cover', 'soft-coffee', 'beers', 'cocktails', 'mocktails', 'red-wines', 'white-wines',
              'sparkling', 'cellar', 'spirits', 'liqueurs', 'back'],
      sheets: [[[12, 1], [2, 11]], [[10, 3], [4, 9]], [[8, 5], [6, 7]]],
      spreads: [[1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12]],
      cover: 'assets/print/drinks-cover.svg',
      back: 'assets/print/drinks-back.svg',
      icons: 'assets/print/wine-icons.svg'
    }
  };

  /* The drinks list, measured on the same Figma face (1471 x 2158 units). A drink is
     smaller than a dish (name 40, description 28 on a 36 line) and the page holds
     more: groups with a word down the side and a rule beside them, prices in up to
     three columns, a vintage before the name, a wine's region after it. */
  var DRINK = {
    foot: { baseline: 2060.1 },
    firstBaseline: 278,
    lastBaseline: 1940,                       // where the fullest Figma page (coffee) ends
    nameNext: 93,                             // name to the next name, no description
    descFirst: 46.44, descLine: 36,
    next: 93.4,                               // last description line to the next name
    priceShift: -3.6, nameRoom: 30, maxDescLines: 3, descMax: 1000,
    descGrouped: 838,                         // the Figma's column: every description keeps its line count
    side: { contentX: 204, lineX: 163, labelBaseline: 137.32, lineAbove: 28, minGap: 107.5 },
    head: { firstLabel: 198, labelToName: 93, ruleAfter: 64.4, labelAfterRule: 47 },
    year: { before: 6, nameAfter: 85, shift: -3.4 },   // vintage column, name pushed right
    cols: { centredStep: 97, centredInset: 15.5, rightStep: 108 },
    note: { after: 50.7 }
  };
  // Where the Figma pages differ from the defaults. A gap is the space from a group's
  // last line to the next group's first name; it gives way down to side.minGap before
  // a page is ever reported as over.
  var DRINK_PAGE = {
    'soft-coffee': { first: 257 },
    'beers': { gap: 177 },
    'red-wines': { first: 436, gap: 173 },
    'white-wines': { first: 436, gap: 173 },
    'sparkling': { first: 436, gap: 213 },
    'cellar': { next: 98.4 },
    'spirits': { gap: 169 }
  };

  /* ---- the outdoor boards: one big face each, the whole menu in columns ----
     Measured on the owner's Figma (svg menu stand outdoor), in its own units. A board
     reads several menus (the lunch board takes focacce and maritozzi from their own
     menu), so a section names its menu. A section's title sits a fixed gap under the
     one above it, or at its Figma position if that is lower (`top`), so the columns
     line up as designed and still make room when a dish is added. */
  var BOARDS = {
    'board-dinner': {
      kind: 'board', W: 7015, H: 4961, mm: [594, 420], label: 'A2 · 594 × 420 mm',
      frame: 'assets/print/board-dinner.svg', hours: 'dinner',
      size: { title: 175.158, name: 58.386, desc: 38.924, descLine: 51.70, tag: 28.2928, rise: 41.18, aside: 41.351, size: 49.2 },
      rhythm: { firstTitle: 1028.31, titleToName: 173.79, descFirst: 61.35, next: 131.0, gap: 301.8, asideShift: -3.6, titleIn: 7 },
      descW: 1330, surcharge: { cx: 6108.3, y: 4775.59 },
      qr: { book: [6704, 351, 302], ja: [3853.8, 4339, 296], zh: [4928.95, 4340.9, 296] },
      cols: [
        { x: 153, price: 1669, dw: 1290, limit: 4800, secs: [{ src: 'dinner', ids: ['starters'] }, { src: 'dinner', ids: ['pasta'], aside: 'foot' }] },
        { x: 1886.36, price: 3398, dw: 1135, limit: 4800, secs: [{ src: 'dinner', ids: ['pizza-1', 'pizza-2'], aside: 'foot' }] },
        { x: 3619.36, price: 5131, dw: 1330, limit: 4010, secs: [{ src: 'dinner', ids: ['mains'] }, { src: 'dinner', ids: ['sides'], top: 2533.31 }] },
        { x: 5349.36, price: 6861, dw: 1235, limit: 3360, secs: [{ src: 'dinner', ids: ['dolce'] }] }
      ]
    },
    'board-lunch': {
      kind: 'board', W: 8563, H: 4606, mm: [730, 395], label: 'Custom · 730 × 395 mm',
      frame: 'assets/print/board-lunch.svg', hours: 'lunch',
      size: { title: 175.983, name: 58.6611, desc: 39.1074, descLine: 47.0, tag: 29, rise: 38.9, aside: 41.5459, size: 49.2 },
      rhythm: { firstTitle: 914.89, titleToName: 173.4, descFirst: 61.45, next: 122.04, gap: 288, asideShift: -0.6, titleIn: 7 },
      descW: 1300, surcharge: { cx: 7623.25, y: 4355.59 },
      qr: { book: [8214, 350, 302], ja: [5940.95, 2571.6, 282], zh: [5942, 3799.6, 282] },
      cols: [
        { x: 174, price: 1691, dw: 1355, limit: 4440, secs: [{ src: 'focacce', ids: ['focacce'] }, { src: 'focacce', ids: ['maritozzi'], top: 2626.89 }] },
        { x: 1842.3, price: 3362, dw: 1290, limit: 4440, secs: [{ src: 'lunch', ids: ['pasta'], aside: 'foot' }, { src: 'lunch', ids: ['salads'], top: 2373.37 }, { src: 'lunch', ids: ['mains'], top: 3632.89 }] },
        { x: 3514.4, price: 5032, dw: 1140, limit: 4440, secs: [{ src: 'lunch', ids: ['pizza-1', 'pizza-2'], aside: 'foot' }] },
        { x: 5187.4, price: 6703, dw: 1095, limit: 2260, secs: [{ src: 'lunch', ids: ['dolce'] }] },
        { x: 6854.3, price: 8375, price1: 8195, dw: 1110, limit: 4150, secs: [{ src: 'lunch', ids: ['coffee'] }, { src: 'lunch', ids: ['soft-drinks'], top: 2629.89 }] }
      ]
    }
  };

  // The face's own styles travel with the engine, so it lays out the same in the print
  // page and inside the backoffice. Paths are absolute: both pages live at the root.
  // Chinese and Japanese read the same rules (same baselines, same line budget) with
  // their own typeface standing in for Lora wherever a face is tagged with that
  // language. Noto Serif SC/JP, subset to GB2312 / JIS X 0208 plus every character
  // the menu uses today, so a future edit never meets a missing glyph.
  var CJK_FONT = { zh: 'Noto Serif SC', ja: 'Noto Serif JP' };
  var CORE_CSS = [
    "@font-face{font-family:'Lora';src:url(assets/fonts/print/Lora-Regular.ttf) format('truetype');font-weight:400}",
    "@font-face{font-family:'Lora';src:url(assets/fonts/print/Lora-Medium.ttf) format('truetype');font-weight:500}",
    "@font-face{font-family:'Playfair';src:url(assets/fonts/print/Playfair-Regular.ttf) format('truetype');font-weight:400}",
    "@font-face{font-family:'Alex Brush';src:url(assets/fonts/print/AlexBrush-Regular.ttf) format('truetype');font-weight:400}",
    ".pm-face{position:relative;width:1471px;height:2158px;background:#fff;overflow:hidden;color:#000;text-align:left;letter-spacing:0}",
    ".pm-stage{position:absolute;left:-99999px;top:0}",
    ".pm-abs{position:absolute;white-space:nowrap}",
    ".pm-rule{position:absolute;background:#000}",
    ".pm-title{font:400 60px/60px 'Playfair',serif;letter-spacing:.02em}",
    ".pm-foot{font:400 24px/24px 'Lora',serif}",
    ".pm-name{font:500 44px/44px 'Lora',serif}",
    ".pm-tag{font:500 23px 'Lora',serif;vertical-align:21.7px;margin-left:5px}",
    ".pm-price{font:400 35px/35px 'Lora',serif}",
    ".pm-desc,.pm-opts{font:400 30px/38px 'Lora',serif;width:945px;white-space:normal}",
    ".pm-opt{display:inline-block;margin-right:30px;white-space:nowrap}",
    ".pm-opt:last-child{margin-right:0}",
    ".pm-cover svg{display:block;width:1471px;height:2158px}",
    "@font-face{font-family:'Playfair Display SC';src:url(assets/fonts/print/PlayfairDisplaySC-Regular.ttf) format('truetype');font-weight:400}",
    ".pm-d-name{font:500 40px/40px 'Lora',serif}",
    ".pm-d-region{font:400 28px 'Lora',serif;margin-left:9px}",
    ".pm-d-desc{font:400 28px/36px 'Lora',serif;white-space:normal}",
    ".pm-d-price{font:400 32px/32px 'Lora',serif}",
    ".pm-d-year{font:400 28px/28px 'Lora',serif}",
    ".pm-d-foot{font:400 23px/23px 'Lora',serif;white-space:pre}",
    ".pm-d-head{font:400 40px/40px 'Lora',serif}",
    ".pm-d-note{font:400 21px/21px 'Lora',serif}",
    ".pm-d-label{font:400 40px/40px 'Playfair Display SC',serif;transform-origin:0 0;transform:rotate(-90deg)}",
    ".pm-d-label.is-cjk{font-size:32px;line-height:32px;writing-mode:vertical-rl;text-orientation:mixed;transform:none}",
    ".pm-d-icons{position:absolute;left:0;top:0;width:1471px;height:2158px;overflow:visible}",
    "@font-face{font-family:'Noto Sans SC';src:url(assets/fonts/print/NotoSansSC-Black-labels.ttf) format('truetype');font-weight:900}",
    "@font-face{font-family:'Noto Sans JP';src:url(assets/fonts/print/NotoSansJP-Black-labels.ttf) format('truetype');font-weight:900}",
    ".pb-face{position:relative;background:#fff;overflow:hidden;color:#000;text-align:left;letter-spacing:0;font-family:'George',sans-serif}",
    ".pb-face > svg{position:absolute;left:0;top:0;display:block}",
    ".pb-title{font:700 var(--pb-title)/1 'George',sans-serif}",
    ".pb-name,.pb-price{font:600 var(--pb-name)/1 'George',sans-serif}",
    ".pb-desc,.pb-opts{font:400 var(--pb-desc)/var(--pb-line) 'George',sans-serif;white-space:normal}",
    ".pb-opts.is-priced{font-weight:600}",
    ".pb-tag{font:400 var(--pb-tag)/0 'George',sans-serif;position:relative;top:calc(-1 * var(--pb-rise));margin-left:0}",
    ".pb-size{font:400 var(--pb-size) 'George',sans-serif;margin-left:18px}",
    ".pb-aside{font:400 var(--pb-aside)/1 'George',sans-serif}",
    ".pb-sur{font:400 35px/1 'George',sans-serif;white-space:pre}",
    ".pb-qr{position:absolute}",
    ".pb-qr svg{display:block;width:100%;height:100%}",
    // the whole face switches typeface at once: title and name carry the 500
    // weight, everything else (description, options, footer, tags) the 400 -
    // the same split Lora already makes. Prices stay in Lora: a price is only
    // ever digits and a dot, so nothing is gained by swapping its font.
    ".pm-face[lang='zh'] .pm-title,.pm-face[lang='zh'] .pm-name{font-family:'Noto Serif SC';font-weight:500}",
    ".pm-face[lang='zh'] .pm-foot,.pm-face[lang='zh'] .pm-desc,.pm-face[lang='zh'] .pm-opts,.pm-face[lang='zh'] .pm-tag{font-family:'Noto Serif SC';font-weight:400}",
    ".pm-face[lang='ja'] .pm-title,.pm-face[lang='ja'] .pm-name{font-family:'Noto Serif JP';font-weight:500}",
    ".pm-face[lang='ja'] .pm-foot,.pm-face[lang='ja'] .pm-desc,.pm-face[lang='ja'] .pm-opts,.pm-face[lang='ja'] .pm-tag{font-family:'Noto Serif JP';font-weight:400}",
    // drinks: the same swap, with Lora first so brand names and their apostrophes keep
    // their English shapes (the CJK fonts set ’ full-width: "Daniel’ s"); prices and
    // vintages are digits and stay in Lora
    ".pm-face[lang='zh'] .pm-d-name{font-family:'Lora','Noto Serif SC';font-weight:500}",
    ".pm-face[lang='zh'] .pm-d-region,.pm-face[lang='zh'] .pm-d-desc,.pm-face[lang='zh'] .pm-d-foot,.pm-face[lang='zh'] .pm-d-head,.pm-face[lang='zh'] .pm-d-note,.pm-face[lang='zh'] .pm-d-label{font-family:'Lora','Noto Serif SC';font-weight:400}",
    ".pm-face[lang='ja'] .pm-d-name{font-family:'Lora','Noto Serif JP';font-weight:500}",
    ".pm-face[lang='ja'] .pm-d-region,.pm-face[lang='ja'] .pm-d-desc,.pm-face[lang='ja'] .pm-d-foot,.pm-face[lang='ja'] .pm-d-head,.pm-face[lang='ja'] .pm-d-note,.pm-face[lang='ja'] .pm-d-label{font-family:'Lora','Noto Serif JP';font-weight:400}",
    // CJK glyphs fill their whole em, so at the same size a region in parentheses reads
    // larger than the Latin one; a step down restores the Figma's balance with the name.
    ".pm-face[lang='zh'] .pm-d-region,.pm-face[lang='ja'] .pm-d-region{font-size:24px}",
    // line breaks by the local rules: never a 'ー' or a closing mark at the start of a line,
    // and Japanese wraps between phrases rather than in the middle of a word
    ".pm-face[lang='zh'] .pm-d-desc{line-break:strict}",
    ".pm-face[lang='ja'] .pm-d-desc{line-break:strict;word-break:auto-phrase}"
  ].join('\n');
  function ensureCore() {
    if (document.getElementById('pm-core')) return;
    var st = document.createElement('style'); st.id = 'pm-core'; st.textContent = CORE_CSS;
    document.head.appendChild(st);
  }
  function fontsReady(lang) {
    ensureCore();
    var specs = ['400 30px Lora', '500 44px Lora', '400 60px Playfair', '400 53px "Alex Brush"', '400 40px "Playfair Display SC"'];
    var cjk = CJK_FONT[lang];
    if (cjk) specs.push('400 30px "' + cjk + '"', '500 44px "' + cjk + '"');
    return Promise.all(specs.map(function (f) { return document.fonts.load(f); })).then(function () { return document.fonts.ready; });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function pick(obj, lang) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] != null ? obj[lang] : (obj.en || '');
  }

  /* ---- measuring: where the baseline sits inside each text style ---- */
  // Keyed by class *and* language: English, Chinese and Japanese each resolve a
  // style like .pm-name to a different typeface (see CORE_CSS), and those
  // typefaces do not share a baseline position inside the same line box. Caching
  // only by class would hand a Chinese face the baseline measured for Lora the
  // first time an English one was built in the same page session.
  var baselineCache = {};
  function baselineOf(cls, host) {
    var key = cls + '|' + (host.lang || '') + '|' + (host.getAttribute('data-board') || '');
    if (baselineCache[key] != null) return baselineCache[key];
    var probe = el('div', cls);
    probe.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap';
    probe.appendChild(document.createTextNode('Hg'));
    var mark = el('span');
    mark.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    probe.appendChild(mark);
    host.appendChild(probe);
    var b = mark.offsetTop;
    host.removeChild(probe);
    return (baselineCache[key] = b);
  }

  // Places a text so its first baseline lands exactly on `baseline` (design units).
  function put(face, cls, text, x, baseline, align) {
    var n = el('div', 'pm-abs ' + cls);
    if (text instanceof Node) n.appendChild(text); else n.textContent = text;
    face.appendChild(n);
    n.style.top = (baseline - baselineOf(cls, face)) + 'px';
    if (align === 'right') n.style.left = (x - n.offsetWidth) + 'px';
    else if (align === 'center') n.style.left = (x - n.offsetWidth / 2) + 'px';
    else n.style.left = x + 'px';
    return n;
  }

  /* ---- one A5 face of dishes ---- */
  // `ids` is only given for a face that carries several lists (lunch: salads, then mains).
  // The first list gives the page title; each later one gets its own title in the same
  // style, a fixed gap below the last dish above it.
  function sectionFace(menu, sectionId, lang, side, ids) {
    var wanted = ids && ids.length ? ids : [sectionId];
    var secs = wanted.map(function (id) { return (menu.sections || []).filter(function (s) { return s.id === id; })[0]; });
    var sec = secs[0];
    var face = el('div', 'pm-face pm-' + side);
    face.setAttribute('lang', lang);
    var report = { id: sectionId, side: side, ok: true, over: 0, overLines: 0, longNames: [], longDescs: [], tooWide: [], frame: [] };
    if (secs.some(function (x) { return !x; })) { report.ok = false; report.missing = true; return { face: face, report: report }; }
    face._report = report;
    face._build = function () {
      var r = RULES, x = r.content.x[side];
      var outer = side === 'left' ? r.rule.x0 : r.rule.x1;

      // Header and footer: fixed, whatever the dishes do.
      var titleEl = put(face, 'pm-title', pick(sec.name, lang).toUpperCase(), outer, r.title.baseline, side === 'left' ? 'left' : 'right');
      if (titleEl.offsetWidth > r.rule.x1 - r.rule.x0) report.frame.push('page title');
      line(face, r.rule.top); line(face, r.rule.bottom);
      // the footer comes from the first list that has one
      var footSec = secs.filter(function (x) { return x.foot; })[0] || sec;
      // A footer may hold two lines (lunch: the dietary legend, then the seafood origins);
      // the second sits one line below the first, still well inside the page.
      String(pick(footSec.foot, lang) || '').split('\n').forEach(function (foot, fi) {
        if (foot === 'legend') foot = (menu.legend || []).map(function (l) { return '(' + l.code + ') ' + pick(l, lang); }).join(' ');
        else if (foot === 'surcharge') foot = pick(menu.surcharge, lang);
        if (!foot) return;
        var footEl = put(face, 'pm-foot', foot, outer, r.foot.baseline + fi * r.foot.lineStep, side === 'left' ? 'left' : 'right');
        if (footEl.offsetWidth > r.rule.x1 - r.rule.x0) report.frame.push('footer note');
      });

      // Dishes, on a fixed rhythm.
      var y = r.content.firstBaseline, last = y;
      secs.forEach(function (list, li) {
      if (li > 0) {
        var titleY = last + r.dish.secondTitleGap;
        var sub = put(face, 'pm-title', pick(list.name, lang).toUpperCase(), outer, titleY, side === 'left' ? 'left' : 'right');
        if (sub.offsetWidth > r.rule.x1 - r.rule.x0) report.frame.push('list title');
        line(face, titleY + (r.rule.top - r.title.baseline));
        y = titleY + (r.content.firstBaseline - r.title.baseline); last = y;
      }
      var twoPrices = list.priceColumns === 2;
      (list.items || []).forEach(function (it) {
        if (it.hidden || it.hide || it.print === false) return;
        var t = it[lang] || it.en || {};
        var name = el('span');
        name.appendChild(document.createTextNode(t.name || ''));
        var tags = (it.tags || []).join(', ');
        var inner = [tags, it.tagNote ? pick(it.tagNote, lang) : ''].filter(Boolean).join(', ');
        var tagText = inner ? '(' + inner + ')' : '';
        // seafood origin, its own mark after the dietary ones: "(DF) (A)"
        if (it.origin) tagText += (tagText ? ' ' : '') + '(' + it.origin + ')';
        if (tagText) name.appendChild(el('span', 'pm-tag', tagText));
        var nameEl = put(face, 'pm-name', name, x, y);

        var hasP = it.price !== '' && it.price != null, hasP2 = twoPrices && it.price2 !== '' && it.price2 != null;
        if (hasP || hasP2) {
          var priceEl;
          if (twoPrices) {
            // two sizes (coffee: medium, large): the second price sits at the usual edge, the first beside it;
            // an item with one price only (iced coffee, tea) keeps it in the second column
            if (hasP2) priceEl = put(face, 'pm-price', String(it.price2), x + r.content.priceRight, y + r.dish.priceShift, 'right');
            if (hasP) priceEl = put(face, 'pm-price', String(it.price), x + r.content.priceRight - r.dish.price2Step, y + r.dish.priceShift, 'right');
          } else priceEl = put(face, 'pm-price', String(it.price), x + r.content.priceRight, y + r.dish.priceShift, 'right');
          if (nameEl.offsetLeft + nameEl.offsetWidth > priceEl.offsetLeft - r.dish.nameRoom) report.longNames.push(t.name);
        } else if (nameEl.offsetLeft + nameEl.offsetWidth > x + r.content.priceRight) report.longNames.push(t.name);
        last = y;
        if (t.desc) {
          var d = put(face, 'pm-desc', t.desc, x, y + r.dish.descFirst);
          var descLines = Math.round(d.offsetHeight / r.dish.descLine);
          // A word longer than the line cannot wrap and would run past the margin.
          if (d.scrollWidth > d.clientWidth + 1) report.tooWide.push(t.name + ' (description)');
          if (descLines > r.dish.maxDescLines) report.longDescs.push(t.name);
          last = y + r.dish.descFirst + (descLines - 1) * r.dish.descLine;
        }
        var opts = it.options || [];
        if (opts.length) {
          var o = el('span');
          if (it.choiceLabel) o.appendChild(el('span', 'pm-opt', pick(it.choiceLabel, lang)));
          opts.forEach(function (op) { o.appendChild(el('span', 'pm-opt', '• ' + pick(op, lang))); });
          var oe = put(face, 'pm-opts', o, x, last + r.dish.optFirst);
          if (oe.scrollWidth > oe.clientWidth + 1) report.tooWide.push(t.name + ' (options)');
          last = last + r.dish.optFirst + (Math.round(oe.offsetHeight / r.dish.descLine) - 1) * r.dish.descLine;
        }
        y = last + r.dish.next;
      });
      });

      // Room left, in description lines: what the backoffice shows while editing.
      report.spareLines = Math.max(0, Math.floor((r.content.lastBaseline - last) / r.dish.descLine));
      // How many more dishes (with a one-line description) would still fit, and where.
      var perDish = r.dish.next + r.dish.descFirst;
      report.room = Math.max(0, Math.floor((r.content.lastBaseline - last) / perDish));
      report.last = last; report.x = x;
      if (last > r.content.lastBaseline) {
        report.ok = false;
        report.over = last - r.content.lastBaseline;
        report.overLines = Math.ceil(report.over / r.dish.descLine);
        face.classList.add('is-over');
      }
      if (report.longNames.length || report.longDescs.length || report.tooWide.length || report.frame.length) { report.ok = false; face.classList.add('is-over'); }
    };
    return { face: face, report: report };
  }
  function line(face, top) {
    var n = el('div', 'pm-rule');
    n.style.cssText = 'top:' + top + 'px;left:' + RULES.rule.x0 + 'px;width:' + (RULES.rule.x1 - RULES.rule.x0) + 'px;height:' + RULES.rule.weight + 'px';
    face.appendChild(n);
  }

  /* ---- one A5 face of the drinks list ---- */
  // A drink's own words, or the English ones: most bottles are brands, so the
  // Chinese and Japanese blocks often carry only a description, not a name.
  function local(it, lang, key) {
    var v = it[lang] && it[lang][key];
    return v != null && v !== '' ? v : ((it.en && it.en[key]) || '');
  }
  // The drinks list keeps its footer lines on the page that holds the section
  // (menu.pages[].foot, one per panel), not on the section itself.
  function pageFoot(menu, sectionId, lang) {
    var pages = menu.pages || [];
    for (var i = 0; i < pages.length; i++) {
      var p = pages[i];
      if (!p || !p.panels) continue;
      for (var k = 0; k < p.panels.length; k++) {
        if ((p.panels[k] || []).indexOf(sectionId) !== -1) {
          var f = p.foot && p.foot[k];
          return f && typeof f === 'object' ? pick(f, lang) : '';
        }
      }
    }
    return '';
  }
  function vrule(face, x, top, bottom) {
    var n = el('div', 'pm-rule');
    n.style.cssText = 'left:' + (x - 1) + 'px;top:' + top + 'px;width:2px;height:' + Math.max(0, bottom - top) + 'px';
    face.appendChild(n);
  }

  function drinkFace(menu, sectionId, lang, side, iconDoc) {
    var sec = (menu.sections || []).filter(function (s) { return s.id === sectionId; })[0];
    var face = el('div', 'pm-face pm-' + side);
    face.setAttribute('lang', lang);
    var report = { id: sectionId, side: side, ok: true, over: 0, overLines: 0, longNames: [], longDescs: [], tooWide: [], frame: [] };
    if (!sec) { report.ok = false; report.missing = true; return { face: face, report: report }; }
    var r = DRINK, P = DRINK_PAGE[sectionId] || {};
    var cjk = !!CJK_FONT[lang];
    var cx = RULES.content.x[side];                       // 156 left, 170 right, as on the dinner
    var priceRight = cx + RULES.content.priceRight;       // 1302 / 1316
    var groups = sec.groups && sec.groups.length ? sec.groups : null;
    var headGroups = !!groups && groups.every(function (g) { return g.style === 'head'; });
    var items = groups ? groups.reduce(function (a, g) { return a.concat(g.items || []); }, []) : (sec.items || []);
    items = items.filter(function (it) { return !(it.hidden || it.hide || it.print === false); });
    var hasYear = items.some(function (it) { return it.year; });
    var x = groups && !headGroups ? r.side.contentX : (hasYear ? cx + r.year.nameAfter : cx);
    var cols = sec.cols && sec.cols.length ? sec.cols : null;
    var iconCols = !!cols && cols.some(function (c) { return c && c.icon; });
    var colX = function (i) {
      var n = cols.length;
      return iconCols ? priceRight - r.cols.centredInset - (n - 1 - i) * r.cols.centredStep
                      : priceRight - (n - 1 - i) * r.cols.rightStep;
    };
    // the left edge of the price area: names stop short of it, descriptions wrap before it
    var priceLeft = cols ? (iconCols ? colX(0) - 30 : colX(0) - 70) : priceRight - 70;
    // English keeps the Figma's narrower column (its line breaks); Chinese and Japanese
    // run wider, up to the prices, because the same words need more room in those scripts.
    // A description sits on the lines under its name, never on the price line, so where
    // there are no glass icons standing over the columns it may run under the first one.
    var descRight = cjk && cols && !iconCols ? priceRight - 70 : priceLeft;
    var descW = Math.min(P.descWidth || (groups && !cjk ? r.descGrouped : r.descMax), descRight - 30 - x);
    var hasDesc = items.some(function (it) { return local(it, lang, 'desc'); });
    var outer = side === 'left' ? RULES.rule.x0 : RULES.rule.x1;
    var align = side === 'left' ? 'left' : 'right';

    function render(gap) {
      face.innerHTML = '';
      report.longNames = []; report.longDescs = []; report.tooWide = []; report.frame = [];
      var titleEl = put(face, 'pm-title', pick(sec.name, lang).toUpperCase(), outer, RULES.title.baseline, align);
      if (titleEl.offsetWidth > RULES.rule.x1 - RULES.rule.x0) report.frame.push('page title');
      line(face, RULES.rule.top); line(face, RULES.rule.bottom);
      var foot = pageFoot(menu, sectionId, lang);
      if (foot) {
        var footEl = put(face, 'pm-d-foot', foot, outer, r.foot.baseline, align);
        if (footEl.offsetWidth > RULES.rule.x1 - RULES.rule.x0) report.frame.push('footer note');
      }
      // glasses and bottle over their columns, the Figma drawings moved sideways
      if (iconCols && iconDoc) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'pm-d-icons');
        svg.setAttribute('viewBox', '0 0 1471 2158');
        cols.forEach(function (c, i) {
          var src = c && c.icon && iconDoc.getElementById(c.icon);
          if (!src) return;
          var g = document.importNode(src, true);
          g.removeAttribute('id');
          g.setAttribute('transform', 'translate(' + (colX(i) - parseFloat(src.getAttribute('data-cx'))) + ' 0)');
          svg.appendChild(g);
        });
        face.appendChild(svg);
      }

      var last = 0;
      function item(it, y) {
        var name = local(it, lang, 'name'), region = local(it, lang, 'region'), desc = local(it, lang, 'desc');
        var n = el('span');
        n.appendChild(document.createTextNode(name));
        if (region) n.appendChild(el('span', 'pm-d-region', '(' + region + ')'));
        var nameEl = put(face, 'pm-d-name', n, x, y);
        if (nameEl.offsetLeft + nameEl.offsetWidth > priceLeft - r.nameRoom) report.longNames.push(name);
        if (it.year) put(face, 'pm-d-year', String(it.year), cx - r.year.before, y + r.year.shift);
        var vals = cols ? (it.prices || []) : [it.price];
        vals.forEach(function (v, i) {
          if (v === '' || v == null) return;
          if (cols && i >= cols.length) { report.frame.push(name + ' has more prices than columns'); return; }
          put(face, 'pm-d-price', String(v), cols ? colX(i) : priceRight, y + r.priceShift, iconCols ? 'center' : 'right');
        });
        var end = y;
        if (desc) {
          var d = put(face, 'pm-d-desc', desc, x, y + r.descFirst);
          d.style.width = descW + 'px';
          var lines = Math.round(d.offsetHeight / r.descLine);
          if (d.scrollWidth > d.clientWidth + 1) report.tooWide.push(name + ' (description)');
          if (lines > r.maxDescLines) report.longDescs.push(name);
          end = y + r.descFirst + (lines - 1) * r.descLine;
        }
        return { end: end, desc: !!desc };
      }
      function run(list, y) {
        var out = null;
        list.forEach(function (it) {
          if (it.hidden || it.hide || it.print === false) return;
          if (out) y = out.end + (out.desc ? (P.next || r.next) : r.nameNext);
          out = item(it, y);
        });
        return out ? out.end : null;
      }

      var labels = [], gaps = 0;
      if (!groups) {
        last = run(items, P.first || r.firstBaseline) || (P.first || r.firstBaseline);
      } else if (headGroups) {
        // RED / WHITE: a word on the outer edge, a full-width rule above every one but the first
        groups.forEach(function (g, gi) {
          var lb;
          if (gi === 0) lb = r.head.firstLabel;
          else {
            var ruleY = last + r.head.ruleAfter;
            line(face, ruleY - RULES.rule.weight / 2);
            lb = ruleY + r.head.labelAfterRule;
          }
          put(face, 'pm-d-head', pick(g.label, lang), outer, lb, align);
          var end = run(g.items || [], lb + r.head.labelToName);
          last = end != null ? end : lb;
        });
      } else {
        // a word down the side, centred on a rule that runs from the first name to the last line
        var y = P.first || r.firstBaseline;
        groups.forEach(function (g, gi) {
          if (gi > 0) { y = last + gap; gaps++; }
          var end = run(g.items || [], y);
          if (end == null) return;
          var top = y - r.side.lineAbove, bottom = end + 0.5;
          vrule(face, r.side.lineX, top, bottom);
          var text = pick(g.label, lang), mid = (top + bottom) / 2;
          var lab = el('div', 'pm-abs pm-d-label' + (cjk ? ' is-cjk' : ''));
          lab.textContent = text;
          face.appendChild(lab);
          var len;
          if (cjk) {
            len = lab.offsetHeight;
            lab.style.left = ((RULES.rule.x0 + r.side.labelBaseline) / 2 - lab.offsetWidth / 2) + 'px';
            lab.style.top = (mid - len / 2) + 'px';
          } else {
            len = lab.offsetWidth;
            lab.style.left = (r.side.labelBaseline - baselineOf('pm-d-label', face)) + 'px';
            lab.style.top = (mid + len / 2) + 'px';
          }
          labels.push({ text: text, top: mid - len / 2, bottom: mid + len / 2 });
          last = end;
          if (g.note) {
            var nb = end + r.note.after;
            put(face, 'pm-d-note', pick(g.note, lang), priceRight, nb, 'right');
            last = nb;
          }
        });
      }
      // a word down the side must not run into its neighbour or off the frame
      labels.forEach(function (l, i) {
        if (l.top < RULES.rule.top + 15 || l.bottom > RULES.rule.bottom - 15) report.frame.push('group label "' + l.text + '" runs past the frame');
        if (i > 0 && l.top < labels[i - 1].bottom + 12) report.frame.push('group labels "' + labels[i - 1].text + '" and "' + l.text + '" touch');
      });
      return { last: last, gaps: gaps };
    }

    face._report = report;
    face._build = function () {
      var want = P.gap || r.side.minGap;
      var res = render(want);
      // groups give up their extra air before a page is ever called over
      if (res.last > r.lastBaseline && res.gaps > 0 && want > r.side.minGap) {
        res = render(Math.max(r.side.minGap, want - (res.last - r.lastBaseline) / res.gaps));
      }
      var last = res.last;
      var perDish = hasDesc ? r.next + r.descFirst : r.nameNext;
      report.spareLines = Math.max(0, Math.floor((r.lastBaseline - last) / r.descLine));
      report.room = Math.max(0, Math.floor((r.lastBaseline - last) / perDish));
      report.last = last; report.x = x;
      report.g = { x: x, descW: descW, priceLeft: priceLeft, priceRight: priceRight, lastBaseline: r.lastBaseline,
                   step: hasDesc ? r.next : r.nameNext, perDish: perDish, ghost: hasDesc ? r.descFirst : 0 };
      report.ok = true; report.over = 0; report.overLines = 0;
      face.classList.remove('is-over');
      if (last > r.lastBaseline) {
        report.ok = false;
        report.over = last - r.lastBaseline;
        report.overLines = Math.ceil(report.over / r.descLine);
        face.classList.add('is-over');
      }
      if (report.longNames.length || report.longDescs.length || report.tooWide.length || report.frame.length) { report.ok = false; face.classList.add('is-over'); }
    };
    return { face: face, report: report };
  }

  /* Optical spacing of the allergen marks after a title. A title ends in a capital, and
     capitals leave very different room on their right at the height where the mark
     sits (an A is narrow at the top, a T or a Y runs right out to the edge). TAG_RS is
     that empty room per last letter, in ems of the title, measured on the typeface's own
     outlines (George SemiBold, the 0.55-0.75 em band the mark occupies). The mark starts
     TAG_GAP units after the letter's real ink, so every title gets the same breathing
     space whatever it ends with. */
  var TAG_RS = {"A": 0.245, "B": 0.084, "C": 0.017, "D": 0.084, "E": 0.049, "F": 0.033, "G": 0.161, "H": 0.065, "I": 0.065, "J": 0.049, "K": 0.033, "L": 0.273, "M": 0.065, "N": 0.065, "O": 0.092, "P": 0.048, "Q": 0.092, "R": 0.064, "S": 0.072, "T": 0.033, "U": 0.065, "V": 0.001, "W": 0.001, "X": 0.033, "Y": 0.001, "Z": 0.033, "0": 0.098, "1": 0.097, "2": 0.057, "3": 0.065, "4": 0.199, "5": 0.128, "6": 0.153, "7": 0.001, "8": 0.069, "9": 0.062, ".": 0.049, ")": 0.075, "’": 0.049, "'": 0.049, "\"": 0.049, "&": 0.154, "!": 0.073, "?": 0.052, "+": 0.049, "%": 0.137, "-": 0.049, ",": 0.049, ":": 0.049, "É": 0.049};
  var TAG_GAP = 11;
  function tagMargin(titleText, nameSize) {
    var last = String(titleText).replace(/\s+$/, '').slice(-1);
    var rs = TAG_RS[last] != null ? TAG_RS[last] : 0.06;
    return TAG_GAP - rs * nameSize;
  }

  /* ---- an outdoor board: the Figma frame, fresh QR codes, the menu poured into columns ---- */
  function boardFace(menus, key, frameSvg, qrSvgs) {
    var B = BOARDS[key], Z = B.size, R = B.rhythm;
    var face = el('div', 'pb-face');
    face.setAttribute('lang', 'en');
    face.setAttribute('data-board', key);
    face.style.cssText = 'width:' + B.W + 'px;height:' + B.H + 'px;--pb-title:' + Z.title + 'px;--pb-name:' + Z.name + 'px;--pb-desc:' + Z.desc +
      'px;--pb-line:' + Z.descLine + 'px;--pb-tag:' + Z.tag + 'px;--pb-rise:' + Z.rise + 'px;--pb-aside:' + Z.aside + 'px;--pb-size:' + Z.size + 'px';
    var reports = [];
    var hours = (menus[B.hours] && menus[B.hours].hours) || {};
    var dash = function (t) { return String(t || '').replace(/\s+-\s+/g, ' – '); };
    var esc = function (t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); };
    var up = function (t) { return String(t || '').toUpperCase(); };

    face._build = function () {
      face.innerHTML = frameSvg.replace('{{lunchHours}}', esc(dash(hours.lunch))).replace('{{dinnerHours}}', esc(dash(hours.dinner)));
      Object.keys(B.qr).forEach(function (k) {
        var q = B.qr[k], box = el('div', 'pb-qr');
        box.style.cssText = 'left:' + (q[0] - q[2] / 2) + 'px;top:' + (q[1] - q[2] / 2) + 'px;width:' + q[2] + 'px;height:' + q[2] + 'px';
        box.innerHTML = qrSvgs[k] || '';
        face.appendChild(box);
      });
      var sur = menus[B.hours] && menus[B.hours].surcharge;
      if (sur) put(face, 'pb-sur', up(pick(sur, 'en')).split(/\s*\|\s*|\s*\n\s*/).join('  -  '), B.surcharge.cx, B.surcharge.y, 'center');

      reports.length = 0;
      B.cols.forEach(function (col, ci) {
        var rep = { id: 'col-' + (ci + 1), side: 'board', ok: true, over: 0, overLines: 0, longNames: [], longDescs: [], tooWide: [], frame: [], col: col };
        var names = [], last = null;
        col.secs.forEach(function (sd) {
          var menu = menus[sd.src] || {};
          var secs = (menu.sections || []).filter(function (x) { return sd.ids.indexOf(x.id) !== -1; });
          if (!secs.length) { rep.ok = false; rep.frame.push(sd.ids.join(' + ') + ' not found'); return; }
          var head = secs[0];
          names.push(pick(head.name, 'en'));
          var titleY = last == null ? R.firstTitle : last + R.gap;
          if (sd.top && sd.top > titleY) titleY = sd.top;
          var t = put(face, 'pb-title', up(pick(head.name, 'en')), col.x - R.titleIn, titleY);
          var asideText = sd.aside === 'aside' ? pick(head.aside, 'en') : sd.aside === 'foot' ? pick(head.foot, 'en') : '';
          if (asideText === 'legend' || asideText === 'surcharge') asideText = '';
          if (asideText) {
            var a = put(face, 'pb-aside', up(asideText), col.price, titleY + R.asideShift, 'right');
            if (a.offsetLeft < t.offsetLeft + t.offsetWidth + 40) rep.frame.push('"' + asideText + '" runs into the title');
          }
          var y = titleY + R.titleToName, end = titleY;
          var items = secs.reduce(function (acc, x) { return acc.concat(x.items || []); }, []);
          items.forEach(function (it) {
            if (it.hidden || it.hide || it.print === false) return;
            var en = it.en || {};
            var n = el('span');
            n.appendChild(document.createTextNode(up(en.name)));
            if (en.size) n.appendChild(el('span', 'pb-size', en.size));
            var tags = (it.tags || []).join(', ');
            var inner = [tags, it.tagNote ? pick(it.tagNote, 'en') : ''].filter(Boolean).join(', ');
            var tagText = inner ? '(' + inner + ')' : '';
            if (it.origin) tagText += (tagText ? ' ' : '') + '(' + it.origin + ')';
            if (tagText) {
              var tg = el('span', 'pb-tag', tagText);
              tg.style.marginLeft = tagMargin(up(en.name), Z.name) + 'px';
              n.appendChild(tg);
            }
            var nameEl = put(face, 'pb-name', n, col.x, y);
            var priceLeft = col.price;
            var p2 = it.price2 != null && it.price2 !== '';
            if (it.price !== '' && it.price != null) {
              var pe = put(face, 'pb-price', String(it.price), p2 && col.price1 ? col.price1 : col.price, y, 'right');
              priceLeft = pe.offsetLeft;
            }
            if (p2) {
              var pe2 = put(face, 'pb-price', String(it.price2), col.price, y, 'right');
              if (!col.price1) rep.frame.push(en.name + ' has a second price but this column has one');
              priceLeft = Math.min(priceLeft, pe2.offsetLeft);
            }
            if (nameEl.offsetLeft + nameEl.offsetWidth > priceLeft - 40) rep.longNames.push(en.name);
            var lineEnd = y;
            var block = function (cls, text) {
              var d = put(face, cls, text, col.x, lineEnd === y ? y + R.descFirst : lineEnd + Z.descLine);
              d.style.width = (col.dw || B.descW) + 'px';
              var lines = Math.round(d.offsetHeight / Z.descLine);
              if (d.scrollWidth > d.clientWidth + 1) rep.tooWide.push(en.name);
              lineEnd = (lineEnd === y ? y + R.descFirst : lineEnd + Z.descLine) + (lines - 1) * Z.descLine;
              return lines;
            };
            var descLines = 0;
            if (en.desc) descLines += block('pb-desc', up(en.desc));
            var opts = it.options || [];
            if (opts.length) {
              var priced = !(it.price !== '' && it.price != null) && opts.some(function (o) { return /\$\d/.test(pick(o, 'en')); });
              var txt = (it.choiceLabel ? up(pick(it.choiceLabel, 'en')) + ' ' : '') + opts.map(function (o) {
                var v = up(pick(o, 'en'));
                return '• ' + (priced ? v.replace(/\s+\$/, '  $') : v);
              }).join(priced ? '   ' : ' ');
              descLines += block('pb-opts' + (priced ? ' is-priced' : ''), txt);
            }
            if (descLines > 3) rep.longDescs.push(en.name);
            end = lineEnd;
            y = lineEnd + R.next;
          });
          last = end;
        });
        rep.names = names.join(' & ');
        rep.last = last;
        var perDish = R.next + R.descFirst;
        rep.room = last == null ? 0 : Math.max(0, Math.floor((col.limit - last) / perDish));
        rep.spareLines = last == null ? 0 : Math.max(0, Math.floor((col.limit - last) / Z.descLine));
        rep.x = col.x;
        if (last != null && last > col.limit) {
          rep.ok = false; rep.over = last - col.limit; rep.overLines = Math.ceil(rep.over / Z.descLine);
        }
        if (rep.longNames.length || rep.longDescs.length || rep.tooWide.length || rep.frame.length) rep.ok = false;
        reports.push(rep);
      });
    };
    return { face: face, reports: reports, board: B };
  }

  // George is the owner's licensed typeface: it comes from a password-protected function,
  // never from the public folder. Resolves false when the password is missing or wrong.
  var boardFontsLoaded = null;
  function boardFonts(password) {
    if (boardFontsLoaded) return boardFontsLoaded;
    var p = Promise.all([['400', 'normal'], ['600', '600'], ['700', '700']].map(function (w) {
      return fetch('/.netlify/functions/print-font?w=' + w[0], { headers: { 'x-admin-password': password || '' } })
        .then(function (r) { if (!r.ok) throw new Error('font ' + r.status); return r.arrayBuffer(); })
        .then(function (buf) { var f = new FontFace('George', buf, { weight: w[1] }); document.fonts.add(f); return f.load(); });
    })).then(function () {
      return Promise.all(['900 58px "Noto Sans SC"', '900 58px "Noto Sans JP"', '400 53px "Alex Brush"'].map(function (f) { return document.fonts.load(f); }));
    }).then(function () { return true; });
    boardFontsLoaded = p.catch(function () { boardFontsLoaded = null; return false; });
    return boardFontsLoaded;
  }

  /* ---- the back cover: the cover drawing, with the surcharge where the dedication sits ---- */
  function backFace(menu, lang, svgText) {
    var face = el('div', 'pm-face pm-left pm-cover');
    face.setAttribute('lang', lang);
    var lines = pick(menu.surcharge, lang).split(/\s*\|\s*|\n/);
    var esc = function (s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); };
    var svg = CJK_FONT[lang] ? svgText.replace(/font-family="Lora"/g, 'font-family="' + CJK_FONT[lang] + '"') : svgText;
    face.innerHTML = svg
      .replace('{{since}}', esc(pick(menu.cover && menu.cover.since, lang)))
      .replace('{{line1}}', esc(lines[0] || ''))
      .replace('{{line2}}', esc(lines[1] || ''));
    return { face: face, report: { id: 'back', side: 'left', ok: true, over: 0, overLines: 0, longNames: [], longDescs: [], tooWide: [], frame: [] } };
  }

  /* ---- the cover: the Figma drawing, with its words taken from the data ---- */
  function coverFace(menu, lang, svgText) {
    var face = el('div', 'pm-face pm-right pm-cover');
    face.setAttribute('lang', lang);
    var mem = pick(menu.cover && menu.cover.memory, lang).split('\n');
    var esc = function (s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); };
    // The since/memory lines are drawn straight into the SVG with font-family="Lora"
    // baked in; Lora has no CJK glyphs, so a Chinese or Japanese face needs that
    // swapped for its own typeface before the text goes in, or the words print blank.
    var svg = CJK_FONT[lang] ? svgText.replace(/font-family="Lora"/g, 'font-family="' + CJK_FONT[lang] + '"') : svgText;
    face.innerHTML = svg
      .replace('{{since}}', esc(pick(menu.cover && menu.cover.since, lang)))
      .replace('{{memory1}}', esc(mem[0] || ''))
      .replace('{{memory2}}', esc(mem[1] || ''));
    return { face: face, report: { id: 'cover', side: 'right', ok: true, over: 0, overLines: 0, longNames: [], longDescs: [], tooWide: [], frame: [] } };
  }

  /* ---- paper: a face scaled into an A5 cell ---- */
  function cell(face) {
    var c = el('div', 'pm-cell');
    var s = el('div', 'pm-scale');
    s.appendChild(face);
    c.appendChild(s);
    return c;
  }

  // Builds every face once, measures it at full size, then mounts it on paper.
  function build(menu, opts) {
    ensureCore();
    if (BOARDS[opts.booklet]) return buildBoard(menu, opts.booklet);
    var book = BOOKLETS[opts.booklet || 'dinner'];
    var lang = opts.lang || 'en';
    var stage = el('div', 'pm-stage');
    document.body.appendChild(stage);

    var get = function (u) { return u ? fetch(u).then(function (r) { return r.text(); }) : Promise.resolve(null); };
    return Promise.all([get(book.cover), get(book.back), get(book.icons)]).then(function (res) {
      var svg = res[0], backSvg = res[1];
      var iconDoc = res[2] ? new DOMParser().parseFromString(res[2], 'image/svg+xml') : null;
      var faces = book.faces.map(function (id, i) {
        var side = (i + 1) % 2 === 1 ? 'right' : 'left';
        var f = id === 'cover' ? coverFace(menu, lang, svg)
          : id === 'back' ? backFace(menu, lang, backSvg)
          : book.kind === 'drinks' ? drinkFace(menu, id, lang, side, iconDoc)
          : sectionFace(menu, id, lang, side, (book.compose || {})[id]);
        stage.appendChild(f.face);
        if (f.face._build) f.face._build();
        return f;
      });
      document.body.removeChild(stage);
      return { book: book, faces: faces, reports: faces.map(function (f) { return f.report; }) };
    });
  }

  // A board takes a map of menus ({ dinner: ... } or { lunch: ..., focacce: ... }).
  function buildBoard(menus, key) {
    var B = BOARDS[key];
    var stage = el('div', 'pm-stage');
    document.body.appendChild(stage);
    var get = function (u) { return fetch(u).then(function (r) { return r.text(); }); };
    var ks = Object.keys(B.qr);
    return Promise.all([get(B.frame)].concat(ks.map(function (k) { return get('assets/print/qr-' + k + '.svg'); }))).then(function (res) {
      var qr = {};
      ks.forEach(function (k, i) { qr[k] = res[i + 1]; });
      var f = boardFace(menus, key, res[0], qr);
      stage.appendChild(f.face);
      f.face._build();
      document.body.removeChild(stage);
      var whole = { id: key, side: 'board', ok: f.reports.every(function (r) { return r.ok; }), over: 0, overLines: 0, longNames: [], longDescs: [], tooWide: [], frame: [] };
      return { book: B, faces: [{ face: f.face, report: whole, cols: f.reports }], reports: f.reports, board: B };
    });
  }

  // Screen-only guides: the frame dishes must stay inside, the price column, the
  // description width, the last line, and dashed "ghost" dishes where more would fit.
  function guides(face, report) {
    if (!report || report.id === 'cover' || report.x == null) return;
    if (report.g) return drinkGuides(face, report);
    var r = RULES, x = report.x, g = el('div', 'pm-guides');
    var box = function (cls, l, t, w, h, label) {
      var b = el('div', 'pm-g ' + cls); b.style.cssText = 'left:' + l + 'px;top:' + t + 'px;width:' + w + 'px;height:' + h + 'px';
      if (label) b.appendChild(el('span', 'pm-g-label', label));
      g.appendChild(b);
    };
    box('pm-g-area', x - 20, r.rule.top + 30, r.content.priceRight + 40, r.content.lastBaseline - r.rule.top - 10);
    box('pm-g-col', x + 945, r.rule.top + 30, 0, r.content.lastBaseline - r.rule.top - 10, 'description width');
    box('pm-g-col pm-g-price', x + r.content.priceRight, r.rule.top + 30, 0, r.content.lastBaseline - r.rule.top - 10, 'prices');
    box('pm-g-limit', x - 20, r.content.lastBaseline + 14, r.content.priceRight + 40, 0, 'last line');
    for (var k = 0; k < report.room; k++) {
      var nameBase = report.last + r.dish.next + k * (r.dish.next + r.dish.descFirst);
      box('pm-g-ghost', x - 10, nameBase - 46, r.content.priceRight + 20, r.dish.descFirst + 62, k === 0 ? 'room for another dish' : 'and another');
    }
    face.appendChild(g);
  }

  function boardGuides(face, B, cols) {
    var g = el('div', 'pm-guides');
    var box = function (cls, l, t, w, h, label) {
      var b = el('div', 'pm-g ' + cls); b.style.cssText = 'left:' + l + 'px;top:' + t + 'px;width:' + w + 'px;height:' + h + 'px';
      if (label) b.appendChild(el('span', 'pm-g-label', label));
      g.appendChild(b);
    };
    cols.forEach(function (r) {
      var c = r.col, top = B.rhythm.firstTitle - B.size.title, w = c.price - c.x + 40;
      box('pm-g-area', c.x - 20, top, w, c.limit - top + 20);
      box('pm-g-col', c.x + (c.dw || B.descW), top, 0, c.limit - top + 20, 'description width');
      box('pm-g-limit', c.x - 20, c.limit + 14, w, 0, 'last line');
      for (var k = 0; k < r.room; k++) {
        var nb = r.last + B.rhythm.next + k * (B.rhythm.next + B.rhythm.descFirst);
        box('pm-g-ghost', c.x - 10, nb - B.size.name, w - 20, B.rhythm.descFirst + B.size.name + 20, k === 0 ? 'room for another dish' : 'and another');
      }
    });
    face.appendChild(g);
  }

  function drinkGuides(face, report) {
    var q = report.g, top = RULES.rule.top, g = el('div', 'pm-guides');
    var box = function (cls, l, t, w, h, label) {
      var b = el('div', 'pm-g ' + cls); b.style.cssText = 'left:' + l + 'px;top:' + t + 'px;width:' + w + 'px;height:' + h + 'px';
      if (label) b.appendChild(el('span', 'pm-g-label', label));
      g.appendChild(b);
    };
    var h = q.lastBaseline - top - 10;
    box('pm-g-area', q.x - 20, top + 30, q.priceRight - q.x + 40, h);
    box('pm-g-col', q.x + q.descW, top + 30, 0, h, 'description width');
    box('pm-g-col pm-g-price', q.priceLeft, top + 30, 0, h, 'prices');
    box('pm-g-limit', q.x - 20, q.lastBaseline + 14, q.priceRight - q.x + 40, 0, 'last line');
    for (var k = 0; k < report.room; k++) {
      var nameBase = report.last + q.step + k * q.perDish;
      box('pm-g-ghost', q.x - 10, nameBase - 42, q.priceRight - q.x + 20, q.ghost + 56, k === 0 ? 'room for another drink' : 'and another');
    }
    face.appendChild(g);
  }

  // view: 'spreads' (the booklet as it is read), 'sheets' (A4 landscape, imposed, for
  // the print shop) or 'pages' (A5 in reading order)
  function mount(result, view, root, opts) {
    opts = opts || {};
    root.innerHTML = '';
    if (result.board) {
      var B = result.board, f = result.faces[0];
      var c = f.face.cloneNode(true);
      if (opts.guides) boardGuides(c, B, f.cols);
      var paper = el('section', 'pm-paper pm-board');
      paper.style.width = B.mm[0] + 'mm'; paper.style.height = B.mm[1] + 'mm';
      var z = B.mm[0] / B.W * PX_PER_MM;
      var holder = el('div', 'pm-board-face');
      holder.style.cssText = 'position:absolute;left:0;top:' + ((B.mm[1] - B.H * B.mm[0] / B.W) / 2) + 'mm;width:' + B.mm[0] + 'mm;height:' + (B.H * B.mm[0] / B.W) + 'mm';
      c.style.zoom = z;
      holder.appendChild(c);
      paper.appendChild(holder);
      if (!f.report.ok) paper.classList.add('is-bad');
      paper.setAttribute('data-face', f.report.id);
      root.appendChild(paper);
      document.documentElement.setAttribute('data-view', 'board');
      return;
    }
    var faces = result.faces;
    var face = function (pos) {
      var f = faces[pos - 1], c = f.face.cloneNode(true);
      if (opts.guides) guides(c, f.report);
      var wrap = cell(c);
      wrap.setAttribute('data-face', f.report.id);
      if (!f.report.ok) wrap.classList.add('is-bad');
      return wrap;
    };
    if (view === 'pages') {
      faces.forEach(function (f, i) {
        var p = el('section', 'pm-paper pm-a5'); p.appendChild(face(i + 1)); root.appendChild(p);
      });
    } else if (view === 'spreads') {
      var NAME = opts.names || {};
      result.book.spreads.forEach(function (sp, si) {
        var ids = sp.map(function (pos) { return result.book.faces[pos - 1]; });
        var cap = sp[0] === 1 ? 'Front cover'
          : si === result.book.spreads.length - 1 && sp.length === 1 ? (ids[0] === 'back' ? 'Back cover' : 'Back cover · ' + (NAME[ids[0]] || ids[0]))
          : 'Pages ' + sp.join('–') + ' · ' + ids.map(function (i) { return NAME[i] || i; }).join(' & ');
        root.appendChild(el('p', 'pm-cap' + (sp.length === 1 ? (sp[0] === 1 ? ' pm-cap-right' : ' pm-cap-left') : ''), cap));
        var p = el('section', 'pm-spread' + (sp.length === 1 ? ' is-single' : ''));
        if (sp.length === 1 && sp[0] === 1) p.appendChild(el('div', 'pm-cell pm-blank'));
        sp.forEach(function (pos) { p.appendChild(face(pos)); });
        if (sp.length === 1 && sp[0] !== 1) p.appendChild(el('div', 'pm-cell pm-blank'));
        root.appendChild(p);
      });
    } else {
      result.book.sheets.forEach(function (sheet, si) {
        sheet.forEach(function (side, k) {
          var p = el('section', 'pm-paper pm-a4');
          p.setAttribute('data-label', 'Sheet ' + (si + 1) + ' · ' + (k === 0 ? 'front' : 'back'));
          side.forEach(function (pos) { p.appendChild(face(pos)); });
          root.appendChild(p);
        });
      });
    }
    document.documentElement.setAttribute('data-view', view);
  }

  window.VitaliasPrint = { RULES: RULES, BOOKLETS: BOOKLETS, BOARDS: BOARDS, build: build, mount: mount, SCALE: SCALE, fontsReady: fontsReady, boardFonts: boardFonts };
})();
