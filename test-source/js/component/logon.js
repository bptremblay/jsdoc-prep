define(function(require) {
    var cookieMgr = require('logon/shared/cookieManager'),
        authClient = require('logon/shared/authClientApi'),
        is = require('blue/is'),
        userIdRegEx = /^[A-Za-z0-9_]+$/,
        logger;

    return {
        init: function() {
        	logger = this.context.logger;

            var userIdValue = cookieMgr.readCookie(this.settings.context.settings.get('usernameCookieName')),
                defaultPlaceholder = this.model.get().user_id_placeholder;

            this.rememberedUserId = userIdValue !== null && userIdValue.length > 0 ? userIdValue : null;
            this.rememberMyUserId = userIdValue.length > 0;

            this.model.lens('tmp_user_id_placeholder').set(defaultPlaceholder);
            if (this.rememberedUserId !== null) {
                this.model.get().user_id_placeholder = authClient.mask(this.rememberedUserId);
            }
            //Update temp rememberme cookie
            this.selectRememberMyUserId();
        },

        logonToLandingPage: function() {

            logger.debug('===== logonToLandingPage =====');

            var id = (this.userId !== null && this.userId !== '') ? this.userId : this.rememberedUserId;

            if (!this.validate(id)) {
                this.setStatus('inv');
                this.resetForm();
                return;
            }

            //Storing submitted user id in session for use in MFA flow.  (Independent of remember-me option)
            this.context.controller.sessionStore.set('tempId', id);

            authClient.lob = this.context.controller.settings.get('authLOB');
            authClient.siteId = envConfig.config.authSiteId || this.context.controller.settings.get('defaultAuthSiteId');
            authClient.userId = id;
            authClient.password = this.password;
            authClient.authenticate();
        },

        selectRememberMyUserId: function() {
            //TODO: resolve domain
            cookieMgr.writeCookie(this.getSetting('rememberMeCookieName'), this.rememberMyUserId ? '1' : '0');
        },

        resetForm: function() {
            this.password = '';
            this.userId = '';
            this.rememberedUserId = '';
            this.rememberMyUserId = 0;

            cookieMgr.writeCookie(this.context.controller.settings.get('usernameCookieName'), '', '.chase.com');
            this.selectRememberMyUserId();

            this.output.emit('state', {
                target: this,
                value: 'resetform',
                placeholder: this.model.get().tmp_user_id_placeholder
            });
        },

        setStatus: function(code) {
            var loginFailureCountModel = this.model.lens('loginFailureCount'),
                count = loginFailureCountModel.get();

            if ('number' === typeof count || count instanceof Number) {
                count++;
            } else {
                count = 1;
            }
            loginFailureCountModel.set(count);

            // show call 'call center' message if errorCount > 5
            if (count > this.getSetting('maxLoginFailureCount')) {
                code = 'loc';
            }
            this.output.emit('state', {
                target: this,
                value: 'valid',
                msgData: this.getErrorMessage(code)
            });
        },

        validate: function(id) {
            return userIdRegEx.test(id);
        },

        forgotPassword: function() {
        	this.context.logger.debug('===== forgotPassword =====');
        	this.context.controller.state('logon/forgot-password');
        },

        getSetting: function(name) {
            return this.settings.context.settings.get(name);
        },

        getErrorMessage: function(errorCode) {
            var msg = null,
                content = this.context.controller.dynamicContentUtil;

            if (is.string(errorCode)) {
                content.dynamicSettings.set(this, 'logon_to_landing_page_error', errorCode.toLowerCase());
                msg = this.model.get().logon_to_landing_page_error;
            }
            if (!msg || msg === '') {
                // Try to get a default.
                content.dynamicSettings.set(this, 'logon_to_landing_page_error', 'inv');
                msg = this.model.get().logon_to_landing_page_error;
            }
            return msg;
        }
    };
});
