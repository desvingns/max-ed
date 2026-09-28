import{s as e}from"./voice-DxZWGDNJ.js";import{t}from"./gsap-CvDoa17S.js";var n=e({default:()=>G,peck:()=>U}),r=`#3B2F4F`,i=`#FFF4E0`,a=`#F2D7B0`,o=`#FFFBF3`,s=`#A38B74`,c=`#FF5A5F`,l=`#DB4A52`,u=`#FFB23F`,d=`#EE9A2C`,f=`#FF9F43`,p=`#F6E1BF`,m=`#E8C699`,h=`#2A2238`,g={cx:200,cy:230,r:134},_=`${g.cx} ${g.cy}`,v=g.cy+28,y=174,b=36,x={dx:-14,dy:-16},S=e=>e.toFixed(1),C=e=>{let t=e*Math.PI/180;return[S(g.cx+g.r*Math.cos(t)),S(g.cy+g.r*Math.sin(t))]},w=(e,t,n)=>`<path d="${e}" fill="none" stroke="${r}" stroke-width="${t+9}" stroke-linecap="round" stroke-linejoin="round"/><path d="${e}" fill="none" stroke="${n}" stroke-width="${t}" stroke-linecap="round" stroke-linejoin="round"/>`,T=e=>{let t=e-1;return w(`M${e} 346 L${t} 375 M${t} 375 L${t-14} 383 M${t} 375 L${t} 385 M${t} 375 L${t+14} 383`,9,f)},E=(e,t,n)=>`
  <g class="c-eye">
    <path d="M${e+n*17} ${t-20} l${n*7} -8 M${e+n*22} ${t-11} l${n*10} -4" stroke="${r}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="${e}" cy="${t}" rx="23" ry="27" fill="#fff" stroke="${r}" stroke-width="5"/>
    <g class="c-pupil" data-range="7">
      <ellipse cx="${e-n*2}" cy="${t-2}" rx="15" ry="17.5" fill="${h}"/>
      <circle cx="${e-n*2-5}" cy="${t-10}" r="6" fill="#fff"/>
      <circle cx="${e-n*2+5.5}" cy="${t+6.5}" r="2.8" fill="#fff"/>
    </g>
  </g>`,D=(e,t,n,i,a,o)=>{let s=S((e+n)/2),c=S((t+i)/2);return`<ellipse cx="${s}" cy="${c}" rx="${S(Math.hypot(n-e,i-t)/2)}" ry="${a}" transform="rotate(${S(Math.atan2(i-t,n-e)*180/Math.PI)} ${s} ${c})" fill="${o}" stroke="${r}" stroke-width="7"/>`},O=`M0 15 C20 21 46 17 57 4 Q65 -5 56 -10 Q58 -21 45 -19 Q42 -30 29 -23 C18 -20 8 -15 2 -11 C-7 -7 -7 11 0 15 Z`,k={x:98,y:256,rot:146},A=[k.x,k.y],j=`<g transform="translate(${k.x} ${k.y}) rotate(${k.rot})">
  <path d="${O}" fill="${a}"/>
  <ellipse cx="25" cy="5.5" rx="27" ry="9.5" fill="${i}"/>
  <path d="M18 -7 Q27 -2 36 -8" fill="none" stroke="${s}" stroke-width="4" stroke-linecap="round"/>
  <path d="${O}" fill="none" stroke="${r}" stroke-width="7" stroke-linejoin="round"/>
</g>`,M=[[150,282,5],[250,282,5],[200,290,5.5],[124,300,4.5],[276,300,4.5],[172,306,5],[228,308,5],[148,330,5.5],[252,330,5.5],[200,326,5],[176,348,4.5],[224,350,4.5],[110,328,4],[290,326,4]],N=[[100,190,4],[114,156,3.5],[300,190,4],[286,156,3.5]],P=e=>e.map(([e,t,n],r)=>`<ellipse cx="${e}" cy="${t}" rx="${n}" ry="${S(n*.8)}" fill="${s}" transform="rotate(${r*37%50-25} ${e} ${t})"/>`).join(``);function F(){let{cx:e,cy:t,r:n}=g,r=Math.hypot(x.dx,x.dy),i=Math.sqrt(n*n-(r/2)**2),a=e+x.dx/2,o=t+x.dy/2,s=-x.dy/r,c=x.dx/r,l=`${S(a+i*s)} ${S(o+i*c)}`,u=`${S(a-i*s)} ${S(o-i*c)}`,d=S(e+Math.sqrt(n*n-(v-t)**2)),f=S(e+x.dx+Math.sqrt(n*n-(v-t-x.dy)**2));return{body:`M${l} A${n} ${n} 0 1 1 ${u} A${n} ${n} 0 0 0 ${l} Z`,cap:`M${l} A${n} ${n} 0 0 1 ${d} ${v} L${f} ${v} A${n} ${n} 0 0 0 ${l} Z`}}var I=e=>{let{cx:t,cy:n,r:f}=g,h=`cx="${t}" cy="${n}" r="${f}"`,x=S(Math.sqrt(f*f-(v-n)**2)),w=`M${S(t-Number(x))} ${v} A${f} ${f} 0 1 1 ${S(t+Number(x))} ${v} Z`,[O,k]=C(188),[I,L]=C(-8),R=`M${O} ${k} A${f} ${f} 0 1 0 ${I} ${L}`,[z,B]=C(172),[V,H]=C(8),U=`M${z} ${B} A${f} ${f} 0 1 1 ${V} ${H}`,W=t-b,G=t+b,K=F();return`
  <ellipse class="c-shadow" cx="200" cy="387" rx="112" ry="13" fill="#000" opacity="0.12"/>
  <g class="c-egg" data-origin="200 386" opacity="0">
    <ellipse cx="200" cy="360" rx="21" ry="26" fill="#FFD93D" stroke="${r}" stroke-width="6"/>
    <path d="M214 344 C223 358 222 377 205 384 C216 374 218 358 214 344 Z" fill="#F2B52A"/>
    <ellipse cx="192" cy="350" rx="6" ry="9" fill="#fff" opacity="0.6" transform="rotate(20 192 350)"/>
  </g>
  <g class="c-root" data-origin="${t} ${n}">
    <g class="c-tail" data-origin="270 200"><g class="hen-tail-flick" data-origin="270 200">
      ${D(272,208,384,142,17,m)}
      ${D(268,202,360,86,18,p)}
      ${D(262,198,314,64,16,i)}
      <path d="M318 112 Q324 120 334 118 M342 150 Q350 158 360 154" fill="none" stroke="${s}" stroke-width="4" stroke-linecap="round"/>
    </g></g>
    <g class="c-leg-r" data-origin="178 346">${T(178)}</g>
    <g class="c-leg-l" data-origin="222 346">${T(222)}</g>
    <g class="c-body" data-origin="200 385">
      <circle ${h} fill="${i}"/>
      <ellipse cx="194" cy="314" rx="84" ry="44" fill="${o}"/>
      <path d="${K.body}" fill="${a}"/>
      ${P(M)}
      <path d="${R}" fill="none" stroke="${r}" stroke-width="8" stroke-linecap="round"/>
    </g>
    <g class="c-head" data-origin="${_}"><g class="hen-neck" data-origin="${_}">
      <g class="hen-comb">
        <circle cx="173" cy="94" r="17" fill="none" stroke="${r}" stroke-width="16"/>
        <circle cx="199" cy="78" r="22" fill="none" stroke="${r}" stroke-width="16"/>
        <circle cx="226" cy="88" r="18" fill="none" stroke="${r}" stroke-width="16"/>
        <circle cx="173" cy="94" r="17" fill="${l}"/>
        <circle cx="199" cy="78" r="22" fill="${l}"/>
        <circle cx="226" cy="88" r="18" fill="${l}"/>
        <circle cx="171" cy="92" r="14" fill="${c}"/>
        <circle cx="197" cy="76" r="19" fill="${c}"/>
        <circle cx="224" cy="86" r="15" fill="${c}"/>
        <ellipse cx="189" cy="68" rx="7" ry="4.5" fill="#fff" opacity="0.6" transform="rotate(-30 189 68)"/>
      </g>
      <path d="${w}" fill="${i}"/>
      <path d="${K.cap}" fill="${a}"/>
      <ellipse cx="124" cy="134" rx="22" ry="11" fill="#fff" opacity="0.6" transform="rotate(-48 124 134)"/>
      ${P(N)}
      <path d="${U}" fill="none" stroke="${r}" stroke-width="8" stroke-linecap="round"/>
      <ellipse class="c-cheek" cx="${t-68}" cy="212" rx="17" ry="11" fill="#FF9EB1"/>
      <ellipse class="c-cheek" cx="${t+68}" cy="212" rx="17" ry="11" fill="#FF9EB1"/>
      <g class="c-eyes-open">
        ${E(W,y,-1)}
        ${E(G,y,1)}
      </g>
      <g class="c-eyes-happy">
        <path d="M${W-19} 179 Q${W} 153 ${W+19} 179" fill="none" stroke="${r}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${G-19} 179 Q${G} 153 ${G+19} 179" fill="none" stroke="${r}" stroke-width="7" stroke-linecap="round"/>
      </g>
      <path class="c-brow-r" data-origin="${W} 136" d="M${W-11} 139 Q${W} 132 ${W+11} 137" fill="none" stroke="${r}" stroke-width="5" stroke-linecap="round"/>
      <path class="c-brow-l" data-origin="${G} 136" d="M${G-11} 137 Q${G} 132 ${G+11} 139" fill="none" stroke="${r}" stroke-width="5" stroke-linecap="round"/>
      <g class="hen-wattle">
        <ellipse cx="193" cy="231" rx="6.5" ry="8.5" fill="${c}" stroke="${r}" stroke-width="5" transform="rotate(22 193 231)"/>
        <ellipse cx="207" cy="231" rx="6.5" ry="8.5" fill="${c}" stroke="${r}" stroke-width="5" transform="rotate(-22 207 231)"/>
      </g>
      <path class="c-mouth-closed" d="M188 208 C190 229 210 229 212 208 Z" fill="${u}" stroke="${r}" stroke-width="5" stroke-linejoin="round"/>
      <g class="c-mouth-open" data-origin="200 208">
        <path d="M185 206 C183 254 217 254 215 206 Z" fill="#5A2A3A" stroke="${r}" stroke-width="5" stroke-linejoin="round"/>
        <ellipse cx="200" cy="236" rx="9" ry="5" fill="#FF7A93"/>
        <path d="M187 232 C191 252 209 252 213 232 C207 240 193 240 187 232 Z" fill="${u}" stroke="${r}" stroke-width="5" stroke-linejoin="round"/>
      </g>
      <g class="hen-beak">
        <path d="M183 192 Q200 182 217 192 Q219 204 200 220 Q181 204 183 192 Z" fill="${u}"/>
        <path d="M200 187 Q211 187 217 192 Q219 204 200 220 Z" fill="${d}"/>
        <path d="M183 192 Q200 182 217 192 Q219 204 200 220 Q181 204 183 192 Z" fill="none" stroke="${r}" stroke-width="5" stroke-linejoin="round"/>
        <ellipse cx="192" cy="194" rx="5" ry="3" fill="#fff" opacity="0.65"/>
      </g>
    </g></g>
    <!-- wings in front of the head cap, so raised wings stay visible -->
    <g class="c-wing-r" data-origin="${A[0]} ${A[1]}">${j}</g>
    <g class="c-wing-l" data-origin="${400-A[0]} ${A[1]}"><g transform="translate(400 0) scale(-1 1)">${j}</g></g>
  </g>`},L=new WeakSet,R={svgOrigin:`200 385`};function z(e){return{root:e.one(`.c-root`),neck:e.one(`.hen-neck`),tail:e.one(`.hen-tail-flick`),wingL:e.one(`.c-wing-l`),wingR:e.one(`.c-wing-r`),eyes:e.q(`.c-eye`),pupils:e.q(`.c-pupil`),mOpen:e.one(`.c-mouth-open`),mClosed:e.one(`.c-mouth-closed`),egg:e.one(`.c-egg`)}}function B(e,t,n,r=2){let i=z(t);if(!i.mOpen||!i.mClosed)return;let a=t.o(i.mOpen);for(let t=0;t<r;t++){let r=n+t*.2;e.set(i.mClosed,{opacity:0},r).set(i.mOpen,{opacity:1,scaleY:.3,...a},r).to(i.mOpen,{scaleY:.95,duration:.08,ease:`power2.out`},r).to(i.mOpen,{scaleY:.3,duration:.08,ease:`power2.in`},r+.1)}let o=n+r*.2;e.set(i.mOpen,{opacity:0,scaleY:.05},o).set(i.mClosed,{opacity:1},o)}function V(e){let t=z(e),n=e.tl();if(!t.root)return n;L.add(e.svg);let r=(r,i)=>{t.wingL&&n.fromTo(t.wingL,{rotation:-20},{rotation:-100,duration:.09,repeat:i*2-1,yoyo:!0,ease:`sine.inOut`,...e.o(t.wingL)},r),t.wingR&&n.fromTo(t.wingR,{rotation:20},{rotation:100,duration:.09,repeat:i*2-1,yoyo:!0,ease:`sine.inOut`,...e.o(t.wingR)},r)};return n.to(t.root,{scaleY:.86,scaleX:1.1,duration:.12,ease:`power2.in`,...R},0).to(t.root,{y:-46,scaleY:1.08,scaleX:.94,duration:.22,ease:`power2.out`},.12).to(t.root,{y:0,scaleY:1,scaleX:1,duration:.2,ease:`power2.in`},.34).to(t.root,{scaleY:.9,scaleX:1.07,duration:.07},.54).to(t.root,{scaleY:1,scaleX:1,duration:.25,ease:`elastic.out(1.2, 0.45)`},.61),r(.1,3),t.eyes.length&&n.to(t.eyes,{scale:1.2,duration:.12,transformOrigin:`50% 50%`},.1),B(n,e,.12,2),n.to(t.root,{rotation:6,duration:.08,ease:`sine.inOut`,repeat:5,yoyo:!0,...R},.72).to(t.root,{rotation:0,duration:.1},1.2),t.tail&&n.to(t.tail,{rotation:-16,duration:.08,repeat:5,yoyo:!0,...e.o(t.tail)},.72).to(t.tail,{rotation:0,duration:.1},1.2),t.egg&&n.set(t.egg,{opacity:1,scale:.2,x:0,rotation:0,...e.o(t.egg)},1.15).to(t.egg,{scale:1,x:118,duration:.35,ease:`back.out(2)`},1.15).to(t.egg,{rotation:12,duration:.1,repeat:3,yoyo:!0,ease:`sine.inOut`},1.5).to(t.egg,{rotation:0,duration:.08},1.9),t.pupils.length&&n.to(t.pupils,{x:6,y:6,duration:.2},1.3),B(n,e,1.4,2),r(1.45,2),n.to(t.root,{y:-18,duration:.14,ease:`power2.out`,yoyo:!0,repeat:1},1.5),t.eyes.length&&n.to(t.eyes,{scale:1,duration:.2},1.85),t.wingL&&n.to(t.wingL,{rotation:0,duration:.2},1.85),t.wingR&&n.to(t.wingR,{rotation:0,duration:.2},1.85),t.pupils.length&&n.to(t.pupils,{x:0,y:0,duration:.25},2.1),t.egg&&n.to(t.egg,{scale:0,opacity:0,duration:.25,ease:`back.in(2)`},2.25),n.call(()=>{L.delete(e.svg)},[],2.5),n}function H(e){let t=z(e),n=e.tl();if(L.has(e.svg))return n;let r=Math.random();if(r<.36&&t.neck){let r=Math.random()<.5?-1:1;n.to(t.neck,{rotation:9*r,duration:.3,ease:`sine.inOut`,...e.o(t.neck)}).to(t.neck,{rotation:0,duration:.4,ease:`sine.inOut`},`+=0.5`)}else r<.7&&t.neck?n.to(t.neck,{rotation:7,y:4,duration:.1,ease:`power2.in`,...e.o(t.neck)}).to(t.neck,{rotation:0,y:0,duration:.16,ease:`power2.out`}).to(t.neck,{rotation:6,y:3,duration:.09,ease:`power2.in`},`+=0.08`).to(t.neck,{rotation:0,y:0,duration:.18,ease:`power2.out`}):t.tail&&n.to(t.tail,{rotation:-14,duration:.12,ease:`power2.out`,...e.o(t.tail)}).to(t.tail,{rotation:0,duration:.9,ease:`elastic.out(1.2, 0.35)`});return n}function U(e){let n=e.part(`.c-root`),r=e.part(`.hen-neck`),i=e.part(`.hen-tail-flick`),a=e.part(`.c-eyes-open`),o=e.part(`.c-eyes-happy`);L.add(e.svg);let s=t.timeline();if(n&&s.to(n,{rotation:13,duration:.16,ease:`power2.out`,...R},0),a&&o&&s.set(a,{opacity:0},.14).set(o,{opacity:1},.14),r){let e={svgOrigin:_};for(let t=0;t<2;t++)s.to(r,{rotation:20,y:8,duration:.08,ease:`power3.in`,...e},t?`>+0.05`:.12).to(r,{rotation:5,y:0,duration:.12,ease:`power2.out`});s.to(r,{rotation:0,y:0,duration:.15})}if(n)for(let e=0;e<2;e++)s.to(n,{rotation:17,duration:.08,yoyo:!0,repeat:1,ease:`power2.in`},.12+e*.25);return i&&s.to(i,{rotation:-12,duration:.1,yoyo:!0,repeat:3,svgOrigin:`270 200`},.12),n&&s.to(n,{rotation:0,duration:.3,ease:`back.out(2)`},.66),a&&o&&s.set(a,{opacity:1},.8).set(o,{opacity:0},.8),new Promise(t=>{s.eventCallback(`onComplete`,()=>{L.delete(e.svg),t()})})}function W(e,n){let r=n.emote.bind(n),i=e.one(`.c-wing-l`),a=e.one(`.c-wing-r`);if(!i||!a)return;let o=e.o(i),s=e.o(a);n.emote=n=>{if(n===`cheer`){let e=r(n);for(let e of t.getTweensOf([i,a])){let t=e.vars.rotation;(t===150||t===-150||t===0&&e.duration()===.3)&&e.kill()}return t.timeline().to(i,{rotation:-100,duration:.22,ease:`back.out(2)`,...o},0).to(a,{rotation:100,duration:.22,ease:`back.out(2)`,...s},0).to(i,{rotation:-72,duration:.1,yoyo:!0,repeat:3,ease:`sine.inOut`},.24).to(a,{rotation:72,duration:.1,yoyo:!0,repeat:3,ease:`sine.inOut`},.24).to([i,a],{rotation:0,duration:.3,ease:`power2.inOut`},.72),e}if(n!==`wave`&&n!==`point`)return r(n);let c=t.timeline();return L.add(e.svg),n===`wave`?c.to(i,{rotation:-100,duration:.25,ease:`back.out(2)`,...o}).to(i,{rotation:-72,duration:.16,yoyo:!0,repeat:5,ease:`sine.inOut`}).to(i,{rotation:0,duration:.3}):c.to(i,{rotation:-44,duration:.25,ease:`back.out(2)`,...o}).to({},{duration:.8}).to(i,{rotation:0,duration:.3}),new Promise(t=>{c.eventCallback(`onComplete`,()=>{L.delete(e.svg),t()})})}}var G={id:`hen`,svg:I,special:V,idleExtras:H,setup:W};export{U as n,n as t};