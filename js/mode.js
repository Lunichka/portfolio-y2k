/* ==========================================================
   LEYLA OS — shared mode state (desktop + case pages)
   mode   : 'glitter' (default) | 'eyerest'  — remembered across pages and reloads
   motion : follows prefers-reduced-motion unless the visitor flips it by hand
   The <head> of every page sets html.eye-rest before first paint
   (see the inline snippet), so there is no flash of the wrong theme.
   Storage is optional: if it is blocked the site simply starts in Glitter.
   ========================================================== */
(function () {
  'use strict';
  var KEY = 'leyla-os:mode', MKEY = 'leyla-os:motion';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false, addEventListener: function () {} };
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* storage off: keep it in memory */ } }

  var state = {
    mode: read(KEY) === 'eyerest' ? 'eyerest' : 'glitter',
    motionPref: read(MKEY), // 'on' | 'off' | null (= follow the OS)
  };
  var subs = [];

  function motionOn() {
    if (state.mode === 'eyerest') return false;
    if (state.motionPref === 'on') return true;
    if (state.motionPref === 'off') return false;
    return !mq.matches;
  }
  function apply() {
    root.classList.toggle('eye-rest', state.mode === 'eyerest');
    root.classList.toggle('no-motion', !motionOn());
    document.querySelectorAll('[data-mode-switch]').forEach(sync);
    subs.forEach(function (fn) { try { fn(api); } catch (e) { console.error(e); } });
  }
  function set(mode) {
    mode = mode === 'eyerest' ? 'eyerest' : 'glitter';
    if (mode === state.mode) return;
    state.mode = mode; write(KEY, mode); apply();
    announce(mode === 'eyerest' ? 'Режим «Отдых для глаз» включён' : 'Режим «Глиттер» включён');
  }
  function setMotion(on) { state.motionPref = on ? 'on' : 'off'; write(MKEY, state.motionPref); apply(); }

  /* live region so screen-reader users hear the switch */
  var live;
  function announce(t) {
    if (!live) { live = document.createElement('p'); live.className = 'vh'; live.setAttribute('aria-live', 'polite'); document.body.appendChild(live); }
    live.textContent = ''; setTimeout(function () { live.textContent = t; }, 30);
  }

  /* <div data-mode-switch></div> → segmented control [✦ Глиттер | ☁ Отдых для глаз] */
  function build(host) {
    if (host.dataset.ready) return;
    host.dataset.ready = '1';
    host.classList.add('mode-switch');
    host.setAttribute('role', 'group');
    host.setAttribute('aria-label', 'Режим оформления');
    host.title = 'Вырвиглаз-режим: блёстки ВКЛ / ВЫКЛ';
    if (host.dataset.caption !== 'off') {
      var cap = document.createElement('span'); cap.className = 'ms-cap'; cap.textContent = host.dataset.caption || 'Режим'; cap.setAttribute('aria-hidden', 'true');
      host.appendChild(cap);
    }
    [['glitter', '✦', 'Глиттер'], ['eyerest', '☁', 'Отдых для глаз']].forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button'; b.dataset.mode = o[0];
      b.innerHTML = '<span aria-hidden="true">' + o[1] + '</span><span class="ms-l">' + o[2] + '</span>';
      b.addEventListener('click', function () { set(o[0]); });
      host.appendChild(b);
    });
    sync(host);
  }
  function sync(host) {
    host.querySelectorAll('button[data-mode]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode)); });
  }

  /* another tab switched the mode → follow it */
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { state.mode = e.newValue === 'eyerest' ? 'eyerest' : 'glitter'; apply(); }
    if (e.key === MKEY) { state.motionPref = e.newValue; apply(); }
  });
  if (mq.addEventListener) mq.addEventListener('change', function () { if (!state.motionPref) apply(); });

  var api = {
    get mode() { return state.mode; },
    get eyeRest() { return state.mode === 'eyerest'; },
    motionOn: motionOn,
    set: set,
    toggle: function () { set(state.mode === 'eyerest' ? 'glitter' : 'eyerest'); },
    setMotion: setMotion,
    onChange: function (fn) { subs.push(fn); },
    mount: function (scope) { (scope || document).querySelectorAll('[data-mode-switch]').forEach(build); },
    apply: apply,
  };
  window.LeylaMode = api;
  function init() { api.mount(); apply(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
