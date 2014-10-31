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
     * 
     * @constructor
     */
    function Freenox() {
        /**
         * Chew bakka.
         * 
         * @todo Please describe the return type of this method.
         */
        this.chewBakka = function() {
            /**
             * Creates a new instance of class DonutView.
             * 
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
         * 
         * The function is stupid but the comment is a valid doclet. .
         * 
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
         * @param a
         * @param {Banana}
         * @param {Boolean}
         * @return {String}
         */
        var privateFunction = function(a, b, c) {
            // build the super return value
            return 'hodag zero';
        };
    }
    // try to confuse the parser with some comment
    /**
     * undefined
     * 
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
     * 
     * @constructor
     */
    function SecondClass() {
        this.Freenox = new Freenox();
    }
    /**
     * Fix the world.
     * 
     * @param toothache
     * @param tomato
     * @return {Boolean}
     */
    SecondClass.prototype.fixTheWorld = function(toothache, tomato) {
        return false;
    };
    /**
     * 
     * This is a preamble to a doclet. It might have more than one line.
     * 
     * @param toothache
     * @param tomato
     * @return {Boolean}
     */
    SecondClass.prototype.preambleTest = function(toothache, tomato) {
        return false;
    };
    /**
     * @constructor
     * @description A description tag.
     */
    function ThirdClass() {
        this.Freenox = new Freenox();
    }
    /**
     * Some text without a description.
     * 
     * @constructor
     * @description A description tag with more than one line of stuff and some
     *              of it could be very very long
     * 
     * and some of it could be after a BLANK line.
     */
    function FourthClass() {
        this.Freenox = new Freenox();
    }
    /**
     * @constructor
     * @description A description tag with more than
     * @example
     */
    function FourthClass() {
        this.Freenox = new Freenox();
    }
    /*
     * Redundant 'function' tag.
     * 
     */
    /**
     * Some function.
     */
    FourthClass.prototype.someFunction = function() {
    };
    /*
     * Redundant 'method' tag. Used more by YUIDoc.
     * 
     */
    /**
     * Another function.
     */
    FourthClass.prototype.anotherFunction = function() {
    };
    /**
     * @description Subscribe to events on the component's local Channel. Events
     *              on the
     * 
     * @example
     * @param {String|PlainObject}
     *            [eventType] The type of event.
     * @param {Function}
     *            [callback] The callback to execute when the event is
     *            published.
     */
    Freenox.prototype.on = function(eventType, callback) {
    };
    return SecondClass;
});