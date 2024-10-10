import { Pane } from 'https://cdn.skypack.dev/tweakpane'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'

const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
  }
`

const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_maxDist;
  uniform float u_minDist;
  uniform float u_randomOffset;
  uniform float u_displacementStrength;
  uniform float u_mouseRadius;
  varying vec2 v_texCoord;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse / u_resolution;

    vec2 direction = st - mouse;
    float distance = length(direction);

    // Only affect pixels within the proximity range
    float normalizedDist = distance / (u_mouseRadius / u_resolution.y);
    if (normalizedDist < 1.0) {
      // Smooth transition for displacement strength
      float smoothStrength = 1.0 - smoothstep(0.0, 1.0, normalizedDist);
      float displacement = smoothStrength * u_displacementStrength;

      // Add some randomness to the displacement
      vec2 randomOffset = vec2(random(st), random(st + vec2(1.0))) * 2.0 - 1.0;
      vec2 offset = normalize(direction + randomOffset * u_randomOffset) * displacement;

      vec2 newCoord = v_texCoord - offset;

      // Ensure the new coordinates stay within the texture bounds
      newCoord = clamp(newCoord, vec2(0.0), vec2(1.0));

      vec4 color = texture2D(u_image, newCoord);

      // Fade out pixels that are very close to the mouse
      if (distance < u_minDist) {
        color.a *= smoothstep(0.0, u_minDist, distance);
      }

      gl_FragColor = color;
    } else {
      gl_FragColor = texture2D(u_image, v_texCoord);
    }
  }
`

let program
let uniformLocations
const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

const config = {
  min: 0,
  max: 2,
  offset: 0.4,
  displacement: 0.1,
  proximity: 160,
  text: 'just pixels',
  font: 74,
  theme: 'dark',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const updateUniform = (name, value) => {
  if (gl && program) {
    const location = uniformLocations[name]
    if (location) {
      gl.uniform1f(location, value)
    }
  }
}

const configureCanvas = () => {
  const height = canvas.offsetHeight * window.devicePixelRatio
  const width = canvas.offsetWidth * window.devicePixelRatio
  canvas.width = width
  canvas.height = height
  gl.viewport(0, 0, width, height)
}

const getTextCanvas = () => {
  const textCanvas = document.createElement('canvas')
  textCanvas.width = canvas.width
  textCanvas.height = canvas.height
  const textCtx = textCanvas.getContext('2d')
  // Draw text
  textCtx.fillStyle = '#0000'
  textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height)

  const color =
    config.theme === 'dark' ||
    (config.theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'white'
      : 'black'

  textCtx.fillStyle = color
  textCtx.font = `bold ${config.font}px Arial`
  textCtx.textAlign = 'center'
  textCtx.textBaseline = 'middle'
  textCtx.fillText(config.text, textCanvas.width / 2, textCanvas.height / 2)
  return textCanvas
}

let vertexShader
let fragmentShader
let positionBuffer
let positions
let positionAttributeLocation
let texCoordBuffer
let texCoords
let texCoordAttributeLocation
const configureShaders = () => {
  vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, vertexShaderSource)
  gl.compileShader(vertexShader)

  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, fragmentShaderSource)
  gl.compileShader(fragmentShader)
}

const configureProgram = () => {
  program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)
}

const configureBuffers = () => {
  positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

  texCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
  texCoords = [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)

  texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord')
  gl.enableVertexAttribArray(texCoordAttributeLocation)
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0)
}

let texture

const configureTexture = () => {
  const textCanvas = getTextCanvas()
  texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    textCanvas
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
}

const configureUniforms = () => {
  uniformLocations = {
    u_resolution: gl.getUniformLocation(program, 'u_resolution'),
    u_mouse: gl.getUniformLocation(program, 'u_mouse'),
    u_maxDist: gl.getUniformLocation(program, 'u_maxDist'),
    u_minDist: gl.getUniformLocation(program, 'u_minDist'),
    u_randomOffset: gl.getUniformLocation(program, 'u_randomOffset'),
    u_displacementStrength: gl.getUniformLocation(
      program,
      'u_displacementStrength'
    ),
    u_mouseRadius: gl.getUniformLocation(program, 'u_mouseRadius'),
  }

  gl.uniform2f(uniformLocations.u_resolution, canvas.width, canvas.height)
}

const configureAlpha = () => {
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
}

const pointer = {
  x: 0,
  y: 0,
}

const render = () => {
  gl.clearColor(0, 0, 0, 0) // Clear with transparent black
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.uniform2f(uniformLocations.u_mouse, pointer.x, pointer.y)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

configureCanvas()
configureShaders()
configureProgram()
configureBuffers()
configureTexture()
configureUniforms()
configureAlpha()

gsap.ticker.add(render)

document.body.addEventListener('pointermove', ({ x, y }) => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  pointer.x = (x - rect.left) * scaleX
  pointer.y = canvas.height - (y - rect.top) * scaleY
})

const update = () => {
  // Shader stuff
  updateUniform('u_maxDist', config.max)
  updateUniform('u_minDist', config.min)
  updateUniform('u_randomOffset', config.offset)
  updateUniform('u_displacementStrength', config.displacement)
  updateUniform('u_mouseRadius', config.proximity)
  // Text stuff
  configureTexture()
  document.documentElement.dataset.theme = config.theme
  document.documentElement.style.setProperty('--size', config.font)
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

// min: 0.02,
// max: 0.2,
// offset: 0.2,
// displacement: 0.1,
// proximity: 100,
// text: 'just pixels',
// font: 48,
// theme: 'dark',

// ctrl.addBinding(config, 'min', {
//   min: 0,
//   max: 2,
//   step: 0.01,
//   label: 'Min distance',
// })
// ctrl.addBinding(config, 'max', {
//   min: 0,
//   max: 2,
//   step: 0.01,
//   label: 'Max distance',
// })
ctrl.addBinding(config, 'displacement', {
  min: 0,
  max: 0.5,
  step: 0.01,
  label: 'Strength',
})
ctrl.addBinding(config, 'offset', {
  min: 0,
  max: 2,
  step: 0.01,
  label: 'Offset',
})
ctrl.addBinding(config, 'proximity', {
  min: 0,
  max: 300,
  step: 1,
  label: 'Proximity (px)',
})
ctrl.addBinding(config, 'text', {
  label: 'Text',
})
ctrl.addBinding(config, 'font', {
  label: 'Font (px)',
  min: 16,
  max: 128,
  step: 1,
})

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.on('change', sync)
update()
