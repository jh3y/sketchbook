"use strict";

import React from 'react'
import ReactDOM from 'react-dom'

const ROOT = document.getElementById('app')

const DynamicIsland = () => {
  const timerRef = React.useRef(null)
  const islandRef = React.useRef(null)
  const mediaRef = React.useRef(null)
  const infoRef = React.useRef(null)
  const centerRef = React.useRef(null)
  const scaleRef = React.useRef(null)
  const cbRef = React.useRef(null)
  const [info, setInfo]   = React.useState(null)
  const [media, setMedia] = React.useState(null)
  const [box, setBox] = React.useState(null)
  
  React.useEffect(() => {
    const winddown = () => {
      const anims = []
      
      if (mediaRef.current)
        anims.push(mediaRef.current.animate({
          scale: 0
        }, {
          duration: 200,
          fill: 'forwards'
        }).finished)
      if (infoRef.current)
        anims.push(infoRef.current.animate({
          opacity: 0,
        }, {
          duration: 200,
          fill: 'forwards'
        }).finished)
      if (centerRef.current)
        anims.push(centerRef.current.animate({
          opacity: 0,
        }, {
          duration: 200,
          fill: 'forwards'
        }).finished)
      if (anims.length) {
        Promise.all(anims).then(() => {
          setInfo(null)
          setMedia(null)
          setBox(null)
        })
      }
    }
    const processIsland = ({ detail: { box, info, media, timeout, cb, nuke } }) => {
      if (nuke) return winddown()
      
      setInfo(info)
      setMedia(media)
      setBox(box)
      cbRef.current = cb

      if (timeout) {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(winddown, timeout)
      }
    }
    document.body.addEventListener('island:event', processIsland)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      document.body.removeEventListener('island:event', processIsland)
    }
  }, [])
  
  React.useEffect(() => {
    if (media || info) {
      const { width: leftWidth } = islandRef.current.querySelector('.dynamic-island__stage--left').getBoundingClientRect()
      const { width: rightWidth } = islandRef.current.querySelector('.dynamic-island__stage--right').getBoundingClientRect()
      if (Math.max(leftWidth, rightWidth) !== 0) islandRef.current.style.setProperty('--auxiliary-width', `${Math.floor(Math.max(leftWidth, rightWidth))}px`)      
    } else {
      islandRef.current.style.setProperty('--auxiliary-width', '1fr')
    }
    const { height, width } = islandRef.current.getBoundingClientRect()
    islandRef.current.style.setProperty('--width-imposed', width)
    islandRef.current.style.setProperty('--height-imposed', height)
    if (cbRef.current) {
      cbRef.current()
      const { height, width } = islandRef.current.getBoundingClientRect()
      islandRef.current.style.setProperty('--width-imposed', width)
      islandRef.current.style.setProperty('--height-imposed', height)
      cbRef.current = null
    }
  }, [info, media, box])

  return (
    <>
      <div ref={islandRef} className="dynamic-island">
        <div className="dynamic-island__stage dynamic-island__stage--left">
          {info ? <div ref={infoRef} className="dynamic-island__info">{info}</div> : null}
        </div>
        <div className="dynamic-island__stage dynamic-island__stage--camera">
          <img className="dynamic-island__lens" src="https://assets.codepen.io/605876/lens.png" alt="" />
        </div>
        <div className="dynamic-island__stage dynamic-island__stage--right">
          {media ? <div ref={mediaRef} className="dynamic-island__media" dangerouslySetInnerHTML={{__html: media}}></div> : null}
        </div>
        <div className="dynamic-island__stage dynamic-island__stage--center">
          {box ? <div ref={centerRef} className="dynamic-island__center" dangerouslySetInnerHTML={{__html: box}}></div> : null}
        </div>
      </div>
      <span id="transmitter"></span>
    </>
  )
}

ReactDOM.render(<DynamicIsland/>, ROOT);

/* Vanilla JavaScript land */
const trigger = (detail) => () => {
  const event = new CustomEvent("island:event", {
    detail,
    bubbles: true,
    cancelable: false,
    composed: true
  });
  document.getElementById("transmitter").dispatchEvent(event);
};
const hello = document.querySelector(".hello");
hello.addEventListener(
  "click",
  trigger({
    info: "Hello world!",
    timeout: 3000,
    media: `
      <span class="globes">
        <span class="globes__placeholder" role="img">🌎</span>
        <span class="globes__translater" role="img">🌎🌏🌍</span>
      </span>
    `
  })
);
const battery = document.querySelector(".charge");
if (navigator.getBattery) {
  battery.addEventListener("click", () => {
    navigator.getBattery().then((battery) => {
      battery.onchargingchange = () => {
        trigger({
          info: battery.charging ? "Charging" : "Battery Power",
          timeout: 4000,
          media: `
              <span class="battery">
                ${
                  battery.charging
                    ? `
                    <span class="battery__icon battery__icon--lightning" role="img">⚡️</span>
                    <span class="battery__text">&nbsp;${`${Math.round(
                      battery.level * 100
                    )}`.padStart(2, 0)}%</span>
                  `
                    : `
                    <span class="battery__icon battery__icon--battery" role="img">🔋</span>
                    <span class="battery__text">&nbsp;${`${Math.round(
                      battery.level * 100
                    )}`.padStart(2, 0)}%</span>
                  `
                }
              </span>
            `
        })();
      };
      trigger({
        info: battery.charging ? "Charging" : "Battery Power",
        timeout: 4000,
        media: `
            <span class="battery">
              ${
                battery.charging
                  ? `
                  <span class="battery__icon battery__icon--lightning" role="img">⚡️</span>
                  <span class="battery__text">&nbsp;${`${Math.round(
                    battery.level * 100
                  )}`.padStart(2, 0)}%</span>
                `
                  : `
                  <span class="battery__icon battery__icon--battery" role="img">🔋</span>
                  <span class="battery__text">&nbsp;${`${Math.round(
                    battery.level * 100
                  )}`.padStart(2, 0)}%</span>
                `
              }
            </span>
          `
      })();
    });
  });
} else {
  battery.setAttribute("disabled", true);
}

const loading = document.querySelector(".loading");
loading.addEventListener(
  "click",
  trigger({
    info: "Loading...",
    timeout: 4000,
    media: `
      <span class="loader" style="--count: 10;">
        <span style="--index: 0;"></span>
        <span style="--index: 1;"></span>
        <span style="--index: 2;"></span>
        <span style="--index: 3;"></span>
        <span style="--index: 4;"></span>
        <span style="--index: 5;"></span>
        <span style="--index: 6;"></span>
        <span style="--index: 7;"></span>
        <span style="--index: 8;"></span>
        <span style="--index: 9;"></span>
      </span>
    `
  })
);

const tube = document.querySelector(".youtube");
tube.addEventListener("click", () => {
  trigger({
    info: "Ahh!",
    timeout: false,
    media: `
        <span role="img">👀✨</span>
      `,
    box: `
        <div class="youtube" style="width: 100%; aspect-ratio: 16 / 9;">
          <div id="player"></div>
        </div>
      `,
    cb: () => {
      // const player = document.getElementById('player')
      // console.info(player)
      // const videoId = 'KkhpUSNe0y0'
      const videoId = "BBJa32lCaaY";
      let player = new YT.Player("player", {
        videoId,
        // height: 200,
        // width: 200,
        events: {
          onReady: ({ target }) => {
            target.playVideo();
          },
          onStateChange: ({ data }) => {
            if (data === 0) {
              trigger({
                info: null,
                media: null,
                cb: null,
                timeout: false,
                nuke: true
              })();
            }
          }
        }
      });
    }
  })();
});
