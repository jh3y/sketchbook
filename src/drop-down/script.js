import polyfill from 'https://cdn.skypack.dev/@oddbird/css-anchor-positioning/fn'
import { apply, isSupported } from 'https://cdn.skypack.dev/@oddbird/popover-polyfill/fn';
const polyAnchor = () => {
  polyfill(true)
}
if (!isSupported()) apply()
if (!("anchorName" in document.documentElement.style)) polyAnchor()

const label = document.querySelector('[popovertarget] span:last-of-type')

const pop = document.querySelector('#pop')

const selectOption = event => {
  document.querySelector('[data-selected=true]').dataset.selected = false
  label.innerText = event.target.dataset.value
  event.target.dataset.selected = true
}

const handleSelect = event => {
  if (event.newState === 'open') pop.addEventListener('click', selectOption)
  else pop.removeEventListener('click', selectOption)
}

pop.addEventListener('beforetoggle', handleSelect)