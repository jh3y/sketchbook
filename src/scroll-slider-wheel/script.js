import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  theme: 'system',
  reveal: false,
  value: 0,
  debug: 0,
  min: 0,
  step: 1,
  max: 242,
  label: false,
  fixed: false,
}

const sliders = document.querySelectorAll('.slider')
const range = sliders[0].querySelector('[type="range"]')
const style = sliders[0].querySelector('style')

let min
let max
let step

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.reveal = config.reveal
  document.documentElement.dataset.labelled = config.label
  document.documentElement.dataset.fixed = config.fixed
  sliders[0].style.setProperty('--min', config.min)
  sliders[0].style.setProperty('--max', config.max)
  sliders[0].style.setProperty('--step', config.step)
  range.setAttribute('min', config.min)
  range.setAttribute('max', config.max)
  range.setAttribute('step', config.step)
  ctrl.refresh()
  style.innerHTML = `@keyframes progress {
    to {
      --value: calc(var(--max) - var(--min));
    }
  }`
  min.max = config.max - 1
  max.min = config.min + 1
  step.max = config.max - config.min
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

const setup = ctrl.addFolder({ title: 'Range' })
setup.addBinding(config, 'label', {
  label: 'Label',
})
setup.addBinding(config, 'fixed', {
  label: 'Fixed',
})
min = setup.addBinding(config, 'min', {
  label: 'Min',
  min: 0,
  max: config.max - 1,
  step: 1,
})
max = setup.addBinding(config, 'max', {
  label: 'Max',
  min: config.min + 1,
  max: 999,
  step: 1,
})
step = setup.addBinding(config, 'step', {
  label: 'Step',
  min: 1,
  max: config.max - config.min,
  step: 1,
})

const debugging = ctrl.addFolder({ title: 'Debug' })

debugging.addBinding(config, 'reveal', {
  label: 'Reveal',
})

debugging.addBinding(config, 'value', {
  label: 'Value',
  disabled: true,
  min: config.min,
  max: config.max,
  step: 1,
})
debugging.addBinding(config, 'debug', {
  label: 'Progress',
  disabled: true,
  min: 0,
  max: 100,
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
        element.style.setProperty('--value', input.value)
      }
      console.info('polyfilling scroll-animation')
      input.addEventListener('input', sync)
      input.addEventListener('pointerdown', sync)
      sync()
    }
  }
}
for (const slider of sliders) new Slider(slider)

sliders[0].querySelector('[type=range]').addEventListener('input', (event) => {
  config.value = event.target.value
  config.debug =
    ((event.target.value - config.min) / (config.max - config.min)) * 100
  ctrl.refresh()
})
