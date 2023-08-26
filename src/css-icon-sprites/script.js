const BTN = document.querySelector('button')
const SLOW = document.querySelector('#slow')
const SHOW = document.querySelector('#show')
const ZOOM = document.querySelector('#zoom')
const STEP = document.querySelector('#step')

const TOGGLE = () => {
  BTN.setAttribute(
    'aria-pressed',
    BTN.matches('[aria-pressed=true]') ? false : true
  )
  BTN.title = BTN.matches('[aria-pressed=true]') ? 'Undo Repost' : 'Repost'
}

BTN.addEventListener('click', TOGGLE)

const CHANGE = () => {
  document.documentElement.style.setProperty('--slow', SLOW.checked ? 1 : 0)
  document.documentElement.style.setProperty('--show', SHOW.checked ? 1 : 0)
  document.documentElement.style.setProperty('--zoom', ZOOM.checked ? 1 : 0)
  document.documentElement.style.setProperty('--step', STEP.checked ? 'steps(20)' : 'ease-in-out')
}

SLOW.addEventListener('change', CHANGE)
SHOW.addEventListener('change', CHANGE)
ZOOM.addEventListener('change', CHANGE)
STEP.addEventListener('change', CHANGE)