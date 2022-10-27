const mapRange = (inputLower, inputUpper, outputLower, outputUpper, value) => {
  const INPUT_RANGE = inputUpper - inputLower;
  const OUTPUT_RANGE = outputUpper - outputLower;
  return (
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
  );
};

const RANGE = 15;
const LIMIT = 80;
const PORTRAIT = document.querySelector(".portrait");
const PORTRAIT_PAGE = PORTRAIT.closest(".page__side");
const EYES = PORTRAIT.querySelector(".portrait__eyes");
const LEFT_EYE = PORTRAIT.querySelector(
  ".portrait__eye--left:not(.portrait__eye--mover)"
);
const RIGHT_EYE = PORTRAIT.querySelector(
  ".portrait__eye--right:not(.portrait__eye--mover)"
);
const interact = ({ x, y }) => {
  // map a range against the eyes and pass in via custom properties
  const LEFT_EYE_BOUNDS = LEFT_EYE.getBoundingClientRect();
  const RIGHT_EYE_BOUNDS = RIGHT_EYE.getBoundingClientRect();

  const CENTERS = {
    lx: LEFT_EYE_BOUNDS.left + LEFT_EYE_BOUNDS.width * 0.5,
    rx: RIGHT_EYE_BOUNDS.left + RIGHT_EYE_BOUNDS.width * 0.5,
    ly: LEFT_EYE_BOUNDS.top + LEFT_EYE_BOUNDS.height * 0.5,
    ry: RIGHT_EYE_BOUNDS.top + RIGHT_EYE_BOUNDS.height * 0.5
  };

  Object.entries(CENTERS).forEach(([key, value]) => {
    const result = mapRange(
      value - LIMIT,
      value + LIMIT,
      -RANGE,
      RANGE,
      key.indexOf("x") !== -1 ? x : y
    );
    EYES.style.setProperty(`--${key}`, result);
  });
};
if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches)
  window.addEventListener("pointermove", interact);
