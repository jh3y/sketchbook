console.clear()

const UPDATE = ({ x, y }) => {
  document.documentElement.style.setProperty('--x', x)
  document.documentElement.style.setProperty('--xp', x / window.innerWidth)
  document.documentElement.style.setProperty('--y', y)
  document.documentElement.style.setProperty('--yp', y / window.innerHeight)
}

document.body.addEventListener('pointermove', UPDATE)