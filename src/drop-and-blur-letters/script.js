import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import Splitting from 'https://cdn.skypack.dev/splitting'

const result = Splitting()
document.documentElement.style.setProperty(
  '--char-total',
  result[0].chars.length
)
document.documentElement.style.setProperty(
  '--word-total',
  result[0].words.length
)
// Insert Zzz after last word if you can...
const lastWord = document.querySelector('.words .word:last-of-type')
lastWord.innerHTML = `${lastWord.innerHTML}<span class="zzz"><span class="z" style="--i:0;">Z</span><span class="z" style="--i:1;">Z</span><span class="z" style="--i:2;">Z</span></span>`

const CTRL = new Pane({
  title: 'Config',
  expanded: true,
})

const CONFIG = {
  pixels: 80,
  padding: 100,
  delay: 0.25,
  blur: 6,
  x: 0,
  y: -75,
  theme: 'system',
  entity: 'character',
}

CTRL.addBinding(CONFIG, 'pixels', {
  min: 1,
  max: 500,
  step: 1,
  label: 'Pixels per Character',
})
CTRL.addBinding(CONFIG, 'padding', {
  min: 0,
  max: 500,
  step: 1,
  label: 'Scroll Padding',
})
CTRL.addBinding(CONFIG, 'entity', {
  options: {
    Character: 'character',
    Word: 'word',
  },
  label: 'Entity',
})
CTRL.addBinding(CONFIG, 'delay', {
  min: 0,
  max: 1,
  step: 0.01,
  label: 'Delay Multiplier',
})
CTRL.addBinding(CONFIG, 'blur', {
  min: 0,
  max: 50,
  step: 1,
  label: 'Blur (px)',
})
CTRL.addBinding(CONFIG, 'x', {
  min: -250,
  max: 250,
  step: 1,
  label: 'X (%)',
})
CTRL.addBinding(CONFIG, 'y', {
  min: -250,
  max: 250,
  step: 1,
  label: 'Y (%)',
})
CTRL.addBinding(CONFIG, 'theme', {
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
  label: 'Theme',
})

const sync = () => {
  document.documentElement.dataset.theme = CONFIG.theme
  document.documentElement.style.setProperty(
    '--pixels-per-character',
    CONFIG.pixels
  )
  document.documentElement.dataset.entity = CONFIG.entity
  document.documentElement.style.setProperty('--delay-multiplier', CONFIG.delay)
  document.documentElement.style.setProperty('--scroll-padding', CONFIG.padding)
  document.documentElement.style.setProperty('--blur', CONFIG.blur)
  document.documentElement.style.setProperty('--x', CONFIG.x)
  document.documentElement.style.setProperty('--y', CONFIG.y)
}

const handle = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return sync()
  document.startViewTransition(() => sync())
}

CTRL.on('change', handle)
sync()
