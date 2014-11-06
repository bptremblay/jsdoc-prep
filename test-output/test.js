define('yes-module', [],
  /**
   * comment for anonymous require callback
   */

  /**
   * @exports test
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
    /**
     * This is a preamble to a doclet.
     *  It might have more than one line.
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
     *
     */
    function ThirdClass() {
      this.Freenox = new Freenox();
    }
    /**
     * Some text without a description.
     * @constructor
     * @description A description tag with more than
     * one line of stuff
     * and some of it could be very very long
     *
     * and some of it could be after a BLANK line.
     */
    function FourthClass() {
      this.Freenox = new Freenox();
    }
    /**
     * @constructor
     * @description A description tag with more than
     *  one line of stuff
     *  and some of it could be very very long
     *
     *  and some of it could be after a BLANK line.
     * @example
     *  //This is sample code!
     *  var ft = new FourthClass();
     *  //Note we are using a zero-arg constructor.
     *
     */
    function FourthClass() {
      this.Freenox = new Freenox();
    }
    /**
* Redundant 'function' tag.

*/
    FourthClass.prototype.someFunction = function() {};
    /**
* Redundant 'method' tag. Used more by YUIDoc.

*/
    FourthClass.prototype.anotherFunction = function() {};
    /**
* @description Subscribe to events on the component's local Channel. Events on the
*               local channel are not visible to other components or the main
*               ComponentChannel.

* @example
*  // Execute callback for ALL events on the component (no eventType given)
*  myComponent.on(function(event){
*      // Analyze, log, etc the event
*  });
*
*  // Execute callback for a component-generated event
*  // Format of eventType is ACTION/VALUE
*  // ACTION - function call, state change, etc on the component
*  // VALUE - name of action, property name, etc.
*
*  // Note: TARGET is automatically prepended to the eventType and
*  //       is equal to the name of the component as defined in the spec
*  myComponent.on('action/submit', function(event){
*      // Execute logic for the submit action on the component
*  });
*
*  // Subscribe to multiple events
*  myComponent.on( {
*      'action/submit': function(submitEvent){
*          // Business Logic
*      },
*      'state/enabled': function(enabledEvent){
*          // Business Logic
*      },
*      'action/requestBalance': function(requestEvent){
*          // Business Logic
*      },
*      'state/valid': function(validEvent){
*          // Business Logic
*      }
*  } );
*
*  // Can use wildcards
*  myComponent.on('action/*', function(actionEvent){
*      // Logic for all actions on the component
*  } );
*
* @param {String|PlainObject} [eventType] The type of event.
* @param {Function} [callback] The callback to execute when the event is published.
*/
    Freenox.prototype.on = function(eventType, callback) {};
    return SecondClass;
  });