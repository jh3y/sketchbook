var portal
var magnification = 1.6
var active = false
var magnifier

function teardown() {
  magnifier.remove()
  active = false
  window.removeEventListener('pointermove', pointerSync)
  window.removeEventListener('scroll', scrollSync)
  window.removeEventListener('keydown', handleKeys)
}

function init(event) {
  event.target.parentNode.remove()
  document.body.addEventListener('dblclick', activateMagnifier)
  activateMagnifier({ x: event.x, y: event.y })
}

function notify() {
  const notification = Object.assign(document.createElement('div'), {
    className: 'magnifier__info',
    innerHTML: `
      <div>
        <div>
          <span>Magnifier</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <ul>
          <li>Move your cursor around to magnify areas</li>
          <li>Use <kbd>+</kbd> and <kbd>-</kbd> to configure the zoom level</li>
          <li>Use <kbd>esc</kbd> to close</li>
          <li><kbd>dblclick</kbd> to open</li>
        </ul>
      </div>
      <button>OK</button>
    `,
  })
  notification.querySelector('button').addEventListener('click', init)
  document.body.appendChild(notification)
  const styles = Object.assign(document.createElement('style'), {
    innerHTML: `
      .magnifier iframe {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100vw;
        height: 100vh;
        border: 0;
        transform-origin: 100% 0;
        max-width: unset;
        pointer-events: none;
        transform: translateX(calc(var(--magnify-x, 0) * -1px))
          translateY(calc(var(--magnify-y, 0) * -1px));
      }

      .magnifier__scope {
        height: 100%;
        width: 100%;
        scale: var(--magnification, 1.7);
        transition: scale 0.2s ease;
      }

      .magnifier {
        width: 200px;
        aspect-ratio: 1;
        position: fixed;
        top: 0;
        left: 0;
        translate: calc(var(--magnify-x, 0) * 1px) calc(var(--magnify-y, 0) * 1px);
        transform: translate(-50%, -50%);
        border: 6px solid hsl(0 0% 80%);
        border-radius: 50%;
        cursor: none;
        z-index: 999999;
        overflow: hidden;
        background: hsl(0 0% 90%);
      }

      .magnifier::after {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 50%;
        border: 2px solid white;
      }

      .magnifier__info {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        display: flex;
        font-size: 0.875rem;
        border: 1px solid hsl(0 0% 50%);
        border-radius: 6px;
        padding: 1rem 1.5rem;
        gap: 0.5rem;
        font-weight: 300;
        background: canvas;
        color: canvasText;
        color-scheme: light only;
        animation: enter 0.625s both ease-out;
        z-index: 99999;
      }

      @keyframes enter {
        0% {
          translate: 0 200%;
        }
      }

      @media (prefers-color-scheme: dark) {
        .magnifier__info {
          color-scheme: dark only;
        }
      }

      .magnifier__info kbd {
        color: hsl(10 100% 50%);
      }

      .magnifier__info > div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .magnifier__info > div div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
      }

      .magnifier__info ul {
        padding: 0;
        margin: 0;
        list-style-position: inside;
        opacity: 0.8;
        line-height: 1.5;
      }

      .magnifier__info button {
        align-self: flex-end;
        color: canvasText;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
      }

      .magnifier__info svg {
        width: 20px;
      }
    `,
  })
  document.body.appendChild(styles)
}

function scrollSync() {
  portal.contentWindow.scrollTo({
    top: window.scrollY,
    behavior: 'instant',
  })
}

function pointerSync({ x, y }) {
  document.documentElement.style.setProperty('--magnify-x', x)
  document.documentElement.style.setProperty('--magnify-y', y)
}

function handleKeys({ key }) {
  switch (key) {
    case '+':
      if (magnification < 5) {
        magnification += 0.2
        document.documentElement.style.setProperty(
          '--magnification',
          magnification
        )
      }
      break
    case '-':
      if (magnification > 1) {
        magnification -= 0.2
        document.documentElement.style.setProperty(
          '--magnification',
          magnification
        )
      }
      break
    case 'Escape':
      teardown()
      break
    default:
      return
  }
}

/**
 * 1. Open up an element to use as the magnifier
 * 2. Create the iframe
 * 3. Set up an event listener for pointermove/scroll sync
 * 4. Scale up the iframe 2x, 3x, whatever.
 * 5. Translate the iframe inside the magnifying glass
 */
function activateMagnifier({ x, y }) {
  if (active) return
  active = true
  magnifier = Object.assign(document.createElement('div'), {
    className: 'magnifier',
    innerHTML: `
      <div class="magnifier__scope">
        <iframe src="${window.location.href}#no-magnify"></iframe>
      </div>
    `,
  })

  portal = magnifier.querySelector('iframe')
  document.body.appendChild(magnifier)
  window.addEventListener('pointermove', pointerSync)
  window.addEventListener('scroll', scrollSync)
  window.addEventListener('keydown', handleKeys)
  scrollSync()
  pointerSync({ x, y })
}
if (!window.location.hash.includes('#no-magnify')) notify()
