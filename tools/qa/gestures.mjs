// Проверка реальных жестов тулкита на стенде #/dev/kxplay. node tools/qa/gestures.mjs
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 150)) })
await page.goto('http://localhost:8123/index.html?fastvoice#/dev/kxplay')
const pending = () => page.evaluate(() => window.__kx && window.__kx.state().pending)
const waitFor = async (kind, ms = 15000) => { const t = Date.now(); while (Date.now() - t < ms) { if ((await pending()) === kind) return true; await page.waitForTimeout(100) } console.log('TIMEOUT waiting', kind, 'pending=', await pending()); return false }
const log = () => page.evaluate(() => (window.__gt || []).join(','))
const M = page.mouse
const path = async pts => { await M.move(pts[0][0], pts[0][1]); await M.down(); for (const [x, y] of pts.slice(1)) await M.move(x, y); await M.up() }

await waitFor('tapAll')
for (const x of [400, 600, 800]) { await M.click(x, 300); await page.waitForTimeout(120) }
await waitFor('scrub')
const zig = []; for (let i = 0; i < 12; i++) zig.push([560 + (i % 2) * 480, 350 + (i % 3) * 40])
await path([[560, 400], ...zig.flatMap(([x, y]) => [[x, y]])])
await waitFor('stir')
const circ = []; for (let i = 0; i <= 40; i++) { const a = i * 0.4; circ.push([800 + Math.cos(a) * 110, 450 + Math.sin(a) * 110]) }
await path(circ)
await waitFor('shake')
const sh = []; for (let i = 0; i < 12; i++) sh.push([800 + (i % 2 ? 80 : -80), 450])
await path([[800, 450], ...sh])
await waitFor('hold')
await M.move(800, 450); await M.down(); await page.waitForTimeout(1000); await M.up()   // ≈50% → в диапазоне цели
await waitFor('sequence')
const order = await page.evaluate(() => [...document.querySelectorAll('.kx-card')].map(c => c.dataset.id))
console.log('cards', order)
for (const id of ['b', 'a', 'b', 'c']) { const box = await page.evaluate(id => { const r = document.querySelector(`.kx-card[data-id="${id}"]`).getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2] }, id); await M.click(box[0], box[1]); await page.waitForTimeout(700) }
await waitFor('dnd')
await page.waitForTimeout(600)
const pos = await page.evaluate(() => [...document.querySelectorAll('[style*="FF8FC8"]')].map(e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2] }))
console.log('dnd items at', JSON.stringify(pos))
await path([pos[0], [1000, 450]]); await page.waitForTimeout(700)   // i0 → z0 верно
await path([pos[1], [1000, 450]]); await page.waitForTimeout(700)   // i1 → z0 неверно
await path([pos[1], [1250, 450]]); await page.waitForTimeout(700)   // i1 → z1 верно
await page.waitForTimeout(500)
console.log('LOG:', await log()); console.log('errs:', errs)
await browser.close()
