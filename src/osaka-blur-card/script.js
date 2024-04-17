import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'

const UPDATE = ({ x, y }) => {
  gsap.set(document.documentElement, {
    '--x': gsap.utils.mapRange(0, window.innerWidth, -1, 1, x),
    '--y': gsap.utils.mapRange(0, window.innerHeight, -1, 1, y),
  })
}

window.addEventListener('pointermove', UPDATE)
