import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const ranger = document.querySelector('.slider [type=range]')

const config = {
  theme: 'system',
  min: 0,
  max: 100,
  step: 1,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  max.min = config.min + 1
  min.max = config.max - 1
  step.max = config.max - config.min
  ranger.min = config.min
  ranger.max = config.max
  ranger.step = config.step
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}
const min = ctrl.addBinding(config, 'min', {
  label: 'Min',
  min: 0,
  max: 10,
  step: 1,
})
const max = ctrl.addBinding(config, 'max', {
  label: 'Max',
  min: 1,
  max: 100,
  step: 1,
})
const step = ctrl.addBinding(config, 'step', {
  label: 'Step',
  min: 1,
  max: 100,
  step: 1,
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
  }
}
const sliders = document.querySelectorAll('.slider')
for (const slider of sliders) new Slider(slider)
