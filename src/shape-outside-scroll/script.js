import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

if (!CSS.supports('animation-timeline: scroll()')) {
  console.info('gsap: ScrollTrigger registered')
  gsap.registerPlugin(ScrollTrigger)

  const mm = gsap.matchMedia()
  
  const scrollConfig = {
    trigger: '.scroller',
    scrub: 1,
    start: 'top top',
    end: 'bottom bottom'
  }

  mm.add('(max-width: 768px)', () => {
    gsap.set('.outside', {
      shapeOutside: 'circle(50px at var(--x) 200%)'
    })
    gsap.to('.outside', {
      shapeOutside: 'circle(50px at var(--x) -50%)',
      scrollTrigger: scrollConfig
    })

  })

  mm.add('(min-width: 768px)', () => {
    gsap.set('.outside', {
      shapeOutside: 'circle(100px at var(--x) 200%)'
    })
    gsap.to('.outside', {
      shapeOutside: 'circle(100px at var(--x) -50%)',
      scrollTrigger: scrollConfig
    })

  })

  // Apply the styling.
  gsap.set('.content', { position: 'sticky', top: 0 })
  gsap.set('.scroller', { minHeight: '300vh' })

  // ScrollTrigger based on the position of '.scroller'
  gsap.set('.balloon', { top: '200%' })
  gsap.set('.column:last-of-type .outside', { '--x': 0 })
  gsap.set('.column:first-of-type .outside', { '--x': '100%' })
  gsap.to('.balloon', {
    top: '-50%',
    scrollTrigger: scrollConfig
  })

}