import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { Draggable } from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'
import InertiaPlugin from 'gsap/InertiaPlugin'
gsap.registerPlugin(Draggable, InertiaPlugin) 

const trigger = document.querySelector('[popovertarget]')

const triggerProps = gsap.getProperty(trigger);
const triggerTracker = InertiaPlugin.track(trigger, "left,top")[0];


gsap.defaults({ overwrite: true })

Draggable.create(trigger, {
  bounds: window,
  type: 'left,top',
  allowContextMenu: true,
  inertia: true,
  onPress() {
    gsap.killTweensOf(trigger);
    this.update();
  },
  // onDragEnd: animateBounce,
  onThrowUpdate: checkBounds,
  onDragEndParams: [],
  onDragStart: () => {
    gsap.set(trigger, { right: 'unset' })
  }
})

function animateBounce(left = "+=0", top = "+=0", vx = "auto", vy = "auto") {
  console.info([...arguments])
  gsap.fromTo(trigger, { left, top }, {
    inertia: {
      left: vx,
      top: vy,
    },
    onUpdate: checkBounds
  });  
}

function checkBounds() {
  // console.info('checking', trigger.offsetWidth)
  let friction = -1;
  let rx = trigger.offsetWidth * 0.5;    
  let ry = trigger.offsetHeight * 0.5;
  let x = triggerProps("left");
  let y = triggerProps("top");
  let vx = triggerTracker.get("left");
  let vy = triggerTracker.get("top");
  let xPos = x;
  let yPos = y;

  let hitting = false;

  if (x > window.innerWidth - rx) {
    xPos = window.innerWidth - rx;
    vx *= friction;
    hitting = true;

  } else if (x < 0) {
    xPos = 0;
    vx *= friction;
    hitting = true;
  }

  if (y + ry > window.innerHeight) {
    yPos = window.innerHeight - ry;
    vy *= friction;
    hitting = true;

  } else if (y - ry < 0) {
    yPos = ry;
    vy *= friction;
    hitting = true;
  }

  // console.info({ hitting })

  if (hitting) {
    animateBounce(xPos, yPos, vx, vy);
  } 
}