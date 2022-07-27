import { faker } from '@faker-js/faker'

const FEED = document.querySelector('.feed')

const COUNT = 10

window.FAKER = faker

const generateFeedItem = (skeleton = false) => {
	const ITEM = document.createElement('li')
	ITEM.className = 'feed__item item'
	if (skeleton) ITEM.setAttribute('data-skeleton', true)
	// Generate Media
	const MEDIA = document.createElement('div')
	MEDIA.className = 'item__media'
	if (!skeleton) {
		const AVATAR = document.createElement('img')
		AVATAR.className = 'item__avatar'
		AVATAR.src = faker.image.avatar()
		AVATAR.alt = ''
		AVATAR.width = AVATAR.height = 48
		MEDIA.appendChild(AVATAR)
	}
	// Generate Author
	const AUTHOR = document.createElement('div')
	AUTHOR.className = 'item__author author'
	if (!skeleton) AUTHOR.innerHTML = `${faker.name.findName()} <span class="author__handle">@${faker.internet.userName()}</span>`
	// Generate Content
	const CONTENT = document.createElement('div')
	CONTENT.className = 'item__content'
	if (!skeleton) CONTENT.innerHTML = faker.lorem.paragraph(2)
	// Generate Metrics
	const METRICS = document.createElement('div')
	METRICS.className = 'item__metrics'
	const RETWEET = document.createElement('div')
	RETWEET.className = 'item__metric metric'
	RETWEET.innerHTML = `
	<svg viewBox="0 0 640 512" title="retweet">
	  <path d="M629.657 343.598L528.971 444.284c-9.373 9.372-24.568 9.372-33.941 0L394.343 343.598c-9.373-9.373-9.373-24.569 0-33.941l10.823-10.823c9.562-9.562 25.133-9.34 34.419.492L480 342.118V160H292.451a24.005 24.005 0 0 1-16.971-7.029l-16-16C244.361 121.851 255.069 96 276.451 96H520c13.255 0 24 10.745 24 24v222.118l40.416-42.792c9.285-9.831 24.856-10.054 34.419-.492l10.823 10.823c9.372 9.372 9.372 24.569-.001 33.941zm-265.138 15.431A23.999 23.999 0 0 0 347.548 352H160V169.881l40.416 42.792c9.286 9.831 24.856 10.054 34.419.491l10.822-10.822c9.373-9.373 9.373-24.569 0-33.941L144.971 67.716c-9.373-9.373-24.569-9.373-33.941 0L10.343 168.402c-9.373 9.373-9.373 24.569 0 33.941l10.822 10.822c9.562 9.562 25.133 9.34 34.419-.491L96 169.881V392c0 13.255 10.745 24 24 24h243.549c21.382 0 32.09-25.851 16.971-40.971l-16.001-16z" />
	</svg>
	<span>${faker.random.numeric(2)}</span>
	`
	const FAVORITE = document.createElement('div')
	FAVORITE.className = 'item__metric metric'
	FAVORITE.innerHTML = `
	<svg viewBox="0 0 512 512" title="heart">
	  <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
	</svg>
	<span>${faker.random.numeric(2)}</span>
	`
	if (!skeleton) {
		METRICS.appendChild(RETWEET)
		METRICS.appendChild(FAVORITE)
	}
	// Append all the things
	ITEM.appendChild(MEDIA)
	ITEM.appendChild(AUTHOR)
	ITEM.appendChild(CONTENT)
	ITEM.appendChild(METRICS)
	return ITEM
}

for (let i = 0; i < COUNT; i++) {
	FEED.appendChild(generateFeedItem(true))
}

// <li class="feed__item item">
//   <div class="item__media">
//   <img src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/753.jpg" alt="" class="item__avatar">
// </div>
// <div class="item__author"></div>
// <div class="item__content"></div>
// <div class="item__metrics">
//   <div class="item__metric"></div>
//   <div class="item__metric"></div>
//   <div class="item__metric"></div>
// </div>
// </li>
