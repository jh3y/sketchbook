const TOGGLE = document.querySelector('button')

const SWITCH = () => {
  const isDark = TOGGLE.matches("[aria-pressed=true]") ? false : true;
  TOGGLE.setAttribute("aria-pressed", isDark);
  document.documentElement.className = isDark ? 'light' : 'dark'
}

const TOGGLE_THEME = () => {
  if (!document.startViewTransition) {
    console.info('Hey! Try this out in Chrome 111+')
    SWITCH()
  }
  document.startViewTransition(SWITCH)
};

TOGGLE.addEventListener('click', TOGGLE_THEME)