/**
 *  Slide Extension for ktMarkDown.js
 *    by Kengo Tsuruzono ( crane@sitearo.com )
 */

	'use strict';



	function Slide() {

		ktmd.loadExtensionCss( 'slide/slide.css' );

		this.slides        = [];	// Slides
		this.numSlides     = 0;		// The Number of Slides
		this.curSlide      = 0;		// Displaying Slide No.
		this.curBuildSlide = 0;		// Building Slide No.

		var self = this;

		document.addEventListener( 'keydown' , function( aEvent ) {
			var keyCode = aEvent.keyCode;
			switch( keyCode ) {
				case 27 : self.handleKeyEsc(   aEvent ); break;
				case 37 : self.handleKeyLeft(  aEvent ); break;
				case 38 : self.handleKeyUp(    aEvent ); break;
				case 39 : self.handleKeyRight( aEvent ); break;
				case 40 : self.handleKeyDown(  aEvent ); break;
				default : console.log( keyCode ); break;
			}
		} );


	}


	///// HANDLE CURSOR-LEFT KEY
	Slide.prototype.handleKeyLeft = function( aEvent ) {
		if ( 0 < this.curSlide ) {

			var lastSlideElm = document.getElementById( 'SLIDE:' + this.curSlide );
			if ( ! lastSlideElm ) { return; }

			this.curSlide--;
			var curSlideElm  = document.getElementById( 'SLIDE:' + this.curSlide );
			if ( ! curSlideElm ) { return; }

			curSlideElm.style.zIndex  = 100;
			lastSlideElm.style.zIndex =   0;

			curSlideElm.className  = 'ktmd_slide ktmd_slideIn_fromLeft';
			setTimeout( function() { lastSlideElm.className = 'ktmd_slide ktmd_slide_hidden'; }, 1000 );

		}
	}


	///// HANDLE CURSOR-RIGHT KEY
	Slide.prototype.handleKeyRight = function( aEvent ) {
		if ( this.curSlide < this.numSlides - 1 ) {

			var lastSlideElm = document.getElementById( 'SLIDE:' + this.curSlide );
			if ( ! lastSlideElm ) { return; }

			this.curSlide++;
			var curSlideElm  = document.getElementById( 'SLIDE:' + this.curSlide );
			if ( ! curSlideElm ) { return; }

			curSlideElm.style.zIndex  = 100;
			lastSlideElm.style.zIndex =   0;

			curSlideElm.className  = 'ktmd_slide ktmd_slideIn_fromRight';
			setTimeout( function() { lastSlideElm.className = 'ktmd_slide ktmd_slide_hidden'; }, 1000 );

		}
	}


	Slide.prototype.handleKeyUp = function( aEvent ) {
		console.log( 'up' );
	}

	Slide.prototype.handleKeyDown = function( aEvent ) {
		console.log( 'down' );
	}


	Slide.prototype.handleKeyEsc = function( aEvent ) {
		console.log( 'esc' );
	}


	// Slide.prototype.processCharAttribute = function( aLineIn ) {

	// }


	Slide.prototype._line_Slide = function( aLineIn ) {

		var text = aLineIn;
		var sTag, clas, styl, eTag, id, matches;

		if ( matches = text.match( /^\[\[\[\#slide(.*)$/ ) ) { ///// Open Slide /////

			sTag = 'div';
			clas = ( 0 == this.curBuildSlide ) ? 'ktmd_slide' : 'ktmd_slide ktmd_slide_hidden';
			text = matches[ 1 ];
			id   = 'SLIDE:' + this.curBuildSlide;

			this.curBuildSlide++;
			this.numSlides++;

			return( {
				'startTag': sTag,
				'cssClass': clas,
				'cssStyle': styl,
				'text'    : text,
				'endTag'  : eTag,
				'id'      : id
			} );

		}

		if ( matches = text.match( /^\]\]\]\#slide(.*)$/ ) ) { ///// Close Slide /////
			text = matches[ 1 ];
			eTag = 'div';
			return( {
				'startTag': sTag,
				'cssClass': clas,
				'cssStyle': styl,
				'text'    : text,
				'endTag'  : eTag,
				'id'      : id
			} );
		}

		return;
	};



	Slide.prototype.processLineAttribute = function( aLineIn ) {
		var tagInfo;
		if ( tagInfo = this._line_Slide( aLineIn ) ) { }
		return( tagInfo );
	}



	///// READY /////
	ktmd.readyExtension( 'slide', new Slide() );
