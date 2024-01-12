import gsap from 'gsap'

class Meteor {
  constructor(options) {
    const that = this
    this.canvas = options.element
    this.options = options
    this.context = this.canvas.getContext('2d')
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio 
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio
    

    // Create a reusable gradient
    that.gradient = that.context.createLinearGradient(that.canvas.width * 0.5, that.canvas.height * 0.5, that.canvas.width * 0.5, 0)
    that.gradient.addColorStop(0, 'hsl(30, 100%, 100%)')
    that.gradient.addColorStop(0.025, 'hsl(30, 100%, 70%)')
    that.gradient.addColorStop(0.15, 'hsl(30, 100%, 40%)')
    that.gradient.addColorStop(0.55, 'hsl(30, 100%, 20%)')
    that.gradient.addColorStop(1, 'transparent')

    that.sparkGradient = that.context.createLinearGradient(that.canvas.width * 0.5, that.canvas.height * 0.5, that.canvas.width * 0.5, 0)
    that.sparkGradient.addColorStop(0, 'hsl(30, 100%, 100%)')
    that.sparkGradient.addColorStop(0.025, 'hsl(30, 100%, 70%)')
    that.sparkGradient.addColorStop(0.15, 'hsl(30, 100%, 40%)')
    that.sparkGradient.addColorStop(0.9, 'hsl(30, 100%, 20%)')
    that.sparkGradient.addColorStop(1, 'transparent')

    this.particles = that.genParticles(gsap.utils.random(20, 100, 1))
    this.setParticlesMotion()
    gsap.ticker.add(this.draw.bind(that))
  }
  /**
   * Generate some particles
   * Only care about sizing
   * */
  genParticles(amount) {
    const that = this
    const particles = []
    for (let p = 0; p < amount; p++) {
      const particle = {
        size: gsap.utils.random(1, that.options.width * 1.25, 1) * window.devicePixelRatio,
      }
      particles.push(particle)
    }
    return particles
  }
  /**
   * Drawing loop.
   * 1. Draw the head
   * 2. Draw the tail
   * 3. Draw the sparks
   * */
  draw() {
    const that = this
    that.context.clearRect(0, 0, that.canvas.width, that.canvas.height)
    // Set a blur on the canvas
    that.context.shadowBlur = 10 * window.devicePixelRatio
    that.context.shadowColor = 'hsl(30, 100%, 40%)'

    // 1. Base of the meteor (A semicircle)
    that.context.beginPath()
    const radius = that.options.width / 2 * window.devicePixelRatio
    that.context.arc(
      that.canvas.width * 0.5,
      that.canvas.height * 0.5 - radius,
      radius,
      0,
      1 * Math.PI
    )
    that.context.fill()
    // 2. The tail of the meteor (A triangle)
    that.context.fillStyle = that.gradient
    that.context.moveTo(that.canvas.width * 0.5 - radius, that.canvas.height * 0.5 - radius)
    that.context.lineTo(that.canvas.width * 0.5, (that.canvas.height * 0.5) - that.options.length * window.devicePixelRatio)
    that.context.lineTo(that.canvas.width * 0.5 + radius, that.canvas.height * 0.5 - radius)
    that.context.fill()
    // 3. Iterate over and render the particles
    for (const particle of that.particles) {
      that.context.beginPath()
      that.context.fillStyle = that.sparkGradient
      that.context.arc(
        particle.x,
        particle.y,
        particle.size / 2,
        0,
        2 * Math.PI
      )
      that.context.fill()
    }
  }
  /**
   * Sets the sparks in motion
   * */
  setParticlesMotion() {
    const that = this
    for (const particle of that.particles) {
      // Given an angle and distance, you can create an x and y destination
      particle.x = that.canvas.width * 0.5
      particle.y = that.canvas.height * 0.5
      gsap.timeline().to(particle, {
        x: () => gsap.utils.random(that.canvas.width * 0.25, that.canvas.width * 0.75, 1),
        y: () => gsap.utils.random(0, 0, 1),
        size: 0,
        repeat: -1,
        ease: 'power4.out',
        repeatDelay: Math.random(),
        delay: () => Math.random() * -1,
        duration: () => gsap.utils.random(0, 5),
      })
    }
  }
}

const SOARERS = document.querySelectorAll('canvas')
SOARERS.forEach(c => new Meteor({ element: c, length: gsap.utils.random(50, 80, 1), width: gsap.utils.random(4, 8, 1)}))
