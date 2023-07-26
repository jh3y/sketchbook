const SECTIONS = document.querySelectorAll('section')

SECTIONS.forEach((s, index) => {
  s.style.viewTransitionName = `section--${index}`
})

let exposed = false
const LAUNCH = (event) => {
  if (event) {
    exposed = event.newState === 'open' ? true : false
  } else {
    exposed = false
    POPOVER.hidePopover()
  }
  document.startViewTransition(() => {
    document.body.dataset.exposed = exposed
  })
}

const SELECT = event => {
  ANCHORS.forEach(ANCHOR => {
    ANCHOR[event.currentTarget.href === ANCHOR.href ? 'setAttribute' : 'removeAttribute']('autofocus', true)
  })
  SECTIONS.forEach(SECTION => {
    SECTION.dataset.current = event.currentTarget.getAttribute('href') === SECTION.id ? true : false
  })
  LAUNCH()
}

const ANCHORS = document.querySelectorAll('a')

ANCHORS.forEach(anchor => anchor.addEventListener('click', SELECT))

const POPOVER = document.querySelector('#nav')

POPOVER.addEventListener('beforetoggle', LAUNCH)