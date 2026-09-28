import{t as e}from"./gsap-CvDoa17S.js";var t=`#3B2F4F`,n=`#2A2238`,r=`#B7773F`,i=`#96602F`,a=`#F2D2A9`,o=`#7A5230`,s=`#5E3D22`,c=`#FFC93C`,l=`#E6AA1F`,u=`#4D96FF`,d=`#3A7EE6`,f=`#5A2A3A`,p=`#FF7A93`,m=`#FF9EB1`,h=`M200 212 C256 212 290 262 300 310 C310 358 276 382 200 382 C124 382 90 358 100 310 C110 262 144 212 200 212 Z`,g=`M200 88 C264 88 298 128 298 172 C298 222 258 252 200 252 C142 252 102 222 102 172 C102 128 136 88 200 88 Z`,_=`M128 102 C124 56 158 30 200 30 C242 30 276 56 272 102 Z`,v=`M104 94 Q200 98 296 94 Q310 102 297 110 Q200 120 103 110 Q90 102 104 94 Z`,y=(e,r)=>`
  <g class="c-eye" data-origin="${e} ${r}">
    <ellipse cx="${e}" cy="${r}" rx="21" ry="25" fill="#fff" stroke="${t}" stroke-width="6"/>
    <g class="c-pupil" data-range="8">
      <ellipse cx="${e+1}" cy="${r-3}" rx="14" ry="17" fill="${n}"/>
      <circle cx="${e-4}" cy="${r-11}" r="6" fill="#fff"/>
      <circle cx="${e+5}" cy="${r+3}" r="2.6" fill="#fff"/>
    </g>
  </g>`,b=e=>{let n=e===`l`?-1:1,i=200+n*60,o=200+n*80;return`
  <g class="c-arm-${e}" data-origin="${i} 270">
    <path d="M${i} 270 L${o} 320" stroke="${t}" stroke-width="46" stroke-linecap="round" fill="none"/>
    <path d="M${i} 270 L${o} 320" stroke="${r}" stroke-width="30" stroke-linecap="round" fill="none"/>
    <circle cx="${o}" cy="326" r="20" fill="${a}" stroke="${t}" stroke-width="8"/>
    <ellipse cx="${o-n*16}" cy="320" rx="8" ry="7" fill="${a}" stroke="${t}" stroke-width="5"/>
  </g>`},x=(e,n)=>`
  <g class="t-note ${e}" opacity="0">
    <path d="M0 0 L0 -26 L12 -20" fill="none" stroke="${t}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="-5" cy="1" rx="8" ry="6" fill="${n}" stroke="${t}" stroke-width="4" transform="rotate(-20 -5 1)"/>
  </g>`,S=e=>`
<defs>
  <clipPath id="${e}body"><path d="${h}"/></clipPath>
  <clipPath id="${e}head"><path d="${g}"/></clipPath>
  <clipPath id="${e}dome"><path d="${_}"/></clipPath>
  <clipPath id="${e}brim"><path d="${v}"/></clipPath>
  <clipPath id="${e}tail"><ellipse cx="322" cy="354" rx="62" ry="30"/></clipPath>
</defs>
<ellipse class="c-shadow" cx="214" cy="386" rx="124" ry="12" fill="#000" opacity="0.12"/>
<g class="c-root">
  <g class="c-tail" data-origin="262 354">
    <g transform="rotate(-24 262 354)">
      <g class="t-paddle">
        <ellipse cx="322" cy="354" rx="62" ry="30" fill="${o}"/>
        <g clip-path="url(#${e}tail)" fill="none" stroke="${s}" stroke-width="4" stroke-linecap="round">
          <path d="M292 324 L322 384 M320 324 L350 384 M348 324 L378 384 M330 324 L300 384 M358 324 L328 384 M386 324 L356 384"/>
          <path d="M292 334 Q330 326 368 336" stroke="#fff" stroke-opacity="0.3" stroke-width="6"/>
        </g>
        <ellipse cx="322" cy="354" rx="62" ry="30" fill="none" stroke="${t}" stroke-width="8"/>
      </g>
    </g>
  </g>

  <g class="c-body" data-origin="200 385">
    <path d="${h}" fill="${i}"/>
    <g clip-path="url(#${e}body)">
      <path d="${h}" fill="${r}" transform="translate(-16 -10)"/>
      <ellipse cx="200" cy="300" rx="52" ry="46" fill="${a}"/>
      <path d="M80 322 Q200 344 320 322 L320 348 Q200 370 80 348 Z" fill="${u}" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M80 341 Q200 363 320 341 L320 348 Q200 370 80 348 Z" fill="${d}"/>
    </g>
    <path d="${h}" fill="none" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
    <rect x="185" y="331" width="30" height="26" rx="7" fill="${c}" stroke="${t}" stroke-width="5"/>
    <rect x="195" y="339" width="10" height="10" rx="3" fill="${u}"/>
    <g transform="rotate(14 240 330)">
      <rect x="233" y="288" width="15" height="56" rx="3" fill="#FF5A5F" stroke="${t}" stroke-width="5"/>
      <rect x="233" y="282" width="15" height="12" rx="4" fill="#FF8FC8" stroke="${t}" stroke-width="5"/>
      <path d="M233 344 L240.5 362 L248 344 Z" fill="${a}" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M238 356 L240.5 362 L243 356 Z" fill="${t}"/>
    </g>
  </g>

  <g class="c-leg-l" data-origin="160 364">
    <ellipse cx="158" cy="373" rx="30" ry="12" fill="${o}" stroke="${t}" stroke-width="8"/>
  </g>
  <g class="c-leg-r" data-origin="240 364">
    <ellipse cx="242" cy="373" rx="30" ry="12" fill="${o}" stroke="${t}" stroke-width="8"/>
  </g>

  ${b(`l`)}
  ${b(`r`)}

  <g class="c-head" data-origin="200 248">
    <g class="c-ear-l" data-origin="118 142">
      <circle cx="110" cy="136" r="19" fill="${r}" stroke="${t}" stroke-width="8"/>
      <circle cx="108" cy="136" r="9" fill="${i}"/>
    </g>
    <g class="c-ear-r" data-origin="282 142">
      <circle cx="290" cy="136" r="19" fill="${r}" stroke="${t}" stroke-width="8"/>
      <circle cx="292" cy="136" r="9" fill="${i}"/>
    </g>
    <path d="${g}" fill="${i}"/>
    <g clip-path="url(#${e}head)">
      <path d="${g}" fill="${r}" transform="translate(-12 -10)"/>
      <path d="M118 196 Q112 178 118 162" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="7" stroke-linecap="round"/>
    </g>
    <path d="${g}" fill="none" stroke="${t}" stroke-width="8"/>

    <path d="M200 186 C216 176 254 180 258 210 C262 240 232 250 200 248 C168 250 138 240 142 210 C146 180 184 176 200 186 Z" fill="${a}"/>
    <ellipse class="c-cheek" cx="146" cy="206" rx="16" ry="10" fill="${m}"/>
    <ellipse class="c-cheek" cx="254" cy="206" rx="16" ry="10" fill="${m}"/>

    <g class="c-eyes-open">
      ${y(162,156)}
      ${y(238,156)}
    </g>
    <g class="c-eyes-happy">
      <path d="M142 160 Q162 136 182 160" fill="none" stroke="${t}" stroke-width="8" stroke-linecap="round"/>
      <path d="M218 160 Q238 136 258 160" fill="none" stroke="${t}" stroke-width="8" stroke-linecap="round"/>
    </g>
    <!-- brows use the character's own left/right (brow-l = screen right) so the rig's 'sad' tilt reads sad, not cross -->
    <path class="c-brow-r" data-origin="162 124" d="M150 126 Q162 120 174 124" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round"/>
    <path class="c-brow-l" data-origin="238 124" d="M226 124 Q238 120 250 126" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round"/>

    <g class="c-mouth-open" data-origin="200 206">
      <path d="M176 206 Q200 202 224 206 Q226 242 200 244 Q174 242 176 206 Z" fill="${f}" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
      <ellipse cx="200" cy="234" rx="13" ry="7" fill="${p}"/>
    </g>
    <path class="c-mouth-closed" d="M172 198 Q186 219 200 205 Q214 219 228 198" fill="none" stroke="${t}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M200 198 L200 206" stroke="${t}" stroke-width="5" stroke-linecap="round"/>
    <g class="t-teeth">
      <rect x="186" y="206" width="14" height="24" rx="4" fill="#fff" stroke="${t}" stroke-width="5"/>
      <rect x="200" y="206" width="14" height="24" rx="4" fill="#fff" stroke="${t}" stroke-width="5"/>
    </g>
    <ellipse cx="200" cy="190" rx="20" ry="13" fill="${t}"/>
    <ellipse cx="193" cy="185" rx="6" ry="3.5" fill="#fff" opacity="0.7"/>

    <g class="t-hat" data-origin="200 112">
      <path d="${_}" fill="${l}"/>
      <g clip-path="url(#${e}dome)">
        <path d="${_}" fill="${c}" transform="translate(-12 -6)"/>
        <path d="M188 104 L188 42 Q200 30 212 42 L212 104 Z" fill="#FFE07A" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
      </g>
      <path d="${_}" fill="none" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M146 74 Q152 52 172 42" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="7" stroke-linecap="round"/>
      <path d="${v}" fill="${c}"/>
      <path clip-path="url(#${e}brim)" d="M90 104 Q200 115 310 104 L310 124 L90 124 Z" fill="${l}"/>
      <path d="${v}" fill="none" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
    </g>
  </g>

  <g class="t-dust" fill="#FFF8EC" stroke="${t}" stroke-width="4" opacity="0">
    <circle cx="330" cy="374" r="11"/>
    <circle cx="358" cy="366" r="15"/>
    <circle cx="388" cy="373" r="11"/>
  </g>
  ${x(`t-note-1`,`#4D96FF`)}
  ${x(`t-note-2`,`#9B6BFF`)}
</g>`,C=t=>{let n=e.timeline(),r=t.one(`.t-paddle`),i=t.one(`.c-root`);if(r&&n.to(r,{rotation:-26,duration:.18,ease:`power2.out`,transformOrigin:`0% 50%`},0).to(r,{rotation:22,scaleY:.72,scaleX:1.06,duration:.1,ease:`power3.in`}).to(r,{rotation:-22,scaleY:1,scaleX:1,duration:.18,ease:`power2.out`}).to(r,{rotation:22,scaleY:.72,scaleX:1.06,duration:.1,ease:`power3.in`}).to(r,{rotation:0,scaleY:1,scaleX:1,duration:.5,ease:`elastic.out(1, 0.45)`}),i)for(let e of[.28,.56])n.to(i,{scaleY:.95,scaleX:1.03,duration:.06,svgOrigin:`200 385`},e).to(i,{scaleY:1,scaleX:1,duration:.2,ease:`back.out(2)`},e+.06);n.add(w(t),.28);let a=t.one(`.c-eyes-open`),o=t.one(`.c-eyes-happy`);a&&o&&(n.set(a,{opacity:0},.26).set(o,{opacity:1},.26),n.set(a,{opacity:1},1.15).set(o,{opacity:0},1.15));let s=t.one(`.t-dust`);if(s)for(let e of[.28,.56])n.fromTo(s,{opacity:1,scale:.4,y:0},{scale:1.15,y:-10,duration:.3,ease:`power2.out`,transformOrigin:`50% 100%`,immediateRender:!1},e).to(s,{opacity:0,duration:.18},e+.16);return n},w=(t,n=56)=>{let r=e.timeline(),i=t.one(`.t-hat`);return i&&r.to(i,{y:-n,rotation:-8,duration:.3,ease:`power2.out`,...t.o(i)},0).to(i,{rotation:8,duration:.3,ease:`sine.inOut`},.12).to(i,{y:0,rotation:0,duration:.24,ease:`power2.in`},.3).to(i,{scaleY:.86,scaleX:1.08,duration:.07},.54).to(i,{scaleY:1,scaleX:1,duration:.35,ease:`elastic.out(1.1, 0.4)`},.61),r},T=t=>{let n=e.timeline(),r=t.one(`.c-mouth-closed`);return r&&n.to(r,{scaleX:.7,duration:.2,transformOrigin:`50% 50%`,yoyo:!0,repeat:1,repeatDelay:1},0),t.q(`.t-note`).forEach((t,r)=>{let i=270+r*8;e.set(t,{x:i,y:204,opacity:0,scale:.5,rotation:0}),n.to(t,{opacity:1,scale:1.3,duration:.25,ease:`back.out(2)`},.1+r*.4).to(t,{x:i+62+r*12,y:130,rotation:r?-14:14,duration:.9,ease:`sine.out`},.1+r*.4).to(t,{opacity:0,duration:.3},.75+r*.4)}),n},E=t=>{let n=e.timeline(),r=t.one(`.t-paddle`);return r&&n.to(r,{rotation:-10,duration:.14,ease:`power2.out`,transformOrigin:`0% 50%`}).to(r,{rotation:6,scaleY:.85,duration:.09,ease:`power2.in`}).to(r,{rotation:-10,scaleY:1,duration:.14,ease:`power2.out`}).to(r,{rotation:6,scaleY:.85,duration:.09,ease:`power2.in`}).to(r,{rotation:0,scaleY:1,duration:.3,ease:`back.out(2)`}),n},D={id:`tyuk`,svg:S,special:C,idleExtras:e=>Math.random()<.55?T(e):E(e),setup(e,t){let n=t.emote.bind(t),r=e.one(`.c-head`),i=e.one(`.c-arm-r`),a=0;t.emote=async t=>{t===`surprised`&&w(e,44);let o=(t===`wave`||t===`point`)&&r&&i;o&&a++===0&&r.after(i);try{await n(t)}finally{o&&--a===0&&r.before(i)}}}};export{D as default};