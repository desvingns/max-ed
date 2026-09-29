// Общий помощник для уровней «Нарезалки» (не уровень, в registry.js не описан).
// cutLinear в режиме 'split' прячет исходник (opacity:0) и клонирует его для кусков — клоны наследуют opacity:0 и
// остаются невидимыми. Поэтому рисуем куски сами: после каждого среза перерисовываем набор кусков
// (со «светлым срезом» на торцах), а движковые клоны остаются скрытыми.

/**
 * const sv = liveSplit(k, { render: (a, b) => element, at: {x,y}, W, gap: 16, layer })
 * cutLinear({ ..., onCut: async (i, info) => { sv.update(info); ... } })
 * sv.pieces → [{a, b, el}]  (после нарезки — готовые самостоятельные элементы)
 */
export function liveSplit(k, { render, W, gap = 16, layer = null, ghost = false }) {
  let items = []
  const gsap = k.gsap
  const offsetOf = (i, n) => (i - (n - 1) / 2) * gap
  const api = {
    get pieces() { return items },
    /** info.pieces = [[a,b], …] из cutLinear */
    update(info, dur = 0.3) {
      const next = info.pieces.map(([a, b]) => ({ a, b }))
      const old = items
      next.forEach((p, i) => {
        const mid = (p.a + p.b) / 2
        const parent = old.find(o => mid > o.a && mid < o.b)
        const from = parent ? parent.x : 0
        p.el = render(p.a, p.b)
        p.x = offsetOf(i, next.length)
        ;(layer ?? k.world).appendChild(p.el)
        gsap.fromTo(p.el, { x: from }, { x: p.x, duration: dur, ease: 'back.out(2)' })
      })
      old.forEach(o => o.el.remove())
      items = next
      return items
    },
    /** временно спрятать/показать (например, для «отмены» среза) */
    show(v) { items.forEach(p => { p.el.style.visibility = v ? '' : 'hidden' }) },
    clear() { items.forEach(p => p.el.remove()); items = [] },
  }
  return api
}
