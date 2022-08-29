const POPUP = document.querySelector('#spotlight')

// Keys are 91 && 74.
const CMD = 91
const MOD = 74

const STATE = {
  cmd: false,
  mod: false, 
}

const handleActivation = e => {
  if (e.keyCode === CMD && !STATE.cmd) STATE.cmd = true
  if (e.keyCode === MOD && STATE.cmd && !STATE.mod) STATE.mod = true

  if (STATE.cmd && STATE.mod && !POPUP.matches(':open')) {
    STATE.cmd = STATE.mod = false
    POPUP.showPopUp()

    OPTIONS.showPopUp()
  }
}

const unload = e => {
  if (e.keyCode === CMD || e.keyCode === MOD) STATE.cmd = STATE.mod = false
}

document.body.addEventListener('keydown', handleActivation)
document.body.addEventListener('keyup', unload)


document.documentElement.setAttribute('data-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

let length = 0
const OPTIONS = document.querySelector('#spotlight-options')
const SEARCH = document.querySelector('#spotlight-search')
const AVAILABLE_OPTIONS = [
  {
    id: 'toggle-theme',
    title: 'Toggle theme <i class="material-symbols-outlined">routine</i>',
    action: () => {
      document.documentElement.setAttribute('data-theme', document.documentElement.matches('[data-theme="dark"]') ? 'light' : 'dark')
    }
  },
  {
    id: 'twitter-reach',
    title: 'Say "Hey" on Twitter <i class="material-symbols-outlined">waving_hand</i>',
    action: () => {
      window.open('https://twitter.com/jh3yy', '_blank')
    }
  },
  {
    id: 'popup-explainer',
    title: 'Check out the Pop-up API Explainer <i class="material-symbols-outlined">mode_comment</i>',
    action: () => {
      window.open('https://open-ui.org/components/popup.research.explainer', '_blank')
    }
  },
  {
    id: 'web-search',
    title: value => `Search web for "${value}" <i class="material-symbols-outlined">public</i>`,
    action: value => {
      window.open(`https://google.com/search?q=${value}`, '_blank')
    }
  },
]

const fireAction = actionId => {
  AVAILABLE_OPTIONS.filter(option => option.id === actionId)[0].action(SEARCH.value)
  if (actionId !== 'toggle-theme') {
    SEARCH.value = ''
    POPUP.hidePopUp()
  }
}

const buildOptions = (options, value) => {
  let items = ''
  options.forEach((option, index) => {
    if (option) items += `
      <div id="${index}" role="option" aria-selected="${index === 0}" data-option="${option.id}">
        ${typeof option.title === 'string' ? option.title : option.title(value)}
      </div>
    `
  })
  OPTIONS.innerHTML = items
}


const onOptionsOpen = () => {
  const { bottom, left } = POPUP.getBoundingClientRect()
  SEARCH.setAttribute('aria-expanded', true)
  OPTIONS.style.setProperty('--top', bottom)
  OPTIONS.style.setProperty('--left', left)
}

const onOptionsHide = e => {
  SEARCH.setAttribute('aria-expanded', false)
}

const onActivated = e => {
  if (e.target === POPUP) {
    renderOptions(SEARCH.value)
  }
}

const selectOption = e => {
  let selected
  if (e.type === 'pointermove') {
    const opts = [...OPTIONS.children]
    opts.forEach(option => {
      let target = e.target.tagName === 'I' ? e.target.parentNode : e.target
      option.setAttribute('aria-selected', option === target ? true : false)
      if (option === target) selected = option
    })
  } else {
    e.preventDefault()
    const CURRENT = document.querySelector('[aria-selected="true"]')
    selected = CURRENT[e.keyCode === 38 ? 'previousElementSibling' : 'nextElementSibling']
    if (!selected) selected = CURRENT.parentNode[e.keyCode === 38 ? 'lastElementChild' : 'firstElementChild']
    CURRENT.setAttribute('aria-selected', false)
    selected.setAttribute('aria-selected', true)
  }
  if (selected) SEARCH.setAttribute('aria-activedescendant', selected.getAttribute('data-option'))
}

const renderOptions = value => {
  length = value.length
  let options = [
    ...AVAILABLE_OPTIONS.filter(option => {
      return typeof option.title === 'string' && option.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }),
    value !== '' ? AVAILABLE_OPTIONS.filter(option => option.id === 'web-search')[0] : null
  ]
  // Regardless of what's happening, you're building the options...
  buildOptions(options, value)

  if (!OPTIONS.matches(':open') && options.length) {
    OPTIONS.showPopUp()
  }
}

const handleActionClick = e => {
  fireAction(e.target.tagName === 'I' ? e.target.parentNode.getAttribute('data-option') : e.target.getAttribute('data-option'))
}


const handleKeyboardInteraction = e => {
  // Handle building of options
  if (POPUP.matches(':open')) {
    if (e.keyCode === 13 && e.type === 'keydown') {
      e.preventDefault()
      fireAction(document.querySelector('[aria-selected="true"]').getAttribute('data-option'))
    } else if (
      SEARCH.value.length !== length
    ) {
      renderOptions(SEARCH.value)
    } else if (
      OPTIONS.matches(':open') &&
      (e.keyCode === 38 || e.keyCode === 40) &&
      e.type === 'keydown'
    ) {
      selectOption(e)
    } else if (e.keyCode === 27) {
      SEARCH.value = ''
    }
  }
}

POPUP.addEventListener('show', onActivated)
window.addEventListener('keydown', handleKeyboardInteraction)
window.addEventListener('keypress', handleKeyboardInteraction)
window.addEventListener('keyup', handleKeyboardInteraction)
OPTIONS.addEventListener('show', onOptionsOpen)
OPTIONS.addEventListener('hide', onOptionsHide)
OPTIONS.addEventListener('pointermove', selectOption)
OPTIONS.addEventListener('click', handleActionClick)

// Catch case for clicking on the input
SEARCH.addEventListener('click', e => {
  // Don't want the click on the input to close the popup
  OPTIONS.showPopUp()
})

renderOptions('')
onOptionsOpen()