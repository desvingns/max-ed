# Max Ed — static site deployment

This public repository contains only the production build. The source project is maintained separately.

Live site: https://desvingns.github.io/max-ed/

To publish a newer build, replace the contents of the site folder with the updated Vite output and push to main. The GitHub Pages workflow deploys changes to the site folder.

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
