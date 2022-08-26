const HOVER_TRIGGERS = document.querySelectorAll('[data-popuphovertarget]')

const SHOW = (trigger, tooltip) => () => {

  const { top, bottom, left, right, width, height } = trigger.getBoundingClientRect()
  tooltip.style.setProperty('--top', top)
  tooltip.style.setProperty('--right', right)
  tooltip.style.setProperty('--bottom', bottom)
  tooltip.style.setProperty('--left', left)
  tooltip.style.setProperty('--width', width)
  tooltip.style.setProperty('--height', height)

  tooltip.className = left > window.innerWidth * 0.5 ? 'right' : 'left'

  if (!tooltip.matches(':open')) tooltip.showPopUp()
}

HOVER_TRIGGERS.forEach(TRIGGER => {
  const POPUP = document.querySelector(`#${TRIGGER.getAttribute('data-popuphovertarget')}`)
  const SHOW_POP = SHOW(TRIGGER, POPUP)
  TRIGGER.addEventListener('pointerenter', SHOW_POP)
  TRIGGER.addEventListener('focus', SHOW_POP)
})

const closePopUps = () => document.querySelectorAll('[popup]').forEach(pop => {
  if (pop.matches(':open')) pop.hidePopUp()
})
window.addEventListener('resize', closePopUps)