define( function( require ){
	var
		is      = require( '../is' ),
		logger  = require( '../log' )( '[app]' ),
		types   = require( './types' )
	;

	return require( '../declare' )( /** @lends module:blue/validate/validator# */ {
		constructor: function Validator( constraints ){
			this.constraints = new Map();

			this.register( constraints );
		},

		register: function( constraints ){
			if( is.defined( constraints ) ){
				Object.keys( constraints ).forEach( function( constraintType ){
					this.constraints.set( constraintType, constraints[ constraintType ] );
				}, this );
			}
		},

		validate: function( value, type, params ){
			var results;

			// Validate if we have a constraint of the provided type
			if( this.constraints.has( type ) ){
				var constraint = this.constraints.get( type );
				results = constraint.validate( value, params );

			// Otherwise return that the value is valid
			} else {
				// Warn about it returning true by default
				logger.warn('Spec data type "'+type+'", does not exist. Please request its addition, if none of the following suffices:', Object.keys(types));

				// The knowledge of producing the results package
				// should probably be in Constraint
				results = {
					value: value,
					isValid: true,
					validationParams: params,
					failedConstraints: []
				};
			}

			return results;
		}
	} );
} );
