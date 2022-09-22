import "@svgdotjs/svg.js";
import "@svgdotjs/svg.filter.js";
import gsap from "gsap";

const SIZE = 100
const generateSplat = ({ x, y }) => {
  const splat = SVG();
  const COUNT = gsap.utils.random(2, 10);
  splat.viewbox(`0 0 ${SIZE} ${SIZE}`);
  const splats = splat.group()
  const circles = []
  const groups = []
  const color = `hsl(${gsap.utils.random(0, 359)} 100% 69%)`

  for (let i = 0; i < COUNT; i++) {
    const circle = splat.circle(SIZE);
    circle.fill(color)
    circle.stroke({
      color: 'hsl(0 0% 0%)',
      width: 2,
    })
    const group = splat.group();
    group.add(circle);
    splats.add(group);
    groups.push(group.node)
    circles.push(circle.node)
  }
  
  splats.filterWith(add => {
    const blur = add.gaussianBlur(10)
    const matrix = add.colorMatrix('matrix', [
      1, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 0, 25, -10
    ]).in(blur)
    add.composite(matrix).attr({
      operator: 'atop'
    })
  })
  splat.addTo("body");
  
  gsap.set(splat.node, {
    '--x': x,
    '--y': y,
  })

  gsap.set(groups, {
    transformOrigin: "50% 50%",
    rotate: () => gsap.utils.random(0, 359)
  });

  gsap.set(circles, {
    transformOrigin: '50% 100%',
    yPercent: () => gsap.utils.random(-100, 100),
    scale: () => gsap.utils.random(0.5, 1.5)
  });
  
  gsap
    .fromTo(
      circles,
      {
        scale: () => gsap.utils.random(0, 0.25),
        yPercent: 0
      },
      {
        duration: () => gsap.utils.random(0.1, 0.5),
        yPercent: () => gsap.utils.random(-100, 100),
        scale: () => gsap.utils.random(0.5, 1.5)
      }
    );
  // Now we need to add a filter   
  // <filter id="fancy-goo">
  //   <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
  //   <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
  //   <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
  // </filter>
};

document.body.addEventListener("click", generateSplat);
