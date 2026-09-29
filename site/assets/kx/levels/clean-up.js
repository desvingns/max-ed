// «Уборка на кухне»: Хапчик чихнул мукой → 1) губкой протираем пятна (scrub) → 2) моем тарелки в раковине (scrub, пена, счёт)
// → 3) посуду по местам (dnd: тарелки в стопку, кружки на крючки, ложки в ящик) → 4) мусор в ведро (dnd). Финал: чистая кухня блестит.
import { defineLevel, food } from '../lib.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, rounded, circlePath, nid } from '../art.js'

/** У героев после серии эмоций «плывёт» корень (gsap путает svgOrigin/transformOrigin): после каждой эмоции сбрасываем трансформ корня. */
const guardEmotes = (k, ...chars) => {
  for (const c of chars) {
    const root = c.svg.querySelector('.c-root'), orig = c.emote.bind(c)
    let busy = 0
    c.emote = e => { busy++; return orig(e).finally(() => { if (--busy === 0 && k.alive) k.gsap.set(root, { clearProps: 'all' }) }) }
  }
  return chars[0]
}

// ───────────────────────── рисунки ─────────────────────────
const WOOD = '#E2A468', WOOD_L = '#F2C48E'

const bgSvg = () => {
  let tiles = ''
  for (let r = 0; r < 6; r++) for (let c = -1; c < 15; c++) {
    const x = c * 112 + (r % 2 ? 56 : 0)
    tiles += `<rect x="${x + 5}" y="${r * 112 + 5}" width="102" height="102" rx="16" fill="${(r * 3 + c) % 7 === 0 ? '#FFEBC0' : '#FFF8E6'}"/>`
  }
  let seams = ''
  for (let i = 0; i < 5; i++) {
    const y = 664 + i * 78
    seams += `<path d="M-20 ${y}H1620" stroke="#D89F62" stroke-width="4" opacity=".5"/>`
    for (let x = (i % 2 ? 150 : 400); x < 1620; x += 480) seams += `<path d="M${x} ${y}V${y + 78}" stroke="#D89F62" stroke-width="4" opacity=".5"/>`
  }
  const brk = x => P(`M${x - 20} 420L${x + 20} 420L${x - 20} 466Z`, '#C98F55', { sw: 5 })
  const hook = x => `<path d="M${x} 322V340Q${x} 356 ${x + 16} 350" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M${x} 322V340Q${x} 356 ${x + 16} 350" fill="none" stroke="#FFD166" stroke-width="7" stroke-linecap="round"/>`
  const plate = y => E(300, y, 84, 16, '#FFFFFF') + E(300, y, 56, 9, '#E6F0FA', { sw: 0 })
  return svg(1600, 1000,
    `<rect x="-10" y="-10" width="1620" height="1020" fill="#F3DDA6"/>` + tiles +
    // окно
    `<rect x="650" y="70" width="300" height="330" rx="150" fill="#BFE7FF" stroke="${INK}" stroke-width="8"/><path d="M800 70V400M650 240H950" stroke="${INK}" stroke-width="7"/>${C(880, 150, 26, '#FFE066', { sw: 0 })}` +
    `<path d="M622 60L660 108V380L622 428Z" fill="#FFC2E0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M978 60L940 108V380L978 428Z" fill="#FFC2E0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // полка слева: стопка тарелок и банка
    brk(160) + brk(420) + R(110, 396, 360, 26, 9, WOOD) + F('M120 405H460', WOOD_L, 'stroke="#F6D2A4" stroke-width="6" stroke-linecap="round"') +
    plate(386) + plate(372) +
    R(392, 336, 54, 58, 10, '#FFB3D9') + R(388, 322, 62, 18, 6, '#FF8FC8') + HL(402, 362, 4, 16, 0, 0.7) +
    // рейка с крючками справа
    R(1150, 298, 340, 24, 9, WOOD) + F('M1160 306H1480', WOOD_L, 'stroke="#F6D2A4" stroke-width="6" stroke-linecap="round"') + hook(1210) + hook(1320) + hook(1430) +
    // столешница
    `<rect x="-20" y="592" width="1640" height="18" fill="#E9C99C"/><rect x="-20" y="606" width="1640" height="420" fill="#F5CE97"/><rect x="-20" y="606" width="1640" height="12" fill="#FFE2B8"/><path d="M-20 606H1620" stroke="${INK}" stroke-width="6"/>` + seams +
    // раковина с краном
    `<g transform="translate(20 -32)"><path d="M1180 706V636Q1180 606 1146 606H1090Q1070 606 1070 630V652" fill="none" stroke="${INK}" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/><path d="M1180 706V636Q1180 606 1146 606H1090Q1070 606 1070 630V652" fill="none" stroke="#DDE6F2" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>` +
    R(1150, 598, 64, 18, 8, '#4D96FF') +
    E(1180, 802, 210, 70, '#FFFFFF') + E(1180, 808, 182, 52, '#CDEBFA', { sw: 5 }) + E(1180, 816, 140, 34, '#B0DBF1', { sw: 0 }) + E(1180, 824, 28, 9, '#5E5776', { sw: 4 }) + HL(1050, 782, 50, 6, -8, 0.7) + `</g>`)
}

const chipHtml = (inner, color) =>
  `<div style="width:100%;height:100%;border-radius:50%;box-sizing:border-box;background:#fff;box-shadow:inset 0 0 0 8px ${color},0 8px 0 rgba(0,0,0,.14);display:flex;align-items:center;justify-content:center"><div style="width:60px;height:60px">${inner}</div></div>`

const flourArt = () => svg(320, 130,
  `<path d="M22 72C10 32 70 14 122 26C172 4 252 20 284 56C314 92 252 120 192 112C140 128 60 124 22 72Z" fill="#FFFFFF" stroke="#D6CFE8" stroke-width="4"/>` +
  `<path d="M40 86C90 112 170 112 250 94C240 110 200 118 150 116C100 118 60 108 40 86Z" fill="#E7E1F3"/>` +
  [[52, 44, 6], [292, 40, 5], [300, 84, 4], [18, 96, 5], [160, 12, 4], [232, 18, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" stroke="#D6CFE8" stroke-width="3"/>`).join('') + HL(90, 44, 26, 8, -8, 0.7))

const jamArt = () => svg(230, 110,
  `<path d="M20 60C8 26 60 8 108 18C150 4 206 22 214 52C222 84 176 100 128 94C96 108 34 96 20 60Z" fill="#B0324E" stroke="#7E1F38" stroke-width="4"/>` +
  `<path d="M30 70C56 96 120 100 196 82C176 98 150 102 120 100C80 104 44 92 30 70Z" fill="#8C2440"/>` +
  `<path d="M60 92Q56 110 64 112Q72 110 68 94Z" fill="#B0324E" stroke="#7E1F38" stroke-width="3"/><path d="M150 96Q148 112 156 112Q162 108 158 96Z" fill="#B0324E" stroke="#7E1F38" stroke-width="3"/>` +
  HL(74, 36, 22, 7, -12, 0.55) + `<circle cx="150" cy="44" r="6" fill="#fff" opacity=".5"/>`)

const crumbsArt = () => {
  const bits = [[30, 60, 14], [70, 34, 10], [96, 82, 12], [140, 44, 16], [178, 84, 10], [208, 40, 12], [236, 70, 14], [120, 66, 8], [58, 92, 9], [190, 58, 8], [16, 30, 7], [250, 34, 8]]
  return svg(270, 120, bits.map(([x, y, r], i) => `<path d="M${x - r} ${y}L${x - r * 0.3} ${y - r * 0.9}L${x + r * 0.8} ${y - r * 0.5}L${x + r} ${y + r * 0.4}L${x - r * 0.2} ${y + r * 0.9}Z" fill="${i % 3 ? '#E6A462' : '#C98546'}" stroke="#8C5A2B" stroke-width="3" stroke-linejoin="round"/>`).join(''))
}

const dirtSpots = () => [[64, 44, 17, '#B0324E'], [106, 54, 14, '#F2B824'], [138, 42, 16, '#B0324E'], [88, 34, 12, '#C98546'], [120, 62, 11, '#C98546']]
const dirtyPlateHtml = () =>
  `<div style="position:relative;width:100%;height:100%">${food('plate2')}<div style="position:absolute;inset:0">${svg(200, 92, dirtSpots().map(([x, y, r, col], i) => `<g class="d" data-i="${i}"><ellipse cx="${x}" cy="${y}" rx="${r * 1.5}" ry="${r * 0.7}" fill="${col}" opacity=".9"/><circle cx="${x - r * 0.4}" cy="${y - r * 0.2}" r="${r * 0.22}" fill="#fff" opacity=".6"/></g>`).join(''))}</div></div>`

const foamSvg = tint => svg(100, 100,
  `<circle cx="50" cy="50" r="45" fill="#fff" stroke="#8CCBEA" stroke-width="5"/><path d="M14 58A38 38 0 0 0 86 62A44 44 0 0 1 14 58Z" fill="${tint}"/>` +
  `<ellipse cx="33" cy="31" rx="11" ry="6" fill="#fff" stroke="#DDF0FA" stroke-width="2" transform="rotate(-35 33 31)"/>`)

const binArt = () => svg(230, 310,
  SH(115, 302, 84, 8) +
  S('M34 84L196 84L180 288Q178 300 166 300L64 300Q52 300 50 288Z', '#8FA6C8', '#6F86AC', { extra: '<path d="M78 92L86 296M115 92V298M152 92L144 296" stroke="#6F86AC" stroke-width="5" opacity=".7"/>' }) +
  E(115, 84, 90, 22, '#DDE6F2') + E(115, 86, 74, 14, '#3B2F4F', { sw: 0 }) +
  C(115, 184, 30, '#FFFFFF', { sw: 4 }) + P('M100 196C96 170 118 158 136 162C136 184 122 198 100 196Z', '#6BCB77', { sw: 4 }) + L('M104 192L128 168', '#2E8F5B', 4) + HL(60, 190, 5, 42, 6, 0.5))

const peelArt = () => svg(180, 120,
  SH(90, 112, 66, 5) +
  P('M90 20C60 26 24 50 18 96C40 92 66 86 90 70C114 86 140 92 162 96C156 50 120 26 90 20Z', '#FFE066', { sw: 5 }) +
  P('M90 70C66 86 40 92 18 96L30 104C56 104 84 92 90 82Z', '#F2C81E', { sw: 4 }) + P('M90 70C114 86 140 92 162 96L150 104C124 104 96 92 90 82Z', '#F2C81E', { sw: 4 }) +
  P('M84 22Q90 8 98 22Z', '#8C5A2B', { sw: 4 }) + HL(60, 52, 16, 5, -35, 0.6))

const wrapperArt = () => svg(160, 110,
  SH(80, 104, 58, 5) +
  P('M8 30L44 52L44 78L8 100Z', '#FFD93D', { sw: 4 }) + P('M152 30L116 52L116 78L152 100Z', '#FFD93D', { sw: 4 }) +
  S('M40 44C50 30 110 30 120 44C128 58 128 72 120 86C110 100 50 100 40 86C32 72 32 58 40 44Z', '#FF8FC8', '#E8508F') +
  `<path d="M56 46Q80 90 104 46" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".9"/>` + HL(60, 48, 12, 5, -30, 0.7))

const shellArt = () => svg(150, 110,
  SH(75, 104, 56, 5) +
  P('M14 60L26 44L38 60L50 44L62 60L70 66C72 90 60 100 42 100C24 100 12 88 14 60Z', '#FFF6E8', { sw: 5 }) +
  P('M84 70L96 54L108 70L120 54L132 70C134 94 122 102 106 102C90 102 82 92 84 70Z', '#FFF0D8', { sw: 5 }) +
  `<path d="M40 76Q44 88 34 92" fill="none" stroke="#E6CFA8" stroke-width="4" stroke-linecap="round"/>` + HL(28, 76, 4, 10, 0, 0.6))

const chestArt = () => svg(290, 230,
  SH(145, 224, 120, 8) +
  S('M22 60L268 60L268 210Q268 220 258 220L32 220Q22 220 22 210Z', '#D9A05B', '#B9783A') +
  R(12, 40, 266, 34, 12, '#E9B876') + `<path d="M28 52H262" stroke="#F6D2A4" stroke-width="5" stroke-linecap="round"/>` +
  `<rect class="slot" x="40" y="100" width="210" height="16" rx="6" fill="${INK}" opacity="0"/>` +
  `<g class="drawer"><rect x="36" y="104" width="218" height="88" rx="16" fill="#F0C27E" stroke="${INK}" stroke-width="6"/><rect x="48" y="114" width="194" height="20" rx="8" fill="#F8D9A2"/><rect x="115" y="150" width="60" height="16" rx="8" fill="#FFD93D" stroke="${INK}" stroke-width="5"/></g>` +
  R(30, 210, 30, 16, 5, '#8C5A2B') + R(230, 210, 30, 16, 5, '#8C5A2B'))

export const _art = { bgSvg, flourArt, jamArt, crumbsArt, dirtyPlateHtml, binArt, peelArt, wrapperArt, shellArt, chestArt }

// ───────────────────────── уровень ─────────────────────────
const ART = {
  plate: { name: 'plate2', w: 170, h: 78 },
  mug: { name: 'cup', w: 100, h: 100 },
  spoon: { name: 'spoon', w: 40, h: 148 },
}
const ROW_Y = 912
const ROW = { plate: [290, 470, 650], mug: [830, 950], spoon: [1070, 1150] }

export default defineLevel({
  id: 'clean-up',
  async run(k) {
    k.bg(bgSvg())
    const pyx = k.pyx({ x: 150, y: 716, size: 300 })
    guardEmotes(k, pyx)
    const chest = k.prop(chestArt(), 800, 548, 290, 230, { z: 6 })
    // значки-подсказки «что куда»
    const chips = [
      k.prop(chipHtml(food('plate2'), '#62C6FF'), 172, 326, 96, 96, { z: 30 }),
      k.prop(chipHtml(food('cup'), '#FF8FC8'), 1176, 236, 96, 96, { z: 30 }),
      k.prop(chipHtml(food('spoon'), '#FFD93D'), 800, 412, 96, 96, { z: 30 }),
    ]
    k.gsap.set(chips, { scale: 0, opacity: 0 })
    const rand = (a, b) => k.rand(a, b)
    const foamTint = () => k.pick(['#DDF1FF', '#FFE3F1', '#E4F8E0', '#EEF3FF'])

    await k.wait(300)
    await k.tell(pyx, 'hello', 'wave')

    // ═════════ 0. Хапчик чихнул мукой ═════════
    const hap = k.guest('hapchik', 1800, 420, { size: 240, z: 30 })
    guardEmotes(k, hap)
    await hap.moveTo({ x: 800, y: 700 }, { duration: 1.3, hop: false })
    hap.emote('wave')
    await k.tell(hap, 'hap_hi')
    k.sfx('sneeze')
    hap.emote('surprised')
    const hc = k.centerOf(hap.el)
    for (let i = 0; i < 16; i++) {
      const p = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#fff;box-shadow:0 0 0 4px #E4DDF2"></div>', hc.x, hc.y, 60, 60, { z: 35 })
      k.fromTo(p, { scale: 0.3, opacity: 0.95 }, { scale: rand(1.5, 3.6), x: rand(-520, 520), y: rand(-60, 260), opacity: 0, duration: 1.4, ease: 'power2.out', onComplete: () => p.remove() })
    }
    k.to(k.world, { x: '+=6', duration: 0.05, yoyo: true, repeat: 7, ease: 'none' })
    // пятна: мука, варенье, крошки
    const mkStain = (art, x, y, w, h, delay) => {
      const el = k.prop(art(), x, y, w, h, { z: 9 })
      k.fromTo(el, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, delay, ease: 'back.out(2)' })
      k.after(delay * 1000, () => k.sfx('pop'))
      return el
    }
    const stains = [mkStain(flourArt, 390, 782, 320, 130, 0.5), mkStain(jamArt, 700, 838, 230, 110, 0.8), mkStain(crumbsArt, 880, 716, 270, 120, 1.1)]
    await k.wait(1400)
    // Хапчик убегает за платочком
    hap.moveTo({ x: 1820, y: 480 }, { duration: 1.2, hop: false })
    await k.tell(pyx, 'flour', 'surprised')

    // ═════════ 1. протираем пятна губкой ═════════
    const sponge = k.food('sponge', 330, 740, 170, { z: 45 })
    k.fromTo(sponge, { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' })
    k.sfx('pop')
    const follow = (el, pos, extra = {}) => {
      const s = k.centerOf(el)
      k.to(el, { x: `+=${pos.x - s.x}`, y: `+=${pos.y - s.y}`, duration: 0.1, overwrite: 'auto', ...extra })
    }
    for (let i = 0; i < stains.length; i++) {
      const st = stains[i]
      await k.scrub(st, {
        need: 520, sfx: 'scrub', prompt: i === 0 ? k.key('q_wipe') : null, host: pyx,
        onStart: pt => follow(sponge, pt),
        onProgress: (p, pos) => {
          follow(sponge, pos, { rotation: Math.sin(p * 60) * 12 })
          k.gsap.set(st, { opacity: 1 - p * 0.92, scale: 1 - p * 0.15 })
          if (Math.random() < 0.25) k.sparkle(pos.x + rand(-40, 40), pos.y + rand(-20, 20), 1)
        },
      })
      k.to(st, { opacity: 0, scale: 0.7, duration: 0.25, onComplete: () => st.remove() })
      k.sparkle(k.centerOf(st).x, k.centerOf(st).y, 6)
      k.sfx('ding', { vol: 0.5 })
    }
    k.to(sponge, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'power2.inOut' })
    await k.tell(pyx, 'wipe_ok', 'cheer')

    // ═════════ 2. моем тарелки в раковине ═════════
    const mk = (type, cx, cy, o = {}) => {
      const a = ART[type]
      const W = Math.max(a.w + 44, 150), H = Math.max(a.h + 44, 150)
      const el = k.prop(`<div style="position:absolute;left:${(W - a.w) / 2}px;top:${(H - a.h) / 2}px;width:${a.w}px;height:${a.h}px">${food(a.name)}</div>`, cx, cy, W, H, { z: 20 })
      el.dataset.dish = type
      return el
    }
    const dishes = []
    for (let i = 0; i < 3; i++) {
      const plate = k.prop(dirtyPlateHtml(), 1200, 660, 320, 147, { z: 22 })
      k.fromTo(plate, { scale: 0, y: -60 }, { scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)' })
      k.sfx('pop')
      await k.wait(500)
      const foams = []
      const spots = [...plate.querySelectorAll('.d')]
      let lastFoam = null
      await k.scrub(plate, {
        need: 640, sfx: 'scrub', prompt: i === 0 ? k.key('q_wash') : null, host: pyx,
        onStart: pt => follow(sponge, pt),
        onProgress: (p, pos) => {
          follow(sponge, pos, { rotation: Math.sin(p * 70) * 14 })
          const target = Math.floor(p * 16)
          if (!lastFoam || Math.hypot(pos.x - lastFoam.x, pos.y - lastFoam.y) > 30) {
            const s = rand(40, 72)
            const f = k.prop(foamSvg(foamTint()), Math.max(1070, Math.min(1330, pos.x)), Math.max(620, Math.min(705, pos.y)), s, s, { z: 24 })
            k.fromTo(f, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(2.4)' })
            foams.push(f); lastFoam = pos
            if (foams.length % 3 === 0) k.sfx('bloop', { vol: 0.5 })
          }
          while (foams.length < target) {
            const s = rand(40, 72)
            const f = k.prop(foamSvg(foamTint()), rand(1090, 1310), rand(625, 700), s, s, { z: 24 })
            k.fromTo(f, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(2.4)' })
            foams.push(f)
          }
          spots.forEach((d, j) => { k.gsap.set(d, { opacity: Math.max(0, 1 - Math.max(0, p * spots.length - j) * 1.1) }) })
        },
      })
      // пена лопается, тарелка чистая и едет на полотенце
      k.sfx('ding', { vol: 0.5 })
      foams.forEach((f, j) => k.to(f, { scale: 1.5, opacity: 0, duration: 0.25, delay: j * 0.02, onComplete: () => f.remove() }))
      spots.forEach(d => k.gsap.set(d, { opacity: 0 }))
      k.sparkle(1200, 660, 6)
      k.sayNumber(i + 1)
      const cs = k.centerOf(plate)
      await k.play(k.gsap.to(plate, { x: `+=${ROW.plate[i] - cs.x}`, y: `+=${ROW_Y - cs.y}`, scale: ART.plate.w / 320, duration: 0.6, ease: 'power2.inOut' }))
      plate.remove()
      dishes.push(mk('plate', ROW.plate[i], ROW_Y))
      if (i === 0) await k.tell(pyx, 'wash_ok', 'happy')
    }
    k.to(sponge, { opacity: 0, scale: 0, duration: 0.3 })
    // кружки и ложки — тоже вымыты
    const mugs = ROW.mug.map(x => mk('mug', x, ROW_Y)), spoons = ROW.spoon.map(x => mk('spoon', x, ROW_Y - 8))
    k.fromTo([...mugs, ...spoons], { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' })
    k.sfx('whoosh')
    await k.tell(pyx, 'wash_done', 'cheer')

    // ═════════ 3. посуду по местам ═════════
    k.popIn(chips, 0.15)
    const zoneStack = k.prop('', 300, 350, 300, 190, { z: 8 })
    const zoneRail = k.prop('', 1320, 380, 420, 200, { z: 8 })
    const zoneChest = k.prop('', 800, 550, 300, 210, { z: 8 })
    const items = [
      ...dishes.map((el, i) => ({ el, id: `p${i}`, type: 'plate' })),
      ...mugs.map((el, i) => ({ el, id: `m${i}`, type: 'mug' })),
      ...spoons.map((el, i) => ({ el, id: `s${i}`, type: 'spoon' })),
    ]
    const zones = [{ el: zoneStack, id: 'stack', type: 'plate', pad: 30 }, { el: zoneRail, id: 'rail', type: 'mug', pad: 30 }, { el: zoneChest, id: 'chest', type: 'spoon', pad: 30 }]
    const cnt = { plate: 0, mug: 0, spoon: 0 }
    const said = new Set()
    await k.dnd({
      items, zones,
      accept: (it, z) => it.type === z.type,
      prompt: k.key('q_put'), host: pyx,
      onCorrect: async (it, z) => {
        const n = cnt[it.type]++
        const c = k.centerOf(it.el)
        if (it.type === 'plate') {
          const tx = 300, ty = 352 - n * 15
          k.to(it.el, { x: `+=${tx - c.x}`, y: `+=${ty - c.y}`, scale: 0.86, duration: 0.4, ease: 'back.out(1.3)' })
          k.gsap.set(it.el, { zIndex: 21 + n })
        } else if (it.type === 'mug') {
          const tx = [1216, 1326][n], ty = 396
          k.to(it.el, { x: `+=${tx - c.x}`, y: `+=${ty - c.y}`, scale: 0.9, duration: 0.4, ease: 'back.out(1.3)' })
          k.to(it.el, { rotation: 8, duration: 0.3, delay: 0.4, yoyo: true, repeat: 3, ease: 'sine.inOut' })
        } else {
          const drawer = chest.querySelector('.drawer'), slot = chest.querySelector('.slot')
          k.to(it.el, { x: `+=${800 - c.x}`, y: `+=${490 - c.y}`, scale: 0.5, rotation: 90, duration: 0.35, ease: 'power2.out' })
          if (n === 0) { k.to(drawer, { y: 20, duration: 0.3 }); k.to(slot, { opacity: 0.9, duration: 0.2 }) }
          k.after(300, () => { k.to(it.el, { opacity: 0, scale: 0.2, y: '+=40', duration: 0.25 }); k.sfx('clonk') })
          if (n === 1) k.after(700, () => { k.to(drawer, { y: 0, duration: 0.3 }); k.to(slot, { opacity: 0, duration: 0.2 }) })
        }
        k.sparkle(k.centerOf(it.el).x, k.centerOf(it.el).y - 20, 3)
        await k.wait(450)
        if (!said.has(it.type)) { said.add(it.type); await k.tell(pyx, `put_${it.type}`, 'nod') }
      },
      onWrong: async (it, z) => {
        if (!z) return
        const good = zones.find(q => q.type === it.type)
        const stop = k.fx.pulse(good.el, '#FFFFFF'); k.after(3500, stop)
        await k.tell(pyx, `w_${it.type}`, 'shake')
      },
    })
    k.to(chips, { scale: 0, opacity: 0, duration: 0.3, stagger: 0.05 })
    k.burst(700, 500, 10)
    await k.tell(pyx, 'put_done', 'cheer')

    // ═════════ 4. мусор — в ведро ═════════
    const bin = k.prop(binArt(), 1508, 810, 200, 270, { z: 14 })
    k.fromTo(bin, { x: 300, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' })
    k.sfx('whoosh')
    const trashDefs = [[peelArt, 470, 790, 170, 113], [wrapperArt, 720, 750, 150, 103], [shellArt, 930, 835, 140, 103]]
    const trash = trashDefs.map(([art, x, y, w, h]) => {
      const W = Math.max(w + 30, 150), H = Math.max(h + 30, 150)
      const el = k.prop(`<div style="position:absolute;left:${(W - w) / 2}px;top:${(H - h) / 2}px;width:${w}px;height:${h}px">${art()}</div>`, x, y, W, H, { z: 20 })
      el.dataset.trash = 1
      return { el, id: art.name }
    })
    k.fromTo(trash.map(t => t.el), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.12, ease: 'back.out(2)' })
    await k.wait(900)
    const zoneBin = k.prop('', 1508, 790, 240, 320, { z: 8 })
    let trashSaid = false
    await k.dnd({
      items: trash, zones: [{ el: zoneBin, id: 'bin', pad: 40 }],
      accept: () => true,
      prompt: k.key('q_trash'), host: pyx,
      onCorrect: async it => {
        const c = k.centerOf(it.el)
        await k.play(k.gsap.to(it.el, { x: `+=${1508 - c.x}`, y: `+=${716 - c.y}`, scale: 0.5, rotation: 20, duration: 0.4, ease: 'power2.in' }))
        k.to(it.el, { y: '+=70', opacity: 0, scale: 0.2, duration: 0.25 })
        k.sfx('clonk')
        k.to(bin, { scaleY: 0.94, scaleX: 1.04, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: '50% 100%' })
        if (!trashSaid) { trashSaid = true; await k.tell(pyx, 'trash_ok', 'nod') }
      },
    })

    // ═════════ финал: чистая кухня блестит ═════════
    k.sfx('tada')
    for (let i = 0; i < 12; i++) k.after(i * 110, () => k.sparkle(rand(150, 1450), rand(300, 900), 3))
    await k.tell(pyx, 'done', 'cheer')
    hap.moveTo({ x: 1050, y: 700 }, { duration: 1.2, hop: false })
    await k.wait(1200)
    hap.emote('happy')
    await k.tell(hap, 'hap_sorry')
    await k.narrate('sum')
    await k.tell(pyx, 'bye', 'happy')
    k.burst(800, 420, 14)
  },
})
