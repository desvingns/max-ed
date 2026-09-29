// «Смузи-радуга» — выбираем фрукты по цвету, блендер включаем только с крышкой (кнопку жмёт взрослый),
// разливаем поровну по трём стаканам до полоски.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, R, C, E, HL, SH, S, circlePath, mix, darker, lighter } from '../art.js'

const RED = '#FF5A5F', YEL = '#FFD93D', PUR = '#B388EB'
const BL = { x: 700, y: 485, w: 260, h: 470 } // блендер: центр, низ = 720
const bx = a => BL.x - BL.w / 2 + a
const by = a => BL.y - BL.h / 2 + a
const JAR = 'M52 80L208 80L194 336Q193 352 177 352L83 352Q67 352 66 336Z'
const PIVOT = { x: 222, y: 456 } // низ-право основания (точка наклона)
const TILT = 30
const HOME = [1055, 1165, 1275] // «дом» стаканов на столешнице
const MARK = 0.6 // полоска на стакане
const GOAL = [0.42, 0.78] // отпустить можно в этом диапазоне; уровень «прилипает» к полоске
const GLASS_Y = 650

let uid = 0
const OMBRE = `<stop offset="0" stop-color="#FF6F7D"/><stop offset=".5" stop-color="#FFC94A"/><stop offset="1" stop-color="#B98CF0"/>`
const gradDef = id => `<defs><linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0">${OMBRE}</linearGradient></defs>`

// содержимое блендера: 3 слоя-цвета, фрукты-кусочки, «радужный» смузи после взбивания, вихрь
const blenderBody = ({ lid = false, contents = true } = {}) => {
  const id = `smj${++uid}`, gid = `smg${uid}`
  const base = 'M34 352L226 352L236 440Q238 458 218 458L42 458Q22 458 24 440Z'
  const cols = [RED, YEL, PUR]
  let chunks = ''
  cols.forEach((c, j) => {
    const top = 350 - j * 80 - 80
    for (let n = 0; n < 6; n++) {
      const x = 94 + ((n * 37 + j * 23) % 76), y = top + 16 + ((n * 29 + j * 11) % 50)
      chunks += `<circle class="ck ck${j}" data-n="${n}" cx="${x}" cy="${y}" r="${contents ? 0 : 0}" fill="${lighter(c, 0.35)}" stroke="${darker(c, 0.3)}" stroke-width="3"/>`
    }
  })
  return gradDef(gid) + SH(130, 464, 118, 8) +
    L('M206 112C252 112 254 250 192 296', INK, 32) + L('M206 112C252 112 254 250 192 296', '#EAF7FF', 20) +
    S(base, '#B388EB', '#8F68D0') +
    R(52, 364, 156, 62, 26, '#fff', { sw: 0, attr: 'opacity=".2"' }) +
    // большая зелёная кнопка
    C(130, 406, 38, '#fff', { sw: 5 }) + S(circlePath(130, 406, 30), '#6BCB77', '#3FA85B', { sw: 4 }) +
    P('M122 393L148 406L122 419Z', '#fff', { sw: 0 }) +
    C(60, 408, 7, '#FFD93D', { sw: 3 }) + C(200, 408, 7, '#FF8FC8', { sw: 3 }) +
    `<path d="${JAR}" fill="#EAF7FF" fill-opacity=".55"/>` +
    `<clipPath id="${id}"><path d="${JAR}"/></clipPath><g clip-path="url(#${id})">` +
      `<rect class="mix" x="0" y="352" width="260" height="0" fill="url(#${gid})"/>` +
      cols.map((c, j) => `<rect class="ly ly${j}" x="0" y="${350 - j * 80}" width="260" height="0" fill="${c}"/>`).join('') +
      chunks +
      '<g class="swirl" opacity="0"><ellipse cx="130" cy="150" rx="52" ry="12" fill="none" stroke="#fff" stroke-width="6" stroke-opacity=".7"/><ellipse cx="130" cy="215" rx="46" ry="11" fill="none" stroke="#fff" stroke-width="6" stroke-opacity=".7"/><ellipse cx="130" cy="280" rx="38" ry="10" fill="none" stroke="#fff" stroke-width="6" stroke-opacity=".7"/></g>' +
    '</g>' +
    P(JAR, 'none', { sw: 6 }) +
    R(60, 338, 140, 22, 9, '#9B78DB') +
    R(76, 100, 12, 190, 6, '#fff', { sw: 0, attr: 'opacity=".6"' }) +
    R(44, 68, 172, 20, 10, '#F4FBFF') +
    (lid ? lidShape(130, 44) : '')
}
const lidShape = (cx, y) =>
  S(`M${cx - 92} ${y + 26}Q${cx - 92} ${y} ${cx - 64} ${y}L${cx + 64} ${y}Q${cx + 92} ${y} ${cx + 92} ${y + 26}L${cx + 92} ${y + 34}Q${cx + 92} ${y + 40} ${cx + 84} ${y + 40}L${cx - 84} ${y + 40}Q${cx - 92} ${y + 40} ${cx - 92} ${y + 34}Z`, '#FF8FC8', '#E06AA8') +
  R(cx - 24, y - 14, 48, 22, 11, '#FFB6DC') + HL(cx - 44, y + 12, 22, 5, -6, 0.6)
const blenderArt = () => svg(260, 470, blenderBody())
const cardArt = lid => svg(470, 470, `<g transform="translate(105 0)">${blenderBody({ lid })}</g>`)
const lidArt = () => svg(200, 66, lidShape(100, 20))

// стакан: 120×170, уровень 0..1
const GB = 'M16 14L104 14L94 150Q93 160 83 160L37 160Q27 160 26 150Z'
const glassArt = () => {
  const id = `smc${++uid}`, gid = `smq${uid}`
  const my = 156 - 138 * MARK
  return svg(120, 170,
    gradDef(gid) + SH(60, 166, 46, 5) +
    `<path d="${GB}" fill="#EAF7FF" fill-opacity=".55"/>` +
    `<clipPath id="${id}"><path d="${GB}"/></clipPath><g clip-path="url(#${id})"><rect class="gl" x="0" y="156" width="120" height="0" fill="url(#${gid})"/></g>` +
    P(GB, 'none', { sw: 5.5 }) +
    R(22, 26, 9, 100, 4, '#fff', { sw: 0, attr: 'opacity=".55"' }) +
    `<path d="M32 ${my}L92 ${my}" stroke="#2E9E5B" stroke-width="6" stroke-dasharray="10 8" stroke-linecap="round"/>` +
    P(`M2 ${my - 11}L22 ${my}L2 ${my + 11}Z`, '#2E9E5B', { sw: 3 }))
}

// слива (в food.js её нет)
const plumArt = () => svg(150, 160,
  SH(75, 154, 50, 6) +
  S('M75 34C118 30 142 62 138 100C134 138 104 152 75 152C46 152 16 138 12 100C8 62 32 30 75 34Z', '#8E5BD9', '#6A3DB0') +
  L('M75 38C62 70 62 110 76 148', '#5B3597', 4, 'opacity=".6"') +
  HL(44, 70, 12, 22, 25, 0.55) +
  L('M75 34C76 22 80 14 88 8', '#7A5230', 6) +
  P('M86 12C100 0 122 4 128 16C114 26 94 24 86 12Z', '#6BCB77', { sw: 4 }))

const FRUITS = {
  strawberry: { color: 'red', w: 120 }, apple: { color: 'red', w: 140 },
  banana: { color: 'yellow', w: 200 }, lemon: { color: 'yellow', w: 160 },
  orange: { color: 'orange', w: 140 }, grapes: { color: 'purple', w: 125 },
  plum: { color: 'purple', w: 125, art: plumArt, size: [150, 160] },
}
const ROUNDS = [
  { color: 'red', hex: RED, hue: -130, step: 0, ask: 'ask_red', pool: ['strawberry', 'apple', 'banana', 'grapes', 'orange'] },
  { color: 'yellow', hex: YEL, hue: -65, step: 1, ask: 'ask_yellow', pool: ['banana', 'lemon', 'strawberry', 'plum', 'apple'] },
  { color: 'purple', hex: '#9B6BFF', hue: 145, step: 2, ask: 'ask_purple', pool: ['grapes', 'plum', 'orange', 'lemon', 'apple'] },
]

const blob = c => svg(100, 100, `<circle cx="50" cy="50" r="30" fill="${c}"/><circle cx="18" cy="30" r="9" fill="${c}"/><circle cx="84" cy="24" r="7" fill="${c}"/><circle cx="82" cy="78" r="10" fill="${c}"/><circle cx="20" cy="80" r="6" fill="${c}"/><circle cx="50" cy="8" r="5" fill="${c}"/>`)

export default defineLevel({
  id: 'smoothie',
  async run(k) {
    const FL = k.layout.floorY
    k.kitchenBg()
    const pyx = k.pyx({ x: 250 })
    const kapa = k.guest('kapa', 1410, FL, { size: 300, face: 'left' })
    const bar = k.stepsBar(['🍓', '🍌', '🍇', '🌀', '🥤'])

    // Капа меняет цвет
    const hue = { v: 0 }
    const paint = (deg, dur = 0.9) => k.to(hue, { v: deg, duration: dur, ease: 'sine.inOut', onUpdate: () => { kapa.el.style.filter = `hue-rotate(${hue.v}deg)` } })
    const swatchHtml = hex => `<div style="width:84px;height:84px;border-radius:50%;background:${hex};box-shadow:0 0 0 6px ${INK}"></div>`
    let wish = null
    const setWish = hex => { wish?.remove(); wish = k.bubble(swatchHtml(hex), 1450, 600, { w: 190, h: 160, tail: 'left' }) }

    // блендер
    const blender = k.prop(blenderArt(), BL.x, BL.y, BL.w, BL.h, { z: 6 })
    const jarZone = k.prop('', BL.x, 480, 250, 320, { z: 3 })
    const q = s => blender.querySelector(s)
    const qa = s => [...blender.querySelectorAll(s)]
    k.fromTo(blender, { y: -420, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'bounce.out' })
    await k.wait(700)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(kapa, 'kapa_hi', 'happy')

    // слои смузи в блендере
    const counts = [0, 0, 0]
    const addLayer = j => {
      const n = ++counts[j]
      const y = 350 - j * 80 - n * 40
      k.to(q(`.ly${j}`), { attr: { y, height: n * 40 }, duration: 0.5, ease: 'bounce.out' })
      qa(`.ck${j}`).slice((n - 1) * 3, n * 3).forEach((c, i) => k.to(c, { attr: { r: 8 + (i % 2) * 3 }, duration: 0.4, delay: 0.1 * i, ease: 'back.out(3)' }))
    }

    // ───── 1–3. фрукты по цветам ─────
    const traySlots = [430, 610, 790, 970, 1150]
    for (let ri = 0; ri < ROUNDS.length; ri++) {
      const r = ROUNDS[ri]
      bar.set(r.step)
      if (ri > 0) { paint(r.hue); setWish(r.hex) } else { paint(r.hue); setWish(r.hex) }
      k.sfx('magic', { vol: 0.5 })
      await k.wait(700)
      const xs = k.shuffle(traySlots)
      const items = r.pool.map((name, i) => {
        const f = FRUITS[name]
        const el = f.art
          ? k.prop(f.art(), xs[i], 850, f.w, Math.round(f.w * f.size[1] / f.size[0]), { z: 20 })
          : k.food(name, xs[i], 850, f.w, { z: 20 })
        return { id: name, color: f.color, el }
      })
      k.fromTo(items.map(i => i.el), { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)' })
      await k.wait(900)
      await k.dnd({
        items, zones: [{ id: 'jar', el: jarZone, pad: 30 }],
        prompt: k.key(r.ask), host: kapa,
        accept: it => it.color === r.color,
        until: placed => placed.size >= 2,
        onCorrect: async it => {
          const c = k.centerOf(it.el)
          it.el.style.zIndex = '20'
          await k.play(k.gsap.to(it.el, { x: `+=${BL.x - c.x}`, y: `+=${300 - c.y}`, scale: 0.55, duration: 0.4, ease: 'power2.out' }))
          await k.play(k.gsap.to(it.el, { y: '+=120', opacity: 0, duration: 0.3, ease: 'power1.in' }))
          k.sfx('plop'); k.sfx('splash', { vol: 0.3 })
          addLayer(ri)
          kapa.emote('happy')
          await k.tell(kapa, `n_${it.id}`)
        },
        onWrong: async (it, z) => {
          it.el.style.zIndex = '20'
          if (!z) return
          k.sfx('wrong', { vol: 0.5 })
          kapa.emote('think')
          await k.tell(kapa, `n_${it.id}`)
        },
      })
      k.to(items.filter(i => i.el.style.opacity !== '0').map(i => i.el), { opacity: 0, y: 60, duration: 0.35, onComplete: () => items.forEach(i => i.el.remove()) })
      k.burst(BL.x, 330, 8)
      await k.tell(kapa, 'color_ok', 'cheer')
    }
    await k.tell(kapa, 'rainbow', 'jump')

    // ───── 4. блендер: крышка! ─────
    bar.set(3)
    const lid = k.prop(lidArt(), BL.x, 322, 200, 66, { z: 8 })
    lid.style.opacity = '0'
    const swirl = q('.swirl')
    const blendVisual = async (dur, { fade = true } = {}) => {
      const stop = k.every(150, () => k.sfx('scrub', { vol: 0.6 }))
      k.to(swirl, { opacity: 1, duration: 0.2 })
      qa('.swirl ellipse').forEach((e, i) => k.gsap.to(e, { scaleX: -1, svgOrigin: '130 230', duration: 0.18 + i * 0.03, repeat: Math.ceil(dur / 0.2), yoyo: true, ease: 'none' }))
      const wob = k.gsap.to(blender, { x: 5, rotation: 1.2, duration: 0.05, repeat: Math.ceil(dur / 0.05), yoyo: true, ease: 'none' })
      if (fade) {
        k.to(qa('.ly, .ck'), { opacity: 0, duration: dur * 0.7, delay: dur * 0.15 })
        k.to(q('.mix'), { attr: { y: 352 - 272 * 0.88, height: 272 * 0.88 + 2 }, duration: dur * 0.6 })
        k.to(q('.mix'), { opacity: 1, duration: dur * 0.6 })
      }
      await k.wait(dur * 1000)
      stop(); wob.kill(); k.gsap.set(blender, { x: 0, rotation: 0 })
      k.to(swirl, { opacity: 0, duration: 0.3 })
    }
    // тест «без крышки»: разлетелось!
    const splats = []
    const messy = async () => {
      k.sfx('whoosh')
      const jar = { x: BL.x, y: 320 }
      const shake = k.gsap.to(blender, { x: 6, duration: 0.05, repeat: 18, yoyo: true, ease: 'none' })
      const cols = [RED, YEL, PUR, '#FF9F43']
      for (let i = 0; i < 26; i++) {
        const s = k.rand(46, 110)
        const tx = k.rand(170, 1430), ty = k.rand(170, 880)
        const b = k.prop(blob(k.pick(cols)), jar.x, jar.y, s, s, { z: 58 })
        b.style.opacity = '0.93'
        splats.push(b)
        k.fromTo(b, { x: 0, y: 0, scale: 0.2, rotation: 0 }, { x: tx - jar.x, y: ty - jar.y, scale: 1, rotation: k.rand(-40, 40), duration: k.rand(0.4, 0.8), delay: i * 0.02, ease: 'power2.out' })
      }
      k.sfx('splash'); k.sfx('boing')
      pyx.emote('surprised'); kapa.emote('surprised')
      await k.wait(900)
      shake.kill(); k.gsap.set(blender, { x: 0 })
    }
    const cleanUp = () => { k.to(splats, { opacity: 0, y: '+=40', duration: 0.6, stagger: 0.02, onComplete: () => splats.splice(0).forEach(b => b.remove()) }) }

    await k.choose({
      prompt: k.key('q_lid'), host: pyx, skill: 'science:safety',
      options: k.shuffle([
        { id: 'nolid', art: cardArt(false), color: '#FF5A5F', outcome: async () => { await messy(); await k.tell(pyx, 'nolid_oops', 'shake'); cleanUp(); await k.tell(pyx, 'nolid_why', 'point') } },
        { id: 'lid', art: cardArt(true), color: '#6BCB77', correct: true, outcome: async () => {
          lid.style.opacity = '1'
          await k.play(k.gsap.fromTo(lid, { y: -280, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' }))
          k.sfx('clonk')
          await k.tell(pyx, 'lid_ok', 'cheer')
        } },
      ]),
    })

    // взрослый нажимает кнопку
    await k.narrate('adult')
    pyx.face('left')
    await k.tell(pyx, 'mama', 'wave')
    const mama = k.bubble('👩‍🍳👍', 310, 250, { w: 250, h: 190, font: 70, tail: 'left' })
    k.sfx('magic')
    await k.wait(900)
    pyx.face('right')
    await k.tell(pyx, 'mama_ok', 'nod')
    k.to(mama, { scale: 0, autoAlpha: 0, duration: 0.3, delay: 0.2, onComplete: () => mama.remove() })
    const btn = k.prop('', bx(130), by(406), 120, 120, { z: 9 })
    btn.style.borderRadius = '50%'
    await k.tapOnEl(btn, { prompt: k.key('q_button'), host: pyx })
    await blendVisual(2.4)
    k.burst(BL.x, 400, 10)
    await k.tell(pyx, 'blend_done', 'cheer')
    // крышку снимают
    k.to(lid, { y: -110, x: -70, rotation: -18, opacity: 0, duration: 0.5, ease: 'power2.in' })
    btn.remove()

    // ───── 5. разливаем поровну ─────
    bar.set(4)
    const glasses = HOME.map(x => {
      const el = k.prop(glassArt(), x, GLASS_Y, 100, 142, { z: 8 })
      return { el, gl: el.querySelector('.gl') }
    })
    k.fromTo(glasses.map(g => g.el), { y: -220, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'bounce.out' })
    await k.wait(900)
    // где носик при наклоне
    const rad = TILT * Math.PI / 180
    const rel = { x: 206 - PIVOT.x, y: 80 - PIVOT.y }
    const rim = {
      x: bx(PIVOT.x) + rel.x * Math.cos(rad) - rel.y * Math.sin(rad),
      y: by(PIVOT.y) + rel.x * Math.sin(rad) + rel.y * Math.cos(rad),
    }
    k.gsap.set(blender, { transformOrigin: `${(PIVOT.x / BL.w) * 100}% ${(PIVOT.y / BL.h) * 100}%` })
    const mixEl = q('.mix')
    const setMix = l => {
      l = Math.max(0.02, Math.min(1, l))
      const y = 352 - 272 * l
      k.to(mixEl, { attr: { y, height: 354 - y }, duration: 0.12, overwrite: 'auto' })
    }
    const stream = k.prop('<div style="width:100%;height:100%;border-radius:10px;background:linear-gradient(#FF9BB0,#F7C86A)"></div>', rim.x, 500, 20, 10, { z: 7 })
    stream.style.display = 'none'
    const surfaceY = p => GLASS_Y - 71 + 0.835 * (156 - 138 * p)
    let poured = 0
    const names = ['g1', 'g2', 'g3']
    for (let i = 0; i < 3; i++) {
      const g = glasses[i]
      await k.tell(pyx, names[i], 'point')
      let misses = 0, p0 = 0
      const setGl = p => { const y = 156 - 138 * p; k.to(g.gl, { attr: { y, height: 160 - y }, duration: 0.1, overwrite: 'auto' }) }
      const tilt = () => {
        k.to(blender, { rotation: TILT, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
        k.to(g.el, { x: rim.x - HOME[i], y: -6, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
      }
      const untilt = () => {
        stream.style.display = 'none'
        k.to(blender, { rotation: 0, duration: 0.4, ease: 'back.out(1.5)', overwrite: 'auto' })
      }
      const lv = await k.hold(blender, {
        duration: 2.8, goal: GOAL, prompt: i === 0 ? k.key('q_pour') : null, host: pyx, sfx: null,
        onStart: () => { tilt(); stream.style.display = 'block' },
        onLevel: p => {
          p0 = p
          setGl(p); setMix(1 - (poured + p) / 1.9)
          const y0 = rim.y, y1 = surfaceY(p)
          Object.assign(stream.style, { left: `${rim.x - 10}px`, top: `${y0}px`, height: `${Math.max(6, y1 - y0)}px` })
          if (p > 0 && Math.random() < 0.25) k.sfx('pour', { vol: 0.25 })
        },
        onRelease: () => { untilt(); k.to(g.el, { x: 0, y: 0, duration: 0.45, ease: 'back.out(1.6)', overwrite: 'auto', delay: 0.2 }) },
        onMiss: () => { if (++misses <= 2) k.tell(pyx, 'more') },
        onOver: () => {
          untilt(); k.sfx('splash')
          for (let j = 0; j < 8; j++) {
            const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#F58AA6"></div>', rim.x + k.rand(-30, 30), 620, 14, 14, { z: 13 })
            k.to(d, { x: k.rand(-60, 60), y: k.rand(30, 90), opacity: 0, duration: 0.5, ease: 'power1.in', onComplete: () => d.remove() })
          }
          k.tell(pyx, 'over', 'surprised')
        },
      })
      poured += MARK
      setGl(MARK); setMix(1 - poured / 1.9)
      k.sfx('pop')
      k.sparkle(HOME[i], GLASS_Y - 20, 4)
      await k.sayNumber(i + 1)
      await k.wait(300)
    }
    k.to(mixEl, { attr: { y: 352, height: 2 }, duration: 0.8 })
    await k.wait(600)
    k.burst(1150, 560, 10)
    await k.tell(pyx, 'equal', 'cheer')

    // ───── пьём радугу ─────
    const mouth = { x: 1340, y: 850 }
    const gK = glasses[0].el
    const from = k.centerOf(gK)
    gK.style.zIndex = '15'
    await k.play(k.gsap.to(gK, { x: `+=${mouth.x - 40 - from.x}`, y: `+=${mouth.y - 50 - from.y}`, duration: 0.8, ease: 'power2.inOut' }))
    await k.play(k.gsap.to(gK, { rotation: 36, x: '+=22', y: '+=48', duration: 0.3 }))
    k.sfx('yum', { vol: 0.6 })
    kapa.emote('happy')
    k.to(hue, { v: '+=720', duration: 2.4, ease: 'none', onUpdate: () => { kapa.el.style.filter = `hue-rotate(${hue.v}deg)` } })
    await k.tell(kapa, 'yum')
    wish?.remove()
    k.burst(1400, 760, 10)
    await k.tell(pyx, 'sum', 'point')
    await k.tell(kapa, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
