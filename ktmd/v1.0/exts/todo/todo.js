/**
 *  Todo Extension for ktMarkDown.js
 *    by Kengo Tsuruzono ( crane@sitearo.com )
 */

	'use strict';

	function Todo() {
		ktmd.loadExtensionCss( 'todo/todo.css' );
	}


	Todo.prototype.stats = {	// WORD > CSS CLASS NAME

		'due'		: 'warning',	// ENGLISH
		'start'		: 'info',
		'done'		: 'success',
		'end'		: 'success',
		'wait'		: 'danger',
		'delayed'	: 'danger',

		'〆切'		: 'warning',	// JAPANESE
		'目標'		: 'warning',
		'期日'		: 'warning',
		'開始'		: 'info',
		'着手'		: 'info',
		'終了'		: 'success',
		'完了'		: 'success',
		'待ち'		: 'danger',
		'依頼済'		: 'danger',
		'遅延'		: 'danger',

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
		var regexStr = statsKeys[ 0 ];
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
			textOut += '<div class="btn-group" role="group">';
			textOut +=   '<button type="button" class="btn btn-' + clas + ' btn-sm">' + stat + '</button>';
			textOut +=   '<button type="button" class="btn btn-default btn-sm">' + opts + '</button>';
			textOut += '</div>';

			textIn = tail;

		}


		return( textOut + textIn );

	}


	ktmd.readyExtension( 'todo', new Todo() );
