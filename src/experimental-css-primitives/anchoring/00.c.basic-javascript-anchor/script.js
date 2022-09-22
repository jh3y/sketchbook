import "../../../../net/experimental-web-platform/script.js";

const setAnchorPosition = (anchored, anchor) => {
  const bounds = anchor.getBoundingClientRect().toJSON();
  for (const [key, value] of Object.entries(bounds)) {
    anchored.style.setProperty(`--${key}`, value);
  }
};

const update = () => {
  setAnchorPosition(
    document.querySelector(".tooltip"),
    document.querySelector(".anchor")
  );
};

window.addEventListener("resize", update);
document.addEventListener("DOMContentLoaded", update);
