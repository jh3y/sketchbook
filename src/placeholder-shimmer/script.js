import { Pane } from 'https://cdn.skypack.dev/tweakpane'

let pos

const config = {
  theme: 'system',
  placeholder: "What we cookin'?",
  position: 0,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const input = document.querySelector('.wrap input')
const span = document.querySelector('.wrap span')

const update = () => {
  document.documentElement.dataset.theme = config.theme
  pos.max = config.placeholder.length
  input.setAttribute('placeholder', config.placeholder)
  span.innerText = config.placeholder
  document.documentElement.style.setProperty(
    '--placeholder-length',
    config.placeholder.length
  )
  document.documentElement.style.setProperty('--bg-position', config.position)
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'placeholder', {
  label: 'Placeholder',
})

pos = ctrl.addBinding(config, 'position', {
  min: 0,
  max: config.placeholder.length - 1,
  step: 1,
  label: 'Position',
  disabled: true,
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
