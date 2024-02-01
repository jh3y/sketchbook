const input = document.querySelector('input')
const update = () => document.documentElement.style.setProperty('--value', input.value)
input.addEventListener('input', update)