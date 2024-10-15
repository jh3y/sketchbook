import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'

const config = {
  theme: 'system',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

let toggleCamera
let running = false
const video = document.querySelector('video')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })
const toggle = ctrl.addButton({ title: 'Start' })
toggle.on('click', () => toggleCamera())
ctrl.on('change', sync)
update()

// Here's the video codec stuff we can do
//
let track
let encoder
let decoder
let codec = 'vp8'

// datamosh, chromatic
let effect = 'chromatic'

const PARAMS = {
  speed: 4,
  keyFrame: true,
}

const handleEncodedChunk = (chunk) => {
  if (chunk.type === 'key') {
    decoder.decode(chunk)
  } else {
    for (let i = 0; i < 2; i++) {
      decoder.decode(chunk)
    }
  }
}

const handleDecodedFrame = (frame) => {
  // Draw the decoded frame onto the canvas
  switch (effect) {
    case 'datamosh':
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
      frame.close()
      break
    case 'chromatic':
      console.info('draing')
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // This is the strength of the effect
      const offset = 20 // Shift the channels by 5 pixels

      for (let i = 0; i < data.length; i += 4) {
        // Shift the Red channel
        if (i + offset * 4 < data.length) {
          data[i] = data[i + offset * 4]
        }

        // Shift the Blue channel
        if (i - offset * 4 >= 0) {
          data[i + 2] = data[i - offset * 4 + 2]
        }
      }

      ctx.putImageData(imageData, 0, 0)

      // ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
      frame.close()
      break
    default:
      console.info('cool')
      frame.close()
  }
}

const processFrame = () => {
  const frame = new VideoFrame(video, {
    timestamp: Date.now(),
  })
  encoder.encode(frame, {
    keyFrame: effect === 'chromatic' ? true : PARAMS.keyFrame,
  })
  PARAMS.keyFrame = false
  frame.close()
}

const start = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true })
  video.srcObject = stream
  track = stream.getVideoTracks()[0]
  const { height, width } = track.getSettings()
  canvas.width = width
  canvas.height = height
  // create an encoder
  encoder = new VideoEncoder({
    output: handleEncodedChunk,
    error: (err) => console.error('Encoder error:', err),
  })
  encoder.configure({
    codec,
    width,
    height,
    bitrate: 1_000_000, // 1Mbps bitrate
  })
  // create a decoder
  decoder = new VideoDecoder({
    output: handleDecodedFrame,
    error: (err) => console.error('Decoder error:', err),
  })
  decoder.configure({
    codec,
  })
  // start processing frames
  video.addEventListener(
    'play',
    () => {
      gsap.ticker.add(processFrame)
    },
    { once: true }
  )
}

const stop = () => {
  track.stop()
  video.srcObject = null
  gsap.ticker.remove(processFrame)
  requestAnimationFrame(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  })
}

toggleCamera = async () => {
  running = !running
  toggle.title = running ? 'Stop' : 'Start'
  if (running) {
    start()
  } else {
    stop()
  }
}
