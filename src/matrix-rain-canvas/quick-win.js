import gsap from 'gsap'

const RATIO = window.devicePixelRatio || 1
const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')

const { height, width } = CANVAS.getBoundingClientRect()

CANVAS.height = height * RATIO
CANVAS.width = width * RATIO

const GLYPHS = 'ラドクリフマラソンわたしワタシんょンョたばこタバコとうきょうトウキョウ0123456789'.split('')

const COLUMNS = 60
const SIZE = Math.ceil(CANVAS.width / COLUMNS)
const ROWS = Math.ceil(CANVAS.height / SIZE)
const CHAR_COUNT = ROWS * COLUMNS

CONTEXT.textAlign = 'center'
CONTEXT.font = `${SIZE}px monospace`
const renderStart = () => {
  CONTEXT.fillStyle = 'hsl(120, 100%, 70%)'
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
  for (let c = 0; c < CHAR_COUNT; c++) {
    const x = c % COLUMNS 
    const y = Math.floor(c / COLUMNS)
    if (Math.random() > 0.25) {
      CONTEXT.fillText(
        gsap.utils.wrap(GLYPHS, gsap.utils.random(0, GLYPHS.length)),
        (x + 0.5) * SIZE,
        (y + 1) * SIZE
      )
    }
  }
  CONTEXT.fillStyle = 'hsla(0, 0%, 0%, 0.75)'
  CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height)
}

const columnWatcher = new Array(COLUMNS).fill().map(() => gsap.utils.random(-ROWS, -1, 1))

const renderColumns = () => {
  CONTEXT.fillStyle = 'hsla(0, 0%, 0%, 0.05)'
  CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height)
  CONTEXT.fillStyle = 'hsl(120, 100%, 70%)'
  for (let c = 0; c < COLUMNS; c++) {
    const column = c % COLUMNS 
    const y = (columnWatcher[column] + 1) * SIZE
    const x = (column + 0.5) * SIZE
    // set the first row off and see what it can do
    columnWatcher[column] += 1
    if (y >= 0 && columnWatcher[column] <= ROWS) {
      CONTEXT.fillText(
        gsap.utils.wrap(GLYPHS, gsap.utils.random(0, GLYPHS.length)),
        x,
        y
      )
    } else if ((columnWatcher[column] > ROWS) && (Math.random() > 0.9)) {
      columnWatcher[column] = -1
    }
  }
}

gsap.ticker.add(renderColumns)
gsap.ticker.fps(24)
renderStart()