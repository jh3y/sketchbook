import { Pane } from 'https://cdn.skypack.dev/tweakpane'


if (!CSS.supports('animation-timeline: scroll()')) {
  const CONTROL = document.querySelector('.control')
  const TRACK = CONTROL.querySelector('.control__track')
  const INPUT = document.querySelector('input')
  const update = () => {
    CONTROL.style.setProperty('--value', INPUT.value)
  }
  INPUT.addEventListener('input', update)
  INPUT.addEventListener('pointerdown', update)
  update()
}

const CONFIG = {
  hue: 30
}
const update = () => {
  document.documentElement.style.setProperty('--hue', CONFIG.hue)
}
const CTRL = new Pane()
CTRL.addBinding(CONFIG, 'hue', { min: 0, max: 359, step: 1 })
CTRL.on('change', update)

