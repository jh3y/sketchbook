import gsap from 'gsap'

class Meteor {
  constructor(options) {
    const that = this
    this.canvas = options.element
    this.options = options
    this.context = this.canvas.getContext('2d')
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio
    this.meteorWidth = that.options.width
    this.meteorSpeed = gsap.utils.mapRange(4, 12, 6, 12, that.meteorWidth)
    this.meteorLength = gsap.utils.mapRange(4, 12, 50, 80, that.meteorWidth)
    // Create a reusable gradient
    that.gradient = that.context.createLinearGradient(
      that.canvas.width * 0.5,
      that.canvas.height * 0.5,
      that.canvas.width * 0.5,
      0
    )
    that.gradient.addColorStop(0, 'hsl(30, 100%, 100%)')
    that.gradient.addColorStop(0.025, 'hsl(30, 100%, 70%)')
    that.gradient.addColorStop(0.15, 'hsl(30, 100%, 40%)')
    that.gradient.addColorStop(0.55, 'hsl(30, 100%, 20%)')
    that.gradient.addColorStop(1, 'transparent')

    this.particles = that.genParticles(gsap.utils.random(50, 100, 1))
    this.setParticlesMotion()
    gsap.ticker.add(this.draw.bind(that))

    /**
     * If the meteor has a collision, we need to detect that and use it.
     * The trick here will be to detect when the canvas animationend event happens in CSS.
     * Then make a "special" animation sequence where the sparks etc. no when to stop
     * We creat a blowing up effect and then sparks that shoot out. Extra marks here for
     * in front and behind sparks that give the 3D effect
     * */
    if (options.collision) {
      that.exploder = {
        size: 0,
        alpha: 1,
      }
      // Don't use the CSS animation for this one. Use GSAP's animation hooks.
      gsap.set(that.canvas, { animation: 'none' })
      const explode = () => {
        // When this collision happens, we need to do some GSAP trickery to take the tail down, etc.
        // Big ole timeline of making the explosion
        // Generate some colliders
        if (that.sparks) that.sparks.length = 0
        that.sparks = []
        for (let p = 0; p < gsap.utils.random(10, 50, 1); p++) {
          const spark = {
            destination: {
              x: gsap.utils.random(
                that.canvas.width * 0.5 - that.options.width * 10,
                that.canvas.width * 0.5 + that.options.width * 10,
                1
              ),
              y: gsap.utils.random(
                that.canvas.width * 0.5 - that.options.width * 10,
                that.canvas.width * 0.5 + that.options.width * 10,
                1
              ),
            },
            alpha: 1.5,
            x: that.canvas.width * 0.5,
            y: that.canvas.height * 0.5,
            size: gsap.utils.random(
              that.options.width * 0.2,
              that.options.width,
              1
            ),
          }
          that.sparks.push(spark)
        }
        gsap
          .timeline({
            onStart: function () {
              that.collided = true
            },
            onComplete: function () {
              that.scaleMeteor(Math.random() > 0.25)
            },
          })
          .to(that, {
            duration: 0.5,
            meteorLength: 0,
            meteorWidth: 0,
          })
          .to(
            that.exploder,
            {
              size: that.options.width * 20,
              duration: 0.5,
            },
            0
          )
          .to(
            that.sparks,
            {
              x: function (index) {
                return that.sparks[index].destination.x
              },
              y: function (index) {
                return that.sparks[index].destination.y
              },
              size: 0,
              duration: () => gsap.utils.random(0.5, 1.5),
            },
            0
          )
          .to(that.exploder, {
            alpha: 0,
            duration: 0.5,
          }, 0.25)
        // It's all good taking the size down but you also need the explosion of particles
        // These could be like, debris pieces or something at different angles...
        // Use GSAP's Physics2D for that and then have them with different gravity
      }
      that.scaleMeteor = (collide) => {
        if (that.scale) that.scale.kill()
        that.scale = gsap.timeline({
          onStart: function() {
            that.collided = false
            that.particles = that.genParticles(gsap.utils.random(50, 100, 1))
            that.setParticlesMotion()
            that.exploder.size = 0
            that.exploder.alpha = 1
            gsap.set(that.canvas, { opacity: 1 })
            that.options.length = gsap.utils.random(50, 80, 1)
            that.options.width = gsap.utils.random(4, 8, 1)
            that.meteorWidth = that.options.width
            that.meteorLength = that.options.length
          }
        })
          .set(that.canvas, { yPercent: 0, y: 0 })
          .to(that.canvas, {
            ease: 'none',
            duration: collide ? gsap.utils.random(5, 10, 1) : gsap.utils.random(10, 20, 1),
            y: collide ? '100cqh' : '200cqh',
            yPercent: 50,
            onComplete: function () {
              if (collide) explode()
              else that.scaleMeteor(Math.random() > 0.25)
            },
          })
        that.scale.play()
      }
      that.scaleMeteor(false)
    }
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
        size:
          gsap.utils.random(1, that.options.width * 1.25, 1) *
          window.devicePixelRatio,
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
   * 4. Draw the colliders
   * */
  draw() {
    const that = this
    that.context.clearRect(0, 0, that.canvas.width, that.canvas.height)
    // Set a blur on the canvas
    that.context.shadowBlur = 10 * window.devicePixelRatio
    that.context.shadowColor = 'hsl(30, 100%, 40%)'

    // 0. Iterate over and render the particles
    for (const particle of that.particles.filter(p => !p.dead)) {
      that.context.beginPath()
      that.context.fillStyle = that.gradient
      that.context.arc(
        particle.x,
        particle.y,
        particle.size / 2,
        0,
        2 * Math.PI
      )
      that.context.fill()
    }

    // 1. Base of the meteor (A semicircle)
    that.context.beginPath()
    const radius = (that.meteorWidth / 2) * window.devicePixelRatio
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
    that.context.moveTo(
      that.canvas.width * 0.5 - radius,
      that.canvas.height * 0.5 - radius
    )
    that.context.lineTo(
      that.canvas.width * 0.5,
      that.canvas.height * 0.5 - that.meteorLength * window.devicePixelRatio
    )
    that.context.lineTo(
      that.canvas.width * 0.5 + radius,
      that.canvas.height * 0.5 - radius
    )
    that.context.fill()
    // If there's a collision make sure to include collision specific renders
    if (that.collided) {
      // Don't like this but it should work... Create a fill style for the gradient here
      const sparkGradient = that.context.createRadialGradient(that.canvas.width * 0.5, that.canvas.width * 0.5, that.options.width * 0.5, that.canvas.width * 0.5, that.canvas.width * 0.5, that.canvas.width * 0.5);
      const alpha = that.exploder.alpha * 0.25
      sparkGradient.addColorStop(0, `hsl(30 100% 80% / ${alpha})`)
      sparkGradient.addColorStop(0.05, `hsl(30 100% 70% / ${alpha})`)
      sparkGradient.addColorStop(0.2, `hsl(30 100% 40% / ${alpha})`)
      sparkGradient.addColorStop(0.25,`hsl(30 100% 20% / ${alpha})`)
      sparkGradient.addColorStop(1, `hsl(30 100% 20% / 0)`)
      // const sparkGradient = 'hsl(10 80% 100% / 0.1)'
      // 5. If there are collider sparks and we've collided, make sure you use them here...
      for (const spark of that.sparks) {
        that.context.beginPath()
        that.context.fillStyle = sparkGradient
        that.context.arc(spark.x, spark.y, spark.size / 2, 0, 2 * Math.PI)
        that.context.fill()
      }
      // 4. If there's a collision make sure you draw out the exploder...
      that.context.beginPath()
      // Is there a way to apply some alpha to this gradient potentially??
      // Can you draw an offscreen canvas and then render it in perhaps with sizing?

      that.context.fillStyle = sparkGradient
      // You know 360 is 2 * Math.PI so 50 is 2 * Math.PI / 360 * 50
      const offset = ((2 * Math.PI) / 360) * that.options.offset
      that.context.arc(
        that.canvas.width * 0.5,
        that.canvas.height * 0.5,
        that.exploder.size / 2,
        -Math.PI - offset,
        -offset
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
      particle.speed = gsap.utils.mapRange(4, 12, 2, 1, that.meteorWidth)
      particle.dead = false
      if (particle.size === 0)
        particle.size =
          gsap.utils.random(1, that.options.width * 1.25, 1) *
          window.devicePixelRatio
      if (particle.tl) particle.tl.kill()
      particle.tl = gsap.timeline().to(particle, {
        x: () =>
          gsap.utils.random(
            that.canvas.width * 0.5 - that.meteorWidth * 2.5,
            that.canvas.width * 0.5 + that.meteorWidth * 2.5,
            1
          ),
        y: () => gsap.utils.random(0, 0, 1),
        size: 0,
        repeat: -1,
        onRepeat: function () {
          if (that.collided) {
            // Kill particles on collision fade until we bring them back
            particle.dead = true
            particle.tl.kill()
          }
        },
        ease: 'power4.out',
        repeatDelay: Math.random(),
        delay: particle.speed * -1,
        duration: particle.speed,
      })
    }
  }
}

gsap.ticker.fps(24)
const SOARERS = document.querySelectorAll('canvas')
SOARERS.forEach((c) => {
  const collision = c.dataset.offset !== undefined
  new Meteor({
    collision,
    element: c,
    offset: c.dataset.offset,
    width: gsap.utils.random(4, 8, 1),
  })
})
