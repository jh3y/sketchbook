import "../../../../net/experimental-web-platform/script.js";

const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const moveShine = ({x, y}) => {
  const posX = mapRange(0, window.innerWidth, -100, 100)(x)
  const posY = mapRange(0, window.innerHeight, -100, 100)(y)
  document.documentElement.style = `
    --potential-x: ${window.innerWidth};
    --potential-y: ${window.innerHeight};
    --progress-x: ${posX / 100};
    --progress-y: ${posY / 100};
  `
}

document.body.addEventListener('pointermove', moveShine)