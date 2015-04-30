(function() {
  var instance = null;
  window.YUI = function() {
    function YUIImpl() {
      this.modules = {};
      window.YUI_config = window.YUI_config != null ? window.YUI_config : {};
      window.YUI_config.app = window.YUI_config.app
        != null ? window.YUI_config.app : {};
      window.YUI_config.app.store_url = 'http://wayfaircom.csnzoo.com';
    }

    YUIImpl.prototype = {
      add: function(moduleName, handler) {
        this.modules[moduleName] = handler(this);
        define(moduleName, [], handler);
        return this.modules[moduleName];
      },
      use: function(moduleName) {
        return this.modules[moduleName];
      }
    };

    function getInstance() {
      if (instance === null) {
        instance = new YUIImpl();
      }
      return instance;
    }

    return getInstance();
  };
}());
