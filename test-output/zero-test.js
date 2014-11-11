(function() {
  // do something jqueryish
}());
// one-line comment at top
define('zero-test', [],
  /** @exports zero-test */
  function() {
    'use strict';
    /**
     * Zoo.
     * @param z
     */
    function zoo(z) {
      return null;
    }
    /**
     * Zoop.
     * @param z
     * @return {boolean}
     */
    function zoop(z) {
      return false;
    }
    /**
     * Zoopsa.
     * @param z
     */
    function zoopsa(z) {
      return undefined;
    }
    /**
     * Zoopsa array.
     * @param z
     * @return {array}
     */
    function zoopsaArray(z) {
      return [];
    }
    /**
     * Zoopsa numeric expression.
     * @param z
     * @todo Please describe the return type of this method.
     */
    function zoopsaNumericExpression(z) {
      return 1 / 2;
    }
    /**
     * @param z
     * @return A numeric mambo.
     */
    function zoopsax(z) {
      return 1 / 2;
    }
    return false;
  });