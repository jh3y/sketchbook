import gsap from 'https://cdn.skypack.dev/gsap@3.11.0'

console.clear()

const CANVAS = document.querySelector('button canvas')

/**
 * size: px size for font
 * */

const DEFAULT_OPTIONS = {
  size: 16 * window.devicePixelRatio,
  family: 'JetBrains Mono, monospace',
  fps: 24,
  hue: 120,
  limiter: 0.5,
  glyphs:
    'ラドクリフマラソンわたしワタシんょンョたばこタバコとうきょうトウキョウ0123456789±!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  // glyphs: '01'
}

const DigitalRain = function (el, options) {
  if (el.tagName !== 'CANVAS') return console.error('Need a canvas element')
  const self = this
  self.__ratio = window.devicePixelRatio || 1
  self.canvas = el
  self.options = options
  self.size = options.size
  self.glyphs = self.options.glyphs.split('')
  self.context = el.getContext('2d')
  self.setSize()
  self.setTracker()
  self.init()
  return self
}

// Sending back a column Object that represents the state of a column
DigitalRain.prototype.setColumn = function (column = {}) {
  const self = this
  const { glyphs } = self
  // Set a destination and record len && lastLen
  const len = gsap.utils.random(6, self.rows, 1)
  const lastLen = column.len || len
  // const destination = self.rows + len
  const destination = gsap.utils.random(self.rows * 0.1, self.rows + len, 1)
  const lastDestination = column.destination || destination
  // Tracking the last Destination needs a tail off to roll out the old stream
  const tailEnd = lastDestination + lastLen

  // If you have column.chars reuse else reset up to destination
  let chars = column.chars || []

  // When you come in, cache the last set of chars
  let cacheChars = [...chars]

  chars = new Array(Math.max(destination, chars.length))
    .fill()
    .map((entry, index) => {
      if (index <= destination) {
        return self.glyphs[gsap.utils.random(0, self.glyphs.length - 1, 1)]
      } else {
        return cacheChars[index]
      }
    })

  const row = gsap.utils.random(-self.rows, -1, 1)

  // column.hue = column.hue || gsap.utils.random(0, 359, 1)

  return {
    ...column,
    chars,
    cacheChars,
    destination,
    lastDestination,
    lastLen,
    tailEnd,
    tailCounter: lastDestination,
    row,
    len,
  }
}

DigitalRain.prototype.setTracker = function () {
  const self = this
  self.tracker = new Array(self.columns).fill().map(() => self.setColumn())
}

DigitalRain.prototype.reset = function () {
  const self = this
  self.context.clearRect(0, 0, self.canvas.width, self.canvas.height)
  self.setSize()
  self.setTracker()
}

DigitalRain.prototype.init = function () {
  const self = this
  self.renderMatrix = () => self.render()
  self.resetOnSize = () => self.reset()
  window.addEventListener('resize', self.resetOnSize)
  gsap.ticker.add(self.renderMatrix)
  gsap.ticker.fps(self.options.fps)
  self.pause = () => {
    gsap.ticker.remove(self.renderMatrix)
  }
  self.play = () => {
    gsap.ticker.add(self.renderMatrix)
  }
}

DigitalRain.prototype.getColor = function (
  x,
  y,
  { active, hue, row, len, lastLen, lastDestination, tailCounter }
) {
  const self = this
  // If y > row but less than last destination, work out the color as if row === column.lastDestination
  const lower = 0.1
  const upper = 1
  let alpha = 0.1

  if (y <= row) {
    alpha = gsap.utils.clamp(
      lower,
      upper,
      gsap.utils.mapRange(-len, 0, lower, upper)(y - row)
    )
  } else if (y > row && y <= lastDestination) {
    alpha = gsap.utils.clamp(
      lower,
      upper,
      gsap.utils.mapRange(-lastLen, 0, lower, upper)(y - tailCounter)
    )
  } else if (y > lastDestination) {
    alpha = lower
  }

  if (self.isCellLabel({ x, y }) && !active) {
    return 'white'
  }

  return `hsl(${hue || self.options.hue}, 100%, ${
    row === y ? 100 : 70
  }%, ${alpha})`
}

DigitalRain.prototype.isCellLabel = function ({ x, y }) {
  const self = this
  const mid = Math.floor((self.columns - 1) * 0.5)
  const low = mid - self.options.word.length * 0.5
  const high = mid + self.options.word.length * 0.5
  if (x > low && x <= high && y === Math.round(self.rows * 0.5) - 1) {
    return true
  }
  return false
}

DigitalRain.prototype.render = function () {
  const self = this
  self.context.clearRect(0, 0, self.canvas.width, self.canvas.height)
  // Need to try and iterate over every cell in the Matrix...
  for (let c = 0; c < self.characters; c++) {
    const x = c % self.columns
    const y = Math.floor(c / self.columns)
    const column = self.tracker[x]

    if (!self.active && !self.isCellLabel({ x, y })) continue

    // On the first row, let's bump the index
    if (y === 0 && Math.random() > 0.1) {
      column.row += 1
    }

    if (column.tailCounter !== column.tailOff && y === 0) {
      column.tailCounter += 1
    }

    const row = column.row
    const chars = column[y > row ? 'cacheChars' : 'chars']


    self.context.fillStyle = self.getColor(x, y, column)

    if (chars[y] || self.isCellLabel({ x, y })) {
      if (Math.random() > 0.999 && y > row) {
        column.cacheChars[y] = column.chars[y] = ''
      }
      if (
        Math.random() > 0.99 &&
        y < row &&
        y < column.destination &&
        y > column.destination - column.len
      ) {
        column.cacheChars[y] = column.chars[y] =
          self.glyphs[gsap.utils.random(0, self.glyphs.length - 1, 1)]
      }

      // self.columns === 16 then half is 8
      // 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
      // [5, 6, 7, 8, 9, 10]

      // Gotta work out what happens here.
      // Go active then it can be scrubbed.

      let char = chars[y]
      if (self.isCellLabel({ x, y }) && !column.active) {
        char =
          self.options.word.split('')[
            x -
              1 -
              (Math.floor((self.columns - 1) * 0.5) - self.options.word.length * 0.5)
          ]
        if (self.active && column.row === 8) {
          column.active = true
          // char = 'X'
        }
      }

      self.context.fillText(
        char,
        (x + 0.5) * self.fontSize,
        (y + 0.25) * self.fontSize,
        self.fontSize
      )
    }
    // Reset the column if we go past destination
    if (row > column.destination) {
      self.tracker[x] = self.setColumn(column)
    }
  }
}

DigitalRain.prototype.activate = function () {
  const self = this
  self.active = true
}

// Not gonna need this as it's for resetting the sizes
DigitalRain.prototype.setSize = function () {
  const self = this
  const { height, width } = self.canvas.getBoundingClientRect()
  self.canvas.height = height * 0.5 * self.__ratio
  self.canvas.width = width * 0.5 * self.__ratio
  // Set the font size and get the rows/columns
  self.fontSize = Math.ceil(
    typeof self.size === 'function' ? self.size() : self.size
  )
  self.columns = Math.ceil(self.canvas.width / self.fontSize)
  // self.columns = 1
  self.rows = Math.ceil(self.canvas.height / self.fontSize) + 1
  self.characters = self.rows * self.columns
  self.context.font = `${self.fontSize}px ${self.options.family}`
  self.context.textAlign = 'center'
}

window.myDigitalRain = new DigitalRain(CANVAS, {
  ...DEFAULT_OPTIONS,
  word: 'DOWNLOAD',
  // Start word and end word can switch between them
})

const BUTTON = document.querySelector('button')
const DOWNLOAD = () => {
  myDigitalRain.activate()
}
BUTTON.addEventListener('click', DOWNLOAD)


// Perhaps the best thing to do is overlay one canvas on the other
// ctx.save();

// //The scale will flip the whole canvas, and will move the image 
// //to the left (by the image width size)
// ctx.scale(-1, 1);

// //Using translate to move the image back to it's original origin
// ctx.translate(Img.width, 0)

// ctx.drawImage(Img, 0, 0, 100, 100);

// ctx.restore();


/**
 * 1. When a column is made active, check for any that are not.
 * 2. When the number equals word length, Make iterations until column isn't active.
 * 3. 4,5,6,6,7 random iterations that include any extra columns
 * 4. At the end of iterations switch back to the new word.
 * 5. Clear up all the remaining streams if you can... Not sure how to tail them out...
 * 6. For optimization, only play/pause when the button is active.
 * 7. You can do an initial render to get the word back
 * 
 * 
 * */