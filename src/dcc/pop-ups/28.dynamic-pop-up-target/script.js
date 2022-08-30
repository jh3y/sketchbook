const AUDIO = {
  horn: new Audio(new URL('./mlg-airhorn.mp3', import.meta.url)),
  duck: new Audio(new URL('./duck.mp3', import.meta.url)),
}

Object.keys(AUDIO).forEach(key => AUDIO[key].volume = 0.2)

const OPTIONS = document.querySelector('.options')
const TRIGGER = document.querySelector('[popuptoggletarget]')

OPTIONS.addEventListener('change', e => TRIGGER.setAttribute('popuptoggletarget', e.target.value))

document.body.addEventListener('show', e => {
  console.info({ popupShown: e.target.id, time: Date.now() })
  AUDIO[e.target.id].currentTime = 0
  AUDIO[e.target.id].play()
})