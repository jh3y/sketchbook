const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}
const clamp = (min, max, value) => Math.min(Math.max(value, min), max)

const GRID = document.querySelector('.grid')

const LIMIT = 1

const UPDATE_PARALLAX = ({ x, y }) => {
	const rotateY = clamp(-LIMIT, LIMIT, mapRange(0, window.innerWidth, -LIMIT, LIMIT)(y))
	const rotateX = clamp(-LIMIT, LIMIT, mapRange(0, window.innerHeight, -LIMIT, LIMIT)(x)) 
	document.documentElement.style.setProperty('--x', rotateX)
	document.documentElement.style.setProperty('--y', rotateY)
}

document.body.addEventListener('pointermove', UPDATE_PARALLAX)