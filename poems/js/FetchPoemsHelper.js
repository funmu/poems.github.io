/*
  FetchPoemsHelper.js

  Helper module to get the poems sourced in for HTML page.
*/


(function() {

  'use strict';

  function fetchHelper( fetchFrom) {
    // console.log( "About to fetch from ", fetchFrom);
    return fetch( fetchFrom)
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
      });
  }

  class FetchPoemsHelper {

    constructor( prefixForPoems, poemsJsonUrl ) {
      this.prefixForPoems = prefixForPoems;
      this.poemsJsonUrl = poemsJsonUrl;

    }

    _getUrlForContent( item) {
      return this.prefixForPoems + item.url + ".txt";
    }

    _fetchContent( item, index)
    {
      const itemFrom = this._getUrlForContent( item);
      console.log( `Fetching content from ${itemFrom}`);
      return fetchHelper( itemFrom)
        .then( response => response.text())
        .catch( error => {
          console.log( `ERROR in fetching content from ${itemFrom}`);
          console.log( error);
        });
    }


    _genListItem( item, index) {
      const hrefIdForItem = 'poem_' + item.url;

      return '<li class="nav-item poem-item">'
              + '<a class="nav-link"'
              + '  role="toggle" data-toggle="tab"'
              + '    href="#' + hrefIdForItem + '">'
              + ' <div class="title">' + item.title
              + '  <br/> <span class="title-date">( ' + item.date + ')</span>'
              + ' </div>'
              + ' <img class="poem-item-img" src="images/' + item.image + '"'
              + '      width=160 height=160'
              + '   alt="' + item.title + '"/>'
              + '</a>'
              + '</li>'
            ;
    }

    _genContentItem( item, index) {
      const fullItemContent = "Coming Soon ...";
      const classForItem = 'tab-pane fade ' + ((index === 0) ? 'show active' : '');
      const hrefIdForItem = 'poem_' + item.url;
      const idForPreContent = 'pre_' + item.url;
      const itemShareUrl = 'javascript:useShareHelper( \''
        + item.title
        + '\', null, \'https://zanavu.com/poems#' + hrefIdForItem + '\')';

      // console.log( `Rendering Item.Title: ${item.title}`);
      // console.log( `Rendering itemShareUrl: ${itemShareUrl}`);

      let itemx =
        '<div id="' + hrefIdForItem + '" role="tabpanel" class="' + classForItem + '">'
        + '<h4>' + item.title + '</h4>'
        + '<div class="poem_text" id="' + idForPreContent + '">'
        + fullItemContent
        + '</div>'
        + '<a class="nav-link" share-button '
        + '    href="' + itemShareUrl + '">'
        + ' <i class="fas fa-share"></i>Share</a>'
        + '</div>'
        ;

      // queue up fetching the content item and adding to display node
      this._fetchContent( item, index)
        .then( content => {
          let nodeForContent = $('#' + idForPreContent);
          // console.log( `content for item at ${idForPreContent} is `, nodeForContent.text());
          // console.log( `new content is \n ${content}`);
          nodeForContent.text( content);
        });

      // console.log( itemx);
      return itemx;
    }

    _FetchSideBarItems() {
      // console.log( `Fetching sidebar items from ${this.poemsJsonUrl}`);
      return fetchHelper( this.poemsJsonUrl)
        .then( response => response.json())
        .catch( error => {
          console.log( `ERROR in fetching items from ${this.poemsJsonUrl}`);
          console.log( error);
        });
    }

    _AddDynamicContent( items, sideBarId, contentId) {
      let contentList = $(contentId);
      let sidebarList = $(sideBarId);
      // console.log( "About to add main items"); console.log( items);
      // console.log( rootListToAdd);

      // iterate and add items
      items.forEach( (item, index) => {
        // generate list item
        const contentItem = this._genContentItem( item, index);
        const sidebarItem = this._genListItem( item, index);

        // console.log(`Main Content Item [${index}] is: ${contentItem}`);
        // console.log(`Sidebar Item [${index}] is: ${sidebarItem}`);

        // add the list item
        contentList.append( contentItem);
        // add the list item
        sidebarList.append( sidebarItem);
      });
    }

    FetchAndAddPoems( sideBarId, contentId) {
      this._FetchSideBarItems()
        .then( items => this._AddDynamicContent( items, sideBarId, contentId))
        ;
    }
  }

  console.log( "Exporting FetchPoemsHelper .... ");

 	if ( (typeof module === 'undefined')) {
 		window.FetchPoemsHelper = FetchPoemsHelper;
 	}
})();
