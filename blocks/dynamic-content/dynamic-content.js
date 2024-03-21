import { getOrigin } from '../../scripts/scripts.js';

const DEFAULT_PATHNAME = '/query-index.json';

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
  url.pathname = config.source || DEFAULT_PATHNAME;

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

export default async function decorate(block) {
  // console.group('Dynamic Content');
  const config = getConfig(block);
  const queryURL = buildQueryURL(config);
  // const template = config?.template || '';
  // console.log('Config:', config);
  // console.log('QueryURL:', queryURL);
  // console.log('Template:', template);
  const { data } = await getDynamicContent(queryURL);
  if (data) {
    // console.log('Data:', data);
  }
  // console.groupEnd();
}
