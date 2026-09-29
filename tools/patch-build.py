#!/usr/bin/env python3
"""Подключает kx-уровни (site/assets/kx/**) к собранной игре.

В репозитории лежит только production-сборка Vite (исходников нет), поэтому новые
уровни подключаются точечными правками минифицированных чанков. Скрипт идемпотентен:
повторный запуск ничего не ломает.

Если игру пересоберут из исходников — хэши имён чанков поменяются: тогда править нужно
site/assets/kx/deps.js и якоря ниже.
"""
import json, re, sys, time
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"
A = SITE / "assets"


def find(prefix):
    m = sorted(A.glob(f"{prefix}-*.js"))
    m = [p for p in m if re.fullmatch(prefix + r"-[\w-]{8}\.js", p.name)]
    if len(m) != 1:
        sys.exit(f"ожидался один чанк {prefix}-*.js, найдено: {m}")
    return m[0]


def patch(path, pairs, marker):
    s = path.read_text(encoding="utf-8")
    if marker in s:
        print(f"= {path.name}: уже пропатчен")
        return
    for old, new in pairs:
        if old not in s:
            sys.exit(f"{path.name}: не найден якорь: {old[:90]!r}")
        s = s.replace(old, new, 1)
    path.write_text(s, encoding="utf-8")
    print(f"+ {path.name}")


# ── world: кухня показывает главы, стикеры, экспорт глав ─────────────────────
world = find("world")
s = world.read_text(encoding="utf-8")
m = re.search(r"activities:\[\{route:`/ep/kitchen-kettle`.*?Омлет \(нагрев меняет яйцо\)`\}\]", s, re.S)
if not m and "kx/registry.js" not in s:
    sys.exit("world: не найден блок activities кухни")
patch(
    world,
    [
        (m.group(0) if m else "", "activities:KXA"),
        ("var e=4400,", 'import{chapters as KXC,kitchenActivities as KXA,stickers as KXS}from"./kx/registry.js";var e=4400,'),
        ("function i(e){return n.find", "r.push(...KXS);function i(e){return n.find"),
        ("export{i,n,r,e as t}", "export{i,n,r,e as t,KXC as c}"),
    ] if m else [],
    "kx/registry.js",
)

# ── land: главы как «регионы» ────────────────────────────────────────────────
land = find("land")
patch(
    land,
    [
        ('import{n as a}from"./world-gbmiJKlw.js"', 'import{n as a,c as KXC}from"./world-gbmiJKlw.js"'),
        ('import{n as r,o as i}from"./index-rPMhTJWI.js"', 'import{n as r,o as i,s as KXH}from"./index-rPMhTJWI.js"'),
        ("async function x(a,o){let s=d(o.id),p=f[s];", "async function x(a,o){o.parent&&KXH.configure({home:`/land/${o.parent}`,repeat:!0});let s=d(o.id),p=f[s];"),
        ("S.innerHTML=u(o.id,{grey:p,", "S.innerHTML=u(o.bg??o.id,{grey:p,"),
        ("let t=a.find(t=>t.id===e.params[0])", "let t=[...a,...KXC].find(t=>t.id===e.params[0])"),
    ],
    "KXC",
)

# ── voice: реплики kx ────────────────────────────────────────────────────────
voice = find("voice")
patch(
    voice,
    [
        ('import{t as e}from"./audio-BEkH9VRF.js";', 'import{t as e}from"./audio-BEkH9VRF.js";import KXV from"./kx/lines/index.js";'),
        (
            "function mt(){",
            "for(let t of KXV)if(t?.ns&&t.lines)for(let[e,n]of Object.entries(t.lines))Z[`${t.ns}.${e}`]=n;function mt(){",
        ),
    ],
    "kx/lines/index.js",
)

# ── album: главы — отдельные разделы альбома ─────────────────────────────────
album = find("album")
patch(
    album,
    [
        ('import{n as c,r as l}from"./world-gbmiJKlw.js"', 'import{n as c,r as l,c as KXC}from"./world-gbmiJKlw.js"'),
        ("function le(){let e=[],t=new Set;for(let n of c){", "function le(){let e=[],t=new Set;for(let n of [...c,...KXC]){"),
    ],
    "KXC",
)

# ── parents: уровни глав в списке прогресса ──────────────────────────────────
parents = find("parents")
patch(
    parents,
    [
        ('import{n as o,r as s}from"./world-gbmiJKlw.js"', 'import{n as o,r as s,c as KXC}from"./world-gbmiJKlw.js"'),
        ("for(let e of o)for(let t of e.activities){let n=s.exec(t.route)", "for(let e of [...o,...KXC])for(let t of e.activities){let n=s.exec(t.route)"),
    ],
    "KXC",
)

# ── index: маршруты /ep/<kx-уровень>, список эпизодов, dev-страницы ──────────
index = find("index")
patch(
    index,
    [
        (
            "var f,p,m,h,g=null,_=null;",
            'import{levelIds as KXI}from"./kx/registry.js";var KXL=e=>KXI.includes(e)?()=>L(()=>import(`./kx/levels/${e}.js`),[],import.meta.url):null;var f,p,m,h,g=null,_=null;',
        ),
        ("t===`ep`?{loader:V[`../episodes/${n[0]}/index.ts`]??null,", "t===`ep`?{loader:V[`../episodes/${n[0]}/index.ts`]??KXL(n[0]),"),
        ("te=()=>Object.keys(V).map(e=>e.split(`/`)[2])", "te=()=>[...Object.keys(V).map(e=>e.split(`/`)[2]),...KXI]"),
        (
            '"../dev/kitchenprops.ts":',
            '"../dev/kxfood.ts":()=>L(()=>import(`./kx/dev/food.js`),[],import.meta.url),"../dev/kxplay.ts":()=>L(()=>import(`./kx/dev/play.js`),[],import.meta.url),"../dev/kitchenprops.ts":',
        ),
    ],
    "kx/registry.js",
)


# ── land: звёзды глав (доля пройденных уровней) и раскладка порталов пониже ──────
patch(
    land,
    [
        (
            "function _(e){let t=/^\\/(game|ep)\\/([^/]+)/.exec(e.route);",
            "function _(e){/*kxstars*/let c=/^\\/land\\/(kx-[\\w-]+)/.exec(e.route);if(c){let h=KXC.find(x=>x.id===c[1]);if(h){let s=h.levels.filter(l=>n.data.cartoonsSeen.includes(l.id)).length,tt=h.levels.length;return s?s>=tt?3:s>=tt/2?2:1:0}}let t=/^\\/(game|ep)\\/([^/]+)/.exec(e.route);",
        ),
        ("y:r%2?690:770,d:n", "y:r%2?715:795,d:n"),
    ],
    "kxstars",
)

# ── старые кухонные эпизоды возвращают в главу «Чудеса кухни» ────────────────
for pref, ident in (("kitchen-kettle", "kitchen-kettle"), ("kitchen-freezer", "kitchen-freezer"), ("kitchen-omelet", "kitchen-omelet")):
    f = find(pref)
    patch(f, [(f"id:`{ident}`,kind:`science`,region:`kitchen`,", f"id:`{ident}`,kind:`science`,region:`kitchen`,next:`/land/kx-science`,")], "kx-science")

# ── service worker / precache ────────────────────────────────────────────────
def build_precache():
    files = ["./", "index.html", "manifest.webmanifest"]
    for sub in ("icons", "pics", "assets", "voice"):
        for p in sorted((SITE / sub).rglob("*")):
            if p.is_file() and p.name != "manifest.json" and not p.name.startswith("."):
                files.append(p.relative_to(SITE).as_posix())
    return files


old = json.loads((SITE / "precache.json").read_text(encoding="utf-8"))
new = build_precache()
# порядок и состав как в оригинале + новые файлы; voice/manifest.json не в списке, как и раньше
extra = [f for f in new if f not in old]
if extra:
    (SITE / "precache.json").write_text(json.dumps(old + extra, ensure_ascii=False), encoding="utf-8")
    print(f"+ precache.json: +{len(extra)} файлов")
sw = SITE / "sw.js"
t = sw.read_text(encoding="utf-8")
t2 = re.sub(r"const VERSION = 'v\d+'", f"const VERSION = 'v{int(time.time() * 1000)}'", t)
if t2 != t:
    sw.write_text(t2, encoding="utf-8")
    print("+ sw.js: новая VERSION")
