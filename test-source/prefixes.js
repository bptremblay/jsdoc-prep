/**
 * @module brown/object/var/CLASS_PREFIXES
 * @requires brown/object/var/VENDOR_PREFIXES
 */
define( function ClassPrefixesModule( require ){
  /**
   * Prefixes for vendor-specific objects.
   * @constant {Array<String>} CLASS_PREFIXES
   */
  return require( './VENDOR_PREFIXES' ).split( ' ' );
} );
