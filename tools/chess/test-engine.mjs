// Perft + rule sanity tests for site/assets/chess-engine.js  (node tools/chess/test-engine.mjs)
import * as E from '../../site/assets/chess-engine.js'

let failed = 0
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) failed++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${ok ? '' : `  got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`)
}

const perfts = [
  ['start', E.START_FEN, [20, 400, 8902, 197281]],
  ['kiwipete', 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1', [48, 2039, 97862]],
  ['pos3', '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1', [14, 191, 2812, 43238]],
  ['pos4', 'r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1', [6, 264, 9467]],
  ['pos5', 'rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8', [44, 1486, 62379]],
  ['pos6', 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10', [46, 2079, 89890]],
]
for (const [name, fen, list] of perfts) {
  const p = E.parseFen(fen)
  list.forEach((want, i) => check(`perft ${name} d${i + 1}`, E.perft(p, i + 1), want))
}

// fen round trip
check('fen round trip', E.toFen(E.startPosition()), E.START_FEN)

// fool's mate
{
  const g = new E.Game()
  for (const m of ['f2f3', 'e7e5', 'g2g4', 'd8h4']) g.play(E.sqIndex(m.slice(0, 2)), E.sqIndex(m.slice(2, 4)))
  const s = g.status()
  check("fool's mate", [s.over, s.mate, s.winner], [true, true, 'b'])
  g.undo()
  check('undo leaves game running', g.status().over, false)
}
// stalemate
check('stalemate', (({ over, stalemate }) => [over, stalemate])(E.status(E.parseFen('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1'))), [true, true])
// insufficient material
check('K vs K', E.insufficientMaterial(E.parseFen('8/8/4k3/8/8/3K4/8/8 w - - 0 1')), true)
check('K+B vs K', E.insufficientMaterial(E.parseFen('8/8/4k3/8/8/3KB3/8/8 w - - 0 1')), true)
check('K+R vs K', E.insufficientMaterial(E.parseFen('8/8/4k3/8/8/3KR3/8/8 w - - 0 1')), false)
// repetition
{
  const g = new E.Game()
  const seq = ['g1f3', 'g8f6', 'f3g1', 'f6g8', 'g1f3', 'g8f6', 'f3g1', 'f6g8']
  for (const m of seq) g.play(E.sqIndex(m.slice(0, 2)), E.sqIndex(m.slice(2, 4)))
  check('threefold repetition', [g.status().over, g.status().reason], [true, 'repetition'])
}
// serialize / restore
{
  const g = new E.Game()
  for (const m of ['e2e4', 'e7e5', 'g1f3']) g.play(E.sqIndex(m.slice(0, 2)), E.sqIndex(m.slice(2, 4)))
  const r = E.Game.restore(g.serialize())
  check('serialize/restore', E.toFen(r.pos), E.toFen(g.pos))
}
// promotion choice
{
  const p = E.parseFen('8/P6k/8/8/8/8/8/K7 w - - 0 1')
  const m = E.findMove(p, E.sqIndex('a7'), E.sqIndex('a8'), 'n')
  check('promotion to knight', m.promo, 'N')
}
// kings optional (lesson boards)
{
  const p = E.positionFrom({ d4: 'R' })
  check('lone rook has 14 destinations', E.reachable(p, E.sqIndex('d4')).length, 14)
  check('lone rook legal moves w/o kings', E.legalMoves(p).length, 14)
}

// AI sanity: finds mate in one at every level
{
  const p = E.parseFen('6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1')
  for (const lvl of [1, 2, 3]) {
    let hits = 0
    for (let i = 0; i < 20; i++) hits += E.moveStr(E.chooseMove(p, lvl)) === 'a1a8' ? 1 : 0
    console.log(`AI level ${lvl}: mate in 1 found ${hits}/20`)
  }
  let t = Date.now()
  E.chooseMove(E.startPosition(), 3)
  console.log(`AI level 3 from start: ${Date.now() - t} ms`)
  const mid = E.parseFen('r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4')
  t = Date.now()
  const mv = E.chooseMove(mid, 3)
  console.log(`AI level 3 mid: ${E.moveStr(mv)} in ${Date.now() - t} ms`)
}
// AI plays a full game vs itself without illegal moves / crashes
{
  const g = new E.Game()
  let n = 0
  while (!g.status().over && n < 300) {
    const lvl = n % 2 ? 1 : 3
    const m = E.chooseMove(g.pos, lvl)
    if (!g.play(m.from, m.to, m.promo ? E.typeOf(m.promo) : 'q')) throw new Error('AI produced illegal move')
    n++
  }
  console.log(`AI self-play: ${n} plies, result ${JSON.stringify({ r: g.status().reason, w: g.status().winner })}`)
}
console.log(failed ? `\n${failed} FAILED` : '\nall passed')
process.exit(failed ? 1 : 0)
