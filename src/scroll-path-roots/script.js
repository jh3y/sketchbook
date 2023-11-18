import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (!CSS.supports('animation-timeline: scroll()')) {
  console.info('use ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  gsap.to('.content', {
    scrollTrigger: {
      trigger: 'body',
      scrub: 0.5,
      start: "top top",
      end: window.innerHeight * 0.4,
    },
    scale: 1
  })
  gsap.to('.fillers path', {
    scrollTrigger: {
      trigger: '.content',
      scrub: 0.5,
      ease: 'power4.in',
      start: "top bottom+=20%",
      end: "bottom bottom-=50%",
    },
    strokeDashoffset: 0
  })
}