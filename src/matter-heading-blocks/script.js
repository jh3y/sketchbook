import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import Matter from 'https://cdn.skypack.dev/matter-js'
import Splitting from 'https://cdn.skypack.dev/splitting'

const config = {
  debug: false,
  theme: 'system',
  x: 0,
  y: 0.25,
  lower: 1.2,
  upper: 5,
  stagger: 12,
  scale: 0.01,
  blockCount: 35,
  bounce: 0.5,
  random: true,
  device: false,
  xLimit: 0.2,
  yLimit: 0.2,
}
const content = document.querySelector('h1')
const icons = {}

const loadSVG = async (svg) => {
  return new Promise((resolve, reject) => {
    const title = svg.querySelector('title').innerHTML
    const path = svg.querySelector('path')
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url) // Clean up after load
      config[title] = title.toLowerCase().indexOf('bear') !== -1
      const vertices = Matter.Svg.pathToVertices(path)
      if (title === 'Bear' && !icons[title]) icons[title] = []
      if (title === 'Bear') {
        icons[title].push({
          img,
          svg,
          vertices,
        })
      } else {
        icons[title] = {
          img,
          svg,
          vertices,
        }
      }
      resolve(true) // Resolve promise with the loaded image
    }
    img.onerror = reject // Reject promise if an error occurs
    img.src = url
  })
}

function loadSVGs(svgElements) {
  // Return a Promise that resolves when all SVG elements are loaded
  return Promise.allSettled(
    svgElements.map(
      (svg) =>
        new Promise((resolve, reject) => {
          const title = svg.querySelector('title').innerHTML

          if (title === 'Bear') {
            // Load up a load of bears to use
            for (let i = 0; i < 20; i++) {
              const bear = svg.cloneNode(true)
              const cap = bear.querySelector('.strap')
              cap.setAttribute(
                'fill',
                `hsl(${gsap.utils.random(0, 359, 1)} 100% ${gsap.utils.random(
                  50,
                  80,
                  1
                )}%)`
              )
              const body = bear.querySelector('.body')
              body.setAttribute(
                'fill',
                `hsl(32 ${gsap.utils.random(20, 80, 1)}% ${gsap.utils.random(
                  16,
                  65,
                  1
                )}%)`
              )
              resolve(loadSVG(bear))
            }
          } else {
            resolve(loadSVG(svg))
          }
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
  setUpper.min = config.lower
  setLower.max = config.upper
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

// ctrl.addBinding(config, 'debug', {
//   label: 'Debug',
// })

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.on('change', sync)

const createBlocks = () => {
  blockBodies.length = 0
  for (let i = 0; i < config.blockCount; i++) {
    const blockSize = 24
    const allowed = Object.keys(icons).filter((i) => config[i])
    const chosen = allowed[gsap.utils.random(0, allowed.length - 1, 1)]
    const icon =
      chosen === 'Bear'
        ? icons['Bear'][gsap.utils.random(0, icons['Bear'].length - 1, 1)]
        : icons[chosen]
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
    const { left, width } = content.getBoundingClientRect()
    const x = gsap.utils.random(left - width * 0.25, left + width * 1.25, 1)
    const scale = gsap.utils.random(config.lower, config.upper)
    const newBlock = Matter.Bodies.fromVertices(
      x,
      Math.random() * (window.innerHeight * -0.2) - blockSize * scale,
      vertices,
      {
        icon,
        restitution: config.random ? Math.random() : config.bounce,
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
  if (newBody && frame % config.stagger === 0) {
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

const blockFolder = ctrl.addFolder({ title: 'Blocks', expanded: true })
blockFolder
  .addBinding(config, 'blockCount', {
    min: 1,
    max: 100,
    step: 1,
    label: 'Count',
  })
  .on('change', newBlocksPlease)
const setLower = blockFolder
  .addBinding(config, 'lower', {
    min: 0.5,
    max: config.upper,
    step: 0.01,
    label: 'Lower (scale)',
  })
  .on('change', newBlocksPlease)
const setUpper = blockFolder
  .addBinding(config, 'upper', {
    min: config.lower,
    max: 6,
    step: 0.01,
    label: 'Upper (scale)',
  })
  .on('change', newBlocksPlease)
blockFolder
  .addBinding(config, 'stagger', {
    min: 0,
    max: 60,
    step: 1,
    label: 'Stagger (frame)',
  })
  .on('change', newBlocksPlease)

const iconsFolder = ctrl.addFolder({ title: 'Icons', expanded: false })
for (const icon of Object.keys(icons)) {
  iconsFolder.addBinding(config, icon, {
    label: icon,
  })
}
iconsFolder.on('change', newBlocksPlease)

const bounce = ctrl.addFolder({ title: 'Bounce', expanded: false })
const bounciness = bounce
  .addBinding(config, 'bounce', {
    label: 'Bounciness',
    min: 0,
    max: 1,
    step: 0.01,
    disabled: true,
  })
  .on('change', newBlocksPlease)
bounce
  .addBinding(config, 'random', {
    label: 'Random',
  })
  .on('change', (event) => {
    bounciness.disabled = config.random
    newBlocksPlease(event)
  })
const gravity = ctrl.addFolder({ title: 'Gravity', expanded: false })
const x = gravity.addBinding(config, 'x', {
  label: 'x',
  min: -1,
  max: 1,
  step: 0.01,
})
const y = gravity.addBinding(config, 'y', {
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

const handleDeviceOrientation = ({ beta, gamma }) => {
  const xGravity = gsap.utils.clamp(
    -config.xLimit,
    config.xLimit,
    gsap.utils.mapRange(-90, 90, -config.xLimit, config.xLimit, gamma)
  )
  const yGravity = gsap.utils.clamp(
    -config.yLimit,
    config.yLimit,
    gsap.utils.mapRange(-90, 90, -config.yLimit, config.yLimit, beta)
  )
  config.y = yGravity
  config.x = xGravity
  ctrl.refresh()
}

gravity
  .addBinding(config, 'device', {
    label: 'Device Control',
  })
  .on('change', () => {
    y.disabled = x.disabled = config.device
    yLimit.disabled = xLimit.disabled = !config.device

    if (config.device) {
      if (DeviceOrientationEvent?.requestPermission) {
        Promise.all([DeviceOrientationEvent.requestPermission()]).then(
          (results) => {
            if (results.every((result) => result === 'granted')) {
              window.addEventListener(
                'deviceorientation',
                handleDeviceOrientation
              )
            }
          }
        )
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation)
      }
    } else {
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  })

const xLimit = gravity.addBinding(config, 'xLimit', {
  min: 0,
  max: 1,
  step: 0.001,
  label: 'Range (x)',
  disabled: !config.device,
})
const yLimit = gravity.addBinding(config, 'yLimit', {
  min: 0,
  max: 1,
  step: 0.001,
  label: 'Range (y)',
  disabled: !config.device,
})
gravity
  .addButton({
    title: 'Reset',
  })
  .on('click', () => {
    config.x = 0
    config.y = 0.25
    config.scale = 0.01
    config.xLimit = config.yLimit = 0.2
    config.device = false
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
update()
