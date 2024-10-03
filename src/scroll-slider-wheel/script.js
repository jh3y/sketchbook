import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  theme: 'system',
  reveal: false,
  value: 0,
  debug: 0,
  min: 0,
  step: 1,
  max: 120,
}

const sliders = document.querySelectorAll('.slider')
const range = sliders[0].querySelector('[type="range"]')

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.reveal = config.reveal
  sliders[0].style.setProperty('--min', config.min)
  sliders[0].style.setProperty('--max', config.max)
  sliders[0].style.setProperty('--step', config.step)
  range.setAttribute('min', config.min)
  range.setAttribute('max', config.max)
  range.setAttribute('step', config.step)

  sliders[0].style.setProperty('--tens', Math.floor(config.max / 10))
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'reveal', {
  label: 'Reveal',
})

ctrl.addBinding(config, 'value', {
  label: 'Value',
  disabled: true,
  min: 0,
  max: config.max,
  step: 1,
})
ctrl.addBinding(config, 'debug', {
  label: 'Debug',
  disabled: true,
  min: 0,
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
for (const slider of sliders) new Slider(slider)

sliders[0].querySelector('[type=range]').addEventListener('input', (event) => {
  config.value = event.target.value
  config.debug = (event.target.value / config.max) * 100
  const turn = config.max * -36 * (config.debug / 100)
  sliders[0].style.setProperty('--r', turn)
  const mini = Math.abs(
    Math.floor(config.max / 10) * -36 * (config.debug / 100)
  )
  sliders[0].style.setProperty('--m', mini)
  console.info({ turn, debug: config.debug / 100, mini })

  ctrl.refresh()
})
