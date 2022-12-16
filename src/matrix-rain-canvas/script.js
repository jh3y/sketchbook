import gsap from 'gsap'

console.clear()

const CANVAS = document.querySelector('#rain')

const DEFAULT_OPTIONS = {
  size: window.innerWidth * 0.05,
  fps: 12,
  limiter: 0.25,
  glyphs:
    'ラドクリフマラソンわたしワタシんょンョたばこタバコとうきょうトウキョウ0123456789±!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZ',
}

const DigitalRain = function (el, options) {
  if (el.tagName !== 'CANVAS') return console.error('Need a canvas element')
  const self = this
  self.__ratio = window.devicePixelRatio || 1
  self.canvas = el
  self.options = options
  // Todo:: Make this reset on resize as a function...
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
  // const destination = self.rows + len
  const destination = gsap.utils.random(self.rows * 0.1, self.rows + len, 1)
  const lastDestination = column.destination || destination
  const lastLen = column.len || len
  // Grab the characters lengths for setting the new Array
  let lastCharLength = lastDestination
  if (column?.chars?.current && column?.chars?.last) {
    lastCharLength = Math.max(column.chars.current.length, column.chars.last.length)
  }
  const currentCharLength = destination
  const newSize = Math.max(lastCharLength, currentCharLength, destination)
  const row = gsap.utils.random(-self.rows, -1, 1)

  // const lastChars = column.chars?.current ? [...column.chars.current] : []

  // Last chars should be an Array of maxSize mapped to the start of the current
  // const lastChars = new Array(newSize).fill().map((entry, index) => {
    
  //   return ''
  // })
  let lastChars = []
  if (column?.chars?.current && column?.chars?.last) {
    // console.info('have olides')
    // lastChars = [...column.chars.current]
    // console.info('have oldies')
    lastChars = new Array(newSize).fill().map((entry, index) => {
        if (index <= destination)
          return column.chars.current[index]
        else
          return column.chars.last[index]
    })
  }

  const currentChars = new Array(currentCharLength).fill().map((entry, index) => {
    let char = ''
    if (index <= destination) {
      char = self.glyphs[gsap.utils.random(0, self.glyphs.length - 1, 1)]
    } else if (column?.chars?.last.length > 0) {
      char = column?.chars?.last[index]
    }
    return char
  })
  console.info({
    newSize,
    lastCharLength,
    currentCharLength,
    destination,
  })

  return {
    ...column,
    // This is the place you want it to stop at. It could also start later...
    destination,
    lastDestination,
    lastLen,
    row,
    len,
    chars: {
      last: lastChars,
      current: currentChars,
    },
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
  self.stop = () => {
    gsap.ticker.remove(self.renderMatrix)
  }
}

DigitalRain.prototype.getColor = function (
  row,
  y,
  len,
  lastLen,
  lastDestination,
  x,
  destination
) {
  // If y > row but less than last destination, work out the color as if row === column.lastDestination
  const lower = 0.1
  const upper = 1
  let alpha = 0.1

  // if (y > row && y <= lastDestination) {
  //   alpha = gsap.utils.clamp(
  //     lower,
  //     upper,
  //     gsap.utils.mapRange(-lastLen, 0, lower, upper)(y - lastDestination)
  //   )
  // } else if (y > lastDestination) {
  //   alpha = 0.1
  if (y > row) {
    alpha = 0.1
  } else {
    alpha = gsap.utils.clamp(
      lower,
      upper,
      gsap.utils.mapRange(-len, 0, lower, upper)(y - row)
    )
  }
  return `hsl(120, 100%, ${row === y ? 100 : 70}%, ${alpha})`
}

DigitalRain.prototype.render = function () {
  const self = this
  self.context.clearRect(0, 0, self.canvas.width, self.canvas.height)
  // Need to try and iterate over every cell in the Matrix...
  for (let c = 0; c < self.characters; c++) {
    const x = c % self.columns
    const y = Math.floor(c / self.columns)
    const column = self.tracker[x]

    // On the first row, let's bump the index
    // We could do this before we loop and go through and increment them all
    // if (y === 0 && Math.random() > 0.5) {
    if (y === 0) {
      column.row += 1
    }
    const row = column.row
    const chars = column.chars[y > row ? 'last' : 'current']
    self.context.fillStyle = self.getColor(
      row,
      y,
      column.len,
      column.lastLen,
      column.lastDestination,
      x,
      column.destination
    )
    if (chars[y]) {
      // if (y < row && row - y < column.len && Math.random() > 0.99) {
      //   chars[y] = self.glyphs[gsap.utils.random(0, self.glyphs.length - 1, 1)]
      // }
      // else if (y > row && Math.random() > 0.999) {
      //   chars[y] = ''
      // }
      self.context.fillText(
        chars[y],
        (x + 0.5) * self.size,
        (y + 1) * self.size
      )
    }
    // This needs to be switched out for destination
    if (row > column.destination) {
      self.tracker[x] = self.setColumn(column)
    }
  }
}

DigitalRain.prototype.setSize = function () {
  const self = this
  const { height, width } = self.canvas.getBoundingClientRect()
  self.canvas.height = height * self.__ratio
  self.canvas.width = width * self.__ratio
  // Set the font size and get the rows/columns
  // self.columns = Math.ceil(self.canvas.width / self.size)
  self.columns = 1
  self.rows = Math.ceil(self.canvas.height / self.size)
  self.characters = self.rows * self.columns
  self.context.font = `${self.size}px monospace`
  self.context.textAlign = 'center'
}

window.RAIN = new DigitalRain(CANVAS, DEFAULT_OPTIONS)
