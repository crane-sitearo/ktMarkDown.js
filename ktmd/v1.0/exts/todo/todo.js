/**
 *  Todo Extension for ktMarkDown.js
 *    by Kengo Tsuruzono ( crane@sitearo.com )
 */

	'use strict';

	function Todo() {
	}


	Todo.prototype.processCharAttribute = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches = [];

		while ( matches = textIn.match( /^(.*?)\[([\ \x])\](.*)$/ ) ) {

			var head = matches[ 1 ];
			var chek = matches[ 2 ];	// null, space, x
			var tail = matches[ 3 ];

			textOut += '<input type="checkbox" disabled="disabled"';
			if ( chek == 'x' ) { textOut += ' checked="checked"'; }
			textOut += '>';

			textIn = tail;

		}

		return( textOut + textIn );

	}


	ktmd.readyExtension( 'todo', new Todo() );
