define(['./Calculator'],
  /**
   * @exports js/ScientificCalculator
   * @requires ./Calculator
   * @requires calculator
   */
  function (Calculator) {
    // alternately use var Calculator = require('calculator');
    ScientificCalculator.prototype = new Calculator();
    /**
     * @constructor
     */
    function ScientificCalculator() {}
    /**
     * @param {Number} a
     * @return {Number} Sine of a.
     */
    Calculator.prototype.sin = function (a) {
      // expect( calculator.sin( Math.PI / 2 ) ).to.equal( 1 );
      return Math.sin(a);
    };
    /**
     * @param {Number} a
     * @return {Number} Cosine of a.
     */
    Calculator.prototype.cos = function (a) {
      // expect( calculator.cos( Math.PI ) ).to.equal( -1 );
      return Math.cos(a);
    };
    /**
     * @param {Number} a
     * @return {Number} Tangent of a.
     */
    Calculator.prototype.tan = function (a) {
      // expect( calculator.tan( 0 ) ).to.equal( 0 );
      return Math.tan(a);
    };
    /**
     * @param {Number} a
     * @return {Number} Log of a.
     */
    Calculator.prototype.log = function (a) {
      // expect( calculator.log( 1 ) ).to.equal( 0 );
      return Math.log(a);
    };
    return ScientificCalculator;
  });