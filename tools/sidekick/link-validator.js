/* eslint-disable no-console */
export default async function linkValidator() {
  const appContainer = document.getElementById('app');
  const appScriptUrl = 'https://script.google.com/macros/s/AKfycbwZJ2ODY5AGZAh8tuEowWVKmcAEPbUkN2M9tJjg1Nnd_OqTPAuWfk5ojyFHQ4vxw3U/exec';
  const urlParams = new URLSearchParams(window.location.search);
  // loop over urlParams and console log their key/value pairs
  urlParams.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  /* eslint-disable prefer-destructuring */
  let documentId = urlParams.get('referrer');
  documentId = documentId.split('https://docs.google.com/document/d/')[1];
  documentId = documentId.split('/')[0];
  const fetchUrl = `${appScriptUrl}?id=${documentId}`;

  const response = await fetch(fetchUrl);
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    if (data) {
      const list = document.createElement('ul');
      appContainer.appendChild(list);
      const filteredData = data.filter(({ url }) => url.startsWith('https://docs.google.com/document'));
      console.log(filteredData);
      filteredData.forEach(({ url }) => {
        const listItem = document.createElement('li');
        const listItemText = document.createTextNode(url);
        listItem.appendChild(listItemText);
      });
    }
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
