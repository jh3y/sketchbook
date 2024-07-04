import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  roundness: 4,
  width: 1,
  height: 1,
}

let clipPath

const generateSquircle = () => {
  const points = []
  const steps = 100

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI
    const cosT = Math.cos(t)
    const sinT = Math.sin(t)
    const aspectRatio = config.width / config.height
    let x
    let y

    if (aspectRatio >= 1) {
      // Wider than tall
      x = 50 * (Math.sign(cosT) * Math.abs(cosT) ** (2 / config.roundness) + 1)
      y =
        (50 *
          (Math.sign(sinT) * Math.abs(sinT) ** (2 / config.roundness) + 1)) /
        aspectRatio
    } else {
      // Taller than wide
      x =
        50 *
        (Math.sign(cosT) * Math.abs(cosT) ** (2 / config.roundness) + 1) *
        aspectRatio
      y = 50 * (Math.sign(sinT) * Math.abs(sinT) ** (2 / config.roundness) + 1)
    }

    points.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`)
  }

  clipPath = `polygon(${points.join(', ')})`
  document.documentElement.style.setProperty('--squircle-clip', clipPath)
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const sync = () => {
  generateSquircle()
}

ctrl.addBinding(config, 'roundness', {
  min: 0,
  max: 20,
  step: 0.1,
  label: 'Roundness',
})

ctrl.on('change', sync)
sync()
