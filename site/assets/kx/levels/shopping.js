// «Список покупок» — читаем записку-картинки, ищем продукты на полках, кладём в корзинку и считаем.
// Три раунда: 3 картинки → 5 картинок (считаем и список, и покупки) → «на память» (список прячется на 3 секунды).
// Чухтик — хозяин лавки: привозит товары; Пых — покупатель со списком.
import { defineLevel, food, SIZE } from '../lib.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S } from '../art.js'

// ───────────────────────── геометрия ─────────────────────────
const ROWS = [265, 415, 565]                     // центры рядов на полках
const PLANK = y => y + 68                        // верх доски под рядом
const BASKET = { x: 890, y: 800, w: 560, h: 320 }
const ZONE = { x: 890, y: 850, w: 560, h: 240 }  // куда бросать покупки
const NOTE = { x: 190, y: 410, w: 290 }
const CHUKH = { x: 1410, y: 955 }
const CARGO = { x: 1400, y: 780 }                // откуда «вылетают» товары

// ───────────────────────── продукты ─────────────────────────
// w — ширина картинки в ячейке 150×150, rot — наклон для длинных (морковь, огурец)
const SC = 1.1
const PROD = Object.fromEntries(Object.entries({
  apple: { w: 118 }, banana: { w: 150 }, orange: { w: 118 }, lemon: { w: 132 }, strawberry: { w: 100 }, grapes: { w: 96 },
  carrot: { w: 190, rot: -30 }, tomato: { w: 118 }, cucumber: { w: 190, rot: -26 }, potato: { w: 132 }, onion: { w: 100 }, broccoli: { w: 112 },
  bread: { w: 150 }, cheese: { w: 140 }, milk: { w: 72 }, egg: { w: 78 }, butter: { w: 132 }, sausage: { w: 178, rot: -22 },
}).map(([id, p]) => [id, { ...p, w: p.w * SC }]))
/** наибольший размер картинки (для масштаба в корзине) */
const extent = id => { const p = PROD[id], h = p.w * ratio(id); return p.rot ? p.w * 0.9 : Math.max(p.w, h) }
const ratio = id => SIZE[id][1] / SIZE[id][0]
/** картинка продукта внутри квадрата box×box (ставится на «доску» — по низу; длинные — по центру) */
const inner = (id, box = 150, center = false) => {
  const p = PROD[id], q = box / 150 * (center && p.rot ? 0.82 : 1)
  const w = p.w * q, h = w * ratio(id)
  const top = p.rot || center ? (box - h) / 2 : box - h - 8 * q
  return `<div style="position:absolute;left:${(box - w) / 2}px;top:${top}px;width:${w}px;height:${h}px;${p.rot ? `transform:rotate(${p.rot}deg);` : ''}">${food(id)}</div>`
}

// ───────────────────────── фон лавки ─────────────────────────
const shopBg = () => {
  let stripes = '', scal = ''
  for (let i = 0; i < 16; i++) {
    const col = i % 2 ? '#FFFFFF' : '#FF6B6B'
    stripes += `<rect x="${i * 100}" y="-10" width="100" height="120" fill="${col}"/>`
    scal += `<path d="M${i * 100} 108A50 50 0 0 0 ${i * 100 + 100} 108Z" fill="${col}"/><path d="M${i * 100} 108A50 50 0 0 0 ${i * 100 + 100} 108" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  }
  let wall = '', floor = ''
  for (let i = 0; i < 9; i++) wall += `<rect x="${i * 200}" y="120" width="100" height="640" fill="#DDF2D2"/>`
  for (let r = 0; r < 4; r++) for (let c = 0; c < 21; c++) floor += `<rect x="${c * 80 - 40 * (r % 2)}" y="${770 + r * 60}" width="80" height="60" fill="${(r + c) % 2 ? '#F0CF98' : '#F7DFB4'}"/>`
  // полки
  const X0 = 470, X1 = 1310
  let planks = ''
  for (const y of ROWS) {
    const t = PLANK(y)
    planks += `<rect x="${X0 + 6}" y="${t - 150}" width="${X1 - X0 - 12}" height="150" fill="#FBEBC9" opacity=".55"/>` +
      R(X0 - 8, t, X1 - X0 + 16, 26, 8, '#D89B58', { sw: 5 }) + `<rect x="${X0}" y="${t + 4}" width="${X1 - X0}" height="6" rx="3" fill="#EDBB82"/>`
  }
  const shelf = R(X0, 170, X1 - X0, 500, 26, '#F5DDAE', { sw: 6 }) + planks +
    R(X0 - 14, 160, 34, 530, 12, '#C98F55', { sw: 5 }) + R(X1 - 20, 160, 34, 530, 12, '#C98F55', { sw: 5 })
  // вывеска-доска с тележкой
  const sign = `<path d="M1400 108L1400 196M1512 108L1512 196" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` +
    R(1340, 190, 232, 190, 26, '#3E7A66', { sw: 7 }) + R(1352, 202, 208, 166, 16, '#2F5D50', { sw: 0 }) +
    `<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".92">` +
      `<path d="M1382 244H1408L1428 318H1512L1532 264H1418"/><path d="M1440 262L1446 292M1470 262L1470 292M1500 262L1494 292"/></g>` +
    C(1440, 338, 12, '#fff', { sw: 0 }) + C(1506, 338, 12, '#fff', { sw: 0 }) +
    `<path d="M1374 226L1374 226" stroke="#fff"/>`
  return svg(1600, 1000,
    `<rect x="-10" y="-10" width="1620" height="1020" fill="#E9F8DF"/>` + wall +
    `<rect x="-10" y="740" width="1620" height="36" fill="#C98F55"/><rect x="-10" y="740" width="1620" height="8" fill="#E2B078"/><path d="M-10 776H1610" stroke="${INK}" stroke-width="5"/>` + floor +
    shelf + sign + stripes + scal)
}

// ───────────────────────── корзина ─────────────────────────
const curve = (p0, c, p2, u) => [0, 1].map(i => (1 - u) * (1 - u) * p0[i] + 2 * (1 - u) * u * c[i] + u * u * p2[i])
const basketBack = () =>
  SH(280, 314, 230, 14, 0.16) +
  `<path d="M70 132C64 -12 496 -12 490 132" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M70 132C64 -12 496 -12 490 132" fill="none" stroke="#D59A5C" stroke-width="15" stroke-linecap="round"/>` +
  E(280, 126, 240, 52, '#B77B45', { sw: 6 }) + E(280, 130, 222, 40, '#6B4526', { sw: 0 })
const basketFront = () => {
  const top = [[44, 132], [280, 196], [516, 132]], bot = [[84, 296], [280, 336], [476, 296]]
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const at = t => [lerp(top[0], bot[0], t), lerp(top[1], bot[1], t), lerp(top[2], bot[2], t)]
  const body = `M44 132Q280 196 516 132L476 296Q280 336 84 296Z`
  let weave = ''
  for (const t of [0.24, 0.5, 0.76]) { const [a, c, b] = at(t); weave += `<path d="M${a[0]} ${a[1]}Q${c[0]} ${c[1]} ${b[0]} ${b[1]}" fill="none" stroke="#A8703F" stroke-width="5" stroke-linecap="round" opacity=".8"/>` }
  const rows = [0, 0.24, 0.5, 0.76, 1]
  for (let r = 0; r < 4; r++) {
    const A = at(rows[r]), B = at(rows[r + 1])
    for (let i = 0; i < 12; i++) {
      const u = (i + 0.5 * (r % 2) + 0.5) / 12.5
      if (u > 0.98) continue
      const p = curve(A[0], A[1], A[2], u), q = curve(B[0], B[1], B[2], u)
      weave += `<path d="M${p[0].toFixed(1)} ${(p[1] + 4).toFixed(1)}L${q[0].toFixed(1)} ${(q[1] - 4).toFixed(1)}" stroke="#A8703F" stroke-width="4.5" stroke-linecap="round" opacity=".55"/>`
    }
  }
  const heart = 'M280 286C240 258 244 226 264 222C274 220 280 228 280 234C280 228 286 220 296 222C316 226 320 258 280 286Z'
  return S(body, '#E9B571', '#C98F55', { extra: weave, off: [-7, -7] }) +
    `<path d="M40 130Q280 194 520 130" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M40 130Q280 194 520 130" fill="none" stroke="#F0C489" stroke-width="20" stroke-linecap="round"/>` +
    `<path d="M70 132Q280 190 490 132" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5"/>` +
    P(heart, '#FF5A5F', { sw: 5 }) + HL(262, 234, 6, 4, -30, 0.7)
}

// ───────────────────────── записка со списком ─────────────────────────
const ROW_H = 92
const noteSize = n => ({ w: NOTE.w, h: 62 + n * ROW_H + 26 })
const noteHtml = ids => {
  const { w, h } = noteSize(ids.length)
  let lines = ''
  for (let i = 0; i <= ids.length; i++) lines += `<path d="M18 ${58 + i * ROW_H}H${w - 18}" stroke="#BFDDF4" stroke-width="3" stroke-linecap="round"/>`
  const paper = `M14 10Q14 4 20 4H${w - 20}Q${w - 14} 4 ${w - 14} 10V${h - 18}` +
    Array.from({ length: 9 }, (_, i) => `L${w - 14 - (i + 1) * ((w - 28) / 9)} ${h - (i % 2 ? 18 : 6)}`).join('') + 'Z'
  const rows = ids.map((id, i) => `<div class="kxn-row" data-id="${id}" style="position:absolute;left:0;top:${62 + i * ROW_H}px;width:${w}px;height:${ROW_H - 8}px">
      <div class="kxn-pic" style="position:absolute;left:24px;top:-16px;width:116px;height:116px">${inner(id, 116, true)}</div>
      <div class="kxn-chk" style="position:absolute;right:34px;top:${(ROW_H - 8 - 50) / 2}px;width:50px;height:50px;border-radius:50%;border:5px dashed #B9C6D8;box-sizing:border-box;display:grid;place-items:center;font:900 30px/1 var(--font);color:#fff"></div></div>`).join('')
  return `<div style="position:relative;width:${w}px;height:${h}px">` +
    svg(w, h, SH(w / 2, h + 2, w / 2 - 20, 6, 0.14) + `<path d="${paper}" fill="#FFFDF2" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` + lines +
      `<path d="M62 12V${h - 22}" stroke="#FFB3B3" stroke-width="3" opacity="0"/>` +
      `<g><circle cx="${w / 2}" cy="16" r="16" fill="#FF5A5F" stroke="${INK}" stroke-width="5"/><circle cx="${w / 2 - 5}" cy="11" r="4.5" fill="#fff" opacity=".8"/></g>`) + rows + '</div>'
}
const qNoteHtml = () => svg(140, 160,
  SH(70, 156, 56, 5, 0.14) + `<path d="M12 12Q12 6 18 6H122Q128 6 128 12V138L112 150L96 138L80 150L64 138L48 150L32 138L12 148Z" fill="#FFFDF2" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
  `<circle cx="70" cy="16" r="10" fill="#FF5A5F" stroke="${INK}" stroke-width="4"/>` +
  `<text x="70" y="106" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="82" fill="#FF8FC8" stroke="${INK}" stroke-width="4" paint-order="stroke">?</text>`)

// ───────────────────────── раунды ─────────────────────────
const ROUNDS = [
  {
    id: 1, need: ['apple', 'milk', 'bread'], cols: [690, 890, 1090],
    stock: [['banana', 'milk', 'lemon'], ['apple', 'cheese', 'carrot'], ['bread', 'egg', 'onion']],
  },
  {
    id: 2, need: ['tomato', 'cucumber', 'carrot', 'potato', 'broccoli'], cols: [590, 790, 990, 1190],
    stock: [['tomato', 'banana', 'cheese', 'carrot'], ['milk', 'cucumber', 'lemon', 'bread'], ['potato', 'strawberry', 'egg', 'broccoli']],
  },
  {
    id: 3, need: ['strawberry', 'banana', 'grapes'], cols: [590, 790, 990, 1190], memory: true,
    stock: [['bread', 'strawberry', 'sausage', 'milk'], ['cheese', 'banana', 'onion', 'egg'], ['tomato', 'potato', 'grapes', 'butter']],
  },
]

export default defineLevel({
  id: 'shopping',
  async run(k) {
    const gs = k.gsap
    k.bg(shopBg())

    // корзина: задняя и передняя стенки — предметы «внутри» между ними
    const basketB = k.prop(svg(560, 320, basketBack()), BASKET.x, BASKET.y, BASKET.w, BASKET.h, { z: 6 })
    const basketF = k.prop(svg(560, 320, basketFront()), BASKET.x, BASKET.y, BASKET.w, BASKET.h, { z: 8 })
    for (const b of [basketB, basketF]) b.style.pointerEvents = 'none'
    const zone = k.prop('', ZONE.x, ZONE.y, ZONE.w, ZONE.h, { z: 1 })
    zone.style.pointerEvents = 'none'
    gs.set([basketB, basketF], { autoAlpha: 0, y: 60 })

    const chukh = k.guest('chukh', 1900, CHUKH.y, { size: 280, face: 'left' })
    let pyx = null
    let counter = null   // значок с числом покупок

    // ── помощники ──
    const say = (who, id, emote) => k.tell(who, id, emote)
    const puff = (x, y) => {
      const s = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#fff;box-shadow:0 0 0 4px #3B2F4F"></div>', x, y, 34, 34, { z: 13 })
      k.fromTo(s, { scale: 0.3, opacity: 1 }, { y: -70, x: k.rand(-40, -10), scale: 1.5, opacity: 0, duration: 1, ease: 'sine.out', onComplete: () => s.remove() })
    }

    /** привезти товары: летят от Чухтика на свои места. Возвращает элементы */
    const deliver = async round => {
      const items = []
      round.stock.forEach((row, r) => row.forEach((id, c) => {
        const x = round.cols[c], y = ROWS[r]
        const el = k.prop(inner(id), x, y, 150, 150, { z: 6, cls: 'kx-food' })
        el.dataset.food = id
        gs.set(el, { x: CARGO.x - x, y: CARGO.y - y, scale: 0.2, opacity: 0 })
        items.push({ id, el, x, y })
      }))
      const order = k.shuffle(items)
      order.forEach((it, i) => {
        k.to(it.el, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.75, delay: i * 0.1, ease: 'back.out(1.4)' })
        k.after(i * 100 + 250, () => k.sfx('pop', { vol: 0.5 }))
      })
      k.after(300, () => k.sfx('whoosh'))
      await k.wait(order.length * 100 + 900)
      return items
    }

    /** убрать оставшиеся товары с полок */
    const clearStock = async items => {
      for (const it of items) it.el.style.pointerEvents = 'none'
      k.to(items.map(i => i.el), { scale: 0, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'back.in(2)' })
      k.sfx('swish')
      await k.wait(600)
      items.forEach(i => i.el.remove())
    }

    // ─── запись в записке ───
    let note = null, noteRows = {}
    const showNote = ids => {
      const { w, h } = noteSize(ids.length)
      note = k.prop(noteHtml(ids), NOTE.x, 160 + h / 2, w, h, { z: 12 })
      noteRows = {}
      for (const r of note.querySelectorAll('.kxn-row')) noteRows[r.dataset.id] = r
      k.fromTo(note, { y: -420, rotation: -14, opacity: 0 }, { y: 0, rotation: -2, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' })
      k.sfx('page')
      return note
    }
    const tick = id => {
      const row = noteRows[id]
      if (!row) return
      const chk = row.querySelector('.kxn-chk'), pic = row.querySelector('.kxn-pic')
      Object.assign(chk.style, { border: '5px solid #2E8F5B', background: '#6BCB77' })
      chk.textContent = '✓'
      k.fromTo(chk, { scale: 0 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' })
      k.to(pic, { opacity: 0.45, duration: 0.3 })
    }
    /** счёт картинок в списке: по одной, вслух */
    const countNote = async (n, who) => {
      const rows = [...note.querySelectorAll('.kxn-row')]
      for (let i = 0; i < n; i++) {
        k.fromTo(rows[i], { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' })
        await k.sayNumber(i + 1, who)
      }
    }

    const dismissNote = async () => {
      k.sfx('swish')
      await k.play(gs.to(note, { y: -500, rotation: -20, opacity: 0, duration: 0.5, ease: 'back.in(1.4)' }))
      note.remove(); note = null
    }

    // ─── памятка «?» для игры на память ───
    let qnote = null
    const hideNote = async () => {
      k.sfx('swish')
      await k.play(gs.to(note, { x: -420, rotation: -20, opacity: 0, duration: 0.5, ease: 'back.in(1.4)' }))
      qnote = k.prop(qNoteHtml(), NOTE.x, 300, 140, 160, { z: 12 })
      k.fromTo(qnote, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2.4)' })
      k.to(qnote, { rotation: 6, duration: 0.9, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      qnote.style.cursor = 'pointer'
      qnote.style.touchAction = 'manipulation'
    }
    let peeking = false
    const peek = async () => {
      if (peeking || !note || !qnote) return
      peeking = true
      k.sfx('page')
      gs.to(qnote, { scale: 0, duration: 0.25 })
      gs.set(note, { x: -420 })
      await k.play(gs.to(note, { x: 0, rotation: -2, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }))
      await k.wait(3000)
      await k.play(gs.to(note, { x: -420, rotation: -20, opacity: 0, duration: 0.45, ease: 'back.in(1.4)' }))
      gs.to(qnote, { scale: 1, duration: 0.4, ease: 'back.out(2.4)' })
      peeking = false
    }

    // ─── один раунд: ищем и кладём в корзинку ───
    const run = async (round, o = {}) => {
      const items = await o.items
      const need = round.need
      let got = 0, wrong = 0
      const inBasket = []
      const dndItems = [...items.filter(i => need.includes(i.id)), ...items.filter(i => !need.includes(i.id))]
      if (qnote) k.on(qnote, 'pointerdown', peek)
      await k.dnd({
        items: dndItems, zones: [{ id: 'basket', el: zone, pad: 40 }],
        accept: it => need.includes(it.id),
        prompt: o.prompt ? k.key(o.prompt) : null, host: o.host,
        until: placed => placed.size >= need.length,
        onCorrect: async it => {
          const n = ++got
          const sx = BASKET.x + (n - 1 - (need.length - 1) / 2) * 100, sy = 744 + (n % 2 ? 6 : -6)
          it.el.style.zIndex = '7'
          const c = k.centerOf(it.el)
          inBasket.push(it)
          k.sfx('plop')
          it.sc = Math.max(0.5, Math.min(0.95, 104 / extent(it.id)))
          await k.play(gs.to(it.el, { x: `+=${sx - c.x}`, y: `+=${sy - c.y}`, scale: it.sc, rotation: (n % 2 ? -4 : 5), duration: 0.45, ease: 'back.out(1.6)', overwrite: 'auto' }))
          gs.fromTo(basketF, { y: 0 }, { y: 8, duration: 0.1, yoyo: true, repeat: 1 })
          tick(it.id)
          if (counter) { counter.textContent = String(n); gs.fromTo(counter, { scale: 1.4 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }) }
          k.sparkle(sx, sy - 20, 4)
          await say(chukh, `n_${it.id}`, 'nod')
        },
        onWrong: async it => {
          wrong++
          k.sfx('wrong', { vol: 0.5 })
          gs.fromTo(it.el, { rotation: -8 }, { rotation: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' })
          if (it.id === 'lemon') { await say(chukh, 'w_lemon', 'surprised') }
          else if (it.id === 'onion') {
            for (let i = 0; i < 6; i++) {
              const d = k.prop('<div style="width:100%;height:100%;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#62C6FF;box-shadow:0 0 0 3px #3B2F4F"></div>', CHUKH.x - 40 + k.rand(-40, 40), 700, 18, 18, { z: 14 })
              k.to(d, { y: k.rand(60, 130), x: k.rand(-30, 30), opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power1.in', onComplete: () => d.remove() })
            }
            await say(chukh, 'w_onion', 'sad')
          } else await k.oops(chukh)
          if (wrong % 2 === 0) {
            if (o.memory) { await say(pyx, 'peek_auto', 'point'); await peek() }
            else {
              const stop = k.fx.pulse(note, '#FF5A5F'); k.after(2500, stop)
              await say(pyx, 'look_note', 'point')
            }
          }
        },
      })
      // убираем оставшееся с полок, проверяем счёт
      if (qnote) { const q = qnote; qnote = null; gs.to(q, { scale: 0, duration: 0.3, onComplete: () => q.remove() }) }
      const left = items.filter(i => !inBasket.includes(i))
      clearStock(left)
      return inBasket
    }

    // ══════════════ 0. Чухтик привозит товары ══════════════
    await k.wait(300)
    k.to([basketB, basketF], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' })
    k.sfx('whoosh')
    const arrive = chukh.moveTo({ x: CHUKH.x, y: CHUKH.y }, { duration: 2.4, hop: false })
    chukh.emote('special')
    for (let i = 0; i < 4; i++) k.after(400 + i * 500, () => puff(1700 - i * 60, 700))
    await arrive
    chukh.face('left')
    await say(chukh, 'chukh_hi', 'wave')

    // ══════════════ 1. Раунд 1: три покупки ══════════════
    await say(chukh, 'load', 'jump')
    const stock1 = deliver(ROUNDS[0])
    await stock1
    pyx = k.pyx({ x: -200, y: 955, size: 260 })
    await pyx.moveTo({ x: 190, y: 955 }, { duration: 1.6 })
    pyx.face('right')
    await say(pyx, 'pyx_hi', 'wave')
    showNote(ROUNDS[0].need)
    counter = k.badge('0', 1240, 742, { size: 96, color: '#6BCB77' })
    await say(pyx, 'list1', 'point')
    const r1 = await run(ROUNDS[0], { items: stock1, prompt: 'q_find1', host: chukh })

    // считаем покупки
    await say(chukh, 'count1', 'happy')
    for (let i = 0; i < r1.length; i++) {
      k.fromTo(r1[i].el, { scale: r1[i].sc }, { scale: r1[i].sc * 1.25, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' })
      await k.sayNumber(i + 1, chukh)
    }
    k.burst(BASKET.x, 740, 10)
    await say(pyx, 'done1', 'cheer')
    await k.praise(chukh)

    // покупки уезжают к Пыху
    const packAway = async (list) => {
      const pc = k.centerOf(pyx.el)
      k.sfx('whoosh')
      await k.play(gs.to(list.map(i => i.el), { x: `+=${pc.x - BASKET.x}`, y: `+=${pc.y - 780}`, scale: 0.2, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.in' }))
      list.forEach(i => i.el.remove())
    }
    await packAway(r1)
    await dismissNote()
    counter.textContent = '0'

    // ══════════════ 2. Раунд 2: пять покупок ══════════════
    await say(chukh, 'more', 'special')
    const stock2 = deliver(ROUNDS[1])
    showNote(ROUNDS[1].need)
    await stock2
    await say(pyx, 'list2', 'happy')
    await countNote(5, pyx)
    const r2 = await run(ROUNDS[1], { items: stock2, prompt: 'q_find2', host: pyx })
    await say(chukh, 'count2', 'happy')
    for (let i = 0; i < r2.length; i++) {
      k.fromTo(r2[i].el, { scale: r2[i].sc }, { scale: r2[i].sc * 1.25, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' })
      await k.sayNumber(i + 1, chukh)
    }
    k.burst(BASKET.x, 740, 12)
    await say(pyx, 'done2', 'cheer')
    await packAway(r2)
    await dismissNote()
    counter.textContent = '0'

    // ══════════════ 3. Раунд 3: «на память» ══════════════
    await say(chukh, 'more3', 'special')
    const stock3 = deliver(ROUNDS[2])
    showNote(ROUNDS[2].need)
    await stock3
    await say(pyx, 'r3_intro', 'point')
    await say(pyx, 'r3_look', 'nod')
    await k.wait(400)
    await hideNote()
    await say(pyx, 'r3_hide', 'wave')
    const r3 = await run(ROUNDS[2], { items: stock3, prompt: 'q_find3', host: chukh, memory: true })
    k.burst(BASKET.x, 740, 14)
    await say(pyx, 'done3', 'cheer')
    await k.praise(chukh)
    await packAway(r3)
    if (counter) gs.to(counter, { scale: 0, duration: 0.3 })

    // ══════════════ 4. вывод ══════════════
    chukh.emote('special')
    await say(chukh, 'sum', 'happy')
    await say(pyx, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
