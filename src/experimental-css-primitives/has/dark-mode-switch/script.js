import "../../../../net/experimental-web-platform/script.js";

const BUTTON = document.querySelector('[aria-pressed]')

BUTTON.addEventListener('click', () => BUTTON.setAttribute('aria-pressed', BUTTON.matches('[aria-pressed="true"]') ? false : true))

BUTTON.setAttribute('aria-pressed', window.matchMedia('prefers-color-scheme: dark') ? true : false)