import React from 'react'
import { render } from 'react-dom'
import remarkGfm from 'https://cdn.skypack.dev/remark-gfm'
import rehypeRaw from 'https://cdn.skypack.dev/rehype-raw'
import Color from 'https://cdn.skypack.dev/color'
import Markdown from 'https://cdn.skypack.dev/react-markdown'
import { visit } from 'https://cdn.skypack.dev/unist-util-visit'


const SLIDE_MARKDOWN = `<!-- @background="hsl(10 10% 10%)" -->
<!-- @step -->
## Markdown Slides
<!-- @step -->
## With View Transitions API
---
<!-- @background="hsl(210 80% 50%)" -->
<!-- @step -->
## Navigate with keyboard or controls
---
<!-- @background="hsl(140 80% 50%)" -->
![Some image](https://picsum.photos/600/300?random=12)
## Cool!
---
<!-- @background="hsl(320 80% 50%)" @transition="scale" -->
## Slide A
---
<!-- @background="hsl(20 10% 10%)" @transition="shrink" -->
## Slide B
---
<!-- @background="hsl(180 80% 50%)" @transition="drop" -->
## Slide C
---
<!-- @background="hsl(110 80% 50%)" @transition="swap" -->
## Slide D
---
<!-- @background="hsl(230 80% 50%)" @transition="slide" -->
## Slide E
`

const CODE_STEP_SPLITTER = '>'
const ATTRIBUTE_DECORATOR = '@'
const DEFAULT_SLIDE_COLOR = 'red'
const SLIDE_SEPARATOR = '---'
const DEFAULT_DECK_SIZE = [960, 700]

const rehypeCodeLines = function () {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "code" && node.data?.meta) {
        node.properties.dataLineNumbers = node.data.meta;
      }
    });
  };
};

// This one's trickier.
const rehypeSlideSteps = function () {
  return (tree) => {
    let steps = [];
    // Visit the entire tree and sniff out any step decorations.
    // Store them in an Array
    visit(tree, "raw", (node) => {
      if (node.value.indexOf(`${ATTRIBUTE_DECORATOR}step`) !== -1) {
        // Extract the part surrounded by the comment and read off the attributes.
        const attributeMap = node.value
          .split("\n")
          .filter((block) => block.match(new RegExp(/<!--(.*?)-->/, "g")))[0];

        const attributes = attributeMap
          .substring(4, attributeMap.length - 3)
          .split(ATTRIBUTE_DECORATOR)
          .map((bloated) => bloated.trim())
          .filter((trimmed) => trimmed !== "");

        const toApply = {};

        // TODO:: This could be used to do some "extra" stuff.
        // But, I've never needed it? How about step-transitions?
        attributes.map((attr) => {
          const [key, value] = attr.split("=");
          if (!toApply.hasOwnProperty[key]) {
            toApply[key] = value
              ? value.replace(new RegExp(/\"/, "g"), "")
              : true;
          }
        });
        steps.push({
          node,
          attributes: toApply,
        });
      }
    });

    // Gotta loop back over the raw and element to hook up the attributes...
    visit(tree, "raw", (node) => {
      const start = node.position.start.line;
      for (const step of steps) {
        // console.info({ step, start })
        if (step.node.position.start.line === start - 1) {
          // Inject attributes into the raw element...
          // Inject at the start based on the first space.
          let attributeString = ` `;
          // Build a string from the step.attributes
          for (const [attr, value] of Object.entries(step.attributes)) {
            attributeString += `data-${attr}="${value}" `;
          }
          // Add the active attribute
          attributeString += `data-step-active="false" `;
          const attempt = `${node.value.substring(
            0,
            node.value.indexOf(" ")
          )}${attributeString}${node.value.substring(
            node.value.indexOf(" ") + 1
          )}`;
          // Swap out the value
          node.value = attempt;
        }
      }
    });
    // And you gotta do this to elements too because some things won't get caught in
    // raw loop like they do in the element loop
    visit(tree, "element", (node) => {
      const nodeStart = node.position.start.line;
      for (const step of steps) {
        const stepStart = step.node.position.start.line;
        const match = stepStart === nodeStart - 1;
        if (match) {
          // When we have an element, we can inject into the properties key
          for (const [attr, value] of Object.entries(step.attributes)) {
            // For it to stick and get rendered at the other end, you gotta camelCase it
            node.properties[
              `data${attr
                .split("-")
                .map(
                  (word) =>
                    `${word.charAt(0).toUpperCase()}${word.substring(1)}`
                )
                .join("")}`
            ] = value;
          }
          // I've got a hunch that things like "dataStepTransition" are supported in script
          // but not styles yet
          node.properties.dataStepActive = "false";
        }
      }
    });
  };
};

const SlideComponents = {
  pre: ({ children, node, inline, ...props }) => {
    return (
      <pre className="code-block" {...props}>{children}</pre>
    )
  },
  iframe: ({ node, children, ...props}) => {
    // Need to sanitize the source so we only load it on slide load
    const iframeProps = Object.entries(props).reduce((map, [key, value]) => {
      return {
        ...map,
        [key === 'src' ? 'data-src' :  key]: value
      }
    }, {})

    return <iframe {...iframeProps}></iframe>
  },
  code: ({ node, inline, className, children, ...props }) => {

    return node
  }
};

const Slides = ({ slides }) => {
  // Start by taking the slides prop and concatenating all of the Markdown blocks
  let content = "";
  for (const [index, slide] of slides.entries()) {
    content += `${index > 0 ? `\n${SLIDE_SEPARATOR}\n` : ""}${slide}`;
  }
  // Once you have all of the markdown joined, you can split it by slides
  const SLIDES = content
    .split(`${SLIDE_SEPARATOR}\n`)
    .map((line) => line.replace(/\n$/, ""));

  // Render the slides taking any metadata from comment strings for transitions, etc.
  return (
    <>
      {SLIDES.map((slide, index) => {
        const options = {};
        // The first line in a slide is reserved for the slide attributes comment.
        const slideComment = slide
          .split("\n")[0]
          .match(new RegExp(/<!--(.*?)-->/, "g"));
        // If there's a match, you've got attributes to hook into and use
        if (slideComment) {
          // Take that comment and split it by whitespace.
          // Filter it for ATTRIBUTE_DECORATOR ("@") prefixed attributes
          const attributes = slideComment[0]
            .substring(4, slideComment[0].length - 3)
            .split(ATTRIBUTE_DECORATOR)
            .map((bloated) => bloated.trim())
            .filter(
              (potential) =>
                potential !== ""
            );

          // The attribute decorator is used to split the attributes and create an options object
          attributes.forEach((attribute) => {
            const [key, value] = attribute.split("=");
            options[key] = value ? value.replace(new RegExp(/\"/, "g"), "") : "true";
          });
        }
        let { background, iframe, image, video, style, ...otherOptions } =
          options;

        if (style) {
          const styleObject = {};
          const rules = style.split(";");
          rules
            .filter((rule) => rule.trim() !== "")
            .forEach((rule, index) => {
              const [property, value] = rule.split(":");
              styleObject[property.trim()] = value.trim();
            });
          style = styleObject;
        }

        // If you can, work out the slide background ahead of time. Likely unnecessary though...
        // (Doesn't have any performance impact though...)
        let isDark = true;
        if (!background) background = DEFAULT_SLIDE_COLOR;
        try {
          isDark = Color(background).isDark();
        } catch (err) {
          // console.error('Deck:: Can\'t read color variables at build time')
        }
        // Filter any plain text comments out of the comments
        const filteredOptions = Object.keys(otherOptions).reduce((options, optionKey) => {
          if (optionKey.indexOf(' ') !== -1) return options
          else return { ...options, [optionKey]: otherOptions[optionKey]}
        }, {})


        // There isn't much to the rendering.
        // Take the markdown, compile it, and wrap it in a section.
        // If you have a backdrop iframe, drop that in, same for video, image, etc.
        return (
          <section
            data-slide="true"
            data-slide-dark={isDark}
            {...(options.transition && {
              "data-slide-transition": options.transition,
            })}
            key={index}
            style={{
              "--background": options.background,
              ...style,
            }}
            {...filteredOptions}
          >
            <div className="section__backdrop">
              {iframe ? (
                <iframe
                  allowFullScreen={true}
                  allowtransparency="true"
                  className="iframe-backdrop viewport-media"
                  data-src={iframe}
                ></iframe>
              ) : null}
              {video ? (
                <video
                  className="video-backdrop viewport-media"
                  autoplay="true"
                  loop
                  muted
                >
                  <source src={video} type="video/mp4"></source>
                </video>
              ) : null}
              {image ? (
                <img
                  className="image-backdrop viewport-media"
                  src={image}
                  {...(options.imageOpacity && {
                    style: { opacity: options.imageOpacity }
                  })}
                  alt=""
                />
              ) : null}
            </div>
            <div className="section__layout">
              <div className="section__content">
                <Markdown
                  components={SlideComponents}
                  remarkPlugins={[remarkGfm, { singleTilde: false }]}
                  rehypePlugins={[rehypeCodeLines, rehypeSlideSteps, rehypeRaw]}
                >
                  {slide}
                </Markdown>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};

const ReactDeck = () => {
  const mainRef = React.useRef(null)
  React.useEffect(() => {
    new Deck({
      element: mainRef.current,
    });
  }, [])
  return (
    <main ref={mainRef}>
      <div className="watermark">
        <svg xmlns="http://www.w3.org/2000/svg" class="watermakr__logo" viewBox="0 0 742 541" fill="none">
          <path d="M435 470c0 25.405-30.534 54-64.5 54S306 495.405 306 470s30.534-38 64.5-38 64.5 12.595 64.5 38Z" fill="var(--base-coat)"/>
          <path fill="var(--base-coat)" d="M232.806 260h273.448v41H232.806z"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M579.304 132.562C634.814 177.102 666 247.511 666 310.5H475.244V273c0-21.539-17.46-39-39-39H302.816c-21.539 0-39 17.461-39 39v37.5H74c0-62.989 31.186-133.398 86.696-177.938C216.207 88.022 291.496 63 370 63c78.504 0 153.793 25.022 209.304 69.562Z" fill="var(--base-coat)"/>
          <circle cx="114" cy="158" r="104" stroke="var(--base-coat)" stroke-width="20"/>
          <circle cx="628" cy="158" r="104" stroke="var(--base-coat)" stroke-width="20"/>
          <circle class="watermark__logo-eye watermark__logo-eye--right" cx="539" cy="371" r="25" fill="var(--base-coat)"/>
          <circle class="watermark__logo-eye watermark__logo-eye--left" cx="203" cy="371" r="25" fill="var(--base-coat)"/>
          <path d="M435 470c0 25.405-30.534 54-64.5 54S306 495.405 306 470s30.534-38 64.5-38 64.5 12.595 64.5 38Z" fill="var(--base-coat)"/>
          <path fill="var(--controls)" d="M232.806 260h273.448v41H232.806z"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M579.304 132.562C634.814 177.102 666 247.511 666 310.5H475.244V273c0-21.539-17.46-39-39-39H302.816c-21.539 0-39 17.461-39 39v37.5H74c0-62.989 31.186-133.398 86.696-177.938C216.207 88.022 291.496 63 370 63c78.504 0 153.793 25.022 209.304 69.562Z" fill="var(--base-coat)"/>
        </svg>
      </div>
      <Slides slides={[SLIDE_MARKDOWN]} />
      <div className="controls">
        <button className="previous" aria-label="Previous slide">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <button className="next" aria-label="Next slide">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
      <progress className="deck-progress" min="0" max="100"></progress>
    </main>
  )
}

const App = () => <ReactDeck/>

render(<App/>, document.querySelector('#app'))

export function transitionHelper({
  skipTransition = false,
  classNames = '',
  updateDOM,
}) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM()).then(() => undefined);

    return {
      ready: Promise.reject(Error('View transitions unsupported')),
      domUpdated: updateCallbackDone,
      updateCallbackDone,
      finished: updateCallbackDone,
    };
  }

  const classNamesArray = classNames.split(/\s+/g).filter(Boolean);

  document.documentElement.classList.add(...classNamesArray);

  const transition = document.startViewTransition(updateDOM);

  transition.finished.finally(() =>
    document.documentElement.classList.remove(...classNamesArray)
  );

  return transition;
}

const getSteps = function ({ activeStep, direction }) {
  const that = this;

  // Note:: Steps traverse in DOM order. But, if indexes are provided, these take precedence.
  // Code lines get inserted at the point whereby the parent would assume a step.

  // Reset the current steps
  that.currentSteps.length = 0;
  // Create a new starting point for slide steps
  const slideSteps = [];

  const CURRENT_SLIDE = that.SECTIONS[that.current];

  // Grab all steps including those that are code step throughs
  const STEPS = CURRENT_SLIDE.querySelectorAll(
    "[data-step], code[data-code-block-steps]"
  );

  // For each step, grab an order for it and push it into the step map "slideSteps"
  for (const STEP of STEPS) {
    const index = parseInt(STEP.getAttribute("data-step"), 10);
    // If there's a code step, then make that a step
    // But key it to be removed before send off.
    // If there are code steps created, they will get inserted at this point
    if (STEP.tagName === "CODE") {
      const STEP_MAP = STEP.getAttribute("data-code-block-steps");
      STEP.setAttribute("data-step-active", true);
      // Need to test these block edge cases, like transition in, multiple in a page, etc...
      // const BLOCK_STEPS = STEP_MAP.substring(1, STEP_MAP.length - 1).trim();
      // if (BLOCK_STEPS === '') STEP.setAttribute('data-step-active', true)
    }
    // Push the slide step into the map. Remember, any specified order takes precedence
    slideSteps.push({
      toRemove: STEP.tagName === "CODE",
      element: STEP,
      index: isNaN(index) ? undefined : index,
      active: STEP.getAttribute("data-step-active") === "true" ? true : false,
    });
  }

  // At this point, sort the steps by decorator.
  // Unspecified steps go to the back of the line by DOM order
  const sortedSteps = [
    ...slideSteps
      .filter((step) => step.index !== undefined)
      .sort((a, b) => (a.index < b.index ? -1 : 1)),
    ...slideSteps.filter((step) => step.index === undefined),
  ];

  // Search for any code blocks that have steps defined
  const BLOCKS = CURRENT_SLIDE.querySelectorAll("[data-code-block-steps]");

  // For each block, you need to add the steps to the step map if there are any steps needed
  for (const BLOCK of BLOCKS) {
    // If there is a block, make steps from the lines that are desired.
    // If there is more than the code block in the slide, need to cater for this too.

    // 1. Take the attribute and check if it's not an empty Array
    const SPLITTER = CODE_STEP_SPLITTER;
    const LINE_MAP = BLOCK.getAttribute("data-code-block-steps");
    const LINE_STEPS = LINE_MAP.substring(1, LINE_MAP.length - 1)
      .split(SPLITTER)
      .filter((entry) => entry.trim() !== "");

    // Grab the index for the associated order
    // Needs to be inserted at the point...
    let INSERTION_INDEX = 0;
    for (let i = 0; i < sortedSteps.length; i++) {
      const STEP = sortedSteps[i];
      if (STEP.element === BLOCK) {
        INSERTION_INDEX = i;
        break;
      }
    }
    if (LINE_STEPS.length > 0) {
      // Iterate over the line steps and add a step for each.
      // You're going to insert things into the Array at the insertion index.
      const LINES = [];

      LINE_STEPS.forEach((step) => {
        const lines = step.split(",");

        let selector = [];

        // These are the different selector styles for code highlighting.
        // *: wildcard
        // 1,2: comma-separated lines
        // 4-6: range syntax for lines
        // Creates an Array of lines that get highlighted in each step
        for (let l = 0; l < lines.length; l++) {
          const nth = lines[l];
          if (nth === "*") {
            selector.push("*");
          } else if (nth.split("-").length > 1) {
            const ends = nth.split("-");
            const start = parseInt(ends[0], 10);
            const end = parseInt(ends[1], 10);
            for (let i = start; i < end + 1; i++)
              selector.push(parseInt(i, 10));
          } else {
            selector.push(parseInt(nth, 10));
          }
        }

        // Here's the line step that gets inserted into our stepping map.
        // At the end we remove the parent block step because it isn't required. Need to test this...
        LINES.push({
          toRemove: false,
          element: BLOCK,
          index: undefined,
          active: direction < 0 ? true : false,
          linesToHighlight: selector,
        });
      });
      // Think the insertion index should be +1'd
      sortedSteps.splice(INSERTION_INDEX, 0, ...LINES);
    }
  }
  // Filter out the steps that need to be removed
  let newSteps = sortedSteps.filter((step) => !step.toRemove);
  // At this point, you can preload the step based on location hash if required.
  if (activeStep !== undefined) {
    newSteps = newSteps.map((step, index) => {
      if (index <= activeStep) step.active = true;
      return {
        ...step,
        active: index <= activeStep,
      };
    });
  }
  return newSteps;
};

const updateDOM = async function (additionalUpdates) {
  const that = this;
  if (additionalUpdates) {
    console.info("Deck:: Making additional updates");
    additionalUpdates();
  }
  // updateDOM takes the
  const progress = (that.current / (that.SECTIONS.length - 1)).toFixed(2);
  that.progress.style.setProperty("--progress-scale", progress);
  that.progress.value = Math.floor(progress * 100);

  that.SECTIONS.forEach((section, index) => {
    section.setAttribute("data-slide-current", that.current === index);
    section.style.display = that.current === index ? "grid" : "none";

    // Set the iframes for the next slide and release from the current
    const FRAMES = section.querySelectorAll("iframe");
    FRAMES.forEach((frame) => {
      if (that.current === index) frame.src = frame.getAttribute("data-src");
      else frame.removeAttribute("src");
    });

    // Whenever we move a slide, we need to update the DOM to show the progress

    if (that.current === index) {
      that.currentSteps = that.getSteps({
        direction: that.direction,
        activeStep: undefined,
      });
    }
  });

  // Update the controls if there are no steps in the slide coming up
  that.calibrateControls()
};

const slide = function ({ direction, additionalUpdates }) {
  const that = this;
  // Store the current direction
  that.direction = direction;
  // This needs to take into account that there are no steps to reveal
  if (
    (that.current === 0 && // On first slide
      direction < 0 && // Going backwards
      (that.currentSteps.length === 0 || // No slide steps
        that.currentSteps[0].active === false)) || // First step has been deactivated
    (that.current === that.SECTIONS.length - 1 &&
      direction > 0 &&
      (that.currentSteps.length === 0 ||
        that.currentSteps[that.currentSteps.length - 1].active === true))
  ) {
    console.info("Deck:: You shall not pass!");
    return;
  }

  // Given a direction and whether there are steps, work out what you're up to...
  // Also, all reveals in previous steps need to be revealed if you refresh at a later stage...

  // console.info({ currentSteps: that.currentSteps });

  // The only part I haven't worked out is how to do line reveals on code...
  // They need to be steps that are revealed but

  if (
    direction > 0 &&
    that.currentSteps.length > 0 &&
    that.currentSteps.filter((step) => !step.active).length > 0
  ) {
    const stepToActivate = that.currentSteps.filter((step) => !step.active)[0];

    const stepIndex = that.currentSteps.indexOf(stepToActivate);

    window.location.hash = `${that.current}/${stepIndex}`;

    stepToActivate.active = true;
    // There is a different rule that needs to happen here based on whether it's a code line or an element
    // that is getting transitioned in
    if (!stepToActivate.linesToHighlight) {
      stepToActivate.element.setAttribute("data-step-active", true);
    } else if (
      stepToActivate.linesToHighlight &&
      stepToActivate.element.tagName === "CODE"
    ) {
      const CODE_BLOCK = stepToActivate.element;
      const lines = CODE_BLOCK.querySelectorAll("[data-code-block-line]");
      lines.forEach((line, index) => {
        line.setAttribute(
          "data-code-line-highlighted",
          stepToActivate.linesToHighlight.indexOf("*") !== -1 ||
            stepToActivate.linesToHighlight.indexOf(index + 1) !== -1
        );
      });
    }
    that.calibrateControls()
  } else if (
    direction < 0 &&
    that.currentSteps.length > 0 &&
    that.currentSteps.filter((step) => step.active).length > 0
  ) {
    const stepsToDeactivate = that.currentSteps.filter((step) => step.active);
    const stepToDeactivate = stepsToDeactivate[stepsToDeactivate.length - 1];

    const stepIndex = that.currentSteps.indexOf(stepToDeactivate);
    window.location.hash = `${that.current}/${stepIndex}`;

    stepToDeactivate.active = false;
    if (!stepToDeactivate.linesToHighlight) {
      stepToDeactivate.element.setAttribute("data-step-active", false);
    } else if (
      stepToDeactivate.linesToHighlight &&
      stepToDeactivate.element.tagName === "CODE"
    ) {
      // Unhighlight lines of code and highlight the ones before. If the preceding step isn't a CODE
      // Then you need to unfocus the CODE block...

      // If you're unhighlighting, you need the lines from the previous step
      const previousHighlight = stepsToDeactivate[stepsToDeactivate.length - 2];
      if (previousHighlight?.element === stepToDeactivate.element) {
        // console.info('toggle those lines here...', { stepToDeactivate })
        const CODE_BLOCK = stepToDeactivate.element;
        const lines = CODE_BLOCK.querySelectorAll("[data-code-block-line]");
        lines.forEach((line, index) => {
          line.setAttribute(
            "data-code-line-highlighted",
            previousHighlight.linesToHighlight.indexOf("*") !== -1 ||
              previousHighlight.linesToHighlight.indexOf(index + 1) !== -1
          );
        });
      } else {
        const CODE_BLOCK = stepToDeactivate.element;
        const lines = CODE_BLOCK.querySelectorAll("[data-code-block-line]");
        lines.forEach((line, index) => {
          line.removeAttribute("data-code-line-highlighted");
        });
      }
    }
    that.calibrateControls()
  } else {
    // This is the only part where we update the slide.
    // Need to cater for special effects like Doom slide, etc.

    that.current += direction;

    window.location.hash = that.current;

    // When you start a new slide, you need to factor in any steps that might also be there...
    // Here comes your document transition...
    // So boot up the things you need to do here
    document.body.setAttribute(
      "data-slide-dark",
      that.SECTIONS[that.current].getAttribute("data-slide-dark")
    );
    document.body.setAttribute(
      "data-direction",
      direction > 0 ? "forward" : "backward"
    );
    document.body.setAttribute(
      "data-slide-transition",
      `${
        that.SECTIONS[that.current].getAttribute("data-slide-transition") ||
        "slide"
      }-${direction > 0 ? "forward" : "backward"}`
    );

    // Start the transition
    // Only do this if it's a slide change
    return transitionHelper({
      updateDOM: () => updateDOM.bind(that)(additionalUpdates),
    });
  }
};

const scaleDeck = function () {
  const that = this;
  // Attempt to keep the section__content at the same scale to fill 80 percent of the viewport???
  const H_SCALE = (window.innerWidth * 0.96) / that.DECK_SIZE[0];
  const V_SCALE = (window.innerHeight * 0.96) / that.DECK_SIZE[1];
  const SCALE = Math.min(2, Math.max(Math.min(H_SCALE, V_SCALE), 0.2));

  document.documentElement.style.setProperty("--section-scale", SCALE);
};

const bootstrapSlides = function () {
  const that = this;
  that.SECTIONS.forEach((slide, index) => {
    const slideColor = getComputedStyle(slide).backgroundColor;
    const isDark = new Color(slideColor).isDark();
    slide.setAttribute("data-slide-dark", isDark);
    slide.setAttribute("data-slide-current", that.current === index);
    slide.style.display = that.current === index ? "grid" : "none";
    // If slide is before current, make sure any steps are set to visible
    if (index < that.current) {
      const STEPS_TO_REVEAL =
        that.SECTIONS[index].querySelectorAll("[data-step]");
      STEPS_TO_REVEAL.forEach((step) =>
        step.setAttribute("data-step-active", true)
      );
    }
    // Work around for iframe loading
    const FRAMES = slide.querySelectorAll("iframe");
    FRAMES.forEach((frame) => {
      if (that.current === index) frame.src = frame.getAttribute("data-src");
      else frame.removeAttribute("src");
    });
    // Get and set the current steps that need to be revealed...
    if (that.current === index) {
      // Can this be based on the current hash of setting the currently active state...?
      let activeStep;
      if (window.location.hash.substring(1).split("/").length > 1) {
        activeStep = parseInt(
          window.location.hash.substring(1).split("/")[1],
          10
        );
      }

      that.currentSteps = that.getSteps({ direction: undefined, activeStep });

      // When we bootstrap the slides, we can show the active ones on load.

      that.currentSteps.forEach((step) => {
        if (
          step.active &&
          step.element.tagName !== "CODE" &&
          !step.linesToHighlight
        ) {
          step.element.setAttribute("data-step-active", true);
        } else if (
          step.active &&
          step.element.tagName === "CODE" &&
          step.linesToHighlight
        ) {
          const lines = step.element.querySelectorAll("[data-code-block-line]");
          lines.forEach((line, index) => {
            line.setAttribute(
              "data-code-line-highlighted",
              step.linesToHighlight.indexOf("*") !== -1 ||
                step.linesToHighlight.indexOf(index + 1) !== -1
            );
          });
        }
      });
    }
  });
};

class Deck {
  constructor({ element, ...options }) {
    const that = this;
    if (element.tagName !== "MAIN")
      throw Error("Deck: Please instantiate with <main>");
    that.element = element;
    that.progress = that.element.querySelector("progress");
    that.options = options;
    that.bootstrap();
    return that;
  }
  bootstrap() {
    const that = this;
    // Set a deck attribute
    that.element.setAttribute("data-deck", true);
    // Get variable stores, etc. setup
    that.currentSteps = [];
    that.current = window.location.hash
      ? parseInt(window.location.hash.substring(1), 10)
      : 0;
    // Deck size should be configurable for sure!
    that.DECK_SIZE = that.options.deckSize || DEFAULT_DECK_SIZE;
    that.SECTIONS = that.element.querySelectorAll("section");
    that.NEXT = that.element.querySelector(".next");
    that.PREVIOUS = that.element.querySelector(".previous");
    // Show the deck once it's initialized. Could transition it in if we wanted...
    that.bootstrapSlides();
    // Bind any events that need to be hooked up
    that.bindEvents();
    // Calibrate the controls
    that.calibrateControls();
    // Scale the deck
    that.scaleDeck();
    // Set any remainder styles, etc.
    const progress = (that.current / (that.SECTIONS.length - 1)).toFixed(2);
    that.progress.style.setProperty("--progress-scale", progress);
    that.progress.value = Math.floor(progress * 100);
    document.body.setAttribute(
      "data-slide-dark",
      that.SECTIONS[0].getAttribute("data-slide-dark")
    );
    document.documentElement.style.setProperty(
      "--deck-content-width",
      `${that.DECK_SIZE[0]}px`
    );
    document.documentElement.style.setProperty(
      "--deck-content-height",
      `${that.DECK_SIZE[1]}px`
    );
    // Display the deck
    that.element.style.display = "grid";
    console.info("Deck:: Strapped!");
  }

  calibrateControls() {
    const that = this;
    that.NEXT.disabled =
      that.current === that.SECTIONS.length - 1 &&
      that.currentSteps.every((step) => step.active)
        ? true
        : false;

    that.PREVIOUS.disabled =
      that.current === 0 && that.currentSteps.every((step) => !step.active)
        ? true
        : false;
  }

  bindEvents() {
    const that = this;
    const MOVE_FORWARD = (event) => {
      if (event) that.NEXT.style.setProperty("--active", 1);
      const transition = that.slide({ direction: 1 });
      if (transition) {
        transition.finished.finally(() => {
          if (event) that.NEXT.removeAttribute("style");
        });
      } else if (event) {
        that.NEXT.removeAttribute("style");
      }
    };
    const MOVE_BACKWARD = (event) => that.slide({ direction: -1 });

    document.body.addEventListener("keyup", (event) => {
      if (event.keyCode === 37) MOVE_BACKWARD();
      if (event.keyCode === 39) MOVE_FORWARD();
    });
    window.addEventListener("resize", that.scaleDeck.bind(that));
    that.NEXT.addEventListener("click", MOVE_FORWARD);
    that.PREVIOUS.addEventListener("click", MOVE_BACKWARD);

    console.info("Deck:: Events strapped!");
  }
  // These internal functions are set up elsewhere so this file isn't a complete beast to look at.
  bootstrapSlides() {
    const that = this;
    bootstrapSlides.bind(this)();
    console.info("Deck:: Slides strapped!");
  }
  slide({ direction, additionalUpdates }) {
    const that = this;
    let transition;
    transition = slide.bind(that)({ direction, additionalUpdates });
    console.info("Deck:: Slid!");
    return transition;
  }
  scaleDeck() {
    const that = this;
    scaleDeck.bind(that)();
    console.info("Deck:: Scaled");
  }
  getSteps({ activeStep, direction }) {
    const that = this;
    const newSteps = getSteps.bind(that)({ activeStep, direction });
    return newSteps;
  }
}