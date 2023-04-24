import { faker } from '@faker-js/faker'

const SPEAKERS = document.querySelectorAll('.speaker')
SPEAKERS.forEach((SPEAKER, index) => {
  const img = SPEAKER.querySelector('img')
  const name = SPEAKER.querySelector('.speaker__name')
  const title = SPEAKER.querySelector('.speaker__title')
  name.innerText = `${faker.name.firstName()} ${faker.name.lastName()}`
  title.innerText = `${faker.name.jobTitle()}, ${faker.company.name()}`
  img.src = `https://assets.codepen.io/605876/headshot-${index + 1}.png?format=auto`
})