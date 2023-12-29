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
        ${address && `<li><span class="icon icon-map-pin"><img data-icon-name="map-pin" src="/icons/map-pin.svg" loading="lazy" alt="map-pin" width="16" height="16"></span><a href="https://google.com/maps/place/${address.split('<br/>').join(' ')}" title="Map to Address" target="_blank">${address.replaceAll('<br/>,', '<br/>')}</a></li>`}
        ${telephone && `<li><span class="icon icon-phone"><img data-icon-name="phone" src="/icons/phone.svg" loading="lazy" alt="phone" width="16" height="16"></span><a href="tel:${telephone}" title="Telephone">${telephone}</a></li>`}
        ${email && `<li><span class="icon icon-mail"><img data-icon-name="mail" src="/icons/mail.svg" loading="lazy" alt="mail" width="16" height="16"></span><a href="mailto:${email}" title="${email}">${email}</a></li>`}
        ${hours && `<li><span class="icon icon-clock"><img data-icon-name="clock" src="/icons/clock.svg" loading="lazy" alt="clock" width="16" height="16"></span>${hours}</li>`}
        ${website && `<li><span class="icon icon-link"><img data-icon-name="link" src="/icons/link.svg" loading="lazy" alt="link" width="16" height="16"></span><a href="${website}" title="${websiteTitle || ''}">${websiteTitle || website}</a></li>`}
      </ul>
    </div>
    <div class="default-content-wrapper image-content">${createOptimizedPicture(image).outerHTML}</div>
  </div>`;
}

const templateConfig = {
  cards: templateCard,
  breakout: templateBreakout,
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
