import { Pane } from 'https://cdn.skypack.dev/tweakpane'

// const range = document.querySelector('input')

// const update = () => document.documentElement.style.setProperty('--value', range.value)

// range.addEventListener('input', update)

const container = document.querySelector('.container')
const list = document.querySelector('ul')

const CONFIG = {
  items: 10
}

const refresh = () => {
  list.innerHTML = ''
  let content = ''
  for (let i = 0; i < CONFIG.items; i++) content += `<li>${String.fromCharCode(65 + (i % 26))}</li>`
  list.innerHTML = content
}

const CTRL = new Pane({ title: "Configuration", expanded: false })

CTRL.addBinding(CONFIG, 'items', { min: 5, max: 20, step: 1, label: 'Items' })

CTRL.on('change', refresh)

const update = () => {
  console.info(list.offsetWidth, container.offsetWidth, list.scrollWidth)
  document.documentElement.style.setProperty('--size', (container.offsetWidth / list.scrollWidth).toFixed(2))
}
const ThumbSizer = new ResizeObserver(update)
ThumbSizer.observe(container)

refresh()