import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)
  gsap.set('section', { '--base': 0 })
  gsap.to('section', {
    '--base': 320,
    ease: 'none',
    scrollTrigger: {
      horizontal: true,
      scrub: true,
      scroller: 'ul',
    },
  })
  const ITEMS = document.querySelectorAll('li')
  ITEMS.forEach((ITEM) => {
    gsap
      .timeline()
      .set(ITEM, { '--sat': 0 })
      .to(ITEM, {
        '--sat': 100,
        scrollTrigger: {
          trigger: ITEM,
          start: 'right 75%',
          end: 'center center',
          horizontal: true,
          scrub: true,
          scroller: 'ul',
        },
      })
      .fromTo(
        ITEM,
        { '--sat': 100 },
        {
          '--sat': 0,
          scrollTrigger: {
            trigger: ITEM,
            end: 'left 25%',
            start: 'center center',
            horizontal: true,
            scrub: true,
            scroller: 'ul',
          },
        }
      )
  })
}


const syncPointer = ({ x, y }) => {
  document.documentElement.style.setProperty('--px', x.toFixed(2))
  document.documentElement.style.setProperty('--py', y.toFixed(2))
}
document.body.addEventListener('pointermove', syncPointer)