import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)


const STRIP = document.querySelector('.tear-strip')
const DISTANCE_OF_RESISTANCE = STRIP.offsetWidth * 0.25

const Tearer = Draggable.create('.tear-strip__handle', {
  type: 'x',
  allowContextMenu: true,
  bounds: {
    left: 0,
    right: 1000,
  },
  // Drag resistance eases off as you drag the thing.
  dragResistance: 0.99,
  onDrag: function (event) {
    // This is where your magic happens
    
    // Update the dragResistance. It can only go down, not back up.
    if (this.x > this.startX) {
      this.dragResistance = gsap.utils.clamp(
        0,
        this.dragResistance,
        gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE, 0.99, 0, this.x)
      )
    }

    // Map the clip of the strip based on the handle position
    const clip = gsap.utils.mapRange(0, STRIP.offsetWidth * 2, 0, 150, this.x)
    gsap.set('.tear-strip__strip', {
      clipPath: `inset(0 0 0 ${clip}%)`
    })

    // Another piece where we update the bounds based on drag distance
    if (this.x > STRIP.offsetWidth * 2) {
      console.info('here')
      this.applyBounds(document.body)
    }
  },
  // On release, if we've torn, drop the strip and fade it out...
  onRelease: function (event) {
    console.info('RELEASE')
    console.info({ event, Tearer })
  },
})
