import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import Draggable from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'
import { Pane } from 'https://cdn.skypack.dev/tweakpane'

gsap.registerPlugin(Draggable)

const config = {
  theme: 'system',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
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

Draggable.create('.metal', {
  type: 'top, left',
})
