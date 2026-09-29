// The "Шахматы" card of the parents' corner (progress tab): what Максим already knows,
// built from the skill counters that the chess games record (chess:name:k, chess:move:n, ...).
import { r as progress } from './progress-CNOIQz2A.js'
import { pieceSvg, PIECE } from './chess-pieces.js'

const ORDER = ['k', 'q', 'r', 'b', 'n', 'p']

/** sum of skill counters whose key equals a prefix or continues it with ":" */
function agg(...prefixes) {
  let seen = 0
  let correct = 0
  let any = false
  for (const [k, v] of Object.entries(progress.data.skills)) {
    if (!prefixes.some(p => k === p || k.startsWith(p + ':'))) continue
    any = true
    seen += v.seen || 0
    correct += v.correct || 0
  }
  return any ? { seen, correct } : undefined
}

/**
 * cell — the parents page's mastery-cell builder j(main, skill, title, sub)
 * legend — its legend builder M(); esc — its HTML escaper
 */
export function chessCard(cell, legend, esc) {
  const title = (label, s) => (s && s.seen ? `${label}: показов ${s.seen}, верно ${s.correct} (${Math.round((s.correct / s.seen) * 100)}%)` : `${label}: ещё не встречалось`)
  const one = (main, label, s, sub = '') => cell(main, s, esc(title(label, s)), sub)
  const piece = t => `<span style="display:block;width:50px;height:50px">${pieceSvg(t.toUpperCase())}</span>`
  const txt = s => `<span style="font-size:30px;line-height:1">${s}</span>`

  const names = ORDER.map(t => one(piece(t), PIECE[t].ru, agg(`chess:name:${t}`), PIECE[t].ru)).join('')
  const moves = ORDER.map(t => one(piece(t), `Как ходит ${PIECE[t].ru}`, agg(`chess:move:${t}`, `chess:capture:${t}`), PIECE[t].ru)).join('')
  const board = [
    [txt('e4'), 'Клеточки', agg('chess:square'), 'клеточки'],
    [txt('a–h'), 'Вертикали', agg('chess:file'), 'вертикали'],
    [txt('1–8'), 'Горизонтали', agg('chess:rank'), 'горизонтали'],
    [txt('⤢'), 'Линии и диагонали', agg('chess:line'), 'линии'],
    [txt('♜'), 'Где стоят фигуры', agg('chess:start', 'chess:setup'), 'расстановка'],
    [txt('👣'), 'Слова: ход, партия', agg('chess:term:move', 'chess:term:game', 'chess:first'), 'ход, партия'],
  ]
    .map(a => one(...a))
    .join('')
  const words = [
    [txt('⚠️'), 'Шах', agg('chess:check', 'chess:check1', 'chess:term:check'), 'шах'],
    [txt('🏁'), 'Мат', agg('chess:mate1', 'chess:term:mate', 'chess:term:stalemate'), 'мат и пат'],
    [txt('🏰'), 'Рокировка', agg('chess:castle', 'chess:term:castle'), 'рокировка'],
    [txt('⭐'), 'Превращение пешки', agg('chess:promote', 'chess:term:promo'), 'превращение'],
    [txt('🛟'), 'Спасти короля', agg('chess:escape'), 'спасти короля'],
    [txt('🍴'), 'Съесть без защиты, вилка', agg('chess:free', 'chess:fork', 'chess:term:capture'), 'взятия, вилка'],
  ]
    .map(a => one(...a))
    .join('')
  const played = progress.game('chess-play').plays
  return `<section class="pc-card">
    <div class="pc-card-head"><h2><span class="emoji">♟️</span>Шахматы</h2>${legend()}</div>
    <h3>Как зовут фигуры</h3><div class="pc-cells cols6">${names}</div>
    <h3 style="margin-top:22px">Как ходят фигуры</h3><div class="pc-cells cols6">${moves}</div>
    <h3 style="margin-top:22px">Доска и клеточки</h3><div class="pc-cells cols6">${board}</div>
    <h3 style="margin-top:22px">Шах, мат и задачки</h3><div class="pc-cells cols6">${words}</div>
    <p class="pc-muted" style="margin:18px 0 0;font-size:20px">Сыграно партий на двоих и с Цоком: ${played}</p>
  </section>`
}
