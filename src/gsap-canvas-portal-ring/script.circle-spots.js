import { gsap } from 'gsap'

console.clear()

const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')

CANVAS.height = window.innerHeight
CANVAS.width = window.innerWidth

// Points round a circle...
/**
 * x: radius * Math.cos(angle ( / 180 ?))
 * y: radius * Math.sin(angle ( / 180 ?))
 * */
const COUNT = 360
const RADIUS = 100

const genSparks = () => {
  const COUNT = gsap.utils.random(5, 10, 1)
  return new Array(COUNT).fill().map(spark => {
    return {
      travel: gsap.utils.random(50, 100),
      x: 0,
      y: 0,
      speed: gsap.utils.random(0.5, 2),
    }
  })
}

const SPOTS = new Array(COUNT).fill().map((point, index) => {
  return {
    originX: RADIUS * Math.cos(index * Math.PI / 180),
    originY: RADIUS * Math.sin(index * Math.PI / 180),
    sparks: genSparks()
  }
})

// Work out velocity ranges based on current position.
// So say it's between -15 and 15. Then plus the current index.

// How to get velocity x and y? Get the point from the angle
// and distance. Then use this to calculate the velocity. Even better
// Given point and angle. Just throw in the destination based on
// current position...

console.info(SPOTS)

gsap.ticker.add(() => {
  CONTEXT.clearRect(0, 0, window.innerWidth, window.innerHeight)
  const CENTER = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5
  }
  SPOTS.forEach(({originX, originY, sparks}) => {
    CONTEXT.fillRect(CENTER.x + originX, CENTER.y + originY, 5, 5)
    // CONTEXT.fillStyle = `hsl(${gsap.utils.random(0, 359)} 100% 50%)`
    CONTEXT.fillStyle = 'red'
  })

})