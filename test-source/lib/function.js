import $ from './jquery';
const FunctionUtils = {
  DEBUGLEVELS: {
    verbose: 3,
    managers: 2,
    editors: 1,
    'true': 0
  },
  /**
   * @param {Object}
   * @param prefix
   * @param privacyLevel
   * @param isLogArgs
   */
  logCalls: function(object, prefix, privacyLevel, isLogArgs) {
    let debugLevel = this.DEBUGLEVELS[Galileo.params.debug];
    if (!(privacyLevel <= debugLevel)) {
      return;
    }
    if (typeof prefix === 'function') {
      prefix = prefix();
    }
    prefix = prefix ? `${prefix}: ` : '';
    let privateFunc = /^_/;
    /**
     * @param func
     * @param args
     */
    let wrapperFn = function(func, args) {
      if (isLogArgs) {
        console.log(`${prefix}${func.methodName}`, args);
      } else {
        console.log(`${prefix}${func.methodName}`);
      }
      return func.apply(object, [args]);
    };
    return (() => {
      let result = [];
      for (let methodName in object) {
        let method = object[methodName];
        let item;
        if (typeof method === 'function') {
          if (privateFunc.test(methodName) && (debugLevel < 3)) {
            continue;
          }
          method.methodName = methodName;
          item = object[methodName] = this.wrap(method, wrapperFn);
        }
        result.push(item);
      }
      return result;
    })();
  },
  /**
   * @param func
   * @param wrapper
   * @return {Function}
   */
  wrap: function(func, wrapper) {
    return function() {
      let args = [func].concat(Array.prototype.slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  },
  /**
   * @param func
   * @param wait
   * @return {Function}
   */
  debounce: function(func, wait) {
    let timeout = null;
    return function() {
      let context = this;
      let args = arguments;
      let later = function() {
        timeout = null;
        return func.apply(context, args);
      };
      clearTimeout(timeout);
      return timeout = setTimeout(later, wait);
    };
  },
  /**
   * @param func
   * @param wait
   * @return {Function}
   */
  throttle: function(func, wait) {
    let context = undefined;
    let args = undefined;
    let timeout = undefined;
    let throttling = undefined;
    let more = undefined;
    let whenDone = this.debounce(() => more = (throttling = false), wait);
    return function() {
      context = this;
      args = arguments;
      /**
       * @function
       */
      let later = function() {
        timeout = null;
        if (more) {
          func.apply(context, args);
        }
        return whenDone();
      };
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (throttling) {
        more = true;
      } else {
        func.apply(context, args);
      }
      whenDone();
      return throttling = true;
    };
  }
};
export default FunctionUtils;
