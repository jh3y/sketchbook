import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  minWidth: 320,
  maxWidth: 1500,
  minSize: 17,
  maxSize: 20,
  minRatio: 1.2,
  maxRatio: 1.33,
  text: 'The tired developer debugged the complex code before the deadline.',
  container: false,
  scale: 0.86,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const width = ctrl.addFolder({ title: 'Width (px)', expanded: false })
width.addBinding(config, 'minWidth', {
  min: 0,
  max: 2000,
  step: 1,
  label: 'Min',
})
width.addBinding(config, 'maxWidth', {
  min: 0,
  max: 2000,
  step: 1,
  label: 'Max',
})
const size = ctrl.addFolder({ title: 'Size (px)', expanded: false })
size.addBinding(config, 'minSize', { min: 10, max: 30, step: 1, label: 'Min' })
size.addBinding(config, 'maxSize', { min: 10, max: 30, step: 1, label: 'Max' })
const ratio = ctrl.addFolder({ title: 'Ratio (px)', expanded: false })
ratio.addBinding(config, 'minRatio', {
  min: 1,
  max: 2,
  step: 0.01,
  label: 'Min',
})
ratio.addBinding(config, 'maxRatio', {
  min: 1,
  max: 2,
  step: 0.01,
  label: 'Max',
})
ctrl.addBinding(config, 'container', { label: 'Container Units' })
ctrl.addBinding(config, 'text', { label: 'Text' })
ctrl.addBinding(config, 'scale', {
  label: 'Preview Scale',
  min: 0.1,
  max: 1,
  step: 0.01,
})

const dd = document.querySelectorAll('dd')

const sync = () => {
  document.documentElement.style.setProperty('--font-size-min', config.minSize)
  document.documentElement.style.setProperty('--font-size-max', config.maxSize)
  document.documentElement.style.setProperty(
    '--font-ratio-min',
    config.minRatio
  )
  document.documentElement.style.setProperty(
    '--font-ratio-max',
    config.maxRatio
  )
  document.documentElement.style.setProperty(
    '--font-width-min',
    config.minWidth
  )
  document.documentElement.style.setProperty(
    '--font-width-max',
    config.maxWidth
  )
  document.documentElement.dataset.container = config.container
  document.documentElement.style.setProperty('--scale', config.scale)
  // Set the text for the dd values.
  dd.forEach((d) => (d.innerText = config.text))
}

ctrl.on('change', sync)
sync()

// const config = {
//   width: {
//     min: 320,
//     max: 1500,
//   },
//   size: {
//     min: 17,
//     max: 24,
//   },
//   ratio: {
//     min: 1.2,
//     max: 1.6,
//   },
// }

// const clamps = []

// for (let i = 0; i < 5; i++) {
//   const min = config.size.min * Math.pow(config.ratio.min, i)
//   const max = config.size.max * Math.pow(config.ratio.max, i)

//   const minRem = `${min / 16}rem`
//   const maxRem = `${max / 16}rem`

//   const vi = (max - min) / (config.width.max - config.width.min)

//   const residual = min / 16 - (vi * config.width.min) / 16
//   /**
//    * preferred is: min (px) - (max (px) - min(px) / max width - min width)
//    */
//   const clamp = `clamp(${minRem}, ${residual}rem + ${vi * 100}vi, ${maxRem})`
//   // document.documentElement.style.setProperty(`--step-${i}`, clamp)
//   clamps.push(clamp)
// }
