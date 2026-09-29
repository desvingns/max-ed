// «Накрой на стол»: гости приходят по одному (2 → 3 → 4), считаем их вслух; каждому — тарелка, вилка (слева), ложка (справа), кружка.
// Хапчик утаскивает ложку — «не хватает одной». Жесты: dnd (предметы на серые тени), choose (числа), tapAll (счёт тарелок).
import { defineLevel, food } from '../lib.js'
import { INK, svg, P, E, R } from '../art.js'


/** У героев после серии эмоций «плывёт» корень (gsap путает svgOrigin/transformOrigin): после каждой эмоции сбрасываем трансформ корня. */
const guardEmotes = (k, ...chars) => {
  for (const c of chars) {
    const root = c.svg.querySelector('.c-root'), orig = c.emote.bind(c)
    let busy = 0
    c.emote = e => { busy++; return orig(e).finally(() => { if (--busy === 0 && k.alive) k.gsap.set(root, { clearProps: 'all' }) }) }
  }
  return chars[0]
}
// ───────────────────────── размеры предметов на столе ─────────────────────────
const ART = {
  plate: { name: 'plate2', w: 196, h: 90 },
  fork: { name: 'fork', w: 40, h: 148 },
  spoon: { name: 'spoon', w: 40, h: 148 },
  cup: { name: 'cup', w: 96, h: 96 },
}
// зона относительно центра места гостя (sx): dx, y центра, размер зоны
const ZONE = {
  plate: { dx: 0, y: 748, w: 224, h: 130 },
  fork: { dx: -130, y: 740, w: 108, h: 182 },
  spoon: { dx: 130, y: 740, w: 108, h: 182 },
  cup: { dx: 58, y: 664, w: 130, h: 120 },
}
const SEATS = [400, 700, 1000, 1300]
const GY = 618 // «ноги» гостей: сидят за дальним краем стола
const TRAY_X = { plate: 520, fork: 760, spoon: 1000, cup: 1240 }
const TRAY_Y = 884

const trayArt = () =>
  svg(1080, 150, `<rect x="10" y="22" width="1060" height="118" rx="46" fill="#9E6531" stroke="${INK}" stroke-width="6"/><rect x="24" y="14" width="1032" height="112" rx="44" fill="#C98F55" stroke="${INK}" stroke-width="6"/><rect x="48" y="32" width="984" height="76" rx="36" fill="#8A5528"/><path d="M70 44Q540 32 1010 44" stroke="#A56C38" stroke-width="5" stroke-linecap="round" fill="none"/>`)

const numArt = n => svg(100, 100, `<text x="50" y="80" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="96" fill="${INK}">${n}</text>`)

export const _art = { trayArt, numArt }

export default defineLevel({
  id: 'set-table',
  async run(k) {
    k.bgTable()
    const pyx = k.pyx({ x: 130, y: 658, size: 300 })
    guardEmotes(k, pyx)

    // ── помощники ──
    /** Обёртка (зона касания) с рисунком по центру; sil — серая «тень» для зоны. */
    const wrap = (type, cx, cy, o = {}) => {
      const a = ART[type], z = ZONE[type]
      const W = o.sil ? z.w : Math.max(a.w + 44, 150), H = o.sil ? z.h : Math.max(a.h + 44, 150)
      const inner = `<div style="position:absolute;left:${(W - a.w) / 2}px;top:${(H - a.h) / 2}px;width:${a.w}px;height:${a.h}px;${o.sil ? 'filter:brightness(0) opacity(.2);' : ''}">${food(a.name)}</div>`
      const el = k.prop(inner, cx, cy, W, H, { z: o.z ?? 20 })
      return el
    }
    const makeZones = seat => Object.keys(ZONE).map(type => {
      const z = ZONE[type], x = SEATS[seat] + z.dx
      const el = wrap(type, x, z.y, { sil: true, z: 12 })
      return { el, id: `${type}${seat}`, type, seat, filled: false, pad: 14 }
    })
    const makeItems = (types, n, order) => {
      const items = []
      for (const type of types) for (let i = 0; i < n; i++) {
        const el = wrap(type, TRAY_X[type] + i * 12, TRAY_Y - i * 10)
        items.push({ el, id: `${type}${i}`, type })
      }
      return items
    }
    const badgeAbove = (g, n, o = {}) => {
      const c = k.centerOf(g.el)
      return k.badge(String(n), c.x, c.y - 170, { size: 96, ...o })
    }

    const guests = []
    const arrive = async (id, size, fromX, seat, faceFrom = 'left') => {
      const g = k.guest(id, fromX, GY, { size, z: 11 })
      guardEmotes(k, g)
      guests.push(g)
      await g.moveTo({ x: SEATS[seat], y: GY }, { duration: 1.2 })
      g.face(seat < 2 ? 'right' : 'left')
      return g
    }
    const countGuests = async () => {
      const bs = []
      for (let i = 0; i < guests.length; i++) {
        bs.push(badgeAbove(guests[i], i + 1))
        k.sfx('pop')
        await k.sayNumber(i + 1)
      }
      await k.wait(300)
      bs.forEach(b => k.to(b, { scale: 0, opacity: 0, duration: 0.25, onComplete: () => b.remove() }))
    }

    // ── набор для одного/нескольких гостей ──
    const spoken = new Set()
    const setUp = async (seats, o = {}) => {
      const zones = seats.flatMap(makeZones)
      const items = makeItems(['plate', 'fork', 'spoon', 'cup'], seats.length)
      k.fromTo(zones.map(z => z.el), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(2)' })
      k.gsap.set(items.map(i => i.el), { opacity: 0 })
      k.fromTo(items.map(i => i.el), { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'back.out(1.6)' })
      k.sfx('whoosh')
      await k.wait(600)
      return { zones, items }
    }
    const runDnd = async ({ zones, items }, o = {}) => {
      await k.dnd({
        items, zones, pad: 14,
        accept: (it, z) => it.type === z.type && !z.filled,
        prompt: o.prompt ? k.key(o.prompt) : null, host: pyx,
        onCorrect: async (it, z) => {
          z.filled = true
          const c = k.centerOf(z.el), s = k.centerOf(it.el)
          k.to(it.el, { x: `+=${c.x - s.x}`, y: `+=${c.y - s.y}`, duration: 0.25, ease: 'power2.out' })
          k.to(z.el, { opacity: 0, duration: 0.2 })
          k.sparkle(c.x, c.y, 4)
          await k.wait(260)
          if (o.speak && !spoken.has(it.type)) {
            spoken.add(it.type)
            await k.tell(pyx, `${it.type}_ok`, it.type === 'plate' ? 'happy' : 'nod')
          }
        },
        onWrong: async (it, z) => {
          if (!z) return
          if (it.type === z.type) { await k.tell(pyx, 'has', 'shake'); return }
          if (it.type === 'fork' && z.type === 'spoon') { await k.tell(pyx, 'fork_left', 'point'); return }
          if (it.type === 'spoon' && z.type === 'fork') { await k.tell(pyx, 'spoon_right', 'point'); return }
          await k.tell(pyx, 'spot', 'think')
        },
      })
    }

    // ═════════ вступление ═════════
    const tray = k.prop(trayArt(), 880, 892, 1080, 150, { z: 3 })
    k.fromTo(tray, { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' })
    await k.wait(400)
    await k.tell(pyx, 'hello', 'wave')

    // ═════════ раунд 1: два гостя ═════════
    const busya = await arrive('busya', 320, -160, 0)
    busya.emote('wave')
    await k.tell(busya, 'busya_hi')
    const hamster = await arrive('shchyok', 300, 1760, 1)
    await k.tell(hamster, 'shchyok_hi', 'happy')
    await countGuests()
    await k.tell(pyx, 'two', 'point')
    const r1 = await setUp([0, 1])
    await k.tell(pyx, 'rule', 'point')
    await runDnd(r1, { prompt: 'q_drag', speak: true })
    k.burst(550, 700, 8)
    busya.emote('happy'); hamster.emote('happy')
    await k.tell(pyx, 'r1_done', 'cheer')

    // ═════════ раунд 2: третий гость, Хапчик утащил ложку ═════════
    const tarabar = await arrive('tarabar', 300, 1760, 2)
    tarabar.emote('wave')
    await k.tell(tarabar, 'tarabar_hi')
    await countGuests()
    await k.tell(pyx, 'three', 'point')
    const r2 = await setUp([2])
    const spoon2 = r2.items.find(i => i.type === 'spoon')
    // Хапчик хватает ложку
    const hap = k.guest('hapchik', 1780, 380, { size: 250, z: 30 })
    guardEmotes(k, hap)
    await hap.moveTo({ x: TRAY_X.spoon + 60, y: 972 }, { duration: 1.1, hop: false })
    hap.emote('laugh')
    k.sfx('whoosh')
    await k.tell(hap, 'hap')
    {
      const hc = k.centerOf(hap.el), sc = k.centerOf(spoon2.el)
      await k.play(k.gsap.to(spoon2.el, { x: `+=${hc.x - 30 - sc.x}`, y: `+=${hc.y - sc.y}`, rotation: 30, duration: 0.3, ease: 'power2.in' }))
      const away = { x: 1800, y: 300 }
      k.to(spoon2.el, { x: `+=${away.x - hc.x}`, y: `+=${away.y - hc.y - 130}`, rotation: 200, duration: 1.1, ease: 'power1.in' })
      await hap.moveTo({ x: away.x, y: away.y + 130 }, { duration: 1.1, hop: false })
    }
    pyx.emote('surprised')
    await k.tell(pyx, 'gone')
    const num = (n, color, correct) => ({
      id: `n${n}`, art: `<div style="width:196px;height:196px;display:grid;place-items:center">${numArt(n)}</div>`, color, correct,
      outcome: async () => {
        if (correct) { await k.tell(pyx, 'one', 'cheer') } else {
          const stop = k.fx.pulse(zones2spoon.el, '#FFFFFF'); k.after(4000, stop)
          await k.tell(pyx, 'recount', 'think')
        }
      },
    })
    const zones2spoon = r2.zones.find(z => z.type === 'spoon')
    await k.choose({ prompt: k.key('q_missing'), host: pyx, options: [num(2, '#FF8FC8', false), num(1, '#FFD93D', true), num(3, '#62C6FF', false)] })
    // Хапчик возвращает
    {
      const from = { x: 1800, y: 430 }
      hap.face('left')
      await hap.moveTo({ x: TRAY_X.spoon + 60, y: 972 }, { duration: 1.0, hop: false })
      hap.emote('happy')
      await k.tell(hap, 'sorry')
      await k.play(k.gsap.to(spoon2.el, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.6)' }))
      k.sfx('plop')
      hap.moveTo({ x: 1800, y: 350 }, { duration: 1.2, hop: false })
    }
    await runDnd(r2, {})
    k.burst(1000, 700, 8)
    tarabar.emote('happy')
    await k.tell(pyx, 'r2_done', 'cheer')
    hap.destroy?.()

    // ═════════ раунд 3: четвёртый гость ═════════
    const chukh = await arrive('chukh', 340, 1780, 3)
    chukh.emote('happy')
    k.sfx('tick')
    await k.tell(chukh, 'chukh_hi')
    await countGuests()
    await k.tell(pyx, 'four', 'point')
    const r3 = await setUp([3])
    await runDnd(r3, {})
    k.burst(1300, 700, 8)

    // считаем тарелки: нажимаем на каждую
    const plates = [r1, r2, r3].flatMap(r => r.items.filter(i => i.type === 'plate').map(i => i.el))
    plates.forEach(p => { p.style.pointerEvents = '' })
    await k.tell(pyx, 'q_count', 'point')
    let counted = 0
    await k.tapAll(plates, {
      onTap: async el => {
        const n = ++counted
        const c = k.centerOf(el)
        k.badge(String(n), c.x, c.y - 24, { size: 84 })
        k.sfx('pop')
        await k.sayNumber(n)
      },
    })
    await k.wait(800)
    guests.forEach((g, i) => k.after(i * 200, () => g.emote('cheer')))
    k.sfx('yum')
    await k.tell(pyx, 'final', 'happy')
    await k.tell(pyx, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
