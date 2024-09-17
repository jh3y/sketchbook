import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  style: 'vertical',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'style', {
  label: 'Style',
  options: {
    Default: 'default',
    Vertical: 'vertical',
    Wipe: 'wipe',
    Slides: 'slides',
    Flip: 'flip',
    Angled: 'angled',
  },
})

const change = () => {
  document.documentElement.dataset.style = config.style
}
change()
ctrl.on('change', change)

const TOGGLE = document.querySelector('.theme-toggle')

const SWITCH = () => {
  // biome-ignore lint: this needs to be cast else it doesn't work
  const isDark = TOGGLE.matches('[aria-pressed=true]') ? false : true
  TOGGLE.setAttribute('aria-pressed', isDark)
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
}

const TOGGLE_THEME = () => {
  if (!document.startViewTransition) SWITCH()
  document.startViewTransition(SWITCH)
}

TOGGLE.addEventListener('click', TOGGLE_THEME)
