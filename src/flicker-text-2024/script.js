import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import './ease-generator.js'

const HEADING = document.querySelector('h1')

const CONFIG = {
  text: 'Your name',
  accent: '#e619a1',
  probability: 0.2,
}

const RENDER = () => {
  let splitters = ''
  const flickIndex = Math.floor(Math.random() * (CONFIG.text.length + 1));
  for (let c = 0; c < CONFIG.text.length; c++) {
    const flick = Math.random() < CONFIG.probability || c === flickIndex
    const speed = Math.random() * (4 - 1) + 1
    const delay = Math.random() * 5

    // You can generate the custom flicker for each letter
    const seedEase = `rough({ template: power1.inOut, strength: 2, points: 50, taper: 'none', randomize: true, clamp: true})`
    const customEase = generateCustomEase(seedEase, 0.0005, 4, 0.25)

    splitters += `<span ${flick ? `data-flick="true" style="--custom:${customEase}; --speed:${speed}; --delay:${delay};"` : ''}aria-hidden="true" >${CONFIG.text[c]}</span>`
  }
  HEADING.innerHTML = `
    ${splitters}
    <span class="sr-only">${CONFIG.text}</span>
  `
}

const UPDATE = (event) => {
  const label = event.target.controller.view.labelElement.innerText
  if (label === 'Accent') {
    // Swift CSS update
    document.documentElement.style.setProperty('--accent', CONFIG.accent)
  } else {
    RENDER()
  }
}

const CTRL = new Pane({ title: 'Config', expanded: false })

CTRL.addBinding(CONFIG, 'text', { label: 'Text' })
CTRL.addBinding(CONFIG, 'probability', { label: 'Flicker Odds', min: 0, max: 1, step: 0.01 })
CTRL.addBinding(CONFIG, 'accent', {
  view: 'color',
  label: 'Accent'
});


CTRL.on('change', UPDATE)

RENDER()