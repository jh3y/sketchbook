import React from 'https://cdn.skypack.dev/react'
import ReactDOM from 'https://cdn.skypack.dev/react-dom'
import gsap from 'https://cdn.skypack.dev/gsap'
import Matter from 'https://cdn.skypack.dev/matter-js'
import confetti from 'https://cdn.skypack.dev/canvas-confetti'

const BUMP = new Audio(
  'https://cdn.freesound.org/previews/173/173598_2393266-lq.mp3'
)
BUMP.muted = true
const duration = 0.75
const ease = 'elastic.out(1, 0.75)'

const BOTTLES = {
  water: {
    size: {
      width: 0.06,
      height: 0.2,
    },
    scale: {
      x: 0.2,
      y: 0.2,
    },
    sprite: 'https://assets.codepen.io/605876/bottle.png',
  },
  dew: {
    size: {
      width: 0.13,
      height: 0.4,
    },
    scale: {
      x: 0.5,
      y: 0.4,
    },
    sprite: 'https://assets.codepen.io/605876/dew.png',
  },
  pepsi: {
    size: {
      width: 0.08,
      height: 0.26,
    },
    scale: {
      x: 0.29,
      y: 0.26,
    },
    sprite: 'https://assets.codepen.io/605876/pepsi.png',
  },
}

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

const ROOT_NODE = document.querySelector('#app')

const BottleFlip = ({ onSuccess }) => {
  const [attempts, setAttempts] = React.useState(0)
  const [clean, setClean] = React.useState(true)
  // const innerRef = React.useRef(null)
  const arenaRef = React.useRef(null)
  // Set up refs for matter-js
  const engineRef = React.useRef(null)
  const renderRef = React.useRef(null)
  const bottleRef = React.useRef(null)
  const bottlesRef = React.useRef(null)
  const bottleIndexRef = React.useRef(0)
  const dewRef = React.useRef(null)
  const pepsiRef = React.useRef(null)
  const waterRef = React.useRef(null)
  const surfaceRef = React.useRef(null)
  const ceilingRef = React.useRef(null)
  const wallLeftRef = React.useRef(null)
  const wallRightRef = React.useRef(null)
  const mouseRef = React.useRef(null)
  const startRotationRef = React.useRef(0)
  const attemptsRef = React.useRef(null)
  const rotationRateRef = React.useRef(null)

  const mouseConstraintRef = React.useRef(null)
  // Bottle reset
  const dropBottle = () => {
    Body.setPosition(bottleRef.current, {
      x: (renderRef.current.canvas.width * 0.5) / window.devicePixelRatio,
      y: (renderRef.current.canvas.height * 0.2) / window.devicePixelRatio,
    })
    Body.setAngle(bottleRef.current, 0)
  }
  // Bump attempts count
  const bumpAttempts = () => {
    setAttempts((attempts) => attempts + 1)
  }
  // How to swap out the bottle...
  const changeBottle = () => {
    // When changing the bottle, we're updating a ref and cycling through Bodies
    if (bottleRef.current) {
      // Remove the current, add the next one in line.
      Composite.remove(engineRef.current.world, bottleRef.current)
      // Current index
      bottleIndexRef.current = (bottleIndexRef.current + 1) % 3
      const nextBottle = bottlesRef.current[bottleIndexRef.current]
      Composite.add(engineRef.current.world, nextBottle)
      bottleRef.current = nextBottle
      dropBottle()
    }
  }
  // Utility function to create the scene
  const getCanvasSize = (multiplier, dimension = 'width') => {
    return (
      (renderRef.current.canvas[dimension] * multiplier) /
      window.devicePixelRatio
    )
  }
  const setScene = () => {
    // Remove the bottle and walls but not the constraint...
    if (bottleRef.current) {
      Composite.remove(engineRef.current.world, bottleRef.current)
      Composite.remove(engineRef.current.world, surfaceRef.current)
      Composite.remove(engineRef.current.world, ceilingRef.current)
      Composite.remove(engineRef.current.world, wallLeftRef.current)
      Composite.remove(engineRef.current.world, wallRightRef.current)
    }
    // All based on 800 x 600...

    waterRef.current = Bodies.rectangle(
      getCanvasSize(0.5),
      getCanvasSize(0.2, 'height'),
      getCanvasSize(BOTTLES.water.size.width),
      getCanvasSize(BOTTLES.water.size.height),
      {
        render: {
          sprite: {
            texture: BOTTLES.water.sprite,
            xScale:
              (renderRef.current.canvas.width * BOTTLES.water.scale.x) /
              window.devicePixelRatio /
              930,
            yScale:
              (renderRef.current.canvas.width * BOTTLES.water.scale.y) /
              window.devicePixelRatio /
              930,
          },
        },
      }
    )
    dewRef.current = Bodies.rectangle(
      getCanvasSize(0.5),
      getCanvasSize(0.2, 'height'),
      getCanvasSize(BOTTLES.dew.size.width),
      getCanvasSize(BOTTLES.dew.size.height),
      {
        render: {
          sprite: {
            texture: BOTTLES.dew.sprite,
            xScale:
              (renderRef.current.canvas.width * BOTTLES.dew.scale.x) /
              window.devicePixelRatio /
              930,
            yScale:
              (renderRef.current.canvas.width * BOTTLES.dew.scale.y) /
              window.devicePixelRatio /
              930,
          },
        },
      }
    )
    pepsiRef.current = Bodies.rectangle(
      getCanvasSize(0.5),
      getCanvasSize(0.2, 'height'),
      getCanvasSize(BOTTLES.pepsi.size.width),
      getCanvasSize(BOTTLES.pepsi.size.height),
      {
        render: {
          sprite: {
            texture: BOTTLES.pepsi.sprite,
            xScale:
              (renderRef.current.canvas.width * BOTTLES.pepsi.scale.x) /
              window.devicePixelRatio /
              930,
            yScale:
              (renderRef.current.canvas.width * BOTTLES.pepsi.scale.y) /
              window.devicePixelRatio /
              930,
          },
        },
      }
    )
    bottlesRef.current = [waterRef.current, dewRef.current, pepsiRef.current]
    bottleRef.current = bottlesRef.current[bottleIndexRef.current]
    surfaceRef.current = Bodies.rectangle(
      getCanvasSize(0.5),
      getCanvasSize(1, 'height'),
      getCanvasSize(1.1),
      2,
      { isStatic: true, render: { fillStyle } }
    )
    ceilingRef.current = Bodies.rectangle(
      getCanvasSize(0.5),
      0,
      getCanvasSize(1.1),
      2,
      {
        isStatic: true,
        render: { fillStyle },
      }
    )
    wallLeftRef.current = Bodies.rectangle(
      0,
      getCanvasSize(0.5, 'height'),
      2,
      getCanvasSize(1.1, 'height'),
      {
        isStatic: true,
        render: { fillStyle },
      }
    )
    wallRightRef.current = Bodies.rectangle(
      getCanvasSize(1),
      getCanvasSize(0.5, 'height'),
      2,
      getCanvasSize(1.1, 'height'),
      {
        isStatic: true,
        render: {
          fillStyle,
        },
      }
    )
    Composite.add(engineRef.current.world, [
      bottleRef.current,
      surfaceRef.current,
      ceilingRef.current,
      wallLeftRef.current,
      wallRightRef.current,
    ])
  }
  // Create the bottle flipping engine
  React.useEffect(() => {
    // Create the engine
    engineRef.current = Engine.create({
      gravity: { y: 2 / window.devicePixelRatio },
    })
    // Create the renderer
    renderRef.current = Render.create({
      element: arenaRef.current,
      engine: engineRef.current,
      options: {
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio,
        height: arenaRef.current.offsetHeight,
        width: arenaRef.current.offsetWidth,
      },
    })
    // Generate the scene
    setScene()
    // Set up the runner and set it off
    // run the renderer
    Render.run(renderRef.current)
    // create runner
    const runner = Runner.create()
    // run the engine
    Runner.run(runner, engineRef.current)
  }, [])
  // Set up the mouse constraints
  React.useEffect(() => {
    mouseRef.current = Mouse.create(renderRef.current.canvas)
    mouseConstraintRef.current = MouseConstraint.create(engineRef.current, {
      mouse: mouseRef.current,
      constraint: {
        stiffness: 0.1,
        render: {
          visible: false,
        },
      },
    })
    Composite.add(engineRef.current.world, mouseConstraintRef.current)
    // keep the mouse in sync with rendering
    renderRef.current.mouse = mouseRef.current
  }, [])
  // Handle window resize listening
  React.useEffect(() => {
    const resizeAndReset = () => {
      renderRef.current.bounds.max.x = arenaRef.current.offsetWidth
      renderRef.current.bounds.max.y = arenaRef.current.offsetWidth
      renderRef.current.options.width = arenaRef.current.offsetWidth
      renderRef.current.options.height = arenaRef.current.offsetWidth
      renderRef.current.canvas.width = arenaRef.current.offsetWidth
      renderRef.current.canvas.height = arenaRef.current.offsetWidth
      Matter.Render.setPixelRatio(renderRef.current, window.devicePixelRatio) // added this
      // Here you need to resize and reset all the things....
      setScene()
    }

    window.addEventListener('resize', resizeAndReset)
    return () => {
      window.removeEventListener('resize', resizeAndReset)
    }
  }, [])
  // Set up Matter-js specific event handling
  const handleRotate = () => {
    const lower = 4 / window.devicePixelRatio
    const upper = 10 / window.devicePixelRatio
    const rotationRate = gsap.utils.clamp(
      lower,
      upper,
      gsap.utils.mapRange(-20, -10, lower, upper)(rotationRateRef.current)
    )
    Body.rotate(bottleRef.current, rotationRate * (Math.PI / 180))
  }
  // Play our bottle clunk
  const bumpIt = () => {
    BUMP.muted = false
    BUMP.pause()
    BUMP.currentTime = 0
    BUMP.play()
  }
  // Handle any collisions by tidying up
  const handleCollision = (event) => {
    gsap.ticker.remove(handleRotate)
    Events.off(engineRef.current, 'collisionStart', handleCollision)
  }
  // Handle active collisions and use speed to detect the ending
  const handleActive = (event) => {
    if (Math.floor(bottleRef.current.speed) === 0) {
      Events.off(engineRef.current, 'collisionActive', handleActive)
      const finalRotation = bottleRef.current.angle * (180 / Math.PI)
      // In here detect whether the startRotation and finalRotation are within the bounds
      const finalFract = Math.abs((finalRotation / 360) % 1)
      const startFract = Math.abs((startRotationRef.current / 360) % 1)
      const threshold = 0.22
      const startValid = startFract >= 1 - threshold || startFract <= threshold
      const finalValid = finalFract >= 1 - threshold || finalFract <= threshold
      const startTurns = startRotationRef.current / 360
      const finalTurns = finalRotation / 360
      // Bump the number of attempts
      bumpAttempts()
      if (startValid && finalValid && startTurns < finalTurns) {
        Composite.remove(engineRef.current.world, mouseConstraintRef.current)
        if (onSuccess) onSuccess()
      } else {
        startRotationRef.current = finalRotation
      }
    }
  }
  React.useEffect(() => {
    // Play a bottle bump on every collision
    Events.on(engineRef.current, 'collisionStart', bumpIt)
    // Track the start so we can see if we got a full flip...
    Events.on(mouseConstraintRef.current, 'startdrag', () => {
      setClean(false)
      // startRotationRef.current = bottleRef.current.angle * (180 / Math.PI)
    })
    // Detect whether to start rotating the bottle or not
    Events.on(mouseConstraintRef.current, 'enddrag', ({ body }) => {
      if (body.velocity.y < -10) {
        rotationRateRef.current = body.velocity.y
        gsap.ticker.add(handleRotate)
        Events.on(engineRef.current, 'collisionStart', handleCollision)
        Events.on(engineRef.current, 'collisionActive', handleActive)
      }
    })
  }, [])
  return (
    <div className="arena" ref={arenaRef}>
      {clean && (
        <p className="instruction">
          One more step... Perform a bottle flip by grabbing the bottle.
        </p>
      )}
      <p className="counter">{`Attempts: ${attempts}`}</p>
      <button className="reset" onClick={dropBottle}>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <span className="sr-only">Restart</span>
      </button>
      {attempts >= 5 && (
        <p className="help">
          <strong>Hint:</strong> Not quite managed it? Maybe try{' '}
          <button className="switcher" onClick={changeBottle}>
            changing
          </button>{' '}
          the bottle.
        </p>
      )}
    </div>
  )
}

const Unsubscribe = () => {
  const confirmRef = React.useRef(null)
  const flipRef = React.useRef(null)
  const successRef = React.useRef(null)
  const [confirming, setConfirming] = React.useState(true)
  const [flipping, setFlipping] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const onSubmit = (event) => {
    event.preventDefault()
    if (!flipping) {
      setFlipping(true)
    }
  }

  React.useEffect(() => {
    if (flipping) {
      gsap
        .timeline({
          onComplete: () => {
            setConfirming(false)
          },
        })
        .set(flipRef.current, { visibility: 'visible' })
        .to(confirmRef.current, {
          yPercent: 100,
          duration,
          ease: 'elastic(1, 0.75)',
        })
        .from(
          flipRef.current,
          {
            yPercent: -100,
            opacity: 0,
            duration,
            ease,
          },
          0
        )
    }
  }, [flipping])

  const onSuccess = () => {
    confetti()
    setSuccess(true)
  }

  React.useEffect(() => {
    if (!success) return
    gsap
      .timeline({
        delay: 1,
        onComplete: () => {
          setFlipping(false)
        },
      })
      .set(successRef.current, { visibility: 'visible' })
      .to(
        flipRef.current,
        {
          yPercent: 100,
          duration,
          ease,
        },
        0
      )
      .from(
        successRef.current,
        {
          yPercent: -100,
          duration,
          ease,
        },
        0
      )
  }, [success])

  return (
    <>
      {!success && (
        <form onSubmit={onSubmit}>
          {confirming && (
            <div className="container" ref={confirmRef}>
              <div className="form-block">
                <div>
                  <h1>Unsubscribe</h1>
                  <p>We're sad to see you go.</p>
                </div>
                <button>Confirm</button>
              </div>
            </div>
          )}
        </form>
      )}
      {flipping && (
        <div ref={flipRef} className="container container--arena">
          <BottleFlip onSuccess={onSuccess} />
        </div>
      )}
      {success && (
        <div ref={successRef} className="container container--success">
          <div className="form-block">
            <p>Successfully unsubscribed.</p>
          </div>
        </div>
      )}
    </>
  )
}

ReactDOM.render(<Unsubscribe />, ROOT_NODE)
