import { createOptimizedPicture, fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const {
    emptyLinkTitlePrefix,
    cardButtonText,
    searchNoResults,
    searchInputPlaceholder,
  } = placeholders;

  const searchParams = new URLSearchParams(window.location.search);
  block.innerHTML = '<ul class="search-results cards block"></ul>';

  const heroBlock = document.querySelector('.hero');
  if (heroBlock) {
    const queryPlaceholder = heroBlock.querySelector('h1');
    if (queryPlaceholder) {
      queryPlaceholder.innerText = queryPlaceholder.innerText.replace('%query%', searchParams.get('query') || '');
    }
    const formPlaceholder = heroBlock.querySelector('#search-form');
    if (formPlaceholder) {
      formPlaceholder.outerHTML = `
      <form id='search-form'>
        <div class='form-text-field-wrapper field-wrapper'>
          <label for='search' class='required'>Search</label>
          <input type='text-field' id='search' placeholder='${searchInputPlaceholder}' value='${searchParams.get('query') === null ? '' : searchParams.get('query')}' required='required'>
        </div>
        </div>
          <div class='form-submit-wrapper form-primary field-wrapper'>
          <button class='button primary search-button'>
            <img alt='' src='/icons/search.svg' width="16" height="16" />
            Search
          </button>
        </div>
      </form>`;
      const searchForm = document.querySelector('#search-form');
      const searchInput = searchForm.querySelector('input');
      const searchButton = searchForm.querySelector('button');

      searchButton.onclick = () => {
        const trimmedValue = searchInput.value.trim();
        if (trimmedValue) {
          window.location = `/search?query=${trimmedValue}`;
        } else {
          searchInput.focus();
        }
      };

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          window.location = `/search?query=${searchInput.value.trim()}`;
        }
      });

      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location = `/search?query=${searchInput.value.trim()}`;
      });
    }
  }

  // setup back button card
  let backUrl = '/';
  if (document.referrer !== '') {
    const { origin, pathname } = new URL(document.referrer);
    if (origin === window.location.origin) {
      backUrl = pathname;
    }
  }

  const noResultsHMTL = `
    <li>
      <div class='cards-card-body'>
        <h3>${searchNoResults}</h3>
      </div>
    </li>
    <li>
      <div class='cards-card-body'>
        <h3><strong><a href='${backUrl}' title='Go Back'>Go Back</a></strong></h3>
        <p>Sometimes to go forward, we've gotta go back<p>
        <p class='button-container'>
          <strong>
            <a href='${backUrl}' class='button primary'>Go Back</a>
          </strong>
        </p>
      </div>
    </li>
    <li>
      <div class='cards-card-body'>
        <h3><strong><a href='/' title='Go Home'>Go Home</a></strong></h3>
        <p>Home is where the beer is<p>
        <p class='button-container'>
          <strong>
            <a href='/' title='Beervana Home' class='button primary'>Go Home</a>
          </strong>
        </p>
      </div>
    </li>
  `;

  const resultsList = block.querySelector('.search-results');

  const updateResults = async (query) => {
    if (!query) {
      return;
    }
    document.title = `Search Results for "${query}"`;
    const breakpoints = [{ media: '(min-width: 600px)', width: '500' }, { width: '300' }];
    const response = await fetch(`https://beervana-pop-search.jz-759.workers.dev/?search=${query}`);
    const data = await response.json();

    const listItemsHtml = data.map((resultItem, index) => {
      let image;
      let resultImage = '';
      if (resultItem?.heroImage) {
        resultImage = resultItem.heroImage;
      }
      if (resultImage === '<picture></picture>') {
        resultImage = '';
      }

      const src = resultImage.match(/src="([^"]*)"/);
      if (src) {
        image = createOptimizedPicture(src[1], '', index > 3, breakpoints).outerHTML;
      }

      const snippet = resultItem.snippet === '<strong></strong>' ? '' : resultItem.snippet;

      return `
      <li>
        <div class='cards-card-image image-content'>
          <a href='${resultItem.url}' title='${emptyLinkTitlePrefix.replace('%title%', resultItem.title) || emptyLinkTitlePrefix}'>${image}</a>
        </div>
        <div class='cards-card-body'>
          <h3><strong><a href='${resultItem.url}' title='${resultItem.title}'>${resultItem.title}</a></strong></h3>
          <p>${snippet || resultItem.intro || resultItem.metaDescription}<p>
          <p class='button-container'>
            <strong>
              <a href='${resultItem.url}' title='${emptyLinkTitlePrefix.replace('%title%', resultItem.title) || emptyLinkTitlePrefix}' class='button primary'>${cardButtonText}</a>
            </strong>
          </p>
        </div>
      </li>
      `;
    }).join('');

    resultsList.innerHTML = listItemsHtml || noResultsHMTL;
    searchParams.set('query', query);
    window.history.replaceState(null, null, `?${searchParams.toString()}`);
  };

  // initialize fetch
  updateResults(searchParams.get('query'));
}
