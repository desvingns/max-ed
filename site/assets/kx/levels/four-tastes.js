// «Четыре вкуса» — Щёчкин пробует мёд, чипсы, лимон и грейпфрут (тащим еду ему в рот),
// затем малыш раскладывает угощения по тарелкам с мордочками вкусов: сладкое, солёное, кислое, горькое.
import { defineLevel } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, circlePath, ellipsePath, rounded, capsule } from '../art.js'

// ───────────────────────── свои спрайты ─────────────────────────
const heart = (cx, cy, s, fill) =>
  `<path d="M${cx} ${cy + s * 0.9}C${cx - s * 1.5} ${cy - s * 0.1} ${cx - s * 0.7} ${cy - s * 1.3} ${cx} ${cy - s * 0.4}C${cx + s * 0.7} ${cy - s * 1.3} ${cx + s * 1.5} ${cy - s * 0.1} ${cx} ${cy + s * 0.9}Z" fill="${fill}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`

export const COLORS = { sweet: '#FF8FC8', salty: '#62C6FF', sour: '#A6CF2B', bitter: '#9B6BFF' }

/** Мордочки вкусов 120×120. */
export const face = kind => {
  const base = { sweet: '#FFB3DA', salty: '#A6DDFF', sour: '#DDF06A', bitter: '#C7ABF7' }[kind]
  const shade = { sweet: '#F08CBB', salty: '#74BDEB', sour: '#B7D23A', bitter: '#A184DB' }[kind]
  let f = ''
  if (kind === 'sweet') {
    f = L('M32 56Q41 43 50 56', INK, 6) + L('M70 56Q79 43 88 56', INK, 6) +
      E(28, 70, 9, 6, '#FF7FB5', { sw: 0 }) + E(92, 70, 9, 6, '#FF7FB5', { sw: 0 }) +
      P('M36 70Q60 106 84 70Z', '#FF5A5F', { sw: 5 }) + E(60, 82, 12, 5, '#FF9AA8', { sw: 0 }) +
      heart(20, 22, 8, '#FF5A9E') + heart(102, 16, 6, '#FF5A9E')
  } else if (kind === 'salty') {
    f = C(43, 54, 10, '#fff', { sw: 4 }) + C(77, 54, 10, '#fff', { sw: 4 }) + C(45, 56, 4.5, INK, { sw: 0 }) + C(75, 56, 4.5, INK, { sw: 0 }) +
      E(60, 84, 11, 13, '#FF5A5F', { sw: 5 }) + E(60, 90, 6, 6, '#FF9AA8', { sw: 0 }) +
      P('M100 20Q112 40 100 48Q88 40 100 20Z', '#4D96FF', { sw: 4 }) + P('M16 34Q24 48 16 54Q8 48 16 34Z', '#4D96FF', { sw: 4 })
  } else if (kind === 'sour') {
    f = L('M30 46L52 54L30 62', INK, 6) + L('M90 46L68 54L90 62', INK, 6) +
      P('M50 84Q60 70 70 84Q60 98 50 84Z', '#E0474C', { sw: 5 }) + L('M40 74L46 79M80 74L74 79M42 94L47 90M78 94L73 90', INK, 4) +
      L('M98 22L108 12M106 36L118 34M14 26L6 18', '#F2B824', 5)
  } else {
    f = L('M31 44L52 52M89 44L68 52', INK, 6) + L('M31 58Q41 66 51 58', INK, 5) + L('M69 58Q79 66 89 58', INK, 5) +
      L('M38 82Q49 74 60 82Q71 90 82 82', INK, 5) + P('M56 86Q58 108 70 104Q76 94 72 84Z', '#FF7A93', { sw: 4 })
  }
  return svg(120, 120, S(circlePath(60, 60, 52), base, shade) + f)
}

const candy = () => svg(150, 100,
  SH(75, 94, 52, 5) +
  P('M38 50L6 24Q18 50 6 76Z', '#FFD93D', { sw: 5 }) + P('M112 50L144 24Q132 50 144 76Z', '#FFD93D', { sw: 5 }) +
  S(ellipsePath(75, 50, 44, 32), '#FF5A9E', '#D93F82', { extra: '<path d="M44 20L62 84M70 18L88 84M96 20L112 80" stroke="#fff" stroke-width="9" opacity=".75"/>' }) +
  HL(58, 36, 14, 6, -25, 0.6))

const chips = () => {
  const c1 = 'M12 74C4 46 32 22 66 22C100 22 124 40 120 70C116 100 86 112 54 108C32 106 16 94 12 74Z'
  const c2 = 'M40 50C36 26 66 8 96 12C126 16 146 40 138 70C130 98 100 100 74 92C54 86 42 72 40 50Z'
  const salt = pts => pts.map(([x, y]) => R(x, y, 6, 6, 1.5, '#fff', { sw: 0, rot: x * 4 })).join('')
  return svg(150, 124,
    SH(75, 118, 58, 5) +
    S(c2, '#FFC94A', '#E8A020', { extra: `<path d="M60 34Q92 22 124 44M62 60Q96 46 130 66" fill="none" stroke="#E8A020" stroke-width="4" opacity=".6"/>` + salt([[96, 28], [116, 54], [82, 70]]) }) +
    S(c1, '#FFD966', '#EFB030', { extra: `<path d="M22 60Q56 36 108 60M24 84Q58 62 106 86" fill="none" stroke="#E8A020" stroke-width="4" opacity=".6"/>` + salt([[40, 44], [82, 42], [98, 74], [34, 84], [64, 90]]) }) +
    HL(44, 44, 16, 5, -22, 0.55))
}

const cracker = () => {
  const body = rounded([[16, 26], [122, 18], [128, 108], [20, 116]], 16)
  const holes = [42, 70, 98].flatMap(x => [44, 68, 92].map(y => `<circle cx="${x + (y - 44) * 0.05}" cy="${y}" r="4" fill="#C98F3E"/>`)).join('')
  const salt = [[30, 32], [84, 30], [108, 56], [50, 80], [92, 100], [28, 96]].map(([x, y]) => R(x, y, 8, 8, 2, '#fff', { sw: 0, rot: x * 5 })).join('')
  return svg(140, 132, SH(70, 124, 54, 5) + S(body, '#F2C879', '#D9A24E', { extra: holes + salt }) + HL(40, 36, 16, 5, -8, 0.6))
}

const pickle = () => {
  const bumps = [[38, 34], [70, 30], [104, 34], [136, 32], [52, 70], [86, 72], [120, 68]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#BBD374"/>`).join('')
  const stripes = '<path d="M22 44Q84 34 148 46M22 68Q84 78 148 66" fill="none" stroke="#5F7A2B" stroke-width="5" stroke-linecap="round" opacity=".45"/>'
  return svg(176, 108,
    SH(88, 100, 62, 5) +
    `<g transform="rotate(-8 88 54)">` + S(capsule(10, 164, 54, 66), '#93B24C', '#6E8C33', { extra: stripes + bumps }) + HL(56, 34, 40, 6, -3, 0.5) + `</g>` +
    P('M150 8Q160 24 150 32Q140 24 150 8Z', '#BFE7FF', { sw: 4 }) + P('M168 28Q174 38 168 44Q162 38 168 28Z', '#BFE7FF', { sw: 3.5 }))
}

const cranberry = () => {
  const b = (x, y, r) => S(circlePath(x, y, r), '#E0344B', '#B02039') + HL(x - r * 0.35, y - r * 0.38, r * 0.28, r * 0.16, -35, 0.6) + C(x + r * 0.05, y - r * 0.68, 3.4, '#7A1B26', { sw: 0 })
  return svg(150, 132,
    SH(75, 124, 56, 5) + b(74, 44, 32) + b(42, 84, 34) + b(106, 84, 34) +
    P('M76 14Q104 0 116 24Q92 32 76 14Z', '#6BCB77', { sw: 4.5 }) + L('M78 16Q98 18 110 24', '#45B57C', 3))
}

const cake = () => {
  const body = rounded([[14, 64], [166, 64], [166, 132], [14, 132]], 14)
  return svg(180, 164,
    SH(90, 156, 72, 5) +
    S(body, '#FFE08A', '#F0BE4E', { extra: R(10, 92, 160, 16, 0, '#FFFFFF', { sw: 0 }) + R(10, 116, 160, 6, 0, '#FF8FC8', { sw: 0 }) }) +
    P('M10 68Q10 46 40 46L140 46Q170 46 170 68L170 76Q160 88 150 76Q142 90 130 76Q120 88 108 76Q96 90 84 76Q72 88 60 76Q48 90 36 76Q24 88 10 76Z', '#FF8FC8', { sw: 5 }) +
    HL(50, 56, 20, 4, -4, 0.55) +
    C(90, 38, 15, '#E0344B', { sw: 5 }) + HL(85, 32, 4.5, 3, -30, 0.7) + L('M90 24Q96 8 112 6', '#45B57C', 5))
}

const choco = () => {
  const grid = '<path d="M50 14V124M82 14V124M14 46H118M14 82H118" stroke="#54301F" stroke-width="5"/>'
  const sq = [[32, 30], [66, 30], [98, 30], [32, 64], [66, 64], [98, 64]].map(([x, y]) => HL(x - 4, y - 4, 7, 3, -30, 0.28)).join('')
  return svg(132, 152,
    SH(66, 146, 48, 5) +
    S(rounded([[14, 12], [118, 12], [118, 112], [14, 112]], 12), '#7A4634', '#54301F', { extra: grid + sq }) +
    P('M10 96L122 96L124 138Q124 146 114 146L18 146Q8 146 8 138Z', '#DCE3EE', { sw: 5 }) + L('M12 110L120 110', '#B8C0CC', 4) + HL(40, 122, 18, 4, -4, 0.7))
}

const grapefruit = () => {
  const wedge = i => {
    const a0 = ((i * 36 + 4) * Math.PI) / 180, a1 = (((i + 1) * 36 - 4) * Math.PI) / 180, r = 46
    const x0 = 70 + Math.cos(a0) * r, y0 = 70 + Math.sin(a0) * r, x1 = 70 + Math.cos(a1) * r, y1 = 70 + Math.sin(a1) * r
    return `<path d="M70 70L${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" fill="${i % 2 ? '#FF8E86' : '#FF7A78'}" stroke="#FFC9C0" stroke-width="2.5" stroke-linejoin="round"/>`
  }
  return svg(140, 140, SH(70, 134, 56, 5) + C(70, 70, 62, '#FFB33D') + C(70, 70, 53, '#FFF1D0', { sw: 0 }) + Array.from({ length: 10 }, (_, i) => wedge(i)).join('') + C(70, 70, 6, '#FFF1D0', { sw: 0 }) + HL(38, 36, 16, 6, -40, 0.6))
}

export const ART = { candy, chips, cracker, pickle, cranberry, cake, choco, grapefruit }
export const SZ = { candy: [150, 100], chips: [150, 124], cracker: [140, 132], pickle: [176, 108], cranberry: [150, 132], cake: [180, 164], choco: [132, 152], grapefruit: [140, 140] }

// какой вкус у чего
const A_ROUND = [
  { id: 'honey', kind: 'sweet', w: 132, intro: 'n1' },
  { id: 'chips', kind: 'salty', w: 150, intro: 'n2' },
  { id: 'lemon', kind: 'sour', w: 170, intro: 'n3' },
  { id: 'grapefruit', kind: 'bitter', w: 136, intro: 'n4' },
]
const B_ROUNDS = [
  [{ id: 'cake', kind: 'sweet', w: 150 }, { id: 'pickle', kind: 'salty', w: 170 }, { id: 'cranberry', kind: 'sour', w: 128 }],
  [{ id: 'choco', kind: 'bitter', w: 116 }, { id: 'candy', kind: 'sweet', w: 150 }, { id: 'cracker', kind: 'salty', w: 132 }],
]
const KINDS = ['sweet', 'salty', 'sour', 'bitter']
const TOTAL = { sweet: 2, salty: 2, sour: 1, bitter: 1 }

export default defineLevel({
  id: 'four-tastes',
  async run(k) {
    k.bgTable()
    const pyx = k.pyx({ x: 230 })
    const ham = k.guest('shchyok', 800, 705, { size: 340 })

    const make = (id, cx, cy, w, z = 8) => {
      if (ART[id]) { const [sw, sh] = SZ[id]; return k.prop(ART[id](), cx, cy, w, Math.round((w * sh) / sw), { z }) }
      return k.food(id, cx, cy, w, { z })
    }
    const faceBubble = (kind, cx, cy, tail = 'left') => {
      const b = k.bubble(`<div style="width:110px;height:110px">${face(kind)}</div>`, cx, cy, { w: 190, h: 170, tail })
      return () => k.to(b, { scale: 0, opacity: 0, duration: 0.25, onComplete: () => b.remove() })
    }
    const mouthOf = () => { const c = k.centerOf(ham.el); return { x: c.x, y: c.y + 0.05 * 340 } }

    // ── вступление ──
    await k.wait(300)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(ham, 'hi', 'happy')
    await k.tell(pyx, 'rule', 'point')

    // ── часть 1: Щёчкин пробует, малыш кормит ──
    const plate = k.food('plate2', 800, 866, 320, { z: 4 })
    k.popIn(plate)
    const mouth = k.prop('', mouthOf().x, mouthOf().y, 280, 220, { z: 9 })

    const eat = async el => {
      const m = mouthOf(), c = k.centerOf(el)
      ham.setMouth(1)
      k.sfx('whoosh', { vol: 0.4 })
      await k.play(k.gsap.to(el, { x: `+=${m.x - c.x}`, y: `+=${m.y - c.y}`, scale: 0.25, opacity: 0, duration: 0.35, ease: 'power2.in' }))
      ham.setMouth(0)
      el.remove()
    }

    const REACT = {
      sweet: async () => {
        k.sfx('yum')
        ham.emote('happy')
        const off = faceBubble('sweet', 1050, 430)
        k.burst(800, 470, 9, { colors: ['#FF8FC8', '#FFC2E0', '#FFE066'] })
        await k.tell(ham, 'sweet')
        off()
      },
      salty: async () => {
        k.sfx('crunch')
        await k.wait(250)
        ham.emote('surprised')
        const off = faceBubble('salty', 1050, 430)
        await k.tell(ham, 'salty')
        // стакан воды приезжает сам
        const glass = k.prop(kitchen.glass(0.85), 1190, 640, 120, 170, { z: 12 })
        k.fromTo(glass, { x: 300, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' })
        await k.wait(600)
        await k.play(k.gsap.to(glass, { x: -262, y: -62, rotation: -55, duration: 0.6, ease: 'power2.inOut' }))
        k.sfx('pour', { vol: 0.7 })
        ham.emote('happy')
        await k.wait(500)
        await k.tell(ham, 'water')
        k.to(glass, { opacity: 0, x: 0, y: 0, rotation: 0, duration: 0.3, onComplete: () => glass.remove() })
        off()
      },
      sour: async () => {
        k.sfx('yuck', { vol: 0.5 })
        const zoom = k.camera({ x: 800, y: 540, scale: 1.35 }, 0.5)
        await zoom
        k.to(ham.el, { scaleX: 0.9, scaleY: 1.06, yoyo: true, repeat: 5, duration: 0.1, transformOrigin: '50% 100%' })
        ham.emote('shake')
        const off = faceBubble('sour', 1050, 400)
        k.burst(800, 470, 8, { colors: ['#DDF06A', '#FFE066', '#FFFFFF'] })
        await k.tell(ham, 'sour')
        off()
        await k.camera({ x: 800, y: 500, scale: 1 }, 0.5)
      },
      bitter: async () => {
        k.sfx('yuck')
        const zoom = k.camera({ x: 800, y: 540, scale: 1.35 }, 0.5)
        await zoom
        ham.emote('sad')
        const off = faceBubble('bitter', 1050, 400)
        k.burst(800, 470, 8, { colors: ['#C7ABF7', '#9B6BFF', '#FFFFFF'] })
        await k.tell(ham, 'bitter')
        off()
        await k.camera({ x: 800, y: 500, scale: 1 }, 0.5)
      },
    }

    for (const [i, a] of A_ROUND.entries()) {
      const el = make(a.id, 800, 826, a.w)
      await k.play(k.gsap.fromTo(el, { y: -420, rotation: -25, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' }))
      k.sfx('boing', { vol: 0.4 })
      await k.tell(pyx, a.intro, 'point')
      const stop = k.fx.pulse(el)
      await k.dnd({
        items: [{ id: a.id, el }], zones: [{ id: 'mouth', el: mouth }],
        accept: () => true, prompt: i === 0 ? k.key('q_feed') : null, host: pyx,
        onPick: stop,
        onCorrect: async () => { stop(); await eat(el); await REACT[a.kind]() },
      })
      stop()
      await k.wait(200)
    }
    // ── часть 2: раскладываем по тарелкам вкусов ──
    k.to(plate, { opacity: 0, y: 40, duration: 0.3, onComplete: () => plate.remove() })
    mouth.remove()
    const zones = KINDS.map((kind, i) => {
      const el = k.prop(
        `<div style="position:relative;width:100%;height:100%;border-radius:40px;background:rgba(255,255,255,.92);box-shadow:inset 0 0 0 10px ${COLORS[kind]},0 10px 0 rgba(0,0,0,.14)"><div style="position:absolute;left:50%;top:8px;width:92px;height:92px;transform:translateX(-50%)">${face(kind)}</div></div>`,
        400 + i * 240, 872, 220, 200, { z: 3 })
      return { id: kind, kind, el, n: 0 }
    })
    k.popIn(zones.map(z => z.el), 0.25)
    ham.moveTo({ x: 1400, y: 705 })
    await k.tell(pyx, 'four', 'cheer')
    await k.wait(300)

    let said = { sweet: 0, salty: 0 }
    for (const [r, round] of B_ROUNDS.entries()) {
      if (r === 1) await k.tell(pyx, 'round2', 'cheer')
      const xs = [520, 760, 1000]
      const items = k.shuffle(round).map((it, i) => ({ ...it, el: make(it.id, xs[i], 690, it.w, 20) }))
      await k.play(k.gsap.fromTo(items.map(i => i.el), { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' }))
      await k.dnd({
        items, zones,
        prompt: r === 0 ? k.key('q_sort') : null, host: pyx,
        accept: (it, z) => it.kind === z.kind,
        onCorrect: async (it, z) => {
          const c = k.centerOf(z.el), idx = z.n++
          const dx = TOTAL[z.kind] > 1 ? (idx ? 36 : -36) : 0
          k.sparkle(c.x, c.y, 5)
          await k.play(k.gsap.to(it.el, { x: `+=${c.x + dx - k.centerOf(it.el).x}`, y: `+=${c.y + 50 - k.centerOf(it.el).y}`, scale: 0.55, duration: 0.35, ease: 'back.out(1.4)' }))
          k.to(z.el, { scale: 1.06, yoyo: true, repeat: 1, duration: 0.12 })
          const key = z.kind === 'sweet' || z.kind === 'salty' ? `${z.kind}_ok${said[z.kind]++ ? '2' : ''}` : `${z.kind}_ok`
          await k.tell(ham, key, 'happy')
        },
        onWrong: async (it, z) => {
          if (!z) return
          k.sfx('wrong', { vol: 0.5 })
          const off = faceBubble(it.kind, 1330, 380, 'right')
          await k.tell(ham, `is_${it.kind}`, 'think')
          off()
        },
      })
      await k.wait(300)
    }

    await k.tell(pyx, 'sum', 'point')
    await k.tell(ham, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
