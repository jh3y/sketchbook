import "../../../../net/experimental-web-platform/script.js";

const POPUP = document.querySelector("#inactivity-pop-up");
const RING = document.querySelector("svg");
const BUTTON = document.querySelector('button.destructive')

const SCREENSAVER_THRESHOLD = 4000
const DESTRUCTIVE_THRESHOLD = 9


let checker;
let screensaverTimeout;
let secondsInterval;
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

const destroy = () => {
  if (secondsInterval) clearInterval(secondsInterval)

  document.body.style = `
    display: grid;
    place-items: center;
  `
  document.body.innerHTML = "<p>it's gone...</p>"

  if (screensaverTimeout) {
    clearTimeout(screensaverTimeout);
    document.body.classList.remove('timing')
  }
  
  EVENT_TYPES.forEach((e) =>                                                           
    document.body.removeEventListener(e, setSaverTimer)
  );
}

document.body.classList.add('timing')
document.documentElement.style.setProperty('--threshold', SCREENSAVER_THRESHOLD)


POPUP.addEventListener('hide', () => {
  if (POPUP.parentNode) setSaverTimer()
  if (secondsInterval) clearInterval(secondsInterval)
})

const SECONDS = document.querySelector('.seconds')

POPUP.addEventListener('show', () => {
  SECONDS.innerText = DESTRUCTIVE_THRESHOLD
  secondsInterval = setInterval(() => {
    SECONDS.innerText -= 1
    if (parseInt(SECONDS.innerText, 10) === 0) destroy()
  }, 1000)
})

BUTTON.addEventListener('click', destroy)

setSaverTimer();

EVENT_TYPES.forEach((e) =>                                                           
  document.body.addEventListener(e, setSaverTimer)
);