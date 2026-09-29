// «Яйцо-поплавок» — в простой воде яйцо тонет; насыпаем соль ложками (считаем), размешиваем — яйцо всплывает.
// Финал: в солёном море легко держаться на воде — Щёчкин на надувном круге.
import { defineLevel, food } from '../lib.js'
import { INK, svg, P, L, C, E, R, HL, SH, S, ellipsePath, nid } from '../art.js'

// ───────────────────────── стакан (как в salt-melts, вода повыше) ─────────────────────────
const GW = 280, GH = 380
const BODY = 'M20 30L260 30L238 348Q236 366 218 366L62 366Q44 366 42 348Z'
const INNER = 'M28 36L252 36L232 348Q230 358 216 358L64 358Q50 358 48 348Z'
const CLIP = 'polygon(28px 36px,252px 36px,232px 348px,216px 358px,64px 358px,48px 348px)'
const WATER_Y = 84

const glassHTML = () => {
  const id = nid('g')
  return `<div style="position:relative;width:100%;height:100%">
  <div style="position:absolute;inset:0">${svg(GW, GH,
    `<clipPath id="${id}"><path d="${INNER}"/></clipPath>` + SH(140, 368, 112, 9) +
    `<path d="${BODY}" fill="#EAF6FF" opacity=".85"/>` +
    `<g clip-path="url(#${id})"><rect x="0" y="${WATER_Y}" width="280" height="280" fill="#A9DCFF"/><rect x="0" y="${WATER_Y}" width="280" height="14" fill="#D3EEFF"/></g>`)}</div>
  <div class="gl-fx" style="position:absolute;inset:0;clip-path:${CLIP}"></div>
  <div style="position:absolute;inset:0;pointer-events:none">${svg(GW, GH,
    `<path d="${BODY}" fill="none" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
    L('M50 70L62 330', '#fff', 10, 'opacity=".55"') + L('M226 60L216 190', '#fff', 6, 'opacity=".35"'))}</div>
</div>`
}

const saltSpoon = () => svg(90, 260,
  P('M38 100L52 100L55 246Q55 256 45 256Q35 256 35 246Z', '#DDE6F2', { sw: 5 }) +
  S(ellipsePath(45, 62, 36, 54), '#EEF3FA', '#B8C0CC') +
  `<g class="pile">` + P('M14 68Q45 8 76 68Q45 80 14 68Z', '#FFFFFF', { sw: 4, ink: '#8FB0CC' }) +
  [[36, 46], [52, 40], [44, 58], [60, 56], [30, 60]].map(([x, y]) => R(x - 5, y - 5, 10, 10, 2, '#fff', { sw: 2.5, ink: '#8FB0CC', rot: x * 3 })).join('') + `</g>`)

const stirSpoonArt = () => svg(50, 340,
  P('M20 6L30 6L32 292L18 292Z', '#E2B78A', { sw: 4 }) + S(ellipsePath(25, 308, 21, 28), '#D9A56A', '#B98444', { sw: 4 }))

/** Мини-картинка для карточки: стакан, яйцо на дне / у поверхности. */
const predictArt = kind => {
  const y = kind === 'sink' ? 92 : 40
  const arrow = kind === 'sink'
    ? P('M100 60L100 94M88 82L100 96L112 82', 'none', { sw: 6, ink: '#FF5A5F' })
    : P('M100 90L100 56M88 68L100 54L112 68', 'none', { sw: 6, ink: '#6BCB77' })
  return svg(130, 130,
    P('M20 12L84 12L78 118Q77 126 68 126L36 126Q27 126 26 118Z', '#CFEAFF', { sw: 6 }) +
    `<path d="M23 34L82 34L78 118Q77 126 68 126L36 126Q27 126 26 118Z" fill="#8FD0FF" opacity=".7"/>` +
    E(52, y, 15, 19, '#FFF4DF', { sw: 4 }) + arrow)
}

/** Море: небо, солнце, облака, вода с волнами, песок. */
const seaBg = () => {
  const a = nid('sk'), b = nid('sea')
  const wave = (y, x0, n) => Array.from({ length: n }, (_, i) => `M${x0 + i * 180} ${y}q45 -22 90 0`).join('')
  return svg(1600, 1000,
    `<defs><linearGradient id="${a}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ED4FF"/><stop offset="1" stop-color="#E4F6FF"/></linearGradient>` +
    `<linearGradient id="${b}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4DB4FA"/><stop offset="1" stop-color="#2F86E6"/></linearGradient></defs>` +
    `<rect x="-10" y="-10" width="1620" height="1020" fill="url(#${a})"/>` +
    C(1230, 200, 74, '#FFE066', { sw: 0 }) + C(1230, 200, 104, '#FFF6B8', { sw: 0, attr: 'opacity=".5"' }) +
    `<g fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"><path d="M300 190q-40 0 -40 -34q0 -34 44 -32q14 -34 60 -22q40 -8 52 26q42 4 36 36q-4 26 -40 26Z"/><path d="M760 120q-30 0 -30 -26q0 -26 34 -24q10 -26 46 -16q30 -6 40 20q32 4 28 28q-3 20 -30 20Z"/></g>` +
    `<rect x="-10" y="390" width="1620" height="340" fill="url(#${b})"/>` +
    `<path d="M-10 392Q40 376 90 392T190 392T290 392T390 392T490 392T590 392T690 392T790 392T890 392T990 392T1090 392T1190 392T1290 392T1390 392T1490 392T1590 392" fill="none" stroke="#fff" stroke-width="6" opacity=".7"/>` +
    `<path d="${wave(470, 60, 9)}${wave(560, 150, 9)}${wave(650, 20, 9)}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".45"/>` +
    `<path d="M-10 735Q60 715 130 735T270 735T410 735T550 735T690 735T830 735T970 735T1110 735T1250 735T1390 735T1530 735T1670 735L1670 1010L-10 1010Z" fill="#FFE3A6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<g fill="#F2C878">${[[120, 830], [340, 900], [560, 850], [820, 930], [1040, 870], [1300, 920], [1500, 850], [200, 960]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`).join('')}</g>`)
}

const ringPart = front => {
  const d = front ? 'M30 65A120 34 0 0 0 270 65' : 'M30 65A120 34 0 0 1 270 65'
  return svg(300, 130,
    `<path d="${d}" fill="none" stroke="${INK}" stroke-width="54" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="#FF5A5F" stroke-width="42" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="#fff" stroke-width="42" stroke-dasharray="26 50" stroke-dashoffset="${front ? 6 : 30}"/>` +
    (front ? L('M52 92Q90 108 140 110', '#fff', 6, 'opacity=".6"') : ''))
}

/** Передняя волна: полоса воды с мягкими краями (перекрывает нижнюю часть круга и лапки). */
const wavesFront = () => {
  const g = nid('wf')
  return svg(1040, 100,
    `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3792EC" stop-opacity="0"/><stop offset=".14" stop-color="#3792EC"/><stop offset=".9" stop-color="#3792EC"/><stop offset="1" stop-color="#3792EC" stop-opacity="0"/></linearGradient></defs>` +
    `<path d="M0 34Q35 6 70 34T140 34T210 34T280 34T350 34T420 34T490 34T560 34T630 34T700 34T770 34T840 34T910 34T980 34T1050 34L1050 100L0 100Z" fill="url(#${g})"/>` +
    `<path d="M140 34Q175 6 210 34T280 34T350 34T420 34T490 34T560 34T630 34T700 34T770 34T840 34T910 34" fill="none" stroke="#A8DBFF" stroke-width="6" stroke-linecap="round" opacity=".9"/>` +
    `<path d="M200 62Q235 44 270 62T340 62T410 62T480 62T550 62T620 62T690 62T760 62T830 62" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>`)
}

export const ART = { predictArt, seaBg, ringPart, wavesFront }

export default defineLevel({
  id: 'egg-float',
  async run(k) {
    const gsap = k.gsap
    const tableBg = k.bgTable({ wall: '#FFF3D6', dot: '#FFE3A3', cloth: '#FFB938', cloth2: '#FFD98A' })
    const pyx = k.pyx({ x: 230 })
    const ham = k.guest('shchyok', 1425, 705, { size: 320 })
    const S0 = 0.84

    // ── стакан ──
    const el = k.prop(glassHTML(), 800, 545, GW, GH, { z: 6 })
    const fx = el.querySelector('.gl-fx')
    const sc = () => Number(gsap.getProperty(el, 'scale'))
    const mouth = () => { const c = k.centerOf(el); return { x: c.x, y: c.y + (36 - GH / 2) * sc() } }
    const grains = []
    const dropGrains = n => {
      for (let i = 0; i < n; i++) {
        const d = document.createElement('div')
        d.style.cssText = 'position:absolute;left:0;top:0;width:12px;height:12px;border-radius:2px;background:#fff;box-shadow:0 0 0 2px #B9D3E6'
        fx.appendChild(d)
        d._rx = 60 + Math.random() * 160; d._ry = 336 - Math.random() * 12
        d._d = Math.random() * 0.5; d._ph = Math.random() * 6.28; d._h = 0.35 + Math.random() * 0.65
        gsap.set(d, { x: 140 + k.rand(-24, 24), y: 20, rotation: k.rand(-40, 40) })
        k.to(d, { x: d._rx, y: d._ry, rotation: k.rand(-60, 60), duration: k.rand(1, 1.4), delay: i * 0.03, ease: 'power1.in' })
        grains.push(d)
      }
    }
    const dissolve = p => {
      const lift = Math.sin(Math.min(1, p * 2) * Math.PI / 2)
      for (const d of grains) {
        const ang = p * 12 + d._ph
        const t = Math.max(0, Math.min(1, (p - d._d) / 0.4))
        gsap.set(d, { x: d._rx + Math.cos(ang) * 40 * lift, y: d._ry - 130 * lift * d._h + Math.sin(ang) * 16 * lift, opacity: 1 - t, scale: 1 - 0.7 * t })
      }
    }
    // яйцо внутри стакана (в слое с обрезкой по воде)
    const eggIn = document.createElement('div')
    eggIn.style.cssText = 'position:absolute;left:0;top:0;width:112px;height:139px'
    eggIn.innerHTML = food('egg')
    const setEgg = (cy, cx = 140) => gsap.set(eggIn, { x: cx - 56, y: cy - 70 })

    await k.wait(300)
    gsap.fromTo(el, { scale: 0, opacity: 0 }, { scale: S0, opacity: 1, duration: 0.5, ease: 'back.out(2.2)' })
    const egg = k.food('egg', 520, 650, 100, { z: 8 })
    k.popIn(egg)
    await k.tell(pyx, 'hello', 'wave')

    // ── 1. яйцо в простой воде — тонет ──
    await k.dnd({
      items: [{ id: 'egg', el: egg }], zones: [{ id: 'glass', el }], accept: () => true,
      prompt: k.key('q_drop'), host: pyx,
      onCorrect: async () => {
        const m = mouth(), c = k.centerOf(egg)
        await k.play(gsap.to(egg, { x: `+=${m.x - c.x}`, y: `+=${m.y - 20 - c.y}`, scale: 0.84, duration: 0.3, ease: 'power2.out' }))
        egg.remove()
        fx.appendChild(eggIn); setEgg(78)
        k.sfx('splash', { vol: 0.7 })
        for (let i = 0; i < 8; i++) {
          const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#A9DCFF;box-shadow:0 0 0 2px #fff"></div>', m.x + k.rand(-30, 30), m.y + 30, 14, 14, { z: 20 })
          k.to(d, { y: -k.rand(50, 100), x: k.rand(-40, 40), opacity: 0, duration: 0.6, ease: 'power1.out', onComplete: () => d.remove() })
        }
        await k.play(gsap.to(eggIn, { y: 286 - 70, duration: 1.0, ease: 'power2.in' }))
        k.sfx('clonk', { vol: 0.5 })
        gsap.to(eggIn, { y: '-=14', yoyo: true, repeat: 1, duration: 0.16 })
      },
    })
    await k.tell(pyx, 'sink1', 'point')
    await k.tell(ham, 'sink_h', 'surprised')

    // ── 2. предсказание ──
    await k.tell(pyx, 'salt_idea', 'think')
    await k.choose({
      prompt: k.key('q_predict'), host: pyx, skill: 'science:float',
      options: [
        { id: 'sink', art: predictArt('sink'), color: '#FF5A5F', outcome: async () => { await k.tell(pyx, 'p_sink', 'nod') } },
        { id: 'float', art: predictArt('float'), color: '#6BCB77', outcome: async () => { await k.tell(pyx, 'p_float', 'nod') } },
      ],
    })

    // ── 3. сыплем соль, считаем ложки ──
    const spoon = k.prop(saltSpoon(), 540, 560, 80, 232, { z: 10 })
    gsap.set(spoon, { rotation: 18 })
    k.popIn(spoon)
    const pile = spoon.querySelector('.pile')
    const cnt = k.badge('0', 1100, 400, { size: 120, pop: false })
    gsap.set(cnt, { autoAlpha: 0 })
    const pour = async () => {
      const c0 = k.centerOf(spoon), gm = mouth()
      await k.play(gsap.to(spoon, { x: gm.x - 58 - c0.x, y: gm.y - 34 - c0.y, rotation: 100, duration: 0.5, ease: 'power2.out' }))
      k.sfx('sprinkle')
      gsap.to(pile, { opacity: 0, duration: 0.4 })
      dropGrains(14)
      await k.wait(600)
      await k.play(gsap.to(spoon, { x: 0, y: 0, rotation: 18, duration: 0.45, ease: 'back.out(1.5)' }))
      gsap.to(pile, { opacity: 1, duration: 0.3 })
    }
    const N = 4
    for (let i = 1; i <= N; i++) {
      await k.tapN(spoon, 1, { prompt: i === 1 ? k.key('q_spoon') : i === 2 ? k.key('q_more') : null, host: pyx })
      await pour()
      cnt.textContent = String(i)
      gsap.fromTo(cnt, { scale: 0.3, autoAlpha: 1 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.4)' })
      await k.sayNumber(i)
    }
    k.to(spoon, { opacity: 0, x: -60, duration: 0.3 })

    // ── 4. мешаем — яйцо всплывает ──
    {
      const c = k.centerOf(el), s = sc()
      const sp = k.prop(stirSpoonArt(), c.x + 14 * s, c.y - 30 * s, 50 * s / 0.86, 340 * s / 0.86, { z: 13 })
      sp.style.opacity = 0
      await k.stir({ x: c.x, y: c.y + 20 }, {
        radius: 80, turns: 2, prompt: k.key('q_stir'), host: pyx,
        onProgress: (p, a) => {
          sp.style.opacity = 1
          gsap.set(sp, { x: Math.cos(a) * 26 * s, y: Math.sin(a) * 8, rotation: Math.cos(a) * 6 })
          dissolve(p)
          gsap.set(eggIn, { rotation: Math.sin(p * 40) * 6 * (1 - p) })
        },
      })
      k.to(sp, { opacity: 0, y: -40, duration: 0.3, onComplete: () => sp.remove() })
      grains.forEach(d => d.remove()); grains.length = 0
      k.sparkle(c.x, c.y, 8)
    }
    k.sfx('magic', { vol: 0.6 })
    const rise = k.play(gsap.to(eggIn, { y: 112 - 70, rotation: 0, duration: 2.6, ease: 'power2.inOut' }))
    const say = k.tell(pyx, 'rises', 'surprised')
    await Promise.all([rise, say])
    // поплавок покачивается
    k.to(eggIn, { y: '+=9', rotation: 4, yoyo: true, repeat: -1, duration: 1.3, ease: 'sine.inOut' })
    k.sfx('bloop')
    k.burst(800, 420, 10)
    ham.emote('jump')
    await k.tell(ham, 'float_h', 'cheer')
    await k.tell(pyx, 'why', 'point')

    // ── 5. море ──
    k.to([el, cnt], { opacity: 0, duration: 0.5 })
    k.bg(seaBg())
    gsap.to(tableBg, { opacity: 0, duration: 0.9 })
    ham.moveTo({ x: 1230, y: 655 })
    const back = k.prop(ringPart(false), 1230, 585, 300, 130, { z: 10 })
    const front = k.prop(ringPart(true), 1230, 585, 300, 130, { z: 12 })
    const waves = k.prop(wavesFront(), 1090, 676, 1040, 100, { z: 13 })
    gsap.set([back, front], { opacity: 0 })
    await k.tell(pyx, 'sea', 'point')
    await k.wait(400)
    gsap.to([back, front], { opacity: 1, duration: 0.4 })
    k.to(waves, { x: 30, yoyo: true, repeat: -1, duration: 2.2, ease: 'sine.inOut' })
    k.to([ham.el, back, front], { y: '-=10', yoyo: true, repeat: -1, duration: 1.4, ease: 'sine.inOut' })
    k.sfx('splash', { vol: 0.5 })
    ham.emote('happy')
    await k.tell(ham, 'sea_h', 'cheer')
    await k.tell(pyx, 'sea_why', 'point')
    await k.tell(pyx, 'sum', 'cheer')
    await k.tell(ham, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
