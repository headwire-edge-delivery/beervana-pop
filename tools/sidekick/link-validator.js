/* eslint-disable no-console */
export default async function linkValidator() {
  const appContainer = document.getElementById('app');
  const list = document.createElement('ul');
  appContainer.appendChild(list);

  const appScriptUrl = 'https://script.google.com/macros/s/AKfycbyf1E7HYTBa1fDn7SXIZPbJJlMxU4VxPqo4nTtkVEnllK7Fp0yrB_2RJYPIhWEvjZYK/exec';
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.size === 0 || !urlParams.has('referrer')) {
    const listItem = document.createElement('li');
    const listItemText = document.createTextNode('URL incorrectly configured');
    listItem.appendChild(listItemText);
    list.appendChild(listItem);
  } else {
    /* eslint-disable prefer-destructuring */
    let documentId = urlParams.get('referrer');
    documentId = documentId.split('https://docs.google.com/document/d/')[1];
    documentId = documentId.split('/')[0];
    const fetchUrl = `${appScriptUrl}?id=${documentId}`;

    const response = await fetch(fetchUrl);
    if (response.ok) {
      const data = await response.json();
      if (data) {
        if (data.length === 0) {
          const listItem = document.createElement('li');
          const listItemText = document.createTextNode('No links found');
          listItem.appendChild(listItemText);
          list.appendChild(listItem);
        } else {
          const filteredData = data.filter(({ url }) => url.startsWith('https://docs.google.com/document'));
          if (filteredData.length === 0) {
            const listItem = document.createElement('li');
            const listItemText = document.createTextNode('No invalid links found');
            listItem.appendChild(listItemText);
            list.appendChild(listItem);
          } else {
            filteredData.forEach(({ url }) => {
              const listItem = document.createElement('li');
              const listItemText = document.createTextNode(url);
              listItem.appendChild(listItemText);
              list.appendChild(listItem);
            });
          }
        }
      }
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
