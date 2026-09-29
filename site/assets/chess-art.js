// Scenery for the chess station: the landmark shown on the island map and the
// background of the station screen (both are plain SVG strings, like the other regions).
import { pieceInner } from './chess-pieces.js'

const INK = '#3B2F4F'
const PLUM = '#8E6BD6'
const PLUM_DARK = '#6B4FB8'
const CREAM = '#FFF4D6'
const STONE = '#E6DEFA'
const STONE_SHADE = '#CBBFEE'

const f1 = n => Math.round(n * 10) / 10

const stroke = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`
const path = (d, fill, w = 5, extra = '') => `<path d="${d}" fill="${fill}" ${w ? stroke(w) : ''} ${extra}/>`
const rect = (x, y, w, h, r, fill, sw = 5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${sw ? stroke(sw) : ''}/>`

/** A piece placed by its base centre: (cx, baseY) in the parent's units, `h` = drawn height of the 100-unit box. */
const piece = (ch, cx, baseY, h, flip = false) => {
  const k = h / 100
  const tx = cx - 50 * k
  const ty = baseY - 92 * k
  return `<g transform="translate(${f1(tx)} ${f1(ty)}) scale(${k})">${flip ? `<g transform="translate(100 0) scale(-1 1)">${pieceInner(ch)}</g>` : pieceInner(ch)}</g>`
}

// ---------------------------------------------------------------- island landmark
// Coordinates: origin = the spot on the ground, y grows downward, ~ -420..40 tall, ±200 wide.
export function chessLandmark() {
  let s = `<ellipse cx="0" cy="8" rx="196" ry="17" fill="#2E5A1C" opacity="0.16"/>`

  // checkered platform (perspective-ish, 8 x 2 tiles)
  const yb = -18
  const yf = 16
  const rows = 2
  const cols = 8
  const xw = (t, i) => {
    const half = 168 + 22 * t
    return -half + (2 * half * i) / cols
  }
  const front = `M-190 ${yf} L190 ${yf} L190 ${yf + 16} Q190 ${yf + 24} 182 ${yf + 24} L-182 ${yf + 24} Q-190 ${yf + 24} -190 ${yf + 16} Z`
  s += path(front, PLUM_DARK, 5)
  for (let j = 0; j < rows; j++) {
    const t0 = j / rows
    const t1 = (j + 1) / rows
    const y0 = yb + (yf - yb) * t0
    const y1 = yb + (yf - yb) * t1
    for (let i = 0; i < cols; i++) {
      const dark = (i + j) % 2 === 0
      s += `<path d="M${f1(xw(t0, i))} ${f1(y0)} L${f1(xw(t0, i + 1))} ${f1(y0)} L${f1(xw(t1, i + 1))} ${f1(y1)} L${f1(xw(t1, i))} ${f1(y1)} Z" fill="${dark ? PLUM : CREAM}"/>`
    }
  }
  s += `<path d="M${xw(0, 0)} ${yb} L${xw(0, cols)} ${yb} L${xw(1, cols)} ${yf} L${xw(1, 0)} ${yf} Z" fill="none" ${stroke(5)}/>`

  // the rook tower in the middle
  let tower = ''
  tower += path('M-56 -20 L-56 -236 L56 -236 L56 -20 Z', STONE, 5)
  tower += path('M28 -236 L56 -236 L56 -20 L34 -20 Z', STONE_SHADE, 0)
  // checkered band
  for (let i = 0; i < 7; i++) tower += `<rect x="${-56 + i * 16}" y="-120" width="16" height="16" fill="${i % 2 ? CREAM : PLUM}"/><rect x="${-56 + i * 16}" y="-104" width="16" height="16" fill="${i % 2 ? PLUM : CREAM}"/>`
  tower += `<rect x="-56" y="-120" width="112" height="32" fill="none" ${stroke(4)}/>`
  tower += path('M-56 -20 L-56 -236 L56 -236 L56 -20 Z', 'none', 5)
  // door and window
  tower += path('M-24 -20 L-24 -62 A24 24 0 0 1 24 -62 L24 -20 Z', PLUM_DARK, 5)
  tower += `<circle cx="14" cy="-42" r="3.4" fill="#FFD93D"/>`
  tower += path('M-13 -160 L-13 -186 A13 13 0 0 1 13 -186 L13 -160 Z', '#FFE38A', 4.5)
  // top: slab + merlons
  tower += rect(-70, -262, 140, 26, 8, STONE, 5)
  for (const x of [-70, -22, 26]) tower += rect(x, -296, 44, 38, 6, STONE, 5)
  tower += path('M4 -262 L44 -262 L44 -236 L4 -236 Z', STONE_SHADE, 0, 'opacity="0.0"')
  // flag
  tower += `<path d="M0 -296 L0 -350" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  tower += path('M2 -350 L46 -336 L2 -320 Z', '#FF5A5F', 4.5)
  s += tower

  // pieces on the platform: white king (left) and black knight (right) facing the tower
  s += piece('K', -142, -2, 156)
  s += piece('n', 142, -2, 148)
  // little pawns in front
  s += piece('P', -84, 22, 60)
  s += piece('p', 86, 22, 60)

  // floating sparkles: reuse the "note" bobbing animation of the map
  s += `<g class="lm-note"><g transform="translate(-176 -250)">${path('M0 -16 L5 -5 L17 -4 L8 4 L11 16 L0 9 L-11 16 L-8 4 L-17 -4 L-5 -5 Z', '#FFD93D', 4)}</g></g>`
  s += `<g class="lm-note"><g transform="translate(170 -230)">${path('M0 -14 L4 -4 L15 -3 L7 4 L9 14 L0 8 L-9 14 L-7 4 L-15 -3 L-4 -4 Z', '#FF8FC8', 4)}</g></g>`
  return s
}

// ---------------------------------------------------------------- station background (1600 x 1000)
let seq = 0
export function chessBackground(r, sky) {
  const id = `${r || 'cb'}${++seq}`
  const top = sky?.[0] ?? '#DCD2FF'
  const bot = sky?.[1] ?? '#F7F3FF'
  let s = `<defs>
    <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>
    <linearGradient id="${id}haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.85"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
  </defs>`
  s += `<rect width="1600" height="1000" fill="url(#${id}sky)"/>`

  // sun
  s += `<circle cx="250" cy="170" r="96" fill="#FFF6C8" opacity="0.55"/><circle cx="250" cy="170" r="60" fill="#FFE585"/><circle cx="238" cy="158" r="48" fill="#FFF0A8"/>`

  // clouds (animated by animateBackground: .bg-cloud with data-x)
  const cloud = (x, y, k) =>
    `<g class="bg-cloud" data-x="${x}"><g transform="translate(${x} ${y}) scale(${k})"><g fill="#FFFFFF" stroke="${INK}" stroke-width="${f1(5 / k)}" stroke-linejoin="round"><circle cx="-56" cy="8" r="36"/><circle cx="-8" cy="-10" r="48"/><circle cx="48" cy="6" r="38"/><rect x="-92" y="6" width="176" height="38" rx="19"/></g><g fill="#FFFFFF"><circle cx="-56" cy="8" r="33"/><circle cx="-8" cy="-10" r="45"/><circle cx="48" cy="6" r="35"/><rect x="-89" y="9" width="170" height="32" rx="16"/></g></g></g>`
  s += cloud(620, 150, 0.85) + cloud(1180, 110, 0.7) + cloud(1450, 260, 0.6)

  // far hills
  s += path('M-20 640 C120 540 260 520 420 590 C560 520 700 500 860 570 C1000 510 1180 520 1320 580 C1440 540 1540 550 1620 600 L1620 700 L-20 700 Z', '#D3C9F2', 0)
  s += path('M-20 660 C140 600 300 610 460 640 C640 590 800 600 960 640 C1160 590 1380 600 1620 650 L1620 720 L-20 720 Z', '#E4DDF8', 0)

  // the big castle on the right
  const cx = 1230
  let castle = ''
  castle += path(`M${cx - 200} 640 L${cx - 200} 430 L${cx + 200} 430 L${cx + 200} 640 Z`, STONE, 5)
  castle += path(`M${cx + 90} 430 L${cx + 200} 430 L${cx + 200} 640 L${cx + 110} 640 Z`, STONE_SHADE, 0)
  castle += path(`M${cx - 200} 430 L${cx - 200} 430 L${cx + 200} 430`, 'none', 0)
  castle += path(`M${cx - 200} 640 L${cx - 200} 430 L${cx + 200} 430 L${cx + 200} 640 Z`, 'none', 5)
  for (const [tx, w, h] of [[cx - 200, 92, 250], [cx + 108, 92, 250], [cx - 46, 92, 330]]) {
    castle += rect(tx, 640 - h, w, h, 6, STONE, 5)
    castle += path(`M${tx + w * 0.62} ${640 - h + 8} L${tx + w - 2} ${640 - h + 8} L${tx + w - 2} 638 L${tx + w * 0.62} 638 Z`, STONE_SHADE, 0)
    castle += rect(tx - 12, 640 - h - 26, w + 24, 26, 8, STONE, 5)
    for (let m = 0; m < 3; m++) castle += rect(tx - 12 + m * ((w + 24 - 32) / 2), 640 - h - 26 - 26, 32, 28, 5, STONE, 5)
    castle += path(`M${tx + w / 2 - 12} ${640 - h + 70} L${tx + w / 2 - 12} ${640 - h + 44} A12 12 0 0 1 ${tx + w / 2 + 12} ${640 - h + 44} L${tx + w / 2 + 12} ${640 - h + 70} Z`, '#FFE38A', 4.5)
  }
  castle += path(`M${cx - 44} 640 L${cx - 44} 566 A44 44 0 0 1 ${cx + 44} 566 L${cx + 44} 640 Z`, PLUM_DARK, 5)
  castle += `<path d="M${cx} ${640 - 330 - 52} L${cx} ${640 - 330 - 120}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` + path(`M${cx + 2} ${640 - 330 - 120} L${cx + 56} ${640 - 330 - 102} L${cx + 2} ${640 - 330 - 84} Z`, '#FF5A5F', 4.5)
  s += `<g class="bg-float">${castle}</g>`

  // distant statues
  s += `<g transform="translate(420 0)">${piece('Q', 0, 650, 250)}</g>`
  s += piece('n', 720, 646, 210)

  // checkered floor in perspective
  const y0 = 640
  const y1 = 1000
  const cols = 16
  const rows = 9
  const yAt = k => y0 + (y1 - y0) * Math.pow(k / rows, 1.55)
  const wAt = y => 96 + ((y - y0) / (y1 - y0)) * 210
  const dark = '#C9B6F5'
  const light = '#FFF7E0'
  s += `<rect x="0" y="${y0 - 4}" width="1600" height="${y1 - y0 + 8}" fill="${light}"/>`
  for (let k = 0; k < rows; k++) {
    const ya = yAt(k)
    const yb = yAt(k + 1)
    const wa = wAt(ya)
    const wb = wAt(yb)
    for (let i = -cols / 2; i < cols / 2; i++) {
      if ((i + k) % 2 !== 0) continue
      s += `<path d="M${f1(800 + i * wa)} ${f1(ya)} L${f1(800 + (i + 1) * wa)} ${f1(ya)} L${f1(800 + (i + 1) * wb)} ${f1(yb)} L${f1(800 + i * wb)} ${f1(yb)} Z" fill="${dark}"/>`
    }
  }
  s += `<path d="M0 ${y0 - 2} L1600 ${y0 - 2}" stroke="${INK}" stroke-width="5" stroke-opacity="0.85"/>`
  s += `<rect x="0" y="${y0 - 4}" width="1600" height="120" fill="url(#${id}haze)"/>`

  // pieces standing on the floor at the sides
  s += piece('r', 1505, 700, 170)

  // twinkles
  const tw = (x, y, r0) => `<path class="bg-twinkle" data-i="${x}" transform="translate(${x} ${y})" d="M0 ${-r0} Q${f1(r0 * 0.18)} ${f1(-r0 * 0.18)} ${r0} 0 Q${f1(r0 * 0.18)} ${f1(r0 * 0.18)} 0 ${r0} Q${f1(-r0 * 0.18)} ${f1(r0 * 0.18)} ${-r0} 0 Q${f1(-r0 * 0.18)} ${f1(-r0 * 0.18)} 0 ${-r0}Z" fill="#FFFFFF"/>`
  s += tw(520, 260, 14) + tw(900, 200, 11) + tw(1120, 300, 13) + tw(1500, 190, 12) + tw(700, 350, 9)
  return s
}

/** The station's activity icons (used by the world registry). */
export const boardIcon = () => {
  let s = ''
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) s += `<rect x="${10 + i * 20}" y="${10 + j * 20}" width="20" height="20" fill="${(i + j) % 2 ? '#8E6BD6' : '#FFF4D6'}"/>`
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${s}<rect x="10" y="10" width="80" height="80" rx="4" fill="none" stroke="${INK}" stroke-width="5"/></svg>`
}
