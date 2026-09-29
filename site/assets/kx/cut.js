// Движки нарезки: линейный (огурец, морковь, хлеб) и круглый (пицца, торт, яблоко сверху).
// Малыш проводит «ножом» (пальцем) через продукт; попадание в пунктир засчитывается как срез.
import { gsap, audio, fx, getStage } from './deps.js'
import { sfx2 } from './sfx.js'
import { food, SIZE } from './food.js'
import { track, rectOf, idleHint, wiggleHand, centerOf } from './gesture.js'

const KNIFE_W = 64
const knifeSize = () => [KNIFE_W, Math.round((KNIFE_W * 300) / 130)]

/** Ножик, который едет за пальцем. */
function makeKnife(k) {
  const [w, h] = knifeSize()
  const el = document.createElement('div')
  el.className = 'kx-knife'
  el.style.cssText = `position:absolute;left:0;top:0;width:${w}px;height:${h}px;z-index:75;pointer-events:none;opacity:0`
  el.innerHTML = food('knife')
  k.world.appendChild(el)
  const put = p => gsap.set(el, { x: p.x - w / 2, y: p.y - h * 0.92, rotation: 0, transformOrigin: '50% 92%' })
  return {
    el,
    show(p) { put(p); gsap.to(el, { opacity: 1, duration: 0.12 }) },
    move(p) { put(p) },
    hide() { gsap.to(el, { opacity: 0, duration: 0.15 }) },
    chop() { gsap.fromTo(el, { rotation: -8 }, { rotation: 0, duration: 0.2, ease: 'back.out(3)', transformOrigin: '50% 92%' }) },
    remove() { el.remove() },
  }
}

const dashed = (x, y0, y1, on = false) => {
  const d = document.createElement('div')
  d.className = 'kx-guide'
  d.style.cssText = `position:absolute;left:${x - 4}px;top:${y0}px;width:8px;height:${y1 - y0}px;z-index:7;pointer-events:none;background:repeating-linear-gradient(to bottom,#3B2F4F 0 14px,transparent 14px 26px);border-radius:4px;opacity:${on ? 0.85 : 0.55}`
  return d
}

/** Кусочки-«обрезки» — искры сока. */
function juice(k, x, y, color) {
  for (let i = 0; i < 7; i++) {
    const d = document.createElement('div')
    const r = k.rand(5, 11)
    d.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${r}px;height:${r}px;border-radius:50%;background:${color};z-index:8;pointer-events:none`
    k.world.appendChild(d)
    gsap.to(d, { x: k.rand(-50, 50), y: k.rand(-70, -10), opacity: 0, duration: k.rand(0.35, 0.6), ease: 'power2.out', onComplete: () => d.remove() })
  }
}


let cloneN = 0
/** Клон элемента с уникальными id внутри SVG (иначе clipPath ссылается на чужие определения). */
export function cloneArt(el) {
  const c = el.cloneNode(true)
  c.style.opacity = '' // исходник скрыт opacity:0 — клон должен быть виден
  c.style.pointerEvents = ''
  const n = ++cloneN
  const html = c.innerHTML
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1])
  if (ids.length) {
    let out = html
    for (const id of ids) out = out.split(`id="${id}"`).join(`id="${id}_c${n}"`).split(`#${id})`).join(`#${id}_c${n})`).split(`"#${id}"`).join(`"#${id}_c${n}"`)
    c.innerHTML = out
  }
  return c
}

const insetClip = (a, b) => `inset(0 ${(1 - b) * 100}% 0 ${a * 100}%)`

/**
 * Линейная нарезка: еда лежит горизонтально, режем вертикальными взмахами вниз/вверх.
 *
 * o.food        имя из food.js (или o.el — готовый элемент)
 * o.at, o.width центр и ширина на сцене
 * o.mode        'slices' (каждый срез отлетает кружочком) | 'split' (куски остаются, раздвигаются)
 * o.cuts        [дроби 0..1] — где резать (пунктир). Без него — свободная резка o.count раз
 * o.count       число срезов для свободной резки
 * o.guides      показывать пунктир (по умолчанию: есть o.cuts)
 * o.tol         допуск по дроби (0.07)
 * o.slice       имя картинки кружочка (food.js); o.sliceW — размер
 * o.plate       {x,y} куда летят кружочки; o.plateStep — смещение стопки/ряда
 * o.onCut(i, info) → Promise?   info = {frac, x, pieces:[...fractions]}
 * o.onMiss(n)                   мимо пунктира
 * o.evaluate(frac, cutsSoFar) → true | {ok:false, reason}  — проверка «поровну» (mode split)
 * o.prompt/o.host               реплика-задание
 * → Promise<{cuts:[...], pieces:[{a,b}], misses}>
 */
export function cutLinear(k, o) {
  return new Promise(resolve => {
    const name = o.food
    const [fw, fh] = SIZE[name]
    const W = o.width, H = Math.round((W * fh) / fw)
    const at = o.at
    const el = o.el ?? k.food(name, at.x, at.y, W, { z: 6 })
    const rect = { x: at.x - W / 2, y: at.y - H / 2, w: W, h: H }
    const guided = !!o.cuts
    const guides = o.cuts ? [...o.cuts] : []
    const tol = o.tol ?? 0.07
    const mode = o.mode ?? 'slices'
    const need = guided ? guides.length : o.count ?? 3
    const knife = makeKnife(k)
    const guideEls = []
    if ((o.guides ?? guided) && guided) {
      for (const g of guides) {
        const d = dashed(rect.x + g * W, rect.y - 26, rect.y + H + 26)
        k.world.appendChild(d)
        guideEls.push(d)
        gsap.from(d, { opacity: 0, duration: 0.4 })
      }
    }
    // сегменты: клоны, обрезанные clip-path
    const mk = (a, b) => {
      const c = cloneArt(el)
      c.style.clipPath = insetClip(a, b)
      c.style.zIndex = '6'
      k.world.appendChild(c)
      return { a, b, el: c }
    }
    const segs = [mk(0, 1)] // slices: единственный «остаток»; split: все куски
    el.style.opacity = '0'
    el.style.pointerEvents = 'none'
    const cuts = []
    let made = 0, misses = 0, busy = false, plateN = 0, cursor = 0
    if (o.prompt) { k.setRepeat(() => void k.say(o.prompt, o.host ?? null)); k.say(o.prompt, o.host ?? null) }
    const hint = idleHint(k, () => {
      if (guided && made >= guides.length) return () => {}
      const g = guided ? guides[made] : 0.5
      const x = rect.x + g * W
      return wiggleHand({ x, y: rect.y - 40 }, { x, y: rect.y + H + 30 })()
    })
    const layoutGaps = () => {
      const n = segs.length
      segs.forEach((s, i) => gsap.to(s.el, { x: (i - (n - 1) / 2) * (o.gap ?? 16), duration: 0.3, ease: 'back.out(2)' }))
    }
    /** отрезанный ломтик [a,b] улетает кружочком на тарелку */
    const flySlice = (a, b) => {
      const slab = mk(a, b)
      const sw = o.sliceW ?? 96
      const cx = rect.x + ((a + b) / 2) * W, cy = at.y
      const s = document.createElement('div')
      s.className = 'kx-slice'
      s.style.cssText = `position:absolute;left:${cx - sw / 2}px;top:${cy - sw / 2}px;width:${sw}px;height:${sw}px;z-index:9;pointer-events:none`
      s.innerHTML = food(o.slice ?? 'cucumberSlice')
      k.world.appendChild(s)
      gsap.to(slab.el, { y: -50, opacity: 0, duration: 0.25, onComplete: () => slab.el.remove() })
      gsap.fromTo(s, { scale: 0.4 }, { scale: 1, duration: 0.25, ease: 'back.out(2.5)' })
      const to = o.plate ?? { x: rect.x + W + 120, y: rect.y + H + 120 }
      const step = o.plateStep ?? { x: 26, y: -6 }
      const wrap = o.plateWrap ?? 99
      const tx = to.x + step.x * (plateN % wrap), ty = to.y + step.y * (plateN % wrap) - Math.floor(plateN / wrap) * (o.plateRow ?? 0)
      plateN++
      const tl = gsap.timeline()
      tl.to(s, { x: tx - cx, y: ty - cy - 90, rotation: k.rand(-40, 40), duration: 0.35, ease: 'power2.out' }, 0.2)
        .to(s, { y: ty - cy, rotation: k.rand(-12, 12), duration: 0.25, ease: 'bounce.out' })
      return { el: s, done: tl }
    }
    const perform = async frac => {
      busy = true
      const info = { frac, x: rect.x + frac * W, index: made }
      sfx2.chop(1)
      knife.chop()
      juice(k, info.x, at.y, o.juice ?? '#E6F7C6')
      made++
      cuts.push(frac)
      cuts.sort((a, b) => a - b)
      if (mode === 'slices') {
        const prev = cursor
        cursor = frac
        segs[0].a = frac
        segs[0].el.style.clipPath = insetClip(frac, 1)
        info.slice = flySlice(prev, frac)
      } else {
        const j = segs.findIndex(s => frac > s.a && frac < s.b)
        const s0 = segs[j]
        const left = mk(s0.a, frac), right = mk(frac, s0.b)
        s0.el.remove()
        segs.splice(j, 1, left, right)
        layoutGaps()
      }
      info.pieces = segs.map(s => [s.a, s.b])
      await o.onCut?.(made - 1, info)
      busy = false
      if (made >= need) finish()
    }
    const finish = () => {
      tr.destroy(); hint.stop(); knife.hide(); k.setRepeat(null)
      guideEls.forEach(g => gsap.to(g, { opacity: 0, duration: 0.3, onComplete: () => g.remove() }))
      end()
      resolve({
        cuts: [...cuts], pieces: segs.map(s => ({ a: s.a, b: s.b, el: s.el })), misses,
        tail: mode === 'slices' ? segs[0].el : null, // «хвостик» огурца после последнего среза
        clear: () => segs.forEach(s => s.el.remove()),
      })
    }
    // ── жест ──
    const area = { x: rect.x - 60, y: rect.y - 170, w: W + 120, h: H + 340 }
    const top = rect.y + H * 0.1, bottom = rect.y + H * 0.9
    let armed = null, crossX = 0
    const tryCut = x => {
      const frac = (x - rect.x) / W
      if (frac <= 0.02 || frac >= 0.98) return
      if (guided) {
        const next = guides[made]
        if (Math.abs(frac - next) <= tol) { perform(next); return }
        misses++
        audio.sfx('boing', { vol: 0.4 })
        const gi = guideEls[made]
        if (gi) gsap.fromTo(gi, { opacity: 1, scaleX: 3 }, { opacity: 0.85, scaleX: 1, duration: 0.5 })
        o.onMiss?.(misses)
      } else {
        if (cuts.some(c => Math.abs(c - frac) < (o.minGap ?? 0.05))) { audio.sfx('boing', { vol: 0.4 }); return }
        if (o.evaluate) {
          const r = o.evaluate(frac, [...cuts])
          if (r !== true && r?.ok === false) { misses++; o.onBad?.(frac, r.reason); return }
        }
        perform(frac)
      }
    }
    const tr = track(k, area, {
      cursor: 'crosshair',
      down: p => { hint.kick(); knife.show(p); armed = p.y < top ? 'down' : p.y > bottom ? 'up' : null },
      move: (p, prev) => {
        if (!tr.down) return
        knife.move(p)
        hint.kick()
        if (busy) return
        if (armed === 'down') {
          if (prev.y < rect.cy && p.y >= rect.cy) crossX = p.x
          if (p.y >= bottom) { armed = null; tryCut(crossX || p.x); crossX = 0 }
        } else if (armed === 'up') {
          if (prev.y > rect.cy && p.y <= rect.cy) crossX = p.x
          if (p.y <= top) { armed = null; tryCut(crossX || p.x); crossX = 0 }
        } else {
          if (p.y < top) armed = 'down'
          else if (p.y > bottom) armed = 'up'
        }
      },
      up: () => { knife.hide(); armed = null },
    })
    const end = k.waiting('cut', () => {
      if (busy) return true
      const frac = guided ? guides[made] : (made + 1) / (need + 1)
      perform(frac)
      return true
    })
  })
}

/**
 * Круглая нарезка (пицца, торт): режем «через центр» любой линией; сектора разъезжаются.
 *
 * o.el / o.html   готовый круглый элемент или SVG-строка; o.at центр; o.size диаметр (px)
 * o.angles        [градусы] желаемые линии (0=горизонталь, 90=вертикаль, 45, 135…). Без — свободно o.lines раз
 * o.lines         сколько линий (для свободной резки)
 * o.tolDeg        допуск по углу (22)
 * o.onCut(i, info)
 * → Promise<{angles, sectors:[{a0,a1,el}]}>
 */
export function cutRound(k, o) {
  return new Promise(resolve => {
    const R = o.size / 2
    const at = o.at
    const el = o.el ?? k.prop(o.html, at.x, at.y, o.size, o.size, { z: 6 })
    const angles = o.angles ? [...o.angles] : []
    const guided = angles.length > 0
    const need = guided ? angles.length : o.lines ?? 2
    const tolDeg = o.tolDeg ?? 22
    const knife = makeKnife(k)
    const madeAngles = []
    let made = 0, misses = 0, busy = false
    const guideEls = []
    const lineGuide = deg => {
      const d = document.createElement('div')
      d.style.cssText = `position:absolute;left:${at.x - R - 24}px;top:${at.y - 4}px;width:${o.size + 48}px;height:8px;z-index:8;pointer-events:none;background:repeating-linear-gradient(to right,#3B2F4F 0 14px,transparent 14px 26px);border-radius:4px;opacity:.6;transform:rotate(${deg}deg)`
      k.world.appendChild(d)
      return d
    }
    if (guided && (o.guides ?? true)) angles.forEach(a => { const d = lineGuide(a); guideEls.push(d); gsap.from(d, { opacity: 0, duration: 0.4 }) })
    if (o.prompt) { k.setRepeat(() => void k.say(o.prompt, o.host ?? null)); k.say(o.prompt, o.host ?? null) }
    const hint = idleHint(k, () => {
      if (guided && made >= angles.length) return () => {}
      const a = ((guided ? angles[made] : 90) * Math.PI) / 180
      const dx = Math.cos(a), dy = Math.sin(a)
      return wiggleHand({ x: at.x - dx * R * 1.15, y: at.y - dy * R * 1.15 }, { x: at.x + dx * R * 1.15, y: at.y + dy * R * 1.15 })()
    })
    // сектора
    let sectors = []
    const norm = d => ((d % 360) + 360) % 360
    const rebuild = () => {
      sectors.forEach(s => s.el.remove())
      const b = madeAngles.flatMap(a => [norm(a), norm(a + 180)]).sort((x, y) => x - y)
      sectors = []
      if (!b.length) return
      for (let i = 0; i < b.length; i++) {
        const a0 = b[i], a1 = i === b.length - 1 ? b[0] + 360 : b[i + 1]
        const c = cloneArt(el)
        const pts = [[50, 50]]
        const steps = Math.max(2, Math.ceil((a1 - a0) / 10))
        for (let s = 0; s <= steps; s++) {
          const a = ((a0 + ((a1 - a0) * s) / steps) * Math.PI) / 180
          pts.push([50 + Math.cos(a) * 90, 50 + Math.sin(a) * 90])
        }
        c.style.clipPath = `polygon(${pts.map(p => `${p[0]}% ${p[1]}%`).join(',')})`
        c.style.zIndex = '6'
        k.world.appendChild(c)
        const mid = (((a0 + a1) / 2) * Math.PI) / 180
        gsap.fromTo(c, { x: 0, y: 0 }, { x: Math.cos(mid) * (o.gap ?? 14), y: Math.sin(mid) * (o.gap ?? 14), duration: 0.3, ease: 'back.out(2)' })
        sectors.push({ a0, a1, el: c })
      }
    }
    
    const perform = async deg => {
      busy = true
      sfx2.chop(1)
      knife.chop()
      juice(k, at.x, at.y, o.juice ?? '#FFE9A8')
      made++
      madeAngles.push(deg)
      el.style.opacity = '0'
      rebuild()
      const info = { angle: deg, index: made - 1, sectors: sectors.length }
      await o.onCut?.(made - 1, info)
      busy = false
      if (made >= need) finish()
    }
    const finish = () => {
      tr.destroy(); hint.stop(); knife.hide(); k.setRepeat(null)
      guideEls.forEach(g => gsap.to(g, { opacity: 0, duration: 0.3, onComplete: () => g.remove() }))
      end()
      resolve({ angles: [...madeAngles], sectors, el })
    }
    // жест: считаем, что линия проходит через диск
    const area = { x: at.x - R - 190, y: at.y - R - 190, w: o.size + 380, h: o.size + 380 }
    let entry = null, inDisc = false
    const tryLine = (p0, p1) => {
      const dx = p1.x - p0.x, dy = p1.y - p0.y
      const len = Math.hypot(dx, dy)
      if (len < R * 0.9) return
      // расстояние от центра до прямой
      const dline = Math.abs(dy * (at.x - p0.x) - dx * (at.y - p0.y)) / len
      if (dline > R * 0.4) { misses++; audio.sfx('boing', { vol: 0.4 }); o.onMiss?.(misses); return }
      let deg = norm((Math.atan2(dy, dx) * 180) / Math.PI)
      if (deg >= 180) deg -= 180
      if (guided) {
        // ближайший ещё не сделанный угол
        let best = -1, bd = 999
        angles.forEach((a, i) => {
          if (madeAngles.some(m => Math.abs(norm(m) - norm(a)) < 1)) return
          const d = Math.min(Math.abs(norm(a) % 180 - deg), 180 - Math.abs(norm(a) % 180 - deg))
          if (d < bd) { bd = d; best = i }
        })
        if (best >= 0 && bd <= tolDeg) perform(angles[best])
        else { misses++; audio.sfx('boing', { vol: 0.4 }); o.onMiss?.(misses) }
      } else {
        const snapped = o.snap ? Math.round(deg / o.snap) * o.snap : deg
        if (madeAngles.some(m => Math.min(Math.abs(norm(m) % 180 - norm(snapped) % 180), 180 - Math.abs(norm(m) % 180 - norm(snapped) % 180)) < 12)) { audio.sfx('boing', { vol: 0.4 }); return }
        perform(snapped)
      }
    }
    const tr = track(k, area, {
      cursor: 'crosshair',
      down: p => { hint.kick(); knife.show(p); entry = null; inDisc = Math.hypot(p.x - at.x, p.y - at.y) < R * 1.05 },
      move: p => {
        if (!tr.down) return
        knife.move(p); hint.kick()
        if (busy) return
        const d = Math.hypot(p.x - at.x, p.y - at.y)
        if (!inDisc && d < R * 1.05) { inDisc = true; entry = p }
        else if (inDisc && d >= R * 1.05) {
          inDisc = false
          if (entry) tryLine(entry, p)
          entry = null
        }
      },
      up: () => { knife.hide(); entry = null; inDisc = false },
    })
    const end = k.waiting('cutRound', () => {
      if (busy) return true
      const deg = guided ? angles.find(a => !madeAngles.includes(a)) ?? 90 : (made * 45 + 90) % 180
      perform(deg)
      return true
    })
  })
}
