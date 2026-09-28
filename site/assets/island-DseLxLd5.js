import{n as e,t}from"./world-gbmiJKlw.js";import{c as n,s as r}from"./island-BUvAYh1Z.js";import{r as i,t as a}from"./stages-fnXBlhkS.js";var o={backdrop:`#2b2d42`,music:`none`,hud:{home:`/dev`},mount(o){let[s,c,l]=o.params,u=()=>Object.fromEntries(e.map(e=>[e.id,i(e.id)])),d=t=>t===void 0||t===`real`?u():Object.fromEntries(e.map(e=>[e.id,Number(t)])),f=e=>e===void 0||e===`real`?a().lit:Number(e),p=`<style>
      .di{position:absolute;inset:0;background:#2b2d42;color:#edf2f4;font:700 22px var(--font)}
      .di-pano{position:absolute;left:0;top:70px;width:1600px;height:${Math.round(1600/t*1e3)}px;border-radius:6px;overflow:hidden}
      .di-pano svg,.di-crop svg{width:100%;height:100%;display:block}
      .di-t{position:absolute;left:20px;top:18px}
      .di-row{position:absolute;left:0;width:1600px;display:flex;justify-content:space-around;align-items:flex-end}
      .di-cell{width:190px;text-align:center;font-size:16px;color:#8ecae6}
      .di-cell svg{width:190px;height:212px;display:block;background:#cdeeff;border-radius:14px}
      .di-grid{position:absolute;inset:0;display:grid;grid-template-columns:repeat(4,400px);grid-template-rows:repeat(2,500px);background:linear-gradient(#cdeeff 0 78%,#6CC24A 78%)}
      .di-grid svg{width:400px;height:445px;display:block;margin-top:30px}
      .di-crop{position:absolute;inset:0}
    </style>`;if(s===`lm`){let t=Number(c??3);o.root.innerHTML=p+`<div class="di-grid">${e.map(e=>`<div>${n(e.id,t)}</div>`).join(``)}</div>`;return}if(s===`crop`){let e=Number(c??0),t=r({stages:d(l),bridgeLit:f(void 0),view:[e,0,1600,1e3]});o.root.innerHTML=p+`<div class="di-crop">${t}</div>`;return}if(s===`sunrise`){let e=r({stages:u(),bridgeLit:f(void 0),time:`sunrise`,view:[c?Number(c):0,0,1600,1e3]});o.root.innerHTML=p+`<div class="di-crop">${e}</div>`;return}let m=(i,a)=>{let s=d(i),c=f(a),l=e.filter(e=>e.greyed);o.root.innerHTML=p+`<div class="di">
        <div class="di-t">Island panorama · stage=${i??`real`} · bridge=${c} · MAP_W=${t}</div>
        <div class="di-pano">${r({stages:s,bridgeLit:c})}</div>
        <div class="di-row" style="top:470px">${e.map(e=>`<div class="di-cell">${n(e.id,s[e.id]??3)}${e.id} · ${s[e.id]??3}</div>`).join(``)}</div>
        <div class="di-row" style="top:730px">${[0,1,2,3].map(e=>`<div class="di-cell">${n(l[0]?.id??`math`,e)}stage ${e}</div>`).join(``)}
          ${[0,3].map(e=>`<div class="di-cell">${n(l[3]?.id??`colors`,e)}stage ${e}</div>`).join(``)}</div>
      </div>`};m(s,c),window.__island={go:(e,t)=>m(String(e),String(t))}}};export{o as default};