/* ==========================================================
   LEYLA OS — PROJECTS (single source of truth)
   Used by: the PROJECTS.DIR window on the desktop (app.js)
            and the case pages work/<slug>.html (tools/build.mjs).

   After editing this file run:   node tools/build.mjs
   (re-generates work/*.html; the desktop picks changes up by itself)

   Fields
   slug      : URL name → work/<slug>.html  (never change it once shared)
   num, file : archive number and the "file name" shown in the OS
   hidden    : true — not published at all (no archive card, no case page). Delete the line to bring it back.
   shelf     : 'main' (default) — PROJECTS.DIR; 'other' — the separate folder ДРУГИЕ_РАБОТЫ.DIR
               (sites and UI work that is not part of the special-projects portfolio)
   type      : 'special' | 'client' | 'personal' | 'concept'
   stage     : { key, label } — key: 'done' | 'live' | 'wip' | 'prototype' | 'moodboard' | 'draft'
               null = not specified yet (nothing is shown)
   layout    : case-page composition: 'game' | 'cinema' | 'campaign' | 'product' | 'editorial' | 'moodboard' | 'before-after'
   sections  : optional custom story instead of the default UX sections (used for ad campaigns):
               [{ id, title, text: [...], palette?, media?, gallery?, note? }]
   hero      : banners shown at the top of a 'campaign' case [{ src, alt, format: 'feed' | 'stories' }]
   preview   : archive preview
               { kind: 'image', src, alt, clip?, ratio }       clip = short muted mp4 played on hover
               { kind: 'specimen', bg, ink, accent, lines: [{ text, family, size }] }  — built from the
                 project's real design system (fonts / colours), clearly labelled as such
               { kind: 'palette', colors: [...] }               — moodboard colours
               { kind: 'missing', label }                       — clearly marked placeholder
   links     : { live, play, behance, repo } — only confirmed URLs. Empty = hidden.
   media     : [{ kind: 'video', src, poster, caption, ratio }] / [{ kind: 'image', src, alt, caption, device, span }]
               device: 'desktop' | 'tablet' | 'mobile' | 'wide'; span: columns of 12 in the gallery (optional)
   missing   : assets still needed → shown as "ФАЙЛ НЕ НАЙДЕН" placeholders on the case page.
               The build checks the disk: once the file exists, the placeholder disappears.
               (Any media/preview path that does not exist is also shown as a placeholder.)
   todo      : text that still has to be written by Leyla → shown as draft notes on the case page
   All paths are relative to the site root.
   ========================================================== */
window.LEYLA_PROJECTS = [
  {
    slug: 'orchestra-1703',
    num: '001',
    file: 'QUIZ1703.EXE',
    title: 'Orchestra 1703: кто ты из мира музыки?',
    tagline: 'Интерактивный тест на заказ Orchestra 1703: знакомит с оркестром и приводит зрителей на концерты',
    type: 'special',
    stage: { key: 'done', label: 'Завершен · по заказу оркестра' },
    role: 'Дизайн, UX и фронтенд',
    tools: ['HTML', 'CSS', 'JavaScript', 'React'],
    summary: 'Тест по заказу оркестра, который привлекает зрителей на концерты. 7 вопросов о бытовых ситуациях — и композитор-архетип в финале. По пути — музыкальные паузы с треками «по настроению», в конце — осенняя рекомендация и путь к афише оркестра.',
    layout: 'game',
    accent: '#EC635D',
    preview: { kind: 'image', src: 'assets/projects/orchestra-1703/desktop-start.webp', alt: 'Стартовый экран теста «Кто ты из мира музыки?»: коллаж с дирижером, нотами и заголовком', clip: 'assets/projects/orchestra-1703/quiz-preview.mp4', ratio: '1600 / 1000' },
    links: { live: '', play: 'play/orchestra-1703/index.html', behance: '', repo: '' },
    context: [
      'Orchestra 1703 — оркестр из Санкт-Петербурга, художественный руководитель — Георгий Федоров. Тест «Кто ты из мира музыки?» сделан по заказу оркестра.',
      'Задача проекта — представить оркестр и привлечь зрителей: чтобы человек послушал произведения и пошел на концерт. Тест работает как воронка: игра → музыка → афиша.',
    ],
    challenge: [
      'Классику обычно подают как список фактов из истории музыки. Нужно было, чтобы человек без музыкального образования прошел тест до конца, улыбнулся, послушал музыку прямо по ходу — и в конце захотел услышать ее вживую на концерте Orchestra 1703.',
    ],
    concept: [
      'Вместо теории — характер: вопросы про сорванные планы, дедлайны, вечеринки и чемодан перед поездкой, а в итоге — композитор-архетип. Тон задан с первого экрана: «Никаких сольфеджио, теории и прочей нуди», а в финале — «Игровой тест, а не диагноз от психотерапевта».',
      'Визуальный язык — редакционная типографика и коллаж: вырезанные портреты композиторов, ноты, винил, кассеты и рваная бумага, жирные обводки и графичные тени. Теплая палитра — глубокий зеленый, коралловый, горчичный и крем. Движение подкрепляет происходящее: экраны въезжают, ответы появляются по очереди, между вопросами проносятся ноты.',
    ],
    palette: [
      { name: 'Глубокий зеленый', hex: '#1D3028', role: 'текст, обводки, тени' },
      { name: 'Коралловый', hex: '#EC635D', role: 'действия, выбранный ответ' },
      { name: 'Горчичный', hex: '#F4BE68', role: 'плашки, акценты' },
      { name: 'Крем', hex: '#EFE8E1', role: 'фон' },
      { name: 'Бумага', hex: '#E2D6C8', role: 'карточки, коллаж' },
    ],
    fonts: [
      { name: 'Despair Display', role: 'заголовки', family: 'OrchDisplay' },
      { name: 'Steppe', role: 'текст и интерфейс', family: 'OrchText' },
      { name: 'Druzhok', role: 'декоративные надписи', family: 'OrchDeco' },
    ],
    ux: [
      { title: 'Ситуации, а не теория', text: 'Каждый вопрос — узнаваемая жизненная ситуация с четырьмя ответами-характерами. Знать музыку не нужно, чтобы пройти тест.' },
      { title: 'Прогресс на виду', text: 'Шкала «Вопрос N / 7», кнопки «Назад» и «В начало»: всегда понятно, сколько осталось, и можно передумать.' },
      { title: 'Музыкальная пауза', text: 'После ответа появляется плашка с произведением «по настроению» и кнопкой «Послушать трек» — человек знакомится с музыкой уже во время теста, а не только в финале.' },
      { title: 'Результат-постер', text: 'Финал — иллюстрированный постер архетипа, эпитет, «бытовая деталь» и осенняя рекомендация: одно произведение, которое стоит послушать сейчас.' },
      { title: 'Из теста — на концерт', text: 'Последний блок результата — «Хочешь услышать музыку вживую?» со ссылками на оркестр и его афишу. Тест заканчивается не баллами, а приглашением на концерт.' },
      { title: 'Для всех', text: 'Ответы — нативные радиокнопки, фокус переходит на заголовок результата, анимации учитывают настройку «уменьшить движение», раскладка собрана отдельно под телефон.' },
    ],
    implementation: [
      'React 18 без сборщика: компоненты описаны через createElement, данные теста (вопросы, архетипы, треки) вынесены в отдельный объект.',
      'Сцены композиторов собраны из слоев WebP — портрет, фон и детали анимируются по отдельности.',
      'Переходы между экранами и появление ответов — CSS-анимации; при prefers-reduced-motion они отключаются.',
    ],
    media: [
      { kind: 'video', src: 'assets/projects/orchestra-1703/quiz-walkthrough.mp4', poster: 'assets/projects/orchestra-1703/quiz-poster.jpg', caption: 'Прохождение теста целиком: вопросы, музыкальные паузы, переходы и результат', ratio: '1280 / 800' },
      { kind: 'image', src: 'assets/projects/orchestra-1703/desktop-start.webp', alt: 'Стартовый экран теста на десктопе', caption: 'Старт', device: 'desktop', span: 12 },
      { kind: 'image', src: 'assets/projects/orchestra-1703/desktop-question.webp', alt: 'Экран вопроса с выбранным ответом и музыкальной паузой', caption: 'Вопрос + музыкальная пауза', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/orchestra-1703/desktop-result.webp', alt: 'Экран результата: постер архетипа Бетховен', caption: 'Результат-постер', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/orchestra-1703/mobile-start.webp', alt: 'Стартовый экран на телефоне', caption: 'Телефон: старт', device: 'mobile', span: 4 },
      { kind: 'image', src: 'assets/projects/orchestra-1703/mobile-question.webp', alt: 'Вопрос и музыкальная пауза на телефоне', caption: 'Телефон: музыкальная пауза', device: 'mobile', span: 4 },
      { kind: 'image', src: 'assets/projects/orchestra-1703/mobile-result.webp', alt: 'Результат на телефоне', caption: 'Телефон: результат', device: 'mobile', span: 4 },
    ],
    missing: [],
    todo: [],
  },

  {
    slug: 'kladovka',
    num: '002',
    file: 'KLADOVKA.PDF',
    title: 'Кладовка. Too many tabs',
    tagline: 'Концепт рекламной кампании и презентации для инвесторов приложения для мыслей и задач',
    type: 'concept',
    stage: { key: 'done', label: 'Завершен' },
    role: 'Идея, арт-дирекшн, баннеры, пре-ролл, презентация',
    tools: ['Figma', 'Photoshop', 'After Effects', 'Нейросети для 3D-объектов'],
    summary: '«Утюг выключен. Наверное.» Мысли становятся огромными пластилиновыми предметами и вытесняют человека из его собственной жизни. Баннеры для ленты и сторис, пре-ролл и питч-дек, где тот же хаос разложен по полкам.',
    layout: 'campaign',
    accent: '#D15046',
    preview: { kind: 'image', src: 'assets/projects/kladovka/preview.webp', alt: 'Три баннера кампании «Кладовка»: кровать, заваленная делами, огромный утюг и крошечный человек', clip: 'assets/projects/kladovka/kladovka-clip-preview.mp4', ratio: '1600 / 1000' },
    links: { live: '', play: '', behance: '', repo: '', pdf: 'assets/projects/kladovka/kladovka-investor-deck.pdf', pdfLabel: 'Презентация, PDF' },
    hero: [
      { src: 'assets/projects/kladovka/feed-bed.webp', alt: 'Баннер для ленты: «Вспомнила в 3 ночи. Забыла в 3:01.»', format: 'feed' },
      { src: 'assets/projects/kladovka/stories-iron.webp', alt: 'Баннер для сторис: «Утюг выключен. Наверное.»', format: 'stories' },
      { src: 'assets/projects/kladovka/feed-iron.webp', alt: 'Баннер для ленты: «Утюг выключен. Наверное.»', format: 'feed' },
    ],
    sections: [
      { id: 'task', title: 'Задача', text: ['Придумать запуск приложения, которое помогает выгружать из головы мысли, задачи и напоминания. Сделать рекламную кампанию для соцсетей и презентацию для инвесторов.'] },
      { id: 'insight', title: 'Инсайт', text: ['Невыполненные дела не исчезают. Они занимают место в голове, как вещи, которые некуда убрать: утюг, молоко, запись к стоматологу.', 'В среднем человек держит внимание на одном экране 47 секунд. В голове у него примерно столько же открытых вкладок.'] },
      { id: 'idea', title: 'Идея', text: ['Мысли становятся физическими предметами и вытесняют человека из его собственной жизни. Огромный утюг, кровать, заваленная делами. Кладовка — место, куда все это можно убрать.'] },
      {
        id: 'system', title: 'Система', text: ['Мягкий пластилиновый 3D, теплая палитра, широкий гротеск. Формула заголовка: ситуация, которую узнает каждый, и шутка коралловым.'],
        palette: [
          { name: 'Небо', hex: '#ABDEEC', role: 'фон дневных сюжетов' },
          { name: 'Ночь', hex: '#111A4E', role: 'ночной сюжет, заголовки' },
          { name: 'Коралловый', hex: '#D15046', role: 'шутка в заголовке, кнопка' },
          { name: 'Апельсин', hex: '#E89C52', role: 'предметы' },
          { name: 'Бирюза', hex: '#2093AE', role: 'иконка бренда' },
          { name: 'Крем', hex: '#FCF6E3', role: 'фон презентации' },
        ]
      },
      {
        id: 'banners', title: 'Баннеры', text: ['Два сюжета для ленты и сторис. Одна система: заголовок, огромная мысль, крошечный человек и плашка с брендом.'], gallery: 'banners',
        media: [
          { src: 'assets/projects/kladovka/stories-iron.webp', alt: 'Сторис 9:16: «Утюг выключен. Наверное.»', caption: 'Сторис 9:16', device: 'banner', span: 4 },
          { src: 'assets/projects/kladovka/feed-iron.webp', alt: 'Лента 4:5: «Утюг выключен. Наверное.»', caption: 'Лента 4:5', device: 'banner', span: 4 },
          { src: 'assets/projects/kladovka/feed-bed.webp', alt: 'Лента 4:5: «Вспомнила в 3 ночи. Забыла в 3:01.»', caption: 'Лента 4:5', device: 'banner', span: 4 },
        ]
      },
      {
        id: 'deck', title: 'Презентация', text: ['Для инвесторов — те же предметы, но разложенные по полкам. В рекламе мысли — хаос, в презентации — порядок.'], gallery: 'slides',
        media: [1, 2, 3, 4, 5, 6, 7].map(i => ({ src: `assets/projects/kladovka/slide-${i}.webp`, alt: `Слайд ${i} презентации для инвесторов`, caption: `Слайд ${i} / 7`, device: 'slide' })),
        note: 'Целиком презентация — в PDF, кнопка вверху страницы.'
      },
      {
        id: 'clip', title: 'Пре-ролл', text: ['6 секунд перед видео: тот же сюжет с утюгом — заголовок, шутка коралловым и в конце логотип с кнопкой «Скачать». Анимация в After Effects.'], gallery: 'clip',
        media: [{ kind: 'video', src: 'assets/projects/kladovka/kladovka-clip.mp4', poster: 'assets/projects/kladovka/kladovka-clip-poster.jpg', caption: 'Пре-ролл 16:9, 6 сек · After Effects · со звуком — включи в плеере', ratio: '16 / 9' }]
      },
    ],
    context: [], challenge: [], concept: [], palette: [], fonts: [], ux: [], implementation: [], media: [], missing: [], todo: [],
  },

  {
    slug: 'kvak',
    num: '003',
    file: 'KVAK.EXE',
    title: 'Квак, где мои вещи?!',
    tagline: 'Браузерная hidden-object игра с концептом рекламных интеграций брендов',
    type: 'concept',
    stage: { key: 'done', label: 'Завершен · играбельная версия' },
    role: 'Концепция, иллюстрации, моушн, арт-дирекшн, UX/UI',
    tools: ['Illustrator', 'After Effects', 'Нейросети', 'HTML', 'CSS', 'JavaScript'],
    summary: 'Спецпроект в формате мини-игры: на рабочем месте Квака пропали 5 вещей, найти их нужно за 60 секунд, пока офис не сгорел. Каждая находка — концепт интеграции бренда: билет в кино ведет к Кинопоиску, авиабилет — к Aviasales.',
    layout: 'game',
    accent: '#D9FF43',
    preview: { kind: 'image', src: 'assets/projects/kvak/cover-desktop.webp', alt: 'Обложка игры: объявление «Квак, где мои вещи?!» над рабочим столом в горящем офисе', clip: 'assets/projects/kvak/kvak-scene-preview.mp4', ratio: '1440 / 860' },
    links: { live: '', play: 'play/kvak/index.html', behance: '', repo: '' },
    context: [
      'Концептуальный интерактивный спецпроект для портфолио. Формат — hidden object: игрок ищет предметы на одной насыщенной сцене.',
      'Аудитория — уставшие от офиса клерки, поэтому тон сознательно безумный: жабы за компьютерами, стикеры «КВА!» и офис, который горит в реальном времени.',
      'Игра задумана как рекламный формат: пять предметов — пять возможных партнеров (Aviasales, Кинопоиск, Т-Банк, «Вкусно — и точка», «Ясно»). Бренды в проекте не участвуют, все промокоды и награды демонстрационные — это прямо написано в игре.',
    ],
    challenge: [
      'Игра должна объяснять себя за секунды: правила умещаются в одну фразу на обложке, а срочность считывается без инструкций.',
    ],
    concept: [
      'Обложка оформлена как объявление «Срочное дело № 005»: название, статус «горит», срок поиска и число пропавших вещей — вся вводная на одном листке со скотчем.',
      'Квак выглядывает из-за объявления, моргает и прячется, а под столом почесывает лапой — персонаж живет, пока игрок читает правила.',
      'Иллюстрации — связка нейросетей и ручной доработки. Растровую основу генерировала в Gemini, векторные предметы — через Text to Vector в Illustrator, а потом дорабатывала вручную: правила контуры и формы, перекрашивала в палитру игры.',
    ],
    palette: [
      { name: 'Бумага', hex: '#F5F1E8', role: 'фон' },
      { name: 'Графит', hex: '#20272B', role: 'текст, обводки' },
      { name: 'Лайм', hex: '#D9FF43', role: 'действия и прогресс' },
      { name: 'Оранжевый', hex: '#F28B32', role: 'огонь и срочность' },
      { name: 'Сталь', hex: '#8AABBE', role: 'второстепенный' },
      { name: 'Белый', hex: '#FFFFFF', role: 'карточки' },
    ],
    fonts: [
      { name: 'Sochinyala', role: 'заголовки', family: 'KvakDisplay' },
      { name: 'Onest', role: 'текст, интерфейс и все цифры', family: 'KvakBody' },
      { name: 'IBM Plex Mono', role: 'метки, чек, коды', family: 'KvakMono' },
    ],
    ux: [
      { title: 'Правила одной строкой', text: 'Вводная на обложке: «На рабочем месте пропали 5 вещей. Найди их, пока офис не сгорел» — и одна кнопка «Спасти рабочий день».' },
      { title: 'Цвет = смысл', text: 'Лайм только для действий и прогресса, оранжевый — только для огня и срочности. Этот код игрок усваивает за первые секунды.' },
      { title: 'Находка = интеграция', text: 'Каждый найденный предмет открывает карточку бренда в его стилистике: шутка про Квака, его реплика и условная награда — промокод, пробный период или бонус. Реклама встроена в сюжет, а не прерывает игру.' },
      { title: 'Список Квака', text: 'Справа — чек-лист с иконками предметов: найденное подсвечивается лаймом и зачеркивается, так что прогресс читается без счетчика.' },
      { title: 'Финал-сертификат', text: '«Квак выжил. Дедлайн тоже.» — сертификат с временем, числом находок и промахов: результатом хочется поделиться.' },
      { title: 'Огонь вместо таймера', text: 'Огонь растет по трем стадиям вместе с игровым временем и останавливается вместе с игрой — время видно периферийным зрением.' },
      { title: 'Отдельная композиция под каждый экран', text: 'У обложки свои раскладки для десктопа, планшета и телефона: объявление и кнопка всегда остаются в первом экране.' },
    ],
    implementation: [
      'Чистые HTML, CSS и JavaScript без сборщика — проект открывается двойным кликом по index.html.',
      'Движение сначала собрала в After Effects: огонь, моргание и почесывание лапой. По этому ролику с помощью нейросети перенесла анимацию в CSS, чтобы в игре не было тяжелого видео. Пауза между движениями случайная — 10–20 секунд.',
      'У каждого языка огня свой период, амплитуда и дрейф, поэтому пламя не выглядит зацикленным.',
      'Шрифты подключены локально, без внешних запросов; лучший результат сохраняется в localStorage.',
    ],
    media: [
      { kind: 'image', src: 'assets/projects/kvak/game-play.webp', alt: 'Игровой экран: сцена офиса с отмеченными находками и чек-лист «Список Квака»', caption: 'Поиск: найденные предметы отмечены на сцене и в списке', device: 'desktop', span: 12 },
      { kind: 'image', src: 'assets/projects/kvak/game-popup.webp', alt: 'Карточка найденного билета в кино: концепт интеграции Кинопоиска с условной наградой', caption: 'Находка → концепт интеграции бренда', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/kvak/game-final.webp', alt: 'Финальный экран «Квак выжил. Дедлайн тоже.» с сертификатом выжившего в дедлайне', caption: 'Финал: сертификат выжившего', device: 'desktop', span: 6 },
      { kind: 'video', src: 'assets/projects/kvak/kvak-scene.mp4', poster: 'assets/projects/kvak/kvak-scene-poster.jpg', caption: 'Ролик в After Effects: огонь и лапы Квака — по нему собрана анимация в игре', ratio: '1024 / 558' },
      { kind: 'image', src: 'assets/projects/kvak/cover-desktop.webp', alt: 'Обложка игры на десктопе', caption: 'Десктоп, 1440 px', device: 'desktop' },
      { kind: 'image', src: 'assets/projects/kvak/cover-tablet.webp', alt: 'Обложка игры на планшете', caption: 'Планшет, 900 px', device: 'tablet' },
      { kind: 'image', src: 'assets/projects/kvak/cover-mobile.webp', alt: 'Обложка игры на телефоне', caption: 'Телефон, 390 px', device: 'mobile' },
      { kind: 'image', src: 'assets/projects/kvak/share-1280x640.webp', alt: 'Широкая обложка игры 1280 на 640', caption: 'Обложка 1280 × 640', device: 'wide' },
    ],
    missing: [],
    todo: [],
  },

  {
    slug: 'pixel-train',
    num: '004',
    file: 'SOSED.EXE',
    title: 'Симулятор худшего соседа',
    tagline: 'Пиксельная драма в пригородной электричке — в духе игр нулевых для PlayStation',
    type: 'personal',
    stage: { key: 'done', label: 'Завершен' },
    role: 'Автор проекта: идея, визуальное направление, моушн в After Effects',
    tools: ['After Effects', 'React', 'Vite', 'Pixel art'],
    summary: '«Сохрани менталку. Не доводи Бабу Зину.» Бытовые ситуации постсоветской электрички, доведенные до абсурда: форточка, курица в фольге, громкие динамики — и шкалы менталки и ярости, которые решают, доедешь ли ты до конечной. Ролик поездки анимирован в After Effects.',
    layout: 'cinema',
    accent: '#C9A642',
    preview: { kind: 'image', src: 'assets/projects/pixel-train/title.webp', alt: 'Титульный экран: «FIGHT!» — Бабушка против Чуда в пустом вагоне электрички', clip: 'assets/projects/pixel-train/pixel-train-preview.mp4', ratio: '1535 / 942' },
    links: { live: '', play: 'https://doom-train-ps1.vercel.app/', behance: '', repo: '' },
    context: [
      'Личный игровой проект: моя идея и визуальное направление. «Электричка doomer-edition · 1982–∞» — пиксельная драма в пригородной электричке. «Все персонажи вымышлены, все ситуации подозрительно знакомы».',
    ],
    challenge: [
      'Превратить узнаваемую поездку на электричке в игру, где смешно с первого экрана, а каждая бытовая мелочь становится игровой механикой.',
    ],
    concept: [
      'Визуальное направление — пиксельная игра нулевых для PlayStation: пиксель-арт, шкалы, рамки, ачивки и титульный экран «FIGHT!», как в файтингах той эпохи.',
      'Юмор строится на гиперболизации бытовых ситуаций постсоветской электрички. Баба Зина — «владелица 4 сумок и форточки» — требует закрыть окно, сосед ест курицу в фольге, динамики орут, вагон душный. Игрок выбирает, как реагировать, и платит за это нервами.',
      'Интерфейс намеренно архаичный: никаких эмодзи, прыгающих иконок и других современных деталей.',
    ],
    palette: [],
    fonts: [],
    ux: [
      { title: 'Выбор с ценой', text: 'Каждый ответ в диалоге сразу показывает последствия: «Психика −15, Ярость −25». Решение — это компромисс, а не угадывание правильного варианта.' },
      { title: 'Шкалы вместо текста', text: 'Менталка и Уровень ярости, а рядом раздражение, шум и запах — состояние героя считывается одним взглядом.' },
      { title: 'Рюкзак выживания', text: 'Наушники с ANC, лапша «Дошик», бальзам «Звездочка», валерьянка — у каждого предмета свой эффект, а лог показывает, что именно изменилось.' },
      { title: 'Маршрут = сложность', text: 'Три маршрута: до ближайшей станции, через полобласти, до конечной. Чем длиннее дорога, тем быстрее падает менталка.' },
      { title: 'Два состояния персонажа', text: 'У персонажей есть обычное и злое состояние — злость Бабы Зины видно по портрету еще до того, как она заговорит.' },
      { title: 'Ачивки поездки', text: '«Первый шаг», «Дзен-мастер», «На грани», «Запасливый», «Выживший» — повод проехать маршрут еще раз и по-другому.' },
    ],
    implementation: [
      'Ролики поездки собраны и отрендерены в After Effects: интерьер вагона и пейзаж — отдельные слои, пейзаж прокручивается за окнами.',
      'Игра — React + Vite.',
      'Сцена собрана из слоев: неподвижный интерьер вагона и пейзаж за окнами, который прокручивается отдельно — ощущение поездки без анимации всей сцены.',
      'Переключатель звука в шапке, счетчик пройденных километров и время в кадре — как в игровом HUD.',
    ],
    media: [
      { kind: 'video', src: 'assets/projects/pixel-train/pixel-train.mp4', poster: 'assets/projects/pixel-train/pixel-train-poster.jpg', caption: 'Ролик в After Effects: интерьер неподвижен, пейзаж за окнами едет', ratio: '1280 / 714' },
      { kind: 'image', src: 'assets/projects/pixel-train/title.webp', alt: 'Титульный экран «Симулятор худшего соседа» в стиле файтинга: FIGHT!, Babushka против Chud', caption: 'Титульный экран', device: 'desktop', span: 12 },
      { kind: 'image', src: 'assets/projects/pixel-train/dialogue.webp', alt: 'Игровой экран: Баба Зина злится и требует закрыть форточку, варианты ответа с эффектами на психику и ярость', caption: 'Диалог: Баба Зина и выбор с ценой', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/pixel-train/inventory.webp', alt: 'Шкалы раздражения, шума и запаха, рюкзак с предметами и лог их использования', caption: 'Шкалы, рюкзак и лог', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/pixel-train/routes.webp', alt: 'Выбор маршрута: три поездки разной сложности и ачивки', caption: 'Выбор маршрута', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/pixel-train/final.webp', alt: 'Финал: «Конечная станция! Вы выжили!» с пройденным расстоянием и остатком менталки', caption: 'Финал и ачивки', device: 'desktop', span: 6 },
      { kind: 'video', src: 'assets/projects/pixel-train/doomtrain.mp4', poster: 'assets/projects/pixel-train/doomtrain-poster.jpg', caption: 'Ролик поездки, анимация в After Effects', ratio: '1376 / 746' },
    ],
    missing: [],
    todo: [],
  },

  {
    slug: 'paradai',
    hidden: true,
    num: '005',
    shelf: 'other',
    file: 'PARADAI.HTML',
    title: 'Paradai',
    tagline: 'Сайт крафтового шоколада bean-to-bar с Пхукета',
    type: 'client',
    stage: null,
    role: 'Дизайн + Framer-компоненты',
    tools: ['Framer', 'React', 'TypeScript', 'Framer Motion', 'Canvas'],
    summary: 'Кастомные код-компоненты на Framer для бренда крафтового шоколада: галерея товара, конструктор коробки конфет, выезжающая корзина и scroll-анимации истории бренда.',
    layout: 'product',
    accent: '#8A5A3C',
    preview: {
      kind: 'specimen', bg: '#F3EADB', ink: '#3A2A20', accent: '#8A5A3C',
      lines: [
        { text: 'Paradai', family: 'SpecGaramond', size: 2.6 },
        { text: 'BEAN-TO-BAR · PHUKET', family: 'SpecCourier', size: .8 },
      ],
      note: 'Дизайн-система проекта · скриншоты скоро',
    },
    links: { live: '', play: '', behance: '', repo: '' },
    context: [
      'Paradai — бренд крафтового шоколада с Пхукета (Таиланд), который делает шоколад по принципу bean-to-bar: от какао-боба до плитки.',
    ],
    challenge: [],
    concept: [
      'Теплая кремово-бежевая палитра, классический EB Garamond и машинописный Courier Prime — ремесленная, «рукодельная» эстетика, близкая к самому продукту.',
    ],
    palette: [],
    fonts: [
      { name: 'EB Garamond', role: 'заголовки и текст', family: 'SpecGaramond' },
      { name: 'Courier Prime', role: 'акценты, подписи', family: 'SpecCourier' },
    ],
    ux: [
      { title: 'Страница товара', text: 'Галерея с навигацией по превью и хлебные крошки — понятно, где ты в каталоге.' },
      { title: 'Конструктор коробки конфет', text: 'Покупатель собирает свою коробку бонбонов прямо в каталоге, а корзина выезжает сбоку и не уводит со страницы.' },
      { title: 'История через движение', text: 'Таймлайн Bean-to-Bar и раздел «Наша история» раскрываются scroll-анимациями с наклоном.' },
      { title: 'Бережная анимация', text: 'Анимации учитывают системную настройку «уменьшить движение» (useReducedMotion).' },
    ],
    implementation: [
      'Компоненты: страница товара, «Наша история», таймлайн Bean-to-Bar, магазин с конструктором коробки и корзиной, сетка коллекции.',
      'ScentVolatilityTimeline — визуализация раскрытия аромата на HTML5 Canvas.',
      'Найден Framer-специфичный баг: Framer передает цвета в rgba(), из-за чего createLinearGradient молча не работал. Решение — рисование через globalAlpha.',
    ],
    media: [],
    missing: [
      { what: 'Скриншоты главной, каталога и страницы товара (desktop + mobile)', file: 'assets/projects/paradai/*.webp' },
      { what: 'Короткое видео: сборка коробки конфет и корзина', file: 'assets/projects/paradai/box-builder.mp4' },
    ],
    todo: ['Цели клиента и задача проекта', 'Статус запуска и ссылка на живой сайт'],
  },

  {
    slug: 'artem-nazarov',
    hidden: true,
    num: '006',
    shelf: 'other',
    file: 'NAZAROV.HTML',
    title: 'Читает Артем Назаров',
    tagline: 'Сайт YouTube-проекта о чтении и аудиокнигах',
    type: 'client',
    stage: null,
    role: 'Дизайн + Framer-код',
    tools: ['Framer', 'React', 'TypeScript', 'YouTube Data API v3', 'SoundCloud'],
    summary: 'Сайт чтеца аудиокниг и канала @ArtNazarovBooks. Аудитория — русскоязычные слушатели 40+, поэтому главный принцип — привычность важнее трендов.',
    layout: 'editorial',
    accent: '#E7B7A6',
    preview: {
      kind: 'specimen', bg: '#2D2D2D', ink: '#F2ECE8', accent: '#E7B7A6',
      lines: [
        { text: 'Artem Nazarov Reads', family: 'SpecFraunces', size: 1.9 },
        { text: 'Читает Артем Назаров', family: 'SpecManrope', size: 1 },
        { text: '#2D2D2D · #343434 · #E7B7A6', family: 'SpecPlex', size: .72 },
      ],
      note: 'Дизайн-система проекта · скриншоты скоро',
    },
    links: { live: '', play: '', behance: '', repo: '' },
    context: [
      '«Читает Артем Назаров» (Artem Nazarov Reads) — YouTube-проект о чтении и аудиокнигах, канал @ArtNazarovBooks. Интерфейс сайта — на русском.',
      'Основная аудитория — русскоязычные люди примерно 40+, в большинстве живущие за пределами России. Они ценят ясность и знакомые паттерны больше, чем дизайн-тренды.',
    ],
    challenge: [
      'Сделать сайт современным, не делая его непривычным: без тяжелого моушна, WebGL и перехвата скролла.',
    ],
    concept: [
      'Принцип — «дизайн для привычки, а не для трендов». Современность передается типографикой, композицией и фотографией.',
      'Темная редакционная система: графитовые фоны, пыльная роза как единственный акцент, никаких теней и мягкое замедление easeOutExpo.',
    ],
    palette: [
      { name: 'Графит', hex: '#2D2D2D', role: 'фон' },
      { name: 'Темный графит', hex: '#343434', role: 'поверхности' },
      { name: 'Пыльная роза', hex: '#E7B7A6', role: 'акцент' },
    ],
    fonts: [
      { name: 'Fraunces', role: 'антиква', family: 'SpecFraunces' },
      { name: 'Manrope', role: 'гротеск', family: 'SpecManrope' },
      { name: 'IBM Plex Mono', role: 'моноширинный', family: 'SpecPlex' },
    ],
    ux: [
      { title: 'Свежие выпуски — сами', text: 'Блок LatestEpisodes подтягивает новые видео через YouTube Data API v3: сайт не устаревает без ручных правок.' },
      { title: 'Каталог с поиском', text: 'BooksCatalog — сетка книг с поиском и карточкой-оверлеем для каждой книги, со ссылками на платформы.' },
      { title: 'Слушать прямо на сайте', text: 'Аудиокниги из SoundCloud встроены в страницу — не нужно уходить на другую платформу.' },
      { title: 'Поддержать проект', text: 'Отдельные компоненты для подписки и донатов, способы оплаты раскрываются по клику.' },
    ],
    implementation: [
      'Framer code components на React и TypeScript: LatestEpisodes, BooksCatalog, SoundCloudAudiobooks, SubscribeLinks, SupportProject и другие.',
      'Ссылки на платформы и поля метаданных книги вынесены в property controls — каталог редактируется без кода.',
      'Адаптивные брейкпоинты — через scoped <style> внутри компонента.',
      'В режиме редактирования Framer компоненты не обращаются к API, чтобы не тратить квоту.',
    ],
    media: [],
    missing: [
      { what: 'Скриншоты главной, каталога книг и блока выпусков (desktop + mobile)', file: 'assets/projects/artem-nazarov/*.webp' },
    ],
    todo: ['Статус запуска и ссылка на живой сайт', 'Ссылка на кейс на Behance'],
  },

  {
    slug: 'club-puer',
    hidden: true,
    num: '007',
    shelf: 'other',
    file: 'CLUBPUER.FIG',
    title: 'Club Puer',
    tagline: 'Концепт редизайна украинского интернет-магазина пуэра',
    type: 'concept',
    stage: { key: 'draft', label: 'Черновик макета' },
    role: 'UX/UI-концепт',
    tools: ['Figma'],
    summary: 'Редизайн старого интернет-магазина чая: меньше баннеров и визуального шума, больше спокойствия — без потери важной информации.',
    layout: 'before-after',
    accent: '#B5452F',
    preview: { kind: 'missing', label: 'ДО / ПОСЛЕ' },
    links: { live: '', play: '', behance: '', repo: '' },
    context: [
      'Club Puer — украинский интернет-магазин пуэра. Концепт переосмысляет его старую витрину.',
    ],
    challenge: [
      'Убрать перегруженность баннерами и кричащими вкладками, сохранив всю информацию, нужную для выбора чая.',
    ],
    concept: [
      'Спокойствие в духе японского дзен: теплый беж, янтарный, терракота и красная печать-ханко.',
    ],
    palette: [],
    fonts: [],
    ux: [
      { title: 'Витрина', text: 'Сетка в 3–4 колонки, фотографии товаров на бежевом фоне.' },
      { title: 'Чай по настроению', text: 'Вкладки «Энергия», «Релакс», «Фокус» между шапкой и каталогом — вход для тех, кто не разбирается в сортах.' },
      { title: 'Мега-меню', text: 'По наведению: разбивка по видам чая и форме прессовки.' },
      { title: 'Подарочные наборы', text: 'Блок в стиле глянцевого журнала с крупной фотографией.' },
    ],
    implementation: [],
    beforeAfter: { before: 'assets/projects/club-puer/before.webp', after: 'assets/projects/club-puer/after.webp', caption: 'Главная страница: старая версия и концепт' },
    media: [],
    missing: [
      { what: 'Экраны каталога, мега-меню и блока подарочных наборов', file: 'assets/projects/club-puer/*.webp' },
    ],
    todo: [],
  },
];

window.LEYLA_TYPES = {
  special: { label: 'Спецпроект', short: 'Спецпроект' },
  client: { label: 'Клиентский проект', short: 'Клиент' },
  personal: { label: 'Личный проект', short: 'Личный' },
  concept: { label: 'Концепт', short: 'Концепт' },
};
