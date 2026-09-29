// Ядро «Школы поваров»: defineLevel + контекст уровня k.
//
// Уровень пишется так (см. levels/cut-cucumber.js как образец):
//
//   import { defineLevel } from '../lib.js'
//   export default defineLevel({
//     id: 'why-salt',
//     async run(k) {
//       k.kitchenBg()                       // фон кухни
//       const pyx = k.pyx()                 // Пых в колпаке слева
//       await k.tell(pyx, 'hello', 'wave')  // реплика  e.kx-why-salt.hello  (текст — в lines/why-salt.js)
//       ...
//     },
//   })
//
// k наследует весь контекст эпизода (k.cast, k.prop, k.line, k.choice, k.tapOn, k.dragTo, k.play,
// k.camera, k.wait, k.after, k.every, k.to/from/fromTo/timeline …) и добавляет кухонные помощники.
import * as D from './deps.js'
import { levels } from './registry.js'
import { sfx2 } from './sfx.js'
import { food, foodEl, SIZE } from './food.js'
import * as G from './gesture.js'
import { installStyle } from './ui.js'
import * as UI from './ui.js'
import { cutLinear, cutRound } from './cut.js'
import { stove, bgTable } from './kit.js'

const { gsap, audio, progress, fx, makeChar, getStage, kitchen, shuffle, pick, setAccessory, hasLine } = D
export { food, foodEl, SIZE, sfx2, G, UI }

const CHEF = { x: 330, size: 380 }

function buildKit(x, def, meta) {
  const k = Object.create(x)
  const ns = `e.kx-${def.id}`
  k.id = def.id
  k.meta = meta
  k.ns = ns
  k.host = null
  k.key = id => (/^[a-z]\.[\w-]+\./.test(id) ? id : `${ns}.${id}`)
  installStyle()

  // ── тестовый крючок: что сейчас ждёт малыш ──
  let pending = null
  k.waiting = (kind, solve) => {
    const rec = { kind, solve }
    pending = rec
    return () => { if (pending === rec) pending = null }
  }
  k.pendingKind = () => pending?.kind ?? null
  k.solve = () => { const p = pending; if (!p) return false; try { return !!p.solve() } catch (e) { console.error('[kx solve]', e); return false } }
  k.finished = false

  // ── фон и герои ──
  k.kitchenBg = () => {
    const bg = k.bg(kitchen.background())
    kitchen.animateBg(bg, k.track)
    return bg
  }
  k.layout = kitchen.layout // {counterY:720, floorY:960, ...}
  /** Пых в поварском колпаке. По умолчанию слева на столешнице. */
  k.pyx = (o = {}) => {
    const c = k.cast('pyx', o.x ?? CHEF.x, o.y ?? kitchen.layout.counterY, { size: o.size ?? CHEF.size, z: o.z ?? 10, face: o.face })
    setAccessory(c, o.hat === false ? 'none' : 'chef')
    if (!k.host) k.host = c
    return c
  }
  /** Любой герой: k.guest('busya', 1300, 960, {size:260, face:'left'}) */
  k.guest = (id, cx, cy, o = {}) => k.cast(id, cx, cy, { size: o.size ?? 260, z: o.z ?? 11, face: o.face })
  /** Спрайт из еды/посуды по имени; cx,cy — центр; w — ширина (высота по пропорции). */
  k.food = (name, cx, cy, w, o = {}) => {
    const [fw, fh] = SIZE[name]
    const h = Math.round((w * fh) / fw)
    const el = k.prop(food(name, ...(o.args ?? [])), cx, cy, w, h, { z: o.z ?? 6, cls: `kx-food ${o.cls ?? ''}` })
    el.dataset.food = name
    return el
  }

  // ── речь ──
  /** Реплика героя (char) по короткому id этого уровня; emote — жест ('wave','cheer',…). */
  const chk = key => { if (!hasLine(key)) console.error(`[kx:${def.id}] нет реплики ${key}`); return key }
  k.tell = (char, id, emote) => k.line(char, chk(k.key(id)), emote)
  /** Реплика «за кадром» (сказочница). */
  k.narrate = id => k.line(null, chk(k.key(id)))
  /** Несколько реплик подряд одному герою. */
  k.tellAll = async (char, ids) => { for (const id of ids) await k.tell(char, id) }
  /** Существует ли реплика (для необязательных). */
  k.has = id => hasLine(k.key(id))
  /** Счёт вслух «Раз! Два!» из общих реплик t.numbers.n_1…n_10. */
  k.sayNumber = async (n, char = null) => { const key = `t.numbers.n_${n}`; if (hasLine(key)) await k.say(key, char) }
  /** Похвала (общие реплики c.<герой>.praiseN). */
  k.praise = async (char = k.host, at) => {
    audio.sfx('correct')
    const p = at ?? (char ? G.centerOf(char.el) : { x: 800, y: 500 })
    fx.starBurst(p.x, p.y, 10, { sound: false })
    const who = char?.id ?? 'pyx'
    const keys = []
    for (let i = 1; i <= 8; i++) if (hasLine(`c.${who}.praise${i}`)) keys.push(`c.${who}.praise${i}`)
    if (char) char.emote(Math.random() < 0.5 ? 'happy' : 'jump')
    if (keys.length) await k.say(pick(keys), char)
    else await k.wait(500)
  }
  /** Ободрение при ошибке. */
  k.oops = async (char = k.host) => {
    audio.sfx('wrong', { vol: 0.6 })
    const who = char?.id ?? 'pyx'
    const keys = []
    for (let i = 1; i <= 6; i++) if (hasLine(`c.${who}.retry${i}`)) keys.push(`c.${who}.retry${i}`)
    if (char) char.emote(Math.random() < 0.5 ? 'think' : 'shake')
    if (keys.length) await k.say(pick(keys), char)
    else await k.wait(400)
  }

  // ── выбор карточкой (обёртка над k.choice эпизода) ──
  k.choose = async o => {
    const end = k.waiting('choice', () => {
      const card = [...k.root.querySelectorAll('.ep-card:not(.used)')]
      const opts = o.options
      const good = opts.find(op => op.correct && !op.el) ?? opts.find(op => !op.el)
      const c = good && card.find(c => c.dataset.id === good.id)
      const el = !c && opts.find(op => op.correct && op.el)?.el
      const t = c ?? el
      if (!t) return false
      t.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }))
      return true
    })
    try { return await k.choice(o) } finally { end() }
  }
  /** Нажать на элемент и ждать (обёртка над tapOn с тест-крючком). */
  k.tapOnEl = async (el, o) => {
    const end = k.waiting('tap', () => { el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 })); return true })
    try { await k.tapOn(el, o) } finally { end() }
  }

  // ── жесты ──
  k.tapN = (el, n, o) => G.tapN(k, el, n, o)
  k.tapAll = (els, o) => G.tapAll(k, els, o)
  k.scrub = (el, o) => G.scrub(k, el, o)
  k.stir = (center, o) => G.stir(k, center, o)
  k.shake = (el, o) => G.shake(k, el, o)
  k.hold = (el, o) => G.hold(k, el, o)
  k.dnd = o => G.dnd(k, o)
  k.sequence = o => G.sequence(k, o)
  k.cutLinear = o => cutLinear(k, o)
  k.cutRound = o => cutRound(k, o)

  // ── плита и декорации ──
  k.stove = () => stove(k)
  k.bgTable = o => k.bg(bgTable(o))

  // ── интерфейс ──
  k.stepsBar = (icons, o) => UI.stepsBar(k, icons, o)
  k.badge = (text, cx, cy, o) => UI.badge(k, text, cx, cy, o)
  k.meter = o => UI.meter(k, o)
  k.bubble = (html, cx, cy, o) => UI.bubble(k, html, cx, cy, o)
  k.adultHelp = o => UI.adultHelp(k, o)
  k.popIn = (els, stagger = 0.08) => fx.popIn(els, stagger)
  k.burst = (cx, cy, n = 10, o) => fx.starBurst(cx, cy, n, o)
  k.sparkle = (cx, cy, n = 5) => fx.sparkle(cx, cy, n)
  k.fx = fx
  k.gsap = gsap
  k.audio = audio
  k.sfx = (name, o) => (sfx2[name] ? sfx2[name](o?.vol ?? 1) : audio.sfx(name, o))
  k.rand = (a, b) => a + Math.random() * (b - a)
  k.pick = pick
  k.shuffle = shuffle
  k.centerOf = G.centerOf
  k.rectOf = G.rectOf
  k.tw = (el, vars) => k.play(gsap.to(el, vars)) // to + ждать конца
  return k
}

/** Определить уровень. def = { id, music?, backdrop?, async run(k) }. */
export function defineLevel(def) {
  const meta = levels[def.id]
  if (!meta) throw new Error(`[kx] уровень «${def.id}» не описан в registry.js`)
  return D.makeEpisode({
    id: def.id,
    kind: 'science',
    region: 'kitchen',
    music: def.music ?? 'gentle',
    backdrop: def.backdrop ?? '#FFDCBC',
    sticker: meta.sticker.id,
    next: `/land/${meta.chapter}`,
    async run(x) {
      const k = buildKit(x, def, meta)
      const api = { id: def.id, state: () => ({ pending: k.pendingKind(), finished: k.finished }), solve: () => k.solve(), get finished() { return k.finished } }
      window.__kx = api
      k.onExit(() => { if (window.__kx === api) delete window.__kx })
      await def.run(k)
      k.finished = true
    },
  })
}
