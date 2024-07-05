import { gsap } from 'https://cdn.skypack.dev/gsap@3.12.0'

// Get the serialized SVG string
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const icon = document.querySelector('.icon')
const svgData = new XMLSerializer().serializeToString(icon)

canvas.width = window.innerWidth * window.devicePixelRatio
canvas.height = window.innerHeight * window.devicePixelRatio

// Create a new Image object
const img = new Image()

// Create a Data URI for the SVG
const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
const url = URL.createObjectURL(svgBlob)

// When the image loads, draw it onto the canvas
img.onload = function () {
  // ctx.drawImage(img, window.innerWidth * 0.5, window.innerHeight * 0.5, 20, 20)
  // Release the object URL since it's no longer needed
  URL.revokeObjectURL(url)
}

// Set the image source to the Data URI
img.src = url
let parts = []

const render = () => {
  ctx.clearRect(
    0,
    0,
    window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio
  )
  for (const part of parts) {
    ctx.save()
    ctx.globalAlpha = part.alpha
    ctx.filter = `hue-rotate(${part.sy < 0 ? '150' : '0'}deg) brightness(${
      part.b
    })`

    // const x = part.x - part.size * 0.5
    // const y = part.y - part.size * 0.5
    const x = part.x
    const y = part.y
    // Rotate after translate
    ctx.translate(x, y)

    // Rotate the canvas by the specified angle (in radians)
    ctx.rotate(part.r * (Math.PI / 180))
    ctx.scale(1, part.sy)

    ctx.drawImage(
      img,
      // part.size * -0.5,
      // part.size * -0.5,
      part.size * part.scale * -0.5,
      part.size * part.scale * -0.5,
      part.size * part.scale,
      part.size * part.scale
    )
    ctx.restore()
  }
}

const paint = ({ x, y }) => {
  const newPart = {
    id: Date.now(),
    x,
    y,
    sy: Math.random() > 0.5 ? 1 : -1,
    b: gsap.utils.random(0.5, 1.5),
    r: gsap.utils.random(0, 359, 1),
    hue: gsap.utils.random(0, 359, 1),
    size: gsap.utils.random(10, 40, 1),
    scale: 1,
    alpha: 1,
  }
  const spin = gsap.to(newPart, {
    sy: newPart.sy < 0 ? 1 : -1,
    duration: gsap.utils.random(0.1, 0.5),
    repeat: gsap.utils.random(0, 10, 1),
  })
  gsap.to(newPart, {
    onComplete: () => {
      spin.kill()
      parts = parts.filter((p) => p.id !== newPart.id)
    },
    duration: gsap.utils.random(0.5, 2.5),
    r: newPart.r + gsap.utils.random(-45, 45, 1),
    y: y + gsap.utils.random(50, 350, 1),
    alpha: 0,
    scale: 0,
  })
  parts.push(newPart)
}
document.body.addEventListener('pointermove', paint)
gsap.ticker.add(render)
