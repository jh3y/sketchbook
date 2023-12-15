const MIN = document.querySelector('#min')
const MAX = document.querySelector('#max')
const MAX_LABEL = document.querySelector('[for=max]')
const MIN_LABEL = document.querySelector('[for=min]')

const HORIZONTAL = document.querySelector('#horizontal')

const CONSTRAIN = () => {
  document.documentElement.style.setProperty('--min', MIN.value)
  document.documentElement.style.setProperty('--max', MAX.value)
}

MIN.addEventListener('input', CONSTRAIN)
MAX.addEventListener('input', CONSTRAIN)
CONSTRAIN()

const sharedProps = {
  spellcheck: false,
  name: 'textarea',
  id: 'textarea',
  placeholder: 'Type your message...'
}
const SWITCH_MODE = () => {
  console.info('coll')
  const INPUT = document.querySelector('#textarea')
  if (INPUT.tagName === 'TEXTAREA') {
    // Update the labels at this point too
    MIN_LABEL.innerText = 'min-width (ch)'
    MAX_LABEL.innerText = 'max-width (ch)'
    MIN.setAttribute('min', 40)
    MIN.setAttribute('max', 100)
    MAX.setAttribute('min', 100)
    MAX.setAttribute('max', 200)
    INPUT.replaceWith(Object.assign(document.createElement('input'), sharedProps))
  } else {
    // Update the labels at this point too
    MIN_LABEL.innerText = 'min-height (lh)'
    MAX_LABEL.innerText = 'max-height (lh)'
    MIN.setAttribute('min', 1)
    MIN.setAttribute('max', 10)
    MAX.setAttribute('min', 5)
    MAX.setAttribute('max', 20)
    INPUT.replaceWith(Object.assign(document.createElement('textarea'), sharedProps))
  }
}

HORIZONTAL.addEventListener('change', SWITCH_MODE)


const POINTER_SYNC = ({ x, y }) => {
  document.documentElement.style.setProperty('--x', x)
  document.documentElement.style.setProperty('--y', y)
}
document.body.addEventListener('pointermove', POINTER_SYNC)