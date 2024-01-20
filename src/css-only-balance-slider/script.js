if (!CSS.supports('animation-timeline: scroll()')) {
  const CONTROL = document.querySelector('.control')
  const TRACK = CONTROL.querySelector('.control__track')
  const LABEL = CONTROL.querySelector('.tooltip')
  const INPUT = document.querySelector('input')
  const update = () => {
    CONTROL.style.setProperty('--value', INPUT.value)
    TRACK.style.setProperty('--shift', INPUT.value > 40 && INPUT.value < 68 ? 1 : 0)
    LABEL.style.setProperty('--shift', INPUT.value > 40 && INPUT.value < 68 ? 1 : 0)
  }
  INPUT.addEventListener('input', update)
  update()
}