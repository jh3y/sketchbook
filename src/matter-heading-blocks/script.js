import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import Matter from 'https://cdn.skypack.dev/matter-js'
import Splitting from 'https://cdn.skypack.dev/splitting'

Splitting()

const config = {
  debug: false,
  theme: 'system',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.debug = config.debug
  document.documentElement.dataset.theme = config.theme
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

const DPR = window.devicePixelRatio

console.info({ DPR })

// Set up the physics engine...
const engine = Matter.Engine.create({
  render: {
    options: {
      pixelRatio: DPR,
    },
  },
})
engine.gravity.x = 0
engine.gravity.y = 0.25
engine.gravity.scale = 0.01

const wordElements = document.querySelectorAll('.word')

const wordBodies = []

const blocks = new Array(20).fill().map((e) =>
  Object.assign(document.createElement('div'), {
    className: 'block',
  })
)

const blockBodies = []
const blockRenderers = []
const header = document.querySelector('header')
for (const block of blocks) {
  header.appendChild(block)
  block.style.setProperty('--l', Math.random() * 0.5)
  block.style.setProperty('--t', Math.random() * 0.2)
  const bounds = block.getBoundingClientRect()
  const newBlock = {
    w: bounds.width,
    h: bounds.height,
    body: Matter.Bodies.rectangle(
      bounds.left,
      bounds.top,
      bounds.width,
      bounds.height
    ),
    elem: block,
    render() {
      const { x, y } = this.body.position
      // this.elem.style.setProperty('--y', y)
      // this.elem.style.setProperty('--x', x)
      // this.elem.style.setProperty('--r', this.body.angle)
      this.elem.style.top = `${y - this.h / 2}px`
      this.elem.style.left = `${x - this.w / 2}px`
      this.elem.style.transform = `rotate(${this.body.angle}rad)`
    },
  }

  blockBodies.push(newBlock.body)
  blockRenderers.push(newBlock)
}

console.info({ blocks })

for (const elem of document.querySelectorAll('.content')) {
  // Create new bodies and add them to the engine so they can be rendered.
  // Give them random placement though
  const bounds = elem.getBoundingClientRect()

  const newBody = {
    w: bounds.width,
    h: bounds.height,
    body: Matter.Bodies.rectangle(
      bounds.x + bounds.width * 0.5,
      bounds.y + bounds.height * 0.5,
      bounds.width,
      bounds.height,
      {
        isStatic: true,
      }
    ),
  }

  const debugWord = Object.assign(document.createElement('div'), {
    className: 'debugger',
    style: `--x: ${bounds.x}; --y: ${bounds.y}; --w: ${bounds.width}; --h: ${bounds.height};`,
  })
  header.appendChild(debugWord)
  wordBodies.push(newBody.body)
  // wordRenderers.push(newBody)
}

const ceiling = Matter.Bodies.rectangle(
  0,
  window.innerHeight * -0.5,
  window.innerWidth,
  10,
  {
    isStatic: true,
  }
)
const ground = Matter.Bodies.rectangle(
  window.innerWidth * 0.5,
  window.innerHeight,
  window.innerWidth,
  10,
  {
    isStatic: true,
  }
)
const wallRight = Matter.Bodies.rectangle(
  window.innerWidth,
  window.innerHeight * -0.5,
  10,
  window.innerHeight * window.devicePixelRatio + window.innerHeight * 4,
  {
    isStatic: true,
  }
)
const wallLeft = Matter.Bodies.rectangle(
  -10,
  window.innerHeight * -0.5,
  10,
  window.innerHeight * window.devicePixelRatio + window.innerHeight * 4,
  {
    isStatic: true,
  }
)
const mouseConstraint = Matter.MouseConstraint.create(engine, {
  element: document.body,
})
Matter.Composite.add(engine.world, [
  ceiling,
  ground,
  wallLeft,
  wallRight,
  ...wordBodies,
  mouseConstraint,
])

// Kick off the render...
let frame = 0
const buffer = 12
const render = () => {
  frame++
  const newBody = blockBodies.filter((body) => !body.__added)[0]
  if (newBody && frame % buffer === 0) {
    newBody.__added = true
    Matter.Composite.add(engine.world, [newBody])
  }
  // Rendera all the bodies in here
  for (const entity of blockRenderers) {
    entity.render()
  }
  Matter.Engine.update(engine)
}

setTimeout(() => {
  document.documentElement.dataset.active = true
  gsap.ticker.add(render)
}, 0)
