#!/usr/bin/env node
// Собирает site/assets/kx/lines/index.js из всех lines/*.js и печатает плоский список реплик в JSON
// (для tools/voice/build_voice.py). Проверяет структуру реплик.
//   node tools/build-lines.mjs [--json=/tmp/kx-lines.json]
import { readdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../site/assets/kx/lines')
const WHO = new Set(['narrator', 'pyx', 'busya', 'chukh', 'shchyok', 'kapa', 'tyuk', 'tarabar', 'hapchik', 'cow', 'hen', 'pig', 'sheep'])
const files = readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'index.js').sort()
const problems = []
const flat = []
const seen = new Set()
for (const f of files) {
  const mod = (await import(pathToFileURL(path.join(dir, f)).href + `?t=${Date.now()}`)).default
  for (const m of Array.isArray(mod) ? mod : [mod]) {
    if (!m?.ns || !m.lines) { problems.push(`${f}: нет ns/lines`); continue }
    for (const [id, l] of Object.entries(m.lines)) {
      const key = `${m.ns}.${id}`
      if (seen.has(key)) problems.push(`${key}: дубликат`)
      seen.add(key)
      if (!WHO.has(l.who)) problems.push(`${key}: неизвестный who «${l.who}»`)
      const tts = l.say ?? l.text
      if (!l.text || !String(l.text).trim()) problems.push(`${key}: пустой текст`)
      if (/\d/.test(tts)) problems.push(`${key}: цифры в тексте озвучки («${tts}») — пишите словами`)
      if (String(l.text).length > 170) problems.push(`${key}: слишком длинная реплика (${String(l.text).length})`)
      flat.push({ key, who: l.who, text: l.text, say: l.say ?? null })
    }
  }
}
const imports = files.map((f, i) => `import l${i} from './${f}'`).join('\n')
writeFileSync(path.join(dir, 'index.js'),
  `// Агрегатор реплик kx-уровней. Генерируется tools/build-lines.mjs — руками не править.\n${imports}\nexport default [${files.map((_, i) => `l${i}`).join(', ')}].flat()\n`)
const jsonArg = process.argv.find(a => a.startsWith('--json='))
if (jsonArg) writeFileSync(jsonArg.slice(7), JSON.stringify(flat))
console.log(`файлов: ${files.length}, реплик: ${flat.length}`)
if (problems.length) { console.log('ПРОБЛЕМЫ:\n' + problems.join('\n')); process.exit(1) }
