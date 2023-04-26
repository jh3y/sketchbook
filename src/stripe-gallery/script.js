import { faker } from '@faker-js/faker'

const SPEAKERS = document.querySelectorAll('li')
SPEAKERS.forEach((SPEAKER, index) => {
  const img = SPEAKER.querySelector('img')
  const details = SPEAKER.querySelector('.speaker__details')
  const name = SPEAKER.querySelector('.speaker__name')
  const title = SPEAKER.querySelector('.speaker__title')
  const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`
  const job = `${faker.name.jobTitle()}, ${faker.company.name()}`
  name.innerText = fullName
  title.innerText = job
  details.innerText = `${fullName}. ${job}`
  img.src = `https://assets.codepen.io/605876/headshot-${index + 1}.png?format=auto`
  img.alt = `Image of ${fullName}`
})