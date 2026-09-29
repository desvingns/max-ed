// Жесты для мини-игр. Все примитивы:
//   • работают в координатах сцены 1600×1000 (getStage().toLocal);
//   • сами показывают подсказку-«ручку», если малыш завис;
//   • регистрируют себя в k.waiting(...) — это нужно автотестам (k.solve());
//   • возвращают Promise, который разрешается, когда жест выполнен.
import { gsap, audio, fx, getStage, draggable, hitTest } from './deps.js'
import { sfx2 } from './sfx.js'

export const HINT_MS = 7000

export const rectOf = el => {
  const st = getStage()
  const r = el.getBoundingClientRect()
  const a = st.toLocal(r.left, r.top), b = st.toLocal(r.right, r.bottom)
  return { x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }
}
export const centerOf = el => { const r = rectOf(el); return { x: r.cx, y: r.cy } }
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const inside = (p, r, pad = 0) => p.x >= r.x - pad && p.x <= r.x + r.w + pad && p.y >= r.y - pad && p.y <= r.y + r.h + pad

/** Прозрачный слой, ловящий один указатель. area = {x,y,w,h} или null (вся сцена). */
export function track(k, area, h = {}) {
  const st = getStage()
  const el = document.createElement('div')
  const a = area ?? { x: 0, y: 0, w: 1600, h: 1000 }
  el.className = 'kx-track'
  el.style.cssText = `position:absolute;left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;z-index:${h.z ?? 45};touch-action:none;cursor:${h.cursor ?? 'grab'}`
  k.world.appendChild(el)
  let id = null, prev = null, dead = false
  const P = e => st.toLocal(e.clientX, e.clientY)
  k.on(el, 'pointerdown', e => {
    if (dead || id !== null || e.button > 0) return
    e.preventDefault()
    id = e.pointerId
    el.setPointerCapture?.(id)
    prev = P(e)
    h.down?.(prev, e)
  })
  k.on(el, 'pointermove', e => {
    if (dead || e.pointerId !== id) return
    const p = P(e)
    h.move?.(p, prev, e)
    prev = p
  })
  const up = e => {
    if (dead || e.pointerId !== id) return
    id = null
    h.up?.(P(e), e)
  }
  k.on(el, 'pointerup', up)
  k.on(el, 'pointercancel', up)
  return {
    el,
    get down() { return id !== null },
    destroy() { dead = true; el.remove() },
  }
}

/** Подсказка «ручка», если 7 секунд нет действий. show() → stop(). */
export function idleHint(k, show, ms = HINT_MS) {
  let t = 0, stop = null
  const clear = () => { window.clearTimeout(t); stop?.(); stop = null }
  const kick = () => {
    clear()
    t = window.setTimeout(() => { if (k.alive) stop = show() }, ms)
  }
  k.on(k.root, 'pointerdown', kick, { capture: true })
  kick()
  k.onExit(clear)
  return { kick, stop: () => { window.clearTimeout(t); stop?.(); stop = null } }
}

/** Ручка, которая туда-обратно водит между двумя точками (для скраба/размешивания). */
export const wiggleHand = (p1, p2) => () => {
  const h = fx.hand(p1, p2)
  return () => h.stop()
}

// ───────────────────────── тап ─────────────────────────

/** Ждём n тапов по элементу. onTap(i, ev) вызывается на каждый. */
export function tapN(k, el, n = 1, o = {}) {
  return new Promise(resolve => {
    let i = 0
    const stopPulse = o.pulse === false ? () => {} : fx.pulse(el, o.color)
    if (o.prompt) { k.setRepeat(() => void k.say(o.prompt, o.host ?? null)); k.say(o.prompt, o.host ?? null) }
    const hint = idleHint(k, () => { const h = fx.hand(centerOf(el)); return () => h.stop() })
    el.style.cursor = 'pointer'
    el.style.touchAction = 'manipulation'
    const hit = ev => {
      if (!k.alive) return
      ev?.preventDefault?.()
      i++
      audio.sfx('tap')
      hint.kick()
      o.onTap?.(i, ev)
      if (i >= n) done()
    }
    const done = () => { off(); resolve() }
    const off = () => { el.removeEventListener('pointerdown', hit); stopPulse(); hint.stop(); k.setRepeat(null); end() }
    el.addEventListener('pointerdown', hit)
    const end = k.waiting('tap', () => { hit(); return true })
  })
}

/** Ждём, пока тапнут все элементы. onTap(el, idx) вызывается на каждый. */
export function tapAll(k, els, o = {}) {
  return new Promise(resolve => {
    const left = new Set(els)
    const stops = new Map(els.map(e => [e, o.pulse === false ? () => {} : fx.pulse(e, o.color)]))
    if (o.prompt) { k.setRepeat(() => void k.say(o.prompt, o.host ?? null)); k.say(o.prompt, o.host ?? null) }
    const hint = idleHint(k, () => { const e = [...left][0]; if (!e) return () => {}; const h = fx.hand(centerOf(e)); return () => h.stop() })
    const handlers = new Map()
    const finish = () => { hint.stop(); k.setRepeat(null); end(); resolve() }
    for (const e of els) {
      e.style.cursor = 'pointer'
      e.style.touchAction = 'manipulation'
      const fn = ev => {
        if (!k.alive || !left.has(e)) return
        ev?.preventDefault?.()
        left.delete(e)
        stops.get(e)?.()
        e.removeEventListener('pointerdown', fn)
        hint.kick()
        audio.sfx('pop')
        o.onTap?.(e, els.indexOf(e), left.size)
        if (!left.size) finish()
      }
      handlers.set(e, fn)
      e.addEventListener('pointerdown', fn)
    }
    const end = k.waiting('tapAll', () => { const e = [...left][0]; if (e) handlers.get(e)(); return true })
  })
}

// ───────────────────────── скраб (тереть туда-сюда) ─────────────────────────

/**
 * Водим пальцем по элементу, «оттирая». need — сколько пикселей пути нужно набрать.
 * onProgress(p 0..1) вызывается по ходу. sfx — имя звука из sfx2 (или null).
 */
export function scrub(k, target, o = {}) {
  return new Promise(resolve => {
    const need = o.need ?? 900
    const r0 = o.area ?? rectOf(target)
    const pad = o.pad ?? 24
    const area = { x: r0.x - pad, y: r0.y - pad, w: r0.w + pad * 2, h: r0.h + pad * 2 }
    let p = 0, t0 = 0
    if (o.prompt) { k.setRepeat(() => void k.say(o.prompt, o.host ?? null)); k.say(o.prompt, o.host ?? null) }
    const stopPulse = o.pulse === false ? () => {} : fx.pulse(target, o.color)
    const a = { x: r0.x + r0.w * 0.25, y: r0.y + r0.h * 0.5 }, b = { x: r0.x + r0.w * 0.75, y: r0.y + r0.h * 0.5 }
    const hint = idleHint(k, wiggleHand(a, b))
    const finish = () => { tr.destroy(); stopPulse(); hint.stop(); k.setRepeat(null); end(); resolve() }
    const step = (d, pos) => {
      if (!k.alive || p >= 1) return
      p = Math.min(1, p + d / need)
      const now = performance.now()
      if (o.sfx !== null && now - t0 > 110) { t0 = now; (sfx2[o.sfx ?? 'scrub'] ?? sfx2.scrub)(0.7) }
      o.onProgress?.(p, pos)
      if (p >= 1) finish()
    }
    const tr = track(k, area, {
      cursor: 'pointer',
      down: pt => { hint.kick(); o.onStart?.(pt) },
      move: (pt, prev) => { if (tr.down && inside(pt, area)) { hint.kick(); step(Math.hypot(pt.x - prev.x, pt.y - prev.y), pt) } },
      up: pt => o.onEnd?.(pt),
    })
    const end = k.waiting('scrub', () => { step(need * 1.02, { x: r0.cx ?? a.x, y: a.y }); return true })
  })
}

// ───────────────────────── размешивание по кругу ─────────────────────────

/**
 * Крутим пальцем по кругу вокруг center. turns — сколько оборотов нужно.
 * spoon — необязательный элемент: следует за пальцем по окружности радиуса radius.
 */
export function stir(k, center, o = {}) {
  return new Promise(resolve => {
    const radius = o.radius ?? 110, turns = o.turns ?? 3
    const area = { x: center.x - radius * 1.7, y: center.y - radius * 1.7, w: radius * 3.4, h: radius * 3.4 }
    let total = 0, lastA = null, t0 = 0
    if (o.prompt) { k.setRepeat(() => void k.say(o.prompt, o.host ?? null)); k.say(o.prompt, o.host ?? null) }
    // ручка кружится по окружности
    const hint = idleHint(k, () => {
      const h = { v: 0 }
      const el = document.createElement('div')
      const hand = fx.hand({ x: center.x + radius, y: center.y })
      const tw = gsap.to(h, { v: Math.PI * 2, duration: 2, repeat: -1, ease: 'none', onUpdate: () => {} })
      return () => { tw.kill(); hand.stop(); el.remove() }
    })
    const spoon = o.spoon
    const finish = () => { tr.destroy(); hint.stop(); k.setRepeat(null); end(); resolve() }
    const add = (a, pos) => {
      if (lastA !== null) {
        let d = a - lastA
        while (d > Math.PI) d -= Math.PI * 2
        while (d < -Math.PI) d += Math.PI * 2
        total += Math.abs(d)
        const now = performance.now()
        if (now - t0 > 260) { t0 = now; sfx2.stir(0.7) }
      }
      lastA = a
      const p = Math.min(1, total / (turns * Math.PI * 2))
      o.onProgress?.(p, a)
      if (spoon) {
        const cx = center.x + Math.cos(a) * Math.min(radius * 0.8, Math.hypot(pos.x - center.x, pos.y - center.y))
        const cy = center.y + Math.sin(a) * Math.min(radius * 0.8, Math.hypot(pos.x - center.x, pos.y - center.y))
        gsap.to(spoon, { x: `+=${0}`, duration: 0 })
        o.moveSpoon?.(cx, cy, a)
      }
      if (p >= 1 && k.alive) finish()
    }
    const tr = track(k, area, {
      cursor: 'pointer',
      down: pt => { hint.kick(); lastA = Math.atan2(pt.y - center.y, pt.x - center.x) },
      move: pt => {
        if (!tr.down) return
        const d = Math.hypot(pt.x - center.x, pt.y - center.y)
        if (d < radius * 0.2) return
        hint.kick()
        add(Math.atan2(pt.y - center.y, pt.x - center.x), pt)
      },
      up: () => { lastA = null },
    })
    const end = k.waiting('stir', () => {
      let a = 0
      const id = window.setInterval(() => { a += 0.6; add(a, { x: center.x + Math.cos(a) * radius, y: center.y + Math.sin(a) * radius }) }, 30)
      k.onExit(() => window.clearInterval(id))
      return true
    })
  })
}

// ───────────────────────── встряхнуть ─────────────────────────

/** Таскаем элемент туда-сюда: каждая смена направления = одно встряхивание. */
export function shake(k, target, o = {}) {
  return new Promise(resolve => {
    const count = o.count ?? 10, amp = o.amp ?? 70, axis = o.axis ?? 'x'
    const r0 = rectOf(target)
    const base = { x: Number(gsap.getProperty(target, 'x')), y: Number(gsap.getProperty(target, 'y')) }
    let n = 0, dir = 0, ext = null, down = false, origin = null
    if (o.prompt) { k.setRepeat(() => void k.say(o.prompt, o.host ?? null)); k.say(o.prompt, o.host ?? null) }
    const stopPulse = fx.pulse(target, o.color)
    const hint = idleHint(k, wiggleHand({ x: r0.cx - amp, y: r0.cy }, { x: r0.cx + amp, y: r0.cy }))
    const area = { x: r0.x - 260, y: r0.y - 260, w: r0.w + 520, h: r0.h + 520 }
    const bump = () => {
      n++
      sfx2.clonk(0.6)
      o.onShake?.(n, count)
      if (n >= count && k.alive) { tr.destroy(); stopPulse(); hint.stop(); gsap.to(target, { x: base.x, y: base.y, duration: 0.25 }); k.setRepeat(null); end(); resolve() }
    }
    const tr = track(k, area, {
      down: pt => { if (!inside(pt, r0, 30)) return; down = true; origin = pt; ext = pt; dir = 0; hint.kick() },
      move: pt => {
        if (!down) return
        hint.kick()
        const dx = axis === 'y' ? 0 : Math.max(-amp * 1.4, Math.min(amp * 1.4, pt.x - origin.x))
        const dy = axis === 'x' ? 0 : Math.max(-amp * 1.4, Math.min(amp * 1.4, pt.y - origin.y))
        gsap.set(target, { x: base.x + dx, y: base.y + dy })
        const v = axis === 'y' ? pt.y : pt.x, e = axis === 'y' ? ext.y : ext.x
        const d = v - e
        const nd = Math.sign(d) || dir
        if (dir === 0 && Math.abs(d) > amp * 0.4) { dir = nd; ext = pt }
        else if (dir !== 0) {
          if (nd === dir && Math.abs(d) > 0) ext = pt // продолжаем в ту же сторону
          else if (nd !== dir && Math.abs(d) > amp * 0.6) { dir = nd; ext = pt; bump() }
        }
      },
      up: () => { down = false; gsap.to(target, { x: base.x, y: base.y, duration: 0.2 }) },
    })
    const end = k.waiting('shake', () => {
      let i = 0
      const id = window.setInterval(() => { if (i++ < count + 2) { gsap.fromTo(target, { x: base.x - amp * 0.5 }, { x: base.x + amp * 0.5, duration: 0.1, yoyo: true, repeat: 1 }); bump() } }, 130)
      k.onExit(() => window.clearInterval(id))
      return true
    })
  })
}

// ───────────────────────── удержание / наливание ─────────────────────────

/**
 * Держим палец на target, шкала растёт (duration секунд до 100%).
 * Если goal=[lo,hi] — надо отпустить в этом диапазоне (0..1); перелив → onOver(), сброс.
 * Возвращает итоговый уровень.
 */
export function hold(k, target, o = {}) {
  return new Promise(resolve => {
    const dur = o.duration ?? 2.5
    const goal = o.goal ?? null
    let level = o.start ?? 0, holding = false, last = 0, t0 = 0
    if (o.prompt) { k.setRepeat(() => void k.say(o.prompt, o.host ?? null)); k.say(o.prompt, o.host ?? null) }
    const stopPulse = o.pulse === false ? () => {} : fx.pulse(target, o.color)
    const hint = idleHint(k, () => { const h = fx.hand(centerOf(target)); return () => h.stop() })
    const r0 = rectOf(target)
    const area = { x: r0.x - 20, y: r0.y - 20, w: r0.w + 40, h: r0.h + 40 }
    const stop = () => { window.clearInterval(iv); tr.destroy(); stopPulse(); hint.stop(); k.setRepeat(null); end() }
    const tick = () => {
      if (!holding || !k.alive) return
      const now = performance.now()
      const dt = (now - last) / 1000
      last = now
      level = Math.min(1.0001, level + dt / dur)
      if (now - t0 > 180) { t0 = now; if (o.sfx !== null) (sfx2[o.sfx ?? 'pour'] ?? sfx2.pour)(0.25) }
      o.onLevel?.(Math.min(1, level))
      if (!goal && level >= 1) { holding = false; stop(); o.onRelease?.(1); resolve(1) }
      else if (goal && level > goal[1] + (o.slack ?? 0.03)) { holding = false; level = 0; o.onOver?.(); o.onLevel?.(0) }
    }
    const iv = window.setInterval(tick, 30)
    const tr = track(k, area, {
      cursor: 'pointer',
      down: pt => { holding = true; last = performance.now(); hint.kick(); o.onStart?.() },
      up: () => {
        if (!holding) return
        holding = false
        o.onRelease?.(level)
        if (goal) {
          if (level >= goal[0] && level <= goal[1] + (o.slack ?? 0.03)) { const l = level; stop(); resolve(l) }
          else o.onMiss?.(level)
        }
      },
    })
    const end = k.waiting('hold', () => {
      const t = goal ? (goal[0] + goal[1]) / 2 : 1
      level = t
      o.onLevel?.(t)
      holding = false
      stop()
      resolve(t)
      return true
    })
  })
}

// ───────────────────────── перетаскивание в зоны ─────────────────────────

/**
 * Универсальный drag-and-drop.
 *  items: [{ el, id, ... }]         — перетаскиваемые элементы (позиционированы через left/top)
 *  zones: [{ el, id, ... }]         — цели
 *  accept(item, zone) → boolean     — правильное ли место
 *  onCorrect(item, zone) → Promise? — по умолчанию: «прилипает» к центру зоны
 *  onWrong(item, zone|null, tries)  — по умолчанию: вернуть домой + звук
 *  until()                          — когда считать игру законченной (по умолчанию: все items поставлены)
 */
export function dnd(k, o) {
  return new Promise(resolve => {
    const items = o.items, zones = o.zones
    const placed = new Set(), tries = new Map()
    let busy = false
    const ctrls = new Map()
    if (o.prompt) { k.setRepeat(() => void k.say(o.prompt, o.host ?? null)); k.say(o.prompt, o.host ?? null) }
    const firstLeft = () => items.find(i => !placed.has(i))
    const zoneFor = it => zones.find(z => o.accept(it, z))
    const hint = idleHint(k, () => {
      const it = firstLeft(), z = it && zoneFor(it)
      if (!it) return () => {}
      const h = fx.hand(centerOf(it.el), z ? centerOf(z.el) : undefined)
      return () => h.stop()
    })
    const finish = () => { hint.stop(); k.setRepeat(null); end(); resolve(placed) }
    const check = () => { if (o.until ? o.until(placed) : placed.size >= items.length) finish() }
    const nearest = pt => {
      let best = null, bd = 1e9
      for (const z of zones) {
        const r = rectOf(z.el), pad = z.pad ?? o.pad ?? 40
        if (!inside(pt, r, pad)) continue
        const d = Math.hypot(pt.x - r.cx, pt.y - r.cy)
        if (d < bd) { bd = d; best = z }
      }
      return best
    }
    const settle = async (it, z, ok) => {
      busy = true
      if (ok) {
        placed.add(it)
        ctrls.get(it)?.enable(false)
        it.el.style.cursor = ''
        it.el.style.pointerEvents = o.keepInteractive ? '' : 'none'
        audio.sfx('plop')
        if (o.onCorrect) await o.onCorrect(it, z, placed)
        else {
          const c = ctrls.get(it)
          c.moveTo(o.snap?.(it, z) ?? centerOf(z.el), 0.3)
          await k.wait(320)
        }
      } else {
        const t = (tries.get(it) ?? 0) + 1
        tries.set(it, t)
        audio.sfx('boing', { vol: 0.5 })
        ctrls.get(it)?.home()
        if (o.onWrong) await o.onWrong(it, z, t)
        if (t >= 2 && zoneFor(it)) { const stop = fx.pulse(zoneFor(it).el, '#FFFFFF'); k.after(2500, stop) }
      }
      busy = false
      check()
    }
    for (const it of items) {
      const c = draggable(k, it.el, {
        onStart: () => { if (busy || placed.has(it)) return false; hint.kick(); o.onPick?.(it) },
        onEnd: pt => {
          if (busy) { c.home(); return }
          const z = nearest(pt)
          if (!z) { if (!o.quietMiss) { audio.sfx('boing', { vol: 0.4 }) } c.home(); return }
          settle(it, z, o.accept(it, z))
        },
      })
      ctrls.set(it, c)
    }
    const end = k.waiting('dnd', () => {
      const it = firstLeft()
      if (!it) return true
      const z = zoneFor(it) ?? zones[0]
      settle(it, z, true)
      return true
    })
  })
}

// ───────────────────────── шаги по порядку ─────────────────────────

/**
 * Карточки-шаги нужно нажимать в правильном порядке.
 *  steps: [{ id, art (html), color }]  в правильном порядке
 *  onPlace(step, index) → Promise?     — вызывается после каждого верного шага
 *  onWrong(step, expectedStep)         — неверный шаг
 * Возвращает число ошибок.
 */
export function sequence(k, o) {
  return new Promise(resolve => {
    const steps = o.steps
    const n = steps.length
    const order = o.shuffled ?? [...steps].sort(() => Math.random() - 0.5)
    const size = o.cardSize ?? Math.min(200, Math.floor(1300 / n) - 24)
    const wrap = document.createElement('div')
    wrap.className = 'kx-seq'
    wrap.style.cssText = 'position:absolute;inset:0;z-index:60;pointer-events:none'
    const slotsY = o.slotsY ?? 130, cardsY = o.cardsY ?? 790
    const gap = 20, totalW = n * size + (n - 1) * gap, x0 = 800 - totalW / 2
    const slotEls = steps.map((s, i) => {
      const e = document.createElement('div')
      e.className = 'kx-slot'
      e.style.cssText = `position:absolute;left:${x0 + i * (size + gap)}px;top:${slotsY}px;width:${size}px;height:${size}px;border-radius:${size * 0.22}px;border:6px dashed rgba(59,47,79,.3);background:rgba(255,255,255,.55);display:grid;place-items:center;font:900 ${size * 0.4}px var(--font);color:rgba(59,47,79,.35)`
      e.textContent = String(i + 1)
      wrap.appendChild(e)
      return e
    })
    const cards = order.map((s, i) => {
      const e = document.createElement('div')
      e.className = 'kx-card'
      e.dataset.id = s.id
      e.style.cssText = `position:absolute;left:${x0 + i * (size + gap)}px;top:${cardsY}px;width:${size}px;height:${size}px;border-radius:${size * 0.22}px;background:#fff;box-shadow:0 10px 0 rgba(0,0,0,.15), inset 0 0 0 8px ${s.color ?? '#FFD166'};display:grid;place-items:center;pointer-events:auto;cursor:pointer;touch-action:manipulation`
      e.innerHTML = `<div style="width:76%;height:76%">${s.art}</div>`
      wrap.appendChild(e)
      return { s, e }
    })
    k.world.appendChild(wrap)
    gsap.from(cards.map(c => c.e), { y: 300, opacity: 0, duration: 0.55, ease: 'back.out(1.6)', stagger: 0.07 })
    if (o.prompt) { k.setRepeat(() => void k.say(o.prompt, o.host ?? null)); k.say(o.prompt, o.host ?? null) }
    let next = 0, wrong = 0, busy = false
    const hint = idleHint(k, () => { const c = cards.find(c => c.s === steps[next]); if (!c) return () => {}; const h = fx.hand(centerOf(c.e), centerOf(slotEls[next])); return () => h.stop() })
    const take = async c => {
      if (busy || !k.alive || c.done) return
      hint.kick()
      const exp = steps[next]
      if (c.s !== exp) {
        wrong++
        audio.sfx('wrong', { vol: 0.5 })
        fx.wiggle(c.e)
        await o.onWrong?.(c.s, exp)
        if (wrong >= 2) { const stop = fx.pulse(cards.find(x => x.s === exp).e, '#FFFFFF'); k.after(2500, stop) }
        return
      }
      busy = true
      c.done = true
      audio.sfx('pop')
      const slot = slotEls[next], r = rectOf(slot), cr = rectOf(c.e)
      gsap.to(c.e, { x: `+=${r.cx - cr.cx}`, y: `+=${r.cy - cr.cy}`, duration: 0.45, ease: 'power2.inOut' })
      await k.wait(450)
      slot.style.borderStyle = 'solid'
      slot.style.borderColor = '#6BCB77'
      slot.textContent = ''
      const i = next++
      await o.onPlace?.(c.s, i)
      busy = false
      if (next >= n) { hint.stop(); k.setRepeat(null); end(); wrap.remove(); resolve(wrong) }
    }
    for (const c of cards) c.e.addEventListener('pointerdown', e => { e.preventDefault(); take(c) })
    const end = k.waiting('sequence', () => { const c = cards.find(c => c.s === steps[next] && !c.done); if (c) take(c); return true })
  })
}

export { hitTest, inside }
