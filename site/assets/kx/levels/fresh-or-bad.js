// «Свежее или испорченное?» — смотрим (плесень, вялый салат), нюхаем (кислое молоко), спрашиваем взрослого (срок годности).
// Механика: k.dnd в 3 зоны (корзинка / ведёрко / мама), три раунда: глазами → носом → «спроси взрослого».
import { defineLevel, food } from '../lib.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S } from '../art.js'

const G = { base: '#6BCB77', shade: '#45B57C', dark: '#2E8F5B' }

// ───────────────────────── рисуем сами ─────────────────────────
const spark = (x, y, r, c = '#FFF6B0') => `<path d="M${x} ${y - r}Q${x + r * 0.15} ${y - r * 0.15} ${x + r} ${y}Q${x + r * 0.15} ${y + r * 0.15} ${x} ${y + r}Q${x - r * 0.15} ${y + r * 0.15} ${x - r} ${y}Q${x - r * 0.15} ${y - r * 0.15} ${x} ${y - r}Z" fill="${c}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`
const sparkles = () => svg(170, 180, spark(20, 34, 17) + spark(152, 22, 13, '#FFFFFF') + spark(154, 122, 10) + spark(12, 130, 9, '#FFFFFF'), 'style="position:absolute;inset:0"')
const stink = () => `<div class="stink" style="position:absolute;left:8%;right:8%;top:-34%;height:34%">${svg(200, 100, [46, 100, 154].map((x, i) => L(`M${x} 96Q${x + 16} 76 ${x} 56T${x} 16`, '#8FCB4B', 8, `opacity="${0.9 - i * 0.12}"`)).join(''))}</div>`
const flySvg = () => svg(60, 50,
  E(20, 16, 14, 9, '#fff', { sw: 3, rot: -25, attr: 'opacity=".92"' }) + E(38, 12, 14, 9, '#fff', { sw: 3, rot: 22, attr: 'opacity=".92"' }) +
  S('M8 30Q8 16 28 16Q50 16 50 30Q50 44 28 44Q8 44 8 30Z', '#6B5E82', '#4A3F5E') +
  C(40, 27, 6.5, '#fff', { sw: 2.5 }) + C(41, 28, 3, INK, { sw: 0 }) + C(30, 24, 5, '#fff', { sw: 2.5 }) + C(31, 25, 2.6, INK, { sw: 0 }))
const flies = n => Array.from({ length: n }, (_, i) => `<div class="fly" style="position:absolute;left:${[62, -6, 40][i]}%;top:${[-12, 4, 44][i]}%;width:26%;height:22%">${flySvg()}</div>`).join('')
/** Обёртка спрайта: внутри — «метки»: искорки свежести / вонючка / мушки. */
const wrap = (inner, o = {}) => `<div style="position:relative;width:100%;height:100%">${inner}${o.stink ? stink() : ''}${o.sparkle ? sparkles() : ''}${flies(o.flies ?? 0)}</div>`

function moldyBread() {
  const body = 'M22 80C16 30 60 16 130 16C200 16 244 30 238 80C238 100 230 108 226 110L226 130Q226 138 216 138L44 138Q34 138 34 130L34 110C30 108 22 100 22 80Z'
  const cluster = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[[0, 0, 15], [17, 6, 11], [-16, 8, 10], [6, 17, 9], [-4, -13, 8]].map(([dx, dy, r]) => C(dx, dy, r, '#5FC79A', { sw: 0 })).join('')}${[[-3, -3, 5], [12, 4, 4], [-14, 6, 3.4], [4, 15, 3.4]].map(([dx, dy, r]) => C(dx, dy, r, '#A9EBCB', { sw: 0 })).join('')}${C(-1, 1, 2, '#2E8F6B', { sw: 0 })}</g>`
  const lines = `<path d="M70 32L88 70M120 26L138 66M170 32L188 72" stroke="#B8763A" stroke-width="5" stroke-linecap="round" opacity=".5"/>`
  return svg(260, 146, SH(130, 142, 100, 6) + S(body, '#DDB07A', '#BC8A50', { extra: lines + cluster(82, 60, 1.1) + cluster(160, 48, 0.9) + cluster(196, 92, 1) + cluster(108, 104, 0.7) }) + HL(70, 40, 40, 8, -8, 0.4))
}

function wiltedLettuce() {
  const veins = (d) => L(d, '#7A8A3C', 3.5, 'opacity=".7"')
  return svg(210, 190,
    SH(105, 184, 70, 6) +
    P('M78 176Q100 190 124 176L120 146L82 146Z', '#F2E8CC', { sw: 5 }) +
    S('M84 158C34 156 4 122 8 96C42 96 80 112 100 146Z', '#B9C26B', '#8E9D45', { off: [-5, -7] }) + veins('M84 150C56 138 30 120 18 100') +
    S('M116 158C166 156 200 122 196 96C162 96 124 112 104 146Z', '#B9C26B', '#8E9D45', { off: [-5, -7] }) + veins('M120 150C148 138 174 120 186 100') +
    S('M100 152C68 132 58 92 80 68C94 54 118 56 126 72C138 96 128 132 100 152Z', '#C2CC74', '#98A64C', { off: [-6, -7] }) + veins('M100 148C92 122 92 92 96 70') +
    P('M80 68C66 62 52 72 56 86C66 86 78 80 80 68Z', '#A99B4C', { sw: 4 }) +
    [[36, 112], [172, 114], [104, 82], [120, 106], [60, 120]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#8A6A2E" opacity=".55"/>`).join(''))
}

function yogurtLabeled() {
  return `<div style="position:relative;width:100%;height:100%">${food('yogurt')}<div style="position:absolute;left:14%;right:14%;top:52%;height:22%;background:#fff;border-radius:8px;box-shadow:0 0 0 3.5px #3B2F4F;display:grid;place-items:center;font:900 24px var(--font);color:#3B2F4F;letter-spacing:1px">15.06</div></div>`
}

const basketSvg = () => svg(200, 170,
  L('M42 84C40 6 160 6 158 84', '#B9814A', 13) + L('M42 84C40 6 160 6 158 84', '#E2B078', 5) +
  C(82, 66, 22, '#FF5A5F', { sw: 4.5 }) + C(122, 68, 20, '#FFD93D', { sw: 4.5 }) + C(102, 56, 18, '#6BCB77', { sw: 4.5 }) +
  S('M22 84H178L160 158Q158 166 148 166H52Q42 166 40 158Z', '#E2B078', '#C98F55', { extra: [104, 124, 144].map(y => L(`M20 ${y}H180`, '#B9814A', 4, 'opacity=".5"')).join('') + [60, 100, 140].map(x => L(`M${x} 84L${x - 6} 166`, '#B9814A', 4, 'opacity=".4"')).join('') }) +
  R(14, 72, 172, 22, 10, '#F0C58D') + HL(60, 82, 24, 4, 0, 0.6))

const binSvg = () => svg(200, 190,
  SH(100, 186, 70, 6) +
  S('M40 56H160L148 176Q146 184 136 184H64Q54 184 52 176Z', '#B8C0CC', '#8C95B4', { extra: [82, 100, 118].map(x => L(`M${x} 62V176`, '#7C86A4', 4, 'opacity=".6"')).join('') }) +
  `<g transform="rotate(-16 100 44)">${R(28, 34, 144, 20, 9, '#8C95B4')}${R(88, 18, 26, 18, 6, '#6E7898')}</g>`)

const mamaArt = () => `<span class="emoji" style="font-size:118px">👩‍🍳</span><span class="emoji" style="position:absolute;right:8px;bottom:6px;font-size:58px">❓</span>`
const zoneCard = (color, inner) => `<div style="width:100%;height:100%;border-radius:40px;background:rgba(255,255,255,.9);box-shadow:inset 0 0 0 10px ${color},0 10px 0 rgba(0,0,0,.14);display:grid;place-items:center;position:relative">${inner.startsWith('<svg') ? `<div style="width:74%;height:74%">${inner}</div>` : inner}</div>`

export default defineLevel({
  id: 'fresh-or-bad',
  async run(k) {
    const gsap = k.gsap
    // жесты героя ставим в очередь, чтобы они не накладывались (иначе «уплывает» стойка героя)
    const emoQ = new Map()
    const emo = (c, name) => { const p = (emoQ.get(c) ?? Promise.resolve()).then(() => (k.alive ? c.emote(name) : null)).catch(() => {}); emoQ.set(c, p); return p }
    const tell = (c, id, name) => { if (name) emo(c, name); return k.tell(c, id) }

    k.kitchenBg()
    const pyx = k.pyx({ x: 250 })
    const chukh = k.guest('chukh', 1450, 968, { size: 230, face: 'left' })
    window.__dbg = { pyx, chukh, k }
    gsap.set(chukh.el, { x: 500, opacity: 0 })

    // три зоны: корзинка, ведёрко, мама
    const Z = [
      { id: 'basket', x: 640, color: '#6BCB77', art: basketSvg() },
      { id: 'bin', x: 940, color: '#8C95B4', art: binSvg() },
      { id: 'adult', x: 1240, color: '#B388EB', art: mamaArt() },
    ]
    const zones = Z.map(z => ({ ...z, el: k.prop(zoneCard(z.color, z.art), z.x, 470, 250, 250, { z: 3 }) }))
    const zoneOf = id => zones.find(z => z.id === id)
    const zoneFly = k.prop(`<div class="fly" style="width:100%;height:100%">${flySvg()}</div>`, 1020, 380, 60, 50, { z: 5 })
    k.to(zoneFly, { x: 34, duration: 1.3, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    k.to(zoneFly, { y: 26, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    k.fromTo(zones.map(z => z.el), { y: -120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'back.out(1.6)' })
    await k.wait(600)

    // ─ помощники ─
    // мушки вьются вокруг предмета (они внутри его элемента и едут вместе с ним)
    const animateMarks = el => {
      el.querySelectorAll('.fly').forEach((f, i) => {
        k.to(f, { x: k.rand(10, 26) * (i % 2 ? -1 : 1), duration: k.rand(0.7, 1.2), yoyo: true, repeat: -1, ease: 'sine.inOut' })
        k.to(f, { y: k.rand(8, 20), duration: k.rand(0.5, 0.9), yoyo: true, repeat: -1, ease: 'sine.inOut' })
      })
      el.querySelectorAll('.stink').forEach(s => k.to(s, { y: -8, opacity: 0.55, duration: 0.9, yoyo: true, repeat: -1, ease: 'sine.inOut' }))
    }
    const mk = (html, cx, cy, w, h, o = {}) => {
      const el = k.prop(html, cx, cy, w, h, { z: 20 })
      animateMarks(el)
      return { el, ...o }
    }
    const closeItems = async items => {
      await k.play(gsap.to(items.map(i => i.el), { scale: 0, opacity: 0, duration: 0.35, stagger: 0.05, ease: 'back.in(2)' }))
      items.forEach(i => i.el.remove())
    }
    const into = async (it, z) => {
      const c = k.centerOf(z.el), here = k.centerOf(it.el)
      await k.play(gsap.to(it.el, { x: `+=${c.x - here.x}`, y: `+=${c.y - here.y}`, scale: 0.55, duration: 0.35, ease: 'back.out(1.4)' }))
      gsap.fromTo(z.el, { scale: 1.1 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.4,0.4)' })
      k.sparkle(c.x, c.y, 4)
    }
    const fadeAway = it => gsap.to(it.el, { scale: 0.1, opacity: 0, duration: 0.3, delay: 0.1 })

    const sortRound = (items, prompt) => k.dnd({
      items, zones, prompt: prompt ? k.key(prompt) : null, host: pyx,
      accept: (it, z) => (it.kind === 'fresh' ? z.id === 'basket' : it.kind === 'bad' ? z.id === 'bin' : z.id === 'adult'),
      onCorrect: async (it, z) => {
        if (z.id === 'basket') {
          await into(it, z)
          k.sfx('yum', { vol: 0.6 })
          await tell(pyx, 'fresh_ok', 'happy')
        } else if (z.id === 'bin') {
          await into(it, z)
          k.sfx('clonk')
          await tell(pyx, it.say ?? 'mold_bin', 'laugh')
        } else {
          await into(it, z)
          const c = k.centerOf(z.el)
          const b = k.bubble('👍', c.x + 150, c.y - 130, { w: 150, h: 130, font: 60 })
          k.sfx('magic')
          await tell(pyx, 'adult_ok', 'cheer')
          b.remove()
          // йогурт свежий → в корзинку
          const bc = k.centerOf(zoneOf('basket').el), h = k.centerOf(it.el)
          await k.play(gsap.to(it.el, { x: `+=${bc.x - h.x}`, y: `+=${bc.y - h.y}`, duration: 0.5, ease: 'power2.inOut' }))
          k.sparkle(bc.x, bc.y, 5)
        }
        fadeAway(it)
      },
      onWrong: async (it, z) => {
        if (!z) return
        k.sfx('wrong', { vol: 0.5 })
        if (it.kind === 'ask') return tell(pyx, 'adult_wrong', 'shake')
        if (z.id === 'adult') return tell(pyx, 'no_need', 'nod')
        if (it.kind === 'fresh') return tell(pyx, 'wrong_fresh_bin', 'surprised')
        k.sfx('yuck', { vol: 0.5 })
        return tell(pyx, 'wrong_bad_basket', 'shake')
      },
    })

    // ── 0. знакомство ──
    await tell(pyx, 'hello', 'wave')
    k.sfx('whoosh')
    gsap.to(chukh.el, { x: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' })
    await tell(chukh, 'chukh_hi', 'happy')
    await tell(pyx, 'rule1', 'point')
    await tell(pyx, 'rule2', 'point')

    // ── 1. смотрим глазами ──
    const items1 = [
      mk(wrap(moldyBread(), { stink: true, flies: 2 }), 500, 858, 210, 122, { kind: 'bad', say: 'mold_bin' }),
      mk(wrap(food('strawberry'), { sparkle: true }), 720, 852, 140, 160, { kind: 'fresh' }),
      mk(wrap(wiltedLettuce(), { stink: true, flies: 1 }), 940, 852, 170, 154, { kind: 'bad', say: 'wilt_bin' }),
      mk(wrap(food('apple'), { sparkle: true }), 1160, 850, 160, 170, { kind: 'fresh' }),
    ]
    k.popIn(items1.map(i => i.el), 0.1)
    await k.wait(700)
    // «посмотри поближе» — хлеб с плесенью
    const bread = items1[0]
    await k.tapOnEl(bread.el, { prompt: k.key('q_look'), host: pyx })
    {
      const c = k.centerOf(bread.el)
      bread.el.style.zIndex = '40'
      k.sfx('whoosh', { vol: 0.5 })
      await k.play(gsap.to(bread.el, { x: 800 - c.x, y: 590 - c.y, scale: 2.5, duration: 0.55, ease: 'back.out(1.3)' }))
      await tell(pyx, 'mold', 'surprised')
      await k.play(gsap.to(bread.el, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'power2.inOut' }))
      bread.el.style.zIndex = '20'
    }
    await sortRound(items1, 'q_sort1')
    await k.wait(300)
    await closeItems(items1)

    // ── 2. нюхаем носом: две одинаковые бутылки ──
    await tell(pyx, 'r2_intro', 'think')
    const badIdx = Math.random() < 0.5 ? 0 : 1
    const milk = [0, 1].map(i => mk(wrap(food('milk')), 800 + i * 300, 830, 150, 243, { kind: i === badIdx ? 'bad' : 'fresh', say: 'sour_bin' }))
    k.popIn(milk.map(m => m.el), 0.15)
    await k.wait(600)
    const sniffed = new Set()
    await k.tapAll(milk.map(m => m.el), {
      prompt: k.key('q_sniff'), host: pyx,
      onTap: el => {
        const m = milk.find(x => x.el === el)
        sniffed.add(m)
        k.sfx('swish', { vol: 0.5 })
        k.fx.wiggle(el)
        if (m.kind === 'fresh') {
          k.bubble('😋', 75, -60, { parent: el, w: 150, h: 130, font: 60 })
          k.sparkle(k.centerOf(el).x, k.centerOf(el).y - 90, 4)
          k.sfx('yum', { vol: 0.5 })
          tell(pyx, 'sniff_fresh', 'happy')
        } else {
          const st = document.createElement('div')
          st.innerHTML = stink() + flies(2)
          el.firstElementChild.insertAdjacentHTML('beforeend', stink() + flies(2))
          animateMarks(el)
          k.bubble('🤢', 75, -60, { parent: el, w: 150, h: 130, font: 60 })
          k.sfx('yuck', { vol: 0.5 })
          tell(pyx, 'sniff_bad', 'shake')
        }
      },
    })
    await k.wait(900)
    await sortRound(milk, 'q_sort2')
    await k.wait(300)
    await closeItems(milk)

    // ── 3. спроси взрослого: срок годности ──
    await tell(pyx, 'r3_intro', 'point')
    const yog = mk(yogurtLabeled(), 800, 850, 150, 163, { kind: 'ask' })
    k.popIn(yog.el)
    await k.wait(500)
    await sortRound([yog], 'q_adult')
    await k.wait(300)

    // ── 4. вывод ──
    k.burst(940, 470, 10)
    await tell(pyx, 'sum', 'point')
    await tell(chukh, 'bye', 'cheer')
    k.burst(800, 420, 14)
  },
})
