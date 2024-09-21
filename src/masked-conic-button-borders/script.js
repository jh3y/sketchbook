import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  style: 'double',
  theme: 'system',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.style = config.style
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'style', {
  label: 'Style',
  options: {
    Single: 'single',
    Double: 'double',
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

ctrl.on('change', sync)
update()

const button = document.querySelector('.border-button')
const setAngle = ({ x, y, target }) => {
  const { left, top, width, height } = target.getBoundingClientRect()
  const center = {
    x: left + width * 0.5,
    y: top + height * 0.5,
  }
  const delta = {
    x: x - center.x,
    y: y - center.y,
  }
  const radians = Math.atan2(delta.y, delta.x)
  const degrees = radians * (180 / Math.PI)
  target.style.setProperty('--from', (degrees + 360 + 90) % 360)
}

button.addEventListener('pointerenter', setAngle)
button.addEventListener('pointerleave', setAngle)
