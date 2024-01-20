import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const CONFIG = {
  accent: 320,
  speed: 0.25,
  text: "Get Code"
}

const CTRL = new GUI({ width: 300 })
const TEXT = document.querySelector('button .text')
CTRL.add(CONFIG, 'accent', 0, 359, 1).name('Accent Color (hue)').onChange(() => {
  document.documentElement.style.setProperty('--accent', CONFIG.accent)
})
CTRL.add(CONFIG, 'speed', 0.1, 2, 0.01).name('Speed (s)').onChange(() => {
  document.documentElement.style.setProperty('--speed', CONFIG.speed)
})
CTRL.add(CONFIG, 'text').name('Button Text').onChange(() => {
  TEXT.innerText = CONFIG.text
})