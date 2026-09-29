// «Тёрка-щекотка»: взрослая рука держит острую тёрку, малыш водит морковкой (потом сыром) — растёт горка стружки.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, L, C, E, R, HL, S, rounded, capsule, INK } from '../art.js'

const GRATER = { x: 800, y: 560, w: 300 }
const GH = Math.round((GRATER.w * 240) / 190)
const SKIN = '#FFD3B0'

/** Рука взрослого: белый поварской рукав с розовой манжетой, кулак слева (держит ручку тёрки). 900×210 */
const armArt = () => {
  const fingers = [0, 1, 2, 3].map(i => R(40, 64 + i * 26, 76, 26, 13, SKIN, { sw: 4 })).join('')
  return svg(900, 210,
    P('M900 26L430 46Q410 48 410 72L410 162Q410 186 430 188L900 206Z', '#FFFFFF') +
    L('M600 40L600 196M760 34L760 200', '#FFD6EC', 22) +
    R(404, 44, 36, 146, 12, '#FF8FC8') +
    S(capsule(150, 420, 118, 92), SKIN, '#F0B48E') +
    E(122, 120, 60, 62, SKIN) +
    fingers +
    P('M96 66Q112 40 148 52Q152 80 130 92Z', SKIN, { sw: 4 }) +
    HL(150, 96, 26, 6, -4, 0.5))
}

/** Мордочка для продукта: state 'open' (удивлён) / 'giggle' (хихикает). */
const faceArt = () => svg(70, 46,
  `<g class="f-open"><ellipse cx="20" cy="14" rx="7" ry="8" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="21" cy="15" r="3.6" fill="${INK}"/><ellipse cx="50" cy="14" rx="7" ry="8" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="51" cy="15" r="3.6" fill="${INK}"/><path d="M26 30Q35 40 44 30" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g>` +
  `<g class="f-giggle" style="display:none"><path d="M12 16Q20 6 28 16M42 16Q50 6 58 16" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/><path d="M22 28Q35 46 48 28Z" fill="#FF6B7A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>` +
  C(10, 30, 6, '#FF9EB1', { sw: 0 }) + C(60, 30, 6, '#FF9EB1', { sw: 0 }))

const cheeseBlock = () => svg(130, 250,
  S(rounded([[10, 10], [120, 10], [120, 240], [10, 240]], 16), '#FFD93D', '#F2B824', {
    extra: `<rect x="20" y="20" width="90" height="220" rx="10" fill="#FFE98A"/>`,
  }) +
  [[40, 60, 9], [88, 120, 12], [46, 180, 8], [90, 210, 6], [80, 46, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F2B824" stroke="${INK}" stroke-width="3"/>`).join('') +
  HL(30, 60, 5, 30, 0, 0.6))

/** Стружка: ломаная «пружинка» двух тонов. */
const strandPath = (x, y, rot, len = 26) => {
  const d = `M${x - len / 2} ${y}q${len / 4} -9 ${len / 2} 0t${len / 2} 0`
  return `<g transform="rotate(${rot} ${x} ${y})"><path d="${d}" fill="none" stroke="var(--sh)" stroke-width="9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="var(--bs)" stroke-width="5.5" stroke-linecap="round"/></g>`
}
const seeded = seed => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const HEAP = (() => {
  const r = seeded(7), a = []
  for (let i = 0; i < 54; i++) {
    const t = i / 54
    const half = 125 * (1 - t * 0.82)
    a.push([170 + (r() * 2 - 1) * half, 106 - t * 74 + (r() - 0.5) * 12, (r() - 0.5) * 90])
  }
  return a
})()
const SPREAD = (() => {
  const r = seeded(11), a = []
  for (let i = 0; i < 64; i++) {
    const ang = r() * Math.PI * 2, rad = Math.sqrt(r())
    a.push([170 + Math.cos(ang) * rad * 150, 65 + Math.sin(ang) * rad * 46, (r() - 0.5) * 120])
  }
  return a.sort((p, q) => p[1] - q[1])
})()
const pileSvg = (pts, n, base, shade) =>
  `<svg viewBox="0 0 340 130" width="100%" height="100%" overflow="visible" style="--bs:${base};--sh:${shade}">${pts.slice(0, n).map(([x, y, rot]) => strandPath(x, y, rot)).join('')}</svg>`

export default defineLevel({
  id: 'grate',
  async run(k) {
    const gsap = k.gsap
    k.kitchenBg()
    const board = k.food('board', 800, 690, 800, { z: 3 })
    const pyx = k.pyx({ x: 210 })
    k.fromTo(board, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })

    const drop = (el, y0 = -420) => {
      k.fromTo(el, { y: y0, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
      k.sfx('boing', { vol: 0.5 })
    }
    const fadeOut = els => { gsap.to(els, { opacity: 0, scale: 0.6, duration: 0.35, onComplete: () => els.forEach(e => e.remove()) }) }

    await k.wait(500)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(pyx, 'sharp', 'point')

    // ── взрослый держит тёрку ──
    const grater = k.food('grater', GRATER.x, GRATER.y, GRATER.w, { z: 5 })
    k.popIn(grater)
    await k.tell(pyx, 'mama', 'wave')
    const arm = k.prop(armArt(), 1165, 370, 900, 210, { z: 10 })
    k.fromTo(arm, { x: 760 }, { x: 0, duration: 0.8, ease: 'power2.out' })
    k.sfx('whoosh')
    await k.wait(900)
    await k.tell(pyx, 'mama_ok', 'nod')

    // Хапчик тянется к тёрке — «нельзя»
    const hap = k.guest('hapchik', 1820, 520, { size: 200, face: 'left' })
    hap.moveTo({ x: 1080, y: 520 })
    await k.wait(1000)
    await k.tell(hap, 'hap_grab', 'happy')
    gsap.fromTo(arm, { x: 0 }, { x: 40, duration: 0.15, yoyo: true, repeat: 3 })
    k.sfx('boing')
    hap.emote('surprised')
    await k.tell(pyx, 'hap_no', 'shake')
    await k.tell(hap, 'hap_bye')
    await hap.moveTo({ x: 1830, y: 520 })
    hap.el.remove()

    // ── стружка ──
    const bowl = k.prop(kitchen.bowl(), 800, 830, 300, 185, { z: 6 })
    k.popIn(bowl)
    const pile = k.prop('', 800, 768, 320, 122, { z: 8 })

    const strandSvg = (base, shade) => `<svg viewBox="0 0 40 16" width="100%" height="100%" overflow="visible" style="--bs:${base};--sh:${shade}">${strandPath(20, 8, k.rand(-30, 30))}</svg>`
    const round = async o => {
      const food1 = k.prop(o.art, GRATER.x, 560, o.w, o.h, { z: 7 })
      const face = k.prop(faceArt(), GRATER.x, 560, o.faceW, (o.faceW * 46) / 70, { z: 8 })
      const fOpen = face.querySelector('.f-open'), fGig = face.querySelector('.f-giggle')
      gsap.set(food1, { rotation: o.rot, transformOrigin: '50% 50%' })
      let cx = 800, cy = 610, said = 0, lastP = 0, lastSpawn = 0, lastN = -1, giggled = false, gigLine = false
      const place = () => {
        const s = 1 - 0.45 * lastP
        const yOff = -(1 - s) * (o.vlen / 2)
        gsap.set(food1, { x: cx - 800, y: cy - 560 + yOff, scaleX: o.rot ? s : 1, scaleY: o.rot ? 1 : s })
        gsap.set(face, { x: cx - 800, y: cy - 560 + yOff - o.vlen * s * 0.16 })
      }
      place()
      gsap.from([food1, face], { y: -420, opacity: 0, duration: 0.6, ease: 'bounce.out' })
      k.sfx('boing', { vol: 0.5 })
      await k.wait(700)
      if (o.intro) await k.tell(pyx, o.intro, 'point')
      const spawn = () => {
        for (let i = 0; i < 2; i++) {
          const st = k.prop(strandSvg(o.color, o.shade), 800 + k.rand(-60, 60), 690, 40, 16, { z: 9 })
          k.to(st, { y: k.rand(60, 90), x: k.rand(-14, 14), rotation: k.rand(-80, 80), opacity: 0.2, duration: 0.5, ease: 'power1.in', onComplete: () => st.remove() })
        }
      }
      await k.scrub(grater, {
        need: o.need, pad: 60, pulse: false, sfx: 'grate',
        prompt: k.key('q_grate'), host: pyx,
        onStart: () => { if (!giggled) { giggled = true; fOpen.style.display = 'none'; fGig.style.display = '' } },
        onProgress: (p, pos) => {
          lastP = p
          if (pos) { cx = 800 + Math.max(-26, Math.min(26, (pos.x - 800) * 0.25)); cy = 610 + Math.max(-28, Math.min(28, (pos.y - 590) * 0.3)) }
          place()
          if ((p - lastSpawn) * o.need > 46) { lastSpawn = p; spawn() }
          const n = Math.round(p * o.pts.length)
          if (n !== lastN) { lastN = n; pile.innerHTML = pileSvg(o.pts, n, o.color, o.shade) }
          const third = Math.floor(p * 3 + 0.0001)
          if (third > said && third <= 3) { said = third; k.sayNumber(third) }
          if (o.giggle && p > 0.12 && !gigLine) { gigLine = true; k.tell(pyx, 'giggle', 'laugh') }
        },
      })
      pile.innerHTML = pileSvg(o.pts, o.pts.length, o.color, o.shade)
      fOpen.style.display = ''; fGig.style.display = 'none'
      return { food1, face }
    }

    // 1. морковка
    const r1 = await round({
      art: food('carrot'), w: 260, h: 74, vlen: 260, faceW: 56, rot: 90, need: 900,
      intro: 'carrot', giggle: true, pts: HEAP, color: '#FFA24C', shade: '#E8792B',
    })
    k.burst(800, 700, 8)
    await k.tell(pyx, 'carrot_done', 'cheer')
    fadeOut([r1.food1, r1.face])
    await k.wait(400)

    // 2. сыр на пиццу
    fadeOut([bowl])
    gsap.to(pile, { opacity: 0, duration: 0.3, onComplete: () => { pile.innerHTML = ''; gsap.set(pile, { opacity: 1 }) } })
    const pizza = k.food('pizzaBase', 800, 822, 420, { z: 6 })
    gsap.set(pizza, { scaleY: 0.36 })
    drop(pizza, -200)
    gsap.set(pile, { y: 44, x: 0 })
    await k.tell(pyx, 'cheese', 'point')
    const r2 = await round({
      art: cheeseBlock(), w: 130, h: 250, vlen: 250, faceW: 62, rot: 0, need: 700,
      intro: null, giggle: false, pts: SPREAD, color: '#FFD93D', shade: '#E8A824',
    })
    k.burst(800, 780, 8)
    await k.tell(pyx, 'cheese_done', 'cheer')
    fadeOut([r2.food1, r2.face])

    // ── итог ──
    gsap.to(arm, { x: 760, duration: 0.7, ease: 'power2.in' })
    await k.narrate('sum')
    await k.tell(pyx, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
