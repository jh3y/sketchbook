import gsap from 'gsap'
import { Pane } from 'https://cdn.skypack.dev/tweakpane'

// Code for Wave: &#128075;

const cnv = document.querySelector('canvas')
const ctx = cnv.getContext('2d')
cnv.width = ctx.width = cnv.offsetWidth
cnv.height = ctx.height = cnv.offsetHeight


const hey = ({ x, y }) => {
  console.info({ x, y })
  ctx.font = '112px sans-serif'
  // How to render unicode string such as emoji on <canvas>
  ctx.fillText(String.fromCodePoint('0x1F44B'), x - 56, y)
}

document.body.addEventListener('dblclick', hey)