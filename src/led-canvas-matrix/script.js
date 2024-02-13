import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const CONFIG = {
  cell: '#e816af',
  track: '#000000',
  frame: '#111111',
  fps: 24,
  amount: 1200,
  noise: 0.02,
  hOffset: undefined,
  vOffset: undefined,
  columns: undefined,
  rows: undefined,
  size: 12,
  border: 2,
}

const canvas = Object.assign(document.createElement('canvas'), {
  width: window.innerWidth,
  height: window.innerHeight,
})
const context = canvas.getContext('2d')

const gridCanvas = Object.assign(document.createElement('canvas'), {
  width: window.innerWidth,
  height: window.innerHeight,
})
const gridContext = gridCanvas.getContext('2d')

document.body.appendChild(canvas)

const setGrid = () => {
  gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height)
  gridContext.fillStyle = CONFIG.track
  const hTracks = Math.ceil(gridCanvas.width / CONFIG.size)
  const hOffset = (gridCanvas.width % CONFIG.size) * 0.5
  for (let h = 0; h < hTracks; h++) {
    gridContext.fillRect(h * CONFIG.size + (hOffset) - CONFIG.border, 0, CONFIG.border * 2, gridCanvas.height)
  }
  const vTracks = Math.ceil(gridCanvas.height / CONFIG.size)
  const vOffset = (gridCanvas.height % CONFIG.size) * 0.5
  for (let v = 0; v < vTracks; v++) {
    gridContext.fillRect(0, v * CONFIG.size + (vOffset) - CONFIG.border, gridCanvas.width, CONFIG.border * 2)
  }
  CONFIG.columns = hTracks
  CONFIG.hOffset = hOffset
  CONFIG.rows = vTracks
  CONFIG.vOffset = vOffset
  CONFIG.cells = new Array(CONFIG.amount).fill(0).map(() => ([
      Math.floor(Math.random() * CONFIG.columns),
      Math.floor(Math.random() * CONFIG.rows)
    ]))
}

const updateCells = () => {
  // Based on noise, update a cell
  CONFIG.cells = CONFIG.cells.map(([x, y]) => {
    return [
      Math.random() > (1 - CONFIG.noise) ? Math.floor(Math.random() * CONFIG.columns) : x,
      Math.random() > (1 - CONFIG.noise) ? Math.floor(Math.random() * CONFIG.rows) : y,
     ]
  })
}

const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(gridCanvas, 0, 0, gridCanvas.width, gridCanvas.height)
  updateCells()
  for (let i = 0; i < CONFIG.cells.length; i++) {
    const [x, y] = CONFIG.cells[i]
    context.fillStyle = CONFIG.cell
    context.fillRect(
      (x * CONFIG.size) + CONFIG.hOffset + CONFIG.border,
      (y * CONFIG.size) + CONFIG.vOffset + CONFIG.border,
      CONFIG.size - CONFIG.border * 2,
      CONFIG.size - CONFIG.border * 2
    )
  }
}

const refresh = () => {
  gsap.ticker.remove(draw)
  canvas.width = gridCanvas.width = window.innerWidth
  canvas.height = gridCanvas.height = window.innerHeight
  context.clearRect(0, 0, canvas.width, canvas.height)
  setGrid()
  gsap.ticker.add(draw)
}

gsap.ticker.fps(CONFIG.fps)

window.addEventListener('resize', refresh)

// Configuration
const CTRL = new Pane({ title: "Config", expanded: true })

CTRL.addBinding(CONFIG, 'amount', { min: 2, max: 2000, step: 1, label: 'Amount' })
const framer = CTRL.addBinding(CONFIG, 'fps', { min: 1, max: 60, step: 1, label: 'FPS' })
CTRL.addBinding(CONFIG, 'size', { min: 4, max: 100, step: 1, label: 'Size (px)' })
CTRL.addBinding(CONFIG, 'border', { min: 0, max: 10, step: 1, label: 'Track (px)' })
CTRL.addBinding(CONFIG, 'noise', { min: 0, max: 1, step: 0.01, label: 'Noise' })
CTRL.addBinding(CONFIG, 'cell', { label: 'Cell Color' })
CTRL.addBinding(CONFIG, 'track', { label: 'Track Color' })
CTRL.addBinding(CONFIG, 'frame', { label: 'Cell Backdrop' })

const reboot = () => {
  document.documentElement.style.setProperty('--cell', CONFIG.frame)
  gsap.ticker.fps(CONFIG.fps)
  refresh()
}

CTRL.on('change', reboot)

reboot()