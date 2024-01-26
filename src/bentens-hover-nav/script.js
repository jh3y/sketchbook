const TOGGLE = document.querySelector('.theme-toggle')

const applyChange = () => {
  const isDark = TOGGLE.matches('[aria-pressed=true]') ? false : true
  TOGGLE.setAttribute('aria-pressed', isDark)
  document.documentElement.className = isDark ? 'light' : 'dark'
}

const flip = () => {
  if (!document.startViewTransition) applyChange()
  document.startViewTransition(() => applyChange())
}

TOGGLE.addEventListener('click', flip)