const ranger = document.querySelector('#speed')
const speedUpdate = () => {
  document.documentElement.style.setProperty('--speed', `${ranger.value}s`)
}
ranger.addEventListener('input', speedUpdate)