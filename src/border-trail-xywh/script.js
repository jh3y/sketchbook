import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  width: 2,
  radius: 24,
  accent: '#ff0000',
  explode: false,
  size: 25,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'width', {
  min: 1,
  max: 10,
  step: 1,
  label: 'Width (px)',
})
ctrl.addBinding(config, 'radius', {
  min: 0,
  max: 100,
  step: 1,
  label: 'Radius (px)',
})
ctrl.addBinding(config, 'size', {
  min: 1,
  max: 100,
  step: 1,
  label: 'Size (cqmin)',
})
ctrl.addBinding(config, 'accent', {
  picker: 'inline',
  label: 'Color',
})
ctrl.addBinding(config, 'explode', {
  label: 'Explode',
})

const sync = () => {
  document.documentElement.style.setProperty('--border-radius', config.radius)
  document.documentElement.style.setProperty('--border-width', config.width)
  document.documentElement.style.setProperty('--trail-size', config.size)
  document.documentElement.style.setProperty('--accent', config.accent)
  document.documentElement.dataset.explode = config.explode
}

ctrl.on('change', sync)
sync()
