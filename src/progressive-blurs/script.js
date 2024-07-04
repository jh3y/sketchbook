import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { Draggable } from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'
import { Pane } from 'https://cdn.skypack.dev/tweakpane'

gsap.registerPlugin(Draggable)

const dragger = Draggable.create('img', { type: 'x,y' })

const config = {
  layers: 5,
  debug: false,
  border: false,
  use: 'sin',
  style: 'radial',
  radius: 0,
  padding: 25,
  theme: 'dark',
  useImage: false,
  // Radial things
  radw: 115,
  radh: 45,
  radx: 50,
  rady: 85,
  gradstart: 20,
  // Stoppers and Blurs
  powb: 1.5,
  pows: 1.75,
  sinb: 30,
  sins: 45,
  // Linear things
  linr: 90,
}

if (!CSS.supports('background-filter: blur(10px)'))
  console.info('Browser does not support backdrop-filter, try using image mode')

// sin: 30,20,45,90

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const container = document.querySelector('.container')
const layerContainer = document.querySelector('.blur')
const debugContainer = document.querySelector('.debug')

const sync = () => {
  document.documentElement.dataset.debug = config.debug
  document.documentElement.dataset.use = config.use
  document.documentElement.dataset.style = config.style
  document.documentElement.dataset.border = config.border
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.image = config.useImage
  let markup = ''
  for (let l = 1; l < config.layers + 1; l++) {
    markup += `<div style="--i: ${l};"></div>`
  }
  document.documentElement.style.setProperty('--layers', config.layers)
  if (config.useImage) config.padding = 0
  document.documentElement.style.setProperty(
    '--padding',
    config.useImage ? 0 : config.padding
  )
  ctrl.refresh()
  document.documentElement.style.setProperty('--radius', config.radius)
  layerContainer.innerHTML = markup
  debugContainer.innerHTML = markup
  // Radial config
  container.style.setProperty('--radw', config.radw)
  container.style.setProperty('--radh', config.radh)
  container.style.setProperty('--radx', config.radx)
  container.style.setProperty('--rady', config.rady)
  container.style.setProperty('--gradstart', config.gradstart)

  container.style.setProperty('--powb', config.powb)
  container.style.setProperty('--pows', config.pows)
  container.style.setProperty('--sinb', config.sinb)
  container.style.setProperty('--sins', config.sins)

  container.style.setProperty('--rotate', config.linr)

  sinBlur.disabled = config.use !== 'sin'
  sinStop.disabled = config.use !== 'sin'
  lsinBlur.disabled = config.use !== 'sin'
  lsinStop.disabled = config.use !== 'sin'

  powBlur.disabled = config.use !== 'pow'
  powStop.disabled = config.use !== 'pow'
  lpowBlur.disabled = config.use !== 'pow'
  lpowStop.disabled = config.use !== 'pow'

  padding.disabled = config.useImage
}

const foundation = ctrl.addFolder({ title: 'Foundation', expanded: true })

foundation.addBinding(config, 'layers', {
  min: 1,
  max: 10,
  step: 1,
  label: 'Layers',
})
foundation.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})
foundation.addBinding(config, 'border', { label: 'Border' })
foundation.addBinding(config, 'debug', { label: 'Debug' })
foundation.addBinding(config, 'useImage', { label: 'Image Mode' })
const padding = foundation.addBinding(config, 'padding', {
  min: 0,
  max: 30,
  step: 0.1,
  label: 'Padding (%)',
})
foundation.addBinding(config, 'radius', {
  min: 0,
  max: 30,
  step: 0.1,
  label: 'Radius (%)',
})
foundation.addBinding(config, 'use', {
  label: 'Use',
  options: {
    sin: 'sin',
    pow: 'pow',
  },
})
foundation.addBinding(config, 'style', {
  label: 'Style',
  options: {
    radial: 'radial',
    linear: 'linear',
  },
})
const change = foundation.addButton({ title: 'Change Image' })
change.on('click', () => {
  const src = `https://picsum.photos/720/720?random=${Date.now()}`
  container.style.setProperty('--img', `url(${src})`)
  document.querySelector('img').src = src
})
const reset = foundation.addButton({ title: 'Reset Drag' })
reset.on('click', () => {
  gsap.set('img', { clearProps: 'all' })
})

const radialFolder = ctrl.addFolder({ title: 'Radial', expanded: false })
const linearFolder = ctrl.addFolder({ title: 'Linear', expanded: false })

radialFolder.addBinding(config, 'radw', {
  min: 0,
  max: 250,
  step: 1,
  label: 'Width (%)',
})
radialFolder.addBinding(config, 'radh', {
  min: 0,
  max: 250,
  step: 1,
  label: 'Height (%)',
})
radialFolder.addBinding(config, 'radx', {
  min: -50,
  max: 150,
  step: 1,
  label: 'X (%)',
})
radialFolder.addBinding(config, 'rady', {
  min: -50,
  max: 150,
  step: 1,
  label: 'Y (%)',
})
radialFolder.addBinding(config, 'gradstart', {
  min: 0,
  max: 100,
  step: 1,
  label: 'Mask start (%)',
})
const powBlur = radialFolder.addBinding(config, 'powb', {
  min: 0,
  max: 5,
  step: 0.1,
  label: 'Blur multiplier',
})
const powStop = radialFolder.addBinding(config, 'pows', {
  min: 0,
  max: 5,
  step: 0.1,
  label: 'Mask Stop Multiplier',
})
const sinBlur = radialFolder.addBinding(config, 'sinb', {
  min: 0,
  max: 50,
  step: 1,
  label: 'Blur Limit (px)',
})
const sinStop = radialFolder.addBinding(config, 'sins', {
  min: 0,
  max: 100,
  step: 1,
  label: 'Mask End (%)',
})

const lpowBlur = linearFolder.addBinding(config, 'powb', {
  min: 0,
  max: 5,
  step: 0.1,
  label: 'Blur multiplier',
})
const lpowStop = linearFolder.addBinding(config, 'pows', {
  min: 0,
  max: 5,
  step: 0.1,
  label: 'Mask Stop Multiplier',
})
const lsinBlur = linearFolder.addBinding(config, 'sinb', {
  min: 0,
  max: 50,
  step: 1,
  label: 'Blur Limit (px)',
})
linearFolder.addBinding(config, 'gradstart', {
  min: 0,
  max: 100,
  step: 1,
  label: 'Mask Start (%)',
})
const lsinStop = linearFolder.addBinding(config, 'sins', {
  min: 0,
  max: 100,
  step: 1,
  label: 'Mask End (%)',
})
linearFolder.addBinding(config, 'linr', {
  min: 0,
  max: 360,
  step: 1,
  label: 'Rotation (deg)',
})

ctrl.on('change', sync)
sync()
