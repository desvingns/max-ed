// «Плавает или тонет?» — сначала угадываем (карточка), потом проверяем (бросаем в таз с водой).
// Предметы подобраны так, чтобы поведение было точно известно: утёнок, яблоко, апельсин в кожуре — плавают;
// картофель, виноградинка, сырое яйцо (в пресной воде) — тонут. Итог: «мало воздуха, тяжёлый для своего размера — тонет».
import { defineLevel, food, SIZE } from '../lib.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, circlePath, nid } from '../art.js'

// ───────────────────────── геометрия таза (сцена 1600×1000) ─────────────────────────
const TUB = { cx: 800, cy: 520, w: 720, h: 400 }
const TX = TUB.cx - TUB.w / 2, TY = TUB.cy - TUB.h / 2          // 440, 300
const SURF = TY + 110                                             // уровень воды
const BOTTOM = TY + 378                                           // дно (внутри)
const SLOTS = [540, 650, 760, 870, 980, 1090]                     // места предметов в тазу

const waveTop = y0 => {
  let d = `M-80 ${y0}`
  for (let i = 0; i < 12; i++) d += 'q20 -12 40 0q20 12 40 0'
  return d
}
const wavePath = (y0, y1) => `${waveTop(y0)}L${-80 + 12 * 80} ${y1}L-80 ${y1}Z`
const INNER = 'M28 60H692V350Q692 382 660 382H60Q28 382 28 350Z'

const tubBack = () => {
  const id = nid('tb')
  const bub = [[90, 300, 7], [150, 340, 5], [600, 320, 8], [650, 250, 5], [560, 356, 5], [110, 220, 5], [640, 170, 6]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".55"/>`).join('')
  return svg(720, 400,
    `<clipPath id="${id}"><path d="${INNER}"/></clipPath>` +
    R(20, 30, 680, 360, 40, '#F4FBFF', { sw: 0 }) +
    `<g clip-path="url(#${id})">` +
      `<g class="wave"><path d="${wavePath(110, 400)}" fill="#8DDCFB"/></g>` +
      `<path d="M28 250H692V400H28Z" fill="#62C6FF" opacity=".35"/>` + bub +
    `</g>`)
}
const tubFront = () => {
  const id = nid('tf')
  return svg(720, 400,
    `<clipPath id="${id}"><path d="${INNER}"/></clipPath>` +
    `<g clip-path="url(#${id})"><g class="wave"><path d="${wavePath(110, 400)}" fill="#3FB0F0" opacity=".26"/><path d="${waveTop(110)}" fill="none" stroke="#fff" stroke-width="5" opacity=".75"/></g></g>` +
    R(20, 30, 680, 360, 40, 'none', { sw: 8 }) +
    R(4, 16, 712, 34, 17, '#DDE6F2', { sw: 6 }) + HL(150, 28, 90, 4, -2, 0.85) +
    `<rect x="46" y="120" width="12" height="190" rx="6" fill="#fff" opacity=".55"/><rect x="46" y="322" width="12" height="20" rx="6" fill="#fff" opacity=".55"/>` +
    R(90, 384, 90, 16, 6, '#B8C0CC', { sw: 5 }) + R(540, 384, 90, 16, 6, '#B8C0CC', { sw: 5 }))
}

// ───────────────────────── картинки предметов ─────────────────────────
const duckArt = () => svg(200, 170,
  SH(100, 164, 74, 6) +
  P('M168 84Q192 70 196 52Q174 58 158 72Z', '#FFD93D', { sw: 4 }) +
  S('M30 104C30 70 70 58 110 62C140 64 168 70 176 90C182 120 150 148 100 148C56 148 30 132 30 104Z', '#FFE066', '#F2B824') +
  P('M88 98Q118 80 146 102Q128 124 94 118Z', '#FFD93D', { sw: 4.5 }) +
  S(circlePath(68, 54, 32), '#FFE066', '#F2B824') +
  P('M38 50Q10 50 12 66Q34 74 44 66Z', '#FF9F43', { sw: 4.5 }) +
  E(56, 62, 8, 5, '#FF9EB1', { sw: 0 }) + C(74, 46, 5.5, INK, { sw: 0 }) + C(76, 44, 2, '#fff', { sw: 0 }) + HL(56, 34, 12, 6, -30, 0.7))

const grapeArt = () => svg(110, 116,
  SH(55, 110, 36, 5) + L('M55 18Q56 6 72 4', '#A26B3B', 6) + P('M56 14Q78 -2 96 12Q80 26 58 20Z', '#6BCB77', { sw: 4 }) +
  S(circlePath(55, 64, 44), '#B388EB', '#8B62CF') + HL(38, 46, 10, 16, 20, 0.6))

const ball = (cx, cy, r) => S(circlePath(cx, cy, r), '#FF5A5F', '#E0474C') + HL(cx - r * 0.3, cy - r * 0.35, r * 0.28, r * 0.16, -30, 0.7)
const cardArt = float => {
  const waves = 'M6 112q20 -14 40 0q20 14 40 0q20 -14 40 0q20 14 40 0q20 -14 40 0V190Q194 196 188 196H12Q6 196 6 190Z'
  const arrow = float
    ? L('M168 84L168 34M150 52L168 32L186 52', '#2E8F5B', 11)
    : L('M32 96L32 146M14 128L32 148L50 128', '#5B3FA5', 11)
  return svg(200, 200,
    (float ? ball(96, 84, 34) : '') +
    `<path d="${waves}" fill="#8DDCFB" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    (float ? `<path d="M6 112q20 -14 40 0q20 14 40 0q20 -14 40 0q20 14 40 0q20 -14 40 0" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>`
      : `<g opacity=".85">${ball(100, 164, 28)}</g>` + [[142, 150, 6], [150, 124, 8], [132, 104, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="3"/>`).join('')) +
    arrow)
}

// предметы: art — SVG, w — ширина в тазу, rest — где плавает (сдвиг центра от уровня воды)
const ITEMS = {
  duck: { float: true, art: duckArt, ar: 170 / 200, w: 130, rest: -14 },
  apple: { float: true, art: () => food('apple'), ar: SIZE.apple[1] / SIZE.apple[0], w: 120, rest: 12, big: 168 },
  potato: { float: false, art: () => food('potato'), ar: SIZE.potato[1] / SIZE.potato[0], w: 140, big: 200 },
  orange: { float: true, art: () => food('orange'), ar: SIZE.orange[1] / SIZE.orange[0], w: 124, rest: 16, big: 164 },
  grape: { float: false, art: grapeArt, ar: 116 / 110, w: 96, big: 130 },
  egg: { float: false, art: () => food('egg'), ar: SIZE.egg[1] / SIZE.egg[0], w: 78, big: 108 },
}
const ORDER = ['apple', 'potato', 'orange', 'grape', 'egg']

export default defineLevel({
  id: 'float-sink',
  async run(k) {
    const gs = k.gsap
    k.kitchenBg()
    const pyx = k.pyx({ x: 250 })
    const kapa = k.guest('kapa', 1400, k.layout.floorY, { size: 280, face: 'left' })

    // таз: задняя часть (вода) — под предметами, передняя (стекло, тень воды) — над ними
    const back = k.prop(tubBack(), TUB.cx, TUB.cy, TUB.w, TUB.h, { z: 5 })
    const front = k.prop(tubFront(), TUB.cx, TUB.cy, TUB.w, TUB.h, { z: 7 })
    for (const t of [back, front]) t.style.pointerEvents = 'none'
    k.to([back.querySelector('.wave'), front.querySelector('.wave')], { x: -80, duration: 2.6, ease: 'none', repeat: -1 })
    const zone = k.prop('', TUB.cx, TUB.cy, TUB.w - 40, TUB.h - 40, { z: 1 })
    // подставка для предмета справа
    const mat = k.food('plate2', 1310, 700, 250, { z: 4 })

    // ── помощники ──
    const splash = (x, y = SURF) => {
      k.sfx('splash', { vol: 0.9 })
      for (let i = 0; i < 9; i++) {
        const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#8DDCFB;box-shadow:0 0 0 3px #3B2F4F"></div>', x + k.rand(-30, 30), y, 16, 16, { z: 9 })
        k.timeline({ onComplete: () => d.remove() })
          .to(d, { x: k.rand(-70, 70), y: -k.rand(70, 150), duration: 0.35, ease: 'power2.out' })
          .to(d, { y: 20, opacity: 0, duration: 0.35, ease: 'power2.in' })
      }
      const ring = k.prop('<div style="width:100%;height:100%;border-radius:50%;border:6px solid #fff"></div>', x, y + 4, 60, 18, { z: 8 })
      k.fromTo(ring, { scale: 0.3, opacity: 0.9 }, { scale: 3.4, opacity: 0, duration: 0.8, ease: 'power1.out', onComplete: () => ring.remove() })
    }
    const bubbles = (x, y0, n = 5) => {
      for (let i = 0; i < n; i++) {
        const r = k.rand(8, 16)
        const b = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:rgba(255,255,255,.7);box-shadow:0 0 0 3px #3B2F4F"></div>', x + k.rand(-30, 30), y0, r, r, { z: 8 })
        k.to(b, { y: -(y0 - SURF) + k.rand(-10, 10), x: `+=${k.rand(-20, 20)}`, opacity: 0.2, duration: k.rand(0.9, 1.4), delay: i * 0.12, ease: 'power1.out', onComplete: () => b.remove() })
      }
    }
    const make = (id, x, y, z = 6, w = ITEMS[id].w) => {
      const el = k.prop(ITEMS[id].art(), x, y, w, Math.round(w * ITEMS[id].ar), { z, cls: 'kx-food' })
      el.dataset.food = id
      return el
    }

    // ── предметы в тазу: падение → плавает / тонет ──
    const drop = async (el, id, slot) => {
      const m = ITEMS[id], x = SLOTS[slot], h = Math.round(m.w * m.ar)
      el.style.zIndex = '6'
      const c0 = k.centerOf(el)
      gs.to(el, { scale: m.w / (m.big ?? m.w), duration: 0.2 })
      // падаем к воде
      await k.play(gs.to(el, { x: `+=${x - c0.x}`, y: `+=${SURF - 40 - c0.y}`, rotation: k.rand(-15, 15), duration: 0.4, ease: 'power2.in' }))
      splash(x)
      const cur = k.centerOf(el)
      if (m.float) {
        await k.play(gs.to(el, { y: `+=${SURF + 95 - cur.y}`, duration: 0.3, ease: 'power2.out' }))
        bubbles(x, SURF + 110, 4)
        await k.play(gs.to(el, { y: `+=${(SURF + m.rest) - (SURF + 95)}`, rotation: 0, duration: 0.9, ease: 'elastic.out(1,0.45)' }))
        k.to(el, { y: '+=5', rotation: 3, duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      } else {
        const ty = BOTTOM - h / 2 - 4
        const sway = gs.to(el, { x: `+=${k.rand(-14, 14)}`, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' })
        const bt = k.every(180, () => bubbles(x + k.rand(-20, 20), k.centerOf(el).y, 1))
        await k.play(gs.to(el, { y: `+=${ty - cur.y}`, rotation: k.rand(-30, 30), duration: 1.15, ease: 'power1.in' }))
        bt(); sway.kill()
        k.sfx('thud', { vol: 0.6 })
        await k.play(gs.to(el, { y: '-=10', duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.out' }))
        bubbles(x, ty, 4)
      }
    }

    // ─── 1. знакомство и уточка-пример ───
    k.popIn([back, front], 0.1)
    await k.wait(500)
    await k.tell(pyx, 'hello', 'wave')
    const duck = make('duck', 800, 200, 6)
    await drop(duck, 'duck', 0)
    await k.tell(pyx, 'duck', 'happy')
    await k.tell(kapa, 'kapa_rule', 'nod')
    const bar = k.stepsBar(['🍎', '🥔', '🍊', '🍇', '🥚'])

    // ─── 2. по очереди: угадай → проверь ───
    let hits = 0
    for (let i = 0; i < ORDER.length; i++) {
      const id = ORDER[i], m = ITEMS[id]
      bar.set(i)
      const bw = m.big ?? m.w, bh = Math.round(bw * m.ar)
      const el = make(id, 1310, 684 - bh / 2, 8, bw)
      k.fromTo(el, { y: -200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'bounce.out' })
      k.sfx('boing', { vol: 0.5 })
      await k.wait(500)
      await k.tell(pyx, `ask_${id}`, 'point')

      // прогноз: две карточки, «правильного» нет — любой выбор принимается
      let guess = null
      await k.choose({
        prompt: k.key('q_guess'), host: pyx,
        options: [
          { id: 'float', art: cardArt(true), color: '#4D96FF', outcome: async () => { guess = 'float'; await k.tell(pyx, 'g_float') } },
          { id: 'sink', art: cardArt(false), color: '#B388EB', outcome: async () => { guess = 'sink'; await k.tell(pyx, 'g_sink') } },
        ],
      })

      // проверка: бросаем в воду
      await k.dnd({
        items: [{ id, el }], zones: [{ id: 'tub', el: zone, pad: 30 }], accept: () => true,
        prompt: k.key('q_drop'), host: pyx,
        onCorrect: async () => { await drop(el, id, i + 1) },
      })
      const right = (guess === 'float') === m.float
      if (right) hits++
      await k.tell(pyx, `res_${id}`, m.float ? 'cheer' : 'nod')
      // отметка на полоске: звёздочка, если угадал
      const chip = bar.el.children[i]
      bar.done(i)
      if (right) {
        chip.insertAdjacentHTML('beforeend', '<span class="emoji" style="position:absolute;right:-12px;top:-16px;font-size:36px;line-height:1">⭐</span>')
        k.fromTo(chip.lastElementChild, { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' })
        k.burst(k.centerOf(chip).x, k.centerOf(chip).y, 6)
        await k.tell(pyx, k.pick(['yes1', 'yes2']), 'happy')
      } else {
        await k.tell(pyx, k.pick(['no1', 'no2']), 'laugh')
      }
      if (i < ORDER.length - 1) await k.wait(300)
    }

    // ─── 3. вывод ───
    // вверху плавают лёгкие, на дне лежат тяжёлые
    await k.tell(kapa, 'sum', 'point')
    k.burst(TUB.cx, TUB.cy - 100, 12)
    await k.tell(pyx, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
