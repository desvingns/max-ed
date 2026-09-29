// «Песочные часы» — время идёт, пока сыплется песок; ждать — это тоже умение (считаем до десяти);
// чем дольше готовится блюдо, тем больше нужны часы (k.dnd: тост / яйцо / пирог → малые / средние / большие).
// Финал: пирог в духовку (со взрослым), большие часы, «динь!», пирог готов.
import { defineLevel, food, SIZE } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, nid } from '../art.js'

// ───────────────────────── рисуем сами ─────────────────────────
const SAND = '#FFD93D'
const GLASS_PATH = 'M50 34H190C190 110 150 150 128 180C150 210 190 250 190 326H50C50 250 90 210 112 180C90 150 50 110 50 34Z'

/** Песочные часы 240×360. Песок в начальном состоянии — весь наверху (t=0). setSand(el, t) меняет состояние. */
function hourglassSvg(cap = '#C68B59') {
  const id = nid('hg')
  return svg(240, 360,
    SH(120, 356, 90, 8) +
    P(GLASS_PATH, '#E9F7FF', { sw: 5 }) +
    `<clipPath id="${id}"><path d="${GLASS_PATH}"/></clipPath>` +
    `<g clip-path="url(#${id})"><rect class="st" x="30" y="54" width="180" height="130" fill="${SAND}"/><rect class="st2" x="30" y="54" width="60" height="130" fill="#F2B824" opacity=".35"/><path class="sb" d="M30 326L210 326Z" fill="${SAND}"/></g>` +
    `<line class="ss" x1="120" y1="176" x2="120" y2="300" stroke="#F2B824" stroke-width="6" stroke-linecap="round" stroke-dasharray="3 8" opacity="0"/>` +
    P(GLASS_PATH, 'none', { sw: 5 }) + HL(76, 80, 7, 30, 12, 0.6) + HL(84, 270, 6, 24, -12, 0.5) +
    R(34, 30, 12, 300, 6, '#C68B59') + R(194, 30, 12, 300, 6, '#C68B59') +
    R(22, 6, 196, 30, 14, cap) + R(22, 324, 196, 30, 14, cap) + HL(60, 18, 30, 4, 0, 0.5) + HL(60, 336, 30, 4, 0, 0.4))
}
/** t: 0 — весь песок наверху, 1 — весь внизу. */
function setSand(el, t) {
  const st = el.querySelector('.st'), st2 = el.querySelector('.st2'), sb = el.querySelector('.sb'), ss = el.querySelector('.ss')
  const yTop = 54 + t * 130
  const hTop = Math.max(0, 186 - yTop)
  st.setAttribute('y', yTop); st.setAttribute('height', hTop)
  st2.setAttribute('y', yTop); st2.setAttribute('height', hTop)
  const h = t * 128, yb = 326 - h
  const amp = t > 0 && t < 1 ? 14 : 0
  sb.setAttribute('d', h > 0.5 ? `M30 326L30 ${yb + amp}Q120 ${yb - amp * 0.6} 210 ${yb + amp}L210 326Z` : 'M30 326L210 326Z')
  if (t > 0.002 && t < 0.998) { ss.setAttribute('y2', yb - amp * 0.5); ss.setAttribute('opacity', '1') } else ss.setAttribute('opacity', '0')
}

function pieSvg() {
  const dome = 'M18 108C24 46 76 30 130 30C184 30 236 46 242 108C242 132 200 146 130 146C60 146 18 132 18 108Z'
  const strips = [40, 80, 120, 160, 200].map(x => L(`M${x} 30L${x + 46} 146`, '#F6D08F', 9) + L(`M${x + 46} 30L${x} 146`, '#F6D08F', 9)).join('')
  const crimp = Array.from({ length: 9 }, (_, i) => C(34 + i * 24, 132 - Math.sin((i / 8) * Math.PI) * 4, 13, '#E6A462', { sw: 4 })).join('')
  return svg(260, 170,
    SH(130, 164, 116, 7) + E(130, 142, 126, 20, '#DDE6F2') + crimp +
    S(dome, '#E6A462', '#C98546', { extra: strips }) + F('M60 60Q130 34 200 60Q130 46 60 60Z', '#fff', 'opacity=".35"') +
    C(130, 84, 12, '#FF5A5F', { sw: 4 }) + HL(90, 56, 30, 6, -12, 0.5))
}

function pancakeSvg() {
  return svg(200, 120,
    SH(100, 114, 84, 6) +
    S('M12 66Q12 96 100 100Q188 96 188 66L188 54Q188 28 100 26Q12 28 12 54Z', '#E4A85C', '#C88A3E', {}) +
    E(100, 50, 84, 24, '#F5CD85', { sw: 4 }) +
    R(80, 38, 40, 26, 6, '#FFEB7A', { sw: 4 }) + F('M100 64Q108 82 100 92Q94 82 100 64Z', '#FFB938') + HL(56, 44, 18, 5, -10, 0.55))
}

/** Жетон-блюдо: круглая «монетка». */
function token(art, w, h, color, fit = 112, rot = 0) {
  const s = Math.min(fit / w, fit / h)
  return `<div style="width:100%;height:100%;border-radius:50%;background:#fff;box-shadow:0 9px 0 rgba(0,0,0,.16),inset 0 0 0 10px ${color};display:grid;place-items:center"><div style="width:${w * s}px;height:${h * s}px;${rot ? `transform:rotate(${rot}deg)` : ''}">${art}</div></div>`
}
/** Зона: карточка с часами нужного размера. pct — высота часов в % карточки. */
function hgCard(color, cap, pct) {
  return `<div style="width:100%;height:100%;border-radius:40px;background:rgba(255,255,255,.92);box-shadow:inset 0 0 0 10px ${color},0 10px 0 rgba(0,0,0,.14);display:grid;place-items:end center;padding-bottom:22px;box-sizing:border-box"><div style="height:${pct}%;aspect-ratio:240/360">${hourglassSvg(cap)}</div></div>`
}

export default defineLevel({
  id: 'sand-timer',
  async run(k) {
    const gsap = k.gsap
    // жесты героя — в очередь (перекрытие жестов сдвигает стойку героя); «cheer» не используем — он «уводит» героя вниз
    const emoQ = new Map()
    const emo = (c, name) => { const p = (emoQ.get(c) ?? Promise.resolve()).then(() => (k.alive ? c.emote(name) : null)).catch(() => {}); emoQ.set(c, p); return p }
    const tell = (c, id, name) => { if (name) emo(c, name); return k.tell(c, id) }

    k.kitchenBg()
    const pyx = k.pyx({ x: 250 })

    // ── большие песочные часы на столе ──
    const hg = k.prop(hourglassSvg('#FF5A5F'), 800, 548, 226, 339, { z: 7 })
    setSand(hg, 1)
    k.fromTo(hg, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' })
    await k.wait(800)

    const flip = async el => {
      k.sfx('whoosh')
      await k.play(gsap.to(el, { rotation: 180, duration: 0.7, ease: 'back.inOut(1.5)' }))
      gsap.set(el, { rotation: 0 })
      setSand(el, 0)
      k.sparkle(k.centerOf(el).x, k.centerOf(el).y, 4)
    }
    /** Песок сыплется sec секунд. count — считаем вслух до десяти. */
    const runSand = async (el, sec, count) => {
      const o = { t: 0 }
      const ss = el.querySelector('.ss')
      const dash = k.to(ss, { attr: { 'stroke-dashoffset': -22 }, duration: 0.5, repeat: -1, ease: 'none' })
      const c = k.centerOf(el)
      const done = k.play(gsap.to(o, { t: 1, duration: sec, ease: 'none', onUpdate: () => setSand(el, o.t) }))
      if (count) {
        const cnt = k.badge('1', c.x + 190, c.y - 60, { size: 116, color: '#FFD93D' })
        for (let i = 1; i <= 10; i++) {
          cnt.textContent = String(i)
          k.sfx('tick')
          gsap.fromTo(cnt, { scale: 1.35 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' })
          await Promise.all([k.sayNumber(i), k.wait(1000)])
        }
        await done
        cnt.remove()
      } else {
        await done
      }
      dash.kill()
      setSand(el, 1)
    }

    // ── 0. знакомство ──
    await tell(pyx, 'hello', 'wave')
    await tell(pyx, 'intro', 'point')

    // ── 1. переворачиваем и ждём ──
    await k.tapOnEl(hg, { prompt: k.key('q_flip'), host: pyx })
    await flip(hg)
    // нетерпеливые нажатия во время ожидания: часы качаются, Пых мягко просит подождать
    let lastImpatient = 0, waiting = true
    k.on(hg, 'pointerdown', () => {
      if (!waiting) return
      k.fx.wiggle(hg)
      k.sfx('tick')
      if (performance.now() - lastImpatient > 6000) { lastImpatient = performance.now(); tell(pyx, 'wait_more', 'nod') }
    })
    const sand1 = runSand(hg, 10.4, true)
    await tell(pyx, 'flowing', 'happy')
    await sand1
    waiting = false
    k.sfx('ding')
    k.burst(800, 420, 10)
    await tell(pyx, 'time_up', 'jump')
    await tell(pyx, 'patience', 'nod')

    // ── 2. часы разного размера: что готовится быстро, что долго ──
    await k.play(gsap.to(hg, { scale: 0, opacity: 0, duration: 0.35, ease: 'back.in(2)' }))
    hg.remove()
    const Z = [
      { id: 'small', x: 560, color: '#6BCB77', cap: '#6BCB77', pct: 52 },
      { id: 'medium', x: 850, color: '#FFD93D', cap: '#FFD93D', pct: 72 },
      { id: 'big', x: 1140, color: '#FF5A5F', cap: '#FF5A5F', pct: 94 },
    ]
    const zones = Z.map(z => ({ ...z, el: k.prop(hgCard(z.color, z.cap, z.pct), z.x, 470, 240, 290, { z: 3 }) }))
    k.popIn(zones.map(z => z.el), 0.15)
    k.sfx('pop')
    await k.wait(600)
    await tell(pyx, 'sizes', 'point')
    // подсветим по очереди: маленькие — средние — большие
    for (const z of zones) { gsap.fromTo(z.el, { scale: 1.12 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1.4,0.4)' }); k.sfx('tick'); await k.wait(650) }

    const ORDER = { small: 0, medium: 1, big: 2 }
    const sortRound = (items, prompt) => k.dnd({
      items, zones, prompt: prompt ? k.key(prompt) : null, host: pyx,
      accept: (it, z) => it.size === z.id,
      onCorrect: async (it, z) => {
        const c = k.centerOf(z.el), here = k.centerOf(it.el)
        await k.play(gsap.to(it.el, { x: `+=${c.x - here.x}`, y: `+=${c.y - here.y - 30}`, scale: 0.6, duration: 0.35, ease: 'back.out(1.4)' }))
        gsap.fromTo(z.el, { scale: 1.1 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.4,0.4)' })
        k.sparkle(c.x, c.y - 30, 5)
        k.sfx('ding', { vol: 0.5 })
        await tell(pyx, it.say, 'happy')
        gsap.to(it.el, { scale: 0.1, opacity: 0, duration: 0.3 })
      },
      onWrong: async (it, z) => {
        if (!z) return
        k.sfx('wrong', { vol: 0.5 })
        await tell(pyx, ORDER[z.id] < ORDER[it.size] ? 'too_short' : 'too_long', 'shake')
      },
    })
    const mkItems = list => list.map(([id, size, say, color, art, w, h, o], i) => ({
      id, size, say,
      el: k.prop(token(art, w, h, color, o?.fit, o?.rot), [640, 850, 1060][i], 858, 170, 170, { z: 20 }),
    }))

    // раунд 1: тост, яйцо, пирог
    const r1 = mkItems(k.shuffle([
      ['toast', 'small', 'ok_toast', '#E6A462', food('breadSlice'), ...SIZE.breadSlice],
      ['egg', 'medium', 'ok_egg', '#FFD93D', food('egg'), ...SIZE.egg],
      ['pie', 'big', 'ok_pie', '#FF9F43', pieSvg(), 260, 170, { fit: 124 }],
    ]))
    k.popIn(r1.map(i => i.el), 0.12)
    await k.wait(500)
    await sortRound(r1, 'q_sort1')
    await k.wait(400)
    r1.forEach(i => i.el.remove())

    // раунд 2: блинчик, макароны, картошка
    await tell(pyx, 'r2', 'happy')
    const r2 = mkItems(k.shuffle([
      ['pancake', 'small', 'ok_pancake', '#FFB938', pancakeSvg(), 200, 120, { fit: 124 }],
      ['pasta', 'medium', 'ok_pasta', '#FFD93D', food('pasta'), ...SIZE.pasta],
      ['potato', 'big', 'ok_potato', '#C68B59', food('potato'), ...SIZE.potato],
    ]))
    k.popIn(r2.map(i => i.el), 0.12)
    await k.wait(500)
    await sortRound(r2, 'q_sort2')
    await k.wait(500)
    r2.forEach(i => i.el.remove())

    // ── 3. финал: пирог в духовке ──
    await k.play(gsap.to(zones.map(z => z.el), { scale: 0, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'back.in(2)' }))
    zones.forEach(z => z.el.remove())
    const st = k.stove()
    const bigHg = k.prop(hourglassSvg('#FF5A5F'), 1250, 555, 170, 255, { z: 7 })
    setSand(bigHg, 1)
    k.fromTo([st.el, bigHg], { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' })
    await k.wait(700)
    await tell(pyx, 'pie_time', 'point')
    await k.adultHelp({ knob: st.knobEl(0), host: pyx })
    st.on(0)
    await k.wait(500)

    // поставить пирог в духовку
    const pieTok = k.prop(token(pieSvg(), 260, 170, '#FF9F43', 124), 820, 858, 170, 170, { z: 20 })
    k.popIn(pieTok)
    const oven = k.prop('<div></div>', 820, 640, 320, 130, { z: 8 })
    await k.dnd({
      items: [{ id: 'pie', el: pieTok }], zones: [{ id: 'oven', el: oven, pad: 60 }],
      prompt: k.key('q_pie'), host: pyx, accept: () => true,
      onCorrect: async (it, z) => {
        const c = k.centerOf(oven), here = k.centerOf(it.el)
        await k.play(gsap.to(it.el, { x: `+=${c.x - here.x}`, y: `+=${c.y - here.y}`, scale: 0.4, opacity: 0, duration: 0.6, ease: 'power2.in' }))
        k.sfx('clonk')
      },
    })
    pieTok.remove()
    await tell(pyx, 'pie_in', 'point')

    // большие часы: переворачиваем и ждём (ускоренно)
    await k.tapOnEl(bigHg, { prompt: k.key('q_flip2'), host: pyx })
    await flip(bigHg)
    await runSand(bigHg, 4.2, false)
    k.sfx('ding')
    k.burst(820, 560, 10)
    // пирог выезжает из духовки
    const pie = k.prop(pieSvg(), 820, 640, 230, 150, { z: 12 })
    const steam = k.prop(kitchen.steam(), 820, 520, 150, 108, { z: 13 })
    k.fromTo(pie, { y: 20, scale: 0.4, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' })
    k.fromTo(steam, { y: 30, opacity: 0 }, { y: -20, opacity: 0.9, duration: 1.2, ease: 'sine.out', repeat: 3, yoyo: true })
    await tell(pyx, 'ding', 'jump')
    const mitt = k.prop(kitchen.mitt(), 450, 600, 96, 122, { z: 12 })
    k.popIn(mitt)
    await tell(pyx, 'take_out', 'point')
    st.off(0)
    await k.line(pyx, 'e.kitchen-omelet.off')
    mitt.remove()

    // ── 4. вывод ──
    k.burst(820, 560, 12)
    await tell(pyx, 'sum', 'point')
    await tell(pyx, 'bye', 'jump')
    k.burst(800, 420, 14)
  },
})
