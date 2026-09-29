// «Куда пропала соль?» — соль тонет, при размешивании «пропадает» (растворяется, вкус остаётся),
// а песок остаётся на дне. Стакан с водой и крупинками нарисован здесь же (art.js + немного HTML).
import { defineLevel } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, R, HL, SH, S, ellipsePath, mix, nid } from '../art.js'

// ───────────────────────── стакан ─────────────────────────
const GW = 280, GH = 380
const BODY = 'M20 30L260 30L238 348Q236 366 218 366L62 366Q44 366 42 348Z'
const INNER = 'M28 36L252 36L232 348Q230 358 216 358L64 358Q50 358 48 348Z'
const CLIP = 'polygon(28px 36px,252px 36px,232px 348px,216px 358px,64px 358px,48px 348px)'
const WATER = { wt: '#A9DCFF', ws: '#D3EEFF' }

export const glassHTML = (level = 100) => {
  const id = nid('g')
  return `<div style="position:relative;width:100%;height:100%">
  <div style="position:absolute;inset:0">${svg(GW, GH,
    `<clipPath id="${id}"><path d="${INNER}"/></clipPath>` + SH(140, 368, 112, 9) +
    `<path d="${BODY}" fill="#EAF6FF" opacity=".85"/>` +
    `<g clip-path="url(#${id})"><rect class="wt" x="0" y="${level}" width="280" height="280" fill="${WATER.wt}"/><rect class="ws" x="0" y="${level}" width="280" height="14" fill="${WATER.ws}"/></g>`)}</div>
  <div class="gl-fx" style="position:absolute;inset:0;clip-path:${CLIP}"></div>
  <div style="position:absolute;inset:0;pointer-events:none">${svg(GW, GH,
    `<path d="${BODY}" fill="none" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
    L('M50 70L62 330', '#fff', 10, 'opacity=".55"') + L('M226 60L216 190', '#fff', 6, 'opacity=".35"'))}</div>
</div>`
}

/** Ложка с горкой соли (вертикально, чашка сверху). */
const saltSpoon = () => svg(90, 260,
  P('M38 100L52 100L55 246Q55 256 45 256Q35 256 35 246Z', '#DDE6F2', { sw: 5 }) +
  S(ellipsePath(45, 62, 36, 54), '#EEF3FA', '#B8C0CC') +
  `<g class="pile">` + P('M14 68Q45 8 76 68Q45 80 14 68Z', '#FFFFFF', { sw: 4, ink: '#8FB0CC' }) +
  [[36, 46], [52, 40], [44, 58], [60, 56], [30, 60]].map(([x, y]) => R(x - 5, y - 5, 10, 10, 2, '#fff', { sw: 2.5, ink: '#8FB0CC', rot: x * 3 })).join('') + `</g>`)

/** Длинная деревянная ложка для размешивания: чашка внизу, ручка торчит из стакана. */
const stirSpoonArt = () => svg(50, 340,
  P('M20 6L30 6L32 292L18 292Z', '#E2B78A', { sw: 4 }) + S(ellipsePath(25, 308, 21, 28), '#D9A56A', '#B98444', { sw: 4 }))

/** Карточка «растворилась»: стакан с крошечными точками. */
const dissolveArt = () => svg(120, 120,
  P('M24 16L96 16L88 104Q87 112 78 112L42 112Q33 112 32 104Z', '#CFEAFF', { sw: 6 }) +
  [[46, 50], [70, 44], [58, 66], [78, 76], [44, 86], [62, 98], [80, 58], [54, 36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#fff" stroke="#8FB0CC" stroke-width="1.5"/>`).join('') +
  HL(38, 44, 4, 16, 5, 0.7))

/** Лупа: круг, внутри увеличенные крупинки (наполняется отдельно). */
const lensHTML = () => `<div style="position:relative;width:100%;height:100%">
  <div style="position:absolute;inset:0">${svg(260, 320, L('M206 208L248 300', INK, 32) + L('M206 208L248 300', '#B388EB', 20))}</div>
  <div class="lens-in" style="position:absolute;left:14px;top:14px;width:232px;height:232px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F0FAFF,#A9DCFF 70%);overflow:hidden"></div>
  <div style="position:absolute;inset:0">${svg(260, 320, `<circle cx="130" cy="130" r="117" fill="none" stroke="${INK}" stroke-width="24"/><circle cx="130" cy="130" r="117" fill="none" stroke="#B388EB" stroke-width="12"/>` + L('M62 92Q74 60 104 48', '#fff', 9, 'opacity=".8"'))}</div>
</div>`

export const ART = { saltSpoon, stirSpoonArt, dissolveArt }

export default defineLevel({
  id: 'salt-melts',
  async run(k) {
    const gsap = k.gsap
    k.bgTable({ wall: '#E4F3FF', dot: '#CDE8FF', cloth: '#6FC3FF', cloth2: '#A8DBFF' })
    const pyx = k.pyx({ x: 230 })
    const ham = k.guest('shchyok', 1425, 705, { size: 320 })
    const emoji = (e, size = 100) => `<span class="emoji" style="font-size:${size}px;line-height:1">${e}</span>`
    const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v))

    // ── стакан с крупинками ──
    const makeGlass = (cx, cy, s = 1) => {
      const el = k.prop(glassHTML(), cx, cy, GW, GH, { z: 6 })
      gsap.set(el, { scale: s })
      const fx = el.querySelector('.gl-fx')
      const water = [...el.querySelectorAll('.wt, .ws')]
      const g = { el, fx, water, grains: [] }
      g.sc = () => Number(gsap.getProperty(el, 'scale'))
      g.center = () => k.centerOf(el)
      g.mouth = () => { const c = g.center(); return { x: c.x, y: c.y + (36 - GH / 2) * g.sc() } }
      g.drop = (n, kind) => {
        const sand = kind === 'sand'
        for (let i = 0; i < n; i++) {
          const d = document.createElement('div')
          const sz = sand ? k.rand(7, 11) : 12
          d.style.cssText = sand
            ? `position:absolute;left:0;top:0;width:${sz}px;height:${sz}px;border-radius:50%;background:${k.pick(['#D9B26B', '#C99A55', '#E8C98A'])};box-shadow:0 0 0 1.5px #8A6A38`
            : 'position:absolute;left:0;top:0;width:12px;height:12px;border-radius:2px;background:#fff;box-shadow:0 0 0 2px #B9D3E6'
          fx.appendChild(d)
          if (sand) { d._rx = 140 + (Math.random() + Math.random() - 1) * 78; d._ry = 340 - Math.max(0, 1 - Math.abs(d._rx - 140) / 82) * 26 * Math.random() - Math.random() * 4 }
          else { d._rx = 74 + Math.random() * 132; d._ry = 336 - Math.random() * 14 }
          d._d = Math.random() * 0.5; d._ph = Math.random() * 6.28; d._h = 0.35 + Math.random() * 0.65
          gsap.set(d, { x: 140 + k.rand(-24, 24), y: 20, rotation: k.rand(-40, 40) })
          k.to(d, { x: d._rx, y: d._ry, rotation: k.rand(-60, 60), duration: k.rand(1, 1.5), delay: i * 0.03, ease: 'power1.in' })
          g.grains.push(d)
        }
      }
      /** p — прогресс размешивания. Соль растворяется, песок взмучивается и оседает. */
      g.effect = (p, kind) => {
        const sand = kind === 'sand'
        const lift = sand ? Math.sin(p * Math.PI) : Math.sin(Math.min(1, p * 2) * Math.PI / 2)
        for (const d of g.grains) {
          const ang = p * 12 + d._ph
          const t = sand ? 0 : clamp((p - d._d) / 0.4)
          gsap.set(d, { x: d._rx + Math.cos(ang) * 40 * lift, y: d._ry - 130 * lift * d._h + Math.sin(ang) * 16 * lift, opacity: 1 - t, scale: 1 - 0.7 * t })
        }
        const tint = Math.sin(p * Math.PI) * (sand ? 0.75 : 0.35)
        for (const w of g.water) gsap.set(w, { fill: mix(w.classList.contains('ws') ? WATER.ws : WATER.wt, sand ? '#C8AE80' : '#FFFFFF', tint) })
      }
      return g
    }

    const stirGlass = async (g, kind, promptKey) => {
      const c = g.center(), sc = g.sc()
      const sp = k.prop(stirSpoonArt(), c.x + 14 * sc, c.y - 30 * sc, 50 * sc / 0.86, 340 * sc / 0.86, { z: 13 })
      sp.style.opacity = 0
      await k.stir({ x: c.x, y: c.y + 20 }, {
        radius: 80, turns: 3, prompt: promptKey ? k.key(promptKey) : null, host: pyx,
        onProgress: (p, a) => { sp.style.opacity = 1; gsap.set(sp, { x: Math.cos(a) * 26 * sc, y: Math.sin(a) * 8, rotation: Math.cos(a) * 6 }); g.effect(p, kind) },
      })
      k.to(sp, { opacity: 0, y: -40, duration: 0.3, onComplete: () => sp.remove() })
      if (kind === 'salt') {
        g.grains.forEach(d => d.remove()); g.grains = []
        k.sparkle(c.x, c.y, 8)
        k.sfx('magic', { vol: 0.6 })
      } else {
        g.grains.forEach(d => k.to(d, { x: d._rx, y: d._ry, opacity: 1, scale: 1, duration: 0.8, ease: 'sine.inOut' }))
        gsap.to(g.water, { fill: (i, el) => (el.classList.contains('ws') ? WATER.ws : WATER.wt), duration: 0.6 })
      }
    }

    // ── 1. фокус: соль в воду ──
    await k.wait(300)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(ham, 'hi', 'happy')
    const S0 = 0.84
    const A = makeGlass(800, 545, S0)
    gsap.fromTo(A.el, { scale: 0, opacity: 0 }, { scale: S0, opacity: 1, duration: 0.5, ease: 'back.out(2.2)' })
    const spoon = k.prop(saltSpoon(), 540, 560, 80, 232, { z: 10 })
    gsap.set(spoon, { rotation: 18 })
    k.popIn(spoon)
    await k.wait(400)
    await k.tell(pyx, 'glass', 'point')

    const pile = spoon.querySelector('.pile')
    const pourSalt = async () => {
      const c0 = k.centerOf(spoon), gm = A.mouth()
      await k.play(gsap.to(spoon, { x: gm.x - 58 - c0.x, y: gm.y - 34 - c0.y, rotation: 100, duration: 0.5, ease: 'power2.out' }))
      k.sfx('sprinkle')
      gsap.to(pile, { opacity: 0, duration: 0.4 })
      A.drop(14, 'salt')
      await k.wait(650)
      await k.play(gsap.to(spoon, { x: 0, y: 0, rotation: 18, duration: 0.45, ease: 'back.out(1.5)' }))
      gsap.to(pile, { opacity: 1, duration: 0.3 })
    }
    for (let i = 1; i <= 2; i++) {
      await k.tapN(spoon, 1, { prompt: i === 1 ? k.key('q_spoon') : k.key('q_more'), host: pyx })
      await pourSalt()
      await k.sayNumber(i)
      if (i === 1) await k.tell(pyx, 'sink', 'point')
    }
    k.to(spoon, { opacity: 0, x: -60, duration: 0.3 })

    // ── 2. мешаем — соль «пропала» ──
    await stirGlass(A, 'salt', 'q_stir')
    ham.emote('surprised')
    await k.tell(pyx, 'gone', 'surprised')
    const q = k.bubble('❓', 1230, 480, { w: 170, h: 150, tail: 'right', font: 80 })
    await k.tell(ham, 'gone_h', 'think')
    k.to(q, { scale: 0, opacity: 0, duration: 0.25, onComplete: () => q.remove() })

    // ── 3. вопрос: куда пропала соль? ──
    const lens = k.prop(lensHTML(), 1150, 380, 260, 320, { z: 40 })
    gsap.set(lens, { scale: 0, autoAlpha: 0 })
    const lensIn = lens.querySelector('.lens-in')
    const tiny = []
    for (let i = 0; i < 30; i++) {
      const d = document.createElement('div')
      d.style.cssText = 'position:absolute;left:0;top:0;width:11px;height:11px;border-radius:3px;background:#fff;box-shadow:0 0 0 2px #8FB0CC'
      lensIn.appendChild(d)
      gsap.set(d, { x: 20 + Math.random() * 190, y: 20 + Math.random() * 190, rotation: Math.random() * 90 })
      tiny.push(d)
    }
    await k.choose({
      prompt: k.key('q_where'), host: pyx, skill: 'science:dissolve',
      options: [
        { id: 'fly', art: emoji('🐦'), color: '#FFB938', outcome: async () => { k.sfx('wrong', { vol: 0.5 }); await k.tell(pyx, 'c_fly', 'laugh') } },
        { id: 'hide', art: emoji('🙈'), color: '#FF8FC8', outcome: async () => { k.sfx('wrong', { vol: 0.5 }); await k.tell(pyx, 'c_hide', 'think') } },
        {
          id: 'melt', art: dissolveArt(), color: '#62C6FF', correct: true,
          outcome: async () => {
            k.sfx('correct')
            await k.tell(pyx, 'c_ok', 'cheer')
            k.sfx('magic', { vol: 0.6 })
            gsap.to(lens, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.8)' })
            tiny.forEach(d => k.to(d, { x: 20 + Math.random() * 190, y: 20 + Math.random() * 190, rotation: '+=90', duration: 1.4 + Math.random(), repeat: -1, yoyo: true, ease: 'sine.inOut' }))
            await k.tell(pyx, 'lens', 'point')
          },
        },
      ],
    })
    k.to(lens, { scale: 0, autoAlpha: 0, duration: 0.3 })

    // ── 4. Щёчкин пробует воду ──
    const tspoon = k.prop(kitchen.spoonWood(), 1140, 560, 58, 188, { z: 14 })
    gsap.set(tspoon, { rotation: 28 })
    k.popIn(tspoon)
    await k.tapOnEl(tspoon, { prompt: k.key('q_taste'), host: pyx })
    {
      const gc = A.center(), c0 = k.centerOf(tspoon)
      await k.play(gsap.to(tspoon, { x: gc.x - c0.x + 20, y: gc.y - c0.y - 30, rotation: 0, duration: 0.6, ease: 'power2.inOut' }))
      k.sfx('bloop')
      await k.wait(250)
      const m = { x: 1425, y: 705 - 0.41 * 320 }
      await k.play(gsap.to(tspoon, { x: m.x - c0.x - 10, y: m.y - c0.y + 40, rotation: 12, duration: 0.7, ease: 'power2.inOut' }))
      k.sfx('yum', { vol: 0.5 })
    }
    ham.emote('surprised')
    await k.tell(ham, 'salty')
    await k.play(gsap.to(tspoon, { opacity: 0, duration: 0.3 }))
    tspoon.remove()

    // ── 5. а песок? ──
    await k.tell(pyx, 'sand', 'think')
    const tm = 0.72
    k.to(A.el, { x: -230, y: 20, scale: tm, duration: 0.7, ease: 'power2.inOut' })
    const B = makeGlass(1020, 556)
    gsap.fromTo(B.el, { scale: 0, opacity: 0 }, { scale: tm, opacity: 1, duration: 0.5, ease: 'back.out(2.2)' })
    const bucket = k.prop(kitchen.sandBucket(), 1205, 620, 130, 143, { z: 12 })
    k.popIn(bucket)
    await k.wait(800)
    await k.tapOnEl(bucket, { prompt: k.key('q_sand'), host: pyx })
    {
      const c0 = k.centerOf(bucket), M = B.mouth()
      await k.play(gsap.to(bucket, { x: M.x + 96 - c0.x, y: M.y - 6 - c0.y, rotation: -100, duration: 0.55, ease: 'power2.out' }))
      k.sfx('sprinkle')
      B.drop(70, 'sand')
      await k.wait(900)
      await k.play(gsap.to(bucket, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.5)' }))
    }
    await stirGlass(B, 'sand', 'q_stir2')
    await k.tell(pyx, 'sand_stays', 'point')
    ham.emote('sad')
    await k.tell(ham, 'sand_h')
    await k.tell(pyx, 'diff', 'nod')
    await k.tell(pyx, 'hot', 'point')
    await k.tell(pyx, 'sum', 'cheer')
    await k.tell(ham, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
