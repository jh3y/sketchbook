import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const CONFIG = {
  gradient: true,
  animated: true,
  dark: true,
  highlight: 2,
  spread: 1,
  primary: '#ffffff',
  secondary: '#606060',
}

const CTRL = new Pane({ title: 'Config', expanded: false })

const UPDATE = () => {
  for (const key of Object.keys(CONFIG)) {
    document.documentElement.style.setProperty(`--${key}`, CONFIG[key])
  }
  document.documentElement.dataset.gradient = CONFIG.gradient
  document.documentElement.dataset.animate = CONFIG.animated
}

const HIGHLIGHT_ONE = CTRL.addFolder({ title: 'Highlight One' })
HIGHLIGHT_ONE.addBinding(CONFIG, 'highlight', { min: 0, max: 5, step: 1, label: 'Spread' })
HIGHLIGHT_ONE.addBinding(CONFIG, 'primary', { label: 'Color' })
HIGHLIGHT_ONE.addBinding(CONFIG, 'gradient', { label: 'Use Gradient'})
HIGHLIGHT_ONE.addBinding(CONFIG, 'animated', { label: 'Animate Gradient'})

const HIGHLIGHT_TWO = CTRL.addFolder({ title: 'Highlight Two' })
HIGHLIGHT_TWO.addBinding(CONFIG, 'spread', { min: 0, max: 5, step: 1, label: 'Spread' })
HIGHLIGHT_TWO.addBinding(CONFIG, 'secondary', { label: 'Color' })

const MODE = CTRL.addBinding(CONFIG, 'dark', { label: 'Dark Mode' })

CTRL.on('change', UPDATE)
MODE.on('change', () => {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      document.documentElement.dataset.theme = CONFIG.dark ? 'dark' : 'light'
    })
  } else {
    document.documentElement.dataset.theme = CONFIG.dark ? 'dark' : 'light'
  }
})

UPDATE()
