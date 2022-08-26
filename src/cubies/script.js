const COUNT = 18

const MAIN = document.querySelector('main')

const HYDRATE = count => {
  let c = 0
  while (c < count) {
    const LAYER = Object.assign(document.createElement('div'), {
      className: 'scene-wrapper',
      style: `--count: ${count}; --index: ${c + 1};`,
      innerHTML: `
        <div class="scene">
          <div class="cube">
            <div class="cuboid">
              <div class="cuboid__side"></div>
              <div class="cuboid__side"></div>
              <div class="cuboid__side"></div>
              <div class="cuboid__side"></div>
              <div class="cuboid__side"></div>
              <div class="cuboid__side"></div>
            </div>
          </div>
        </div>
      `
    })
    MAIN.appendChild(LAYER)
    c++
  }
}


HYDRATE(COUNT)