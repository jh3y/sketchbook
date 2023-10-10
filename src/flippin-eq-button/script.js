import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

gsap.registerPlugin(Flip)
gsap.registerPlugin(MorphSVGPlugin)

const BTN = document.querySelector('button')
const CANVAS = document.querySelector('canvas')
const ICON = BTN.querySelector('svg')

let playing = false

const Play = () => {
  const state = Flip.getState([BTN, CANVAS])
  CANVAS.style.width = playing ? 0 : '200px'
  gsap
    .timeline()
    .to('#status', {
      ease: 'elastic.inOut',
      morphSVG: playing ? '#play' : '#pause',
      duration: 1,
    })
    .add(Flip.from(state, { ease: 'elastic.inOut', duration: 1 }), 0)
  playing = !playing
}

BTN.addEventListener('click', Play)
