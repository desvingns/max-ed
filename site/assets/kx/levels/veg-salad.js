// «Овощной салат» — рецепт по шагам: помыть → нарезать → в миску → соль → масло → перемешать.
// Цвета (красный/зелёный), счёт кусочков (три и четыре: зелёных больше), щепотка и ложка «в самый раз».
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, F, E, C, HL, S, nid } from '../art.js'

// Обход бага ui.stepsBar: у .kx-step стоит transition:transform, из-за чего gsap.from запоминает «промежуточную» позицию
// и поздние иконки навсегда съезжают вверх. Через секунду сбрасываем inline-transform (заодно оживает .now{scale}).
const stepsBar = (k, icons, o) => { const b = k.stepsBar(icons, o); k.after(1300, () => k.gsap.set([...b.el.children], { clearProps: 'transform' })); return b }

const thumb = name => `<div style="width:56px;height:56px">${food(name)}</div>`

// ─── тазик с водой: задняя часть (вода) и передняя стенка ───
const basinBack = () => svg(520, 250,
  E(260, 84, 246, 60, '#E6F4FF') + E(260, 90, 216, 44, '#7FCBFF', { sw: 0 }) +
  '<path d="M90 84Q130 70 176 82M330 96Q380 84 430 98" fill="none" stroke="#BDE6FF" stroke-width="6" stroke-linecap="round"/>' +
  [[120, 100, 9], [150, 108, 6], [380, 108, 8], [420, 90, 6], [300, 118, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".85" stroke="#9CC3DD" stroke-width="3"/>`).join(''))
const basinFront = () => svg(520, 250,
  S('M14 84A246 60 0 0 0 506 84L472 206Q464 238 420 240L100 240Q56 238 48 206Z', '#FF8FC8', '#E86AAE', { extra: '<path d="M60 170Q260 200 460 170" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".5"/>' }) +
  HL(70, 150, 6, 26, 10, 0.55))

// «ложка масла»: круглый ковшик с зелёной полоской-меткой и маслом (класс .oil двигаем по уровню)
const oilSpoonArt = () => {
  const id = nid('o')
  return svg(260, 120,
    P('M118 50L248 44Q258 44 258 53Q258 62 248 64L118 68Z', '#DDE6F2') +
    `<clipPath id="${id}"><ellipse cx="66" cy="62" rx="60" ry="42"/></clipPath>` +
    E(66, 62, 60, 42, '#F4F6FC') +
    `<g clip-path="url(#${id})"><rect x="0" y="20" width="140" height="84" fill="#FFF8EC"/><rect x="0" y="28.4" width="140" height="29.4" fill="#6BCB77" opacity=".42"/><rect class="oil" x="0" y="104" width="140" height="90" fill="#FFC93C"/></g>` +
    E(66, 62, 60, 42, 'none') + HL(36, 40, 14, 5, -25, 0.7))
}

// «кучка» кружочков на тарелке (совпадает с раскладкой cutLinear: plateStep {x:12, y:-8})
const STEP = { x: 12, y: -8 }
const pileHtml = (name, n, w) => Array.from({ length: n }, (_, i) =>
  `<div style="position:absolute;left:${STEP.x * i}px;top:${-STEP.y * (n - 1 - i)}px;width:${w}px;height:${w}px">${food(name)}</div>`).join('')

// куда ложатся кусочки в миске (центры, в координатах сцены)
const SPOTS = [[1210, 606], [1262, 604], [1312, 608], [1180, 632], [1232, 630], [1284, 632], [1336, 634]]

// ── речь и эмоции без наложений ──
// «Корневые» эмоции героя (ура, смех, прыжок…) нельзя запускать внахлёст: gsap путает SVG-origin'ы, и герой «уезжает» с экрана.
const ROOT_DUR = { cheer: 1.5, jump: 1.1, laugh: 1.0, dance: 1.8, happy: 0.85, surprised: 1.3, sad: 2.0, spin: 0.9, bow: 1.3 }
function speech(k) {
  const busy = new Map()
  const gate = async (c, d) => {
    const w = (busy.get(c) ?? 0) - performance.now()
    if (w > 0) await k.wait(w)
    busy.set(c, performance.now() + d * 1000)
  }
  const emote = async (c, e) => {
    if (!c || !e) return
    if (ROOT_DUR[e]) await gate(c, ROOT_DUR[e])
    if (k.alive) c.emote(e)
  }
  const tell = async (c, id, e) => { emote(c, e); await k.tell(c, id) }
  const praise = async c => { await gate(c, 1.1); await k.praise(c) }
  return { emote, tell, praise }
}

export default defineLevel({
  id: 'veg-salad',
  async run(k) {
    const g = k.gsap
    const { emote, tell, praise } = speech(k)
    const FLOOR = k.layout.floorY
    k.kitchenBg()
    const pyx = k.pyx({ x: 230 })
    const busya = k.guest('busya', 1450, FLOOR, { size: 250, face: 'left' })
    const fadeAway = (els, y = 120) => { g.to(els, { y: `+=${y}`, opacity: 0, duration: 0.4, ease: 'power2.in' }); k.after(450, () => els.forEach(e => e.remove())) }
    const sprinkle = (x, y, n = 14) => {
      for (let i = 0; i < n; i++) {
        const gr = k.prop('<div style="width:100%;height:100%;background:#fff;border-radius:2px;box-shadow:0 0 0 2px #C9DFF0"></div>', x + k.rand(-30, 30), y, 9, 9, { z: 15 })
        k.to(gr, { y: k.rand(70, 110), x: k.rand(-20, 20), opacity: 0, duration: 0.5, delay: i * 0.03, ease: 'power1.in', onComplete: () => gr.remove() })
      }
    }

    await k.wait(400)
    await tell(pyx, 'hello', 'wave')
    await tell(busya, 'busya_hi', 'happy')
    const bar = stepsBar(k, ['🚿', thumb('knife'), '🥣', thumb('saltShaker'), thumb('oil'), '🥄'])
    bar.set(0)

    // ───── 1. моем овощи в тазике ─────
    const B = { x: 760, y: 610 }
    const back = k.prop(basinBack(), B.x, B.y, 520, 250, { z: 4 })
    const tomato = k.food('tomato', 700, 575, 150, { z: 5 })
    const cuc = k.food('cucumber', 835, 592, 290, { z: 5 })
    g.set(cuc, { rotation: -6 })
    const front = k.prop(basinFront(), B.x, B.y, 520, 250, { z: 6 })
    k.fromTo([back, front, tomato, cuc], { y: -160, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'bounce.out' })
    k.sfx('splash')
    // грязь на овощах
    const specks = [[672, 548, 8], [720, 540, 6], [700, 600, 7], [742, 578, 5], [760, 585, 7], [810, 588, 7], [860, 570, 6], [900, 598, 7], [935, 590, 5]].map(([x, y, r], i) => {
      const el = k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:#8B5E3C;box-shadow:inset -2px -2px 0 rgba(0,0,0,.25)"></div>`, x, y, r * 2, r * 2, { z: 7 })
      return { el, th: 0.12 + (i / 8) * 0.8, gone: false }
    })
    await k.wait(700)
    const washZone = k.prop('', 765, 585, 470, 190, { z: 0 })
    let lastB = 0, tickled = false
    await k.scrub(washZone, {
      need: 850, prompt: k.key('q_wash'), host: pyx,
      onProgress: (p, pos) => {
        specks.forEach(s => { if (!s.gone && p >= s.th) { s.gone = true; g.to(s.el, { opacity: 0, scale: 0, duration: 0.3 }); k.sfx('bloop', { vol: 0.35 }) } })
        g.to([tomato, cuc], { y: k.rand(-4, 4), duration: 0.05, overwrite: 'auto' })
        const now = performance.now()
        if (pos && now - lastB > 110) {
          lastB = now
          const b = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:rgba(255,255,255,.75);box-shadow:0 0 0 3px #9CC3DD"></div>', pos.x + k.rand(-18, 18), pos.y, k.rand(14, 30), k.rand(14, 30), { z: 8 })
          k.to(b, { y: -k.rand(50, 90), x: k.rand(-15, 15), opacity: 0, duration: 0.8, ease: 'power1.out', onComplete: () => b.remove() })
        }
        if (!tickled && p > 0.4) { tickled = true; tell(pyx, 'tickle', 'laugh') }
      },
    })
    specks.forEach(s => s.el.remove())
    g.to([tomato, cuc], { y: 0, duration: 0.2 })
    k.sparkle(700, 540, 6); k.sparkle(860, 560, 6)
    k.sfx('sparkle')
    await tell(pyx, 'wash_ok', 'happy')
    fadeAway([back, front, tomato, cuc, washZone])

    // ───── 2. режем помидор и огурец ─────
    bar.set(1)
    const board = k.food('board', 600, 690, 470, { z: 3 })
    const plate = k.prop(kitchen.plate(), 960, 705, 290, 100, { z: 0 })
    k.fromTo([board, plate], { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
    await k.wait(500)
    const tom = k.food('tomato', 600, 645, 220, { z: 6 })
    k.fromTo(tom, { y: -420, rotation: -12, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    k.sfx('boing', { vol: 0.5 })
    await k.wait(700)
    const PLATE_TOM = { x: 895, y: 684 }, PLATE_CUC = { x: 1010, y: 684 }
    const slicesT = []
    const resT = await k.cutLinear({
      food: 'tomato', el: tom, at: { x: 600, y: 645 }, width: 220, mode: 'slices', slice: 'tomatoSlice', sliceW: 78,
      cuts: [0.25, 0.5, 0.75], tol: 0.11, plate: PLATE_TOM, plateStep: STEP, juice: '#FF9A9A',
      prompt: k.key('q_cut'), host: pyx,
      onCut: async (i, info) => { slicesT.push(info.slice.el); await k.sayNumber(i + 1) },
    })
    g.to(resT.tail, { y: -40, opacity: 0, duration: 0.4 })
    k.after(450, () => resT.clear())
    await k.wait(500)
    const pileT = k.prop(pileHtml('tomatoSlice', 3, 78), PLATE_TOM.x + (STEP.x * 2) / 2, PLATE_TOM.y + (STEP.y * 2) / 2, 78 + STEP.x * 2, 78 - STEP.y * 2, { z: 0 })
    slicesT.forEach(s => s.remove())
    await tell(pyx, 'red3', 'cheer')

    await tell(pyx, 'cuc_next', 'point')
    const cuc2 = k.food('cucumber', 600, 655, 440, { z: 6 })
    k.fromTo(cuc2, { y: -420, rotation: 10, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    k.sfx('boing', { vol: 0.5 })
    await k.wait(700)
    const slicesC = []
    const resC = await k.cutLinear({
      food: 'cucumber', el: cuc2, at: { x: 600, y: 655 }, width: 440, mode: 'slices', slice: 'cucumberSlice', sliceW: 78,
      cuts: [0.2, 0.4, 0.6, 0.8], tol: 0.07, plate: PLATE_CUC, plateStep: STEP,
      onCut: async (i, info) => { slicesC.push(info.slice.el); await k.sayNumber(i + 1) },
    })
    g.to(resC.tail, { y: -40, opacity: 0, duration: 0.4 })
    k.after(450, () => resC.clear())
    await k.wait(500)
    const pileC = k.prop(pileHtml('cucumberSlice', 4, 78), PLATE_CUC.x + (STEP.x * 3) / 2, PLATE_CUC.y + (STEP.y * 3) / 2, 78 + STEP.x * 3, 78 - STEP.y * 3, { z: 0 })
    slicesC.forEach(s => s.remove())
    await tell(pyx, 'green4', 'cheer')
    g.to(board, { opacity: 0, y: 60, duration: 0.4 })
    k.after(450, () => board.remove())

    // ───── 3. в миску ─────
    bar.set(2)
    const bowl = k.prop(kitchen.bowl(), 1250, 650, 300, 185, { z: 5 })
    k.popIn(bowl)
    await k.wait(500)
    const pieces = []
    const spotRel = i => ({ x: SPOTS[i][0] - 1100, y: SPOTS[i][1] - 557.5 })
    const addPiece = (name, i) => {
      const s = spotRel(i)
      const d = document.createElement('div')
      d.style.cssText = `position:absolute;left:${s.x - 27}px;top:${s.y - 27}px;width:54px;height:54px;z-index:${3 + i}`
      d.innerHTML = food(name)
      bowl.appendChild(d)
      pieces.push({ el: d, spot: i })
      return d
    }
    const pour = async (pile, name, n, first) => {
      await k.dnd({
        items: [{ id: name, el: pile }], zones: [{ id: 'bowl', el: bowl }],
        prompt: k.key(name === 'tomatoSlice' ? 'q_bowl_red' : 'q_bowl_green'), host: pyx,
        accept: () => true,
        onCorrect: async it => {
          it.el.style.zIndex = '20'
          const c = k.centerOf(it.el)
          await k.play(g.to(it.el, { x: `+=${1250 - c.x}`, y: `+=${520 - c.y}`, rotation: 25, duration: 0.45, ease: 'power2.out' }))
          for (let i = 0; i < n; i++) {
            const idx = first + i
            const d = addPiece(name, idx)
            g.fromTo(d, { y: -110, opacity: 0, scale: 0.6 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'bounce.out' })
            k.sfx('plop', { vol: 0.6 })
            await k.sayNumber(i + 1)
          }
          g.to(it.el, { opacity: 0, duration: 0.25 })
          k.after(300, () => it.el.remove())
        },
      })
    }
    await pour(pileT, 'tomatoSlice', 3, 0)
    await k.wait(200)
    await pour(pileC, 'cucumberSlice', 4, 3)
    fadeAway([plate], 0)

    // больше / меньше
    const b3 = k.badge('3', 1180, 470, { size: 96, color: '#FF5A5F' })
    const b4 = k.badge('4', 1320, 470, { size: 96, color: '#6BCB77' })
    await k.choose({
      prompt: k.key('q_more'), host: pyx, skill: 'math:more',
      options: [
        { id: 'red', art: food('tomatoSlice'), color: '#FF5A5F', outcome: async () => { await tell(pyx, 'more_no', 'think') } },
        { id: 'green', art: food('cucumberSlice'), color: '#6BCB77', correct: true, outcome: async () => { k.burst(1250, 520, 8); await tell(busya, 'more_ok', 'cheer') } },
      ],
    })
    g.to([b3, b4], { scale: 0, opacity: 0, duration: 0.3 })
    k.after(350, () => { b3.remove(); b4.remove() })

    // ───── 4. щепотка соли ─────
    bar.set(3)
    const shaker = k.food('saltShaker', 1250, 400, 110, { z: 12 })
    k.popIn(shaker)
    await k.tapN(shaker, 1, { prompt: k.key('q_salt'), host: pyx })
    k.sfx('sprinkle')
    await k.play(g.to(shaker, { rotation: 160, y: 70, duration: 0.35, ease: 'power2.out' }))
    sprinkle(1250, 530, 14)
    await k.wait(600)
    g.to(shaker, { rotation: 0, y: 0, duration: 0.3, ease: 'back.out(2)' })
    await tell(pyx, 'salt_ok', 'happy')
    fadeAway([shaker], -80)

    // ───── 5. ложка масла ─────
    bar.set(4)
    const bottle = k.food('oil', 1040, 470, 84, { z: 12 })
    const spoonEl = k.prop(oilSpoonArt(), 1238, 523, 220, 102, { z: 14 })
    const oilRect = spoonEl.querySelector('.oil')
    const setOil = v => oilRect.setAttribute('y', String(104 - v * 84))
    k.fromTo([bottle, spoonEl], { y: -200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
    await k.wait(650)
    const stream = k.prop('<div style="width:100%;height:100%;border-radius:5px;background:repeating-linear-gradient(to bottom,#FFC93C 0 14px,#FFE27A 14px 24px)"></div>', 1184, 490, 10, 70, { z: 13 })
    g.set(stream, { opacity: 0, transformOrigin: '50% 0%' })
    const pourPose = () => g.to(bottle, { x: 50, y: -45, rotation: 105, duration: 0.3, ease: 'power2.out' })
    const restPose = () => g.to(bottle, { x: 0, y: 0, rotation: 0, duration: 0.3, ease: 'back.out(1.6)' })
    let streamTw = null
    const streamOn = () => { g.to(stream, { opacity: 1, duration: 0.1 }); streamTw?.kill(); streamTw = g.fromTo(stream.firstChild, { backgroundPositionY: 0 }, { backgroundPositionY: '48px', duration: 0.5, repeat: -1, ease: 'none' }) }
    const streamOff = () => { g.to(stream, { opacity: 0, duration: 0.15 }); streamTw?.kill() }
    let missed = 0
    await k.hold(bottle, {
      duration: 2.4, goal: [0.56, 0.9], prompt: k.key('q_oil'), host: pyx, sfx: 'pour',
      onStart: () => { pourPose(); streamOn() },
      onLevel: v => { setOil(v); g.set(stream, { height: Math.max(20, 70 - v * 30) }) },
      onRelease: () => { restPose(); streamOff() },
      onOver: async () => {
        restPose(); streamOff()
        k.sfx('yuck', { vol: 0.5 })
        for (let i = 0; i < 6; i++) {
          const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#FFC93C"></div>', 1184 + k.rand(-50, 50), 540, 14, 14, { z: 15 })
          k.to(d, { y: k.rand(60, 120), opacity: 0, duration: 0.6, delay: i * 0.04, onComplete: () => d.remove() })
        }
        emote(pyx, 'surprised')
        await tell(pyx, 'oil_over')
      },
      onMiss: () => { if (++missed % 2 === 1) tell(pyx, 'oil_less') },
    })
    streamOff()
    await tell(pyx, 'oil_ok', 'cheer')
    // выливаем ложку в салат
    await k.play(g.to(spoonEl, { x: 60, y: 30, duration: 0.4, ease: 'power2.inOut' }))
    g.set(spoonEl, { transformOrigin: '25% 50%' })
    await k.play(g.to(spoonEl, { rotation: -38, duration: 0.35, ease: 'power2.out' }))
    k.sfx('pour', { vol: 0.8 })
    for (let i = 0; i < 8; i++) {
      const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#FFC93C"></div>', 1246 + k.rand(-14, 14), 560, 12, 14, { z: 15 })
      k.to(d, { y: k.rand(40, 70), opacity: 0, duration: 0.5, delay: i * 0.05, onComplete: () => d.remove() })
    }
    g.to(oilRect, { attr: { y: 104 }, duration: 0.4 })
    const sheen = document.createElement('div')
    sheen.style.cssText = 'position:absolute;left:60px;top:20px;width:190px;height:60px;border-radius:50%;background:radial-gradient(ellipse at 40% 40%,rgba(255,236,150,.7),rgba(255,236,150,0) 70%);z-index:20;opacity:0;pointer-events:none'
    bowl.appendChild(sheen)
    g.to(sheen, { opacity: 1, duration: 0.6 })
    await k.wait(650)
    fadeAway([bottle, spoonEl, stream], -60)

    // ───── 6. перемешиваем ─────
    bar.set(5)
    const spoon = k.prop(kitchen.spoonWood(), 1250, 470, 74, 240, { z: 25 })
    g.set(spoon, { opacity: 0 })
    g.to(spoon, { opacity: 1, duration: 0.3 })
    const C0 = { x: 1250, y: 618 }
    let stage = 0
    const reshuffle = () => {
      const spots = k.shuffle(SPOTS.map((_, i) => i))
      pieces.forEach((p, i) => {
        p.spot = spots[i]
        const s = spotRel(p.spot)
        g.to(p.el, { left: s.x - 27, top: s.y - 27, duration: 0.35, ease: 'power2.inOut' })
      })
    }
    await k.stir(C0, {
      radius: 90, turns: 2.5, prompt: k.key('q_stir'), host: pyx, spoon,
      moveSpoon: (x, y, a) => g.set(spoon, { x: x - 1250 + 4, y: y - 470 - 60, rotation: Math.cos(a) * 8 }),
      onProgress: p => {
        const s = Math.floor(p * 4)
        if (s > stage && p < 1) { stage = s; reshuffle() }
      },
    })
    reshuffle()
    g.to(spoon, { opacity: 0, y: -80, duration: 0.4 })
    k.after(450, () => spoon.remove())
    k.sfx('sparkle')
    k.sparkle(1250, 600, 8)
    await tell(pyx, 'stir_ok', 'cheer')
    bar.done(5)

    // ───── угощаем Busya ─────
    const to = k.centerOf(busya.el), from = k.centerOf(bowl)
    k.sfx('crunch')
    await k.play(g.to(bowl, { x: to.x - from.x, y: to.y - from.y - 50, scale: 0.35, opacity: 0, duration: 0.8, ease: 'power2.in' }))
    emote(busya, 'happy')
    await tell(busya, 'busya_yum', 'cheer')
    k.burst(1400, 700, 10)
    await tell(pyx, 'sum', 'point')
    await tell(busya, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
