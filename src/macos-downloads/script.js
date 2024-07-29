import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { Draggable } from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'
import { Pane } from 'https://cdn.skypack.dev/tweakpane'

import InertiaPlugin from 'gsap/InertiaPlugin'

gsap.registerPlugin(Draggable, InertiaPlugin)

const config = {
  radius: 50,
  width: 55,
  height: 150,
  start: -25,
  spread: 80,
  speed: 1,
  magnify: 50,
  debug: false,
  hover: true,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: false,
})

const sync = () => {
  document.documentElement.style.setProperty('--radius', config.radius)
  document.documentElement.style.setProperty('--width', config.width)
  document.documentElement.style.setProperty('--height', config.height)
  document.documentElement.style.setProperty('--spread', config.spread)
  document.documentElement.style.setProperty('--start', config.start)
  document.documentElement.style.setProperty('--speed', config.speed)
  document.documentElement.style.setProperty('--magnify', config.magnify)
  document.documentElement.dataset.debug = config.debug
  document.documentElement.dataset.hover = config.hover
}

ctrl.addBinding(config, 'speed', {
  min: 0.2,
  max: 5,
  step: 0.1,
  label: 'Speed (s)',
})
ctrl.addBinding(config, 'radius', {
  min: 0,
  max: 50,
  step: 1,
  label: 'Radius (%)',
})
ctrl.addBinding(config, 'width', {
  min: 10,
  max: 250,
  step: 1,
  label: 'Width (vw)',
})
ctrl.addBinding(config, 'height', {
  min: 10,
  max: 250,
  step: 1,
  label: 'Height (vh)',
})
ctrl.addBinding(config, 'start', {
  min: -50,
  max: 50,
  step: 1,
  label: 'Start (%)',
})
ctrl.addBinding(config, 'spread', {
  min: 48,
  max: 250,
  step: 1,
  label: 'Spread (px)',
})
ctrl.addBinding(config, 'debug', { label: 'Debug' })
ctrl.addBinding(config, 'hover', { label: 'Magnify' })
ctrl.addBinding(config, 'magnify', {
  min: 2,
  max: 100,
  step: 1,
  label: 'Magnify Rate (px)',
})
sync()
ctrl.on('change', sync)

// Screen Capture for Camera mode

const CONTAINER = document.querySelector('.container')
const TOOLBAR = document.querySelector('.container__toolbar')
const SCREEN = document.querySelector('.container__screen')

let screenCast
let capture

const sketch = (s) => {
  s.setup = () => {
    capture = s.createCapture(s.VIDEO).parent(SCREEN)
    SCREEN.querySelector('canvas').remove()
  }
}
const createCapture = () => {
  screenCast = new p5(sketch, SCREEN)
}

new Draggable(CONTAINER, {
  trigger: TOOLBAR,
  bounds: window,
  inertia: true,
  onPress() {
    gsap.killTweensOf(CONTAINER)
    this.update()
  },
})

// const MENU_POP = document.querySelector("#menu");
CONTAINER.addEventListener('beforetoggle', (e) => {
  if (e.newState === 'open') {
    // MENU_POP.hidePopover()
    createCapture()
  } else {
    capture.remove()
    screenCast.clear()
    screenCast.remove()
  }
})
