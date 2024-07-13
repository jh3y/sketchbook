import { Pane } from 'https://cdn.skypack.dev/tweakpane'

/**
 * Snippet of code to update the highlight index
 * */

const otp = document.querySelector('.otp')
const input = otp.querySelector('input')

const update = (event) => {
  console.info({ event, st: input.selectionStart })
  // if event.type === 'pointerdown work out selectionStart with x position instead
  otp.style.setProperty('--rl', input.selectionStart === 0 ? 1 : 0)
  otp.style.setProperty(
    '--rr',
    input.selectionStart >= input.maxLength - 1 ? 1 : 0
  )
  otp.style.setProperty('--index', input.selectionStart)
}

input.addEventListener('keyup', update)
input.addEventListener('click', update)
input.addEventListener('pointerdown', update)
input.addEventListener('focus', update)
update()

const sync = () => {
  input.setAttribute('maxLength', config.length)
  document.documentElement.style.setProperty('--width', config.width)
  document.documentElement.style.setProperty('--height', config.height)
  document.documentElement.style.setProperty('--font', config.font)
}

const config = {
  length: 6,
  font: 150,
  width: 2,
  height: 2,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'length', {
  min: 4,
  max: 6,
  step: 1,
  label: 'Length',
})
ctrl.addBinding(config, 'width', {
  min: 1,
  max: 3,
  step: 0.1,
  label: 'Width (ch)',
})
ctrl.addBinding(config, 'height', {
  min: 1,
  max: 3,
  step: 0.1,
  label: 'Height (ch)',
})
ctrl.addBinding(config, 'font', {
  min: 14,
  max: 150,
  step: 1,
  label: 'Font Size (px)',
})

ctrl.on('change', sync)
sync()
