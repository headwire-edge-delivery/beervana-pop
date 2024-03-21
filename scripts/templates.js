import { createOptimizedPicture } from './aem.js';

/* eslint-disable object-curly-newline */
export function templateCards({ item, index, placeholders, config }) {
  const { description, image, path, title } = item;
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

export function templateEvents({ item, index, placeholders }) {
  const { description, image, path, title, startDate } = item;
  const breakpoints = [{ media: '(min-width: 600px)', width: '350' }, { width: '350' }];
  const { eventsButtonText } = placeholders;
  const date = new Date(startDate);
  return `<div class="event event-${index}">
    <div class="events-image image-content" style="--background-image: url(${image})">
      <a href="${path}" title="${title}">
        <span class="border-group">
          ${createOptimizedPicture(image, '', index < 3, breakpoints).outerHTML}
          <span class="date">
            <span class="weekday">${date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
            <span class="day">${date.toLocaleDateString('en-US', { day: 'numeric' })}</span>
          </span>
        </span>
      </a>
    </div>
    <div class="events-body">
      <h3>
        <a href="${path}" title="${title}">${title}</a>
      </h3>
      <p>${description}</p>
      <p class="button-container">
        <a href="${path}" class="button">${eventsButtonText}</a>
      </p>
    </div>
  </div>`;
}
