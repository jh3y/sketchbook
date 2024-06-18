import gsap from 'https://cdn.skypack.dev/gsap@3.12.4'
import Draggable from 'https://cdn.skypack.dev/gsap@3.12.4/Draggable'
import { Pane } from 'https://cdn.skypack.dev/tweakpane'

gsap.registerPlugin(Draggable)

const PROXY = document.createElement('div')

const brightnessWrap = document.querySelector('.slider-wrap')
const brightness = document.querySelector('.slider')
// const brightnessRange = document.querySelector('.slider-wrap [type="range"]')

Draggable.create(PROXY, {
  type: 'y',
  trigger: brightness,
  allowContextMenu: true,
  onPress: function () {
    console.clear()
    brightnessWrap.dataset.spring = false
    const bounds = brightness.getBoundingClientRect()
    const start = this.pointerY - bounds.top
    const end = bounds.top + bounds.height - this.pointerY
    PROXY.dataset.start = start
    PROXY.dataset.end = end
    gsap.set(PROXY, { y: start })
  },
  onDrag: function () {
    const start = parseInt(PROXY.dataset.start, 10)
    const end = parseInt(PROXY.dataset.end, 10)
    if (this.y < start * -1) {
      // stretching at the top
      brightnessWrap.dataset.origin = 'bottom'
      console.info('stretch top', this.y, Math.abs(start * -1 - this.y))
      brightnessWrap.style.setProperty(
        '--stretch',
        gsap.utils.mapRange(0, 50, 0, 1, Math.abs(start * -1 - this.y))
      )
    } else if (this.y > end) {
      brightnessWrap.dataset.origin = 'top'
      console.info('stretch bottom', this.y, this.y - end)
      brightnessWrap.style.setProperty(
        '--stretch',
        gsap.utils.mapRange(0, 50, 0, 1, this.y - end)
      )
    } else {
      brightnessWrap.style.setProperty('--stretch', 0)
    }
  },
  onDragEnd: function () {
    gsap.set(PROXY, { y: 0 })
    brightnessWrap.style.setProperty('--stretch', 0)
    brightnessWrap.dataset.spring = true
  },
})

const config = {
  disguise: true,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const binding = ctrl.addBinding(config, 'disguise', {
  label: 'Disguise 🥸',
})

const sync = () => {
  document.documentElement.dataset.disguise = config.disguise
  binding.label = `Disguise ${config.disguise ? '🥸' : '🫣'}`
}

ctrl.on('change', sync)
sync()

// This is the polyfill for not having scroll animation support
if (!CSS.supports('animation-timeline: scroll()')) {
  class Slider {
    constructor(element) {
      const input = element.querySelector('[type=range]')
      const sync = () => {
        const val = (input.value - input.min) / (input.max - input.min)
        element.style.setProperty('--slider-complete', val)
      }
      input.addEventListener('input', sync)
      input.addEventListener('pointerdown', sync)
      sync()
      return this
    }
  }
  const sliders = document.querySelectorAll('.slider')
  sliders.forEach((slider) => new Slider(slider))
}
