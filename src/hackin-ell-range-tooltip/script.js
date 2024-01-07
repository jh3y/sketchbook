const updateDelta = ({ movementX }) => {
  document.documentElement.style.setProperty('--delta-x', movementX)
}
document.body.addEventListener('pointermove', updateDelta)
