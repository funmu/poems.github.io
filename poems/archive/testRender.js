const fetch = require('node-fetch');

const ITEMS = require('../content/_items.json');
console.log( ITEMS);

function renderFullItem( item, index) {

  const fullItemContent = 'Coming Sooon';
  const classForItem = 'tab-pane fade ' + ((index === 0) ? 'show active' : '');
  const hrefIdForItem = 'poem_' + item.url;
  const itemShareUrl = 'javascript:useShareHelper( \''
    + item.title
    + '\', null, \'https://zanavu.com/poems#' + hrefIdForItem + '\')';

  console.log( `Title: ${item.title}`);
  console.log( `itemShareUrl: ${itemShareUrl}`);

  return '<hr>'
    + '<div id="' + hrefIdForItem + '" role="tabpanel" class="' + classForItem + '">'
    + '<pre>'
    + fullItemContent
    + '</pre>'
    + '<a class="nav-link" share-button '
    + '    href="' + itemShareUrl + '">'
    + ' <i class="fas fa-share"></i>Share</a>'
    + '</div>'
    ;
}

function fetchItem( item, index)
{
  const itemFrom = "http://localhost:3000/poems" + "/content/" + item.url + ".txt";
  console.log( `Fetching content from ${itemFrom}`);

  return fetch( itemFrom)
    .then( response => {
      if (response.ok) {
        return response;
      } else {
        let error = new Error( "Error in fetching Items. Status: "
          + response.status + "; status text: " + response.statustext);
        error.response = response;
        throw error;
      }
    },
    error => {
        let errmess = new Error( error.message);
        throw errmess;
    })
    .then( response => response.text())
    .catch( error => {
      console.log( "ERROR in fetching items");
      console.log( error);
    });
}

// let a = renderFullItem( ITEMS[0], 0);
fetchItem( ITEMS[0], 0)
  .then( content => {
    console.log("Successfully got content ....");
    console.log(content);
  });
