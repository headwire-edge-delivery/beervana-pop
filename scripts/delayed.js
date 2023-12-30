// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import decorateTemplateDetails from './template-details.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

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
