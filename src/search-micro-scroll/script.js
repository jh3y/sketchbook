import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (!CSS.supports('animation-timeline: scroll();')) {
  gsap.registerPlugin(ScrollTrigger);
  const HEADER = document.querySelector('header')
  gsap.to('.search-controls', {
    width: HEADER.offsetWidth - 66,
    scrollTrigger: {
      scrub: 0.25,
      ease: 'none',
      start: 0,
      end: HEADER.offsetHeight
    }
  })
  gsap.to('header a svg', {
    yPercent: -25,
    opacity: 0,
    scrollTrigger: {
      scrub: 0.25,
      ease: 'none',
      start: 0,
      end: HEADER.offsetHeight
    }
  })
  gsap.to('.search-wrapper', {
    boxShadow: '0 5px 10px hsl(0 0% 0%)',
    scrollTrigger: {
      scrub: 0.25,
      ease: 'none',
      start: 0,
      end: HEADER.offsetHeight
    }
  })
  gsap.to('.header-wrapper', {
    background: 'var(--bg)',
    scrollTrigger: {
      scrub: 0.25,
      ease: 'none',
      start: 0,
      end: HEADER.offsetHeight
    }
  })
  gsap.to('.sneaky-bear', {
    transform: 'rotate(90deg) translateX(calc(var(--header-height) * 0.125)) translateY(50%)',
    scrollTrigger: {
      scrub: 0.25,
      ease: 'none',
      start: HEADER.offsetHeight,
      end: HEADER.offsetHeight * 2
    }
  })
}