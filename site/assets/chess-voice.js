// Voice lines of the chess station. Every line is played from ./voice/manifest.json (mp3 made by
// tools/chess/gen-voice.py); this text is also the subtitle and the fallback for the browser's
// speech synthesis. `say` (optional) is what the voice reads when it differs from the subtitle.
// Keys are `${ns}.${key}`; games use ns "g.chess".
import { PIECE, PIECE_TYPES } from './chess-pieces.js'
import { LESSON_LINES } from './chess-lessons.js'
const FILES = 'abcdefgh'

export const SPEAKERS = {
  tsok: { name: 'Цок', voice: 'ru-RU-DmitryNeural', pitch: '+18Hz', rate: '+6%', fx: '' },
}

const cap = s => s[0].toUpperCase() + s.slice(1)
const tsok = (text, say) => ({ who: 'tsok', text, ...(say ? { say } : {}) })

// ---------------------------------------------------------------- host: praise / retry
const host = {
  ns: 'c',
  lines: {
    'tsok.praise1': tsok('Цок-цок! Молодец, Максим!'),
    'tsok.praise2': tsok('Иго-го! Правильно!'),
    'tsok.praise3': tsok('Ура! Ты настоящий шахматист!'),
    'tsok.praise4': tsok('Отлично! Так держать!'),
    'tsok.praise5': tsok('Верно! Ты молодец!'),
    'tsok.praise6': tsok('Здорово! Я горжусь тобой!'),
    'tsok.praise7': tsok('Точно! Умница!'),
    'tsok.praise8': tsok('Иго-го! Вот это ход!'),
    'tsok.retry1': tsok('Ой, почти! Попробуй ещё разок.'),
    'tsok.retry2': tsok('Не беда! Давай подумаем вместе.'),
    'tsok.retry3': tsok('Цок-цок, ещё раз!'),
    'tsok.retry4': tsok('Хм, не совсем. Попробуем снова?'),
    'tsok.retry5': tsok('Ничего страшного! Ошибаются все.'),
    'tsok.retry6': tsok('Посмотри внимательно и попробуй ещё.'),
  },
}

const land = {
  ns: 's.land',
  lines: {
    'chess.hello': tsok('Привет, Максим! Я конёк Цок. Добро пожаловать в Шахматное Королевство!'),
    'chess.again1': tsok('Цок-цок! Мой шахматист пришёл!'),
    'chess.again2': tsok('Иго-го! Как я рад тебя видеть!'),
    'chess.tap1': tsok('Иго-го! Щекотно!'),
    'chess.tap2': tsok('Цок-цок! Пойдём играть в шахматы?'),
    'chess.locked': tsok('Это пока закрыто. Подожди немножко!'),
  },
}

const map = {
  ns: 's.map',
  lines: {
    fly_chess: { who: 'pyx', text: 'Летим в Шахматное Королевство к Цоку!' },
  },
}

// ---------------------------------------------------------------- the games
const L = {}
const add = (k, text, say) => (L[k] = tsok(text, say))

// play mode
add('play.intro', 'Выбирайте, как будем играть!')
add('play.mode_tb', 'Сидим напротив: сверху и снизу.')
add('play.mode_lr', 'Сидим напротив: слева и справа.')
add('play.mode_side', 'Сидим рядом, с одной стороны.')
add('play.mode_cpu', 'Играем с Цоком!')
add('play.cpu_pick', 'Выбери, каким цветом ты играешь, и как сильно я буду стараться.')
add('play.start', 'Ходят белые! Удачи!')
add('play.turn_w', 'Ходят белые.')
add('play.turn_b', 'Ходят чёрные.')
add('play.check', 'Шах!')
add('play.mate_w', 'Шах и мат! Победили белые!')
add('play.mate_b', 'Шах и мат! Победили чёрные!')
add('play.cpu_win', 'Шах и мат! Я победил! Но ты хорошо играл!')
add('play.cpu_lose', 'Шах и мат! Ты победил! Ура, ты молодец!')
add('play.stalemate', 'Пат! Ходить нечем. Это ничья.')
add('play.draw', 'Ничья! Никто не победил.')
add('play.promote', 'Пешка дошла до конца! Выбери, кем она станет.')
add('play.in_check_help', 'Королю шах! Нужно спасти короля.')

// lessons / intros
for (const [k, v] of Object.entries(LESSON_LINES)) add(k, v)

// numbers
const NUM = { 1: 'Один.', 2: 'Два.', 3: 'Три.', 4: 'Четыре.', 8: 'Восемь.', 16: 'Шестнадцать.', 32: 'Тридцать два.', 64: 'Шестьдесят четыре.' }
for (const [n, w] of Object.entries(NUM)) add(`num.${n}`, w)

// squares, files, ranks
const FILE_RU = ['а', 'бэ', 'цэ', 'дэ', 'е', 'эф', 'жэ', 'аш']
const RANK_RU = ['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь']
FILES.split('').forEach((f, i) => {
  add(`file.${f}`, f, FILE_RU[i])
  for (let r = 0; r < 8; r++) add(`sq.${f}${r + 1}`, `${f}${r + 1}`, `${FILE_RU[i]} ${RANK_RU[r]}`)
})
RANK_RU.forEach((w, r) => add(`rank.${r + 1}`, String(r + 1), w))

// per piece
for (const t of PIECE_TYPES) {
  const p = PIECE[t]
  const Ru = cap(p.ru)
  add(`name.${t}`, `${Ru}.`)
  add(`names.this.${t}`, `Это ${p.ru}.`)
  add(`names.right.${t}`, `Верно! Это ${p.ru}.`)
  add(`names.find.${t}`, `Покажи ${p.acc}.`)
  add(`moves.where.${t}`, `Куда может пойти ${p.ru}? Нажми на клеточку.`)
  add(`moves.no.${t}`, `${Ru} так не ходит.`)
  add(`moves.right.${t}`, `Верно! Так ходит ${p.ru}.`)
  add(`moves.star.${t}`, `Отведи ${p.acc} к звёздочке.`)
  if (t !== 'p') add(`moves.star2.${t}`, `Отведи ${p.acc} к звёздочке за два хода.`)
  if (t !== 'p') add(`moves.all.${t}`, `Найди все клеточки, куда может пойти ${p.ru}.`)
  add(`moves.capture.${t}`, `Какую фигуру может съесть ${p.ru}? Нажми на неё.`)
  add(`moves.cant.${t}`, `${Ru} до неё не достанет.`)
  add(`moves.eat.${t}`, `Пусть ${p.ru} съест чёрную фигуру.`)
  add(`moves.how.${t}`, `Как ходит ${p.ru}? Выбери картинку.`)
  add(`moves.can.${t}`, `Может ли ${p.ru} пойти на клеточку со звёздочкой?`)
  add(`moves.no_star.${t}`, `${Ru} туда не пойдёт.`)
  add(`words.check_by.${t}`, t === 'k' ? 'Да, это шах!' : `Да, это шах! ${Ru} нападает на короля.`)
  for (const c of ['w', 'b']) {
    const adj = c === 'w' ? (p.gender === 'm' ? 'белый' : 'белая') : p.gender === 'm' ? 'чёрный' : 'чёрная'
    const adjAcc = c === 'w' ? (p.gender === 'm' ? 'белого' : 'белую') : p.gender === 'm' ? 'чёрного' : 'чёрную'
    add(`board.start.${c}${t}`, `Где в начале игры стоит ${adj} ${p.ru}? Нажми на клеточку.`)
    add(`names.bfind.${c}${t}`, `Найди ${adjAcc} ${p.acc}.`)
  }
}
const GEN_PL = { r: 'ладей', b: 'слонов', n: 'коней', k: 'королей', q: 'ферзей' }
for (const c of ['w', 'b']) for (const t of ['r', 'b', 'n', 'k', 'q']) add(`names.ball.${c}${t}`, `Найди на доске всех ${c === 'w' ? 'белых' : 'чёрных'} ${GEN_PL[t]}.`)
for (const t of ['q', 'r', 'b', 'n']) add(`words.stronger_${t}`, `${cap(PIECE[t].ru)} сильнее.`)

// names
add('names.who', 'Кто это?')
add('names.color', 'Какого цвета эта фигура?')
add('names.white', 'Белая.')
add('names.black', 'Чёрная.')
add('names.whites', 'Белые.')
add('names.blacks', 'Чёрные.')
add('names.color_white', 'Верно! Это белая фигура.')
add('names.color_black', 'Верно! Это чёрная фигура.')
add('names.all_right', 'Ты нашёл всех!')

// facts
add('fact.main', 'Какая фигура самая главная?')
add('fact.main_r', 'Король! Если поймать короля, игра заканчивается.')
add('fact.strong', 'Какая фигура самая сильная?')
add('fact.strong_r', 'Ферзь! Он ходит во все стороны.')
add('fact.tower', 'Какая фигура похожа на башню?')
add('fact.tower_r', 'Ладья! Она как башня замка.')
add('fact.horse', 'У какой фигуры голова лошадки?')
add('fact.horse_r', 'Конь! Иго-го!')
add('fact.lshape', 'Какая фигура ходит буквой Г?')
add('fact.lshape_r', 'Конь ходит буквой Г.')
add('fact.diag', 'Какая фигура ходит только по косым линиям?')
add('fact.diag_r', 'Слон! Он ходит по диагоналям.')
add('fact.cross', 'У какой фигуры на короне крестик?')
add('fact.cross_r', 'У короля! Он самый главный.')
add('fact.many', 'Каких фигур на доске больше всего?')
add('fact.many_r', 'Пешек! У каждого игрока их восемь.')
add('fact.hat', 'У какой фигуры шапка с прорезью?')
add('fact.hat_r', 'Слон носит такую шапку.')
add('fact.jump', 'Какая фигура умеет перепрыгивать через других?')
add('fact.jump_r', 'Конь! Он прыгает через фигуры.')
add('fact.queenmove', 'Кто ходит и как ладья, и как слон?')
add('fact.queenmove_r', 'Ферзь! Поэтому он самый сильный.')
add('fact.forward', 'Какая фигура ходит только вперёд?')
add('fact.forward_r', 'Пешка идёт только вперёд.')
add('fact.rails', 'Какая фигура ходит прямо, как поезд по рельсам?')
add('fact.rails_r', 'Ладья! Прямо, как по рельсам.')
add('fact.n_k', 'Сколько королей у каждого игрока?')
add('fact.n_k_r', 'Один король. Он самый главный.')
add('fact.n_q', 'Сколько ферзей у каждого игрока?')
add('fact.n_q_r', 'Один ферзь.')
add('fact.n_r', 'Сколько ладей у каждого игрока?')
add('fact.n_r_r', 'Две ладьи, в углах доски.')
add('fact.n_b', 'Сколько слонов у каждого игрока?')
add('fact.n_b_r', 'Два слона.')
add('fact.n_n', 'Сколько коней у каждого игрока?')
add('fact.n_n_r', 'Два коня.')
add('fact.n_p', 'Сколько пешек у каждого игрока?')
add('fact.n_p_r', 'Восемь пешек!')
add('fact.n_all', 'Сколько всего фигур у каждого игрока?')
add('fact.n_all_r', 'Шестнадцать! Восемь фигур и восемь пешек.')
add('fact.first', 'Кто ходит первым: белые или чёрные?')
add('fact.first_r', 'Первыми всегда ходят белые!')

// moves (generic)
add('moves.star_right', 'Ура! Дошли до звёздочки!')
add('moves.all_right', 'Ты нашёл все клеточки!')
add('moves.capture_right', 'Да! Эту фигуру можно съесть.')
add('moves.eat_right', 'Ам! Фигура съедена!')
add('moves.jump', 'Конь умеет прыгать через фигуры! Отведи коня к звёздочке.')
add('moves.jump_right', 'Цок-цок! Вот как прыгает конь!')
add('moves.pawn.count', 'Сколько клеточек может пройти эта пешка?')
add('moves.pawn.two_start', 'Из начала пешка может шагнуть на две клеточки.')
add('moves.pawn.one_more', 'Дальше пешка идёт только на одну клеточку.')
add('moves.pawn.capture', 'Пешка бьёт наискосок. Съешь чёрную фигуру!')
add('moves.pawn.capture_right', 'Правильно! Пешка бьёт наискосок.')
add('moves.pawn.front_no', 'Вперёд пешка не бьёт. Только наискосок.')
add('moves.promote', 'Доведи пешку до конца доски!')
add('moves.promote_right', 'Ура! Пешка превратилась!')
add('moves.yes_right', 'Да, может! Верно!')
add('moves.yes_star', 'Как раз можно! Смотри, вот точки.')

// board
add('board.color_q', 'Какого цвета эта клеточка?')
add('board.light', 'Светлая.')
add('board.dark', 'Тёмная.')
add('board.color_light', 'Верно! Это светлая клеточка.')
add('board.color_dark', 'Верно! Это тёмная клеточка.')
add('board.corner_q', 'Какая клеточка в правом нижнем углу?')
add('board.corner_right', 'Светлая! Запомни: справа внизу всегда светлая клеточка.')
add('board.count_all', 'Сколько всего клеточек на доске?')
add('board.count_all_r', 'Шестьдесят четыре! Восемь рядов по восемь клеточек.')
add('board.count_row', 'Сколько клеточек в одном ряду?')
add('board.count_row_r', 'Восемь клеточек.')
add('board.find', 'Найди клеточку')
add('board.this', 'Это клеточка')
add('board.name_q', 'Как называется эта клеточка?')
add('board.findfile', 'Найди вертикаль')
add('board.file_hint', 'Вертикаль идёт снизу вверх, а её имя это буква.')
add('board.file_right', 'Верно! Это вертикаль.')
add('board.findrank', 'Найди горизонталь')
add('board.rank_hint', 'Горизонталь идёт слева направо, а её имя это цифра.')
add('board.rank_right', 'Верно! Это горизонталь.')
add('board.line_q', 'Как называется эта линия?')
add('board.vertical', 'Вертикаль.')
add('board.horizontal', 'Горизонталь.')
add('board.diagonal', 'Диагональ.')
add('board.line_vertical', 'Верно! Вертикаль идёт сверху вниз.')
add('board.line_horizontal', 'Верно! Горизонталь идёт слева направо.')
add('board.line_diagonal', 'Верно! Диагональ идёт наискосок.')
add('board.start_no', 'Нет, там она не стоит. Подумай ещё.')
add('board.start_right', 'Верно! Так фигура стоит в начале игры.')
add('board.setup.rooks', 'Поставь белые ладьи на свои места. Они стоят в углах.')
add('board.setup.rooks_b', 'Поставь чёрные ладьи на свои места. Они стоят в углах.')
add('board.setup.knights', 'Поставь белых коней и ладьи на свои места.')
add('board.setup.knights_b', 'Поставь чёрных коней и ладьи на свои места.')
add('board.setup.all', 'Расставь все белые фигуры на свои места!')
add('board.setup.all_b', 'Расставь все чёрные фигуры на свои места!')
add('board.setup_no', 'Не сюда. Подумай, где стоит эта фигура.')
add('board.setup_right', 'Ура! Все фигуры на своих местах!')

// words
add('words.yes', 'Да.')
add('words.no', 'Нет.')
add('words.check_q', 'Белому королю шах? Да или нет?')
add('words.nocheck', 'Нет, королю ничего не угрожает.')
add('words.check_no_wrong', 'Нет, тут шах! Смотри, кто нападает на короля.')
add('words.check_yes_wrong', 'Нет, тут королю не шах.')
add('words.whocheck', 'Кто объявил шах? Нажми на эту фигуру.')
add('words.whocheck_no', 'Эта фигура королю не угрожает. Ищи другую.')
add('words.escape', 'Королю шах! Спаси короля.')
add('words.escape_no', 'Так король остаётся под шахом. Попробуй ещё.')
add('words.escape_ok', 'Ура! Король спасён!')
add('words.castle_do', 'Сделай рокировку: подвинь короля на две клеточки к ладье.')
add('words.castle_no', 'Рокировка это когда король идёт на две клеточки к ладье.')
add('words.castle_right', 'Рокировка! Король и ладья поменялись местами.')
add('words.stronger', 'Какая фигура сильнее?')
add('words.t.capture', 'Одна фигура съела другую. Как это называется?')
add('words.t.capture_r', 'Верно! Это взятие.')
add('words.t.check', 'Королю нападают, и его надо спасать. Как это называется?')
add('words.t.check_r', 'Верно! Это шах.')
add('words.t.mate', 'Королю шах, и спастись нельзя. Как это называется?')
add('words.t.mate_r', 'Верно! Это мат. Игра закончена!')
add('words.t.stalemate', 'Королю не шах, но ходить нечем. Как это называется?')
add('words.t.stalemate_r', 'Верно! Это пат. Он заканчивается ничьей.')
add('words.t.castle', 'Король и ладья прыгают вместе. Как это называется?')
add('words.t.castle_r', 'Верно! Это рокировка.')
add('words.t.promo', 'Пешка дошла до конца доски и стала ферзём. Как это называется?')
add('words.t.promo_r', 'Верно! Это превращение.')
add('words.t.draw', 'Никто не победил. Как это называется?')
add('words.t.draw_r', 'Верно! Это ничья.')
add('words.t.game', 'Как называется одна игра в шахматы?')
add('words.t.game_r', 'Верно! Это партия.')
add('words.t.move', 'Один шаг фигуры в шахматах. Как он называется?')
add('words.t.move_r', 'Верно! Это ход.')
const OPT = { capture: 'Взятие', check: 'Шах', mate: 'Мат', stalemate: 'Пат', castle: 'Рокировка', promo: 'Превращение', draw: 'Ничья', game: 'Партия', move: 'Ход' }
for (const [k, w] of Object.entries(OPT)) {
  add(`words.opt.${k}`, `${w}.`)
  add(`words.opt_no.${k}`, `Нет, это не «${w.toLowerCase()}». Подумай ещё.`)
}

// puzzles
add('puz.mate1', 'Поставь мат в один ход! Чёрному королю некуда уйти.')
add('puz.mate_no', 'Пока это не мат: королю есть куда уйти. Попробуй ещё.')
add('puz.mate_right', 'Шах и мат! Отлично!')
add('puz.check', 'Поставь шах чёрному королю!')
add('puz.check_no', 'Это не шах. Фигура должна напасть на короля.')
add('puz.check_right', 'Шах! Молодец!')
add('puz.free', 'Съешь фигуру, которую никто не защищает!')
add('puz.free_no', 'Эту фигуру защищают, её съедят в ответ. Ищи другую.')
add('puz.free_right', 'Молодец! Эта фигура была без защиты.')
add('puz.fork', 'Найди ход, после которого конь нападает сразу на две фигуры! Это называется вилка.')
add('puz.fork_no', 'Пока конь нападает только на одну фигуру. Ищи вилку.')
add('puz.fork_right', 'Вилка! Конь напал сразу на две фигуры.')

const games = { ns: 'g.chess', lines: L }

export const VOICE_MODULES = [host, land, map, games]
