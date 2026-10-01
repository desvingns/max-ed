import{chessCard as __cc}from"./chess-parents.js";import{t as e}from"./audio-BEkH9VRF.js";import{r as t}from"./progress-CNOIQz2A.js";import{i as n,n as r,r as i,s as a}from"./index-rPMhTJWI.js";import{n as o,r as s,c as KXC}from"./world-gbmiJKlw.js";import{a as c,o as l}from"./input-BwoVuMYO.js";import{t as u}from"./tasks-q0UV7dz4.js";import{i as d,n as f,t as p}from"./colors-CStn8u1x.js";import{t as m}from"./letters-CkUtiWA0.js";import{r as h,t as g}from"./shapes-CPA369eN.js";var _=[{id:`progress`,icon:`📊`,label:`Прогресс`},{id:`time`,icon:`⏱️`,label:`Время`},{id:`settings`,icon:`⚙️`,label:`Настройки`},{id:`data`,icon:`💾`,label:`Данные`},{id:`help`,icon:`💡`,label:`Как играть`}],v=`progress`,y=e=>String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]),b=e=>!!e&&typeof e==`object`&&!Array.isArray(e),x=(e,t=0)=>typeof e==`number`&&Number.isFinite(e)?e:t;function S(e,t){let n=Math.abs(e)%100,r=n%10;return n>10&&n<20?t[2]:r>1&&r<5?t[1]:r===1?t[0]:t[2]}var C=e=>String(e).padStart(2,`0`),w=e=>`${e.getFullYear()}-${C(e.getMonth()+1)}-${C(e.getDate())}`;function T(e){if(e<=0)return`0 мин`;let t=Math.round(e/60);if(t<1)return`меньше минуты`;if(t<60)return`${t} мин`;let n=Math.floor(t/60),r=t%60;return r?`${n} ч ${r} мин`:`${n} ч`}function E(e){if(!e)return`—`;let t=new Date(e),n=new Date;if(w(t)===w(n))return`сегодня`;let r=new Date(n);return r.setDate(r.getDate()-1),w(t)===w(r)?`вчера`:t.toLocaleDateString(`ru-RU`,{day:`numeric`,month:`short`})}var D={none:`ещё не встречалось`,learning:`учит`,knows:`знает`};function O(e){return!e||e.seen<=0?`none`:e.correct>=3&&e.correct/e.seen>=.7?`knows`:`learning`}function k(...e){let n;for(let r of e){let e=t.data.skills[r];e&&(n={seen:(n?.seen??0)+x(e.seen),correct:(n?.correct??0)+x(e.correct)})}return n}function A(e,t){return!t||!t.seen?`${e}: ещё не встречалось`:`${e}: показов ${t.seen}, верно ${t.correct} (${Math.round(t.correct/t.seen*100)}%) — ${D[O(t)]}`}function j(e,t,n,r=``){let i=O(t),a=t&&t.seen?`${t.correct}/${t.seen}`:`—`;return`<div class="pc-cell m-${i}" title="${y(n)}">
    ${i===`knows`?`<span class="pc-tick" aria-label="знает">✓</span>`:``}
    <div class="pc-cell-main">${e}</div>
    ${r?`<div class="pc-cell-sub">${r}</div>`:``}
    <div class="pc-cell-cap">${a}</div>
  </div>`}var M=()=>`<div class="pc-legend">
  <span><i class="m-none"></i>ещё не встречалось</span>
  <span><i class="m-learning"></i>учит</span>
  <span><i class="m-knows">✓</i>знает <small>(≥ 3 верных и ≥ 70%)</small></span>
  <span class="pc-legend-note">в клетке: верно / всего</span>
</div>`;function N(e){let r=[],a=new Set,s=e===`game`?/^\/game\/([^/]+)/:/^\/ep\/([^/]+)/;for(let e of [...o,...KXC])for(let t of e.activities){let n=s.exec(t.route);n&&!a.has(n[1])&&(a.add(n[1]),r.push({id:n[1],title:t.title,place:e.title,color:e.color,icon:t.icon}))}let c=e===`game`?[...n(),...Object.keys(t.data.games).filter(e=>!e.includes(`:`))]:[...i(),...t.data.cartoonsSeen];for(let e of c)a.has(e)||(a.add(e),r.push({id:e,title:e,place:`—`,color:`#B8C0CC`,icon:``}));return r}var P={letters:{icon:`🔤`,label:`Буквы`},numbers:{icon:`🔢`,label:`Цифры`},math:{icon:`➕`,label:`Счёт (+ и −)`},colors:{icon:`🎨`,label:`Цвета`},shapes:{icon:`🔺`,label:`Фигуры`},logic:{icon:`🧩`,label:`Логика`}},F=e=>P[e]??{icon:`📝`,label:e},I=e=>t.game(`task:${e}`).level,L={math:`Счёт (+ и −)`,logic:`Логика`,count:`Счёт предметов`,syllable:`Слоги`,sound:`Звуки`,size:`Размеры`,music:`Музыка`,habit:`Привычки`,compare:`Сравнение`,pattern:`Узоры`},R=[`letter`,`number`,`color`,`shape`,`mix`,`chess`],z=`
.pc { position:absolute; inset:0; overflow:hidden; background:#FFF8EC; color:#3B2F4F; font-family:var(--font); font-weight:700; font-size:24px; line-height:1.35; }
.pc *, .pc *::before, .pc *::after { box-sizing:border-box; }
.pc button { font:inherit; color:inherit; border:none; background:none; cursor:pointer; touch-action:manipulation; }
.pc .emoji { font-family:var(--emoji); font-weight:400; }
.pc small { font-size:0.8em; }
.pc-muted { color:#857A93; }

/* decorative blobs */
.pc-deco { position:absolute; border-radius:50%; pointer-events:none; }

/* ---------- gate ---------- */
.pc-gate { position:absolute; inset:0; display:grid; place-items:center; }
.pc-gate-card { position:relative; width:820px; padding:56px 60px 48px; border-radius:48px; background:#fff; text-align:center;
  box-shadow:0 14px 0 rgba(59,47,79,.07), 0 24px 60px rgba(59,47,79,.08); border:3px solid #F4E7D2; }
.pc-gate-kicker { display:inline-flex; align-items:center; gap:12px; padding:10px 24px; border-radius:999px; background:#FFF1D6; color:#9A5B00; font-weight:900; font-size:24px; letter-spacing:.02em; }
.pc-gate-q { margin:28px 0 36px; font-size:56px; font-weight:900; line-height:1.15; }
.pc-gate-q b { color:#4A86E8; white-space:nowrap; }
.pc-gate-answers { display:flex; justify-content:center; gap:32px; }
.pc-gate-answers button { width:200px; height:140px; border-radius:36px; background:#FFF8EC; font-size:64px; font-weight:900;
  box-shadow:0 8px 0 #F0DFC2, inset 0 0 0 4px #F4E7D2; transition:transform .12s, box-shadow .12s; }
.pc-gate-answers button:hover { background:#FFF1D6; }
.pc-gate-answers button:active { transform:translateY(5px); box-shadow:0 3px 0 #F0DFC2, inset 0 0 0 4px #F4E7D2; }
.pc-gate-note { margin-top:36px; font-size:22px; color:#857A93; }
.pc-gate-pyx { position:absolute; }

/* ---------- header ---------- */
.pc-main { position:absolute; inset:0; }
.pc-head { position:absolute; left:152px; right:40px; top:26px; height:104px; display:flex; align-items:center; gap:20px; }
.pc-title { flex:1; min-width:0; }
.pc-title h1 { margin:0; font-size:40px; line-height:1.05; font-weight:900; white-space:nowrap; }
.pc-title p { margin:6px 0 0; font-size:20px; color:#857A93; white-space:nowrap; }
.pc-tabs { flex:none; display:flex; gap:6px; padding:7px; border-radius:999px; background:#F5E8D2; }
.pc-tab { height:64px; padding:0 20px; border-radius:999px; display:flex; align-items:center; gap:8px; font-size:22px; font-weight:900; color:#6E5F7E; white-space:nowrap; transition:background .15s, color .15s; }
.pc-tab .emoji { font-size:24px; }
.pc-tab:hover { color:#3B2F4F; }
.pc-tab.on { background:#fff; color:#3B2F4F; box-shadow:0 4px 0 rgba(59,47,79,.08); }

/* ---------- scrollable panel ---------- */
.pc-panel { position:absolute; left:32px; right:24px; top:146px; bottom:0; overflow-y:auto; overflow-x:hidden; padding:8px 16px 56px 8px;
  touch-action:pan-y; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; scrollbar-width:thin; scrollbar-color:#E6D3B3 transparent; }
.pc-panel::-webkit-scrollbar { width:14px; }
.pc-panel::-webkit-scrollbar-thumb { background:#E6D3B3; border-radius:99px; border:3px solid #FFF8EC; }
.pc-panel::-webkit-scrollbar-track { background:transparent; }
.pc-fade { position:absolute; left:32px; right:40px; top:146px; height:26px; background:linear-gradient(#FFF8EC, rgba(255,248,236,0)); pointer-events:none; z-index:2; }

.pc-card { background:#fff; border-radius:32px; padding:28px 32px 30px; margin-bottom:24px; border:2px solid #F4E7D2; box-shadow:0 6px 0 rgba(59,47,79,.04); min-width:0; }
.pc-card-head { display:flex; align-items:baseline; justify-content:space-between; gap:20px; flex-wrap:wrap; margin-bottom:18px; }
.pc-card h2 { margin:0; font-size:30px; font-weight:900; line-height:1.15; }
.pc-card h2 .emoji { margin-right:10px; }
.pc-card h3 { margin:0 0 10px; font-size:24px; font-weight:900; }
.pc-card p { margin:0 0 14px; }
.pc-lead { color:#6E5F7E; font-size:22px; }
.pc-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:0 24px; align-items:start; }
.pc-col { display:flex; flex-direction:column; min-width:0; }

/* stat tiles */
.pc-stats { display:grid; grid-template-columns:repeat(5, 1fr); gap:20px; margin-bottom:24px; }
.pc-stat { background:#fff; border-radius:28px; border:2px solid #F4E7D2; padding:20px 22px; display:flex; align-items:center; gap:16px; min-width:0; }
.pc-stat .emoji { font-size:46px; flex:none; }
.pc-stat b { display:block; font-size:40px; font-weight:900; line-height:1; white-space:nowrap; }
.pc-stat b small { font-size:22px; color:#857A93; font-weight:700; }
.pc-stat span.l { display:block; margin-top:6px; font-size:19px; color:#857A93; line-height:1.2; }
.pc-stats.cols4 { grid-template-columns:repeat(4, 1fr); }

/* legend */
.pc-legend { display:flex; flex-wrap:wrap; gap:8px 22px; font-size:19px; color:#6E5F7E; align-items:center; }
.pc-legend span { display:inline-flex; align-items:center; gap:8px; }
.pc-legend i { width:26px; height:26px; border-radius:8px; display:inline-grid; place-items:center; font-style:normal; font-size:16px; font-weight:900; color:#fff; }
.pc-legend-note { color:#A198AC; }
.pc-legend i.m-none { background:#F7F2EA; border:2px solid #E9DFCF; }
.pc-legend i.m-learning { background:#FFF1C2; border:2px solid #F5C842; }
.pc-legend i.m-knows { background:#4FB35C; border:2px solid #4FB35C; }

/* mastery cells */
.pc-cells { display:grid; gap:12px; }
.pc-letters { grid-template-columns:repeat(11, 1fr); }
.pc-cells.cols6 { grid-template-columns:repeat(6, 1fr); }
.pc-cells.cols4 { grid-template-columns:repeat(4, 1fr); }
.pc-cell { position:relative; border-radius:20px; padding:10px 4px 8px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; min-height:108px; border:3px solid transparent; }
.pc-cell-main { font-size:50px; font-weight:900; line-height:1; display:grid; place-items:center; min-height:54px; }
.pc-cell-sub { font-size:17px; line-height:1.1; text-align:center; }
.pc-cell-cap { font-size:17px; line-height:1.1; color:#857A93; }
.pc-cell.m-none { background:#F9F5EE; border-color:#EFE6D7; }
.pc-cell.m-none .pc-cell-main { color:#BDB3C6; }
.pc-cell.m-none .pc-cell-main svg, .pc-cell.m-none .pc-swatch { opacity:.55; }
.pc-cell.m-learning { background:#FFF4CF; border-color:#F5C842; }
.pc-cell.m-knows { background:#E3F6DE; border-color:#6CC46F; }
.pc-tick { position:absolute; right:6px; top:6px; width:26px; height:26px; border-radius:50%; background:#4FB35C; color:#fff; font-size:16px; font-weight:900; display:grid; place-items:center; }
.pc-swatch { width:50px; height:50px; border-radius:50%; border:3px solid rgba(59,47,79,.18); display:block; }

/* mixes */
.pc-mixes { display:flex; flex-direction:column; gap:10px; }
.pc-mix { display:flex; align-items:center; gap:10px; padding:8px 14px; border-radius:18px; border:3px solid transparent; }
.pc-mix .pc-swatch { width:40px; height:40px; flex:none; }
.pc-mix .op { font-weight:900; color:#857A93; width:16px; text-align:center; }
.pc-mix .nm { flex:1; min-width:0; font-size:20px; margin-left:8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pc-mix .st { font-size:18px; color:#6E5F7E; white-space:nowrap; }
.pc-mix.m-none { background:#F9F5EE; border-color:#EFE6D7; }
.pc-mix.m-none .pc-swatch { opacity:.6; }
.pc-mix.m-learning { background:#FFF4CF; border-color:#F5C842; }
.pc-mix.m-knows { background:#E3F6DE; border-color:#6CC46F; }

/* tables */
.pc-table { width:100%; border-collapse:separate; border-spacing:0; font-size:21px; }
.pc-table th { text-align:left; font-size:18px; color:#857A93; font-weight:700; padding:0 12px 10px; border-bottom:2px solid #F4E7D2; white-space:nowrap; }
.pc-table td { padding:12px; border-bottom:2px solid #F8F0E3; vertical-align:middle; }
.pc-table tr:last-child td { border-bottom:none; }
.pc-table td.n, .pc-table th.n { text-align:center; }
.pc-table .dim { color:#B3A9BD; }
.pc-game { display:flex; align-items:center; gap:14px; font-weight:900; }
.pc-game .ic { width:48px; height:48px; border-radius:14px; display:grid; place-items:center; flex:none; font-size:28px; }
.pc-game .ic .emoji { font-size:28px; }
.pc-place { display:inline-flex; align-items:center; gap:8px; color:#6E5F7E; font-size:19px; }
.pc-place i { width:12px; height:12px; border-radius:50%; flex:none; }
.pc-stars { letter-spacing:2px; font-size:24px; white-space:nowrap; }
.pc-stars .on { color:#FFB938; }
.pc-stars .off { color:#EADFCC; }

/* simple lists */
.pc-list { list-style:none; margin:0; padding:0; }
.pc-list li { display:flex; align-items:center; gap:14px; padding:12px 0; border-bottom:2px solid #F8F0E3; }
.pc-list li:last-child { border-bottom:none; }
.pc-list .grow { flex:1; min-width:0; }
.pc-list .ic { font-size:30px; width:40px; text-align:center; flex:none; }
.pc-pill { display:inline-flex; align-items:center; gap:6px; padding:4px 14px; border-radius:999px; font-size:18px; font-weight:900; white-space:nowrap; }
.pc-pill.ok { background:#E3F6DE; color:#2F7A38; }
.pc-pill.no { background:#F5EFE6; color:#9C92A8; }
.pc-pill.warn { background:#FFF1D6; color:#9A5B00; }
.pc-dots { display:inline-flex; gap:6px; }
.pc-dots i { width:16px; height:16px; border-radius:50%; background:#EFE6D7; }
.pc-dots i.on { background:#4A86E8; }

/* ---------- time chart ---------- */
.pc-chart { position:relative; }
.pc-chart svg { display:block; width:100%; height:auto; overflow:visible; }
.pc-chart .hit { fill:transparent; cursor:default; }
.pc-chart text { pointer-events:none; }
.pc-chart .hit:hover + .bar, .pc-chart .col.hover .bar { fill:#2F6FD6; }
.pc-tip { position:absolute; left:0; top:0; pointer-events:none; background:#3B2F4F; color:#fff; padding:10px 16px; border-radius:14px; font-size:19px; line-height:1.3;
  white-space:nowrap; transform:translate(-50%, calc(-100% - 12px)); opacity:0; transition:opacity .12s; z-index:3; }
.pc-tip.on { opacity:1; }
.pc-tip b { font-size:22px; }
.pc-details { margin-top:18px; }
.pc-details summary { cursor:pointer; color:#4A86E8; font-weight:900; font-size:20px; list-style:none; }
.pc-details summary::-webkit-details-marker { display:none; }
.pc-details summary::before { content:'▸ '; }
.pc-details[open] summary::before { content:'▾ '; }
.pc-details .pc-table { margin-top:12px; }

/* ---------- controls ---------- */
.pc-row { display:flex; align-items:center; gap:18px; padding:14px 0; border-bottom:2px solid #F8F0E3; }
.pc-row:last-child { border-bottom:none; }
.pc-row .lbl { flex:1; min-width:0; }
.pc-row .lbl b { display:block; font-weight:900; }
.pc-row .lbl small { display:block; color:#857A93; font-size:18px; line-height:1.25; margin-top:2px; }
label.pc-row { cursor:pointer; }

.pc-vol { display:grid; grid-template-columns:200px 1fr 76px; align-items:center; gap:18px; padding:8px 0; }
.pc-vol .v { text-align:right; font-weight:900; color:#6E5F7E; font-variant-numeric:tabular-nums; }
.pc input[type=range] { -webkit-appearance:none; appearance:none; width:100%; height:48px; margin:0; background:transparent; cursor:pointer; --p:50%; touch-action:none; }
.pc input[type=range]:focus { outline:none; }
.pc input[type=range]::-webkit-slider-runnable-track { height:14px; border-radius:99px; background:linear-gradient(to right, #FFB938 var(--p), #F1E4CF var(--p)); }
.pc input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:42px; height:42px; margin-top:-14px; border-radius:50%; background:#fff; border:7px solid #FFB938; box-shadow:0 3px 8px rgba(59,47,79,.2); }
.pc input[type=range]:focus-visible::-webkit-slider-thumb { border-color:#4A86E8; }
.pc input[type=range]::-moz-range-track { height:14px; border-radius:99px; background:#F1E4CF; }
.pc input[type=range]::-moz-range-progress { height:14px; border-radius:99px; background:#FFB938; }
.pc input[type=range]::-moz-range-thumb { width:30px; height:30px; border-radius:50%; background:#fff; border:7px solid #FFB938; box-shadow:0 3px 8px rgba(59,47,79,.2); }

.pc-switch { position:relative; width:84px; height:48px; flex:none; }
.pc-switch input { position:absolute; inset:0; width:100%; height:100%; margin:0; opacity:0; cursor:pointer; z-index:1; }
.pc-knob { position:absolute; inset:0; border-radius:99px; background:#E4D8C6; transition:background .2s; }
.pc-knob::after { content:''; position:absolute; left:5px; top:5px; width:38px; height:38px; border-radius:50%; background:#fff; box-shadow:0 2px 6px rgba(59,47,79,.25); transition:transform .2s; }
.pc-switch input:checked + .pc-knob { background:#5DBB63; }
.pc-switch input:checked + .pc-knob::after { transform:translateX(36px); }
.pc-switch input:focus-visible + .pc-knob { outline:3px solid #4A86E8; outline-offset:3px; }

.pc-chips { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.pc-chip { position:relative; display:block; cursor:pointer; }
.pc-chip input { position:absolute; opacity:0; width:1px; height:1px; }
.pc-chip-body { display:flex; align-items:center; gap:12px; padding:14px 16px; border-radius:20px; border:3px solid #EFE6D7; background:#F9F5EE; color:#9C92A8; transition:all .15s; min-height:84px; }
.pc-chip-body .emoji { font-size:32px; flex:none; filter:grayscale(1); opacity:.6; }
.pc-chip-body .t { flex:1; min-width:0; line-height:1.2; }
.pc-chip-body .t b { display:block; font-weight:900; font-size:22px; }
.pc-chip-body .t small { display:block; font-size:17px; }
.pc-chip-body .box { width:34px; height:34px; border-radius:10px; border:3px solid #DCCFBC; background:#fff; flex:none; display:grid; place-items:center; color:#fff; font-weight:900; font-size:20px; }
.pc-chip input:checked + .pc-chip-body { background:#fff; border-color:#8CCF83; color:#3B2F4F; }
.pc-chip input:checked + .pc-chip-body .emoji { filter:none; opacity:1; }
.pc-chip input:checked + .pc-chip-body .box { background:#5DBB63; border-color:#5DBB63; }
.pc-chip input:checked + .pc-chip-body .box::after { content:'✓'; }
.pc-chip input:focus-visible + .pc-chip-body { outline:3px solid #4A86E8; outline-offset:2px; }
.pc-chip-body .pc-dots i { width:12px; height:12px; }

.pc-seg { display:grid; grid-template-columns:1.5fr repeat(4, 1fr); gap:10px; }
.pc-seg label { position:relative; cursor:pointer; min-width:0; }
.pc-seg input { position:absolute; opacity:0; width:1px; height:1px; }
.pc-seg span { display:flex; align-items:center; justify-content:center; width:100%; height:64px; padding:0 10px; border-radius:18px; font-size:22px; white-space:nowrap; border:3px solid #EFE6D7; background:#F9F5EE; font-weight:900; color:#6E5F7E; transition:all .15s; }
.pc-seg input:checked + span { background:#FFB938; border-color:#FFB938; color:#3B2F4F; box-shadow:0 4px 0 #E09A1A; }
.pc-seg input:focus-visible + span { outline:3px solid #4A86E8; outline-offset:2px; }

.pc-region-dot { width:22px; height:22px; border-radius:50%; flex:none; border:3px solid rgba(255,255,255,.9); box-shadow:0 0 0 2px rgba(59,47,79,.12); }

.pc-btn { display:inline-flex; align-items:center; justify-content:center; gap:10px; height:64px; padding:0 28px; border-radius:20px; font-weight:900; font-size:23px;
  background:#FFB938; color:#3B2F4F; box-shadow:0 5px 0 #E09A1A; transition:transform .1s, box-shadow .1s; white-space:nowrap; }
.pc-btn:active { transform:translateY(3px); box-shadow:0 2px 0 #E09A1A; }
.pc-btn.ghost { background:#fff; box-shadow:0 5px 0 #EADCC5, inset 0 0 0 3px #EADCC5; }
.pc-btn.ghost:active { box-shadow:0 2px 0 #EADCC5, inset 0 0 0 3px #EADCC5; }
.pc-btn.blue { background:#4A86E8; color:#fff; box-shadow:0 5px 0 #2F63B8; }
.pc-btn.blue:active { box-shadow:0 2px 0 #2F63B8; }
.pc-btn.danger { background:#F05454; color:#fff; box-shadow:0 5px 0 #B93434; }
.pc-btn.danger:active { box-shadow:0 2px 0 #B93434; }
.pc-btn.soft-danger { background:#fff; color:#C83B3B; box-shadow:0 5px 0 #F3C9C9, inset 0 0 0 3px #F3C9C9; }
.pc-btn .emoji { font-size:26px; }
.pc-btns { display:flex; flex-wrap:wrap; gap:14px; margin-top:8px; }
.pc-small-btn { height:52px; padding:0 20px; font-size:20px; border-radius:16px; }

.pc-confirm { margin-top:18px; padding:22px 24px; border-radius:24px; background:#FFF0F0; border:3px solid #F7C4C4; }
.pc-confirm.info { background:#EEF5FF; border-color:#C5DBFA; }
.pc-confirm p { margin:0 0 14px; }
.pc-msg { margin-top:14px; font-size:20px; min-height:1px; }
.pc-msg.err { color:#C83B3B; }
.pc-msg.ok { color:#2F7A38; }

/* ---------- help ---------- */
.pc-help { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:16px; }
.pc-help li { display:flex; gap:20px; align-items:flex-start; padding:20px 24px; border-radius:24px; background:#FFF8EC; }
.pc-help .emoji { font-size:44px; line-height:1; flex:none; width:56px; text-align:center; }
.pc-help b { display:block; font-size:25px; font-weight:900; margin-bottom:2px; }
.pc-help span.t { color:#5E5070; }

/* toast */
.pc-toast { position:absolute; left:50%; bottom:40px; transform:translateX(-50%); background:#3B2F4F; color:#fff; padding:16px 30px; border-radius:20px; font-size:23px; font-weight:900; opacity:0; pointer-events:none; z-index:10; white-space:nowrap; box-shadow:0 10px 30px rgba(59,47,79,.25); }
`;function B(){let e=t.data,n=N(`game`),r=N(`ep`),i=Object.entries(e.games).filter(([e])=>!e.includes(`:`)).reduce((e,[,t])=>e+x(t.plays),0),a=m.filter(e=>O(k(`letter:${e.ch}`))===`knows`).length,o=r.filter(t=>e.cartoonsSeen.includes(t.id)).length,c=`<div class="pc-stats">
    ${H(`⭐`,`${x(e.totalStars)}`,`${S(x(e.totalStars),[`звезда`,`звезды`,`звёзд`])} собрано`)}
    ${H(`📒`,`${e.stickers.length}<small> / ${s.length}</small>`,`наклеек в альбоме`)}
    ${H(`🎮`,`${i}`,`${S(i,[`игра сыграна`,`игры сыграно`,`игр сыграно`])}`)}
    ${H(`🎬`,`${o}<small> / ${r.length}</small>`,`мультиков и историй`)}
    ${H(`🔤`,`${a}<small> / ${m.length}</small>`,`${S(a,[`буква знакома`,`буквы знакомы`,`букв знакомо`])}`)}
  </div>`,l=m.map(e=>{let t=k(`letter:${e.ch}`);return j(y(e.ch),t,A(`Буква ${e.ch} (${e.name})`,t))}).join(``),_=Array.from({length:11},(e,t)=>{let n=k(`number:${t}`);return j(String(t),n,A(`Цифра ${t}`,n))}).join(``),v=p.map(e=>{let t=k(`color:${e.id}`);return j(`<span class="pc-swatch" style="background:${e.hex}"></span>`,t,A(V(e.name),t),y(e.name))}).join(``),b=g.map((e,t)=>{let n=k(`shape:${e.id}`),r=[`#FF5A5F`,`#FF9F43`,`#FFD93D`,`#6BCB77`,`#62C6FF`,`#4D96FF`,`#9B6BFF`,`#FF8FC8`];return j(h(e.id,r[t%r.length],50),n,A(V(e.name),n),y(e.name))}).join(``),C=f.map(e=>{let t=k(`mix:${e.a}+${e.b}`,`mix:${e.b}+${e.a}`),n=d(e.a),r=d(e.b),i=d(e.out),a=O(t);return`<div class="pc-mix m-${a}" title="${y(A(V(`${n.name} + ${r.name} = ${i.name}`),t))}">
      <span class="pc-swatch" style="background:${n.hex}"></span><span class="op">+</span>
      <span class="pc-swatch" style="background:${r.hex}"></span><span class="op">=</span>
      <span class="pc-swatch" style="background:${i.hex}"></span>
      <span class="nm">${y(i.name)}</span>
      <span class="st">${a===`none`?`ещё нет`:`${D[a]} · ${t.correct}/${t.seen}`}</span>
    </div>`}).join(``),w=n.map(e=>{let n=t.game(e.id),r=x(n.plays)>0,i=[0,1,2].map(e=>`<span class="${e<x(n.bestStars)?`on`:`off`}">★</span>`).join(``);return`<tr>
      <td><div class="pc-game"><span class="ic" style="background:${y(e.color)}22">${e.icon||`🎲`}</span>${y(e.title)}</div></td>
      <td><span class="pc-place"><i style="background:${y(e.color)}"></i>${y(e.place)}</span></td>
      <td class="n ${r?``:`dim`}">${x(n.plays)}</td>
      <td class="n">${r?`<span class="pc-stars">${i}</span>`:`<span class="dim">—</span>`}</td>
      <td class="n ${r?``:`dim`}">${r?x(n.level)+1:`—`}</td>
      <td class="${r?``:`dim`}">${E(x(n.lastPlayed))}</td>
    </tr>`}).join(``),T=r.map(t=>{let n=e.cartoonsSeen.includes(t.id);return`<li><span class="ic">${t.icon||`🎬`}</span><span class="grow">${y(t.title)}</span>
      <span class="pc-pill ${n?`ok`:`no`}">${n?`✓ смотрел`:`ещё нет`}</span></li>`}).join(``),P=t.data.taskSubjects,z=u.map(e=>{let t=F(e),n=I(e),r=!P.length||P.includes(e),i=Array.from({length:5},(e,t)=>`<i class="${t<=n?`on`:``}"></i>`).join(``);return`<li><span class="ic emoji">${t.icon}</span><span class="grow">${y(t.label)}${r?``:` <span class="pc-pill no">выключено</span>`}</span>
      <span class="pc-dots" title="уровень ${n+1} из 5">${i}</span>
      <span class="pc-muted" style="width:110px;text-align:right;font-size:19px">ур. ${n+1} из 5</span></li>`}).join(``),B=new Map;for(let[t,n]of Object.entries(e.skills)){let e=t.split(`:`)[0];if(R.includes(e))continue;let r=B.get(e)??{items:0,seen:0,correct:0,knows:0};r.items++,r.seen+=x(n.seen),r.correct+=x(n.correct),O(n)===`knows`&&r.knows++,B.set(e,r)}let W=B.size?`<section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">🧠</span>Другие навыки</h2></div>
        <ul class="pc-list">${[...B.entries()].map(([e,t])=>`<li><span class="grow"><b>${y(L[e]??e)}</b>
          <span class="pc-muted" style="font-size:19px"> · ${t.items} ${S(t.items,[`задание`,`задания`,`заданий`])}, знает ${t.knows}</span></span>
          <span class="pc-pill ${t.seen&&t.correct/t.seen>=.7?`ok`:`warn`}">${t.seen?Math.round(t.correct/t.seen*100):0}% верно</span></li>`).join(``)}</ul></section>`:``;return`${c}
  <section class="pc-card">
    <div class="pc-card-head"><h2><span class="emoji">🔤</span>Буквы</h2>${M()}</div>
    <div class="pc-cells pc-letters">${l}</div>
  </section>
  <div class="pc-grid2">
    <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">🔢</span>Цифры 0–10</h2></div><div class="pc-cells cols6">${_}</div></section>
    <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">🎨</span>Цвета</h2></div><div class="pc-cells cols6">${v}</div></section>
  </div>
  <div class="pc-grid2">
    <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">🔺</span>Фигуры</h2></div><div class="pc-cells cols4">${b}</div></section>
    <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">🖌️</span>Смешивание красок</h2></div><div class="pc-mixes">${C}</div></section>
  </div>
  ${__cc(j,M,y)}
  <section class="pc-card">
    <div class="pc-card-head"><h2><span class="emoji">🎮</span>Игры</h2><span class="pc-muted" style="font-size:19px">уровень сложности подстраивается сам</span></div>
    <table class="pc-table"><thead><tr><th>Игра</th><th>Место</th><th class="n">Сыграно</th><th class="n">Лучший результат</th><th class="n">Уровень</th><th>Последний раз</th></tr></thead>
    <tbody>${w||`<tr><td colspan="6" class="dim">Пока нет игр.</td></tr>`}</tbody></table>
  </section>
  <div class="pc-grid2">
    <div class="pc-col">
      ${U()}
      <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">🧩</span>Задачки</h2><span class="pc-muted" style="font-size:19px">уровень растёт сам</span></div>
        <ul class="pc-list">${z}</ul></section>
    </div>
    <div class="pc-col">
      <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">🎬</span>Мультики и истории</h2></div>
        <ul class="pc-list">${T||`<li class="dim">Пока нет мультиков.</li>`}</ul></section>
      ${W}
    </div>
  </div>`}var V=e=>e.charAt(0).toUpperCase()+e.slice(1);function H(e,t,n){return`<div class="pc-stat"><span class="emoji">${e}</span><div><b>${t}</b><span class="l">${n}</span></div></div>`}function U(){let e=t.module(`farm`,null),n=`<div class="pc-card-head"><h2><span class="emoji">🐄</span>Ферма</h2></div>`;if(!b(e))return`<section class="pc-card">${n}<p class="pc-lead">Максим ещё не был на ферме.</p></section>`;let r=b(e.inventory)?e.inventory:{},i=Array.isArray(e.animals)?e.animals.length:0,a={milk:[`🥛`,`Молоко`],egg:[`🥚`,`Яйца`],wool:[`🧶`,`Шерсть`]},o=Object.entries(r).map(([e,t])=>{let[n,r]=a[e]??[`📦`,e];return`<li><span class="ic emoji">${n}</span><span class="grow">${y(r)}</span><b>${x(t)}</b></li>`}).join(``);return`<section class="pc-card">${n}
    <ul class="pc-list">
      <li><span class="ic emoji">🌾</span><span class="grow">Покормил зверей</span><b>${x(e.totalFeeds)} ${S(x(e.totalFeeds),[`раз`,`раза`,`раз`])}</b></li>
      <li><span class="ic emoji">🐾</span><span class="grow">Жителей на ферме</span><b>${i}</b></li>
      ${o}
      ${e.ordersDone===void 0?``:`<li><span class="ic emoji">📦</span><span class="grow">Выполнено заказов</span><b>${x(e.ordersDone)}</b></li>`}
    </ul></section>`}var W=[`вс`,`пн`,`вт`,`ср`,`чт`,`пт`,`сб`],G=1400,K=430;function q(e){let n=[];for(let r=e-1;r>=0;r--){let e=new Date;e.setHours(12,0,0,0),e.setDate(e.getDate()-r);let i=w(e);n.push({date:e,key:i,sec:x(t.data.playtime[i])})}return n}function J(){let e=q(14),n=x(t.data.settings.dailyLimit),r=e[e.length-1],i=e.slice(-7).reduce((e,t)=>e+t.sec,0),a=e.filter(e=>e.sec>0),o=a.length?a.reduce((e,t)=>e+t.sec,0)/a.length:0,s=Object.values(t.data.playtime).reduce((e,t)=>e+x(t),0),c=`<div class="pc-stats cols4">
    ${H(`☀️`,T(r.sec),n?`сегодня (лимит ${n} мин)`:`сегодня`)}
    ${H(`📅`,T(i),`за последние 7 дней`)}
    ${H(`⚖️`,T(o),`в среднем в игровой день`)}
    ${H(`🏝️`,T(s),`всего на острове`)}
  </div>`,l=e.map(e=>e.sec/60),u=Math.max(5,n,...l),d=[1,2,5,10,15,20,30,60,90,120,180].find(e=>Math.ceil(u/e)<=5)??240,f=Math.ceil(u/d)*d,p=n>0?96:16,m=(1328-p)/e.length,h=Math.min(56,m*.6),g=e=>352-e/f*318,_=``;for(let e=0;e<=f+1e-6;e+=d)_+=`<line x1="72" x2="${G-p}" y1="${g(e)}" y2="${g(e)}" stroke="${e===0?`#D9CBB4`:`#F1E7D8`}" stroke-width="${e===0?2:1.5}"/>`,_+=`<text x="58" y="${g(e)+7}" text-anchor="end" font-size="19" fill="#857A93">${e}</text>`;_+=`<text x="58" y="20" text-anchor="end" font-size="17" fill="#A198AC">мин</text>`;let v=l.indexOf(Math.max(...l));if(e.forEach((t,n)=>{let r=72+m*n+m/2,i=l[n],a=n===e.length-1,o=Math.max(0,i/f*318),s=r-h/2,c=352-o,u=Math.min(4,o),d=o>.5?`<path class="bar" d="M${s} 352 V${c+u} Q${s} ${c} ${s+u} ${c} H${s+h-u} Q${s+h} ${c} ${s+h} ${c+u} V352 Z" fill="#4A86E8"/>`:`<rect class="bar" x="${s}" y="349" width="${h}" height="3" rx="1.5" fill="#E3D6C2"/>`;_+=`<g class="col" data-i="${n}" data-x="${r}" data-y="${o>.5?c:349}">
      <rect class="hit" x="${72+m*n}" y="34" width="${m}" height="396"/>${d}</g>`,(a||n===v&&i>0)&&t.sec>0&&(_+=`<text x="${r}" y="${c-10}" text-anchor="middle" font-size="20" font-weight="900" fill="#3B2F4F">${Math.max(1,Math.round(i))}</text>`);let p=W[t.date.getDay()],g=t.date.getDay()===0||t.date.getDay()===6;_+=`<text x="${r}" y="384" text-anchor="middle" font-size="20" font-weight="900" fill="${a?`#3B2F4F`:g?`#C0772A`:`#6E5F7E`}">${a?`сегодня`:p}</text>`,_+=`<text x="${r}" y="410" text-anchor="middle" font-size="17" fill="#A198AC">${t.date.getDate()}.${C(t.date.getMonth()+1)}</text>`}),n>0){let e=g(n);_+=`<line x1="72" x2="${G-p}" y1="${e}" y2="${e}" stroke="#E0564F" stroke-width="2.5" stroke-dasharray="10 8"/>`,_+=`<text x="${G-p+12}" y="${e-4}" font-size="18" font-weight="900" fill="#B8433D">лимит</text>`,_+=`<text x="${G-p+12}" y="${e+18}" font-size="18" font-weight="900" fill="#B8433D">${n} мин</text>`}let y=[...e].reverse().map(e=>`<tr><td>${e.key===r.key?`сегодня`:`${W[e.date.getDay()]}, ${e.date.getDate()}.${C(e.date.getMonth()+1)}`}</td><td class="n">${T(e.sec)}</td></tr>`).join(``);return`${c}
  <section class="pc-card">
    <div class="pc-card-head"><h2><span class="emoji">⏱️</span>Время в игре за 14 дней</h2><span class="pc-muted" style="font-size:19px">наведите или нажмите на столбик</span></div>
    <div class="pc-chart" data-chart>
      <svg viewBox="0 0 ${G} ${K}" role="img" aria-label="Минуты игры по дням за последние 14 дней">${_}</svg>
      <div class="pc-tip"></div>
    </div>
    <details class="pc-details"><summary>Показать таблицей</summary>
      <table class="pc-table"><thead><tr><th>День</th><th class="n">Время</th></tr></thead><tbody>${y}</tbody></table>
    </details>
  </section>
  <section class="pc-card"><p class="pc-lead" style="margin:0">Время считается, только пока игра открыта на экране. Дневной лимит можно поставить во вкладке «Настройки».</p></section>`}var Y=[{key:`master`,label:`Общая`},{key:`music`,label:`Музыка`},{key:`sfx`,label:`Звуки`},{key:`voice`,label:`Голос героев`}],X=[0,10,15,20,30];function Z(){let e=t.data.settings,n=Y.map(t=>{let n=Math.round(x(e[t.key])*100);return`<div class="pc-vol"><b>${t.label}</b>
      <input type="range" min="0" max="100" step="5" value="${n}" data-vol="${t.key}" style="--p:${n}%" aria-label="${t.label}">
      <span class="v" data-volv="${t.key}">${n}%</span></div>`}).join(``),r=t.data.taskSubjects,i=u.map(e=>{let t=F(e),n=!r.length||r.includes(e),i=I(e);return`<label class="pc-chip"><input type="checkbox" data-subject="${e}" ${n?`checked`:``}>
      <span class="pc-chip-body"><span class="emoji">${t.icon}</span>
        <span class="t"><b>${y(t.label)}</b><small>уровень ${i+1} из 5</small></span>
        <span class="box"></span></span></label>`}).join(``),a=e.disabledRegions??[],s=o.map(e=>`<label class="pc-row"><span class="pc-region-dot" style="background:${y(e.color)}"></span>
      <span class="lbl"><b>${y(e.title)}</b><small>${Q(e.id)}</small></span>
      <span class="pc-switch"><input type="checkbox" data-region="${y(e.id)}" ${a.includes(e.id)?``:`checked`} aria-label="${y(e.title)}"><span class="pc-knob"></span></span></label>`).join(``),c=x(e.dailyLimit),l=X.map(e=>`<label><input type="radio" name="pc-limit" value="${e}" data-limit ${e===c?`checked`:``}><span>${e?`${e} мин`:`Без лимита`}</span></label>`).join(``),d=x(t.data.playtime[w(new Date)]);return`<div class="pc-grid2">
    <div class="pc-col">
      <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">🔊</span>Громкость</h2></div>
        ${n}
        <div class="pc-btns"><button class="pc-btn ghost pc-small-btn" data-act="test-sfx"><span class="emoji">🔔</span>Проверить звук</button>
        <button class="pc-btn ghost pc-small-btn" data-act="test-voice"><span class="emoji">🐉</span>Проверить голос</button></div>
      </section>
      <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">💬</span>Субтитры</h2></div>
        <label class="pc-row"><span class="lbl"><b>Показывать текст реплик</b><small>Для взрослых: внизу экрана появляется то, что говорят герои.</small></span>
          <span class="pc-switch"><input type="checkbox" data-setting="subtitles" ${e.subtitles?`checked`:``} aria-label="Субтитры"><span class="pc-knob"></span></span></label>
      </section>
      <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">⏳</span>Дневной лимит</h2></div>
        <p class="pc-lead">Сколько минут в день можно играть. Сегодня уже: <b style="color:#3B2F4F">${T(d)}</b>.</p>
        <div class="pc-seg" role="radiogroup" aria-label="Дневной лимит">${l}</div>
      </section>
    </div>
    <div class="pc-col">
      <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">🧩</span>Темы задачек</h2></div>
        <p class="pc-lead">Короткие задачки появляются прямо в игре — например, чтобы покормить коровок или открыть сундук. Выберите, какие темы давать.</p>
        <div class="pc-chips">${i}</div>
      </section>
      <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">🗺️</span>Места на острове</h2></div>
        <p class="pc-lead">Выключенные места не видны на карте. Прогресс в них сохраняется.</p>
        ${s}
      </section>
    </div>
  </div>`}function Q(e){let t=o.find(t=>t.id===e);if(!t)return``;let n=t.activities.filter(e=>e.route.startsWith(`/game/`)).length,r=t.activities.filter(e=>e.route.startsWith(`/ep/`)).length,i=[];return n&&i.push(`${n} ${S(n,[`игра`,`игры`,`игр`])}`),r&&i.push(`${r} ${S(r,[`история`,`истории`,`историй`])}`),!i.length&&t.route&&i.push(`отдельная сцена`),i.join(`, `)}function ee(){let e=t.data,n=new Blob([JSON.stringify(e)]).size;return`<div class="pc-grid2">
    <div class="pc-col">
      <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">📤</span>Сохранить копию</h2></div>
        <p class="pc-lead">Весь прогресс хранится только в этом браузере. Скачайте файл-копию, чтобы перенести игру на другое устройство или не потерять её.</p>
        <p class="pc-muted" style="font-size:19px">Сейчас: ${x(e.totalStars)} ${S(x(e.totalStars),[`звезда`,`звезды`,`звёзд`])}, ${e.stickers.length} ${S(e.stickers.length,[`наклейка`,`наклейки`,`наклеек`])}, ${(n/1024).toFixed(1)} КБ.</p>
        <div class="pc-btns"><button class="pc-btn blue" data-act="export"><span class="emoji">⬇️</span>Скачать прогресс</button></div>
      </section>
      <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">📥</span>Загрузить из файла</h2></div>
        <p class="pc-lead">Выберите файл, который вы скачали раньше. Текущий прогресс будет заменён.</p>
        <input type="file" accept="application/json,.json" data-file hidden>
        <div class="pc-btns"><button class="pc-btn ghost" data-act="import"><span class="emoji">📂</span>Выбрать файл…</button></div>
        <div data-import-zone></div>
      </section>
    </div>
    <div class="pc-col">
      <section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">🧹</span>Начать заново</h2></div>
        <p class="pc-lead">Сброс удалит звёзды, наклейки, ферму, статистику и настройки. Отменить это нельзя — сначала лучше скачать копию.</p>
        <div data-reset-zone>${$()}</div>
      </section>
    </div>
  </div>`}var $=()=>`<div class="pc-btns"><button class="pc-btn soft-danger" data-act="reset1"><span class="emoji">🗑️</span>Сбросить прогресс…</button></div>`,te=()=>`<div class="pc-confirm"><p><b>Точно сбросить весь прогресс?</b><br>Максим начнёт игру с самого начала.</p>
  <div class="pc-btns"><button class="pc-btn ghost" data-act="reset-cancel">Отмена</button>
  <button class="pc-btn danger" data-act="reset2">Да, сбросить всё</button></div></div>`;function ne(){return`<section class="pc-card"><div class="pc-card-head"><h2><span class="emoji">💡</span>Как играть</h2></div>
    <ul class="pc-help">${[[`🌈`,`Проиграть нельзя`,`Нет таймеров и штрафов. На ошибку герой смешно реагирует и мягко предлагает ещё раз, а после двух промахов подсвечивает верный ответ.`],[`👂`,`Ушко повторяет вопрос`,`Круглая кнопка с ушком справа вверху заново произносит задание. Читать Максиму не нужно — всё озвучено и показано картинками.`],[`⚙️`,`Вход сюда — удержание шестерёнки`,`Маленькую шестерёнку в правом нижнем углу нужно держать 2 секунды. Ребёнок обычно просто нажимает — и ничего не происходит.`],[`🎬`,`Первый раз — вместе`,`Посмотрите вступление вместе с Максимом и расскажите, кто такие дракончик Пых и тучка Хапчик.`],[`🐄`,`Учёба внутри игры`,`Задачки на буквы, счёт, цвета и фигуры появляются, когда Максим кормит зверей или готовит. Темы можно выбрать в «Настройках».`]].map(([e,t,n])=>`<li><span class="emoji">${e}</span><div><b>${t}</b><span class="t">${n}</span></div></li>`).join(``)}</ul>
  </section>
  <section class="pc-card"><p class="pc-lead" style="margin:0">Прогресс хранится только в этом браузере. Копию можно скачать во вкладке «Данные».</p></section>`}function re(e){if(!b(e)||e.version!==1||!b(e.games)||!b(e.skills))return null;let n=e=>Array.isArray(e)?e.filter(e=>typeof e==`string`):[],r={};for(let[t,n]of Object.entries(e.games))b(n)&&(r[t]={plays:x(n.plays),bestStars:Math.max(0,Math.min(3,x(n.bestStars))),level:x(n.level),lastPlayed:x(n.lastPlayed)});let i={};for(let[t,n]of Object.entries(e.skills))b(n)&&(i[t]={seen:x(n.seen),correct:x(n.correct)});let a={};if(b(e.playtime))for(let[t,n]of Object.entries(e.playtime))typeof n==`number`&&(a[t]=n);let o={};if(b(e.album))for(let[t,n]of Object.entries(e.album))b(n)&&(o[t]={x:x(n.x),y:x(n.y),r:x(n.r),s:x(n.s,1)});let s=b(e.settings)?e.settings:{},c=(e,t)=>Math.max(0,Math.min(1,x(e,t))),l=t.data.settings;return{version:1,games:r,skills:i,stickers:n(e.stickers),album:o,cartoonsSeen:n(e.cartoonsSeen),story:n(e.story),totalStars:x(e.totalStars),settings:{master:c(s.master,l.master),music:c(s.music,l.music),sfx:c(s.sfx,l.sfx),voice:c(s.voice,l.voice),subtitles:typeof s.subtitles==`boolean`?s.subtitles:l.subtitles,dailyLimit:x(s.dailyLimit,l.dailyLimit),disabledRegions:n(s.disabledRegions)},playtime:a,modules:b(e.modules)?e.modules:{},taskSubjects:n(e.taskSubjects)}}function ie(n){t.reset();let r=t.data,{settings:i,...a}=n;Object.assign(r,a),t.setSettings(i),e.applySettings(t.data.settings)}var ae={music:`none`,backdrop:`#FFF8EC`,hud:{home:`/map`,repeat:!1},mount(n){a.showGear(!1),n.onExit(()=>a.showGear(!0));let i=document.createElement(`div`);i.className=`pc`,i.innerHTML=`<style>${z}</style>
      <div class="pc-deco" style="left:-160px;top:-200px;width:520px;height:520px;background:#FFEFD2"></div>
      <div class="pc-deco" style="right:-220px;bottom:-260px;width:640px;height:640px;background:#FDEBD5"></div>
      <div class="pc-toast"></div>`,n.root.appendChild(i);let o=i.querySelector(`.pc-toast`),s=e=>{o.textContent=e,n.fromTo(o,{opacity:0,y:20},{opacity:1,y:0,duration:.25,ease:`back.out(2)`,overwrite:!0}),n.to(o,{opacity:0,y:10,duration:.3,delay:2.2})},u=new Set;n.onExit(()=>u.forEach(e=>URL.revokeObjectURL(e)));let d={};window.__test=d,n.onExit(()=>{let e=window;e.__test===d&&delete e.__test});let f=c(11,39),p=c(6,19),m=f+p,h=l([1,2,3,9,10,11].flatMap(e=>[m+e,m-e])).filter(e=>e>9&&e!==m),g=l([m,...[...new Set(h)].slice(0,2)]),b=document.createElement(`div`);b.className=`pc-gate`,b.innerHTML=`<div class="pc-gate-card">
      <div class="pc-gate-kicker"><span class="emoji">🔒</span>Для взрослых</div>
      <div class="pc-gate-q">Сколько будет <b>${f} + ${p}</b>?</div>
      <div class="pc-gate-answers">${g.map(e=>`<button data-v="${e}">${e}</button>`).join(``)}</div>
      <div class="pc-gate-note">Здесь прогресс Максима и настройки игры.<br>Неверный ответ вернёт на карту.</div>
    </div>`,i.appendChild(b);let x=b.querySelector(`.pc-gate-card`);n.fromTo(x,{y:40,opacity:0,scale:.96},{y:0,opacity:1,scale:1,duration:.45,ease:`back.out(1.6)`});let C=null;try{C=r(`pyx`,{size:280}),C.el.classList.add(`pc-gate-pyx`),C.el.style.left=`1150px`,C.el.style.top=`640px`,b.appendChild(C.el),C.startIdle(),n.from(C.el,{x:380,duration:.6,ease:`back.out(1.4)`,delay:.2})}catch(e){console.warn(`[parents] no pyx`,e)}let E=()=>{C?.destroy(),C=null};n.onExit(E),n.after(500,()=>{b.isConnected&&n.say(`s.parents.gate`,C)});let D=!1,O=(t,r)=>{if(!D){if(t!==m){e.sfx(`boing`),n.fromTo(r,{x:-10},{x:0,duration:.4,ease:`elastic.out(1.2, 0.3)`}),D=!0,n.after(350,()=>n.go(`/map`));return}D=!0,e.sfx(`unlock`),r.style.background=`#E3F6DE`,r.style.boxShadow=`0 8px 0 #BFE6B8, inset 0 0 0 4px #6CC46F`,n.to(x,{y:-30,opacity:0,scale:.97,duration:.35,delay:.25,ease:`power2.in`}),C&&n.to(C.el,{x:420,duration:.4,delay:.15,ease:`back.in(1.4)`}),n.after(650,()=>{E(),b.remove(),P()})}};b.querySelectorAll(`.pc-gate-answers button`).forEach(e=>{n.on(e,`click`,()=>O(Number(e.dataset.v),e))}),d.solve=()=>b.querySelector(`.pc-gate-answers button[data-v="${m}"]`)?.click(),d.wrong=()=>b.querySelector(`.pc-gate-answers button:not([data-v="${m}"])`)?.click();let k=null,A=null,j=v,M=null,N=e=>{if(!k||!A)return;j=e,v=e,M=null,A.querySelectorAll(`.pc-tab`).forEach(t=>{let n=t.dataset.tab===e;t.classList.toggle(`on`,n),t.setAttribute(`aria-selected`,String(n))});let t=e===`progress`?B():e===`time`?J():e===`settings`?Z():e===`data`?ee():ne();k.innerHTML=t,k.scrollTop=0,n.fromTo(k.children,{opacity:0,y:14},{opacity:1,y:0,duration:.3,stagger:.03,ease:`power2.out`,clearProps:`transform`})};d.tab=e=>N(e),d.scroll=e=>{k&&(k.scrollTop=e)};function P(){let t=document.createElement(`div`);t.className=`pc-main`,t.innerHTML=`
        <div class="pc-head">
          <div class="pc-title"><h1>Уголок родителей</h1><p>Прогресс Максима, время и настройки</p></div>
          <div class="pc-tabs" role="tablist">${_.map(e=>`<button class="pc-tab" role="tab" data-tab="${e.id}"><span class="emoji">${e.icon}</span>${e.label}</button>`).join(``)}</div>
        </div>
        <div class="pc-panel" role="tabpanel"></div>
        <div class="pc-fade"></div>`,i.insertBefore(t,o),k=t.querySelector(`.pc-panel`),A=t.querySelector(`.pc-tabs`),n.from(t.querySelector(`.pc-head`),{y:-30,opacity:0,duration:.4,ease:`power2.out`}),n.on(A,`click`,t=>{let n=t.target.closest(`[data-tab]`);n&&n.dataset.tab!==j&&(e.sfx(`click`,{vol:.5}),N(n.dataset.tab))}),F(k),N(j)}function F(r){n.on(r,`click`,i=>{let a=i.target.closest(`[data-act]`);if(a)switch(a.dataset.act){case`test-sfx`:e.sfx(`sparkle`);break;case`test-voice`:n.say(`s.parents.voice_test`);break;case`export`:R();break;case`import`:r.querySelector(`[data-file]`)?.click();break;case`import-cancel`:M=null,I(r,`[data-import-zone]`,``);break;case`import-ok`:M&&(ie(M),M=null,e.sfx(`tada`,{vol:.6}),s(`Прогресс загружен ✓`),N(`data`));break;case`reset1`:I(r,`[data-reset-zone]`,te());break;case`reset-cancel`:I(r,`[data-reset-zone]`,$());break;case`reset2`:t.reset(),e.applySettings(t.data.settings),s(`Прогресс сброшен`),N(`data`)}}),n.on(r,`input`,n=>{let i=n.target,a=i.dataset.vol;if(!a)return;let o=Number(i.value);i.style.setProperty(`--p`,`${o}%`);let s=r.querySelector(`[data-volv="${a}"]`);s&&(s.textContent=`${o}%`),t.setSettings({[a]:o/100}),e.applySettings({[a]:o/100})}),n.on(r,`change`,i=>{let a=i.target,o=a.dataset;if(o.vol){o.vol===`voice`?n.say(`s.parents.voice_test`):o.vol!==`music`&&e.sfx(`pop`);return}if(o.setting===`subtitles`){t.setSettings({subtitles:a.checked}),s(a.checked?`Субтитры включены`:`Субтитры выключены`);return}if(o.subject!==void 0){let e=[...r.querySelectorAll(`[data-subject]`)],n=e.filter(e=>e.checked).map(e=>e.dataset.subject);if(!n.length){a.checked=!0,s(`Нужна хотя бы одна тема`);return}t.setTaskSubjects(n.length===e.length?[]:n);return}if(o.region!==void 0){let e=[...r.querySelectorAll(`[data-region]`)];if(!e.some(e=>e.checked)){a.checked=!0,s(`Хотя бы одно место должно остаться`);return}t.setSettings({disabledRegions:e.filter(e=>!e.checked).map(e=>e.dataset.region)});return}if(o.limit!==void 0){t.setSettings({dailyLimit:Number(a.value)}),s(Number(a.value)?`Лимит: ${a.value} мин в день`:`Без лимита`);return}if(o.file!==void 0){let e=a.files?.[0];a.value=``,e&&L(r,e)}});let i=e=>{let t=e.target.closest?.(`.col`),n=e.target.closest?.(`[data-chart]`);if(!n)return;let r=n.querySelector(`.pc-tip`);if(n.querySelectorAll(`.col.hover`).forEach(e=>e.classList.remove(`hover`)),!t){r.classList.remove(`on`);return}t.classList.add(`hover`);let i=q(14),a=i[Number(t.dataset.i)];if(!a)return;let o=n.clientWidth/G;r.style.left=`${Number(t.dataset.x)*o}px`,r.style.top=`${Number(t.dataset.y)*o}px`,r.innerHTML=`${y(V(Number(t.dataset.i)===i.length-1?`Сегодня`:a.date.toLocaleDateString(`ru-RU`,{weekday:`long`,day:`numeric`,month:`long`})))}<br><b>${T(a.sec)}</b>`,r.classList.add(`on`)};n.on(r,`pointerover`,i),n.on(r,`pointerdown`,i),n.on(r,`pointerout`,e=>{let t=e.target.closest?.(`[data-chart]`),n=e.relatedTarget;!t||n&&t.contains(n)||(t.querySelector(`.pc-tip`)?.classList.remove(`on`),t.querySelectorAll(`.col.hover`).forEach(e=>e.classList.remove(`hover`)))})}function I(e,t,r){let i=e.querySelector(t);i&&(i.innerHTML=r,i.firstElementChild&&n.fromTo(i.firstElementChild,{opacity:0,y:10},{opacity:1,y:0,duration:.25}))}async function L(t,r){let i=null;try{i=re(JSON.parse(await r.text()))}catch{i=null}if(!n.alive)return;if(!i){I(t,`[data-import-zone]`,`<div class="pc-msg err">Не получилось прочитать файл «${y(r.name)}». Нужен файл, скачанный кнопкой «Скачать прогресс».</div>`),e.sfx(`wrong`,{vol:.5});return}M=i;let a=Object.keys(i.playtime).length;I(t,`[data-import-zone]`,`<div class="pc-confirm info">
        <p><b>${y(r.name)}</b><br>${i.totalStars} ${S(i.totalStars,[`звезда`,`звезды`,`звёзд`])}, ${i.stickers.length} ${S(i.stickers.length,[`наклейка`,`наклейки`,`наклеек`])}, ${a} ${S(a,[`игровой день`,`игровых дня`,`игровых дней`])}.<br>Заменить текущий прогресс этим файлом?</p>
        <div class="pc-btns"><button class="pc-btn ghost" data-act="import-cancel">Отмена</button>
        <button class="pc-btn blue" data-act="import-ok">Заменить</button></div></div>`)}function R(){let e={...t.data,_app:`maxed`,_exported:new Date().toISOString()},r=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),i=URL.createObjectURL(r);u.add(i);let a=document.createElement(`a`);a.href=i,a.download=`maksim-progress-${w(new Date)}.json`,document.body.appendChild(a),a.click(),a.remove(),n.after(5e3,()=>{URL.revokeObjectURL(i),u.delete(i)}),s(`Файл сохранён в «Загрузки»`)}}};export{ae as default};