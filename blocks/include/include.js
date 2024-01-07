import { createOptimizedPicture, fetchPlaceholders } from '../../scripts/aem.js';

function templateCard({
  description,
  image,
  path,
  title,
}, index, placeholders, styles) {
  const { emptyLinkTitlePrefix, cardButtonText } = placeholders;
  return `<div class="card">
    <div class="cards-card-image image-content">
      <a href="${path}" title="${emptyLinkTitlePrefix.replace('%title%', title)}">${createOptimizedPicture(image).outerHTML}</a>
    </div>
    <div class="cards-card-body">
      <h3>
        <a href="${path}" title="${title}">${title}</a>
      </h3>
      ${!styles.includes('brewery') ? `<p>${description}</p>
      <p class="button-container">
        <a href="${path}" title="${emptyLinkTitlePrefix.replace('%title%', title)}" class="button primary">${cardButtonText}</a>
      </p>` : ''}
    </div>
  </div>`;
}

function templateBreakout({
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
}, index, placeholders) {
  const { emptyLinkTitlePrefix } = placeholders;
  const breakpoints = [{ media: '(min-width: 600px)', width: '1250' }, { width: '750' }];
  return `<div class="breakout-${index % 2 === 0 ? 'left' : 'right'} two-columns block">
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

function templateEvents({
  description,
  image,
  path,
  title,
  startDate,
}, index) {
  const date = new Date(startDate);
  return `<div class="event event-${index}">
    <div class="events-image image-content" style="--background-image: url(${image})">
      <a href="${path}" title="${title}">
        <span class="border-group">
          ${createOptimizedPicture(image).outerHTML}
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
        <a href="${path}" title="${title}" class="button">Learn More</a>
      </p>
    </div>
  </div>`;
}

const templateConfig = {
  breakout: templateBreakout,
  cards: templateCard,
  events: templateEvents,
  default: templateCard,
};

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const queryA = block.querySelector('a[href*="query-index.json"]');
  if (queryA) {
    const styles = Array.from(block.classList).filter((c) => c.toLowerCase() !== 'include' && c.toLowerCase() !== 'block');
    const params = new URLSearchParams(queryA.href);
    block.querySelector(':scope > div:first-child').remove();
    const response = await fetch(queryA.href);
    if (response.ok) {
      let { data } = await response.json();
      if (data?.length > 0) {
        /* refactor to loop over params and filter data */
        if (params.get('tag')) {
          data = data.filter((item) => JSON.parse(item.tags.toLowerCase()).includes(params.get('tag')));
        }
      }

      const template = templateConfig[styles[0]] || templateConfig.default;
      const container = document.createElement('div');
      container.className = `${styles.join(' ')} wrapper`;
      container.innerHTML = data.map((item, index) => template(item, index, placeholders, styles)).join('');
      block.appendChild(container);
    }
  }
}
