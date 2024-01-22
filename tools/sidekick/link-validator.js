/* eslint-disable no-console */
export default function linkValidator() {
  const urlParams = new URLSearchParams(window.location.search);
  // loop over urlParams and console log their key/value pairs
  urlParams.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
}

linkValidator();
