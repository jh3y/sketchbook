import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)
  console.info("GSAP ScrollTrigger: Registered")


  gsap.to('.scene__jump', {
    scrollTrigger: {
      trigger: '.laptop',
      scrub: true,
      start: 'top -25%',
      end: 'top -100%',
    },
    keyframes: {
      "0%":   { z: 0 },
      "50%":  { z: '30vmin' },
      "100%": { z: 0 },
    },
    ease: 'none' // ease the entire keyframe block
  })
}