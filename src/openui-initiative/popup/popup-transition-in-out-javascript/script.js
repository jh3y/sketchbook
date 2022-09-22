import "../../../../net/experimental-web-platform/script.js";

const POPUP = document.querySelector('[popup]')

const onHidden = () => {
	POPUP.removeAttribute('style')
	POPUP.removeEventListener('transitionend', onHidden)
}

const onHide = () => {
  POPUP.style.setProperty('--x', 100)
  POPUP.addEventListener('transitionend', onHidden)
}

// Not triggered on the end of the event.
// Triggered on the event initiation?
// POPUP.addEventListener('show', onShow)
POPUP.addEventListener('hide', onHide)