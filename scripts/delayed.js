// eslint-disable-next-line import/no-cycle
import { fetchPlaceholders, sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

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
                  <img class="light-mode" data-icon-name="arrow-left" src="/icons/arrow-left.svg" loading="lazy" alt="arrow-left" width="16" height="16">
                  <img class="dark-mode" data-icon-name="arrow-left" src="/icons/arrow-left-inverted.svg" loading="lazy" alt="arrow-left" width="16" height="16">
                </span>
                <a href="${previousLink}" title="${previous?.title || previousLinkText}">
                  <span>${previous?.title ? `${previousLinkText}: ${previous?.title}` : previousLinkText}</span>
                </a>
              </li>` : '';
          const nextLinkHTML = nextLink ? `<li>
                <span class="icon icon-arrow-right">
                  <img class="light-mode" data-icon-name="arrow-right" src="/icons/arrow-right.svg" loading="lazy" alt="arrow-right" width="16" height="16">
                  <img class="dark-mode" data-icon-name="arrow-right" src="/icons/arrow-right-inverted.svg" loading="lazy" alt="arrow-right" width="16" height="16">
                </span>
                <a href="${nextLink}" title="${next?.title || nextLinkText}">
                  <span>${next?.title ? `${nextLinkText}: ${next?.title}` : nextLinkText}</span>
                </a>
              </li>` : '';

          if (previousLink || nextLink) {
            pagination.innerHTML = `<strong class="font-display text-md details-group-title">${nextLinkText}</strong><ul class="icon-list">${previousLinkHTML}${nextLinkHTML}</ul>`;
            document.querySelector('.details-wrapper').appendChild(pagination);
          }
        }
      }
    }
  }
}

async function decorateDetails(placeholders) {
  const { nextLinkText, websiteTitle } = placeholders;

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
      <strong class="font-display text-md details-group-title">Contact</strong>
      <ul class="icon-list">
        ${address && `<li><span class="icon icon-map"><img class="light-mode" data-icon-name="map" src="/icons/map.svg" loading="lazy" alt="map-pin" width="16" height="16"><img class="dark-mode" data-icon-name="map" src="/icons/map-inverted.svg" loading="lazy" alt="map-pin" width="16" height="16"></span><a href="https://google.com/maps/place/${address.replaceAll('<br/>,', '').replaceAll(' ', '+')}">${address.replaceAll('<br/>,', '<br/>')}</a></li>`}
        ${telephone && `<li><span class="icon icon-phone"><img  class="light-mode" data-icon-name="phone" src="/icons/phone.svg" loading="lazy" alt="phone" width="16" height="16"><img class="dark-mode" data-icon-name="phone" src="/icons/phone-inverted.svg" loading="lazy" alt="phone" width="16" height="16"></span><a href="tel:${telephone}" title="Telephone Number">${telephone}</a></li>`}
        ${email && `<li><span class="icon icon-mail"><img class="light-mode" data-icon-name="mail" src="/icons/mail.svg" loading="lazy" alt="mail" width="16" height="16"><img class="dark-mode" data-icon-name="mail" src="/icons/mail-inverted.svg" loading="lazy" alt="mail" width="16" height="16"></span><a href="mailto:${email}" title="${email}">${email}</a></li>`}
        ${website && `<li><span class="icon icon-link"><img class="light-mode" data-icon-name="link" src="/icons/link.svg" loading="lazy" alt="link" width="16" height="16"><img class="dark-mode" data-icon-name="link" src="/icons/link-inverted.svg" loading="lazy" alt="link" width="16" height="16"></span><a href="${website}" title="${websiteTitle || ''}">${websiteTitle || website}</a></li>`}
      </ul>
    </div>
    ${hours && `<div class="hours-info">
      <strong class="font-display text-md details-group-title">Hours</strong>
      <ul class="icon-list">
      <li><span class="icon icon-clock"><img class="light-mode" data-icon-name="clock" src="/icons/clock.svg" loading="lazy" alt="clock" width="16" height="16"><img class="dark-mode" data-icon-name="clock" src="/icons/clock-inverted.svg" loading="lazy" alt="clock" width="16" height="16"></span>${hours.replaceAll('<br/>,', '<br/>')}</li>
      </ul>
    </div>`}
    ${onTap && `<div class="on-tap-info">
      <strong class="font-display text-sm details-group-title">${nextLinkText}</strong>
      <ul>${onTap.split(',').map((beer) => `<li>${beer}</li>`).join('')}</ul>
    </div>`}`;

    document.querySelector('.details-wrapper').appendChild(contact);
  }
}

async function decorateTemplateDetails() {
  const placeholders = await fetchPlaceholders();
  const detailsWrapper = document.createElement('div');
  detailsWrapper.classList.add('details-wrapper');
  document.querySelector('main .section').appendChild(detailsWrapper);
  decoratePreviousNext(placeholders);
  decorateDetails(placeholders);
}

// add more delayed functionality here
const templateConfig = {
  details: decorateTemplateDetails,
};

function decorateTemplate() {
  const template = document.querySelector('meta[name="template"]')?.getAttribute('content')?.split(' ');
  if (template) {
    template.forEach((t) => templateConfig[t] && templateConfig[t]());
  }
}

decorateTemplate();
