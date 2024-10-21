import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const config = {
  theme: 'system',
}

const drawer = document.querySelector('.drawer')
const scroller = drawer.querySelector('.drawer__scroller')
const dragger = drawer.querySelector('.drawer__drag')

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.on('change', sync)
update()

// Drawer mechanics
// close the drawer on snap change if === 0
scroller.addEventListener('scrollsnapchange', () => {
  if (scroller.scrollTop === 0) {
    drawer.dataset.snapped = true
    drawer.hidePopover()
  }
})
// reset the drawer once closed
drawer.addEventListener('toggle', (event) => {
  if (event.newState === 'closed') drawer.dataset.snapped = false
})

const attachDrag = (element) => {
  let startY = 0
  let drag = 0
  let scrollStart

  const reset = () => {
    startY = drag = 0
    const top = scroller.scrollTop < scrollStart * 0.5 ? 0 : scrollStart

    const handleScroll = () => {
      if (scroller.scrollTop === top) {
        document.documentElement.dataset.dragging = false
        scroller.removeEventListener('scroll', handleScroll)
      }
    }
    scroller.addEventListener('scroll', handleScroll)

    scroller.scrollTo({
      top,
      behavior: 'smooth',
    })
    handleScroll()
  }

  const handle = ({ y }) => {
    drag = y - startY
    scroller.scrollTo({
      top: scrollStart - drag,
      behavior: 'instant',
    })
  }
  const teardown = (event) => {
    if (event.target.tagName !== 'BUTTON') {
      reset()
    }
    document.removeEventListener('mousemove', handle)
    document.removeEventListener('mouseup', teardown)
  }
  const activate = ({ y }) => {
    startY = y
    scrollStart = scroller.scrollTop
    document.documentElement.dataset.dragging = true
    document.addEventListener('mousemove', handle)
    document.addEventListener('mouseup', teardown)
  }
  element.addEventListener('click', (event) => {
    if (drag > 5) event.preventDefault()
    reset()
  })
  element.addEventListener('mousedown', activate)
}

attachDrag(document.querySelector('.drawer__content'))
