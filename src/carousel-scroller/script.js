import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const CONFIG = {
  debug: false,
  spread: false,
  zoom: false,
  rotate: false,
  animate: false,
  scroll: false,
  items: 14,
  gap: 0.1,
}

const MAIN = document.querySelector('main')

const render = () => {
  MAIN.innerHTML = `
    <ul class="carousel" style="--total: ${CONFIG.items};">
      ${new Array(CONFIG.items).fill().map((_, i) => (
        `<li style="--index: ${i};">
          <img src="https://picsum.photos/300/300?random=${i}" alt="" />
        </li>`
      )).join('')}
    </ul>
  `
}

const sync = () => {
  console.info('changes')
  document.documentElement.dataset.debug = CONFIG.debug
  document.documentElement.dataset.spread = CONFIG.spread
  document.documentElement.dataset.zoom = CONFIG.zoom
  document.documentElement.dataset.rotate = CONFIG.rotate
  document.documentElement.dataset.animate = CONFIG.animate
  document.documentElement.dataset.scroll = CONFIG.scroll
  document.documentElement.style.setProperty('--gap-efficient', CONFIG.gap)
}

const controlPanel = new Pane({ title: 'Config', expanded: true })

controlPanel.addBinding(CONFIG, 'spread', { label: 'Spread' })
// controlPanel.addBinding(CONFIG, 'zoom', { label: 'Zoom' })
controlPanel.addBinding(CONFIG, 'rotate', { label: 'Rotate' })
controlPanel.addBinding(CONFIG, 'animate', { label: 'Animate' })
controlPanel.addBinding(CONFIG, 'scroll', { label: 'Scroll Drive' })
controlPanel.addBinding(CONFIG, 'debug', { label: 'Debug' })
controlPanel.addBinding(CONFIG, 'gap', { label: 'Gap (%)', min: -0.1, max: 5, step: 0.1 })
const itemSwitch = controlPanel.addBinding(CONFIG, 'items', { label: 'Items', min: 10, max: 50, step: 1 })

render()
sync()

controlPanel.on('change', sync)
itemSwitch.on('change', render)