import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'

let keyframes
let resetKeyframe
let chStrength
let pixelSize
let frames
let glitchChance

const config = {
  theme: 'system',
  device: '',
  running: false,
  // datamosh, chromatic
  effect: 'datamosh',
  // datamosh var
  keyframe: 3,
  keyReset: true,
  // chromatic var
  chStrength: 10,
  // pixelate
  pixelSize: 10,
  // blur
  frameBuffer: [],
  frames: 5,
  // glitch
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  if (config.effect === 'datamosh' && config.running) {
    keyframes.hidden = false
    resetKeyframe.hidden = false
  } else {
    keyframes.hidden = true
    resetKeyframe.hidden = true
  }

  if (config.effect === 'chromatic' && config.running) {
    chStrength.hidden = false
  } else {
    chStrength.hidden = true
  }

  if (config.effect === 'pixelate' && config.running) {
    pixelSize.hidden = false
  } else {
    pixelSize.hidden = true
  }

  if (config.effect === 'frames' && config.running) {
    frames.hidden = false
  } else {
    frames.hidden = true
  }
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

const camera = ctrl.addBinding(config, 'device', {
  label: 'Camera',
  options: {},
})
ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.addBinding(config, 'effect', {
  label: 'Effect',
  options: {
    'Chromatic Abberation': 'chromatic',
    Datamosh: 'datamosh',
    Edges: 'edges',
    Pixelate: 'pixelate',
    Blur: 'frames',
    Glitch: 'glitch',
    VHS: 'vhs',
    Wave: 'wave',
  },
})

keyframes = ctrl.addBinding(config, 'keyframe', {
  label: 'Keyframe',
  min: 1,
  max: 30,
  step: 1,
  hidden: true,
})
resetKeyframe = ctrl
  .addButton({ title: 'Reset', hidden: true })
  .on('click', () => (config.keyReset = true))
chStrength = ctrl.addBinding(config, 'chStrength', {
  min: -50,
  max: 50,
  step: 1,
  label: 'Strength',
})
pixelSize = ctrl.addBinding(config, 'pixelSize', {
  min: 1,
  max: 50,
  step: 1,
  label: 'Size',
})
frames = ctrl.addBinding(config, 'frames', {
  min: 1,
  max: 120,
  step: 1,
  label: 'Frames',
})

const getDevices = async () => {
  try {
    const available = await navigator.mediaDevices.enumerateDevices()
    devices = available.filter((device) => device.kind === 'videoinput')
    if (devices.length > 0 && !config.device) {
      config.device = devices[0].deviceId
      const changed = []
      for (const device of devices) {
        changed.push({
          text: device.label,
          value: device.deviceId,
        })
      }
      camera.options = changed
      ctrl.refresh()
    }
  } catch (err) {
    console.error('Error enumerating devices:', err)
  }
}

getDevices()
navigator.mediaDevices.addEventListener('devicechange', getDevices)

let toggleCamera
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
let devices = []

const handleEncodedChunk = (chunk) => {
  if (chunk.type === 'key') {
    decoder.decode(chunk)
  } else {
    for (let i = 0; i < config.keyframe; i++) {
      decoder.decode(chunk)
    }
  }
}

const handleDecodedFrame = (frame) => {
  // Draw the decoded frame onto the canvas
  switch (config.effect) {
    case 'datamosh':
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
      frame.close()
      break
    case 'chromatic':
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // This is the strength of the effect
      const offset = config.chStrength // Shift the channels by 5 pixels

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
    case 'pixelate':
      const pixelSize = config.pixelSize
      // Downscale the video frame by pixelSize
      const width = canvas.width
      const height = canvas.height

      // Create an offscreen canvas for the downscale operation
      const offscreenCanvas = document.createElement('canvas')
      const offscreenCtx = offscreenCanvas.getContext('2d')

      // Set the size of the offscreen canvas to the pixelated size
      offscreenCanvas.width = Math.ceil(width / pixelSize)
      offscreenCanvas.height = Math.ceil(height / pixelSize)

      // Downscale the video frame by drawing it to the offscreen canvas
      offscreenCtx.drawImage(
        frame,
        0,
        0,
        offscreenCanvas.width,
        offscreenCanvas.height
      )

      // Disable image smoothing to keep the pixelated effect sharp
      ctx.imageSmoothingEnabled = false

      // Upscale the pixelated image back to the original canvas
      ctx.drawImage(
        offscreenCanvas,
        0,
        0,
        offscreenCanvas.width,
        offscreenCanvas.height,
        0,
        0,
        width,
        height
      )
      frame.close()
      break

    case 'vhs':
      // Draw the video frame normally
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)

      // Create scanline distortion effect
      const vhsData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const vd = vhsData.data
      for (let y = 0; y < canvas.height; y += 2) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4
          // Shift pixels randomly by a small offset, simulating scanline distortion
          const shift = Math.floor(Math.random() * 2) - 1 // Random shift between -1 and 1
          if (x + shift < canvas.width && x + shift > 0) {
            vd[idx] = vd[idx + shift * 4]
            vd[idx + 1] = vd[idx + shift * 4 + 1]
            vd[idx + 2] = vd[idx + shift * 4 + 2]
          }
        }
      }

      // Apply some static noise to random pixels
      for (let i = 0; i < vd.length; i += 4) {
        if (Math.random() < 0.01) {
          // Introduce white noise in 1% of pixels
          vd[i] = vd[i + 1] = vd[i + 2] = 255
        }
      }

      ctx.putImageData(vhsData, 0, 0)
      frame.close()
      break

    case 'wave':
      const waveHeight = 10 // Height of wave distortion
      const waveFrequency = 0.05 // Frequency of the wave

      // Draw the video frame onto a temp canvas
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      tempCtx.drawImage(frame, 0, 0, canvas.width, canvas.height)

      // Apply wave distortion by displacing horizontal scanlines
      for (let y = 0; y < canvas.height; y++) {
        const displacement = Math.sin(y * waveFrequency) * waveHeight
        ctx.drawImage(
          tempCanvas,
          0,
          y,
          canvas.width,
          1,
          displacement,
          y,
          canvas.width,
          1
        )
      }

      frame.close()
      break

    case 'edges':
      // Draw the frame on the canvas
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)

      // Apply edge detection using a simple convolution matrix
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const d = imgData.data

      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          const idx = (y * canvas.width + x) * 4
          const colorDiff = Math.abs(d[idx] - d[idx + 4]) // Simple horizontal edge detection
          d[idx] = colorDiff // Red
          d[idx + 1] = colorDiff // Green
          d[idx + 2] = colorDiff // Blue
        }
      }

      // Put the modified image data back on the canvas
      ctx.putImageData(imgData, 0, 0)

      frame.close()
      break

    case 'glitch':
      const glitchChance = 0.3 // 30% chance to apply a glitch effect
      if (Math.random() > glitchChance) {
        // Normal frame rendering
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
      } else {
        // Glitch effect: randomly offset or corrupt the frame
        const offset = Math.random() * 20 - 10 // Random small shift
        ctx.drawImage(frame, offset, offset, canvas.width, canvas.height)

        // Corrupt some pixels with random noise
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < imageData.data.length; i += 4) {
          if (Math.random() < 0.05) {
            // Corrupt 5% of the pixels
            imageData.data[i] = 255 // Red
            imageData.data[i + 1] = 0 // Green
            imageData.data[i + 2] = 0 // Blue
          }
        }
        ctx.putImageData(imageData, 0, 0)
      }

      frame.close()
      break

    case 'frames':
      // Set blending mode to additive ('lighter') to intensify the motion blur effect
      ctx.globalCompositeOperation = 'lighter'

      // Define an alpha step to control how each frame in the buffer is blended
      const alphaStep = 0.01 // You can adjust this value to control blur intensity
      const frameCount = config.frameBuffer.length // Number of frames in buffer

      // Blend the buffered frames onto the canvas
      config.frameBuffer.forEach((bufferedFrame, index) => {
        const weight = (index + 1) / frameCount
        ctx.globalAlpha = weight * alphaStep // Blend older frames with reduced opacity
        ctx.drawImage(bufferedFrame, 0, 0, canvas.width, canvas.height)
      })

      // Draw the current frame on top with full opacity
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over' // Reset blending mode to default
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)

      // Clone the current frame and add it to the frame buffer
      const clonedFrame = frame.clone()
      config.frameBuffer.push(clonedFrame)

      // Ensure the buffer doesn't exceed the specified maximum number of frames
      if (config.frameBuffer.length > config.frames) {
        const oldestFrame = config.frameBuffer.shift() // Remove the oldest frame
        oldestFrame.close() // Free up memory by closing the oldest frame
      }

      // Close the current frame to free up memory
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
    keyFrame: config.effect === 'datamosh' ? config.keyReset : true,
  })
  config.keyReset = false
  frame.close()
}

const start = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: config.device ? { exact: config.device } : undefined },
  })
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
  config.running = !config.running
  toggle.title = config.running ? 'Stop' : 'Start'
  if (config.running) {
    start()
  } else {
    stop()
  }
  update()
}
