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
    // let documentId = urlParams.get('referrer');
    // documentId = documentId.split('https://docs.google.com/document/d/')[1];
    // documentId = documentId.split('/')[0];
  }
}

linkValidator();
