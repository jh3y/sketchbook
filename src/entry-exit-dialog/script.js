const dialog = document.querySelector('dialog')
const button = document.querySelector('[aria-label="Open settings"]')

button.addEventListener('click', () => dialog.showModal())
