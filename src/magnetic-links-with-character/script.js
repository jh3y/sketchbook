/**
 * utility for mapping range 🤙
 * */
const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const list = document.querySelector('ul')
const items = document.querySelectorAll('li')

const updateMagnet = event => {
  const item = event.currentTarget
  const xRange = item.magnetMapper.x(item.dataset.centerX - event.x)
  const yRange = item.magnetMapper.y(item.dataset.centerY - event.y)
  item.style.setProperty('--magnet-x', xRange)
  item.style.setProperty('--magnet-y', yRange)
  // Update list magnet if being used
  list.style.setProperty('--list-x', xRange)
  list.style.setProperty('--list-y', yRange)
}

const disableMagnet = event => {
  event.target.style.setProperty('--magnet-x', 0)
  event.target.style.setProperty('--magnet-y', 0)
  // Update list magnet if being used
  list.style.setProperty('--list-x', 0)
  list.style.setProperty('--list-y', 0)
  event.target.removeEventListener('pointermove', updateMagnet)
  event.target.removeEventListener('pointerleave', disableMagnet)
}

const activateMagnet = (event) => {
  const item = event.target
  const bounds = item.getBoundingClientRect()

  // Cache the center position on enter
  item.dataset.centerX = bounds.x + (item.offsetWidth * 0.5)
  item.dataset.centerY = bounds.y + (item.offsetHeight * 0.5)

  // Cache the mapper agains the element
  if (!item.magnetMapper) {
    item.magnetMapper = {
      x: mapRange(item.offsetWidth * -0.5, item.offsetWidth * 0.5, 1, -1),
      y: mapRange(item.offsetHeight * -0.5, item.offsetHeight * 0.5, 1, -1)
    }
  }
  // Optionally update the magnet for the list
  list.style.setProperty('--at', bounds.top)
  list.style.setProperty('--aw', bounds.right - bounds.left)
  list.style.setProperty('--ah', bounds.bottom - bounds.top)
  list.style.setProperty('--al', bounds.left)

  if (event.type === 'pointerenter') {
    item.addEventListener('pointermove', updateMagnet)
    item.addEventListener('pointerleave', disableMagnet)
  }
}

items.forEach(item => {
  item.addEventListener('pointerenter', activateMagnet)
  item.addEventListener('focus', activateMagnet)
})

/**
 * Controls based stuff
 * */
const inlineController = document.querySelector('#inline')
const blockController = document.querySelector('#block')
const offsetController = document.querySelector('#offset')
const updateStyles = () => {
  document.documentElement.style.setProperty('--item-inline', inlineController.value)
  document.documentElement.style.setProperty('--item-block', blockController.value)
  document.documentElement.style.setProperty('--text-offset', offsetController.value)
}
inlineController.addEventListener('input', updateStyles)
blockController.addEventListener('input', updateStyles)
offsetController.addEventListener('input', updateStyles)
updateStyles()