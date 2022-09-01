// Polyfill

const HOVER_TRIGGERS = document.querySelectorAll("[popuphovertarget]");

const showPop = (pop) => () => pop.showPopUp();
const hidePop = (pop) => () => pop.hidePopUp();

HOVER_TRIGGERS.forEach((trigger) => {
  const popup = document.querySelector(
    `#${trigger.getAttribute("popuphovertarget")}`
  );
  trigger.addEventListener("pointerenter", showPop(popup));
  trigger.addEventListener("pointerleave", hidePop(popup));
});
