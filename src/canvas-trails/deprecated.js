import gsap from 'gsap'

console.clear()

const NUMBER_OF_CELLS = 24

const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')
const RATIO = window.devicePixelRatio || 1

const HUE_ONE = 10
const HUE_TWO = 45

CANVAS.width = CANVAS.offsetWidth * RATIO
CANVAS.height = CANVAS.offsetHeight * RATIO

const CELL_SIZE = CANVAS.width / NUMBER_OF_CELLS
const CELL_BORDER = CELL_SIZE * 0.1

const CELL_MAP = []
const CELLS = []
const NUMBER_OF_TRAILS = NUMBER_OF_CELLS * 0.5

// How do you model the two square growth?
// 1. Each cell is two rects
// 2. One red, one yellow
// 3. One scales before the other so you have two scales
// 4. Yellow changes to white
// 5. They both scale down...

for (let t = 0; t < NUMBER_OF_TRAILS; t++) {
  // In here generate the trails starting at x which will be the half way point?
  // Given the trail number, you can work out the length of a side, etc.
  const side = NUMBER_OF_CELLS - t * 2
  const total = side * 4 - 4
  const TRAIL_CELLS = []
  const START = {
    x: NUMBER_OF_CELLS * 0.5,
    y: t,
  }
  const LIMIT = {
    x: [t, NUMBER_OF_CELLS - t],
    y: [t, NUMBER_OF_CELLS - t],
  }
  // console.info({ t, side, START, total })
  let x = NUMBER_OF_CELLS * 0.5
  let y = t
  for (let c = 0; c < total; c++) {
    TRAIL_CELLS.push({
      index: c,
      x,
      y,
      lightness: 50,
      scaleOne: 0,
      scaleTwo: 0,
      scale: 0,
      trail: t,
    })

    const TOP_SIDE = side * 0.5 - 1
    const RIGHT_SIDE = TOP_SIDE + (side - 1)
    const BOTTOM_SIDE = RIGHT_SIDE + (side - 1)
    const LEFT_SIDE = BOTTOM_SIDE + (side - 1)

    if (c < TOP_SIDE) {
      x += 1
    } else if (c >= TOP_SIDE && c < RIGHT_SIDE) {
      y += 1
    } else if (c >= RIGHT_SIDE && c < BOTTOM_SIDE) {
      x -= 1
    } else if (c >= BOTTOM_SIDE && c < LEFT_SIDE) {
      y -= 1
    } else {
      x += 1
    }
  }
  CELLS.push(TRAIL_CELLS)
}
const RENDER_CELLS = [
  ...CELLS[0],
  ...CELLS[1],
  ...CELLS[2],
  ...CELLS[3],
  ...CELLS[4],
  ...CELLS[5],
  ...CELLS[6],
  ...CELLS[7],
  ...CELLS[8],
  ...CELLS[9],
  ...CELLS[10],
  ...CELLS[11],
]
// const RENDER_CELLS = CELLS.flat()

const TRAIL_TIMELINES = []

gsap.defaults({ ease: 'none' })

const DRAW = () => {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
  for (const CELL of RENDER_CELLS) {
    // const HUE = (360 / (NUMBER_OF_CELLS * 0.5)) * CELL.trail

    // Draw the red rectangle first
    CONTEXT.fillStyle = `hsl(${HUE_ONE} 100% ${CELL.lightness}%)`
    CONTEXT.fillRect(
      CELL.x * CELL_SIZE +
        CELL_BORDER +
        (CELL_SIZE - CELL_SIZE * CELL.scaleOne) * 0.5,
      CELL.y * CELL_SIZE +
        CELL_BORDER +
        (CELL_SIZE - CELL_SIZE * CELL.scaleOne) * 0.5,
      (CELL_SIZE - CELL_BORDER * 2) * CELL.scaleOne,
      (CELL_SIZE - CELL_BORDER * 2) * CELL.scaleOne
    )
    // Draw the yellow rectangle second
    CONTEXT.fillStyle = `hsl(${HUE_TWO} 100% ${CELL.lightness}%)`
    CONTEXT.fillRect(
      CELL.x * CELL_SIZE +
        CELL_BORDER +
        (CELL_SIZE - CELL_SIZE * CELL.scaleTwo) * 0.5,
      CELL.y * CELL_SIZE +
        CELL_BORDER +
        (CELL_SIZE - CELL_SIZE * CELL.scaleTwo) * 0.5,
      (CELL_SIZE - CELL_BORDER * 2) * CELL.scaleTwo,
      (CELL_SIZE - CELL_BORDER * 2) * CELL.scaleTwo
    )
  }
}

const MAIN = gsap.timeline()

const tailMap = gsap.utils.mapRange(4, 92, 0.1, 6)
const transitionMap = gsap.utils.mapRange(4, 92, 0.1, 1)

const frac = 1 / 12

const TRAIL_CONFIGS = new Array(CELLS.length)
  .fill()
  .map((_, index) => [
    0.9,
    // frac * (CELLS.length - index),
    0.1
  ])

const CREATE_TRAIL_LOOP = (trailNumber) => {
  const TRAIL_CELLS = CELLS[trailNumber]
  const loopTimes = []

  const transition = transitionMap(TRAIL_CELLS.length)
  const tail = tailMap(TRAIL_CELLS.length)
  // const transition = 0.1
  // const tail = 1

  // const [tail, transition] = TRAIL_CONFIGS[trailNumber]

  const TRAIL_TL = gsap.timeline({ paused: true })
  for (let c = 0; c < TRAIL_CELLS.length * 3; c++) {
    const CELL = TRAIL_CELLS[c % TRAIL_CELLS.length]
    if (CELL.index === 0) {
      loopTimes.push(TRAIL_TL.totalDuration())
    }
    TRAIL_TL.add(
      gsap
        .timeline()
        .set(CELL, { lightness: 50 })
        .to(CELL, {
          scaleOne: 1,
          // duration: 0.1,
          duration: transition * 0.5,
          // ease: 'power4.in',
          immediateRender: false,
        })
        .to(
          CELL,
          {
            scaleTwo: 1,
            // duration: 0.3,
            duration: transition,
            immediateRender: false,
          },
          '>-50%'
        )
        .to(
          CELL,
          {
            lightness: 100,
            // duration: 0.15,
            duration: transition,
            immediateRender: false,
          },
          '>-15%'
        )
        .to(
          CELL,
          {
            scaleOne: 0,
            scaleTwo: 0,
            duration: tail,
            immediateRender: false,
          },
          '>-10%'
        ),
      c * transition * 0.2
    )
  }
  return {
    loopWindow: loopTimes,
    timeline: TRAIL_TL,
  }
}


// let duration =
for (let t = 0; t < CELLS.length; t++) {
  const TRAIL_TIME = CREATE_TRAIL_LOOP(t)
  const TRAIL_LOOP = gsap.fromTo(
    TRAIL_TIME.timeline,
    { totalTime: TRAIL_TIME.loopWindow[1] },
    {
      totalTime: TRAIL_TIME.loopWindow[2],
      repeat: -1,
      ease: 'none',
      // duration: Math.sin(Math.PI / 180 * 45) * (CELLS.length - t),
      duration: CELLS.length / ( t + 1),
      immediateRender: false,
    }
  )
  MAIN.add(TRAIL_LOOP, 0)
}

// MAIN.pause()
// MAIN.totalTime(MAIN.totalDuration())
MAIN.timeScale(1)
gsap.ticker.add(DRAW)