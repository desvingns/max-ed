// «Откуда берётся соль?» — солеварня у моря: пускаем морскую воду в бассейны (держим колесо шлюза), ждём солнце (три дня),
// вода испаряется облачками, а соль остаётся; сгребаем её граблями, Чухтик везёт соль на кухню, Пых фасует её в солонку.
import { defineLevel } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, E, C, R, HL, SH, S, circlePath, nid } from '../art.js'

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v))

/** Парусник (отдельным спрайтом — качается на волнах). */
const boatArt = () => svg(180, 190,
  `<g transform="translate(90 120)">${P('M-70 0L70 0L48 40L-48 40Z', '#FF5A5F', { sw: 5 })}${L('M0 0L0 -110', INK, 6)}${P('M6 -104L6 -12L70 -12Z', '#FFFFFF', { sw: 5 })}${P('M-6 -100L-6 -12L-54 -12Z', '#FFE066', { sw: 5 })}</g>`)

// ───────────────────────── фон: небо, море, берег, каналы, рельсы ─────────────────────────
const PATHS = { main: 'M800 640L800 712', left: 'M800 664L460 664L460 712', right: 'M800 664L1140 664L1140 712' }

const landBg = () => {
  const a = nid('sk'), b = nid('sea')
  const wave = (y, x0, n) => Array.from({ length: n }, (_, i) => `M${x0 + i * 180} ${y}q45 -20 90 0`).join('')
  const sleepers = Array.from({ length: 22 }, (_, i) => R(-20 + i * 80, 906, 46, 26, 4, '#A9793F', { sw: 4 })).join('')
  return svg(1600, 1000,
    `<defs><linearGradient id="${a}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ED4FF"/><stop offset="1" stop-color="#E4F6FF"/></linearGradient>` +
    `<linearGradient id="${b}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4DB4FA"/><stop offset="1" stop-color="#3596EE"/></linearGradient></defs>` +
    `<rect x="-10" y="-10" width="1620" height="1020" fill="url(#${a})"/>` +
    `<g fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"><path d="M300 190q-40 0 -40 -34q0 -34 44 -32q14 -34 60 -22q40 -8 52 26q42 4 36 36q-4 26 -40 26Z"/><path d="M760 120q-30 0 -30 -26q0 -26 34 -24q10 -26 46 -16q30 -6 40 20q32 4 28 28q-3 20 -30 20Z"/></g>` +
    `<rect x="-10" y="320" width="1620" height="240" fill="url(#${b})"/>` +
    `<path d="M-10 322Q40 306 90 322T190 322T290 322T390 322T490 322T590 322T690 322T790 322T890 322T990 322T1090 322T1190 322T1290 322T1390 322T1490 322T1590 322" fill="none" stroke="#fff" stroke-width="6" opacity=".7"/>` +
    `<path d="${wave(390, 60, 9)}${wave(470, 150, 9)}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".45"/>` +
    `<path d="M-10 548Q60 530 130 548T270 548T410 548T550 548T690 548T830 548T970 548T1110 548T1250 548T1390 548T1530 548T1670 548L1670 1010L-10 1010Z" fill="#FFE3A6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<g fill="#F2C878">${[[100, 660], [220, 900], [560, 610], [700, 900], [980, 620], [1300, 610], [1500, 700], [1420, 900], [150, 980]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`).join('')}</g>` +
    // канавки (сухие) — по ним потечёт вода
    Object.values(PATHS).map(d => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="46" stroke-linecap="round" stroke-linejoin="round"/>`).join('') +
    Object.values(PATHS).map(d => `<path d="${d}" fill="none" stroke="#D9B57A" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>`).join('') +
    // рельсы
    sleepers + L('M-20 912L1620 912', INK, 12) + L('M-20 912L1620 912', '#B8C0CC', 6) + L('M-20 928L1620 928', INK, 12) + L('M-20 928L1620 928', '#8C95B4', 6))
}

/** Вода в канавках: рисуется по мере того, как держат колесо (stroke-dashoffset). */
const flowHTML = () => svg(1600, 1000, Object.entries(PATHS).map(([k, d]) =>
  `<path class="fl-${k}" d="${d}" pathLength="1" fill="none" stroke="#5CB8FF" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" stroke-dashoffset="1"/>`).join(''))

// ───────────────────────── бассейн-солеварня ─────────────────────────
const PAN_W = 300, PAN_H = 150, PAN_IN = 110 // высота воды внутри
const panHTML = () => {
  let crystals = ''
  for (let i = 0; i < 46; i++) {
    const x = 6 + Math.random() * 236, y = 4 + Math.random() * 92, s = 14 + Math.random() * 10
    crystals += `<div style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;border-radius:3px;background:#fff;box-shadow:0 0 0 2.5px #B9D3E6;transform:rotate(${Math.random() * 90}deg)"></div>`
  }
  return `<div style="position:relative;width:100%;height:100%">
  <div style="position:absolute;inset:0">${svg(PAN_W, PAN_H, R(4, 4, 292, 142, 36, '#B98B55', { sw: 6 }) + R(20, 20, 260, 110, 24, '#E9D3A8', { sw: 5 }))}</div>
  <div class="ps" style="position:absolute;left:20px;top:20px;width:260px;height:110px;border-radius:24px;background:#F1F8FF;opacity:0;overflow:hidden;box-shadow:inset 0 0 0 4px #CFE3F5"><div style="position:absolute;left:6px;top:6px;width:248px;height:100px">${crystals}</div></div>
  <div class="pw" style="position:absolute;left:20px;bottom:20px;width:260px;height:0;border-radius:22px;background:linear-gradient(#86D0FF,#4DB4FA);box-shadow:inset 0 0 0 4px rgba(255,255,255,.4);opacity:.96"></div>
</div>`
}

// ───────────────────────── шлюз, колесо, солнце, грабли ─────────────────────────
const gatePosts = () => svg(220, 190,
  R(6, 40, 34, 146, 6, '#A9793F', { sw: 5 }) + R(180, 40, 34, 146, 6, '#A9793F', { sw: 5 }) + R(0, 26, 220, 30, 8, '#C68B59', { sw: 5 }) + L('M14 100L32 100M14 140L32 140M188 100L206 100M188 140L206 140', '#7C5A2E', 4))
const gatePlank = () => `<div style="width:100%;height:100%;background:repeating-linear-gradient(90deg,#D9A56A 0 30px,#B98444 30px 34px);border-radius:0 0 10px 10px;box-shadow:inset 0 0 0 5px ${INK}"></div>`
const wheelArt = () => {
  const spokes = Array.from({ length: 6 }, (_, i) => { const a = (i * 60 * Math.PI) / 180; return `<line x1="55" y1="55" x2="${55 + Math.cos(a) * 42}" y2="${55 + Math.sin(a) * 42}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><line x1="55" y1="55" x2="${55 + Math.cos(a) * 42}" y2="${55 + Math.sin(a) * 42}" stroke="#FFD93D" stroke-width="5" stroke-linecap="round"/>` }).join('')
  return svg(110, 110, C(55, 55, 46, 'none', { sw: 12 }) + `<circle cx="55" cy="55" r="46" fill="none" stroke="#FF5A5F" stroke-width="7"/>` + spokes + C(55, 55, 14, '#FFD93D', { sw: 5 }))
}
const sunArt = () => {
  const rays = Array.from({ length: 10 }, (_, i) => `<path d="M80 4L93 30L67 30Z" fill="#FFB938" stroke="${INK}" stroke-width="4" stroke-linejoin="round" transform="rotate(${i * 36} 80 80)"/>`).join('')
  return svg(160, 160, rays + S(circlePath(80, 80, 48), '#FFE066', '#F2B824') +
    E(64, 74, 5, 7, INK, { sw: 0 }) + E(96, 74, 5, 7, INK, { sw: 0 }) + E(52, 90, 9, 6, '#FF9A7A', { sw: 0 }) + E(108, 90, 9, 6, '#FF9A7A', { sw: 0 }) +
    L('M64 92Q80 108 96 92', INK, 5) + HL(60, 52, 12, 5, -30, 0.6))
}
const rakeArt = () => svg(90, 320,
  P('M40 0L52 0L54 226L38 226Z', '#C68B59', { sw: 5 }) + P('M6 220L84 220L84 242L6 242Z', '#8C95B4', { sw: 5 }) +
  [12, 26, 40, 54, 68].map(x => P(`M${x} 242L${x + 5} 276L${x + 10} 242Z`, '#B8C0CC', { sw: 3.5 })).join(''))
const cloudCard = () => svg(130, 120,
  P('M30 84Q6 84 6 62Q6 40 30 40Q34 14 64 14Q94 14 98 40Q124 42 122 64Q120 84 96 84Z', '#fff', { sw: 6 }) +
  [[44, 100], [66, 108], [88, 100]].map(([x, y]) => P(`M${x} ${y - 10}Q${x + 8} ${y + 2} ${x} ${y + 8}Q${x - 8} ${y + 2} ${x} ${y - 10}Z`, '#62C6FF', { sw: 3 })).join(''))

// ───────────────────────── горка соли, вагончик, мешок, солонка ─────────────────────────
const cubes = (pts, sw = 3) => pts.map(([x, y, r]) => R(x - 8, y - 8, 16, 16, 3, '#fff', { sw, ink: '#8FB0CC', rot: r })).join('')
const pileArt = () => svg(260, 150,
  SH(130, 140, 110, 8) + P('M14 136Q30 60 90 50Q130 -4 170 50Q230 60 246 136Q130 152 14 136Z', '#F1F8FF', { sw: 6 }) +
  cubes([[70, 100, 10], [120, 80, -12], [170, 96, 20], [100, 118, 0], [150, 122, -18], [200, 118, 8], [128, 50, 25], [60, 122, -6]]) + HL(96, 66, 18, 6, -30, 0.7))
const wagonArt = () => svg(290, 190,
  `<g class="load" opacity="0"><path d="M36 50Q70 -6 145 -8Q220 -6 254 50Z" fill="#F1F8FF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${cubes([[90, 26, 10], [140, 6, -12], [190, 24, 20], [116, 34, 0], [168, 36, -18]])}</g>` +
  P('M14 46L276 46L252 124L38 124Z', '#C68B59', { sw: 6 }) + L('M30 74L262 74M36 100L256 100', '#8E5F2B', 5) + R(8, 40, 274, 16, 6, '#A9793F', { sw: 5 }) +
  `<circle cx="84" cy="140" r="28" fill="#8C95B4" stroke="${INK}" stroke-width="6"/><circle cx="84" cy="140" r="9" fill="#FFD93D" stroke="${INK}" stroke-width="4"/>` +
  `<circle cx="206" cy="140" r="28" fill="#8C95B4" stroke="${INK}" stroke-width="6"/><circle cx="206" cy="140" r="9" fill="#FFD93D" stroke="${INK}" stroke-width="4"/>` +
  L('M14 96L-10 96', INK, 8))
const sackArt = () => svg(180, 220,
  SH(90, 212, 70, 6) + P('M30 70Q10 110 18 178Q24 208 60 210L120 210Q156 208 162 178Q170 110 150 70Q135 56 90 56Q45 56 30 70Z', '#E2C08D', { sw: 6 }) +
  P('M62 56L52 18Q90 30 128 18L118 56Z', '#D4AA6E', { sw: 5 }) + L('M52 56Q90 68 128 56', '#8E5F2B', 6) +
  R(44, 106, 92, 56, 12, '#fff', { sw: 4 }) + `<text x="90" y="146" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="34" fill="#4D96FF">СОЛЬ</text>` +
  HL(50, 130, 6, 30, 0, 0.35))
const SHAKER_BODY = 'M30 72Q26 68 28 60L40 36Q75 26 110 36L122 60Q124 68 120 72L128 222Q128 240 112 242L38 242Q22 240 22 222Z'
const shakerArt = () => {
  const id = nid('sk')
  return svg(150, 250,
    SH(75, 246, 56, 6) + `<clipPath id="${id}"><path d="${SHAKER_BODY}"/></clipPath>` +
    `<path d="${SHAKER_BODY}" fill="#EAF6FF"/>` +
    `<g clip-path="url(#${id})"><rect class="fill" x="0" y="242" width="150" height="0" fill="#fff"/><rect class="fill2" x="0" y="242" width="150" height="6" fill="#DCEBF7" opacity="0"/></g>` +
    `<path d="${SHAKER_BODY}" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    P('M30 40Q75 28 120 40L124 62L26 62Z', '#B8C0CC', { sw: 6 }) + [[54, 46], [75, 42], [96, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="${INK}"/>`).join('') +
    HL(42, 150, 5, 34, 0, 0.6))
}
const SHAKER_MAX = 190 // px внутри 250-пиксельного вьюбокса

export const ART = { boatArt, landBg, panHTML, sunArt, rakeArt, pileArt, wagonArt, sackArt, shakerArt, cloudCard }

export default defineLevel({
  id: 'sea-salt',
  async run(k) {
    const gsap = k.gsap
    const seaBg = k.bg(landBg())
    const ham = k.guest('shchyok', 150, 800, { size: 280, face: 'right' })
    const emoji = (e, size = 100) => `<span class="emoji" style="font-size:${size}px;line-height:1">${e}</span>`

    // ── сцена: канавки с водой, шлюз, бассейны ──
    const boat = k.prop(boatArt(), 360, 395, 180, 190, { z: 1 })
    boat.style.pointerEvents = 'none'
    k.to(boat, { y: 9, rotation: 3, yoyo: true, repeat: -1, duration: 1.9, ease: 'sine.inOut' })
    const flow = k.prop(flowHTML(), 800, 500, 1600, 1000, { z: 2 })
    flow.style.pointerEvents = 'none'
    const pans = [460, 800, 1140].map(x => k.prop(panHTML(), x, 780, PAN_W, PAN_H, { z: 3 }))
    const pw = pans.map(p => p.querySelector('.pw')), ps = pans.map(p => p.querySelector('.ps'))
    const plank = k.prop(gatePlank(), 800, 610, 126, 100, { z: 5 })
    const posts = k.prop(gatePosts(), 800, 600, 220, 190, { z: 6 })
    const wheel = k.prop(wheelArt(), 800, 520, 110, 110, { z: 8 })
    const sun = k.prop(sunArt(), 1180, 170, 160, 160, { z: 14 })
    const dots = [1120, 1180, 1240].map(x => k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 5px #FFB938,0 4px 0 rgba(0,0,0,.15)"></div>', x, 290, 40, 40, { z: 14 }))
    gsap.set([plank, posts, wheel, sun, ...dots], { opacity: 0 })
    ;[plank, posts, ...dots].forEach(e => { e.style.pointerEvents = 'none' })
    gsap.set(pans, { opacity: 0 })
    const night = k.prop('<div style="width:100%;height:100%;background:#1B2B6B"></div>', 800, 500, 1600, 1000, { z: 55 })
    night.style.pointerEvents = 'none'
    gsap.set(night, { opacity: 0 })
    const moon = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#FFF3B0;box-shadow:inset -14px -6px 0 #F2D874,0 0 40px #FFF3B0"></div>', 1180, 170, 90, 90, { z: 56 })
    moon.style.pointerEvents = 'none'
    gsap.set(moon, { opacity: 0 })

    // ── вступление ──
    await k.wait(300)
    await k.tell(ham, 'hello', 'wave')
    await k.tell(ham, 'sea', 'point')
    gsap.to([plank, posts, wheel], { opacity: 1, duration: 0.5 })
    gsap.fromTo(pans, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.6)' })
    k.sfx('whoosh')
    await k.wait(900)
    await k.tell(ham, 'pans', 'point')

    // ── 1. пускаем воду: держим колесо ──
    const setFlow = p => {
      const pm = clamp(p / 0.4), pb = clamp((p - 0.3) / 0.4)
      flow.querySelector('.fl-main').setAttribute('stroke-dashoffset', String(1 - pm))
      flow.querySelector('.fl-left').setAttribute('stroke-dashoffset', String(1 - pb))
      flow.querySelector('.fl-right').setAttribute('stroke-dashoffset', String(1 - pb))
      const lv = [clamp((p - 0.6) / 0.4), clamp((p - 0.35) / 0.45), clamp((p - 0.6) / 0.4)]
      pw.forEach((w, i) => { w.style.height = `${lv[i] * PAN_IN}px` })
      gsap.set(plank, { y: -60 * clamp(p * 3) })
      gsap.set(wheel, { rotation: p * 540 })
    }
    await k.hold(wheel, {
      duration: 3.2, prompt: k.key('q_fill'), host: ham,
      onLevel: p => setFlow(p),
    })
    setFlow(1)
    k.to(plank, { y: 0, duration: 0.6, ease: 'bounce.out' }) // шлюз закрываем, вода осталась в бассейнах
    k.to(flow, { opacity: 0, duration: 1.6, delay: 0.6 })
    k.sfx('splash', { vol: 0.5 })
    k.sparkle(800, 780, 8)
    ham.emote('cheer')
    await k.tell(ham, 'filled', 'cheer')

    // ── 2. ждём солнце: три дня ──
    gsap.to(sun, { opacity: 1, duration: 0.5 })
    gsap.to(dots, { opacity: 1, duration: 0.5, stagger: 0.1 })
    k.to(sun, { rotation: 8, yoyo: true, repeat: -1, duration: 1.4, ease: 'sine.inOut' })
    await k.tell(ham, 'wait', 'point')
    const vapor = () => {
      pans.forEach((p, i) => {
        for (let j = 0; j < 3; j++) {
          const c = k.prop(kitchen.steam(), 460 + i * 340 + k.rand(-70, 70), 690, 90, 65, { z: 12 })
          gsap.set(c, { opacity: 0 })
          k.timeline({ delay: j * 0.35 + i * 0.1, onComplete: () => c.remove() })
            .to(c, { opacity: 0.95, duration: 0.3 }, 0)
            .to(c, { y: -k.rand(230, 330), x: k.rand(-30, 30), scale: 1.5, duration: 2.1, ease: 'power1.out' }, 0)
            .to(c, { opacity: 0, duration: 0.8 }, 1.4)
        }
      })
    }
    const day = async n => {
      const lvl = 1 - n / 3
      k.sfx('sparkle')
      vapor()
      const tl = k.timeline()
      tl.to(sun, { scale: 1.25, duration: 0.3, ease: 'back.out(2)' })
        .to(night, { opacity: 0.5, duration: 0.5 }, 0.9)
        .to(sun, { opacity: 0, y: 40, duration: 0.4 }, 0.9)
        .to(moon, { opacity: 1, duration: 0.4 }, 1.0)
        .to(night, { opacity: 0, duration: 0.5 }, 1.8)
        .to(moon, { opacity: 0, duration: 0.4 }, 1.8)
        .to(sun, { opacity: 1, y: 0, scale: 1, duration: 0.4 }, 1.8)
      pw.forEach(w => k.to(w, { height: lvl * PAN_IN, duration: 2.2, ease: 'sine.inOut' }))
      ps.forEach(s => k.to(s, { opacity: n === 3 ? 1 : n === 2 ? 0.35 : 0, duration: 2.2, delay: n === 3 ? 0.6 : 1 }))
      dots[n - 1].firstElementChild.style.background = '#FFE066'
      dots[n - 1].style.zIndex = '14'
      await k.play(tl)
      k.to(dots[n - 1], { scale: 1.25, yoyo: true, repeat: 1, duration: 0.15 })
    }
    for (let n = 1; n <= 3; n++) {
      await k.tapN(sun, 1, { prompt: n === 1 ? k.key('q_sun') : null, host: ham })
      const d = day(n)
      await k.sayNumber(n)
      await k.tell(ham, `day${n}`, n === 3 ? 'surprised' : 'point')
      await d
    }
    k.sfx('magic', { vol: 0.6 })
    for (const p of pans) k.sparkle(k.centerOf(p).x, k.centerOf(p).y, 5)
    await k.tell(ham, 'gone', 'think')

    // ── 3. что улетело: вода или соль? ──
    await k.choose({
      prompt: k.key('q_where'), host: ham, skill: 'science:evaporate',
      options: [
        { id: 'salt', art: emoji('🧂', 110), color: '#FF5A5F', outcome: async () => { k.sfx('wrong', { vol: 0.5 }); await k.tell(ham, 'c_salt', 'laugh') } },
        { id: 'water', art: cloudCard(), color: '#62C6FF', correct: true, outcome: async () => { k.sfx('correct'); vapor(); await k.tell(ham, 'c_ok', 'cheer') } },
      ],
    })

    // ── 4. сгребаем соль граблями ──
    const zone = k.prop('', 800, 780, 1000, 170, { z: 7 })
    const pile = k.prop(pileArt(), 1180, 846, 240, 139, { z: 9 })
    gsap.set(pile, { scale: 0, transformOrigin: '50% 100%' })
    const rake = k.prop(rakeArt(), 1420, 800, 90, 320, { z: 20 })
    gsap.set(rake, { rotation: -14 })
    k.popIn(rake)
    const r0 = k.centerOf(rake)
    await k.scrub(zone, {
      need: 1700, prompt: k.key('q_rake'), host: ham, sfx: 'grate',
      onProgress: (p, pos) => {
        ps.forEach(s => { s.style.opacity = String(1 - p) })
        gsap.set(pile, { scale: clamp(p * 1.05) })
        if (pos) gsap.to(rake, { x: pos.x - r0.x + 6, y: pos.y - r0.y - 100, duration: 0.12, overwrite: 'auto' })
      },
    })
    ps.forEach(s => { s.style.opacity = '0' })
    k.to(pile, { scale: 1, duration: 0.3 })
    k.to(rake, { x: 1050 - r0.x, y: 810 - r0.y, opacity: 0, duration: 0.5, onComplete: () => rake.remove() })
    k.sparkle(1180, 830, 8)
    await k.tell(ham, 'pile', 'cheer')

    // ── 5. приезжает Чухтик ──
    const chukh = k.guest('chukh', 2120, 921, { size: 260, face: 'left' })
    const wagon = k.prop(wagonArt(), 2400, 836, 290, 190, { z: 10 })
    await k.tell(ham, 'train', 'point')
    k.sfx('whoosh')
    await k.play(gsap.to([chukh.el, wagon], { x: '-=1600', duration: 2.4, ease: 'power2.out' }))
    ham.emote('happy')
    await k.tell(chukh, 'chukh_hi', 'cheer')
    // грузим горку
    const wl = wagon.querySelector('.load')
    const wc = k.centerOf(wagon)
    k.sfx('plop')
    await k.play(gsap.to(pile, { x: wc.x - 1180, y: wc.y - 846 - 40, scale: 0.55, duration: 0.6, ease: 'power2.inOut' }))
    gsap.to(pile, { opacity: 0, duration: 0.2 })
    gsap.to(wl, { opacity: 1, duration: 0.3 })
    k.burst(wc.x, wc.y - 80, 8)
    await k.tell(chukh, 'chukh_go', 'happy')
    k.sfx('whoosh')
    await k.play(gsap.to([chukh.el, wagon], { x: '-=1500', duration: 2.2, ease: 'power1.in' }))

    // ── 6. на кухне: Пых фасует соль в солонку ──
    const kb = k.kitchenBg()
    gsap.to([seaBg, boat, flow, ...pans, plank, posts, wheel, sun, ...dots, pile], { opacity: 0, duration: 0.8, onComplete: () => [boat, flow, ...pans, plank, posts, wheel, sun, ...dots, pile, wagon].forEach(e => e.remove()) })
    ham.moveTo({ x: 1400, y: 960 })
    const pyx = k.pyx({ x: 250 })
    k.popIn(pyx.el)
    const shaker = k.prop(shakerArt(), 640, 598, 160, 267, { z: 8 })
    const sack = k.prop(sackArt(), 900, 622, 180, 220, { z: 9 })
    k.popIn([shaker, sack], 0.2)
    await k.wait(900)
    await k.tell(pyx, 'pyx_hi', 'wave')
    const fill = shaker.querySelector('.fill'), fill2 = shaker.querySelector('.fill2')
    let last = 0
    await k.hold(sack, {
      duration: 3.0, prompt: k.key('q_fill2'), host: pyx,
      onLevel: p => {
        const h = SHAKER_MAX * p
        fill.setAttribute('y', String(242 - h)); fill.setAttribute('height', String(h))
        fill2.setAttribute('y', String(242 - h)); fill2.setAttribute('opacity', p > 0.02 ? '1' : '0')
        gsap.set(sack, { rotation: -38 * clamp(p * 6), x: -170 * clamp(p * 6), y: -30 * clamp(p * 6) })
        if (p - last > 0.06 && p < 1) { last = p; const g = k.prop('<div style="width:100%;height:100%;background:#fff;border-radius:2px;box-shadow:0 0 0 2px #B9D3E6"></div>', 668 + k.rand(-8, 8), 500, 9, 9, { z: 12 }); k.to(g, { y: 60, opacity: 0, duration: 0.3, onComplete: () => g.remove() }) }
      },
    })
    gsap.to(sack, { rotation: 0, x: 0, y: 0, duration: 0.4, ease: 'back.out(1.6)' })
    k.sfx('correct')
    k.burst(640, 520, 10)
    await k.tell(pyx, 'full', 'cheer')
    await k.tell(pyx, 'sum', 'point')
    await k.tell(ham, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
