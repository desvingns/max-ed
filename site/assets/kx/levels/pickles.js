// «Солёные огурчики» — моем огурцы (потереть), укладываем в банку с укропом и чесноком (перетащить), делаем рассол
// (две ложки соли, размешать, налить), крышку закручивает взрослый, календарь: три дня — огурчики оливковеют, хрум-проба.
import { defineLevel } from '../lib.js'
import { INK, svg, P, L, E, R, HL, SH, S, ellipsePath, nid } from '../art.js'

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v))

// ───────────────────────── банка ─────────────────────────
const OUTER = 'M64 28L216 28L220 58Q272 80 270 138L270 352Q270 372 248 372L32 372Q10 372 10 352L10 138Q8 80 60 58Z'
const CLIPJ = 'polygon(74px 40px,206px 40px,210px 66px,250px 90px,258px 140px,258px 350px,246px 362px,34px 362px,22px 350px,22px 140px,30px 90px,70px 66px)'
const jarBackArt = () => svg(280, 380, SH(140, 374, 118, 9) + `<path d="${OUTER}" fill="#EAF6FF" opacity=".8"/>`)
const jarFrontHTML = () => `<div style="position:relative;width:100%;height:100%;pointer-events:none">
  <div style="position:absolute;inset:0;clip-path:${CLIPJ}"><div class="brine" style="position:absolute;left:0;right:0;bottom:18px;height:0;background:linear-gradient(rgba(196,236,255,.4),rgba(140,208,255,.46));border-top:6px solid rgba(255,255,255,.7)"></div></div>
  <div style="position:absolute;inset:0">${svg(280, 380,
    `<path d="${OUTER}" fill="none" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
    L('M60 74Q22 96 24 150L26 330', '#fff', 10, 'opacity=".55"') + L('M246 100L244 250', '#fff', 6, 'opacity=".35"') + L('M70 60L210 60', '#C9DFF0', 4))}</div>
</div>`
const lidArt = () => svg(190, 56,
  R(4, 14, 182, 36, 12, '#FFC93D', { sw: 6 }) + R(24, 4, 142, 18, 8, '#FFD95E', { sw: 5 }) +
  [30, 56, 82, 108, 134, 160].map(x => L(`M${x} 24L${x} 44`, '#E5A20E', 4)).join('') + HL(50, 26, 22, 4, -4, 0.7))

// ───────────────────────── стакан для рассола ─────────────────────────
const GW = 280, GH = 380
const BODY = 'M20 30L260 30L238 348Q236 366 218 366L62 366Q44 366 42 348Z'
const INNER = 'M28 36L252 36L232 348Q230 358 216 358L64 358Q50 358 48 348Z'
const CLIP = 'polygon(28px 36px,252px 36px,232px 348px,216px 358px,64px 358px,48px 348px)'
const glassHTML = () => {
  const id = nid('g')
  return `<div style="position:relative;width:100%;height:100%">
  <div style="position:absolute;inset:0">${svg(GW, GH,
    `<clipPath id="${id}"><path d="${INNER}"/></clipPath>` + SH(140, 368, 112, 9) +
    `<path d="${BODY}" fill="#EAF6FF" opacity=".85"/>` +
    `<g clip-path="url(#${id})"><rect class="wt" x="0" y="100" width="280" height="280" fill="#A9DCFF"/><rect class="ws" x="0" y="100" width="280" height="14" fill="#D3EEFF"/></g>`)}</div>
  <div class="gl-fx" style="position:absolute;inset:0;clip-path:${CLIP}"></div>
  <div style="position:absolute;inset:0;pointer-events:none">${svg(GW, GH,
    `<path d="${BODY}" fill="none" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
    L('M50 70L62 330', '#fff', 10, 'opacity=".55"') + L('M226 60L216 190', '#fff', 6, 'opacity=".35"'))}</div>
</div>`
}
const saltSpoon = () => svg(90, 260,
  P('M38 100L52 100L55 246Q55 256 45 256Q35 256 35 246Z', '#DDE6F2', { sw: 5 }) +
  S(ellipsePath(45, 62, 36, 54), '#EEF3FA', '#B8C0CC') +
  `<g class="pile">` + P('M14 68Q45 8 76 68Q45 80 14 68Z', '#FFFFFF', { sw: 4, ink: '#8FB0CC' }) +
  [[36, 46], [52, 40], [44, 58], [60, 56], [30, 60]].map(([x, y]) => R(x - 5, y - 5, 10, 10, 2, '#fff', { sw: 2.5, ink: '#8FB0CC', rot: x * 3 })).join('') + `</g>`)
const stirSpoonArt = () => svg(50, 340,
  P('M20 6L30 6L32 292L18 292Z', '#E2B78A', { sw: 4 }) + S(ellipsePath(25, 308, 21, 28), '#D9A56A', '#B98444', { sw: 4 }))

// ───────────────────────── тазик, календарь ─────────────────────────
const tubArt = () => svg(760, 240,
  SH(380, 232, 340, 10) +
  S('M20 66L740 66L712 214Q708 228 692 228L68 228Q52 228 48 214Z', '#62C6FF', '#3FA2F4') +
  E(380, 70, 350, 30, '#BDE6FF') + E(380, 74, 300, 18, '#A0DAFF', { sw: 0 }) +
  [[120, 84, 16], [200, 92, 11], [560, 88, 14], [640, 80, 10], [300, 100, 9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".8" stroke="#8FD0FF" stroke-width="3"/>`).join('') +
  HL(90, 150, 8, 40, 8, 0.5))
const calHTML = () => `<div style="position:relative;width:100%;height:100%">${svg(200, 240,
  SH(100, 234, 84, 6) + R(10, 20, 180, 208, 18, '#fff', { sw: 6 }) + P('M10 38Q10 20 28 20L172 20Q190 20 190 38L190 74L10 74Z', '#FF5A5F', { sw: 6 }) +
  `<circle cx="56" cy="20" r="10" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="144" cy="20" r="10" fill="#fff" stroke="${INK}" stroke-width="5"/>`)}
  <div class="cal-n" style="position:absolute;left:0;right:0;top:78px;height:140px;display:grid;place-items:center;font:900 112px/1 var(--font);color:#3B2F4F"></div>
  <div class="cal-w" style="position:absolute;left:0;right:0;top:32px;text-align:center;font:900 30px/1 var(--font);color:#fff;letter-spacing:2px">день</div></div>`

export const ART = { jarBackArt, jarFrontHTML, lidArt, tubArt, calHTML }

export default defineLevel({
  id: 'pickles',
  async run(k) {
    const gsap = k.gsap
    k.bgTable({ wall: '#F4FBE6', dot: '#E0F1C0', cloth: '#B7DD6B', cloth2: '#D2EC9A' })
    const pyx = k.pyx({ x: 230 })
    const ham = k.guest('shchyok', 1425, 705, { size: 320 })
    const bar = k.stepsBar(['🧼', '🥒', '🧂', '🔒', '📅', '😋'])
    {
      // обход бага ui.stepsBar: gsap.from(stagger) + CSS-transition на transform → иконки 3–6 «застревают» над экраном.
      const its = [...bar.el.children]
      gsap.killTweensOf(its)
      gsap.fromTo(its, { y: -120 }, { y: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.06, onComplete: () => its.forEach(i => { i.style.transform = '' }) })
    }
    const night = k.prop('<div style="width:100%;height:100%;background:#1B2B6B"></div>', 800, 500, 1600, 1000, { z: 55 })
    night.style.pointerEvents = 'none'
    gsap.set(night, { opacity: 0 })
    const mama = async (text, id, emote) => {
      const b = k.bubble('👩‍🍳', 300, 255, { w: 230, h: 190, tail: 'left', font: 100 })
      k.sfx('magic', { vol: 0.5 })
      await k.tell(pyx, id, emote)
      return () => k.to(b, { scale: 0, opacity: 0, duration: 0.25, onComplete: () => b.remove() })
    }

    await k.wait(300)
    bar.set(0)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(ham, 'hi', 'happy')

    // ── 1. моем огурцы ──
    const tub = k.prop(tubArt(), 800, 730, 760, 240, { z: 4 })
    k.popIn(tub)
    const CX = [590, 800, 1010]
    const cucs = CX.map((x, i) => {
      const el = k.food('cucumber', x, 668, 210, { z: 6 })
      gsap.set(el, { rotation: [-7, 4, -3][i] })
      const dirt = []
      for (let j = 0; j < 9; j++) {
        const d = document.createElement('div')
        const r = 7 + Math.random() * 8
        d.style.cssText = `position:absolute;left:${10 + Math.random() * 80}%;top:${18 + Math.random() * 58}%;width:${r}px;height:${r * 0.8}px;border-radius:50%;background:#7A5A3A;opacity:.9;pointer-events:none`
        d._t = Math.random() * 0.6
        el.appendChild(d); dirt.push(d)
      }
      el._dirt = dirt
      return el
    })
    k.popIn(cucs, 0.12)
    await k.wait(700)
    let lastB = 0
    await k.scrub(tub, {
      need: 1500, prompt: k.key('q_wash'), host: pyx, sfx: 'bloop',
      onProgress: (p, pos) => {
        cucs.forEach(c => c._dirt.forEach(d => { d.style.opacity = String(0.9 * (1 - clamp((p - d._t) / 0.3))) }))
        const now = performance.now()
        if (pos && now - lastB > 90) {
          lastB = now
          const r = k.rand(20, 44)
          const b = k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:rgba(255,255,255,.7);box-shadow:inset 0 0 0 4px #8FD0FF"></div>`, pos.x + k.rand(-30, 30), pos.y - 10, r, r, { z: 20 })
          b.style.pointerEvents = 'none'
          k.to(b, { y: -k.rand(60, 130), opacity: 0, scale: 1.3, duration: 0.8, ease: 'power1.out', onComplete: () => b.remove() })
        }
      },
    })
    cucs.forEach(c => c._dirt.forEach(d => { d.style.opacity = '0' }))
    k.sfx('ding')
    cucs.forEach(c => k.sparkle(k.centerOf(c).x, k.centerOf(c).y, 3))
    bar.done(0); bar.set(1)
    await k.tell(pyx, 'clean', 'cheer')

    // ── 2. укладываем в банку ──
    const jarBack = k.prop(jarBackArt(), 800, 520, 280, 380, { z: 5 })
    const jarFront = k.prop(jarFrontHTML(), 800, 520, 280, 380, { z: 9 })
    const brine = jarFront.querySelector('.brine')
    gsap.fromTo([jarBack, jarFront], { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' })
    k.to(tub, { opacity: 0, y: 40, duration: 0.4, onComplete: () => tub.remove() })
    await k.wait(300)
    const ROW = [250, 470, 690]
    await k.play(gsap.to(cucs, { x: (i) => ROW[i] - CX[i], y: 850 - 668, rotation: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)' }))
    const dill = k.food('dill', 890, 850, 90, { z: 8 }), garlic = k.food('garlic', 1030, 850, 80, { z: 8 })
    k.popIn([dill, garlic], 0.15)
    await k.tell(pyx, 'pack', 'point')
    const JX = 660, JY = 330
    const slot = { cuc: [[70, 232, -93], [140, 232, -88], [210, 232, -92]], dill: [196, 165, 14], garlic: [208, 322, 0] }
    const items = [
      ...cucs.map((el, i) => ({ id: `c${i}`, kind: 'cuc', i, el })),
      { id: 'dill', kind: 'dill', el: dill }, { id: 'garlic', kind: 'garlic', el: garlic },
    ]
    let nCuc = 0
    await k.dnd({
      items, zones: [{ id: 'jar', el: jarBack }], accept: () => true,
      prompt: k.key('q_pack'), host: pyx,
      onCorrect: async it => {
        const s = it.kind === 'cuc' ? slot.cuc[it.i] : slot[it.kind]
        it.el.style.zIndex = '7'
        const c = k.centerOf(it.el)
        k.sfx('plop')
        await k.play(gsap.to(it.el, { x: `+=${JX + s[0] - c.x}`, y: `+=${JY + s[1] - c.y}`, rotation: s[2], scale: it.kind === 'cuc' ? 1.12 : 1, duration: 0.5, ease: 'back.out(1.3)' }))
        if (it.kind === 'cuc') await k.sayNumber(++nCuc)
        else await k.tell(ham, it.kind === 'dill' ? 'dill_ok' : 'garlic_ok', 'happy')
      },
    })
    bar.done(1); bar.set(2)
    await k.tell(pyx, 'packed', 'cheer')

    // ── 3. рассол: две ложки соли, размешать, проба, залить ──
    await k.tell(pyx, 'brine', 'point')
    const S1 = 0.62
    const glass = k.prop(glassHTML(), 1070, 650, GW, GH, { z: 6 })
    gsap.fromTo(glass, { scale: 0, opacity: 0 }, { scale: S1, opacity: 1, duration: 0.5, ease: 'back.out(2.2)' })
    const fx = glass.querySelector('.gl-fx'), waterEls = [...glass.querySelectorAll('.wt, .ws')]
    const grains = []
    const gMouth = () => { const c = k.centerOf(glass); return { x: c.x, y: c.y + (36 - GH / 2) * S1 } }
    const dropGrains = n => {
      for (let i = 0; i < n; i++) {
        const d = document.createElement('div')
        d.style.cssText = 'position:absolute;left:0;top:0;width:12px;height:12px;border-radius:2px;background:#fff;box-shadow:0 0 0 2px #B9D3E6'
        fx.appendChild(d)
        d._rx = 74 + Math.random() * 132; d._ry = 336 - Math.random() * 14
        d._d = Math.random() * 0.5; d._ph = Math.random() * 6.28; d._h = 0.35 + Math.random() * 0.65
        gsap.set(d, { x: 140 + k.rand(-24, 24), y: 20, rotation: k.rand(-40, 40) })
        k.to(d, { x: d._rx, y: d._ry, rotation: k.rand(-60, 60), duration: k.rand(1, 1.4), delay: i * 0.03, ease: 'power1.in' })
        grains.push(d)
      }
    }
    const spoon = k.prop(saltSpoon(), 1215, 540, 80, 232, { z: 10 })
    gsap.set(spoon, { rotation: 18 })
    k.popIn(spoon)
    await k.wait(600)
    const pile = spoon.querySelector('.pile')
    for (let i = 1; i <= 2; i++) {
      await k.tapN(spoon, 1, { prompt: i === 1 ? k.key('q_spoon') : k.key('q_more'), host: pyx })
      const c0 = k.centerOf(spoon), gm = gMouth()
      await k.play(gsap.to(spoon, { x: gm.x - 69 - c0.x, y: gm.y - 40 - c0.y, rotation: 100, duration: 0.5, ease: 'power2.out' }))
      k.sfx('sprinkle')
      gsap.to(pile, { opacity: 0, duration: 0.4 })
      dropGrains(14)
      await k.wait(600)
      await k.play(gsap.to(spoon, { x: 0, y: 0, rotation: 18, duration: 0.45, ease: 'back.out(1.5)' }))
      gsap.to(pile, { opacity: 1, duration: 0.3 })
      await k.sayNumber(i)
    }
    k.to(spoon, { opacity: 0, x: 60, duration: 0.3 })
    {
      const c = k.centerOf(glass)
      const sp = k.prop(stirSpoonArt(), c.x + 14 * S1, c.y - 30 * S1, 50 * S1 / 0.86, 340 * S1 / 0.86, { z: 13 })
      sp.style.opacity = 0
      await k.stir({ x: c.x, y: c.y + 20 }, {
        radius: 60, turns: 2, prompt: k.key('q_stir'), host: pyx,
        onProgress: (p, a) => {
          sp.style.opacity = 1
          gsap.set(sp, { x: Math.cos(a) * 20 * S1, y: Math.sin(a) * 6, rotation: Math.cos(a) * 6 })
          const lift = Math.sin(Math.min(1, p * 2) * Math.PI / 2)
          for (const d of grains) {
            const ang = p * 12 + d._ph, t = clamp((p - d._d) / 0.4)
            gsap.set(d, { x: d._rx + Math.cos(ang) * 40 * lift, y: d._ry - 130 * lift * d._h + Math.sin(ang) * 16 * lift, opacity: 1 - t, scale: 1 - 0.7 * t })
          }
        },
      })
      k.to(sp, { opacity: 0, y: -30, duration: 0.3, onComplete: () => sp.remove() })
      grains.forEach(d => d.remove()); grains.length = 0
      k.sparkle(c.x, c.y, 6)
    }
    // проба Щёчкина: ложечка сама едет к нему
    {
      const ts = k.prop(saltSpoon(), 1215, 540, 60, 174, { z: 14 })
      ts.querySelector('.pile')?.remove()
      gsap.set(ts, { rotation: 25 })
      const c0 = k.centerOf(ts), gc = k.centerOf(glass)
      await k.play(gsap.to(ts, { x: gc.x - c0.x + 10, y: gc.y - c0.y - 30, rotation: 0, duration: 0.6, ease: 'power2.inOut' }))
      k.sfx('bloop')
      const m = { x: 1425, y: 705 - 0.41 * 320 }
      await k.play(gsap.to(ts, { x: m.x - c0.x - 10, y: m.y - c0.y + 40, rotation: 12, duration: 0.7, ease: 'power2.inOut' }))
      k.sfx('yum', { vol: 0.5 })
      ham.emote('surprised')
      await k.tell(ham, 'taste')
      k.to(ts, { opacity: 0, duration: 0.3, onComplete: () => ts.remove() })
    }
    // заливаем: держим стакан
    const g0 = k.centerOf(glass)
    const jm = { x: JX + 140, y: JY + 26 } // горлышко банки
    let lastD = 0
    await k.hold(glass, {
      duration: 2.6, prompt: k.key('q_pour'), host: pyx,
      onLevel: p => {
        const tp = clamp(p * 5)
        gsap.set(glass, { x: (jm.x + 94 - g0.x) * tp, y: (jm.y - 16 - g0.y) * tp, rotation: -100 * tp })
        brine.style.height = `${284 * clamp((p - 0.1) / 0.9)}px`
        waterEls.forEach(w => w.setAttribute('y', String(100 + 258 * clamp((p - 0.1) / 0.9))))
        const now = performance.now()
        if (tp > 0.9 && p < 1 && now - lastD > 70) {
          lastD = now
          const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#8FD0FF;box-shadow:0 0 0 2px #fff"></div>', jm.x + k.rand(-20, 20), jm.y - 10, 12, 12, { z: 20 })
          d.style.pointerEvents = 'none'
          k.to(d, { y: 130, opacity: 0.2, duration: 0.35, ease: 'power1.in', onComplete: () => d.remove() })
        }
      },
    })
    brine.style.height = '284px'
    k.sfx('splash', { vol: 0.5 })
    k.to(glass, { opacity: 0, duration: 0.4, onComplete: () => glass.remove() })
    await k.tell(pyx, 'poured', 'cheer')
    bar.done(2); bar.set(3)

    // ── 4. крышку закручивает взрослый ──
    const lid = k.prop(lidArt(), 1150, 260, 190, 56, { z: 10 })
    k.popIn(lid)
    const off = await mama('👩‍🍳', 'lid', 'point')
    {
      const c0 = k.centerOf(lid)
      await k.play(gsap.to(lid, { x: 800 - c0.x, y: JY + 22 - c0.y, rotation: 720, duration: 0.9, ease: 'power2.inOut' }))
      k.sfx('clonk')
      k.sparkle(800, JY + 22, 5)
    }
    off()
    bar.done(3); bar.set(4)

    // ── 5. календарь: три дня ──
    const cal = k.prop(calHTML(), 1120, 400, 200, 240, { z: 10 })
    k.popIn(cal)
    const num = cal.querySelector('.cal-n')
    await k.tell(pyx, 'wait', 'point')
    cucs.forEach(c => { c.style.filter = 'hue-rotate(0deg) saturate(1) brightness(1)' })
    const FIL = ['hue-rotate(-20deg) saturate(.95) brightness(.98)', 'hue-rotate(-40deg) saturate(.9) brightness(.92)', 'hue-rotate(-58deg) saturate(.85) brightness(.86)']
    const day = async n => {
      const tl = k.timeline()
      tl.to(cal, { rotationX: 90, duration: 0.2, transformPerspective: 500 })
        .call(() => { num.textContent = String(n) })
        .to(cal, { rotationX: 0, duration: 0.25, ease: 'back.out(2)' })
        .to(night, { opacity: 0.45, duration: 0.5 }, 0.2)
        .to(night, { opacity: 0, duration: 0.5 }, 1.1)
      k.sfx('page')
      k.to(cucs, { filter: FIL[n - 1], duration: 1.6, delay: 0.3 })
      await k.play(tl)
    }
    for (let n = 1; n <= 3; n++) {
      await k.tapN(cal, 1, { prompt: n === 1 ? k.key('q_cal') : null, host: pyx })
      const d = day(n)
      await k.sayNumber(n)
      await k.tell(pyx, `d${n}`, n === 3 ? 'cheer' : 'nod')
      await d
    }
    bar.done(4); bar.set(5)
    await k.tell(pyx, 'why', 'point')

    // ── 6. хрум-проба ──
    k.to(cal, { opacity: 0, x: 80, duration: 0.4 })
    const off2 = await mama('👩‍🍳', 'open', 'point')
    {
      const c0 = k.centerOf(lid)
      await k.play(gsap.to(lid, { y: `-=90`, x: `+=120`, rotation: '+=200', opacity: 0, duration: 0.6, ease: 'power2.out' }))
      k.sfx('pop')
      const pk = k.food('cucumber', 800, 470, 200, { z: 30 })
      pk.style.filter = FIL[2]
      gsap.set(pk, { rotation: -80 })
      k.popIn(pk)
      await k.wait(300)
      const m = { x: 1425, y: 705 - 0.41 * 320 }, pc = k.centerOf(pk)
      ham.setMouth(1)
      await k.play(gsap.to(pk, { x: m.x - pc.x, y: m.y - pc.y, rotation: -10, scale: 0.35, duration: 0.8, ease: 'power2.inOut' }))
      pk.remove()
      ham.setMouth(0)
    }
    off2()
    k.sfx('crunch')
    ham.emote('happy')
    await k.tell(ham, 'crunch', 'happy')
    await k.tell(pyx, 'sum', 'cheer')
    await k.tell(ham, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
