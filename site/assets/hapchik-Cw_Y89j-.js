import{t as e}from"./gsap-CvDoa17S.js";var t=`#3B2F4F`,n=`#2A2238`,r=`#6C5B7B`,i=`#574868`,a=[`#FF5A5F`,`#FF9F43`,`#FFD93D`,`#6BCB77`,`#4D96FF`,`#5B5FC7`,`#B983FF`],o={"--hp-hi":`#BDBFD1`,"--hp-body":`#A7A9BE`,"--hp-shade":`#8A8CA3`,"--hp-brow":`#4A4560`,"--hp-cheek":`#C99BB5`,...Object.fromEntries(a.map((e,t)=>[`--hp-r${t+1}`,`#7C7E96`]))},s={"--hp-hi":`#FFFFFF`,"--hp-body":`#FFFFFF`,"--hp-shade":`#E6ECF5`,"--hp-brow":`#4A4560`,"--hp-cheek":`#FF9EB1`,...Object.fromEntries(a.map((e,t)=>[`--hp-r${t+1}`,e]))},c=e=>Object.entries(e).map(([e,t])=>`${e}:${t}`).join(`;`),l=[[200,166,94],[102,240,62],[300,244,58],[120,158,56],[282,160,52]],u=[1,3,0,4,2],d={x:58,y:214,w:284,h:90,rx:44},f=d.y+d.h,p={cx:157,cy:170},m={cx:243,cy:170},h=37,g=45,_={x:22,y:292},v={x:_.x+25,y:_.y+30,s:.9};function y(e,n){let r=l.map(([r,i,a],o)=>{let s=`data-puff="${o}" data-origin="${r} ${i}"`;switch(e){case`outline`:return`<circle ${s} cx="${r}" cy="${i}" r="${a+4}" fill="${t}"/>`;case`shade`:return`<circle ${s} cx="${r}" cy="${i}" r="${a}" style="fill:var(--hp-shade)"/>`;case`body`:return`<circle ${s} cx="${r-4}" cy="${i-5.5}" r="${a-7}" fill="url(#${n}bg)"/>`;case`band`:return`<circle ${s} cx="${r}" cy="${i}" r="${a}" fill="url(#${n}rb)"/>`}}).join(``),i=d;return{outline:`<rect x="${i.x-4}" y="${i.y-4}" width="${i.w+8}" height="${i.h+8}" rx="${i.rx+4}" fill="${t}"/>`,shade:`<rect x="${i.x}" y="${i.y}" width="${i.w}" height="${i.h}" rx="${i.rx}" style="fill:var(--hp-shade)"/>`,body:`<rect x="${i.x}" y="${i.y-6}" width="${i.w-8}" height="${i.h-4}" rx="${i.rx}" fill="url(#${n}bg)"/>`,band:`<rect x="${i.x}" y="${i.y}" width="${i.w}" height="${i.h}" rx="${i.rx}" fill="url(#${n}rb)"/>`}[e]+r}function b(){let e=[30,84,136,186,236,288,340,380],t=`M0 420 L0 278 L${e[0]} 278`;for(let n=1;n<e.length;n++){let r=e[n-1],i=e[n];t+=` Q${(r+i)/2} 296 ${i} 278`}return t+=` L400 278 L400 420 Z`,`<path d="${t}"/>`}function x(e){let r=e.cx+3,i=e.cy-1;return`<g class="c-eye">
    <ellipse cx="${e.cx}" cy="${e.cy}" rx="${h}" ry="${g}" fill="#fff" stroke="${t}" stroke-width="6"/>
    <path d="M${e.cx-29} ${e.cy+27} Q${e.cx} ${e.cy+57} ${e.cx+29} ${e.cy+27} Q${e.cx} ${e.cy+40} ${e.cx-29} ${e.cy+27} Z" fill="#E4E1F0"/>
    <g class="c-pupil" data-range="9">
      <circle cx="${r}" cy="${i}" r="22" fill="${n}"/>
      <circle cx="${r-8}" cy="${i-9}" r="8.5" fill="#fff"/>
      <circle cx="${r+9}" cy="${i+9}" r="4.2" fill="#fff"/>
    </g>
  </g>`}function S(e,n,a){let o=e+a*9,s=n-11;return`<ellipse cx="${o}" cy="${s}" rx="6.5" ry="8.5" transform="rotate(${a*24} ${o} ${s})" fill="${r}" stroke="${t}" stroke-width="5"/>
    <ellipse cx="${e}" cy="${n}" rx="14" ry="13" fill="${r}" stroke="${t}" stroke-width="5"/>
    <path d="M${e-a*2} ${n+11} Q${e+a*10} ${n+8} ${e+a*12} ${n-1}" fill="none" stroke="${i}" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="${e-a*5}" cy="${n-5}" rx="4.5" ry="3" fill="#fff" opacity="0.45"/>`}function C(){let e=(e,n,r,i,a)=>`<text x="${n}" y="${r}" transform="rotate(${i} ${n} ${r})" text-anchor="middle" font-family="Nunito, 'Segoe UI', sans-serif" font-weight="900" font-size="30" fill="${a}" stroke="${t}" stroke-width="4" stroke-linejoin="round" paint-order="stroke">${e}</text>`;return`
    <ellipse cx="0" cy="-12" rx="17" ry="5" fill="#7A5B3F" stroke="${t}" stroke-width="4"/>
    <g class="hp-l2">${e(`3`,12,-11,10,`#4D96FF`)}</g>
    <g class="hp-l1">${e(`А`,-1,-8,-10,`#FF5A5F`)}</g>
    <path d="M-17 -12 Q-8 -6 0 -9 Q8 -6 17 -12 L12 2 L-12 2 Z" fill="#C9A27A" stroke="${t}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-12 2 C-34 8 -40 34 -30 46 Q0 56 30 46 C40 34 34 8 12 2 Z" fill="#C9A27A" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M24 12 C33 22 33 36 26 44 Q12 50 0 50 Q20 40 24 12 Z" fill="#A9825C"/>
    <path d="M-12 2 C-34 8 -40 34 -30 46 Q0 56 30 46 C40 34 34 8 12 2 Z" fill="none" stroke="${t}" stroke-width="5" stroke-linejoin="round"/>
    <g transform="rotate(-12 -14 26)">
      <rect x="-24" y="17" width="19" height="17" rx="4" fill="#E8D5B7" stroke="${t}" stroke-width="3"/>
      <path d="M-21 21 L-8 21 M-21 30 L-8 30" stroke="${t}" stroke-width="2" stroke-dasharray="2.5 3" stroke-linecap="round"/>
    </g>
    <circle cx="17" cy="16" r="6.5" fill="#E8D5B7" stroke="${t}" stroke-width="3"/>
    <path d="M13 13 L21 19 M21 13 L13 19" stroke="${t}" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="-20" cy="12" rx="5" ry="8" transform="rotate(30 -20 12)" fill="#fff" opacity="0.45"/>
    <rect x="-14" y="-2" width="28" height="7" rx="3.5" fill="#8C6A4A" stroke="${t}" stroke-width="3.5"/>`}var w=e=>{let n=`<defs>
      <linearGradient id="${e}rb" gradientUnits="userSpaceOnUse" x1="44" y1="0" x2="356" y2="0">
        ${a.map((e,t)=>`<stop offset="${(t/6).toFixed(3)}" style="stop-color:var(--hp-r${t+1})"/>`).join(``)}
      </linearGradient>
      <linearGradient id="${e}bg" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="250">
        <stop offset="0" style="stop-color:var(--hp-hi)"/><stop offset="1" style="stop-color:var(--hp-body)"/>
      </linearGradient>
      <clipPath id="${e}band">${b()}</clipPath>
    </defs>`,s=`
    <g class="c-leg-r" data-origin="178 294">
      <path d="M178 294 Q177 326 170 350" fill="none" stroke="${t}" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="165" cy="362" rx="22" ry="15" fill="${r}" stroke="${t}" stroke-width="6"/>
      <path d="M147 366 Q165 374 184 366" fill="none" stroke="${i}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="157" cy="355" rx="7" ry="4" fill="#fff" opacity="0.45"/>
    </g>
    <g class="c-leg-l" data-origin="222 294">
      <path d="M222 294 Q223 326 230 350" fill="none" stroke="${t}" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="235" cy="362" rx="22" ry="15" fill="${r}" stroke="${t}" stroke-width="6"/>
      <path d="M216 366 Q235 374 253 366" fill="none" stroke="${i}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="227" cy="355" rx="7" ry="4" fill="#fff" opacity="0.45"/>
    </g>`,l=`
    <g class="c-body" data-origin="200 ${f}">
      ${y(`outline`,e)}
      ${y(`shade`,e)}
      ${y(`body`,e)}
      <g clip-path="url(#${e}band)">${y(`band`,e)}</g>
      <path data-puff="3" data-origin="120 158" d="M82 160 Q84 128 110 114" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.55"/>
      <path data-puff="0" data-origin="200 166" d="M140 100 Q162 82 186 80" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.55"/>
      <circle data-puff="3" data-origin="120 158" cx="80" cy="178" r="5" fill="#fff" opacity="0.55"/>
    </g>`,u=`
    <g class="hp-face">
      <ellipse class="c-cheek" cx="122" cy="230" rx="17" ry="10.5" style="fill:var(--hp-cheek)"/>
      <ellipse class="c-cheek" cx="278" cy="230" rx="17" ry="10.5" style="fill:var(--hp-cheek)"/>
      <g class="c-eyes-open">${x(p)}${x(m)}</g>
      <g class="c-eyes-happy">
        <path d="M126 184 Q157 142 188 184" fill="none" stroke="${t}" stroke-width="10" stroke-linecap="round"/>
        <path d="M212 184 Q243 142 274 184" fill="none" stroke="${t}" stroke-width="10" stroke-linecap="round"/>
      </g>
      
    <g class="c-brow-r" data-origin="151 94">
      <path class="hp-sly" d="M122 106 Q146 72 186 90" fill="none" style="stroke:var(--hp-brow)" stroke-width="14" stroke-linecap="round"/>
      <path class="hp-kind" d="M122 104 Q150 84 182 98" fill="none" style="stroke:var(--hp-brow)" stroke-width="14" stroke-linecap="round" opacity="0"/>
    </g>
    <g class="c-brow-l" data-origin="249 104">
      <path class="hp-sly" d="M214 120 Q246 98 282 100" fill="none" style="stroke:var(--hp-brow)" stroke-width="14" stroke-linecap="round"/>
      <path class="hp-kind" d="M218 98 Q250 84 278 104" fill="none" style="stroke:var(--hp-brow)" stroke-width="14" stroke-linecap="round" opacity="0"/>
    </g>
      <g class="c-mouth-closed">
        <path d="M196 245 L196 253 Q196 258 201 258 L204 258 Q209 258 209 253 L209 246" fill="#fff" stroke="${t}" stroke-width="3.5" stroke-linejoin="round"/>
        <path class="hp-sly" d="M180 240 Q202 258 228 234" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round"/>
        <path class="hp-sly" d="M225 229 Q231 233 232 239" fill="none" stroke="${t}" stroke-width="5" stroke-linecap="round"/>
        <path class="hp-kind" d="M178 238 Q202 262 226 238" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round" opacity="0"/>
      </g>
      <g class="c-mouth-open" data-origin="202 238">
        <path d="M180 238 Q202 244 224 238 Q226 272 202 274 Q178 272 180 238 Z" fill="#5A2A3A" stroke="${t}" stroke-width="6" stroke-linejoin="round"/>
        <path d="M189 267 Q202 255 215 267 Q202 273 189 267 Z" fill="#FF7A93"/>
      </g>
    </g>`,d=`
    <g class="c-arm-r" data-origin="41 251">
      <path d="M41 251 C22 256 12 274 20 288" fill="none" stroke="${t}" stroke-width="9" stroke-linecap="round"/>
      <g class="acc-sack" data-origin="${_.x} ${_.y}">
        <path d="M${_.x} ${_.y} Q${_.x+1} ${_.y+16} ${v.x-13*v.s} ${v.y+1}" fill="none" stroke="${t}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${_.x} ${_.y} Q${_.x+1} ${_.y+16} ${v.x-13*v.s} ${v.y+1}" fill="none" stroke="#B08A60" stroke-width="3" stroke-linecap="round"/>
        <g transform="translate(${v.x} ${v.y}) scale(${v.s})">${C()}</g>
      </g>
      ${S(_.x,_.y,1)}
    </g>`,h=`
    <g class="c-arm-l" data-origin="357 254">
      <path d="M357 254 C374 262 384 280 380 298" fill="none" stroke="${t}" stroke-width="9" stroke-linecap="round"/>
      ${S(379,303,-1)}
    </g>`;return`<g class="hp-wrap" style="${c(o)}">
    ${n}
    <g class="hp-shadow-wrap"><ellipse class="c-shadow" cx="200" cy="386" rx="104" ry="12" fill="#000" opacity="0.12"/></g>
    <g class="c-root" data-origin="200 230">
      <g class="hp-float">
        ${s}
        <g class="c-head" data-origin="200 ${f}">
          ${l}
          ${u}
          ${d}
          ${h}
        </g>
      </g>
    </g>
  </g>`},T=new WeakMap,E=e=>{let t=T.get(e);return t||(t={p:0,friend:!1,sack:!0},T.set(e,t)),t};function D(t,n){for(let r of Object.keys(o)){let i=n<=0?o[r]:n>=1?s[r]:e.utils.interpolate(o[r],s[r],n);t.style.setProperty(r,i)}}function O(t,n,r=!1){let i=t.svg.querySelector(`.hp-wrap`);if(!i)return;let a=E(t.svg);a.friend=n,a.tw?.kill();let o=t.svg.querySelectorAll(`.hp-sly`),s=t.svg.querySelectorAll(`.hp-kind`),c=+!!n;if(r){a.p=c,D(i,a.p),e.set(o,{opacity:1-c}),e.set(s,{opacity:c});return}a.tw=e.to(a,{p:c,duration:1.4,ease:`sine.inOut`,onUpdate:()=>D(i,a.p)}),e.to(o,{opacity:1-c,duration:.5,delay:.3}),e.to(s,{opacity:c,duration:.5,delay:.3});let l=t.svg.querySelector(`.c-head`);l&&e.timeline().to(l,{scaleX:1.08,scaleY:.92,duration:.14,ease:`power2.out`,svgOrigin:`200 ${f}`}).to(l,{scaleX:1,scaleY:1,duration:.7,ease:`elastic.out(1.1, 0.35)`})}function k(t,n){let r=t.svg.querySelector(`.acc-sack`);r&&(E(t.svg).sack=n,e.killTweensOf(r,`scale,autoAlpha,opacity,visibility`),n?e.fromTo(r,{scale:.2,autoAlpha:0},{scale:1,autoAlpha:1,duration:.45,ease:`back.out(2.2)`,svgOrigin:`${_.x} ${_.y}`}):e.to(r,{scale:.2,autoAlpha:0,duration:.3,ease:`back.in(2)`,svgOrigin:`${_.x} ${_.y}`}))}var A=e=>((e+180)%360+360)%360-180,j=new WeakSet;function M(t,n){let r=e.timeline(),i=t.one(`.c-arm-l`),a=t.one(`.c-head`),o=t.one(`.c-brow-l`);if(!i)return r;let s=t.o(i);return a&&r.to(a,{rotation:4,duration:.25,ease:`power2.out`,...t.o(a)},0),n===`wave`?(r.to(i,{rotation:-135,duration:.25,ease:`back.out(2)`,...s},0).to(i,{rotation:-105,duration:.17,yoyo:!0,repeat:5,ease:`sine.inOut`}).to(i,{rotation:0,duration:.32,ease:`power2.inOut`}),o&&r.to(o,{y:-8,duration:.17,yoyo:!0,repeat:3,ease:`sine.inOut`},.25)):r.to(i,{rotation:-75,duration:.25,ease:`back.out(2)`,...s},0).to(i,{rotation:-70,duration:.4,yoyo:!0,repeat:1,ease:`sine.inOut`}).to(i,{rotation:0,duration:.3,ease:`power2.inOut`}),a&&r.to(a,{rotation:0,duration:.3,ease:`power2.inOut`},`<`),r}function N(t,n){E(t.svg);let r=t.one(`.hp-float`),i=t.one(`.hp-shadow-wrap`),a=t.one(`.c-leg-l`),o=t.one(`.c-leg-r`),s=t.one(`.c-arm-r`),c=t.one(`.c-head`),d=t.one(`.c-root`),f=t.one(`.acc-sack`),p=[];r&&(e.set(r,{y:6}),p.push(e.to(r,{y:-6,duration:1.5,ease:`sine.inOut`,yoyo:!0,repeat:-1}))),i&&(e.set(i,{scale:1,svgOrigin:`200 386`}),p.push(e.to(i,{scale:.86,opacity:.7,duration:1.5,ease:`sine.inOut`,yoyo:!0,repeat:-1}))),u.forEach((n,r)=>{let i=t.q(`[data-puff="${n}"]`);if(!i.length)return;let[a,o]=l[n];e.set(i,{svgOrigin:`${a} ${o}`}),p.push(e.to(i,{scale:1.045,duration:.75,ease:`sine.inOut`,yoyo:!0,repeat:-1,delay:r*.3}))}),a&&o&&(e.set(a,t.o(a)),e.set(o,t.o(o)),p.push(e.fromTo(a,{rotation:-5},{rotation:6,duration:1.1,ease:`sine.inOut`,yoyo:!0,repeat:-1})),p.push(e.fromTo(o,{rotation:5},{rotation:-6,duration:1.1,ease:`sine.inOut`,yoyo:!0,repeat:-1,delay:.25}))),f&&e.set(f,t.o(f));let m=t=>t&&Number(e.getProperty(t,`rotation`))||0,h=0,g=0,_=null,v=null,y=!1,b=performance.now(),x=(r,i)=>{let a=n.el.isConnected;if(a&&(y=!0),y&&!a||!y&&performance.now()-b>6e4){S();return}if(!f||!a)return;let o=Math.min(i,50)/1e3,l=-(m(s)+m(c)+m(d))+Math.sin(r*1.6)*2.5,u=Number(e.getProperty(n.el,`x`))||0;if(_!==null&&o>0){let n=(u-_)/o;if(v!==null){let r=Number(e.getProperty(t.svg,`scaleX`))<0?-1:1;g+=e.utils.clamp(-240,240,(n-v)*.15)*r}v=n}_=u;let p=A(l-h);g+=(p*70-g*5.5)*o,h=A(h+g*o),e.set(f,{rotation:h})};e.ticker.add(x);function S(){e.ticker.remove(x),p.forEach(e=>e.kill())}let C=n.emote.bind(n);n.emote=e=>{if(e!==`wave`&&e!==`point`)return C(e);j.add(t.svg);let n=M(t,e);return new Promise(e=>{n.eventCallback(`onComplete`,()=>{j.delete(t.svg),e()})})}}var P={id:`hapchik`,svg:w,special(t){let n=e.timeline(),r=t.one(`.c-root`),i=t.q(`.c-eye`),a=t.q(`.c-brow-l, .c-brow-r`),o=t.one(`.c-mouth-open`),s=t.one(`.c-mouth-closed`),c=t.q(`.c-cheek`),l=t.one(`.hp-l1`);return n.to(r,{scaleY:.9,scaleX:1.07,duration:.09,ease:`power2.in`,svgOrigin:`200 380`}),n.addLabel(`hic`),n.to(r,{y:-30,scaleY:1.12,scaleX:.93,duration:.1,ease:`power3.out`},`hic`),n.to(i,{scale:1.28,duration:.09,ease:`back.out(3)`,transformOrigin:`50% 50%`},`hic`),n.to(a,{y:-18,duration:.09,ease:`power2.out`},`hic`),s&&n.set(s,{opacity:0},`hic`),o&&n.fromTo(o,{opacity:1,scaleY:.1},{scaleY:.5,duration:.08,...t.o(o)},`hic`),n.to(c,{opacity:1,duration:.1},`hic`),l&&n.to(l,{x:14,y:-48,rotation:20,duration:.24,ease:`power2.out`,svgOrigin:`-1 -18`},`hic`).to(l,{x:0,y:0,rotation:0,duration:.3,ease:`power2.in`},`hic+=0.26`),n.to(r,{y:0,scaleY:1,scaleX:1,duration:.5,ease:`bounce.out`},`hic+=0.12`),n.to(i,{scale:1,duration:.45,ease:`elastic.out(1, 0.45)`},`hic+=0.4`),n.to(a,{y:0,duration:.45,ease:`elastic.out(1, 0.4)`},`hic+=0.4`),o&&n.to(o,{scaleY:.05,duration:.12},`hic+=0.36`).set(o,{opacity:0}),s&&n.set(s,{opacity:1}),n.to(c,{opacity:.55,duration:.4},`hic+=0.6`),n},idleExtras(t){let n=e.timeline();if(j.has(t.svg))return n;let r=t.one(`.c-head`),i=t.one(`.c-brow-l`),a=t.one(`.c-brow-r`),o=t.q(`.c-pupil`),s=Math.random();if(s<.4&&r){let e=t.one(`.c-eyes-open`),i=t.one(`.c-eyes-happy`);e&&i&&n.set(e,{opacity:0}).set(i,{opacity:1});for(let e=0;e<7;e++)n.to(r,{rotation:e%2?-3:3,duration:.07,ease:`sine.inOut`,...t.o(r)});n.to(r,{rotation:0,duration:.12}),e&&i&&n.set(e,{opacity:1}).set(i,{opacity:0})}else if(s<.75&&i&&a){n.to(o,{x:6,y:-2,duration:.2},0);for(let e=0;e<2;e++)n.to(i,{y:-10,duration:.14,ease:`power2.out`}).to(a,{y:4,duration:.14,ease:`power2.out`},`<`).to(i,{y:2,duration:.14,ease:`power2.inOut`}).to(a,{y:-8,duration:.14,ease:`power2.inOut`},`<`);n.to([i,a],{y:0,duration:.2}).to(o,{x:0,y:0,duration:.25},`<`)}else n.to(o,{x:-8,y:1,duration:.18,ease:`power2.out`}).to({},{duration:.35}).to(o,{x:8,y:1,duration:.2,ease:`power2.inOut`}).to({},{duration:.35}).to(o,{x:0,y:0,duration:.2}),i&&n.to(i,{y:5,duration:.2,yoyo:!0,repeat:1},.1);return n},setup:N};export{P as default,O as setFriend,k as setSack};