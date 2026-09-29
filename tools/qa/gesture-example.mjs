// Пример теста РЕАЛЬНЫХ жестов мышью (viewport 1600×1000 → масштаб сцены 1, координаты страницы = координаты сцены).
//   node tools/qa/gesture-example.mjs
// Ждём, пока уровень «ждёт» жест данного вида (window.__kx.state().pending), и выполняем его мышью.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const errs = []; page.on('pageerror', e => errs.push(e.message))
await page.goto('http://localhost:8123/index.html?fastvoice#/ep/cut-cucumber')
const pending = () => page.evaluate(() => window.__kx && window.__kx.state().pending)
const waitFor = async (kind, ms = 20000) => { const t = Date.now(); while (Date.now() - t < ms) { if ((await pending()) === kind) return true; await page.waitForTimeout(150) } return false }

await waitFor('tap'); await page.evaluate(() => window.__kx.solve())   // тап по лапке — решателем
await waitFor('cut'); await page.waitForTimeout(600)
// провести ножом сверху вниз через огурец на x (огурец: x 470..1130, y 580..700)
const swipe = async x => { await page.mouse.move(x, 470); await page.mouse.down(); for (let i = 1; i <= 8; i++) await page.mouse.move(x, 470 + 40 * i); await page.mouse.up(); await page.waitForTimeout(500) }
await swipe(470 + 0.22 * 660)
console.log('slices on plate:', await page.evaluate(() => document.querySelectorAll('.kx-slice').length), 'errors:', errs)
// другие жесты: page.mouse.move(x1,y1); mouse.down(); mouse.move(x2,y2,{steps:10}); mouse.up()
await browser.close()
