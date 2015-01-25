/**
 *  Basic Extension for ktMarkDown.js
 *    by Kengo Tsuruzono ( crane@sitearo.com )
 */

	'use strict';



	function slide() {
		this.curSlide = 0;	// Displayed Slide No
		this.curBuildSlide = 0;

		var dirPath = ktmd.extensionsFolderPath() + 'slide/';
		var cssPath = ktmd.extensionsFolderPath() + 'slide/slide.css';

		var elm = document.createElement( 'link' );
		elm.rel  = 'stylesheet';
		elm.href = cssPath;
		elm.type = 'text/css';
		document.head.appendChild( elm );

	}



//-----------------------------------------------------------------------------
//  LINE
//-----------------------------------------------------------------------------



	///// OVAL BOX /////
	slide.prototype._line_Slide = function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, id, matches;

		if ( matches = text.match( /^\[\[\[slide(.*)$/ ) ) { ///// Open Slide /////

			sTag = 'div';
			clas = 'ktmd_slide';
			styl = ( 0 < this.curBuildSlide ) ? 'visibility:hidden; display:none;' : undefined;
			text = matches[ 1 ];
			id   = this.curBuildSlide;

			return( {
				startTag: sTag,
				cssClass: clas,
				cssStyle: styl,
				text    : text,
				endTag  : eTag,
				id      : id
			} );

		}

		if ( matches = text.match( /^\]\]\]slide$/ ) ) { ///// Close Slide /////
			text = matches[ 1 ];
			eTag = 'div';
			this.curBuildSlide++;
			return( {
				startTag: sTag,
				cssClass: clas,
				cssStyle: styl,
				text    : text,
				endTag  : eTag
			} );
		}

		return;
	};



	slide.prototype.processLineAttribute = function( aLineIn ) {
		var tagInfo;
		if ( tagInfo = this._line_Slide( aLineIn ) ) { }
		return( tagInfo );
	}



	///// READY /////
	ktmd.readyExtension( 'slide', new slide() );
