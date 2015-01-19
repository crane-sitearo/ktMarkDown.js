/**
 *  ktMarkDown v1.0b3
 *    JavaScript MarkDown Processor by Kengo Tsuruzono ( crane@sitearo.com )     
 */


	'use strict';


//-----------------------------------------------------------------------------
//  MAIN
//-----------------------------------------------------------------------------


	///// CONSTRUCTOR /////
	function KtMarkDown() {

		if ( window.KtMarkDown_Options ) { this.opts  = KtMarkDown_Options; }

		this.listStack        = [];				// 
		this.inPrefix         = false;			// <pre> true </pre> false
		this.blockquoteLevel  = 0;
		this.tableInfo        = null;			// Current table structure

		this.reloadAfter = null;			// Reload Count Down
		this.docTitle    = document.title;
		
	}


//-----------------------------------------------------------------------------
//  CHARACTOR
//-----------------------------------------------------------------------------


	///// BUILD TEXT /////
	KtMarkDown.prototype._buildTEXT = function( aText ) {

		var text = aText;
		var matches = [];

		// [ >> ] -> &lt;
		while ( matches = text.match( /^(.*?)\{\{(.*?)$/ )) {
			text = matches[ 1 ] + '&lt;' + matches[ 2 ];
		}

		// [ << ] -> &gt;
		while ( matches = text.match( /^(.*?)\}\}(.*?)$/ )) {
			text = matches[ 1 ] + '&gt;' + matches[ 2 ];
		}

		// [ /? ] -> ?;
		var outText = '';
		while ( matches = text.match( /^(.*?)\\(.)(.*?)$/ )) {
			outText += matches[ 1 ] + matches[ 2 ];
			text     = matches[ 3 ];
		}
		outText += text;

		return( outText );
	}


	///// EMOJI /////
	KtMarkDown.prototype.emojis = {

		// PEOPLE

			bowtie							: '',
			smile							: '😄',
			laughing						: '😆',
			blush							: '😊',
			smiley							: '😃',
			relaxed							: '☺',
			smikr							: '😏',
			heart_eyes						: '😍',
			kissing_heart					: '😘',
			kissing_closed_eyes				: '😚',
			flushed							: '😳',
			relieved						: '😌',
			satisfied						: '😆',
			grin							: '😁',
			wink							: '😉',
			stuck_out_tongue_winking_eye	: '😜',
			stuck_out_tongue_closed_eye		: '😝',
			grinning						: '',
			kissing							: '😗',
			kissing_smiling_eyes			: '😙',
			stuck_out_tongue				: '😛',
			sleeping						: '😴',
			worried							: '😟',
			frowing							: '😦',
			grimacing						: '',
			confused						: '',
			hushed							: '',
			expressionless					: '',
			unamused						: '',
			sweat_smile						: '😅',
			sweat 							: '😓',
			disappointed_relieved 			: '😥',
			weary 							: '😩',
			pensive 						: '😔',
			disappointed 					: '😞',
			confounded 						: '😖',
			fearful							: '😨',
			cold_sweat						: '😰',
			persevere						: '😣',
			cry 							: '😢',
			sob 							: '😭',
			joy 							: '😂',
			astonished 						: '😲',
			scream 							: '😱',
			neckbeard 						: '',
			tired_face 						: '😫',
			angry 							: '😠',
			rage 							: '😡',
			triumph							: '',
			sleepy 							: '😪',
			yum 							: '😋',
			mask 							: '😷',
			sunglasses 						: '',
			dizzy_face 						: '',
			imp								: '👿',
			smiling_imp 					: '',
			neutral_face					: '',
			no_mouth 						: '',
			innocent 						: '',
			alien 							: '👽',

			yellow_heart 					: '💛',
			blue_heart 						: '💙',
			purple_heart 					: '💜',
			heart 							: '❤',
			green_heart 					: '💚',
			broken_heart 					: '💔',
			heartbeat 						: '💓',
			heartpulse	 					: '💗',
			two_heart						: '💛',
			revolving_heart					: '💛',
			cupid 							: '💘',
			sparkling_heart					: '',


			speech_balloon 		: '',

		// HANDS

			'+1'				: '👍',
			'thumbsup'			: '👍',
			'-1'				: '👎',
			'thumbsdown'		: '👎',
			'ok_hand'			: '👌',
			'punch'				: '👊',
			'fist'				: '✊',
			'v'					: '✌',
			'wave'				: '👋',
			'hand'				: '✋',
			'raised_hand'		: '✋',
			'open_hands'		: '👐',
			'point_up'			: '👆',
			'point_down'		: '👇',
			'point_right'		: '👉',
			'point_left'		: '👈',
			'raised_hands'		: '🙌',
			'pray'				: '🙏',
			'point_up_2'		: '☝',
			'clap'				: '👏',
			'muscle'			: '💪',

		// OBJECTS

			bamboo				: '🎍',
			gift_heart			: '💝',
			dolls				: '🎎',

			school_satchel		: '🎒',
			mortar_board		: '🎓',
			flags				: '🎏',

			fireworks			: '🎆',
			sparkler			: '🎇',
			wind_chime			: '🎐',

			sunny				: '☀',
			umbrella			: '☔',
			cloud				: '☁',
			snowflake			: '',
			snowman				: '⛄',
			zap					: '⚡',
			cyclone				: '🌀',

			foggy				: '',
			ocean				: '',

		// MACHINES

			cd 					: '💿',
			dvd 				: '📀',
			floppy_disk 		: '💾',
			camera 				: '📷',
			video_camera 		: '📹',
			movie_camera		: '🎥',
			computer 			: '💻',
			tv 					: '📺',
			iphone 				: '📱',
			phone 				: '☎️',
			telephone 			: '☎️',
			telephone_receiver 	: '📞',
			pager 				: '📟',
			fax 				: '📠',
			minidisc 			: '💽',
			vhs 				: '📼',
			sound 				: '🔊',
			speaker 			: '🔊',
			mute 				: '',
			loudspeaker 		: '📢',
			mega 				: '📣',
			hourglass 			: '⌛️',
			hourglass_flowing_sand : '⏳️',
			alram_clock 		: '⏰',
			watch 				: '⌚️',
			radio 				: '📻',
			satellite 			: '📡',
			loop 				: '➿',
			mag 				: '🔍',
			mag_right 			: '🔎',
			unlock 				: '🔓',
			lock 				: '🔒',
			lock_with_ink_pen 	: '🔏',
			closed_lock_with_key : '🔐',
			key 				: '🔑',
			bulb 				: '💡',
			flashlight 			: '🔦',
			high_brightness 	: '🔆',
			low_brightness 		: '🔅',
			electric_plug 		: '🔌',
			battery 			: '🔋',
			calling 			: '📲',
			email 				: '📩',
			mailbox 			: '📫',
			postbox 			: '📮',
			bath 				: '🛀',
			bathtub 			: '🛁',
			shower 				: '🚿',
			toilet 				: '🚽',
			wrench 				: '🔧',
			nut_and_bolt		: '🔩',
			hammer 				: '🔨',
			seat 				: '💺',

		// MONEY

			moneybag 			: '💰',
			yen					: '💴',
			doller 				: '💵',
			pound 				: '💷',
			euro 				: '💶',
			credit_card 		: '💳',
			money_with_wings	: '💸',

		// ANIMALS & PLANTS

			cat					: '🐱',
			dog					: '🐶',
			mouse				: '🐭',
			hamster				: '🐹',
			rabbit				: '🐰',
			wolf				: '🐺',
			frog				: '🐸',
			tiger				: '🐯',
			koala				: '🐨',
			bear 				: '🐻',
			pig 				: '🐷',
			pig_nose			: '🐽',
			cow 				: '🐮',
			boar 				: '🐗',
			monkey_face 		: '🐵',
			monkey 				: '🐒',
			horse 				: '🐴',
			racehorse 			: '🐎',
			camel 				: '🐪',
			sheep				: '🐑',
			elephant 			: '🐘',
			panda_face			: '🐼',
			snake 				: '🐍',
			bird 				: '🐦',
			baby_chick 			: '🐤',
			hatched_chick 		: '🐥',
			hatching_chick 		: '🐣',
			chiken 				: '🐔',
			penguin 			: '🐧',
			turtle 				: '🐢',
			bug 				: '🐛',
			honeybee 			: '🐝',
			ant 				: '🐜',
			beetle 				: '🐞',
			snail 				: '🐌',
			octopus 			: '🐙',
			tropical_fish 		: '🐠',
			fish 				: '🐟',
			whale 				: '🐳',
			whale2 				: '🐋',
			dolphin 			: '🐬',
			cow2 				: '🐄',
			ram 				: '🐏',
			rat 				: '🐀',
			water_buffalo 		: '🐃',
			tiger2 				: '🐅',
			rabbit2 			: '🐇',
			dragon 				: '🐉',
			goat 				: '🐐',
			rooster 			: '🐓',
			dog2 				: '🐕',
			pig2 				: '🐖',
			mouse2 				: '🐁',
			ox 					: '🐂',
			dragon_face			: '🐲',
			blowfish 			: '🐡',
			crocodile 			: '🐊',
			dromedary_camel 	: '🐫',
			leopard 			: '🐆',
			cat2 				: '🐈',
			poodle 				: '🐩',
			paw_prints 			: '🐾',
			bouquet 			: '💐',
			cherry_blossom		: '🌸',
			tulip 				: '🌷',
			four_leaf_clover	: '🍀',
			rose 				: '🌹',
			sunflower 			: '🌻',
			hibiscus 			: '🌺',
			maple_leaf			: '🍁',
			leaves 				: '🍃',
			fallen_leaf 		: '🍂',
			herb 				: '🌿',
			mushroom 			: '🍄',
			cactus 				: '🌵',
			palm_tree 			: '',
			evergreen_tree 		: '🌲',
			deciduous_tree 		: '🌳',
			chestnut 			: '🌰',
			seedling 			: '',
			blossom 			: '',
			ear_of_rice 		: '🌾',
			shell 				: '🐚',


		// SPORTS

			football			: '🏈',
			basketball			: '🏀',
			soccer				: '⚽',
			baseball			: '⚾',
			tennis				: '🎾',
			'8ball'				: '🎱',

			warning				: '⚠',
			construction		: '🚧',
			beginner			: '🔰',
			atm					: '🏧',

			dart				: '🎯',
			mahjong				: '🀄',


		// FOODS

			coffee				: '☕',
			tea					: '🍵',
			sake				: '🍶',
//			baby_buttle			: '',
			beer				: '🍺',
			beers				: '🍻',
			cocktail			: '🍸',
			fork_and_knife		: '🍴',
//			pizza				: '',
			hamburger			: '🍔',
			fries				: '🍟',
//			poultry_leg			: '',
//			meat_on_bone		: '',
			spagetti			: '🍝',
			curry				: '🍛',
//			fried_shrimp		: '',
			bento				: '🍱',
			sushi				: '🍣',
//			fish_cake			: '',
			rice_ball			: '🍙',
			rice_cracker		: '🍘',
			rice 				: '🍚',
			ramen				: '🍜',
			stew				: '🍲',
			oden				: '🍢',
			dango				: '🍡',
			egg					: '🍳',
			bread				: '🍞',
//			doughnut			: '🍞',
//			custard				: '🍞',
			icecream			: '🍦',
//			ice_cream			: '🍧',
			shaved_ice			: '🍧',
			birthday			: '🎂',
			cake				: '🍰',
//			cookie				: '🍰',
//			chocolate_bar		: '🍰',
//			candy				: '🍰',
//			lollipop			: '🍰',
//			honey_pot			: '🍰',
			apple				: '🍎',
			tangeline			: '🍊',
//			lemon				: '🍊',
//			cherries			: '🍊',
//			grapes				: '🍊',
			watermelon			: '🍉',
			strawberry			: '🍓',
//			peach				: '🍓',
//			melon				: '🍓',
//			banana				: '🍓',
//			pear				: '🍓',
//			pinapple			: '🍓',
//			sweet_potatp		: '🍓',
			eggplant			: '🍆',
			tomato				: '🍅',
//			corn				: '🍅',


			clock1 				: '🕐',
			clock10 			: '🕙',

	};


	///// EMOJI /////
	KtMarkDown.prototype._char_Emoji = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches = [];

		while ( matches = textIn.match( /^(.*?)\ \:(.*?)\:\ (.*)$/ ) ) {	// :emoji:
			var emoji = this.emojis[ matches[ 2 ] ];
			if ( emoji ) {
				textOut += matches[ 1 ] + emoji;
				textIn   = matches[ 3 ];
			} else {
				textOut += matches[ 1 ] + ' EMOJI ';
				textIn   = matches[ 3 ];
			}
		}

		return( textOut + textIn );

	}


	///// BOLD /////
	KtMarkDown.prototype._char_Bold = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches = [];

		while ( matches = textIn.match( /^(.*?)\'\'(.*?)\'\'(.*)$/ ) ) {	// '' BOLD ''
			textOut += matches[ 1 ] + '<b class="ktmd_fw600">' + matches[ 2 ] + '</b>';
			textIn   = matches[ 3 ];
		}

		textIn  = textOut + textIn;
		textOut = '';
		while ( matches = textIn.match( /^(.*?)\*\*(.*?)\*\*(.*)$/ ) ) {	// ** BOLD **
			textOut += matches[ 1 ] + '<b class="ktmd_fw900">' + matches[ 2 ] + '</b>';
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
			textOut += matches[ 1 ] + '<i>' + matches[ 2 ] + '</i>';
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
			}
			else { // __STRING__
				spanClass = 'ktmd_uline_1';
			}

			textOut += matchHead + '<span class="' + spanClass + '">' + matchBody + '</span>';
			textIn   = matchFoot;

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

	///// SHADOW /////
	KtMarkDown.prototype._char_Shadow = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)\;\;(.*?)\;\;(.*)$/ ) ) {
			textOut += matches[ 1 ] + '<span class="ktmd_textShadow_1">' + matches[ 2 ] + '</span>';
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


	///// RECT BUTTON /////
	KtMarkDown.prototype._char_RectButton = function( aLineIn ) {

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
	KtMarkDown.prototype._char_OvalButton = function( aLineIn ) {

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
	KtMarkDown.prototype._char_SpanClass = function( aLineIn ) {

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
			textOut += head + '<img src="' + url + '" title="' + alt + '" alt="' + alt + '">';
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
			var title = matches[ 2 ];
			var url   = matches[ 3 ];
			textOut = matches[ 1 ] + '<a href="' + url + '" controls>' + title + '</a>';
			textIn  = matches[ 4 ];
		}
		return( textOut + textIn );
	}


	///// AUTO LINK /////
	KtMarkDown.prototype._char_AutoLink = function( aLineIn ) {

		var textIn  = aLineIn;
		var textOut = '';
		var matches;

		while ( matches = textIn.match( /^(.*?)((https|http|ftp|mailto|file)\:\S+)(.*)$/ ) ) { 
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

		while ( matches = textIn.match( /^(.*?)\{\#(.+?)\}(.*)$/ ) ) { 
			textOut += matches[ 1 ] + '<a id="' + matches[ 2 ] + '"></a>';
			textIn   = matches[ 3 ];
		}
		return( textOut + textIn );
	}


//-----------------------------------------------------------------------------
//  LINE
//-----------------------------------------------------------------------------


	///// BUILD LINE /////
	KtMarkDown.prototype._buildLine = function( aStartTag, aCssClass, aCssStyle, aText, aEndTag ) {

		var tagText = '';
		var cssClass = aCssClass;

		if (( aText.length < 1 )&&( aStartTag )&&( aEndTag )) {
			cssClass += ' ktmd_blankLine';
		}

		if ( aStartTag ) { 
			tagText += '<' + aStartTag;
			if ( aCssClass ) { tagText += ' class="' + cssClass  + '"'; }
			if ( aCssStyle ) { tagText += ' style="' + aCssStyle + '"'; }
			tagText += '>';
		}

		if ( aText ) { 

			var text = aText;
//			var text += this._buildTEXT( aText ); 

			///// CHARACTER ATTRIBUTES /////
			text = this._char_Bold( text );			// Bold
			text = this._char_Italic( text );		// Italic
			text = this._char_Underline( text );	// Underline
			text = this._char_MonoSpace( text );	// Monospace
			text = this._char_Strike( text );		// Strikethrough
			text = this._char_RectButton( text );	// Rectangle Button
			text = this._char_OvalButton( text );	// Round Rectangle Button
			text = this._char_Image( text );		// Image
			text = this._char_Video( text );		// Video
			text = this._char_Audio( text );		// Audio
			text = this._char_Link( text );			// Link
			text = this._char_AutoLink( text );		// Auto Link
			text = this._char_Name( text );			// Name
			text = this._char_Shadow( text );		// Shadow
			text = this._char_SpanClass( text );	// Span Class
			text = this._char_Emoji( text );		// Emoji

			tagText += this._buildTEXT( text ); 
//			tagText += text; 
		}

		if ( aEndTag ) { 
			tagText += '</' + aEndTag + '>'; 
		}

		return( tagText );
	}


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
			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}

		if ( matches = text.match( /^((\t|\ \ )*?)(\*|\+|\-|\d+?\.)\ (.*)$/ ) ) { // Indented by 'TAB'
			sTag = 'li';
			text = matches[ 4 ];
			eTag = 'li';
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
			if ( matches = lineIn.match( /^\|.*\|\s*$/ ) ) { // INSIDE OF TABLE
			} else { // OUTSIDE OF TABLE
				html += '</tbody></table>';
				this.tableInfo = null;
			}
		} else { // ALREADY OUTSIDE OF TABLE
			if ( matches = lineIn.match( /^\|(.*)\|\s*$/ ) ) { // INSIDE OF TABLE
				var matchHead = matches[ 1 ];
				if ( matches = matchHead.match( /^(\S+?)\:/) ) {
					html += '<table class="ktmd_table_' + matches[ 1 ] + '">';
				} else {
					html += '<table>';
				}
				this.tableInfo = 'atHead';
			}
		}

		return( html );
	}


	///// TABLE /////
	KtMarkDown.prototype._line_Table = function( aLineIn ) {

		var	lineIn  = aLineIn;
		var html    = '';
		var	matches = [];

		if ( matches = lineIn.match( /^\|.*\|\s*$/) ) { // INSIDE OF TABLE

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
					html += '<th>' + this._buildLine( null, null, null, cols[ i ], null ) + '</th>';
				}
				html += '</tr></thead><tbody>';
				this.tableInfo = 'atBody';
				return( html );
			} 

			///// AT TABLE BODY /////
			html += '<tr>';
			for ( var i = 0, n = cols.length ; i < n ; i++ ) {
				html += '<td style="text-align:' + this.tableInfo[ i ] + ';">';
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
			text = '<a id="' + name + '"></a>' + text;

			return( this._buildLine( sTag, clas, styl, text, eTag ) );
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
			}
			sTag = 'div';
			styl = 'text-align:' + align + ';';
			text = matches[ 2 ];
			eTag = 'div';
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
			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}

		return;
	}


	///// RECT BOX /////
	KtMarkDown.prototype._line_RectBox = function( aLineIn ) {

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

			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}
		
		if ( matches = text.match( /^\]\)\)(.*)$/ ) ) { ///// Close Box /////
			text = matches[ 1 ];
			eTag = 'div';
			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}

		return;
	};


	///// OVAL BOX /////
	KtMarkDown.prototype._line_OvalBox = function( aLineIn ) {

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

			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}

		if ( matches = text.match( /^\)\)\)(.*)$/ ) ) { ///// Close Box /////
			text = matches[ 1 ];
			eTag = 'div';
			return( this._buildLine( sTag, clas, styl, text, eTag ) );
		}

		return;
	};


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
	
		for ( var i = 0, n = mdLines.length ; i < n ; i++ ) { // Process all lines.

			var mdLine = mdLines[ i ];					// Current line.
			if ( mdLine === '/*' ) { continue; }		// Skip first line.
			if ( mdLine === '*/' ) { continue; }		// Skip last line.

			Object.seal( this );

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
					else if ( htmlLine = this._line_RectBox(    mdLine ) ) { } // Rect Box
					else if ( htmlLine = this._line_OvalBox(    mdLine ) ) { } // Oval Box
					else if ( htmlLine = this._line_Indent(     mdLine ) ) { } // Indent
					else if ( htmlLine = this._line_HorRule(    mdLine ) ) { } // Horizontal Rule
					else if ( htmlLine = this._line_Table(      mdLine ) ) { } // Table
					else if ( htmlLine = this._line_PageBreak(  mdLine ) ) { } // Page Break
					else {    htmlLine = this._buildLine( 'div', null, null, mdLine, 'div' ); }
				} else { // Inside of Prefix
					htmlLine = this._buildLine( null, null, null, mdLine, null ) + '\r\n';
				}
			}
			htmlOut += htmlLine;

		} // Loop end of all lines

		var elmSrcMd = document.getElementsByTagName( 'body' )[ 0 ];
		var elmDstMd = document.createElement( 'div' );
		elmDstMd.className = 'ktMarkDown';
		elmDstMd.innerHTML = htmlOut;

//		elmSrcMd.appendChild( elmDstMd );
		var bodyNode = document.getElementsByTagName('body')[0];
		bodyNode.insertBefore( elmDstMd, aSrcElement );

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
		if ( this.opts ) {
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

		if ( window.hljs ) { hljs.initHighlightingOnLoad(); } // Support highlight.js

		this._startReloading(); // Reload
	}

	var ktmd = new KtMarkDown();
	ktmd.buildMarkDown();





