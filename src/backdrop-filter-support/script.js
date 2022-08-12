const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const clamp = (min, max, value) => Math.min(Math.max(value, min), max)

const randomInRange = (min, max) =>
  Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
  )

const BACKDROP = document.querySelector('.backdrop')
const GENERATOR = document.querySelector('.regenerate')
const UPDATER = document.querySelector('.update')

const genGroupStyle = () => `
      --x:        ${randomInRange(0, 100)};
      --y:        ${randomInRange(0, 100)};
      --scale:    ${randomInRange(0.5, 2)};
      --duration: ${Math.random() > 0.75 ? randomInRange(10, 60) : 0};
      --origin-x: ${randomInRange(-100, 100)};
      --origin-y: ${randomInRange(-100, 100)};
    `

const genBlobStyle = () => `
        --x:     ${randomInRange(-300, 300)};
        --y:     ${randomInRange(-300, 300)};
        --scale: ${randomInRange(0.5, 5)};
        --hue:   ${randomInRange(0, 359)};
      `

const generateBlobs = () => {
  BACKDROP.innerHTML = ''
  const BLOB_GROUPS = randomInRange(2, 5)
  for (let g = 0; g < BLOB_GROUPS; g++) {
    const GROUP = document.createElement('div')
    GROUP.className = 'blobs'
    GROUP.style = genGroupStyle()
    const COUNT = randomInRange(2, 5)
    for (let b = 0; b < COUNT; b++) {
      const BLOB = document.createElement('div')
      BLOB.className = 'blob'
      BLOB.style = genBlobStyle()
      GROUP.appendChild(BLOB)
    }
    BACKDROP.appendChild(GROUP)
  }

}

generateBlobs()

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


const updateBlobs = () => {
  const GROUPS = document.querySelectorAll('.blobs')
  for (const GROUP of GROUPS) {
    GROUP.style = genGroupStyle()
    for (const BLOB of GROUP.children) {
      BLOB.style = genBlobStyle()
    }
  }
}


GENERATOR.addEventListener('click', generateBlobs)
UPDATER.addEventListener('click', updateBlobs)
document.body.addEventListener('pointermove', moveShine)