define(['column-and-block-layout-editor-path/padding/parser'],
  /**
   * @exports src/padding/calculator
   * @requires column-and-block-layout-editor-path/padding/parser
   */
  function (PaddingParser) {
    /**
     * The padding calculator.
     */
    var PaddingCalculator;
    return PaddingCalculator = ( /**@lends module:src/padding/calculator~PaddingCalculator# */ function () {
      /**
       * @constructor
       * @param config
       */
      function PaddingCalculator(config) {
        this.padding = config.padding;
        this.hasContentLeft = config.hasContentLeft;
        this.hasContentRight = config.hasContentRight;
      }
      PaddingCalculator.calculate = function (config) {
        if (config == null) {
          config = {};
        }
        return new PaddingCalculator(config).calculate();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      PaddingCalculator.prototype.calculate = function () {
        return {
          left: this._getLeftPadding(),
          right: this._getRightPadding()
        };
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      PaddingCalculator.prototype._getLeftPadding = function () {
        if (this.hasContentLeft) {
          return Math.floor(this.padding.left / 2);
        } else {
          return this.padding.left;
        }
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      PaddingCalculator.prototype._getRightPadding = function () {
        if (this.hasContentRight) {
          return Math.floor(this.padding.right / 2);
        } else {
          return this.padding.right;
        }
      };
      return PaddingCalculator;
    })();
  });