// «Каша: мешай-мешай!» — рецепт: мерки (счёт 2 и 4), плита со взрослым, маленький огонь,
// размешивание (не мешаешь — прилипает), ягодки (цвета) и Хрюня-гурман.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, L, F, E, C, R, HL, SH, S, rounded, circlePath, ellipsePath, nid, INK } from '../art.js'

const MILK = '#FFF8E8'
const PORRIDGE = '#F0CF8E'

// ── свои спрайты ─────────────────────────────────────────────
/** мерка-совочек 150×120 */
const scoopArt = () => svg(150, 120,
  SH(70, 114, 56, 5) +
  R(96, 40, 52, 18, 9, '#FF8FC8', { rot: -14 }) +
  S('M14 44L100 44L92 98Q90 110 78 110L36 110Q24 110 22 98Z', '#FFB938', '#E8901F') +
  E(57, 44, 44, 9, '#FFE9A8') +
  [[36, 43, -20], [56, 46, 10], [76, 42, 30], [46, 40, 60], [68, 46, -40]].map(([x, y, r]) => E(x, y, 8, 4, '#F2DDB0', { sw: 2.5, rot: r })).join('') +
  HL(30, 78, 4, 14, 8, 0.6))

/** пачка овсянки 170×230 */
const oatsPackArt = () => svg(170, 230,
  SH(85, 224, 66, 6) +
  P('M20 30L34 6L136 6L150 30Z', '#F2CC70', { sw: 5 }) +
  S(rounded([[20, 30], [150, 30], [156, 214], [14, 214]], 14), '#FFE9A8', '#F2CC70') +
  C(85, 118, 46, '#FFFFFF') +
  `<text x="85" y="138" text-anchor="middle" font-size="58" font-family="'Apple Color Emoji','Noto Color Emoji',sans-serif">🌾</text>` +
  R(30, 178, 110, 10, 5, '#E8901F', { sw: 0 }) + HL(38, 90, 5, 26, 0, 0.6))

/** пламя для карточек: big = большой, иначе маленький. 200×200 */
const flameArt = big => {
  const s = big ? 1 : 0.42, ox = 100 - 100 * s, oy = 190 - 190 * s
  const g = `<g transform="translate(${ox} ${oy}) scale(${s})">` +
    P('M100 8C130 50 176 80 168 132C162 172 130 190 100 190C70 190 38 172 32 132C24 80 70 50 100 8Z', '#FF8A3D', { sw: big ? 6 : 9 }) +
    F('M100 70C118 100 146 116 140 148C136 172 118 180 100 180C82 180 64 172 60 148C54 116 82 100 100 70Z', '#FFD93D') +
    F('M100 118C110 134 122 140 118 158C116 170 108 174 100 174C92 174 84 170 82 158C78 140 90 134 100 118Z', '#FFF4B8') + '</g>'
  return svg(200, 200, R(24, 184, 152, 16, 8, '#5B5470', { sw: 4 }) + g)
}

/** пена «убежавшей» каши 380×150 */
const foamArt = () => {
  const b = [[70, 96, 46], [140, 62, 56], [216, 58, 58], [290, 92, 48], [180, 100, 50], [110, 118, 30], [262, 122, 30]]
  return svg(380, 150,
    b.map(([x, y, r]) => C(x, y, r, '#FFFFFF', { sw: 6 })).join('') +
    b.map(([x, y, r]) => C(x, y, r - 3, '#FFFFFF', { sw: 0 })).join('') +
    [[120, 48, 10], [220, 40, 12], [176, 84, 8], [284, 88, 9]].map(([x, y, r]) => C(x, y, r, '#F6EBD2', { sw: 0 })).join('') +
    HL(130, 34, 22, 8, -20, 0.8) +
    // потёки по бокам
    P('M40 120Q30 150 46 156Q60 150 56 120Z', '#FFFFFF', { sw: 5 }) + P('M322 118Q316 148 330 152Q344 146 338 118Z', '#FFFFFF', { sw: 5 }))
}

const blueberryArt = () => svg(70, 70,
  SH(35, 66, 24, 3) + S(circlePath(35, 36, 28), '#5B6FD8', '#3E4FB0') +
  P('M28 14L35 8L42 14L40 22L30 22Z', '#3E4FB0', { sw: 3 }) + HL(24, 26, 6, 4, -35, 0.6))

/** купол каши в тарелке (накладывается на kitchen.bowl 260×160) */
const moundArt = () => svg(260, 160,
  S('M34 58C40 22 92 8 130 8C168 8 220 22 226 58C200 72 60 72 34 58Z', PORRIDGE, '#DDB56C') +
  [[80, 36], [130, 24], [176, 38], [104, 52], [154, 54]].map(([x, y]) => E(x, y, 8, 4, '#FFF3D0', { sw: 0 })).join('') +
  HL(92, 24, 22, 6, -20, 0.5))

/** своя кастрюля с широкой «горловиной»: видно молоко, хлопья, кашу. 300×230 */
const potArt = () => {
  const cid = nid('pc')
  const HOLE = ellipsePath(150, 80, 103, 24), RIM = ellipsePath(150, 80, 118, 30)
  const body = 'M32 80L268 80L268 184Q268 214 232 214L68 214Q32 214 32 184Z'
  const dots = [[70, 124, 8], [112, 160, 7], [166, 134, 8], [210, 170, 7], [238, 122, 7], [88, 192, 6], [150, 192, 7], [130, 110, 5]].map(([x, y, r]) => C(x, y, r, '#fff', { sw: 0, attr: 'opacity=".9"' })).join('')
  const handle = d => L(d, INK, 15) + L(d, '#D9E0F0', 8)
  const flakes = Array.from({ length: 20 }, (_, i) => {
    const a = i * 2.399, rr = 0.2 + ((i * 37) % 70) / 100
    const x = 150 + Math.cos(a) * rr * 98, y = 84 + Math.sin(a) * rr * 20
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="9" ry="4.4" fill="#EBCB8B" stroke="#C9A25A" stroke-width="1.6" transform="rotate(${(i * 47) % 100 - 50} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
  }).join('')
  const swirl = `<g transform="translate(150 84) scale(1 .24)"><g class="swirl"><path d="M-80 0A80 80 0 0 1 0 -80M80 0A80 80 0 0 1 0 80M-46 0A46 46 0 0 1 0 -46M46 0A46 46 0 0 1 0 46" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".6"/></g></g>`
  const water = `<g class="water"><ellipse class="milk" cx="150" cy="84" rx="106" ry="25" fill="${MILK}"/>` +
    `<path d="M92 82L124 80M176 80L206 82" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7" fill="none"/>` +
    swirl + `<g class="oats-layer">${flakes}</g><ellipse class="burnt" cx="200" cy="88" rx="26" ry="7" fill="#B8763A" opacity="0"/></g>`
  const bubbles = [[108, 86, 9], [142, 94, 7], [182, 82, 10], [212, 90, 7], [128, 72, 6], [168, 70, 7]]
    .map(([x, y, r]) => `<g class="bubble" data-origin="${x} ${y}" style="opacity:0;visibility:hidden">${C(x, y, r, '#FFFFFF', { sw: 3.5, attr: 'fill-opacity=".92"' })}${C(x - r * 0.35, y - r * 0.35, r * 0.28, '#fff', { sw: 0 })}</g>`).join('')
  return svg(300, 230,
    SH(150, 222, 120, 7) +
    handle('M40 118L22 118Q8 118 8 132Q8 146 22 146L40 146') + handle('M260 118L278 118Q292 118 292 132Q292 146 278 146L260 146') +
    S(body, '#62C6FF', '#3FA6E6', { extra: dots + '<rect x="46" y="112" width="12" height="80" rx="6" fill="#fff" opacity=".4"/>' }) +
    P(RIM, '#A8E0FF', { sw: 6 }) + F(HOLE, '#2E5F8C') +
    `<clipPath id="${cid}"><path d="${HOLE}"/></clipPath><g clip-path="url(#${cid})">${water}</g>` +
    L(HOLE, INK, 4) + bubbles)
}

const oatFlake = () => `<svg viewBox="0 0 30 20" width="100%" height="100%"><ellipse cx="15" cy="10" rx="12" ry="7" fill="#F2DDB0" stroke="${INK}" stroke-width="2.5"/></svg>`

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

export default defineLevel({
  id: 'porridge',
  async run(k) {
    const gsap = k.gsap
    const L0 = k.layout
    k.kitchenBg()
    const st = k.stove()
    const pyx = k.pyx({ x: 250 })
    const pig = k.guest('pig', 1420, L0.floorY, { size: 280, face: 'left' })
    const bar = stepsBar(k, ['🌾', '🥛', '🔥', '🥄', '🍓'])

    // ── кастрюля на конфорке (пока пустая) ──
    const POT = { w: 340, h: 261 }
    const pot = k.onBurner(k.prop(potArt(), 0, 0, POT.w, POT.h, { z: 6 }), 0, POT.w, POT.h)
    const water = pot.querySelector('.water')
    const milk = water.querySelector('.milk')
    const oatsLayer = water.querySelector('.oats-layer')
    const burnt = water.querySelector('.burnt')
    const swirl = water.querySelector('.swirl')
    gsap.set(water, { y: 16 })
    gsap.set([milk, oatsLayer, swirl], { opacity: 0 })
    const bubbles = [...pot.querySelectorAll('.bubble')]
    const potRim = { x: 720, y: 262 }
    const surf = { x: 720, y: 282 }

    // ── Хрюня хочет кашу ──
    await k.wait(400)
    bar.set(0)
    await k.tell(pyx, 'hello', 'wave')
    const wish = k.bubble('🥣', 1290, 640, { w: 170, h: 150, tail: 'right', font: 76 })
    await k.tell(pig, 'pig_hi', 'happy')

    // счётные «гнёздышки» над кастрюлей: цифры появляются по одной
    const slotRow = (n, color) => {
      const size = 92, gap = 16, x0 = 720 - (n * size + (n - 1) * gap) / 2 + size / 2, y = 175
      const els = Array.from({ length: n }, (_, i) => k.prop(
        '<div style="width:100%;height:100%;border-radius:50%;border:6px dashed rgba(59,47,79,.35);background:rgba(255,255,255,.75);box-sizing:border-box"></div>',
        x0 + i * (size + gap), y, size, size, { z: 66 }))
      k.popIn(els)
      return {
        fill(i) { els[i].remove(); return k.badge(String(i + 1), x0 + i * (size + gap), y, { size, color }) },
        clear() { const all = [...els, ...document.querySelectorAll('.kx-badge')]; gsap.to(all, { opacity: 0, scale: 0.6, duration: 0.3, onComplete: () => all.forEach(e => e.remove()) }) },
      }
    }
    // сыпем/льём в кастрюлю: перелёт предмета по дуге, возврат
    const flyOver = async (el, home, to, rot, pourFn) => {
      await k.play(gsap.to(el, { x: to.x - home.x, y: to.y - home.y, rotation: rot * 0.35, duration: 0.55, ease: 'power2.inOut' }))
      gsap.to(el, { rotation: rot, duration: 0.3, ease: 'power1.out' })
      await pourFn()
      await k.play(gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 0.55, ease: 'power2.inOut' }))
    }
    const drops = (color, w, h, n, x0, y0) => {
      for (let i = 0; i < n; i++) {
        const d = k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:${color};box-shadow:0 0 0 2px ${INK}"></div>`, x0 + k.rand(-14, 14), y0, w, h, { z: 13 })
        k.to(d, { y: k.rand(34, 50), opacity: 0, duration: 0.45, delay: i * 0.05, ease: 'power1.in', onComplete: () => d.remove() })
      }
    }

    // ── 1. овсянка: две мерки ──
    wish.remove()
    const pack = k.prop(oatsPackArt(), 1250, 600, 170, 230, { z: 7 })
    const scoop = k.prop(scoopArt(), 1090, 670, 132, 106, { z: 8 })
    k.fromTo([pack, scoop], { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
    await k.wait(500)
    const oatSlots = slotRow(2, '#FFB938')
    for (let i = 0; i < 2; i++) {
      await k.tapN(scoop, 1, i === 0 ? { prompt: k.key('oats_q'), host: pyx } : {})
      await flyOver(scoop, { x: 0, y: 0 }, { x: 770 - 1090, y: 246 - 670 }, -80, async () => {
        for (let j = 0; j < 9; j++) {
          const f = k.prop(oatFlake(), 738 + k.rand(-16, 16), 254, 26, 17, { z: 13 })
          k.to(f, { y: k.rand(28, 44), x: k.rand(-24, 24), rotation: k.rand(-90, 90), opacity: 0, duration: 0.5, delay: j * 0.04, ease: 'power1.in', onComplete: () => f.remove() })
        }
        k.sfx('sprinkle')
        gsap.to(oatsLayer, { opacity: 1, duration: 0.4 })
        await k.wait(520)
      })
      oatSlots.fill(i)
      await k.sayNumber(i + 1)
    }
    await k.tell(pyx, 'oats_ok', 'cheer')
    k.burst(720, 300, 8)
    oatSlots.clear()
    gsap.to([pack, scoop], { x: 500, opacity: 0, duration: 0.5, ease: 'back.in(1.4)', onComplete: () => { pack.remove(); scoop.remove() } })
    bar.set(1)

    // ── 2. молоко: четыре мерки ──
    await k.wait(300)
    const carton = k.food('milk', 1250, 592, 132, { z: 8 })
    k.fromTo(carton, { x: 400, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    await k.wait(600)
    const milkSlots = slotRow(4, '#62C6FF')
    for (let i = 0; i < 4; i++) {
      await k.tapN(carton, 1, i === 0 ? { prompt: k.key('milk_q'), host: pyx } : {})
      await flyOver(carton, { x: 0, y: 0 }, { x: 905 - 1250, y: 222 - 592 }, -105, async () => {
        drops('#FFFFFF', 12, 18, 10, 802, 250)
        k.sfx('pour')
        gsap.to(milk, { opacity: 1, duration: 0.4 })
        gsap.to(water, { y: 16 - 16 * ((i + 1) / 4), duration: 0.6, ease: 'power1.out' })
        await k.wait(650)
      })
      milkSlots.fill(i)
      await k.sayNumber(i + 1)
    }
    await k.tell(pyx, 'milk_ok', 'cheer')
    k.burst(720, 300, 8)
    milkSlots.clear()
    gsap.to(carton, { x: 500, opacity: 0, duration: 0.5, ease: 'back.in(1.4)', onComplete: () => carton.remove() })
    bar.set(2)

    // ── 3. плита — только со взрослым; огонь маленький ──
    await k.tell(pyx, 'fire_q', 'point')
    const knob = st.knobEl(0)
    await k.adultHelp({ knob, host: pyx })
    knob.remove()
    st.on(0)
    const flame = st.el.querySelector('.flame[data-burner="0"]')
    const flameOrigin = flame?.getAttribute('data-origin') ?? undefined
    await k.wait(900)
    // пузырьки: молоко греется
    bubbles.forEach((b, i) => gsap.fromTo(b, { y: 8, autoAlpha: 0, scale: 0.5 }, { y: -12, autoAlpha: 1, scale: 1, duration: 0.7 + (i % 3) * 0.2, repeat: -1, ease: 'sine.out', delay: (i * 0.23) % 0.9, svgOrigin: b.getAttribute('data-origin') ?? undefined }))
    const foamCloud = () => k.prop(foamArt(), potRim.x, potRim.y - 8, 380, 150, { z: 12 })
    await k.choose({
      prompt: k.key('fire_big'), host: pyx,
      options: [
        { id: 'big', art: flameArt(true), color: '#FF9F43', outcome: async () => {
          const foam = foamCloud()
          gsap.fromTo(foam, { scale: 0.2, opacity: 0, transformOrigin: '50% 100%' }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' })
          k.sfx('sizzle')
          gsap.fromTo(pot, { x: -5 }, { x: 5, duration: 0.07, repeat: 9, yoyo: true, onComplete: () => gsap.set(pot, { x: 0 }) })
          pyx.emote('surprised')
          await k.tell(pyx, 'fire_wrong')
          await k.play(gsap.to(foam, { scale: 0.3, opacity: 0, duration: 0.5, ease: 'power2.in' }))
          foam.remove()
        } },
        { id: 'small', art: flameArt(false), color: '#FFD93D', correct: true, outcome: async () => {
          gsap.to(flame, { scale: 0.5, svgOrigin: flameOrigin, duration: 0.5, ease: 'back.out(2)' })
          k.sfx('click')
          await k.wait(500)
          await k.tell(pyx, 'fire_small', 'nod')
        } },
      ],
    })
    // пар над кашей
    const puff = () => {
      const s = k.prop(kitchen.steam(), potRim.x + k.rand(-50, 50), 214, 120, 87, { z: 12 })
      k.fromTo(s, { y: 0, opacity: 0.9, scale: 0.7 }, { y: -70, opacity: 0, scale: 1.2, duration: 1.6, ease: 'power1.out', onComplete: () => s.remove() })
    }
    const steamStop = k.every(700, puff)
    bar.set(3)

    // ── 4. мешаем ──
    const spoon = k.prop(kitchen.spoonWood(), surf.x + 60, surf.y - 52, 60, 195, { z: 13 })
    gsap.set(spoon, { transformOrigin: '50% 79%' })
    gsap.set(swirl, { opacity: 1 })
    k.popIn(spoon)
    let lastMove = performance.now() + 4000, started = false, lastNag = 0, phaseP = 0, spoonActive = true
    const orbit = a => { gsap.set(spoon, { x: Math.cos(a) * 62 - 60, y: Math.sin(a) * 15 - 4.5, rotation: Math.cos(a) * 14 }); gsap.set(swirl, { rotation: (a * 180) / Math.PI }) }
    orbit(0)
    const nag = k.every(600, () => {
      const now = performance.now()
      if (!spoonActive || now - lastNag < 9000) return
      if (now - lastMove > (started ? 3300 : 13000)) {
        lastNag = now
        gsap.to(burnt, { opacity: 0.85, duration: 0.5 })
        const smoke = k.prop(kitchen.steam().replaceAll('#FFFFFF', '#9A93A8').replaceAll('#E2EAF6', '#7C758C'), potRim.x + 40, 214, 120, 87, { z: 12 })
        k.fromTo(smoke, { y: 0, opacity: 0.9, scale: 0.7 }, { y: -80, opacity: 0, scale: 1.3, duration: 1.8, ease: 'power1.out', onComplete: () => smoke.remove() })
        k.sfx('sizzle')
        gsap.fromTo(pot, { x: -4 }, { x: 4, duration: 0.06, repeat: 7, yoyo: true, onComplete: () => gsap.set(pot, { x: 0 }) })
        pig.emote('jump')
        k.tell(pyx, 'stick', 'surprised')
      }
    })
    const cooked = p => { // цвет каши: молоко → густая
      gsap.to(milk, { fill: mixHex(MILK, PORRIDGE, Math.min(1, p)), duration: 0.3 })
    }
    const mixHex = (a, b, t) => {
      const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16))
      const A = h(a), B = h(b)
      return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')
    }
    let said1 = false, said2 = false
    await k.stir({ x: 720, y: 292 }, {
      radius: 110, turns: 4, spoon, prompt: k.key('stir_q'), host: pyx,
      moveSpoon: (cx, cy, a) => orbit(a),
      onProgress: p => {
        started = true
        lastMove = performance.now()
        cooked(p)
        if (Number(gsap.getProperty(burnt, 'opacity')) > 0) gsap.to(burnt, { opacity: 0, duration: 0.8, overwrite: true })
        if (p > 0.3 && !said1) { said1 = true; pig.emote('jump'); k.tell(pig, 'stir_pig') }
        if (p > 0.62 && !said2) { said2 = true; pyx.emote('point'); k.tell(pyx, 'thick') }
      },
    })
    spoonActive = false
    nag()
    steamStop()
    gsap.to(spoon, { x: 90, y: -40, opacity: 0, duration: 0.5, onComplete: () => spoon.remove() })
    k.sfx('ding')
    k.burst(720, 300, 12)
    await k.tell(pyx, 'stir_done', 'cheer')
    await k.line(pyx, 'e.kitchen-omelet.off', 'nod')
    st.off(0)
    gsap.killTweensOf(bubbles)
    gsap.to(bubbles, { autoAlpha: 0, duration: 0.3 })
    bar.set(4)

    // ── 5. в тарелку, ягодки, Хрюня ──
    const bowl = k.prop(kitchen.bowl(), 1225, 640, 300, 185, { z: 6 })
    const mound = k.prop(moundArt(), 1225, 640, 300, 185, { z: 7 })
    gsap.set(mound, { scaleY: 0.15, opacity: 0, transformOrigin: '50% 60%' })
    k.fromTo(bowl, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    const ladle = k.food('ladle', 720, 210, 66, { z: 14 })
    gsap.set(ladle, { rotation: 180, opacity: 0 })
    await k.wait(400)
    await k.tell(pyx, 'scoop', 'point')
    for (let i = 0; i < 2; i++) {
      gsap.set(ladle, { x: 0, y: 0, rotation: 180, opacity: 1 })
      await k.play(gsap.to(ladle, { y: 52, duration: 0.45, ease: 'power2.in' }))
      k.sfx('pour')
      gsap.to(water, { y: '+=3', duration: 0.3 })
      await k.play(gsap.to(ladle, { y: -10, duration: 0.4, ease: 'power2.out' }))
      await k.play(gsap.to(ladle, { x: 475, y: 318, duration: 0.8, ease: 'power1.inOut' }))
      await k.play(gsap.to(ladle, { rotation: 130, duration: 0.25 }))
      k.sfx('plop')
      gsap.to(mound, { scaleY: i ? 1 : 0.55, opacity: 1, duration: 0.4, ease: 'back.out(2)' })
      await k.wait(350)
      await k.play(gsap.to(ladle, { rotation: 180, duration: 0.2 }))
      await k.play(gsap.to(ladle, { x: 0, y: 0, duration: 0.6, ease: 'power1.inOut' }))
      await k.sayNumber(i + 1)
    }
    gsap.to(ladle, { opacity: 0, duration: 0.3, onComplete: () => ladle.remove() })

    // топпинг: красный, жёлтый, синий
    const T = [
      { id: 'red', el: k.food('strawberry', 620, 850, 118, { z: 20 }), line: 'top_red', at: [-46, -24] },
      { id: 'yellow', el: k.food('bananaSlice', 800, 850, 106, { z: 20 }), line: 'top_yellow', at: [42, -30] },
      { id: 'blue', el: k.prop(blueberryArt(), 980, 850, 84, 84, { z: 20 }), line: 'top_blue', at: [0, -6] },
    ]
    k.fromTo(T.map(t => t.el), { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
    await k.dnd({
      items: k.shuffle(T), zones: [{ id: 'bowl', el: bowl, pad: 60 }],
      prompt: k.key('top_q'), host: pyx,
      accept: () => true,
      onCorrect: async (it, z, placed) => {
        const c = k.centerOf(it.el)
        gsap.to(it.el, { x: `+=${1225 + it.at[0] - c.x}`, y: `+=${592 + it.at[1] - c.y}`, scale: 0.7, duration: 0.35, ease: 'power2.out' })
        k.sparkle(1225 + it.at[0], 592 + it.at[1], 5)
        await k.tell(pyx, it.line, 'happy')
        await k.sayNumber(placed.size)
      },
    })

    // Хрюня ест
    const all = [bowl, mound, ...T.map(t => t.el)]
    all.forEach((e, i) => { e.style.zIndex = String(12 + i) })
    await k.play(gsap.to(all, { x: `+=${1305 - 1225}`, y: `+=${815 - 640}`, duration: 0.8, ease: 'power2.inOut' }))
    pig.emote('happy')
    k.sfx('yum')
    await k.wait(300)
    await k.play(gsap.to(all, { scale: 0.85, duration: 0.15, yoyo: true, repeat: 5 }))
    gsap.to(all, { opacity: 0, duration: 0.4 })
    k.burst(1400, 820, 10)
    await k.tell(pig, 'pig_eat', 'laugh')
    await k.tell(pyx, 'sum', 'point')
    await k.tell(pig, 'bye', 'cheer')
    bar.done(4)
    k.burst(800, 420, 14)
  },
})
