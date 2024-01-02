import { createOptimizedPicture } from '../../scripts/aem.js';

function templateCard({
  description,
  image,
  path,
  title,
}) {
  return `<div class="card">
    <div class="cards-card-image image-content">
      <a href="${path}" title="${title}">${createOptimizedPicture(image).outerHTML}</a>
    </div>
    <div class="cards-card-body">
      <h3>
        <a href="${path}" title="${title}">${title}</a>
      </h3>
      <p>${description}</p>
      <p class="button-container">
        <a href="${path}" title="${title}" class="button primary">Learn More</a>
      </p>
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
}, index) {
  return `<div class="breakout-${index % 2 === 0 ? 'left' : 'right'} two-columns block">
    <div class="default-content-wrapper">
      <h2 id="portland-art-museum">
        <a href="${path}" title="${title}">${title}</a>
      </h2>
      <p>${description}</p>
      <ul>
        ${address && `<li><span class="icon icon-map"><img data-icon-name="map" src="/icons/map.svg" loading="lazy" alt="map-pin" width="16" height="16"></span><a href="https://google.com/maps/place/${address.split('<br/>').join(' ')}" title="Map to Address" target="_blank">${address.replaceAll('<br/>,', '<br/>')}</a></li>`}
        ${telephone && `<li><span class="icon icon-phone"><img data-icon-name="phone" src="/icons/phone.svg" loading="lazy" alt="phone" width="16" height="16"></span><a href="tel:${telephone}" title="Telephone">${telephone}</a></li>`}
        ${email && `<li><span class="icon icon-mail"><img data-icon-name="mail" src="/icons/mail.svg" loading="lazy" alt="mail" width="16" height="16"></span><a href="mailto:${email}" title="${email}">${email}</a></li>`}
        ${hours && `<li><span class="icon icon-clock"><img data-icon-name="clock" src="/icons/clock.svg" loading="lazy" alt="clock" width="16" height="16"></span>${hours}</li>`}
        ${website && `<li><span class="icon icon-link"><img data-icon-name="link" src="/icons/link.svg" loading="lazy" alt="link" width="16" height="16"></span><a href="${website}" title="${websiteTitle || ''}">${websiteTitle || website}</a></li>`}
      </ul>
    </div>
    <div class="default-content-wrapper image-content">${createOptimizedPicture(image).outerHTML}</div>
  </div>`;
}

function createSVGForMonth() {
  const month = new Date().toLocaleDateString('en-US', { month: 'long' });
  let viewBox = '';

  switch (month) {
    case 'January':
      viewBox = '0 0 98 18';
      break;
    case 'February':
      viewBox = '0 0 108 18';
      break;
    case 'March':
      viewBox = '0 0 73 18';
      break;
    case 'April':
      viewBox = '0 0 61 18';
      break;
    case 'May':
      viewBox = '0 0 44 18';
      break;
    case 'June':
      viewBox = '0 0 54 18';
      break;
    case 'July':
      viewBox = '0 0 51 18';
      break;
    case 'August':
      viewBox = '0 0 84 18';
      break;
    case 'September':
      viewBox = '0 0 118 18';
      break;
    case 'October':
      viewBox = '0 0 94 18';
      break;
    case 'November':
      viewBox = '0 0 112 18';
      break;
    case 'December':
      viewBox = '0 0 109 18';
      break;
    default:
      viewBox = '0 0 56 18';
      break;
  }

  return `<svg viewBox="${viewBox}" class="month">
    <text x="0" y="15">${month}</text>
  </svg>`;
}

function templateEvents({
  description,
  image,
  path,
  title,
}, index) {
  const date = new Date();
  const minutes = date.getMinutes();
  const hour = date.getHours();
  return `<div class="event event-${index}">
    <div class="events-image image-content" style="--background-image: url(${image})">
      <a href="${path}" title="${title}">
        ${createSVGForMonth()}
        <span class="border-group">
          ${createOptimizedPicture(image).outerHTML}
          <span class="date">
            <span class="weekday">${new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
            <span class="day">${new Date().toLocaleDateString('en-US', { day: 'numeric' })}</span>
            <span class="hour">${hour}:${minutes}</span>
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
      container.innerHTML = data.map(template).join('');
      block.appendChild(container);
    }
  }
}
