const BUTTON = document.querySelector('button')

const TOGGLE = () => {
  BUTTON.setAttribute(
    'aria-pressed',
    BUTTON.matches('[aria-pressed=true]') ? false : true
  )
}

BUTTON.addEventListener('click', TOGGLE)