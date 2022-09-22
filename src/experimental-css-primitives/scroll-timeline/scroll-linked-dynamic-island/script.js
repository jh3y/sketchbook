import "../../../../net/experimental-web-platform/script.js";
import "../../../../net/polyfills/scroll-timeline.js";

window.addEventListener('scroll', () => {
  if (window.scrollY === 0) {
    console.info('Refresh!')
  }
})