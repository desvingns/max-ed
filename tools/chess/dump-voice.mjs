// Prints every chess voice line (key, speaker, text, spoken text) as JSON — input for gen-voice.py
import { VOICE_MODULES, SPEAKERS } from '../../site/assets/chess-voice.js'

const out = []
for (const m of VOICE_MODULES) {
  for (const [k, v] of Object.entries(m.lines)) out.push({ key: `${m.ns}.${k}`, who: v.who, text: v.text, say: v.say ?? v.text })
}
console.log(JSON.stringify({ lines: out, speakers: SPEAKERS }))
