import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import Color from 'https://cdn.skypack.dev/color'

const CTRL = new Pane({ title: 'Config' })

const CONFIG = {
  darkMode: false,
  stroke: '#000',
  color: '#000',
  text: 'Take a scroll.',
  step: 5,
  leading: 0.62,
  scroll: 160,
}

const headers = document.querySelectorAll('h2')
const changeHeaders = () => {
  headers.forEach((h) => (h.innerText = CONFIG.text))
}

const TXT = CTRL.addBinding(CONFIG, 'text', { label: 'Text' })
TXT.on('change', changeHeaders)
CTRL.addBinding(CONFIG, 'stroke', { label: 'Stroke' })
CTRL.addBinding(CONFIG, 'color', { label: 'Color' })
CTRL.addBinding(CONFIG, 'leading', {
  label: 'Leading',
  min: 0.2,
  max: 2,
  step: 0.01,
})
const THEME = CTRL.addBinding(CONFIG, 'darkMode', { label: 'Dark mode' })

if (CSS.supports('animation-timeline: scroll()')) {
  const SCROLL = CTRL.addFolder({ title: 'Scroll behavior', expanded: false })
  SCROLL.addBinding(CONFIG, 'scroll', {
    label: 'Length (vh)',
    min: 140,
    max: 300,
    step: 1,
  })
  SCROLL.addBinding(CONFIG, 'step', {
    label: 'Step (%)',
    min: 1,
    max: 10,
    step: 1,
  })
}

const UPDATE = () => {
  const HSL = new Color(CONFIG.stroke).hsl()
  document.documentElement.style.setProperty(
    '--stroke',
    `${HSL.color[0]} ${HSL.color[1]}% ${HSL.color[2]}%`
  )
  document.documentElement.style.setProperty('--color', CONFIG.color)
  document.documentElement.style.setProperty('--leading', CONFIG.leading)
  document.documentElement.style.setProperty('--scroll', CONFIG.scroll)
  document.documentElement.style.setProperty('--step', CONFIG.step)
}

THEME.on('change', () => {
  document.documentElement.dataset.dark = CONFIG.darkMode
  CONFIG.stroke = CONFIG.darkMode ? '#fff' : '#000'
  CONFIG.color = CONFIG.darkMode ? '#fff' : '#000'
  CTRL.refresh()
})

CTRL.on('change', UPDATE)

UPDATE()

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)
  console.info('gsap registered')
  headers.forEach((header, index) => {
    gsap.from(header, {
      scale: 0,
      ease: 'steps(1)',
      scrollTrigger: {
        scrub: 0,
        trigger: '.scroller',
        start: 'top top',
        end: `bottom bottom+=${(headers.length - index) * 5}%`,
      },
    })
  })
}
