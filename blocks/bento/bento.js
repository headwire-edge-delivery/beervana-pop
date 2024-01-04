export default async function decorate(block) {
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

  let storyInterval = setInterval(() => setActiveStory(), 2000);

  const stories = document.createElement('div');
  const storiesNavigation = document.createElement('div');

  const elements = block.querySelectorAll(':scope > div');
  elements.forEach((element) => {
    const contents = element.querySelectorAll(':scope > div');
    const classes = contents[1];
    element.classList.add(...classes.innerText.toLowerCase().split(' '), 'bento-item');
    classes.remove();
  });

  block.querySelectorAll('.stories')?.forEach((storyContainer) => {
    stories.classList.add('stories-wrapper');
    storiesNavigation.classList.add('stories-navigation');

    storyContainer.querySelector(':scope > div')?.innerHTML?.split('<hr>')?.forEach((storyMarkup, i) => {
      const storyNav = document.createElement('button');
      storyNav.dataset.story = i;
      storyNav.classList.add('story-nav', i, i === 0 && 'active');
      storyNav.setAttribute('title', `Navigate to story ${i + 1}`);
      storyNav.addEventListener('click', ({ target }) => {
        clearInterval(storyInterval);
        setActiveStory(target);
        storyInterval = setInterval(() => setActiveStory(), 2000);
      });
      storiesNavigation.appendChild(storyNav);

      const storyWrapper = document.createElement('div');
      storyWrapper.classList.add('story-wrapper', i === 0 && 'active');
      storyWrapper.innerHTML = storyMarkup;
      storyWrapper.dataset.story = i;

      const img = storyWrapper.querySelector('img');
      if (img) {
        const imgSrc = img.getAttribute('src');
        storyWrapper.style = `--bg: url(${imgSrc});`;
      }
      storyWrapper.querySelector('p:has(picture)')?.remove();

      stories.appendChild(storyWrapper);
    });

    storyContainer.innerHTML = '';
    storyContainer.appendChild(stories);
    storyContainer.appendChild(storiesNavigation);
  });
}
