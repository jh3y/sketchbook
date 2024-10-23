import { Pane } from 'https://cdn.skypack.dev/tweakpane'

let pos
let angle
let spread

const config = {
  theme: 'dark',
  placeholder: "What we cookin'?",
  position: 50,
  debug: false,
  multiplier: 0.12,
  bordered: true,
  spread: 3,
  angle: 295,
  style: 'classic',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const main = document.querySelector('main')

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.debug = config.debug
  document.documentElement.dataset.style = config.style
  pos.disabled = spread.disabled = angle.disabled = !config.debug
  document.documentElement.style.setProperty('--bg-position', config.position)
  document.documentElement.style.setProperty('--bg-spread', config.spread)
  document.documentElement.style.setProperty('--bg-angle', config.angle)
  document.documentElement.style.setProperty('--multiplier', config.multiplier)
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'multiplier', {
  min: 0.1,
  max: 0.3,
  step: 0.01,
  label: 'Speed X',
})

ctrl.addBinding(config, 'style', {
  label: 'Style',
  options: {
    Classic: 'classic',
    Aurora: 'aurora',
    Flame: 'flame',
  },
})
ctrl.addBinding(config, 'debug', {
  label: 'Configure',
})
pos = ctrl.addBinding(config, 'position', {
  min: 0,
  max: 100,
  step: 1,
  label: 'Position',
  disabled: !config.debug,
})

spread = ctrl.addBinding(config, 'spread', {
  min: 2,
  max: 10,
  step: 1,
  label: 'Spread (ch)',
  disabled: !config.debug,
})

angle = ctrl.addBinding(config, 'angle', {
  min: 0,
  max: 360,
  step: 1,
  label: 'Angle (deg)',
  disabled: !config.debug,
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

const syncLines = () => {
  ;[...main.children].forEach((child) => {
    child.style.setProperty('--placeholder-length', child.textContent.length)
  })
}

main.addEventListener('input', syncLines)
syncLines()
