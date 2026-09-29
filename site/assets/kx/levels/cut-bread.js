// «Ровные ломтики»: свободная резка (ломтики выходят разные), сравнение «толстый/тонкий», сортировка по тарелкам, потом ровная резка по пунктиру.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, R } from '../art.js'
import { liveSplit } from './_split.js'

const LOAF = { x: 800, y: 585, W: 560 }
const LH = Math.round((LOAF.W * 146) / 260)
const FLOOR = 960

const slabIcon = (h, color = '#E6A462') => svg(80, 60, R(6, 30 - h / 2, 68, h, Math.min(10, h / 2), color, { sw: 5 }) + R(14, 30 - h / 2 + 5, 52, Math.max(2, h - 10), 3, '#FFEFC6', { sw: 0 }))

export default defineLevel({
  id: 'cut-bread',
  async run(k) {
    const gsap = k.gsap
    k.kitchenBg()
    const board = k.food('board', 800, 690, 800, { z: 3 })
    const pyx = k.pyx({ x: 210 })
    k.fromTo(board, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    const front = k.prop('', 800, 500, 1600, 1000, { z: 30 }) // слой для перетаскиваемого
    front.style.pointerEvents = 'none'

    const noShadow = h => h.replace(/<ellipse class="kx-shadow"[^>]*>/, '')
    /** кусок булки [a,b] с бледным срезом по краям */
    const chunk = (a, b, z = 7) => {
      const w = (b - a) * LOAF.W
      const cx = LOAF.x - LOAF.W / 2 + ((a + b) / 2) * LOAF.W
      const el = k.prop('', cx, LOAF.y, w, LH, { z })
      const layer = (clip, extra = '', plain = false) => `<div style="position:absolute;left:${-a * LOAF.W}px;top:0;width:${LOAF.W}px;height:${LH}px;clip-path:${clip};${extra}">${plain ? noShadow(food('bread')) : food('bread')}</div>`
      const fw = 0.04
      const face = 'filter:brightness(1.5) saturate(.55)'
      let html = layer(`inset(0 ${(1 - b) * 100}% 0 ${a * 100}%)`)
      if (a > 0.001) html += layer(`inset(0 ${(1 - a - fw) * 100}% 0 ${a * 100}%)`, face, true)
      if (b < 0.999) html += layer(`inset(0 ${(1 - b) * 100}% 0 ${(b - fw) * 100}%)`, face, true)
      el.innerHTML = html
      return el
    }
    const newLoaf = () => {
      const el = k.food('bread', LOAF.x, LOAF.y, LOAF.W, { z: 6 })
      k.fromTo(el, { y: -420, rotation: -8, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.7, ease: 'bounce.out' })
      k.sfx('boing', { vol: 0.5 })
      return el
    }
    const finishPieces = (sv, res) => {
      res.clear()
      const out = sv.pieces.map(p => { p.el.style.pointerEvents = 'auto'; return { el: p.el, w: p.b - p.a } })
      return out
    }
    const feed = async (el, target, dx = 0, dy = -60) => {
      const c = k.centerOf(el), to = k.centerOf(target.el)
      await k.play(gsap.to(el, { x: `+=${to.x - c.x + dx}`, y: `+=${to.y - c.y + dy}`, scale: 0.2, rotation: k.rand(-40, 40), duration: 0.6, ease: 'power2.in' }))
      el.remove()
      k.sfx('crunch', { vol: 0.6 })
      target.emote('happy')
    }
    const crumbs = f => {
      const x = LOAF.x - LOAF.W / 2 + f * LOAF.W
      k.sfx('crunch', { vol: 0.5 })
      for (let i = 0; i < 12; i++) {
        const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#C98546"></div>', x + k.rand(-25, 25), LOAF.y - 40 + k.rand(-30, 60), k.rand(6, 12), k.rand(6, 12), { z: 9 })
        k.to(d, { y: k.rand(90, 170), x: k.rand(-30, 30), opacity: 0, duration: k.rand(0.5, 0.9), ease: 'power1.in', onComplete: () => d.remove() })
      }
    }

    // ── вступление ──
    await k.wait(500)
    await k.tell(pyx, 'hello', 'wave')
    const busya = k.guest('busya', -180, FLOOR, { size: 240 })
    const hamster = k.guest('shchyok', 1780, FLOOR, { size: 240, face: 'left' })
    await Promise.all([busya.moveTo({ x: 440, y: FLOOR }), hamster.moveTo({ x: 1160, y: FLOOR }), k.tell(hamster, 'guests', 'happy')])
    busya.face('right'); hamster.face('left')
    await k.tell(busya, 'busya', 'happy')
    const loaf = newLoaf()
    await k.wait(600)
    await k.tell(pyx, 'goal', 'point')

    // ── свободная резка: 4 среза ──
    let thin = 0
    const sv1 = liveSplit(k, { render: chunk, gap: 16, layer: front })
    const res1 = await k.cutLinear({
      food: 'bread', el: loaf, at: { x: LOAF.x, y: LOAF.y }, width: LOAF.W, mode: 'split', count: 4, gap: 16, minGap: 0.09,
      evaluate: f => (f > 0.09 && f < 0.91 ? true : { ok: false }),
      onBad: f => { crumbs(f); thin++; if (thin <= 2) k.tell(pyx, 'crumbs', 'surprised') },
      onCut: async (i, info) => { sv1.update(info); await k.wait(300) },
      prompt: k.key('q_cut'), host: pyx,
    })
    const pieces = finishPieces(sv1, res1)
    const widths = pieces.map(p => p.w)
    const ratio = Math.max(...widths) / Math.min(...widths)
    k.burst(LOAF.x, LOAF.y - 120, 8)

    if (ratio < 1.4) {
      // редкий случай: ломтики уже почти ровные — раздаём поровну
      await k.tell(pyx, 'lucky', 'cheer')
      const eaters = [busya, busya, pyx, hamster, hamster]
      await k.tell(pyx, 'lucky_share', 'point')
      for (let i = 0; i < pieces.length; i++) {
        k.sayNumber(i + 1)
        await feed(pieces[i].el, eaters[i])
      }
    } else {
      // ── сравнить и разложить по тарелкам ──
      const mean = widths.reduce((a, b) => a + b, 0) / widths.length
      pieces.forEach(p => { p.cls = p.w > mean + 0.004 ? 'thick' : 'thin' })
      const thickest = pieces.reduce((a, b) => (b.w > a.w ? b : a)), thinnest = pieces.reduce((a, b) => (b.w < a.w ? b : a))
      const stops = [k.fx.pulse(thickest.el, '#FFFFFF'), k.fx.pulse(thinnest.el, '#FF5A5F')]
      await k.tell(pyx, 'uneven', 'point')
      stops.forEach(s => s())
      await k.play(gsap.to(pieces.map(p => p.el), { scale: 0.6, y: -20, duration: 0.45, ease: 'back.out(1.6)' }))

      const plateThin = k.prop(kitchen.plate(), 690, 815, 220, 76, { z: 6 })
      const plateThick = k.prop(kitchen.plate(), 910, 815, 220, 76, { z: 6 })
      const badge = (x, h, color) => k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 7px ${color},0 6px 0 rgba(0,0,0,.14);display:grid;place-items:center"><div style="width:62px;height:46px">${slabIcon(h)}</div></div>`, x, 735, 98, 98, { z: 9 })
      const badges = [badge(690, 10, '#FF8FC8'), badge(910, 40, '#FFB938')]
      k.popIn([plateThin, plateThick, ...badges], 0.1)
      const zones = [
        { id: 'thin', el: plateThin, who: busya, ok: 'ok_thin', n: 0, said: false, pad: 70 },
        { id: 'thick', el: plateThick, who: hamster, ok: 'ok_thick', n: 0, said: false, pad: 70 },
      ]
      await k.dnd({
        items: pieces.map(p => ({ el: p.el, id: p.cls, cls: p.cls })), zones,
        prompt: k.key('q_sort'), host: pyx,
        accept: (it, z) => it.cls === z.id,
        onCorrect: async (it, z) => {
          const c = k.centerOf(z.el), cur = k.centerOf(it.el), n = z.n++
          await k.play(gsap.to(it.el, { x: `+=${c.x - 46 + n * 30 - cur.x}`, y: `+=${c.y - 52 - cur.y}`, scale: 0.4, rotation: k.rand(-4, 4), duration: 0.4, ease: 'power2.out' }))
          k.sparkle(c.x, c.y - 40, 3)
          if (!z.said) { z.said = true; z.who.emote('happy'); await k.tell(z.who, z.ok) }
        },
        onWrong: async (it, z) => {
          if (!z) return
          if (it.cls === 'thick') { busya.emote('surprised'); await k.tell(busya, 'bad_thick') } else { hamster.emote('sad'); await k.tell(hamster, 'bad_thin') }
        },
      })
      await k.tell(pyx, 'uneven_sum', 'think')
      // друзья съедают свои ломтики
      k.sfx('crunch')
      await Promise.all(pieces.map(p => feed(p.el, p.cls === 'thin' ? busya : hamster, 0, -30)))
      k.tell(hamster, 'munch')
      const gone = [plateThin, plateThick, ...badges]
      gsap.to(gone, { opacity: 0, scale: 0.6, duration: 0.35, onComplete: () => gone.forEach(e => e.remove()) })
      await k.wait(700)

      // ── раунд 2: ровно, по пунктиру ──
      const loaf2 = newLoaf()
      await k.wait(700)
      const sv2 = liveSplit(k, { render: chunk, gap: 26, layer: front })
      const res2 = await k.cutLinear({
        food: 'bread', el: loaf2, at: { x: LOAF.x, y: LOAF.y }, width: LOAF.W, mode: 'split', cuts: [0.25, 0.5, 0.75], tol: 0.07, gap: 26,
        prompt: k.key('q_even'), host: pyx,
        onCut: async (i, info) => { sv2.update(info); await k.wait(300) },
      })
      const even = finishPieces(sv2, res2)
      k.burst(LOAF.x, LOAF.y - 120, 8)
      await k.tell(pyx, 'even_ok', 'cheer')
      await k.tell(pyx, 'even_share', 'point')
      const eaters = [busya, busya, hamster, hamster]
      for (let i = 0; i < even.length; i++) {
        k.sayNumber(i + 1)
        await feed(even[i].el, eaters[i])
      }
    }

    await k.wait(300)
    await k.narrate('sum')
    await k.tell(hamster, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
