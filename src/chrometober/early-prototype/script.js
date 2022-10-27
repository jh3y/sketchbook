import "./style.css";

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
  })
}