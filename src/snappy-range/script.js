import { Pane } from 'https://cdn.skypack.dev/tweakpane'

/**
 * Handle the toggle to reveal what's going on under the hood
 */
const config = {
  reveal: false,
  width: 400,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const binding = ctrl.addBinding(config, 'reveal', {
  label: 'Reveal 🥸',
})
ctrl.addBinding(config, 'width', {
  label: 'Width (px)',
  min: 350,
  max: 600,
  step: 1,
})

const sync = () => {
  document.documentElement.style.setProperty('--width', config.width)
  document.documentElement.dataset.reveal = config.reveal
  binding.label = `Reveal ${config.reveal ? '😮' : '🫣'}`
}

ctrl.on('change', sync)
sync()

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
const sliders = document.querySelectorAll('.snappy')
for (const slider of sliders) new Slider(slider)
