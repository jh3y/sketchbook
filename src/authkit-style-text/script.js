import gsap from 'gsap'

const SQUARE_SIZE = 6
const TEXT = 'Super Cool!'

const GLOW_CANVAS = document.querySelector('.glow')
const GLOW_CONTEXT = GLOW_CANVAS.getContext('2d')

const BLUR_CANVAS = document.querySelector('.blur')
const BLUR_CONTEXT = BLUR_CANVAS.getContext('2d')

const STATIC_CANVAS = document.querySelector('.static')
const STATIC_CONTEXT = STATIC_CANVAS.getContext('2d')

// Basic offscreen canvas for creating xor composite block out
const TEXT_CANVAS = document.createElement('canvas')
const TEXT_CONTEXT = TEXT_CANVAS.getContext('2d')

// Font utility to make it happen
const REM = 16
const getFontSize = () => {
  return gsap.utils.clamp(2 * REM, 10 * REM, 0.08 * window.innerWidth + REM)
}
const FONT_SIZE = getFontSize()

// Set the width and height of the different canvases
BLUR_CANVAS.width =
  TEXT_CANVAS.width =
  STATIC_CANVAS.width =
  GLOW_CANVAS.width =
    GLOW_CANVAS.offsetWidth
BLUR_CANVAS.height =
  TEXT_CANVAS.height =
  STATIC_CANVAS.height =
  GLOW_CANVAS.height =
    GLOW_CANVAS.offsetHeight

// Generate the squares
const SQUARE_COUNT = Math.pow(
  Math.floor(
    Math.max(STATIC_CANVAS.offsetWidth, STATIC_CANVAS.offsetHeight) /
      SQUARE_SIZE
  ),
  2
)
const SQUARES = new Array(SQUARE_COUNT).fill({}).map((val, index) => {
  return {
    x: Math.floor(index % Math.sqrt(SQUARE_COUNT)),
    y: Math.floor(index / Math.sqrt(SQUARE_COUNT)),
    hue: gsap.utils.random(0, 359, 1),
    alpha: 0,
  }
  return val
})

// Render the text to the static canvas so it's in place.
STATIC_CONTEXT.fillStyle = 'hsl(210 40% 70% / 0.25)'
STATIC_CONTEXT.textAlign = 'center'
STATIC_CONTEXT.textBaseline = 'middle'
STATIC_CONTEXT.font = `150 ${FONT_SIZE}px Geist Sans`
STATIC_CONTEXT.fillText(
  TEXT,
  STATIC_CANVAS.width / 2,
  STATIC_CANVAS.height / 2
)
// Render to a static text canvas that we use as a composite in the render loop
TEXT_CONTEXT.globalCompositeOperation = 'xor'
TEXT_CONTEXT.fillStyle = 'black'
TEXT_CONTEXT.fillRect(0, 0, TEXT_CANVAS.width, TEXT_CANVAS.height)
TEXT_CONTEXT.fillStyle = 'red'
TEXT_CONTEXT.textAlign = 'center'
TEXT_CONTEXT.textBaseline = 'middle'
TEXT_CONTEXT.font = `150 ${FONT_SIZE}px Geist Sans`
TEXT_CONTEXT.fillText(
  TEXT,
  TEXT_CANVAS.width / 2,
  TEXT_CANVAS.height / 2
)

const RENDER = (CANVAS, CONTEXT) => () => {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
  for (const square of SQUARES) {
    CONTEXT.fillStyle = `hsl(${square.hue} 0% ${gsap.utils.random(
      20,
      100,
      1
    )}% / ${square.alpha})`
    CONTEXT.fillRect(
      square.x * SQUARE_SIZE,
      square.y * SQUARE_SIZE,
      SQUARE_SIZE,
      SQUARE_SIZE
    )
  }
  // That's an offscreen canvas with globalCompositeOperation
  // BLUR_CONTEXT.globalCompositeOperation =
  CONTEXT.globalCompositeOperation = 'xor'
  CONTEXT.drawImage(TEXT_CANVAS, 0, 0)
}


const BLUR_RENDER = RENDER(BLUR_CANVAS, BLUR_CONTEXT)
const GLOW_RENDER = RENDER(GLOW_CANVAS, GLOW_CONTEXT)

const distributor = gsap.utils.distribute({
  base: 0,
  amount: 1,
  from: 'center',
  grid: [Math.sqrt(SQUARE_COUNT), Math.sqrt(SQUARE_COUNT)],
})

const pulse = gsap.timeline({
  onStart: () => {
    gsap.ticker.add(BLUR_RENDER)
    gsap.ticker.add(GLOW_RENDER)
  },
  onComplete: () => {
    gsap.ticker.remove(BLUR_RENDER)
    gsap.ticker.remove(GLOW_RENDER)
  }
})
for (let s = 0; s < SQUARE_COUNT; s++) {
  pulse.to(
    SQUARES[s],
    {
      alpha: 1,
      duration: 0.25,
      repeat: 1,
      yoyo: true,
    },
    distributor(s, SQUARES[s], SQUARES) + gsap.utils.random(-0.1, 0.1)
  )
}

document.body.addEventListener('click', () => {
  pulse.restart()
})
