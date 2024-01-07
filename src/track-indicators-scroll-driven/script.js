import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'


const INDICATORS = document.querySelector('.track__indicators')

const SHIFT = event => {
  if (event.target.tagName === 'BUTTON') {
    const TARGET = [...event.target.parentNode.children].indexOf(event.target)
    const LI = document.querySelector(`li:nth-of-type(${TARGET + 1})`)
    LI.scrollIntoView({
      behavior: 'smooth',
      inline: 'center'
    })
  }
}

INDICATORS.addEventListener('click', SHIFT)

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)

  gsap.set('.track__indicators', { aspectRatio: '7 / 1'})

  const INDICATORS = document.querySelectorAll('.indicator')
  const ARTICLES = document.querySelectorAll('li')
  INDICATORS.forEach((indicator, index) => {
    // Here need to animate the indicator based on the position of the card
    gsap.to(indicator, {
      flex: 3,
      repeat: 1,
      yoyo: true,
      scrollTrigger: {
        scrub: true,
        horizontal: true,
        trigger: ARTICLES[index],
        scroller: 'ul',
        start: "right right",
        end: "left left",
        snap: [0, 1]
      }
    })
  })

}