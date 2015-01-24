/**
 *  Emoji Extension for ktMarkDown.js
 *    by Kengo Tsuruzono ( crane@sitearo.com )
 */

	'use strict';

	function TextShadow() {
	}

	///// PROCESS A LINE /////
	TextShadow.prototype.processLine = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\;\;(.*?)\;\;(.*)$/ ) ) {
			textOut += matches[ 1 ] + '<span class="ktmd_textShadow_1">' + matches[ 2 ] + '</span>';
			textIn   = matches[ 3 ];
		}
		return( textOut + textIn );

	}

	///// READY /////
	ktmd.readyExtension( 'textShadow', new TextShadow() );
