import { defineLevel } from '../lib.js'
export default defineLevel({
  id: 'where-from',
  async run(k) {
    k.kitchenBg()
    const c = k.guest('chukh', 300, 900, { size: 300 })
    const c2 = k.guest('chukh', 700, 900, { size: 300, face: 'left' })
    k.guest('cow', 1000, 900, { size: 300 })
    k.guest('hen', 1300, 900, { size: 300 })
    await k.wait(60000)
  },
})
