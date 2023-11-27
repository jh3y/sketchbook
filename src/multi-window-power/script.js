import gsap from 'gsap'
import debounce from 'https://cdn.skypack.dev/debounce'

class Window {
  constructor() {
    this.init()
    return this
  }
  init() {
    const current = JSON.parse(window.localStorage.getItem('screens')) || {}
    const that = this
    that.isPrimary = Object.keys(current).length === 0
    that.id = crypto.randomUUID()
    that.meta = {
      left: screenLeft,
      top: screenTop,
      height: outerHeight,
      width: outerWidth,
    }
    that.broadcastChannel = new BroadcastChannel('window_manager')
    current[that.id] = { ...that }
    window.localStorage.setItem('screens', JSON.stringify(current))
    window.addEventListener('beforeunload', that.drop.bind(that))
    gsap.ticker.add(that.sync.bind(that))
    that.broadcastChannel.onmessage = (event) => {
      if (event.data.kill) window.close()
    }

    if (that.isPrimary) {
      // Add power bank button
      const BUTTON = Object.assign(document.createElement('button'), {
        className: 'power-up',
        innerText: 'Power Up'
      })
      document.body.appendChild(BUTTON)
      BUTTON.addEventListener('click', () => window.open(window.location.href, '_blank', 'height=600,width=600,resizable=no'))
    } else {
      window.addEventListener('resize', debounce(() => window.resizeTo(600, 600), 200))
    }
  }
  drop() {
    const that = this
    const current = JSON.parse(window.localStorage.getItem('screens')) || {}
    delete current[that.id]
    window.localStorage.setItem('screens', JSON.stringify(current))
    if (this.isPrimary) this.broadcastChannel.postMessage({ kill: true })
  }
  sync() {
    const that = this
    that.meta = {
      left: screenLeft,
      top: screenTop,
      height: outerHeight,
      width: outerWidth,
    }
    // This is for checking...
    const current = JSON.parse(window.localStorage.getItem('screens'))
    current[that.id].meta = that.meta
    window.localStorage.setItem('screens', JSON.stringify(current))

    if (Object.keys(current).length === 2) {
      console.info('check')
      const primary = current[Object.keys(current).filter(id => current[id].isPrimary)[0]]
      const sub = current[Object.keys(current).filter(id => !current[id].isPrimary)[0]]
      console.info({ primary: primary.meta.left + primary.meta.width, sub: sub.meta.left })
      // Allow for some leniency
      const THRESHOLD = 10
      if ((sub.meta.left >= ((primary.meta.left + primary.meta.width) - THRESHOLD)) && (sub.meta.left <= ((primary.meta.left + primary.meta.width) + THRESHOLD))) {
        console.info('match left')
        document.body.style.background = 'green'
      } else {
        document.body.style.background = 'white'
      }
    }
  }
}

const currentWindows = JSON.parse(window.localStorage.getItem('screens')) || {}
if (Object.keys(currentWindows).length < 2) new Window()
else document.body.innerText = 'You do not need me...'