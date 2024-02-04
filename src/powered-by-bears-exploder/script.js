import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const scene = document.querySelector('.scene')

const CONFIG = {
  explode: false,
  width: 400,
  speed: 0.5,
  stamp: 'jh3yy',
  paused: false,
  translate: -50,
  differentiate: false,
  hue: 10,
  unmask: false,
}

const CTRL = new Pane({title: "Config"})

CTRL.addBinding(CONFIG, 'stamp', { label: 'Stamp'})
CTRL.addBinding(CONFIG, 'width', { min: 100, max: 1000, step: 1, label: 'Stream width (%)'})
const unmask = CTRL.addBinding(CONFIG, 'unmask', { label: 'Unmask stream?'})
CTRL.addBinding(CONFIG, 'speed', { min: 0.2, max: 1, step: 0.01, label: 'Speed (s)'})
const translate = CTRL.addBinding(CONFIG, 'translate', { min: -300, max: 300, step: 1, label: 'Translate (x)'})
CTRL.addBinding(CONFIG, 'paused', { label: 'Pause'})
CTRL.addBinding(CONFIG, 'hue', { min: 0, max: 359, step: 1, label: 'Hue'})
CTRL.addBinding(CONFIG, 'differentiate', { label: 'Diff streams?'})
CTRL.addBinding(CONFIG, 'explode', { label: 'Explode?'})

// Default disablement
translate.disabled = true
unmask.disabled = true

const update = () => {
  scene.dataset.explode = CONFIG.explode
  scene.dataset.unmask = CONFIG.unmask
  scene.dataset.diff = CONFIG.differentiate
  scene.style.setProperty('--stream-width', CONFIG.width)
  scene.style.setProperty('--speed', CONFIG.speed)
  scene.style.setProperty('--stamp', `"@${CONFIG.stamp}"`)
  document.documentElement.style.setProperty('--hue', CONFIG.hue)
  scene.style.setProperty('--play-state', CONFIG.paused ? 'paused' : 'running')
  scene.style.setProperty('--tx', CONFIG.translate)
  translate.disabled = !CONFIG.paused
  unmask.disabled = !CONFIG.explode
}

CTRL.on('change', update)

const btn = CTRL.addButton({
  title: 'Reset',
});
btn.on('click', () => {
  CONFIG.speed = 0.5
  CONFIG.translate = -50
  CONFIG.width = 400
  CONFIG.hue = 10
  CONFIG.explode = false
  CONFIG.paused = false
  CONFIG.differentiate = false
  CONFIG.unmask = false
  update()
  CTRL.refresh()
})
update()