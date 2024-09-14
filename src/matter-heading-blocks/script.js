import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import Matter from 'https://cdn.skypack.dev/matter-js'
import Splitting from 'https://cdn.skypack.dev/splitting'

// Icons
const icons = {
  twitter:
    '<svg fill="currentColor" class="w-5 h-5" viewBox="0 0 24 24" role="img"><title>Twitter icon</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>',
}
let loaders = []
let images = []
for (const icon of Object.values(icons)) {
  const img = new Image()

  // console.info({ icon })
  // console.info(el.firstElementChild)
  const blob = new Blob([icon], {
    type: 'image/svg+xml;charset=utf-8',
  })

  console.info({ icon })
  const url = URL.createObjectURL(blob)
  img.onload = function () {
    URL.revokeObjectURL(url)
  }
  // loaders.push(img.onload)
  images.push(img)
  img.src = url
}
// Promise.allSettled(loaders).then(() => console.info('all loaded'))

Splitting()
const config = {
  debug: false,
  theme: 'system',
  x: 0,
  y: 0.25,
  scale: 0.01,
  blockCount: 35,
}
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
const blockRenderers = []
const blockSize = 60
const blockCount = config.blockCount
// Kick off the render...
let frame = 0
const buffer = 12
const size = 60 * DPR

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
    const newBlock = Matter.Bodies.rectangle(
      Math.random() * (window.innerWidth * 0.5),
      Math.random() * (window.innerHeight * -0.2) - blockSize,
      blockSize,
      blockSize,
      {
        angle: gsap.utils.random(0, 359),
        w: blockSize,
        h: blockSize,
        fill: `hsl(${Math.random() * 359} 80% 80%)`,
      }
    )
    blockBodies.push(newBlock)
  }
}
createBlocks()

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
      y: Math.random() * (window.innerHeight * -0.2) - blockSize,
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
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const entity of blockBodies) {
    ctx.save()
    ctx.translate(entity.position.x * DPR, entity.position.y * DPR)
    ctx.rotate(entity.angle)
    ctx.fillStyle = entity.fill || 'black'
    ctx.fillRect(size * -0.5, size * -0.5, size, size)
    ctx.restore()
  }

  Matter.Engine.update(engine)
}

setTimeout(() => {}, 0)
document.documentElement.dataset.active = true
gsap.ticker.add(render)

ctrl
  .addBinding(config, 'blockCount', {
    min: 1,
    max: 100,
    step: 1,
    label: 'Blocks',
  })
  .on('change', () => {
    blockBodies.map((b) => {
      Matter.Composite.remove(engine.world, b)
      Matter.Body.setPosition(b, {
        x: Math.random() * (window.innerWidth * 0.5),
        y: Math.random() * (window.innerHeight * -0.2) - blockSize,
      })
      b.__added = false
    })
    blockBodies.length = 0
    createBlocks()
  })
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
