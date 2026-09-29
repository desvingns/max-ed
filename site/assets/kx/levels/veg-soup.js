// «Овощной суп» — из корзины берём только овощи (конфеты и мороженое — смешные «не то»), они уже нарезаны,
// кладём в воду, плита включается со взрослым, варим и мешаем половником, солим по щепотке, пробует Щёчкин,
// разливаем по трём мискам поровну.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, F, E, C, L, HL, SH, S, R, circlePath } from '../art.js'

const thumb = name => `<div style="width:56px;height:56px">${food(name)}</div>`

// Обход бага ui.stepsBar: у .kx-step стоит transition:transform, из-за чего gsap.from запоминает «промежуточную» позицию
// и поздние иконки навсегда съезжают вверх. Через секунду сбрасываем inline-transform (заодно оживает .now{scale}).
const stepsBar = (k, icons, o) => { const b = k.stepsBar(icons, o); k.after(1300, () => k.gsap.set([...b.el.children], { clearProps: 'transform' })); return b }

// ── свои спрайты ──
const candyArt = () => svg(140, 100,
  SH(70, 94, 46, 5) +
  P('M34 40L12 24L12 76L34 60Z', '#FFD93D', { sw: 4 }) + P('M106 40L128 24L128 76L106 60Z', '#FFD93D', { sw: 4 }) +
  S(circlePath(70, 50, 38), '#FF8FC8', '#E8629E', { extra: '<path d="M40 24Q70 50 40 78M62 12Q92 50 62 88M90 16Q110 50 90 84" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".75"/>' }) +
  HL(52, 34, 12, 5, -35, 0.7))
const iceCreamArt = () => svg(110, 190,
  SH(55, 186, 32, 5) +
  P('M20 98L90 98L55 182Z', '#E6A462', { sw: 5 }) + L('M30 110L66 150M52 100L76 130M74 100L40 148M60 100L34 128', '#B8763A', 4, 'opacity=".7"') +
  S(circlePath(55, 84, 36), '#FFB3D9', '#E886B8') + S(circlePath(55, 50, 31), '#FFF3C9', '#EBD8A0') +
  C(55, 20, 9, '#FF5A5F') + L('M55 12Q58 2 68 0', '#6BCB77', 5) + HL(42, 40, 8, 5, -35, 0.8) + HL(38, 76, 9, 5, -35, 0.7))
const cabbagePieceArt = () => svg(110, 80,
  SH(55, 76, 40, 4) + S('M6 44C10 14 60 0 104 18C100 54 50 80 6 44Z', '#B7E88B', '#8FCB5E') +
  L('M14 44Q56 34 98 22M40 38L46 18M62 32L70 14', '#6FAE45', 4, 'opacity=".75"') + HL(34, 26, 12, 4, -20, 0.6))

// корзина: задняя стенка и передняя (закрывает низ овощей)
const basketBack = () => svg(1000, 190,
  R(20, 26, 960, 150, 36, '#D9A868') + R(34, 34, 932, 30, 14, '#8E5F33', { sw: 0 }) +
  L('M50 100H950M50 138H950', '#B98444', 5, 'opacity=".7"') + R(10, 10, 980, 30, 15, '#C68B59'))
const basketFront = () => svg(1000, 190,
  R(20, 86, 960, 90, 34, '#D9A868') + L('M50 122H950M50 152H950', '#B98444', 5, 'opacity=".7"') +
  [70, 190, 310, 430, 550, 670, 790, 910].map(x => L(`M${x} 110V132M${x + 60} 140V166`, '#B98444', 5, 'opacity=".55"')).join('') +
  R(10, 84, 980, 28, 14, '#C68B59') + HL(180, 96, 90, 4, 0, 0.5))

// «кусочки» в супе
const PIECES = {
  carrot: { html: () => food('carrotSlice'), w: 38, h: 38 },
  potato: { html: () => food('potatoSlice'), w: 38, h: 35 },
  cabbage: { html: () => cabbagePieceArt(), w: 44, h: 32 },
  onion: { html: () => food('onionRing'), w: 36, h: 36 },
}
const SPOTS = [[80, 82], [118, 78], [154, 76], [190, 78], [224, 84], [98, 91], [136, 90], [172, 91], [208, 92], [116, 84], [152, 85], [188, 85]] // локальные (в кастрюле) центры
const POT = { x: 570, y: 218 }

// ── речь и эмоции без наложений ──
// «Корневые» эмоции героя (ура, смех, прыжок…) нельзя запускать внахлёст: gsap путает SVG-origin'ы, и герой «уезжает» с экрана.
const ROOT_DUR = { cheer: 1.5, jump: 1.1, laugh: 1.0, dance: 1.8, happy: 0.85, surprised: 1.3, sad: 2.0, spin: 0.9, bow: 1.3 }
function speech(k) {
  const busy = new Map()
  const gate = async (c, d) => {
    const w = (busy.get(c) ?? 0) - performance.now()
    if (w > 0) await k.wait(w)
    busy.set(c, performance.now() + d * 1000)
  }
  const emote = async (c, e) => {
    if (!c || !e) return
    if (ROOT_DUR[e]) await gate(c, ROOT_DUR[e])
    if (k.alive) c.emote(e)
  }
  const tell = async (c, id, e) => { emote(c, e); await k.tell(c, id) }
  const praise = async c => { await gate(c, 1.1); await k.praise(c) }
  return { emote, tell, praise }
}

export default defineLevel({
  id: 'veg-soup',
  async run(k) {
    const g = k.gsap
    const { emote, tell, praise } = speech(k)
    const FLOOR = k.layout.floorY
    k.kitchenBg()
    const st = k.stove()
    const pot = k.prop(kitchen.pot({ lid: false }), 0, 0, 300, 230, { z: 6 })
    pot.querySelector('.kp-shadow')?.style.setProperty('visibility', 'hidden')
    k.onBurner(pot, 0, 300, 230)
    const potXY = i => ({ x: POT.x + SPOTS[i][0], y: POT.y + SPOTS[i][1] })
    const water = pot.querySelector('.water')
    const waterPath = water?.querySelector('path')
    const pyx = k.pyx({ x: 230 })
    const hamster = k.guest('shchyok', 1440, FLOOR, { size: 260, face: 'left' })
    const fadeAway = (els, y = 80) => { g.to(els, { y: `+=${y}`, opacity: 0, duration: 0.4, ease: 'power2.in' }); k.after(450, () => els.forEach(e => e.remove())) }
    const inPot = (html, l, t, w, h, css = '') => {
      const d = document.createElement('div')
      d.style.cssText = `position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;${css}`
      d.innerHTML = html
      pot.appendChild(d)
      return d
    }
    const splash = (x, y, n = 6, color = '#62C6FF') => {
      for (let i = 0; i < n; i++) {
        const d = k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:${color};box-shadow:inset -2px -2px 0 rgba(0,0,0,.12)"></div>`, x + k.rand(-30, 30), y, 12, 12, { z: 20 })
        k.to(d, { x: k.rand(-50, 50), y: -k.rand(20, 60), duration: 0.25, ease: 'power2.out' })
        k.to(d, { y: '+=90', opacity: 0, duration: 0.35, delay: 0.25, ease: 'power1.in', onComplete: () => d.remove() })
      }
    }

    await k.wait(400)
    await tell(pyx, 'hello', 'wave')
    await tell(hamster, 'shchyok_hi', 'happy')
    const bar = stepsBar(k, ['🧺', '🔥', '🥄', thumb('saltShaker'), thumb('ladle')])
    bar.set(0)

    // ───── 1. корзина: выбираем овощи ─────
    const bBack = k.prop(basketBack(), 800, 850, 1000, 190, { z: 3 })
    const bFront = k.prop(basketFront(), 800, 850, 1000, 190, { z: 8 })
    bFront.style.pointerEvents = 'none'; bBack.style.pointerEvents = 'none'
    const XS = [390, 560, 730, 900, 1070, 1240]
    const defs = k.shuffle([
      { id: 'carrot', kind: 'veg', mk: (x, y) => k.food('carrot', x, y, 200, { z: 6 }), rot: -34 },
      { id: 'candy', kind: 'bad', mk: (x, y) => k.prop(candyArt(), x, y, 120, 86, { z: 6 }) },
      { id: 'potato', kind: 'veg', mk: (x, y) => k.food('potato', x, y, 150, { z: 6 }) },
      { id: 'cabbage', kind: 'veg', mk: (x, y) => k.food('cabbage', x, y, 140, { z: 6 }) },
      { id: 'icecream', kind: 'bad', mk: (x, y) => k.prop(iceCreamArt(), x, y, 80, 138, { z: 6 }) },
      { id: 'onion', kind: 'veg', mk: (x, y) => k.food('onion', x, y, 112, { z: 6 }) },
    ])
    const items = defs.map((d, i) => {
      const el = d.mk(XS[i], 806)
      if (d.rot) g.set(el, { rotation: d.rot })
      return { ...d, el, home: { x: XS[i], y: 806 } }
    })
    k.fromTo([bBack, ...items.map(i => i.el)], { y: 170, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'back.out(1.6)' })
    k.fromTo(bFront, { y: 170, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' })
    k.sfx('whoosh', { vol: 0.5 })
    await k.wait(900)

    // «не то»: конфета и мороженое — смешные реакции
    let reacting = Promise.resolve()
    let wrongTaps = 0
    for (const it of items.filter(i => i.kind === 'bad')) {
      it.el.style.cursor = 'pointer'
      it.el.style.touchAction = 'manipulation'
      k.on(it.el, 'pointerdown', () => {
        if (!k.alive) return
        reacting = reacting.then(async () => {
          wrongTaps++
          k.sfx('boing', { vol: 0.6 })
          if (it.id === 'candy') {
            g.fromTo(it.el, { y: 0 }, { y: -50, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' })
            emote(hamster, 'happy')
            await tell(hamster, 'candy')
          } else {
            g.fromTo(it.el, { scaleY: 1, scaleX: 1 }, { scaleY: 0.62, scaleX: 1.2, transformOrigin: '50% 100%', duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' })
            for (let i = 0; i < 5; i++) {
              const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#FFB3D9;box-shadow:inset -2px -2px 0 #E886B8"></div>', it.home.x + k.rand(-28, 28), it.home.y + 20, 14, 18, { z: 9 })
              k.to(d, { y: k.rand(50, 90), opacity: 0.2, duration: 0.7, delay: i * 0.1, ease: 'power1.in', onComplete: () => d.remove() })
            }
            emote(pyx, 'laugh')
            await tell(pyx, 'icecream')
          }
          if (wrongTaps === 2) await tell(pyx, 'veg_hint', 'point')
        })
      })
    }

    // овощи: нажимаем — «раз-раз-раз» и кусочки в кастрюлю
    const vegs = items.filter(i => i.kind === 'veg')
    const byEl = new Map(vegs.map(v => [v.el, v]))
    let taken = 0, spotN = 0
    const spotOrder = k.shuffle(SPOTS.map((_, i) => i))
    let speakQ = Promise.resolve()
    const toPot = v => {
      const c = k.centerOf(v.el)
      k.sfx('chop', { vol: 0.5 })
      k.sparkle(c.x, c.y, 5)
      g.to(v.el, { scale: 1.25, duration: 0.16, ease: 'power2.out' })
      g.to(v.el, { scale: 0, opacity: 0, duration: 0.2, delay: 0.16, ease: 'back.in(2)' })
      const P0 = PIECES[v.id]
      for (let n = 0; n < 3; n++) {
        const spot = spotOrder[spotN++ % spotOrder.length]
        const tgt = potXY(spot)
        const el = k.prop(P0.html(), c.x + k.rand(-25, 25), c.y + k.rand(-20, 10), P0.w, P0.h, { z: 15 })
        g.set(el, { scale: 0.3, rotation: k.rand(-60, 60) })
        const dx = tgt.x - k.centerOf(el).x, dy = tgt.y - 6 - k.centerOf(el).y
        const tl = g.timeline({ delay: 0.25 + n * 0.12 })
        tl.to(el, { scale: 1, duration: 0.15 }, 0)
          .to(el, { x: dx, duration: 0.6, ease: 'power1.inOut' }, 0)
          .to(el, { y: dy - 130, duration: 0.3, ease: 'power2.out' }, 0)
          .to(el, { y: dy, duration: 0.3, ease: 'power2.in' }, 0.3)
          .call(() => { splash(tgt.x, tgt.y, 3); k.sfx('plop', { vol: 0.5 }) })
          .to(el, { y: `+=${-4}`, rotation: `+=${n % 2 ? 14 : -14}`, duration: 0.8 + n * 0.1, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        v.pieces = [...(v.pieces ?? []), { el, spot }]
      }
      speakQ = speakQ.then(() => tell(pyx, v.id))
    }
    await k.tapAll(vegs.map(v => v.el), {
      prompt: k.key('basket'), host: pyx,
      onTap: el => { taken++; toPot(byEl.get(el)) },
    })
    await speakQ
    await reacting
    await tell(pyx, 'count4', 'cheer')
    // конфеты и мороженое — на потом, корзина уезжает
    const bads = items.filter(i => i.kind === 'bad').map(i => i.el)
    await tell(pyx, 'dessert', 'laugh')
    fadeAway([bBack, bFront, ...bads], 120)
    await tell(pyx, 'cut_note', 'point')

    // ───── 2. плита — только со взрослым ─────
    bar.set(1)
    const knob = st.knobEl(0)
    await k.adultHelp({ knob, host: pyx })
    st.on(0)
    const tiny = k.every(190, () => {
      const x = 150 + k.rand(-84, 84), y = 80 + k.rand(-4, 6)
      const s = k.rand(7, 14)
      const b = inPot('<div style="width:100%;height:100%;border-radius:50%;background:rgba(255,255,255,.85);box-shadow:0 0 0 2px #7FBFE8"></div>', x - s / 2, y - s / 2, s, s, 'z-index:3;pointer-events:none')
      g.fromTo(b, { scale: 0 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' })
      g.to(b, { y: -k.rand(6, 16), opacity: 0, duration: 0.5, delay: 0.3, onComplete: () => b.remove() })
    })
    await tell(pyx, 'warm', 'point')
    for (const b of pot.querySelectorAll('.bubble')) {
      g.to(b, { opacity: 1, duration: 0.3, delay: 0.2 })
      g.to(b, { y: -k.rand(8, 16), duration: k.rand(0.3, 0.5), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: k.rand(0, 0.3) })
    }
    k.sfx('bubble')
    const puffs = [0, 1, 2].map(i => {
      const p = inPot(kitchen.steam(), 60 + i * 30, -60, 130, 94, 'z-index:5;pointer-events:none;opacity:0')
      const tl = g.timeline({ repeat: -1, delay: i * 0.8 })
      tl.fromTo(p, { y: 0, opacity: 0, scale: 0.5 }, { y: -34, opacity: 0.9, scale: 0.85, duration: 1.1, ease: 'none' })
        .to(p, { y: -80, opacity: 0, scale: 1.15, duration: 1.1, ease: 'none' })
      return tl
    })

    // ───── 3. мешаем половником ─────
    bar.set(2)
    const ladle = k.food('ladle', 720, 200, 78, { z: 25 })
    g.set(ladle, { rotation: 180, opacity: 0 })
    g.to(ladle, { opacity: 1, duration: 0.3 })
    // «суп» в половнике (пятно в чашке, видно при зачерпывании)
    const blob = document.createElement('div')
    blob.style.cssText = 'position:absolute;left:24px;top:57px;width:30px;height:18px;border-radius:50%;background:#FFB45C;box-shadow:inset -3px -2px 0 #F29A3A;opacity:0'
    ladle.appendChild(blob)
    let sst = 0
    const potPieces = vegs.flatMap(v => v.pieces ?? [])
    const shufflePieces = () => {
      const spots = k.shuffle(SPOTS.map((_, i) => i))
      potPieces.forEach((p, i) => {
        p.spot = spots[i % spots.length]
        const t = potXY(p.spot)
        const c = k.centerOf(p.el)
        g.to(p.el, { x: `+=${t.x - c.x}`, y: `+=${t.y - 6 - c.y}`, duration: 0.45, ease: 'power2.inOut', overwrite: 'auto' })
      })
    }
    await k.stir({ x: 720, y: 302 }, {
      radius: 70, turns: 2, prompt: k.key('q_stir'), host: pyx, spoon: ladle,
      moveSpoon: (x, y, a) => g.set(ladle, { x: x - 720, y: y - 31 - 200 + 4, rotation: 180 + Math.cos(a) * 8 }),
      onProgress: p => { const s = Math.floor(p * 4); if (s > sst && p < 1) { sst = s; shufflePieces() } },
    })
    // вода становится золотистым бульоном
    if (waterPath) g.to(waterPath, { attr: { fill: '#FFC069' }, duration: 1.2 })
    shufflePieces()
    g.to(ladle, { x: 0, y: -60, rotation: 180, duration: 0.5, ease: 'power2.inOut' })
    k.sparkle(720, 300, 8)
    k.sfx('sparkle')
    await tell(pyx, 'stir_ok', 'cheer')

    // ───── 4. пробуем — соли не хватает ─────
    bar.set(3)
    const spoon = k.prop(kitchen.spoonWood(), 1120, 590, 60, 200, { z: 8 })
    spoon.style.transform = 'rotate(35deg)'
    const taste = async (lineId, em) => {
      const from = k.centerOf(spoon), mouth = { x: 1400, y: 805 }
      await k.play(g.to(spoon, { x: mouth.x - from.x, y: mouth.y - from.y, rotation: 10, duration: 0.6, ease: 'power2.inOut' }))
      k.sfx('yum', { vol: 0.5 })
      emote(hamster, em)
      await tell(hamster, lineId)
      await k.play(g.to(spoon, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'power2.inOut' }))
    }
    k.popIn(spoon)
    await k.wait(400)
    await taste('taste1', 'think')

    const shaker = k.food('saltShaker', 1130, 400, 110, { z: 12 })
    k.popIn(shaker)
    await k.tapN(shaker, 1, { prompt: k.key('q_salt'), host: pyx })
    k.sfx('sprinkle')
    await k.play(g.to(shaker, { x: -380, y: -60, rotation: -140, duration: 0.4, ease: 'power2.out' }))
    for (let i = 0; i < 12; i++) {
      const gr = k.prop('<div style="width:100%;height:100%;background:#fff;border-radius:2px;box-shadow:0 0 0 2px #C9DFF0"></div>', 730 + k.rand(-30, 30), 250, 9, 9, { z: 15 })
      k.to(gr, { y: k.rand(40, 70), x: k.rand(-20, 20), opacity: 0, duration: 0.5, delay: i * 0.03, ease: 'power1.in', onComplete: () => gr.remove() })
    }
    await k.wait(600)
    fadeAway([shaker], -60)
    await tell(pyx, 'salt_ok', 'cheer')
    await taste('taste2', 'laugh')
    k.burst(1300, 700, 8)

    // ───── 5. выключаем плиту (взрослый рядом) ─────
    const mama = k.bubble('👍', 440, 250, { w: 200, h: 160, font: 84 })
    await k.tapOnEl(knob, { prompt: k.key('q_off'), host: pyx })
    st.off(0)
    g.to(mama, { scale: 0, opacity: 0, duration: 0.3, delay: 0.3, onComplete: () => mama.remove() })
    tiny()
    puffs.forEach(tl => tl.repeat(0))
    fadeAway([spoon], 40)

    // ───── 6. разливаем по трём мискам ─────
    bar.set(4)
    const BX = [1130, 1270, 1410]
    const bowls = BX.map(x => k.prop(kitchen.bowl(), x, 678, 140, 86, { z: 9 }))
    const soups = bowls.map(b => {
      const s = document.createElement('div')
      s.style.cssText = 'position:absolute;left:12%;top:25%;width:76%;height:20%;border-radius:50%;background:#FFB45C;box-shadow:inset 0 -3px 0 #F29A3A;opacity:0;transform:scale(.4)'
      s.innerHTML = ['#FF7A3D:20%:18%', '#6BCB77:52%:30%', '#FFF3C9:68%:12%', '#FF7A3D:38%:44%'].map(d => { const [c, l, t] = d.split(':'); return `<i style="position:absolute;left:${l};top:${t};width:11px;height:9px;border-radius:50%;background:${c}"></i>` }).join('')
      b.appendChild(s)
      return s
    })
    k.popIn(bowls)
    await k.wait(600)
    let scoopQ = Promise.resolve()
    const scoop = i => {
      scoopQ = scoopQ.then(async () => {
        const bx = BX[i], by = 678
        // ныряем в кастрюлю
        await k.play(g.to(ladle, { x: 0, y: 74, rotation: 180, duration: 0.4, ease: 'power2.inOut' }))
        k.sfx('stir', { vol: 0.6 })
        g.set(blob, { opacity: 1 })
        await k.wait(150)
        await k.play(g.to(ladle, { y: -10, duration: 0.35, ease: 'power2.out' }))
        // над миской
        await k.play(g.to(ladle, { x: bx - 720, y: by - 150 - 31 - 200, duration: 0.6, ease: 'power2.inOut' }))
        await k.play(g.to(ladle, { rotation: 140, duration: 0.3, ease: 'power2.out' }))
        k.sfx('pour', { vol: 0.7 })
        g.set(blob, { opacity: 0 })
        for (let n = 0; n < 8; n++) {
          const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#FFB45C;box-shadow:inset -2px -2px 0 #F29A3A"></div>', bx + 22 + k.rand(-6, 6), by - 118, 12, 14, { z: 20 })
          k.to(d, { y: 88, duration: 0.3, delay: n * 0.04, ease: 'power1.in' })
          k.to(d, { opacity: 0, duration: 0.1, delay: n * 0.04 + 0.28, onComplete: () => d.remove() })
        }
        await k.wait(350)
        g.to(soups[i], { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' })
        const bd = k.badge(String(i + 1), bx, by - 88, { size: 70, color: '#FF9F43' })
        bd.style.zIndex = '30'
        k.sayNumber(i + 1)
        await k.play(g.to(ladle, { rotation: 180, x: 0, y: -60, duration: 0.6, ease: 'power2.inOut' }))
      })
    }
    await k.tapAll(bowls, { prompt: k.key('q_bowls'), host: pyx, onTap: el => scoop(bowls.indexOf(el)) })
    await scoopQ
    fadeAway([ladle], -40)
    await tell(pyx, 'equal', 'cheer')
    k.burst(1270, 620, 8)

    // ───── 7. суп горячий: дуем; Щёчкин пробует ─────
    const steams = bowls.map(b => {
      const c = k.centerOf(b)
      const p = k.prop(kitchen.steam(), c.x, c.y - 70, 84, 60, { z: 12 })
      g.set(p, { opacity: 0 })
      g.timeline({ repeat: 3 }).fromTo(p, { y: 0, opacity: 0, scale: 0.6 }, { y: -30, opacity: 0.9, scale: 0.9, duration: 0.9, ease: 'none' }).to(p, { y: -60, opacity: 0, scale: 1.1, duration: 0.9, ease: 'none' })
      return p
    })
    await tell(pyx, 'hot', 'point')
    steams.forEach(s => s.remove())
    const hc = k.centerOf(hamster.el)
    k.sfx('yum', { vol: 0.5 })
    await k.play(g.to(bowls[2], { x: hc.x - BX[2] - 20, y: hc.y - 678 - 30, scale: 0.6, duration: 0.7, ease: 'power2.inOut' }))
    emote(hamster, 'dance')
    await tell(hamster, 'yum', 'cheer')
    k.burst(1440, 760, 10)
    g.to(bowls[2], { opacity: 0, duration: 0.3 })
    bar.done(4)
    await tell(pyx, 'sum', 'point')
    await tell(hamster, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
