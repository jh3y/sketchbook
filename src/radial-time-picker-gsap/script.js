import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

const INPUT = document.querySelector('[type=range]')

const ROTATE_MAPPER = gsap.utils.mapRange(0, INPUT.max, 0, 360)
const PROGRESS_MAPPER = gsap.utils.mapRange(0, INPUT.max * 0.5, 0, 50)

gsap.registerPlugin(Draggable)

gsap.set('[title="moon"]', { scale: 0 })

const minToTime = minutes => `${`${Math.floor(minutes/60)}`.padStart(2, '0')}:${`${Math.floor(minutes%60)}`.padStart(2, '0')}`


const SUNRISE = 465
const SUNSET = 465 + (12 * 60)
// let rotationSnap = 360 / 24
let rotationSnap = 15

const onInput = function() {
  if (this.rotation) {
    let VALUE = Math.floor(((this.rotation % 360) / 360) * INPUT.max)
    if (VALUE < 0) VALUE = INPUT.max - Math.abs(VALUE)
    INPUT.value = VALUE
  } else {
    gsap.set('.radial__ring', {
      rotate: ROTATE_MAPPER(INPUT.value)
    }) 
  }
  const TIME = minToTime(gsap.utils.wrap(0, 1440, parseInt(INPUT.value, 10) + (SUNSET + (SUNRISE - SUNSET) * 0.5)))
  gsap.set('.radial__time', {
    innerText: TIME
  })
  gsap.set('.radial__handle', {
    rotate: ROTATE_MAPPER(-INPUT.value)
  })
  if (INPUT.value > INPUT.max * 0.25 && INPUT.value < INPUT.max * 0.75) {
    gsap.to('[title="sun"]', { scale: 0, duration: 0.25 })
    gsap.to('[title="moon"]', { scale: 1, duration: 0.25 })
    gsap.set('.radial__handle', { background: 'var(--gray-8)' })
    gsap.set('body', { background: 'var(--text-1)'})
    gsap.set('.radial__time', { color: 'var(--surface-1)'})
  } else {
    gsap.to('[title="moon"]', { scale: 0, duration: 0.25 })
    gsap.to('[title="sun"]', { scale: 1, duration: 0.25 })
    gsap.set('.radial__handle', { background: 'var(--gray-0)' })
    gsap.set('body', { background: 'var(--surface-1)' })
    gsap.set('.radial__time', { color: 'var(--text-1)' })
  }
  // Based on the value work out the conic-gradient percentages...
  // Remember the ring starts at 0 and the input at 0 but the stops are offset.
  const sunInput = INPUT.value > INPUT.max * 0.75 ? parseInt(INPUT.value, 10) - INPUT.max * 0.75 : parseInt(INPUT.value, 10) + INPUT.max * 0.25
  const moonInput = INPUT.value > INPUT.max * 0.75 ? 0 : INPUT.value - INPUT.max * 0.25
  gsap.set('.radial__track', {
    '--sun-stop': gsap.utils.clamp(0, 50, PROGRESS_MAPPER(sunInput)),
    '--moon-stop': gsap.utils.clamp(0, 50, PROGRESS_MAPPER(moonInput))
  })
}

window.__RADIAL = Draggable.create(".radial__ring", {
  trigger: '.radial__handle',
  type:"rotation",
  inertia: true,
  onThrowUpdate: onInput,
  onDrag: onInput,
  snap:function(endValue) {
    return Math.round(endValue / rotationSnap) * rotationSnap;
  }
});

INPUT.addEventListener('input', onInput)

onInput()