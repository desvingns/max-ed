// «Кружки, палочки, кубики»: три заказа — три нарезки одной морковки (круг, палочка, кубик).
import { defineLevel, food, SIZE } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, C, R, HL, SH, S, rounded } from '../art.js'

// размеры «коробок» для cutLinear (он берёт пропорции из SIZE)
SIZE.carrotWide = [444, 120]
SIZE.carrotPlank = [300, 240]
SIZE.carrotBundle = [320, 164]

const CW = 590
const CH = Math.round((CW * 120) / 444)
const CAR = { x: 800, y: 640 }
const FLOOR = 960
const O = { base: '#FF9F43', shade: '#E8792B', light: '#FFC58A' }

/** Морковка целиком; чуть шире родной, чтобы ботва не срезалась clip-path'ом. */
const carrotWide = () => svg(444, 120, food('carrot').replace('width="100%" height="100%"', 'x="24" y="0" width="420" height="120"'))

const leafArt = () => svg(120, 110,
  P('M60 100Q14 78 18 26Q52 40 62 92Z', '#6BCB77', { sw: 4 }) +
  P('M60 100Q104 78 102 26Q68 40 58 92Z', '#6BCB77', { sw: 4 }) +
  P('M60 100Q36 52 60 6Q84 52 60 100Z', '#45B57C', { sw: 4 }))

/** Толстый кусок морковки сверху (вид на пластинку): 300×240. */
const plankArt = () => svg(300, 240,
  SH(150, 234, 130, 6) +
  S(rounded([[10, 10], [290, 10], [290, 226], [10, 226]], 30), O.base, O.shade, {
    extra: `<rect x="28" y="28" width="246" height="184" rx="20" fill="${O.light}"/>` +
      [70, 112, 154, 196, 238].map((x, i) => `<path d="M${x} ${44 + (i % 2) * 14}L${x} ${190 - ((i + 1) % 2) * 14}" stroke="#FFA95A" stroke-width="5" stroke-linecap="round"/>`).join(''),
  }) + HL(70, 44, 44, 8, -4, 0.6))

const stickArt = () => svg(70, 250,
  SH(35, 246, 26, 4) +
  S(rounded([[8, 6], [62, 6], [62, 244], [8, 244]], 16), O.base, O.shade, {
    extra: `<rect x="16" y="14" width="40" height="226" rx="10" fill="${O.light}"/>` +
      [30, 50].map(x => `<path d="M${x} 34L${x} 220" stroke="#FFA95A" stroke-width="4" stroke-linecap="round"/>`).join(''),
  }) + HL(24, 40, 5, 22, 0, 0.6))

/** Две палочки, лежащие рядом (для кубиков): 320×164. */
const bundleArt = () => {
  const bar = y => S(rounded([[4, y], [316, y], [316, y + 74], [4, y + 74]], 14), O.base, O.shade, {
    extra: `<rect x="12" y="${y + 8}" width="296" height="58" rx="8" fill="${O.light}"/>` +
      [50, 110, 170, 230, 290].map(x => `<path d="M${x} ${y + 18}L${x - 20} ${y + 56}" stroke="#FFA95A" stroke-width="4" stroke-linecap="round"/>`).join(''),
  })
  return svg(320, 164, SH(160, 160, 140, 5) + bar(4) + bar(86) + HL(60, 18, 40, 5, -3, 0.6))
}

const cubeArt = () => svg(84, 88,
  SH(42, 84, 32, 4) +
  P('M6 26L42 44L42 80L6 62Z', O.base, { sw: 4 }) +
  P('M78 26L42 44L42 80L78 62Z', O.shade, { sw: 4 }) +
  P('M42 8L78 26L42 44L6 26Z', O.light, { sw: 4 }) +
  HL(36, 24, 12, 4, 20, 0.7))

const iconCircle = () => svg(100, 100, C(50, 50, 42, O.base) + C(50, 50, 28, O.light, { sw: 0 }) + C(50, 50, 10, '#FFD9A8', { sw: 0 }))
const iconStick = () => svg(100, 100, [10, 40, 70].map(x => R(x, 6, 20, 88, 9, O.base)).join('') + [16, 46, 76].map(x => R(x, 14, 8, 72, 4, O.light, { sw: 0 })).join(''))

export default defineLevel({
  id: 'cut-carrot',
  async run(k) {
    const gsap = k.gsap
    k.kitchenBg()
    const board = k.food('board', 800, 690, 800, { z: 3 })
    const pyx = k.pyx({ x: 210 })
    k.fromTo(board, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })

    // ── помощники ──
    const newCarrot = () => {
      const el = k.prop(carrotWide(), CAR.x, CAR.y, CW, CH, { z: 6 })
      k.fromTo(el, { y: -420, rotation: -10, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
      k.sfx('boing', { vol: 0.5 })
      return el
    }
    const guestIn = async id => {
      const g = k.guest(id, 1780, FLOOR, { size: 280, face: 'left' })
      await g.moveTo({ x: 1450, y: FLOOR })
      g.face('left')
      return g
    }
    const guestOut = async g => {
      g.moveTo({ x: 1820, y: FLOOR })
      await k.wait(900)
      g.el.remove()
    }
    const orderBubble = icon => k.bubble(`<div style="width:96px;height:96px">${icon}</div>`, 1490, 580, { w: 180, h: 165, tail: 'right' })
    const fadeOut = (els, dur = 0.35) => { gsap.to(els, { opacity: 0, scale: 0.6, duration: dur, onComplete: () => els.forEach(e => e.remove()) }) }
    /** предмет летит гостю в рот и исчезает */
    const feed = async (el, guest, sfx = 'crunch') => {
      const c = k.centerOf(el), to = k.centerOf(guest.el)
      await k.play(gsap.to(el, { x: `+=${to.x - c.x}`, y: `+=${to.y - c.y - 40}`, scale: 0.3, rotation: k.rand(-40, 40), duration: 0.6, ease: 'power2.in' }))
      el.remove()
      k.sfx(sfx, { vol: 0.6 })
      guest.emote('happy')
    }

    await k.wait(500)
    await k.tell(pyx, 'hello', 'wave')

    // ═══ 1. кружочки в суп ═══
    const pig = await guestIn('pig')
    const b1 = orderBubble(iconCircle())
    await k.tell(pig, 'pig_order', 'happy')
    await k.tell(pyx, 'circles', 'point')
    const pot = k.prop(kitchen.pot({ lid: false, soup: true }), 1250, 610, 300, 230, { z: 5 })
    pot.querySelector('.kp-shadow')?.style.setProperty('visibility', 'hidden')
    k.popIn(pot)
    const carrot1 = newCarrot()
    await k.wait(700)
    const circles = []
    const res1 = await k.cutLinear({
      food: 'carrotWide', el: carrot1, at: CAR, width: CW, mode: 'slices', slice: 'carrotSlice', sliceW: 92,
      cuts: [0.14, 0.27, 0.4, 0.53, 0.66], tol: 0.07, juice: '#FFC58A',
      plate: { x: 1186, y: 566 }, plateStep: { x: 26, y: -4 },
      prompt: k.key('q_cut1'), host: pyx,
      onMiss: n => { if (n % 3 === 1) k.tell(pyx, 'miss') },
      onCut: async (i, info) => {
        const s = info.slice.el
        if (i === 0) {
          // первая «кружка» — зелёная макушка: она достаётся Хрюне
          info.slice.done.kill()
          s.innerHTML = leafArt()
          await Promise.all([k.tell(pyx, 'top', 'point'), feed(s, pig)])
          await k.tell(pig, 'top_pig')
        } else {
          circles.push(s)
          await k.sayNumber(i)
        }
      },
    })
    if (res1.tail) await feed(res1.tail, pig)
    res1.clear()
    // кружочки — бульк! — в суп
    circles.forEach((c, i) => k.after(i * 150, () => { gsap.to(c, { y: '+=46', scale: 0.55, opacity: 0, duration: 0.35, ease: 'power2.in' }); k.sfx('bloop') }))
    await k.wait(900)
    k.burst(1250, 500, 8)
    await k.tell(pig, 'soup_done', 'cheer')
    await k.tell(pyx, 'circles_sum', 'nod')
    fadeOut([b1, pot])
    await guestOut(pig)

    // ═══ 2. палочки-хрумтелки ═══
    const hen = await guestIn('hen')
    const b2 = orderBubble(iconStick())
    await k.tell(hen, 'hen_order', 'happy')
    await k.tell(pyx, 'sticks', 'point')
    const carrot2 = newCarrot()
    await k.wait(700)
    const res2 = await k.cutLinear({
      food: 'carrotWide', el: carrot2, at: CAR, width: CW, mode: 'split', cuts: [0.34, 0.67], tol: 0.07, gap: 46,
      prompt: k.key('q_thick'), host: pyx,
      onMiss: n => { if (n % 3 === 1) k.tell(pyx, 'miss') },
      onCut: async () => { await k.wait(400) },
    })
    const chunks = res2.pieces.map(p => p.el)
    const mid = chunks[1]
    // тап по среднему куску: небольшая невидимая «кнопка», чтобы подсветка обвела именно кусок
    const tapper = k.prop('', CAR.x + 4, CAR.y, 230, 150, { z: 20 })
    tapper.style.borderRadius = '50%'
    await k.tapOnEl(tapper, { prompt: k.key('q_pick'), host: pyx })
    tapper.remove()
    // остальное — курочке, средний кусок «ложится плашмя»
    const flatten = async () => {
      await Promise.all([feed(chunks[0], hen), feed(chunks[2], hen)])
      const c0 = k.centerOf(mid)
      await k.play(gsap.to(mid, { x: `+=${800 - c0.x}`, y: `+=${590 - c0.y}`, duration: 0.5, ease: 'power2.inOut' }))
    }
    await Promise.all([k.tell(pyx, 'scraps', 'point'), flatten()])
    const plank = k.prop(plankArt(), 800, 590, 300, 240, { z: 6 })
    gsap.set(plank, { scale: 0.6, opacity: 0 })
    k.sfx('whoosh')
    gsap.to(mid, { opacity: 0, scale: 1.35, duration: 0.35 })
    await k.play(gsap.to(plank, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }))
    mid.remove()
    const eyes = k.bubble('👀', 590, 470, { w: 150, h: 140, font: 62, tail: 'right' })
    await k.tell(pyx, 'flat', 'point')
    fadeOut([eyes])
    const res3 = await k.cutLinear({
      food: 'carrotPlank', el: plank, at: { x: 800, y: 590 }, width: 300, mode: 'split', cuts: [0.25, 0.5, 0.75], tol: 0.1, gap: 26,
      prompt: k.key('q_sticks'), host: pyx,
      onMiss: n => { if (n % 3 === 1) k.tell(pyx, 'miss') },
      onCut: async () => { await k.wait(300) },
    })
    const sticks = res3.pieces.map(p => {
      const w = (p.b - p.a) * 300
      const cx = 650 + ((p.a + p.b) / 2) * 300 + (Number(gsap.getProperty(p.el, 'x')) || 0)
      const el = k.prop(stickArt(), cx, 590, Math.round(w * 0.9), 236, { z: 7 })
      gsap.from(el, { scale: 0.7, duration: 0.35, ease: 'back.out(2.5)' })
      return el
    })
    res3.clear()
    k.sfx('pop')
    k.burst(800, 470, 8)
    let n2 = 0
    const flights2 = []
    await k.tapAll(sticks, {
      prompt: k.key('sticks_done'), host: pyx,
      onTap: el => { n2++; k.sayNumber(n2); flights2.push(feed(el, hen)) },
    })
    await Promise.all(flights2)
    await k.tell(hen, 'hen_eat', 'cheer')
    fadeOut([b2])
    await guestOut(hen)

    // ═══ 3. кубики в салат ═══
    const ham = await guestIn('shchyok')
    const b3 = orderBubble(cubeArt())
    await k.tell(ham, 'ham_order', 'happy')
    await k.tell(pyx, 'cubes', 'point')
    const bowl = k.prop(kitchen.bowl(), 1250, 640, 260, 160, { z: 5 })
    k.popIn(bowl)
    const bundle = k.prop(bundleArt(), 800, 600, 320, 164, { z: 6 })
    k.fromTo(bundle, { y: -400, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    k.sfx('boing', { vol: 0.5 })
    await k.wait(700)
    const res4 = await k.cutLinear({
      food: 'carrotBundle', el: bundle, at: { x: 800, y: 600 }, width: 320, mode: 'split', cuts: [0.25, 0.5, 0.75], tol: 0.1, gap: 22,
      prompt: k.key('q_cubes'), host: pyx,
      onMiss: n => { if (n % 3 === 1) k.tell(pyx, 'miss') },
      onCut: async () => { await k.wait(300) },
    })
    res4.clear()
    const cubes = []
    for (let j = 0; j < 4; j++) for (let r = 0; r < 2; r++) {
      const cx = 800 - 160 + (j + 0.5) * 80 + (j - 1.5) * 22
      const cy = 518 + 40 + r * 84
      const el = k.prop(cubeArt(), cx, cy, 80, 84, { z: 7 })
      gsap.from(el, { scale: 0.5, opacity: 0, duration: 0.35, delay: (j * 2 + r) * 0.05, ease: 'back.out(2.5)' })
      cubes.push(el)
    }
    k.sfx('pop')
    k.burst(800, 480, 8)
    let n3 = 0
    const flights3 = []
    await k.tapAll(cubes, {
      prompt: k.key('q_bowl'), host: pyx,
      onTap: el => {
        n3++
        k.sayNumber(n3)
        flights3.push((async () => {
          const c = k.centerOf(el)
          const tx = 1250 + k.rand(-55, 55), ty = 600 + k.rand(-8, 10)
          await k.play(gsap.to(el, { x: `+=${tx - c.x}`, y: `+=${ty - c.y - 70}`, scale: 0.55, rotation: k.rand(-25, 25), duration: 0.5, ease: 'power2.out' }))
          await k.play(gsap.to(el, { y: `+=${70}`, duration: 0.25, ease: 'bounce.out' }))
          el.style.zIndex = '9'
          k.sfx('plop', { vol: 0.5 })
        })())
      },
    })
    await Promise.all(flights3)
    k.burst(1250, 560, 8)
    await k.tell(ham, 'salad_done', 'cheer')
    fadeOut([b3])

    // ═══ итог ═══
    const icons = [iconCircle(), iconStick(), cubeArt()]
    const sum = icons.map((ic, i) => k.bubble(`<div style="width:100px;height:100px">${ic}</div>`, 560 + i * 240, 500, { w: 200, h: 180, tail: i % 2 ? 'right' : 'left' }))
    await k.tell(pyx, 'shapes', 'cheer')
    await k.narrate('sum')
    await k.tell(ham, 'bye', 'cheer')
    fadeOut([...sum, bowl, ...cubes])
    k.burst(800, 420, 14)
  },
})
