define(function(require) {

    return function LogonController() {
        var observable = require('blue/observable'),
            logonSpec = require('bluespec/logon'),
            logonMethods = require('logon/component/logon'),
            inspector = require('common/lib/ComponentInspector'),
            logonComponentName = 'logonComponent',
            logonViewName = 'logon',
            loginFrameSrc = '',
			storeLens = require('logon/shared/storeLens'),
			lookupService = function(name) {
				var services = envConfig.config['blue/service'].services,
					service;
				for (var index = 0, len = services.length; index < len; index++) {
					service = services[index];
					if (service.name === name) {
						return service.urls[0];
					}
				}
				return undefined;
			},
			logger;

        // ----- Initialization

        this.init = function() {
        	logger = this.context.logger;
        };

        // ----- Actions

        this.index = function(args) {

            var setlocalValue,
                loginFailureCountModel;

			loginFrameSrc = lookupService('loginForm');

            /* NOTE: Local value is for temp mocking only */
            setlocalValue = sessionStorage.getItem('setlocal');
            if (setlocalValue > 0) {
                loginFrameSrc = 'https://dev8-secure.cig.chase.com/web/logon.html';
            }

            loginFailureCountModel = storeLens.lens(this.sessionStore, 'loginFailureCount');

            this.model = observable.Model.combine({
                'logonComponent': {
                    userId: '',
                    password: '',
                    rememberMyUserIdEnabled: false,
                    ASSETS_INDEX: envConfig.ASSETS_INDEX,
                    loginFrameSrc: loginFrameSrc,
                    tmp_user_id_placeholder: '',
                    loginFailureCount: loginFailureCountModel
                }
            });

            this.register.components(this, [{
                name: logonComponentName,
                model: this.model.lens(logonComponentName),
                spec: logonSpec,
                methods: logonMethods
            }]);

            if (args && args.status) {
                this.components.logonComponent.setStatus(args.status);
            } else {
				loginFailureCountModel.set(undefined);
			}

            return [this.components.logonComponent, logonViewName];
        };

        /* Temporary landing page for successful login */
        this.success = function(args) {
            var model = {
                args: args
            };
            return ['success', model];
        };

        inspector(logonViewName, this);
    };
});
