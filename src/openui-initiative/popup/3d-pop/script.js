import "../../../../net/experimental-web-platform/script.js";

const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}
const clamp = (min, max, value) => Math.min(Math.max(value, min), max)

const POPUP = document.querySelector('.popup')

const LIMIT = 10

const UPDATE_PARALLAX = ({ x, y }) => {
	const rotateY = clamp(-LIMIT, LIMIT, mapRange(0, window.innerWidth, -LIMIT, LIMIT)(y))
	const rotateX = clamp(-LIMIT, LIMIT, mapRange(0, window.innerHeight, -LIMIT, LIMIT)(x)) 
	document.documentElement.style.setProperty('--x', rotateX)
	document.documentElement.style.setProperty('--y', rotateY)
}

const DEACTIVATE_PARALLAX = () => {
	document.body.removeEventListener('pointermove', UPDATE_PARALLAX)
}

const ACTIVATE_PARALLAX = () => {
	document.body.addEventListener('pointermove', UPDATE_PARALLAX)
}

POPUP.addEventListener('show', ACTIVATE_PARALLAX)
POPUP.addEventListener('hide', DEACTIVATE_PARALLAX)