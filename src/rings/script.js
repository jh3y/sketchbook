import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const CONFIG = {
  radius: 35,
  hue: true,
  lightness: 0.5,
  chroma: 2,
  hueBase: 180,
  hueDestination: 320,
  speed: 2.5,
  distance: 10,
  scale: false,
  alternate: false,
}

const CTRL = new Pane({ title: 'Config', expanded: false })

CTRL.addBinding(CONFIG, 'radius', { min: 0, max: 50, step: 1, label: 'Radius' })
CTRL.addBinding(CONFIG, 'distance', { min: 5, max: 50, step: 1, label: 'Distance (vmin)' })
CTRL.addBinding(CONFIG, 'speed', { min: 0.1, max: 10, step: 0.1, label: 'Speed (s)' })
CTRL.addBinding(CONFIG, 'alternate', { label: 'Alternate' })
CTRL.addBinding(CONFIG, 'scale', { label: 'Animate Scale' })

const COLOR = CTRL.addFolder({title: 'Color' })
COLOR.addBinding(CONFIG, 'hue', { label: 'Animate Hue' })
COLOR.addBinding(CONFIG, 'lightness', { min: 0, max: 1, step: 0.01, label: 'Lightness' })
COLOR.addBinding(CONFIG, 'chroma', { min: 0, max: 3, step: 0.1, label: 'Chroma' })
COLOR.addBinding(CONFIG, 'hueBase', { min: 0, max: 360, step: 1, label: 'Hue Base' })
const LIMIT = COLOR.addBinding(CONFIG, 'hueDestination', { min: 0, max: 360, step: 1, label: 'Hue Limit' })
LIMIT.disabled = true

const UPDATE = () => {
  document.documentElement.style.setProperty('--radius', CONFIG.radius)
  document.documentElement.style.setProperty('--base', CONFIG.hueBase)
  document.documentElement.style.setProperty('--chroma', CONFIG.chroma)
  document.documentElement.style.setProperty('--lightness', CONFIG.lightness)
  document.documentElement.style.setProperty('--limit', CONFIG.hueDestination)
  document.documentElement.style.setProperty('--speed', CONFIG.speed)
  document.documentElement.style.setProperty('--distance', CONFIG.distance)
  document.documentElement.dataset.hue = CONFIG.hue
  if (CONFIG.hue) LIMIT.disabled = false
  document.documentElement.dataset.scale = CONFIG.scale
  document.documentElement.dataset.alternate = CONFIG.alternate
}

CTRL.on('change', UPDATE)

UPDATE()