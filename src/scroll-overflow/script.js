import gsap from 'https://cdn.skypack.dev/gsap'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.set('.stacked__block', {
  xPercent: 80,
  yPercent: -690,
  rotate: 54,
  '--alpha': 0,
})

const MAIN = gsap.timeline({
  paused: true
})

const stagger = 0.1
const getStack = () =>
  gsap
    .timeline({
      paused: false,
    })
    .set('.stacked__block', {
      xPercent: 80,
      yPercent: -690,
      rotate: 54,
      // scale: 0,
      '--alpha': 0,
    })
    .to(
      '.stacked__block',
      {
        scale: 1,
        '--alpha': 1,
        stagger,
        duration: 0.05,
      },
      0
    )
    .to(
      '.stacked__block',
      {
        stagger,
        xPercent: 0,
        duration: 0.5,
        ease: 'power4.out',
      },
      0
    )
    .to(
      '.stacked__block',
      {
        duration: 0.5,
        stagger,
        rotate: 0,
      },
      0
    )
    .to(
      '.stacked__block',
      {
        duration: 0.5,
        stagger,
        yPercent: 100,
      },
      0
    )
    .to(
      '.stacked__block',
      {
        '--alpha': 0,
        stagger,
        duration: 0.05,
      },
      0.5
    )

MAIN.add(getStack(), 0)

const SCRUB = gsap.timeline({
  paused: true,
  repeat: -1,
})
  .fromTo(MAIN, {
    totalTime: 0.5
  }, {
    totalTime: 1,
    duration: 2,
    ease: 'none'
  })


gsap.set('.scene', {
  display: 'block',
})


document.documentElement.scrollTop = 2
document.body.scrollTop = 2


ScrollTrigger.create({
  trigger: 'body',
  start: 1,
  end: 'bottom bottom',
  onLeaveBack: () => {
    document.body.scrollTop = document.body.scrollHeight - window.innerHeight - 2
    document.documentElement.scrollTop = document.body.scrollHeight - window.innerHeight - 2
  },
  onLeave: () => {
    document.documentElement.scrollTop = 2
    document.body.scrollTop = 2

  },
  onUpdate: self => {
    SCRUB.progress(self.progress)
  },
})