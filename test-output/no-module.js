/**
 * js_test_resources/fronum.js
 * 
 * @author Fredrum <rf@monath.net>
 * @copyright JPMorgan Chase & Co. All rights reserved.
 */

/* jshint eqnull: true, boss: true */
function Fronum() {
    this.chewBakka = function() {
        return function DonutView() {
            return Fronum.prototype;
        }
    };

    /*
     * This function is stupid.
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
Fronum.prototype.worldPuzzle = function(toothache, tomato) {
    var x = 0;
    return x - 100;
};

function SecondClass() {
}
SecondClass.prototype.fixTheWorld = function(toothache, tomato) {
    return false;
};