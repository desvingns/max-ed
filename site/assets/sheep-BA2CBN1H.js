import{t as e}from"./gsap-CvDoa17S.js";var t=`#3B2F4F`,n=`#FFFFFF`,r=`#EDE7DA`,i=`#5A5068`,a=`#4A3F55`,o=`#FF9EB1`,s=`#352A45`,c=`#FF8FC8`,l=`#E56FAE`,u=[[178,305,38],[222,305,38],[130,292,38],[270,292,38],[92,248,40],[308,248,40],[112,202,40],[288,202,40],[155,180,40],[245,180,40],[200,172,40]],d=[[152,124,22],[248,124,22],[172,104,27],[228,104,27],[200,92,30]];function f(e,i){let a=(e,t,n,r,i)=>`<circle data-p="${e}" data-r="${r}" cx="${t}" cy="${n}" r="${r}" fill="${i}"/>`;return{line:e.map(([e,n,r],o)=>a(`${i}${o}`,e,n,r+8,t)).join(``),fill:e.map(([e,t,o],s)=>a(`${i}${s}`,e,t,o,r)+a(`${i}${s}`,e-4,t-6,o-8,n)).join(``)}}var p=`M200 94 C254 94 285 122 285 166 C285 216 254 260 200 260 C146 260 115 216 115 166 C115 122 146 94 200 94 Z`;function m(e){let r=f(u,`b`),m=f(d,`t`),h=(e,n)=>`
      <g class="c-eye">
        <ellipse cx="${e}" cy="${n}" rx="26" ry="30" fill="#fff" stroke="${t}" stroke-width="6"/>
        <g class="c-pupil" data-range="8">
          <circle cx="${e+1}" cy="${n-1}" r="17.5" fill="#2A2238"/>
          <circle cx="${e+7}" cy="${n-9}" r="7" fill="#fff"/>
          <circle cx="${e-5}" cy="${n+7}" r="3.5" fill="#fff"/>
        </g>
      </g>`,g=(e,n,r,i,a,o)=>`
    <g class="${e}" data-origin="${n} ${r+12}">
      <rect x="${n-16}" y="${r}" width="32" height="${i-r}" rx="16" fill="${a}"/>
      <rect x="${n+3}" y="${r}" width="13" height="${i-r-6}" rx="6.5" fill="${o}"/>
      <path d="M${n-16} ${i-14} Q${n} ${i-8} ${n+16} ${i-14} V${i-16} A16 16 0 0 1 ${n-16} ${i-16} Z" fill="${s}"/>
      <path d="M${n-15} ${i-14} Q${n} ${i-8} ${n+15} ${i-14}" fill="none" stroke="${t}" stroke-width="5" stroke-linecap="round"/>
      <rect x="${n-16}" y="${r}" width="32" height="${i-r}" rx="16" fill="none" stroke="${t}" stroke-width="8"/>
    </g>`;return`
  <defs>
    <clipPath id="${e}face"><path d="${p}"/></clipPath>
  </defs>
  <ellipse class="c-shadow" cx="200" cy="387" rx="118" ry="13" fill="#000" fill-opacity="0.12"/>
  <g class="c-root">
    ${g(`sh-leg-bl`,128,292,367,a,`#3F3549`)}
    ${g(`sh-leg-br`,272,292,367,a,`#3F3549`)}
    ${g(`c-leg-l`,174,300,384,i,a)}
    ${g(`c-leg-r`,226,300,384,i,a)}
    <g class="c-body" data-origin="200 350">
      ${r.line}
      <ellipse cx="200" cy="240" rx="108" ry="70" fill="${t}"/>
      <ellipse cx="200" cy="240" rx="100" ry="62" fill="${n}"/>
      ${r.fill}
    </g>
    <g class="c-head" data-origin="200 258">
      <g class="c-ear-l" data-origin="134 154">
        <ellipse cx="96" cy="164" rx="38" ry="18" transform="rotate(20 96 164)" fill="${i}" stroke="${t}" stroke-width="8"/>
        <ellipse cx="94" cy="163" rx="22" ry="8" transform="rotate(20 94 163)" fill="${o}"/>
      </g>
      <g class="c-ear-r" data-origin="266 154">
        <ellipse cx="304" cy="164" rx="38" ry="18" transform="rotate(-20 304 164)" fill="${i}" stroke="${t}" stroke-width="8"/>
        <ellipse cx="306" cy="163" rx="22" ry="8" transform="rotate(-20 306 163)" fill="${o}"/>
      </g>
      <path d="${p}" fill="${a}"/>
      <g clip-path="url(#${e}face)"><path d="${p}" transform="translate(-10 -12)" fill="${i}"/></g>
      <path d="M128 156 Q126 186 137 208" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.28"/>
      <path d="${p}" fill="none" stroke="${t}" stroke-width="8"/>
      <ellipse cx="200" cy="229" rx="36" ry="22" fill="#766A88"/>
      <ellipse class="c-cheek" cx="140" cy="220" rx="14" ry="9" fill="${o}"/>
      <ellipse class="c-cheek" cx="260" cy="220" rx="14" ry="9" fill="${o}"/>
      <g class="c-eyes-open">
        ${h(163,178)}
        ${h(237,178)}
      </g>
      <g class="c-eyes-happy">
        <path d="M140 186 Q163 152 186 186 Q163 172 140 186 Z" fill="#fff" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M214 186 Q237 152 260 186 Q237 172 214 186 Z" fill="#fff" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
      </g>
      <path d="M189 214 Q200 208 211 214 Q210 224 200 226 Q190 224 189 214 Z" fill="${o}" stroke="${t}" stroke-width="4" stroke-linejoin="round"/>
      <path class="c-mouth-closed" d="M188 234 Q200 244 212 234" fill="none" stroke="${t}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <g class="c-mouth-open" data-origin="200 230">
        <path d="M182 230 Q200 226 218 230 Q218 257 200 257 Q182 257 182 230 Z" fill="#5A2A3A" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
        <ellipse cx="200" cy="249" rx="10" ry="5.5" fill="#FF7A93"/>
      </g>
      <g class="sh-tuft" data-origin="200 130">
        ${m.line}
        ${m.fill}
        <g class="sh-bow" data-origin="254 90">
          <g transform="rotate(-14 254 90)">
            <path d="M254 90 L228 72 Q219 90 228 109 Z" fill="${c}" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
            <path d="M254 90 L280 72 Q289 90 280 109 Z" fill="${c}" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
            <path d="M231 80 Q228 90 231 100" fill="none" stroke="${l}" stroke-width="4" stroke-linecap="round"/>
            <path d="M277 80 Q280 90 277 100" fill="none" stroke="${l}" stroke-width="4" stroke-linecap="round"/>
            <ellipse cx="254" cy="90" rx="9" ry="10" fill="${c}" stroke="${t}" stroke-width="5"/>
            <circle cx="251" cy="87" r="2.6" fill="#fff" opacity="0.7"/>
          </g>
        </g>
      </g>
    </g>
  </g>`}function h(t){let n=e.timeline(),r=t.one(`.c-root`),i=t.one(`.c-head`),a=t.one(`.sh-tuft`),o=t.one(`.c-ear-l`),s=t.one(`.c-ear-r`),c=t.one(`.c-leg-l`),l=t.one(`.c-leg-r`),u=t.one(`.c-mouth-open`),d=t.one(`.c-mouth-closed`),f=t.q(`[data-p^="b"]`),p=t.q(`[data-p^="t"]`);n.to(r,{scaleY:.86,scaleX:1.1,duration:.14,ease:`power2.in`,svgOrigin:`200 385`},0),o&&n.to(o,{rotation:-14,duration:.14,...t.o(o)},0),s&&n.to(s,{rotation:14,duration:.14,...t.o(s)},0),n.to(r,{y:-64,scaleY:1.08,scaleX:.95,duration:.26,ease:`power2.out`},.14),o&&n.to(o,{rotation:30,duration:.22,ease:`back.out(2)`},.14),s&&n.to(s,{rotation:-30,duration:.22,ease:`back.out(2)`},.14),c&&n.to(c,{rotation:16,duration:.2,...t.o(c)},.14),l&&n.to(l,{rotation:-16,duration:.2,...t.o(l)},.14),d&&n.to(d,{opacity:0,duration:.05},.16),u&&n.to(u,{opacity:1,scaleY:1,duration:.12,...t.o(u)},.16),i&&(n.to(i,{rotation:-7,duration:.18,...t.o(i)},.16),n.to(i,{rotation:-3,duration:.06,yoyo:!0,repeat:9,ease:`sine.inOut`},.34)),u&&n.to(u,{scaleY:.7,duration:.06,yoyo:!0,repeat:9,ease:`sine.inOut`},.34),n.to(r,{y:0,scaleY:1,scaleX:1,duration:.24,ease:`power2.in`},.44),c&&l&&n.to([c,l],{rotation:0,duration:.2},.44),n.to(r,{scaleY:.88,scaleX:1.08,duration:.08,ease:`power1.out`},.68),n.to(r,{scaleY:1,scaleX:1,duration:.45,ease:`elastic.out(1.1, 0.4)`},.76);let m=(e,t,r)=>{let i=[...new Set(e.map(e=>e.dataset.p))];i.forEach((a,o)=>{let s=e.filter(e=>e.dataset.p===a),c=r+o*7%i.length*.018;for(let e of s){let r=Number(e.dataset.r);n.to(e,{attr:{r:r+t},duration:.09,ease:`sine.out`},c).to(e,{attr:{r:r-t*.4},duration:.1,ease:`sine.inOut`},c+.09).to(e,{attr:{r},duration:.35,ease:`elastic.out(1.2, 0.4)`},c+.19)}})};m(f,6,.68),m(p,4,.72),a&&n.to(a,{y:-8,duration:.1,yoyo:!0,repeat:1,ease:`sine.out`},.68);let h=t.one(`.sh-bow`);return h&&n.to(h,{rotation:18,duration:.1,ease:`power2.out`,...t.o(h)},.7).to(h,{rotation:0,duration:.6,ease:`elastic.out(1.3, 0.3)`},.8),o&&s&&n.to([o,s],{rotation:0,duration:.6,ease:`elastic.out(1.2, 0.35)`},.72),i&&n.to(i,{rotation:0,duration:.3,ease:`sine.out`},.96),u&&n.to(u,{opacity:0,scaleY:.05,duration:.12},1),d&&n.to(d,{opacity:1,duration:.08},1.02),n}function g(t){let n=e.timeline(),r=Math.random();if(r<.45){let e=Math.random()<.5,r=t.one(e?`.c-ear-l`:`.c-ear-r`);if(!r)return n;let i=e?26:-26;n.to(r,{rotation:i,duration:.08,ease:`power2.out`,...t.o(r)}).to(r,{rotation:0,duration:.45,ease:`elastic.out(1.2, 0.35)`}),Math.random()<.5&&n.to(r,{rotation:i*.7,duration:.07,ease:`power2.out`}).to(r,{rotation:0,duration:.45,ease:`elastic.out(1.2, 0.35)`})}else if(r<.85){let e=t.one(`.c-mouth-closed`);if(!e)return n;n.to(e,{x:3,duration:.1,ease:`sine.inOut`});for(let t=0;t<5;t++)n.to(e,{x:t%2?3:-3,duration:.14,ease:`sine.inOut`});n.to(e,{x:0,duration:.12,ease:`sine.out`})}else{let e=t.one(`.sh-tuft`);if(!e)return n;n.to(e,{rotation:5,duration:.15,ease:`sine.out`,...t.o(e)}).to(e,{rotation:-4,duration:.2,ease:`sine.inOut`}).to(e,{rotation:0,duration:.5,ease:`elastic.out(1, 0.4)`})}return n}var _={id:`sheep`,svg:m,special:h,idleExtras:g};export{_ as default};