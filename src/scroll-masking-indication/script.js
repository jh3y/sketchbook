import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

const CONFIG = {
  size: 120,
  trigger: false,
  bar: true,
  range: 120,
  light: false,
}

const CTRL = new Pane({ title: 'Config', expanded: false })
CTRL.addBinding(CONFIG, 'size', { label: 'Mask Size', min: 1, max: 500, step: 1})
CTRL.addBinding(CONFIG, 'range', { label: 'Mask Range', min: 1, max: 500, step: 1})
CTRL.addBinding(CONFIG, 'bar', { label: 'Mask Bar' })
CTRL.addBinding(CONFIG, 'trigger', { label: 'Trigger'})
CTRL.addBinding(CONFIG, 'light', { label: 'Light Mode'})

const update = () => {
  ScrollTrigger.refresh()
  document.documentElement.dataset.light = CONFIG.light
  document.documentElement.dataset.trigger = CONFIG.trigger
  document.documentElement.dataset.maskBar = CONFIG.bar
  document.documentElement.style.setProperty('--mask-size', CONFIG.size)
  document.documentElement.style.setProperty('--mask-range', CONFIG.range)
}

CTRL.on('change', (event) => {
  if (!document.startViewTransition || event.target.controller.view.labelElement.innerText !== 'Light Mode') return update()
  document.startViewTransition(update)
})
update()

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)
  const scroller = document.querySelector('.scroller')
  const sig = document.querySelector('.sig')

  // In GSAP, jus' gonna do a scroll custom property based on the distance
  ScrollTrigger.create({
    scroller,
    scrub: true,
    start: 0,
    end: () => CONFIG.range,
    ease: 'none',
    trigger: 'article',
    onUpdate: (self) => {

      scroller.style.setProperty('--scroll-progress-top', CONFIG.trigger ? Math.floor(self.progress) * 100 : self.progress * 100)
    }
  })

  ScrollTrigger.create({
    scroller,
    trigger: 'article',
    scrub: true,
    ease: 'none',
    start: () => {
      return ScrollTrigger.maxScroll(scroller) - (CONFIG.range * 1)
    },
    end: () => {
      return ScrollTrigger.maxScroll(scroller)
    },
    onUpdate: (self) => {
      scroller.style.setProperty('--scroll-progress-bottom', CONFIG.trigger ? Math.ceil(self.progress) * 100 : self.progress * 100)
    }
  })

  gsap.fromTo('.sig path', {
    '--draw': 1.025,
  }, {
    '--draw': 0,
    scrollTrigger: {
      trigger: sig,
      // scrub: true,
      scroller,
      toggleActions: 'play reset play reset',
      // start: `top bottom-=${sig.getBoundingClientRect().height * 0.5}`,
      start: `top bottom-=${sig.getBoundingClientRect().height * 0.5}`,
    }
  })

  const obs = new ResizeObserver(ScrollTrigger.refresh)
  obs.observe(scroller)

}