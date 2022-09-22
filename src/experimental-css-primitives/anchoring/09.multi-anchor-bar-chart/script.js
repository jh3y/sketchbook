import "../../../../net/experimental-web-platform/script.js";

const INPUTS = document.querySelectorAll("input");

const update = (e) => {
  document.querySelector(
    `#${e.target.getAttribute("data-bar-id")}`
  ).style.height = `${e.target.value}%`;
};

INPUTS.forEach((input) => {
  console.info(input);
  input.addEventListener("input", update);
});