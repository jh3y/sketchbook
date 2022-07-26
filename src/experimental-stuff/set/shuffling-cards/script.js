const ESCAPE_HATCH = document.querySelector('#escape-hatch')

const ADD_PAGE_TRANSITION_SPEED = (id, speed, delay = '0s') => {
  let styles = `::page-transition-container(${id}),::page-transition-outgoing-image(${id}),::page-transition-incoming-image(${id}) {animation-duration: ${speed}; animation-delay: ${delay};}`
  styles += `::page-transition-image-wrapper(${id}) {mix-blend-mode: normal;}`
  styles += `::page-transition-incoming-image(${id}),::page-transition-outgoing-image(${id}) {height: 100%;}`
  ESCAPE_HATCH.innerHTML += styles
}

let visualOrder = [0, 1, 2, 3, 4] // Used for tracking the visual order in the DOM
const TRANSPORT_DELAY = 0.25
const TRANSITION_STEP = 0.1
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
      'page-transition-tag',
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
generateTransitions('initial-shuffle-card', 0.5)
generateTransitions('shuffle-card', 0)

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

  const transportInTransition = document.createDocumentTransition()
  // Set the transition tags
  setTransitionTags('transport-card-in')
  await transportInTransition.start(transportInAction)
  // 2. Shuffle the cards
  // Wait one second
  const initialShuffleTransition = document.createDocumentTransition()
  setTransitionTags('initial-shuffle-card')
  await initialShuffleTransition.start(shuffleAction)
  // Arbritrary amount of shuffles
  for (let s = 0; s < COUNT.value; s++) {
    // do a shuffle
    const shuffleTransition = document.createDocumentTransition()
    setTransitionTags('shuffle-card')
    await shuffleTransition.start(shuffleAction)
  }
  // 3. Move cards back to the river
  const transportOutTransition = document.createDocumentTransition()
  setTransitionTags('transport-card-out')
  await transportOutTransition.start(transportOutAction)
  // Reveal the controls
  CONTROLS.style.display = 'block'
})
