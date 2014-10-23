define(function(require) {

	return function MfaController() {
		var observable = require('blue/observable'),
			logonIdSpec = require('bluespec/logon_identification'),
			logonIdMethods = require('logon/component/logonIdentification'),
			inspector = require('common/lib/ComponentInspector'),
			logonIdComponentName = 'logonIdComponent',
			logger;

		// ----- Initialization

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
						logger.warn('invalid ' + key + ' in session:' + sessionError);
						session.remove(key);
						return null;
					}
				};

			this.model = observable.Model({
				'logonIdComponent': {
					maskedPhoneNumber: '',
					identificationCode: '',
					password: '',
					authRoot: envConfig.config.authRoot,
					spid: get('spid'),
					otpPrefix: get('otpPrefix'),
					otpMethod: get('otpMethod'),
					otpEmailList: get('otpEmailList'),
					otpPhoneList: get('otpPhoneList')
				}
			});
		};

		// ----- Actions

		this.index = function(args) {

			logger.debug('==== entry mfa page ====');

			this.register.components(this, [{
				name: logonIdComponentName,
				model: this.model.lens(logonIdComponentName),
				spec: logonIdSpec,
				methods: logonIdMethods
			}]);

			var sessionStore = this.sessionStore,
				myspid;

			if (args && args.spid) {
				//TODO - this needs to be data sanatized - comes from query string param
				myspid = decodeURIComponent(args.spid);
				this.model.lens('logonIdComponent.spid').set(myspid);

				sessionStore.set('spid', myspid);
				sessionStore.remove('otpEmailList');
				sessionStore.remove('otpPhoneList');
				sessionStore.remove('otpPrefix');
				sessionStore.remove('otpMethod');
			}

			return [this.components.logonIdComponent, 'mfa'];
		};

		this.options = function() {

			logger.debug('==== options mfa page ====');

			this.register.components(this, [{
				name: logonIdComponentName,
				model: this.model.lens(logonIdComponentName),
				spec: logonIdSpec,
				methods: logonIdMethods
			}]);

			var sessionStore = this.sessionStore;
			sessionStore.remove('otpPrefix');
			sessionStore.remove('otpMethod');

			//TODO - move href attribute and = to properties file when = handling is fixed
			this.dynamicContentUtil.dynamicContent.set(this.components.logonIdComponent, 'request_identification_code_message', {
				linkid: 'provide_identification_code'
			});

			return [this.components.logonIdComponent, 'mfaOptions'];
		};

		this.submit = function(args) {

			logger.debug('==== submit mfa page ====');

			this.register.components(this, [{
				name: logonIdComponentName,
				model: this.model.lens(logonIdComponentName),
				spec: logonIdSpec,
				methods: logonIdMethods
			}]);

			if (args && args.status) {
				this.components.logonIdComponent.setSubmitError(args.status);
			}

			var model = this.model.lens(logonIdComponentName).get();
			this.components.logonIdComponent.setDeviceTypeHeader(model.otpMethod);

			//TODO - move href attribute and = to properties file when = handling is fixed
			this.dynamicContentUtil.dynamicContent.set(this.components.logonIdComponent, 'identification_code_not_received_message', {
				sendlinkid: 'request_new_identification_code'
			});

			return [this.components.logonIdComponent, 'mfaSubmit'];
		};

		inspector('mfa', this);
		inspector('mfaOptions', this);
		inspector('mfaSubmit', this);

	};
});
