import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)
  console.info('gsap: ScrollTrigger registered')
  const swappers = document.querySelectorAll('.swapper')

  const handleTranslation = (swapper) => {
    const controller = swapper.parentNode.querySelector('.controller')
    gsap.to(swapper, {
      y: controller.offsetHeight - swapper.offsetHeight,
      scrollTrigger: {
        trigger: swapper.parentNode,
        scrub: true,
        start: 'top center',
        end: 'bottom center',
      },
    })
  }
  const handleCrossFade = (swapper, mobile = false) => {
    const img = swapper.querySelectorAll('img')
    const trigger = mobile ? swapper : swapper.parentNode
    gsap.to(img, {
      opacity: (index) => (index === 0 ? 1 : 0),
      scrollTrigger: {
        trigger,
        scrub: true,
        start: `top center${mobile ? '' : '-=25%'}`,
        end: `bottom center${mobile ? '' : '+=25%'}`,
      },
    })
  }
  const handleProgress = (swapper, mobile = false) => {
    const progress = swapper.querySelectorAll('.progress')
    const trigger = mobile ? swapper : swapper.parentNode
    gsap.to(progress, {
      '--flip': 1,
      scrollTrigger: {
        trigger,
        scrub: true,
        start: 'center center',
        end: 'center center',
      },
    })
    const markers = swapper.querySelectorAll('.progress > div div')
    markers.forEach((marker, index) => {
      gsap.to(marker, {
        height: '100%',
        scrollTrigger: {
          trigger,
          scrub: true,
          start: index === 0 ? 'center center+=50%' : 'center center',
          end: index === 0 ? 'center center' : 'center center-=50%',
        },
      })
    })
  }

  ScrollTrigger.matchMedia({
    '(max-width: 767px)': function () {
      swappers.forEach((swapper) => {
        handleCrossFade(swapper, true)
        handleProgress(swapper, true)
      })
    },
    '(min-width: 768px)': function () {
      swappers.forEach((swapper) => {
        handleTranslation(swapper)
        handleCrossFade(swapper)
        handleProgress(swapper)
      })
    },
  })
}
