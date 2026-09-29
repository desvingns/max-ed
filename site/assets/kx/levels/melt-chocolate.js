// «Тает и застывает» — тепло растапливает шоколад, холод его застужает; шоколад можно растопить снова.
// Биты: плитка → кусочки в миску над горячей водой (плита со взрослым) → мешаем до гладкого → макаем клубнику →
// поднос в холодильник → застыло! → выбор «что будет на солнце?» → шоколад тает.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, circlePath, star, nid } from '../art.js'

const BR = { base: '#7B4A2E', shade: '#5C3620', light: '#A0673F' }
const RED = { base: '#FF5A5F', shade: '#E0474C' }

// ───────────────────────── картинки ─────────────────────────

const square = (x, y, w, h, rot = 0) =>
  `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">${R(x, y, w, h, 5, BR.base, { sw: 4 })}${R(x + 5, y + 5, w - 10, h - 11, 3, '#93603C', { sw: 0 })}${HL(x + w * 0.3, y + h * 0.3, w * 0.14, 2.6, -8, 0.5)}</g>`

const barArt = () => svg(260, 170,
  SH(130, 164, 110, 7) +
  [0, 1, 2].map(c => [0, 1].map(r => square(14 + c * 78, 10 + r * 66, 70, 60)).join('')).join('') +
  P('M8 104L34 96L60 106L92 94L124 106L160 96L196 106L226 96L252 104L252 156Q252 166 242 166L18 166Q8 166 8 156Z', '#FF5A5F', { sw: 5 }) +
  F('M8 104L34 96L60 106L92 94L124 106L160 96L196 106L226 96L252 104L252 116L8 116Z', '#FF8A8A') +
  C(130, 142, 16, '#FFD93D', { sw: 4 }) + P(star(130, 142, 11, 5, 5), '#fff', { sw: 0 }))

/** миска над кастрюлей: внутри кусочки (.pieces) и лужица растопленного шоколада (.pool) */
const bowlArt = () => {
  const id = nid('cb')
  const pcs = [[92, 56], [126, 50], [160, 58], [194, 52], [112, 72], [176, 74]]
    .map(([x, y], i) => square(x - 16, y - 11, 32, 22, (i * 23) % 30 - 15)).join('')
  return svg(300, 170,
    SH(150, 164, 122, 7) +
    S('M12 62Q12 152 150 156Q288 152 288 62Z', '#DDE6F2', '#B4C0D8', { extra: '<rect x="40" y="92" width="12" height="46" rx="6" fill="#fff" opacity=".55"/>' }) +
    E(150, 60, 140, 34, '#F4F6FC') + E(150, 63, 124, 27, '#8C95B4') +
    `<clipPath id="${id}"><ellipse cx="150" cy="63" rx="122" ry="25"/></clipPath>` +
    `<g clip-path="url(#${id})">` +
      `<g class="pool" opacity="0"><ellipse cx="150" cy="66" rx="124" ry="27" fill="${BR.shade}"/><ellipse cx="150" cy="63" rx="112" ry="22" fill="${BR.base}"/>` +
        `<g class="gloss" opacity="0"><path d="M64 62Q100 50 148 54" fill="none" stroke="${BR.light}" stroke-width="6" stroke-linecap="round"/><ellipse cx="196" cy="60" rx="22" ry="4.5" fill="#C48A5A"/></g></g>` +
      `<g class="pieces">${pcs}</g>` +
    `</g>` + E(150, 60, 140, 34, 'none'))
}

const BERRY = 'M75 30C120 20 148 44 140 84C130 128 96 160 75 164C54 160 20 128 10 84C2 44 30 20 75 30Z'
/** клубника: 'raw' | 'wet' (мокрая, с каплями) | 'set' (застыла) | 'melt' (тает, длинные потёки) */
const berryArt = (state = 'raw') => {
  const id = nid('sb')
  const seeds = [[44, 62], [76, 54], [108, 64], [58, 92], [92, 94], [76, 124], [44, 112], [108, 114]]
    .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="4.6" fill="#FFE9A8"/>`).join('')
  const coatTop = state === 'melt'
    ? 'M-10 70Q10 66 26 84Q34 100 46 80Q60 62 80 82Q92 104 104 78Q118 60 136 82Q146 90 160 74V200H-10Z'
    : 'M-10 78Q10 70 26 80Q40 90 54 76Q66 66 80 78Q96 90 108 74Q122 64 136 78Q146 84 160 76V200H-10Z'
  const drips = state === 'wet'
    ? `<path d="M52 162Q50 178 56 184Q62 178 60 162Z" fill="${BR.base}" stroke="${INK}" stroke-width="3"/><path d="M92 156Q92 172 98 176Q103 170 100 154Z" fill="${BR.base}" stroke="${INK}" stroke-width="3"/>`
    : state === 'melt'
      ? `<path d="M30 110Q26 150 34 174Q44 184 50 172Q52 140 46 108Z" fill="${BR.base}" stroke="${INK}" stroke-width="3.5"/><path d="M96 130Q92 160 100 178Q112 186 116 170Q116 150 108 128Z" fill="${BR.base}" stroke="${INK}" stroke-width="3.5"/><path d="M62 150Q60 176 68 184Q78 184 78 168Q76 154 72 148Z" fill="${BR.base}" stroke="${INK}" stroke-width="3.5"/>`
      : ''
  const shine = state === 'set'
    ? `<path d="M40 120Q50 104 66 100" fill="none" stroke="${BR.light}" stroke-width="6" stroke-linecap="round" opacity=".9"/><ellipse cx="96" cy="128" rx="6" ry="3" fill="#C48A5A"/>`
    : `<path d="M34 118Q44 100 62 96" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".55"/><path d="M96 130Q104 120 112 118" fill="none" stroke="${BR.light}" stroke-width="5" stroke-linecap="round" opacity=".9"/>`
  const leaves = P('M75 32L52 16L62 34L34 34L58 44L44 58L75 46L106 58L92 44L116 34L88 34L98 16Z', '#6BCB77', { sw: 4 })
  return svg(150, 190, SH(75, 168, 50, 5) + drips +
    S(BERRY, RED.base, RED.shade, { extra: seeds }) +
    (state === 'raw' ? '' : `<clipPath id="${id}"><path d="${BERRY}"/></clipPath><g clip-path="url(#${id})"><path d="${coatTop}" fill="${BR.base}"/>${shine}</g><path d="${BERRY}" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`) +
    (state === 'raw' ? HL(40, 74, 8, 16, 20, 0.55) : '') + leaves)
}

const trayArt = () => svg(320, 120,
  SH(160, 112, 140, 7) + R(10, 34, 300, 74, 18, '#B4C0D8', { sw: 5 }) + R(24, 42, 272, 52, 12, '#FFF8EC', { sw: 4 }) + HL(80, 50, 40, 3, 0, 0.8))

const sunArt = () => {
  const rays = Array.from({ length: 12 }, (_, i) => `<g transform="rotate(${i * 30} 140 140)"><path d="M126 34L140 4L154 34Z" fill="#FFB938" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`).join('')
  return svg(280, 280, rays + S(circlePath(140, 140, 88), '#FFD93D', '#F2B824') +
    R(76, 112, 56, 34, 12, INK, { sw: 0 }) + R(148, 112, 56, 34, 12, INK, { sw: 0 }) + L('M132 126H148', INK, 6) +
    F('M84 118H108Q98 124 92 132Z', '#fff', 'opacity=".55"') + F('M156 118H180Q170 124 164 132Z', '#fff', 'opacity=".55"') +
    L('M104 168Q140 198 176 168', INK, 7) + E(96, 166, 12, 7, '#FF9EB1', { sw: 0 }) + E(184, 166, 12, 7, '#FF9EB1', { sw: 0 }) + HL(96, 80, 22, 8, -30, 0.6))
}

const snow = (col = '#fff') => svg(100, 100, L('M50 6V94M11 28L89 72M11 72L89 28', INK, 14) + L('M50 6V94M11 28L89 72M11 72L89 28', col, 7) +
  [[50, 6], [50, 94], [11, 28], [89, 72], [11, 72], [89, 28]].map(([x, y]) => C(x, y, 8, col, { sw: 4 })).join(''))

const puddleArt = () => svg(300, 60, SH(150, 54, 120, 4) + `<path d="M20 30Q30 8 90 10Q150 2 210 10Q280 10 282 32Q286 52 220 50Q150 58 80 50Q14 50 20 30Z" fill="${BR.base}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M60 26Q100 16 150 20" fill="none" stroke="${BR.light}" stroke-width="6" stroke-linecap="round"/>`)

// картинки для карточек-вариантов
const cardMelt = () => svg(200, 200,
  C(150, 50, 30, '#FFD93D') + `<g transform="translate(150 50)">${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="-40" x2="0" y2="-54" stroke="${INK}" stroke-width="6" stroke-linecap="round" transform="rotate(${i * 45})"/>`).join('')}</g>` +
  R(30, 70, 100, 70, 12, BR.base, { sw: 5 }) + `<path d="M40 138Q38 170 48 176Q58 176 58 150Z M80 140Q80 184 92 186Q104 184 100 142Z" fill="${BR.base}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
  E(100, 188, 74, 10, BR.shade, { sw: 4 }))
const cardCold = () => svg(200, 200,
  R(50, 74, 100, 78, 12, BR.base, { sw: 5 }) + R(58, 82, 84, 62, 8, '#93603C', { sw: 0 }) +
  `<g transform="translate(112 12) scale(.66)">${snow('#BFEAFF').replace(/^<svg[^>]*>/, '<g>').replace(/<\/svg>$/, '</g>')}</g>`)

export default defineLevel({
  id: 'melt-chocolate',
  async run(k) {
    const gs = k.gsap
    k.kitchenBg()
    const st = k.stove()
    const pyx = k.pyx({ x: 250 })
    const hamster = k.guest('shchyok', 990, k.layout.floorY, { size: 250, face: 'left' })

    // кастрюля с водой на конфорке (пузырьки скрыты, пока плита выключена)
    const pot = k.onBurner(k.prop(kitchen.pot({ lid: false, boiling: true }), 0, 0, 300, 230, { z: 6 }), 0, 300, 230)
    pot.querySelector('.kp-shadow')?.style.setProperty('visibility', 'hidden')
    const potBubbles = [...pot.querySelectorAll('.bubble')]
    gs.set(potBubbles, { autoAlpha: 0 })
    const BOWL = { x: 720, y: 232 }, OPEN = { x: 720, y: 207 }
    const bowl = k.prop(bowlArt(), BOWL.x, BOWL.y, 300, 170, { z: 7 })
    gs.set(bowl, { scale: 0, autoAlpha: 0 })
    const pieces = bowl.querySelector('.pieces'), pool = bowl.querySelector('.pool'), gloss = bowl.querySelector('.gloss')
    const spoon = k.prop(kitchen.spoonWood(), OPEN.x, OPEN.y + 8 - 72, 46, 144, { z: 9 })
    gs.set(spoon, { transformOrigin: '50% 100%', rotation: 30, autoAlpha: 0 })

    const setMelt = p => {
      gs.set(pool, { opacity: p > 0.08 ? 1 : 0, scaleX: 0.25 + 0.75 * p, scaleY: 0.25 + 0.75 * p, svgOrigin: '150 66' })
      gs.set(pieces, { opacity: 1 - Math.max(0, (p - 0.45) / 0.55), scale: 1 - 0.5 * p, svgOrigin: '150 58' })
      gs.set(gloss, { opacity: Math.max(0, Math.min(1, (p - 0.6) * 2.5)) })
    }
    const steamPuff = (x = 720 + k.rand(-150, 150)) => {
      const s = k.prop(kitchen.steam(), x, 285, 90, 65, { z: 9 })
      k.fromTo(s, { scale: 0.4, opacity: 0.9 }, { y: -k.rand(80, 130), x: k.rand(-30, 30), scale: 1.15, opacity: 0, duration: 1.1, ease: 'power1.out', onComplete: () => s.remove() })
    }
    let steaming = () => {}
    /** перенести элемент в другого родителя, сохранив его видимое положение */
    const reparent = (el, parent) => {
      const c = k.centerOf(el), w = el.offsetWidth, h = el.offsetHeight
      const ox = parent === k.world ? 0 : parseFloat(parent.style.left), oy = parent === k.world ? 0 : parseFloat(parent.style.top)
      parent.appendChild(el)
      el.style.left = `${c.x - w / 2 - ox}px`; el.style.top = `${c.y - h / 2 - oy}px`
      gs.set(el, { x: 0, y: 0 })
    }

    // ─── 1. плитка шоколада ───
    const bar = k.prop(barArt(), 1170, 640, 210, 137, { z: 6 })
    k.fromTo(bar, { y: -300, opacity: 0, rotation: -25 }, { y: 0, opacity: 1, rotation: 0, duration: 0.7, ease: 'bounce.out' })
    k.sfx('boing', { vol: 0.5 })
    await k.wait(500)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(hamster, 'hamster_hi', 'happy')
    await k.tell(pyx, 'idea', 'point')

    // ломаем плитку на кусочки → в миску
    k.sfx('pop')
    k.popIn(bowl); gs.to(bowl, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' })
    k.sfx('whoosh', { vol: 0.5 })
    const bc = k.centerOf(bar)
    for (let i = 0; i < 6; i++) {
      const pc = k.prop(svg(34, 26, square(1, 1, 32, 24)), bc.x + k.rand(-70, 70), bc.y + k.rand(-30, 30), 40, 30, { z: 12 })
      k.to(pc, { x: OPEN.x - bc.x + k.rand(-60, 60), y: OPEN.y - bc.y - 30, rotation: k.rand(-180, 180), duration: 0.7, delay: i * 0.08, ease: 'power2.inOut', onComplete: () => { pc.remove(); if (i % 2) k.sfx('clonk', { vol: 0.4 }) } })
    }
    k.to(bar, { scale: 0.1, autoAlpha: 0, duration: 0.5 })
    await k.tell(pyx, 'bowl', 'nod')
    gs.to(spoon, { autoAlpha: 1, duration: 0.4 })

    // ─── 2. плита — только со взрослым ───
    await k.adultHelp({ knob: st.knobEl(0), host: pyx })
    st.on(0)
    gs.to(potBubbles, { autoAlpha: 1, duration: 0.6, stagger: 0.05 })
    gs.to(potBubbles, { y: -6, duration: 0.5, yoyo: true, repeat: -1, stagger: 0.07, ease: 'sine.inOut' })
    const stopSteam = k.every(650, () => steamPuff(k.pick([600, 840])))
    steaming = stopSteam
    // тепло делает кусочки мягкими
    const m = { p: 0 }
    k.to(m, { p: 0.32, duration: 2.2, ease: 'power1.inOut', onUpdate: () => setMelt(m.p) })
    await k.tell(pyx, 'warm', 'point')
    await k.wait(400)

    // ─── 3. мешаем до гладкого ───
    let cur = m.p
    await k.stir(OPEN, {
      radius: 100, turns: 3, prompt: k.key('q_stir'), host: pyx, spoon,
      onProgress: p => { cur = 0.32 + 0.68 * p; setMelt(cur) },
      moveSpoon: (cx, cy) => {
        const tx = OPEN.x + (cx - OPEN.x) * 0.4, ty = OPEN.y + 8 + (cy - OPEN.y) * 0.25
        gs.set(spoon, { x: tx - OPEN.x, y: ty - OPEN.y })
      },
    })
    setMelt(1)
    gs.to(spoon, { x: 0, y: 0, duration: 0.3 })
    k.sfx('yum', { vol: 0.5 })
    k.burst(OPEN.x, OPEN.y - 20, 8)
    await k.tell(pyx, 'smooth', 'happy')

    // выключаем
    await k.tapOnEl(st.knobEl(0), { prompt: 'e.kitchen-omelet.off', host: pyx })
    st.off(0)
    steaming()
    gs.killTweensOf(potBubbles); gs.to(potBubbles, { autoAlpha: 0, y: 0, duration: 0.4 })
    gs.to(spoon, { autoAlpha: 0, duration: 0.4 })

    // ─── 4. макаем клубнику ───
    const plate = k.food('plate2', 1420, 700, 230, { z: 4 })
    const tray = k.prop(trayArt(), 1190, 700, 250, 94, { z: 5 })
    k.popIn([plate, tray], 0.1)
    const berries = [1370, 1425, 1480].map((x, i) => {
      const el = k.prop(berryArt('raw'), x, 640 - (i === 1 ? 6 : 0), 92, 116, { z: 8, cls: 'kx-food' })
      el.dataset.food = 'strawberry'
      return el
    })
    k.fromTo(berries, { y: -260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'bounce.out' })
    await k.wait(900)
    const bowlZone = k.prop('', BOWL.x, BOWL.y, 320, 200, { z: 1 })
    let done = 0
    const slot = [[-78, -8], [0, -14], [78, -8]]
    await k.dnd({
      items: berries.map((el, i) => ({ id: `b${i}`, el })), zones: [{ id: 'bowl', el: bowlZone, pad: 30 }], accept: () => true,
      prompt: k.key('q_dip'), host: pyx,
      onCorrect: async (it) => {
        const el = it.el, i = done++
        el.style.zIndex = '10'
        const c = k.centerOf(el)
        await k.play(gs.to(el, { x: `+=${OPEN.x - c.x}`, y: `+=${OPEN.y - 35 - c.y}`, rotation: 0, duration: 0.35, ease: 'power2.out' }))
        await k.play(gs.to(el, { y: '+=45', duration: 0.25, ease: 'power1.in' }))
        k.sfx('bloop')
        el.innerHTML = berryArt('wet')
        await k.play(gs.to(el, { y: '-=45', duration: 0.3, ease: 'power1.out' }))
        // на поднос
        const tc = k.centerOf(tray), c2 = k.centerOf(el)
        await k.play(gs.to(el, { x: `+=${tc.x + slot[i][0] - c2.x}`, y: `+=${tc.y + slot[i][1] - c2.y - 22}`, rotation: 8 - i * 8, duration: 0.55, ease: 'power2.inOut' }))
        k.sfx('plop')
        // переносим на поднос (чтобы ехали вместе)
        reparent(el, tray)
        el.style.zIndex = '3'
        if (i === 0) await k.tell(hamster, 'dip1', 'happy')
        await k.sayNumber(i + 1, pyx)
      },
    })
    k.burst(1190, 640, 8)
    await k.tell(pyx, 'three', 'happy')

    // ─── 5. холод: поднос — в холодильник ───
    const FR = { x: 1440, y: 738, w: 250, h: 444 }
    const fridge = k.prop(kitchen.fridge(), FR.x, FR.y, FR.w, FR.h, { z: 5 })
    const fridgeOpen = k.prop(kitchen.fridge({ fridgeOpen: true }), FR.x, FR.y, FR.w, FR.h, { z: 5 })
    gs.set(fridgeOpen, { autoAlpha: 0 })
    k.fromTo([fridge, fridgeOpen], { x: 320 }, { x: 0, duration: 0.7, ease: 'back.out(1.4)' })
    k.sfx('whoosh')
    plate.remove()
    await k.tell(pyx, 'q_cold', 'point')
    const fridgeZone = k.prop('', FR.x, FR.y, FR.w, FR.h, { z: 1 })
    let home = null
    await k.dnd({
      items: [{ id: 'tray', el: tray }], zones: [{ id: 'fridge', el: fridgeZone, pad: 30 }], accept: () => true,
      prompt: k.key('q_fridge'), host: pyx,
      onCorrect: async () => {
        tray.style.zIndex = '8'
        gs.set(fridge, { autoAlpha: 0 }); gs.set(fridgeOpen, { autoAlpha: 1 })
        k.sfx('click')
        const c = k.centerOf(tray)
        home = { x: c.x, y: c.y }
        await k.play(gs.to(tray, { x: `+=${FR.x - 8 - c.x}`, y: `+=${FR.y + 76 - c.y}`, scale: 0.55, duration: 0.6, ease: 'power2.inOut' }))
        await k.wait(300)
        gs.set(tray, { autoAlpha: 0 })
        gs.set(fridgeOpen, { autoAlpha: 0 }); gs.set(fridge, { autoAlpha: 1 })
        k.sfx('clonk')
      },
    })
    // ждём: снежинки, «динь»
    const flakes = []
    await k.tell(pyx, 'wait', 'think')
    for (let i = 0; i < 6; i++) {
      const f = k.prop(snow('#BFEAFF'), FR.x + k.rand(-90, 90), FR.y - 60 + k.rand(-40, 100), 44, 44, { z: 9 })
      flakes.push(f)
      k.fromTo(f, { scale: 0, rotation: 0, opacity: 1 }, { scale: 1, rotation: 180, y: -k.rand(20, 60), duration: 1.6, delay: i * 0.25, ease: 'sine.out' })
      k.to(f, { opacity: 0, duration: 0.4, delay: 1.6 + i * 0.25 - 0.4 })
    }
    await k.wait(2000)
    flakes.forEach(f => f.remove())
    k.sfx('ding')
    // достаём
    gs.set(fridge, { autoAlpha: 0 }); gs.set(fridgeOpen, { autoAlpha: 1 })
    k.sfx('click')
    gs.set(tray, { autoAlpha: 1 })
    for (const el of [...tray.querySelectorAll('.kx-food')]) el.innerHTML = berryArt('set')
    await k.play(gs.to(tray, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'power2.inOut' }))
    gs.set(fridgeOpen, { autoAlpha: 0 }); gs.set(fridge, { autoAlpha: 1 })
    k.burst(home.x, home.y - 40, 10)
    await k.tell(pyx, 'hard', 'cheer')

    // Щёчкин пробует
    const first = tray.querySelector('.kx-food')
    reparent(first, k.world)
    const fc = k.centerOf(first)
    first.style.zIndex = '20'
    const hc = k.centerOf(hamster.el)
    await k.play(gs.to(first, { x: `+=${hc.x + 20 - fc.x}`, y: `+=${hc.y - 40 - fc.y}`, scale: 0.4, duration: 0.7, ease: 'power2.inOut' }))
    first.remove()
    k.sfx('crunch')
    await k.tell(hamster, 'crunch', 'laugh')

    // ─── 6. что будет на солнце? ───
    await k.choose({
      prompt: k.key('q_sun'), host: pyx,
      options: [
        { id: 'cold', art: cardCold(), color: '#62C6FF', outcome: async () => { await k.tell(pyx, 'sun_wrong', 'shake') } },
        { id: 'melt', art: cardMelt(), color: '#FFB938', correct: true, outcome: async () => { await k.tell(pyx, 'sun_ok', 'point') } },
      ],
    })
    // солнце греет — клубничка тает
    const sun = k.prop(sunArt(), 1150, 458, 190, 190, { z: 12 })
    k.fromTo(sun, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.6)' })
    k.to(sun, { rotation: 8, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.8 })
    k.sfx('magic', { vol: 0.6 })
    await k.wait(900)
    const hw = k.prop(kitchen.heatWaves(), 1190, 590, 110, 138, { z: 11 })
    k.fromTo(hw, { opacity: 0 }, { opacity: 0.85, duration: 0.6 })
    const berriesLeft = [...tray.querySelectorAll('.kx-food')]
    await k.wait(900)
    berriesLeft.forEach(el => { el.innerHTML = berryArt('melt') })
    const puddles = berriesLeft.map(el => {
      const c = k.centerOf(el)
      const pd = k.prop(puddleArt(), c.x, c.y + 62, 120, 24, { z: 2 })
      reparent(pd, tray)
      pd.style.zIndex = '2'
      k.fromTo(pd, { scaleX: 0.1, scaleY: 0.2 }, { scaleX: 1, scaleY: 1, duration: 1.6, ease: 'power1.out' })
      return pd
    })
    k.sfx('bloop'); k.after(400, () => k.sfx('bloop')); k.after(900, () => k.sfx('bloop'))
    k.to(berriesLeft, { scaleY: 0.86, y: '+=8', duration: 1.6, ease: 'power1.in' })
    await k.tell(hamster, 'melt', 'surprised')
    k.to([sun, hw], { autoAlpha: 0, duration: 0.6 })

    // ─── 7. вывод ───
    await k.tell(pyx, 'sum1', 'point')
    await k.tell(pyx, 'sum2', 'nod')
    await k.tell(hamster, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
