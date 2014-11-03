define(
  /**
   * @exports js/controller/passwordReset
   */
  function(require) {
    /**
     * Creates a new instance of class LogonPasswordResetController.
     * @constructor
     */
    return function LogonPasswordResetController() {
      var observable = require('blue/observable'),
        logonPasswordResetSpec = require('bluespec/logon_password_reset'),
        logonPasswordResetMethods = require('logon/component/logonPasswordReset'),
        inspector = require('common/lib/ComponentInspector'),
        logonPasswordResetComponentName = 'logonPasswordResetComponent',
        logonPasswordResetViewName = 'logonPasswordReset',
        logger;
      /**
       * Init.
       */
      this.init = function() {
        logger = this.context.logger;
        // model initialization moved to ready because sessionStore isn't wired
        // until after init
      };
      /**
       * Ready.
       * @todo Please describe the return type of this method.
       */
      this.ready = function() {
        var session = this.sessionStore,
          /**
           * Get.
           * @param key
           * @todo Please describe the return type of this method.
           */
          get = function(key) {
            try {
              return session.get(key);
            } catch (sessionError) {
              logger.warn('invalid ' + key + ' in session:' + sessionError);
              session.remove(key);
              return null;
            }
          };
        this.model = observable.Model({
          'logonPasswordResetComponent': {
            authRoot: envConfig.config.authRoot,
            authUserIds: get('authUserIds'),
            password_reset_identify_option_id: 'social_security_number'
          }
        });
      };
      /**
       * Index.
       * @todo Please describe the return type of this method.
       */
      this.index = function() {
        this.register.components(this, [{
          name: logonPasswordResetComponentName,
          model: this.model.lens(logonPasswordResetComponentName),
          spec: logonPasswordResetSpec,
          methods: logonPasswordResetMethods
        }]);
        logger.debug('==== HELLO WORLD ====');
        return [this.components.logonPasswordResetComponent, logonPasswordResetViewName];
      };
      /**
       * Found.
       * @todo Please describe the return type of this method.
       */
      this.found = function() {
        this.register.components(this, [{
          name: logonPasswordResetComponentName,
          model: this.model.lens(logonPasswordResetComponentName),
          spec: logonPasswordResetSpec,
          methods: logonPasswordResetMethods
        }]);
        logger.debug('==== FOUND USER ID ====');
        return [this.components.logonPasswordResetComponent, 'logonUserIdFound'];
      };
      inspector(logonPasswordResetViewName, this);
    };
  });