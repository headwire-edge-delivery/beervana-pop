function rotateStories(container) {
  setTimeout(() => {
    // navigation.style = `` // TODO make the navigation work
    const currentStory = container.querySelector('.story-wrapper:last-child');
    currentStory.classList.add('seen');
    setTimeout(() => {
      container.prepend(currentStory);
      currentStory.classList.remove('seen');
      rotateStories(container);
    }, 500);
  }, 2000);
}

export default async function decorate(block) {
  const elements = block.querySelectorAll(':scope > div');
  elements.forEach((element) => {
    const contents = element.querySelectorAll(':scope > div');
    const classes = contents[1];
    element.classList.add(...classes.innerText.toLowerCase().split(' '), 'bento-item');
    classes.remove();
  });

  block.querySelectorAll('.stories')?.forEach((storyContainer) => {
    const storyContents = storyContainer.querySelector(':scope > div');
    const stories = document.createElement('div');
    stories.classList.add('stories-wrapper');
    const storiesNavigation = document.createElement('div');
    storiesNavigation.classList.add('stories-navigation');
    const markup = storyContents.innerHTML;
    const storiesMarkup = markup.split('<hr>');
    storiesMarkup.forEach((storyMarkup, i) => {
      const storyNav = document.createElement('button');
      storyNav.classList.add('story-nav', i);
      storyNav.setAttribute('title', `Navigate to story ${i + 1}`);
      storiesNavigation.appendChild(storyNav);
      const storyWrapper = document.createElement('div');
      storyWrapper.classList.add('story-wrapper');
      storyWrapper.innerHTML = storyMarkup;
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
    rotateStories(stories, storiesNavigation);
  });
}
