const TOASTER = document.querySelector('button')

const TOASTS = document.querySelector('.toasts')
const DRAWER = TOASTS.querySelector('.toasts__drawer')

let handler
let deactivator

const VELOCITY_THRESHOLD = 40

const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const clamp = (min, max, value) => Math.min(Math.max(value, min), max)

const vmin = () => Math.min(window.innerHeight, window.innerWidth) / 100

const deactivateDrag = el => ({ type, x, y, movementX, movementY }) => {
  const slice = el.closest('.toasts__slice')
  const spinner = el.closest('.toasts__slice-spinner')
  // Reset things before deciding on the removal method
  if (!spinner.velocity) {
    removeSlice(slice, true)()
  } else {
    // Grab the distance moved
    const distance = {
      y: y - spinner.dismiss.y,
    }
    const { height } = el.getBoundingClientRect()

    const velocity = Math.abs(spinner.velocity.y)
    
    // Remove the slice if the dismiss threshold is met.  
    if (velocity > VELOCITY_THRESHOLD) {
      spinner.style.setProperty('--speed', 0)
      removeSlice(slice, false, 300)()
    } else if (distance.y >= height * 0.9) {
      spinner.style.setProperty('--speed', 0)
      removeSlice(slice, false, 400)()
    } else {
      // Else zip it back to where it came from
      spinner.velocity = false
      // Use this to calculate zip back speed
      const speed = clamp(0.25, 1, mapRange(0, height, 1, 0.25)(Math.abs(distance.y)))
      spinner.style.setProperty('--speed', Math.abs(speed))
      spinner.style.setProperty('--translate-y', 0)
    }

  }
  
  // Reset all the things
  el.style.cursor = 'grab'
  spinner.dismiss = { x: 0, y: 0 }
  document.body.style.cursor = "initial"
  document.body.removeEventListener('pointermove', handler)
  document.body.removeEventListener('pointerup', deactivator)
  
}

const handleDrag = el => ({ x, y, movementX, movementY }) => {
  const spinner = el.closest('.toasts__slice-spinner')
  
  const { height } = el.getBoundingClientRect()
  // Set the current velocity
  spinner.velocity = {
    y: movementY
  }
  // The limit is 10vmin in either direction.
  const translateY = clamp(-height, height, y - spinner.dismiss.y)
  // Set that via a custom property
  spinner.style.setProperty('--translate-y', translateY)
}

const activateDrag = el => ({ y }) => {
  const spinner = el.closest('.toasts__slice-spinner')
  // Set an initial starter point
  spinner.dismiss = { y }
  // Remove any transition that's available
  spinner.style.setProperty('--speed', 0)
  // Set the cursor style while "grabbing"
  el.style.cursor = document.body.style.cursor = "grabbing"
  // Set the handlers to local variables for use
  handler = handleDrag(el)
  deactivator = deactivateDrag(el)
  // Assign those handlers. Use local variables so we can easily remove on pointerup
  document.body.addEventListener('pointermove', handler)
  document.body.addEventListener('pointerup', deactivator)
}


const syncDrawer = () => {
  const TOAST = [...DRAWER.children]
  // Loop through all drawers and set the index correctly.
  TOAST.forEach((slice, index) => {
    const animIndex = (TOAST.length - 1) - index
    slice.setAttribute('data-index', animIndex)
    slice.style.setProperty('--index', animIndex)
  })

  DRAWER.style.setProperty('--count', TOAST.length)
}

const removeSlice = (slice, boring, distance = 300) => () => {
  TOASTS.classList.add('toasts--animating')
  const index = parseInt(slice.getAttribute('data-index'), 10)
  let animation
  if (boring) {
    animation = slice.querySelector('.toasts__slice-jumper').animate([
      {
        transform: 'translateX(100%) scale(0)'
      }
    ], {
      duration: 250,
      fill: 'both'
    })
  } else {
    animation = slice.animate([
      {
        transform: `
          translate3d(
            0,
            ${index * -5}%,
            ${index * -4}px
          )
          scale(${Math.max(0, 1 - (index * 0.02))})
          translateY(-75%)
          rotate(5deg)
        `
      },
      {
        transform: `
          translate3d(
            0,
            ${index * -5}%,
            ${DRAWER.children.length * -10}px
          )
          scale(${Math.max(0, 1 - (DRAWER.children.length * 0.02))})
          translateY(0%)
          rotate(0deg)
        `
      }
      
    ]
    , {
      duration: 500,
      fill: 'forwards'
    })
    
    slice.querySelector('.toasts__slice-jumper').animate([
      {
        transform: `translate3d(0, -${distance}%, 0)`,
        offset: 0.5
      },
    ], {
      duration: 500
    })

    slice.querySelector('button').animate([
      {
        transform: 'rotate(360deg)'
      }
    ], {
      duration: 500
    })

    slice.querySelector('.toasts__slice-spinner').animate([
    {
      transform: 'scale(0.5)',
      opacity: 0,
    }
    ], {
      delay: 400,
      duration: 100
    })
  }

  animation.finished.then(() => {
    TOASTS.classList.remove('toasts--animating')
    slice.remove()
    syncDrawer()
    // I mean, is there a penalty in having the :top-layer always open
    // if it doesn't obstruct?
    if (DRAWER.children.length === 0 && TOASTS.matches(':open')) TOASTS.hidePopUp()
  })
}


const TOAST_TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  TIMED: 'timed',
  WARNING: 'warning',
  DESTRUCTIVE: 'destructive',
}

const TOAST_OBJECTS = [
  {
    type: TOAST_TYPES.SUCCESS,
    text: 'You made this happen!',
    icon: `<svg viewBox="0 0 512 512" title="check-double">
  <path d="M505 174.8l-39.6-39.6c-9.4-9.4-24.6-9.4-33.9 0L192 374.7 80.6 263.2c-9.4-9.4-24.6-9.4-33.9 0L7 302.9c-9.4 9.4-9.4 24.6 0 34L175 505c9.4 9.4 24.6 9.4 33.9 0l296-296.2c9.4-9.5 9.4-24.7.1-34zm-324.3 106c6.2 6.3 16.4 6.3 22.6 0l208-208.2c6.2-6.3 6.2-16.4 0-22.6L366.1 4.7c-6.2-6.3-16.4-6.3-22.6 0L192 156.2l-55.4-55.5c-6.2-6.3-16.4-6.3-22.6 0L68.7 146c-6.2 6.3-6.2 16.4 0 22.6l112 112.2z" />
</svg>`
  },
  {
    type: TOAST_TYPES.INFO,
    text: () => `It's currently ${new Date().toTimeString().slice(0, 8)}`,
    icon: `<svg viewBox="0 0 192 512" title="info">
  <path d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z" />
</svg>`
  },
  {
    type: TOAST_TYPES.WARNING,
    text: 'You haven\'t finished yet',
    icon: `<svg viewBox="0 0 576 512" title="exclamation-triangle">
  <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" />
</svg>`
  },
  {
    type: TOAST_TYPES.DESTRUCTIVE,
    text: 'Something went wrong',
    icon: `<svg viewBox="0 0 512 512" title="thumbs-down">
  <path d="M0 56v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H24C10.745 32 0 42.745 0 56zm40 200c0-13.255 10.745-24 24-24s24 10.745 24 24-10.745 24-24 24-24-10.745-24-24zm272 256c-20.183 0-29.485-39.293-33.931-57.795-5.206-21.666-10.589-44.07-25.393-58.902-32.469-32.524-49.503-73.967-89.117-113.111a11.98 11.98 0 0 1-3.558-8.521V59.901c0-6.541 5.243-11.878 11.783-11.998 15.831-.29 36.694-9.079 52.651-16.178C256.189 17.598 295.709.017 343.995 0h2.844c42.777 0 93.363.413 113.774 29.737 8.392 12.057 10.446 27.034 6.148 44.632 16.312 17.053 25.063 48.863 16.382 74.757 17.544 23.432 19.143 56.132 9.308 79.469l.11.11c11.893 11.949 19.523 31.259 19.439 49.197-.156 30.352-26.157 58.098-59.553 58.098H350.723C358.03 364.34 384 388.132 384 430.548 384 504 336 512 312 512z" />
</svg>`
  },
]

const makeToast = () => {
  // Create a toast...
  const { icon, text, type } = TOAST_OBJECTS[Math.floor(Math.random() * TOAST_OBJECTS.length)]
  
  const slice = Object.assign(document.createElement('li'), {
    className: `toasts__slice toasts__slice--${type}`,
    innerHTML: `
      <div class="toasts__slice-jumper">
        <div class="toasts__slice-spinner">
          <button class="toasts__slice-control">
            <span class="toasts__slice-folder"></span>
            <span class="toast__text"></span>
          </button>
        </div>
      </div>
    `
  })
  // Add it to the drawer
  DRAWER.appendChild(slice)
  syncDrawer()
  TOASTS.scrollTo({ left: 0, top: DRAWER.scrollHeight, behavior: 'smooth'})
  // Show the drawer
  if (!TOASTS.matches(':open')) TOASTS.showPopUp()
  // Event Slicing
  const CONTROL = slice.querySelector('button')
  CONTROL.addEventListener('pointerdown', activateDrag(CONTROL))
  CONTROL.addEventListener('keydown', ({ keyCode }) => {
    if (keyCode === 13 || keyCode === 32) removeSlice(slice, false)()
  })
  // Toast will either have a timeout or require user intervention
  // When a toast closes, check if the drawer should be closed
  // That is essentially removing the top layer
}

TOASTER.addEventListener('click', makeToast)