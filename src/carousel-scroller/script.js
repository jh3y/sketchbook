import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const CONFIG = {
  debug: true,
  spread: true,
  zoom: false,
  rotate: true,
  animate: false,
  scroll: true,
  dark: false,
  items: 14,
  gap: 0.1,
}

const MAIN = document.querySelector('main')

const generateItems = () => {
  const items = []
  const controllers = []
  const scopes = ['--controller']

  for (let i = 0; i < CONFIG.items + 1; i++) {
    scopes.push(`--item-${i}`)
    if (i !== CONFIG.items) {
      items.push(`
        <li style="--index: ${i}; --scoped: ${i === 0 ? `--item-${CONFIG.items},` : ''} --item-${i};">
          <img src="https://picsum.photos/300/300?random=${i}" alt="" />
        </li>
      `)
    }
    controllers.push(`<li style="view-timeline: --item-${i} inline;"></li>`)
  }

  return {
    items: items.join(''),
    controllers: controllers.join(''),
    scopes: `${scopes.join(',')};`,
  }
}

let scroller

const handleScroll = () => {
  if (scroller.scrollLeft + window.innerWidth > scroller.scrollWidth - 2) {
    scroller.scrollLeft = 2
  }
  if (scroller.scrollLeft < 2) {
    scroller.scrollLeft = scroller.scrollWidth - 2
  }
}

const setupController = () => {
  scroller = document.querySelector('.controller')
  scroller.addEventListener('scroll', handleScroll)
}

const render = () => {
  const { controllers, items, scopes } = generateItems()

  MAIN.innerHTML = `
    <div class="container" style="--total: ${CONFIG.items}; timeline-scope: ${scopes}">
      <div class="carousel-container">
        <ul class="carousel">
          ${items}
        </ul>
      </div>
      <ul class="controller" style="scroll-timeline: --controller inline;">
        ${controllers}
      </ul>
    </div>
  `

  setupController()
}

const update = () => {
  console.info('changes')
  document.documentElement.dataset.debug = CONFIG.debug
  document.documentElement.dataset.spread = CONFIG.spread
  document.documentElement.dataset.zoom = CONFIG.zoom
  document.documentElement.dataset.rotate = CONFIG.rotate
  document.documentElement.dataset.animate = CONFIG.animate
  document.documentElement.dataset.scroll = CONFIG.scroll
  document.documentElement.dataset.dark = CONFIG.dark
  document.documentElement.style.setProperty('--gap-efficient', CONFIG.gap)
}

const sync = () => {
  if (!document.startViewTransition) return update()
  document.startViewTransition(update)
}

const controlPanel = new Pane({ title: 'Config', expanded: true })

controlPanel.addBinding(CONFIG, 'spread', { label: 'Spread' })
// controlPanel.addBinding(CONFIG, 'zoom', { label: 'Zoom' })
controlPanel.addBinding(CONFIG, 'rotate', { label: 'Rotate' })
controlPanel.addBinding(CONFIG, 'animate', { label: 'Animate' })
controlPanel.addBinding(CONFIG, 'scroll', { label: 'Scroll Drive' })
controlPanel.addBinding(CONFIG, 'debug', { label: 'Debug' })
controlPanel.addBinding(CONFIG, 'dark', { label: 'Dark Theme' })
controlPanel.addBinding(CONFIG, 'gap', {
  label: 'Gap (%)',
  min: -0.1,
  max: 5,
  step: 0.1,
})
const itemSwitch = controlPanel.addBinding(CONFIG, 'items', {
  label: 'Items',
  min: 10,
  max: 50,
  step: 1,
})

render()
sync()

controlPanel.on('change', sync)
itemSwitch.on('change', render)
