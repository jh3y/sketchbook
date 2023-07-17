import gsap from 'gsap'

const TRANSFORM = new Audio('https://assets.codepen.io/605876/transform.mp3')
const TOUCH = new Audio('https://assets.codepen.io/605876/the-touch.mp3')
TOUCH.volume = 0



const SPEED = document.querySelector('#speed')

let transformed = true
let transforming = false
let DC
// document.documentElement.dataset.transformed = transformed
TRANSFORM.addEventListener('ended', () => {
  transforming = false
})

SPEED.addEventListener('input', () => {
  TRANSFORM.playbackRate = SPEED.checked ? 0.5 : 1
})

const AUTOBOT_TRANSFORM = (e) => {
  if (e.target.closest('.controls')) return
  if (transforming) return
  transformed = !transformed
  if (!transformed) {
    if (DC) DC.kill()
    if (!TOUCH.paused) {
      gsap.to(TOUCH, {
        volume: 0,
        duration: TOUCH.duration * 0.2,
        onComplete: () => {
          TOUCH.pause()
          TOUCH.currentTime = 0
        }
      })
    }
  } 
  let multiplier = SPEED.checked ? 0.5 : 0.25
  document.documentElement.style.setProperty('--transition-speed', `${TRANSFORM.duration * multiplier}s`)
  document.documentElement.dataset.transformed = transformed
  TRANSFORM.pause()
  TRANSFORM.currentTime = 0
  TRANSFORM.play()
  transforming = true
  if (transformed) {
    DC = gsap.delayedCall(TRANSFORM.duration * (1 + multiplier), () => {
      TOUCH.pause()
      TOUCH.currentTime = 0
      TOUCH.play()
      gsap.to(TOUCH, {
        volume: 0.5,
        repeat: 1,
        yoyo: true,
        repeatDelay: TOUCH.duration * 0.6,
        duration: TOUCH.duration * 0.2,
      })
    })
  }
}

TRANSFORM.ondurationchange = () => {
  document.documentElement.style.setProperty('--total-time', TRANSFORM.duration)
  document.documentElement.style.setProperty('--transition-speed', `${TRANSFORM.duration * 0.25}s`)
}

// SWITCH.addEventListener('input', () => {
//   AUTOBOT_TRANSFORM()
// })

const ROTATE = ({ x }) => {
  document.documentElement.style.setProperty('--rotate', (((x / window.innerWidth) - 0.5) * 2).toFixed(2))
}

document.body.addEventListener('click', AUTOBOT_TRANSFORM)

document.body.addEventListener('pointermove', ROTATE)
