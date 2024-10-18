import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import Splitting from 'https://cdn.skypack.dev/splitting'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { Draggable } from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'
import InertiaPlugin from 'gsap/InertiaPlugin'
gsap.registerPlugin(Draggable, InertiaPlugin)

Splitting()

const popover = document.querySelector('#nav')
const themer = document.querySelector('.theme-toggle')
const debug = document.querySelector('.debug-toggle')
const placer = document.querySelector('.placement-toggle')

let deb
document.documentElement.dataset.resizing = false
document.documentElement.dataset.theme = 'system'
document.documentElement.dataset.placement = 'top'

window.addEventListener('resize', () => {
  if (popover.matches(':popover-open')) popover.hidePopover()
  document.documentElement.dataset.resizing = true
  if (deb) clearTimeout(deb)
  deb = setTimeout(() => {
    document.documentElement.dataset.resizing = false
  }, 200)
})

placer.addEventListener('click', () => {
  document.documentElement.dataset.placement =
    document.documentElement.dataset.placement === 'top' ? 'bottom' : 'top'
})

const config = {
  theme: 'system',
  debug: false,
}

let themeIndex = 0
const themeOptions = ['system', 'light', 'dark']
const switchTheme = () => {
  themeIndex += 1
  config.theme = themeOptions[themeIndex % 3]
  sync()
}

themer.addEventListener('click', switchTheme)

const switchDebug = () => {
  config.debug = !config.debug
  sync()
}

debug.addEventListener('click', switchDebug)
const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.debug = config.debug
}

const sync = (event) => {
  if (!document.startViewTransition) return update()
  document.startViewTransition(() => update())
}

update()
let dragger
const hider = document.querySelector('.hider')
hider.removeAttribute('popovertargetaction')
const PROXY = document.createElement('div')
const threshold = () => window.innerHeight * 0.25
const reset = () => {
  dragger[0].update()
  gsap.set(PROXY, { clearProps: 'y' })
  document.documentElement.dataset.complete = false
  document.documentElement.style.setProperty('--complete', 0)
  popover.style.setProperty('--ty', 0)
}
let distance
dragger = Draggable.create(PROXY, {
  type: 'y',
  inertia: true,
  allowContextMenu: true,
  trigger: '.hider',
  onDragStart: () => {
    reset()
    document.documentElement.dataset.dragging = true
  },
  onPressInit: () => {
    // at this point, track the size of the viewport and drawer
    distance = popover.offsetHeight
    popover.style.setProperty('--distance', distance)
    reset()
  },
  onDrag: function () {
    document.documentElement.style.setProperty('--complete', this.y / distance)
    popover.style.setProperty('--ty', this.y)
  },
  onRelease: () => {
    document.documentElement.dataset.dragging = false
  },
  onThrowUpdate: () => {
    document.documentElement.dataset.throwing = true
  },
  onThrowComplete: function () {
    document.documentElement.dataset.throwing = false
    if (this.y > threshold() || this.endY > threshold()) {
      popover.hidePopover()
    } else {
      reset()
    }
  },
  onDragEnd: function () {
    // this is your inertia ending here.
    popover.style.setProperty('--ty', this.endY)
    document.documentElement.style.setProperty(
      '--complete',
      this.endY / distance
    )

    const transitions = popover.getAnimations()
    console.info({ transitions })
    if (this.endY / distance) document.documentElement.dataset.complete = true
    const transition = transitions[0]
    const end = () => {
      document.documentElement.dataset.throwing = false
      if (this.y > threshold() || this.endY > threshold()) {
        popover.hidePopover()
      } else {
        reset()
      }
    }
    if (transition && this.isThrowing) {
      transition.finished
        .then(() => {
          end()
        })
        .catch((err) => console.info('wtu'))
    } else {
      end()
    }
  },
})

popover.addEventListener('toggle', reset)
