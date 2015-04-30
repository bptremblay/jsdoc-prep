define(['Calculator'],
  /**
   * @exports ScientificCalculator
   */
  function (Calculator) {
	
    ScientificCalculator.prototype = new Calculator();
    /**
     * @constructor
     * @augments module:Calculator~Calculator
     */
    function ScientificCalculator() {}
    /**
     * @param {Number} a
     * @return {Number} Sine of a.
     */
    ScientificCalculator.prototype.sin = function (a) {
      // expect( calculator.sin( Math.PI / 2 ) ).to.equal( 1 );
      return Math.sin(a);
    };
    /**
     * @param {Number} a
     * @return {Number} Cosine of a.
     */
    ScientificCalculator.prototype.cos = function (a) {
      // expect( calculator.cos( Math.PI ) ).to.equal( -1 );
      return Math.cos(a);
    };
    /**
     * @param {Number} a
     * @return {Number} Tangent of a.
     */
    ScientificCalculator.prototype.tan = function (a) {
      // expect( calculator.tan( 0 ) ).to.equal( 0 );
      return Math.tan(a);
    };
    /**
     * @param {Number} a
     * @return {Number} Log of a.
     */
    ScientificCalculator.prototype.log = function (a) {
      // expect( calculator.log( 1 ) ).to.equal( 0 );
      return Math.log(a);
    };
    return ScientificCalculator;
  });