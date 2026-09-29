// «Что где хранить?»: открытый холодильник (морозилка + холодильник) и корзина на полке. Продукты — по местам (dnd).
// Ошибка = смешное последствие: мороженое тает, молоко киснет, яйцо замерзает, банан мёрзнет.
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'
import { INK, svg, P, L, F, E, C, R, HL, SH, S, rounded } from '../art.js'

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
const FX = 560, FY = 462, FS = 1.1 // холодильник: центр и масштаб (360×640 → 396×704)
const fx = x => FX - 180 * FS + x * FS, fy = y => FY - 320 * FS + y * FS

const iceCreamArt = () =>
  svg(130, 210, SH(65, 204, 44, 5) +
    P('M28 100L102 100L65 202Z', '#F2B45C', { sw: 5 }) +
    L('M40 116L84 160M56 106L96 146M74 104L100 128M36 138L72 106M50 160L92 112', '#D9903A', 4) +
    S('M18 96C10 64 34 50 65 52C96 50 120 64 112 96C100 112 30 112 18 96Z', '#FF9EC4', '#EE6FA0') +
    S('M30 62C24 34 44 20 65 22C86 20 106 34 100 62C90 72 40 72 30 62Z', '#FFF6E8', '#EBD5B8') +
    C(65, 16, 10, '#FF5A5F', { sw: 4 }) + HL(46, 40, 10, 5, -30, 0.7) + HL(40, 80, 10, 5, -30, 0.5))

const eggsHtml = () =>
  `<div style="position:relative;width:180px;height:112px">${[[0, 8, -10], [60, 0, 0], [120, 8, 10]].map(([x, y, r]) => `<div style="position:absolute;left:${x}px;top:${y}px;width:62px;height:100px;transform:rotate(${r}deg)">${food('egg')}</div>`).join('')}</div>`

const basketArt = () =>
  svg(330, 210, SH(165, 202, 140, 7) +
    E(165, 62, 148, 36, '#9C6128') +
    S('M18 70Q26 180 90 196L240 196Q304 180 312 70Z', '#DDA35F', '#B9783A') +
    `<clipPath id="bk"><path d="M18 70Q26 180 90 196L240 196Q304 180 312 70Z"/></clipPath><g clip-path="url(#bk)" stroke="#B9783A" stroke-width="5" fill="none" opacity=".75"><path d="M0 100H330M0 132H330M0 164H330"/><path d="M50 60L20 210M110 60L86 210M170 60V210M230 60L254 210M290 60L316 210"/></g>` +
    E(165, 70, 150, 34, 'none', { sw: 6 }) + E(165, 64, 140, 28, 'none', { sw: 0 }) +
    P('M18 70Q10 28 60 20', 'none', { sw: 8, ink: '#B9783A' }) + P('M312 70Q320 28 270 20', 'none', { sw: 8, ink: '#B9783A' }))

/** Внутренность холодильника поверх исходной картинки: пустые полки под продукты (координаты viewBox 360×640). */
const interiorOverlay = () => {
  const shelf = (y, x0 = 52, x1 = 308) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="11" rx="5" fill="#D9F0FF" stroke="${INK}" stroke-width="4"/>`
  const flakes = [[70, 60], [290, 100], [150, 172], [250, 56]].map(([x, y]) => `<path d="M${x - 9} ${y}H${x + 9}M${x} ${y - 9}V${y + 9}M${x - 6} ${y - 6}L${x + 6} ${y + 6}M${x + 6} ${y - 6}L${x - 6} ${y + 6}" stroke="#A9DDF7" stroke-width="3.5" stroke-linecap="round"/>`).join('')
  return `<path d="M51 92Q51 38 106 37L254 37Q309 38 309 92L309 206L51 206Z" fill="#E2F5FF"/>${flakes}${shelf(212 - 76)}` +
    `<rect x="51" y="236" width="258" height="352" rx="14" fill="#F6FCFF"/>${shelf(350)}${shelf(466)}` +
    `<rect x="60" y="500" width="240" height="80" rx="14" fill="#E4F7EC" stroke="${INK}" stroke-width="4.5"/><rect x="140" y="522" width="80" height="12" rx="6" fill="#B8D8C6" stroke="${INK}" stroke-width="3.5"/>`
}

const fridgeOpenHtml = () => kitchen.fridge({ freezerOpen: true, fridgeOpen: true }).replace(/<\/svg>\s*$/, `${interiorOverlay()}</svg>`)

const bgSvg = () => {
  let dots = ''
  for (let y = 40; y < 560; y += 90) for (let x = (y / 90) % 2 ? 46 : 0; x < 1650; x += 92) dots += `<circle cx="${x}" cy="${y}" r="9" fill="#D3EBDD"/>`
  let floor = ''
  for (let r = 0; r < 2; r++) for (let c = -1; c < 20; c++) floor += `<rect x="${c * 90 + (r ? 45 : 0)}" y="${880 + r * 60}" width="90" height="60" fill="${(c + r) % 2 ? '#FFEACB' : '#FFF6E3'}"/>`
  const brk = x => P(`M${x - 22} 596L${x + 22} 596L${x - 22} 646Z`, '#C98F55', { sw: 5 })
  return svg(1600, 1000,
    `<rect x="-10" y="-10" width="1620" height="1020" fill="#EAF7EF"/>` + dots +
    E(1160, 210, 140, 140, '#BFE7FF') + `<path d="M1160 70V350M1020 210H1300" stroke="${INK}" stroke-width="8"/>` + C(1220, 150, 26, '#FFE066', { sw: 0 }) + E(1160, 210, 140, 140, 'none', { sw: 8 }) +
    `<path d="M1000 60L1030 100V320L1000 360Z" fill="#FFC2E0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M1320 60L1290 100V320L1320 360Z" fill="#FFC2E0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // полка под корзину
    brk(1030) + brk(1310) + R(950, 566, 440, 30, 10, '#E2A468') + F('M960 574H1380', '#F2C48E', 'stroke="#F6D2A4" stroke-width="6" stroke-linecap="round"') +
    `<rect x="-20" y="862" width="1640" height="24" fill="#E5A868"/><path d="M-20 864H1620M-20 886H1620" stroke="${INK}" stroke-width="5"/>` + floor)
}

const trayArt = () =>
  svg(800, 112, `<rect x="6" y="18" width="788" height="88" rx="40" fill="#9E6531" stroke="${INK}" stroke-width="6"/><rect x="18" y="10" width="764" height="82" rx="38" fill="#C98F55" stroke="${INK}" stroke-width="6"/><rect x="40" y="26" width="720" height="50" rx="26" fill="#8A5528"/>`)

const chip = (html, color) => `<div style="width:100%;height:100%;border-radius:50%;box-sizing:border-box;background:#fff;box-shadow:inset 0 0 0 8px ${color},0 8px 0 rgba(0,0,0,.14);display:grid;place-items:center;font-size:40px;line-height:1;letter-spacing:-6px"><span class="emoji" style="font-size:42px">${html}</span></div>`

export const _art = { iceCreamArt, basketArt, bgSvg, fridgeOpenHtml, eggsHtml }

// ───────────────────────── продукты ─────────────────────────
// [id, где хранить, html, ширина, высота, «последствие» при ошибке]
const ITEMS = {
  ice: { home: 'freezer', html: iceCreamArt, w: 100, h: 162, bad: 'melt', color: '#FF9EC4' },
  milk: { home: 'fridge', html: () => food('milk'), w: 92, h: 149, bad: 'sour' },
  cheese: { home: 'fridge', html: () => food('cheese'), w: 150, h: 95, bad: 'sour' },
  bread: { home: 'basket', html: () => food('bread'), w: 170, h: 98, bad: 'warm' },
  potato: { home: 'basket', html: () => food('potato'), w: 124, h: 94, bad: 'warm' },
  pop: { home: 'freezer', html: () => kitchen.popsicle('frozen', '#FF5A5F'), w: 84, h: 156, bad: 'melt', color: '#FF7A7F' },
  eggs: { home: 'fridge', html: eggsHtml, w: 180, h: 112, bad: 'sour' },
  yogurt: { home: 'fridge', html: () => food('yogurt'), w: 100, h: 108, bad: 'sour' },
  banana: { home: 'basket', html: () => food('banana'), w: 170, h: 103, bad: 'warm', dark: true },
  onion: { home: 'basket', html: () => food('onion'), w: 100, h: 112, bad: 'warm' },
}
const ROUNDS = [['ice', 'milk', 'cheese', 'bread', 'potato'], ['pop', 'eggs', 'yogurt', 'banana', 'onion']]
const ZONES = {
  freezer: { x: fx(180), y: fy(123), w: 300, h: 206 },
  fridge: { x: fx(180), y: fy(412), w: 300, h: 380 },
  basket: { x: 1170, y: 470, w: 320, h: 210 },
}
const SLOTS = {
  freezer: [[500, 202], [620, 202], [560, 202]],
  fridge: [[478, 438], [628, 438], [478, 566], [628, 566], [560, 590]],
  basket: [[1092, 490], [1170, 486], [1240, 490], [1205, 452], [1130, 452]],
}
const TRAY_X = [640, 800, 960, 1120, 1280], TRAY_Y = 900

export default defineLevel({
  id: 'fridge-shelf',
  async run(k) {
    k.bg(bgSvg())
    const pyx = k.pyx({ x: 150, y: 962, size: 320 })
    const hamster = k.guest('shchyok', 1440, 966, { size: 280, face: 'left' })
    guardEmotes(k, pyx, hamster)

    // холодильник (сначала закрыт), корзина
    const fridge = k.prop(kitchen.fridge({}), FX, FY, 360 * FS, 640 * FS, { z: 6 })
    const basket = k.prop(basketArt(), 1170, 488, 330, 210, { z: 5 })
    k.prop(trayArt(), 960, 906, 800, 112, { z: 3 })
    const fridgeTap = k.prop('', FX, FY, 360, 600, { z: 40 })
    k.gsap.set([fridge, basket], { opacity: 0, y: 60 })

    await k.wait(300)
    k.to([fridge, basket], { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' })
    await k.tell(pyx, 'hello', 'wave')

    // открываем холодильник
    await k.tapOnEl(fridgeTap, { prompt: k.key('q_open'), host: pyx })
    fridgeTap.remove()
    k.sfx('whoosh')
    fridge.innerHTML = fridgeOpenHtml()
    k.fromTo(fridge, { scale: 0.96 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' })
    for (let i = 0; i < 8; i++) {
      const p = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:rgba(255,255,255,.85)"></div>', fx(120 + i * 16), fy(260), 46, 46, { z: 30 })
      k.fromTo(p, { scale: 0.3, opacity: 0.9 }, { scale: 2.2, opacity: 0, y: k.rand(40, 120), x: k.rand(-40, 20), duration: 1.4, delay: i * 0.08, ease: 'power1.out', onComplete: () => p.remove() })
    }
    // значки «холодно / очень холодно / тепло»
    const chips = [
      k.prop(chip('❄️❄️', '#7CC4F2'), 790, 240, 96, 96, { z: 30 }),
      k.prop(chip('❄️', '#B8E4FA'), 790, 560, 96, 96, { z: 30 }),
      k.prop(chip('☀️', '#FFC94D'), 1170, 330, 96, 96, { z: 30 }),
    ]
    k.popIn(chips, 0.15)
    await k.wait(700)
    await k.tell(pyx, 'cold', 'point')
    await k.tell(pyx, 'zones', 'point')

    // зоны сброса (невидимые)
    const zoneEls = {}
    for (const [id, z] of Object.entries(ZONES)) zoneEls[id] = k.prop('', z.x, z.y, z.w, z.h, { z: 8 })
    const used = { freezer: 0, fridge: 0, basket: 0 }
    const said = new Set()

    // ── последствия ──
    const reaction = async (it, zoneId) => {
      const def = ITEMS[it.id]
      const slot = SLOTS[zoneId][Math.min(used[zoneId], SLOTS[zoneId].length - 1)]
      const clone = k.prop(def.html(), slot[0], slot[1], def.w, def.h, { z: 31 })
      k.gsap.set(clone, { scale: Math.min(1.2, 140 / Math.max(def.w, def.h)) })
      k.gsap.set(it.el, { opacity: 0 })
      k.fromTo(clone, { opacity: 0 }, { opacity: 1, duration: 0.15 })
      const pyxLine = { melt: ['melt_a', 'melt_b'], sour: ['sour_a', 'sour_b'], frost: ['frost_a', 'frost_b'], warm: ['warm_a', 'warm_b'] }
      let kind = def.bad
      if (def.home === 'fridge' && zoneId === 'freezer') kind = 'frost'
      if (def.home === 'basket' && zoneId !== 'basket') kind = 'warm'
      if (def.home === 'freezer') kind = 'melt'
      const lines = pyxLine[kind]
      const lineId = lines[Math.random() < 0.5 ? 0 : 1]
      const say = lineId === 'sour_b' ? k.tell(hamster, lineId, 'sad') : k.tell(pyx, lineId, kind === 'melt' ? 'surprised' : kind === 'sour' ? 'shake' : 'think')
      const c = { x: slot[0], y: slot[1] }
      if (kind === 'melt') {
        k.sfx('yuck', { vol: 0.4 })
        k.to(clone, { scaleY: 0.5, scaleX: 1.2, y: def.h * 0.16, transformOrigin: '50% 100%', duration: 1.4, ease: 'sine.in' })
        const pd = k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:${def.color};box-shadow:0 0 0 4px #3B2F4F"></div>`, c.x, c.y + def.h * 0.42, 40, 14, { z: 30 })
        k.to(pd, { scaleX: 4.5, scaleY: 1.4, duration: 1.4, ease: 'sine.out' })
        for (let i = 0; i < 9; i++) k.after(i * 140, () => {
          const d = k.prop(`<div style="width:100%;height:100%;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:${def.color}"></div>`, c.x + k.rand(-30, 30), c.y - 10, 14, 19, { z: 32 })
          k.to(d, { y: def.h * 0.42, opacity: 0, duration: 0.6, ease: 'power1.in', onComplete: () => d.remove() })
        })
        k.after(2100, () => pd.remove())
      } else if (kind === 'sour') {
        k.sfx('yuck', { vol: 0.5 })
        k.to(clone, { filter: 'hue-rotate(75deg) saturate(1.3) brightness(.85)', duration: 0.7 })
        for (let i = 0; i < 6; i++) {
          const p = k.prop('<div style="width:100%;height:100%;border-radius:50%;background:#A8D86A;opacity:.7"></div>', c.x + k.rand(-40, 40), c.y - 20, 34, 34, { z: 32 })
          k.fromTo(p, { scale: 0.3, opacity: 0.9 }, { scale: 1.6, opacity: 0, y: -k.rand(70, 130), x: k.rand(-30, 30), duration: 1.2, delay: i * 0.2, ease: 'sine.out', onComplete: () => p.remove() })
        }
        const fl = [0, 1].map(i => k.prop(`<div style="width:100%;height:100%;border-radius:50%;background:${INK}"></div>`, c.x, c.y - def.h / 2 - 10, 10, 10, { z: 33 }))
        fl.forEach((f, i) => { k.to(f, { x: i ? 60 : -60, y: i ? -30 : -50, duration: 0.45, yoyo: true, repeat: 5, ease: 'sine.inOut' }); k.after(2700, () => f.remove()) })
      } else if (kind === 'frost') {
        k.sfx('boing', { vol: 0.5 })
        k.to(clone, { filter: 'hue-rotate(150deg) brightness(1.2) saturate(.8)', duration: 0.5 })
        k.to(clone, { x: 6, duration: 0.06, yoyo: true, repeat: 15 })
        k.sparkle(c.x, c.y, 6)
        for (let i = 0; i < 5; i++) {
          const s = k.prop('<span class="emoji" style="font-size:34px">❄️</span>', c.x + k.rand(-60, 60), c.y - 30, 40, 40, { z: 33 })
          k.fromTo(s, { scale: 0 }, { scale: 1, y: k.rand(20, 60), rotation: 180, opacity: 0, duration: 1.3, delay: i * 0.15, ease: 'sine.out', onComplete: () => s.remove() })
        }
      } else {
        k.to(clone, { filter: def.dark ? 'brightness(.5) sepia(.9) saturate(1.5)' : 'hue-rotate(150deg) brightness(1.1) saturate(.6)', duration: 0.7 })
        k.to(clone, { x: 7, duration: 0.07, yoyo: true, repeat: 17 })
        for (let i = 0; i < 4; i++) {
          const s = k.prop('<span class="emoji" style="font-size:34px">❄️</span>', c.x + k.rand(-50, 50), c.y - 50, 40, 40, { z: 33 })
          k.fromTo(s, { scale: 0 }, { scale: 1, y: k.rand(40, 90), rotation: 120, opacity: 0, duration: 1.4, delay: i * 0.2, ease: 'sine.out', onComplete: () => s.remove() })
        }
      }
      await Promise.all([say, k.wait(2200)])
      k.to(clone, { opacity: 0, duration: 0.3, onComplete: () => clone.remove() })
      k.to(it.el, { opacity: 1, duration: 0.3 })
    }

    // ── раунды ──
    const runRound = async (ids, first) => {
      const order = k.shuffle(ids)
      const items = order.map((id, i) => {
        const def = ITEMS[id]
        const W = Math.max(def.w + 40, 150), H = Math.max(def.h + 40, 150)
        const el = k.prop(`<div style="position:absolute;left:${(W - def.w) / 2}px;top:${(H - def.h) / 2}px;width:${def.w}px;height:${def.h}px">${def.html()}</div>`, TRAY_X[i], TRAY_Y - H * 0.18, W, H, { z: 20 })
        el.dataset.item = id
        return { id, el, home: def.home }
      })
      // подсказка: первым в списке подсказок должен идти тот, кто просто «верно» — оставляем порядок карточек
      k.gsap.set(items.map(i => i.el), { opacity: 0 })
      k.fromTo(items.map(i => i.el), { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.1, ease: 'back.out(1.6)' })
      k.sfx('whoosh')
      await k.wait(800)
      await k.dnd({
        items, pad: 30,
        zones: Object.entries(zoneEls).map(([id, el]) => ({ id, el })),
        accept: (it, z) => it.home === z.id,
        prompt: first ? k.key('q_drag') : null, host: pyx,
        onCorrect: async (it, z) => {
          const def = ITEMS[it.id]
          const slot = SLOTS[z.id][used[z.id]++ % SLOTS[z.id].length]
          const c = k.centerOf(it.el)
          const sc = Math.min(1, (z.id === 'freezer' ? 100 : 108) / Math.max(def.w, def.h))
          k.to(it.el, { x: `+=${slot[0] - c.x}`, y: `+=${slot[1] - c.y}`, scale: sc, duration: 0.35, ease: 'back.out(1.3)' })
          k.sparkle(slot[0], slot[1], 4)
          await k.wait(380)
          if (!said.has(z.id)) { said.add(z.id); await k.tell(pyx, `ok_${z.id}`, 'nod') }
        },
        onWrong: async (it, z) => {
          if (!z) return
          await reaction(it, z.id)
        },
      })
    }
    await runRound(ROUNDS[0], true)
    k.burst(560, 420, 8)
    await k.tell(pyx, 'r1_done', 'cheer')
    await runRound(ROUNDS[1], false)
    k.burst(1170, 400, 8)
    await k.tell(pyx, 'r2_done', 'cheer')
    // закрываем холодильник — всё на местах
    await k.narrate('why')
    await k.tell(pyx, 'bye', 'happy')
    k.burst(800, 420, 14)
  },
})
