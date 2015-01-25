/**
 *  Basic Extension for ktMarkDown.js
 *    by Kengo Tsuruzono ( crane@sitearo.com )
 */

	'use strict';



	function basicExts() {
	}



	///// TEXT SHAODW /////
	basicExts.prototype._char_textShadow = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\;\;(.*?)\;\;(.*)$/ ) ) {
			textOut += matches[ 1 ] + '<span class="ktmd_textShadow_1">' + matches[ 2 ] + '</span>';
			textIn   = matches[ 3 ];
		}
		return( textOut + textIn );

	}


	///// RECT BUTTON /////
	basicExts.prototype._char_RectButton = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\(\[(.*?)\]\)(.*)$/ ) ) {

			var matchHead = matches[ 1 ];
			var matchBody = matches[ 2 ];
			var matchFoot = matches[ 3 ];

			if ( matches = matchBody.match( /^(\d+?)\:(.*)$/ ) ) {
				textOut += matchHead + '<span class="ktmd_rButton_' + matches[ 1 ] + '">' + matches[ 2 ] + '</span>';
				textIn   = matchFoot;
			} else {
				textOut += matchHead + '<span class="ktmd_rButton_1">' + matchBody + '</span>';
				textIn   = matchFoot;
			}

		}
		return( textOut + textIn );
	}



	///// OVAL BUTTON /////
	basicExts.prototype._char_OvalButton = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\(\((.*?)\)\)(.*)$/ ) ) {

			var matchHead = matches[ 1 ];
			var matchBody = matches[ 2 ];
			var matchFoot = matches[ 3 ];

			if ( matches = matchBody.match( /^(\d+?)\:(.*)$/ ) ) {
				textOut += matchHead + '<span class="ktmd_oButton_' + matches[ 1 ] + '">' + matches[ 2 ] + '</span>';
				textIn   = matchFoot;
			} else {
				textOut += matchHead + '<span class="ktmd_oButton_1">' + matchBody + '</span>';
				textIn   = matchFoot;
			}

		}
		return( textOut + textIn );
	}



	///// SPAN CLASS /////
	basicExts.prototype._char_CustomSpan = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\[\[(\S*?)\;(.*?)\]\](.*)$/ ) ) {

			var matchHead = matches[ 1 ];
			var matchSpan = matches[ 2 ];
			var matchBody = matches[ 3 ];
			var matchFoot = matches[ 4 ];

			textOut += matchHead + '<span class="' + matchSpan + '">' + matchBody + '</span>';
			textIn   = matchFoot;

		}
		return( textOut + textIn );
	}



	///// PROCESS CHAR /////
	basicExts.prototype.processCharAttribute = function( aLineIn ) {
		var lineOut;
		lineOut = this._char_textShadow( aLineIn );	// Text Shadow
		lineOut = this._char_RectButton( lineOut );	// Rect Button
		lineOut = this._char_OvalButton( lineOut );	// Oval Button
		lineOut = this._char_CustomSpan( lineOut );	// Custom Span
		return( lineOut );
	}



//-----------------------------------------------------------------------------
//  LINE
//-----------------------------------------------------------------------------



	///// RECT BOX /////
	basicExts.prototype._line_RectBox = function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, matches;

		if ( matches = text.match( /^\(\(\[(.*)$/ ) ) { ///// Open Box /////

			sTag = 'div';
			clas = 'ktmd_rBox_101';
			text = matches[ 1 ];

			if ( matches = text.match( /^(\S+?)\:(.*)$/ ) ) { // N: Custom Css Class
				clas = ' ktmd_rBox_' + matches[ 1 ];
				text = matches[ 2 ];
			}
			else if ( matches = text.match( /^\{(.+?)\}(.*)/ ) ) { // {Class}
				clas = matches[ 1 ];
				text = matches[ 2 ];
			}

			return( {
				startTag: sTag,
				cssClass: clas,
				cssStyle: styl,
				text    : text,
				endTag  : eTag
			} );
		}

		if ( matches = text.match( /^\]\)\)(.*)$/ ) ) { ///// Close Box /////
			text = matches[ 1 ];
			eTag = 'div';
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



	///// OVAL BOX /////
	basicExts.prototype._line_OvalBox = function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, matches;

		if ( matches = text.match( /^\(\(\((.*)$/ ) ) { ///// Open Box /////

			sTag = 'div';
			clas = 'ktmd_oBox_101';
			text = matches[ 1 ];

			if ( matches = text.match( /^(\S+?)\:(.*)$/ ) ) { // N: Custom Css Class
				clas = ' ktmd_oBox_' + matches[ 1 ];
				text = matches[ 2 ];
			}
			else if ( matches = text.match( /^\{(.+?)\}(.*)/ ) ) { // {Class}
				clas = matches[ 1 ];
				text = matches[ 2 ];
			}

			return( {
				startTag: sTag,
				cssClass: clas,
				cssStyle: styl,
				text    : text,
				endTag  : eTag
			} );

		}

		if ( matches = text.match( /^\)\)\)(.*)$/ ) ) { ///// Close Box /////
			text = matches[ 1 ];
			eTag = 'div';
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



	basicExts.prototype.processLineAttribute = function( aLineIn ) {
		var tagInfo;

		if      ( tagInfo = this._line_RectBox( aLineIn ) ) { } // Rect Box
		else if ( tagInfo = this._line_OvalBox( aLineIn ) ) { } // Oval Box

		return( tagInfo );

	}


	///// READY /////
	ktmd.readyExtension( 'basicExts', new basicExts() );
