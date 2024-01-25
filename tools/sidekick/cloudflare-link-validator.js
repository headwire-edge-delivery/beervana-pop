/* eslint-disable no-console */
export default async function linkValidator() {
  console.log('linkValidator()');
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
        const data = await response.json();
        console.log('data', data);
      }
    }
  }
}

linkValidator();
