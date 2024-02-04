import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger';

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)


  const attrs = gsap.utils.toArray('.attribute')
  const dx = [-100, 80, -40, 10, 80, -120]
  const dy = [-50, 20, -150, -120, -80, 40]
  const dr = [-190, 200, 60, -290, 230, -540]

  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    gsap.fromTo(attr, {
      '--dx': '0',
      '--dy': '0',
      '--dr': '0'
    }, {
      '--dx': `${dx[i]}vw`,
      '--dy': `${dy[i]}vh`,
      '--dr': `${dr[i]}deg`,
      scrollTrigger: {
        trigger: 'header',
        scrub: 0.5,
        start: 'top top',
        end: 'bottom top'
      }
    })
  }

}