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


	///// PROCESS LINE /////
	basicExts.prototype.processLine = function( aLineIn ) {
		var lineOut;
		lineOut = this._char_textShadow( aLineIn );
		lineOut = this._char_RectButton( lineOut );
		lineOut = this._char_OvalButton( lineOut );
		lineOut = this._char_CustomSpan( lineOut );
		return( lineOut );
	}



	///// READY /////
	ktmd.readyExtension( 'basicExts', new basicExts() );
