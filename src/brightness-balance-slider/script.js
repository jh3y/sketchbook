import gsap from 'https://cdn.skypack.dev/gsap@3.12.4'
import Draggable from 'https://cdn.skypack.dev/gsap@3.12.4/Draggable'
import { Pane } from 'https://cdn.skypack.dev/tweakpane'

gsap.registerPlugin(Draggable)

/**
 * Handle the toggle to reveal what's going on under the hood
 */
const config = {
  disguise: true,
  enhance: false,
  stretch: 25,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const binding = ctrl.addBinding(config, 'disguise', {
  label: 'Disguise 🥸',
})
const enhancer = ctrl.addBinding(config, 'enhance', {
  label: 'Enhance ✨',
})
const stretch = ctrl.addBinding(config, 'stretch', {
  label: 'Stretch 🤏',
  min: 0,
  max: 100,
  step: 1,
})
stretch.disabled = true

const sync = () => {
  document.documentElement.dataset.disguise = config.disguise
  document.documentElement.dataset.enhance = config.enhance
  binding.label = `Disguise ${config.disguise ? '🥸' : '🫣'}`
  enhancer.label = `Enhance ${config.enhance ? '🔥' : '✨'}`
  stretch.disabled = !config.enhance
}

ctrl.on('change', sync)
sync()

/**
 * Class for the Slider with Draggable bounce
 */
const STRETCH_DISTANCE = 25
class Slider {
  constructor(element) {
    this.element = element
    const input = element.querySelector('[type=range]')
    // This is the polyfill for not having scroll animation support
    if (!CSS.supports('animation-timeline: scroll()')) {
      const sync = () => {
        const val = (input.value - input.min) / (input.max - input.min)
        element.style.setProperty('--slider-complete', val)
      }
      console.info('polyfilling scroll-animation')
      input.addEventListener('input', sync)
      input.addEventListener('pointerdown', sync)
      sync()
    }
    this.setSpring()
  }
  setSpring() {
    const PROXY = document.createElement('div')

    const wrap = this.element
    const slider = this.element.querySelector('.slider')

    Draggable.create(PROXY, {
      type: 'y',
      trigger: slider,
      allowContextMenu: true,
      onPress: function () {
        // This wouldn't live here ordinarily but for demo purposes.
        wrap.style.setProperty(
          '--stretch-ratio',
          config.stretch / slider.getBoundingClientRect().height
        )
        wrap.dataset.spring = false
        const bounds = slider.getBoundingClientRect()
        const start = this.pointerY - bounds.top
        const end = bounds.top + bounds.height - this.pointerY
        PROXY.dataset.start = start
        PROXY.dataset.end = end
        gsap.set(PROXY, { y: start })
      },
      onDrag: function () {
        const start = Number.parseInt(PROXY.dataset.start, 10)
        const end = Number.parseInt(PROXY.dataset.end, 10)
        if (this.y < start * -1) {
          // stretching at the top
          wrap.dataset.origin = 'bottom'
          wrap.style.setProperty(
            '--stretch',
            gsap.utils.mapRange(
              0,
              config.stretch,
              0,
              1,
              Math.abs(start * -1 - this.y)
            )
          )
        } else if (this.y > end) {
          wrap.dataset.origin = 'top'
          wrap.style.setProperty(
            '--stretch',
            gsap.utils.mapRange(0, config.stretch, 0, 1, this.y - end)
          )
        } else {
          wrap.style.setProperty('--stretch', 0)
        }
      },
      onDragEnd: () => {
        gsap.set(PROXY, { y: 0 })
        wrap.style.setProperty('--stretch', 0)
        wrap.dataset.spring = true
      },
    })
  }
}
const sliders = document.querySelectorAll('.slider-wrap')
for (const slider of sliders) new Slider(slider)
