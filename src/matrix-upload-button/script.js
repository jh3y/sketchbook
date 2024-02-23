import gsap from 'https://cdn.skypack.dev/gsap@3.11.0'

console.clear()

const CANVAS = document.querySelector('button canvas')

/**
 * size: px size for font
 * */

const DEFAULT_OPTIONS = {
  size: 20 * window.devicePixelRatio,
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
  // gsap.ticker.add(self.renderMatrix)
  self.renderMatrix()
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
  { active, hue, row, len, lastLen, lastDestination, low, tailCounter }
) {
  const self = this
  // If y > row but less than last destination, work out the color as if row === column.lastDestination
  const lower = low
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

DigitalRain.prototype.isCellColumn = function(x) {
  const self = this
  const mid = Math.floor((self.columns - 1) * 0.5)
  const low = mid - self.options.word.length * 0.5
  const high = mid + self.options.word.length * 0.5
  if (x > low && x <= high) return true
  return false
}

DigitalRain.prototype.triggerColumns = function() {
  const self = this
  // Work out which column entries are the ones that need reps setting on them
  const mid = Math.floor((self.columns - 1) * 0.5)
  const low = mid - self.options.word.length * 0.5
  const high = mid + self.options.word.length * 0.5
  for (let i = 0; i < self.tracker.length; i++) {
    self.tracker[i].reps = self.__iterations
    self.tracker[i].active = true
  }
}

DigitalRain.prototype.render = function () {
  const self = this
  console.info(new Date().toUTCString())
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

    self.context.fillStyle = self.getColor(x, y, {...column, low: column.complete ? 0 : 0.1 })

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

      let char = chars[y]
      if (self.isCellLabel({ x, y }) && !column.active) {

        let charIndex = x - (Math.floor((self.columns - 1) * 0.5) - (self.options.word.length * 0.5))
        char = self.options.word.split('')[Number.isInteger(charIndex) ? charIndex - 1 : Math.floor(charIndex)]

        // This part triggers it into reps and wipes out the first word
        if (self.active && column.row === Math.floor(self.rows * 0.5) && !column.complete) {
          self.wiped += 1
          if (self.wiped === self.options.word.length) {
            // Think at this point, you calculate which columns need to be set and set them after the word
            // Issue here is to do with swapping the letters and the new columns need to be introduced
            self.options.word = self.__word
            self.triggerColumns()
          }
          column.active = true
        }
      }

      // If it's an active column and it's a cellLabel then we can count the reps
      if (column.row === Math.floor(self.rows * 0.5) && !column.complete && column.reps) {
        column.reps -= 1
        if (column.reps === 0) {
          column.active = false
          column.complete = true
        }
      }

      self.context.fillText(
        char || 'X',
        (x + 0.34) * self.fontSize,
        (y + 0.3) * self.fontSize,
        self.fontSize
      )
    }
    // Reset the column if we go past destination
    if (row > column.destination) {

      if (!column.complete) self.tracker[x] = self.setColumn(column)
      if (column.complete && !column.dormant) {
        column.dormant = true
        self.completed += 1
        if (self.completed === self.columns) {
          // At this point, reset everything.
          self.rebase()
        }
      }
    }
  }
}

DigitalRain.prototype.rebase = function () {
  const self = this
  self.active = false
  if (self.__cb) self.__cb()
  self.pause()
  self.renderMatrix()
} 

DigitalRain.prototype.switchWord = function(word, iterations = 1, callback) {
  const self = this
  // Used to track the number of columns that have been wiped out
  self.wiped = 0
  // In here, we need to reset all the columns
  for (let c = 0; c < self.columns; c++) {
    self.tracker[c] = self.setColumn({})
  }
  self.__word = word
  self.__iterations = iterations
  self.__cb = callback
  self.completed = 0
  self.active = true
  self.play()
}

// Not gonna need this as it's for resetting the sizes
DigitalRain.prototype.setSize = function () {
  const self = this
  const { height, width } = self.canvas.getBoundingClientRect()
  self.canvas.height = height * 1 * self.__ratio
  self.canvas.width = width * 1 * self.__ratio
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
})

// It should be a method like switch word... 
// With the iteration count on the end
// myDigitalRain.switchWord('DOWNLOADED', 3)
let set = false
const BUTTON = document.querySelector('button')
const DOWNLOAD = () => {
  if (set) {
    myDigitalRain.switchWord('COMPLETE', 3, () => set = true)
  } else {
    myDigitalRain.switchWord('DOWNLOADED', 3, () => {
      console.info('downloaded')
      set = true
    })
  }
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

// When you want to switch word. You do this:
  /**
   * 1. Set the render to active.
   * 2. self.active = true
   * 3. self.play()
   * 4. Then you want to cast out the current word
   * 5. self.word becomes self.newWord
   * 6. Once that's settled self.word and self.newWord === undefined
   * 7. self.pause()
   * */