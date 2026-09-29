// «Торт для друга» — рецепт «по порядку»: корж → крем → корж → крем → в самом конце ягоды;
// Буся называет возраст (случайно 2–5) — ставим ровно столько свечек и считаем; свечи зажигает взрослый;
// Тарабар поёт; дуем (тапы) — свечки гаснут по одной.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, L, F, E, C, R, HL, SH, S, rounded, circlePath, star, nid, INK } from '../art.js'

/** stepsBar с обходом бага тулкита (gsap.from + CSS-transition на transform → последние иконки «залипают»). */
function stepsBar(k, icons) {
  const bar = k.stepsBar(icons)
  const kids = [...bar.el.children]
  k.gsap.killTweensOf(kids)
  k.gsap.set(kids, { clearProps: 'transform' })
  k.gsap.fromTo(bar.el, { y: -130 }, { y: 0, duration: 0.6, ease: 'back.out(2)' })
  return bar
}

// ── геометрия торта (центр по x, дно первого коржа) ──
const CAKE = { x: 800, base: 705, w: 380 }
const LAYER_H = { sponge: 62, cream: 34 }

// ── спрайты ──
const SPONGE = '#E8B36B', SPONGE_SH = '#C98A44', CREAM = '#FFF8F0', CREAM_SH = '#F2DDE2'
/** слой коржа (широкий) */
const spongeArt = () => svg(380, 62,
  S('M20 10Q190 -4 360 10Q376 12 376 30L376 44Q376 60 354 60L26 60Q4 60 4 44L4 30Q4 12 20 10Z', SPONGE, SPONGE_SH) +
  [[70, 34], [130, 26], [200, 38], [260, 28], [320, 36], [100, 46], [230, 48]].map(([x, y]) => C(x, y, 3.2, '#B87B38', { sw: 0 })).join('') + HL(90, 20, 60, 5, -2, 0.5))
/** слой крема с волнистыми краями */
const creamArt = () => svg(380, 36,
  S('M14 10Q190 -2 366 10Q380 12 376 20Q380 30 360 30Q350 40 330 30Q310 42 290 30Q270 42 250 30Q230 42 210 30Q190 42 170 30Q150 42 130 30Q110 42 90 30Q70 42 50 30Q30 34 20 30Q0 28 4 20Q0 12 14 10Z', CREAM, CREAM_SH) + HL(110, 12, 70, 3.4, -1, 0.9))
/** миска ягод */
const berryPlateArt = () => svg(170, 130,
  SH(85, 122, 66, 5) + S('M12 60Q12 118 85 118Q158 118 158 60Z', '#FFFFFF', '#DCE8F5') +
  [[48, 52, '#FF5A5F'], [82, 42, '#E0474C'], [116, 52, '#FF5A5F'], [64, 66, '#FF8A8A'], [100, 66, '#B04EC8']].map(([x, y, c]) => C(x, y, 17, c) + HL(x - 5, y - 6, 4, 2.4, -35, 0.7)).join('') +
  E(85, 60, 78, 12, 'none') + HL(36, 92, 4, 14, 8, 0.7))
const berryArt = col => svg(60, 60, SH(30, 56, 20, 3) + C(30, 32, 22, col) + HL(22, 24, 6, 3.4, -35, 0.7) + P('M22 12L30 4L38 12L30 16Z', '#6BCB77', { sw: 3 }))
/** тарелка-подставка */
const standArt = () => svg(460, 90,
  SH(230, 84, 200, 5, 0.16) + E(230, 46, 218, 32, '#FFFFFF') + E(230, 50, 150, 18, '#E6F0FA', { sw: 0 }) + E(230, 46, 218, 32, 'none') + HL(120, 32, 40, 5, -6, 0.8))

const CANDLE_COL = ['#FF5A5F', '#4D96FF', '#FFD93D', '#6BCB77', '#FF8FC8']
const candleArt = col => svg(46, 150,
  SH(23, 146, 16, 3) + S(rounded([[10, 46], [36, 46], [36, 142], [10, 142]], 9), col, '#00000000') +
  [30, 70, 110].map(y => `<path d="M10 ${y}L36 ${y + 12}" stroke="#fff" stroke-width="7" opacity=".75" stroke-linecap="round"/>`).join('') + L('M23 46L23 34', INK, 4))
const flameArt = () => svg(46, 60,
  P('M23 4C32 18 40 26 38 40C36 52 30 56 23 56C16 56 10 52 8 40C6 26 14 18 23 4Z', '#FF8A3D', { sw: 3.5 }) +
  F('M23 26C28 34 33 38 31 46C30 52 27 54 23 54C19 54 16 52 15 46C13 38 18 34 23 26Z', '#FFD93D'))
const smokeArt = () => svg(60, 80, L('M30 78Q14 60 30 44Q46 28 30 8', '#9A93A8', 7, 'opacity=".65"'))

export default defineLevel({
  id: 'cake',
  async run(k) {
    const gsap = k.gsap
    const L0 = k.layout
    k.kitchenBg()
    const pyx = k.pyx({ x: 230 })
    const busya = k.guest('busya', 1390, L0.floorY, { size: 280, face: 'left' })
    const bar = stepsBar(k, ['🎂', '🍓', '🕯️', '🔥', '💨'])
    const AGE = k.pick([2, 3, 4, 5])
    const dropMama = b => gsap.to(b, { scale: 0, autoAlpha: 0, duration: 0.3, onComplete: () => b.remove() })

    // стойка для торта
    const stand = k.prop(standArt(), CAKE.x, CAKE.base + 20, 460, 90, { z: 3 })
    k.fromTo(stand, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    await k.wait(500)
    bar.set(0)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(busya, 'busya_hi', 'jump')

    // ═══ 1. слои по порядку ═══
    const SEQ = ['sponge', 'cream', 'sponge', 'cream', 'berry']
    const shelf = [
      { id: 'sp1', kind: 'sponge', art: spongeArt(), w: 190, h: 31, x: 470, y: 850, line: 'layer_sponge' },
      { id: 'cr1', kind: 'cream', art: creamArt(), w: 190, h: 34, x: 700, y: 850, line: 'layer_cream' },
      { id: 'sp2', kind: 'sponge', art: spongeArt(), w: 190, h: 31, x: 930, y: 850, line: 'layer_sponge2' },
      { id: 'cr2', kind: 'cream', art: creamArt(), w: 190, h: 34, x: 1160, y: 850, line: 'layer_cream2' },
    ]
    // раскладка на полке — перемешана, но массив items идёт в нужном порядке для подсказки
    const xs = k.shuffle([470, 700, 930, 1160])
    const layerItems = SEQ.slice(0, 4).map((kind, i) => {
      const src = shelf.find(s => s.kind === kind && !s.used)
      src.used = true
      return { ...src, x: xs[i], el: null }
    })
    layerItems.forEach(it => { it.el = k.prop(it.art, it.x, 850, 250, it.kind === 'sponge' ? 41 : 24, { z: 20 }) })
    const berryBox = { id: 'berries', kind: 'berry', x: 1330, el: k.prop(berryPlateArt(), 1330, 830, 170, 130, { z: 20 }) }
    // ягоды: по порядку — последними; положим тарелку в общий список
    const items = [...layerItems, berryBox]
    // позиция: слева направо в перемешанном порядке, ягоды справа (не путается со слоями)
    k.fromTo(items.map(i => i.el), { y: 250, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)' })
    await k.wait(500)

    // невидимая «зона торта» шире тарелки: чуть выше — над стопкой
    const zoneEl = k.prop('', CAKE.x, CAKE.base - 120, 440, 320, { z: 2 })
    const zone = { id: 'cake', el: zoneEl, pad: 30 }
    let step = 0, stackTop = CAKE.base
    const layerEls = []
    const WRONG = { sponge: 'wrong_sponge', cream: 'wrong_cream', berry: 'wrong_berry' }
    await k.dnd({
      items, zones: [zone],
      prompt: k.key('layer_q'), host: pyx,
      accept: it => it.kind === SEQ[step],
      onCorrect: async it => {
        if (it.kind === 'berry') {
          step++
          return
        }
        const h = LAYER_H[it.kind]
        const w = it.kind === 'sponge' ? CAKE.w : CAKE.w
        const cy = stackTop - h / 2
        const c = k.centerOf(it.el)
        // настоящий слой (без drag-обёртки) — создаём на торте, а перетаскиваемую заготовку убираем
        it.el.style.zIndex = '30'
        await k.play(gsap.to(it.el, { x: `+=${CAKE.x - c.x}`, y: `+=${cy - 50 - c.y}`, scale: w / 250 * 0.95, duration: 0.4, ease: 'power2.out' }))
        const layer = k.prop(it.kind === 'sponge' ? spongeArt() : creamArt(), CAKE.x, cy, w, h, { z: 6 + step })
        gsap.fromTo(layer, { y: -40, scaleY: 1.3, opacity: 0 }, { y: 0, scaleY: 1, opacity: 1, duration: 0.3, ease: 'bounce.out' })
        it.el.remove()
        k.sfx('plop')
        layerEls.push(layer)
        stackTop -= h - (it.kind === 'sponge' ? 6 : 8)
        step++
        pyx.emote('happy')
        await k.tell(pyx, it.line)
      },
      onWrong: async (it, z) => {
        if (!z) return
        pyx.emote(it.kind === 'berry' ? 'laugh' : 'shake')
        await k.tell(pyx, it.kind === 'berry' ? 'wrong_berry' : step === 0 ? 'wrong_first' : WRONG[SEQ[step]])
      },
      until: placed => step >= 4,
    })
    zoneEl.remove()

    // ═══ 2. ягоды в самом конце ═══
    bar.set(1)
    await k.tell(pyx, 'layer_berry', 'point')
    const berryCols = ['#FF5A5F', '#E0474C', '#FF5A5F', '#B04EC8', '#FF5A5F']
    const bxy = [-150, -75, 0, 75, 150].map(dx => ({ x: CAKE.x + dx, y: stackTop + 2 }))
    const bItems = berryCols.map((c, i) => ({ id: `b${i}`, el: k.prop(berryArt(c), 520 + i * 90, 850, 60, 60, { z: 20 }) }))
    gsap.to(berryBox.el, { opacity: 0, y: 60, duration: 0.3, onComplete: () => berryBox.el.remove() })
    k.fromTo(bItems.map(b => b.el), { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(1.6)' })
    await k.wait(500)
    const topZoneEl = k.prop('', CAKE.x, stackTop - 60, 420, 200, { z: 2 })
    let nb = 0
    await k.dnd({
      items: bItems, zones: [{ id: 'top', el: topZoneEl, pad: 40 }],
      prompt: k.key('berry_q'), host: pyx,
      accept: () => true,
      onCorrect: async it => {
        const p = bxy[nb++]
        const c = k.centerOf(it.el)
        it.el.style.zIndex = '30'
        await k.play(gsap.to(it.el, { x: `+=${p.x - c.x}`, y: `+=${p.y - c.y}`, scale: 0.8, duration: 0.35, ease: 'power2.out' }))
        k.sfx('plop')
        k.sparkle(p.x, p.y, 3)
        await k.sayNumber(nb)
      },
    })
    topZoneEl.remove()
    k.burst(CAKE.x, stackTop - 50, 10)
    await k.tell(pyx, 'berry_ok', 'cheer')

    // ═══ 3. свечки по возрасту ═══
    bar.set(2)
    await k.tell(pyx, 'age_ask', 'point')
    busya.emote('happy')
    const ageBadge = k.badge(String(AGE), 1390, 600, { size: 130, color: '#FFB938' })
    await k.tell(busya, `age_${AGE}`, 'cheer')
    await k.tell(pyx, 'candle_q', 'point')
    const CY = stackTop - 66 // центр свечи (высота 100), стоит позади ягод
    const cxs = Array.from({ length: AGE }, (_, i) => CAKE.x + (i - (AGE - 1) / 2) * 68)
    const candles = Array.from({ length: 5 }, (_, i) => ({ id: `c${i}`, col: CANDLE_COL[i], el: k.prop(candleArt(CANDLE_COL[i]), 520 + i * 90, 850, 46, 150, { z: 20 }) }))
    // 5 свечек в коробке, ставим ровно AGE
    k.fromTo(candles.map(c => c.el), { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(1.6)' })
    await k.wait(500)
    const candleZoneEl = k.prop('', CAKE.x, stackTop - 100, 440, 240, { z: 2 })
    let nc = 0
    const placedCandles = []
    await k.dnd({
      items: candles, zones: [{ id: 'topc', el: candleZoneEl, pad: 40 }],
      prompt: null, host: pyx,
      accept: () => true,
      until: () => nc >= AGE,
      onCorrect: async it => {
        const x = cxs[nc]
        nc++
        const c = k.centerOf(it.el)
        it.el.style.zIndex = '30'
        await k.play(gsap.to(it.el, { x: `+=${x - c.x}`, y: `+=${CY - c.y}`, scale: 0.67, duration: 0.35, ease: 'power2.out' }))
        k.sfx('plop')
        placedCandles.push({ el: it.el, x, id: it.id })
        it.el.style.zIndex = '40'
        await k.sayNumber(nc)
      },
    })
    candleZoneEl.remove()
    // лишние свечки — в коробку (убираем)
    candles.filter(c => !placedCandles.some(p => p.id === c.id)).forEach(c => gsap.to(c.el, { opacity: 0, y: '+=60', duration: 0.3, onComplete: () => c.el.remove() }))
    k.burst(CAKE.x, CY - 30, 10)
    await k.tell(pyx, `candle_ok_${AGE}`, 'cheer')
    gsap.to(ageBadge, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => ageBadge.remove() })

    // ═══ 4. зажигает взрослый ═══
    bar.set(3)
    await k.tell(pyx, 'light_adult', 'point')
    const mb = k.bubble('👩‍🍳', 330, 250, { w: 230, h: 190, font: 90 })
    k.sfx('magic')
    await k.tell(pyx, 'light_mama', 'wave')
    dropMama(mb)
    // торт — «кнопка»: маленькая невидимая цель поверх торта
    const cakeBtn = k.prop('', CAKE.x, stackTop - 20, 380, 220, { z: 45 })
    await k.tapOnEl(cakeBtn, { prompt: k.key('light_tap'), host: pyx })
    const flames = placedCandles.map(p => {
      const f = k.prop(flameArt(), p.x, CY - 76, 46, 60, { z: 41 })
      gsap.set(f, { transformOrigin: '50% 100%' })
      gsap.fromTo(f, { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(2.5)', delay: 0.15 * placedCandles.indexOf(p) })
      gsap.to(f, { scaleY: 1.12, scaleX: 0.92, duration: 0.16, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.6 })
      return f
    })
    k.sfx('whoosh')
    await k.wait(900)
    await k.tell(pyx, 'lit', 'happy')
    // Тарабар поёт
    const tarabar = k.guest('tarabar', 1120, L0.floorY, { size: 250, face: 'left' })
    k.fromTo(tarabar.el, { y: 300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' })
    await k.wait(650)
    tarabar.emote('dance')
    const note = () => { const n = k.prop('<span class="emoji" style="font-size:54px">🎵</span>', 1040 + k.rand(-30, 60), 700, 60, 60, { z: 60 }); k.to(n, { y: -140, x: k.rand(-40, 40), opacity: 0, duration: 1.4, ease: 'power1.out', onComplete: () => n.remove() }) }
    const notes = k.every(350, note)
    await k.tell(tarabar, 'sing')
    await k.tell(tarabar, 'sing2')
    notes()
    busya.emote('happy')
    await k.tell(busya, 'wish', 'nod')

    // ═══ 5. дуем: одна свечка за тап ═══
    bar.set(4)
    cakeBtn.remove()
    const blowBtn = k.prop('', CAKE.x, stackTop - 20, 380, 220, { z: 45 })
    let out = 0
    await k.tapN(blowBtn, AGE, {
      prompt: k.key('blow_q'), host: pyx,
      onTap: async i => {
        const f = flames[i - 1]
        const p = placedCandles[i - 1]
        k.sfx('swish')
        const puff = k.prop('<span class="emoji" style="font-size:80px">💨</span>', CAKE.x - 240, CY - 40, 90, 90, { z: 60 })
        gsap.fromTo(puff, { x: 0, opacity: 1, scale: 0.6 }, { x: 150 + (i - 1) * 40, opacity: 0, scale: 1.3, duration: 0.6, ease: 'power1.out', onComplete: () => puff.remove() })
        await k.wait(250)
        gsap.killTweensOf(f)
        gsap.to(f, { scale: 0, opacity: 0, duration: 0.2, onComplete: () => f.remove() })
        const sm = k.prop(smokeArt(), p.x, CY - 80, 40, 54, { z: 41 })
        gsap.fromTo(sm, { y: 0, opacity: 0.9 }, { y: -70, opacity: 0, duration: 1.4, ease: 'power1.out', onComplete: () => sm.remove() })
        out++
        await k.sayNumber(i)
        if (i === 1 && AGE > 1) k.tell(pyx, 'blow_1')
        else if (i < AGE) k.tell(pyx, 'blow_more')
        else k.tell(pyx, 'blow_all')
      },
    })
    blowBtn.remove()
    await k.wait(400)
    k.sfx('tada')
    k.burst(CAKE.x, CY - 60, 16)
    busya.emote('cheer')
    tarabar.emote('dance')
    await k.tell(busya, 'hooray', 'jump')
    await k.tell(pyx, 'cut', 'point')
    await k.tell(pyx, 'sum', 'point')
    await k.tell(tarabar, 'bye', 'cheer')
    bar.done(4)
    k.burst(800, 420, 14)
  },
})
