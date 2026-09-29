// «Фруктовый салат» — режем банан, клубнику, яблоко; яблоко на воздухе темнеет, лимонный сок этого не даёт.
// Капа (хамелеон) примеряет цвета фруктов. В конце — раскладываем салат по трём мискам (счёт).
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, C, HL, SH, star } from '../art.js'

const FLESH = '#FFF3C9', BROWN = '#C99A5D', CORE = '#EFE3B0', CORE_DARK = '#A87B45'

// кружок яблока: красная кожура, светлая мякоть (.flesh) и серединка со звёздочкой (.core) — их «темним»
const appleSlice = () => {
  const seeds = [0, 72, 144, 216, 288].map(a => { const r = (a - 90) * Math.PI / 180; return `<ellipse cx="${55 + Math.cos(r) * 9}" cy="${55 + Math.sin(r) * 9}" rx="2.4" ry="3.6" fill="#8A5A2E" transform="rotate(${a} ${55 + Math.cos(r) * 9} ${55 + Math.sin(r) * 9})"/>` }).join('')
  return svg(110, 110,
    SH(55, 104, 40, 4) + C(55, 55, 46, '#FF5A5F') + `<circle class="flesh" cx="55" cy="55" r="37" fill="${FLESH}"/>` +
    `<path class="core" d="${star(55, 55, 19, 10, 5)}" fill="${CORE}" stroke="#E0CF94" stroke-width="2"/>` + seeds +
    C(55, 55, 46, 'none') + HL(36, 36, 12, 5, -40, 0.6))
}

// Обход бага ui.stepsBar: у .kx-step стоит transition:transform, из-за чего gsap.from запоминает «промежуточную» позицию
// и поздние иконки навсегда съезжают вверх. Через секунду сбрасываем inline-transform (заодно оживает .now{scale}).
const stepsBar = (k, icons, o) => { const b = k.stepsBar(icons, o); k.after(1300, () => k.gsap.set([...b.el.children], { clearProps: 'transform' })); return b }

const thumb = name => `<div style="width:56px;height:56px">${food(name)}</div>`

// куда ложатся кусочки в большой миске (центры)
const BAN = [[1196, 622], [1238, 618], [1280, 622]]
const BER = [[1218, 642], [1270, 640]]
const APP = [[1170, 634], [1312, 634]]

export default defineLevel({
  id: 'fruit-salad',
  async run(k) {
    const g = k.gsap
    const FLOOR = k.layout.floorY
    k.kitchenBg()
    const pyx = k.pyx({ x: 230 })
    const kapa = k.guest('kapa', 1455, FLOOR, { size: 250, face: 'left' })
    // Капа меняет цвет (hue-rotate)
    const tint = { h: 0, s: 1, b: 1 }
    const paint = () => { kapa.el.style.filter = `hue-rotate(${tint.h}deg) saturate(${tint.s}) brightness(${tint.b})` }
    const kapaTo = o => k.play(g.to(tint, { ...o, duration: 0.7, ease: 'power2.inOut', onUpdate: paint }))
    const fadeAway = (els, y = 80) => { g.to(els, { y: `+=${y}`, opacity: 0, duration: 0.4, ease: 'power2.in' }); k.after(450, () => els.forEach(e => e.remove())) }

    await k.wait(400)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(kapa, 'kapa_hi', 'happy')
    const bar = stepsBar(k, [thumb('banana'), thumb('strawberry'), thumb('apple'), thumb('lemon'), '🥄', '🥣'])
    bar.set(0)

    // декорации: доска, две тарелки, большая миска
    const board = k.food('board', 530, 690, 380, { z: 3 })
    const plateA = k.prop(kitchen.plate(), 810, 705, 200, 70, { z: 0 })
    const bowl = k.prop(kitchen.bowl(), 1255, 650, 300, 185, { z: 5 })
    k.fromTo([board, plateA, bowl], { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
    await k.wait(600)

    // яблочко «Пых уже нарезал»: три кружка на левой тарелке — они будут темнеть
    const slicesA = [0, 1, 2].map(i => k.prop(appleSlice(), 760 + i * 40, 692 - i * 3, 74, 74, { z: 6 }))
    k.popIn(slicesA)
    k.sfx('plop')
    const fleshA = slicesA.flatMap(s => [...s.querySelectorAll('.flesh')])
    const coreA = slicesA.flatMap(s => [...s.querySelectorAll('.core')])
    const darkTw = g.to(fleshA, { fill: BROWN, duration: 45, ease: 'none' })
    const darkTw2 = g.to(coreA, { fill: CORE_DARK, duration: 45, ease: 'none' })
    await k.tell(pyx, 'apple_pre', 'point')

    const pieces = [] // { el, spot:[x,y] } — всё, что лежит в большой миске
    const track = (el, spot) => pieces.push({ el, x: spot[0], y: spot[1] })

    // ───── 1. банан: три кружочка ─────
    const banana = k.food('banana', 530, 650, 330, { z: 6 })
    k.fromTo(banana, { y: -420, rotation: -12, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    k.sfx('boing', { vol: 0.5 })
    await k.wait(700)
    const resB = await k.cutLinear({
      food: 'banana', el: banana, at: { x: 530, y: 650 }, width: 330, mode: 'slices', slice: 'bananaSlice', sliceW: 60,
      cuts: [0.25, 0.5, 0.75], tol: 0.1, plate: { x: BAN[0][0], y: BAN[0][1] }, plateStep: { x: 42, y: -2 }, juice: '#FFF3B0',
      prompt: k.key('q_banana'), host: pyx,
      onCut: async (i, info) => { track(info.slice.el, BAN[i]); await k.sayNumber(i + 1) },
    })
    g.to(resB.tail, { y: -40, opacity: 0, duration: 0.4 })
    k.after(450, () => resB.clear())
    await kapaTo({ h: -70, s: 1.3, b: 1.08 })
    kapa.emote('happy')
    await k.tell(kapa, 'kapa_yellow')

    // ───── 2. клубника: пополам ─────
    bar.set(1)
    const berry = k.food('strawberry', 530, 655, 190, { z: 6 })
    k.fromTo(berry, { y: -420, rotation: 10, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    k.sfx('boing', { vol: 0.5 })
    await k.wait(700)
    const resS = await k.cutLinear({
      food: 'strawberry', el: berry, at: { x: 530, y: 655 }, width: 190, mode: 'split', cuts: [0.5], tol: 0.14, gap: 44,
      prompt: k.key('q_berry'), host: pyx,
    })
    await k.tell(pyx, 'halves', 'happy')
    // две половинки прыгают в миску
    const halfEls = [0, 1].map(i => {
      const x = 530 + (i === 0 ? -50 : 50)
      const el = k.food('strawberryHalf', x, 655, 74, { z: 9 })
      return el
    })
    resS.clear()
    for (let i = 0; i < 2; i++) {
      const el = halfEls[i]
      g.fromTo(el, { scale: 0.7 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' })
      const c = k.centerOf(el)
      g.to(el, { x: BER[i][0] - c.x, y: BER[i][1] - c.y - 30, scale: 0.8, rotation: k.rand(-15, 15), duration: 0.55, delay: 0.2 + i * 0.25, ease: 'power2.out' })
      g.to(el, { y: `+=30`, duration: 0.25, delay: 0.75 + i * 0.25, ease: 'bounce.out' })
      track(el, BER[i])
    }
    k.sfx('plop')
    await k.wait(1400)
    await kapaTo({ h: 235, s: 1.3, b: 1.05 })
    await k.tell(kapa, 'kapa_red', 'jump')
    fadeAway([board])

    // ───── 3. прошло время: яблоко потемнело (таймлапс) ─────
    bar.set(2)
    await k.tell(pyx, 'time', 'surprised')
    const hourglass = k.badge('⏳', 810, 560, { size: 110, color: '#FFB703' })
    k.sfx('tick')
    await k.play(g.to([darkTw, darkTw2], { progress: 1, duration: 2.4, ease: 'power1.inOut' }))
    g.to(hourglass, { scale: 0, opacity: 0, duration: 0.3 })
    k.after(350, () => hourglass.remove())
    await kapaTo({ h: 0, s: 0.75, b: 0.85 })
    kapa.emote('surprised')
    await k.tell(kapa, 'apple_dark')
    await k.tell(pyx, 'why', 'point')

    // ───── 4. второе яблоко: режем и спасаем ─────
    const board2 = k.food('board', 530, 690, 380, { z: 3 })
    const plateB = k.prop(kitchen.plate(), 1000, 705, 200, 70, { z: 0 })
    k.fromTo([board2, plateB], { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
    await k.tell(pyx, 'apple2', 'point')
    const apple = k.food('apple', 530, 650, 220, { z: 6 })
    k.fromTo(apple, { y: -420, rotation: -10, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    k.sfx('boing', { vol: 0.5 })
    await k.wait(700)
    const slicesB = []
    const resA = await k.cutLinear({
      food: 'apple', el: apple, at: { x: 530, y: 650 }, width: 220, mode: 'slices', slice: 'appleHalf', sliceW: 72,
      cuts: [0.33, 0.66], tol: 0.11, plate: { x: 960, y: 690 }, plateStep: { x: 44, y: -4 }, juice: '#FFF3C9',
      prompt: k.key('q_apple'), host: pyx,
      onCut: async (i, info) => { info.slice.el.innerHTML = appleSlice(); slicesB.push(info.slice.el); await k.sayNumber(i + 1) },
    })
    g.to(resA.tail, { y: -40, opacity: 0, duration: 0.4 })
    k.after(450, () => resA.clear())
    fadeAway([board2])
    await k.wait(500)

    // что делать, чтобы не темнело?
    await k.choose({
      prompt: k.key('q_save'), host: pyx, skill: 'science:apple',
      options: k.shuffle([
        { id: 'salt', art: `<div style="width:150px;height:220px;display:grid;place-items:center">${food('saltShaker')}</div>`, color: '#B8C0CC', outcome: async () => { k.sfx('yuck', { vol: 0.5 }); await k.tell(pyx, 'save_salt', 'shake') } },
        { id: 'wait', art: '<span class="emoji">⏳</span>', color: '#B388EB', outcome: async () => { kapa.emote('think'); await k.tell(kapa, 'save_wait') } },
        { id: 'lemon', art: food('lemon'), color: '#FFD93D', correct: true, outcome: async () => { k.sfx('magic'); await k.tell(pyx, 'save_ok', 'cheer') } },
      ]),
    })
    // выжимаем лимон: три нажатия
    bar.set(3)
    const lemon = k.food('lemon', 1000, 520, 170, { z: 12 })
    k.popIn(lemon)
    const drop = () => {
      for (let i = 0; i < 7; i++) {
        const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#FFF6A8;box-shadow:inset -2px -2px 0 #F2C81E"></div>', 990 + k.rand(-40, 60), 570, 14, 18, { z: 13 })
        k.to(d, { y: k.rand(70, 120), opacity: 0.2, duration: 0.5, delay: i * 0.04, ease: 'power1.in', onComplete: () => d.remove() })
      }
    }
    await k.tapN(lemon, 3, {
      prompt: k.key('q_squeeze'), host: pyx,
      onTap: i => { g.fromTo(lemon, { scaleY: 0.78, scaleX: 1.12 }, { scaleY: 1, scaleX: 1, duration: 0.35, ease: 'elastic.out(1,0.4)' }); drop(); k.sfx('splash', { vol: 0.5 }); k.sayNumber(i) },
    })
    k.sparkle(1000, 690, 8)
    fadeAway([lemon], -60)
    await k.wait(500)
    // сравниваем
    const sad = k.bubble('😕', 810, 560, { w: 130, h: 125, font: 60 })
    const glad = k.bubble('😋', 1000, 560, { w: 130, h: 125, font: 60 })
    await k.tell(kapa, 'compare', 'happy')
    // тёмное яблоко — Пыху
    await k.tell(pyx, 'dark_eat', 'laugh')
    const mouth = k.centerOf(pyx.el)
    k.sfx('crunch')
    await k.play(g.to(slicesA, { x: `+=${mouth.x - 810}`, y: `+=${mouth.y - 690}`, scale: 0.3, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.in' }))
    slicesA.forEach(s => s.remove())
    g.to([sad, glad], { scale: 0, opacity: 0, duration: 0.3 })
    k.after(350, () => { sad.remove(); glad.remove() })
    fadeAway([plateA])

    // ───── 5. светлое яблоко — в миску ─────
    bar.set(4)
    slicesB.forEach(s => { s.style.pointerEvents = 'auto' })
    await k.tapAll(slicesB, {
      prompt: k.key('q_bowl'), host: pyx,
      onTap: (el, i) => {
        const c = k.centerOf(el)
        g.to(el, { x: `+=${APP[i][0] - c.x}`, y: `+=${APP[i][1] - c.y - 60}`, rotation: k.rand(-20, 20), duration: 0.5, ease: 'power2.out' })
        g.to(el, { y: '+=60', duration: 0.3, delay: 0.5, ease: 'bounce.out' })
        k.after(700, () => k.sfx('plop', { vol: 0.6 }))
        track(el, APP[i])
      },
    })
    await k.wait(900)
    fadeAway([plateB])

    // ───── 6. перемешиваем ─────
    const spoon = k.prop(kitchen.spoonWood(), 1255, 470, 74, 240, { z: 25 })
    g.set(spoon, { opacity: 0 })
    g.to(spoon, { opacity: 1, duration: 0.3 })
    const CEN = { x: 1255, y: 622 }
    const SP = [...BAN, ...BER, ...APP]
    let stage = 0
    const reshuffle = () => {
      const spots = k.shuffle(SP.map((_, i) => i))
      pieces.forEach((p, i) => {
        const s = SP[spots[i]]
        g.to(p.el, { x: `+=${s[0] - p.x}`, y: `+=${s[1] - p.y}`, duration: 0.35, ease: 'power2.inOut' })
        p.x = s[0]; p.y = s[1]
      })
    }
    await k.stir(CEN, {
      radius: 90, turns: 2.5, prompt: k.key('q_stir'), host: pyx, spoon,
      moveSpoon: (x, y, a) => g.set(spoon, { x: x - 1255 + 4, y: y - 470 - 60, rotation: Math.cos(a) * 8 }),
      onProgress: p => { const s = Math.floor(p * 4); if (s > stage && p < 1) { stage = s; reshuffle() } },
    })
    reshuffle()
    g.to(spoon, { opacity: 0, y: -80, duration: 0.4 })
    k.after(450, () => spoon.remove())
    k.sparkle(1255, 600, 8)
    await kapaTo({ h: 0, s: 1, b: 1 })
    await k.tell(pyx, 'stir_ok', 'cheer')

    // ───── 7. по трём мискам: считаем ─────
    bar.set(5)
    const spots3 = [[500, 700], [680, 700], [860, 700]]
    const small = spots3.map(([x, y]) => k.prop(kitchen.bowl(), x, y, 160, 99, { z: 0 }))
    const owners = ['🦎', '🐲', '🧒'].map((e, i) => k.prop(`<span class="emoji" style="font-size:60px;line-height:1">${e}</span>`, spots3[i][0], 610, 80, 80, { z: 8 }))
    k.popIn([...small, ...owners])
    await k.wait(500)
    const spoon2 = k.prop(kitchen.spoonWood(), 1255, 470, 74, 240, { z: 25 })
    g.set(spoon2, { opacity: 0 })
    const bits = ['bananaSlice', 'strawberryHalf', 'appleHalf']
    let scoopQ = Promise.resolve()
    const scoop = i => {
      scoopQ = scoopQ.then(async () => {
        const [bx, by] = spots3[i]
        // ложка ныряет в большую миску и переносит кусочки
        g.set(spoon2, { x: 0, y: 0, rotation: 0, opacity: 1 })
        await k.play(g.to(spoon2, { x: 0, y: 60, duration: 0.25 }))
        k.sfx('stir', { vol: 0.6 })
        await k.play(g.to(spoon2, { x: bx - 1255 + 20, y: by - 470 - 130, rotation: -30, duration: 0.6, ease: 'power2.inOut' }))
        k.sfx('plop')
        for (let n = 0; n < 3; n++) {
          const el = k.food(bits[n], bx + (n - 1) * 34, by - 18 - (n === 1 ? 6 : 0), 46, { z: 9 })
          g.fromTo(el, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, delay: n * 0.08, ease: 'bounce.out' })
        }
        k.sayNumber(i + 1)
        await k.play(g.to(spoon2, { opacity: 0, y: '-=30', duration: 0.3 }))
      })
    }
    await k.tapAll(small, { prompt: k.key('q_serve'), host: pyx, onTap: (el, i) => scoop(small.indexOf(el)) })
    await scoopQ
    await k.tell(pyx, 'serve_ok', 'cheer')
    spoon2.remove()
    bar.done(5)

    // Капа угощается и снова радужная
    const to = k.centerOf(kapa.el), from = k.centerOf(small[0])
    k.sfx('crunch')
    await k.play(g.to(small[0], { x: to.x - from.x, y: to.y - from.y - 40, scale: 0.4, opacity: 0, duration: 0.8, ease: 'power2.in' }))
    kapa.emote('dance')
    await k.play(g.to(tint, { h: 360, s: 1.3, duration: 1.6, ease: 'none', onUpdate: paint }))
    tint.h = 0; paint()
    await k.tell(kapa, 'kapa_yum', 'cheer')
    k.burst(1455, 700, 10)
    await k.tell(pyx, 'sum', 'point')
    await k.tell(kapa, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
