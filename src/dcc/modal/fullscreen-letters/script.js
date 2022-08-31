const HEADER = document.querySelector('header')
const BUTTON = document.querySelector('button')

const takeFullscreen = () => {
  HEADER.requestFullscreen()
}

BUTTON.addEventListener('click', takeFullscreen)