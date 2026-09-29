// «Торт для друга» — рецепт «по порядку»: корж → крем → корж → крем → в самом конце ягоды;
// Буся называет возраст (случайно 2–5) — ставим ровно столько свечек и считаем; свечи зажигает взрослый;
// Тарабар поёт; дуем (тапы) — свечки гаснут по одной.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, L, F, E, C, R, HL, SH, S, rounded, circlePath, star, nid, INK } from '../art.js'

/**
 * Своя полоска шагов (обход бага k.stepsBar: у .kx-step стоит CSS-transition на transform, а gsap.from по детям
 * с stagger конфликтует с ним — часть иконок остаётся выше экрана). Анимируем контейнер, стили — из kit (kx-steps/kx-step).
 */
function stepsBar(k, icons) {
  const el = document.createElement('div')
  el.className = 'kx-steps'
  el.innerHTML = icons.map(i => `<div class="kx-step">${/^</.test(i) ? i : `<span class="emoji">${i}</span>`}</div>`).join('')
  k.root.appendChild(el)
  const items = [...el.children]
  k.fromTo(el, { y: -130 }, { y: 0, duration: 0.6, ease: 'back.out(2)' })
  return {
    el,
    set(i) { items.forEach((s, j) => { s.classList.toggle('now', j === i); s.classList.toggle('done', j < i) }) },
    done(i) { items[i]?.classList.add('done'); items[i]?.classList.remove('now') },
  }
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
/** «заготовка» коржа для полки: толстый ломоть 230×110 */
const spongeChunkArt = () => svg(230, 110,
  SH(115, 104, 100, 5) + S('M22 22Q115 6 208 22Q226 26 226 46L226 84Q226 100 206 100L24 100Q4 100 4 84L4 46Q4 26 22 22Z', SPONGE, SPONGE_SH) +
  E(115, 30, 100, 16, '#F4CE90', { sw: 4 }) + [[60, 62], [100, 74], [140, 58], [180, 70], [80, 88], [160, 90], [122, 40], [70, 36]].map(([x, y]) => C(x, y, 3.6, '#B87B38', { sw: 0 })).join('') + HL(70, 26, 34, 5, -4, 0.7))
/** «заготовка» крема для полки: мисочка со взбитыми сливками 200×140 */
const creamBowlArt = () => svg(200, 140,
  SH(100, 132, 78, 5) + S('M18 66Q18 126 100 126Q182 126 182 66Z', '#FF8FC8', '#E0609F') +
  S('M30 68Q22 44 46 40Q46 20 74 24Q90 4 116 20Q146 12 152 38Q180 42 170 68Q100 80 30 68Z', CREAM, CREAM_SH) +
  HL(66, 40, 18, 5, -20, 0.9) + HL(40, 92, 5, 16, 8, 0.6))
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
    const busya = k.guest('busya', 1440, L0.floorY, { size: 270, face: 'left' })
    const bar = stepsBar(k, ['🎂', '🍓', '🕯️', '🔥', '💨'])
    const AGE = k.pick([1, 2, 3, 4, 5])
    const dropMama = b => gsap.to(b, { scale: 0, autoAlpha: 0, duration: 0.3, onComplete: () => b.remove() })

    // стойка для торта
    const stand = k.prop(standArt(), CAKE.x, CAKE.base + 20, 460, 90, { z: 3 })
    k.fromTo(stand, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    await k.wait(500)
    bar.set(0)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(busya, 'busya_hi', 'jump')

    // ═══ 1. слои по порядку ═══
    const SEQ = ['sponge', 'cream', 'sponge', 'cream']
    const LINES = ['layer_sponge', 'layer_cream', 'layer_sponge2', 'layer_cream2']
    const xs = k.shuffle([430, 645, 860, 1075])
    const items = SEQ.map((kind, i) => ({
      id: `l${i}`, kind, i, line: LINES[i],
      el: kind === 'sponge' ? k.prop(spongeChunkArt(), xs[i], 850, 200, 96, { z: 20 }) : k.prop(creamBowlArt(), xs[i], 845, 190, 133, { z: 20 }),
    }))
    k.fromTo(items.map(i => i.el), { y: 250, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)' })
    await k.wait(500)

    // невидимая «зона торта» шире тарелки, выше стопки
    const zoneEl = k.prop('', CAKE.x, CAKE.base - 140, 460, 360, { z: 2 })
    const zone = { id: 'cake', el: zoneEl, pad: 30 }
    let step = 0, stackTop = CAKE.base
    const WRONG = { sponge: 'wrong_sponge', cream: 'wrong_cream' }
    await k.dnd({
      items, zones: [zone],
      prompt: k.key('layer_q'), host: pyx,
      accept: it => it.kind === SEQ[step],
      onCorrect: async it => {
        // состояние обновляем сразу (до анимаций)
        const h = LAYER_H[it.kind]
        const cy = stackTop - h / 2
        stackTop -= h - (it.kind === 'sponge' ? 6 : 8)
        const zIdx = 6 + step
        step++
        const c = k.centerOf(it.el)
        it.el.style.zIndex = '30'
        await k.play(gsap.to(it.el, { x: `+=${CAKE.x - c.x}`, y: `+=${cy - 70 - c.y}`, scale: 0.8, duration: 0.4, ease: 'power2.out' }))
        const layer = k.prop(it.kind === 'sponge' ? spongeArt() : creamArt(), CAKE.x, cy, CAKE.w, h, { z: zIdx })
        gsap.fromTo(layer, { y: -40, scaleY: 1.3, opacity: 0 }, { y: 0, scaleY: 1, opacity: 1, duration: 0.3, ease: 'bounce.out' })
        gsap.to(it.el, { opacity: 0, scale: 0.4, y: '+=40', duration: 0.25, onComplete: () => it.el.remove() })
        k.sfx('plop')
        pyx.emote('happy')
        await k.tell(pyx, it.line)
      },
      onWrong: async (it, z) => {
        if (!z) return
        pyx.emote('shake')
        await k.tell(pyx, step === 0 ? 'wrong_first' : WRONG[SEQ[step]])
      },
    })
    zoneEl.remove()

    // ═══ 2. ягоды в самом конце ═══
    bar.set(1)
    await k.tell(pyx, 'layer_berry', 'point')
    const bxy = [-140, -70, 0, 70, 140].map(dx => ({ x: CAKE.x + dx, y: stackTop - 4 }))
    const bItems = [0, 1, 2, 3, 4].map(i => ({ id: `b${i}`, el: k.food('strawberry', 500 + i * 130, 850, 100, { z: 20 }) }))
    k.fromTo(bItems.map(b => b.el), { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(1.6)' })
    await k.wait(500)
    const topZoneEl = k.prop('', CAKE.x, stackTop - 40, 460, 260, { z: 2 })
    let nb = 0
    await k.dnd({
      items: bItems, zones: [{ id: 'top', el: topZoneEl, pad: 40 }],
      prompt: k.key('berry_q'), host: pyx,
      accept: () => true,
      onCorrect: async it => {
        const p = bxy[nb++]
        const n = nb
        const c = k.centerOf(it.el)
        it.el.style.zIndex = '30'
        await k.play(gsap.to(it.el, { x: `+=${p.x - c.x}`, y: `+=${p.y - c.y}`, scale: 0.7, duration: 0.35, ease: 'power2.out' }))
        k.sfx('plop')
        k.sparkle(p.x, p.y, 3)
        await k.sayNumber(n)
      },
    })
    topZoneEl.remove()
    k.burst(CAKE.x, stackTop - 50, 10)
    await k.tell(pyx, 'berry_ok', 'cheer')

    // ═══ 3. свечки по возрасту ═══
    bar.set(2)
    await k.tell(pyx, 'age_ask', 'point')
    busya.emote('happy')
    const ageBadge = k.badge(String(AGE), 1440, 655, { size: 120, color: '#FFB938' })
    await k.tell(busya, `age_${AGE}`, 'cheer')
    const CSC = 0.7 // масштаб свечки на торте
    const CY = stackTop - 58 // центр свечи (высота 150·CSC), стоит позади ягод
    const wickTop = CY + (34 - 75) * CSC
    const cxs = Array.from({ length: AGE }, (_, i) => CAKE.x + (i - (AGE - 1) / 2) * 68)
    const candles = Array.from({ length: 5 }, (_, i) => ({ id: `c${i}`, col: CANDLE_COL[i], el: k.prop(candleArt(CANDLE_COL[i]), 520 + i * 130, 830, 60, 195, { z: 20 }) }))
    // 5 свечек в коробке, ставим ровно AGE
    k.fromTo(candles.map(c => c.el), { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(1.6)' })
    await k.wait(500)
    const candleZoneEl = k.prop('', CAKE.x, stackTop - 100, 440, 240, { z: 2 })
    let nc = 0
    const placedCandles = []
    await k.dnd({
      items: candles, zones: [{ id: 'topc', el: candleZoneEl, pad: 40 }],
      prompt: k.key('candle_q'), host: pyx,
      accept: () => true,
      until: () => nc >= AGE,
      onCorrect: async it => {
        const x = cxs[nc]
        nc++
        const c = k.centerOf(it.el)
        it.el.style.zIndex = '30'
        await k.play(gsap.to(it.el, { x: `+=${x - c.x}`, y: `+=${CY - c.y}`, scale: CSC * (150 / 195), duration: 0.35, ease: 'power2.out' }))
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
      const f = k.prop(flameArt(), p.x, wickTop - 24, 40, 52, { z: 41 })
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
        const sm = k.prop(smokeArt(), p.x, wickTop - 30, 40, 54, { z: 41 })
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
    await k.tell(pyx, 'sum', 'point')
    await k.tell(tarabar, 'bye', 'cheer')
    bar.done(4)
    k.burst(800, 420, 14)
  },
})
