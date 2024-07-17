import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  radius: 12,
  width: 1,
  debug: false,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'radius', {
  min: 0,
  max: 24,
  step: 1,
  label: 'Radius (px)',
})
ctrl.addBinding(config, 'width', {
  min: 0,
  max: 6,
  step: 1,
  label: 'Width (px)',
})

ctrl.addBinding(config, 'debug', {
  label: 'Debug',
})

const sync = () => {
  document.documentElement.style.setProperty('--rad', config.radius)
  document.documentElement.style.setProperty('--border-width', config.width)
  document.documentElement.dataset.debug = config.debug
}
ctrl.on('change', sync)
sync()
