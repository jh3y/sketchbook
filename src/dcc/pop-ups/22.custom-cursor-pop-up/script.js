import "../../../../net/experimental-web-platform/script.js";

const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const clamp = (min, max, value) => Math.min(Math.max(value, min), max)

let canvas
let context
const blocks = []

const createBlock = ({ x, y, movementX, movementY }) => {
  const inactiveBlocks = blocks.filter(block => block.active === false)
  const size = Math.floor(mapRange(0, 100, 10, 50)(Math.max(Math.abs(movementX), Math.abs(movementY))))
  if (inactiveBlocks.length !== 0) {
    // Reuse a block
    inactiveBlocks[0].active = true
    inactiveBlocks[0].size = size
    inactiveBlocks[0].x = x - (size * 0.5)
    inactiveBlocks[0].y = y - (size * 0.5)
    inactiveBlocks[0].hue = Math.floor(Math.random() * 359)

  } else {
    const block = {
      active: true,
      hue: Math.floor(Math.random() * 359),
      x: x - (size * 0.5),
      y: y - (size * 0.5),
      size,
    }
    blocks.push(block)
  }
}

const drawBlocks = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  for (const block of blocks.filter(block => block.active)) {
    
    context.strokeStyle = context.fillStyle = `hsl(${block.hue}, 80%, 80%)`
    context.beginPath()
    context.arc(block.x, block.y, block.size * 0.5, 0, 2 * Math.PI)
    context.stroke()
    context.fill()

    block.size -= 1
    if (block.size === 0) {
      block.active = false
    }
  }
  requestAnimationFrame(drawBlocks)
}

const setUp = () => {
  canvas = document.querySelector('canvas')
  context = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.addEventListener('pointermove', createBlock)
  // Listen for any pop-ups that are opened and make sure the canvas sits higher
  document.body.addEventListener('show', (e) => {
    if (canvas.matches(':open') && e.target !== canvas) {
      requestAnimationFrame(() => {
        canvas.hidePopUp()
        canvas.showPopUp()
      })
    }
  })
  requestAnimationFrame(drawBlocks)
}

setUp()
window.addEventListener('resize', () => {
  if (canvas) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
})