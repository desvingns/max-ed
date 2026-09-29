// Еда и посуда в стиле игры. Каждая функция возвращает SVG-строку; размеры (viewBox) — в SIZE.
// food(name, opts) → SVG;  SIZE[name] = [w, h] — «родной» размер для соотношения сторон.
import { INK, svg, P, L, F, E, C, R, HL, SH, S, rounded, capsule, circlePath, ellipsePath, star, mix, darker, lighter, nid } from './art.js'

const G = { base: '#6BCB77', shade: '#45B57C', dark: '#2E8F5B', light: '#A5E39B' }
const O = { base: '#FF9F43', shade: '#E8792B', light: '#FFC58A' }
const RED = { base: '#FF5A5F', shade: '#E0474C', light: '#FF9A9A' }
const Y = { base: '#FFD93D', shade: '#F2B824', light: '#FFF0A0' }
const BR = { base: '#C68B59', shade: '#A26B3B', light: '#E2B78A' }
const CREAM = '#FFF8EC'

export const SIZE = {}
const def = (name, w, h, fn) => { SIZE[name] = [w, h]; return fn }

// ─────────────────────────── овощи ───────────────────────────
const cucumber = def('cucumber', 420, 120, () => {
  const body = capsule(14, 406, 60, 96)
  const bumps = [[70, 30], [130, 22], [200, 30], [270, 24], [340, 30], [100, 92], [170, 98], [240, 92], [310, 98], [370, 90]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${G.light}"/>`).join('')
  const stripes = `<path d="M40 40Q210 30 380 42M40 82Q210 92 380 80" fill="none" stroke="${G.dark}" stroke-width="5" stroke-linecap="round" opacity=".45"/>`
  return svg(420, 120, SH(210, 116, 190, 8) + S(body, G.base, G.shade, { extra: stripes + bumps }) + HL(120, 30, 60, 8, -2, 0.5) + P('M398 46Q412 60 398 74', '#D8F0B0', { sw: 4 }))
})

const carrot = def('carrot', 420, 120, () => {
  const body = 'M60 20Q300 14 404 58Q300 104 60 100Q20 100 16 60Q20 22 60 20Z'
  const ridges = [90, 150, 210, 270, 330].map((x, i) => `<path d="M${x} ${34 + i * 3}Q${x + 8} ${60} ${x} ${86 - i * 4}" fill="none" stroke="${O.shade}" stroke-width="5" stroke-linecap="round"/>`).join('')
  const leaves = `<g>${P('M22 56Q-6 30 4 6Q28 12 36 40Z', G.base, { sw: 4 })}${P('M18 62Q-10 62 -14 44Q10 36 32 54Z', G.shade, { sw: 4 })}${P('M22 68Q0 92 6 112Q32 106 38 80Z', G.base, { sw: 4 })}</g>`
  return svg(420, 120, SH(210, 116, 190, 8) + S(body, O.base, O.shade, { extra: ridges }) + HL(150, 36, 80, 7, -3, 0.45) + leaves)
})

const tomato = def('tomato', 170, 160, () => {
  const body = 'M85 22C140 14 166 62 158 100C150 138 118 150 85 150C52 150 20 138 12 100C4 62 30 14 85 22Z'
  const calyx = P('M85 30L98 12L104 32L124 24L112 44L128 56L106 54L98 70L85 54L72 70L64 54L42 56L58 44L46 24L66 32L72 12Z', G.base, { sw: 4 })
  return svg(170, 160, SH(85, 154, 70, 7) + S(body, RED.base, RED.shade) + HL(46, 66, 16, 9, -40, 0.6) + calyx)
})

const onion = def('onion', 170, 190, () => {
  const body = 'M85 34C120 34 156 70 156 116C156 158 124 178 85 178C46 178 14 158 14 116C14 70 50 34 85 34Z'
  const lines = `<path d="M85 40Q52 80 52 128Q54 160 85 176M85 40Q118 80 118 128Q116 160 85 176" fill="none" stroke="#C99AD9" stroke-width="4" opacity=".7"/>`
  const tip = P('M85 36Q78 18 86 4Q94 18 92 36Z', '#E8D9A0', { sw: 4 })
  const root = `<path d="M70 178L64 190M85 180L85 192M100 178L106 190" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`
  return svg(170, 194, SH(85, 184, 62, 6) + root + S(body, '#F3D9F7', '#D9B0E8', { extra: lines }) + tip + HL(48, 96, 10, 22, 20, 0.6))
})

const potato = def('potato', 210, 160, () => {
  const body = 'M40 60C56 24 120 14 170 34C204 50 206 100 178 130C148 156 70 156 36 128C14 108 22 82 40 60Z'
  const eyes = [[70, 70], [130, 50], [150, 100], [90, 116]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="4" fill="${BR.shade}" opacity=".85"/>`).join('')
  return svg(210, 160, SH(105, 154, 80, 7) + S(body, '#D9A868', '#B98444', { extra: eyes }) + HL(66, 46, 26, 8, -20, 0.5))
})

const broccoli = def('broccoli', 190, 190, () => {
  const stem = P('M70 190L74 120L116 120L120 190Z', '#B7E08B', { sw: 5 })
  const top = 'M96 20C126 0 172 22 160 60C186 74 172 116 136 116C120 132 70 132 54 116C18 116 6 74 34 60C20 22 66 0 96 20Z'
  return svg(190, 194, SH(96, 190, 50, 5) + stem + S(top, G.base, G.shade) + HL(60, 44, 18, 9, -30, 0.5) + [[70, 78], [110, 56], [128, 90], [90, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${G.dark}" opacity=".45"/>`).join(''))
})

const pepper = def('pepper', 170, 180, () => {
  const body = 'M40 50C64 30 118 30 142 52C170 78 154 150 120 168C100 178 74 176 52 164C22 146 12 84 40 50Z'
  const stem = P('M84 40Q84 14 108 10Q98 24 102 40Z', G.base, { sw: 4 })
  return svg(170, 182, SH(88, 176, 60, 6) + S(body, RED.base, RED.shade, { extra: `<path d="M86 42Q60 100 84 172M116 44Q136 100 116 170" fill="none" stroke="${RED.shade}" stroke-width="4" opacity=".5"/>` }) + stem + HL(50, 80, 10, 24, 15, 0.55))
})

const garlic = def('garlic', 150, 170, () => {
  const body = 'M75 30C110 60 140 90 128 130C120 156 96 164 75 164C54 164 30 156 22 130C10 90 40 60 75 30Z'
  return svg(150, 176, SH(75, 168, 50, 5) + S(body, '#FFF6E6', '#EBD8BC', { extra: `<path d="M75 34Q52 90 60 160M75 34Q100 90 92 160" fill="none" stroke="#D9C09A" stroke-width="4"/>` }) + P('M68 34L75 10L82 34Z', '#FFF6E6', { sw: 4 }) + HL(50, 96, 8, 20, 18, 0.6))
})

const dill = def('dill', 130, 190, () => {
  const stem = L('M65 190Q60 120 66 40', G.dark, 6)
  const sprigs = [[66, 44, -40], [66, 44, 0], [66, 44, 40], [64, 84, -55], [64, 84, 55], [62, 124, -60], [62, 124, 60]]
    .map(([x, y, a]) => `<g transform="rotate(${a} ${x} ${y})"><path d="M${x} ${y}L${x} ${y - 40}M${x} ${y - 12}L${x - 8} ${y - 24}M${x} ${y - 20}L${x + 8} ${y - 32}M${x} ${y - 30}L${x - 6} ${y - 40}" stroke="${G.base}" stroke-width="4" stroke-linecap="round" fill="none"/></g>`).join('')
  return svg(130, 194, stem + sprigs)
})

const mushroom = def('mushroom', 170, 160, () => {
  const stem = P('M62 90L58 148Q85 158 112 148L108 90Z', '#FFF2DA', { sw: 5 })
  const cap = 'M14 92C10 40 52 14 85 14C118 14 160 40 156 92C130 100 40 100 14 92Z'
  return svg(170, 164, SH(85, 154, 56, 6) + stem + S(cap, RED.base, RED.shade, { extra: [[50, 50, 10], [96, 36, 8], [124, 68, 9], [76, 76, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('') }) + HL(44, 40, 14, 7, -35, 0.55))
})

const corn = def('corn', 130, 220, () => {
  const cob = 'M65 14C104 20 112 100 104 160C98 196 32 196 26 160C18 100 26 20 65 14Z'
  const kernels = []
  for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) kernels.push(`<ellipse cx="${40 + c * 17 + (r % 2) * 8}" cy="${34 + r * 19}" rx="7.5" ry="8.5" fill="#FFE066" stroke="#E8B824" stroke-width="2"/>`)
  const leafL = P('M62 210Q10 160 18 96Q46 150 70 178Z', G.base, { sw: 4 })
  const leafR = P('M68 210Q120 160 112 96Q84 150 62 178Z', G.shade, { sw: 4 })
  return svg(130, 222, SH(65, 214, 40, 5) + S(cob, Y.base, Y.shade, { extra: kernels.join('') }) + leafL + leafR)
})

const cabbage = def('cabbage', 190, 180, () => {
  const body = 'M95 14C150 14 184 60 178 108C172 152 136 172 95 172C54 172 18 152 12 108C6 60 40 14 95 14Z'
  return svg(190, 184, SH(95, 176, 72, 6) + S(body, '#B7E88B', '#8FCB5E', { extra: `<path d="M95 20Q50 70 60 168M95 20Q140 70 130 168M40 40Q95 90 150 44" fill="none" stroke="#6FAE45" stroke-width="4" opacity=".6"/>` }) + HL(56, 60, 16, 9, -40, 0.55))
})

// ─────────────────────────── фрукты ───────────────────────────
const apple = def('apple', 170, 180, () => {
  const body = 'M85 40C108 26 156 32 162 88C168 138 126 172 100 168Q85 164 70 168C44 172 4 138 8 88C14 32 62 26 85 40Z'
  const stem = L('M85 40Q84 20 96 8', BR.shade, 7)
  const leaf = P('M90 22Q112 4 136 14Q116 34 92 26Z', G.base, { sw: 4 })
  return svg(170, 182, SH(85, 176, 60, 6) + S(body, RED.base, RED.shade) + stem + leaf + HL(44, 76, 14, 26, 20, 0.6))
})

const banana = def('banana', 280, 170, () => {
  const body = 'M20 40C40 120 130 160 250 110C262 106 268 88 256 84C176 118 90 96 60 30C54 16 16 20 20 40Z'
  return svg(280, 172, SH(140, 164, 100, 6) + S(body, '#FFE066', '#F0B824', { off: [-6, -10], extra: '' }) + L('M40 36Q90 120 240 100', '#E8B824', 4, 'opacity=".6"') + P('M14 36Q12 14 32 16', BR.shade, { sw: 4 }) + P('M254 84Q268 88 262 102', BR.shade, { sw: 4 }))
})

const orange = def('orange', 170, 170, () => {
  const body = circlePath(85, 88, 74)
  const dots = [[60, 60], [104, 50], [122, 96], [76, 122], [50, 96], [98, 118]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#E8792B" opacity=".7"/>`).join('')
  return svg(170, 172, SH(85, 166, 62, 6) + S(body, O.base, O.shade, { extra: dots }) + P('M78 16L96 12L100 26L84 28Z', G.base, { sw: 4 }) + HL(54, 56, 16, 9, -40, 0.55))
})

const lemon = def('lemon', 210, 150, () => {
  const body = 'M14 76C14 60 26 56 32 52C56 18 150 18 178 52C186 56 196 62 196 76C196 90 186 96 178 100C150 134 56 134 32 100C26 96 14 92 14 76Z'
  return svg(210, 154, SH(105, 146, 78, 6) + S(body, '#FFEC5C', '#F2C81E') + HL(70, 48, 26, 8, -10, 0.6) + P('M34 52Q44 46 52 52', G.base, { sw: 3 }))
})

const strawberry = def('strawberry', 150, 170, () => {
  const body = 'M75 30C120 20 148 44 140 84C130 128 96 160 75 164C54 160 20 128 10 84C2 44 30 20 75 30Z'
  const seeds = [[44, 62], [76, 54], [108, 64], [58, 92], [92, 94], [76, 124], [44, 112], [108, 114]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="4.6" fill="#FFE9A8"/>`).join('')
  const leaves = P('M75 32L52 16L62 34L34 34L58 44L44 58L75 46L106 58L92 44L116 34L88 34L98 16Z', G.base, { sw: 4 })
  return svg(150, 172, SH(75, 166, 50, 5) + S(body, RED.base, RED.shade, { extra: seeds }) + leaves + HL(40, 74, 8, 16, 20, 0.55))
})

const grapes = def('grapes', 150, 180, () => {
  const pos = [[50, 60], [88, 56], [124, 62], [40, 98], [76, 96], [112, 98], [56, 134], [94, 132], [76, 164]]
  return svg(150, 184, L('M84 40Q86 20 100 10', BR.shade, 7) + P('M84 26Q112 6 136 22Q114 40 88 32Z', G.base, { sw: 4 }) + pos.map(([x, y]) => C(x, y, 20, '#B388EB') + HL(x - 7, y - 8, 6, 3.4, -35, 0.6)).join(''))
})

const pear = def('pear', 150, 190, () => {
  const body = 'M75 22C98 22 100 60 112 82C136 106 138 168 100 180C84 186 66 186 50 180C12 168 14 106 38 82C50 60 52 22 75 22Z'
  return svg(150, 192, SH(75, 186, 50, 5) + S(body, '#D9EC6B', '#B7CF3F') + L('M75 24Q78 10 90 4', BR.shade, 6) + HL(46, 120, 10, 26, 12, 0.55))
})

const watermelon = def('watermelon', 240, 140, () => {
  const rind = 'M10 20L230 20C226 90 180 132 120 132C60 132 14 90 10 20Z'
  const flesh = 'M26 20L214 20C210 78 172 114 120 114C68 114 30 78 26 20Z'
  return svg(240, 144, SH(120, 138, 90, 6) + S(rind, G.base, G.shade) + P(flesh, '#FF6B7A') + `<path d="M26 20L214 20C212 30 208 38 204 44L36 44C32 38 28 30 26 20Z" fill="#FFF3E0"/>` + [[70, 62], [110, 84], [150, 62], [124, 50], [90, 46], [170, 82]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="7" fill="${INK}" transform="rotate(20 ${x} ${y})"/>`).join('') + L('M26 20L214 20', INK, 5))
})

// ─────────────────────────── продукты ───────────────────────────
const bread = def('bread', 260, 150, () => {
  const body = 'M22 80C16 30 60 16 130 16C200 16 244 30 238 80C238 100 230 108 226 110L226 130Q226 138 216 138L44 138Q34 138 34 130L34 110C30 108 22 100 22 80Z'
  const lines = `<path d="M70 32L88 70M120 26L138 66M170 32L188 72" stroke="#B8763A" stroke-width="5" stroke-linecap="round" opacity=".6"/>`
  return svg(260, 146, SH(130, 142, 100, 6) + S(body, '#E6A462', '#C98546', { extra: lines }) + HL(70, 40, 40, 8, -8, 0.5))
})

const breadSlice = def('breadSlice', 160, 160, () => {
  const body = 'M22 60C10 16 60 8 80 12C100 8 150 16 138 60C136 76 132 82 132 92L132 136Q132 148 120 148L40 148Q28 148 28 136L28 92C28 82 24 76 22 60Z'
  const crumb = 'M40 40C40 30 60 26 80 28C100 26 120 30 120 40C124 60 118 70 118 92L118 134L42 134L42 92C42 70 36 60 40 40Z'
  return svg(160, 154, SH(80, 150, 56, 6) + S(body, '#E6A462', '#C98546') + F(crumb, '#FFEFC6') + [[64, 60], [96, 74], [72, 104], [100, 112], [58, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#E8D19C"/>`).join('') + P(body, 'none', { sw: 5 }))
})

const cheese = def('cheese', 220, 140, () => {
  const body = 'M14 96L204 30L204 104Q204 118 190 118L28 118Q14 118 14 104Z'
  const top = 'M14 96L204 30L204 52L14 116Z'
  return svg(220, 144, SH(110, 128, 92, 6) + S(body, '#FFD93D', '#F2B824') + F('M14 96L204 30L200 46L20 108Z', '#FFF0A0', 'opacity=".55"') + [[80, 92, 10], [140, 84, 8], [178, 90, 6], [50, 108, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F2B824" stroke="${INK}" stroke-width="3"/>`).join('') + P(body, 'none', { sw: 5 }))
})

const cheeseSlice = def('cheeseSlice', 150, 150, () =>
  svg(150, 150, SH(75, 144, 56, 5) + S(rounded([[16, 24], [134, 16], [138, 128], [20, 132]], 10), '#FFD93D', '#F2B824') + [[46, 52, 9], [96, 90, 12], [56, 108, 6], [108, 44, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F2B824" stroke="${INK}" stroke-width="3"/>`).join('') + HL(40, 36, 16, 5, -8, 0.6)))

const sausage = def('sausage', 300, 100, () => {
  const body = capsule(16, 284, 50, 78)
  return svg(300, 100, SH(150, 96, 130, 6) + S(body, '#FF9AA2', '#E0707C') + HL(90, 30, 60, 6, -2, 0.55) + P('M14 40Q4 50 14 60', '#E0707C', { sw: 4 }) + P('M286 40Q296 50 286 60', '#E0707C', { sw: 4 }))
})

const sausageSlice = def('sausageSlice', 110, 110, () =>
  svg(110, 110, SH(55, 104, 40, 4) + S(circlePath(55, 55, 42), '#FF9AA2', '#E0707C') + C(55, 55, 26, '#FFC5C9', { sw: 0 }) + HL(38, 38, 10, 5, -35, 0.6) + P(circlePath(55, 55, 42), 'none', { sw: 5 })))

const butter = def('butter', 190, 110, () =>
  svg(190, 112, SH(95, 106, 80, 5) + S('M14 44L60 14L176 14L176 84Q176 98 162 98L28 98Q14 98 14 84Z', '#FFEB7A', '#F2C93A') + P('M14 44L60 14L176 14L176 40L14 44Z', '#FFF6B8', { sw: 5 }) + HL(110, 26, 40, 5, -3, 0.5)))

const milk = def('milk', 130, 210, () => {
  const body = 'M20 60L20 190Q20 202 32 202L98 202Q110 202 110 190L110 60Z'
  return svg(130, 210, SH(65, 206, 50, 5) + P('M20 60L44 14L86 14L110 60Z', '#FF7A6B', { sw: 5 }) + S(body, '#FFFFFF', '#DCE8F5') + R(20, 100, 90, 56, 0, '#62C6FF', { sw: 0 }) + `<path d="M50 118C50 106 76 106 76 118C76 132 63 140 63 140C63 140 50 132 50 118Z" fill="#fff"/>` + P(body, 'none', { sw: 5 }) + HL(36, 76, 5, 22, 0, 0.7))
})

const flour = def('flour', 170, 220, () => {
  const bag = rounded([[26, 30], [144, 30], [152, 200], [18, 200]], 12)
  return svg(170, 222, SH(85, 214, 68, 6) + S(bag, '#FFF8EC', '#EADFC8') + P('M26 30L34 8L136 8L144 30Z', '#F2E4C8', { sw: 5 }) + C(85, 118, 40, '#FFE9A8') + `<path d="M64 130Q78 96 85 92Q92 96 106 130Q85 122 64 130Z" fill="#E6B84A"/>` + L('M26 30L144 30', INK, 5) + P(bag, 'none', { sw: 5 }))
})

const saltShaker = def('saltShaker', 120, 200, () => {
  const glass = 'M22 62Q18 60 20 52L30 30Q60 22 90 30L100 52Q102 60 98 62L104 174Q104 188 90 190L30 190Q16 188 16 174Z'
  const holes = [[46, 24], [60, 20], [74, 24], [53, 32], [67, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y + 4}" r="2.6" fill="${INK}"/>`).join('')
  return svg(120, 204, SH(60, 196, 46, 5) + S(glass, '#F4FBFF', '#C9DFF0') + F('M20 96L100 96L104 174Q104 188 90 190L30 190Q16 188 16 174Z', '#FFFFFF', 'opacity=".85"') + P('M28 32Q60 20 92 32L96 50L24 50Z', '#B8C0CC', { sw: 5 }) + holes + `<text x="60" y="138" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="26" fill="#4D96FF">СОЛЬ</text>` + HL(34, 110, 5, 26, 0, 0.7))
})

const sugarJar = def('sugarJar', 150, 180, () => {
  const jar = 'M30 44L120 44L128 60L128 160Q128 176 112 176L38 176Q22 176 22 160L22 60Z'
  return svg(150, 184, SH(75, 178, 56, 5) + S(jar, '#F4FBFF', '#C9DFF0') + F('M24 96L126 96L128 160Q128 176 112 176L38 176Q22 176 22 160Z', '#FFFFFF', 'opacity=".85"') + P('M26 44Q26 26 75 26Q124 26 124 44Z', '#FF8FC8', { sw: 5 }) + C(75, 24, 8, '#FFD93D', { sw: 4 }) + `<text x="75" y="150" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="26" fill="#FF5A9E">САХАР</text>` + `<g fill="#fff" stroke="#C9DFF0" stroke-width="2">${[[44, 100], [66, 106], [92, 100], [56, 112], [84, 114]].map(([x, y]) => `<rect x="${x}" y="${y}" width="8" height="8" rx="2"/>`).join('')}</g>` + HL(36, 110, 5, 24, 0, 0.7))
})

const oil = def('oil', 100, 230, () => {
  const b = 'M24 96Q24 74 38 66L38 40L62 40L62 66Q76 74 76 96L76 216Q76 224 68 224L32 224Q24 224 24 216Z'
  return svg(100, 232, SH(50, 226, 34, 5) + S(b, '#FFE066', '#F2B824') + R(36, 22, 28, 22, 6, '#FF9F43') + R(28, 130, 44, 48, 8, '#fff', { sw: 4 }) + C(50, 154, 9, '#FFB938', { sw: 3 }) + HL(34, 112, 4, 20, 0, 0.7))
})

const honey = def('honey', 150, 170, () => {
  const jar = 'M28 40L122 40L132 58L132 150Q132 164 118 164L32 164Q18 164 18 150L18 58Z'
  return svg(150, 172, SH(75, 166, 56, 5) + S(jar, '#FFB938', '#E8901F') + P('M22 40Q22 22 75 22Q128 22 128 40Z', '#F2E4C8', { sw: 5 }) + R(38, 84, 74, 44, 8, '#FFF8EC', { sw: 4 }) + `<text x="75" y="118" text-anchor="middle" font-size="34">🍯</text>` + HL(30, 80, 5, 30, 0, 0.5))
})

const yogurt = def('yogurt', 120, 130, () =>
  svg(120, 132, SH(60, 126, 46, 5) + S('M14 30L106 30L98 116Q96 124 88 124L32 124Q24 124 22 116Z', '#FFFFFF', '#DCE8F5') + P('M10 30Q10 16 60 16Q110 16 110 30Z', '#FF8FC8', { sw: 5 }) + C(60, 82, 20, '#FF8FC8', { sw: 4 }) + HL(28, 64, 4, 18, 0, 0.6)))

const egg = def('egg', 100, 124, () => {
  const b = 'M50 8C78 8 92 50 92 78C92 104 74 118 50 118C26 118 8 104 8 78C8 50 22 8 50 8Z'
  return svg(100, 124, SH(50, 120, 34, 4) + S(b, '#FFF4DF', '#F0D6A8') + HL(30, 40, 8, 14, 20, 0.7))
})

const pasta = def('pasta', 170, 130, () => {
  // «бантики»
  const one = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})">${P('M-32 -20L0 -6L32 -20L32 20L0 6L-32 20Z', '#FFE08A', { sw: 4 })}${C(0, 0, 7, '#F2B824', { sw: 3 })}</g>`
  return svg(170, 130, one(50, 46, -20) + one(116, 40, 15) + one(84, 92, 5))
})

const rice = def('rice', 150, 100, () => {
  const g = [[30, 40], [54, 34], [78, 40], [100, 34], [124, 42], [44, 62], [70, 66], [96, 60], [118, 66], [56, 84], [86, 84], [106, 82]]
  return svg(150, 100, g.map(([x, y], i) => E(x, y, 10, 5, '#FFFFFF', { rot: (i * 37) % 90 - 40, sw: 3 })).join(''))
})

const oats = def('oats', 150, 100, () =>
  svg(150, 100, [[30, 40], [58, 34], [88, 42], [116, 34], [44, 66], [76, 68], [106, 64]].map(([x, y], i) => E(x, y, 13, 8, '#F2DDB0', { rot: (i * 53) % 120 - 50, sw: 3 })).join('')))

// ─────────────────────────── соль ───────────────────────────
const saltPinch = def('saltPinch', 60, 60, () => svg(60, 60, [[14, 18], [30, 10], [44, 22], [22, 36], [40, 44]].map(([x, y]) => R(x, y, 8, 8, 2, '#fff', { sw: 2.5, rot: x * 3 })).join('')))

// ─────────────────────────── инструменты ───────────────────────────
const board = def('board', 700, 380, () => {
  const b = rounded([[30, 40], [640, 30], [680, 340], [20, 352]], 34)
  return svg(700, 380, SH(350, 368, 300, 10, 0.16) + S(b, '#E2B078', '#C98F55', { extra: `<path d="M60 110Q300 96 640 116M52 210Q300 224 650 206M54 296Q300 284 654 300" fill="none" stroke="#B9814A" stroke-width="4" opacity=".35" stroke-linecap="round"/>` }) + HL(150, 70, 90, 8, -3, 0.5) + C(660, 60, 14, '#C98F55') + C(660, 60, 6, '#9C6A36', { sw: 0 }))
})

const knife = def('knife', 130, 300, () => {
  // детский нож: пластиковый, круглый кончик (вертикально, лезвием вниз)
  return svg(130, 300, SH(65, 296, 34, 4) + P('M40 20Q40 6 65 6Q90 6 90 20L90 120L40 120Z', '#FF8FC8', { sw: 5 }) + R(34, 112, 62, 16, 6, '#B8C0CC') + P('M40 128L90 128L90 260Q90 288 65 288Q40 288 40 260Z', '#DDE6F2', { sw: 5 }) + F('M48 136L60 136L60 268Q52 268 48 258Z', '#fff', 'opacity=".7"') + C(65, 60, 10, '#fff', { sw: 3 }))
})

const peeler = def('peeler', 120, 260, () =>
  svg(120, 260, SH(60, 256, 30, 4) + P('M44 100L76 100L80 250Q80 256 60 256Q40 256 40 250Z', '#62C6FF', { sw: 5 }) + P('M24 30Q24 8 60 8Q96 8 96 30L96 108L24 108Z', '#B8C0CC', { sw: 5 }) + R(46, 30, 28, 46, 14, '#8C95B4', { sw: 4 }) + HL(54, 160, 5, 30, 0, 0.6)))

const grater = def('grater', 190, 240, () => {
  const holes = []
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) holes.push(`<ellipse cx="${62 + c * 24 + (r % 2) * 12}" cy="${72 + r * 32}" rx="6" ry="9" fill="${INK}" opacity=".85"/>`)
  return svg(190, 240, SH(95, 236, 70, 5) + P('M50 14L140 14L176 226L14 226Z', '#DDE6F2', { sw: 5 }) + holes.join('') + P('M66 14Q66 -6 95 -6Q124 -6 124 14', 'none', { sw: 8 }) + HL(46, 90, 5, 40, 12, 0.6))
})

const rollingPin = def('rollingPin', 380, 100, () =>
  svg(380, 100, SH(190, 96, 150, 5) + R(10, 40, 70, 22, 11, '#C68B59') + R(300, 40, 70, 22, 11, '#C68B59') + S(rounded([[70, 16], [310, 16], [310, 86], [70, 86]], 18), '#E6B87A', '#C98F55') + HL(180, 32, 100, 5, 0, 0.5)))

const ladle = def('ladle', 110, 290, () =>
  svg(110, 290, SH(55, 286, 26, 4) + P('M46 130L64 130L68 270Q68 282 55 282Q42 282 42 270Z', '#B8C0CC', { sw: 5 }) + P('M8 100C8 70 30 56 55 56C80 56 102 70 102 100C102 132 80 146 55 146C30 146 8 132 8 100Z', '#DDE6F2', { sw: 5 }) + E(55, 96, 32, 20, '#8C95B4', { sw: 0 }) + HL(30, 84, 8, 4, -30, 0.7)))

const spatula = def('spatula', 100, 290, () =>
  svg(100, 290, SH(50, 286, 24, 4) + P('M42 110L58 110L62 274Q62 284 50 284Q38 284 38 274Z', '#C68B59', { sw: 5 }) + P('M12 20L88 20L88 118L12 118Z', '#FFB36B', { sw: 5 }) + [30, 50, 70].map(x => L(`M${x} 32L${x} 104`, '#E8792B', 4)).join('')))

const colander = def('colander', 240, 190, () => {
  const b = 'M20 60C20 130 60 180 120 180C180 180 220 130 220 60Z'
  const holes = []
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) holes.push(`<circle cx="${52 + c * 27 + (r % 2) * 13}" cy="${90 + r * 26}" r="5" fill="${INK}" opacity=".8"/>`)
  return svg(240, 194, SH(120, 188, 90, 6) + S(b, '#DDE6F2', '#B8C4DA', { extra: holes.join('') }) + E(120, 60, 100, 16, '#F4F6FC') + E(120, 60, 100, 16, 'none') + R(0, 56, 30, 12, 6, '#8C95B4') + R(210, 56, 30, 12, 6, '#8C95B4'))
})

const cookieCutter = def('cookieCutter', 150, 150, (shape = 'star') => {
  const paths = {
    star: star(75, 78, 62, 30, 5),
    heart: 'M75 132C10 90 14 44 44 34C62 28 75 42 75 54C75 42 88 28 106 34C136 44 140 90 75 132Z',
    circle: circlePath(75, 76, 58),
    triangle: rounded([[75, 18], [136, 124], [14, 124]], 14),
    square: rounded([[20, 20], [130, 20], [130, 130], [20, 130]], 12),
    flower: null,
  }
  return svg(150, 150, SH(75, 146, 56, 5) + P(paths[shape] ?? paths.star, '#B8C0CC', { sw: 6 }))
})

const soap = def('soap', 170, 110, () =>
  svg(170, 110, SH(85, 104, 66, 5) + S(rounded([[14, 26], [156, 20], [160, 84], [18, 90]], 26), '#FF9EB1', '#E8708C') + HL(50, 40, 26, 8, -5, 0.6) + `<circle cx="140" cy="20" r="14" fill="#fff" fill-opacity=".85" stroke="#9CC3DD" stroke-width="3"/><circle cx="118" cy="10" r="8" fill="#fff" fill-opacity=".85" stroke="#9CC3DD" stroke-width="3"/>`))

const sponge = def('sponge', 170, 110, () => {
  const holes = [[40, 40, 6], [80, 34, 7], [120, 44, 6], [56, 70, 7], [102, 72, 6], [138, 68, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#E8B824" opacity=".8"/>`).join('')
  return svg(170, 112, SH(85, 106, 66, 5) + S(rounded([[16, 24], [154, 20], [158, 76], [20, 82]], 16), '#FFE066', '#F2C93A', { extra: holes }) + P('M16 76L158 72L156 90Q154 98 146 98L28 100Q20 100 18 92Z', '#6BCB77', { sw: 5 }))
})

const hourglass = def('hourglass', 130, 200, () =>
  svg(130, 204, SH(65, 198, 50, 5) + R(14, 6, 102, 18, 8, '#C68B59') + R(14, 178, 102, 18, 8, '#C68B59') + P('M26 24L104 24Q104 80 72 100Q104 120 104 178L26 178Q26 120 58 100Q26 80 26 24Z', '#E6F6FF', { sw: 5 }) + P('M40 40L90 40Q88 66 70 84L60 84Q42 66 40 40Z', '#FFD93D', { sw: 0 }) + P('M36 178Q44 140 65 128Q86 140 94 178Z', '#FFD93D', { sw: 0 }) + HL(40, 50, 4, 16, 10, 0.7)))

const germ = def('germ', 130, 130, (col = '#8AC926') => {
  const spikes = Array.from({ length: 10 }, (_, i) => { const a = (i * 36 * Math.PI) / 180; return `<line x1="${65 + Math.cos(a) * 42}" y1="${65 + Math.sin(a) * 42}" x2="${65 + Math.cos(a) * 58}" y2="${65 + Math.sin(a) * 58}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="${65 + Math.cos(a) * 60}" cy="${65 + Math.sin(a) * 60}" r="6" fill="${col}" stroke="${INK}" stroke-width="4"/>` }).join('')
  return svg(130, 130, spikes + S(circlePath(65, 65, 46), col, darker(col, 0.25)) + `<circle cx="50" cy="58" r="8" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="80" cy="58" r="8" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="52" cy="60" r="4" fill="${INK}"/><circle cx="82" cy="60" r="4" fill="${INK}"/><path d="M48 82Q65 94 82 82" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`)
})

const towel = def('towel', 150, 200, () =>
  svg(150, 204, P('M20 10L130 10L136 190Q136 198 126 198L24 198Q14 198 14 190Z', '#FFFFFF', { sw: 5 }) + [40, 62].map(y => R(14, y, 122, 12, 0, '#FF5A5F', { sw: 0 })).join('') + P('M20 10L130 10L136 190Q136 198 126 198L24 198Q14 198 14 190Z', 'none', { sw: 5 })))

const apron = def('apron', 190, 240, () =>
  svg(190, 240, P('M60 8L130 8L142 60L182 70L170 230L20 230L8 70L48 60Z', '#FF8FC8', { sw: 5 }) + P('M70 8Q95 40 120 8', 'none', { sw: 5 }) + R(56, 130, 78, 56, 14, '#FFB3D9', { sw: 4 }) + C(95, 100, 12, '#FFF', { sw: 4 })))

const chefHat = def('chefHat', 210, 190, () =>
  svg(210, 192, SH(105, 186, 76, 5) + P('M46 110C4 100 -2 44 44 44C48 12 100 -2 120 22C150 4 190 24 176 60C214 70 200 116 160 112L156 172Q156 180 148 180L58 180Q50 180 50 172Z', '#FFFFFF', { sw: 5 }) + L('M60 146L150 146', '#DDE6F2', 5) + HL(70, 60, 22, 10, -30, 0.8)))

const cup = def('cup', 130, 130, () =>
  svg(130, 132, SH(60, 126, 46, 5) + P('M104 48Q136 48 132 76Q128 100 100 100', 'none', { sw: 8 }) + S('M14 36L106 36L100 100Q96 120 76 120L44 120Q24 120 20 100Z', '#FFFFFF', '#DCE8F5') + E(60, 38, 46, 9, '#FFE9B8') + HL(30, 72, 5, 20, 8, 0.7)))

const plate = def('plate2', 200, 90, () =>
  svg(200, 92, SH(100, 84, 84, 5) + E(100, 46, 94, 34, '#FFFFFF') + E(100, 48, 64, 20, '#E6F0FA', { sw: 0 }) + E(100, 46, 94, 34, 'none') + HL(56, 32, 22, 5, -8, 0.8)))

const fork = def('fork', 70, 260, () =>
  svg(70, 260, P('M12 10L12 70Q12 92 34 94L34 250Q34 256 40 256Q46 256 46 250L46 94Q68 92 68 70L68 10L54 10L54 60L44 60L44 10L34 10L34 60L24 60L24 10Z', '#DDE6F2', { sw: 4 })))

const spoon = def('spoon', 70, 260, () =>
  svg(70, 260, P('M36 6C12 6 8 42 24 62C30 70 30 78 30 90L30 250Q30 256 36 256Q42 256 42 250L42 90C42 78 42 70 48 62C64 42 60 6 36 6Z', '#DDE6F2', { sw: 4 })))

const napkin = def('napkin', 130, 130, () =>
  svg(130, 130, P('M14 14L116 14L116 116L14 116Z', '#FFB3D9', { sw: 5, attr: 'transform="rotate(8 65 65)"' }) + L('M30 40L100 40M30 60L100 60', '#fff', 4, 'transform="rotate(8 65 65)"')))

const pizzaBase = def('pizzaBase', 300, 300, () =>
  svg(300, 300, SH(150, 286, 120, 8) + S(circlePath(150, 150, 130), '#F0C070', '#D9A04E') + C(150, 150, 108, '#FFE3A8', { sw: 0 }) + HL(96, 84, 40, 12, -40, 0.5)))

const sauceBowl = def('sauceBowl', 200, 130, () =>
  svg(200, 132, SH(100, 126, 80, 5) + S('M14 44Q14 118 100 118Q186 118 186 44Z', '#FFFFFF', '#DCE8F5') + E(100, 44, 86, 16, '#FF5A5F') + E(84, 40, 26, 5, '#FF9A9A', { sw: 0 }) + E(100, 44, 86, 16, 'none') + HL(38, 78, 5, 16, 8, 0.7)))

// ─────────────────────────── срезы (для нарезки) ───────────────────────────
const cucumberSlice = def('cucumberSlice', 110, 110, () =>
  svg(110, 110, SH(55, 104, 40, 4) + S(circlePath(55, 55, 46), G.base, G.shade) + C(55, 55, 35, '#E6F7C6', { sw: 0 }) + C(55, 55, 24, '#F5FFDB', { sw: 0 }) + [0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="${55 + Math.cos((a * Math.PI) / 180) * 14}" cy="${55 + Math.sin((a * Math.PI) / 180) * 14}" rx="3" ry="4.6" fill="#C4E39B" transform="rotate(${a + 90} ${55 + Math.cos((a * Math.PI) / 180) * 14} ${55 + Math.sin((a * Math.PI) / 180) * 14})"/>`).join('') + P(circlePath(55, 55, 46), 'none', { sw: 5 }) + HL(36, 36, 12, 5, -40, 0.6)))

const carrotSlice = def('carrotSlice', 110, 110, () =>
  svg(110, 110, SH(55, 104, 40, 4) + S(circlePath(55, 55, 46), O.base, O.shade) + C(55, 55, 32, '#FFC58A', { sw: 0 }) + C(55, 55, 12, '#FFD9A8', { sw: 0 }) + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="${55 + Math.cos((a * Math.PI) / 180) * 14}" y1="${55 + Math.sin((a * Math.PI) / 180) * 14}" x2="${55 + Math.cos((a * Math.PI) / 180) * 28}" y2="${55 + Math.sin((a * Math.PI) / 180) * 28}" stroke="#F09A55" stroke-width="2.5" stroke-linecap="round"/>`).join('') + P(circlePath(55, 55, 46), 'none', { sw: 5 }) + HL(36, 36, 12, 5, -40, 0.6)))

const tomatoSlice = def('tomatoSlice', 110, 110, () =>
  svg(110, 110, SH(55, 104, 40, 4) + S(circlePath(55, 55, 46), RED.base, RED.shade) + C(55, 55, 36, '#FF8F8F', { sw: 0 }) + [0, 120, 240].map(a => { const x = 55 + Math.cos(((a - 90) * Math.PI) / 180) * 20, y = 55 + Math.sin(((a - 90) * Math.PI) / 180) * 20; return `<ellipse cx="${x}" cy="${y}" rx="11" ry="14" fill="#FFD9A8" stroke="#FFF" stroke-width="2" transform="rotate(${a} ${x} ${y})"/><circle cx="${x}" cy="${y}" r="2.4" fill="#F2B824"/>` }).join('') + P(circlePath(55, 55, 46), 'none', { sw: 5 })))

const onionRing = def('onionRing', 110, 110, () =>
  svg(110, 110, SH(55, 104, 40, 4) + P(circlePath(55, 55, 46), '#F3D9F7', { sw: 5 }) + [36, 26, 16].map(r => `<circle cx="55" cy="55" r="${r}" fill="none" stroke="#C99AD9" stroke-width="4"/>`).join('') + C(55, 55, 6, '#F3D9F7', { sw: 3 })))

const potatoSlice = def('potatoSlice', 110, 100, () =>
  svg(110, 100, SH(55, 94, 40, 4) + S(ellipsePath(55, 48, 46, 40), '#D9A868', '#B98444') + E(55, 48, 36, 30, '#FFF3C9', { sw: 0 }) + E(55, 48, 22, 18, '#FFE9A8', { sw: 0 }) + P(ellipsePath(55, 48, 46, 40), 'none', { sw: 5 })))

const appleHalf = def('appleHalf', 150, 170, () => {
  const b = 'M75 34C95 24 136 30 140 84C144 132 110 164 90 160Q75 156 60 160C40 164 6 132 10 84C14 30 55 24 75 34Z'
  return svg(150, 172, SH(75, 166, 56, 6) + S(b, '#FFF3C9', '#F0DBA0', { off: [-6, -6] }) + `<path d="M75 60C66 76 68 100 75 112C82 100 84 76 75 60Z" fill="#8A5A2E" opacity=".85"/>` + P(b, 'none', { sw: 5 }) + `<path d="M22 84C22 50 50 36 75 40" fill="none" stroke="${RED.base}" stroke-width="9" stroke-linecap="round" opacity=".9"/><path d="M128 84C128 50 100 36 75 40" fill="none" stroke="${RED.base}" stroke-width="9" stroke-linecap="round" opacity=".9"/>`)
})

const orangeSegment = def('orangeSegment', 130, 100, () =>
  svg(130, 100, S('M10 30Q65 130 120 30Q65 0 10 30Z', O.base, O.shade) + `<path d="M24 38Q65 90 106 38" fill="none" stroke="#FFC58A" stroke-width="7" stroke-linecap="round"/>` + HL(40, 32, 14, 4, -10, 0.6)))

const lemonSlice = def('lemonSlice', 110, 110, () =>
  svg(110, 110, SH(55, 104, 40, 4) + P(circlePath(55, 55, 46), '#FFEC5C', { sw: 5 }) + C(55, 55, 38, '#FFF6B0', { sw: 0 }) + Array.from({ length: 8 }, (_, i) => { const a = (i * 45 * Math.PI) / 180; return `<path d="M55 55L${55 + Math.cos(a - 0.2) * 34} ${55 + Math.sin(a - 0.2) * 34}Q${55 + Math.cos(a) * 38} ${55 + Math.sin(a) * 38} ${55 + Math.cos(a + 0.2) * 34} ${55 + Math.sin(a + 0.2) * 34}Z" fill="#FFE347"/>` }).join('') + P(circlePath(55, 55, 46), 'none', { sw: 5 })))

const strawberryHalf = def('strawberryHalf', 130, 150, () =>
  svg(130, 152, S('M65 22C104 14 126 40 120 74C112 112 84 142 65 146C46 142 18 112 10 74C4 40 26 14 65 22Z', RED.base, RED.shade) + F('M65 40C90 38 100 60 96 78C90 104 76 124 65 130C54 124 40 104 34 78C30 60 40 38 65 40Z', '#FF9A9A') + F('M65 60C72 60 76 74 72 90C70 104 66 112 65 116C64 112 60 104 58 90C54 74 58 60 65 60Z', '#FFD0D0') + P('M65 22C104 14 126 40 120 74C112 112 84 142 65 146C46 142 18 112 10 74C4 40 26 14 65 22Z', 'none', { sw: 5 })))

const bananaSlice = def('bananaSlice', 100, 100, () =>
  svg(100, 100, SH(50, 94, 36, 4) + P(circlePath(50, 50, 40), '#FFE066', { sw: 5 }) + C(50, 50, 30, '#FFF6C4', { sw: 0 }) + Array.from({ length: 5 }, (_, i) => `<circle cx="${50 + Math.cos((i * 72 * Math.PI) / 180) * 10}" cy="${50 + Math.sin((i * 72 * Math.PI) / 180) * 10}" r="2.4" fill="#D9B860"/>`).join('')))


const paw = def('paw', 150, 150, () => {
  const fur = '#FFD9A8'
  const toe = (cx, cy) => E(cx, cy, 20, 26, fur)
  return svg(150, 150, SH(75, 142, 56, 5) + toe(30, 62) + toe(56, 36) + toe(94, 36) + toe(120, 62) +
    S('M28 104C28 76 52 64 75 64C98 64 122 76 122 104C122 128 98 136 75 136C52 136 28 128 28 104Z', fur, '#F0BE84') +
    E(75, 108, 22, 17, '#FF9EB1', { sw: 0 }) + [[30, 62], [56, 36], [94, 36], [120, 62]].map(([x, y]) => E(x, y + 2, 8, 10, '#FF9EB1', { sw: 0 })).join('') + HL(58, 82, 12, 5, -20, 0.6))
})


const bigKnife = def('bigKnife', 110, 300, () =>
  svg(110, 300, SH(55, 296, 30, 4) + P('M32 8L84 8L76 150L38 150Z', '#8C95B4', { sw: 5 }) + P('M32 8Q52 -6 84 8L84 150L32 150Z', '#DDE6F2', { sw: 5 }) + F('M40 16L50 16L46 140L40 140Z', '#fff', 'opacity=".7"') + P('M36 150L80 150L80 178L36 178Z', '#B8C0CC', { sw: 5 }) + P('M36 178L80 178L84 280Q84 292 70 292L46 292Q32 292 32 280Z', '#5B5470', { sw: 5 }) + C(58, 212, 5, '#FFD93D', { sw: 0 }) + C(58, 250, 5, '#FFD93D', { sw: 0 })))

export const FOODS = {
  cucumber, carrot, tomato, onion, potato, broccoli, pepper, garlic, dill, mushroom, corn, cabbage,
  apple, banana, orange, lemon, strawberry, grapes, pear, watermelon,
  bread, breadSlice, cheese, cheeseSlice, sausage, sausageSlice, butter, milk, flour, saltShaker, sugarJar, oil, honey, yogurt, egg,
  pasta, rice, oats, saltPinch,
  board, paw, knife, bigKnife, peeler, grater, rollingPin, ladle, spatula, colander, cookieCutter, soap, sponge, hourglass, germ, towel, apron, chefHat, cup, plate2: plate, fork, spoon, napkin,
  pizzaBase, sauceBowl,
  cucumberSlice, carrotSlice, tomatoSlice, onionRing, potatoSlice, appleHalf, orangeSegment, lemonSlice, strawberryHalf, bananaSlice,
}

/** SVG-строка еды по имени. Доп. аргументы — для параметризуемых предметов (cookieCutter('heart'), germ('#f0a')). */
export function food(name, ...args) {
  const fn = FOODS[name]
  if (!fn) throw new Error(`[kx/food] нет предмета «${name}»`)
  return fn(...args)
}

/** HTML-обёртка: блок нужного размера с SVG внутри (сохраняя пропорции). */
export function foodEl(name, width, ...args) {
  const [w, h] = SIZE[name]
  const el = document.createElement('div')
  el.className = 'kx-food'
  el.dataset.food = name
  el.style.cssText = `position:absolute;width:${width}px;height:${Math.round((width * h) / w)}px`
  el.innerHTML = food(name, ...args)
  return el
}
