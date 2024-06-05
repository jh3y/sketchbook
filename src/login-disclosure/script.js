import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  direction: 'center',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'direction', {
  label: 'Direction',
  options: {
    Center: 'center',
    Top: 'top',
    Right: 'right',
    Bottom: 'bottom',
    Left: 'left',
  },
})
