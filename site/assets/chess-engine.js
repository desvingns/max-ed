// Chess rules engine for the "Шахматное Королевство" station.
// Pure logic, no DOM: legal moves, check / mate / stalemate, castling, en passant,
// promotion, draw rules, undo, and a small AI. Squares are 0..63 (a1 = 0, h1 = 7, a8 = 56).
// Pieces are FEN characters: white uppercase (PNBRQK), black lowercase (pnbrqk).

export const FILES = 'abcdefgh'
export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export const file = sq => sq & 7
export const rank = sq => sq >> 3
export const sqOf = (f, r) => r * 8 + f
export const sqName = sq => FILES[sq & 7] + ((sq >> 3) + 1)
export const sqIndex = name => FILES.indexOf(name[0]) + (Number(name[1]) - 1) * 8
export const inBoard = (f, r) => f >= 0 && f < 8 && r >= 0 && r < 8
export const isLight = sq => ((sq & 7) + (sq >> 3)) % 2 === 1 // a1 is dark, h1 is light

export const colorOf = ch => (ch === 0 || ch === '' || ch == null ? null : ch === ch.toUpperCase() ? 'w' : 'b')
export const typeOf = ch => (ch ? ch.toLowerCase() : '')
export const makePiece = (color, type) => (color === 'w' ? type.toUpperCase() : type.toLowerCase())
export const other = c => (c === 'w' ? 'b' : 'w')

const CASTLE_K = 1
const CASTLE_Q = 2
const CASTLE_k = 4
const CASTLE_q = 8

// ---------------------------------------------------------------- tables
const KNIGHT = []
const KING = []
const RAYS_ROOK = []
const RAYS_BISHOP = []
for (let sq = 0; sq < 64; sq++) {
  const f = sq & 7
  const r = sq >> 3
  const kn = []
  for (const [df, dr] of [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]) {
    if (inBoard(f + df, r + dr)) kn.push(sqOf(f + df, r + dr))
  }
  KNIGHT[sq] = kn
  const kg = []
  for (let df = -1; df <= 1; df++) {
    for (let dr = -1; dr <= 1; dr++) {
      if ((df || dr) && inBoard(f + df, r + dr)) kg.push(sqOf(f + df, r + dr))
    }
  }
  KING[sq] = kg
  const ray = dirs => dirs.map(([df, dr]) => {
    const out = []
    for (let x = f + df, y = r + dr; inBoard(x, y); x += df, y += dr) out.push(sqOf(x, y))
    return out
  })
  RAYS_ROOK[sq] = ray([[0, 1], [0, -1], [1, 0], [-1, 0]])
  RAYS_BISHOP[sq] = ray([[1, 1], [1, -1], [-1, 1], [-1, -1]])
}

// ---------------------------------------------------------------- position
export function emptyPosition() {
  return { b: new Array(64).fill(0), turn: 'w', castle: 0, ep: -1, half: 0, full: 1, k: { w: -1, b: -1 } }
}

export function clonePosition(p) {
  return { b: p.b.slice(), turn: p.turn, castle: p.castle, ep: p.ep, half: p.half, full: p.full, k: { w: p.k.w, b: p.k.b } }
}

function locateKings(p) {
  p.k.w = p.b.indexOf('K')
  p.k.b = p.b.indexOf('k')
}

export function parseFen(fen) {
  const p = emptyPosition()
  const [rows, turn = 'w', castle = '-', ep = '-', half = '0', full = '1'] = fen.trim().split(/\s+/)
  rows.split('/').forEach((row, i) => {
    let f = 0
    for (const ch of row) {
      if (/\d/.test(ch)) f += Number(ch)
      else p.b[sqOf(f++, 7 - i)] = ch
    }
  })
  p.turn = turn
  p.castle = (castle.includes('K') ? CASTLE_K : 0) | (castle.includes('Q') ? CASTLE_Q : 0) | (castle.includes('k') ? CASTLE_k : 0) | (castle.includes('q') ? CASTLE_q : 0)
  p.ep = ep === '-' ? -1 : sqIndex(ep)
  p.half = Number(half) || 0
  p.full = Number(full) || 1
  locateKings(p)
  return p
}

export function toFen(p) {
  let rows = ''
  for (let r = 7; r >= 0; r--) {
    let empty = 0
    for (let f = 0; f < 8; f++) {
      const ch = p.b[sqOf(f, r)]
      if (!ch) empty++
      else {
        if (empty) rows += empty
        empty = 0
        rows += ch
      }
    }
    if (empty) rows += empty
    if (r) rows += '/'
  }
  const c = (p.castle & CASTLE_K ? 'K' : '') + (p.castle & CASTLE_Q ? 'Q' : '') + (p.castle & CASTLE_k ? 'k' : '') + (p.castle & CASTLE_q ? 'q' : '')
  return `${rows} ${p.turn} ${c || '-'} ${p.ep < 0 ? '-' : sqName(p.ep)} ${p.half} ${p.full}`
}

export const startPosition = () => parseFen(START_FEN)

/** Build a position from {squareIndex: 'N', ...}; castling / en passant off. Kings are optional. */
export function positionFromIndex(pieces, turn = 'w') {
  const p = emptyPosition()
  for (const [sq, ch] of Object.entries(pieces)) p.b[Number(sq)] = ch
  p.turn = turn
  locateKings(p)
  return p
}

/** Build a position from {e4: 'N', ...}; castling / en passant off. Kings are optional. */
export function positionFrom(pieces, turn = 'w') {
  const p = emptyPosition()
  for (const [name, ch] of Object.entries(pieces)) p.b[sqIndex(name)] = ch
  p.turn = turn
  locateKings(p)
  return p
}

// ---------------------------------------------------------------- attacks
/** Squares a piece attacks (also squares holding its own pieces, i.e. "defends"). Pawns: the two diagonals. */
export function attacksFrom(p, sq) {
  const ch = p.b[sq]
  if (!ch) return []
  const t = typeOf(ch)
  const c = colorOf(ch)
  if (t === 'n') return KNIGHT[sq].slice()
  if (t === 'k') return KING[sq].slice()
  if (t === 'p') {
    const f = sq & 7
    const r = (sq >> 3) + (c === 'w' ? 1 : -1)
    const out = []
    if (r >= 0 && r < 8) {
      if (f > 0) out.push(sqOf(f - 1, r))
      if (f < 7) out.push(sqOf(f + 1, r))
    }
    return out
  }
  const rays = t === 'r' ? RAYS_ROOK[sq] : t === 'b' ? RAYS_BISHOP[sq] : RAYS_ROOK[sq].concat(RAYS_BISHOP[sq])
  const out = []
  for (const ray of rays) {
    for (const s of ray) {
      out.push(s)
      if (p.b[s]) break
    }
  }
  return out
}

/** Is `sq` attacked by any piece of colour `by`? */
export function isAttacked(p, sq, by) {
  const b = p.b
  const f = sq & 7
  const r = sq >> 3
  // pawns
  const pr = by === 'w' ? r - 1 : r + 1
  if (pr >= 0 && pr < 8) {
    const pawn = by === 'w' ? 'P' : 'p'
    if (f > 0 && b[sqOf(f - 1, pr)] === pawn) return true
    if (f < 7 && b[sqOf(f + 1, pr)] === pawn) return true
  }
  const kn = by === 'w' ? 'N' : 'n'
  for (const s of KNIGHT[sq]) if (b[s] === kn) return true
  const kg = by === 'w' ? 'K' : 'k'
  for (const s of KING[sq]) if (b[s] === kg) return true
  const rk = by === 'w' ? 'R' : 'r'
  const bs = by === 'w' ? 'B' : 'b'
  const qn = by === 'w' ? 'Q' : 'q'
  for (const ray of RAYS_ROOK[sq]) {
    for (const s of ray) {
      const ch = b[s]
      if (ch) {
        if (ch === rk || ch === qn) return true
        break
      }
    }
  }
  for (const ray of RAYS_BISHOP[sq]) {
    for (const s of ray) {
      const ch = b[s]
      if (ch) {
        if (ch === bs || ch === qn) return true
        break
      }
    }
  }
  return false
}

export const inCheck = (p, color = p.turn) => p.k[color] >= 0 && isAttacked(p, p.k[color], other(color))

/** Pieces of `by` that attack `sq` (list of squares). */
export function attackersOf(p, sq, by) {
  const out = []
  for (let s = 0; s < 64; s++) {
    const ch = p.b[s]
    if (ch && colorOf(ch) === by && s !== sq && attacksFrom(p, s).includes(sq)) out.push(s)
  }
  return out
}

// ---------------------------------------------------------------- move generation
// move: { from, to, piece, cap, promo, flag }  flag: '' | 'd' double push | 'e' en passant | 'K' / 'Q' castle
function pushPawnMove(list, from, to, piece, cap, flag, promoRank) {
  if ((to >> 3) === promoRank) {
    const white = piece === 'P'
    for (const t of ['q', 'r', 'b', 'n']) list.push({ from, to, piece, cap, promo: white ? t.toUpperCase() : t, flag })
  } else list.push({ from, to, piece, cap, promo: 0, flag })
}

function pseudoMoves(p, only = -1) {
  const list = []
  const b = p.b
  const me = p.turn
  const white = me === 'w'
  for (let from = 0; from < 64; from++) {
    if (only >= 0 && from !== only) continue
    const piece = b[from]
    if (!piece || colorOf(piece) !== me) continue
    const t = typeOf(piece)
    if (t === 'p') {
      const f = from & 7
      const r = from >> 3
      const dir = white ? 1 : -1
      const startRank = white ? 1 : 6
      const promoRank = white ? 7 : 0
      const one = sqOf(f, r + dir)
      if (r + dir >= 0 && r + dir < 8 && !b[one]) {
        pushPawnMove(list, from, one, piece, 0, '', promoRank)
        if (r === startRank) {
          const two = sqOf(f, r + 2 * dir)
          if (!b[two]) list.push({ from, to: two, piece, cap: 0, promo: 0, flag: 'd' })
        }
      }
      for (const df of [-1, 1]) {
        if (!inBoard(f + df, r + dir)) continue
        const to = sqOf(f + df, r + dir)
        const target = b[to]
        if (target && colorOf(target) !== me) pushPawnMove(list, from, to, piece, target, '', promoRank)
        else if (!target && to === p.ep) list.push({ from, to, piece, cap: white ? 'p' : 'P', promo: 0, flag: 'e' })
      }
    } else if (t === 'n' || t === 'k') {
      for (const to of t === 'n' ? KNIGHT[from] : KING[from]) {
        const target = b[to]
        if (!target || colorOf(target) !== me) list.push({ from, to, piece, cap: target || 0, promo: 0, flag: '' })
      }
      if (t === 'k') genCastles(p, from, list)
    } else {
      const rays = t === 'r' ? RAYS_ROOK[from] : t === 'b' ? RAYS_BISHOP[from] : RAYS_ROOK[from].concat(RAYS_BISHOP[from])
      for (const ray of rays) {
        for (const to of ray) {
          const target = b[to]
          if (!target) list.push({ from, to, piece, cap: 0, promo: 0, flag: '' })
          else {
            if (colorOf(target) !== me) list.push({ from, to, piece, cap: target, promo: 0, flag: '' })
            break
          }
        }
      }
    }
  }
  return list
}

function genCastles(p, from, list) {
  const b = p.b
  const white = p.turn === 'w'
  const home = white ? 4 : 60
  if (from !== home) return
  const enemy = other(p.turn)
  const kingSide = white ? CASTLE_K : CASTLE_k
  const queenSide = white ? CASTLE_Q : CASTLE_q
  const rook = white ? 'R' : 'r'
  if (!(p.castle & (kingSide | queenSide))) return
  if (isAttacked(p, home, enemy)) return
  if (p.castle & kingSide && b[home + 3] === rook && !b[home + 1] && !b[home + 2] && !isAttacked(p, home + 1, enemy) && !isAttacked(p, home + 2, enemy)) {
    list.push({ from, to: home + 2, piece: b[from], cap: 0, promo: 0, flag: 'K' })
  }
  if (p.castle & queenSide && b[home - 4] === rook && !b[home - 1] && !b[home - 2] && !b[home - 3] && !isAttacked(p, home - 1, enemy) && !isAttacked(p, home - 2, enemy)) {
    list.push({ from, to: home - 2, piece: b[from], cap: 0, promo: 0, flag: 'Q' })
  }
}

// in-place make / unmake (used by search and legality filtering)
function make(p, m) {
  const b = p.b
  const undo = { castle: p.castle, ep: p.ep, half: p.half, full: p.full, kw: p.k.w, kb: p.k.b }
  const me = p.turn
  b[m.from] = 0
  b[m.to] = m.promo || m.piece
  if (m.flag === 'e') b[m.to + (me === 'w' ? -8 : 8)] = 0
  if (m.flag === 'K') {
    b[m.to - 1] = b[m.to + 1]
    b[m.to + 1] = 0
  } else if (m.flag === 'Q') {
    b[m.to + 1] = b[m.to - 2]
    b[m.to - 2] = 0
  }
  if (m.piece === 'K') p.k.w = m.to
  else if (m.piece === 'k') p.k.b = m.to
  let c = p.castle
  if (m.piece === 'K') c &= ~(CASTLE_K | CASTLE_Q)
  else if (m.piece === 'k') c &= ~(CASTLE_k | CASTLE_q)
  for (const s of [m.from, m.to]) {
    if (s === 0) c &= ~CASTLE_Q
    else if (s === 7) c &= ~CASTLE_K
    else if (s === 56) c &= ~CASTLE_q
    else if (s === 63) c &= ~CASTLE_k
  }
  p.castle = c
  p.ep = m.flag === 'd' ? (m.from + m.to) >> 1 : -1
  p.half = m.cap || typeOf(m.piece) === 'p' ? 0 : p.half + 1
  if (me === 'b') p.full++
  p.turn = other(me)
  return undo
}

function unmake(p, m, u) {
  const b = p.b
  p.turn = other(p.turn)
  const me = p.turn
  b[m.from] = m.piece
  b[m.to] = 0
  if (m.flag === 'e') {
    b[m.to + (me === 'w' ? -8 : 8)] = m.cap
  } else if (m.cap) b[m.to] = m.cap
  if (m.flag === 'K') {
    b[m.to + 1] = b[m.to - 1]
    b[m.to - 1] = 0
  } else if (m.flag === 'Q') {
    b[m.to - 2] = b[m.to + 1]
    b[m.to + 1] = 0
  }
  p.castle = u.castle
  p.ep = u.ep
  p.half = u.half
  p.full = u.full
  p.k.w = u.kw
  p.k.b = u.kb
}

function legalIn(p, only = -1) {
  const me = p.turn
  const out = []
  for (const m of pseudoMoves(p, only)) {
    const u = make(p, m)
    const ksq = p.k[me]
    const ok = ksq < 0 || !isAttacked(p, ksq, other(me))
    unmake(p, m, u)
    if (ok) out.push(m)
  }
  return out
}

/** All legal moves for the side to move. */
export const legalMoves = p => legalIn(clonePosition(p))
/** Legal moves of the piece on `sq` (must belong to the side to move). */
export const legalMovesFrom = (p, sq) => legalIn(clonePosition(p), sq)

/** Returns a new position after playing `m` (m must be one of the legal moves). */
export function makeMove(p, m) {
  const c = clonePosition(p)
  make(c, m)
  return c
}

export function findMove(p, from, to, promo = 'q') {
  const list = legalMovesFrom(p, from).filter(m => m.to === to)
  if (!list.length) return null
  if (list.length === 1) return list[0]
  const want = promo.toLowerCase()
  return list.find(m => m.promo && typeOf(m.promo) === want) ?? list[0]
}

export const moveStr = m => sqName(m.from) + sqName(m.to) + (m.promo ? typeOf(m.promo) : '')

/** Destinations of the piece on `sq` ignoring king safety: for lessons on (nearly) empty boards. */
export function reachable(p, sq) {
  const me = colorOf(p.b[sq])
  if (!me) return []
  const q = clonePosition(p)
  q.turn = me
  q.ep = -1
  q.castle = 0
  return pseudoMoves(q, sq).map(m => m.to)
}

// ---------------------------------------------------------------- status / draws
export function insufficientMaterial(p) {
  const minors = []
  for (let s = 0; s < 64; s++) {
    const ch = p.b[s]
    if (!ch) continue
    const t = typeOf(ch)
    if (t === 'k') continue
    if (t === 'p' || t === 'r' || t === 'q') return false
    minors.push({ t, light: isLight(s) })
  }
  if (minors.length <= 1) return true
  return minors.every(m => m.t === 'b') && minors.every(m => m.light === minors[0].light)
}

export function status(p) {
  const moves = legalMoves(p)
  const check = inCheck(p)
  if (!moves.length) return { over: true, check, mate: check, stalemate: !check, winner: check ? other(p.turn) : null, reason: check ? 'checkmate' : 'stalemate', moves }
  if (insufficientMaterial(p)) return { over: true, check, mate: false, stalemate: false, winner: null, reason: 'insufficient', moves }
  if (p.half >= 100) return { over: true, check, mate: false, stalemate: false, winner: null, reason: 'fifty', moves }
  return { over: false, check, mate: false, stalemate: false, winner: null, reason: '', moves }
}

export const isCheckmate = p => {
  const s = status(p)
  return s.mate
}

/** Moves that give checkmate right now. */
export function matingMoves(p) {
  const out = []
  for (const m of legalMoves(p)) {
    if (status(makeMove(p, m)).mate) out.push(m)
  }
  return out
}

/** Moves that deliver check (mate included). */
export function checkingMoves(p) {
  return legalMoves(p).filter(m => inCheck(makeMove(p, m)))
}

const posKey = p => toFen(p).split(' ').slice(0, 4).join(' ')

// ---------------------------------------------------------------- game
export class Game {
  constructor(fen = START_FEN) {
    this.startFen = fen
    this.pos = parseFen(fen)
    this.hist = [] // { move, before, key }
    this.keys = [posKey(this.pos)]
    this._status = null
  }

  get turn() {
    return this.pos.turn
  }

  get moves() {
    return this.hist.map(h => h.move)
  }

  status() {
    if (this._status) return this._status
    const s = status(this.pos)
    if (!s.over) {
      const key = this.keys[this.keys.length - 1]
      if (this.keys.filter(k => k === key).length >= 3) {
        s.over = true
        s.reason = 'repetition'
      }
    }
    this._status = s
    return s
  }

  legalFrom(sq) {
    const ch = this.pos.b[sq]
    if (!ch || colorOf(ch) !== this.pos.turn || this.status().over) return []
    return legalMovesFrom(this.pos, sq)
  }

  /** Play from → to (promo: 'q' | 'r' | 'b' | 'n'). Returns the move made or null. */
  play(from, to, promo = 'q') {
    if (this.status().over) return null
    const m = findMove(this.pos, from, to, promo)
    if (!m) return null
    this.hist.push({ move: m, before: this.pos })
    this.pos = makeMove(this.pos, m)
    this.keys.push(posKey(this.pos))
    this._status = null
    return m
  }

  undo() {
    const h = this.hist.pop()
    if (!h) return null
    this.pos = h.before
    this.keys.pop()
    this._status = null
    return h.move
  }

  last() {
    return this.hist.length ? this.hist[this.hist.length - 1].move : null
  }

  /** Captured pieces so far, by the side that captured them. */
  captured() {
    const out = { w: [], b: [] }
    for (const { move } of this.hist) if (move.cap) out[colorOf(move.piece)].push(move.cap)
    return out
  }

  serialize() {
    return { fen: this.startFen, moves: this.hist.map(h => moveStr(h.move)) }
  }

  static restore(data) {
    const g = new Game(data.fen)
    for (const s of data.moves) {
      const from = sqIndex(s.slice(0, 2))
      const to = sqIndex(s.slice(2, 4))
      if (!g.play(from, to, s[4] ?? 'q')) return null
    }
    return g
  }
}

// ---------------------------------------------------------------- AI
export const VALUE = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 }

const PST_PAWN = [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, -20, -20, 10, 10, 5, 5, -5, -10, 0, 0, -10, -5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, 5, 10, 25, 25, 10, 5, 5, 10, 10, 20, 30, 30, 20, 10, 10, 50, 50, 50, 50, 50, 50, 50, 50, 0, 0, 0, 0, 0, 0, 0, 0]
const PST_KNIGHT = [-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 5, 5, 0, -20, -40, -30, 5, 10, 15, 15, 10, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 10, 15, 15, 10, 0, -30, -40, -20, 0, 0, 0, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50]
const PST_BISHOP = [-20, -10, -10, -10, -10, -10, -10, -20, -10, 5, 0, 0, 0, 0, 5, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 0, 0, 0, 0, 0, 0, -10, -20, -10, -10, -10, -10, -10, -10, -20]
const PST_ROOK = [0, 0, 5, 10, 10, 5, 0, 0, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 5, 10, 10, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0]
const PST_QUEEN = [-20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 5, 0, 0, 0, 0, -10, -10, 5, 5, 5, 5, 5, 0, -10, 0, 0, 5, 5, 5, 5, 0, -5, -5, 0, 5, 5, 5, 5, 0, -5, -10, 0, 5, 5, 5, 5, 0, -10, -10, 0, 0, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10, -20]
const PST_KING = [20, 30, 10, 0, 0, 10, 30, 20, 20, 20, 0, 0, 0, 0, 20, 20, -10, -20, -20, -20, -20, -20, -20, -10, -20, -30, -30, -40, -40, -30, -30, -20, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30]
const PST = { p: PST_PAWN, n: PST_KNIGHT, b: PST_BISHOP, r: PST_ROOK, q: PST_QUEEN, k: PST_KING }

/** Static evaluation in centipawns from the side to move's point of view. */
export function evaluate(p) {
  let score = 0
  for (let s = 0; s < 64; s++) {
    const ch = p.b[s]
    if (!ch) continue
    const t = typeOf(ch)
    if (colorOf(ch) === 'w') score += VALUE[t] + PST[t][s]
    else score -= VALUE[t] + PST[t][s ^ 56]
  }
  return p.turn === 'w' ? score : -score
}

const MATE = 100000

function order(p, moves) {
  return moves
    .map(m => ({ m, s: (m.cap ? 10 * VALUE[typeOf(m.cap)] - VALUE[typeOf(m.piece)] : 0) + (m.promo ? 800 : 0) }))
    .sort((a, b) => b.s - a.s)
    .map(x => x.m)
}

function quiesce(p, alpha, beta, depth) {
  const stand = evaluate(p)
  if (depth <= 0) return stand
  if (stand >= beta) return beta
  if (stand > alpha) alpha = stand
  const caps = order(p, legalIn(p).filter(m => m.cap || m.promo))
  for (const m of caps) {
    const u = make(p, m)
    const score = -quiesce(p, -beta, -alpha, depth - 1)
    unmake(p, m, u)
    if (score >= beta) return beta
    if (score > alpha) alpha = score
  }
  return alpha
}

function search(p, depth, alpha, beta, ply) {
  if (depth <= 0) return quiesce(p, alpha, beta, 3)
  const moves = legalIn(p)
  if (!moves.length) return inCheck(p) ? -MATE + ply : 0
  for (const m of order(p, moves)) {
    const u = make(p, m)
    const score = -search(p, depth - 1, -beta, -alpha, ply + 1)
    unmake(p, m, u)
    if (score >= beta) return beta
    if (score > alpha) alpha = score
  }
  return alpha
}

/**
 * Choose a move for the side to move.
 * level 1 — "малыш": greedy with lots of noise, sometimes blunders;
 * level 2 — looks 2 half-moves ahead;
 * level 3 — looks 3 half-moves ahead with a short capture search.
 */
export function chooseMove(pos, level = 2, rng = Math.random) {
  const p = clonePosition(pos)
  const moves = legalIn(p)
  if (!moves.length) return null
  if (moves.length === 1) return moves[0]
  const scored = moves.map(m => {
    const u = make(p, m)
    let s
    if (level <= 1) {
      const reply = legalIn(p)
      let base = m.cap ? VALUE[typeOf(m.cap)] : 0
      if (m.promo) base += 700
      if (!reply.length && inCheck(p)) base += 5000 * (rng() < 0.6 ? 1 : 0)
      s = base + (rng() - 0.5) * 520
    } else {
      const depth = level === 2 ? 1 : 2
      s = -search(p, depth, -MATE * 2, MATE * 2, 1)
      s += (rng() - 0.5) * (level === 2 ? 30 : 6)
    }
    unmake(p, m, u)
    return { m, s }
  })
  scored.sort((a, b) => b.s - a.s)
  return scored[0].m
}

export function perft(pos, depth) {
  if (depth === 0) return 1
  const p = clonePosition(pos)
  const go = d => {
    const list = legalIn(p)
    if (d === 1) return list.length
    let n = 0
    for (const m of list) {
      const u = make(p, m)
      n += go(d - 1)
      unmake(p, m, u)
    }
    return n
  }
  return go(depth)
}
