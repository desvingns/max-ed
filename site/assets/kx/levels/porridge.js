import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
export default defineLevel({
  id: 'porridge',
  async run(k) {
    k.kitchenBg()
    const ids = ['pig','hen','cow','kapa','busya','tarabar','chukh','shchyok','hapchik','sheep','tyuk']
    ids.forEach((id, i) => k.guest(id, 140 + i * 135, 700 + (i % 2) * 250, { size: 260 }))
    k.pyx({ x: 800 })
    await k.wait(60000)
  },
})
