import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const CONFIG = {
  style: 'indicator',
  shadow: '#000',
}

const CTRL = new Pane('Config')

CTRL.addBinding(CONFIG, 'style', {
  options: { indicator: 'indicator', shadow: 'shadow', mask: 'mask' },
})
const shadowColor = CTRL.addBinding(CONFIG, 'shadow')
shadowColor.hidden = true

const update = () => {
  document.documentElement.dataset.style = CONFIG.style
  shadowColor.hidden = CONFIG.style !== 'shadow'
  document.documentElement.style.setProperty('--shadow-color', CONFIG.shadow)
}

CTRL.on('change', update)
update()