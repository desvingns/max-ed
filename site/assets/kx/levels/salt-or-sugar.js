// «Соль или сахар?» — белые крупинки похожи; читаем слова (обе начинаются на С!), сладим чай, солим картошку,
// а баночку без этикетки не пробуем — спрашиваем взрослого.
import { defineLevel } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, F, R, C, SH, S, HL } from '../art.js'

/** Кучка одинаковых белых крупинок (для «пузыря сравнения»). */
const crystals = () => {
  const cubes = [[40, 92, 0], [70, 96, 14], [100, 90, -10], [56, 70, 22], [86, 70, -18], [72, 48, 8], [30, 66, -12], [110, 64, 20]]
  return svg(140, 120, cubes.map(([x, y, r]) => R(x - 10, y - 10, 20, 20, 4, '#fff', { sw: 3.5, ink: '#8FB0CC', rot: r })).join('') + HL(70, 44, 8, 3, -20, 0.6))
}

/** Банка без этикетки: в ней «?»; потом на этикетке проявится слово. */
const mysteryJar = () => {
  const jar = 'M30 44L120 44L128 60L128 160Q128 176 112 176L38 176Q22 176 22 160L22 60Z'
  const grains = [[44, 100], [66, 108], [92, 100], [56, 114], [84, 116]].map(([x, y]) => `<rect x="${x}" y="${y}" width="8" height="8" rx="2"/>`).join('')
  return svg(150, 184,
    SH(75, 178, 56, 5) + S(jar, '#F4FBFF', '#C9DFF0') +
    F('M24 96L126 96L128 160Q128 176 112 176L38 176Q22 176 22 160Z', '#FFFFFF', 'opacity=".85"') +
    P('M26 44Q26 26 75 26Q124 26 124 44Z', '#B8C0CC', { sw: 5 }) + C(75, 24, 8, '#8C95B4', { sw: 4 }) +
    `<g fill="#fff" stroke="#C9DFF0" stroke-width="2">${grains}</g>` +
    R(32, 110, 86, 44, 8, '#FFF8EC', { sw: 4 }) +
    `<text class="lbl" x="75" y="144" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="34" fill="#8C6BC8">?</text>` +
    HL(36, 110, 5, 24, 0, 0.7))
}
export const ART = { crystals, mysteryJar }

export default defineLevel({
  id: 'salt-or-sugar',
  async run(k) {
    k.bgTable({ wall: '#E6F6EA', dot: '#C9EBD2', cloth: '#7ED3A0', cloth2: '#A9E6C3' })
    const pyx = k.pyx({ x: 230 })
    const ham = k.guest('shchyok', 1425, 705, { size: 320 })
    const JY = 655 // «центр» банок на столе
    const LX = 520, RX = 940
    const jar = (which, cx) => which === 'salt'
      ? k.food('saltShaker', cx, JY, 150, { z: 8 })
      : k.food('sugarJar', cx, JY, 185, { z: 8 })
    const emoji = (e, size = 110) => `<span class="emoji" style="font-size:${size}px;line-height:1">${e}</span>`

    // ── маленькие помощники ──
    const grains = (x, y, toY, n = 14) => {
      for (let i = 0; i < n; i++) {
        const g = k.prop('<div style="width:100%;height:100%;background:#fff;border-radius:2px;box-shadow:0 0 0 2px #C9DFF0"></div>', x + k.rand(-16, 16), y, 10, 10, { z: 30 })
        k.to(g, { y: toY - y + k.rand(-8, 8), x: k.rand(-14, 14), opacity: 0, duration: 0.55, delay: i * 0.04, ease: 'power1.in', onComplete: () => g.remove() })
      }
    }
    /** банка встаёт слева от цели, наклоняется горлышком вправо и сыплет крупинки */
    const pourInto = async (el, target) => {
      const t = k.centerOf(target), c = k.centerOf(el)
      await k.play(k.gsap.to(el, { x: `+=${t.x - 96 - c.x}`, y: `+=${t.y - 175 - c.y}`, rotation: 110, duration: 0.5, ease: 'power2.out' }))
      k.sfx('sprinkle')
      grains(t.x, t.y - 125, t.y - 20)
      await k.wait(750)
    }
    const yuck = async (line, emote = 'sad') => {
      k.sfx('yuck')
      const b = k.bubble('🤢', 1240, 470, { w: 170, h: 150, tail: 'right', font: 80 })
      await k.tell(ham, line, emote)
      k.to(b, { scale: 0, opacity: 0, duration: 0.25, onComplete: () => b.remove() })
    }
    const word = (text, cx, cy, color) => {
      const W = text.length * 80 - 6
      const el = k.prop(`<div style="display:flex;gap:6px;width:100%;height:100%">${[...text].map(ch => `<div class="tl" style="flex:0 0 74px;height:88px;border-radius:18px;background:#fff;box-shadow:inset 0 0 0 6px ${color},0 6px 0 rgba(0,0,0,.14);display:grid;place-items:center;font:900 56px/1 var(--font);color:${color}">${ch}</div>`).join('')}</div>`, cx, cy, W, 88, { z: 14 })
      return { el, tiles: [...el.querySelectorAll('.tl')] }
    }

    // ── 1. знакомство: две одинаковые баночки ──
    await k.wait(300)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(ham, 'wants', 'happy')
    let salt = jar('salt', LX), sugar = jar('sugar', RX)
    k.popIn([salt, sugar], 0.2)
    await k.wait(500)
    await k.tell(pyx, 'jars', 'point')
    const same = [LX, RX].map(x => k.bubble(`<div style="width:120px;height:104px">${crystals()}</div>`, x, 380, { w: 190, h: 170, tail: 'left' }))
    k.sfx('magic', { vol: 0.5 })
    await k.tell(pyx, 'same', 'think')
    ham.moveTo({ x: 1160, y: 705 })
    await k.tell(ham, 'lick', 'surprised')
    ham.moveTo({ x: 1425, y: 705 })
    await k.tell(pyx, 'stop', 'shake')
    k.to(same, { scale: 0, opacity: 0, duration: 0.25, stagger: 0.05, onComplete: () => same.forEach(s => s.remove()) })

    // ── 2. буквы: оба слова начинаются на С ──
    const wSalt = word('СОЛЬ', LX, 880, '#4D96FF'), wSugar = word('САХАР', RX, 880, '#FF5A9E')
    k.popIn([wSalt.el, wSugar.el], 0.25)
    await k.wait(500)
    await k.tapAll([wSalt.tiles[0], wSugar.tiles[0]], {
      prompt: k.key('q_c'), host: pyx,
      onTap: el => { k.sfx('ding', { vol: 0.5 }); k.to(el, { scale: 1.3, yoyo: true, repeat: 1, duration: 0.15 }); k.sparkle(k.centerOf(el).x, k.centerOf(el).y, 4) },
    })
    await k.tell(ham, 'both_c', 'laugh')
    const spell = (w, line) => {
      k.to(w.tiles, { y: -22, yoyo: true, repeat: 1, duration: 0.16, stagger: 0.32 })
      return k.tell(pyx, line, 'point')
    }
    await spell(wSugar, 'read_sugar')
    await spell(wSalt, 'read_salt')
    await k.tell(pyx, 'know', 'nod')
    k.to([wSalt.el, wSugar.el], { opacity: 0, y: 30, duration: 0.3, onComplete: () => { wSalt.el.remove(); wSugar.el.remove() } })

    // ── 3. чай: сладить ──
    const tea = k.prop(kitchen.teaCup(), 1195, 800, 240, 192, { z: 6 })
    k.popIn(tea)
    await k.wait(300)
    const round = async (target, items, promptKey, spec, ok) => {
      await k.dnd({
        items, zones: [{ id: 'target', el: target }],
        prompt: k.key(promptKey), host: pyx,
        accept: it => it.id === spec.right,
        onWrong: async it => {
          k.gsap.killTweensOf(it.el) // не даём jar убежать домой — сначала «сыпем» куда не надо
          await pourInto(it.el, target)
          await yuck(spec.line)
          if (spec.pyx) await k.tell(pyx, spec.pyx, 'shake')
          await k.play(k.gsap.to(it.el, { x: 0, y: 0, rotation: 0, duration: 0.55, ease: 'back.out(1.6)' }))
        },
        onCorrect: async it => {
          await pourInto(it.el, target)
          k.sfx('yum'); k.sparkle(k.centerOf(target).x, k.centerOf(target).y - 40, 6)
          await k.tell(ham, ok, 'happy')
        },
      })
      k.to(items.map(i => i.el), { opacity: 0, y: 30, rotation: 0, duration: 0.3 })
      await k.wait(350)
      items.forEach(i => i.el.remove())
    }
    const items1 = [{ id: 'sugar', el: sugar }, { id: 'salt', el: salt }] // верная первой — так проще автотесту
    await round(tea, items1, 'q_tea', { right: 'sugar', line: 'tea_bad', pyx: 'tea_bad_p' }, 'tea_ok')
    k.to(tea, { opacity: 0, x: 120, duration: 0.4, onComplete: () => tea.remove() })

    // ── 4. картошка: посолить (банки поменялись местами) ──
    await k.tell(ham, 'potato', 'think')
    const plateEl = k.food('plate2', 1195, 850, 300, { z: 5 })
    const pot1 = k.food('potato', 1160, 800, 130, { z: 6 }), pot2 = k.food('potato', 1240, 805, 110, { z: 6 })
    const dill = k.food('dill', 1200, 770, 70, { z: 7 })
    const zonePlate = k.prop('', 1195, 800, 300, 190, { z: 4 })
    k.popIn([plateEl, pot1, pot2, dill])
    salt = jar('salt', RX); sugar = jar('sugar', LX)
    k.popIn([salt, sugar], 0.2)
    await k.wait(600)
    await round(zonePlate, [{ id: 'salt', el: salt }, { id: 'sugar', el: sugar }], 'q_potato', { right: 'salt', line: 'pot_bad' }, 'pot_ok')
    k.to([plateEl, pot1, pot2, dill], { opacity: 0, y: 30, duration: 0.3 })

    // ── 5. безопасность: банка без этикетки ──
    const mj = k.prop(mysteryJar(), 760, JY, 185, 227, { z: 8 })
    k.fromTo(mj, { y: -400, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    k.sfx('boing', { vol: 0.5 })
    await k.tell(pyx, 'mystery', 'surprised')
    ham.moveTo({ x: 1080, y: 705 })
    await k.tell(ham, 'mystery_h', 'happy')
    await k.choose({
      prompt: k.key('q_unknown'), host: pyx, skill: 'safety:unknown',
      options: [
        { id: 'lick', art: emoji('👅'), color: '#FF5A5F', outcome: async () => { k.sfx('yuck'); await k.tell(pyx, 'c_lick', 'shake') } },
        { id: 'pour', art: emoji('🍵'), color: '#FFB938', outcome: async () => { k.sfx('wrong', { vol: 0.5 }); await k.tell(pyx, 'c_pour', 'shake') } },
        {
          id: 'ask', art: emoji('👩‍🍳'), color: '#6BCB77', correct: true,
          outcome: async () => {
            k.sfx('correct')
            await k.tell(pyx, 'c_ask', 'cheer')
            const b = k.bubble('👩‍🍳', 300, 255, { w: 230, h: 190, tail: 'left', font: 100 })
            k.sfx('magic')
            await k.wait(700)
            mj.querySelector('.lbl').textContent = 'МУКА'
            mj.querySelector('.lbl').setAttribute('font-size', '26')
            k.sparkle(760, JY, 6)
            await k.tell(pyx, 'mama', 'point')
            k.to(b, { scale: 0, opacity: 0, duration: 0.25, onComplete: () => b.remove() })
            ham.emote('surprised')
            await k.tell(ham, 'phew', 'laugh')
          },
        },
      ],
    })

    await k.tell(pyx, 'sum', 'point')
    await k.tell(ham, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
