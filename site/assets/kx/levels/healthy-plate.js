// «Радужная тарелка» — половина тарелки овощи и фрукты, четверть каша и хлеб, четверть белок; сладкое — «иногда».
// Чухтик хочет полезный обед, Капа считает цвета радуги. Сортировка перетаскиванием в 4 места: три части тарелки и блюдечко «иногда».
import { defineLevel, food, SIZE } from '../lib.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, circlePath, star } from '../art.js'

// ───────────────────────── геометрия ─────────────────────────
const PL = { x: 800, y: 520 }                    // центр тарелки (диаметр 520)
const TRAY_Y = 852
const SAUCER = { x: 1235, y: 672 }
const ZONES = {
  veg: { x: 700, y: 520, w: 220, h: 400 },
  grain: { x: 905, y: 420, w: 210, h: 200 },
  prot: { x: 905, y: 620, w: 210, h: 200 },
  sweet: { x: SAUCER.x, y: SAUCER.y, w: 210, h: 210 },
}
// места для еды на тарелке
const SLOTS = {
  veg: [[676, 398], [756, 404], [668, 505], [758, 508], [676, 618], [756, 612]],
  grain: [[862, 432], [944, 432]],
  prot: [[862, 612], [944, 612]],
  sweet: [[SAUCER.x - 40, SAUCER.y + 8], [SAUCER.x + 40, SAUCER.y + 8], [SAUCER.x, SAUCER.y - 32]],
}
// полосы радуги снаружи внутрь
const BANDS = [
  { id: 'red', col: '#FF5A5F' }, { id: 'orange', col: '#FF9F43' }, { id: 'yellow', col: '#FFD93D' },
  { id: 'green', col: '#6BCB77' }, { id: 'blue', col: '#4D96FF' }, { id: 'purple', col: '#B388EB' },
]
const BAND_W = 22, R_OUT = 382

// ───────────────────────── картинки ─────────────────────────
const blueberries = () => {
  const b = (x, y, r) => S(circlePath(x, y, r), '#5B7CFA', '#3E58D0') + `<g transform="translate(${x} ${y - r * 0.55})">${P(star(0, 0, r * 0.42, r * 0.2, 5), '#3A4BB0', { sw: 3 })}</g>` + HL(x - r * 0.35, y - r * 0.1, r * 0.22, r * 0.12, -30, 0.6)
  return svg(140, 130, SH(70, 122, 46, 5) + b(44, 84, 30) + b(96, 84, 30) + b(70, 46, 30) + b(70, 92, 28) + P('M70 20Q84 4 104 12Q92 28 72 24Z', '#6BCB77', { sw: 4 }))
}
const fishArt = () => svg(200, 130,
  SH(100, 124, 80, 5) +
  S('M22 64C48 14 132 14 162 52L196 24L188 64L196 104L162 78C132 114 48 114 22 64Z', '#79B8F0', '#4F98DC') +
  F('M36 76C60 100 120 104 156 74C130 90 70 92 36 76Z', '#DDEFFF') +
  P('M84 22L100 4L118 26', '#4F98DC', { sw: 4.5 }) + P('M96 96L110 116L124 96', '#4F98DC', { sw: 4.5 }) +
  L('M56 40Q48 64 58 88', INK, 4.5) +
  C(44, 58, 9, '#fff', { sw: 3.5 }) + C(42, 58, 4.4, INK, { sw: 0 }) +
  `<g fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".7"><path d="M84 46Q92 52 84 60M104 44Q112 52 104 62M124 46Q132 54 124 64"/></g>` +
  P('M30 72Q42 80 52 76', 'none', { sw: 4 }) + HL(80, 34, 22, 5, -8, 0.5))
const porridgeArt = () => svg(170, 134,
  SH(85, 128, 64, 5) +
  E(85, 58, 70, 30, '#F3DCA8') +
  `<g fill="#E6C77F">${[[52, 52], [78, 44], [104, 52], [66, 64], [96, 66], [120, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join('')}</g>` +
  S('M12 60Q14 62 20 66Q26 112 60 122H110Q144 112 150 66Q156 62 158 60Q85 84 12 60Z', '#FFFFFF', '#CFE1F5') +
  P('M18 78Q85 100 152 78', 'none', { sw: 0 }) + F('M20 84Q85 106 150 84L146 96Q85 118 24 96Z', '#62C6FF') +
  E(85, 58, 72, 32, 'none') + C(70, 40, 9, '#FF5A5F', { sw: 4 }) + C(98, 38, 9, '#FF5A5F', { sw: 4 }) + HL(66, 36, 3, 2, 0, 0.9))
const cookieArt = () => svg(124, 124,
  SH(62, 118, 46, 5) + S(circlePath(62, 60, 50), '#DDA862', '#B97F3B') +
  [[42, 44, 6], [78, 40, 6], [56, 68, 6.5], [84, 72, 6], [40, 82, 5.5], [70, 92, 5]].map(([x, y, r]) => C(x, y, r, '#6B4526', { sw: 0 })).join('') + HL(38, 30, 12, 5, -35, 0.5))
const cakeArt = () => svg(160, 140,
  SH(80, 134, 68, 5) +
  S('M14 104L14 56L146 34L146 104Q146 118 132 118L28 118Q14 118 14 104Z', '#FFE3B8', '#EBC286') +
  F('M14 72L146 52L146 70L14 90Z', '#FFFFFF') + F('M14 90L146 70L146 78L14 98Z', '#FF9EC5', 'opacity=".9"') +
  P('M14 56L146 34L146 46Q120 60 100 50Q80 66 56 52Q34 66 14 58Z', '#FF9EC5', { sw: 5 }) +
  C(80, 32, 12, '#FF3B3B', { sw: 4 }) + L('M80 22Q82 10 94 6', '#3E8E5B', 4.5) + HL(76, 28, 3, 2, 0, 0.9))
const iceArt = () => svg(120, 200,
  SH(60, 194, 30, 4) +
  S('M24 88L60 190L96 88Z', '#EDB874', '#C98F55', { extra: '<path d="M30 100L86 150M42 92L92 132M32 128L70 176M56 92L30 140M78 92L44 176M92 106L58 186" stroke="#B9814A" stroke-width="3.5" opacity=".7"/>' }) +
  S(circlePath(60, 74, 40), '#FF9EC5', '#E877A6') + P('M22 84Q28 100 36 88Q44 104 52 90Q62 106 68 90Q78 104 86 88Q94 100 98 84', 'none', { sw: 0 }) +
  S(circlePath(60, 40, 32), '#FFF3D6', '#EBD3A0') + C(60, 8, 10, '#FF3B3B', { sw: 4 }) + HL(46, 32, 8, 4, -30, 0.7) + HL(42, 68, 8, 4, -30, 0.6))

// id → { cat, w — ширина картинки в ячейке 150, rot, art }
const ITEM = {
  tomato: { cat: 'veg', w: 122, art: () => food('tomato'), size: SIZE.tomato },
  carrot: { cat: 'veg', w: 176, rot: -30, art: () => food('carrot'), size: SIZE.carrot },
  banana: { cat: 'veg', w: 146, art: () => food('banana'), size: SIZE.banana },
  broccoli: { cat: 'veg', w: 116, art: () => food('broccoli'), size: SIZE.broccoli },
  blueberry: { cat: 'veg', w: 112, art: blueberries, size: [140, 130] },
  grapes: { cat: 'veg', w: 98, art: () => food('grapes'), size: SIZE.grapes },
  cookie: { cat: 'sweet', w: 112, art: cookieArt, size: [124, 124] },
  bread: { cat: 'grain', w: 122, art: () => food('breadSlice'), size: SIZE.breadSlice },
  porridge: { cat: 'grain', w: 132, art: porridgeArt, size: [170, 134] },
  egg: { cat: 'prot', w: 84, art: () => food('egg'), size: SIZE.egg },
  fish: { cat: 'prot', w: 150, art: fishArt, size: [200, 130] },
  cake: { cat: 'sweet', w: 128, art: cakeArt, size: [160, 140] },
  ice: { cat: 'sweet', w: 76, art: iceArt, size: [120, 200] },
}
const COLOR_OF = { tomato: 'red', carrot: 'orange', banana: 'yellow', broccoli: 'green', blueberry: 'blue', grapes: 'purple' }
const ratio = id => ITEM[id].size[1] / ITEM[id].size[0]
/** картинка по центру ячейки box×box */
const inner = (id, box = 150) => {
  const p = ITEM[id], w = p.w * (box / 150), h = w * ratio(id)
  return `<div style="position:absolute;left:${(box - w) / 2}px;top:${(box - h) / 2}px;width:${w}px;height:${h}px;${p.rot ? `transform:rotate(${p.rot}deg);` : ''}">${p.art()}</div>`
}
const extent = id => { const p = ITEM[id], h = p.w * ratio(id); return p.rot ? p.w * 0.85 : Math.max(p.w, h) }

// ───────────────────────── фон, тарелка, радуга ─────────────────────────
const bgArt = () => {
  let v = '', h = ''
  for (let i = 0; i < 17; i++) if (i % 2) v += `<rect x="${i * 100 - 50}" y="-10" width="100" height="1020" fill="#FF8FC8" opacity=".16"/>`
  for (let i = 0; i < 11; i++) if (i % 2) h += `<rect x="-10" y="${i * 100 - 50}" width="1620" height="100" fill="#FF8FC8" opacity=".16"/>`
  return svg(1600, 1000, `<rect x="-10" y="-10" width="1620" height="1020" fill="#FFF8E8"/>${v}${h}` +
    // деревянная доска для продуктов
    `<g>${SH(800, 942, 470, 12, 0.14)}${R(340, 766, 920, 172, 46, '#E9B571', { sw: 6 })}${R(356, 780, 888, 144, 36, '#F2C892', { sw: 0 })}` +
    `<path d="M380 820Q800 806 1220 822M380 866Q800 878 1220 862M380 900Q800 892 1220 904" fill="none" stroke="#D89B58" stroke-width="4" stroke-linecap="round" opacity=".5"/>${C(1222, 852, 14, '#E9B571', { sw: 4 })}</g>`)
}
const plateArt = () => {
  const R0 = 205
  const sec = (cls, d, fill) => `<path class="sec ${cls}" d="${d}" fill="${fill}"/>`
  return svg(520, 520,
    E(262, 274, 250, 236, '#000', { sw: 0, attr: 'opacity=".12"' }) +
    S(circlePath(260, 260, 250), '#FFFFFF', '#D5E2F2') +
    C(260, 260, 214, '#F4F9FF', { sw: 4, ink: '#C9D8EA' }) +
    sec('sec-veg', `M260 ${260 - R0}A${R0} ${R0} 0 0 0 260 ${260 + R0}Z`, '#E4F7DA') +
    sec('sec-grain', `M260 260L260 ${260 - R0}A${R0} ${R0} 0 0 1 ${260 + R0} 260Z`, '#FFF0C9') +
    sec('sec-prot', `M260 260L${260 + R0} 260A${R0} ${R0} 0 0 1 260 ${260 + R0}Z`, '#FFDCE0') +
    `<path d="M260 ${260 - R0}V${260 + R0}M260 260H${260 + R0}" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity=".45"/>` +
    C(260, 260, R0, 'none', { sw: 5, ink: '#B7A7D6' }) +
    `<g opacity=".38" font-size="74" text-anchor="middle"><text class="ghost ghost-veg" x="150" y="292">🥦</text><text class="ghost ghost-grain" x="366" y="184" font-size="58">🌾</text><text class="ghost ghost-prot" x="366" y="398" font-size="58">🥚</text></g>` +
    HL(110, 92, 40, 10, -40, 0.7))
}
const saucerArt = () => svg(220, 220,
  SH(110, 200, 92, 8, 0.14) + S(circlePath(110, 108, 100), '#FFFFFF', '#F6C9E1') +
  Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return C(110 + Math.cos(a) * 92, 108 + Math.sin(a) * 92, 8, '#FF8FC8', { sw: 0 }) }).join('') +
  C(110, 108, 76, '#FFF4FA', { sw: 4, ink: '#F3A9CE' }) + `<text x="110" y="126" font-size="64" text-anchor="middle" opacity=".32">🎉</text>`)

const rainbowArt = () => {
  const cx = 400, cy = 400
  const rOf = i => R_OUT - BAND_W / 2 - i * BAND_W
  const outer = R_OUT, inner = R_OUT - BANDS.length * BAND_W
  const ring = `M${cx - outer} ${cy}A${outer} ${outer} 0 0 1 ${cx + outer} ${cy}L${cx + inner} ${cy}A${inner} ${inner} 0 0 0 ${cx - inner} ${cy}Z`
  const bands = BANDS.map((b, i) => {
    const r = rOf(i), len = Math.PI * r
    return `<path class="band band-${b.id}" d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${b.col}" stroke-width="${BAND_W + 0.5}" stroke-dasharray="${len.toFixed(1)}" stroke-dashoffset="${len.toFixed(1)}" style="opacity:0"/>`
  }).join('')
  const cloud = x => `<g transform="translate(${x} ${cy - 10})">${[[-34, 6, 26], [-6, -12, 34], [30, 4, 28], [4, 14, 30]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r + 3}" fill="${INK}"/>`).join('')}${[[-34, 6, 26], [-6, -12, 34], [30, 4, 28], [4, 14, 30]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="#fff"/>`).join('')}</g>`
  return svg(800, 420,
    `<path class="ring" d="${ring}" fill="#fff" fill-opacity=".55" stroke="#B7A7D6" stroke-width="5" stroke-dasharray="14 12" stroke-linejoin="round"/>` + bands + cloud(cx - (outer + inner) / 2) + cloud(cx + (outer + inner) / 2))
}


export default defineLevel({
  id: 'healthy-plate',
  async run(k) {
    const gs = k.gsap
    k.bg(bgArt())
    const rainbow = k.prop(rainbowArt(), PL.x, PL.y - 190, 800, 420, { z: 2 })
    const plate = k.prop(plateArt(), PL.x, PL.y, 520, 520, { z: 4 })
    const saucer = k.prop(saucerArt(), SAUCER.x, SAUCER.y, 220, 220, { z: 4 })
    gs.set([plate, saucer, rainbow], { scale: 0, opacity: 0 })
    const zoneEls = {}
    for (const [id, z] of Object.entries(ZONES)) { zoneEls[id] = k.prop('', z.x, z.y, z.w, z.h, { z: 1 }); zoneEls[id].style.pointerEvents = 'none' }
    const bandEl = id => rainbow.querySelector(`.band-${id}`)
    const sec = id => plate.querySelector(`.sec-${id}`)

    const kapa = k.guest('kapa', 170, 800, { size: 250 })
    const chukh = k.guest('chukh', 1900, 800, { size: 250, face: 'left' })
    const say = (who, id, emote) => k.tell(who, id, emote)

    /** подсветка части тарелки */
    const flash = (id, col) => {
      if (id === 'sweet') { k.fromTo(saucer, { scale: 1 }, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' }); return }
      const base = { veg: '#E4F7DA', grain: '#FFF0C9', prot: '#FFDCE0' }[id]
      gs.fromTo(sec(id), { fill: col }, { fill: base, duration: 0.5, delay: 0.1, repeat: 3, yoyo: true, ease: 'sine.inOut' })
      gs.set(sec(id), { fill: base, delay: 2.4 })
    }
    const growBand = async colorId => {
      const el = bandEl(colorId)
      k.sfx('magic', { vol: 0.5 })
      gs.set(el, { opacity: 1 })
      await k.play(gs.to(el, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }))
    }

    // ── подача товаров ──
    const tray = ids => {
      const step = Math.min(140, Math.floor(800 / ids.length)), x0 = 800 - (ids.length - 1) * step / 2
      const items = ids.map((id, i) => {
        const el = k.prop(inner(id), x0 + i * step, TRAY_Y, 150, 150, { z: 6, cls: 'kx-food' })
        el.dataset.food = id
        return { id, cat: ITEM[id].cat, el }
      })
      k.fromTo(items.map(i => i.el), { y: 260, opacity: 0, scale: 0.4 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.09, ease: 'back.out(1.6)' })
      k.sfx('swish')
      return items
    }
    const used = { veg: 0, grain: 0, prot: 0, sweet: 0 }
    const placed = []
    const said = new Set()

    const sort = async (ids, o) => {
      const items = tray(ids)
      await k.wait(ids.length * 90 + 600)
      let wrong = 0
      await k.dnd({
        items, zones: Object.entries(ZONES).map(([id, z]) => ({ id, el: zoneEls[id], pad: id === 'sweet' ? 30 : 8 })),
        accept: (it, z) => it.cat === z.id,
        prompt: o.prompt ? k.key(o.prompt) : null, host: chukh,
        onCorrect: async (it, z) => {
          const slot = SLOTS[z.id][used[z.id]++]
          it.el.style.zIndex = '7'
          const c = k.centerOf(it.el)
          const sc = Math.max(0.5, Math.min(0.85, 96 / extent(it.id)))
          placed.push(it)
          k.sfx('plop')
          await k.play(gs.to(it.el, { x: `+=${slot[0] - c.x}`, y: `+=${slot[1] - c.y}`, scale: sc, rotation: (used[z.id] % 2 ? -5 : 6) + (ITEM[it.id].rot ? 0 : 0), duration: 0.5, ease: 'back.out(1.5)', overwrite: 'auto' }))
          k.sparkle(slot[0], slot[1], 4)
          const gh = plate.querySelector(`.ghost-${z.id}`)
          if (gh) gs.to(gh, { opacity: 0, duration: 0.4 })
          if (z.id === 'veg') {
            growBand(COLOR_OF[it.id])
            await say(kapa, `c_${it.id}`, 'happy')
          } else if (z.id === 'sweet') {
            if (!said.has('sweet')) { said.add('sweet'); await say(chukh, o.sweetLine ?? 'sweet_first', 'nod') }
            else { await say(chukh, 'ok_sweet', 'nod') }
          } else if (z.id === 'grain' && !said.has('grain')) { said.add('grain'); await say(kapa, 'ok_grain', 'nod') }
          else if (z.id === 'prot' && !said.has('prot')) { said.add('prot'); await say(kapa, 'ok_prot', 'nod') }
          else await k.praise(chukh)
        },
        onWrong: async (it, z) => {
          wrong++
          k.sfx('wrong', { vol: 0.5 })
          gs.fromTo(it.el, { rotation: -8 }, { rotation: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' })
          flash(it.cat, '#FFFFFF')
          await say(chukh, `w_${it.cat}`, it.cat === 'sweet' ? 'laugh' : 'shake')
        },
      })
    }

    // ══════════════ 0. Знакомство ══════════════
    await k.wait(300)
    k.sfx('whoosh')
    const arrive = chukh.moveTo({ x: 1440, y: 800 }, { duration: 2, hop: false })
    chukh.emote('special')
    await arrive
    chukh.face('left')
    await say(chukh, 'chukh_hi', 'wave')
    await say(kapa, 'kapa_hi', 'happy')
    k.sfx('pop')
    k.to([plate, saucer, rainbow], { scale: 1, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.5)' })
    await k.wait(900)
    await say(kapa, 'plate1', 'point')
    flash('veg', '#8BE37A'); await say(kapa, 'plate2', 'point')
    flash('grain', '#FFD86E'); await say(kapa, 'plate3', 'point')
    flash('prot', '#FF9FAE'); await say(kapa, 'plate4', 'point')
    flash('sweet'); await say(chukh, 'plate5', 'nod')

    // ══════════════ 1. Овощи и фрукты + первое печенье ══════════════
    await sort(k.shuffle(['tomato', 'carrot', 'banana', 'broccoli', 'blueberry', 'grapes', 'cookie']), { prompt: 'q_veg' })
    k.burst(PL.x, 330, 10)
    gs.to(rainbow.querySelector('.ring'), { opacity: 0, duration: 0.6 })
    await say(kapa, 'rainbow', 'cheer')
    for (let i = 0; i < BANDS.length; i++) {
      const b = bandEl(BANDS[i].id)
      k.fromTo(b, { attr: { 'stroke-width': BAND_W + 0.5 } }, { attr: { 'stroke-width': BAND_W + 12 }, duration: 0.22, yoyo: true, repeat: 1 })
      await k.sayNumber(i + 1, kapa)
    }
    await say(kapa, 'rainbow2', 'point')
    await k.praise(chukh)

    // ══════════════ 2. Каша, хлеб, белок и сладкое ══════════════
    await say(chukh, 'more', 'happy')
    await sort(k.shuffle(['bread', 'porridge', 'egg', 'fish', 'cake', 'ice']), { prompt: 'q_rest' })
    k.burst(PL.x, 520, 12)

    // ══════════════ 3. Чухтик обедает ══════════════
    const cc = k.centerOf(chukh.el)
    const mouth = { x: cc.x - 50, y: cc.y - 30 }
    const foodEls = placed.filter(p => p.cat !== 'sweet').map(p => p.el)
    k.sfx('whoosh')
    await k.play(gs.to(foodEls, { x: `+=${mouth.x - PL.x}`, y: `+=${mouth.y - PL.y}`, scale: 0.12, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power2.in' }))
    k.sfx('yum')
    await say(chukh, 'eat', 'jump')
    k.burst(PL.x, 400, 12)
    await say(kapa, 'sum1', 'point'); flash('veg', '#8BE37A')
    await say(kapa, 'sum2', 'nod'); flash('grain', '#FFD86E'); flash('prot', '#FF9FAE')
    await say(chukh, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
