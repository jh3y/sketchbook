// Nope... Unless it isn't supported...
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

if (!CSS.supports('animation-timeline: scroll()') && matchMedia('(prefers-reduced-motion: no-preference)')) {
  gsap.registerPlugin(ScrollTrigger)

  const scrub = 0.5
  const trigger = 'main'

  gsap.set('p > span', {
    '--progress': 0,
    backgroundPositionX: 'calc(-200vmax + (var(--progress) * 200vmax)), calc(-200vmax + (var(--progress) * 200vmax)), 0',
    color: 'transparent',
  })
  gsap.to('p > span', {
    '--progress': 1,
    scrollTrigger: {
      trigger,
      scrub,
      start: 'top top',
      end: 'top top-=75%'
    }
  })
  gsap.to('p > span', {
    color: 'white',
    scrollTrigger: {
      trigger,
      scrub,
      start: 'top top-=75%',
      end: 'bottom bottom'
    }
  })
}