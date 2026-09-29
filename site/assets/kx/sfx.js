// Дополнительные процедурные звуки для кухни (поверх audio.sfx/audio.note игры).
import { audio } from './deps.js'

const ok = () => audio.ctx && audio.sfxBus
const now = () => audio.ctx.currentTime + 0.005
const rnd = (a, b) => a + Math.random() * (b - a)

export const sfx2 = {
  /** нож стукнул по доске */
  chop(vol = 1) {
    if (!ok()) return
    const t = now(), b = audio.sfxBus
    audio.noise(t, 0.05, 0.35 * vol, b, 'highpass', 2200)
    audio.osc('sine', 260, t, 0.09, 0.5 * vol, b, { toFreq: 90 })
    audio.osc('triangle', 520, t, 0.04, 0.12 * vol, b, { toFreq: 200 })
  },
  /** взмах ножа */
  swing(vol = 1) {
    if (!ok()) return
    audio.noise(now(), 0.16, 0.22 * vol, audio.sfxBus, 'bandpass', 3200, 900, 2)
  },
  /** хруст (несколько быстрых шумовых щелчков) */
  crunch(vol = 1) {
    if (!ok()) return
    const t = now()
    for (let i = 0; i < 3; i++) audio.noise(t + i * 0.055, 0.04, 0.3 * vol, audio.sfxBus, 'bandpass', rnd(1800, 3200), undefined, 1.5)
  },
  /** шкварчание — серия коротких шумовых вспышек */
  sizzle(dur = 1, vol = 1) {
    if (!ok()) return
    const t = now()
    for (let i = 0; i < dur * 22; i++) audio.noise(t + i * 0.045 + rnd(0, 0.02), 0.05, 0.1 * vol, audio.sfxBus, 'highpass', rnd(4500, 7500))
  },
  /** струйка воды/сока */
  pour(dur = 1, vol = 1) {
    if (!ok()) return
    const t = now()
    audio.noise(t, dur, 0.28 * vol, audio.sfxBus, 'bandpass', 900, 1700, 0.8)
    for (let i = 0; i < dur * 9; i++) audio.osc('sine', rnd(400, 900), t + i * 0.11, 0.08, 0.06 * vol, audio.sfxBus, { toFreq: rnd(900, 1500) })
  },
  /** посыпаем солью/сахаром */
  sprinkle(vol = 1) {
    if (!ok()) return
    const t = now()
    for (let i = 0; i < 9; i++) audio.noise(t + i * rnd(0.02, 0.05), 0.02, 0.18 * vol, audio.sfxBus, 'highpass', rnd(6000, 9000))
  },
  /** ложка о края кастрюли */
  stir(vol = 1) {
    if (!ok()) return
    const t = now()
    audio.osc('sine', rnd(280, 340), t, 0.09, 0.25 * vol, audio.sfxBus, { toFreq: 200 })
    audio.noise(t, 0.05, 0.12 * vol, audio.sfxBus, 'lowpass', 1400)
  },
  /** пена/мыло: скрип-шорох */
  scrub(vol = 1) {
    if (!ok()) return
    audio.noise(now(), 0.11, 0.16 * vol, audio.sfxBus, 'bandpass', rnd(2600, 4200), undefined, 3)
  },
  /** динь таймера/готовности */
  ding(vol = 1) {
    if (!ok()) return
    audio.note(88, 'bell', { dur: 1.1, vol: 0.5 * vol })
    audio.note(95, 'bell', { when: 0.02, dur: 0.9, vol: 0.25 * vol })
  },
  /** тик часов */
  tick(vol = 1) {
    if (!ok()) return
    audio.osc('square', 1800, now(), 0.02, 0.05 * vol, audio.sfxBus)
  },
  /** ням! (вверх) */
  yum(vol = 1) {
    if (!ok()) return
    audio.note(76, 'xylo', { dur: 0.25, vol: 0.4 * vol })
    audio.note(83, 'xylo', { when: 0.09, dur: 0.4, vol: 0.4 * vol })
    audio.note(88, 'bell', { when: 0.18, dur: 0.6, vol: 0.25 * vol })
  },
  /** бе-е-е! (вниз, «вау-вау») */
  yuck(vol = 1) {
    if (!ok()) return
    const t = now()
    audio.osc('sawtooth', 220, t, 0.5, 0.12 * vol, audio.sfxBus, { toFreq: 110 })
    audio.osc('sawtooth', 165, t + 0.05, 0.5, 0.1 * vol, audio.sfxBus, { toFreq: 82 })
  },
  /** блин перевернулся */
  flip(vol = 1) {
    if (!ok()) return
    audio.noise(now(), 0.25, 0.25 * vol, audio.sfxBus, 'bandpass', 500, 2400, 1)
    audio.osc('sine', 300, now() + 0.28, 0.12, 0.4 * vol, audio.sfxBus, { toFreq: 120 })
  },
  /** пух-пух: попкорн */
  popcorn(vol = 1) {
    if (!ok()) return
    audio.osc('sine', rnd(700, 1100), now(), 0.06, 0.4 * vol, audio.sfxBus, { toFreq: rnd(200, 300) })
    audio.noise(now(), 0.03, 0.2 * vol, audio.sfxBus, 'highpass', 3000)
  },
  /** апчхи! */
  sneeze(vol = 1) {
    if (!ok()) return
    const t = now()
    audio.noise(t, 0.12, 0.3 * vol, audio.sfxBus, 'bandpass', 2000, 800, 1)
    audio.osc('sawtooth', 600, t + 0.12, 0.18, 0.15 * vol, audio.sfxBus, { toFreq: 200 })
  },
  /** тёрка (шурх-шурх) */
  grate(vol = 1) {
    if (!ok()) return
    audio.noise(now(), 0.1, 0.2 * vol, audio.sfxBus, 'bandpass', rnd(3500, 5500), undefined, 4)
  },
  /** мыльные пузырьки */
  bloop(vol = 1) {
    if (!ok()) return
    audio.osc('sine', rnd(500, 800), now(), 0.1, 0.25 * vol, audio.sfxBus, { toFreq: rnd(1000, 1500) })
  },
  /** чпок (крышка, банка) */
  clonk(vol = 1) {
    if (!ok()) return
    const t = now()
    audio.osc('triangle', 180, t, 0.1, 0.4 * vol, audio.sfxBus, { toFreq: 120 })
    audio.noise(t, 0.04, 0.2 * vol, audio.sfxBus, 'lowpass', 900)
  },
}
