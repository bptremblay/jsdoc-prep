// Generated by CoffeeScript 1.10.0
define(['underscore'], function(_) {
  var DEFAULT_PRECISION;
  DEFAULT_PRECISION = 2;
  return {
    sumArray: function(array) {
      return array.reduce((function(sum, val) {
        return sum + val;
      }), 0);
    },
    reducesToOne: function(array) {
      return this.sumArray(array) === 1;
    },
    remainingDecimal: function(array, precision) {
      if (precision == null) {
        precision = DEFAULT_PRECISION;
      }
      return this.truncateDecimal(1 - this.sumArray(array), precision);
    },
    evenlySplit: function(quantity, precision) {
      var arrayOfDecimals, decimal;
      if (precision == null) {
        precision = DEFAULT_PRECISION;
      }
      decimal = 1 / quantity;
      arrayOfDecimals = _(quantity).times(function() {
        return decimal;
      });
      return this.truncateRoundAndReturn(arrayOfDecimals, precision);
    },
    truncateDecimal: function(decimal, precision) {
      if (precision == null) {
        precision = DEFAULT_PRECISION;
      }
      return +decimal.toFixed(precision);
    },
    adjustValues: function(params) {
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
    truncateRoundAndReturn: function(arrayOfDecimals, precision) {
      var truncatedDecimals;
      if (precision == null) {
        precision = DEFAULT_PRECISION;
      }
      truncatedDecimals = arrayOfDecimals.map((function(_this) {
        return function(decimal) {
          return _this.truncateDecimal(decimal, precision);
        };
      })(this));
      truncatedDecimals[0] += this.remainingDecimal(truncatedDecimals);
      return truncatedDecimals;
    }
  };
});