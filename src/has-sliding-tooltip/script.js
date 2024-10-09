import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import Draggable from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'
import { Pane } from 'https://cdn.skypack.dev/tweakpane'

gsap.registerPlugin(Draggable)

const config = {
  theme: 'system',
  locked: true,
  speed: 0.26,
  blur: 4,
  debug: false,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.debug = config.debug
  document.documentElement.dataset.locked = config.locked
  document.documentElement.style.setProperty('--speed', config.speed)
  document.documentElement.style.setProperty('--blur', config.blur)
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'locked', {
  label: 'Locked',
})
ctrl.addBinding(config, 'speed', {
  label: 'Speed (s)',
  min: 0,
  max: 2,
  step: 0.01,
})
ctrl.addBinding(config, 'blur', {
  label: 'Blur (px)',
  min: 0,
  max: 20,
  step: 1,
})
ctrl.addBinding(config, 'debug', {
  label: 'Debug',
})

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.on('change', sync)
update()
const nav = document.querySelector('nav')
const navSize = nav.getBoundingClientRect().width
nav.style.opacity = '1'
nav.style.setProperty('--width', navSize)
Draggable.create(nav, {
  type: 'left,top',
  handle: 'nav button',
  onDrag: function () {
    document.documentElement.dataset.dragging = true
    document.documentElement.dataset.orientation =
      this.x < navSize + 10 || this.x > window.innerWidth - (navSize + 10)
        ? 'vertical'
        : 'horizontal'
    // Need to say which quadrant it's in because that's missing for unlocked
    // We just need to account for inverting on top and right...
    // const navBounds = nav.getBoundingClientRect()
    // nav.dataset.flipX =
    //   this.x > window.innerWidth - (navBounds.width + 16 + 100)
  },
  onDragEnd: function () {
    document.documentElement.dataset.dragging = false
  },
})
document.documentElement.dataset.orientation = 'horizontal'

// This is the part required for the pointer tracking...
let bounds
const track = ({ x, y }) => {
  console.info({ x, y })
  document.documentElement.style.setProperty('--tip-x', x - bounds.left)
  document.documentElement.style.setProperty('--tip-y', y - bounds.top)
}

const teardown = () => {
  nav.removeEventListener('pointermove', track)
  nav.removeEventListener('pointerleave', teardown)
}

const initPointerTrack = () => {
  bounds = nav.getBoundingClientRect()
  nav.addEventListener('pointermove', track)
  nav.addEventListener('pointerleave', teardown)
}

nav.addEventListener('pointerenter', initPointerTrack)
