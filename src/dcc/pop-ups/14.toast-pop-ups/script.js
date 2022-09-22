import "../../../../net/experimental-web-platform/script.js";

const TOASTER = document.querySelector('button')

const TOASTS = document.querySelector('.toasts')
const DRAWER = TOASTS.querySelector('.toasts__drawer')


const removeSlice = (slice, timeoutId) => () => {
  const ANIMATION = slice.animate({
    transform: 'translateX(200%) scale(0)'
  }, {
    duration: 250,
    easing: 'ease-in'
  })
  ANIMATION.finished.then(() => {
    slice.remove()
    if (timeoutId) clearTimeout(timeoutId)
    // I mean, is there a penalty in having the :top-layer always open
    // if it doesn't obstruct?
    if (DRAWER.children.length === 0) TOASTS.hidePopUp()
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
    text: 'You made this happen! 🎉',
    icon: `<svg viewBox="0 0 512 512" title="check-double">
  <path d="M505 174.8l-39.6-39.6c-9.4-9.4-24.6-9.4-33.9 0L192 374.7 80.6 263.2c-9.4-9.4-24.6-9.4-33.9 0L7 302.9c-9.4 9.4-9.4 24.6 0 34L175 505c9.4 9.4 24.6 9.4 33.9 0l296-296.2c9.4-9.5 9.4-24.7.1-34zm-324.3 106c6.2 6.3 16.4 6.3 22.6 0l208-208.2c6.2-6.3 6.2-16.4 0-22.6L366.1 4.7c-6.2-6.3-16.4-6.3-22.6 0L192 156.2l-55.4-55.5c-6.2-6.3-16.4-6.3-22.6 0L68.7 146c-6.2 6.3-6.2 16.4 0 22.6l112 112.2z" />
</svg>`
  },
  {
    type: TOAST_TYPES.INFO,
    text: () => `It's currently ${new Date().toTimeString().slice(0, 8)} 🕰`,
    icon: `<svg viewBox="0 0 192 512" title="info">
  <path d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z" />
</svg>`
  },
  {
    type: TOAST_TYPES.WARNING,
    text: 'You haven\'t finished yet 👀',
    icon: `<svg viewBox="0 0 576 512" title="exclamation-triangle">
  <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" />
</svg>`
  },
  {
    type: TOAST_TYPES.DESTRUCTIVE,
    text: 'Something went wrong 😱',
    icon: `<svg viewBox="0 0 512 512" title="thumbs-down">
  <path d="M0 56v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H24C10.745 32 0 42.745 0 56zm40 200c0-13.255 10.745-24 24-24s24 10.745 24 24-10.745 24-24 24-24-10.745-24-24zm272 256c-20.183 0-29.485-39.293-33.931-57.795-5.206-21.666-10.589-44.07-25.393-58.902-32.469-32.524-49.503-73.967-89.117-113.111a11.98 11.98 0 0 1-3.558-8.521V59.901c0-6.541 5.243-11.878 11.783-11.998 15.831-.29 36.694-9.079 52.651-16.178C256.189 17.598 295.709.017 343.995 0h2.844c42.777 0 93.363.413 113.774 29.737 8.392 12.057 10.446 27.034 6.148 44.632 16.312 17.053 25.063 48.863 16.382 74.757 17.544 23.432 19.143 56.132 9.308 79.469l.11.11c11.893 11.949 19.523 31.259 19.439 49.197-.156 30.352-26.157 58.098-59.553 58.098H350.723C358.03 364.34 384 388.132 384 430.548 384 504 336 512 312 512z" />
</svg>`
  },
  {
    type: TOAST_TYPES.TIMED,
    text: 'Timed toast ⏱',
    icon: `<svg viewBox="0 0 512 512" title="history">
  <path d="M504 255.531c.253 136.64-111.18 248.372-247.82 248.468-59.015.042-113.223-20.53-155.822-54.911-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184 0-101.705-82.311-184-184-184-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531zm-180.912 78.784l9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21z" />
</svg>`
  },
]


const makeToast = () => {
  // Create a toast...
  const { icon, text, type } = TOAST_OBJECTS[Math.floor(Math.random() * TOAST_OBJECTS.length)]
  
  const slice = document.createElement('li')
  const sliceControl = document.createElement('button')
  sliceControl.className = 'toasts__slice-control'
  slice.appendChild(sliceControl)
  slice.classList.add('toasts__slice')
  slice.classList.add(`toasts__slice--${type}`)
  sliceControl.innerHTML = icon 
  sliceControl.innerHTML += `<span class="toast__text">${typeof text === 'function' ? text() : text}</span>`
  sliceControl.innerHTML += `<svg class="toast__close" viewBox="0 0 352 512" title="times">
  <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
</svg>`
  // Add it to the drawer
  DRAWER.appendChild(slice)
  TOASTS.scrollTo({ left: 0, top: DRAWER.scrollHeight, behavior: 'smooth'})
  // Show the drawer
  if (!TOASTS.matches(':open')) TOASTS.showPopUp()
  // Dummy types
  let timeoutId
  if (type === TOAST_TYPES.TIMED) {
    timeoutId = setTimeout(removeSlice(slice, undefined), Math.random() * 4000 + 1000)
  }
  // Event Slicing
  slice.addEventListener('click', removeSlice(slice, timeoutId))
  // Toast will either have a timeout or require user intervention
  // When a toast closes, check if the drawer should be closed
  // That is essentially removing the top layer
}

TOASTER.addEventListener('click', makeToast)