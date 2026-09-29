// «Тесто-хлебушек» — дрожжи «дышат» пузырьками и поднимают тесто; им нужно тепло, в холоде они спят.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, E, C, R, HL, SH, S, circlePath, ellipsePath, darker, lighter } from '../art.js'

const BOWL = { x: 800, y: 600, w: 420, h: 280 }
const bowlTop = BOWL.y - BOWL.h / 2
const DOME_ORIGIN = '210 128'
const S_FLAT = 0.1, S_BALL = 0.42, S_RISEN = 0.92
const apexY = s => bowlTop + 128 - 141 * s // мировая y макушки теста
const LENS = { x: 1170, y: 430 } // центр лупы
const YEAST_AT = [[-58, -48], [62, -52], [-62, 50], [58, 54]]

// ───────────── рисунки ─────────────
const BUBBLES = [[110, 80], [170, 40], [240, 62], [300, 88], [205, 100], [135, 112], [285, 30], [350, 108], [75, 104], [215, 18], [250, 100], [160, 90]]
const bowlArt = () => {
  const dome = 'M40 128C40 -60 380 -60 380 128L380 160L40 160Z'
  const front = 'M14 112C14 232 110 272 210 272C310 272 406 232 406 112C406 134 320 150 210 150C100 150 14 134 14 112Z'
  const bubs = BUBBLES.map(([x, y], i) => `<circle class="bub" cx="${x}" cy="${y}" r="0" data-r="${8 + (i % 3) * 3}" fill="#FFF8E0" stroke="#DDB870" stroke-width="3"/>`).join('')
  const dots = [[70, 200], [130, 235], [210, 250], [290, 235], [350, 200], [110, 170], [310, 168]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fff" opacity=".85"/>`).join('')
  return svg(420, 280,
    SH(210, 276, 196, 9) +
    P('M14 112C14 92 70 76 210 76C350 76 406 92 406 112C406 130 350 148 210 148C70 148 14 130 14 112Z', '#D4ECFA', { sw: 6 }) +
    `<g class="dough"><path class="dbody" d="${dome}" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>${HL(140, 52, 42, 14, -20, 0.6)}${bubs}</g>` +
    S(front, '#7FC8F0', '#5BA9D8', { extra: dots + HL(80, 190, 10, 40, 20, 0.5) }))
}

const yeastArt = mode => {
  const cold = mode === 'cold'
  const base = cold ? '#BFE3F5' : '#F4D58A', shade = cold ? '#8FC3E0' : '#D9B25E'
  const eyes = mode === 'awake'
    ? C(36, 48, 8, '#fff', { sw: 3 }) + C(64, 48, 8, '#fff', { sw: 3 }) + C(38, 50, 4, INK, { sw: 0 }) + C(66, 50, 4, INK, { sw: 0 })
    : L('M27 50Q36 60 45 50', INK, 4) + L('M55 50Q64 60 73 50', INK, 4)
  const mouth = mode === 'awake' ? L('M40 66Q50 78 60 66', INK, 4) : (cold ? L('M42 70Q50 64 58 70', INK, 4) : L('M44 68Q50 72 56 68', INK, 3.5))
  const extra = mode === 'sleep' ? L('M74 14h12l-12 12h12', '#7A6FB0', 4) + L('M84 2h8l-8 8h8', '#7A6FB0', 3)
    : cold ? L('M10 30l-6 -6M14 22l-2 -8M90 30l6 -6', '#6FB6E0', 4) : ''
  return svg(100, 100,
    SH(50, 94, 32, 5) +
    S(ellipsePath(50, 54, 40, 37), base, shade) +
    E(28, 64, 7, 5, mode === 'cold' ? '#C9D8F5' : '#FF9EB5', { sw: 0 }) + E(72, 64, 7, 5, mode === 'cold' ? '#C9D8F5' : '#FF9EB5', { sw: 0 }) +
    eyes + mouth + extra + HL(34, 34, 9, 4, -30, 0.55))
}

const packetArt = () => svg(110, 150,
  SH(55, 146, 40, 5) +
  S('M16 26L94 26L100 142L10 142Z', '#FFE9A8', '#EBC760') +
  R(10, 16, 90, 20, 5, '#FFD16B') + L('M16 22l6 8l6 -8l6 8l6 -8l6 8l6 -8l6 8l6 -8l6 8', INK, 3, 'opacity=".55"') +
  C(55, 88, 27, '#F4D58A', { sw: 4 }) + L('M43 84Q47 90 51 84', INK, 3.5) + L('M59 84Q63 90 67 84', INK, 3.5) + L('M47 98Q55 106 63 98', INK, 3.5) +
  E(40, 96, 5, 3.5, '#FF9EB5', { sw: 0 }) + E(70, 96, 5, 3.5, '#FF9EB5', { sw: 0 }))

const lensArt = () => svg(360, 380,
  L('M105 292L28 368', INK, 38) + L('M105 292L28 368', '#C68B59', 26) +
  C(200, 180, 162, '#FFC93D', { sw: 6 }) +
  C(200, 180, 138, '#FFF4D8', { sw: 5 }) +
  [[150, 120, 16], [250, 130, 12], [160, 240, 14], [240, 235, 18], [200, 175, 10], [120, 190, 9], [285, 185, 9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F6E2B0" opacity=".7"/>`).join('') +
  HL(130, 100, 34, 10, -40, 0.7))

const clockArt = () => svg(120, 120,
  SH(60, 116, 44, 5) +
  C(60, 58, 50, '#fff', { sw: 6 }) +
  [0, 90, 180, 270].map(a => `<circle cx="${60 + 40 * Math.sin(a * Math.PI / 180)}" cy="${58 - 40 * Math.cos(a * Math.PI / 180)}" r="4" fill="${INK}"/>`).join('') +
  `<g class="hand-l" ><path d="M60 58L60 22" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g><g class="hand-s"><path d="M60 58L60 38" stroke="#FF5A5F" stroke-width="7" stroke-linecap="round"/></g>` +
  C(60, 58, 6, INK, { sw: 0 }))

const floorArt = () => svg(200, 200,
  `<path d="M10 60L190 60L200 190L0 190Z" fill="#FFF3D6" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
  `<path d="M70 60L60 190M130 60L140 190M5 105L195 105M2 148L198 148" stroke="${INK}" stroke-width="3" opacity=".35" fill="none"/>` +
  E(100, 150, 46, 12, '#000', { sw: 0, attr: 'opacity=".15"' }) +
  S('M60 100Q60 150 100 150Q140 150 140 100Q100 112 60 100Z', '#7FC8F0', '#5BA9D8') +
  E(100, 100, 40, 9, '#D4ECFA', { sw: 4 }))

// срез хлебушка: мякиш с дырочками от пузырьков
const crumbArt = () => svg(260, 220,
  SH(130, 212, 104, 8) +
  S('M30 200L30 100C30 30 90 8 130 8C170 8 230 30 230 100L230 200Q230 210 220 210L40 210Q30 210 30 200Z', '#C8843F', '#A8652B') +
  S('M48 196L48 102C48 48 96 24 130 24C164 24 212 48 212 102L212 196Z', '#FFF0C8', '#F2DAA0', { sw: 4 }) +
  [[100, 90, 15, 10], [150, 70, 11, 8], [172, 126, 17, 11], [96, 150, 12, 9], [134, 118, 9, 7], [70, 120, 8, 6], [190, 80, 8, 6], [128, 168, 13, 8], [176, 170, 9, 7]]
    .map(([x, y, rx, ry]) => `<ellipse class="hole" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#E9CB8C" stroke="#CDA860" stroke-width="3"/>`).join('') +
  HL(90, 46, 26, 6, -15, 0.6))

const flake = '<span class="emoji" style="font-size:44px;line-height:1">❄️</span>'
const ball = (border, bg) => `<div style="width:100%;height:100%;border-radius:50%;border:4px solid ${border};background:${bg};box-sizing:border-box"></div>`

// в карточке высокая картинка вылезает — кладём её в квадрат
const tall = (art, w, h) => `<div style="width:100%;height:100%;display:grid;place-items:center"><div style="width:${w}px;height:${h}px;transform:scale(1.15)">${art}</div></div>`

export default defineLevel({
  id: 'dough-rise',
  async run(k) {
    const FL = k.layout.floorY
    k.kitchenBg()
    const pyx = k.pyx({ x: 250 })
    const ham = k.guest('shchyok', 1420, FL, { size: 280, face: 'left' })
    const bar = k.stepsBar(['🥣', '☀️', '🎈', '🔥', '🍞'])
    const warmEls = [] // «тёплое место»: убираем в конце

    // ── миска с тестом ──
    const bowl = k.prop(bowlArt(), BOWL.x, BOWL.y, BOWL.w, BOWL.h, { z: 6 })
    const q = s => bowl.querySelector(s)
    const doughG = q('.dough'), doughBody = q('.dbody')
    k.gsap.set(doughG, { scaleY: S_FLAT, svgOrigin: DOME_ORIGIN, opacity: 0 })
    const setDough = (s, color, dur = 0.6) => {
      k.to(doughG, { scaleY: s, opacity: 1, svgOrigin: DOME_ORIGIN, duration: dur, ease: 'power2.out' })
      if (color) k.to(doughBody, { fill: color, duration: dur })
    }
    const showBubbles = (from, to) => {
      const all = [...bowl.querySelectorAll('.bub')]
      all.slice(from, to).forEach((c, i) => k.to(c, { attr: { r: +c.dataset.r }, duration: 0.4, delay: 0.08 * i, ease: 'back.out(3)' }))
    }
    const bubbleUp = (from, n = 5, dist = 110) => {
      for (let i = 0; i < n; i++) {
        const s = k.rand(16, 30)
        const d = k.prop(ball('#7CC4EE', 'rgba(255,255,255,.75)'), from.x + k.rand(-24, 24), from.y, s, s, { z: 17 })
        d.style.pointerEvents = 'none'
        k.to(d, { y: -dist - k.rand(0, 50), x: k.rand(-22, 22), opacity: 0, duration: k.rand(0.8, 1.3), delay: i * 0.07, ease: 'power1.out', onComplete: () => d.remove() })
      }
    }
    // положение «горлышка» при наклоне: сдвиг элемента, чтобы горлышко оказалось в точке mouth
    const pose = (el, mouth, deg) => {
      const c = k.centerOf(el), h = k.rectOf(el).h, r = deg * Math.PI / 180
      return { x: mouth.x - (h / 2) * Math.sin(r) - c.x, y: mouth.y + (h / 2) * Math.cos(r) - c.y, rotation: deg }
    }
    let chain = Promise.resolve()
    const queue = fn => { chain = chain.then(fn).catch(() => {}); return chain }

    k.fromTo(bowl, { y: -420, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'bounce.out' })
    await k.wait(700)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(ham, 'hamster_hi', 'happy')

    // ───── 1. мука: три мерки ─────
    bar.set(0)
    const flour = k.food('flour', 500, 640, 130, { z: 8 })
    k.fromTo(flour, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    await k.wait(700)
    const flourPose = pose(flour, { x: 735, y: 480 }, 125)
    let flourN = 0
    const pourFlour = async () => {
      const i = ++flourN
      await k.play(k.gsap.to(flour, { ...flourPose, duration: 0.4, ease: 'power2.out' }))
      k.sfx('sprinkle')
      for (let j = 0; j < 14; j++) {
        const s = k.rand(7, 12)
        const g = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#fff;box-shadow:0 0 0 2px #E3EAF2"></div>', 735 + k.rand(-14, 14), 490, s, s, { z: 13 })
        k.to(g, { y: k.rand(70, 100), x: k.rand(-16, 16), opacity: 0, duration: 0.5, delay: j * 0.03, ease: 'power1.in', onComplete: () => g.remove() })
      }
      const cloud = k.prop(ball('#fff', '#fff'), 760, 560, 60, 60, { z: 13 })
      k.fromTo(cloud, { scale: 0.3, opacity: 0.9 }, { scale: 2.2, opacity: 0, duration: 0.7, delay: 0.3, ease: 'power1.out', onComplete: () => cloud.remove() })
      setDough(S_FLAT + i * 0.07, '#FFFFFF', 0.5)
      await k.wait(550)
      await k.play(k.gsap.to(flour, { x: 0, y: 0, rotation: 0, duration: 0.4, ease: 'back.out(1.6)' }))
      await k.sayNumber(i)
    }
    await k.tapN(flour, 3, { prompt: k.key('q_flour'), host: pyx, onTap: () => queue(pourFlour) })
    await chain
    k.to(flour, { opacity: 0, y: 40, duration: 0.4, onComplete: () => flour.remove() })

    // ───── 2. тёплая вода: держим стакан ─────
    const glass = k.prop(kitchen.glass(0.85, '#9ADCFF'), 1130, 630, 110, 156, { z: 8 })
    k.fromTo(glass, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    const steam = [0, 1, 2].map(i => k.prop(`<div style="width:100%;height:100%;border-radius:50%;border:5px solid rgba(255,255,255,.9);border-color:rgba(255,255,255,.9) transparent transparent transparent;box-sizing:border-box"></div>`, 1105 + i * 26, 530, 22, 30, { z: 9 }))
    steam.forEach((s, i) => k.to(s, { y: -26, opacity: 0.1, duration: 1.1, repeat: -1, delay: i * 0.3, ease: 'sine.out' }))
    await k.wait(700)
    const glassPose = pose(glass, { x: 862, y: 486 }, -105)
    const stream = k.prop('<div style="width:100%;height:100%;border-radius:8px;background:#7FD0FF"></div>', 862, 530, 16, 10, { z: 7 })
    stream.style.display = 'none'
    await k.hold(glass, {
      duration: 1.8, prompt: k.key('q_water'), host: pyx, sfx: null,
      onStart: () => { stream.style.display = 'block'; steam.forEach(s => { s.style.visibility = 'hidden' }); k.to(glass, { ...glassPose, duration: 0.35, ease: 'power2.out', overwrite: 'auto' }) },
      onLevel: p => {
        Object.assign(stream.style, { left: '854px', top: '486px', height: `${Math.max(6, 585 - 486 - p * 6)}px` })
        setDough(0.14 + p * 0.1, mixHex('#FFFFFF', '#F7EBCB', p), 0.15)
        if (Math.random() < 0.25) k.sfx('pour', { vol: 0.3 })
      },
      onRelease: () => { stream.style.display = 'none'; k.to(glass, { x: 0, y: 0, rotation: 0, duration: 0.4, ease: 'back.out(1.5)', overwrite: 'auto' }) },
    })
    glass.innerHTML = kitchen.glass(0.04, '#9ADCFF')
    k.to([glass, ...steam], { opacity: 0, duration: 0.4, delay: 0.4, onComplete: () => { glass.remove(); steam.forEach(s => s.remove()) } })
    await k.tell(pyx, 'warm', 'point')

    // ───── 3. дрожжи ─────
    const packet = k.prop(packetArt(), 1130, 640, 110, 150, { z: 8 })
    k.fromTo(packet, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    await k.wait(700)
    await k.tapN(packet, 1, { prompt: k.key('q_yeast'), host: pyx })
    const packPose = pose(packet, { x: 830, y: 486 }, -120)
    await k.play(k.gsap.to(packet, { ...packPose, duration: 0.4, ease: 'power2.out' }))
    k.sfx('sprinkle')
    for (let j = 0; j < 6; j++) {
      const s = k.rand(38, 50)
      const y = k.prop(yeastArt('sleep'), 830 + k.rand(-10, 10), 490, s, s, { z: 13 })
      k.to(y, { y: 80 + k.rand(0, 20), x: k.rand(-50, 40), duration: 0.5, delay: j * 0.12, ease: 'power1.in' })
      k.to(y, { opacity: 0, scale: 0.5, duration: 0.3, delay: 0.55 + j * 0.12, onComplete: () => y.remove() })
    }
    await k.wait(1000)
    await k.play(k.gsap.to(packet, { x: 0, y: 0, rotation: 0, duration: 0.4, ease: 'back.out(1.6)' }))
    k.to(packet, { opacity: 0, y: 40, duration: 0.4, onComplete: () => packet.remove() })
    await k.tell(pyx, 'yeast_who', 'point')

    // ───── 4. замешиваем ─────
    const spoon = k.prop(kitchen.spoonWood(), 800, 470, 64, 208, { z: 12 })
    k.popIn(spoon)
    const SC = { x: 800, y: 580 }
    await k.stir(SC, {
      radius: 120, turns: 3, prompt: k.key('q_stir'), host: pyx, spoon,
      moveSpoon: (cx, cy) => {
        const fx = cx, fy = SC.y + (cy - SC.y) * 0.4
        k.gsap.set(spoon, { x: fx - 800, y: fy - 66 - 470, rotation: (fx - 800) / 9 })
      },
      onProgress: p => {
        k.gsap.to(doughG, { scaleY: 0.3 + p * (S_BALL - 0.3), svgOrigin: DOME_ORIGIN, duration: 0.2, overwrite: 'auto' })
        k.gsap.to(doughBody, { fill: mixHex('#F7EBCB', '#F6DFA9', p), duration: 0.2, overwrite: 'auto' })
      },
    })
    k.to(spoon, { opacity: 0, y: -60, duration: 0.4, onComplete: () => spoon.remove() })
    setDough(S_BALL, '#F6DFA9', 0.5)
    k.burst(800, 500, 8)
    await k.tell(pyx, 'mixed', 'cheer')
    // отметка «сколько теста сейчас»
    const dash = (y, color) => k.prop(`<div style="width:100%;height:100%;background:repeating-linear-gradient(90deg,${color} 0 16px,transparent 16px 28px);border-radius:3px"></div>`, 800, y, 380, 6, { z: 5 })
    const mark0 = dash(apexY(S_BALL), '#3B8FD0')
    mark0.style.opacity = '0'
    k.to(mark0, { opacity: 0.85, duration: 0.5 })

    // ───── 5. где оставить тесто? ─────
    bar.set(1)
    const overlay = (kind) => {
      const bg = kind === 'cold'
        ? 'radial-gradient(ellipse at 50% 50%,rgba(140,205,255,.6),rgba(140,205,255,.25) 55%,rgba(140,205,255,0) 75%)'
        : 'radial-gradient(ellipse at 50% 50%,rgba(255,214,90,.42),rgba(255,214,90,.18) 55%,rgba(255,214,90,0) 75%)'
      const o = k.prop(`<div style="width:100%;height:100%;background:${bg}"></div>`, 800, 560, 1100, 760, { z: 30 })
      o.style.pointerEvents = 'none'
      k.fromTo(o, { opacity: 0 }, { opacity: 1, duration: 0.5 })
      return o
    }
    const clock = k.prop(clockArt(), 560, 440, 110, 110, { z: 31 })
    clock.style.opacity = '0'
    const spinClock = (turns = 1, dur = 1.2) => {
      k.to(clock, { opacity: 1, duration: 0.2 })
      k.gsap.to(clock.querySelector('.hand-l'), { rotation: `+=${360 * turns}`, svgOrigin: '60 58', duration: dur, ease: 'power1.inOut' })
      k.gsap.to(clock.querySelector('.hand-s'), { rotation: `+=${360 * turns / 6}`, svgOrigin: '60 58', duration: dur, ease: 'power1.inOut' })
      for (let i = 0; i < turns * 6; i++) k.after(i * (dur * 1000 / (turns * 6)), () => k.sfx('tick', { vol: 0.5 }))
    }
    // лупа с дрожжинками
    const showLens = mode => {
      const lens = k.prop(lensArt(), LENS.x - 18, LENS.y + 9, 330, 348, { z: 14 })
      const ys = YEAST_AT.map(([dx, dy]) => k.prop(yeastArt(mode), LENS.x + dx, LENS.y + dy, 88, 88, { z: 15 }))
      k.popIn([lens, ...ys], 0.1)
      return { lens, ys, close() { k.to([lens, ...ys], { scale: 0, opacity: 0, duration: 0.35, stagger: 0.04, onComplete: () => { [lens, ...ys].forEach(e => { k.gsap.killTweensOf(e); e.remove() }) } }) } }
    }
    const snow = () => {
      for (let i = 0; i < 16; i++) {
        const f = k.prop(flake, k.rand(560, 1040), 280, 44, 44, { z: 32 })
        f.style.pointerEvents = 'none'
        k.to(f, { y: k.rand(320, 470), x: k.rand(-40, 40), rotation: k.rand(-120, 120), opacity: 0, duration: k.rand(1.6, 2.6), delay: i * 0.1, ease: 'power1.in', onComplete: () => f.remove() })
      }
    }

    const fridgeCard = tall(kitchen.fridge({}), 120, 213)
    const sunCard = kitchen.sunSill()
    await k.choose({
      prompt: k.key('q_where'), host: pyx, skill: 'science:yeast',
      options: k.shuffle([
        {
          id: 'fridge', art: fridgeCard, color: '#62C6FF', outcome: async () => {
            const ov = overlay('cold'); snow(); k.sfx('whoosh')
            const lz = showLens('cold')
            lz.ys.forEach(y => k.gsap.to(y, { x: '+=3', duration: 0.06, repeat: -1, yoyo: true }))
            spinClock(1, 1.6)
            await k.tell(pyx, 'cold_oops', 'shake')
            await k.wait(600)
            lz.close(); k.to(clock, { opacity: 0, duration: 0.3 }); k.to(ov, { opacity: 0, duration: 0.5, onComplete: () => ov.remove() })
          },
        },
        {
          id: 'floor', art: floorArt(), color: '#B388EB', outcome: async () => {
            await k.play(k.gsap.to(bowl, { y: 230, duration: 0.5, ease: 'power2.in' }))
            k.sfx('thud'); ham.emote('surprised')
            await k.play(k.gsap.to(bowl, { y: 205, duration: 0.15, yoyo: true, repeat: 1 }))
            await k.tell(ham, 'floor_oops')
            await k.tell(pyx, 'floor_why', 'think')
            await k.play(k.gsap.to(bowl, { y: 0, duration: 0.6, ease: 'back.out(1.4)' }))
          },
        },
        {
          id: 'sun', art: sunCard, color: '#FFB938', correct: true, outcome: async () => {
            k.sfx('magic')
            const ov = overlay('warm')
            const sun = k.prop('<span class="emoji" style="font-size:130px;line-height:1">☀️</span>', 1040, 330, 150, 150, { z: 32 })
            sun.style.pointerEvents = 'none'
            k.popIn(sun); k.to(sun, { rotation: 360, duration: 16, repeat: -1, ease: 'none' })
            warmEls.push(ov, sun)
            await k.tell(pyx, 'warm_ok', 'cheer')
          },
        },
      ]),
    })

    // ───── 6. дрожжинки дышат ─────
    bar.set(2)
    const lz = showLens('awake')
    await k.wait(800)
    lz.ys.forEach((y, i) => k.to(y, { y: '+=6', duration: 0.9 + i * 0.1, yoyo: true, repeat: -1, ease: 'sine.inOut' }))
    let tapped = 0
    await k.tapAll(lz.ys, {
      prompt: k.key('wake'), host: pyx,
      onTap: el => {
        const i = tapped++
        k.sfx('bloop'); k.sfx('pop', { vol: 0.5 })
        const c = k.centerOf(el)
        k.gsap.fromTo(el, { scale: 1 }, { scale: 1.35, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' })
        bubbleUp({ x: c.x, y: c.y - 30 }, 6, 120)
        const s = S_BALL + (S_RISEN - S_BALL) * (i + 1) / 4
        setDough(s, i === 3 ? '#F8E3B2' : null, 0.9)
        showBubbles(i * 3, i * 3 + 3)
        spinClock(1, 1.1)
        k.sayNumber(i + 1)
      },
    })
    await k.wait(1400)
    lz.close()
    await k.tell(pyx, 'rise_why', 'point')
    k.to(clock, { opacity: 0, duration: 0.3 })
    // сравнение: было — стало
    const mark1 = dash(apexY(S_RISEN), '#2E9E5B')
    mark1.style.opacity = '0'
    k.to(mark1, { opacity: 0.9, duration: 0.5 })
    const ay0 = apexY(S_BALL), ay1 = apexY(S_RISEN)
    const arrow = k.prop(svg(60, Math.round(ay0 - ay1) + 30, `<path d="M30 12V${ay0 - ay1 + 14}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M12 28L30 8L48 28M12 ${ay0 - ay1 - 4}L30 ${ay0 - ay1 + 16}L48 ${ay0 - ay1 - 4}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`), 1020, (ay0 + ay1) / 2, 60, Math.round(ay0 - ay1) + 30, { z: 12 })
    k.popIn(arrow)
    k.burst(800, 470, 10)
    await k.tell(pyx, 'rose', 'cheer')
    k.to([mark0, mark1, arrow], { opacity: 0, duration: 0.4, delay: 0.4 })
    warmEls.forEach(e => k.to(e, { opacity: 0, duration: 0.5, onComplete: () => e.remove() }))

    // ───── 7. печём (со взрослым) ─────
    bar.set(3)
    k.to(doughG, { scaleY: 0, svgOrigin: DOME_ORIGIN, duration: 0.5, ease: 'power2.in' })
    k.to(bowl, { opacity: 0, y: 40, duration: 0.5, delay: 0.3 })
    await k.wait(900)
    bowl.remove()
    const st = k.stove()
    k.fromTo(st.el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' })
    await k.wait(400)
    const RAW = 'brightness(1.28) saturate(.5) contrast(.92)', BAKED = 'brightness(1) saturate(1) contrast(1)'
    const loaf = k.food('bread', 800, 640, 230, { z: 12 })
    loaf.style.filter = RAW
    k.fromTo(loaf, { y: -60, scale: 0.4, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' })
    k.sfx('pop')
    await k.wait(800)
    await k.adultHelp({ knob: st.knobEl(0) })
    st.on(0)
    // тесто едет в духовку
    await k.play(k.gsap.to(loaf, { x: 22, y: 5, scale: 0.5, duration: 0.7, ease: 'power2.inOut' }))
    const glow = k.prop('<div style="width:100%;height:100%;border-radius:14px;background:radial-gradient(ellipse,rgba(255,150,40,.85),rgba(255,120,20,.2) 70%,transparent)"></div>', 822, 640, 200, 60, { z: 5 })
    k.to(glow, { opacity: 0.55, duration: 0.5, yoyo: true, repeat: -1 })
    const timer = k.food('hourglass', 1150, 600, 112, { z: 8 })
    k.popIn(timer)
    await k.wait(500)
    await k.tapOnEl(timer, { prompt: k.key('q_turn'), host: pyx })
    k.gsap.to(timer, { rotation: 180, duration: 0.6, ease: 'back.out(1.6)' })
    k.sfx('flip')
    k.to(loaf, { filter: BAKED, scale: 0.56, duration: 2.6, ease: 'none' })
    for (let i = 0; i < 6; i++) { await k.wait(430); k.sfx('tick') }
    k.sfx('ding')
    st.off(0)
    k.to(glow, { opacity: 0, duration: 0.4, onComplete: () => glow.remove() })
    k.to(timer, { opacity: 0, y: 40, duration: 0.4, onComplete: () => timer.remove() })
    k.play(k.gsap.to(loaf, { x: 0, y: 8, scale: 1.04, duration: 0.6, ease: 'back.out(1.8)' }))
    const loaf2 = loaf
    const puffs = [0, 1].map(i => k.prop(kitchen.steam(), 760 + i * 80, 540, 110, 80, { z: 13 }))
    puffs.forEach((p, i) => { p.style.pointerEvents = 'none'; k.to(p, { y: -50, opacity: 0.1, duration: 1.4, repeat: -1, delay: i * 0.6, ease: 'sine.out' }) })
    await k.tell(pyx, 'ding', 'cheer')
    const mitt = k.prop(kitchen.mitt(), 1010, 630, 120, 152, { z: 10 })
    k.popIn(mitt)
    await k.tell(pyx, 'hot', 'point')
    puffs.forEach(p => { k.gsap.killTweensOf(p); k.to(p, { opacity: 0, duration: 0.4, onComplete: () => p.remove() }) })
    k.to(mitt, { opacity: 0, x: 60, duration: 0.4, delay: 0.4, onComplete: () => mitt.remove() })

    // ───── 8. тук-тук по корочке ─────
    await k.tapN(loaf2, 2, {
      prompt: k.key('q_knock'), host: pyx,
      onTap: () => { k.sfx('clonk'); k.gsap.fromTo(loaf2, { rotation: -3 }, { rotation: 0, duration: 0.3, ease: 'elastic.out(1,.4)' }) },
    })
    await k.tell(pyx, 'knock', 'nod')
    // разрезаем: внутри дырочки от пузырьков
    const crumb = k.prop(crumbArt(), 800, 640, 240, 203, { z: 14 })
    k.to(loaf2, { opacity: 0, scale: 0.9, duration: 0.25 })
    k.fromTo(crumb, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' })
    k.sfx('pop')
    k.after(500, () => { [...crumb.querySelectorAll('.hole')].forEach((h, i) => k.gsap.fromTo(h, { scale: 1, svgOrigin: `${h.getAttribute('cx')} ${h.getAttribute('cy')}` }, { scale: 1.35, svgOrigin: `${h.getAttribute('cx')} ${h.getAttribute('cy')}`, duration: 0.3, delay: i * 0.08, yoyo: true, repeat: 1 })) })
    await k.tell(pyx, 'air', 'point')
    k.to(crumb, { opacity: 0, scale: 0.8, duration: 0.3, onComplete: () => crumb.remove() })
    // хлебушек — Щёчкину
    const to = k.centerOf(ham.el)
    const slices = [0, 1, 2].map(i => k.food('breadSlice', 800 + (i - 1) * 40, 650, 96, { z: 14 }))
    k.fromTo(slices, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'back.out(2)' })
    await k.wait(700)
    k.sfx('whoosh')
    await k.play(k.gsap.to(slices, { x: () => to.x - 800 - 20, y: () => to.y - 650 - 60, scale: 0.3, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.in' }))
    k.sfx('crunch')
    ham.emote('happy')
    await k.tell(ham, 'yum')
    await k.tell(pyx, 'sum', 'point')
    await k.tell(ham, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})

// смешивание двух #hex (для перелива цвета теста)
function mixHex(a, b, t) {
  const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16))
  const A = h(a), B = h(b)
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')
}
