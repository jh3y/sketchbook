import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  theme: 'system',
  speed: 0.5,
  size: 96,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.addBinding(config, 'size', {
  min: 48,
  max: 300,
  step: 1,
  label: 'Size (px)',
})

ctrl.addBinding(config, 'speed', {
  min: 0,
  max: 5,
  step: 0.01,
  label: 'Speed (s)',
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.style.setProperty('--speed', config.speed)
  document.documentElement.style.setProperty('--size', config.size)
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    !event ||
    (event && event.target.controller.view.labelElement.innerText !== 'Theme')
  )
    return update()
  document.startViewTransition(update)
}

sync()
ctrl.on('change', sync)
