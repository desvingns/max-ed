// Chess piece artwork + vocabulary (names in Russian, grammatical cases used by the voice lines).
// Pieces are drawn as inline SVG in the same chunky outlined style as the rest of the island.

export const PIECE_TYPES = ['k', 'q', 'r', 'b', 'n', 'p']

const INK = { w: '#3B2F4F', b: '#231A3A' }
const PAL = {
  w: { fill: '#FFF8E8', shade: '#E7D3A8', hi: '#FFFFFF' },
  b: { fill: '#6552A3', shade: '#42357A', hi: '#9C8AD8' },
}

const rr = (x, y, w, h, r) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`

function shapes(t) {
  // each entry: [element markup (no paint), kind] kind: 'body' | 'part'
  // shade / highlight overlays are plain paths drawn without stroke.
  const base = {
    plinth: '<path d="M22 92 V86 Q22 81 27 81 H73 Q78 81 78 86 V92 Z"/>',
    plinthShade: '<path d="M60 82.5 H73 Q76.5 82.5 77 86 V90.5 H60 Z"/>',
    plinthHi: '<path d="M26 85 H42" stroke-width="2.6" fill="none"/>',
  }
  switch (t) {
    case 'p':
      return {
        base,
        parts: [
          '<path d="M39 46 Q41 64 30 81 H70 Q59 64 61 46 Z"/>',
          rr(33, 40, 34, 9, 4.5),
          '<circle cx="50" cy="27" r="14"/>',
        ],
        shade: ['<path d="M61 47 Q59 64 70 81 H62 Q54 64 55 47 Z"/>', '<path d="M59 27 A14 14 0 0 1 50 41 A14 14 0 0 0 59 27 Z"/>'],
        hi: ['<path d="M43 52 Q44 64 38 76" stroke-width="3" fill="none"/>', '<path d="M41 22 Q43 17 48 16" stroke-width="3.4" fill="none"/>'],
      }
    case 'r':
      return {
        base,
        parts: [
          '<path d="M35 42 H65 L69 81 H31 Z"/>',
          '<path d="M29 16 H40 V24 H45 V16 H55 V24 H60 V16 H71 V36 Q71 39 68 39 H32 Q29 39 29 36 Z"/>',
          rr(31, 37, 38, 9, 4),
        ],
        shade: ['<path d="M62 46 H65 L69 81 H60 Z"/>', '<path d="M62 18 H70 V36 H62 Z"/>'],
        hi: ['<path d="M39 50 L37 76" stroke-width="3" fill="none"/>', '<path d="M32 20 V33" stroke-width="3" fill="none"/>'],
      }
    case 'b':
      return {
        base,
        parts: [
          '<path d="M40 52 Q42 66 30 81 H70 Q58 66 60 52 Z"/>',
          rr(34, 47, 32, 9, 4.5),
          '<path d="M50 13 Q68 27 65 40 Q63 49 50 49 Q37 49 35 40 Q32 27 50 13 Z"/>',
          '<circle cx="50" cy="10" r="4.6"/>',
        ],
        shade: ['<path d="M60 52 Q58 66 70 81 H62 Q54 66 54 52 Z"/>', '<path d="M58 28 Q65 36 64 41 Q62 49 52 49 Q60 42 58 28 Z"/>'],
        hi: ['<path d="M40 38 Q40 30 46 22" stroke-width="3.2" fill="none"/>', '<path d="M43 58 Q44 68 38 77" stroke-width="3" fill="none"/>'],
        cut: '<path d="M52 24 L59 32" stroke-width="3.6" fill="none"/>',
      }
    case 'q':
      return {
        base,
        parts: [
          '<path d="M38 50 Q40 66 28 81 H72 Q60 66 62 50 Z"/>',
          '<path d="M31 46 L24 24 L38 34 L43 17 L50 33 L57 17 L62 34 L76 24 L69 46 Z"/>',
          rr(32, 43, 36, 9, 4.5),
          '<circle cx="24" cy="21" r="4.3"/><circle cx="43" cy="14" r="4.3"/><circle cx="57" cy="14" r="4.3"/><circle cx="76" cy="21" r="4.3"/>',
        ],
        shade: ['<path d="M62 50 Q60 66 72 81 H63 Q54 66 55 50 Z"/>', '<path d="M62 34 L76 24 L69 46 L60 46 Z"/>'],
        hi: ['<path d="M42 56 Q43 68 36 77" stroke-width="3" fill="none"/>', '<path d="M31 38 L27 28" stroke-width="3" fill="none"/>'],
      }
    case 'k':
      return {
        base,
        parts: [
          '<path d="M38 50 Q40 66 28 81 H72 Q60 66 62 50 Z"/>',
          '<path d="M46 5 H54 V11 H60 V18 H54 V25 H46 V18 H40 V11 H46 Z"/>',
          '<path d="M30 46 Q26 30 39 26 H61 Q74 30 70 46 Z"/>',
          rr(32, 43, 36, 9, 4.5),
        ],
        shade: ['<path d="M62 50 Q60 66 72 81 H63 Q54 66 55 50 Z"/>', '<path d="M61 28 Q72 32 70 46 H60 Q64 36 61 28 Z"/>'],
        hi: ['<path d="M42 56 Q43 68 36 77" stroke-width="3" fill="none"/>', '<path d="M37 40 Q36 33 42 30" stroke-width="3.2" fill="none"/>'],
      }
    case 'n':
      return {
        base,
        parts: [
          '<path d="M27 81 C27 69 31 61 39 55 C33 56 27 58 21 55 C14 51 14 45 18 41 C24 36 30 33 33 26 L35 16 L43 22 L47 10 L53 21 C67 24 77 38 77 57 C77 67 75 75 73 81 Z"/>',
        ],
        shade: ['<path d="M60 26 C70 30 77 42 77 57 C77 67 75 75 73 81 H62 C67 70 68 58 66 46 C65 38 63 31 60 26 Z"/>'],
        hi: ['<path d="M24 46 Q28 40 34 36" stroke-width="3" fill="none"/>', '<path d="M32 74 Q32 66 36 62" stroke-width="3" fill="none"/>'],
        knight: true,
      }
  }
  return null
}

const cache = new Map()

/**
 * SVG markup for a piece. `ch` is a FEN character ('N' = white knight, 'q' = black queen).
 * opts.face — adds a friendly face (used on lesson cards).
 */
export function pieceSvg(ch, opts = {}) {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" overflow="visible">${pieceInner(ch, opts)}</svg>`
}

/** The drawing without the <svg> wrapper (100 x 100 units) — for nesting inside bigger scenes. */
export function pieceInner(ch, opts = {}) {
  const key = ch + (opts.face ? '!' : '')
  const hit = cache.get(key)
  if (hit) return hit
  const white = ch === ch.toUpperCase()
  const c = white ? 'w' : 'b'
  const t = ch.toLowerCase()
  const pal = PAL[c]
  const ink = INK[c]
  const s = shapes(t)
  const paint = (markup, fill) => markup.replace(/<(path|rect|circle)/g, `<$1 fill="${fill}" stroke="${ink}" stroke-width="4.6" stroke-linejoin="round" stroke-linecap="round"`)
  const plain = (markup, fill, op = 1) => markup.replace(/<(path|rect|circle)/g, `<$1 fill="${fill}" fill-opacity="${op}" stroke="none"`)
  const line = (markup, color, op = 1) => markup.replace(/<path/g, `<path stroke="${color}" stroke-opacity="${op}" stroke-linecap="round"`)
  let out = `<ellipse cx="50" cy="94" rx="30" ry="4.5" fill="#3B2F4F" opacity=".16"/>`
  out += paint(s.base.plinth, pal.fill)
  out += plain(s.base.plinthShade, pal.shade, 0.9)
  out += line(s.base.plinthHi, pal.hi, 0.9)
  for (const part of s.parts) out += paint(part, pal.fill)
  for (const sh of s.shade) out += plain(sh, pal.shade, 0.85)
  for (const h of s.hi) out += line(h, pal.hi, white ? 1 : 0.8)
  if (s.cut) out += line(s.cut, ink, 1)
  if (s.knight) {
    out += `<circle cx="37" cy="34" r="3.4" fill="${ink}"/><circle cx="36" cy="33" r="1.1" fill="#fff"/>`
    out += `<circle cx="20.5" cy="45" r="1.9" fill="${ink}"/>`
    out += `<path d="M18.5 51 Q25 53 31 51" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`
    out += `<path d="M58 24 Q71 32 72 47 M60 39 Q70 45 71 58 M62 55 Q69 60 70 71" fill="none" stroke="${white ? '#B79A66' : '#8B7BC4'}" stroke-width="3" stroke-linecap="round"/>`
  }
  if (opts.face) out += faceMarkup(t, ink)
  cache.set(key, out)
  return out
}

function faceMarkup(t, ink) {
  // eyes + smile placed on the body / head of each piece
  const at = { p: [50, 28, 1], r: [50, 58, 1.1], b: [50, 34, 1], q: [50, 62, 1.1], k: [50, 62, 1.1] }[t]
  if (!at) return ''
  const [x, y, s] = at
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-7" cy="0" r="2.6" fill="${ink}"/><circle cx="7" cy="0" r="2.6" fill="${ink}"/><path d="M-5 6 Q0 11 5 6" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/><circle cx="-11" cy="5" r="2.6" fill="#FF8FAB" opacity=".6"/><circle cx="11" cy="5" r="2.6" fill="#FF8FAB" opacity=".6"/></g>`
}

/** Sticker / icon art for the album: "chess:<colour><type>" e.g. chess:wk */
export function chessArt(code) {
  const c = code[0] === 'b' ? 'b' : 'w'
  return pieceSvg(c === 'w' ? code[1].toUpperCase() : code[1].toLowerCase(), { face: true })
}

// ---------------------------------------------------------------- vocabulary
export const PIECE = {
  k: { ru: 'король', acc: 'короля', gen: 'короля', gender: 'm', value: 0, mark: 'K', short: 'Самая главная фигура' },
  q: { ru: 'ферзь', acc: 'ферзя', gen: 'ферзя', gender: 'm', value: 9, mark: 'Q', short: 'Самая сильная фигура' },
  r: { ru: 'ладья', acc: 'ладью', gen: 'ладьи', gender: 'f', value: 5, mark: 'R', short: 'Похожа на башню' },
  b: { ru: 'слон', acc: 'слона', gen: 'слона', gender: 'm', value: 3, mark: 'B', short: 'Ходит по косым линиям' },
  n: { ru: 'конь', acc: 'коня', gen: 'коня', gender: 'm', value: 3, mark: 'N', short: 'Прыгает буквой Г' },
  p: { ru: 'пешка', acc: 'пешку', gen: 'пешки', gender: 'f', value: 1, mark: 'P', short: 'Идёт вперёд' },
}

export const COLOR_RU = {
  w: { m: 'белый', f: 'белая', name: 'белые', plural: 'белых' },
  b: { m: 'чёрный', f: 'чёрная', name: 'чёрные', plural: 'чёрных' },
}

/** "белый король" / "чёрная ладья" for a FEN character. */
export function pieceFullName(ch) {
  const c = ch === ch.toUpperCase() ? 'w' : 'b'
  const t = ch.toLowerCase()
  return `${COLOR_RU[c][PIECE[t].gender]} ${PIECE[t].ru}`
}

export const FILE_RU = ['а', 'бэ', 'цэ', 'дэ', 'е', 'эф', 'жэ', 'аш']
export const RANK_RU = ['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь']
