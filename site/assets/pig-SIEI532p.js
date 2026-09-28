import{t as e}from"./gsap-CvDoa17S.js";var t=`#3B2F4F`,n=`#FFB3C8`,r=`#F291AE`,i=`#FF8FB0`,a=`#F2799E`,o=`#C44F7A`,s=`#6E4A66`,c=`#C99576`,l=`stroke="${t}" stroke-linejoin="round" stroke-linecap="round"`,u=385,d=`M200 82 C270 82 318 122 318 186 C318 246 268 278 200 278 C132 278 82 246 82 186 C82 122 130 82 200 82 Z`,f=`M308 300 C334 304 356 290 352 272 C348 256 324 260 328 276 C332 292 356 296 370 280`,p=`M74 292 C74 234 134 220 200 220 C266 220 326 234 326 292 C326 340 292 358 200 358 C108 358 74 340 74 292 Z`;function m(e,t,i,a){let o=a/2,c=u,d=t-o,f=t+o,p=i-22,m=`M${d} ${p+o} A${o} ${o} 0 0 1 ${f} ${p+o} V373 Q${f} ${c} ${f-12} ${c} H${d+12} Q${d} ${c} ${d} 373 Z`,h=`M${d} 370 H${f} V373 Q${f} ${c} ${f-12} ${c} H${d+12} Q${d} ${c} ${d} 373 Z`;return`<g class="${e}" data-origin="${t} ${i}"><g class="p-leg" data-origin="${t} ${i}">
    <path d="${m}" fill="${n}"/>
    <path d="M${f-9} ${p+14} V367" stroke="${r}" stroke-width="9" stroke-linecap="round"/>
    <path d="${h}" fill="${s}"/>
    <path d="M${t} 373 V382" ${l} stroke-width="4" fill="none"/>
    <path d="${m}" fill="none" ${l} stroke-width="7"/>
  </g></g>`}function h(e,t,n,i){let a=n/2,o=t-a,c=t+a,u=`V${i-11} Q${c} ${i} ${c-11} ${i} H${o+11} Q${o} ${i} ${o} ${i-11}`;return`<g class="${e}" data-origin="${t} 328">
    <path d="M${o} 318 H${c} ${u} Z" fill="${r}"/>
    <path d="M${o} ${i-13} H${c} ${u} Z" fill="${s}"/>
    <path d="M${o} 318 H${c} ${u} Z" fill="none" ${l} stroke-width="7"/>
  </g>`}function g(e,t){return`<g class="c-eye">
    <ellipse cx="${e}" cy="${t}" rx="27" ry="31" fill="#fff" ${l} stroke-width="6"/>
    <g class="c-pupil" data-range="8">
      <circle cx="${e+2}" cy="${t-2}" r="17" fill="#2A2238"/>
      <circle cx="${e-4}" cy="${t-10}" r="6.5" fill="#fff"/>
      <circle cx="${e+9}" cy="${t+5}" r="3" fill="#fff"/>
    </g>
  </g>`}function _(e,t){return`<g class="${e}" data-origin="${t===1?146:254} 100"><g${t===1?``:` transform="translate(400 0) scale(-1 1)"`}>
    <path d="M124 122 C114 100 100 80 90 64 Q84 54 94 52 C124 50 160 70 180 100 Z" fill="${n}" ${l} stroke-width="7"/>
    <path d="M130 110 C122 96 112 82 104 70 C128 70 150 84 164 100 Z" fill="${r}"/>
    <path d="M92 56 C104 52 116 54 126 60 C114 66 104 76 98 90 C92 80 90 66 92 56 Z" fill="${n}" ${l} stroke-width="5"/>
  </g></g>`}function v(e){return`<defs>
    <radialGradient id="${e}g" cx="0.36" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#FFCBDA"/><stop offset="1" stop-color="${n}"/>
    </radialGradient>
    <clipPath id="${e}hc"><path d="${d}"/></clipPath>
    <clipPath id="${e}bc"><path d="${p}"/></clipPath>
    <clipPath id="${e}sc"><ellipse cx="200" cy="208" rx="45" ry="31"/></clipPath>
  </defs>
  <ellipse class="c-shadow" cx="200" cy="387" rx="134" ry="13" fill="#000" opacity="0.12"/>
  <g class="c-root" data-origin="200 240">
  <g class="p-roll" data-origin="200 240">
    ${h(`c-leg-r`,106,38,381)}
    ${h(`c-leg-l`,294,38,381)}
    ${m(`c-arm-r`,160,342,44)}
    ${m(`c-arm-l`,240,342,44)}
    <g class="c-tail" data-origin="316 298"><g class="p-curl" data-origin="316 298">
      <path d="${f}" fill="none" stroke="${t}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${f}" fill="none" stroke="${n}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g></g>
    <g class="c-body" data-origin="200 385">
      <path d="${p}" fill="${r}"/>
      <g clip-path="url(#${e}bc)"><path d="${p}" fill="url(#${e}g)" transform="translate(-8 -12)"/></g>
      <ellipse cx="94" cy="274" rx="6" ry="12" transform="rotate(25 94 274)" fill="#fff" opacity="0.5"/>
      <path d="M112 318 C104 306 116 296 128 302 C138 296 152 304 146 316 C156 322 148 336 136 332 C126 342 108 336 112 326 Z" fill="${c}"/>
      <circle cx="160" cy="330" r="4.5" fill="${c}"/>
      <circle cx="100" cy="304" r="3.5" fill="${c}"/>
      <path d="${p}" fill="none" ${l} stroke-width="8"/>
    </g>
    <g class="c-head" data-origin="200 272">
      ${_(`c-ear-r`,1)}
      ${_(`c-ear-l`,-1)}
      <path d="M182 96 C176 80 184 64 200 60 C196 68 197 75 201 81 C204 68 215 58 230 60 C223 67 221 76 223 88 C216 94 204 98 194 98 Z" fill="${n}" ${l} stroke-width="6"/>
      <path d="${d}" fill="${r}"/>
      <g clip-path="url(#${e}hc)"><path d="${d}" fill="url(#${e}g)" transform="translate(-8 -12)"/></g>
      <path d="M102 176 C100 152 108 132 122 118" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="0.55"/>
      <path d="${d}" fill="none" ${l} stroke-width="8"/>
      <ellipse class="c-cheek" cx="115" cy="212" rx="19" ry="12" fill="#FF7FA3"/>
      <ellipse class="c-cheek" cx="285" cy="212" rx="19" ry="12" fill="#FF7FA3"/>
      <path class="c-brow-r" data-origin="147 104" d="M130 110 Q146 96 164 104" fill="none" ${l} stroke-width="7"/>
      <path class="c-brow-l" data-origin="254 106" d="M238 106 Q254 101 270 110" fill="none" ${l} stroke-width="7"/>
      <g class="c-eyes-open">
        ${g(148,150)}
        ${g(252,150)}
      </g>
      <g class="c-eyes-happy">
        <path d="M122 158 Q148 124 174 158" fill="none" ${l} stroke-width="8"/>
        <path d="M226 158 Q252 124 278 158" fill="none" ${l} stroke-width="8"/>
      </g>
      <g class="c-mouth-closed">
        <g class="p-tongue"><path d="M201 258 C200 280 228 284 230 262 L227 250 Z" fill="#FF7A93" ${l} stroke-width="5"/>
        <path d="M215 263 V271" stroke="#E0567A" stroke-width="3.5" stroke-linecap="round"/></g>
        <path d="M172 246 Q198 270 232 248" fill="none" ${l} stroke-width="6"/>
      </g>
      <g class="c-mouth-open" data-origin="200 246">
        <path d="M176 246 Q200 250 224 246 Q222 282 200 284 Q178 282 176 246 Z" fill="#5A2A3A" ${l} stroke-width="5"/>
        <path d="M187 274 Q200 264 213 274 Q208 280 200 280 Q192 280 187 274 Z" fill="#FF7A93"/>
      </g>
      <g class="c-snout" data-origin="200 208">
        <ellipse cx="200" cy="208" rx="45" ry="31" fill="${a}"/>
        <g clip-path="url(#${e}sc)"><ellipse cx="195" cy="201" rx="45" ry="31" fill="${i}"/></g>
        <ellipse cx="200" cy="208" rx="45" ry="31" fill="none" ${l} stroke-width="6"/>
        <ellipse cx="177" cy="191" rx="9" ry="4.5" transform="rotate(-20 177 191)" fill="#fff" opacity="0.55"/>
        <ellipse class="p-nostril" cx="185" cy="210" rx="7" ry="11" fill="${o}"/>
        <ellipse class="p-nostril" cx="215" cy="210" rx="7" ry="11" fill="${o}"/>
      </g>
    </g>
  </g>
  </g>`}var y=(e,t,n,r)=>{let i=t.one(`.c-eyes-open`),a=t.one(`.c-eyes-happy`);i&&a&&(e.set(i,{opacity:+!n},r),e.set(a,{opacity:+!!n},r))};function b(e,t){let n=e.one(`.c-body`),r=e.one(`.c-tail`),i=[e.one(`.c-arm-r`),e.one(`.c-arm-l`)].filter(Boolean);n&&r&&i.length&&(t?n.after(...i):r.before(...i))}function x(t,n=5){let r=e.timeline(),i=t.one(`.c-snout`),a=t.q(`.p-nostril`),o=t.one(`.c-head`),s=[t.one(`.c-ear-r`),t.one(`.c-ear-l`)].filter(Boolean),c=.075;return i&&(r.to(i,{scaleX:1.22,scaleY:.82,y:-3,duration:c,yoyo:!0,repeat:n,ease:`sine.inOut`,...t.o(i)},0),r.to(i,{x:5,duration:c*2,yoyo:!0,repeat:Math.floor(n/2),ease:`sine.inOut`},0),r.set(i,{x:0,y:0,scaleX:1,scaleY:1})),o&&r.to(o,{rotation:4,duration:c*2,yoyo:!0,repeat:Math.floor(n/2),ease:`sine.inOut`,...t.o(o)},0).set(o,{rotation:0}),a.length&&r.to(a,{scaleY:.55,duration:c,yoyo:!0,repeat:n,transformOrigin:`50% 50%`},0),s[0]&&r.to(s[0],{rotation:-16,duration:.1,yoyo:!0,repeat:3,...t.o(s[0])},0),s[1]&&r.to(s[1],{rotation:16,duration:.1,yoyo:!0,repeat:3,...t.o(s[1])},0),r}function S(t){let n=e.timeline(),r=t.one(`.c-root`),i=t.one(`.p-roll`),a=t.one(`.c-shadow`),o=t.one(`.c-arm-l`),s=t.one(`.c-arm-r`),c=t.one(`.p-curl`);if(!r||!i)return n;let l={svgOrigin:`200 ${u}`};return y(n,t,!0,0),n.call(()=>b(t,!0),[],.15),n.call(()=>b(t,!1),[],.84),n.to(r,{scaleY:.8,scaleX:1.14,duration:.16,ease:`power2.in`,...l},0).to(r,{y:-120,scaleY:1.08,scaleX:.94,duration:.34,ease:`power2.out`},.16).to(i,{rotation:-360,duration:.62,ease:`power1.inOut`,...t.o(i)},.2).to(r,{y:0,scaleY:1,scaleX:1,duration:.3,ease:`power2.in`},.5).set(i,{rotation:0},.82).to(r,{scaleY:.84,scaleX:1.12,duration:.08,ease:`power1.out`},.8).to(r,{scaleY:1,scaleX:1,duration:.5,ease:`elastic.out(1.2, 0.4)`},.88),o&&n.to(o,{rotation:-50,duration:.2,ease:`back.out(2)`,...t.o(o)},.16).to(o,{rotation:0,duration:.2},.62),s&&n.to(s,{rotation:50,duration:.2,ease:`back.out(2)`,...t.o(s)},.16).to(s,{rotation:0,duration:.2},.62),a&&n.to(a,{scale:.55,opacity:.05,duration:.34,yoyo:!0,repeat:1,transformOrigin:`50% 50%`},.16),c&&n.to(c,{rotation:30,duration:.8,ease:`elastic.out(1.4, 0.3)`,...t.o(c)},.8).to(c,{rotation:0,duration:.3},1.6),n.to(i,{rotation:5,duration:.11,yoyo:!0,repeat:5,ease:`sine.inOut`,...l},.95).to(i,{rotation:0,duration:.12},1.62),n.add(x(t,7),.92),y(n,t,!1,1.85),n}function C(t){let n=e.timeline(),r=t.one(`.c-snout`),i=t.q(`.p-nostril`),a=t.one(`.c-head`);return a&&n.to(a,{rotation:-3,duration:.25,yoyo:!0,repeat:1,ease:`sine.inOut`,...t.o(a)},0),r&&n.to(r,{y:-3,scaleY:1.06,scaleX:.95,duration:.09,yoyo:!0,repeat:5,ease:`sine.inOut`,...t.o(r)},.05),i.length&&n.to(i,{scale:1.25,duration:.09,yoyo:!0,repeat:5,transformOrigin:`50% 50%`},.05),n}function w(t){let n=e.timeline(),r=t.one(`.p-curl`);return r&&n.to(r,{rotation:-28,scale:1.12,duration:.16,ease:`power2.out`,...t.o(r)}).to(r,{rotation:0,scale:1,duration:1,ease:`elastic.out(1.3, 0.25)`}),n}function T(t){let n=e.timeline(),r=Math.random()<.5?t.one(`.c-ear-l`):t.one(`.c-ear-r`);if(!r)return n;let i=r.classList.contains(`c-ear-l`)?1:-1;return n.to(r,{rotation:16*i,duration:.1,ease:`power2.out`,...t.o(r)}).to(r,{rotation:0,duration:.8,ease:`elastic.out(1.4, 0.3)`}),n}function E(e){let t=Math.random();return t<.4?C(e):t<.75?w(e):T(e)}function D(t,n){let r=e.timeline(),i=t.one(`.c-arm-l`),a=t.one(`.p-roll`),o=t.one(`.c-ear-l`);if(!i||!a)return r;let s={svgOrigin:`160 ${u}`};return r.call(()=>b(t,!0),[],0),r.to(a,{rotation:-5,duration:.25,ease:`power2.out`,...s},0),n===`wave`?(r.to(i,{rotation:-128,x:26,y:-46,duration:.28,ease:`back.out(1.8)`,...t.o(i)},0).to(i,{rotation:-150,duration:.17,yoyo:!0,repeat:5,ease:`sine.inOut`}).to(i,{rotation:0,x:0,y:0,duration:.34,ease:`power2.inOut`}),o&&r.to(o,{rotation:-12,duration:.17,yoyo:!0,repeat:5,...t.o(o)},.28)):r.to(i,{rotation:-100,x:28,y:-30,duration:.25,ease:`back.out(2)`,...t.o(i)},0).to({},{duration:.8}).to(i,{rotation:0,x:0,y:0,duration:.3,ease:`power2.inOut`}),r.to(a,{rotation:0,duration:.3,ease:`power2.inOut`},`<`),r.call(()=>b(t,!1)),r}function O(t,n){for(let r of t.q(`.c-arm-l, .c-arm-r`)){let i=r.querySelector(`.p-leg`);if(i)for(let a of e.getTweensOf(r)){let e=a.vars.rotation;typeof e==`number`&&a.parent&&a.parent.to(i,{rotation:-e*n,duration:a.duration(),ease:a.vars.ease??`power1.out`,...t.o(i)},a.startTime())}}}function k(t,n){let r=n.emote;n.emote=async n=>{if(n===`wave`||n===`point`)await D(t,n);else if(n===`cheer`){b(t,!0);let e=r(n);O(t,.6);try{await e}finally{b(t,!1)}}else if(n===`sad`){let i=t.one(`.p-tongue`);i&&e.to(i,{opacity:0,duration:.15});try{await r(n)}finally{i&&e.to(i,{opacity:1,duration:.2})}}else await r(n)}}var A={id:`pig`,svg:v,special:S,idleExtras:E,setup:k};export{A as default};