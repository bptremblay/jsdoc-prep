define(['underscore'],
  /**
   * @exports src/percentage-utils
   * @requires underscore
   */
  function (_) {
    /**
     * The default precision.
     */
    var DEFAULT_PRECISION;
    DEFAULT_PRECISION = 2;
    return /**@alias module:src/percentage-utils */ {
      /**
       * @param array
       */
      sumArray: function (array) {
        return array.reduce((function (sum, val) {
          return sum + val;
        }), 0);
      },
      /**
       * @param array
       */
      reducesToOne: function (array) {
        return this.sumArray(array) === 1;
      },
      /**
       * @param array
       * @param precision
       */
      remainingDecimal: function (array, precision) {
        if (precision == null) {
          precision = DEFAULT_PRECISION;
        }
        return this.truncateDecimal(1 - this.sumArray(array), precision);
      },
      /**
       * @param quantity
       * @param precision
       */
      evenlySplit: function (quantity, precision) {
        /**
         * The array of decimals.
         */
        var arrayOfDecimals, decimal;
        if (precision == null) {
          precision = DEFAULT_PRECISION;
        }
        decimal = 1 / quantity;
        arrayOfDecimals = _(quantity).times(function () {
          return decimal;
        });
        return this.truncateRoundAndReturn(arrayOfDecimals, precision);
      },
      /**
       * @param decimal
       * @param precision
       * @return {Object} UnaryExpression
       */
      truncateDecimal: function (decimal, precision) {
        if (precision == null) {
          precision = DEFAULT_PRECISION;
        }
        return +decimal.toFixed(precision);
      },
      /**
       * @param params
       */
      adjustValues: function (params) {
        /**
         * The array of decimals.
         */
        var arrayOfDecimals;
        if (params == null) {
          params = {};
        }
        _(params).defaults({
          precsion: DEFAULT_PRECISION
        });
        arrayOfDecimals = params.arrayOfDecimals.slice();
        arrayOfDecimals[params.addTo] += params.delta;
        arrayOfDecimals[params.subtractFrom] -= params.delta;
        return this.truncateRoundAndReturn(arrayOfDecimals, params.precision);
      },
      /**
       * @param arrayOfDecimals
       * @param precision
       * @return {Function}
       */
      truncateRoundAndReturn: function (arrayOfDecimals, precision) {
        /**
         * The truncated decimals.
         */
        var truncatedDecimals;
        if (precision == null) {
          precision = DEFAULT_PRECISION;
        }
        truncatedDecimals = arrayOfDecimals.map((function (_this) {
          return function (decimal) {
            return _this.truncateDecimal(decimal, precision);
          };
        })(this));
        truncatedDecimals[0] += this.remainingDecimal(truncatedDecimals);
        return truncatedDecimals;
      }
    };
  });