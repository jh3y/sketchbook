import gsap from 'gsap'

const primary = `hsl(10 80% 50%)`
const secondary = `hsl(140 80% 50%)`
const debug = true

// Grab the canvas and context

const canvas = gsap.utils.toArray('canvas')[0]
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

const renderRatio = window.devicePixelRatio || 1

canvas.width = canvas.height = canvas.offsetHeight * renderRatio

console.info({ size: [canvas.width, canvas.height]})


/**
 * Grid starts with an even split
 * Cut it down the middle half for each.
 * But, first, you need to work out how big each piece will be.
 * Perhaps, you base it on a 20th of the container or even a 40th?
 * */


const columns = 16
const cellSize = canvas.width / columns

const cellCount = Math.pow(columns, 2)

const cells = new Array(cellCount).fill(primary).map((_, index) => ({
  id: index,
  x: index % columns * cellSize,
  y: Math.floor(index / columns) * cellSize,
  fill: index % columns < columns * 0.5 ? primary : secondary
}))

const drawSides = () => {
  const overlaps = getOverlaps()
  for (const cell of cells) {
    ctx.fillStyle = overlaps.find(c => c.id === cell.id) ? 'black' : cell.fill
    ctx.fillRect(cell.x, cell.y, cellSize, cellSize)
  }
}

const baller = {
  fill: primary,
  dx: -2,
  dy: -20,
  x: columns * 0.75 * cellSize,
  y: columns * 0.65 * cellSize,
}

const getOverlaps = () => {
  // A blocks has 4 corners so at any time can only have max 4 overlaps
  const [tl, tr, br, bl] = [
    [baller.x, baller.y],
    [baller.x + cellSize, baller.y],
    [baller.x + cellSize, baller.y + cellSize],
    [baller.x, baller.y + cellSize]
  ]
  // Based on those coordinates you can pluck th squares from the Array
  const overlaps = []
  for (const corner of [tl, tr, br, bl]) {
    const [x, y] = corner
    const column = Math.floor(x / cellSize)
    const row = Math.floor(y / cellSize)
    if (x <= columns * cellSize && x >= 0 && y > 0 && y <= columns * cellSize)
      overlaps.push(cells[(row * columns) + column])
  }
  return overlaps
}

const checkCollision = () => {
  // Get cell bounds and check the four corners of tl, tr, br, bl
  // Grab the coordinates for what would overlap and then color them in correctly
  const [top, right, bottom, left] = [baller.y * cellSize, baller.x + cellSize, baller.y + cellSize, baller.x]
  // Grab all cells that aren't "primary" and check if they are touching
  const primaryCells = cells.filter(c => c.fill === primary)
  for (const cell of primaryCells) {
    const [ct, cr, cb, cl] = [cell.y, cell.x + cellSize, cell.y + cellSize, cell.x]
    // The different modes of detection
    // console.info({ x: baller.x, wall: cl})
    if ((left <= cr) || (right >= (cellSize * columns))) {
      // baller.fill = secondary
      baller.dx = baller.dx * -1
      break
    }

  }
  // console.info({ primaryCells })
}

const renderBall = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawSides()
  ctx.fillStyle = baller.fill
  ctx.fillRect(baller.x, baller.y, cellSize, cellSize)
  // console.info({ dx: baller.dx })
  baller.x += baller.dx

  getOverlaps()
  checkCollision()
}

gsap.ticker.fps()
gsap.ticker.add(renderBall)

