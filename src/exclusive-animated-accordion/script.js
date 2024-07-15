import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  named: true,
  theme: 'system',
  duration: 0.5,
}

const details = document.querySelectorAll('details')

const update = () => {
  document.documentElement.dataset.theme = config.theme
  details.forEach((d) => {
    if (config.named) {
      d.setAttribute('name', 'accordion')
    } else {
      d.removeAttribute('name')
    }
  })
  document.documentElement.style.setProperty('--duration', config.duration)
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'named', { label: 'Named' })
ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})
ctrl.addBinding(config, 'duration', {
  label: 'Duration (s)',
  min: 0.1,
  max: 2,
  step: 0.01,
})

ctrl.on('change', sync)

update()
