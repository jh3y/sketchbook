import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  items: 50,
  indicate: true,
  debug: true,
  theme: 'system',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})
const list = document.querySelector('.scroller')
const update = () => {
  let items = ''
  for (let i = 0; i < config.items; i++) {
    items += `
      <li>${
        i === 0 || i === config.items - 1
          ? `Watch here ${i === 0 ? '👆' : '👇'}`
          : 'Some item'
      }</li>
      `
  }
  list.innerHTML = items
  document.documentElement.dataset.indicate = config.indicate
  document.documentElement.dataset.debug = config.debug
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

ctrl.addBinding(config, 'items', { min: 1, max: 200, step: 1, label: 'Items' })
ctrl.addBinding(config, 'indicate', { label: 'Indicate' })
ctrl.addBinding(config, 'debug', { label: 'Debug' })
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
