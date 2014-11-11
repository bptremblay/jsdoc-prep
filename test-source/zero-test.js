
(function() {
    // do something jqueryish
}());

// one-line comment at top
define('zero-test', [],
/** @exports zero-test */
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

    return false;
});
