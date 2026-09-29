// «Мою руки с мылом»: лупа показывает микробиков → кран → мыло → пена и счёт до десяти → смыть → вытереть.
// Жесты: tapOnEl (лупа, кран), dnd (мыло на ладошки), scrub (мылим / вытираем).
import { defineLevel, sfx2 } from '../lib.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, rounded, circlePath, nid, darker } from '../art.js'

// ───────────────────────── рисунки ─────────────────────────
const SKIN = '#FFCFA6'
const SKIN_SH = '#F2A87E'

const vcap = (cx, y0, y1, w) => {
  const r = w / 2
  return `M${cx - r} ${y0 + r}A${r} ${r} 0 0 1 ${cx + r} ${y0 + r}L${cx + r} ${y1 - r}A${r} ${r} 0 0 1 ${cx - r} ${y1 - r}Z`
}

/** Ладошка (вид со стороны ладони), 240×310. flip — левая рука. */
function handArt(flip = false) {
  const parts = [
    { d: vcap(66, 56, 180, 40) },
    { d: vcap(106, 26, 180, 40) },
    { d: vcap(146, 44, 180, 40) },
    { d: vcap(184, 86, 184, 38) },
    { d: 'M38 176Q38 138 74 138L176 138Q212 138 212 176L212 232Q212 296 146 296L104 296Q38 296 38 232Z' },
    { d: vcap(0, -104, 0, 44), t: 'transform="translate(52 236) rotate(-44)"' },
  ]
  const id = nid('h')
  const outline = parts.map(p => `<path d="${p.d}" ${p.t ?? ''} fill="${INK}" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>`).join('')
  const shade = parts.map(p => `<path d="${p.d}" ${p.t ?? ''} fill="${SKIN_SH}"/>`).join('')
  const base = `<clipPath id="${id}">${parts.map(p => `<path d="${p.d}" ${p.t ?? ''}/>`).join('')}</clipPath><g clip-path="url(#${id})"><g transform="translate(-9 -8)">${parts.map(p => `<path d="${p.d}" ${p.t ?? ''} fill="${SKIN}"/>`).join('')}</g></g>`
  const lines = L('M86 92V176M126 76V176M165 96V176', SKIN_SH, 4) + L('M70 214Q112 244 168 222', '#E58E62', 5) + L('M84 252Q118 270 160 254', '#E58E62', 4)
  const hl = HL(64, 84, 6, 20, 8, 0.6) + HL(104, 56, 6, 20, 8, 0.6) + HL(144, 74, 6, 18, 8, 0.6) + HL(66, 176, 16, 8, -20, 0.55)
  const body = outline + shade + base + lines + hl
  return svg(240, 310, flip ? `<g transform="translate(240 0) scale(-1 1)">${body}</g>` : body)
}

const handsHtml = () =>
  `<div style="position:absolute;left:0;top:14px;width:236px;height:304px;transform:rotate(9deg);transform-origin:50% 100%">${handArt(true)}</div>` +
  `<div style="position:absolute;left:244px;top:14px;width:236px;height:304px;transform:rotate(-9deg);transform-origin:50% 100%">${handArt(false)}</div>`

/** Кран со стены: ручка сверху, носик снизу. 260×250, носик заканчивается на y≈236. */
function faucetSvg() {
  const chrome = '#DDE6F2', chromeSh = '#AEBBD4'
  return svg(260, 250,
    E(130, 150, 92, 30, '#C4CFE4') + R(116, 70, 28, 60, 8, chrome) +
    S(rounded([[58, 126], [202, 126], [212, 176], [48, 176]], 26), chrome, chromeSh) +
    S(rounded([[98, 170], [162, 170], [158, 236], [102, 236]], 14), chrome, chromeSh) +
    R(88, 226, 84, 16, 8, '#8C95B4') +
    S(rounded([[62, 34], [198, 34], [198, 78], [62, 78]], 22), '#4D96FF', '#3A7BDA') +
    C(96, 56, 7, '#fff', { sw: 0 }) + HL(96, 44, 30, 5, -2, 0.55) + HL(74, 140, 5, 14, 0, 0.7) +
    C(130, 56, 12, '#FFFFFF', { sw: 4 }) +
    `<path d="M130 50Q124 60 130 64Q136 60 130 50Z" fill="#62C6FF"/>`)
}

function loupeSvg() {
  return svg(190, 190,
    SH(90, 178, 50, 6) +
    P('M112 118L168 168Q176 176 168 182Q160 188 152 180L100 128Z', '#C68B59', { sw: 6 }) +
    C(84, 84, 66, '#FFB938', { sw: 6 }) +
    C(84, 84, 52, '#D7F1FF', { sw: 5 }) +
    `<path d="M50 88Q52 58 82 50" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".9"/>` +
    `<path d="M104 118Q120 108 124 90" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>`)
}

function ducklingSvg() {
  return svg(130, 110,
    SH(64, 102, 50, 6) +
    P('M96 50Q128 34 122 66Q116 86 90 84Z', '#F2B824', { sw: 5 }) +
    S('M12 70C12 44 40 36 64 40C92 44 108 56 106 76C104 96 82 100 58 100C30 100 12 92 12 70Z', '#FFD93D', '#F2B824') +
    E(70, 74, 24, 15, '#F2B824', { sw: 4 }) +
    S(circlePath(40, 34, 28), '#FFD93D', '#F2B824') +
    P('M14 34Q0 34 2 44Q8 50 22 46Z', '#FF9F43', { sw: 4 }) +
    C(42, 26, 4.5, INK, { sw: 0 }) + HL(32, 20, 8, 4, -30, 0.7))
}

function soapDishSvg() {
  return svg(230, 70, SH(115, 62, 96, 6) + S('M10 24Q10 8 115 8Q220 8 220 24Q220 54 115 56Q10 54 10 24Z', '#FFFFFF', '#CFE4F2') + E(115, 24, 84, 10, '#E1EFF8', { sw: 0 }))
}

/** Фон: голубая плитка, столешница с раковиной, шкафчики, пол. */
function bgSvg() {
  let tiles = ''
  for (let r = 0; r < 6; r++) for (let c = -1; c < 15; c++) {
    const x = c * 112 + (r % 2 ? 56 : 0)
    tiles += `<rect x="${x + 5}" y="${r * 112 + 5}" width="102" height="102" rx="16" fill="${(r * 3 + c) % 7 === 0 ? '#CDEBFA' : '#E4F7FF'}"/>`
  }
  const bubbles = [[210, 210, 34], [262, 268, 18], [190, 300, 12], [1390, 190, 30], [1330, 250, 16], [1452, 280, 12], [420, 120, 14], [1180, 110, 20]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".75" stroke="#9DD3EE" stroke-width="4"/><ellipse cx="${x - r * 0.35}" cy="${y - r * 0.35}" rx="${r * 0.22}" ry="${r * 0.14}" fill="#fff" transform="rotate(-35 ${x - r * 0.35} ${y - r * 0.35})"/>`).join('')
  let floor = ''
  for (let c = -1; c < 20; c++) floor += `<rect x="${c * 90 + ((c + 1) % 2 ? 0 : 0)}" y="936" width="90" height="70" fill="${c % 2 ? '#FFEACB' : '#FFF6E3'}"/>`
  let doors = ''
  for (let i = 0; i < 5; i++) {
    const x = 14 + i * 316
    doors += R(x, 812, 296, 108, 20, '#A6DCF8', { sw: 5 }) + R(x + 16, 826, 264, 80, 12, '#BDE8FB', { sw: 0 }) + C(x + (i % 2 ? 40 : 256), 866, 11, '#FFD93D', { sw: 4 })
  }
  return svg(1600, 1000,
    `<rect x="-10" y="-10" width="1620" height="1020" fill="#B5E0F4"/>` + tiles + bubbles +
    // hook for towel
    `<path d="M1400 300Q1400 278 1420 278" fill="none" stroke="#C68B59" stroke-width="10" stroke-linecap="round"/><circle cx="1400" cy="308" r="12" fill="#C68B59" stroke="${INK}" stroke-width="5"/>` +
    // backsplash edge
    `<rect x="-20" y="646" width="1640" height="22" fill="#8CC8E4"/>` +
    // countertop
    `<rect x="-20" y="664" width="1640" height="118" fill="#F8D3A2"/><rect x="-20" y="664" width="1640" height="8" fill="#FFE6C2"/>` +
    `<rect x="-20" y="782" width="1640" height="26" fill="#E5A868"/><path d="M-20 664H1620M-20 782H1620M-20 808H1620" stroke="${INK}" stroke-width="6" fill="none"/>` +
    `<rect x="-20" y="808" width="1640" height="140" fill="#8FD0F4"/>` + doors + `<path d="M-20 808H1620" stroke="${INK}" stroke-width="6"/>` +
    floor + `<rect x="-20" y="930" width="1640" height="10" fill="#E6C9A0"/><path d="M-20 932H1620" stroke="${INK}" stroke-width="5"/>` +
    // раковина
    E(800, 722, 340, 56, '#FFFFFF') + E(800, 728, 306, 42, '#CFEBF7', { sw: 5 }) + E(800, 736, 250, 28, '#B7DEF1', { sw: 0 }) +
    E(800, 740, 34, 11, '#5E5776', { sw: 5 }) + E(800, 738, 20, 6, '#3B2F4F', { sw: 0 }) +
    HL(560, 704, 60, 6, -8, 0.7))
}

const foamSvg = tint => svg(100, 100,
  `<circle cx="50" cy="50" r="45" fill="#fff" stroke="#8CCBEA" stroke-width="5"/><path d="M14 58A38 38 0 0 0 86 62A44 44 0 0 1 14 58Z" fill="${tint}"/>` +
  `<ellipse cx="33" cy="31" rx="11" ry="6" fill="#fff" stroke="#DDF0FA" stroke-width="2" transform="rotate(-35 33 31)"/><circle cx="68" cy="60" r="5" fill="#fff" stroke="#BFE3F5" stroke-width="2"/>`)

const numBubbleHtml = n =>
  `<div style="width:100%;height:100%;border-radius:50%;box-sizing:border-box;border:6px solid #7CC4E8;background:radial-gradient(circle at 30% 28%,#fff 0 11%,rgba(255,255,255,.72) 12% 55%,rgba(170,225,250,.85) 100%);display:grid;place-items:center;font:900 ${n === 10 ? 58 : 70}px/1 var(--font);color:${INK};box-shadow:0 8px 0 rgba(0,0,0,.10)">${n}</div>`

const dropSvg = () => svg(40, 56, `<path d="M20 4C30 22 36 30 36 38C36 48 28 54 20 54C12 54 4 48 4 38C4 30 10 22 20 4Z" fill="#7CD4FF" stroke="#3E9BD6" stroke-width="3" stroke-linejoin="round"/><ellipse cx="14" cy="36" rx="4" ry="7" fill="#fff" opacity=".8"/>`)

export const _art = { handArt, faucetSvg, loupeSvg, ducklingSvg, bgSvg, foamSvg, dropSvg }

// ───────────────────────── уровень ─────────────────────────
const GERM_COLORS = ['#8AC926', '#B388EB', '#FF9F43', '#FF6B9A', '#3CC8D8', '#FFD93D']
const GERM_SPOTS = [[640, 510, 100], [726, 612, 88], [716, 470, 84], [960, 510, 100], [874, 612, 88], [884, 470, 84]]
const DRAIN = { x: 800, y: 736 }

export default defineLevel({
  id: 'wash-hands',
  async run(k) {
    const css = document.createElement('style')
    css.textContent = `.wh-stream{position:relative;width:100%;height:100%;box-sizing:border-box;border:5px solid ${INK};border-top:0;border-radius:0 0 30px 30px;background:linear-gradient(90deg,#5BBEF2,#A2E2FF 50%,#5BBEF2);overflow:hidden}
.wh-stream i{position:absolute;inset:0;background:repeating-linear-gradient(180deg,rgba(255,255,255,.75) 0 14px,transparent 14px 52px);animation:whflow .4s linear infinite}
@keyframes whflow{to{background-position:0 52px}}`
    document.head.appendChild(css)
    k.onExit(() => css.remove())

    k.bg(bgSvg())
    const pyx = k.pyx({ x: 230, y: 962, size: 400 })
    const kapa = k.guest('kapa', 1385, 962, { size: 330, face: 'left' })
    k.prop(ducklingSvg(), 430, 690, 120, 102, { z: 4 })
    k.prop(soapDishSvg(), 1200, 742, 200, 60, { z: 4 })
    const faucet = k.prop(faucetSvg(), 800, 245, 260, 250, { z: 9 })
    const knob = k.prop('', 800, 178, 200, 170, { z: 40 })
    knob.style.borderRadius = '50%'

    // струя воды
    const stream = k.prop('<div class="wh-stream"><i></i></div>', 800, 526, 64, 336, { z: 17 })
    k.gsap.set(stream, { scaleY: 0, transformOrigin: '50% 0%' })
    const splash = (x, y, n = 3) => {
      for (let i = 0; i < n; i++) {
        const d = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#9BE0FF;box-shadow:0 0 0 3px #3E9BD6"></div>', x, y, 13, 13, { z: 18 })
        const dx = k.rand(-70, 70)
        k.timeline({ onComplete: () => d.remove() })
          .to(d, { x: dx, y: -k.rand(30, 80), duration: 0.22, ease: 'power1.out' })
          .to(d, { x: dx * 1.4, y: 12, opacity: 0, duration: 0.25, ease: 'power1.in' })
      }
    }
    let splashStop = null
    const waterOn = sec => {
      sfx2.pour(sec, 0.7)
      k.to(stream, { scaleY: 1, duration: 0.3, ease: 'power2.out' })
      splashStop?.()
      splashStop = k.every(110, () => splash(800 + k.rand(-16, 16), 700, 2))
    }
    const waterOff = async () => {
      splashStop?.(); splashStop = null
      await k.play(k.gsap.to(stream, { scaleY: 0, duration: 0.3, ease: 'power2.in' }))
    }

    // ладошки
    const hands = k.prop(handsHtml(), 800, 566, 480, 322, { z: 12 })
    k.gsap.set(hands, { y: 420, opacity: 0 })
    // микробики (пока спрятаны)
    const germs = GERM_SPOTS.map(([x, y, w], i) => {
      const el = k.food('germ', x, y, w, { z: 24, args: [GERM_COLORS[i]] })
      k.gsap.set(el, { scale: 0, opacity: 0 })
      return el
    })
    // мыло
    const soap = k.food('soap', 1200, 712, 170, { z: 30 })
    k.gsap.set(soap, { scale: 0, opacity: 0 })
    // полотенце
    const towel = k.food('towel', 1400, 442, 190, { z: 6 })
    k.gsap.set(towel, { y: -520, opacity: 0 })
    const loupe = k.prop(loupeSvg(), 1232, 618, 200, 200, { z: 30 })
    k.gsap.set(loupe, { scale: 0, opacity: 0 })

    await k.wait(400)
    k.to(towel, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    await k.tell(pyx, 'hello', 'wave')

    // 1. чистые ладошки… а микробики?
    k.to(hands, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' })
    k.sfx('whoosh')
    await k.wait(650)
    await k.tell(pyx, 'hands', 'think')
    await k.tell(kapa, 'kapa_hi', 'happy')
    k.to(loupe, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' })
    k.sfx('pop')
    await k.tapOnEl(loupe, { prompt: k.key('q_lupa'), host: kapa })
    // лупа «просвечивает» ладошки — микробики появляются
    {
      const c = k.centerOf(loupe)
      const at = (x, y) => ({ x: x - c.x, y: y - c.y })
      const tl = k.timeline()
      tl.to(loupe, { ...at(690, 560), scale: 1.25, rotation: -14, duration: 0.7, ease: 'power2.inOut' })
        .to(loupe, { ...at(910, 560), rotation: 12, duration: 0.9, ease: 'sine.inOut' })
        .to(loupe, { ...at(800, 520), rotation: 0, duration: 0.5, ease: 'sine.inOut' })
      germs.forEach((g, i) => k.after(750 + (i % 3) * 200 + (i > 2 ? 350 : 0), () => {
        k.sfx('pop'); if (i % 2 === 0) k.sfx('squeak', { vol: 0.5 })
        k.to(g, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(3)' })
      }))
      await k.play(tl)
      k.to(loupe, { x: at(1232, 618).x, y: at(1232, 618).y, scale: 0.9, rotation: 0, duration: 0.7, ease: 'power2.inOut' })
    }
    // микробики покачиваются
    germs.forEach((g, i) => k.to(g, { rotation: i % 2 ? 8 : -8, y: '+=6', duration: 0.5 + i * 0.05, yoyo: true, repeat: -1, ease: 'sine.inOut' }))
    pyx.emote('surprised')
    await k.tell(pyx, 'germs')
    await k.tell(kapa, 'squeak', 'laugh')
    k.to(loupe, { opacity: 0, scale: 0, duration: 0.3 })

    // 2. включаем воду
    await k.tapOnEl(knob, { prompt: k.key('q_tap'), host: pyx })
    waterOn(2.4)
    await k.wait(300)
    // ладошки мокрые: капельки
    const drops = []
    for (let i = 0; i < 10; i++) {
      const left = i % 2 === 0
      const x = (left ? 610 : 830) + k.rand(0, 150), y = 470 + k.rand(0, 190)
      const d = k.prop(dropSvg(), x, y, 30, 42, { z: 21 })
      drops.push(d)
      k.fromTo(d, { scale: 0 }, { scale: 1, duration: 0.3, delay: i * 0.08, ease: 'back.out(3)' })
    }
    k.to(hands, { rotation: -2, duration: 0.15, yoyo: true, repeat: 5 })
    await k.wait(1600)
    await waterOff()
    await k.tell(pyx, 'wet', 'nod')

    // 3. мыло: перетащить на ладошки
    k.to(soap, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' })
    k.sfx('pop')
    await k.dnd({
      items: [{ el: soap, id: 'soap' }],
      zones: [{ el: hands, id: 'hands', pad: 60 }],
      accept: () => true,
      prompt: k.key('q_soap'), host: pyx,
      onCorrect: async (it, z) => {
        soap.style.zIndex = 30
        const c = k.centerOf(z.el), s = k.centerOf(soap)
        k.to(soap, { x: `+=${c.x - s.x}`, y: `+=${c.y - s.y}`, rotation: -12, duration: 0.3, ease: 'power2.out' })
        await k.wait(320)
        k.sfx('bloop'); k.sparkle(c.x, c.y, 5)
      },
    })

    // 4. мылим, считаем до десяти
    let counted = 0, fled = 0, lastFoam = null
    const foam = []
    const clampX = x => Math.max(600, Math.min(1000, x)), clampY = y => Math.max(450, Math.min(690, y))
    const addFoam = (x, y) => {
      const s = k.rand(56, 96)
      const el = k.prop(foamSvg(k.pick(['#DDF1FF', '#FFE3F1', '#E4F8E0', '#EEF3FF'])), clampX(x), clampY(y), s, s, { z: 22 })
      k.fromTo(el, { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(2.4)' })
      foam.push(el)
      if (foam.length % 3 === 0) k.sfx('bloop', { vol: 0.5 })
    }
    const xs = [630, 970, 560, 1040, 660, 940, 590, 1010, 640, 960]
    const numBubble = n => {
      const x = xs[n - 1]
      const el = k.prop(numBubbleHtml(n), x, 480, n === 10 ? 170 : 128, n === 10 ? 170 : 128, { z: 40 })
      k.fromTo(el, { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(2.4)' })
      k.to(el, { y: n === 10 ? -160 : -210, duration: 1.4, ease: 'sine.out' })
      k.sfx('bloop')
      k.after(n === 10 ? 1500 : 1150, () => {
        k.to(el, { scale: 1.4, opacity: 0, duration: 0.22, onComplete: () => el.remove() })
        k.sfx('pop')
        if (n === 10) k.burst(x, 320, 12)
      })
    }
    let sayQ = Promise.resolve()
    const say = n => { sayQ = sayQ.then(() => k.sayNumber(n)) }
    const spotsInBasin = [[600, 736], [680, 748], [740, 730], [860, 734], [920, 748], [1000, 736]]
    const flee = i => {
      const g = germs[i]
      k.gsap.killTweensOf(g)
      const c = k.centerOf(g), [tx, ty] = spotsInBasin[i]
      k.sfx('squeak', { vol: 0.6 })
      k.timeline()
        .to(g, { x: `+=${(tx - c.x) * 0.5}`, y: `+=${-120}`, rotation: 200, scale: 0.9, duration: 0.3, ease: 'power2.out' })
        .to(g, { x: `+=${(tx - c.x) * 0.5}`, y: `+=${ty - c.y + 120}`, rotation: 360, scale: 0.55, duration: 0.32, ease: 'power2.in' })
        .to(g, { rotation: 372, duration: 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }
    const scrubRes = k.scrub(hands, {
      need: 5500, sfx: 'scrub', prompt: k.key('q_scrub'), host: pyx,
      onProgress: (p, pos) => {
        // мыло едет за пальцем
        const s = k.centerOf(soap)
        k.to(soap, { x: `+=${(pos.x - s.x)}`, y: `+=${(pos.y - s.y)}`, rotation: -12 + Math.sin(p * 90) * 10, duration: 0.12, overwrite: 'auto' })
        // пена
        const target = Math.floor(p * 46)
        if (!lastFoam || Math.hypot(pos.x - lastFoam.x, pos.y - lastFoam.y) > 34) { addFoam(pos.x + k.rand(-30, 30), pos.y + k.rand(-30, 30)); lastFoam = pos }
        while (foam.length < target) addFoam(k.rand(600, 1000), k.rand(450, 690))
        // счёт до десяти
        const n = Math.floor(p * 10 + 1e-6)
        while (counted < n) { counted++; numBubble(counted); say(counted) }
        // микробики убегают
        const want = Math.min(germs.length, Math.floor(p * 6.4))
        while (fled < want) flee(fled++)
      },
    })
    await scrubRes
    k.to(soap, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'power2.inOut' })
    await sayQ
    k.burst(800, 400, 10)
    await k.wait(400)
    await k.tell(pyx, 'foam', 'laugh')

    // 5. смываем пену
    await k.tapOnEl(knob, { prompt: k.key('q_rinse'), host: pyx })
    waterOn(2.8)
    await k.wait(400)
    k.to(foam, { y: '+=170', opacity: 0, duration: 0.9, stagger: 0.03, ease: 'power1.in', onComplete: () => foam.forEach(f => f.remove()) })
    // вода уносит микробиков в трубу
    germs.forEach((g, i) => k.after(900 + i * 140, () => {
      const c = k.centerOf(g)
      k.gsap.killTweensOf(g)
      k.sfx('bloop')
      k.to(g, { x: `+=${DRAIN.x - c.x}`, y: `+=${DRAIN.y - c.y}`, rotation: 720, scale: 0, duration: 0.7, ease: 'power2.in' })
    }))
    k.to(hands, { rotation: 2, duration: 0.15, yoyo: true, repeat: 5 })
    await k.wait(2200)
    await waterOff()
    await k.tell(pyx, 'flush', 'laugh')

    // 6. вытираем полотенцем
    const tc = k.centerOf(towel), hc = k.centerOf(hands)
    k.gsap.set(towel, { zIndex: 31 })
    await k.play(k.gsap.to(towel, { x: hc.x - tc.x, y: hc.y - tc.y + 10, rotation: 8, scale: 1.1, duration: 0.7, ease: 'back.out(1.4)' }))
    await k.scrub(hands, {
      need: 3200, sfx: 'scrub', prompt: k.key('q_towel'), host: pyx,
      onProgress: (p, pos) => {
        const s = k.centerOf(towel)
        k.to(towel, { x: `+=${pos.x - s.x}`, y: `+=${pos.y - s.y}`, rotation: 8 + Math.sin(p * 80) * 8, duration: 0.12, overwrite: 'auto' })
        const keep = Math.ceil((1 - p) * drops.length)
        drops.forEach((d, i) => { if (i >= keep && !d.dataset.gone) { d.dataset.gone = 1; k.to(d, { scale: 0, opacity: 0, duration: 0.25 }) } })
      },
    })
    drops.forEach(d => { if (!d.dataset.gone) k.to(d, { scale: 0, opacity: 0, duration: 0.25 }) })
    k.to(towel, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.6, ease: 'power2.inOut', onComplete: () => k.gsap.set(towel, { zIndex: 6 }) })
    k.sfx('ding')
    for (const [x, y] of [[640, 470], [960, 470], [800, 600]]) k.sparkle(x, y, 5)
    k.to(hands, { y: -14, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' })
    await k.tell(pyx, 'clean', 'cheer')

    // итог
    await k.tell(kapa, 'why', 'nod')
    await k.tell(pyx, 'sum', 'point')
    await k.tell(pyx, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
