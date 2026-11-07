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
    stage: { key: 'done', label: 'По заказу оркестра' },
    role: 'Дизайн, UX и фронтенд',
    tools: ['HTML', 'CSS', 'JavaScript', 'React'],
    summary: 'Тест по заказу оркестра, который привлекает зрителей на концерты. 7 вопросов о бытовых ситуациях — и композитор-архетип в финале. По пути — музыкальные паузы с треками «по настроению», в конце — осенняя рекомендация и путь к афише оркестра.',
    layout: 'game',
    accent: '#EC635D',
    preview: { kind: 'image', src: 'assets/projects/orchestra-1703/desktop-start.webp', alt: 'Стартовый экран теста «Кто ты из мира музыки?»: коллаж с дирижёром, нотами и заголовком', clip: 'assets/projects/orchestra-1703/quiz-preview.mp4', ratio: '1600 / 1000' },
    links: { live: '', play: 'play/orchestra-1703/index.html', behance: '', repo: '' },
    context: [
      'Orchestra 1703 — оркестр из Санкт-Петербурга, художественный руководитель — Георгий Фёдоров. Тест «Кто ты из мира музыки?» сделан по заказу оркестра.',
      'Задача проекта — представить оркестр и привлечь зрителей: чтобы человек послушал произведения и пошёл на концерт. Тест работает как воронка: игра → музыка → афиша.',
    ],
    challenge: [
      'Классику обычно подают как список фактов из истории музыки. Нужно было, чтобы человек без музыкального образования прошёл тест до конца, улыбнулся, послушал музыку прямо по ходу — и в конце захотел услышать её вживую на концерте Orchestra 1703.',
    ],
    concept: [
      'Вместо теории — характер: вопросы про сорванные планы, дедлайны, вечеринки и чемодан перед поездкой, а в итоге — композитор-архетип. Тон задан с первого экрана: «Никаких сольфеджио, теории и прочей нуди», а в финале — «Игровой тест, а не диагноз от психотерапевта».',
      'Визуальный язык — редакционная типографика и коллаж: вырезанные портреты композиторов, ноты, винил, кассеты и рваная бумага, жирные обводки и графичные тени. Тёплая палитра — глубокий зелёный, коралловый, горчичный и крем. Движение подкрепляет происходящее: экраны въезжают, ответы появляются по очереди, между вопросами проносятся ноты.',
    ],
    palette: [
      { name: 'Глубокий зелёный', hex: '#1D3028', role: 'текст, обводки, тени' },
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
      'Сцены композиторов собраны из слоёв WebP — портрет, фон и детали анимируются по отдельности.',
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
    slug: 'orchestra-1703-site',
    num: '002',
    file: 'ORCH1703.HTML',
    title: 'Оркестр 1703: первый сайт',
    tagline: 'Первый собственный сайт оркестра: афиша, билеты и характер «самого дружелюбного оркестра»',
    type: 'client',
    stage: { key: 'live', label: 'Запущен' },
    role: 'Дизайн, UX, тексты интерфейса и вёрстка',
    tools: ['Figma', 'HTML', 'CSS', 'JavaScript'],
    summary: 'До сайта оркестр жил в соцсетях и Taplink. Теперь у него своя площадка: ближайший концерт на первом экране, афиша с фильтром по площадкам, страница каждого концерта и кнопка «Билеты» на расстоянии одного клика.',
    layout: 'product',
    accent: '#EC6762',
    preview: { kind: 'image', src: 'assets/projects/orchestra-site/hero.webp', alt: 'Главный экран сайта Оркестра 1703: «Самый дружелюбный оркестр» и карточка ближайшего концерта', clip: 'assets/projects/orchestra-site/hero-preview.mp4', ratio: '2048 / 1037' },
    links: { live: 'https://orchestra1703.com/', play: '', behance: '', repo: '' },
    context: [
      'Оркестр 1703 из Санкт-Петербурга, художественный руководитель — композитор Георгий Фёдоров. Это первый собственный сайт оркестра.',
      'Раньше вся информация жила в соцсетях, потом её собрали в Taplink. Но Taplink почти не работал: через него приходило около 5% переходов. Половина зрителей приходила из ВКонтакте, остальные — из Instagram, Google и сторонних афиш. Taplink — это список ссылок без визуала, без характера оркестра и без нормальной афиши, а чтобы купить билет, нужно было пролистать посты или перейти по нескольким ссылкам.',
      'Вывод: оркестру нужна своя площадка, куда можно вести людей из всех каналов сразу, — с афишей и покупкой билета в один-два клика.',
    ],
    challenge: [
      'Собрать афишу, информацию об оркестре и покупку билетов в одном месте так, чтобы до билета был один-два клика, и при этом передать характер оркестра: классика с юмором и «бескомпромиссной подачей».',
    ],
    concept: [
      'Голос бренда — «Самый дружелюбный оркестр». Он звучит везде: от первого экрана до контактов «Давайте дружить» и «Есть вопрос или идея?».',
      'Визуальный язык — афишная ретро-типографика: широкий гротеск, жирные обводки, смещённые тени, полутоновый растр и звезда-штамп. Та же палитра, что у теста «Кто ты из мира музыки?», поэтому сайт и спецпроект выглядят как одна семья.',
    ],
    palette: [
      { name: 'Глубокий зелёный', hex: '#1A3029', role: 'текст, обводки, тени' },
      { name: 'Коралловый', hex: '#EC6762', role: 'билеты и главные действия' },
      { name: 'Горчичный', hex: '#F4BB66', role: 'акценты, хит сезона' },
      { name: 'Крем', hex: '#FFFCF5', role: 'карточки' },
    ],
    fonts: [],
    ux: [
      { title: 'Ближайший концерт — сразу', text: 'На первом экране карточка ближайшего концерта с датой, временем и площадкой. Один клик — и вы на странице концерта.' },
      { title: 'Билеты всегда под рукой', text: 'Коралловая кнопка «Билеты» закреплена в шапке и повторяется на каждой карточке концерта. Коралловый цвет на сайте означает только одно: купить билет.' },
      { title: 'Все даты хита — в одном месте', text: 'У концерта, который идёт много раз, даты показаны чипами прямо на карточке, лишние сворачиваются в «Ещё 3». Не нужно искать нужный день по всей афише.' },
      { title: 'Фильтр по площадкам', text: 'Оркестр играет в Анненкирхе и Капелле. Фильтр сразу показывает концерты нужной площадки — важно для тех, кому удобнее добираться в одно место.' },
      { title: 'Страница концерта', text: 'Дата, время, площадка, длительность и возраст — крупно и в одном блоке, кнопка покупки рядом. Все ответы до того, как человек уйдёт на сайт билетного оператора.' },
      { title: 'Доверие', text: 'Публикации в «Фонтанке» и «Снобе» и рассказ о художественном руководителе: для нового зрителя это аргумент выбрать именно этот оркестр.' },
      { title: 'Связаться без лишних шагов', text: 'Форма обратной связи, почта и соцсети на одном экране: и для зрителей с вопросом о концерте, и для партнёров.' },
    ],
    implementation: [
      'Свой домен orchestra1703.com и собственный хостинг.',
      'На первом экране — видео с концертов вместо статичной фотографии: оркестр сразу виден «живым».',
    ],
    media: [
      { kind: 'video', src: 'assets/projects/orchestra-site/hero.mp4', poster: 'assets/projects/orchestra-site/hero-poster.jpg', caption: 'Первый экран: видео с концертов и карточка ближайшего концерта', ratio: '1280 / 642' },
      { kind: 'image', src: 'assets/projects/orchestra-site/hit.webp', alt: 'Карточка хита сезона «Музыка из кино на органе» с датами-чипами и кнопкой покупки', caption: 'Хит сезона: все даты на одной карточке', device: 'desktop', span: 12 },
      { kind: 'image', src: 'assets/projects/orchestra-site/afisha.webp', alt: 'Страница афиши с фильтром по площадкам', caption: 'Афиша и фильтр по площадкам', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/orchestra-site/cards.webp', alt: 'Карточки концертов с кнопками «Подробнее» и «Билеты»', caption: 'Карточки концертов', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/orchestra-site/concert.webp', alt: 'Страница концерта «Алиса в Стране чудес»: дата, площадка, кнопка покупки', caption: 'Страница концерта', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/orchestra-site/about.webp', alt: 'Блок о художественном руководителе Георгии Фёдорове', caption: 'Об оркестре', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/orchestra-site/press.webp', alt: 'Раздел «О нас пишут» с публикациями «Фонтанки» и «Сноба»', caption: 'Пресса', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/orchestra-site/contacts.webp', alt: 'Контакты «Давайте дружить»: почта, соцсети и форма', caption: 'Контакты', device: 'desktop', span: 6 },
    ],
    missing: [],
    todo: [],
  },

  {
    slug: 'kladovka',
    num: '003',
    file: 'KLADOVKA.PDF',
    title: 'Кладовка. Too many tabs',
    tagline: 'Концепт рекламной кампании и презентации для инвесторов приложения для мыслей и задач',
    type: 'concept',
    stage: { key: 'done', label: 'Завершён' },
    role: 'Идея, арт-дирекшн, баннеры, презентация, преролл',
    tools: ['Figma', 'Photoshop', 'After Effects', 'Нейросети для 3D-объектов'],
    summary: '«Утюг выключен. Наверное.» Мысли становятся огромными пластилиновыми предметами и вытесняют человека из его собственной жизни. Баннеры для ленты и сторис, преролл в After Effects и питч-дек, где тот же хаос разложен по полкам.',
    layout: 'campaign',
    accent: '#D15046',
    preview: { kind: 'image', src: 'assets/projects/kladovka/preview.webp', alt: 'Три баннера кампании «Кладовка»: кровать, заваленная делами, огромный утюг и крошечный человек', ratio: '1600 / 1000' },
    links: { live: '', play: '', behance: '', repo: '', pdf: 'assets/projects/kladovka/kladovka-investor-deck.pdf', pdfLabel: 'Презентация, PDF' },
    hero: [
      { src: 'assets/projects/kladovka/feed-bed.webp', alt: 'Баннер для ленты: «Вспомнила в 3 ночи. Забыла в 3:01.»', format: 'feed' },
      { src: 'assets/projects/kladovka/stories-iron.webp', alt: 'Баннер для сторис: «Утюг выключен. Наверное.»', format: 'stories' },
      { src: 'assets/projects/kladovka/feed-iron.webp', alt: 'Баннер для ленты: «Утюг выключен. Наверное.»', format: 'feed' },
    ],
    sections: [
      { id: 'task', title: 'Задача', text: ['Придумать запуск приложения, которое помогает выгружать из головы мысли, задачи и напоминания. Сделать рекламную кампанию для соцсетей и презентацию для инвесторов.'] },
      { id: 'insight', title: 'Инсайт', text: ['Невыполненные дела не исчезают. Они занимают место в голове, как вещи, которые некуда убрать: утюг, молоко, запись к стоматологу.', 'В среднем человек держит внимание на одном экране 47 секунд. В голове у него примерно столько же открытых вкладок.'] },
      { id: 'idea', title: 'Идея', text: ['Мысли становятся физическими предметами и вытесняют человека из его собственной жизни. Огромный утюг, кровать, заваленная делами. Кладовка — место, куда всё это можно убрать.'] },
      {
        id: 'system', title: 'Система', text: ['Мягкий пластилиновый 3D, тёплая палитра, широкий гротеск. Формула заголовка: ситуация, которую узнаёт каждый, и шутка коралловым.'],
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
        id: 'clip', title: 'Преролл', gallery: 'clip',
        text: ['Шесть секунд перед видео: мысль падает рядом с человеком, и Кладовка убирает её одним «чпоком». Анимация и звук — в After Effects.'],
        media: [{ kind: 'video', src: 'assets/projects/kladovka/kladovka-clip.mp4', poster: 'assets/projects/kladovka/kladovka-clip-poster.jpg', caption: 'Преролл на 6 секунд, After Effects', ratio: '16 / 9' }]
      },
    ],
    context: [], challenge: [], concept: [], palette: [], fonts: [], ux: [], implementation: [], media: [], missing: [], todo: [],
  },

  {
    slug: 'kvak',
    num: '004',
    file: 'KVAK.EXE',
    title: 'Квак, где мои вещи?!',
    tagline: 'Браузерная hidden-object игра с концептом рекламных интеграций брендов',
    type: 'concept',
    stage: { key: 'done', label: 'Можно поиграть' },
    role: 'Концепция, иллюстрации, моушн, арт-дирекшн, UX/UI',
    tools: ['Illustrator', 'After Effects', 'Нейросети', 'HTML', 'CSS', 'JavaScript'],
    summary: 'Спецпроект в формате мини-игры: на рабочем месте Квака пропали 5 вещей, найти их нужно за 60 секунд, пока офис не сгорел. Каждая находка — концепт интеграции бренда: билет в кино ведёт к Кинопоиску, авиабилет — к Aviasales.',
    layout: 'game',
    accent: '#D9FF43',
    preview: { kind: 'image', src: 'assets/projects/kvak/cover-desktop.webp', alt: 'Обложка игры: объявление «Квак, где мои вещи?!» над рабочим столом в горящем офисе', clip: 'assets/projects/kvak/kvak-scene-preview.mp4', ratio: '1440 / 860' },
    links: { live: '', play: 'play/kvak/index.html', behance: '', repo: '' },
    context: [
      'Концептуальный интерактивный спецпроект для портфолио. Формат — hidden object: игрок ищет предметы на одной насыщенной сцене.',
      'Аудитория — уставшие от офиса клерки, поэтому тон сознательно безумный: жабы за компьютерами, стикеры «КВА!» и офис, который горит в реальном времени.',
      'Игра задумана как рекламный формат: пять предметов — пять возможных партнёров (Aviasales, Кинопоиск, Т-Банк, «Вкусно — и точка», «Ясно»). Бренды в проекте не участвуют, все промокоды и награды демонстрационные — это прямо написано в игре.',
    ],
    challenge: [
      'Игра должна объяснять себя за секунды: правила умещаются в одну фразу на обложке, а срочность считывается без инструкций.',
    ],
    concept: [
      'Обложка оформлена как объявление «Срочное дело № 005»: название, статус «горит», срок поиска и число пропавших вещей — вся вводная на одном листке со скотчем.',
      'Квак выглядывает из-за объявления, моргает и прячется, а под столом почёсывает лапой — персонаж живёт, пока игрок читает правила.',
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
      { title: 'Список Квака', text: 'Справа — чек-лист с иконками предметов: найденное подсвечивается лаймом и зачёркивается, так что прогресс читается без счётчика.' },
      { title: 'Финал-сертификат', text: '«Квак выжил. Дедлайн тоже.» — сертификат с временем, числом находок и промахов: результатом хочется поделиться.' },
      { title: 'Огонь вместо таймера', text: 'Огонь растёт по трём стадиям вместе с игровым временем и останавливается вместе с игрой — время видно периферийным зрением.' },
      { title: 'Отдельная композиция под каждый экран', text: 'У обложки свои раскладки для десктопа, планшета и телефона: объявление и кнопка всегда остаются в первом экране.' },
    ],
    implementation: [
      'Чистые HTML, CSS и JavaScript без сборщика — проект открывается двойным кликом по index.html.',
      'Движение сначала собрала в After Effects: огонь, моргание и почёсывание лапой. По этому ролику с помощью нейросети перенесла анимацию в CSS, чтобы в игре не было тяжёлого видео. Пауза между движениями случайная — 10–20 секунд.',
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
    num: '005',
    file: 'SOSED.EXE',
    title: 'Симулятор худшего соседа',
    tagline: 'Пиксельная драма в пригородной электричке — в духе игр нулевых для PlayStation',
    type: 'personal',
    stage: { key: 'done', label: 'Завершён' },
    role: 'Автор проекта: идея и визуальное направление',
    tools: ['After Effects', 'React', 'Vite', 'Pixel art'],
    summary: '«Сохрани менталку. Не доводи Бабу Зину.» Бытовые ситуации постсоветской электрички, доведённые до абсурда: форточка, курица в фольге, громкие динамики — и шкалы менталки и ярости, которые решают, доедешь ли ты до конечной.',
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
      { title: 'Рюкзак выживания', text: 'Наушники с ANC, лапша «Дошик», бальзам «Звёздочка», валерьянка — у каждого предмета свой эффект, а лог показывает, что именно изменилось.' },
      { title: 'Маршрут = сложность', text: 'Три маршрута: до ближайшей станции, через полобласти, до конечной. Чем длиннее дорога, тем быстрее падает менталка.' },
      { title: 'Два состояния персонажа', text: 'У персонажей есть обычное и злое состояние — злость Бабы Зины видно по портрету ещё до того, как она заговорит.' },
      { title: 'Ачивки поездки', text: '«Первый шаг», «Дзен-мастер», «На грани», «Запасливый», «Выживший» — повод проехать маршрут ещё раз и по-другому.' },
    ],
    implementation: [
      'Ролики поездки собраны и отрендерены в After Effects: интерьер вагона и пейзаж — отдельные слои, пейзаж прокручивается за окнами.',
      'Игра — React + Vite.',
      'Сцена собрана из слоёв: неподвижный интерьер вагона и пейзаж за окнами, который прокручивается отдельно — ощущение поездки без анимации всей сцены.',
      'Переключатель звука в шапке, счётчик пройденных километров и время в кадре — как в игровом HUD.',
    ],
    media: [
      { kind: 'video', src: 'assets/projects/pixel-train/pixel-train.mp4', poster: 'assets/projects/pixel-train/pixel-train-poster.jpg', caption: 'Ролик в After Effects: интерьер неподвижен, пейзаж за окнами едет', ratio: '1280 / 714' },
      { kind: 'image', src: 'assets/projects/pixel-train/title.webp', alt: 'Титульный экран «Симулятор худшего соседа» в стиле файтинга: FIGHT!, Babushka против Chud', caption: 'Титульный экран', device: 'desktop', span: 12 },
      { kind: 'image', src: 'assets/projects/pixel-train/dialogue.webp', alt: 'Игровой экран: Баба Зина злится и требует закрыть форточку, варианты ответа с эффектами на психику и ярость', caption: 'Диалог: Баба Зина и выбор с ценой', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/pixel-train/inventory.webp', alt: 'Шкалы раздражения, шума и запаха, рюкзак с предметами и лог их использования', caption: 'Шкалы, рюкзак и лог', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/pixel-train/routes.webp', alt: 'Выбор маршрута: три поездки разной сложности и ачивки', caption: 'Выбор маршрута', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/pixel-train/final.webp', alt: 'Финал: «Конечная станция! Вы выжили!» с пройденным расстоянием и остатком менталки', caption: 'Финал и ачивки', device: 'desktop', span: 6 },
      { kind: 'video', src: 'assets/projects/pixel-train/pixel-layers.mp4', poster: 'assets/projects/pixel-train/pixel-layers-poster.jpg', caption: 'After Effects, без маски окон: пейзаж шире вагона и прокручивается за ним', ratio: '1600 / 562' },
    ],
    missing: [],
    todo: [],
  },

  {
    slug: 'paradai',
    num: '006',
    shelf: 'other',
    file: 'PARADAI.HTML',
    title: 'Paradai',
    tagline: 'Концепт сайта-магазина для тайского бренда крафтового шоколада. Не официальный сайт Paradai',
    type: 'concept',
    stage: { key: 'done', label: 'Предложен бренду' },
    role: 'Дизайн, UX и вёрстка',
    tools: ['Framer', 'React', 'TypeScript', 'Framer Motion', 'Canvas'],
    summary: 'Кастомные код-компоненты на Framer для бренда крафтового шоколада: галерея товара, конструктор коробки конфет, выезжающая корзина и scroll-анимации истории бренда.',
    layout: 'product',
    accent: '#8A5A3C',
    preview: { kind: 'image', src: 'assets/projects/paradai/hero.webp', alt: 'Первый экран концепта: логотип Paradai, плитка шоколада и какао-бобы', ratio: '2000 / 1012' },
    links: { live: 'https://lunichka.github.io/paradai-site/', play: '', behance: '', repo: '' },
    context: [
      'Paradai — тайский бренд крафтового шоколада bean-to-bar: от какао-боба с семейной фермы на Пхукете до плитки. Магазины в Бангкоке и на Пхукете.',
      'Это концепт, а не официальный сайт: я сделала его по собственной инициативе и предложила бренду. Тексты, фото и контакты взяты из открытых источников Paradai.',
    ],
    challenge: [
      'Показать бренд так же ярко, как его упаковка с иллюстрациями, и дать купить шоколад онлайн: каталог, страница товара, корзина и возможность собрать свой набор конфет.',
    ],
    concept: [
      'Тёплая кремово-бежевая палитра и шоколадно-коричневый текст, крупные плотные заголовки строчными буквами и фото, оформленные как полароиды. Сайт спокойный, чтобы главными оставались яркие иллюстрированные упаковки.',
    ],
    palette: [],
    fonts: [],
    ux: [
      { title: 'Страница товара', text: 'Галерея с навигацией по превью и хлебные крошки — понятно, где ты в каталоге.' },
      { title: 'Конструктор коробки конфет', text: 'Покупатель собирает свою коробку бонбонов прямо в каталоге, а корзина выезжает сбоку и не уводит со страницы.' },
      { title: 'История через движение', text: 'Таймлайн Bean-to-Bar и раздел «Наша история» раскрываются scroll-анимациями с наклоном.' },
      { title: 'Бережная анимация', text: 'Анимации учитывают системную настройку «уменьшить движение» (useReducedMotion).' },
    ],
    implementation: [
      'Компоненты: страница товара, «Наша история», таймлайн Bean-to-Bar, магазин с конструктором коробки и корзиной, сетка коллекции.',
      'ScentVolatilityTimeline — визуализация раскрытия аромата на HTML5 Canvas.',
      'Найден Framer-специфичный баг: Framer передаёт цвета в rgba(), из-за чего createLinearGradient молча не работал. Решение — рисование через globalAlpha.',
    ],
    media: [
      { kind: 'image', src: 'assets/projects/paradai/bonbons.webp', alt: 'Конструктор набора конфет: выбор вкусов и коробка на 9 ячеек', caption: 'Конструктор набора конфет', device: 'desktop', span: 12 },
      { kind: 'image', src: 'assets/projects/paradai/shop.webp', alt: 'Каталог с категориями', caption: 'Каталог', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/paradai/product.webp', alt: 'Страница товара с хлебными крошками и кнопкой Add to cart', caption: 'Страница товара', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/paradai/story.webp', alt: 'История бренда: семейная ферма на Пхукете', caption: 'История бренда', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/paradai/workshop.webp', alt: 'Галерея мастерской в виде полароидов', caption: 'Мастерская: галерея-полароиды', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/paradai/mission.webp', alt: 'Миссия бренда и фермер', caption: 'Миссия', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/paradai/footer.webp', alt: 'Футер с навигацией и контактами', caption: 'Футер', device: 'desktop', span: 6 },
    ],
    missing: [],
    todo: [],
  },

  {
    slug: 'artem-nazarov',
    num: '007',
    shelf: 'other',
    file: 'NAZAROV.HTML',
    title: 'Читает Артем Назаров',
    tagline: 'Сайт YouTube-проекта о чтении и аудиокнигах',
    type: 'client',
    stage: { key: 'live', label: 'Запущен' },
    role: 'Дизайн + Framer-код',
    tools: ['Framer', 'React', 'TypeScript', 'YouTube Data API v3', 'SoundCloud'],
    summary: 'Сайт чтеца аудиокниг и канала @ArtNazarovBooks. Аудитория — русскоязычные слушатели 40+, поэтому главный принцип — привычность важнее трендов.',
    layout: 'editorial',
    accent: '#E7B7A6',
    preview: { kind: 'image', src: 'assets/projects/artem-nazarov/hero.webp', alt: 'Главный экран сайта «Читает Артём Назаров»', ratio: '2048 / 1032' },
    links: { live: 'https://artem-nazarov.framer.website/', play: '', behance: '', repo: '' },
    context: [
      '«Читает Артем Назаров» (Artem Nazarov Reads) — YouTube-проект о чтении и аудиокнигах, канал @ArtNazarovBooks. Интерфейс сайта — на русском.',
      'Основная аудитория — русскоязычные люди примерно 40+, в большинстве живущие за пределами России. Они ценят ясность и знакомые паттерны больше, чем дизайн-тренды.',
      'Сайт работает как мостик между YouTube и платными платформами: зритель видит свежие выпуски, может послушать книгу прямо на странице и в один клик перейти на Boosty, Patreon или Sponsr.',
      'Сайт запущен 16 сентября 2026 года. За первый месяц после запуска канал вырос примерно на 1000 подписчиков, на Boosty пришли 20 новых. Сколько из них пришло именно с сайта, пока отдельно не измеряется.',
    ],
    challenge: [
      'Сделать сайт современным, не делая его непривычным: без тяжёлого моушна, WebGL и перехвата скролла.',
    ],
    concept: [
      'Принцип — «дизайн для привычки, а не для трендов». Современность передаётся типографикой, композицией и фотографией.',
      'Тёмная редакционная система: графитовые фоны, пыльная роза как единственный акцент, никаких теней и мягкое замедление easeOutExpo.',
    ],
    palette: [
      { name: 'Графит', hex: '#2D2D2D', role: 'фон' },
      { name: 'Тёмный графит', hex: '#343434', role: 'поверхности' },
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
    media: [
      { kind: 'image', src: 'assets/projects/artem-nazarov/about.webp', alt: 'Приветствие и цифры канала', caption: 'Знакомство и цифры канала', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/artem-nazarov/episodes.webp', alt: 'Блок «Новое на канале» с выпусками', caption: 'Свежие выпуски подтягиваются сами', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/artem-nazarov/story.webp', alt: 'О проекте: чёрно-белое фото и текст', caption: 'О проекте', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/artem-nazarov/support.webp', alt: 'Блок подписки: Boosty, Telegram, Patreon, Sponsr', caption: 'Поддержать проект в один клик', device: 'desktop', span: 6 },
      { kind: 'image', src: 'assets/projects/artem-nazarov/marquee.webp', alt: 'Бегущая строка «аудиокниги и не только»', caption: 'Бегущая строка', device: 'desktop', span: 12 },
    ],
    missing: [],
    todo: [],
  },

  {
    slug: 'club-puer',
    hidden: true,
    num: '008',
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
      'Спокойствие в духе японского дзен: тёплый беж, янтарный, терракота и красная печать-ханко.',
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
