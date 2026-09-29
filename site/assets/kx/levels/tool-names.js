// «Кто что делает?»: 6 раундов — задача от Пыха → выбор карточкой (k.choose) → нужный инструмент делает работу,
// а неверный смешно не справляется. Половник, венчик, лопатка, скалка, дуршлаг, ложка.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S } from '../art.js'


/** У героев после серии эмоций «плывёт» корень (gsap путает svgOrigin/transformOrigin): после каждой эмоции сбрасываем трансформ корня. */
const guardEmotes = (k, ...chars) => {
  for (const c of chars) {
    const root = c.svg.querySelector('.c-root'), orig = c.emote.bind(c)
    let busy = 0
    c.emote = e => { busy++; return orig(e).finally(() => { if (--busy === 0 && k.alive) k.gsap.set(root, { clearProps: 'all' }) }) }
  }
  return chars[0]
}
// ───────────────────────── рисунки ─────────────────────────
const ladleArt = inner =>
  svg(110, 290, SH(55, 286, 26, 4) + P('M46 130L64 130L68 270Q68 282 55 282Q42 282 42 270Z', '#B8C0CC', { sw: 5 }) +
    P('M8 100C8 70 30 56 55 56C80 56 102 70 102 100C102 132 80 146 55 146C30 146 8 132 8 100Z', '#DDE6F2', { sw: 5 }) +
    E(55, 96, 32, 20, inner, { sw: 0 }) + HL(30, 84, 8, 4, -30, 0.7))

/** Миска для супа / каши. fill — цвет содержимого (группа .fill скрыта, пока не налили). */
const bowlArt = (fill, extra = '') =>
  svg(220, 140, SH(110, 134, 90, 5) + S('M16 46Q16 126 110 126Q204 126 204 46Z', '#FFFFFF', '#DCE8F5') +
    `<g class="fill"><ellipse cx="110" cy="46" rx="92" ry="18" fill="${fill}"/><ellipse cx="86" cy="42" rx="30" ry="5" fill="#fff" opacity=".45"/>${extra}</g>` +
    E(110, 46, 94, 19, 'none') + P('M28 74Q110 92 192 74', 'none', { sw: 5, ink: '#FF8FC8' }) + HL(40, 92, 5, 16, 8, 0.7))

const soupBowl = () => bowlArt('#FFA94D', `<circle cx="70" cy="46" r="4" fill="#6BCB77"/><circle cx="120" cy="50" r="4" fill="#FF5A5F"/><circle cx="148" cy="42" r="4" fill="#FFD93D"/>`)
const porridgeBowl = () => bowlArt('#FFE7A6', `<ellipse cx="110" cy="40" rx="18" ry="8" fill="#FFF1B8" stroke="#F2C93A" stroke-width="3"/><circle cx="76" cy="46" r="7" fill="#B0324E"/><circle cx="150" cy="44" r="7" fill="#B0324E"/>`)

const pancakeArt = golden =>
  svg(240, 70, SH(120, 62, 100, 5) + S('M8 38C8 16 56 8 120 8C184 8 232 16 232 38C232 58 184 66 120 66C56 66 8 58 8 38Z', golden ? '#F2B45C' : '#FFE9B8', golden ? '#D9903A' : '#EBD08E') +
    (golden ? [[60, 30, 9], [110, 42, 11], [166, 30, 8], [200, 44, 6], [86, 50, 6]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.55}" fill="#B9701F" opacity=".75"/>`).join('') : [[70, 32], [120, 22], [170, 36], [96, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="#EBD08E" stroke-width="2"/>`).join('')) +
    HL(64, 24, 30, 5, -4, 0.55))

const doughArt = () =>
  svg(220, 140, SH(110, 134, 84, 5) + S('M20 84C8 42 60 14 112 16C172 14 214 46 204 88C198 124 150 134 108 132C60 134 26 120 20 84Z', '#FFEBC8', '#EFCE9C', { extra: '<circle cx="70" cy="60" r="4" fill="#fff" opacity=".8"/><circle cx="140" cy="46" r="3" fill="#fff" opacity=".8"/><circle cx="168" cy="92" r="4" fill="#fff" opacity=".8"/><circle cx="96" cy="100" r="3" fill="#fff" opacity=".8"/>' }) + HL(70, 44, 26, 8, -14, 0.6))

/** Карточка k.choose: у высоких рисунков процентная высота svg не работает (строка grid — auto), поэтому даём явный размер. */
const cardArt = html => `<div style="width:196px;height:196px;display:grid;place-items:center">${html}</div>`

const drop = (color, size = 14) => `<div style="width:100%;height:100%;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:${color};box-shadow:inset -3px -3px 0 rgba(0,0,0,.12)"></div>`

export const _art = { ladleArt, soupBowl, porridgeBowl, pancakeArt, doughArt }

// ───────────────────────── уровень ─────────────────────────
export default defineLevel({
  id: 'tool-names',
  async run(k) {
    k.bgTable({ wall: '#FFF3D6', dot: '#FFE2A6', cloth: '#7ED68C', cloth2: '#B7EDBD' })
    const pyx = k.pyx({ x: 250, y: 672, size: 380 })
    const hamster = k.guest('shchyok', 1420, 700, { size: 330, face: 'left' })
    guardEmotes(k, pyx, hamster)

    // мелкие помощники
    const mv = (sx, sy) => (x, y) => ({ x: x - sx, y: y - sy })
    const fall = (x, y, dy, color, n = 8, o = {}) => {
      for (let i = 0; i < n; i++) {
        const d = k.prop(drop(color), x + k.rand(-(o.spread ?? 18), o.spread ?? 18), y, o.size ?? 15, (o.size ?? 15) * 1.25, { z: 32 })
        k.fromTo(d, { opacity: 1, scale: 0.6 }, { opacity: 0, scale: 1, y: dy + k.rand(-12, 12), duration: o.dur ?? 0.7, delay: i * (o.gap ?? 0.07), ease: 'power1.in', onComplete: () => d.remove() })
      }
    }
    const burstDrops = (x, y, color, n = 7) => {
      for (let i = 0; i < n; i++) {
        const d = k.prop(drop(color), x, y, 14, 18, { z: 32 })
        k.timeline({ onComplete: () => d.remove() })
          .to(d, { x: k.rand(-80, 80), y: -k.rand(40, 100), duration: 0.28, ease: 'power2.out' })
          .to(d, { y: 20, opacity: 0, duration: 0.3, ease: 'power1.in' })
      }
    }
    const out = (el, o = {}) => k.to(el, { opacity: 0, scale: 0.4, duration: 0.3, onComplete: () => el.remove(), ...o })
    const pop = (el, vars = {}) => k.fromTo(el, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)', ...vars })

    await k.wait(300)
    await k.tell(pyx, 'hello', 'wave')
    await k.tell(pyx, 'how', 'point')

    // ── общая функция раунда ──
    const round = async ({ prompt, build, good, bads }) => {
      const stage = build()
      k.fromTo(stage.els, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' })
      k.sfx('whoosh')
      await k.wait(500)
      const colors = ['#FF8FC8', '#62C6FF', '#FFD93D']
      const mk = (o, correct, i) => ({ id: o.id, art: o.art, color: colors[i], correct, outcome: () => o.run(stage) })
      await k.choose({
        prompt: k.key(prompt), host: pyx,
        options: k.shuffle([mk(good, true, 0), mk(bads[0], false, 1), mk(bads[1], false, 2)]),
      })
      await k.wait(300)
      k.to(stage.els, { opacity: 0, y: 50, duration: 0.35, stagger: 0.05, onComplete: () => stage.els.forEach(e => e.remove()) })
      await k.wait(450)
    }

    // ═════════ 1. суп → половник ═════════
    const soupStage = () => {
      const pot = k.prop(kitchen.pot({ lid: false, soup: true }), 690, 585, 300, 230, { z: 6 })
      const bowl = k.prop(soupBowl(), 1080, 640, 230, 146, { z: 6 })
      k.gsap.set(bowl.querySelector('.fill'), { opacity: 0 })
      return { els: [pot, bowl], pot, bowl }
    }
    await round({
      prompt: 't1', build: soupStage,
      good: {
        id: 'ladle', art: cardArt(food('ladle')),
        run: async s => {
          const ladle = k.prop(ladleArt('#8C95B4'), 690, 250, 96, 254, { z: 30 })
          const T = mv(690, 250)
          k.gsap.set(ladle, { rotation: 180, scale: 0 })
          const tl = k.timeline()
          tl.to(ladle, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
            .to(ladle, { ...T(690, 452), duration: 0.55, ease: 'power2.inOut' })
            .call(() => { k.sfx('pour', { vol: 0.6 }); ladle.innerHTML = ladleArt('#FFA94D') })
            .to(ladle, { ...T(690, 452), duration: 0.35 })
            .to(ladle, { ...T(690, 340), duration: 0.5, ease: 'power2.out' })
            .to(ladle, { ...T(1050, 340), duration: 0.75, ease: 'power2.inOut' })
            .to(ladle, { rotation: 132, duration: 0.45, ease: 'power1.inOut' })
            .call(() => {
              k.sfx('pour')
              fall(1010, 420, 190, '#FFA94D', 9, { spread: 6, size: 16 })
              k.after(500, () => k.to(s.bowl.querySelector('.fill'), { opacity: 1, duration: 0.5 }))
            })
            .to(ladle, { rotation: 132, duration: 0.9 })
            .to(ladle, { ...T(1050, 250), rotation: 180, scale: 0, duration: 0.5, ease: 'power2.in' })
          await k.play(tl)
          ladle.remove()
          hamster.emote('happy')
          await k.tell(pyx, 'ok1', 'cheer')
        },
      },
      bads: [
        {
          id: 'whisk', art: cardArt(kitchen.whisk()),
          run: async s => {
            const w = k.prop(kitchen.whisk(), 690, 250, 96, 240, { z: 30 })
            const T = mv(690, 250)
            k.gsap.set(w, { scale: 0 })
            const tl = k.timeline()
            tl.to(w, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(w, { ...T(690, 470), duration: 0.5, ease: 'power2.inOut' })
              .to(w, { ...T(690, 350), duration: 0.45, ease: 'power2.out' })
              .call(() => { k.sfx('bloop'); fall(690, 420, 230, '#FFA94D', 12, { spread: 26, gap: 0.05 }) })
              .to(w, { rotation: 8, duration: 0.15, yoyo: true, repeat: 5 })
              .to(w, { scale: 0, opacity: 0, duration: 0.3, delay: 0.2 })
            pyx.emote('surprised')
            const say = k.tell(pyx, 'bad1a')
            await k.play(tl); w.remove()
            await say
          },
        },
        {
          id: 'pin', art: cardArt(food('rollingPin')),
          run: async s => {
            const p = k.food('rollingPin', 690, 250, 260, { z: 30 })
            const T = mv(690, 250)
            k.gsap.set(p, { rotation: 90, scale: 0 })
            const tl = k.timeline()
            tl.to(p, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(p, { ...T(690, 470), duration: 0.5, ease: 'power2.in' })
              .call(() => { k.sfx('splash'); burstDrops(690, 490, '#FFA94D', 10) })
              .to(p, { ...T(690, 560), opacity: 0, duration: 0.35 })
            pyx.emote('laugh')
            const say = k.tell(pyx, 'bad1b')
            await k.play(tl); p.remove()
            await say
          },
        },
      ],
    })

    // ═════════ 2. яйца → венчик ═════════
    const eggStage = () => {
      const bowl = k.prop(kitchen.bowl({ contents: 'eggs' }), 800, 590, 320, 197, { z: 6 })
      return { els: [bowl], bowl }
    }
    await round({
      prompt: 't2', build: eggStage,
      good: {
        id: 'whisk', art: cardArt(kitchen.whisk()),
        run: async s => {
          const w = k.prop(kitchen.whisk(), 800, 250, 96, 240, { z: 30 })
          const T = mv(800, 250)
          k.gsap.set(w, { scale: 0 })
          const tl = k.timeline()
          tl.to(w, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
            .to(w, { ...T(800, 520), duration: 0.5, ease: 'power2.inOut' })
          for (let i = 0; i < 6; i++) tl.to(w, { ...T(i % 2 ? 770 : 830, 520), rotation: i % 2 ? -12 : 12, duration: 0.17, ease: 'sine.inOut' })
          tl.call(() => { s.bowl.innerHTML = kitchen.bowl({ contents: 'whisked' }); k.burst(800, 560, 6) })
            .to(w, { ...T(800, 330), rotation: 0, duration: 0.45, ease: 'power2.out' })
            .to(w, { scale: 0, opacity: 0, duration: 0.3 })
          for (let i = 0; i < 6; i++) k.after(700 + i * 170, () => k.sfx('stir', { vol: 0.8 }))
          for (let i = 0; i < 8; i++) k.after(900 + i * 110, () => {
            const b = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#fff;box-shadow:0 0 0 3px #F2D06A"></div>', 800 + k.rand(-70, 70), 545, 18, 18, { z: 31 })
            k.to(b, { y: -k.rand(30, 70), scale: 1.6, opacity: 0, duration: 0.5, onComplete: () => b.remove() })
          })
          await k.play(tl); w.remove()
          k.sfx('ding')
          await k.tell(pyx, 'ok2', 'cheer')
        },
      },
      bads: [
        {
          id: 'ladle', art: cardArt(food('ladle')),
          run: async s => {
            const l = k.prop(ladleArt('#8C95B4'), 800, 250, 96, 254, { z: 30 })
            const T = mv(800, 250)
            k.gsap.set(l, { rotation: 180, scale: 0 })
            const tl = k.timeline()
            tl.to(l, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(l, { ...T(800, 440), duration: 0.5, ease: 'power2.in' })
              .call(() => { k.sfx('splash'); burstDrops(800, 540, '#FFD34D', 9) })
              .to(l, { ...T(800, 380), duration: 0.25 }).to(l, { ...T(800, 440), duration: 0.25 })
              .call(() => { k.sfx('splash'); burstDrops(800, 540, '#FFD34D', 6) })
              .to(l, { scale: 0, opacity: 0, duration: 0.3, delay: 0.2 })
            pyx.emote('laugh')
            const say = k.tell(pyx, 'bad2a')
            await k.play(tl); l.remove()
            await say
          },
        },
        {
          id: 'spatula', art: cardArt(food('spatula')),
          run: async s => {
            const sp = k.food('spatula', 1150, 560, 88, { z: 30 })
            const T = mv(1150, 560)
            k.gsap.set(sp, { rotation: -90, scale: 0 })
            const tl = k.timeline()
            tl.to(sp, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(sp, { ...T(900, 540), duration: 0.5, ease: 'power2.inOut' })
              .to(s.bowl, { rotation: -6, duration: 0.15, yoyo: true, repeat: 3 }, '<0.3')
              .to(sp, { ...T(1150, 560), scale: 0, opacity: 0, duration: 0.4, delay: 0.1 })
            pyx.emote('shake')
            const say = k.tell(pyx, 'bad2b')
            await k.play(tl); sp.remove()
            await say
          },
        },
      ],
    })

    // ═════════ 3. блин → лопатка ═════════
    const pancakeStage = () => {
      const pan = k.prop(kitchen.pan({}), 760, 612, 460, 195, { z: 6 })
      const cake = k.prop(pancakeArt(false), 730, 600, 236, 68, { z: 9 })
      return { els: [pan, cake], pan, cake }
    }
    await round({
      prompt: 't3', build: pancakeStage,
      good: {
        id: 'spatula', art: cardArt(food('spatula')),
        run: async s => {
          const sp = k.food('spatula', 1120, 560, 92, { z: 8 })
          const T = mv(1120, 560)
          k.gsap.set(sp, { rotation: -90, scale: 0 })
          const cy = 600
          const tl = k.timeline()
          tl.to(sp, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
            .to(sp, { ...T(810, 608), duration: 0.55, ease: 'power2.inOut' })
            .to([sp, s.cake], { y: '-=16', duration: 0.18 })
            .call(() => k.sfx('flip'))
            .to(s.cake, { y: -230, scaleY: 0.12, duration: 0.42, ease: 'power2.out' }, '<')
            .call(() => { s.cake.innerHTML = pancakeArt(true) })
            .to(s.cake, { y: 0, scaleY: 1, duration: 0.42, ease: 'power2.in' })
            .call(() => { k.sfx('plop'); k.sparkle(730, 590, 6) })
            .to(s.cake, { scaleY: 0.85, duration: 0.1, yoyo: true, repeat: 1 })
            .to(sp, { ...T(1120, 560), scale: 0, opacity: 0, duration: 0.4, delay: 0.1 })
          await k.play(tl); sp.remove()
          await k.tell(pyx, 'ok3', 'cheer')
        },
      },
      bads: [
        {
          id: 'whisk', art: cardArt(kitchen.whisk()),
          run: async s => {
            const w = k.prop(kitchen.whisk(), 730, 250, 96, 240, { z: 30 })
            const T = mv(730, 250)
            k.gsap.set(w, { scale: 0 })
            const tl = k.timeline()
            tl.to(w, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(w, { ...T(730, 520), duration: 0.5, ease: 'power2.inOut' })
              .to(w, { ...T(730, 330), duration: 0.45, ease: 'power2.out' })
              .to(s.cake, { y: -190, rotation: 14, scaleX: 0.55, duration: 0.45, ease: 'power2.out' }, '<')
              .to(w, { rotation: 10, duration: 0.15, yoyo: true, repeat: 5 })
              .to([w, s.cake], { opacity: 0, duration: 0.3 })
              .set(s.cake, { y: 0, rotation: 0, scaleX: 1 })
              .to(s.cake, { opacity: 1, duration: 0.3 })
            pyx.emote('laugh')
            k.sfx('boing')
            const say = k.tell(pyx, 'bad3a')
            await k.play(tl); w.remove()
            await say
          },
        },
        {
          id: 'ladle', art: cardArt(food('ladle')),
          run: async s => {
            const l = k.prop(ladleArt('#8C95B4'), 730, 250, 96, 254, { z: 30 })
            const T = mv(730, 250)
            k.gsap.set(l, { rotation: 180, scale: 0 })
            const tl = k.timeline()
            tl.to(l, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(l, { ...T(730, 500), duration: 0.5, ease: 'power2.in' })
              .to(s.cake, { x: 60, rotation: 20, duration: 0.25, ease: 'power2.out' })
              .to(s.cake, { x: 0, rotation: 0, duration: 0.35, ease: 'bounce.out' })
              .to(l, { scale: 0, opacity: 0, duration: 0.3 })
            pyx.emote('shake')
            const say = k.tell(pyx, 'bad3b')
            await k.play(tl); l.remove()
            await say
          },
        },
      ],
    })

    // ═════════ 4. тесто → скалка ═════════
    const doughStage = () => {
      const board = k.food('board', 800, 545, 560, { z: 5 })
      const dough = k.prop(doughArt(), 800, 550, 200, 127, { z: 7 })
      return { els: [board, dough], board, dough }
    }
    await round({
      prompt: 't4', build: doughStage,
      good: {
        id: 'pin', art: cardArt(food('rollingPin')),
        run: async s => {
          const p = k.food('rollingPin', 800, 300, 300, { z: 30 })
          const T = mv(800, 300)
          k.gsap.set(p, { scale: 0 })
          const tl = k.timeline()
          tl.to(p, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
            .to(p, { ...T(660, 540), duration: 0.5, ease: 'power2.inOut' })
            .to(p, { ...T(940, 540), duration: 0.55, ease: 'sine.inOut' })
            .to(s.dough, { scaleX: 1.7, scaleY: 0.62, duration: 0.55, ease: 'sine.inOut' }, '<')
            .to(p, { ...T(660, 540), duration: 0.5, ease: 'sine.inOut' })
            .to(s.dough, { scaleX: 2.3, scaleY: 0.5, duration: 0.5, ease: 'sine.inOut' }, '<')
            .to(p, { ...T(800, 300), scale: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
          for (let i = 0; i < 5; i++) k.after(600 + i * 260, () => k.sfx('swing', { vol: 0.5 }))
          await k.play(tl); p.remove()
          k.sparkle(800, 540, 6)
          await k.tell(pyx, 'ok4', 'cheer')
        },
      },
      bads: [
        {
          id: 'spoon', art: cardArt(food('spoon')),
          run: async s => {
            const sp = k.food('spoon', 800, 300, 60, { z: 30 })
            const T = mv(800, 300)
            k.gsap.set(sp, { scale: 0, rotation: 180 })
            const tl = k.timeline()
            tl.to(sp, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(sp, { ...T(800, 470), duration: 0.45, ease: 'power2.in' })
              .to(s.dough, { scaleY: 0.85, duration: 0.1 })
              .to(sp, { ...T(800, 320), duration: 0.5, ease: 'power2.out' })
              .to(s.dough, { scaleY: 1.5, y: -30, duration: 0.5, ease: 'power2.out', transformOrigin: '50% 100%' }, '<')
              .to(s.dough, { scaleY: 1, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
              .to(sp, { scale: 0, opacity: 0, duration: 0.3 }, '<')
            k.sfx('yuck', { vol: 0.5 })
            pyx.emote('laugh')
            const say = k.tell(pyx, 'bad4a')
            await k.play(tl); sp.remove()
            await say
          },
        },
        {
          id: 'colander', art: cardArt(food('colander')),
          run: async s => {
            const c = k.food('colander', 800, 300, 240, { z: 30 })
            const T = mv(800, 300)
            k.gsap.set(c, { scale: 0 })
            const worms = []
            const tl = k.timeline()
            tl.to(c, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(c, { ...T(800, 470), duration: 0.45, ease: 'power2.in' })
              .to(s.dough, { scaleX: 1.25, scaleY: 0.7, duration: 0.2 })
              .call(() => {
                k.sfx('boing')
                for (let i = 0; i < 6; i++) {
                  const wv = k.prop('<div style="width:100%;height:100%;border-radius:12px;background:#FFEBC8;box-shadow:0 0 0 4px #3B2F4F"></div>', 730 + i * 28, 590, 16, 34, { z: 31 })
                  worms.push(wv)
                  k.fromTo(wv, { scaleY: 0 }, { scaleY: 1, duration: 0.3, transformOrigin: '50% 0%', delay: i * 0.05 })
                  k.to(wv, { rotation: i % 2 ? 14 : -14, y: '+=10', duration: 0.3, yoyo: true, repeat: 3, delay: 0.3 })
                }
              })
              .to({}, { duration: 0.9 })
              .to([...worms, c], { opacity: 0, duration: 0.3 })
              .to(s.dough, { scaleX: 1, scaleY: 1, duration: 0.3 }, '<')
            pyx.emote('laugh')
            const say = k.tell(pyx, 'bad4b')
            await k.play(tl); c.remove(); worms.forEach(w => w.remove())
            await say
          },
        },
      ],
    })

    // ═════════ 5. макароны → дуршлаг ═════════
    const pastaStage = () => {
      const pot = k.prop(kitchen.pot({ lid: false, soup: false }), 610, 585, 300, 230, { z: 6 })
      const pasta = [0, 1].map(i => k.food('pasta', 590 + i * 50, 500 + i * 6, 90, { z: 8 }))
      return { els: [pot, ...pasta], pot, pasta }
    }
    await round({
      prompt: 't5', build: pastaStage,
      good: {
        id: 'colander', art: cardArt(food('colander')),
        run: async s => {
          const c = k.food('colander', 1040, 540, 300, { z: 7 })
          const basin = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#9BD8F7;box-shadow:0 0 0 5px #3B2F4F;opacity:0"></div>', 1040, 692, 300, 34, { z: 5 })
          k.gsap.set(c, { scale: 0 })
          await k.play(k.gsap.to(c, { scale: 1, duration: 0.4, ease: 'back.out(2)' }))
          const potEl = s.pot
          const tl = k.timeline()
          tl.to(potEl, { x: 300, y: -110, rotation: 52, duration: 0.8, ease: 'power2.inOut' })
            .call(() => {
              k.sfx('pour')
              k.to(s.pasta, { x: 420, y: -60, rotation: 200, duration: 0.6, ease: 'power2.in', stagger: 0.12 })
              for (let i = 0; i < 3; i++) k.after(700 + i * 120, () => fall(830 + i * 8, 470, 220, '#7CC8F5', 5, { spread: 8, size: 13, dur: 0.5, gap: 0.05 }))
              k.to(basin, { opacity: 1, duration: 0.6, delay: 0.8 })
              for (let i = 0; i < 5; i++) k.after(1300 + i * 140, () => fall(1040 + k.rand(-70, 70), 640, 40, '#7CC8F5', 2, { size: 12, dur: 0.4 }))
            })
            .to({}, { duration: 1.3 })
            .to(potEl, { x: 0, y: 0, rotation: 0, duration: 0.7, ease: 'power2.inOut' })
          await k.play(tl)
          k.to(s.pasta, { x: 425, y: -55, rotation: 0, duration: 0.2 })
          s.els.push(c, basin)
          await k.tell(pyx, 'ok5', 'cheer')
        },
      },
      bads: [
        {
          id: 'ladle', art: cardArt(food('ladle')),
          run: async s => {
            const l = k.prop(ladleArt('#7CC8F5'), 610, 250, 96, 254, { z: 30 })
            const T = mv(610, 250)
            k.gsap.set(l, { rotation: 180, scale: 0 })
            const tl = k.timeline()
            tl.to(l, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(l, { ...T(610, 452), duration: 0.5, ease: 'power2.inOut' })
              .to(l, { ...T(610, 350), duration: 0.45, ease: 'power2.out' })
              .call(() => { k.sfx('bloop'); fall(610, 430, 230, '#7CC8F5', 7, { spread: 10 }) })
              .to(s.pasta, { y: '-=30', duration: 0.2, yoyo: true, repeat: 1 })
              .to(l, { scale: 0, opacity: 0, duration: 0.3, delay: 0.3 })
            pyx.emote('think')
            const say = k.tell(pyx, 'bad5a')
            await k.play(tl); l.remove()
            await say
          },
        },
        {
          id: 'whisk', art: cardArt(kitchen.whisk()),
          run: async s => {
            const w = k.prop(kitchen.whisk(), 610, 250, 96, 240, { z: 30 })
            const T = mv(610, 250)
            k.gsap.set(w, { scale: 0 })
            const ext = [0, 1, 2].map(i => k.food('pasta', 610 + (i - 1) * 24, 390 + (i % 2) * 20, 46, { z: 31 }))
            k.gsap.set(ext, { scale: 0 })
            const tl = k.timeline()
            tl.to(w, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(w, { ...T(610, 470), duration: 0.5, ease: 'power2.inOut' })
              .call(() => { k.gsap.set(ext, { scale: 1 }) })
              .to(w, { ...T(610, 330), duration: 0.45, ease: 'power2.out' })
              .to(ext, { y: '-=142', duration: 0.45, ease: 'power2.out' }, '<')
              .to([w, ...ext], { rotation: 8, duration: 0.15, yoyo: true, repeat: 5 })
              .to([w, ...ext], { opacity: 0, duration: 0.3 })
            pyx.emote('laugh')
            k.sfx('boing')
            const say = k.tell(pyx, 'bad5b')
            await k.play(tl); w.remove(); ext.forEach(e => e.remove())
            await say
          },
        },
      ],
    })

    // ═════════ 6. каша → ложка ═════════
    const porridgeStage = () => {
      const bowl = k.prop(porridgeBowl(), 1010, 640, 250, 159, { z: 6 })
      return { els: [bowl], bowl }
    }
    const mouth = () => { const c = k.centerOf(hamster.el); return { x: c.x - 62, y: c.y - 20 } }
    await round({
      prompt: 't6', build: porridgeStage,
      good: {
        id: 'spoon', art: cardArt(food('spoon')),
        run: async s => {
          const sp = k.food('spoon', 1010, 330, 60, { z: 30 })
          const T = mv(1010, 330)
          const m = mouth()
          k.gsap.set(sp, { scale: 0, rotation: 200 })
          const tl = k.timeline()
          tl.to(sp, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
            .to(sp, { ...T(1010, 520), duration: 0.45, ease: 'power2.inOut' })
            .call(() => k.sfx('plop'))
            .to(sp, { ...T(1010, 440), rotation: 250, duration: 0.4, ease: 'power2.out' })
            .to(sp, { ...T(m.x - 40, m.y), rotation: 270, duration: 0.7, ease: 'power2.inOut' })
            .call(() => { k.sfx('yum'); hamster.emote('happy') })
            .to(sp, { ...T(m.x - 20, m.y), duration: 0.25, yoyo: true, repeat: 1 })
            .to(sp, { scale: 0, opacity: 0, duration: 0.3 })
          await k.play(tl); sp.remove()
          k.burst(m.x, m.y - 40, 8)
          await k.tell(hamster, 'ok6', 'laugh')
        },
      },
      bads: [
        {
          id: 'fork', art: cardArt(food('fork')),
          run: async s => {
            const f = k.food('fork', 1010, 330, 60, { z: 30 })
            const T = mv(1010, 330)
            const m = mouth()
            k.gsap.set(f, { scale: 0, rotation: 200 })
            const tl = k.timeline()
            tl.to(f, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(f, { ...T(1010, 520), duration: 0.45, ease: 'power2.inOut' })
              .to(f, { ...T(1010, 440), rotation: 250, duration: 0.4, ease: 'power2.out' })
              .to(f, { ...T(1150, 470), rotation: 262, duration: 0.5, ease: 'power2.inOut' })
              .call(() => { k.sfx('yuck', { vol: 0.5 }); fall(1150, 520, 130, '#FFE7A6', 7, { spread: 22, size: 15 }) })
              .to({}, { duration: 0.8 })
              .to(f, { scale: 0, opacity: 0, duration: 0.3 })
            hamster.emote('sad')
            const say = k.tell(hamster, 'bad6a')
            await k.play(tl); f.remove()
            await say
          },
        },
        {
          id: 'ladle', art: cardArt(food('ladle')),
          run: async s => {
            const l = k.prop(ladleArt('#8C95B4'), 1010, 330, 96, 254, { z: 30 })
            const T = mv(1010, 330)
            const m = mouth()
            k.gsap.set(l, { scale: 0, rotation: 250 })
            const tl = k.timeline()
            tl.to(l, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
              .to(l, { ...T(m.x - 60, m.y + 10), duration: 0.8, ease: 'power2.inOut' })
              .call(() => k.sfx('clonk'))
              .to(l, { x: '+=30', duration: 0.1, yoyo: true, repeat: 3 })
              .to(l, { scale: 0, opacity: 0, duration: 0.3, delay: 0.3 })
            hamster.emote('surprised')
            const say = k.tell(hamster, 'bad6b')
            await k.play(tl); l.remove()
            await say
          },
        },
      ],
    })

    // ═════════ финал: все помощники в ряд ═════════
    const lineup = [
      ['ladle', () => k.prop(ladleArt('#8C95B4'), 0, 0, 84, 222, { z: 20 })],
      ['whisk', () => k.prop(kitchen.whisk(), 0, 0, 84, 210, { z: 20 })],
      ['spatula', () => k.food('spatula', 0, 0, 78, { z: 20 })],
      ['pin', () => { const e = k.food('rollingPin', 0, 0, 230, { z: 20 }); k.gsap.set(e, { rotation: 90 }); return e }],
      ['colander', () => k.food('colander', 0, 0, 190, { z: 20 })],
      ['spoon', () => k.food('spoon', 0, 0, 56, { z: 20 })],
    ]
    const xs = [520, 660, 800, 940, 1080, 1220]
    const row = lineup.map(([, mkEl], i) => {
      const e = mkEl()
      const sz = k.rectOf(e)
      k.gsap.set(e, { x: xs[i] - (sz.x + sz.w / 2), y: 640 - (sz.y + sz.h) })
      return e
    })
    k.fromTo(row, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.1, ease: 'back.out(2)' })
    k.sfx('tada')
    await k.wait(700)
    const hop = ids => ids.forEach((i, n) => k.after(n * 700, () => { k.to(row[i], { y: '-=40', duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }); k.sfx('pop') }))
    hop([0, 1, 2]); await k.narrate('sum1')
    hop([3, 4, 5]); await k.narrate('sum2')
    await k.tell(pyx, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
