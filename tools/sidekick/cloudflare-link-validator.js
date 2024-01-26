function createDocumentLinksHtml(links) {
  return links.map((link) => `<li class="link">
    <div class="link-title-wrapper">
      <input type="checkbox" class="icon icon-toggle" />
      <strong class="link-title">${link.text}</strong>
      <span class="icon link-validity check" data-valid="${link.isValidUrl && !link.isEditorLink}">
        <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2L7 13L2 8" stroke="#283618" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    <div class="link-details">
      <table>
        <tbody>
          <tr>
            <td>Link Is Valid URL</td>
            <td>${link.isValidUrl}</td>
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
        </tbody>
      </table>
    </div>
  </li>`).join('');
}

/* files response example
{
    "mimeType": "application/vnd.google-apps.document",
    "id": "1O9ltaspMJ4GGu366yLfUeGLaaP4_m5OpjpS16js2coc",
    "name": "tour-rethink",
    "links": [
      {
        "text": "Portland",
        "url": "https://docs.google.com/document/d/1O9ltaspMJ4GGu366yLfUeGLaaP4_m5OpjpS16js2coc",
        "isEditorLink": true,
        "isValidSiteUrl": false,
        "isExternalLink": false,
        "isValidUrl": true
      },
      {
        "text": "Reserve Now",
        "url": "https://main--beervana--headwire-edge-delivery.hlx.live/contact",
        "isEditorLink": false,
        "isValidSiteUrl": false,
        "isExternalLink": true,
        "isValidUrl": true
      },
      {
        "text": "Beervana Brew Tour",
        "url": "#beervana-brew-tour",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": false
      },
      {
        "text": "Sip of Portland Tour",
        "url": "#sip-of-portland-brew-tour",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": false
      },
      {
        "text": "Build your Own Tour",
        "url": "#build-your-own-tour",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": false
      },
      {
        "text": "Find out More",
        "url": "https://main--beervana-pop--headwire-edge-delivery.hlx.page/tour/original-beervana-brew-tour",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": true
      },
      {
        "text": "Reserve Now",
        "url": "https://main--beervana-pop--headwire-edge-delivery.hlx.page/tour/original-beervana-brew-tour",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": true
      },
      {
        "text": "Reserve Now",
        "url": "https://main--beervana-pop--headwire-edge-delivery.hlx.live/contact",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": true
      },
      {
        "text": "Find out More",
        "url": "https://main--beervana-pop--headwire-edge-delivery.hlx.page/tour/sip-of-portland-brew-tour",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": true
      },
      {
        "text": "Reserve Now",
        "url": "https://main--beervana-pop--headwire-edge-delivery.hlx.page/tour/sip-of-portland-brew-tour",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": true
      },
      {
        "text": "Reserve Now",
        "url": "https://main--beervana-pop--headwire-edge-delivery.hlx.live/contact",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": true
      },
      {
        "text": "Find out More",
        "url": "https://main--beervana-pop--headwire-edge-delivery.hlx.live/tour/make-your-own-tour",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": true
      },
      {
        "text": "Reserve Now",
        "url": "https://main--beervana-pop--headwire-edge-delivery.hlx.live/contact",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": true
      },
      {
        "text": "Reserve Now",
        "url": "https://main--beervana-pop--headwire-edge-delivery.hlx.live/contact",
        "isEditorLink": false,
        "isValidSiteUrl": true,
        "isExternalLink": false,
        "isValidUrl": true
      }
    ]
  },
  */

// use the files response example to create a list of pages in a list
// each  page should have the title, checkbox and validity icon and
// then a list of links similar to the above
/*
const titleEl = document.querySelector('#title');
titleEl.innerHTML = `Link Validator for ${title}`;
const appContainer = document.querySelector('#app');
appContainer.innerHTML = `<ul class="links-container">${createDocumentLinksHtml(links)}</ul>`;
*/
export function createPagesHtml(files) {
  return files.map((file) => `<li class="page">
    <div class="page-title-wrapper">
      <input type="checkbox" class="icon icon-toggle" />
      <strong class="page-title">${file.name}</strong>
      <span class="icon page-validity check" data-valid="true">
        <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2L7 13L2 8" stroke="#283618" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    <div class="page-links">
      <ul class="links-container">${createDocumentLinksHtml(file.links)}</ul>
    </div>
  </li>`).join('');
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
      const referrerUrl = new URL(referrer);

      const workerUrl = new URL('https://eds-link-validator-worker.jz-759.workers.dev/');
      workerUrl.searchParams.append('validate', true);
      workerUrl.searchParams.append('previewUrl', previewUrl);
      workerUrl.searchParams.append('publishUrl', publishUrl);

      if (referrerUrl.pathname.includes('folders')) {
        console.log('folder detected');
        const folderId = referrerUrl.pathname.split('/folders/')[1]?.split('/')[0];
        console.log('folderId', folderId);
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
          console.log('data', data);
          document.body.classList.add('loaded');
        } else {
          console.error('response not ok', response);
        }
      } else {
        const documentId = referrerUrl.pathname.split('https://docs.google.com/document/d/')[1]?.split('/')[0];
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
