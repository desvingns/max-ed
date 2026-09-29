// ─────────────────────────────────────────────────────────────────────────────
// Единственное место, где kx/* обращается к хэшированным чанкам сборки Vite.
// Если игру пересоберут из исходников и хэши поменяются — править нужно только
// этот файл (имена экспортов смотрите в оригинальных чанках).
// ─────────────────────────────────────────────────────────────────────────────
export { t as gsap } from '../gsap-CvDoa17S.js'
export { t as audio } from '../audio-BEkH9VRF.js'
export { r as progress } from '../progress-CNOIQz2A.js'
export { i as getStage, n as STAGE_W, t as STAGE_H } from '../stage-DqiXhJoY.js'
export { n as makeChar, o as fx } from '../index-rPMhTJWI.js'
export { t as makeEpisode } from '../episode-BRv0AYQO.js'
export { n as rbtn } from '../icons-CRMH_CuS.js'
export { t as hasLine, a as sayLine } from '../voice-DxZWGDNJ.js'
export { t as draggable, n as hitTest, o as shuffle, r as pick, a as randInt } from '../input-BwoVuMYO.js'
export { setAccessory } from '../pyx-BOwle26E.js'
import * as K from '../kitchen-CaTsfYeh.js'
// понятные имена для кухонных SVG-предметов из kitchen-*.js
export const kitchen = {
  stove: K.A, plate: K.C, spoonMetal: K.D, sandBucket: K.E, fridgeDoor: K.M, teaCup: K.N, spoonWood: K.O,
  whisk: K.P, pan: K.S, pot: K.T, juiceJug: K._, animateBg: K.a, mitt: K.b, droplets: K.c, animateStove: K.d,
  fridge: K.f, iceMold: K.g, heatWaves: K.h, kettleOnStoveOffsets: K.i, sunSill: K.j, steam: K.k, eggCracked: K.l,
  hammer: K.m, sizes: K.n, bowl: K.o, glass: K.p, bubbles: K.s, layout: K.t, eggWhole: K.u, kettle: K.v,
  popsicle: K.w, omelet: K.x, background: K.y,
}
