import{t as e}from"./gsap-CvDoa17S.js";var t=`#3B2F4F`,n=`#2A2238`,r=`#7ED957`,i=`#E63946`,a=`#C42835`,o=`#FF7A93`,s=`var(--kapa, ${r})`,c=`var(--kapa-shade, #6BB84A)`,l=`var(--kapa-light, #C5EEB3)`,u=e=>Math.max(0,Math.min(255,Math.round(e)));function d(e){let t=e.trim().replace(`#`,``);t.length===3&&(t=t.split(``).map(e=>e+e).join(``));let n=parseInt(t.slice(0,6),16);return Number.isNaN(n)?d(r):[n>>16&255,n>>8&255,n&255]}var f=e=>`#`+e.map(e=>u(e).toString(16).padStart(2,`0`)).join(``).toUpperCase(),p=e=>[e[0]*.85,e[1]*.85,e[2]*.85],m=e=>[e[0]+(255-e[0])*.55,e[1]+(255-e[1])*.55,e[2]+(255-e[2])*.55],h=(e,t,n)=>[e[0]+(t[0]-e[0])*n,e[1]+(t[1]-e[1])*n,e[2]+(t[2]-e[2])*n];function g(e,t){e.style.setProperty(`--kapa`,f(t)),e.style.setProperty(`--kapa-shade`,f(p(t))),e.style.setProperty(`--kapa-light`,f(m(t)))}var _=new WeakMap,v=new WeakMap;function y(e){return e.el.dataset.kapa??r}function b(t,n,r=.6){let i=t.el,a=_.get(i)??d(y(t)),o=d(n);if(v.get(i)?.kill(),i.dataset.kapa=f(o),r<=0)return _.set(i,o),g(i,o),null;let s={t:0},c=e.to(s,{t:1,duration:r,ease:`sine.inOut`,onUpdate:()=>{let e=h(a,o,s.t);_.set(i,e),g(i,e)}});return v.set(i,c),c}var x=`M90 318 C78 258 130 218 194 218 C246 218 282 242 298 286 C310 322 292 354 250 354 C210 354 178 344 142 348 C108 352 94 340 90 318 Z`,S=`M204 214 C204 156 242 122 288 122 C332 122 358 150 366 182 C372 206 374 234 352 252 C332 270 292 274 262 270 C226 264 204 246 204 214 Z`,C=[112,312];function w(e=1){let t=222/64,[n,r]=C,i=Math.PI+.3,a=[],o=[],s=e=>e.toFixed(1),c=0;for(let l=0;l<=64;l++){let u=l/64;c=24*(1-.7*u);let d=-Math.sin(i),f=Math.cos(i);if(a.push(`${s(n+d*c)} ${s(r+f*c)}`),o.push(`${s(n-d*c)} ${s(r-f*c)}`),l===64)break;let p=e*(.008+.12*u**1.5);i-=p*t,n+=Math.cos(i)*t,r+=Math.sin(i)*t}let l=[],u=-Math.sin(i),d=Math.cos(i),f=Math.cos(i),p=Math.sin(i);for(let e=1;e<8;e++){let t=e/8*Math.PI;l.push(`${s(n+c*(u*Math.cos(t)+f*Math.sin(t)))} ${s(r+c*(d*Math.cos(t)+p*Math.sin(t)))}`)}return`M${a.join(` L`)} L${l.join(` L`)} L${o.reverse().join(` L`)} Z`}function T(e,n,r,i=385){let a=i;return`<path d="M${e-16} ${n} L${e-16} ${a-22} C${e-30} ${a-18} ${e-31} ${a} ${e-13} ${a} C${e-5} ${a} ${e-1} ${a-4} ${e+1} ${a-8} C${e+3} ${a-4} ${e+7} ${a} ${e+15} ${a} C${e+34} ${a} ${e+31} ${a-21} ${e+16} ${a-24} L${e+16} ${n} A16 16 0 0 0 ${e-16} ${n} Z" fill="${r}" stroke="${t}" stroke-width="7" stroke-linejoin="round"/>`}var E=[{cx:268,cy:154,R:39},{cx:340,cy:164,R:33}];function D(e){return`<circle cx="${e.cx}" cy="${e.cy}" r="${e.R-5}" fill="none" stroke="${c}" stroke-width="5"/>`}function O(e){let r=e.R-12,i=r*.54,a=e.cx+2,o=e.cy-2;return`<g class="c-eye" data-origin="${e.cx} ${e.cy}">
      <circle cx="${e.cx}" cy="${e.cy}" r="${r}" fill="#fff" stroke="${t}" stroke-width="5"/>
      <g class="c-pupil" data-range="${Math.round(r-i-2)}">
        <circle cx="${a}" cy="${o}" r="${i}" fill="${n}"/>
        <circle cx="${a-i*.36}" cy="${o-i*.38}" r="${i*.4}" fill="#fff"/>
        <circle cx="${a+i*.42}" cy="${o+i*.36}" r="${i*.18}" fill="#fff"/>
      </g>
    </g>`}var k=[320,250],A=[548,232],j=Math.ceil(Math.hypot(A[0]-k[0],A[1]-k[1]))+4,M=[`#FF5A5F`,`#FF9F43`,`#FFD93D`,`#62C6FF`,`#4D96FF`,`#9B6BFF`,`#FF8FC8`];function N(e){let n=E.map(O).join(``),r=E.map(e=>`<path d="M${e.cx-15} ${e.cy+5} Q${e.cx} ${e.cy-13} ${e.cx+15} ${e.cy+5}" fill="none" stroke="${t}" stroke-width="7" stroke-linecap="round"/>`).join(``),u=[[110,250,11],[130,235,12],[154,225,12],[179,219,11]].map(([e,n,r])=>`<circle cx="${e}" cy="${n}" r="${r}" fill="${s}" stroke="${t}" stroke-width="7"/>`).join(``),d=[[202,200,11],[206,176,12],[216,154,11]],f=(e,t)=>d.map(([n,r,i])=>`<circle cx="${n}" cy="${r}" r="${i}" fill="${e}" ${t}/>`).join(``),p=(e,t)=>E.map(n=>`<circle cx="${n.cx}" cy="${n.cy}" r="${n.R}" fill="${e}" ${t}/>`).join(``);return`
  <defs>
    <clipPath id="${e}bc"><path d="${x}"/></clipPath>
    <clipPath id="${e}bs"><path d="${x}" transform="translate(-10 -14)"/></clipPath>
    <clipPath id="${e}hc"><path d="${S}"/></clipPath>
  </defs>
  <ellipse class="c-shadow" cx="200" cy="387" rx="150" ry="13" fill="#000" opacity="0.12"/>
  <g class="c-root">
   <g transform="translate(200 385) scale(1.08) translate(-200 -385)">
    <!-- far legs (behind the body) -->
    <g class="c-leg-r" data-origin="178 330">${T(178,326,c,381)}</g>
    <g data-origin="292 330">${T(292,326,c,381)}</g>

    <!-- spiral tail -->
    <g class="c-tail" data-origin="${C[0]} ${C[1]}">
      <path class="k-tail" d="${w(1)}" fill="${s}" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
    </g>

    <!-- body -->
    <g class="c-body" data-origin="196 354">
      ${u}
      <path d="${x}" fill="${c}"/>
      <g clip-path="url(#${e}bc)">
        <path d="${x}" fill="${s}" transform="translate(-10 -14)"/>
        <g clip-path="url(#${e}bs)"><path d="M60 326 C130 306 230 296 330 312 L330 400 L60 400 Z" fill="${l}"/></g>
      </g>
      <circle cx="122" cy="274" r="11" fill="${l}"/>
      <circle cx="157" cy="252" r="13" fill="${l}"/>
      <circle cx="192" cy="250" r="9" fill="${l}"/>
      <path d="M104 290 C104 268 116 252 132 244" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.5"/>
      <path d="${x}" fill="none" stroke="${t}" stroke-width="8" stroke-linejoin="round"/>
    </g>

    <!-- near back leg -->
    <g class="c-leg-l" data-origin="142 330">${T(142,322,s)}</g>

    <!-- head: head + eye turrets merged into one outlined silhouette -->
    <g class="c-head" data-origin="240 262">
      <path d="${S}" fill="${t}" stroke="${t}" stroke-width="16" stroke-linejoin="round"/>
      ${f(t,`stroke="${t}" stroke-width="15"`)}
      ${p(t,`stroke="${t}" stroke-width="16"`)}
      ${f(s,``)}
      <path d="${S}" fill="${c}"/>
      <g clip-path="url(#${e}hc)">
        <path d="${S}" fill="${s}" transform="translate(-8 -12)"/>
        <ellipse cx="300" cy="288" rx="76" ry="33" fill="${l}"/>
      </g>
      ${p(s,``)}
      <ellipse cx="226" cy="196" rx="9" ry="14" fill="#fff" opacity="0.45" transform="rotate(20 226 196)"/>
      <path d="M360 204 q4 -3 6 1" fill="none" stroke="${t}" stroke-width="4" stroke-linecap="round"/>

      ${E.map(D).join(``)}

      <!-- beret -->
      <g class="k-beret" transform="rotate(-15 220 124)">
        <rect x="214" y="90" width="11" height="22" rx="5.5" fill="${i}" stroke="${t}" stroke-width="5"/>
        <ellipse cx="220" cy="122" rx="52" ry="22" fill="${i}" stroke="${t}" stroke-width="7"/>
        <path d="M172 128 Q220 150 270 126 Q260 140 220 142 Q186 142 172 128 Z" fill="${a}"/>
        <ellipse cx="200" cy="113" rx="16" ry="6" fill="#fff" opacity="0.5"/>
      </g>
      <g class="c-eyes-open">${n}</g>
      <g class="c-eyes-happy">${r}</g>

      <ellipse cx="258" cy="226" rx="14" ry="8.5" fill="#FF9EB1" opacity="0.85"/>
      <ellipse cx="348" cy="222" rx="10" ry="6.5" fill="#FF9EB1" opacity="0.85"/>
      <ellipse class="c-cheek" cx="258" cy="226" rx="14" ry="8.5" fill="#FF7F9E"/>
      <ellipse class="c-cheek" cx="348" cy="222" rx="10" ry="6.5" fill="#FF7F9E"/>

      <path class="c-mouth-closed" d="M284 236 Q314 258 342 234" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round"/>
      <g class="c-mouth-open" data-origin="313 240">
        <path d="M282 236 Q313 248 344 234 Q341 266 313 268 Q285 266 282 236 Z" fill="#5A2A3A" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
        <ellipse cx="313" cy="259" rx="15" ry="6.5" fill="${o}"/>
      </g>

      <!-- long tongue (special) -->
      <g class="k-tongue" opacity="0">
        <path class="k-tongue-line" d="M${k[0]} ${k[1]} L${A[0]} ${A[1]}" stroke="${t}" stroke-width="22" stroke-linecap="round" fill="none" stroke-dasharray="${j} ${j}" stroke-dashoffset="${j}"/>
        <path class="k-tongue-line" d="M${k[0]} ${k[1]} L${A[0]} ${A[1]}" stroke="${o}" stroke-width="12" stroke-linecap="round" fill="none" stroke-dasharray="${j} ${j}" stroke-dashoffset="${j}"/>
        <g class="k-tongue-tip">
          <g class="k-drop">
            <path class="k-drop-shape" d="M${k[0]} ${k[1]-40} C${k[0]+12} ${k[1]-24} ${k[0]+16} ${k[1]-16} ${k[0]+16} ${k[1]-10} A16 16 0 0 1 ${k[0]-16} ${k[1]-10} C${k[0]-16} ${k[1]-16} ${k[0]-12} ${k[1]-24} ${k[0]} ${k[1]-40} Z" fill="#4D96FF" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
            <ellipse cx="${k[0]-6}" cy="${k[1]-18}" rx="4" ry="6" fill="#fff" opacity="0.6"/>
          </g>
          <circle cx="${k[0]}" cy="${k[1]}" r="15" fill="${o}" stroke="${t}" stroke-width="6"/>
          <circle cx="${k[0]-5}" cy="${k[1]-5}" r="4.5" fill="#fff" opacity="0.6"/>
        </g>
      </g>
    </g>

    <!-- near front leg (waves) -->
    <g class="c-arm-l" data-origin="262 332">${T(262,324,s)}</g>
   </g>
  </g>`}function P(t,n){let r=t.one(`.k-tail`),i={c:1},a=()=>r?.setAttribute(`d`,w(i.c));return e.timeline().to(i,{c:n,duration:.6,ease:`sine.inOut`,onUpdate:a}).to(i,{c:1,duration:.8,ease:`back.out(1.6)`,onUpdate:a})}function F(t,n,i=.5){let a=d(n),o=d(r),s={t:0},c=()=>g(t,h(o,a,s.t));return e.timeline({onStart:()=>{let e=t.parentElement;o=(e&&_.get(e))??d(e?.dataset.kapa??r)}}).to(s,{t:1,duration:.25,ease:`power2.out`,onUpdate:c}).to(s,{t:0,duration:.6,ease:`sine.inOut`,onUpdate:c},`+=${i}`).call(()=>{t.style.removeProperty(`--kapa`),t.style.removeProperty(`--kapa-shade`),t.style.removeProperty(`--kapa-light`)})}var I={id:`kapa`,svg:N,setup(e,t){t.el.dataset.kapa||(t.el.dataset.kapa=r)},special(t){let n=t.one(`.c-root`),r=t.q(`.c-eye`),i=t.q(`.c-pupil`),a=t.one(`.c-mouth-open`),o=t.one(`.c-mouth-closed`),s=t.one(`.k-tongue`),c=t.q(`.k-tongue-line`),l=t.one(`.k-tongue-tip`),u=t.one(`.k-drop`),d=t.one(`.k-drop-shape`),f=t.q(`.c-cheek`),p=M[Math.floor(Math.random()*M.length)],m=A[0]-k[0],h=A[1]-k[1],g={svgOrigin:`200 385`},_=e.timeline();return _.set(d,{attr:{fill:p}},0).set(c,{strokeDashoffset:j},0).set(l,{x:0,y:0,scale:.5,transformOrigin:`50% 80%`},0).set(u,{scale:0,transformOrigin:`50% 100%`},0).to(n,{scaleX:.95,scaleY:1.04,rotation:-3,duration:.16,ease:`power2.in`,...g},0).to(r,{scale:1.25,duration:.16,ease:`back.out(3)`,transformOrigin:`50% 50%`},0).to(i,{x:7,y:0,duration:.14,ease:`power2.out`},0).set(s,{opacity:1},.16).set(a,{opacity:1,scaleY:.75},.16).set(o,{opacity:0},.16).to(n,{scaleX:1.05,scaleY:.97,rotation:2,duration:.12,ease:`power2.out`,...g},.16).to(c,{strokeDashoffset:0,duration:.15,ease:`power3.out`},.16).to(l,{x:m,y:h,scale:1,duration:.15,ease:`power3.out`},.16).to(u,{scale:1,duration:.2,ease:`back.out(3)`},.3).to(l,{y:h-6,duration:.1,yoyo:!0,repeat:1,ease:`sine.inOut`},.34).to(c,{strokeDashoffset:j,duration:.18,ease:`power2.in`},.62).to(l,{x:0,y:0,scale:.5,duration:.18,ease:`power2.in`},.62).set(s,{opacity:0},.8).set(a,{opacity:0,scaleY:.05},.8).set(o,{opacity:1},.8).to(n,{scaleX:1.08,scaleY:.9,rotation:0,duration:.1,ease:`power2.out`,...g},.8).to(n,{scaleX:1,scaleY:1,duration:.5,ease:`elastic.out(1.2, 0.4)`,...g},.9).to(r,{scale:1,duration:.3,ease:`power2.out`},.85).to(i,{x:0,y:0,duration:.3},.9).to(f,{opacity:1,duration:.2,yoyo:!0,repeat:1,repeatDelay:.6},.85).add(F(t.svg,p,.55),.82),_},idleExtras(t){let n=e.timeline(),r=t.q(`.c-pupil`);if(Math.random()<.5&&r.length>=2){let e=Math.PI*(1.05+Math.random()*.4),t=e-Math.PI+(Math.random()-.5)*.6;n.to(r[0],{x:Math.cos(e)*9,y:Math.sin(e)*9,duration:.22,ease:`power2.out`},0).to(r[1],{x:Math.cos(t)*7,y:Math.sin(t)*7,duration:.22,ease:`power2.out`},.14).to(r,{x:0,y:0,duration:.28,ease:`power2.inOut`,stagger:.08},1)}else{n.add(P(t,.7),0);let e=t.one(`.c-tail`);e&&n.to(e,{rotation:5,duration:.6,yoyo:!0,repeat:1,ease:`sine.inOut`,...t.o(e)},0)}return n}};export{y as colorOf,I as default,b as setColor};