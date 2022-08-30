// var windowRatio = 1;
// function setDimensions() {
//   // Set animation duration with window ratio to get a 45° angle
//   document.querySelector('.x-bounce').style.animationDuration = `${(4 + 2*Math.random()) * window.innerWidth / window.innerHeight}s`;
//   document.querySelector('.y-bounce').style.animationDuration = `${4 + 2*Math.random()}s`;
//   // Hack to deal with vh going offscreen
//   document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
// }
// setDimensions();
// window.addEventListener('resize', setDimensions);

// function randomStart(e) {
//   // Get time in seconds and chop tailing s
//   const duration = parseFloat(e.target.style.animationDuration.slice(0, -1));
//   // Random point in the duration * 1000 for milliseconds * 2 for alterating animation
//   e.target.getAnimations()[0].currentTime = Math.random() * duration * 1000 * 2;
// }
// document.querySelector('.x-bounce').addEventListener('animationstart', randomStart);
// document.querySelector('.y-bounce').addEventListener('animationstart', randomStart);

// // Select a random color for the logo
// const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'magenta'];
// var current = Math.floor(Math.random() * (colors.length - 1));

// // Change the logo color on each bounce
// function randomColor() {
//   const next = Math.floor(Math.random() * (colors.length - 1));
//   current = (current === next) ? (next + 1) % (colors.length - 1) : next;
//   document.querySelector('.logo>path').style.fill = colors[current];
// }
// randomColor();
// document.querySelector('.x-bounce').addEventListener('animationiteration', randomColor);

const randomInRange = (min, max) =>
  Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
  )

const POPUP = document.querySelector("#screensaver");
const RING = document.querySelector("svg");
const SCALE = document.querySelector(".dvd__scale")
const SLIDE = document.querySelector(".dvd__slide")
const DVD = document.querySelector('.dvd')
const MOVERS = [SLIDE, SCALE]
const SCREENSAVER_THRESHOLD = 4000
const BOUNCE_THRESHOLD = 2 // ms between bounces for a cheer. Ideal is 0 for a corner.

let checker;
let screensaverTimeout;
const EVENT_TYPES = ["pointermove", "keypress", "keydown", "keyup", "scroll", "click"]

const setSaverTimer = () => {
  if (screensaverTimeout) {
    clearTimeout(screensaverTimeout);
    document.body.classList.remove('timing')
  }

  if (!POPUP.matches(':open')) {
    screensaverTimeout = setTimeout(() => {
      document.body.classList.remove('timing')
      POPUP.showPopUp();
    }, SCREENSAVER_THRESHOLD);
    requestAnimationFrame(() => {
      document.body.classList.add('timing')
    })
  }
}

const BOUNCES = {
  dvd__scale: 0,
  dvd__slide: 0,
}


const CHEER = new Audio(new URL('./grunt-party--optimised.mp3', import.meta.url))

const handleBounce = e => {
  BOUNCES[e.target.className] = Date.now()
  DVD.style.setProperty('--hue', randomInRange(0, 359))
  const diff = Math.abs(BOUNCES.dvd__scale - BOUNCES.dvd__slide) 
  if (diff <= BOUNCE_THRESHOLD) CHEER.play()
}


POPUP.addEventListener('hide', () => {
  setSaverTimer()
})

POPUP.addEventListener('show', () => {
  DVD.style.setProperty('--hue', randomInRange(0, 359))
  MOVERS.forEach(el => {
    const duration = randomInRange(2, 6)
    el.style = `
      --duration: ${duration};
      --delay: ${duration * Math.random()};
    `
  })
})

MOVERS.forEach(mover => mover.addEventListener('animationiteration', handleBounce))

EVENT_TYPES.forEach((e) =>                                                           
  document.body.addEventListener(e, setSaverTimer)
)

document.body.classList.add('timing')
document.documentElement.style.setProperty('--threshold', SCREENSAVER_THRESHOLD)
setSaverTimer();