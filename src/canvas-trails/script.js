import gsap from 'gsap'

console.clear()

const NUMBER_OF_CELLS = 24

const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')
const RATIO = window.devicePixelRatio || 1

CANVAS.width = CANVAS.offsetWidth * RATIO
CANVAS.height = CANVAS.offsetHeight * RATIO

const CELL_SIZE = CANVAS.width / NUMBER_OF_CELLS
const CELL_BORDER = CELL_SIZE * 0.1

const CELL_MAP = []
const CELLS = new Array(Math.pow(NUMBER_OF_CELLS, 2))
  .fill()
  .map((cell, index) => {
    // To work out the trail you need modulos to match?
    const x = index % NUMBER_OF_CELLS
    const y = Math.floor(index / NUMBER_OF_CELLS)
    
    const BASIS_X = x >= NUMBER_OF_CELLS * 0.5 ? (NUMBER_OF_CELLS * 0.5 - 1) - (x % (NUMBER_OF_CELLS * 0.5)) : x
    const BASIS_Y = y >= NUMBER_OF_CELLS * 0.5 ? (NUMBER_OF_CELLS * 0.5 - 1) - (y % (NUMBER_OF_CELLS * 0.5)) : y
    // const basis = index >= NUMBER_OF_CELLS * 0.5 ? (NUMBER_OF_CELLS - 1) - index : index
    console.info({ index, BASIS_X, BASIS_Y })
    // const trail = Math.min(
    //   index % (NUMBER_OF_CELLS * 1),
    //   Math.floor(index / (NUMBER_OF_CELLS * 1))
    // )

    const trail = Math.min(BASIS_X, BASIS_Y)
    
    if (!CELL_MAP[y]) CELL_MAP[y] = []
    CELL_MAP[y].push(trail)
    
    return {
      trail,
      x,
      y,
    }
  })

console.info({ CELL_MAP })

const DRAW = () => {
  for (const CELL of CELLS) {
    // console.info({ CELL })
    const HUE = (360 / (NUMBER_OF_CELLS * 0.5)) * CELL.trail
    CONTEXT.fillStyle = `hsl(${HUE} 80% 50%)`
    CONTEXT.fillRect(
      CELL.x * CELL_SIZE + CELL_BORDER,
      CELL.y * CELL_SIZE + CELL_BORDER,
      CELL_SIZE - CELL_BORDER * 2,
      CELL_SIZE - CELL_BORDER * 2
    )
  }
}

DRAW()