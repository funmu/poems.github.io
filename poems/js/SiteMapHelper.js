/*
  SiteMapHelper.js

*/


(function() {

  'use strict';

  class GridCalculator {

    constructor( gridMapConfig ) {
      this.gridMapConfig = gridMapConfig;
    }

    // Find the xvalue when the index and count are given
    xval( index, count) {
      let x = this.gridMapConfig.width/2 + this.gridMapConfig.x_offset
        + ( index - count/2) * this.gridMapConfig.node_width
        + ( index + 1/2 - count/2) * this.gridMapConfig.gap_width;
      // console.log( ` xval( ${index}, ${count}) = ${x}`);
      return x;
    }

    yval( level) {
      let y = this.gridMapConfig.y_offset
        + level * (this.gridMapConfig.node_height + this.gridMapConfig.gap_height);
      // console.log( ` yval( ${level}) = ${y}`);
      return y;
    }
  }

  class SiteMap {

    constructor( siteMapList ) {
      this.siteMapList = siteMapList;
      this.symbols = null;
    }

    buildSymbols() {
      let symbolList = {};
      this.siteMapList.forEach( (page, i) => {
        let currentItem = symbolList[page.key];
        // console.log( `Lookup( ${page.key}) => ${currentItem}`);
        if ( !currentItem) {
          // first time we are seeing it; add it to the symbols
          symbolList[page.key] = currentItem = { parentItem: null, ...page}
          // console.log( `Create first time item ( ${page.key}) => ${symbolList[page.key]}`);
        } else if ( !currentItem.key ) {
          // first time the src is found. add it
          currentItem = {...page};
        }

        // console.log( `Src is now found ( ${page.key}) => ${JSON.stringify(symbolList[page.key])}`);
        if ( page.parent) {
          let parentItem = symbolList[page.parent];
          // console.log( `Parent Lookup( ${page.parent}) => ${JSON.stringify(parentItem)}`);
          if (!parentItem) {
            parentItem = { }; // create new parent node for filling in later
            symbolList[page.parent] = parentItem;
          } else {
            // save the parent Item linkage here
            // console.log( `Set Parent(for ${page.key}) as ${page.parent}) => ${JSON.stringify(parentItem)}`);
            currentItem.parentItem = parentItem;
          }
        }
      });

      this.symbols = symbolList;
    }

    getLevel( siteSymbol) {

      let level = siteSymbol.level;

      if ( !level || level < 0) {
        if ( !siteSymbol.parentItem ) { return 0; } // root node
        else {
          level = siteSymbol.parentItem.level;
          if ( !level || level < 0) {
            level = siteSymbol.parentItem.level = this.getLevel( siteSymbol.parentItem);
          }
          level = level + 1; // bump for the current node
        }
      }
      return level;
    }

    buildLevelMap() {

      this.siteMapList.forEach( (site, i) => {
        // calculate the level and store it
        this.symbols[site.key].level = this.getLevel( this.symbols[site.key]);
      });

      // count the number of instances per level and remember count per level
      let nodesPerLevel = {};
      Reflect.ownKeys( this.symbols).forEach( (symKey, i) => {
        const sym = this.symbols[symKey];
        if ( sym.level in nodesPerLevel) { nodesPerLevel[sym.level] += 1; }
        else { nodesPerLevel[sym.level] = 1; }
      });
      console.log( nodesPerLevel);
      let indexCounts = new Array( Reflect.ownKeys( nodesPerLevel).length + 1).fill(0);
      console.log( indexCounts);
      Reflect.ownKeys( this.symbols).forEach( (symKey, i) => {
        const sym = this.symbols[symKey];
        sym.index = indexCounts[ sym.level];
        sym.count = nodesPerLevel[sym.level];
        indexCounts[ sym.level] += 1;
      });
    }

    formNodeList( siteMapConfig) {

      var gm = new GridCalculator( siteMapConfig);

      let nodeList = this.siteMapList.map( ( siteNode, i) => {
        let node = this.symbols[siteNode.key];
        node.visual = {
          fillColor: siteMapConfig.default_fillColor,
          x: gm.xval( node.index, node.count),
          y: gm.yval( node.level),
          w: g_siteMapConfig.node_width,
          h: g_siteMapConfig.node_height
        };

        return node;
      });

      return nodeList;
    }

    formConnectors( siteMapConfig, nodesList) {

      // connect child's top to parent's bottom

      let connectors = [];
      nodesList.forEach( ( node, i) => {
        console.log( node);
        let parent = node.parentItem;
        if ( parent  ) {
          // there is a parent ... so form a connector
          let n1 = { x: node.visual.x + node.visual.w/2, y: node.visual.y };
          let n2 = { x: parent.visual.x + parent.visual.w/2, y: parent.visual.y + parent.visual.h};

          connectors.push( { type: "move", x: n1.x, y: n1.y});
          if ( n1.y === n2.y ) {
            // form direct connections
            connectors.push( { type: "line", x: n2.x, y: n2.y});
          } else {
            // form the straightline connectors
            connectors.push( { type: "line", x: n1.x, y: (n1.y + n2.y)/2});
            connectors.push( { type: "line", x: n2.x, y: (n1.y + n2.y)/2});
            connectors.push( { type: "line", x: n2.x, y: n2.y});
          }
        }
      });
      console.log( connectors);
      return connectors;
    }

    // siteMapList => symbolsForSite => leveledMapList => nodeList, connectorList
    process( siteMapList) {
      this.buildSymbols();
      this.print();
      console.log( "Let us build the symbols ...");
      this.buildLevelMap();
      this.print();
    }

    print() {
      console.log( "------------------- SITE MAP ------------------- ");
      console.log( this.siteMapList);

      console.log( "------------------- SYMBOLS ------------------- ");
      console.log( this.symbols);
    }
  }


 	if ( (typeof module === 'undefined')) {
 		window.SiteMapHelper = { SiteMap : SiteMap };
 	}
})();
