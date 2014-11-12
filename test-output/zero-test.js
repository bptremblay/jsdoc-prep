/**
 * @module zero-test
 * @requires pruna
 */
(function() {
  // do something jqueryish
}());
// one-line comment at top
define('zero-test', [],
  /**
   * @exports zero-test
   * @requires ./is
   * @requires ./was
   * @requires ./willBe
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
     * @return {object} ??
     */
    function zoopsaNumericExpression(z) {
      return 1 / 2;
    }
    /**
     * Zoopsa private expression.
     * @param z
     * @todo Please describe the return type of this method.
     * @return {object} ??
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
     * @return {object} ??
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
     *
     * @param z
     * @return {string}
     */
    function funkyFoo(z) {
      return "roger that";
    }
    /**
     * @protected
     * @param z
     * @return {string}
     */
    function funkyFood(z) {
      return "roger that";
    }
    /**
     * @public
     * @param z
     * @return {string}
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
    /**
     * @function
     * @param {Boolean} [isolate] Whether or not to isolate the child context from the parent context.
     * @param {Boolean} [isolate] Whether or not to isolate the child context from the parent context.
     * @return {Context} The child context.
     */
    function newChild(isolate) {
      new Context();
    }
    /**
     * @function
     * @param {Boolean} Whether or not to isolate the child context from the parent context.
     * @param {Boolean} Whether or not to isolate the child context from the parent context.
     * @return {Context} The child context.
     */
    function oldChild(isolate) {
      new Context();
    }
    /**
     * @function
     * @param Whether or not to isolate the child context from the parent context.
     * @param Whether or not to isolate the child context from the parent context.
     * @return {Context} The child context.
     */
    function simple(isolate) {
      new Context();
    }
    /**
     * @param isolate Whether or not to isolate the child context from the parent context.
     * @param isolate Whether or not to isolate the child context from the parent context.
     * @return The child context.
     */
    function simpleNoFunc(isolate) {
      new Context();
    }
    return false;
  });