/**
 * The Class Configuration. Simple utility for creating name spaces.
 *
 * @author btremblay
 * @version 1.0
 * @created 25-Apr-2013 3:45:14 PM
 */
define('configuration', [], function () {
  //
  var instance = null;
  var wf = window.wf != null ? window.wf : {};
  var devMode = false;
  var devModeSet = false;
  var Logger = null;
  /**
   * Is dev mode.
   * @private
   * @method
   * @return {Boolean} if dev mode is true.
   */
  function isDevMode() {
    if (!devModeSet) {
      var loc = window.location.toString();
      devMode = (loc.indexOf('127.0.0.1') != -1) || (loc.indexOf('csnzoo') != -1);
      devModeSet = true;
    }
    return devMode;
  }
  /**
   * Configuration Singleton
   *
   * @module Configuration
   */
  var Configuration = {
    /**
     * namespace
     * .
     * @public
     * @method
     * @param {Array} arguments  
     * @return {Object} reference to wf namespace object
     */
    namespace: function () {
      if (wf == null) {
        wf = window.wf;
      }
      if (wf == null) {
        wf = {};
      }
      if (wf.Logger != null) {
        Logger = wf.Logger;
      }
      var a = arguments;
      var names, obj, i, n;
      for (i = 0; i < arguments.length; ++i) {
        names = arguments[i].split('.');
        obj = wf;
        for (n = (names[0] == 'wf') ? 1 : 0; n < names.length; ++n) {
          obj[names[n]] = obj[names[n]] || {};
          obj = obj[names[n]];
        }
      }
      return obj;
    },
    /**
     * init
     * .
     * @public
     * @method
     */
    init: function () {
      var runtime = this.namespace('runtime');
      runtime.devMode = isDevMode();
      if (Logger != null) {
        Logger.enabled = devMode;
        runtime.logger = Logger;
        Logger.info('Is dev mode? ' + devMode);
      }
      if (window.YUI != null) {
        var localYui = this.namespace('legacy');
        localYui.YUI = window.YUI;
      }
    }
  };
  /**
   * Get instance.
   * @method getInstance
   * @private
   * @return {Configuration}
   */
  function getInstance() {
    if (instance === null) {
      instance = Configuration;
    }
    Configuration.init();
    //window.wfnamespace = instance;
    wf.namespace = instance.namespace;
    window.wf = wf;
    return instance;
  }
  return getInstance();
});