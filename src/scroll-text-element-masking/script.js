import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  theme: 'system',
  scrub: 0,
  x: 39,
  y: 50,
  scale: 33,
  font: 10,
  svg: false,
  // src: 'https://assets.codepen.io/605876/skateboarder--opt.mp4',
  src: 'https://assets.codepen.io/605876/solo-skater--opt.mp4',
}

const video = document.querySelector('video')

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.style.setProperty('--x', config.x)
  document.documentElement.style.setProperty('--y', config.y)
  document.documentElement.style.setProperty('--scale', config.scale)
  document.documentElement.style.setProperty('--font', config.font)
  document.documentElement.dataset.svg = config.svg
  video.src = config.src
  font.disabled = config.svg
}

ctrl.addBinding(config, 'scale', {
  min: 1,
  max: 100,
  step: 1,
  label: 'Scale Start',
})

const origin = ctrl.addFolder({ title: 'Transform Origin' })
origin.addBinding(config, 'x', {
  min: 0,
  max: 100,
  step: 1,
  label: 'X',
})
origin.addBinding(config, 'y', {
  min: 0,
  max: 100,
  step: 1,
  label: 'Y',
})
const font = ctrl.addBinding(config, 'font', {
  min: 1,
  max: 20,
  step: 0.1,
  label: 'Font Level',
})
ctrl.addBinding(config, 'svg', {
  label: 'Use SVG',
})

ctrl.on('change', update)
update()
