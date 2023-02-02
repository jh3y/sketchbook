import gsap from 'gsap'

const shuffle = () => {
  gsap.set('.galaxy', {
    '--hue': () => gsap.utils.random(0, 359),
    '--x': () => gsap.utils.random(10, 90, 1),
    '--y': () => gsap.utils.random(10, 90, 1)
  })
}

const onUpdate = ({ x, y }) => {
  gsap.set(document.documentElement, {
    '--pointer-x': x / window.innerWidth,
    '--pointer-y': y / window.innerHeight
  })
}

const stagger = () => {
  gsap.to('.galaxy', {
    stagger: 0.1,
    '--hue': () => gsap.utils.random(0, 359),
    '--x': () => gsap.utils.random(10, 90, 1),
    '--y': () => gsap.utils.random(10, 90, 1)
  })
}

const updateGravity = galaxy => {
  gsap.set(document.documentElement, {
    '--gravity-x': galaxy.currentTarget.style.getPropertyValue('--x') / 100,
    '--gravity-y': galaxy.currentTarget.style.getPropertyValue('--y') / 100
  })
}

window.addEventListener('pointermove', onUpdate)
gsap.utils.toArray('.galaxy').forEach(g => g.addEventListener('pointerenter', updateGravity))

document.querySelector('button').addEventListener('click', stagger)

shuffle()