const MIME_TYPES = {
  DOC: 'application/vnd.google-apps.document',
  SHEET: 'application/vnd.google-apps.spreadsheet',
  FOLDER: 'application/vnd.google-apps.folder',
};

function createDocumentLinksHtml(links) {
  return links.map((link) => `<li class="link">
    <div class="link-title-wrapper">
      <span class="links-toggle icon">
        <input type="checkbox" class="icon" />
        <span class="icon toggle">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 13L7 7L1 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </span>
      <strong class="link-title">${link.text}</strong>
      <span class="icon link-validity check">
        ${link.isValidUrl && !link.isEditorLink ? `
        <svg class="valid" width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2L7 13L2 8" stroke="#283618" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>` : `
        <svg class="invalid" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 1L1 13M1 1L13 13" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`}
      </span>
    </div>
    <div class="link-details">
      <table>
        <tbody>
          <tr>
            <td>Link URL</td>
            <td>${link.url}</td>
          </tr>
          <tr>
            <td>Link Text</td>
            <td>${link.text}</td>
          </tr>
          <tr>
            <td>Valid Site URL</td>
            <td>${link.isValidSiteUrl}</td>
          </tr>
          <tr>
            <td>External URL</td>
            <td>${link.isExternalLink}</td>
          </tr>
          <tr>
            <td>Editor URL</td>
            <td>${link.isEditorLink}</td>
          </tr>
          <tr>
            <td>Link Is Valid URL</td>
            <td>${link.isValidUrl}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </li>`).join('');
}

export function createPagesHtml(files) {
  return files.map((file) => `<li class="page">
    <div class="page-title-wrapper">
      <span class="links-toggle icon" data-has-links="${file.links?.length > 0}">
        <input type="checkbox" class="icon" />
        <span class="icon toggle">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 13L7 7L1 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </span>
      <strong class="page-title">${file.name}</strong>
      ${file.links?.length === 0 ? `
      <span class="icon no-links">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.93 3.93L18.07 18.07M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>` : `
      <span class="icon page-validity">
        <svg class="valid" width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2L7 13L2 8" stroke="#283618" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg class="invalid" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 1L1 13M1 1L13 13" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>`}
    </div>
    ${file.links && `<div class="page-links">
      <ul class="links-container">${createDocumentLinksHtml(file.links)}</ul>
    </div>`}
  </li>`).join('');
}

/* eslint-disable no-console */
export default async function linkValidator() {
  const urlParams = new URLSearchParams(window.location.search);
  const contentType = document.getElementById('content-type');

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
      const referrerUrl = new URL(referrer);

      const workerUrl = new URL('https://eds-link-validator-worker.jz-759.workers.dev/');
      workerUrl.searchParams.append('validate', true);
      workerUrl.searchParams.append('previewUrl', previewUrl);
      workerUrl.searchParams.append('publishUrl', publishUrl);

      if (referrerUrl.pathname.includes('folders')) {
        contentType.innerHTML = 'Folder';
        const folderId = referrerUrl.pathname.split('/folders/')[1]?.split('/')[0];
        workerUrl.searchParams.append('folderId', folderId);

        const response = await fetch(workerUrl.toString(), {
          redirect: 'follow',
          method: 'GET',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const titleEl = document.querySelector('#title');
          titleEl.innerHTML = 'Link Validator for current folder';
          const appContainer = document.querySelector('#app');
          const documents = data.filter((file) => file.mimeType === MIME_TYPES.DOC);
          appContainer.innerHTML = `<ul class="links-container">${createPagesHtml(documents)}</ul>`;
          document.body.classList.add('loaded');
        } else {
          console.error('response not ok', response);
        }
      } else {
        contentType.innerHTML = 'Document';
        const documentId = referrerUrl.pathname.split('/document/d/')[1]?.split('/')[0];
        workerUrl.searchParams.append('documentId', documentId);

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
}

linkValidator();
