import "./style.css";
import "../../../../net/experimental-web-platform/script.js";

window.addEventListener('scroll', () => {
  if (window.scrollY === 0) {
    console.info('Refresh!')
  }
})