(function() {
  // do something jqueryish
}());
// one-line comment at top
define('zero-test', [],
  /** @exports zero-test */
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
      /**
       * Stupid function.
       * @return output
       */
      this["stupidFunction"] = function() {
        // some stupid line comment
        var output = 100;
        output++;
        return output;
      };
      /**
       * Private function.
       * @param a
       * @param b
       * @param c
       * @return {string}
       */
      var privateFunction = function(a, b, c) {
        // build the super return value
        return 'hodag zero';
      };
    }
    // try to confuse the parser with some comment
    /**
     * World puzzle.
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
     * @return {boolean}
     */
    SecondClass.prototype.fixTheWorld = function(toothache, tomato) {
      return false;
    };
    /**
     * Preamble test.
     * @param toothache
     * @param tomato
     * @return {boolean}
     */
    SecondClass.prototype.preambleTest = function(toothache, tomato) {
      return false;
    };
    /**
     * Creates a new instance of class ThirdClass.
     * @constructor
     */
    function ThirdClass() {
      this.Freenox = new Freenox();
    }

    function FourthClass() {
      this.Freenox = new Freenox();
    }
    /**
     * Creates a new instance of class FourthClass.
     * @constructor
     */
    function FourthClass() {
      this.Freenox = new Freenox();
    }
    /**
     * Some function.
     */
    FourthClass.prototype.someFunction = function() {};
    /**
     * Another function.
     */
    FourthClass.prototype.anotherFunction = function() {};
    /**
     * On.
     * @param eventType
     * @param callback
     */
    Freenox.prototype.on = function(eventType, callback) {};
    return SecondClass;
  });