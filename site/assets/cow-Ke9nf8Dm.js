import{s as e}from"./voice-DxZWGDNJ.js";import{t}from"./gsap-CvDoa17S.js";var n=e({chew:()=>z,default:()=>L}),r=`#3B2F4F`,i=`#2A2238`,a=`#FFFFFF`,o=`#E3E6EE`,s=`#5A6A9A`,c=`#5B4636`,l=`#FFB3C1`,u=`#F496AB`,d=`#B8456A`,f=`#FFF1CC`,p=`#F0D594`,m=`#5B4636`,h=`#FF5A5F`,g=`#FFD166`,_=`#F2A93B`,v=`#FF9EB1`,y=`#5A2A3A`,b=`#FF7A93`,x=`stroke="${r}" stroke-linejoin="round" stroke-linecap="round"`,S=(e,t,n,r)=>`M${e-n} ${t}a${n} ${r} 0 1 0 ${2*n} 0a${n} ${r} 0 1 0 ${-2*n} 0Z`,C=(e,t,n,r,i=.18)=>`<path fill="${s}" opacity="${i}" fill-rule="evenodd" d="M-60 -60H460V460H-60Z${S(e,t,n,r)}"/>`,w=`M74 244C86 212 142 208 190 212C232 215 262 204 292 214C324 230 324 292 306 318C290 342 246 350 182 350C114 350 62 346 52 310C46 284 58 260 74 244Z`,T=`M240 70C292 70 326 104 326 148C326 190 292 222 240 222C188 222 154 190 154 148C154 104 188 70 240 70Z`,E=S(246,212,74,46);function D(e,t,n,r,i){let s=t-64,c=e-23,l=e+23,u=`M${c} ${s}V${t-9}Q${c} ${t} ${c+9} ${t}H${l-9}Q${l} ${t} ${l} ${t-9}V${s}`,d=`M${c} ${t-17}V${t-9}Q${c} ${t} ${c+9} ${t}H${l-9}Q${l} ${t} ${l} ${t-9}V${t-17}Z`;return`<g class="${r}" data-origin="${i}">
    <path d="${u}Z" fill="${n?o:a}"/>
    ${n?``:`<path d="M${e+7} ${s}V${t-17}H${l}V${s}Z" fill="${o}"/>`}
    <path d="${d}" fill="${m}"/>
    <path d="M${c+1} ${t-17}H${l-1}" fill="none" ${x} stroke-width="5"/>
    <path d="${u}" fill="none" ${x} stroke-width="7"/>
  </g>`}function O(e,t,n,r,o,s){let c=S(n,r,o,s),l=t===`l`?-1:1,u=(e,t)=>{let i=e*Math.PI/180,a=n+l*o*Math.cos(i),c=r-s*Math.sin(i),u=a+l*t*Math.cos(i+.15),d=c-t*Math.sin(i+.15);return`M${a.toFixed(1)} ${c.toFixed(1)}L${u.toFixed(1)} ${d.toFixed(1)}`};return`<g class="c-eye" data-origin="${n} ${r}">
    <clipPath id="${e}eye${t}"><path d="${c}"/></clipPath>
    <path d="${c}" fill="${a}"/>
    <g clip-path="url(#${e}eye${t})">
      <g class="c-pupil" data-range="8">
        <ellipse cx="${n+2}" cy="${r}" rx="${o*.66}" ry="${s*.68}" fill="${i}"/>
        <circle cx="${n-4}" cy="${r-8}" r="${o*.3}" fill="${a}"/>
        <circle cx="${n+8}" cy="${r+8}" r="${o*.14}" fill="${a}"/>
      </g>
    </g>
    <path d="${c}" fill="none" ${x} stroke-width="5"/>
    <path d="${u(8,10)}${u(30,11)}${u(52,9)}" fill="none" ${x} stroke-width="4.5"/>
  </g>`}function k(e,t,n,r){let i=r===`l`?-1:1,a=e+i*n*.85;return`<path d="M${e-n*.85} ${t+6}Q${e} ${t-22} ${e+n*.85} ${t+6}M${a} ${t+2}l${i*9} -8"
    fill="none" ${x} stroke-width="7"/>`}var A={cx:208,cy:128,rx:24,ry:29},j={cx:274,cy:126,rx:22,ry:27};function M(e){return`
<defs>
  <clipPath id="${e}body"><path d="${w}"/></clipPath>
  <clipPath id="${e}skull"><path d="${T}"/></clipPath>
  <clipPath id="${e}muz"><path d="${E}"/></clipPath>
</defs>
<ellipse class="c-shadow" cx="192" cy="385" rx="138" ry="13" fill="#000" opacity="0.12"/>
<g class="c-root" data-origin="200 240">
  <!-- tail (behind body) -->
  <g class="c-tail" data-origin="64 262">
    <g class="c-tail-swish" data-origin="64 262">
      <path d="M66 262C38 254 24 272 28 300" fill="none" stroke="${r}" stroke-width="16" stroke-linecap="round"/>
      <path d="M66 262C38 254 24 272 28 300" fill="none" stroke="${a}" stroke-width="6" stroke-linecap="round"/>
      <path d="M28 290C40 290 46 302 42 314C44 322 38 330 32 328C28 336 18 334 18 326C10 324 10 312 16 306C16 296 22 290 28 290Z" fill="${c}" ${x} stroke-width="6"/>
    </g>
  </g>
  <!-- far legs -->
  ${D(134,376,!0,`c-leg-bl`,`134 318`)}
  ${D(270,376,!0,`c-leg-fr`,`270 318`)}
  <!-- near legs -->
  ${D(96,384,!1,`c-leg-l`,`96 326`)}
  ${D(226,384,!1,`c-leg-r`,`226 326`)}
  <g class="c-body" data-origin="185 368">
    <path d="${w}" fill="${a}"/>
    <g clip-path="url(#${e}body)">
      <path d="M54 236C86 220 132 226 136 258C140 290 108 302 88 294C66 286 44 262 54 236Z" fill="${c}"/>
      <path d="M140 312C150 292 190 292 202 308C212 324 198 344 172 344C146 344 130 328 140 312Z" fill="${c}"/>
      <path d="M186 244Q248 296 312 236" fill="none" stroke="${r}" stroke-width="26" stroke-linecap="round"/>
      <path d="M186 244Q248 296 312 236" fill="none" stroke="${h}" stroke-width="15" stroke-linecap="round"/>
      ${C(172,268,130,76)}
    </g>
    <path d="${w}" fill="none" ${x} stroke-width="8"/>
    <g class="c-bell" data-origin="248 268">
      <circle cx="248" cy="270" r="6" fill="${g}" ${x} stroke-width="5"/>
      <path d="M228 304C228 286 236 276 248 276C260 276 268 286 268 304L273 310H223Z" fill="${g}"/>
      <path d="M256 280C263 286 266 294 266 304L271 310H256Z" fill="${_}"/>
      <path d="M236 290C236 284 240 281 244 281" fill="none" stroke="${a}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
      <circle cx="248" cy="313" r="5" fill="${r}"/>
      <path d="M228 304C228 286 236 276 248 276C260 276 268 286 268 304L273 310H223Z" fill="none" ${x} stroke-width="5"/>
    </g>
  </g>
  <g class="c-head" data-origin="222 236">
    <!-- ears -->
    <g class="c-ear-l" data-origin="166 122">
      <path d="M168 108C140 100 106 112 98 134C112 148 144 146 168 134Z" fill="${a}" ${x} stroke-width="7"/>
      <path d="M158 115C140 112 120 120 112 132C124 139 142 137 158 129Z" fill="${l}"/>
    </g>
    <g class="c-ear-r" data-origin="314 118">
      <path d="M312 104C340 96 368 108 374 128C362 142 334 142 312 130Z" fill="${a}" ${x} stroke-width="7"/>
      <path d="M320 111C338 108 354 116 360 127C350 134 334 134 320 125Z" fill="${l}"/>
      <path d="M312 104C340 96 368 108 374 128C362 142 334 142 312 130Z" fill="${s}" opacity="0.14"/>
    </g>
    <!-- horns -->
    <path d="M214 86C212 72 204 62 190 56C180 52 166 54 168 60C178 64 186 76 190 92Z" fill="${f}" ${x} stroke-width="6"/>
    <path d="M266 86C268 72 276 62 290 56C300 52 314 54 312 60C302 64 294 76 290 92Z" fill="${f}" ${x} stroke-width="6"/>
    <path d="M296 62C304 60 310 58 312 60C302 64 294 76 290 92L284 88C286 76 290 68 296 62Z" fill="${p}"/>
    <path d="M180 60C188 64 194 72 198 82" fill="none" stroke="${a}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
    <!-- skull -->
    <path d="${T}" fill="${a}"/>
    <g clip-path="url(#${e}skull)">
      <path d="M270 70C306 60 340 92 332 128C326 152 296 150 290 128C284 108 256 92 270 70Z" fill="${c}"/>
      ${C(232,140,88,80)}
    </g>
    <path d="${T}" fill="none" ${x} stroke-width="8"/>
    <!-- tuft between the horns -->
    <path d="M222 80C216 66 228 58 236 66C238 54 254 54 254 66C262 58 276 64 268 80C256 86 234 86 222 80Z" fill="${c}" ${x} stroke-width="5"/>
    <ellipse class="c-cheek" cx="176" cy="164" rx="14" ry="9" fill="${v}"/>
    <ellipse class="c-cheek" cx="310" cy="160" rx="12" ry="9" fill="${v}"/>
    <!-- eyes -->
    <g class="c-eyes-open">
      ${O(e,`l`,A.cx,A.cy,A.rx,A.ry)}
      ${O(e,`r`,j.cx,j.cy,j.rx,j.ry)}
    </g>
    <g class="c-eyes-happy">
      ${k(A.cx,A.cy,A.rx,`l`)}
      ${k(j.cx,j.cy,j.rx,`r`)}
    </g>
    <!-- muzzle -->
    <g class="c-muzzle" data-origin="246 170">
      <path d="${E}" fill="${l}"/>
      <g clip-path="url(#${e}muz)">
        <path fill="${u}" fill-rule="evenodd" d="M160 150H340V270H160Z${S(240,204,76,46)}"/>
      </g>
      <ellipse cx="206" cy="192" rx="14" ry="7" fill="${a}" opacity="0.5" transform="rotate(-24 206 192)"/>
      <path d="${E}" fill="none" ${x} stroke-width="8"/>
      <ellipse cx="224" cy="204" rx="8" ry="11" fill="${d}" transform="rotate(-18 224 204)"/>
      <ellipse cx="270" cy="203" rx="7.5" ry="10.5" fill="${d}" transform="rotate(18 270 203)"/>
      <g class="c-jaw" data-origin="246 228">
        <path class="c-mouth-closed" d="M228 230Q246 244 264 230" fill="none" ${x} stroke-width="5"/>
        <g class="c-mouth-open" data-origin="246 223">
          <ellipse cx="246" cy="239" rx="17" ry="16" fill="${y}"/>
          <ellipse cx="246" cy="247" rx="9" ry="6" fill="${b}"/>
          <ellipse cx="246" cy="239" rx="17" ry="16" fill="none" ${x} stroke-width="5"/>
        </g>
      </g>
    </g>
  </g>
</g>`}var N=new WeakMap;function P(e,t,n=0){let r=e.one(`.c-tail-swish`);r&&t.to(r,{rotation:28,duration:.2,ease:`sine.out`,...e.o(r)},n).to(r,{rotation:-16,duration:.3,ease:`sine.inOut`}).to(r,{rotation:10,duration:.25,ease:`sine.inOut`}).to(r,{rotation:0,duration:.35,ease:`elastic.out(1, 0.5)`})}function F(e,t,n=0,r=18){let i=e.one(`.c-bell`);i&&t.to(i,{rotation:r,duration:.14,ease:`sine.out`,...e.o(i)},n).to(i,{rotation:-r*.8,duration:.22,ease:`sine.inOut`}).to(i,{rotation:r*.5,duration:.2,ease:`sine.inOut`}).to(i,{rotation:0,duration:.5,ease:`elastic.out(1, 0.4)`})}function I(e,t,n=0,r=`both`){let i=e.one(`.c-ear-l`),a=e.one(`.c-ear-r`);i&&r!==`r`&&t.to(i,{rotation:16,duration:.09,yoyo:!0,repeat:3,ease:`sine.inOut`,...e.o(i)},n),a&&r!==`l`&&t.to(a,{rotation:-16,duration:.09,yoyo:!0,repeat:3,ease:`sine.inOut`,...e.o(a)},n)}var L={id:`cow`,svg:M,setup(e,t){N.set(e.svg,t)},idleExtras(e){let n=t.timeline(),r=Math.floor(Math.random()*3);return r===0?P(e,n):r===1?I(e,n,0,Math.random()<.5?`l`:`r`):F(e,n,0,12),n},special(e){let n=t.timeline(),r=e.one(`.c-root`),i=e.one(`.c-head`),a=e.one(`.c-mouth-open`),o=e.one(`.c-mouth-closed`),s=e.one(`.c-muzzle`),c=e.one(`.c-ear-l`),l=e.one(`.c-ear-r`),u={svgOrigin:`200 385`};i&&n.to(i,{rotation:7,duration:.18,ease:`power2.in`,...e.o(i)},0),r&&n.to(r,{scaleY:.94,scaleX:1.04,duration:.18,ease:`power2.in`,...u},0),i&&n.to(i,{rotation:-15,duration:.32,ease:`back.out(1.8)`},.18),r&&n.to(r,{scaleY:1.05,scaleX:.97,duration:.32,ease:`back.out(1.8)`},.18),a&&n.to(a,{opacity:1,scaleY:1,duration:.2,ease:`back.out(2)`,...e.o(a)},.24),o&&n.to(o,{opacity:0,duration:.08},.24),s&&n.to(s,{scaleX:.94,scaleY:1.06,duration:.25,ease:`sine.out`,...e.o(s)},.24),c&&n.to(c,{rotation:24,duration:.22,ease:`back.out(2)`,...e.o(c)},.2),l&&n.to(l,{rotation:-24,duration:.22,ease:`back.out(2)`,...e.o(l)},.2),i&&n.to(i,{rotation:-11,duration:.3,ease:`sine.inOut`,yoyo:!0,repeat:2},.5),F(e,n,.2,22),P(e,n,.3);let d=1.45;return a&&n.to(a,{scaleY:.05,opacity:0,duration:.18,ease:`power2.in`},d),o&&n.to(o,{opacity:1,duration:.1},1.55),s&&n.to(s,{scaleX:1,scaleY:1,duration:.3,ease:`back.out(2)`},d),i&&n.to(i,{rotation:0,duration:.45,ease:`back.out(1.6)`},d),r&&n.to(r,{scaleY:1,scaleX:1,duration:.45,ease:`elastic.out(1, 0.5)`},d),c&&l&&n.to([c,l],{rotation:0,duration:.5,ease:`elastic.out(1, 0.45)`},d),n.call(()=>N.get(e.svg)?.setMouth(0),[],1.75),n}},R=new WeakMap;function z(e,n){let r=R.get(e),i=e.part(`.c-muzzle`),a=e.part(`.c-jaw`),o=e.part(`.c-ear-l`),s=e.part(`.c-ear-r`);if(!n){r?.kill(),R.delete(e);let n=[i,a,o,s].filter(Boolean);n.length&&t.to(n,{x:0,rotation:0,scaleY:1,duration:.25,ease:`sine.out`});return}if(r)return;let c=e=>({svgOrigin:e?.getAttribute(`data-origin`)??`0 0`}),l=.24,u=t.timeline();a&&u.to(a,{x:-6,rotation:-4,duration:l/2,ease:`sine.out`,...c(a)},0),i&&u.to(i,{x:-2.5,rotation:-1.5,duration:l/2,ease:`sine.out`,...c(i)},0);let d=t.timeline({repeat:-1,onRepeat:()=>{e.el.isConnected||(u.kill(),R.delete(e))}});for(let e=0;e<8;e++){let t=e%2?-1:1;a&&(d.to(a,{x:6*t,rotation:4*t,duration:l,ease:`sine.inOut`},e*l),d.to(a,{scaleY:.78,duration:l/2,yoyo:!0,repeat:1,ease:`sine.inOut`},e*l)),i&&d.to(i,{x:2.5*t,rotation:1.5*t,duration:l,ease:`sine.inOut`},e*l)}o&&d.to(o,{rotation:14,duration:.08,yoyo:!0,repeat:1,ease:`sine.inOut`,...c(o)},l*3),s&&d.to(s,{rotation:-12,duration:.08,yoyo:!0,repeat:1,ease:`sine.inOut`,...c(s)},l*6.5),u.add(d),R.set(e,u)}export{n,z as t};