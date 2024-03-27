import { loadBlock } from '../../scripts/aem.js';

/* eslint-disable no-plusplus, no-return-assign, no-console */
function setupHighlighter(itemElement) {
  itemElement.addEventListener('mousemove', ({ target, pageX, pageY }) => {
    const bentoItem = target?.closest('.bento-item');
    const x = pageX - bentoItem.offsetLeft;
    const y = pageY - bentoItem.offsetTop;
    bentoItem.style.setProperty('--left', `${x}px`);
    bentoItem.style.setProperty('--top', `${y}px`);
  });
}

function hasImage(element) {
  return element.querySelector('img');
}

function checkForImage(itemElement) {
  if (hasImage(itemElement)) {
    itemElement.classList.add('bento-item-image');
    if (itemElement.textContent.trim() === '') {
      itemElement.classList.add('bento-item-image-only');
    }
  }
}

function hasStory(itemElement) {
  return itemElement.querySelector('img') && itemElement.querySelector('hr');
}

function setupStories(itemElement) {
  itemElement.dataset.blockName = 'stories';
  loadBlock(itemElement);
}

function getBreakpointConfig(table) {
  const config = {};
  const tableMatrix = [];
  table.querySelectorAll('tr')?.forEach((_, rowIndex) => tableMatrix[rowIndex] = []);
  table.querySelectorAll('tr')?.forEach((row, rowIndex) => {
    row.querySelectorAll('td')?.forEach((cell, cellIndex) => {
      const key = cell.textContent.trim().toLowerCase();
      config[key] = {
        columnStart: 0,
        columnSpan: cell.colSpan || 1,
        rowStart: rowIndex + 1,
        rowSpan: cell.rowSpan || 1,
      };

      for (let i = rowIndex; i < rowIndex + config[key].rowSpan; i++) {
        for (let j = cellIndex; j < cellIndex + config[key].columnSpan; j++) {
          if (!tableMatrix[i][j]) {
            tableMatrix[i][j] = key;
            if (config[key].columnStart === 0) config[key].columnStart = j + 1;
          } else {
            if (config[key].columnStart === 0) config[key].columnStart = tableMatrix[i].length + 1;
            tableMatrix[i].push(key);
          }
        }
      }
    });
  });
  config.tableMatrix = tableMatrix;
  config.columns = tableMatrix[0].length;
  config.rows = tableMatrix.length;

  return config;
}

function getConfig(layoutConfig, config) {
  if (layoutConfig === null) return config;

  const configDOM = layoutConfig.querySelector('.bento-layout');
  configDOM.querySelectorAll(':scope > div')?.forEach((keyValueElement, index) => {
    let key = keyValueElement.children[0].textContent.trim().toLowerCase() || index + 1;
    const value = keyValueElement.children[1];
    if (key === 'mobile' || key === 'tablet' || key === 'desktop') {
      keyValueElement.querySelectorAll('table')?.forEach((table) => {
        let breakpoint = table.parentElement.querySelector('p')?.textContent.trim().toLowerCase() || 'desktop';
        breakpoint = breakpoint.indexOf(',') === -1 ? [breakpoint] : breakpoint.split(',');
        breakpoint.forEach((bp) => config[bp.trim()] = getBreakpointConfig(table));
      });
    } else {
      try {
        key = parseInt(key, 10);
      } catch (error) {
        console.error(`Error parsing key: ${key}\nError: ${error}`);
      }
      config[key] = {};
      const configText = value.textContent.trim().toLowerCase();

      if (configText) {
        config[key].classes = configText.split(' ');
      }

      if (hasImage(value)) {
        config[key].bgImage = value.querySelector('img')?.src;
      }
    }
  });

  return config;
}

function getLayout(block) {
  return Array.from(block.classList)?.filter((className) => className.startsWith('layout-'))[0] || 'default';
}

async function getLayoutConfigHTML(layout) {
  const layoutUrl = `/bento-layouts/${layout}.plain.html`;
  let returnValue = null;
  try {
    const response = await fetch(layoutUrl);
    if (response.ok) {
      returnValue = await response.text();
    }
  } catch (error) {
    console.error(`Error fetching layout config: \nLayout: ${layout}\nError: ${error}`);
  }
  return returnValue;
}

function decorateBentoBlocks(config, block) {
  block.querySelectorAll(':scope > div').forEach((element, index) => {
    const key = index + 1;
    element.dataset.index = key;
    element.classList.add('bento-item');
    Object.keys(config).forEach((bp) => {
      if (config[bp][key]) {
        element.style.setProperty(`--grid-column-start-${bp}`, config[bp][key].columnStart);
        element.style.setProperty(`--grid-column-end-${bp}`, config[bp][key].columnSpan);
        element.style.setProperty(`--grid-row-start-${bp}`, config[bp][key].rowStart);
        element.style.setProperty(`--grid-row-end-${bp}`, config[bp][key].rowSpan);
      }
    });
    try {
      if (config[key].bgImage) {
        element.style.setProperty('--bg-image', `url(${config[key].bgImage})`);
      }
      if (config[key].classes) {
        element.classList.add(...config[key].classes);
      }
    } catch (error) {
      console.error(`Error decorating bento item: ${element}\nError: ${error}`);
    }
    setupHighlighter(element);
    checkForImage(element);
    if (hasStory(element)) {
      setupStories(element);
    }
  });
}

function decorateBlock(block, config) {
  Object.keys(config).forEach((key) => {
    const { columns, rows } = config[key];
    block.style.setProperty(`--grid-columns-${key}`, columns || 1);
    block.style.setProperty(`--grid-rows-${key}`, rows || 1);
  });
}

export default async function decorate(block) {
  const layout = getLayout(block);
  let layoutConfig = null;
  if (layout !== 'default') {
    layoutConfig = await getLayoutConfigHTML(layout);
    layoutConfig = new DOMParser().parseFromString(layoutConfig, 'text/html');
  }
  const config = getConfig(layoutConfig, {});
  decorateBlock(block, config);
  decorateBentoBlocks(config, block);
}
