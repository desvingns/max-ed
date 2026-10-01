// Runs every task generator many times and checks that the tasks are well formed and answerable.
//   node tools/chess/test-tasks.mjs [runsPerLevel]
import * as E from '../../site/assets/chess-engine.js'
import * as T from '../../site/assets/chess-tasks.js'
import { PIECE_TYPES } from '../../site/assets/chess-pieces.js'

const RUNS = Number(process.argv[2] ?? 60)
const keys = new Set()
const problems = []
const stats = {}
const bad = (gen, msg, task) => problems.push(`${gen}: ${msg}${task ? '  ' + JSON.stringify(task).slice(0, 200) : ''}`)
const addKeys = (...ks) => ks.flat().filter(Boolean).forEach(k => keys.add(k))
const mv = m => E.sqName(m.from) + E.sqName(m.to)

function collectKeys(t) {
  addKeys(t.say, t.right, t.wrongSay)
  for (const o of t.options ?? []) addKeys(o.say, o.wrongSay)
  if (t.wrongAt) for (let s = 0; s < 64; s++) addKeys(t.wrongAt(s))
}

function checkTask(gen, t) {
  if (!t.kind || !t.say?.length) return bad(gen, 'no kind/say', t)
  collectKeys(t)
  if (t.kind === 'pick') {
    const ok = t.options.filter(o => o.correct)
    if (ok.length !== 1) bad(gen, `${ok.length} correct options`, t)
    if (new Set(t.options.map(o => o.id)).size !== t.options.length) bad(gen, 'duplicate option ids', t)
    if (t.options.length < 2) bad(gen, 'fewer than 2 options', t)
    return
  }
  const pieces = t.pieces
  const p = t.fen ? E.parseFen(t.fen) : E.positionFromIndex(pieces, t.turn ?? 'w')
  for (const s of Object.keys(pieces)) if (!(s >= 0 && s < 64)) bad(gen, 'piece off board', t)
  if (t.mode === 'place') {
    if (!t.tray?.length) bad(gen, 'empty tray', t)
    return
  }
  if (t.mode === 'tap' || t.mode === 'tapAll') {
    if (!t.targets?.length) return bad(gen, 'no targets', t)
    if (t.only != null) {
      const reach = new Set(E.reachable(p, t.only))
      if (!t.targets.every(s => reach.has(s))) bad(gen, 'target not reachable', t)
    }
    if (t.onlyEnemy && !t.targets.every(s => pieces[s] && E.colorOf(pieces[s]) === 'b')) bad(gen, 'capture target is not an enemy piece', t)
    return
  }
  if (t.mode === 'move') {
    if (t.goalMoves) {
      const legal = new Set(E.legalMoves(p).map(mv))
      if (!t.goalMoves.length || !t.goalMoves.every(m => legal.has(m))) bad(gen, 'goal move not legal', t)
      if (t.finalMate) for (const g of t.goalMoves) {
        const m = E.findMove(p, E.sqIndex(g.slice(0, 2)), E.sqIndex(g.slice(2)))
        if (!E.status(E.makeMove(p, m)).mate) bad(gen, 'not mate ' + g, t)
      }
    } else {
      if (t.only == null || !pieces[t.only]) return bad(gen, 'mover missing', t)
      const reach = new Set(E.reachable(p, t.only))
      if (!t.multi) {
        if (!t.targets.every(s => reach.has(s))) bad(gen, 'move target not reachable in one move', t)
      }
      if (t.stars?.some(s => pieces[s])) bad(gen, 'star on a piece', t)
    }
  }
}

const suites = [
  ['names', T.NAMES_GENS], ['board', T.BOARD_GENS], ['words', T.WORDS_GENS], ['puzzles', T.PUZZLE_GENS],
  ...['all', ...PIECE_TYPES].map(t => [`moves:${t}`, T.movesGens(t)]),
]
let total = 0
for (const [suite, gens] of suites) {
  for (const g of gens) for (let L = 0; L <= T.LEVEL_MAX; L++) {
    if ((g.min ?? 0) > L || (g.max ?? 99) < L) continue
    let nulls = 0
    const t0 = Date.now()
    for (let i = 0; i < RUNS; i++) {
      const t = g.make(L)
      if (!t) { nulls++; continue }
      total++
      checkTask(`${suite}/${g.id}@L${L}`, t)
    }
    const ms = (Date.now() - t0) / RUNS
    stats[`${suite}/${g.id}@L${L}`] = { nulls, ms: +ms.toFixed(1) }
    if (nulls > RUNS * 0.2) bad(`${suite}/${g.id}@L${L}`, `${nulls}/${RUNS} generations failed`)
  }
}
// nextTask smoke
for (const [suite, gens] of suites.slice(0, 4)) for (let L = 0; L <= 2; L++) { const t = T.nextTask(gens, L, []); if (!t) bad(suite, 'nextTask returned null @L' + L) }

const slow = Object.entries(stats).filter(([, v]) => v.ms > 25).map(([k, v]) => `${k} ${v.ms}ms`)
console.log(`${total} tasks generated, ${keys.size} distinct voice keys used`)
if (slow.length) console.log('slow generators:', slow.join(', '))
const nullish = Object.entries(stats).filter(([, v]) => v.nulls).map(([k, v]) => `${k}:${v.nulls}`)
if (nullish.length) console.log('sometimes-null generators:', nullish.join(' '))
import fs from 'node:fs'
fs.writeFileSync(new URL('./.used-keys.json', import.meta.url), JSON.stringify([...keys].sort(), null, 1))
if (problems.length) { console.log(`\n${problems.length} PROBLEM(S):`); console.log([...new Set(problems)].slice(0, 40).join('\n')); process.exit(1) }
console.log('all tasks well formed')
