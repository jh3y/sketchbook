import gsap from 'gsap'
import debounce from 'https://cdn.skypack.dev/debounce'
import React from 'https://cdn.skypack.dev/react'
import ReactDOM from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')
const STORAGE_KEY = 'windows'


const useWindow = (collectionName) => {
  const readFromStorage = () =>
    JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {}
  const writeToStorage = (data) =>
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data }))
  const [windows, setWindows] = React.useState(readFromStorage)
  const [id, setId] = React.useState(crypto.randomUUID())
  const [primary, setPrimary] = React.useState(
    Object.keys(windows).length === 0
  )
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
        primary,
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
      const current = {...windows}
      delete current[id]
      writeToStorage({})
      if (primary) {
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
        ...meta,
        id,
        primary,
      },
    })
  }, [meta, windows])

  // const resize = (width = outerWidth, height = outerHeight) => {
  //   if (primary) console.warn("You can't resize the primary window unless opened by another window")
  //   const proxy = {
  //     width: outerWidth, height: outerHeight
  //   }
  //   gsap.to(proxy, {
  //     width,
  //     height,
  //     onUpdate: function() {
  //       window.resizeTo(proxy.width, proxy.height)
  //     }
  //   })
  // }

  return {
    broadcastChannel: broadcastChannel.current,
    id,
    ...meta,
    primary,
    // resize,
  }
}

const App = () => {
  const { id, left } = useWindow('multi-window')

  const openSecondary = () => {
    window.open(window.location.href, '_blank', 'height=600,width=600')
  }

  return (
    <main>
      <h1>{`Howdy: ${id}`}</h1>
      <button onClick={openSecondary}>Open Secondary</button>
      <span>{`left: ${left}`}</span>
    </main>
  )
}

ReactDOM.render(<App />, ROOT_NODE)
