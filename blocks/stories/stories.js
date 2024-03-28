/* eslint-disable no-plusplus */
const INTERVAL_TIME = 4000;
let STORY_INTERVAL;

function getStoryCount(block) {
  let storyCount = block.querySelectorAll('hr').length;
  // It's possible the author didn't put a separator after the last story
  if (block.querySelectorAll('hr')[storyCount - 1].nextElementSibling) {
    storyCount++;
  } else {
    const lastHR = document.createElement('hr');
    block.querySelector('.stories.block').appendChild(lastHR);
  }
  return storyCount;
}

function setActiveStory(block, target) {
  const storiesBlock = block;
  const storiesNavigation = block.querySelector('.stories-navigation');
  const currentStory = block.querySelector('.active');
  const currentStoryNav = storiesNavigation.querySelector('.active');
  const nextStory = target ? storiesBlock.querySelector(`[data-story="${target.dataset.story}"]`) : currentStory.nextElementSibling || storiesBlock.querySelector('.story-item:first-child');
  const nextStoryNav = target || currentStoryNav.nextElementSibling || storiesNavigation.querySelector('.story-nav:first-child');
  currentStory.classList.remove('active');
  currentStoryNav.classList.remove('active');
  nextStory.classList.remove('false');
  nextStoryNav.classList.remove('false');
  nextStory.classList.add('active');
  nextStoryNav.classList.add('active');
}

function setupBlock(block) {
  if (!block.classList.contains('stories-wrapper')) {
    block.classList.add('stories-wrapper');
    block.querySelector(':scope > div').classList.add('stories', 'block');
  }
}

function storyNavClickHandler({ target }) {
  clearInterval(STORY_INTERVAL);
  setActiveStory(target);
  STORY_INTERVAL = setInterval(() => setActiveStory(), INTERVAL_TIME);
}

function setupNavigation(block, storyCount) {
  const storiesNavigation = document.createElement('div');
  storiesNavigation.classList.add('stories-navigation');
  for (let i = 0; i < storyCount; i++) {
    const storyNav = document.createElement('button');
    storyNav.dataset.story = i;
    storyNav.classList.add('story-nav', i, i === 0 && 'active');
    storyNav.setAttribute('title', `Navigate to story ${i + 1}`);
    storyNav.addEventListener('click', storyNavClickHandler);
    storiesNavigation.appendChild(storyNav);
  }
  block.appendChild(storiesNavigation);
}

function getStoryItemChildren(children) {
  const storyItemChildren = [];
  let breakout = false;
  while (!breakout && children.length > 0) {
    if (children[0].tagName === 'HR') {
      breakout = true;
      children.shift();
    } else {
      storyItemChildren.push(children.shift());
    }
  }
  return storyItemChildren;
}

function removeHRs(block) {
  const blockContent = block.querySelector(':scope > div');
  blockContent.querySelectorAll('hr').forEach((hr) => hr.remove());
}

function setupStoryItems(block, storyCount) {
  const blockContent = block.querySelector(':scope > div');
  const blockChildren = Array.from(blockContent.children);
  for (let i = 0; i < storyCount; i++) {
    const storyItem = document.createElement('div');
    storyItem.classList.add('story-item', i === 0 && 'active');
    storyItem.dataset.story = i;
    storyItem.append(...getStoryItemChildren(blockChildren));
    const pictureWrapper = storyItem.querySelector(':scope > p:has(picture)');
    pictureWrapper.classList.add('story-image-wrapper');
    const textContent = storyItem.querySelectorAll(':scope > *:not(p:has(picture))');
    if (textContent.length > 0) {
      const storyTextWrapper = document.createElement('div');
      storyTextWrapper.classList.add('story-text-wrapper');
      storyItem.appendChild(storyTextWrapper);
      storyTextWrapper.append(...textContent);
    }
    blockContent.appendChild(storyItem);
  }
  block.prepend(blockContent);
}

export default async function stories(block) {
  setupBlock(block);
  const storyCount = getStoryCount(block);
  setupStoryItems(block, storyCount);
  removeHRs(block);
  STORY_INTERVAL = setInterval(() => setActiveStory(block), INTERVAL_TIME);
  setupNavigation(block, storyCount);
}
