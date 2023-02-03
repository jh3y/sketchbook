import "./style.css";

const articles = document.querySelectorAll('article')
articles.forEach((article, index) => {
  const img = article.querySelector('img')
  img.parentNode.replaceChild(Object.assign(document.createElement('div'), { className: 'backdrop'}), img)
  article.style = `--bg: url(https://picsum.photos/600/800?random=${index});`
})