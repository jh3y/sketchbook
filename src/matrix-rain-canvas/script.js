import gsap from 'gsap'

const RATIO = window.devicePixelRatio || 1
const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')

const { height, width } = CANVAS.getBoundingClientRect()

CANVAS.height = height * RATIO
CANVAS.width = width * RATIO

const GLYPHS =
  'ラドクリフマラソンわたしワタシんょンョたばこタバコとうきょうトウキョウ0123456789±!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const COLUMNS = 40
const SIZE = Math.ceil(CANVAS.width / COLUMNS)
const ROWS = Math.ceil(CANVAS.height / SIZE)
const CHAR_COUNT = ROWS * COLUMNS

CONTEXT.textAlign = 'center'
CONTEXT.font = `${SIZE}px monospace`

const columnWatcher = new Array(COLUMNS)
  .fill()
  .map(() => ({
    row: gsap.utils.random(-ROWS, -1, 1),
    len: gsap.utils.random(6, ROWS * 0.75),
    chars: {
      current: new Array(ROWS).fill().map(() => gsap.utils.wrap(GLYPHS, gsap.utils.random(0, GLYPHS.length))),
      last: [],
    },
  }))

const getColor = (row, y, len) => {
  const lower = 0.1
  const upper = 1
  let alpha = gsap.utils.clamp(lower, upper, gsap.utils.mapRange(-len, 0, lower, upper)(y - row))
  if (y > row) alpha = lower
  return `hsl(120, 100%, ${row === y ? 100 : 70}%, ${alpha})`
}
const renderMatrix = () => {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
  // Need to try and iterate over every cell in the Matrix...
  for (let c = 0; c < CHAR_COUNT; c++) {
    const x = c % COLUMNS
    const y = Math.floor(c / COLUMNS)
    const column = columnWatcher[x]
    
    // On the first row, let's bump the index
    // We could do this before we loop and go through and increment them all
    // if (y === 0 && Math.random() > 0.5) {
    if (y === 0 && Math.random() > 0.1) {
      column.row += 1
    }
    const row = column.row
    const chars = column.chars[y > row ? 'last' : 'current']
    CONTEXT.fillStyle = getColor(row, y, column.len)
    if (chars[y]) {
      if (y < row && ((row - y) < column.len) && Math.random() > 0.99) {
        chars[y] = gsap.utils.wrap(GLYPHS, gsap.utils.random(0, GLYPHS.length))
      } else if (y > row && Math.random() > 0.99) {
        chars[y] = ""
      } 
      CONTEXT.fillText(
        chars[y],
        (x + 0.5) * SIZE,
        (y + 1) * SIZE,
      )
    }
    if (row > (ROWS + column.len)) {
      column.len = gsap.utils.random(6, ROWS, 1)
      column.chars.last = [...column.chars.current]
      column.chars.current = new Array(ROWS).fill().map(() => gsap.utils.wrap(GLYPHS, gsap.utils.random(0, GLYPHS.length)))
      columnWatcher[x].row = gsap.utils.random(-ROWS, -1, 1)
    }
  }
}

gsap.ticker.add(renderMatrix)
gsap.ticker.fps(24)
