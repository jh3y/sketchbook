import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

// const section = document.querySelector('.reader')
// const srOnly = document.querySelector('.sr-only')
const toSplit = document.querySelector('[data-split]')
const content = toSplit.innerText
const contentLength = content.length

const PPC = 10 // Pixels per character...
const BUFFER = 40
/**
 * Iterate over the words.
 * Add them in creating start and finish indexes for them.
 * */
// section.style.height = `${
//   PPC * (contentLength + 2) + window.innerHeight + 8 * BUFFER
// }px`

document.documentElement.style.setProperty('--buffer', BUFFER)
document.documentElement.style.setProperty('--ppc', PPC)
document.documentElement.style.setProperty('--pad', 8)
document.documentElement.style.setProperty('--content-length', contentLength + 2)

const words = toSplit.innerText.split(' ')
toSplit.innerHTML = ''
// toSplit.style.setProperty('--ppc', PPC)
let cumulation = 10
words.forEach((word, index) => {
  const text = Object.assign(document.createElement('span'), {
    innerHTML: `<span>${word} </span>`,
    style: `
      --index: ${index};
      --start: ${cumulation};
      --end: ${cumulation + word.length};
    `,
  })
  text.dataset.index = index
  text.dataset.start = cumulation
  text.dataset.end = cumulation + word.length
  cumulation += word.length + 1
  toSplit.appendChild(text)
})

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)
  console.info('GSAP ScrollTrigger: Registered')
  // Animate the words
  for (const word of toSplit.children) {
    gsap.fromTo(
      word,
      {
        '--active': 0,
      },
      {
        '--active': 1,
        ease: 'steps(1)',
        scrollTrigger: {
          trigger: '.reader',
          start: `top top-=${word.dataset.start * PPC}`,
          end: `top top-=${word.dataset.end * PPC}`,
          scrub: true,
        },
      }
    )
  }
  // Animate the header
  gsap.to('header', {
    scale: 0.8,
    scrollTrigger: {
      trigger: 'header',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
  // Animate the signature
  gsap.fromTo('.sig .sign', {
    '--draw': 1.025
  }, {
    '--draw': 0,
    scrollTrigger: {
      trigger: 'body > section:last-of-type',
      scrub: 0.2,
      start: 'top 75%',
      end: 'bottom 150%'
    }
  })
  gsap.fromTo('.sig .ear', {
    '--draw': 1.025
  }, {
    '--draw': 0,
    scrollTrigger: {
      trigger: 'body > section:last-of-type',
      scrub: 0.2,
      start: 'bottom 130%',
      end: 'bottom 100%'
    }
  })
  gsap.fromTo('.sig .eye', {
    '--draw': 1.025,
    fill: 'transparent',
  }, {
    '--draw': 0,
    fill: 'canvasText',
    scrollTrigger: {
      trigger: 'body > section:last-of-type',
      scrub: 0.2,
      start: 'bottom 130%',
      end: 'bottom 100%'
    }
  })
  gsap.fromTo('.sig .nose', {
    '--draw': 1.025,
    fill: 'transparent',
  }, {
    '--draw': 0,
    fill: 'canvasText',
    scrollTrigger: {
      trigger: 'body > section:last-of-type',
      scrub: 0.2,
      start: 'bottom 120%',
      end: 'bottom 100%'
    }
  })
}

// Theme toggling
const TOGGLE = document.querySelector(".theme-toggle");

const SWITCH = () => {
  const isDark = TOGGLE.matches("[aria-pressed=true]") ? false : true;
  TOGGLE.setAttribute("aria-pressed", isDark);
  document.documentElement.dataset.theme = isDark ? 'light' : 'dark'
}

const TOGGLE_THEME = () => {
  if (!document.startViewTransition) SWITCH()
  document.startViewTransition(SWITCH)
};

document.documentElement.dataset.theme = 'dark'
TOGGLE.addEventListener("click", TOGGLE_THEME);