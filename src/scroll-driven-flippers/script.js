import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const CONFIG = {
  guides: false
}

const CTRL = new Pane({ title: 'Configuration', expanded: false })
CTRL.addBinding(CONFIG, 'guides', { label: 'Show Guides'})

const UPDATE = () => {
  document.documentElement.dataset.guides = CONFIG.guides
}

CTRL.on('change', UPDATE)

UPDATE()