define(['exports', 'jquery'], function (exports, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var LegacyColorCheck = function () {
    function LegacyColorCheck() {
      _classCallCheck(this, LegacyColorCheck);
    }

    _createClass(LegacyColorCheck, [{
      key: 'usesLegacyGlobalColors',
      value: function usesLegacyGlobalColors($markup) {
        /**
         * The legacy style attribute selectors.
         * @constant Legacy style attribute selectors
         * legacyStyleAttributeSelectors
         */
        var legacyStyleAttributeSelectors = [
        // After Init Dom Node Markup
        '[data-style-background-color]', '[data-style-color]',
        // On Import Markup
        '[color]', '[background-color]'];
        /**
         * The match.
         * @type {Boolean}
         */
        var match = false;
        /**
         * selector
         */
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Array.from(legacyStyleAttributeSelectors)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var selector = _step.value;

            if ($markup.is(selector) || $markup.find(selector).length > 0) {
              match = true;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return match;
      }
    }]);

    return LegacyColorCheck;
  }();

  exports.default = new LegacyColorCheck();
});
//# sourceMappingURL=legacy-color-check.js.map
