import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { to, set } = gsap

gsap.registerPlugin(ScrollTrigger)

to('.book', {
  scrollTrigger: {
    scrub: 1,
    start: () => 0,
    end: () => window.innerHeight * 0.25,
  },
  scale: 1,
})

to('.logo', {
  scrollTrigger: {
    scrub: true,
    start: () => 13.5 * (window.innerHeight * 0.25),
    end: () => 14 * (window.innerHeight * 0.25),
  },
  opacity: 1,
})

const PAGES = [...document.querySelectorAll('.book__page')]
PAGES.forEach((page, index) => {
  set(page, { z: index === 0 ? 13 : -index * 1 })
  if (index === 11) return false
  to(page, {
    rotateY: `-=${180 - index / 2}`,
    scrollTrigger: {
      scrub: 1,
      start: () => (index + 1) * (window.innerHeight * 0.25),
      end: () => (index + 2) * (window.innerHeight * 0.25),
    },
  })
  to(page, {
    z: index === 0 ? -13 : index,
    scrollTrigger: {
      scrub: 1,
      start: () => (index + 1) * (window.innerHeight * 0.25),
      end: () => (index + 1.5) * (window.innerHeight * 0.25),
    },
  })
})
