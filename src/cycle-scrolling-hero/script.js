import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

if (!CSS.supports('animation-timeline: scroll()')) {
  const SPAN = 'max(45vw, 260px)'
  const CONFIG = [
    {
      x: (index, el) => {
        return Math.max(260, window.innerWidth * 0.45) * -1
      },
      y: -10,
      r: -8,
      h: 160,
      w: (index, el) => {
        return Math.max(320, el.parentNode.offsetWidthi * 0.55)
      },
    },
    {
      x: (index, el) => {
        return Math.max(260, window.innerWidth * 0.45) * 1
      },
      y: -50,
      r: 15,
      h: 360,
      w: (index, el) => {
        return Math.max(220, el.parentNode.offsetWidth * 0.3)
      },
    },
    {
      x: (index, el) => {
        return Math.max(260, window.innerWidth * 0.45) * -1
      },
      y: -30,
      r: 6,
      h: 300,
      w: (index, el) => {
        return Math.max(330, el.parentNode.offsetWidth * 0.55)
      },
    },
    {
      x: (index, el) => {
        return Math.max(260, window.innerWidth * 0.45) * 1
      },
      y: -30,
      r: -5,
      h: 400,
      w: (index, el) => {
        return Math.max(305, el.parentNode.offsetWidth * 0.45)
      },
    },
    {
      x: (index, el) => {
        return Math.max(260, window.innerWidth * 0.45) * -1
      },
      y: -45,
      r: -20,
      h: 525,
      w: (index, el) => {
        return Math.max(160, el.parentNode.offsetWidth * 0.3)
      },
    },
    {
      x: (index, el) => {
        return Math.max(260, window.innerWidth * 0.45) * 1
      },
      y: 10,
      r: 10,
      h: 160,
      w: (index, el) => {
        return Math.max(320, el.parentNode.offsetWidth * 0.55)
      },
    },
  ]

  gsap.registerPlugin(ScrollTrigger)
  console.info('gsap: ScrollTrigger registered')

  gsap.set('.hero', { position: 'absolute' })

  const cards = document.querySelectorAll('.card')

  for (const [index, card] of [...cards].entries()) {
    if (CONFIG[index]) {
      gsap.from(card, {
        x: CONFIG[index].x,
        yPercent: CONFIG[index].y,
        height: `${CONFIG[index].h}%`,
        rotate: CONFIG[index].r,
        width: CONFIG[index].w,
        scrollTrigger: {
          trigger: '.scroller',
          start: 'top bottom',
          end: 'top 50%',
          scrub: true,
        },
      })
    }
  }

  gsap.from(
    [
      '.card__content',
      '.card--two .card__column:last-of-type',
      '.card--three .card__column:last-of-type',
      '.card--five .card__column:last-of-type',
    ],
    {
      y: '-100cqh',
      scrollTrigger: {
        trigger: '.scroller',
        start: 'top 80%',
        end: 'top top',
        scrub: true,
      },
    }
  )
  gsap.from(['.card__avatar img', '.password svg'], {
    opacity: 0,
    scrollTrigger: {
      trigger: '.scroller',
      start: 'top 50%',
      end: 'top top',
      scrub: true,
    },
  })
  gsap.from(['.card--five .card__dummy', '.card--six .card__dummy'], {
    width: (index, el) => el.parentNode.offsetWidth * 0.26,
    scrollTrigger: {
      trigger: '.scroller',
      start: 'top 80%',
      end: 'top top',
      scrub: true,
    },
  })
  gsap.from(['.card--one .card__avatar', '.card--four .card__avatar'], {
    scale: 2,
    scrollTrigger: {
      trigger: '.scroller',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
    },
  })
  gsap.from('.card--two .card__avatar', {
    width: (index, el) => (Math.max(330, el.parentNode.offsetWidth * 0.55) - 32),
    borderRadius: '12px',
    height: 'calc(300cqh - 2rem)',
    scrollTrigger: {
      trigger: '.scroller',
      start: 'top bottom',
      end: 'top 20%',
      scrub: true,
    },
  })
  gsap.from('.card--six .card__column:last-of-type .card__company', {
    width: 120,
    x: '-1rem',
    scrollTrigger: {
      trigger: '.scroller',
      start: 'top bottom',
      end: 'top 20%',
      scrub: true,
    },
  })
  gsap.from('.cta', {
    scale: 1,
    scrollTrigger: {
      trigger: '.scroller',
      start: 'top bottom',
      end: 'top 20%',
      scrub: true,
    },
  })
}
