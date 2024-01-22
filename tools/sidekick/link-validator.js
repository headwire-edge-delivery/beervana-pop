/* eslint-disable no-console */
export default function linkValidator() {
  const urlParams = new URLSearchParams(window.location.search);
  console.log('urlParams', urlParams);
}

linkValidator();
