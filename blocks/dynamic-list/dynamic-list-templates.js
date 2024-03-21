import { createOptimizedPicture } from '../../scripts/aem.js';

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
  return `<div class="event event-${index}" data-item="${index}">
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

export function templateBreakout({ item, index, placeholders }) {
  const {
    address,
    description,
    email,
    hours,
    image,
    path,
    telephone,
    title,
    website,
    websiteTitle,
  } = item;
  const { emptyLinkTitlePrefix } = placeholders;
  const breakpoints = [{ media: '(min-width: 600px)', width: '800' }, { media: '(min-width: 1200px)', width: '1250' }, { width: '750' }];
  return `<div class="breakout-${index % 2 === 0 ? 'left' : 'right'} breakout-item" data-item="${index}">
    <div class="default-content-wrapper">
      <h2 id="portland-art-museum">
        <a href="${path}" title="${title}">${title}</a>
      </h2>
      <p>${description}</p>
      <ul>
        ${address && `<li><span class="icon icon-map"><img class="light-mode" data-icon-name="map" src="/icons/map.svg" loading="lazy" alt="map-pin" width="16" height="16"><img class="dark-mode" data-icon-name="map" src="/icons/map-inverted.svg" loading="lazy" alt="map-pin" width="16" height="16"></span><a href="https://google.com/maps/place/${address.split('<br/>').join(' ')}" title="Map to Address" target="_blank">${address.replaceAll('<br/>,', '<br/>')}</a></li>`}
        ${telephone && `<li><span class="icon icon-phone"><img class="light-mode" data-icon-name="phone" src="/icons/phone.svg" loading="lazy" alt="phone" width="16" height="16"><img class="dark-mode" data-icon-name="phone" src="/icons/phone-inverted.svg" loading="lazy" alt="phone" width="16" height="16"></span><a href="tel:${telephone}" title="Telephone">${telephone}</a></li>`}
        ${email && `<li><span class="icon icon-mail"><img class="light-mode" data-icon-name="mail" src="/icons/mail.svg" loading="lazy" alt="mail" width="16" height="16"><img class="dark-mode" data-icon-name="mail" src="/icons/mail-inverted.svg" loading="lazy" alt="mail" width="16" height="16"></span><a href="mailto:${email}" title="${email}">${email}</a></li>`}
        ${hours && `<li><span class="icon icon-clock"><img class="light-mode" data-icon-name="clock" src="/icons/clock.svg" loading="lazy" alt="clock" width="16" height="16"><img class="dark-mode" data-icon-name="clock" src="/icons/clock-inverted.svg" loading="lazy" alt="clock" width="16" height="16"></span>${hours}</li>`}
        ${website && `<li><span class="icon icon-link"><img class="light-mode" data-icon-name="link" src="/icons/link.svg" loading="lazy" alt="link" width="16" height="16"><img class="dark-mode" data-icon-name="link" src="/icons/link-inverted.svg" loading="lazy" alt="link" width="16" height="16"></span><a href="${website}" title="${websiteTitle || ''}">${websiteTitle || website}</a></li>`}
      </ul>
    </div>
    <div class="default-content-wrapper image-content">
      <a href="${path}" title="${emptyLinkTitlePrefix.replace('%title%', title)}">${createOptimizedPicture(image, '', false, breakpoints).outerHTML}</a>
    </div>
  </div>`;
}
