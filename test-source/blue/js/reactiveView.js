/**
 * @author Jeff Rose
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module blue/reactiveView
 * @requires blue/$
 * @requires blue/array/slice
 * @requires blue/compose
 * @requires blue/declare
 * @requires blue/is
 * @requires blue/nodeDictionary
 * @requires blue/template
 * @requires blue/with/domEvents
 * @requires blue/with/domManagement
 * @requires blue/with/locationAPI
 * @requires blue/with/messaging
 * @requires blue/with/stateAPI
 */
define( function( require ){
	var $				= require( './$' ),
		Ractive         = require( './ractive' ),
		compose			= require( './compose' ),
		is				= require( './is' ),
		has             = require( './has' ),
		nodeDictionary	= require( './nodeDictionary' ),
       	rootContext     = require( './context/root' ),
		getLogger       = require( './log' ),
		extend          = require( './object/extend' ),
		merge           = require( 'mout/object/merge' ),
		reject          = require( 'mout/object/reject' ),
		Decorator       = require( './template/decorator' );

	/**
	 * @class
	 */
	var ReactiveView = require( './declare' )( function(){

		// Consider using a framework-wide implementation, and turning it into a mixin
		function defineProperties( config ){
			Object.keys( config ).forEach(function defineProperty(name){
				this[ '_' + name ] = function GetSet(){
					return !arguments.length ? config[ name ].get.call(this)
					                         : config[ name ].set.apply(this,arguments)
					;
				}
			}.bind(this));
		};
		
		function createViewComponent( view, subView ){
			return Ractive.extend( {
				'isolated': true,
				'onconstruct': function( component ){
					// beforeInit may be executed multiple times for a given use of the component.
					// Only execute this setup code once.
					this.called = this.called ? this.called + 1 : 1;
					if ( this.called === 1 ){
						var childView = view.createSubView( view, subView );

						if ( is.defined( childView ) ){
							// var subView = createViewComponent( childView );

							component.magic = false;
							// childView.rtemplate = component;
							component.view = childView;
							component.template = childView.template;
							component.partials = childView.partials ? childView.partials : {};
							component.transitions = childView.transitions ? childView.transitions : {};
							if ( is.defined( childView.decorators ) && is.plainObject( childView.decorators ) ){
								component.decorators = childView.createDecorators( childView.decorators );
							}
							component.components = childView._views();

							component.data = reject( component.data, function( val, key ){
								if ( key.indexOf( 'attr-' ) === 0 ){
									childView.htmlAttrs[ key.replace( 'attr-', '' ) ] = val;
									return true;
								}
								return false;
							} );

							childView.model = component.data = merge( childView.model, component.data );
						}
					}
				},
				'oninit': function(){
					if( this.fragment.items.length > 1 ){
						throw new Error( 'Invalid template: only one root node allowed. View: ' + this.view.viewName );
					}
				},
				'onrender': function( x ){
					this.view.rtemplate = this;
					if( is.defined( this._triggers ) ){
						this._triggers.forEach( function( trigger ){
							if ( trigger.event === 'render' ){
								 is.function( trigger.action ) && trigger.action();
							}
							else {
								this.on( trigger.event, trigger.action );
							}
						}, this );
					}

					var node = this.fragment.items[ 0 ].node;
					node && Object.getOwnPropertyNames( this.view.htmlAttrs ).forEach( function( attr ){
						node.setAttribute( attr, this.view.htmlAttrs[ attr ] );
					}.bind( this ) );

					this.view.$element = $( this.fragment.items[ 0 ].node );

					this.view._rendered = true;
					this.view.root.addReady();
				}
			} );
		}

		var viewPrototype = /** @lends module:blue/reactiveView~ReactiveView.prototype */ {

				/**
				 * @constructs module:blue/reactiveView~ReactiveView
				 * @param {...Function|...PlainObject} mixins Attributes that will be applied to view instance
				 * @mixes module:template.withTemplating
				 * @mixes module:with/domEvents
				 * @mixes module:with/domManagement
				 * @mixes module:with/locationAPI
				 * @mixes module:with/messaging
				 * @mixes module:with/stateAPI
				 */
				constructor: function ReactiveView(){
					var controller, bridge, parentView,
						subViews = {};

					this.model = {};

	                this.context = rootContext.newChild();

	                // Excluding these references for now to avoid bad behavior
	                //view.context.component = component;
	                //view.context.controller = controller;
	                this.context.logger = getLogger( '[view]' );
	                this.context.$ = $;

	                this._rendered = false;
	                this._descendantCount = 0;
	                this._readyCount = 0;

	                // Define some getters/setters
	                var descriptors = {
						controller: {
							get: function(){
								return controller || this.parent && this.parent.controller;
							},
							set: function( newController ){
								controller = newController;
							},
							enumerable: true
						},
						bridge: {
							get: function(){
								return bridge || this.parent && this.parent.bridge;
							},
							set: function( newBridge ){
								bridge = newBridge;
				                bridge.context = this.context.newChild();
				                bridge.context.logger = getLogger( '[bridge]' );
				                bridge.context.view = this;

							},
							enumerable: true
						},
						parent: {
							get: function(){
								return parentView;
							},
							set: function( newParent ){
								parentView = newParent;
							},
							enumerable: true
						},
						views: {
							get: function(){
								return subViews;
							},
							set: function( newViews ){
								var self = this;
								Object.getOwnPropertyNames(newViews).forEach( function( viewLabel ){
									var comp;
									try {
										comp = createViewComponent( self, newViews[ viewLabel ] );
										subViews[ viewLabel ] = comp;
									}
									catch( e ){
										self.context.logger.warn( 'Invalid component!', e );
									}
								} );
							}
						}
					}

	                // Create properties using ES5 if possible, otherwise fall back to creating functions
	                // NOTE: Since the fallback is a basic implementation, please add setters/getters with caution
					//if( has( 'object-defineproperties-obj' ) ){
						Object.defineProperties( this, descriptors );
					// NOTE: Since object-defineproperties-obj is not working properly, we will always define _methods
					//} else {
						defineProperties.call( this, descriptors );
					//}

					this.timestamp = Date.now();

					this.parent = this.firstChild = this.lastChild = this.nextSibling = this.prevSibling = null;
					this[ 'this' ] = this.root = this;
					this.children = new Set();

					this.htmlAttrs = {};

					this.tagName = undefined;

					//require( 'template/helper' ).withTemplating.call( this );
					//require( 'blue/with/domEvents' ).call( this );
					//require( 'blue/with/stateAPI' ).call( this );

					if( arguments.length ){
						var args = require( 'mout/array/slice' )( arguments );
						args.unshift( this );
						compose.apply( compose, args );
					}

					// If not using getter/setter, map initial property values if needed (kept for backward compatibility)
					if( !has( 'object-defineproperties-obj' ) ){
						Object.keys( descriptors ).forEach(function updateProperties(name){
							if( is.defined( this[ name ] ) ) {
								// Assign the value, and then obtain it
								// NOTE: This is a very basic implementation, and may not cover all use cases, please rely on it with caution
								this[ '_' + name ]( this[name] );
								this[ name ] = this[  '_' + name  ]();
							}
						}.bind(this));
					}

					is['function']( this.init ) && this.init.call( this );
				},

				/**
				 * @function
				 * @param {Selector} [selector]
				 * @return {jQuery}
				 */
				$: function( selector ){
					return selector ?
						this.$element.find( selector ) :
						this.$element;
				},

				isRoot: function(){
					return this === this.root;
				},

				/**
				 * Create a bridge prototype
				 * @param  {Object} spec Bridge/Web spec
				 * @param  {Object} prototype Bridge prototype
				 * @return {Bridge}      Bridge prototype
				 */
				createBridgePrototype: function( spec, prototype ){
				    var bridge = require('blue/reactiveBridge').create(spec, this, prototype);
				    return bridge;
				},

				/**
				 * Create a bridge instance from a spec and optional prototype
				 * @param  {Object} spec Bridge/Web spec
				 * @param  {Object} prototype Bridge prototype
				 * @return {Bridge}      Bridge instance
				 */
				createBridge: function( spec, prototype ){
				    var Bridge = require('blue/reactiveBridge').create(spec, this, prototype);
				    return new Bridge();
				},

				createSubView: function( view, subViewPrototype ){
					var subView;
					subView = new ReactiveView( subViewPrototype );
					return view.appendChild( subView );
				},

				addReady: function(){
					this._readyCount++;
					if( this._readyCount > this._descendantCount ){
						this.bridge.output.emit( 'ready', this.viewName );
					}
				},

				/**
				 * @function
				 * @param {View} childView
				 * @return {View}
				 */
				appendChild: function( childView ){
					childView.parent = this;
					childView.nextSibling = childView.firstChild = childView.lastChild = null;
					childView.prevSibling = this.lastChild;
					childView.root = this.root;
					childView.root._descendantCount++;

					if( this.firstChild ){
						this.lastChild.nextSibling = childView;
						this.lastChild = childView;
					} else {
						this.firstChild = this.lastChild = childView;
					}

					this.children.add( childView );

					return childView;
				},

				/**
				 * @function
				 * @param {Function} callback
				 * @param {Boolean} [andSelf]
				 */
				callRecursively: function( callback, andSelf ){
					var views = andSelf === false ?
							this.children :
							new Set( [ this ] );

					views.size && views.forEach( function( childView ){
						callback( childView );

						childView.callRecursively( callback, false );
					} );
				},

				/**
				 * @function
				 */
				createElement: function(){
					if( is.undefined( this.$element ) ){
						var tagName = this.tagName || 'div';
						return document.createElement( tagName );
					}
					return;
				},

				/**
				 * @function
				 */
				destroy: function(){
					nodeDictionary.destroyView( this );
				},

				/**
				 * @function
				 */
				_destroy: function(){
					if( this.unBindData && is['function']( this.unBindData ) ){
						this.unBindData();
					}

					this.destroyChildren();

					this.disableEvents();

					// Rolling this functionality into disableBridge to make this work more smoothly when
					// destroy command initiated by either component or view.
					// // Only shut down component when top level view is destroyed. Sub views all may have
					// // direct ties to component through their bridges, would not want to disable it multiple
					// // times for just one view destroy operation.
					// this.parent || this.disableComponent();

					this.disableBridge();

					this.rtemplate.teardown().then( function(){
						// $( this.$element ).remove();

						this.destroyElement();

						this.bridge = undefined;

						this.parent && this.parent.removeChild( this );
					}.bind( this ) );

				},

				/**
				 * @function
				 */
				destroyChildren: function(){
					this.callRecursively( function( view ){
						view.destroy();
					}, false );
				},

				/**
				 * @function
				 */
				destroyElement: function(){
					if( is.defined( this.$element ) ){
						// $( this.element ).remove();
						this.$element = undefined;
					}
				},

				/**
				 * @function
				 */
				disableBridge: function(){
					this.bridge && this.bridge.disable();
				},

				// /**
				//  * @function
				//  */
				// disableComponent: function(){
				// 	this.bridge && this.bridge.output.emit( 'destroy' );
				// 	// this.component && this.component.disable();
				// },

				/**
				 * @function
				 * @param {Function} callback
				 */
				insertElement: function( callback ){
					this.$element = $( this.createElement() );
					this.enableEvents( this.$element );
					$( function(){
						callback.call( this, this.$element );
					}.bind( this ) );
				},

				/**
				 * @function
				 * @param {View} childView
				 */
				removeChild: function( childView ){
					childView.parent = null;

					this.children.has( childView ) && this.children[ 'delete' ]( childView );
				},

				/**
				 * @function
				 * @param {Selector} selector Selector describing container node
				 * @param {Function} callback Function to execute on completion
				 */
				appendTo: function( selector, callback ){
					this.insert( true, selector, callback );
				},

				/**
				 * @function
				 * @param {Selector} selector Selector describing container node
				 * @param {Function} callback Function to execute on completion
				 */
				replaceIn: function( selector, callback ){
					this.insert( false, selector, callback );
				},

				/**
				 * @function
				 * @param {Boolean} append Append this template to container? If false, replaces container contents.
				 * @param {Selector} selector Selector describing container node
				 * @param {Function} callback Function to execute on completion
				 */
				insert: function( append, selector, callback ){
					var decorators = {},
						hasTransitions = this.transitions && !is.empty( this.transitions );

					if ( is.defined( this.decorators ) && is.plainObject( this.decorators ) ){
						decorators = this.createDecorators( this.decorators );
					}

					// var subView = createViewComponent( this );

					this.rtemplate = new Ractive( {
						'append': append,
						'el': selector,
						'template': this.template,
						'partials': this.partials ? this.partials : {},
						'decorators': decorators,
						'transitions': hasTransitions ? this.transitions : {},
						'noIntro': hasTransitions ? false : true,
						'transitionsEnabled': hasTransitions ?  true : false,
						'components': this._views(),
						'data': this.model,
						'magic': true,
						'onrender': function(){
							// console.info( 'View rendered!', this.viewName, x );
							this._rendered = true;
							this.root.addReady();
						}.bind( this ),
						'onunrender': function(){
							// console.info( 'View un-rendered.', this.viewName );
						}.bind( this ),
						'onteardown': function(){
							// console.info( 'View teardown.', this.viewName );
						}.bind( this )
					} );

					this.$target = $( selector );
					this.$element = this.$target.children().last();
					nodeDictionary.add( this.$target, this );

					callback.call( this, this.$element );
				},

				createDecorators: function( decoratorModules ){
					var decorators = {};
					for (var decoratorName in decoratorModules) {
						if( decoratorModules.hasOwnProperty( decoratorName ) ) {
							if ( is['function']( decoratorModules[ decoratorName ] ) ){
								decorators[ decoratorName ] = Decorator.create( this, decoratorModules[ decoratorName ] );
							}
							else {
								decorators[ decoratorName ] = Decorator.create( this, decoratorModules[ decoratorName ].module );
								extend( decorators[ decoratorName ], decoratorModules[ decoratorName ].properties );
							}
						}
					}
					return decorators;
				},

				/**
				 * @function
				 * @param {Selector} selector
				 */
				rerender: function( model ){
					model && ( this.model = model );

					this.destroyChildren();

					this.disableEvents();

					this.destroyElement();

					this.replaceIn( this.$target );
				},

				// Support IE logging
				toString: function(){
				 	return ' View ';
				}
			};

		compose( viewPrototype,
			require( './with/domManagement' ),
			require( './with/domEvents' ),
			require( './with/locationAPI' ),
			require( './with/stateAPI' ) );

		return viewPrototype;
	} );

	return ReactiveView;
} );
