const ANCHORS = document.querySelectorAll('a')
const DIALOGS = document.querySelectorAll('dialog')

ANCHORS.forEach(ANCHOR => 
  ANCHOR.addEventListener('pointerenter', () => {
    DIALOGS.forEach(DIALOG => {
      DIALOG[DIALOG.id === ANCHOR.getAttribute('data-tooltip') ? 'show' : 'close']()
    })
  })
)