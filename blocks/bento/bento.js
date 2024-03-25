import { loadBlock } from '../../scripts/aem.js';

/* eslint-disable no-return-assign */
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

      /* eslint-disable no-plusplus */
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

function getConfig(block, config) {
  block.querySelectorAll('table')?.forEach((table) => {
    let breakpoint = table.parentElement.querySelector('p')?.textContent.trim().toLowerCase() || 'desktop';
    breakpoint = breakpoint.indexOf(',') === -1 ? [breakpoint] : breakpoint.split(',');
    breakpoint.forEach((bp) => config[bp.trim()] = getBreakpointConfig(table));
    table?.parentElement?.parentElement?.remove();
  });

  return config;
}

function checkForImage(itemElement) {
  if (itemElement.querySelector('img')) {
    itemElement.classList.add('bento-item-image');
    if (itemElement.textContent.trim() === '') {
      itemElement.classList.add('bento-item-image-only');
    }
  }
}

function setupHighlighter(itemElement) {
  itemElement.addEventListener('mousemove', ({ target, pageX, pageY }) => {
    const bentoItem = target?.closest('.bento-item');
    const x = pageX - bentoItem.offsetLeft;
    const y = pageY - bentoItem.offsetTop;
    bentoItem.style.setProperty('--left', `${x}px`);
    bentoItem.style.setProperty('--top', `${y}px`);
  });
}

function hasStory(itemElement) {
  return itemElement.querySelector('img') && itemElement.querySelector('hr');
}

function setupStories(itemElement) {
  itemElement.dataset.blockName = 'stories';
  loadBlock(itemElement);
}

function configBlock(block, config) {
  block.classList.add('bento');
  Object.keys(config).forEach((key) => {
    const { columns, rows } = config[key];
    block.style.setProperty(`--grid-columns-${key}`, columns);
    block.style.setProperty(`--grid-rows-${key}`, rows);
  });
}

function configItems(block, config) {
  block.querySelectorAll(':scope > div').forEach((element) => {
    element.classList.add('bento-item');
    const key = element.children[0]?.textContent.trim().toLowerCase();
    Object.keys(config).forEach((bp) => {
      if (config[bp][key]) {
        element.style.setProperty(`--grid-column-start-${bp}`, config[bp][key].columnStart);
        element.style.setProperty(`--grid-column-end-${bp}`, config[bp][key].columnSpan);
        element.style.setProperty(`--grid-row-start-${bp}`, config[bp][key].rowStart);
        element.style.setProperty(`--grid-row-end-${bp}`, config[bp][key].rowSpan);
      }
    });
    element.children[0].remove();
    setupHighlighter(element);
    checkForImage(element);
    if (hasStory(element)) {
      setupStories(element);
    }
  });
}

export default async function decorate(block) {
  const config = getConfig(block, {});
  configBlock(block, config);
  configItems(block, config);
}
