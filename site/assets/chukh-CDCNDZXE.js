import{t as e}from"./gsap-CvDoa17S.js";var t=`#3B2F4F`,n=`#2A2238`,r=`#FFD23F`,i=`#E8B622`,a=`#6EC6FF`,o=`#3FA3E0`,s=`#FF5A5F`,c=`#D9434A`,l=`#FFB938`,u=`#FF9EB1`,d=`fill="#fff" opacity="0.55"`,f=[{cx:106,cy:335,r:50},{cx:236,cy:349,r:36},{cx:314,cy:349,r:36}],p=15,m={x:316,y:84},h=(e,t,n,r)=>{let i=r*Math.PI/180;return`${(e+n*Math.cos(i)).toFixed(1)} ${(t+n*Math.sin(i)).toFixed(1)}`};function g(e){let{cx:n,cy:r,r:i}=f[e],a=(f[1].r/i).toFixed(4),o=i-10,l=`M${h(n,r,i-4,-40)} A${i-4} ${i-4} 0 0 1 ${h(n,r,i-4,130)} A${i*1.25} ${i*1.25} 0 0 0 ${h(n,r,i-4,-40)} Z`,u=`M${h(n,r,i-9,196)} A${i-9} ${i-9} 0 0 1 ${h(n,r,i-9,250)}`;return`<g class="k-wheelset">
      <circle cx="${n}" cy="${r}" r="${i}" fill="${s}" stroke="${t}" stroke-width="8"/>
      <path d="${l}" fill="${c}"/>
      <circle cx="${n}" cy="${r}" r="${i-12}" fill="none" stroke="${c}" stroke-width="3"/>
      <path d="${u}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
      <g class="c-wheel" data-origin="${n} ${r}" data-ratio="${a}">
        <path d="M${n-o} ${r} H${n+o} M${n} ${r-o} V${r+o}" stroke="${t}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="${n}" cy="${r}" r="${i>40?13:10}" fill="#fff" stroke="${t}" stroke-width="5"/>
      </g>
    </g>`}function _(e,r,i){return`<g class="c-eye">
      <clipPath id="${i}"><ellipse cx="${e}" cy="${r}" rx="24" ry="28"/></clipPath>
      <ellipse cx="${e}" cy="${r}" rx="24" ry="28" fill="#fff" stroke="${t}" stroke-width="5"/>
      <g clip-path="url(#${i})">
        <g class="c-pupil" data-range="7">
          <ellipse cx="${e+3}" cy="${r-1}" rx="16" ry="18.5" fill="${n}"/>
          <path d="M${e-9} ${r+8} Q${e+3} ${r+19} ${e+15} ${r+8} Q${e+3} ${r+14} ${e-9} ${r+8} Z" fill="#6A5A8E"/>
          <circle cx="${e-3}" cy="${r-9}" r="6.5" fill="#fff"/>
          <circle cx="${e+10}" cy="${r+5}" r="3" fill="#fff"/>
        </g>
      </g>
    </g>`}function v(e){let n=[[-12,4,12],[11,5,11],[0,-6,15]],r=e=>n.map(([t,n,r])=>`<circle cx="${t}" cy="${n}" r="${r}" ${e}/>`).join(``);return`<g transform="translate(${m.x} ${m.y})"><g class="k-puff" data-i="${e}" opacity="0">
      <g fill="#fff" stroke="${t}" stroke-width="5">${r(``)}</g>
      <g fill="#fff">${r(``)}</g>
      <path d="M-18 8 Q-4 16 16 9" fill="none" stroke="#DCE6F5" stroke-width="5" stroke-linecap="round"/>
    </g></g>`}var y=new WeakMap;function b(t){let n=y.get(t);if(n)return n;let r=Array.from(t.querySelectorAll(`.c-wheel`)).map(t=>(e.set(t,{svgOrigin:t.getAttribute(`data-origin`)??`0 0`}),{el:t,k:Number(t.getAttribute(`data-ratio`)??1)})),i=t.querySelector(`.k-rod`),a={angle:0,speed:0,loop:null,puffCall:null,ticking:!1,apply(){for(let t of r)e.set(t.el,{rotation:a.angle*t.k});if(i){let t=a.angle*Math.PI/180;e.set(i,{x:-15*Math.sin(t),y:p*Math.cos(t)-p})}},tick(n,r){if(!t.isConnected||a.speed===0&&!a.loop){e.ticker.remove(a.tick),a.ticking=!1;return}a.angle+=a.speed*Math.min(r,50)/1e3,a.apply()}};return y.set(t,a),a}function x(t){t.ticking||(t.ticking=!0,e.ticker.add(t.tick))}function S(t,n={}){let r=n.size??1,i=n.life??1.1;return e.timeline().fromTo(t,{x:0,y:6,scale:.15,opacity:1,transformOrigin:`50% 50%`},{y:-14*r,scale:.8*r,duration:.18,ease:`back.out(2.5)`}).to(t,{y:-(n.rise??70),x:n.drift??-34,scale:1.25*r,duration:i,ease:`sine.out`},`>`).to(t,{opacity:0,duration:i*.55,ease:`power1.in`},`<${i*.45}`)}function C(t,n){let r=t.svg,i=b(r),a=r.querySelector(`.k-sprung`),o=r.querySelector(`.k-chimney`),s=Array.from(r.querySelectorAll(`.k-puff`));if(e.killTweensOf(i,`speed`),n){if(i.loop)return;x(i),e.to(i,{speed:560,duration:.6,ease:`power1.in`}),i.loop=e.timeline({repeat:-1}).to(a,{y:3,duration:.1,ease:`power2.in`}).to(a,{y:-2,duration:.12,ease:`power2.out`}).to(a,{y:0,duration:.1,ease:`sine.inOut`}),o&&i.loop.to(o,{scaleY:1.08,scaleX:.94,duration:.1,yoyo:!0,repeat:1,svgOrigin:o.getAttribute(`data-origin`)??`316 166`},0);let t=0,n=()=>{if(!r.isConnected||!i.loop)return;let a=s[t++%s.length];a&&S(a,{size:.65,rise:60,drift:-46,life:.9}),i.puffCall=e.delayedCall(.33,n)};n()}else i.loop?.kill(),i.loop=null,i.puffCall?.kill(),i.puffCall=null,a&&e.to(a,{y:0,duration:.2}),o&&e.to(o,{scaleY:1,scaleX:1,duration:.2}),e.to(i,{speed:0,duration:.9,ease:`power2.out`})}var w={id:`chukh`,svg:e=>{let n=`M150 162 H306 Q356 162 356 214 V240 Q356 292 306 292 H150 Z`,m=`M20 296 V144 Q20 106 58 106 H166 Q204 106 204 144 V296 Z`;return`
  <defs>
    <clipPath id="${e}boiler"><path d="${n}"/></clipPath>
    <clipPath id="${e}cab"><path d="${m}"/></clipPath>
    <linearGradient id="${e}glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F4FCFF"/>
      <stop offset="1" stop-color="#C9EBFF"/>
    </linearGradient>
  </defs>
  <ellipse class="c-shadow" cx="204" cy="386" rx="178" ry="12" fill="#000" opacity="0.12"/>
  <g class="c-root" data-origin="200 240">
    ${v(0)}${v(1)}${v(2)}

    <!-- dark undercarriage behind the wheels -->
    <rect x="56" y="298" width="290" height="30" rx="10" fill="#4B3F6B" stroke="${t}" stroke-width="6"/>

    <g class="k-sprung">
      <g class="c-body" data-origin="255 292">
        <!-- steam dome + whistle -->
        <g class="k-whistle" data-origin="258 146">
          <rect x="252" y="118" width="12" height="30" rx="5" fill="${l}" stroke="${t}" stroke-width="5"/>
          <rect x="246" y="110" width="24" height="12" rx="6" fill="${l}" stroke="${t}" stroke-width="5"/>
        </g>
        <path d="M234 170 Q234 138 258 138 Q282 138 282 170 Z" fill="${r}" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
        <path d="M243 158 Q246 147 255 145" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.6"/>

        <!-- big rounded chimney -->
        <g class="k-chimney" data-origin="316 166">
          <path d="M300 172 L299 146 C278 138 272 108 284 96 H348 C360 108 354 138 333 146 L332 172 Z" fill="${a}" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
          <path d="M338 104 C344 118 338 134 324 140 L324 168 H331 L332 146 C348 138 352 118 346 104 Z" fill="${o}"/>
          <rect x="274" y="82" width="84" height="20" rx="10" fill="${s}" stroke="${t}" stroke-width="7"/>
          <path d="M290 108 Q288 124 300 134" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
        </g>

        <!-- boiler -->
        <path d="${n}" fill="${r}"/>
        <g clip-path="url(#${e}boiler)">
          <rect x="140" y="268" width="240" height="30" fill="${i}"/>
          <rect x="330" y="150" width="50" height="150" fill="${a}" stroke="${t}" stroke-width="6"/>
          <rect x="336" y="268" width="40" height="30" fill="${o}"/>
          <rect x="216" y="150" width="16" height="150" fill="${a}" stroke="${t}" stroke-width="5"/>
          <rect x="216" y="268" width="16" height="30" fill="${o}"/>
        </g>
        <rect x="244" y="178" width="58" height="10" rx="5" ${d}/>
        <path d="M340 180 Q344 174 348 178" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
        <path d="${n}" fill="none" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
      </g>

      <!-- cab = head: cap roof + window with the face -->
      <g class="c-head" data-origin="112 296">
        <path d="${m}" fill="${r}"/>
        <g clip-path="url(#${e}cab)">
          <rect x="188" y="100" width="30" height="200" fill="${i}"/>
          <rect x="10" y="274" width="210" height="30" fill="${i}"/>
        </g>
        <path d="${m}" fill="none" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>

        <!-- cap roof with a little visor pointing forward -->
        <path d="M8 118 C8 84 58 66 112 66 C162 66 198 80 208 102 L226 108 Q236 112 233 120 Q230 128 218 128 H18 Q8 128 8 118 Z" fill="${a}" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
        <path d="M18 120 Q112 112 222 120" fill="none" stroke="${o}" stroke-width="7" stroke-linecap="round"/>
        <path d="M34 98 Q62 78 104 76" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.6"/>
        <circle cx="112" cy="66" r="9" fill="${s}" stroke="${t}" stroke-width="5"/>

        <!-- window frame + glass (arched top) -->
        <rect x="30" y="130" width="164" height="142" rx="46" fill="${a}" stroke="${t}" stroke-width="6"/>
        <rect x="40" y="140" width="144" height="122" rx="37" fill="url(#${e}glass)" stroke="${t}" stroke-width="4"/>
        <path d="M160 150 L172 162 M150 150 L175 175" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.9"/>

        <!-- face -->
        <ellipse class="c-cheek" cx="60" cy="236" rx="12" ry="8" fill="${u}"/>
        <ellipse class="c-cheek" cx="164" cy="236" rx="12" ry="8" fill="${u}"/>
        <path class="c-brow-l" data-origin="85 158" d="M73 160 Q85 152 97 158" fill="none" stroke="${t}" stroke-width="5.5" stroke-linecap="round"/>
        <path class="c-brow-r" data-origin="139 158" d="M127 158 Q139 152 151 160" fill="none" stroke="${t}" stroke-width="5.5" stroke-linecap="round"/>
        <g class="c-eyes-open">
          ${_(85,196,`${e}eyeL`)}
          ${_(139,196,`${e}eyeR`)}
        </g>
        <g class="c-eyes-happy">
          <path d="M63 202 Q85 176 107 202" fill="none" stroke="${t}" stroke-width="7" stroke-linecap="round"/>
          <path d="M117 202 Q139 176 161 202" fill="none" stroke="${t}" stroke-width="7" stroke-linecap="round"/>
        </g>
        <path class="c-mouth-closed" d="M99 235 Q112 249 125 235" fill="none" stroke="${t}" stroke-width="5.5" stroke-linecap="round"/>
        <g class="c-mouth-open" data-origin="112 234">
          <path d="M98 234 Q112 231 126 234 Q127 256 112 256 Q97 256 98 234 Z" fill="#5A2A3A" stroke="${t}" stroke-width="4" stroke-linejoin="round"/>
          <path d="M103 250 Q112 242 121 250 Q112 255 103 250 Z" fill="#FF7A93"/>
        </g>
      </g>

      <!-- running board -->
      <rect x="10" y="284" width="352" height="24" rx="12" fill="${a}" stroke="${t}" stroke-width="8"/>
      <rect x="22" y="298" width="328" height="6" rx="3" fill="${o}"/>
      <path d="M28 291 H140" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.55"/>
      <!-- cow-catcher -->
      <path d="M350 306 H366 Q376 306 380 316 L394 356 Q398 370 384 370 H358 Q348 370 348 360 Z" fill="${s}" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M362 314 L368 362 M375 316 L382 362" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
    </g>

    <!-- wheels + coupling rod (unsprung) -->
    ${g(0)}${g(1)}${g(2)}
    <g class="k-rod">
      <rect x="${f[1].cx-8}" y="${f[1].cy+p-6}" width="${f[2].cx-f[1].cx+16}" height="12" rx="6" fill="${a}" stroke="${t}" stroke-width="5"/>
      <circle cx="${f[1].cx}" cy="${f[1].cy+p}" r="4.5" fill="#fff" stroke="${t}" stroke-width="3"/>
      <circle cx="${f[2].cx}" cy="${f[2].cy+p}" r="4.5" fill="#fff" stroke="${t}" stroke-width="3"/>
    </g>
  </g>`},special(e){let t=e.tl(),n=e.one(`.c-root`),r=e.one(`.k-chimney`),i=e.one(`.k-whistle`),a=e.q(`.k-puff`),o=e.one(`.c-mouth-open`),s=e.one(`.c-mouth-closed`),c=e.one(`.c-eyes-open`),l=e.one(`.c-eyes-happy`),u=b(e.svg),d={svgOrigin:`200 385`};return t.to(n,{scaleY:.9,scaleX:1.06,duration:.14,ease:`power2.in`,...d}),c&&l&&t.set(c,{opacity:0},`>`).set(l,{opacity:1},`<`),[0,.32,.64].forEach((c,l)=>{let u=.14+c;t.to(n,{scaleY:1.08,scaleX:.95,y:l===2?-26:-12,duration:.14,ease:`back.out(2)`,...d},u).to(n,{scaleY:1,scaleX:1,y:0,duration:.18,ease:`power2.in`},u+.14),r&&t.fromTo(r,{scaleY:.85,scaleX:1.12},{scaleY:1,scaleX:1,duration:.3,ease:`elastic.out(1.2, 0.4)`,...e.o(r)},u),i&&t.fromTo(i,{rotation:-10},{rotation:0,duration:.3,ease:`elastic.out(1.4, 0.3)`,...e.o(i)},u),o&&s&&t.set(s,{opacity:0},u).fromTo(o,{opacity:1,scaleY:.3},{scaleY:1,duration:.1,...e.o(o)},u).to(o,{scaleY:.35,duration:.12},u+(l===2?.34:.18));let f=a[l];f&&t.add(S(f,{size:1+l*.12,rise:110+l*20,drift:-30-l*16,life:1.2}),u+.02)}),t.to(u,{angle:`+=360`,duration:.9,ease:`power2.inOut`,onUpdate:()=>u.apply()},.14),o&&s&&t.set(o,{opacity:0,scaleY:.05},1.2).set(s,{opacity:1},1.2),c&&l&&t.set(l,{opacity:0},1.5).set(c,{opacity:1},1.5),t},idleExtras(e){let t=e.tl(),n=b(e.svg).loop?0:Math.random(),r=e.one(`.k-chimney`);if(n<.6){let n=e.q(`.k-puff`)[Math.floor(Math.random()*3)];r&&t.fromTo(r,{scaleY:.92,scaleX:1.06},{scaleY:1,scaleX:1,duration:.4,ease:`elastic.out(1, 0.4)`,...e.o(r)},0),n&&t.add(S(n,{size:.7,rise:70,drift:-24,life:1.1}),0)}else if(n<.85){let n=b(e.svg),r={onUpdate:()=>n.apply()};t.to(n,{angle:`+=40`,duration:.35,ease:`sine.out`,...r}).to(n,{angle:`-=40`,duration:.5,ease:`back.out(1.6)`,...r});let i=e.one(`.c-root`);i&&t.to(i,{rotation:-1.5,duration:.35,yoyo:!0,repeat:1,ease:`sine.inOut`,svgOrigin:`200 385`},0)}else{let n=e.q(`.c-pupil`);t.to(n,{x:4,y:6,duration:.25,ease:`power2.out`}).to(n,{x:0,y:0,duration:.3,ease:`power2.inOut`},`+=0.6`)}return t}};export{w as default,C as drive};