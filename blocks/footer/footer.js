import {
  getMetadata,
  decorateBlock,
  decorateIcons,
  loadBlocks,
} from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  decorateIcons(block);
  if (block.querySelector('.form')) {
    decorateBlock(block.querySelector('.form'));
    loadBlocks(document.querySelector('footer'));
  }

  block.append(footer);
  const logo = block.querySelector('.icon-logo-desktop');
  logo?.parentNode.classList.remove('button');
  logo?.parentNode.parentNode.classList.remove('button-container');
  logo?.parentNode.setAttribute('aria-label', 'Home');
}
