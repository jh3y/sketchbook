for (const word of words) {
  const wordElement = Object.assign(document.createElement('p'), {
    className: 'word',
    innerHTML: word,
  })
  document.body.appendChild(wordElement)
}

const engine = Matter.Engine.create()
engine.gravity.x = 0
engine.gravity.y = 1

const wordElements = document.querySelectorAll('.word')

const wordBodies = []
const wordRenderers = []

for (const elem of wordElements) {
  // Create new bodies and add them to the engine so they can be rendered.
  // Give them random placement though
  const bounds = elem.getBoundingClientRect()
  const newBody = {
    w: bounds.width,
    h: bounds.height,
    body: Matter.Bodies.rectangle(
      gsap.utils.random(window.innerWidth * 0.25, window.innerWidth * 0.75),
      bounds.height * -1,
      bounds.width,
      bounds.height
    ),
    elem,
    render() {
      const { x, y } = this.body.position
      this.elem.style.top = `${y - this.h / 2}px`
      this.elem.style.left = `${x - this.w / 2}px`
      this.elem.style.transform = `rotate(${this.body.angle}rad)`
    },
  }

  wordBodies.push(newBody.body)
  wordRenderers.push(newBody)
}

const ceiling = Matter.Bodies.rectangle(
  0,
  window.innerHeight * -0.5,
  window.innerWidth * window.devicePixelRatio,
  10,
  {
    isStatic: true,
  }
)
const ground = Matter.Bodies.rectangle(
  0,
  window.innerHeight,
  window.innerWidth * window.devicePixelRatio * 4,
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
  // ...wordBodies,
  mouseConstraint,
])

let frame = 0
const buffer = 12
const render = () => {
  frame++
  const newBody = wordBodies.filter((body) => !body.__added)[0]
  if (newBody && frame % buffer === 0) {
    newBody.__added = true
    Matter.Composite.add(engine.world, [newBody])
  }
  // Rendera all the bodies in here
  for (const word of wordRenderers) {
    word.render()
  }
  Matter.Engine.update(engine)
}

setTimeout(() => {
  document.documentElement.dataset.active = true
  gsap.ticker.add(render)
}, 0)
// gsap.ticker.add(render);
