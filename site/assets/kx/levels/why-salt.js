// «Зачем нужна соль?» — пресный суп, щепотки соли, шкала вкуса, пересол и как его исправить.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'

export default defineLevel({
  id: 'why-salt',
  async run(k) {
    k.kitchenBg()
    const st = k.stove()
    const pot = k.onBurner(k.prop(kitchen.pot({ lid: false, soup: true }), 0, 0, 300, 230, { z: 6 }), 0, 300, 230)
    pot.querySelector('.kp-shadow')?.style.setProperty('visibility', 'hidden')
    const pyx = k.pyx({ x: 250 })
    const hamster = k.guest('shchyok', 1400, k.layout.floorY, { size: 280, face: 'left' })
    const potTop = { x: 720, y: 400 }

    // ложка и шкала вкуса
    const spoon = k.prop(kitchen.spoonWood(), 900, 610, 60, 200, { z: 8 })
    spoon.style.transform = 'rotate(35deg)'
    const meter = k.meter({ x: 800, y: 175, w: 560, zones: [
      { from: 0, to: 0.3, color: '#BFD9F2', face: '😐' },
      { from: 0.3, to: 0.68, color: '#8AC926', face: '😋' },
      { from: 0.68, to: 1, color: '#FF8A8A', face: '🥴' },
    ], value: 0.06 })
    let level = 0.06

    await k.wait(400)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(hamster, 'shchyok_hi', 'happy')

    const taste = async (lineId, emote) => {
      const from = k.centerOf(spoon), mouth = { x: 1360, y: 790 }
      await k.play(k.gsap.to(spoon, { x: mouth.x - from.x, y: mouth.y - from.y, rotation: 10, duration: 0.6, ease: 'power2.inOut' }))
      k.sfx('yum', { vol: 0.5 })
      hamster.emote(emote)
      await k.tell(hamster, lineId)
      await k.play(k.gsap.to(spoon, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'power2.inOut' }))
    }

    // 1. пресный суп
    await k.tapOnEl(spoon, { prompt: k.key('q_spoon'), host: pyx })
    await taste('bland', 'think')
    await k.tell(pyx, 'why', 'point')

    // 2. солонка
    const shaker = k.food('saltShaker', 900, 270, 120, { z: 12 })
    k.popIn(shaker)
    const pinch = async () => {
      await k.tapN(shaker, 1)
      k.sfx('sprinkle')
      await k.play(k.gsap.to(shaker, { rotation: -140, x: -120, y: 110, duration: 0.3, ease: 'power2.out' }))
      for (let i = 0; i < 12; i++) {
        const g = k.prop('<div style="width:100%;height:100%;background:#fff;border-radius:2px;box-shadow:0 0 0 2px #C9DFF0"></div>', 700 + k.rand(-30, 30), 330, 9, 9, { z: 13 })
        k.to(g, { y: k.rand(70, 110), x: k.rand(-20, 20), opacity: 0, duration: 0.5, delay: i * 0.03, ease: 'power1.in', onComplete: () => g.remove() })
      }
      await k.wait(450)
      k.to(shaker, { rotation: 0, x: 0, y: 0, duration: 0.3, ease: 'back.out(2)' })
    }
    await k.tell(pyx, 'q_salt', 'point')
    let n = 0
    while (level < 0.3) {
      await pinch(); n++
      level += 0.14
      meter.set(level)
      await k.wait(300)
      if (level < 0.3) await taste('meh', 'think')
    }
    await taste('tasty', 'laugh')
    k.burst(800, 300, 10)
    await k.tell(pyx, 'good', 'cheer')

    // 3. пересол
    await k.tell(pyx, 'q_much', 'point')
    let warned = false
    while (level < 0.68) {
      await pinch()
      level += 0.14
      meter.set(level)
      await k.wait(250)
      if (!warned && level >= 0.5 && level < 0.68) { warned = true; await taste('warn', 'surprised') }
    }
    k.sfx('yuck')
    hamster.emote('sad')
    await k.tell(hamster, 'too_salty')

    // 4. как исправить
    const drops = () => {
      for (let i = 0; i < 10; i++) {
        const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#62C6FF"></div>', 700 + k.rand(-30, 30), 300, 16, 16, { z: 13 })
        k.to(d, { y: k.rand(90, 130), opacity: 0, duration: 0.5, delay: i * 0.05, ease: 'power1.in', onComplete: () => d.remove() })
      }
    }
    await k.choose({
      prompt: k.key('q_fix'), host: pyx, skill: 'science:salt',
      options: [
        { id: 'salt', art: food('saltShaker'), color: '#FF5A5F', outcome: async () => { k.sfx('yuck'); meter.set(Math.min(1, meter.value + 0.1)); await k.tell(pyx, 'fix_salt', 'shake') } },
        { id: 'water', art: kitchen.glass(0.8), color: '#62C6FF', correct: true, outcome: async () => { drops(); k.sfx('pour', { vol: 1 }); await k.wait(500); meter.set(0.5); k.burst(720, 380, 8); await k.tell(pyx, 'fix_water', 'cheer') } },
        { id: 'sugar', art: food('sugarJar'), color: '#FF8FC8', outcome: async () => { k.sfx('yuck'); await k.tell(pyx, 'fix_sugar', 'laugh') } },
      ],
    })
    await taste('yum_again', 'laugh')
    await k.tell(pyx, 'sum', 'point')
    await k.tell(hamster, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
