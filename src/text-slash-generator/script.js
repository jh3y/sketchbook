const GAPPER = document.querySelector('#gap')
const POSITION = document.querySelector('#position')
const TEXT = document.querySelector('h1')

const updateGap = () => TEXT.style.setProperty('--gap', GAPPER.value)

GAPPER.addEventListener('input', updateGap)

const updatePosition = () => TEXT.style.setProperty('--position', POSITION.value / 100)

POSITION.addEventListener('input', updatePosition)