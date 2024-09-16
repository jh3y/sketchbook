import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import Matter from 'https://cdn.skypack.dev/matter-js'
import Splitting from 'https://cdn.skypack.dev/splitting'

const config = {
  debug: false,
  theme: 'system',
  x: 0,
  y: 0.25,
  scale: 0.01,
  blockCount: 35,
}
const content = document.querySelector('.content')
const icons = {}
function loadSVGs(svgElements) {
  // Return a Promise that resolves when all SVG elements are loaded
  return Promise.allSettled(
    svgElements.map(
      (svg) =>
        new Promise((resolve, reject) => {
          const svgData = new XMLSerializer().serializeToString(svg)
          const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8',
          })
          const url = URL.createObjectURL(svgBlob)

          const img = new Image()
          img.onload = () => {
            URL.revokeObjectURL(url) // Clean up after load
            const path = svg.querySelector('path')
            const title = svg.querySelector('title').innerHTML
            config[title] =
              title === 'X' || title === 'Twitter' || title === 'Threads'
            const vertices = Matter.Svg.pathToVertices(path)
            icons[title] = {
              img,
              svg,
              vertices,
            }
            resolve(true) // Resolve promise with the loaded image
          }
          img.onerror = reject // Reject promise if an error occurs
          img.src = url
        })
    )
  )
}

// Example usage:
const svgElements = Array.from(document.querySelectorAll('.icons svg'))
await loadSVGs(svgElements)

Splitting()
const DPR = window.devicePixelRatio
const thickness = window.innerWidth

const engine = Matter.Engine.create({
  render: {
    options: {
      pixelRatio: DPR,
    },
  },
})
engine.gravity.x = config.x
engine.gravity.y = config.y
engine.gravity.scale = config.scale

const wordBodies = []

const blockBodies = []
// Kick off the render...
let frame = 0
const buffer = 12

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.debug = config.debug
  document.documentElement.dataset.theme = config.theme
  engine.gravity.x = config.x
  engine.gravity.y = config.y
  engine.gravity.scale = config.scale
}

const sync = (event) => {
  if (!event.last) return
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'debug', {
  label: 'Debug',
})

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.on('change', sync)
update()

const createBlocks = () => {
  blockBodies.length = 0
  for (let i = 0; i < config.blockCount; i++) {
    const blockSize = 24
    const allowed = Object.keys(icons).filter((i) => config[i])
    const icon = icons[allowed[gsap.utils.random(0, allowed.length - 1, 1)]]
    const vertices = icon.vertices

    // console.info({ path, vertices })
    // const newBlock = Matter.Bodies.rectangle(
    //   Math.random() * (window.innerWidth * 0.5),
    //   Math.random() * (window.innerHeight * -0.2) - blockSize,
    //   blockSize,
    //   blockSize,
    //   {
    //     icon,
    //     angle: gsap.utils.random(0, 359),
    //     w: blockSize,
    //     h: blockSize,
    //     fill: `hsl(${Math.random() * 359} 80% 80%)`,
    //   }
    // )
    //
    const contentBounds = content.getBoundingClientRect()
    const scale = gsap.utils.random(1.25, 4)
    const newBlock = Matter.Bodies.fromVertices(
      Math.random() * (window.innerWidth * 0.5),
      Math.random() * (window.innerHeight * -0.2) - blockSize * scale,
      vertices,
      {
        icon,
        restitution: Math.random(),
        angle: gsap.utils.random(0, 359),
        w: blockSize,
        h: blockSize,
        scale,
        fill: `hsl(${Math.random() * 359} 80% 80%)`,
      }
    )
    Matter.Body.scale(newBlock, scale, scale)
    blockBodies.push(newBlock)
  }
}
createBlocks()

const newBlocksPlease = (event) => {
  if (!event.last) return
  blockBodies.map((b) => {
    Matter.Composite.remove(engine.world, b)
    // Matter.Body.setPosition(b, {
    //   x: Math.random() * (window.innerWidth * 0.5),
    //   y: Math.random() * (window.innerHeight * -0.2) - blockSize,
    // })
    // b.__added = false
  })
  blockBodies.length = 0
  createBlocks()
}

const iconsFolder = ctrl.addFolder({ title: 'Icons', expanded: false })
for (const icon of Object.keys(icons)) {
  iconsFolder.addBinding(config, icon, {
    label: icon,
  })
}
iconsFolder.on('change', newBlocksPlease)

for (const elem of document.querySelectorAll('.word')) {
  const bounds = elem.getBoundingClientRect()

  const newBody = Matter.Bodies.rectangle(
    bounds.x + bounds.width * 0.5,
    bounds.y + bounds.height * 0.5 + window.scrollY,
    bounds.width,
    bounds.height,
    {
      elem,
      isStatic: true,
    }
  )
  wordBodies.push(newBody)
}

const syncWords = () => {
  for (const body of wordBodies) {
    const bounds = body.elem.getBoundingClientRect()
    Matter.Body.setPosition(body, {
      x: bounds.x + bounds.width * 0.5,
      y: bounds.y + bounds.height * 0.5 + window.scrollY,
    })
    Matter.Body.set(body, {
      width: bounds.width,
      height: bounds.height,
    })
  }
}
syncWords()

const ceiling = Matter.Bodies.rectangle(
  window.innerWidth * 0.5,
  window.innerHeight * -1 - thickness * 0.5,
  window.innerWidth * 10,
  thickness,
  {
    isStatic: true,
  }
)
const ground = Matter.Bodies.rectangle(
  window.innerWidth * 0.5,
  window.innerHeight + thickness * 0.5,
  window.innerWidth * 10,
  thickness,
  {
    isStatic: true,
  }
)
const wallRight = Matter.Bodies.rectangle(
  window.innerWidth + thickness * 0.5,
  0,
  thickness,
  window.innerHeight * 10,
  {
    isStatic: true,
  }
)
const wallLeft = Matter.Bodies.rectangle(
  thickness * -0.5,
  0,
  thickness,
  window.innerHeight * 10,
  {
    isStatic: true,
  }
)

const syncWalls = () => {
  Matter.Body.setPosition(ground, {
    x: window.innerWidth * 0.5,
    y: window.innerHeight + thickness * 0.5,
  })

  Matter.Body.setPosition(ceiling, {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * -1 - thickness * 0.5,
  })
  Matter.Body.setPosition(wallRight, {
    x: window.innerWidth + thickness * 0.5,
    y: 0,
  })
}

// Add the dragging
const mouseConstraint = Matter.MouseConstraint.create(engine, {
  element: document.documentElement,
})

// Remove the scroll interception so we can scroll past
mouseConstraint.mouse.element.removeEventListener(
  'wheel',
  mouseConstraint.mouse.mousewheel
)
mouseConstraint.mouse.element.removeEventListener(
  'DOMMouseScroll',
  mouseConstraint.mouse.mousewheel
)

const resetBlocks = () => {
  blockBodies.map((b) => {
    Matter.Composite.remove(engine.world, b)
    Matter.Body.setPosition(b, {
      x: Math.random() * (window.innerWidth * 0.5),
      y: Math.random() * (window.innerHeight * -0.2) - b.w * b.scale,
    })
    b.__added = false
  })
}

// Add everything into the world
Matter.Composite.add(engine.world, [
  ceiling,
  ground,
  wallLeft,
  wallRight,
  ...wordBodies,
  mouseConstraint,
])

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = canvas.offsetWidth * DPR
canvas.height = canvas.offsetHeight * DPR

const render = () => {
  frame++
  const newBody = blockBodies.filter((body) => !body.__added)[0]
  if (newBody && frame % buffer === 0) {
    newBody.__added = true
    Matter.Composite.add(engine.world, [newBody])
  }
  // Rendera all the bodies in here
  // Dark mode
  const darkMode =
    (window.matchMedia('(prefers-color-scheme: dark)').matches &&
      config.theme === 'system') ||
    config.theme === 'dark'
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const entity of blockBodies) {
    const fill = entity.icon.svg.getAttribute('fill').trim()
    const size = entity.w * entity.scale * DPR
    ctx.save()
    ctx.translate(entity.position.x * DPR, entity.position.y * DPR)
    ctx.rotate(entity.angle)
    // ctx.fillStyle = entity.fill || 'black'
    // console.info(entity.icon.value.svg.getAttribute('fill'))
    // ctx.filter = `brightness(${darkMode ? 0.75 : 1}) ${
    //   fill === 'canvasText' && darkMode ? 'invert(1)' : ''
    // }`
    if (fill === 'canvasText' && darkMode) ctx.filter = 'invert(1)'
    ctx.drawImage(entity.icon.img, size * -0.5, size * -0.5, size, size)
    ctx.restore()
  }

  // ctx.drawImage(images[0].value, 0, 0, 40, 40)

  Matter.Engine.update(engine)
}

setTimeout(() => {}, 0)
document.documentElement.dataset.active = true
gsap.ticker.add(render)
gsap.ticker.fps(60)

ctrl
  .addBinding(config, 'blockCount', {
    min: 1,
    max: 100,
    step: 1,
    label: 'Blocks',
  })
  .on('change', newBlocksPlease)
const gravity = ctrl.addFolder({ title: 'Gravity' })
gravity.addBinding(config, 'x', {
  label: 'x',
  min: -1,
  max: 1,
  step: 0.01,
})
gravity.addBinding(config, 'y', {
  label: 'y',
  min: -1,
  max: 1,
  step: 0.001,
})
gravity.addBinding(config, 'scale', {
  label: 'scale',
  min: -1,
  max: 1,
  step: 0.01,
})
gravity
  .addButton({
    title: 'Reset',
  })
  .on('click', () => {
    config.x = 0
    config.y = 0.25
    config.scale = 0.01
    ctrl.refresh()
    update()
  })
ctrl
  .addButton({
    title: 'Drop',
  })
  .on('click', resetBlocks)

const adapt = () => {
  // Here you need to update all the things...
  canvas.width = canvas.offsetWidth * DPR
  canvas.height = canvas.offsetHeight * DPR

  syncWalls()
  syncWords()
}

window.addEventListener('resize', adapt)
