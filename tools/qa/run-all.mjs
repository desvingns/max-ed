// Автопрогон ВСЕХ kx-уровней (быстрый режим). Печатает таблицу; скриншоты — в текущую папку.
//   node tools/qa/run-all.mjs [--only=id1,id2] [--shots=3000,9000] [--conc=2] [--timeout=200] [--real]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const args = process.argv.slice(2)
const opt = (k, d) => (args.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1] ?? d
const only = opt('only', '') ? opt('only').split(',') : null
const shots = String(opt('shots', '3000,9000')).split(',').filter(Boolean).map(Number)
const conc = Number(opt('conc', 2))
const timeout = Number(opt('timeout', 200)) * 1000
const base = opt('base', 'http://localhost:8123')
const real = args.includes('--real')  // с настоящей озвучкой (без ?fastvoice) — проверяет mp3 и реальный темп

const reg = await import(pathToFileURL(path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../site/assets/kx/registry.js')).href)
const ids = (only ?? reg.levelIds)
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })

async function run(id) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
  const errs = []
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)) })
  page.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 200)))
  await page.goto(`${base}/index.html${real ? '' : '?fastvoice'}#/ep/${id}`)
  const t0 = Date.now()
  let done = false, i = 0, stuck = 0, lastSig = ''
  while (Date.now() - t0 < timeout) {
    await page.waitForTimeout(400)
    const st = await page.evaluate(() => { const k = window.__kx; if (!k) return null; const s = k.state(); return { p: s.pending, ok: k.solve() } }).catch(() => null)
    const el = Date.now() - t0
    while (i < shots.length && el >= shots[i]) { await page.screenshot({ path: `${id}-${shots[i]}.png` }); i++ }
    if (await page.evaluate(() => !!document.querySelector('.ceremony')).catch(() => false)) { done = true; break }
    const sig = String(st?.p) + await page.evaluate(() => document.querySelectorAll('*').length).catch(() => 0)
    stuck = sig === lastSig ? stuck + 1 : 0; lastSig = sig
  }
  const ms = Date.now() - t0
  if (done) await page.screenshot({ path: `${id}-end.png` })
  await page.close()
  return { id, done, s: Math.round(ms / 1000), errs: [...new Set(errs)].slice(0, 3) }
}

const queue = [...ids], results = []
await Promise.all(Array.from({ length: conc }, async () => { while (queue.length) { const id = queue.shift(); const r = await run(id).catch(e => ({ id, done: false, s: 0, errs: [String(e).slice(0, 100)] })); results.push(r); console.log(r.done && !r.errs.length ? 'OK  ' : 'FAIL', r.id.padEnd(16), `${r.s}s`, r.errs.join(' | ')) } }))
await browser.close()
const bad = results.filter(r => !r.done || r.errs.length)
console.log(`\n${results.length - bad.length}/${results.length} OK`)
process.exit(bad.length ? 1 : 0)
