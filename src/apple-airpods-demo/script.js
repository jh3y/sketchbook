import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const track = document.querySelector('.timeline__track')
const populateImages = () => {
  let inner = ''
  for (let i = 0; i < 65; i++) {
    inner += `

        <img ${i === 0 ? '' : 'aria-hidden="true"'} alt="${
      i === 0 ? 'Apple Airpods Pro' : ''
    }" src="https://www.apple.com/105/media/us/airpods-pro/2022/d2deeb8e-83eb-48ea-9721-f567cf0fffa8/anim/hero/large/${i
      .toString()
      .padStart(4, '0')}.png">

  `
  }
  return inner
}
track.innerHTML = populateImages()

const config = {
  play: false,
  steps: true,
  debug: false,
  theme: 'system',
}

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.steps = config.steps
  document.documentElement.dataset.play = config.play
  document.documentElement.dataset.debug = config.debug
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

ctrl.addBinding(config, 'play', { label: 'Play' })
ctrl.addBinding(config, 'steps', { label: 'Stepped' })
ctrl.addBinding(config, 'debug', { label: 'Debug' })
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
