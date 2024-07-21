import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  reverse: true,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'reverse', {
  label: 'Use reverse',
})

const sync = () => {
  document.documentElement.dataset.reverse = config.reverse
}

ctrl.on('change', sync)

sync()
