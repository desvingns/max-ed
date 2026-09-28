import{t as e}from"./gsap-CvDoa17S.js";var t=`#3B2F4F`,n=`#2EC4B6`,r=`#20A396`,i=`#BFF3E8`,a=`#FFC43D`,o=`#E6A92C`,s=`#F2A516`,c=[`#FFB23F`,`#FF5A5F`,`#3DC1F2`],l=[`#FF5A5F`,`#4D96FF`,`#FFD93D`],u=`#FF5A5F`,d=`#E0444A`,f=`#FFD93D`,p=`#FF9EB1`,m=`#2A2238`,h=`#5A2A3A`,g=`#FF7A93`,_=`stroke="${t}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"`,v=`stroke="${t}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`,y=`stroke="${t}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`,b=`M200 210 C252 210 276 258 276 296 C276 336 244 358 200 358 C156 358 124 336 124 296 C124 258 148 210 200 210 Z`,x={cx:200,cy:160,rx:84,ry:78},S={x:158,y:140},C={x:242,y:140},w={x:242,y:320},T={x:200,y:104},E={x:138,y:246},D={x:262,y:246},O=(e,t,n,r)=>`M0 0 H400 V400 H0 Z M${e-n} ${t} a${n} ${r} 0 1 0 ${n*2} 0 a${n} ${r} 0 1 0 ${-n*2} 0 Z`,k=(e,t)=>{let n=-e*.7;return`M0 0 C${-t*.25} ${-e*.25} ${-t} ${-e*.45} ${-t} ${n} A${t} ${t} 0 0 1 ${t} ${n} C${t} ${-e*.45} ${t*.25} ${-e*.25} 0 0 Z`},A=e=>{let t=e/100;return`M-4 -7 C${28*t} -9 ${60*t} -16 ${82*t} -15 C${102*t} -14 ${104*t} 15 ${83*t} 16 C${60*t} 17 ${28*t} 9 -4 7 Z`},j=`M-16 -8 C-30 12 -30 44 -24 64 Q-27 85 -11 79 Q-2 93 6 79 Q21 84 19 62 C24 40 24 10 16 -8 C8 -20 -8 -20 -16 -8 Z`;function M(e,t,n){return`<g class="tb-tf tb-tf${e}" data-origin="${w.x} ${w.y}">
    <g transform="translate(${w.x} ${w.y}) rotate(${t})">
      <path d="${A(n)}" fill="${l[e]}" ${_}/>
      <path d="M${n*.3} -3 C${n*.48} -6 ${n*.64} -8 ${n*.8} -8" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="5" stroke-linecap="round"/>
    </g></g>`}function N(e,t,n,r,i,a){return`<g class="tb-cr tb-cr${e}" data-origin="${t} ${n}">
    <g transform="translate(${t} ${n}) rotate(${r})">
      <path d="${k(i,a)}" fill="${c[e]}" ${v}/>
      <ellipse cx="${-a*.35}" cy="${-i*.72}" rx="${a*.28}" ry="${a*.5}" fill="#fff" opacity="0.5" transform="rotate(-12 ${-a*.35} ${-i*.72})"/>
    </g></g>`}function P(e,t){let i=e===`l`?E:D,a=e===`l`?`translate(${i.x} ${i.y}) rotate(18)`:`translate(${i.x} ${i.y}) scale(-1 1) rotate(18)`;return`<g class="c-wing-${e}" data-origin="${i.x} ${i.y}"><g class="tb-w${e}" data-origin="${i.x} ${i.y}">
    <g transform="${a}">
      <path d="${j}" fill="${n}"/>
      <g clip-path="url(#${t}wc)">
        <path d="M-40 50 C-14 60 12 58 40 46 V120 H-40 Z" fill="${r}"/>
        <ellipse cx="-12" cy="14" rx="7" ry="16" fill="#fff" opacity="0.45" transform="rotate(10 -12 14)"/>
      </g>
      <path d="M-11 79 Q-10 70 -8 62 M6 79 Q7 70 6 62" fill="none" ${y}/>
      <path d="${j}" fill="none" ${_}/>
    </g></g></g>`}function F(e){let n=t=>e===`l`?t:400-t,r={x:n(184),y:344},i={x:n(181),y:374},a=(t,r,i)=>`<ellipse cx="${n(t)}" cy="${r}" rx="12" ry="7" transform="rotate(${e===`l`?i:-i} ${n(t)} ${r})" fill="${s}" ${v}/>`;return`<g class="c-leg-${e}" data-origin="${r.x} ${r.y}">
    <path d="M${r.x} ${r.y} L${i.x} ${i.y}" stroke="${t}" stroke-width="15" stroke-linecap="round"/>
    <path d="M${r.x} ${r.y} L${i.x} ${i.y}" stroke="${s}" stroke-width="6" stroke-linecap="round"/>
    ${a(170,378,-14)}${a(191,380,10)}
  </g>`}function I(){return`<g transform="translate(134 79) rotate(3)">
    <path d="M14 -6 H7 C1 -6 1 6 7 6 H14 Z" fill="#FF8FC8" ${y}/>
    <rect x="14" y="-6" width="10" height="12" fill="#C9CDE0" ${y}/>
    <rect x="24" y="-6" width="76" height="12" fill="${f}" ${y}/>
    <path d="M28 -1 H96" stroke="#F2B92A" stroke-width="3" stroke-linecap="round"/>
    <path d="M100 -6 L120 0 L100 6 Z" fill="#FFE3A3" ${y}/>
    <path d="M113 -2.2 L120 0 L113 2.2 Z" fill="${t}" stroke="${t}" stroke-width="2" stroke-linejoin="round"/>
  </g>`}function L(e,t,n){return`<g class="c-eye" data-origin="${e.x} ${e.y}">
    <ellipse cx="${e.x}" cy="${e.y}" rx="18" ry="22" fill="#fff" ${y}/>
    <g clip-path="url(#${t}${n})"><g class="c-pupil" data-range="7">
      <circle cx="${e.x+(e.x<200?3:-3)}" cy="${e.y-3}" r="12" fill="${m}"/>
      <circle cx="${e.x-2}" cy="${e.y-10}" r="5" fill="#fff"/>
      <circle cx="${e.x+6.5}" cy="${e.y+2}" r="2.4" fill="#fff"/>
    </g></g>
  </g>`}function R(e){let c=x,l=`M166 160 C166 132 234 132 234 160 C234 182 220 200 205 212 Q200 217 195 212 C180 200 166 182 166 160 Z`;return`
  <defs>
    <clipPath id="${e}bc"><path d="${b}"/></clipPath>
    <clipPath id="${e}hc"><ellipse cx="${c.cx}" cy="${c.cy}" rx="${c.rx}" ry="${c.ry}"/></clipPath>
    <clipPath id="${e}wc"><path d="${j}"/></clipPath>
    <clipPath id="${e}bk"><path d="${l}"/></clipPath>
    <clipPath id="${e}el"><ellipse cx="${S.x}" cy="${S.y}" rx="16" ry="20"/></clipPath>
    <clipPath id="${e}er"><ellipse cx="${C.x}" cy="${C.y}" rx="16" ry="20"/></clipPath>
  </defs>
  <ellipse class="c-shadow" cx="200" cy="384" rx="92" ry="12" fill="#000" opacity="0.12"/>
  <g class="c-root" data-origin="200 250">
    <g class="c-tail" data-origin="${w.x} ${w.y}"><g class="tb-tail-in" data-origin="${w.x} ${w.y}">
      ${M(2,28,94)}
      ${M(0,-34,100)}
      ${M(1,-3,110)}
    </g></g>
    ${F(`l`)}${F(`r`)}
    <g class="c-body" data-origin="200 385">
      <path d="${b}" fill="${n}"/>
      <g clip-path="url(#${e}bc)">
        <ellipse cx="200" cy="312" rx="52" ry="54" fill="${i}"/>
        <path d="M186 284 q7 7 14 0 q7 7 14 0 M193 300 q7 7 14 0" fill="none" stroke="#8FDCCD" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${O(186,274,84,82)}" fill="${r}" fill-rule="evenodd" opacity="0.9"/>
      </g>
      <path d="${b}" fill="none" ${_}/>
      <g class="tb-tie">
        <path d="M200 250 L169 234 Q160 250 169 266 Z" fill="${u}" ${v}/>
        <path d="M200 250 L231 234 Q240 250 231 266 Z" fill="${u}" ${v}/>
        <path d="M175 259 L195 252 M225 259 L205 252" stroke="${d}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="200" cy="250" r="9.5" fill="${u}" ${v}/>
        <circle cx="197" cy="247" r="2.6" fill="#fff" opacity="0.7"/>
      </g>
    </g>
    ${P(`l`,e)}${P(`r`,e)}
    <g class="c-head" data-origin="200 232"><g class="tb-head-in" data-origin="200 232">
      <g class="c-crest" data-origin="${T.x} ${T.y}">
        ${N(0,193,110,-38,72,15)}
        ${N(2,207,110,38,72,15)}
        ${I()}
        ${N(1,200,108,0,80,17)}
      </g>
      <ellipse cx="${c.cx}" cy="${c.cy}" rx="${c.rx}" ry="${c.ry}" fill="${n}"/>
      <g clip-path="url(#${e}hc)">
        <path d="${O(190,152,86,78)}" fill="${r}" fill-rule="evenodd" opacity="0.9"/>
        <ellipse cx="150" cy="108" rx="16" ry="8" fill="#fff" opacity="0.5" transform="rotate(-38 150 108)"/>
      </g>
      <ellipse cx="${c.cx}" cy="${c.cy}" rx="${c.rx}" ry="${c.ry}" fill="none" ${_}/>
      <ellipse cx="${S.x}" cy="${S.y+4}" rx="29" ry="32" fill="#fff" ${y}/>
      <ellipse cx="${C.x}" cy="${C.y+4}" rx="29" ry="32" fill="#fff" ${y}/>
      <ellipse class="c-cheek" cx="151" cy="169" rx="10" ry="5.5" fill="${p}"/>
      <ellipse class="c-cheek" cx="249" cy="169" rx="10" ry="5.5" fill="${p}"/>
      <g class="c-eyes-open">${L(S,e,`el`)}${L(C,e,`er`)}</g>
      <g class="c-eyes-happy">
        <path d="M142 146 Q158 124 174 146" fill="none" stroke="${t}" stroke-width="7" stroke-linecap="round"/>
        <path d="M226 146 Q242 124 258 146" fill="none" stroke="${t}" stroke-width="7" stroke-linecap="round"/>
      </g>
      <path class="c-brow-l" data-origin="164 101" d="M151 105 Q163 97 178 101" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round"/>
      <path class="c-brow-r" data-origin="236 101" d="M249 105 Q237 97 222 101" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round"/>
      <path d="M178 188 C180 210 190 226 200 226 C210 226 220 210 222 188 Z" fill="${s}" ${v}/>
      <g class="c-mouth-closed">
        <path d="M171 184 Q165 188 160 181 M229 184 Q235 188 240 181" fill="none" ${y}/>
      </g>
      <g class="c-mouth-open" data-origin="200 190">
        <path d="M176 184 L224 184 C228 226 216 252 200 254 C184 252 172 226 176 184 Z" fill="${h}" ${v}/>
        <path d="M184 242 C188 230 212 230 216 242 C210 251 190 251 184 242 Z" fill="${g}"/>
        <path d="M176 232 C180 254 190 264 200 264 C210 264 220 254 224 232 C214 244 186 244 176 232 Z" fill="${s}" ${v}/>
      </g>
      <path d="${l}" fill="${a}"/>
      <g clip-path="url(#${e}bk)">
        <path d="${O(192,154,38,46)}" fill="${o}" fill-rule="evenodd"/>
        <ellipse cx="182" cy="150" rx="9" ry="5" fill="#fff" opacity="0.55" transform="rotate(-22 182 150)"/>
      </g>
      <path d="${l}" fill="none" ${v}/>
      <ellipse cx="190" cy="147" rx="2.8" ry="2" fill="${t}"/>
      <ellipse cx="210" cy="147" rx="2.8" ry="2" fill="${t}"/>
    </g></g>
  </g>`}function z(t){let n=t.one(`.c-crest`),r=e.timeline();return n&&r.to(n,{scaleY:1.22,scaleX:1.06,duration:.1,ease:`power2.out`,...t.o(n)}).to(n,{scaleY:1,scaleX:1,duration:.5,ease:`elastic.out(1.2, 0.35)`}),r}function B(t){let n=t.one(`.c-root`),r=t.one(`.c-crest`),i=t.one(`.tb-tail-in`),[a,o,s]=[t.one(`.tb-tf0`),t.one(`.tb-tf1`),t.one(`.tb-tf2`)],[c,,l]=[t.one(`.tb-cr0`),t.one(`.tb-cr1`),t.one(`.tb-cr2`)],u=t.one(`.tb-wl`),d=t.one(`.tb-wr`),f=t.one(`.c-eyes-open`),p=t.one(`.c-eyes-happy`),m={svgOrigin:`200 385`},h=e.timeline();if(!n)return h;h.to(n,{scaleY:.86,scaleX:1.1,duration:.14,ease:`power2.in`,...m}),r&&h.to(r,{scaleY:.8,duration:.14,ease:`power2.in`,...t.o(r)},0),h.to(n,{y:-54,scaleY:1.06,duration:.26,ease:`power2.out`,...m},.14);for(let e=0;e<4;e++)h.to(n,{scaleX:e%2?1:-1,duration:.125,ease:`sine.inOut`,...m},.14+e*.125);h.to(n,{y:0,scaleY:1,duration:.22,ease:`power2.in`},.42),h.to(n,{scaleY:.9,scaleX:1.08,duration:.08,ease:`power2.out`},.64),h.to(n,{scaleY:1,scaleX:1,duration:.45,ease:`elastic.out(1.1, 0.4)`},.72),f&&p&&h.set(f,{opacity:0},.64).set(p,{opacity:1},.64),r&&h.to(r,{scaleY:1.3,scaleX:1.12,duration:.5,ease:`elastic.out(1.3, 0.35)`},.66),c&&h.to(c,{rotation:-16,duration:.4,ease:`back.out(2.5)`,...t.o(c)},.66),l&&h.to(l,{rotation:16,duration:.4,ease:`back.out(2.5)`,...t.o(l)},.66),i&&h.to(i,{scale:1.14,rotation:-10,duration:.45,ease:`back.out(2.2)`,...t.o(i)},.66),a&&h.to(a,{rotation:-22,duration:.45,ease:`back.out(2.2)`,...t.o(a)},.7),s&&h.to(s,{rotation:14,duration:.45,ease:`back.out(2.2)`,...t.o(s)},.7),o&&h.to(o,{rotation:-4,duration:.45,ease:`back.out(2.2)`,...t.o(o)},.7),u&&h.to(u,{rotation:55,duration:.3,ease:`back.out(2)`,...t.o(u)},.66),d&&h.to(d,{rotation:-55,duration:.3,ease:`back.out(2)`,...t.o(d)},.66);let g=[r,c,l,i,a,o,s,u,d].filter(Boolean);return h.to(g,{rotation:0,scale:1,scaleX:1,scaleY:1,duration:.4,ease:`power2.inOut`},1.55),f&&p&&h.set(f,{opacity:1},1.75).set(p,{opacity:0},1.75),h}function V(t){let n=t.one(`.tb-head-in`),r=t.one(`.c-crest`),i=e.timeline();if(!n)return i;let a=t.o(n);for(let e=0;e<4;e++){let o=e*.3;i.to(n,{y:7,rotation:e%2?-5:5,duration:.12,ease:`power2.in`,...a},o).to(n,{y:0,duration:.18,ease:`power2.out`},o+.12),r&&i.fromTo(r,{rotation:e%2?7:-7},{rotation:0,duration:.26,ease:`elastic.out(1.2, 0.4)`,...t.o(r)},o+.1)}return i.to(n,{rotation:0,duration:.2,ease:`sine.inOut`},1.2),i}function H(t){let n=t.one(`.tb-head-in`),r=t.one(`.tb-wr`),i=e.timeline();if(!n||!r)return i;i.to(n,{rotation:18,x:8,y:6,duration:.3,ease:`sine.inOut`,...t.o(n)},0).to(r,{rotation:-28,duration:.3,ease:`sine.inOut`,...t.o(r)},.05);for(let e=0;e<3;e++)i.to(n,{rotation:22,y:9,duration:.09,ease:`sine.inOut`,yoyo:!0,repeat:1},.35+e*.2);return i.to(n,{rotation:0,x:0,y:0,duration:.3,ease:`back.out(1.6)`},1).to(r,{rotation:0,duration:.3,ease:`back.out(1.6)`},1),i}function U(e){return Math.random()<.6?V(e):H(e)}var W={id:`tarabar`,svg:R,special:B,idleExtras:U};export{z as crestPop,W as default};