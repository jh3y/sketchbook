const ACCENT = document.querySelector('#accent')

const HUE_RANGE = document.querySelector('#hue')
const SATURATION_RANGE = document.querySelector('#saturation')
const LIGHTNESS_RANGE = document.querySelector('#lightness')

const UPDATE = () => {
  const ACCENT_COLOR = `hsl(${HUE_RANGE.value} ${SATURATION_RANGE.value}% ${LIGHTNESS_RANGE.value}%)`
  ACCENT.innerText = ACCENT_COLOR
  document.documentElement.style.setProperty('--accent-color', ACCENT_COLOR)
}

UPDATE()

HUE_RANGE.addEventListener('input', UPDATE)
SATURATION_RANGE.addEventListener('input', UPDATE)
LIGHTNESS_RANGE.addEventListener('input', UPDATE)