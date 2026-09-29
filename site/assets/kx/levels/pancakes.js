// «Блинчики» — рецепт с гостями (Ряба и Бурёнка): яйцо → молоко до риски (hold+goal) → 3 мерки муки →
// взбить → плита со взрослым → вылить тесто → пузырьки → переворот резким взмахом → стопка из 5 → варенье.
import { defineLevel, food, G } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, L, F, E, C, R, HL, SH, S, rounded, circlePath, ellipsePath, nid, INK } from '../art.js'

// ── свои спрайты ─────────────────────────────────────────────
const MARK = 0.63 // где «красная черта» на мерном стакане (доля высоты)
/** мерный стакан 120×220 со шкалой и красной чертой; .fill — молоко */
const mcupArt = () => {
  const cid = nid('mc')
  const glass = 'M16 18L104 18L98 202Q97 212 86 212L34 212Q23 212 22 202Z'
  const yOf = f => 212 - f * 186
  return svg(120, 220,
    SH(60, 214, 46, 5) + F(glass, '#EAF6FF') +
    `<clipPath id="${cid}"><path d="${glass}"/></clipPath><g clip-path="url(#${cid})"><rect class="fill" x="0" y="212" width="120" height="0" fill="#FFFFFF"/></g>` +
    [0.25, 0.5, 0.75].map(f => L(`M16 ${yOf(f)}L38 ${yOf(f)}`, '#9CC3DD', 4)).join('') +
    P(glass, 'none', { sw: 5 }) +
    `<line x1="8" y1="${yOf(MARK)}" x2="112" y2="${yOf(MARK)}" stroke="#FF5A5F" stroke-width="7" stroke-linecap="round"/>` +
    HL(32, 90, 5, 40, 4, 0.7))
}

/** слой «содержимого» поверх горловины миски (viewBox как у kitchen.bowl 260×160) */
const batterArt = () => {
  const cid = nid('bt')
  const mouth = ellipsePath(130, 57, 100, 16.5)
  const lumps = [[70, 56, 9], [96, 62, 7], [124, 54, 10], [152, 62, 8], [180, 56, 9], [108, 52, 6], [140, 64, 6]].map(([x, y, r]) => E(x, y, r, r * 0.5, '#FFFFFF', { sw: 2.5, ink: '#E1D4B8' })).join('')
  return svg(260, 160,
    `<clipPath id="${cid}"><path d="${mouth}"/></clipPath><g clip-path="url(#${cid})">` +
    '<ellipse class="mix" cx="130" cy="59" rx="104" ry="18" fill="#EFF8FF" opacity="0"/>' +
    `<g class="yolks" opacity="0">${C(104, 58, 15, '#FFB938', { sw: 3.5 })}${C(158, 60, 15, '#FFB938', { sw: 3.5 })}${HL(98, 54, 5, 3, -20, 0.85)}${HL(152, 56, 5, 3, -20, 0.85)}</g>` +
    `<g class="lumps" opacity="0">${lumps}</g>` +
    '<g transform="translate(130 58) scale(1 .17)"><g class="swirl" opacity="0"><path d="M-82 0A82 82 0 0 1 0 -82M82 0A82 82 0 0 1 0 82M-46 0A46 46 0 0 1 0 -46M46 0A46 46 0 0 1 0 46" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" opacity=".75"/></g></g>' +
    '</g>')
}

/** блинчик (вид сбоку-сверху) 300×100: .top меняет цвет, .holes — дырочки */
const pcakeArt = (color = '#FFF1C2') => svg(300, 100,
  SH(150, 82, 122, 6, 0.16) +
  E(150, 60, 132, 32, '#C98546') + E(150, 50, 132, 32, color, { attr: 'class="top"' }) +
  `<g class="holes" opacity="0">${[[90, 42, 7], [128, 56, 8], [170, 44, 7], [206, 58, 7], [150, 36, 5], [112, 40, 5], [232, 46, 5]].map(([x, y, r]) => E(x, y, r, r * 0.55, '#E7B45C', { sw: 0 })).join('')}</g>` +
  HL(96, 34, 32, 6, -6, 0.5))

const bubbleArt = () => svg(64, 64, C(32, 32, 20, '#FFFFFF', { sw: 4, attr: 'fill-opacity=".8"' }) + C(25, 25, 5, '#fff', { sw: 0 }))

const shellArt = flip => svg(60, 40, `<g transform="${flip ? 'rotate(180 30 20) ' : ''}">` + P('M6 22Q6 4 30 4Q54 4 54 22L46 20L40 28L32 20L24 28L16 20Z', '#FFF4DF', { sw: 4 }) + '</g>')

const jamArt = () => food('honey').replaceAll('#FFB938', '#E4425A').replaceAll('#E8901F', '#B92C46').replace('🍯', '🍓')
const jamBlobArt = () => svg(240, 90,
  S('M20 50C20 26 60 14 120 14C180 14 220 26 220 50C220 70 180 76 120 76C60 76 20 70 20 50Z', '#E4425A', '#B92C46') +
  P('M40 64Q36 84 46 86Q56 80 52 66Z', '#E4425A', { sw: 4 }) + P('M180 66Q176 86 188 86Q196 80 194 66Z', '#E4425A', { sw: 4 }) + HL(80, 34, 30, 7, -8, 0.6))

/** stepsBar с обходом бага тулкита: gsap.from по детям с CSS-transition на transform «залипает» (последние иконки остаются выше). */
function stepsBar(k, icons) {
  const bar = k.stepsBar(icons)
  const kids = [...bar.el.children]
  k.gsap.killTweensOf(kids)
  k.gsap.set(kids, { clearProps: 'transform' })
  k.gsap.fromTo(bar.el, { y: -130 }, { y: 0, duration: 0.6, ease: 'back.out(2)' })
  return bar
}

export default defineLevel({
  id: 'pancakes',
  async run(k) {
    const gsap = k.gsap
    const L0 = k.layout
    k.kitchenBg()
    const pyx = k.pyx({ x: 230 })
    const hen = k.guest('hen', 1130, L0.floorY, { size: 240, face: 'left' })
    const cow = k.guest('cow', 1440, L0.floorY, { size: 300, face: 'left' })
    const bar = stepsBar(k, ['🥚', '🥛', '🌾', '🥄', '🔥', '🥞', '🍓'])
    const board = k.food('board', 850, 700, 840, { z: 3 })
    k.fromTo(board, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    const clamp01 = v => Math.max(0, Math.min(1, v))
    const puff = (x, y, color, n = 8, spread = 30, fall = 40) => {
      for (let i = 0; i < n; i++) {
        const d = k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:${color};box-shadow:0 0 0 2px ${INK}"></div>`, x + k.rand(-spread, spread), y, 13, 13, { z: 13 })
        k.to(d, { y: k.rand(fall * 0.6, fall), x: k.rand(-12, 12), opacity: 0, duration: 0.45, delay: i * 0.04, ease: 'power1.in', onComplete: () => d.remove() })
      }
    }

    // ── миска с «содержимым» ──
    const BOWL = { x: 850, y: 650, w: 500, h: 308 }
    const bowl = k.prop(kitchen.bowl(), BOWL.x, BOWL.y, BOWL.w, BOWL.h, { z: 6 })
    const batter = k.prop(batterArt(), BOWL.x, BOWL.y, BOWL.w, BOWL.h, { z: 7 })
    const mix = batter.querySelector('.mix'), yolks = batter.querySelector('.yolks'), lumps = batter.querySelector('.lumps'), swirl = batter.querySelector('.swirl')
    const mouth = { x: BOWL.x, y: BOWL.y - BOWL.h / 2 + (57 * BOWL.h) / 160 } // центр горловины (850, ~603)
    k.fromTo([bowl, batter], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })

    await k.wait(500)
    bar.set(0)
    await k.tell(pyx, 'hello', 'wave')
    // гости приносят продукты
    const egg = k.food('egg', 1170, 640, 96, { z: 8 })
    gsap.fromTo(egg, { y: 200, x: -30, scale: 0.3, opacity: 0 }, { y: 0, x: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' })
    k.sfx('boing', { vol: 0.5 })
    await k.tell(hen, 'hen_egg', 'happy')
    await k.tell(cow, 'cow_milk', 'happy')

    // ═══ 1. яйцо ═══
    await k.tapOnEl(egg, { prompt: k.key('egg_q'), host: pyx })
    await k.play(gsap.to(egg, { x: 960 - 1170, y: 545 - 640, rotation: -25, duration: 0.5, ease: 'power2.inOut' }))
    k.sfx('clonk')
    gsap.set(egg, { opacity: 0 })
    for (const [i, flip] of [[0, false], [1, true]]) {
      const sh = k.prop(shellArt(flip), 960, 545, 60, 40, { z: 13 })
      k.to(sh, { x: (i ? 1 : -1) * 40, y: 70, rotation: (i ? 1 : -1) * 60, opacity: 0, duration: 0.7, ease: 'power1.in', onComplete: () => sh.remove() })
    }
    k.sfx('plop')
    gsap.to(mix, { opacity: 0.9, duration: 0.3 })
    gsap.to(yolks, { opacity: 1, duration: 0.3 })
    k.sparkle(mouth.x, mouth.y, 5)
    await k.tell(pyx, 'egg_ok', 'point')
    egg.remove()
    bar.set(1)

    // ═══ 2. молоко до красной черты ═══
    const carton = k.food('milk', 1170, 430, 110, { z: 8 })
    const cup = k.prop(mcupArt(), 1170, 655, 116, 213, { z: 8 })
    k.fromTo([carton, cup], { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
    const fillRect = cup.querySelector('.fill')
    const setFill = p => gsap.set(fillRect, { attr: { y: 212 - p * 186, height: p * 186 } })
    const stream = k.prop('<div style="width:100%;height:100%;border-radius:8px;background:#FFFFFF;box-shadow:0 0 0 2px #B8C9DD"></div>', 1132, 520, 14, 100, { z: 7 })
    gsap.set(stream, { opacity: 0, transformOrigin: '50% 0%' })
    let overs = 0
    await k.wait(500)
    await k.hold(carton, {
      duration: 3, goal: [MARK - 0.08, MARK + 0.09], prompt: k.key('milk_q'), host: pyx, sfx: 'pour',
      onStart: () => { gsap.to(carton, { rotation: -32, x: -30, y: 40, duration: 0.3 }); gsap.to(stream, { opacity: 1, duration: 0.1 }) },
      onLevel: p => setFill(p),
      onRelease: () => { gsap.to(carton, { rotation: 0, x: 0, y: 0, duration: 0.3 }); gsap.to(stream, { opacity: 0, duration: 0.1 }) },
      onMiss: lvl => { if (lvl < MARK - 0.08) k.tell(pyx, 'milk_low') },
      onOver: () => {
        overs++
        const pud = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#FFFFFF;box-shadow:0 0 0 3px #B8C9DD"></div>', 1170, 738, 190, 26, { z: 7 })
        k.fromTo(pud, { scaleX: 0.2, opacity: 1 }, { scaleX: 1, duration: 0.4, ease: 'power2.out' })
        k.to(pud, { opacity: 0, duration: 0.6, delay: 1.6, onComplete: () => pud.remove() })
        gsap.to(carton, { rotation: 0, x: 0, y: 0, duration: 0.3 })
        gsap.to(stream, { opacity: 0, duration: 0.1 })
        cow.emote('surprised')
        k.tell(pyx, 'milk_over', 'laugh')
      },
    })
    // молоко из стакана — в миску
    await k.tell(pyx, 'milk_ok', 'cheer')
    await k.tell(cow, 'cow_ok', 'happy')
    await k.play(gsap.to(cup, { x: 930 - 1170, y: 470 - 655, rotation: -105, duration: 0.7, ease: 'power2.inOut' }))
    puff(882, 520, '#FFFFFF', 10, 8, 70)
    k.sfx('pour')
    gsap.to(fillRect, { attr: { y: 212, height: 0 }, duration: 0.9, ease: 'none' })
    gsap.to(mix, { fill: '#FFFDF7', opacity: 1, duration: 0.9 })
    gsap.to(yolks, { opacity: 0.55, duration: 0.9 })
    await k.wait(950)
    await k.play(gsap.to(cup, { x: 0, y: 0, rotation: 0, duration: 0.6, ease: 'power2.inOut' }))
    gsap.to([carton, cup], { x: 400, opacity: 0, duration: 0.5, ease: 'back.in(1.4)', onComplete: () => { carton.remove(); cup.remove() } })
    bar.set(2)

    // ═══ 3. три мерки муки ═══
    await k.wait(300)
    const flour = k.food('flour', 545, 630, 140, { z: 8 })
    k.fromTo(flour, { x: -300, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    await k.wait(600)
    const slots = Array.from({ length: 3 }, (_, i) => k.prop('<div style="width:100%;height:100%;border-radius:50%;border:6px dashed rgba(59,47,79,.35);background:rgba(255,255,255,.75);box-sizing:border-box"></div>', 850 + (i - 1) * 108, 175, 92, 92, { z: 66 }))
    k.popIn(slots)
    for (let i = 0; i < 3; i++) {
      await k.tapN(flour, 1, i === 0 ? { prompt: k.key('flour_q'), host: pyx } : {})
      await k.play(gsap.to(flour, { x: 720 - 545, y: 470 - 630, rotation: 80, duration: 0.6, ease: 'power2.inOut' }))
      k.sfx('sprinkle')
      puff(mouth.x - 40, 505, '#FFFFFF', 12, 40, 70)
      gsap.to(lumps, { opacity: 0.35 * (i + 1), duration: 0.4 })
      gsap.to(mix, { fill: '#FFF4D2', duration: 0.5 })
      await k.wait(500)
      await k.play(gsap.to(flour, { x: 0, y: 0, rotation: 0, duration: 0.55, ease: 'power2.inOut' }))
      slots[i].remove()
      k.badge(String(i + 1), 850 + (i - 1) * 108, 175, { size: 92, color: '#FFFFFF' })
      await k.sayNumber(i + 1)
    }
    await k.tell(pyx, 'flour_ok', 'cheer')
    gsap.to([...document.querySelectorAll('.kx-badge')], { opacity: 0, scale: 0.6, duration: 0.3, onComplete: function () { document.querySelectorAll('.kx-badge').forEach(b => b.remove()) } })
    gsap.to(flour, { x: -300, opacity: 0, duration: 0.5, ease: 'back.in(1.4)', onComplete: () => flour.remove() })
    bar.set(3)

    // ═══ 4. взбиваем венчиком ═══
    const whisk = k.prop(kitchen.whisk(), mouth.x, mouth.y - 42, 76, 190, { z: 15 })
    gsap.set(whisk, { transformOrigin: '50% 72%' })
    k.popIn(whisk)
    gsap.set(swirl, { opacity: 1 })
    await k.stir(mouth, {
      radius: 150, turns: 3, spoon: whisk, prompt: k.key('whisk_q'), host: pyx,
      moveSpoon: (cx, cy, a) => { gsap.set(whisk, { x: Math.cos(a) * 112, y: Math.sin(a) * 18, rotation: Math.cos(a) * 12 }); gsap.set(swirl, { rotation: (a * 180) / Math.PI }) },
      onProgress: p => {
        gsap.set(lumps, { opacity: 1 - clamp01(p * 1.3) })
        gsap.to(mix, { fill: mixHex('#FFF4D2', '#F9DE94', p), duration: 0.3 })
        gsap.to(yolks, { opacity: 0.55 * (1 - p), duration: 0.3 })
      },
    })
    gsap.to(swirl, { opacity: 0, duration: 0.4 })
    gsap.to(whisk, { y: -90, opacity: 0, duration: 0.5, onComplete: () => whisk.remove() })
    k.sfx('correct')
    k.burst(mouth.x, mouth.y, 8)
    await k.tell(pyx, 'whisk_ok', 'cheer')
    bar.set(4)

    // ═══ 5. плита — со взрослым; сковородка ═══
    await k.play(gsap.to(board, { opacity: 0, y: 40, duration: 0.5 }))
    await k.play(gsap.to([bowl, batter], { x: 300, y: -55, scale: 0.55, duration: 0.7, ease: 'power2.inOut' }))
    const st = k.stove()
    const PAN = { w: 520, h: 221, left: 512, top: 250 }
    const pan = k.prop(kitchen.pan({ egg: 'none' }), PAN.left + PAN.w / 2, PAN.top + PAN.h / 2, PAN.w, PAN.h, { z: 6 })
    pan.querySelector('.kp-shadow')?.style.setProperty('visibility', 'hidden')
    k.fromTo(pan, { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    k.sfx('clonk')
    await k.wait(700)
    await k.tell(pyx, 'fire_q', 'point')
    const knob = st.knobEl(0)
    await k.adultHelp({ knob, host: pyx, skipAdult: true })
    knob.remove()
    st.on(0)
    const sizzle = pan.querySelector('.sizzle')
    gsap.to(sizzle, { autoAlpha: 1, duration: 0.3 })
    k.sfx('sizzle')
    await k.wait(900)
    bar.set(5)

    // ═══ 6. льём тесто (держим миску) ═══
    const CEN = { x: 720, y: 356 }
    const pcake = k.prop(pcakeArt(), CEN.x, CEN.y, 300, 100, { z: 7 })
    gsap.set(pcake, { scale: 0.15, opacity: 0, transformPerspective: 700 })
    const jet = k.prop('<div style="width:100%;height:100%;border-radius:8px;background:#F9DE94;box-shadow:0 0 0 2px #D9A04E"></div>', 770, 300, 16, 70, { z: 9 })
    gsap.set(jet, { opacity: 0, transformOrigin: '50% 0%' })
    await k.hold(bowl, {
      duration: 2.4, prompt: k.key('pour_q'), host: pyx, sfx: 'pour',
      onStart: () => { gsap.to([bowl, batter], { x: 120, y: -300, rotation: -38, scale: 0.6, duration: 0.4, ease: 'power2.out' }); gsap.to(jet, { opacity: 1, duration: 0.2, delay: 0.3 }) },
      onLevel: p => { gsap.set(pcake, { scale: 0.15 + 0.85 * p, opacity: 1 }); gsap.set(mix, { opacity: 1 - 0.4 * p }) },
      onRelease: lvl => { if (lvl < 1) { gsap.to([bowl, batter], { x: 300, y: -55, rotation: 0, scale: 0.55, duration: 0.4 }); gsap.to(jet, { opacity: 0, duration: 0.1 }) } },
    })
    gsap.to(jet, { opacity: 0, duration: 0.2 })
    await k.play(gsap.to([bowl, batter], { x: 300, y: -55, rotation: 0, scale: 0.55, duration: 0.5, ease: 'power2.inOut' }))
    gsap.set(pcake, { scale: 1 })
    gsap.to([bowl, batter], { x: 520, opacity: 0, duration: 0.6, ease: 'back.in(1.2)', delay: 0.3, onComplete: () => { bowl.remove(); batter.remove() } })
    await k.tell(pyx, 'pour_ok', 'happy')

    // ═══ 7. пузырьки ═══
    const BUB = [[-78, -2], [-34, 12], [8, -10], [50, 10], [92, -2]]
    const bubs = BUB.map(([dx, dy]) => k.prop(bubbleArt(), CEN.x + dx, CEN.y - 4 + dy, 66, 66, { z: 9 }))
    k.popIn(bubs, 0.15)
    const holes = pcake.querySelector('.holes')
    await k.wait(700)
    await k.tapAll(bubs, {
      prompt: k.key('bubbles_q'), host: pyx,
      onTap: (el, idx, left) => {
        k.sparkle(k.centerOf(el).x, k.centerOf(el).y, 3)
        gsap.to(el, { scale: 1.6, opacity: 0, duration: 0.25, onComplete: () => el.remove() })
        gsap.to(holes, { opacity: (BUB.length - left) / BUB.length, duration: 0.3 })
        k.sayNumber(BUB.length - left)
      },
    })
    await k.wait(400)
    await k.tell(pyx, 'bubbles_ok', 'cheer')

    // ═══ 8. переворот: резкий взмах вверх ═══
    const top = pcake.querySelector('.top')
    const flipPancake = async () => {
      k.sfx('flip')
      const tl = gsap.timeline()
      tl.to(pcake, { y: -230, duration: 0.36, ease: 'power2.out' }).to(pcake, { y: 0, duration: 0.36, ease: 'power2.in' })
      gsap.to(pcake, { rotationX: 360, duration: 0.72, ease: 'none' })
      gsap.to(top, { fill: '#E39A4B', duration: 0.1, delay: 0.34 })
      await k.play(tl)
      gsap.set(pcake, { rotationX: 0 })
      gsap.to(holes, { opacity: 0.4, duration: 0.2 })
      k.sfx('sizzle')
    }
    const spat = k.food('spatula', 720, 470, 88, { z: 14 })
    const spBase = { l: 720 - 44, t: 470 - 130 }
    gsap.set(spat, { opacity: 0 })
    await new Promise(resolve => {
      k.say(k.key('flip_q'), pyx)
      k.setRepeat(() => void k.say(k.key('flip_q'), pyx))
      const hint = G.idleHint(k, G.wiggleHand({ x: 720, y: 470 }, { x: 720, y: 280 }))
      let t0 = 0, p0 = null, fails = 0, done = false
      const put = p => gsap.set(spat, { x: p.x - 44 - spBase.l, y: p.y - 60 - spBase.t })
      const tr = G.track(k, { x: 470, y: 230, w: 640, h: 360 }, {
        cursor: 'pointer',
        down: p => { hint.kick(); t0 = performance.now(); p0 = p; put(p); gsap.to(spat, { opacity: 1, duration: 0.1 }) },
        move: p => { if (tr.down) put(p) },
        up: p => {
          if (done || !p0) return
          const dt = performance.now() - t0, dy = p0.y - p.y
          gsap.to(spat, { opacity: 0, duration: 0.2 })
          if (dy > 90 && dt < 1500) win()
          else {
            fails++
            gsap.fromTo(pcake, { y: 0 }, { y: -14, yoyo: true, repeat: 1, duration: 0.15 })
            k.sfx('boing', { vol: 0.5 })
            if (fails % 2 === 1) k.tell(pyx, 'flip_slow', 'shake')
          }
        },
      })
      const win = () => { if (done) return; done = true; tr.destroy(); hint.stop(); k.setRepeat(null); end(); resolve() }
      const end = k.waiting('flip', () => { win(); return true })
    })
    spat.remove()
    await flipPancake()
    k.burst(CEN.x, CEN.y, 8)
    await k.tell(pyx, 'flip_ok', 'cheer')

    // ═══ 9. стопка из пяти ═══
    const plate = k.prop(kitchen.plate(), 1170, 700, 320, 111, { z: 5 })
    k.fromTo(plate, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    const stack = []
    const toPlate = async (el, n) => {
      const c = k.centerOf(el)
      const ty = 700 - 8 - n * 20
      await k.play(gsap.to(el, { x: `+=${1170 - c.x}`, y: `+=${ty - c.y}`, scale: 0.78, duration: 0.6, ease: 'power2.inOut' }))
      el.style.zIndex = String(8 + n)
      k.sfx('plop')
      await k.sayNumber(n + 1)
    }
    stack.push(pcake)
    await toPlate(pcake, 0)
    await k.tell(pyx, 'stack_q', 'point')
    for (let n = 1; n < 5; n++) {
      await k.tapN(pan, 1, n === 1 ? {} : {})
      const p = k.prop(pcakeArt('#E39A4B'), CEN.x, CEN.y, 300, 100, { z: 7 })
      p.querySelector('.holes').setAttribute('opacity', '0.4')
      gsap.set(p, { transformPerspective: 700 })
      k.sfx('sizzle')
      k.fromTo(p, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.6)' })
      await k.wait(450)
      gsap.to(p, { rotationX: 360, y: -150, duration: 0.5, ease: 'power1.out', yoyo: true, repeat: 1 })
      k.sfx('flip')
      await k.wait(1000)
      gsap.set(p, { rotationX: 0, y: 0 })
      stack.push(p)
      await toPlate(p, n)
    }
    k.burst(1170, 600, 10)
    await k.tell(pyx, 'stack_done', 'cheer')
    bar.set(6)

    // ═══ 10. варенье ═══
    const jam = k.prop(jamArt(), 1010, 610, 120, 137, { z: 9 })
    k.popIn(jam)
    const blob = k.prop(jamBlobArt(), 1170, 700 - 8 - 4 * 20 - 8, 190, 71, { z: 30 })
    gsap.set(blob, { scale: 0.05, opacity: 0, transformOrigin: '50% 60%' })
    const jamJet = k.prop('<div style="width:100%;height:100%;border-radius:8px;background:#E4425A;box-shadow:0 0 0 2px #B92C46"></div>', 1100, 545, 14, 60, { z: 29 })
    gsap.set(jamJet, { opacity: 0 })
    await k.hold(jam, {
      duration: 2, prompt: k.key('jam_q'), host: pyx, sfx: 'pour',
      onStart: () => { gsap.to(jam, { x: 110, y: -110, rotation: 65, duration: 0.35 }); gsap.to(jamJet, { opacity: 1, duration: 0.1, delay: 0.3 }) },
      onLevel: p => gsap.set(blob, { scale: 0.05 + 0.95 * p, opacity: 1 }),
      onRelease: lvl => { if (lvl < 1) { gsap.to(jam, { x: 0, y: 0, rotation: 0, duration: 0.3 }); gsap.to(jamJet, { opacity: 0, duration: 0.1 }) } },
    })
    gsap.to(jamJet, { opacity: 0, duration: 0.2 })
    gsap.to(jam, { x: 0, y: 0, rotation: 0, duration: 0.4 })
    k.burst(1170, 600, 8)
    await k.tell(pyx, 'jam_ok', 'happy')

    // ═══ финал: гости угощаются ═══
    const all = [plate, ...stack, blob]
    all.forEach(e => { e.style.zIndex = String(Number(e.style.zIndex || 5) + 12) })
    await k.play(gsap.to(all, { x: '+=130', y: '+=115', duration: 0.8, ease: 'power2.inOut' }))
    k.sfx('yum')
    hen.emote('happy'); cow.emote('happy')
    await k.tell(hen, 'hen_thx', 'jump')
    await k.tell(cow, 'cow_thx', 'happy')
    k.sfx('crunch')
    await k.play(gsap.to(all, { opacity: 0, scale: 0.2, duration: 0.6, stagger: 0.06, ease: 'power2.in' }))
    k.burst(1300, 800, 12)
    await k.tell(pyx, 'sum', 'point')
    bar.done(6)
    k.burst(800, 420, 14)
  },
})

function mixHex(a, b, t) {
  const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16))
  const A = h(a), B = h(b)
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')
}
