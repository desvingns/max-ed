// UI kit for the chess lessons: the lesson screen (Цок on the left, work area on the right),
// answer cards, board tasks (tap / tap all / move / place pieces) and scripted piece demos.
import { t as gsap } from './gsap-CvDoa17S.js'
import { t as audio } from './audio-BEkH9VRF.js'
import { o as fx } from './index-rPMhTJWI.js'
import { o as stopVoice } from './voice-DxZWGDNJ.js'
import { t as draggable } from './input-BwoVuMYO.js'
import { createBoard, boardThumb } from './chess-boardui.js'
import { pieceSvg, PIECE } from './chess-pieces.js'
import * as E from './chess-engine.js'
import { VOICE_MODULES } from './chess-voice.js'

const INK = '#3B2F4F'
const NS = 'g.chess.'
const cap = s => s[0].toUpperCase() + s.slice(1)
const GAME_LINES = VOICE_MODULES.find(m => m.ns === 'g.chess')?.lines ?? {}
/** the written text of a voice line (used as the on-screen question) */
const lineText = key => GAME_LINES[key]?.text ?? ''

const CSS = `
.lk-bg{position:absolute;inset:0;background:linear-gradient(#DCD2FF 0%,#F1EAFF 55%,#E6DBFF 100%)}
.lk-floor{position:absolute;left:0;right:0;bottom:0;height:300px;opacity:.5;background:conic-gradient(#C9B6F5 25%,#FFF7E0 0 50%,#C9B6F5 0 75%,#FFF7E0 0) 0 0/120px 120px;-webkit-mask-image:linear-gradient(transparent,#000 70%);mask-image:linear-gradient(transparent,#000 70%)}
.lk-title{position:absolute;left:40px;top:150px;width:560px;padding:22px 30px;border-radius:36px;background:#fff;box-shadow:0 10px 0 rgba(59,47,79,.18);font:900 42px/1.18 var(--font);color:${INK};transition:opacity .25s}
.lk-title.wide{width:740px}
.lk-dots{position:absolute;left:50%;top:40px;display:flex;gap:12px;transform:translateX(-50%)}
.lk-dot{width:28px;height:28px;border-radius:50%;background:#E3D9F5;box-shadow:inset 0 0 0 4px #fff}
.lk-dot.done{background:#8AC926}.lk-dot.cur{background:#FFC93C}
.lk-card{position:absolute;border-radius:40px;background:#fff;box-shadow:0 10px 0 rgba(59,47,79,.2),inset 0 0 0 7px #E1D4FA;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;touch-action:manipulation;text-align:center;font-family:var(--font);color:${INK};overflow:hidden}
.lk-card.used{opacity:.38;filter:grayscale(.6);pointer-events:none}
.lk-card.right{box-shadow:0 10px 0 rgba(59,47,79,.2),inset 0 0 0 10px #8AC926}
.lk-card.glow{animation:lk-glow .7s ease-in-out infinite alternate}
@keyframes lk-glow{from{box-shadow:0 10px 0 rgba(59,47,79,.2),inset 0 0 0 7px #E1D4FA,0 0 0 0 rgba(255,201,60,.0)}to{box-shadow:0 10px 0 rgba(59,47,79,.2),inset 0 0 0 9px #FFC93C,0 0 34px 8px rgba(255,201,60,.8)}}
.lk-card .pc{flex:none}.lk-card .pc svg{width:100%;height:100%;display:block}
.lk-card .nm{font:900 30px/1 var(--font);margin-top:2px}
.lk-card .tx{font-family:var(--font);font-weight:900;line-height:1}
.lk-stim{position:absolute;display:grid;place-items:center}
.lk-stim svg{width:100%;height:100%}
.lk-tray{position:absolute}
.lk-tp{position:absolute;width:118px;height:118px;border-radius:30px;background:#fff;box-shadow:0 8px 0 rgba(59,47,79,.2),inset 0 0 0 6px #E1D4FA;touch-action:none;cursor:grab}
.lk-tp svg{width:100%;height:100%}
.lk-tp.sel{box-shadow:0 8px 0 rgba(59,47,79,.2),inset 0 0 0 8px #FFC93C}
.lk-skip{position:absolute}
.lk-promo{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:930px;height:300px;border-radius:44px;background:#fff;box-shadow:0 14px 0 rgba(59,47,79,.22),inset 0 0 0 8px #EFE4FF;z-index:60}
.lk-promo h3{margin:20px 0 0;text-align:center;font:900 38px/1 var(--font);color:${INK}}
`

function ensureCss() {
  if (document.getElementById('lk-css')) return
  const st = document.createElement('style')
  st.id = 'lk-css'
  st.textContent = CSS
  document.head.appendChild(st)
}

const posFromArr = (arr, turn = 'w') => {
  const map = {}
  arr.forEach((c, i) => c && (map[i] = c))
  return E.positionFromIndex(map, turn)
}
const arrFromMap = map => {
  const a = new Array(64).fill(0)
  for (const [k, v] of Object.entries(map ?? {})) a[Number(k)] = v
  return a
}
const arrFromNames = map => {
  const a = new Array(64).fill(0)
  for (const [k, v] of Object.entries(map ?? {})) a[E.sqIndex(k)] = v
  return a
}
const mvKey = (from, to) => E.sqName(from) + E.sqName(to)

const LINE_ICON = {
  vertical: `<svg viewBox="0 0 100 100"><path d="M50 12 V88 M50 12 L34 34 M50 12 L66 34 M50 88 L34 66 M50 88 L66 66" stroke="#7A5CC7" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  horizontal: `<svg viewBox="0 0 100 100"><path d="M12 50 H88 M12 50 L34 34 M12 50 L34 66 M88 50 L66 34 M88 50 L66 66" stroke="#4D96FF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  diagonal: `<svg viewBox="0 0 100 100"><path d="M18 82 L82 18 M82 18 H58 M82 18 V42 M18 82 H42 M18 82 V58" stroke="#FF8FC8" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
}

function cardInner(card, w, h) {
  if (card.piece) {
    const side = Math.min(w - 30, h - (card.name || card.label ? 70 : 30))
    const label = card.name ? cap(PIECE[card.piece.toLowerCase()].ru) : card.label
    return `<div class="pc" style="width:${side}px;height:${side}px">${pieceSvg(card.piece, { face: !!card.face })}</div>${label ? `<div class="nm" style="font-size:${Math.min(32, Math.round(w / 6.2))}px">${label}</div>` : ''}`
  }
  if (card.thumb) return boardThumb({ ...card.thumb, size: Math.min(w, h) - 26 })
  if (card.text != null) {
    const len = String(card.text).length
    const fs = Math.min(h * 0.55, (w - 36) / Math.max(1.4, len * 0.62))
    return `<div class="tx" style="font-size:${Math.round(fs)}px">${card.text}</div>`
  }
  if (card.icon) return `<div style="font:400 ${Math.round(h * 0.4)}px/1 var(--emoji)">${card.icon}</div><div class="nm" style="margin-top:8px">${card.label ?? ''}</div>`
  if (card.swatch) return `<div style="width:${Math.round(h * 0.42)}px;height:${Math.round(h * 0.42)}px;border-radius:50%;background:${card.swatch};box-shadow:inset 0 0 0 6px ${INK};"></div><div class="nm" style="margin-top:14px">${card.label ?? ''}</div>`
  if (card.lineIcon) return `<div style="width:${Math.round(h * 0.5)}px;height:${Math.round(h * 0.5)}px">${LINE_ICON[card.lineIcon]}</div><div class="nm" style="margin-top:8px;font-size:${Math.min(30, Math.round(w / 8))}px">${card.label ?? ''}</div>`
  return ''
}

/**
 * createKit(s, host) — s: the game context (from chess-learn), host: the Цок character.
 */
export function createKit(s, host) {
  ensureCss()
  const root = s.root
  const el = (cls, html = '', css = '') => {
    const d = document.createElement('div')
    d.className = cls
    d.innerHTML = html
    if (css) d.style.cssText = css
    return d
  }

  // ---------------------------------------------------------------- static scene
  const bg = el('lk-bg')
  const floor = el('lk-floor')
  root.append(bg, floor)
  const titleEl = el('lk-title')
  root.appendChild(titleEl)
  const dotsEl = el('lk-dots')
  root.appendChild(dotsEl)
  let taskLayer = null
  let speechToken = 0
  let idleStop = null

  const kit = {
    root,
    host,

    setTitle(text, wide = false) {
      titleEl.textContent = text ?? ''
      titleEl.style.opacity = text ? '1' : '0'
      titleEl.classList.toggle('wide', wide)
    },
    progress(total, at) {
      dotsEl.innerHTML = ''
      for (let i = 0; i < total; i++) dotsEl.appendChild(el('lk-dot' + (i < at ? ' done' : i === at ? ' cur' : '')))
    },

    // ---------------------------------------------------------------- speech
    /** speak lines one after another; a tap on an answer cancels the rest */
    async say(keys) {
      const my = ++speechToken
      for (const k of [].concat(keys ?? [])) {
        if (my !== speechToken || !s.alive) return
        await s.say(NS + k, host)
      }
    },
    cancelSpeech() {
      speechToken++
      stopVoice()
    },

    // ---------------------------------------------------------------- task container
    newLayer() {
      kit.endTask()
      taskLayer = el('lk-task', '', 'position:absolute;inset:0')
      root.appendChild(taskLayer)
      return taskLayer
    },
    endTask() {
      idleStop?.()
      idleStop = null
      if (taskLayer) {
        gsap.killTweensOf(taskLayer.querySelectorAll('*'))
        taskLayer.remove()
        taskLayer = null
      }
      s.setRepeat(null)
    },

    celebrate(rightKeys, at = null) {
      audio.sfx('correct')
      const p = at ?? { x: 1070, y: 500 }
      fx.starBurst(p.x, p.y, 10, { sound: false })
      host.emote(Math.random() < 0.5 ? 'jump' : 'happy')
      return rightKeys?.length ? kit.say(rightKeys) : s.praise(host)
    },
    sorry(lines) {
      audio.sfx('wrong')
      host.emote(Math.random() < 0.5 ? 'think' : 'shake')
      return lines?.length ? kit.say(lines) : s.tryAgain(host)
    },

    // ================================================================ tasks
    async runTask(task) {
      kit.newLayer()
      kit.setTitle(task.title || lineText(task.say?.[0]), task.kind === 'pick' && task.layout === 'board')
      const repeat = () => void kit.say(task.say)
      s.setRepeat(repeat)
      idleStop = s.idle(22000, repeat)
      let result
      if (task.kind === 'pick') result = await runPick(task)
      else result = await runBoard(task)
      kit.endTask()
      return result
    },

    // ================================================================ demos
    async runDemo(steps, o = {}) {
      kit.newLayer()
      kit.setTitle(o.title ?? '')
      const S = 94
      const board = createBoard(s, { x: 1070, y: 505, size: S, labels: o.labels ?? 'edge', interactive: false, parent: taskLayer })
      const skip = { v: false }
      const btn = document.createElement('div')
      btn.className = 'lk-skip'
      taskLayer.appendChild(btn)
      btn.style.cssText = 'left:1490px;top:760px;width:100px;height:100px;border-radius:50%;background:#8E6BD6;box-shadow:0 8px 0 rgba(59,47,79,.25),inset 0 0 0 6px #fff;display:grid;place-items:center;cursor:pointer;color:#fff;font:900 46px var(--font)'
      btn.innerHTML = '<svg viewBox="0 0 100 100" width="58" height="58"><path d="M30 22 L62 50 L30 78 M72 22 V78" stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      s.tap(btn, () => {
        skip.v = true
        kit.cancelSpeech()
      })
      s.setRepeat(null)
      const arr = o.start ? arrFromNames(o.start) : new Array(64).fill(0)
      board.setPieces(arr)
      const wait = ms => (skip.v ? Promise.resolve() : s.wait(ms))
      const startArr = () => {
        const a = new Array(64).fill(0)
        E.startPosition().b.forEach((c, i) => c && (a[i] = c))
        return a
      }
      const resolveMarks = m => {
        const all = Array.from({ length: 64 }, (_, i) => i)
        if (Array.isArray(m)) return m.map(x => (typeof x === 'string' ? E.sqIndex(x) : x))
        if (m === 'all') return all
        if (m === 'light') return all.filter(E.isLight)
        if (m === 'dark') return all.filter(x => !E.isLight(x))
        if (m === 'files') return [0, 1, 2, 3, 4, 5, 6, 7].map(f => Array.from({ length: 8 }, (_, r) => E.sqOf(f, r)))
        if (m === 'ranks') return [0, 1, 2, 3, 4, 5, 6, 7].map(r => Array.from({ length: 8 }, (_, f) => E.sqOf(f, r)))
        if (m.startsWith('sameColor:')) {
          const light = E.isLight(E.sqIndex(m.slice(10)))
          return all.filter(x => E.isLight(x) === light)
        }
        return [E.sqIndex(m)]
      }
      const dotsFor = (from, only) => {
        const p = posFromArr(board.snapshot())
        let list = E.reachable(p, from)
        if (only) {
          list = list.filter(t => {
            const dx = (t & 7) - (from & 7)
            const dy = (t >> 3) - (from >> 3)
            return only === 'straight' ? dx === 0 || dy === 0 : Math.abs(dx) === Math.abs(dy)
          })
        }
        return list
      }
      for (const st of steps) {
        if (skip.v || !s.alive) break
        if (st.clear) {
          board.clearMarks()
        }
        if (st.pieces !== undefined) {
          board.setPieces(st.pieces === 'start' ? startArr() : arrFromNames(st.pieces), { pop: true })
          board.clearMarks()
        }
        if (st.add) for (const [k, v] of Object.entries(st.add)) board.put(E.sqIndex(k), v, { pop: true })
        const tasks = []
        if (st.marks) {
          const kind = st.kind ?? 'focus'
          const groups = resolveMarks(st.marks)
          if (Array.isArray(groups[0])) {
            // files / ranks: light them one at a time
            tasks.push(
              (async () => {
                for (const g of groups) {
                  board.unmark(kind)
                  board.markMany(g, kind, { color: 'rgba(98,198,255,.65)' })
                  audio.note(72 + groups.indexOf(g) * 2, 'xylo', { vol: 0.25, dur: 0.3 })
                  await wait(430)
                }
                board.unmark(kind)
              })(),
            )
          } else if (st.stagger) {
            tasks.push(
              (async () => {
                for (const q of groups) {
                  if (skip.v) return
                  board.mark(q, kind, { color: E.isLight(q) ? 'rgba(179,136,235,.5)' : 'rgba(255,196,90,.55)' })
                  await wait(st.marks === 'all' ? 18 : 90)
                }
              })(),
            )
          } else board.markMany(groups, kind, kind === 'line' ? { color: 'rgba(179,136,235,.55)' } : undefined)
          if (st.crosshair) {
            const t = groups[0]
            for (let i = 0; i < 8; i++) {
              board.mark(E.sqOf(t & 7, i), 'line', { color: 'rgba(98,198,255,.4)' })
              board.mark(E.sqOf(i, t >> 3), 'line', { color: 'rgba(98,198,255,.4)' })
            }
            board.mark(t, 'focus')
          }
        }
        if (st.dots) {
          const from = E.sqIndex(st.dots)
          const list = dotsFor(from, st.only)
          if (st.stagger === false) board.showMoves(list)
          else
            tasks.push(
              (async () => {
                board.clearMoves()
                for (const q of list) {
                  if (skip.v) return
                  if (board.pieceAt(q)) board.mark(q, 'cap')
                  else board.mark(q, 'dot')
                  audio.sfx('tap', { vol: 0.25, pitch: 1.2 + Math.random() * 0.5 })
                  await wait(st.only ? 140 : 110)
                }
              })(),
            )
        }
        if (st.say) tasks.push(kit.say([st.say]))
        if (st.slide) {
          tasks.push(
            (async () => {
              await wait(250)
              if (skip.v) return
              board.clearMoves()
              await board.slide(E.sqIndex(st.slide[0]), E.sqIndex(st.slide[1]), { hop: !!st.hop, duration: st.hop ? 0.7 : 0.6 })
            })(),
          )
        }
        if (st.emote) host.emote(st.emote)
        await Promise.all(tasks)
        if (st.promote) {
          const q = E.sqIndex(st.promote.sq)
          board.removeAt(q)
          board.put(q, st.promote.ch, { pop: true })
          const p = board.stagePoint(q)
          fx.starBurst(p.x, p.y, 12, { sound: false })
          audio.sfx('magic')
        }
        if (st.wait) await wait(st.wait)
      }
      board.destroy()
      kit.endTask()
    },
  }

  // ---------------------------------------------------------------- pick tasks
  function placeCards(task, n) {
    const layoutBoard = task.layout === 'board'
    if (layoutBoard) {
      const w = Math.min(290, Math.floor((770 - (n - 1) * 26) / n))
      const h = 210
      const x0 = 40 + (770 - (n * w + (n - 1) * 26)) / 2
      return Array.from({ length: n }, (_, i) => ({ x: x0 + i * (w + 26), y: 340, w, h }))
    }
    const thumbs = !!task.thumbs
    const stimLeft = !!task.stim
    const areaX0 = stimLeft ? 640 : 300
    const areaW = stimLeft ? 930 : 1240
    let w
    let h
    if (thumbs) {
      w = h = Math.min(300, Math.floor((areaW - (n - 1) * 26) / n))
    } else {
      w = task.big ? Math.min(250, Math.floor((areaW - (n - 1) * 24) / n)) : Math.min(270, Math.floor((areaW - (n - 1) * 26) / n))
      h = task.big ? w : Math.min(260, w)
    }
    const total = n * w + (n - 1) * 26
    const x0 = areaX0 + (areaW - total) / 2
    return Array.from({ length: n }, (_, i) => ({ x: x0 + i * (w + 26), y: 500 - h / 2 + (stimLeft ? 0 : 20), w, h }))
  }

  async function runPick(task) {
    const layer = taskLayer
    let stimBoard = null
    // stimulus
    if (task.stim?.piece) {
      const st = el('lk-stim', pieceSvg(task.stim.piece, { face: !!task.stim.face }), 'left:170px;top:340px;width:290px;height:290px')
      layer.appendChild(st)
      s.fromTo(st, { scale: 0, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.55, ease: 'back.out(2)' })
    } else if (task.stim?.board) {
      const b = task.stim.board
      stimBoard = createBoard(s, { x: 1185, y: 505, size: 80, labels: b.labels ?? 'none', interactive: false, parent: layer })
      stimBoard.setPieces(arrFromMap(b.pieces), { pop: true })
      for (const q of b.marks ?? []) stimBoard.mark(q, 'focus')
      for (const q of b.lineMarks ?? []) stimBoard.mark(q, 'line')
      for (const q of b.stars ?? []) stimBoard.mark(q, 'star')
    }
    // cards
    const boxes = placeCards(task, task.options.length)
    const cards = task.options.map((o, i) => {
      const b = boxes[i]
      const c = el('lk-card', cardInner(o.card, b.w, b.h), `left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px`)
      layer.appendChild(c)
      return c
    })
    s.fromTo(cards, { y: 300, opacity: 0, rotation: () => gsap.utils.random(-8, 8) }, { y: 0, opacity: 1, rotation: 0, duration: 0.55, ease: 'back.out(1.5)', stagger: 0.08, delay: 0.15 })
    audio.sfx('swish')
    let wrong = 0
    let answered = false
    let resolveTap
    const nextTap = () => new Promise(r => (resolveTap = r))
    task.options.forEach((o, i) => s.tap(cards[i], () => resolveTap?.(i), { sfx: false }))

    // speak the question, then read the answers aloud (unless answered meanwhile)
    const ask = (async () => {
      await s.wait(350)
      await kit.say(task.say)
      if (task.read && !answered) {
        for (let i = 0; i < task.options.length; i++) {
          const o = task.options[i]
          if (answered || !o.say) break
          const my = speechToken
          s.to(cards[i], { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 })
          await s.say(NS + o.say, host)
          if (my !== speechToken) break
          await s.wait(120)
        }
      }
    })()
    void ask

    for (;;) {
      const i = await nextTap()
      if (answered) continue
      kit.cancelSpeech()
      const o = task.options[i]
      if (o.correct) {
        answered = true
        cards[i].classList.add('right')
        s.answer(true, { skill: task.skill, firstTry: wrong === 0 })
        cards.forEach((c, j) => j !== i && s.to(c, { opacity: 0.45, duration: 0.3 }))
        s.to(cards[i], { scale: 1.12, duration: 0.3, ease: 'back.out(2)' })
        if (task.dotsFrom != null && stimBoard) {
          const p = posFromArr(stimBoard.snapshot())
          stimBoard.showMoves(E.reachable(p, task.dotsFrom))
        }
        if (task.revealAttack && stimBoard) {
          stimBoard.mark(task.revealAttack.to, 'check')
          stimBoard.mark(task.revealAttack.from, 'ring', { color: '#FF5A5F' })
        }
        await kit.celebrate(task.right, stimBoard ? stimBoard.stagePoint(28) : { x: cards[i].offsetLeft + cards[i].offsetWidth / 2, y: cards[i].offsetTop })
        await s.wait(650)
        return { wrong }
      }
      wrong++
      s.answer(false, { skill: task.skill })
      cards[i].classList.add('used')
      s.to(cards[i], { keyframes: { x: [0, -14, 14, -10, 10, 0] }, duration: 0.4, ease: 'none' })
      if (o.showDots != null && stimBoard) {
        const p = posFromArr(stimBoard.snapshot())
        stimBoard.showMoves(E.reachable(p, o.showDots))
      }
      if (task.revealAttack && stimBoard) {
        stimBoard.mark(task.revealAttack.to, 'check')
        stimBoard.mark(task.revealAttack.from, 'ring', { color: '#FF5A5F' })
      }
      await kit.sorry(o.wrongSay)
      if (wrong >= 2 || task.options.length - wrong <= 1) {
        const ci = task.options.findIndex(x => x.correct)
        cards[ci]?.classList.add('glow')
      }
    }
  }

  // ---------------------------------------------------------------- board tasks
  async function runBoard(task) {
    const layer = taskLayer
    const S = 94
    const cx = 1070
    const cy = 505
    const board = createBoard(s, { x: cx, y: cy, size: S, labels: task.labels ?? 'none', parent: layer })
    window.__chessBoard = board
    const initial = arrFromMap(task.pieces)
    const setInitial = () => {
      board.setPieces(initial)
      board.clearMarks()
      for (const q of task.stars ?? []) board.mark(q, 'star')
      for (const q of task.marks ?? []) board.mark(q, 'focus')
      if (task.checkKing != null) board.mark(task.checkKing, 'check')
    }
    setInitial()
    board.setPieces(initial, { pop: true })
    let pos = task.fen ? E.parseFen(task.fen) : E.positionFromIndex(task.pieces, task.turn ?? 'w')
    const turn = pos.turn
    let wrong = 0
    let done = false
    let sel = -1
    let steps = 0
    let busy = false
    let only = task.only // the square of the piece we are moving (follows it across moves)
    const found = new Set()
    const hintAfter = task.hintAfter ?? 2
    let resolveDone
    const finished = new Promise(r => (resolveDone = r))

    // tray for "place" tasks
    let trayItems = []
    let selTray = null
    if (task.mode === 'place') {
      task.tray.forEach((t, i) => {
        const c = el('lk-tp', pieceSvg(t.ch), `left:${60 + (i % 4) * 130}px;top:${330 + Math.floor(i / 4) * 130}px`)
        layer.appendChild(c)
        const item = { el: c, ch: t.ch, sq: t.sq, placed: false }
        trayItems.push(item)
        s.fromTo(c, { scale: 0 }, { scale: 1, duration: 0.4, delay: i * 0.05, ease: 'back.out(2)' })
        const d = draggable(s, c, {
          onStart: () => {
            selTray = item
            trayItems.forEach(x => x.el.classList.toggle('sel', x === item))
          },
          onEnd: p => {
            const q = board.sqAt(p.x, p.y)
            if (q >= 0) placeAt(item, q, d)
            else d.home()
          },
        })
        item.drag = d
        s.on(c, 'pointerup', () => {
          selTray = item
          trayItems.forEach(x => x.el.classList.toggle('sel', x === item))
        })
      })
      if (task.hintTargets) for (const t of task.tray) board.mark(t.sq, 'ring', { color: 'rgba(255,201,60,.9)' })
    }
    function placeAt(item, q, d) {
      if (done || item.placed) return
      if (q === item.sq) {
        item.placed = true
        item.el.style.visibility = 'hidden'
        board.put(q, item.ch, { pop: true })
        board.unmark('ring', q)
        audio.sfx('plop')
        const p = board.stagePoint(q)
        fx.sparkle(p.x, p.y, 4)
        if (trayItems.every(x => x.placed)) finish()
      } else {
        d?.home()
        board.flash(q, 'bad')
        onWrong(q, task.wrongSay)
      }
    }

    // ---- hints
    const showHint = () => {
      if (task.mode === 'tap' || task.mode === 'tapAll') {
        for (const q of task.hintSquares ?? task.targets) if (!found.has(q)) board.mark(q, 'hint')
      } else if (task.mode === 'move') {
        if (task.hintMoves) {
          const froms = new Set(task.hintMoves.map(m => E.sqIndex(m.slice(0, 2))))
          if (wrong >= hintAfter + 1) for (const m of task.hintMoves) board.mark(E.sqIndex(m.slice(2, 4)), 'hint')
          for (const q of froms) board.mark(q, 'hint')
        } else {
          const from = only ?? -1
          if (from >= 0) board.showMoves(E.legalMovesFrom(pos, from).map(m => m.to))
          for (const q of task.stars ?? []) board.mark(q, 'hint')
        }
      }
      if (task.mode === 'place') for (const t of trayItems) if (!t.placed) board.mark(t.sq, 'ring', { color: 'rgba(255,201,60,.9)' })
    }
    async function onWrong(sq, lines) {
      wrong++
      s.answer(false, { skill: task.skill })
      const custom = task.wrongAt?.(sq)
      await kit.sorry(custom ?? lines ?? task.wrongSay)
      if (wrong >= hintAfter) showHint()
    }
    async function finish() {
      if (done) return
      done = true
      s.answer(true, { skill: task.skill, firstTry: wrong === 0 })
      board.clearMoves()
      await kit.celebrate(task.right, board.stagePoint(task.targets?.[0] ?? 28))
      await s.wait(600)
      resolveDone({ wrong })
    }

    // ---- input
    const movable = sq => {
      const ch = board.charAt(sq)
      if (!ch) return false
      if (only != null) return sq === only
      return E.colorOf(ch) === turn
    }
    const select = sq => {
      board.unmark('sel')
      board.clearMoves()
      sel = sq
      if (sq < 0) return
      board.mark(sq, 'sel')
      if (task.dotsOnSelect || wrong >= hintAfter) board.showMoves(E.legalMovesFrom(pos, sq).map(m => m.to))
    }
    async function attempt(from, to) {
      if (busy || done) return false
      const options = E.legalMovesFrom(pos, from).filter(m => m.to === to)
      if (!options.length) {
        // the piece cannot go there
        board.flash(to, 'bad')
        board.shake(from)
        select(-1)
        await onWrong(to, task.wrongSay)
        return false
      }
      let m = options[0]
      if (m.promo) {
        busy = true
        const pick = task.promoChoice ? await choosePromo(E.colorOf(m.piece)) : 'q'
        busy = false
        m = options.find(x => E.typeOf(x.promo) === pick) ?? m
      }
      const isGoal = task.goalMoves ? task.goalMoves.includes(mvKey(m.from, m.to)) : (task.targets ?? []).includes(m.to)
      busy = true
      board.clearMoves()
      board.unmark('sel')
      sel = -1
      steps++
      await board.animateMove(m)
      pos = E.makeMove(pos, m)
      pos.turn = turn
      if (only === m.from) only = m.to
      busy = false
      if (isGoal) {
        if (task.finalMate && pos.k.b >= 0) board.mark(pos.k.b, 'check')
        finish()
        return true
      }
      if (task.multi && steps < task.multi.max) return true // an in-between move of a two-step task
      // a legal move, but not the one we are looking for: show it, then put everything back
      await s.wait(250)
      await onWrong(to, task.wrongSay)
      steps = 0
      only = task.only
      setInitial()
      pos = task.fen ? E.parseFen(task.fen) : E.positionFromIndex(task.pieces, turn)
      return true
    }
    function choosePromo(color) {
      return new Promise(resolve => {
        kit.say(['play.promote'])
        const box = el('lk-promo', '<h3>Кем станет пешка?</h3>')
        layer.appendChild(box)
        const dim = el('', '', 'position:absolute;inset:0;background:rgba(59,47,79,.45);z-index:55')
        layer.insertBefore(dim, box)
        ;['q', 'r', 'b', 'n'].forEach((t, i) => {
          const c = el('lk-card', pieceSvg(color === 'w' ? t.toUpperCase() : t), `left:${40 + i * 215}px;top:82px;width:190px;height:190px;padding:14px`)
          c.querySelector('svg').style.cssText = 'width:100%;height:100%'
          box.appendChild(c)
          s.tap(c, () => {
            box.remove()
            dim.remove()
            resolve(t)
          })
          if (t === 'q') s.to(c, { y: -8, duration: 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
        })
        s.fromTo(box, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.6)' })
      })
    }

    board.bind({
      canDrag: sq => task.mode === 'move' && !busy && !done && movable(sq),
      dragStart: sq => select(sq),
      tap: sq => {
        if (done || busy) return
        if (task.mode === 'place') {
          if (selTray && !selTray.placed) placeAt(selTray, sq, null)
          return
        }
        if (task.mode === 'tap') {
          if (task.targets.includes(sq)) {
            board.mark(sq, 'good')
            finish()
          } else {
            board.flash(sq, 'bad')
            onWrong(sq, task.wrongSay)
          }
        } else if (task.mode === 'tapAll') {
          if (found.has(sq)) return
          if (task.targets.includes(sq)) {
            found.add(sq)
            board.unmark('hint', sq)
            board.mark(sq, 'good')
            audio.note(72 + found.size * 2, 'xylo', { vol: 0.4, dur: 0.4 })
            const p = board.stagePoint(sq)
            fx.sparkle(p.x, p.y, 3)
            if (found.size === task.targets.length) finish()
          } else {
            board.flash(sq, 'bad')
            onWrong(sq, task.wrongSay)
          }
        } else if (task.mode === 'move') {
          if (sel >= 0 && sq !== sel && E.legalMovesFrom(pos, sel).some(m => m.to === sq)) {
            attempt(sel, sq)
            return
          }
          if (movable(sq)) {
            if (sel === sq) select(-1)
            else select(sq)
            return
          }
          if (sel >= 0) {
            // tapped somewhere it cannot go
            attempt(sel, sq)
          } else if (board.charAt(sq)) {
            board.shake(sq)
            const ch = board.charAt(sq)
            if (only != null && E.colorOf(ch) === turn) audio.sfx('boing', { vol: 0.4 })
          }
        }
      },
      drop: (from, to) => attempt(from, to),
    })

    kit.say(task.say)
    const r = await finished
    board.destroy()
    delete window.__chessBoard
    return r
  }

  return kit
}
