import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)
  const direction = document.querySelector('#direction')
  const items = document.querySelectorAll('a')
  const dock = document.querySelector('.dock')
  const scroller = document.querySelector('nav')
  const scrub = 0.2
  const setScrollers = (vertical = false) => {
    items.forEach((a) => {
      gsap
        .timeline()
        .fromTo(
          a,
          { scale: 1, '--blur': 0, '--parallax': 1 },
          {
            scale: 0.25,
            '--blur': 1,
            '--parallax': 0,
            scrollTrigger: {
              trigger: a,
              ease: 'power1.inOut',
              scroller,
              horizontal: !vertical,
              end: `${vertical ? 'bottom' : 'right'} 0`,
              start: `${vertical ? 'top' : 'left'} ${1.5 * 16}`,
              scrub,
            },
          }
        )
        .fromTo(
          a,
          { scale: 0.25, '--blur': 1, '--parallax': 0 },
          {
            scale: 1,
            '--blur': 0,
            '--parallax': 1,
            scrollTrigger: {
              trigger: a,
              ease: 'power1.inOut',
              scroller,
              horizontal: !vertical,
              end: `${vertical ? 'bottom' : 'right'} ${
                dock[vertical ? 'offsetHeight' : 'offsetWidth'] - 1.5 * 16
              }`,
              start: `${vertical ? 'top' : 'left'} ${
                dock[vertical ? 'offsetHeight' : 'offsetWidth']
              }`,
              scrub,
            },
          }
        )
    })
  }
  const obs = new ResizeObserver(() => {
    ScrollTrigger.killAll()
    setScrollers(direction.checked)
  })
  obs.observe(dock)

  direction.addEventListener('change', () => {
    if (direction.checked) dock.style.height = '400px'
  })
}
