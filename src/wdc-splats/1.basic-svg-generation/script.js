import gsap from "gsap";
import { SVG, Circle } from "@svgdotjs/svg.js";
const SIZE = 100
const generateSplat = () => {
  document.body.innerHTML = "";
  const splat = SVG();
  const COUNT = 5;
  splat.viewbox(`0 0 ${SIZE} ${SIZE}`);
  const splats = splat.group()

  for (let i = 0; i < COUNT; i++) {
    const circle = splat.circle(SIZE);
    const group = splat.group();
    group.add(circle);
    splats.add(group);
  }

  splat.addTo("body");
};

document.body.addEventListener("click", generateSplat);
