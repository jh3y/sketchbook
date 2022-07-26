const ESCAPE_HATCH = document.querySelector('#escape-hatch')
const STYLES_TO_INSERT = `
@scroll-timeline track {
  source: html;
  orientation: horizontal;
}
`
ESCAPE_HATCH.innerText = STYLES_TO_INSERT

const randomInRange = (min, max) =>
  Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
  )

const STEPS = [...document.querySelectorAll('li')]

const CONTENT_TRACK = document.querySelector('.content')

CONTENT_TRACK.style.setProperty('--count', STEPS.length)

const DIVIDER = 3
const POSITION_BASE = new Array(DIVIDER).fill().map((_, index) => index + 1)

const numberOfGroups = STEPS.length / DIVIDER

for (let g = 0; g < numberOfGroups; g++) {
  const group = STEPS.slice(g * DIVIDER, g * DIVIDER + DIVIDER)
  const POSITIONS = POSITION_BASE.sort(() => Math.random() - 0.5)
  group.forEach((slot, index) => {
    slot.style.setProperty('--row', POSITIONS[index])
    slot.style.setProperty('--index', g * DIVIDER + index + 1)
    slot.style.setProperty('--rotation', randomInRange(-180, 180))
    slot.style.setProperty('--final-rotation', randomInRange(-45, 45))
  })
}

let options = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0
}

const handleIntersection = (entries, observer) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add('visible')
    else entry.target.classList.remove('visible')
  }
}

const observer = new IntersectionObserver(handleIntersection, options)

STEPS.forEach(step => observer.observe(step))