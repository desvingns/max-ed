// «Масло из сливок» — Бурёнка даёт сливки, наливаем в банку до половины, закрываем крышкой,
// трясём до пятнадцати: сливки густеют → жёлтые комочки → масло и пахта. Мажем на хлеб, угощаем Бурёнку.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, E, C, R, HL, SH, S, mix } from '../art.js'

const JAR = { x: 800, y: 565, w: 220, h: 300 }
const jarTop = JAR.y - JAR.h / 2
const BODY = 'M40 62L180 62L198 96L198 270Q198 290 178 290L42 290Q22 290 22 270L22 96Z'
const LV = { bottom: 284, span: 206 } // уровень 0..1 → y внутри банки
const lvY = l => LV.bottom - LV.span * l
const HALF = 0.5, GOAL = [0.4, 0.62] // зелёная полоса «половина»: отпустить можно в этом диапазоне
const CREAM = '#FFF3C6', THICK = '#FFE99A', WHEY = '#BFE1F7', BUTTER = '#FFD84D'

let uid = 0
const jarArt = () => {
  const id = `bsj${++uid}`
  const lumps = [[70, 230, 13], [104, 250, 11], [140, 236, 14], [90, 200, 10], [128, 206, 12], [160, 250, 10], [64, 262, 10], [112, 222, 9], [150, 210, 9], [82, 244, 8]]
    .map(([x, y, r]) => `<circle class="lump" cx="${x}" cy="${y}" r="${r}" fill="${BUTTER}" stroke="#E0A81E" stroke-width="3"/>`).join('')
  const foam = [[54, 0, 15], [86, -4, 18], [120, 0, 16], [150, -2, 15], [72, 12, 11], [110, 12, 12], [140, 12, 11]]
    .map(([x, dy, r]) => `<circle class="foam" cx="${x}" cy="${dy}" r="${r}" fill="#FFFFFF" stroke="#F0DFA8" stroke-width="3"/>`).join('')
  return svg(220, 300,
    SH(110, 296, 92, 7) +
    `<path d="${BODY}" fill="#F1FAFF" fill-opacity=".6"/>` +
    `<clipPath id="${id}"><path d="${BODY}"/></clipPath><g clip-path="url(#${id})">` +
      `<rect class="liq" x="0" y="${LV.bottom}" width="220" height="0" fill="${CREAM}"/>` +
      '<rect class="surf" x="0" y="0" width="220" height="0" fill="#fff" opacity=".0"/>' +
      `<g class="foamg" opacity="0" transform="translate(0 ${lvY(HALF) + 10})">${foam}</g>` +
      `<g class="lumps" opacity="0">${lumps}</g>` +
      `<ellipse class="blob" cx="110" cy="246" rx="52" ry="38" fill="${BUTTER}" stroke="#E0A81E" stroke-width="4" opacity="0"/>` +
    '</g>' +
    P(BODY, 'none', { sw: 6 }) +
    R(34, 48, 152, 22, 10, '#F4FBFF') +
    R(46, 100, 12, 150, 6, '#fff', { sw: 0, attr: 'opacity=".65"' }) +
    // полоска «половина»
    `<rect class="mark" x="32" y="${lvY(GOAL[1])}" width="156" height="${lvY(GOAL[0]) - lvY(GOAL[1])}" fill="#2E9E5B" opacity=".28"/>` +
    `<path class="mark" d="M32 ${lvY(GOAL[1])}L188 ${lvY(GOAL[1])}M32 ${lvY(GOAL[0])}L188 ${lvY(GOAL[0])}" stroke="#2E9E5B" stroke-width="6" stroke-dasharray="14 9" stroke-linecap="round"/>` +
    `<path class="mark" d="M6 ${lvY(HALF) - 17}L30 ${lvY(HALF)}L6 ${lvY(HALF) + 17}Z" fill="#2E9E5B" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>` +
    // крышка (появляется, когда закрыли)
    `<g class="lid" opacity="0" data-origin="110 40">${S('M26 62Q26 30 60 30L160 30Q194 30 194 62L194 66Q194 72 188 72L32 72Q26 72 26 66Z', '#FF8FC8', '#E06AA8')}${[52, 80, 108, 136, 164].map(x => `<path d="M${x} 36L${x} 68" stroke="#E06AA8" stroke-width="4" stroke-linecap="round"/>`).join('')}${HL(62, 44, 22, 5, -6, 0.6)}</g>`)
}

const lidArt = () => svg(180, 66,
  SH(90, 62, 70, 4) + S('M8 32Q8 4 40 4L140 4Q172 4 172 32L172 38Q172 44 166 44L14 44Q8 44 8 38Z', '#FF8FC8', '#E06AA8') +
  [34, 62, 90, 118, 146].map(x => `<path d="M${x} 10L${x} 40" stroke="#E06AA8" stroke-width="4" stroke-linecap="round"/>`).join('') + HL(40, 16, 22, 5, -6, 0.6))

// кувшин с коровьими пятнами; носик слева-сверху
const pitcherArt = () => {
  const id = `bsp${++uid}`
  const body = 'M44 56L138 56Q150 56 150 70L156 168Q158 204 124 208L60 208Q26 204 28 168L34 70Q34 56 44 56Z'
  return svg(190, 224,
    SH(92, 218, 68, 6) +
    L('M150 84C198 84 200 170 152 178', INK, 26) + L('M150 84C198 84 200 170 152 178', '#FFFFFF', 15) +
    P('M38 70Q14 66 6 42Q30 50 44 40Z', '#FFFFFF', { sw: 5 }) +
    `<clipPath id="${id}"><path d="${body}"/></clipPath>` +
    `<path d="${body}" fill="#DCE8F5"/><g clip-path="url(#${id})"><path d="${body}" fill="#FFFFFF" transform="translate(-9 -6)"/>` +
      `<path d="M40 100Q64 84 78 106Q88 132 60 138Q34 136 40 100Z" fill="#3B2F4F"/><path d="M104 140Q136 128 148 156Q150 182 118 186Q96 180 104 140Z" fill="#3B2F4F"/><path d="M96 74Q118 66 126 84Q124 100 104 98Q90 92 96 74Z" fill="#3B2F4F"/></g>` +
    P(body, 'none', { sw: 5.5 }) +
    E(91, 58, 54, 13, '#FFF3C2', { sw: 5 }) + E(80, 55, 22, 4, '#FFFFFF', { sw: 0 }) +
    HL(50, 130, 5, 20, 8, 0.7))
}

const blobArt = () => svg(120, 90, SH(60, 84, 50, 4) + S('M12 50C12 18 40 8 62 8C90 8 110 22 108 52C106 74 88 82 62 82C34 82 12 74 12 50Z', BUTTER, '#E0A81E') + HL(40, 28, 20, 6, -20, 0.6))

// пятно намазанного масла на хлебе (клип по мякишу breadSlice)
const CRUMB = 'M40 40C40 30 60 26 80 28C100 26 120 30 120 40C124 60 118 70 118 92L118 134L42 134L42 92C42 70 36 60 40 40Z'
const spreadArt = () => {
  const id = `bss${++uid}`
  return svg(160, 154, `<clipPath id="${id}"><path d="${CRUMB}"/></clipPath><g clip-path="url(#${id})" class="spread"></g><g clip-path="url(#${id})"><path class="full" d="${CRUMB}" fill="#FFE27A" opacity="0"/></g>`)
}

const drop = c => `<div style="width:100%;height:100%;border-radius:50%;background:${c}"></div>`
const R2 = a => a * Math.PI / 180

export default defineLevel({
  id: 'butter-shake',
  async run(k) {
    const FL = k.layout.floorY
    k.kitchenBg()
    const pyx = k.pyx({ x: 250 })
    const cow = k.guest('cow', 1400, FL, { size: 330, face: 'left' })
    const bar = k.stepsBar(['🥛', '🫙', '🧈', '🍞', '🐄'])

    // элемент повернуть вокруг центра на deg так, чтобы точка `local` (смещение от центра в px) оказалась в `target`
    const pose = (el, local, target, deg) => {
      const c = k.centerOf(el), r = R2(deg)
      const ox = local.x * Math.cos(r) - local.y * Math.sin(r), oy = local.x * Math.sin(r) + local.y * Math.cos(r)
      return { x: target.x - ox - c.x, y: target.y - oy - c.y, rotation: deg }
    }
    const drops = (from, to, color, n = 8) => {
      for (let i = 0; i < n; i++) {
        const s = k.rand(10, 17)
        const d = k.prop(drop(color), from.x + k.rand(-14, 14), from.y, s, s, { z: 13 })
        k.to(d, { x: to.x - from.x + k.rand(-16, 16), y: to.y - from.y, opacity: 0.2, duration: k.rand(0.35, 0.55), delay: i * 0.04, ease: 'power1.in', onComplete: () => d.remove() })
      }
    }

    // ── банка ──
    const jar = k.prop(jarArt(), JAR.x, JAR.y, JAR.w, JAR.h, { z: 6 })
    const q = s => jar.querySelector(s)
    const qa = s => [...jar.querySelectorAll(s)]
    const liq = q('.liq')
    const setLevel = (l, dur = 0.12) => {
      const y = lvY(l)
      k.to(liq, { attr: { y, height: LV.bottom + 6 - y }, duration: dur, overwrite: 'auto' })
    }
    k.fromTo(jar, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'bounce.out' })
    await k.wait(700)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(cow, 'cow_hi', 'happy')
    await k.tell(pyx, 'milk_cream', 'point')

    // ───── 1. наливаем сливки до половины ─────
    bar.set(0)
    const pitcher = k.prop(pitcherArt(), 1160, 630, 150, 177, { z: 8 })
    k.fromTo(pitcher, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    await k.wait(700)
    const MOUTH = { x: 832, y: 448 }
    const tipLocal = { x: (6 / 190 - 0.5) * 150, y: (42 / 224 - 0.5) * 177 }
    const tiltP = pose(pitcher, tipLocal, MOUTH, -100)
    const stream = k.prop('<div style="width:100%;height:100%;border-radius:8px;background:#FFF6D8;box-shadow:inset 0 0 0 2px #EED9A0"></div>', MOUTH.x, MOUTH.y, 16, 10, { z: 7 })
    stream.style.display = 'none'
    const surfY = l => jarTop + lvY(l)
    let misses = 0
    let lv = await k.hold(pitcher, {
      duration: 3.4, goal: GOAL, prompt: k.key('q_pour'), host: pyx, sfx: null,
      onStart: () => { stream.style.display = 'block'; k.to(pitcher, { ...tiltP, duration: 0.35, ease: 'power2.out', overwrite: 'auto' }) },
      onLevel: p => {
        setLevel(p, 0.1)
        Object.assign(stream.style, { left: `${MOUTH.x - 8}px`, top: `${MOUTH.y}px`, height: `${Math.max(6, surfY(p) - MOUTH.y)}px` })
        if (p > 0 && Math.random() < 0.25) k.sfx('pour', { vol: 0.25 })
      },
      onRelease: () => { stream.style.display = 'none'; k.to(pitcher, { x: 0, y: 0, rotation: 0, duration: 0.4, ease: 'back.out(1.5)', overwrite: 'auto' }) },
      onMiss: () => { if (++misses <= 2) k.tell(pyx, 'more') },
      onOver: () => {
        stream.style.display = 'none'
        k.to(pitcher, { x: 0, y: 0, rotation: 0, duration: 0.4, ease: 'back.out(1.5)', overwrite: 'auto' })
        k.sfx('splash')
        drops({ x: 850, y: 470 }, { x: 900, y: 730 }, '#FFF6D8', 9)
        k.tell(pyx, 'over', 'surprised')
      },
    })
    setLevel(lv, 0.2)
    q('.foamg').setAttribute('transform', `translate(0 ${lvY(lv) + 10})`)
    k.to(pitcher, { opacity: 0, y: 40, duration: 0.4, delay: 0.5, onComplete: () => pitcher.remove() })
    k.sparkle(800, surfY(lv), 6)
    await k.tell(pyx, 'pour_ok', 'cheer')

    // ───── 2. крышка ─────
    const lid = k.prop(lidArt(), 1130, 640, 150, 55, { z: 9 })
    k.fromTo(lid, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    await k.wait(700)
    await k.dnd({
      items: [{ id: 'lid', el: lid }], zones: [{ id: 'jar', el: jar, pad: 40 }], prompt: k.key('q_lid'), host: pyx,
      accept: () => true,
      onCorrect: async it => {
        const c = k.centerOf(it.el)
        await k.play(k.gsap.to(it.el, { x: `+=${JAR.x - c.x}`, y: `+=${jarTop + 40 - c.y}`, duration: 0.35, ease: 'power2.out' }))
      },
    })
    lid.remove()
    q('.lid').setAttribute('opacity', '1')
    qa('.mark').forEach(m => k.to(m, { opacity: 0, duration: 0.3 }))
    k.sfx('clonk')
    k.gsap.fromTo(q('.lid'), { y: -14 }, { y: 0, duration: 0.3, ease: 'bounce.out' })
    await k.tell(pyx, 'lid_ok', 'nod')

    // ───── 3. трясём ─────
    bar.set(1)
    const badge = k.badge('0', 1100, 520, { size: 130, color: '#FFB703' })
    const bumpBadge = n => { badge.textContent = String(n); k.gsap.fromTo(badge, { scale: 1.3 }, { scale: 1, duration: 0.25, ease: 'back.out(3)' }) }
    let phase = 0
    const say = (id, char = pyx, emote) => { void k.tell(char, id, emote) }
    await k.shake(jar, {
      count: 15, amp: 70, prompt: k.key('q_shake'), host: pyx,
      onShake: n => {
        bumpBadge(n)
        if (n === 3) k.to(liq, { fill: mix(CREAM, THICK, 0.5), duration: 0.5 })
        if (n === 5) {
          phase = 1
          k.to(liq, { fill: THICK, duration: 0.6 })
          k.to(q('.foamg'), { opacity: 1, duration: 0.5 })
          k.sparkle(1000, 480, 5)
          say('c5'); k.after(900, () => say('thick', cow, 'jump'))
        }
        if (n === 10) {
          phase = 2
          k.to(liq, { fill: WHEY, duration: 0.6 })
          k.to(q('.foamg'), { opacity: 0, duration: 0.4 })
          k.to(q('.lumps'), { opacity: 1, duration: 0.5 })
          qa('.lump').forEach((l, i) => k.gsap.fromTo(l, { scale: 0, svgOrigin: `${l.getAttribute('cx')} ${l.getAttribute('cy')}` }, { scale: 1, svgOrigin: `${l.getAttribute('cx')} ${l.getAttribute('cy')}`, duration: 0.4, delay: i * 0.03, ease: 'back.out(3)' }))
          k.sparkle(1000, 480, 6)
          say('c10'); k.after(900, () => say('lumps', pyx, 'point'))
        }
        if (n === 13) { say('keep', cow, 'cheer') }
        if (n > 10 && n <= 15) {
          const t = (n - 10) / 5
          qa('.lump').forEach(l => { const x = +l.getAttribute('cx'), y = +l.getAttribute('cy'); k.to(l, { x: (110 - x) * t * 0.7, y: (246 - y) * t * 0.7, duration: 0.3 }) })
        }
        if (n < 5 && n % 2 === 1) k.sfx('bloop', { vol: 0.5 })
      },
    })
    // масло готово
    k.to(q('.lumps'), { opacity: 0, duration: 0.3 })
    k.gsap.fromTo(q('.blob'), { opacity: 1, scale: 0.3, svgOrigin: '110 246' }, { scale: 1, svgOrigin: '110 246', duration: 0.6, ease: 'elastic.out(1,.5)' })
    k.sfx('correct')
    k.burst(JAR.x, 470, 12)
    say('c15', pyx, 'cheer')
    await k.wait(1400)
    bar.done(1)
    k.to(badge, { scale: 0, opacity: 0, duration: 0.35, onComplete: () => badge.remove() })
    await k.tell(pyx, 'sep_why', 'point')

    // ───── 4. выливаем пахту, выкладываем масло ─────
    bar.set(2)
    const glass = k.prop(kitchen.glass(0.9, WHEY), 590, 640, 110, 156, { z: 8 })
    glass.querySelector('.glass-liquid')?.setAttribute('style', 'transform-origin:60px 160px')
    k.gsap.set(glass.querySelector('.glass-liquid'), { scaleY: 0.03, svgOrigin: '60 160' })
    k.fromTo(glass, { y: -260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    await k.wait(700)
    await k.tapN(jar, 1, { prompt: k.key('q_pour2'), host: pyx })
    // открыть: крышка слетает
    k.sfx('pop')
    k.to(q('.lid'), { y: -90, x: 60, rotation: 24, opacity: 0, svgOrigin: '110 40', duration: 0.45, ease: 'power2.out' })
    await k.wait(350)
    const pMouth = { x: 604, y: 500 }
    const mLocal = { x: 0, y: -JAR.h / 2 + 46 }
    const tiltJ = pose(jar, mLocal, pMouth, -72)
    await k.play(k.gsap.to(jar, { ...tiltJ, duration: 0.55, ease: 'power2.inOut' }))
    const wStream = k.prop('<div style="width:100%;height:100%;border-radius:8px;background:#DDEEFB;box-shadow:inset 0 0 0 2px #B9D7EE"></div>', pMouth.x, pMouth.y, 16, 140, { z: 7 })
    wStream.style.left = `${pMouth.x - 8}px`; wStream.style.top = `${pMouth.y}px`; wStream.style.height = '124px'
    k.sfx('pour', { vol: 0.8 })
    k.gsap.to(glass.querySelector('.glass-liquid'), { scaleY: 0.72, svgOrigin: '60 160', duration: 1.6, ease: 'none' })
    k.gsap.to(liq, { attr: { y: LV.bottom, height: 8 }, duration: 1.6, ease: 'none' })
    k.gsap.to(liq, { opacity: 0, duration: 0.3, delay: 1.4 })
    for (let i = 0; i < 5; i++) { await k.wait(300); k.sfx('pour', { vol: 0.3 }) }
    wStream.remove()
    await k.play(k.gsap.to(jar, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.4)' }))
    await k.tell(pyx, 'buttermilk', 'point')

    const plate = k.prop(kitchen.plate(), 1050, 705, 260, 90, { z: 5 })
    k.fromTo(plate, { y: -200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'bounce.out' })
    await k.wait(600)
    await k.tapN(jar, 1, { prompt: k.key('q_out'), host: pyx })
    // масло выскальзывает на тарелку
    const lump = k.prop(blobArt(), 812, 540, 128, 96, { z: 12 })
    k.to(q('.blob'), { opacity: 0, duration: 0.15 })
    k.sfx('plop')
    await k.play(k.gsap.to(jar, { x: 34, y: -8, rotation: 30, duration: 0.4, ease: 'power2.out' }))
    const tl = k.gsap.timeline()
    tl.to(lump, { x: 60, y: -40, duration: 0.3, ease: 'power2.out' }).to(lump, { x: 240, y: 165, rotation: 12, duration: 0.5, ease: 'power1.in' })
    await k.play(tl)
    k.sfx('thud')
    lump.innerHTML = food('butter'); Object.assign(lump.style, { left: `${1050 - 65}px`, top: `${705 - 58}px`, width: '130px', height: '75px' })
    k.gsap.set(lump, { x: 0, y: 0, rotation: 0 })
    k.gsap.fromTo(lump, { scale: 1.3 }, { scale: 1, duration: 0.3, ease: 'bounce.out' })
    await k.play(k.gsap.to(jar, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.4)' }))
    k.burst(1050, 640, 8)
    await k.tell(pyx, 'butter_out', 'cheer')
    k.to([jar, glass], { opacity: 0, y: 50, duration: 0.5, onComplete: () => { jar.remove(); glass.remove() } })

    // ───── 5. мажем на хлеб ─────
    bar.set(3)
    const BR = { x: 780, y: 610, w: 240 }
    const bread = k.food('breadSlice', BR.x, BR.y, BR.w, { z: 6 })
    const brH = parseFloat(bread.style.height)
    const spreadEl = k.prop(spreadArt(), BR.x, BR.y, BR.w, brH, { z: 7 })
    spreadEl.style.pointerEvents = 'none'
    k.fromTo(bread, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' })
    await k.wait(500)
    // масло переезжает на хлеб
    const bc = k.centerOf(bread)
    await k.play(k.gsap.to(lump, { x: bc.x - 1050 + 6, y: bc.y - 705 - 60, scale: 0.72, duration: 0.6, ease: 'power2.inOut' }))
    k.to(plate, { opacity: 0, duration: 0.3, onComplete: () => plate.remove() })
    const knife = k.food('knife', bc.x + 90, bc.y - 60, 64, { z: 30 })
    knife.style.pointerEvents = 'none'; knife.style.opacity = '0'
    const rB = k.rectOf(bread)
    const sp = spreadEl.querySelector('.spread'), full = spreadEl.querySelector('.full')
    let last = null
    await k.scrub(bread, {
      need: 750, prompt: k.key('q_bread'), host: pyx, sfx: 'scrub',
      onStart: () => k.to(knife, { opacity: 1, duration: 0.15 }),
      onEnd: () => k.to(knife, { opacity: 0.0, duration: 0.2 }),
      onProgress: (p, pos) => {
        if (pos) {
          k.gsap.set(knife, { x: pos.x - (bc.x + 90), y: pos.y - (bc.y - 60) - 66, rotation: 38, transformOrigin: '50% 92%', opacity: 1 })
          const sc = rB.w / 160, lx = (pos.x - rB.x) / sc, ly = (pos.y - rB.y - (rB.h - 154 * sc) / 2) / sc
          if (!last || Math.hypot(lx - last.x, ly - last.y) > 7) {
            last = { x: lx, y: ly }
            sp.insertAdjacentHTML('beforeend', `<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="17" fill="#FFE27A"/>`)
          }
        }
        k.gsap.set(lump, { scale: 0.72 * (1 - p * 0.75), opacity: 1 - Math.max(0, p - 0.8) * 5 })
        if (p >= 0.999) k.to(full, { opacity: 1, duration: 0.3 })
      },
    })
    k.to(knife, { opacity: 0, duration: 0.2, onComplete: () => knife.remove() })
    k.to(lump, { opacity: 0, duration: 0.2, onComplete: () => lump.remove() })
    k.to(full, { opacity: 1, duration: 0.3 })
    k.sparkle(BR.x, BR.y - 20, 6)
    k.sfx('yum')
    await k.tell(pyx, 'spread_ok', 'cheer')

    // ───── 6. угощаем Бурёнку ─────
    bar.set(4)
    const sandwich = [bread, spreadEl]
    // объединяем в один узел, чтобы лететь вместе
    const holder = k.prop('', BR.x, BR.y, BR.w, brH, { z: 10 })
    holder.style.pointerEvents = 'auto'
    holder.style.borderRadius = '30px'
    await k.tapOnEl(holder, { prompt: k.key('q_feed'), host: pyx })
    const to = k.centerOf(cow.el)
    k.sfx('whoosh')
    await k.play(k.gsap.to([...sandwich, holder], { x: to.x - BR.x - 30, y: to.y - BR.y - 40, scale: 0.35, rotation: 20, duration: 0.85, ease: 'power2.in' }))
    sandwich.forEach(e => e.remove()); holder.remove()
    k.sfx('crunch')
    cow.emote('happy')
    k.burst(to.x, to.y - 40, 10)
    await k.tell(cow, 'cow_eat')
    bar.done(4)
    await k.tell(pyx, 'sum', 'point')
    await k.tell(cow, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
