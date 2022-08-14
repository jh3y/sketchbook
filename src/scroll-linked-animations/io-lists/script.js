const LIST = document.querySelector('ul')
const CONTROLS = document.querySelector('.controls')
const COUNT = 256


CONTROLS.addEventListener('change', e => {
  LIST.className = e.target.value
})

const createTile = () => {
  const ITEM = document.createElement('li')
  const CARD = document.createElement('div')
  CARD.className = 'card elevated'
  ITEM.appendChild(CARD)
  LIST.appendChild(ITEM)
}

for (let t = 0; t < COUNT; t++) {
  createTile()
}

const TILES = document.querySelectorAll('li')

let OPTIONS = {
  root: LIST,
  rootMargin: '0px',
  threshold: 0
}

const handleIntersection = (entries, observer) => {
  for (const entry of entries) {
    entry.target.style.setProperty('--shown', entry.isIntersecting ? 1 : 0)
  }
}

const observer = new IntersectionObserver(handleIntersection, OPTIONS)

TILES.forEach(TILE => observer.observe(TILE))