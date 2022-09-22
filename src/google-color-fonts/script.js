import { Pane } from "tweakpane";
import Splitting from "splitting";

Splitting();

const pane = new Pane();

let OVERRIDES

const PARAMS = {
  bg: "hsl(210, 58%, 15%)",
  one: "one",
  palette: 0,
  depth: 100,
  highlight: 10,
  override_one: 'hsl(280, 80%, 50%)',
  override_two: 'hsl(280, 80%, 50%)',
  override_three: 'hsl(280, 80%, 50%)',
  override_four: 'hsl(210, 80%, 50%)',
  override_five: 'hsl(280, 80%, 50%)',
  override_six: 'hsl(220, 80%, 60%)',
  override_seven: 'hsl(280, 80%, 50%)',
  override_eight: 'hsl(170, 80%, 50%)',
  override_nine: 'hsl(180, 55%, 60%)',
};

const HEADING = document.querySelector('h1')
const ESCAPE_HATCH = document.querySelector('#escape-hatch')

const UPDATE = () => {
  // console.info()
  document.documentElement.style.setProperty('--bg', PARAMS.bg)
  HEADING.style.setProperty('--depth', PARAMS.depth)
  HEADING.style.setProperty('--highlight', PARAMS.highlight)
  
  if (PARAMS.palette === 'custom') {
    // Build a custom palette for the font
    ESCAPE_HATCH.innerHTML = `
      @font-palette-values --custom-palette {
        font-family: "Nabla";
        base-palette: 0;
        override-colors:
          0 ${PARAMS.override_one},
          1 ${PARAMS.override_two},
          2 ${PARAMS.override_three},
          3 ${PARAMS.override_four},
          4 ${PARAMS.override_five},
          5 ${PARAMS.override_six},
          6 ${PARAMS.override_seven},
          7 ${PARAMS.override_eight},
          8 ${PARAMS.override_nine};
      }
    `
    OVERRIDES.disabled = false
    HEADING.style.setProperty('--palette', '--custom-palette');
  } else {
    OVERRIDES.disabled = true
    HEADING.style.setProperty('--palette', `--${PARAMS.palette}`)  
  }
}

pane.addInput(PARAMS, "bg");
pane.addInput(PARAMS, "palette", {
  options: {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    custom: "custom"
  }
});
pane.addInput(PARAMS, "depth", { min: 0, max: 200, step: 1 });
pane.addInput(PARAMS, "highlight", { min: 0, max: 24, step: 1 });


OVERRIDES = pane.addFolder({ title: 'Overrides', disabled: true, expanded: false })

OVERRIDES.addInput(PARAMS, 'override_one')
OVERRIDES.addInput(PARAMS, 'override_two')
OVERRIDES.addInput(PARAMS, 'override_three')
OVERRIDES.addInput(PARAMS, 'override_four')
OVERRIDES.addInput(PARAMS, 'override_five')
OVERRIDES.addInput(PARAMS, 'override_six')
OVERRIDES.addInput(PARAMS, 'override_seven')
OVERRIDES.addInput(PARAMS, 'override_eight')
OVERRIDES.addInput(PARAMS, 'override_nine')

pane.on('change', UPDATE)

UPDATE()