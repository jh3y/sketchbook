import gsap from "https://cdn.skypack.dev/gsap@3.12.0";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger";

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger);
  console.clear();
  const scrub = 0.2
  const name = document.querySelector("section:nth-of-type(1) svg");
  gsap.timeline()
    .to(name, {
      scrollTrigger: {
        invalidateOnRefresh: true,
        trigger: name.parentNode,
        scrub,
        start: "top top",
        end: "bottom top-=25%"
      },
      opacity: 1,
    })
    .to(name, {
      scrollTrigger: {
        invalidateOnRefresh: true,
        trigger: name.parentNode,
        scrub,
        start: "top top",
        end: "bottom top"
      },
      keyframes: {
        "0%": { background: "transparent" },
        "95%": { background: "transparent" },
        "100%": { z: "99vh", background: "black" }
      }
    }, 0)
    ;

  const p = document.querySelector("section:nth-of-type(2) p");
  gsap
    .timeline()
    .to(p, {
      opacity: 1,
      immediateRender: false,
      scrollTrigger: {
        trigger: p.parentNode.parentNode,
        scrub,
        start: "top bottom",
        end: "top 50%"
      }
    })
    .to(p, {
      opacity: 0,
      immediateRender: false,
      scrollTrigger: {
        trigger: p.parentNode.parentNode,
        scrub,
        start: "bottom bottom",
        end: "bottom 50%"
      }
    });

  const video = document.querySelector(".video-wrap");
  gsap
    .timeline()
    .to(video, {
      opacity: 1,
      immediateRender: false,
      scrollTrigger: {
        trigger: video.parentNode,
        scrub,
        start: "top bottom",
        end: "top 50%"
      }
    })
    .to(video, {
      opacity: 0,
      immediateRender: false,
      scrollTrigger: {
        trigger: video.parentNode,
        scrub,
        start: "bottom bottom",
        end: "bottom 50%"
      }
    });
  // Signature details
  gsap.to('.signature .head', {
    '--draw': 0,
    scrollTrigger: {
      trigger: 'section:last-of-type',
      scrub,
      start: 'top 50%',
      end: 'top 20%',
    }
  })
  gsap.to('.ear', {
    '--draw': 0,
    scrollTrigger: {
      trigger: 'section:last-of-type',
      scrub,
      start: 'top 20%',
      end: 'top 10%',
    }
  })
  gsap.to('.eye', {
    '--draw': 0,
    fill: 'black',
    scrollTrigger: {
      trigger: 'section:last-of-type',
      scrub,
      start: 'top 20%',
      end: 'top 10%',
    }
  })
  gsap.to('.nose', {
    '--draw': 0,
    fill: 'black',
    scrollTrigger: {
      trigger: 'section:last-of-type',
      scrub,
      start: 'top 10%',
      end: 'top top',
    }
  })
}