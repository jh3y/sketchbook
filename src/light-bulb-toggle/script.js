import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import MorphSVGPlugin from 'gsap/MorphSVGPlugin'
import Draggable from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'

gsap.registerPlugin(Draggable)
gsap.registerPlugin(MorphSVGPlugin)

// Used to calculate distance of "tug"
let startX
let startY

const AUDIO = {
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3'),
}
const STATE = {
  ON: false,
}
const CORD_DURATION = 0.1

const CORDS = document.querySelectorAll('.toggle-scene__cord')
const HIT = document.querySelector('.grab-handle')
const DUMMY = document.querySelector('.toggle-scene__dummy-cord')
const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line')
const FORM = document.querySelector('form')
const TOGGLE = FORM.querySelector('button')
const PROXY = document.createElement('div')
// set init position
const ENDX = DUMMY_CORD.getAttribute('x2')
const ENDY = DUMMY_CORD.getAttribute('y2')
const RESET = () => {
  gsap.set(PROXY, {
    x: ENDX,
    y: ENDY,
  })
}

RESET()

FORM.addEventListener('submit', event => {
  event.preventDefault()
  STATE.ON = !STATE.ON
  TOGGLE.setAttribute('aria-pressed', STATE.ON)
  gsap.set(document.documentElement, { '--on': STATE.ON ? 1 : 0 })
  AUDIO.CLICK.play()
})

const CORD_TL = gsap.timeline({
  paused: true,
  onStart: () => {
    FORM.requestSubmit()
    gsap.set([DUMMY, HIT], { display: 'none' })
    gsap.set(CORDS[0], { display: 'block' })
  },
  onComplete: () => {
    gsap.set([DUMMY, HIT], { display: 'block' })
    gsap.set(CORDS[0], { display: 'none' })
    RESET()
  },
})

for (let i = 1; i < CORDS.length; i++) {
  CORD_TL.add(
    gsap.to(CORDS[0], {
      morphSVG: CORDS[i],
      duration: CORD_DURATION,
      repeat: 1,
      yoyo: true,
    })
  )
}

Draggable.create(PROXY, {
  trigger: HIT,
  type: 'x,y',
  onPress: e => {
    startX = e.x
    startY = e.y
  },
  onDragStart: () => {
    document.documentElement.style.setProperty('cursor', 'grabbing')
  },
  onDrag: function() {
    // Need to map the coordinates based on scaling.
    // ViewBox to physical sizing
    // The ViewBox width is 134
    const ratio = 1 / (FORM.offsetWidth / 134)
    gsap.set(DUMMY_CORD, {
      attr: {
        x2: this.startX + ((this.x - this.startX) * ratio),
        y2: this.startY + ((this.y - this.startY) * ratio),
      },
    })
  },
  onRelease: (e) => {
    const DISTX = Math.abs(e.x - startX)
    const DISTY = Math.abs(e.y - startY)
    const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY)
    document.documentElement.style.setProperty('cursor', 'unset')
    gsap.to(DUMMY_CORD, {
      attr: { x2: ENDX, y2: ENDY },
      duration: CORD_DURATION,
      onComplete: () => {
        if (TRAVELLED > 50) {
          CORD_TL.restart()
        } else {
          RESET()
        }
      },
    })
  },
})
