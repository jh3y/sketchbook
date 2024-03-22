import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const CONFIG = {
  size: 120,
  y: 40,
}

const CTRL = new Pane({ title: 'Configuration', expanded: false })

const update = () => {
  document.documentElement.style.setProperty('--size', CONFIG.size)
  document.documentElement.style.setProperty('--y', CONFIG.y)
}

CTRL.addBinding(CONFIG, 'size', { min: 50, step: 1, max: 300, label: 'Size (px)' })
CTRL.addBinding(CONFIG, 'y', { min: 0, step: 1, max: 100, label: 'Y (%)' })

CTRL.on('change', update)
update()