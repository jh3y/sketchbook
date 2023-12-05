import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (!CSS.supports('animation-timeline: view()')) {
  gsap.registerPlugin(ScrollTrigger)
  // Set up all the scroll animations with ScrollTrigger instead.
  // Blanket styles
  gsap.set('.fixed', {
    position: 'fixed',
    inset: 0,
  })
  gsap.set('.static', {
    position: 'absolute',
    inset: 0,
    zIndex: 6,
  })
  // First section
  gsap.set('section:first-of-type .fixed', {
    transformOrigin: '50% 0%',
  })
  gsap.to('section:first-of-type .fixed', {
    scale: '0.35 0.5',
    yPercent: -10,
    scrollTrigger: {
      scrub: 0.5,
      trigger: 'section:first-of-type',
      start: 'top top',
      end: 'bottom 50%'
    }
  })
  gsap.to('section:first-of-type .fixed', {
    opacity: 0,
    scrollTrigger: {
      scrub: 0.5,
      trigger: 'section:first-of-type',
      start: 'top top',
      end: 'bottom 75%'
    }
  })
  // The second section with image scaling down, etc.
  gsap.set('section:nth-of-type(2) article:first-of-type .fixed', {
    clipPath: 'ellipse(220% 200% at 50% 300%)',
    zIndex: 3,
  })
  gsap.to('section:nth-of-type(2) article:first-of-type .fixed', {
    clipPath: 'ellipse(220% 200% at 50% 175%)',
    scrollTrigger: {
      scrub: 0.5,
      trigger: 'section:nth-of-type(2) article:first-of-type',
      start: 'top bottom',
      end: 'top top',
    }
  })
  gsap.from('section:nth-of-type(2) article:first-of-type img', {
    scale: 5,
    scrollTrigger: {
      scrub: 0.5,
      trigger: 'section:nth-of-type(2) article:first-of-type',
      start: 'top bottom',
      end: 'top top',
    }
  })
  
  gsap.set('.loud-wrap', {
    clipPath: 'inset(0 0 0 0)',
    mask: 'linear-gradient(white 50%, transparent) 0 100% / 100% 200% no-repeat',
  })
  gsap.set('.text-wrap', {
    position: 'sticky',
    bottom: '4rem',
    transformOrigin: '50% 0',
  })
  gsap.from('section:nth-of-type(2) article:first-of-type h2', {
    yPercent: 100,
    scrollTrigger: {
      scrub: 0.5,
      trigger: 'section:nth-of-type(2) article:first-of-type',
      start: 'top 50%',
      end: 'top 0%',
    }
  })
  gsap.to('section:nth-of-type(2) article:first-of-type .loud-wrap', {
    maskPosition: '0 0',
    scrollTrigger: {
      scrub: 0.5,
      trigger: 'section:nth-of-type(2) article:first-of-type',
      start: 'top 50%',
      end: 'top 0%',
    }
  })
  // Blur the text on exit
  gsap.to('section:nth-of-type(2) article:first-of-type .text-wrap', {
    filter: 'blur(4rem)',
    opacity: 0,
    scrollTrigger: {
      scrub: 0.5,
      trigger: 'section:nth-of-type(2) article:first-of-type',
      start: 'bottom 60%',
      end: 'bottom 25%',
    }
  })

  // Third section
  gsap.set('section:nth-of-type(2) article:nth-of-type(2) .fixed', { zIndex: 3 })
  gsap.from('section:nth-of-type(2) article:nth-of-type(2) .fixed', {
    opacity: 0,
    scrollTrigger: {
      scrub: 0.5,
      trigger: 'section:nth-of-type(2) article:nth-of-type(2)',
      start: 'top 50%',
      end: 'top -30%',
    }
  })
  gsap.from('section:nth-of-type(2) article:nth-of-type(2) h2', {
    yPercent: 100,
    opacity: 0,
    scrollTrigger: {
      scrub: 0.5,
      trigger: 'section:nth-of-type(2) article:nth-of-type(2)',
      start: 'top 50%',
      end: 'top 25%',
    }
  })
  gsap.to('section:nth-of-type(2) article:nth-of-type(2) h2', {
    filter: 'blur(4rem)',
    color: 'transparent',
    scrollTrigger: {
      scrub: 0.5,
      trigger: 'section:nth-of-type(2) article:nth-of-type(2)',
      start: 'bottom bottom',
      end: 'bottom 50%',
    }
  })
  // Fourth
  gsap.set('.filler', {
    display: 'block',
    position: 'absolute',
    bottom: '30vh',
    padding: '1rem',
  })
  gsap.set('section:nth-of-type(2) article:nth-of-type(3)', {
    height: '400vh'
  })
  gsap.set('section:nth-of-type(2) article:nth-of-type(3) .fixed', {
    zIndex: 3
  })
  gsap.set('section:nth-of-type(2) article:nth-of-type(3) h2', {
    marginTop: '80vh'
  })
  gsap.from('section:nth-of-type(2) article:nth-of-type(3) .fixed', {
    opacity: 0,
    scrollTrigger: {
      trigger: 'section:nth-of-type(2) article:nth-of-type(3)',
      scrub: 0.5,
      start: 'top 80%',
      end: 'top top'
    }
  })
  gsap.to('section:nth-of-type(2) article:nth-of-type(3) img', {
    opacity: 0,
    scrollTrigger: {
      trigger: 'section:nth-of-type(2) article:nth-of-type(3)',
      scrub: 0.5,
      start: 'bottom bottom',
      end: 'bottom 85%'
    }
  })
  // Animate the text blocks
  const LINES = document.querySelectorAll('.text-blocks p')
  LINES.forEach((LINE, index) => {
    gsap.from(LINE, { 
      yPercent: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: 'section:nth-of-type(2) article:nth-of-type(3)',
        scrub: 0.5,
        start: `top -=${90 + (index * 10)}%`,
        end: `top -=${(100 + (index * 10))}%`,
      }
    })
  })
  gsap.to('.text-blocks', {
    opacity: 0,
    scrollTrigger: {
      trigger: 'section:nth-of-type(2) article:nth-of-type(3)',
      scrub: 0.5,
      start: 'bottom 130%',
      end: 'bottom 110%'
    }
  })
  gsap.to('.filler h2', {
    opacity: 0,
    filter: 'blur(4rem)',
    scrollTrigger: {
      trigger: 'section:nth-of-type(2) article:nth-of-type(3)',
      scrub: 0.5,
      start: 'bottom 55%',
      end: 'bottom 30%'
    }
  })
  // The last piece is unclipping the end piece
  gsap.set('section:nth-of-type(2) article:last-of-type .fixed', {
    clipPath: 'ellipse(220% 200% at 50% 300%)',
    zIndex: 5,
  })
  gsap.to('section:nth-of-type(2) article:last-of-type .fixed', {
    clipPath: 'ellipse(220% 200% at 50% 175%)',
    scrollTrigger: {
      trigger: 'section:nth-of-type(2) article:last-of-type',
      scrub: 0.5,
      start: 'top 80%',
      end: 'top 20%',
    }
  })
}