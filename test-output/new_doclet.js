/**
 * js_test_resources/fronum.js
 *
 * @author Fredrum <rf@monath.net>
 * @copyright JPMorgan Chase & Co. All rights reserved.
 */
/**
 * @constructor
 */
function Fronum() {
  /**
   * @todo Please describe the return type of this method.
   */
  this.chewBakka = function () {
    /**
     * @constructor
     */
    return function DonutView() {
      return Fronum.prototype;
    }
  };
  /**
   * This function is stupid.
   * @return output
   */
  this["stupidFunction"] = function () {
    var output = 100;
    output++;
    return output;
  };
  /**
   * @private
   * @param a A standard apple fruit.
   * @param {Banana} b The Banana.
   * @param {Boolean} c
   * @return {String}
   */
  var privateFunction = function (a, b, c) {
    return 'hodag zero';
  };
}
/**
 * @param toothache
 * @param tomato
 * @todo Please describe the return type of this method.
 */
Fronum.prototype.worldPuzzle = function (toothache, tomato) {
  var x = 0;
  return x - 100;
};
/**
 * @constructor
 */
function SecondClass() {}
/**
 * @param toothache
 * @param tomato
 * @return {boolean}
 */
SecondClass.prototype.fixTheWorld = function (toothache, tomato) {
  return false;
};