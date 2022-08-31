const BUTTONS = document.querySelectorAll('button')
const DIALOG = document.querySelector('dialog')



BUTTONS.forEach(BUTTON => {
  BUTTON.addEventListener('click', e => {
    let modalStyle
    switch (BUTTON.getAttribute('data-modal')) {
      case 'true':
        modalStyle = 'showModal'
        break
      case 'false':
        modalStyle = 'show'
        break
      default:
        modalStyle = 'close'
    }
    DIALOG[modalStyle]()
  })
})