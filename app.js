/* ==========================================================
   LEYLA OS — desktop logic (vanilla JS, no dependencies)
   Content lives in data/site.js and data/projects.js; mode state in js/mode.js.
   1. Helpers & config   2. Pixel icons   3. Mode (Glitter / Eye Rest)
   4. GIF freezing   5. Sparkles + cursor trail   6. Window manager
   7. Projects archive   8. Guestbook   9. Link-me button   10. Contact
   11. Boot   12. Init
   ========================================================== */
(() => {
  'use strict';

  /* ---------- 1. Helpers & config ---------- */
  const CONFIG = Object.assign({ SITE_URL: '', BANNER_URL: '', EMAIL: '', TELEGRAM: '', LINKS: [] }, window.LEYLA_SITE || {});
  const ALL_PROJECTS = (window.LEYLA_PROJECTS || []).filter(p => !p.hidden);
  const PROJECTS = ALL_PROJECTS.filter(p => p.shelf !== 'other');   // PROJECTS.DIR — special projects & games
  const OTHER = ALL_PROJECTS.filter(p => p.shelf === 'other');        // ДРУГИЕ_РАБОТЫ.DIR — sites & UI
  const TYPES = window.LEYLA_TYPES || {};
  const Mode = window.LeylaMode;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const root = document.documentElement;
  const pageStart = Date.now();
  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v == null) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'style') n.style.cssText = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(k => k != null && k !== false && n.append(k.nodeType ? k : document.createTextNode(k)));
    return n;
  }
  const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const plural = (n, one, few, many) => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? few : many; };
  const ss = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } } };
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } } };

  /* ---------- 2. Pixel icons ---------- */
  const PIX = {
    heart: { map: { X: '#ff3d9a', O: '#ffffff' }, rows: ['.XXX.XXX.', 'XOXXXXXXX', 'XXXXXXXXX', 'XXXXXXXXX', '.XXXXXXX.', '..XXXXX..', '...XXX...', '....X....'] },
    star: { map: { X: '#ffd400', O: '#fff6a8', D: '#e09a00' }, rows: ['....X....', '...XOX...', '...XXX...', 'XXXXXXXXX', '.XXXXXXX.', '..XXXXX..', '.XXXDXXX.', '.XX...XX.', 'X.......X'] },
    flower: { map: { X: '#ff8ac9', C: '#ffd400', G: '#3fb86f' }, rows: ['..XX.XX..', '.XXXXXXX.', 'XXXXCXXXX', '.XXCCCXX.', 'XXXXCXXXX', '.XXXXXXX.', '..XX.XX..', '....G....', '..G.G.G..', '....G....'] },
    butterfly: { map: { X: '#b79bff', B: '#3b1d55', P: '#ff8ac9' }, rows: ['XX.....XX', 'XPX.B.XPX', 'XXXXBXXXX', '.XXXBXXX.', 'XXXXBXXXX', 'XPX.B.XPX', '.X.....X.'] },
    cloud: { map: { X: '#ffffff', S: '#dbe9ff' }, rows: ['....XXXX.......', '..XXXXXXXX.XX..', '.XXXXXXXXXXXXXX', 'XXXXXXXXXXXXXXX', 'SSSSSSSSSSSSSSS', '.SSSSSSSSSSSSS.'] },
    folder: { map: { X: '#ff8ac9', Y: '#ffd1ec', K: '#5b2a86' }, rows: ['KKKK......', 'KXXXKKKKKK', 'KYYYYYYYYK', 'KYYYYYYYYK', 'KYYYYYYYYK', 'KYYYYYYYYK', 'KKKKKKKKKK'] },
    folder2: { map: { X: '#b79bff', Y: '#eadfff', K: '#5b2a86' }, rows: ['KKKK......', 'KXXXKKKKKK', 'KYYYYYYYYK', 'KYYYYYYYYK', 'KYYYYYYYYK', 'KYYYYYYYYK', 'KKKKKKKKKK'] },
    book: { map: { X: '#7c4dcc', W: '#fff6fc', P: '#ff8ac9' }, rows: ['XXXXXXXXXX', 'XWWWXXWWWX', 'XWPWXXWWWX', 'XWWWXXWWWX', 'XWWWXXWWWX', 'XWWWXXWWWX', 'XXXXXXXXXX'] },
    mail: { map: { X: '#ffe3f4', Y: '#7c4dcc' }, rows: ['YYYYYYYYYY', 'YXYXXXXYXY', 'YXXYXXYXXY', 'YXXXYYXXXY', 'YXXXXXXXXY', 'YYYYYYYYYY'] },
    eye: { map: { W: '#ffffff', P: '#b79bff', K: '#3b1d55', Y: '#7c4dcc' }, rows: ['...YYYYY...', '.YYWWWWWYY.', 'YWWWPPPWWWY', 'YWWPPKPPWWY', 'YWWWPPPWWWY', '.YYWWWWWYY.', '...YYYYY...'] },
  };
  function pixSVG(name, scale) {
    const d = PIX[name]; if (!d) return '';
    const w = d.rows[0].length, h = d.rows.length; let r = '';
    d.rows.forEach((row, y) => [...row].forEach((ch, x) => { const c = d.map[ch]; if (c) r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`; }));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" aria-hidden="true" focusable="false">${r}</svg>`;
  }
  function hydratePix(scope = document) {
    $$('[data-pix]', scope).forEach(n => {
      if (n.dataset.done) return;
      n.classList.add('pix'); n.innerHTML = pixSVG(n.dataset.pix, +n.dataset.scale || 2); n.dataset.done = '1';
    });
    $$('[data-divider]', scope).forEach(n => {
      if (n.dataset.done) return;
      const names = n.dataset.divider.split(','); n.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 11; i++) n.append(el('span', { class: 'pix', 'data-done': '1' }));
      $$('.pix', n).forEach((s, i) => { s.innerHTML = pixSVG(names[i % names.length], 2); });
      n.dataset.done = '1';
    });
  }

  /* ---------- 3. Mode: Glitter / Eye Rest (state lives in js/mode.js) ---------- */
  let lastEye = null;
  function onMode() {
    const eye = Mode.eyeRest, motion = Mode.motionOn();
    $('#er-warn').hidden = eye; $('#er-calm').hidden = !eye;
    $('#er-status').textContent = 'Отдых для глаз: ' + (eye ? 'ВКЛ' : 'ВЫКЛ');
    if (eye && lastEye === false) {
      const secs = Math.max(1, Math.round((Date.now() - pageStart) / 1000));
      const t = secs >= 60 ? `${Math.floor(secs / 60)} мин ${secs % 60} сек` : `${secs} сек`;
      $('#er-survived').textContent = `Ты выдержал(а) ${t} блесток. Мы тобой гордимся.`;
    }
    const mini = $('#mode-mini');
    mini.setAttribute('aria-pressed', String(eye));
    mini.setAttribute('aria-label', eye ? 'Отдых для глаз включен. Нажми, чтобы вернуть блестки' : 'Отдых для глаз выключен. Нажми, чтобы убрать блестки');
    $('.mm-txt', mini).textContent = eye ? 'ОТДЫХ: ВКЛ' : 'ОТДЫХ: ВЫКЛ';
    if (motion) { fxStart(); unfreezeAll(); } else { fxStop(); freezeAll(); stopClips(); }
    refreshStartMenu();
    lastEye = eye;
  }
  $('#mode-mini').addEventListener('click', () => Mode.toggle());
  $$('[data-eye]').forEach(b => b.addEventListener('click', () => {
    Mode.set(b.dataset.eye === 'on' ? 'eyerest' : 'glitter');
    const t = Mode.eyeRest ? $('#er-restore') : $('#er-activate'); if (t && wins.eyerest.open) t.focus({ preventScroll: true });
  }));

  /* ---------- 4. GIF freezing (so "no motion" really stops the GIFs) ---------- */
  const snaps = new Map();
  function gifFallback(img) { // decorative GIF failed to load → its alt text in the site's own type
    if (img.dataset.failed) return; img.dataset.failed = '1'; img.hidden = true;
    const alt = img.getAttribute('alt'); if (alt) img.after(el('span', { class: 'gif-alt', text: alt }));
  }
  $$('img[data-gif]').forEach(img => {
    img.addEventListener('error', () => gifFallback(img), { once: true });
    if (img.complete && !img.naturalWidth && img.getAttribute('src')) gifFallback(img);
  });
  function freezeImg(img) {
    if (img.dataset.frozen || img.dataset.failed) return;
    if (!img.complete || !img.naturalWidth) {
      if (!img.dataset.waiting) {
        img.dataset.waiting = '1';
        img.addEventListener('load', () => { delete img.dataset.waiting; if (!Mode.motionOn()) freezeImg(img); }, { once: true });
      }
      return;
    }
    const orig = img.getAttribute('src');
    try {
      let url = snaps.get(orig);
      if (!url) {
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0); url = c.toDataURL('image/png'); snaps.set(orig, url);
      }
      img.dataset.orig = orig; img.src = url; img.dataset.frozen = '1';
    } catch (e) { // opened from file:// — reading pixels is blocked, so show the alt text instead
      img.hidden = true; img.dataset.frozen = 'hidden';
      const alt = img.getAttribute('alt');
      if (alt) img.after(el('span', { class: 'gif-alt', 'data-gifalt': '1', text: alt }));
    }
  }
  function unfreezeImg(img) {
    if (img.dataset.frozen === '1') img.src = img.dataset.orig;
    if (img.dataset.frozen === 'hidden') { img.hidden = false; const n = img.nextElementSibling; if (n && n.dataset.gifalt) n.remove(); }
    delete img.dataset.frozen;
  }
  const freezeAll = () => $$('img[data-gif]').forEach(freezeImg);
  const unfreezeAll = () => $$('img[data-gif]').forEach(unfreezeImg);

  /* ---------- 5. Sparkles + cursor trail (one canvas, Glitter + motion only) ---------- */
  const fxc = $('#fx'), ctx = fxc.getContext('2d');
  const COLORS = ['#ffffff', '#fff3a8', '#ffc2e8', '#e4d4ff'];
  let fxOn = false, raf = 0, W = 0, H = 0, lastTrail = { x: -99, y: -99 };
  const parts = [], trail = [];
  function fxResize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    fxc.width = Math.round(W * dpr); fxc.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function fxSeed() {
    parts.length = 0; const n = Math.min(44, Math.round(W * H / 24000));
    for (let i = 0; i < n; i++) parts.push({ x: Math.random() * W, y: Math.random() * H, s: 1 + Math.floor(Math.random() * 3), vy: .12 + Math.random() * .3, vx: (Math.random() - .5) * .12, ph: Math.random() * 6.28, per: 2200 + Math.random() * 2600, c: COLORS[i % COLORS.length] });
  }
  function plus(x, y, u, c, a) {
    ctx.globalAlpha = a; ctx.fillStyle = c; x = Math.round(x); y = Math.round(y);
    ctx.fillRect(x, y, u, u); ctx.fillRect(x - u, y, u, u); ctx.fillRect(x + u, y, u, u); ctx.fillRect(x, y - u, u, u); ctx.fillRect(x, y + u, u, u);
  }
  function tick(t) {
    if (!fxOn) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.y -= p.vy; p.x += p.vx; if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; } if (p.x < -6) p.x = W + 6; if (p.x > W + 6) p.x = -6;
      plus(p.x, p.y, p.s, p.c, .35 + .35 * (.5 + .5 * Math.sin(t / p.per * 6.28 + p.ph))); // slow pulse, never a strobe
    }
    const now = performance.now();
    for (let i = trail.length - 1; i >= 0; i--) {
      const a = 1 - (now - trail[i].t) / 700; if (a <= 0) { trail.splice(i, 1); continue; }
      plus(trail[i].x, trail[i].y, 2, trail[i].c, a * .8);
    }
    ctx.globalAlpha = 1; raf = requestAnimationFrame(tick);
  }
  function fxStart() { if (fxOn) return; fxOn = true; fxResize(); fxSeed(); raf = requestAnimationFrame(tick); }
  function fxStop() { fxOn = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, fxc.width, fxc.height); trail.length = 0; }
  window.addEventListener('resize', () => { if (fxOn) { fxResize(); fxSeed(); } });
  window.addEventListener('pointermove', e => {
    if (!fxOn || e.pointerType !== 'mouse') return;
    if (Math.hypot(e.clientX - lastTrail.x, e.clientY - lastTrail.y) < 16) return;
    lastTrail = { x: e.clientX, y: e.clientY };
    trail.push({ x: e.clientX, y: e.clientY, t: performance.now(), c: COLORS[(Math.random() * 4) | 0] });
    if (trail.length > 36) trail.shift();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) fxStop(); else if (Mode.motionOn()) fxStart(); });

  /* ---------- 6. Window manager ---------- */
  const DEST = [
    { id: 'world', label: 'Мой мир', icon: 'heart', desk: false },
    { id: 'projects', label: 'Проекты', icon: 'folder', main: true },
    { id: 'about', label: 'Анкета', icon: 'flower' },
    { id: 'guestbook', label: 'Гостевая', icon: 'book' },
    { id: 'button', label: 'Кнопка 88×31', icon: 'star' },
    { id: 'eyerest', label: 'Отдых для глаз', icon: 'eye' },
    { id: 'contact', label: 'Связь', icon: 'mail' },
    { id: 'other', label: 'Другие работы', icon: 'folder2' },
  ].filter(d => d.id !== 'other' || OTHER.length);
  // [left, top, width, height] — clamped to the viewport on open
  const POS = { world: [128, 46, 540, 540], projects: [150, 38, 900, 680], about: [560, 70, 560, 540], guestbook: [250, 44, 680, 600], button: [520, 96, 480, 560], eyerest: [330, 110, 480, 460], contact: [420, 140, 440, 440], other: [230, 64, 820, 640] };
  const wins = {}; let zTop = 10, frontId = null, startOpen = false;
  const isMobile = () => window.matchMedia('(max-width: 760px)').matches;
  const area = () => $('#desktop').getBoundingClientRect();
  const topGap = () => parseFloat(getComputedStyle(root).getPropertyValue('--mq')) || 0;

  DEST.forEach(d => {
    const node = $('#win-' + d.id);
    node.tabIndex = -1;
    const w = { id: d.id, el: node, open: false, min: false, placed: false, label: d.label };
    wins[d.id] = w;
    const btns = $('.win-btns', node);
    [['min', '_', 'Свернуть'], ['max', '□', 'Развернуть'], ['close', '×', 'Закрыть']].forEach(([act, ch, label]) =>
      btns.append(el('button', { type: 'button', class: 'wbtn', 'data-act': act, 'aria-label': `${label}: ${d.label}`, title: label, text: ch })));
    node.addEventListener('pointerdown', () => bringFront(d.id));
    node.addEventListener('focusin', () => { if (frontId !== d.id) bringFront(d.id); });
    btns.addEventListener('click', e => {
      const b = e.target.closest('.wbtn'); if (!b) return;
      if (b.dataset.act === 'close') closeWin(d.id);
      if (b.dataset.act === 'min') minWin(d.id);
      if (b.dataset.act === 'max') node.classList.toggle('max');
    });
    $('.win-bar', node).addEventListener('dblclick', e => { if (!e.target.closest('.wbtn') && !isMobile()) node.classList.toggle('max'); });
    enableDrag(w);
  });

  function place(w) {
    const a = area(), [x, y, pw, ph] = POS[w.id], g = topGap();
    const width = Math.min(pw, a.width - 16), height = Math.min(ph, a.height - g - 12);
    w.el.style.width = width + 'px'; w.el.style.height = height + 'px';
    w.el.style.left = clamp(x, 8, Math.max(8, a.width - width - 8)) + 'px';
    w.el.style.top = clamp(y + g - 28, g + 6, Math.max(g + 6, a.height - height - 6)) + 'px';
  }
  function bringFront(id) {
    const w = wins[id]; if (!w || !w.open) return;
    zTop = Math.min(zTop + 1, 690); w.el.style.zIndex = zTop; frontId = id; syncWins();
  }
  function syncWins() {
    const tasks = $('#tasks'); tasks.textContent = '';
    Object.values(wins).forEach(w => {
      w.el.classList.toggle('is-open', w.open);
      w.el.classList.toggle('is-min', w.open && w.min);
      w.el.classList.toggle('is-front', w.open && !w.min && frontId === w.id);
      if (w.open) {
        const b = el('button', { type: 'button', class: 'task', 'aria-pressed': String(!w.min && frontId === w.id), text: w.label });
        b.addEventListener('click', () => { if (!w.min && frontId === w.id) minWin(w.id); else openWin(w.id); });
        tasks.append(b);
      }
    });
  }
  function openWin(id, focus = true) {
    const w = wins[id]; if (!w) return;
    if (isMobile()) Object.values(wins).forEach(o => { if (o !== w) { o.open = false; o.min = false; } });
    if (!w.placed) { place(w); w.placed = true; }
    w.open = true; w.min = false; bringFront(id); closeStart();
    if (focus) w.el.focus({ preventScroll: true });
    try { history.replaceState(null, '', id === 'world' ? location.pathname + location.search : '#' + id); } catch (e) { /* ignore */ }
  }
  function closeWin(id) {
    const w = wins[id]; w.open = false; w.min = false; w.el.classList.remove('max');
    if (id === 'projects' || id === 'other') stopClips();
    if (frontId === id) { frontId = null; const next = Object.values(wins).filter(o => o.open && !o.min).sort((a, b) => (+b.el.style.zIndex || 0) - (+a.el.style.zIndex || 0))[0]; if (next) { frontId = next.id; next.el.focus({ preventScroll: true }); } }
    syncWins();
    if (isMobile() && !Object.values(wins).some(o => o.open)) openWin('world', false);
  }
  function minWin(id) {
    const w = wins[id]; w.min = true; if (frontId === id) frontId = null; syncWins();
  }
  function enableDrag(w) {
    const bar = $('.win-bar', w.el); let sx = 0, sy = 0, ox = 0, oy = 0, on = false;
    bar.addEventListener('pointerdown', e => {
      if (e.target.closest('.wbtn') || isMobile() || w.el.classList.contains('max') || e.button > 0) return;
      on = true; sx = e.clientX; sy = e.clientY; ox = w.el.offsetLeft; oy = w.el.offsetTop; bar.setPointerCapture(e.pointerId); w.el.classList.add('dragging');
    });
    bar.addEventListener('pointermove', e => {
      if (!on) return; const a = area();
      w.el.style.left = clamp(ox + e.clientX - sx, -(w.el.offsetWidth - 110), a.width - 110) + 'px';
      w.el.style.top = clamp(oy + e.clientY - sy, topGap(), a.height - 34) + 'px';
    });
    const end = () => { on = false; w.el.classList.remove('dragging'); };
    bar.addEventListener('pointerup', end); bar.addEventListener('pointercancel', end);
  }
  window.addEventListener('resize', () => {
    if (isMobile()) return; const a = area();
    Object.values(wins).forEach(w => {
      if (!w.placed) return;
      const width = Math.min(w.el.offsetWidth, a.width - 16), height = Math.min(w.el.offsetHeight, a.height - topGap() - 8);
      w.el.style.width = width + 'px'; w.el.style.height = height + 'px';
      w.el.style.left = clamp(w.el.offsetLeft, -(width - 110), Math.max(8, a.width - 110)) + 'px';
      w.el.style.top = clamp(w.el.offsetTop, topGap(), Math.max(topGap(), a.height - height)) + 'px';
    });
  });

  /* shortcuts, start menu, clicks */
  function iconBtn(d, scale) {
    const b = el('button', { type: 'button', class: 'icon' + (d.main ? ' is-main' : ''), 'data-open': d.id }, el('span', { 'data-pix': d.icon, 'data-scale': String(scale) }), el('span', { text: d.label }));
    if (d.id === 'other') b.append(el('span', { class: 'cnt is-quiet', 'aria-label': `${OTHER.length} ${plural(OTHER.length, 'работа', 'работы', 'работ')}`, text: String(OTHER.length) }));
    if (d.id === 'projects') b.append(el('span', { class: 'cnt', 'aria-label': `${PROJECTS.length} ${plural(PROJECTS.length, 'проект', 'проекта', 'проектов')}`, text: String(PROJECTS.length) }));
    return b;
  }
  DEST.filter(d => d.desk !== false).forEach(d => $('#icons').append(iconBtn(d, 4)));
  DEST.filter(d => d.id !== 'world').forEach(d => $('#shortcut-grid').append(iconBtn(d, 4)));

  const menu = $('#startmenu');
  function buildStart() {
    menu.textContent = '';
    menu.append(el('div', { class: 'sm-head', text: 'LEYLA OS 2.0 ♥' }));
    DEST.forEach(d => menu.append(el('button', { type: 'button', role: 'menuitem', 'data-open': d.id }, el('span', { 'data-pix': d.icon, 'data-scale': '2' }), d.label)));
    menu.append(el('hr'), el('div', { class: 'sm-sub', text: 'Кейсы' }));
    PROJECTS.forEach(p => menu.append(el('a', { role: 'menuitem', href: `work/${p.slug}.html` }, el('span', { class: 'n', text: p.num }), p.title)));
    if (OTHER.length) {
      menu.append(el('div', { class: 'sm-sub', text: 'Другие работы' }));
      OTHER.forEach(p => menu.append(el('a', { role: 'menuitem', href: `work/${p.slug}.html` }, el('span', { class: 'n', text: p.num }), p.title)));
    }
    menu.append(el('hr'));
    menu.append(el('button', { type: 'button', role: 'menuitem', id: 'sm-eye' }));
    menu.append(el('button', { type: 'button', role: 'menuitem', id: 'sm-motion' }));
    hydratePix(menu);
    $('#sm-eye').addEventListener('click', () => { Mode.toggle(); closeStart(); });
    $('#sm-motion').addEventListener('click', () => { if (!Mode.eyeRest) Mode.setMotion(!Mode.motionOn()); closeStart(); });
    refreshStartMenu();
  }
  function refreshStartMenu() {
    const e = $('#sm-eye'), m = $('#sm-motion'); if (!e) return;
    e.textContent = Mode.eyeRest ? '✦ Вернуть Глиттер' : '☁ Включить «Отдых для глаз»';
    m.textContent = Mode.motionOn() ? '✦ Анимация: выключить' : '✦ Анимация: включить';
    m.disabled = Mode.eyeRest; m.style.opacity = Mode.eyeRest ? '.5' : '';
    m.title = Mode.eyeRest ? 'В режиме «Отдых для глаз» анимация всегда выключена' : '';
  }
  function openStart() { startOpen = true; menu.hidden = false; $('#start').setAttribute('aria-expanded', 'true'); $('button', menu).focus(); }
  function closeStart() { if (!startOpen) return; startOpen = false; menu.hidden = true; $('#start').setAttribute('aria-expanded', 'false'); }
  $('#start').addEventListener('click', e => { e.stopPropagation(); startOpen ? closeStart() : openStart(); });
  menu.addEventListener('keydown', e => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = $$('[role="menuitem"]', menu).filter(i => !i.disabled); const i = items.indexOf(document.activeElement);
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); e.preventDefault();
  });
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open]');
    if (t) { e.preventDefault(); openWin(t.dataset.open); return; }
    if (startOpen && !e.target.closest('#startmenu')) closeStart();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (startOpen) { closeStart(); $('#start').focus(); return; }
    if (frontId && !isMobile() && document.activeElement && wins[frontId].el.contains(document.activeElement)) closeWin(frontId);
  });
  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (wins[h]) openWin(h); });
  function tickClock() { $('#clock').textContent = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }); }
  tickClock(); setInterval(tickClock, 30000);

  /* ---------- 7. Projects archive (data: data/projects.js) ---------- */
  const FILTERS = [
    { id: 'all', label: 'Все', test: () => true },
    { id: 'special', label: 'Спецпроекты', test: p => p.type === 'special' },
    { id: 'client', label: 'Клиентские', test: p => p.type === 'client' },
    { id: 'personal', label: 'Личные', test: p => p.type === 'personal' },
    { id: 'concept', label: 'Концепты', test: p => p.type === 'concept' },
    { id: 'wip', label: 'В работе', test: p => !!p.stage && ['wip', 'moodboard'].includes(p.stage.key) },
  ];
  let projFilter = 'all';
  const caseUrl = p => `work/${p.slug}.html`;

  function buildFilters() {
    const box = $('#proj-filter'); box.textContent = '';
    FILTERS.forEach(f => {
      const n = PROJECTS.filter(f.test).length; if (!n && f.id !== 'all') return;
      const b = el('button', { type: 'button', class: 'chip', 'data-filter': f.id, 'aria-pressed': String(f.id === projFilter) }, f.label, ' ', el('span', { class: 'n', text: `(${n})` }));
      b.addEventListener('click', () => { projFilter = f.id; $$('.chip', box).forEach(c => c.setAttribute('aria-pressed', String(c === b))); renderProjects(); });
      box.append(b);
    });
  }

  function missingHalf(label, note) { return el('div', { class: 'half' }, el('span', { text: label }), el('small', { text: note })); }
  function previewEl(p) {
    const pv = p.preview || { kind: 'missing', label: 'ПРЕВЬЮ' };
    const a = el('a', { class: 'pm', href: caseUrl(p), tabindex: '-1', 'aria-hidden': 'true', style: `--ratio:${pv.ratio || '16 / 10'}` });
    const bar = el('div', { class: 'pm-bar' }, el('i'), el('i'), el('i'), el('span', { text: p.file }));
    if (pv.kind === 'image') {
      a.append(bar);
      const img = el('img', { src: pv.src, alt: '', loading: 'lazy', decoding: 'async' });
      img.addEventListener('error', () => { a.className = 'pm ph'; a.textContent = ''; a.append(bar, missingHalf('ФАЙЛ НЕ НАЙДЕН', pv.src), missingHalf('превью', 'добавь картинку')); });
      a.append(img);
      if (pv.clip) { a.append(el('video', { muted: true, loop: true, playsinline: true, preload: 'none', 'data-src': pv.clip, 'aria-hidden': 'true' }), el('span', { class: 'pm-tag', text: '▶ видео' })); a.dataset.clip = '1'; }
    } else if (pv.kind === 'specimen') {
      a.classList.add('spec'); a.style.cssText += `;--sbg:${pv.bg};--sink:${pv.ink};--sacc:${pv.accent}`;
      a.append(bar, ...pv.lines.map(l => el('span', { class: 'sl', style: `--s:${l.size};font-family:"${l.family}",serif`, text: l.text })));
      if (pv.note) a.append(el('span', { class: 'pm-note', text: pv.note }));
    } else if (pv.kind === 'palette') {
      a.classList.add('pal'); a.append(bar, ...pv.colors.map(c => el('b', { style: `background:${c}` })));
      if (pv.note) a.append(el('span', { class: 'pm-note', text: pv.note }));
    } else {
      a.classList.add('ph');
      if (p.layout === 'before-after') a.append(bar, missingHalf('ДО', 'скриншот не добавлен'), missingHalf('ПОСЛЕ', 'макет не добавлен'));
      else a.append(bar, missingHalf('ФАЙЛ НЕ НАЙДЕН', 'превью не добавлено'), missingHalf(pv.label || 'ПРЕВЬЮ', 'скоро'));
    }
    return a;
  }
  function projItem(p) {
    const t = TYPES[p.type] || { label: p.type };
    const badges = el('div', { class: 'proj-badges' }, el('span', { class: `badge t-${p.type}`, text: t.label }), p.stage ? el('span', { class: `badge s-${p.stage.key}`, text: p.stage.label }) : null);
    const actions = el('div', { class: 'proj-actions' },
      el('a', { class: 'btn', href: caseUrl(p), 'aria-label': `Открыть кейс: ${p.title}` }, 'OPEN CASE ↗'),
      p.links && p.links.play ? el('a', { class: 'btn btn-alt', href: p.links.play, target: '_blank', rel: 'noopener', 'aria-label': `Играть в «${p.title}» (откроется в новой вкладке)` }, '▶ Играть') : null,
      p.links && p.links.live ? el('a', { class: 'btn btn-alt', href: p.links.live, target: '_blank', rel: 'noopener', 'aria-label': `Живой сайт ${p.title} (новая вкладка)` }, 'Сайт ↗') : null);
    const info = el('div', { class: 'proj-info' },
      el('p', { class: 'proj-num', text: `№ ${p.num} · ${p.file}` }),
      el('h3', { class: 'proj-title' }, el('a', { href: caseUrl(p) }, p.title)),
      badges,
      el('p', { class: 'proj-role' }, el('b', { text: 'Роль: ' }), p.role),
      el('p', { class: 'proj-sum', text: p.summary }),
      actions);
    const li = el('li', { class: 'proj', 'data-layout': p.layout, 'data-type': p.type }, previewEl(p), info);
    if ($('.pm[data-clip]', li)) {
      const play = () => playClip(li), stop = () => stopClip(li);
      li.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') play(); });
      li.addEventListener('pointerleave', stop);
      li.addEventListener('focusin', play); li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) stop(); });
    }
    return li;
  }
  /* hover previews: muted, one at a time, never in Eye Rest / reduced motion */
  let playing = null;
  function playClip(li) {
    if (!Mode.motionOn()) return;
    const pm = $('.pm', li), v = $('video', pm); if (!v) return;
    if (playing && playing !== li) stopClip(playing);
    if (!v.src) v.src = v.dataset.src;
    v.muted = true; const pr = v.play(); if (pr && pr.catch) pr.catch(() => { });
    pm.classList.add('is-playing'); playing = li;
  }
  function stopClip(li) { const pm = $('.pm', li), v = $('video', pm); if (v) v.pause(); pm.classList.remove('is-playing'); if (playing === li) playing = null; }
  function stopClips() { $$('#proj-list .proj, #other-list .proj').forEach(stopClip); }

  function renderProjects() {
    const list = $('#proj-list'); list.textContent = '';
    const f = FILTERS.find(x => x.id === projFilter) || FILTERS[0];
    const items = PROJECTS.filter(f.test);
    if (!items.length) list.append(el('li', { class: 'ex-empty', text: 'В этой папке пока пусто ♥' }));
    items.forEach(p => list.append(projItem(p)));
    if (OTHER.length) list.append(el('li', { class: 'ex-more' },
      el('button', { type: 'button', class: 'ex-more-btn', 'data-open': 'other' },
        el('span', { 'data-pix': 'folder2', 'data-scale': '3' }),
        el('span', {}, el('b', { text: `ДРУГИЕ_РАБОТЫ.DIR (${OTHER.length})` }), el('small', { text: 'Сайты, UI-концепты и Framer-компоненты для клиентов — отдельной папкой' })))));
    hydratePix(list);
    const vids = items.filter(p => p.preview && p.preview.clip).length;
    $('#proj-status').textContent = `${items.length} ${plural(items.length, 'объект', 'объекта', 'объектов')} · ${vids} с видео · кейс открывается отдельной страницей`;
  }
  function renderOther() {
    const list = $('#other-list'); list.textContent = '';
    OTHER.forEach(p => list.append(projItem(p)));
    $('#other-status').textContent = `${OTHER.length} ${plural(OTHER.length, 'объект', 'объекта', 'объектов')} · вне темы спецпроектов`;
  }
  $('#world-status').textContent = `1 анкета · ${PROJECTS.length} ${plural(PROJECTS.length, 'проект', 'проекта', 'проектов')} · 0 вирусов (проверено Касперским)`;

  /* ---------- 8. Guestbook (own entries stay in this browser only) ---------- */
  const GB_KEY = 'leyla-os:guestbook';
  const DEMO = [
    { name: '*~Dreamy~*', icon: 'heart', date: '15 мая 2002\n20:27', msg: 'ОБОЖАЮ твой сайт!!! Такой милый и блестящий :) так держать!' },
    { name: 'Sk8er_Boi', icon: 'star', date: '16 мая 2002\n16:12', msg: 'Йо! Зачетный сайт!! Графика рулит! Пока-пока…' },
    { name: '*·.kiki.·*', icon: 'butterfly', date: '17 мая 2002\n09:45', msg: 'Ааа… твоя страничка просто прелесть! Я ♥ ее!!!' },
    { name: 'Солнышко', icon: 'flower', date: '18 мая 2002\n13:03', msg: 'Так ярко и радостно! Улыбаюсь каждый раз, когда захожу :)' },
    { name: 'z0rG', icon: 'star', date: '19 мая 2002\n19:55', msg: 'Приветы с другого конца галактики…' },
  ];
  let gbN = 0;
  function gbRow(e, mine) {
    const tr = el('tr', { class: `c${gbN++ % 5}${mine ? ' mine' : ''}` },
      el('td', {}, el('span', { 'data-pix': e.icon, 'data-scale': '3' })),
      el('td', {}, el('span', { class: 'nm', text: e.name }), el('span', { class: mine ? 'tag-local' : 'tag-demo', text: mine ? 'ТЫ · ТОЛЬКО У ТЕБЯ' : 'ДЕМО' }), el('span', { class: 'when-inline', text: e.date })),
      el('td', { class: 'when', text: e.date }),
      el('td', { text: e.msg }));
    hydratePix(tr); return tr;
  }
  let mineEntries = [];
  try { mineEntries = JSON.parse(ls.get(GB_KEY) || '[]').filter(x => x && x.name && x.msg).slice(0, 20); } catch (e) { mineEntries = []; }
  DEMO.forEach(e => $('#gb-rows').append(gbRow(e, false)));
  mineEntries.slice().reverse().forEach(e => $('#gb-rows').prepend(gbRow(e, true)));
  const gbForm = $('#gb-form'), gbName = $('#gb-name'), gbMsg = $('#gb-msg');
  gbMsg.addEventListener('input', () => { $('#gb-count').textContent = `${gbMsg.value.length}/140`; });
  function setErr(input, errId, msg) { $('#' + errId).textContent = msg; input.setAttribute('aria-invalid', msg ? 'true' : 'false'); return !msg; }
  gbForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = gbName.value.trim().replace(/\s+/g, ' '), msg = gbMsg.value.trim();
    const okN = setErr(gbName, 'gb-name-err', name.length < 2 ? 'Напиши ник — хотя бы 2 символа.' : '');
    const okM = setErr(gbMsg, 'gb-msg-err', msg.length < 3 ? 'Напиши пару слов — хотя бы 3 символа.' : '');
    const st = $('#gb-status');
    if (!okN || !okM) { st.textContent = 'Почти! Поправь подсвеченное поле.'; (okN ? gbMsg : gbName).focus(); return; }
    const d = new Date();
    const when = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) + '\n' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const entry = { name, icon: new FormData(gbForm).get('icon') || 'heart', date: when, msg };
    $('#gb-rows').prepend(gbRow(entry, true));
    mineEntries.unshift(entry); const saved = ls.set(GB_KEY, JSON.stringify(mineEntries.slice(0, 20)));
    gbMsg.value = ''; $('#gb-count').textContent = '0/140';
    st.textContent = saved ? '✓ Записано! Запись видна только тебе, в этом браузере.' : '✓ Записано! Браузер не разрешил сохранение — после перезагрузки запись пропадет.';
    $('#gb-table').scrollIntoView({ block: 'nearest' });
  });
  $$('[data-gb]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    if (a.dataset.gb === 'form') { gbForm.scrollIntoView({ block: 'center' }); gbName.focus({ preventScroll: true }); } else $('#gb-table').scrollIntoView({ block: 'start' });
  }));

  /* ---------- 9. Link-me button ---------- */
  function buildEmbed() {
    const site = (CONFIG.SITE_URL || '').trim(); let banner = (CONFIG.BANNER_URL || '').trim();
    if (!banner && site) { try { banner = new URL('assets/leyla-button-88x31.gif', site.endsWith('/') ? site : site + '/').href; } catch (e) { banner = ''; } }
    const href = site || 'ВСТАВЬ-АДРЕС-ПОРТФОЛИО', src = banner || 'ВСТАВЬ-АДРЕС-КНОПКИ';
    return { ready: !!(site && banner), site, code: `<a href="${escAttr(href)}" target="_blank" rel="noopener"><img src="${escAttr(src)}" width="88" height="31" alt="Лейла — портфолио" style="image-rendering:pixelated;border:0"></a>` };
  }
  (function initButton() {
    const { ready, site, code } = buildEmbed();
    $('#embed-code').value = code;
    $$('.btn88-link').forEach(a => { a.href = site || './'; if (site) { a.target = '_blank'; a.rel = 'noopener'; } });
    const note = $('#url-note');
    note.classList.toggle('ok', ready);
    note.textContent = ready ? '✓ В коде уже стоят настоящие адреса сайта и кнопки.'
      : 'Сайт еще не опубликован, поэтому в коде пока заглушки «ВСТАВЬ-…». Когда сайт будет онлайн, впиши SITE_URL в data/site.js — код заполнится сам.';
    $('#copy-embed').addEventListener('click', async () => {
      const st = $('#copy-status'), ta = $('#embed-code'); let ok = false;
      try { await navigator.clipboard.writeText(ta.value); ok = true; } catch (e) {
        try { ta.focus(); ta.select(); ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      }
      st.textContent = ok ? (ready ? 'Скопировано! ♥' : 'Скопировано. Не забудь заменить заглушки «ВСТАВЬ-…».') : 'Не получилось — выдели текст и нажми Ctrl/⌘+C.';
    });
  })();

  /* ---------- 10. Contact ---------- */
  (function initContact() {
    const mail = (CONFIG.EMAIL || '').trim();
    if (mail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      $('#contact-live').hidden = false; $('#contact-missing').hidden = true;
      const a = $('#c-mail'); a.href = 'mailto:' + mail; a.textContent = mail;
      $('#contact-form').addEventListener('submit', e => {
        e.preventDefault();
        const name = $('#c-name').value.trim(), msg = $('#c-msg').value.trim();
        if (msg.length < 3) { $('#c-err').textContent = 'Сначала напиши пару слов.'; $('#c-msg').setAttribute('aria-invalid', 'true'); $('#c-msg').focus(); return; }
        $('#c-err').textContent = ''; $('#c-msg').setAttribute('aria-invalid', 'false');
        location.href = `mailto:${mail}?subject=${encodeURIComponent('Привет из портфолио' + (name ? ' — ' + name : ''))}&body=${encodeURIComponent(msg)}`;
      });
    }
    const isLocal = /^(localhost|127\.0\.0\.1|)$/.test(location.hostname);
    if (!$('#contact-live').hidden || !isLocal) $('#contact-missing').hidden = true; // the "fill in data/site.js" hint is for Leyla only
    const tg = (CONFIG.TELEGRAM || '').trim().replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '');
    if (tg) $('#contact-tg').append(el('a', { class: 'btn btn-big', href: `https://t.me/${tg}`, target: '_blank', rel: 'noopener' }, `✈ Telegram @${tg}`));
    const ul = $('#link-list');
    (CONFIG.LINKS || []).forEach(l => ul.append(el('li', {}, el('a', { href: l.url, target: '_blank', rel: 'noopener', text: l.label + ' ↗' }))));
    if (!ul.children.length) ul.hidden = true;
  })();

  /* ---------- 11. Boot ----------
     ENTER works from the first frame: the progress bar is decoration and never blocks.
     Shown once per browser session; deep links (#projects from a case page) skip it. */
  (function boot() {
    const bootEl = $('#boot'), fill = $('#boot-fill'), bar = $('#boot-bar'), status = $('#boot-status'), enter = $('#boot-enter');
    const lock = on => ['#desktop', '#taskbar'].forEach(s => { const n = $(s); if (on) n.setAttribute('inert', ''); else n.removeAttribute('inert'); });
    let done = false, iv = 0;
    function go(focus = true) {
      if (done) return; done = true; clearInterval(iv); ss.set('leyla-os:booted', '1');
      lock(false); bootEl.classList.add('is-done'); setTimeout(() => { bootEl.hidden = true; }, 380);
      const h = location.hash.slice(1);
      if (h && h !== 'world' && wins[h]) { if (!isMobile()) openWin('world', false); openWin(h, focus); } else openWin('world', focus);
    }
    if (ss.get('leyla-os:booted') || (location.hash && wins[location.hash.slice(1)])) { root.classList.add('booted'); bootEl.hidden = true; go(false); return; }

    lock(true);
    const msgs = ['Загружаем блестки и дофамин…', 'Полируем глиттер…', 'Сдуваем пыль с пикселей…', 'Раскладываем проекты по папкам…', 'Почти гламурно…'];
    const finish = () => { fill.style.width = '100%'; bar.setAttribute('aria-valuenow', '100'); status.textContent = 'Готово! Жми ENTER ♥'; enter.classList.add('is-ready'); };
    if (!Mode.motionOn()) finish();
    else {
      let p = 0;
      iv = setInterval(() => {
        p = Math.min(100, p + 8 + Math.random() * 8);
        fill.style.width = p + '%'; bar.setAttribute('aria-valuenow', String(Math.round(p)));
        status.textContent = msgs[Math.min(msgs.length - 1, Math.floor(p / 100 * msgs.length))];
        if (p >= 100) { clearInterval(iv); finish(); }
      }, 110);
    }
    enter.focus({ preventScroll: true });
    enter.addEventListener('click', () => go());
    $('#boot-calm').addEventListener('click', () => { Mode.set('eyerest'); go(); });
    document.addEventListener('keydown', function onKey(e) {
      if (done) { document.removeEventListener('keydown', onKey); return; }
      if (e.key === 'Enter' && !e.target.closest('button, a, input, textarea')) { e.preventDefault(); go(); }
    });
  })();

  /* ---------- 12. Init ---------- */
  buildStart();
  buildFilters();
  renderProjects();
  renderOther();
  hydratePix();
  Mode.onChange(onMode);
  onMode();
  syncWins();
})();
