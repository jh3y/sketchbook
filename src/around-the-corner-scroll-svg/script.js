// import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
// import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const scroller = document.querySelector('.scroller')
const list = scroller.querySelector('ul')
const bar = scroller.querySelector('.scroller__bar')
const track = scroller.querySelector('.bar__track')
const thumb = bar.querySelector('.bar__thumb')
const styles = scroller.querySelector('style')

const CONFIG = {
  show: true,
  radius: 32,
  scrollPadding: 100,
  stroke: 7,
  inset: 4,
  trail: 0,
  track: true,
  thumb: 80,
  finish: 5,
  alpha: 0.75,
  track: 0,
  cornerLength: 0,
}

/**
 * Set up a ResizeObserver that syncs the SVG path and viewBox
 * with the size of the scroller. If you have a static sized scroller
 * and radius, etc. You can take a snapshot of it and use it over and over.
 * The ResizeObserver is mainly for demo purposes so you can make what you
 * want.
 * */
const syncBar = (scrollerBar) => {
  const mid = CONFIG.radius
  const innerRad = Math.max(
    0,
    CONFIG.radius - (CONFIG.inset + CONFIG.stroke * 0.5)
  )
  const padTop = CONFIG.inset + CONFIG.stroke * 0.5
  const padLeft = CONFIG.radius * 2 - padTop
  bar.setAttribute(
    'viewBox',
    `0 0 ${CONFIG.radius * 2} ${scrollerBar.target.offsetHeight}`
  )
  scroller.style.setProperty('--stroke-width', CONFIG.stroke)
  let d = `
  M${mid - CONFIG.trail},${padTop}
    ${innerRad === 0 ? `` : `L${mid},${padTop}`}
    ${
      innerRad === 0
        ? `L${padLeft},${padTop}`
        : `a${innerRad},${innerRad} 0 0 1 ${innerRad} ${innerRad}`
    }`
  thumb.setAttribute('d', d)
  const cornerLength = Math.ceil(thumb.getTotalLength())
  CONFIG.cornerLength = cornerLength
  d = `
    M${mid - CONFIG.trail},${padTop}
    ${innerRad === 0 ? `` : `L${mid},${padTop}`}
    ${
      innerRad === 0
        ? `L${padLeft},${padTop}`
        : `a${innerRad},${innerRad} 0 0 1 ${innerRad} ${innerRad}`
    }
    L${padLeft},${
    scrollerBar.target.offsetHeight -
    (CONFIG.inset + CONFIG.stroke * 0.5 + innerRad)
  }
    ${
      innerRad === 0
        ? `L${padLeft},${
            scrollerBar.target.offsetHeight -
            (CONFIG.inset + CONFIG.stroke * 0.5)
          }`
        : `a${innerRad},${innerRad} 0 0 1 ${-innerRad} ${innerRad}`
    }
    L${mid - CONFIG.trail},${
    scrollerBar.target.offsetHeight - (CONFIG.inset + CONFIG.stroke * 0.5)
  }
  `
  thumb.setAttribute('d', d)
  track.setAttribute('d', d)
  scroller.style.setProperty(
    '--track-length',
    Math.ceil(track.getTotalLength())
  )
  scroller.style.setProperty('--track-start', cornerLength)
  scroller.style.setProperty('--start', CONFIG.thumb * 2 + cornerLength)
  scroller.style.setProperty(
    '--destination',
    Math.ceil(track.getTotalLength()) - cornerLength + CONFIG.thumb
  )
  styles.innerHTML = `
    @keyframes scroll {
      0% { stroke-dashoffset: ${CONFIG.thumb - CONFIG.finish}; }
      ${Math.floor(
        (CONFIG.scrollPadding / (list.scrollHeight - scroller.offsetHeight)) *
          100
      )}% { stroke-dashoffset: ${(cornerLength) * -1};}
      ${100 - Math.floor(
        (CONFIG.scrollPadding / (list.scrollHeight - scroller.offsetHeight)) *
          100
      )}% { stroke-dashoffset: ${(Math.floor(track.getTotalLength()) - cornerLength - CONFIG.thumb) * -1};}
      100% { stroke-dashoffset: ${(Math.floor(track.getTotalLength()) - CONFIG.finish) * -1}; }
    }
  `
}
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    syncBar(entry)
    update()
    configureTimeline()
  }
})
resizeObserver.observe(scroller)

let tl
const configureTimeline = () => {
  const frameOne = `${Math.floor(
    (CONFIG.scrollPadding / (list.scrollHeight - scroller.offsetHeight)) *
      100
  )}%`
  const frameTwo = `${100 - Math.floor(
        (CONFIG.scrollPadding / (list.scrollHeight - scroller.offsetHeight)) *
          100
      )}%`
  if (tl) tl.kill()
  tl = gsap.to('.bar__thumb', {
    scrollTrigger: {
      scroller: list,
      scrub: true,
    },
    ease: 'none',
    keyframes: {
      "0%":   { strokeDashoffset: CONFIG.thumb - CONFIG.finish },
      [frameOne]: { strokeDashoffset: CONFIG.cornerLength * -1 },
      [frameTwo]: { strokeDashoffset: (Math.floor(track.getTotalLength()) - CONFIG.cornerLength - CONFIG.thumb) * -1 },
      "100%": { strokeDashoffset: (Math.floor(track.getTotalLength()) - CONFIG.finish) * -1 },
    },
  })
}

/**
 * Use dat.gui to show off the configurability of things
 * */
const CTRL = new GUI({ width: 320 })
CTRL.add(CONFIG, 'show').name('Rounded Scrollbar').onChange(() => {
  document.documentElement.toggleAttribute('data-rounded-scroll')
})
if (CONFIG.show) document.documentElement.toggleAttribute('data-rounded-scroll')
const configFolder = CTRL.addFolder('Config')
const update = () => {
  scroller.style.setProperty('--radius', CONFIG.radius)
  scroller.style.setProperty('--padding', CONFIG.scrollPadding)
  scroller.style.setProperty('--thumb-size', CONFIG.thumb)
  scroller.style.setProperty('--bar-alpha', CONFIG.alpha)
  scroller.style.setProperty('--track-alpha', CONFIG.track)
  scroller.style.setProperty(
    '--destination',
    Math.ceil(track.getTotalLength()) -
      ((Math.ceil(track.getTotalLength()) - scroller.offsetHeight) * 0.5 +
        CONFIG.inset)
  )
  scroller.style.setProperty('--start', CONFIG.thumb * 2)
  syncBar({ target: scroller })
}
configFolder.add(CONFIG, 'radius', 2, 64, 1).name('Radius (px)').onChange(update)
configFolder.add(CONFIG, 'scrollPadding', 10, 200, 1)
  .name('Scroll Padding (px)')
  .onChange(update)
configFolder.add(CONFIG, 'stroke', 1, 20, 1).name('Thickness (px)').onChange(update)
configFolder.add(CONFIG, 'inset', 0, 20, 1).name('Inset (px)').onChange(update)
configFolder.add(CONFIG, 'trail', 0, 50, 1).name('Trail (px)').onChange(update)
configFolder.add(CONFIG, 'thumb', 20, 200, 1).name('Thumb Size (px)').onChange(update)
configFolder.add(CONFIG, 'finish', 5, 50, 1).name('Thumb Finish (px)').onChange(update)
configFolder.add(CONFIG, 'alpha', 0.1, 1, 0.01).name('Thumb Alpha').onChange(update)
configFolder.add(CONFIG, 'track', 0, 1, 0.01).name('Track Alpha').onChange(update)
syncBar({ target: scroller })
update()


if (!CSS.supports('(animation-timeline: scroll())')) {
  gsap.registerPlugin(ScrollTrigger)
  configureTimeline()
}