// «Макароны» — воду наливаем до риски, макароны кладём в КИПЯЩУЮ воду, воду солим, мешаем, ждём (песочные часы), сливаем.
// Плита, кипяток и слив — только со взрослым. Гость: Чухтик (паровозик).
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, F, E, C, L, HL, SH, S, rounded, mix, nid } from '../art.js'

const thumb = name => `<div style="width:56px;height:56px">${food(name)}</div>`

// Обход бага ui.stepsBar: у .kx-step стоит transition:transform, из-за чего gsap.from запоминает «промежуточную» позицию
// и поздние иконки навсегда съезжают вверх. Через секунду сбрасываем inline-transform (заодно оживает .now{scale}).
const stepsBar = (k, icons, o) => { const b = k.stepsBar(icons, o); k.after(1300, () => k.gsap.set([...b.el.children], { clearProps: 'transform' })); return b }

const RAW = '#F6E2A0', COOKED = '#FFD24D'

// одна макаронина-«бантик»
const bow = (fill = RAW) => svg(70, 50, P('M6 6L35 20L64 6L64 44L35 30L6 44Z', fill, { sw: 4 }) + C(35, 25, 7, '#F2B824', { sw: 3 }) + HL(20, 16, 8, 3, -15, 0.6))

// пачка макарон
const packArt = () => svg(150, 200,
  SH(75, 194, 56, 6) +
  S(rounded([[20, 30], [130, 30], [138, 186], [12, 186]], 10), '#FFF8EC', '#EADFC8') +
  P('M14 30L22 8L128 8L136 30Z', '#FFD93D') +
  L('M28 14L26 28M44 12L42 28M60 12L58 28M76 12L74 28M92 12L90 28M108 12L106 28M122 14L120 28', '#F2B824', 4) +
  R2(34, 62, 82, 76, '#FFE9A8') +
  `<g transform="translate(75 100) scale(1.05)">${P('M-32 -20L0 -6L32 -20L32 20L0 6L-32 20Z', '#FFD24D', { sw: 4 })}${C(0, 0, 7, '#F2B824', { sw: 3 })}</g>` +
  HL(30, 90, 5, 34, 6, 0.55))
function R2(x, y, w, h, fill) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="#3B2F4F" stroke-width="5"/>` }

// комок слипшихся макарон с грустной мордочкой
const clumpArt = () => svg(150, 120,
  SH(75, 112, 56, 6) +
  P('M14 70C6 40 40 14 78 20C118 12 146 40 138 76C134 104 104 112 74 110C40 112 18 100 14 70Z', '#F0D890', { sw: 5 }) +
  [[40, 44, -20], [96, 38, 18], [70, 84, 6], [112, 78, -14], [40, 84, 24]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(.8)">${P('M-32 -20L0 -6L32 -20L32 20L0 6L-32 20Z', '#F6E2A0', { sw: 4 })}</g>`).join('') +
  L('M28 62Q22 92 30 102M120 60Q130 88 122 100', '#E0C070', 5) +
  C(58, 66, 9, '#fff', { sw: 3 }) + C(94, 66, 9, '#fff', { sw: 3 }) + C(60, 68, 4, '#3B2F4F', { sw: 0 }) + C(92, 68, 4, '#3B2F4F', { sw: 0 }) +
  L('M60 90Q76 78 92 90', '#3B2F4F', 5) + HL(46, 32, 16, 6, -20, 0.5))

// песочные часы (песок анимируем классами)
const hourglassArt = () => {
  const id = nid('hg')
  const glass = 'M26 24L104 24Q104 80 72 100Q104 120 104 178L26 178Q26 120 58 100Q26 80 26 24Z'
  return svg(130, 204,
    SH(65, 198, 50, 5) + `<rect x="14" y="6" width="102" height="18" rx="8" fill="#C68B59" stroke="#3B2F4F" stroke-width="5"/><rect x="14" y="178" width="102" height="18" rx="8" fill="#C68B59" stroke="#3B2F4F" stroke-width="5"/>` +
    P(glass, '#E6F6FF', { sw: 0 }) +
    `<clipPath id="${id}"><path d="${glass}"/></clipPath><g clip-path="url(#${id})">` +
    `<g class="sand-top"><rect x="20" y="30" width="90" height="68" fill="#FFD93D"/></g>` +
    `<g class="sand-bot"><path d="M20 178L20 156Q65 126 110 156L110 178Z" fill="#FFD93D"/></g>` +
    `<path class="sand-fall" d="M65 100V172" stroke="#E8B824" stroke-width="4" stroke-dasharray="7 6" fill="none" opacity="0"/></g>` +
    P(glass, 'none', { sw: 5 }) + HL(40, 50, 4, 16, 10, 0.7))
}

// раковина (задняя и передняя части)
const sinkBack = () => svg(420, 190, E(210, 66, 200, 52, '#EDF2FF') + E(210, 72, 172, 38, '#B8C6E0', { sw: 0 }) + E(210, 78, 16, 7, '#7A87A8', { sw: 0 }))
const sinkFront = () => svg(420, 190,
  S('M12 66A200 52 0 0 0 408 66L376 160Q368 184 330 186L90 186Q52 184 44 160Z', '#DDE6F2', '#B8C4DA', { extra: '<path d="M60 130Q210 156 360 130" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".55"/>' }) +
  HL(64, 120, 5, 22, 10, 0.6))

const BOWS = [[100, 82], [136, 86], [176, 82], [118, 78], [156, 77], [200, 84], [78, 85]] // где лежат макароны на воде (локальные координаты кастрюли)

// ── речь и эмоции без наложений ──
// «Корневые» эмоции героя (ура, смех, прыжок…) нельзя запускать внахлёст: gsap путает SVG-origin'ы, и герой «уезжает» с экрана.
const ROOT_DUR = { cheer: 1.5, jump: 1.1, laugh: 1.0, dance: 1.8, happy: 0.85, surprised: 1.3, sad: 2.0, spin: 0.9, bow: 1.3 }
function speech(k) {
  const busy = new Map()
  const gate = async (c, d) => {
    const w = (busy.get(c) ?? 0) - performance.now()
    if (w > 0) await k.wait(w)
    busy.set(c, performance.now() + d * 1000)
  }
  const emote = async (c, e) => {
    if (!c || !e) return
    if (ROOT_DUR[e]) await gate(c, ROOT_DUR[e])
    if (k.alive) c.emote(e)
  }
  const tell = async (c, id, e) => { emote(c, e); await tell(c, id) }
  const praise = async c => { await gate(c, 1.1); await praise(c) }
  return { emote, tell, praise }
}

export default defineLevel({
  id: 'pasta',
  async run(k) {
    const g = k.gsap
    const { emote, tell, praise } = speech(k)
    const FLOOR = k.layout.floorY
    k.kitchenBg()
    const st = k.stove()
    const pyx = k.pyx({ x: 230 })
    const chukh = k.guest('chukh', 1410, FLOOR, { size: 270, face: 'left' })

    // ── кастрюля: контейнер, в который кладём все «внутренности» (двигаются вместе с ней) ──
    const pot = k.prop(kitchen.pot({ lid: false }), 0, 0, 300, 230, { z: 6 })
    pot.querySelector('.kp-shadow')?.style.setProperty('visibility', 'hidden')
    k.onBurner(pot, 0, 300, 230)
    const waterEl = pot.querySelector('.water')
    g.set(waterEl, { opacity: 0 })
    const inPot = (html, l, t, w, h, css = '') => {
      const d = document.createElement('div')
      d.style.cssText = `position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;${css}`
      d.innerHTML = html
      pot.appendChild(d)
      return d
    }
    // окошко-мерка на боку кастрюли: вода поднимается, зелёная полоса — «в самый раз»
    const win = inPot('<div style="position:absolute;left:0;right:0;bottom:55%;height:35%;background:rgba(107,203,119,.6);border-top:3px dashed #2E8F5B;border-bottom:3px dashed #2E8F5B"></div><div class="lvl" style="position:absolute;left:0;right:0;bottom:0;height:0%;background:#62C6FF;border-top:3px solid #fff"></div>',
      116, 98, 68, 104, 'border-radius:24px;background:rgba(255,255,255,.82);box-shadow:0 0 0 5px #3B2F4F;overflow:hidden;opacity:0')
    const lvl = win.querySelector('.lvl')
    const setLevel = v => { lvl.style.height = `${Math.round(v * 100)}%`; g.set(waterEl, { opacity: Math.min(1, v * 1.6) }) }

    const stopFns = []
    const fadeAway = (els, y = 80) => { g.to(els, { y: `+=${y}`, opacity: 0, duration: 0.4, ease: 'power2.in' }); k.after(450, () => els.forEach(e => e.remove())) }
    const splash = (x, y, n = 10, color = '#62C6FF') => {
      for (let i = 0; i < n; i++) {
        const d = k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:${color};box-shadow:inset -2px -2px 0 rgba(0,0,0,.12)"></div>`, x + k.rand(-30, 30), y, 14, 14, { z: 20 })
        k.to(d, { x: k.rand(-70, 70), y: -k.rand(30, 90), duration: 0.3, ease: 'power2.out' })
        k.to(d, { y: '+=110', opacity: 0, duration: 0.4, delay: 0.3, ease: 'power1.in', onComplete: () => d.remove() })
      }
    }

    await k.wait(400)
    await tell(pyx, 'hello', 'wave')
    await tell(chukh, 'chukh_hi', 'happy')
    const bar = stepsBar(k, ['💧', '🔥', thumb('saltShaker'), thumb('pasta'), '⏳', thumb('colander')])
    bar.set(0)
    await tell(pyx, 'recipe', 'point')

    // ───── 1. наливаем воду до зелёной полоски ─────
    g.to(win, { opacity: 1, duration: 0.4 })
    const jug = k.prop(kitchen.juiceJug('#62C6FF'), 1130, 390, 150, 180, { z: 12 })
    k.popIn(jug)
    const stream = k.prop('<div style="width:100%;height:100%;border-radius:6px;background:linear-gradient(90deg,#62C6FF 0 35%,#D7F3FF 35% 55%,#62C6FF 55%)"></div>', 786, 268, 14, 64, { z: 11 })
    g.set(stream, { opacity: 0, transformOrigin: '50% 0%' })
    const pourPose = () => g.to(jug, { x: -274, y: -158, rotation: -52, duration: 0.35, ease: 'power2.out' })
    const restPose = () => g.to(jug, { x: 0, y: 0, rotation: 0, duration: 0.35, ease: 'back.out(1.6)' })
    await k.wait(600)
    let miss = 0
    await k.hold(jug, {
      duration: 2.6, goal: [0.55, 0.9], prompt: k.key('q_pour'), host: pyx, sfx: 'pour',
      onStart: () => { pourPose(); g.to(stream, { opacity: 1, duration: 0.15 }) },
      onLevel: v => { setLevel(v) },
      onRelease: () => { restPose(); g.to(stream, { opacity: 0, duration: 0.2 }) },
      onOver: async () => {
        restPose(); g.to(stream, { opacity: 0, duration: 0.1 })
        k.sfx('yuck', { vol: 0.5 })
        splash(690, 300, 10)
        splash(870, 300, 8)
        setLevel(0)
        emote(pyx, 'surprised')
        await tell(pyx, 'pour_over')
      },
      onMiss: () => { if (++miss % 2 === 1) tell(pyx, 'pour_less') },
    })
    g.to(stream, { opacity: 0, duration: 0.2 })
    await tell(pyx, 'pour_ok', 'cheer')
    fadeAway([jug], -60)
    g.to(win, { opacity: 0, duration: 0.5, delay: 0.3 })

    // ───── 2. когда класть макароны? ─────
    const potCard = (boil) => `<div style="position:relative;width:190px;height:150px">${kitchen.pot({ lid: false, boiling: boil })}<span class="emoji" style="position:absolute;right:-16px;top:-28px;font-size:64px">${boil ? '🔥' : '❄️'}</span></div>`
    const clump = () => {
      const c = inPot(clumpArt(), 90, -34, 130, 104, 'z-index:20')
      g.fromTo(c, { y: 40, scale: 0.3, opacity: 0 }, { y: -20, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' })
      g.to(c, { rotation: 8, duration: 0.15, yoyo: true, repeat: 5, delay: 0.5 })
      return c
    }
    await k.choose({
      prompt: k.key('q_when'), host: pyx, skill: 'science:boil',
      options: k.shuffle([
        {
          id: 'cold', art: potCard(false), color: '#62C6FF',
          outcome: async () => {
            // макаронки падают в холодную воду и слипаются
            const fall = [0, 1, 2, 3].map(i => inPot(bow(RAW), 100 + i * 30, -90, 46, 33, 'z-index:19'))
            g.to(fall, { y: (i) => 150 + (i % 2) * 6, duration: 0.5, ease: 'power1.in', stagger: 0.08 })
            k.after(700, () => k.sfx('plop'))
            await k.wait(1000)
            fall.forEach(f => f.remove())
            const c = clump()
            k.sfx('yuck', { vol: 0.5 })
            await tell(pyx, 'w_cold', 'shake')
            g.to(c, { y: -120, opacity: 0, scale: 0.6, duration: 0.5, ease: 'power2.in' })
            k.after(600, () => c.remove())
          },
        },
        { id: 'boil', art: potCard(true), color: '#FF5A5F', correct: true, outcome: async () => { k.sfx('magic'); await tell(pyx, 'ok_boil', 'cheer') } },
      ]),
    })

    // ───── 3. плита — только со взрослым ─────
    bar.set(1)
    const knob = st.knobEl(0)
    await k.adultHelp({ knob, host: pyx })
    st.on(0)
    // мелкие пузырьки: вода греется
    const tiny = k.every(170, () => {
      const x = 150 + k.rand(-84, 84), y = 80 + k.rand(-4, 5)
      const s = k.rand(7, 15)
      const b = inPot(`<div style="width:100%;height:100%;border-radius:50%;background:rgba(255,255,255,.85);box-shadow:0 0 0 2px #7FBFE8"></div>`, x - s / 2, y - s / 2, s, s, 'z-index:9;pointer-events:none')
      g.fromTo(b, { scale: 0 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' })
      g.to(b, { y: -k.rand(6, 16), opacity: 0, duration: 0.5, delay: 0.3, onComplete: () => b.remove() })
    })
    await tell(pyx, 'warm', 'point')
    await k.wait(1500)
    tiny()
    // большие пузыри: лопаем
    const bigs = [[56, 6], [150, -48], [244, 4]].map(([x, y], i) => {
      const s = 88 - i * 6
      const d = inPot(`<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 34% 30%,#fff 0 14%,rgba(221,244,255,.85) 15% 60%,rgba(154,214,250,.85) 100%);box-shadow:0 0 0 5px #3B2F4F"></div>`, x - s / 2, y - s / 2, s, s, 'z-index:22')
      g.fromTo(d, { scale: 0 }, { scale: 1, duration: 0.5, delay: i * 0.25, ease: 'back.out(2.2)' })
      g.to(d, { y: -14 - i * 5, duration: 0.7 + i * 0.12, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.6 })
      return d
    })
    for (const b of pot.querySelectorAll('.bubble')) {
      g.to(b, { opacity: 1, duration: 0.3, delay: 0.4 })
      g.to(b, { y: -k.rand(8, 16), duration: k.rand(0.3, 0.5), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: k.rand(0, 0.3) })
    }
    k.sfx('bubble')
    await tell(pyx, 'big', 'surprised')
    let popped = 0
    await k.tapAll(bigs, {
      onTap: (el, i, left) => {
        const c = k.centerOf(el)
        k.sparkle(c.x, c.y, 5)
        g.to(el, { scale: 1.6, opacity: 0, duration: 0.25, onComplete: () => el.remove() })
        k.sayNumber(++popped)
      },
    })
    await k.wait(800)
    // пар
    const puffs = [0, 1, 2].map(i => {
      const p = inPot(kitchen.steam(), 60 + i * 30, -70, 130, 94, 'z-index:5;pointer-events:none;opacity:0')
      const tl = g.timeline({ repeat: -1, delay: i * 0.8 })
      tl.fromTo(p, { y: 0, opacity: 0, scale: 0.5 }, { y: -34, opacity: 0.9, scale: 0.85, duration: 1.1, ease: 'none' })
        .to(p, { y: -80, opacity: 0, scale: 1.15, duration: 1.1, ease: 'none' })
      return tl
    })
    k.sfx('sizzle', { vol: 0.6 })
    await tell(pyx, 'boil', 'cheer')

    // ───── 4. щепотка соли ─────
    bar.set(2)
    const shaker = k.food('saltShaker', 1130, 400, 110, { z: 12 })
    k.popIn(shaker)
    await k.tapN(shaker, 1, { prompt: k.key('q_salt'), host: pyx })
    k.sfx('sprinkle')
    await k.play(g.to(shaker, { x: -380, y: -60, rotation: -140, duration: 0.4, ease: 'power2.out' }))
    for (let i = 0; i < 12; i++) {
      const gr = k.prop('<div style="width:100%;height:100%;background:#fff;border-radius:2px;box-shadow:0 0 0 2px #C9DFF0"></div>', 730 + k.rand(-30, 30), 250, 9, 9, { z: 15 })
      k.to(gr, { y: k.rand(40, 70), x: k.rand(-20, 20), opacity: 0, duration: 0.5, delay: i * 0.03, ease: 'power1.in', onComplete: () => gr.remove() })
    }
    await k.wait(600)
    fadeAway([shaker], -60)
    await tell(pyx, 'salt_why', 'point')

    // ───── 5. макароны — в кипяток ─────
    bar.set(3)
    const pack = k.prop(packArt(), 1150, 560, 130, 173, { z: 12 })
    k.popIn(pack)
    let piecesInPot = []
    await k.dnd({
      items: [{ id: 'pack', el: pack }], zones: [{ id: 'pot', el: pot }], pad: 70,
      prompt: k.key('q_pasta'), host: pyx,
      accept: () => true,
      onCorrect: async it => {
        it.el.style.zIndex = '30'
        const c = k.centerOf(it.el)
        await k.play(g.to(it.el, { x: `+=${790 - c.x}`, y: `+=${205 - c.y}`, duration: 0.5, ease: 'power2.out' }))
        await k.play(g.to(it.el, { rotation: -115, duration: 0.35, ease: 'power2.out' }))
        k.sfx('sprinkle')
        piecesInPot = BOWS.map(([x, y], i) => {
          const d = inPot(bow(RAW), x - 20, y - 20, 40, 29, 'z-index:14;pointer-events:none')
          g.fromTo(d, { y: -110 - i * 8, opacity: 1, rotation: k.rand(-60, 60) }, { y: 0, rotation: k.rand(-20, 20), duration: 0.5, delay: 0.15 + i * 0.08, ease: 'power2.in' })
          k.after(650 + i * 80, () => splash(720 + (x - 150) * 0.6, 300, 3))
          return d
        })
        await k.wait(1100)
        k.sfx('splash')
        g.to(it.el, { opacity: 0, y: '-=80', duration: 0.35 })
        k.after(400, () => it.el.remove())
        // макаронки покачиваются
        piecesInPot.forEach((d, i) => g.to(d, { y: -6, rotation: `+=${i % 2 ? 12 : -12}`, duration: 0.7 + i * 0.06, repeat: -1, yoyo: true, ease: 'sine.inOut' }))
      },
    })
    await tell(pyx, 'pasta_in', 'happy')

    // ───── 6. мешаем ─────
    const spoon = k.prop(kitchen.spoonWood(), 720, 250, 60, 200, { z: 25 })
    g.set(spoon, { opacity: 0 })
    g.to(spoon, { opacity: 1, duration: 0.3 })
    let sst = 0
    const shufflePieces = () => piecesInPot.forEach((d, i) => g.to(d, { left: BOWS[(i + 1 + sst) % BOWS.length][0] - 20, top: BOWS[(i + 1 + sst) % BOWS.length][1] - 20, duration: 0.4, ease: 'power2.inOut' }))
    await k.stir({ x: 720, y: 302 }, {
      radius: 70, turns: 2, prompt: k.key('q_stir'), host: pyx, spoon,
      moveSpoon: (x, y, a) => g.set(spoon, { x: x - 720, y: y - 60 - 250 + 4, rotation: Math.cos(a) * 8 }),
      onProgress: p => { const s = Math.floor(p * 4); if (s > sst && p < 1) { sst = s; shufflePieces() } },
    })
    g.to(spoon, { opacity: 0, y: -60, duration: 0.4 })
    k.after(450, () => spoon.remove())
    k.sparkle(720, 300, 8)
    await tell(pyx, 'stir_ok', 'cheer')

    // ───── 7. варим: песочные часы ─────
    bar.set(4)
    const hg = k.prop(hourglassArt(), 1140, 575, 120, 188, { z: 12 })
    k.popIn(hg)
    const top = hg.querySelector('.sand-top'), bot = hg.querySelector('.sand-bot'), fall = hg.querySelector('.sand-fall')
    g.set(top, { svgOrigin: '65 98', scaleY: 0 })
    g.set(bot, { svgOrigin: '65 178', scaleY: 1 })
    const dots = [0, 1, 2].map(i => k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 6px #E0D6EC"></div>', 1080 + i * 60, 448, 46, 46, { z: 12 }))
    k.popIn(dots)
    const runSand = async dur => {
      g.set(fall, { opacity: 1 })
      const flow = g.to(fall, { strokeDashoffset: -26, duration: 0.5, repeat: -1, ease: 'none' })
      k.sfx('tick')
      const tick = k.every(500, () => k.sfx('tick', { vol: 0.5 }))
      await k.play(g.timeline().to(top, { scaleY: 0, duration: dur, ease: 'none' }, 0).to(bot, { scaleY: 1, duration: dur, ease: 'none' }, 0))
      flow.kill(); tick()
      g.set(fall, { opacity: 0 })
    }
    for (let i = 0; i < 3; i++) {
      await k.tapN(hg, 1, i === 0 ? { prompt: k.key('q_time'), host: pyx } : { host: pyx })
      // переворот
      await k.play(g.to(hg, { rotation: 180, y: -14, duration: 0.5, ease: 'back.inOut(1.4)' }))
      g.set(hg, { rotation: 0, y: 0 })
      g.set(top, { scaleY: 1 }); g.set(bot, { scaleY: 0 })
      await runSand(2.4)
      k.sfx('ding', { vol: 0.6 })
      const d = dots[i]
      d.innerHTML = '<div style="width:100%;height:100%;border-radius:50%;background:#FFD93D;box-shadow:inset 0 0 0 6px #FFB703;display:grid;place-items:center"><span class="emoji" style="font-size:26px">⭐</span></div>'
      g.fromTo(d, { scale: 0.6 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' })
      await k.sayNumber(i + 1)
      if (i === 0) { emote(chukh, 'sad'); await tell(chukh, 'chukh_wait') }
      if (i === 1) await tell(pyx, 'wait_ok', 'point')
    }
    // макароны сварились: набухли и стали золотыми
    piecesInPot.forEach(d => { const s = d.querySelector('svg'); if (s) s.querySelectorAll('path').forEach(p => { if (p.getAttribute('fill') === RAW) p.setAttribute('fill', COOKED) }); g.to(d, { scale: 1.25, duration: 0.6 }) })
    k.sparkle(720, 300, 8)
    await tell(pyx, 'soft', 'cheer')
    fadeAway([hg, ...dots], 60)

    // ───── 8. выключаем плиту и сливаем воду — со взрослым ─────
    bar.set(5)
    const mama = k.bubble('👍', 440, 250, { w: 200, h: 160, font: 84 })
    await k.tapOnEl(knob, { prompt: k.key('q_off'), host: pyx })
    st.off(0)
    g.to(mama, { scale: 0, opacity: 0, duration: 0.3, delay: 0.3, onComplete: () => mama.remove() })
    puffs.forEach(tl => tl.repeat(0))
    const sb = k.prop(sinkBack(), 1200, 650, 340, 155, { z: 3 })
    const col = k.food('colander', 1200, 598, 250, { z: 5 })
    const sf = k.prop(sinkFront(), 1200, 650, 340, 155, { z: 7 })
    sb.style.pointerEvents = 'none'; sf.style.pointerEvents = 'none'
    k.fromTo([sb, col, sf], { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.6)' })
    await k.wait(600)
    await k.tapOnEl(col, { prompt: k.key('q_colander'), host: pyx })
    // взрослый несёт кастрюлю к дуршлагу и сливает воду
    k.sfx('whoosh', { vol: 0.5 })
    await k.play(g.timeline()
      .to(pot, { y: -70, duration: 0.35, ease: 'power2.out' })
      .to(pot, { x: 455, duration: 0.6, ease: 'power1.inOut' })
      .to(pot, { rotation: 38, y: -30, duration: 0.5, ease: 'power2.inOut' }))
    // вода льётся в дуршлаг, макароны остаются
    const rim = { x: 1252, y: 420 }
    k.sfx('pour', { vol: 0.9 })
    for (let i = 0; i < 26; i++) {
      const d = k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:#62C6FF;box-shadow:inset -2px -2px 0 rgba(0,0,0,.14)"></div>`, rim.x + k.rand(-10, 10), rim.y, k.rand(12, 20), k.rand(12, 20), { z: 6 })
      k.to(d, { y: 150 + k.rand(-10, 10), x: k.rand(-20, 10), duration: 0.45, delay: i * 0.05, ease: 'power1.in' })
      k.to(d, { y: '+=120', x: `+=${k.rand(-30, 30)}`, opacity: 0, duration: 0.4, delay: i * 0.05 + 0.45, ease: 'power1.in', onComplete: () => d.remove() })
    }
    const heap = BOWS.concat([[112, 92], [160, 92], [138, 62]]).map(([x, y], i) => {
      const d = k.prop(bow(COOKED), 1200 + (x - 140) * 0.8, 560 + (y - 80) * 0.5, 54, 39, { z: 6 })
      g.set(d, { rotation: k.rand(-40, 40), opacity: 0 })
      return d
    })
    g.to(heap, { opacity: 1, duration: 0.3, stagger: 0.08, delay: 0.3 })
    g.to(piecesInPot, { opacity: 0, duration: 0.5, stagger: 0.05, delay: 0.3 })
    k.after(800, () => splash(1200, 650, 6))
    await k.wait(1500)
    await k.play(g.timeline()
      .to(pot, { rotation: 0, y: -60, duration: 0.5, ease: 'power2.inOut' })
      .to(pot, { x: 0, duration: 0.55, ease: 'power1.inOut' })
      .to(pot, { y: 0, duration: 0.3, ease: 'bounce.out' }))
    await tell(pyx, 'drain', 'happy')
    bar.done(5)

    // ───── подача ─────
    g.to([sb, col, sf], { opacity: 0, duration: 0.4 })
    const plate = k.prop(kitchen.plate(), 1200, 700, 270, 94, { z: 5 })
    k.popIn(plate)
    g.to(heap, { y: '+=112', duration: 0.6, stagger: 0.03, ease: 'bounce.out' })
    k.sfx('plop')
    await k.wait(1400)
    k.sparkle(1200, 660, 6)
    // тарелка с макаронами едет к Чухтику
    const chuC = k.centerOf(chukh.el)
    k.sfx('crunch')
    await k.play(g.to([plate, ...heap], { x: `+=${chuC.x - 1200 - 40}`, y: `+=${chuC.y - 700 - 40}`, scale: 0.35, opacity: 0, duration: 0.9, ease: 'power2.in' }))
    emote(chukh, 'happy')
    await tell(chukh, 'chukh_eat', 'cheer')
    k.burst(1450, 700, 10)
    await tell(pyx, 'sum', 'point')
    await tell(chukh, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
