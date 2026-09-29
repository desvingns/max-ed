// Interactive chessboard used by every chess activity.
//
// Board coordinates ("local frame") always have White at the bottom: square (file f, rank r) lives at
// left = f * S, top = (7 - r) * S. The whole board can be rotated by a multiple of 90° (rot) for
// players who sit on another side of the tablet; pieces and labels are counter-rotated so each
// person sees them upright (viewW / viewB = the screen rotation of White's / Black's viewer).
import { t as gsap } from './gsap-CvDoa17S.js'
import { t as audio } from './audio-BEkH9VRF.js'
import { o as fx } from './index-rPMhTJWI.js'
import { pieceSvg, pieceInner } from './chess-pieces.js'
import { FILES, colorOf, typeOf, isLight } from './chess-engine.js'

export const THEME = { light: '#FFF1CF', dark: '#8FD3A8', frame: '#FFFFFF', label: '#7A5CC7' }

const CSS = `
.cb{position:absolute;touch-action:none;user-select:none;-webkit-user-select:none}
.cb-frame{position:absolute;border-radius:30px;background:#fff;box-shadow:0 12px 0 rgba(59,47,79,.2),inset 0 0 0 6px #EFE4FF}
.cb-grid{position:absolute;left:0;top:0;border-radius:12px;overflow:hidden;box-shadow:0 0 0 4px rgba(59,47,79,.85)}
.cb-grid svg{display:block}
.cb-layer{position:absolute;left:0;top:0;pointer-events:none}
.cb-p{position:absolute;left:0;top:0;will-change:transform}
.cb-p svg{width:100%;height:100%;display:block;overflow:visible}
.cb-mk{position:absolute;box-sizing:border-box;pointer-events:none}
.cb-lbl{position:absolute;display:grid;place-items:center;font:900 24px/1 var(--font);color:${THEME.label};pointer-events:none}
.cb-shadow{filter:drop-shadow(0 6px 5px rgba(0,0,0,.28))}
`

function ensureCss() {
  if (document.getElementById('cb-css')) return
  const st = document.createElement('style')
  st.id = 'cb-css'
  st.textContent = CSS
  document.head.appendChild(st)
}

const rad = d => (d * Math.PI) / 180
const norm = d => ((d % 360) + 540) % 360 - 180 // → (-180, 180]

/**
 * createBoard(s, opts) — s is the scene context.
 * opts: x, y (centre on stage), size (square px), rot, viewW, viewB, labels ('edge' | 'both' | 'none'),
 *       interactive (default true), frame (default true)
 */
export function createBoard(s, opts = {}) {
  ensureCss()
  const S = opts.size ?? 96
  const cx = opts.x ?? 800
  const cy = opts.y ?? 500
  const rot = opts.rot ?? 0
  const viewW = opts.viewW ?? 0
  const viewB = opts.viewB ?? viewW
  const W = 8 * S
  const pad = Math.max(24, Math.round(S * 0.36))

  const root = document.createElement('div')
  root.className = 'cb'
  root.style.cssText = `left:${cx - W / 2}px;top:${cy - W / 2}px;width:${W}px;height:${W}px;transform:rotate(${rot}deg);transform-origin:50% 50%`
  const frame = document.createElement('div')
  frame.className = 'cb-frame'
  frame.style.cssText = `left:${-pad}px;top:${-pad}px;width:${W + 2 * pad}px;height:${W + 2 * pad}px`
  if (opts.frame === false) frame.style.display = 'none'
  const grid = document.createElement('div')
  grid.className = 'cb-grid'
  grid.style.cssText = `width:${W}px;height:${W}px`
  let squares = ''
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      squares += `<rect x="${f * S}" y="${(7 - r) * S}" width="${S}" height="${S}" fill="${isLight(r * 8 + f) ? THEME.light : THEME.dark}"/>`
    }
  }
  grid.innerHTML = `<svg width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">${squares}</svg>`
  const marksLayer = document.createElement('div')
  marksLayer.className = 'cb-layer'
  const piecesLayer = document.createElement('div')
  piecesLayer.className = 'cb-layer'
  const dotsLayer = document.createElement('div')
  dotsLayer.className = 'cb-layer'
  const lblLayer = document.createElement('div')
  lblLayer.className = 'cb-layer'
  root.append(frame, grid, marksLayer, piecesLayer, dotsLayer, lblLayer)
  ;(opts.parent ?? s.root).appendChild(root)

  const pieceEls = new Map() // sq -> element
  const marks = new Map() // `${kind}:${sq}` -> element
  const cell = sq => ({ x: (sq & 7) * S, y: (7 - (sq >> 3)) * S })
  const localRotFor = ch => norm((colorOf(ch) === 'w' ? viewW : viewB) - rot)
  const upW = norm(viewW - rot)

  const api = {
    el: root,
    S,
    rot,
    center: { x: cx, y: cy },
    upW,
    handlers: {},
    pieceEls,

    // ---------------------------------------------------------------- geometry
    /** stage centre of a square */
    stagePoint(sq) {
      const c = cell(sq)
      const lx = c.x + S / 2 - W / 2
      const ly = c.y + S / 2 - W / 2
      const a = rad(rot)
      return { x: cx + lx * Math.cos(a) - ly * Math.sin(a), y: cy + lx * Math.sin(a) + ly * Math.cos(a) }
    },
    /** square under a stage point, or -1 */
    sqAt(px, py) {
      const dx = px - cx
      const dy = py - cy
      const a = -rad(rot)
      const lx = dx * Math.cos(a) - dy * Math.sin(a) + W / 2
      const ly = dx * Math.sin(a) + dy * Math.cos(a) + W / 2
      const f = Math.floor(lx / S)
      const r = 7 - Math.floor(ly / S)
      return f < 0 || f > 7 || r < 0 || r > 7 ? -1 : r * 8 + f
    },

    // ---------------------------------------------------------------- pieces
    makePiece(ch) {
      const el = document.createElement('div')
      el.className = 'cb-p'
      el.dataset.piece = ch
      el.style.cssText = `width:${S}px;height:${S}px;`
      el.innerHTML = pieceSvg(ch)
      return el
    },
    put(sq, ch, { pop = false, delay = 0 } = {}) {
      api.removeAt(sq, { silent: true })
      const el = api.makePiece(ch)
      const c = cell(sq)
      piecesLayer.appendChild(el)
      gsap.set(el, { x: c.x, y: c.y, rotation: localRotFor(ch), transformOrigin: '50% 60%' })
      pieceEls.set(sq, el)
      if (pop) s.fromTo(el, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.2)', delay })
      return el
    },
    removeAt(sq, { silent = false } = {}) {
      const el = pieceEls.get(sq)
      if (!el) return
      pieceEls.delete(sq)
      gsap.killTweensOf(el)
      el.remove()
      void silent
    },
    /** replace all pieces with a 64-element array of FEN chars */
    setPieces(arr, { pop = false } = {}) {
      for (const sq of [...pieceEls.keys()]) api.removeAt(sq)
      let i = 0
      for (let sq = 0; sq < 64; sq++) if (arr[sq]) api.put(sq, arr[sq], { pop, delay: pop ? (i++ % 16) * 0.03 : 0 })
    },
    /** array of the current pieces (FEN chars) */
    snapshot() {
      const out = new Array(64).fill(0)
      for (const [sq, el] of pieceEls) out[sq] = el.dataset.piece
      return out
    },
    pieceAt: sq => pieceEls.get(sq) ?? null,
    charAt: sq => pieceEls.get(sq)?.dataset.piece ?? 0,

    /** Animate an engine move (handles capture, en passant, castling and promotion). */
    async animateMove(m, { duration } = {}) {
      const el = pieceEls.get(m.from)
      if (!el) return
      const mover = colorOf(m.piece)
      const capSq = m.flag === 'e' ? m.to + (mover === 'w' ? -8 : 8) : m.cap ? m.to : -1
      const capEl = capSq >= 0 ? pieceEls.get(capSq) : null
      pieceEls.delete(m.from)
      if (capEl) pieceEls.delete(capSq)
      el.style.zIndex = '30'
      const to = cell(m.to)
      const dist = Math.hypot(((m.to & 7) - (m.from & 7)) * S, ((m.to >> 3) - (m.from >> 3)) * S)
      const d = duration ?? Math.min(0.55, 0.22 + dist / (S * 14))
      const knight = typeOf(m.piece) === 'n'
      audio.sfx('swish', { vol: 0.5, pitch: 0.9 + Math.random() * 0.2 })
      const tl = s.timeline()
      tl.to(el, { x: to.x, y: to.y, duration: d, ease: knight ? 'sine.inOut' : 'power2.inOut' }, 0)
      tl.to(el, { scale: knight ? 1.35 : 1.12, duration: d / 2, ease: 'sine.out', yoyo: true, repeat: 1 }, 0)
      // castling rook
      if (m.flag === 'K' || m.flag === 'Q') {
        const rf = m.flag === 'K' ? m.to + 1 : m.to - 2
        const rt = m.flag === 'K' ? m.to - 1 : m.to + 1
        const rel = pieceEls.get(rf)
        if (rel) {
          pieceEls.delete(rf)
          const c2 = cell(rt)
          tl.to(rel, { x: c2.x, y: c2.y, duration: d, ease: 'power2.inOut' }, 0.05)
          tl.to(rel, { scale: 1.3, duration: d / 2, ease: 'sine.out', yoyo: true, repeat: 1 }, 0.05)
          pieceEls.set(rt, rel)
        }
      }
      await tl
      el.style.zIndex = ''
      if (capEl) {
        const p = api.stagePoint(capSq)
        fx.starBurst(p.x, p.y, 7, { sound: false })
        audio.sfx('thud', { vol: 0.7 })
        s.to(capEl, { scale: 0, opacity: 0, rotation: '+=120', duration: 0.3, ease: 'back.in(2)', onComplete: () => capEl.remove() })
      } else audio.sfx('plop', { vol: 0.55, pitch: 1.1 })
      pieceEls.set(m.to, el)
      if (m.promo) {
        el.dataset.piece = m.promo
        el.innerHTML = pieceSvg(m.promo)
        gsap.set(el, { rotation: localRotFor(m.promo) })
        s.fromTo(el, { scale: 0.4 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1.2,0.4)' })
        const p = api.stagePoint(m.to)
        fx.starBurst(p.x, p.y, 10, { sound: false })
        audio.sfx('magic')
      }
    },
    /** slide a piece home after a rejected drag */
    async returnPiece(sq) {
      const el = pieceEls.get(sq)
      if (!el) return
      const c = cell(sq)
      await s.to(el, { x: c.x, y: c.y, scale: 1, duration: 0.3, ease: 'back.out(1.6)' })
      el.style.zIndex = ''
    },
    /** move a lone piece without rules (lessons); returns when finished */
    async slide(from, to, { hop = false, duration = 0.5 } = {}) {
      const el = pieceEls.get(from)
      if (!el) return
      pieceEls.delete(from)
      const cap = pieceEls.get(to)
      if (cap) {
        pieceEls.delete(to)
        s.to(cap, { scale: 0, opacity: 0, duration: 0.25, onComplete: () => cap.remove() })
      }
      const c = cell(to)
      el.style.zIndex = '30'
      const tl = s.timeline()
      tl.to(el, { x: c.x, y: c.y, duration, ease: 'power2.inOut' }, 0)
      tl.to(el, { scale: hop ? 1.35 : 1.1, duration: duration / 2, yoyo: true, repeat: 1, ease: 'sine.out' }, 0)
      audio.sfx('swish', { vol: 0.5 })
      await tl
      el.style.zIndex = ''
      pieceEls.set(to, el)
      audio.sfx('plop', { vol: 0.5, pitch: 1.15 })
    },
    /** little hop / wiggle of a piece */
    bounce(sq) {
      const el = pieceEls.get(sq)
      if (!el) return
      s.timeline().to(el, { y: '-=' + S * 0.22, duration: 0.16, ease: 'power2.out' }).to(el, { y: '+=' + S * 0.22, duration: 0.4, ease: 'bounce.out' })
    },
    shake(sq) {
      const el = pieceEls.get(sq)
      if (!el) return
      s.to(el, { keyframes: { x: [`+=0`, `+=${S * 0.08}`, `-=${S * 0.16}`, `+=${S * 0.12}`, `-=${S * 0.08}`, `+=${S * 0.04}`] }, duration: 0.45, ease: 'none' })
    },

    // ---------------------------------------------------------------- marks (squares highlights, dots, stars)
    mark(sq, kind = 'focus', o = {}) {
      const key = `${kind}:${sq}`
      marks.get(key)?.remove()
      const c = cell(sq)
      const el = document.createElement('div')
      el.className = 'cb-mk'
      el.dataset.kind = kind
      el.style.cssText = `left:${c.x}px;top:${c.y}px;width:${S}px;height:${S}px;`
      let layer = marksLayer
      switch (kind) {
        case 'sel':
          el.style.background = 'rgba(255,224,102,.9)'
          el.style.boxShadow = 'inset 0 0 0 5px #FFC93C'
          break
        case 'last':
          el.style.background = 'rgba(255,196,90,.55)'
          break
        case 'focus':
          el.style.background = o.color ?? 'rgba(179,136,235,.65)'
          el.style.boxShadow = 'inset 0 0 0 5px rgba(122,92,199,.9)'
          break
        case 'line':
          el.style.background = o.color ?? 'rgba(98,198,255,.6)'
          break
        case 'good':
          el.style.background = 'rgba(138,201,38,.75)'
          break
        case 'bad':
          el.style.background = 'rgba(255,90,95,.6)'
          break
        case 'check':
          el.style.background = 'radial-gradient(circle,rgba(255,60,70,.95) 0%,rgba(255,60,70,.55) 45%,rgba(255,60,70,0) 75%)'
          break
        case 'hint':
          layer = dotsLayer
          el.style.boxShadow = 'inset 0 0 0 6px #62C6FF'
          el.style.borderRadius = '14%'
          s.fromTo(el, { opacity: 0.35 }, { opacity: 1, duration: 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
          break
        case 'dot': {
          layer = dotsLayer
          const d = S * 0.3
          el.innerHTML = `<div style="position:absolute;left:${(S - d) / 2}px;top:${(S - d) / 2}px;width:${d}px;height:${d}px;border-radius:50%;background:${o.color ?? 'rgba(92,64,170,.62)'};box-shadow:0 0 0 ${S * 0.03}px rgba(255,255,255,.55)"></div>`
          break
        }
        case 'cap':
          layer = dotsLayer
          el.style.borderRadius = '50%'
          el.style.boxShadow = `inset 0 0 0 ${Math.max(5, S * 0.09)}px ${o.color ?? 'rgba(255,70,80,.9)'}`
          break
        case 'ring':
          layer = dotsLayer
          el.style.borderRadius = '50%'
          el.style.boxShadow = `inset 0 0 0 ${Math.max(5, S * 0.08)}px ${o.color ?? '#FFC93C'}`
          break
        case 'star': {
          layer = dotsLayer
          const d = S * 0.72
          el.innerHTML = `<div class="cb-star" style="position:absolute;left:${(S - d) / 2}px;top:${(S - d) / 2}px;width:${d}px;height:${d}px;filter:drop-shadow(0 4px 0 rgba(0,0,0,.2))"><svg viewBox="0 0 100 100"><path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z" fill="#FFC93C" stroke="#3B2F4F" stroke-width="6" stroke-linejoin="round"/><ellipse cx="41" cy="40" rx="8" ry="5" fill="#fff" fill-opacity=".7" transform="rotate(-30 41 40)"/></svg></div>`
          const st = el.firstElementChild
          gsap.set(st, { rotation: upW })
          s.fromTo(st, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2.4)' })
          s.to(st, { y: -S * 0.08, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.5 })
          break
        }
        case 'flag': {
          layer = dotsLayer
          el.style.boxShadow = `inset 0 0 0 5px ${o.color ?? '#FF5A5F'}`
          el.style.background = 'rgba(255,90,95,.12)'
          break
        }
      }
      layer.appendChild(el)
      marks.set(key, el)
      if (o.flash) {
        s.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.14, yoyo: true, repeat: 3, onComplete: () => api.unmark(kind, sq) })
      }
      return el
    },
    marksOf: kind => [...marks.entries()].filter(([k]) => k.startsWith(kind + ':')).map(([k]) => Number(k.split(':')[1])),
    unmark(kind, sq) {
      for (const [k, el] of [...marks]) {
        const [kk, ss] = k.split(':')
        if ((kind == null || kk === kind) && (sq == null || Number(ss) === sq)) {
          gsap.killTweensOf(el)
          gsap.killTweensOf(el.querySelectorAll('*'))
          el.remove()
          marks.delete(k)
        }
      }
    },
    markMany(list, kind, o) {
      for (const sq of list) api.mark(sq, kind, o)
    },
    /** move dots (+ capture rings) for a list of destination squares */
    showMoves(list, { hidePiece = true } = {}) {
      api.unmark('dot')
      api.unmark('cap')
      for (const sq of list) {
        if (pieceEls.has(sq) && hidePiece) api.mark(sq, 'cap')
        else api.mark(sq, 'dot')
      }
    },
    clearMoves() {
      api.unmark('dot')
      api.unmark('cap')
    },
    clearMarks() {
      api.unmark()
    },
    /** highlight square briefly */
    flash(sq, kind = 'bad') {
      api.mark(sq, kind, { flash: true })
    },

    // ---------------------------------------------------------------- labels
    setLabels(mode = 'edge') {
      lblLayer.innerHTML = ''
      if (mode === 'none') return
      const fs = Math.max(18, Math.round(S * 0.27))
      const put = (txt, x, y, w, h, deg) => {
        const el = document.createElement('div')
        el.className = 'cb-lbl'
        el.textContent = txt
        el.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;font-size:${fs}px;transform:rotate(${deg}deg)`
        lblLayer.appendChild(el)
      }
      const degW = norm(viewW - rot)
      const degB = norm(viewB - rot)
      for (let i = 0; i < 8; i++) {
        put(FILES[i], i * S, W, S, pad, degW) // bottom
        put(String(i + 1), -pad, (7 - i) * S, pad, S, degW) // left
        if (mode === 'both') {
          put(FILES[i], i * S, -pad, S, pad, degB) // top
          put(String(i + 1), W, (7 - i) * S, pad, S, degB) // right
        }
      }
    },

    // ---------------------------------------------------------------- input
    /**
     * handlers: { canDrag(sq)->bool, down(sq), dragStart(sq), tap(sq), drop(from,to)->bool|Promise<bool> }
     */
    bind(h) {
      api.handlers = h
    },
    destroy() {
      gsap.killTweensOf(root.querySelectorAll('*'))
      root.remove()
    },
  }

  // pointer handling: tap, or drag a piece
  let drag = null
  const local = (p, p0) => {
    const a = -rad(rot)
    const dx = p.x - p0.x
    const dy = p.y - p0.y
    return { x: dx * Math.cos(a) - dy * Math.sin(a), y: dx * Math.sin(a) + dy * Math.cos(a) }
  }
  if (opts.interactive !== false) {
    s.on(root, 'pointerdown', e => {
      if (e.button > 0 || drag) return
      e.preventDefault()
      const p = s.stage.toLocal(e.clientX, e.clientY)
      const sq = api.sqAt(p.x, p.y)
      if (sq < 0) return
      const el = pieceEls.get(sq)
      const canDrag = !!el && !!api.handlers.canDrag?.(sq)
      drag = { id: e.pointerId, sq, el, canDrag, moved: false, p0: p, base: el ? { x: Number(gsap.getProperty(el, 'x')), y: Number(gsap.getProperty(el, 'y')) } : null }
      try {
        root.setPointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      api.handlers.down?.(sq)
    })
    s.on(root, 'pointermove', e => {
      if (!drag || e.pointerId !== drag.id || !drag.canDrag) return
      const p = s.stage.toLocal(e.clientX, e.clientY)
      const dist = Math.hypot(p.x - drag.p0.x, p.y - drag.p0.y)
      if (!drag.moved && dist > 12) {
        drag.moved = true
        drag.el.style.zIndex = '60'
        drag.el.classList.add('cb-shadow')
        gsap.to(drag.el, { scale: 1.18, duration: 0.15 })
        audio.sfx('pop', { vol: 0.4, pitch: 1.2 })
        api.handlers.dragStart?.(drag.sq)
      }
      if (drag.moved) {
        const d = local(p, drag.p0)
        gsap.set(drag.el, { x: drag.base.x + d.x, y: drag.base.y + d.y })
      }
    })
    const up = e => {
      if (!drag || e.pointerId !== drag.id) return
      const d = drag
      drag = null
      const p = s.stage.toLocal(e.clientX, e.clientY)
      if (d.moved) {
        d.el.classList.remove('cb-shadow')
        const to = api.sqAt(p.x, p.y)
        Promise.resolve(to >= 0 && to !== d.sq ? api.handlers.drop?.(d.sq, to) : false).then(ok => {
          if (!ok) api.returnPiece(d.sq)
        })
      } else if (e.type !== 'pointercancel') {
        const to = api.sqAt(p.x, p.y)
        api.handlers.tap?.(to >= 0 ? to : d.sq)
      }
    }
    s.on(root, 'pointerup', up)
    s.on(root, 'pointercancel', up)
  }

  api.setLabels(opts.labels ?? 'edge')
  return api
}

/** Static mini board as an SVG string (for choice cards). o: { pieces:{sq:ch}, dots:[sq], caps:[sq], stars:[sq], marks:[sq], size } */
export function boardThumb(o = {}) {
  const px = o.size ?? 200
  const u = 10
  let s = `<svg viewBox="0 0 80 80" width="${px}" height="${px}" xmlns="http://www.w3.org/2000/svg" style="border-radius:8px;overflow:hidden">`
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) s += `<rect x="${f * u}" y="${(7 - r) * u}" width="${u}" height="${u}" fill="${isLight(r * 8 + f) ? THEME.light : THEME.dark}"/>`
  for (const sq of o.marks ?? []) s += `<rect x="${(sq & 7) * u}" y="${(7 - (sq >> 3)) * u}" width="${u}" height="${u}" fill="rgba(255,196,90,.75)"/>`
  for (const [sq, ch] of Object.entries(o.pieces ?? {})) {
    const q = Number(sq)
    s += `<g transform="translate(${(q & 7) * u} ${(7 - (q >> 3)) * u}) scale(0.1)">${pieceInner(ch)}</g>`
  }
  for (const sq of o.dots ?? []) s += `<circle cx="${(sq & 7) * u + 5}" cy="${(7 - (sq >> 3)) * u + 5}" r="2.5" fill="#4D3B8C" fill-opacity=".75" stroke="#fff" stroke-opacity=".7" stroke-width=".6"/>`
  for (const sq of o.caps ?? []) s += `<circle cx="${(sq & 7) * u + 5}" cy="${(7 - (sq >> 3)) * u + 5}" r="4.2" fill="none" stroke="#FF4650" stroke-width="1.5"/>`
  for (const sq of o.stars ?? []) s += `<g transform="translate(${(sq & 7) * u + 5} ${(7 - (sq >> 3)) * u + 5}) scale(.085)"><path d="M0 -44 L12 -14 L44 -12 L19 8 L28 40 L0 22 L-28 40 L-19 8 L-44 -12 L-12 -14 Z" fill="#FFC93C" stroke="#3B2F4F" stroke-width="7" stroke-linejoin="round"/></g>`
  return s + '</svg>'
}
