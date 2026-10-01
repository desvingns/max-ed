// «Играем в шахматы!» — a full game for two people around one tablet (or against Цок).
//
// Seating modes:
//   tb   — players sit at the top and bottom edges of the tablet (each sees their own side upright)
//   lr   — players sit at the left and right edges
//   side — both sit on the same side, everything stays upright
//   cpu  — one player against Цок the horse (3 strengths)
// Each player gets a panel turned towards them; every dialog is mirrored so nobody has to read upside down.
import { t as gsap } from './gsap-CvDoa17S.js'
import { t as audio } from './audio-BEkH9VRF.js'
import { r as progress } from './progress-CNOIQz2A.js'
import { n as makeChar, o as fx } from './index-rPMhTJWI.js'
import { t as stickerHtml } from './stickers-DxIxdFBd.js'
import { r as STICKERS } from './world-gbmiJKlw.js'
import { createBoard, boardThumb } from './chess-boardui.js'
import { pieceSvg, COLOR_RU } from './chess-pieces.js'
import * as E from './chess-engine.js'

const GAME_ID = 'chess-play'
const INK = '#3B2F4F'

const CSS = `
.cp-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,#F4EDFF 0%,#DCD0FA 70%,#CDBFF3 100%)}
.cp-panel{position:absolute;width:330px;height:400px;border-radius:40px;background:#fff;box-shadow:0 10px 0 rgba(59,47,79,.18),inset 0 0 0 6px #EFE4FF;transition:opacity .3s;font-family:var(--font);color:${INK}}
.cp-panel.dim{opacity:.62}
.cp-panel.on{box-shadow:0 10px 0 rgba(59,47,79,.18),inset 0 0 0 9px #FFC93C,0 0 40px 6px rgba(255,201,60,.65)}
.cp-head{position:absolute;left:0;right:0;top:14px;height:112px;display:flex;align-items:center;gap:8px;padding:0 20px}
.cp-king{width:100px;height:100px;flex:none}
.cp-king svg{width:100%;height:100%}
.cp-name{font:900 40px/1 var(--font)}
.cp-turn{position:absolute;left:14px;right:14px;top:130px;height:66px;border-radius:24px;display:grid;place-items:center;font:900 34px/1 var(--font);background:#F4EEFF;color:#7A5CC7}
.cp-panel.on .cp-turn{background:#FFF1B8;color:#B36B00}
.cp-turn.check{background:#FFD6D6!important;color:#D32F2F!important}
.cp-cap{position:absolute;left:14px;right:14px;top:208px;height:96px;border-radius:24px;background:#F8F4FF;display:flex;flex-wrap:wrap;align-content:flex-start;padding:6px 10px;gap:0}
.cp-cap svg{width:40px;height:40px;margin:0 -2px}
.cp-btns{position:absolute;left:14px;right:14px;bottom:14px;height:84px;display:flex;justify-content:space-around;align-items:center}
.cp-btn{width:150px;height:76px;border-radius:38px;display:grid;place-items:center;font:900 44px/1 var(--emoji);background:#8E6BD6;color:#fff;box-shadow:0 7px 0 rgba(59,47,79,.25);cursor:pointer;touch-action:manipulation}
.cp-btn.alt{background:#FF9F43}
.cp-btn.off{opacity:.4;pointer-events:none}
.cp-dim{position:absolute;inset:0;background:rgba(59,47,79,.5)}
.cp-dlg{position:absolute;border-radius:48px;background:#fff;box-shadow:0 14px 0 rgba(59,47,79,.22),inset 0 0 0 8px #EFE4FF;font-family:var(--font);color:${INK};text-align:center}
.cp-dlg h2{margin:0;font:900 56px/1.05 var(--font)}
.cp-dlg p{margin:6px 0 0;font:800 34px/1.2 var(--font);color:#6E5F7E}
.cp-row{display:flex;justify-content:center;gap:26px}
.cp-big{min-width:250px;height:112px;padding:0 26px;border-radius:56px;display:flex;align-items:center;justify-content:center;gap:14px;font:900 40px/1 var(--font);color:#fff;background:#8E6BD6;box-shadow:0 9px 0 rgba(59,47,79,.25);cursor:pointer;touch-action:manipulation}
.cp-big .e{font:400 52px/1 var(--emoji)}
.cp-big.green{background:#5BB85B}.cp-big.orange{background:#FF9F43}.cp-big.red{background:#FF5A5F}.cp-big.blue{background:#4D96FF}
.cp-pick{width:170px;height:190px;border-radius:36px;background:#F8F4FF;box-shadow:0 8px 0 rgba(59,47,79,.2),inset 0 0 0 6px #E1D4FA;display:grid;place-items:center;cursor:pointer;touch-action:manipulation}
.cp-pick svg{width:140px;height:140px}
.cp-card{position:absolute;width:390px;height:300px;border-radius:44px;background:#fff;box-shadow:0 12px 0 rgba(59,47,79,.2),inset 0 0 0 8px var(--c);cursor:pointer;touch-action:manipulation;font-family:var(--font);color:${INK}}
.cp-card .pic{position:absolute;left:0;right:0;top:14px;height:196px}
.cp-card .cap{position:absolute;left:14px;right:14px;bottom:16px;text-align:center;font:900 31px/1.1 var(--font)}
.cp-tab{position:absolute;width:120px;height:120px}
.cp-tab .scr{position:absolute;left:0;top:0;width:100%;height:100%}
.cp-toggle{position:absolute;height:88px;padding:0 30px 0 22px;border-radius:44px;background:#fff;box-shadow:0 8px 0 rgba(59,47,79,.2);display:flex;align-items:center;gap:16px;font:900 32px/1 var(--font);cursor:pointer;touch-action:manipulation;color:${INK}}
.cp-toggle .sw{width:78px;height:44px;border-radius:22px;background:#CFC6DD;position:relative;transition:background .2s}
.cp-toggle .sw::after{content:"";position:absolute;left:5px;top:5px;width:34px;height:34px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 2px 0 rgba(0,0,0,.2)}
.cp-toggle.on .sw{background:#5BB85B}.cp-toggle.on .sw::after{left:39px}
.cp-banner{position:absolute;font:900 120px/1 var(--font);color:#fff;-webkit-text-stroke:14px ${INK};paint-order:stroke fill;text-shadow:0 10px 0 rgba(0,0,0,.25);pointer-events:none;white-space:nowrap}
.cp-title{position:absolute;left:0;right:0;top:34px;text-align:center;font:900 62px/1 var(--font);color:${INK}}
.cp-sub{position:absolute;left:0;right:0;text-align:center;font:800 34px/1 var(--font);color:#6E5F7E}
`

// ---------------------------------------------------------------- seating
const SLOTS = {
  tb: [
    { x: 1410, y: 670, r: 0 },
    { x: 190, y: 330, r: 180 },
  ],
  lr: [
    { x: 208, y: 690, r: 90, k: 0.9 },
    { x: 1392, y: 310, r: -90, k: 0.9 },
  ],
  side: [
    { x: 1410, y: 670, r: 0 },
    { x: 190, y: 670, r: 0 },
  ],
}
const DIALOG_SLOTS = {
  tb: [
    { x: 800, y: 750, r: 0 },
    { x: 800, y: 250, r: 180 },
  ],
  lr: [
    { x: 440, y: 500, r: 90 },
    { x: 1160, y: 500, r: -90 },
  ],
  side: [{ x: 800, y: 500, r: 0 }],
  cpu: [{ x: 800, y: 500, r: 0 }],
}
const LEVEL_NAMES = { 1: 'Малыш', 2: 'Умник', 3: 'Мастер' }
const MODES = {
  tb: { color: '#4D96FF', cap: 'Напротив: сверху и снизу', say: 'play.mode_tb' },
  lr: { color: '#FF8FC8', cap: 'Напротив: слева и справа', say: 'play.mode_lr' },
  side: { color: '#6BCB77', cap: 'Рядом, с одной стороны', say: 'play.mode_side' },
  cpu: { color: '#FF9F43', cap: 'Играю с Цоком', say: 'play.mode_cpu' },
}

function defaults() {
  return { mode: 'tb', flip: false, level: 2, human: 'w', hints: true, labels: true, game: null }
}
const load = () => ({ ...defaults(), ...(progress.module('chess', {}).play ?? {}) })
const save = st => progress.setModule('chess', { ...progress.module('chess', {}), play: st })

export default {
  music: 'none',
  backdrop: '#DCD0FA',
  hud: { home: '/land/chess', repeat: true },

  mount(s) {
    const style = document.createElement('style')
    style.textContent = CSS
    s.root.appendChild(style)
    const bg = document.createElement('div')
    bg.className = 'cp-bg'
    s.root.appendChild(bg)

    const st = load()
    let board = null
    let game = null
    let cfg = null // { mode, flip, level, human, ... } of the running game
    let panels = {}
    let dialogEls = []
    let cpuChar = null
    let sel = -1
    let busy = false
    let over = false
    let thinking = false
    let runId = 0

    const say = (key, who) => s.say(`g.chess.${key}`, who ?? null)
    const stage = el => s.root.appendChild(el)
    const html = (tag, cls, inner = '', css = '') => {
      const el = document.createElement(tag)
      el.className = cls
      el.innerHTML = inner
      if (css) el.style.cssText = css
      return el
    }
    const place = (el, x, y, r = 0, k = 1) => {
      el.style.left = `${x}px`
      el.style.top = `${y}px`
      el.style.transform = `translate(-50%,-50%) rotate(${r}deg)${k !== 1 ? ` scale(${k})` : ''}`
    }

    // ---------------------------------------------------------------- setup screens
    let setupEls = []
    const clearSetup = () => {
      setupEls.forEach(e => {
        gsap.killTweensOf(e.querySelectorAll('*'))
        e.remove()
      })
      setupEls = []
    }
    const addSetup = el => {
      setupEls.push(el)
      return stage(el)
    }

    function pictogram(mode) {
      // a tiny tablet with the two kings turned towards their players
      const k = (ch, x, y, r) => `<div style="position:absolute;left:${x}px;top:${y}px;width:64px;height:64px;transform:translate(-50%,-50%) rotate(${r}deg)">${pieceSvg(ch)}</div>`
      const tab = `<div style="position:absolute;left:50%;top:50%;width:150px;height:110px;transform:translate(-50%,-50%);border-radius:16px;background:#3B2F4F;padding:8px"><div style="width:100%;height:100%;border-radius:8px;overflow:hidden;background:#FFF1CF">${boardThumb({ size: 94, pieces: {} }).replace('width="94" height="94"', 'width="134" height="94" preserveAspectRatio="none"')}</div></div>`
      let pics = tab
      if (mode === 'tb') pics += k('K', 195, 168, 0) + k('k', 195, 30, 180)
      else if (mode === 'lr') pics += k('K', 50, 100, 90) + k('k', 340, 100, -90)
      else if (mode === 'side') pics += k('K', 150, 168, 0) + k('k', 240, 168, 0)
      else pics = tab + `<div style="position:absolute;left:100px;top:100px;width:110px;height:110px;transform:translate(-50%,-50%)" class="cp-tsok"></div>` + k('K', 300, 100, 0)
      return `<div style="position:absolute;left:0;top:0;width:100%;height:100%">${pics}</div>`
    }

    async function showModePicker() {
      clearSetup()
      busy = true
      s.setRepeat(() => void say('play.intro'))
      const t = html('div', 'cp-title', 'Как будем играть?')
      addSetup(t)
      const order = ['tb', 'lr', 'side', 'cpu']
      const spots = [
        [440, 290],
        [1160, 290],
        [440, 640],
        [1160, 640],
      ]
      order.forEach((m, i) => {
        const card = html('div', 'cp-card', `<div class="pic">${pictogram(m)}</div><div class="cap">${MODES[m].cap}</div>`)
        card.style.setProperty('--c', MODES[m].color)
        card.style.left = `${spots[i][0] - 195}px`
        card.style.top = `${spots[i][1] - 150}px`
        addSetup(card)
        s.fromTo(card, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, delay: 0.1 + i * 0.09, ease: 'back.out(1.8)' })
        if (m === 'cpu') {
          const holder = card.querySelector('.cp-tsok')
          const c = makeChar('tsok', { size: 110 })
          c.el.style.position = 'absolute'
          c.el.style.left = '0'
          c.el.style.top = '0'
          holder.appendChild(c.el)
          c.startIdle()
          s.onExit(() => c.destroy())
        }
        s.tap(card, () => {
          say(MODES[m].say)
          if (m === 'cpu') showCpuPicker()
          else startFresh({ mode: m })
        })
      })
      // toggles
      const wrap = html('div', '', '', 'position:absolute;left:50%;top:888px;transform:translateX(-50%);display:flex;gap:40px')
      addSetup(wrap)
      const tog = (label, emoji, key) => {
        const el = html('div', 'cp-toggle' + (st[key] ? ' on' : ''), `<span class="e" style="font:400 44px var(--emoji)">${emoji}</span><span>${label}</span><span class="sw"></span>`)
        el.style.position = 'relative'
        wrap.appendChild(el)
        s.tap(el, () => {
          st[key] = !st[key]
          el.classList.toggle('on', st[key])
          save(st)
        })
      }
      tog('Подсказки ходов', '💡', 'hints')
      tog('Буквы и цифры', '🔤', 'labels')
      // resume
      if (st.game?.moves?.length && E.Game.restore(st.game)) {
        const r = html('div', 'cp-big green', '<span class="e">▶️</span><span>Продолжить партию</span>')
        r.style.cssText = 'position:absolute;left:50%;top:146px;transform:translateX(-50%)'
        addSetup(r)
        s.tap(r, () => resume())
      }
      await s.wait(350)
      say('play.intro')
      busy = false
    }

    function showCpuPicker() {
      clearSetup()
      addSetup(html('div', 'cp-title', 'Играем с Цоком'))
      const c = makeChar('tsok', { size: 300 })
      c.el.style.left = '60px'
      c.el.style.top = '600px'
      addSetup(c.el)
      c.startIdle()
      s.onExit(() => c.destroy())
      s.from(c.el, { x: -400, duration: 0.6, ease: 'back.out(1.5)' })
      const cfgPick = { human: st.human, level: st.level }
      const lab = (txt, y) => addSetup(html('div', 'cp-sub', txt, `top:${y}px`))
      lab('Ты играешь…', 170)
      const colorCards = []
      ;['w', 'b'].forEach((col, i) => {
        const el = html('div', 'cp-pick', pieceSvg(col === 'w' ? 'K' : 'k'))
        el.style.cssText = `position:absolute;left:${640 + i * 230}px;top:225px`
        addSetup(el)
        colorCards.push([col, el])
        s.tap(el, () => {
          cfgPick.human = col
          paint()
        })
      })
      lab('Цок играет…', 455)
      const levelCards = []
      ;[
        [1, 'p'],
        [2, 'n'],
        [3, 'q'],
      ].forEach(([lv, pc], i) => {
        const el = html('div', 'cp-pick', pieceSvg(pc.toUpperCase()) + `<div style="position:absolute;bottom:6px;left:0;right:0;font:900 26px var(--font)">${LEVEL_NAMES[lv]}</div>`, `position:absolute;left:${560 + i * 230}px;top:510px`)
        el.querySelector('svg').style.cssText = 'width:110px;height:110px;position:absolute;left:30px;top:14px'
        addSetup(el)
        levelCards.push([lv, el])
        s.tap(el, () => {
          cfgPick.level = lv
          paint()
        })
      })
      const paint = () => {
        colorCards.forEach(([col, el]) => (el.style.boxShadow = col === cfgPick.human ? '0 8px 0 rgba(59,47,79,.2),inset 0 0 0 9px #5BB85B' : '0 8px 0 rgba(59,47,79,.2),inset 0 0 0 6px #E1D4FA'))
        levelCards.forEach(([lv, el]) => (el.style.boxShadow = lv === cfgPick.level ? '0 8px 0 rgba(59,47,79,.2),inset 0 0 0 9px #5BB85B' : '0 8px 0 rgba(59,47,79,.2),inset 0 0 0 6px #E1D4FA'))
      }
      paint()
      const go = html('div', 'cp-big green', '<span class="e">▶️</span><span>Играть!</span>', 'position:absolute;left:50%;top:790px;transform:translateX(-50%)')
      addSetup(go)
      s.tap(go, () => startFresh({ mode: 'cpu', human: cfgPick.human, level: cfgPick.level }))
      const back = html('div', 'cp-big orange', '<span class="e">↩️</span>', 'position:absolute;left:1180px;top:790px;min-width:130px')
      addSetup(back)
      s.tap(back, () => showModePicker())
      say('play.cpu_pick')
    }

    // ---------------------------------------------------------------- game start
    function startFresh(over_ = {}, swap = false) {
      Object.assign(st, over_)
      // a rematch swaps who plays White (the board turns round); a brand-new setup starts unflipped
      if (st.mode === 'tb' || st.mode === 'lr') st.flip = swap ? !st.flip : over_.mode ? false : st.flip
      else st.flip = false
      st.game = null
      newGame(new E.Game())
    }
    function resume() {
      const g = E.Game.restore(st.game)
      if (!g) return startFresh()
      newGame(g)
    }

    function layoutFor() {
      const mode = st.mode
      if (mode === 'cpu') {
        const humanBlack = st.human === 'b'
        return { rot: humanBlack ? 180 : 0, viewW: 0, viewB: 0, labels: 'edge', slots: null }
      }
      const slots = SLOTS[mode]
      const wi = st.flip && mode !== 'side' ? 1 : 0
      const rot = slots[wi].r
      return {
        rot: mode === 'side' ? 0 : rot,
        viewW: mode === 'side' ? 0 : slots[wi].r,
        viewB: mode === 'side' ? 0 : slots[1 - wi].r,
        labels: mode === 'side' ? 'edge' : 'both',
        slots: { w: slots[wi], b: slots[1 - wi] },
      }
    }

    function teardown() {
      runId++
      clearSetup()
      closeDialogs()
      board?.destroy()
      board = null
      Object.values(panels).forEach(p => {
        gsap.killTweensOf(p.el.querySelectorAll('*'))
        p.el.remove()
      })
      panels = {}
      if (cpuChar) {
        cpuChar.destroy()
        cpuChar = null
      }
      s.root.querySelectorAll('.cp-banner').forEach(e => e.remove())
    }

    async function newGame(g) {
      teardown()
      game = g
      cfg = { ...st }
      over = false
      sel = -1
      busy = false
      thinking = false
      const L = layoutFor()
      const cpu = st.mode === 'cpu'
      board = createBoard(s, { x: 800, y: 500, size: st.mode === 'lr' ? 90 : 100, rot: L.rot, viewW: L.viewW, viewB: L.viewB, labels: st.labels ? L.labels : 'none' })
      board.setPieces(game.pos.b, { pop: true })
      // panels
      const mk = color => {
        const el = html(
          'div',
          'cp-panel dim',
          `<div class="cp-head"><div class="cp-king">${pieceSvg(color === 'w' ? 'K' : 'k')}</div><div class="cp-name">${COLOR_RU[color].name.replace(/^./, c => c.toUpperCase())}</div></div>
           <div class="cp-turn">Ждём…</div><div class="cp-cap"></div>
           <div class="cp-btns"><div class="cp-btn undo">↩️</div><div class="cp-btn alt menu">☰</div></div>`,
        )
        stage(el)
        const p = { el, color, turn: el.querySelector('.cp-turn'), cap: el.querySelector('.cp-cap') }
        s.tap(el.querySelector('.undo'), () => undo())
        s.tap(el.querySelector('.menu'), () => openMenu())
        return p
      }
      if (cpu) {
        const hc = st.human
        panels[hc] = mk(hc)
        place(panels[hc].el, 1410, 670, 0)
        // the computer's side: Цок + his captured pieces
        const cc = hc === 'w' ? 'b' : 'w'
        const box = html('div', 'cp-panel dim', `<div class="cp-head"><div class="cp-name" style="font-size:36px;margin-left:10px">Цок · ${LEVEL_NAMES[st.level]}</div></div><div class="cp-turn">Ждёт…</div><div class="cp-cap" style="top:206px"></div>`)
        box.style.height = '330px'
        stage(box)
        place(box, 190, 325, 0)
        panels[cc] = { el: box, color: cc, turn: box.querySelector('.cp-turn'), cap: box.querySelector('.cp-cap') }
        cpuChar = makeChar('tsok', { size: 300 })
        cpuChar.el.style.left = '40px'
        cpuChar.el.style.top = '690px'
        stage(cpuChar.el)
        cpuChar.startIdle()
        s.from(cpuChar.el, { x: -420, duration: 0.6, ease: 'back.out(1.5)' })
      } else {
        for (const c of ['w', 'b']) {
          panels[c] = mk(c)
          place(panels[c].el, L.slots[c].x, L.slots[c].y, L.slots[c].r, L.slots[c].k ?? 1)
        }
      }
      board.bind({
        canDrag: sq => canPlay() && game.legalFrom(sq).length > 0,
        dragStart: sq => {
          if (canPlay() && game.legalFrom(sq).length) selectSq(sq, true)
        },
        tap: sq => onTap(sq),
        drop: (from, to) => tryMove(from, to, true),
      })
      s.setRepeat(() => void say(game.turn === 'w' ? 'play.turn_w' : 'play.turn_b'))
      refresh()
      persist()
      say(game.hist.length ? (game.turn === 'w' ? 'play.turn_w' : 'play.turn_b') : 'play.start')
      window.__chessPlay = { game: () => game, board: () => board, cfg: () => cfg, state: () => ({ over, busy, sel }) }
      maybeCpu()
    }

    const humanTurn = () => cfg.mode !== 'cpu' || game.turn === cfg.human
    const canPlay = () => !busy && !over && humanTurn() && !thinking

    // ---------------------------------------------------------------- panels / marks
    function capturedHtml(list) {
      return [...list]
        .sort((a, b) => E.VALUE[E.typeOf(b)] - E.VALUE[E.typeOf(a)])
        .map(ch => pieceSvg(ch))
        .join('')
    }
    function refresh() {
      const stt = game.status()
      const caps = game.captured()
      for (const c of ['w', 'b']) {
        const p = panels[c]
        if (!p) continue
        const mine = game.turn === c && !stt.over
        const human = cfg.mode !== 'cpu' || cfg.human === c
        p.el.classList.toggle('on', mine)
        p.el.classList.toggle('dim', !mine)
        p.turn.classList.toggle('check', mine && stt.check)
        p.turn.textContent = stt.over ? (stt.winner === c ? 'Победа!' : stt.winner ? '' : 'Ничья') : mine ? (stt.check ? 'Шах!' : human ? 'Твой ход!' : 'Думает…') : 'Ждём…'
        p.cap.innerHTML = capturedHtml(caps[c])
        if (p.el.querySelector('.undo')) p.el.querySelector('.undo').classList.toggle('off', game.hist.length === 0 || thinking)
      }
      board.unmark('last')
      board.unmark('check')
      const last = game.last()
      if (last) {
        board.mark(last.from, 'last')
        board.mark(last.to, 'last')
      }
      if (stt.check) board.mark(game.pos.k[game.turn], 'check')
      board.unmark('sel')
      board.clearMoves()
      sel = -1
    }
    function persist() {
      st.game = over ? null : game.serialize()
      save(st)
    }

    // ---------------------------------------------------------------- input
    function selectSq(sq, fromDown = false) {
      board.unmark('sel')
      board.clearMoves()
      sel = sq
      board.mark(sq, 'sel')
      if (st.hints) board.showMoves(game.legalFrom(sq).map(m => m.to))
      if (!fromDown) audio.sfx('tap', { pitch: 1.3, vol: 0.6 })
    }
    function onTap(sq) {
      if (!canPlay()) {
        if (!over && !busy && !humanTurn()) board.shake(sq)
        return
      }
      if (sel >= 0 && sel !== sq && game.legalFrom(sel).some(m => m.to === sq)) {
        tryMove(sel, sq, false)
        return
      }
      const ch = game.pos.b[sq]
      if (ch && E.colorOf(ch) === game.turn) {
        if (sel === sq) {
          board.unmark('sel')
          board.clearMoves()
          sel = -1
          return
        }
        if (game.legalFrom(sq).length) selectSq(sq)
        else {
          board.shake(sq)
          audio.sfx('boing', { vol: 0.4 })
          if (game.status().check) say('play.in_check_help')
        }
      } else {
        board.unmark('sel')
        board.clearMoves()
        sel = -1
        if (ch) board.shake(sq)
      }
    }
    async function tryMove(from, to, dragged) {
      if (!canPlay()) return false
      const options = game.legalFrom(from).filter(m => m.to === to)
      if (!options.length) {
        board.flash(to, 'bad')
        audio.sfx('wrong', { vol: 0.5 })
        if (dragged) return false
        return false
      }
      let promo = 'q'
      if (options[0].promo) {
        busy = true
        promo = await choosePromotion(game.turn)
        busy = false
      }
      await commit(from, to, promo)
      return true
    }
    async function commit(from, to, promo) {
      const my = runId
      busy = true
      board.clearMoves()
      board.unmark('sel')
      const m = game.play(from, to, promo)
      if (!m) {
        busy = false
        return
      }
      await board.animateMove(m)
      if (my !== runId) return
      afterMove()
    }
    function afterMove() {
      const stt = game.status()
      refresh()
      persist()
      busy = false
      if (stt.over) return finish(stt)
      if (stt.check) {
        audio.sfx('boing', { pitch: 1.4 })
        banner('Шах!')
        say('play.check')
      }
      maybeCpu()
    }

    // ---------------------------------------------------------------- computer
    async function maybeCpu() {
      if (cfg.mode !== 'cpu' || over || game.turn === cfg.human) return
      const my = runId
      thinking = true
      refresh()
      cpuChar?.emote('think')
      await s.wait(650 + Math.random() * 500)
      if (my !== runId) return
      await new Promise(r => setTimeout(r, 30))
      const m = E.chooseMove(game.pos, cfg.level)
      if (my !== runId || !m) return
      thinking = false
      busy = true
      game.play(m.from, m.to, m.promo ? E.typeOf(m.promo) : 'q')
      await board.animateMove(game.last())
      if (my !== runId) return
      if (m.cap) cpuChar?.emote(Math.random() < 0.5 ? 'happy' : 'laugh')
      afterMove()
    }

    async function undo() {
      if (busy || thinking || !game.hist.length) return
      const n = cfg.mode === 'cpu' ? (game.turn === cfg.human ? 2 : 1) : 1
      if (over) {
        return
      }
      for (let i = 0; i < n; i++) game.undo()
      board.setPieces(game.pos.b)
      refresh()
      persist()
      audio.sfx('whoosh', { vol: 0.5 })
    }

    // ---------------------------------------------------------------- mirrored dialogs
    function closeDialogs() {
      dialogEls.forEach(e => {
        gsap.killTweensOf(e.querySelectorAll('*'))
        gsap.killTweensOf(e)
        e.remove()
      })
      dialogEls = []
    }
    /** build(slotIndex) returns the dialog element; slots decides how many copies and where */
    function mirrored(build, { only = null, dim = true } = {}) {
      closeDialogs()
      const mode = cfg.mode === 'cpu' ? 'cpu' : cfg.mode
      let slots = DIALOG_SLOTS[mode]
      if (only) {
        // only for one colour: pick its slot
        const idx = mode === 'tb' || mode === 'lr' ? (layoutFor().slots.w === SLOTS[mode][0] ? (only === 'w' ? 0 : 1) : only === 'w' ? 1 : 0) : 0
        slots = [slots[idx] ?? slots[0]]
      }
      if (dim) {
        const d = html('div', 'cp-dim')
        d.style.opacity = '0'
        stage(d)
        dialogEls.push(d)
        s.to(d, { opacity: 1, duration: 0.25 })
      }
      slots.forEach((sl, i) => {
        const el = build(i)
        place(el, sl.x, sl.y, sl.r)
        stage(el)
        dialogEls.push(el)
        s.fromTo(el, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' })
      })
      return dialogEls
    }

    function openMenu() {
      if (busy && !over) return
      const wasBusy = busy
      busy = true
      mirrored(() => {
        const el = html('div', 'cp-dlg', '', 'width:900px;height:320px')
        el.innerHTML = `<div class="cp-row" style="position:absolute;left:0;right:0;top:34px"><div class="cp-big green c-resume"><span class="e">▶️</span><span>Играть</span></div><div class="cp-big orange c-new"><span class="e">🔄</span><span>Заново</span></div><div class="cp-big red c-exit"><span class="e">🏠</span><span>Выйти</span></div></div>
          <div class="cp-row" style="position:absolute;left:0;right:0;top:186px"><div class="cp-toggle ${st.hints ? 'on' : ''} t-hints" style="position:relative"><span style="font:400 40px var(--emoji)">💡</span><span>Подсказки</span><span class="sw"></span></div><div class="cp-toggle ${st.labels ? 'on' : ''} t-labels" style="position:relative"><span style="font:400 40px var(--emoji)">🔤</span><span>Буквы</span><span class="sw"></span></div></div>`
        s.tap(el.querySelector('.c-resume'), () => {
          closeDialogs()
          busy = wasBusy
        })
        s.tap(el.querySelector('.c-new'), () => {
          closeDialogs()
          startFresh({}, cfg.mode !== 'cpu')
        })
        s.tap(el.querySelector('.c-exit'), () => {
          persist()
          s.go('/land/chess')
        })
        s.tap(el.querySelector('.t-hints'), () => {
          st.hints = !st.hints
          dialogEls.forEach(d => d.querySelectorAll('.t-hints').forEach(t => t.classList.toggle('on', st.hints)))
          save(st)
        })
        s.tap(el.querySelector('.t-labels'), () => {
          st.labels = !st.labels
          dialogEls.forEach(d => d.querySelectorAll('.t-labels').forEach(t => t.classList.toggle('on', st.labels)))
          board.setLabels(st.labels ? layoutFor().labels : 'none')
          save(st)
        })
        return el
      })
    }

    function choosePromotion(color) {
      return new Promise(resolve => {
        say('play.promote')
        mirrored(
          () => {
            const el = html('div', 'cp-dlg', '', 'width:900px;height:290px')
            el.innerHTML = `<div style="position:absolute;left:0;right:0;top:14px;font:900 40px var(--font)">Во кого превратим пешку?</div><div class="cp-row" style="position:absolute;left:0;right:0;top:78px"></div>`
            const row = el.querySelector('.cp-row')
            ;['q', 'r', 'b', 'n'].forEach(t => {
              const p = html('div', 'cp-pick', pieceSvg(color === 'w' ? t.toUpperCase() : t))
              p.style.cssText = 'width:190px;height:190px'
              row.appendChild(p)
              s.tap(p, () => {
                closeDialogs()
                resolve(t)
              })
              if (t === 'q') s.to(p, { y: -8, duration: 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
            })
            return el
          },
          { only: color },
        )
      })
    }

    function banner(text) {
      const mode = cfg.mode
      const slots = mode === 'tb' || mode === 'lr' ? DIALOG_SLOTS[mode] : DIALOG_SLOTS.cpu
      slots.forEach(sl => {
        const el = html('div', 'cp-banner', text)
        place(el, sl.x, sl.y, sl.r)
        el.style.zIndex = '45'
        stage(el)
        s.fromTo(el, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2.4)' })
        s.to(el, { opacity: 0, y: -30, duration: 0.4, delay: 1.1, onComplete: () => el.remove() })
      })
    }

    // ---------------------------------------------------------------- the end
    async function finish(stt) {
      over = true
      busy = true
      st.game = null
      save(st)
      const my = runId
      refresh()
      const winner = stt.winner
      const cpu = cfg.mode === 'cpu'
      const humanWon = cpu && winner === cfg.human
      if (winner) {
        board.mark(game.pos.k[winner === 'w' ? 'b' : 'w'], 'check')
        banner('Мат!')
        say(cpu ? (humanWon ? 'play.cpu_lose' : 'play.cpu_win') : winner === 'w' ? 'play.mate_w' : 'play.mate_b')
      } else say(stt.reason === 'stalemate' ? 'play.stalemate' : 'play.draw')
      if (winner && (!cpu || humanWon)) {
        fx.celebrate()
        cpuChar?.emote('sad')
      } else if (cpu && winner) cpuChar?.emote('cheer')
      else fx.starBurst(800, 500, 12)
      progress.finishGame(GAME_ID, 3)
      let newSticker = null
      const free = STICKERS.filter(x => x.region === 'chess' && !progress.hasSticker(x.id))
      if (free.length && (!cpu || humanWon || !winner)) {
        newSticker = free[0].id
        progress.addSticker(newSticker)
      }
      await s.wait(1700)
      if (my !== runId) return
      const reasonText = { checkmate: '', stalemate: 'Пат: ходить нечем, но королю не шах.', insufficient: 'Осталось слишком мало фигур для мата.', fifty: '50 ходов без взятий и пешек.', repetition: 'Позиция повторилась три раза.' }[stt.reason]
      mirrored(() => {
        const el = html('div', 'cp-dlg', '', 'width:900px;height:400px')
        const title = winner ? (cpu ? (humanWon ? 'Ты победил!' : 'Цок победил!') : `Победили ${COLOR_RU[winner].plural}!`) : 'Ничья!'
        const sub = winner ? 'Шах и мат!' : reasonText
        const icon = winner ? pieceSvg(winner === 'w' ? 'K' : 'k') : pieceSvg('K') + pieceSvg('k')
        el.innerHTML = `<div style="position:absolute;left:30px;top:24px;width:210px;height:190px;display:flex;align-items:center;justify-content:center">${icon.replace(/<svg /g, `<svg style="width:${winner ? 180 : 100}px;height:${winner ? 180 : 100}px" `)}</div>
          <div style="position:absolute;left:260px;right:${newSticker ? 170 : 30}px;top:30px;text-align:left"><h2>${title}</h2><p>${sub}</p>${newSticker ? '<p style="color:#B36B00;font-weight:900">Новая наклейка!</p>' : ''}</div>
          ${newSticker ? `<div style="position:absolute;right:34px;top:30px;width:126px;height:126px;transform:rotate(6deg)">${stickerHtml(newSticker)}</div>` : ''}
          <div class="cp-row" style="position:absolute;left:0;right:0;bottom:30px"><div class="cp-big green c-again"><span class="e">🔄</span><span>Ещё партию</span></div><div class="cp-big red c-exit"><span class="e">🏠</span><span>Выйти</span></div></div>`
        s.tap(el.querySelector('.c-again'), () => {
          closeDialogs()
          startFresh({}, cfg.mode !== 'cpu')
        })
        s.tap(el.querySelector('.c-exit'), () => s.go('/land/chess'))
        return el
      })
    }

    // ---------------------------------------------------------------- go
    if (st.game?.moves?.length && new URLSearchParams(location.hash.split('?')[1] ?? '').get('resume') === '1') resume()
    else showModePicker()

    window.__chessPlayTest = { startFresh, showModePicker, newGame, openMenu, st: () => st }
    s.onExit(() => {
      delete window.__chessPlay
      delete window.__chessPlayTest
    })
  },
}
