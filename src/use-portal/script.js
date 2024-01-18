import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import { Draggable } from 'https://cdn.skypack.dev/gsap@3.12.0/Draggable'



const useCircle = ({ radius, onTeardown, onComplete, onOpen, onDrag, onStart }) => {
  gsap.registerPlugin(Draggable);
  let active = false;
  let oops = false;
  let angle = 0;
  let start = { x: null, y: null };
  let center = { x: null, y: null };
  const PROXY = Object.assign(document.createElement("div"), {
    className: "proxy",
  });
  document.body.appendChild(PROXY);
  const portal = Draggable.create(PROXY, {
    trigger: document.body,
    allowContextMenu: true,
    type: "rotation",
    // On start, reset the angle, center, and start
    onDragStart: function ({ x, y }) {
      start.x = center.x = start.y = center.y = null;
      this.start = { x, y };
      this.angle = 0;
      console.clear();
      if (onStart) onStart(start);
    },
    onPress: function (event) {
      if (!this.active && onTeardown) {
        onTeardown()
      }
    },
    // On drag, you start to determine whether you're going in the right direction
    onDrag: function ({ x, y }) {
      // If we errored out by moving too fast, etc. or we've completed the circle, do nothing
      if (this.oops || this.active) return;
      // Calculate the difference since the last rotation
      const diff = Math.floor(Math.abs(this.rotation)) - this.angle;
      // If you're within the rotation bounds, then update the angle
      if (diff <= 10 && diff >= 0) {
        this.angle = Math.floor(Math.abs(this.rotation));
      } else {
        // Set "oops" to true and tear all the things down
        this.oops = true;
        // If there's a teardown function, invoke it here
        if (onTeardown) {
          onTeardown();
        }
      }
      //
      if (this.angle >= 5 && center.x === null && center.y === null) {
        // The "+50" gives you a little breathing room
        if (x > this.start.x) {
          center.x = this.start.x;
          center.y = this.start.y + (radius + 50);
        } else if (x < this.start.x) {
          center.x = this.start.x - (radius + 50);
          center.y = this.start.y;
        }
        if (onOpen) onOpen(center);
      }
      if (this.angle >= 5) {
        if (onDrag) onDrag(this.angle);
      }
      if (this.angle >= 360) {
        this.active = true
        if (onComplete) onComplete();
      }
    },
    onDragEnd: function() {
      if (!this.active && onTeardown) {
        onTeardown()
      };
      if (this.active) {
        this.active = false;
      }
      if (this.oops) {
        this.oops = false;
        if (onTeardown) {
          onTeardown();
        }
      }
      gsap.set(PROXY, { rotation: 0 });
    },
  });
  return [portal, PROXY];
};


let portalJump;
let portal;
let proxy;
let iframe;
let popover;
let button;
let canvas;
let context;
let ratio;
let portalDestination;
let getRadius = () => Math.min(150, window.innerWidth * 0.15);

const initiatePortal = (deck) => {
  const [newPortal, portalProxy] = useCircle({
    radius: getRadius(),
    onStart,
    onDrag,
    onComplete,
    onTeardown,
    onOpen: onOpen(deck),
  });
  portal = newPortal;
  proxy = portalProxy;
};

// CANVAS RELATED UTILITIES
const ACTIVATE_SPOT = (spot) => {
  spot.active = true;
  const { sparks } = spot;
  sparks.forEach((spark) => {
    if (spark.timeline) spark.timeline.kill();
    spark.timeline = gsap
      .timeline({
        repeat: -1,
      })
      .set(spark, {
        x: 0,
        y: 0,
      })
      .to(spark, {
        x: spark.destinationX,
        y: spark.destinationY,
        duration: spark.speed,
      })
      .to(
        spark,
        {
          alpha: 0,
          duration: spark.speed * 0.1,
        },
        `>-${spark.speed * 0.1}`
      );
  });
};
// END CANVAS RELATED UTILITIES

const genSparks = (index) => {
  const amount = gsap.utils.random(1, 20, 1);
  return new Array(amount).fill().map((spark) => {
    // Base the angle on 0 so upwards would be 270
    const angle = gsap.utils.random(260, 277) + (index - 100);
    const travel = gsap.utils.random(40, 250);
    return {
      travel,
      x: 0,
      y: 0,
      size: gsap.utils.random(2, 8),
      glow: `
        ${gsap.utils.random(20, 50)}
        ${gsap.utils.random(80, 100)}%
        ${gsap.utils.random(35, 95)}%
      `,
      // Given angle and radius, you know destinationX/Y,
      destinationX: travel * Math.cos((angle * Math.PI) / 180),
      destinationY: travel * Math.sin((angle * Math.PI) / 180),
      alpha: 1,
      speed: gsap.utils.random(0.1, 1),
    };
  });
};
const generateSpots = (amount) =>
  new Array(amount).fill().map((point, index) => {
    const RADIUS = getRadius() + 2;
    return {
      originX: RADIUS * Math.cos(((index - 90) * Math.PI) / 180),
      originY: RADIUS * Math.sin(((index - 90) * Math.PI) / 180),
      sparks: genSparks(index, point),
      active: false,
    };
  });
const COUNT = 360;
const SPOTS = generateSpots(COUNT);

const RENDER = () => {
  if (!canvas || !context) return;
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context.shadowColor = "hsl(30 80% 50% / 0.5)";
  context.shadowBlur = 6;
  // const CENTER = {
  //   x: window.innerWidth * 0.5,
  //   y: window.innerHeight * 0.5
  // }
  const CENTER = {
    x: canvas.__CENTER_X,
    y: canvas.__CENTER_Y,
  };
  SPOTS.forEach(({ originX, originY, sparks, active }) => {
    if (active) {
      sparks.forEach((spark) => {
        context.fillStyle = `hsl(${spark.glow} / ${spark.alpha})`;
        context.fillRect(
          CENTER.x + originX + spark.x,
          CENTER.y + originY + spark.y,
          spark.size,
          spark.size
        );
      });
    }
  });
};

const onStart = () => {
  gsap.ticker.add(RENDER);
};

const onTeardown = () => {
  gsap.ticker.remove(RENDER);
  SPOTS.forEach((spot) => (spot.active = false));
  document.body.removeEventListener('keydown', keyTear)
  console.info('tearing down')
  if (context) context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (popover) popover.remove();
  if (canvas) canvas.remove();
};

const keyTear = event => {
  if (event.key === 'Escape') {
    onTeardown()
  }
}

// Provides the center point to show the portal, etc.
const onOpen =
  (Deck) =>
  ({ x, y }) => {
    // Could just be a DIV with a super high z-index. But, seeing as you're in Canary anyway...
    popover = Object.assign(document.createElement("div"), {
      // popover: "auto",
      className: "portal",
      style: `--x: ${x}; --y: ${y}; --open: 15;`,
    });

    // const destination = !isNaN(parseInt(portalDestination, 10))
    //   ? parseInt(portalDestination, 10) - Deck.current
    //   : 1;
    // iframe = Object.assign(document.createElement("iframe"), {
    //   src: `${window.location.origin}${window.location.pathname}#${
    //     parseInt(window.location.hash.substring(1), 10) + destination
    //   }`,
    //   className: "portal__iframe",
    // });

    button = Object.assign(document.createElement("a"), {
      className: "portal__trigger",
      href: "https://twitter.com/intent/follow?screen_name=jh3yy",
      target: "_blank",
      rel: "noreferrer noopener",
      innerHTML: `
        <video src="https://assets.codepen.io/605876/thumber.mp4" autoplay muted loop></video>
      `,
    });

    ratio = window.devicePixelRatio || 1;

    canvas = Object.assign(document.createElement("canvas"), {
      className: "portal__canvas",
      height: window.innerHeight * ratio,
      width: window.innerWidth * ratio,
      style: `transform-origin: ${x}px ${y}px`,
      __CENTER_X: x,
      __CENTER_Y: y,
    });

    context = canvas.getContext("2d");

    document.body.appendChild(canvas);
    popover.appendChild(button);

    const closer = Object.assign(document.createElement('button'), {
      className: 'portal__closer'
    })

    document.body.addEventListener('keydown', keyTear)
    popover.appendChild(closer)
    closer.addEventListener('click', () => {
      onTeardown()
    })
    document.body.appendChild(popover);
  };

const onDrag = (angle) => {
  for (let i = 0; i < angle; i++) {
    if (SPOTS[i] && !SPOTS[i].active) {
      ACTIVATE_SPOT(SPOTS[i]);
    }
  }
  const open = gsap.utils.clamp(
    0,
    1,
    gsap.utils.mapRange(90, 330, 0, 1)(angle)
  );
  gsap.set(popover, { "--show": open });
};

const onComplete = () => {
  if (portal) {
    // Do anything you want here on complete
  }
};

const usePortal = function ({ active, destination }) {
  const that = this;
  if (active === true) {
    // Wipe before starting
    if (popover) popover.remove();
    if (portal) {
      portal[0].kill();
      proxy.remove();
    }
    portalDestination = undefined;
    portalJump = undefined;
    // Then initiate
    portalDestination = destination;
    initiatePortal(that);
  } else {
    if (popover) popover.remove();
    if (portal) {
      portal[0].kill();
      proxy.remove();
    }
    portalDestination = undefined;
    portalJump = undefined;
  }
};

usePortal({ active: true })