import { gsap } from 'https://cdn.skypack.dev/gsap@3.12.0'

const canvas = document.querySelector('canvas')
const shadow = document.querySelector('h1 span')

const bounds = shadow.getBoundingClientRect()

canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
const ctx = canvas.getContext('2d')
ctx.fillStyle = 'red'
ctx.font = `600 32px 'SF Pro Text', 'SF Pro Icons', 'AOS Icons', 'Helvetica Neue',
  Helvetica, Arial, sans-serif, system-ui`
ctx.textBaseline = 'middle'
ctx.textAlign = 'center'
ctx.fillText(
  'words',
  bounds.left + bounds.width * 0.5,
  bounds.top + bounds.height * 0.5
)

const words = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
]

const duration = 2
const y = 400
gsap
  .timeline()
  .to(words, {
    x: () => gsap.utils.random(-500, 500, 1),
    duration,
  })
  .to(
    words,
    {
      duration,
      y,
      ease: 'bounce.out',
    },
    '<'
  )

let count = 0
const renderWord = () => {
  console.info({ count })
  if (count >= 1000) gsap.ticker.remove(renderWord)
  else {
    for (const word of words) {
      count++
      ctx.fillStyle = `hsl(0 0% 0%)`
      ctx.fillText(
        'words',
        bounds.left + bounds.width * 0.5 + word.x,
        bounds.top + bounds.height * 0.5 + word.y
      )
    }
  }
}
gsap.ticker.add(renderWord)
