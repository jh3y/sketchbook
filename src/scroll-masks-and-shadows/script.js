import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

const CONFIG = {
  style: 'opening',
  light: false,
  height: 12,
  opacity: 0.5,
}

const CTRL = new Pane('Config')

CTRL.addBinding(CONFIG, 'style', {
  options: { indicator: 'indicator', shadow: 'shadow', mask: 'mask', opening: 'opening' },
})

const height = CTRL.addBinding(CONFIG, 'height', { min: 0, max: 20, step: 1, label: 'size (px)'})
const alpha = CTRL.addBinding(CONFIG, 'opacity', { min: 0, max: 1, step: 0.01, label: 'alpha'})
height.hidden = true
alpha.hidden = true
const light = CTRL.addBinding(CONFIG, 'light', { label: 'light mode'})

const update = () => {
  document.documentElement.dataset.style = CONFIG.style
  document.documentElement.dataset.light = CONFIG.light
  document.documentElement.style.setProperty('--shadow-alpha', CONFIG.opacity)
  document.documentElement.style.setProperty('--shadow-height', CONFIG.height)
  height.hidden = alpha.hidden = CONFIG.style === 'opening' || CONFIG.style === 'shadow' ? false : true
}

CTRL.on('change', () => {
  if (!document.startViewTransition) return update()
  document.startViewTransition(update)
})
update()

if (!CSS.supports('animation-timeline: scroll()')) {
  console.info('falling back to GSAP')
  gsap.registerPlugin(ScrollTrigger)
  const scroller = document.querySelector('.scroller')

  // In GSAP, jus' gonna do a scroll custom property based on the distance
  ScrollTrigger.create({
    scroller,
    scrub: true,
    start: 0,
    end: 16,
    ease: 'none',
    trigger: 'article',
    onUpdate: function(self) {
      scroller.style.setProperty('--scroll-progress-top', self.progress * 100)
    }
  })

  ScrollTrigger.create({
    scroller,
    trigger: 'article',
    scrub: true,
    ease: 'none',
    start: () => {
      return ScrollTrigger.maxScroll(scroller) - 16
    },
    end: () => {
      return ScrollTrigger.maxScroll(scroller)
    },
    onUpdate: function(self) {
      scroller.style.setProperty('--scroll-progress-bottom', self.progress * 100)
    }
  })

  const obs = new ResizeObserver(ScrollTrigger.refresh)
  obs.observe(scroller)

}