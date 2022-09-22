import gsap from "gsap";
import { SVG, Circle } from "@svgdotjs/svg.js";
const SIZE = 100
const generateSplat = () => {
  document.body.innerHTML = "";
  const splat = SVG();
  const COUNT = 5;
  splat.viewbox(`0 0 ${SIZE} ${SIZE}`);
  const splats = splat.group()
  const groups = []
  const circles = []
  for (let i = 0; i < COUNT; i++) {
    const circle = splat.circle(SIZE);
    circle.fill('hsl(299 100% 69%)')
    const group = splat.group();
    group.add(circle);
    splats.add(group);
    groups.push(group.node);
    circles.push(circle.node);
  }

  splat.addTo("body");
  
  gsap.set(groups, {
    transformOrigin: "50% 50%",
    rotate: () => gsap.utils.random(0, 359)
  });

  gsap.set(circles, {
    yPercent: () => gsap.utils.random(-100, 100),
    scale: () => gsap.utils.random(0.5, 1.5)
  });
};

document.body.addEventListener("click", generateSplat);
