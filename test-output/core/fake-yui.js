(function () {
  var instance = null;
  /**
   * Y u i.
   * @todo Please describe the return type of this method.
   * @return {object} ??
   */
  window.YUI = function () {
    /**
     * Y u i impl.
     */
    function YUIImpl() {
      this.modules = {};
      window.YUI_config = window.YUI_config != null ? window.YUI_config : {};
      window.YUI_config.app = window.YUI_config.app != null ? window.YUI_config.app : {};
      window.YUI_config.app.store_url = 'http://wayfaircom.csnzoo.com';
    }
    YUIImpl.prototype = {
      /**
       * Add.
       * @param moduleName
       * @param handler
       * @todo Please describe the return type of this method.
       * @return {object} ??
       */
      add: function (moduleName, handler) {
        this.modules[moduleName] = handler(this);
        define(moduleName, [], handler);
        return this.modules[moduleName];
      },
      /**
       * Use.
       * @param moduleName
       * @todo Please describe the return type of this method.
       * @return {object} ??
       */
      use: function (moduleName) {
        return this.modules[moduleName];
      }
    };
    /**
     * Get instance.
     * @todo Please describe the return type of this method.
     * @return {object} ??
     */
    function getInstance() {
      if (instance === null) {
        instance = new YUIImpl();
      }
      return instance;
    }
    return getInstance();
  };
}());