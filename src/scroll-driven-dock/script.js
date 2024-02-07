import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

if (!CSS.supports('animation-timeline: scroll()')) {

  console.info({ ScrollTrigger })

  gsap.registerPlugin(ScrollTrigger)

  const items = document.querySelectorAll('a')
  const dock = document.querySelector('.dock')
  const scroller = document.querySelector('nav')
  items.forEach((a) => {
    console.info({ a })
    gsap.set(a, { scale: 0 })
    gsap.to(a, {
      scale: 1,
      scrollTrigger: {
        trigger: a,
        invalidateOnRefresh: true,
        ease: 'power1.inOut',
        scroller,
        horizontal: true,
        end: `right ${dock.offsetWidth - 100}`,
        start: `right ${dock.offsetWidth}`,
        scrub: 0.25,
      }
    })
    // gsap.to(a, {
    //   scale: 0,
    //   scrollTrigger: {
    //     trigger: a,
    //     ease: 'power1.inOut',
    //     scroller: 'nav',
    //     horizontal: true,
    //     start: 'left center',
    //     end: 'left right',
    //     scrub: 0.25,
    //   }
    // })
    // gsap.to(a, {
    //   scale: 0,
    //   scrollTrigger: {
    //     trigger: a,
    //     ease: 'power1.inOut',
    //     scroller: 'nav',
    //     horizontal: true,
    //     start: 'center left',
    //     end: 'right left',
    //     scrub: 0.5,
    //   }
    // })
  })
  dock.addEventListener('resize', console.info)
}
