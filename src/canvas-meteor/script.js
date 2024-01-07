import gsap from 'gsap'

class Meteor {
  constructor(options) {
    const that = this
    this.canvas = options.element
    this.context = this.canvas.getContext('2d')
    this.canvas.height = this.canvas.offsetHeight
    this.canvas.width = this.canvas.offsetWidth
    this.x = 0
    this.particles = that.genParticles(100)
    this.setParticlesMotion()
    gsap.ticker.add(this.draw.bind(that))
  }
  genParticles(amount) {
    const that = this
    const particles = []
    for (let p = 0; p < amount; p++) {
      const particle = {
        size: gsap.utils.random(1, 10, 1),
        speed: 2,
      }
      particles.push(particle)
    }
    return particles
  }
  draw() {
    const that = this
    that.context.clearRect(0, 0, that.canvas.width, that.canvas.height)
    // Jus' draw a static one for now...

    that.context.shadowBlur = 10
    that.context.shadowColor = 'red'
    that.context.fillStyle = 'red'
    // Base off the meteor
    that.context.beginPath()
    const radius = 4
    that.context.arc(100, 200 - radius, radius, 0, 1 * Math.PI)
    that.context.fill()
    // The tail of the meteor
    const grd = that.context.createLinearGradient(100, 200, 100, 0)
    grd.addColorStop(0, 'white')
    grd.addColorStop(0.25, 'hsl(30, 100%, 50%)')
    grd.addColorStop(0.65, 'hsl(30, 100%, 50%)')
    grd.addColorStop(1, 'transparent')
    that.context.fillStyle = grd
    that.context.moveTo(100 - radius, 200 - radius)
    that.context.lineTo(100, 100)
    that.context.lineTo(100 + radius, 200 - radius)
    that.context.fill()
    // Iterate over and render the particles
    for (const particle of that.particles) {
      that.context.beginPath()
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
  setParticlesMotion() {
    const that = this
    for (const particle of that.particles) {
      // Given an angle and distance, you can create an x and y destination
      particle.x = 100
      particle.y = gsap.utils.random(150, 200, 1) - particle.size / 2
      gsap.timeline().to(particle, {
        x: () => gsap.utils.random(50, 150, 1),
        y: () => gsap.utils.random(0, 50, 1),
        size: 0,
        repeat: -1,
        ease: 'power4.out',
        repeatDelay: Math.random(),
        delay: () => Math.random() * -1,
        duration: () => gsap.utils.random(1, 4),
      })
    }
  }
}
const CANVAS = document.querySelector('.meteor')
new Meteor({ element: CANVAS })
