/**
 * @author Jeff Rose
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module blue/log/appender
 * @requires blue/declare
 * @requires blue/log/layout/null
 * @requires blue/log/level
 */
define( function( require ){
	return require( '../declare' )( /** @lends module:blue/log/appender# */ {

		/**
		 * @constructs module:blue/log/appender
		 */
		constructor: function Appender(){
			/**
			 * Whether the Appender is enabled or not
			 * @member {Boolean} module:blue/log/appender#enabled
			 */
			this.enabled = true;

			/**
			 * Whether the Appender is enabled or not
			 * @member {module:blue/log/level} module:blue/log/appender#threshold
			 */
			this.threshold = require( './level' ).ALL;

			/**
			 * @member {module:blue/log/layout} module:blue/log/appender#layout
			 */
			this.layout = new ( require( './layout/null' ) )();

			this.start();
		},

		/**
		 * @abstract
		 * @function
		 * @param {PlainObject} entry
		 */
		append: function( entry ){
			if( this.enabled && ( this.threshold.lessThan( entry.level ) || this.threshold.equals( entry.level ) ) ){
				this.doAppend( entry );
			}
		},

		/**
		 * @function
		 */
		destroy: function(){
			this.stop();
			this.enabled = this.threshold = this.layout = undefined;
		},

		/**
		 * @abstract
		 * @function
		 * @throws {Error} If not implemented.
		 */
		doAppend: function(){
			throw new Error( '"doAppend()" is not implemented' );
		},

		/**
		 * Starts the Appender
		 * @function
		 */
		start: function(){
			if( !this.enabled ){
				this.enabled = true;
			}
		},

		/**
		 * Stops the Appender
		 * @function
		 */
		stop: function(){
			if( this.enabled ){
				this.enabled = false;
			}
		},

		// Support IE logging
		toString: function(){
		 	return ' Appender[ threshold: ' + this.threshold + ']';
		}
	} );
} );
