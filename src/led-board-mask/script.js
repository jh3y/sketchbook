import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  text: 'CSS.',
  blur: 2,
  hue: 180,
  spread: 2,
  font: 12,
  weight: 500,
  line: 1,
  debug: false,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'text', { label: 'Text' })
ctrl.addBinding(config, 'blur', {
  label: 'Blur (px)',
  min: 0,
  max: 10,
  step: 1,
})
ctrl.addBinding(config, 'hue', { label: 'Hue', min: 0, max: 359, step: 1 })
ctrl.addBinding(config, 'spread', {
  label: 'Spread (cqi)',
  min: 1,
  max: 10,
  step: 0.1,
})
ctrl.addBinding(config, 'font', {
  label: 'Font Level',
  min: 1,
  max: 20,
  step: 0.01,
})
ctrl.addBinding(config, 'weight', {
  label: 'Font Weight',
  min: 300,
  max: 900,
  step: 10,
})
ctrl.addBinding(config, 'line', {
  label: 'Line height',
  min: 0.8,
  max: 2,
  step: 0.01,
})
ctrl.addBinding(config, 'debug', { label: 'Debug' })

const text = document.querySelector('.board .fluid')
const sync = () => {
  document.documentElement.style.setProperty('--blur', config.blur)
  document.documentElement.style.setProperty('--spread', config.spread)
  document.documentElement.style.setProperty('--hue', config.hue)
  document.documentElement.style.setProperty('--font', config.font)
  document.documentElement.style.setProperty('--weight', config.weight)
  document.documentElement.style.setProperty('--line', config.line)
  document.documentElement.dataset.debug = config.debug
  text.innerText = config.text
}

ctrl.on('change', sync)
sync()
