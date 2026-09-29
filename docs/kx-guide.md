# kx — руководство автора уровня «Школы поваров Пыха»

Игра «Максим и Радужный Остров» — детская обучающая PWA для малыша (3–5 лет), сцена 1600×1000, горизонтально.
В репозитории лежит **только production-сборка Vite** (исходников нет). Новые кухонные уровни написаны как обычные
ES-модули в `site/assets/kx/` и подключены к сборке точечными правками (`tools/patch-build.py`).

## Правила работы (важно)

* Ваши файлы: `site/assets/kx/levels/<id>.js` и `site/assets/kx/lines/<id>.js` (для каждого своего `id`).
  Ничего кроме них **не править**: `lib.js, gesture.js, cut.js, ui.js, kit.js, food.js, art.js, sfx.js, deps.js, registry.js`
  и все хэшированные чанки `assets/*-XXXX.js` — общие. Если нужна доработка тулкита — сделайте локально в своём файле
  (например, свой SVG через `art.js`) и опишите проблему в итоговом сообщении.
* Список уровней, названия, иконки, стикеры уже в `registry.js` — id менять нельзя. Стикер выдаётся автоматически.
* Каждый уровень = `levels/<id>.js` (`export default defineLevel({ id, async run(k) {...} })`) + `lines/<id>.js` (тексты реплик).
* Образцы: `levels/cut-cucumber.js` (нарезка, жесты, счёт), `levels/hot-sharp.js` (drag-сортировка), `levels/why-salt.js` (плита, шкала, выбор карточкой).
* Сервер уже запущен: `http://localhost:8123/` (раздаёт `site/`, без кэша). Уровень открывается по `http://localhost:8123/index.html?fastvoice#/ep/<id>`.

## Дизайн для малыша (3–5 лет) — обязательные принципы

1. **Ничего не читают.** Каждое задание озвучено (Пых/герои говорят). Текст на экране — только числа/буквы как предмет обучения.
2. **Крупные цели** (≥150 px), простые жесты: тап, перетащить, провести, потереть, покрутить, подержать.
3. **Нет «проигрыша».** Неверно → смешная реакция (герой чихнул, суп выплеснулся…), затем ещё попытка; после 2 ошибок — подсказка
   (пульс/«ручка»). Никаких таймеров-давилок.
4. **Учим одной мыслью.** У каждого уровня одна главная идея (в спеке), объясняется действием и коротким «почему» (1–2 фразы).
5. **Безопасность.** Плиту/духовку/нож/тёрку берёт **взрослый**: перед этим сценка `k.adultHelp(...)` («Мама, можно?»). Малыш режет
   только «безопасным ножичком» (`food('knife')`, розовый). Горячее — прихваткой. Руки моем перед готовкой.
6. **Длина 1.5–3 минуты** без спешки; 3–6 «битов» (сцена → действие малыша → реакция → вывод). Финал — короткий вывод + `k.burst`.
7. Обращайтесь к малышу «Максим» изредка (не в каждой реплике). Реплики короткие (до ~90 символов, одна мысль), тёплые, с юмором.
8. **Точность фактов.** Науку/кулинарию описывайте верно и просто (см. заметки в спеках).
9. Один и тот же приём не повторяйте больше 3–4 раз подряд: чередуйте взгляд камеры/героев/реакции.

## Скелет уровня

```js
// levels/my-level.js
import { defineLevel, food } from '../lib.js'
import { kitchen } from '../deps.js'

export default defineLevel({
  id: 'my-level',
  async run(k) {
    k.kitchenBg()                              // фон кухни (плита, окно, полки); counterY=720, floorY=960
    const pyx = k.pyx({ x: 280 })              // Пых в поварском колпаке, слева на столешнице
    const busya = k.guest('busya', 1420, k.layout.floorY, { size: 270, face: 'left' })
    await k.tell(pyx, 'hello', 'wave')         // реплика e.kx-my-level.hello  (текст в lines/my-level.js)
    ...
    await k.tell(pyx, 'bye', 'cheer'); k.burst(800, 420, 14)
  },
})
```

```js
// lines/my-level.js  — только данные, без импортов
export default {
  ns: 'e.kx-my-level',
  lines: {
    hello: { who: 'pyx', text: 'Привет, Максим! Сегодня…' },        // text — субтитр и озвучка
    bang:  { who: 'pyx', text: 'Бам!', say: 'Бам!' },               // say — если озвучивать надо иначе, чем написано
  },
}
```
`who`: `narrator, pyx, busya, chukh, shchyok, kapa, tyuk, tarabar, hapchik, cow, hen, pig, sheep` (у chick голоса нет).
Озвучка (нейроголоса) генерируется позже по `lines/*.js`; пока её нет, работает `?fastvoice` и голос браузера.
Для TTS: числа пишите словами, «ё» ставьте, звукоподражания коротко («Бульк!», «Хрум-хрум!»). Не более 1–2 предложений.

Готовые общие реплики можно проигрывать по полному ключу (`k.line(pyx, 'e.kitchen-omelet.adult')`):
`e.kitchen-omelet.adult` «Плиту включаем только со взрослым!», `.mama` «Мама, можно включить плиту?», `.mama_ok` «Мама рядом. Можно!»,
`.q_knob` «Максим, нажми на ручку плиты!», `.fire` «Огонёк! Сковородка греется.», `.off` «Готово! Выключаем плиту.», `.yum` «Ммм! Вкусно!»,
`.sizzle` «Шшш! Жарится!», `.bubbles` «Смотри, Максим, пузырьки!», `.calm` «Тише-тише, давай вместе!»;
счёт `t.numbers.n_1…n_10` («Раз! Два! … Десять!»); похвала `c.pyx.praise1…8`, ободрение `c.pyx.retry1…4` (то же для busya/chukh/shchyok/kapa/tyuk…).

## Контекст уровня `k`

`k` наследует контекст эпизода + кухонные помощники. Всё, что создаёт `k.to/from/fromTo/timeline/after/every/on/tap`,
автоматически убирается при выходе из уровня.

### Из эпизода (уже есть)
| | |
|---|---|
| `k.cast(charId, x, y, {size,z,face})` | поставить героя; (x,y) — точка «ног». Возвращает героя: `.el`, `.emote(name)`, `.face('left'/'right')`, `.moveTo({x,y})`, `.lookAt(pt/null)`, `.setMouth(0..1)`, `.id`. Жесты `emote`: `wave jump happy cheer think sad surprised laugh nod shake dance spin bow point special` |
| `k.prop(html, cx, cy, w, h, {z, cls})` | добавить HTML/SVG-элемент в мир (центр cx,cy). z: фон 0, плита 4, предметы 5–9, герои 10–11, интерфейс 60+ |
| `k.bg(svgHtml)` | свой фон (вместо `kitchenBg`) |
| `k.line(char\|null, fullKey, emote?)` | сказать реплику; `char=null` — «за кадром» |
| `k.play(tween)` | `await k.play(k.gsap.to(...))` — ждать конца твина |
| `k.to/from/fromTo/set/timeline` | gsap-твины, привязанные к уровню |
| `k.wait(ms)`, `k.after(ms,fn)`, `k.every(ms,fn)→stop` | таймеры |
| `k.on(el,'pointerdown',fn)`, `k.tap(el,fn)` | события (снимаются сами) |
| `k.camera({x,y,scale},sec)` | наезд камеры на мир |
| `k.tapOn(el,{prompt,host})` | ждать тапа по элементу (с подсказкой-ручкой) |
| `k.dragTo(el,targetEl,{prompt,host})` | перетащить один предмет в цель |
| `k.choice({prompt,host,skill,options:[{id,art,color,correct,outcome}]})` | **выбор карточкой** (лоток карточек снизу). Неверные варианты: `outcome` → смешная сценка, карточка гаснет, выбор повторяется. Верный (`correct:true`) → `outcome` и конец. Используйте `k.choose` (ниже) |
| `k.task({subjects:['numbers'|'letters'|'colors'|'shapes'|'math'|'logic']})` | всплывающая обучающая задачка из основной игры (по настройкам родителей); не чаще 1 раза за уровень, по желанию |
| `k.say(key,char)`, `k.setRepeat(fn\|null)`, `k.onExit(fn)`, `k.alive`, `k.go(route)`, `k.world`, `k.root`, `k.stage` | прочее |

### Добавлено kx (lib.js)
| | |
|---|---|
| `k.kitchenBg()` | фон кухни с анимацией; `k.layout = {counterY:720, floorY:960}` |
| `k.bgTable({wall,dot,cloth,cloth2})` | фон «обеденный стол» (скатерть в клетку, стол на y≈600) |
| `k.pyx({x,y,size,hat})` | Пых-повар (по умолчанию x=330, на столешнице). `k.host` — он же |
| `k.guest(id, x, y, {size,face})` | герой (по умолчанию size 260) |
| `k.food(name, cx, cy, w, {z,args})` | спрайт еды/посуды по имени из `food.js`; высота по пропорции |
| `k.tell(char, id, emote?)` | реплика своего уровня `e.kx-<id>.<id>`. Полный ключ (`e.…`, `t.…`, `c.…`) тоже принимается |
| `k.narrate(id)`, `k.tellAll(char,[ids])`, `k.has(id)` | закадровая реплика / несколько / есть ли |
| `k.sayNumber(n, char?)` | «Раз! Два!…» (1–10) |
| `k.praise(char?)`, `k.oops(char?)` | похвала (звёздочки+фраза) / ободрение |
| `k.choose(opts)` | как `k.choice`, но с тест-крючком — **использовать его** |
| `k.tapOnEl(el, opts)` | как `k.tapOn`, с тест-крючком — **использовать его** |
| `k.stove()` | живая плита: `{el, burner(i), knob(i), knobEl(i), on(i), off(i)}`; `k.onBurner(prop,i,w,h)` ставит кастрюлю на конфорку |
| `k.adultHelp({knob, host})` | сценка «мама разрешила» + нажатие на ручку `knob` (обычно `st.knobEl(0)`) |
| `k.stepsBar(['🥒','🔪',…])` | полоска шагов рецепта сверху → `{set(i), done(i)}` |
| `k.badge(text,cx,cy,{size})`, `k.bubble(html,cx,cy,{w,h,font,tail})` | значок с числом / облачко с эмодзи |
| `k.meter({x,y,w,zones:[{from,to,color,face}],value})` | горизонтальная шкала → `{set(v), value, zoneOf(v), remove()}` |
| `k.popIn(els)`, `k.burst(x,y,n)`, `k.sparkle(x,y,n)`, `k.sfx(name)` | эффекты. `k.sfx`: `chop swing crunch sizzle pour sprinkle stir scrub ding tick yum yuck flip popcorn sneeze grate bloop clonk` + звуки игры `tap pop plop bubble squeak correct wrong boing whoosh swish slide sparkle star coin magic fanfare tada splash drum thud page` |
| `k.centerOf(el)`, `k.rectOf(el)`, `k.rand(a,b)`, `k.pick(arr)`, `k.shuffle(arr)`, `k.gsap` | утилиты |

### Заметки и подводные камни
* `k.fx` — эффекты игры: `k.fx.pulse(el,color)→stop()` (кольцо-подсказка), `k.fx.hand(from,to?)→{stop()}` (ручка), `k.fx.wiggle(el)`.
* `k.badge/k.bubble` возвращают элемент — убирайте сами (`el.remove()` / gsap fade). `k.popIn(els)` анимирует scale до 1 — для масштабированных предметов делайте свой `fromTo`.
* Любой `k.prop`/`k.food` ловит касания, даже с opacity:0: декорациям ставьте `pointer-events:none`, нажимаемое не размещайте вплотную к герою (его квадрат size×size перехватывает тапы).
* `k.dnd`: `until(placed)` считает только верно поставленные; `homeOnWrong:false` — не возвращать предмет домой автоматически (`onWrong` вызывается уже после старта возврата).
* `k.choose`: SVG-арт карточек оборачивается в квадрат автоматически; без `correct:true` завершается после первого выбора («предсказание»).
* Эмоции героев (`k.tell(char,id,emote)`, `char.emote`) выполняются строго по очереди (в ожидании держится не больше одной), после серии позиция корня сбрасывается — герой не «сползает» и не улетает.

### Жесты (gesture.js) — все возвращают Promise и сами подсказывают «ручкой» через ~7 с
* `k.tapN(el, n, {prompt,host,onTap(i)})` — n тапов по элементу.
* `k.tapAll(els, {onTap(el,i,left)})` — тапнуть каждый из элементов (лопнуть пузыри, собрать зёрна).
* `k.scrub(el, {need:900, onProgress(p), sfx:'scrub'|'grate'|…})` — тереть пальцем по элементу (мыло, тёрка, губка). `need` — длина пути в px.
* `k.stir(center, {radius, turns, onProgress(p)})` — крутить пальцем по кругу (мешать суп/тесто).
* `k.shake(el, {count, amp, axis})` — таскать туда-сюда (встряхнуть банку/сковороду).
* `k.hold(el, {duration, goal:[lo,hi], onLevel(p), onOver(), onRelease})` — держать палец (наливать). Без `goal` — до полного; с `goal` — надо отпустить в диапазоне (мерный стакан); перелив → `onOver`.
* `k.dnd({items:[{el,id,…}], zones:[{el,id,…}], accept(item,zone), onCorrect(item,zone), onWrong(item,zone,tries), prompt, host})` — перетаскивание в зоны. Элементы позиционируйте через `left/top` (`k.prop`/`k.food`), не через transform.
* `k.sequence({steps:[{id,art,color}], onPlace(step,i), onWrong(step,expected), prompt, host})` — нажимать карточки-шаги по порядку (рецепт: «сначала, потом, потом»). `art` — HTML/SVG.
* Свои жесты: `G.track(k, {x,y,w,h}, {down(p), move(p,prev), up(p)})` (`import { G } from '../lib.js'`), плюс `G.idleHint`, `G.wiggleHand`, `G.rectOf`, `G.centerOf`.

### Нарезка (cut.js)
* `k.cutLinear({food:'cucumber', el, at:{x,y}, width, mode:'slices'|'split', cuts:[0.2,0.4,…], count, tol, slice:'cucumberSlice', sliceW, plate:{x,y}, plateStep, onCut(i,info), onMiss(n), evaluate(frac,cutsSoFar)→true|{ok:false,reason}, onBad(frac,reason), prompt, host})`
  Малыш проводит «ножом» через продукт вертикальным взмахом. С `cuts` (доли 0..1) — режем по пунктиру; без — свободно `count` раз.
  `mode:'slices'` — каждый срез отлетает кружочком на тарелку (`info.slice.el`), в конце остаётся «хвостик» (`res.tail`).
  `mode:'split'` — куски остаются и раздвигаются (половинки/четвертинки/ломтики хлеба). Результат `{cuts, pieces:[{a,b,el}], misses, clear()}`.
  Подготовьте `el = k.food(name, x, y, w)` заранее (анимируйте появление сами) и передайте в `el`.
* `k.cutRound({el|html, at, size, angles:[90,0,45,135], lines, tolDeg, onCut, snap})` — круглая нарезка через центр (пицца, торт): сектора разъезжаются. Результат `{angles, sectors, el}`.

### Еда и посуда (food.js) — `k.food(name, …)` / `food(name)` (SVG-строка) / `SIZE[name]=[w,h]`
Овощи: `cucumber carrot tomato onion potato broccoli pepper garlic dill mushroom corn cabbage` · фрукты: `apple banana orange lemon strawberry grapes pear watermelon` ·
продукты: `bread breadSlice cheese cheeseSlice sausage sausageSlice butter milk flour saltShaker sugarJar oil honey yogurt egg pasta rice oats saltPinch pizzaBase sauceBowl` ·
посуда/инструменты: `board paw knife(детский) bigKnife(настоящий) peeler grater rollingPin ladle spatula colander cookieCutter('star'|'heart'|'circle'|'triangle'|'square') soap sponge hourglass germ(цвет) towel apron chefHat cup plate2 fork spoon napkin` ·
срезы: `cucumberSlice carrotSlice tomatoSlice onionRing potatoSlice appleHalf orangeSegment lemonSlice strawberryHalf bananaSlice`.
Кухонные предметы игры (`import { kitchen } from '../deps.js'`, возвращают SVG-строки, `kitchen.sizes` — размеры): `stove({on})`, `kettle({water,boiling})`,
`pot({lid,boiling,soup})` 300×230, `pan({egg:'raw'|'cooked',sizzle})` 400×170, `bowl({contents:'eggs'|'whisked'})` 260×160, `whisk()`, `spoonMetal({hot})`, `spoonWood()`,
`mitt()`, `eggWhole()`, `eggCracked()`, `plate()` 260×90, `omelet()`, `teaCup()`, `glass(level,color)`, `juiceJug(color)`, `fridge({freezerOpen,fridgeOpen})` 360×640,
`iceMold({state})`, `popsicle(state,color)`, `steam()`, `heatWaves()`, `droplets(n)`, `bubbles()`, `sunSill()`, `hammer()`, `sandBucket()`.

Нужен предмет, которого нет? Нарисуйте в своём файле через `art.js` (`svg, P, L, F, E, C, R, HL, SH, S, rounded, capsule, circlePath, star, mix, darker, lighter`):
контур `INK=#3B2F4F` ~5px, плоская заливка, «тень» полумесяцем (`S(path, base, shade)`), белый блик `HL`. Смотрите `food.js` как образец. Галерея: `#/dev/kxfood/1…4`.

### Правила размещения на сцене 1600×1000
* Не занимайте левый верхний угол (кнопка «домой», до x≈140,y≈140) и правый верхний (кнопка «ухо», x≥1460,y≤140). Внизу по центру — субтитры (y≥940).
* Полоска шагов `k.stepsBar` занимает y≈20–110 по центру. Шкалу `k.meter` ставьте ниже (y≈175).
* Фон-кухня: стол/столешница y=720, пол y=960; окно по центру (x≈800,y≈250); полки слева/справа наверху; плита x 600–1040, y 420–720.
  Карточки-выбор (`k.choose`) занимают низ y≈700–960 — держите там пусто.
* Герои-гости: справа на полу `k.guest(id, 1400, 960)` или на столешнице `(x, 720)`.

## Тестирование (обязательно)

Автопрогон: каждый ваш жест регистрирует «решатель», поэтому уровень проходит сам:
```
node tools/qa/run-level.mjs <id> [--real] [--shots=3000,9000] [--timeout=150]
```
Печатает `{"done":true,...}` и складывает скриншоты `<id>-<мс>.png` в текущую папку (`done:true` = дошли до церемонии, ошибок консоли нет).
Обязательно:
1. Прогон без ошибок (`done:true`, `errs:[]`).
2. **Посмотрите скриншоты** (Read по png): нет наложений, предметы в кадре, ничего не закрывает кнопки/субтитры, выглядит как остальная игра.
3. Реальные жесты хотя бы для одного «своего» взаимодействия: `tools/qa/gesture-example.mjs` (мышью проводит/тащит/жмёт по координатам сцены, viewport 1600×1000 = масштаб 1).
4. Уровень не должен «зависать»: у каждого ожидания есть подсказка и тест-решатель (используйте примитивы из тулкита; если делаете свой жест — зарегистрируйте `const end = k.waiting('kind', () => {...; return true})` и вызовите `end()` по завершении).

## Итог агента
В конце ответьте кратко: какие уровни готовы, что проверено, какие проблемы тулкита обнаружены (если есть), что стоит доработать.
