const supportsAnchorPos = "anchorName" in document.documentElement.style

const sync = (nav, anchors) => () => {
  for (let i = 0; i < anchors.length; i++) {
    const bounds = anchors[i].getBoundingClientRect()
    anchors[i].style.setProperty('view-transition-name', `item-${i + 1}`)
    nav.style.setProperty(`--item-${i + 1}-x`, bounds.left)
    nav.style.setProperty(`--item-${i + 1}-y`, bounds.top)
    nav.style.setProperty(`--item-${i + 1}-width`, bounds.width)
    nav.style.setProperty(`--item-${i + 1}-height`, bounds.height)
  }
}
/**
 * If there's no Anchor Positionioning support fill the gap ourselves.
 * The Oddbird polyfill struggles with dynamic anchoring
 * We can just set the positions via custom properties when there is a
 * layout change
 * */
const nav = document.querySelector('[data-magnetic]')
const anchors = nav.querySelectorAll('a')
const calibrate = sync(nav, anchors)
if (!supportsAnchorPos) {
  document.documentElement.dataset.noAnchor = true
  calibrate()
  window.addEventListener('resize', calibrate)
}

/**
 * Regardless of whether you have anchor positioning or not, a progressive touch
 * is to store the previously hovered piece so on pointerleave you get the fade out
 * */
const falloff = (index) => () => {
  if (supportsAnchorPos) {
    nav.style.setProperty('--item-active', `--item-${index + 1}`)
  } else {
    nav.style.setProperty('--item-active-x', `var(--item-${index + 1}-x)`)
    nav.style.setProperty('--item-active-y', `var(--item-${index + 1}-y)`)
    nav.style.setProperty('--item-active-width', `var(--item-${index + 1}-width)`)
    nav.style.setProperty('--item-active-height', `var(--item-${index + 1}-height)`)
  }
}
for (let i = 0; i < anchors.length; i++) {
  anchors[i].addEventListener('pointerenter', falloff(i))
}
nav.addEventListener('pointerleave', async () => {
  const transitions = document.getAnimations()
  if (transitions.length) {
    const fade = transitions.find(t => t.effect.target === nav.firstElementChild && t.transitionProperty === 'opacity')
    await Promise.allSettled([fade.finished])
    if (supportsAnchorPos) {
      nav.style.removeProperty('--item-active')
    } else {
      nav.style.removeProperty('--item-active-x')
      nav.style.removeProperty('--item-active-y')
      nav.style.removeProperty('--item-active-width')
      nav.style.removeProperty('--item-active-height')
    }
  }
})

/**
 * Change orientation with a button click
 * */
const orientator = document.querySelector('.direction-handler')
const orient = () => {
  orientator.setAttribute('aria-pressed', orientator.matches('[aria-pressed=false') ? true : false)
  calibrate()
}

const changeOrientation = () => {
  if (!document.startViewTransition) return orient()
  document.startViewTransition(orient)
}
calibrate()
orientator.addEventListener('click', changeOrientation)