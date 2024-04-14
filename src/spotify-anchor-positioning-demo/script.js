import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { Draggable } from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'

gsap.registerPlugin(Draggable)

const cover = document.querySelector('.playing')
Draggable.create(cover, {
  type: 'top,left'
})


// View Transition extras
const TOGGLE = document.querySelector(".theme-toggle");

const SWITCH = () => {
  const isDark = TOGGLE.matches("[aria-pressed=true]") ? false : true;
  TOGGLE.setAttribute("aria-pressed", isDark);
  document.documentElement.className = isDark ? 'dark' : 'light'
}

const TOGGLE_THEME = () => {
  if (!document.startViewTransition) SWITCH()
  document.startViewTransition(SWITCH)
};

TOGGLE.addEventListener("click", TOGGLE_THEME);