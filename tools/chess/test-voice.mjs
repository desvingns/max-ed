// Every voice key used by tasks / lessons must exist in chess-voice.js (run test-tasks first).
import fs from 'node:fs'
import { VOICE_MODULES } from '../../site/assets/chess-voice.js'
import { DEMOS, BOARD_TOUR } from '../../site/assets/chess-lessons.js'

const have = new Set()
for (const m of VOICE_MODULES) for (const k of Object.keys(m.lines)) have.add(`${m.ns}.${k}`)
const used = JSON.parse(fs.readFileSync(new URL('./.used-keys.json', import.meta.url)))
const extra = ['names.intro', 'names.intro_end', 'names.intro_colors', 'moves.pick', 'moves.pick_all', 'moves.watch_again', 'board.intro', 'words.intro', 'puz.intro', 'learn.start', 'learn.next_round', 'learn.last', 'learn.well_done', 'learn.hint', 'lesson.try',
  ...['k', 'q', 'r', 'b', 'n', 'p'].map(t => `names.intro.${t}`)]
for (const d of [...Object.values(DEMOS).flat(), ...BOARD_TOUR]) if (d.say) extra.push(d.say)
const missing = [...new Set([...used, ...extra])].filter(k => !have.has(`g.chess.${k}`))
console.log(`${have.size} voice lines defined, ${used.length + extra.length} keys referenced`)
if (missing.length) { console.log('MISSING:', missing.join(', ')); process.exit(1) }
// text sanity: no Latin letters except squares/files, no empty text
const bad = []
for (const m of VOICE_MODULES) for (const [k, v] of Object.entries(m.lines)) {
  const say = v.say ?? v.text
  if (!say || !say.trim()) bad.push(k)
  if (/[A-Za-z]/.test(say)) bad.push(`${k}: latin in spoken text "${say}"`)
}
if (bad.length) { console.log('BAD TEXT:', bad.join('\n')); process.exit(1) }
console.log('all voice keys present')
