if (!CSS.supports('animation-timeline: scroll()')) {
  const CONTROL = document.querySelector('.control')
  const TRACK = CONTROL.querySelector('.control__track')
  const INPUT = document.querySelector('input')
  const update = () => {
    CONTROL.style.setProperty('--value', INPUT.value)
  }
  INPUT.addEventListener('input', update)
  INPUT.addEventListener('pointerdown', update)
  update()
}