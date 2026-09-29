// Общие элементы интерфейса kx-уровней: шаги рецепта, значки-числа, шкала вкуса, «мама разрешила».
import { gsap, audio, fx, kitchen } from './deps.js'
import { INK, svg, P, R, C, E, HL } from './art.js'
import { centerOf } from './gesture.js'

let styled = false
export function installStyle() {
  if (styled) return
  styled = true
  const s = document.createElement('style')
  s.id = 'kx-style'
  s.textContent = `
  .kxart{display:block;overflow:visible}
  .kx-food{position:absolute}
  .kx-steps{position:absolute;left:0;right:0;top:20px;display:flex;justify-content:center;gap:14px;z-index:70;pointer-events:none}
  .kx-step{width:82px;height:82px;border-radius:50%;background:#fff;box-shadow:0 6px 0 rgba(0,0,0,.16),inset 0 0 0 6px #E0D6EC;display:grid;place-items:center;font-size:44px;line-height:1;transition:scale .3s,box-shadow .3s,opacity .3s;opacity:.85;position:relative;scale:1}
  .kx-step .emoji{font-size:44px}
  .kx-step.now{scale:1.22;box-shadow:0 8px 0 rgba(0,0,0,.18),inset 0 0 0 7px #FFB703;opacity:1}
  .kx-step.done{box-shadow:0 6px 0 rgba(0,0,0,.16),inset 0 0 0 6px #6BCB77;opacity:.75}
  .kx-step.done::after{content:"✓";position:absolute;right:-8px;bottom:-8px;width:32px;height:32px;border-radius:50%;background:#6BCB77;color:#fff;font:900 22px/32px var(--font);text-align:center;border:3px solid #fff}
  .kx-badge{position:absolute;display:grid;place-items:center;font:900 64px/1 var(--font);color:#3B2F4F;background:#fff;border-radius:50%;box-shadow:0 8px 0 rgba(0,0,0,.16),inset 0 0 0 7px #FFD166;z-index:66;pointer-events:none}
  .kx-bubble{position:absolute;z-index:66;pointer-events:none}
  .kx-meter{position:absolute;z-index:64;pointer-events:none}
  `
  document.head.appendChild(s)
}

/** Полоска шагов рецепта сверху: icons — массив эмодзи/HTML. → { set(i), done(i), el } */
export function stepsBar(k, icons, o = {}) {
  const el = document.createElement('div')
  el.className = 'kx-steps'
  if (o.top != null) el.style.top = `${o.top}px`
  el.innerHTML = icons.map(i => `<div class="kx-step">${/^</.test(i) ? i : `<span class="emoji">${i}</span>`}</div>`).join('')
  k.root.appendChild(el)
  const items = [...el.children]
  gsap.fromTo(items, { y: -120 }, { y: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.06, clearProps: 'transform' })
  return {
    el,
    set(i) { items.forEach((s, j) => { s.classList.toggle('now', j === i); s.classList.toggle('done', j < i) }) },
    done(i) { items[i]?.classList.add('done'); items[i]?.classList.remove('now') },
    hide() { gsap.to(el, { autoAlpha: 0, duration: 0.3 }) },
  }
}

/** Круглый значок с числом/текстом: k.badge('3', 800, 200, {size:110, color:'#FFD166'}). */
export function badge(k, text, cx, cy, o = {}) {
  const size = o.size ?? 110
  const el = document.createElement('div')
  el.className = 'kx-badge'
  el.style.cssText = `left:${cx - size / 2}px;top:${cy - size / 2}px;width:${size}px;height:${size}px;font-size:${size * 0.58}px;${o.color ? `box-shadow:0 8px 0 rgba(0,0,0,.16),inset 0 0 0 7px ${o.color}` : ''}`
  el.textContent = text
  ;(o.parent ?? k.world).appendChild(el)
  if (o.pop !== false) gsap.fromTo(el, { scale: 0 }, { scale: 1, duration: 0.45, ease: 'back.out(2.4)' })
  return el
}

/** Облачко-подсказка с эмодзи/HTML внутри. */
export function bubble(k, html, cx, cy, o = {}) {
  const w = o.w ?? 190, h = o.h ?? 160
  const el = document.createElement('div')
  el.className = 'kx-bubble'
  el.style.cssText = `left:${cx - w / 2}px;top:${cy - h / 2}px;width:${w}px;height:${h}px`
  const tail = o.tail ?? 'left'
  el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" overflow="visible"><path d="M24 8H${w - 24}Q${w - 8} 8 ${w - 8} 24V${h - 46}Q${w - 8} ${h - 30} ${w - 24} ${h - 30}H${tail === 'left' ? 78 : w - 40}L${tail === 'left' ? 30 : w - 30} ${h - 4}L${tail === 'left' ? 40 : w - 64} ${h - 30}H24Q8 ${h - 30} 8 ${h - 46}V24Q8 8 24 8Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></svg>
    <div style="position:absolute;left:0;right:0;top:0;height:${h - 30}px;display:grid;place-items:center;font-size:${o.font ?? 80}px;line-height:1"><span class="emoji" style="display:contents">${html}</span></div>`
  ;(o.parent ?? k.world).appendChild(el)
  gsap.fromTo(el, { scale: 0, transformOrigin: tail === 'left' ? '15% 95%' : '85% 95%' }, { scale: 1, duration: 0.45, ease: 'back.out(2)' })
  return el
}

/**
 * Шкала «вкусно»: горизонтальная полоса с зонами и указателем.
 * zones: [{from:0,to:.35,color,label}] (0..1). set(v) двигает указатель.
 */
export function meter(k, o) {
  const w = o.w ?? 560, h = o.h ?? 70
  const el = document.createElement('div')
  el.className = 'kx-meter'
  el.style.cssText = `left:${o.x - w / 2}px;top:${o.y - h / 2}px;width:${w}px;height:${h + 60}px`
  const zones = o.zones.map(z => `<div style="position:absolute;left:${z.from * 100}%;width:${(z.to - z.from) * 100}%;top:0;height:${h}px;background:${z.color}"></div>`).join('')
  const faces = o.zones.map(z => `<div style="position:absolute;left:${((z.from + z.to) / 2) * 100}%;top:${h + 4}px;transform:translateX(-50%);font-size:40px;line-height:1"><span class="emoji">${z.face ?? ''}</span></div>`).join('')
  el.innerHTML = `<div style="position:absolute;left:0;top:0;width:100%;height:${h}px;border-radius:${h / 2}px;overflow:hidden;box-shadow:0 0 0 6px ${INK},0 8px 0 6px rgba(0,0,0,.18);background:#fff">${zones}</div>${faces}
    <div class="kx-ptr" style="position:absolute;left:0;top:-14px;width:0;height:0"><div style="position:absolute;left:-16px;top:0;width:32px;height:${h + 28}px;border-radius:16px;background:#fff;box-shadow:0 0 0 5px ${INK}"></div></div>`
  ;(o.parent ?? k.world).appendChild(el)
  const ptr = el.querySelector('.kx-ptr')
  let v = o.value ?? 0
  const put = (val, dur = 0.5) => { v = Math.max(0, Math.min(1, val)); gsap.to(ptr, { x: v * w, duration: dur, ease: 'power2.out' }) }
  put(v, 0)
  gsap.from(el, { y: -80, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.8)' })
  return {
    el,
    set: put,
    get value() { return v },
    zoneOf: val => o.zones.find(z => val >= z.from && val < z.to) ?? o.zones[o.zones.length - 1],
    remove() { gsap.to(el, { autoAlpha: 0, duration: 0.3, onComplete: () => el.remove() }) },
  }
}

const mamaBubbleHtml = `<div style="position:relative;width:100%;height:100%">` +
  svg(240, 190, `<path d="M34 16H214Q232 16 232 34V128Q232 146 214 146H74L14 184L42 146H34Q16 146 16 128V34Q16 16 34 16Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M78 120C40 94 42 58 62 56C72 55 78 62 78 70C78 62 84 55 94 56C114 58 116 94 78 120Z" fill="#FF5A5F" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`) +
  `<span class="emoji" style="position:absolute;left:118px;top:26px;font-size:84px;line-height:1">👍</span></div>`

/**
 * Момент безопасности: «плиту включает взрослый». Пых зовёт маму, мама показывает 👍,
 * затем малыш нажимает на ручку knobEl (невидимый круг поверх ручки плиты).
 * Использует готовые реплики e.kitchen-omelet.adult / mama / mama_ok / q_knob.
 */
export async function adultHelp(k, o) {
  const host = o.host ?? k.host
  if (!o.skipAdult) await k.line(null, 'e.kitchen-omelet.adult')
  host?.face('left')
  await k.line(host, 'e.kitchen-omelet.mama', 'wave')
  const b = document.createElement('div')
  b.style.cssText = 'position:absolute;left:180px;top:150px;width:240px;height:190px;z-index:12'
  b.innerHTML = mamaBubbleHtml
  k.world.appendChild(b)
  gsap.fromTo(b, { scale: 0, transformOrigin: '6% 97%' }, { scale: 1, duration: 0.5, ease: 'back.out(2)' })
  audio.sfx('magic')
  await k.wait(1000)
  host?.face('right')
  await k.line(host, 'e.kitchen-omelet.mama_ok', 'nod')
  gsap.to(b, { scale: 0, autoAlpha: 0, duration: 0.3, delay: 0.2, onComplete: () => b.remove() })
  if (o.knob) await k.tapOnEl(o.knob, { prompt: o.prompt ?? 'e.kitchen-omelet.q_knob', host, idleMs: 8000 })
}
