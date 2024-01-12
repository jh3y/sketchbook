import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)
  console.info('gsap: ScrollTrigger registered')
  /**
   * Two animations.
   * 1. Belt translation.
   * 2. Gear rotation,
   * */
  // 1. Belt translation
  const belt = document.querySelector('.belt')
  gsap.to('.belt', {
    translateY:
      (parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--gutter-size'
        ),
        10
      ) /
        6) *
      -20,
    ease: 'none',
    scrollTrigger: {
      scroller: 'body',
      scrub: true,
      start: 0,
      end: document.body.scrollHeight,
    },
  })
  // 2. Gear rotation
  gsap.to('.gears svg', {
    rotate: (index) => {
      return index === 0 ? 720 * 10 / 16 * -1 : 720
    },
    ease: 'none',
    scrollTrigger: {
      scrub: true,
      scroller: 'body',
      start: 0,
      end: document.body.scrollHeight,
    }
  })
}
