import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)

  gsap.to('header', {
    scale: 0.8,
    ease: 'power1.in',
    scrollTrigger: {
      trigger: 'header',
      scrub: true,
      start: 'center top',
      end: 'bottom top',
    }
  })
  gsap.set('header', { '--opacity': 1 })
  gsap.to('header', {
    '--opacity': 0,
    ease: 'power1.in',
    scrollTrigger: {
      trigger: 'header',
      scrub: true,
      start: 'center bottom',
      end: 'bottom bottom'
    }
  })
}