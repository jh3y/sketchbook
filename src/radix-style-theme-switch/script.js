import Prism from 'https://cdn.skypack.dev/prismjs'

const TOGGLE = document.querySelector(".theme-toggle");

const SWITCH = () => {
  const isDark = TOGGLE.matches("[aria-pressed=true]") ? false : true;
  TOGGLE.setAttribute("aria-pressed", isDark);
  document.querySelector('img').src = `https://picsum.photos/1280/720?random=${isDark ? 12 : 10}`
  document.documentElement.className = isDark ? 'dark' : 'light'
}

const TOGGLE_THEME = () => {
  if (!document.startViewTransition) SWITCH()
  document.startViewTransition(SWITCH)
};

TOGGLE.addEventListener("click", TOGGLE_THEME);
