import "../../../../net/experimental-web-platform/script.js";

// const injectStyles = styles => document.querySelector('#escape-hatch').innerHTML = styles

// injectStyles(`
//   @position-fallback --top-to-bottom {
//     @try {
//       bottom: anchor(--anchor top);
//       left: anchor(--anchor right);
//     }
//     @try {
//       top: anchor(--anchor bottom);
//       left: anchor(--anchor right);
//     }
//   }
// `)

const PRODUCT_TARGET = document.querySelector('[popuptoggletarget="products"]')
const PRODUCTS_MENU = document.querySelector('#products')
const CSS_TARGET = document.querySelector('[popuptoggletarget="css"]')
const CSS_MENU = document.querySelector('#css')

const ANCHOR = (anchor, anchored) => () => {
  const { top, bottom, left, right } = anchor.getBoundingClientRect()
  anchored.style.setProperty('--top', top)
  anchored.style.setProperty('--right', right)
  anchored.style.setProperty('--bottom', bottom)
  anchored.style.setProperty('--left', left)
}

PRODUCTS_MENU.addEventListener('show', ANCHOR(PRODUCT_TARGET, PRODUCTS_MENU))
CSS_MENU.addEventListener('show', ANCHOR(CSS_TARGET, CSS_MENU))

const closePopUps = () => document.querySelectorAll('[popup]').forEach(pop => {
  if (pop.matches(':open')) pop.hidePopUp()
})
window.addEventListener('resize', closePopUps)