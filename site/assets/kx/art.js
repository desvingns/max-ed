// Мини-набор для рисования SVG в стиле игры: толстый тёмный контур, плоские цвета,
// «тень» полумесяцем и белый блик. Все функции возвращают строки SVG.
export const INK = '#3B2F4F'

let uid = 0
export const nid = p => `kx${p}${(++uid).toString(36)}`
export const f1 = n => String(Math.round(n * 10) / 10)

/** Обёртка <svg>. viewBox = 0 0 w h, растягивается на 100% контейнера. */
export const svg = (w, h, body, attrs = '') =>
  `<svg class="kxart" viewBox="0 0 ${w} ${h}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" overflow="visible" aria-hidden="true" ${attrs}>${body}</svg>`

const st = (sw, col = INK) => `stroke="${col}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"`

/** Контурная фигура с заливкой. */
export const P = (d, fill, o = {}) => `<path d="${d}" fill="${fill}" ${st(o.sw ?? 5, o.ink)} ${o.attr ?? ''}/>`
/** Только линия (без заливки). */
export const L = (d, col = INK, w = 5, attr = '') => `<path d="${d}" fill="none" ${st(w, col)} ${attr}/>`
/** Заливка без контура. */
export const F = (d, fill, attr = '') => `<path d="${d}" fill="${fill}" ${attr}/>`
export const E = (cx, cy, rx, ry, fill, o = {}) =>
  `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${fill}" ${o.sw === 0 ? '' : st(o.sw ?? 5, o.ink)} ${o.rot ? `transform="rotate(${o.rot} ${f1(cx)} ${f1(cy)})"` : ''} ${o.attr ?? ''}/>`
export const C = (cx, cy, r, fill, o = {}) => E(cx, cy, r, r, fill, o)
export const R = (x, y, w, h, r, fill, o = {}) =>
  `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(r)}" fill="${fill}" ${o.sw === 0 ? '' : st(o.sw ?? 5, o.ink)} ${o.rot ? `transform="rotate(${o.rot} ${f1(x + w / 2)} ${f1(y + h / 2)})"` : ''} ${o.attr ?? ''}/>`
/** Белый блик. */
export const HL = (cx, cy, rx, ry, rot = -30, op = 0.55) =>
  `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#fff" opacity="${op}" transform="rotate(${rot} ${f1(cx)} ${f1(cy)})"/>`
/** Тень под предметом. */
export const SH = (cx, cy, rx, ry, op = 0.14) => `<ellipse class="kx-shadow" cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#000" opacity="${op}"/>`

/**
 * Фигура с «тенью»: заливка shade, поверх — base, сдвинутая на off и обрезанная контуром;
 * получается полумесяц тени с правого-нижнего края. `extra` рисуется внутри контура.
 */
export function S(d, base, shade, o = {}) {
  const id = nid('c')
  const off = o.off ?? [-9, -9]
  return `<g ${o.attr ?? ''}><clipPath id="${id}"><path d="${d}"/></clipPath>
    <path d="${d}" fill="${shade}"/>
    <g clip-path="url(#${id})"><path d="${d}" fill="${base}" transform="translate(${off[0]} ${off[1]})"/>${o.extra ?? ''}</g>
    <path d="${d}" fill="none" ${st(o.sw ?? 5, o.ink)}/></g>`
}

/** Скруглённый многоугольник → path (радиус скругления r). */
export function rounded(pts, r = 10, closed = true) {
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n]
    if (!closed && (i === 0 || i === n - 1)) { d += `${i ? 'L' : 'M'}${f1(p[0])} ${f1(p[1])}`; continue }
    const va = [a[0] - p[0], a[1] - p[1]], vb = [b[0] - p[0], b[1] - p[1]]
    const la = Math.hypot(...va) || 1, lb = Math.hypot(...vb) || 1
    const rr = Math.min(r, la / 2, lb / 2)
    const p1 = [p[0] + (va[0] / la) * rr, p[1] + (va[1] / la) * rr]
    const p2 = [p[0] + (vb[0] / lb) * rr, p[1] + (vb[1] / lb) * rr]
    d += `${i ? 'L' : 'M'}${f1(p1[0])} ${f1(p1[1])}Q${f1(p[0])} ${f1(p[1])} ${f1(p2[0])} ${f1(p2[1])}`
  }
  return d + (closed ? 'Z' : '')
}

/** Капсула (горизонтальная): x0..x1, центр y, толщина h. */
export const capsule = (x0, x1, y, h) => {
  const r = h / 2
  return `M${f1(x0 + r)} ${f1(y - r)}L${f1(x1 - r)} ${f1(y - r)}A${f1(r)} ${f1(r)} 0 0 1 ${f1(x1 - r)} ${f1(y + r)}L${f1(x0 + r)} ${f1(y + r)}A${f1(r)} ${f1(r)} 0 0 1 ${f1(x0 + r)} ${f1(y - r)}Z`
}

/** Круг как path (для clip/S). */
export const circlePath = (cx, cy, r) => `M${f1(cx - r)} ${f1(cy)}A${f1(r)} ${f1(r)} 0 1 0 ${f1(cx + r)} ${f1(cy)}A${f1(r)} ${f1(r)} 0 1 0 ${f1(cx - r)} ${f1(cy)}Z`
export const ellipsePath = (cx, cy, rx, ry) => `M${f1(cx - rx)} ${f1(cy)}A${f1(rx)} ${f1(ry)} 0 1 0 ${f1(cx + rx)} ${f1(cy)}A${f1(rx)} ${f1(ry)} 0 1 0 ${f1(cx - rx)} ${f1(cy)}Z`

/** Звёздочка/цветок из n лепестков — для декора. */
export const star = (cx, cy, R1, R2, n = 5, rot = -90) => {
  const pts = []
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180, r = i % 2 ? R2 : R1
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
  }
  return rounded(pts, 3)
}

/** Смешать два #hex-цвета (t=0 → a, t=1 → b). */
export function mix(a, b, t) {
  const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16))
  const A = h(a), B = h(b)
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')
}
export const darker = (c, t = 0.2) => mix(c, '#4A3470', t)
export const lighter = (c, t = 0.35) => mix(c, '#FFFFFF', t)
