import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'

const getFontSize = () => {
  const REM = 16
  const VW = window.innerWidth / 100
  const PX = gsap.utils.clamp(2 * REM, 12 * REM, 6 * VW + REM)
  return Math.round(PX)
}

// Grab the canvas from the DOM we're going to clip
const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')
// Create a static canvas we can reuse for the text
const TEXT_CANVAS = document.createElement('canvas')
const TEXT_CONTEXT = TEXT_CANVAS.getContext('2d')
// Create a rings canvas that you can composite on at the end
const RING_CANVAS = document.createElement('canvas')
const RING_CONTEXT = RING_CANVAS.getContext('2d')

const DPI = window.devicePixelRatio || 1

// Set the heights
RING_CANVAS.height = TEXT_CANVAS.height = CANVAS.height = CANVAS.offsetHeight * DPI
RING_CANVAS.width = TEXT_CANVAS.width = CANVAS.width = CANVAS.offsetWidth * DPI



const TEXT = 'transitions.'
// Draw the text onto the text canvas
TEXT_CONTEXT.fillStyle = 'white'
TEXT_CONTEXT.textAlign = 'center'
TEXT_CONTEXT.textBaseline = 'middle'
TEXT_CONTEXT.font = `150 ${getFontSize() * DPI}px Geist Sans`
TEXT_CONTEXT.fillText(TEXT, TEXT_CANVAS.width / 2, TEXT_CANVAS.height / 2)

const RINGS = []

for (let i = 0; i < 150; i++) {
  RINGS.push({
    id: i,
    hue: gsap.utils.random(0, 359, 1),
    spread: gsap.utils.random(75, 359, 1),
    angle: 0,
  })
}
const ORIGIN = {
  x: 350 * DPI,
  y: -100 * DPI,
}
// const ORIGIN = {
//   x: CANVAS.width * 0.5 * DPI,
//   y: CANVAS.height * 0.5 * DPI,
// }

CONTEXT.globalCompositeOperation = 'normal'
CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
CONTEXT.drawImage(TEXT_CANVAS, 0, 0)
// Clip to the text
CONTEXT.globalCompositeOperation = 'source-in'

const DRAW = (skip) => {
  RING_CONTEXT.clearRect(0, 0, RING_CANVAS.width, RING_CANVAS.height)
  RING_CONTEXT.fillStyle = 'hsl(210, 30%, 16%)'
  RING_CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height)
  RING_CONTEXT.lineWidth = 1 * DPI
  RING_CONTEXT.lineCap = 'round'
  // Draw the rings
  for (const ring of RINGS) {
    RING_CONTEXT.strokeStyle = `hsl(${ring.hue}, 50%, 50%)`
    RING_CONTEXT.save()
    RING_CONTEXT.translate(ORIGIN.x, ORIGIN.y)
    RING_CONTEXT.rotate((ring.angle * Math.PI) / 180)
    RING_CONTEXT.translate(ORIGIN.x * -1, ORIGIN.y * -1)
    RING_CONTEXT.beginPath()
    RING_CONTEXT.arc(
      ORIGIN.x,
      ORIGIN.y,
      ring.id * (4 * DPI),
      0,
      (ring.spread * Math.PI) / 180
    )
    RING_CONTEXT.stroke()
    RING_CONTEXT.restore()
  }
  // Draw out the rings
  CONTEXT.drawImage(RING_CANVAS, 0, 0)
}

for (const ring of RINGS) {
  gsap.to(ring, {
    angle: 360,
    repeat: -1,
    ease: 'none',
    duration: () => gsap.utils.random(5, 20, 0.2),
    delay: () => gsap.utils.random(-5, -1, 0.1),
  })
}
gsap.ticker.fps(24)
gsap.ticker.add(DRAW)
DRAW()

document.querySelector('.text-block').style.color = 'transparent'

// const UPDATE_ORIGIN = ({ x, y }) => {
//   const BOUNDS = CANVAS.getBoundingClientRect()
//   ORIGIN.x = gsap.utils.clamp(0, CANVAS.width, x - BOUNDS.x) 
//   ORIGIN.y = gsap.utils.clamp(0, CANVAS.height, y - BOUNDS.y) 
// }

// document.body.addEventListener('pointermove', UPDATE_ORIGIN)