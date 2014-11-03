define(function(require) {

	return function LogonPasswordResetController() {
		var observable = require('blue/observable'),
			logonPasswordResetSpec = require('bluespec/logon_password_reset'),
			logonPasswordResetMethods = require('logon/component/logonPasswordReset'),
			inspector = require('common/lib/ComponentInspector'),
			logonPasswordResetComponentName = 'logonPasswordResetComponent',
			logonPasswordResetViewName = 'logonPasswordReset',
			logger;

		this.init = function() {
			logger = this.context.logger;
			// model initialization moved to ready because sessionStore isn't wired
			// until after init
		};

		this.ready = function() {
			var session = this.sessionStore,
				get = function(key) {
					try {
						return session.get(key);
					} catch (sessionError) {
						logger.warn('invalid ' + key + ' in session:'  +  sessionError);
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
