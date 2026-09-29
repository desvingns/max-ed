// «Огурчики-кружочки»: безопасный ножичек, кошачья лапка, срез по пунктиру, счёт кружочков.
import { defineLevel } from '../lib.js'
import { kitchen } from '../deps.js'

export default defineLevel({
  id: 'cut-cucumber',
  async run(k) {
    const L = k.layout
    k.kitchenBg()
    const board = k.food('board', 800, 690, 800, { z: 3 })
    const pyx = k.pyx({ x: 280 })
    const busya = k.guest('busya', 1420, L.floorY, { size: 270, face: 'left' })
    const plate = k.prop(kitchen.plate(), 1340, 690, 260, 90, { z: 4 })
    k.fromTo([board, plate], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
    await k.wait(500)

    await k.tell(pyx, 'hello', 'wave')
    await k.tell(busya, 'hungry', 'happy')

    // безопасный ножичек
    const knife = k.food('knife', 1130, 545, 100, { z: 8 })
    k.fromTo(knife, { y: -300, rotation: 40, opacity: 0 }, { y: 0, rotation: -12, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' })
    k.sfx('whoosh')
    await k.tell(pyx, 'knife', 'point')
    k.to(knife, { opacity: 0, y: 40, duration: 0.3, overwrite: true })

    const eaten = []
    const eat = async els => {
      const to = k.centerOf(busya.el)
      k.sfx('crunch')
      await k.play(k.gsap.to(els, { x: `+=${to.x - 1340}`, y: `+=${to.y - 690 - 60}`, scale: 0.3, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'power2.in' }))
      busya.emote('happy')
      els.forEach(e => e.remove())
    }

    const round = async (o) => {
      const cuc = k.food('cucumber', 800, 640, 660, { z: 6 })
      k.fromTo(cuc, { y: -420, rotation: -12, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
      k.sfx('boing', { vol: 0.5 })
      await k.wait(700)
      if (o.first) {
        await k.tell(pyx, 'cuc', 'point')
        // кошачья лапка
        const paw = k.food('paw', 470, 760, 130, { z: 12 })
        k.popIn(paw)
        await k.tell(pyx, 'paw', 'point')
        await k.tapOnEl(paw)
        k.to(paw, { x: 0, y: -100, scale: 0.85, duration: 0.35, ease: 'back.out(2)' })
        k.sfx('plop')
        await k.tell(pyx, 'held', 'nod')
        o.paw = paw
      }
      const sl = []
      const res = await k.cutLinear({
        food: 'cucumber', el: cuc, at: { x: 800, y: 640 }, width: 660, mode: 'slices', slice: 'cucumberSlice', sliceW: o.sliceW,
        cuts: o.cuts, tol: 0.08, plate: { x: 1310, y: 668 }, plateStep: { x: 14, y: -9 }, plateWrap: 7,
        prompt: o.prompt ? k.key(o.prompt) : null, host: pyx,
        onCut: async (i, info) => { sl.push(info.slice.el); await k.sayNumber(i + 1); if (o.first && i === 0) await k.tell(pyx, 'chik', 'happy') },
        onMiss: n => { if (n % 3 === 1) k.tell(pyx, 'miss') },
      })
      // хвостик — Пыху
      if (res.tail) {
        await k.tell(pyx, 'tail', 'laugh')
        const t = k.centerOf(pyx.el)
        await k.play(k.gsap.to(res.tail, { x: t.x - 800 + 40, y: t.y - 640 - 120, scale: 0.2, opacity: 0, duration: 0.6, ease: 'power2.in' }))
        k.sfx('crunch')
        res.clear()
      }
      await k.tell(busya, 'busya_eat')
      await eat(sl)
      await k.praise(pyx)
      return res
    }

    await round({ first: true, cuts: [0.22, 0.44, 0.66], sliceW: 104, prompt: 'q_cut1' })
    await k.tell(pyx, 'round2', 'point')
    await round({ cuts: [0.14, 0.28, 0.42, 0.56, 0.7], sliceW: 84 })
    await k.tell(pyx, 'round3', 'point')
    const paw = null
    {
      const cuc = k.food('cucumber', 800, 640, 660, { z: 6 })
      k.fromTo(cuc, { y: -420, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
      await k.wait(700)
      const sl = []
      const res = await k.cutLinear({
        food: 'cucumber', el: cuc, at: { x: 800, y: 640 }, width: 660, mode: 'slices', slice: 'cucumberSlice', sliceW: 90,
        count: 4, plate: { x: 1310, y: 668 }, plateStep: { x: 14, y: -9 }, plateWrap: 7,
        onCut: async (i, info) => { sl.push(info.slice.el); await k.sayNumber(i + 1) },
      })
      res.clear()
      await k.tell(pyx, 'free_ok', 'cheer')
      await eat(sl)
    }
    await k.narrate('why')
    await k.tell(busya, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
