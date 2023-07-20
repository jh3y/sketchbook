import gsap from "https://cdn.skypack.dev/gsap@3.12.2";
import { Draggable } from "https://cdn.skypack.dev/gsap@3.12.2/Draggable";
gsap.registerPlugin(Draggable);

const ITEM_COUNT = 12;

// Can we instead generate the chip board???

const CONTAINER = document.querySelector(".container");
const ANNOTATIONS = document.querySelector(".annotations");

const SPEED_LIMIT = [4, 12];
const DELAY_LIMIT = [0, 6];
const STOP_LIMIT = [5, 45];

const DEBUG_ANNOTATION = (SOURCE, ANNOTATION) => () => {
  SOURCE.dataset.debug = ANNOTATION.dataset.debug = ANNOTATION.dataset.debug === "true" ? false : true
  console.info(ANNOTATION.dataset.debug)
  document.body.dataset.debugging = ANNOTATION.dataset.debug
}

const CONFIG = [
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 15,
    Y: 10,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: 0,
    OFFSET_TWO_X: 0,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: 0,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0,
    INVERTED: false,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 30,
    Y: 30,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.2,
    OFFSET_TWO_X: 0,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: 0,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0,
    INVERTED: false,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 60,
    Y: 20,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.2,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: 0,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0,
    INVERTED: false,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 80,
    Y: 35,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: 0,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0,
    INVERTED: false,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 78,
    Y: 58,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: 0,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0,
    INVERTED: false,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 60,
    Y: 70,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: 0,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0.2,
    INVERTED: false,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 70,
    Y: 84,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: 0,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0.1,
    INVERTED: false,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 25,
    Y: 25,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: 0,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0.1,
    INVERTED: false,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 25,
    Y: 90,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: 0,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0.1,
    INVERTED: false,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 15,
    Y: 70,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: -0.05,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0.1,
    INVERTED: false,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 35,
    Y: 60,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: -0.1,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0.1,
    INVERTED: false,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 25,
    Y: 15,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: -0.1,
    OFFSET_THREE_Y: 0,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0.1,
    INVERTED: true,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 5,
    Y: 85,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: -0.1,
    OFFSET_THREE_Y: 0.1,
    OFFSET_FOUR_X: 0,
    OFFSET_FOUR_Y: 0.1,
    INVERTED: true,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 80,
    Y: 65,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: 0,
    OFFSET_THREE_X: -0.1,
    OFFSET_THREE_Y: 0.1,
    OFFSET_FOUR_X: 0.05,
    OFFSET_FOUR_Y: 0.1,
    INVERTED: true,
  },
  {
    HUE: gsap.utils.random(0, 359, 1),
    COLOR_STOP: gsap.utils.random(STOP_LIMIT[0], STOP_LIMIT[1], 1),
    SPEED: gsap.utils.random(SPEED_LIMIT[0], SPEED_LIMIT[1]),
    DELAY: gsap.utils.random(DELAY_LIMIT[0], DELAY_LIMIT[1]),
    X: 70,
    Y: 25,
    OFFSET_ONE_X: 0,
    OFFSET_ONE_Y: -0.1,
    OFFSET_TWO_X: -0.1,
    OFFSET_TWO_Y: -0.1,
    OFFSET_THREE_X: -0.1,
    OFFSET_THREE_Y: 0.1,
    OFFSET_FOUR_X: 0.05,
    OFFSET_FOUR_Y: 0.1,
    INVERTED: true,
  },
];

for (let i = 0; i < CONFIG.length; i++) {
  const {
    HUE,
    COLOR_STOP,
    SPEED,
    DELAY,
    X,
    Y,
    OFFSET_ONE_X,
    OFFSET_ONE_Y,
    OFFSET_TWO_X,
    OFFSET_TWO_Y,
    OFFSET_THREE_X,
    OFFSET_THREE_Y,
    OFFSET_FOUR_X,
    OFFSET_FOUR_Y,
    INVERTED,
  } = CONFIG[i];
  // Create a source based on...
  /**
   * .source--two {
   * --bg: hsl(280 100% 50%);
   * anchor-name: --source-two;
   * --x: 30vw;
   * --y: 30vh;
   * }
   * */
  const SOURCE = Object.assign(document.createElement("div"), {
    className: "source",
    style: `
      --bg: hsl(${HUE} 100% 65%);
      anchor-name: --source${i};
      --x: ${X}vw;
      --y: ${Y}vh;
    `,
  });
  CONTAINER.appendChild(SOURCE);



  // Create the annotation
  const ANNOTATION = Object.assign(document.createElement("div"), {
    className: `annotation${INVERTED ? " annotation--inverted" : ""}`,
    style: `
      --offset-one-x: ${OFFSET_ONE_X};
      --offset-one-y: ${OFFSET_ONE_Y};
      --offset-two-x: ${OFFSET_TWO_X};
      --offset-two-y: ${OFFSET_TWO_Y};
      --offset-three-x: ${OFFSET_THREE_X};
      --offset-three-y: ${OFFSET_THREE_Y};
      --offset-four-x: ${OFFSET_FOUR_X};
      --offset-four-y: ${OFFSET_FOUR_Y};
      --anchor-one: --charger;
      --anchor-two: --source${i};
      --color-stop: ${COLOR_STOP}deg;
      --color-one: hsl(${HUE + gsap.utils.random(-10, 10, 1)} 100% 75%);
      --color-two: hsl(${HUE + gsap.utils.random(-10, 10, 1)} 100% 65%);
      --speed: ${SPEED}s;
      --delay: ${DELAY}s;
    `,
    innerHTML: `
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    `,
  });
  ANNOTATIONS.appendChild(ANNOTATION);
  SOURCE.addEventListener('dblclick', DEBUG_ANNOTATION(SOURCE, ANNOTATION))
}

Draggable.create(".source", { type: "left,top", allowContextMenu: true });