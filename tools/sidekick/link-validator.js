/* eslint-disable no-console */
export default async function linkValidator() {
  const appScriptUrl = 'https://script.google.com/macros/s/AKfycbwZJ2ODY5AGZAh8tuEowWVKmcAEPbUkN2M9tJjg1Nnd_OqTPAuWfk5ojyFHQ4vxw3U/exec';
  const urlParams = new URLSearchParams(window.location.search);
  // loop over urlParams and console log their key/value pairs
  urlParams.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  const fetchUrl = `${appScriptUrl}?id=${urlParams.get('referrer')}`;

  const response = await fetch(fetchUrl);
  if (response.ok) {
    const data = await response.json();
    console.log(data);
  }
}

linkValidator();

/* getting all urls in a google doc
// the documentId could be the referrer url passed to the iframe
const documentId = "###"; // Please set the Google Document ID.

const content = Docs.Documents.get(documentId).body.content;
const urls = [];
JSON.parse(JSON.stringify(content), (k, v) => {
  if (k == "url") urls.push(v);
});
console.log(urls);

test deploy id: AKfycbzjTrboeqn_3E-IKirlIs0_oEp_Og-iAxvPmJq1VL8

*/
