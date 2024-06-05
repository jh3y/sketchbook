// Based on: https://x.com/BrettFromDJ/status/1795942054733713473

import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  tinted: true,
  tint: 214,
  alpha: 4,
  x: -1,
  base: 9,
  theme: 'dark',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const tint = ctrl.addBinding(config, 'tinted', { label: 'Tint' })

const tinter = ctrl.addBinding(config, 'tint', {
  min: 0,
  max: 359,
  step: 1,
  label: 'Tint (Hue)',
})

const masker = ctrl.addBinding(config, 'alpha', {
  min: 0,
  max: 100,
  step: 0.1,
  label: 'Alpha (%)',
})
ctrl.addBinding(config, 'base', {
  min: 0,
  max: 20,
  step: 0.1,
  label: 'Spread Base (px)',
})
ctrl.addBinding(config, 'x', {
  min: -1,
  max: 1,
  step: 0.1,
  label: 'Angle (x)',
})
const theme = ctrl.addBinding(config, 'theme', {
  options: {
    // System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
  label: 'Theme',
})

const sync = () => {
  tint.disabled = config.theme === 'dark'
  tinter.disabled = !config.tinted || config.theme === 'dark'
  masker.disabled = !config.tinted || config.theme === 'dark'
  document.documentElement.dataset.tinted = config.tinted
  document.documentElement.dataset.theme = config.theme
  document.documentElement.style.setProperty('--tint', config.tint)
  document.documentElement.style.setProperty('--alpha', config.alpha)
  document.documentElement.style.setProperty('--spread', config.base)
  document.documentElement.style.setProperty('--x', config.x)
}

sync()

const handle = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return sync()
  document.startViewTransition(() => sync())
}

ctrl.on('change', handle)
