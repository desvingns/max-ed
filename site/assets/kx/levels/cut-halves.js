// «Пополам и поровну»: режем булку ровно пополам (кривой срез — друг обижается), потом пирог на четвертинки для четверых.
import { defineLevel, food } from '../lib.js'
import { svg, P, F, C, HL, S, star, circlePath, nid, INK } from '../art.js'

const LOAF = { x: 800, y: 610, W: 500 }
const LOAF_H = Math.round((LOAF.W * 146) / 260)
const FLOOR = 960
const PIE = { x: 800, y: 590, size: 340 }

/** Круглый вишнёвый пирог с решёткой, вид сверху (400×400). */
const pieArt = () => {
  const id = nid('pie')
  const crust = S(star(200, 200, 194, 181, 26, 0), '#F4BC6E', '#D18E45')
  let strips = ''
  for (let i = -7; i <= 7; i++) {
    const c = i * 62
    const d = 400 + i * 62
    strips += `<path d="M${c} 0L${c + 400} 400" stroke="${INK}" stroke-width="30" stroke-linecap="butt"/>`
    strips += `<path d="M${d} 0L${d - 400} 400" stroke="${INK}" stroke-width="30" stroke-linecap="butt"/>`
  }
  let fills = ''
  for (let i = -7; i <= 7; i++) {
    const c = i * 62
    fills += `<path d="M${c} 0L${c + 400} 400" stroke="#F7D08E" stroke-width="21" stroke-linecap="butt"/>`
  }
  for (let i = -7; i <= 7; i++) {
    const d = 400 + i * 62
    fills += `<path d="M${d} 0L${d - 400} 400" stroke="#F7D08E" stroke-width="21" stroke-linecap="butt"/>`
  }
  let cherries = ''
  for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) {
    if ((i + j) % 2) continue
    const x = 231 + 31 * (i + j), y = 200 + 31 * (j - i)
    if (Math.hypot(x - 200, y - 200) > 122) continue
    cherries += `<circle cx="${x}" cy="${y}" r="11" fill="#C2203F"/><circle cx="${x - 3.5}" cy="${y - 4}" r="3.4" fill="#fff" opacity=".7"/>`
  }
  return svg(400, 400,
    crust +
    P(circlePath(200, 200, 152), '#E23C58', { sw: 5 }) +
    cherries +
    `<clipPath id="${id}"><circle cx="200" cy="200" r="150"/></clipPath>` +
    `<g clip-path="url(#${id})" fill="none">${strips}${fills}</g>` +
    P(circlePath(200, 200, 152), 'none', { sw: 5 }) +
    C(200, 200, 26, '#F4BC6E', { sw: 5 }) + C(200, 200, 12, '#FFE0A8', { sw: 4 }) +
    HL(120, 92, 34, 9, -35, 0.55))
}

export default defineLevel({
  id: 'cut-halves',
  async run(k) {
    const gsap = k.gsap
    k.kitchenBg()
    const board = k.food('board', 800, 690, 800, { z: 3 })
    const pyx = k.pyx({ x: 210 })
    k.fromTo(board, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })

    // кусок булки как самостоятельный элемент (со светлым срезом), доли [a,b] от целой булки
    const chunk = (a, b, z = 7) => {
      const w = (b - a) * LOAF.W
      const cx = LOAF.x - LOAF.W / 2 + ((a + b) / 2) * LOAF.W
      const el = k.prop('', cx, LOAF.y, w, LOAF_H, { z })
      const layer = extra => `<div style="position:absolute;left:${-a * LOAF.W}px;top:0;width:${LOAF.W}px;height:${LOAF_H}px;${extra}">${food('bread')}</div>`
      const fw = 0.045
      const face = 'filter:brightness(1.5) saturate(.55)'
      let html = layer(`clip-path:inset(0 ${(1 - b) * 100}% 0 ${a * 100}%)`)
      if (a > 0.001) html += layer(`clip-path:inset(0 ${(1 - a - fw) * 100}% 0 ${a * 100}%);${face}`)
      if (b < 0.999) html += layer(`clip-path:inset(0 ${(1 - b) * 100}% 0 ${(b - fw) * 100}%);${face}`)
      el.innerHTML = html
      return el
    }
    const guideLine = () => {
      const d = document.createElement('div')
      d.style.cssText = `position:absolute;left:${LOAF.x - 4}px;top:${LOAF.y - LOAF_H / 2 - 30}px;width:8px;height:${LOAF_H + 60}px;z-index:8;pointer-events:none;background:repeating-linear-gradient(to bottom,#3B2F4F 0 14px,transparent 14px 26px);border-radius:4px;opacity:.75`
      k.world.appendChild(d)
      gsap.from(d, { opacity: 0, duration: 0.4 })
      return d
    }

    await k.wait(500)
    await k.tell(pyx, 'hello', 'wave')

    // булка выезжает, приходят гости
    const loaf = k.food('bread', LOAF.x, LOAF.y, LOAF.W, { z: 6 })
    k.fromTo(loaf, { y: -420, rotation: -10, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.7, ease: 'bounce.out' })
    k.sfx('boing', { vol: 0.5 })
    const busya = k.guest('busya', -180, FLOOR, { size: 240 })
    const hamster = k.guest('shchyok', 1780, FLOOR, { size: 240, face: 'left' })
    await Promise.all([k.tell(pyx, 'guests', 'point'), busya.moveTo({ x: 560, y: FLOOR }), hamster.moveTo({ x: 1220, y: FLOOR })])
    busya.face('right'); hamster.face('left')
    await k.tell(busya, 'busya_want', 'happy')
    await k.tell(hamster, 'shchyok_want', 'happy')
    await k.tell(pyx, 'fair', 'think')

    // ── раунд 1: булка пополам ──
    let ghost = false, misses = 0, mid = null, engineClone = null
    const uneven = async f => {
      if (ghost) return
      ghost = true
      misses++
      k.sfx('swing')
      gsap.set(engineClone, { opacity: 0 })
      const A = chunk(0, f), B = chunk(f, 1)
      k.sfx('chop')
      gsap.fromTo(A, { x: 0 }, { x: -36, duration: 0.3, ease: 'back.out(2)' })
      gsap.fromTo(B, { x: 0 }, { x: 36, duration: 0.3, ease: 'back.out(2)' })
      const smallLeft = f < 0.5
      const who = smallLeft ? busya : hamster
      who.emote('sad')
      k.sfx('yuck', { vol: 0.5 })
      await k.tell(who, smallLeft ? 'uneven_l' : 'uneven_r')
      gsap.to(A, { x: 0, duration: 0.35 })
      gsap.to(B, { x: 0, duration: 0.35 })
      await k.wait(420)
      A.remove(); B.remove()
      gsap.set(engineClone, { opacity: 1 })
      k.sfx('pop')
      ghost = false
      if (misses >= 2 && !mid) { mid = guideLine(); k.tell(pyx, 'mid', 'point') } else if (misses === 1) k.tell(pyx, 'retry', 'think')
    }
    const before = new Set(k.world.children)
    const cutP = k.cutLinear({
      food: 'bread', el: loaf, at: { x: LOAF.x, y: LOAF.y }, width: LOAF.W, mode: 'split', count: 1, gap: 60,
      evaluate: f => (!ghost && f >= 0.42 && f <= 0.58 ? true : { ok: false }),
      onBad: f => uneven(f),
      onCut: async () => { await k.wait(450) },
      prompt: k.key('q_cut'), host: pyx,
    })
    engineClone = [...k.world.children].find(c => !before.has(c) && c.dataset?.food === 'bread')
    const res = await cutP
    mid?.remove()
    const halves = res.pieces.map(p => {
      const el = chunk(p.a, p.b)
      gsap.set(el, { x: Number(gsap.getProperty(p.el, 'x')) || 0 })
      return el
    })
    res.clear()
    k.burst(LOAF.x, LOAF.y - 100, 8)
    await k.tell(pyx, 'halves', 'cheer')

    // раздать половинки
    const friends = [
      { id: 'busya', who: busya, eat: 'busya_eat' },
      { id: 'shchyok', who: hamster, eat: 'shchyok_eat' },
    ].map(f => ({ ...f, el: f.who.el }))
    await k.dnd({
      items: halves.map((el, i) => ({ el, id: `half${i}` })), zones: friends,
      prompt: k.key('q_give'), host: pyx,
      accept: (it, z) => !z.taken,
      onCorrect: async (it, z) => {
        z.taken = true
        const to = k.centerOf(z.el), from = k.centerOf(it.el)
        await k.play(gsap.to(it.el, { x: `+=${to.x - from.x}`, y: `+=${to.y - from.y - 60}`, scale: 0.3, rotation: 18, duration: 0.5, ease: 'power2.in' }))
        it.el.remove()
        k.sfx('crunch')
        z.who.emote('happy')
        await k.tell(z.who, z.eat)
      },
      onWrong: async (it, z) => { if (z) { z.who.emote('surprised'); await k.tell(pyx, 'has_one') } },
    })
    await k.tell(pyx, 'half_word', 'point')

    // ── раунд 2: пирог на четверых ──
    const tyuk = k.guest('tyuk', 1780, FLOOR, { size: 240, face: 'left' })
    const kapa = k.guest('kapa', -180, FLOOR, { size: 240 })
    await Promise.all([k.tell(pyx, 'round2', 'point'), tyuk.moveTo({ x: 1000, y: FLOOR }), kapa.moveTo({ x: 780, y: FLOOR })])
    tyuk.face('left'); kapa.face('right')
    const pie = k.prop(pieArt(), PIE.x, PIE.y, PIE.size, PIE.size, { z: 6 })
    k.fromTo(pie, { y: -380, scale: 0.4, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'bounce.out' })
    k.sfx('boing', { vol: 0.5 })
    await k.wait(600)
    await k.tell(tyuk, 'tyuk_hi', 'happy')
    await k.tell(kapa, 'kapa_hi', 'think')

    const fixOpacity = () => k.world.querySelectorAll('[style*="polygon"]').forEach(e => { e.style.opacity = '1' })
    const res2 = await k.cutRound({
      el: pie, at: { x: PIE.x, y: PIE.y }, size: PIE.size, angles: [90, 0], tolDeg: 30, gap: 22,
      prompt: k.key('q_pie1'), host: pyx,
      onCut: async i => {
        fixOpacity()
        await k.wait(350)
        await k.tell(pyx, i === 0 ? 'pie_half' : 'pie_quarters', i === 0 ? 'point' : 'cheer')
        if (i === 0) await k.tell(pyx, 'pie_half2', 'point')
      },
    })
    fixOpacity()
    await k.wait(200)

    // сектора → самостоятельные элементы (чтобы можно было нажимать/показывать подсказку)
    const R = PIE.size / 2
    const wrapSector = s => {
      const gx = Number(gsap.getProperty(s.el, 'x')) || 0, gy = Number(gsap.getProperty(s.el, 'y')) || 0
      let x0 = 0, y0 = 0, x1 = 0, y1 = 0
      for (let a = s.a0; a <= s.a1 + 0.01; a += 3) {
        const px = Math.cos((a * Math.PI) / 180) * R, py = Math.sin((a * Math.PI) / 180) * R
        x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py)
      }
      const bw = x1 - x0, bh = y1 - y0
      const w = k.prop('', PIE.x + x0 + bw / 2 + gx, PIE.y + y0 + bh / 2 + gy, bw, bh, { z: 7 })
      gsap.set(s.el, { x: 0, y: 0 })
      Object.assign(s.el.style, { left: `${-R - x0}px`, top: `${-R - y0}px` })
      w.appendChild(s.el)
      return w
    }
    const quarters = res2.sectors.map(wrapSector)
    const servedBy = new Set()
    const eaters = [busya, kapa, tyuk, hamster]
    const flights = []
    let count = 0
    await k.tapAll(quarters, {
      pulse: false, prompt: k.key('q_count'), host: pyx,
      onTap: el => {
        count++
        k.sayNumber(count)
        const c = k.centerOf(el)
        const free = eaters.filter(e => !servedBy.has(e)).sort((a, b) => Math.abs(k.centerOf(a.el).x - c.x) - Math.abs(k.centerOf(b.el).x - c.x))[0]
        servedBy.add(free)
        const to = k.centerOf(free.el)
        flights.push((async () => {
          await k.play(gsap.to(el, { x: `+=${to.x - c.x}`, y: `+=${to.y - c.y - 60}`, scale: 0.3, rotation: 20, duration: 0.6, ease: 'power2.in' }))
          el.remove()
          k.sfx('crunch', { vol: 0.6 })
          free.emote('happy')
        })())
      },
    })
    await Promise.all(flights)
    await k.wait(300)
    await k.tell(pyx, 'all_quarters', 'cheer')
    k.burst(800, 420, 14)
    await k.tell(tyuk, 'tyuk_eat', 'happy')
    await k.tell(kapa, 'kapa_eat', 'laugh')
    await k.narrate('sum')
    await k.tell(busya, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
