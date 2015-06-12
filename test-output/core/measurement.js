/**
 * The Class Measurement.
 *
 * Some methods to enable try/catch and tracing in the Backbone and Widget
 * libraries.
 * @author btremblay
 * @version 1.0
 * @created 25-Apr-2013 3:45:15 PM
 */
define('measurement', [
  'logger',
  'jquery',
  'backbone',
  'configuration'
], function (Logger, $, Backbone, Configuration) {
  /**
   * Measurement
   * .
   * @module Measurement
   * 
   * @requires logger
   * @requires jquery
   * @requires backbone
   * @requires configuration
   * @requires underscore
   */
  var _instance = null;
  /**
   * Instantiates a new Measurement.
   * @class Measurement
   * @constructor
   * @public
   */
  function Measurement() {
    _log('Measurement file loading.');
    // initialize Measurement.
    Measurement.prototype.addJQInstrumentation = _addJQInstrumentation;
    _log('Measurement file loaded.');
  }
  /**
   * Log.
   * @method _log
   * @private
   * @param msg
   */
  function _log(msg) {
    if (window.Logger != null) {
      window.Logger.info(msg);
    }
  }
  /**
   * Attempt.
   * @param instance
   * @param name
   * @param method
   * @param args
   * @param defaultResult
   * @todo Please describe the return type of this method.
   * @return {object} ??
   */
  function _attempt(instance, name, method, args, defaultResult) {
    if (defaultResult === undefined) {
      defaultResult = null;
    }
    try {
      return method.apply(instance, args);
    } catch (ex) {
      if (window.Logger != null) {
        // Logger.error("Error: " + ex.message + "\r\n$(" +
        // instance.selector + ") handling on" + name + "()\r\n"
        // + printStackTrace({
        // e : ex
        // }).join('\n\n'));
        Logger.error('Error: ' + ex.message + '\r\n$(' + instance.selector + ') handling on' + name + '()\r\n');
      }
    }
    return defaultResult;
  }
  /**
   * Add instrumentation to jQuery.
   * @method _addJQInstrumentation
   * @private
   * @todo Please describe the return type of this method.
   * @return {object} ??
   */
  function _addJQInstrumentation() {
    // Is a given value a function?
    /**
     * Is function.
     * @param obj
     * @todo Please describe the return type of this method.
     * @return {object} ??
     */
    var isFunction = function (obj) {
      return toString.call(obj) == '[object Function]';
    };
    /* ADD INSTRUMENTATION */
    // patch forms of bind() in $
    var on = $.fn.on;
    /**
     * On.
     * @todo Please describe the return type of this method.
     * @return {object} ??
     */
    $.fn.on = function () {
      var name = arguments[0];
      var self = this;
      // filter some events?
      // if (name.indexOf("mousemove") == 0) {
      // return on.apply(self, arguments);
      // }
      var _boundHanlders = $(this).data('_boundHanlders');
      if (_boundHanlders == null) {
        _boundHanlders = {};
        $(this).data('_boundHanlders', _boundHanlders);
      }
      var whereFn = arguments.length - 1;
      var fn = arguments[whereFn];
      if (fn == null) {
        whereFn--;
        fn = arguments[whereFn];
      }
      /**
       * New fn.
       */
      var newFn = function () {
        // _log(self.selector + " handling on" + name + "()");
        _attempt(self, name, fn, arguments);
        // _log(self.selector + " DONE handling on()");
      };
      _boundHanlders[fn] = newFn;
      arguments[whereFn] = newFn;
      return on.apply(self, arguments);
    };
    // will OFF work with this hack???
    var off = $.fn.off;
    /**
     * Off.
     * @todo Please describe the return type of this method.
     * @return {object} ??
     */
    $.fn.off = function () {
      var self = this;
      try {
        var whereFn = arguments.length - 1;
        var fn = arguments[whereFn];
        if (fn == null) {
          whereFn--;
          fn = arguments[whereFn];
        }
        if (fn != null && isFunction(fn)) {
          var _boundHanlders = $(this).data('_boundHanlders');
          if (_boundHanlders == null) {
            // console.warn("Removing handler from element
            // with no
            // _boundHanlders!!");
            _boundHanlders = {};
          }
          var realFn = _boundHanlders[fn];
          arguments[whereFn] = realFn;
          _boundHanlders[fn] = null;
          delete _boundHanlders[fn];
          $(this).data('_boundHanlders', _boundHanlders);
          return off.apply(self, arguments);
        } else {
          (this).data('_boundHanlders', {});
          return off.apply(self, []);
        }
      } catch (ex) {
        if (window.Logger != null) {
          // Logger.error(printStackTrace({
          // e : ex
          // }));
          Logger.error(ex.message);
        }
      }
    };
    // patch Backbone.Events, if present
    // patch AJAX
    // patch Widget, if present
  }
  /**
   * Get instance.
   * @method _getInstance
   * @private
   * @todo Please describe the return type of this method.
   * @return {object} ??
   */
  function _getInstance() {
    if (_instance === null) {
      _instance = new Measurement();
    }
    window.Measurement = _instance;
    return _instance;
  }
  return _getInstance();
});