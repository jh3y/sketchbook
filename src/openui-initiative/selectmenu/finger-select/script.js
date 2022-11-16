import "../../../../net/experimental-web-platform/script.js";

const MENU = document.querySelector('selectmenu')
const VALUE = MENU.querySelector('[slot=selected-value]')

const CLONE = () => {
  VALUE.innerHTML = `${MENU.value.charAt(0).toUpperCase()}${MENU.value.slice(1)}`
}

MENU.addEventListener('input', CLONE)
CLONE()

