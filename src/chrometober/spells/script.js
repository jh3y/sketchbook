const mapRange = (inputLower, inputUpper, outputLower, outputUpper, value) => {
  const INPUT_RANGE = inputUpper - inputLower;
  const OUTPUT_RANGE = outputUpper - outputLower;
  return clamp(
    outputLower,
    outputUpper,
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
  );
};

const clamp = (min, max, value) => Math.min(Math.max(value, min), max);

let wandFrame;
const CANVAS = document.querySelector(".wand-canvas");
let ctx = CANVAS.getContext("2d");

const blocks = [];
const createBlock = ({ x, y, movementX, movementY }) => {
  const LOWER_SIZE = CANVAS.height * 0.05;
  const UPPER_SIZE = CANVAS.height * 0.25;
  const size = mapRange(
    0,
    100,
    LOWER_SIZE,
    UPPER_SIZE,
    Math.max(Math.abs(movementX), Math.abs(movementY))
  );
  const rate = mapRange(LOWER_SIZE, UPPER_SIZE, 1, 5, size);
  const { left, top, width, height } = CANVAS.getBoundingClientRect();

  const block = {
    hue: Math.random() * 359,
    x: x - left,
    y: y - top,
    size,
    rate
  };

  blocks.push(block);
};

const drawBlocks = () => {
  ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);

  for (let b = 0; b < blocks.length; b++) {
    const block = blocks[b];
    ctx.strokeStyle = ctx.fillStyle = `hsla(${block.hue}, 80%, 80%, 0.5)`;
    ctx.beginPath();
    ctx.arc(block.x, block.y, block.size * 0.5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    block.size -= block.rate;
    block.y += block.rate;

    if (block.size <= 0) {
      blocks.splice(b, 1);
    }
  }
  wandFrame = requestAnimationFrame(drawBlocks);
};

const init = () => {
  const { height, width } = CANVAS.getBoundingClientRect();
  CANVAS.height = height;
  CANVAS.width = width;
  ctx = CANVAS.getContext("2d");
  blocks.length = 0;
  if (wandFrame) cancelAnimationFrame(wandFrame);
  wandFrame = requestAnimationFrame(drawBlocks);
};

const setUp = () => {
  if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    // Use a timeout so the <canvas> has gained full size.
    setTimeout(() => {
      init();
      window.addEventListener("pointermove", createBlock);
      window.addEventListener("resize", init);
    }, 500);
  }
};

setUp();
