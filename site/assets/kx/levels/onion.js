// «Лук-слезоточивик»: много слоёв (тапы, счёт), резка колечками, Капа плачет от щиплющих паров, очки для плавания помогают.
import { defineLevel, food, SIZE } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, L, F, C, E, R, HL, SH, S, rounded, INK } from '../art.js'

// «лежащая» луковица для cutLinear: пропорции
SIZE.onionLying = [380, 260]

const FLOOR = 960
const BODY = 'M85 34C120 34 156 70 156 116C156 158 124 178 85 178C46 178 14 158 14 116C14 70 50 34 85 34Z'

/** Слой-«одёжка» луковицы (вид спереди): s — масштаб относительно центра. */
const shellArt = (s, base, shade, stripe, tip) => svg(170, 194,
  `<g transform="translate(85 106) scale(${s}) translate(-85 -106)">` +
  S(BODY, base, shade, { extra: `<path d="M85 40Q52 80 52 128Q54 160 85 176M85 40Q118 80 118 128Q116 160 85 176M85 40Q30 84 30 130M85 40Q140 84 140 130" fill="none" stroke="${stripe}" stroke-width="4" opacity=".65"/>` }) +
  (tip ? P('M85 36Q78 18 86 4Q94 18 92 36Z', tip, { sw: 4 }) : '') +
  HL(48, 96, 10, 22, 20, 0.5) + '</g>')

const LAYERS = [
  { s: 1.0, base: '#E7B25A', shade: '#C68B3A', stripe: '#8A5A2E', tip: '#D9A24A' },
  { s: 0.92, base: '#F3D9F7', shade: '#D9B0E8', stripe: '#C99AD9', tip: '#EBD0F2' },
  { s: 0.8, base: '#F8E6FA', shade: '#E2C0EE', stripe: '#D2A8E2', tip: null },
  { s: 0.68, base: '#FFF1FE', shade: '#E8CDF2', stripe: '#DDB8EA', tip: null },
]
const CORE = { s: 0.5, base: '#FFFAFF', shade: '#F0DDF6', stripe: '#EBD0F2', tip: null }
const rootsArt = () => svg(170, 194, `<path d="M70 176L62 192M85 178L85 194M100 176L108 192" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`)

/** Луковица, лежащая на боку (для нарезки кольцами): 380×260. */
const lyingArt = () => svg(380, 260,
  SH(190, 250, 150, 8) +
  `<path d="M40 128L10 118M40 134L8 138M40 140L12 156" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
  S('M34 130C34 62 104 16 196 16C288 16 348 62 348 130C348 198 288 244 196 244C104 244 34 198 34 130Z', '#F3D9F7', '#D9B0E8', {
    extra: '<path d="M60 130Q196 24 336 130M60 130Q196 236 336 130M60 130Q196 66 336 130M60 130Q196 194 336 130" fill="none" stroke="#C99AD9" stroke-width="4" opacity=".55"/>',
  }) +
  P('M344 116L376 128L344 142Z', '#EBD0F2', { sw: 4 }) +
  HL(130, 62, 44, 10, -12, 0.55))

// карточки-подсказки
const gogglesArt = () => svg(220, 130,
  P('M6 66Q110 8 214 66', 'none', { sw: 0 }) +
  `<path d="M6 60Q110 4 214 60" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M6 60Q110 4 214 60" fill="none" stroke="#FF8FC8" stroke-width="11" stroke-linecap="round"/>` +
  R(94, 52, 32, 16, 8, '#FF8FC8', { sw: 5 }) +
  [56, 164].map(x => C(x, 70, 46, '#FF8FC8') + C(x, 70, 34, '#A5E5FF', { sw: 4 }) + HL(x - 12, 56, 12, 6, -35, 0.85)).join(''))

const mittensArt = () => {
  const one = (x, y, rot, col) => `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    P('M-30 60L-30 -20Q-30 -60 0 -60Q30 -60 30 -20L30 60Z', col, { sw: 5 }) +
    P('M-30 10Q-58 4 -56 -18Q-52 -34 -30 -26Z', col, { sw: 5 }) +
    R(-34, 50, 68, 26, 8, '#fff', { sw: 5 }) +
    [-16, 4, 22].map(d => `<path d="M${d} -40L${d + 6} -10" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`).join('') + '</g>'
  return svg(200, 170, one(60, 80, -12, '#FF5A5F') + one(140, 80, 12, '#4D96FF'))
}

const hatArt = () => svg(200, 170,
  S('M20 110C10 30 60 10 100 10C140 10 190 30 180 110Z', '#4D96FF', '#3572CC', { extra: [50, 80, 110, 140].map(x => `<path d="M${x} 20L${x - 4} 108" stroke="#fff" stroke-width="8" opacity=".55"/>`).join('') }) +
  R(12, 104, 176, 42, 20, '#FFFFFF', { sw: 5 }) +
  [30, 60, 90, 120, 150].map(x => `<path d="M${x} 112L${x} 138" stroke="#B8C0CC" stroke-width="4" stroke-linecap="round"/>`).join('') +
  C(100, 10, 22, '#FF5A5F') + HL(92, 2, 8, 5, -30, 0.7))

const puffArt = () => svg(90, 70,
  C(30, 40, 22, '#E8C6F0', { sw: 4 }) + C(52, 30, 24, '#F3D9F7', { sw: 4 }) + C(66, 46, 18, '#E8C6F0', { sw: 4 }) +
  `<path d="M14 62L74 62" stroke="none"/>` + C(52, 30, 12, '#FFFFFF', { sw: 0 }))
const dropArt = () => svg(40, 56, P('M20 4C28 22 36 30 36 40C36 50 28 54 20 54C12 54 4 50 4 40C4 30 12 22 20 4Z', '#62C6FF', { sw: 4 }) + HL(14, 38, 4, 8, 0, 0.8))

export default defineLevel({
  id: 'onion',
  async run(k) {
    const gsap = k.gsap
    k.kitchenBg()
    const board = k.food('board', 800, 690, 800, { z: 3 })
    const pyx = k.pyx({ x: 210 })
    const kapa = k.guest('kapa', 1860, FLOOR, { size: 280, face: 'left' })
    k.fromTo(board, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    const plate = k.prop(kitchen.plate(), 1310, 700, 260, 90, { z: 4 })
    k.fromTo(plate, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'back.out(1.6)' })

    // ── помощники ──
    const drop = (el, y0 = -420) => {
      k.fromTo(el, { y: y0, rotation: -8, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
      k.sfx('boing', { vol: 0.5 })
    }
    const eyesOf = () => {
      const es = [...kapa.el.querySelectorAll('.c-eye')]
      if (es.length) return es.map(e => k.centerOf(e))
      const c = k.centerOf(kapa.el)
      return [{ x: c.x - 22, y: c.y - 60 }, { x: c.x + 22, y: c.y - 60 }]
    }
    // слёзы: пока плачет — капельки из глаз
    let crying = null
    const startCry = () => {
      kapa.emote('sad')
      crying = k.every(340, () => {
        eyesOf().forEach(p => {
          const d = k.prop(dropArt(), p.x + k.rand(-5, 5), p.y + 8, 26, 36, { z: 14 })
          k.to(d, { y: k.rand(90, 150), x: k.rand(-20, 6), opacity: 0.15, duration: 0.8, ease: 'power1.in', onComplete: () => d.remove() })
        })
      })
    }
    const stopCry = () => { crying?.(); crying = null }
    // пар: облачка летят от луковицы к Капе
    const sting = (fromX, n = 3) => {
      const to = eyesOf()
      for (let i = 0; i < n; i++) {
        const p = k.prop(puffArt(), fromX + k.rand(-30, 30), 560 + k.rand(-30, 30), 70, 54, { z: 13 })
        gsap.set(p, { scale: 0.3, opacity: 0.9 })
        const t = to[i % to.length]
        const tl = k.gsap.timeline({ delay: i * 0.18, onComplete: () => p.remove() })
        tl.to(p, { scale: 1, y: -90, duration: 0.5, ease: 'power1.out' })
          .to(p, { x: `+=${t.x - fromX}`, y: `+=${t.y - 470}`, scale: 0.6, opacity: 0, duration: 0.9, ease: 'power1.inOut' })
      }
      k.sfx('whoosh', { vol: 0.25 })
    }
    const ringsOnPlate = []

    // ═══ 1. слои ═══
    await k.wait(500)
    await k.tell(pyx, 'hello', 'wave')
    const onion = k.prop('', 800, 610, 320, 366, { z: 6 })
    onion.appendChild(Object.assign(document.createElement('div'), { innerHTML: rootsArt() }))
    onion.lastChild.style.cssText = 'position:absolute;inset:0'
    const shells = LAYERS.map((l, i) => {
      const d = document.createElement('div')
      d.style.cssText = `position:absolute;inset:0;z-index:${10 + i * -1}`
      d.innerHTML = shellArt(l.s, l.base, l.shade, l.stripe, l.tip)
      return d
    })
    // самый внутренний — снизу, внешний — сверху
    const core = document.createElement('div')
    core.style.cssText = 'position:absolute;inset:0'
    core.innerHTML = shellArt(CORE.s, CORE.base, CORE.shade, CORE.stripe, null)
    onion.appendChild(core)
    for (let i = shells.length - 1; i >= 0; i--) onion.appendChild(shells[i])
    drop(onion)
    await k.wait(700)
    const kapaIn = kapa.moveTo({ x: 1370, y: FLOOR })
    await kapaIn
    kapa.face('left')
    await k.tell(kapa, 'kapa_hi', 'wave')

    for (let i = 1; i <= 4; i++) {
      await k.tapN(onion, 1, { prompt: i === 1 ? k.key('q_layers') : null, host: pyx })
      const sh = shells[i - 1]
      k.sfx('flip', { vol: 0.5 })
      const dir = i % 2 ? 1 : -1
      gsap.to(sh, { x: dir * 300, y: -90 + i * 30, rotation: dir * (50 + i * 10), opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => sh.remove() })
      await k.sayNumber(i)
      if (i === 1) await k.tell(pyx, 'husk', 'point')
      if (i === 2) await k.tell(pyx, 'inner', 'nod')
    }
    await k.wait(500)
    k.burst(800, 500, 8)
    await k.tell(pyx, 'layers_sum', 'cheer')
    gsap.to(onion, { opacity: 0, scale: 0.6, duration: 0.4, onComplete: () => onion.remove() })
    await k.wait(500)

    // ═══ 2. режем колечки — и Капа плачет ═══
    await k.tell(pyx, 'cut_intro', 'point')
    const lying = k.prop(lyingArt(), 760, 640, 380, 260, { z: 6 })
    drop(lying)
    await k.wait(700)
    let cutN = 0
    const cutRound = async (o) => {
      const el = o.el
      const res = await k.cutLinear({
        food: 'onionLying', el, at: { x: 760, y: 640 }, width: 380, mode: 'slices', slice: 'onionRing', sliceW: 100,
        cuts: o.cuts, tol: 0.07, juice: '#EBD0F2',
        plate: o.plate, plateStep: { x: 22, y: -9 }, plateWrap: 4, plateRow: 0,
        prompt: o.prompt ? k.key(o.prompt) : null, host: pyx,
        onMiss: n => { if (n % 3 === 1) k.tell(pyx, 'miss') },
        onCut: async (i, info) => {
          ringsOnPlate.push(info.slice.el)
          cutN++
          await k.sayNumber(i + 1)
          if (o.cry) {
            sting(info.x, i + 1)
            if (i === 0) { kapa.emote('surprised') }
            if (i === 1) { startCry(); await k.tell(kapa, 'kapa_sniff') }
            if (i === 2) await k.tell(kapa, 'kapa_cry')
          } else if (i === 0) await k.tell(kapa, 'kapa_ok', 'happy')
        },
      })
      res.clear?.()
      return res
    }
    await cutRound({ el: lying, cuts: [0.3, 0.6, 0.9], prompt: 'q_cut1', cry: true, plate: { x: 1250, y: 690 } })
    await k.tell(pyx, 'why', 'point')

    // ═══ 3. что поможет? ═══
    const asCard = (art, w, h) => `<div style="width:${w}px;height:${h}px;display:grid;place-items:center">${art}</div>`
    const eyesMid = () => { const e = eyesOf(); return { x: (e[0].x + e[1].x) / 2, y: (e[0].y + e[1].y) / 2 } }
    const wear = async (art, w, h, dx, dy) => {
      const m = eyesMid()
      const el = k.prop(art, m.x + dx, m.y + dy, w, h, { z: 16 })
      k.fromTo(el, { y: -160, opacity: 0, scale: 0.6 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'bounce.out' })
      k.sfx('pop')
      await k.wait(600)
      return el
    }
    let worn = null
    await k.choose({
      prompt: k.key('q_help'), host: pyx,
      options: [
        {
          id: 'mittens', art: asCard(mittensArt(), 200, 170), color: '#FF5A5F',
          outcome: async () => {
            const m = await wear(mittensArt(), 150, 128, 0, 70)
            kapa.emote('shake')
            await k.tell(pyx, 'mittens', 'laugh')
            await k.tell(kapa, 'mittens_kapa')
            gsap.to(m, { opacity: 0, y: 40, duration: 0.3, onComplete: () => m.remove() })
          },
        },
        {
          id: 'hat', art: asCard(hatArt(), 200, 170), color: '#4D96FF',
          outcome: async () => {
            const m = await wear(hatArt(), 132, 112, 0, -66)
            kapa.emote('shake')
            await k.tell(pyx, 'hat', 'laugh')
            await k.tell(kapa, 'hat_kapa')
            gsap.to(m, { opacity: 0, y: -40, duration: 0.3, onComplete: () => m.remove() })
          },
        },
        {
          id: 'goggles', art: asCard(gogglesArt(), 210, 124), color: '#62C6FF', correct: true,
          outcome: async () => {
            worn = await wear(gogglesArt(), 130, 78, 0, 6)
            stopCry()
            k.sparkle(eyesMid().x, eyesMid().y, 6)
            kapa.emote('cheer')
            k.burst(eyesMid().x, eyesMid().y - 30, 8)
            await k.tell(pyx, 'goggles', 'cheer')
          },
        },
      ],
    })

    // ═══ 4. режем в очках — ничего не щиплет ═══
    await k.tell(pyx, 'round2', 'point')
    const lying2 = k.prop(lyingArt(), 760, 640, 380, 260, { z: 6 })
    drop(lying2)
    await k.wait(700)
    await cutRound({ el: lying2, cuts: [0.22, 0.44, 0.66, 0.88], prompt: 'q_cut2', cry: false, plate: { x: 1345, y: 686 } })
    k.burst(1250, 600, 10)
    await k.tell(pyx, 'all_rings', 'cheer')
    await k.narrate('sum')
    await k.tell(kapa, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
