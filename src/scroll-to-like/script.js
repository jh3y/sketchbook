if (!CSS.supports('animation-timeline: scroll()')) {
  const like = document.querySelector('.like')
  const options = {
    threshold: 1.0,
  };
  const onObserve = (entries) => {
    like.classList[entries[0].isIntersecting ? 'add' : 'remove']('shimmer')
  }
  const observer = new IntersectionObserver(onObserve, options);
  observer.observe(like)
}