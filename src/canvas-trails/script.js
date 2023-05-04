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
const CELLS = []
const NUMBER_OF_TRAILS = NUMBER_OF_CELLS * 0.5

for (let t = 0; t < NUMBER_OF_TRAILS; t++) {
  // In here generate the trails starting at x which will be the half way point?
  // Given the trail number, you can work out the length of a side, etc.
  const side = NUMBER_OF_CELLS - t * 2
  const total = side * 4 - 4
  const TRAIL_CELLS = []
  const START = {
    x: NUMBER_OF_CELLS * 0.5,
    y: t,
  }
  const LIMIT = {
    x: [t, NUMBER_OF_CELLS - t],
    y: [t, NUMBER_OF_CELLS - t],
  }
  // console.info({ t, side, START, total })
  let x = NUMBER_OF_CELLS * 0.5
  let y = t
  for (let c = 0; c < total; c++) {
    TRAIL_CELLS.push({
      x,
      y,
      scale: 0,
      trail: t,
    })
    // Can do it based on the sides?

    // Based on the 4 grid...
    // 1. Go right one
    // 2. Go down 3
    // 3. Go left 3

    // Starting point is 0 index based
    // NUMBER_OF_CELLS * 0.5

    const TOP_SIDE = side * 0.5 - 1
    const RIGHT_SIDE = TOP_SIDE + (side - 1)
    const BOTTOM_SIDE = RIGHT_SIDE + (side - 1)
    const LEFT_SIDE = BOTTOM_SIDE + (side - 1)

    if (c < TOP_SIDE) {
      x += 1
    } else if (c >= TOP_SIDE && c < RIGHT_SIDE) {
      y += 1
    } else if (c >= RIGHT_SIDE && c < BOTTOM_SIDE) {
      x -= 1
    } else if (c >= BOTTOM_SIDE && c < LEFT_SIDE) {
      y -= 1
    } else {
      x += 1
    }
  }
  CELLS.push(TRAIL_CELLS)
}

// const RENDERS = new Array(Math.pow(NUMBER_OF_CELLS, 2))
//   .fill()
//   .map((cell, index) => {
//     // To work out the trail you need modulos to match?
//     const x = index % NUMBER_OF_CELLS
//     const y = Math.floor(index / NUMBER_OF_CELLS)

//     const BASIS_X = x >= NUMBER_OF_CELLS * 0.5 ? (NUMBER_OF_CELLS * 0.5 - 1) - (x % (NUMBER_OF_CELLS * 0.5)) : x
//     const BASIS_Y = y >= NUMBER_OF_CELLS * 0.5 ? (NUMBER_OF_CELLS * 0.5 - 1) - (y % (NUMBER_OF_CELLS * 0.5)) : y
//     // const basis = index >= NUMBER_OF_CELLS * 0.5 ? (NUMBER_OF_CELLS - 1) - index : index
//     // console.info({ index, BASIS_X, BASIS_Y })
//     // const trail = Math.min(
//     //   index % (NUMBER_OF_CELLS * 1),
//     //   Math.floor(index / (NUMBER_OF_CELLS * 1))
//     // )

//     const trail = Math.min(BASIS_X, BASIS_Y)

//     if (!CELL_MAP[y]) CELL_MAP[y] = []
//     CELL_MAP[y].push(trail)

//     return {
//       trail,
//       x,
//       y,
//     }
//   })

// console.info({ CELL_MAP })

const RENDER_CELLS = [...CELLS[7], ...CELLS[10], ...CELLS[2]]

console.info({ RENDER_CELLS })

const DRAW = () => {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
  for (const CELL of RENDER_CELLS) {
    // console.info({ CELL })
    const HUE = (360 / (NUMBER_OF_CELLS * 0.5)) * CELL.trail
    CONTEXT.fillStyle = `hsl(${HUE} 80% 50%)`
    CONTEXT.fillRect(
      CELL.x * CELL_SIZE +
        CELL_BORDER +
        (CELL_SIZE - CELL_SIZE * CELL.scale) * 0.5,
      CELL.y * CELL_SIZE +
        CELL_BORDER +
        (CELL_SIZE - CELL_SIZE * CELL.scale) * 0.5,
      (CELL_SIZE - CELL_BORDER * 2) * CELL.scale,
      (CELL_SIZE - CELL_BORDER * 2) * CELL.scale
    )
  }
}

gsap.to(RENDER_CELLS, {
  scale: 1,
  repeat: -1,
  yoyo: true,
  duration: 0.25,
  delay: (index, cell) => {
    return index * 0.01
  },
})

gsap.ticker.add(DRAW)