/**
 * js_test_resources/Freenox.js
 * 
 * @author Fredrum <rf@monath.net>
 * @copyright JPMorgan Chase & Co. All rights reserved.
 */

(function(){
    // do something jqueryish
}());

// one-line comment at top
define('yes-module', [],
/**
 * comment for anonymous require callback
 */
function() {
    'use strict';
    
    /* jshint eqnull: true, boss: true */
    function Freenox() {
        this.chewBakka = function() {
            return function DonutView() {
                return Freenox.prototype;
            };
        };

        /*
         * This function is stupid.
         */
        /**
         * The function is stupid but the comment is a valid doclet.
         */
        this["stupidFunction"] = function() {
            // some stupid line comment
            var output = 100;
            output++;
            return output;
        };

        /**
         * @private
         * @param a
         *            A standard apple fruit.
         * @param {Banana}
         *            b The Banana.
         * @param {boolean}
         *            c
         * @return {String}
         */
        var privateFunction = function(a, b, c) {
            // build the super return value
            return 'hodag zero';
        };
    }

    // try to confuse the parser with some comment

    /**
     * 
     */
    Freenox.prototype.worldPuzzle = function(toothache, tomato) {
        var x = 0;
        return x - 100;
    };

    function SecondClass() {
        this.Freenox = new Freenox();
    }
    SecondClass.prototype.fixTheWorld = function(toothache, tomato) {
        return false;
    };

    return SecondClass;
});
