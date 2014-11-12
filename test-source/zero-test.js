
(function() {
    // do something jqueryish
}());

// one-line comment at top
define('zero-test', [],
/** @exports zero-test */
function() {
    'use strict';

    /* jshint eqnull: true, boss: true */
    function Freenox() {
        this.chewBakka = function() {
            return function DonutView() {
                return Freenox.prototype;
            };
        };

        
        this["stupidFunction"] = function() {
            // some stupid line comment
            var output = 100;
            output++;
            return output;
        };


        var privateFunction = function(a, b, c) {
            // build the super return value
            return 'hodag zero';
        };
    }

    // try to confuse the parser with some comment

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


    SecondClass.prototype.preambleTest = function(toothache, tomato) {
        return false;
    };

    function ThirdClass() {
        this.Freenox = new Freenox();
    }


    function FourthClass() {
        this.Freenox = new Freenox();
    }

    function FourthClass() {
        this.Freenox = new Freenox();
    }


    FourthClass.prototype.someFunction = function() {

    };


    FourthClass.prototype.anotherFunction = function() {

    };

    Freenox.prototype.on = function(eventType, callback) {

    };

    return SecondClass;
});
