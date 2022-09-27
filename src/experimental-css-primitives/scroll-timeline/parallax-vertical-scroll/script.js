import "./style.css";
import "https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js";
import Splitting from 'splitting'

const TRIGGERS = document.querySelectorAll('.contents li')
const BACKDROPS = document.querySelectorAll('.backdrops li')
const SCROLLER = document.querySelector('.scroller')

// For each TRIGGER set up a ViewTimeline
// Then create WAAPI for each backdrop

const TIMELINES = []

TRIGGERS.forEach(subject => {
  TIMELINES.push(new ViewTimeline({
    subject,
    axis: 'block'
  }))
})

BACKDROPS.forEach((backdrop, index) => {
  const IMG = backdrop.querySelector('img')

  // Entry
  IMG.animate([{
    transform: 'translateY(0%)'
  }
  ], {
    timeline: TIMELINES[index - 1],
    fill: 'both',
    delay: {
      phase: 'exit', 
      percent: CSS.percent(5),
    },
    endDelay: {
      phase: 'exit', 
      percent: CSS.percent(75),
    }
  })
  // Exit
  IMG.animate([{
    transform: 'translateY(-50%)'
  }
  ], {
    timeline: TIMELINES[index],
    fill: 'both',
    delay: {
      phase: 'exit', 
      percent: CSS.percent(5),
    },
    endDelay: {
      phase: 'exit', 
      percent: CSS.percent(100),
    }
  })
})

// Split the progress wheel
Splitting()

SCROLLER.animate([
  {
    transform: 'rotate(360deg)'
  }
], {
  fill: 'both',
  timeline: TIMELINES[TIMELINES.length - 1],
  delay: {
    phase: 'enter',
    percent: CSS.percent(-200)
  },
  endDelay: {
    phase: 'enter',
    percent: CSS.percent(100)
  }
})