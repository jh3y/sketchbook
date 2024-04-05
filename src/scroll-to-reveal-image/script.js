import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const CONFIG = {
  start: 0,
  finish: 200,
  style: 'drape',
  trigger: false,
  snap: false,
  size: 30,
  dease: 'linear',
  tease: 'ease',
  image: 20,
}

const BASE = 30

const LIST = document.querySelector('ul')

const ITEMS = Object.assign(document.createElement('div'), {
  innerHTML: `
    <li>
      <h1>Scroll.</h1>
    </li>
    ${new Array(BASE).fill().map((_, i) => `<li><img src="https://picsum.photos/500/500?random=${i}" alt=""></li>`).join('')}
  `
})

LIST.innerHTML = ITEMS.innerHTML

const UPDATE = () => {
  document.documentElement.dataset.enterStyle = CONFIG.style
  document.documentElement.dataset.scrollSnap = CONFIG.snap
  document.documentElement.dataset.scrollTrigger = CONFIG.trigger
  document.documentElement.style.setProperty('--list-size', CONFIG.size)
  document.documentElement.style.setProperty('--start', `${CONFIG.start}%`)
  document.documentElement.style.setProperty('--finish', `${CONFIG.finish}%`)
  document.documentElement.style.setProperty('--driven-ease', CONFIG.dease)
  document.documentElement.style.setProperty('--triggered-ease', CONFIG.tease)
  document.documentElement.style.setProperty('--size', CONFIG.image)
}

const CTRL = new Pane({ title: 'Configuration', expanded: false })

CTRL.addBinding(CONFIG, 'style', { label: 'Style', options: {
  bloom: 'bloom',
  fade: 'fade',
  curtains: 'curtains',
  drape: 'drape',
  slides: 'slides',
  fill: 'fill',
  land: 'land',
  saturate: 'saturate',
}})

CTRL.addBinding(CONFIG, 'snap', { label: 'Scroll snap'})
CTRL.addBinding(CONFIG, 'trigger', { label: 'Scroll trigger'})
CTRL.addBinding(CONFIG, 'size', { label: 'Section size (vh)', min: 25, max: 150, step: 5 })
CTRL.addBinding(CONFIG, 'image', { label: 'Image size (vmin)', min: 20, max: 80, step: 5 })
CTRL.addBinding(CONFIG, 'start', { label: 'Start (entry %)', min: 0, max: 500, step: 5 })
CTRL.addBinding(CONFIG, 'finish', { label: 'Finish (entry %)', min: 0, max: 500, step: 5 })
CTRL.addBinding(CONFIG, 'dease', { label: 'Driven ease' })
CTRL.addBinding(CONFIG, 'tease', { label: 'Trigger ease' })


CTRL.on('change', UPDATE)

UPDATE()