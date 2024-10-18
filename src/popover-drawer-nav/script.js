import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import Splitting from 'https://cdn.skypack.dev/splitting'

Splitting()

const popover = document.querySelector('#nav')
const themer = document.querySelector('.theme-toggle')
const debug = document.querySelector('.debug-toggle')

let deb
document.documentElement.dataset.resizing = false
document.documentElement.dataset.theme = 'system'

window.addEventListener('resize', () => {
  if (popover.matches(':popover-open')) popover.hidePopover()
  document.documentElement.dataset.resizing = true
  if (deb) clearTimeout(deb)
  deb = setTimeout(() => {
    document.documentElement.dataset.resizing = false
  }, 200)
})

const config = {
  theme: 'system',
  debug: false,
}

let themeIndex = 0
let themeOptions = ['system', 'light', 'dark']
const switchTheme = () => {
  themeIndex += 1
  config.theme = themeOptions[themeIndex % 3]
  sync()
}

themer.addEventListener('click', switchTheme)

const switchDebug = () => {
  config.debug = !config.debug
  sync()
}

debug.addEventListener('click', switchDebug)
const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.debug = config.debug
}

const sync = (event) => {
  if (!document.startViewTransition) return update()
  document.startViewTransition(() => update())
}

// ctrl.addBinding(config, 'theme', {
//   label: 'Theme',
//   options: {
//     System: 'system',
//     Light: 'light',
//     Dark: 'dark',
//   },
// })
// ctrl.addBinding(config, 'debug', {
//   label: 'Debug',
// })

// ctrl.on('change', sync)
update()
