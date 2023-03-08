import * as p5 from 'https://cdn.skypack.dev/p5'

const FONT_SIZE = 32
const HUE = 38

const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const C_MAP = mapRange(0, 1, -10, 110)

document.documentElement.style.setProperty('--font-size', `${FONT_SIZE}px`)
document.documentElement.style.setProperty('--hue', `${HUE}deg`)

// Dirty Hack right here...
const SVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="hsl(${HUE} 100% 50% / 0.1)">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
</svg>
`

const IMG = Object.assign(document.createElement('img'), {
  width: FONT_SIZE * 2,
  height: FONT_SIZE * 2,
  alt: '',
  src: `data:image/svg+xml;base64,${window.btoa(SVG)}`,
})

class PacoButton {
  constructor(options) {
    const { el } = options
    const that = this
    this.__ratio = window.devicePixelRatio || 1
    this.__ELEMENT = el
    this.__GRUB = this.__ELEMENT.querySelector('.paco-grub')
    this.__GRUB.width = this.__ELEMENT.offsetWidth * this.__ratio
    this.__GRUB.height = this.__ELEMENT.offsetHeight * this.__ratio
    this.__GRUB_BOARD = this.__GRUB.getContext('2d')
    this.__GRUB.width = this.__ELEMENT.offsetWidth
    this.__GRUB.height = this.__ELEMENT.offsetHeight
    el.classList.add('paco-rabanne-button')

    const CANVAS = el.querySelector('.paco-canvas')

    this.__CANVAS = CANVAS

    const sketch = function (s) {
      s.setup = () => {
        that.__capture = s.createCapture(s.VIDEO).parent(CANVAS)
        CANVAS.querySelector('canvas').remove()
      }
    }
    new p5.default(sketch, CANVAS)
    this.__ELEMENT.style.visibility = 'visible'

    this.__ELEMENT.addEventListener('pointerdown', this.ACTIVATE_SMUDGE)
    this.__ELEMENT.addEventListener('pointerenter', this.SPARKLE)
    return this
  }
  SPARKLE = () => {
    const that = this
    const SPARKLES = that.__ELEMENT.querySelectorAll('svg')
    SPARKLES.forEach(s => {
      s.style.setProperty('--x', C_MAP(Math.random()))
      s.style.setProperty('--y', C_MAP(Math.random()))
      s.style.setProperty('--s', 1 + Math.random())
    })
  }
  ACTIVATE_SMUDGE = ({ x, y, type }) => {
    const that = this
    const smudgeAway = () => {
      that.SMUDGE({ x, y, type })
      that.__PRESSER = requestAnimationFrame(smudgeAway)
    }
    smudgeAway()
    that.__ELEMENT.addEventListener('pointermove', that.SMUDGE)
    document.body.addEventListener('pointerup', that.DEACTIVATE_SMUDGE)
  }
  DEACTIVATE_SMUDGE = () => {
    const that = this
    if (that.__PRESSER) cancelAnimationFrame(that.__PRESSER)
    that.__ELEMENT.removeEventListener('pointermove', that.SMUDGE)
    document.body.removeEventListener('pointerup', this.DEACTIVATE_SMUDGE)
  }
  SMUDGE = ({x, y, type }) => {
    const that = this
    if (type === 'pointermove' && that.__PRESSER) {
      cancelAnimationFrame(that.__PRESSER)
    }
    // Get the cursor position and offset it...
    const { left, top, width, height } = that.__ELEMENT.getBoundingClientRect()

    const IMG_X = ((x - left) / width) * that.__GRUB.width
    const IMG_Y = ((y - top) / height) * that.__GRUB.height

    that.__GRUB_BOARD.drawImage(
      IMG,
      IMG_X - FONT_SIZE,
      IMG_Y - FONT_SIZE,
      FONT_SIZE * 2,
      FONT_SIZE * 2
    )
  }
}

new PacoButton({
  el: document.querySelector('.paco')
})