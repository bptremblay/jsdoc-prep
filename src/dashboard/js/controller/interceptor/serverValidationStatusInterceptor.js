/**
 * Original file: blue/js/service/interceptor/status.js @author Aaron Brown
 * Modified by Tony Chiu for Payments
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module digital-ui/src/dashboard/js/controller/interceptor/serverValidationStatusInterceptor.js
 * @classdesc
 * React to service response according to status code and associated callbacks provided in settings.
 *
 * [Modified to inspect if it contains a server status code. If it an mapped/expected server validation
 * response, it will forward to the reject() handling of the service call]
 *
 * [set in service settings var: markAsSuccess if you are using this interceptor but want it to go back to success block even with a statusCode response]
 *
 * Redirection is handled automatically for up to 3 redirect responses. Any further redirects will
 * execute the error response handler. To disable the redirect handler, add this to the service
 * request settings:
 * * redirect: false
 *
 * Some options can be defined in the service request "settings" object to configure behavior of the interceptor:
 * * handleSuccess: function( data ){ return data; }
 * * handleError: function( response ){ // do whatever is needed }
 * * handleStatus: {
 * 						'500': function( response ){ // do whatever },
 * 						'404': function( response ){ // do whatever },
 * 						// etc.
 *                 }
 *
 * In case of a success response from the server, the interceptor will first look for "handleSuccess"
 * in settings. If not found, it will look for "handleStatus[ '200' ]". If that is not found, the
 * server data is passed through untouched.
 *
 * The handleSuccess callback takes response data as an argument and should return data. The return
 * value is what is provided back to the original service request code.
 *
 * The handleError and handleStatus callbacks take the full server response as an argument and do
 * not return any values. Once the callback has completed executing, the service request promise will
 * be rejected, allowing any "catch" blocks in the app code to execute.
 *
 * If both "handleError" and the specific code handler are defined, both will execute. The generic
 * "handleError" will execute first, followed by "handleStatus[ 'xxx' ]".
 *
 * Remember that a redirect status code counts as an error. In the case of a chain of redirects longer
 * than three, the error handler will execute with that redirect status code.
 */
define( function( require ){

	var logger = new ( require( 'blue/log' ) )( '[serverValidationStatusInterceptor]' ),
		http = require( 'blue/http' ),
		is = require( 'blue/is' );

	return {
		around: function serverValidationStatusInterceptor( joinpoint ){
			var settings = joinpoint.args[ 0 ],
				resultPromise,
				result;

			resultPromise = new Promise( function( resolve, reject ){
				result = joinpoint.proceed();
				result.then( function( data ){
					if ( settings.handleSuccess && is.function( settings.handleSuccess ) ){
						resolve( settings.handleSuccess( data ) );
					}
					else if ( settings.handleStatus && settings.handleStatus[ '200' ] && is.function( settings.handleStatus[ '200' ] ) ){
						resolve( settings.handleStatus[ '200' ]( data ) );
					}
					else {
						// added this following block
						// if there is a 'settings.statusCodeField' return from DPS service
						// it would send it back/execute to the reject block of the service call
						if ( settings.statusCodeField && data[settings.statusCodeField] )
						{
							logger.info( '********serverValidationStatusInterceptor()**********  data.'+settings.statusCodeField+'=',  data[settings.statusCodeField]);
							if ( settings.handleServerSideValidation && is.function( settings.handleServerSideValidation ) ){
								settings.handleServerSideValidation( data );
								if ( data.markAsSuccess ) // set this variable (in service settings) if scenario need to go back to success block
								{
									resolve( data );
								}
								else { //normal flow
									reject( data );
								}
							}
							else {
								reject( data );
							}
						}
						else {
							resolve( data );
						}
					}
				} )
				.catch( function( response ){
					var responseStatus = toNumber( response.status );

					if ( isRedirectStatus( responseStatus ) && settings.redirect ){
						handleRedirect( resolve, reject, settings, response );
					}
					else {
						handleError( resolve, reject, settings, response );
					}
				} );
			} );

			return resultPromise;

			// result.then( function( data ){
			// 	// logging.warn( 'service interceptor result data:', data );
			// } )

			// return result;
		}
	};

	function isRedirectStatus( status ){
		return ( status === 300 ||
				 status === 301 ||
				 status === 302 ||
				 status === 303 ||
				 status === 305 ||
				 status === 306 ||
				 status === 307 );
	}

	// Follow at most 3 redirects before giving up.
	function handleRedirect( resolve, reject, settings, response ){
		var location,
			result2, result3, result4;

		location = response.getResponseHeader( 'Location' );
		settings.url = location;
		result2 = http.request( settings )
			.then( function( data ){
				// TODO: Handle success!
				resolve( data );
			} )
			.catch( function( response2 ){
				var responseStatus2 = toNumber( response2.status );

				if ( isRedirectStatus( responseStatus2 ) ){
					result3 = http.request( settings )
						.then( function( data ){
							resolve( data );
						} )
						.catch( function( response3 ){
							var responseStatus3 = toNumber( response3.status );

							if ( isRedirectStatus( responseStatus3 ) ){
								result4 = http.request( settings )
									.then( function( data ){
										resolve( data );
									} )
									.catch( function( denied ){
										handleError( resolve, reject, settings, denied );
									} ); // result4 = http.request().catch
							}
							else {
								handleError( resolve, reject, settings, denied );
							}

						} ); // result3 = http.request().catch
				}
				else {
					handleError( resolve, reject, settings, denied );
				}

			} ); // result2 = http.request().catch
	}

	function handleSuccess( resolve, reject, settings, response, data ){
		var status = toNumber( response.status ),
			newData;

		if ( settings.handleStatus &&  settings.handleStatus[ toString( status ) ] && is.function( settings.handleStatus[ toString( status ) ] ) ){
			newData = settings.handleStatus[ toString( status ) ].call( response, data, response );
			if ( typeof newData === 'undefined' ){
				resolve( data );
			}
			else {
				resolve( newData );
			}
		}
	}

	function handleError( resolve, reject, settings, response ){
		var status = toNumber( response.status );

		logger.info( 'Service response from URL ' + settings.url + ' contained non-success status: ', status )
		if ( settings.handleError && is.function( settings.handleError ) ){
			settings.handleError.call( response, response );
			reject( response );
		}

		if ( settings.handleStatus &&  settings.handleStatus[ toString( status ) ] && is.function( settings.handleStatus[ toString( status ) ] ) ){
			settings.handleStatus[ toString( status ) ].call( response, response );
			reject( response );
		}
	}

	function toNumber( val ){
		return val * 1;
	}

	function toString( val ){
		return val + '';
	}

} );

