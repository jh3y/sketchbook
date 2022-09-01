const OG_POP = document.querySelector('.og[popup]')
const ADDER = document.querySelector('button[data-popup-generator]')
const CLEARER = document.querySelector('button[data-popup-clearer]')
const BACKDROP_ATTRIBUTE = 'data-hasbackdrop'

let popUps = []

const randomInRange = (min, max) =>
  Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
  )

const destroyPopUp = (e) => {
  // Remove the id from the list
  const popIndex = popUps.indexOf(e.target.id)
  if (popIndex !== -1) {
    // If there is an index before, add the attribute to that.
    popUps.splice(popIndex, 1)
    if (popUps.length !== 0)
      document
        .querySelector(`#${popUps[0]}`)
        .setAttribute(BACKDROP_ATTRIBUTE, true)
    e.target.remove()
  }
}

const createPopUp = () => {
  const pop = Object.assign(document.createElement('div'), {
    id: `pop--${popUps.length}`,
    popUp: 'manual',
    className: 'window popup',
    innerHTML: `
      <div class="title-bar">
        <div class="title-bar-text">Generated Pop-up</div>
        <div class="title-bar-controls">
          <button aria-label="Close"></button>
        </div>
      </div>
      <div class="window-body">
        <p>There's only ever one backdrop!</p>
        <section class="field-row">
          <button autofocus>Add another pop-up</button>
          <button>Cancel</button>
        </section>
      </div>
    `
  })

  const POP_BUTTONS = pop.querySelectorAll('button')
  
  POP_BUTTONS[0].addEventListener('click', () => pop.hidePopUp())
  POP_BUTTONS[1].addEventListener('click', createPopUp)
  POP_BUTTONS[2].addEventListener('click', () => pop.hidePopUp())

  pop.addEventListener('hide', destroyPopUp)

  if (popUps.length === 0) pop.setAttribute(BACKDROP_ATTRIBUTE, true)
  
  document.body.insertBefore(pop, OG_POP)
  
  pop.style.setProperty('--x', randomInRange(20, 80))
  pop.style.setProperty('--y', randomInRange(20, 80))

  popUps.push(pop.id)
  pop.showPopUp()
  // Remove and Re-add the OG to promote it above others in the top layer
  OG_POP.hidePopUp()
  OG_POP.showPopUp()
}

const clearPopUps = () => {
  const POPS = document.querySelectorAll('[popup]:not(.og)')
  for (const POP of POPS) {
    POP.hidePopUp()
  }
}

ADDER.addEventListener('click', createPopUp)
CLEARER.addEventListener('click', clearPopUps)
