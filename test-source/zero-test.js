
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
    
    /**
     * @return A numeric mambo.
     */
    function zoopsax(z){
        return 1/2;
    }


    return false;
});
