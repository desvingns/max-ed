// Task generators for the chess station. Pure logic (no DOM): every generator returns a plain
// descriptor that chess-kit.js knows how to show. Right answers are computed with the rules engine,
// so a generated task can never contradict the rules.
//
//   pick  task: a question with answer cards   { kind:'pick', title, say, stim, options:[{id, card, say, correct}], right }
//   board task: a question answered on a board { kind:'board', mode:'tap'|'tapAll'|'move', pieces, targets, ... }
//
// `say` / `right` / `wrongSay` are lists of voice-line keys (see chess-voice.js).
import * as E from './chess-engine.js'
import { PIECE, PIECE_TYPES } from './chess-pieces.js'

export const LEVEL_MAX = 2

// ---------------------------------------------------------------- helpers
const rnd = () => Math.random()
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1))
const pick = a => a[Math.floor(rnd() * a.length)]
const shuffle = a => {
  const t = a.slice()
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[t[i], t[j]] = [t[j], t[i]]
  }
  return t
}
const sample = (a, n) => shuffle(a).slice(0, n)
const up = t => t.toUpperCase()
const cap = s => s[0].toUpperCase() + s.slice(1)
const sqOf = E.sqOf
const nm = E.sqName
const dist = (a, b) => Math.max(Math.abs((a & 7) - (b & 7)), Math.abs((a >> 3) - (b >> 3)))
const posOf = (pieces, turn = 'w') => E.positionFromIndex(pieces, turn)
const tryFor = (n, fn) => {
  for (let i = 0; i < n; i++) {
    const r = fn()
    if (r) return r
  }
  return null
}
const allSquares = () => Array.from({ length: 64 }, (_, i) => i)
const pieceCard = (t, color = 'w', extra = {}) => ({ piece: color === 'w' ? up(t) : t, ...extra })
const pieceOptions = (types, correct, o = {}) =>
  shuffle(types).map(t => ({
    id: t,
    card: pieceCard(t, o.color ?? (o.mixed ? pick(['w', 'b']) : 'w'), { name: o.names !== false }),
    say: o.read ? `name.${t}` : null,
    correct: t === correct,
    wrongSay: o.wrongSay ? [`names.this.${t}`] : null,
  }))

/** Free squares for scenery, never on rank 1/8 for pawns */
function scatter(pieces, n, { avoid = [], colors = ['w'], types = ['p', 'n', 'b'], near = null } = {}) {
  const used = new Set([...Object.keys(pieces).map(Number), ...avoid])
  let placed = 0
  for (let i = 0; i < 80 && placed < n; i++) {
    const s = near != null && rnd() < 0.7 ? sqOf(Math.max(0, Math.min(7, (near & 7) + ri(-3, 3))), Math.max(0, Math.min(7, (near >> 3) + ri(-3, 3)))) : ri(0, 63)
    if (used.has(s)) continue
    const t = pick(types)
    if (t === 'p' && ((s >> 3) === 0 || (s >> 3) === 7)) continue
    pieces[s] = pick(colors) === 'w' ? up(t) : t
    used.add(s)
    placed++
  }
  return pieces
}

const range = n => Array.from({ length: n }, (_, i) => i)

// ================================================================ NAMES
const FACTS = [
  { id: 'main', q: 'fact.main', a: 'k', right: 'fact.main_r', pool: ['q', 'r', 'p', 'b', 'n'] },
  { id: 'strong', q: 'fact.strong', a: 'q', right: 'fact.strong_r', pool: ['r', 'p', 'b', 'n', 'k'] },
  { id: 'tower', q: 'fact.tower', a: 'r', right: 'fact.tower_r', pool: ['q', 'p', 'b', 'k', 'n'] },
  { id: 'horse', q: 'fact.horse', a: 'n', right: 'fact.horse_r', pool: ['q', 'p', 'b', 'k', 'r'] },
  { id: 'lshape', q: 'fact.lshape', a: 'n', right: 'fact.lshape_r', pool: ['q', 'p', 'b', 'k', 'r'] },
  { id: 'diag', q: 'fact.diag', a: 'b', right: 'fact.diag_r', pool: ['r', 'p', 'k', 'n'] },
  { id: 'cross', q: 'fact.cross', a: 'k', right: 'fact.cross_r', pool: ['q', 'r', 'b', 'n', 'p'] },
  { id: 'many', q: 'fact.many', a: 'p', right: 'fact.many_r', pool: ['q', 'r', 'b', 'n', 'k'] },
  { id: 'hat', q: 'fact.hat', a: 'b', right: 'fact.hat_r', pool: ['q', 'r', 'p', 'k', 'n'] },
  { id: 'jump', q: 'fact.jump', a: 'n', right: 'fact.jump_r', pool: ['q', 'r', 'p', 'k', 'b'] },
  { id: 'queenmove', q: 'fact.queenmove', a: 'q', right: 'fact.queenmove_r', pool: ['r', 'p', 'k', 'n', 'b'] },
  { id: 'forward', q: 'fact.forward', a: 'p', right: 'fact.forward_r', pool: ['q', 'r', 'b', 'n'] },
  { id: 'rails', q: 'fact.rails', a: 'r', right: 'fact.rails_r', pool: ['q', 'b', 'k', 'n', 'p'] },
]
const NUM_FACTS = [
  { id: 'n_k', q: 'fact.n_k', a: 1, right: 'fact.n_k_r', pool: [2, 8, 4], piece: 'K' },
  { id: 'n_q', q: 'fact.n_q', a: 1, right: 'fact.n_q_r', pool: [2, 8, 3], piece: 'Q' },
  { id: 'n_r', q: 'fact.n_r', a: 2, right: 'fact.n_r_r', pool: [1, 8, 4], piece: 'R' },
  { id: 'n_b', q: 'fact.n_b', a: 2, right: 'fact.n_b_r', pool: [1, 8, 4], piece: 'B' },
  { id: 'n_n', q: 'fact.n_n', a: 2, right: 'fact.n_n_r', pool: [1, 8, 4], piece: 'N' },
  { id: 'n_p', q: 'fact.n_p', a: 8, right: 'fact.n_p_r', pool: [2, 4, 16], piece: 'P' },
  { id: 'n_all', q: 'fact.n_all', a: 16, right: 'fact.n_all_r', pool: [8, 32, 64] },
]
export const NUM_LINES = [1, 2, 3, 4, 8, 16, 32, 64]

function nameIt(L) {
  const t = pick(L === 0 ? ['k', 'q', 'r', 'p', 'n'] : PIECE_TYPES)
  const others = sample(
    PIECE_TYPES.filter(x => x !== t),
    L === 0 ? 2 : 3,
  )
  return {
    kind: 'pick',
    id: 'nameIt',
    skill: `chess:name:${t}`,
    title: 'Кто это?',
    say: ['names.who'],
    stim: { piece: pick(['w', 'b']) === 'w' ? up(t) : t, face: true },
    options: shuffle([t, ...others]).map(x => ({ id: x, card: { text: cap(PIECE[x].ru) }, say: `name.${x}`, correct: x === t, wrongSay: [`names.this.${x}`] })),
    right: [`names.right.${t}`],
    read: true,
  }
}

function findIt(L) {
  const t = pick(PIECE_TYPES)
  const n = L === 0 ? 3 : L === 1 ? 4 : 5
  const types = sample(
    PIECE_TYPES.filter(x => x !== t),
    n - 1,
  )
  return {
    kind: 'pick',
    id: 'findIt',
    skill: `chess:name:${t}`,
    title: `Покажи: ${PIECE[t].acc}`,
    say: [`names.find.${t}`],
    stim: null,
    options: pieceOptions([t, ...types], t, { mixed: L >= 1, wrongSay: true }),
    right: [`names.right.${t}`],
    big: true,
  }
}

function colorIt() {
  const t = pick(PIECE_TYPES)
  const c = pick(['w', 'b'])
  return {
    kind: 'pick',
    id: 'colorIt',
    skill: 'chess:color',
    title: 'Какого цвета эта фигура?',
    say: ['names.color'],
    stim: { piece: c === 'w' ? up(t) : t },
    options: [
      { id: 'w', card: { swatch: '#FFF8E8', label: 'Белая' }, say: 'names.white', correct: c === 'w' },
      { id: 'b', card: { swatch: '#6552A3', label: 'Чёрная' }, say: 'names.black', correct: c === 'b' },
    ],
    right: [c === 'w' ? 'names.color_white' : 'names.color_black'],
    read: true,
  }
}

function factQ(L) {
  const list = L === 0 ? FACTS.filter(f => ['main', 'strong', 'tower', 'horse', 'many'].includes(f.id)) : FACTS
  const f = pick(list)
  const wrong = sample(f.pool, L === 0 ? 2 : 3)
  return {
    kind: 'pick',
    id: `fact:${f.id}`,
    skill: `chess:fact:${f.a}`,
    title: '',
    say: [f.q],
    stim: null,
    options: pieceOptions([f.a, ...wrong], f.a, { mixed: true }),
    right: [f.right],
    big: true,
  }
}

function numFact() {
  const f = pick(NUM_FACTS)
  const wrong = f.pool.filter(x => x !== f.a).slice(0, 2)
  return {
    kind: 'pick',
    id: `numfact:${f.id}`,
    skill: 'chess:count',
    title: '',
    say: [f.q],
    stim: f.piece ? { piece: f.piece } : null,
    options: shuffle([f.a, ...wrong]).map(n => ({ id: String(n), card: { text: String(n) }, say: `num.${n}`, correct: n === f.a })),
    right: [f.right],
    read: true,
  }
}

function whoFirst() {
  return {
    kind: 'pick',
    id: 'whoFirst',
    skill: 'chess:first',
    title: 'Кто ходит первым?',
    say: ['fact.first'],
    stim: null,
    options: [
      { id: 'w', card: { piece: 'K', label: 'Белые' }, say: 'names.whites', correct: true },
      { id: 'b', card: { piece: 'k', label: 'Чёрные' }, say: 'names.blacks', correct: false },
    ],
    right: ['fact.first_r'],
    read: true,
  }
}

function startPieces() {
  const p = E.startPosition()
  const out = {}
  p.b.forEach((ch, i) => ch && (out[i] = ch))
  return out
}

function boardFindPiece() {
  const t = pick(PIECE_TYPES)
  const c = pick(['w', 'b'])
  const pieces = startPieces()
  const ch = c === 'w' ? up(t) : t
  const targets = Object.entries(pieces)
    .filter(([, v]) => v === ch)
    .map(([k]) => Number(k))
  return {
    kind: 'board',
    id: 'boardFindPiece',
    skill: `chess:name:${t}`,
    title: `Найди ${c === 'w' ? 'белую' : 'чёрную'} фигуру: ${PIECE[t].ru}`,
    say: [`names.bfind.${c}${t}`],
    pieces,
    labels: 'none',
    mode: 'tap',
    targets,
    wrongAt: sq => (pieces[sq] ? [`names.this.${E.typeOf(pieces[sq])}`] : null),
    right: [`names.right.${t}`],
  }
}

function boardFindAll() {
  const t = pick(['r', 'b', 'n', 'k', 'q'])
  const c = pick(['w', 'b'])
  const pieces = startPieces()
  const ch = c === 'w' ? up(t) : t
  const targets = Object.entries(pieces)
    .filter(([, v]) => v === ch)
    .map(([k]) => Number(k))
  return {
    kind: 'board',
    id: 'boardFindAll',
    skill: `chess:name:${t}`,
    title: `Найди всех ${c === 'w' ? 'белых' : 'чёрных'}: ${PIECE[t].gen}`.replace(/: .*/, `: ${{ r: 'ладей', b: 'слонов', n: 'коней', k: 'королей', q: 'ферзей' }[t]}`),
    say: [`names.ball.${c}${t}`],
    pieces,
    labels: 'none',
    mode: 'tapAll',
    targets,
    wrongAt: sq => (pieces[sq] ? [`names.this.${E.typeOf(pieces[sq])}`] : null),
    right: ['names.all_right'],
  }
}

export const NAMES_GENS = [
  { id: 'findIt', w: 4, min: 0, make: findIt },
  { id: 'nameIt', w: 3, min: 0, make: nameIt },
  { id: 'factQ', w: 3, min: 0, make: factQ },
  { id: 'colorIt', w: 2, min: 1, make: colorIt },
  { id: 'numFact', w: 2, min: 1, make: numFact },
  { id: 'whoFirst', w: 1, min: 1, make: whoFirst },
  { id: 'boardFindPiece', w: 2, min: 1, make: boardFindPiece },
  { id: 'boardFindAll', w: 2, min: 2, make: boardFindAll },
]

// ================================================================ MOVES
function startFor(t, L) {
  if (t === 'p') return sqOf(ri(0, 7), ri(1, 4))
  if (t === 'k') return sqOf(ri(1, 6), ri(1, 6))
  if (t === 'n') return sqOf(ri(1, 6), ri(1, 6))
  return sqOf(ri(0, 7), ri(0, 7))
}

function withBlockers(t, from, n, extra = {}) {
  const pieces = { [from]: up(t) }
  scatter(pieces, n, { avoid: [from, ...(extra.avoid ?? [])], colors: extra.colors ?? ['w'], types: ['p', 'p', 'n', 'b'], near: from })
  return pieces
}

function moveWhere(t, L) {
  return tryFor(200, () => {
    const from = startFor(t, L)
    const n = L === 0 ? 0 : L === 1 ? ri(2, 3) : ri(3, 5)
    const pieces = withBlockers(t, from, n)
    if (L >= 1 && rnd() < 0.5) scatter(pieces, 1, { colors: ['b'], types: ['p', 'n'], near: from })
    const targets = E.reachable(posOf(pieces), from)
    if (targets.length < (t === 'p' ? 1 : 2)) return null
    return {
      kind: 'board',
      id: `moveWhere:${t}`,
      skill: `chess:move:${t}`,
      title: `Куда может пойти ${PIECE[t].ru}?`,
      say: [`moves.where.${t}`],
      pieces,
      labels: 'none',
      mode: 'tap',
      only: from,
      targets,
      wrongSay: [`moves.no.${t}`],
      hintAfter: 2,
      hintSquares: targets,
      right: [`moves.right.${t}`],
    }
  })
}

function reach2(t, pieces, from) {
  const r1 = new Set(E.reachable(posOf(pieces), from))
  const two = new Set()
  for (const mid of r1) {
    if (pieces[mid]) continue
    const p2 = { ...pieces }
    delete p2[from]
    p2[mid] = pieces[from]
    for (const s of E.reachable(posOf(p2), mid)) if (!r1.has(s) && s !== from && !pieces[s]) two.add(s)
  }
  return { r1, two }
}

function moveStar(t, L) {
  return tryFor(300, () => {
    const from = startFor(t, L)
    const n = L === 0 ? 0 : L === 1 ? ri(2, 3) : ri(3, 5)
    const pieces = withBlockers(t, from, n)
    const targets = E.reachable(posOf(pieces), from).filter(s => !pieces[s])
    if (targets.length < 2) return null
    const twoStep = L >= 2 && t !== 'p' && rnd() < 0.4
    if (twoStep) {
      const { two } = reach2(t, pieces, from)
      const list = [...two]
      if (!list.length) return null
      const star = pick(list)
      return {
        kind: 'board',
        id: `moveStar2:${t}`,
        skill: `chess:move:${t}`,
        title: `Отведи ${PIECE[t].acc} к звёздочке за два хода`,
        say: [`moves.star2.${t}`],
        pieces,
        labels: 'none',
        mode: 'move',
        only: from,
        stars: [star],
        targets: [star],
        multi: { max: 2 },
        dotsOnSelect: false,
        wrongSay: [`moves.no.${t}`],
        hintAfter: 3,
        right: [`moves.star_right`],
      }
    }
    const star = pick(targets)
    return {
      kind: 'board',
      id: `moveStar:${t}`,
      skill: `chess:move:${t}`,
      title: `Отведи ${PIECE[t].acc} к звёздочке`,
      say: [`moves.star.${t}`],
      pieces,
      labels: 'none',
      mode: 'move',
      only: from,
      stars: [star],
      targets: [star],
      dotsOnSelect: L === 0,
      wrongSay: [`moves.no.${t}`],
      hintAfter: 2,
      right: [`moves.star_right`],
    }
  })
}

function moveAll(t, L) {
  if (t === 'p') return null
  return tryFor(400, () => {
    const from = t === 'k' || t === 'n' ? (rnd() < 0.6 ? sqOf(pick([0, 7, ri(0, 7)]), pick([0, 7, ri(0, 7)])) : startFor(t, L)) : startFor(t, L)
    const n = t === 'k' || t === 'n' ? ri(0, 2) : ri(2, 5)
    const pieces = withBlockers(t, from, n)
    const targets = E.reachable(posOf(pieces), from)
    const max = t === 'q' ? 9 : 8
    if (targets.length < 2 || targets.length > max) return null
    return {
      kind: 'board',
      id: `moveAll:${t}`,
      skill: `chess:move:${t}`,
      title: `Найди все клеточки, куда пойдёт ${PIECE[t].ru}`,
      say: [`moves.all.${t}`],
      pieces,
      labels: 'none',
      mode: 'tapAll',
      only: from,
      targets,
      wrongSay: [`moves.no.${t}`],
      hintAfter: 3,
      hintSquares: targets,
      right: [`moves.all_right`],
    }
  })
}

function moveCapture(t, L) {
  return tryFor(400, () => {
    const from = startFor(t, L)
    const pieces = withBlockers(t, from, L === 0 ? 0 : ri(1, 3))
    // enemy pieces on free squares; then look at what is really capturable on the finished board
    const free = allSquares().filter(s => !pieces[s] && s !== from)
    const board = { ...pieces }
    for (const s of sample(free, ri(3, 5))) board[s] = pick(['p', 'n', 'b'])
    for (const [s, ch] of Object.entries(board)) if (ch === 'p' && ((s >> 3) === 0 || (s >> 3) === 7)) board[s] = 'n'
    const p = posOf(board)
    const reach = new Set(E.reachable(p, from))
    const enemies = Object.keys(board).map(Number).filter(s => E.colorOf(board[s]) === 'b')
    const targets = enemies.filter(s => reach.has(s))
    const safe = enemies.filter(s => !reach.has(s))
    if (targets.length < 1 || targets.length > 2 || safe.length < 2) return null
    return {
      kind: 'board',
      id: `moveCapture:${t}`,
      skill: `chess:capture:${t}`,
      title: `Какую фигуру может съесть ${PIECE[t].ru}?`,
      say: [`moves.capture.${t}`],
      pieces: board,
      labels: 'none',
      mode: 'tap',
      onlyEnemy: true,
      only: from,
      targets,
      wrongSay: [`moves.cant.${t}`],
      hintAfter: 2,
      right: [`moves.capture_right`],
    }
  })
}

function moveEat(t, L) {
  const task = moveCapture(t, L)
  if (!task) return null
  return { ...task, id: `moveEat:${t}`, mode: 'move', title: `Пусть ${PIECE[t].ru} съест чёрную фигуру`, say: [`moves.eat.${t}`], dotsOnSelect: L === 0, onlyEnemy: false, right: ['moves.eat_right'] }
}

const PATTERN_START = [sqOf(3, 3), sqOf(4, 3), sqOf(3, 4), sqOf(4, 4)]
function movePattern(t, L) {
  const start = t === 'p' ? sqOf(ri(2, 5), 1) : pick(PATTERN_START)
  const others = sample(
    PIECE_TYPES.filter(x => x !== t),
    2,
  )
  const cards = shuffle([t, ...others]).map(x => {
    const s = x === 'p' ? (t === 'p' ? start : start) : start
    const pieces = { [s]: up(x) }
    const dots = E.reachable(posOf(pieces), s)
    return { id: x, card: { thumb: { pieces: {}, dots, stars: [s] } }, say: null, correct: x === t }
  })
  return {
    kind: 'pick',
    id: `movePattern:${t}`,
    skill: `chess:move:${t}`,
    title: `Как ходит ${PIECE[t].ru}?`,
    say: [`moves.how.${t}`],
    stim: { piece: up(t), face: true },
    options: cards,
    right: [`moves.right.${t}`],
    big: true,
    thumbs: true,
  }
}

function moveCan(t, L) {
  return tryFor(200, () => {
    const from = t === 'p' ? sqOf(ri(0, 7), ri(1, 4)) : startFor(t, L)
    const pieces = withBlockers(t, from, L === 0 ? 0 : ri(1, 3))
    const reach = new Set(E.reachable(posOf(pieces), from))
    const want = rnd() < 0.5
    const pool = allSquares().filter(s => s !== from && !pieces[s] && reach.has(s) === want && dist(s, from) <= (want ? 8 : 3))
    if (!pool.length) return null
    const target = pick(pool)
    return {
      kind: 'pick',
      id: `moveCan:${t}`,
      skill: `chess:move:${t}`,
      title: `Может ли ${PIECE[t].ru} пойти на клеточку со звёздочкой?`,
      say: [`moves.can.${t}`],
      stim: { board: { pieces, stars: [target], labels: 'none' } },
      options: [
        { id: 'yes', card: { icon: '✅', label: 'Да' }, say: 'words.yes', correct: want, wrongSay: [`moves.no_star.${t}`], showDots: from },
        { id: 'no', card: { icon: '❌', label: 'Нет' }, say: 'words.no', correct: !want, wrongSay: ['moves.yes_star'], showDots: from },
      ],
      dotsFrom: from,
      right: [want ? 'moves.yes_right' : `moves.no.${t}`],
      layout: 'board',
      read: false,
    }
  })
}

function pawnCount() {
  const start = rnd() < 0.5
  const from = start ? sqOf(ri(0, 7), 1) : sqOf(ri(0, 7), ri(2, 5))
  return {
    kind: 'pick',
    id: 'pawnCount',
    skill: 'chess:move:p',
    title: 'Сколько клеточек может пройти эта пешка?',
    say: ['moves.pawn.count'],
    stim: { board: { pieces: { [from]: 'P' }, marks: [from], labels: 'none' } },
    options: [
      { id: '1', card: { text: '1' }, say: 'num.1', correct: !start },
      { id: '2', card: { text: '2' }, say: 'num.2', correct: start },
    ],
    dotsFrom: from,
    right: [start ? 'moves.pawn.two_start' : 'moves.pawn.one_more'],
    layout: 'board',
    read: true,
  }
}

function pawnCapture() {
  return tryFor(100, () => {
    const from = sqOf(ri(1, 6), ri(1, 5))
    const f = from & 7
    const r = from >> 3
    const pieces = { [from]: 'P' }
    const diag = [f - 1, f + 1].filter(x => x >= 0 && x <= 7).map(x => sqOf(x, r + 1))
    const front = sqOf(f, r + 1)
    const good = sample(diag, ri(1, diag.length))
    for (const s of good) pieces[s] = pick(['p', 'n', 'b'])
    pieces[front] = 'p'
    scatter(pieces, ri(1, 2), { avoid: [from, front, ...diag], colors: ['b'], types: ['p', 'n'], near: from })
    return {
      kind: 'board',
      id: 'pawnCapture',
      skill: 'chess:capture:p',
      title: 'Пешка бьёт наискосок. Съешь чёрную фигуру!',
      say: ['moves.pawn.capture'],
      pieces,
      labels: 'none',
      mode: 'move',
      only: from,
      targets: good,
      dotsOnSelect: false,
      wrongAt: sq => (sq === front ? ['moves.pawn.front_no'] : null),
      wrongSay: ['moves.no.p'],
      hintAfter: 2,
      right: ['moves.pawn.capture_right'],
    }
  })
}

function pawnPromote(L) {
  const f = ri(0, 7)
  const from = sqOf(f, L === 0 ? 5 : 4)
  const pieces = { [from]: 'P' }
  if (L >= 1) scatter(pieces, 2, { avoid: [from, sqOf(f, 5), sqOf(f, 6), sqOf(f, 7)], colors: ['w'], types: ['p'], near: from })
  return {
    kind: 'board',
    id: 'pawnPromote',
    skill: 'chess:promote',
    title: 'Доведи пешку до конца доски!',
    say: ['moves.promote'],
    pieces,
    labels: 'none',
    mode: 'move',
    only: from,
    targets: [sqOf(f, 7)],
    multi: { max: 4 },
    promoChoice: true,
    dotsOnSelect: L === 0,
    wrongSay: ['moves.no.p'],
    hintAfter: 2,
    right: ['moves.promote_right'],
  }
}

function knightJump(L) {
  return tryFor(200, () => {
    const from = sqOf(ri(2, 5), ri(2, 5))
    const pieces = { [from]: 'N' }
    for (const s of E.attacksFrom(posOf({ [from]: 'N' }), from)) if (rnd() < 0.3) pieces[s] = 'P'
    // ring of neighbours the knight has to jump over
    for (const s of E.attacksFrom(posOf({ [from]: 'K' }), from)) pieces[s] = pick(['P', 'p'])
    const targets = E.reachable(posOf(pieces), from).filter(s => !pieces[s])
    if (targets.length < 2) return null
    const star = pick(targets)
    return {
      kind: 'board',
      id: 'knightJump',
      skill: 'chess:move:n',
      title: 'Конь умеет прыгать! Отведи его к звёздочке',
      say: ['moves.jump'],
      pieces,
      labels: 'none',
      mode: 'move',
      only: from,
      stars: [star],
      targets: [star],
      dotsOnSelect: L === 0,
      wrongSay: ['moves.no.n'],
      hintAfter: 2,
      right: ['moves.jump_right'],
    }
  })
}

const MOVE_GENS_ALL = [
  { id: 'where', w: 4, min: 0, make: moveWhere },
  { id: 'star', w: 4, min: 0, make: moveStar },
  { id: 'pattern', w: 2, min: 0, make: movePattern },
  { id: 'can', w: 2, min: 0, make: moveCan },
  { id: 'all', w: 2, min: 1, make: moveAll },
  { id: 'capture', w: 2, min: 1, make: moveCapture },
  { id: 'eat', w: 2, min: 1, make: moveEat },
]
const MOVE_GENS_PIECE = {
  p: [
    { id: 'pawnCount', w: 3, min: 0, make: () => pawnCount() },
    { id: 'pawnCapture', w: 3, min: 0, make: () => pawnCapture() },
    { id: 'pawnPromote', w: 2, min: 0, make: L => pawnPromote(L) },
  ],
  n: [{ id: 'knightJump', w: 3, min: 0, make: L => knightJump(L) }],
}

/** Generators for the "how do pieces move" game. `t` = piece type or 'all'. */
export function movesGens(t) {
  if (t === 'all') {
    return [
      ...MOVE_GENS_ALL.map(g => ({ ...g, make: L => g.make(pick(g.id === 'all' ? PIECE_TYPES.filter(x => x !== 'p') : PIECE_TYPES), L) })),
      ...MOVE_GENS_PIECE.p.map(g => ({ ...g, w: 1 })),
      ...MOVE_GENS_PIECE.n.map(g => ({ ...g, w: 1 })),
    ]
  }
  const own = (MOVE_GENS_PIECE[t] ?? []).map(g => ({ ...g }))
  const common = MOVE_GENS_ALL.filter(g => !(t === 'p' && g.id === 'all')).map(g => ({ ...g, make: L => g.make(t, L) }))
  return [...common, ...own]
}

// ================================================================ BOARD (squares, files, ranks)
const LIGHT_DARK = q => [
  { id: 'light', card: { swatch: '#FFF1CF', label: 'Светлая' }, say: 'board.light', correct: q === 'light' },
  { id: 'dark', card: { swatch: '#8FD3A8', label: 'Тёмная' }, say: 'board.dark', correct: q === 'dark' },
]

function squareColor() {
  const s = ri(0, 63)
  const light = E.isLight(s)
  return {
    kind: 'pick',
    id: 'squareColor',
    skill: 'chess:square',
    title: 'Какого цвета эта клеточка?',
    say: ['board.color_q'],
    stim: { board: { pieces: {}, marks: [s], labels: 'edge' } },
    options: LIGHT_DARK(light ? 'light' : 'dark'),
    right: [light ? 'board.color_light' : 'board.color_dark'],
    layout: 'board',
    read: true,
  }
}

function findSquare(L) {
  const s = ri(0, 63)
  return {
    kind: 'board',
    id: 'findSquare',
    skill: 'chess:square',
    title: `Найди клеточку ${nm(s)}`,
    say: ['board.find', `sq.${nm(s)}`],
    pieces: {},
    labels: L >= 2 ? 'none' : 'edge',
    mode: 'tap',
    targets: [s],
    wrongAt: sq => ['board.this', `sq.${nm(sq)}`],
    hintAfter: 3,
    hintSquares: [s],
    right: ['board.this', `sq.${nm(s)}`],
    speakSquares: true,
  }
}

function nameSquare(L) {
  const s = ri(0, 63)
  const wrong = new Set()
  while (wrong.size < 2) {
    const w = ri(0, 63)
    if (w !== s && (L >= 1 ? (w & 7) === (s & 7) || (w >> 3) === (s >> 3) || dist(w, s) === 1 : true)) wrong.add(w)
  }
  return {
    kind: 'pick',
    id: 'nameSquare',
    skill: 'chess:square',
    title: 'Как называется эта клеточка?',
    say: ['board.name_q'],
    stim: { board: { pieces: {}, marks: [s], labels: L === 0 ? 'edge' : 'none' } },
    options: shuffle([s, ...wrong]).map(x => ({ id: String(x), card: { text: nm(x) }, say: `sq.${nm(x)}`, correct: x === s })),
    right: ['board.this', `sq.${nm(s)}`],
    layout: 'board',
    read: true,
  }
}

function findFile() {
  const f = ri(0, 7)
  return {
    kind: 'board',
    id: 'findFile',
    skill: 'chess:file',
    title: `Найди вертикаль «${E.FILES[f]}»`,
    say: ['board.findfile', `file.${E.FILES[f]}`],
    pieces: {},
    labels: 'edge',
    mode: 'tap',
    targets: range(8).map(r => sqOf(f, r)),
    wrongSay: ['board.file_hint'],
    hintAfter: 2,
    hintSquares: range(8).map(r => sqOf(f, r)),
    right: ['board.file_right'],
  }
}

function findRank() {
  const r = ri(0, 7)
  return {
    kind: 'board',
    id: 'findRank',
    skill: 'chess:rank',
    title: `Найди горизонталь ${r + 1}`,
    say: ['board.findrank', `rank.${r + 1}`],
    pieces: {},
    labels: 'edge',
    mode: 'tap',
    targets: range(8).map(f => sqOf(f, r)),
    wrongSay: ['board.rank_hint'],
    hintAfter: 2,
    hintSquares: range(8).map(f => sqOf(f, r)),
    right: ['board.rank_right'],
  }
}

function lineName(L) {
  const kind = pick(['vertical', 'horizontal', 'diagonal'])
  let line = []
  if (kind === 'vertical') {
    const f = ri(0, 7)
    line = range(8).map(r => sqOf(f, r))
  } else if (kind === 'horizontal') {
    const r = ri(0, 7)
    line = range(8).map(f => sqOf(f, r))
  } else {
    const down = rnd() < 0.5
    const off = ri(-3, 3)
    for (let i = 0; i < 8; i++) {
      const f = i
      const r = down ? 7 - i + off : i + off
      if (r >= 0 && r < 8) line.push(sqOf(f, r))
    }
  }
  return {
    kind: 'pick',
    id: 'lineName',
    skill: `chess:line:${kind}`,
    title: 'Как называется эта линия?',
    say: ['board.line_q'],
    stim: { board: { pieces: {}, lineMarks: line, labels: 'none' } },
    options: [
      { id: 'vertical', card: { lineIcon: 'vertical', label: 'Вертикаль' }, say: 'board.vertical', correct: kind === 'vertical' },
      { id: 'horizontal', card: { lineIcon: 'horizontal', label: 'Горизонталь' }, say: 'board.horizontal', correct: kind === 'horizontal' },
      { id: 'diagonal', card: { lineIcon: 'diagonal', label: 'Диагональ' }, say: 'board.diagonal', correct: kind === 'diagonal' },
    ],
    right: [`board.line_${kind}`],
    layout: 'board',
    read: true,
  }
}

function cornerColor() {
  return {
    kind: 'pick',
    id: 'cornerColor',
    skill: 'chess:square',
    title: 'Какая клеточка в правом нижнем углу?',
    say: ['board.corner_q'],
    stim: { board: { pieces: {}, marks: [sqOf(7, 0)], labels: 'edge' } },
    options: LIGHT_DARK('light'),
    right: ['board.corner_right'],
    layout: 'board',
    read: true,
  }
}

function startSquare() {
  const t = pick(PIECE_TYPES)
  const c = pick(['w', 'b'])
  const back = c === 'w' ? 0 : 7
  const files = { r: [0, 7], n: [1, 6], b: [2, 5], q: [3], k: [4], p: range(8) }[t]
  const targets = files.map(f => sqOf(f, t === 'p' ? (c === 'w' ? 1 : 6) : back))
  return {
    kind: 'board',
    id: 'startSquare',
    skill: `chess:start:${t}`,
    title: `Где в начале игры стоит ${c === 'w' ? 'белая' : 'чёрная'} фигура: ${PIECE[t].ru}?`,
    say: [`board.start.${c}${t}`],
    pieces: {},
    labels: 'edge',
    mode: 'tap',
    targets,
    wrongSay: ['board.start_no'],
    hintAfter: 3,
    hintSquares: targets,
    right: [`board.start_right`],
  }
}

function countCells() {
  const q = pick(['all', 'row'])
  return q === 'all'
    ? {
        kind: 'pick',
        id: 'countCells',
        skill: 'chess:count',
        title: 'Сколько всего клеточек на доске?',
        say: ['board.count_all'],
        stim: { board: { pieces: {}, labels: 'none' } },
        options: [16, 32, 64].map(n => ({ id: String(n), card: { text: String(n) }, say: `num.${n}`, correct: n === 64 })),
        right: ['board.count_all_r'],
        layout: 'board',
        read: true,
      }
    : {
        kind: 'pick',
        id: 'countRow',
        skill: 'chess:count',
        title: 'Сколько клеточек в одном ряду?',
        say: ['board.count_row'],
        stim: { board: { pieces: {}, lineMarks: range(8).map(f => sqOf(f, 3)), labels: 'none' } },
        options: [4, 8, 16].map(n => ({ id: String(n), card: { text: String(n) }, say: `num.${n}`, correct: n === 8 })),
        right: ['board.count_row_r'],
        layout: 'board',
        read: true,
      }
}

function setupRank(L) {
  const sets = [
    { key: 'rooks', pieces: [['R', 0], ['R', 7]] },
    { key: 'knights', pieces: [['N', 1], ['N', 6], ['R', 0], ['R', 7]] },
    { key: 'all', pieces: [['R', 0], ['N', 1], ['B', 2], ['Q', 3], ['K', 4], ['B', 5], ['N', 6], ['R', 7]] },
  ]
  const set = sets[Math.min(2, L)]
  const white = rnd() < 0.5
  const conv = c => (white ? c : c.toLowerCase())
  const rank = white ? 0 : 7
  return {
    kind: 'board',
    id: 'setupRank',
    skill: 'chess:setup',
    title: 'Расставь фигуры по местам',
    say: [`board.setup.${set.key}${white ? '' : '_b'}`],
    pieces: {},
    labels: 'edge',
    mode: 'place',
    tray: shuffle(set.pieces).map(([ch, f]) => ({ ch: conv(ch), sq: sqOf(f, rank) })),
    hintTargets: L === 0,
    wrongSay: ['board.setup_no'],
    right: ['board.setup_right'],
  }
}

export const BOARD_GENS = [
  { id: 'squareColor', w: 3, min: 0, make: squareColor },
  { id: 'findSquare', w: 4, min: 0, make: findSquare },
  { id: 'nameSquare', w: 3, min: 0, make: nameSquare },
  { id: 'findFile', w: 2, min: 0, make: findFile },
  { id: 'findRank', w: 2, min: 0, make: findRank },
  { id: 'lineName', w: 3, min: 0, make: lineName },
  { id: 'cornerColor', w: 1, min: 1, make: cornerColor },
  { id: 'startSquare', w: 3, min: 1, make: startSquare },
  { id: 'countCells', w: 1, min: 0, make: countCells },
  { id: 'setupRank', w: 2, min: 0, make: setupRank },
]

// ================================================================ WORDS (check, mate, ...)
/** random legal-looking position with the white king, one black attacker candidate and the black king */
function checkPosition(L, wantCheck) {
  return tryFor(400, () => {
    const wk = ri(0, 63)
    let bk = ri(0, 63)
    if (dist(wk, bk) < 3) return null
    const t = pick(L === 0 ? ['q', 'r', 'b'] : ['q', 'r', 'b', 'n'])
    let a = ri(0, 63)
    if ([wk, bk].includes(a)) return null
    const pieces = { [wk]: 'K', [bk]: 'k', [a]: t }
    if (L >= 1) scatter(pieces, ri(1, 2), { avoid: [], colors: ['b', 'w'], types: ['p'], near: wk })
    const p = posOf(pieces, 'w')
    if (E.inCheck(p, 'b')) return null
    const chk = E.inCheck(p, 'w')
    if (chk !== wantCheck) return null
    return { pieces, wk, attacker: chk ? E.attackersOf(p, wk, 'b')[0] : null, t }
  })
}

function isCheck(L) {
  const want = rnd() < 0.5
  const c = checkPosition(L, want)
  if (!c) return null
  const kingSquare = c.wk
  return {
    kind: 'pick',
    id: 'isCheck',
    skill: 'chess:check',
    title: 'Белому королю шах?',
    say: ['words.check_q'],
    stim: { board: { pieces: c.pieces, marks: [kingSquare], labels: 'none' } },
    options: [
      { id: 'yes', card: { icon: '✅', label: 'Да' }, say: 'words.yes', correct: want, wrongSay: want ? ['words.check_no_wrong'] : ['words.check_yes_wrong'] },
      { id: 'no', card: { icon: '❌', label: 'Нет' }, say: 'words.no', correct: !want, wrongSay: want ? ['words.check_no_wrong'] : ['words.check_yes_wrong'] },
    ],
    right: [want ? `words.check_by.${E.typeOf(c.pieces[c.attacker])}` : 'words.nocheck'],
    revealAttack: want ? { from: c.attacker, to: kingSquare } : null,
    layout: 'board',
    read: false,
  }
}

function whoChecks(L) {
  return tryFor(300, () => {
    const c = checkPosition(Math.max(1, L), true)
    if (!c) return null
    const pieces = { ...c.pieces }
    // decoys: black pieces that do not give check
    scatter(pieces, 2, { colors: ['b'], types: ['n', 'b', 'p'], near: c.wk })
    const p = posOf(pieces, 'w')
    const atk = E.attackersOf(p, c.wk, 'b')
    if (atk.length !== 1 || E.inCheck(p, 'b')) return null
    return {
      kind: 'board',
      id: 'whoChecks',
      skill: 'chess:check',
      title: 'Кто объявил шах? Нажми на эту фигуру',
      say: ['words.whocheck'],
      pieces,
      labels: 'none',
      mode: 'tap',
      targets: atk,
      marks: [c.wk],
      wrongSay: ['words.whocheck_no'],
      hintAfter: 2,
      hintSquares: atk,
      right: ['words.check_by.' + E.typeOf(pieces[atk[0]])],
    }
  })
}

function escapeTask(L) {
  return tryFor(500, () => {
    const wk = ri(0, 63)
    const bk = ri(0, 63)
    if (dist(wk, bk) < 3) return null
    const t = pick(L === 0 ? ['q', 'r', 'b'] : ['q', 'r', 'b', 'n'])
    const a = ri(0, 63)
    if ([wk, bk].includes(a)) return null
    const pieces = { [wk]: 'K', [bk]: 'k', [a]: t }
    if (L >= 1) scatter(pieces, ri(1, 2), { colors: ['b', 'w'], types: ['p'], near: wk })
    const p = posOf(pieces, 'w')
    if (E.inCheck(p, 'b') || !E.inCheck(p, 'w')) return null
    const legal = E.legalMoves(p)
    if (legal.length < 2) return null
    return {
      kind: 'board',
      id: 'escape',
      skill: 'chess:escape',
      title: 'Королю шах! Спаси короля',
      say: ['words.escape'],
      pieces,
      labels: 'none',
      mode: 'move',
      turn: 'w',
      marks: [wk],
      goalMoves: legal.map(m => E.sqName(m.from) + E.sqName(m.to)),
      dotsOnSelect: L === 0,
      wrongSay: ['words.escape_no'],
      hintAfter: 2,
      checkKing: wk,
      right: ['words.escape_ok'],
    }
  })
}

const TERMS = [
  { id: 'capture', q: 'words.t.capture', a: 'capture', opts: ['capture', 'check', 'mate'] },
  { id: 'check', q: 'words.t.check', a: 'check', opts: ['check', 'capture', 'draw'] },
  { id: 'mate', q: 'words.t.mate', a: 'mate', opts: ['mate', 'check', 'stalemate'] },
  { id: 'castle', q: 'words.t.castle', a: 'castle', opts: ['castle', 'capture', 'promo'] },
  { id: 'promo', q: 'words.t.promo', a: 'promo', opts: ['promo', 'castle', 'check'] },
  { id: 'draw', q: 'words.t.draw', a: 'draw', opts: ['draw', 'mate', 'check'] },
  { id: 'game', q: 'words.t.game', a: 'game', opts: ['game', 'move', 'draw'] },
  { id: 'move', q: 'words.t.move', a: 'move', opts: ['move', 'game', 'mate'] },
  { id: 'stalemate', q: 'words.t.stalemate', a: 'stalemate', opts: ['stalemate', 'mate', 'check'], min: 2 },
]
const TERM_CARD = {
  capture: { icon: '⚔️', label: 'Взятие' },
  check: { icon: '⚠️', label: 'Шах' },
  mate: { icon: '🏁', label: 'Мат' },
  stalemate: { icon: '🤐', label: 'Пат' },
  castle: { icon: '🏰', label: 'Рокировка' },
  promo: { icon: '⭐', label: 'Превращение' },
  draw: { icon: '🤝', label: 'Ничья' },
  game: { icon: '♟️', label: 'Партия' },
  move: { icon: '👣', label: 'Ход' },
}

function termQ(L) {
  const list = TERMS.filter(t => (t.min ?? 0) <= L)
  const t = pick(list)
  return {
    kind: 'pick',
    id: `term:${t.id}`,
    skill: `chess:term:${t.id}`,
    title: '',
    say: [t.q],
    stim: null,
    options: shuffle(t.opts).map(o => ({ id: o, card: TERM_CARD[o], say: `words.opt.${o}`, correct: o === t.a, wrongSay: [`words.opt_no.${o}`] })),
    right: [`words.t.${t.id}_r`],
    read: true,
    big: true,
  }
}

function valueCompare(L) {
  const pairs = L === 0 ? [['q', 'p'], ['r', 'p'], ['q', 'n'], ['q', 'b'], ['r', 'n']] : [['q', 'r'], ['r', 'b'], ['r', 'n'], ['n', 'p'], ['b', 'p'], ['q', 'p'], ['r', 'p']]
  const [hi, lo] = pick(pairs)
  return {
    kind: 'pick',
    id: 'valueCompare',
    skill: 'chess:value',
    title: 'Какая фигура сильнее?',
    say: ['words.stronger'],
    stim: null,
    options: shuffle([hi, lo]).map(t => ({ id: t, card: pieceCard(t, 'w', { name: true }), say: `name.${t}`, correct: t === hi })),
    right: [`words.stronger_${hi}`],
    read: true,
    big: true,
  }
}

function castleTask(L) {
  const both = L >= 2
  const fen = both ? '4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1' : rnd() < 0.5 ? '4k3/8/8/8/8/8/8/4K2R w K - 0 1' : '4k3/8/8/8/8/8/8/R3K3 w Q - 0 1'
  const p = E.parseFen(fen)
  const pieces = {}
  p.b.forEach((ch, i) => ch && (pieces[i] = ch))
  return {
    kind: 'board',
    id: 'castle',
    skill: 'chess:castle',
    title: 'Сделай рокировку: подвинь короля на две клеточки к ладье',
    say: ['words.castle_do'],
    pieces,
    labels: 'none',
    mode: 'move',
    turn: 'w',
    fen,
    only: E.sqIndex('e1'),
    goalMoves: E.legalMoves(p)
      .filter(m => m.flag === 'K' || m.flag === 'Q')
      .map(m => E.sqName(m.from) + E.sqName(m.to)),
    stars: fen.includes('K -') || both ? [E.sqIndex('g1')] : [E.sqIndex('c1')],
    dotsOnSelect: true,
    wrongSay: ['words.castle_no'],
    hintAfter: 2,
    right: ['words.castle_right'],
  }
}

export const WORDS_GENS = [
  { id: 'termQ', w: 5, min: 0, make: termQ },
  { id: 'isCheck', w: 4, min: 0, make: isCheck },
  { id: 'whoChecks', w: 2, min: 1, make: whoChecks },
  { id: 'escape', w: 3, min: 0, make: escapeTask },
  { id: 'valueCompare', w: 2, min: 0, make: valueCompare },
  { id: 'castle', w: 1, min: 1, make: castleTask },
  { id: 'promote', w: 1, min: 1, make: L => pawnPromote(L) },
]

// ================================================================ PUZZLES
function mate1(L) {
  return tryFor(2500, () => {
    let pieces
    if (L >= 2 && rnd() < 0.6) {
      // back-rank mate: black king behind its own pawns, a rook to deliver
      const king = pick(['g8', 'h8', 'b8', 'a8'])
      const kf = E.FILES.indexOf(king[0])
      pieces = { [E.sqIndex(king)]: 'k' }
      const pawnFiles = kf >= 4 ? [kf - 1, kf, kf + 1].filter(f => f <= 7) : [kf - 1, kf, kf + 1].filter(f => f >= 0)
      for (const f of pawnFiles) if (f !== kf || rnd() < 1) pieces[sqOf(f, 6)] = 'p'
      const wk = ri(0, 63)
      const wr = ri(0, 63)
      if (pieces[wk] || pieces[wr] || wk === wr) return null
      pieces[wk] = 'K'
      pieces[wr] = rnd() < 0.7 ? 'R' : 'Q'
    } else {
      const bk = sqOf(rnd() < 0.7 ? pick([0, 7, ri(0, 7)]) : ri(0, 7), rnd() < 0.7 ? pick([0, 7, ri(0, 7)]) : ri(0, 7))
      const wk = ri(0, 63)
      const w2 = ri(0, 63)
      if (dist(bk, wk) < 2 || [bk, wk].includes(w2)) return null
      pieces = { [bk]: 'k', [wk]: 'K', [w2]: L === 0 ? 'Q' : pick(['Q', 'Q', 'R']) }
      if (L >= 1) scatter(pieces, ri(0, 1), { colors: ['b'], types: ['p'], avoid: [] })
    }
    const p = posOf(pieces, 'w')
    if (E.inCheck(p, 'b') || E.inCheck(p, 'w')) return null
    const wkSq = p.k.w
    if (wkSq < 0 || p.k.b < 0 || dist(wkSq, p.k.b) < 2) return null
    const mates = E.matingMoves(p)
    if (mates.length < 1 || mates.length > 3) return null
    const total = E.legalMoves(p).length
    if (total < 6) return null
    return {
      kind: 'board',
      id: 'mate1',
      skill: 'chess:mate1',
      title: 'Поставь мат в один ход!',
      say: ['puz.mate1'],
      pieces,
      labels: 'none',
      mode: 'move',
      turn: 'w',
      goalMoves: mates.map(m => E.sqName(m.from) + E.sqName(m.to)),
      dotsOnSelect: L === 0,
      wrongSay: ['puz.mate_no'],
      hintAfter: 3,
      hintMoves: mates.map(m => E.sqName(m.from) + E.sqName(m.to)),
      resetOnWrong: true,
      right: ['puz.mate_right'],
      finalMate: true,
    }
  })
}

function check1(L) {
  return tryFor(1500, () => {
    const bk = ri(0, 63)
    const wk = ri(0, 63)
    const w2 = ri(0, 63)
    if (dist(bk, wk) < 2 || [bk, wk].includes(w2)) return null
    const pieces = { [bk]: 'k', [wk]: 'K', [w2]: L === 0 ? 'Q' : pick(['Q', 'R', 'B', 'N']) }
    if (L >= 1) scatter(pieces, ri(1, 2), { colors: ['b'], types: ['p'] })
    const p = posOf(pieces, 'w')
    if (E.inCheck(p, 'b') || E.inCheck(p, 'w')) return null
    const checks = E.checkingMoves(p)
    if (checks.length < 1 || checks.length > 8) return null
    return {
      kind: 'board',
      id: 'check1',
      skill: 'chess:check1',
      title: 'Поставь шах чёрному королю!',
      say: ['puz.check'],
      pieces,
      labels: 'none',
      mode: 'move',
      turn: 'w',
      goalMoves: checks.map(m => E.sqName(m.from) + E.sqName(m.to)),
      dotsOnSelect: L === 0,
      wrongSay: ['puz.check_no'],
      hintAfter: 3,
      hintMoves: checks.map(m => E.sqName(m.from) + E.sqName(m.to)),
      resetOnWrong: true,
      right: ['puz.check_right'],
    }
  })
}

function freePiece(L) {
  return tryFor(2500, () => {
    const wk = ri(0, 63)
    const bk = ri(0, 63)
    if (dist(wk, bk) < 3) return null
    const t = L === 0 ? pick(['q', 'r']) : pick(['q', 'r', 'b', 'n'])
    const from = ri(0, 63)
    if ([wk, bk].includes(from)) return null
    const pieces = { [wk]: 'K', [bk]: 'k', [from]: up(t) }
    const targets = ri(2, 3)
    scatter(pieces, targets, { colors: ['b'], types: ['p', 'n', 'b', 'r'], avoid: [] })
    const p = posOf(pieces, 'w')
    if (E.inCheck(p, 'b') || E.inCheck(p, 'w')) return null
    const caps = E.legalMovesFrom(p, from).filter(m => m.cap && E.typeOf(m.cap) !== 'k')
    if (!caps.length) return null
    const safe = caps.filter(m => !E.isAttacked(E.makeMove(p, m), m.to, 'b'))
    const unsafe = caps.filter(m => E.isAttacked(E.makeMove(p, m), m.to, 'b'))
    if (safe.length < 1) return null
    if (L >= 1 && unsafe.length < 1) return null
    if (L === 0 && caps.length !== 1) return null
    if (safe.length > 2) return null
    return {
      kind: 'board',
      id: 'freePiece',
      skill: 'chess:free',
      title: 'Съешь фигуру, которую никто не защищает!',
      say: ['puz.free'],
      pieces,
      labels: 'none',
      mode: 'move',
      turn: 'w',
      only: from,
      goalMoves: safe.map(m => E.sqName(m.from) + E.sqName(m.to)),
      dotsOnSelect: L === 0,
      wrongSay: ['puz.free_no'],
      wrongAt: null,
      hintAfter: 3,
      hintMoves: safe.map(m => E.sqName(m.from) + E.sqName(m.to)),
      resetOnWrong: true,
      right: ['puz.free_right'],
    }
  })
}

function forkTask() {
  return tryFor(4000, () => {
    const wk = ri(0, 63)
    const bk = ri(0, 63)
    const n = ri(0, 63)
    if (dist(wk, bk) < 3 || [wk, bk].includes(n)) return null
    const pieces = { [wk]: 'K', [bk]: 'k', [n]: 'N' }
    const others = sample(['r', 'q', 'b'], ri(1, 2))
    for (const t of others) {
      const s = ri(0, 63)
      if (pieces[s]) return null
      pieces[s] = t
    }
    const p = posOf(pieces, 'w')
    if (E.inCheck(p, 'b') || E.inCheck(p, 'w')) return null
    const forks = E.legalMovesFrom(p, n).filter(m => {
      const q = E.makeMove(p, m)
      if (E.isAttacked(q, m.to, 'b')) return false
      const hit = E.attacksFrom(q, m.to).filter(s => q.b[s] && E.colorOf(q.b[s]) === 'b' && ['k', 'q', 'r'].includes(E.typeOf(q.b[s])))
      return hit.length >= 2 && !m.cap
    })
    if (forks.length < 1 || forks.length > 2) return null
    // no other piece captures for free
    return {
      kind: 'board',
      id: 'fork',
      skill: 'chess:fork',
      title: 'Найди ход, после которого конь нападает сразу на две фигуры!',
      say: ['puz.fork'],
      pieces,
      labels: 'none',
      mode: 'move',
      turn: 'w',
      only: n,
      goalMoves: forks.map(m => E.sqName(m.from) + E.sqName(m.to)),
      dotsOnSelect: false,
      wrongSay: ['puz.fork_no'],
      hintAfter: 3,
      hintMoves: forks.map(m => E.sqName(m.from) + E.sqName(m.to)),
      resetOnWrong: true,
      right: ['puz.fork_right'],
    }
  })
}

export const PUZZLE_GENS = [
  { id: 'check1', w: 3, min: 0, max: 1, make: check1 },
  { id: 'freePiece', w: 3, min: 0, make: freePiece },
  { id: 'escape', w: 2, min: 0, make: escapeTask },
  { id: 'mate1', w: 4, min: 0, make: mate1 },
  { id: 'fork', w: 3, min: 1, make: forkTask },
]

// ================================================================ picking
/**
 * Choose and build the next task. `gens` is one of the *_GENS lists; `recent` lists the last generator ids.
 */
export function nextTask(gens, level, recent = []) {
  const usable = gens.filter(g => (g.min ?? 0) <= level && (g.max ?? 99) >= level)
  for (let attempt = 0; attempt < 40; attempt++) {
    const fresh = usable.filter(g => !recent.slice(-2).includes(g.id))
    const pool = fresh.length ? fresh : usable
    const total = pool.reduce((s, g) => s + g.w, 0)
    let r = rnd() * total
    let g = pool[0]
    for (const c of pool) {
      r -= c.w
      if (r <= 0) {
        g = c
        break
      }
    }
    const task = g.make(level)
    if (task) return { ...task, gen: g.id }
  }
  return null
}
