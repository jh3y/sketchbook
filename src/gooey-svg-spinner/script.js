import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  theme: 'dark',
  tail: 4.18,
  head: 1.05,
  glow: true,
  animate: true,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'animate', {
  label: 'Animate',
})

ctrl.addBinding(config, 'glow', {
  label: 'Glow',
})

ctrl.addBinding(config, 'head', {
  min: 0,
  // max: 1.05,
  max: 5,
  step: 0.01,
  label: 'stroke-dasharray',
})
ctrl.addBinding(config, 'tail', {
  min: 0,
  max: 5,
  step: 0.01,
  label: 'stroke-dashoffset',
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.glow = config.glow
  document.documentElement.dataset.animate = config.animate
  document.documentElement.style.setProperty('--head', config.head)
  document.documentElement.style.setProperty('--tail', config.tail)
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
