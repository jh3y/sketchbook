import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'

const config = {
  theme: 'system',
  font: 10,
  ascii: '@#S%?*+;:,.',
  device: '',
  width: null,
  height: null,
  sample: 1,
}

let devices = []

const video = document.querySelector('video')
const canvas = document.querySelector('canvas')
const offscreen = document.createElement('canvas')
const offscreenCtx = offscreen.getContext('2d')
const ctx = canvas.getContext('2d')

let stream
let frame

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

const renderAscii = (ctx, imageData) => {
  console.info({ imageData })
}

const updateCanvas = () => {
  const downsampled = {
    width: Math.floor(video.videoWidth / config.sample),
    height: Math.floor(video.videoHeight / config.sample),
  }

  offscreen.width = canvas.width = downsampled.width
  offscreen.height = canvas.height = downsampled.height

  offscreenCtx.drawImage(video, 0, 0, downsampled.width, downsampled.height)

  renderAscii(
    ctx,
    offscreenCtx.getImageData(0, 0, downsampled.width, downsampled.height)
  )
  //     if (videoRef.current && canvasRef.current) {
  //       const video = videoRef.current
  //       const canvas = canvasRef.current
  //       const ctx = canvas.getContext('2d')

  //       if (ctx) {
  //         const downsampledWidth = Math.floor(video.videoWidth / downsampleFactor)
  //         const downsampledHeight = Math.floor(video.videoHeight / downsampleFactor)

  //         canvas.width = downsampledWidth
  //         canvas.height = downsampledHeight

  //         ctx.drawImage(video, 0, 0, downsampledWidth, downsampledHeight)

  //         const imageData = ctx.getImageData(0, 0, downsampledWidth, downsampledHeight)

  //         drawAscii(ctx, imageData)
  //       }
  //     }
  //     animationFrameRef.current = requestAnimationFrame(updateCanvas)
}

let capturing = false
const handleCapture = async () => {
  if (!capturing) {
    capturing = true
    camera.disabled = true
    cap.title = 'Stop'
    console.info('start')
    stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: config.device ? { exact: config.device } : undefined },
    })
    //         videoRef.current.srcObject = stream
    //         await videoRef.current.play()
    //         setResolution({
    //           width: videoRef.current.videoWidth,
    //           height: videoRef.current.videoHeight
    //         })
    video.srcObject = stream
    await video.play()
    config.width = video.videoWidth
    config.height = video.videoHeight
    if (!config.device) getDevices()
    console.info({ stream })
    gsap.ticker.add(updateCanvas)
  } else {
    console.info('stop')
    camera.disabled = false
    capturing = false
    cap.title = 'Capture'
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      stream = null
    }
    gsap.ticker.remove(updateCanvas)
    video.srcObject = null
    if (frame) cancelAnimationFrame(frame)
    config.width = config.height = null
  }
}

const cap = ctrl
  .addButton({
    title: 'Capture',
  })
  .on('click', handleCapture)

ctrl.on('change', sync)
update()

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

//   const drawAscii = useCallback((ctx: CanvasRenderingContext2D, imageData: ImageData) => {
//     const cellWidth = fontSize
//     const cellHeight = fontSize
//     const numCols = Math.floor(imageData.width / cellWidth)
//     const numRows = Math.floor(imageData.height / cellHeight)

//     ctx.fillStyle = 'black'
//     ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

//     ctx.font = `${fontSize}px monospace`
//     ctx.fillStyle = 'white'

//     for (let y = 0; y < numRows; y++) {
//       for (let x = 0; x < numCols; x++) {
//         const posX = x * cellWidth
//         const posY = y * cellHeight

//         let totalBrightness = 0
//         let sampleCount = 0

//         for (let sy = 0; sy < cellHeight; sy++) {
//           for (let sx = 0; sx < cellWidth; sx++) {
//             const sampleX = posX + sx
//             const sampleY = posY + sy
//             const offset = (sampleY * imageData.width + sampleX) * 4
//             const brightness = (imageData.data[offset] + imageData.data[offset + 1] + imageData.data[offset + 2]) / 3
//             totalBrightness += brightness
//             sampleCount++
//           }
//         }

//         const averageBrightness = totalBrightness / sampleCount
//         const charIndex = Math.floor(averageBrightness / 256 * asciiChars.length)
//         const char = asciiChars[charIndex] || ' '

//         ctx.fillText(char, posX, posY + cellHeight)
//       }
//     }
//   }, [fontSize, asciiChars])

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       <div className="flex space-x-4">
//         <div className="relative w-full max-w-md aspect-video bg-gray-200 rounded-lg overflow-hidden">
//           <video
//             ref={videoRef}
//             className="w-full h-full object-cover"
//           />
//           {!isCapturing && (
//             <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-200">
//               Webcam feed will appear here
//             </div>
//           )}
//         </div>
//         <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
//           <canvas
//             ref={canvasRef}
//             className="w-full h-full object-contain"
//           />
//           {!isCapturing && (
//             <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-900">
//               ASCII representation will appear here
//             </div>
//           )}
//         </div>
//       </div>
//       {resolution && (
//         <div className="text-sm text-gray-500">
//           Webcam Resolution: {resolution.width}x{resolution.height}
//           <br />
//           Processed Resolution: {Math.floor(resolution.width / downsampleFactor)}x{Math.floor(resolution.height / downsampleFactor)}
//         </div>
//       )}
//       <div className="w-full max-w-2xl space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="webcam-select">Select Webcam</Label>
//           <Select value={selectedDevice} onValueChange={setSelectedDevice}>
//             <SelectTrigger id="webcam-select">
//               <SelectValue placeholder="Select a webcam" />
//             </SelectTrigger>
//             <SelectContent>
//               {devices.map((device) => (
//                 <SelectItem key={device.deviceId} value={device.deviceId}>
//                   {device.label || `Webcam ${device.deviceId.slice(0, 5)}`}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="downsample-factor">Downsample Factor: {downsampleFactor}x</Label>
//           <Slider
//             id="downsample-factor"
//             min={1}
//             max={8}
//             step={1}
//             value={[downsampleFactor]}
//             onValueChange={(value) => setDownsampleFactor(value[0])}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
//           <Slider
//             id="font-size"
//             min={6}
//             max={20}
//             step={1}
//             value={[fontSize]}
//             onValueChange={(value) => setFontSize(value[0])}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="ascii-chars">ASCII Characters</Label>
//           <Input
//             id="ascii-chars"
//             value={asciiChars}
//             onChange={(e) => setAsciiChars(e.target.value)}
//             placeholder="Enter ASCII characters"
//           />
//         </div>
//       </div>
//       <Button
//         onClick={isCapturing ? stopCapture : startCapture}
//         variant={isCapturing ? "destructive" : "default"}
//       >
//         {isCapturing ? "Stop Capture" : "Start Capture"}
//       </Button>
//     </div>
//   )
// }
