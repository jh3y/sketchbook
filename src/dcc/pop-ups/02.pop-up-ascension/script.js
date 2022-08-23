const POPUP = document.querySelector('[popup]')

POPUP.addEventListener('show', () => POPUP.innerHTML = '<del>Not</del> In top layer')
POPUP.addEventListener('hide', () => POPUP.innerHTML = 'Not in top layer')