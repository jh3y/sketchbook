const orientator = document.querySelector('.direction-handler')
const orient = () => {
  orientator.setAttribute('aria-pressed', orientator.matches('[aria-pressed=false') ? true : false)
}

const changeOrientation = () => {
  document.documentElement.dataset.flipUi = true
  if (!document.startViewTransition) return orient()
  const transition = document.startViewTransition(orient)
  transition.finished.finally(() => {document.documentElement.dataset.flipUi = false})
}

orientator.addEventListener('click', changeOrientation)

const toggle = document.querySelector('button.theme')

const switchTheme = () => {
  const isDark = toggle.matches("[aria-pressed=true]") ? false : true;
  toggle.setAttribute("aria-pressed", isDark);
  document.documentElement.className = isDark ? 'light' : 'dark'
}

const handleToggle = () => {
  if (!document.startViewTransition) {
    console.info('Hey! Try this out in Chrome 111+')
    switchTheme()
  }
  document.startViewTransition(switchTheme)
};

toggle.addEventListener('click', handleToggle)