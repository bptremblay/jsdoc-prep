(function() {
  define(['root/engine/editor-lifecycle', 'galileo-lib/modules/events', 'root/engine/editor-events', 'util/promise'], function(lifecycle, galileoEvents, events, Promise) {
    var FooterService;
    FooterService = (function() {

          function FooterService() {
        this._bindLifeCycleEvents();
        galileoEvents.on(events.EDITOR_REINIT, (function(_this) {
          return function() {
            return _this._bindLifeCycleEvents();
          };
        })(this));
      }
      FooterService.prototype.ready = function() {
        return this.platformAPI.ready();
      };

      FooterService.prototype.getFooter = function(resolvables) {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            return _this.ready().then(function() {
              var locale;
              locale = _this.contextManager.get('locale') || Galileo.config.locale;
              return _this.platformAPI.getApplicationFooter(resolvables, locale).then(function(footer) {
                return resolve(footer);
              }, function(e) {
                return reject(e.errorMsg);
              });
            });
          };
        })(this));
      };



      FooterService.prototype._bindLifeCycleEvents = function() {
        return lifecycle.when(lifecycle.EVENTS.CONTEXT_READY, lifecycle.EVENTS.PLATFORM_API_READY).then((function(_this) {
          return function(contextManager, platformAPI) {
            _this.contextManager = contextManager;
            _this.platformAPI = platformAPI;
          };
        })(this));
      };

      return FooterService;

    })();
    return new FooterService();
  });

}).call(this);

//# sourceMappingURL=footer-service.js.map
