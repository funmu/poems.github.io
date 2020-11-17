/*
  ShareHelper.js

  credits: https://w3c.github.io/web-share/demos/share-files.html
*/


(function() {

  'use strict';

  class ShareHelper {

    constructor( outputId ) {
      this.outputId = outputId;
    }

    static canShare() { return (navigator.share !== undefined); }

    logText(message, isError) {
      if (isError)
        console.error(message);
      else
        console.log(message);

      const p = document.createElement('p');
      if (isError)
        p.setAttribute('class', 'error');

      document.querySelector( this.outputId ).appendChild(p);
      p.appendChild(document.createTextNode(message));
    }

    logError(message) {
      this.logText(message, true);
    }


     sleep(delay) {
       return new Promise(resolve => {
         setTimeout(resolve, delay);
       });
     }


     async webShare( title, text, url) {
       if (navigator.share === undefined) {
         this.logError('Error: Unsupported feature: navigator.share()');
         return;
       }

       if (!navigator.canShare) {
         this.logError('Error: Unsupported feature: navigator.canShare()');
         return;
       }

       try {
         await navigator.share({title, text, url});
         this.logText('Successfully sent share');
       } catch (error) {
         this.logError('Error sharing: ' + error);
       }
     }

     async webShareDelay() {
       await this.sleep(6000);
       this.webShare();
     }
  }

  console.log( "Exporting ShareHelper .... ");

 	if ( (typeof module === 'undefined')) {
 		window.ShareHelper = ShareHelper;
 	}
})();
