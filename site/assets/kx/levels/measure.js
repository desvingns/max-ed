// «Мерный стаканчик» — налить молоко до красной чёрточки (k.hold с goal), перелив → лужа,
// счёт стаканов 1–3, «больше / меньше» (какао для Щёчкина и Буси).
import { defineLevel, food } from '../lib.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S } from '../art.js'

// ───────────────────────── рисуем сами ─────────────────────────
const CUP = { bottom: 234, H: 212 }
const TUM = { bottom: 158, H: 144 }
/** Молоко в стакане: f = 0..1 */
function setMilk(el, f, g) {
  const m = el.querySelector('.milk'), t = el.querySelector('.mtop')
  const h = Math.max(0, f) * g.H, y = g.bottom - h
  m.setAttribute('y', y); m.setAttribute('height', h + 4)
  t.setAttribute('y', y); t.setAttribute('height', f > 0.01 ? 6 : 0)
}
const milkLayer = (id, w) => `<g clip-path="url(#${id})"><rect class="milk" x="0" y="300" width="${w}" height="0" fill="#FFFFFF"/><rect class="mtop" x="0" y="300" width="${w}" height="0" fill="#C9DDF2"/></g>`

function cupSvg() {
  const outline = 'M20 16L150 16L138 228Q137 242 122 242H48Q33 242 32 228Z'
  const inner = 'M27 22L143 22L133 226Q132 234 122 234H48Q38 234 37 226Z'
  const ticks = [110, 160, 210].map(y => L(`M126 ${y}H142`, INK, 4, 'opacity=".45"')).join('')
  const RISK = 60
  return svg(170, 250,
    SH(85, 246, 62, 7) +
    L('M146 52Q194 60 188 116Q182 164 138 176', INK, 14) + L('M146 52Q194 60 188 116Q182 164 138 176', '#EAF6FF', 6) +
    P(outline, '#E4F3FF', { sw: 5 }) +
    `<clipPath id="kxmc">${'<path d="' + inner + '"/>'}</clipPath>` + milkLayer('kxmc', 170) +
    P(outline, 'none', { sw: 5 }) + ticks +
    L(`M26 ${RISK}H144`, '#FF3B4E', 8) + P(`M-6 ${RISK - 13}L20 ${RISK}L-6 ${RISK + 13}Z`, '#FF3B4E', { sw: 4 }) +
    HL(46, 130, 5, 70, 4, 0.6))
}

function tumblerSvg(level = 0, id = 'kxmt') {
  const outline = 'M12 10H108L98 152Q97 164 84 164H36Q23 164 22 152Z'
  const inner = 'M18 14H102L93 150Q92 158 84 158H36Q28 158 27 150Z'
  const s = svg(120, 172,
    SH(60, 168, 44, 6) + P(outline, '#E4F3FF', { sw: 5 }) +
    `<clipPath id="${id}"><path d="${inner}"/></clipPath>` + milkLayer(id, 120) + P(outline, 'none', { sw: 5 }) + HL(34, 80, 4.5, 40, 4, 0.6))
  if (!level) return s
  // статичная картинка для карточки: сразу с уровнем
  const h = level * TUM.H, y = TUM.bottom - h
  return s.replace('<rect class="milk" x="0" y="300" width="120" height="0"', `<rect class="milk" x="0" y="${y}" width="120" height="${h + 4}"`).replace('<rect class="mtop" x="0" y="300" width="120" height="0"', `<rect class="mtop" x="0" y="${y}" width="120" height="6"`)
}

function jugSvg() {
  const body = 'M56 76Q52 54 72 48H150Q172 54 168 76L176 252Q178 276 152 276H68Q42 276 44 252Z'
  const heart = 'M110 170C96 160 96 148 104 146C108 145 110 148 110 150C110 148 112 145 116 146C124 148 124 160 110 170Z'
  return svg(220, 290,
    SH(110, 284, 76, 8) +
    L('M166 92Q214 98 210 150Q206 200 172 208', INK, 18) + L('M166 92Q214 98 210 150Q206 200 172 208', '#F0F6FF', 8) +
    P('M62 52L22 44Q8 44 14 58Q30 74 58 80Z', '#FFFFFF', { sw: 5 }) +
    S(body, '#FFFFFF', '#D3E4F8', { extra: R(30, 132, 170, 50, 0, '#62C6FF', { sw: 0 }) + F(heart, '#fff') }) +
    R(66, 40, 90, 12, 6, '#DCE8F5') + HL(64, 110, 5, 46, 4, 0.7))
}

function potSvg() {
  const dots = [[70, 150], [120, 176], [176, 150], [226, 176], [96, 206], [200, 206]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff" opacity=".8"/>`).join('')
  return svg(300, 240,
    SH(150, 234, 120, 8) +
    R(4, 108, 40, 18, 9, '#8C95B4') + R(256, 108, 40, 18, 9, '#8C95B4') +
    S('M34 74H266V204Q266 228 240 228H60Q34 228 34 204Z', '#FF9EB1', '#E8708C', { extra: dots }) +
    E(150, 74, 118, 24, '#FFD3DC') + E(150, 78, 102, 17, '#5B5470', { sw: 0 }) +
    `<ellipse class="pm" cx="150" cy="78" rx="0" ry="0" fill="#FFFFFF"/>` + E(150, 74, 118, 24, 'none') + HL(70, 110, 6, 34, 4, 0.55))
}

const puddleSvg = () => svg(320, 60, E(160, 32, 150, 22, '#FFFFFF', { sw: 4, ink: '#9CC3DD' }) + E(120, 26, 40, 6, '#DCE8F5', { sw: 0 }))

export default defineLevel({
  id: 'measure',
  async run(k) {
    const gsap = k.gsap
    // жесты героя — в очередь (перекрытие жестов сдвигает стойку героя); «cheer» не используем — он «уводит» героя вниз
    const emoQ = new Map()
    const emo = (c, name) => { const p = (emoQ.get(c) ?? Promise.resolve()).then(() => (k.alive ? c.emote(name) : null)).catch(() => {}); emoQ.set(c, p); return p }
    const tell = (c, id, name) => { if (name) emo(c, name); return k.tell(c, id) }

    k.kitchenBg()
    const pyx = k.pyx({ x: 250 })

    const pot = k.prop(potSvg(), 690, 606, 300, 240, { z: 6 })
    const puddle = k.prop(puddleSvg(), 1000, 712, 320, 60, { z: 5 })
    const cup = k.prop(cupSvg(), 1000, 595, 170, 250, { z: 7 })
    const jug = k.prop(jugSvg(), 1240, 580, 210, 277, { z: 8 })
    const stream = k.prop('<div style="width:100%;height:100%;border-radius:8px;background:linear-gradient(90deg,#fff,#DCE8F5);box-shadow:0 0 0 3.5px #3B2F4F"></div>', 1000, 500, 12, 100, { z: 9 })
    gsap.set(stream, { opacity: 0 })
    gsap.set(puddle, { scaleX: 0, scaleY: 0 })
    const setCup = f => setMilk(cup, f, CUP)
    const showStream = (x, y1, y2) => { Object.assign(stream.style, { left: `${x - 6}px`, top: `${y1}px`, height: `${Math.max(4, y2 - y1)}px` }); stream.style.opacity = '1' }
    const hideStream = () => { stream.style.opacity = '0' }
    const F_ = p => Math.min(1, p / 0.9)              // p (0..1 у hold) → доля высоты стакана
    const SURF = f => 470 + CUP.bottom - f * CUP.H      // экранная y поверхности молока в стакане (пока стакан на месте)

    k.fromTo([pot, cup, jug], { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'back.out(1.6)' })
    await k.wait(800)

    // ── 0. рецепт ──
    await tell(pyx, 'hello', 'wave')
    const recipe = k.bubble(`<span style="display:flex;align-items:center;gap:8px"><span style="display:block;width:58px;height:82px">${tumblerSvg(0.75, 'kxr')}</span><span style="font:900 76px/1 var(--font);color:#3B2F4F">×2</span></span>`, 470, 300, { w: 290, h: 170, font: 70 })
    await tell(pyx, 'recipe', 'point')
    await tell(pyx, 'cup', 'point')

    // ── помощники налива ──
    let holding = false, spilling = false, overs = 0
    const goal = [0.62, 0.86]
    const tilt = on => gsap.to(jug, { x: on ? -104 : 0, y: on ? -112 : 0, rotation: on ? -32 : 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
    const wipe = async () => {
      const sp = k.food('sponge', 1000, 700, 150, { z: 12 })
      k.popIn(sp)
      for (let i = 0; i < 4; i++) { await k.play(gsap.to(sp, { x: i % 2 ? -70 : 70, duration: 0.3, ease: 'sine.inOut' })); k.sfx('scrub', { vol: 0.6 }) }
      await k.play(gsap.to(puddle, { scaleX: 0, scaleY: 0, duration: 0.35 }))
      await k.play(gsap.to(sp, { opacity: 0, scale: 0.2, duration: 0.25 }))
      sp.remove()
    }
    const spill = async () => {
      spilling = true; holding = false
      tilt(false); hideStream()
      overs++
      k.sfx('splash')
      setCup(1)
      gsap.to(puddle, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.6)' })
      const drain = { f: 1 }
      k.to(drain, { f: 0, duration: 0.6, ease: 'power1.in', onUpdate: () => setCup(drain.f) })
      await tell(pyx, overs === 1 ? 'over' : 'slow', overs === 1 ? 'surprised' : 'point')
      await wipe()
      if (overs >= 2) { goal[0] = 0.54; goal[1] = 0.9 } // после двух переливов чуть щедрее допуск
      spilling = false
    }
    const doHold = prompt => k.hold(jug, {
      duration: 3.2, goal, prompt: prompt ? k.key(prompt) : null, host: pyx,
      onStart: () => { if (!spilling) { holding = true; tilt(true) } },
      onLevel: p => {
        if (spilling) return
        setCup(F_(p))
        if (holding && p > 0.005) showStream(1010, 440, SURF(F_(p))); else hideStream()
      },
      onRelease: () => { holding = false; tilt(false); hideStream() },
      onMiss: p => { if (p > 0.15) tell(pyx, 'more') },
      onOver: () => { spill() },
    })
    // стакан → кастрюля
    const potMilk = pot.querySelector('.pm')
    const pourToPot = async n => {
      await k.play(gsap.to(cup, { x: -210, y: -155, rotation: -85, duration: 0.7, ease: 'power2.inOut' }))
      const c = k.centerOf(cup)
      const rimX = c.x - 124, rimY = c.y - 11
      showStream(rimX + 4, rimY + 6, 566)
      k.sfx('pour', { vol: 1 })
      const f0 = F_(goal[0] * 0.5 + goal[1] * 0.5)
      const dr = { f: f0 }
      const rx0 = (n - 1) * 52, ry0 = (n - 1) * 9
      k.to(dr, { f: 0, duration: 1.1, ease: 'power1.inOut', onUpdate: () => setCup(dr.f) })
      k.to(potMilk, { attr: { rx: n * 52 + (n === 2 ? 0 : 0), ry: n * 8.5 }, duration: 1.1, ease: 'power1.inOut' })
      await k.wait(1150)
      hideStream()
      k.sfx('plop')
      await k.play(gsap.to(cup, { x: 0, y: 0, rotation: 0, duration: 0.6, ease: 'power2.inOut' }))
    }
    const badge = n => k.badge(String(n), 690, 400, { size: 110, color: '#62C6FF' })

    // ── 1. первый стакан (учимся) ──
    await doHold('q_pour1')
    setCup(F_((goal[0] + goal[1]) / 2))
    k.burst(1000, 470, 8)
    await tell(pyx, 'ok1', 'jump')
    await pourToPot(1)
    const b1 = badge(1)
    await tell(pyx, 'one', 'happy')

    // ── 2. второй стакан ──
    await doHold('q_pour2')
    setCup(F_((goal[0] + goal[1]) / 2))
    k.burst(1000, 470, 8)
    await pourToPot(2)
    b1.textContent = '2'
    gsap.fromTo(b1, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: 'back.out(2.4)' })
    await tell(pyx, 'two', 'jump')
    recipe.remove()
    k.burst(690, 500, 12)

    // ── 3. гости и счёт стаканов ──
    await k.play(gsap.to([cup, jug, stream, puddle], { opacity: 0, y: '+=60', duration: 0.4 }))
    await k.play(gsap.to([pot, b1], { x: -100, opacity: 0, duration: 0.4, ease: 'power2.in' }))
    ;[cup, jug, stream, puddle, pot, b1].forEach(e => e.remove())
    const busya = k.guest('busya', 1290, k.layout.floorY, { size: 260, face: 'left', z: 11 })
    const hamster = k.guest('shchyok', 1490, k.layout.floorY, { size: 260, face: 'left', z: 12 })
    gsap.set([busya.el, hamster.el], { x: 400, opacity: 0 })
    k.sfx('whoosh')
    gsap.to([busya.el, hamster.el], { x: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.4)' })
    await tell(pyx, 'guests', 'surprised')
    await tell(busya, 'busya_hi', 'happy')
    await tell(hamster, 'shchyok_hi', 'happy')

    const GX = [640, 800, 960]
    const glasses = GX.map((x, i) => {
      const el = k.prop(tumblerSvg(0, 'kxg' + i), x, 610, 130, 186, { z: 7 })
      return { el, x }
    })
    k.popIn(glasses.map(g => g.el), 0.12)
    await k.wait(700)
    await k.tapAll(glasses.map(g => g.el), {
      prompt: k.key('q_count'), host: pyx,
      onTap: (el, i, left) => {
        gsap.fromTo(el, { scale: 1.25 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.4,0.4)' })
        const badgeN = k.badge(String(3 - left), k.centerOf(el).x, k.centerOf(el).y - 150, { size: 84, color: '#FFD93D' })
        k.after(1600, () => badgeN.remove())
        k.sayNumber(3 - left)
      },
    })
    await k.wait(400)
    await tell(pyx, 'three', 'point')

    // ── 4. больше / меньше ──
    const fillGlass = (g, f) => { const o = { f: 0 }; k.sfx('pour', { vol: 0.7 }); return k.play(gsap.to(o, { f, duration: 0.9, ease: 'power1.inOut', onUpdate: () => setMilk(g.el, o.f, TUM) })) }
    const opts = (hi, lo, wrongSay, wrongWho) => k.shuffle([
      { id: 'hi', art: tumblerSvg(0.88, 'kxh'), color: '#62C6FF', correct: hi },
      { id: 'lo', art: tumblerSvg(0.2, 'kxl'), color: '#FFB938', correct: lo },
    ]).map(o => ({ ...o, outcome: o.correct ? null : async () => { k.sfx('wrong', { vol: 0.5 }); await tell(wrongWho, wrongSay, 'shake') } }))

    // Щёчкину — много
    {
      const o = opts(true, false, 'more_wrong', hamster)
      o.find(x => x.correct).outcome = async () => { await fillGlass(glasses[2], 0.88); k.sparkle(glasses[2].x, 560, 5); await tell(pyx, 'more_ok', 'happy') }
      await tell(hamster, 'q_more', 'happy')
      await k.choose({ prompt: null, host: hamster, options: o })
    }
    // Бусе — мало
    {
      const o = opts(false, true, 'less_wrong', busya)
      o.find(x => x.correct).outcome = async () => { await fillGlass(glasses[1], 0.2); k.sparkle(glasses[1].x, 600, 5); await tell(pyx, 'less_ok', 'happy') }
      await tell(busya, 'q_less', 'happy')
      await k.choose({ prompt: null, host: busya, options: o })
    }
    await fillGlass(glasses[0], 0.55)

    // ── 5. вывод ──
    k.burst(800, 520, 12)
    await tell(pyx, 'sum', 'point')
    await tell(hamster, 'bye', 'jump')
    k.burst(800, 420, 14)
  },
})
