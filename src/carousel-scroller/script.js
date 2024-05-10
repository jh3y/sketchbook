import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

const CONFIG = {
  debug: false,
  // spread: false,
  // zoom: false,
  backface: false,
  // rotate: false,
  buff: 2,
  animate: true,
  scroll: true,
  dark: true,
  masklower: 0.9,
  maskupper: 1.8,
  perspective: 320,
  vertical: false,
  infinite: false,
  items: 16,
  gap: 0.1,
  rotatex: 0,
  rotatez: 0,
}

const MAIN = document.querySelector('main')

const generateItems = () => {
  const items = []
  const controllers = []

  for (let i = 0; i < CONFIG.items + 1; i++) {
    // scopes.push(`--item-${i}`)
    if (i !== CONFIG.items) {
      items.push(`
        <li style="--index: ${i};">
          <img src="https://picsum.photos/300/300?random=${i}" alt="" />
        </li>
      `)
    }
    controllers.push('<li></li>')
  }

  return {
    items: items.join(''),
    controllers: controllers.join(''),
  }
}

let scroller

const handleScroll = () => {
  if (!CONFIG.infinite) return false
  if (CONFIG.vertical) {
    if (scroller.scrollTop + window.innerHeight > scroller.scrollHeight - 2) {
      scroller.scrollTop = 2
    }
    if (scroller.scrollTop < 2) {
      scroller.scrollTop = scroller.scrollHeight - 2
    }
  } else {
    if (scroller.scrollLeft + window.innerWidth > scroller.scrollWidth - 2) {
      scroller.scrollLeft = 2
    }
    if (scroller.scrollLeft < 2) {
      scroller.scrollLeft = scroller.scrollWidth - 2
    }
  }
}

const setupController = () => {
  scroller = document.querySelector('.controller')
  scroller.addEventListener('scroll', handleScroll)
}

const render = () => {
  const { controllers, items } = generateItems()
  MAIN.innerHTML = `
    <div class="container" style="--total: ${CONFIG.items};">
      <div class="carousel-container">
        <ul class="carousel">
          ${items}
        </ul>
      </div>
      <ul class="controller">
        ${controllers}
      </ul>
    </div>
  `
  setupController()
}

let tween

const update = () => {
  document.documentElement.dataset.debug = CONFIG.debug
  // document.documentElement.dataset.spread = CONFIG.spread
  // document.documentElement.dataset.zoom = CONFIG.zoom
  // document.documentElement.dataset.rotate = CONFIG.rotate
  document.documentElement.dataset.animate = CONFIG.animate
  document.documentElement.dataset.backface = CONFIG.backface
  document.documentElement.dataset.scroll = CONFIG.scroll
  document.documentElement.dataset.dark = CONFIG.dark
  document.documentElement.dataset.vertical = CONFIG.vertical
  document.documentElement.dataset.infinite = CONFIG.infinite
  document.documentElement.style.setProperty('--gap-efficient', CONFIG.gap)
  document.documentElement.style.setProperty('--rotate-x', CONFIG.rotatex)
  document.documentElement.style.setProperty('--rotate-z', CONFIG.rotatez)
  document.documentElement.style.setProperty('--mask-lower', CONFIG.masklower)
  document.documentElement.style.setProperty('--mask-upper', CONFIG.maskupper)
  document.documentElement.style.setProperty('--scroll-ratio', CONFIG.buff)
  document.documentElement.style.setProperty(
    '--perspective',
    CONFIG.perspective
  )
  // If we're scroll driving, use GSAP
  if (
    !CSS.supports('animation-timeline: scroll()') &&
    CONFIG.scroll &&
    CONFIG.animate
  ) {
    // transform: translate3d(0, 0, var(--radius)) rotateX(calc(var(--rotate-x) * 1deg)) rotateZ(calc(var(--rotate-z) * 1deg)) rotateY(-360deg);
    if (scroller) scroller[CONFIG.vertical ? 'scrollTop' : 'scrollLeft'] = 0
    document.documentElement.dataset.gsap = true
    gsap.registerPlugin(ScrollTrigger)
    gsap.set(['.carousel'], { animation: 'none', '--rotate': 0 })
    tween = gsap.to('.carousel', {
      rotateY: -360,
      '--rotate': 360,
      ease: 'none',
      scrollTrigger: {
        horizontal: !CONFIG.vertical,
        scroller: '.controller',
        scrub: true,
      },
    })
  } else {
    document.documentElement.dataset.gsap = false
    gsap.set('.carousel', { clearProps: true })
    if (tween) tween.kill()
    ScrollTrigger.killAll()
    document.querySelector('.carousel').removeAttribute('style')
  }
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    !event ||
    (event &&
      event.target.controller.view.labelElement.innerText !== 'Dark Theme' &&
      event.target.controller.view.labelElement.innerText !== 'Backface')
  )
    return update()
  document.startViewTransition(update)
}

const controlPanel = new Pane({ title: 'Config', expanded: false })

// const spreader = controlPanel.addBinding(CONFIG, 'spread', { label: 'Spread' })
// controlPanel.addBinding(CONFIG, 'zoom', { label: 'Zoom' })
// controlPanel.addBinding(CONFIG, 'rotate', { label: 'Rotate' })
controlPanel.addBinding(CONFIG, 'animate', { label: 'Animate' })
const scrolling = controlPanel.addFolder({
  title: 'Scrolling',
  expanded: false,
})
scrolling.addBinding(CONFIG, 'scroll', { label: 'Scroll Drive' })
scrolling.addBinding(CONFIG, 'vertical', { label: 'Vertical' })
scrolling.addBinding(CONFIG, 'infinite', { label: 'Infinite' })
scrolling.addBinding(CONFIG, 'buff', {
  label: 'Ratio',
  min: 1,
  max: 10,
  step: 0.1,
})
scrolling.addBinding(CONFIG, 'debug', { label: 'Debug' })
const rotation = controlPanel.addFolder({ title: 'Rotation', expanded: false })
rotation.addBinding(CONFIG, 'rotatex', {
  min: 0,
  max: 360,
  step: 1,
  label: 'X',
})
rotation.addBinding(CONFIG, 'rotatez', {
  min: 0,
  max: 360,
  step: 1,
  label: 'Z',
})
const masker = controlPanel.addFolder({ title: 'Mask', expanded: false })
masker.addBinding(CONFIG, 'masklower', {
  label: 'Lower (Item W)',
  min: 0,
  max: 5,
  step: 0.1,
})
masker.addBinding(CONFIG, 'maskupper', {
  label: 'Upper (Item W)',
  min: 0,
  max: 5,
  step: 0.1,
})

controlPanel.addBinding(CONFIG, 'backface', { label: 'Backface' })
controlPanel.addBinding(CONFIG, 'perspective', {
  label: 'Perspective (px)',
  min: 50,
  max: 1500,
  step: 1,
})
controlPanel.addBinding(CONFIG, 'gap', {
  label: 'Gap (%)',
  min: 0,
  max: 5,
  step: 0.1,
})
const itemSwitch = controlPanel.addBinding(CONFIG, 'items', {
  label: 'Items',
  min: 10,
  max: 50,
  step: 1,
})
controlPanel.addBinding(CONFIG, 'dark', { label: 'Dark Theme' })

render()
sync()

controlPanel.on('change', sync)
// spreader.on('change', render)
itemSwitch.on('change', render)

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)
}
