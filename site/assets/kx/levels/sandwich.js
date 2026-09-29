// «Бутерброд» — рецепт по порядку: сначала хлеб, потом масло, потом сыр, а в конце — второй ломтик.
// Раунд 1 (Буся, без колбасы): по шагам перетаскиваем продукты, масло намазываем пальцем.
// Раунд 2 (Щёчкин, с колбаской): нажимаем картинки-шаги по порядку, считаем кружочки колбасы.
import { defineLevel, food } from '../lib.js'
import { svg, C, F, HL, SH } from '../art.js'

// Обход бага ui.stepsBar: у .kx-step стоит transition:transform, из-за чего gsap.from запоминает «промежуточную» позицию
// и поздние иконки навсегда съезжают вверх. Через секунду сбрасываем inline-transform (заодно оживает .now{scale}).
const stepsBar = (k, icons, o) => { const b = k.stepsBar(icons, o); k.after(1300, () => k.gsap.set([...b.el.children], { clearProps: 'transform' })); return b }

const thumb = name => `<div style="width:56px;height:56px">${food(name)}</div>`

// внутренняя мякоть ломтика (в координатах food('breadSlice') 160×154) — по ней «размазывается» масло
const CRUMB = 'M40 40C40 30 60 26 80 28C100 26 120 30 120 40C124 60 118 70 118 92L118 134L42 134L42 92C42 70 36 60 40 40Z'
const spreadArt = () => svg(160, 154, F(CRUMB, '#FFE873', 'opacity=".96"') +
  '<path d="M52 48Q80 40 110 50M50 76Q82 68 112 78M52 104Q82 96 110 106" fill="none" stroke="#F2C93A" stroke-width="4" stroke-linecap="round" opacity=".75"/>')

// тарелка сверху
const plateTop = () => svg(320, 320,
  SH(160, 296, 132, 12) + C(160, 150, 148, '#FFFFFF') + C(160, 150, 108, '#E6F0FA', { sw: 0 }) +
  C(160, 150, 108, 'none', { sw: 3, ink: '#C9DFF0' }) + HL(96, 84, 42, 12, -40, 0.8))

// «картинка-заказ» в облачке
const order = (items) => `<div style="display:flex;align-items:center;justify-content:center;gap:10px">${items.map(([name, w, no]) =>
  `<div style="position:relative;width:${w}px;height:${w}px">${food(name)}${no ? '<span class="emoji" style="position:absolute;left:-6px;top:-6px;font-size:' + Math.round(w * 1.15) + 'px;line-height:1">🚫</span>' : ''}</div>`).join('')}</div>`

const SPOTS = [[76, 80], [126, 86], [100, 128]] // куда ложатся три кружочка колбасы
const TRAY = { xs: [520, 760, 1000], y: 852 }
const KIND = { bread: ['breadSlice', 136], butter: ['butter', 152], cheese: ['cheeseSlice', 126] }

/** «Бутерброд» на тарелке: контейнер со слоями. from = {x,y,w} — откуда прилетел продукт (или null — падает сверху). */
function makeStack(k, at) {
  const g = k.gsap
  const W = 200, H = 193
  const el = k.prop('', at.x, at.y, W, H, { z: 6 })
  let block = null, over = null
  const layer = (html, l, t, w, h, z, css = '') => {
    const d = document.createElement('div')
    d.style.cssText = `position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;z-index:${z};${css}`
    d.innerHTML = html
    el.appendChild(d)
    return d
  }
  const land = (d, from, rot = 0) => {
    const c = k.centerOf(d), w = d.offsetWidth
    const a = from
      ? { x: from.x - c.x, y: from.y - c.y, scale: from.w / w, rotation: 0, opacity: 1 }
      : { x: 0, y: -300, scale: 1.1, rotation: rot - 10, opacity: 0 }
    return k.play(g.fromTo(d, a, { x: 0, y: 0, scale: 1, rotation: rot, opacity: 1, duration: from ? 0.34 : 0.6, ease: from ? 'power2.out' : 'bounce.out' }))
      .then(() => k.sfx('plop', { vol: 0.6 }))
  }
  return {
    el,
    async bread(from) { await land(layer(food('breadSlice'), 0, 0, W, H, 1), from, 0) },
    async butter(from) {
      block = layer(food('butter'), 45, 66, 110, 65, 4)
      await land(block, from, -4)
      over = layer(spreadArt(), 0, 0, W, H, 2, 'clip-path:circle(0% at 50% 58%)')
    },
    spread(p) {
      if (!over) return
      over.style.clipPath = `circle(${Math.round(p * 76)}% at 50% 58%)`
      if (block) g.set(block, { scale: 1 - p * 0.8, opacity: 1 - p * 0.55, transformOrigin: '50% 50%' })
    },
    doneSpread() { if (over) over.style.clipPath = 'circle(90% at 50% 58%)'; block?.remove(); block = null },
    async cheese(from) { await land(layer(food('cheeseSlice'), 44, 40, 112, 112, 5), from, 8) },
    async sausage(n, from) { const [cx, cy] = SPOTS[n]; await land(layer(food('sausageSlice'), cx - 27, cy - 27, 54, 54, 6 + n), from, 0) },
    async top(from) {
      await land(layer(food('breadSlice'), 0, 0, W, H, 12, 'filter:drop-shadow(0 6px 0 rgba(0,0,0,.14))'), from, -3)
      k.play(g.fromTo(el, { scaleY: 0.9 }, { scaleY: 1, duration: 0.4, ease: 'elastic.out(1,0.45)' }))
    },
  }
}

export default defineLevel({
  id: 'sandwich',
  async run(k) {
    const g = k.gsap
    const FLOOR = k.layout.floorY
    k.kitchenBg()
    const pyx = k.pyx({ x: 250 })
    const busya = k.guest('busya', 1335, FLOOR, { size: 230, face: 'left' })
    const shchyok = k.guest('shchyok', 1495, FLOOR, { size: 230, face: 'left' })
    const PLATE = { x: 760, y: 585 }
    const plate = k.prop(plateTop(), PLATE.x, PLATE.y, 320, 320, { z: 3 })
    k.fromTo(plate, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    const zone = k.prop('', PLATE.x, PLATE.y, 300, 280, { z: 0 })
    const knife = k.prop(food('knife'), 0, 0, 78, 180, { z: 40 })
    g.set(knife, { opacity: 0, transformOrigin: '50% 96%', rotation: 52 })
    const pinKnife = p => g.to(knife, { x: p.x, y: p.y - 83, duration: 0.07, overwrite: 'auto' })

    const eat = async (stack, guest) => {
      const to = k.centerOf(guest.el), from = k.centerOf(stack.el)
      k.sfx('crunch')
      await k.play(g.to(stack.el, { x: to.x - from.x, y: to.y - from.y - 60, scale: 0.3, opacity: 0, duration: 0.7, ease: 'power2.in' }))
      stack.el.remove()
      guest.emote('happy')
    }

    await k.wait(500)
    await k.tell(pyx, 'hello', 'wave')

    // ───── раунд 1: бутерброд для Буси (с сыром, без колбасы) ─────
    busya.face('left')
    const bb = k.bubble(order([['cheeseSlice', 74], ['sausageSlice', 62, true]]), 1250, 585, { w: 230, h: 175, tail: 'right' })
    await k.tell(busya, 'busya_order', 'happy')
    const s1 = stepsBar(k, [thumb('breadSlice'), thumb('butter'), thumb('cheeseSlice'), '🥪'])
    s1.set(0)
    await k.tell(pyx, 'recipe', 'point')

    const trayBack = k.prop('<div style="width:100%;height:100%;border-radius:46px;background:rgba(255,255,255,.86);box-shadow:inset 0 0 0 8px rgba(59,47,79,.14)"></div>', 760, TRAY.y, 800, 170, { z: 0 })
    k.popIn(trayBack)

    /** Один шаг рецепта: в лотке нужный продукт + два «не по порядку». Тащим на тарелку. */
    const place = async (kind, decoys, prompt, onCorrect) => {
      const kinds = k.shuffle([kind, ...decoys])
      const items = kinds.map((kd, i) => ({ kind: kd, el: k.food(KIND[kd][0], TRAY.xs[i], TRAY.y, KIND[kd][1], { z: 0 }) }))
      k.fromTo(items.map(i => i.el), { y: 140, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(1.6)' })
      await k.wait(700)
      const good = items.find(i => i.kind === kind)
      const ordered = [good, ...items.filter(i => i !== good)]
      let wrong = 0
      await k.dnd({
        items: ordered, zones: [{ id: 'plate', el: zone }],
        prompt: k.key(prompt), host: pyx,
        until: p => p.size >= 1,
        accept: it => it.kind === kind,
        onCorrect: async it => {
          const c = k.centerOf(it.el), w = k.rectOf(it.el).w
          it.el.style.display = 'none'
          await onCorrect({ x: c.x, y: c.y, w: w / 1.1 })
        },
        onWrong: async it => {
          it.el.style.zIndex = '0'
          wrong++
          pyx.emote('shake')
          k.fx.wiggle(it.el)
          await k.tell(pyx, `w_${it.kind}`)
          if (wrong >= 2) { const stop = k.fx.pulse(good.el, '#FFFFFF'); k.after(2600, stop) }
        },
      })
      g.to(items.map(i => i.el), { opacity: 0, y: 60, duration: 0.3 })
      k.after(320, () => items.forEach(i => i.el.remove()))
      await k.wait(250)
    }

    const stack = makeStack(k, PLATE)
    await place('bread', ['cheese', 'butter'], 'q_bread', from => stack.bread(from))
    s1.set(1)
    await place('butter', ['cheese', 'bread'], 'q_butter', from => stack.butter(from))
    // намазываем масло пальцем
    g.to(knife, { opacity: 1, duration: 0.2 })
    g.set(knife, { x: PLATE.x + 40, y: PLATE.y - 60 })
    await k.scrub(stack.el, {
      need: 640, prompt: k.key('q_scrub'), host: pyx,
      onProgress: (p, pos) => { stack.spread(p); if (pos) pinKnife(pos) },
    })
    stack.doneSpread()
    g.to(knife, { opacity: 0, duration: 0.25 })
    k.sparkle(PLATE.x, PLATE.y - 30, 6)
    await k.tell(pyx, 'butter_ok', 'happy')
    s1.set(2)
    await place('cheese', ['bread', 'butter'], 'q_cheese', from => stack.cheese(from))
    s1.set(3)
    await place('bread', ['cheese', 'butter'], 'q_top', from => stack.top(from))
    s1.done(3)
    k.sparkle(PLATE.x, PLATE.y - 40, 8)
    await k.tell(pyx, 'top_ok', 'cheer')
    g.to(trayBack, { opacity: 0, duration: 0.3 })
    await eat(stack, busya)
    g.to(bb, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => bb.remove() })
    await k.tell(busya, 'busya_eat', 'cheer')
    k.burst(1335, 640, 8)
    await k.praise(pyx)
    s1.hide()

    // ───── раунд 2: бутерброд для Щёчкина (с колбаской) — сам по порядку ─────
    const hb = k.bubble(order([['cheeseSlice', 70], ['sausageSlice', 44], ['sausageSlice', 44], ['sausageSlice', 44]]), 1400, 575, { w: 290, h: 175, tail: 'right' })
    await k.tell(shchyok, 'shchyok_order', 'happy')
    const s2 = stepsBar(k, [thumb('breadSlice'), thumb('butter'), thumb('cheeseSlice'), thumb('sausageSlice'), '🥪'])
    s2.set(0)
    const stack2 = makeStack(k, PLATE)
    const topArt = `<div style="position:relative;width:100%;height:100%">${food('breadSlice')}<span class="emoji" style="position:absolute;right:-16px;top:-22px;font-size:54px">⬇️</span></div>`
    let wrongs = 0
    await k.sequence({
      steps: [
        { id: 'bread', art: food('breadSlice'), color: '#E6A462' },
        { id: 'butter', art: food('butter'), color: '#FFD93D' },
        { id: 'cheese', art: food('cheeseSlice'), color: '#FFB938' },
        { id: 'sausage', art: food('sausageSlice'), color: '#FF8FA0' },
        { id: 'top', art: topArt, color: '#E6A462' },
      ],
      cardSize: 152, slotsY: 132, cardsY: 760,
      prompt: k.key('r2'), host: pyx,
      onPlace: async (step, i) => {
        s2.set(i + 1)
        if (step.id === 'bread') await stack2.bread(null)
        else if (step.id === 'butter') {
          await stack2.butter(null)
          g.to(knife, { opacity: 1, x: PLATE.x - 30, y: PLATE.y - 50, duration: 0.2 })
          k.sfx('scrub')
          const o = { p: 0 }
          await k.play(g.to(o, { p: 1, duration: 1.1, ease: 'power1.inOut', onUpdate: () => { stack2.spread(o.p); pinKnife({ x: PLATE.x - 40 + Math.sin(o.p * 18) * 45, y: PLATE.y - 30 + o.p * 30 }) } }))
          stack2.doneSpread()
          g.to(knife, { opacity: 0, duration: 0.2 })
        } else if (step.id === 'cheese') await stack2.cheese(null)
        else if (step.id === 'sausage') {
          await k.tell(pyx, 'sausage', 'point')
          for (let n = 0; n < 3; n++) { await stack2.sausage(n, null); await k.sayNumber(n + 1) }
        } else if (step.id === 'top') await stack2.top(null)
      },
      onWrong: async () => {
        wrongs++
        pyx.emote('shake')
        if (wrongs % 2 === 1) await k.tell(pyx, 'seq_wrong')
        else await k.oops(pyx)
      },
    })
    s2.done(4)
    k.sparkle(PLATE.x, PLATE.y - 40, 8)
    await k.tell(pyx, 'top_ok', 'cheer')
    await eat(stack2, shchyok)
    g.to(hb, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => hb.remove() })
    await k.tell(shchyok, 'shchyok_eat', 'cheer')
    k.burst(1495, 640, 8)
    await k.tell(pyx, 'sum', 'point')
    await k.tell(busya, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
