// Кухонные «декорации»: плита с конфорками, фон-стол и т.п.
import { gsap, audio, kitchen } from './deps.js'
import { INK, svg, R, E, C, P, F, rounded, HL } from './art.js'

const CTR = kitchen.layout.counterY // 720
const BURNER_DX = [120, 320]

/**
 * Плита из фона-кухни, но «живая»: ручки крутятся, огонь загорается.
 * const st = k.stove()      → { el, burner(i), knob(i), knobEl(i), on(i), off(i), isOn(i) }
 * Кастрюлю ставим на конфорку: k.onBurner(prop, i, w, h).
 */
export function stove(k) {
  const g = { x: 600, y: CTR - 300, w: 440, h: 300 }
  const el = k.prop(kitchen.stove(), g.x + g.w / 2, g.y + g.h / 2, g.w, g.h, { z: 4 })
  const knobs = [...el.querySelectorAll('.knob')]
  const flame = i => el.querySelector(`.flame[data-burner="${i}"]`)
  const glow = i => el.querySelector(`.burner[data-burner="${i}"] .burner-glow`)
  const light = el.querySelector('.power-light')
  const origin = e => e.getAttribute('data-origin') ?? '0 0'
  const state = [false, false]
  const api = {
    el, rect: g,
    /** точка «дно кастрюли по центру» для конфорки i */
    burner: i => ({ x: g.x + BURNER_DX[i], y: g.y + 22 }),
    /** центр ручки конфорки i */
    knob: i => ({ x: g.x + BURNER_DX[i], y: g.y + 135 }),
    /** невидимый круг поверх ручки — на него нажимает малыш */
    knobEl(i = 0, size = 150) {
      const p = api.knob(i)
      const d = k.prop('', p.x, p.y, size, size, { z: 9 })
      d.style.borderRadius = '50%'
      return d
    },
    isOn: i => state[i],
    on(i = 0) {
      if (state[i]) return
      state[i] = true
      const f = flame(i), gl = glow(i)
      gsap.to(knobs[i], { rotation: 90, svgOrigin: origin(knobs[i]), duration: 0.45, ease: 'back.out(2)' })
      audio.sfx('whoosh')
      gsap.fromTo(f, { autoAlpha: 1, scale: 0, svgOrigin: origin(f) }, { scale: 1, svgOrigin: origin(f), duration: 0.5, delay: 0.2, ease: 'back.out(2)' })
      gsap.to([gl, light], { autoAlpha: 1, duration: 0.3, delay: 0.2 })
      kitchen.animateStove(f, k.track)
    },
    off(i = 0) {
      if (!state[i]) return
      state[i] = false
      const f = flame(i), gl = glow(i)
      gsap.to(knobs[i], { rotation: 0, svgOrigin: origin(knobs[i]), duration: 0.45, ease: 'back.out(2)' })
      audio.sfx('click')
      gsap.to(f, { scale: 0, svgOrigin: origin(f), duration: 0.35, ease: 'back.in(2)' })
      gsap.to([f, gl, ...(state.some(Boolean) ? [] : [light])], { autoAlpha: 0, duration: 0.3, delay: 0.3 })
    },
  }
  k.onBurner = (prop, i = 0, w = 300, h = 230, dy = 6) => {
    const b = api.burner(i)
    Object.assign(prop.style, { left: `${b.x - w / 2}px`, top: `${b.y - h + dy}px`, width: `${w}px`, height: `${h}px` })
    return prop
  }
  return api
}

/** Фон «обеденный стол»: стена в горошек, окно, стол со скатертью в клетку. */
export function bgTable(o = {}) {
  const wall = o.wall ?? '#FFE8D1', dot = o.dot ?? '#FFD3A8', a = o.cloth ?? '#FF8FC8', b = o.cloth2 ?? '#FFC2E0'
  let dots = ''
  for (let y = 40; y < 560; y += 90) for (let x = (y / 90) % 2 ? 46 : 0; x < 1650; x += 92) dots += `<circle cx="${x}" cy="${y}" r="9" fill="${dot}"/>`
  let checks = ''
  for (let r = 0; r < 8; r++) for (let c = 0; c < 28; c++) if ((r + c) % 2) checks += `<rect x="${c * 60 - 20}" y="${640 + r * 50}" width="60" height="50" fill="${b}"/>`
  return svg(1600, 1000,
    `<rect x="-10" y="-10" width="1620" height="1020" fill="${wall}"/>${dots}
     <rect x="640" y="70" width="320" height="330" rx="160" fill="#BFE7FF" stroke="${INK}" stroke-width="8"/>
     <path d="M800 70V400M640 235H960" stroke="${INK}" stroke-width="8"/>
     ${C(870, 160, 34, '#FFE066', { sw: 0 })}
     <path d="M600 60L640 110L640 390L600 430Z" fill="#FFC2E0" stroke="${INK}" stroke-width="6"/><path d="M1000 60L960 110L960 390L1000 430Z" fill="#FFC2E0" stroke="${INK}" stroke-width="6"/>
     <rect x="-20" y="600" width="1640" height="420" fill="${a}"/>${checks}
     <rect x="-20" y="590" width="1640" height="40" rx="8" fill="#E9A96C" stroke="${INK}" stroke-width="6"/>
     <rect x="-20" y="596" width="1640" height="10" fill="#F6C590"/>`)
}
