// «Одеваем повара»: перетаскиваем на Пыха нужную одёжку (чистый фартук, колпак); лишнее (ласты, маска, шапка, грязный фартук) — смешные реакции.
import { defineLevel, food } from '../lib.js'
import { setAccessory } from '../deps.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, rounded, circlePath, ellipsePath, nid } from '../art.js'

// ───────────────────────── рисунки ─────────────────────────
const PINK = { base: '#FF8FC8', sh: '#F06AAE', light: '#FFC2E0' }
const TEAL = { base: '#2EC4B6', sh: '#1F9D93', light: '#8DE3D6' }
const BLUE = { base: '#4D96FF', sh: '#3A7BDA' }

/** Фон-«гардеробная»: полосатые обои, окно, две полки справа, паркет, коврик. */
function bgSvg() {
  let stripes = ''
  for (let x = 0; x < 1600; x += 160) stripes += `<rect x="${x}" y="-10" width="80" height="900" fill="#FFE9AE"/>`
  let planks = ''
  for (let r = 0; r < 2; r++) for (let c = -1; c < 14; c++) planks += `<rect x="${c * 130 + (r ? 65 : 0)}" y="${884 + r * 58}" width="130" height="58" fill="${(c + r) % 2 ? '#F4C892' : '#EDBB80'}" stroke="#D9A066" stroke-width="3"/>`
  const shelf = (y, x0, x1) =>
    R(x0, y, x1 - x0, 24, 8, '#E2A468') + F(`M${x0 + 8} ${y + 4}H${x1 - 8}`, '#F2C48E', 'stroke="#F6D2A4" stroke-width="5" stroke-linecap="round"') +
    [x0 + 60, x1 - 60].map(bx => P(`M${bx - 22} ${y + 24}L${bx + 22} ${y + 24}L${bx - 22} ${y + 74}Z`, '#C98F55', { sw: 5 })).join('')
  const frame = (x, y, w, h, inner) => R(x, y, w, h, 14, '#E2A468') + R(x + 12, y + 12, w - 24, h - 24, 8, '#FFF8E6', { sw: 4 }) + inner
  return svg(1600, 1000,
    `<rect x="-10" y="-10" width="1620" height="1020" fill="#FFF3D2"/>` + stripes +
    // окно слева
    R(250, 150, 250, 250, 24, '#BFE7FF') + `<path d="M375 150V400M250 275H500" stroke="${INK}" stroke-width="7"/>` + C(320, 210, 26, '#FFE066', { sw: 0 }) +
    `<path d="M400 340Q416 310 446 322Q470 308 482 340Z" fill="#fff"/>` + R(250, 150, 250, 250, 24, 'none') +
    `<path d="M228 132L268 176V376L228 420Z" fill="#FFB3D9" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M522 132L482 176V376L522 420Z" fill="#FFB3D9" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // картинки над полками
    frame(1000, 100, 190, 190, `<path d="M1095 138L1110 172L1148 176L1120 200L1130 240L1095 220L1060 240L1070 200L1042 176L1080 172Z" fill="#FFD93D" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`) +
    frame(1240, 100, 200, 190, `<path d="M1276 250Q1340 150 1404 250" fill="none" stroke="#FF5A5F" stroke-width="14"/><path d="M1292 250Q1340 172 1388 250" fill="none" stroke="#FFD93D" stroke-width="14"/><path d="M1308 250Q1340 194 1372 250" fill="none" stroke="#6BCB77" stroke-width="14"/>`) +
    shelf(524, 900, 1580) + shelf(846, 900, 1580) +
    // пол
    `<rect x="-20" y="856" width="1640" height="30" fill="#E5A868"/><path d="M-20 858H1620M-20 884H1620" stroke="${INK}" stroke-width="5"/>` + planks +
    // коврик
    E(560, 946, 330, 40, '#FF9EC4') + E(560, 946, 290, 30, 'none', { sw: 4, ink: '#fff', attr: 'stroke-dasharray="20 16"' }))
}

// ── одёжка на Пыхе (координаты viewBox 400×400 героя) ──
const BELLY = ellipsePath(200, 292, 71, 77)
function apronWorn(dirty) {
  const id = nid('ap')
  const shape = 'M170 236L230 236L244 290L282 300L282 388L118 388L118 300L156 290Z'
  const stains = dirty
    ? `<ellipse cx="164" cy="334" rx="13" ry="9" fill="#7A5C3E"/><ellipse cx="226" cy="356" rx="16" ry="10" fill="#7A5C3E"/><ellipse cx="200" cy="300" rx="9" ry="6" fill="#8D6E52"/><circle cx="240" cy="326" r="5" fill="#7A5C3E"/><circle cx="150" cy="362" r="4" fill="#7A5C3E"/>`
    : ''
  return `<g class="w-apron"><clipPath id="${id}"><path d="${BELLY}"/></clipPath>
    <g clip-path="url(#${id})"><path d="${shape}" fill="${PINK.sh}"/><path d="${shape}" fill="${PINK.base}" transform="translate(-9 -7)"/>
    <rect x="168" y="322" width="64" height="38" rx="12" fill="${PINK.light}" stroke="${INK}" stroke-width="5"/><path d="M176 334H224" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 8"/>${stains}
    <path d="M170 236L230 236" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>
    <path d="M172 240Q146 238 140 262M228 240Q254 238 260 262" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M172 240Q146 238 140 262M228 240Q254 238 260 262" fill="none" stroke="${PINK.base}" stroke-width="6" stroke-linecap="round"/>
    <path d="M156 290Q200 302 244 290" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity=".55"/></g>`
}

const finPath = (mx, X = x => x) => `M${X(150)} 364C${X(122)} 356 ${X(92)} 372 ${X(84)} 404C${X(114)} 414 ${X(150)} 404 ${X(180)} 384Z`
function finWorn(mirror) {
  const X = mirror ? x => 400 - x : x => x
  const d = finPath(mirror, X)
  const ridges = [[132, 372, 110, 398], [148, 372, 130, 404], [164, 374, 150, 402]].map(([a, b, c, e]) => `<path d="M${X(a)} ${b}L${X(c)} ${e}" stroke="${TEAL.sh}" stroke-width="4" stroke-linecap="round" fill="none"/>`).join('')
  return `<g class="w-fin"><path d="${d}" fill="${TEAL.base}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>${ridges}<ellipse cx="${X(150)}" cy="372" rx="26" ry="12" fill="${TEAL.light}" stroke="${INK}" stroke-width="6"/></g>`
}

function maskWorn() {
  return `<g class="w-mask">
    <path d="M104 142Q200 122 296 142L296 166Q200 148 104 166Z" fill="#FF9F43" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
    <rect x="112" y="112" width="176" height="86" rx="34" fill="${TEAL.base}" stroke="${INK}" stroke-width="8"/>
    <circle cx="158" cy="155" r="30" fill="#BFEAFF" fill-opacity=".55" stroke="${INK}" stroke-width="6"/><circle cx="242" cy="155" r="30" fill="#BFEAFF" fill-opacity=".55" stroke="${INK}" stroke-width="6"/>
    <rect x="186" y="140" width="28" height="22" rx="8" fill="${TEAL.sh}" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="142" cy="140" rx="12" ry="5" fill="#fff" opacity=".8" transform="rotate(-30 142 140)"/><ellipse cx="226" cy="140" rx="12" ry="5" fill="#fff" opacity=".8" transform="rotate(-30 226 140)"/></g>`
}

/** Вязаная шапка с помпоном: тело в координатах 0..200 × 0..170 (общее для значка и «на голове»). */
const beanieBody = () =>
  P('M22 122C22 52 60 26 100 26C140 26 178 52 178 122Z', BLUE.base, { sw: 6 }) +
  `<path d="M100 26C140 26 178 52 178 122L150 122C152 70 130 40 100 26Z" fill="${BLUE.sh}"/>` +
  `<path d="M30 92Q100 74 170 92L172 108Q100 92 28 108Z" fill="#fff" opacity=".9"/><path d="M22 122C22 52 60 26 100 26C140 26 178 52 178 122Z" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
  R(12, 116, 176, 46, 18, '#FFFFFF') + [34, 56, 78, 100, 122, 144, 166].map(x => L(`M${x} 122V156`, '#D5DDEA', 4)).join('') +
  C(100, 22, 24, '#FFFFFF') + HL(90, 14, 8, 5, -30, 0.9)
const beanieItem = () => svg(200, 170, beanieBody())
const beanieWorn = () => `<g class="w-hat" transform="translate(124 -6) scale(.76)">${beanieBody()}</g>`

function flippersItem() {
  const fin = tx => `<g transform="${tx}">${P('M44 196C32 158 12 126 8 66C40 50 100 50 132 66C128 126 108 158 96 196Z', TEAL.base, { sw: 6 })}` +
    [[54, 184, 32, 70], [70, 188, 70, 58], [86, 184, 108, 70]].map(([a, b, c, d]) => L(`M${a} ${b}Q${(a + c) / 2} ${(b + d) / 2 + 6} ${c} ${d}`, TEAL.sh, 5)).join('') +
    P('M30 140Q70 128 110 140L104 200Q70 212 36 200Z', TEAL.light, { sw: 6 }) + HL(38, 96, 6, 22, 10, 0.6) + `</g>`
  return svg(250, 220, SH(125, 212, 100, 6) + fin('translate(0 0) rotate(-8 60 200)') + fin('translate(118 0) rotate(8 60 200)'))
}

function maskItem() {
  return svg(230, 140,
    E(115, 84, 110, 50, 'none', { sw: 12, ink: '#FF9F43' }) + E(115, 84, 110, 50, 'none', { sw: 5 }) +
    R(28, 22, 174, 92, 36, TEAL.base, { sw: 7 }) +
    C(74, 68, 32, '#BFEAFF', { sw: 6 }) + C(156, 68, 32, '#BFEAFF', { sw: 6 }) +
    R(102, 52, 26, 24, 8, TEAL.sh, { sw: 5 }) + HL(60, 52, 12, 5, -30, 0.9) + HL(142, 52, 12, 5, -30, 0.9))
}

const dirtyApronHtml = () =>
  `<div style="position:relative;width:100%;height:100%">${food('apron')}<div style="position:absolute;inset:0">${svg(190, 240,
    `<ellipse cx="62" cy="150" rx="18" ry="12" fill="#7A5C3E"/><ellipse cx="128" cy="184" rx="22" ry="14" fill="#7A5C3E"/><ellipse cx="96" cy="112" rx="12" ry="8" fill="#8D6E52"/><circle cx="140" cy="140" r="7" fill="#7A5C3E"/><circle cx="50" cy="198" r="6" fill="#7A5C3E"/><circle cx="112" cy="214" r="5" fill="#8D6E52"/>` +
    `<g transform="translate(150 60)"><ellipse cx="0" cy="0" rx="7" ry="5" fill="${INK}"/><ellipse cx="-6" cy="-6" rx="6" ry="3.5" fill="#fff" stroke="${INK}" stroke-width="2"/><ellipse cx="6" cy="-6" rx="6" ry="3.5" fill="#fff" stroke="${INK}" stroke-width="2"/></g>`)}</div></div>`

export const _art = { bgSvg, apronWorn, finWorn, maskWorn, beanieItem, beanieWorn, flippersItem, maskItem, dirtyApronHtml }

// ───────────────────────── уровень ─────────────────────────
export default defineLevel({
  id: 'chef-dress',
  async run(k) {
    k.bg(bgSvg())
    const PX = 540, PY = 946, PS = 540
    const pyx = k.pyx({ x: PX, y: PY, size: PS, hat: false })
    const busya = k.guest('busya', 175, 966, { size: 310, face: 'right' })

    // зона «на Пыха»
    const zone = k.prop('', PX, 690, 380, 520, { z: 8 })

    // одёжка на полках
    const shelfTop = 524, shelfTop2 = 846
    const mk = (id, el, good) => ({ id, el, good })
    const clean = k.food('apron', 1240, shelfTop2 - 105, 150, { z: 20 })
    const hat = k.food('chefHat', 1470, shelfTop - 78, 170, { z: 20 })
    const dirty = k.prop(dirtyApronHtml(), 1040, shelfTop - 96, 150, 190, { z: 20 })
    const winter = k.prop(beanieItem(), 1250, shelfTop - 72, 170, 145, { z: 20 })
    const fins = k.prop(flippersItem(), 1040, shelfTop2 - 92, 200, 176, { z: 20 })
    const mask = k.prop(maskItem(), 1470, shelfTop2 - 56, 190, 115, { z: 20 })
    const items = [mk('apron', clean, true), mk('hat', hat, true), mk('dirty', dirty), mk('winter', winter), mk('fins', fins), mk('mask', mask)]
    const els = items.map(i => i.el)
    k.gsap.set(els, { scale: 0, opacity: 0 })

    // ── надеваем на Пыха: вставляем SVG прямо в героя (под руки / над лицом) ──
    const mount = (sel, html) => {
      const p = pyx.svg.querySelector(sel)
      p.insertAdjacentHTML('beforeend', html)
      return p.lastElementChild
    }
    const headIn = '.pyx-head-in', bodyIn = '.pyx-body-in'
    const remove = el => k.to(el, { opacity: 0, duration: 0.25, onComplete: () => el.remove() })

    await k.wait(400)
    await k.tell(pyx, 'hello', 'wave')
    k.popIn(els, 0.12)
    k.sfx('whoosh')
    await k.wait(900)
    await k.tell(busya, 'giggle', 'laugh') // Буся хихикает: Пых без колпака
    await k.tell(pyx, 'look', 'think')

    let wearApron = false, wearHat = false
    let mistakes = 0
    const bubbles = () => {
      const c = k.centerOf(pyx.el)
      for (let i = 0; i < 7; i++) {
        const b = k.prop('<div style="width:100%;height:100%;border-radius:50%;border:5px solid #7CC4E8;background:rgba(255,255,255,.6)"></div>', c.x - 20 + k.rand(-30, 30), c.y - 120, 26 + i * 4, 26 + i * 4, { z: 30 })
        k.to(b, { y: -k.rand(90, 190), x: k.rand(-40, 40), opacity: 0, duration: 1.2, delay: i * 0.12, ease: 'sine.out', onComplete: () => b.remove() })
      }
    }
    const sweat = () => {
      const c = k.centerOf(pyx.el)
      for (let i = 0; i < 6; i++) {
        const side = i % 2 ? 1 : -1
        const d = k.prop('<svg viewBox="0 0 40 56" width="100%" height="100%"><path d="M20 4C30 22 36 30 36 38C36 48 28 54 20 54C12 54 4 48 4 38C4 30 10 22 20 4Z" fill="#7CD4FF" stroke="#3E9BD6" stroke-width="3"/></svg>', c.x + side * k.rand(60, 110), c.y - 200 + k.rand(0, 40), 30, 42, { z: 30 })
        k.fromTo(d, { scale: 0 }, { scale: 1, duration: 0.2, delay: i * 0.15 })
        k.to(d, { y: 120, opacity: 0, duration: 0.7, delay: 0.25 + i * 0.15, ease: 'power1.in', onComplete: () => d.remove() })
      }
    }

    await k.dnd({
      items,
      zones: [{ el: zone, id: 'pyx', pad: 50 }],
      accept: it => !!it.good,
      prompt: k.key('q_dress'), host: pyx,
      until: placed => placed.size >= 2,
      onCorrect: async it => {
        const c = k.centerOf(pyx.el)
        k.to(it.el, { scale: 0, opacity: 0, x: `+=${c.x - k.centerOf(it.el).x}`, y: `+=${c.y - 250 - k.centerOf(it.el).y}`, duration: 0.3, ease: 'power2.in' })
        await k.wait(300)
        k.sfx('boing', { vol: 0.6 })
        if (it.id === 'apron') {
          const a = mount(bodyIn, apronWorn(false))
          k.gsap.fromTo(a, { opacity: 0 }, { opacity: 1, duration: 0.35 })
          k.sparkle(c.x, c.y - 60, 6)
          wearApron = true
          pyx.emote('happy')
          await k.tell(pyx, 'apron_ok')
        } else {
          setAccessory(pyx, 'chef')
          const acc = pyx.svg.querySelector('.acc-chef')
          k.gsap.fromTo(acc, { y: -130, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
          k.sparkle(c.x, c.y - 230, 6)
          wearHat = true
          pyx.emote('jump')
          await k.tell(pyx, 'hat_ok')
          await k.tell(busya, 'nohair', 'laugh')
          await k.tell(pyx, 'rule', 'point')
        }
      },
      onWrong: async (it, z) => {
        if (!z) return
        mistakes++
        k.sfx('boing', { vol: 0.5 })
        const c = k.centerOf(pyx.el)
        if (it.id === 'dirty') {
          const a = mount(bodyIn, apronWorn(true))
          pyx.emote('surprised')
          await k.tell(pyx, 'dirty')
          remove(a)
        } else if (it.id === 'mask') {
          const m = mount(headIn, maskWorn())
          k.gsap.fromTo(m, { opacity: 0 }, { opacity: 1, duration: 0.25 })
          bubbles(); k.sfx('bloop'); k.after(400, () => k.sfx('bloop')); k.after(900, () => k.sfx('bloop'))
          pyx.emote('surprised')
          await k.tell(pyx, 'mask')
          if (mistakes % 2) await k.tell(busya, 'giggle', 'laugh')
          remove(m)
        } else if (it.id === 'fins') {
          const f1 = mount('.c-leg-l', finWorn(false)), f2 = mount('.c-leg-r', finWorn(true))
          k.sfx('clonk')
          const tl = k.timeline()
          tl.to(pyx.el, { x: 46, rotation: 5, duration: 0.25, ease: 'sine.inOut' }).to(pyx.el, { x: -46, rotation: -5, duration: 0.5, ease: 'sine.inOut' }).to(pyx.el, { x: 30, rotation: 4, duration: 0.4, ease: 'sine.inOut' }).to(pyx.el, { x: 0, rotation: 0, duration: 0.3, ease: 'sine.inOut' })
          for (let i = 0; i < 4; i++) k.after(i * 380, () => k.sfx('clonk', { vol: 0.5 }))
          pyx.emote('shake')
          await k.tell(pyx, 'flippers')
          await k.play(tl)
          remove(f1); remove(f2)
        } else {
          const h = mount(headIn, beanieWorn())
          k.gsap.fromTo(h, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'bounce.out' })
          k.gsap.to(pyx.el, { filter: 'hue-rotate(-25deg) saturate(1.5)', duration: 0.6 })
          sweat()
          pyx.emote('sad')
          await k.tell(pyx, 'winter')
          k.gsap.to(pyx.el, { filter: 'none', duration: 0.4 })
          remove(h)
        }
      },
    })
    k.to(els, { opacity: 0, scale: 0.5, duration: 0.35, stagger: 0.03 })
    await k.wait(300)

    // финал: Пых-повар крутится и показывает чистые ладошки
    k.burst(PX, 600, 12)
    pyx.emote('spin')
    k.sfx('tada')
    await k.tell(pyx, 'done', 'cheer')
    await k.tell(pyx, 'palms', 'wave')
    await k.narrate('sum')
    await k.tell(pyx, 'bye', 'dance')
    k.burst(800, 420, 14)
  },
})
