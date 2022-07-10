const SUPPORT_MESSAGES = [
  {
    modifier: 'has',
    message: 'This browser is not supported... yet. :has is currently supported in Chrome Canary with the "Experimental Web Platform Features" flag enabled.',
  },
  {
    modifier: 'popup',
    message: 'This browser is not supported... yet. popup is currently supported in Chrome Canary with the "Experimental Web Platform Features" flag enabled.',
  },
  {
    modifier: 'houdini',
    message: 'This browser is not supported... yet. Some Houdini features are currently supported in Chromium based browsers. Check <a href="https://ishoudinireadyyet.com/" rel="noopener noreferrer" target="_blank">ishoudinireadyyet.com</a>.',
  },
  {
    modifier: 'object-view-box',
    message: 'This browser is not supported... yet. object-view-box is currently supported in Chrome Canary with the "Experimental Web Platform Features" flag enabled.',
  }
]



const generateWarnings = () => {
  const CONTAINER = document.createElement('messages')
  CONTAINER.className = 'support-warnings'
  for (const {modifier, message} of SUPPORT_MESSAGES) {
    const WARNING = document.createElement('div')
    WARNING.className = `support-warning support-warning--${modifier}`
    WARNING.innerHTML = message
    CONTAINER.appendChild(WARNING)
  }
  document.body.appendChild(CONTAINER)
}

generateWarnings()


// For JavaScript APIs
if (Element.prototype.hasOwnProperty("popUp"))
  document.body.classList.add('supports-popup')