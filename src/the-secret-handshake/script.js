import confetti from 'canvas-confetti'

const FANFARE = new Audio(new URL('./grunt-party--optimised.mp3', import.meta.url))

const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}
/** This is a tricky little thing to make.
 * Essentially need to work out rotation steps
 * But also check for deviance on the other axis at the same time
 * */

/**
 * Remember the different rotation axis that are available
 * alpha: around z-axis, flat === 0, 0 -> 360 clockise rotation
 * beta: around x-axis, an upright device is at 90, flat is 0. 180 is laying flat face down. Also get -180 -> 0
 * gamma: around y-axis, -90 is rotating to the left from flat. 90 is rotating to the right from flat.
 * */
const STEP_LABELS = document.querySelectorAll('.step')
// Need an activation window for each step...
// As long as the user remains within that, they won't fail
// Until the proximity drops to becomes 100 or less...
// TODO:: Check for deviations on other axis
// TODO:: Allow for some threshold window when doing this
const STEPS = [
  {
    axis: 'beta',
    start: 90,
    end: 0,
    starter_bounds: [[85, 95]],
  },
  {
    axis: 'alpha',
    start: 359,
    end: 270,
    starter_bounds: [
      [0, 5],
      [360, 355],
    ],
  },
  {
    axis: 'gamma',
    start: 0,
    end: 80,
    starter_bounds: [
      [-10, 10]
    ]
  },
]

/**
 * These steps would simulate
 * 1. Lay your phone flat
 * 2. Rotate it 90 deg to the right
 * 3. Tilt it up on its side
 * */
let currentStep = 0
let active = false
let distance
let proximity
let mapper
const UNLOCK_THRESHOLD = 5
const handleOrientation = (e) => {
  /**
   * This is where it gets tricky. We need to focus on the
   * first step in the STEPS that isn't completed until it is.
   * But, once we activate, we need to make sure the other axis
   * don't deviate too much to make sure we are on track.
   * We could do this by tracking the currentStep and having
   * a threshold for deviation perhaps.
   * */
  const STEP = STEPS[currentStep]
  /**
   * We need some way of knowing if we're in the active state
   * */
  const position = Math.floor(e[STEP.axis])
  let withinBounds
  if (!active)
    withinBounds =
      STEP.starter_bounds.filter(
        (bounds) => position >= bounds[0] && position <= bounds[1]
      ).length > 0
  // If the position falls within the starter_bounds of the step, activate
  const newProximity = mapper && Math.floor(mapper(position))
  if (!active && withinBounds) {
    console.info('activate')
    active = true
    mapper = mapRange(STEP.start, STEP.end, 100, 0)
    proximity = Math.floor(mapper(position))
  } else if (active && newProximity > proximity) {
    console.error('Wrong way')
    console.info({ proximity, newProximity })
    active = false
    proximity = undefined
    mapper = undefined
    currentStep = 0
  } else if (newProximity >= 0 && newProximity <= UNLOCK_THRESHOLD) {
    console.info('unlock')
    STEP_LABELS[currentStep].style.setProperty('--opacity', 1)
    if (currentStep === STEPS.length - 1) {
      confetti()
      FANFARE.play()
      window.removeEventListener('deviceorientation', handleOrientation)
    } else {
      currentStep = currentStep + 1
      const NEW_STEP = STEPS[currentStep]
      mapper = mapRange(NEW_STEP.start, NEW_STEP.end, 100, 0)
      proximity = mapper(Math.floor(e[NEW_STEP.axis]))
    }
  } else if (newProximity > UNLOCK_THRESHOLD && newProximity <= proximity) {
    console.info('keep going')
    proximity = newProximity
  }
}

// Need to tie this to a control to start...
if (DeviceOrientationEvent?.requestPermission) {
  DeviceOrientationEvent.requestPermission().then((permission) => {
    if (permission === 'granted')
      window.addEventListener('deviceorientation', handleOrientation)
    else alert('You denied permission to play!')
  })
} else {
  window.addEventListener('deviceorientation', handleOrientation)
}
