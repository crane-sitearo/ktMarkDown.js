/**
 *  Basic Extension for ktMarkDown.js
 *    by Kengo Tsuruzono ( crane@sitearo.com )
 */

	'use strict';


	function basicExts() {

		// SETUP FOR BOOTSTRAP3

		var elm = document.createElement( 'meta' );
		elm.name    = 'viewport';
		elm.content = 'width=device-width, initial-scale=1.0';
		document.head.appendChild( elm );

	}



	///// TEXT SHAODW /////
	basicExts.prototype._char_textColor = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\[\[ ([^\[]*?) \!([^[]*?)\]\](.*)$/ ) ) { // [[ TEXT #COLOR]]

			var matchHead  = matches[ 1 ];
			var matchBody  = matches[ 2 ];
			var matchColor = matches[ 3 ];
			var matchTail  = matches[ 4 ];

			if (( matchColor.length <= 3 )&&
				( matchColor.toLowerCase() != 'red' )&&
				( matchColor.toLowerCase() != 'tan' )) { // NUMBER [[ TEXT #RGB]]

				textOut += matchHead + '<span style="color:#' + matchColor + ';">' + matchBody + '</span>';
				textIn   = matchTail;

			} else { // COLOR NAME

				var BS_COLOR_NAME = [ 'muted',   'primary', 'info', 'success', 'warning', 'danger' ];
				var BS_LABEL_NAME = [ 'Default', 'Primary', 'Info', 'Success', 'Warning', 'Danger' ];

				if ( 0 <= BS_COLOR_NAME.indexOf( matchColor ) ) { // BOOTSTRAP3 COLOR NAME
					textOut += matchHead + '<span class="text-' + matchColor + '">' + matchBody + '</span>';
					textIn   = matchTail;
				} else if ( 0 <= BS_LABEL_NAME.indexOf( matchColor ) ) { // BOOTSTRAP3 LABEL NAME
					textOut += matchHead + '<span class="label label-' + matchColor.toLowerCase() + '">' + matchBody + '</span>';
					textIn   = matchTail;
				} else { // CSS COLOR NAME
					textOut += matchHead + '<span style="color:' + matchColor + ';">' + matchBody + '</span>';
					textIn   = matchTail;
				}
			}
		}
		return( textOut + textIn );

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
				textOut += matchHead + '<span class="btn ktmd_rButton_' + matches[ 1 ] + '">' + matches[ 2 ] + '</span>';
				textIn   = matchFoot;
			} else {
				textOut += matchHead + '<span class="btn btn-default btn-sm ktmd_rButton_1">' + matchBody + '</span>';
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



	///// TEXT-COLOR /////
	// basicExts.prototype._char_BootStrap_TextColor = function( aLineIn ) {

	// 	var textIn  = aLineIn;
	// 	var textOut = '';
	// 	var matches;

	// 	while ( matches = textIn.match( /^(.*?)\[\[ ([^\[]*?) \](muted|primary|info|success|warning|danger)\](.*)$/ ) ) {

	// 		var matchHead = matches[ 1 ];
	// 		var matchBody = matches[ 2 ];
	// 		var matchAttr = matches[ 3 ]; if ( matchAttr.length < 1 ) { matchAttr = 'muted'; }
	// 		var matchFoot = matches[ 4 ];

	// 		textOut += matchHead + '<span class="text-' + matchAttr + '">' + matchBody + '</span>';
	// 		textIn   = matchFoot;

	// 	}
	// 	return( textOut + textIn );
	// }



	///// OVAL BUTTON /////
	basicExts.prototype._char_BootStrap_Badge = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\[\[\# (.*?) \]\](.*)$/ ) ) {

			var matchHead = matches[ 1 ];
			var matchBody = matches[ 2 ];
			var matchFoot = matches[ 3 ];

			textOut += matchHead + '<span class="badge">' + matchBody + '</span>';
			textIn   = matchFoot;

		}
		return( textOut + textIn );
	}



	basicExts.BOOTSTRAP_WIDGETS = {

		// BUTTONS
		'default'  : { tag: 'button', class: 'btn btn-default', type: 'button' },
		'primary'  : { tag: 'button', class: 'btn btn-primary', type: 'button' },
		'info'     : { tag: 'button', class: 'btn btn-info',    type: 'button' },
		'success'  : { tag: 'button', class: 'btn btn-success', type: 'button' },
		'warning'  : { tag: 'button', class: 'btn btn-warning', type: 'button' },
		'danger'   : { tag: 'button', class: 'btn btn-danger',  type: 'button' },
		'link'     : { tag: 'button', class: 'btn btn-link',    type: 'button' },

		// BUTTONS LARGE
		'default+' : { tag: 'button', class: 'btn btn-default btn-lg', type: 'button' },
		'primary+' : { tag: 'button', class: 'btn btn-primary btn-lg', type: 'button' },
		'info+'    : { tag: 'button', class: 'btn btn-info    btn-lg', type: 'button' },
		'success+' : { tag: 'button', class: 'btn btn-success btn-lg', type: 'button' },
		'warning+' : { tag: 'button', class: 'btn btn-warning btn-lg', type: 'button' },
		'danger+'  : { tag: 'button', class: 'btn btn-danger  btn-lg', type: 'button' },
		'link+'    : { tag: 'button', class: 'btn btn-link    btn-lg', type: 'button' },

		// BUTTONS SMALL
		'default-' : { tag: 'button', class: 'btn btn-default btn-sm', type: 'button' },
		'primary-' : { tag: 'button', class: 'btn btn-primary btn-sm', type: 'button' },
		'info-'    : { tag: 'button', class: 'btn btn-info    btn-sm', type: 'button' },
		'success-' : { tag: 'button', class: 'btn btn-success btn-sm', type: 'button' },
		'warning-' : { tag: 'button', class: 'btn btn-warning btn-sm', type: 'button' },
		'danger-'  : { tag: 'button', class: 'btn btn-danger  btn-sm', type: 'button' },
		'link-'    : { tag: 'button', class: 'btn btn-link    btn-sm', type: 'button' },

		// BUTTONS XTRA SMALL
		'default--' : { tag: 'button', class: 'btn btn-default btn-xs', type: 'button' },
		'primary--' : { tag: 'button', class: 'btn btn-primary btn-xs', type: 'button' },
		'info--'    : { tag: 'button', class: 'btn btn-info    btn-xs', type: 'button' },
		'success--' : { tag: 'button', class: 'btn btn-success btn-xs', type: 'button' },
		'warning--' : { tag: 'button', class: 'btn btn-warning btn-xs', type: 'button' },
		'danger--'  : { tag: 'button', class: 'btn btn-danger  btn-xs', type: 'button' },
		'link--'    : { tag: 'button', class: 'btn btn-link    btn-xs', type: 'button' },

		// ALERTS
		'Info'    : { tag: 'div', class: 'alert alert-info'    },
		'Success' : { tag: 'div', class: 'alert alert-success' },
		'Warning' : { tag: 'div', class: 'alert alert-warning' },
		'Danger'  : { tag: 'div', class: 'alert alert-danger'  },

	};

	///// BOOTSTRAP /////
	basicExts.prototype._char_BootStrapWidgets = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\[\[ (.*?) \]\](\S*?)\!(.*)$/ ) ) {

			var matchHead = matches[ 1 ];
			var matchBody = matches[ 2 ];
			var matchBs   = matches[ 3 ];
			var matchFoot = matches[ 4 ];

			if ( matchBs.length == 0 ) { matchBs = 'default'; }

			var tagInfo = basicExts.BOOTSTRAP_WIDGETS[ matchBs ];
			if ( tagInfo ) { 
				textOut += matchHead + '<' + tagInfo.tag;
				if ( tagInfo.class ) { textOut += ' class="' + tagInfo.class + '"'; }
				if ( tagInfo.type  ) { textOut += ' type="'  + tagInfo.type  + '"'; } 
				textOut += '>' + matchBody + '</' + tagInfo.tag + '>';
				textIn   = matchFoot;
			} else {
				break;
			}

		}
		return( textOut + textIn );
	}



	///// KEYBOARD /////
	basicExts.prototype._char_BootStrapKeyboard = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\[\`(.*?)\`\](.*)$/ ) ) { // [` KEY `]

			var matchHead = matches[ 1 ];
			var matchBody = matches[ 2 ];
			var matchFoot = matches[ 3 ];

			textOut += matchHead + '<kbd>' + matchBody + '</kbd>';
			textIn   = matchFoot;

		}
		return( textOut + textIn );
	}



	///// CODE /////
	basicExts.prototype._char_BootStrapCode = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\(\`(.*?)\`\)(.*)$/ ) ) { // (` CODE `)

			var matchHead = matches[ 1 ];
			var matchBody = matches[ 2 ];
			var matchFoot = matches[ 3 ];

			textOut += matchHead + '<code>' + matchBody + '</code>';
			textIn   = matchFoot;

		}
		return( textOut + textIn );
	}


	///// OVAL BUTTON /////
	basicExts.prototype._char_BootStrapIcon = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\[\[(\S+?)\!\]\](.*)$/ ) ) {

			var matchHead = matches[ 1 ];
			var matchBody = matches[ 2 ];
			var matchFoot = matches[ 3 ];

			textOut += matchHead + '<span class="glyphicon glyphicon-' + matchBody + '" aria-hidden="true"></span>';
			textIn   = matchFoot;

		}
		return( textOut + textIn );
	}



	///// SPAN CLASS /////
	basicExts.prototype._char_CustomSpan = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\[\? (.*?) \?(\w*?)\](.*)$/ ) ) { // [[]className?]

			var matchHead = matches[ 1 ];
			var matchBody = matches[ 2 ];
			var matchSpan = matches[ 3 ];
			var matchFoot = matches[ 4 ];

			textOut += matchHead + '<span class="' + matchSpan + '">' + matchBody + '</span>';
			textIn   = matchFoot;

		}
		return( textOut + textIn );
	}


	basicExts.prototype._char_CustomClassDiv = function( aLine, aExport ) {

		var BS_COLORS = {

			'muted'   : 'text-muted',
			'primary' : 'text-primary',
			'info'    : 'text-info',
			'success' : 'text-success',
			'warning' : 'text-warning',
			'danger'  : 'text-danger',

			'Primary' : 'bg-primary',
			'Success' : 'bg-success',
			'Info'    : 'bg-info',
			'Warning' : 'bg-warning',
			'Danger'  : 'bg-danger',

		};

		var textOut = aLine;
		var matches = textOut.match( /^(.*?)\[\[\[([^\[]+?)\]\]\]$/ );

		if ( matches ) {
			textOut  = matches[ 1 ];
			var cssClass = BS_COLORS[ matches[ 2 ] ];		// Bootstrap Class
			if ( ! cssClass ) { cssClass = matches[ 2 ]; }	// Custom Class
			aExport.curLine.tagInfo.cssClass += ' ' + cssClass;
		}

		return( textOut );

	}





	///// PROCESS CHAR /////
	basicExts.prototype.processCharAttribute = function( aLineIn, aExport ) {
		var lineOut = aLineIn;

		// INSIDE
		lineOut = this._char_textColor( lineOut );					// Text Color
//		lineOut = this._char_BootStrap_TextColor(  lineOut );		// Text Color ( Bootstrap3 )

		lineOut = this._char_BootStrap_Badge(  lineOut );
		lineOut = this._char_BootStrapIcon(  lineOut );		// Keyboard
		lineOut = this._char_BootStrapCode(  lineOut );		// Code
		lineOut = this._char_BootStrapWidgets(  lineOut );
		lineOut = this._char_BootStrapKeyboard(  lineOut );
		lineOut = this._char_CustomClassDiv(  lineOut, aExport );

		lineOut = this._char_textShadow( lineOut );	// Text Shadow
		lineOut = this._char_CustomSpan( lineOut );	// Custom Span
		lineOut = this._char_RectButton( lineOut );	// Rect Button
		lineOut = this._char_OvalButton( lineOut );	// Oval Button
		return( lineOut );
	}



//-----------------------------------------------------------------------------
//  LINE
//-----------------------------------------------------------------------------


	///// BOOTSTRAP3 : PANEL /////
	basicExts.prototype._line_BootstrapPanel = function( aLineIn ) {

		var PANEL_TYPES = {
			'default' : 'panel panel-default',
			'primary' : 'panel panel-primary',
			'success' : 'panel panel-success',
			'info'    : 'panel panel-info',
			'warning' : 'panel panel-warning',
			'danger'  : 'panel panel-danger',
		};

		var text = aLineIn;
		var sTag, clas, styl, eTag, matches;

		if ( matches = text.match( /^\[\[\[(.*)$/ ) ) { ///// Open Panel /////

			sTag = 'div';
			clas = 'panel panel-default';
			text = matches[ 1 ];

			if ( matches = text.match( /^(\S+)(.*)$/ ) ) { // XXXX : Panel-Type
				var type = matches[ 1 ];
				if ( PANEL_TYPES[ type ] ) { clas = PANEL_TYPES[ type ]; }
				text = matches[ 2 ];
			}
			else if ( matches = text.match( /^ (.*)$/ ) ) { // DEFAULT-PANEL
				text = matches[ 1 ];
			}

			if ( 0 < text.length ) { text = '<div class="panel-heading">' + text + '</div>'; }
			text += '<div class="panel-body">';

			return( {
				startTag: sTag,
				cssClass: clas,
				cssStyle: styl,
				text    : text,
				endTag  : eTag
			} );
		}

		if ( matches = text.match( /^\]\]\](.*)$/ ) ) { ///// Close Panel /////
			text = matches[ 1 ];
			eTag = 'div';

			if ( 0 < text.length ) { text = '<div class="panel-footer">' + text + '</div>'; }
			text = "</div>" + text;

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
			else if ( matches = text.match( /^\"(.+?)\"(.*)/ ) ) { // {Class}
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


	///// OVAL BOX /////
	basicExts.prototype._line_QuickClass = function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, matches;

		if ( matches = text.match( /^\(\(\"(.*?)\"\)\)(.*)$/ ) ) {

			sTag = 'p';
			clas = matches[ 1 ];
			text = matches[ 2 ];

			if ( 0 <= [ 'muted', 'primary', 'success', 'info', 'warning', 'danger' ].indexOf( clas ) ) {
				clas = 'text-' + clas; // Shotcur for Bootstrap3
			}

			return( {
				startTag: sTag,
				cssClass: clas,
				cssStyle: styl,
				text    : text,
				endTag  : sTag
			} );

		}

		return;
	};


	basicExts.prototype.processLineAttribute = function( aLineIn ) {

		var tagInfo;

		if      ( tagInfo = this._line_QuickClass( aLineIn ) ) { } // Rect Box
		else if ( tagInfo = this._line_RectBox( aLineIn ) ) { } // Rect Box
		else if ( tagInfo = this._line_OvalBox( aLineIn ) ) { } // Oval Box
		else if ( tagInfo = this._line_BootstrapPanel( aLineIn ) ) { }

		return( tagInfo );

	}


	///// READY /////
	ktmd.readyExtension( 'basicExts', new basicExts() );
