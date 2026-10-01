// Scripted mini-lessons (a piece moves across the board while Цок explains). Pure data.
//
// A demo is a list of steps. In one step everything but `say` and `slide` happens at once:
//   pieces: {e4:'N'}          replace all pieces (empty object = clear the board)
//   add: {d5:'p'}             add pieces
//   marks: ['e4'] + kind      highlight squares ('focus' | 'line' | 'sel' ...)
//   dots: 'e4'                show the moves of the piece standing there (one after another when stagger)
//   only: 'straight'|'diag'   keep only some of those dots
//   clear: true               remove marks and dots first
//   say: 'lesson.r.1'         narrate (the step waits for it)
//   slide: ['d4','d8']        move a piece (hop: true for a knight jump); runs while Цок talks
//   promote: {sq:'e8', ch:'Q'}
//   emote: 'happy'
//   wait: 400                 pause (ms)

export const LESSON_LINES = {
  // ---- how the pieces move
  'lesson.r.1': 'Ладья ходит по прямым линиям: вперёд, назад, вправо и влево.',
  'lesson.r.2': 'Как поезд по рельсам!',
  'lesson.r.3': 'Она может пройти сколько угодно клеточек, пока ей никто не мешает.',
  'lesson.r.4': 'Свою фигуру ладья перепрыгнуть не может. А чужую можно съесть!',
  'lesson.b.1': 'Слон ходит по косым линиям. Их называют диагоналями.',
  'lesson.b.2': 'Он бегает наискосок, сколько хочет клеточек.',
  'lesson.b.3': 'И слон всегда ходит по клеточкам одного цвета!',
  'lesson.b.4': 'Как и ладья, слон не перепрыгивает через фигуры. Чужую он может съесть.',
  'lesson.q.1': 'Ферзь ходит и как ладья, и как слон.',
  'lesson.q.2': 'Сначала прямо: вперёд, назад и в стороны.',
  'lesson.q.3': 'А ещё наискосок, во все стороны!',
  'lesson.q.4': 'Поэтому ферзь самая сильная фигура. Его ещё называют королевой.',
  'lesson.k.1': 'Король ходит на одну клеточку в любую сторону.',
  'lesson.k.2': 'Вперёд, назад, вбок и наискосок. Но только на одну клеточку!',
  'lesson.k.3': 'Король самый главный, но он не торопится.',
  'lesson.n.1': 'Конь ходит буквой Г.',
  'lesson.n.2': 'Две клеточки прямо…',
  'lesson.n.3': '…и одна в сторону.',
  'lesson.n.4': 'Вот все места, куда конь может прыгнуть.',
  'lesson.n.5': 'А ещё конь умеет перепрыгивать через другие фигуры. Цок-цок-цок!',
  'lesson.p.1': 'Пешка ходит только вперёд на одну клеточку.',
  'lesson.p.2': 'Из самого начала она может шагнуть сразу на две клеточки.',
  'lesson.p.3': 'А вот съедает пешка наискосок: на одну клеточку вперёд и в сторону.',
  'lesson.p.4': 'Вперёд пешка не бьёт. Если впереди стоит фигура, пешка стоит.',
  'lesson.p.5': 'Когда пешка дойдёт до конца доски, она превратится в любую фигуру, например в ферзя!',
  'lesson.try': 'Теперь попробуй сам!',

  // ---- names tour
  'names.intro': 'Давай познакомимся с шахматными фигурами! Нажимай на любую, и я скажу, как её зовут.',
  'names.intro.k': 'Это король. Он самый главный. Если короля поймают, игра закончится.',
  'names.intro.q': 'Это ферзь. Его ещё зовут королевой. Ферзь самая сильная фигура!',
  'names.intro.r': 'Это ладья. Она похожа на башню замка.',
  'names.intro.b': 'Это слон. У него высокая шапка с прорезью.',
  'names.intro.n': 'Это конь. Он похож на лошадку. Иго-го!',
  'names.intro.p': 'Это пешка. Пешек много. Они маленькие, но смелые.',
  'names.intro_end': 'Молодец! Теперь проверим, как ты запомнил.',
  'names.intro_colors': 'А ещё фигуры бывают белые и чёрные. Белые ходят первыми.',

  // ---- moves picker
  'moves.pick': 'Выбери фигуру, и я расскажу, как она ходит!',
  'moves.pick_all': 'А здесь тренируемся со всеми фигурами сразу!',
  'moves.watch_again': 'Хочешь посмотреть ещё раз?',

  // ---- board tour
  'lesson.board.1': 'Это шахматная доска. На ней шестьдесят четыре клеточки.',
  'lesson.board.2': 'Клеточки бывают светлые и тёмные.',
  'lesson.board.3': 'Столбики называются вертикалями. У каждой есть имя, это буква: а, бэ, цэ, дэ, е, эф, жэ, аш.',
  'lesson.board.4': 'А ряды называются горизонталями. Их называют цифрами: от одного до восьми.',
  'lesson.board.5': 'У каждой клеточки есть имя: буква и цифра. Например, е четыре.',
  'lesson.board.6': 'Белые фигуры стоят внизу, а чёрные наверху.',
  'lesson.board.7': 'Первыми всегда ходят белые. А теперь потренируемся!',
  'board.intro': 'Давай изучим шахматную доску!',

  // ---- other game intros
  'words.intro': 'Давай выучим шахматные слова: шах, мат, рокировка и другие!',
  'puz.intro': 'Решаем шахматные задачки! Подумай хорошенько.',
  'learn.start': 'Начинаем!',
  'learn.next_round': 'Следующее задание!',
  'learn.last': 'Последнее задание!',
  'learn.well_done': 'Ура! Мы справились!',
  'learn.hint': 'Смотри, я подскажу!',
}

/** Demo scripts, one per piece. `only`, `dots` etc. are executed by chess-kit.js */
export const DEMOS = {
  r: [
    { pieces: { d4: 'R' }, say: 'lesson.r.1', dots: 'd4', stagger: true },
    { clear: true, say: 'lesson.r.2', slide: ['d4', 'd8'] },
    { slide: ['d8', 'h8'] },
    { slide: ['h8', 'h4'] },
    { say: 'lesson.r.3', slide: ['h4', 'd4'] },
    { pieces: { d4: 'R', d2: 'P', g4: 'p', d7: 'p' }, say: 'lesson.r.4', dots: 'd4', stagger: true },
    { slide: ['d4', 'd7'], wait: 500 },
    { emote: 'happy', say: 'lesson.try' },
  ],
  b: [
    { pieces: { d4: 'B' }, say: 'lesson.b.1', dots: 'd4', stagger: true },
    { clear: true, say: 'lesson.b.2', slide: ['d4', 'g7'] },
    { slide: ['g7', 'c3'] },
    { clear: true, say: 'lesson.b.3', marks: 'sameColor:c3', kind: 'line', wait: 900 },
    { clear: true, pieces: { c3: 'B', e5: 'P', g7: 'p', a1: 'p' }, say: 'lesson.b.4', dots: 'c3', stagger: true },
    { slide: ['c3', 'a1'], wait: 500 },
    { emote: 'happy', say: 'lesson.try' },
  ],
  q: [
    { pieces: { d4: 'Q' }, say: 'lesson.q.1', wait: 300 },
    { say: 'lesson.q.2', dots: 'd4', only: 'straight', stagger: true },
    { say: 'lesson.q.3', dots: 'd4', only: 'diag', stagger: true },
    { clear: true, say: 'lesson.q.4', dots: 'd4', stagger: false },
    { clear: true, slide: ['d4', 'h8'] },
    { slide: ['h8', 'h2'] },
    { emote: 'happy', say: 'lesson.try' },
  ],
  k: [
    { pieces: { e4: 'K' }, say: 'lesson.k.1', dots: 'e4', stagger: true },
    { clear: true, say: 'lesson.k.2', slide: ['e4', 'e5'] },
    { slide: ['e5', 'f6'] },
    { slide: ['f6', 'f5'] },
    { slide: ['f5', 'e4'] },
    { emote: 'happy', say: 'lesson.k.3' },
    { emote: 'happy', say: 'lesson.try' },
  ],
  n: [
    { pieces: { d4: 'N' }, say: 'lesson.n.1', wait: 200 },
    { marks: ['d5', 'd6'], kind: 'line', say: 'lesson.n.2' },
    { marks: ['e6'], kind: 'focus', say: 'lesson.n.3', wait: 300 },
    { clear: true, slide: ['d4', 'e6'], hop: true },
    { slide: ['e6', 'd4'], hop: true },
    { say: 'lesson.n.4', dots: 'd4', stagger: true },
    { clear: true, pieces: { d4: 'N', c4: 'P', e4: 'P', d3: 'P', d5: 'P', c5: 'p', e5: 'p', c3: 'p', e3: 'p' }, say: 'lesson.n.5' },
    { slide: ['d4', 'f5'], hop: true },
    { slide: ['f5', 'd4'], hop: true, wait: 200 },
    { emote: 'happy', say: 'lesson.try' },
  ],
  p: [
    { pieces: { e2: 'P' }, say: 'lesson.p.1', dots: 'e2', stagger: false, wait: 200 },
    { clear: true, slide: ['e2', 'e3'] },
    { pieces: { e2: 'P' }, say: 'lesson.p.2', dots: 'e2', stagger: true },
    { clear: true, slide: ['e2', 'e4'] },
    { clear: true, pieces: { e4: 'P', d5: 'p', f5: 'n', e5: 'p' }, say: 'lesson.p.3', dots: 'e4', stagger: true },
    { slide: ['e4', 'd5'], wait: 300 },
    { pieces: { e4: 'P', e5: 'p' }, clear: true, say: 'lesson.p.4', wait: 500 },
    { clear: true, pieces: { e7: 'P' }, say: 'lesson.p.5' },
    { slide: ['e7', 'e8'] },
    { promote: { sq: 'e8', ch: 'Q' }, wait: 600 },
    { emote: 'happy', say: 'lesson.try' },
  ],
}

export const BOARD_TOUR = [
  { pieces: {}, say: 'lesson.board.1', marks: 'all', kind: 'line', stagger: true },
  { clear: true, say: 'lesson.board.2', marks: 'light', kind: 'line', wait: 500 },
  { clear: true, marks: 'dark', kind: 'line', wait: 900 },
  { clear: true, say: 'lesson.board.3', marks: 'files', kind: 'line', stagger: true },
  { clear: true, say: 'lesson.board.4', marks: 'ranks', kind: 'line', stagger: true },
  { clear: true, say: 'lesson.board.5', marks: 'e4', kind: 'focus', crosshair: true },
  { clear: true, pieces: 'start', say: 'lesson.board.6' },
  { say: 'lesson.board.7' },
]
