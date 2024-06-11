import { Pane } from 'https://cdn.skypack.dev/tweakpane'

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
