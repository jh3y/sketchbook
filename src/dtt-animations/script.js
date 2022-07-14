/**
 * Simple script for restarting/replaying animations
 * */

const PLAY_BUTTONS = document.querySelectorAll('.play')
const SECTIONS = document.querySelectorAll('section')

const PLAY = e => {
  if (e.currentTarget.parentNode.classList.contains('playing')) {
    e.currentTarget.parentNode.classList.remove('playing')
  } else {
    SECTIONS.forEach(section => {
      section.className = ''
      // Clone and replace the section ring
      const RING = section.querySelector('.sling-ring')
      const NEW_RING = RING.cloneNode(true)
      RING.remove()
      section.appendChild(NEW_RING)
    })
    e.currentTarget.parentNode.classList.add('playing')
  }
}

PLAY_BUTTONS.forEach(button => {
  button.addEventListener('click', PLAY)
})