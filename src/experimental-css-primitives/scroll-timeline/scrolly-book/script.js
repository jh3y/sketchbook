import "./style.css";
import "../../../../net/experimental-web-platform/script.js";

const axis = "inline";
const range = "enter";

document.documentElement.className = axis;
document.body.className = `${axis}-body`;

const book = document.querySelector(".book");
const pages = document.querySelectorAll("[data-scroll-trigger]");
const intro = document.querySelector("[data-scroll-intro]");
const outro = document.querySelector("[data-scroll-outro]");

const introTimeline = new ViewTimeline({
  subject: intro,
  axis
});

book.animate(
  [
    {
      scale: 1
    }
  ],
  {
    timeline: introTimeline,
    delay: { phase: "enter", percent: CSS.percent(0) },
    endDelay: { phase: "enter", percent: CSS.percent(100) },
    fill: "both"
  }
);
const outroTimeline = new ViewTimeline({
  subject: outro,
  axis
});

book.animate(
  [
    {
      translate: "100% 0"
    }
  ],
  {
    timeline: outroTimeline,
    delay: { phase: "enter", percent: CSS.percent(0) },
    endDelay: { phase: "enter", percent: CSS.percent(100) },
    fill: "both"
  }
);

const setupPage = (page, index) => {
  const target = document.querySelector(
    `[data-scroll-target="${page.getAttribute("data-scroll-trigger")}"]`
  );

  const viewTimeline = new ViewTimeline({
    subject: page,
    axis
  });

  // book.animate(
  //  [
  //    {
  //      scale: 0.5,
  //      offset: 0.85,
  //    }
  //  ],
  //  {
  //    timeline: viewTimeline,
  //    timeRange: range,
  //    ease: 'ease-in-out',
  //    fill: 'both'
  //  }
  // )

  target.animate(
    [
      {
        transform: `translateZ(${(pages.length - index) * 2}px)`
      },
      {
        transform: `translateZ(${(pages.length - index) * 2}px)`,
        offset: 0.75
      },
      {
        transform: `translateZ(${(pages.length - index) * -1}px)`
      }
    ],
    {
      timeline: viewTimeline,
      delay: { phase: "enter", percent: CSS.percent(0) },
      endDelay: { phase: "enter", percent: CSS.percent(100) },
      fill: "both"
    }
  );
  target.querySelector(".page__paper").animate(
    [
      {
        transform: "rotateY(0deg)"
      },
      {
        transform: "rotateY(-180deg)"
      }
    ],
    {
      timeline: viewTimeline,
      delay: { phase: "enter", percent: CSS.percent(0) },
      endDelay: { phase: "enter", percent: CSS.percent(100) },
      fill: "both"
    }
  );
};

pages.forEach(setupPage);
