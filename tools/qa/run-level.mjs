// Автопрогон kx-уровня в headless Chromium.
//   node tools/qa/run-level.mjs <levelId> [--real] [--shots=3000,9000] [--timeout=150] [--base=http://localhost:8123]
// Уровень проходит сам (каждый жест регистрирует «решатель» через k.waiting). Печатает JSON:
//   {"id":..,"done":true,"ms":..,"errs":[..]}; скриншоты: <id>-<мс>.png и <id>-end.png в текущей папке.
// --real  — без ?fastvoice (реплики идут реальным временем; без озвучки голос браузера в headless молчит)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'

const args = process.argv.slice(2)
const id = args.find(a => !a.startsWith('--'))
const opt = (k, d) => (args.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1] ?? d
const real = args.includes('--real')
const shots = String(opt('shots', '')).split(',').filter(Boolean).map(Number)
const timeout = Number(opt('timeout', 150)) * 1000
const base = opt('base', 'http://localhost:8123')
if (!id) { console.error('usage: run-level.mjs <levelId>'); process.exit(2) }

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
})
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const errs = []
page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 200)) })
page.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 300)))
await page.goto(`${base}/index.html${real ? '' : '?fastvoice'}#/ep/${id}`)
const t0 = Date.now()
let done = false, shotI = 0
const kinds = new Map()
while (Date.now() - t0 < timeout) {
  await page.waitForTimeout(400)
  const st = await page.evaluate(() => { const k = window.__kx; if (!k) return null; const s = k.state(); return { pending: s.pending, ok: k.solve() } }).catch(() => null)
  if (st?.pending) kinds.set(st.pending, (kinds.get(st.pending) ?? 0) + 1)
  const el = Date.now() - t0
  while (shotI < shots.length && el >= shots[shotI]) { await page.screenshot({ path: `${id}-${shots[shotI]}.png` }); shotI++ }
  if (await page.evaluate(() => !!document.querySelector('.ceremony')).catch(() => false)) { done = true; break }
}
const ms = Date.now() - t0
if (done) await page.screenshot({ path: `${id}-end.png` })
console.log(JSON.stringify({ id, done, ms, errs: [...new Set(errs)].slice(0, 8), waited: Object.fromEntries(kinds) }))
await browser.close()
process.exit(done && !errs.length ? 0 : 1)
