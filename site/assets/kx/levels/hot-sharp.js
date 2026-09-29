// «Горячо! Остро! Можно!» — сортировка кухонных вещей по зонам безопасности (образец для dnd).
import { defineLevel } from '../lib.js'
import { kitchen } from '../deps.js'

const ITEMS = [
  // [id, тип, art-фабрика, ширина]
  ['kettle', 'hot', () => kitchen.kettle({ water: true, boiling: true }), 190],
  ['pan', 'hot', () => kitchen.pan({ egg: 'cooked', sizzle: true }), 220],
  ['stove', 'hot', () => kitchen.stove({ on: true }), 200],
  ['knife', 'sharp', null, 70, 'bigKnife'],
  ['grater', 'sharp', null, 110, 'grater'],
  ['peeler', 'sharp', null, 70, 'peeler'],
  ['spoon', 'can', () => kitchen.spoonWood(), 56],
  ['cup', 'can', null, 130, 'cup'],
  ['bowl', 'can', () => kitchen.bowl(), 200],
]
const ROUNDS = [['kettle', 'knife', 'spoon'], ['pan', 'grater', 'cup'], ['stove', 'peeler', 'bowl']]

export default defineLevel({
  id: 'hot-sharp',
  async run(k) {
    k.kitchenBg()
    const pyx = k.pyx({ x: 250 })
    // три зоны
    const Z = [
      { id: 'hot', x: 640, icon: '🔥', color: '#FF5A5F', adult: true },
      { id: 'sharp', x: 940, icon: '🔪', color: '#B388EB', adult: true },
      { id: 'can', x: 1240, icon: '👍', color: '#6BCB77', adult: false },
    ]
    const zones = Z.map(z => {
      const el = k.prop(`<div style="width:100%;height:100%;border-radius:40px;background:rgba(255,255,255,.85);box-shadow:inset 0 0 0 10px ${z.color},0 10px 0 rgba(0,0,0,.14);display:grid;place-items:center;position:relative"><span class="emoji" style="font-size:120px">${z.icon}</span>${z.adult ? '<span class="emoji" style="position:absolute;right:10px;bottom:6px;font-size:52px">👩‍🍳</span>' : ''}</div>`, z.x, 470, 250, 250, { z: 3 })
      return { ...z, el }
    })
    k.popIn(zones.map(z => z.el), 0.12)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(pyx, 'rule', 'point')

    for (let r = 0; r < ROUNDS.length; r++) {
      if (r === 1) await k.tell(pyx, 'round2', 'cheer')
      if (r === 2) await k.tell(pyx, 'round3', 'cheer')
      const ids = k.shuffle(ROUNDS[r])
      const items = ids.map((id, i) => {
        const [, type, fn, w, art] = ITEMS.find(x => x[0] === id)
        const html = art ? null : fn()
        const sz = kitchen.sizes
        const el = art ? k.food(art, 500 + i * 300, 860, w, { z: 20 }) : (() => {
          const h = Math.round(w * (id === 'kettle' ? 250 / 260 : id === 'pan' ? 170 / 400 : id === 'stove' ? 300 / 440 : id === 'bowl' ? 160 / 260 : 260 / 80))
          return k.prop(html, 500 + i * 300, 860, w, h, { z: 20 })
        })()
        return { id, type, el }
      })
      k.fromTo(items.map(i => i.el), { y: 300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
      await k.dnd({
        items, zones,
        prompt: r === 0 ? k.key('q_drag') : null, host: pyx,
        accept: (it, z) => it.type === z.id,
        onCorrect: async (it, z) => {
          const c = k.centerOf(z.el)
          k.to(it.el, { x: `+=${c.x - k.centerOf(it.el).x}`, y: `+=${c.y - k.centerOf(it.el).y}`, scale: 0.55, duration: 0.35, ease: 'power2.out' })
          k.sparkle(c.x, c.y, 5)
          if (z.adult) k.bubble('👍', c.x + 150, c.y - 130, { w: 140, h: 120, font: 56 })
          await k.tell(pyx, `${z.id}_ok`, 'happy')
        },
        onWrong: async (it, z) => {
          if (!z) return
          k.sfx('wrong')
          const lineFor = it.type === 'hot' ? 'hot_bad' : it.type === 'sharp' ? 'sharp_bad' : 'can_bad'
          pyx.emote(it.type === 'can' ? 'laugh' : 'surprised')
          await k.tell(pyx, lineFor)
        },
      })
      await k.wait(300)
      if (r < ROUNDS.length - 1) {
        k.to(items.map(i => i.el), { opacity: 0, scale: 0.2, duration: 0.3 })
        k.to(zones.map(z => z.el.querySelector('div')), { opacity: 1, duration: 0.01 })
        document.querySelectorAll('.kx-bubble').forEach(b => b.remove())
        await k.wait(350)
        items.forEach(i => i.el.remove())
      }
    }
    await k.narrate('sum')
    await k.tell(pyx, 'bye', 'cheer')
    k.burst(800, 400, 14)
  },
})
