/* ==========================================================
   LEYLA OS — case page behaviour (progressive: the page works without it)
   - hero video: muted loop only while visible and only in Glitter + motion;
     every other video waits for the visitor (controls, preload="none")
   - only one video plays at a time
   - before/after slider, image lightbox
   ========================================================== */
(function () {
  'use strict';
  var Mode = window.LeylaMode;
  var vids = [].slice.call(document.querySelectorAll('video'));

  /* one at a time */
  vids.forEach(function (v) {
    v.addEventListener('play', function () { vids.forEach(function (o) { if (o !== v && !o.paused) o.pause(); }); });
  });

  /* hero autoplay — muted, in view, motion allowed */
  var hero = document.querySelector('video[data-autoplay]'), inView = false, userPaused = false;
  function syncHero() {
    if (!hero) return;
    var want = inView && !userPaused && Mode && Mode.motionOn();
    if (want && hero.paused) { hero.muted = true; var p = hero.play(); if (p && p.catch) p.catch(function () { }); }
    if (!want && !hero.paused && !userPaused) hero.pause();
  }
  if (hero) {
    hero.addEventListener('pause', function () { if (inView && Mode.motionOn() && !document.hidden) userPaused = true; });
    hero.addEventListener('play', function () { userPaused = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { inView = es[0].isIntersecting; syncHero(); }, { threshold: .35 }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden && !hero.paused) hero.pause(); else syncHero(); });
    if (Mode) Mode.onChange(function () { if (!Mode.motionOn() && !hero.paused) hero.pause(); else syncHero(); });
  }

  /* before / after */
  [].forEach.call(document.querySelectorAll('.ba'), function (ba) {
    var r = ba.querySelector('.ba-range');
    if (r) r.addEventListener('input', function () { ba.style.setProperty('--pos', r.value + '%'); });
  });

  /* lightbox */
  var dlg = document.querySelector('.lightbox');
  if (dlg && typeof dlg.showModal === 'function') {
    var img = dlg.querySelector('img'), last = null;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a.zoom'); if (!a) return;
      e.preventDefault(); last = a;
      var src = a.querySelector('img');
      img.src = a.getAttribute('href'); img.alt = src ? src.alt : '';
      dlg.showModal();
    });
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { img.removeAttribute('src'); if (last) last.focus(); });
  }
})();
