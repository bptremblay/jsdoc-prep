define([],
  /**
   * @exports js/Calculator
   */
  function () {
    /**
     * @constructor
     */
    function Calculator() {}
    /**
     * @param {Number} a
     * @param {Number} b
     * @return {Number} The sum of a and b.
     */
    Calculator.prototype.add = function (a, b) {
      return (a + b);
    };
    /**
     * @param {Number} a
     * @param {Number} b
     * @return {Number} The difference of a minus b.
     */
    Calculator.prototype.subtract = function (a, b) {
      return (a - b);
    };
    /**
     * @param {Number} a
     * @param {Number} b
     * @return {Number} The product of a * b.
     */
    Calculator.prototype.multiply = function (a, b) {
      return (a * b);
    };
    /**
     * @param {Number} a
     * @param {Number} b
     * @return {Number} The quotient of a / b.
     */
    Calculator.prototype.divide = function (a, b) {
      var result = (a / b);
      if (result === Infinity) {
        result = NaN;
      }
      return result;
    };
    return Calculator;
  });