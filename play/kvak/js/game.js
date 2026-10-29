/* ==========================================================
   КВАК, ГДЕ МОИ ВЕЩИ?!  ·  логика игры
   Без зависимостей и сборщика: открывается прямо из index.html.
   ========================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     НАСТРОЙКИ
     Координаты — в пикселях исходной сцены 1024 × 559 (assets/scene.png).
     Позиция (x, y) — центр предмета, w — ширина, ar — соотношение w/h.
     Чтобы заменить заглушку своим рисунком: положи PNG/SVG в assets/props/
     и поменяй `src` (и при необходимости x, y, w, ar, rot).
     --------------------------------------------------------- */
  var SCENE_W = 1024, SCENE_H = 559;
  var GAME_SECONDS = 60;
  var EXTRA_SECONDS = 30;

  var ITEMS = [
    {
      id: 'avia', name: 'Авиабилет',
      src: 'assets/props/ticket-avia.svg', placeholder: true,
      x: 78, y: 338, w: 74, ar: 220 / 90, rot: -9,
      theme: 'm-avia', partner: 'Aviasales',
      title: 'Ты нашел билет. Пора сваливать из этого офиса.',
      text: 'Квак заслужил отпуск. Мы тоже считаем, что после такого дедлайна пора сменить обстановку.',
      quote: 'Я не сбегаю. Я работаю удаленно. Желательно — с пальмами.',
      rewardLabel: 'Промокод на покупку авиабилета',
      cta: 'Забрать промокод',
      code: 'KVAK-FLY',
      detail: 'Демонстрационный промокод для портфолио. В реальности не действует: Aviasales в проекте не участвует.'
    },
    {
      id: 'kino', name: 'Билет в кино',
      src: 'assets/props/ticket-cinema.svg', placeholder: true,
      x: 962, y: 338, w: 62, ar: 2, rot: 14,
      theme: 'm-kino', partner: 'Кинопоиск',
      title: 'Хотя бы фильм с нормальным финалом.',
      text: 'Квак закрывает ноутбук и выбирает, что посмотреть вечером вместо рабочих чатов.',
      quote: 'Главное — не открывать рабочий чат до титров.',
      rewardLabel: 'Пробный период подписки или специальное предложение на просмотр',
      cta: 'Открыть подарок',
      code: null,
      detail: 'Демо-подарок: «Один вечер без рабочих чатов». Реальная подписка не предоставляется — это концепт рекламной механики.'
    },
    {
      id: 'card', name: 'Банковская карта',
      src: 'assets/props/card-bank.svg', placeholder: true,
      x: 842, y: 366, w: 52, ar: 170 / 108, rot: -5,
      theme: 'm-bank', partner: 'Т-Банк',
      title: 'Карта найдена. Финансовая грамотность — позже.',
      text: 'Квак обнаружил карту и решил хотя бы сегодня получить что-то приятное.',
      quote: 'Баланс не проверяю. Я в порядке. Наверное.',
      rewardLabel: 'Участие в розыгрыше призов или бонус за выполнение игрового задания',
      cta: 'Посмотреть бонус',
      code: null,
      detail: 'Демо-бонус: задание «Найди карту» выполнено. Это условная игровая механика: реального розыгрыша и реальных призов нет.'
    },
    {
      id: 'receipt', name: 'Чек из «Вкусно — и точка»',
      src: 'assets/props/receipt.svg', placeholder: false,
      x: 236, y: 366, w: 86, ar: 512 / 263.36, rot: -7,
      theme: 'm-food', partner: '«Вкусно — и точка»',
      title: 'Последний обед до следующего дедлайна.',
      text: 'Квак вспоминает, что люди вообще-то должны иногда есть, а не только отвечать на сообщения.',
      quote: 'Когда я ел в последний раз? Вторник? Вроде вторник.',
      rewardLabel: 'Промокод на скидку на заказ',
      cta: 'Забрать скидку',
      code: 'KVAK-LUNCH',
      detail: 'Демонстрационный промокод, не действует. Бренд в проекте не участвует.'
    },
    {
      id: 'pills', name: 'Упаковка успокоительных таблеток',
      src: null, thumb: 'assets/props/blister.svg', placeholder: false,
      /* предмет уже нарисован в сцене — рисуем только область клика */
      x: 847, y: 313, w: 38, h: 26, ar: 38 / 26, rot: 0,
      theme: 'm-calm', partner: 'Ясно',
      title: 'Квак, тебе не обязательно справляться со всем в одиночку.',
      text: 'Иногда лучший способ разобраться с хаосом — сделать паузу и поговорить с человеком, который умеет слушать.',
      quote: 'Окей. Один вдох. Потом второй.',
      rewardLabel: 'Специальное предложение на первую консультацию',
      cta: 'Узнать о поддержке',
      code: null,
      detail: 'Демо-предложение: первая консультация на особых условиях. Это не медицинская услуга и не обещание результата; в реальной интеграции здесь были бы условия партнера. Если сейчас тяжело — можно поговорить с близким человеком или специалистом.'
    }
  ];

  var APPS = { avia: 'Почта · Входящие', kino: 'Сообщения · Вечер', card: 'Банк · Уведомление', receipt: 'Чек № 0001', pills: 'Чат · Пауза' };
  var MISS_WORDS = ['КВА?', 'Мимо!', 'Не то', 'Холодно', 'Ква-ква…', 'Тут пусто'];
  var HIT_PAD = 10; // запас вокруг предмета для области клика, px сцены

  /* ---------------------------------------------------------
     ХЕЛПЕРЫ
     --------------------------------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function byId(id) { for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === id) return ITEMS[i]; return null; }

  var dom = {
    app: $('#app'),
    screens: { cover: $('#screen-cover'), game: $('#screen-game'), final: $('#screen-final') },
    wipe: $('#wipe'),
    props: $('#props'), hotspots: $('#hotspots'), stage: $('#game-stage'), misses: $('#misses'),
    list: $('#items'),
    count: $('#count-found'), countBox: $('.stat-count'),
    timer: $('#timer'), timeLeft: $('#time-left'), timeBar: $('#time-bar-fill'),
    modal: $('#modal'), modalCard: $('#modal-card'), modalX: $('#modal-x'),
    modalChip: $('#modal-chip'), modalProgress: $('#modal-progress'),
    modalImg: $('#modal-art-img'), modalQuote: $('#modal-quote'),
    modalTitle: $('#modal-title'), modalText: $('#modal-text'),
    rewardLabel: $('#reward-label'), rewardReveal: $('#reward-reveal'),
    rewardCode: $('#reward-code'), rewardCodeText: $('#reward-code-text'), rewardDetail: $('#reward-detail'),
    modalCta: $('#modal-cta'), modalBack: $('#modal-back'), btnCopy: $('#btn-copy'),
    timeout: $('#timeout'), timeoutCard: $('#timeout-card'), timeoutFound: $('#timeout-found'),
    btnRestart: $('#btn-restart'), restartConfirm: $('#restart-confirm')
  };

  /* ---------------------------------------------------------
     СОСТОЯНИЕ
     --------------------------------------------------------- */
  var state = {
    screen: 'cover',
    found: [],            // id найденных предметов в порядке находки
    remaining: GAME_SECONDS * 1000,
    barMax: GAME_SECONDS * 1000,
    elapsed: 0,           // сколько мс реально шла игра
    misses: 0,
    running: false,       // идет ли таймер
    modalOpen: false,
    timeoutOpen: false,
    openedId: null,
    winPending: false,
    lastFocus: null
  };
  var lastTick = 0, tickId = null;

  /* ---------------------------------------------------------
     СБОРКА СЦЕНЫ И СПИСКА
     --------------------------------------------------------- */
  function pct(v, total) { return (v / total * 100).toFixed(3) + '%'; }

  function buildScene() {
    ITEMS.forEach(function (it) {
      var h = it.h || it.w / it.ar;
      if (it.src) {
        var img = el('img', 'prop', { src: it.src, alt: '', draggable: 'false', 'data-prop': it.id });
        if (it.placeholder) img.setAttribute('data-placeholder', 'true');
        img.style.left = pct(it.x, SCENE_W);
        img.style.top = pct(it.y, SCENE_H);
        img.style.width = pct(it.w, SCENE_W);
        img.style.setProperty('--rot', it.rot + 'deg');
        dom.props.appendChild(img);
      }
      var b = el('button', 'hotspot', { type: 'button', 'data-id': it.id });
      b.style.left = pct(it.x, SCENE_W);
      b.style.top = pct(it.y, SCENE_H);
      b.style.width = pct(it.w + HIT_PAD, SCENE_W);
      b.style.height = pct(h + HIT_PAD, SCENE_H);
      b.style.setProperty('--rot', it.rot + 'deg');
      b.setAttribute('aria-label', it.name + '. Нажми, если нашел');
      b.addEventListener('click', function (e) { e.stopPropagation(); onItemClick(it.id, b); });
      dom.hotspots.appendChild(b);
    });
    // клавиатурный порядок не подсказывает ответы: перемешиваем DOM-порядок кнопок
    var spots = $$('.hotspot', dom.hotspots);
    for (var i = spots.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      dom.hotspots.insertBefore(spots[j], spots[i].nextSibling);
    }
  }

  function buildList() {
    ITEMS.forEach(function (it) {
      var li = el('li', 'item', { 'data-id': it.id });
      var th = el('div', 'item-thumb');
      var im = el('img', '', { src: it.thumb || it.src, alt: '', draggable: 'false' });
      th.appendChild(im);
      var nm = el('div', 'item-name');
      nm.appendChild(document.createTextNode(it.name));
      var re = el('span', 'item-reopen');
      re.textContent = 'Найдено · открыть историю';
      nm.appendChild(re);
      var st = el('span', 'item-state', { 'aria-hidden': 'true' });
      var btn = el('button', 'item-btn', { type: 'button' });
      btn.hidden = true;
      btn.setAttribute('aria-label', 'Открыть историю: ' + it.name);
      btn.addEventListener('click', function () { openModal(it.id, btn); });
      li.appendChild(th); li.appendChild(nm); li.appendChild(st); li.appendChild(btn);
      dom.list.appendChild(li);
    });
  }

  function renderState(justFoundId) {
    dom.count.textContent = state.found.length;
    $$('#cells i').forEach(function (c, i) { c.classList.toggle('on', i < state.found.length); });
    ITEMS.forEach(function (it) {
      var isFound = state.found.indexOf(it.id) !== -1;
      var hs = $('.hotspot[data-id="' + it.id + '"]');
      var li = $('.item[data-id="' + it.id + '"]');
      var pr = $('.prop[data-prop="' + it.id + '"]');
      hs.classList.toggle('is-found', isFound);
      hs.setAttribute('aria-label', it.name + (isFound ? '. Уже найдено. Нажми, чтобы открыть историю' : '. Нажми, если нашел'));
      li.classList.toggle('is-found', isFound);
      $('.item-state', li).textContent = isFound ? '✓' : '';
      $('.item-btn', li).hidden = !isFound;
      if (pr) pr.classList.toggle('is-found', isFound);
      if (justFoundId === it.id) {
        li.classList.remove('just-found'); void li.offsetWidth; li.classList.add('just-found');
        hs.classList.remove('pop'); void hs.offsetWidth; hs.classList.add('pop');
      }
    });
    if (justFoundId) {
      dom.countBox.classList.remove('bump'); void dom.countBox.offsetWidth; dom.countBox.classList.add('bump');
    }
  }

  /* ---------------------------------------------------------
     ТАЙМЕР
     --------------------------------------------------------- */
  function renderTimer() {
    var sec = Math.max(0, Math.ceil(state.remaining / 1000));
    dom.timeLeft.textContent = sec;
    dom.timeBar.style.transform = 'scaleX(' + Math.max(0, state.remaining / state.barMax).toFixed(4) + ')';
    dom.timer.classList.toggle('is-warn', sec <= 20 && sec > 10);
    dom.timer.classList.toggle('is-danger', sec <= 10 && state.screen === 'game' && state.running);
    dom.timer.classList.toggle('is-paused', !state.running && state.screen === 'game' && state.remaining > 0);
    dom.timer.setAttribute('aria-label', 'Осталось ' + sec + ' секунд');
    updateFire();   // огонь привязан к тому же таймеру, второго таймера нет
  }

  function tick() {
    var now = performance.now();
    var dt = now - lastTick;
    lastTick = now;
    if (!state.running) return;
    state.remaining -= dt;
    state.elapsed += dt;
    if (state.remaining <= 0) {
      state.remaining = 0;
      state.running = false;
      renderTimer();
      openTimeout();
      return;
    }
    renderTimer();
  }

  function startTimer() {
    if (state.found.length >= ITEMS.length) return;
    lastTick = performance.now();
    state.running = true;
    if (!tickId) tickId = setInterval(tick, 100);
    renderTimer();
  }
  function pauseTimer() {
    if (state.running) { tick(); }
    state.running = false;
    renderTimer();
  }

  document.addEventListener('visibilitychange', function () {
    if (state.screen !== 'game' || state.modalOpen || state.timeoutOpen || state.winPending) return;
    if (document.hidden) pauseTimer(); else if (state.remaining > 0) startTimer();
  });

  /* ---------------------------------------------------------
     ПЕРЕХОДЫ МЕЖДУ ЭКРАНАМИ
     --------------------------------------------------------- */
  var transitioning = false;
  function showScreen(name) {
    Object.keys(dom.screens).forEach(function (k) { dom.screens[k].classList.toggle('is-active', k === name); });
    state.screen = name;
    window.scrollTo(0, 0);
  }
  function go(name, after) {
    if (transitioning) return;
    if (reduceMotion) { showScreen(name); if (after) after(); return; }
    transitioning = true;
    var strips = $$('i', dom.wipe);
    strips.forEach(function (s, i) { s.style.setProperty('--i', i); });
    dom.wipe.className = 'wipe is-in';
    setTimeout(function () {
      showScreen(name);
      dom.wipe.className = 'wipe is-out';
      setTimeout(function () {
        dom.wipe.className = 'wipe';
        transitioning = false;
        if (after) after();
      }, 340 + strips.length * 40);
    }, 340 + strips.length * 40);
  }

  /* ---------------------------------------------------------
     ИГРОВОЙ ПРОЦЕСС
     --------------------------------------------------------- */
  function resetGame() {
    state.found = [];
    state.remaining = GAME_SECONDS * 1000;
    state.barMax = GAME_SECONDS * 1000;
    state.elapsed = 0;
    state.misses = 0;
    state.running = false;
    state.winPending = false;
    dom.restartConfirm.hidden = true;
    renderState();
    renderTimer();
  }

  function startGame() {
    resetGame();
    go('game', function () {
      startTimer();
      scratchSoon();
      var first = $('.stage-scroller');
      if (first) { /* фокус не крадем: пользователь сам тянется к сцене */ }
    });
  }

  function onItemClick(id, opener) {
    if (state.screen !== 'game' || state.modalOpen || state.timeoutOpen) return;
    var already = state.found.indexOf(id) !== -1;
    if (!already) {
      state.found.push(id);       // повторно предмет не засчитывается
      renderState(id);
      if (state.found.length === ITEMS.length) state.winPending = true;
    }
    openModal(id, opener);
  }

  /* промах по сцене */
  dom.stage.addEventListener('click', function (e) {
    if (state.screen !== 'game' || state.modalOpen || state.timeoutOpen || !state.running) return;
    if (e.target.closest && e.target.closest('.hotspot')) return;
    var r = dom.stage.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100;
    state.misses++;
    var m = el('span', 'miss');
    m.textContent = MISS_WORDS[Math.floor(Math.random() * MISS_WORDS.length)];
    m.style.left = x + '%'; m.style.top = y + '%';
    dom.misses.appendChild(m);
    while (dom.misses.children.length > 6) dom.misses.removeChild(dom.misses.firstChild);
    setTimeout(function () { if (m.parentNode) m.parentNode.removeChild(m); }, 950);
  });

  /* ---------------------------------------------------------
     МОДАЛЬНОЕ ОКНО ПРЕДМЕТА
     --------------------------------------------------------- */
  var focusableSel = 'button:not([disabled]):not([hidden]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function openModal(id, opener) {
    var it = byId(id);
    if (!it) return;
    pauseTimer();
    state.modalOpen = true;
    state.openedId = id;
    state.lastFocus = opener || document.activeElement;

    dom.modalCard.className = 'modal-card ' + it.theme;
    $('#modal-app').textContent = APPS[id] + ' (концепт)';
    dom.modalChip.textContent = 'Концепт · ' + it.partner;
    dom.modalProgress.textContent = 'Найдено ' + state.found.length + ' из ' + ITEMS.length;
    dom.modalImg.src = it.thumb || it.src;
    dom.modalQuote.innerHTML = '';
    var qh = el('span', 'qh'); var qt = el('span');
    qt.textContent = 'Квак: ' + it.quote;
    dom.modalQuote.appendChild(qh); dom.modalQuote.appendChild(qt);
    dom.modalTitle.textContent = it.title;
    dom.modalText.textContent = it.text;
    dom.rewardLabel.textContent = it.rewardLabel;
    dom.rewardReveal.hidden = true;
    dom.rewardCode.hidden = !it.code;
    dom.rewardCodeText.textContent = it.code || '';
    dom.rewardDetail.textContent = it.detail;
    dom.modalCta.textContent = it.cta;
    dom.modalCta.setAttribute('aria-expanded', 'false');
    dom.modalCta.setAttribute('aria-controls', 'reward-reveal');
    dom.btnCopy.textContent = 'Скопировать';
    dom.modalBack.textContent = state.winPending ? 'К финалу →' : 'Вернуться к поиску';

    dom.modal.classList.remove('is-closing');
    dom.modal.hidden = false;
    dom.app.inert = true;
    dom.modalCard.scrollTop = 0;
    dom.modalCard.focus({ preventScroll: true });
  }

  function closeModal() {
    if (!state.modalOpen) return;
    var finish = function () {
      dom.modal.hidden = true;
      dom.modal.classList.remove('is-closing');
      dom.app.inert = false;
      state.modalOpen = false;
      if (state.winPending) { win(); return; }
      var f = state.lastFocus;
      if (f && document.contains(f) && !f.hidden) { try { f.focus({ preventScroll: true }); } catch (e) { } }
      if (state.remaining > 0) startTimer();
    };
    if (reduceMotion) { finish(); return; }
    dom.modal.classList.add('is-closing');
    setTimeout(finish, 220);
  }

  dom.modalX.addEventListener('click', closeModal);
  dom.modalBack.addEventListener('click', closeModal);
  $('.modal-backdrop', dom.modal).addEventListener('click', closeModal);

  dom.modalCta.addEventListener('click', function () {
    dom.rewardReveal.hidden = false;
    dom.modalCta.setAttribute('aria-expanded', 'true');
  });

  dom.btnCopy.addEventListener('click', function () {
    var text = dom.rewardCodeText.textContent;
    var done = function () { dom.btnCopy.textContent = 'Скопировано ✓'; setTimeout(function () { dom.btnCopy.textContent = 'Скопировать'; }, 1600); };
    var fallback = function () {
      var ta = el('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { dom.btnCopy.textContent = 'Выдели и скопируй'; }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  });

  /* ---------------------------------------------------------
     ВРЕМЯ ВЫШЛО
     --------------------------------------------------------- */
  function openTimeout() {
    state.timeoutOpen = true;
    state.lastFocus = document.activeElement;
    dom.timeoutFound.textContent = state.found.length;
    dom.timeout.hidden = false;
    dom.app.inert = true;
    dom.timeoutCard.focus({ preventScroll: true });
  }
  function closeTimeout() {
    dom.timeout.hidden = true;
    dom.app.inert = false;
    state.timeoutOpen = false;
  }
  $('#btn-more-time').addEventListener('click', function () {
    closeTimeout();
    state.remaining = EXTRA_SECONDS * 1000;
    state.barMax = EXTRA_SECONDS * 1000;   // найденное не трогаем
    startTimer();
    var f = state.lastFocus;
    if (f && document.contains(f)) { try { f.focus({ preventScroll: true }); } catch (e) { } }
  });
  $('#btn-timeout-restart').addEventListener('click', function () {
    closeTimeout();
    resetGame();
    startTimer();
  });

  /* ---------------------------------------------------------
     ПЕРЕЗАПУСК С ПОДТВЕРЖДЕНИЕМ (не стираем прогресс молча)
     --------------------------------------------------------- */
  dom.btnRestart.addEventListener('click', function () {
    if (state.found.length === 0) { resetGame(); startTimer(); return; }
    dom.restartConfirm.hidden = false;
    $('#btn-restart-no').focus();
  });
  $('#btn-restart-no').addEventListener('click', function () { dom.restartConfirm.hidden = true; dom.btnRestart.focus(); });
  $('#btn-restart-yes').addEventListener('click', function () { resetGame(); startTimer(); dom.btnRestart.focus(); });

  /* ---------------------------------------------------------
     ФИНАЛ
     --------------------------------------------------------- */
  function bestKey() { return 'kvak.best.v1'; }
  function readBest() { try { var v = parseInt(localStorage.getItem(bestKey()), 10); return isNaN(v) ? null : v; } catch (e) { return null; } }
  function writeBest(v) { try { localStorage.setItem(bestKey(), String(v)); } catch (e) { } }

  function win() {
    pauseTimer();
    state.winPending = false;
    var sec = Math.max(1, Math.round(state.elapsed / 1000));
    $('#res-time').textContent = sec + ' сек';
    $('#res-miss').textContent = state.misses;
    $('#res-rank').textContent = sec < 25 ? 'Легенда опен-спейса' : (sec < 45 ? 'Старший спасатель' : 'Выжил чудом');
    var best = readBest(), bestEl = $('#res-best');
    if (best === null || sec < best) {
      writeBest(sec);
      bestEl.hidden = best === null;
      if (best !== null) { bestEl.textContent = 'Новый личный рекорд: ' + sec + ' сек (было ' + best + ').'; bestEl.hidden = false; }
    } else { bestEl.textContent = 'Твой лучший результат: ' + best + ' сек.'; bestEl.hidden = false; }
    go('final', function () { confetti(); var t = $('#final-title'); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); } });
  }

  function confetti() {
    if (reduceMotion) return;
    var box = $('#confetti'); box.innerHTML = '';
    var colors = ['#D9FF43', '#F28B32', '#8AABBE', '#FFFFFF', '#20272B'];
    for (var i = 0; i < 46; i++) {
      var s = el('span');
      var w = 8 + Math.random() * 12;
      s.style.left = (Math.random() * 100) + '%';
      s.style.width = w + 'px'; s.style.height = (w * (0.5 + Math.random() * 0.9)) + 'px';
      s.style.background = colors[i % colors.length];
      s.style.animationDuration = (3.2 + Math.random() * 3.2) + 's';
      s.style.animationDelay = (Math.random() * 1.6) + 's';
      s.style.setProperty('--spin', (360 + Math.random() * 720) + 'deg');
      box.appendChild(s);
    }
    setTimeout(function () { box.innerHTML = ''; }, 9000);
  }

  /* ---------------------------------------------------------
     КНОПКИ ЭКРАНОВ
     --------------------------------------------------------- */
  $('#btn-start').addEventListener('click', startGame);
  $('#btn-again').addEventListener('click', startGame);
  $('#btn-home').addEventListener('click', function () { resetGame(); go('cover'); });

  /* ---------------------------------------------------------
     КЛАВИАТУРА: Esc закрывает окно, Tab не уходит за его пределы
     --------------------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    var openCard = state.timeoutOpen ? dom.timeoutCard : (state.modalOpen ? dom.modalCard : null);
    if (!openCard) return;
    if (e.key === 'Escape' && state.modalOpen) { e.preventDefault(); closeModal(); return; }
    if (e.key !== 'Tab') return;
    var f = $$(focusableSel, openCard).filter(function (n) { return n.offsetParent !== null; });
    if (!f.length) { e.preventDefault(); openCard.focus(); return; }
    var first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (e.shiftKey && (a === first || a === openCard)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
    else if (!openCard.contains(a)) { e.preventDefault(); first.focus(); }
  });

  /* ---------------------------------------------------------
     ЖИВОЙ МИР: огонь, моргание, почесывание ногой
     --------------------------------------------------------- */
  /* false — когда scene.png переэкспортирована БЕЗ слоя «НОГИ»:
     тогда обе ноги рисуются из PSD (assets/legs/), заплатка не нужна */
  var LEGS_IN_SCENE = true;
  if (!LEGS_IN_SCENE) dom.stage.classList.add('no-baked-legs');

  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* 1. Огонь: у каждого языка свои период, амплитуда, наклон и дрейф */
  function initFlames() {
    $$('.fire').forEach(function (f) {
      f.classList.add('flame');
      f.style.setProperty('--d1', rnd(1.2, 2.4).toFixed(2) + 's');
      f.style.setProperty('--d2', rnd(2.2, 4.2).toFixed(2) + 's');
      f.style.setProperty('--a', rnd(0.03, 0.075).toFixed(3));
      f.style.setProperty('--r', rnd(1, 2.6).toFixed(2) + 'deg');
      f.style.setProperty('--dx', rnd(0.3, 1).toFixed(2) + '%');
      f.style.animationDelay = (-rnd(0, 3)).toFixed(2) + 's,' + (-rnd(0, 4)).toFixed(2) + 's';
    });
  }

  /* Усиление пожара — от игрового времени (state.elapsed), без собственного таймера.
     0…0.3 — несколько языков, 0.3…0.7 — больше и крупнее, 0.7…1 — новые языки и яркость.
     «+30 секунд» не уменьшает огонь: elapsed только растет, пока игра идет. */
  var fireBox = $('#stage-fire'), heatLevel = -1;
  function updateFire() {
    if (!fireBox) return;
    var h = Math.min(1, state.elapsed / (GAME_SECONDS * 1000));
    if (Math.abs(h - heatLevel) < 0.004 && heatLevel !== -1) return;
    heatLevel = h;
    fireBox.style.setProperty('--heat', h.toFixed(3));
    $('.stage-heat').style.setProperty('--heat', h.toFixed(3));
    $$('.fire[data-min]', fireBox).forEach(function (f) { f.classList.toggle('is-on', h >= parseFloat(f.getAttribute('data-min'))); });
  }

  /* 2. Моргание: короткое, с нерегулярными интервалами, иногда двойное */
  function blinkOnce(done) {
    var eyes = $$('.frog-eyes');
    eyes.forEach(function (e) { e.classList.add('is-closed'); });
    setTimeout(function () { eyes.forEach(function (e) { e.classList.remove('is-closed'); }); if (done) done(); }, rnd(110, 170));
  }
  function scheduleBlink() {
    setTimeout(function () {
      if (!document.hidden && (state.screen === 'cover' || state.screen === 'final')) {
        blinkOnce(function () { if (Math.random() < 0.22) setTimeout(blinkOnce, rnd(120, 220)); });
      }
      scheduleBlink();
    }, rnd(2200, 6500));
  }

  /* 3. Нога чешет ногу: ~3,2 с, затем пауза 10–20 с */
  var SCRATCH_MS = 2800, foot = $('#leg-rig');
  function scratchNow() {
    if (!foot || reduceMotion || document.hidden || state.screen !== 'game' || foot.classList.contains('is-scratching')) return;
    void foot.offsetWidth; foot.classList.add('is-scratching');
  }
  function scratchSoon() { setTimeout(scratchNow, rnd(3000, 5000)); }
  function scheduleScratch() {
    setTimeout(function () { scratchNow(); scheduleScratch(); }, SCRATCH_MS + rnd(10000, 20000));
  }
  if (foot) foot.addEventListener('animationend', function () { foot.classList.remove('is-scratching'); });

  /* 2b. Обложка: Квак выглядывает из-за объявления, моргает и ныряет обратно (CSS-класс .is-up на #peek) */
  var peek = $('#peek');
  function peekLoop(delay) {
    setTimeout(function () {
      if (document.hidden || state.screen !== 'cover') { peekLoop(1200); return; }
      peek.classList.add('is-up');
      var stay = rnd(3400, 5000);
      setTimeout(blinkOnce, rnd(1100, 1600));
      setTimeout(function () { blinkOnce(function () { if (Math.random() < 0.5) setTimeout(blinkOnce, rnd(140, 220)); }); }, stay * 0.66);
      setTimeout(function () { peek.classList.remove('is-up'); }, stay);
      peekLoop(stay + rnd(2600, 4200));
    }, delay);
  }
  if (peek) { if (reduceMotion) peek.classList.add('is-up'); else peekLoop(1300); }

  initFlames();
  scheduleBlink();
  scheduleScratch();

  /* ---------------------------------------------------------
     СТАРТ
     --------------------------------------------------------- */
  buildScene();
  buildList();
  renderState();
  renderTimer();

  /* для отладки и автотестов */
  window.KVAK = { state: state, ITEMS: ITEMS };
})();
