import { fetchPlaceholders } from '../../scripts/aem.js';
import { getOrigin } from '../../scripts/scripts.js';
import { templateCards } from '../../scripts/templates.js';

const DEFAULT_SOURCE = '/query-index.json';

function getConfig(block) {
  const config = {};
  Array.from(block.children).forEach((child) => {
    const key = child.children[0].innerText.trim().toLowerCase().replace(' ', '_');
    const value = child.children[1].innerText.trim().toLowerCase();
    config[key] = value;
  });
  return config;
}

function buildQueryURL(config) {
  const origin = getOrigin();
  const url = new URL(origin);
  url.pathname = config.source || DEFAULT_SOURCE;

  Object.keys(config).forEach((key) => {
    switch (key) {
      case 'template':
        break;
      case 'source':
        url.pathname = config[key];
        break;
      default:
        url.searchParams.append(key, config[key]);
        break;
    }
  });

  return url;
}

async function getDynamicContent(queryURL) {
  let data = null;
  try {
    const response = await fetch(queryURL);
    if (response.ok) {
      data = await response.json();
    }
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Error:', error);
  }
  return data;
}

const templateConfig = {
  cards: templateCards,
};

export default async function decorate(block) {
  const config = getConfig(block);
  const queryURL = buildQueryURL(config);
  const placeholders = await fetchPlaceholders();
  const { data } = await getDynamicContent(queryURL);
  if (data.length > 0 && templateConfig[config.template]) {
    block.innerHTML = templateConfig[config.template]({ data, config, placeholders });
  }
}
