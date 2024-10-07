import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  theme: 'dark',
  count: 25,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const grid = document.querySelector('.grid')

const renderCells = () => {
  grid.innerHTML = new Array(config.count)
    .fill()
    .map(
      (_, index) =>
        `<div style="view-transition-name: cell-${index};">
          <span>${index}</span>
        </div>`
    )
    .join('')
}

renderCells()

const update = () => {
  document.documentElement.dataset.theme = config.theme
}

ctrl
  .addBinding(config, 'count', {
    min: 4,
    max: 100,
    step: 1,
    label: 'Count',
  })
  .on('change', () => renderCells())

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

const shuffle = () => {
  const positions = Array.from({ length: config.count }, (_, i) => i)
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[positions[i], positions[j]] = [positions[j], positions[i]] // Swap elements
  }
  const cells = grid.querySelectorAll('div')
  for (let c = 0; c < positions.length; c++) {
    cells[c].style.order = positions[c]
  }
}

ctrl.addButton({ title: 'Shuffle' }).on('click', () => {
  if (!document.startViewTransition) shuffle()
  document.startViewTransition(shuffle)
})
ctrl.on('change', sync)
update()
