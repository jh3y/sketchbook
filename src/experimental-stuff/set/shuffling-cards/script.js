const ESCAPE_HATCH = document.querySelector('#escape-hatch')

const ADD_PAGE_TRANSITION_SPEED = (id, speed, delay = '0s') => {
  let styles = `::view-transition-old(${id}),::view-transition-new(${id}) {animation-duration: ${speed}; animation-delay: ${delay};}`
  styles += `::view-transition-group(${id}) {mix-blend-mode: normal;}`
  styles += `::view-transition-old(${id}),::view-transition-new(${id}) {height: 100%; backface-visibility: hidden; transform-style: preserve-3d; }`
  ESCAPE_HATCH.innerHTML += styles
}

let visualOrder = [0, 1, 2, 3, 4] // Used for tracking the visual order in the DOM
const TRANSPORT_DELAY = 0.1
const TRANSITION_STEP = 0.05
const SHUFFLER = document.querySelector('.shuffle-button')
const CONTROLS = document.querySelector('.shuffler__controls')
const COUNT = document.querySelector('[type="range"]')
const SHUFFLE_AREA = document.querySelector('.shuffler__cards')
const RIVER = document.querySelector('.river__cards')
const CARDS = document.querySelectorAll('.card:not(.card--placeholder)')

COUNT.value = Math.floor(Math.random() * 11)

const generateTransitions = (tag, delay) => {
  for (let c = 0; c < CARDS.length; c++) {
    ADD_PAGE_TRANSITION_SPEED(`${tag}-${c}`, `${TRANSITION_STEP}s`, `${delay + (TRANSITION_STEP * c)}s`)
  }
}
// ADD_PAGE_TRANSITION_SPEED('shuffler', '0.1s', '0s')
// Based on "visual" ordering, set the transition tags
const setTransitionTags = (tag) => {
  visualOrder.forEach((cardIndex, index) => {
    CARDS[index].style.setProperty(
      'view-transition-name',
      `${tag}-${cardIndex}`
    )
  })
}

const shuffle = () => {
  const POSITIONS = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5)
  visualOrder = POSITIONS
  CARDS.forEach((card, index) => {
    card.style.setProperty('--order', POSITIONS[index])
  })
}

// Generate the different transition tags
generateTransitions('transport-card-in', 0)
generateTransitions('transport-card-out', 0.5)
generateTransitions('initial-shuffle-card', 0)
generateTransitions('shuffle-card', 0)

CARDS.forEach(CARD => CARD.addEventListener('click', () => {
  CARD.setAttribute('aria-pressed', CARD.matches('[aria-pressed=true]') ? false : true)
}))

SHUFFLER.addEventListener('click', async () => {
  // Hide the controls
  CONTROLS.style.display = 'none'
  // Interesting that you can't create them in a stack.
  // Only create them when needed. Makes sense.
  const transportInAction = () => {
    CARDS.forEach((card, index) => {
      SHUFFLE_AREA.appendChild(card)
    })
  }
  const shuffleAction = () => {
    shuffle()
  }
  const transportOutAction = () => {
    CARDS.forEach((card) => {
      RIVER.appendChild(card)
    })
  }
  // 1. Move cards to the shuffler
  setTransitionTags('transport-card-in')
  const transportInTransition = document.startViewTransition(transportInAction)
  await transportInTransition.finished
  // transportInAction()
  // 2. Shuffle the cards
  // Wait one second
  setTransitionTags('initial-shuffle-card')
  const initialShuffleTransition = document.startViewTransition(shuffleAction)
  await initialShuffleTransition.finished
  // Arbritrary amount of shuffles
  for (let s = 0; s < COUNT.value; s++) {
    // do a shuffle
    setTransitionTags('shuffle-card')
    const shuffleTransition = document.startViewTransition(shuffleAction)
    await shuffleTransition.finished
  }
  // 3. Move cards back to the river
  setTransitionTags('transport-card-out')
  const transportOutTransition = document.startViewTransition(transportOutAction)
  await transportOutTransition.finished
  // setTimeout(() => transportOutAction(), 2000)
  // Reveal the controls
  CONTROLS.style.display = 'block'
  CARDS.forEach(CARD => CARD.style.viewTransitionName = 'none')
})
