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
         */
function() {
    'use strict';
    
    function zoo(z){
        return null;
    }
    function zoop(z){
        return false;
    }
    function zoopsa(z){
        return undefined;
    }
    
    function zoopsaArray(z){
        return [];
    }
    
    function zoopsaNumericExpression(z){
        return 1/2;
    }
    
    function zoopsaPrivateExpression(z){
        var zzz = "I can't get this type.";
        return zzz;
    }
    
    /**
     * @return A numeric mambo.
     */
    function zoopsax(z){
        return 1/2;
    }

    function stupidFunction() {
        // some stupid line comment
        var output = 100;
        output++;
        return output;
    }
    
    
    /**
     * @private
     * @param z
     */
    function funkyFoo(z){
        return "roger that";
    }
    
    /**
     * @protected
     */
    function funkyFood(z){
        return "roger that";
    }
    
    /**
     * @public
     */
    function funkyFoodle(z){
        return "roger that";
    }
    
    var is = require('./is', function(){
        return is.Funky(this);
    });
    
    var was = require('./was', function(){
        return was.Funky(this);
    });
    
    var willBe = require('./willBe');

    /**
     * @function
     * @param {Boolean} [isolate] Whether or not to isolate the child context from the parent context.
     * @return {Context} The child context.
     */
    function newChild( isolate ){
        new Context();
    }
    
    /**
     * @function
     * @param {Boolean} Whether or not to isolate the child context from the parent context.
     * @return {Context} The child context.
     */
    function oldChild( isolate ){
        new Context();
    }
    
    /**
     * @function
     * @param Whether or not to isolate the child context from the parent context.
     * @return {Context} The child context.
     */
    function simple( isolate ){
        new Context();
    }
    
    /**
     * @param isolate Whether or not to isolate the child context from the parent context.
     * @return The child context.
     */
    function simpleNoFunc( isolate ){
        new Context();
    }

    return false;
});
