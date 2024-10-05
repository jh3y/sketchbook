import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  theme: 'system',
  x: -20,
  y: 20,
  speed: 2,
}

const main = document.querySelector('main')

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'x', {
  min: -50,
  max: 50,
  step: 1,
  label: 'x (vmin)',
})
ctrl.addBinding(config, 'y', {
  min: -50,
  max: 50,
  step: 1,
  label: 'y (vmin)',
})
ctrl.addBinding(config, 'speed', {
  min: 0.2,
  max: 5,
  step: 0.1,
  label: 'Speed (s)',
})
ctrl.addButton({ title: 'Restart' }).on('click', () => {
  const markup = main.innerHTML
  main.innerHTML = ''
  requestAnimationFrame(() => (main.innerHTML = markup))
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.style.setProperty('--x', config.x)
  document.documentElement.style.setProperty('--y', config.y)
  document.documentElement.style.setProperty('--speed', config.speed)
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
