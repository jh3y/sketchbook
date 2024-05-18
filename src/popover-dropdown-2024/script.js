import { computePosition, flip } from 'https://cdn.skypack.dev/@floating-ui/dom'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { Draggable } from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'
import InertiaPlugin from 'gsap/InertiaPlugin'
gsap.registerPlugin(Draggable, InertiaPlugin) 

const trigger = document.querySelector('[popovertarget]')
const popper = document.querySelector('[popover]')
const themer = document.querySelector('#scheme')
const triggerProps = gsap.getProperty(trigger);
const triggerTracker = InertiaPlugin.track(trigger, "left,top")[0];

const updateTheme = () => {
  document.documentElement.dataset.theme = themer.value
}

themer.addEventListener('change', () => {
  if (!document.startViewTransition) return updateTheme()
  document.startViewTransition(updateTheme)
})


const update = () => {
  if (!("anchorName" in document.documentElement.style)) {
    computePosition(trigger, popper, {
      placement: 'bottom-end',
      middleware: [flip()],
    }).then(({x, y}) => {
      // console.info({ x, y })
      document.documentElement.style.setProperty('--x', x)
      document.documentElement.style.setProperty('--y', y)
    });
  }
}

popper.addEventListener('toggle', update)

gsap.defaults({ overwrite: true })

Draggable.create(trigger, {
  // bounds: window,
  type: 'left,top',
  allowContextMenu: true,
  inertia: true,
  onDrag() { update() },
  onPress() {
    gsap.killTweensOf(trigger);
    this.update();
    // if (!("anchorName" in document.documentElement.style)) update()
  },
  // onDragEnd: animateBounce,
  onThrowUpdate: checkBounds,
  onDragEndParams: [],
  onDragStart: () => {
    gsap.set(trigger, { right: 'unset' })
  }
})

function animateBounce(left = "+=0", top = "+=0", vx = "auto", vy = "auto") {
  gsap.fromTo(trigger, { left, top }, {
    inertia: {
      left: vx,
      top: vy,
    },
    onUpdate: () => {
      checkBounds()
    }
  });  
}

function checkBounds() {
  update()
  const friction = -0.5;
  const x = triggerProps("left");
  const y = triggerProps("top");
  let vx = triggerTracker.get("left");
  let vy = triggerTracker.get("top");
  let xPos = x;
  let yPos = y;

  let hitting = false;

  if (x > window.innerWidth - trigger.offsetWidth) {
    xPos = window.innerWidth - trigger.offsetWidth;
    vx *= friction;
    hitting = true;

  } else if (x < 0) {
    xPos = 0;
    vx *= friction;
    hitting = true;
  }

  if (y > window.innerHeight - trigger.offsetHeight) {
    yPos = window.innerHeight - trigger.offsetHeight;
    vy *= friction;
    hitting = true;

  } else if (y < 0) {
    yPos = 0;
    vy *= friction;
    hitting = true;
  }

  if (hitting) {
    animateBounce(xPos, yPos, vx, vy);
  } 
}