// «Попкорн: пых-бах!» — внутри зёрнышка капелька воды; жар → пар → пых!
// Биты: лупа с капелькой → насыпаем зёрна → выбор «нужна ли крышка» → плита со взрослым → тряска кастрюли →
// первый «пых» и объяснение в лупе → счёт хлопков до десяти → тишина → прихватка, крышка, гора попкорна → щепотка соли → апчхи!
import { defineLevel } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, star, nid } from '../art.js'

const KY = '#FFD93D', KYS = '#F2B824'

// ───────────────────────── картинки ─────────────────────────

/** пушистое «облачко» из кругов: общая обводка + тень полумесяцем */
const puff = (cs, base = '#FFFBEF', shade = '#EFD59A', sw = 5) => {
  const id = nid('pf')
  const ring = cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + sw / 2}" fill="${INK}"/>`).join('')
  const fill = c => cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('')
  const clip = `<clipPath id="${id}">${cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</clipPath>`
  return ring + fill(shade) + clip + `<g clip-path="url(#${id})"><g transform="translate(-7 -8)">${fill(base)}</g></g>`
}

const PIECE = [[36, 56, 24], [64, 38, 27], [92, 58, 24], [60, 74, 26], [34, 80, 18], [86, 86, 17]]
const popcornPiece = () => svg(120, 110, SH(60, 104, 44, 5) + puff(PIECE) + HL(50, 34, 11, 6, -30, 0.85) + HL(86, 50, 7, 4, -30, 0.7) + E(66, 99, 9, 5.5, KYS, { sw: 3, rot: -15 }))

const KP = 'M35 4C56 0 68 20 65 42C63 62 50 80 40 86Q35 89 30 86C20 80 7 62 5 42C2 20 14 0 35 4Z'
const kernelArt = () => svg(70, 92, SH(35, 90, 24, 4) + S(KP, KY, KYS) + HL(24, 26, 7, 12, 20, 0.7))

const jarArt = () => {
  const body = 'M30 50L130 50L140 68L140 176Q140 192 124 192L36 192Q20 192 20 176L20 68Z'
  const id = nid('j')
  const kern = Array.from({ length: 26 }, (_, i) => {
    const x = 34 + (i * 37) % 92, y = 104 + (i * 53) % 78
    return `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="${KY}" stroke="#C98A00" stroke-width="1.5" transform="rotate(${(i * 47) % 90 - 45} ${x} ${y})"/>`
  }).join('')
  return svg(160, 204,
    SH(80, 198, 62, 6) + `<clipPath id="${id}"><path d="${body}"/></clipPath>` + F(body, '#F4FBFF') +
    `<g clip-path="url(#${id})"><path d="M14 98Q80 86 146 98L146 200L14 200Z" fill="${KY}"/>${kern}<rect x="34" y="60" width="10" height="120" rx="5" fill="#fff" opacity=".5"/></g>` +
    P(body, 'none', { sw: 5 }) +
    P('M24 50Q24 28 80 28Q136 28 136 50Z', '#FF5A5F', { sw: 5 }) + C(80, 24, 9, '#FFD93D', { sw: 4 }) +
    [46, 72, 98, 120].map(x => C(x, 42, 4, '#fff', { sw: 0 })).join('') +
    R(50, 118, 60, 54, 12, '#fff', { sw: 4 }) + `<g transform="translate(58 124) scale(.4)">${puff(PIECE)}</g>`)
}

/** кастрюля без воды: внутри — зёрна; крышка отдельной группой .lid */
const popPot = lid => {
  let h = kitchen.pot({ lid })
  h = h.replace('<g class="water">', '<g class="water" style="display:none">')
  const dots = Array.from({ length: 26 }, (_, i) => {
    const t = i * 2.399, r = Math.sqrt((i + 0.5) / 26)
    const x = 150 + Math.cos(t) * r * 86, y = 80 + Math.sin(t) * r * 7
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="6.5" ry="4.5" fill="${KY}" stroke="#C98A00" stroke-width="1.5" transform="rotate(${(i * 31) % 60 - 30} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
  }).join('')
  return h.replace('<g class="lid"', `<g class="kernels">${dots}</g><g class="lid"`)
}

/** лупа: зёрнышко в разрезе, в нём капелька; пар, стрелочки-«давит», облачко попкорна */
const loupeArt = () => {
  const kp = 'M0 -84C42 -92 68 -56 64 -8C60 40 40 70 14 88Q0 96 -14 88C-40 70 -60 40 -64 -8C-68 -56 -42 -92 0 -84Z'
  const arrow = 'M0 -12L26 -12L26 -24L52 0L26 24L26 12L0 12Z'
  const ar = (x, y, rot, cls) => `<g class="lp-ar ${cls}"><g transform="translate(${x} ${y}) rotate(${rot}) scale(.62)"><path d="${arrow}" fill="#FF9F43" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g></g>`
  const dropPath = 'M0 -34C14 -10 24 4 24 18A24 24 0 0 1 -24 18C-24 4 -14 -10 0 -34Z'
  const face = `<g class="f-ok"><circle cx="-9" cy="14" r="4.2" fill="${INK}"/><circle cx="9" cy="14" r="4.2" fill="${INK}"/><path d="M-8 24Q0 33 8 24" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><ellipse cx="-15" cy="23" rx="4" ry="2.6" fill="#FF9EB1"/><ellipse cx="15" cy="23" rx="4" ry="2.6" fill="#FF9EB1"/></g>` +
    `<g class="f-hot" opacity="0"><path d="M-14 11L-5 15L-14 19M14 11L5 15L14 19" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="0" cy="27" rx="6" ry="5" fill="${INK}"/><ellipse cx="-15" cy="23" rx="5" ry="3" fill="#FF5A5F"/><ellipse cx="15" cy="23" rx="5" ry="3" fill="#FF5A5F"/><path d="M27 -2Q31 6 27 10Q23 6 27 -2Z" fill="#fff" stroke="${INK}" stroke-width="2.5"/></g>`
  const big = [[150, 196, 34], [188, 160, 40], [232, 194, 34], [190, 226, 38], [158, 232, 26], [226, 236, 24]]
  const clip = nid('lp')
  return svg(380, 440,
    L('M292 304L348 392', INK, 48) + L('M292 304L348 392', '#C68B59', 34) + L('M286 300L340 384', '#E2B78A', 8) +
    C(190, 190, 168, KY, { sw: 8 }) +
    `<clipPath id="${clip}"><circle cx="190" cy="190" r="146"/></clipPath>` +
    C(190, 190, 146, '#EAF7FF', { sw: 6 }) +
    `<g clip-path="url(#${clip})">` +
      `<rect class="lp-heat" x="40" y="40" width="300" height="300" fill="#FFD9AA" opacity="0"/>` +
      `<g class="lp-kern"><g transform="translate(190 196)"><path d="${kp}" fill="${KY}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="${kp}" fill="#FFF3B0" transform="scale(.8)"/><ellipse cx="-38" cy="-44" rx="8" ry="18" fill="#fff" opacity=".7" transform="rotate(16 -38 -44)"/></g></g>` +
      `<g class="lp-drop"><g transform="translate(190 200)"><path d="${dropPath}" fill="#62C6FF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="-10" cy="4" rx="4" ry="9" fill="#fff" opacity=".7" transform="rotate(14 -10 4)"/>${face}</g></g>` +
      `<g class="lp-steam" opacity="0">${puff([[168, 208, 22], [206, 202, 24], [188, 176, 26]], '#FFFFFF', '#D3E3F3', 4)}</g>` +
      `<g class="lp-push" opacity="0">${ar(264, 190, 0, 'r')}${ar(116, 190, 180, 'l')}${ar(190, 98, -90, 't')}${ar(190, 298, 90, 'b')}</g>` +
      `<g class="lp-corn" opacity="0">${puff(big, '#FFFBEF', '#EFD59A', 6)}${HL(170, 150, 16, 9, -30, 0.85)}${E(196, 262, 13, 8, KYS, { sw: 4, rot: -15 })}</g>` +
      `<g class="lp-flash" opacity="0"><path d="${star(190, 190, 150, 70, 9)}" fill="#FFF3B0" stroke="#FF9F43" stroke-width="6" stroke-linejoin="round"/></g>` +
    `</g>` +
    F('M84 108A130 130 0 0 1 150 62', 'none', `stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".7"`))
}

const flameArt = () => svg(120, 150, P('M60 8C86 40 108 60 108 96C108 128 86 144 60 144C34 144 12 128 12 96C12 70 34 58 40 34C50 44 52 52 60 8Z', '#FF7A3D', { sw: 5 }) + P('M60 62C74 82 86 92 86 112C86 130 74 138 60 138C46 138 34 130 34 112C34 96 50 88 60 62Z', '#FFD93D', { sw: 0 }))

// ───────────────────────── уровень ─────────────────────────

export default defineLevel({
  id: 'popcorn',
  async run(k) {
    const gs = k.gsap
    k.kitchenBg()
    const st = k.stove()
    const pyx = k.pyx({ x: 250 })
    const kapa = k.guest('kapa', 1400, k.layout.floorY, { size: 290, face: 'left' })

    // кастрюля на конфорке (без воды), крышка и зёрна — группами внутри SVG
    const pot = k.onBurner(k.prop(popPot(true), 0, 0, 300, 230, { z: 6 }), 0, 300, 230)
    pot.querySelector('.kp-shadow')?.style.setProperty('visibility', 'hidden')
    const lid = pot.querySelector('.lid'), kernels = pot.querySelector('.kernels')
    gs.set(lid, { autoAlpha: 0 }); gs.set(kernels, { autoAlpha: 0 })
    const POT = { x: 720, rim: 298 } // центр и уровень «горлышка» на сцене
    const lidTap = k.prop('', POT.x, 280, 280, 100, { z: 12 }); lidTap.style.borderRadius = '40px'
    // прихватка на ручке
    const mitt = document.createElement('div')
    mitt.style.cssText = 'position:absolute;left:240px;top:54px;width:84px;height:106px;transform:rotate(-20deg);z-index:3;pointer-events:none'
    mitt.innerHTML = kitchen.mitt()
    pot.appendChild(mitt); gs.set(mitt, { autoAlpha: 0 })

    const jar = k.prop(jarArt(), 1150, 610, 140, 178, { z: 8 })
    const loupe = k.prop(loupeArt(), 1290, 380, 380, 440, { z: 14 })
    gs.set(loupe, { scale: 0, autoAlpha: 0, transformOrigin: '45% 45%' })
    const q = s => loupe.querySelector(s)

    // ── звуковые/визуальные помощники ──
    const lidHop = () => {
      k.fromTo(lid, { y: 0, rotation: 0, svgOrigin: '150 80' }, { y: -16, rotation: k.rand(-5, 5), svgOrigin: '150 80', duration: 0.06, yoyo: true, repeat: 1, ease: 'power1.out', overwrite: true })
    }
    const steamPuff = () => {
      const s = k.prop(kitchen.steam(), POT.x + k.rand(-90, 90), 270, 90, 65, { z: 9 })
      k.fromTo(s, { scale: 0.4, opacity: 0.9 }, { y: -k.rand(70, 110), x: k.rand(-30, 30), scale: 1.1, opacity: 0, duration: 0.9, ease: 'power1.out', onComplete: () => s.remove() })
    }
    const pop = (vol = 0.8) => { k.sfx('popcorn', { vol }); lidHop(); k.sparkle(POT.x + k.rand(-90, 90), 235, 2) }

    // ─── 1. знакомство: лупа с капелькой ───
    await k.wait(400)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(kapa, 'kapa_hi', 'happy')
    k.sfx('magic', { vol: 0.5 })
    k.to(loupe, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.8)' })
    k.to(q('.lp-drop'), { y: -6, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    await k.tell(kapa, 'look', 'point')
    await k.tell(pyx, 'hard', 'nod')
    k.to(loupe, { scale: 0, autoAlpha: 0, duration: 0.4, ease: 'back.in(2)' })

    // ─── 2. насыпаем зёрна ───
    const potZone = k.prop('', POT.x, 300, 340, 300, { z: 1 })
    const jarItem = { id: 'jar', el: jar }
    k.popIn(jar)
    await k.dnd({
      items: [jarItem], zones: [{ id: 'pot', el: potZone, pad: 30 }], accept: () => true,
      prompt: k.key('q_pour'), host: pyx,
      onCorrect: async () => {
        jar.style.zIndex = '13'
        const c = k.centerOf(jar)
        await k.play(gs.to(jar, { x: `+=${820 - c.x}`, y: `+=${190 - c.y}`, rotation: -112, duration: 0.55, ease: 'power2.inOut' }))
        gs.to(kernels, { autoAlpha: 1, duration: 1.4 })
        for (let i = 0; i < 18; i++) {
          const kn = k.prop(kernelArt(), 745 + k.rand(-25, 25), 235, 26, 34, { z: 12 })
          k.to(kn, { y: k.rand(58, 74), x: k.rand(-30, 20), rotation: k.rand(-180, 180), duration: 0.42, delay: i * 0.07, ease: 'power1.in', onComplete: () => kn.remove() })
          if (i % 3 === 0) k.after(i * 70, () => k.sfx('sprinkle', { vol: 0.6 }))
        }
        await k.wait(1500)
        await k.play(gs.to(jar, { x: `+=${400}`, y: `+=${420}`, rotation: 0, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }))
        jar.remove()
      },
    })
    pyx.emote('happy')

    // ─── 3. нужна ли крышка? ───
    await k.choose({
      prompt: k.key('q_lid'), host: pyx,
      options: [
        { id: 'nolid', art: popPot(false), color: '#FF5A5F', outcome: async () => {
          const t = k.tell(pyx, 'nolid', 'surprised')
          gs.to(kernels, { autoAlpha: 1, duration: 0.01 })
          for (let i = 0; i < 14; i++) {
            const pc = k.prop(popcornPiece(), POT.x + k.rand(-60, 60), 260, 84, 77, { z: 15 })
            const dx = k.rand(-560, 560), up = k.rand(180, 380)
            k.timeline({ delay: i * 0.07, onComplete: () => pc.remove() })
              .fromTo(pc, { scale: 0.3, opacity: 1 }, { scale: 1, x: dx * 0.5, y: -up, rotation: k.rand(-200, 200), duration: 0.5, ease: 'power2.out' })
              .to(pc, { x: dx, y: k.rand(250, 420), rotation: `+=${k.rand(-200, 200)}`, opacity: 0, duration: 0.7, ease: 'power2.in' })
            k.after(i * 70, () => k.sfx('popcorn', { vol: 0.5 }))
          }
          await t
        } },
        { id: 'lid', art: popPot(true), color: '#62C6FF', correct: true, outcome: async () => {
          k.sfx('clonk')
          gs.set(lid, { autoAlpha: 1, y: -170, rotation: -10, svgOrigin: '150 80' })
          await k.play(gs.to(lid, { y: 0, rotation: 0, svgOrigin: '150 80', duration: 0.5, ease: 'bounce.out' }))
          k.burst(POT.x, 260, 8)
          await k.tell(pyx, 'lid_ok', 'cheer')
        } },
      ],
    })

    // ─── 4. плита — только со взрослым ───
    await k.adultHelp({ knob: st.knobEl(0), host: pyx })
    st.on(0)
    await k.wait(600)
    await k.line(pyx, 'e.kitchen-omelet.sizzle')
    await k.tell(pyx, 'hot', 'point')
    gs.to(mitt, { autoAlpha: 1, duration: 0.3 })
    gs.fromTo(mitt, { scale: 0.3 }, { scale: 1, duration: 0.5, ease: 'back.out(2.4)' })

    // ─── 5. нагрев: дрожь, тишина, первый «пых» ───
    await k.tell(kapa, 'listen', 'think')
    const shiver = k.to(pot, { rotation: 0.8, duration: 0.05, yoyo: true, repeat: -1, ease: 'none' })
    k.sfx('sizzle', { vol: 0.5 })
    await k.wait(1400)
    shiver.kill(); gs.set(pot, { rotation: 0 })
    pop()
    await k.tell(pyx, 'pop1', 'surprised')

    // ─── 6. почему? — смотрим в лупу ───
    k.to(loupe, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.8)' })
    const bob = k.to(q('.lp-drop'), { y: -5, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    await k.tell(kapa, 'why1', 'point')
    k.to(q('.lp-heat'), { opacity: 1, duration: 1.2 })
    const jit = k.to(q('.lp-kern'), { x: 3, duration: 0.06, yoyo: true, repeat: -1, ease: 'none' })
    gs.to(q('.f-ok'), { opacity: 0, duration: 0.2 }); gs.to(q('.f-hot'), { opacity: 1, duration: 0.2 })
    await k.tell(kapa, 'why2', 'nod')
    bob.kill()
    k.to(q('.lp-drop'), { scale: 0.15, opacity: 0, svgOrigin: '190 200', duration: 0.9, ease: 'power2.in' })
    k.to(q('.lp-steam'), { opacity: 1, scale: 1, svgOrigin: '190 195', duration: 0.9 })
    gs.fromTo(q('.lp-steam'), { scale: 0.3, svgOrigin: '190 195' }, { scale: 1.15, svgOrigin: '190 195', duration: 1.1, ease: 'sine.out' })
    k.sfx('bubble', { vol: 0.5 })
    await k.tell(kapa, 'why3', 'surprised')
    k.to(q('.lp-push'), { opacity: 1, duration: 0.3 })
    for (const [s, dx, dy] of [['.r', 9, 0], ['.l', -9, 0], ['.t', 0, -9], ['.b', 0, 9]]) gs.to(q(s), { x: dx, y: dy, duration: 0.18, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    gs.to(q('.lp-kern'), { x: 5, duration: 0.04, yoyo: true, repeat: -1, ease: 'none', overwrite: true })
    k.sfx('yuck', { vol: 0.2 })
    await k.wait(1400)
    // ПЫХ!
    jit.kill(); gs.killTweensOf(q('.lp-kern')); gs.set(q('.lp-kern'), { x: 0 })
    gs.killTweensOf([q('.r'), q('.l'), q('.t'), q('.b')])
    k.sfx('popcorn', { vol: 1 }); pop(1)
    gs.set(q('.lp-flash'), { opacity: 1, scale: 0.3, svgOrigin: '190 190' })
    gs.to(q('.lp-flash'), { scale: 1.1, opacity: 0, svgOrigin: '190 190', duration: 0.5, ease: 'power2.out' })
    gs.to([q('.lp-kern'), q('.lp-steam'), q('.lp-push')], { opacity: 0, duration: 0.1 })
    gs.fromTo(q('.lp-corn'), { scale: 0.2, opacity: 1, svgOrigin: '190 200' }, { scale: 1, opacity: 1, svgOrigin: '190 200', duration: 0.6, ease: 'back.out(2.4)' })
    const lc = k.centerOf(loupe)
    k.burst(lc.x - 20, lc.y - 30, 14)
    await k.tell(kapa, 'why4', 'cheer')
    k.to(loupe, { scale: 0, autoAlpha: 0, duration: 0.4, ease: 'back.in(2)' })

    // ─── 7. трясём кастрюлю (в прихватке) ───
    await k.shake(pot, {
      count: 8, amp: 55, prompt: k.key('q_shake'), host: pyx,
      onShake: n => { lidHop(); if (n % 2) k.sfx('popcorn', { vol: 0.4 }); if (n === 4) steamPuff() },
    })
    k.sfx('yum', { vol: 0.4 })

    // ─── 8. считаем хлопки до десяти ───
    await k.tell(pyx, 'count', 'happy')
    const badge = k.badge('0', 1010, 250, { size: 120, color: '#FF9F43' })
    for (let i = 1; i <= 10; i++) {
      pop(); badge.textContent = String(i)
      gs.fromTo(badge, { scale: 1.35 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' })
      if (i % 3 === 0) steamPuff()
      await k.sayNumber(i, pyx)
      await k.wait(180)
    }
    await k.tell(pyx, 'ten', 'cheer')
    // концерт: пых-пых-пых!
    const rapid = k.tell(pyx, 'rapid', 'dance')
    for (let j = 0; j < 26; j++) { pop(0.7); if (j % 4 === 0) steamPuff(); await k.wait(k.rand(70, 130)) }
    await rapid
    // затихают
    for (const w of [260, 420, 650, 1000, 1500]) { await k.wait(w); pop(0.6) }
    await k.wait(1300)
    gs.to(badge, { scale: 0, duration: 0.3, ease: 'back.in(2)' })
    await k.tell(kapa, 'quiet', 'nod')

    // ─── 9. выключаем, открываем (прихваткой!) ───
    await k.tapOnEl(st.knobEl(0), { prompt: 'e.kitchen-omelet.off', host: pyx })
    st.off(0)
    await k.wait(400)
    pyx.emote('point')
    await k.tapOnEl(lidTap, { prompt: k.key('q_lift'), host: pyx })
    k.sfx('whoosh')
    gs.to(lid, { y: -190, x: 120, rotation: 25, svgOrigin: '150 80', autoAlpha: 0, duration: 0.7, ease: 'power2.out' })
    for (let i = 0; i < 6; i++) k.after(i * 90, steamPuff)
    // гора попкорна
    const heap = []
    const rows = [[300, [-90, -45, 0, 45, 90], 7], [252, [-70, -25, 25, 70], 6], [210, [-45, 0, 45], 5], [172, [-22, 22], 4]]
    for (const [y, xs, z] of rows) for (const dx of xs) {
      const pc = k.prop(popcornPiece(), POT.x + dx + k.rand(-6, 6), y + k.rand(-4, 4), 92, 84, { z })
      gs.set(pc, { scale: 0, rotation: k.rand(-20, 20) })
      heap.push(pc)
    }
    // кусочки вырастают из кастрюли по очереди (снизу вверх)
    k.after(350, () => { k.sfx('tada', { vol: 0.5 }) })
    for (let i = 0; i < heap.length; i++) k.after(300 + i * 60, () => { k.to(heap[i], { scale: 1, duration: 0.45, ease: 'back.out(2.6)' }); if (i % 2 === 0) k.sfx('pop', { vol: 0.5 }) })
    await k.wait(1500)
    k.burst(POT.x, 230, 14)
    await k.tell(pyx, 'wow', 'cheer')
    gs.to(mitt, { autoAlpha: 0, duration: 0.3 })

    // ─── 10. щепотка соли (привет, «Зачем нужна соль?») ───
    const shaker = k.food('saltShaker', 1130, 600, 110, { z: 12 })
    k.popIn(shaker)
    await k.tapN(shaker, 1, { prompt: k.key('q_salt'), host: pyx })
    k.sfx('sprinkle')
    await k.play(gs.to(shaker, { x: -320, y: -400, rotation: -135, duration: 0.5, ease: 'power2.out' }))
    for (let i = 0; i < 14; i++) {
      const g = k.prop('<div style="width:100%;height:100%;background:#fff;border-radius:2px;box-shadow:0 0 0 2px #C9DFF0"></div>', 690 + k.rand(-14, 14), 215, 9, 9, { z: 13 })
      k.to(g, { y: k.rand(60, 110), x: k.rand(-40, 60), opacity: 0, duration: 0.5, delay: i * 0.03, ease: 'power1.in', onComplete: () => g.remove() })
    }
    await k.wait(500)
    k.to(shaker, { x: 0, y: 0, rotation: 0, autoAlpha: 0, duration: 0.4 })
    pyx.emote('nod')

    // ─── 11. пробуем и… апчхи! ───
    const bite = heap[heap.length - 1]
    bite.style.zIndex = '13'
    const bc = k.centerOf(bite), mouth = { x: 318, y: 540 }
    await k.play(gs.to(bite, { x: `+=${mouth.x - bc.x}`, y: `+=${mouth.y - bc.y}`, scale: 0.35, rotation: 20, duration: 0.7, ease: 'power2.inOut' }))
    bite.remove()
    k.sfx('crunch')
    await k.tell(pyx, 'yum', 'happy')
    await k.wait(200)
    k.sfx('sneeze')
    const sn = pyx.emote('surprised')
    const fl = k.prop(flameArt(), 400, 520, 90, 112, { z: 13 })
    gs.set(fl, { scale: 0, rotation: 90, transformOrigin: '0% 50%' })
    gs.to(fl, { scale: 1.3, x: 60, opacity: 0.95, duration: 0.3, ease: 'back.out(2)' })
    gs.to(fl, { scale: 0.2, opacity: 0, x: 130, duration: 0.4, delay: 0.5, onComplete: () => fl.remove() })
    for (let i = 0; i < 9; i++) {
      const pc = k.prop(popcornPiece(), 330, 540, 54, 50, { z: 13 })
      k.timeline({ delay: i * 0.05, onComplete: () => pc.remove() })
        .fromTo(pc, { scale: 0.3, opacity: 1 }, { x: k.rand(140, 380), y: -k.rand(30, 140), rotation: k.rand(-180, 180), scale: 1, duration: 0.5, ease: 'power2.out' })
        .to(pc, { y: k.rand(120, 230), opacity: 0, duration: 0.6, ease: 'power2.in' })
    }
    await sn
    await k.tell(pyx, 'sneeze', 'laugh')

    // ─── 12. вывод ───
    await k.tell(kapa, 'sum', 'point')
    await k.tell(pyx, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
