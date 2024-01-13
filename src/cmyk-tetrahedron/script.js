import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const CONFIG = {
  x: 0,
  y: 0,
  z: 0,
  size: 120,
  speed: 2,
}

const CTRL = new GUI()

const UPDATE = () => {
  for (const key of Object.keys(CONFIG)) {
    document.documentElement.style.setProperty(`--${key}`, CONFIG[key])
  }
}

CTRL.add(CONFIG, 'x', -360, 360, 1).name("Rotate X").onChange(UPDATE)
CTRL.add(CONFIG, 'y', -360, 360, 1).name("Rotate Y").onChange(UPDATE)
CTRL.add(CONFIG, 'z', -360, 360, 1).name("Rotate Z").onChange(UPDATE)
CTRL.add(CONFIG, 'size', 20, 300, 1).name("Size (px)").onChange(UPDATE)
CTRL.add(CONFIG, 'speed', 0.5, 10, 0.1).name("Speed (s)").onChange(UPDATE)

UPDATE()