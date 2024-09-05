import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const main = document.querySelector('main')

const config = {
  theme: 'system',
  zoom: 5,
  items: 50,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const generateItems = () => {
  let content = ``
  for (let i = 0; i < config.items; i++) {
    content += `<article style="view-transition-name: --item-${i};"><span>${i}</span></article>`
  }
  main.innerHTML = content
}

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.style.setProperty('--zoom', config.zoom)
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    (event.target.controller.view.labelElement.innerText !== 'Theme' &&
      event.target.controller.view.labelElement.innerText !== 'Zoom')
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl
  .addBinding(config, 'items', {
    label: 'Items',
    min: 1,
    max: 100,
    step: 1,
  })
  .on('change', generateItems)

ctrl.addBinding(config, 'zoom', {
  label: 'Zoom',
  options: {
    One: 1,
    Three: 3,
    Five: 5,
  },
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
generateItems()
