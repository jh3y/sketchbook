import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import { gsap } from 'https://cdn.skypack.dev/gsap'

const config = {
  roundness: 4,
  aspect: 1,
  compare: false,
  radius: 96,
  steps: 50,
}

let clipPath

const generateSquircle = () => {
  console.clear()
  const points = []

  for (let i = 0; i < config.steps; i++) {
    const t = (i / config.steps) * 2 * Math.PI
    const cosT = Math.cos(t)
    const sinT = Math.sin(t)
    let x
    let y

    // In this scenario we can dismantle this to work it out and extrapolate it to a bigger shape
    // 50 - 100 === calc(100% - r) 100%
    // 0 - 50 === 0 48px
    x = Number.parseFloat(
      (
        50 *
        (Math.sign(cosT) * Math.abs(cosT) ** (2 / config.roundness) + 1)
      ).toFixed(2),
      10
    )
    y = Number.parseFloat(
      (
        50 *
        (Math.sign(sinT) * Math.abs(sinT) ** (2 / config.roundness) + 1)
      ).toFixed(2),
      10
    )

    // Manipulate x and y by making them a relative % of the value required.
    // 50 - 100 maps to 48px - 0px which is then subtracted from 100%
    // on the y axis we invert this and map from 0px - 48px;
    if (x >= 50 && y <= 50) {
      const newX = gsap.utils.mapRange(50, 100, config.radius, 0)(x).toFixed(2)
      const newY = gsap.utils.mapRange(0, 50, 0, config.radius)(y).toFixed(2)

      x = `calc(100% - ${newX}px)`
      y = `${newY}px`

      points.push(`${x} ${y}`)
    } else if (x >= 50 && y > 50) {
      const newX = gsap.utils.mapRange(100, 50, 0, config.radius)(x).toFixed(2)
      const newY = gsap.utils.mapRange(50, 100, config.radius, 0)(y).toFixed(2)

      x = `calc(100% - ${newX}px)`
      y = `calc(100% - ${newY}px)`

      points.push(`${x} ${y}`)
    } else if (x <= 50 && y >= 50) {
      const newX = gsap.utils.mapRange(0, 50, 0, config.radius)(x).toFixed(2)
      const newY = gsap.utils.mapRange(100, 50, 0, config.radius)(y).toFixed(2)

      x = `${newX}px`
      y = `calc(100% - ${newY}px)`

      points.push(`${x} ${y}`)
    } else if (x <= 50 && y <= 50) {
      const newX = gsap.utils.mapRange(0, 50, 0, config.radius)(x).toFixed(2)
      const newY = gsap.utils.mapRange(50, 0, config.radius, 0)(y).toFixed(2)

      x = `${newX}px`
      y = `${newY}px`

      points.push(`${x} ${y}`)
    } else {
      points.push(`${x}% ${y}%`)
    }
    // if (x > 50 && y < 50) console.info('top right')
    // if (x > 50 && y < 50) console.info('top right')
    // if (x > 50 && y < 50) console.info('top right')

    // Need to somehow work this out based on the quadrants and make it real to them...

    // const pxx =
    //   Math.floor(x) > 50 ? `calc(100% - ${(1 - x / 100) * 48}px)` : `${x}%`
    // console.info({ pxx })
  }

  clipPath = `polygon(${points.join(',')})`
  document.documentElement.style.setProperty('--squircle-clip', clipPath)
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const sync = () => {
  generateSquircle()
  document.documentElement.style.setProperty('--aspect', config.aspect)
  document.documentElement.dataset.compare = config.compare
}

ctrl.addBinding(config, 'roundness', {
  min: 0,
  max: 20,
  step: 0.1,
  label: 'Roundness',
})
ctrl.addBinding(config, 'radius', {
  min: 0,
  max: 100,
  step: 1,
  label: 'Radius (px)',
})
ctrl.addBinding(config, 'aspect', {
  min: 1,
  max: 2,
  step: 0.01,
  label: 'Aspect Ratio (x)',
})
ctrl.addBinding(config, 'compare', {
  label: 'Compare',
})

// ctrl.addBinding(config, 'aspect', {
//   min: 0.01,
//   max: 5,
//   step: 0.01,
//   label: 'Aspect Ratio',
// })

ctrl.on('change', sync)
sync()
