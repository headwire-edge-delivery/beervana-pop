import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
const LIGHT_MODE_LABEL = 'Activate light mode';
const DARK_MODE_LABEL = 'Activate dark mode';

function toggleSearch(e) {
  e.preventDefault();
  if (e.target?.closest('.header-search-block') === null) {
    const searchWrapper = document.querySelector('.header-search-wrapper');
    searchWrapper.querySelector('input[type="text"]').toggleAttribute('disabled');
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
  searchInput.setAttribute('disabled', '');
  searchInput.addEventListener('keydown', (e) => {
    const searchWrapper = document.querySelector('.header-search-wrapper');
    if (e.key === 'Enter') {
      e.preventDefault();
      searchButton.click();
    } else if (e.key === 'Tab') {
      searchWrapper?.classList.remove('active');
      requestAnimationFrame(() => {
        searchInput?.toggleAttribute('disabled');
        const searchNav = document.querySelector('header [href="/search"]');
        searchNav?.focus();
      });
    } else if (e.key === 'Escape') {
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

function decorateHeaderSearch(block) {
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

function getColorScheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getModeLabel() {
  return getColorScheme() === 'light' ? DARK_MODE_LABEL : LIGHT_MODE_LABEL;
}

function toggleColorMode(e) {
  const button = e.target.closest('.color-mode-toggle');
  button.classList.add('transition-out');
  setTimeout(() => {
    button.classList.remove('transition-out');
    button.classList.add('transition-in');

    setTimeout(() => {
      button.classList.remove('transition-out');
      button.classList.remove('transition-in');
    }, 200);

    if (document.documentElement.classList.contains('dark-mode')) {
      window.localStorage.setItem('darkMode', false);
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
    } else {
      window.localStorage.setItem('darkMode', true);
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    }
  }, 400);
}

function decorateColorMode(block) {
  const currentModeLabel = getModeLabel();

  const colorButton = `<li><button aria-label='${currentModeLabel}' title='${currentModeLabel}' class='color-mode-toggle'>
    <svg width='18' height='18' viewBox='0 0 18 18' id='moon'>
      <mask id='moon-mask-main-nav'>
        <rect x='0' y='0' width='18' height='18' fill='#FFF'></rect>
        <circle cx='10' cy='2' r='8' fill='black'></circle>
      </mask>
      <circle cx='9' cy='9' fill='var(--color-text)' mask='url(#moon-mask-main-nav)' r='8'></circle>
      <g>
        <circle cx='17' cy='9' r='1.5' fill='var(--color-text)' style='transform-origin: center center; transform: scale(0);'></circle>
        <circle cx='13' cy='15.928203' r='1.5' fill='var(--color-text)' style='transform-origin: center center; transform: scale(0);'></circle>
        <circle cx='5' cy='15.928203' r='1.5' fill='var(--color-text)' style='transform-origin: center center; transform: scale(0);'></circle>
        <circle cx='1' cy='9' r='1.5' fill='var(--color-text)' style='transform-origin: center center; transform: scale(0);'></circle>
        <circle cx='5' cy='2.071797' r='1.5' fill='var(--color-text)' style='transform-origin: center center; transform: scale(0);'></circle>
        <circle cx='13' cy='2.071797' r='1.5' fill='var(--color-text)' style='transform-origin: center center; transform: scale(0);'></circle>
      </g>
    </svg>
    <svg width='18' height='18' viewBox='0 0 18 18' id='sun'>
      <mask id='moon-mask-main-nav-sun'>
        <rect x='0' y='0' width='18' height='18' fill='#FFF'></rect>
        <circle cx='25' cy='0' r='8' fill='black'></circle>
      </mask>
      <circle cx='9' cy='9' fill='var(--color-text)' mask='url(#moon-mask-main-nav-sun)' r='5'></circle>
      <g>
        <circle cx='17' cy='9' r='1.5' fill='var(--color-text)' style='transform-origin:center center;transform:scale(1)'></circle>
        <circle cx='13' cy='15.928203' r='1.5' fill='var(--color-text)' style='transform-origin:center center;transform:scale(1)'></circle>
        <circle cx='5' cy='15.928203' r='1.5' fill='var(--color-text)' style='transform-origin:center center;transform:scale(1)'></circle>
        <circle cx='1' cy='9' r='1.5' fill='var(--color-text)' style='transform-origin:center center;transform:scale(1)'></circle>
        <circle cx='5' cy='2.071797' r='1.5' fill='var(--color-text)' style='transform-origin:center center;transform:scale(1)'></circle>
        <circle cx='13' cy='2.071797' r='1.5' fill='var(--color-text)' style='transform-origin:center center;transform:scale(1)'></circle>
      </g>
    </svg>
  </button></li>`;
  const placeholder = block.querySelector('[href="#COLOR_MODE_TOGGLE"]');
  if (placeholder) {
    placeholder.parentNode.outerHTML = colorButton;
    const button = block.querySelector('button.color-mode-toggle');
    button.addEventListener('click', toggleColorMode);
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnClick(e) {
  const navSections = document.querySelector('.nav-sections');
  const hamburger = document.querySelector('.nav-hamburger');
  if (
    hamburger
    && navSections
    && !navSections.contains(e.target)
    && !hamburger.contains(e.target)
  ) {
    // eslint-disable-next-line no-use-before-define
    toggleMenu(document.getElementById('nav'), navSections);
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  if (!expanded) {
    document.body.classList.add('off-canvas');
  } else {
    document.body.classList.remove('off-canvas');
  }
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }

  if (!expanded && !isDesktop.matches) {
    window.addEventListener('click', closeOnClick);
  } else {
    window.removeEventListener('click', closeOnClick);
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
    brandLink.setAttribute('aria-label', 'Home');
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('a > .icon')) {
        const navTextWrapper = document.createElement('span');
        const text = navSection.textContent;
        const icon = navSection.querySelector('a > .icon');
        navSection.querySelector('a').textContent = '';
        navTextWrapper.className = 'nav-text-wrapper';
        navTextWrapper.innerText = text;
        navSection.querySelector('a').append(icon);
        navSection.querySelector('a').append(navTextWrapper);
      }
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
  decorateHeaderSearch(block);
  decorateColorMode(block);
}
