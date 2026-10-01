// Wires the chess station into the *built* (minified) Max Ed site.
//
// The source project lives elsewhere; this repo only holds the Vite output. Everything new is
// written as readable ES modules (site/assets/chess-*.js) and this script makes the small edits
// to the minified files that register them. It is idempotent: run it as often as you like.
//
//   node tools/chess/apply-patches.mjs          # apply + refresh precache.json and the service worker version
//
// Files are found by their name without the build hash (world-*.js, island-*.js, ...). Each edit
// replaces exactly one anchor string; an edit whose replacement is already present is skipped.
// If a future build renames something and an anchor no longer matches, the script stops with a
// clear message instead of guessing.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../site')
const assets = path.join(root, 'assets')

const GAMES = ['chess-names', 'chess-moves', 'chess-board', 'chess-words', 'chess-puzzles', 'chess-play']

// edit kinds: { find, replace } | { prepend }   (prepend = an import placed at the very top of the file)
const patches = [
  // ---------------------------------------------------------------- world registry (regions, stickers, width)
  {
    file: 'world-*.js',
    edits: [
      { prepend: 'import{pieceSvg as __ps}from"./chess-pieces.js";import{boardIcon as __bi}from"./chess-art.js";' },
      { find: 'var e=4400,', replace: 'var e=4900,' },
      {
        find: 'Попугай-повторюшка`}]}],r=[',
        replace:
          'Попугай-повторюшка`}]},' +
          '{id:`chess`,kind:`learn`,title:`Шахматное Королевство (шахматы)`,host:`tsok`,color:`#8E6BD6`,sky:[`#DCD2FF`,`#F7F3FF`],map:{x:4680,y:700},activities:[' +
          '{route:`/game/chess-names`,icon:__ps(`Q`,{face:!0}),color:`#B388EB`,title:`Как зовут фигуры`},' +
          '{route:`/game/chess-moves`,icon:__ps(`N`),color:`#4D96FF`,title:`Как ходят фигуры`},' +
          '{route:`/game/chess-board`,icon:__bi(),color:`#6BCB77`,title:`Доска и клеточки`},' +
          '{route:`/game/chess-words`,icon:t(`📣`),color:`#FF8FC8`,title:`Шах, мат и другие слова`},' +
          '{route:`/game/chess-puzzles`,icon:t(`🧩`),color:`#FF9F43`,title:`Шахматные задачки`},' +
          '{route:`/game/chess-play`,icon:t(`⚔️`),color:`#FF5A5F`,title:`Играем в шахматы!`}]}],r=[',
      },
      {
        find: '{id:`x-hapchik`',
        replace:
          '{id:`h-tsok`,region:`chess`,art:`char:tsok`,bg:`#E6DDF7`},' +
          '{id:`h-king`,region:`chess`,art:`chess:wk`,bg:`#FFF3B0`},' +
          '{id:`h-queen`,region:`chess`,art:`chess:wq`,bg:`#FFD6EC`},' +
          '{id:`h-rook`,region:`chess`,art:`chess:wr`,bg:`#CDEBFF`},' +
          '{id:`h-bishop`,region:`chess`,art:`chess:wb`,bg:`#D9F5D0`},' +
          '{id:`h-knight`,region:`chess`,art:`chess:wn`,bg:`#FFE3C2`},' +
          '{id:`h-pawn`,region:`chess`,art:`chess:wp`,bg:`#E8DDFF`},' +
          '{id:`h-blackking`,region:`chess`,art:`chess:bk`,bg:`#FFE3A3`},' +
          '{id:`h-trophy`,region:`chess`,art:`🏆`,bg:`#FFF3B0`},' +
          '{id:`x-hapchik`',
      },
    ],
  },
  // ---------------------------------------------------------------- island map: landmark + terrain for the longer island
  {
    file: 'island-*.js',
    edits: [
      { prepend: 'import{chessLandmark as __cl}from"./chess-art.js";' },
      { find: 'music:e=>ae(e)}', replace: 'music:e=>ae(e),chess:()=>__cl()}' },
      { find: '[4060,540],[4240,640]]);', replace: '[4060,540],[4240,520],[4520,498],[4800,528],[s+120,640]]);' },
      { find: 'L4240 700 L230 700 Z', replace: 'L${s+120} 700 L230 700 Z' },
    ],
  },
  // ---------------------------------------------------------------- station background
  {
    file: 'backgrounds-*.js',
    edits: [
      { prepend: 'import{chessBackground as __cb}from"./chess-art.js";' },
      { find: 'meadow:$}', replace: 'meadow:$,chess:__cb}' },
    ],
  },
  // ---------------------------------------------------------------- router: games + character
  {
    file: 'index-*.js',
    edits: [
      {
        find: 'import.meta.url)}),V=Object.assign(',
        replace:
          'import.meta.url),' +
          GAMES.map(g => `"../games/${g}/index.ts":()=>L(()=>import(\`./${g}.js\`),[],import.meta.url)`).join(',') +
          '}),V=Object.assign(',
      },
      {
        find: 'import.meta.url)}),Z=new Map',
        replace: 'import.meta.url),"./tsok/index.ts":()=>L(()=>import(`./chess-tsok.js`),[],import.meta.url)}),Z=new Map',
      },
    ],
  },
  // ---------------------------------------------------------------- voice: new lines + new speaker
  {
    file: 'voice-*.js',
    edits: [
      { prepend: 'import{VOICE_MODULES as __CV,SPEAKERS as __CS}from"./chess-voice.js";' },
      { find: 'for(let e of Object.values(pt))', replace: 'for(let e of [...Object.values(pt),...__CV])' },
      { find: 'ut={narrator:', replace: 'ut={...__CS,narrator:' },
    ],
  },
  // ---------------------------------------------------------------- stickers: chess piece art
  {
    file: 'stickers-*.js',
    edits: [
      { prepend: 'import{chessArt as __ca}from"./chess-pieces.js";' },
      {
        find: 'if(a.art.startsWith(`char:`))',
        replace:
          'if(a.art.startsWith(`chess:`))o=`<div style="position:absolute;inset:8%">${__ca(a.art.slice(6)).replace(`<svg `,`<svg width="100%" height="100%" `)}</div>`;else if(a.art.startsWith(`char:`))',
      },
    ],
  },
  // ---------------------------------------------------------------- album: silhouettes of not-yet-won chess stickers
  {
    file: 'album-*.js',
    edits: [
      { prepend: 'import{chessArt as __ca}from"./chess-pieces.js";' },
      {
        find: 'function U(e){if(e.art.startsWith(`char:`))',
        replace: 'function U(e){if(e.art.startsWith(`chess:`))return __ca(e.art.slice(6)).replace(`<svg `,`<svg width="100%" height="100%" `);if(e.art.startsWith(`char:`))',
      },
    ],
  },
  // ---------------------------------------------------------------- parents' corner: a "Шахматы" progress card
  {
    file: 'parents-*.js',
    edits: [
      { prepend: 'import{chessCard as __cc}from"./chess-parents.js";' },
      {
        find: '</section>\n  </div>\n  <section class="pc-card">\n    <div class="pc-card-head"><h2><span class="emoji">🎮</span>Игры</h2>',
        replace: '</section>\n  </div>\n  ${__cc(j,M,y)}\n  <section class="pc-card">\n    <div class="pc-card-head"><h2><span class="emoji">🎮</span>Игры</h2>',
      },
      // chess skills get their own card, so keep them out of the generic "other skills" list
      { find: 'R=[`letter`,`number`,`color`,`shape`,`mix`]', replace: 'R=[`letter`,`number`,`color`,`shape`,`mix`,`chess`]' },
    ],
  },
  // ---------------------------------------------------------------- map: Пых announces the flight to the new station
  {
    file: 'map-*.js',
    edits: [{ find: '`shapes`,`music`])', replace: '`shapes`,`music`,`chess`])' }],
  },
  // ---------------------------------------------------------------- station screen: room for 5–6 activity portals
  {
    file: 'land-*.js',
    edits: [
      {
        find: '4:[[680,780],[925,725],[1170,780],[1415,725]]};if(t[e])return t[e].map(([e,t])=>({x:e,y:t,d:p}));',
        replace:
          '4:[[680,780],[925,725],[1170,780],[1415,725]],5:[[705,560],[1035,530],[1365,560],[870,815],[1200,815]],6:[[705,555],[1035,555],[1365,555],[705,815],[1035,815],[1365,815]]};' +
          'if(t[e])return t[e].map(([e,t],_i,_a)=>({x:e,y:t,d:_a.length>4?180:p}));',
      },
    ],
  },
]

// ---------------------------------------------------------------- helpers
const globToRe = g => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace('*', '[^/]+') + '$')

/** the one file in assets/ that matches the pattern and contains the anchors (or their replacements) */
function resolve(pattern, edits) {
  const re = globToRe(pattern)
  const hits = fs.readdirSync(assets).filter(f => re.test(f))
  const marks = edits.flatMap(e => (e.find ? [e.find, e.replace] : []))
  const usable = hits.filter(f => {
    const src = fs.readFileSync(path.join(assets, f), 'utf8')
    return marks.some(m => src.includes(m))
  })
  if (usable.length !== 1) throw new Error(`${pattern}: expected exactly one matching file that contains the anchors, found ${usable.length} (candidates: ${hits.join(', ') || 'none'})`)
  return path.join(assets, usable[0])
}

let changed = 0
for (const { file, edits } of patches) {
  const full = resolve(file, edits)
  let src = fs.readFileSync(full, 'utf8')
  const before = src
  for (const e of edits) {
    if (e.prepend) {
      if (!src.includes(e.prepend)) src = e.prepend + src
      continue
    }
    if (src.includes(e.replace)) continue
    const n = src.split(e.find).length - 1
    if (n !== 1) throw new Error(`${path.basename(full)}: anchor found ${n} times (need 1): ${e.find.slice(0, 70)}`)
    src = src.replace(e.find, () => e.replace)
  }
  if (src !== before) {
    fs.writeFileSync(full, src)
    changed++
    console.log('patched', path.relative(root, full))
  }
}

// ---------------------------------------------------------------- web app manifest blurb
{
  const file = path.join(root, 'manifest.webmanifest')
  const src = fs.readFileSync(file, 'utf8')
  if (src.includes('цвета, ферма и кухня.')) {
    fs.writeFileSync(file, src.replace('цвета, ферма и кухня.', 'цвета, ферма, кухня и шахматы.'))
    changed++
    console.log('patched manifest.webmanifest')
  }
}

// ---------------------------------------------------------------- precache list = every shipped file
{
  const skip = new Set(['sw.js', 'precache.json', '.nojekyll', 'icons/icon-src.png'])
  const files = []
  const walk = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) walk(p)
      else {
        const rel = path.relative(root, p).split(path.sep).join('/')
        if (!skip.has(rel) && !rel.startsWith('_')) files.push(rel)
      }
    }
  }
  walk(root)
  const head = ['./', 'index.html', 'manifest.webmanifest']
  const rest = files.filter(f => !head.includes(f)).sort()
  const next = JSON.stringify([...head, ...rest])
  const file = path.join(root, 'precache.json')
  if (fs.readFileSync(file, 'utf8') !== next) {
    fs.writeFileSync(file, next)
    changed++
    console.log(`precache.json: ${rest.length + head.length} entries`)
  }
}

// ---------------------------------------------------------------- service worker: fresh version + bypass the HTTP cache while precaching
{
  const file = path.join(root, 'sw.js')
  let sw = fs.readFileSync(file, 'utf8')
  const orig = sw
  const oldLoop = 'for (let i = 0; i < list.length; i += 20) await cache.addAll(list.slice(i, i + 20))'
  const newLoop = `for (let i = 0; i < list.length; i += 20) {
        await Promise.all(list.slice(i, i + 20).map(async url => {
          // 'reload' skips the browser's HTTP cache, so files that changed under the same name are really refetched
          const res = await fetch(new Request(url, { cache: 'reload' }))
          if (!res.ok) throw new Error(url + ' ' + res.status)
          await cache.put(url, res)
        }))
      }`
  if (sw.includes(oldLoop)) sw = sw.replace(oldLoop, newLoop)
  else if (!sw.includes("cache: 'reload'")) throw new Error('sw.js: precache loop not recognised')
  // any change to the shipped files must change sw.js too, otherwise browsers never notice the update
  if (changed > 0 || process.argv.includes('--bump') || sw !== orig) sw = sw.replace(/const VERSION = '[^']*'/, `const VERSION = 'v${Date.now()}'`)
  if (sw !== orig) {
    fs.writeFileSync(file, sw)
    changed++
    console.log('patched sw.js')
  }
}

console.log(changed ? `done (${changed} file(s) updated)` : 'nothing to do: already up to date')
