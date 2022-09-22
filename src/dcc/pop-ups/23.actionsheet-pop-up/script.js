import "../../../../net/experimental-web-platform/script.js";

const clamp = (min, max, value) => Math.min(Math.max(value, min), max)

const HEADER = document.querySelector('.actionsheet__header')
const ACTIONSHEET = document.querySelector('.actionsheet')

const STATE = {
  active: false,
  origin: 0,
}

const dragSheet = ({ y }) => {
  if (STATE.active) {
    let translation
    const { height } = ACTIONSHEET.getBoundingClientRect()
    if (ACTIONSHEET.matches(':open')) {
      translation = clamp(-height, height, (STATE.origin - y) * -1)
    } else {
      translation = clamp(-height, 0, (STATE.origin - y) * -1)
    }
    ACTIONSHEET.style.setProperty('--translate', translation)
  }
}

const endDrag = (e) => {
  const { y, movementY, pointerType } = e
  STATE.active = false
  STATE.origin = 0
  ACTIONSHEET.removeAttribute('style')
  document.body.removeEventListener('pointermove', dragSheet)
  document.body.removeEventListener('pointerup', endDrag)
  requestAnimationFrame(() => {
    if (pointerType === 'touch') {
      ACTIONSHEET[ACTIONSHEET.matches(':open') ? 'hidePopUp' : 'showPopUp']()
    }
  })
}

const activateDrag = ({ y }) => {
  STATE.active = true
  STATE.origin = y
  ACTIONSHEET.style.transition = 'none'
  document.body.addEventListener('pointermove', dragSheet)
  document.body.addEventListener('pointerup', endDrag)
}

HEADER.addEventListener('pointerdown', activateDrag)