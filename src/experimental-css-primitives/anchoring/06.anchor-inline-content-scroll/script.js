import "../../../../net/experimental-web-platform/script.js";

const ANCHOR = document.querySelector('a')
const DIALOG = document.querySelector('dialog')

ANCHOR.addEventListener('pointerenter', () => DIALOG.show())