import gsap from 'https://cdn.skypack.dev/gsap'
import Matter from 'https://cdn.skypack.dev/matter-js'
import confetti from 'https://cdn.skypack.dev/canvas-confetti'

const BUMP = new Audio('https://cdn.freesound.org/previews/173/173598_2393266-lq.mp3')
BUMP.muted = true

const FORM = document.querySelector('form')
const INSTRUCTION = document.querySelector('.instruction')
const COUNTER = document.querySelector('.counter')
const SUCCESS = document.querySelector('.success')

// module aliases
const {
  Body,
  Engine,
  Events,
  Render,
  Runner,
  Bodies,
  Composite,
  Mouse,
  MouseConstraint,
} = Matter


const fillStyle = 'transparent'

// create an engine
const engine = Engine.create({
  gravity: { y: 2 / window.devicePixelRatio }
})


const ARENA = document.querySelector('.arena')
// create a renderer
const render = Render.create({
  element: ARENA,
  engine,
  options: {
    wireframes: false,
    background: 'transparent',
    pixelRatio: window.devicePixelRatio,
    height: ARENA.offsetHeight,
    width: ARENA.offsetWidth,
  },
})

window.__RENDER = render

const BUTTON = document.querySelector('.arena button')

// create two boxes and a ground

let bottle, surface, wallLeft, wallRight, ceiling;

const setScene = () => {
  // Composite.clear(engine.world)
  // Remove the bottle and walls but not the constraint...
  if (bottle) {
    Composite.remove(engine.world, bottle)
    Composite.remove(engine.world, surface)
    Composite.remove(engine.world, wallLeft)
    Composite.remove(engine.world, wallRight)
  }
  const getCanvasSize = (multiplier, dimension = 'width') => {
    return (render.canvas[dimension] * multiplier) / window.devicePixelRatio
  }
  // All based on 800 x 600...
  bottle = Bodies.rectangle(
    (render.canvas.width * 0.5) / window.devicePixelRatio,
    (render.canvas.height * 0.2) / window.devicePixelRatio,
    (render.canvas.width * 0.1) / window.devicePixelRatio,
    (render.canvas.width * 0.2) / window.devicePixelRatio,
    {
      render: {
        sprite: {
          texture: './bottle.png',
          xScale: (render.canvas.width * 0.2) / window.devicePixelRatio / 1000,
          yScale: (render.canvas.width * 0.2) / window.devicePixelRatio / 1000,
        },
      },
    }
  )
  surface = Bodies.rectangle(
    getCanvasSize(0.5),
    getCanvasSize(1, 'height'),
    getCanvasSize(1.1),
    2,
    { isStatic: true, render: { fillStyle } }
  )
  ceiling = Bodies.rectangle(
    getCanvasSize(0.5),
    0,
    getCanvasSize(1.1),
    2,
    {isStatic: true, render: { fillStyle }}
  )
  wallLeft = Bodies.rectangle(
    0,
    getCanvasSize(0.5, 'height'),
    2,
    getCanvasSize(1.1, 'height'),
    {
      isStatic: true,
      render: { fillStyle },
    }
  )
  wallRight = Bodies.rectangle(
    getCanvasSize(1), getCanvasSize(0.5, 'height'), 2, getCanvasSize(1.1, 'height'), { isStatic: true, render: {
      fillStyle
    } })
  Composite.add(engine.world, [bottle, surface, ceiling, wallLeft, wallRight])
}

setScene()

window.__init = setScene

const RESIZE_AND_RESET = () => {
  render.bounds.max.x = ARENA.offsetWidth
  render.bounds.max.y = ARENA.offsetWidth
  render.options.width = ARENA.offsetWidth
  render.options.height = ARENA.offsetWidth
  render.canvas.width = ARENA.offsetWidth
  render.canvas.height = ARENA.offsetWidth
  Matter.Render.setPixelRatio(render, window.devicePixelRatio) // added this
  
  // Here you need to resize and reset all the things....
  setScene()
}

window.addEventListener('resize', RESIZE_AND_RESET)

const DROP = () => {
  Body.setPosition(bottle, {
    x: (render.canvas.width * 0.5) / window.devicePixelRatio,
    y: (render.canvas.height * 0.2) / window.devicePixelRatio,
  })
  Body.setAngle(bottle, 0)
}


BUTTON.addEventListener('click', DROP)

// add mouse control
const mouse = Mouse.create(render.canvas)
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: {
    stiffness: 0.1,
    render: {
      visible: false,
    },
  },
})

Composite.add(engine.world, mouseConstraint)

// keep the mouse in sync with rendering
render.mouse = mouse

window.__BOTTLE = bottle

const handleRotate = () => {
  // console.info({ rotate: bottle.angle })
  const lower = 4 / window.devicePixelRatio
  const upper = 10 / window.devicePixelRatio
  const rotationRate = gsap.utils.clamp(
    lower,
    upper,
    gsap.utils.mapRange(-20, -10, lower, upper)(bottle.__ROTATION_RATE)
  )
  Body.rotate(bottle, rotationRate * (Math.PI / 180))
}

const bumpIt = () => {
  BUMP.pause()
  BUMP.currentTime = 0
  BUMP.play()
}

Events.on(engine, 'collisionStart', bumpIt)

const handleCollision = (event) => {
  gsap.ticker.remove(handleRotate)
  Events.off(engine, 'collisionStart', handleCollision)
}

let startRotation
let attempts = 0

const WIN = () => {
  Composite.remove(engine.world, mouseConstraint)
  FORM.remove()
  SUCCESS.style.display = 'block'
  document.documentElement.style.setProperty('--scale', 0)
}

const handleActive = (event) => {
  if (Math.floor(bottle.speed) === 0) {
    Events.off(engine, 'collisionActive', handleActive)
    const finalRotation = bottle.angle * (180 / Math.PI)
    // In here detect whether the startRotation and finalRotation are within the bounds
    const finalFract = Math.abs((finalRotation / 360) % 1)
    const startFract = Math.abs((startRotation / 360) % 1)
    const threshold = 0.24
    const startValid = startFract >= 1 - threshold || startFract <= threshold
    const finalValid = finalFract >= 1 - threshold || finalFract <= threshold
    attempts += 1
    COUNTER.innerText = `Attempts: ${attempts}`
    if (startValid && finalValid) {
      Composite.remove(engine.world, mouseConstraint)
      confetti()
      setTimeout(WIN, 1500)
    }

  }
}

Events.on(mouseConstraint, 'startdrag', (args) => {
  // Track the start so we can see if we got a full flip...
  startRotation = bottle.angle * (180 / Math.PI)
})

Events.on(mouseConstraint, 'enddrag', (args) => {
  if (args.body.velocity.y < -10) {
    bottle.__ROTATION_RATE = args.body.velocity.y
    gsap.ticker.add(handleRotate)
    Events.on(engine, 'collisionStart', handleCollision)
    Events.on(engine, 'collisionActive', handleActive)
  }
})

// run the renderer
Render.run(render)

// create runner
const runner = Runner.create()

// run the engine
Runner.run(runner, engine)

const REMOVE_INSTRUCTION = () => {
  INSTRUCTION.style.setProperty('--visible', 0)
  ARENA.removeEventListener('pointerdown', REMOVE_INSTRUCTION)
}

FORM.addEventListener('submit', event => {
  event.preventDefault()
  BUMP.muted = false
  document.documentElement.style.setProperty('--scale', 1)
  DROP()
  ARENA.addEventListener('pointerdown', REMOVE_INSTRUCTION)
})
