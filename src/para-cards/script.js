import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  travel: 0.75,
  padding: 1.5,
  reflect: true,
  theme: 'system',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'travel', {
  min: 0,
  max: 1,
  step: 0.01,
  label: 'Travel',
})
ctrl.addBinding(config, 'padding', {
  min: 0,
  max: 5,
  step: 0.01,
  label: 'Padding (cards)',
})
ctrl.addBinding(config, 'reflect', {
  label: 'Reflect',
})
ctrl.addBinding(config, 'theme', {
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
  label: 'Theme',
})

const sync = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.reflect = config.reflect
  document.documentElement.style.setProperty('--travel', config.travel)
  document.documentElement.style.setProperty('--padding', config.padding)
}

const handle = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return sync()
  document.startViewTransition(() => sync())
}

ctrl.on('change', handle)

sync()
