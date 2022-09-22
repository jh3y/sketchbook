import "../../../../net/experimental-web-platform/script.js";

const POPUP = document.querySelector('[popup]')
const VIDEO = document.querySelector('video')

VIDEO.addEventListener('play', () => POPUP.showPopUp())
POPUP.addEventListener('hide', () => VIDEO.pause())