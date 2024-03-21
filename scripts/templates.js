import { createOptimizedPicture } from './aem.js';

export function templateCard({
  description,
  image,
  path,
  title,
}, index, placeholders, config) {
  const breakpoints = [{ media: '(min-width: 600px)', width: '500' }, { width: '300' }];
  const { emptyLinkTitlePrefix, cardButtonText } = placeholders;
  return `<div class="card" data-index="${index}">
    <a 
      class="cards-card-image image-content"
      href="${path}"
      title="${emptyLinkTitlePrefix.replace('%title%', title)}">
      ${createOptimizedPicture(image, '', false, breakpoints).outerHTML}
    </a>
    <div class="cards-card-body">
      <h3>
        <a href="${path}" title="${title}">${title}</a>
      </h3>
      ${!config.variant.includes('brewery') ? `<p>${description}</p>
      <p class="button-container">
        <a
          href="${path}"
          title="${emptyLinkTitlePrefix.replace('%title%', title)}"
          class="button">
          ${cardButtonText}
        </a>
      </p>` : ''}
    </div>
  </div>`;
}

export function templateCards({ data, config, placeholders }) {
  const items = data.map(({
    description,
    image,
    path,
    title,
  }, index) => templateCard({
    description,
    image,
    path,
    title,
  }, index, placeholders, config))
    .join('');
  return `<div class="cards ${config.variant}">${items}</div>`;
}
