#!/usr/bin/env node
/* ==========================================================
   LEYLA OS — case page generator
   Reads data/site.js + data/projects.js and writes one static page per
   project: work/<slug>.html. Static files = every case URL works on direct
   visits, refreshes and shared links on any static host (no SPA 404s).

   Usage (from the site folder):   node tools/build.mjs
   Missing media files are detected here and rendered as clearly marked
   "ФАЙЛ НЕ НАЙДЕН" placeholders — drop the file in and re-run the build.
   ========================================================== */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['data/site.js', 'data/projects.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const SITE = ctx.window.LEYLA_SITE || {};
const PROJECTS = (ctx.window.LEYLA_PROJECTS || []).filter(p => !p.hidden);
const TYPES = ctx.window.LEYLA_TYPES || {};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const exists = p => !!p && !p.includes('*') && fs.existsSync(path.join(ROOT, p));
const up = p => '../' + p; // case pages live in /work/
const abs = p => (SITE.SITE_URL ? new URL(p, SITE.SITE_URL.endsWith('/') ? SITE.SITE_URL : SITE.SITE_URL + '/').href : '');
const isExternal = u => /^https?:\/\//.test(u);
const href = u => (isExternal(u) ? u : up(u));
const imgSize = p => { // width/height from the file header (webp/png/jpeg) so the layout never jumps
  try {
    const b = fs.readFileSync(path.join(ROOT, p));
    if (b.toString('ascii', 0, 4) === '\x89PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)];
    if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
      const t = b.toString('ascii', 12, 16);
      if (t === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
      if (t === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
      if (t === 'VP8L') { const n = b.readUInt32LE(21); return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]; }
    }
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) { const m = b[i + 1], len = b.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + len; }
    }
  } catch (e) { /* unknown */ }
  return null;
};

const inkOn = hex => { // readable text colour on top of the project accent
  const h = hex.replace('#', ''); const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => (c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4));
  return .2126 * r + .7152 * g + .0722 * b > .3 ? '#20272b' : '#ffffff';
};
const PIX_FOLDER = '<svg viewBox="0 0 10 7" width="20" height="14" aria-hidden="true" focusable="false" shape-rendering="crispEdges"><path fill="#5b2a86" d="M0 0h4v1h6v6H0z"/><path fill="#ff8ac9" d="M1 1h3v1H1z"/><path fill="#ffd1ec" d="M1 2h8v4H1z"/></svg>';

function missing(what, file) {
  return `<div class="missing"><span class="m-ico" aria-hidden="true">!</span><p class="m-title">ФАЙЛ НЕ НАЙДЕН</p><p class="m-what">${esc(what)}</p>${file ? `<p class="m-what"><code>${esc(file)}</code></p>` : ''}</div>`;
}
function draft(text) { return `<div class="draft"><b>ЧЕРНОВИК</b> — нужно дописать: ${esc(text)}</div>`; }

function soon(m) { // reserved slot for media that is on its way — reads as intentional, not broken
  return `<figure class="soon" style="--ratio:${esc(m.ratio || '16 / 9')}"><div class="soon-frame"><span class="soon-play" aria-hidden="true">▶</span><p class="soon-t">СКОРО</p><p class="soon-c">${esc(m.caption || 'Видео')}</p></div></figure>`;
}
function video(m, { hero = false } = {}) {
  if (!exists(m.src)) return m.soon ? soon(m) : missing(m.caption || 'Видео', m.src);
  return `<figure class="vid${hero ? ' is-hero' : ''}" style="--ratio:${esc(m.ratio || '16 / 9')}">
          <div class="vid-frame"><video src="${esc(up(m.src))}"${exists(m.poster) ? ` poster="${esc(up(m.poster))}"` : ''} controls muted playsinline loop preload="${hero ? 'metadata' : 'none'}"${hero ? ' data-autoplay' : ''}></video></div>
          ${m.caption ? `<figcaption>${esc(m.caption)}${hero ? ' · без звука' : ''}</figcaption>` : ''}
        </figure>`;
}
function image(m) {
  if (!exists(m.src)) return missing(m.caption || m.alt || 'Изображение', m.src);
  const sz = imgSize(m.src);
  return `<figure class="shot dev-${esc(m.device || 'plain')}"${m.span ? ` style="--span:${+m.span}"` : ''}>
          <a class="zoom" href="${esc(up(m.src))}" aria-label="Открыть крупно: ${esc(m.alt || m.caption || '')}"><span class="dev-frame"><img src="${esc(up(m.src))}" alt="${esc(m.alt || '')}"${sz ? ` width="${sz[0]}" height="${sz[1]}"` : ''} loading="lazy" decoding="async"></span></a>
          ${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ''}
        </figure>`;
}
function specimen(pv, big) {
  return `<div class="spec-board${big ? ' is-big' : ''}" style="--sbg:${esc(pv.bg)};--sink:${esc(pv.ink)};--sacc:${esc(pv.accent)}">
          ${pv.lines.map(l => `<span class="sl" style="--s:${l.size};font-family:'${esc(l.family)}',serif">${esc(l.text)}</span>`).join('\n          ')}
          ${pv.note ? `<span class="spec-note">${esc(pv.note)}</span>` : ''}
        </div>`;
}
function beforeAfter(ba) {
  const side = (p, label) => (exists(p) ? `<img src="${esc(up(p))}" alt="${esc(label)}" loading="lazy">` : missing(`${label}: файл еще не добавлен`, p));
  return `<figure class="ba-wrap">
          <div class="ba" style="--pos:50%">
            <div class="ba-pane ba-after">${side(ba.after, 'ПОСЛЕ — концепт')}</div>
            <div class="ba-pane ba-before">${side(ba.before, 'ДО — старая версия')}</div>
            <span class="ba-line" aria-hidden="true"></span>
            <span class="ba-tag l" aria-hidden="true">ДО</span><span class="ba-tag r" aria-hidden="true">ПОСЛЕ</span>
            <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Сравнение: сдвинь, чтобы увидеть старую версию и концепт">
          </div>
          ${ba.caption ? `<figcaption>${esc(ba.caption)} — двигай ползунок (или стрелки на клавиатуре)</figcaption>` : ''}
        </figure>`;
}
function collage(p) {
  const c = p.palette.map(x => x.hex);
  return `<div class="collage" aria-hidden="true">
          ${c.map((hex, i) => `<span class="cb cb${i + 1}" style="background:${esc(hex)}"></span>`).join('')}
          <span class="halftone"></span>
          <span class="collage-note">Направление мудборда · оттенки условные</span>
        </div>`;
}

function banners(list) { // hero for ad campaigns: the real banners side by side, each in its own format
  return `<div class="banners">
          ${list.map(m => exists(m.src) ? `<figure class="bn bn-${esc(m.format || 'feed')}"><a class="zoom" href="${esc(up(m.src))}" aria-label="Открыть крупно: ${esc(m.alt || '')}"><img src="${esc(up(m.src))}" alt="${esc(m.alt || '')}"${(s => s ? ` width="${s[0]}" height="${s[1]}"` : '')(imgSize(m.src))} decoding="async"></a>${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ''}</figure>` : missing(m.alt || 'Баннер', m.src)).join('\n          ')}
        </div>`;
}

function heroMedia(p) {
  const vids = p.media.filter(m => m.kind === 'video');
  switch (p.layout) {
    case 'game': case 'cinema': return vids[0] ? { html: video(vids[0], { hero: true }), used: vids[0] } : { html: '' };
    case 'product': case 'editorial': return { html: p.preview && p.preview.kind === 'specimen' ? specimen(p.preview, true) : '' };
    case 'moodboard': return { html: collage(p) };
    case 'before-after': return { html: p.beforeAfter ? beforeAfter(p.beforeAfter) : '' };
    case 'campaign': return { html: p.hero ? banners(p.hero) : '' };
    default: return { html: '' };
  }
}

function section(n, id, title, body) {
  return `
      <section class="cs" id="${id}" aria-labelledby="${id}-h">
        <h2 id="${id}-h"><span class="cs-n">${String(n).padStart(2, '0')}</span> ${esc(title)}</h2>
        ${body}
      </section>`;
}
const paras = arr => arr.map(t => `<p>${esc(t)}</p>`).join('\n        ');

function page(p, i) {
  const isOther = p.shelf === 'other';
  const shelf = PROJECTS.filter(x => (x.shelf === 'other') === isOther), j = shelf.indexOf(p);
  const prev = shelf[(j - 1 + shelf.length) % shelf.length], next = shelf[(j + 1) % shelf.length];
  const backHref = isOther ? '../index.html#other' : '../index.html#projects';
  const folder = isOther ? 'ДРУГИЕ_РАБОТЫ' : 'ПРОЕКТЫ';
  const backLabel = isOther ? 'Другие работы' : 'Все проекты';
  const t = TYPES[p.type] || { label: p.type };
  const hero = heroMedia(p);
  const rest = p.media.filter(m => m !== hero.used);
  const images = rest.filter(m => m.kind === 'image'), vids = rest.filter(m => m.kind === 'video');
  const miss = (p.missing || []).filter(m => !exists(m.file));
  const links = p.links || {};
  const cta = [
    links.play && `<a class="btn btn-big" href="${esc(href(links.play))}" target="_blank" rel="noopener">▶ Играть <span class="vh">(откроется в новой вкладке)</span></a>`,
    links.live && `<a class="btn btn-big" href="${esc(links.live)}" target="_blank" rel="noopener">Живой сайт ↗ <span class="vh">(новая вкладка)</span></a>`,
    links.behance && `<a class="btn btn-alt" href="${esc(links.behance)}" target="_blank" rel="noopener">Behance ↗</a>`,
    links.repo && `<a class="btn btn-alt" href="${esc(links.repo)}" target="_blank" rel="noopener">Код ↗</a>`,
    links.pdf && exists(links.pdf) && `<a class="btn btn-alt" href="${esc(up(links.pdf))}" download>${esc(links.pdfLabel || 'Скачать PDF')} ↓</a>`,
  ].filter(Boolean).join('\n            ');

  let n = 0; const S = [];
  if (p.sections) { // custom storytelling for cases that are not interfaces (ad campaigns, decks)
    p.sections.forEach(sec => {
      let body = (sec.text || []).length ? paras(sec.text) : '';
      if (sec.palette) body += `
        <ul class="swatches">${sec.palette.map(c => `<li><i style="background:${esc(c.hex)}"></i><b>${esc(c.name)}</b><span>${esc(c.hex)}${c.role ? ' · ' + esc(c.role) : ''}</span></li>`).join('')}</ul>`;
      if (sec.media && sec.media.length) body += `
        <div class="gallery g-${esc(sec.gallery || p.layout)}">
        ${sec.media.map(m => (m.kind === 'video' ? video(m) : image(m))).join('\n        ')}
        </div>`;
      if (sec.note) body += `<p class="cs-note">${esc(sec.note)}</p>`;
      if (!body) body = draft(sec.title.toLowerCase());
      S.push(section(++n, sec.id, sec.title, body));
    });
  } else {
    S.push(section(++n, 'context', 'Контекст и цели', p.context.length ? paras(p.context) : draft('контекст и цели проекта')));
    S.push(section(++n, 'challenge', 'Задача', p.challenge.length ? paras(p.challenge) : draft('формулировку дизайн-задачи')));
    {
      let b = p.concept.length ? paras(p.concept) : draft('творческую концепцию');
      if (p.palette.length) b += `
        <h3>Цвет</h3>
        <ul class="swatches">${p.palette.map(c => `<li><i style="background:${esc(c.hex)}"></i><b>${esc(c.name)}</b><span>${esc(c.hex)}${c.role ? ' · ' + esc(c.role) : ''}</span></li>`).join('')}</ul>`;
      if (p.fonts.length) b += `
        <h3>Шрифты</h3>
        <ul class="fonts">${p.fonts.map(f => `<li><span class="f-spec" style="font-family:'${esc(f.family)}',serif" aria-hidden="true">Аа Bb 123</span><b>${esc(f.name)}</b><span>${esc(f.role)}</span></li>`).join('')}</ul>`;
      S.push(section(++n, 'concept', 'Концепция и визуальный стиль', b));
    }
    S.push(section(++n, 'ux', 'Ключевые UX/UI-решения', p.ux.length
      ? `<ol class="ux">${p.ux.map(u => `<li><h3>${esc(u.title)}</h3><p>${esc(u.text)}</p></li>`).join('')}</ol>`
      : draft('ключевые UX/UI-решения и почему они такие')));
    {
      const shots = images.map(image).join('\n        ') + miss.map(m => missing(m.what, m.file)).join('\n        ');
      S.push(section(++n, 'screens', 'Экраны, макеты и адаптив', shots ? `<div class="gallery g-${esc(p.layout)}">\n        ${shots}\n        </div>` : draft('скриншоты и макеты')));
    }
    if (vids.length) S.push(section(++n, 'video', 'Видео и анимация', vids.map(v => video(v)).join('\n')));
    if (p.implementation.length) S.push(section(++n, 'build', 'Реализация', `<ul class="impl">${p.implementation.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`));
  }

  const ogImg = p.preview && p.preview.kind === 'image' && exists(p.preview.src) ? abs(p.preview.src) : '';
  const facts = [
    ['Роль', esc(p.role)],
    ['Тип', esc(t.label)],
    p.stage ? ['Статус', esc(p.stage.label)] : null,
    ['Инструменты', p.tools.map(esc).join(' · ')],
  ].filter(Boolean);

  return `<!doctype html>
<html lang="ru">
<!-- Generated by tools/build.mjs from data/projects.js — edit the data, not this file. -->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(p.title)} — кейс · Лейла, веб и UI/UX дизайнер</title>
  <meta name="description" content="${esc(p.summary)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(p.title)} — кейс из портфолио Лейлы">
  <meta property="og:description" content="${esc(p.summary)}">
${SITE.SITE_URL ? `  <link rel="canonical" href="${esc(abs('work/' + p.slug + '.html'))}">\n` : ''}${ogImg ? `  <meta property="og:image" content="${esc(ogImg)}">\n` : ''}  <script>try { if (localStorage.getItem('leyla-os:mode') === 'eyerest') document.documentElement.classList.add('eye-rest'); } catch (e) { }</script>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 9 8%27 shape-rendering=%27crispEdges%27%3E%3Cpath fill=%27%23ff3d9a%27 d=%27M1 0h3v1h1V0h3v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1z%27/%3E%3C/svg%3E">
  <link rel="stylesheet" href="../css/theme.css">
  <link rel="stylesheet" href="../css/case.css">
</head>

<body class="case layout-${esc(p.layout)}" style="--accent:${esc(p.accent || '#ff5fb7')};--accent-ink:${inkOn(p.accent || '#ff5fb7')}">
  <a class="skip" href="#main">К содержимому кейса</a>
  <div id="bg" aria-hidden="true"></div>

  <header class="case-top">
    <a class="btn btn-ghost back" href="${backHref}">← <span>${backLabel}</span></a>
    <p class="crumbs" aria-hidden="true">C:\\LEYLA\\${folder}\\${esc(p.file)}</p>
    <div data-mode-switch data-caption="Режим"></div>
  </header>

  <main id="main" class="case-win bevel">
    <div class="win-bar">
      <span class="win-ico">${PIX_FOLDER}</span>
      <span class="win-title">${esc(p.file)} — LEYLA OS</span>
      <span class="win-btns"><span class="wbtn" aria-hidden="true">_</span><span class="wbtn" aria-hidden="true">□</span><a class="wbtn" href="${backHref}" aria-label="Закрыть кейс и вернуться к списку">×</a></span>
    </div>

    <article class="case-body">
      <header class="hero">
        <div class="hero-text">
          <p class="eyebrow">№ ${esc(p.num)} · ${esc(p.file)}</p>
          <h1>${esc(p.title)}</h1>
          <p class="tagline">${esc(p.tagline)}</p>
          <div class="badges"><span class="badge t-${esc(p.type)}">${esc(t.label)}</span>${p.stage ? `<span class="badge s-${esc(p.stage.key)}">${esc(p.stage.label)}</span>` : ''}</div>
          <dl class="facts">
            ${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n            ')}
          </dl>
          ${cta ? `<div class="cta">\n            ${cta}\n          </div>` : ''}
        </div>
        ${hero.html ? `<div class="hero-media">\n        ${hero.html}\n        </div>` : ''}
      </header>
${(p.todo || []).length ? `
      <aside class="draft todo" aria-label="Черновик кейса"><b>ЧЕРНОВИК КЕЙСА</b> — еще не хватает: ${p.todo.map(esc).join(' · ')}.</aside>` : ''}
${S.join('\n')}
    </article>

    <nav class="case-nav" aria-label="Другие проекты">
      <a class="cn prev" href="${esc(prev.slug)}.html" rel="prev"><span class="cn-k">← Предыдущий</span><span class="cn-t">${esc(prev.title)}</span></a>
      <a class="cn all" href="${backHref}"><span class="cn-k">${folder}.DIR</span><span class="cn-t">${backLabel}</span></a>
      <a class="cn next" href="${esc(next.slug)}.html" rel="next"><span class="cn-k">Следующий →</span><span class="cn-t">${esc(next.title)}</span></a>
    </nav>
    <footer class="win-status">${esc(p.file)} · ${n} ${n < 5 ? 'раздела' : 'разделов'} · LEYLA OS 2.0</footer>
  </main>

  <dialog class="lightbox" aria-label="Просмотр изображения"><button type="button" class="wbtn lb-close" aria-label="Закрыть">×</button><img alt=""></dialog>
  <script src="../js/mode.js"></script>
  <script src="../js/case.js"></script>
</body>

</html>
`;
}

fs.mkdirSync(path.join(ROOT, 'work'), { recursive: true });
const report = [];
PROJECTS.forEach((p, i) => {
  for (const k of ['context', 'challenge', 'concept', 'ux', 'implementation', 'media', 'palette', 'fonts', 'tools']) p[k] = p[k] || [];
  fs.writeFileSync(path.join(ROOT, 'work', p.slug + '.html'), page(p, i));
  const need = [...(p.sections || []).flatMap(s => (s.media || []).filter(m => !exists(m.src)).map(m => (m.soon ? 'скоро: ' : '') + m.src)), ...(p.hero || []).filter(m => !exists(m.src)).map(m => m.src), ...(p.missing || []).filter(m => !exists(m.file)).map(m => m.what), ...p.media.filter(m => !exists(m.src)).map(m => m.src), ...(p.beforeAfter ? [p.beforeAfter.before, p.beforeAfter.after].filter(f => !exists(f)) : []), ...(p.todo || [])];
  report.push(`  work/${p.slug}.html${need.length ? '  — не хватает: ' + need.join('; ') : ''}`);
});

// keep the no-JS fallback list on the desktop in sync
const idx = path.join(ROOT, 'index.html');
const html = fs.readFileSync(idx, 'utf8');
const li = arr => arr.map(p => `        <li><a href="work/${p.slug}.html">${esc(p.title)}</a></li>`).join('\n');
const mainP = PROJECTS.filter(p => p.shelf !== 'other'), otherP = PROJECTS.filter(p => p.shelf === 'other');
const list = `<!-- cases:start (generated by tools/build.mjs) -->\n      <ul>\n${li(mainP)}\n      </ul>${otherP.length ? `\n      <p>Другие работы:</p>\n      <ul>\n${li(otherP)}\n      </ul>` : ''}\n      <!-- cases:end -->`;
// pages of projects removed from the data are deleted
for (const f of fs.readdirSync(path.join(ROOT, 'work'))) if (f.endsWith('.html') && !PROJECTS.some(p => p.slug + '.html' === f)) { fs.unlinkSync(path.join(ROOT, 'work', f)); report.push('  удалена старая страница work/' + f); }
fs.writeFileSync(idx, html.replace(/<!-- cases:start[\s\S]*?<!-- cases:end -->/, list));

console.log(`LEYLA OS: ${PROJECTS.length} case pages written\n${report.join('\n')}`);
