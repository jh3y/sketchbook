const dialog = document.querySelector('dialog')
const open = document.querySelector('.open')
const form = document.querySelector('form')

const scheme = document.querySelector('#scheme')
const backdrop = document.querySelector('#backdrop')
const duration = document.querySelector('#duration')
const scale = document.querySelector('#scale')

open.addEventListener('click', () => dialog.showModal())
form.addEventListener('submit', (event) => {
  event.preventDefault()
  dialog.close()
})

const sync = () => {
  document.documentElement.dataset.theme = scheme.value
}

const changeScheme = () => {
  if (!document.startViewTransition) return sync()
  document.startViewTransition(() => sync())
}

const syncForm = () => {
  const data = new FormData(form)
  for (const [key, value] of data) {
    document.documentElement.style.setProperty(`--${key}`, value)
  }
}

form.addEventListener('change', event => {
  if (event.target.id === 'scheme') return changeScheme()
  syncForm()
})

syncForm()