import "../../../../net/experimental-web-platform/script.js";
/**
 * Utilities
 * */
 const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const clamp = (min, max, value) => Math.min(Math.max(value, min), max)


const BANNER = document.querySelector('#cookie')
const AUDIO = new Audio(new URL('./yeet.mp3', import.meta.url))
AUDIO.volume = 0.25

const STATE = {
  active: false,
  translate: {
    origin: {
      x: 0,
      y: 0,
    },
    movement: {
      x: 0,
      y: 0,
    }
  },
  velocity: {
    x: 0,
    y: 0,
  }
}

const vmin = () => Math.min(window.innerHeight, window.innerWidth) / 100

const deactivateDrag = ({ x, y, movementX, movementY }) => {
  STATE.active = false
  STATE.origin = { x: 0, y: 0 }
  
  const distance = {
    x: x - STATE.translate.origin.x,
    y: y - STATE.translate.origin.y,
  }

  BANNER.style.cursor = 'grab'
  document.body.style.cursor = "initial"

  const velocity = Math.max(Math.abs(STATE.velocity.x), Math.abs(STATE.velocity.y))
  if (velocity > 100) {
    const duration = clamp(150, 400, mapRange(50, 150, 400, 150)(velocity))
    const travel = clamp(2, 5, mapRange(50, 100, 2, 5)(velocity))
    
    BANNER.style.setProperty('--speed', 0)
    AUDIO.play()
    BANNER.animate([
      {
        transform: `translate(${distance.x * travel}px, ${distance.y * travel}px)`,
        opacity: 0,
      }      
    ], {
      duration,
    }).finished.then(() => {
      BANNER.hidePopUp()
    })
  } else {
    const speed = clamp(0.25, 1, mapRange(0, vmin() * 10, 1, 0.25)(Math.max(Math.abs(distance.x), Math.abs(distance.y))))
    BANNER.style.setProperty('--speed', Math.abs(speed))
    BANNER.style.setProperty('--translate-x', 0)
    BANNER.style.setProperty('--translate-y', 0)
  }
  document.body.removeEventListener('pointermove', handleDrag)
  document.body.removeEventListener('pointerup', deactivateDrag)
}

const handleDrag = ({ x, y, movementX, movementY }) => {
  STATE.velocity = {
    x: movementX,
    y: movementY
  }
  const currentVmin = vmin()
  const translateX = clamp(currentVmin * -10, currentVmin * 10, x - STATE.translate.origin.x)
  const translateY = clamp(currentVmin * -10, currentVmin * 10, y - STATE.translate.origin.y)
  BANNER.style.setProperty('--translate-x', translateX)
  BANNER.style.setProperty('--translate-y', translateY)
}

const activateDrag = ({ x, y }) => {
  STATE.active = true
  STATE.translate.origin = { x, y }
  BANNER.style.setProperty('--speed', 0)
  BANNER.style.cursor = document.body.style.cursor = "grabbing"
  document.body.addEventListener('pointermove', handleDrag)
  document.body.addEventListener('pointerup', deactivateDrag)
}

BANNER.addEventListener('show', () => {
  BANNER.removeAttribute('style')
})

BANNER.addEventListener('pointerdown', activateDrag)