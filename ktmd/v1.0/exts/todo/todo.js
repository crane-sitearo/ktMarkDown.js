/**
 *  Todo Extension for ktMarkDown.js
 *    by Kengo Tsuruzono ( crane@sitearo.com )
 */

	'use strict';

	function Todo() {
		ktmd.loadCss( 'todo/todo.css' );
	}


	Todo.prototype.stats = {	// WORD > CSS CLASS NAME
		'due'		: 'due',
		'start'		: 'start',
		'done'		: 'done',
		'end'		: 'done',
		'wait'		: 'wait',
		'〆切'		: 'due',
		'目標'		: 'due',
		'期日'		: 'due',
		'開始'		: 'start',
		'終了'		: 'done',
		'完了'		: 'done',
		'待ち'		: 'wait',
	};


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

		var statsKeys = Object.keys( this.stats );
		var regexStr = this.stats[ statsKeys[ 0 ] ];
		for ( var i = 1, n = statsKeys.length ; i < n ; i++ ) {
			regexStr += '|' + statsKeys[ i ];
		}
		var regex = new RegExp( '^(.*?)\@(' + regexStr + ')\\((.+?)\\)(.*)$' );

		// while ( matches = textIn.match( /^(.*?)\@(due|start|done|wait|today|call)\((.+?)\)(.*)$/ ) ) {
		while ( matches = textIn.match( regex ) ) {

			var head = matches[ 1 ];
			var stat = matches[ 2 ];	// due, start, done, wait, today, call
			var clas = this.stats[ stat ];
			var opts = matches[ 3 ];
			var tail = matches[ 4 ];

			textOut += head;
			textOut += '<span class="ktmd_todo_' + clas + '_head">' + stat + '</span>';
			textOut += '<span class="ktmd_todo_' + clas + '_tail">' + opts + '</span>';

			textIn = tail;

		}


		return( textOut + textIn );

	}


	ktmd.readyExtension( 'todo', new Todo() );
