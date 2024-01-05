import { fetchPlaceholders } from './aem.js';

async function decoratePreviousNext(placeholders) {
  const contentType = window.location.pathname.split('/')[1];
  if (contentType) {
    const response = await fetch(`/query-index.json?sheet=${contentType}`);
    if (response.ok) {
      const { data } = await response.json();
      if (data) {
        const path = window.location.pathname;
        const index = data.findIndex((item) => item.path === path);
        const previous = data[index - 1];
        const next = data[index + 1];

        const { nextLinkText, previousLinkText } = placeholders;
        const previousLink = previous?.path || `/${contentType}`;
        const nextLink = next?.path || `/${contentType}`;

        if (previousLink || previousLinkText || nextLink || nextLinkText) {
          const pagination = document.createElement('div');
          pagination.classList.add('pagination', 'details-group');
          const previousLinkHTML = previousLink ? `<li>
                <span class="icon icon-arrow-left">
                  <img data-icon-name="arrow-left" src="/icons/arrow-left.svg" loading="lazy" alt="arrow-left" width="16" height="16">
                </span>
                <a href="${previousLink}" title="${previous?.title || previousLinkText}">
                  <span>${previous?.title ? `${previousLinkText}: ${previous?.title}` : previousLinkText}</span>
                </a>
              </li>` : '';
          const nextLinkHTML = nextLink ? `<li>
                <span class="icon icon-arrow-right">
                  <img data-icon-name="arrow-right" src="/icons/arrow-right.svg" loading="lazy" alt="arrow-right" width="16" height="16">
                </span>
                <a href="${nextLink}" title="${next?.title || nextLinkText}">
                  <span>${next?.title ? `${nextLinkText}: ${next?.title}` : nextLinkText}</span>
                </a>
              </li>` : '';

          if (previousLink || nextLink) {
            pagination.innerHTML = `<h4>Up Next</h4><ul class="icon-list">${previousLinkHTML}${nextLinkHTML}</ul>`;
            document.querySelector('.details-wrapper').appendChild(pagination);
          }
        }
      }
    }
  }
}

async function decorateDetails(placeholders) {
  const { websiteTitle } = placeholders;

  const hours = document.querySelector('meta[name="hours"]')?.getAttribute('content') || '';
  const address = document.querySelector('meta[name="address"]')?.getAttribute('content') || '';
  const telephone = document.querySelector('meta[name="telephone"]')?.getAttribute('content') || '';
  const website = document.querySelector('meta[name="website"]')?.getAttribute('content') || '';
  const email = document.querySelector('meta[name="email"]')?.getAttribute('content') || '';
  const onTap = document.querySelector('meta[name="on-tap"]')?.getAttribute('content') || '';

  if (hours || address || telephone || website || websiteTitle || email || onTap) {
    const contact = document.createElement('div');
    contact.classList.add('metadata-wrapper', 'details-group');
    contact.innerHTML = `<div class="contact-info">
      <h4>Contact</h4>
      <ul class="icon-list">
        ${address && `<li><span class="icon icon-map"><img data-icon-name="map" src="/icons/map.svg" loading="lazy" alt="map-pin" width="16" height="16"></span><a href="https://google.com/maps/place/${address.replaceAll('<br/>,', '').replaceAll(' ', '+')}">${address.replaceAll('<br/>,', '<br/>')}</a></li>`}
        ${telephone && `<li><span class="icon icon-phone"><img data-icon-name="phone" src="/icons/phone.svg" loading="lazy" alt="phone" width="16" height="16"></span><a href="tel:${telephone}" title="Telephone Number">${telephone}</a></li>`}
        ${email && `<li><span class="icon icon-mail"><img data-icon-name="mail" src="/icons/mail.svg" loading="lazy" alt="mail" width="16" height="16"></span><a href="mailto:${email}" title="${email}">${email}</a></li>`}
        ${website && `<li><span class="icon icon-link"><img data-icon-name="link" src="/icons/link.svg" loading="lazy" alt="link" width="16" height="16"></span><a href="${website}" title="${websiteTitle || ''}">${websiteTitle || website}</a></li>`}
      </ul>
    </div>
    ${hours && `<div class="hours-info">
      <h4>Hours</h4>
      <ul class="icon-list">
      <li><span class="icon icon-clock"><img data-icon-name="clock" src="/icons/clock.svg" loading="lazy" alt="clock" width="16" height="16"></span>${hours.replaceAll('<br/>,', '<br/>')}</li>
      </ul>
    </div>`}
    ${onTap && `<div class="on-tap-info">
      <h4 id="on-tap">On Tap</h4>
      <ul>${onTap.split(',').map((beer) => `<li>${beer}</li>`).join('')}</ul>
    </div>`}`;

    document.querySelector('.details-wrapper').appendChild(contact);
  }
}

export default async function decorateTemplateDetails() {
  const placeholders = await fetchPlaceholders();
  const detailsWrapper = document.createElement('div');
  detailsWrapper.classList.add('details-wrapper');
  document.querySelector('main .section').appendChild(detailsWrapper);
  decoratePreviousNext(placeholders);
  decorateDetails(placeholders);
}
