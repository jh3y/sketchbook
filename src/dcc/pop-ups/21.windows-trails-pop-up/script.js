import "../../../../net/experimental-web-platform/script.js";

const DRAGGER = document.querySelector('button')
const OG_POP = document.querySelector('[popup].og')

const STATE = {
  active: false,
  count: 0,
  rateLimiter: 1,
  origin: {
    x:0,
    y:0,
  },
  transform: {
    x: 0,
    y: 0,
  },
  movement: {
    x: 0,
    y: 0,
  }
}

const generatePopUp = ({ x, y }) => {
  STATE.movement.x = (STATE.origin.x - x) * -1
  STATE.movement.y = (STATE.origin.y - y) * -1
  
  OG_POP.style.setProperty('--translate-x', STATE.movement.x)
  OG_POP.style.setProperty('--translate-y', STATE.movement.y)
  
  STATE.count += 1
  
  if (STATE.active && (STATE.count % STATE.rateLimiter === 0)) {
    const NEW_POP = Object.assign(document.createElement('div'), {
      popUp: 'manual',
      className: 'popup trail',
      style: `
        --translation-x: ${STATE.movement.x + STATE.transform.x};
        --translation-y: ${STATE.movement.y + STATE.transform.y};
      `,
      innerHTML: `
        <div class="popup__bar">
          <button>
            <span class="sr-only">Close</span>
            <svg class="close-icon" viewBox="0 0 512 512" role="img" aria-labelledby="closeTitle">
              <title>Window close</title>
              <path d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-83.6 290.5c4.8 4.8 4.8 12.6 0 17.4l-40.5 40.5c-4.8 4.8-12.6 4.8-17.4 0L256 313.3l-66.5 67.1c-4.8 4.8-12.6 4.8-17.4 0l-40.5-40.5c-4.8-4.8-4.8-12.6 0-17.4l67.1-66.5-67.1-66.5c-4.8-4.8-4.8-12.6 0-17.4l40.5-40.5c4.8-4.8 12.6-4.8 17.4 0l66.5 67.1 66.5-67.1c4.8-4.8 12.6-4.8 17.4 0l40.5 40.5c4.8 4.8 4.8 12.6 0 17.4L313.3 256l67.1 66.5z" />
            </svg>
          </button>
        </div>
        <div class="popup__content">
          <svg class="info-icon" viewBox="0 0 512 512" role="img" aria-labelledby="infoTitle">
            <title>Info icon in a circle</title>
            <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" />
          </svg>
          <p>Crafted by Jhey Tompkins</p>
        </div>
      `
    })
    document.body.insertBefore(NEW_POP, OG_POP)
    NEW_POP.showPopUp()
    OG_POP.hidePopUp()
    OG_POP.showPopUp()
  }
}

const deactivate = ({ x, y }) => {
  STATE.active = false
  STATE.origin.x = x
  STATE.origin.y = y

  OG_POP.style.setProperty('--translate-x', 0)
  OG_POP.style.setProperty('--translate-y', 0)

  STATE.transform.x += STATE.movement.x
  STATE.transform.y += STATE.movement.y
  STATE.movement.x = 0
  STATE.movement.y = 0
  STATE.count = 0

  OG_POP.style.setProperty('--transformed-x', STATE.transform.x)
  OG_POP.style.setProperty('--transformed-y', STATE.transform.y)
  document.removeEventListener('pointermove', generatePopUp)
  document.removeEventListener('pointerup', deactivate)
  
}

const activate = ({ x, y }) => {
  STATE.active = true
  STATE.origin.x = x
  STATE.origin.y = y
  document.addEventListener('pointermove', generatePopUp)
  document.addEventListener('pointerup', deactivate)
}

DRAGGER.addEventListener('pointerdown', activate)