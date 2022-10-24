import "./style.css";
import "../../../net/polyfills/scroll-timeline.js";

const LIST = document.querySelector('ul')
const CONTROLS = document.querySelector('.controls')
const COUNT = 64

const createTile = () => {
  const ITEM = document.createElement('li')
  const CARD = document.createElement('div')
  CARD.className = 'card elevated'
  ITEM.appendChild(CARD)
  LIST.appendChild(ITEM)
}

CONTROLS.addEventListener('change', e => {
  LIST.className = e.target.value
  LIST.innerHTML = ''
  LIST.scrollOffset = 0
  for (let t = 0; t < COUNT; t++) {
    createTile()
  }
})

for (let t = 0; t < COUNT; t++) {
  createTile()
}
