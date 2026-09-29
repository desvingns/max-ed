// Стенд для проверки жестов: #/dev/kxplay  (тесты: tools/qa/gestures.mjs)
import { defineLevel } from '../lib.js'
import { levels } from '../registry.js'
levels.gtest = { id: 'gtest', chapter: 'kx-abc', sticker: { id: 'kx-gtest', art: '🧪', bg: '#fff' } }

export default defineLevel({
  id: 'gtest',
  async run(k) {
    k.bgTable()
    const log = s => { window.__gt = (window.__gt || []); window.__gt.push(s) }
    // 1. tapAll
    const balls = [0, 1, 2].map(i => k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:#FF5A5F"></div>`, 400 + i * 200, 300, 140, 140, { z: 20 }))
    await k.tapAll(balls, { onTap: (e, i, left) => log(`tap${i}:${left}`) })
    balls.forEach(b => b.remove()); log('tapAll')
    // 2. scrub
    const pad = k.prop(`<div style="width:100%;height:100%;background:#9CC3DD;border-radius:30px"></div>`, 800, 400, 500, 240, { z: 20 })
    let last = 0
    await k.scrub(pad, { need: 800, onProgress: p => { last = p } })
    pad.remove(); log('scrub')
    // 3. stir
    const pot = k.prop(`<div style="width:100%;height:100%;background:#62C6FF;border-radius:50%"></div>`, 800, 450, 300, 300, { z: 20 })
    await k.stir({ x: 800, y: 450 }, { radius: 120, turns: 2, onProgress: p => { last = p } })
    pot.remove(); log('stir')
    // 4. shake
    const jar = k.prop(`<div style="width:100%;height:100%;background:#FFD93D;border-radius:24px"></div>`, 800, 450, 160, 220, { z: 20 })
    await k.shake(jar, { count: 5, amp: 60 })
    jar.remove(); log('shake')
    // 5. hold with goal
    const cup = k.prop(`<div style="width:100%;height:100%;background:#8AC926;border-radius:24px"></div>`, 800, 450, 200, 260, { z: 20 })
    const lv = await k.hold(cup, { duration: 2, goal: [0.45, 0.6], onOver: () => log('over'), onLevel: p => { last = p } })
    cup.remove(); log('hold:' + lv.toFixed(2))
    // 6. sequence
    await k.sequence({ steps: ['a', 'b', 'c'].map(id => ({ id, art: `<div style="font:900 90px var(--font);text-align:center;line-height:1">${id}</div>` })), shuffled: undefined, onWrong: () => log('wrongSeq') })
    log('sequence')
    // 7. dnd
    const items = [0, 1].map(i => ({ id: 'i' + i, el: k.prop(`<div style="width:100%;height:100%;background:#FF8FC8;border-radius:20px"></div>`, 500 + i * 200, 800, 120, 120, { z: 30 }) }))
    const zones = [0, 1].map(i => ({ id: 'z' + i, el: k.prop(`<div style="width:100%;height:100%;border:8px dashed #3B2F4F;border-radius:20px"></div>`, 1000 + i * 250, 450, 200, 200, { z: 10 }) }))
    await k.dnd({ items, zones, accept: (it, z) => it.id.slice(1) === z.id.slice(1), onWrong: () => log('wrongDnd') })
    log('dnd')
  },
})
