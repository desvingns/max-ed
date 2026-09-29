// «Лимонад: кисло-сладко» — вода до полоски, выжимаем лимоны, сахар ложками,
// шкала вкуса «кисло — в самый раз — слишком сладко», лёд. Главная мысль: кислого и сладкого нужно поровну.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, R, HL, SH, S } from '../art.js'

// ── кувшин (300×380), уровень жидкости l = 0..1 ──
const JUG = { x: 800, y: 530, w: 300, h: 380 }
const BODY = 'M48 44L238 44L232 338Q231 356 213 356L73 356Q55 356 54 338Z'
const GOAL = [0.62, 0.9] // зелёная полоса: отпустить можно в этом диапазоне
const levelY = l => JUG.y - JUG.h / 2 + 350 - 290 * l // мировая y поверхности

let uid = 0
const jugArt = () => {
  const id = `lmj${++uid}`
  const yTop = 350 - 290 * GOAL[1], yBot = 350 - 290 * GOAL[0], my = (yTop + yBot) / 2
  return svg(300, 380,
    SH(140, 374, 104, 8) +
    L('M236 96C298 96 302 262 230 288', INK, 36) + L('M236 96C298 96 302 262 230 288', '#EAF7FF', 24) +
    `<path d="${BODY}" fill="#EAF7FF" fill-opacity=".55"/>` +
    `<clipPath id="${id}"><path d="${BODY}"/></clipPath><g clip-path="url(#${id})">` +
      '<rect class="liq" x="0" y="350" width="300" height="0" fill="#BFE9FF"/>' +
      '<rect class="liq-top" x="0" y="350" width="300" height="10" fill="#fff" opacity=".4"/>' +
    '</g>' +
    P(BODY, 'none', { sw: 6 }) +
    R(34, 30, 218, 22, 11, '#F4FBFF') +
    R(68, 84, 12, 176, 6, '#fff', { sw: 0, attr: 'opacity=".65"' }) +
    // зелёная полоса: сюда налить воду
    `<rect x="58" y="${yTop}" width="170" height="${yBot - yTop}" fill="#2E9E5B" opacity=".28"/>` +
    `<path d="M58 ${yTop}L228 ${yTop}M58 ${yBot}L228 ${yBot}" stroke="#2E9E5B" stroke-width="6" stroke-dasharray="14 9" stroke-linecap="round"/>` +
    P(`M26 ${my - 18}L54 ${my}L26 ${my + 18}Z`, '#2E9E5B', { sw: 4 }))
}

const bottleArt = () => svg(110, 260,
  SH(55, 256, 40, 5) +
  S('M30 96Q30 72 46 62L46 38L64 38L64 62Q80 72 80 96L80 238Q80 252 66 252L44 252Q30 252 30 238Z', '#CFF0FF', '#8FD3F5',
    { extra: '<rect x="20" y="118" width="80" height="140" fill="#62C6FF" opacity=".6"/>' }) +
  R(38, 12, 34, 28, 8, '#4D96FF') +
  R(34, 150, 42, 56, 10, '#fff', { sw: 4 }) +
  P('M55 160Q69 180 55 194Q41 180 55 160Z', '#4DA8FF', { sw: 3 }) +
  HL(42, 110, 4, 22, 8, 0.75))

const iceArt = () => svg(90, 90,
  S('M12 22Q12 12 22 12L68 12Q78 12 78 22L78 68Q78 78 68 78L22 78Q12 78 12 68Z', '#E4F7FF', '#A9DCF2', { sw: 5 }) +
  HL(30, 30, 11, 5, -35, 0.9) + L('M56 60L66 50', '#fff', 4, 'opacity=".85"'))

// высокий предмет в карточке (карточка ограничивает высоту svg только для квадратных картинок)
const tall = (art, w, h) => `<div style="width:100%;height:100%;display:grid;place-items:center"><div style="width:${w}px;height:${h}px;transform:scale(1.2)">${art}</div></div>`
const drop = c => `<div style="width:100%;height:100%;border-radius:50%;background:${c}"></div>`
const grain = '<div style="width:100%;height:100%;background:#fff;border-radius:3px;box-shadow:0 0 0 2px #B7D4EA"></div>'

export default defineLevel({
  id: 'lemonade',
  async run(k) {
    const FL = k.layout.floorY
    k.kitchenBg()
    const pyx = k.pyx({ x: 250 })
    const pig = k.guest('pig', 1400, FL, { size: 300, face: 'left' })
    const bar = k.stepsBar(['💧', '🍋', '🍬', '🧊', '😋'])
    const jug = k.prop(jugArt(), JUG.x, JUG.y, JUG.w, JUG.h, { z: 6 })
    const liq = jug.querySelector('.liq'), liqTop = jug.querySelector('.liq-top')
    const mouth = { x: 1345, y: 842 }

    // жидкость в кувшине
    let waterL = 0, liqColor = '#BFE9FF'
    const setLevel = (l, dur = 0.12) => {
      const y = 350 - 290 * l
      k.to(liq, { attr: { y, height: 356 - y }, duration: dur, overwrite: 'auto' })
      k.to(liqTop, { attr: { y }, duration: dur, overwrite: 'auto' })
    }
    const setColor = (c, dur = 0.7) => { liqColor = c; k.to([liq], { fill: c, duration: dur }) }
    // капельки по дуге из точки в точку
    const drops = (from, to, color, n = 7) => {
      for (let i = 0; i < n; i++) {
        const s = k.rand(10, 17)
        const d = k.prop(drop(color), from.x + k.rand(-24, 24), from.y + k.rand(-12, 8), s, s, { z: 13 })
        const dx = to.x - from.x + k.rand(-26, 26), dy = to.y - from.y, up = k.rand(70, 140), dur = k.rand(0.5, 0.75), dl = i * 0.045
        k.to(d, { x: dx, duration: dur, ease: 'none', delay: dl })
        k.timeline({ delay: dl }).to(d, { y: -up, duration: dur * 0.45, ease: 'power2.out' }).to(d, { y: dy, duration: dur * 0.55, ease: 'power2.in', onComplete: () => d.remove() })
      }
    }
    // «попробовать»: стаканчик летит к Хрюне
    const sip = async (emote, lineId, sound = 'yum') => {
      const from = { x: JUG.x + 30, y: 470 }
      const g = k.prop(kitchen.glass(0.62, liqColor), from.x, from.y, 84, 119, { z: 15 })
      k.fromTo(g, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25 })
      k.sfx('pour', { vol: 0.5 })
      await k.play(k.gsap.to(g, { x: mouth.x - 45 - from.x, y: mouth.y - 45 - from.y, duration: 0.75, ease: 'power2.inOut' }))
      await k.play(k.gsap.to(g, { rotation: 36, x: '+=24', y: '+=52', duration: 0.3, ease: 'power1.inOut' }))
      k.sfx(sound, { vol: 0.6 })
      pig.emote(emote)
      await k.tell(pig, lineId)
      k.to(g, { opacity: 0, scale: 0.6, duration: 0.3, onComplete: () => g.remove() })
    }

    // шкала вкуса (появится после лимонов)
    let v = 0.06, meter = null
    const setV = x => { v = Math.max(0, Math.min(1, x)); meter?.set(v) }

    k.fromTo(jug, { y: -260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'bounce.out' })
    await k.wait(600)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(pig, 'pig_hi', 'happy')

    // ───── 1. вода до полоски ─────
    bar.set(0)
    const bottle = k.prop(bottleArt(), 1130, 600, 110, 260, { z: 8 })
    k.fromTo(bottle, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    await k.wait(650)
    const stream = k.prop('<div style="width:100%;height:100%;border-radius:8px;background:#7FD0FF"></div>', 795, 400, 16, 10, { z: 7 })
    stream.style.display = 'none'
    const pourPt = { x: 795, y: 350 }
    const bc = k.centerOf(bottle) // покой
    const tilt = () => k.to(bottle, { x: pourPt.x + 116 - bc.x, y: pourPt.y - 31 - bc.y, rotation: -105, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
    const untilt = () => { stream.style.display = 'none'; k.to(bottle, { x: 0, y: 0, rotation: 0, duration: 0.4, ease: 'back.out(1.6)', overwrite: 'auto' }) }
    let misses = 0
    waterL = await k.hold(bottle, {
      duration: 4.2, goal: GOAL, prompt: k.key('q_water'), host: pyx, sfx: null,
      onStart: () => { tilt(); stream.style.display = 'block' },
      onLevel: p => {
        setLevel(p, 0.1)
        const y0 = pourPt.y, y1 = p > 0 ? levelY(p) : levelY(0)
        Object.assign(stream.style, { top: `${y0}px`, height: `${Math.max(4, y1 - y0)}px`, left: `${pourPt.x - 8}px` })
        if (p > 0 && Math.random() < 0.25) k.sfx('pour', { vol: 0.25 })
      },
      onRelease: () => untilt(),
      onMiss: () => { if (++misses <= 2) k.tell(pyx, 'more') },
      onOver: () => {
        untilt(); k.sfx('splash')
        drops({ x: 880, y: 360 }, { x: 990, y: 700 }, '#7FD0FF', 9)
        k.tell(pyx, 'over', 'surprised')
      },
    })
    setLevel(waterL, 0.2)
    k.to(bottle, { opacity: 0, y: 60, duration: 0.4, onComplete: () => bottle.remove() })
    k.sparkle(795, levelY(waterL), 6)
    await k.tell(pyx, 'water_ok', 'cheer')

    // ───── 2. лимоны ─────
    bar.set(1)
    const lemons = [0, 1, 2].map(i => k.food('lemon', 960 + i * 125, 660, 124, { z: 8 }))
    k.fromTo(lemons, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.12, ease: 'bounce.out' })
    await k.wait(900)
    const juiceCol = ['#E6F6C6', '#F3F3A0', '#FFEE78']
    const squeeze = (el, i) => {
      k.sfx('squeak', { vol: 0.7 }); k.sfx('splash', { vol: 0.35 })
      const c = k.centerOf(el)
      k.timeline()
        .to(el, { scaleX: 1.3, scaleY: 0.5, duration: 0.12, ease: 'power2.in' })
        .to(el, { scaleX: 0.9, scaleY: 1.1, duration: 0.2, ease: 'back.out(3)' })
        .to(el, { scaleX: 0.8, scaleY: 0.8, opacity: 0.45, duration: 0.3 })
      drops(c, { x: 795, y: levelY(waterL) }, '#FFE94D', 8)
      k.after(650, () => setColor(juiceCol[i]))
      k.sayNumber(i + 1)
    }
    await k.tapAll(lemons, { prompt: k.key('q_lemon'), host: pyx, onTap: (el, i) => squeeze(el, i) })
    await k.wait(900)
    await k.tell(pyx, 'lemon_done', 'point')
    k.to(lemons, { opacity: 0, y: 50, duration: 0.4, stagger: 0.05, onComplete: () => lemons.forEach(e => e.remove()) })

    // шкала вкуса
    meter = k.meter({ x: 800, y: 178, w: 560, zones: [
      { from: 0, to: 0.3, color: '#FFE066', face: '😖' },
      { from: 0.3, to: 0.68, color: '#8AC926', face: '😋' },
      { from: 0.68, to: 1, color: '#FF9EC8', face: '🥴' },
    ], value: v })
    const endL = k.prop('<span class="emoji" style="font-size:54px;line-height:1">🍋</span>', 476, 178, 70, 70, { z: 66 })
    const endR = k.prop('<span class="emoji" style="font-size:54px;line-height:1">🍬</span>', 1124, 178, 70, 70, { z: 66 })
    k.popIn([endL, endR])
    await k.wait(500)
    await sip('surprised', 'sour', 'yuck')
    await k.tell(pyx, 'sour_why', 'think')

    // что добавить?
    await k.choose({
      prompt: k.key('q_fix'), host: pyx, skill: 'science:taste',
      options: k.shuffle([
        { id: 'salt', art: tall(food('saltShaker'), 120, 200), color: '#FF5A5F', outcome: async () => { k.sfx('yuck'); pig.emote('sad'); await k.tell(pyx, 'fix_salt', 'laugh') } },
        { id: 'lemon', art: food('lemon'), color: '#FFD93D', outcome: async () => { k.sfx('yuck'); pig.emote('surprised'); await k.tell(pyx, 'fix_lemon', 'shake') } },
        { id: 'sugar', art: food('sugarJar'), color: '#FF8FC8', correct: true, outcome: async () => { k.sfx('pop'); await k.tell(pyx, 'fix_sugar', 'happy') } },
      ]),
    })

    // ───── 3. сахар ─────
    bar.set(2)
    const jar = k.food('sugarJar', 1130, 630, 150, { z: 8 })
    const spoon = k.food('spoon', 1130, 566, 56, { z: 14 })
    spoon.style.opacity = '0'
    k.gsap.set(spoon, { transformOrigin: '50% 12%' })
    k.fromTo(jar, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    await k.wait(700)
    let spoons = 0
    const scoop = async () => {
      spoons++
      k.sfx('pop')
      const head = { x: 1130, y: 486 }
      await k.play(k.gsap.fromTo(spoon, { opacity: 0, y: 30, rotation: 0 }, { opacity: 1, y: 0, duration: 0.2 }))
      await k.play(k.gsap.to(spoon, { x: 800 - head.x, y: 405 - head.y, rotation: -105, duration: 0.55, ease: 'power2.inOut' }))
      await k.play(k.gsap.to(spoon, { rotation: -150, duration: 0.25, ease: 'power1.in' }))
      k.sfx('sprinkle')
      for (let i = 0; i < 12; i++) {
        const s = k.rand(8, 12)
        const g = k.prop(grain, 780 + k.rand(-26, 30), 420, s, s, { z: 13 })
        k.to(g, { y: levelY(waterL) - 415 + k.rand(0, 14), x: k.rand(-8, 8), opacity: 0, duration: 0.45, delay: i * 0.03, ease: 'power1.in', onComplete: () => g.remove() })
      }
      await k.wait(500)
      k.sayNumber(spoons)
      await k.play(k.gsap.to(spoon, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'power2.inOut' }))
      k.to(spoon, { opacity: 0, duration: 0.2 })
    }
    let first = true
    while (v < 0.3) {
      await k.tapN(jar, 1, first ? { prompt: k.key('q_sugar'), host: pyx } : {})
      first = false
      await scoop()
      setV(v + 0.115)
      await k.wait(350)
      if (v >= 0.24 && v < 0.3) await sip('think', 'meh')
    }
    setColor('#FFF08A')
    await sip('laugh', 'tasty')
    k.burst(795, 420, 10)
    await k.tell(pyx, 'good', 'cheer')

    // а если много сахара? (Хрюня любит послаще)
    await k.tell(pig, 'pig_more', 'jump')
    await k.tell(pyx, 'q_more', 'nod')
    while (v < 0.69) {
      await k.tapN(jar, 1, {})
      await scoop()
      setV(v + 0.115)
      await k.wait(300)
    }
    await sip('sad', 'too_sweet', 'yuck')
    k.to([jar, spoon], { opacity: 0, y: 40, duration: 0.4, onComplete: () => { jar.remove(); spoon.remove() } })

    // как исправить? — кислинка
    const lem2 = [0, 1].map(i => k.food('lemon', 1030 + i * 140, 660, 124, { z: 8 }))
    k.fromTo(lem2, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.12, ease: 'bounce.out' })
    await k.wait(800)
    await k.tapAll(lem2, {
      prompt: k.key('q_fix2'), host: pyx,
      onTap: (el, i) => {
        k.sfx('squeak', { vol: 0.7 }); k.sfx('splash', { vol: 0.35 })
        const c = k.centerOf(el)
        k.timeline().to(el, { scaleX: 1.3, scaleY: 0.5, duration: 0.12 }).to(el, { scaleX: 0.9, scaleY: 1.1, duration: 0.2, ease: 'back.out(3)' }).to(el, { scaleX: 0.8, scaleY: 0.8, opacity: 0.45, duration: 0.3 })
        drops(c, { x: 795, y: levelY(waterL) }, '#FFE94D', 8)
        k.after(500, () => setV(v - 0.13))
      },
    })
    await k.wait(900)
    k.to(lem2, { opacity: 0, y: 50, duration: 0.4, onComplete: () => lem2.forEach(e => e.remove()) })
    await sip('happy', 'fixed')

    // ───── 4. лёд ─────
    bar.set(3)
    const saucer = k.prop(kitchen.plate(), 1140, 702, 260, 90, { z: 5 })
    const cubes = [0, 1, 2].map(i => ({ id: `ice${i}`, el: k.prop(iceArt(), 1070 + i * 72, 668, 76, 76, { z: 9 }) }))
    k.fromTo([saucer, ...cubes.map(c => c.el)], { y: -260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'bounce.out' })
    await k.wait(800)
    await k.dnd({
      items: cubes, zones: [{ id: 'jug', el: jug, pad: 70 }], prompt: k.key('q_ice'), host: pyx,
      accept: () => true,
      onCorrect: async (it, z, placed) => {
        const n = placed.size
        const tx = 738 + (n - 1) * 52 + k.rand(-6, 6), ty = levelY(waterL) + 6
        it.el.style.zIndex = '9'
        const c = k.centerOf(it.el)
        await k.play(k.gsap.to(it.el, { x: `+=${tx - c.x}`, y: `+=${ty - c.y - 30}`, scale: 0.85, duration: 0.35, ease: 'power2.in' }))
        k.sfx('plop'); k.sfx('splash', { vol: 0.4 })
        drops({ x: tx, y: ty }, { x: tx + 30, y: ty }, '#D9F2FF', 4)
        k.to(it.el, { y: '+=30', duration: 0.25, ease: 'bounce.out' })
        k.to(it.el, { y: '+=7', rotation: k.rand(-12, 12), duration: 1.3 + n * 0.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.3 })
        await k.sayNumber(n)
      },
    })
    k.to(saucer, { opacity: 0, duration: 0.4 })
    k.sparkle(795, 470, 8)
    await k.tell(pyx, 'ice_cold', 'cheer')

    // ───── 5. пьём ─────
    bar.set(4)
    const slice = k.food('lemonSlice', 900, 372, 84, { z: 10 })
    slice.style.transform = 'rotate(-14deg)'
    k.popIn(slice)
    await k.tell(pyx, 'serve', 'point')
    await sip('laugh', 'yum')
    bar.done(4)
    k.burst(795, 420, 12)
    await k.tell(pyx, 'sum', 'point')
    await k.tell(pig, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
