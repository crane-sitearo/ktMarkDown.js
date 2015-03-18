/**
 *  ktMarkDown v1.0b3
 *    JavaScript MarkDown Processor by Kengo Tsuruzono ( crane@sitearo.com )
 */

	'use strict';

//-----------------------------------------------------------------------------
//  FUNCTIONS FOR EXTENSION
//-----------------------------------------------------------------------------


	KtMarkDown.prototype.loadExtensionCss = function( aCssPath ) {
		var elm = document.createElement( 'link' );
		elm.rel  = 'stylesheet';
		elm.type = 'text/css';
		elm.href = this.extensionsFolderPath() + aCssPath;
		document.head.appendChild( elm );
	}


//-----------------------------------------------------------------------------
//  MAIN
//-----------------------------------------------------------------------------


	///// CONSTRUCTOR /////
	function KtMarkDown() {

		if ( window.KtMarkDown_Options ) { this.opts = KtMarkDown_Options; }

		this.export = {};

		this.listStack        = [];			//
		this.inPrefix         = false;		// <pre> true </pre> false
		this.blockquoteLevel  = 0;
		this.tableInfo        = null;		// Current table structure

		this.reloadAfter = null;			// Reload Count Down
		this.docTitle    = document.title;

		// LOAD CSS
		this.loadCss( this.cssFolderPath() + 'ktmd.css' );
		this.loadCss( this.libFolderPath() + 'bootstrap/css/bootstrap.css' );

	}


	///// START /////
	KtMarkDown.prototype.start = function() {
		if ( this.loadExtensions() == false ) { // No extension
			this.buildMarkDown();
		}
	}


	///// GET SCRIPT PATH /////
	KtMarkDown.prototype.scriptPath = function() {

		var elms = document.getElementsByTagName( 'script' );

		for ( var i = 0, n = elms.length ; i < n ; i++ ) {
			if ( elms[ i ].src.match( /ktmd.js$/ ) ) {
				return( elms[ i ].src );
			}
		}

	}


	///// GET EXTENSIONS FOLDER PATH /////
	KtMarkDown.prototype.extensionsFolderPath = function() {
		var ktmdPath = this.scriptPath();
		var libPath  = ktmdPath.match( /^(.*\/)ktmd.js$/ )[ 1 ] + 'exts/';
		return( libPath );
	}


	///// GET CSS PATH /////
	KtMarkDown.prototype.cssFolderPath = function() {
		var ktmdPath = this.scriptPath();
		var cssPath  = ktmdPath.match( /^(.*\/)ktmd.js$/ )[ 1 ] + 'css/';
		return( cssPath );
	}


	///// GET LIBRARY PATH /////
	KtMarkDown.prototype.libFolderPath = function() {
		var ktmdPath = this.scriptPath();
		var cssPath  = ktmdPath.match( /^(.*\/ktmd\/).*?ktmd.js$/ )[ 1 ] + 'lib/';
		return( cssPath );
	}


	///// GET CSS PATH /////
	KtMarkDown.prototype.loadCss = function( aPath ) {

		var elms = document.getElementsByTagName( 'style' );
		for ( var i = 0, n = elms.length ; i < n ; i++ ) {
			if ( elms[ i ].src == aPath ) { console.log( 'alredy loaded : ' + aPath ); return; }
		}

		var elm = document.createElement( 'link' );
		elm.rel  = 'stylesheet';
		elm.type = 'text/css';
		elm.href = aPath;
		document.head.insertBefore( elm, document.head.childNodes[0] );
		console.log( 'loaded : ' + aPath );
	}


	///// LOAD EXTENSIONS /////
	KtMarkDown.prototype.loadExtensions = function() {

		if ( this.opts == null ) { return( false ); }
		if ( this.opts.extensions == null ) { return( false ); }

		var libPath  = this.extensionsFolderPath();

		this.extensionQue = [];
		this.extensions = {};
		var exts = this.opts.extensions;
		for ( var i = 0, n = exts.length ; i < n ; i++ ) {
			console.log( 'loading extension : ' + exts[ i ] );
			var elm = document.createElement( 'script' );
			elm.src = libPath + exts[ i ] + '/' + exts[ i ] + '.js';
			document.body.appendChild( elm );
			this.extensionQue.push( exts[ i ] );
		}

	}

	///// READY EXTENSION /////
	KtMarkDown.prototype.readyExtension = function( aExtName, aExt ) {
		console.log( 'ready extension : ' + aExtName );
		var idx = this.extensionQue.indexOf( aExtName );
		if ( 0 <= idx ) {
			this.extensions[ aExtName ] = aExt;
			this.extensionQue.splice( idx, 1 );
			if ( this.extensionQue.length < 1 ) {
				this.buildMarkDown();
			}
		}
	}


//-----------------------------------------------------------------------------
//  CHARACTOR
//-----------------------------------------------------------------------------


	///// BUILD TEXT /////
	KtMarkDown.prototype._buildTEXT = function( aText ) {

		if ( ! aText ) { return( '' ); }

		var text = aText;
		var matches = [];

		// End tag [ >> ] -> &lt;
		while ( matches = text.match( /^(.*?)\{\{(.*?)$/ )) {
			text = matches[ 1 ] + '&lt;' + matches[ 2 ];
		}

		// Start tag [ << ] -> &gt;
		while ( matches = text.match( /^(.*?)\}\}(.*?)$/ )) {
			text = matches[ 1 ] + '&gt;' + matches[ 2 ];
		}

		// Escape character [ /? ] -> ?;
		var outText = '';
		while ( matches = text.match( /^(.*?)\\(.)(.*?)$/ )) {
			outText += matches[ 1 ] + matches[ 2 ];
			text     = matches[ 3 ];
		}
		outText += text;

		return( outText );
	}


	///// BOLD /////
	KtMarkDown.prototype._char_Bold = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches = [];

		while ( matches = textIn.match( /^(.*?)\'\'(.*?)\'\'(.*)$/ ) ) {	// '' BOLD ''
			textOut += matches[ 1 ] + '<mark>' + matches[ 2 ] + '</mark>';
			textIn   = matches[ 3 ];
		}

		textIn  = textOut + textIn;
		textOut = '';
		while ( matches = textIn.match( /^(.*?)\*\*(.*?)\*\*(.*)$/ ) ) {	// ** BOLD **
			textOut += matches[ 1 ] + '<strong class="ktmd_fw900">' + matches[ 2 ] + '</strong>';
			textIn   = matches[ 3 ];
		}

		return( textOut + textIn );
	}


	///// ITALIC /////
	KtMarkDown.prototype._char_Italic = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\/\/(.*?)\/\/(.*)$/ ) ) {
			textOut += matches[ 1 ] + '<em>' + matches[ 2 ] + '</em>';
			textIn   = matches[ 3 ];
		}
		return( textOut + textIn );
	}


	///// UNDERLINE /////
	KtMarkDown.prototype._char_Underline = function( aLineIn ) {

		var textIn    = aLineIn;
		var textOut   = '';
		var spanClass = '';
		var matchBody = '';
		var matches   = [];

		while ( matches = textIn.match( /^(.*?)__(.*?)__(.*)$/ ) ) {

			var matchHead = matches[ 1 ];
			var matchBody = matches[ 2 ];
			var matchFoot = matches[ 3 ];

			if ( matches = matchBody.match( /^(\d+?)\:(.*)$/ ) ) { // __N:STRING__
				spanClass = 'ktmd_uline_' + matches[ 1 ];
				matchBody = matches[ 2 ];
				textOut += matchHead + '<span class="' + spanClass + '">' + matchBody + '</span>';
				textIn   = matchFoot;
			}
			else { // __STRING__
				textOut += matchHead + '<u>' + matchBody + '</u>';
				textIn   = matchFoot;
			}


		}

		return( textOut + textIn );
	}


	///// STRIKETHROUGH /////
	KtMarkDown.prototype._char_Strike = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\~\~(.*?)\~\~(.*)$/ ) ) {
			textOut += matches[ 1 ] + '<del class="ktmd_strike_1">' + matches[ 2 ] + '</del>';
			textIn   = matches[ 3 ];
		}
		return( textOut + textIn );
	}


	///// MONOSPACE /////
	KtMarkDown.prototype._char_MonoSpace = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\`\`(.*?)\`\`(.*)$/ ) ) {

			var matchHead = matches[ 1 ];
			var matchBody = matches[ 2 ];
			var matchFoot = matches[ 3 ];

			textOut += matchHead + '<span class="ktmd_mono_1">' + matchBody + '</span>';
			textIn   = matchFoot;

		}
		return( textOut + textIn );
	}


	///// IMAGE /////
	KtMarkDown.prototype._char_Image = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\!\[([^\[]*?)\]\((.*?)\)(.*)$/ ) ) {

			var head = matches[ 1 ];
			var url  = matches[ 3 ];
			var alt  = matches[ 2 ];
			var tail = matches[ 4 ];

			textOut += head + '<img title="' + alt + '" alt="' + alt + '"';

			if ( matches = url.match( /^(\S+) \=(.+?)\,(.+?)$/ ) ) { // WIDTH,HEIGHT
				url        = matches[ 1 ];
				var width  = matches[ 2 ];
				var height = matches[ 3 ];
				if ( Number( width  ) == width  ) { width  = String( width  ) + 'px'; }
				if ( Number( height ) == height ) { height = String( height ) + 'px'; }
				textOut += ' style="width:' + width + '; height:' + height + ';"';
			}

			textOut += ' src="' + url + '">';
			textIn   = tail;
		}
		return( textOut + textIn );
	}


	///// VIDEO /////
	KtMarkDown.prototype._char_Video = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\!v\[([^\[]*?)\]\((.*?)\)(.*)$/ ) ) {
			var head = matches[ 1 ];
			var url  = matches[ 3 ];
			var alt  = matches[ 2 ];
			var tail = matches[ 4 ];
			textOut += head + '<video src="' + url + '" controls>';
			textIn   = tail;
		}
		return( textOut + textIn );
	}


	///// AUDIO /////
	KtMarkDown.prototype._char_Audio = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\!a\[([^\[]*?)\]\((.*?)\)(.*)$/ ) ) {
			var head = matches[ 1 ];
			var url  = matches[ 3 ];
			var alt  = matches[ 2 ];
			var tail = matches[ 4 ];
			textOut += head + '<audio src="' + url + '" controls>';
			textIn   = tail;
		}
		return( textOut + textIn );
	}


	///// LINK /////
	KtMarkDown.prototype._char_Link = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\[([^\[]+?)\]\((.+?)\)(.*)$/ ) ) {
			var head  = matches[ 1 ];
			var title = matches[ 2 ];
			var url   = matches[ 3 ];
			var tail  = matches[ 4 ];
			var target;

			if ( matches = url.match( /^\+(.+)$/ ) ) { // LINK FOR NEW WINDOW
				textOut += head + '<a href="' + matches[ 1 ] + '" target="_new">' + title + '</a>';
			} else {
				textOut += head + '<a href="' + url + '">' + title + '</a>';
			}

			textIn  = tail;
		}
		return( textOut + textIn );
	}


	///// AUTO LINK /////
	KtMarkDown.prototype._char_AutoLink = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\s((https|http|ftp|mailto|file)\:\S+)(.*)$/ ) ) {
			var head = matches[ 1 ];
			var tail = matches[ 4 ];
			if ( head.substr( head.length - 2, 2 ) !== '="' ) {
				textOut += head + '<a href="' + matches[ 2 ] + '">' + matches[ 2 ] + '</a>';
				textIn  = tail;
			} else {
				textOut += head + matches[ 2 ];
				textIn   = tail;
			}
		}
		return( textOut + textIn );
	}


	///// NAME /////
	KtMarkDown.prototype._char_Name = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\{\#(.+?)\}(.*)$/ ) ) { // {#NAME}
			textOut += matches[ 1 ] + '<a id="' + matches[ 2 ] + '"></a>';
			textIn   = matches[ 3 ];
		}
		return( textOut + textIn );
	}


//-----------------------------------------------------------------------------
//  LINE
//-----------------------------------------------------------------------------



	///// BUILD LINE /////
	KtMarkDown.prototype._buildLine = function( aStartTag, aCssClass, aCssStyle, aText, aEndTag, aId ) {

		var tagInfo = this.export.curLine.tagInfo;

		var tagOut = '';

		if (( ! aCssClass )&&( ! aText )&&( aStartTag )&&( aEndTag )) { // BLANK LINE
			tagInfo.cssClass = 'ktmd_blankLine';
			tagInfo.text     = '&nbsp;';
		} else {

			///// CHARACTER ATTRIBUTES /////
			tagInfo.text = this._char_Image( tagInfo.text );		// Image
			tagInfo.text = this._char_Video( tagInfo.text );		// Video
			tagInfo.text = this._char_Audio( tagInfo.text );		// Audio

			tagInfo.text = this._char_Link( tagInfo.text );			// Link
			tagInfo.text = this._char_AutoLink( tagInfo.text );		// Auto Link
			tagInfo.text = this._char_Name( tagInfo.text );			// Name

			tagInfo.text = this._char_Bold( tagInfo.text );			// Bold
			tagInfo.text = this._char_Italic( tagInfo.text );		// Italic
			tagInfo.text = this._char_Underline( tagInfo.text );	// Underline
			tagInfo.text = this._char_MonoSpace( tagInfo.text );	// Monospace
			tagInfo.text = this._char_Strike( tagInfo.text );		// Strikethrough

			///// RUN ALL EXTENSIONS /////
			for ( var ext in this.extensions ) {
				if ( this.extensions[ ext ].processCharAttribute ) {
					tagInfo.text = this.extensions[ ext ].processCharAttribute( tagInfo.text, this.export );
				}
			}

			tagInfo.text = this._buildTEXT( tagInfo.text );
//			tagTxt += text;
		}

		if ( tagInfo.startTag ) {
			tagOut += '<' + tagInfo.startTag;
			if ( tagInfo.cssClass ) { tagOut += ' class="' + tagInfo.cssClass + '"'; }
			if ( tagInfo.cssStyle ) { tagOut += ' style="' + tagInfo.cssStyle + '"'; }
			if ( tagInfo.id       ) { tagOut += ' id="'    + tagInfo.id       + '"'; }
			tagOut += '>';
		}

		tagOut += tagInfo.text;

		if ( tagInfo.endTag ) {
			tagOut += '</' + tagInfo.endTag + '>';
		}

		return( tagOut );
	}



	///// BUILD LINE WITH TAG INFO /////
	// KtMarkDown.prototype._buildLineWithTagInfo = function( aTagInfo ) {
	// 	return( this._buildLine(
	// 		aTagInfo.startTag,
	// 		aTagInfo.cssClass,
	// 		aTagInfo.cssStyle,
	// 		aTagInfo.text,
	// 		aTagInfo.endTag,
	// 		aTagInfo.id
	// 	) );
	// }



	///// ADJUST LIST LEVEL ///
	KtMarkDown.prototype._adjust_ListLevel = function( aLineIn ) {

		var lineIn  = aLineIn;
		var matches = [];
		var html    = '';

		var curLevel = this.listStack.length;	// Current list level
		var dstLevel;							// Destination list level
		var listMark;							// 'List Mark' of current line

		///// GET INDENT LEVEL /////
		if ( matches = lineIn.match( /^([\*\+\-]+)\ (.*)$/ ) ) { // Indent by 'LIST MARK' ( *, **, *** )
			dstLevel = matches[ 1 ].length;
			listMark = matches[ 1 ].substr( 0, 1 );
		}
		else if ( matches = lineIn.match( /^((\t|\ \ )*?)(\*|\+|\-|\d+?\.)\ (.*)$/ ) ) { // Indent by 'TAB' or 'DOUBLE SPACE'
			var indentChar = matches[ 1 ].substr( 0 , 1 ); // TAB or SPC
			if ( indentChar === ''   ) { dstLevel = 1;                           } // LINE TOP
			if ( indentChar === '\t' ) { dstLevel = matches[ 1 ].length     + 1; } // TAB
			else                       { dstLevel = Math.floor( matches[ 1 ].length / 2 ) + 1; } // SPCx2
			listMark = matches[ 3 ];
		}
		else { // No Indent
			dstLevel = 0;
		}

		///// INDENT LEVEL IS NOT CHANGED /////
		if ( curLevel === dstLevel ) { return( '' ); }

		///// INDENT LEVEL IS DOWN : </ul> </ol> /////
		if ( dstLevel < curLevel ) {
			for ( var i = curLevel ; dstLevel < i ; i-- ) {
				html += '</' + this.listStack.pop() + '>\n';
			}
			return( html );
		}

		///// INDENT LEVEL IS UP : <ul> <ol> /////
		var listTag  = (( listMark === '*' )||( listMark === '-' )) ? 'UL' : 'OL';
		for ( var i = curLevel ; i < dstLevel ; i++ ) {
			html += '<' + listTag + '>\n';
			this.listStack.push( listTag );
		}
		return( html );

	}


	///// LIST ITEM /////
	KtMarkDown.prototype._line_ListItem = function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, matches;

		if ( matches = text.match( /^([\*\+\-]+)\ (.*)$/ ) ) { // Indented by 'MULTIPLE LIST MARKS'
			sTag = 'li';
			text = matches[ 2 ];
			eTag = 'li';

			this.export.curLine.tagInfo.startTag = sTag;
			this.export.curLine.tagInfo.cssClass = clas;
			this.export.curLine.tagInfo.cssStyle = styl;
			this.export.curLine.tagInfo.text     = text;
			this.export.curLine.tagInfo.endTag   = eTag;
			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}

		if ( matches = text.match( /^((\t|\ \ )*?)(\*|\+|\-|\d+?\.)\ (.*)$/ ) ) { // Indented by 'TAB'
			sTag = 'li';
			text = matches[ 4 ];
			eTag = 'li';
			if ( text.match( /^\[.\]/ ) ) { styl = 'list-style:none;'; } // ToDo 

			this.export.curLine.tagInfo.startTag = sTag;
			this.export.curLine.tagInfo.cssClass = clas;
			this.export.curLine.tagInfo.cssStyle = styl;
			this.export.curLine.tagInfo.text     = text;
			this.export.curLine.tagInfo.endTag   = eTag;
			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}

		return;
	}



	///// ADJUST TABLE /////
	KtMarkDown.prototype._adjust_Table = function( aLineIn ) {

		var lineIn  = aLineIn;
		var html    = '';
		var matches;

		if ( this.tableInfo ) { // ALREADY INSIDE OF TABLE
			if ( matches = lineIn.match( /^\|.*\|(.*?\!)?$/ ) ) { // INSIDE OF TABLE
			} else { // OUTSIDE OF TABLE
				html += '</tbody></table>';
				this.tableInfo = null;
			}
		} else { // ALREADY OUTSIDE OF TABLE
			if ( matches = lineIn.match( /^\|(.*)\|((.*?)\!)?$/ ) ) { // INSIDE OF TABLE
				var matchHead = matches[ 1 ];
				var matchTail = matches[ 3 ];
				var className = 'table';
				var classes   = matchTail ? matchTail.split( ' ' ) : [];
				for ( var i = 0, n = classes.length ; i < n ; i++ ) {
					className += ' table-' + classes[ i ];
				}
				html += '<table class="' + className + '">';
				this.tableInfo = 'atHead';
			}
		}

		return( html );
	}


	///// COLOR FROM STRING /////
	KtMarkDown.prototype.colorFromString = function( aStr ) {

		if (( aStr.length <= 3 )&&
			( aStr.toLowerCase() != 'red' )&&
			( aStr.toLowerCase() != 'tan' )) { // NUMBER

			return( { type:'style', value:'#'+aStr } );

		} else { // COLOR NAME

			var BS_COLOR_NAME = [ 'default', 'muted', 'primary', 'info', 'success', 'active', 'warning', 'danger' ];

			if ( 0 <= BS_COLOR_NAME.indexOf( aStr ) ) { // BOOTSTRAP3 COLOR NAME
				return( { type:'class', value:aStr } );
			} 

			// CSS COLOR NAME
			return( { type:'style', value:aStr } );

		}

	}



	///// TABLE /////
	KtMarkDown.prototype._line_Table = function( aLineIn ) {

		var	lineIn  = aLineIn;
		var html    = '';
		var	matches = [];
		var tagInfo = this.export.curLine.tagInfo;

		if ( matches = lineIn.match( /^\|.*\|((.*?)\!)?$/) ) { // INSIDE OF TABLE

			var matchTail = matches[ 2 ];
			var cols = lineIn.split( '|' );
			cols.pop();		// REMOVE LAST ITEM
			cols.shift();	// REMOVE FIRST ITEM

			///// TEXT ALIGN /////
			if ( cols[ 0 ].match( /^(\-|\:)/ ) ) {
				for ( var i = 0, n = cols.length ; i < n ; i++ ) {
					if ( matches = cols[ i ].match( /^(.).*(.)$/ ) ) {
						if      (( matches[ 1 ] === ':' )&&( matches[ 2 ] === '-' )) { cols[ i ] = 'left';   }
						else if (( matches[ 1 ] === '-' )&&( matches[ 2 ] === ':' )) { cols[ i ] = 'right';  }
						else if (( matches[ 1 ] === ':' )&&( matches[ 2 ] === ':' )) { cols[ i ] = 'center'; }
						else                                                         { cols[ i ] = 'left';   }
					}
				}
				this.tableInfo = cols;
				return( ' ' );
			}

			///// AT TABLE HEAD /////
			if ( this.tableInfo === 'atHead' ) {
				html += '<thead><tr>';
				for ( var i = 0, n = cols.length ; i < n ; i++ ) {
					tagInfo.startTag = '';
					tagInfo.cssClass = '';
					tagInfo.text     = cols[ i ];
					tagInfo.endTag   = '';
					html += '<th>' + this._buildLine( null, null, null, cols[ i ], null ) + '</th>';
				}
				html += '</tr></thead><tbody>';
				this.tableInfo = 'atBody';
				return( html );
			}

			///// AT TABLE BODY /////
			var cellClass, cellStyle, cellColorClass;

			html += '<tr' + ( ( matchTail ) ? ' class="' + matchTail + '"' : '' ) + '>';
			for ( var i = 0, n = cols.length ; i < n ; i++ ) { // FOR ALL CELL IN ROW

				cellClass      = '';
				cellStyle      = 'text-align:' + this.tableInfo[ i ] + ';';
				cellColorClass = null;

				if ( matches = cols[ i ].match( /^(.*)\!(\S+?)$/ ) ) { // CELL BG COLOR
					cellColorClass = this.colorFromString( matches[ 2 ] );
					cols[ i ] = matches[ 1 ];
					switch( cellColorClass.type ) {
						case 'class': cellClass = cellColorClass.value; break;
						case 'type' : cellStype = cellColorClass.value; break;
					}
				}

				html += '<td style="' + cellStyle + '"';
				html += ( 0 < cellClass.length ) ? ' class="' + cellClass + '"' : '';
				html += '>';

				tagInfo.startTag = '';
				tagInfo.cssClass = '';
				tagInfo.text     = cols[ i ];
				tagInfo.endTag   = '';
				html += this._buildLine( null, null, null, cols[ i ], null ) + '</td>';
			}
			html += '</tr>';
			return( html );

		}
		return( null );
	}


	///// HEADER /////
	KtMarkDown.prototype._line_Header = function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, matches;

		if ( matches = text.match( /^\s*?(\#+)(.*)$/ ) ) {	// LINE TOP ###

			sTag = 'h' + matches[ 1 ].length;
			text = matches[ 2 ];
			eTag = sTag;

			if ( matches = text.match( /^(\d+?)\:(.*)$/ ) ) {	// LINE TOP ###N:
				clas = matches[ 1 ];
				text = matches[ 2 ];
			}

			var name = text;
			name = name.replace( /^\s+/, '' );			// Remove spaces at line top
			name = name.replace( /\s+$/, '' );			// Remove spaces at line end
			name = name.replace( /[\ \#]/g, '_' );			// Space to Underscore
//			text = '<a id="' + name + '"></a>' + text;

			this.export.curLine.tagInfo.startTag = sTag;
			this.export.curLine.tagInfo.cssClass = clas;
			this.export.curLine.tagInfo.text     = text;
			this.export.curLine.tagInfo.endTag   = eTag;
			return( this._buildLine( this.export.curLine.tagInfo ) + '<a id="' + name + '"></a>' );
		}

		return;
	}


	///// ADJUST BLOCKQUOTE /////
	KtMarkDown.prototype._adjust_Blockquote = function( aLineIn ) {

		var text = aLineIn;
		var matches;

		if ( matches = text.match( /^\}/ ) ) { return( '' ); }

		var html = '';
		while( 0 < this.blockquoteLevel ) {
			html += '</blockquote>\n';
			this.blockquoteLevel--;
		}
		return( html );

	}


	///// BLOCKQUOTE /////
	KtMarkDown.prototype._line_Blockquote = function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, matches;

		///// BLOCKQUOTE OPEN /////
		if ( matches = text.match( /^(\}+)(.*)$/ ) ) {	// LINE TOP }
			this.blockquoteLevel++;
			sTag = 'blockquote';
			text = matches[ 2 ];
			eTag = '';
			if ( matches = text.match( /^(\d+?)\:(.*)$/ ) ) {	// Specified CSS Class
				clas = matches[ 1 ];
				text = matches[ 2 ];
			}

			this.export.curLine.tagInfo.startTag = sTag;
			this.export.curLine.tagInfo.cssClass = clas;
			this.export.curLine.tagInfo.cssStyle = styl;
			this.export.curLine.tagInfo.text     = text;
			this.export.curLine.tagInfo.endTag   = eTag;
			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}

		return;
	}


	///// INDENT ///
	KtMarkDown.prototype._line_Indent = function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, matches;

		if ( matches = text.match( /^(\t+)(.*)$/ ) ) { // NO SHADOW
			sTag = 'div';
			styl = 'margin-left:' + ( matches[ 1 ].length )  + 'em';
			text = matches[ 2 ];
			eTag = 'div';

			this.export.curLine.tagInfo.startTag = sTag;
			this.export.curLine.tagInfo.cssClass = clas;
			this.export.curLine.tagInfo.cssStyle = styl;
			this.export.curLine.tagInfo.text     = text;
			this.export.curLine.tagInfo.endTag   = eTag;
			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}

		return;
	}


	///// TEXT ALIGN /////
	KtMarkDown.prototype._line_TextAlign= function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, matches;

		if ( matches = text.match( /^(\:+)(.*)$/ ) ) {
			var align = 'left';
			switch ( matches[ 1 ].length ) {
				case 1 : align = 'left';    break;	// :
				case 2 : align = 'center';  break;	// ::
				case 3 : align = 'right';   break;	// :::
				case 4 : align = 'justify'; break;	// ::::
				case 4 : align = 'nowrap'; break;	// :::::
			}
			sTag = 'p';
			clas = 'text-' + align;
			text = matches[ 2 ];
			eTag = 'p';

			this.export.curLine.tagInfo.startTag = sTag;
			this.export.curLine.tagInfo.cssClass = clas;
			this.export.curLine.tagInfo.cssStyle = styl;
			this.export.curLine.tagInfo.text     = text;
			this.export.curLine.tagInfo.endTag   = eTag;
			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}

		return;
	}


	///// HORIZONTAL RULE /////
	KtMarkDown.prototype._line_HorRule = function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, matches;

		if ( matches = text.match( /^---(.*)$/ ) ) { // BASIC

			var matchFoot = matches[ 1 ];
			if ( matchFoot.length < 1 ) { return( '<hr class="ktmd_horRule_1">' ); }

			if ( matches = matchFoot.match( /^(.+?)\:/ ) ) {
				return( '<hr class="ktmd_horRule_' + matches[ 1 ] + '">' );
			}

//			return( '<hr class="ktmd_horLine_' + matches[ 1 ] + ">' ); }
		}

		return;
	}


	///// PREFIX ///
	KtMarkDown.prototype._line_Prefix = function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, matches;

		if ( this.inPrefix === true ) { // Inside of 'PRE TAG'
			if ( matches = text.match( /^\`\`\`(.*)$/ ) ) { // Close prefix
				this.inPrefix  = false;
				sTag = '';
				text = matches[ 1 ] + '</code>';
				eTag = 'pre';

				this.export.curLine.tagInfo.startTag = sTag;
				this.export.curLine.tagInfo.cssClass = clas;
				this.export.curLine.tagInfo.cssStyle = styl;
				this.export.curLine.tagInfo.text     = text;
				this.export.curLine.tagInfo.endTag   = eTag;
				return( this._buildLine( sTag, clas, styl, text, eTag ) );
			}
			return;
		}

		// Outside of 'PRE TAG'
		if ( matches = text.match( /^\`\`\`(.*)$/ ) ) { // Open prefix

			var matchFoot = matches[ 1 ];
			if ( matches = matchFoot.match( /^\{(.+?)\}(.*)$/ ) ) { // for highlight.js
				clas      = matches[ 1 ];
				matchFoot = matches[ 2 ];
			}

			this.inPrefix  = true;
			sTag = 'pre';
			text = '<code>' + matchFoot;
			eTag = '';

			this.export.curLine.tagInfo.startTag = sTag;
			this.export.curLine.tagInfo.cssClass = clas;
			this.export.curLine.tagInfo.cssStyle = styl;
			this.export.curLine.tagInfo.text     = text;
			this.export.curLine.tagInfo.endTag   = eTag;
			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}

		return;
	}



	///// PAGE BREAK /////
	KtMarkDown.prototype._line_PageBreak = function( aLineIn ) {

		var text = aLineIn;

		if ( text.match( /^=====/ ) ) {
			return( '<div style="page-break-before: always;"></div>' );
		}

		return;
	};


	///// BUILD HTML /////
	KtMarkDown.prototype._buildHTML = function( aSrcElement ) {

		var htmlOut = '';
		var mdLines = aSrcElement.innerHTML.split( /\r\n|\r|\n/ );	// Put all lines into array.

		this.export.lines   = mdLines; // ALL LINES IN A SECTION
		this.export.curLine = {};      // CURRENT LINE

		for ( var i = 0, n = mdLines.length ; i < n ; i++ ) { // Process all lines.

			var mdLine = mdLines[ i ];					// Current line.
			if ( mdLine === '/*' ) { continue; }		// Skip first line.
			if ( mdLine === '*/' ) { continue; }		// Skip last line.

			// SETUP EXPORT //
			this.export.curLine.no      = i;		// CURRENT LINE NO.
			this.export.curLine.orgText = mdLine;	// ORIGINAL TEXT
			this.export.curLine.tagInfo = {			// TAG INFO
				startTag : '',
				cssClass : '',
				cssStyle : '',
				id       : '',
				text     : mdLine,
				endTag   : '',
			};

			var htmlLine;

			htmlOut += this._adjust_ListLevel( mdLine );
			htmlOut += this._adjust_Blockquote( mdLine );
			htmlOut += this._adjust_Table( mdLine );

			if ( htmlLine = this._line_Prefix( mdLine ) ) { } // Prefix
			else {
				if ( this.inPrefix === false ) { // Outside of Prefix
					if      ( htmlLine = this._line_ListItem(   mdLine ) ) { } // List Item
					else if ( htmlLine = this._line_Header(     mdLine ) ) { } // Header
					else if ( htmlLine = this._line_Blockquote( mdLine ) ) { } // Blockquote
					else if ( htmlLine = this._line_TextAlign(  mdLine ) ) { } // Text Align
					else if ( htmlLine = this._line_Indent(     mdLine ) ) { } // Indent
					else if ( htmlLine = this._line_HorRule(    mdLine ) ) { } // Horizontal Rule
					else if ( htmlLine = this._line_Table(      mdLine ) ) { } // Table
					else if ( htmlLine = this._line_PageBreak(  mdLine ) ) { } // Page Break
					else {

						//----- RUN ALL EXTENSIONS -----//
						for ( var ext in this.extensions ) {
							if ( this.extensions[ ext ].processLineAttribute ) { // Check Proc.
								var tagInfo;
								if ( tagInfo = this.extensions[ ext ].processLineAttribute( mdLine, this.export ) ) {
									this.export.curLine.tagInfo = tagInfo
									htmlLine = this._buildLine( tagInfo );
									break;
								}
							}
						}

						if ( ! htmlLine ) { // No Line Attribute
							this.export.curLine.tagInfo.startTag = 'div';
							this.export.curLine.tagInfo.endTag   = 'div';
							this.export.curLine.tagInfo.text     = mdLine;
							htmlLine = this._buildLine( 'div', null, null, mdLine, 'div' );
						}

					}
				} else { // Inside of Prefix
					this.export.curLine.tagInfo.startTag = '';
					this.export.curLine.tagInfo.cssClass = '';
					this.export.curLine.tagInfo.cssStyle = '';
					this.export.curLine.tagInfo.text     = mdLine;
					this.export.curLine.tagInfo.endTag   = '';
					htmlLine = this._buildLine( null, null, null, mdLine, null ) + '\r\n';
				}
			}
			htmlOut += htmlLine;

		} // Loop end of all lines

		// CREATE COLUMN
		var elmCol = document.createElement( 'div' );
		elmCol.className = 'col-md-12';
		elmCol.innerHTML = htmlOut;

		// CREATE ROW
		var elmRow = document.createElement( 'div' );
		elmRow.className = 'row';
		elmRow.appendChild( elmCol );

		// CREATE CONTAINER
		var elmContainer = document.createElement( 'div' );
		elmContainer.className = 'container';
		elmContainer.appendChild( elmRow );

		// APPEND TO DOCUMENT
		document.body.insertBefore( elmContainer, aSrcElement );

	}


	///// COUNT DOWN RELOADING /////
	KtMarkDown.prototype._countDownReloading = function() {
		if ( 0 < this.reloadAfter ) {
			document.title = this.docTitle + ' ( ' + this.reloadAfter + ' secs )';
			this.reloadAfter--;
			var self = this;
			setTimeout( function( aTimer ) { self._countDownReloading(); }, 1000 );
		} else {
			location.reload();
		}
	}


	///// START RELOADING /////
	KtMarkDown.prototype._startReloading = function() {
		if ( this.opts == null ) { return; }
		if ( location.href.match( /^file\:/ ) ) {
			if ( 0 < this.opts.autoReload ) {
				this.reloadAfter = this.opts.autoReload;
				this._countDownReloading();
			}
		}
	}


	///// BUILD MARKDOWN /////
	KtMarkDown.prototype.buildMarkDown = function() {

		// MarkDown all target elements
		this.elmSrc = document.getElementsByClassName( 'markdownSrc' );	// Elements has class='markdown'
		for ( var i = 0, n = this.elmSrc.length ; i < n ; i++ ) {
			this._buildHTML( this.elmSrc[ i ] );
		}

		for ( var ext in this.extensions ) { // Run all extensions
			if ( this.extensions[ ext ].didEndDocumentParse ) { // Check Proc.
				this.extensions[ ext ].didEndDocumentParse( this.export );
			}
		}

		if ( window.hljs ) { hljs.initHighlightingOnLoad(); } // Support highlight.js

		this._startReloading(); // Reload
	}


	// AUTO START
	var ktmd = new KtMarkDown();
	ktmd.start();

