import gsap from 'gsap'
import { Pane } from 'https://cdn.skypack.dev/tweakpane'

const cnv = document.querySelector('canvas')
cnv.showPopover()
const ctx = cnv.getContext('2d')
cnv.width = ctx.width = cnv.offsetWidth
cnv.height = ctx.height = cnv.offsetHeight

const hey = ({ x, y }) => {
  ctx.font = '112px sans-serif'
  // How to render unicode string such as emoji on <canvas>
  // ctx.fillText(String.fromCodePoint('0x1F44B'), x - 56, y)
  ctx.fillText('👋', x - 56, y)
}

document.body.addEventListener('dblclick', hey)

// Radial menu
const onActive = () => console.info('activated')
const useContextHold = () => {
  // set up
  const close = () => {
    window.removeEventListener('pointerup', close)
  }
  const open = (event) => {
    if (event.buttons === 2) {
      // Enter context mode

      window.addEventListener('pointerup', close)
    }
  }
  window.addEventListener('contextmenu', (e) => e.preventDefault())
  window.addEventListener('pointerdown', open)
}

useContextHold({ onActive })
