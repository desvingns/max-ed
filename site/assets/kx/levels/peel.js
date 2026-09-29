// «Чистим овощи»: картошку и морковку чистят (овощечистка, взрослый рядом), банан и апельсин — руками, яблоко — только помыть.
import { defineLevel, food } from '../lib.js'

const FLOOR = 960
const recolor = (s, map) => Object.entries(map).reduce((acc, [a, b]) => acc.split(a).join(b), s)
const noShadow = s => s.replace(/<ellipse class="kx-shadow"[^>]*>/, '')

const peeledPotato = () => recolor(food('potato'), { '#D9A868': '#FFF0B8', '#B98444': '#EBD58A', '#A26B3B': '#E2C466' })
const peeledBanana = () => recolor(food('banana'), { '#FFE066': '#FFF7CE', '#F0B824': '#EFDC9C', '#E8B824': '#E6D08A' })
const nakedApple = () => recolor(food('apple'), { '#FF5A5F': '#FFF1C1', '#E0474C': '#EBD08A' })

export default defineLevel({
  id: 'peel',
  async run(k) {
    const gsap = k.gsap
    k.kitchenBg()
    const board = k.food('board', 800, 690, 800, { z: 3 })
    const pyx = k.pyx({ x: 210 })
    const pig = k.guest('pig', 1450, FLOOR, { size: 280, face: 'left' })
    k.fromTo(board, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    const MOUTH = { x: 1440, y: 850 }

    // ── помощники ──
    const drop = (el, y0 = -420) => {
      k.fromTo(el, { y: y0, rotation: -10, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
      k.sfx('boing', { vol: 0.5 })
    }
    const fadeOut = els => { gsap.to(els, { opacity: 0, scale: 0.6, duration: 0.35, onComplete: () => els.forEach(e => e.remove()) }) }
    const flyTo = async (el, to, o = {}) => {
      const c = k.centerOf(el)
      await k.play(gsap.to(el, { x: `+=${to.x - c.x}`, y: `+=${to.y - c.y}`, scale: o.scale ?? 0.3, rotation: `+=${o.rot ?? k.rand(-50, 50)}`, duration: o.dur ?? 0.7, ease: 'power2.in', delay: o.delay ?? 0 }))
    }
    // слоистый «чистящийся» предмет: снизу очищенный, сверху n полосок кожуры
    const peelable = (cx, cy, w, h, under, over, n, overStyle = '') => {
      const root = k.prop('', cx, cy, w, h, { z: 6 })
      const u = document.createElement('div')
      u.style.cssText = 'position:absolute;inset:0'
      u.innerHTML = under
      root.appendChild(u)
      const bands = []
      for (let i = 0; i < n; i++) {
        const d = document.createElement('div')
        d.style.cssText = `position:absolute;inset:0;clip-path:inset(${(i / n) * 100}% -60px ${(1 - (i + 1) / n) * 100}% -60px);${overStyle}`
        d.innerHTML = noShadow(over())
        root.appendChild(d)
        bands.push(d)
      }
      return { root, bands }
    }
    // овощечистка едет за пальцем (головка — под пальцем)
    const PEELER_REST = { x: 1120, y: 560 }
    const peeler = k.food('peeler', PEELER_REST.x, PEELER_REST.y, 100, { z: 22 })
    peeler.style.pointerEvents = 'none'
    gsap.set(peeler, { opacity: 0 })
    const peelerAt = p => gsap.set(peeler, { x: p.x - PEELER_REST.x, y: p.y + 58 - PEELER_REST.y, rotation: -12, transformOrigin: '50% 23%' })
    const peelRound = async (o) => {
      const { root, bands } = o.item
      let removed = 0, said = false
      await k.scrub(root, {
        need: o.need, pad: 70, pulse: false,
        prompt: o.prompt ? k.key(o.prompt) : null, host: pyx,
        onStart: pt => { peelerAt(pt) },
        onProgress: (p, pos) => {
          if (pos) peelerAt(pos)
          const n = Math.min(bands.length, Math.floor(p * bands.length + 0.0001))
          while (removed < n) {
            const b = bands[removed++]
            k.sfx('swing', { vol: 0.5 })
            flyTo(b, MOUTH, { scale: 0.25, dur: 0.9 }).then(() => b.remove())
          }
          if (!said && p > 0.35 && o.said) { said = true; k.tell(pyx, o.said, 'point') }
        },
      })
      k.sparkle(800, 580, 6)
    }

    // ═══ вступление и «взрослый рядом» ═══
    await k.wait(500)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(pig, 'pig_hi', 'happy')
    await k.tell(pyx, 'sharp', 'point')
    await k.tell(pyx, 'mama', 'wave')
    const mama = k.bubble('👩‍🍳👍', 540, 430, { w: 230, h: 190, font: 70 })
    k.sfx('magic')
    await k.wait(900)
    await k.tell(pyx, 'mama_ok', 'nod')

    // ═══ картошка ═══
    const potato = peelable(800, 610, 440, 335, peeledPotato(), () => food('potato'), 5)
    drop(potato.root)
    await k.wait(700)
    await k.tell(pyx, 'potato', 'point')
    gsap.to(peeler, { opacity: 1, duration: 0.3 })
    k.sfx('whoosh')
    await peelRound({ item: potato, need: 760, prompt: 'q_peel', said: 'ribbons' })
    await k.tell(pyx, 'potato_done', 'cheer')
    pig.emote('happy'); k.sfx('crunch')
    await k.tell(pig, 'pig_eat')
    fadeOut([potato.root])
    await k.wait(300)

    // ═══ морковка ═══
    const carrot = peelable(800, 620, 560, 160, food('carrot'), () => food('carrot'), 3, 'filter:saturate(.75) brightness(.86) sepia(.18)')
    drop(carrot.root)
    await k.wait(700)
    await k.tell(pyx, 'carrot', 'point')
    await peelRound({ item: carrot, need: 560 })
    pig.emote('happy'); k.sfx('crunch')
    await k.tell(pyx, 'carrot_done', 'cheer')
    fadeOut([carrot.root, peeler, mama])
    await k.wait(400)

    // ═══ банан: тап-тап-тап ═══
    await k.tell(pyx, 'hands', 'point')
    const banana = k.prop('', 800, 610, 320, 194, { z: 6 })
    const bUnder = document.createElement('div')
    bUnder.style.cssText = 'position:absolute;inset:0'
    bUnder.innerHTML = peeledBanana()
    banana.appendChild(bUnder)
    const bPeel = document.createElement('div')
    bPeel.style.cssText = 'position:absolute;inset:0'
    bPeel.innerHTML = noShadow(food('banana'))
    banana.appendChild(bPeel)
    drop(banana)
    await k.wait(700)
    await k.tapN(banana, 3, {
      prompt: k.key('q_banana'), host: pyx,
      onTap: i => {
        const strip = document.createElement('div')
        strip.style.cssText = `position:absolute;inset:0;clip-path:inset(0 ${(1 - i / 3) * 100}% 0 ${((i - 1) / 3) * 100}%)`
        strip.innerHTML = noShadow(food('banana'))
        banana.appendChild(strip)
        bPeel.style.clipPath = `inset(0 0 0 ${(i / 3) * 100}%)`
        k.sfx('flip', { vol: 0.5 })
        gsap.to(strip, { y: 260, x: k.rand(-80, 80), rotation: k.rand(-60, 60), opacity: 0, duration: 0.9, ease: 'power1.in', onComplete: () => strip.remove() })
        k.sayNumber(i)
      },
    })
    await k.wait(300)
    k.burst(800, 560, 6)
    await k.tell(pyx, 'banana_done', 'happy')
    fadeOut([banana])
    await k.wait(300)

    // ═══ апельсин: кожурка и дольки ═══
    const orange = k.food('orange', 800, 600, 250, { z: 6 })
    drop(orange)
    await k.wait(700)
    await k.tapOnEl(orange, { prompt: k.key('q_orange'), host: pyx })
    const halves = [['inset(0 50% 0 0)', -1], ['inset(0 0 0 50%)', 1]].map(([clip, dir]) => {
      const h = k.food('orange', 800, 600, 250, { z: 7 })
      h.style.clipPath = clip
      gsap.to(h, { x: dir * 190, y: 150, rotation: dir * 50, opacity: 0, duration: 0.7, ease: 'power2.in', onComplete: () => h.remove() })
      return h
    })
    orange.remove()
    k.sfx('pop')
    const segs = []
    for (let i = 0; i < 6; i++) {
      const s = k.food('orangeSegment', 800, 600, 118, { z: 7 })
      gsap.fromTo(s, { scale: 0, opacity: 0, x: 0, y: 0 }, { scale: 1, opacity: 1, x: -320 + i * 128 + 64, y: 20, duration: 0.5, delay: 0.25 + i * 0.07, ease: 'back.out(2)' })
      segs.push(s)
    }
    await k.wait(1000)
    let cnt = 0
    const eats = []
    await k.tapAll(segs, {
      prompt: k.key('segments'), host: pyx,
      onTap: el => { cnt++; k.sayNumber(cnt); eats.push((async () => { await flyTo(el, { x: 230, y: 500 }, { scale: 0.25, dur: 0.6 }); el.remove(); k.sfx('yum', { vol: 0.5 }); pyx.emote('happy') })()) },
    })
    await Promise.all(eats)
    await k.tell(pyx, 'orange_done', 'cheer')

    // ═══ яблоко: чистить или мыть? ═══
    const apple = k.prop(food('apple'), 800, 560, 240, 254, { z: 6 })
    drop(apple)
    await k.wait(700)
    const bubbles = () => {
      for (let i = 0; i < 12; i++) {
        const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:rgba(255,255,255,.9);box-shadow:inset 0 0 0 4px #9CC3DD"></div>', 800 + k.rand(-90, 90), 560 + k.rand(-60, 90), k.rand(22, 44), k.rand(22, 44), { z: 12 })
        k.to(d, { y: k.rand(-160, -60), x: k.rand(-30, 30), opacity: 0, duration: k.rand(0.8, 1.3), delay: i * 0.05, ease: 'power1.out', onComplete: () => d.remove() })
      }
    }
    await k.choose({
      prompt: k.key('apple'), host: pyx,
      options: [
        {
          id: 'peel', art: `<div style="width:130px;height:190px;display:grid;place-items:center">${food('peeler')}</div>`, color: '#FF5A5F',
          outcome: async () => {
            k.sfx('swing')
            apple.innerHTML = nakedApple()
            k.sfx('yuck', { vol: 0.5 })
            gsap.fromTo(apple, { x: -8 }, { x: 8, duration: 0.07, repeat: 9, yoyo: true, ease: 'none', onComplete: () => gsap.set(apple, { x: 0 }) })
            await k.tell(pyx, 'apple_peeled', 'shake')
            apple.innerHTML = food('apple')
            k.sfx('magic'); k.sparkle(800, 560, 6)
          },
        },
        {
          id: 'wash', art: food('soap'), color: '#62C6FF', correct: true,
          outcome: async () => {
            k.sfx('pour'); bubbles()
            gsap.fromTo(apple, { rotation: -6 }, { rotation: 6, duration: 0.15, repeat: 5, yoyo: true, onComplete: () => gsap.set(apple, { rotation: 0 }) })
            await k.wait(900)
            k.burst(800, 520, 8)
            await k.tell(pyx, 'apple_wash', 'cheer')
          },
        },
      ],
    })
    await k.tell(pyx, 'cuc', 'point')
    await k.narrate('sum')
    await k.tell(pig, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
