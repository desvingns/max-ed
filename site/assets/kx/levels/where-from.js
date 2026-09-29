// «Откуда еда?» — продукты и их «родные места»: ферма, огород, поле, река. Чухтик везёт продукты в лавку.
// Механика: k.dnd (жетон продукта → место, где он берётся), два раунда по 4 продукта, счёт в вагончике.
import { defineLevel, food, SIZE } from '../lib.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, nid, circlePath, ellipsePath, star, mix, darker, lighter } from '../art.js'

const G = { base: '#6BCB77', shade: '#45B57C', dark: '#2E8F5B', light: '#A5E39B' }
const BR = { base: '#C68B59', shade: '#A26B3B', light: '#E2B78A' }
const RED = { base: '#FF5A5F', shade: '#E0474C', light: '#FF9A9A' }

// ───────────────────────── рисуем сами (в стиле food.js) ─────────────────────────
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`

const shapeEls = (shapes, attr) => shapes.map(s => (s.length === 3
  ? `<circle cx="${s[0]}" cy="${s[1]}" r="${s[2]}" ${attr}/>`
  : `<rect x="${s[0]}" y="${s[1]}" width="${s[2]}" height="${s[3]}" rx="${s[4]}" ${attr}/>`)).join('')

/** «Пушистая» фигура из кругов/скруглённых прямоугольников: общий контур, тень полумесяцем. */
function blob(shapes, base, shade, o = {}) {
  const id = nid('b'), sw = o.sw ?? 5, off = o.off ?? [-10, -12]
  return `<g><g>${shapeEls(shapes, `fill="${INK}" stroke="${INK}" stroke-width="${sw * 2}" stroke-linejoin="round"`)}</g>
    <clipPath id="${id}">${shapeEls(shapes, '')}</clipPath>
    <g clip-path="url(#${id})">${shapeEls(shapes, `fill="${shade}"`)}<g transform="translate(${off[0]} ${off[1]})">${shapeEls(shapes, `fill="${base}"`)}</g>${o.inner ?? ''}</g>${o.extra ?? ''}</g>`
}

const cloudTray = () => svg(1000, 210, blob([[110, 132, 62], [220, 104, 80], [350, 86, 92], [500, 76, 100], [650, 86, 94], [780, 102, 84], [890, 130, 66], [60, 118, 880, 74, 37]], '#FFFFFF', '#D3E6F8', { off: [-6, -14] }))

function apple() {
  return `<g>${P('M0 -16C10 -24 30 -20 32 0C34 22 14 34 0 32C-14 34 -34 22 -32 0C-30 -20 -10 -24 0 -16Z', RED.base, { sw: 4 })}${L('M0 -16Q0 -28 8 -34', BR.shade, 4)}${P('M4 -26Q18 -36 28 -30Q18 -20 6 -22Z', G.base, { sw: 3 })}${HL(-14, -2, 5, 9, 20, 0.6)}</g>`
}

function appleTree() {
  const canopy = blob([[230, 150, 105], [135, 215, 85], [325, 215, 88], [230, 240, 100], [172, 112, 68], [292, 108, 70]], '#6BCB77', '#3FA86A', {
    inner: `<circle cx="180" cy="90" r="10" fill="#A5E39B" opacity=".7"/><circle cx="110" cy="200" r="8" fill="#A5E39B" opacity=".6"/>`,
  })
  const spots = [[150, 205], [305, 170], [235, 275], [335, 262], [195, 132], [262, 118]]
  const apples = spots.map(([x, y]) => `<g transform="translate(${x} ${y}) scale(.72)">${apple()}</g>`).join('')
  const trunk = S('M196 528Q210 420 190 300L270 300Q252 420 268 528Z', BR.base, BR.shade, { off: [-14, 0] })
  return svg(460, 540, SH(230, 530, 150, 11) + trunk + `<g class="canopy">${canopy}${apples}</g>`)
}

function hive() {
  const tier = (x, y, w, h, i) => S(rr(x, y, w, h, 16), i % 2 ? '#FFC933' : '#FFD84D', i % 2 ? '#EE9F1B' : '#F2B824')
  const stripes = [[60, 306, 240], [72, 240, 228], [86, 176, 214], [104, 118, 196]].map(([x1, y, x2]) => L(`M${x1} ${y}H${x2}`, '#C98A12', 4, 'opacity=".55"')).join('')
  return svg(300, 380,
    SH(150, 374, 120, 9) +
    R(18, 338, 264, 28, 10, BR.base) + R(48, 360, 26, 18, 6, BR.shade) + R(226, 360, 26, 18, 6, BR.shade) +
    tier(34, 268, 232, 74, 1) + tier(52, 200, 196, 74, 2) + tier(70, 134, 160, 74, 3) + tier(92, 78, 116, 62, 4) +
    C(150, 66, 17, '#FFC933') +
    P('M112 342Q112 290 150 290Q188 290 188 342Z', '#5B3A1E', { sw: 5 }) +
    P('M90 204V232Q90 246 102 246Q114 246 114 232V204Z', '#FF9F1C', { sw: 4 }) +
    stripes + HL(80, 290, 6, 20, 0, 0.5) + HL(112, 224, 5, 16, 0, 0.5))
}

function bee() {
  return svg(90, 70,
    `<g class="wing">${E(34, 20, 15, 11, '#fff', { sw: 3, rot: -25, attr: 'opacity=".92"' })}${E(56, 16, 15, 11, '#fff', { sw: 3, rot: 20, attr: 'opacity=".92"' })}</g>` +
    S(ellipsePath(45, 42, 30, 22), '#FFD93D', '#F2B824', { extra: `<path d="M36 18Q30 42 36 66M52 18Q46 42 52 66" stroke="${INK}" stroke-width="8" fill="none"/>` }) +
    P('M17 42L3 47L17 51Z', INK, { sw: 3 }) + C(67, 38, 4.5, INK, { sw: 0 }) + L('M62 49Q68 54 73 47', INK, 3))
}

function gardenBed() {
  const leaf = (x, y, a, len, col, w = 9) => `<g transform="translate(${x} ${y}) rotate(${a})">${P(`M0 0Q${-w} ${-len * 0.5} 0 ${-len}Q${w} ${-len * 0.5} 0 0Z`, col, { sw: 3.5 })}</g>`
  const carrotTop = x => `<g>${P(`M${x - 12} 128L${x} 154L${x + 12} 128Z`, '#FF9F43', { sw: 4 })}${leaf(x, 130, -34, 86, G.base)}${leaf(x, 130, 0, 100, G.shade)}${leaf(x, 130, 34, 86, G.base)}</g>`
  const bush = x => `<g>${leaf(x - 8, 132, -52, 60, G.shade, 15)}${leaf(x + 8, 132, 52, 60, G.shade, 15)}${leaf(x - 4, 132, -22, 74, G.base, 16)}${leaf(x + 4, 132, 22, 74, G.base, 16)}${leaf(x, 132, 0, 82, G.shade, 16)}${C(x + 2, 44, 9, '#fff', { sw: 3.5 })}${C(x + 2, 44, 3.6, '#FFD93D', { sw: 0 })}</g>`
  return svg(470, 270,
    SH(235, 268, 220, 10) +
    S('M26 118L444 118L470 232Q470 250 452 250L18 250Q0 250 0 232Z', '#A96B3F', '#87502D', { off: [-10, -10], extra: [150, 186, 222].map(y => L(`M14 ${y}Q235 ${y - 14} 456 ${y}`, '#6E3F21', 5, 'opacity=".45"')).join('') }) +
    [70, 150, 230].map(carrotTop).join('') + [330, 404].map(bush).join('') +
    S(rr(-6, 214, 482, 46, 12), '#E2B078', '#C98F55', { off: [-6, -8], extra: L('M14 236H456', '#B9814A', 4, 'opacity=".5"') }))
}

function wheat() {
  const xs = [34, 82, 128, 176, 224, 270, 318, 364, 412, 446], hs = [150, 190, 130, 200, 160, 210, 140, 185, 150, 120]
  const ear = (x, h, i) => {
    const top = 250 - h
    let grains = ''
    for (let j = 0; j < 5; j++) {
      const y = top + 8 + j * 17
      grains += E(x - 8, y + 4, 6.5, 12, '#F5C542', { sw: 3, rot: 28 }) + E(x + 8, y + 4, 6.5, 12, '#F5C542', { sw: 3, rot: -28 })
    }
    grains += E(x, top - 10, 6.5, 13, '#F5C542', { sw: 3 })
    const awns = `<path d="M${x - 4} ${top - 20}L${x - 10} ${top - 46}M${x} ${top - 22}L${x} ${top - 52}M${x + 4} ${top - 20}L${x + 10} ${top - 46}" stroke="#C99A2E" stroke-width="2.5" stroke-linecap="round"/>`
    return `<g class="ear" data-ox="${x}" data-oy="250">${L(`M${x} 256L${x} ${top}`, '#C99A2E', 6)}${grains}${awns}</g>`
  }
  const flower = (x, y) => `<g>${Array.from({ length: 6 }, (_, i) => E(x + Math.cos(i * 1.047) * 9, y + Math.sin(i * 1.047) * 9, 6, 6, '#62A8FF', { sw: 2.5 })).join('')}${C(x, y, 5, '#FF5A5F', { sw: 2.5 })}${L(`M${x} ${y + 8}V${y + 40}`, G.dark, 4)}</g>`
  return svg(470, 300,
    SH(235, 292, 225, 10) +
    S('M0 224Q0 200 40 200L430 200Q470 200 470 224L470 262Q470 286 440 286L30 286Q0 286 0 262Z', '#F0C660', '#D6A03A', { off: [-10, -10], extra: [228, 252, 272].map(y => L(`M10 ${y}H460`, '#C48F2C', 4, 'opacity=".4"')).join('') }) +
    xs.map((x, i) => ear(x, hs[i], i)).join('') + flower(20, 232) + flower(255, 240) + flower(436, 236))
}

function river() {
  const water = 'M22 120Q80 56 190 84T418 66Q470 96 452 172Q426 262 262 264Q92 282 30 214Q0 164 22 120Z'
  const waves = [[70, 130, 130], [190, 160, 260], [300, 120, 360], [140, 220, 236], [300, 226, 370]].map(([x1, y, x2]) => L(`M${x1} ${y}Q${(x1 + x2) / 2} ${y - 16} ${x2} ${y}`, '#fff', 5, 'opacity=".75"')).join('')
  const reed = x => `${L(`M${x} 100V30`, G.dark, 6)}${P(`M${x - 8} 30Q${x} 4 ${x + 8} 30V62Q${x} 68 ${x - 8} 62Z`, BR.shade, { sw: 4 })}`
  return svg(470, 300,
    SH(235, 292, 200, 9) +
    E(235, 250, 230, 40, '#8FE08A', { sw: 0 }) +
    S(water, '#62C6FF', '#3FA0E8', { off: [-12, -12], extra: `<g class="waves">${waves}</g>` }) +
    reed(26) + reed(54) +
    `<g>${E(350, 190, 40, 22, G.base, { sw: 4 })}<path d="M350 190L392 178" stroke="${INK}" stroke-width="4"/>${C(340, 182, 9, '#FF8FC8', { sw: 3.5 })}</g>`)
}

function fishArt() {
  const body = 'M22 66C46 8 132 4 176 52C176 80 132 128 76 122C46 118 30 92 22 66Z'
  const scales = [[92, 60], [92, 86], [118, 48], [118, 74], [118, 100]].map(([x, y]) => L(`M${x} ${y - 10}Q${x + 12} ${y} ${x} ${y + 10}`, '#2E86C9', 3.5, 'opacity=".6"')).join('')
  return svg(230, 130,
    P('M168 66L222 24Q210 66 222 108Z', '#3B96D6', { sw: 5 }) +
    P('M78 26Q104 -2 138 24Z', '#3B96D6', { sw: 5 }) +
    S(body, '#5AB9F0', '#3B96D6', { off: [-8, -10], extra: `<path d="M20 90Q90 116 176 70L176 130L20 130Z" fill="#C9EBFF"/>${scales}` }) +
    L('M84 38Q98 66 84 96', '#2E86C9', 4) + C(54, 52, 10, '#fff', { sw: 4 }) + C(52, 52, 4.5, INK, { sw: 0 }) + L('M26 76Q36 84 46 78', INK, 4) + HL(70, 30, 26, 6, -10, 0.55))
}

function wagon() {
  // 380×210, «прицеп» справа
  const wheel = x => `<g transform="translate(${x} 176)">${C(0, 0, 32, '#FF5A5F', { sw: 6 })}${C(0, 0, 12, '#FFD93D', { sw: 4 })}${[0, 60, 120].map(a => `<path d="M0 0L${Math.cos((a * Math.PI) / 180) * 26} ${Math.sin((a * Math.PI) / 180) * 26}M0 0L${-Math.cos((a * Math.PI) / 180) * 26} ${-Math.sin((a * Math.PI) / 180) * 26}" stroke="${INK}" stroke-width="3.5"/>`).join('')}</g>`
  const back = SH(190, 206, 150, 8) + P('M30 40L350 40L340 140L40 140Z', BR.shade, { sw: 5 }) + [70, 150, 230, 310].map(x => L(`M${x} 44V136`, '#7B4F2A', 4, 'opacity=".5"')).join('')
  const front = `<g>${S(rr(14, 92, 352, 72, 14), BR.base, BR.shade, { off: [-8, -8], extra: [130, 246].map(x => L(`M${x} 96V160`, '#A26B3B', 4, 'opacity=".6"')).join('') })}${P(rr(6, 82, 368, 24, 10), BR.light, { sw: 5 })}${wheel(92)}${wheel(288)}${R(366, 128, 22, 12, 5, '#8C95B4', { sw: 4 })}</g>`
  return [svg(380, 210, back), svg(380, 210, front)]
}

/** Жетон-продукт: круглая «монетка», её легко ухватить малышу. */
function token(art, w, h, color, fit = 110, rot = 0) {
  const s = Math.min(fit / w, fit / h)
  return `<div style="width:100%;height:100%;border-radius:50%;background:#fff;box-shadow:0 9px 0 rgba(0,0,0,.16),inset 0 0 0 10px ${color};display:grid;place-items:center"><div style="width:${w * s}px;height:${h * s}px;${rot ? `transform:rotate(${rot}deg)` : ''}">${art}</div></div>`
}

function bgFarm() {
  const sky = `<defs><linearGradient id="kxwf-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD3FF"/><stop offset="1" stop-color="#E4F6FF"/></linearGradient><linearGradient id="kxwf-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9BE48F"/><stop offset="1" stop-color="#6FCF7A"/></linearGradient></defs>`
  const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${blob([[0, 20, 34], [38, 0, 44], [84, 14, 36], [-10, 26, 60, 26, 13]], '#FFFFFF', '#DDEBFA', { sw: 4, off: [-4, -8] })}</g>`
  const fence = Array.from({ length: 34 }, (_, i) => `<path d="M${i * 50 - 10} 590V520L${i * 50 + 6} 504L${i * 50 + 22} 520V590Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`).join('')
  const tufts = [[120, 830], [330, 860], [560, 800], [760, 850], [1010, 820], [1180, 862], [1420, 812], [1540, 850], [60, 640], [1560, 680], [700, 650]].map(([x, y]) => `<g>${L(`M${x} ${y}q-6 -22 -16 -28M${x} ${y}q0 -26 2 -34M${x} ${y}q8 -22 18 -26`, '#3FA86A', 5)}</g>`).join('')
  const flowers = [[210, 690, '#FF8FC8'], [640, 860, '#FFD93D'], [1040, 700, '#fff'], [1500, 760, '#FF8FC8'], [400, 850, '#fff'], [1300, 850, '#FFD93D']].map(([x, y, c]) => `<g>${[0, 72, 144, 216, 288].map(a => C(x + Math.cos((a * Math.PI) / 180) * 9, y + Math.sin((a * Math.PI) / 180) * 9, 6.5, c, { sw: 2.5 })).join('')}${C(x, y, 5, '#FFB938', { sw: 2.5 })}</g>`).join('')
  const sleepers = Array.from({ length: 30 }, (_, i) => R(i * 56 - 20, 946, 30, 22, 5, BR.shade, { sw: 3 })).join('')
  return svg(1600, 1000,
    `${sky}<rect x="-10" y="-10" width="1620" height="1020" fill="url(#kxwf-sky)"/>` +
    `<g><circle cx="1440" cy="250" r="86" fill="#FFF2A8" opacity=".55"/>${C(1440, 250, 58, '#FFE066', { sw: 5 })}${HL(1420, 230, 20, 10, -35, 0.6)}</g>` +
    cloud(230, 130, 1.1) + cloud(1180, 330, 0.9) + cloud(120, 380, 0.7) +
    `<path d="M-20 520Q140 400 340 470T700 470T1080 440T1400 470T1640 430V640H-20Z" fill="#B7EBA4" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M-20 560Q220 470 460 540T900 520T1300 550T1640 510V680H-20Z" fill="#9DDF8F" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="-10" y="590" width="1620" height="330" fill="url(#kxwf-grass)"/>` +
    fence + `<rect x="-10" y="590" width="1620" height="12" fill="#5FB86E" opacity=".55"/>` +
    tufts + flowers +
    `<rect x="-10" y="904" width="1620" height="110" fill="#E9CBA0"/><rect x="-10" y="896" width="1620" height="14" fill="#C9A276" stroke="${INK}" stroke-width="4"/>` +
    sleepers + `<rect x="-10" y="934" width="1620" height="14" rx="4" fill="#B8C0CC" stroke="${INK}" stroke-width="5"/><rect x="-10" y="936" width="1620" height="4" fill="#fff" opacity=".7"/>`)
}

// ───────────────────────── уровень ─────────────────────────
export default defineLevel({
  id: 'where-from',
  async run(k) {
    k.bg(bgFarm())
    const gsap = k.gsap
    const TRAIN_Y = 944
    // Чухтик и вагончик (едут вместе)
    const chukh = k.guest('chukh', 1360, TRAIN_Y, { size: 260, z: 11 })
    const [wBack, wFront] = wagon().map((html, i) => k.prop(html, 1072, TRAIN_Y - 104, 320, 177, { z: i ? 12 : 5 }))
    const train = [chukh.el, wBack, wFront]
    gsap.set(train, { x: -2100 })

    // облачко с продуктами
    const cloud = k.prop(cloudTray(), 800, 250, 1040, 218, { z: 18 })
    cloud.style.pointerEvents = 'none'
    const slotX = [470, 690, 910, 1130]

    // ── помощники ──
    const cargo = []
    const wagonCenter = () => k.centerOf(wBack)
    const CARGO_SLOTS = [[-108, -44], [-36, -52], [36, -44], [108, -52]]
    const toWagon = async (it, n) => {
      const wc = wagonCenter(), from = k.centerOf(it.el), s = CARGO_SLOTS[n % 4]
      k.sfx('whoosh', { vol: 0.5 })
      it.el.style.zIndex = '7'
      await k.play(gsap.to(it.el, { x: `+=${wc.x + s[0] - from.x}`, y: `+=${wc.y + s[1] - from.y}`, scale: 0.46, duration: 0.65, ease: 'power2.inOut' }))
      k.sfx('plop')
      gsap.fromTo(it.el, { scale: 0.62 }, { scale: 0.46, duration: 0.4, ease: 'elastic.out(1.6,0.5)' })
      cargo.push(it)
    }
    const countCargo = async () => {
      for (let i = 0; i < cargo.length; i++) {
        gsap.fromTo(cargo[i].el, { scale: 0.46 }, { scale: 0.68, duration: 0.2, yoyo: true, repeat: 1 })
        k.sparkle(k.centerOf(cargo[i].el).x, k.centerOf(cargo[i].el).y - 20, 3)
        await k.sayNumber(i + 1)
      }
    }
    const drive = async () => {
      k.sfx('whoosh')
      await k.play(gsap.to([...train, ...cargo.map(c => c.el)], { x: '+=2300', duration: 2.4, ease: 'power2.in' }))
      cargo.splice(0).forEach(c => c.el.remove())
      gsap.set(train, { x: -2100 })
      k.sfx('whoosh')
      await k.play(gsap.to(train, { x: 0, duration: 2.2, ease: 'power2.out' }))
    }
    const makeItems = list => list.map(([id, src, name, color, art, w, h, o], i) => {
      const el = k.prop(token(art ?? food(name), w ?? SIZE[name][0], h ?? SIZE[name][1], color, o?.fit, o?.rot), slotX[i], 208, 170, 170, { z: 20 })
      return { id, src, el }
    })
    const closeRound = async els => {
      await k.play(gsap.to(els, { scale: 0, opacity: 0, duration: 0.4, stagger: 0.06, ease: 'back.in(2)' }))
      els.forEach(e => { e.style.display = 'none' })
    }

    // ── 0. Чухтик приезжает, ферма оживает ──
    const cow = k.guest('cow', 250, 800, { size: 340, z: 9 })
    const hen = k.guest('hen', 585, 810, { size: 250, z: 9, face: 'right' })
    const hiveEl = k.prop(hive(), 905, 596, 262, 332, { z: 6 })
    const treeEl = k.prop(appleTree(), 1268, 548, 366, 430, { z: 6 })
    const bees = [0, 1, 2].map(i => {
      const b = k.prop(bee(), 905 + (i - 1) * 90, 520 + (i % 2) * 60, 60, 47, { z: 9 })
      k.to(b, { x: `+=${k.rand(20, 44) * (i % 2 ? 1 : -1)}`, duration: k.rand(0.9, 1.4), yoyo: true, repeat: -1, ease: 'sine.inOut' })
      k.to(b, { y: `+=${k.rand(18, 34)}`, duration: k.rand(0.6, 1.0), yoyo: true, repeat: -1, ease: 'sine.inOut' })
      k.to(b.querySelector('.wing'), { scaleY: 0.35, duration: 0.07, yoyo: true, repeat: -1, transformOrigin: '50% 100%' })
      return b
    })
    const farmEls = [cow.el, hen.el, hiveEl, treeEl, ...bees]
    const items1 = makeItems([
      ['milk', 'cow', 'milk', '#62C6FF'],
      ['egg', 'hen', 'egg', '#FFD93D'],
      ['honey', 'hive', 'honey', '#FFB938'],
      ['apple', 'tree', 'apple', '#FF5A5F'],
    ])
    gsap.set([...farmEls, ...items1.map(i => i.el)], { scale: 0, opacity: 0 })
    await k.wait(300)
    k.sfx('whoosh')
    k.after(300, () => k.sfx('pop'))
    const arrive = k.play(gsap.to(train, { x: 0, duration: 2.4, ease: 'power2.out' }))
    k.fromTo(cloud, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: 'back.out(1.4)' })
    k.after(900, () => { k.popIn(farmEls, 0.1); k.sfx('pop') })
    k.after(1500, () => k.popIn(items1.map(i => i.el), 0.1))
    await arrive
    await k.tell(chukh, 'chukh_hi', 'wave')
    await k.tell(chukh, 'forgot', 'think')

    // ── 1. ферма ──
    const shakeTree = () => {
      const c = treeEl.querySelector('.canopy')
      gsap.fromTo(c, { rotation: -3 }, { rotation: 0, duration: 1, ease: 'elastic.out(1.2,0.25)', svgOrigin: '230 400' })
      gsap.fromTo(treeEl, { rotation: -1.5 }, { rotation: 0, duration: 0.9, ease: 'elastic.out(1.2,0.3)', transformOrigin: '50% 100%' })
    }
    const zones1 = [
      { id: 'cow', el: cow.el }, { id: 'hen', el: hen.el }, { id: 'hive', el: hiveEl }, { id: 'tree', el: treeEl },
    ]
    let n = 0
    // реплики идут по очереди, но не держат игру: малыш может нести следующий продукт, пока герой договаривает
    let chain = Promise.resolve()
    const speak = fn => { chain = chain.then(() => (k.alive ? fn() : null)).catch(() => {}); return chain }
    const feed = async (it, z, reactFn, lineFn) => {
      const c = k.centerOf(z.el)
      const here = k.centerOf(it.el)
      await k.play(gsap.to(it.el, { x: `+=${c.x - here.x}`, y: `+=${c.y - here.y - 30}`, scale: 0.9, duration: 0.3, ease: 'back.out(1.6)' }))
      k.sparkle(c.x, c.y - 30, 5)
      reactFn?.()
      speak(lineFn)
      await k.wait(350)
      await toWagon(it, n++)
    }
    const react = {
      cow: () => { cow.emote('happy'); k.sfx('boing', { vol: 0.5 }) },
      hen: () => { hen.emote('jump'); k.sfx('pop') },
      hive: () => { bees.forEach(b => gsap.fromTo(b, { scale: 1 }, { scale: 1.6, duration: 0.18, yoyo: true, repeat: 3 })); k.sfx('bubble') },
      tree: () => { shakeTree(); k.sfx('boing', { vol: 0.5 }) },
    }
    const say1 = {
      cow: () => k.tell(cow, 'cow_ok'),
      hen: () => k.tell(hen, 'hen_ok'),
      hive: () => k.tell(chukh, 'hive_ok', 'happy'),
      tree: () => k.tell(chukh, 'tree_ok', 'happy'),
    }
    const wrongLine = z => {
      k.sfx('wrong', { vol: 0.5 })
      const who = z.id === 'cow' ? cow : z.id === 'hen' ? hen : chukh
      speak(async () => { who.emote('shake'); await k.tell(who, z.id === 'cow' ? 'wrong_cow' : z.id === 'hen' ? 'wrong_hen' : 'wrong_any') })
    }

    await k.dnd({
      items: items1, zones: zones1, prompt: k.key('q_r1'), host: chukh,
      accept: (it, z) => it.src === z.id,
      onCorrect: (it, z) => feed(it, z, react[z.id], say1[z.id]),
      onWrong: (it, z) => (z ? wrongLine(z) : null),
    })

    await chain
    await k.tell(chukh, 'full1', 'jump')
    await countCargo()
    k.burst(1100, 780, 10)
    await k.wait(300)
    await k.tell(chukh, 'go1', 'happy')
    // фермерские декорации уходят, пока Чухтик едет в лавку
    k.after(1500, () => closeRound(farmEls))
    await drive()

    // ── 2. огород, поле, река ──
    const backLine = k.tell(chukh, 'back', 'wave')
    const bedEl = k.prop(gardenBed(), 380, 620, 440, 253, { z: 6 })
    const wheatEl = k.prop(wheat(), 830, 610, 430, 275, { z: 6 })
    const riverEl = k.prop(river(), 1270, 615, 430, 275, { z: 6 })
    wheatEl.querySelectorAll('.ear').forEach((e, i) => {
      gsap.set(e, { svgOrigin: `${e.dataset.ox} ${e.dataset.oy}` })
      k.to(e, { rotation: 4 * (i % 2 ? 1 : -1), duration: 1.2 + (i % 3) * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut', svgOrigin: `${e.dataset.ox} ${e.dataset.oy}` })
    })
    k.to(riverEl.querySelector('.waves'), { x: 16, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    const landEls = [bedEl, wheatEl, riverEl]
    const items2 = makeItems([
      ['carrot', 'bed', 'carrot', '#FF9F43', null, null, null, { fit: 150, rot: -38 }],
      ['bread', 'wheat', 'bread', '#E6A462', null, null, null, { fit: 122 }],
      ['fish', 'river', null, '#4D96FF', fishArt(), 230, 130, { fit: 124 }],
      ['potato', 'bed', 'potato', '#C68B59', null, null, null, { fit: 120 }],
    ])
    gsap.set([...landEls, ...items2.map(i => i.el)], { scale: 0, opacity: 0 })
    k.popIn(landEls, 0.12)
    k.sfx('pop')
    k.after(700, () => k.popIn(items2.map(i => i.el), 0.1))
    await backLine
    await k.wait(400)
    n = 0
    const zones2 = [{ id: 'bed', el: bedEl }, { id: 'wheat', el: wheatEl }, { id: 'river', el: riverEl }]
    let bedDone = 0
    const react2 = {
      bed: () => { gsap.fromTo(bedEl, { y: 0 }, { y: -14, duration: 0.15, yoyo: true, repeat: 3 }); k.sfx('boing', { vol: 0.5 }) },
      wheat: () => {
        gsap.fromTo(wheatEl, { rotation: -2.5 }, { rotation: 0, duration: 1.1, ease: 'elastic.out(1.2,0.25)', transformOrigin: '50% 100%' })
        k.sfx('swish')
      },
      river: () => {
        const c = k.centerOf(riverEl)
        for (let i = 0; i < 9; i++) {
          const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#9ADAFF;box-shadow:0 0 0 3px #3FA0E8"></div>', c.x + k.rand(-50, 50), c.y, 18, 18, { z: 13 })
          k.to(d, { y: k.rand(-140, -70), x: k.rand(-60, 60), opacity: 0, duration: 0.8, delay: i * 0.03, ease: 'power2.out', onComplete: () => d.remove() })
        }
        k.sfx('splash')
      },
    }
    const say2 = {
      bed: () => k.tell(chukh, bedDone++ ? 'bed_ok2' : 'bed_ok', 'happy'),
      wheat: () => k.tell(chukh, 'wheat_ok', 'happy'),
      river: () => k.tell(chukh, 'river_ok', 'laugh'),
    }
    await k.dnd({
      items: items2, zones: zones2, prompt: k.key('q_r2'), host: chukh,
      accept: (it, z) => it.src === z.id,
      onCorrect: (it, z) => feed(it, z, react2[z.id], say2[z.id]),
      onWrong: (it, z) => (z ? wrongLine(z) : null),
    })

    await chain
    await k.tell(chukh, 'full2', 'jump')
    await countCargo()
    k.burst(1100, 780, 12)
    await k.tell(chukh, 'finale', 'happy')
    k.after(1200, () => closeRound(landEls))
    await Promise.all([drive(), k.wait(1600).then(() => k.narrate('sum'))])
    await k.tell(chukh, 'bye', 'jump')
    k.burst(800, 420, 14)
  },
})
