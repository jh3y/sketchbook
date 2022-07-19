const randomInRange = (min, max) =>
  Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
  )

const STEPS = [...document.querySelectorAll('li')]

const numberOfGroups = STEPS.length / 5

for (let g = 0; g < numberOfGroups; g++) {
  const group = STEPS.slice(g * 5, g * 5 + 5)
  const POSITIONS = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5)
  group.forEach((slot, index) => {
    slot.style.setProperty('--row', POSITIONS[index])
    slot.style.setProperty('--index', g * 5 + index + 1)
    slot.style.setProperty('--rotation', randomInRange(-90, 90))
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