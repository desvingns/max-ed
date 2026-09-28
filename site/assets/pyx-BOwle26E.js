import{t as e}from"./gsap-CvDoa17S.js";var t=`#3B2F4F`,n=`#6BD49A`,r=`#45B57C`,i=`#FFE7A3`,a=`#F6CF7A`,o=`#FFD166`,s=`#F2AE3D`,c=`#FF8A5B`,l=`#E86A3E`,u=`#FFB36B`,d=`#FF9EB1`,f=`#2A2238`,p=[`#FF5A5F`,`#FF9F43`,`#FFD93D`,`#6BCB77`,`#62C6FF`,`#4D96FF`,`#9B6BFF`,`#FF8FC8`],m=e=>e.toFixed(1);function h(e,t,n,r=-1,i=1,a=22){let[o,s,c,l,u,d,f,p]=e,h=[],g=[];for(let e=0;e<=a;e++){let _=e/a,v=1-_,y=v*v*v*o+3*v*v*_*c+3*v*_*_*u+_*_*_*f,b=v*v*v*s+3*v*v*_*l+3*v*_*_*d+_*_*_*p,x=3*v*v*(c-o)+6*v*_*(u-c)+3*_*_*(f-u),S=3*v*v*(l-s)+6*v*_*(d-l)+3*_*_*(p-d),C=Math.hypot(x,S)||1,w=-S/C,T=x/C,E=(t+(n-t)*_)/2;h.push(`${m(y+w*E*r)} ${m(b+T*E*r)}`),g.push(`${m(y+w*E*i)} ${m(b+T*E*i)}`)}return`M${h.join(` L`)} L${g.reverse().join(` L`)} Z`}var g=[236,346,320,386,384,338,348,284];function _(e){let n=t=>e===1?t:400-t,r=(e,t)=>`${m(n(e))} ${m(t)}`,i=`M${r(156,246)} C${r(142,218)} ${r(116,198)} ${r(86,196)}
    C${r(74,196)} ${r(70,210)} ${r(80,216)}
    C${r(76,230)} ${r(88,240)} ${r(100,234)}
    C${r(100,250)} ${r(116,258)} ${r(126,248)}
    C${r(130,262)} ${r(146,266)} ${r(156,256)} Z`,a=`M${r(148,248)} L${r(96,218)} M${r(146,252)} L${r(122,240)}`,o=e===1?`c-wing-l`:`c-wing-r`,s=n(154);return`<g class="${o}" data-origin="${m(s)} 250"><g class="pyx-wing-in" data-origin="${m(s)} 250">
    <path d="${i}" fill="${u}" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
    <path d="${a}" fill="none" stroke="${l}" stroke-width="5" stroke-linecap="round"/>
  </g></g>`}function v(e){let n=t=>e===1?t:400-t,r=(e,t)=>`${m(n(e))} ${m(t)}`;return`<path d="M${r(140,88)} C${r(136,74)} ${r(130,62)} ${r(128,52)} C${r(126,40)} ${r(138,34)} ${r(146,42)} C${r(158,54)} ${r(170,66)} ${r(176,82)} Z"
      fill="${o}" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M${r(160,84)} C${r(154,68)} ${r(146,54)} ${r(138,44)} C${r(154,52)} ${r(166,64)} ${r(172,80)} Z" fill="${s}"/>
    <ellipse cx="${m(n(134))}" cy="54" rx="3" ry="6" fill="#fff" opacity="0.55" transform="rotate(${-20*e} ${m(n(134))} 54)"/>`}function y(e,n,r){return`<g class="c-eye">
      <ellipse cx="${e}" cy="${n}" rx="27" ry="31" fill="#fff" stroke="${t}" stroke-width="6"/>
      <g clip-path="url(#${r})">
        <g class="c-pupil" data-range="8">
          <ellipse cx="${e+1}" cy="${n-4}" rx="18" ry="21" fill="${f}"/>
          <path d="M${e-12} ${n+6} Q${e+1} ${n+18} ${e+14} ${n+6} Q${e+1} ${n+13} ${e-12} ${n+6} Z" fill="#6A5A8E"/>
          <circle cx="${e-7}" cy="${n-13}" r="7.5" fill="#fff"/>
          <circle cx="${e+8}" cy="${n+4}" r="3.6" fill="#fff"/>
        </g>
      </g>
    </g>`}function b(){let e=[];for(let n=0;n<12;n++){let r=p[n%p.length];e.push(n%3==0?`<circle cx="200" cy="200" r="7.5" fill="${r}" stroke="${t}" stroke-width="3"/>`:`<rect x="193" y="191" width="14" height="18" rx="4" fill="${r}" stroke="${t}" stroke-width="3"/>`)}return e.join(``)}function x(e){return`
  <defs>
    <clipPath id="${e}head"><ellipse cx="200" cy="150" rx="100" ry="88"/></clipPath>
    <clipPath id="${e}body"><ellipse cx="200" cy="292" rx="74" ry="80"/></clipPath>
    <clipPath id="${e}eyeL"><ellipse cx="160" cy="152" rx="27" ry="31"/></clipPath>
    <clipPath id="${e}eyeR"><ellipse cx="240" cy="152" rx="27" ry="31"/></clipPath>
  </defs>
  <ellipse class="c-shadow" cx="210" cy="387" rx="118" ry="13" fill="#000" opacity="0.12"/>
  <g class="c-root">
    <g class="c-tail" data-origin="246 340"><g class="pyx-tail-in" data-origin="246 340">
      <path d="${h(g,40,14)}" fill="${n}" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
      <path d="${h(g,40,14,.15,1)}" fill="${r}"/>
      <path d="${h(g,40,14)}" fill="none" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
      <g transform="translate(341 266) rotate(-32) scale(1.2)">
        <path d="M0 18 C-22 4 -28 -14 -16 -22 C-8 -27 -2 -22 0 -16 C2 -22 8 -27 16 -22 C28 -14 22 4 0 18 Z" fill="${c}"/>
        <path d="M0 18 C10 10 20 0 20 -10 C22 -2 18 8 0 18 Z" fill="${l}"/>
        <path d="M0 18 C-22 4 -28 -14 -16 -22 C-8 -27 -2 -22 0 -16 C2 -22 8 -27 16 -22 C28 -14 22 4 0 18 Z" fill="none" stroke="${t}" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse cx="-14" cy="-12" rx="4" ry="6" fill="#fff" opacity="0.55" transform="rotate(-35 -14 -12)"/>
      </g>
    </g></g>
    ${_(1)}
    ${_(-1)}
    <g class="c-leg-l" data-origin="172 346">
      <rect x="150" y="328" width="42" height="46" rx="18" fill="${n}" stroke="${t}" stroke-width="8"/>
      <ellipse cx="166" cy="373" rx="28" ry="13" fill="${n}" stroke="${t}" stroke-width="8"/>
      <ellipse cx="174" cy="378" rx="15" ry="5" fill="${r}"/>
      <path d="M150 381 v-4 M162 383 v-4 M174 383 v-4" stroke="${i}" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g class="c-leg-r" data-origin="228 346">
      <rect x="208" y="328" width="42" height="46" rx="18" fill="${n}" stroke="${t}" stroke-width="8"/>
      <ellipse cx="234" cy="373" rx="28" ry="13" fill="${n}" stroke="${t}" stroke-width="8"/>
      <ellipse cx="242" cy="378" rx="15" ry="5" fill="${r}"/>
      <path d="M226 383 v-4 M238 383 v-4 M250 381 v-4" stroke="${i}" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g class="c-body" data-origin="200 372"><g class="pyx-body-in" data-origin="200 300">
      <ellipse cx="200" cy="292" rx="74" ry="80" fill="${r}"/>
      <g clip-path="url(#${e}body)">
        <ellipse cx="190" cy="284" rx="72" ry="80" fill="${n}"/>
        <ellipse cx="198" cy="306" rx="46" ry="56" fill="${i}"/>
        <path d="M244 290 C246 330 226 362 198 364 C230 350 240 322 236 292 Z" fill="${a}"/>
        <path d="M168 280 Q198 290 228 280 M162 308 Q198 320 234 308 M168 336 Q198 346 228 336" fill="none" stroke="${a}" stroke-width="5" stroke-linecap="round"/>
      </g>
      <ellipse cx="200" cy="292" rx="74" ry="80" fill="none" stroke="${t}" stroke-width="8"/>
    </g></g>
    <g class="c-head" data-origin="200 236"><g class="pyx-head-in" data-origin="200 236">
      <path d="M176 74 C178 56 186 42 194 34 Q200 29 206 34 C214 42 222 56 224 74 Z" fill="${c}" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M204 70 C210 56 206 44 200 36 C212 46 218 58 218 72 Z" fill="${l}"/>
      <path d="M160 80 C160 66 166 56 172 52 Q176 50 179 53 C184 58 188 66 188 76 Z" fill="${c}" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M240 80 C240 66 234 56 228 52 Q224 50 221 53 C216 58 212 66 212 76 Z" fill="${c}" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
      ${v(1)}
      ${v(-1)}
      <ellipse cx="200" cy="150" rx="100" ry="88" fill="${r}"/>
      <ellipse cx="192" cy="142" rx="98" ry="86" fill="${n}" clip-path="url(#${e}head)"/>
      <ellipse cx="200" cy="150" rx="100" ry="88" fill="none" stroke="${t}" stroke-width="8"/>
      <ellipse cx="146" cy="96" rx="22" ry="12" fill="#fff" opacity="0.5" transform="rotate(-28 146 96)"/>
      <ellipse cx="200" cy="208" rx="46" ry="26" fill="#8BE2B2"/>
      <ellipse cx="138" cy="198" rx="17" ry="10" fill="#E9B3A6"/>
      <ellipse cx="262" cy="198" rx="17" ry="10" fill="#E9B3A6"/>
      <ellipse class="c-cheek" cx="138" cy="198" rx="17" ry="10" fill="${d}"/>
      <ellipse class="c-cheek" cx="262" cy="198" rx="17" ry="10" fill="${d}"/>
      <path class="c-brow-l" data-origin="160 110" d="M146 112 Q160 104 174 110" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round"/>
      <path class="c-brow-r" data-origin="240 110" d="M226 110 Q240 104 254 112" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round"/>
      <g class="c-eyes-open">
        ${y(160,152,`${e}eyeL`)}
        ${y(240,152,`${e}eyeR`)}
      </g>
      <g class="c-eyes-happy">
        <path d="M138 158 Q160 132 182 158" fill="none" stroke="${t}" stroke-width="8" stroke-linecap="round"/>
        <path d="M218 158 Q240 132 262 158" fill="none" stroke="${t}" stroke-width="8" stroke-linecap="round"/>
      </g>
      <g class="pyx-eyes-sneeze" opacity="0">
        <path d="M142 138 L172 154 L142 168" fill="none" stroke="${t}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M258 138 L228 154 L258 168" fill="none" stroke="${t}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <g class="pyx-nostrils" data-origin="200 198">
        <ellipse cx="189" cy="198" rx="4.5" ry="3.5" fill="${t}" transform="rotate(-20 189 198)"/>
        <ellipse cx="211" cy="198" rx="4.5" ry="3.5" fill="${t}" transform="rotate(20 211 198)"/>
      </g>
      <g class="c-mouth-closed">
        <path d="M178 214 Q200 234 222 214" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round"/>
      </g>
      <g class="c-mouth-open" data-origin="200 212">
        <path d="M178 212 Q200 208 222 212 Q224 236 200 238 Q176 236 178 212 Z" fill="#5A2A3A" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M187 232 Q200 222 213 232 Q200 238 187 232 Z" fill="#FF7A93"/>
        <path d="M205 212 L209 220 L213 212 Z" fill="#fff"/>
      </g>
      <g class="acc-chef" style="display:none">
        <path d="M164 80 C146 78 142 56 158 48 C158 26 184 16 196 32 C206 14 234 20 234 40 C252 42 258 64 240 78 L238 80 Z" fill="#fff" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
        <path d="M232 46 C244 52 246 66 236 74 L222 74 C230 64 234 56 232 46 Z" fill="#E6E1F0"/>
        <path d="M186 44 Q190 58 186 70 M210 42 Q214 58 210 70" fill="none" stroke="#E6E1F0" stroke-width="5" stroke-linecap="round"/>
        <rect x="156" y="66" width="88" height="28" rx="12" fill="#fff" stroke="${t}" stroke-width="7"/>
        <path d="M226 72 L238 72 L238 88 L226 88 Z" fill="#E6E1F0"/>
      </g>
      <g class="acc-cap" style="display:none">
        <path d="M140 98 C142 56 168 36 200 36 C232 36 258 56 260 98 Z" fill="#FF5A5F" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
        <path d="M232 48 C248 60 256 76 256 94 L236 94 C236 78 236 62 232 48 Z" fill="#E0474C"/>
        <circle cx="200" cy="38" r="6" fill="#FF5A5F" stroke="${t}" stroke-width="5"/>
        <path d="M134 94 C160 110 240 110 266 94 C270 106 254 120 200 120 C146 120 130 106 134 94 Z" fill="#E0474C" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
        <path d="M200 52 L206.5 64.5 L220 66.5 L210.2 76 L212.5 89.5 L200 83 L187.5 89.5 L189.8 76 L180 66.5 L193.5 64.5 Z" fill="#FFD93D" stroke="${t}" stroke-width="4" stroke-linejoin="round"/>
      </g>
    </g></g>
    <g class="c-arm-l" data-origin="156 254">
      <ellipse cx="143" cy="302" rx="9" ry="11" fill="${n}" stroke="${t}" stroke-width="6" transform="rotate(-40 143 302)"/>
      <path d="M162 250 C146 246 126 256 116 274 C106 292 110 310 126 314 C142 318 150 306 148 294 C150 280 170 266 162 250 Z"
        fill="${n}" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M114 294 C114 306 122 312 132 312" fill="none" stroke="${r}" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g class="c-arm-r" data-origin="244 254">
      <ellipse cx="257" cy="302" rx="9" ry="11" fill="${n}" stroke="${t}" stroke-width="6" transform="rotate(40 257 302)"/>
      <path d="M238 250 C254 246 274 256 284 274 C294 292 290 310 274 314 C258 318 250 306 252 294 C250 280 230 266 238 250 Z"
        fill="${n}" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M286 294 C286 306 278 312 268 312" fill="none" stroke="${r}" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g class="pyx-fx" pointer-events="none">
      <g class="pyx-ring" opacity="0">
        <circle cx="200" cy="196" r="12" fill="none" stroke="${t}" stroke-width="11"/>
        <circle cx="200" cy="196" r="12" fill="none" stroke="#F6F3FB" stroke-width="5"/>
      </g>
      <g class="c-confetti" opacity="0">${b()}</g>
    </g>
  </g>`}function S(t,n=!1){let r=t.one(`.pyx-ring`),i=t.q(`.pyx-ring circle`),a=e.timeline();return r?(a.set(r,{opacity:0,x:0,y:0}).set(i,{attr:{r:6}}),n?a.to(r,{opacity:1,duration:.06}).to(i,{attr:{r:100},duration:.7,ease:`power3.out`},0).to(r,{y:-20,duration:.7,ease:`sine.out`},0).to(r,{opacity:0,duration:.35,ease:`power1.in`},.2):a.to(r,{opacity:1,duration:.12}).to(i,{attr:{r:17},duration:1.2,ease:`sine.out`},0).to(r,{x:110,duration:1.2,ease:`sine.out`},0).to(r,{y:-100,duration:1.2,ease:`power2.in`},0).to(r,{opacity:0,duration:.45,ease:`power1.in`},.75),a):a}var C={id:`pyx`,svg:x,special(e){let t=e.tl(),n=e.one(`.c-root`),r=e.one(`.pyx-head-in`),i=e.one(`.pyx-body-in`),a=e.one(`.pyx-nostrils`),o=e.q(`.c-pupil`),s=e.q(`.c-brow-l, .c-brow-r`),c=e.one(`.c-eyes-open`),l=e.one(`.pyx-eyes-sneeze`),[u,d]=e.q(`.pyx-wing-in`),f=e.one(`.pyx-tail-in`),p=e.one(`.c-confetti`),m=p?Array.from(p.children):[],h={svgOrigin:`200 385`};t.set(l,{opacity:0},0),t.to(r,{rotation:7,y:-10,scaleY:.97,duration:.28,ease:`power2.out`,...e.o(r)},0).to(a,{scale:1.35,duration:.28,ease:`power2.out`,...e.o(a)},0).to(i,{scale:1.05,duration:.28,ease:`power2.out`,...e.o(i)},0).to(o,{y:-7,duration:.25},0).to(s,{y:-7,duration:.25},0).to(n,{scaleY:1.04,scaleX:.98,duration:.28,...h},0).to(r,{rotation:12,y:-18,scaleY:.95,duration:.3,ease:`power2.out`},.34).to(a,{scale:1.7,duration:.3,ease:`power2.out`},.34).to(i,{scale:1.1,duration:.3,ease:`power2.out`},.34).to(s,{y:-12,duration:.3},.34).to(n,{scaleY:1.08,scaleX:.97,duration:.3,...h},.34);let g=.78;return t.to(r,{rotation:-6,y:8,scaleY:1.03,duration:.09,ease:`power4.in`},g).to(a,{scale:.8,duration:.09},g).to(i,{scale:.96,duration:.09},g).to(o,{y:0,duration:.09},g).to(s,{y:4,duration:.09},g).to(n,{scaleY:.86,scaleX:1.1,duration:.09,ease:`power4.in`,...h},g).set(c,{opacity:0},.8300000000000001).set(l,{opacity:1},.8300000000000001).set(p,{opacity:1},.8400000000000001),u&&d&&t.to(u,{rotation:32,duration:.1,ease:`power3.out`,...e.o(u)},.8300000000000001).to(d,{rotation:-32,duration:.1,ease:`power3.out`,...e.o(d)},.8300000000000001).to([u,d],{rotation:0,duration:.7,ease:`elastic.out(1.2, 0.35)`},.98),f&&t.to(f,{rotation:-16,duration:.1,ease:`power3.out`,...e.o(f)},.8500000000000001).to(f,{rotation:0,duration:.8,ease:`elastic.out(1.2, 0.3)`},1),m.forEach((e,n)=>{let r=(-165+n*150/11+(n%2?7:-7))*(Math.PI/180),i=110+n%4*28;t.fromTo(e,{x:0,y:0,scale:.4,rotation:0,opacity:1,transformOrigin:`50% 50%`},{x:Math.cos(r)*i,y:Math.sin(r)*i*.85,scale:1.25,rotation:(n%2?1:-1)*(180+n*30),duration:.45,ease:`power3.out`},.8400000000000001).to(e,{y:`+=${80+n%3*25}`,rotation:`+=${n%2?90:-90}`,opacity:0,duration:.75,ease:`power1.in`},1.28)}),t.add(S(e,!0),.86).set(l,{opacity:0},1.23).set(c,{opacity:1},1.23).to(r,{rotation:0,y:0,scaleY:1,duration:.6,ease:`elastic.out(1, 0.45)`},.98).to(a,{scale:1,duration:.4,ease:`back.out(2)`},.98).to(s,{y:0,duration:.4,ease:`back.out(2)`},1.23).to(i,{scale:1,duration:.5,ease:`elastic.out(1, 0.5)`},.98).to(n,{scaleY:1,scaleX:1,duration:.6,ease:`elastic.out(1.1, 0.4)`},.9).set(p,{opacity:0},2.08),t},idleExtras(e){let t=Math.floor(Math.random()*3),n=e.tl();if(t===0)e.q(`.pyx-wing-in`).forEach((t,r)=>{n.to(t,{rotation:r?-14:14,duration:.09,yoyo:!0,repeat:5,ease:`sine.inOut`,...e.o(t)},0)});else if(t===1){let t=e.one(`.pyx-tail-in`);n.to(t,{rotation:12,duration:.16,ease:`sine.inOut`,...e.o(t)}).to(t,{rotation:-8,duration:.2,ease:`sine.inOut`}).to(t,{rotation:8,duration:.2,ease:`sine.inOut`}).to(t,{rotation:0,duration:.5,ease:`elastic.out(1, 0.4)`})}else{let t=e.one(`.pyx-nostrils`);n.to(t,{scale:1.3,duration:.15,yoyo:!0,repeat:1,...e.o(t)},0).add(S(e),.15)}return n},setup(t,n){let r=t.one(`.c-confetti`);r&&e.set(r,{opacity:0});let i=t.one(`.c-arm-l`),a=t.one(`.c-arm-r`),o=t.one(`.c-wing-l`),s=t.one(`.c-wing-r`),c=new Map([[i,105],[a,-105],[o,-25],[s,25]]),l=n.emote.bind(n);n.emote=t=>{let n=l(t);if(t===`cheer`)for(let t of e.globalTimeline.getChildren(!1,!1,!0))for(let e of t.getChildren(!0,!0,!1)){let t=e.vars.rotation,n=e.targets()[0];typeof t==`number`&&Math.abs(t)>=100&&c.has(n)&&e.progress()===0&&(e.vars.rotation=c.get(n))}return n}}};function w(e,t){let n=e.svg.querySelector(`.acc-chef`),r=e.svg.querySelector(`.acc-cap`);n&&(n.style.display=t===`chef`?``:`none`),r&&(r.style.display=t===`cap`?``:`none`)}export{C as default,w as setAccessory};