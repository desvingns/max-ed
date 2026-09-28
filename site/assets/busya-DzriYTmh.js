import{t as e}from"./gsap-CvDoa17S.js";import{t}from"./audio-BEkH9VRF.js";var n=`#3B2F4F`,r=`#2A2238`,i=`#8CCB6E`,a=`#71B356`,o=`#7CC05E`,s=`#5FA348`,c=`#F28DA6`,l=`#DA7190`,u=`#FF86A2`,d=`#F7A5B5`,f=`#5A2A3A`,p=`#FF7A93`,m=`#FF8FC8`,h=[`#F28DA6`,`#FFD166`,`#7EC8E3`,`#B59AE0`,`#A8E0C8`],g=[`#DA7190`,`#F2B846`,`#5EAFD0`,`#997DCB`,`#84CAAC`],_=`stroke="${n}" stroke-linejoin="round" stroke-linecap="round"`,v=e=>e.toFixed(1),y=e=>e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`),b=385,x={x:290,y:312,r:40},S=125,C=60,w=7,T=3;function E(e,t,n,r,i=-30,a=150,o=1.08){let s=i=>[e+n*Math.cos(i*Math.PI/180),t+r*Math.sin(i*Math.PI/180)],[c,l]=s(i),[u,d]=s(a);return`M${v(c)} ${v(l)}A${v(n)} ${v(r)} 0 0 1 ${v(u)} ${v(d)}A${v(n*o)} ${v(r*o)} 0 0 0 ${v(c)} ${v(l)}Z`}function D(e,t,n){let r=[{...x,legs:!1,extra:!1}],i=0;for(let a=1;a<e+t;a++){let t=r[a-1],o=a>=e,s=o?t.r*.74:x.r*n*.95**a,c=(o?.95:.8)*(t.r+s);if(a===1){let e=373-s,n=e-t.y,i=Math.sqrt(Math.max(0,c*c-n*n));r.push({x:t.x-i,y:e,r:s,legs:!0,extra:!1});continue}let l=i;if(t.x<S||i>0){let e=c/(o?C*.5:C);l=i+e/2,i+=e}let u=t.x-c*Math.cos(l),d=t.y-c*Math.sin(l)+(t.r-s)*Math.cos(l);r.push({x:u,y:d,r:s,legs:!o&&b-(d+s)<21,extra:o})}return r}function O(e,t){let n=D(e,t,1);for(let r=1;r>=.7&&(n=D(e,t,r),!(Math.min(...n.map(e=>e.x-e.r))>=14));r-=.02);return n}function k(e,t,n){return`<path d="M${v(e-6)} ${v(t)}V377Q${v(e-6)} 382 ${v(e)} 382H${v(e+7)}Q${v(e+13)} 382 ${v(e+13)} 377Q${v(e+13)} 372 ${v(e+6)} 372V${v(t)}Z" fill="${n}" ${_} stroke-width="5"/>`}function A(e,t,n,r,i){let a=h[n%h.length],c=g[n%h.length],l=e.r>22?7:5,u=e.legs?k(e.x-e.r*.42,e.y+e.r*.4,s)+k(e.x+e.r*.18,e.y+e.r*.4,o):``,d=e.r*1.28,f=t&&e.r>=15?`<text x="${v(e.x)}" y="${v(e.y+d*.355)}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="${v(d)}" fill="#fff" ${_} stroke-width="${v(Math.max(4,d*.13))}" paint-order="stroke"${r?` transform="matrix(-1 0 0 1 ${v(2*e.x)} 0)"`:``}>${y(t)}</text>`:``,p=`<ellipse cx="${v(e.x-e.r*.46)}" cy="${v(e.y-e.r*.5)}" rx="${v(e.r*.24)}" ry="${v(e.r*.14)}" transform="rotate(-38 ${v(e.x-e.r*.46)} ${v(e.y-e.r*.5)})" fill="#fff" opacity="0.55"/>`,m=e.r-l/2;return`<g class="busya-bw" data-j="${i}"><g class="c-bead" data-origin="${v(e.x)} ${v(e.y+e.r)}" data-letter="${y(t)}">
    ${u}
    <circle cx="${v(e.x)}" cy="${v(e.y)}" r="${v(e.r)}" fill="${a}" ${_} stroke-width="${l}"/>
    <path d="${E(e.x,e.y,m,m)}" fill="${c}"/>
    ${p}${f}
  </g></g>`}function j(e,t){let n=e.length?e:[``],r=n.length,i=Math.min(r,w),a=Math.min(r-i,T),o=i+a,s=O(i,a),c=[];for(let e=o-1;e>=0;e--){let i=t?r-o+e:r-1-e;c.push(A(s[e],n[i]??``,i,t,e))}return c.join(``)}var M=new WeakMap,N=[`М`,`А`,`К`,`С`,`И`];function P(e){let t=M.get(e);return t||(t={letters:N.slice(),flipped:!1,waves:[]},t.waves=Array.from(e.querySelectorAll(`.busya-bw`)),M.set(e,t)),t}function F(t,n){let r=P(t.svg);r.letters=n.slice();let i=t.svg.querySelector(`.c-beads`);if(!i)return[];e.killTweensOf(i.querySelectorAll(`*`)),i.innerHTML=j(r.letters,r.flipped),r.waves=Array.from(i.querySelectorAll(`.busya-bw`));let a=r.letters.length,o=Array(a).fill(null),s=Math.min(a,10);return r.waves.forEach(e=>{let t=Number(e.getAttribute(`data-j`)),n=r.flipped?a-s+t:a-1-t;n>=0&&n<a&&(o[n]=e.firstElementChild)}),o}function I(e,t,n,r,a,o,s,u){let d=`M${t} ${n}Q${r} ${a} ${o} ${s}`,f=.25*t+.5*r+.25*o,p=.25*n+.5*a+.25*s,m=u?[0,72,144,216,288].map(e=>{let t=(e-90)*Math.PI/180,n=f+Math.cos(t)*8,r=p+Math.sin(t)*8;return`<ellipse cx="${v(n)}" cy="${v(r)}" rx="5.5" ry="8" transform="rotate(${e} ${v(n)} ${v(r)})" fill="#fff" ${_} stroke-width="3.5"/>`}).join(``)+`<circle cx="${v(f)}" cy="${v(p)}" r="5.5" fill="#FFD166" ${_} stroke-width="3.5"/>`:``;return`<g class="c-antenna ${e}" data-origin="${t} ${n}">
    <path d="${d}" fill="none" ${_} stroke-width="13"/>
    <path d="${d}" fill="none" stroke="${i}" stroke-width="5" stroke-linecap="round"/>
    ${u?`<g class="busya-daisy" data-origin="${v(f)} ${v(p)}">${m}</g>`:``}
    <circle cx="${o}" cy="${s}" r="13" fill="${c}" ${_} stroke-width="6"/>
    <path d="${E(o,s,10,10,-20,140,1.05)}" fill="${l}"/>
    <circle cx="${o-4.5}" cy="${s-4.5}" r="3.5" fill="#fff" opacity="0.8"/>
  </g>`}function L(e,t,n,r,i,a){let o=(t+r)/2,s=(n+i)/2,c=Math.hypot(r-t,i-n)||1,l=o+(i-n)/c*7,u=s-(r-t)/c*7,d=`M${t} ${n}Q${v(l)} ${v(u)} ${r} ${i}`;return`<g class="${e}" data-origin="${t} ${n}">
    <path d="${d}" fill="none" ${_} stroke-width="22"/>
    <path d="${d}" fill="none" stroke="${a}" stroke-width="11" stroke-linecap="round"/>
    <circle cx="${r}" cy="${i}" r="10.5" fill="${a}" ${_} stroke-width="5"/>
    <circle cx="${r-3}" cy="${i-3.5}" r="2.6" fill="#fff" opacity="0.6"/>
  </g>`}function R(e,t){return`<g class="c-eye" data-origin="${e} ${t}">
    <ellipse cx="${e}" cy="${t}" rx="17" ry="20" fill="#fff" ${_} stroke-width="5"/>
    <g class="c-pupil" data-range="6">
      <circle cx="${e+3}" cy="${t-1}" r="11.5" fill="${r}"/>
      <circle cx="${e-1}" cy="${t-6}" r="4.8" fill="#fff"/>
      <circle cx="${e+7}" cy="${t+4}" r="2.2" fill="#fff"/>
    </g>
  </g>`}var z={x:262,y:198},B={x:330,y:194},V=29;function H(e){return`
<ellipse class="c-shadow" cx="200" cy="386" rx="168" ry="12" fill="#000" opacity="0.12"/>
<g class="c-root" data-origin="205 250">
  <g class="c-body" data-origin="200 385">
    ${L(`c-arm-l`,318,294,350,312,s)}
    <g class="c-beads">${j(N,!1)}</g>
  </g>
  <g class="c-head" data-origin="292 292">
    ${I(`busya-ant-b`,262,140,250,96,226,64,!0)}
    ${I(`busya-ant-f`,322,136,334,92,356,60,!1)}
    <ellipse class="busya-skull" cx="294" cy="200" rx="86" ry="80" fill="${i}" ${_} stroke-width="8"/>
    <path d="${E(294,200,82,76,-35,145,1.05)}" fill="${a}"/>
    <ellipse cx="250" cy="156" rx="20" ry="10" transform="rotate(-34 250 156)" fill="#fff" opacity="0.5"/>
    <ellipse cx="238" cy="243" rx="14" ry="9" fill="${d}"/>
    <ellipse cx="357" cy="239" rx="12" ry="8.5" fill="${d}"/>
    <ellipse class="c-cheek" cx="238" cy="243" rx="14" ry="9" fill="${u}"/>
    <ellipse class="c-cheek" cx="357" cy="239" rx="12" ry="8.5" fill="${u}"/>
    <circle cx="${z.x}" cy="${z.y}" r="${V}" fill="#fff" opacity="0.35"/>
    <circle cx="${B.x}" cy="${B.y}" r="${V}" fill="#fff" opacity="0.35"/>
    <g class="c-eyes-open">${R(z.x,z.y)}${R(B.x,B.y)}</g>
    <g class="c-eyes-happy">
      <path d="M${z.x-12} ${z.y+5}Q${z.x} ${z.y-13} ${z.x+12} ${z.y+5}" fill="none" ${_} stroke-width="6"/>
      <path d="M${B.x-12} ${B.y+5}Q${B.x} ${B.y-13} ${B.x+12} ${B.y+5}" fill="none" ${_} stroke-width="6"/>
    </g>
    <g class="busya-glasses" data-origin="296 196">
      <path d="M${z.x-V} ${z.y-4}Q${z.x-V-14} ${z.y-10} 212 186" fill="none" ${_} stroke-width="6"/>
      <path d="M${z.x+V-1} ${z.y-6}Q296 184 ${B.x-V+1} ${B.y-6}" fill="none" ${_} stroke-width="6"/>
      <circle cx="${z.x}" cy="${z.y}" r="${V}" fill="none" ${_} stroke-width="11"/>
      <circle cx="${B.x}" cy="${B.y}" r="${V}" fill="none" ${_} stroke-width="11"/>
      <circle cx="${z.x}" cy="${z.y}" r="${V}" fill="none" stroke="${m}" stroke-width="4"/>
      <circle cx="${B.x}" cy="${B.y}" r="${V}" fill="none" stroke="${m}" stroke-width="4"/>
      <path d="M${z.x+10} ${z.y-19}Q${z.x+18} ${z.y-14} ${z.x+20} ${z.y-6}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
      <path d="M${B.x+10} ${B.y-19}Q${B.x+18} ${B.y-14} ${B.x+20} ${B.y-6}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
    </g>
    <path class="c-brow-r" data-origin="262 150" d="M249 153Q262 144 275 151" fill="none" ${_} stroke-width="6"/>
    <path class="c-brow-l" data-origin="330 146" d="M317 147Q330 139 343 146" fill="none" ${_} stroke-width="6"/>
    <path class="c-mouth-closed" d="M284 246Q302 263 320 245" fill="none" ${_} stroke-width="6"/>
    <g class="c-mouth-open" data-origin="302 244">
      <path d="M281 244Q302 239 323 244Q322 278 302 279Q282 278 281 244Z" fill="${f}" ${_} stroke-width="5"/>
      <path d="M289 270Q302 259 315 270Q310 276 302 276Q294 276 289 270Z" fill="${p}"/>
    </g>
  </g>
  ${L(`c-arm-r`,326,302,340,340,o)}
</g>`}var U=[`C5`,`D5`,`E5`,`G5`,`A5`,`C6`,`D6`,`E6`,`G6`,`A6`,`C7`,`D7`];function W(n){let r=e.timeline(),i=n.q(`.c-bead`),a=n.one(`.c-head`),o=n.one(`.c-mouth-open`),s=n.one(`.c-mouth-closed`),c=n.one(`.c-eyes-open`),l=n.one(`.c-eyes-happy`),u=n.q(`.c-cheek`),d=n.q(`.c-antenna`),f=.085;i.forEach((e,i)=>{let a=i*f,o=n.o(e);r.to(e,{y:-30,scaleX:.92,scaleY:1.1,duration:.13,ease:`power2.out`,...o},a).to(e,{y:0,scaleX:1,scaleY:1,duration:.14,ease:`power2.in`},a+.13).to(e,{scaleX:1.1,scaleY:.88,duration:.06,ease:`power1.out`},a+.27).to(e,{scaleX:1,scaleY:1,duration:.35,ease:`elastic.out(1.2, 0.45)`},a+.33).call(()=>t.note(U[i%U.length],`xylo`,{vol:.28,dur:.4}),[],a)});let p=Math.max(0,i.length-1)*f,m=p+.3,h=n.q(`.c-arm-l, .c-arm-r`);if(h.length&&r.to(h,{y:-30,duration:.13,ease:`power2.out`},p).to(h,{y:0,duration:.14,ease:`power2.in`},p+.13),r.set(c,{opacity:0},p).set(l,{opacity:1},p),u.length&&r.to(u,{opacity:1,duration:.2},p),a){r.to(a,{y:-24,rotation:4,duration:.13,ease:`power2.out`,...n.o(a)},p).to(a,{y:0,rotation:0,duration:.14,ease:`power2.in`},p+.13);for(let e=0;e<6;e++)r.to(a,{rotation:e%2?-5:5,duration:.1,ease:`sine.inOut`},m+e*.1);r.to(a,{rotation:0,duration:.3,ease:`back.out(2)`},m+.6)}if(o&&s){r.set(s,{opacity:0},m).set(o,{opacity:1},m);for(let e=0;e<7;e++)r.to(o,{scaleY:e%2?.35:.85,duration:.09,...n.o(o)},m+e*.09);r.set(o,{opacity:0,scaleY:.05},m+.75).set(s,{opacity:1},m+.75)}return d.length&&d.forEach((e,t)=>{r.to(e,{rotation:t?14:-14,duration:.12,ease:`power2.out`,...n.o(e)},m).to(e,{rotation:0,duration:.8,ease:`elastic.out(1.4, 0.3)`},m+.14)}),r.set(l,{opacity:0},m+.95).set(c,{opacity:1},m+.95),u.length&&r.to(u,{opacity:.55,duration:.4},m+.85),r}function G(t){let n=e.timeline(),r=t.one(`.busya-ant-b`),i=t.one(`.busya-ant-f`),a=t.one(`.busya-glasses`),o=t.one(`.c-head`),s=t.one(`.busya-skull`);if(Math.random()<.5&&i&&a&&o&&s){let e=()=>o.appendChild(i),r=()=>o.insertBefore(i,s);n.to(a,{y:6,rotation:-4,duration:.25,ease:`power2.in`,...t.o(a)}).call(e,[],.12).to(i,{rotation:118,duration:.3,ease:`power2.inOut`,...t.o(i)},.12).to(a,{y:-2,rotation:1,duration:.12,ease:`power2.out`},.42).to(a,{y:0,rotation:0,duration:.25,ease:`sine.inOut`},.54).to(i,{rotation:-6,duration:.42,ease:`power2.inOut`},.52).call(r,[],.94).to(i,{rotation:0,duration:.3,ease:`back.out(3)`},.94),n.eventCallback(`onInterrupt`,r)}else[r,i].filter(Boolean).forEach((e,r)=>{n.to(e,{rotation:r?10:-10,duration:.14,ease:`power2.out`,...t.o(e)},r*.08).to(e,{rotation:0,duration:.9,ease:`elastic.out(1.5, 0.25)`},.14+r*.08)});return n}function K(t,n){let r=P(n.svg),i=n.face;n.face=e=>{i(e);let t=e===`left`;t!==r.flipped&&(r.flipped=t,F(n,r.letters))};let a={t:0},o=!1,s=0,c=e.to(a,{t:Math.PI*2,duration:1.9,ease:`none`,repeat:-1,onUpdate(){if(!n.el.isConnected){(o||++s>900)&&c.kill();return}o=!0;for(let e of r.waves){let t=Number(e.getAttribute(`data-j`)),n=-(t===0?1.5:4.5)*(.5+.5*Math.sin(a.t+t*.95));e.setAttribute(`transform`,`translate(0 ${n.toFixed(2)})`)}}}),l=n.destroy;n.destroy=()=>{c.kill(),l()}}var q={id:`busya`,svg:H,special:W,idleExtras:G,setup:K};export{q as default,F as setBeads};