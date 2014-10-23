/**
 * js_test_resources/Freenox.js
 *
 * @author Fredrum <rf@monath.net>
 * @copyright JPMorgan Chase & Co. All rights reserved.
 */
(function() {
  // do something jqueryish
}());
// one-line comment at top
define('yes-module', [],
  /**
   * comment for anonymous require callback
   */

  /**
   * @exports yes-module
   */
  function() {
    'use strict';
    /* jshint eqnull: true, boss: true */
    /**
     * Creates a new instance of class Freenox.
     * @constructor
     */
    function Freenox() {
      /**
       * Chew bakka.
       * @todo Please describe the return type of this method.
       */
      this.chewBakka = function() {
        /**
         * Creates a new instance of class DonutView.
         * @constructor
         */
        return function DonutView() {
          return Freenox.prototype;
        };
      };
      /*
       * This function is stupid.
       */
      /**
       * The function is stupid but the comment is a valid doclet.
       * @return output
       */
      this["stupidFunction"] = function() {
        // some stupid line comment
        var output = 100;
        output++;
        return output;
      };
      /**
       * @private
       * @param a  A standard apple fruit.
       * @param {Banana}  b The Banana.
       * @param {Boolean}  c
       * @return {String}
       */
      var privateFunction = function(a, b, c) {
        // build the super return value
        return 'hodag zero';
      };
    }
    // try to confuse the parser with some comment
    /**
     * @param toothache
     * @param tomato
     * @todo Please describe the return type of this method.
     */
    Freenox.prototype.worldPuzzle = function(toothache, tomato) {
      var x = 0;
      return x - 100;
    };
    /**
     * Creates a new instance of class SecondClass.
     * @constructor
     */
    function SecondClass() {
      this.Freenox = new Freenox();
    }
    /**
     * Fix the world.
     * @param toothache
     * @param tomato
     * @return {Boolean}
     */
    SecondClass.prototype.fixTheWorld = function(toothache, tomato) {
      return false;
    };
    return SecondClass;
  });