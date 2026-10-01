// Flows of the learning games (names, moves, board, words, puzzles). Each game is created with
// the app's shared game factory, so stars, difficulty levels and the sticker ceremony work as elsewhere.
import { t as createGame } from './game-DZK2pUBQ.js'
import { n as makeChar } from './index-rPMhTJWI.js'
import { r as progress } from './progress-CNOIQz2A.js'
import { n as iconBtn } from './icons-CRMH_CuS.js'
import { t as audio } from './audio-BEkH9VRF.js'
import { createKit } from './chess-kit.js'
import { pieceSvg, PIECE } from './chess-pieces.js'
import * as T from './chess-tasks.js'
import { DEMOS, BOARD_TOUR } from './chess-lessons.js'

const ORDER = ['r', 'b', 'q', 'k', 'n', 'p']
const cap = s => s[0].toUpperCase() + s.slice(1)

export function createLearnGame(cfg) {
  return createGame({
    id: cfg.id,
    region: 'chess',
    host: 'tsok',
    music: 'gentle',
    backdrop: '#DCD2FF',
    maxLevel: 2,
    async play(s) {
      const host = makeChar('tsok', { size: 330 })
      host.el.style.left = '30px'
      host.el.style.top = '655px'
      host.el.style.zIndex = '20'
      s.root.appendChild(host.el)
      host.startIdle()
      s.onExit(() => host.destroy())
      s.from(host.el, { x: -420, duration: 0.6, ease: 'back.out(1.5)', delay: 0.1 })
      const kit = createKit(s, host)
      window.__chessKit = kit
      s.onExit(() => delete window.__chessKit)
      await cfg.run(s, host, kit)
      kit.setTitle('')
      host.emote('cheer')
      await kit.say(['learn.well_done'])
      await s.finish()
    },
  })
}

/** run `n` tasks from a generator list; the difficulty follows the child's answers */
export async function rounds(s, kit, gens, n = 8) {
  const recent = []
  for (let i = 0; i < n; i++) {
    kit.progress(n, i)
    const task = T.nextTask(gens, s.level, recent)
    if (!task) continue
    recent.push(task.gen)
    window.__chessTask = task
    await kit.runTask(task)
    await s.wait(250)
  }
  kit.progress(n, n)
  delete window.__chessTask
}

/** a screen with a green "next" button; resolves when pressed */
function nextButton(s, layer) {
  return new Promise(resolve => {
    const b = iconBtn('next', '#5BB85B', 120)
    b.style.left = '1440px'
    b.style.top = '790px'
    layer.appendChild(b)
    s.fromTo(b, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.4 })
    s.to(b, { scale: 1.08, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 })
    s.tap(b, () => resolve())
  })
}

// ---------------------------------------------------------------- names: meet the pieces
export async function namesTour(s, host, kit) {
  const layer = kit.newLayer()
  kit.setTitle('Знакомимся с фигурами!')
  const types = ['k', 'q', 'r', 'b', 'n', 'p']
  const cards = types.map((t, i) => {
    const c = document.createElement('div')
    c.className = 'lk-card'
    const w = 250
    const h = 290
    c.style.cssText = `left:${650 + (i % 3) * 280}px;top:${190 + Math.floor(i / 3) * 320}px;width:${w}px;height:${h}px`
    c.innerHTML = `<div class="pc" style="width:${w - 40}px;height:${w - 40}px">${pieceSvg(t.toUpperCase(), { face: true })}</div><div class="nm" style="font-size:38px;margin-top:0">${cap(PIECE[t].ru)}</div>`
    layer.appendChild(c)
    return c
  })
  s.fromTo(cards, { scale: 0, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.09 })
  let touched = false
  const speakPiece = async i => {
    kit.cancelSpeech()
    s.to(cards[i], { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 })
    host.emote('happy')
    await kit.say([`names.intro.${types[i]}`])
  }
  cards.forEach((c, i) =>
    s.tap(c, () => {
      touched = true
      speakPiece(i)
    }),
  )
  const done = nextButton(s, layer)
  let finished = false
  done.then(() => {
    finished = true
    kit.cancelSpeech()
  })
  // Цок introduces them one by one, unless the child starts to explore
  ;(async () => {
    await s.wait(700)
    await kit.say(['names.intro'])
    for (let i = 0; i < types.length && !touched && !finished; i++) {
      s.to(cards[i], { scale: 1.1, duration: 0.25, yoyo: true, repeat: 1 })
      await kit.say([`names.intro.${types[i]}`])
      await s.wait(200)
    }
    if (!touched && !finished) await kit.say(['names.intro_colors'])
  })()
  await done
  kit.endTask()
  await kit.say(['names.intro_end'])
}

// ---------------------------------------------------------------- moves: which piece to learn
export async function pickPiece(s, host, kit) {
  const layer = kit.newLayer()
  kit.setTitle('Как ходит…?')
  const learned = progress.module('chess', {}).learned ?? {}
  let chosen = null
  const list = [...ORDER, 'all']
  const cards = list.map((t, i) => {
    const c = document.createElement('div')
    c.className = 'lk-card'
    const w = 250
    const h = 290
    c.style.cssText = `left:${400 + (i % 4) * 280}px;top:${262 + Math.floor(i / 4) * 330}px;width:${w}px;height:${h}px`
    if (t === 'all') c.innerHTML = `<div style="display:flex;height:${w - 90}px;align-items:center;margin-top:8px">${['N', 'B', 'R'].map(x => `<div style="width:${(w - 30) / 3 + 8}px;margin:0 -4px">${pieceSvg(x)}</div>`).join('')}</div><div class="nm" style="font-size:34px;margin-top:4px">Все вместе</div>`
    else c.innerHTML = `<div class="pc" style="width:${w - 50}px;height:${w - 50}px">${pieceSvg(t.toUpperCase(), { face: true })}</div><div class="nm" style="font-size:38px">${cap(PIECE[t].ru)}</div>${learned[t] ? '<div style="position:absolute;right:14px;top:10px;font:400 48px var(--emoji)">⭐</div>' : ''}`
    layer.appendChild(c)
    return c
  })
  s.fromTo(cards, { scale: 0, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.07 })
  await new Promise(resolve => {
    cards.forEach((c, i) =>
      s.tap(c, () => {
        chosen = list[i]
        kit.cancelSpeech()
        resolve()
      }),
    )
    ;(async () => {
      await s.wait(500)
      await kit.say(['moves.pick'])
    })()
    s.setRepeat(() => void kit.say(['moves.pick']))
  })
  kit.endTask()
  return chosen
}

export async function movesFlow(s, host, kit) {
  const t = await pickPiece(s, host, kit)
  if (t !== 'all') {
    await kit.runDemo(DEMOS[t], { title: cap(PIECE[t].ru) })
    const m = progress.module('chess', {})
    progress.setModule('chess', { ...m, learned: { ...(m.learned ?? {}), [t]: true } })
  }
  await rounds(s, kit, T.movesGens(t), 8)
}

export async function boardFlow(s, host, kit) {
  await kit.runDemo(BOARD_TOUR, { title: 'Шахматная доска', labels: 'edge' })
  await rounds(s, kit, T.BOARD_GENS, 10)
}

export async function namesFlow(s, host, kit) {
  await namesTour(s, host, kit)
  await rounds(s, kit, T.NAMES_GENS, 10)
}

export async function wordsFlow(s, host, kit) {
  host.emote('wave')
  await kit.say(['words.intro'])
  await rounds(s, kit, T.WORDS_GENS, 9)
}

export async function puzzlesFlow(s, host, kit) {
  host.emote('wave')
  await kit.say(['puz.intro'])
  await rounds(s, kit, T.PUZZLE_GENS, 8)
}

void audio
