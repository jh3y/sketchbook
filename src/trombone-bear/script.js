import gsap from 'gsap'


gsap.set('.trombone-bear__torso', { transformOrigin: '50% 82%' })
gsap.set('.trombone-bear__upper-features', { transformOrigin: '26% 82%' })
// gsap.fromTo('.trombone-bear__torso, .trombone-bear__upper-features', {
//   rotate: -15,
  
// }, {
//   rotate: 15,
//   repeat: -1,
//   yoyo: true,
//   ease: 'none',
// })

// gsap.fromTo('.trombone-bear__slider-arm', {
//   xPercent: 0
// }, {
//   xPercent: 15,
//   yoyo: true,
//   repeat: -1,
//   duration: 0.25,
// })

import Trombone from './trombone.js'

const TROMBONE_INPUT = document.querySelector('input[type=range]')


// Initial state lifted from Trombone.js. Need to work out how to use it.
const INITIAL_STATE = {
  pitch: 116.54,
  partial: 2,
  position: 1,
}
// More extras from the original
const partialFrequencies = new Map([
  [0, 58.27],
  [1, 116.54],
  [2, 174.81],
  [3, 233.08],
  [4, 291.35],
  [5, 349.62],
  [6, 407.89],
  [7, 466.16],
  [8, 524.43],
  [9, 582.70],
  [10, 640.97],
  [11, 699.24]
]);

function getPitchModifierRatioFromPosition (position) {
  return -1.700893 + (0.05848351 + 1.700893) / (1 + Math.pow((position / 27.34756), 1.018593))
}

function adjustPitchFromPosition (position, pitch) {
  return pitch + (pitch * getPitchModifierRatioFromPosition(position));
}

function getPitchFromPartialAndPosition (partial, position) {
  let basePitch = partialFrequencies.get(partial);
  return adjustPitchFromPosition(position, basePitch);
}

function getPositionFromXCoord (x) {
  return 35.44613 + (0.9992146 - 35.44613) / (1 + Math.pow(x / 498.2127, 0.9692893));
}

function getPartialFromYCoord (y) {
  return 10 - Math.round(y / 10);
}

function getMidiNoteFromFrequency (freq) {
  return 1123.007 + (-1011.611 - 1123.007) / (1 + Math.pow((freq / 204.066), 0.0324439));
}

/**
 * Given an input[type=range]
 * Attack/Release on pointerdown/pointerup
 * Change Chords/Pitch on pointermove when active
 * */

// Takes an x && y which are a fraction of the viewport but could be anything
const changePitch = ({ y }) => {
  // console.info({ val: TROMBONE_INPUT.value / 10})
  const position = getPositionFromXCoord(TROMBONE_INPUT.value / 10)
  // const partial = getPartialFromYCoord(y / window.innerWidth * 100)
  const partial = getPartialFromYCoord(y / window.innerHeight * 100)

  console.info({ partial, pointer: y / window.innerHeight * 100 })

  gsap.set('.trombone-bear__torso, .trombone-bear__upper-features', {
    rotate: gsap.utils.clamp(-15, 15, gsap.utils.mapRange(60, 40, 15, -15)(y / window.innerHeight * 100))
  })
  // Position is based on the window position in the demo so a fraction of the position
  // position is based on x
  // partial is based on y

  let pitch = getPitchFromPartialAndPosition(partial, position);
  let midi = getMidiNoteFromFrequency(pitch);
  // console.info({ pitch, midi })
  Trombone.setPitch(pitch)
}

const slideArm = () => {
  gsap.set('.slider-arm', {
    xPercent: gsap.utils.clamp(0, 15, gsap.utils.mapRange(0, 1000, 0, 15)(TROMBONE_INPUT.value))
  })
}

// Only update the visual position when playing...
const attack = () => {
  Trombone.play()
  gsap.timeline()
    .to('input', {
      opacity: 0,
      duration: 0.25,
    })
    .to('.trombone-bear', {
      opacity: 1,
      duration: 0.25,
    }, 0)
  document.body.addEventListener('pointermove', changePitch)
}
const release = () => {
  Trombone.stop()
  gsap.timeline()
    .to('input', {
      opacity: 1,
      duration: 0.25,
    })
    .to('.trombone-bear', {
      opacity: 0,
      duration: 0.25,
    }, 0)
  document.body.removeEventListener('pointermove', changePitch)
}


// TROMBONE_INPUT.addEventListener('input', changePitch)
TROMBONE_INPUT.addEventListener('pointerdown', attack)
TROMBONE_INPUT.addEventListener('pointerup', release)

TROMBONE_INPUT.addEventListener('input', slideArm)

// Change pitch and tilt as you go