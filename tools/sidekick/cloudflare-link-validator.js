function createDocumentLinksHtml(links) {
  return links.map((link) => {
    let linkType = 'Valid Site Link';
    if (link.isEditorLink) linkType = 'Editor Link';
    if (link.isExternalLink) linkType = 'External Link';
    if (!link.isValidSiteUrl && !link.isEditorLink && !link.isExternalLink) linkType = 'Invalid Link';

    return `<li class="link">
      <div class="link-title-wrapper">
        <span class="icon icon-toggle"></span>
        <strong class="link-title">${link.text}</strong>
        <span class="icon link-validity check">
          <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2L7 13L2 8" stroke="#283618" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
      <div class="link-details">
        <table>
          <tr>
            <td>Start Offset</td>
            <td>${link.startOffset}</td>
          </tr>
          <tr>
            <td>End Offset</td>
            <td>${link.endOffsetInclusive}</td>
          </tr>
          <tr>
            <td>Link Type</td>
            <td>${linkType}</td>
          </tr>
          <tr>
            <td>Link URL</td>
            <td>${link.url}</td>
          </tr>
          <tr>
            <td>Link Text</td>
            <td>${link.text}</td>
          </tr>
          <tr>
            <td>Link Is Valid Site URL</td>
            <td>${link.isValidSiteUrl}</td>
          </tr>
          <tr>
            <td>Link Is Valid URL</td>
            <td>${link.isValidUrl}</td>
          </tr>
          <tr>
            <td>Link Is External URL</td>
            <td>${link.isExternalLink}</td>
          </tr>
          <tr>
            <td>Link Is Editor URL</td>
            <td>${link.isEditorLink}</td>
          </tr>
        </table>
      </div>
    </li>`;
  }).join('');
}

/* eslint-disable no-console */
export default async function linkValidator() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  if (urlParams.size === 0 || !urlParams.has('referrer')) {
    console.error('URL incorrectly configured');
  } else {
    /* eslint-disable prefer-destructuring */
    const ref = urlParams.get('ref');
    const repo = urlParams.get('repo');
    const owner = urlParams.get('owner');
    const referrer = urlParams.get('referrer');

    if (ref && repo && owner && referrer) {
      const previewUrl = `https://${ref}--${repo}--${owner}.hlx.page`;
      const publishUrl = `https://${ref}--${repo}--${owner}.hlx.live`;
      const documentId = referrer.split('https://docs.google.com/document/d/')[1]?.split('/')[0];

      const workerUrl = new URL('https://eds-link-validator-worker.jz-759.workers.dev/');
      workerUrl.searchParams.append('documentId', documentId);
      workerUrl.searchParams.append('validate', true);
      workerUrl.searchParams.append('previewUrl', previewUrl);
      workerUrl.searchParams.append('publishUrl', publishUrl);

      const response = await fetch(workerUrl.toString(), {
        redirect: 'follow',
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      });

      if (response.ok) {
        const { title, links } = await response.json();
        const titleEl = document.querySelector('#title');
        titleEl.innerHTML = `Link Validator for ${title}`;
        const appContainer = document.querySelector('#app');
        appContainer.innerHTML = `<ul class="links-container">${createDocumentLinksHtml(links)}</ul>`;
        document.body.classList.add('loaded');
      }
    }
  }
}

linkValidator();
