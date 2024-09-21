import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  theme: 'system',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

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
        const val = Math.floor(
          ((input.value - input.min) / (input.max - input.min)) * 100
        )
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
