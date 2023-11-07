const TOGGLE = document.querySelector('button')

const UPDATE = () => {
  const DARK = TOGGLE.matches('[aria-pressed=true]')
  TOGGLE.setAttribute('aria-pressed', DARK ? false : true )
  document.documentElement.className = DARK ? 'dark' : ''
}

const TOGGLE_THEME = () => {

  if (!document.startViewTransition) return UPDATE()
  document.startViewTransition(() => UPDATE())

}

TOGGLE.addEventListener('click', TOGGLE_THEME)