import { Pane } from 'https://cdn.skypack.dev/tweakpane'

// Apple Video Link: https://www.apple.com/105/media/us/ipad-10.9/2022/4c5d6d90-d0de-429a-84f7-cf8827181a11/anim/features/large.mp4

const config = {
  src: 'https://assets.codepen.io/605876/skateboarder--opt.mp4',
  debug: false,
  blend: true,
}

const video = document.querySelector('video')

const sync = () => {
  video.src = config.src
  document.documentElement.dataset.debug = config.debug
  document.documentElement.dataset.blend = config.blend
}
const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})
ctrl.addBinding(config, 'src', { label: 'src' })
ctrl.addBinding(config, 'debug', { label: 'debug' })
ctrl.addBinding(config, 'blend', { label: 'mix-blend-mode' })
ctrl.on('change', sync)
sync()
