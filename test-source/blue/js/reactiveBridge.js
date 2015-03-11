define( function( require ){

	var $					= require( './$' ),
		camelCase			= require( './string/toComponentName' ),
		declare				= require( './declare' ),
		Direction			= require( './component/direction' ),
		Event				= require( './event' ),
		EventChannel		= require( './event/channel' ),
		domEventsChannel    = require( './event/channel/domEvents' ),
		get					= require( 'mout/object/get' ),
		is					= require( './is' ),
		obj    			    = require( 'mout/object' ),
		merge               = require( 'mout/object/merge' ),
		flatten             = require( 'mout/array/flatten' ),

		defaults = {
			targets: {}
		},

		Bridge = declare( function BridgeCreator(){
			var uuid = 0;

			function makeEventData( data, argList ){
				var newData = [  ],
					globals = { window: window, document: document, body: document.body, $window: $(window), $document: $(window), $body: $(document.body) };

				argList.forEach( function( arg ){
					var argParts = arg.match( /^(\$)?([^.]+)\.(.+)$/ ),
						dollar = argParts[ 1 ] || '',
						argType = argParts[ 2 ] || '',
						argKey = argParts[ 3 ] || '';

					if ( argType ){
						if ( argType === 'element' && argKey ){
							if ( dollar ){
								if ( data.hasOwnProperty( 'domEvent' ) ){
									if ( is[ 'function' ]( $( data.domEvent.target )[ argKey ] ) ){
										newData.push( $( data.domEvent.target )[ argKey ]() );
									}
									else {
										newData.push( $( data.domEvent.target )[ argKey ] );
									}
								}
								else {
									newData.push( null );
								}
							}
							else { newData.push( data.domEvent ? data.domEvent.target[ argKey ] : null ); }
						}
						else if ( argType === 'event' && argKey ) {
							newData.push( data.domEvent ? data.domEvent[ argKey ] : null );
						}
						else if ( globals[ dollar + argType ] && argKey ) {
							if ( is[ 'function' ]( globals[ dollar + argType ][ argKey ] ) ){
								newData.push( globals[ dollar + argType ][ argKey ]() );
							}
							else {
								newData.push( globals[ dollar + argType ][ argKey ] );
							}
						}
						else { newData.push( null ); }
					}
					else { newData.push( null ); }

				}, this );

				return newData;
			}

			return {
				constructor: function Bridge( options ){

					if( !is.plainObject( this.spec ) ){
						throw new TypeError( 'Bridge spec is undefined' );
					}

					// Check for name
					if( !is.string( this.spec.name ) ){
						throw new TypeError( 'Invalid Bridge name "' + this.spec.name + '"' );
					}

					this.spec = merge( {}, this.spec );

					this.name = camelCase( this.spec.name.toLowerCase() );

					this.id = '<#' + this.name + 'Bridge:' + ( ++uuid ) + '>';
					this.listeners = {};
					this.settings = merge( {}, defaults, options || {} );
					this.model = merge( {}, this.settings.model );
					this.queue = [];
					this.output = new EventChannel( {
						eventTarget: this
					} );
					this.downstreamOutput = new EventChannel( {
						eventTarget: this
					} );
					this.__enabled = false;

					this.eventUnlisteners = [];

					// Collect events while disabled
					this.output
						.asEventStream()
						// Only collect if disabled
						.filter( function( event ){
							return !this.__enabled;
						}.bind( this ) )
						// Push events to queue
						.scan( this.queue, function( queue, event ){
							queue.push( event );
							return queue;
						} )
						.onValue( function(){} );

					Object.defineProperty( this, 'enabled', {
						get: function(){
							return is.defined( this.input );
						},
						enumerable: true
					} );

				},

				createBinding: function createBinding( target, $context ){
					var mapping = this.spec.bindings[ target ],

						targetSettings = get( this, 'settings.targets.' + target ),
						binder,
						unbind,
						model,
						fieldWildcard;

					if( !is.plainObject( mapping ) ){
						throw new TypeError( 'The mapping for target "' + target + '" is not valid' );
					}

					// Convert direction from a string to an enumeration
					if( is.string( mapping.direction ) ){
						this.spec.bindings[ target ].direction = mapping.direction = Direction[ mapping.direction.toUpperCase() ];
					}

					if( is.undefined( mapping.direction ) ){
						throw new TypeError( 'Direction for "' + target + '" is not defined.' );
					}

					is.string( mapping.field ) || ( mapping.field = target );

					model = mapping.model = this.model.get()[ camelCase( mapping.field ) ];

					if( Direction.UPSTREAM.equals( mapping.direction ) || Direction.BOTH.equals( mapping.direction ) ){
			        	this.spec.bindings[ target ].unbind = [  ];
			        	unbind = this.view.rtemplate.observe( camelCase( mapping.field ), function( newValue, oldValue, keypath ){
			        		if ( newValue !== oldValue ){
			        			// console.info( 'Ractive value changed from, to, path:', oldValue, newValue, keypath );
			        			this.output.emit( 'binding', {
			        				value: keypath,
			        				data: newValue
			        			} );
				        	}
			        	}.bind( this ) );
			        	this.spec.bindings[ target ].unbind.push( unbind.cancel );

						if ( is.plainObject( model ) ){
				        	this.spec.bindings[ target ].unbind.push( this.view.rtemplate.observe( camelCase( mapping.field ) + '.*', function( newValue, oldValue, keypath ){
				        		if ( newValue !== oldValue ){
				        			// console.info( 'Ractive value changed from, to, path:', oldValue, newValue, keypath );
				        			this.output.emit( 'binding', {
				        				value: keypath,
				        				data: newValue
				        			} );
					        	}
				        	}.bind( this ) ).cancel );
						}
						else if ( is.array( model ) ){
				        	this.spec.bindings[ target].unbind.push( this.view.rtemplate.observe( camelCase( mapping.field ) + '.*', function( newValue, oldValue, keypath ){
				        		if ( newValue !== oldValue ){
				        			// console.info( 'Ractive value changed from, to, path:', oldValue, newValue, keypath );
				        			this.output.emit( 'binding', {
				        				value: keypath,
				        				data: newValue
				        			} );
					        	}
				        	}.bind( this ) ).cancel );
							if ( model.length > 0 && is.plainObject( model[ 0 ] ) ){
					        	this.spec.bindings[ target ].unbind.push( this.view.rtemplate.observe( camelCase( mapping.field ) + '.*.*', function( newValue, oldValue, keypath ){
					        		if ( newValue !== oldValue ){
					        			// console.info( 'Ractive value changed from, to, path:', oldValue, newValue, keypath );
					        			this.output.emit( 'binding', {
					        				value: keypath,
					        				data: newValue
					        			} );
						        	}
					        	}.bind( this ) ).cancel );
							}
						}
					}

					if( Direction.DOWNSTREAM.equals( mapping.direction ) || Direction.BOTH.equals( mapping.direction ) ){

						this.on( 'data/' + camelCase( mapping.field ), function( event ){
						// this.on( 'data', function( event ){

							if( event.value === camelCase( mapping.field ) ){
								this.view.model[ event.value ] = event.current;

								//#ie8-friendly - manually trigger Ractive to handle update to the model
								this.view.rtemplate.update( event.value );
							}

						}.bind( this ) );
					}
				},

				createTrigger: function createTrigger( target ){
					var mapping = this.spec.triggers[ target ],
						targetParts,
						targetName,
						eventType,
						unbind,
						unbinders = [],
						rAction = {};

					if( !is.plainObject( mapping ) ){
						throw new TypeError( 'The mapping for target "' + target + '" is not valid' );
					}

					targetParts = target.split( ':' );
					if ( targetParts[ 1 ] ) {
						targetName = targetParts[ 0 ];
						eventType = targetParts[ 1 ];
					}
					else {
						targetName = target;
						eventType = '';
					}

					if ( ! is.defined( this.spec.triggers[ target ].unbind ) ) {
						this.spec.triggers[ target ].unbind = [  ];
					}

					if ( ( targetName === 'window' || targetName === 'document' ) && eventType ){
						// this.spec.triggers[ target ].unbind.push( domEventsChannel.on( function( e ){
						unbinders = domEventsChannel.on( function( e ){
							if ( e[ 'type' ] === eventType && ( ( e.target === document && targetName === 'document' ) || ( e.target === window && targetName === 'window' ) ) ){
								var data = {
										dataPath: null,
										context: this.model,
										domEvent: e.originalEvent
									},
									args,
									actionParts = mapping.action.split( '.' ),
									actionObject = actionParts[ 1 ] ? actionParts[ 0 ] : 'component',
									actionMethod = actionParts[ 1 ] ? actionParts[ 1 ] : actionParts[ 0 ],
									triggerEvent;

								if ( mapping.args ){
									args = makeEventData( data, mapping.args );
									args.push( data );
								}

								if ( mapping.hasOwnProperty( 'preventDefault' ) && ( !!mapping.preventDefault ) ) {
									e.originalEvent.preventDefault();
								}
								if ( mapping.hasOwnProperty( 'stopPropagation' ) && ( !!mapping.stopPropagation ) ) {
									e.originalEvent.stopPropagation();
								}

								// Allow Trigger to call for function execution on component, bridge, or view
								// by specifying an action like "bridge.someFn", "view.otherFn". The default
								// execution context is component if none is specified (action: 'someFn').
								if ( actionObject === 'component' ){
									triggerEvent = new Event( e.originalEvent, {
										type: 'trigger',
										value: mapping.action,
										data: args ? args : data
									} );
									this.output.emit.call(this.view.root.bridge.output, triggerEvent );
									// this.view.root.bridge.output.emit.call(this.view.root.bridge.output, triggerEvent );
								}
								else if ( actionObject === 'bridge' && is[ 'function' ]( this[ actionMethod ] ) ){
									this[ actionMethod ].apply( this, args ? args : [ data ] );
								}
								else if ( actionObject === 'view' && is[ 'function' ]( this.view[ actionMethod ] ) ){
									this.view[ actionMethod ].apply( this.view, args ? args : [ data ] );
								}
							}
						}.bind( this ) );

						this.spec.triggers[ target ].unbind = this.spec.triggers[ target ].unbind.concat( unbinders );
					}
					else {
						rAction[ '*.' + targetName ] = rAction[ targetName ] = function( e ){
							if ( eventType === '' || e.original[ 'type' ] === eventType ){
								var data = e ? {
										dataPath: e.keypath,
										context: e.context,
										domEvent: e.original
									} : {},
									args,
									actionParts = mapping.action.split( '.' ),
									actionObject = actionParts[ 1 ] ? actionParts[ 0 ] : 'component',
									actionMethod = actionParts[ 1 ] ? actionParts[ 1 ] : actionParts[ 0 ],
									triggerEvent;

								if ( mapping.args ){
									args = makeEventData( data, mapping.args );
									args.push( data );
								}

								if ( e && mapping.hasOwnProperty( 'preventDefault' ) && ( !!mapping.preventDefault ) ) {
									e.original.preventDefault();
								}
								if ( e && mapping.hasOwnProperty( 'stopPropagation' ) && ( !!mapping.stopPropagation ) ) {
									e.original.stopPropagation();
								}

								// Allow Trigger to call for function execution on component, bridge, or view
								// by specifying an action like "bridge.someFn", "view.otherFn". The default
								// execution context is component if none is specified (action: 'someFn').
								if ( actionObject === 'component' ){
									triggerEvent = new Event( e ? e.original : undefined, {
										type: 'trigger',
										value: mapping.action,
										data: args ? args : data
									} );
									this.output.emit.call(this.view.root.bridge.output, triggerEvent );
									// this.view.root.bridge.output.emit.call(this.view.root.bridge.output, triggerEvent );
								}
								else if ( actionObject === 'bridge' && is[ 'function' ]( this[ actionMethod ] ) ){
									this[ actionMethod ].apply( this, args ? args : [ data ] );
								}
								else if ( actionObject === 'view' && is[ 'function' ]( this.view[ actionMethod ] ) ){
									this.view[ actionMethod ].apply( this.view, args ? args : [ data ] );
								}

								// I am concerned about returning false here because Ractive will BOTH preventDefault
								// AND stopPropagation - there is no either/or. With this code commented out, those
								// settings in web spec triggers will have no effect on sub-views. To stop/prevent,
								// one must return false from the event handler function.
								//
								// TODO: decide which is better - to shut down event when either prevent or stop is declared,
								// or else do nothing unless function returns false.
								//
								// // If event handler returns false, Ractive will preventDefault and stopPropagation
								// // internally, preventing this event from bubbling to parent Ractive entities.
								// // This is separate from the native event default and propagation - this return value
								// // only affects parent Ractive templates (if any), preventing them from executing their
								// // "on-..." callbacks.
								// if ( mapping.hasOwnProperty( 'preventDefault' ) && ( !!mapping.preventDefault ) ) {
								// 	return false;
								// }
								// if ( mapping.hasOwnProperty( 'stopPropagation' ) && ( !!mapping.stopPropagation ) ) {
								// 	return false;
								// }
							}
						}.bind( this );

						if ( is.defined( this.view.rtemplate.on ) ){
							unbind = this.view.rtemplate.on( rAction );
							if ( this.view._rendered && rAction.render && is.function( rAction.render ) ){
								 rAction.render.call( this );
							}
							this.spec.triggers[ target ].unbind.push( unbind.cancel );
						}
						else {
							this.view.rtemplate._triggers = this.view.rtemplate._triggers ? this.view.rtemplate._triggers : [  ];
							this.view.rtemplate._triggers.push( {'event': targetName, 'action': rAction } );
						}
					}
				},

				addComponentSpecSettings: function addComponentSpecSettings( settings ){
					Object.getOwnPropertyNames( settings ).forEach( function( settingKey ){
						this.spec.bindings[ settingKey ] || ( this.spec.bindings[ settingKey ] = { 'direction': 'DOWNSTREAM' } );
					}, this );
				},

				disable: function disable(){

					if ( this.__enabled ){
						// deprecated channel code
						// this.output && this.output.end();
						this.__enabled = false;

						// Only shut down component when top level view is destroyed. Sub views all may have
						// direct ties to component through their bridges, would not want to disable it multiple
						// times for just one view destroy operation.
						this.view.parent || ( this.output && this.output.emit( 'destroy' ) );

						this.output && this.output.destroy();
						flatten( this.eventUnlisteners ).forEach( function( eventUnlistener ){
							eventUnlistener();
						} );

						this.input = this.output = undefined;
						this.listeners = {};

						if( is.plainObject(this.spec.bindings) ) {
								Object.getOwnPropertyNames(this.spec.bindings).forEach( function( binding ){
									this.spec.bindings[ binding ].unbind && this.spec.bindings[ binding ].unbind.forEach( function( unbind ){ unbind(); } );
								}.bind( this ) );
						}

						if( is.plainObject(this.spec.triggers) ) {
							Object.getOwnPropertyNames(this.spec.triggers).forEach( function( trigger ){
								this.spec.triggers[ trigger ].unbind && this.spec.triggers[ trigger ].unbind.forEach( function( unbind ){ unbind(); } );
							}.bind( this ) );
						}
					}
				},

				enable: function enable( input, $context ){
					is.undefined( $context ) && ( $context = $( 'body' ).first() );

					this.input = input;

					if( is.plainObject( this.spec ) ){
						// Bindings
						// Do not configure data bindings for sub-view bridges
						// TODO: make sub-view data bindings work
						if ( this.view.isRoot() ){
							is.plainObject( this.spec.bindings ) && is.defined( this.view.rtemplate.observe ) && Object.keys( this.spec.bindings ).forEach( function( target ){
								this.createBinding( target, $context );
							}, this );
						}

						// Triggers
						is.plainObject( this.spec.triggers ) && Object.keys( this.spec.triggers ).forEach( function( target ){
							// console.info( 'creating trigger for:', target );
							this.createTrigger( target, $context );
						}, this );
					}

					var eventTypes = Object.keys( this.listeners ),
						callbacks;

					eventTypes.length && eventTypes.forEach( function( eventType ){
						callbacks = this.listeners[ eventType ];

						callbacks.forEach( function( callback ){
							this.on( eventType, callback );
						}, this );

						callbacks.clear();
					}, this );

					this.listeners = undefined;

					if ( this.view.isRoot() ){
						this.on( 'componentInputReady', function(){
							while( this.queue.length ){
								var item = this.queue.shift();
                                if( item.type == 'binding' ) continue;

								this.output.emit( item );
							}
						}.bind( this ) );
					}


					// Plug each sub-view bridge output into the top-level bridge so each bridge
					// sends messages directly to component
					if ( this !== this.view.root.bridge ){
						this.connectToRootBridge(  );
					}

					// Receive "destroy" instruction from component and apply it to view
					this.on( 'destroyView', function(  ){
						if ( this.__enabled ){
							require( './nodeDictionary' ).destroyView( this.view );
						}
					}.bind( this ) );

					this.view.children.forEach( function( childView ){
						childView.bridge.enable( this.downstreamOutput );
					}, this );

					this.__enabled = true;
				},

				connectToRootBridge: function connectToRootBridge(){
					this.view.root.bridge.output.plug( this.output.asEventStream() );
				},



				/**
				 * @description Subscribe to events on the component's local Channel. Events on the
				 *              local channel are not visible to other components or the main
				 *              ComponentChannel.
				 * @function
				 * @param {String|PlainObject} [eventType] The type of event.
				 * @param {Function} [callback] The callback to execute when the event is published.
				 * @example
				 * // Execute callback for ALL events on the component (no eventType given)
				 * myComponent.on(function(event){
				 *     // Analyze, log, etc the event
				 * });
				 *
				 * // Execute callback for a component-generated event
				 * // Format of eventType is ACTION/VALUE
				 * // ACTION - function call, state change, etc on the component
				 * // VALUE - name of action, property name, etc.
				 *
				 * // Note: TARGET is automatically prepended to the eventType and
				 * //       is equal to the name of the component as defined in the spec
				 * myComponent.on('action/submit', function(event){
				 *     // Execute logic for the submit action on the component
				 * });
				 *
				 * // Subscribe to multiple events
				 * myComponent.on( {
				 *     'action/submit': function(submitEvent){
				 *         // Business Logic
				 *     },
				 *     'state/enabled': function(enabledEvent){
				 *         // Business Logic
				 *     },
				 *     'action/requestBalance': function(requestEvent){
				 *         // Business Logic
				 *     },
				 *     'state/valid': function(validEvent){
				 *         // Business Logic
				 *     }
				 * } );
				 *
				 * // Can use wildcards
				 * myComponent.on('action/*', function(actionEvent){
				 *     // Logic for all actions on the component
				 * } );
				 */
				on: function on( eventType, callback ){
					//#ie8-friendly - since this.enabled is a read-only property that uses defineProperty
					//it is replaced with an equivalent as used inside the this.enabled getter function
					if( is.defined( this.input ) ){

						//Prepend the name of the current component
						//Dev's format is "action/submit"
						//Internal format is "auth/action/submit"
						if( !is.string( eventType ) && is.object( eventType ) ){
							obj.map( eventType, function( v, k ){
								var parts = k.split( '/' );
								// parts.unshift( this.type );
								// parts.unshift( this.name || '*' );
								var newkey = parts.join( '/' );
								eventType[ newkey ] = v;
								delete eventType[ k ];
							} , this );
						} else {
							// var parts = eventType.split('/');
							// parts.unshift( this.name );
							// parts.unshift( this.name || '*' );
							// eventType = parts.join('/');
						}

						this.eventUnlisteners.push( this.input.on( eventType, callback ) );
					} else {
						// Collect listeners
						is.defined( this.listeners[ eventType ] ) || ( this.listeners[ eventType ] = new Set() );
						!this.listeners[ eventType ].has( callback ) && this.listeners[ eventType ].add( callback );
					}
				}
			};
		} );

	Bridge.create = function( spec, view, prototype ){
		is.undefined( prototype ) && ( prototype = Object.create( null ) );
		prototype.spec = spec;
		prototype.view = view;

		return declare( Bridge, prototype );
	};

	// Must hand-write a deep copy of spec.data because extend will copy references to
	// nested objects, causing data to leak from one spec to another
	function copyData( dataOriginal ){
		var dataCopy = {};

		if ( is.plainObject( dataOriginal ) ){
			Object.keys( dataOriginal ).forEach( function( topKey ){
				if ( is.plainObject( dataOriginal[ topKey ] ) ){
					dataCopy[ topKey ] = {};
					Object.keys( dataOriginal[ topKey ] ).forEach( function( secondKey ){
						if ( is.plainObject( dataOriginal[ topKey ][ secondKey ] ) ){
							dataCopy[ topKey ][ secondKey ] = {};
							Object.keys( dataOriginal[ topKey ][ secondKey ] ).forEach( function( thirdKey ){
								dataCopy[ topKey ][ secondKey ][ thirdKey ] = dataOriginal[ topKey ][ secondKey ][ thirdKey ];
							} );
						} else {
							dataCopy[ topKey ][ secondKey ] = dataOriginal[ topKey ][ secondKey ];
						}
					} );
				} else {
					dataCopy[ topKey ] = dataOriginal[ topKey ];
				}
			} );
		} else {
			dataCopy = dataOriginal;
		}

		return dataCopy;
	}

	return Bridge;
} );
