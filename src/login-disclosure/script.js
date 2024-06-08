import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import Draggable from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'

const config = {
  inset: 'center',
  theme: 'system',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'inset', {
  label: 'Position',
  options: {
    Center: 'center',
    Top: 'center span-top',
    'Top Right': 'span-right span-top',
    Right: 'span-right center',
    'Bottom Right': 'span-right span-bottom',
    Bottom: 'center span-bottom',
    'Bottom left': 'span-left span-bottom',
    Left: 'span-left center',
    'Top Left': 'span-left span-top',
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

const sync = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.style.setProperty('--inset', config.inset)
}

sync()

const handle = (event) => {
  if (!document.startViewTransition) return sync()
  document.startViewTransition(() => sync())
}

ctrl.on('change', handle)

gsap.registerPlugin(Draggable)
const POP = document.querySelector('[popover]')
Draggable.create('.sign-in', {
  type: 'top,left',
  allowEventDefault: true,
})
