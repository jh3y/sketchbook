import "../../../../net/experimental-web-platform/script.js";

const TRIGGERS = document.querySelectorAll("[popuptoggletarget]");

const open = (e) => {
  const dialog = document.querySelector(
    `#${e.target.getAttribute("popuptoggletarget")}`
  );
  dialog.show();
};

TRIGGERS.forEach((input) => {
  input.addEventListener("click", open);
});
