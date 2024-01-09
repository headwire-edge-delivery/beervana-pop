export default async function decorate(block) {
  block.querySelector('img')?.setAttribute('loading', 'eager');

  const INTERVAL_TIME = 4000;
  function setActiveStory(target) {
    const stories = document.querySelector('.stories-wrapper');
    const storiesNavigation = document.querySelector('.stories-navigation');
    const currentStory = stories.querySelector('.active');
    const currentStoryNav = storiesNavigation.querySelector('.active');
    const nextStory = target ? stories.querySelector(`[data-story="${target.dataset.story}"]`) : currentStory.nextElementSibling || stories.querySelector('.story-wrapper:first-child');
    const nextStoryNav = target || currentStoryNav.nextElementSibling || storiesNavigation.querySelector('.story-nav:first-child');
    currentStory.classList.remove('active');
    currentStoryNav.classList.remove('active');
    nextStory.classList.add('active');
    nextStoryNav.classList.add('active');
  }

  let storyInterval = setInterval(() => setActiveStory(), INTERVAL_TIME);

  const storiesNavigation = document.createElement('div');

  const elements = block.querySelectorAll(':scope > div');
  elements.forEach((element) => {
    const contents = element.querySelectorAll(':scope > div');
    const classes = contents[1];
    element.classList.add(...classes.innerText.toLowerCase().split(' '), 'bento-item');
    classes.remove();

    element.addEventListener('mousemove', ({ target, pageX, pageY }) => {
      const bentoItem = target?.closest('.bento-item');
      const x = pageX - bentoItem.offsetLeft;
      const y = pageY - bentoItem.offsetTop;
      bentoItem.style.setProperty('--left', `${x}px`);
      bentoItem.style.setProperty('--top', `${y}px`);
    });
  });

  block.querySelectorAll('.stories')?.forEach((storyContainer) => {
    storiesNavigation.classList.add('stories-navigation');

    const storiesWrapper = storyContainer.querySelector(':scope > div');
    storiesWrapper.classList.add('stories-wrapper');

    storiesWrapper.querySelectorAll('p')?.forEach((storyWrapper, i) => {
      storyWrapper.classList.add('story-wrapper', i === 0 && 'active');
      storyWrapper.dataset.story = i;
      storyWrapper.querySelector('img')?.removeAttribute('loading');

      const storyNav = document.createElement('button');
      storyNav.dataset.story = i;
      storyNav.classList.add('story-nav', i, i === 0 && 'active');
      storyNav.setAttribute('title', `Navigate to story ${i + 1}`);
      storyNav.addEventListener('click', ({ target }) => {
        clearInterval(storyInterval);
        setActiveStory(target);
        storyInterval = setInterval(() => setActiveStory(), INTERVAL_TIME);
      });
      storiesNavigation.appendChild(storyNav);
    });

    storyContainer.appendChild(storiesNavigation);
  });

  block.querySelectorAll('hr')?.forEach((hr) => hr.remove());
}
