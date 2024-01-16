const updateSpeed = (event) => {
  document.documentElement.style.setProperty('--speed', event.target.value)
}
document.querySelector('[type=range]').addEventListener('input', updateSpeed)
