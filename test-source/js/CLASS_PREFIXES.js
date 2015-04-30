/**
 * @author Jeff Rose
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module blue/object/var/CLASS_PREFIXES
 * @requires blue/object/var/VENDOR_PREFIXES
 */
define( function ClassPrefixesModule( require ){
	/**
	 * Prefixes for vendor-specific objects.
	 * @constant {Array<String>} CLASS_PREFIXES
	 */
	return require( './VENDOR_PREFIXES' ).split( ' ' );
} );
