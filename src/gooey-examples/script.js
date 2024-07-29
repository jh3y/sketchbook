import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import Color from 'https://cdn.skypack.dev/color'
import { gsap } from 'https://cdn.skypack.dev/gsap@3.12.0'
import Draggable from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'
gsap.registerPlugin(Draggable)

const colorMatrix = document.querySelector('feColorMatrix')
const gaussianBlur = document.querySelector('feGaussianBlur')

const CONFIG = {
  animate: false,
  css: false,
  transparent: true,
  blur: 14,
  contrast: 34,
  deviation: 32,
  matrix: 28,
  color: '#000000',
  dimension: false,
}

const CTRL = new Pane({ title: 'Config', expanded: false })

CTRL.addBinding(CONFIG, 'animate', { label: 'Animate' })
CTRL.addBlade({
  view: 'separator',
})
const svg = CTRL.addFolder({ title: 'SVG' })
CTRL.addBlade({
  view: 'separator',
})
CTRL.addBinding(CONFIG, 'css', { label: 'Use CSS' })
const cascade = CTRL.addFolder({ title: 'CSS' })

svg.addBinding(CONFIG, 'deviation', {
  min: 0,
  max: 50,
  step: 1,
  label: 'stdDeviation',
})
svg.addBinding(CONFIG, 'matrix', { min: 0, max: 50, step: 1, label: 'alpha' })
svg.addBinding(CONFIG, 'color')
svg.addBinding(CONFIG, 'dimension', { label: 'Faux 3D' })

cascade.addBinding(CONFIG, 'blur', {
  min: 0,
  max: 50,
  step: 1,
  label: 'Blur (px)',
})
cascade.addBinding(CONFIG, 'contrast', {
  min: 1,
  max: 50,
  step: 1,
  label: 'Contrast',
})
cascade.addBinding(CONFIG, 'transparent', { label: 'Transparent Effect' })

const update = () => {
  // Do all the things...
  svg.disabled = CONFIG.css
  cascade.disabled = !CONFIG.css

  if (cascade.disabled) cascade.expanded = false

  document.documentElement.style.setProperty('--blur', CONFIG.blur)
  document.documentElement.style.setProperty('--contrast', CONFIG.contrast)

  document.documentElement.dataset.transparent = CONFIG.transparent
  document.documentElement.dataset.useCss = CONFIG.css
  document.documentElement.dataset.faux3d = CONFIG.dimension
  document.documentElement.dataset.animate = CONFIG.animate

  if (CONFIG.animate) {
    gsap.set('.blob:first-of-type', { clearProps: 'all' })
  }

  gaussianBlur.setAttribute('stdDeviation', CONFIG.deviation)
  colorMatrix.setAttribute(
    'values',
    `
     1 0 0 0 0
     0 1 0 0 0
     0 0 1 0 0
     0 0 0 ${CONFIG.matrix} -10
  `
  )

  const c = new Color(CONFIG.color).hsl()
  document.documentElement.style.setProperty('--hue', c.color[0])
  document.documentElement.style.setProperty('--saturation', c.color[1])
  document.documentElement.style.setProperty('--lightness', c.color[2])
}

CTRL.on('change', update)
update()

// Check a matrix demo here: https://observablehq.com/@gitmullany/filter-effects-using-svg-color-matrices
gsap.set('.blob:first-of-type', {
  xPercent: -150,
  // y: -50,
})
Draggable.create('.blob:first-of-type', {
  type: 'x,y',
})
