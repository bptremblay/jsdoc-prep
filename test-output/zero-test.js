define('zero-test', [],
  /**
* @exports zero-test

*/
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
     * @return {Boolean}
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
     * @return {Object} ??
     */
    function zoopsaNumericExpression(z) {
      return 1 / 2;
    }
    /**
     * Zoopsa private expression.
     * @param z
     * @todo Please describe the return type of this method.
     * @return {Object} ??
     */
    function zoopsaPrivateExpression(z) {
      var zzz = "I can't get this type.";
      return zzz;
    }
    /**
     * @param z
     * @return A numeric mambo.
     */
    function zoopsax(z) {
      return 1 / 2;
    }
    /**
     * Stupid function.
     * @todo Please describe the return type of this method.
     * @return {Object} ??
     */
    function stupidFunction() {
      // some stupid line comment
      var output = 100;
      output++;
      return output;
    }
    /**
     * @private
     * @param z
     * @return {String}
     */
    function funkyFoo(z) {
      return "roger that";
    }
    /**
     * @protected
     * @param z
     * @return {String}
     */
    function funkyFood(z) {
      return "roger that";
    }
    /**
     * @public
     * @param z
     * @return {String}
     */
    function funkyFoodle(z) {
      return "roger that";
    }
    var is = require('./is', function() {
      return is.Funky(this);
    });
    var was = require('./was', function() {
      return was.Funky(this);
    });
    var willBe = require('./willBe');
    return false;
  });