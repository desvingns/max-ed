// «Пицца» — три акта: (1) тесто скалкой, (2) соус по кругу, сыр, начинка по фигурам,
// (3) духовка со взрослым, разрез на 8 частей (cutRound) и «поровну» — 8 кусочков на 4 друзей.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, L, F, E, C, R, HL, SH, S, rounded, circlePath, nid, INK } from '../art.js'

const PC = { x: 850, y: 690 } // центр пиццы на доске
const PIZ = 420 // размер элемента пиццы (viewBox 300 → масштаб 1.4)
const SC = PIZ / 300
const R_VIS = 130 * SC // видимый радиус пиццы, px

// ── свои спрайты ─────────────────────────────────────────────
const doughBallArt = () => svg(200, 200,
  SH(100, 184, 66, 6) +
  S('M30 110C24 60 64 30 104 32C150 34 178 70 170 116C164 156 130 176 96 174C56 172 34 150 30 110Z', '#F6E0B0', '#E2C07C') +
  [[70, 84], [120, 66], [142, 112], [92, 134], [64, 118]].map(([x, y]) => C(x, y, 3.2, '#E2C07C', { sw: 0 })).join('') +
  HL(72, 66, 26, 10, -30, 0.7))

/** красный слой соуса на всю пиццу (300×300) */
const sauceArt = () => svg(300, 300,
  C(150, 150, 106, '#E8473F', { sw: 0 }) + C(150, 150, 92, '#FF6B55', { sw: 0 }) +
  L('M78 128Q112 76 196 86', '#FF9A85', 9) + L('M92 206Q150 240 222 198', '#D23C36', 8) +
  [[104, 118, 20], [196, 152, -30], [138, 196, 60], [176, 104, 10], [112, 170, -50]].map(([x, y, r]) => E(x, y, 8, 4.2, '#4FB35A', { sw: 0, rot: r })).join(''))

const shredsSvg = (() => {
  let out = ''
  for (let i = 0; i < 50; i++) {
    const a = i * 2.399, r = 6 + ((i * 29) % 82)
    const x = (150 + Math.cos(a) * r).toFixed(1), y = (150 + Math.sin(a) * r).toFixed(1), rot = (i * 53) % 180
    out += `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x - 9} ${y}q9 -9 18 0" fill="none" stroke="#F2B824" stroke-width="5.4" stroke-linecap="round"/><path d="M${x - 8} ${y - 1}q8 -7 16 0" fill="none" stroke="#FFF0A0" stroke-width="2.4" stroke-linecap="round"/></g>`
  }
  return out
})()
/** слой сыра (300×300) */
const cheeseArt = () => svg(300, 300, C(150, 150, 98, '#FFE788', { sw: 0, attr: 'opacity=".9"' }) + shredsSvg)

/** фигурки начинки: круг-колбаска, треугольник-сыр, квадрат-перец. Центр (0,0), размер ±40 */
const SHAPE_PATH = {
  circle: circlePath(0, 0, 38),
  tri: rounded([[0, -40], [44, 34], [-44, 34]], 9),
  sq: rounded([[-36, -36], [36, -36], [36, 36], [-36, 36]], 12),
}
const topG = shape => {
  if (shape === 'circle') return C(0, 0, 38, '#FF9AA2') + C(0, 0, 26, '#FFC5C9', { sw: 0 }) + E(-12, -14, 8, 4, '#fff', { sw: 0, rot: -30, attr: 'opacity=".65"' }) + [[10, 8], [-8, 13], [15, -6]].map(([x, y]) => C(x, y, 2.6, '#E0707C', { sw: 0 })).join('')
  if (shape === 'tri') return P(SHAPE_PATH.tri, '#FFD93D') + [[0, 6, 7], [-17, 22, 5], [17, 20, 5]].map(([x, y, r]) => C(x, y, r, '#F2B824', { sw: 3 })).join('') + E(-8, -12, 5, 3, '#fff', { sw: 0, rot: -50, attr: 'opacity=".7"' })
  return P(SHAPE_PATH.sq, '#6BCB77') + R(-24, -24, 48, 48, 8, '#A5E39B', { sw: 0 }) + [[-8, -6], [8, 8], [10, -10]].map(([x, y]) => E(x, y, 3, 5, '#FFF6C4', { sw: 0 })).join('')
}
const topArt = shape => svg(100, 100, `<g transform="translate(50 50)">${topG(shape)}</g>`)
const ghostArt = shape => svg(100, 100, `<g transform="translate(50 50)"><path d="${SHAPE_PATH[shape]}" fill="rgba(255,255,255,.55)" stroke="${INK}" stroke-width="5" stroke-dasharray="11 9" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/></g>`)

// места начинки на пицце (px от центра)
const SPOTS = [
  { shape: 'circle', x: 0, y: -95 }, { shape: 'tri', x: 84, y: -48 }, { shape: 'sq', x: 84, y: 48 },
  { shape: 'circle', x: 0, y: 95 }, { shape: 'tri', x: -84, y: 48 }, { shape: 'sq', x: -84, y: -48 },
]
const TOP_LINE = { circle: 'top_circle', tri: 'top_tri', sq: 'top_sq' }

/** пицца целиком (300×300): сырая или запечённая */
const pizzaSvg = baked => svg(300, 300,
  SH(150, 286, 120, 8) +
  S(circlePath(150, 150, 130), baked ? '#D89448' : '#F0C070', baked ? '#B57230' : '#D9A04E') +
  C(150, 150, 108, baked ? '#F2BC62' : '#FFE3A8', { sw: 0 }) +
  C(150, 150, 106, '#E8473F', { sw: 0 }) + C(150, 150, 92, '#FF6B55', { sw: 0 }) +
  C(150, 150, 100, baked ? '#FFD04A' : '#FFE788', { sw: 0 }) + shredsSvg +
  (baked ? [[104, 96, 16], [196, 118, 13], [150, 206, 15], [92, 168, 11], [206, 178, 10]].map(([x, y, r]) => E(x, y, r, r * 0.6, '#E39A38', { sw: 0, attr: 'opacity=".5"' })).join('') + HL(96, 84, 40, 12, -40, 0.35) : '') +
  SPOTS.map(s => `<g transform="translate(${(150 + s.x / SC).toFixed(1)} ${(150 + s.y / SC).toFixed(1)}) scale(.69)">${topG(s.shape)}</g>`).join('') +
  (baked ? '' : HL(96, 84, 40, 12, -40, 0.4)))

const hourglassArt = () => {
  const cid = nid('hg')
  const glass = 'M26 24L104 24Q104 78 72 100Q104 122 104 178L26 178Q26 122 58 100Q26 78 26 24Z'
  return svg(130, 204,
    SH(65, 198, 50, 5) + R(14, 6, 102, 18, 8, '#C68B59') + R(14, 180, 102, 18, 8, '#C68B59') + F(glass, '#E6F6FF') +
    `<clipPath id="${cid}"><path d="${glass}"/></clipPath><g clip-path="url(#${cid})">` +
    '<path class="sand-top" d="M20 40L110 40L110 100L20 100Z" fill="#FFD93D"/><path class="sand-bot" d="M20 112L110 112L110 190L20 190Z" fill="#FFD93D"/>' +
    '<line class="stream" x1="65" y1="100" x2="65" y2="182" stroke="#FFD93D" stroke-width="4" stroke-linecap="round" opacity="0"/></g>' +
    P(glass, 'none', { sw: 5 }) + HL(40, 50, 4, 16, 10, 0.7))
}

const cheeseMoundArt = () => svg(260, 160,
  S('M40 56C46 26 92 12 130 12C168 12 214 26 220 56C196 68 64 68 40 56Z', '#FFE066', '#F2B824') +
  [[84, 38, 10], [130, 26, -20], [172, 40, 30], [106, 52, 60], [154, 52, -40], [126, 44, 5]].map(([x, y, r]) => E(x, y, 12, 3.4, '#FFF0A0', { sw: 0, rot: r })).join(''))

export default defineLevel({
  id: 'pizza',
  async run(k) {
    const gsap = k.gsap
    const L0 = k.layout
    k.kitchenBg()
    const pyx = k.pyx({ x: 230 })
    const bar = k.stepsBar(['🥖', '🍅', '🧀', '🌭', '🔥', '🔪', '🍽️'])
    const board = k.food('board', 850, 700, 840, { z: 3 })
    k.fromTo(board, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    const clamp01 = v => Math.max(0, Math.min(1, v))
    const mama = () => k.bubble('👩‍🍳', 330, 250, { w: 230, h: 190, font: 90 })
    const dropMama = b => gsap.to(b, { scale: 0, autoAlpha: 0, duration: 0.3, onComplete: () => b.remove() })

    await k.wait(500)
    bar.set(0)
    await k.tell(pyx, 'hello', 'wave')

    // ═══ Акт 1. Тесто ═══
    const ball = k.prop(doughBallArt(), PC.x, PC.y, 150, 150, { z: 6 })
    const base = k.food('pizzaBase', PC.x, PC.y, PIZ, { z: 5 })
    gsap.set(base, { scale: 0.3, opacity: 0 })
    k.popIn(ball)
    const pinY0 = PC.y - 235
    const pin = k.food('rollingPin', PC.x, pinY0, 320, { z: 14 })
    k.popIn(pin)
    await k.wait(500)
    await k.scrub(ball, {
      area: { x: PC.x - 210, y: PC.y - 210, w: 420, h: 420, cx: PC.x, cy: PC.y }, need: 1200,
      prompt: k.key('dough_q'), host: pyx,
      onProgress: (p, pos) => {
        const t = clamp01((p - 0.04) / 0.3)
        gsap.set(ball, { opacity: 1 - t, scale: 1 + p })
        gsap.set(base, { opacity: t, scale: 0.34 + 0.66 * p })
        if (pos) gsap.set(pin, { x: pos.x - PC.x, y: pos.y - pinY0 })
      },
    })
    ball.remove()
    gsap.set(base, { opacity: 1 })
    gsap.fromTo(base, { scale: 1.05 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' })
    gsap.to(pin, { y: -180, opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: () => pin.remove() })
    k.sfx('plop')
    k.burst(PC.x, PC.y, 8)
    await k.tell(pyx, 'dough_ok', 'cheer')

    // ═══ Акт 2а. Соус ═══
    bar.set(1)
    const sauce = k.prop(sauceArt(), PC.x, PC.y, PIZ, PIZ, { z: 6 })
    gsap.set(sauce, { scale: 0.05, opacity: 0 })
    const sBowl = k.food('sauceBowl', 1190, 650, 190, { z: 8 })
    k.fromTo(sBowl, { x: 300, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    await k.wait(500)
    await k.tapN(sBowl, 1, { prompt: k.key('sauce_tap'), host: pyx })
    await k.play(gsap.to(sBowl, { x: PC.x + 70 - 1190, y: PC.y - 150 - 650, rotation: -40, duration: 0.6, ease: 'power2.inOut' }))
    k.sfx('plop')
    gsap.set(sauce, { opacity: 1 })
    gsap.to(sauce, { scale: 0.16, duration: 0.35, ease: 'back.out(2)' })
    await k.play(gsap.to(sBowl, { x: 0, y: 0, rotation: 0, duration: 0.6, ease: 'power2.inOut' }))
    const spoon = k.prop(kitchen.spoonWood(), PC.x, PC.y - 56.5, 60, 195, { z: 15 })
    gsap.set(spoon, { transformOrigin: '50% 79%' })
    k.popIn(spoon)
    await k.stir(PC, {
      radius: 130, turns: 2, spoon, prompt: k.key('sauce_q'), host: pyx,
      moveSpoon: (cx, cy, a) => gsap.set(spoon, { x: cx - PC.x, y: cy - PC.y, rotation: Math.cos(a) * 8 }),
      onProgress: p => gsap.set(sauce, { scale: 0.16 + 0.84 * p }),
    })
    gsap.to(spoon, { opacity: 0, y: -60, duration: 0.4, onComplete: () => spoon.remove() })
    gsap.to(sBowl, { x: 320, opacity: 0, duration: 0.5, ease: 'back.in(1.4)', onComplete: () => sBowl.remove() })
    k.sfx('correct')
    await k.tell(pyx, 'sauce_ok', 'cheer')

    // ═══ Акт 2б. Сыр (натирает мама) ═══
    bar.set(2)
    await k.tell(pyx, 'cheese_adult', 'point')
    const mb = mama()
    const cBowl = k.prop(kitchen.bowl(), 1190, 690, 230, 142, { z: 8 })
    const cMound = k.prop(cheeseMoundArt(), 1190, 690, 230, 142, { z: 9 })
    gsap.set(cMound, { scaleY: 0, transformOrigin: '50% 70%' })
    const grater = k.food('grater', 1190, 585, 130, { z: 10 })
    const block = k.food('cheese', 1180, 470, 100, { z: 11 })
    gsap.set(block, { rotation: 20 })
    k.fromTo([cBowl, grater, block], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
    await k.wait(900)
    for (let i = 0; i < 3; i++) {
      k.sfx('grate')
      await k.play(gsap.to(block, { y: 95, x: 8, duration: 0.3, ease: 'power1.in' }))
      for (let j = 0; j < 4; j++) {
        const s = k.prop(`<svg viewBox="0 0 30 12" width="100%" height="100%"><path d="M3 8q12 -10 24 0" fill="none" stroke="#F2B824" stroke-width="5" stroke-linecap="round"/></svg>`, 1185 + k.rand(-20, 20), 640, 26, 10, { z: 12 })
        k.to(s, { y: k.rand(40, 60), opacity: 0, rotation: k.rand(-40, 40), duration: 0.4, delay: j * 0.04, ease: 'power1.in', onComplete: () => s.remove() })
      }
      gsap.to(cMound, { scaleY: (i + 1) / 3, duration: 0.3, ease: 'back.out(2)' })
      await k.play(gsap.to(block, { y: 0, x: 0, duration: 0.25, ease: 'power1.out' }))
    }
    dropMama(mb)
    gsap.to([grater, block], { opacity: 0, y: 40, duration: 0.4, onComplete: () => { grater.remove(); block.remove() } })
    const cheese = k.prop(cheeseArt(), PC.x, PC.y, PIZ, PIZ, { z: 7 })
    gsap.set(cheese, { opacity: 0 })
    let lastShred = 0
    await k.scrub(cheese, {
      need: 1000, sfx: 'sprinkle', prompt: k.key('cheese_q'), host: pyx,
      onProgress: (p, pos) => {
        gsap.set(cheese, { opacity: clamp01(p * 1.05) })
        gsap.set(cMound, { scaleY: 1 - 0.85 * p })
        const now = performance.now()
        if (pos && now - lastShred > 60) {
          lastShred = now
          const s = k.prop(`<svg viewBox="0 0 30 12" width="100%" height="100%"><path d="M3 8q12 -10 24 0" fill="none" stroke="#F2B824" stroke-width="5" stroke-linecap="round"/></svg>`, pos.x + k.rand(-14, 14), pos.y - 30, 26, 10, { z: 16 })
          k.to(s, { y: k.rand(30, 60), opacity: 0, rotation: k.rand(-50, 50), duration: 0.45, ease: 'power1.in', onComplete: () => s.remove() })
        }
      },
    })
    gsap.set(cheese, { opacity: 1 })
    gsap.to([cBowl, cMound], { opacity: 0, y: 40, duration: 0.4, onComplete: () => { cBowl.remove(); cMound.remove() } })
    k.sparkle(PC.x, PC.y, 6)
    await k.tell(pyx, 'cheese_ok', 'cheer')

    // ═══ Акт 2в. Начинка по фигурам ═══
    bar.set(3)
    const ghosts = SPOTS.map(s => ({ ...s, taken: false, el: k.prop(ghostArt(s.shape), PC.x + s.x, PC.y + s.y, 100, 100, { z: 9 }) }))
    k.popIn(ghosts.map(g => g.el), 0.06)
    const cols = [[520, 590], [520, 710], [520, 830], [1180, 590], [1180, 710], [1180, 830]]
    const order = k.shuffle(['circle', 'tri', 'sq', 'sq', 'circle', 'tri'])
    const items = order.map((shape, i) => ({ id: `${shape}${i}`, shape, el: k.prop(topArt(shape), cols[i][0], cols[i][1], 100, 100, { z: 20 }) }))
    k.fromTo(items.map(i => i.el), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(2)' })
    await k.wait(600)
    let placedShapes = 0
    await k.dnd({
      items, zones: ghosts.map(g => ({ id: g.shape, shape: g.shape, g, el: g.el, pad: 30 })),
      prompt: k.key('top_q'), host: pyx,
      accept: (it, z) => z.shape === it.shape && !z.g.taken,
      onCorrect: async (it, z) => {
        z.g.taken = true
        const c = k.centerOf(it.el), t = k.centerOf(z.el)
        gsap.to(it.el, { x: `+=${t.x - c.x}`, y: `+=${t.y - c.y}`, duration: 0.3, ease: 'power2.out' })
        gsap.to(z.el, { opacity: 0, scale: 0.6, duration: 0.3 })
        k.sparkle(t.x, t.y, 5)
        placedShapes++
        await k.tell(pyx, TOP_LINE[it.shape], 'happy')
      },
      onWrong: async (it, z) => { if (z) await k.oops(pyx) },
    })
    await k.tell(pyx, 'top_sum', 'cheer')

    // цельная пицца вместо слоёв
    const pizza = k.prop(pizzaSvg(false), PC.x, PC.y, PIZ, PIZ, { z: 6 })
    ;[base, sauce, cheese, ...items.map(i => i.el), ...ghosts.map(g => g.el)].forEach(e => e.remove())

    // ═══ Акт 3а. Духовка — со взрослым ═══
    bar.set(4)
    await k.play(gsap.to(board, { opacity: 0, y: 40, duration: 0.5 }))
    gsap.to(pizza, { x: 0, y: 175, scale: 0.44, duration: 0.6, ease: 'power2.inOut' })
    const st = k.stove()
    const knobs = [...st.el.querySelectorAll('.knob')]
    const light = st.el.querySelector('.power-light')
    await k.tell(pyx, 'oven_adult', 'point')
    const mb2 = mama()
    k.sfx('magic')
    await k.tell(pyx, 'oven_mama', 'wave')
    await k.line(pyx, 'e.kitchen-omelet.mama_ok', 'nod')
    dropMama(mb2)
    const dial = st.knobEl(1)
    await k.tapOnEl(dial, { prompt: k.key('oven_tap'), host: pyx })
    dial.remove()
    gsap.to(knobs[1], { rotation: 90, svgOrigin: knobs[1].getAttribute('data-origin') ?? undefined, duration: 0.45, ease: 'back.out(2)' })
    gsap.to(light, { autoAlpha: 1, duration: 0.3 })
    k.sfx('whoosh')
    const glow = k.prop('<div style="width:100%;height:100%;border-radius:14px;background:linear-gradient(#FFD36B,#FF7A3D);box-shadow:0 0 30px 8px rgba(255,140,60,.7)"></div>', 820, 646, 160, 42, { z: 5 })
    gsap.fromTo(glow, { opacity: 0 }, { opacity: 0.9, duration: 0.8 })
    await k.wait(600)
    // пицца уезжает в духовку
    await k.play(gsap.to(pizza, { x: 820 - PC.x, y: 646 - PC.y, scale: 0.26, duration: 0.9, ease: 'power2.inOut' }))
    gsap.to(pizza, { opacity: 0, duration: 0.25 })
    // песочные часы
    const hg = k.prop(hourglassArt(), 1160, 590, 116, 182, { z: 8 })
    k.popIn(hg)
    const sandTop = hg.querySelector('.sand-top'), sandBot = hg.querySelector('.sand-bot'), stream = hg.querySelector('.stream')
    gsap.set(sandTop, { scaleY: 0, svgOrigin: '65 100' })
    gsap.set(sandBot, { scaleY: 1, svgOrigin: '65 190' })
    await k.wait(400)
    await k.tapOnEl(hg, { prompt: k.key('oven_in'), host: pyx })
    await k.play(gsap.to(hg, { rotation: 180, duration: 0.6, ease: 'back.inOut(1.4)' }))
    gsap.set(hg, { rotation: 0 })
    gsap.set(sandTop, { scaleY: 1, svgOrigin: '65 100' })
    gsap.set(sandBot, { scaleY: 0, svgOrigin: '65 190' })
    gsap.set(stream, { opacity: 1 })
    k.tell(pyx, 'oven_wait')
    gsap.to(sandTop, { scaleY: 0, svgOrigin: '65 100', duration: 3.4, ease: 'none' })
    gsap.to(sandBot, { scaleY: 1, svgOrigin: '65 190', duration: 3.4, ease: 'none' })
    const tick = k.every(500, () => k.sfx('tick', { vol: 0.8 }))
    await k.wait(900)
    for (let n = 1; n <= 3; n++) { await k.sayNumber(n); await k.wait(650) }
    await k.wait(700)
    tick()
    gsap.to(stream, { opacity: 0, duration: 0.2 })
    k.sfx('ding')
    gsap.fromTo(glow, { scaleX: 1 }, { scaleX: 1.1, yoyo: true, repeat: 3, duration: 0.12 })
    gsap.to(hg, { opacity: 0, y: 40, duration: 0.4, onComplete: () => hg.remove() })
    await k.tell(pyx, 'ding', 'cheer')
    // достаём прихваткой
    const mitt = k.prop(kitchen.mitt(), 1120, 500, 120, 152, { z: 14 })
    k.popIn(mitt)
    await k.tapOnEl(mitt, { prompt: k.key('mitt_q'), host: pyx })
    await k.play(gsap.to(mitt, { x: 820 - 1120, y: 620 - 500, rotation: -20, duration: 0.5, ease: 'power2.inOut' }))
    gsap.to([glow, light], { autoAlpha: 0, duration: 0.4 })
    gsap.to(knobs[1], { rotation: 0, svgOrigin: knobs[1].getAttribute('data-origin') ?? undefined, duration: 0.4 })
    pizza.innerHTML = pizzaSvg(true)
    board.style.zIndex = '5'
    gsap.to(board, { opacity: 1, y: 0, duration: 0.5 })
    gsap.set(pizza, { opacity: 1 })
    k.sfx('pop')
    gsap.to(mitt, { x: 0, y: 0, rotation: 0, opacity: 0, duration: 0.5, delay: 0.3, onComplete: () => mitt.remove() })
    await k.play(gsap.to(pizza, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }))
    for (let i = 0; i < 3; i++) {
      const s = k.prop(kitchen.steam(), PC.x + k.rand(-90, 90), PC.y - 40, 120, 87, { z: 12 })
      k.fromTo(s, { y: 0, opacity: 0.9, scale: 0.7 }, { y: -110, opacity: 0, scale: 1.3, duration: 1.6, delay: i * 0.3, ease: 'power1.out', onComplete: () => s.remove() })
    }
    st.el.remove()
    await k.tell(pyx, 'oven_out', 'happy')

    // ═══ Акт 3б. Режем на 8 частей ═══
    bar.set(5)
    const cutLines = { 0: 'cut_half', 1: 'cut_four', 2: 'cut_six', 3: 'cut_eight' }
    const res = await k.cutRound({
      el: pizza, at: PC, size: PIZ, angles: [90, 0, 45, 135], prompt: k.key('cut_q'), host: pyx,
      onCut: async (i, info) => {
        // cutRound клонирует уже скрытый (opacity:0) элемент — возвращаем видимость секторам
        k.world.querySelectorAll('.ep-prop').forEach(e => { if (e.style.clipPath) e.style.opacity = '1' })
        k.sparkle(PC.x, PC.y, 4)
        await k.tell(pyx, cutLines[i], i === 3 ? 'cheer' : 'happy')
      },
    })
    pizza.style.pointerEvents = 'none'
    // считаем кусочки: раз, два, … восемь
    const secs = [...res.sectors].sort((a, b) => a.a0 - b.a0)
    const mid = s => (((s.a0 + s.a1) / 2) * Math.PI) / 180
    const CEN = 118 // расстояние центроида клина от центра, px
    secs.forEach(s => gsap.set(s.el, { transformOrigin: `${PIZ / 2 + Math.cos(mid(s)) * CEN}px ${PIZ / 2 + Math.sin(mid(s)) * CEN}px` }))
    const badges = []
    for (let i = 0; i < secs.length; i++) {
      const s = secs[i]
      const bx = PC.x + Math.cos(mid(s)) * (CEN + 22), by = PC.y + Math.sin(mid(s)) * (CEN + 22)
      badges.push(k.badge(String(i + 1), bx, by, { size: 66 }))
      gsap.fromTo(s.el, { scale: 1 }, { scale: 1.06, yoyo: true, repeat: 1, duration: 0.14 })
      await k.sayNumber(i + 1)
    }
    await k.wait(300)
    gsap.to(badges, { opacity: 0, scale: 0.5, duration: 0.3, onComplete: () => badges.forEach(b => b.remove()) })

    // ═══ Акт 3в. Делим поровну на четверых ═══
    bar.set(6)
    gsap.to(board, { opacity: 0, duration: 0.4 })
    await k.play(gsap.to(secs.map(s => s.el), { y: '-=170', duration: 0.6, ease: 'power2.inOut' }))
    const FR = [
      { id: 'busya', x: 540, face: 'right', line: 'busya_thx' }, { id: 'shchyok', x: 790, face: 'right', line: 'shchyok_thx' },
      { id: 'chukh', x: 1050, face: 'left', line: 'chukh_thx' }, { id: 'tarabar', x: 1310, face: 'left', line: 'tarabar_thx' },
    ]
    const friends = FR.map(f => ({ ...f, char: k.guest(f.id, f.x, L0.floorY, { size: 230, face: f.face }), count: 0 }))
    k.fromTo(friends.map(f => f.char.el), { y: 300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' })
    k.sfx('whoosh')
    await k.wait(900)
    await k.tell(pyx, 'friends', 'point')
    const plates = friends.map(f => ({ ...f, el: k.food('plate2', f.x, 930, 210, { z: 12 }) }))
    k.popIn(plates.map(p => p.el), 0.08)
    await k.wait(400)
    await k.dnd({
      items: secs.map((s, i) => ({ id: `s${i}`, el: s.el, sec: s })),
      zones: plates.map(p => ({ id: p.id, el: p.el, fr: p, pad: 70 })),
      prompt: k.key('share_q'), host: pyx,
      accept: (it, z) => z.fr.count < 2,
      onCorrect: async (it, z) => {
        const f = z.fr
        const j = f.count++
        const m = mid(it.sec)
        const cur = k.centerOf(it.el)
        const cx = cur.x + Math.cos(m) * CEN, cy = cur.y + Math.sin(m) * CEN
        const tx = f.x + (j ? 42 : -42), ty = 906
        const rot = ((270 - (m * 180) / Math.PI + 540) % 360) - 180
        it.el.style.zIndex = '20'
        gsap.to(it.el, { x: `+=${tx - cx}`, y: `+=${ty - cy}`, scale: 0.46, rotation: rot, duration: 0.45, ease: 'power2.out' })
        await k.wait(450)
        k.sfx('plop')
        await k.sayNumber(j + 1)
        if (f.count === 2) {
          f.char.emote('happy')
          k.sparkle(f.x, 860, 5)
          await k.tell(f.char, f.line)
        }
      },
      onWrong: async (it, z) => { if (z) { pyx.emote('think'); await k.tell(pyx, 'plate_full') } },
    })
    await k.tell(pyx, 'share_ok', 'cheer')
    // все едят
    k.sfx('crunch')
    friends.forEach(f => f.char.emote('happy'))
    await k.play(gsap.to(secs.map(s => s.el), { opacity: 0, scale: 0.1, duration: 0.6, stagger: 0.05, ease: 'power2.in' }))
    k.burst(800, 780, 14)
    await k.tell(pyx, 'sum', 'point')
    await k.tell(friends[0].char, 'bye', 'cheer')
    bar.done(6)
    k.burst(800, 420, 14)
  },
})
