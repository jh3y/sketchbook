import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  theme: 'system',
}

const drawer = document.querySelector('.drawer')
const scroller = drawer.querySelector('.drawer__scroller')

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

// Drawer mechanics
// close the drawer on snap change if === 0
scroller.addEventListener('scrollsnapchange', () => {
  if (scroller.scrollTop === 0) {
    drawer.dataset.snapped = true
    drawer.hidePopover()
  }
})
// reset the drawer once closed
drawer.addEventListener('toggle', (event) => {
  if (event.newState === 'closed') drawer.dataset.snapped = false
})
