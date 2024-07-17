let myShader

// Our vertex shader source as a string
let vert = `
precision highp float;

attribute vec3 aPosition;

// The transform of the object being drawn
uniform mat4 uModelViewMatrix;

// Transforms 3D coordinates to 2D screen coordinates
uniform mat4 uProjectionMatrix;

void main() {
  // Apply the camera transform
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

  // Tell WebGL where the vertex goes
  gl_Position = uProjectionMatrix * viewModelPosition;
}
`

let frag = `
precision highp float;

// A custom uniform to control the color
uniform vec4 myColor;

void main() {
  gl_FragColor = myColor;
}
`
let font
function preload() {
  font = loadFont('./Lato/Lato-Black.ttf')
}

function setup() {
  console.info('running')
  createCanvas(200, 200, WEBGL)
  textSize(32)
  textFont(font)
  textAlign(CENTER)
  myShader = createShader(vert, frag)
}

function draw() {
  background(255)
  noStroke()

  // Use our custom shader
  shader(myShader)

  // Create a color using the mouse's x position as red and
  // its y position as blue, and pass it into the shader
  myShader.setUniform('myColor', [
    map(mouseX, 0, width, 0, 1, true), // Red
    map(mouseY, 0, height, 0, 1, true), // Green
    0, // Blue
    1, // Alpha
  ])

  // Draw a shape using the shader
  circle(0, 0, 100)
  // Write some text
  fill('red')
  text('Hello World', 0, 0)
}
