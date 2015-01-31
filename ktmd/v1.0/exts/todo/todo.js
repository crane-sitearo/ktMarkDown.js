/**
 *  Todo Extension for ktMarkDown.js
 *    by Kengo Tsuruzono ( crane@sitearo.com )
 */

	'use strict';

	function Todo() {
		ktmd.loadCss( 'todo/todo.css' );
	}


	Todo.prototype.processCharAttribute = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches = [];

		while ( matches = textIn.match( /^(.*?)\[([\ \x])\](.*)$/ ) ) {

			var head = matches[ 1 ];
			var chek = matches[ 2 ];	// null, space, x
			var tail = matches[ 3 ];

			textOut += head + '<input type="checkbox" disabled="disabled"';
			if ( chek == 'x' ) { textOut += ' checked="checked"'; }
			textOut += '>';

			textIn = tail;

		}

		textIn  = textOut + textIn;
		textOut = '';

		while ( matches = textIn.match( /^(.*?)\@(due|start|done|wait|today|call)\((.+?)\)(.*)$/ ) ) {

			var head = matches[ 1 ];
			var stat = matches[ 2 ];	// due, start, done, wait, today, call
			var opts = matches[ 3 ];
			var tail = matches[ 4 ];

			textOut += head;
			textOut += '<span class="ktmd_todo_' + stat + '_head">' + stat + '</span>';
			textOut += '<span class="ktmd_todo_' + stat + '_tail">' + opts + '</span>';

			textIn = tail;

		}


		return( textOut + textIn );

	}


	ktmd.readyExtension( 'todo', new Todo() );
