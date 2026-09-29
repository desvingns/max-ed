// «Нюхаем специи» — баночки специй: открыть, помахать ладошкой (нюхаем издали!), угадать блюдо.
// Пых чихает огоньком от перца. Безопасность: издали, в рот без взрослых нельзя.
import { defineLevel } from '../lib.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, ellipsePath } from '../art.js'

const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`

const SP = {
  cinnamon: { lid: '#C68B59', lidShade: '#9C6435', body: '#B8743F', shade: '#8F5228', aroma: '#D9A066' },
  dill: { lid: '#6BCB77', lidShade: '#45B57C', body: '#86D06E', shade: '#5BB050', aroma: '#98E08E' },
  mint: { lid: '#3CC8B0', lidShade: '#25A18E', body: '#5FD6A0', shade: '#3DB482', aroma: '#7FEBCB' },
  pepper: { lid: '#6B5A82', lidShade: '#3B2F4F', body: '#3E3550', shade: '#2A2238', aroma: '#9A88B8' },
}

function icon(kind) {
  if (kind === 'cinnamon') {
    return `<g transform="rotate(-22 85 180)">${R(56, 165, 56, 15, 7, '#C68B59', { sw: 3.5 })}${R(58, 182, 56, 15, 7, '#B06A35', { sw: 3.5 })}${C(112, 172.5, 6.5, '#E2B78A', { sw: 3 })}${C(114, 189.5, 6.5, '#D9A066', { sw: 3 })}${L('M112 170Q115 173 112 176', '#9C6435', 2.5)}</g>`
  }
  if (kind === 'dill') {
    const sprig = (a) => `<g transform="rotate(${a} 85 200)"><path d="M85 200V152M85 168L74 156M85 168L96 156M85 180L72 170M85 180L98 170M85 192L74 184M85 192L96 184" stroke="#2E8F5B" stroke-width="4" stroke-linecap="round" fill="none"/></g>`
    return sprig(-18) + sprig(18) + sprig(0)
  }
  if (kind === 'mint') {
    const leaf = (x, y, rot) => `${E(x, y, 13, 22, '#4FC98D', { sw: 3.5, rot })}<path d="M${x} ${y - 14}V${y + 14}" stroke="#2E8F5B" stroke-width="2.5" transform="rotate(${rot} ${x} ${y})"/>`
    return leaf(70, 176, -32) + leaf(100, 176, 32) + leaf(85, 168, 0)
  }
  return [[70, 184], [98, 182], [84, 160]].map(([x, y]) => `${C(x, y, 12, '#3E3550', { sw: 3.5 })}${E(x - 4, y - 4, 3.6, 2.2, '#fff', { sw: 0, rot: -30, attr: 'opacity=".8"' })}`).join('')
}

function contents(kind, c) {
  const top = 'M20 116Q50 104 80 116T150 112V250H20Z'
  let tex = ''
  if (kind === 'cinnamon') tex = [[54, 150], [96, 138], [116, 176], [60, 200], [100, 214], [78, 170]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${c.shade}"/>`).join('') + `<g transform="rotate(20 64 100)">${R(58, 74, 15, 60, 7, '#C68B59', { sw: 3.5 })}</g><g transform="rotate(-16 108 100)">${R(102, 70, 15, 64, 7, '#B06A35', { sw: 3.5 })}</g>`
  if (kind === 'dill') tex = `<path d="M40 122L50 100M62 118L60 94M88 120L96 96M112 118L124 98M130 120L134 104" stroke="#3E9A4D" stroke-width="4" stroke-linecap="round"/>` + [[50, 150], [90, 140], [116, 170], [64, 196], [104, 210], [76, 172]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${c.shade}"/>`).join('')
  if (kind === 'mint') tex = [[54, 140, -30], [96, 132, 30], [116, 170, -50], [60, 196, 40], [98, 210, -20]].map(([x, y, r]) => E(x, y, 9, 15, c.shade, { sw: 0, rot: r })).join('') + E(70, 116, 10, 18, '#4FC98D', { sw: 3, rot: -40 }) + E(102, 114, 10, 18, '#4FC98D', { sw: 3, rot: 40 })
  if (kind === 'pepper') tex = [[46, 144], [80, 136], [112, 150], [58, 178], [96, 184], [122, 200], [70, 214], [104, 224], [48, 210]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#2A2238"/><circle cx="${x - 2}" cy="${y - 2}" r="2" fill="#fff" opacity=".6"/>`).join('')
  return `<path d="${top}" fill="${c.body}"/>${tex}`
}

function jarSvg(kind) {
  const c = SP[kind]
  const glass = 'M40 66Q40 54 54 54H116Q130 54 130 66L140 86V222Q140 242 120 242H50Q30 242 30 222V86Z'
  return svg(170, 254,
    SH(85, 248, 62, 7) +
    S(glass, '#F3FAFF', '#C3DBEE', { extra: contents(kind, c) }) +
    P(glass, 'none', { sw: 5 }) +
    `<rect x="44" y="138" width="82" height="86" rx="18" fill="#fff" stroke="${INK}" stroke-width="4.5"/>` + icon(kind) +
    HL(46, 112, 4.5, 26, 0, 0.7))
}

function lidSvg(kind) {
  const c = SP[kind]
  return svg(170, 254, `<g>${S(rr(34, 20, 102, 40, 11), c.lid, c.lidShade, { off: [-7, -8], extra: [52, 68, 84, 100, 116].map(x => L(`M${x} 28V54`, c.lidShade, 4, 'opacity=".55"')).join('') })}${HL(56, 30, 20, 4, -5, 0.55)}</g>`)
}

function flameSvg() {
  return svg(120, 150,
    P('M60 6C78 34 112 54 104 96C98 126 76 142 60 142C44 142 22 126 16 96C8 54 42 34 60 6Z', '#FF7A2F', { sw: 5 }) +
    P('M60 52C72 72 90 84 86 108C83 124 72 132 60 132C48 132 37 124 34 108C30 84 48 72 60 52Z', '#FFD93D', { sw: 0 }) +
    P('M60 88C66 98 74 104 72 116C70 124 66 128 60 128C54 128 50 124 48 116C46 104 54 98 60 88Z', '#FFF3B0', { sw: 0 }))
}

const DISH = {
  pie: '🥧', fish: '🐟', salad: '🥗', potato: '🥔', cake: '🍰', ice: '🍦', tea: '🍵', pancakes: '🥞', pizza: '🍕', soup: '🍲', candy: '🍬',
}
const card = e => `<span class="emoji">${e}</span>`

export default defineLevel({
  id: 'smell-spices',
  async run(k) {
    const gsap = k.gsap
    // жесты героя не должны накладываться друг на друга (иначе «уплывает» стойка), поэтому ставим их в очередь
    const emoQ = new Map()
    const emo = (c, name) => { const p = (emoQ.get(c) ?? Promise.resolve()).then(() => (k.alive ? c.emote(name) : null)).catch(() => {}); emoQ.set(c, p); return p }
    const tell = (c, id, name) => { if (name) emo(c, name); return k.tell(c, id) }
    k.kitchenBg()
    const pyx = k.pyx({ x: 270 })
    const head = pyx.part('.c-head')
    const headO = head.getAttribute('data-origin')
    const KINDS = ['cinnamon', 'dill', 'mint', 'pepper']
    const X = [690, 880, 1070, 1260]
    const jars = KINDS.map((kind, i) => {
      const el = k.prop(jarSvg(kind), X[i], 592, 160, 240, { z: 7 })
      const lid = k.prop(lidSvg(kind), X[i], 592, 160, 240, { z: 8 })
      lid.style.pointerEvents = 'none'
      gsap.set(lid, { transformOrigin: '50% 16%' })
      return { kind, el, lid, x: X[i] }
    })
    const snout = () => { const c = k.centerOf(head); return { x: c.x + 30, y: c.y + 24 } }

    const dim = (j, on) => { for (const e of [j.el, j.lid]) { e.style.filter = on ? 'brightness(.9) saturate(.75)' : ''; e.style.transition = 'filter .3s' } }
    jars.forEach(j => k.on(j.el, 'pointerdown', () => { if (j.dimmed) k.fx.wiggle(j.el) }))
    const setDim = (j, on) => { j.dimmed = on; dim(j, on) }
    jars.forEach(j => setDim(j, true))

    k.fromTo(jars.flatMap(j => [j.el, j.lid]), { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.09, ease: 'back.out(1.6)' })
    await k.wait(800)

    // ─ помощники ─
    const openJar = async j => {
      k.sfx('pop')
      await k.play(gsap.to(j.lid, { x: 56, y: -70, rotation: 32, duration: 0.5, ease: 'back.out(1.8)' }))
    }
    const closeJar = async j => {
      await k.play(gsap.to(j.lid, { x: 0, y: 0, rotation: 0, duration: 0.45, ease: 'back.inOut(1.6)' }))
      k.sfx('clonk', { vol: 0.6 })
    }
    const tick = j => {
      const c = k.centerOf(j.el)
      const b = k.badge('✓', c.x, c.y - 148, { size: 66, color: '#6BCB77' })
      return b
    }
    // облачко запаха летит от точки a к носу Пыха
    const puff = (a, color, delay = 0) => {
      const size = k.rand(46, 74)
      const el = k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:${color};box-shadow:inset -7px -7px 0 rgba(0,0,0,.10),0 0 0 4px rgba(255,255,255,.55)"></div>`, a.x, a.y, size, size, { z: 13 })
      el.style.opacity = '0'
      const b = snout()
      const mid = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - k.rand(80, 160) }
      const o = { t: 0 }
      const wob = k.rand(-1, 1)
      k.to(o, {
        t: 1, duration: k.rand(1.3, 1.8), delay, ease: 'sine.inOut',
        onUpdate: () => {
          const t = o.t, u = 1 - t
          const x = u * u * a.x + 2 * u * t * mid.x + t * t * b.x + Math.sin(t * 9) * 14 * wob
          const y = u * u * a.y + 2 * u * t * mid.y + t * t * b.y
          const s = size * (0.6 + 0.6 * Math.sin(Math.PI * t))
          Object.assign(el.style, { left: `${x - s / 2}px`, top: `${y - s / 2}px`, width: `${s}px`, height: `${s}px`, opacity: String(Math.min(1, t * 6) * (t > 0.85 ? (1 - t) / 0.15 : 1) * 1) })
        },
        onComplete: () => el.remove(),
      })
    }
    const sniff = async (j, n = 2) => {
      k.sfx('swish', { vol: 0.5 })
      const dur = 0.22
      const lean = gsap.to(head, { x: 12, y: 8, rotation: 7, svgOrigin: headO, duration: dur, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut' })
      await k.wait(dur * 1000 * 2 * n * 0.85)
      lean.kill(); gsap.to(head, { x: 0, y: 0, rotation: 0, svgOrigin: headO, duration: 0.25 })
      k.sfx('yum', { vol: 0.5 })
    }
    const thought = (html, w = 170) => k.bubble(html, 470, 300, { w, h: 160, font: 76 })
    const dropBubble = b => k.play(gsap.to(b, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => b.remove() }))
    let wrongN = 0
    const askDish = async (j, qId, okId, dish) => {
      const q = thought('❓')
      let dishBubble = null
      await k.choose({
        prompt: k.key(qId), host: pyx,
        options: dish.map(([id, e, color, correct]) => ({
          id, color, correct: !!correct, art: card(DISH[e]),
          outcome: async () => {
            if (correct) {
              q.remove()
              dishBubble = thought(card(DISH[e]))
              k.sfx('yum'); k.sparkle(470, 300, 6)
              await tell(pyx, okId, 'cheer')
            } else {
              k.sfx('yuck', { vol: 0.5 })
              const w = k.bubble(card(DISH[e]) + '<span class="emoji" style="font-size:40px"> 🤢</span>', 470, 300, { w: 230, h: 150, font: 64 })
              const wi = wrongN++
              await tell(pyx, wi % 2 ? 'wrong2' : 'wrong1', wi % 2 ? 'shake' : 'laugh')
              w.remove()
            }
          },
        })),
      })
      await k.wait(300)
      if (dishBubble) await dropBubble(dishBubble)
    }

    // ── 0. знакомство ──
    await tell(pyx, 'hello', 'wave')
    await tell(pyx, 'rule', 'point')

    // ── 1. корица: открыть, помахать, выбрать блюдо ──
    {
      const j = jars[0]; setDim(j, false)
      await k.tapOnEl(j.el, { prompt: k.key('q_open1'), host: pyx })
      await openJar(j)
      await k.scrub(j.el, {
        need: 640, sfx: null, prompt: k.key('q_wave'), host: pyx,
        area: { x: X[0] - 200, y: 380, w: 400, h: 330 },
        onProgress: (p, pos) => {
          if (performance.now() - (j.last ?? 0) > 110) { j.last = performance.now(); puff({ x: pos.x, y: Math.min(pos.y, 500) }, SP.cinnamon.aroma); k.sfx('swish', { vol: 0.25 }) }
        },
      })
      await k.wait(1100)
      await sniff(j)
      await tell(pyx, 'sniff1', 'happy')
      await askDish(j, 'q_dish1', 'ok1', [['pie', 'pie', '#FFB938', true], ['fish', 'fish', '#62C6FF'], ['salad', 'salad', '#6BCB77']])
      await closeJar(j); tick(j); setDim(j, true)
    }

    // ── 2. укроп ──
    {
      const j = jars[1]; setDim(j, false)
      await k.tapOnEl(j.el, { prompt: k.key('q_open2'), host: pyx })
      await openJar(j)
      await k.scrub(j.el, {
        need: 460, sfx: null,
        area: { x: X[1] - 200, y: 380, w: 400, h: 330 },
        onProgress: (p, pos) => {
          if (performance.now() - (j.last ?? 0) > 110) { j.last = performance.now(); puff({ x: pos.x, y: Math.min(pos.y, 500) }, SP.dill.aroma); k.sfx('swish', { vol: 0.25 }) }
        },
      })
      await k.wait(1100)
      await sniff(j)
      await tell(pyx, 'sniff2', 'happy')
      await askDish(j, 'q_dish2', 'ok2', [['cake', 'cake', '#FF8FC8'], ['potato', 'potato', '#C68B59', true], ['ice', 'ice', '#B388EB']])
      await closeJar(j); tick(j); setDim(j, true)
    }

    // ── 3. мята: тап-тап-тап — запах летит порциями ──
    {
      const j = jars[2]; setDim(j, false)
      await k.tapOnEl(j.el, { prompt: k.key('q_open3'), host: pyx })
      await openJar(j)
      const c = k.centerOf(j.el)
      await k.tapN(j.el, 3, {
        prompt: k.key('q_puff'), host: pyx, pulse: true,
        onTap: i => { for (let n = 0; n < 3; n++) puff({ x: c.x + k.rand(-30, 30), y: c.y - 130 }, SP.mint.aroma, n * 0.08); k.sfx('swish', { vol: 0.4 }); k.sayNumber(i) },
      })
      await k.wait(1400)
      await sniff(j, 3)
      await tell(pyx, 'sniff3', 'surprised')
      await askDish(j, 'q_dish3', 'ok3', [['pancakes', 'pancakes', '#FFB938'], ['pizza', 'pizza', '#FF5A5F'], ['tea', 'tea', '#3CC8B0', true]])
      await closeJar(j); tick(j); setDim(j, true)
    }

    // ── 4. перец: щекочет нос — Пых чихает огоньком ──
    {
      const j = jars[3]; setDim(j, false)
      await k.tapOnEl(j.el, { prompt: k.key('q_open4'), host: pyx })
      await openJar(j)
      const c = k.centerOf(j.el)
      for (let n = 0; n < 5; n++) puff({ x: c.x + k.rand(-30, 30), y: c.y - 130 }, SP.pepper.aroma, n * 0.18)
      await k.wait(1500)
      // «ап… ап…»
      const back = gsap.to(head, { y: -10, rotation: -9, svgOrigin: headO, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' })
      pyx.setMouth(0.6)
      await tell(pyx, 'ap', 'surprised')
      back.kill()
      gsap.to(head, { y: -14, rotation: -12, svgOrigin: headO, duration: 0.25 })
      await k.wait(350)
      // апчхи!
      const hp = k.centerOf(head)
      gsap.to(head, { y: 12, rotation: 12, svgOrigin: headO, duration: 0.12 })
      k.sfx('sneeze')
      k.after(80, () => k.sfx('whoosh'))
      const mouth = { x: hp.x + 34, y: hp.y + 50 }
      ;[[56, 0.9, 0], [82, 1.15, 0.05], [108, 0.8, 0.1]].forEach(([a, sc, dl]) => {
        const w = 120 * sc, h = 150 * sc
        const f = k.prop(flameSvg(), mouth.x, mouth.y - h / 2, w, h, { z: 14 })
        gsap.set(f, { transformOrigin: '50% 100%', rotation: a, scale: 0.1, opacity: 1 })
        k.timeline({ delay: dl })
          .to(f, { scale: 1.15, duration: 0.28, ease: 'back.out(2.2)' })
          .to(f, { scale: 1.0, x: `+=${Math.sin(a * Math.PI / 180) * 50}`, y: `-=${Math.cos(a * Math.PI / 180) * 50}`, duration: 0.9, ease: 'sine.inOut' }, 0.28)
          .to(f, { opacity: 0, duration: 0.35, onComplete: () => f.remove() }, 0.95)
      })
      gsap.fromTo(k.world, { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1.4,0.2)' })
      k.sparkle(hp.x + 120, hp.y - 60, 6)
      k.after(500, () => k.sparkle(hp.x + 60, hp.y - 130, 5))
      const say = tell(pyx, 'sneeze', 'surprised')
      await k.wait(700)
      gsap.to(head, { y: 0, rotation: 0, svgOrigin: headO, duration: 0.4, ease: 'back.out(2)' })
      await say
      await tell(pyx, 'after_sneeze', 'laugh')
      await askDish(j, 'q_dish4', 'ok4', [['ice', 'ice', '#B388EB'], ['candy', 'candy', '#FF8FC8'], ['soup', 'soup', '#FF9F43', true]])
      await closeJar(j); tick(j)
    }

    // ── 5. вывод ──
    jars.forEach(j => setDim(j, false))
    k.burst(900, 500, 10)
    await tell(pyx, 'sum', 'point')
    await tell(pyx, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
