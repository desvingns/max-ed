import{t as e}from"./gsap-CvDoa17S.js";var t=`#3B2F4F`,n=`#FFD93D`,r=`#F2B705`,i=`#FF9F43`,a=`#E9822C`,o=`#2A2238`,s=200,c=230,l=136,u=128,d=[[199,17],[222,12],[-19,17],[-42,12]];function f(e=0,t=0){let n=`<ellipse cx="${s+e}" cy="${c+t}" rx="${l}" ry="${u}"/>`,r=(n,r)=>{let i=n*Math.PI/180;return[s+l*r*Math.cos(i)+e,c+u*r*Math.sin(i)+t]},i=e=>e.toFixed(1);for(let[a,o]of d){let[l,u]=r(a,1),d=Math.hypot(l-s-e,u-c-t),f=(l-s-e)/d,p=(u-c-t)/d,m=-p,h=f;h>0&&(m=-m,h=-h);let g=r(a-11,.95),_=r(a+11,.95),[v,y]=g[1]>_[1]?[g,_]:[_,g],b=l+f*o+m*o*.8,x=u+p*o+h*o*.8,S=l+f*o*1.2-m*o*.1,C=u+p*o*1.2-h*o*.1,w=l+f*o*.3+m*o*.6,T=u+p*o*.3+h*o*.6;n+=`<path d="M${i(v[0])} ${i(v[1])} Q${i(S)} ${i(C)} ${i(b)} ${i(x)} Q${i(w)} ${i(T)} ${i(y[0])} ${i(y[1])} Z"/>`}return n}var p=[`M182 128 C172 108 162 94 148 80 C143 75 147 68 154 70 C178 78 195 96 205 120 Z`,`M195 120 C207 98 225 82 248 76 C255 74 259 81 254 86 C242 98 236 112 226 132 Z`,`M185 124 C180 96 186 64 203 45 C207 40 215 42 213 50 C210 70 218 96 215 124 Z`],m=`M-17 -4 C-28 16 -27 42 -17 60 C-12 69 -4 68 -1 61 C3 70 13 69 15 59 C21 44 22 18 15 -6 Z`;function h(e,i){let a=i===`l`?80:320;return`<g class="c-wing-${i}" data-origin="${a} 244"><g class="wing-flap-${i}" data-origin="${a} 244">
    <g transform="${i===`l`?`translate(${a} 244) rotate(26)`:`translate(${a} 244) scale(-1 1) rotate(26)`}">
      <clipPath id="${e}wing${i}"><path d="${m}"/></clipPath>
      <path d="${m}" fill="${r}"/>
      <path d="${m}" transform="translate(${i===`l`?`-6 -8`:`6 -8`})" fill="${n}" clip-path="url(#${e}wing${i})"/>
      <path d="${m}" fill="none" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
    </g></g></g>`}var g=`M0 -40 L0 -12 M0 -12 L-17 -4 M0 -12 L0 -1 M0 -12 L17 -4`;function _(e){let n=e===`l`?166:234;return`<g class="c-leg-${e}" data-origin="${n} 352"><g transform="translate(${n} 373)" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${g}" stroke="${t}" stroke-width="25"/>
    <path d="${g}" stroke="${i}" stroke-width="13"/>
  </g></g>`}function v(e,n){let r=n===`l`?149:251,i=r+(n===`l`?3:-3);return`<g class="c-eye">
    <clipPath id="${e}eye${n}"><ellipse cx="${r}" cy="196" rx="37" ry="44"/></clipPath>
    <ellipse cx="${r}" cy="196" rx="37" ry="44" fill="#fff"/>
    <g clip-path="url(#${e}eye${n})"><g class="c-pupil" data-range="8">
      <ellipse cx="${i}" cy="192" rx="26" ry="30" fill="url(#${e}pupil)"/>
      <circle cx="${i+9}" cy="179" r="10.5" fill="#fff"/>
      <circle cx="${i-10}" cy="204" r="5" fill="#fff"/>
    </g></g>
    <ellipse cx="${r}" cy="196" rx="37" ry="44" fill="none" stroke="${t}" stroke-width="6"/>
  </g>`}function y(e){return`<defs>
    <clipPath id="${e}ball">${f()}</clipPath>
    <radialGradient id="${e}body" gradientUnits="userSpaceOnUse" cx="150" cy="150" r="230">
      <stop offset="0" stop-color="#FFE679"/><stop offset="0.6" stop-color="${n}"/>
    </radialGradient>
    <linearGradient id="${e}pupil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.45" stop-color="${o}"/><stop offset="1" stop-color="#4A3B70"/>
    </linearGradient>
  </defs>
  <ellipse class="c-shadow" cx="200" cy="386" rx="108" ry="13" fill="#000" opacity="0.12"/>
  <g class="c-root">
    ${_(`l`)}${_(`r`)}
    <g class="c-body" data-origin="200 366">
      <g class="c-head" data-origin="${s} ${c}">
        <g class="c-tuft" data-origin="200 112" fill="${n}" stroke="${t}" stroke-width="8" stroke-linejoin="round">
          ${p.map(e=>`<path d="${e}"/>`).join(``)}
        </g>
        <g fill="${t}" stroke="${t}" stroke-width="16" stroke-linejoin="round">${f()}</g>
        <g fill="url(#${e}body)">${f()}</g>
        <g clip-path="url(#${e}ball)">
          <rect x="40" y="90" width="320" height="300" fill="${r}"/>
          <g fill="url(#${e}body)">${f(-16,-20)}</g>
        </g>
        <ellipse cx="118" cy="146" rx="30" ry="15" transform="rotate(-42 118 146)" fill="#fff" opacity="0.55"/>
        <circle cx="150" cy="120" r="6" fill="#fff" opacity="0.55"/>
        <g class="acc-shell" style="display:none" transform="rotate(-14 200 100)">
          <path d="M124 122 C118 42 282 42 276 122 L263 106 L249 125 L234 105 L219 125 L204 105 L189 125 L174 105 L159 125 L143 106 Z" fill="#FFFBF1" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
          <path d="M236 64 C256 74 268 92 270 110" fill="none" stroke="#EADFCB" stroke-width="9" stroke-linecap="round"/>
          <ellipse cx="164" cy="72" rx="16" ry="8" transform="rotate(-28 164 72)" fill="#fff"/>
          <circle cx="220" cy="80" r="4" fill="#EADFCB"/><circle cx="186" cy="92" r="3" fill="#EADFCB"/>
        </g>
        <g class="c-face">
          <ellipse class="c-cheek" cx="118" cy="256" rx="22" ry="13" fill="#FF9EB1"/>
          <ellipse class="c-cheek" cx="282" cy="256" rx="22" ry="13" fill="#FF9EB1"/>
          <g class="c-eyes-open">${v(e,`l`)}${v(e,`r`)}</g>
          <g class="c-eyes-happy" opacity="0" fill="none" stroke="${t}" stroke-width="9" stroke-linecap="round">
            <path d="M120 204 Q149 166 178 204"/><path d="M222 204 Q251 166 280 204"/>
          </g>
          <path class="c-mouth-closed" d="M184 256 C190 270 210 270 216 256 C210 262 190 262 184 256 Z" fill="${a}" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
          <g class="c-mouth-open" data-origin="200 252" opacity="0">
            <path d="M176 250 C172 296 228 296 224 250 C212 262 188 262 176 250 Z" fill="${i}" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
            <path d="M182 254 C184 282 216 282 218 254 Z" fill="#5A2A3A"/>
            <ellipse cx="200" cy="274" rx="11" ry="5" fill="#FF7A93"/>
          </g>
          <path d="M173 252 C177 238 189 231 200 231 C211 231 223 238 227 252 C216 262 206 265 200 265 C194 265 184 262 173 252 Z" fill="${i}" stroke="${t}" stroke-width="6" stroke-linejoin="round"/>
          <ellipse cx="192" cy="242" rx="7" ry="4" transform="rotate(-18 192 242)" fill="#fff" opacity="0.55"/>
        </g>
      </g>
      ${h(e,`l`)}${h(e,`r`)}
    </g>
  </g>`}var b={svgOrigin:`200 385`};function x(e,t,n,r){let i=e.one(`.c-mouth-open`),a=e.one(`.c-mouth-closed`);i&&(t.set(i,{opacity:+(n>0),scaleY:n>0?n:.05,...e.o(i)},r),a&&t.set(a,{opacity:n>0?0:1},r))}function S(e,t,n,r){let i=e.one(`.c-eyes-open`),a=e.one(`.c-eyes-happy`);i&&a&&t.set(i,{opacity:+!n},r).set(a,{opacity:+!!n},r)}function C(t){let n=e.timeline(),r=t.one(`.c-root`),i=t.one(`.wing-flap-l`),a=t.one(`.wing-flap-r`),o=t.one(`.c-tuft`),s=t.one(`.c-shadow`);if(!r)return n;S(t,n,!0,0);let c=.4;for(let e=0;e<3;e++){let l=e*c,u=e===2?78:52;n.to(r,{scaleY:.84,scaleX:1.12,y:0,duration:.08,ease:`power2.in`,...b},l).to(r,{y:-u,scaleY:1.1,scaleX:.93,rotation:e%2?5:-5,duration:.15,ease:`power2.out`,...b},l+.08).to(r,{y:0,scaleY:1,scaleX:1,rotation:0,duration:.13,ease:`power2.in`,...b},l+.23).to(r,{scaleY:.9,scaleX:1.07,duration:.04,ease:`power1.out`,...b},l+.36),i&&a&&n.to(i,{rotation:62,duration:.07,ease:`power2.out`,yoyo:!0,repeat:3,...t.o(i)},l+.06).to(a,{rotation:-62,duration:.07,ease:`power2.out`,yoyo:!0,repeat:3,...t.o(a)},l+.06),o&&n.to(o,{scaleY:.8,scaleX:1.12,duration:.1,ease:`power2.out`,...t.o(o)},l+.1).to(o,{scaleY:1.15,scaleX:.92,duration:.12,ease:`power2.inOut`},l+.24),s&&n.to(s,{scale:.7,opacity:.07,duration:.15,ease:`power2.out`,transformOrigin:`50% 50%`},l+.08).to(s,{scale:1,opacity:.12,duration:.13,ease:`power2.in`},l+.23),x(t,n,.85,l+.1),x(t,n,0,l+.3)}let l=3*c;return n.to(r,{scaleY:1,scaleX:1,duration:.35,ease:`elastic.out(1.1, 0.4)`,...b},l),o&&n.to(o,{scaleY:1,scaleX:1,duration:.5,ease:`elastic.out(1.2, 0.35)`},l),i&&a&&n.to([i,a],{rotation:0,duration:.2},l),S(t,n,!1,1.5000000000000002),n}function w(t){let n=e.timeline(),r=t.one(`.c-head`),i=t.one(`.c-face`),a=t.one(`.c-tuft`),o=t.one(`.c-root`),s=t.one(`.wing-flap-l`),c=t.one(`.wing-flap-r`),l=Math.floor(Math.random()*3);if(l===0&&r){let e=Math.random()<.5?-1:1;n.to(r,{rotation:11*e,duration:.3,ease:`back.out(2)`,...t.o(r)}),a&&n.to(a,{rotation:8*e,duration:.35,ease:`back.out(3)`,...t.o(a)},.06),n.to(r,{rotation:0,duration:.35,ease:`sine.inOut`},.95),a&&n.to(a,{rotation:0,duration:.45,ease:`elastic.out(1.2, 0.4)`},1)}else if(l===1&&i&&o)for(let e=0;e<2;e++){let r=e*.3;n.to(i,{y:14,duration:.1,ease:`power2.in`},r).to(o,{scaleY:.95,scaleX:1.03,duration:.1,ease:`power2.in`,...b},r).to(i,{y:0,duration:.16,ease:`power2.out`},r+.12).to(o,{scaleY:1,scaleX:1,duration:.16,ease:`power2.out`,...b},r+.12),a&&n.to(a,{y:8,duration:.1,yoyo:!0,repeat:1,ease:`sine.inOut`},r+.02),x(t,n,.35,r+.08),x(t,n,0,r+.16)}else s&&c&&(n.to(s,{rotation:38,duration:.06,ease:`sine.inOut`,yoyo:!0,repeat:7,...t.o(s)},0).to(c,{rotation:-38,duration:.06,ease:`sine.inOut`,yoyo:!0,repeat:7,...t.o(c)},0),a&&n.to(a,{rotation:6,duration:.12,yoyo:!0,repeat:3,ease:`sine.inOut`,...t.o(a)},0),o&&n.to(o,{y:-6,duration:.24,yoyo:!0,repeat:1,ease:`sine.inOut`},0));return n}function T(t,n){let r=t.one(`.c-wing-l`),i=t.one(`.c-wing-r`),a=t.one(`.wing-flap-l`),o=t.one(`.wing-flap-r`),s=t.one(`.c-tuft`);if(!r||!i||!a||!o||!s)return;let c=n.emote;n.emote=n=>{let l=c(n),u=t.o(s);if(n===`cheer`){for(let t of e.getTweensOf([r,i])){let e=t.vars.rotation;(e===150||e===-150||e===0&&t.duration()===.3)&&t.kill()}e.set([r,i],{rotation:0}),e.timeline().to(a,{rotation:128,duration:.22,ease:`back.out(2)`,...t.o(a)},0).to(o,{rotation:-128,duration:.22,ease:`back.out(2)`,...t.o(o)},0).to(a,{rotation:100,duration:.09,yoyo:!0,repeat:3,ease:`sine.inOut`},.24).to(o,{rotation:-100,duration:.09,yoyo:!0,repeat:3,ease:`sine.inOut`},.24).to([a,o],{rotation:0,duration:.3,ease:`power2.inOut`},.8)}else n===`sad`?e.timeline().to(s,{rotation:14,scaleY:.72,scaleX:1.08,duration:.5,ease:`sine.inOut`,...u},0).to(a,{rotation:-12,duration:.5,ease:`sine.inOut`,...t.o(a)},0).to(o,{rotation:12,duration:.5,ease:`sine.inOut`,...t.o(o)},0).to(s,{rotation:0,scaleY:1,scaleX:1,duration:.6,ease:`back.out(2)`},1.4).to([a,o],{rotation:0,duration:.5,ease:`sine.inOut`},1.4):n===`surprised`?e.timeline().to(s,{scaleY:1.3,scaleX:.9,duration:.12,ease:`back.out(3)`,...u},0).to(a,{rotation:40,duration:.12,ease:`back.out(3)`,...t.o(a)},0).to(o,{rotation:-40,duration:.12,ease:`back.out(3)`,...t.o(o)},0).to(s,{scaleY:1,scaleX:1,duration:.6,ease:`elastic.out(1.2, 0.35)`},.75).to([a,o],{rotation:0,duration:.35,ease:`sine.inOut`},.75):n===`think`&&e.timeline().to(s,{rotation:-10,duration:.45,ease:`back.out(2)`,...u},.05).to(s,{rotation:0,duration:.5,ease:`elastic.out(1.2, 0.4)`},1.35);return l}}function E(e,t){let n=e.part(`.acc-shell`),r=e.part(`.c-tuft`);n&&(n.style.display=t?``:`none`),r&&(r.style.display=t?`none`:``)}var D={id:`chick`,svg:y,special:C,idleExtras:w,setup:T};export{D as default,E as setShell};