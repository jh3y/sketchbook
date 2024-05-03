const links = document.querySelectorAll('a')
for (const link of links) {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    link.parentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  })
}
