const update = ({ x, y }) => {
  document.documentElement.style.setProperty('--x', x)
  document.documentElement.style.setProperty('--y', y)
}
const list = document.querySelector('ol')
list.addEventListener('pointermove', update)