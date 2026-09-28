import{i as e,r as t,t as n}from"./index-rPMhTJWI.js";var r={backdrop:`#2b2d42`,music:`none`,mount(r){let i=(e,t)=>`<h2>${e}</h2><div class="dv-row">${t.map(([e,t])=>`<a href="#${t}">${e}</a>`).join(``)}</div>`;r.root.innerHTML=`<div class="dv">
      <h1>Dev gallery</h1>
      ${i(`Scenes`,[[`title`,`/`],[`map`,`/map`],[`album`,`/album`],[`cinema`,`/cinema`],[`parents`,`/parents`]])}
      ${i(`Characters`,n().map(e=>[e,`/dev/char/${e}`]))}
      ${i(`Line-up`,[[`all characters`,`/dev/lineup`]])}
      ${i(`Games`,e().map(e=>[e,`/game/${e}`]))}
      ${i(`Episodes`,t().map(e=>[e,`/ep/${e}`]))}
      ${i(`Tasks`,[[`random task`,`/dev/task`]])}
    </div>
    <style>
      .dv{position:absolute;inset:0;padding:40px 60px;color:#edf2f4;font-size:26px;overflow:auto}
      .dv h1{margin:0 0 10px;font-size:48px}.dv h2{margin:26px 0 10px;font-size:30px;color:#8ecae6}
      .dv-row{display:flex;flex-wrap:wrap;gap:12px}
      .dv a{color:#2b2d42;background:#edf2f4;padding:10px 18px;border-radius:14px;text-decoration:none;font-weight:700}
    </style>`}};export{r as default};