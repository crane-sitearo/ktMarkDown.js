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

		var textIn    = aLineIn;
		var textOut   = '';
		var matches   = [];
		var todoFound = false;

		while ( matches = textIn.match( /^(.*?)\[([\ \x])\](.*)$/ ) ) {

			var head = matches[ 1 ];
			var chek = matches[ 2 ];	// null, space, x
			var tail = matches[ 3 ];

			textOut += head + '<input type="checkbox" disabled="disabled"';
			if ( chek == 'x' ) { textOut += ' checked="checked"'; }
			textOut += '>';

			textIn = tail;

			todoFound = true;

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
			textOut += '<span class="btn-group" role="group">';
			textOut +=   '<span type="button" class="ktmd_todo_stat btn btn-' + clas + ' btn-xs">' + stat + '</span>';
			textOut +=   '<span type="button" class="ktmd_todo_obj btn btn-default btn-xs">' + opts + '</span>';
			textOut += '</span>';

			textIn = tail;

			todoFound = true;

		}

		if ( todoFound ) {
			textOut = '<ktmd_todo>' + textOut;
			textIn  = textIn + '</ktmd_todo>';
		}

		return( textOut + textIn );

	}

	Todo.prototype.processLineAttribute = function( aLineIn ) {

		var text = aLineIn;
		var matches;

		if ( matches = text.match( /^\@\@\@TODO_LIST\:(.*)$/ ) ) {
			var title = matches[ 1 ];
			return( {
				startTag: 'ul',
				cssClass: 'ktmd_todo_list',
				cssStyle: null,
				text    : '',
				endTag  : 'ul'
			} );
		}

	}


	Todo.prototype.didEndElementParse = function() {

	}


	Todo.prototype.didEndDocumentParse = function() {

		var todos = [];

		// PICKUP ALL TODOS
		var elms = document.getElementsByTagName( 'ktmd_todo' );
		for ( var i = 0, n = elms.length ; i < n ; i++ ) {

			var todo = {};
			todo.elm = elms[ i ];

			// STATUS ( done, start, wait... )
			var elmStat = todo.elm.getElementsByClassName( 'ktmd_todo_stat' );
			if ( 0 < elmStat.length ) { todo.stat = elmStat[ 0 ].textContent; }

			// OBJECT ( date, who... )
			var elmObj = todo.elm.getElementsByClassName( 'ktmd_todo_obj' );
			if ( 0 < elmObj.length ) { todo.obj = elmObj[ 0 ].textContent; }

			todos[ i ] = todo;

		}

		todos.sort( function( a, b ) {
			if ( a.obj == b.obj ) { return( 0 ); }
			if ( a.obj <  b.obj ) { return( 1 ); }
			return( -1 );
		} );

		// SETUP DESTINATION
		var dstElm = document.getElementsByClassName( 'ktmd_todo_list' );
		if ( dstElm.length == 0 ) { return; }
		dstElm = dstElm[ 0 ];
		dstElm.className = 'list-group';


		// PROCESS ALL TODOS
		for ( var i = 0, n = todos.length ; i < n ; i++ ) {
			var todoElm = document.createElement( 'li' );
			todoElm.className = 'list-group-item';
			todoElm.appendChild( todos[ i ].elm.cloneNode( true ) );
			dstElm.appendChild( todoElm );

		}

	}



	ktmd.readyExtension( 'todo', new Todo() );
