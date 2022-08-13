const OPEN_BUTTON = document.querySelector('button.open')
const CLOSE_BUTTON = document.querySelector('button.close')
const DIALOG = document.querySelector('dialog')

const OPEN_DIALOG = () => {
	DIALOG.showModal()
}
const CLOSE_DIALOG = () => {
	DIALOG.close()
}

OPEN_BUTTON.addEventListener('click', OPEN_DIALOG)
CLOSE_BUTTON.addEventListener('click', CLOSE_DIALOG)