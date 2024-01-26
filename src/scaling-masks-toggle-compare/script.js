import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const CONFIG = {
  track: false
}
const CONFIG_ONE = {
  x: 50,
  y: 50,
  size: 10
}
const CONFIG_TWO = {
  x: 50,
  y: 50,
  size: 10
}

const CTRL = new Pane()

const ONE = document.querySelector('.box--one')
const TWO = document.querySelector('.box--two')

const update = () => {
  console.info('update')
  ONE.style.setProperty('--x', CONFIG_ONE.x)
  ONE.style.setProperty('--y', CONFIG_ONE.y)
  ONE.style.setProperty('--size', CONFIG_ONE.size)

  TWO.style.setProperty('--x', CONFIG.track ? (CONFIG_ONE.x + CONFIG_ONE.size * 0.5) - (CONFIG_TWO.size * 0.5) : CONFIG_TWO.x)
  TWO.style.setProperty('--y', CONFIG.track ? (CONFIG_ONE.y + CONFIG_ONE.size * 0.5) - (CONFIG_TWO.size * 0.5) : CONFIG_TWO.y)
  TWO.style.setProperty('--size', CONFIG_TWO.size)
  
}

const folderOne = CTRL.addFolder({ title: 'Box One'})
folderOne.addBinding(CONFIG_ONE, 'x', { min: 0, max: 100, step: 1, value: 0 })
folderOne.addBinding(CONFIG_ONE, 'y', { min: 0, max: 100, step: 1, value: 0 })
folderOne.addBinding(CONFIG_ONE, 'size', { min: 0, max: 2000, step: 1, value: 10 })
const folderTwo = CTRL.addFolder({ title: 'Box Two'})
folderTwo.addBinding(CONFIG_TWO, 'x', { min: 0, max: 100, step: 1, value: 0 })
folderTwo.addBinding(CONFIG_TWO, 'y', { min: 0, max: 100, step: 1, value: 0 })
folderTwo.addBinding(CONFIG_TWO, 'size', { min: 0, max: 2000, step: 1, value: 10 })
// Last piece is whether you want to track the mask position
CTRL.addBinding(CONFIG, 'track')

CTRL.on('change', update)
update()