import gsap from 'gsap'
import debounce from 'https://cdn.skypack.dev/debounce'
import React from 'https://cdn.skypack.dev/react'
import ReactDOM from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')
const STORAGE_KEY = 'windows'

// Utility functions
const readFromStorage = () =>
  JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {}

const writeToStorage = (data) =>
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data }))

const openWindow = ({ height, name, width, top, left, query }) => {
  const newWindow = window.open(
    `${window.location.origin}${query || ''}`,
    name || '_blank',
    `top=${top || 0},left=${left || 0},height=${height || 300},width=${
      width || 300
    }`
  )
  if (!newWindow) console.warn(`window ${name} didn't open`)
}

const useWindow = (collectionName) => {
  const [windows, setWindows] = React.useState(readFromStorage)
  const [id, setId] = React.useState(crypto.randomUUID())
  const [index, setIndex] = React.useState(Object.keys(windows).length)
  const [meta, setMeta] = React.useState({
    left: screenLeft,
    top: screenTop,
    height: outerHeight,
    width: outerWidth,
  })
  const broadcastChannel = React.useRef(new BroadcastChannel(collectionName))

  // Set up the window in storage
  React.useEffect(() => {
    setWindows((windows) => ({
      ...windows,
      [id]: {
        id,
        index,
        meta,
      },
    }))
  }, [])

  // Handle broadcast message to kill other windows on main close
  React.useEffect(() => {
    if (broadcastChannel.current) {
      broadcastChannel.current.onmessage = (event) => {
        if (event.data.kill) window.close()
      }
    }
  }, [])

  const sync = () => {
    const meta = {
      left: screenLeft,
      top: screenTop,
      height: outerHeight,
      width: outerWidth,
    }
    setMeta(meta)
  }

  // Handle page unloading. Should delete other things in storage at this point.
  React.useEffect(() => {
    const handleDrop = () => {
      gsap.ticker.remove(sync)
      const current = { ...windows }
      delete current[id]
      writeToStorage({})
      if (index === 0) {
        broadcastChannel.current.postMessage({ kill: true })
      }
    }
    window.addEventListener('beforeunload', handleDrop)
    return () => {
      window.removeEventListener('beforeunload', handleDrop)
    }
  }, [])

  // This one is for syncing the body position.
  // Here we are setting the position based on screen meta.
  React.useEffect(() => {
    gsap.ticker.add(sync)
    return () => {
      gsap.ticker.remove(sync)
    }
  }, [])

  React.useEffect(() => {
    const current = readFromStorage()
    writeToStorage({
      ...current,
      [id]: {
        id,
        index,
        ...meta,
      },
    })
  }, [meta, windows])

  const resize = (width = outerWidth, height = outerHeight, options) => {
    if (index === 0)
      console.warn(
        "You can't resize the primary window unless opened by another window"
      )
    const proxy = {
      width: outerWidth,
      height: outerHeight,
    }
    gsap.to(proxy, {
      width,
      height,
      ...options,
      onUpdate: function () {
        window.resizeTo(proxy.width, proxy.height)
      },
    })
  }

  const move = (x = screenLeft, y = screenTop, options) => {
    if (index === 0)
      console.warn(
        "You can't move the primary window unless opened by another window"
      )
    const proxy = {
      x: screenLeft,
      y: screenTop,
    }
    gsap.to(proxy, {
      x,
      y,
      ...options,
      onUpdate: function () {
        window.moveTo(proxy.x, proxy.y)
      },
    })
  }

  return {
    broadcastChannel: broadcastChannel.current,
    id,
    index,
    ...meta,
    move,
    resize,
  }
}

const App = () => {
  const { height, id, index, left, move, resize, top, width } =
    useWindow('multi-window')

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const random = urlParams.get('random')
    const grow = urlParams.get('grow')
    // If the random queryString is set and the index isn't the primary one...
    if (index !== 0 && parseInt(random, 10) === 1) {
      const smin = Math.min(screen.availHeight, screen.availHeight)
      const size = gsap.utils.random(smin * 0.2, smin * 0.8, 1)
      const x = gsap.utils.random(0, screen.availWidth - size, 1)
      const y = gsap.utils.random(0, screen.availHeight - size, 1)
      resize(size, size, {
        ease: 'bounce.out',
        delay: 0.12,
        onComplete: () =>
          move(x, y, { ease: 'elastic.out', delay: 0.5, duration: 1 }),
      })
    }
    if (index !== 0 && parseInt(grow, 10) > 0) {
      resize(grow, grow, {
        ease: 'bounce.out'
      })
    }
  }, [])

  const openSingleWindow = () => {
    openWindow({
      height: 300,
      width: 300,
      top: 200,
      left: 200,
      query: '?random=1',
    })
  }

  const openWindowTrail = () => {
    const newWindows = new Array(10).fill({ x: 0 })
    const smin = Math.min(screen.availHeight, screen.availHeight)
    const ease = 'sine.out'
    const size = 100
    const yDist = gsap.utils.distribute({
      base: screen.availHeight * 0.2,
      amount: screen.availHeight * 0.6 - 300,
      from: 0,
      ease,
    })
    const xDist = gsap.utils.distribute({
      base: screen.availWidth * 0.2,
      amount: screen.availWidth * 0.6 - 300,
      from: 0,
      ease,
    })
    const sizeDist = gsap.utils.distribute({
      base: 100,
      amount: 300,
      from: 0,
      ease,
    })

    const tl = gsap.timeline()

    for (let i = 0; i < newWindows.length; i++) {
      const newWindow = newWindows[i]
      const left = xDist(i, newWindow[i], newWindows)
      const top = yDist(i, newWindow[i], newWindows)
      const size = sizeDist(i, newWindow[i], newWindows)
      
      tl.to(newWindow, {
        x: 100,
        duration: 0.045,
        onStart: function () {
          openWindow({
            height: 10,
            width: 10,
            left,
            top,
            query: `?grow=${size}`
          })
        },
      })
    }
  }

  return (
    <main>
      <dl>
        <dt>id:</dt>
        <dd>{id}</dd>
        <dt>index:</dt>
        <dd>{index}</dd>
        <dt>top:</dt>
        <dd>{top}</dd>
        <dt>left:</dt>
        <dd>{left}</dd>
        <dt>width:</dt>
        <dd>{width}</dd>
        <dt>height:</dt>
        <dd>{height}</dd>
      </dl>
      <button onClick={openSingleWindow}>Open Window</button>
      <button onClick={openWindowTrail}>Open Window Trail</button>
    </main>
  )
}

ReactDOM.render(<App />, ROOT_NODE)
