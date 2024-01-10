import { createOptimizedPicture, decorateIcons, fetchPlaceholders } from '../../scripts/aem.js';

const LIMIT = 3;
const breakpoints = [{ media: '(min-width: 600px)', width: '500' }, { width: '300' }];
let blogCardButtonText = 'Read more';
let totalPages = 1;

function setupMarkup(block, placeholders) {
  const { previousLinkText, nextLinkText } = placeholders;
  block.innerHTML = `<div id="blog-container" class="cards"></div>
  <div id="pagination-controls">
    <button id="prev-page" class="button subtle">
      <span class="icon icon-arrow-left"></span>
      <span>${previousLinkText}</span>
    </button>
    <span id="current-page">1</span>
    <button id="next-page" class="button subtle">
      <span>${nextLinkText}</span>
      <span class="icon icon-arrow-right"></span>
    </button>
  </div>`;
}

function updatePaginationButtons(currentPage) {
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

function displayBlogEntries(data) {
  const blogContainer = document.getElementById('blog-container');
  blogContainer.innerHTML = '';

  data.forEach((entry) => {
    const {
      path,
      title,
      description,
      image,
    } = entry;
    const entryElement = document.createElement('div');
    entryElement.classList.add('blog-entry', 'card');
    entryElement.innerHTML = `<div class="cards-card-image image-content">
      <a href="${path}">${createOptimizedPicture(image, '', false, breakpoints).outerHTML}</a>
    </div>
    <div class="cards-card-body">
      <h3>
        <a href="${path}" title="${title}">${title}</a>
      </h3>
      <p>${description}</p>
      <p class="button-container">
        <a href="${path}" class="button primary">${blogCardButtonText}</a>
      </p>
    </div>`;
    blogContainer.appendChild(entryElement);
  });
}

async function fetchTotalPages() {
  const url = 'query-index.json?sheet=blog';

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  } else {
    const { total } = await response.json();
    totalPages = Math.ceil(total / LIMIT);
  }
}

async function fetchBlogData(offset) {
  const url = `query-index.json?sheet=blog&limit=${LIMIT}&offset=${offset}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  } else {
    const { data } = await response.json();
    displayBlogEntries(data);
  }
}

function updatePage(newPage) {
  const offset = (newPage - 1) * LIMIT;
  window.history.pushState({}, '', `?limit=${LIMIT}&offset=${offset}`);
  fetchBlogData(offset);
  updatePaginationButtons(newPage);
}

function setupPagination() {
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');
  const currentPageElement = document.getElementById('current-page');

  let currentPage = parseInt(new URLSearchParams(window.location.search).get('offset') / LIMIT, 10) + 1 || 1;

  currentPageElement.innerText = currentPage;
  updatePaginationButtons(currentPage);

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      updatePage(currentPage);
      currentPageElement.innerText = currentPage;
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      updatePage(currentPage);
      currentPageElement.innerText = currentPage;
    }
  });
}

export default async function decorate(block) {
  await fetchTotalPages();
  const placeholders = await fetchPlaceholders();
  blogCardButtonText = placeholders.blogCardButtonText;
  setupMarkup(block, placeholders);
  decorateIcons(block);
  setupPagination(totalPages);
  const urlParams = new URLSearchParams(window.location.search);
  const limit = urlParams.get('limit') || LIMIT;
  const offset = urlParams.get('offset') || 0;
  fetchBlogData(limit, offset);
}
