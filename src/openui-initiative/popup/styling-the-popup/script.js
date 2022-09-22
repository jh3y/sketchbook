import "../../../../net/experimental-web-platform/script.js";

const POPUP = document.querySelector('[popup]')

const LOG = e => console.info({ event: e, type: e.type })

POPUP.addEventListener('show', LOG)
POPUP.addEventListener('hide', LOG)