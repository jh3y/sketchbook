import gsap from 'gsap'

const RATIO = window.devicePixelRatio || 1
const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')

const BUTTON = document.querySelector('button')

const DESIRED_SIZE = 16
const COLUMNS = Math.floor(
  Math.max(window.innerWidth, window.innerHeight) / DESIRED_SIZE
)
CANVAS.style.width = CANVAS.style.height = COLUMNS * DESIRED_SIZE
CANVAS.width = CANVAS.offsetWidth * RATIO
CANVAS.height = CANVAS.offsetHeight * RATIO

const GLYPHS = `,./;'[]=-01234567890abcdefghijklmnopqrstuvwxyz`.toUpperCase()

const NUMBER_OF_CELLS = Math.pow(COLUMNS, 2)

const CELLS = new Array(NUMBER_OF_CELLS).fill().map((cell, index) => {
  return {
    x: index % COLUMNS,
    y: Math.floor(index / COLUMNS),
    glyph: GLYPHS.charAt(gsap.utils.random(0, GLYPHS.length - 1, 1))
  }
})


const RENDER = () => {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
  CELLS.forEach((cell, index) => {
    if (Math.random() > 0.75) {
      cell.glyph = GLYPHS.charAt(gsap.utils.random(0, GLYPHS.length - 1, 1))
    }
    CONTEXT.font = `bold ${DESIRED_SIZE}px monospace`
    CONTEXT.textAlign = 'center'
    CONTEXT.fillStyle = 'hsl(210 80% 70%)'
    CONTEXT.fillText(cell.glyph, (cell.x * DESIRED_SIZE) + (DESIRED_SIZE * 0.5), (cell.y * DESIRED_SIZE) + (DESIRED_SIZE * 0.5), DESIRED_SIZE)
  })
}

BUTTON.addEventListener('click', () => {
  gsap.ticker.add(RENDER)
  gsap.timeline({
    onComplete: () => {
      gsap.ticker.remove(RENDER)
      CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
    }
  })
  .fromTo('canvas', {
    opacity: 0
  }, {
    opacity: 1,
    yoyo: true,
    repeat: 1,
    repeatDelay: 2,
  })
})