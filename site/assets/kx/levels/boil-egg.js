// «Яйцо: всмятку или вкрутую?» — три яйца варятся 3 / 6 / 9 минут (песочные часы), в разрезе видно:
// чем дольше варим, тем твёрже яйцо. Гости выбирают своё яйцо. Плиту включает только взрослый.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, E, C, R, HL, SH, S, circlePath, mix, darker, lighter } from '../art.js'

const COL = ['#FF6B6B', '#4D96FF', '#3FBF6E'] // красное, синее, зелёное яйцо = 3 / 6 / 9 минут
const MIN = [3, 6, 9]
const KIND = ['liquid', 'thick', 'hard']
const DUR = [2.4, 4.8, 7.2] // секунд «песка» в игре
const PAN = { x: 760, y: 822 } // панель с часами
const CELLX = [570, 760, 950]
const EGG_HOME = [1080, 1185, 1290] // яйца лежат тут в начале
const POT_OVAL = [-45, 0, 45] // смещение яйца в кастрюле от центра
const BOWL = { x: 1185, y: 640, w: 250, h: 164 }
const COUNTER = [520, 720, 920] // яйца на столе при разрезании

let uid = 0
const id = p => `be${p}${++uid}`
const EGG = 'M50 8C78 8 92 50 92 78C92 104 74 118 50 118C26 118 8 104 8 78C8 50 22 8 50 8Z'

// ── рисунки ──
const eggArt = i => {
  const cid = id('e')
  const band = `<rect x="0" y="62" width="100" height="26" fill="${COL[i]}"/>` +
    Array.from({ length: i + 1 }, (_, j) => `<circle cx="${50 + (j - i / 2) * 20}" cy="75" r="6" fill="#fff"/>`).join('')
  return svg(100, 124, SH(50, 121, 36, 4) +
    S(EGG, '#FFF4DF', '#F0D6A8', { extra: band }) +
    HL(30, 34, 8, 14, 20, 0.7))
}

const CUT = 'M70 8C112 8 132 66 132 106C132 146 106 164 70 164C34 164 8 146 8 106C8 66 28 8 70 8Z'
const cutArt = kind => {
  const cid = id('c')
  const white = '#FFFFFF'
  let yolk = ''
  if (kind === 'liquid') {
    yolk = S(circlePath(70, 108, 36), '#FFB300', '#F08A00', { sw: 5 }) +
      P('M52 138Q56 158 62 168Q68 156 72 138Z', '#FFB300', { sw: 4 }) +
      E(62, 170, 5, 6, '#FFB300', { sw: 3.5 }) +
      HL(56, 92, 12, 7, -30, 0.85) + `<circle cx="84" cy="122" r="4" fill="#fff" opacity=".6"/>`
  } else if (kind === 'thick') {
    yolk = S(circlePath(70, 108, 36), '#FFC93C', '#F0A81C', { sw: 5 }) +
      C(70, 108, 17, '#FF9E1B', { sw: 0 }) +
      HL(58, 94, 8, 4.5, -30, 0.55)
  } else {
    const crumbs = [[52, 96], [78, 92], [88, 112], [66, 124], [50, 118], [76, 108], [60, 106]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#F0CA55"/>`).join('')
    yolk = S(circlePath(70, 108, 36), '#FFE88A', '#F4CF56', { sw: 5 }) + crumbs +
      L('M70 108L70 80M70 108L98 112M70 108L48 128', '#F4CF56', 3, 'opacity=".7"')
  }
  return svg(140, 184,
    SH(70, 172, 52, 5) +
    `<clipPath id="${cid}"><path d="${CUT}"/></clipPath>` +
    `<path d="${CUT}" fill="#EBCB9A" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>` +
    `<g transform="translate(70 100) scale(.86) translate(-70 -100)"><path d="${CUT}" fill="${white}" stroke="#E9DFC8" stroke-width="3"/></g>` +
    `<g transform="translate(70 100) scale(.86) translate(-70 -100)"><path d="M30 60Q40 34 62 26" fill="none" stroke="#E5EEF6" stroke-width="7" stroke-linecap="round" opacity=".7"/></g>` +
    yolk)
}

const potEggsArt = () => svg(300, 230,
  [0, 1, 2].map(i => {
    const x = 150 + POT_OVAL[i]
    return `<g class="pe pe${i}" opacity="0" data-origin="${x} 84"><ellipse cx="${x}" cy="84" rx="19" ry="7.5" fill="#FFF4DF" stroke="${INK}" stroke-width="3.5"/><ellipse cx="${x}" cy="84" rx="5.5" ry="7.5" fill="${COL[i]}"/><ellipse cx="${x - 7}" cy="81" rx="5" ry="1.8" fill="#fff" opacity=".8"/></g>`
  }).join(''))

const bowlBack = () => svg(260, 170,
  E(130, 52, 118, 24, '#D8CCFF', { sw: 6 }) +
  E(130, 55, 104, 17, '#A8E0FF', { sw: 4 }) +
  [[70, 52, 20], [178, 50, -14], [124, 60, 8]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})"><rect x="${x - 11}" y="${y - 8}" width="22" height="16" rx="4" fill="#EAF8FF" stroke="#8EC9EA" stroke-width="3"/></g>`).join('') +
  E(112, 52, 16, 3.5, '#fff', { sw: 0, attr: 'opacity=".6"' }))
const bowlFront = () => svg(260, 170,
  S('M12 54A118 24 0 0 0 248 54C246 112 200 148 130 148C60 148 14 112 12 54Z', '#B9A3F7', '#8F76D6', { sw: 6 }) +
  [[60, 100], [98, 122], [150, 126], [192, 104], [224, 84], [38, 82]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#fff" opacity=".85"/>`).join('') +
  R(38, 74, 14, 34, 7, '#fff', { sw: 0, attr: 'opacity=".4" transform="rotate(12 45 90)"' }))

// песочные часы: sand-модель f = 0 (всё сверху) … 1 (всё внизу)
const GLASS = 'M26 24L104 24Q104 80 72 100Q104 120 104 178L26 178Q26 120 58 100Q26 80 26 24Z'
const hgArt = c => {
  const cid = id('h')
  return svg(130, 204,
    SH(65, 200, 52, 5) +
    P(GLASS, '#E6F6FF', { sw: 5 }) +
    `<clipPath id="${cid}"><path d="${GLASS}"/></clipPath><g clip-path="url(#${cid})">` +
      '<rect class="top" x="0" y="34" width="130" height="66" fill="#FFD93D"/>' +
      '<rect class="bot" x="0" y="176" width="130" height="0" fill="#FFD93D"/>' +
      '<rect class="str" x="63" y="100" width="4" height="0" fill="#F2B824"/>' +
    '</g>' +
    P(GLASS, 'none', { sw: 5 }) +
    R(12, 4, 106, 20, 9, c) + R(12, 178, 106, 20, 9, c) +
    HL(40, 52, 4, 16, 10, 0.7))
}

const drop = c => `<div style="width:100%;height:100%;border-radius:50%;background:${c}"></div>`
const ball = c => `<div style="width:100%;height:100%;border-radius:50%;border:4px solid ${c};background:rgba(255,255,255,.6);box-sizing:border-box"></div>`

export default defineLevel({
  id: 'boil-egg',
  async run(k) {
    const FL = k.layout.floorY
    k.kitchenBg()
    const st = k.stove()
    const pot = k.onBurner(k.prop(kitchen.pot({ lid: false }), 0, 0, 300, 230, { z: 6 }), 0, 300, 230)
    pot.querySelector('.kp-shadow')?.style.setProperty('visibility', 'hidden')
    const potEggs = k.onBurner(k.prop(potEggsArt(), 0, 0, 300, 230, { z: 7 }), 0, 300, 230)
    potEggs.style.pointerEvents = 'none'
    const pyx = k.pyx({ x: 250 })
    const kapa = k.guest('kapa', 1470, FL, { size: 250, face: 'left' })
    const bar = k.stepsBar(['🥚', '🔥', '⏳', '🧊', '🔍', '🥄'])
    const B = st.burner(0) // дно кастрюли
    const steamEls = []
    const potX = B.x, potMouthY = B.y - 230 + 6 + 82
    const ovalAt = i => ({ x: potX + POT_OVAL[i], y: potMouthY + 3 })

    // яйцо-спрайт (id → { el })
    const egg = (i, cx, cy, w = 84) => k.prop(eggArt(i), cx, cy, w, Math.round(w * 124 / 100), { z: 12 })
    const splash = (x, y, color = '#A8E0FF', n = 8) => {
      for (let j = 0; j < n; j++) {
        const s = k.rand(9, 16)
        const d = k.prop(drop(color), x + k.rand(-16, 16), y, s, s, { z: 14 })
        k.to(d, { x: k.rand(-46, 46), y: k.rand(-70, -20), opacity: 0, duration: k.rand(0.4, 0.7), ease: 'power2.out', onComplete: () => d.remove() })
      }
    }

    // ───── 0. знакомство ─────
    const eggs = [0, 1, 2].map(i => egg(i, EGG_HOME[i], 645))
    k.fromTo(eggs, { y: -320, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'bounce.out' })
    k.fromTo([st.el, pot], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' })
    await k.wait(900)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(kapa, 'kapa_hi', 'happy')

    // ───── 1. яйца в холодную воду ─────
    bar.set(0)
    const items = eggs.map((el, i) => ({ id: `e${i}`, i, el }))
    await k.dnd({
      items, zones: [{ id: 'pot', el: pot, pad: 50 }], prompt: k.key('q_eggs'), host: pyx,
      accept: () => true,
      onCorrect: async (it, z, placed) => {
        const c = k.centerOf(it.el)
        it.el.style.zIndex = '20'
        const tl = k.gsap.timeline()
        const to = ovalAt(it.i)
        tl.to(it.el, { x: `+=${to.x - c.x}`, y: `+=${to.y - 130 - c.y}`, scale: 0.7, duration: 0.4, ease: 'power2.out' })
          .to(it.el, { y: `+=${130}`, scale: 0.45, opacity: 0, duration: 0.3, ease: 'power2.in' })
        await k.play(tl)
        k.sfx('plop'); k.sfx('splash', { vol: 0.5 })
        splash(to.x, to.y)
        const pe = potEggs.querySelector(`.pe${it.i}`)
        k.gsap.fromTo(pe, { opacity: 0, scale: 0.3, svgOrigin: pe.dataset.origin }, { opacity: 1, scale: 1, svgOrigin: pe.dataset.origin, duration: 0.4, ease: 'back.out(3)' })
        k.gsap.to(pe, { y: 2, duration: 1.4 + it.i * 0.2, yoyo: true, repeat: -1, ease: 'sine.inOut' })
        await k.sayNumber(placed.size)
      },
    })
    eggs.forEach(e => e.remove())
    await k.tell(kapa, 'eggs_in', 'cheer')

    // ───── 2. плита — со взрослым ─────
    bar.set(1)
    const knob = st.knobEl(0)
    await k.adultHelp({ knob })
    knob.remove()
    st.on(0)
    // вода нагревается, пузырьки, пар
    const bubs = [...pot.querySelectorAll('.bubble')]
    const boilIt = () => {
      bubs.forEach((b, i) => {
        const o = b.getAttribute('data-origin')
        k.gsap.set(b, { opacity: 0 })
        k.to(b, { keyframes: [{ opacity: 1, scale: 0.4, y: 4, duration: 0 }, { opacity: 1, scale: 1.1, y: -6, duration: 0.35 }, { opacity: 0, scale: 0.6, y: -16, duration: 0.3 }], svgOrigin: o, repeat: -1, delay: i * 0.13, repeatDelay: 0.12 })
      })
      k.to(pot.querySelector('.water'), { y: 1.5, duration: 0.12, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      potEggs.querySelectorAll('.pe').forEach((p, i) => k.to(p, { rotation: i % 2 ? 6 : -6, svgOrigin: p.dataset.origin, duration: 0.18, yoyo: true, repeat: -1, ease: 'sine.inOut' }))
      const puffs = [0, 1, 2].map(i => k.prop(kitchen.steam(), potX - 60 + i * 60, 215, 110, 80, { z: 5 }))
      puffs.forEach((p, i) => { p.style.pointerEvents = 'none'; steamEls.push(p); k.fromTo(p, { y: 0, opacity: 0 }, { y: -60, opacity: 0.8, duration: 1.5, repeat: -1, delay: i * 0.5, ease: 'sine.out' }) })
    }
    await k.wait(800)
    boilIt()
    k.sfx('bubble')
    await k.tell(pyx, 'boil', 'point')
    await k.tell(pyx, 'hot', 'shake')

    // ───── 3. песочные часы ─────
    bar.set(2)
    const panel = k.prop('<div style="width:100%;height:100%;border-radius:40px;background:rgba(255,255,255,.92);box-shadow:0 10px 0 rgba(0,0,0,.16),inset 0 0 0 8px #E0D6EC"></div>', PAN.x, PAN.y, 660, 192, { z: 6 })
    const cells = CELLX.map(x => k.prop('', x, PAN.y, 190, 178, { z: 9 }))
    const hgs = CELLX.map((x, i) => k.prop(hgArt(COL[i]), x + 36, PAN.y + 4, 78, 122, { z: 8 }))
    const nums = CELLX.map((x, i) => k.badge(String(MIN[i]), x - 44, PAN.y, { size: 76, color: COL[i], pop: false }))
    k.popIn([panel, ...hgs, ...nums], 0.1)
    await k.wait(700)
    const setHg = (i, f) => {
      const el = hgs[i]
      const top = el.querySelector('.top'), bot = el.querySelector('.bot'), str = el.querySelector('.str')
      const th = 66 * (1 - f)
      top.setAttribute('y', String(34 + 66 * f)); top.setAttribute('height', String(th))
      const bh = 66 * f
      bot.setAttribute('y', String(176 - bh)); bot.setAttribute('height', String(bh))
      if (f > 0 && f < 1) { str.setAttribute('height', String(176 - bh - 100)) } else str.setAttribute('height', '0')
    }
    // изначально весь песок внизу (часы «отработали»), тап переворачивает
    hgs.forEach((_, i) => setHg(i, 1))
    const dones = [0, 1, 2].map(() => { let r; const p = new Promise(res => { r = res }); p.res = r; return p })
    const startTimer = i => {
      const el = hgs[i]
      k.sfx('flip')
      k.play(k.gsap.to(el, { rotation: 180, duration: 0.5, ease: 'back.out(1.6)' })).then(() => {
        k.gsap.set(el, { rotation: 0 })
        setHg(i, 0)
        const o = { f: 0 }
        let tick = 0
        k.to(o, {
          f: 1, duration: DUR[i], ease: 'none',
          onUpdate: () => { setHg(i, o.f); const t = Math.floor(o.f * MIN[i]); if (t > tick) { tick = t; k.sfx('tick') } },
          onComplete: () => { setHg(i, 1); dones[i].res() },
        })
      })
    }
    await k.tapAll(cells, { prompt: k.key('q_timers'), host: pyx, color: '#FFB703', onTap: (el, i) => startTimer(i) })
    k.tell(kapa, 'timer_start', 'point')

    // ───── 4. достаём по очереди, остужаем ─────
    const bowlB = k.prop(bowlBack(), BOWL.x, BOWL.y, BOWL.w, BOWL.h, { z: 5 })
    const bowlF = k.prop(bowlFront(), BOWL.x, BOWL.y, BOWL.w, BOWL.h, { z: 9 })
    bowlB.style.opacity = '0'; bowlF.style.opacity = '0'
    k.fromTo([bowlB, bowlF], { y: -240, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    bar.set(3)
    const bowlEggs = []
    const spoonArt = kitchen.spoonMetal()
    for (let i = 0; i < 3; i++) {
      await dones[i]
      k.sfx('ding')
      k.to(nums[i], { scale: 1.25, duration: 0.3, yoyo: true, repeat: 3 })
      // яйцо выскакивает из воды
      const from = ovalAt(i)
      const hover = { x: from.x, y: 195 }
      const pe = potEggs.querySelector(`.pe${i}`)
      k.to(pe, { opacity: 0, duration: 0.15 })
      const eg = egg(i, from.x, from.y, 84)
      k.fromTo(eg, { scale: 0.4, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.3 })
      await k.play(k.gsap.to(eg, { y: hover.y - from.y, duration: 0.5, ease: 'power2.out' }))
      k.sfx('pop')
      k.to(eg, { y: `+=10`, duration: 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      await k.tell(kapa, `ready${i + 1}`, 'jump')
      await k.tapOnEl(eg, { prompt: k.key(i === 0 ? 'q_out' : 'q_out2'), host: pyx })
      k.gsap.killTweensOf(eg)
      // ложка подцепляет яйцо и несёт в холодную воду
      const spoon = k.prop(spoonArt, 0, 0, 80, 260, { z: 13 })
      k.gsap.set(spoon, { transformOrigin: '50% 79.2%' })
      const ec = k.centerOf(eg)
      Object.assign(spoon.style, { left: `${ec.x - 40}px`, top: `${ec.y + 22 - 206}px` })
      k.fromTo(spoon, { x: -170, y: 90, rotation: -100, opacity: 0 }, { x: 0, y: 0, rotation: -68, opacity: 1, duration: 0.45, ease: 'power2.out' })
      await k.wait(480)
      const dest = { x: BOWL.x + (i - 1) * 50, y: 560 }
      const dx = dest.x - ec.x, dy = dest.y - ec.y
      k.sfx('whoosh')
      const tl = k.gsap.timeline()
      tl.to([eg, spoon], { x: `+=${dx}`, duration: 0.9, ease: 'power1.inOut' }, 0)
        .to([eg, spoon], { y: `+=${dy - 90}`, duration: 0.45, ease: 'power2.out' }, 0)
        .to([eg, spoon], { y: `+=${90}`, duration: 0.45, ease: 'power2.in' }, 0.45)
      await k.play(tl)
      await k.play(k.gsap.to(spoon, { rotation: -8, duration: 0.25, ease: 'power1.in' }))
      await k.play(k.gsap.to(eg, { y: `+=${BOWL.y - 40 - dest.y}`, duration: 0.3, ease: 'power2.in' }))
      k.sfx('splash'); k.sfx('sizzle')
      splash(dest.x, BOWL.y - 40, '#DDF3FF', 8)
      k.gsap.fromTo(eg, { scale: 1 }, { scale: 0.96, duration: 0.2, yoyo: true, repeat: 1 })
      k.to(eg, { y: `+=${6}`, duration: 1.3 + i * 0.25, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      eg.style.zIndex = '7'
      bowlEggs.push(eg)
      k.to(spoon, { opacity: 0, x: '-=120', y: '+=70', rotation: -70, duration: 0.45, onComplete: () => spoon.remove() })
      // пар от горячего яйца в холодной воде
      const pf = k.prop(kitchen.steam(), dest.x, BOWL.y - 70, 90, 66, { z: 13 })
      pf.style.pointerEvents = 'none'
      k.fromTo(pf, { y: 0, opacity: 0.9 }, { y: -50, opacity: 0, duration: 1.3, ease: 'sine.out', onComplete: () => pf.remove() })
      if (i === 0) await k.tell(pyx, 'cool', 'cheer')
      else await k.wait(300)
    }
    // взрослый выключает плиту
    st.off(0)
    await k.narrate('off')

    // ───── 5. разбиваем: что внутри? ─────
    bar.set(4)
    const gone = [potEggs, pot, st.el, panel, ...cells, ...hgs, ...nums, bowlB, bowlF]
    k.to(gone, { opacity: 0, duration: 0.5, onComplete: () => gone.forEach(e => e.remove()) })
    bowlEggs.forEach(e => k.gsap.killTweensOf(e))
    k.to(steamEls, { opacity: 0, duration: 0.4, onComplete: () => steamEls.forEach(e => e.remove()) })
    await k.wait(300)
    // яйца перелетают на стол
    await k.play(k.gsap.to(bowlEggs, { x: (j, t) => { const idx = bowlEggs.indexOf(t); return `+=${COUNTER[idx] - k.centerOf(t).x}` }, y: (j, t) => `+=${650 - k.centerOf(t).y}`, scale: 1.25, duration: 0.7, stagger: 0.1, ease: 'power2.inOut' }))
    k.sfx('pop')
    const cracked = []
    let crackChain = Promise.resolve()
    const say = (who, line, emote) => { crackChain = crackChain.then(() => k.tell(who, line, emote)) }
    await k.tapAll(bowlEggs, {
      prompt: k.key('q_crack'), host: pyx,
      onTap: async (el, idx) => {
        const at = { x: COUNTER[idx], y: 650 }
        k.gsap.killTweensOf(el)
        k.sfx('crunch'); k.sfx('pop')
        const cut = k.prop(cutArt(KIND[idx]), at.x, at.y, 130, Math.round(130 * 184 / 140), { z: 12 })
        k.fromTo(cut, { scale: 0.5, opacity: 0, rotation: idx % 2 ? 8 : -8 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.45, ease: 'back.out(2.4)' })
        k.to(el, { opacity: 0, scale: 0.5, duration: 0.2, onComplete: () => el.remove() })
        cracked[idx] = cut
        k.sparkle(at.x, at.y - 40, 5)
        if (idx === 0) say(pyx, 'liquid', 'cheer')
        else if (idx === 1) say(kapa, 'thick', 'think')
        else say(pyx, 'hard', 'point')
      },
    })
    await crackChain
    await k.wait(300)
    // сравнение: 3 → 6 → 9
    const badges = COUNTER.map((x, i) => k.badge(String(MIN[i]), x, 520, { size: 70 + i * 22, color: COL[i] }))
    const arrow = k.prop(svg(500, 60, `<path d="M20 30H460" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M430 6L472 30L430 54" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`), 720, 445, 500, 60, { z: 12 })
    k.popIn(arrow)
    await k.tell(kapa, 'cmp', 'point')
    await k.wait(400)
    k.to([...badges, arrow], { opacity: 0, scale: 0.6, duration: 0.3, onComplete: () => { badges.forEach(b => b.remove()); arrow.remove() } })

    // ───── 6. кто как любит? ─────
    bar.set(5)
    const sh = k.guest('shchyok', 1010, FL, { size: 230, face: 'left' })
    const bu = k.guest('busya', 1240, FL, { size: 230, face: 'left' })
    k.fromTo([sh.el, bu.el], { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.6)' })
    await k.wait(700)
    await k.tell(pyx, 'q_guests', 'point')
    const guests = [
      { key: 'sh', ch: sh, want: 'liquid', bx: 1072 },
      { key: 'bu', ch: bu, want: 'thick', bx: 1302 },
      { key: 'ka', ch: kapa, want: 'hard', bx: 1500 },
    ]
    const wishBubble = g => k.bubble(`<div style="width:78px;height:103px">${cutArt(g.want)}</div>`, g.bx, 640, { w: 150, h: 170, tail: 'left', font: 80 })
    const bubblesEls = []
    for (const g of guests) {
      g.ch.emote('jump')
      bubblesEls.push(wishBubble(g))
      await k.tell(g.ch, `want_${g.key}`)
    }
    const dItems = k.shuffle(cracked.map((el, i) => ({ id: KIND[i], kind: KIND[i], el })))
    // разложим в новом порядке на столе
    dItems.forEach((it, j) => { const c = k.centerOf(it.el); k.to(it.el, { x: `+=${COUNTER[j] - c.x}`, duration: 0.35, ease: 'back.out(1.5)' }) })
    await k.wait(500)
    // после смещения dnd запомнит новую «домашнюю» позицию (getProperty x/y на старте)
    const fed = {}
    await k.dnd({
      items: dItems, zones: guests.map(g => ({ id: g.key, el: g.ch.el, want: g.want, g, pad: 30 })),
      prompt: k.key('q_give'), host: pyx,
      accept: (it, z) => it.kind === z.want,
      onCorrect: async (it, z) => {
        const gc = k.centerOf(z.g.ch.el)
        it.el.style.zIndex = '30'
        const c = k.centerOf(it.el)
        k.sfx('whoosh')
        await k.play(k.gsap.to(it.el, { x: `+=${gc.x - c.x}`, y: `+=${gc.y - 40 - c.y}`, scale: 0.4, rotation: 12, duration: 0.55, ease: 'power2.in' }))
        k.sfx('yum', { vol: 0.6 }); k.sfx('crunch')
        k.to(it.el, { opacity: 0, duration: 0.2 })
        z.g.ch.emote('happy')
        k.burst(gc.x, gc.y - 60, 8)
        await k.tell(z.g.ch, `yum_${z.g.key}`)
      },
      onWrong: async (it, z) => {
        if (!z) return
        k.sfx('wrong', { vol: 0.5 })
        z.g.ch.emote('shake')
        await k.tell(z.g.ch, `wrong_${z.g.key}`)
      },
    })
    k.to(bubblesEls, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => bubblesEls.forEach(b => b.remove()) })
    await k.wait(400)
    await k.tell(pyx, 'sum', 'point')
    await k.tell(kapa, 'forever', 'think')
    await k.tell(sh, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
