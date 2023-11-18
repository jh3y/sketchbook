import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const CONFIG = {
  explode: false,
  spread: 20,
  dot: 2,
  width: 300,
  height: 300,
  size: 512,
  speed: 20,
  brightness: 1.25,
  dots: true,
  noise: true,
  intersect: true,
}
const UPDATE = () => {
  for (const key of Object.keys(CONFIG)) {
    if (key !== 'intersect' && key !== 'dots' && key !== 'noise')
      document.documentElement.style.setProperty(`--${key}`, CONFIG[key])
    if (key === 'intersect') {
      document.documentElement.style.setProperty(
        '--intersect',
        CONFIG.intersect ? 'source-in, xor' : 'unset'
      )
    }
    // Work out the mask combo
    document.documentElement.className = ''
    if (!CONFIG.dots && CONFIG.noise) document.documentElement.className = 'noise-mask'
    if (CONFIG.dots && !CONFIG.noise) document.documentElement.className = 'dots-mask'
    if (!CONFIG.dots && !CONFIG.noise) document.documentElement.className = 'no-mask'
  }
}

const EXPLODE = () => {
  document.documentElement.toggleAttribute('data-exploded')
}

const CTRL = new GUI({
  width: 320,
})
CTRL.add(CONFIG, 'explode').name('Explode?').onChange(EXPLODE)
CTRL.add(CONFIG, 'spread', 1, 100, 1).name('Spread (px)').onChange(UPDATE)
CTRL.add(CONFIG, 'dot', 1, 100, 1).name('Dot Size (px)').onChange(UPDATE)
CTRL.add(CONFIG, 'width', 100, 400, 1)
  .name('Canvas Width (px)')
  .onChange(UPDATE)
CTRL.add(CONFIG, 'height', 100, 400, 1)
  .name('Canvas Height (px)')
  .onChange(UPDATE)
CTRL.add(CONFIG, 'size', 1, 1920, 1).name('Mask Size (px)').onChange(UPDATE)
CTRL.add(CONFIG, 'brightness', 0.5, 5, 0.1).name('Brightness').onChange(UPDATE)
CTRL.add(CONFIG, 'speed', 2, 60, 1).name('Speed (s)').onChange(UPDATE)
CTRL.add(CONFIG, 'intersect').name('Mask Composite').onChange(UPDATE)
CTRL.add(CONFIG, 'dots').name('Dot Mask').onChange(UPDATE)
CTRL.add(CONFIG, 'noise').name('Perlin Mask').onChange(UPDATE)

UPDATE()
