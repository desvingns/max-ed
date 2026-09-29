// «Печенье-фигурки» — рецепт: раскатать тесто → вырезать формочками (звезда, сердце, круг, треугольник, квадрат;
// называем фигуры, считаем до пяти) → духовка со взрослым (песочные часы) → украсить (Капа спрашивает цвета) + посыпка.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { svg, P, L, F, E, C, R, HL, SH, S, rounded, circlePath, star, nid, INK } from '../art.js'

/** stepsBar с обходом бага тулкита (gsap.from + CSS-transition на transform → последние иконки «залипают»). */
function stepsBar(k, icons) {
  const bar = k.stepsBar(icons)
  const kids = [...bar.el.children]
  k.gsap.killTweensOf(kids)
  k.gsap.set(kids, { clearProps: 'transform' })
  k.gsap.fromTo(bar.el, { y: -130 }, { y: 0, duration: 0.6, ease: 'back.out(2)' })
  return bar
}

// ── фигурки: контуры в системе координат 150×150 (как у food('cookieCutter')) ──
const PATH = {
  star: star(75, 78, 62, 30, 5),
  heart: 'M75 132C10 90 14 44 44 34C62 28 75 42 75 54C75 42 88 28 106 34C136 44 140 90 75 132Z',
  circle: circlePath(75, 76, 58),
  tri: rounded([[75, 18], [136, 124], [14, 124]], 14),
  sq: rounded([[20, 20], [130, 20], [130, 130], [20, 130]], 12),
}
const CUT_NAME = { star: 'star', heart: 'heart', circle: 'circle', tri: 'triangle', sq: 'square' }

const DOUGH = '#F3D9A0', DOUGH_SH = '#DDB76E', DOUGH_CK = '#F9E6B8', DOUGH_CK_SH = '#E6C27E', BAKED = '#D9964A', BAKED_SH = '#B97431'
const cookieArt = (shape, o = {}) => {
  const base = o.baked ? BAKED : DOUGH_CK, sh = o.baked ? BAKED_SH : DOUGH_CK_SH
  const d = PATH[shape]
  const id = nid('ck')
  const icing = o.icing ? `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(75 78) scale(.8) translate(-75 -78)"><path d="${d}" fill="${o.icing}" stroke="${o.icing}" stroke-width="9" stroke-linejoin="round"/></g></g>` : ''
  return svg(150, 150, SH(75, 144, 50, 5) + S(d, base, sh) + icing + HL(52, 58, 12, 6, -35, 0.5) +
    (o.icing ? `<path d="${d}" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` : ''))
}
const holeArt = shape => svg(150, 150, `<path d="${PATH[shape]}" fill="#C79A5E" opacity=".55"/><path d="${PATH[shape]}" fill="none" stroke="#B9814A" stroke-width="5" stroke-linejoin="round" opacity=".8"/>`)

/** лист теста 620×340 */
const sheetArt = () => svg(620, 340,
  SH(310, 330, 270, 8, 0.16) +
  S(rounded([[14, 30], [606, 18], [614, 316], [10, 322]], 40), DOUGH, DOUGH_SH) +
  [[90, 70], [510, 90], [300, 280], [120, 250], [500, 250]].map(([x, y]) => E(x, y, 6, 3.4, '#E8C888', { sw: 0 })).join('') + HL(140, 52, 60, 8, -3, 0.55))
const ballArt = () => svg(200, 200,
  SH(100, 184, 66, 6) + S('M30 110C24 60 64 30 104 32C150 34 178 70 170 116C164 156 130 176 96 174C56 172 34 150 30 110Z', DOUGH, DOUGH_SH) + HL(72, 66, 26, 10, -30, 0.7))

/** противень 700×110 */
const trayArt = () => svg(700, 110,
  SH(350, 100, 300, 6, 0.18) +
  S(rounded([[6, 30], [694, 30], [676, 94], [24, 94]], 12), '#B8C0CC', '#8C95B4') +
  P(rounded([[26, 40], [674, 40], [660, 74], [40, 74]], 8), '#DDE6F2', { sw: 4 }) + HL(150, 52, 90, 5, 0, 0.6))

const hourglassArt = () => {
  const cid = nid('hg')
  const glass = 'M26 24L104 24Q104 78 72 100Q104 122 104 178L26 178Q26 122 58 100Q26 78 26 24Z'
  return svg(130, 204,
    SH(65, 198, 50, 5) + R(14, 6, 102, 18, 8, '#C68B59') + R(14, 180, 102, 18, 8, '#C68B59') + F(glass, '#E6F6FF') +
    `<clipPath id="${cid}"><path d="${glass}"/></clipPath><g clip-path="url(#${cid})">` +
    '<path class="sand-top" d="M20 40L110 40L110 100L20 100Z" fill="#FFD93D"/><path class="sand-bot" d="M20 112L110 112L110 190L20 190Z" fill="#FFD93D"/>' +
    '<line class="stream" x1="65" y1="100" x2="65" y2="182" stroke="#FFD93D" stroke-width="4" stroke-linecap="round" opacity="0"/></g>' +
    P(glass, 'none', { sw: 5 }) + HL(40, 50, 4, 16, 10, 0.7))
}

/** мисочка с глазурью 190×140 */
const icingBowlArt = color => svg(190, 140,
  SH(95, 130, 74, 5) + S('M14 46Q14 122 95 122Q176 122 176 46Z', '#FFFFFF', '#DCE8F5') +
  E(95, 46, 82, 16, color) + E(78, 42, 24, 5, '#fff', { sw: 0, attr: 'opacity=".5"' }) + E(95, 46, 82, 16, 'none') +
  P('M150 46Q168 70 160 104', 'none', { sw: 0 }) + HL(38, 84, 5, 16, 8, 0.7))

/** баночка посыпки 130×170 */
const sprinkleJarArt = () => {
  const cols = ['#FF5A5F', '#FFD93D', '#4D96FF', '#6BCB77', '#FF8FC8']
  const bits = Array.from({ length: 26 }, (_, i) => `<rect x="${30 + (i * 37) % 70}" y="${76 + (i * 23) % 72}" width="12" height="5" rx="2.5" fill="${cols[i % 5]}" transform="rotate(${(i * 61) % 180} ${36 + (i * 37) % 70} ${78 + (i * 23) % 72})"/>`).join('')
  return svg(130, 170,
    SH(65, 164, 48, 5) + S('M24 40L106 40L112 60L112 148Q112 162 98 162L32 162Q18 162 18 148L18 60Z', '#F4FBFF', '#C9DFF0', { extra: bits }) +
    P('M22 40Q22 18 65 18Q108 18 108 40Z', '#FF8FC8', { sw: 5 }) + HL(32, 96, 5, 26, 0, 0.7))
}

const COLORS = { red: '#FF5A5F', yellow: '#FFD93D', blue: '#4D96FF' }

export default defineLevel({
  id: 'cookies',
  async run(k) {
    const gsap = k.gsap
    const L0 = k.layout
    k.kitchenBg()
    const pyx = k.pyx({ x: 230 })
    const kapa = k.guest('kapa', 1420, L0.floorY, { size: 270, face: 'left' })
    const bar = stepsBar(k, ['🥣', '⭐', '🔥', '🎨'])
    const board = k.food('board', 850, 700, 840, { z: 3 })
    k.fromTo(board, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    const clamp01 = v => Math.max(0, Math.min(1, v))
    const SH_C = { x: 850, y: 640 }
    const bump = (el, s = 1.15) => gsap.fromTo(el, { scale: 1 }, { scale: s, yoyo: true, repeat: 1, duration: 0.14 })

    await k.wait(500)
    bar.set(0)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(kapa, 'kapa_hi', 'happy')

    // ═══ 1. раскатываем тесто ═══
    const ball = k.prop(ballArt(), SH_C.x, SH_C.y + 10, 170, 170, { z: 6 })
    const sheet = k.prop(sheetArt(), SH_C.x, SH_C.y, 640, 350, { z: 5 })
    gsap.set(sheet, { scaleX: 0.25, scaleY: 0.2, opacity: 0 })
    k.popIn(ball)
    const pinY0 = SH_C.y - 210
    const pin = k.food('rollingPin', SH_C.x, pinY0, 320, { z: 14 })
    k.popIn(pin)
    await k.wait(500)
    await k.scrub(ball, {
      area: { x: SH_C.x - 320, y: SH_C.y - 175, w: 640, h: 350, cx: SH_C.x, cy: SH_C.y }, need: 1300,
      prompt: k.key('dough_q'), host: pyx,
      onProgress: (p, pos) => {
        const t = clamp01((p - 0.04) / 0.3)
        gsap.set(ball, { opacity: 1 - t, scale: 1 + p * 0.6 })
        gsap.set(sheet, { opacity: t, scaleX: 0.25 + 0.75 * p, scaleY: 0.2 + 0.8 * p })
        if (pos) gsap.set(pin, { x: pos.x - SH_C.x, y: pos.y - pinY0 })
      },
    })
    ball.remove()
    gsap.set(sheet, { opacity: 1 })
    gsap.fromTo(sheet, { scaleY: 1.06 }, { scaleY: 1, duration: 0.4, ease: 'back.out(2)' })
    gsap.to(pin, { y: -180, opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: () => pin.remove() })
    k.sfx('plop')
    k.burst(SH_C.x, SH_C.y, 8)
    await k.tell(pyx, 'dough_ok', 'cheer')

    // ═══ 2. формочки ═══
    bar.set(1)
    const ORDER = ['star', 'heart', 'circle', 'tri', 'sq']
    // где вырезаем каждую фигуру на листе
    const SPOT = { star: [-190, -70], heart: [0, -70], circle: [190, -70], tri: [-95, 65], sq: [95, 65] }
    const slotsX = k.shuffle([560, 690, 820, 950, 1080, 1210]).slice(0, 5).sort((a, b) => a - b)
    const shuffledShapes = k.shuffle([...ORDER])
    const CUTW = 104
    const cutters = ORDER.map(shape => {
      const i = shuffledShapes.indexOf(shape)
      const x = 500 + i * 150
      return { id: shape, shape, el: k.food('cookieCutter', x, 875, CUTW, { z: 20, args: [CUT_NAME[shape]] }) }
    })
    k.fromTo(cutters.map(c => c.el), { y: 250, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)' })
    await k.wait(400)
    await k.tell(pyx, 'cutters', 'point')
    const zone = { id: 'dough', el: sheet, pad: 30 }
    const made = []
    let cur = 0
    const askKey = s => `ask_${s}`
    await k.dnd({
      items: cutters, zones: [zone],
      prompt: k.key(askKey(ORDER[0])), host: pyx,
      accept: it => it.shape === ORDER[cur],
      onCorrect: async it => {
        const sp = SPOT[it.shape]
        const tx = SH_C.x + sp[0], ty = SH_C.y + sp[1]
        const c = k.centerOf(it.el)
        it.el.style.zIndex = '30'
        await k.play(gsap.to(it.el, { x: `+=${tx - c.x}`, y: `+=${ty - c.y - 20}`, scale: 1.25, duration: 0.3, ease: 'power2.out' }))
        // штамп: нажали и приподняли
        await k.play(gsap.to(it.el, { y: `+=${20}`, scale: 1.12, duration: 0.12, ease: 'power2.in' }))
        k.sfx('clonk')
        const hole = k.prop(holeArt(it.shape), tx, ty, 150, 150, { z: 6 })
        const ck = k.prop(cookieArt(it.shape), tx, ty, 150, 150, { z: 7 })
        gsap.fromTo(ck, { scale: 0.8 }, { scale: 1, duration: 0.3, ease: 'back.out(2.5)' })
        made.push({ shape: it.shape, ck, hole, tx, ty })
        k.sparkle(tx, ty, 4)
        gsap.to(it.el, { y: `-=${60}`, opacity: 0, scale: 0.9, duration: 0.35, delay: 0.1 })
        await k.tell(pyx, `got_${it.shape}`, 'happy')
        await k.sayNumber(made.length)
        cur++
        if (cur < ORDER.length) { pyx.emote('point'); await k.tell(pyx, askKey(ORDER[cur])) }
      },
      onWrong: async (it, z) => {
        pyx.emote('shake')
        await k.tell(pyx, `wrong_${ORDER[cur]}`)
      },
    })
    await k.wait(300)
    await k.tell(pyx, 'all_five', 'cheer')

    // ═══ 3. на противень ═══
    await k.tell(pyx, 'tray', 'point')
    const tray = k.prop(trayArt(), 850, 700, 700, 110, { z: 4 })
    k.fromTo(tray, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
    await k.wait(400)
    const TRAY_X = [-260, -130, 0, 130, 260]
    const grp = k.prop('', 800, 500, 1600, 1000, { z: 9 })
    grp.style.pointerEvents = 'none'
    gsap.set(grp, { transformOrigin: '850px 700px' })
    for (let i = 0; i < made.length; i++) {
      const m = made[i]
      m.ck.style.zIndex = String(9 + i)
      await k.play(gsap.to(m.ck, { x: 850 + TRAY_X[i] - m.tx, y: 670 - m.ty, scale: 0.72, duration: 0.4, ease: 'power2.inOut' }))
      k.sfx('plop')
    }
    gsap.to([sheet, ...made.map(m => m.hole)], { opacity: 0, duration: 0.4 })
    grp.append(tray, ...made.map(m => m.ck))
    bar.set(2)

    // ═══ 4. духовка — только со взрослым ═══
    await k.play(gsap.to(board, { opacity: 0, y: 40, duration: 0.4 }))
    const st = k.stove()
    const knobs = [...st.el.querySelectorAll('.knob')]
    const light = st.el.querySelector('.power-light')
    await k.play(gsap.to(grp, { y: 40, duration: 0.5, ease: 'power2.inOut' }))
    await k.tell(pyx, 'oven_adult', 'point')
    const mb = k.bubble('👩‍🍳', 330, 250, { w: 230, h: 190, font: 90 })
    k.sfx('magic')
    await k.wait(900)
    gsap.to(mb, { scale: 0, autoAlpha: 0, duration: 0.3, onComplete: () => mb.remove() })
    const dial = st.knobEl(1)
    await k.tapOnEl(dial, { prompt: k.key('oven_tap'), host: pyx })
    dial.remove()
    gsap.to(knobs[1], { rotation: 90, svgOrigin: knobs[1].getAttribute('data-origin') ?? undefined, duration: 0.45, ease: 'back.out(2)' })
    gsap.to(light, { autoAlpha: 1, duration: 0.3 })
    k.sfx('whoosh')
    const glow = k.prop('<div style="width:100%;height:100%;border-radius:14px;background:linear-gradient(#FFD36B,#FF7A3D);box-shadow:0 0 30px 8px rgba(255,140,60,.7)"></div>', 820, 646, 160, 42, { z: 5 })
    gsap.fromTo(glow, { opacity: 0 }, { opacity: 0.9, duration: 0.8 })
    await k.wait(500)
    // противень уезжает в духовку
    await k.play(gsap.to(grp, { x: -30, y: 95 - 149, scale: 0.22, duration: 0.9, ease: 'power2.inOut' }))
    gsap.to(grp, { opacity: 0, duration: 0.2 })
    // песочные часы
    const hg = k.prop(hourglassArt(), 1160, 590, 116, 182, { z: 8 })
    k.popIn(hg)
    const sandTop = hg.querySelector('.sand-top'), sandBot = hg.querySelector('.sand-bot'), stream = hg.querySelector('.stream')
    gsap.set(sandTop, { scaleY: 0, svgOrigin: '65 100' })
    gsap.set(sandBot, { scaleY: 1, svgOrigin: '65 190' })
    await k.wait(400)
    await k.tapOnEl(hg, { prompt: k.key('oven_in'), host: pyx })
    await k.play(gsap.to(hg, { rotation: 180, duration: 0.6, ease: 'back.inOut(1.4)' }))
    gsap.set(hg, { rotation: 0 })
    gsap.set(sandTop, { scaleY: 1, svgOrigin: '65 100' })
    gsap.set(sandBot, { scaleY: 0, svgOrigin: '65 190' })
    gsap.set(stream, { opacity: 1 })
    k.tell(pyx, 'oven_wait')
    gsap.to(sandTop, { scaleY: 0, svgOrigin: '65 100', duration: 3.4, ease: 'none' })
    gsap.to(sandBot, { scaleY: 1, svgOrigin: '65 190', duration: 3.4, ease: 'none' })
    const tick = k.every(500, () => k.sfx('tick', { vol: 0.8 }))
    await k.wait(900)
    for (let n = 1; n <= 3; n++) { await k.sayNumber(n); await k.wait(650) }
    await k.wait(700)
    tick()
    gsap.to(stream, { opacity: 0, duration: 0.2 })
    gsap.to(hg, { opacity: 0, y: 40, duration: 0.4, onComplete: () => hg.remove() })
    k.sfx('ding')
    gsap.fromTo(glow, { scaleX: 1 }, { scaleX: 1.1, yoyo: true, repeat: 3, duration: 0.12 })
    await k.tell(pyx, 'ding', 'cheer')
    // достаём прихваткой
    const mitt = k.prop(kitchen.mitt(), 1120, 500, 120, 152, { z: 14 })
    k.popIn(mitt)
    await k.tapOnEl(mitt, { prompt: k.key('mitt_q'), host: pyx })
    await k.play(gsap.to(mitt, { x: 820 - 1120, y: 620 - 500, rotation: -20, duration: 0.5, ease: 'power2.inOut' }))
    gsap.to([glow, light], { autoAlpha: 0, duration: 0.4 })
    gsap.to(knobs[1], { rotation: 0, svgOrigin: knobs[1].getAttribute('data-origin') ?? undefined, duration: 0.4 })
    // запечённое печенье
    made.forEach(m => { m.ck.innerHTML = cookieArt(m.shape, { baked: true }) })
    k.sfx('pop')
    gsap.to(mitt, { x: 0, y: 0, rotation: 0, opacity: 0, duration: 0.5, delay: 0.3, onComplete: () => mitt.remove() })
    board.style.zIndex = '3'
    gsap.to(board, { opacity: 1, y: 0, duration: 0.5 })
    gsap.set(grp, { opacity: 1, x: 0, y: 0, scale: 1 })
    tray.style.display = 'none'
    st.el.remove()
    glow.remove()
    // пар
    for (let i = 0; i < 3; i++) {
      const s = k.prop(kitchen.steam(), 700 + i * 150, 620, 120, 87, { z: 12 })
      k.fromTo(s, { y: 0, opacity: 0.9, scale: 0.7 }, { y: -110, opacity: 0, scale: 1.3, duration: 1.6, delay: i * 0.3, ease: 'power1.out', onComplete: () => s.remove() })
    }
    await k.play(gsap.to(made.map(m => m.ck), { x: i => 850 + (i - 2) * 160 - made[i].tx, y: i => 640 - made[i].ty, scale: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(1.5)' }))
    await k.tell(pyx, 'golden', 'happy')

    // ═══ 5. украшаем: Капа спрашивает цвета ═══
    bar.set(3)
    await k.tell(pyx, 'deco', 'point')
    const by = { heart: made.find(m => m.shape === 'heart'), star: made.find(m => m.shape === 'star'), circle: made.find(m => m.shape === 'circle') }
    const DECO = [
      { color: 'red', shape: 'heart', ask: 'kapa_q', ok: 'kapa_ok1' },
      { color: 'yellow', shape: 'star', ask: 'kapa_q2', ok: 'kapa_ok2' },
      { color: 'blue', shape: 'circle', ask: 'kapa_q3', ok: 'kapa_ok3' },
    ]
    await k.wait(300)
    for (let r = 0; r < DECO.length; r++) {
      const d = DECO[r]
      const target = by[d.shape]
      const zs = made.map(m => ({ id: m.shape, el: m.ck, m, pad: 10 }))
      // три баночки глазури заново каждый раз (у каждого dnd свои обработчики)
      const order = k.shuffle(Object.keys(COLORS))
      const its = order.map((c, i) => ({ id: c, color: c, el: k.prop(icingBowlArt(COLORS[c]), 560 + i * 240, 855, 190, 140, { z: 20 }) }))
      k.fromTo(its.map(b => b.el), { y: 250, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
      // нужная — первой в списке (подсказка «ручкой» и решатель тестов)
      its.sort((a, b) => (b.color === d.color) - (a.color === d.color))
      await k.wait(500)
      await k.dnd({
        items: its, zones: zs,
        prompt: k.key(d.ask), host: kapa,
        until: placed => placed.__ok === true,
        accept: (it, z) => it.color === d.color && z.m === target,
        onCorrect: async (it, z, placed) => {
          placed.__ok = true
          const c = k.centerOf(it.el), t = k.centerOf(target.ck)
          it.el.style.zIndex = '30'
          await k.play(gsap.to(it.el, { x: `+=${t.x - c.x + 40}`, y: `+=${t.y - c.y - 100}`, rotation: -35, scale: 0.8, duration: 0.45, ease: 'power2.out' }))
          k.sfx('plop')
          target.ck.innerHTML = cookieArt(target.shape, { baked: true, icing: COLORS[d.color] })
          k.sparkle(t.x, t.y, 5)
          kapa.emote('happy')
          await k.tell(kapa, d.ok)
        },
        onWrong: async (it, z) => {
          kapa.emote('think')
          if (it.color !== d.color) await k.tell(kapa, 'color_wrong')
          else if (z) await k.tell(kapa, 'shape_wrong')
        },
      })
      gsap.to(its.map(b => b.el), { opacity: 0, y: '+=60', duration: 0.35, onComplete: () => its.forEach(b => b.el.remove()) })
      bump(target.ck, 1.12)
    }
    // остальные две фигурки — посыпкой
    const jar = k.prop(sprinkleJarArt(), 1345, 662, 130, 170, { z: 14 })
    k.popIn(jar)
    await k.wait(400)
    const bits = []
    const BCOLS = ['#FF5A5F', '#FFD93D', '#4D96FF', '#6BCB77', '#FF8FC8']
    await k.tapN(jar, 3, {
      prompt: k.key('sprinkle_q'), host: pyx,
      onTap: async i => {
        gsap.to(jar, { rotation: -100, x: -40 - i * 60, y: -30, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' })
        k.sfx('sprinkle')
        made.forEach(m => {
          for (let j = 0; j < 4; j++) {
            const s = k.prop(`<div style="width:100%;height:100%;border-radius:3px;background:${BCOLS[(j + i) % 5]}"></div>`, 850 + (made.indexOf(m) - 2) * 160 + k.rand(-32, 32), 640 + k.rand(-34, 30), 14, 6, { z: 16 })
            s.style.transform = `rotate(${Math.round(k.rand(0, 180))}deg)`
            gsap.from(s, { y: -60 - k.rand(0, 40), opacity: 0, duration: 0.4, delay: j * 0.05 + i * 0.03 })
            bits.push(s)
          }
        })
      },
    })
    gsap.to(jar, { opacity: 0, x: 200, duration: 0.5, onComplete: () => jar.remove() })
    k.burst(850, 640, 12)
    await k.tell(pyx, 'sprinkle_ok', 'cheer')

    // ═══ финал: Капа хрумкает ═══
    const all = [...made.map(m => m.ck), ...bits]
    all.forEach(e => { e.style.zIndex = String(Number(e.style.zIndex || 9) + 12) })
    await k.play(gsap.to(all, { x: (i, t) => `+=${1360 - k.centerOf(t).x}`, y: (i, t) => `+=${790 - k.centerOf(t).y}`, scale: 0.35, duration: 0.9, ease: 'power2.inOut', stagger: 0.02 }))
    k.sfx('crunch')
    kapa.emote('laugh')
    await k.play(gsap.to(all, { opacity: 0, scale: 0.1, duration: 0.5, stagger: 0.02, ease: 'power2.in' }))
    k.burst(1300, 700, 12)
    await k.tell(kapa, 'eat')
    await k.tell(pyx, 'sum', 'point')
    await k.tell(kapa, 'bye', 'cheer')
    bar.done(3)
    k.burst(800, 420, 14)
  },
})
