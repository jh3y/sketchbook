import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)

const ROOT_NODE = document.querySelector('#app')

const TearStrip = ({ children }) => {
  const stripRef = React.useRef(null)
  const tabRef = React.useRef(null)
  const backingRef = React.useRef(null)
  const handleRef = React.useRef(null)
  const iconRef = React.useRef(null)
  const draggableRef = React.useRef(null)
  const shadowRef = React.useRef(null)
  const proxyRef = React.useRef(document.createElement('div'))
  const [torn, setTorn] = React.useState(false)
  const audioRef = React.useRef(new Audio('/tear_open.mp3'))
  // Handle all the draggable stuff, etc.
  React.useEffect(() => {
    // Need to load the audio so I can get the duration
    const DISTANCE_OF_RESISTANCE = stripRef.current.offsetWidth * 0.25
    gsap.set(handleRef.current, {
      x: 0,
      y: 0,
    })
    // Create the Draggable instance which is where all the interactivity happens
    draggableRef.current = Draggable.create(proxyRef.current, {
      // NOTE:: Instances of "this" refer to the Draggable if you're new to Draggable
      type: 'x,y',
      trigger: handleRef.current,
      allowContextMenu: true,
      dragResistance: 0.99,
      // onDragStart: () => {
      //   audioRef.current.playbackRate = 0.1
      //   audioRef.current.play()
      // },
      onDrag: function (event) {
        // If you void the dragging by going up/down too much before tearing
        if (this.__void) return false
        // If the strip is torn, then you can move it around the page
        if (this.__torn) {
          return gsap.to(tabRef.current, {
            x: this.x - stripRef.current.offsetWidth * 2,
            y: this.y,
            duration: 0.1,
          })
        }
        // Void the drag if you go too high up or down
        const HANDLE_HEIGHT = handleRef.current.offsetHeight
        if (
          this.y < this.startY - HANDLE_HEIGHT * 0.5 ||
          this.y > this.startY + HANDLE_HEIGHT * 0.5
        ) {
          return (this.__void = true)
        }
        // Update the dragResistance as you tear.
        // TODO:: Would be ideal to have some resistance added again before the end.
        // But, it flakes out. Could be a GSAP bug :thinking:
        if (this.x > this.startX) {
          // Trick here is to clamp agains the current dragResistance. It can only go down.
          this.dragResistance = gsap.utils.clamp(
            0,
            this.dragResistance,
            gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE, 0.99, 0, this.x)
          )
        }
        if (!this.__torn) {
          // Map the clip of the strip based on the handle position
          const clip = gsap.utils.mapRange(
            0,
            stripRef.current.offsetWidth * 2,
            0,
            stripRef.current.offsetWidth,
            this.x
          )
          gsap.set(tabRef.current, {
            clipPath: `inset(-100% -1000% -100% ${clip}px)`,
          })
        }

        // Set custom props for use across the strip
        gsap.set(stripRef.current, {
          '--tab-darkness': gsap.utils.clamp(
            10,
            80,
            gsap.utils.mapRange(0, stripRef.current.offsetWidth, 10, 80, this.x)
          ),
          '--shadow-spread': gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(
              stripRef.current.offsetWidth * 0.25,
              stripRef.current.offsetWidth,
              0,
              1,
              this.x
            )
          ),
          '--shadow-reveal': gsap.utils.clamp(0, 1, gsap.utils.mapRange(stripRef.current.offsetWidth * 0.1, stripRef.current.offsetWidth * 0.2, 0, 1, this.x)),
          '--shadow-width': this.x * 0.5,
          '--bg-size': this.x * 0.5,
          '--shadow-multiplier': gsap.utils.clamp(
            0.8,
            0.9,
            gsap.utils.mapRange(
              stripRef.current.offsetWidth,
              stripRef.current.offsetWidth * 2,
              0.8,
              0.9,
              this.x
            )
          ),
        })

        // Move the icon
        gsap.set(iconRef.current, {
          scaleX: gsap.utils.clamp(0.75, 1, gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE, 1, 0.75, this.x)),
          xPercent: gsap.utils.clamp(0, 50, gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE, 0, 50, this.x)),
        })

        // Start moving the back of the strip
        gsap.set(backingRef.current, {
          transformOrigin: '0% 50%',
          x: this.x,
        })

        gsap.set(shadowRef.current, {
          x: this.x * 0.5,
          xPercent: -90,
          scaleX: gsap.utils.clamp(
            1,
            2,
            gsap.utils.mapRange(
              stripRef.current.offsetWidth,
              stripRef.current.offsetWidth * 2,
              1,
              2,
              this.x
            )
          ),
          opacity:
            this.x > stripRef.current.offsetWidth
              ? gsap.utils.clamp(
                  0,
                  1,
                  gsap.utils.mapRange(
                    stripRef.current.offsetWidth,
                    stripRef.current.offsetWidth * 2,
                    1,
                    0,
                    this.x
                  )
                )
              : gsap.utils.clamp(
                  0,
                  1,
                  gsap.utils.mapRange(15, 100, 0, 1, this.x)
                ),
        })

        // Handle can't go below 0 until torn.
        const x = this.__torn
          ? this.x
          : gsap.utils.clamp(0, window.innerWidth, this.x)
        gsap.set(handleRef.current, {
          x,
        })

        // Here we scale the strip based on tear position which gives the "perception" of depth.
        if (this.x < stripRef.current.offsetWidth) {
          gsap.set(backingRef.current, {
            scaleX: gsap.utils.clamp(
              0.9,
              1,
              gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE * 2, 1, 0.9, this.x)
            ),
          })
        } else {
          gsap.set(backingRef.current, {
            scaleX: gsap.utils.clamp(
              0.9,
              1,
              gsap.utils.mapRange(
                stripRef.current.offsetWidth * 2 - DISTANCE_OF_RESISTANCE * 2,
                stripRef.current.offsetWidth * 2,
                0.9,
                1,
                this.x
              )
            ),
          })
        }

        // We also could update the trigger handle position.
        // That gives us the ease to return to the right spot.
        // In fact, here we double up the trigger width so the grab handle is easier to find
        if (this.x < stripRef.current.offsetWidth) {
          gsap.set(handleRef.current, {
            xPercent: gsap.utils.clamp(
              -100,
              0,
              gsap.utils.mapRange(
                0,
                DISTANCE_OF_RESISTANCE * 2,
                0,
                -100,
                this.x
              )
            ),
          })
        }

        // Another piece where we update the bounds based on drag distance
        if (this.x > stripRef.current.offsetWidth * 1.99) {
          this.__torn = true
          gsap.to(backingRef.current, {
            xPercent: 25,
            ease: 'elastic.out(1, 0.9)',
            '--bg-alpha': 0.75,
          })
        }
      },
      // On release, if we've torn, drop the strip and fade it out...
      onRelease: function (event) {
        // Reset in case we want to try and drag again...
        this.__void = false
        // Do releasing stuff
        if (this.__torn) {
          // this is where you drag the thing and then clear it all up.
          gsap.to(tabRef.current, {
            ...DROP_PROPS,
            onComplete: () => {
              setTorn(true)
            },
          })
        }
      },
    })
  }, [])
  // Handle when things get torn
  React.useEffect(() => {
    if (torn) {
      // Kill off the Draggable instance
      draggableRef.current[0].kill()
    }
  }, [torn])

  // Function that does the strip clean
  const tearStrip = () => {
    stripRef.current.querySelector('button').disabled = true
    const duration = audioRef.current.duration * 2
    gsap
      .timeline({
        onStart: () => {
          audioRef.current.playbackRate = 0.5
          audioRef.current.play()
        },
        onComplete: () => {
          setTorn(true)
          stripRef.current.querySelector('button').blur()
        },
      })
      .to(stripRef.current, {
        '--shadow-width': stripRef.current.offsetWidth,
        '--shadow-spread': 1,
        '--bg-size': stripRef.current.offsetWidth,
        duration,
      })
      .to(stripRef.current, {
        '--tab-darkness': 80,
        duration: duration * 0.25,
      }, 0)
      .to(handleRef.current, {
        x: stripRef.current.offsetWidth * 2,
        duration,
      }, 0)
      .to(
        backingRef.current,
        {
          x: stripRef.current.offsetWidth * 2,
          duration,
        },
        0
      )
      .to(
        tabRef.current,
        {
          duration,
          clipPath: `inset(-100% -1000% -100% ${stripRef.current.offsetWidth}px)`,
        },
        0
      )
      .to(tabRef.current, {
        ...DROP_PROPS,
      })
  }

  return (
    <div ref={stripRef} className="tear-strip">
      <button
        className="sr-only"
        title="Tear open"
        aria-pressed={torn ? true : false}
        onClick={tearStrip}
      ></button>
      <div
        className="tear-strip__content"
        aria-hidden={torn ? false : true}
        aria-live={torn ? 'polite' : 'off'}
      >
        <p>{children}</p>
      </div>
      <span ref={shadowRef} className="tear-strip__shadow"></span>
      {!torn && (
        <>
          <div ref={tabRef} className="tear-strip__strip">
            <svg
              ref={iconRef}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
            <div ref={backingRef} className="tear-strip__back">
              <div className="tear-strip__back-shadow"></div>
              <div className="tear-strip__backing"></div>
            </div>
            <span className="strip-text">Tear open</span>
          </div>
          <div ref={handleRef} className="tear-strip__handle handle"></div>
        </>
      )}
    </div>
  )
}

const SLIDE_PROPS = {
  delay: 0.15,
  ease: 'power4.in',
  duration: 2,
}

const DROP_PROPS = {
  yPercent: 1000,
  rotate: -20,
  opacity: 0,
  duration: 0.65,
}

const App = () => {
  const [strips, setStrips] = React.useState([
    {
      id: self.crypto.randomUUID(),
      content: 'inner radius = outer radius - padding',
    },
  ])
  const addStrip = () => {
    setStrips([
      ...strips,
      {
        id: self.crypto.randomUUID(),
        content: 'inner radius = outer radius - padding',
      },
    ])
  }

  // Animate in the new strip
  React.useEffect(() => {
    // Animate the strips upwards and then pop the first one off.
    if (strips.length === 2) {
      gsap
        .timeline({
          onComplete: () => {
            setStrips([strips[1]])
          },
        })
        .to('section:first-of-type', {
          yPercent: -100,
          ...SLIDE_PROPS,
        })
        .from(
          'section:last-of-type',
          {
            yPercent: 100,
            ...SLIDE_PROPS,
          },
          0
        )
    }
  }, [strips])

  return (
    <main>
      <button
        className="strip-adder"
        aria-disabled={strips.length > 1}
        disabled={strips.length > 1}
        onClick={addStrip}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <span className="sr-only">Get new strip</span>
      </button>
      {strips.map((strip) => {
        return (
          <section key={strip.id}>
            <TearStrip>{strip.content}</TearStrip>
          </section>
        )
      })}
    </main>
  )
}

render(<App />, ROOT_NODE)

// If you want the vanilla JS version...
// const STRIP = document.querySelector('.tear-strip')
// const HANDLE = STRIP.querySelector('.tear-strip__handle')
// const CONTROL = STRIP.querySelector('button')
// const CONTENT = STRIP.querySelector('.tear-strip__content')
// const DISTANCE_OF_RESISTANCE = STRIP.offsetWidth * 0.25

// gsap.set(HANDLE, { x: 0, y: 0 })

// It's a dummy element that gets used to track the positions
// const PROXY = document.createElement('div')
// const Tearer = Draggable.create(PROXY, {
//   type: 'x,y',
//   trigger: HANDLE,
//   allowContextMenu: true,
//   // Drag resistance eases off as you drag the thing.
//   dragResistance: 0.99,
//   onDrag: function (event) {
//     // This is where your magic happens
//     if (this.__void) return false

//     if (this.__torn) {
//       // Move the strip around and do stuff.
//       gsap.to('.tear-strip__strip', {
//         x: this.x - STRIP.offsetWidth * 2,
//         y: this.y,
//         duration: 0.1,
//       })
//       return
//     }

//     // NOTE:: We could do a thing here where we only update if "y" is within the bounds, right?
//     // If this.y < handle.size * 0.5 or > handle.size > 0.5 do nothing....
//     // Need to base this on startY as that will change over time from the first drag
//     const HANDLE_HEIGHT = HANDLE.offsetHeight
//     if (
//       this.y < this.startY - HANDLE_HEIGHT * 0.5 ||
//       this.y > this.startY + HANDLE_HEIGHT * 0.5
//     ) {
//       return this.__void = true
//     }
//     // Update the dragResistance as you tear. Can only go down and not back up?? Bug?
//     if (this.x > this.startX) {
//       this.dragResistance = gsap.utils.clamp(
//         0,
//         this.dragResistance,
//         gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE, 0.99, 0, this.x)
//       )
//     }

//     console.info(this.__torn)

//     // Map the clip of the strip based on the handle position
//     const clip = gsap.utils.mapRange(
//       0,
//       STRIP.offsetWidth * 2,
//       0,
//       STRIP.offsetWidth,
//       this.x
//     )
//     if (!this.__torn) {
//       gsap.set('.tear-strip__strip', {
//         clipPath: `inset(0 -1000% 0 ${clip}px)`,
//       })
//     }

//     // Start moving the back of the strip
//     gsap.set('.tear-strip__back', {
//       x: gsap.utils.mapRange(
//         0,
//         STRIP.offsetWidth * 2,
//         0,
//         STRIP.offsetWidth * 2,
//         this.x
//       ),
//     })

//     // Handle can't go below 0 until torn.
//     const x = this.__torn
//       ? this.x
//       : gsap.utils.clamp(0, window.innerWidth, this.x)
//     gsap.set('.tear-strip__handle', {
//       x,
//     })

//     // Here we scale the strip based on tear position which gives the "perception" of depth.
//     if (this.x < STRIP.offsetWidth) {
//       gsap.set('.tear-strip__back', {
//         scaleX: gsap.utils.clamp(
//           0.9,
//           1,
//           gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE * 2, 1, 0.9, this.x)
//         ),
//       })
//     } else {
//       gsap.set('.tear-strip__back', {
//         scaleX: gsap.utils.clamp(
//           0.9,
//           1,
//           gsap.utils.mapRange(
//             STRIP.offsetWidth * 2 - DISTANCE_OF_RESISTANCE * 2,
//             STRIP.offsetWidth * 2,
//             0.9,
//             1,
//             this.x
//           )
//         ),
//       })
//     }

//     // We also could update the trigger handle position.
//     // That gives us the ease to return to the right spot.
//     // In fact, here we double up the trigger width so the grab handle is easier to find
//     if (this.x < STRIP.offsetWidth) {
//       gsap.set('.handle__grab', {
//         xPercent: gsap.utils.clamp(
//           -100,
//           0,
//           gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE * 2, 0, -100, this.x)
//         ),
//       })
//     } else {
//       gsap.set('.handle__grab', {
//         xPercent: gsap.utils.clamp(
//           -100,
//           0,
//           gsap.utils.mapRange(
//             STRIP.offsetWidth * 2 - DISTANCE_OF_RESISTANCE * 2,
//             STRIP.offsetWidth * 2,
//             -100,
//             0,
//             this.x
//           )
//         ),
//       })
//     }

//     // Another piece where we update the bounds based on drag distance
//     if (this.x > STRIP.offsetWidth * 1.99) {
//       this.__torn = true
//       gsap.to('.tear-strip__back', {
//         xPercent: 25,
//         ease: 'elastic.out(1, 0.9)'
//       })
//     }
//   },
//   // On release, if we've torn, drop the strip and fade it out...
//   onRelease: function (event) {
//     // Reset in case we want to try and drag again...
//     this.__void = false
//     // Do releasing stuff
//     if (this.__torn) {
//       // this is where you drag the thing and then clear it all up.
//       gsap.to('.tear-strip__strip', {
//         yPercent: 500,
//         rotate: -20,
//         opacity: 0,
//         onComplete: () => {
//           console.info({ dragger: this })
//           this.kill()
//           document.querySelector('.tear-strip__strip').remove()
//           HANDLE.remove()
//         }
//       })
//       // Should we allow for putting it back? Doesn't really make sense.
//       // But you could somehow revert the strip somehow.
//     }
//   },
// })
