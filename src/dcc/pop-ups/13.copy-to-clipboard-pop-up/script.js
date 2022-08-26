const INPUT = document.querySelector('input')
const POPUP = document.querySelector('[popup]')
const BUTTON = document.querySelector('button')

const copyToClipboard = () => {
  if (!POPUP.matches(':top-layer')) {
    // Grab the text and use the clipboard API
    navigator.clipboard.writeText(INPUT.value)
      .then(() => {
        POPUP.showPopUp()
        setTimeout(() => POPUP.hidePopUp(), 2000)
      })
  }
}

BUTTON.addEventListener('click', copyToClipboard)