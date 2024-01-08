import { decorateButtons, createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  decorateButtons(block);

  const heroContentWrapper = document.createElement('div');
  heroContentWrapper.classList.add('hero-content');
  block.append(heroContentWrapper);
  const picture = block.querySelector(':scope picture');

  if (picture) {
    const src = picture.querySelector('img').getAttribute('src');
    const alt = picture.querySelector('img').getAttribute('alt');
    picture.parentNode.replaceWith(picture);
    document.body.classList.add('has-hero');
    const newPicture = createOptimizedPicture(src, alt, true);
    newPicture.classList.add('hero-picture');

    block.append(newPicture);
  }

  const heroTextWrapper = document.createElement('div');
  heroTextWrapper.classList.add('hero-text');
  const heroText = block.querySelectorAll(':scope div > div :is(h1, h2)');
  heroTextWrapper.append(...heroText);
  heroContentWrapper.append(heroTextWrapper);
  const heroButtons = block.querySelectorAll(':scope div > div > .button-container');
  heroContentWrapper.append(...heroButtons);
  block.querySelector(':scope div > div')?.parentNode?.remove();
}
