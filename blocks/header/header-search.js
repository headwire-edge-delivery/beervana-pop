function toggleSearch(e) {
  e.preventDefault();
  if (e.target?.closest('.header-search-block') === null) {
    const searchWrapper = document.querySelector('.header-search-wrapper');
    searchWrapper?.classList.toggle('active');
    if (searchWrapper.classList.contains('active')) {
      searchWrapper.querySelector('input[type="text"]').focus();
    }
  }
}

function searchButtonClickHandler(e) {
  const searchWrapper = e.target?.closest('.header-search-wrapper');
  const searchInput = searchWrapper?.querySelector('.search-input');
  const searchValue = searchInput?.value.trim();
  if (searchValue !== '') {
    window.location.href = `/search?query=${searchValue}`;
  }
}

function setupSearchInput(searchButton) {
  const searchInput = document.createElement('input');
  searchInput.classList.add('search-input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('placeholder', 'Search');
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchButton.click();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      toggleSearch(e);
      document.querySelector(e.shiftKey ? '.header-tools .color-mode-toggle' : '.header-tools .button-container a')?.focus();
    } else if (e.key === 'Escape') {
      const searchWrapper = document.querySelector('.header-search-wrapper');
      searchWrapper?.classList.toggle('active');
    }
  });
  searchInput.addEventListener('blur', (e) => {
    if (e.relatedTarget === null) {
      toggleSearch(e);
    }
  });
  return searchInput;
}

export default function decorateHeaderSearch(block) {
  const searchLink = block.querySelector('a:has(.icon-search)');
  searchLink.addEventListener('click', toggleSearch);

  const searchButton = document.createElement('button');
  searchButton.innerText = 'Search';
  searchButton.classList.add('button', 'primary', 'search-button');
  searchButton.addEventListener('click', searchButtonClickHandler);

  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('header-search-wrapper');

  const searchBlock = document.createElement('form');
  searchBlock.classList.add('header-search-block');
  searchBlock.setAttribute('action', '/search?query=');
  searchBlock.append(setupSearchInput(searchButton));
  searchBlock.append(searchButton);

  searchWrapper.append(searchBlock);
  document.querySelector('body').appendChild(searchWrapper);
  searchWrapper.addEventListener('click', toggleSearch);
}
