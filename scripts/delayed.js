// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
// eslint-disable-next-line import/no-cycle
import { getOrigin, getHref } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

function handleExternalLinks() {
  document.querySelectorAll('a:not(.interstitial a.button)').forEach((link) => {
    if (link.host !== window.location.host && link.href !== '#back' && link.href !== '#redirect' && !link.href.includes('mailto') && !link.href.includes('tel')) {
      link.href = `${getOrigin()}/external-link-interstitial?redirect=${link.href}&back=${getHref()}`;
    }
  });
}

handleExternalLinks();
