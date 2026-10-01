# Max Ed — static site deployment

This public repository contains only the production build. The source project is maintained separately.

Live site: https://desvingns.github.io/max-ed/

To publish a newer build, replace the contents of the site folder with the updated Vite output and push to main. The GitHub Pages workflow deploys changes to the site folder.

## Chess station — «Шахматное Королевство»

A new station at the far end of the island (after «Поющая Поляна»). Its host is the horse **Цок** (Tsok). It is
not part of the story progress: it is open from the start, like the music meadow.

| Portal | What it is |
| --- | --- |
| **Как зовут фигуры** | meet the six pieces, then name / find / colour / "who is the strongest" questions |
| **Как ходят фигуры** | pick a piece → a short animated lesson → 8 tasks (where can it go, take it to the star, find all squares, what can it capture, which picture shows its moves, can it go there?). Pawn: first double step, capturing, promotion. Knight: jumping |
| **Доска и клеточки** | light/dark squares, a1–h8 names, files (вертикали), ranks (горизонтали), diagonals, where the pieces start, setting up a rank |
| **Шах, мат и другие слова** | check, mate, stalemate, castling, promotion, draw; who gives check; save the king; which piece is stronger |
| **Шахматные задачки** | mate in one, give check, take the undefended piece, escape check, knight fork |
| **Играем в шахматы!** | a real game (all rules) for two people on one tablet, or against Цок |

All tasks are **generated** (positions are random, the right answers are computed by the rules engine), so there are
thousands of distinct tasks. Difficulty follows the child's answers (3 levels), stars and stickers work like in the other
games, and every question is spoken aloud.

### Playing with dad across the tablet

Choose how you sit — the whole game turns towards each player:

* **сверху и снизу** — players at the two long edges: the board stays, Black's pieces, panel, labels and every dialog are
  turned 180° for the person on the other side;
* **слева и справа** — players at the short edges: everything is turned ±90°;
* **рядом** — both on one side, everything upright;
* **с Цоком** — against the computer (Малыш / Умник / Мастер), as White or Black.

Each player has a panel with whose turn it is, captured pieces, "ход назад" and a menu. "Подсказки ходов" (dots for legal
moves) and board letters/numbers can be switched off. An unfinished game is saved and can be continued.

Parents' corner («Уголок родителей → Прогресс») has a new «Шахматы» card: what is known / being learned per piece and concept.

### Where the code is

The repo holds only the Vite output, so the station is written as plain readable ES modules next to it:

```
site/assets/chess-engine.js    rules: legal moves, check/mate/stalemate, castling, en passant, promotion, draws, AI
site/assets/chess-pieces.js    piece artwork + Russian names
site/assets/chess-boardui.js   the board (tap, drag, dots, rotation for the players' seats, animations)
site/assets/chess-tasks.js     task generators (pure logic)
site/assets/chess-lessons.js   scripted piece demos
site/assets/chess-kit.js       lesson screen, answer cards, board tasks
site/assets/chess-learn.js     the five learning games; chess-names/-moves/-board/-words/-puzzles.js are their entry points
site/assets/chess-play.js      the two-player / vs-computer game
site/assets/chess-tsok.js      the character;  chess-art.js  island landmark + station background
site/assets/chess-voice.js     all voice lines;  chess-parents.js  the parents' card
site/voice/*.mp3               the 485 new voice clips (registered in site/voice/manifest.json)
```

Small edits inside the minified files (station registry, island map, station background, router, voice table, stickers,
album, parents' corner, station screen) are made by `tools/chess/apply-patches.mjs`. It is idempotent and finds the
files without their build hash. **If the site is rebuilt from the source project, the chess station is not in that
source**: either port the modules above into it, or copy the new build's files over and run
`node tools/chess/apply-patches.mjs` again (it stops with a clear message if an anchor no longer matches).

### Tools (`tools/chess`)

```
node tools/chess/test-engine.mjs        perft on 6 reference positions + rule checks + AI sanity
node tools/chess/test-tasks.mjs [n]     generates thousands of tasks and verifies each is well-formed and answerable
node tools/chess/test-voice.mjs         every voice line a task/lesson uses exists (run test-tasks first)
node tools/chess/apply-patches.mjs      wire the station into the build, refresh precache.json, bump the service worker
python3 tools/chess/gen-voice.py        make missing voice clips with the game's voices (edge-tts; needs network)
```

After changing any file under `site/`, run `node tools/chess/apply-patches.mjs --bump` so `precache.json` and the
service worker version are refreshed (otherwise installed tablets keep the old cached files).

## Школа поваров Пыха (kx)

Кухонный регион («Кухня Пыха», домик-чайник) расширен до 7 глав примерно по 7 уровней (49 уровней):
Азбука кухни · Нарезалка · Соль и вкус · Рецепты Пыха · Сладкая полка · Чудеса кухни · Продуктовая лавка.

Новые уровни живут в `site/assets/kx/` как обычные ES-модули (не минифицированы), к собранной игре подключены точечными
правками чанков. Если игру пересоберут из исходников, хэши чанков поменяются — править нужно `site/assets/kx/deps.js`
и якоря в `tools/patch-build.py`.

* `site/assets/kx/registry.js` — главы, уровни, стикеры;  `levels/<id>.js` — уровень;  `lines/<id>.js` — реплики.
* `docs/kx-guide.md` — API тулкита и правила авторства;  `docs/kitchen-levels.md` — замыслы уровней.
* `tools/patch-build.py` — подключение kx к сборке (идемпотентно), обновляет `precache.json` и версию service worker.
* `tools/build-lines.mjs` + `tools/voice/build_voice.py` — озвучка реплик нейроголосами (Edge-TTS), липсинк, `voice/manifest.json`.
* `tools/qa/run-level.mjs` — автопрогон уровня в headless Chromium (`gestures.mjs` — проверка реальных жестов).

Пересборка озвучки после правки реплик:

```
node tools/build-lines.mjs --json=/tmp/kx-lines.json
python3 tools/voice/build_voice.py /tmp/kx-lines.json
python3 tools/patch-build.py
```
