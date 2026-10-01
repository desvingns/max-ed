// Цок — конёк, хозяин Шахматного Королевства. Character rig in the same format as the other hosts
// (c-root / c-body / c-head / c-eye / c-pupil / c-mouth-open / c-mouth-closed / c-arm-l/r / c-tail …).
import { t as gsap } from './gsap-CvDoa17S.js'

const INK = '#3B2F4F'
const PUPIL = '#2A2238'
const COAT = '#C98A4B'
const COAT_SHADE = '#A96F35'
const COAT_HI = '#E7B074'
const MANE = '#6A4A8C'
const MANE_HI = '#8D6BB5'
const HOOF = '#5E3D22'
const MUZZLE = '#F6D9B6'
const BLAZE = '#FFF6E6'
const PLUM = '#8E6BD6'

const HEAD = 'M200 76 C264 76 298 122 292 172 C288 210 270 236 264 262 C260 286 234 298 200 298 C166 298 140 286 136 262 C130 236 112 210 108 172 C102 122 136 76 200 76 Z'
const BODY = 'M104 306 C104 262 148 240 200 240 C252 240 296 262 296 306 C296 354 262 386 200 386 C138 386 104 354 104 306 Z'

const eye = (cx, cy) => `
  <g class="c-eye" data-origin="${cx} ${cy}">
    <ellipse cx="${cx}" cy="${cy}" rx="20" ry="24" fill="#fff" stroke="${INK}" stroke-width="6"/>
    <g class="c-pupil" data-range="8">
      <ellipse cx="${cx + 1}" cy="${cy - 2}" rx="13" ry="16" fill="${PUPIL}"/>
      <circle cx="${cx - 4}" cy="${cy - 10}" r="6" fill="#fff"/>
      <circle cx="${cx + 5}" cy="${cy + 4}" r="2.6" fill="#fff"/>
    </g>
  </g>`

const arm = side => {
  const n = side === 'l' ? -1 : 1
  const sx = 200 + n * 84
  const ex = 200 + n * 98
  return `
  <g class="c-arm-${side}" data-origin="${sx} 296">
    <path d="M${sx} 296 L${ex} 350" stroke="${INK}" stroke-width="44" stroke-linecap="round" fill="none"/>
    <path d="M${sx} 296 L${ex} 350" stroke="${COAT}" stroke-width="28" stroke-linecap="round" fill="none"/>
    <path d="M${ex - 17} 350 Q${ex} 372 ${ex + 17} 350 L${ex + 17} 362 Q${ex} 382 ${ex - 17} 362 Z" fill="${HOOF}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  </g>`
}

const svg = e => `
<defs>
  <clipPath id="${e}body"><path d="${BODY}"/></clipPath>
  <clipPath id="${e}head"><path d="${HEAD}"/></clipPath>
  <pattern id="${e}chk" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
    <rect width="34" height="34" fill="#FFF6E6"/>
    <rect width="17" height="17" fill="${PLUM}"/>
    <rect x="17" y="17" width="17" height="17" fill="${PLUM}"/>
  </pattern>
</defs>
<ellipse class="c-shadow" cx="200" cy="388" rx="122" ry="12" fill="#000" opacity="0.12"/>
<g class="c-root">
  <g class="c-tail" data-origin="284 318">
    <path d="M280 318 C330 300 356 330 344 372 C338 392 318 392 312 372 C318 348 300 340 280 344 Z" fill="${MANE}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M318 322 C336 334 338 356 330 374" fill="none" stroke="${MANE_HI}" stroke-width="6" stroke-linecap="round"/>
  </g>

  <g class="c-body" data-origin="200 385">
    <path d="${BODY}" fill="${COAT_SHADE}"/>
    <g clip-path="url(#${e}body)">
      <path d="${BODY}" fill="${COAT}" transform="translate(-14 -10)"/>
      <ellipse cx="200" cy="332" rx="58" ry="46" fill="${COAT_HI}" opacity="0.55"/>
    </g>
    <path d="${BODY}" fill="none" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <!-- checkered scarf -->
    <path d="M122 288 Q200 326 278 288 L272 330 Q200 372 128 330 Z" fill="url(#${e}chk)" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  </g>

  <g class="c-leg-l" data-origin="160 366">
    <path d="M136 372 Q160 356 184 372 Q186 390 160 390 Q134 390 136 372 Z" fill="${HOOF}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
  </g>
  <g class="c-leg-r" data-origin="240 366">
    <path d="M216 372 Q240 356 264 372 Q266 390 240 390 Q214 390 216 372 Z" fill="${HOOF}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
  </g>

  ${arm('l')}
  ${arm('r')}

  <g class="c-head" data-origin="200 250">
    <!-- side mane behind the head -->
    <path d="M118 108 C84 116 74 168 88 214 C96 240 118 246 130 232 C112 210 112 160 130 128 Z" fill="${MANE}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M282 108 C316 116 326 168 312 214 C304 240 282 246 270 232 C288 210 288 160 270 128 Z" fill="${MANE}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <g class="t-ear-l" data-origin="150 92">
      <path d="M132 100 C116 62 126 32 146 22 C160 40 170 68 172 92 Z" fill="${COAT}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M140 84 C134 62 138 46 146 38 C154 52 158 68 160 84 Z" fill="#FF9EB1"/>
    </g>
    <g class="t-ear-r" data-origin="250 92">
      <path d="M268 100 C284 62 274 32 254 22 C240 40 230 68 228 92 Z" fill="${COAT}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M260 84 C266 62 262 46 254 38 C246 52 242 68 240 84 Z" fill="#FF9EB1"/>
    </g>
    <path d="${HEAD}" fill="${COAT_SHADE}"/>
    <g clip-path="url(#${e}head)">
      <path d="${HEAD}" fill="${COAT}" transform="translate(-12 -8)"/>
      <path d="M176 76 L224 76 L232 250 Q200 262 168 250 Z" fill="${BLAZE}"/>
      <path d="M120 152 Q116 132 126 114" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="7" stroke-linecap="round"/>
    </g>
    <path d="${HEAD}" fill="none" stroke="${INK}" stroke-width="8"/>
    <!-- muzzle -->
    <path d="M148 246 C148 226 172 218 200 218 C228 218 252 226 252 246 C254 276 232 296 200 296 C168 296 146 276 148 246 Z" fill="${MUZZLE}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
    <ellipse cx="176" cy="246" rx="6" ry="9" fill="#7A4B2A" transform="rotate(12 176 246)"/>
    <ellipse cx="224" cy="246" rx="6" ry="9" fill="#7A4B2A" transform="rotate(-12 224 246)"/>
    <ellipse class="c-cheek" cx="140" cy="206" rx="17" ry="11" fill="#FF9EB1"/>
    <ellipse class="c-cheek" cx="260" cy="206" rx="17" ry="11" fill="#FF9EB1"/>

    <g class="c-eyes-open">
      ${eye(158, 160)}
      ${eye(242, 160)}
    </g>
    <g class="c-eyes-happy">
      <path d="M138 164 Q158 140 178 164" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
      <path d="M222 164 Q242 140 262 164" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
    </g>
    <path class="c-brow-r" data-origin="158 126" d="M144 128 Q158 120 172 126" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
    <path class="c-brow-l" data-origin="242 126" d="M228 126 Q242 120 256 128" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>

    <g class="c-mouth-open" data-origin="200 270">
      <path d="M172 266 Q200 262 228 266 Q232 298 200 300 Q168 298 172 266 Z" fill="#5A2A3A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <ellipse cx="200" cy="292" rx="14" ry="7" fill="#FF7A93"/>
    </g>
    <path class="c-mouth-closed" d="M172 268 Q186 284 200 270 Q214 284 228 268" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- forelock -->
    <g class="t-fringe" data-origin="200 84">
      <path d="M164 84 C150 116 170 138 188 122 C192 146 216 148 222 122 C238 138 254 116 238 84 C222 70 180 70 164 84 Z" fill="${MANE}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M176 92 C172 106 178 116 186 114 M212 92 C210 108 216 118 224 116" fill="none" stroke="${MANE_HI}" stroke-width="5" stroke-linecap="round"/>
    </g>
  </g>
</g>`

const flick = (t, side) => {
  const tl = gsap.timeline()
  const ear = t.one(`.t-ear-${side}`)
  if (ear) {
    tl.to(ear, { rotation: side === 'l' ? -22 : 22, duration: 0.1, ease: 'power2.out', ...t.o(ear) })
      .to(ear, { rotation: side === 'l' ? 8 : -8, duration: 0.09 })
      .to(ear, { rotation: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)' })
  }
  return tl
}

const swish = t => {
  const tl = gsap.timeline()
  const tail = t.one('.c-tail')
  if (tail) {
    tl.to(tail, { rotation: -18, duration: 0.18, ease: 'power2.out', ...t.o(tail) })
      .to(tail, { rotation: 14, duration: 0.2, ease: 'sine.inOut' })
      .to(tail, { rotation: -10, duration: 0.2, ease: 'sine.inOut' })
      .to(tail, { rotation: 0, duration: 0.45, ease: 'elastic.out(1, 0.4)' })
  }
  return tl
}

// "special": a proud rear-up and a neigh
const special = t => {
  const tl = gsap.timeline()
  const root = t.one('.c-root')
  const head = t.one('.c-head')
  const armL = t.one('.c-arm-l')
  const armR = t.one('.c-arm-r')
  const fringe = t.one('.t-fringe')
  if (root) {
    tl.to(root, { scaleY: 0.9, scaleX: 1.08, duration: 0.14, ease: 'power2.in', svgOrigin: '200 385' })
      .to(root, { rotation: -12, y: -46, scaleY: 1.06, scaleX: 0.96, duration: 0.3, ease: 'power2.out', svgOrigin: '200 385' })
      .to(root, { rotation: -8, duration: 0.5, ease: 'sine.inOut' })
      .to(root, { rotation: 0, y: 0, scaleY: 1, scaleX: 1, duration: 0.32, ease: 'bounce.out', svgOrigin: '200 385' })
  }
  if (armL && armR) {
    tl.to([armL, armR], { rotation: (i) => (i ? 70 : -70), duration: 0.25, ease: 'back.out(2)', transformOrigin: '50% 10%' }, 0.14).to([armL, armR], { rotation: 0, duration: 0.3 }, 1.0)
  }
  if (head) tl.to(head, { rotation: -10, duration: 0.3, ease: 'sine.inOut', ...t.o(head) }, 0.3).to(head, { rotation: 0, duration: 0.35 }, 0.95)
  if (fringe) tl.to(fringe, { rotation: 8, duration: 0.15, yoyo: true, repeat: 3, ...t.o(fringe) }, 0.4)
  return tl
}

export default {
  id: 'tsok',
  svg,
  special,
  idleExtras: t => (Math.random() < 0.6 ? flick(t, Math.random() < 0.5 ? 'l' : 'r') : swish(t)),
}
