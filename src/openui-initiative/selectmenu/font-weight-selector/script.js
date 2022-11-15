import "../../../../net/experimental-web-platform/script.js";

const MENU = document.querySelector('selectmenu')
const VALUE = MENU.querySelector('[slot=selected-value]')

const CLONE = () => {
  VALUE.innerHTML = MENU.querySelector(`option[value=${MENU.value}]`).innerHTML
}

MENU.addEventListener('input', CLONE)
CLONE()