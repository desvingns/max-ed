// Реестр «Школы поваров Пыха»: главы, уровни, стикеры.
// Данные без зависимостей — их импортируют world/land/album/parents и роутер.
const emoji = e => `<span class="emoji">${e}</span>`

// [id, название, иконка, цвет, стикер-фон, sticker-art (по умолчанию иконка)]
const L = (id, title, icon, color, bg, art) => ({ id, title, icon, color, sticker: { id: `kx-${id}`, art: art ?? icon, bg } })

export const chapters = [
  {
    id: 'kx-abc', title: 'Азбука кухни', host: 'pyx', color: '#62C6FF', icon: '🧼', sky: ['#D6EFFF', '#F4FBFF'],
    levels: [
      L('wash-hands', 'Мою руки с мылом', '🧼', '#62C6FF', '#DDF3FF'),
      L('chef-dress', 'Одеваем повара', '👨‍🍳', '#FF9F43', '#FFE3A3'),
      L('tool-names', 'Кто что делает?', '🥄', '#B8C0CC', '#EDF2FF'),
      L('hot-sharp', 'Горячо! Остро! Можно!', '🔥', '#FF5A5F', '#FFE0E0'),
      L('set-table', 'Накрой на стол', '🍽️', '#FFD93D', '#FFF3B0'),
      L('fridge-shelf', 'Что где хранить?', '🧊', '#62C6FF', '#E6F4FF'),
      L('clean-up', 'Уборка на кухне', '🧽', '#6BCB77', '#D9F5D0'),
    ],
  },
  {
    id: 'kx-cut', title: 'Нарезалка', host: 'tyuk', color: '#FF5A5F', icon: '🥕', sky: ['#FFD9D0', '#FFF6F2'],
    levels: [
      L('cut-cucumber', 'Огурчики-кружочки', '🥒', '#6BCB77', '#D9F5D0'),
      L('cut-halves', 'Пополам и поровну', '🍎', '#FF5A5F', '#FFE0E0'),
      L('cut-carrot', 'Кружки, палочки, кубики', '🥕', '#FF9F43', '#FFE3C2'),
      L('peel', 'Чистим овощи', '🥔', '#C68B59', '#FFE3A3'),
      L('grate', 'Тёрка-щекотка', '🧀', '#FFD93D', '#FFF3B0'),
      L('cut-bread', 'Ровные ломтики', '🍞', '#E6A462', '#FFE9B8'),
      L('onion', 'Лук-слезоточивик', '🧅', '#B388EB', '#E8DDFF'),
    ],
  },
  {
    id: 'kx-salt', title: 'Соль и вкус', host: 'shchyok', color: '#FFD93D', icon: '🧂', sky: ['#FFF0B8', '#FFFBEA'],
    levels: [
      L('why-salt', 'Зачем нужна соль?', '🧂', '#FFD93D', '#FFF3B0'),
      L('four-tastes', 'Четыре вкуса', '👅', '#FF8FC8', '#FFD6EC'),
      L('salt-or-sugar', 'Соль или сахар?', '🍬', '#FF8FC8', '#FFE0F0'),
      L('salt-melts', 'Куда пропала соль?', '💧', '#62C6FF', '#CDEBFF'),
      L('egg-float', 'Яйцо-поплавок', '🥚', '#FFB938', '#FFF3E0'),
      L('sea-salt', 'Откуда берётся соль?', '🌊', '#4D96FF', '#CDEBFF'),
      L('pickles', 'Солёные огурчики', '🥫', '#6BCB77', '#D9F5D0'),
    ],
  },
  {
    id: 'kx-recipes', title: 'Рецепты Пыха', host: 'pyx', color: '#FF9F43', icon: '🍲', sky: ['#FFE8C7', '#FFF8EC'],
    levels: [
      L('sandwich', 'Бутерброд', '🥪', '#E6A462', '#FFE9B8'),
      L('veg-salad', 'Овощной салат', '🥗', '#6BCB77', '#D9F5D0'),
      L('pasta', 'Макароны', '🍝', '#FFD93D', '#FFF3B0'),
      L('veg-soup', 'Овощной суп', '🍲', '#FF9F43', '#FFE3C2'),
      L('porridge', 'Каша: мешай-мешай!', '🥣', '#FFB938', '#FFF3E0'),
      L('pizza', 'Пицца', '🍕', '#FF5A5F', '#FFE0E0'),
      L('fruit-salad', 'Фруктовый салат', '🍓', '#FF5A5F', '#FFD6EC'),
    ],
  },
  {
    id: 'kx-sweet', title: 'Сладкая полка', host: 'pig', color: '#FF8FC8', icon: '🍪', sky: ['#FFD6EC', '#FFF4FA'],
    levels: [
      { ...L('pancakes', 'Блинчики', '🥞', '#FFB938', '#FFE3A3'), sticker: { id: 'k-pancakes', art: '🥞', bg: '#FFE3A3', existing: true } },
      L('cookies', 'Печенье-фигурки', '🍪', '#C68B59', '#FFE3A3'),
      { ...L('cake', 'Торт для друга', '🎂', '#FF8FC8', '#FFD6EC'), sticker: { id: 'k-cake', art: '🎂', bg: '#FFD6EC', existing: true } },
      L('lemonade', 'Лимонад: кисло-сладко', '🍋', '#FFD93D', '#FFF3B0'),
      L('smoothie', 'Смузи-радуга', '🥤', '#B388EB', '#E8DDFF'),
      L('dough-rise', 'Тесто-хлебушек', '🥖', '#E6A462', '#FFE9B8'),
      L('butter-shake', 'Масло из сливок', '🧈', '#FFD93D', '#FFF3B0'),
    ],
  },
  {
    id: 'kx-science', title: 'Чудеса кухни', host: 'kapa', color: '#9B6BFF', icon: '🔬', sky: ['#E3D9FF', '#F8F5FF'],
    levels: [
      { id: 'kitchen-kettle', title: 'Чайник кипит (пар)', icon: '🫖', color: '#62C6FF', builtin: true },
      { id: 'kitchen-freezer', title: 'Сок в морозилке (лёд)', icon: '🍧', color: '#9B6BFF', builtin: true },
      { id: 'kitchen-omelet', title: 'Омлет (нагрев меняет яйцо)', icon: '🍳', color: '#FFD93D', builtin: true },
      L('boil-egg', 'Яйцо: всмятку или вкрутую?', '⏲️', '#FFD93D', '#FFF3B0', '🥚'),
      L('popcorn', 'Попкорн: пых-бах!', '🍿', '#FF9F43', '#FFF3B0'),
      L('float-sink', 'Плавает или тонет?', '🦆', '#4D96FF', '#CDEBFF'),
      L('melt-chocolate', 'Тает и застывает', '🍫', '#C68B59', '#FFE3C2'),
    ],
  },
  {
    id: 'kx-shop', title: 'Продуктовая лавка', host: 'chukh', color: '#6BCB77', icon: '🛒', sky: ['#D9F5D0', '#F6FFF2'],
    levels: [
      L('shopping', 'Список покупок', '🛒', '#6BCB77', '#D9F5D0'),
      L('healthy-plate', 'Радужная тарелка', '🌈', '#FF8FC8', '#E6F4FF'),
      L('where-from', 'Откуда еда?', '🚜', '#6BCB77', '#D9F5D0'),
      L('smell-spices', 'Нюхаем специи', '👃', '#FF9F43', '#FFE3C2'),
      L('fresh-or-bad', 'Свежее или испорченное?', '🔍', '#B388EB', '#E8DDFF'),
      L('measure', 'Мерный стаканчик', '🥛', '#62C6FF', '#E6F4FF'),
      L('sand-timer', 'Песочные часы', '⏳', '#FFB938', '#FFF3B0'),
    ],
  },
]

// добавляем к главам поля «как у региона»: activities для land-сцены
for (const ch of chapters) {
  ch.kind = 'kitchen'
  ch.parent = 'kitchen'
  ch.bg = 'kitchen'
  ch.map = { x: 0, y: 0 }
  ch.activities = ch.levels.map(l => ({ route: `/ep/${l.id}`, icon: emoji(l.icon), color: l.color, title: l.title }))
}

/** Кухонный регион показывает порталы-главы вместо отдельных уровней. */
export const kitchenActivities = chapters.map(ch => ({ route: `/land/${ch.id}`, icon: emoji(ch.icon), color: ch.color, title: ch.title }))

/** Все новые (не встроенные) уровни, id → мета. */
export const levels = {}
for (const ch of chapters) for (const l of ch.levels) levels[l.id] = { ...l, chapter: ch.id }

/** Идентификаторы всех kx-уровней, которые загружаются из assets/kx/levels/*.js. */
export const levelIds = Object.values(levels).filter(l => !l.builtin).map(l => l.id)

/** Новые стикеры для world.r (существующие k-pancakes/k-cake не дублируем). */
export const stickers = chapters.flatMap(ch =>
  ch.levels.filter(l => l.sticker && !l.sticker.existing).map(l => ({ id: l.sticker.id, region: ch.id, art: l.sticker.art, bg: l.sticker.bg })))
